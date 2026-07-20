import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import IsolationForest
from xgboost import XGBClassifier
import mlflow
import mlflow.sklearn
import mlflow.xgboost


def _sanitize(df: pd.DataFrame) -> pd.DataFrame:
    """Replace NaN/inf with None so JSON serialization never fails."""
    df = df.replace([np.inf, -np.inf], np.nan)
    return df.where(pd.notnull(df), other=None)


def build_customer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Aggregate order-level data into one row per customer.
    These features feed all 4 models.
    """
    df["order_date"] = pd.to_datetime(df["order_date"])
    snapshot_date = df["order_date"].max()

    features = df.groupby("customer_id").agg(
        total_revenue=("revenue", "sum"),
        order_count=("order_id", "nunique"),
        avg_order_value=("revenue", "mean"),
        total_quantity=("quantity", "sum"),
        unique_categories=("product_category", "nunique"),
        first_order=("order_date", "min"),
        last_order=("order_date", "max")
    ).reset_index()

    features["days_since_last_order"] = (
        snapshot_date - features["last_order"]
    ).dt.days

    features["customer_lifespan_days"] = (
        features["last_order"] - features["first_order"]
    ).dt.days

    features = features.drop(columns=["first_order", "last_order"])

    # Replace NaN and inf with 0 so models and JSON serializer never see them
    features = features.replace([np.inf, -np.inf], 0)
    features = features.fillna(0)

    return features


# def predict_churn(df: pd.DataFrame) -> list:
#     """
#     Label customers as churned if they haven't ordered
#     in the last 45 days. Train XGBoost to predict churn risk.
#     """
#     features = build_customer_features(df)

#     features["churned"] = (features["days_since_last_order"] > 45).astype(int)

#     feature_cols = [
#         "total_revenue", "order_count", "avg_order_value",
#         "total_quantity", "unique_categories",
#         "days_since_last_order", "customer_lifespan_days"
#     ]

#     X = features[feature_cols].fillna(0)
#     y = features["churned"]

#     if y.nunique() < 2:
#         features["churn_risk_score"] = (
#             features["days_since_last_order"] /
#             features["days_since_last_order"].max()
#         ).round(3)
#         features["churn_prediction"] = features["churned"]
#     else:
#         with mlflow.start_run(run_name="churn_prediction"):
#             model = XGBClassifier(
#                 n_estimators=50,
#                 max_depth=3,
#                 eval_metric="logloss",
#                 random_state=42
#             )
#             model.fit(X, y)

#             features["churn_risk_score"] = model.predict_proba(X)[:, 1].round(3)
#             features["churn_prediction"] = model.predict(X)

#             mlflow.xgboost.log_model(model, "churn_model")
#             mlflow.log_metric("churn_rate", float(y.mean()))

#     result = features[[
#         "customer_id", "total_revenue", "order_count",
#         "days_since_last_order", "churn_risk_score", "churn_prediction"
#     ]].copy()

#     result["churn_prediction"] = result["churn_prediction"].astype(int)
#     return _sanitize(result.sort_values("churn_risk_score", ascending=False)).to_dict(orient="records")


def predict_churn(df: pd.DataFrame) -> list:
    features = build_customer_features(df)

    features["churned"] = (features["days_since_last_order"] > 45).astype(int)

    feature_cols = [
        "total_revenue", "order_count", "avg_order_value",
        "total_quantity", "unique_categories",
        "days_since_last_order", "customer_lifespan_days"
    ]

    X = features[feature_cols].fillna(0)
    y = features["churned"]

    if y.nunique() < 2:
        max_days = features["days_since_last_order"].max()
        if max_days > 0:
            features["churn_risk_score"] = (
                features["days_since_last_order"] / max_days
            ).round(3)
        else:
            features["churn_risk_score"] = 0.0
        features["churn_prediction"] = features["churned"]
    else:
        with mlflow.start_run(run_name="churn_prediction"):
            model = XGBClassifier(
                n_estimators=50,
                max_depth=3,
                eval_metric="logloss",
                random_state=42
            )
            model.fit(X, y)

            features["churn_risk_score"] = model.predict_proba(X)[:, 1].round(3)
            features["churn_prediction"] = model.predict(X)

            mlflow.xgboost.log_model(model, "churn_model")
            mlflow.log_metric("churn_rate", float(y.mean()))

    result = features[[
        "customer_id", "total_revenue", "order_count",
        "days_since_last_order", "churn_risk_score", "churn_prediction"
    ]].copy()

    result["churn_prediction"] = result["churn_prediction"].astype(int)
    result["churn_risk_score"] = result["churn_risk_score"].fillna(0.0)

    return _sanitize(result.sort_values("churn_risk_score", ascending=False)).to_dict(orient="records")

