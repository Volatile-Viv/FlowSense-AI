from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_analyze_endpoint():
    response = client.post("/api/analyze", json={"repo_url": "facebook/react", "force_refresh": True})
    assert response.status_code == 200
    data = response.json()
    assert data["repo_name"] == "react"
    assert "metrics" in data
    assert "contributors" in data
    assert "ml_prediction" in data
    assert "ai_insights" in data

def test_invalid_repo_url():
    response = client.post("/api/analyze", json={"repo_url": ""})
    assert response.status_code == 400
