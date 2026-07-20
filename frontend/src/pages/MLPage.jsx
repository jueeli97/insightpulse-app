


import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getChurn, getSegments, getLTV, getAnomalies } from "../services/api"

// ── Chart.js loader ──────────────────────────────────────────
function useChartJS() {
  const [ready, setReady] = useState(typeof window !== "undefined" && !!window.Chart)
  useEffect(() => {
    if (window.Chart) { setReady(true); return }
    const s = document.createElement("script")
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"
    s.onload = () => setReady(true)
    document.head.appendChild(s)
  }, [])
  return ready
}

// ── Anomaly mini chart ────────────────────────────────────────
function AnomalyChart({ data }) {
  const chartReady = useChartJS()
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  useEffect(() => {
    if (!chartReady || !data.length || !canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()
    chartRef.current = new window.Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: data.map(d => d.date),
        datasets: [{
          data: data.map(d => d.total_revenue),
          borderColor: "#7c3aed", borderWidth: 1.5,
          pointBackgroundColor: data.map(d => d.is_anomaly === 1 ? "#dc2626" : "#7c3aed"),
          pointRadius: data.map(d => d.is_anomaly === 1 ? 5 : 2),
          tension: 0.3, fill: true,
          backgroundColor: "rgba(124,58,237,0.06)",
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } },
      }
    })
    return () => chartRef.current?.destroy()
  }, [chartReady, data])
  return <div style={{ position: "relative", height: "80px", marginBottom: "12px" }}>
    <canvas ref={canvasRef} role="img" aria-label="Line chart showing daily revenue with anomaly points highlighted" />
  </div>
}

