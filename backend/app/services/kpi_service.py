import pandas as pd
from sqlalchemy.orm import Session
from app.models import RawUpload

def get_dataframe(db: Session, batch_id: str) -> pd.DataFrame:
    """Load batch data from DB into a DataFrame."""
    records = db.query(RawUpload).filter(
        RawUpload.upload_batch_id == batch_id
    ).all()

    if not records:
        return pd.DataFrame()

    return pd.DataFrame([{
        "customer_id": r.customer_id,
        "order_id": r.order_id,
        "order_date": r.order_date,
        "product_category": r.product_category,
        "quantity": r.quantity,
        "price": r.price,
        "revenue": r.revenue,
        "channel": r.channel,
        "country": r.country
    } for r in records])


def calc_revenue_trend(df: pd.DataFrame) -> list:
    """Monthly revenue trend."""
    df["order_date"] = pd.to_datetime(df["order_date"])
    df["month"] = df["order_date"].dt.to_period("M").astype(str)
    trend = df.groupby("month")["revenue"].sum().reset_index()
    return trend.rename(columns={"revenue": "total_revenue"}).to_dict(orient="records")


# def calc_aov(df: pd.DataFrame) -> dict:
#     """Average Order Value overall and by channel."""
#     overall = round(df["revenue"].sum() / df["order_id"].nunique(), 2)
#     by_channel = (
#         df.groupby("channel")
#     .apply(lambda x: round(x["revenue"].sum() / x["order_id"].nunique(), 2),
#            include_groups=False)
#     .reset_index()
#     .rename(columns={0: "aov"})
#     .to_dict(orient="records")
#     )
#     return {"overall_aov": overall, "by_channel": by_channel}


def calc_aov(df: pd.DataFrame) -> dict:
    """Average Order Value overall and by channel."""
    total_orders = df["order_id"].nunique()
    overall = round(df["revenue"].sum() / total_orders, 2) if total_orders > 0 else 0.0

    by_channel = (
        df.groupby("channel")
        .apply(
            lambda x: round(x["revenue"].sum() / x["order_id"].nunique(), 2)
            if x["order_id"].nunique() > 0 else 0.0,
            include_groups=False
        )
        .reset_index()
        .rename(columns={0: "aov"})
        .to_dict(orient="records")
    )
    return {"overall_aov": overall, "by_channel": by_channel}


def calc_top_customers(df: pd.DataFrame, n: int = 10) -> list:
    """Top N customers by total revenue."""
    top = (
        df.groupby("customer_id")["revenue"]
        .sum()
        .sort_values(ascending=False)
        .head(n)
        .reset_index()
        .rename(columns={"revenue": "total_revenue"})
    )
    return top.to_dict(orient="records")


def calc_revenue_by_channel(df: pd.DataFrame) -> list:
    """Revenue and order count broken down by channel."""
    result = (
        df.groupby("channel")
        .agg(
            total_revenue=("revenue", "sum"),
            order_count=("order_id", "nunique"),
            avg_order_value=("revenue", "mean")
        )
        .round(2)
        .reset_index()
    )
    return result.to_dict(orient="records")


def calc_category_performance(df: pd.DataFrame) -> list:
    """Revenue and quantity by product category."""
    result = (
        df.groupby("product_category")
        .agg(
            total_revenue=("revenue", "sum"),
            total_quantity=("quantity", "sum"),
            order_count=("order_id", "nunique")
        )
        .round(2)
        .reset_index()
    )
    return result.to_dict(orient="records")