import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { RepoInput } from './components/RepoInput';
import { HealthScoreCard } from './components/HealthScoreCard';
import { MLRiskExplanation } from './components/MLRiskExplanation';
import { BusFactorCard } from './components/BusFactorCard';
import { AIInsightsSection } from './components/AIInsightsSection';
import { ContributorGrid } from './components/ContributorGrid';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { CollapsibleSection } from './components/CollapsibleSection';
import { analyzeRepository, getExportCsvUrl, getExportPdfUrl } from './services/api';

import { RepositoryAnalysisResult } from './types';
import { AlertCircle, RefreshCw, Github, Activity, Compass, Users, Sliders, Calendar, Network, Code2, Bot, Sparkles, ArrowRight } from 'lucide-react';

// Code-Split Heavy Visualization Components for Performance Optimization
const ActivityTimeline = lazy(() => import('./components/ActivityTimeline').then(m => ({ default: m.ActivityTimeline })));
const CommitHeatmap = lazy(() => import('./components/CommitHeatmap').then(m => ({ default: m.CommitHeatmap })));
const LanguageBreakdown = lazy(() => import('./components/LanguageBreakdown').then(m => ({ default: m.LanguageBreakdown })));
const ContributorGraph = lazy(() => import('./components/ContributorGraph').then(m => ({ default: m.ContributorGraph })));

