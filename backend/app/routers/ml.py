from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services import kpi_service, ml_service

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def load_df(batch_id: str, db: Session):
    df = kpi_service.get_dataframe(db, batch_id)
    if df.empty:
        raise HTTPException(status_code=404, detail=f"No data found for batch_id: {batch_id}")
    return df

@router.get("/churn")
def churn_prediction(batch_id: str, db: Session = Depends(get_db)):
    df = load_df(batch_id, db)
    results = ml_service.predict_churn(df)
    return {
        "batch_id": batch_id,
        "model": "XGBoost Churn Classifier",
        "total_customers": len(results),
        "churned_count": sum(r["churn_prediction"] for r in results),
        "predictions": results
    }

@router.get("/segments")
def customer_segments(batch_id: str, n_clusters: int = 3, db: Session = Depends(get_db)):
    df = load_df(batch_id, db)
    results = ml_service.segment_customers(df, n_clusters)
    return {
        "batch_id": batch_id,
        "model": "KMeans Customer Segmentation",
        "n_clusters": n_clusters,
        "segments": results
    }

@router.get("/ltv")
def ltv_prediction(batch_id: str, db: Session = Depends(get_db)):
    df = load_df(batch_id, db)
    results = ml_service.predict_ltv(df)
    return {
        "batch_id": batch_id,
        "model": "Linear Regression LTV",
        "predictions": results
    }

@router.get("/anomalies")
def anomaly_detection(batch_id: str, db: Session = Depends(get_db)):
    df = load_df(batch_id, db)
    results = ml_service.detect_anomalies(df)
    anomalies = [r for r in results if r["is_anomaly"] == 1]
    return {
        "batch_id": batch_id,
        "model": "Isolation Forest Anomaly Detection",
        "total_days": len(results),
        "anomaly_days": len(anomalies),
        "daily_data": results
    }
