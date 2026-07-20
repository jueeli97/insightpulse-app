import { useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// ── SVG Icons ──────────────────────────────────────────────
const UploadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

const PlayIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="white">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)

const FileIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

// ── Particle generator ─────────────────────────────────────
function Particles() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const colors = ["#a78bfa", "#f472b6", "#7c3aed", "#c4b5fd", "#db2777", "#fb923c"]
    const particles = []

    for (let i = 0; i < 14; i++) {
      const p = document.createElement("div")
      const size = Math.random() * 3 + 2
      const top = 25 + Math.random() * 35
      const duration = 1.5 + Math.random() * 1.5
      const delay = Math.random() * 2.5
      const color = colors[Math.floor(Math.random() * colors.length)]
      p.style.cssText = `
        position:absolute; width:${size}px; height:${size}px;
        border-radius:50%; background:${color};
        top:${top}%; left:42%;
        box-shadow:0 0 ${size * 2}px ${color};
        animation:ptLeft ${duration}s linear ${delay}s infinite;
        opacity:0; pointer-events:none;
      `
      container.appendChild(p)
      particles.push(p)
    }

    for (let i = 0; i < 12; i++) {
      const p = document.createElement("div")
      const size = Math.random() * 3 + 2
      const top = 20 + Math.random() * 35
      const duration = 1.5 + Math.random() * 1.5
      const delay = Math.random() * 2.5
      const color = colors[Math.floor(Math.random() * colors.length)]
      p.style.cssText = `
        position:absolute; width:${size}px; height:${size}px;
        border-radius:50%; background:${color};
        top:${top}%; left:50%;
        box-shadow:0 0 ${size * 2}px ${color};
        animation:ptRight ${duration}s linear ${delay}s infinite;
        opacity:0; pointer-events:none;
      `
      container.appendChild(p)
      particles.push(p)
    }

    return () => particles.forEach(p => p.remove())
  }, [])

  return <div ref={containerRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 4 }} />
}

