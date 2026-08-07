import pytest
from app.services.git_service import generate_simulated_repo_analysis
from app.services.metrics_service import calculate_repository_metrics

def test_metrics_calculation():
    raw_data = generate_simulated_repo_analysis("facebook", "react", "https://github.com/facebook/react.git")
    metrics, contributors, timeline, heatmap, nodes, edges = calculate_repository_metrics(raw_data)
    
    assert metrics.total_commits > 0
    assert 0 <= metrics.ownership_concentration <= 1.0
    assert metrics.bus_factor >= 1
    assert 0 <= metrics.repo_health_score <= 100.0
    assert len(contributors) > 0
    assert len(timeline) > 0
    assert len(heatmap) == 7 * 24
    assert len(nodes) > 0
    assert len(edges) > 0

def test_contributor_risk_classification():
    raw_data = generate_simulated_repo_analysis("test", "repo", "https://github.com/test/repo.git")
    _, contributors, _, _, _, _ = calculate_repository_metrics(raw_data)
    
    for c in contributors:
        assert c.workload_risk in ["Green", "Yellow", "Red"]
        assert c.commits >= 1
        assert c.ownership_pct >= 0.0
