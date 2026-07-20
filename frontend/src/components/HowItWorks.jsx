import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const steps = [
  {
    icon: "📂",
    num: "1",
    title: "Upload your file",
    desc: "Drop your Shopify, WooCommerce, or any CSV/Excel export. Our ETL engine cleans, validates, and structures your data automatically.",
    tag: "CSV · Excel · Any format",
    tagBg: "#eef2ff",
    tagColor: "#4f46e5",
    iconBg: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
    badgeBg: "linear-gradient(135deg,#7c3aed,#a855f7)",
    badgeShadow: "rgba(124,58,237,0.4)",
    borderC1: "#7c3aed",
    borderC2: "#a855f7",
    hoverShadow: "rgba(124,58,237,0.25)",
    hoverTitle: "#7c3aed",
    preview: [
      { icon: "✓", iconBg: "#f0fdf4", text: "Missing values fixed" },
      { icon: "✓", iconBg: "#f0fdf4", text: "Duplicates removed" },
      { icon: "✓", iconBg: "#f0fdf4", text: "Revenue auto-computed" },
    ],
  },
  {
    icon: "🧠",
    num: "2",
    title: "ML models run instantly",
    desc: "XGBoost predicts who will churn. KMeans segments your customers. Isolation Forest flags anomalies. All in under 30 seconds — logged with MLflow.",
    tag: "XGBoost · KMeans · scikit-learn",
    tagBg: "#fdf2f8",
    tagColor: "#be185d",
    iconBg: "linear-gradient(135deg,#fdf2f8,#fce7f3)",
    badgeBg: "linear-gradient(135deg,#db2777,#f472b6)",
    badgeShadow: "rgba(219,39,119,0.4)",
    borderC1: "#db2777",
    borderC2: "#f472b6",
    hoverShadow: "rgba(219,39,119,0.25)",
    hoverTitle: "#db2777",
    preview: [
      { icon: "⚠", iconBg: "#fef2f2", text: "Churn risk scored 0–1" },
      { icon: "🎯", iconBg: "#fdf4ff", text: "Customers segmented" },
      { icon: "📈", iconBg: "#fff7ed", text: "LTV predicted" },
    ],
  },
  {
    icon: "✨",
    num: "3",
    title: "Ask your AI copilot",
    desc: "Type \"Why did revenue drop?\" or \"Which customers should I contact today?\" and get a specific, data-backed answer with action steps.",
    tag: "Gemini AI · Plain English · Instant",
    tagBg: "#fff7ed",
    tagColor: "#c2410c",
    iconBg: "linear-gradient(135deg,#fff7ed,#ffedd5)",
    badgeBg: "linear-gradient(135deg,#ea580c,#fb923c)",
    badgeShadow: "rgba(234,88,12,0.4)",
    borderC1: "#ea580c",
    borderC2: "#fb923c",
    hoverShadow: "rgba(234,88,12,0.25)",
    hoverTitle: "#ea580c",
    preview: [
      { icon: "💬", iconBg: "#eef2ff", text: '"Why did revenue drop?"', italic: true },
      { icon: "💬", iconBg: "#eef2ff", text: '"Who should I contact today?"', italic: true },
      { icon: "💬", iconBg: "#eef2ff", text: '"Which channel works best?"', italic: true },
    ],
  },
]

