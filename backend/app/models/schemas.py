from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class AnalyzeRequest(BaseModel):
    repo_url: str = Field(..., description="GitHub Repository URL or owner/repo format")
    force_refresh: Optional[bool] = False
    github_token: Optional[str] = Field(default="", description="Optional GitHub PAT Token for private repositories")

class ContributorStat(BaseModel):
    name: str
    email: str
    avatar_url: Optional[str] = None
    commits: int
    files_changed: int
    lines_added: int
    lines_deleted: int
    ownership_pct: float
    avg_commits_per_week: float
    night_commits: int
    weekend_commits: int
    workload_risk: str  # Green, Yellow, Red
    risk_reason: str
    status: str

class RepoMetrics(BaseModel):
    repo_health_score: float
    contributor_balance_score: float
    knowledge_distribution_score: float
    ownership_concentration: float
    bus_factor: int
    code_churn_rate: float
    activity_consistency: float
    commit_frequency_daily: float
    commit_frequency_weekly: float
    night_commit_pct: float
    weekend_commit_pct: float
    top_contributor_share: float
    total_commits: int
    total_files: int
    total_lines_added: int
    total_lines_deleted: int
    active_branches_count: int
    repo_age_days: int

class SHAPFeatureImpact(BaseModel):
    feature: str
    display_name: str
    importance: float
    impact_direction: str  # positive (increases risk) or negative (decreases risk)
    feature_value: float

class MLPredictionResult(BaseModel):
    risk_level: str  # Low, Medium, High
    confidence: float  # Percentage
    risk_score_index: float
    top_features: List[SHAPFeatureImpact]

class AIInsightsResult(BaseModel):
    repo_summary: str
    contributor_insights: str
    knowledge_risks: str
    ownership_issues: str
    engineering_recommendations: List[str]
    code_health_suggestions: List[str]
    future_risks: str
    generated_by: str  # "Gemini API" or "Heuristic Engine"

class CommitTimelinePoint(BaseModel):
    date: str
    commits: int
    additions: int
    deletions: int

class LanguageBreakdownItem(BaseModel):
    language: str
    percentage: float
    color: str

class CommitHeatmapCell(BaseModel):
    day: str
    hour: int
    commits: int

class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # "contributor" or "module"
    value: int
    risk: Optional[str] = None

class GraphEdge(BaseModel):
    source: str
    target: str
    weight: int

class RepositoryAnalysisResult(BaseModel):
    id: str
    repo_name: str
    repo_owner: str
    repo_url: str
    analyzed_at: str
    metrics: RepoMetrics
    contributors: List[ContributorStat]
    ml_prediction: MLPredictionResult
    ai_insights: AIInsightsResult
    commit_timeline: List[CommitTimelinePoint]
    language_breakdown: List[LanguageBreakdownItem]
    heatmap_matrix: List[CommitHeatmapCell]
    network_nodes: List[GraphNode]
    network_edges: List[GraphEdge]
