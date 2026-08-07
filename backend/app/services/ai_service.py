import os
import json
from typing import List, Dict, Any
from google import genai
from app.config import settings
from app.models.schemas import RepoMetrics, ContributorStat, MLPredictionResult, AIInsightsResult

SYSTEM_INSTRUCTION = """
You are FlowSense AI, a Senior Technical Architect & Engineering Workload Intelligence System.
Your job is to analyze repository engineering metrics and generate concise, professional engineering workload insights.

CRITICAL COMPLIANCE RULES:
1. NEVER diagnose burnout or make medical or psychological claims.
2. NEVER mention mental health, exhaustion, or stress.
3. ALWAYS use professional engineering terms:
   - "High workload concentration"
   - "Repository ownership imbalance"
   - "Knowledge bottleneck"
   - "Contributor overload risk"
   - "Engineering workload pattern"
   - "Bus factor risk"
"""

def generate_ai_insights(
    repo_name: str,
    metrics: RepoMetrics,
    contributors: List[ContributorStat],
    ml_prediction: MLPredictionResult
) -> AIInsightsResult:
    """Generates AI insights using Google Gemini API with fallback to built-in rule engine."""
    api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
    
    top_contributors = sorted(contributors, key=lambda c: c.commits, reverse=True)[:3]
    top_contrib_summary = ", ".join([f"{c.name} ({c.ownership_pct}%)" for c in top_contributors])
    
    prompt = f"""
    Analyze repository '{repo_name}' with the following engineering workload metrics:
    - Repository Health Score: {metrics.repo_health_score}/100
    - Bus Factor: {metrics.bus_factor}
    - Ownership Concentration (Gini): {metrics.ownership_concentration}
    - Top Contributor Share: {metrics.top_contributor_share}%
    - Contributor Workload Balance Score: {metrics.contributor_balance_score}/100
    - Late Night Commits Pct: {metrics.night_commit_pct}%
    - Weekend Commits Pct: {metrics.weekend_commit_pct}%
    - Code Churn Rate: {metrics.code_churn_rate} lines/commit
    - Total Commits: {metrics.total_commits} across {metrics.total_files} files
    - ML Workload Risk Prediction: {ml_prediction.risk_level} (Confidence: {ml_prediction.confidence}%)
    - Top Contributors: {top_contrib_summary}

    Return a JSON object strictly matching this schema:
    {{
      "repo_summary": "1-2 sentence executive overview of repository engineering patterns.",
      "contributor_insights": "Detailed analysis of workload balance among core contributors.",
      "knowledge_risks": "Evaluation of bus factor and knowledge concentration risks.",
      "ownership_issues": "Assessment of single-point-of-failure files and module concentration.",
      "engineering_recommendations": ["Actionable recommendation 1", "Actionable recommendation 2", "Actionable recommendation 3"],
      "code_health_suggestions": ["Suggestion 1", "Suggestion 2"],
      "future_risks": "Potential future repository architecture and maintenance bottlenecks."
    }}
    """

    if api_key:
        try:
            print("Invoking Google Gemini API for engineering workload insights...")
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={
                    "system_instruction": SYSTEM_INSTRUCTION,
                    "response_mime_type": "application/json"
                }
            )
            parsed = json.loads(response.text)
            return AIInsightsResult(
                repo_summary=parsed.get("repo_summary", "Repository displays active development with specific workload concentration patterns."),
                contributor_insights=parsed.get("contributor_insights", "Workload is concentrated among key maintainers."),
                knowledge_risks=parsed.get("knowledge_risks", f"Bus factor of {metrics.bus_factor} presents moderate knowledge retention risk."),
                ownership_issues=parsed.get("ownership_issues", "Critical core modules have single-maintainer ownership."),
                engineering_recommendations=parsed.get("engineering_recommendations", ["Implement pair programming on core modules", "Establish automated code review rotation"]),
                code_health_suggestions=parsed.get("code_health_suggestions", ["Increase modular test coverage", "Decompose high-churn files"]),
                future_risks=parsed.get("future_risks", "High risk of delivery delays if key maintainers are unavailable."),
                generated_by="Gemini API"
            )
        except Exception as e:
            print(f"Gemini API invocation fallback ({e}). Using intelligent heuristic AI engine.")

    # Intelligent Heuristic AI Generator Fallback
    return generate_heuristic_insights(repo_name, metrics, contributors, ml_prediction)

def generate_heuristic_insights(
    repo_name: str,
    metrics: RepoMetrics,
    contributors: List[ContributorStat],
    ml_prediction: MLPredictionResult
) -> AIInsightsResult:
    """Generates structured engineering workload insights using rule-based domain logic."""
    top_c = contributors[0] if contributors else None
    top_name = top_c.name if top_c else "Primary Maintainer"
    top_pct = metrics.top_contributor_share
    
    repo_summary = (
        f"{repo_name} exhibits a {ml_prediction.risk_level.lower()} workload risk profile with a Repository Health Score of "
        f"{metrics.repo_health_score}/100. Development activity spans {metrics.total_commits} commits with an average code churn of "
        f"{metrics.code_churn_rate} lines per commit."
    )
    
    contributor_insights = (
        f"Workload distribution reveals significant contribution concentration: {top_name} accounts for {top_pct}% of total commits. "
        f"Off-hours activity indicates {metrics.night_commit_pct}% late night commits and {metrics.weekend_commit_pct}% weekend commits across the repository."
    )
    
    if metrics.bus_factor <= 2:
        knowledge_risks = (
            f"CRITICAL KNOWLEDGE BOTTLENECK: The estimated Bus Factor is {metrics.bus_factor}. Major project domain knowledge "
            f"and code ownership is concentrated in only {metrics.bus_factor} key contributor(s). Loss of key personnel would severely hamper velocity."
        )
    else:
        knowledge_risks = (
            f"BALANCED KNOWLEDGE DISTRIBUTION: Estimated Bus Factor is {metrics.bus_factor}. Knowledge is distributed across several active maintainers, "
            f"reducing single-contributor dependency risk."
        )
        
    ownership_issues = (
        f"Code ownership concentration index stands at {metrics.ownership_concentration} (Gini scale). "
        f"Core architecture modules show limited peer review rotation, increasing structural dependency risk."
    )
    
    recommendations = [
        f"Distribute commit responsibility: Reduce {top_name}'s commit share below 30% through active PR delegation.",
        "Establish structured code ownership boundaries and enforce mandatory multi-approver code reviews for core modules.",
        "Buffer off-hours development by adjusting milestone velocity targets and implementing async review schedules."
    ]
    
    suggestions = [
        f"Decompose files experiencing high code churn (current average: {metrics.code_churn_rate} lines/commit).",
        "Introduce automated integration tests for single-maintainer modules to preserve domain knowledge."
    ]
    
    future_risks = (
        f"Without workload redistribution, {repo_name} faces engineering velocity bottlenecks, delayed code reviews, "
        f"and heightened risk of critical module delivery stalls."
    )
    
    return AIInsightsResult(
        repo_summary=repo_summary,
        contributor_insights=contributor_insights,
        knowledge_risks=knowledge_risks,
        ownership_issues=ownership_issues,
        engineering_recommendations=recommendations,
        code_health_suggestions=suggestions,
        future_risks=future_risks,
        generated_by="Heuristic Engine (Gemini Fallback)"
    )