function StepCard({ step, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ padding: "0 12px", textAlign: "center", cursor: "pointer" }}
    >
      {/* Icon circle */}
      <div style={{ position: "relative", display: "inline-flex", marginBottom: "24px" }}>
        <div style={{
          width: "104px", height: "104px", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "38px",
          background: step.iconBg,
          border: hovered ? `2px solid transparent` : "2px solid transparent",
          outline: hovered ? `2px solid ${step.borderC1}` : "2px solid transparent",
          outlineOffset: "2px",
          transition: "all 0.3s",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered ? `0 12px 32px ${step.hoverShadow}` : "none",
          position: "relative", zIndex: 2,
        }}>
          {step.icon}
        </div>

        {/* Number badge */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: "28px", height: "28px", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", fontWeight: 800, color: "#fff",
          background: step.badgeBg,
          boxShadow: `0 3px 10px ${step.badgeShadow}`,
          zIndex: 3,
          transform: hovered ? "scale(1.12)" : "scale(1)",
          transition: "transform 0.3s",
        }}>
          {step.num}
        </div>
      </div>

      {/* Title */}
      <div style={{
        fontSize: "17px", fontWeight: 700,
        color: hovered ? step.hoverTitle : "#0f0a1e",
        marginBottom: "8px", letterSpacing: "-0.4px",
        transition: "color 0.2s",
      }}>
        {step.title}
      </div>

      {/* Description */}
      <div style={{
        fontSize: "12.5px", color: "#6b7280",
        lineHeight: 1.7, marginBottom: "14px",
      }}>
        {step.desc}
      </div>

      {/* Tag */}
      <span style={{
        display: "inline-flex", fontSize: "10px", fontWeight: 600,
        padding: "4px 12px", borderRadius: "20px",
        background: step.tagBg, color: step.tagColor,
      }}>
        {step.tag}
      </span>

      {/* Preview card */}
      <div style={{
        background: hovered ? "#faf9ff" : "#f8fafc",
        border: `1px solid ${hovered ? "rgba(124,58,237,0.15)" : "#f1f5f9"}`,
        borderRadius: "10px", padding: "10px 12px",
        marginTop: "16px", textAlign: "left",
        transition: "all 0.3s",
      }}>
        {step.preview.map((row, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "7px",
            padding: "4px 0", fontSize: "10px",
            color: row.italic ? "#7c3aed" : "#374151",
            fontStyle: row.italic ? "italic" : "normal",
            borderBottom: i < step.preview.length - 1 ? "0.5px solid #f1f5f9" : "none",
          }}>
            <div style={{
              width: "14px", height: "14px", borderRadius: "4px",
              background: row.iconBg,
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "8px", flexShrink: 0,
            }}>
              {row.icon}
            </div>
            {row.text}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HowItWorks() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        @keyframes connGrow {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes connLight {
          0% { left: -40px; }
          100% { left: 100%; }
        }

        .hiw-cta-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 28px rgba(124,58,237,0.45) !important;
        }
      `}</style>

      <section style={{
        background: "#fff",
        padding: "72px 72px 64px",
        fontFamily: "'Inter', sans-serif",
      }}>

        {/* Section header */}
        <div style={{ marginBottom: "56px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            fontSize: "11px", fontWeight: 700, color: "#7c3aed",
            letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px",
          }}>
            <div style={{ width: "24px", height: "2px", background: "linear-gradient(90deg,#7c3aed,#db2777)", borderRadius: "2px" }} />
            How it works
            <div style={{ width: "24px", height: "2px", background: "linear-gradient(90deg,#db2777,#f97316)", borderRadius: "2px" }} />
          </div>

          <div style={{ fontSize: "36px", fontWeight: 900, color: "#0f0a1e", letterSpacing: "-1.4px", lineHeight: 1.1, marginBottom: "10px" }}>
            From messy data to{" "}
            <span style={{
              background: "linear-gradient(135deg,#7c3aed,#db2777)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              business clarity
            </span>
            <br />in 3 simple steps
          </div>

          <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.7, maxWidth: "480px" }}>
            No setup. No SQL. No waiting for your data team. Upload once and get insights that used to take 2 weeks — in under 60 seconds.
          </div>
        </div>

        {/* Steps */}
        <div style={{ position: "relative" }}>

          {/* Connector line */}
          <div style={{
            position: "absolute", top: "52px",
            left: "calc(16.5% + 52px)",
            right: "calc(16.5% + 52px)",
            height: "2px", background: "#f1f5f9", zIndex: 0,
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg,#7c3aed,#db2777)",
              borderRadius: "2px",
              animation: "connGrow 1.5s ease-out 0.3s both",
              overflow: "hidden",
            }}>
              {/* Dot left */}
              <div style={{
                position: "absolute", left: "-4px", top: "50%",
                transform: "translateY(-50%)",
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#7c3aed",
                boxShadow: "0 0 0 3px rgba(124,58,237,0.2)",
              }} />
              {/* Dot right */}
              <div style={{
                position: "absolute", right: "-4px", top: "50%",
                transform: "translateY(-50%)",
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#db2777",
                boxShadow: "0 0 0 3px rgba(219,39,119,0.2)",
              }} />
              {/* Moving light */}
              <div style={{
                position: "absolute", top: "-3px",
                width: "40px", height: "8px", borderRadius: "4px",
                background: "linear-gradient(90deg,transparent,rgba(167,139,250,0.9),transparent)",
                animation: "connLight 2.5s linear 1.8s infinite",
              }} />
            </div>
          </div>

          {/* Step cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "24px",
            position: "relative", zIndex: 1,
          }}>
            {steps.map((step, i) => (
              <StepCard key={i} step={step} index={i} />
            ))}
          </div>
        </div>

       
      </section>
    </>
  )
}
