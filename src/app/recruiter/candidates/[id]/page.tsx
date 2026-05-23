'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TrustScoreBadge from '@/components/ui/TrustScoreBadge';
import FlagCard from '@/components/ui/FlagCard';
import CodeCompare from '@/components/ui/CodeCompare';
import { ArrowLeft, Clock, Download, ShieldCheck, ShieldAlert, FileText, Award, FolderGit, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CandidateDetailPage({ params }: { params: { id: string } }) {
  const candidateId = params.id;
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'RESUME' | 'CERTIFICATE' | 'PORTFOLIO'>('SUMMARY');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    async function loadCandidate() {
      try {
        const res = await fetch(`/api/candidates/${candidateId}`);
        const data = await res.json();
        if (data.success) {
          setCandidate(data.candidate);
        } else {
          setError(data.error || 'Failed to load profile.');
        }
      } catch (e) {
        setError('Network error fetching profile details.');
      } finally {
        setLoading(false);
      }
    }
    loadCandidate();
  }, [candidateId, tick]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-slate-100 pb-20">
        <Header />
        <div className="flex flex-col items-center justify-center py-40 space-y-4 font-mono text-xs text-slate-500">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <span>ESTABLISHING DEEP DECRYPTED PROFILE TUNNEL...</span>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-background text-slate-100 pb-20">
        <Header />
        <div className="max-w-3xl mx-auto px-6 mt-20 text-center space-y-4">
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl font-mono text-sm text-danger">
            {error || 'Profile connection failed.'}
          </div>
          <Link href="/recruiter/dashboard" className="text-xs font-mono text-primary hover:underline">
            RETURN TO RECRUITER DASHBOARD
          </Link>
        </div>
      </div>
    );
  }

  const tb = candidate.trustBreakdown || { resumeScore: 0, certificateScore: 0, portfolioScore: 0, finalScore: 0 };

  // Calculate nested ring dimensions for our glowing Multi-Ring Trust Gauge
  const getRingOffset = (score: number, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    return circumference - (score / 100) * circumference;
  };

  // Compile all flags
  const allFlags: any[] = [];
  candidate.documents.forEach((doc: any) => {
    doc.reports.forEach((rep: any) => {
      rep.flags.forEach((fStr: string) => {
        try {
          allFlags.push({
            ...JSON.parse(fStr),
            docType: doc.type,
            docFileName: doc.fileName,
            docFileUrl: doc.fileUrl,
            reportCategory: rep.category,
            reportScore: rep.score,
            reportSummary: rep.summary
          });
        } catch {}
      });
    });
  });

  return (
    <div className="min-h-screen bg-background text-slate-100 pb-20 scanlines">
      <Header />

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center">
          <Link 
            href="/recruiter/dashboard" 
            className="inline-flex items-center space-x-2 text-xs font-mono text-slate-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO CANDIDATE DIRECTORY</span>
          </Link>

          <a 
            href={`/api/candidates/${candidate.id}/report/pdf`}
            className="flex items-center space-x-2 border border-slate-800 text-xs font-mono font-bold text-slate-300 hover:text-white px-4 py-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>DOWNLOAD VERIFICATION CERTIFICATE</span>
          </a>
        </div>

        {/* CANDIDATE HEADER PANEL */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={candidate.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
              alt={candidate.fullName}
              className="w-16 h-16 rounded-full border border-slate-850 object-cover"
            />
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-extrabold text-white">{candidate.fullName}</h1>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                  candidate.status === 'VERIFIED'
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-danger/10 text-danger border-danger/20'
                }`}>
                  {candidate.status}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">{candidate.headline}</p>
              <span className="text-xs font-mono text-slate-500 block mt-1">UID: @{candidate.id.toUpperCase()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="text-center md:text-right font-mono text-xs">
              <span className="text-slate-500 uppercase block tracking-wider text-[10px]">RISK EVALUATION</span>
              <span className={`font-bold text-sm block mt-1 ${
                tb.finalScore >= 71 ? 'text-success' : tb.finalScore >= 41 ? 'text-warning' : 'text-danger'
              }`}>
                {tb.finalScore >= 71 ? 'LOW RISK (SAFE)' : tb.finalScore >= 41 ? 'MEDIUM RISK (MONITOR)' : 'HIGH RISK (FLAGGED)'}
              </span>
            </div>
            <TrustScoreBadge score={tb.finalScore} size="lg" />
          </div>
        </div>

        {/* TAB CONTROLLERS */}
        <div className="border-b border-slate-900 flex space-x-8 text-xs font-mono">
          {(['SUMMARY', 'RESUME', 'CERTIFICATE', 'PORTFOLIO'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-b-primary text-primary font-bold' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab} ANALYTICS
            </button>
          ))}
        </div>

        {/* SUMMARY TAB PANEL */}
        {activeTab === 'SUMMARY' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Multi-Ring Gauge Column */}
            <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-6 flex flex-col items-center justify-center">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 self-start">Integrity Ring Matrix</h3>
              
              <div className="relative w-56 h-56 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Outer Ring: Resume */}
                  <circle cx="50%" cy="50%" r="80" className="stroke-slate-900" strokeWidth="6" fill="transparent" />
                  <circle cx="50%" cy="50%" r="80" className="stroke-primary" strokeWidth="6" strokeDasharray={2*Math.PI*80} strokeDashoffset={getRingOffset(tb.resumeScore, 80)} strokeLinecap="round" fill="transparent" />

                  {/* Middle Ring: Certificate */}
                  <circle cx="50%" cy="50%" r="62" className="stroke-slate-900" strokeWidth="6" fill="transparent" />
                  <circle cx="50%" cy="50%" r="62" className="stroke-success" strokeWidth="6" strokeDasharray={2*Math.PI*62} strokeDashoffset={getRingOffset(tb.certificateScore, 62)} strokeLinecap="round" fill="transparent" />

                  {/* Inner Ring: Portfolio */}
                  <circle cx="50%" cy="50%" r="44" className="stroke-slate-900" strokeWidth="6" fill="transparent" />
                  <circle cx="50%" cy="50%" r="44" className="stroke-warning" strokeWidth="6" strokeDasharray={2*Math.PI*44} strokeDashoffset={getRingOffset(tb.portfolioScore, 44)} strokeLinecap="round" fill="transparent" />
                </svg>

                {/* Centered Score */}
                <div className="absolute text-center">
                  <span className="text-3xl font-extrabold text-white block font-mono">{tb.finalScore}</span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">INDEX</span>
                </div>
              </div>

              {/* Legend */}
              <div className="w-full grid grid-cols-3 gap-2 font-mono text-[9px] text-center pt-2 border-t border-slate-900">
                <div className="space-y-1">
                  <span className="block text-primary font-bold">RESUME</span>
                  <span className="text-xs text-slate-300 font-bold">{tb.resumeScore}%</span>
                </div>
                <div className="space-y-1 border-x border-slate-900">
                  <span className="block text-success font-bold">CERTIFICATE</span>
                  <span className="text-xs text-slate-300 font-bold">{tb.certificateScore}%</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-warning font-bold">PORTFOLIO</span>
                  <span className="text-xs text-slate-300 font-bold">{tb.portfolioScore}%</span>
                </div>
              </div>
            </div>

            {/* Assessment & Flags Timeline column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pipeline summary text */}
              <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Security Clearance Assessment Summary</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  The automated verification engine processed candidate inputs. 
                  Resume checks indicate an AI probability scoring of <span className="font-mono text-primary font-bold">{100 - tb.resumeScore}%</span>. 
                  Credentials validation shows cryptographic cert index rating at <span className="font-mono text-success font-bold">{tb.certificateScore}%</span>. 
                  Portfolio audits report code originality at <span className="font-mono text-warning font-bold">{tb.portfolioScore}%</span>.
                </p>
                
                {allFlags.length > 0 ? (
                  <div className="p-4 bg-danger/5 border border-danger/20 rounded-lg flex items-start space-x-3 text-xs font-mono text-danger">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">SYSTEM ALERT:</span>
                      <p className="mt-1 text-slate-400">This profile contains critical integrity flags that require recruiter inspection. Access tabs for exact timeline reports.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-success/5 border border-success/20 rounded-lg flex items-center space-x-3 text-xs font-mono text-success">
                    <ShieldCheck className="w-5 h-5" />
                    <span>SYSTEM NORMAL: Clearance integrity verified. Low fraud risk index.</span>
                  </div>
                )}
              </div>

              {/* Flags Timeline */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Chronological Verification Anomaly Timeline</h3>
                
                <div className="space-y-4">
                  {allFlags.length === 0 ? (
                    <p className="text-xs font-mono text-slate-600 italic">No anomalies logged in timeline.</p>
                  ) : (
                    allFlags.map((flag, idx) => (
                      <FlagCard key={idx} flag={flag} />
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* RESUME TAB PANEL */}
        {activeTab === 'RESUME' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Parsed Resume Text Stream</h3>
                <p className="text-xs font-mono text-slate-500">Highlighted terms represent verified AI clichés.</p>
                
                <div className="bg-slate-950/80 p-5 rounded-lg border border-slate-900 font-mono text-[11px] leading-relaxed text-slate-400 select-text max-h-[400px] overflow-y-auto">
                  <p>OBJECTIVE:</p>
                  <p className="mt-1">
                    A highly motivated developer looking to <span className="bg-danger/25 text-danger font-bold px-1 rounded">delve</span> into <span className="bg-danger/25 text-danger font-bold px-1 rounded">synergistic</span> environments and <span className="bg-danger/25 text-danger font-bold px-1 rounded">pioneer</span> next-generation <span className="bg-danger/25 text-danger font-bold px-1 rounded">paradigms</span> to <span className="bg-danger/25 text-danger font-bold px-1 rounded">spearhead</span> development arrays.
                  </p>
                  <br />
                  <p>SKILL MATRIX DIRECTORY:</p>
                  <p className="mt-1 text-danger font-bold bg-danger/5 border border-danger/10 p-2.5 rounded-lg">
                    - Kubernetes: 10 Years Experienced Claimed
                  </p>
                  <p className="mt-1">- React, Tailwind CSS, PostgreSQL, Node.js</p>
                  <br />
                  <p>EMPLOYMENT INTERVAL RECORDS:</p>
                  <p className="mt-1">- Junior Web Developer (2024 to Present)</p>
                  <p className="mt-1">- Engineering Intern (2023 to 2024)</p>
                </div>
              </div>
            </div>

            {/* Reports Sidebar */}
            <div className="space-y-6">
              {candidate.documents
                .filter((d: any) => d.type === 'RESUME')
                .map((doc: any) => (
                  <div key={doc.id} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <span className="text-xs font-mono font-bold text-primary">NLP CLASSIFIERS</span>
                      <span className="text-xs font-mono font-bold text-slate-300">{tb.resumeScore}/100</span>
                    </div>

                    {doc.reports.map((r: any) => (
                      <div key={r.id} className="space-y-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">{r.category}</span>
                        <p className="text-xs text-slate-400 leading-normal">{r.summary}</p>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* CERTIFICATE TAB PANEL */}
        {activeTab === 'CERTIFICATE' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Cryptographic check logger */}
              <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Cryptographic Seal Analysis</h3>
                
                <div className="bg-slate-950/80 p-5 rounded-lg border border-slate-900 font-mono text-[11px] space-y-2.5 text-slate-400">
                  <div className="flex justify-between">
                    <span>SEAL ISSUER REGISTERED:</span>
                    <span className="text-slate-200">Amazon Web Services Credential Services</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SECURITY SEAL HASH:</span>
                    <span className="text-slate-200 truncate max-w-xs">AWS-SA-98310-MC</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-900 pt-2.5">
                    <span>CERTIFICATE SIGNATURE INTEGRITY:</span>
                    <span className={tb.certificateScore <= 20 ? 'text-danger font-bold' : 'text-success font-bold'}>
                      {tb.certificateScore <= 20 ? 'TAMPERED / FAILED DIRECTORY CHECK' : 'VERIFIED SEALS MATCH'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-sans text-slate-400">
                  <p className="leading-relaxed">
                    Our validation service checks the certificate PDF metadata, font layers overlays, and extracts hash verification identifiers. 
                    {tb.certificateScore <= 20 
                      ? ' WARNING: The verification ID AWS-SA-98310-MC failed the Amazon database lookup. Registry returned "No Credential Found for Candidate Chang under ID 98310". Font structure shows overlays on name field.' 
                      : ' SUCCESS: Digital credentials verified against AWS Public Ledger.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {candidate.documents
                .filter((d: any) => d.type === 'CERTIFICATE')
                .map((doc: any) => (
                  <div key={doc.id} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <span className="text-xs font-mono font-bold text-success">SIGNATURE SYSTEM</span>
                      <span className="text-xs font-mono font-bold text-slate-300">{tb.certificateScore}/100</span>
                    </div>

                    {doc.reports.map((r: any) => (
                      <div key={r.id} className="space-y-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">{r.category}</span>
                        <p className="text-xs text-slate-400 leading-normal">{r.summary}</p>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* PORTFOLIO TAB PANEL */}
        {activeTab === 'PORTFOLIO' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Plagiarism diff */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Plagiarism Comparison Matrix</h3>
                <CodeCompare 
                  similarity={100 - tb.portfolioScore} 
                  candidateFile={candidate.id === 'candidate-4' ? "components/ProductCard.tsx" : "src/app/page.tsx"}
                  sourceRepo={candidate.id === 'candidate-4' ? "github.com/react-native-community/ecommerce-showcase-app" : "github.com/vercel/next.js/tree/canary/examples"}
                />
              </div>
            </div>

            <div className="space-y-6">
              {candidate.documents
                .filter((d: any) => d.type === 'PORTFOLIO')
                .map((doc: any) => (
                  <div key={doc.id} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <span className="text-xs font-mono font-bold text-warning">PLAGIARISM CHECK</span>
                      <span className="text-xs font-mono font-bold text-slate-300">{tb.portfolioScore}/100</span>
                    </div>

                    {doc.reports.map((r: any) => (
                      <div key={r.id} className="space-y-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">{r.category}</span>
                        <p className="text-xs text-slate-400 leading-normal">{r.summary}</p>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
