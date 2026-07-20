

import os
import shutil
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import RawUpload
from app.services.etl_service import clean_uploaded_file
from app.services.eda_service import generate_eda_summary
import uuid

router = APIRouter()

UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

#DEMO_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "demo_data", "insightpulse_demo_dataset.csv")

# WRONG — resolves to backend/app/demo_data/
DEMO_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "demo_data", "insightpulse_demo_dataset.csv")

# CORRECT — resolves to backend/demo_data/
DEMO_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "demo_data", "insightpulse_demo_dataset.csv")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def _insert_df(df, batch_id, db):
    """Shared helper — insert a cleaned dataframe into the DB."""
    for _, row in df.iterrows():
        record = RawUpload(
            upload_batch_id=batch_id,
            customer_id=str(row.get("customer_id")) if "customer_id" in df.columns else None,
            order_id=str(row.get("order_id")) if "order_id" in df.columns else None,
            order_date=row.get("order_date") if "order_date" in df.columns else None,
            product_category=str(row.get("product_category")) if "product_category" in df.columns else None,
            quantity=row.get("quantity") if "quantity" in df.columns else None,
            price=row.get("price") if "price" in df.columns else None,
            revenue=row.get("revenue") if "revenue" in df.columns else None,
            channel=str(row.get("channel")) if "channel" in df.columns else None,
            country=str(row.get("country")) if "country" in df.columns else None,
        )
        db.add(record)
    db.commit()

@router.post("/upload/demo")
def load_demo(db: Session = Depends(get_db)):
    if not os.path.exists(DEMO_FILE_PATH):
        raise HTTPException(
            status_code=404,
            detail="Demo dataset not found. Add insightpulse_demo_dataset.csv to backend/demo_data/"
        )

    batch_id = str(uuid.uuid4())
    df = clean_uploaded_file(DEMO_FILE_PATH)
    _insert_df(df, batch_id, db)

    return {
        "message": "Demo dataset loaded successfully",
        "batch_id": batch_id,
        "row_count": len(df),
        "demo": True
    }

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    batch_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    df = clean_uploaded_file(file_path)
    eda_summary = generate_eda_summary(df)
    _insert_df(df, batch_id, db)

    return {
        "message": "File uploaded and processed successfully",
        "filename": file.filename,
        "batch_id": batch_id,
        "eda_summary": eda_summary
    }

