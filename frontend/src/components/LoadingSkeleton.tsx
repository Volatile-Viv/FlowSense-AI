import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 space-y-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-56 rounded-2xl glass-panel p-6 border border-slate-800 flex items-center justify-between">
        <div className="w-36 h-36 rounded-full bg-slate-800/60" />
        <div className="flex-1 ml-8 space-y-4">
          <div className="h-8 bg-slate-800/80 rounded-xl w-3/4" />
          <div className="h-4 bg-slate-800/50 rounded-lg w-1/2" />
          <div className="grid grid-cols-4 gap-3">
            <div className="h-14 bg-slate-800/60 rounded-xl" />
            <div className="h-14 bg-slate-800/60 rounded-xl" />
            <div className="h-14 bg-slate-800/60 rounded-xl" />
            <div className="h-14 bg-slate-800/60 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Cards Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-72 rounded-2xl glass-panel p-6 border border-slate-800" />
        <div className="h-72 rounded-2xl glass-panel p-6 border border-slate-800" />
      </div>

      {/* AI Insights Skeleton */}
      <div className="h-80 rounded-2xl glass-panel p-6 border border-slate-800" />
    </div>
  );
};