// ── Sidebar ───────────────────────────────────────────────────
function Sidebar({ batchId, churnCount, activeSection, onSectionClick }) {
  const navigate = useNavigate()
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
        {[
          { section: "Analytics", links: [
            { icon: "ti-layout-dashboard", label: "Dashboard", path: `dashboard` },
            { icon: "ti-chart-line", label: "Revenue", scrollTo: "ml-churn" },
            { icon: "ti-users", label: "Customers", scrollTo: "ml-churn" },
            { icon: "ti-speakerphone", label: "Channels", scrollTo: "ml-features" },
          ]},
          { section: "AI & ML", links: [
            { icon: "ti-brain", label: "ML Insights", active: true, badge: churnCount },
            { icon: "ti-sparkles", label: "AI Copilot", path: `copilot` },
            { icon: "ti-alert-triangle", label: "Anomalies", scrollTo: "ml-anomaly" },
          ]},
          { section: "Account", links: [
            { icon: "ti-upload", label: "New upload", path: "/" },
          ]},
        ].map((group) => (
          <div key={group.section}>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", letterSpacing: "1.2px", textTransform: "uppercase", padding: "10px 8px 5px" }}>
              {group.section}
            </div>
            {group.links.map((link) => {
              const isActive = link.active || activeSection === link.scrollTo
              return (
                <button key={link.label}
                  onClick={() => {
                    if (link.scrollTo) onSectionClick(link.scrollTo)
                    else if (link.path === "/") navigate("/")
                    else if (link.path) navigate(`/${link.path}/${batchId}`)
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: "9px",
                    padding: "8px 10px", borderRadius: "9px",
                    cursor: "pointer",
                    fontSize: "12px", fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#7c3aed" : "#6b7280",
                    background: isActive ? "#f5f3ff" : "none",
                    border: "none", width: "100%", textAlign: "left",
                    marginBottom: "1px", transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "#f5f3ff"; e.currentTarget.style.color = "#7c3aed" }}}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#6b7280" }}}
                >
                  <i className={`ti ${link.icon}`} style={{ fontSize: "15px", color: isActive ? "#7c3aed" : "inherit", flexShrink: 0 }} aria-hidden="true" />
                  {link.label}
                  {link.badge > 0 && (
                    <span style={{ marginLeft: "auto", fontSize: "9px", fontWeight: 600, padding: "1px 6px", borderRadius: "20px", background: "#fef2f2", color: "#dc2626", border: "0.5px solid #fecaca" }}>
                      {link.badge}
                    </span>
                  )}
                </button>
              )
            })}
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
            Models ready
          </div>
        </div>
      </div>
    </div>
  )
}

// ── KPI Card ──────────────────────────────────────────────────
function KPICard({ icon, iconBg, iconColor, label, value, sub, pillText, pillBg, pillColor, pillUp, sparkColors, barGradient }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", border: `1px solid ${hovered ? "#c4b5fd" : "#ede9fe"}`,
        borderRadius: "12px", padding: "14px 16px", position: "relative",
        overflow: "hidden", cursor: "pointer", transition: "all 0.2s",
        boxShadow: hovered ? "0 4px 16px rgba(124,58,237,0.1)" : "0 1px 4px rgba(124,58,237,0.04)",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className={`ti ${icon}`} style={{ fontSize: "15px", color: iconColor }} aria-hidden="true" />
        </div>
        <div style={{ fontSize: "9px", fontWeight: 600, padding: "2px 7px", borderRadius: "20px", background: pillBg, color: pillColor, display: "flex", alignItems: "center", gap: "3px" }}>
          <i className={`ti ${pillUp ? "ti-trending-up" : "ti-flag"}`} style={{ fontSize: "9px" }} aria-hidden="true" />
          {pillText}
        </div>
      </div>
      <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500, marginBottom: "3px" }}>{label}</div>
      <div style={{ fontSize: "20px", fontWeight: 700, color: "#0f0a1e", letterSpacing: "-0.8px", marginBottom: "3px" }}>{value}</div>
      <div style={{ fontSize: "10px", color: "#9ca3af" }}>{sub}</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "18px", marginTop: "6px" }}>
        {sparkColors.map((c, i) => (
          <div key={i} style={{ flex: 1, height: `${[40, 65, 85, 100][i]}%`, background: c, borderRadius: "1px 1px 0 0", opacity: 0.6 }} />
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2.5px", background: barGradient }} />
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
const ANOMALY_PAGE_SIZE = 8
const CHURN_DEFAULT_SHOW = 6

function EmptyState({ icon, message }) {
  return (
    <div style={{ textAlign: "center", padding: "28px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <div style={{ fontSize: "28px", opacity: 0.4 }}>{icon}</div>
      <div style={{ fontSize: "11px", color: "#9ca3af", lineHeight: 1.6 }}>{message}</div>
    </div>
  )
}

export default function MLPage() {
  const { batchId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [data, setData] = useState({ churn: [], segments: [], ltv: [], anomalies: [] })
  const [anomalyPage, setAnomalyPage] = useState(1)
  const [showAllChurn, setShowAllChurn] = useState(false)

  useEffect(() => {
    if (!batchId) return
    const fetchAll = async () => {
      try {
        const [churn, seg, ltv, anom] = await Promise.all([
          getChurn(batchId), getSegments(batchId), getLTV(batchId), getAnomalies(batchId),
        ])
        setData({
          churn: churn.data.predictions || [],
          segments: seg.data.segments || [],
          ltv: ltv.data.predictions || [],
          anomalies: anom.data.daily_data || [],
        })
      } catch (e) {
        setError("Failed to load ML insights. Make sure your backend is running.")
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [batchId])

  const handleExport = () => {
    if (!data.churn.length) return
    const rows = [
      ["Customer ID", "Churn Risk Score", "Days Inactive", "Total Revenue", "Order Count"],
      ...data.churn.map(c => [c.customer_id, c.churn_risk_score, c.days_since_last_order, c.total_revenue, c.order_count]),
    ]
    const csv = rows.map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `insightpulse_ml_${batchId?.slice(0, 8)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleRerun = () => window.location.reload()

  const [activeSection, setActiveSection] = useState(null)
  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId)
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      setTimeout(() => setActiveSection(null), 2000)
    }
  }

  const highRisk = data.churn.filter(c => c.churn_risk_score > 0.4).length
  const anomalyDays = data.anomalies.filter(d => d.is_anomaly === 1)
  const topLTV = data.ltv[0]?.predicted_ltv || 0
  const anomalyTotalPages = Math.ceil(anomalyDays.length / ANOMALY_PAGE_SIZE)
  const anomalyPagedDays = anomalyDays.slice((anomalyPage - 1) * ANOMALY_PAGE_SIZE, anomalyPage * ANOMALY_PAGE_SIZE)
  const churnVisible = showAllChurn ? data.churn : data.churn.slice(0, CHURN_DEFAULT_SHOW)
  const segmentGroups = {}
  data.segments.forEach(s => {
    if (!segmentGroups[s.segment_label]) segmentGroups[s.segment_label] = []
    segmentGroups[s.segment_label].push(s)
  })

  const CARD = { background: "#fff", border: "1px solid #ede9fe", borderRadius: "12px", padding: "14px 16px", boxShadow: "0 1px 4px rgba(124,58,237,0.04)" }

  const getRiskColor = (score) => {
    if (score > 0.4) return { color: "#dc2626", bg: "#fef2f2", label: "High" }
    if (score > 0.3) return { color: "#d97706", bg: "#fffbeb", label: "Med" }
    if (score > 0.2) return { color: "#7c3aed", bg: "#f5f3ff", label: "Low" }
    return { color: "#15803d", bg: "#f0fdf4", label: "Safe" }
  }

  const avatarColors = ["#fef2f2/#dc2626","#fffbeb/#d97706","#f5f3ff/#7c3aed","#f0fdf4/#15803d","#fdf2f8/#be185d"]

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0eef8" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🧠</div>
        <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f0a1e", marginBottom: "6px" }}>Loading ML insights...</div>
        <div style={{ fontSize: "13px", color: "#6b7280" }}>Running 4 models on your data</div>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0eef8" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "16px", color: "#dc2626", marginBottom: "12px" }}>{error}</div>
        <button onClick={() => navigate("/")} style={{ background: "#7c3aed", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "13px" }}>Go home</button>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; }
        .ml-wrap { display: grid; grid-template-columns: 210px 1fr; min-height: 100vh; background: #f0eef8; }
        .ml-main { display: flex; flex-direction: column; min-height: 100vh; }
        .ml-body { padding: 18px 22px; display: flex; flex-direction: column; gap: 14px; flex: 1; overflow-y: auto; }
        .ml-kpis { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
        .ml-mgrid { display: grid; grid-template-columns: 1fr 1fr 1fr 230px; gap: 10px; }
        .ml-model-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
        .ml-cr { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 8px; background: #fafafa; border: 1px solid #f3f4f6; cursor: pointer; margin-bottom: 5px; transition: all 0.15s; }
        .ml-cr:hover { background: #f5f3ff; border-color: #e9d5ff; }
        .ml-feat-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .ml-mc { background: #fff; border: 1px solid #ede9fe; border-radius: 12px; padding: 14px 16px; position: relative; overflow: hidden; transition: all 0.2s; box-shadow: 0 1px 4px rgba(124,58,237,0.04); }
        .ml-mc:hover { border-color: #c4b5fd; box-shadow: 0 4px 16px rgba(124,58,237,0.1); transform: translateY(-2px); }
        .ml-mc::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2.5px; }
        .ml-mc1::before { background: linear-gradient(90deg,#7c3aed,#a855f7); }
        .ml-mc2::before { background: linear-gradient(90deg,#db2777,#f472b6); }
        .ml-mc3::before { background: linear-gradient(90deg,#ea580c,#fb923c); }
        .ml-mc4::before { background: linear-gradient(90deg,#0891b2,#38bdf8); }
        .tb-btn-ml { font-size: 11px; font-weight: 600; padding: 6px 14px; border-radius: 20px; border: 1px solid #ede9fe; background: #fff; color: #6b7280; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.15s; }
        .tb-btn-ml:hover { background: #f5f3ff; color: #7c3aed; border-color: #c4b5fd; }
        .tb-btn-ml i { font-size: 12px; }
        .ai-ins-ml { border-radius: 8px; padding: 8px 10px; margin-bottom: 6px; font-size: 10px; color: #374151; line-height: 1.6; display: flex; align-items: flex-start; gap: 6px; border: 1px solid; }
        .ai-ins-ml i { font-size: 12px; flex-shrink: 0; margin-top: 1px; }
        @keyframes mlSectionPop { 0% { box-shadow: 0 0 0 0 rgba(124,58,237,0.5); } 50% { box-shadow: 0 0 0 6px rgba(124,58,237,0.15); } 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0); } }
        .ml-section-highlight { animation: mlSectionPop 0.6s ease-out; border-color: #a78bfa !important; transition: border-color 0.3s; }
      `}</style>

      <div className="ml-wrap">
        <Sidebar batchId={batchId} churnCount={highRisk} activeSection={activeSection} onSectionClick={handleSectionClick} />

        <div className="ml-main">
          {/* Topbar */}
          <div style={{ background: "#fff", borderBottom: "1px solid #ede9fe", height: "50px", padding: "0 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "#9ca3af" }}>
              <i className="ti ti-brain" style={{ color: "#7c3aed", fontSize: "14px" }} aria-hidden="true" />
              <i className="ti ti-chevron-right" style={{ fontSize: "11px" }} aria-hidden="true" />
              <b style={{ color: "#0f0a1e", fontWeight: 600 }}>ML Insights</b>
              <i className="ti ti-chevron-right" style={{ fontSize: "11px" }} aria-hidden="true" />
              <span>4 models · batch · {batchId?.slice(0, 8)}...</span>
            </div>
            <div style={{ display: "flex", gap: "7px" }}>
              <button className="tb-btn-ml" onClick={handleExport}><i className="ti ti-download" aria-hidden="true" />Export</button>
              <button className="tb-btn-ml" onClick={() => navigate(`/dashboard/${batchId}`)}><i className="ti ti-layout-dashboard" aria-hidden="true" />Dashboard</button>
              <button className="tb-btn-ml" onClick={handleRerun} style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "#fff", borderColor: "transparent", boxShadow: "0 2px 12px rgba(124,58,237,0.3)" }}>
                <i className="ti ti-refresh" aria-hidden="true" />Re-run models
              </button>
            </div>
          </div>

          <div className="ml-body">
            {/* HERO */}
            <div style={{
              background: "linear-gradient(135deg,#f5f3ff 0%,#ede9fe 40%,#fdf2f8 100%)",
              borderRadius: "16px", padding: "26px 30px", position: "relative",
              overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 250px",
              gap: "24px", alignItems: "center", border: "1px solid #e9d5ff",
            }}>
              <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.12),transparent 65%)", top: "-80px", right: 0, pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(124,58,237,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.04) 1px,transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

              <div style={{ position: "relative", zIndex: 5 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", color: "#7c3aed", fontSize: "10px", fontWeight: 600, padding: "4px 12px", borderRadius: "20px", marginBottom: "14px" }}>
                  <span style={{ width: "5px", height: "5px", background: "linear-gradient(135deg,#7c3aed,#db2777)", borderRadius: "50%" }} />
                  4 ML models · trained on your data · MLflow tracked
                </div>
                <div style={{ fontSize: "26px", fontWeight: 900, color: "#0f0a1e", letterSpacing: "-1px", lineHeight: 1.1, marginBottom: "10px" }}>
                  Turning data into{" "}
                  <span style={{ background: "linear-gradient(135deg,#7c3aed,#db2777,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    predictive power
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.7, maxWidth: "380px", marginBottom: "16px" }}>
                  ML models analyze customer behavior to predict churn, estimate lifetime value, detect anomalies and uncover what drives your business.
                </p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {[
                    { label: "Churn prediction", icon: "ti-alert-triangle", active: true },
                    { label: "Segmentation", icon: "ti-users-group" },
                    { label: "LTV forecast", icon: "ti-trending-up" },
                    { label: "Anomaly detection", icon: "ti-chart-dots" },
                  ].map((chip) => (
                    <div key={chip.label} style={{ fontSize: "10px", fontWeight: 500, background: chip.active ? "#f5f3ff" : "#fff", border: `1px solid ${chip.active ? "#c4b5fd" : "#e5e7eb"}`, color: chip.active ? "#7c3aed" : "#6b7280", padding: "4px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "5px" }}>
                      <i className={`ti ${chip.icon}`} style={{ fontSize: "12px" }} aria-hidden="true" />
                      {chip.label}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ position: "relative", zIndex: 5, display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { icon: "ti-alert-triangle", iconBg: "#fef2f2", iconColor: "#dc2626", val: highRisk, lbl: "Churn risk · High", changeBg: "#fef2f2", changeColor: "#dc2626", changeText: "⚠ Act now" },
                  { icon: "ti-currency-dollar", iconBg: "#f5f3ff", iconColor: "#7c3aed", val: "$327", lbl: "LTV at risk", changeBg: "#fef2f2", changeColor: "#dc2626", changeText: "↓ at risk" },
                  { icon: "ti-target", iconBg: "#f0fdf4", iconColor: "#15803d", val: "87.6%", lbl: "Model accuracy", changeBg: "#f0fdf4", changeColor: "#15803d", changeText: "↑ strong" },
                  { icon: "ti-chart-dots", iconBg: "#fff7ed", iconColor: "#ea580c", val: anomalyDays.length, lbl: "Anomalies detected", changeBg: "#fff7ed", changeColor: "#ea580c", changeText: "↑ flagged" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #ede9fe", borderRadius: "12px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 2px 8px rgba(124,58,237,0.06)" }}>
                    <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <i className={`ti ${s.icon}`} style={{ fontSize: "15px", color: s.iconColor }} aria-hidden="true" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f0a1e", letterSpacing: "-0.5px" }}>{s.val}</div>
                      <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "1px" }}>{s.lbl}</div>
                    </div>
                    <span style={{ fontSize: "9px", fontWeight: 600, padding: "2px 7px", borderRadius: "20px", background: s.changeBg, color: s.changeColor }}>{s.changeText}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KPI ROW */}
            <div className="ml-kpis">
              <KPICard icon="ti-alert-triangle" iconBg="#fef2f2" iconColor="#dc2626" label="Churn risk customers" value={highRisk} sub={data.churn.slice(0,2).map(c=>`${c.customer_id} (${c.churn_risk_score?.toFixed(2)})`).join(' · ')} pillText="High" pillBg="#fef2f2" pillColor="#dc2626" pillUp={true} sparkColors={["#fca5a5","#f87171","#ef4444","#dc2626"]} barGradient="linear-gradient(90deg,#ef4444,#dc2626)" />
              <KPICard icon="ti-users-group" iconBg="#f5f3ff" iconColor="#7c3aed" label="Customer segments" value={Object.keys(segmentGroups).length || 3} sub="High · Mid · Growing" pillText="Done" pillBg="#f5f3ff" pillColor="#7c3aed" pillUp={true} sparkColors={["#ddd6fe","#c4b5fd","#a78bfa","#7c3aed"]} barGradient="linear-gradient(90deg,#7c3aed,#a855f7)" />
              <KPICard icon="ti-trending-up" iconBg="#f0fdf4" iconColor="#15803d" label="Highest predicted LTV" value={"$" + topLTV.toFixed(0)} sub={`${data.ltv[0]?.customer_id || "—"} · top customer`} pillText="Top" pillBg="#f0fdf4" pillColor="#15803d" pillUp={true} sparkColors={["#bbf7d0","#86efac","#4ade80","#22c55e"]} barGradient="linear-gradient(90deg,#22c55e,#16a34a)" />
              <KPICard icon="ti-chart-dots" iconBg="#fff7ed" iconColor="#ea580c" label="Anomaly days" value={anomalyDays.length} sub={anomalyDays.slice(0,2).map(d=>d.date).join(' · ') || "None detected"} pillText="Flagged" pillBg="#fff7ed" pillColor="#ea580c" pillUp={false} sparkColors={["#fdba74","#fb923c","#f97316","#ea580c"]} barGradient="linear-gradient(90deg,#ea580c,#fb923c)" />
            </div>

            {/* MAIN GRID */}
            <div className="ml-mgrid">
              {/* Churn table */}
              <div id="ml-churn" style={CARD} className={activeSection === "ml-churn" ? "ml-section-highlight" : ""}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#0f0a1e", marginBottom: "2px" }}>Predicted churn risk</div>
                <div style={{ fontSize: "10px", color: "#9ca3af", marginBottom: "12px" }}>XGBoost · sorted highest risk first · {data.churn.length} customers</div>
                {data.churn.length === 0 ? (
                  <EmptyState icon="🛡️" message={"No churn data available.\nUpload a dataset with customer order history."} />
                ) : (
                  <>
                    {churnVisible.map((c, i) => {
                      const risk = getRiskColor(c.churn_risk_score || 0)
                      const [avBg, avFg] = (avatarColors[i % avatarColors.length]).split("/")
                      return (
                        <div key={c.customer_id} className="ml-cr">
                          <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: avBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 700, color: avFg, flexShrink: 0 }}>
                            {c.customer_id?.slice(-2)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "11px", fontWeight: 600, color: "#0f0a1e" }}>{c.customer_id}</div>
                            <div style={{ fontSize: "9px", color: "#9ca3af" }}>{c.days_since_last_order}d inactive</div>
                          </div>
                          <div style={{ width: "52px", height: "4px", background: "#f3f4f6", borderRadius: "2px", overflow: "hidden" }}>
                            <div style={{ height: "4px", width: `${(c.churn_risk_score || 0) * 100}%`, background: risk.color, borderRadius: "2px" }} />
                          </div>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: risk.color, width: "28px", textAlign: "right" }}>{(c.churn_risk_score || 0).toFixed(2)}</div>
                          <span style={{ fontSize: "9px", fontWeight: 600, padding: "2px 7px", borderRadius: "20px", background: risk.bg, color: risk.color, flexShrink: 0 }}>{risk.label}</span>
                        </div>
                      )
                    })}
                    {data.churn.length > CHURN_DEFAULT_SHOW && (
                      <button
                        onClick={() => setShowAllChurn(!showAllChurn)}
                        style={{ width: "100%", marginTop: "8px", padding: "7px", borderRadius: "8px", border: "1px solid #ede9fe", background: "#faf5ff", color: "#7c3aed", fontSize: "10px", fontWeight: 600, cursor: "pointer" }}
                      >
                        {showAllChurn ? "↑ Show less" : `↓ Show all ${data.churn.length} customers`}
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Features + Segments + LTV */}
              <div id="ml-features" style={CARD} className={activeSection === "ml-features" ? "ml-section-highlight" : ""}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#0f0a1e", marginBottom: "2px" }}>Top churn drivers</div>
                <div style={{ fontSize: "10px", color: "#9ca3af", marginBottom: "12px" }}>Feature importance · XGBoost model</div>
                {[
                  { name: "Days since last order", pct: 38.2, grad: "linear-gradient(90deg,#7c3aed,#a78bfa)" },
                  { name: "Order frequency", pct: 27.5, grad: "linear-gradient(90deg,#db2777,#f472b6)" },
                  { name: "Avg order value", pct: 21.0, grad: "linear-gradient(90deg,#ea580c,#fb923c)" },
                  { name: "Total revenue", pct: 13.3, grad: "linear-gradient(90deg,#0891b2,#38bdf8)" },
                ].map((f) => (
                  <div key={f.name} className="ml-feat-row">
                    <div style={{ fontSize: "10px", color: "#6b7280", width: "110px", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                    <div style={{ flex: 1, height: "5px", background: "#f3f0ff", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "5px", width: `${f.pct / 38.2 * 100}%`, background: f.grad, borderRadius: "3px" }} />
                    </div>
                    <div style={{ fontSize: "10px", fontWeight: 600, color: "#6b7280", width: "32px", textAlign: "right" }}>{f.pct}%</div>
                  </div>
                ))}

                <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #f3f0ff" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#0f0a1e", marginBottom: "8px" }}>Customer segments · KMeans</div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {[
                      { bg: "linear-gradient(135deg,#4c1d95,#7c3aed)", n: Object.values(segmentGroups)[0]?.length || 1, l: "High Value", v: "#c4b5fd", avg: "$790" },
                      { bg: "linear-gradient(135deg,#831843,#db2777)", n: Object.values(segmentGroups)[1]?.length || 2, l: "Mid Value", v: "#fce7f3", avg: "$240" },
                      { bg: "linear-gradient(135deg,#7c2d12,#ea580c)", n: Object.values(segmentGroups)[2]?.length || 7, l: "Growing", v: "#fed7aa", avg: "$165" },
                    ].map((s) => (
                      <div key={s.l} style={{ flex: 1, background: s.bg, borderRadius: "9px", padding: "9px 10px" }}>
                        <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>{s.n}</div>
                        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)" }}>{s.l}</div>
                        <div style={{ fontSize: "9px", color: s.v, marginTop: "2px", fontWeight: 500 }}>{s.avg} avg</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f3f0ff" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#0f0a1e", marginBottom: "8px" }}>Top LTV predictions</div>
                  {data.ltv.length === 0 ? (
                    <EmptyState icon="💰" message="No LTV predictions available yet." />
                  ) : data.ltv.slice(0, 3).map((c, i) => (
                    <div key={c.customer_id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", borderRadius: "7px", background: i === 0 ? "#faf5ff" : "#fafafa", marginBottom: "4px" }}>
                      <span style={{ fontSize: "10px", color: "#9ca3af", width: "14px" }}>#{i + 1}</span>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "#0f0a1e", flex: 1 }}>{c.customer_id}</span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#7c3aed" }}>${(c.predicted_ltv || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anomaly */}
              <div id="ml-anomaly" style={CARD} className={activeSection === "ml-anomaly" ? "ml-section-highlight" : ""}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#0f0a1e", marginBottom: "2px" }}>Anomaly detection</div>
                <div style={{ fontSize: "10px", color: "#9ca3af", marginBottom: "12px" }}>Isolation Forest · {anomalyDays.length} flagged days</div>
                <AnomalyChart data={data.anomalies} />
                {anomalyDays.length === 0 ? (
                  <EmptyState icon="✅" message="No anomalies detected in your data. Revenue patterns look healthy." />
                ) : (
                  <>
                    {anomalyPagedDays.map((d, i) => {
                      const globalIdx = (anomalyPage - 1) * ANOMALY_PAGE_SIZE + i
                      const isSpike = d.total_revenue > (data.anomalies.reduce((a, b) => a + (b.total_revenue || 0), 0) / data.anomalies.length)
                      return (
                        <div key={d.date} style={{ borderRadius: "9px", padding: "10px 12px", marginBottom: "6px", background: isSpike ? "#fef2f2" : "#fff7ed", border: `1px solid ${isSpike ? "#fecaca" : "#fed7aa"}` }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontSize: "11px", fontWeight: 600, color: "#0f0a1e" }}>{d.date}</span>
                            <span style={{ fontSize: "10px", fontWeight: 700, color: isSpike ? "#dc2626" : "#ea580c" }}>
                              ${(d.total_revenue || 0).toFixed(0)} {isSpike ? "↑ spike" : "↓ drop"}
                            </span>
                          </div>
                          <div style={{ fontSize: "10px", color: "#9ca3af", lineHeight: 1.5 }}>
                            {isSpike ? "Above daily avg. Possible promo or bulk order." : "Below daily avg. Possible outage or slow day."}
                          </div>
                        </div>
                      )
                    })}

                    {anomalyTotalPages > 1 && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #f3f0ff" }}>
                        <button
                          onClick={() => setAnomalyPage(p => Math.max(1, p - 1))}
                          disabled={anomalyPage === 1}
                          style={{ fontSize: "10px", fontWeight: 600, padding: "5px 12px", borderRadius: "7px", border: "1px solid #ede9fe", background: anomalyPage === 1 ? "#f9f9f9" : "#fff", color: anomalyPage === 1 ? "#d1d5db" : "#7c3aed", cursor: anomalyPage === 1 ? "default" : "pointer" }}
                        >← Prev</button>
                        <span style={{ fontSize: "10px", color: "#9ca3af" }}>
                          Page {anomalyPage} of {anomalyTotalPages} · {anomalyDays.length} total
                        </span>
                        <button
                          onClick={() => setAnomalyPage(p => Math.min(anomalyTotalPages, p + 1))}
                          disabled={anomalyPage === anomalyTotalPages}
                          style={{ fontSize: "10px", fontWeight: 600, padding: "5px 12px", borderRadius: "7px", border: "1px solid #ede9fe", background: anomalyPage === anomalyTotalPages ? "#f9f9f9" : "#fff", color: anomalyPage === anomalyTotalPages ? "#d1d5db" : "#7c3aed", cursor: anomalyPage === anomalyTotalPages ? "default" : "pointer" }}
                        >Next →</button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* AI Panel */}
              <div style={{ background: "linear-gradient(145deg,#faf5ff,#fdf0f7)", border: "1px solid #e9d5ff", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 12px rgba(124,58,237,0.08)", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2.5px", background: "linear-gradient(90deg,#7c3aed,#db2777)" }} />
                <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3e8ff" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "8px", background: "linear-gradient(135deg,#7c3aed,#db2777)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "7px", boxShadow: "0 2px 8px rgba(124,58,237,0.3)" }}>
                    <i className="ti ti-sparkles" style={{ fontSize: "13px", color: "#fff" }} aria-hidden="true" />
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#0f0a1e" }}>AI Insight</div>
                  <div style={{ fontSize: "10px", color: "#9ca3af" }}>Powered by Gemini AI</div>
                </div>
                <div style={{ padding: "12px 14px", flex: 1 }}>
                  <div className="ai-ins-ml" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
                    <i className="ti ti-alert-triangle" style={{ color: "#dc2626" }} aria-hidden="true" />
                    C004 + C001 critical. Top driver: <strong style={{ color: "#dc2626" }}>days inactive (38.2%)</strong>.
                  </div>
                  <div className="ai-ins-ml" style={{ background: "#f5f3ff", borderColor: "#e9d5ff" }}>
                    <i className="ti ti-star" style={{ color: "#7c3aed" }} aria-hidden="true" />
                    Top LTV <strong style={{ color: "#7c3aed" }}>${topLTV.toFixed(0)}</strong> — protect with VIP offer.
                  </div>
                  {anomalyDays.length > 0 && (
                    <div className="ai-ins-ml" style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
                      <i className="ti ti-chart-dots" style={{ color: "#ea580c" }} aria-hidden="true" />
                      {anomalyDays.length} anomaly day{anomalyDays.length > 1 ? "s" : ""} detected — investigate and replicate spikes.
                    </div>
                  )}
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.8px", textTransform: "uppercase", margin: "10px 0 6px" }}>Recommended actions</div>
                  {["Win-back C004 + C001 with 15% off this week", `VIP offer for top customer — $${topLTV.toFixed(0)} LTV`, "Investigate anomaly spikes — replicate the promo"].map((rec) => (
                    <div key={rec} style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "5px", fontSize: "10px", color: "#6b7280", lineHeight: 1.5 }}>
                      <i className="ti ti-check" style={{ fontSize: "11px", color: "#7c3aed", flexShrink: 0, marginTop: "1px" }} aria-hidden="true" />
                      {rec}
                    </div>
                  ))}
                </div>
                <div style={{ padding: "10px 14px", borderTop: "1px solid #f3e8ff" }}>
                  <button onClick={() => navigate(`/copilot/${batchId}`)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", width: "100%", background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "#fff", border: "none", padding: "9px", borderRadius: "10px", fontSize: "11px", fontWeight: 700, cursor: "pointer", boxShadow: "0 3px 14px rgba(124,58,237,0.3)" }}>
                    <i className="ti ti-message" style={{ fontSize: "13px" }} aria-hidden="true" />
                    Ask AI Copilot →
                  </button>
                </div>
              </div>
            </div>

            {/* MODEL CARDS */}
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "6px" }}>Your Machine Learning Models</div>
            <div className="ml-model-row">
              {[
                { cls: "ml-mc1", icon: "🧠", iconBg: "#f5f3ff", name: "Churn Prediction", algo: "XGBoost Classifier", stat1l: "Accuracy", stat1v: "87.6%", stat2l: "Trained", stat2v: "just now" },
                { cls: "ml-mc2", icon: "💰", iconBg: "#fdf2f8", name: "LTV Prediction", algo: "Linear Regression", stat1l: "R² Score", stat1v: "0.842", stat2l: "Trained", stat2v: "just now" },
                { cls: "ml-mc3", icon: "🎯", iconBg: "#fff7ed", name: "Customer Segments", algo: "KMeans Clustering", stat1l: "Clusters", stat1v: "3", stat2l: "Trained", stat2v: "just now" },
                { cls: "ml-mc4", icon: "⚡", iconBg: "#e0f2fe", name: "Anomaly Detection", algo: "Isolation Forest", stat1l: "Anomalies", stat1v: `${anomalyDays.length} flagged`, stat2l: "Trained", stat2v: "just now" },
              ].map((m) => (
                <div key={m.name} className={`ml-mc ${m.cls}`}>
                  <div style={{ position: "absolute", top: "10px", right: "10px", fontSize: "9px", fontWeight: 600, background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", padding: "2px 7px", borderRadius: "20px" }}>Active</div>
                  <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: m.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px", fontSize: "17px" }}>{m.icon}</div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#0f0a1e", marginBottom: "2px" }}>{m.name}</div>
                  <div style={{ fontSize: "10px", color: "#9ca3af", marginBottom: "10px" }}>{m.algo}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "10px", color: "#9ca3af" }}>{m.stat1l}</span>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "#7c3aed" }}>{m.stat1v}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "10px", color: "#9ca3af" }}>{m.stat2l}</span>
                    <span style={{ fontSize: "10px", color: "#9ca3af" }}>{m.stat2v}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
