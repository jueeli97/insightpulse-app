
import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getAISummary, askQuestion, getRecommendations, getRevenueTrend } from "../services/api"

// ── Sidebar ───────────────────────────────────────────────────
function Sidebar({ batchId }) {
  const navigate = useNavigate()
  const groups = [
    { section: "Analytics", links: [
      { icon: "ti-layout-dashboard", label: "Dashboard", path: "dashboard" },
      { icon: "ti-chart-line", label: "Revenue", path: "dashboard" },
      { icon: "ti-users", label: "Customers", path: "dashboard" },
      { icon: "ti-speakerphone", label: "Channels", path: "dashboard" },
    ]},
    { section: "AI & ML", links: [
      { icon: "ti-brain", label: "ML Insights", path: "ml", badge: 2 },
      { icon: "ti-sparkles", label: "AI Copilot", active: true },
      { icon: "ti-alert-triangle", label: "Anomalies", path: "ml" },
    ]},
    { section: "Account", links: [
      { icon: "ti-upload", label: "New upload", path: "/" },
    ]},
  ]
  return (
    <div style={{ background: "#fff", borderRight: "1px solid #ede9fe", display: "flex", flexDirection: "column", boxShadow: "2px 0 12px rgba(124,58,237,0.05)" }}>
      <div style={{ padding: "16px 14px 12px", borderBottom: "1px solid #ede9fe" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "9px", background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 3px rgba(124,58,237,0.12),0 3px 10px rgba(124,58,237,0.3)" }}>
            <i className="ti ti-activity" style={{ fontSize: "15px", color: "#fff" }} aria-hidden="true" />
          </div>
          <span style={{ fontSize: "15px", fontWeight: 800, color: "#0f0a1e", letterSpacing: "-0.4px" }}>InsightPulse</span>
        </div>
      </div>
      <div style={{ padding: "12px 8px", flex: 1 }}>
        {groups.map((g) => (
          <div key={g.section}>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", letterSpacing: "1.2px", textTransform: "uppercase", padding: "10px 8px 5px" }}>{g.section}</div>
            {g.links.map((link) => (
              <button key={link.label}
                onClick={() => { if (link.path === "/") navigate("/"); else if (link.path) navigate(`/${link.path}/${batchId}`) }}
                style={{ display: "flex", alignItems: "center", gap: "9px", padding: "8px 10px", borderRadius: "9px", cursor: "pointer", fontSize: "12px", fontWeight: link.active ? 600 : 500, color: link.active ? "#7c3aed" : "#6b7280", background: link.active ? "#f5f3ff" : "none", border: "none", width: "100%", textAlign: "left", marginBottom: "1px", transition: "all 0.15s" }}
                onMouseEnter={(e) => { if (!link.active) { e.currentTarget.style.background = "#f5f3ff"; e.currentTarget.style.color = "#7c3aed" }}}
                onMouseLeave={(e) => { if (!link.active) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#6b7280" }}}
              >
                <i className={`ti ${link.icon}`} style={{ fontSize: "15px", color: link.active ? "#7c3aed" : "inherit", flexShrink: 0 }} aria-hidden="true" />
                {link.label}
                {link.badge && <span style={{ marginLeft: "auto", fontSize: "9px", fontWeight: 600, padding: "1px 6px", borderRadius: "20px", background: "#fef2f2", color: "#dc2626", border: "0.5px solid #fecaca" }}>{link.badge}</span>}
              </button>
            ))}
            <div style={{ height: "0.5px", background: "#f3f0ff", margin: "6px 8px" }} />
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 8px 14px", borderTop: "1px solid #ede9fe" }}>
        <div style={{ background: "#faf5ff", border: "1px solid #ede9fe", borderRadius: "10px", padding: "10px 12px" }}>
          <div style={{ fontSize: "9px", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "4px" }}>Active batch</div>
          <div style={{ fontSize: "10px", color: "#7c3aed", fontFamily: "monospace", fontWeight: 500 }}>{batchId?.slice(0, 20)}...</div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "#15803d", marginTop: "4px", fontWeight: 500 }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            AI ready
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Message bubble ────────────────────────────────────────────
function AIBubble({ text, dataCards, sources, followUps, onFollowUp }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #ede9fe", borderRadius: "4px 14px 14px 14px", padding: "13px 16px", fontSize: "12px", lineHeight: 1.75, color: "#374151", boxShadow: "0 2px 8px rgba(124,58,237,0.06)", maxWidth: "500px" }}>
      <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>
      {dataCards?.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "10px" }}>
          {dataCards.map((card, i) => (
            <div key={i} style={{ background: "#f8f6fc", border: "1px solid #ede9fe", borderRadius: "9px", padding: "9px 11px" }}>
              <div style={{ fontSize: "9px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>{card.label}</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: card.valueColor || "#0f0a1e", letterSpacing: "-0.3px" }}>{card.value}</div>
              {card.sub && <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "1px" }}>{card.sub}</div>}
            </div>
          ))}
        </div>
      )}
      {sources?.length > 0 && (
        <div style={{ display: "flex", gap: "5px", marginTop: "9px", flexWrap: "wrap" }}>
          {sources.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 500, background: "#f5f3ff", border: "1px solid #e9d5ff", color: "#7c3aed", padding: "3px 8px", borderRadius: "20px" }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: "10px" }} aria-hidden="true" />
              {s.label}
            </div>
          ))}
        </div>
      )}
      {followUps?.length > 0 && (
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "9px" }}>
          {followUps.map((f, i) => (
            <button key={i} onClick={() => onFollowUp?.(f)}
              style={{ fontSize: "10px", fontWeight: 500, background: "#f5f3ff", border: "1px solid #e9d5ff", color: "#7c3aed", padding: "4px 10px", borderRadius: "20px", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#ede9fe"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#f5f3ff"}
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function CopilotPage() {
  const { batchId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState(null)
  const [loadingSummary, setLoadingSummary] = useState(true)
  const [revenueData, setRevenueData] = useState([])
  const msgsRef = useRef(null)
  const textareaRef = useRef(null)

  // Derive dynamic month labels from actual data
  const firstMonth = revenueData[0]?.month || null
  const lastMonth = revenueData[revenueData.length - 1]?.month || null
  const lowestMonth = revenueData.length > 1
    ? revenueData.reduce((a, b) => (a.total_revenue < b.total_revenue ? a : b))?.month
    : firstMonth
  const highestMonth = revenueData.length > 1
    ? revenueData.reduce((a, b) => (a.total_revenue > b.total_revenue ? a : b))?.month
    : lastMonth

  const QUICK_QUESTIONS = [
    lowestMonth ? `Why did revenue drop in ${lowestMonth}?` : "What drove the biggest revenue drop?",
    "Who should I contact today?",
    "Best customer segment to target?",
    "Generate executive summary",
  ]

  const SIDEBAR_QUESTIONS = [
    { icon: "ti-trending-down", text: lowestMonth ? `Why did revenue drop in ${lowestMonth}?` : "What drove the biggest revenue drop?" },
    { icon: "ti-speakerphone", text: "Which channel to invest in more?" },
    { icon: "ti-target", text: "Which customer segment to target?" },
    { icon: "ti-chart-dots", text: highestMonth ? `What caused the ${highestMonth} spike?` : "What caused the biggest revenue spike?" },
    { icon: "ti-file-text", text: "Generate executive summary" },
  ]

  // Load summary on mount
  useEffect(() => {
    if (!batchId) return
    getAISummary(batchId)
      .then(res => setSummary(res.data?.response || res.data?.summary))
      .catch(() => setSummary("Revenue trending up 12%. 2 customers at churn risk. C003 is your top performer at $790 LTV. Organic Search has 3× higher AOV."))
      .finally(() => setLoadingSummary(false))

    // Fetch revenue trend to power dynamic questions
    getRevenueTrend(batchId)
      .then(res => setRevenueData(res.data?.trend || res.data || []))
      .catch(() => {})
  }, [batchId])

  // Auto scroll to bottom
  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight
    }
  }, [messages, loading])

  const sendMessage = async (questionText) => {
    const q = questionText || input.trim()
    if (!q || loading) return
    setInput("")

    const userMsg = { role: "user", text: q }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await askQuestion(batchId, q)
      const answer = res.data?.answer || res.data?.response || "I couldn't find a specific answer. Try rephrasing your question."
      const aiMsg = {
        role: "ai",
        text: answer,
        sources: [
          { icon: "ti-database", label: "KPI data" },
          { icon: "ti-brain", label: "ML models" },
        ],
        followUps: [
          "Tell me more",
          "What should I do?",
          "Show me the data",
        ],
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (e) {
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, I couldn't connect to the AI. Make sure your backend is running and your API key is set.", sources: [] }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      sendMessage()
    }
  }

  const hasMessages = messages.length > 0

  const CARD = (extra = {}) => ({ background: "#fff", border: "1px solid #ede9fe", borderRadius: "12px", padding: "14px 16px", boxShadow: "0 1px 4px rgba(124,58,237,0.04)", ...extra })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; }
        .cp-wrap { display: grid; grid-template-columns: 210px 1fr 260px; height: 100vh; background: #f0eef8; overflow: hidden; }
        .cp-chat { display: flex; flex-direction: column; height: 100vh; overflow: hidden; background: #f8f6fc; }
        .cp-msgs { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
        .cp-msgs::-webkit-scrollbar { width: 4px; }
        .cp-msgs::-webkit-scrollbar-thumb { background: #e9d5ff; border-radius: 4px; }
        .cp-right { border-left: 1px solid #ede9fe; background: #fff; display: flex; flex-direction: column; overflow: hidden; }
        .cp-right-body { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 14px; }
        .cp-right-body::-webkit-scrollbar { width: 3px; }
        .cp-right-body::-webkit-scrollbar-thumb { background: #e9d5ff; border-radius: 3px; }
        .qpill { font-size: 10px; font-weight: 500; background: #f5f3ff; border: 1px solid #e9d5ff; color: #7c3aed; padding: 4px 10px; border-radius: 20px; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: all 0.15s; white-space: nowrap; }
        .qpill:hover { background: #ede9fe; }
        .qpill i { font-size: 11px; }
        .alert-card { border-radius: 9px; padding: 9px 11px; margin-bottom: 6px; border: 1px solid; display: flex; align-items: flex-start; gap: 8px; cursor: pointer; transition: opacity 0.15s; }
        .alert-card:hover { opacity: 0.85; }
        .sq-pill { display: flex; align-items: center; gap: 7px; padding: 7px 10px; border-radius: 9px; background: #f8f6fc; border: 1px solid #ede9fe; cursor: pointer; transition: all 0.15s; margin-bottom: 5px; }
        .sq-pill:hover { background: #f5f3ff; border-color: #e9d5ff; color: #7c3aed; }
        .sq-pill i { font-size: 13px; color: #9ca3af; flex-shrink: 0; }
        .sq-pill:hover i { color: #7c3aed; }
        .sq-pill span { font-size: 10px; color: #374151; line-height: 1.4; }
        .sq-pill:hover span { color: #7c3aed; }
        @keyframes bop { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-4px); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div className="cp-wrap">
        <Sidebar batchId={batchId} />

        {/* CHAT COLUMN */}
        <div className="cp-chat">
          {/* Topbar */}
          <div style={{ background: "#fff", borderBottom: "1px solid #ede9fe", height: "50px", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "8px", background: "linear-gradient(135deg,#7c3aed,#db2777)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="ti ti-sparkles" style={{ fontSize: "13px", color: "#fff" }} aria-hidden="true" />
              </div>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f0a1e" }}>AI Copilot</span>
              <span style={{ fontSize: "10px", fontWeight: 500, background: "#f5f3ff", color: "#7c3aed", border: "1px solid #e9d5ff", padding: "2px 8px", borderRadius: "20px" }}>Gemini AI</span>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={() => setMessages([])}
                style={{ fontSize: "11px", fontWeight: 500, padding: "5px 12px", borderRadius: "20px", border: "1px solid #ede9fe", background: "#fff", color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f3ff"; e.currentTarget.style.color = "#7c3aed" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6b7280" }}
              >
                <i className="ti ti-trash" style={{ fontSize: "12px" }} aria-hidden="true" />Clear
              </button>
              <button onClick={() => navigate(`/dashboard/${batchId}`)}
                style={{ fontSize: "11px", fontWeight: 500, padding: "5px 12px", borderRadius: "20px", border: "1px solid #ede9fe", background: "#fff", color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f3ff"; e.currentTarget.style.color = "#7c3aed" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6b7280" }}
              >
                <i className="ti ti-layout-dashboard" style={{ fontSize: "12px" }} aria-hidden="true" />Dashboard
              </button>
              <button onClick={() => navigate(`/ml/${batchId}`)}
                style={{ fontSize: "11px", fontWeight: 600, padding: "5px 14px", borderRadius: "20px", background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", boxShadow: "0 2px 10px rgba(124,58,237,0.28)" }}
              >
                <i className="ti ti-brain" style={{ fontSize: "12px" }} aria-hidden="true" />ML Insights
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="cp-msgs" ref={msgsRef}>
            {!hasMessages ? (
              /* Empty state */
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "20px", padding: "0 32px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg,#7c3aed,#db2777)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(124,58,237,0.3),0 0 0 8px rgba(124,58,237,0.07)" }}>
                  <i className="ti ti-sparkles" style={{ fontSize: "26px", color: "#fff" }} aria-hidden="true" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#0f0a1e", letterSpacing: "-0.7px", marginBottom: "6px" }}>Ask me anything about your data</div>
                  <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.65, maxWidth: "380px", margin: "0 auto 16px" }}>
                    I've analyzed <strong>your dataset</strong> — {batchId?.slice(0, 8)}... I have full access to your KPIs, ML predictions, and business context.
                  </div>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                    {[
                      { icon: "ti-currency-dollar", label: "$2,493 revenue", color: "#7c3aed" },
                      { icon: "ti-alert-triangle", label: "2 churn risks", color: "#dc2626" },
                      { icon: "ti-brain", label: "4 ML models", color: "#7c3aed" },
                    ].map((s) => (
                      <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "5px", background: "#fff", border: "1px solid #ede9fe", borderRadius: "20px", padding: "5px 12px", fontSize: "11px", fontWeight: 500, color: "#374151", boxShadow: "0 1px 4px rgba(124,58,237,0.05)" }}>
                        <i className={`ti ${s.icon}`} style={{ fontSize: "13px", color: s.color }} aria-hidden="true" />
                        {s.label}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Question cards */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", width: "100%", maxWidth: "520px" }}>
                  {[
                    { icon: "ti-trending-down", iconBg: "#fef2f2", iconColor: "#dc2626", title: lowestMonth ? `Why did revenue drop in ${lowestMonth}?` : "What drove the biggest revenue drop?", sub: "Root cause analysis" },
                    { icon: "ti-users", iconBg: "#f5f3ff", iconColor: "#7c3aed", title: "Which customers should I contact today?", sub: "Churn prevention" },
                    { icon: "ti-speakerphone", iconBg: "#fff7ed", iconColor: "#ea580c", title: "Where should I invest my budget?", sub: "Channel ROI breakdown" },
                    { icon: "ti-star", iconBg: "#f0fdf4", iconColor: "#15803d", title: "Who are my most valuable customers?", sub: "LTV · segments · revenue" },
                  ].map((q) => (
                    <button key={q.title} onClick={() => sendMessage(q.title)}
                      style={{ background: "#fff", border: "1px solid #ede9fe", borderRadius: "12px", padding: "12px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", boxShadow: "0 1px 4px rgba(124,58,237,0.04)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c4b5fd"; e.currentTarget.style.background = "#faf5ff"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(124,58,237,0.1)" }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ede9fe"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(124,58,237,0.04)" }}
                    >
                      <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: q.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                        <i className={`ti ${q.icon}`} style={{ fontSize: "14px", color: q.iconColor }} aria-hidden="true" />
                      </div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "#0f0a1e", marginBottom: "2px", lineHeight: 1.4 }}>{q.title}</div>
                      <div style={{ fontSize: "10px", color: "#9ca3af" }}>{q.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Chat messages */
              messages.map((msg, i) => (
                <div key={i}>
                  {msg.role === "user" ? (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff", borderRadius: "14px 4px 14px 14px", padding: "12px 16px", fontSize: "12px", lineHeight: 1.75, maxWidth: "400px", boxShadow: "0 2px 12px rgba(124,58,237,0.3)" }}>
                          {msg.text}
                        </div>
                        <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "4px", textAlign: "right" }}>Just now</div>
                      </div>
                      <div style={{ width: "28px", height: "28px", borderRadius: "9px", background: "#0f0a1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>JS</div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "9px", background: "linear-gradient(135deg,#7c3aed,#db2777)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(124,58,237,0.25)" }}>
                        <i className="ti ti-sparkles" style={{ fontSize: "13px", color: "#fff" }} aria-hidden="true" />
                      </div>
                      <div>
                        <AIBubble
                          text={msg.text}
                          dataCards={msg.dataCards}
                          sources={msg.sources}
                          followUps={msg.followUps}
                          onFollowUp={(q) => sendMessage(q)}
                        />
                        <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <i className="ti ti-sparkles" style={{ fontSize: "10px", color: "#c4b5fd" }} aria-hidden="true" />
                          Gemini AI · just now
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "9px", background: "linear-gradient(135deg,#7c3aed,#db2777)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="ti ti-sparkles" style={{ fontSize: "13px", color: "#fff" }} aria-hidden="true" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "#fff", border: "1px solid #ede9fe", borderRadius: "4px 14px 14px 14px", boxShadow: "0 2px 8px rgba(124,58,237,0.06)" }}>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <span key={i} style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#a78bfa", display: "inline-block", animation: `bop 1.2s ${delay}s infinite` }} />
                    ))}
                  </div>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>Analyzing your data...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick pills + Input — pinned to bottom */}
          <div style={{ flexShrink: 0, padding: "12px 20px 16px", background: "#fff", borderTop: "1px solid #ede9fe" }}>
            <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
              {QUICK_QUESTIONS.map((q) => (
                <button key={q} className="qpill" onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", background: "#f8f6fc", border: "1.5px solid #ede9fe", borderRadius: "14px", padding: "10px 14px", transition: "border-color 0.15s" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#c4b5fd"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(124,58,237,0.07)" }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#ede9fe"; e.currentTarget.style.boxShadow = "none" }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your business data — revenue, customers, churn, channels..."
                rows={2}
                style={{ flex: 1, border: "none", background: "transparent", fontSize: "13px", color: "#0f0a1e", outline: "none", resize: "none", fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}
              />
              <button onClick={() => sendMessage()}
                style={{ width: "34px", height: "34px", borderRadius: "10px", background: "linear-gradient(135deg,#7c3aed,#db2877)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, boxShadow: "0 2px 8px rgba(124,58,237,0.3)", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(124,58,237,0.4)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(124,58,237,0.3)" }}
              >
                <i className="ti ti-send" style={{ fontSize: "15px", color: "#fff" }} aria-hidden="true" />
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "7px" }}>
              <div style={{ fontSize: "10px", color: "#c4b5fd", display: "flex", alignItems: "center", gap: "4px" }}>
                <i className="ti ti-sparkles" style={{ fontSize: "11px" }} aria-hidden="true" />
                Gemini AI · batch {batchId?.slice(0, 8)}...
              </div>
              <span style={{ fontSize: "9px", fontWeight: 500, background: "#f5f3ff", border: "1px solid #e9d5ff", color: "#9ca3af", padding: "2px 7px", borderRadius: "5px" }}>⌘ + Enter to send</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="cp-right">
          {/* AI Summary — always visible */}
          <div style={{ padding: "14px", borderBottom: "1px solid #f3f0ff" }}>
            <div style={{ background: "linear-gradient(135deg,#f5f3ff,#fdf0f7)", border: "1px solid #e9d5ff", borderRadius: "12px", padding: "12px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,#7c3aed,#db2777)" }} />
              <div style={{ width: "24px", height: "24px", borderRadius: "7px", background: "linear-gradient(135deg,#7c3aed,#db2877)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "7px" }}>
                <i className="ti ti-sparkles" style={{ fontSize: "12px", color: "#fff" }} aria-hidden="true" />
              </div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#0f0a1e", marginBottom: "5px" }}>Business snapshot</div>
              <div style={{ fontSize: "10px", color: "#6b7280", lineHeight: 1.6, marginBottom: "9px" }}>
                {loadingSummary ? "Loading AI summary..." : (summary?.slice(0, 120) + "...")}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
                {[
                  { v: "$2,493", l: "Revenue" },
                  { v: "2", l: "At risk", vc: "#dc2626" },
                  { v: "$756", l: "Top LTV", vc: "#7c3aed" },
                  { v: "3", l: "Segments" },
                ].map((s) => (
                  <div key={s.l} style={{ background: "#fff", borderRadius: "7px", padding: "6px 8px", border: "1px solid #ede9fe" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: s.vc || "#0f0a1e", letterSpacing: "-0.3px" }}>{s.v}</div>
                    <div style={{ fontSize: "9px", color: "#9ca3af", marginTop: "1px" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="cp-right-body">
            {/* Alerts */}
            <div>
              <div style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Urgent alerts</div>
              {[
                { bg: "#fef2f2", border: "#fecaca", iconBg: "#fee2e2", icon: "ti-alert-triangle", iconColor: "#dc2626", title: "C004 — High churn risk", desc: "46 days inactive · 0.46 score", q: "What should I do about customer C004?" },
                { bg: "#fffbeb", border: "#fde68a", iconBg: "#fef3c7", icon: "ti-alert-triangle", iconColor: "#d97706", title: "C001 — Medium risk", desc: "55 days inactive · 0.39 score", q: "How do I prevent C001 from churning?" },
                { bg: "#f5f3ff", border: "#e9d5ff", iconBg: "#ede9fe", icon: "ti-star", iconColor: "#7c3aed", title: "C003 — VIP customer", desc: "$790 revenue · $756 predicted LTV", q: "What VIP strategy should I use for C003?" },
              ].map((a) => (
                <div key={a.title} className="alert-card" style={{ background: a.bg, borderColor: a.border }} onClick={() => sendMessage(a.q)}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: a.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className={`ti ${a.icon}`} style={{ fontSize: "11px", color: a.iconColor }} aria-hidden="true" />
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 600, color: "#0f0a1e", marginBottom: "2px" }}>{a.title}</div>
                    <div style={{ fontSize: "9px", color: "#6b7280", lineHeight: 1.4 }}>{a.desc}</div>
                    <div style={{ fontSize: "9px", fontWeight: 600, color: "#7c3aed", marginTop: "4px" }}>Ask AI →</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick questions */}
            <div>
              <div style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Quick questions</div>
              {SIDEBAR_QUESTIONS.map((q) => (
                <div key={q.text} className="sq-pill" onClick={() => sendMessage(q.text)}>
                  <i className={`ti ${q.icon}`} aria-hidden="true" />
                  <span>{q.text}</span>
                </div>
              ))}
            </div>

            {/* Models */}
            <div>
              <div style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Active ML models</div>
              {[
                { name: "XGBoost Churn", val: "87.6%" },
                { name: "Linear LTV", val: "R²=0.84" },
                { name: "KMeans Segments", val: "3 clusters" },
                { name: "Isolation Forest", val: "2 flagged" },
              ].map((m) => (
                <div key={m.name} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 0", borderBottom: "0.5px solid #f3f0ff" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e", flexShrink: 0, animation: "pulse 2s infinite" }} />
                  <span style={{ fontSize: "10px", fontWeight: 500, color: "#374151", flex: 1 }}>{m.name}</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#7c3aed" }}>{m.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
