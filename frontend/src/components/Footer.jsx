const techBadges = ["FastAPI", "XGBoost", "Gemini AI", "React", "MLflow"]

export default function Footer() {
  return (
    <footer style={{ background: "#080612", padding: "32px 48px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <span style={{ fontSize: "14px", fontWeight: 800, color: "#fff" }}>InsightPulse</span>
        </div>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {techBadges.map((tech) => (
            <span key={tech} style={{ fontSize: "10px", fontWeight: 600, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", padding: "3px 10px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)" }}>{tech}</span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.5)" }} />
          All systems operational
        </div>
      </div>

      <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.46)" }}>
          © 2026 InsightPulse. Built by <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>Jueeli Sawant</span>
        </div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>Full-stack AI · Data Science · MLOps</div>
        <div style={{ display: "flex", gap: "16px" }}>
          <a href="https://github.com/YOUR_USERNAME/insightpulse" target="_blank" rel="noreferrer" style={{ fontSize: "12px", color: "rgba(255,255,255,0.46)", textDecoration: "none" }}>GitHub</a>
          <a href="https://linkedin.com/in/YOUR_LINKEDIN" target="_blank" rel="noreferrer" style={{ fontSize: "12px", color: "rgba(255,255,255,0.46)", textDecoration: "none" }}>LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}