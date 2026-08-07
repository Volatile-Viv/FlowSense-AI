"""
FlowSense AI - Machine Learning Model Training Script
Trains a Random Forest Classifier to predict Repository Workload Risk (Low, Medium, High).
"""
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")

FEATURE_NAMES = [
    "ownership_concentration",
    "bus_factor",
    "weekend_commit_pct",
    "night_commit_pct",
    "contributor_balance_score",
    "code_churn_rate",
    "commit_consistency_score",
    "top_contributor_share",
]

def load_developer_workload_csv(csv_path):
    """Loads developer_workload.csv (50,000 samples) and maps features to repository metrics."""
    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} records from {csv_path}")

    # Feature mapping to repo metrics
    ownership_concentration = np.clip((df['hours_worked_per_day'] / 12.0) * 0.7 + (df['context_switches'] / 20.0) * 0.3, 0.05, 0.98)
    bus_factor = np.clip(15.0 - (df['context_switches'] * 0.6) - (df['night_commits'] * 1.5), 1.0, 15.0)
    weekend_commit_pct = np.clip(df['weekend_work'] * 35.0 + (df['hours_worked_per_day'] - 7.5) * 3.0, 0.0, 50.0)
    night_commit_pct = np.clip(df['night_commits'] * 12.0 + (df['hours_worked_per_day'] - 8.0) * 4.0, 0.0, 60.0)
    contributor_balance_score = np.clip(100.0 - (ownership_concentration * 80.0), 5.0, 98.0)
    code_churn_rate = np.clip(df['coding_hours'] * 40.0 + df['commits_per_day'] * 15.0, 10.0, 500.0)
    commit_consistency_score = np.clip(100.0 - (df['weekend_work'] * 20.0 + df['night_commits'] * 15.0), 10.0, 98.0)
    top_contributor_share = np.clip((df['commits_per_day'] / 15.0) * 60.0 + ownership_concentration * 30.0, 10.0, 95.0)

    # Map text labels to numeric (Low: 0, Medium: 1, High: 2)
    risk_mapping = {'Low': 0, 'Medium': 1, 'High': 2}
    labels = df['workload_risk'].map(risk_mapping)

    mapped_df = pd.DataFrame({
        "ownership_concentration": ownership_concentration,
        "bus_factor": bus_factor,
        "weekend_commit_pct": weekend_commit_pct,
        "night_commit_pct": night_commit_pct,
        "contributor_balance_score": contributor_balance_score,
        "code_churn_rate": code_churn_rate,
        "commit_consistency_score": commit_consistency_score,
        "top_contributor_share": top_contributor_share,
        "workload_risk": labels
    })
    return mapped_df

def generate_synthetic_repo_data(n_samples=50000, random_state=42):
    """Generates synthetic dataset simulating real-world git repository characteristics."""
    np.random.seed(random_state)
    
    ownership_concentration = np.random.uniform(0.1, 0.95, n_samples)
    bus_factor = np.random.uniform(1.0, 15.0, n_samples)
    weekend_commit_pct = np.random.uniform(2.0, 45.0, n_samples)
    night_commit_pct = np.random.uniform(3.0, 50.0, n_samples)
    contributor_balance_score = np.random.uniform(10.0, 95.0, n_samples)
    code_churn_rate = np.random.uniform(20.0, 450.0, n_samples)
    commit_consistency_score = np.random.uniform(15.0, 95.0, n_samples)
    top_contributor_share = np.random.uniform(15.0, 85.0, n_samples)
    
    # Calculate synthetic risk score index
    risk_score = (
        (ownership_concentration * 25.0) +
        (np.maximum(0, 5.0 - bus_factor) * 5.0) +
        (weekend_commit_pct * 0.8) +
        (night_commit_pct * 0.9) +
        ((100.0 - contributor_balance_score) * 0.25) +
        (top_contributor_share * 0.3) +
        (np.maximum(0, code_churn_rate - 200.0) * 0.05) -
        (commit_consistency_score * 0.15)
    )
    
    # Map to risk classes (0: Low, 1: Medium, 2: High)
    labels = np.zeros(n_samples, dtype=int)
    labels[risk_score >= 35.0] = 1
    labels[risk_score >= 52.0] = 2

    df = pd.DataFrame({
        "ownership_concentration": ownership_concentration,
        "bus_factor": bus_factor,
        "weekend_commit_pct": weekend_commit_pct,
        "night_commit_pct": night_commit_pct,
        "contributor_balance_score": contributor_balance_score,
        "code_churn_rate": code_churn_rate,
        "commit_consistency_score": commit_consistency_score,
        "top_contributor_share": top_contributor_share,
        "workload_risk": labels
    })
    return df

def train_and_save_model():
    possible_csv_paths = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "developer_workload.csv")),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "developer_workload.csv")),
        "/Users/vivek/My_Files/Antigravity_Folder/developer_workload.csv"
    ]
    
    csv_path = None
    for path in possible_csv_paths:
        if os.path.exists(path):
            csv_path = path
            break
            
    if csv_path:
        print(f"Training ML model using dataset from {csv_path}...")
        df = load_developer_workload_csv(csv_path)
    else:
        print("CSV dataset not found. Generating synthetic repository workload dataset (50,000 samples)...")
        df = generate_synthetic_repo_data(n_samples=50000)
    
    X = df[FEATURE_NAMES]
    y = df["workload_risk"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    clf = RandomForestClassifier(
        n_estimators=150,
        max_depth=10,
        min_samples_split=4,
        random_state=42,
        n_jobs=-1
    )
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {acc * 100:.2f}% on dataset of size {len(df)}")
    print(classification_report(y_test, y_pred, target_names=["Low", "Medium", "High"]))
    
    model_data = {
        "model": clf,
        "feature_names": FEATURE_NAMES,
        "classes": ["Low", "Medium", "High"],
        "dataset_size": len(df)
    }
    
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model_data, MODEL_PATH)
    print(f"Saved trained Random Forest model to {MODEL_PATH}")

if __name__ == "__main__":
    train_and_save_model()

