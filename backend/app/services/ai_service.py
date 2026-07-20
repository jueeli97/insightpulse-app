import time
import logging
from google import genai
from google.genai import errors as genai_errors
from app.config import GEMINI_API_KEY
from app.services import kpi_service, ml_service

logger = logging.getLogger(__name__)

client = genai.Client(api_key=GEMINI_API_KEY)
#MODEL = "gemini-2.0-flash-lite"
#MODEL = "gemini-1.5-flash"
MODEL = "gemini-2.5-flash-lite"


def build_business_context(df) -> str:
    """Pull all KPI + ML data and format as structured context for Gemini."""
    revenue_trend = kpi_service.calc_revenue_trend(df)
    aov = kpi_service.calc_aov(df)
    top_customers = kpi_service.calc_top_customers(df, n=5)
    channels = kpi_service.calc_revenue_by_channel(df)
    categories = kpi_service.calc_category_performance(df)

    churn = ml_service.predict_churn(df)
    segments = ml_service.segment_customers(df)
    ltv = ml_service.predict_ltv(df)
    anomalies = ml_service.detect_anomalies(df)
    anomaly_days = [d for d in anomalies if d["is_anomaly"] == 1]

    return f"""
BUSINESS DATA SUMMARY FOR AI ANALYSIS:

=== REVENUE TREND (Monthly) ===
{revenue_trend}

=== AVERAGE ORDER VALUE ===
Overall AOV: ${aov['overall_aov']}
By Channel: {aov['by_channel']}

=== TOP 5 CUSTOMERS BY REVENUE ===
{top_customers}

=== CHANNEL PERFORMANCE ===
{channels}

=== CATEGORY PERFORMANCE ===
{categories}

=== CHURN RISK (Top At-Risk Customers) ===
{churn[:5]}

=== CUSTOMER SEGMENTS ===
{segments}

=== LTV PREDICTIONS ===
{ltv[:5]}

=== ANOMALY DAYS DETECTED ===
{anomaly_days if anomaly_days else "No anomalies detected"}
"""


def _call_gemini(prompt: str, max_retries: int = 2) -> str:
    """Call Gemini with retry logic. Raises RuntimeError with a clear message on failure."""
    last_exc = None
    for attempt in range(max_retries + 1):
        try:
            response = client.models.generate_content(
                model=MODEL,
                contents=prompt
            )
            return response.text
        except genai_errors.ClientError as e:
            # 429 rate limit / quota
            if e.code == 429:
                last_exc = e
                retry_delay = 6
                if attempt < max_retries:
                    logger.warning(
                        f"Gemini rate limit (attempt {attempt + 1}/{max_retries + 1}). "
                        f"Retrying in {retry_delay}s..."
                    )
                    time.sleep(retry_delay)
                else:
                    logger.error("Gemini quota exhausted after retries.")
            elif e.code == 401 or e.code == 403:
                raise RuntimeError(
                    "Gemini API key is invalid or unauthorized. "
                    "Go to https://aistudio.google.com/app/apikey, create a new auth key, "
                    "and update GEMINI_API_KEY in your .env file."
                ) from e
            else:
                raise RuntimeError(f"Gemini API error {e.code}: {e.message}") from e
        except Exception as e:
            raise RuntimeError(f"Unexpected error calling Gemini: {str(e)}") from e

    raise RuntimeError(
        "The AI service is temporarily unavailable due to API quota limits. "
        "Please wait a few minutes and try again, or check your quota at https://ai.dev/rate-limit"
    )


def generate_executive_summary(df) -> str:
    context = build_business_context(df)
    prompt = f"""
You are a senior business analyst at a top e-commerce company.
Based on the following business data, write a clear executive summary
for a non-technical business owner.

Cover:
1. Overall business health (revenue trend)
2. Best performing channels and categories
3. Customer insights (top customers, segments)
4. Key risks (churn, anomalies)
5. Top 3 recommended actions

Keep it concise, clear, and actionable. No technical jargon.

{context}
"""
    return _call_gemini(prompt)


def generate_root_cause_analysis(df, metric: str) -> str:
    context = build_business_context(df)
    prompt = f"""
You are a senior data scientist at a top e-commerce company.
A business stakeholder wants to understand: "{metric}"

Using the business data below, provide:
1. What the data shows about this topic
2. Likely root causes based on the patterns
3. Which customer segments or channels are most affected
4. Specific recommended actions to address it

Be specific, cite the actual numbers from the data, and keep it actionable.

{context}
"""
    return _call_gemini(prompt)


def answer_business_question(df, question: str) -> str:
    context = build_business_context(df)
    prompt = f"""
You are an AI business analyst with access to a company's complete
sales and customer data.

The business user asks: "{question}"

Using only the data provided below, give a direct, specific answer.
- Cite actual numbers from the data
- Be concise (3-5 sentences max unless detail is needed)
- End with one clear recommendation

{context}
"""
    return _call_gemini(prompt)


def generate_recommendations(df) -> str:
    context = build_business_context(df)
    prompt = f"""
You are a growth consultant analyzing an e-commerce business.
Based on the data below, give exactly 5 prioritized recommendations.

Format each as:
PRIORITY [number]: [Title]
Why: [one sentence explanation with specific numbers]
Action: [one specific thing to do this week]

Focus on highest impact actions first.

{context}
"""
    return _call_gemini(prompt)
