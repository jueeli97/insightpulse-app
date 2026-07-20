
import React, { useRef, useState } from "react"


const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const UploadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

const LockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const checklist = [
  { title: "ETL runs automatically", desc: "— cleans column names, fixes date formats, removes duplicates" },
  { title: "4 ML models train instantly", desc: "— churn prediction, segmentation, LTV, anomaly detection" },
  { title: "AI copilot activates", desc: "— answers any business question in plain English instantly" },
  { title: "Full dashboard populates", desc: "— KPIs, charts, predictions and recommendations ready" },
]

const avatars = [
  { bg: "#7c3aed", label: "JS" },
  { bg: "#db2777", label: "AR" },
  { bg: "#ea580c", label: "MK" },
  { bg: "#0891b2", label: "PR" },
  { bg: "#059669", label: "SL" },
]

const stats = [
  { num: "60s", label: "Upload to insights" },
  { num: "4",   label: "ML models running" },
  { num: "$0",  label: "No tools needed" },
]

export default function UploadSection({ onUpload }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)
  const [zoneHovered, setZoneHovered] = useState(false)

  const handleFile = (file) => {
    if (!file) return
    onUpload?.(file)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        @keyframes orbFloat {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes bdot {
          0%,100% { box-shadow: 0 0 0 0 rgba(167,139,250,0.5); }
          60% { box-shadow: 0 0 0 4px rgba(167,139,250,0); }
        }
        @keyframes uShimmer {
          0% { background-position: 0%; }
          100% { background-position: 200%; }
        }
        @keyframes uBob {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        @keyframes dragDot {
          0%,100% { box-shadow: 0 0 0 0 rgba(167,139,250,0.5); }
          60% { box-shadow: 0 0 0 3px rgba(167,139,250,0); }
        }

        .u-btn-hover:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 32px rgba(124,58,237,0.55) !important;
        }
        .u-check-icon-wrap {
          animation: none;
        }
      `}</style>

      <section id="upload-section" style={{
        background: "linear-gradient(135deg,#0f0a1e 0%,#1e0a3c 35%,#2d0a4e 60%,#3b0764 100%)",
        padding: "80px 72px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}>
        {/* Orbs */}
        {[
          { w: 500, h: 500, color: "rgba(124,58,237,0.18)", top: "-160px", left: "-80px", dur: "10s" },
          { w: 350, h: 350, color: "rgba(219,39,119,0.12)", bottom: "-100px", right: "10%", dur: "13s", reverse: true },
          { w: 200, h: 200, color: "rgba(99,102,241,0.1)", top: "30%", right: "20%", dur: "8s" },
        ].map((orb, i) => (
          <div key={i} style={{
            position: "absolute",
            width: orb.w, height: orb.h,
            borderRadius: "50%",
            background: `radial-gradient(circle,${orb.color},transparent 65%)`,
            top: orb.top, left: orb.left, bottom: orb.bottom, right: orb.right,
            pointerEvents: "none",
            animation: `orbFloat ${orb.dur} ease-in-out infinite ${orb.reverse ? "reverse" : ""}`,
          }} />
        ))}

        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(167,139,250,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(167,139,250,0.04) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }} />

        <div style={{
          position: "relative", zIndex: 5,
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "72px", alignItems: "center",
        }}>

          {/* ── LEFT ── */}
          <div>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)",
              color: "#c4b5fd", fontSize: "11px", fontWeight: 600,
              padding: "5px 13px", borderRadius: "20px", marginBottom: "20px",
            }}>
              <div style={{ width: "6px", height: "6px", background: "linear-gradient(135deg,#a78bfa,#f472b6)", borderRadius: "50%", animation: "bdot 2s infinite" }} />
              Free to start · no credit card needed
            </div>

            {/* Title */}
            <div style={{ fontSize: "38px", fontWeight: 900, color: "#fff", letterSpacing: "-1.6px", lineHeight: 1.06, marginBottom: "12px" }}>
              Upload your data.<br />Get answers in<br />
              <span style={{
                background: "linear-gradient(135deg,#a78bfa,#f472b6,#fb923c)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", backgroundSize: "200%",
                animation: "uShimmer 4s linear infinite",
              }}>
                60 seconds.
              </span>
            </div>

            {/* Sub */}
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: "28px", maxWidth: "380px" }}>
              Replace hours of spreadsheet work with one file upload. Here's exactly what happens the moment you drop your CSV:
            </p>

            {/* Checklist */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
              {checklist.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "11px" }}>
                  <div style={{
                    width: "22px", height: "22px", borderRadius: "7px",
                    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: "1px",
                    boxShadow: "0 2px 8px rgba(124,58,237,0.4)",
                  }}>
                    <CheckIcon />
                  </div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.55 }}>
                    <strong style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>{item.title}</strong>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Trust row */}
            <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
              <div style={{ display: "flex" }}>
                {avatars.map((av, i) => (
                  <div key={i} style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    border: "2.5px solid rgba(255,255,255,0.1)",
                    background: av.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", fontWeight: 700, color: "#fff",
                    marginLeft: i === 0 ? 0 : "-7px",
                  }}>
                    {av.label}
                  </div>
                ))}
              </div>
              <div style={{ color: "#f59e0b", fontSize: "12px", letterSpacing: "1px" }}>★★★★★</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                Trusted by <strong style={{ color: "rgba(255,255,255,0.7)" }}>500+ founders</strong>
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div style={{ position: "relative" }}>
            {/* Glow */}
            <div style={{
              position: "absolute", inset: "-20px",
              background: "radial-gradient(ellipse,rgba(124,58,237,0.15),transparent 70%)",
              borderRadius: "32px", pointerEvents: "none",
            }} />

            {/* Upload zone */}
            <div
              onMouseEnter={() => setZoneHovered(true)}
              onMouseLeave={() => setZoneHovered(false)}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                handleFile(e.dataTransfer.files[0])
              }}
              onClick={() => inputRef.current?.click()}
              style={{
                background: dragging ? "rgba(124,58,237,0.12)" : zoneHovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
                border: `2px dashed ${dragging || zoneHovered ? "rgba(167,139,250,0.65)" : "rgba(167,139,250,0.35)"}`,
                borderRadius: "20px", padding: "40px 32px",
                textAlign: "center", cursor: "pointer",
                transition: "all 0.25s",
                transform: zoneHovered ? "translateY(-3px)" : "translateY(0)",
                boxShadow: zoneHovered ? "0 20px 48px rgba(124,58,237,0.2)" : "none",
                backdropFilter: "blur(8px)",
                position: "relative", overflow: "hidden",
              }}
            >
              {/* Drag badge */}
              <div style={{
                position: "absolute", top: "12px", right: "12px",
                display: "flex", alignItems: "center", gap: "4px",
                fontSize: "9px", fontWeight: 600, color: "#a78bfa",
                background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)",
                padding: "3px 8px", borderRadius: "20px",
              }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#a78bfa", animation: "dragDot 1.5s infinite" }} />
                drag & drop
              </div>

              {/* Icon */}
              <div style={{
                width: "80px", height: "80px", borderRadius: "22px",
                background: zoneHovered
                  ? "linear-gradient(135deg,rgba(124,58,237,0.3),rgba(219,39,119,0.2))"
                  : "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(219,39,119,0.15))",
                border: `1px solid ${zoneHovered ? "rgba(167,139,250,0.4)" : "rgba(167,139,250,0.2)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 18px", fontSize: "36px",
                animation: "uBob 3s ease-in-out infinite",
                transition: "all 0.25s",
              }}>
                📂
              </div>

              <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "6px", letterSpacing: "-0.4px" }}>
                Drop your sales file here
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "18px", lineHeight: 1.6 }}>
                Shopify · WooCommerce · any CSV or Excel<br />
                Processed securely · never shared externally
              </div>

              {/* Formats */}
              <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "22px" }}>
                {[".csv", ".xlsx", ".xls"].map((fmt) => (
                  <span key={fmt} style={{
                    fontSize: "10px", fontWeight: 600,
                    background: "rgba(124,58,237,0.15)", color: "#c4b5fd",
                    padding: "4px 12px", borderRadius: "20px",
                    border: "1px solid rgba(124,58,237,0.25)",
                  }}>{fmt}</span>
                ))}
              </div>

              {/* Button */}
              <button
                className="u-btn-hover"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: "8px", width: "100%",
                  background: "linear-gradient(135deg,#7c3aed,#db2777)",
                  color: "#fff", border: "none",
                  padding: "14px 24px", borderRadius: "12px",
                  fontSize: "14px", fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
                  transition: "all 0.2s", letterSpacing: "-0.2px",
                }}
              >
                <UploadIcon />
                Upload your data — it's free
              </button>

              {/* Privacy */}
              <div style={{
                fontSize: "11px", color: "rgba(255,255,255,0.25)",
                marginTop: "13px", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "5px",
              }}>
                <LockIcon />
                Secure · private · never stored externally
              </div>

              <input
                ref={inputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>

            {/* Stats strip */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3,1fr)",
              marginTop: "14px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}>
              {stats.map((s, i) => (
                <div key={i} style={{
                  padding: "14px 12px", textAlign: "center",
                  borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}>
                  <div style={{
                    fontSize: "18px", fontWeight: 800, letterSpacing: "-0.5px",
                    background: "linear-gradient(135deg,#a78bfa,#f472b6)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>{s.num}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "2px", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
