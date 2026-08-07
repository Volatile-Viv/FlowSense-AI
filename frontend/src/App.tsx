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
import { AlertCircle, RefreshCw, Github, Activity, Compass, Users, Sliders, Calendar, Network, Code2 } from 'lucide-react';

// Code-Split Heavy Visualization Components for Performance Optimization
const ActivityTimeline = lazy(() => import('./components/ActivityTimeline').then(m => ({ default: m.ActivityTimeline })));
const CommitHeatmap = lazy(() => import('./components/CommitHeatmap').then(m => ({ default: m.CommitHeatmap })));
const LanguageBreakdown = lazy(() => import('./components/LanguageBreakdown').then(m => ({ default: m.LanguageBreakdown })));
const ContributorGraph = lazy(() => import('./components/ContributorGraph').then(m => ({ default: m.ContributorGraph })));

export const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<RepositoryAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initial load default analysis (facebook/react preset)
  useEffect(() => {
    handleAnalyze('https://github.com/facebook/react.git');
  }, []);

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
              onClick={() => handleAnalyze(analysis?.repo_url || 'https://github.com/facebook/react.git')}
              className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

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
              title="Repository Insights & Recommendations"
              subtitle="Architectural findings, knowledge risks, and actionable recommendations"
              icon={<Compass className="w-4 h-4 text-cyan-400" />}
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
                title="7-Day Activity Heatmap"
                subtitle="Commit frequency intensity across hours and days"
                icon={<Calendar className="w-4 h-4 text-purple-400" />}
              >
                <CommitHeatmap matrix={analysis.heatmap_matrix} />
              </CollapsibleSection>

              {/* 6. Module Network Map */}
              <CollapsibleSection
                title="Module Network Map"
                subtitle="Architectural module assignments across maintainers"
                icon={<Network className="w-4 h-4 text-cyan-400" />}
              >
                <ContributorGraph
                  nodes={analysis.network_nodes}
                  edges={analysis.network_edges}
                />
              </CollapsibleSection>
            </Suspense>

            {/* 7. LAST SECTION: Maintainers Dashboard */}
            <CollapsibleSection
              title="Maintainers Dashboard"
              subtitle="Detailed breakdown of individual maintainer contributions and workload"
              icon={<Users className="w-4 h-4 text-cyan-400" />}
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
