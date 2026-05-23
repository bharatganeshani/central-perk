'use client';

import React, { useState } from 'react';
import { AlertTriangle, AlertOctagon, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface FlagCardProps {
  flag: {
    type: string;
    severity: 'info' | 'warning' | 'critical';
    excerpt: string;
    explanation: string;
    docType?: string;
    docFileName?: string;
    docFileUrl?: string;
    reportCategory?: string;
    reportScore?: number;
    reportSummary?: string;
  };
}

export default function FlagCard({ flag }: FlagCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const encodedUrl = flag.docFileUrl ? encodeURI(flag.docFileUrl) : '';
  const isExternalUrl = encodedUrl.startsWith('http');
  const hasDocContext = Boolean(flag.docType || flag.docFileName || flag.docFileUrl);
  const hasReportContext = Boolean(flag.reportCategory || flag.reportScore !== undefined || flag.reportSummary);

  const styles = {
    critical: {
      border: 'border-danger/30 hover:border-danger/70',
      bg: 'bg-danger/5',
      glow: 'glow-red',
      text: 'text-danger',
      icon: <AlertOctagon className="w-5 h-5 text-danger" />,
      badge: 'bg-danger/10 text-danger border-danger/20'
    },
    warning: {
      border: 'border-warning/30 hover:border-warning/70',
      bg: 'bg-warning/5',
      glow: 'glow-amber',
      text: 'text-warning',
      icon: <AlertTriangle className="w-5 h-5 text-warning" />,
      badge: 'bg-warning/10 text-warning border-warning/20'
    },
    info: {
      border: 'border-primary/30 hover:border-primary/70',
      bg: 'bg-primary/5',
      glow: 'glow-cyan',
      text: 'text-primary',
      icon: <Info className="w-5 h-5 text-primary" />,
      badge: 'bg-primary/10 text-primary border-primary/20'
    }
  };

  const currentStyle = styles[flag.severity] || styles.info;

  return (
    <div className={`border rounded-xl transition-all duration-300 ${currentStyle.border} ${currentStyle.bg} overflow-hidden`}>
      <div 
        className="p-4 flex items-start justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-start space-x-3">
          <div className="mt-0.5">{currentStyle.icon}</div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                {flag.type.replace(/_/g, ' ')}
              </span>
              <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold uppercase tracking-widest ${currentStyle.badge}`}>
                {flag.severity}
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1 line-clamp-1 font-mono">
              "{flag.excerpt}"
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-200">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-800 bg-slate-950/40">
          <div className="space-y-3 font-sans text-sm">
            {hasDocContext && (
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-1">Document Context</span>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-slate-300 font-mono text-xs break-words space-y-2">
                  {flag.docType && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Type</span>
                      <span>{flag.docType}</span>
                    </div>
                  )}
                  {flag.docFileName && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">File</span>
                      <span className="text-slate-200 truncate max-w-[220px] sm:max-w-[280px]" title={flag.docFileName}>{flag.docFileName}</span>
                    </div>
                  )}
                  {encodedUrl && (
                    <div>
                      <span className="text-slate-500 block">Source</span>
                      <a
                        href={encodedUrl}
                        target={isExternalUrl ? '_blank' : undefined}
                        rel={isExternalUrl ? 'noreferrer' : undefined}
                        className="text-primary hover:underline break-words"
                      >
                        {encodedUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-1">Affected Segment</span>
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-slate-300 font-mono text-xs break-words border-l-2 border-l-primary">
                "{flag.excerpt}"
              </div>
            </div>
            {hasReportContext && (
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-1">Verification Report</span>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-slate-300 text-xs space-y-2">
                  {(flag.reportCategory || flag.reportScore !== undefined) && (
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-slate-500 uppercase tracking-widest text-[10px]">{flag.reportCategory || 'REPORT'}</span>
                      {flag.reportScore !== undefined && (
                        <span className="text-slate-200">{flag.reportScore}/100</span>
                      )}
                    </div>
                  )}
                  {flag.reportSummary && (
                    <p className="text-slate-400 leading-relaxed">{flag.reportSummary}</p>
                  )}
                </div>
              </div>
            )}
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-1">Intelligence Assessment</span>
              <p className="text-slate-300 leading-relaxed text-xs">
                {flag.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