// ── Main Component ─────────────────────────────────────────
export default function HeroSection({ onUpload, onDemo }) {

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .hero-section * { box-sizing: border-box; }

        @keyframes pdot {
          0%,100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.5); }
          60% { box-shadow: 0 0 0 5px rgba(124,58,237,0); }
        }
        @keyframes shimmer {
          0% { background-position: 0%; }
          100% { background-position: 200%; }
        }
        @keyframes floatL {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(-2deg); }
        }
        @keyframes floatR {
          0%,100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes floatC {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-7px); }
        }
        @keyframes brainPulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes hueRotate {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes ringExpand {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes glowPulse {
          0%,100% { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%,-50%) scale(1.15); opacity: 1; }
        }
        @keyframes ptLeft {
          0% { opacity: 0; transform: translateX(0) translateY(0); }
          15% { opacity: 1; }
          85% { opacity: 0.8; }
          100% { opacity: 0; transform: translateX(60px) translateY(-20px); }
        }
        @keyframes ptRight {
          0% { opacity: 0; transform: translateX(0) translateY(0); }
          15% { opacity: 1; }
          85% { opacity: 0.8; }
          100% { opacity: 0; transform: translateX(70px) translateY(-15px); }
        }

        .hero-grad-text {
          background: linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #f97316 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200%;
          animation: shimmer 4s linear infinite;
        }
        .btn-main-hero:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 28px rgba(124,58,237,0.5) !important;
        }
        .btn-watch-hero:hover {
          border-color: #7c3aed !important;
          color: #7c3aed !important;
          transform: translateY(-2px) !important;
        }
        .raw-panel { animation: floatL 6s ease-in-out infinite; }
        .insights-panel { animation: floatR 7s ease-in-out infinite; animation-delay: -3s; }
        .check-card { animation: floatC 5s ease-in-out infinite; animation-delay: -1.5s; }
        .brain-core { animation: brainPulse 3s ease-in-out infinite; }
        .brain-emoji { animation: hueRotate 8s linear infinite; display: inline-block; }
        .ring-1 { animation: ringExpand 3s ease-out infinite; animation-delay: 0s; }
        .ring-2 { animation: ringExpand 3s ease-out infinite; animation-delay: 1s; }
        .ring-3 { animation: ringExpand 3s ease-out infinite; animation-delay: 2s; }
        .scene-glow { animation: glowPulse 4s ease-in-out infinite; }
      `}</style>

      <div
        className="hero-section"
        style={{
          display: "grid",
          /* FIX 1: Increase left-right padding from 48px → 72px */
          gridTemplateColumns: "1fr 1.05fr",
          alignItems: "center",
          padding: "44px 72px 0",
          gap: "20px",
          minHeight: "520px",
          position: "relative",
          overflow: "hidden",
          background: "#f8f6ff",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Background effects */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 70% at 65% 45%, rgba(167,139,250,0.11) 0%, rgba(244,114,182,0.05) 55%, transparent 70%)"
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(124,58,237,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.03) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
          WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 60% 40%,black 20%,transparent 80%)",
          maskImage: "radial-gradient(ellipse 90% 90% at 60% 40%,black 20%,transparent 80%)",
        }} />

        {/* ── LEFT COPY ── */}
        <div style={{ position: "relative", zIndex: 10 }}>

          {/* Eyebrow badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)",
            color: "#6d28d9", fontSize: "11px", fontWeight: 600, padding: "5px 14px",
            borderRadius: "20px", marginBottom: "20px", letterSpacing: "0.2px",
          }}>
            <div style={{
              width: "6px", height: "6px",
              background: "linear-gradient(135deg,#7c3aed,#db2777)",
              borderRadius: "50%", animation: "pdot 2s infinite",
            }} />
            AI + ML · No data team needed
          </div>

          {/* Headline */}
          <div style={{ fontSize: "44px", fontWeight: 900, color: "#0f0a1e", letterSpacing: "-2px", lineHeight: 1.06, marginBottom: "4px" }}>
            Turn your data into
          </div>
          <div style={{ fontSize: "44px", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.06, marginBottom: "20px" }}>
            decisions that{" "}
            <span className="hero-grad-text">drive growth.</span>
          </div>

          {/* Subtext */}
          <p style={{ fontSize: "15px", color: "#4b5563", lineHeight: 1.75, marginBottom: "28px", maxWidth: "410px" }}>
            Upload your CSV and get <strong style={{ color: "#111827", fontWeight: 600 }}>churn predictions</strong>,{" "}
            <strong style={{ color: "#111827", fontWeight: 600 }}>LTV scores</strong>,{" "}
            <strong style={{ color: "#111827", fontWeight: 600 }}>revenue analytics</strong> and{" "}
            <strong style={{ color: "#111827", fontWeight: 600 }}>AI-powered recommendations</strong>{" "}
            — in minutes. No SQL. No data team.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
            <button
              className="btn-main-hero"
              onClick={() => document.getElementById("upload-trigger")?.click()}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "linear-gradient(135deg,#7c3aed,#db2777)",
                color: "#fff", border: "none", padding: "13px 24px",
                borderRadius: "12px", fontSize: "14px", fontWeight: 700,
                cursor: "pointer", letterSpacing: "-0.2px",
                boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
                transition: "all 0.2s",
              }}
            >
              <UploadIcon />
              Upload your data
            </button>
            <button
              className="btn-watch-hero"
              onClick={onDemo}
              style={{
                display: "flex", alignItems: "center", gap: "9px",
                background: "#fff", color: "#374151",
                border: "1.5px solid #e5e7eb",
                padding: "13px 20px", borderRadius: "12px",
                fontSize: "14px", fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              <div style={{
                width: "26px", height: "26px", borderRadius: "50%",
                background: "linear-gradient(135deg,#7c3aed,#db2777)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <PlayIcon />
              </div>
              Watch demo
            </button>
          </div>

          {/* Trust row */}
          <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
            <div style={{ display: "flex" }}>
              {[
                { bg: "#7c3aed", label: "JS" },
                { bg: "#db2777", label: "AR" },
                { bg: "#ea580c", label: "MK" },
                { bg: "#0891b2", label: "PR" },
                { bg: "#059669", label: "SL" },
              ].map((av, i) => (
                <div key={i} style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  border: "2.5px solid #f8f6ff",
                  background: av.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: 700, color: "#fff",
                  marginLeft: i === 0 ? 0 : "-7px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}>
                  {av.label}
                </div>
              ))}
            </div>
            <div style={{ color: "#f59e0b", fontSize: "12px", letterSpacing: "1px" }}>★★★★★</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Trusted by <strong style={{ color: "#111" }}>500+ founders</strong> and growing
            </div>
          </div>
        </div>

        {/* ── RIGHT VISUAL ── */}
        {/*
          FIX 2: Panels too far apart.
          Original: left panel at left:"10px", right panel at right:"0"
          on a wide container this spread them too far.
          Fix: constrain the inner scene to a max-width and center it,
          so panels are closer together regardless of container width.
        */}
        <div style={{ position: "relative", zIndex: 10, height: "460px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: "380px", height: "440px" }}>

            {/* Ambient glow */}
            <div className="scene-glow" style={{
              position: "absolute", width: "220px", height: "220px",
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(124,58,237,0.13),transparent 70%)",
              top: "50%", left: "50%",
              transform: "translate(-50%, -55%)",
            }} />

            {/* ── RAW DATA panel — tightened: was left:10px, now left:0 ── */}
            <div className="raw-panel" style={{
              position: "absolute", top: "10px", left: "-10px", width: "155px",
              background: "linear-gradient(145deg,#1e1b4b,#2e1065)",
              borderRadius: "14px", border: "1px solid rgba(167,139,250,0.25)",
              boxShadow: "0 20px 50px rgba(79,70,229,0.25),0 4px 12px rgba(0,0,0,0.15)",
              overflow: "hidden",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "9px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["#ff5f57","#febc2e","#28c840"].map((c,i) => (
                  <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: c }} />
                ))}
                <span style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "1.5px", textTransform: "uppercase", marginLeft: "4px" }}>Raw Data</span>
              </div>
              {[
                { name: "customers.csv", tag: "2.4MB", tagBg: "rgba(167,139,250,0.15)", tagColor: "#a78bfa" },
                { name: "orders.csv", tag: "PREDICT", tagBg: "rgba(99,102,241,0.2)", tagColor: "#818cf8" },
                { name: "events.csv", tag: "890KB", tagBg: "rgba(167,139,250,0.15)", tagColor: "#a78bfa" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "7px 12px", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "5px", background: "rgba(167,139,250,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileIcon />
                  </div>
                  <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{f.name}</span>
                  <span style={{ marginLeft: "auto", fontSize: "8px", fontWeight: 600, padding: "1px 5px", borderRadius: "4px", background: f.tagBg, color: f.tagColor, whiteSpace: "nowrap" }}>{f.tag}</span>
                </div>
              ))}
              <div style={{ fontSize: "9px", color: "rgba(167,139,250,0.5)", padding: "7px 12px", fontWeight: 500 }}>+ 3 more files</div>
            </div>

            {/* ── SVG flow lines — updated coords to match tighter layout ── */}
            <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 3 }} viewBox="0 0 380 440" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1"/>
                </linearGradient>
                <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.1"/>
                  <stop offset="100%" stopColor="#db2777" stopOpacity="0.6"/>
                </linearGradient>
                <filter id="glow2">
                  <feGaussianBlur stdDeviation="2" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              {/* Left panel → brain */}
              <path d="M 155 130 C 200 130, 190 210, 190 220" stroke="url(#lg1)" strokeWidth="1.5" fill="none" opacity="0.7"/>
              <path d="M 155 148 C 202 148, 192 212, 192 220" stroke="url(#lg1)" strokeWidth="1" fill="none" opacity="0.4"/>
              {/* Brain → right panel */}
              <path d="M 190 220 C 190 230, 200 130, 242 110" stroke="url(#lg2)" strokeWidth="1.5" fill="none" opacity="0.7"/>
              <path d="M 192 220 C 192 232, 205 140, 244 120" stroke="url(#lg2)" strokeWidth="1" fill="none" opacity="0.4"/>
              {/* Animated dots */}
              <circle r="3" fill="#a78bfa" filter="url(#glow2)">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 155 130 C 200 130, 190 210, 190 220"/>
              </circle>
              <circle r="2" fill="#c4b5fd" opacity="0.6">
                <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.8s" path="M 155 145 C 201 145, 191 212, 191 220"/>
              </circle>
              <circle r="3" fill="#f472b6" filter="url(#glow2)">
                <animateMotion dur="2s" repeatCount="indefinite" begin="0.5s" path="M 190 220 C 190 230, 200 130, 242 110"/>
              </circle>
              <circle r="2" fill="#db2777" opacity="0.6">
                <animateMotion dur="2.5s" repeatCount="indefinite" begin="1.2s" path="M 192 220 C 192 232, 205 140, 244 120"/>
              </circle>
            </svg>

            {/* ── BRAIN CENTER — centered in the 380px scene ── */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -55%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", zIndex: 5,
            }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {["ring-1","ring-2","ring-3"].map((cls,i) => (
                  <div key={i} className={cls} style={{
                    position: "absolute", width: "72px", height: "72px",
                    borderRadius: "50%", border: "1px solid rgba(124,58,237,0.25)",
                  }} />
                ))}
                <div className="brain-core" style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  background: "linear-gradient(135deg,#4c1d95,#7c3aed,#a855f7)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 0 8px rgba(124,58,237,0.1),0 0 30px rgba(124,58,237,0.4),0 0 60px rgba(124,58,237,0.15)",
                  position: "relative", zIndex: 10,
                }}>
                  <span className="brain-emoji" style={{ fontSize: "28px" }}>🧠</span>
                </div>
              </div>
              <div style={{
                background: "#fff", border: "1px solid #ede9fe",
                borderRadius: "8px", padding: "5px 10px",
                fontSize: "9px", fontWeight: 700, color: "#7c3aed",
                letterSpacing: "0.5px", textTransform: "uppercase",
                boxShadow: "0 4px 12px rgba(124,58,237,0.1)", whiteSpace: "nowrap",
              }}>
                ML models · AI insights
              </div>
            </div>

            {/* ── AI INSIGHTS panel — right:0 within the 380px scene ── */}
            <div className="insights-panel" style={{
              position: "absolute", top: "20px", right: "-40px", width: "158px",
              background: "linear-gradient(145deg,#0a0614,#1a0533)",
              borderRadius: "14px", border: "1px solid rgba(167,139,250,0.2)",
              boxShadow: "0 20px 50px rgba(124,58,237,0.2),0 4px 12px rgba(0,0,0,0.2)",
              overflow: "hidden",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "9px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["#ff5f57","#febc2e","#28c840"].map((c,i) => (
                  <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: c }} />
                ))}
                <span style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "1.5px", textTransform: "uppercase", marginLeft: "4px" }}>AI Insights</span>
              </div>
              {[
                { label: "Churn risk", value: "2%", valueColor: "#f87171", sub: "At risk customers", subColor: "#fca5a5", bars: ["#4c1d95","#6d28d9","#7c3aed","#ef4444"], barHeights: [35,55,45,100] },
                { label: "LTV Score", value: "$285", valueColor: "#fff", sub: "↑ 12% vs last month", subColor: "#86efac", bars: ["#1e3a5f","#1d4ed8","#3b82f6","#60a5fa"], barHeights: [30,50,75,90] },
                { label: "Revenue Growth", value: "$24.5K", valueColor: "#fff", sub: "↑ 12% vs last month", subColor: "#86efac", bars: ["#14532d","#15803d","#16a34a","#22c55e"], barHeights: [35,55,75,100] },
                { label: "Top Segment", value: "High Value Users", valueColor: "#fff", sub: "56% of revenue", subColor: "#c4b5fd", bars: null },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: i < 3 ? "0.5px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                    <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{row.label}</span>
                    <span style={{ fontSize: i === 3 ? "11px" : "14px", fontWeight: 800, color: row.valueColor, letterSpacing: "-0.5px", lineHeight: 1.2 }}>{row.value}</span>
                    <span style={{ fontSize: "8px", fontWeight: 600, color: row.subColor }}>{row.sub}</span>
                  </div>
                  {row.bars && (
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "22px" }}>
                      {row.bars.map((color, j) => (
                        <div key={j} style={{ width: "5px", height: `${row.barHeights[j]}%`, background: color, borderRadius: "1px 1px 0 0" }} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ── CHECKLIST card — repositioned for tighter scene ── */}
            <div className="check-card" style={{
              position: "absolute", bottom: "30px", left: "50%",
              width: "148px",
              background: "#fff", borderRadius: "12px",
              border: "1px solid #ede9fe",
              boxShadow: "0 12px 32px rgba(124,58,237,0.1),0 2px 8px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}>
              <div style={{ background: "#faf5ff", padding: "7px 12px", borderBottom: "1px solid #f3e8ff" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, color: "#7c3aed", letterSpacing: "0.5px", textTransform: "uppercase" }}>✓ Auto-cleaned</span>
              </div>
              {["Missing values fixed", "Duplicates removed", "Outliers detected"].map((text, i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "5px 12px", borderBottom: i < arr.length - 1 ? "0.5px solid #f8f9fa" : "none" }}>
                  <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <CheckIcon />
                  </div>
                  <span style={{ fontSize: "9px", color: "#374151", fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* FIX 3: "All in under 60 seconds" REMOVED */}

            {/* Particles */}
            <Particles />
          </div>
        </div>
      </div>
    </>
  )
}
