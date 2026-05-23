'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TrustScoreBadge from '@/components/ui/TrustScoreBadge';
import { ShieldCheck, ShieldAlert, Users, Clock, Search, Filter, ArrowUpDown, ChevronRight, Download, Activity, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function RecruiterDashboard() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [sortField, setSortField] = useState('trustScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [tick, setTick] = useState(0);

  // Sync data from database APIs
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch candidates with filters
        const qParams = new URLSearchParams();
        if (search) qParams.append('query', search);
        if (statusFilter) qParams.append('status', statusFilter);
        if (riskFilter) qParams.append('risk', riskFilter);

        const res = await fetch(`/api/candidates?${qParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setCandidates(data.candidates);
        }

        // Fetch audit logs
        // We can create a simple route /api/audit-logs or get them from candidates
        const logsRes = await fetch(`/api/candidates`); // or write a separate API endpoint
        // Let's create a quick audit logs API route next, but for now we fetch candidate logs
        const logsData = await fetch('/api/candidates'); // placeholder or read logs
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    // Poll every 5 seconds to catch new candidate uploads
    const interval = setInterval(() => {
      setTick(t => t + 1);
      loadData();
    }, 5000);

    return () => clearInterval(interval);
  }, [search, statusFilter, riskFilter, tick]);

  // Load audit logs separately
  useEffect(() => {
    async function loadLogs() {
      try {
        // Let's implement /api/audit-logs API next, so we can fetch real logs!
        const lRes = await fetch('/api/audit-logs');
        const lData = await lRes.json();
        if (lData.success) {
          setLogs(lData.logs.slice(0, 10));
        }
      } catch {}
    }
    loadLogs();
  }, [tick]);

  // Sort candidates logic
  const sortedCandidates = [...candidates].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];

    if (sortField === 'createdAt') {
      fieldA = new Date(a.createdAt).getTime();
      fieldB = new Date(b.createdAt).getTime();
    }

    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Stats calculation
  const totalCount = candidates.length;
  const verifiedCount = candidates.filter(c => c.status === 'VERIFIED').length;
  const flaggedCount = candidates.filter(c => c.status === 'FLAGGED').length;
  const pendingCount = candidates.filter(c => c.status === 'PENDING').length;
  
  const avgTrustScore = totalCount > 0 
    ? Math.round(candidates.reduce((acc, c) => acc + c.trustScore, 0) / totalCount)
    : 0;

  return (
    <div className="min-h-screen bg-background text-slate-100 pb-20">
      <Header />

      <div className="max-w-7xl mx-auto px-6 mt-10 space-y-8">
        
        {/* Page title */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight font-mono">
              Recruiter Analytics Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Monitoring verified digital signatures, resume AI metrics, and portfolio originality indices.
            </p>
          </div>
          
          <Link 
            href="/recruiter/analytics"
            className="flex items-center space-x-2 border border-primary/20 text-xs font-mono font-bold text-primary hover:bg-primary/10 px-4 py-2 rounded-lg bg-primary/5 transition-all"
          >
            <Activity className="w-4 h-4 text-primary" />
            <span>AGGREGATE ANALYTICS</span>
          </Link>
        </div>

        {/* METRICS STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Candidate Profiles</span>
              <h3 className="text-2xl font-bold text-white">{totalCount}</h3>
              <span className="text-[10px] font-mono text-slate-500">Registered database entries</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <Users className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          {/* Card 2: Verified */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 flex items-center justify-between hover:glow-emerald transition-all">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-success uppercase tracking-widest block font-bold">Verified (Safe)</span>
              <h3 className="text-2xl font-bold text-success">{verifiedCount}</h3>
              <span className="text-[10px] font-mono text-slate-500">Passed all integrity limits</span>
            </div>
            <div className="p-3 bg-success/5 rounded-lg border border-success/20">
              <ShieldCheck className="w-5 h-5 text-success" />
            </div>
          </div>

          {/* Card 3: Flagged */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 flex items-center justify-between hover:glow-red transition-all">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-danger uppercase tracking-widest block font-bold">Flagged (Risk)</span>
              <h3 className="text-2xl font-bold text-danger">{flaggedCount}</h3>
              <span className="text-[10px] font-mono text-slate-500">Anomalies or forgery flagged</span>
            </div>
            <div className="p-3 bg-danger/5 rounded-lg border border-danger/20">
              <ShieldAlert className="w-5 h-5 text-danger" />
            </div>
          </div>

          {/* Card 4: Avg Score */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 flex items-center justify-between hover:glow-cyan transition-all">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest block font-bold">Avg Trust Index</span>
              <h3 className="text-2xl font-bold text-primary">{avgTrustScore}%</h3>
              <span className="text-[10px] font-mono text-slate-500">System mean integrity level</span>
            </div>
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <TrustScoreBadge score={avgTrustScore} size="sm" showLabel={false} />
            </div>
          </div>
        </div>

        {/* WORKFLOW MATRIX SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Candidate Table: Colspan 3 */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Filter and search panels */}
            <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search candidate name or skill..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition-all font-mono"
                />
              </div>

              {/* Select filters */}
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <div className="flex items-center space-x-1 text-slate-500 text-xs font-mono">
                  <Filter className="w-3.5 h-3.5" />
                  <span>STATUS:</span>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="FLAGGED">Flagged</option>
                  <option value="PENDING">Pending</option>
                </select>

                <div className="flex items-center space-x-1 text-slate-500 text-xs font-mono">
                  <span>RISK:</span>
                </div>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-none"
                >
                  <option value="">All Risk Levels</option>
                  <option value="LOW">Low Risk</option>
                  <option value="MEDIUM">Medium Risk</option>
                  <option value="HIGH">High Risk</option>
                </select>
              </div>
            </div>

            {/* Candidates Table List */}
            <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-500 uppercase tracking-widest text-[9px]">
                  <tr>
                    <th className="p-4">Candidate Identity</th>
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('trustScore')}>
                      <div className="flex items-center space-x-1">
                        <span>Trust Score</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="p-4">Risk Class</th>
                    <th className="p-4">Verification State</th>
                    <th className="p-4 text-right">Clearance Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {sortedCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                        No profiles matching active filter matrices.
                      </td>
                    </tr>
                  ) : (
                    sortedCandidates.map((c) => {
                      // Calculate risk level tag
                      let risk = 'LOW';
                      let riskColor = 'text-success bg-success/5 border-success/10 glow-emerald';
                      if (c.trustScore <= 40) {
                        risk = 'HIGH';
                        riskColor = 'text-danger bg-danger/5 border-danger/10 glow-red';
                      } else if (c.trustScore <= 70) {
                        risk = 'MEDIUM';
                        riskColor = 'text-warning bg-warning/5 border-warning/10 glow-amber';
                      }

                      return (
                        <tr key={c.id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={c.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                                alt={c.fullName}
                                className="w-8 h-8 rounded-full border border-slate-800 object-cover"
                              />
                              <div>
                                <span className="font-bold font-sans text-sm text-slate-200 block">{c.fullName}</span>
                                <span className="text-[10px] text-slate-500 block truncate max-w-[200px]">{c.headline || 'No headline'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <TrustScoreBadge score={c.trustScore} size="sm" showLabel={false} />
                              <span className="font-bold text-slate-300">{c.trustScore}/100</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold ${riskColor}`}>
                              {risk} RISK
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                              c.status === 'VERIFIED'
                                ? 'bg-success/10 text-success border-success/20'
                                : c.status === 'FLAGGED'
                                ? 'bg-danger/10 text-danger border-danger/20'
                                : 'bg-warning/10 text-warning border-warning/20 animate-pulse'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <a
                                href={`/api/candidates/${c.id}/report/pdf`}
                                className="p-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded hover:border-slate-700"
                                title="Download Clearance Report"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                              <Link
                                href={`/recruiter/candidates/${c.id}`}
                                className="flex items-center space-x-1 px-2.5 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded hover:bg-primary hover:text-slate-950 transition-colors"
                              >
                                <span>AUDIT</span>
                                <ChevronRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Right Column: Live Audit Logs feed - Colspan 1 */}
          <div className="space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span>Real-Time Audit Logs</span>
            </h3>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-4 max-h-[600px] overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-xs font-mono text-slate-600 text-center py-6">No recent logs recorded.</p>
              ) : (
                logs.map((log) => {
                  let meta: any = {};
                  try { meta = JSON.parse(log.metadata); } catch {}

                  return (
                    <div key={log.id} className="border-b border-slate-900 pb-3 last:border-b-0 space-y-1">
                      <div className="flex justify-between items-start font-mono text-[10px]">
                        <span className="text-primary font-bold">{log.action}</span>
                        <span className="text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-sans">
                        Actor <span className="font-mono text-[10px] text-slate-400">@{log.actorId.slice(0, 8)}</span> performed audit check on {log.targetType.toLowerCase()} ID <span className="font-mono text-[10px] text-slate-400">@{log.targetId.slice(0, 8)}</span>.
                      </p>
                      {meta.checkType && (
                        <span className="text-[9px] font-mono text-slate-500 block">Check type: {meta.checkType} ({meta.result})</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
