import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { CommitHeatmapCell } from '../types';

interface CommitHeatmapProps {
  matrix: CommitHeatmapCell[];
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const CommitHeatmap: React.FC<CommitHeatmapProps> = ({ matrix }) => {
  const maxCommits = Math.max(...matrix.map((cell) => cell.commits), 1);

  const getHeatmapColor = (commits: number) => {
    if (commits === 0) return 'bg-white/5 border-white/10 text-slate-500';
    const intensity = commits / maxCommits;
    if (intensity < 0.25) return 'bg-cyan-950/90 border-cyan-700/50 text-cyan-300';
    if (intensity < 0.5) return 'bg-cyan-700/90 border-cyan-500/60 text-cyan-100';
    if (intensity < 0.75) return 'bg-purple-600 border-purple-400 text-white';
    return 'bg-rose-500 border-rose-300 text-white font-bold shadow-md shadow-rose-500/20';
  };

  const getCellCommits = (day: string, hour: number) => {
    const cell = matrix.find((c) => c.day === day && c.hour === hour);
    return cell ? cell.commits : 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="glass-card p-6 overflow-x-auto"
    >
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Hourly Distribution (UTC)
        </span>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-white/5 border border-white/10" />
            <span className="w-3 h-3 rounded bg-cyan-950/90 border border-cyan-700/50" />
            <span className="w-3 h-3 rounded bg-cyan-700/90 border border-cyan-500/60" />
            <span className="w-3 h-3 rounded bg-purple-600 border border-purple-400" />
            <span className="w-3 h-3 rounded bg-rose-500 border border-rose-300" />
          </div>
          <span>More Commits</span>
        </div>
      </div>


      <div className="min-w-[640px]">
        <div className="grid grid-cols-[80px_repeat(24,1fr)] gap-1 text-center font-mono text-[10px] text-slate-300 font-semibold mb-2">
          <div>Day / Hour</div>
          {HOURS.map((hr) => (
            <div key={hr}>{hr}h</div>
          ))}
        </div>

        <div className="space-y-1">
          {DAYS.map((day) => (
            <div key={day} className="grid grid-cols-[80px_repeat(24,1fr)] gap-1 items-center">
              <div className="text-xs font-bold text-slate-200 text-left truncate">{day.slice(0, 3)}</div>
              {HOURS.map((hr) => {
                const cnt = getCellCommits(day, hr);
                return (
                  <div
                    key={`${day}-${hr}`}
                    title={`${day} @ ${hr}:00 UTC: ${cnt} commits`}
                    className={`h-6 rounded-md border transition-all flex items-center justify-center text-[9px] font-bold ${getHeatmapColor(cnt)}`}
                  >
                    {cnt > 0 ? cnt : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
