from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services import kpi_service

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

@router.get("/revenue-trend")
def revenue_trend(batch_id: str, db: Session = Depends(get_db)):
    df = load_df(batch_id, db)
    return {"batch_id": batch_id, "revenue_trend": kpi_service.calc_revenue_trend(df)}

@router.get("/aov")
def average_order_value(batch_id: str, db: Session = Depends(get_db)):
    df = load_df(batch_id, db)
    return {"batch_id": batch_id, **kpi_service.calc_aov(df)}

@router.get("/top-customers")
def top_customers(batch_id: str, n: int = 10, db: Session = Depends(get_db)):
    df = load_df(batch_id, db)
    return {"batch_id": batch_id, "top_customers": kpi_service.calc_top_customers(df, n)}

@router.get("/channel-performance")
def channel_performance(batch_id: str, db: Session = Depends(get_db)):
    df = load_df(batch_id, db)
    return {"batch_id": batch_id, "channels": kpi_service.calc_revenue_by_channel(df)}

@router.get("/category-performance")
def category_performance(batch_id: str, db: Session = Depends(get_db)):
    df = load_df(batch_id, db)
    return {"batch_id": batch_id, "categories": kpi_service.calc_category_performance(df)}