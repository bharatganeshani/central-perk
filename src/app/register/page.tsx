'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Shield, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CANDIDATE' | 'RECRUITER'>('CANDIDATE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);
    setError('');

    // In a full NextAuth setup, we would POST to an API route like /api/register
    // For sandbox, we simulate:
    if (role === 'CANDIDATE') {
      router.push('/candidate/upload');
    } else {
      router.push('/recruiter/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 scanlines pb-20">
      <Header />

      <div className="max-w-md mx-auto px-6 mt-16 md:mt-24 space-y-6">
        <div className="text-center space-y-2">
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-full w-fit mx-auto glow-cyan">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-mono uppercase tracking-wider">
            Clearance Request Form
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Register your profile payload for validation auditing.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6 shadow-2xl">
          {error && (
            <div className="p-3.5 bg-danger/10 border border-danger/20 rounded-lg text-xs font-mono text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 font-mono text-xs">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-slate-500 uppercase tracking-widest text-[9px]">Registration Class</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('CANDIDATE')}
                  className={`py-2 border text-[10px] font-bold rounded-lg transition-all ${
                    role === 'CANDIDATE'
                      ? 'border-primary bg-primary/10 text-primary glow-cyan'
                      : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setRole('RECRUITER')}
                  className={`py-2 border text-[10px] font-bold rounded-lg transition-all ${
                    role === 'RECRUITER'
                      ? 'border-primary bg-primary/10 text-primary glow-cyan'
                      : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Recruiter Agent
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-slate-500 uppercase tracking-widest text-[9px] block">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-3 text-xs text-white focus:outline-none focus:border-primary transition-all font-mono"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-slate-500 uppercase tracking-widest text-[9px] block">Security Email Link</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="e.g. agent@centralperk.security"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-3 text-xs text-white focus:outline-none focus:border-primary transition-all font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-slate-500 uppercase tracking-widest text-[9px] block">Create Passcode Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-3 text-xs text-white focus:outline-none focus:border-primary transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-primary text-slate-950 font-bold rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>REQUEST ENTRY KEY</span>
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link href="/login" className="text-xs font-mono text-slate-500 hover:text-slate-300">
            Already have an active system clearance key? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
