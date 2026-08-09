import React from 'react';
import { motion } from 'framer-motion';
import { Network, UserCheck, FolderGit2 } from 'lucide-react';
import { GraphNode, GraphEdge } from '../types';

interface ContributorGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const ContributorGraph: React.FC<ContributorGraphProps> = ({ nodes, edges }) => {
  const contributorNodes = nodes.filter((n) => n.type === 'contributor');
  const moduleNodes = nodes.filter((n) => n.type === 'module');

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45 }}
      className="glass-card p-6"
    >


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Contributor Column */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-2">
            <UserCheck className="w-4 h-4" />
            <span>Maintainer Nodes</span>
          </div>

          {contributorNodes.map((node) => (
            <div
              key={node.id}
              className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full ${
                  node.risk === 'Red' ? 'bg-rose-500' : node.risk === 'Yellow' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <span className="text-sm font-bold text-slate-200">{node.label}</span>
              </div>
              <span className="text-xs font-mono text-slate-400 font-semibold">
                {node.value} commits
              </span>
            </div>
          ))}
        </div>

        {/* Module Column */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5 mb-2">
            <FolderGit2 className="w-4 h-4" />
            <span>Architectural Modules</span>
          </div>

          {moduleNodes.map((node) => (
            <div
              key={node.id}
              className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm font-bold font-mono text-purple-300">{node.label}</span>
              </div>
              <span className="text-xs font-mono text-slate-400 font-semibold">
                {node.value} files
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
