import React from 'react';
import { motion } from 'framer-motion';
import { Sliders, TrendingUp, TrendingDown } from 'lucide-react';
import { SHAPFeatureImpact } from '../types';

interface MLRiskExplanationProps {
  features: SHAPFeatureImpact[];
  riskLevel: string;
}

export const MLRiskExplanation: React.FC<MLRiskExplanationProps> = ({ features }) => {
  const maxImportance = Math.max(...features.map(f => f.importance), 0.001);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
          SHAP Feature Risk Drivers
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          {features.length} features evaluated
        </span>
      </div>


      <div className="space-y-3.5">
        {features.map((feat, idx) => {
          const widthPct = Math.min(100, Math.max(10, (feat.importance / maxImportance) * 100));
          const isPositive = feat.impact_direction === 'positive';

          return (
            <div key={feat.feature} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  {feat.display_name}
                  <span className="text-[11px] text-slate-500 font-mono">
                    ({feat.feature_value})
                  </span>
                </span>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                    isPositive 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{isPositive ? 'Increases Risk' : 'Reduces Risk'}</span>
                  </span>
                  <span className="font-mono text-slate-400 font-bold">
                    {(feat.importance * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.04 }}
                  className={`h-full rounded-full ${
                    isPositive 
                      ? 'bg-gradient-to-r from-rose-500 to-purple-600' 
                      : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
