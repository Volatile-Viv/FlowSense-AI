import io
import csv
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from app.models.schemas import RepositoryAnalysisResult

def generate_csv_report(analysis: RepositoryAnalysisResult) -> str:
    """Generates CSV format string of contributor workload statistics."""
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow(["FlowSense AI - Contributor Workload Analysis Report"])
    writer.writerow(["Repository", f"{analysis.repo_owner}/{analysis.repo_name}"])
    writer.writerow(["Analyzed At", analysis.analyzed_at])
    writer.writerow(["Repo Health Score", analysis.metrics.repo_health_score])
    writer.writerow(["Workload Risk Level", analysis.ml_prediction.risk_level])
    writer.writerow(["Bus Factor", analysis.metrics.bus_factor])
    writer.writerow([])
    
    # Write contributor table
    writer.writerow([
        "Contributor Name", "Email", "Commits", "Files Changed", 
        "Lines Added", "Lines Deleted", "Ownership %", 
        "Avg Commits/Wk", "Night Commits", "Weekend Commits", 
        "Workload Risk", "Status"
    ])
    
    for c in analysis.contributors:
        writer.writerow([
            c.name, c.email, c.commits, c.files_changed,
            c.lines_added, c.lines_deleted, c.ownership_pct,
            c.avg_commits_per_week, c.night_commits, c.weekend_commits,
            c.workload_risk, c.status
        ])
        
    return output.getvalue()

def generate_pdf_report(analysis: RepositoryAnalysisResult) -> bytes:
    """Generates PDF binary report of repository intelligence."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A')
    )
    subtitle_style = ParagraphStyle(
        'SubTitleStyle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#475569')
    )
    heading_style = ParagraphStyle(
        'HeadingStyle',
        parent=styles['Heading2'],
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155')
    )

    story = []
    story.append(Paragraph(f"FlowSense AI - Repository Intelligence Report", title_style))
    story.append(Paragraph(f"Repository: {analysis.repo_owner}/{analysis.repo_name} | Generated: {analysis.analyzed_at}", subtitle_style))
    story.append(Spacer(1, 12))
    
    # Executive Summary Metrics Table
    data_summary = [
        ["Metric", "Value", "Metric", "Value"],
        ["Repository Health", f"{analysis.metrics.repo_health_score}/100", "Workload Risk Level", f"{analysis.ml_prediction.risk_level} ({analysis.ml_prediction.confidence}%)"],
        ["Bus Factor", f"{analysis.metrics.bus_factor}", "Ownership Concentration", f"{analysis.metrics.ownership_concentration}"],
        ["Total Commits", f"{analysis.metrics.total_commits}", "Code Churn Rate", f"{analysis.metrics.code_churn_rate} lines/commit"],
        ["Late Night Commits", f"{analysis.metrics.night_commit_pct}%", "Weekend Commits", f"{analysis.metrics.weekend_commit_pct}%"]
    ]
    t_summary = Table(data_summary, colWidths=[130, 130, 130, 130])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F1F5F9')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#0F172A')),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
    ]))
    story.append(t_summary)
    story.append(Spacer(1, 14))
    
    # AI Executive Summary
    story.append(Paragraph("AI Engineering Workload Analysis", heading_style))
    story.append(Paragraph(analysis.ai_insights.repo_summary, body_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph(f"<b>Knowledge Risks:</b> {analysis.ai_insights.knowledge_risks}", body_style))
    story.append(Spacer(1, 12))
    
    # Contributors Table
    story.append(Paragraph("Contributor Workload Breakdown", heading_style))
    contrib_table_data = [["Contributor", "Commits", "Ownership %", "Night", "Weekend", "Risk"]]
    for c in analysis.contributors[:8]:
        contrib_table_data.append([
            c.name[:18], str(c.commits), f"{c.ownership_pct}%", 
            str(c.night_commits), str(c.weekend_commits), c.workload_risk
        ])
    t_contrib = Table(contrib_table_data, colWidths=[140, 70, 80, 60, 65, 75])
    t_contrib.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0F172A')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
    ]))
    story.append(t_contrib)
    
    doc.build(story)
    return buffer.getvalue()
