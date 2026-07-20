


// src/components/Navbar.jsx
import { useNavigate, useLocation } from "react-router-dom"

const HomeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const FeaturesIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const HowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
)
const DemoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)
const GithubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
)
const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

const links = [
  { label: "Home",         path: "/",          Icon: HomeIcon },
  { label: "Features",     path: "/#features", Icon: FeaturesIcon },
  { label: "How it works", path: "/#how-it-works",       Icon: HowIcon },
  { label: "Demo",         path: "/#demo",      Icon: DemoIcon },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/" && !location.hash
    return location.hash === "#" + path.split("#")[1]
  }

  const handleNav = (path) => {
    if (path.includes("#")) {
      navigate("/")
      setTimeout(() => {
        document.getElementById(path.split("#")[1])?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } else {
      navigate(path)
    }
  }

  return (
    <>
      <style>{`
        .nb-link { transition: background 0.15s, color 0.15s; }
        .nb-link:hover { background: #f5f3ff !important; color: #7c3aed !important; }
        .nb-gh:hover { background: #f5f3ff !important; border-color: #c4b5fd !important; color: #7c3aed !important; }
        .nb-gh:hover svg { stroke: #7c3aed; }
        .nb-cta { transition: all 0.2s; }
        .nb-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(124,58,237,0.45) !important; }
        .nb-cta:hover .nb-arrow { transform: translateX(3px); }
        .nb-arrow { transition: transform 0.2s; }
      `}</style>

      <div style={{ width: "100%", padding: "16px 24px", background: "#f0eef8" }}>
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#fff", borderRadius: "20px", padding: "0 24px", height: "68px",
          border: "1px solid #ede9fe",
          boxShadow: "0 2px 16px rgba(124,58,237,0.07), 0 1px 4px rgba(0,0,0,0.03)",
        }}>

          {/* Logo */}
          <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "12px",
              background: "linear-gradient(135deg,#7c3aed,#a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              boxShadow: "0 0 0 4px rgba(124,58,237,0.12), 0 4px 16px rgba(124,58,237,0.4)",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <span style={{ fontSize: "19px", fontWeight: 800, color: "#0f0a1e", letterSpacing: "-0.6px", fontFamily: "Inter,sans-serif" }}>
              InsightPulse
            </span>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {links.map(({ label, path, Icon }) => {
              const active = isActive(path)
              return (
                <button key={label} onClick={() => handleNav(path)} className="nb-link"
                  style={{
                    position: "relative", display: "flex", alignItems: "center", gap: "6px",
                    fontSize: "13px", padding: "8px 14px", borderRadius: "10px",
                    fontWeight: active ? 600 : 500,
                    color: active ? "#7c3aed" : "#6b7280",
                    background: active ? "#f5f3ff" : "none",
                    border: "none", cursor: "pointer", whiteSpace: "nowrap",
                    fontFamily: "Inter,sans-serif",
                  }}
                >
                  <Icon/>
                  {label}
                  {active && (
                    <span style={{
                      position: "absolute", bottom: "-14px", left: "50%",
                      transform: "translateX(-50%)", width: "26px", height: "3px",
                      background: "linear-gradient(90deg,#7c3aed,#db2877)", borderRadius: "3px",
                    }}/>
                  )}
                </button>
              )
            })}
          </div>

          {/* Right side — replaced Sign in / Get started with useful actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

            {/* GitHub link — shows you're a dev, links to portfolio/repo */}
            <a
              href="https://github.com/jueelisawant/insightpulse"
              target="_blank"
              rel="noopener noreferrer"
              className="nb-gh"
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "13px", fontWeight: 500, color: "#6b7280",
                padding: "8px 14px", borderRadius: "10px",
                border: "1px solid #e5e7eb", background: "#fff",
                textDecoration: "none", fontFamily: "Inter,sans-serif",
                transition: "all 0.15s",
              }}
            >
              <GithubIcon/>
              GitHub
            </a>

            {/* Primary CTA — scrolls smoothly to the upload section */}
            <button
              className="nb-cta"
              onClick={() => {
                const el = document.getElementById("upload-section")
                if (el) el.scrollIntoView({ behavior: "smooth" })
              }}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                fontSize: "13px", fontWeight: 700, color: "#fff",
                padding: "11px 22px", borderRadius: "12px", border: "none",
                background: "linear-gradient(135deg,#7c3aed,#db2877)",
                boxShadow: "0 3px 14px rgba(124,58,237,0.35)",
                cursor: "pointer", fontFamily: "Inter,sans-serif",
                letterSpacing: "-0.2px",
              }}
            >
              <UploadIcon/>
              Upload
              <svg className="nb-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </>
  )
}
