import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import upload, kpis, ml, ai

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="InsightPulse API",
    description="AI Customer Intelligence Platform Backend",
    version="1.0.0"
)

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

# Allow all vercel preview deployments
ALLOW_ORIGIN_REGEX = r"https://.*\.vercel\.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=ALLOW_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api")
app.include_router(kpis.router, prefix="/api/kpis")
app.include_router(ml.router, prefix="/api/ml")
app.include_router(ai.router, prefix="/api/ai")

@app.get("/")
def home():
    return {"message": "InsightPulse backend is running"}