export const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<RepositoryAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (repoUrl: string, token: string = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeRepository(repoUrl, false, token);
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze repository. Please check the URL or private token.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCsv = () => {
    if (analysis) {
      window.open(getExportCsvUrl(analysis.repo_url), '_blank');
    }
  };

  const handleExportPdf = () => {
    if (analysis) {
      window.open(getExportPdfUrl(analysis.repo_url), '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col font-sans">
      {/* Glassmorphism Header */}
      <Header
        analyzedAt={analysis?.analyzed_at}
        repoName={analysis?.repo_name}
        repoOwner={analysis?.repo_owner}
        onExportCsv={handleExportCsv}
        onExportPdf={handleExportPdf}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Repo Input Bar with Private Token Support */}
        <RepoInput onAnalyze={handleAnalyze} isLoading={isLoading} />

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button
              onClick={() => handleAnalyze('https://github.com/facebook/react.git')}
              className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Welcome State when no repository is analyzed yet */}
        {!isLoading && !analysis && (
          <div className="space-y-8 max-w-5xl mx-auto pt-2 pb-8">
            {/* Preset Showcase */}
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Quick Preset Repositories
                  </h3>
                </div>
                <span className="text-xs text-slate-500">Click to analyze instantly</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    name: "facebook/react",
                    desc: "React UI component library",
                    lang: "JavaScript / TypeScript",
                    color: "from-cyan-500/20 to-blue-500/10",
                    border: "hover:border-cyan-500/50",
                    url: "https://github.com/facebook/react.git",
                    tag: "Frontend Core"
                  },
                  {
                    name: "fastapi/fastapi",
                    desc: "Modern high-performance web API",
                    lang: "Python",
                    color: "from-teal-500/20 to-emerald-500/10",
                    border: "hover:border-teal-500/50",
                    url: "https://github.com/fastapi/fastapi.git",
                    tag: "Backend API"
                  },
                  {
                    name: "pallets/flask",
                    desc: "WSGI web application microframework",
                    lang: "Python",
                    color: "from-purple-500/20 to-indigo-500/10",
                    border: "hover:border-purple-500/50",
                    url: "https://github.com/pallets/flask.git",
                    tag: "Microframework"
                  },
                  {
                    name: "vercel/next.js",
                    desc: "Fullstack React production framework",
                    lang: "TypeScript",
                    color: "from-slate-700/30 to-slate-800/20",
                    border: "hover:border-white/40",
                    url: "https://github.com/vercel/next.js.git",
                    tag: "Fullstack"
                  }
                ].map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleAnalyze(preset.url)}
                    className={`text-left p-5 rounded-2xl bg-gradient-to-br ${preset.color} bg-slate-900/60 border border-white/10 ${preset.border} transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-2 font-semibold">
                      <span>{preset.tag}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors font-mono truncate">
                      {preset.name}
                    </h4>
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                      {preset.desc}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-cyan-400/80" />
                      <span>{preset.lang}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Core Capabilities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div className="p-6 rounded-2xl glass-card border border-white/10 hover:border-cyan-500/30 transition-all">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3.5 text-cyan-400">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">
                  Engineering Health & Bus Factor
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Evaluates Gini ownership concentration, single-maintainer bottlenecks, and minimum contributors required to maintain 60%+ code knowledge.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-card border border-white/10 hover:border-purple-500/30 transition-all">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-3.5 text-purple-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">
                  Explainable ML Risk Classifier
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Random Forest ML model coupled with SHAP TreeExplainer feature importance calculating exact factors impacting workload risk.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-card border border-white/10 hover:border-cyan-500/30 transition-all">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3.5 text-cyan-400">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">
                  Gemini Architectural Insights
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Structured AI engineering summaries, critical knowledge bottleneck alerts, and actionable team workload recommendations.
                </p>
              </div>
            </div>
          </div>
        )}


        {/* Loaded Analysis Dashboard */}
        {!isLoading && analysis && (
          <div className="space-y-8">
            {/* 1. Top Repo Health & Workload Risk Banner */}
            <CollapsibleSection
              title="Repository Overview & Health"
              subtitle="Health Score, Bus Factor, and Workload Risk summary"
              icon={<Activity className="w-4 h-4 text-cyan-400" />}
            >
              <HealthScoreCard
                metrics={analysis.metrics}
                mlPrediction={analysis.ml_prediction}
                repoName={analysis.repo_name}
                repoOwner={analysis.repo_owner}
              />
            </CollapsibleSection>

            {/* 2. Grid: SHAP Explainable AI + Bus Factor Assessment */}
            <CollapsibleSection
              title="Workload Drivers & Bus Factor"
              subtitle="Factors driving risk classification and core maintainer dependency"
              icon={<Sliders className="w-4 h-4 text-purple-400" />}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7">
                  <MLRiskExplanation
                    features={analysis.ml_prediction.top_features}
                    riskLevel={analysis.ml_prediction.risk_level}
                  />
                </div>
                <div className="lg:col-span-5">
                  <BusFactorCard
                    busFactor={analysis.metrics.bus_factor}
                    contributors={analysis.contributors}
                    knowledgeScore={analysis.metrics.knowledge_distribution_score}
                    ownershipConcentration={analysis.metrics.ownership_concentration}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* 3. AI Insights Section */}
            <CollapsibleSection
              title="AI Workload Insights & Recommendations"
              subtitle="Natural language architectural findings, knowledge risks, and actionable recommendations"
              icon={<Sparkles className="w-4 h-4 text-cyan-400" />}
              rightAction={
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Bot className="w-3.5 h-3.5" />
                  <span>{analysis.ai_insights.generated_by}</span>
                </span>
              }
            >
              <AIInsightsSection insights={analysis.ai_insights} />
            </CollapsibleSection>

            {/* 4. Commit Frequency Timeline & Language Composition */}
            <Suspense fallback={<div className="h-64 rounded-2xl glass-card animate-pulse" />}>
              <CollapsibleSection
                title="Activity Velocity & Languages"
                subtitle="Historical commit timeline and codebase language breakdown"
                icon={<Code2 className="w-4 h-4 text-indigo-400" />}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8">
                    <ActivityTimeline timeline={analysis.commit_timeline} />
                  </div>
                  <div className="lg:col-span-4">
                    <LanguageBreakdown languages={analysis.language_breakdown} />
                  </div>
                </div>
              </CollapsibleSection>

              {/* 5. Commit Activity Heatmap */}
              <CollapsibleSection
                title="7-Day Commit Activity Heatmap"
                subtitle="Commit frequency intensity across 24 hours and 7 days"
                icon={<Calendar className="w-4 h-4 text-purple-400" />}
              >
                <CommitHeatmap matrix={analysis.heatmap_matrix} />
              </CollapsibleSection>

              {/* 6. Module Network Map */}
              <CollapsibleSection
                title="Maintainer & Module Network Map"
                subtitle="Architectural module assignments and ownership distribution across maintainers"
                icon={<Network className="w-4 h-4 text-cyan-400" />}
              >
                <ContributorGraph
                  nodes={analysis.network_nodes}
                  edges={analysis.network_edges}
                />
              </CollapsibleSection>
            </Suspense>

            {/* 7. Maintainers Dashboard */}
            <CollapsibleSection
              title="Maintainers Workload Dashboard"
              subtitle={`Detailed breakdown of ${analysis.contributors.length} active maintainers and their workload risk status`}
              icon={<Users className="w-4 h-4 text-cyan-400" />}
              rightAction={
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/10 text-slate-300">
                  {analysis.contributors.length} Maintainers
                </span>
              }
            >
              <ContributorGrid
                contributors={analysis.contributors}
              />
            </CollapsibleSection>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070A12] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">FlowSense AI</span>
            <span>— Repository Intelligence & Engineering Workload Analytics</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-cyan-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-cyan-400 cursor-pointer">API Docs</span>
            <span className="hover:text-cyan-400 cursor-pointer flex items-center gap-1">
              <Github className="w-3.5 h-3.5" /> GitHub
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
