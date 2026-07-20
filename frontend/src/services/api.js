import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
})

export const uploadFile = (file) => {
  const form = new FormData()
  form.append("file", file)
  return API.post("/upload", form)
}

export const getRevenueTrend = (batchId) =>
  API.get(`/kpis/revenue-trend?batch_id=${batchId}`)

export const getAOV = (batchId) =>
  API.get(`/kpis/aov?batch_id=${batchId}`)

export const getTopCustomers = (batchId) =>
  API.get(`/kpis/top-customers?batch_id=${batchId}`)

export const getChannelPerformance = (batchId) =>
  API.get(`/kpis/channel-performance?batch_id=${batchId}`)

export const getCategoryPerformance = (batchId) =>
  API.get(`/kpis/category-performance?batch_id=${batchId}`)

export const getChurn = (batchId) =>
  API.get(`/ml/churn?batch_id=${batchId}`)

export const getSegments = (batchId) =>
  API.get(`/ml/segments?batch_id=${batchId}`)

export const getLTV = (batchId) =>
  API.get(`/ml/ltv?batch_id=${batchId}`)

export const getAnomalies = (batchId) =>
  API.get(`/ml/anomalies?batch_id=${batchId}`)

export const getAISummary = (batchId) =>
  API.get(`/ai/summary?batch_id=${batchId}`)

export const askQuestion = (batchId, question) =>
  API.post("/ai/ask", { batch_id: batchId, question })

export const getRecommendations = (batchId) =>
  API.get(`/ai/recommendations?batch_id=${batchId}`)

export const loadDemo = () => API.post("/upload/demo")