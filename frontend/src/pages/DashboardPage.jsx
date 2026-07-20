

import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  getRevenueTrend, getAOV, getTopCustomers,
  getChannelPerformance, getCategoryPerformance, getAnomalies
} from "../services/api"

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

// ── Sidebar ──────────────────────────────────────────────────
function Sidebar({ batchId, churnCount, anomalyCount, activeSection, onSectionClick }) {
  const navigate = useNavigate()
  const navItems = [
    {
      section: "Analytics", links: [
        { icon: "ti-layout-dashboard", label: "Dashboard", active: !activeSection, path: null },
        { icon: "ti-chart-line", label: "Revenue", path: null, scrollTo: "revenue" },
        { icon: "ti-users", label: "Customers", path: null, scrollTo: "customers" },
        { icon: "ti-speakerphone", label: "Channels", path: null, scrollTo: "channels" },
      ]
    },
    {
      section: "AI & ML", links: [
        { icon: "ti-brain", label: "ML Insights", badge: churnCount, badgeType: "red", path: `ml` },
        { icon: "ti-sparkles", label: "AI Copilot", path: `copilot` },
        { icon: "ti-alert-triangle", label: "Anomalies", badge: anomalyCount, badgeType: "warn", path: `ml` },
      ]
    },
    {
      section: "Account", links: [
        { icon: "ti-upload", label: "New upload", path: `/` },
      ]
    },
  ]

  return (
    <div style={{ background: "#0f0a1e", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Logo */}
      <div style={{ padding: "16px 14px 12px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-activity" style={{ fontSize: "13px", color: "#fff" }} aria-hidden="true" />
          </div>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#fff", letterSpacing: "-0.3px" }}>InsightPulse</span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: "10px 8px", flex: 1, overflowY: "auto" }}>
        {navItems.map((group) => (
          <div key={group.section}>
            <div style={{ fontSize: "9px", fontWeight: 500, color: "rgba(255,255,255,0.25)", letterSpacing: "1px", textTransform: "uppercase", padding: "10px 8px 5px" }}>
              {group.section}
            </div>
            {group.links.map((link) => {
              const isActive = link.active || activeSection === link.scrollTo
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    if (link.scrollTo) {
                      onSectionClick(link.scrollTo)
                    } else if (link.path === "/") {
                      navigate("/")
                    } else if (link.path) {
                      navigate(`/${link.path}/${batchId}`)
                    }
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: "9px",
                    padding: "7px 10px", borderRadius: "8px", cursor: "pointer",
                    fontSize: "12px", fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#c4b5fd" : "rgba(255,255,255,0.45)",
                    background: isActive ? "rgba(124,58,237,0.2)" : "none",
                    border: "none", width: "100%", textAlign: "left",
                    marginBottom: "1px", transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)" } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.45)" } }}
                >
                  <i className={`ti ${link.icon}`} style={{ fontSize: "15px", color: isActive ? "#a78bfa" : "inherit", flexShrink: 0 }} aria-hidden="true" />
                  {link.label}
                  {link.badge > 0 && (
                    <span style={{
                      marginLeft: "auto", fontSize: "9px", fontWeight: 500,
                      padding: "1px 6px", borderRadius: "20px",
                      background: link.badgeType === "warn" ? "rgba(234,88,12,0.2)" : "rgba(239,68,68,0.2)",
                      color: link.badgeType === "warn" ? "#fdba74" : "#fca5a5",
                      border: `0.5px solid ${link.badgeType === "warn" ? "rgba(234,88,12,0.3)" : "rgba(239,68,68,0.3)"}`,
                    }}>
                      {link.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Batch info */}
      <div style={{ padding: "10px 8px 14px", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "10px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.5px", textTransform: "uppercase" }}>Active batch</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "9px", color: "#4ade80" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              Live
            </span>
          </div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", fontFamily: "monospace", wordBreak: "break-all" }}>
            {batchId?.slice(0, 20)}...
          </div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
            <i className="ti ti-file-text" style={{ fontSize: "11px" }} aria-hidden="true" />
            Analysis complete
          </div>
        </div>
      </div>
    </div>
  )
}

// ── KPI Card ─────────────────────────────────────────────────
function KPICard({ icon, iconBg, iconColor, label, value, trend, trendUp, trendColor, sparkColors, barColor }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--color-background-primary, #fff)",
        border: `0.5px solid ${hovered ? "rgba(124,58,237,0.3)" : "var(--color-border-tertiary, #e5e7eb)"}`,
        borderRadius: "12px", padding: "14px 16px",
        position: "relative", overflow: "hidden",
        cursor: "pointer", transition: "border-color 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className={`ti ${icon}`} style={{ fontSize: "16px", color: iconColor }} aria-hidden="true" />
        </div>
        <div style={{ fontSize: "10px", fontWeight: 500, padding: "2px 7px", borderRadius: "20px", background: trendUp ? "#f0fdf4" : "#fef2f2", color: trendUp ? "#15803d" : "#dc2626", display: "flex", alignItems: "center", gap: "3px" }}>
          <i className={`ti ${trendUp ? "ti-trending-up" : "ti-alert-triangle"}`} style={{ fontSize: "10px" }} aria-hidden="true" />
          {trend}
        </div>
      </div>
      <div style={{ fontSize: "11px", color: "var(--color-text-secondary, #6b7280)", marginBottom: "3px" }}>{label}</div>
      <div style={{ fontSize: "22px", fontWeight: 500, color: "var(--color-text-primary, #111)", letterSpacing: "-0.8px", marginBottom: "8px" }}>{value}</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "20px" }}>
        {sparkColors.map((c, i) => (
          <div key={i} style={{ flex: 1, height: `${[35, 55, 80, 100][i]}%`, background: c, borderRadius: "1px 1px 0 0", opacity: 0.8 }} />
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2.5px", background: barColor, opacity: 0.5 }} />
    </div>
  )
}

// ── Revenue Chart ─────────────────────────────────────────────
function RevenueChart({ data }) {
  const chartReady = useChartJS()
  const canvasRef = React.useRef(null)
  const chartRef = React.useRef(null)

  useEffect(() => {
    if (!chartReady || !data.length || !canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()
    const isDark = matchMedia("(prefers-color-scheme: dark)").matches
    const gc = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
    const tc = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)"
    chartRef.current = new window.Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: data.map(d => d.month),
        datasets: [{
          label: "Revenue",
          data: data.map(d => d.total_revenue),
          backgroundColor: data.map((_, i) => {
            const colors = ["#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9"]
            return colors[Math.min(i, colors.length - 1)]
          }),
          borderRadius: 6, borderSkipped: false, barThickness: 48,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => " $" + c.raw.toLocaleString() } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: tc, font: { size: 11 } }, border: { display: false } },
          y: { grid: { color: gc }, ticks: { color: tc, font: { size: 10 }, callback: (v) => "$" + v }, border: { display: false }, min: 0 },
        }
      }
    })
    return () => chartRef.current?.destroy()
  }, [chartReady, data])

  return (
    <div style={{ position: "relative", height: "168px" }}>
      <canvas ref={canvasRef} id="revChart" role="img" aria-label="Bar chart showing monthly revenue trend">Monthly revenue data</canvas>
    </div>
  )
}

// ── Anomaly Mini Chart ────────────────────────────────────────
function AnomalyChart({ data }) {
  const chartReady = useChartJS()
  const canvasRef = React.useRef(null)
  const chartRef = React.useRef(null)

  useEffect(() => {
    if (!chartReady || !data.length || !canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()
    chartRef.current = new window.Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: data.map(d => d.date),
        datasets: [{
          data: data.map(d => d.total_revenue),
          borderColor: "#8b5cf6", borderWidth: 1.5,
          pointBackgroundColor: data.map(d => d.is_anomaly === 1 ? "#dc2626" : "#8b5cf6"),
          pointRadius: data.map(d => d.is_anomaly === 1 ? 5 : 2),
          tension: 0.3, fill: true,
          backgroundColor: "rgba(124,58,237,0.06)",
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => " $" + c.raw } } },
        scales: { x: { display: false }, y: { display: false } },
      }
    })
    return () => chartRef.current?.destroy()
  }, [chartReady, data])

  return (
    <div style={{ position: "relative", height: "70px" }}>
      <canvas ref={canvasRef} role="img" aria-label="Line chart showing daily revenue with anomalies highlighted">Daily revenue with anomalies</canvas>
    </div>
  )
}