def segment_customers(df: pd.DataFrame, n_clusters: int = 3) -> list:
    """
    Group customers into behavioral segments using KMeans
    on RFM-style features: recency, frequency, monetary value.
    """
    features = build_customer_features(df)

    segment_features = [
        "total_revenue", "order_count",
        "avg_order_value", "days_since_last_order"
    ]

    X = features[segment_features].fillna(0)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    n_clusters = min(n_clusters, len(features))

    with mlflow.start_run(run_name="customer_segmentation"):
        model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        features["segment"] = model.fit_predict(X_scaled)

        mlflow.log_param("n_clusters", n_clusters)
        mlflow.log_metric("inertia", float(model.inertia_))

    segment_revenue = features.groupby("segment")["total_revenue"].mean()
    rank = segment_revenue.rank(ascending=False).astype(int)
    label_map = {seg: f"Segment_{rank[seg]}" for seg in rank.index}
    features["segment_label"] = features["segment"].map(label_map)

    return _sanitize(features[[
        "customer_id", "total_revenue", "order_count",
        "avg_order_value", "days_since_last_order",
        "segment", "segment_label"
    ]]).to_dict(orient="records")


def predict_ltv(df: pd.DataFrame) -> list:
    """
    Predict customer lifetime value using order behavior features.
    Target: total_revenue. Features: everything except revenue.
    """
    features = build_customer_features(df)

    feature_cols = [
        "order_count", "avg_order_value", "total_quantity",
        "unique_categories", "days_since_last_order",
        "customer_lifespan_days"
    ]

    X = features[feature_cols].fillna(0)
    y = features["total_revenue"]

    with mlflow.start_run(run_name="ltv_prediction"):
        model = LinearRegression()
        model.fit(X, y)

        features["predicted_ltv"] = model.predict(X).round(2)

        mlflow.sklearn.log_model(model, "ltv_model")
        mlflow.log_metric("r2_score", float(model.score(X, y)))

    return _sanitize(features[[
        "customer_id", "total_revenue", "order_count",
        "predicted_ltv"
    ]].sort_values("predicted_ltv", ascending=False)).to_dict(orient="records")


# def detect_anomalies(df: pd.DataFrame) -> list:
    """
    Detect unusual revenue days — spikes or drops
    that might indicate fraud, promotions, or data issues.
    """
    df["order_date"] = pd.to_datetime(df["order_date"])
    df["date"] = df["order_date"].dt.date

    daily = df.groupby("date").agg(
        total_revenue=("revenue", "sum"),
        order_count=("order_id", "nunique"),
        avg_order_value=("revenue", "mean")
    ).reset_index()

    X = daily[["total_revenue", "order_count", "avg_order_value"]].fillna(0)

    with mlflow.start_run(run_name="anomaly_detection"):
        model = IsolationForest(contamination=0.1, random_state=42)
        daily["anomaly_score"] = model.fit_predict(X)
        daily["is_anomaly"] = (daily["anomaly_score"] == -1).astype(int)

        mlflow.log_metric("anomaly_count", int(daily["is_anomaly"].sum()))

    daily["date"] = daily["date"].astype(str)
    daily["total_revenue"] = daily["total_revenue"].round(2)
    daily["avg_order_value"] = daily["avg_order_value"].round(2)

    return _sanitize(daily).to_dict(orient="records")



def detect_anomalies(df: pd.DataFrame) -> list:
    df = df.copy()
    df["order_date"] = pd.to_datetime(df["order_date"], errors="coerce")
    df = df.dropna(subset=["order_date"])

    if df.empty:
        return []

    df["date"] = df["order_date"].dt.date

    daily = df.groupby("date").agg(
        total_revenue=("revenue", "sum"),
        order_count=("order_id", "nunique"),
        avg_order_value=("revenue", "mean")
    ).reset_index()

    daily = daily.replace([np.inf, -np.inf], 0).fillna(0)

    if len(daily) < 2:
        daily["anomaly_score"] = 1
        daily["is_anomaly"] = 0
        daily["date"] = daily["date"].astype(str)
        return _sanitize(daily).to_dict(orient="records")

    X = daily[["total_revenue", "order_count", "avg_order_value"]]

    with mlflow.start_run(run_name="anomaly_detection"):
        model = IsolationForest(contamination=0.1, random_state=42)
        daily["anomaly_score"] = model.fit_predict(X)
        daily["is_anomaly"] = (daily["anomaly_score"] == -1).astype(int)
        mlflow.log_metric("anomaly_count", int(daily["is_anomaly"].sum()))

    daily["date"] = daily["date"].astype(str)
    daily["total_revenue"] = daily["total_revenue"].round(2)
    daily["avg_order_value"] = daily["avg_order_value"].round(2)

    return _sanitize(daily).to_dict(orient="records")