
import React from "react"
import { useNavigate } from "react-router-dom"
import { uploadFile, loadDemo } from "../services/api"
import Navbar from "../components/Navbar"
import HeroSection from "../components/HeroSection"
import FeatureStrip from "../components/FeatureStrip"
import HowItWorks from "../components/HowItWorks"
import UploadSection from "../components/UploadSection"
import Footer from "../components/Footer"

export default function UploadPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)
  const [loadingMsg, setLoadingMsg] = React.useState("Processing your data...")
  const [error, setError] = React.useState("")

  const handleUpload = async (file) => {
    if (!file) return
    setLoading(true)
    setLoadingMsg("Processing your data...")
    setError("")
    try {
      const res = await uploadFile(file)
      navigate(`/dashboard/${res.data.batch_id}`)
    } catch (e) {
      setError("Upload failed. Make sure your backend is running.")
      setLoading(false)
    }
  }

  const handleDemo = async () => {
    setLoading(true)
    setLoadingMsg("Loading demo dataset...")
    setError("")
    try {
      const res = await loadDemo()
      navigate(`/dashboard/${res.data.batch_id}`)
    } catch (e) {
      setError("Demo failed. Make sure your backend is running.")
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f6ff" }}>
      <Navbar />
      <HeroSection onUpload={handleUpload} onDemo={handleDemo} />
      <div id="features"><FeatureStrip /></div>
      <div id="how-it-works"><HowItWorks onUpload={handleUpload} /></div>
      <div id="upload"><UploadSection onUpload={handleUpload} /></div>
      <Footer />

      {loading && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,10,30,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, backdropFilter: "blur(4px)",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧠</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{loadingMsg}</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Running ETL · Training ML models · Activating AI copilot</div>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
          background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
          padding: "12px 20px", borderRadius: "12px", fontSize: "13px", fontWeight: 500,
          zIndex: 1000, boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}>
          {error}
        </div>
      )}
    </div>
  )
}