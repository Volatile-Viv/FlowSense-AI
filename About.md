# FlowSense AI — About the Project 🚀

Welcome to **FlowSense AI**! This document explains what this project is, why it was created, how every piece works, and how we built it—all written in simple, everyday English so anyone can understand it, even without a background in coding.

---

## 🌟 1. What is FlowSense AI?

Imagine a busy restaurant kitchen with five chefs. If only **one** chef knows the secret recipe for the signature sauce, and that chef gets sick or goes on vacation, the whole restaurant is in trouble. 

In the software world, computer programs and applications are written by teams of developers. Just like in a kitchen:
- Sometimes **one single developer** writes 90% of the code while others only write 10%.
- Sometimes team members work late into the night or on weekends, which can lead to fatigue and errors.
- If only one person understands how a critical piece of the software works, the company faces a huge risk if that person leaves.

**FlowSense AI is an intelligent health checkup tool for software projects.** It analyzes the work history of a software project, measures how balanced the workload is, predicts potential risks using Artificial Intelligence, and gives friendly, actionable recommendations to help teams collaborate better and stay healthy.

---

## 🔍 2. The Core Problems We Solve

### 🚌 The "Bus Factor"
*What if a key team member wins the lottery and leaves tomorrow?*
- In software development, the **"Bus Factor"** is a common term that measures how many people on a team hold critical knowledge.
- If the Bus Factor is **1**, it means everything depends on one person. If that person is unavailable, the project stalls.
- FlowSense AI automatically calculates this number and identifies who holds the key knowledge.

### ⚖️ Workload Concentration (The Gini Index)
- In economics, the *Gini coefficient* measures wealth inequality.
- FlowSense AI uses the same math to measure **code inequality**: Is the coding work evenly distributed across the team, or is one person carrying the entire burden?

### 🌙 Off-Hours & Late-Night Activity
- Coding at 2:00 AM or over the weekend can indicate tight deadlines, schedule mismatches, or uneven task allocation.
- FlowSense AI spots these trends and displays them on a visual 7-day activity map.

---

## ⚙️ 3. How FlowSense AI Works (Step-by-Step)

Here is what happens behind the scenes when you give FlowSense AI a software project link (like a GitHub repository):

```
┌─────────────────────────┐
│ 1. Enter Repository Link│ (e.g. facebook/react or fastapi/fastapi)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 2. Rapid History Scan   │ Inspects recent commits, dates, and author contributions
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 3. Engineering Metrics  │ Computes Health Score (0-100), Bus Factor, and Workload Balance
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 4. Machine Learning AI  │ Evaluates risk level (Low, Medium, High) with SHAP explanations
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 5. Gemini AI Advisor    │ Generates human-like executive summaries and smart suggestions
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 6. Interactive Visuals  │ Renders interactive charts, timelines, heatmaps, and network graphs
└─────────────────────────┘
```

---

### Step 1: Reading the Project's "Diary" (Git History)
Every software project keeps a digital diary called **Git**. Every time a developer saves a change (called a "commit"), Git writes down:
- Who made the change.
- When they made it (time and day).
- How many lines of code were added or deleted.
- Which files were edited.

FlowSense AI quickly connects to this diary and scans the most recent work history in just 1 to 2 seconds without downloading any heavy unnecessary files.

---

### Step 2: Calculating Health & Workload Numbers
Once the history is collected, FlowSense AI calculates several key numbers:
1. **Repository Health Score (0 to 100)**: Like a grade on a school report card. High scores mean balanced workload, steady progress, and healthy team collaboration.
2. **Bus Factor Number**: The minimum number of core maintainers holding more than 60% of the codebase knowledge.
3. **Code Ownership Concentration (0.0 to 1.0)**: A higher number means one person dominates the project.
4. **Late-Night & Weekend Percentages**: How often work happened outside standard working hours.
5. **Code Churn**: How rapidly code is being rewritten or replaced.

---

### Step 3: Predicting Risks with Machine Learning
Instead of using fixed guesses, FlowSense AI uses a trained **Random Forest Machine Learning Model**:
- **What is a Random Forest?** Think of it like a committee of 100 experienced technical managers. Each manager looks at the repository's numbers and votes on whether the project has `Low`, `Medium`, or `High` workload risk. The majority vote wins.
- **Explainable AI (SHAP)**: FlowSense AI doesn't just give a risk label—it explains **why**. For example, it will tell you: *"The risk is High because 70% of commits were made by a single maintainer (+18% risk impact), but having 5 active team members helped lower the risk (-6% risk impact)."*

