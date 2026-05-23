'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TrustScoreBadge from '@/components/ui/TrustScoreBadge';
import FlagCard from '@/components/ui/FlagCard';
import DocumentStatusCard from '@/components/ui/DocumentStatusCard';
import CodeCompare from '@/components/ui/CodeCompare';
import { ShieldCheck, Award, FileText, CheckCircle, Clock, AlertTriangle, UserCheck, Layers, FileCode, Check, RefreshCw } from 'lucide-react';

export default function CandidateDashboard() {
  const [candidateId, setCandidateId] = useState<string>('');
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);

  // Load candidate ID from localStorage or fallback
  useEffect(() => {
    const localId = localStorage.getItem('candidatePortalId') || 'candidate-2';
    setCandidateId(localId);
  }, []);

  // Poll candidate status every 2.5 seconds
  useEffect(() => {
    if (!candidateId) return;

    let active = true;

    async function fetchCandidate() {
      try {
        const res = await fetch(`/api/candidates/${candidateId}`);
        const data = await res.json();
        if (active) {
          if (data.success) {
            setCandidate(data.candidate);
            setError('');
          } else {
            setError(data.error || 'Failed to fetch profile.');
          }
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError('Network error syncing profile.');
          setLoading(false);
        }
      }
    }

    fetchCandidate();
    const interval = setInterval(() => {
      setTick(t => t + 1);
      fetchCandidate();
    }, 2500);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [candidateId, tick]);

  const handleCandidateChange = (id: string) => {
    localStorage.setItem('candidatePortalId', id);
    setCandidateId(id);
    setLoading(true);
    setCandidate(null);
  };

  const getTimelineStatus = (stepName: string) => {
    if (!candidate) return 'WAITING';
    if (candidate.status !== 'PENDING') return 'COMPLETED';

    const currentStep = candidate.progressStep || 'UPLOADED';
    const stepsOrder = ['UPLOADED', 'PARSING', 'AI_ANALYSIS', 'SCORING', 'COMPLETED'];
    const currentIdx = stepsOrder.indexOf(currentStep);
    const targetIdx = stepsOrder.indexOf(stepName);

    if (currentIdx > targetIdx) return 'COMPLETED';
    if (currentIdx === targetIdx) return 'ACTIVE';
    return 'WAITING';
  };

  // Re-run pipeline helper
  const handleTriggerAnalysis = async () => {
    if (!candidateId) return;
    setLoading(true);
    try {
      // Set createdTime to now to restart the 6 second timeline simulation
      const form = new FormData();
      // Simple POST trigger or reset
      await fetch(`/api/trust-score/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId })
      });
      setTick(t => t + 1);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 pb-20">
      <Header />

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {/* Profile Switcher & Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-slate-900/50 border border-slate-800 rounded-xl gap-4">
          <div>
            <h2 className="text-sm font-mono text-slate-400 uppercase tracking-widest">Candidate clearance monitor</h2>
            <p className="text-xs text-slate-500 mt-1">Select a candidate to view reports or upload a new candidate via headers.</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="text-xs font-mono text-slate-400">ACTIVE CANDIDATE PROFILE:</label>
            <select
              value={candidateId}
              onChange={(e) => handleCandidateChange(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-primary focus:outline-none"
            >
              <option value="candidate-1">Sarah Jenkins (Verified - 95)</option>
              <option value="candidate-2">Alex Mercer (AI Resume - 42)</option>
              <option value="candidate-3">Michael Chang (Forged AWS - 58)</option>
              <option value="candidate-4">Elena Rostova (Plagiarized Portfolio - 35)</option>
              <option value="candidate-5">David Kim (Finance Transitioner - 75)</option>
            </select>
          </div>
        </div>

        {loading && !candidate ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <span className="font-mono text-xs text-slate-400">CONNECTING SECURE TUNNEL TO PROFILE RECORD...</span>
          </div>
        ) : error ? (
          <div className="p-8 bg-danger/10 border border-danger/20 rounded-xl text-center font-mono text-sm text-danger">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Identity Card & Timeline */}
            <div className="space-y-8">
              {/* Identity Details Card */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.1),transparent_70%)]" />
                <div className="flex items-center space-x-4">
                  <img
                    src={candidate.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                    alt={candidate.fullName}
                    className="w-14 h-14 rounded-full border border-slate-800 object-cover"
                  />
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">AUDITEE</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{candidate.fullName}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{candidate.headline}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 grid grid-cols-2 gap-4 font-mono text-[10px] text-slate-400">
                  <div>
                    <span className="text-slate-500 block uppercase">SECURITY STATE</span>
                    <span className={`font-bold mt-1 inline-block ${
                      candidate.status === 'VERIFIED' ? 'text-success' : candidate.status === 'FLAGGED' ? 'text-danger' : 'text-warning animate-pulse'
                    }`}>
                      {candidate.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase">UID HASH</span>
                    <span className="text-slate-300 block mt-1">{candidate.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* REAL-TIME PIPELINE TIMELINE */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                  <span>Pipeline Verifications Status</span>
                  {candidate.status === 'PENDING' && (
                    <Clock className="w-3.5 h-3.5 text-warning animate-pulse" />
                  )}
                </h3>

                <div className="space-y-5">
                  {/* Step 1: Upload */}
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-slate-300 font-bold block">1. DOCUMENTS UPLOADED</span>
                      <span className="text-[10px] text-slate-500">Files parsed into local repository securely.</span>
                    </div>
                  </div>

                  {/* Step 2: Parsing */}
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getTimelineStatus('PARSING') === 'COMPLETED' ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : getTimelineStatus('PARSING') === 'ACTIVE' ? (
                        <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-700" />
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-mono block ${
                        getTimelineStatus('PARSING') === 'ACTIVE' ? 'text-primary font-bold' : getTimelineStatus('PARSING') === 'COMPLETED' ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        2. TEXT EXTRACTION & PARSE
                      </span>
                      <span className="text-[10px] text-slate-500">pdf-parse reading metadata structures.</span>
                    </div>
                  </div>

                  {/* Step 3: AI NLP Scan */}
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getTimelineStatus('AI_ANALYSIS') === 'COMPLETED' ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : getTimelineStatus('AI_ANALYSIS') === 'ACTIVE' ? (
                        <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-700" />
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-mono block ${
                        getTimelineStatus('AI_ANALYSIS') === 'ACTIVE' ? 'text-primary font-bold' : getTimelineStatus('AI_ANALYSIS') === 'COMPLETED' ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        3. AI NLP FABRICATION ANALYSIS
                      </span>
                      <span className="text-[10px] text-slate-500">Checking vocabulary clusters and style guides.</span>
                    </div>
                  </div>

                  {/* Step 4: Cryptographic verify */}
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getTimelineStatus('SCORING') === 'COMPLETED' ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : getTimelineStatus('SCORING') === 'ACTIVE' ? (
                        <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-700" />
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-mono block ${
                        getTimelineStatus('SCORING') === 'ACTIVE' ? 'text-primary font-bold' : getTimelineStatus('SCORING') === 'COMPLETED' ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        4. CREDENTIAL SIGNATURE AUDIT
                      </span>
                      <span className="text-[10px] text-slate-500">Verifying security hashes and repository plagiarism.</span>
                    </div>
                  </div>

                  {/* Step 5: Trust score compile */}
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {candidate.status !== 'PENDING' ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-700" />
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-mono block ${
                        candidate.status !== 'PENDING' ? 'text-slate-300 font-bold' : 'text-slate-600'
                      }`}>
                        5. WEIGH TRUST INDEX SCORE
                      </span>
                      <span className="text-[10px] text-slate-500">Aggregating categories to compile final rating.</span>
                    </div>
                  </div>
                </div>

                {candidate.status === 'PENDING' && (
                  <div className="mt-6 p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-warning animate-ping" />
                    <span className="text-[10px] font-mono text-slate-400">PIPELINE RUNNING. RE-POLLING IN 3 SECONDS...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Columns: Trust Badge, Reports & Flags */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Trust Index Ring Banner */}
              {candidate.status !== 'PENDING' ? (
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 glow-cyan">
                  <div className="space-y-3 text-center sm:text-left">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-widest font-bold">Auditing Assessment Matrix</span>
                    <h3 className="text-2xl font-extrabold text-white">Trust Index Generated</h3>
                    <p className="text-sm text-slate-400 max-w-md">
                      Candidate clearance metrics are processed. Profile integrity score is calculated at <span className="text-primary font-bold">{candidate.trustScore}%</span>. 
                      Review detailed logs below.
                    </p>
                  </div>
                  
                  <TrustScoreBadge score={candidate.trustScore} size="lg" />
                </div>
              ) : (
                <div className="glass-panel p-8 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-full animate-pulse">
                    <Clock className="w-8 h-8 text-warning" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">Verification Analysis in progress</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-normal">
                      Security scans are reading file streams. Full charts and flags logs will render once complete. Estimated duration: 6 seconds.
                    </p>
                  </div>
                  
                  {/* Fake loader progress line */}
                  <div className="w-48 h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
                  </div>
                </div>
              )}

              {/* Documents Scanned */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">SCANNED PAYLOAD FILES</h3>
                
                {candidate.documents && candidate.documents.length > 0 ? (
                  candidate.documents.map((doc: any) => (
                    <DocumentStatusCard 
                      key={doc.id} 
                      document={doc}
                    />
                  ))
                ) : (
                  <p className="text-xs font-mono text-slate-600">No documents scanned for this candidate profile.</p>
                )}
              </div>

              {/* Render Reports Logs & Flags */}
              {candidate.status !== 'PENDING' && (
                <div className="space-y-6">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">INTELLIGENCE AUDIT FLAGS</h3>
                  
                  {/* Flags list */}
                  <div className="space-y-4">
                    {(() => {
                      const allFlags: any[] = [];
                      candidate.documents.forEach((doc: any) => {
                        doc.reports.forEach((rep: any) => {
                          rep.flags.forEach((fStr: string) => {
                            try {
                              allFlags.push({ ...JSON.parse(fStr), docType: doc.type });
                            } catch {}
                          });
                        });
                      });

                      if (allFlags.length === 0) {
                        return (
                          <div className="p-5 bg-success/5 border border-success/20 rounded-xl flex items-center space-x-3 text-success text-xs font-mono">
                            <ShieldCheck className="w-5 h-5" />
                            <span>NO VERIFICATION ANOMALIES FLAGGED. THIS PROFILE IS CLEAN.</span>
                          </div>
                        );
                      }

                      return allFlags.map((flag, idx) => (
                        <FlagCard key={idx} flag={flag} />
                      ));
                    })()}
                  </div>

                  {/* Render Code Plagiarism Diff View if candidate-4 or template uploaded */}
                  {(() => {
                    const hasPlagiarizedPort = candidate.documents.some((d: any) => 
                      d.type === 'PORTFOLIO' && d.reports.some((r: any) => r.score < 60)
                    );
                    
                    if (hasPlagiarizedPort) {
                      // Get plagiarism score
                      let score = 30;
                      let file = "components/ProductCard.tsx";
                      let repo = "github.com/react-native-community/ecommerce-showcase-app";
                      
                      candidate.documents.forEach((d: any) => {
                        if (d.type === 'PORTFOLIO') {
                          d.reports.forEach((r: any) => {
                            if (r.category === 'PLAGIARISM') {
                              score = r.score;
                              // Check if we can get variables
                              r.flags.forEach((fStr: string) => {
                                try {
                                  const f = JSON.parse(fStr);
                                  if (f.excerpt) {
                                    // Parse file details
                                  }
                                } catch {}
                              });
                            }
                          });
                        }
                      });

                      return (
                        <div className="space-y-3">
                          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">PLAGIARIZED CODE ANALYSIS MATRIX</h4>
                          <CodeCompare 
                            similarity={100 - score} 
                            candidateFile={candidate.id === 'candidate-4' ? "components/ProductCard.tsx" : "src/app/page.tsx"}
                            sourceRepo={candidate.id === 'candidate-4' ? "github.com/react-native-community/ecommerce-showcase-app" : "github.com/vercel/next.js/tree/canary/examples"}
                          />
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
