from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database import Base

class RawUpload(Base):
    __tablename__ = "raw_uploads"

    id = Column(Integer, primary_key=True, index=True)
    upload_batch_id = Column(String, index=True)   # ← THIS LINE WAS MISSING
    customer_id = Column(String, nullable=True)
    order_id = Column(String, nullable=True)
    order_date = Column(DateTime, nullable=True)
    product_category = Column(String, nullable=True)
    quantity = Column(Float, nullable=True)
    price = Column(Float, nullable=True)
    revenue = Column(Float, nullable=True)
    channel = Column(String, nullable=True)
    country = Column(String, nullable=True)