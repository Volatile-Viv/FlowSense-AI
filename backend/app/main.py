import uuid
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.utils.helpers import sanitize_repo_url, extract_owner_repo
from app.models.schemas import (
    AnalyzeRequest, RepositoryAnalysisResult, MLPredictionResult, 
    AIInsightsResult, RepoMetrics, ContributorStat
)
from app.services.git_service import analyze_git_repository
from app.services.metrics_service import calculate_repository_metrics
from app.services.ml_service import predict_workload_risk
from app.services.ai_service import generate_ai_insights
from app.services.export_service import generate_csv_report, generate_pdf_report
from app.database.db import get_cached_analysis, save_analysis_cache

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="FlowSense AI - Repository Intelligence & Engineering Workload Analytics API"
)

# Enable CORS for frontend Vite dev server & production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "online", "system": settings.PROJECT_NAME, "version": settings.VERSION}

@app.post("/api/analyze", response_model=RepositoryAnalysisResult)
def analyze_repository(req: AnalyzeRequest):
    """Primary pipeline endpoint: Clones repo, parses git history, runs ML risk prediction & AI insights."""
    if not req.repo_url or len(req.repo_url.strip()) < 3:
        raise HTTPException(status_code=400, detail="Invalid repository URL provided.")
        
    sanitized_url = sanitize_repo_url(req.repo_url)
    owner, repo_name = extract_owner_repo(sanitized_url)
    
    # Check cache if force_refresh is False
    if not req.force_refresh:
        cached = get_cached_analysis(sanitized_url)
        if cached:
            try:
                return RepositoryAnalysisResult(**cached)
            except Exception:
                pass # Re-analyze if schema mismatch
                
    try:
        # Step 1: Git Extraction
        raw_git_data = analyze_git_repository(sanitized_url, req.github_token or "")
        
        # Step 2: Compute Engineering Metrics
        metrics, contributors, timeline, heatmap, nodes, edges = calculate_repository_metrics(raw_git_data)
        
        # Step 3: ML Workload Risk & SHAP Explainability
        ml_result = predict_workload_risk(metrics)
        
        # Step 4: AI Insights (Gemini / Heuristic Engine)
        ai_result = generate_ai_insights(repo_name, metrics, contributors, ml_result)
        
        # Build unified result
        result = RepositoryAnalysisResult(
            id=str(uuid.uuid4()),
            repo_name=repo_name,
            repo_owner=owner,
            repo_url=sanitized_url,
            analyzed_at=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
            metrics=metrics,
            contributors=contributors,
            ml_prediction=ml_result,
            ai_insights=ai_result,
            commit_timeline=timeline,
            language_breakdown=raw_git_data.get("languages", []),
            heatmap_matrix=heatmap,
            network_nodes=nodes,
            network_edges=edges
        )
        
        # Save to SQLite database cache
        save_analysis_cache(sanitized_url, owner, repo_name, result.model_dump())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze repository: {str(e)}")

@app.post("/api/predict", response_model=MLPredictionResult)
def predict_metrics(metrics: RepoMetrics):
    """Standalone endpoint to run ML prediction on provided repository metrics."""
    return predict_workload_risk(metrics)

@app.post("/api/explain")
def explain_metrics(metrics: RepoMetrics):
    """Standalone endpoint returning SHAP feature importance for given metrics."""
    ml_res = predict_workload_risk(metrics)
    return {"top_features": ml_res.top_features, "risk_level": ml_res.risk_level}

@app.get("/api/repository")
def get_repository_overview(repo_url: str = Query(...)):
    """Fetch cached repository summary."""
    sanitized_url = sanitize_repo_url(repo_url)
    cached = get_cached_analysis(sanitized_url)
    if not cached:
        raise HTTPException(status_code=404, detail="Repository analysis not found. Please run /api/analyze first.")
    return cached

@app.get("/api/contributors")
def get_contributors_list(repo_url: str = Query(...)):
    """Fetch contributors list for a given repository."""
    sanitized_url = sanitize_repo_url(repo_url)
    cached = get_cached_analysis(sanitized_url)
    if not cached:
        raise HTTPException(status_code=404, detail="Repository analysis not found.")
    return {"contributors": cached.get("contributors", [])}

@app.get("/api/metrics")
def get_metrics_breakdown(repo_url: str = Query(...)):
    """Fetch detailed metrics for a given repository."""
    sanitized_url = sanitize_repo_url(repo_url)
    cached = get_cached_analysis(sanitized_url)
    if not cached:
        raise HTTPException(status_code=404, detail="Repository analysis not found.")
    return {"metrics": cached.get("metrics", {})}

@app.get("/api/export/csv")
def export_csv_report(repo_url: str = Query(...)):
    """Export analysis data in CSV format."""
    sanitized_url = sanitize_repo_url(repo_url)
    cached = get_cached_analysis(sanitized_url)
    if not cached:
        raise HTTPException(status_code=404, detail="Repository analysis not found.")
    analysis = RepositoryAnalysisResult(**cached)
    csv_data = generate_csv_report(analysis)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=FlowSense_{analysis.repo_name}_Report.csv"}
    )

@app.get("/api/export/pdf")
def export_pdf_report(repo_url: str = Query(...)):
    """Export analysis data in PDF format."""
    sanitized_url = sanitize_repo_url(repo_url)
    cached = get_cached_analysis(sanitized_url)
    if not cached:
        raise HTTPException(status_code=404, detail="Repository analysis not found.")
    analysis = RepositoryAnalysisResult(**cached)
    pdf_bytes = generate_pdf_report(analysis)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=FlowSense_{analysis.repo_name}_Report.pdf"}
    )
