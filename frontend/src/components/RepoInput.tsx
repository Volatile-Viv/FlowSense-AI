import React, { useState } from 'react';
import { GitBranch, ArrowRight, Loader2, Sparkles, Key, ChevronDown, ChevronUp } from 'lucide-react';

interface RepoInputProps {
  onAnalyze: (url: string, token?: string) => void;
  isLoading: boolean;
}

const PRESETS = [
  { name: "facebook/react", url: "https://github.com/facebook/react.git" },
  { name: "fastapi/fastapi", url: "https://github.com/fastapi/fastapi.git" },
  { name: "pallets/flask", url: "https://github.com/pallets/flask.git" },
  { name: "vercel/next.js", url: "https://github.com/vercel/next.js.git" }
];

export const RepoInput: React.FC<RepoInputProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim(), token.trim());
    }
  };

  const handleSelectPreset = (presetUrl: string) => {
    setUrl(presetUrl);
    onAnalyze(presetUrl, token.trim());
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4">
      <div className="relative glass-card p-6 sm:p-8 overflow-hidden">
        {/* Glow Background Accents */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Repository Intelligence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 font-sans">
            Analyze Engineering Workload Risk & Ownership
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium">
            Paste any GitHub repository URL to evaluate commit history, maintainer workload distribution, bus factor, and ML workload risk scores.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative z-10 max-w-2xl mx-auto mb-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <GitBranch className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. https://github.com/owner/repository or owner/repo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 text-sm glass-input placeholder-slate-500 focus:outline-none disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="w-full sm:w-auto px-6 py-3 glass-button text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing Repo...</span>
                </>
              ) : (
                <>
                  <span>Analyze Repository</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Token Toggle for Private Repositories */}
          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => setShowTokenInput(!showTokenInput)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors font-medium text-xs"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Analyzing a private repository? Add GitHub Token</span>
              {showTokenInput ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {showTokenInput && (
            <div className="relative w-full pt-1">
              <input
                type="password"
                placeholder="Paste Personal Access Token (ghp_...)"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2.5 text-xs glass-input placeholder-slate-500 focus:outline-none font-mono"
              />
            </div>
          )}
        </form>

        {/* Preset Repositories Quick-Select */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs text-slate-400 font-medium">Preset Examples:</span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handleSelectPreset(p.url)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all font-mono"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
