import React from 'react';
import { Activity, Download } from 'lucide-react';

interface HeaderProps {
  analyzedAt?: string;
  repoName?: string;
  repoOwner?: string;
  onExportCsv?: () => void;
  onExportPdf?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  analyzedAt,
  repoName,
  repoOwner,
  onExportCsv,
  onExportPdf
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#070A12]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              FlowSense <span className="text-cyan-400 font-extrabold">AI</span>
            </span>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
              Repository Intelligence & Workload Analytics
            </p>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-3">
          {repoName && (
            <div className="flex items-center gap-2">
              <button
                onClick={onExportCsv}
                className="text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all font-medium"
              >
                CSV
              </button>
              <button
                onClick={onExportPdf}
                className="text-xs px-4 py-1.5 glass-button flex items-center gap-1.5 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
