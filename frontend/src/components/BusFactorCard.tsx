import React from 'react';
import { motion } from 'framer-motion';
import { Users, PieChart, Layers } from 'lucide-react';
import { ContributorStat } from '../types';

interface BusFactorCardProps {
  busFactor: number;
  contributors: ContributorStat[];
  knowledgeScore: number;
  ownershipConcentration: number;
}

export const BusFactorCard: React.FC<BusFactorCardProps> = ({
  busFactor,
  contributors,
  knowledgeScore,
  ownershipConcentration
}) => {
  const coreMaintainers = contributors.slice(0, busFactor);
  const isHighRisk = busFactor <= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass-card p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isHighRisk ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
            }`}>
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">
                Bus Factor Assessment
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Minimum maintainers holding &gt;60% of codebase knowledge
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
            isHighRisk 
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          }`}>
            Bus Factor = {busFactor}
          </span>
        </div>

        {/* Maintainers Avatars List */}
        <div className="space-y-3 mb-5">
          <div className="text-xs font-semibold text-slate-300">
            Core Maintainers Holding Key Knowledge:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {coreMaintainers.map((c) => (
              <div key={c.email} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <img
                  src={c.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=0D8ABC&color=fff`}
                  alt={c.name}
                  className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{c.name}</div>
                  <div className="text-[10px] text-cyan-400 font-mono font-semibold">
                    {c.commits} commits ({c.ownership_pct}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Footer */}
      <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-white/10 text-xs">
        <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
          <div className="text-slate-300 text-[11px] font-semibold flex items-center gap-1.5 mb-0.5">
            <PieChart className="w-3.5 h-3.5 text-cyan-400" />
            <span>Knowledge Score</span>
          </div>
          <div className="text-sm font-bold text-white font-mono">
            {knowledgeScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
          </div>
        </div>

        <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
          <div className="text-slate-300 text-[11px] font-semibold flex items-center gap-1.5 mb-0.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Gini Concentration</span>
          </div>
          <div className="text-sm font-bold text-white font-mono">
            {ownershipConcentration}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
