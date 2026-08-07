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
      className="glass-card p-6 sm:p-8 relative overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-sans">
              AI Repository Workload Insights
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Natural language intelligence generated from repository commit history & workload statistics
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          <Bot className="w-3.5 h-3.5" />
          <span>{insights.generated_by}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>Repository Overview</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {insights.repo_summary}
            </p>
          </div>

          <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Knowledge & Ownership Balance</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-2 font-medium">
              {insights.knowledge_risks}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {insights.ownership_issues}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-2.5 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Engineering Recommendations</span>
            </h4>
            <ul className="space-y-2">
              {insights.engineering_recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-sm shadow-emerald-400/50" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              <span>Future Risks</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {insights.future_risks}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
