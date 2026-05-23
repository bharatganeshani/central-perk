'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Shield, Lock, Mail, RefreshCw, Key } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CANDIDATE' | 'RECRUITER' | 'ADMIN'>('CANDIDATE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Supabase Auth if credentials exist in env
      const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
      
      if (hasSupabase) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (authError) throw authError;
        
        console.log('Supabase authenticated user:', data.user);
      }

      // 2. Sandbox route logic based on selected role
      if (role === 'CANDIDATE') {
        try {
          const res = await fetch(`/api/candidates?query=${encodeURIComponent(email)}`);
          const candData = await res.json();
          if (candData.success && candData.candidates && candData.candidates.length > 0) {
            const candId = candData.candidates[0].id;
            localStorage.setItem('candidatePortalId', candId);
            router.push('/candidate/dashboard');
          } else {
            localStorage.setItem('registeredEmail', email);
            router.push('/candidate/upload');
          }
        } catch (e) {
          localStorage.setItem('candidatePortalId', 'candidate-2'); // fallback default
          router.push('/candidate/dashboard');
        }
      } else if (role === 'RECRUITER') {
        router.push('/recruiter/dashboard');
      } else if (role === 'ADMIN') {
        router.push('/admin/audit-logs');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication tunnel failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (type: 'candidate' | 'recruiter' | 'admin') => {
    if (type === 'candidate') {
      setEmail('alex.mercer@gmail.com');
      setPassword('password123');
      setRole('CANDIDATE');
    } else if (type === 'recruiter') {
      setEmail('recruiter1@centralperk.security');
      setPassword('password123');
      setRole('RECRUITER');
    } else if (type === 'admin') {
      setEmail('admin@centralperk.security');
      setPassword('password123');
      setRole('ADMIN');
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
            Clearance Verification Portal
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Enter registered credentials to access secure terminal sectors.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6 shadow-2xl">
          {error && (
            <div className="p-3.5 bg-danger/10 border border-danger/20 rounded-lg text-xs font-mono text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
            {/* Role selection */}
            <div className="space-y-2">
              <label className="text-slate-500 uppercase tracking-widest text-[9px]">Portal Sector</label>
              <div className="grid grid-cols-3 gap-2">
                {(['CANDIDATE', 'RECRUITER', 'ADMIN'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 border text-[10px] font-bold rounded-lg transition-all ${
                      role === r
                        ? 'border-primary bg-primary/10 text-primary glow-cyan'
                        : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
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
              <label className="text-slate-500 uppercase tracking-widest text-[9px] block">Cryptographic Key Pass</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter passcode"
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
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>DECRYPT ACCESS KEY</span>
                </>
              )}
            </button>
          </form>

          {/* Quick fills */}
          <div className="pt-4 border-t border-slate-900 space-y-2">
            <span className="text-slate-500 font-mono text-[9px] uppercase tracking-widest block">Quick Sandbox Sign-In:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickFill('candidate')}
                className="px-2.5 py-1 bg-slate-950 border border-slate-900 hover:border-slate-800 text-[10px] text-slate-400 font-mono rounded"
              >
                Candidate Profile
              </button>
              <button
                onClick={() => handleQuickFill('recruiter')}
                className="px-2.5 py-1 bg-slate-950 border border-slate-900 hover:border-slate-800 text-[10px] text-slate-400 font-mono rounded"
              >
                Rachel (Recruiter)
              </button>
              <button
                onClick={() => handleQuickFill('admin')}
                className="px-2.5 py-1 bg-slate-950 border border-slate-900 hover:border-slate-800 text-[10px] text-slate-400 font-mono rounded"
              >
                Audit Admin
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/register" className="text-xs font-mono text-slate-500 hover:text-slate-300">
            Request new system registration clearance
          </Link>
        </div>
      </div>
    </div>
  );
}
