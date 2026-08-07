# FlowSense AI 🚀

> **"AI-powered Repository Intelligence & Engineering Workload Analytics"**

FlowSense AI is a production-quality SaaS application designed to analyze GitHub repositories and provide deep engineering insights about workload distribution, repository health, contributor activity, ownership concentration, bus factor, and workload risk using Machine Learning & Generative AI.

---

## 🌟 Key Features

- **Automated Repository Cloning & History Extraction**: Extract commit logs, author activity, files modified, lines added/deleted, code churn, and off-hours (weekend & late night) commit patterns.
- **Engineering Metrics & Bus Factor**: Computes Repository Health Score (0-100), Contributor Workload Balance, Gini Ownership Concentration Index, and estimates Bus Factor.
- **Machine Learning Workload Risk Classifier**: Uses a trained **Random Forest Classifier** (`scikit-learn`) to predict `Low`, `Medium`, or `High` workload risk with confidence scores.
- **Explainable AI (SHAP TreeExplainer)**: Computes local feature impact drivers for every repository prediction, presenting an interactive horizontal importance bar chart.
- **Gemini AI Insights**: Generates structured natural language executive summaries, contributor insights, knowledge risks, ownership issues, and engineering recommendations using the **Google Gemini API** (with a zero-downtime heuristic engine fallback).
- **Y Combinator Startup Aesthetics**: Modern dark theme, glowing glassmorphism panels, animated radial health gauge, Recharts timelines, 7-day commit heatmap matrix, and interactive contributor network graphs.
- **Zero Manual Input**: Paste any GitHub repository URL or select preset examples to analyze instantly.
- **Exporting Capabilities**: One-click PDF report and CSV data exports.

---

## 📐 Clean Architecture

```
FlowSense-AI/
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI initialization & endpoints
│   │   ├── config.py                 # App settings & env configuration
│   │   ├── models/
│   │   │   └── schemas.py            # Pydantic data schemas
│   │   ├── services/
│   │   │   ├── git_service.py        # Git cloning, commit parsing, activity metrics
│   │   │   ├── metrics_service.py    # Bus factor, ownership concentration, health scores
│   │   │   ├── ml_service.py         # ML model prediction & SHAP explainability
│   │   │   ├── ai_service.py         # Gemini API & heuristic fallback AI generator
│   │   │   └── export_service.py     # PDF and CSV exporter
│   │   └── database/
│   │       └── db.py                 # SQLite database storage & caching
│   ├── ml/
│   │   ├── train_model.py            # Random Forest training script & feature pipeline
│   │   └── model.pkl                 # Saved trained model binary
│   ├── tests/
│   │   ├── test_metrics.py
│   │   ├── test_ml.py
│   │   └── test_api.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── RepoInput.tsx
│   │   │   ├── HealthScoreCard.tsx
│   │   │   ├── MLRiskExplanation.tsx # SHAP feature importance chart
│   │   │   ├── BusFactorCard.tsx
│   │   │   ├── AIInsightsSection.tsx # Gemini AI insights panel
│   │   │   ├── ContributorGrid.tsx
│   │   │   ├── ContributorModal.tsx
│   │   │   ├── ActivityTimeline.tsx
│   │   │   ├── CommitHeatmap.tsx
│   │   │   ├── LanguageBreakdown.tsx
│   │   │   └── ContributorGraph.tsx
│   │   ├── types/index.ts
│   │   ├── services/api.ts
│   │   ├── App.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS, Glassmorphism, CSS Custom Gradients
- **Animations**: Framer Motion
- **Visualizations**: Recharts, Lucide Icons
- **PDF/CSV**: ReportLab backend & jsPDF

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Git Analysis**: GitPython
- **Validation**: Pydantic v2
- **Database**: SQLite (SQLAlchemy / JSON caching)

### Machine Learning & AI
- **Model**: Scikit-Learn Random Forest Classifier
- **Explainability**: SHAP (SHapley Additive exPlanations)
- **Generative AI**: Google Gemini API (`google-genai`)

---

## 🤖 ML Pipeline & Engineered Features

The Random Forest Classifier evaluates **8 key repository workload features**:
1. `ownership_concentration`: Gini coefficient of code contributions across maintainers (0.0 to 1.0)
2. `bus_factor`: Minimum contributors accounting for >60% of codebase commits
3. `weekend_commit_pct`: Percentage of commits on Saturday and Sunday
4. `night_commit_pct`: Percentage of commits between 10 PM and 6 AM
5. `contributor_balance_score`: Workload distribution score across active maintainers (0 to 100)
6. `code_churn_rate`: Average lines changed (added + deleted) per commit
7. `commit_consistency_score`: Frequency regularity index over repository age
8. `top_contributor_share`: Percentage of commits authored by the primary maintainer

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### 1. Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train ML model (creates ml/model.pkl)
python ml/train_model.py

# Launch FastAPI server
uvicorn app.main:app --reload --port 8000
```
Backend API will be running at `http://localhost:8000` (Swagger docs at `http://localhost:8000/docs`).

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Frontend app will be running at `http://localhost:3000`.

---

## 🐳 Docker Deployment

To launch the complete application with Docker Compose:

```bash
docker-compose up --build
```
Access the application at `http://localhost:3000`.

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/analyze` | Clone repo, compute metrics, execute ML model & Gemini insights |
| `POST` | `/api/predict` | Standalone Random Forest workload risk prediction |
| `POST` | `/api/explain` | Standalone SHAP feature importance explainability |
| `GET` | `/api/repository` | Fetch cached repository overview |
| `GET` | `/api/contributors` | Fetch detailed contributor workload list |
| `GET` | `/api/metrics` | Fetch raw engineering metric breakdown |
| `GET` | `/api/export/csv` | Download CSV analysis report |
| `GET` | `/api/export/pdf` | Download PDF analysis report |

---

## ⚖️ Policy & Workload Disclaimer

FlowSense AI strictly measures repository workload concentration, engineering balance, and code maintenance risk. It **never** diagnoses burnout or makes medical claims, maintaining strictly objective engineering terminology ("Workload Concentration", "Knowledge Bottleneck", "Ownership Concentration").
