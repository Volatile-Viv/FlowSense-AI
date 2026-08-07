import React from 'react';
import { motion } from 'framer-motion';
import { Users, GitCommit, Flame, Clock, Activity } from 'lucide-react';
import { RepoMetrics, MLPredictionResult } from '../types';

interface HealthScoreCardProps {
  metrics: RepoMetrics;
  mlPrediction: MLPredictionResult;
  repoName: string;
  repoOwner: string;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({
  metrics,
  mlPrediction,
  repoName,
  repoOwner,
}) => {
  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'High':
        return {
          text: 'text-rose-400',
          bg: 'bg-rose-500/10 border-rose-500/30',
          label: 'High Workload Risk',
        };
      case 'Medium':
        return {
          text: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/30',
          label: 'Moderate Risk',
        };
      default:
        return {
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/30',
          label: 'Low Workload Risk',
        };
    }
  };

  const riskStyle = getRiskBadge(mlPrediction.risk_level);
  const healthPct = Math.min(100, Math.max(0, metrics.repo_health_score));
  const strokeDashoffset = 283 - (283 * healthPct) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 sm:p-8 relative overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Radial Health Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-white/10"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-cyan-400 transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                strokeWidth="7"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold tracking-tight text-white font-sans">
                {metrics.repo_health_score.toFixed(1)}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mt-0.5">
                Health Score
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <div className="text-xs text-slate-300 font-mono flex items-center justify-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold">{repoOwner}/{repoName}</span>
            </div>
          </div>
        </div>

        {/* Workload Risk Banner & Metrics Grid */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
            <div>
              <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider mb-1">
                Machine Learning Workload Risk Prediction
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xl sm:text-2xl font-extrabold ${riskStyle.text}`}>
                  {riskStyle.label}
                </span>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${riskStyle.bg} ${riskStyle.text}`}>
                  {mlPrediction.confidence}% confidence
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-300 font-medium">Risk Score Index</div>
              <div className="text-lg font-bold text-white font-mono">
                {mlPrediction.risk_score_index} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-slate-300 text-xs mb-1 font-semibold">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bus Factor</span>
              </div>
              <div className="text-base font-bold text-white font-mono">
                {metrics.bus_factor} <span className="text-xs font-normal text-slate-400">maintainers</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-slate-300 text-xs mb-1 font-semibold">
                <Flame className="w-3.5 h-3.5 text-purple-400" />
                <span>Code Churn</span>
              </div>
              <div className="text-base font-bold text-white font-mono">
                {metrics.code_churn_rate} <span className="text-xs font-normal text-slate-400">lines/commit</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-slate-300 text-xs mb-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>Late Night</span>
              </div>
              <div className="text-base font-bold text-white font-mono">
                {metrics.night_commit_pct}%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-slate-300 text-xs mb-1 font-semibold">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Weekend</span>
              </div>
              <div className="text-base font-bold text-white font-mono">
                {metrics.weekend_commit_pct}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
