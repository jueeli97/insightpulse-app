import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./index.css"
import UploadPage from "./pages/UploadPage"
import DashboardPage from "./pages/DashboardPage"
import MLPage from "./pages/MLPage"
import CopilotPage from "./pages/CopilotPage"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/dashboard/:batchId" element={<DashboardPage />} /> 
      <Route path="/ml/:batchId" element={<MLPage />} /> 
      <Route path="/copilot/:batchId" element={<CopilotPage />} /> 
    </Routes>
  </BrowserRouter>
)