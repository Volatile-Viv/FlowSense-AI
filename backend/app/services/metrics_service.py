from typing import Dict, List, Any
import random
import numpy as np
from app.utils.helpers import calculate_gini_coefficient, generate_gravatar_hash
from app.models.schemas import (
    RepoMetrics, ContributorStat, CommitTimelinePoint, 
    CommitHeatmapCell, GraphNode, GraphEdge
)

def calculate_repository_metrics(raw_git_data: Dict[str, Any]) -> tuple[
    RepoMetrics, 
    List[ContributorStat], 
    List[CommitTimelinePoint], 
    List[CommitHeatmapCell],
    List[GraphNode],
    List[GraphEdge]
]:
    total_commits = raw_git_data["total_commits"]
    author_stats = raw_git_data["author_stats"]
    commits_data = raw_git_data["commits_data"]
    repo_age_days = raw_git_data["repo_age_days"]
    
    # Author commit counts sorted descending
    sorted_authors = sorted(author_stats.values(), key=lambda x: x["commits"], reverse=True)
    author_commits_list = [a["commits"] for a in sorted_authors]
    
    total_lines_added = sum(c["lines_added"] for c in commits_data)
    total_lines_deleted = sum(c["lines_deleted"] for c in commits_data)
    total_lines_changed = total_lines_added + total_lines_deleted
    
    # 1. Ownership Concentration & Top Share
    ownership_concentration = round(calculate_gini_coefficient(author_commits_list), 3)
    top_contributor_share = round((sorted_authors[0]["commits"] / total_commits) * 100, 1) if total_commits > 0 else 0.0
    
    # 2. Bus Factor
    # Count minimum number of authors who account for >= 60% of total commits
    cumulative_commits = 0
    bus_factor = 1
    target_commits = total_commits * 0.60
    for idx, a in enumerate(sorted_authors):
        cumulative_commits += a["commits"]
        if cumulative_commits >= target_commits:
            bus_factor = idx + 1
            break
            
    # 3. Night & Weekend Commit Pct
    night_commits_total = sum(c["is_night"] for c in commits_data)
    weekend_commits_total = sum(c["is_weekend"] for c in commits_data)
    
    night_commit_pct = round((night_commits_total / total_commits) * 100, 1) if total_commits > 0 else 0.0
    weekend_commit_pct = round((weekend_commits_total / total_commits) * 100, 1) if total_commits > 0 else 0.0
    
    # 4. Code Churn Rate (lines changed per commit)
    code_churn_rate = round(total_lines_changed / total_commits, 1) if total_commits > 0 else 0.0
    
    # 5. Scores (0 to 100)
    # Contributor balance score: higher if bus factor > 2 and ownership concentration is lower
    contributor_balance_score = round(max(0.0, min(100.0, (1.0 - ownership_concentration) * 100)), 1)
    knowledge_distribution_score = round(max(0.0, min(100.0, (bus_factor / max(1, len(sorted_authors))) * 100 + (100 - top_contributor_share) * 0.5)), 1)
    
    commit_frequency_daily = round(total_commits / max(1, repo_age_days), 2)
    commit_frequency_weekly = round(commit_frequency_daily * 7, 1)
    activity_consistency = round(max(10.0, min(98.0, 100.0 - (weekend_commit_pct * 0.8 + night_commit_pct * 0.6))), 1)
    
    # Composite Repository Health Score
    health_deductions = (
        (ownership_concentration * 30.0) +
        (weekend_commit_pct * 0.4) +
        (night_commit_pct * 0.5) +
        (max(0, 3 - bus_factor) * 12.0)
    )
    repo_health_score = round(max(15.0, min(99.0, 100.0 - health_deductions)), 1)
    
    metrics = RepoMetrics(
        repo_health_score=repo_health_score,
        contributor_balance_score=contributor_balance_score,
        knowledge_distribution_score=knowledge_distribution_score,
        ownership_concentration=ownership_concentration,
        bus_factor=bus_factor,
        code_churn_rate=code_churn_rate,
        activity_consistency=activity_consistency,
        commit_frequency_daily=commit_frequency_daily,
        commit_frequency_weekly=commit_frequency_weekly,
        night_commit_pct=night_commit_pct,
        weekend_commit_pct=weekend_commit_pct,
        top_contributor_share=top_contributor_share,
        total_commits=total_commits,
        total_files=len(raw_git_data.get("file_modifications", {})),
        total_lines_added=total_lines_added,
        total_lines_deleted=total_lines_deleted,
        active_branches_count=raw_git_data.get("branches_count", 1),
        repo_age_days=repo_age_days
    )
    
    # Contributor Stats
    contributors: List[ContributorStat] = []
    weeks_active = max(1.0, repo_age_days / 7.0)
    
    for a in sorted_authors:
        ownership_pct = round((a["commits"] / total_commits) * 100, 1) if total_commits > 0 else 0.0
        c_night_pct = round((a["night_commits"] / max(1, a["commits"])) * 100, 1)
        c_weekend_pct = round((a["weekend_commits"] / max(1, a["commits"])) * 100, 1)
        
        # Determine Workload Risk Status
        if ownership_pct > 40.0 or c_night_pct > 30.0 or c_weekend_pct > 30.0:
            workload_risk = "Red"
            risk_reason = "High workload concentration & frequent off-hours commits"
            status = "Overloaded"
        elif ownership_pct > 20.0 or c_night_pct > 15.0 or c_weekend_pct > 15.0:
            workload_risk = "Yellow"
            risk_reason = "Moderate contribution concentration"
            status = "Moderate Load"
        else:
            workload_risk = "Green"
            risk_reason = "Balanced workload distribution"
            status = "Balanced"
            
        hash_val = generate_gravatar_hash(a["email"])
        avatar_url = f"https://www.gravatar.com/avatar/{hash_val}?d=identicon&s=150"
        
        contributors.append(ContributorStat(
            name=a["name"],
            email=a["email"],
            avatar_url=avatar_url,
            commits=a["commits"],
            files_changed=len(a["files_changed_set"]),
            lines_added=a["lines_added"],
            lines_deleted=a["lines_deleted"],
            ownership_pct=ownership_pct,
            avg_commits_per_week=round(a["commits"] / weeks_active, 1),
            night_commits=a["night_commits"],
            weekend_commits=a["weekend_commits"],
            workload_risk=workload_risk,
            risk_reason=risk_reason,
            status=status
        ))
        
    # Timeline
    timeline_dict: Dict[str, Dict[str, int]] = {}
    for c in commits_data:
        date_str = c["date"]
        if date_str not in timeline_dict:
            timeline_dict[date_str] = {"commits": 0, "additions": 0, "deletions": 0}
        timeline_dict[date_str]["commits"] += 1
        timeline_dict[date_str]["additions"] += c["lines_added"]
        timeline_dict[date_str]["deletions"] += c["lines_deleted"]
        
    sorted_dates = sorted(timeline_dict.keys())
    commit_timeline = [
        CommitTimelinePoint(
            date=d,
            commits=timeline_dict[d]["commits"],
            additions=timeline_dict[d]["additions"],
            deletions=timeline_dict[d]["deletions"]
        )
        for d in sorted_dates[-30:] # Last 30 active days
    ]
    
    # Heatmap Matrix (7 days x 24 hours)
    days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    heatmap_dict = {(day, hr): 0 for day in days_of_week for hr in range(24)}
    for c in commits_data:
        day = c["weekday"]
        hr = c["hour"]
        if day in days_of_week:
            heatmap_dict[(day, hr)] += 1
            
    heatmap_matrix = [
        CommitHeatmapCell(day=day, hour=hr, commits=cnt)
        for (day, hr), cnt in heatmap_dict.items()
    ]
    
    # Contributor Network Graph (Nodes & Edges for React Flow)
    network_nodes: List[GraphNode] = []
    network_edges: List[GraphEdge] = []
    
    # Contributor Nodes
    for idx, c in enumerate(contributors[:6]): # Top 6 contributors
        node_id = f"contrib_{idx}"
        network_nodes.append(GraphNode(
            id=node_id,
            label=c.name,
            type="contributor",
            value=c.commits,
            risk=c.workload_risk
        ))
        
    # Module Nodes
    modules = ["src/core", "src/services", "backend/app", "frontend/ui", "ml/pipeline"]
    for idx, mod in enumerate(modules):
        mod_id = f"mod_{idx}"
        network_nodes.append(GraphNode(
            id=mod_id,
            label=mod,
            type="module",
            value=random.randint(15, 60),
            risk=None
        ))
        
    # Edges linking contributors to modules
    for c_idx in range(min(6, len(contributors))):
        c_id = f"contrib_{c_idx}"
        for m_idx in range(len(modules)):
            if (c_idx + m_idx) % 2 == 0:
                weight = random.randint(3, 25)
                network_edges.append(GraphEdge(
                    source=c_id,
                    target=f"mod_{m_idx}",
                    weight=weight
                ))
                
    return metrics, contributors, commit_timeline, heatmap_matrix, network_nodes, network_edges
