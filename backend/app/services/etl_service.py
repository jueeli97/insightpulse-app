import pandas as pd
import numpy as np


COLUMN_MAP = {
    "invoicedate": "order_date",
    "invoice_date": "order_date",
    "date": "order_date",
    "purchase_date": "order_date",
    "transaction_date": "order_date",
    "invoice": "order_id",
    "invoiceno": "order_id",
    "invoice_no": "order_id",
    "transaction_id": "order_id",
    "order_number": "order_id",
    "customerid": "customer_id",
    "customer": "customer_id",
    "client_id": "customer_id",
    "totalamount": "revenue",
    "total": "revenue",
    "sales": "revenue",
    "amount": "revenue",
    "unitprice": "price",
    "unit_price": "price",
    "cost": "price",
    "qty": "quantity",
    "units": "quantity",
    "source": "channel",
    "marketing_channel": "channel",
    "category": "product_category",
    "description": "product_category",
    "stockcode": "product_category",
}


def clean_uploaded_file(file_path: str) -> pd.DataFrame:
    if file_path.endswith(".csv"):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)

    # Step 1 — normalize column names FIRST
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    # Step 2 — THEN apply column map (now all columns are lowercase)
    df = df.rename(columns={col: COLUMN_MAP[col] for col in df.columns if col in COLUMN_MAP})

    # Parse dates
    if "order_date" in df.columns:
        df["order_date"] = pd.to_datetime(df["order_date"], errors="coerce")

    if "quantity" in df.columns:
        df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce")

    if "price" in df.columns:
        df["price"] = pd.to_numeric(df["price"], errors="coerce")

    if "revenue" not in df.columns and {"quantity", "price"}.issubset(df.columns):
        df["revenue"] = df["quantity"] * df["price"]
    elif "revenue" in df.columns:
        df["revenue"] = pd.to_numeric(df["revenue"], errors="coerce")

    # Drop unprocessable rows
    if "order_date" in df.columns:
        df = df.dropna(subset=["order_date"])

    for required_col in ["order_id", "customer_id"]:
        if required_col in df.columns:
            df = df.dropna(subset=[required_col])

    # Fill remaining NaNs
    if "revenue" in df.columns:
        if {"quantity", "price"}.issubset(df.columns):
            mask = df["revenue"].isna()
            df.loc[mask, "revenue"] = df.loc[mask, "quantity"] * df.loc[mask, "price"]
        df["revenue"] = df["revenue"].fillna(0.0)

    if "quantity" in df.columns:
        df["quantity"] = df["quantity"].fillna(0.0)

    if "price" in df.columns:
        df["price"] = df["price"].fillna(0.0)

    for col in ["product_category", "channel", "country"]:
        if col in df.columns:
            df[col] = df[col].fillna("Unknown")

    df = df.drop_duplicates()

    return df