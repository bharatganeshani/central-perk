'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { ArrowLeft, BarChart2, ShieldAlert, CheckCircle2, TrendingUp, Cpu, Award, Code, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function RecruiterAnalytics() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandidates() {
      try {
        const res = await fetch('/api/candidates');
        const data = await res.json();
        if (data.success) {
          setCandidates(data.candidates);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, []);

  // Compute metrics offline to prevent dependency errors and keep it fast
  const totalCount = candidates.length;
  
  // Score segments
  const highTrust = candidates.filter(c => c.trustScore >= 71).length;
  const mediumTrust = candidates.filter(c => c.trustScore >= 41 && c.trustScore <= 70).length;
  const lowTrust = candidates.filter(c => c.trustScore <= 40).length;

  // Anomalies count
  let aiResumeCount = 0;
  let certTamperCount = 0;
  let portfolioPlagCount = 0;
  let consistencyDiscrepancyCount = 0;

  candidates.forEach(c => {
    if (c.documents) {
      c.documents.forEach((d: any) => {
        d.reports.forEach((r: any) => {
          r.flags.forEach((fStr: string) => {
            try {
              const flag = JSON.parse(fStr);
              if (flag.type === 'AI_GENERATED_TEXT') aiResumeCount++;
              if (flag.type === 'TAMPERED_SIGNATURE') certTamperCount++;
              if (flag.type === 'PLAGIARISM_MATCH') portfolioPlagCount++;
              if (flag.type === 'SKILLS_EXPERIENCE_INCONSISTENCY') consistencyDiscrepancyCount++;
            } catch {}
          });
        });
      });
    }
  });

  return (
    <div className="min-h-screen bg-background text-slate-100 pb-20 scanlines">
      <Header />

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {/* Navigation */}
        <Link 
          href="/recruiter/dashboard" 
          className="inline-flex items-center space-x-2 text-xs font-mono text-slate-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO DASHBOARD MONITOR</span>
        </Link>

        {/* Page title */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight font-mono">
            Aggregate Security Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Statistical summaries of repository threat models, score distributions, and pipeline counts.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 font-mono text-xs text-slate-500">
            LOADING ANALYTICAL MODELS...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 1: Trust Score Distribution */}
            <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-primary" />
                <span>Trust Score Index Distribution</span>
              </h3>

              <div className="space-y-4 pt-4">
                {/* Bar 1: High */}
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-success font-bold">HIGH TRUST LEVEL (71 - 100)</span>
                    <span className="text-slate-300 font-bold">{highTrust} Candidates ({totalCount ? Math.round((highTrust/totalCount)*100) : 0}%)</span>
                  </div>
                  <div className="h-2.5 bg-slate-950 rounded border border-slate-900 overflow-hidden">
                    <div className="h-full bg-success glow-emerald" style={{ width: `${totalCount ? (highTrust/totalCount)*100 : 0}%` }} />
                  </div>
                </div>

                {/* Bar 2: Medium */}
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-warning font-bold">MEDIUM TRUST LEVEL (41 - 70)</span>
                    <span className="text-slate-300 font-bold">{mediumTrust} Candidates ({totalCount ? Math.round((mediumTrust/totalCount)*100) : 0}%)</span>
                  </div>
                  <div className="h-2.5 bg-slate-950 rounded border border-slate-900 overflow-hidden">
                    <div className="h-full bg-warning glow-amber" style={{ width: `${totalCount ? (mediumTrust/totalCount)*100 : 0}%` }} />
                  </div>
                </div>

                {/* Bar 3: Low */}
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-danger font-bold">LOW TRUST LEVEL (0 - 40)</span>
                    <span className="text-slate-300 font-bold">{lowTrust} Candidates ({totalCount ? Math.round((lowTrust/totalCount)*100) : 0}%)</span>
                  </div>
                  <div className="h-2.5 bg-slate-950 rounded border border-slate-900 overflow-hidden">
                    <div className="h-full bg-danger glow-red" style={{ width: `${totalCount ? (lowTrust/totalCount)*100 : 0}%` }} />
                  </div>
                </div>
              </div>

              <p className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-900 leading-normal">
                Ratings skew displays general candidate credibility trends. High trust ratings indicate low plagiarism and certified cryptographic credentials.
              </p>
            </div>

            {/* Chart 2: Threat Anomaly Frequencies */}
            <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-danger animate-pulse" />
                <span>Integrity Anomaly Frequencies</span>
              </h3>

              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                {/* Metric 1 */}
                <div className="bg-slate-950 p-4 border border-slate-900 rounded-lg text-center space-y-2">
                  <Cpu className="w-5 h-5 text-primary mx-auto" />
                  <span className="text-slate-500 text-[10px] block uppercase tracking-wider">AI Text Resumes</span>
                  <span className="text-xl font-bold text-slate-200">{aiResumeCount}</span>
                </div>

                {/* Metric 2 */}
                <div className="bg-slate-950 p-4 border border-slate-900 rounded-lg text-center space-y-2">
                  <Award className="w-5 h-5 text-success mx-auto" />
                  <span className="text-slate-500 text-[10px] block uppercase tracking-wider">Tampered Credentials</span>
                  <span className="text-xl font-bold text-slate-200">{certTamperCount}</span>
                </div>

                {/* Metric 3 */}
                <div className="bg-slate-950 p-4 border border-slate-900 rounded-lg text-center space-y-2">
                  <Code className="w-5 h-5 text-warning mx-auto" />
                  <span className="text-slate-500 text-[10px] block uppercase tracking-wider">Boilerplate Plagiarism</span>
                  <span className="text-xl font-bold text-slate-200">{portfolioPlagCount}</span>
                </div>

                {/* Metric 4 */}
                <div className="bg-slate-950 p-4 border border-slate-900 rounded-lg text-center space-y-2">
                  <ShieldCheck className="w-5 h-5 text-success mx-auto" />
                  <span className="text-slate-500 text-[10px] block uppercase tracking-wider">Skill Contradictions</span>
                  <span className="text-xl font-bold text-slate-200">{consistencyDiscrepancyCount}</span>
                </div>
              </div>
            </div>

            {/* Verification Trends Over Time */}
            <div className="glass-panel p-6 rounded-xl border border-slate-800 lg:col-span-2 space-y-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span>Monthly Verification Pipeline Activity</span>
              </h3>

              <div className="h-48 flex items-end space-x-3 pt-6 border-b border-slate-900 font-mono text-[9px] text-slate-500 pb-2">
                <div className="flex-1 flex flex-col items-center justify-end h-full space-y-2">
                  <div className="h-[20%] w-full bg-primary/20 border border-primary/30 rounded-t hover:bg-primary transition-all duration-300" title="Jan: 2 checks" />
                  <span>JAN</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-end h-full space-y-2">
                  <div className="h-[40%] w-full bg-primary/20 border border-primary/30 rounded-t hover:bg-primary transition-all duration-300" title="Feb: 4 checks" />
                  <span>FEB</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-end h-full space-y-2">
                  <div className="h-[30%] w-full bg-primary/20 border border-primary/30 rounded-t hover:bg-primary transition-all duration-300" title="Mar: 3 checks" />
                  <span>MAR</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-end h-full space-y-2">
                  <div className="h-[60%] w-full bg-primary/20 border border-primary/30 rounded-t hover:bg-primary transition-all duration-300" title="Apr: 6 checks" />
                  <span>APR</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-end h-full space-y-2">
                  <div className="h-[90%] w-full bg-primary border border-primary rounded-t glow-cyan" style={{ height: `${(totalCount/10)*100}%` }} title={`May: ${totalCount} checks`} />
                  <span className="text-primary font-bold">MAY</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
