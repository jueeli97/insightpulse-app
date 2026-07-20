export default function FeatureStrip() {
  const features = [
    {
      icon: "⚡",
      iconBg: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
      iconShadow: "0 4px 12px rgba(99,102,241,0.15)",
      title: "No code. No hassle.",
      desc: "Upload and get started in seconds.",
      accent: "#6366f1",
    },
    {
      icon: "🎯",
      iconBg: "linear-gradient(135deg,#fdf4ff,#f3e8ff)",
      iconShadow: "0 4px 12px rgba(124,58,237,0.15)",
      title: "AI you can trust.",
      desc: "Built on proven models. Transparent results.",
      accent: "#7c3aed",
    },
    {
      icon: "🔒",
      iconBg: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
      iconShadow: "0 4px 12px rgba(22,163,74,0.12)",
      title: "Secure by design.",
      desc: "Enterprise-grade security and privacy.",
      accent: "#16a34a",
    },
    {
      icon: "📈",
      iconBg: "linear-gradient(135deg,#fff7ed,#ffedd5)",
      iconShadow: "0 4px 12px rgba(234,88,12,0.12)",
      title: "Actionable insights.",
      desc: "Clear recommendations that drive real growth.",
      accent: "#ea580c",
    },
  ]

  return (
    <>
      <style>{`
        .fs-wrap {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: #d7a8ee66;
          /* FIX 4: Top border matches hero bottom edge cleanly */
          border-top: 1px solid #ede9fe;
          /* Consistent horizontal padding with hero (72px) */
          padding: 0 72px;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 4px 24px rgba(124,58,237,0.04);
        }
        .fs-item {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 20px 20px 20px 0;
          position: relative;
          transition: all 0.2s;
        }
        .fs-item:not(:last-child) {
          border-right: 1px solid #f3f0ff;
          margin-right: 20px;
        }
        .fs-item:not(:first-child) {
          padding-left: 20px;
        }
        .fs-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 18px;
          transition: transform 0.2s;
        }
        .fs-item:hover .fs-icon-wrap {
          transform: scale(1.08);
        }
        .fs-title {
          font-size: 12px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 3px;
          letter-spacing: -0.1px;
        }
        .fs-desc {
          font-size: 11px;
          color: #6b7280;
          line-height: 1.5;
        }
      `}</style>

      <div className="fs-wrap">
        {features.map((f, i) => (
          <div key={i} className="fs-item">
            <div
              className="fs-icon-wrap"
              style={{
                background: f.iconBg,
                boxShadow: f.iconShadow,
              }}
            >
              {f.icon}
            </div>
            <div>
              <div className="fs-title">{f.title}</div>
              <div className="fs-desc">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