// ── Main Dashboard Page ───────────────────────────────────────
export default function DashboardPage() {
  const { batchId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeSection, setActiveSection] = useState(null)
  const [data, setData] = useState({
    revenue: [], aov: null, customers: [], channels: [], categories: [], anomalies: [],
  })

  const handleExport = () => {
    if (!data.customers.length) return
    const rows = [
      ["Customer ID", "Total Revenue", "Order Count"],
      ...data.customers.map(c => [c.customer_id, c.total_revenue, c.order_count]),
    ]
    const csv = rows.map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `insightpulse_${batchId?.slice(0, 8)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId)
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      // Remove highlight after 2s
      setTimeout(() => setActiveSection(null), 2000)
    }
  }

  useEffect(() => {
    if (!batchId) return
    const fetchAll = async () => {
      try {
        const [rev, aov, cust, chan, cat, anom] = await Promise.all([
          getRevenueTrend(batchId),
          getAOV(batchId),
          getTopCustomers(batchId),
          getChannelPerformance(batchId),
          getCategoryPerformance(batchId),
          getAnomalies(batchId),
        ])
        setData({
          revenue: rev.data.revenue_trend || [],
          aov: aov.data,
          customers: cust.data.top_customers || [],
          channels: chan.data.channels || [],
          categories: cat.data.categories || [],
          anomalies: anom.data.daily_data || [],
        })
      } catch (e) {
        setError("Failed to load dashboard data. Make sure your backend is running.")
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [batchId])

  const totalRevenue = data.revenue.reduce((s, r) => s + (r.total_revenue || 0), 0)
  const totalOrders = data.customers.reduce((s, c) => s + (c.order_count || 0), 0)
  const totalCustomers = data.customers.length
  const anomalyCount = data.anomalies.filter(d => d.is_anomaly === 1).length
  const anomalyDays = data.anomalies.filter(d => d.is_anomaly === 1)
  const maxChannel = Math.max(...data.channels.map(c => c.total_revenue || 0), 1)

  const CHIP_STYLE = {
    fontSize: "10px", fontWeight: 500,
    background: "var(--color-background-secondary, #f9fafb)",
    border: "0.5px solid var(--color-border-tertiary, #e5e7eb)",
    color: "var(--color-text-secondary, #6b7280)",
    padding: "4px 8px", borderRadius: "20px", cursor: "pointer",
  }

  const CARD = {
    background: "var(--color-background-primary, #fff)",
    border: "0.5px solid var(--color-border-tertiary, #e5e7eb)",
    borderRadius: "12px", padding: "14px 16px",
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-background-tertiary, #f8f6ff)", fontFamily: "var(--font-sans)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🧠</div>
        <div style={{ fontSize: "16px", fontWeight: 500, color: "var(--color-text-primary, #111)", marginBottom: "6px" }}>Loading your dashboard...</div>
        <div style={{ fontSize: "13px", color: "var(--color-text-secondary, #6b7280)" }}>Fetching KPIs and insights</div>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-background-tertiary, #f8f6ff)" }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
        <div style={{ fontSize: "16px", fontWeight: 500, color: "#dc2626", marginBottom: "8px" }}>{error}</div>
        <button onClick={() => navigate("/")} style={{ fontSize: "13px", background: "#7c3aed", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer" }}>
          Go back home
        </button>
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
        .db-wrap { display: grid; grid-template-columns: 220px 1fr; min-height: 100vh; background: #f8fafc; }
        .db-main { display: flex; flex-direction: column; min-height: 100vh; }
        .db-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; flex: 1; }
        .db-kpis { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
        .db-mid { display: grid; grid-template-columns: 1fr 280px; gap: 10px; }
        .db-bot { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .ch-row { display: flex; align-items: center; gap: 8px; margin-bottom: 9px; }
        .cust-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; background: var(--color-background-secondary,#f9fafb); cursor: pointer; transition: all 0.15s; margin-bottom: 6px; }
        .cust-item:hover { background: var(--color-background-primary,#fff); border: 0.5px solid var(--color-border-tertiary,#e5e7eb); }
        .anom-item { display: flex; align-items: flex-start; gap: 8px; padding: 8px 10px; border-radius: 8px; background: var(--color-background-secondary,#f9fafb); margin-bottom: 6px; }
        .tb-btn { font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 20px; border: 0.5px solid var(--color-border-tertiary,#e5e7eb); background: var(--color-background-primary,#fff); color: var(--color-text-secondary,#6b7280); cursor: pointer; display: flex; align-items: center; gap: 5px; }
        .tb-btn i { font-size: 13px; }
        .tb-btn-p { background: #7c3aed; color: #fff; border-color: #7c3aed; }
        .ai-insight { border-radius: 8px; padding: 8px 10px; margin-bottom: 6px; font-size: 11px; line-height: 1.6; display: flex; align-items: flex-start; gap: 6px; }
        @keyframes sectionPop { 0% { box-shadow: 0 0 0 0 rgba(124,58,237,0.5); } 50% { box-shadow: 0 0 0 6px rgba(124,58,237,0.15); } 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0); } }
        .section-highlight { animation: sectionPop 0.6s ease-out; border-color: #a78bfa !important; transition: border-color 0.3s; }
      `}</style>

      <div className="db-wrap">
        <Sidebar batchId={batchId} churnCount={2} anomalyCount={anomalyCount} activeSection={activeSection} onSectionClick={handleSectionClick} />

        <div className="db-main">
          {/* Topbar */}
          <div style={{ background: "var(--color-background-primary,#fff)", borderBottom: "0.5px solid var(--color-border-tertiary,#e5e7eb)", height: "48px", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--color-text-secondary,#6b7280)" }}>
              <i className="ti ti-layout-dashboard" style={{ fontSize: "13px" }} aria-hidden="true" />
              <i className="ti ti-chevron-right" style={{ fontSize: "11px" }} aria-hidden="true" />
              <b style={{ color: "var(--color-text-primary,#111)", fontWeight: 500 }}>Dashboard</b>
              <i className="ti ti-chevron-right" style={{ fontSize: "11px" }} aria-hidden="true" />
              <span>batch · {batchId?.slice(0, 8)}...</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button className="tb-btn"><i className="ti ti-calendar" aria-hidden="true" />{data.revenue.length > 0 ? `${data.revenue[0]?.month} – ${data.revenue[data.revenue.length - 1]?.month}` : "All time"}</button>
              <button className="tb-btn" onClick={handleExport}><i className="ti ti-download" aria-hidden="true" />Export</button>
              <button className="tb-btn tb-btn-p" onClick={() => navigate("/")}><i className="ti ti-upload" aria-hidden="true" />New upload</button>
            </div>
          </div>

          <div className="db-body">
            {/* KPIs */}
            <div className="db-kpis">
              <KPICard icon="ti-currency-dollar" iconBg="#f5f3ff" iconColor="#7c3aed" label="Total revenue" value={"$" + totalRevenue.toLocaleString()} trend="+12%" trendUp={true} sparkColors={["#ddd6fe", "#c4b5fd", "#a78bfa", "#7c3aed"]} barColor="#7c3aed" />
              <KPICard icon="ti-shopping-bag" iconBg="#fdf2f8" iconColor="#db2777" label="Avg order value" value={"$" + (data.aov?.overall_aov || 0).toFixed(2)} trend="+4%" trendUp={true} sparkColors={["#fbcfe8", "#f9a8d4", "#f472b6", "#db2777"]} barColor="#db2777" />
              <KPICard icon="ti-users" iconBg="#fef2f2" iconColor="#dc2626" label="Customers" value={totalCustomers} trend="2 at risk" trendUp={false} sparkColors={["#fecaca", "#fca5a5", "#f87171", "#ef4444"]} barColor="#ef4444" />
              <KPICard icon="ti-receipt" iconBg="#eff6ff" iconColor="#2563eb" label="Total orders" value={totalOrders} trend="2 avg/customer" trendUp={true} sparkColors={["#bfdbfe", "#93c5fd", "#60a5fa", "#2563eb"]} barColor="#2563eb" />
            </div>

            {/* Revenue + AI */}
            <div id="revenue" className="db-mid">
              <div style={CARD} className={activeSection === "revenue" ? "section-highlight" : ""}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--color-text-primary,#111)" }}>Monthly revenue trend</div>
                    <div style={{ fontSize: "10px", color: "var(--color-text-secondary,#6b7280)", marginTop: "2px" }}>{data.revenue.length} months of data</div>
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 500, padding: "2px 8px", borderRadius: "20px", background: "#f5f3ff", color: "#7c3aed" }}>Live data</span>
                </div>
                <RevenueChart data={data.revenue} />
              </div>

              <div style={{ ...CARD, borderColor: "#e9d5ff", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,#7c3aed,#db2777)" }} />
                <div style={{ padding: "12px 14px", borderBottom: "0.5px solid var(--color-border-tertiary,#e5e7eb)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "7px", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="ti ti-sparkles" style={{ fontSize: "12px", color: "#fff" }} aria-hidden="true" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-text-primary,#111)" }}>AI Copilot</div>
                  </div>
                  <div style={{ fontSize: "9px", color: "var(--color-text-secondary,#6b7280)", display: "flex", alignItems: "center", gap: "3px" }}>
                    <i className="ti ti-circle-check" style={{ fontSize: "10px", color: "#22c55e" }} aria-hidden="true" />Ready
                  </div>
                </div>
                <div style={{ padding: "12px 14px", flex: 1 }}>
                  <div className="ai-insight" style={{ borderLeft: "2px solid #7c3aed", background: "#faf5ff" }}>
                    <i className="ti ti-star" style={{ fontSize: "12px", color: "#7c3aed", flexShrink: 0, marginTop: "1px" }} aria-hidden="true" />
                    <span style={{ fontSize: "11px", color: "var(--color-text-primary,#111)", lineHeight: 1.6 }}>
                      <strong style={{ color: "#7c3aed" }}>Top customer</strong> is generating the most revenue. Protect this relationship with a VIP offer.
                    </span>
                  </div>
                  <div className="ai-insight" style={{ borderLeft: "2px solid #ef4444", background: "#fef2f2" }}>
                    <i className="ti ti-alert-triangle" style={{ fontSize: "12px", color: "#ef4444", flexShrink: 0, marginTop: "1px" }} aria-hidden="true" />
                    <span style={{ fontSize: "11px", color: "var(--color-text-primary,#111)", lineHeight: 1.6 }}>
                      <strong style={{ color: "#dc2626" }}>2 customers</strong> haven't ordered in 46–55 days. $327 LTV at risk — send win-back now.
                    </span>
                  </div>
                  <div className="ai-insight" style={{ borderLeft: "2px solid #ea580c", background: "#fff7ed" }}>
                    <i className="ti ti-chart-bar" style={{ fontSize: "12px", color: "#ea580c", flexShrink: 0, marginTop: "1px" }} aria-hidden="true" />
                    <span style={{ fontSize: "11px", color: "var(--color-text-primary,#111)", lineHeight: 1.6 }}>
                      Organic Search has <strong>3× higher AOV</strong> than Instagram. Shift 20% of paid budget there.
                    </span>
                  </div>
                </div>
                <div style={{ padding: "8px 12px", borderTop: "0.5px solid var(--color-border-tertiary,#e5e7eb)", display: "flex", gap: "6px" }}>
                  <button onClick={() => navigate(`/copilot/${batchId}`)} style={{ ...CHIP_STYLE, flex: 1, textAlign: "center" }}>Ask a question →</button>
                </div>
              </div>
            </div>

            {/* Bottom 3 */}
            <div className="db-bot">
              {/* Top customers */}
              <div id="customers" style={CARD} className={activeSection === "customers" ? "section-highlight" : ""}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--color-text-primary,#111)", marginBottom: "2px" }}>Top customers</div>
                <div style={{ fontSize: "10px", color: "var(--color-text-secondary,#6b7280)", marginBottom: "10px" }}>By total revenue · risk colored</div>
                {data.customers.slice(0, 4).map((c, i) => {
                  const colors = ["#eef2ff/#4338ca", "#fdf2f8/#be185d", "#fff7ed/#c2410c", "#fef2f2/#dc2626"].map(s => s.split("/"))
                  const [bg, fg] = colors[i % colors.length]
                  const isHighRisk = c.days_since_last_order > 40
                  return (
                    <div key={c.customer_id} className="cust-item">
                      <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 500, color: fg, flexShrink: 0 }}>
                        {c.customer_id?.slice(-2)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-text-primary,#111)" }}>{c.customer_id}</div>
                        <div style={{ fontSize: "10px", color: "var(--color-text-secondary,#6b7280)" }}>{c.order_count} orders</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-text-primary,#111)" }}>${(c.total_revenue || 0).toFixed(0)}</div>
                        <div style={{ fontSize: "9px", fontWeight: 500, padding: "1px 6px", borderRadius: "20px", marginTop: "2px", display: "inline-block", background: isHighRisk ? "#fef2f2" : "#f0fdf4", color: isHighRisk ? "#dc2626" : "#15803d" }}>
                          {isHighRisk ? "High risk" : "Low risk"}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Channel performance */}
              <div id="channels" style={CARD} className={activeSection === "channels" ? "section-highlight" : ""}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--color-text-primary,#111)", marginBottom: "2px" }}>Channel performance</div>
                <div style={{ fontSize: "10px", color: "var(--color-text-secondary,#6b7280)", marginBottom: "10px" }}>Revenue + AOV by source</div>
                {data.channels.map((ch, i) => {
                  const colors = ["#7c3aed", "#db2777", "#ea580c", "#0891b2"]
                  const pct = Math.round((ch.total_revenue / maxChannel) * 100)
                  return (
                    <div key={ch.channel} className="ch-row">
                      <div style={{ width: "7px", height: "7px", borderRadius: "2px", background: colors[i % colors.length], flexShrink: 0 }} />
                      <div style={{ fontSize: "11px", color: "var(--color-text-primary,#111)", width: "76px", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ch.channel}</div>
                      <div style={{ flex: 1, height: "4px", background: "var(--color-background-secondary,#f9fafb)", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ height: "4px", width: `${pct}%`, background: colors[i % colors.length], borderRadius: "2px" }} />
                      </div>
                      <div style={{ fontSize: "10px", color: "var(--color-text-secondary,#6b7280)", width: "36px", textAlign: "right", flexShrink: 0 }}>${(ch.total_revenue || 0).toFixed(0)}</div>
                      <div style={{ fontSize: "9px", color: "var(--color-text-secondary,#6b7280)", width: "46px", textAlign: "right", flexShrink: 0 }}>${(ch.avg_order_value || 0).toFixed(0)} AOV</div>
                    </div>
                  )
                })}
              </div>

              {/* Anomalies */}
              <div style={CARD}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--color-text-primary,#111)", marginBottom: "2px" }}>Anomalies detected</div>
                <div style={{ fontSize: "10px", color: "var(--color-text-secondary,#6b7280)", marginBottom: "10px" }}>Isolation Forest · {anomalyCount} flagged days</div>
                {anomalyDays.slice(0, 2).map((d, i) => (
                  <div key={d.date} className="anom-item">
                    <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: i === 0 ? "#fef2f2" : "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <i className={`ti ${i === 0 ? "ti-trending-up" : "ti-trending-down"}`} style={{ fontSize: "14px", color: i === 0 ? "#dc2626" : "#ea580c" }} aria-hidden="true" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "10px", fontWeight: 500, color: "var(--color-text-primary,#111)" }}>{d.date}</div>
                      <div style={{ fontSize: "10px", color: "var(--color-text-secondary,#6b7280)", marginTop: "1px", lineHeight: 1.4 }}>
                        {i === 0 ? "Revenue spike — possible promo or bulk order" : "Revenue drop — possible outage or slow day"}
                      </div>
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: 500, color: i === 0 ? "#dc2626" : "#ea580c", flexShrink: 0 }}>${(d.total_revenue || 0).toFixed(0)}</div>
                  </div>
                ))}
                {anomalyCount === 0 && (
                  <div style={{ fontSize: "12px", color: "var(--color-text-secondary,#6b7280)", textAlign: "center", padding: "20px 0" }}>No anomalies detected ✓</div>
                )}
                <AnomalyChart data={data.anomalies} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
