import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Code2 } from 'lucide-react';
import { LanguageBreakdownItem } from '../types';

interface LanguageBreakdownProps {
  languages: LanguageBreakdownItem[];
}

export const LanguageBreakdown: React.FC<LanguageBreakdownProps> = ({ languages }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="glass-card p-6 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Codebase Languages
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          {languages.length} detected
        </span>
      </div>


      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={languages}
              dataKey="percentage"
              nameKey="language"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={4}
            >
              {languages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255, 255, 255, 0.15)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                color: '#FFFFFF'
              }}
              itemStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
              labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
              formatter={(value: any, name: any) => [`${value}%`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
        {languages.map((lang) => (
          <div key={lang.language} className="flex items-center justify-between text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: lang.color }} />
              <span className="text-white font-semibold text-[11px]">{lang.language}</span>
            </div>
            <span className="font-mono text-cyan-400 font-bold text-[11px]">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
