import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bot, AlertTriangle, CheckCircle, Lightbulb, Compass } from 'lucide-react';
import { AIInsightsResult } from '../types';

interface AIInsightsSectionProps {
  insights: AIInsightsResult;
}

export const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ insights }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card p-6 sm:p-7 relative overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Repository Overview */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-white/10 hover:border-cyan-500/30 transition-all shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Repository Overview
              </h4>
            </div>
            <p className="text-[13.5px] sm:text-[14px] text-slate-200 leading-relaxed font-normal">
              {insights.repo_summary}
            </p>
          </div>

          {/* Knowledge & Ownership Balance */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-white/10 hover:border-purple-500/30 transition-all shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Knowledge & Ownership Balance
              </h4>
            </div>
            <div className="space-y-3 text-[13.5px] sm:text-[14px] text-slate-200 leading-relaxed font-normal">
              <p>{insights.knowledge_risks}</p>
              {insights.ownership_issues && (
                <p className="text-slate-300 border-t border-white/5 pt-3">
                  {insights.ownership_issues}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Engineering Recommendations */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-white/10 hover:border-emerald-500/30 transition-all shadow-md">
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Engineering Recommendations
              </h4>
            </div>
            <ul className="space-y-3">
              {insights.engineering_recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-[13.5px] sm:text-[14px] text-slate-200 font-normal leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0 shadow-sm shadow-emerald-400/50" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Future Risks */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-white/10 hover:border-amber-500/30 transition-all shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Future Risks & Bottlenecks
              </h4>
            </div>
            <p className="text-[13.5px] sm:text-[14px] text-slate-200 leading-relaxed font-normal">
              {insights.future_risks}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

