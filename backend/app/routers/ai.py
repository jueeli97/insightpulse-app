from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services import kpi_service, ai_service

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def load_df(batch_id: str, db: Session):
    df = kpi_service.get_dataframe(db, batch_id)
    if df.empty:
        raise HTTPException(
            status_code=404,
            detail=f"No data found for batch_id: {batch_id}"
        )
    return df

# Request body for Q&A and root cause
class QuestionRequest(BaseModel):
    batch_id: str
    question: str

class RootCauseRequest(BaseModel):
    batch_id: str
    metric: str


@router.get("/summary")
def executive_summary(batch_id: str, db: Session = Depends(get_db)):
    """Auto-generate a full business summary from the data."""
    df = load_df(batch_id, db)
    summary = ai_service.generate_executive_summary(df)
    return {
        "batch_id": batch_id,
        "type": "executive_summary",
        "response": summary
    }


@router.post("/ask")
def ask_question(request: QuestionRequest, db: Session = Depends(get_db)):
    """Ask any business question in plain English."""
    df = load_df(request.batch_id, db)
    answer = ai_service.answer_business_question(df, request.question)
    return {
        "batch_id": request.batch_id,
        "question": request.question,
        "answer": answer
    }


@router.post("/root-cause")
def root_cause(request: RootCauseRequest, db: Session = Depends(get_db)):
    """Analyze the root cause of a specific business problem."""
    df = load_df(request.batch_id, db)
    analysis = ai_service.generate_root_cause_analysis(df, request.metric)
    return {
        "batch_id": request.batch_id,
        "metric": request.metric,
        "analysis": analysis
    }


@router.get("/recommendations")
def recommendations(batch_id: str, db: Session = Depends(get_db)):
    """Get top 5 prioritized business recommendations."""
    df = load_df(batch_id, db)
    recs = ai_service.generate_recommendations(df)
    return {
        "batch_id": batch_id,
        "type": "recommendations",
        "recommendations": recs
    }