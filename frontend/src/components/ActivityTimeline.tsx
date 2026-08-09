import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity } from 'lucide-react';
import { CommitTimelinePoint } from '../types';

interface ActivityTimelineProps {
  timeline: CommitTimelinePoint[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ timeline }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span className="font-semibold text-slate-200">Daily Commits</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50" />
            <span className="font-semibold text-slate-200">Lines Changed (Code Churn)</span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Last {timeline.length} Days Activity
        </span>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorAdditions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
            <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                color: '#FFFFFF'
              }}
              itemStyle={{ color: '#FFFFFF' }}
              labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
            />
            <Area
              type="monotone"
              dataKey="commits"
              name="Commits"
              stroke="#06B6D4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCommits)"
            />
            <Area
              type="monotone"
              dataKey="additions"
              name="Lines Added"
              stroke="#A855F7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAdditions)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
