export interface ContributorStat {
  name: string;
  email: string;
  avatar_url?: string;
  commits: number;
  files_changed: number;
  lines_added: number;
  lines_deleted: number;
  ownership_pct: number;
  avg_commits_per_week: number;
  night_commits: number;
  weekend_commits: number;
  workload_risk: 'Green' | 'Yellow' | 'Red';
  risk_reason: string;
  status: string;
}

export interface RepoMetrics {
  repo_health_score: number;
  contributor_balance_score: number;
  knowledge_distribution_score: number;
  ownership_concentration: number;
  bus_factor: number;
  code_churn_rate: number;
  activity_consistency: number;
  commit_frequency_daily: number;
  commit_frequency_weekly: number;
  night_commit_pct: number;
  weekend_commit_pct: number;
  top_contributor_share: number;
  total_commits: number;
  total_files: number;
  total_lines_added: number;
  total_lines_deleted: number;
  active_branches_count: number;
  repo_age_days: number;
}

export interface SHAPFeatureImpact {
  feature: string;
  display_name: string;
  importance: number;
  impact_direction: 'positive' | 'negative';
  feature_value: number;
}

export interface MLPredictionResult {
  risk_level: 'Low' | 'Medium' | 'High';
  confidence: number;
  risk_score_index: number;
  top_features: SHAPFeatureImpact[];
}

export interface AIInsightsResult {
  repo_summary: string;
  contributor_insights: string;
  knowledge_risks: string;
  ownership_issues: string;
  engineering_recommendations: string[];
  code_health_suggestions: string[];
  future_risks: string;
  generated_by: string;
}

export interface CommitTimelinePoint {
  date: string;
  commits: number;
  additions: number;
  deletions: number;
}

export interface LanguageBreakdownItem {
  language: string;
  percentage: number;
  color: string;
}

export interface CommitHeatmapCell {
  day: string;
  hour: number;
  commits: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'contributor' | 'module';
  value: number;
  risk?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

export interface RepositoryAnalysisResult {
  id: string;
  repo_name: string;
  repo_owner: string;
  repo_url: string;
  analyzed_at: string;
  metrics: RepoMetrics;
  contributors: ContributorStat[];
  ml_prediction: MLPredictionResult;
  ai_insights: AIInsightsResult;
  commit_timeline: CommitTimelinePoint[];
  language_breakdown: LanguageBreakdownItem[];
  heatmap_matrix: CommitHeatmapCell[];
  network_nodes: GraphNode[];
  network_edges: GraphEdge[];
}
