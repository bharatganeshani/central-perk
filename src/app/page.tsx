'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import TrustScoreBadge from '@/components/ui/TrustScoreBadge';
import { ShieldCheck, Cpu, Code2, Layers, ArrowRight, ShieldAlert, Award, FileText } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-slate-100 scanlines pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 space-y-24">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-xs font-mono text-primary uppercase tracking-widest glow-cyan">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Academic Integrity Sentinel</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Cryptographic Skill & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-success">
                Academic Profile
              </span> Verification
            </h1>
            
            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-lg">
              Automated document checking, AI-written resume scanning, blockchain-backed credentials audit, and portfolio plagiarism detection. Aggregated into a unified, cryptographically verified Trust Index.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                href="/candidate/upload" 
                className="flex items-center space-x-2 px-6 py-3.5 bg-primary text-slate-950 font-mono font-bold text-sm rounded-lg hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300"
              >
                <span>CANDIDATE SIGNUP & UPLOAD</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/recruiter/dashboard" 
                className="flex items-center space-x-2 px-6 py-3.5 bg-slate-900 border border-slate-800 text-slate-200 font-mono font-bold text-sm rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300"
              >
                <span>RECRUITER ENTERPRISE PORTAL</span>
              </Link>
            </div>
          </div>

          {/* Animated Hero Ring Container */}
          <div className="flex flex-col items-center justify-center p-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl relative overflow-hidden backdrop-blur-md max-w-md mx-auto w-full lg:max-w-none shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06),transparent_60%)]" />
            
            <div className="relative z-10 flex flex-col items-center space-y-6">
              {/* Spinning decorative circles around TrustScoreBadge */}
              <div className="absolute w-56 h-56 rounded-full border border-primary/20 animate-spin-slow border-dashed" />
              <div className="absolute w-48 h-48 rounded-full border border-success/10 animate-reverse-spin border-double" />
              
              <TrustScoreBadge score={95} size="xl" showLabel={false} />
              
              <div className="text-center space-y-2">
                <span className="font-mono text-xs tracking-widest text-success bg-success/10 border border-success/20 px-3 py-1 rounded-full uppercase font-bold">
                  VERIFIED PROFILE CLEARANCE
                </span>
                <h3 className="text-lg font-bold text-white mt-2">Sarah Jenkins</h3>
                <p className="text-xs font-mono text-slate-500">Candidate verification checksum matched. Integrity standard passed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY AUDIT COGNITIVE GRID */}
        <section className="space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="font-mono text-xs text-primary uppercase tracking-widest block font-bold">Verification Engine Blocks</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Three-Tier Anti-Fraud Verification Pipeline</h2>
            <p className="text-slate-400 text-xs font-mono">Real-time heuristics and NLP pipelines analyzing candidate payloads.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Block 1 */}
            <div className="glass-panel p-6 rounded-xl border border-slate-800 hover:glow-cyan transition-all duration-300 space-y-4">
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg w-fit">
                <Cpu className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wide">Resume AI Text Analyzer</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Checks for uniform syntactic complexity, ChatGPT formatting habits, and typical vocabulary cliches. Cross-references employment intervals against claims.
              </p>
              <div className="pt-2 border-t border-slate-900 flex items-center space-x-2 text-xs font-mono text-slate-500">
                <ShieldAlert className="w-4 h-4 text-primary" />
                <span>Flags structural exaggerations</span>
              </div>
            </div>

            {/* Block 2 */}
            <div className="glass-panel p-6 rounded-xl border border-slate-800 hover:glow-emerald transition-all duration-300 space-y-4">
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg w-fit">
                <Award className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wide">Credential Verifier</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Extracts metadata from certificate files and queries digital signatures against known blockchain Ledgers and registration authorities to ensure authenticity.
              </p>
              <div className="pt-2 border-t border-slate-900 flex items-center space-x-2 text-xs font-mono text-slate-500">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span>Authenticates cryptographic hashes</span>
              </div>
            </div>

            {/* Block 3 */}
            <div className="glass-panel p-6 rounded-xl border border-slate-800 hover:glow-amber transition-all duration-300 space-y-4">
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg w-fit">
                <Code2 className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wide">Code Originality Scanner</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Scans portfolio files and GitHub repositories for template copying. Performs line-by-line plagiarism checks against common boilerplates and libraries.
              </p>
              <div className="pt-2 border-t border-slate-900 flex items-center space-x-2 text-xs font-mono text-slate-500">
                <Layers className="w-4 h-4 text-warning" />
                <span>Line similarity diff comparisons</span>
              </div>
            </div>
          </div>
        </section>

        {/* DEMO ARCHETYPES VIEW */}
        <section className="bg-slate-900/30 border border-slate-800 p-8 rounded-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-xl font-bold text-white uppercase font-mono tracking-wider">Demo Sandbox Sandbox Simulation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We've prepopulated the database with five diverse profiles designed to demonstrate our pipeline validations. Select the Recruiter Dashboard or Candidate Portal above to inspect:
              </p>
              <ul className="text-xs font-mono text-slate-500 space-y-2 pt-2">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-success rounded-full" />
                  <span>Sarah Jenkins (95 Trust Index - Verified)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-danger rounded-full" />
                  <span>Alex Mercer (42 Trust Index - 96% AI Resume)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-warning rounded-full" />
                  <span>Michael Chang (58 Trust Index - Forged AWS Cert)</span>
                </li>
              </ul>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-panel p-5 rounded-xl border border-slate-800 flex items-start justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-primary font-bold uppercase block tracking-wider">Candidate sandbox portal</span>
                  <p className="text-xs text-slate-400">Upload certificates and code repos, track pipeline verification timers, review reports.</p>
                  <Link href="/candidate/upload" className="text-xs font-mono text-primary hover:text-cyan-400 flex items-center space-x-1 pt-2">
                    <span>LAUNCH UPLOAD FORM</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-slate-800 flex items-start justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-success font-bold uppercase block tracking-wider">Recruiter audit dashboard</span>
                  <p className="text-xs text-slate-400">Filter profiles by score/risk classification, read audit logs, view plagiarism diffs.</p>
                  <Link href="/recruiter/dashboard" className="text-xs font-mono text-success hover:text-emerald-400 flex items-center space-x-1 pt-2">
                    <span>OPEN DASHBOARD</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
