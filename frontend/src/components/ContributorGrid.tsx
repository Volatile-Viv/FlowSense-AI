import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Calendar } from 'lucide-react';
import { ContributorStat } from '../types';
import { ContributorModal } from './ContributorModal';

interface ContributorGridProps {
  contributors: ContributorStat[];
}

export const ContributorGrid: React.FC<ContributorGridProps> = ({ contributors }) => {
  const [selectedContributor, setSelectedContributor] = useState<ContributorStat | null>(null);

  const getRiskBorder = (risk: string) => {
    switch (risk) {
      case 'Red':
        return 'border-rose-500/40 hover:border-rose-500/80';
      case 'Yellow':
        return 'border-amber-500/40 hover:border-amber-500/80';
      default:
        return 'border-white/10 hover:border-cyan-500/40';
    }
  };

  const getStatusBadge = (risk: string) => {
    switch (risk) {
      case 'Red':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Yellow':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="space-y-4"
    >


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contributors.map((c, idx) => (
          <motion.div
            key={c.email}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: idx * 0.03 }}
            onClick={() => setSelectedContributor(c)}
            className={`glass-card p-5 cursor-pointer glass-card-hover border ${getRiskBorder(c.workload_risk)} group`}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={c.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=0D8ABC&color=fff`}
                  alt={c.name}
                  className="w-11 h-11 rounded-full object-cover border border-cyan-500/40 group-hover:border-cyan-400 transition-all"
                />
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {c.name}
                  </h4>
                  <div className="text-[11px] text-slate-300 font-mono truncate max-w-[140px]">
                    {c.email}
                  </div>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(c.workload_risk)}`}>
                {c.workload_risk}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3 text-center">
              <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                <div className="text-[10px] text-slate-300 font-semibold">Commits</div>
                <div className="text-sm font-bold text-white font-mono">{c.commits}</div>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                <div className="text-[10px] text-slate-300 font-semibold">Share</div>
                <div className="text-sm font-bold text-cyan-400 font-mono">{c.ownership_pct}%</div>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                <div className="text-[10px] text-slate-300 font-semibold">Avg/Wk</div>
                <div className="text-sm font-bold text-purple-400 font-mono">{c.avg_commits_per_week}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono pt-2 border-t border-white/10">
              <span className="flex items-center gap-1 font-semibold">
                <Clock className="w-3 h-3 text-rose-400" />
                {c.night_commits} night
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <Calendar className="w-3 h-3 text-amber-400" />
                {c.weekend_commits} wend
              </span>
              <span className="text-white font-bold">
                {c.files_changed} files
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <ContributorModal
        contributor={selectedContributor}
        onClose={() => setSelectedContributor(null)}
      />
    </motion.div>
  );
};
