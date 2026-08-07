import os
import joblib
import numpy as np
import pandas as pd
import shap
from app.models.schemas import RepoMetrics, MLPredictionResult, SHAPFeatureImpact
from ml.train_model import MODEL_PATH, FEATURE_NAMES, train_and_save_model

FEATURE_DISPLAY_NAMES = {
    "ownership_concentration": "Code Ownership Concentration",
    "bus_factor": "Bus Factor Count",
    "weekend_commit_pct": "Weekend Commit Percentage",
    "night_commit_pct": "Late Night Commit Percentage",
    "contributor_balance_score": "Contributor Workload Balance",
    "code_churn_rate": "Code Churn Rate (Lines/Commit)",
    "commit_consistency_score": "Commit Activity Consistency",
    "top_contributor_share": "Top Contributor Commit Share"
}

_model_cache = None

def get_ml_model():
    global _model_cache
    if _model_cache is not None:
        return _model_cache
        
    if not os.path.exists(MODEL_PATH):
        print("ML model binary missing. Training Random Forest model now...")
        train_and_save_model()
        
    try:
        _model_cache = joblib.load(MODEL_PATH)
        return _model_cache
    except Exception as e:
        print(f"Error loading ML model: {e}. Retraining...")
        train_and_save_model()
        _model_cache = joblib.load(MODEL_PATH)
        return _model_cache

def predict_workload_risk(metrics: RepoMetrics) -> MLPredictionResult:
    model_data = get_ml_model()
    clf = model_data["model"]
    
    # Feature vector matching training order
    feature_dict = {
        "ownership_concentration": metrics.ownership_concentration,
        "bus_factor": float(metrics.bus_factor),
        "weekend_commit_pct": metrics.weekend_commit_pct,
        "night_commit_pct": metrics.night_commit_pct,
        "contributor_balance_score": metrics.contributor_balance_score,
        "code_churn_rate": metrics.code_churn_rate,
        "commit_consistency_score": metrics.activity_consistency,
        "top_contributor_share": metrics.top_contributor_share
    }
    
    X_sample = pd.DataFrame([feature_dict])[FEATURE_NAMES]
    
    # Predict risk class
    probabilities = clf.predict_proba(X_sample)[0]
    predicted_class_idx = int(np.argmax(probabilities))
    classes = model_data.get("classes", ["Low", "Medium", "High"])
    risk_level = classes[predicted_class_idx]
    confidence = round(float(probabilities[predicted_class_idx]) * 100.0, 1)
    
    # Risk index score (0 to 100)
    risk_score_index = round(float((probabilities[1] * 50.0) + (probabilities[2] * 100.0)), 1)
    
    # SHAP Explainability Engine
    shap_features: list[SHAPFeatureImpact] = []
    try:
        explainer = shap.TreeExplainer(clf)
        shap_values = explainer.shap_values(X_sample)
        
        # Determine target class SHAP array
        if isinstance(shap_values, list):
            target_shap = shap_values[predicted_class_idx][0]
        elif len(shap_values.shape) == 3:
            target_shap = shap_values[0, :, predicted_class_idx]
        else:
            target_shap = shap_values[0]
            
        for feat_name, imp in zip(FEATURE_NAMES, target_shap):
            display = FEATURE_DISPLAY_NAMES.get(feat_name, feat_name)
            val = float(feature_dict[feat_name])
            direction = "positive" if imp > 0 else "negative"
            
            shap_features.append(SHAPFeatureImpact(
                feature=feat_name,
                display_name=display,
                importance=round(float(abs(imp)), 4),
                impact_direction=direction,
                feature_value=val
            ))
            
        # Sort by highest absolute SHAP importance
        shap_features.sort(key=lambda x: x.importance, reverse=True)
    except Exception as e:
        print(f"SHAP explanation computation notice: {e}. Falling back to tree feature importances.")
        importances = clf.feature_importances_
        for feat_name, imp in zip(FEATURE_NAMES, importances):
            val = float(feature_dict[feat_name])
            shap_features.append(SHAPFeatureImpact(
                feature=feat_name,
                display_name=FEATURE_DISPLAY_NAMES.get(feat_name, feat_name),
                importance=round(float(imp), 4),
                impact_direction="positive" if val > 30 else "negative",
                feature_value=val
            ))
        shap_features.sort(key=lambda x: x.importance, reverse=True)

    return MLPredictionResult(
        risk_level=risk_level,
        confidence=confidence,
        risk_score_index=risk_score_index,
        top_features=shap_features
    )
