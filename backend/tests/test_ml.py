import pytest
from app.models.schemas import RepoMetrics
from app.services.ml_service import predict_workload_risk

def test_ml_prediction():
    mock_metrics = RepoMetrics(
        repo_health_score=78.5,
        contributor_balance_score=65.0,
        knowledge_distribution_score=70.0,
        ownership_concentration=0.35,
        bus_factor=3,
        code_churn_rate=120.5,
        activity_consistency=85.0,
        commit_frequency_daily=4.2,
        commit_frequency_weekly=29.4,
        night_commit_pct=12.5,
        weekend_commit_pct=8.0,
        top_contributor_share=32.0,
        total_commits=350,
        total_files=42,
        total_lines_added=15000,
        total_lines_deleted=4500,
        active_branches_count=3,
        repo_age_days=120
    )
    
    result = predict_workload_risk(mock_metrics)
    assert result.risk_level in ["Low", "Medium", "High"]
    assert 0.0 <= result.confidence <= 100.0
    assert len(result.top_features) == 8
    for feat in result.top_features:
        assert feat.importance >= 0.0
        assert feat.impact_direction in ["positive", "negative"]
