import math

def clean_value(v):
    """Convert NaN/Inf to None so JSON can serialize it."""
    if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
        return None
    return v

def clean_dict(d):
    """Recursively clean a dict of NaN/Inf values."""
    return {k: clean_dict(v) if isinstance(v, dict) else clean_value(v) 
            for k, v in d.items()}

def generate_eda_summary(df):
    raw = {
        "rows": int(df.shape[0]),
        "columns": int(df.shape[1]),
        "column_names": list(df.columns),
        "missing_values": df.isnull().sum().to_dict(),
        "numeric_summary": df.describe().to_dict(),
        "data_types": df.dtypes.astype(str).to_dict()
    }
    return clean_dict(raw)