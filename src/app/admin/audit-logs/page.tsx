'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { ArrowLeft, Terminal, ShieldAlert, Cpu, Activity, User, Shield, Search } from 'lucide-react';
import Link from 'next/link';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [searchActor, setSearchActor] = useState('');

  useEffect(() => {
    async function loadLogs() {
      try {
        const qParams = new URLSearchParams();
        if (actionFilter) qParams.append('action', actionFilter);
        if (searchActor) qParams.append('actorId', searchActor);

        const res = await fetch(`/api/audit-logs?${qParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setLogs(data.logs);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [actionFilter, searchActor]);

  return (
    <div className="min-h-screen bg-background text-slate-100 pb-20 scanlines">
      <Header />

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {/* Title */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight font-mono flex items-center space-x-3">
              <Terminal className="w-7 h-7 text-primary" />
              <span>Immutable System Audit Logs</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Audit trail of document uploads, profile clearances, downloads, and role updates.
            </p>
          </div>
        </div>

        {/* LOGS FILTERS */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Action Filter */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">FILTER ACTION:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-none"
            >
              <option value="">All Actions</option>
              <option value="VIEW_PROFILE">VIEW_PROFILE</option>
              <option value="DOWNLOAD_REPORT">DOWNLOAD_REPORT</option>
              <option value="UPLOAD_DOCUMENTS">UPLOAD_DOCUMENTS</option>
              <option value="VERIFICATION_COMPLETE">VERIFICATION_COMPLETE</option>
              <option value="USER_ROLE_CHANGE">USER_ROLE_CHANGE</option>
            </select>
          </div>

          {/* Actor Search */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search Actor ID..."
              value={searchActor}
              onChange={(e) => setSearchActor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition-all font-mono"
            />
          </div>
        </div>

        {/* Log list grid */}
        <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden font-mono">
          <div className="bg-slate-900/50 p-3.5 border-b border-slate-850 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest">
            <span>SECURE SYSTEM LOG CONSOLE</span>
            <span className="text-primary font-bold">STATE: TUNNEL OPEN</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">
              DECRYPTING SYSTEM AUDIT LEDGER...
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-600 italic">
              No audit records match the current lookup index.
            </div>
          ) : (
            <div className="divide-y divide-slate-900 text-xs">
              {logs.map((log) => {
                let metadataObj: any = {};
                try { metadataObj = JSON.parse(log.metadata); } catch {}

                return (
                  <div key={log.id} className="p-4 hover:bg-slate-900/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3.5">
                      <div className={`p-2 rounded border mt-0.5 ${
                        log.action.includes('COMPLETE') 
                          ? 'bg-success/5 border-success/20 text-success' 
                          : log.action.includes('UPLOAD')
                          ? 'bg-primary/5 border-primary/20 text-primary'
                          : 'bg-slate-950 border-slate-900 text-slate-500'
                      }`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-200 tracking-wide text-xs">{log.action}</span>
                          <span className="text-[10px] text-slate-500">|</span>
                          <span className="text-[10px] text-slate-400">Actor: @{log.actorId.slice(0, 8)}</span>
                        </div>
                        <p className="text-slate-400 text-xs font-sans">
                          Modified target <span className="font-mono text-[10px] text-slate-500">{log.targetType}</span> ID <span className="font-mono text-[10px] text-slate-500">@{log.targetId.slice(0, 8)}</span>
                        </p>
                        
                        {Object.keys(metadataObj).length > 0 && (
                          <div className="text-[10px] text-slate-500 flex flex-wrap gap-x-4 pt-0.5 font-mono">
                            {Object.entries(metadataObj).map(([key, val]) => (
                              <span key={key}>{key}: <span className="text-slate-400">{String(val)}</span></span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right text-[10px] text-slate-500 font-mono flex-shrink-0 self-start md:self-center">
                      <span>{new Date(log.timestamp).toISOString().slice(0, 19).replace('T', ' ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
