import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitCommit, FileCode, Clock, Calendar, Mail } from 'lucide-react';
import { ContributorStat } from '../types';

interface ContributorModalProps {
  contributor: ContributorStat | null;
  onClose: () => void;
}

export const ContributorModal: React.FC<ContributorModalProps> = ({ contributor, onClose }) => {
  if (!contributor) return null;

  const getStatusBadge = (risk: string) => {
    switch (risk) {
      case 'Red':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'Yellow':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg glass-card p-6 border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={contributor.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(contributor.name)}&background=0D8ABC&color=fff`}
              alt={contributor.name}
              className="w-16 h-16 rounded-2xl border-2 border-cyan-500/40 object-cover shadow-lg"
            />
            <div>
              <h3 className="text-xl font-bold text-white font-sans">{contributor.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-mono">
                <Mail className="w-3.5 h-3.5" />
                <span>{contributor.email}</span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(contributor.workload_risk)}`}>
                {contributor.status} ({contributor.workload_risk} Risk)
              </span>
            </div>
          </div>

          {/* Risk Rationale */}
          <div className="mb-6 p-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-300">
            <span className="font-semibold text-slate-200">Workload Risk Assessment: </span>
            {contributor.risk_reason}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/10">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
                <span>Total Commits</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">{contributor.commits}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/10">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-purple-400" />
                <span>Code Ownership</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">{contributor.ownership_pct}%</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/10">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>Late Night Commits</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">{contributor.night_commits}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/10">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Weekend Commits</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">{contributor.weekend_commits}</div>
            </div>
          </div>

          {/* Additions / Deletions */}
          <div className="flex items-center justify-between text-xs font-mono p-3 rounded-xl bg-slate-900/80 border border-white/10">
            <span className="text-emerald-400">+{contributor.lines_added.toLocaleString()} additions</span>
            <span className="text-rose-400">-{contributor.lines_deleted.toLocaleString()} deletions</span>
            <span className="text-slate-400">{contributor.files_changed} files modified</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
