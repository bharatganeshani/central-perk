'use client';

import React from 'react';
import { FileText, Award, FolderGit, CheckCircle2, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import TrustScoreBadge from './TrustScoreBadge';

interface DocumentStatusCardProps {
  document: {
    id: string;
    type: 'RESUME' | 'CERTIFICATE' | 'PORTFOLIO';
    fileName: string;
    uploadedAt: string;
    reports?: {
      category: string;
      score: number;
      flags: string[];
      summary: string;
    }[];
  };
  onViewDetails?: () => void;
}

export default function DocumentStatusCard({ document, onViewDetails }: DocumentStatusCardProps) {
  const getDocIcon = () => {
    switch (document.type) {
      case 'RESUME':
        return <FileText className="w-5 h-5 text-primary" />;
      case 'CERTIFICATE':
        return <Award className="w-5 h-5 text-success" />;
      case 'PORTFOLIO':
        return <FolderGit className="w-5 h-5 text-warning" />;
    }
  };

  const formattedDate = new Date(document.uploadedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Calculate scores & flags
  const reports = document.reports || [];
  const hasReports = reports.length > 0;
  
  const avgScore = hasReports
    ? Math.round(reports.reduce((acc, curr) => acc + curr.score, 0) / reports.length)
    : null;

  let totalFlags = 0;
  let hasCriticalFlag = false;
  reports.forEach(r => {
    totalFlags += r.flags.length;
    r.flags.forEach(fStr => {
      try {
        const f = JSON.parse(fStr);
        if (f.severity === 'critical') hasCriticalFlag = true;
      } catch {}
    });
  });

  return (
    <div className="glass-panel hover:glow-cyan p-5 rounded-xl border border-slate-800 transition-all duration-300 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
          {getDocIcon()}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              {document.type}
            </span>
            {hasReports ? (
              <span className="flex items-center text-[10px] font-mono text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
                <CheckCircle2 className="w-3 h-3 mr-1" /> ANALYZED
              </span>
            ) : (
              <span className="flex items-center text-[10px] font-mono text-warning bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
                <Clock className="w-3 h-3 mr-1 animate-pulse" /> PROCESSING
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-slate-200 mt-0.5 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
            {document.fileName}
          </h4>
          <span className="text-xs text-slate-500 block mt-1">
            Uploaded {formattedDate}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {hasReports && (
          <div className="flex items-center space-x-4">
            {/* Flags count */}
            {totalFlags > 0 && (
              <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full border text-xs font-mono font-bold ${
                hasCriticalFlag 
                  ? 'bg-danger/10 text-danger border-danger/20 glow-red' 
                  : 'bg-warning/10 text-warning border-warning/20 glow-amber'
              }`}>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{totalFlags} FLAGS</span>
              </div>
            )}

            {/* Score Badge */}
            {avgScore !== null && (
              <TrustScoreBadge score={avgScore} size="sm" showLabel={false} />
            )}
          </div>
        )}

        {onViewDetails && (
          <button 
            onClick={onViewDetails}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            VIEW REPORTS
          </button>
        )}
      </div>
    </div>
  );
}