---

### Step 4: Generating Human Advice with Google Gemini AI
FlowSense AI sends the calculated metrics to **Google Gemini AI**, which acts like a seasoned software architect consultant. Gemini reads the numbers and writes:
- **Executive Summary**: A concise 2-sentence overview of the project's health.
- **Knowledge & Ownership Balance**: Clear warnings about bottlenecks and single-point-of-failure files.
- **Actionable Recommendations**: Practical suggestions like *"Introduce peer code reviews for core modules"* or *"Onboard a secondary maintainer to share responsibilities."*
- **Future Risks**: Potential delivery delays to watch out for.

*(If the AI service is offline, FlowSense AI has an intelligent built-in rule engine that generates identical structured advice instantly).*

---

### Step 5: Presenting the Interactive Visual Dashboard
All this information is brought to life in an interactive, modern visual dashboard:
- **Health Radial Gauge**: A glowing animated dial showing the 0-100 Health Score.
- **SHAP Feature Bars**: Horizontal impact bars showing what factors are pushing risk up or down.
- **7-Day Commit Heatmap**: A color-coded calendar grid (like a weather map) showing which hours of the week have the heaviest coding activity.
- **Module Network Map**: An interactive map connecting team members to the specific folders and modules they work on.
- **Maintainers Roster**: Cards for each developer showing their commit share, off-hours percentage, and workload badge.
- **Export Options**: One-click download of the complete analysis as a **PDF Report** or **CSV Spreadsheet**.

---

## 🛠️ 4. How We Implemented Each Component

| Component | Technology Used | What It Does |
| :--- | :--- | :--- |
| **Frontend User Interface** | **React + TypeScript + Vite** | The visual website you see and click on. Fast, responsive, and interactive. |
| **Styling & Design System** | **Tailwind CSS + Glassmorphism** | Dark sleek theme with subtle glowing panels, smooth borders, and modern colors. |
| **Typography** | **Plus Jakarta Sans & Inter** | Clean, readable, professional Google fonts designed specifically for digital apps. |
| **Data Visualizations** | **Recharts & Lucide Icons** | Renders the velocity timeline, donut language chart, and interactive icons. |
| **Backend Engine** | **FastAPI (Python 3.11)** | The high-speed server that handles requests, runs calculations, and talks to AI services. |
| **Git Extraction** | **GitPython & Shallow Clone** | Clones and parses commit records in under 2 seconds. |
| **Machine Learning** | **Scikit-Learn (Random Forest)** | Evaluates workload patterns and predicts risk categories. |
| **Explainability** | **SHAP (TreeExplainer)** | Calculates mathematically how much each metric contributed to the final prediction. |
| **Generative AI** | **Google Gemini API (`google-genai`)** | Writes structured, human-readable insights and team recommendations. |
| **Database & Caching** | **SQLite** | Saves previous analysis results so opening the same project a second time is instantaneous. |
| **Report Generation** | **ReportLab & jsPDF** | Converts analytics into downloadable PDF documents. |

---

## 🚀 5. How to Use the Application

1. **Open the Website**: Launch [http://localhost:3001](http://localhost:3001) in your browser.
2. **Choose a Project**:
   - Click on any of the **Quick Preset Cards** (*`facebook/react`*, *`fastapi/fastapi`*, *`pallets/flask`*, or *`vercel/next.js`*), OR
   - Paste any public GitHub URL (e.g. `https://github.com/owner/repository`) into the search bar.
3. **Analyze**: Click the **Analyze Repository** button.
4. **Explore the Insights**:
   - Review your **Health Score** and **Bus Factor**.
   - Check the **SHAP Feature Drivers** to see what drives your risk score.
   - Read the **Gemini AI Recommendations** for actionable tips.
   - Inspect the **7-Day Heatmap** and **Maintainer Network Map**.
5. **Export**: Click **Export Report** at the top right to download a summary PDF or CSV file.

---

## ⚖️ 6. Ethical & Positive Policy

FlowSense AI is designed exclusively to measure **engineering workload distribution** and **repository health**. 
- It **never** diagnoses burnout or makes medical/psychological evaluations.
- It uses strictly professional engineering terms (*"Workload Concentration"*, *"Knowledge Bottleneck"*, *"Ownership Distribution"*).
- The goal is to support teams in collaborating smoothly and preventing avoidable project delays.

---

*Created with ❤️ by the FlowSense AI Team.*
