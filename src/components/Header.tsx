'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, ChevronDown, RefreshCw, Layers, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<'PUBLIC' | 'CANDIDATE' | 'RECRUITER' | 'ADMIN'>('PUBLIC');
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState('');

  // Detect current role path to match activeRole selector
  useEffect(() => {
    if (pathname.startsWith('/candidate')) {
      setActiveRole('CANDIDATE');
    } else if (pathname.startsWith('/recruiter')) {
      setActiveRole('RECRUITER');
    } else if (pathname.startsWith('/admin')) {
      setActiveRole('ADMIN');
    } else {
      setActiveRole('PUBLIC');
    }
  }, [pathname]);

  const handleRoleChange = (role: 'PUBLIC' | 'CANDIDATE' | 'RECRUITER' | 'ADMIN') => {
    setActiveRole(role);
    setDropdownOpen(false);
    
    if (role === 'PUBLIC') router.push('/');
    else if (role === 'CANDIDATE') {
      // Find candidatePortalId, default to candidate-2 if not uploaded yet
      const candidateId = localStorage.getItem('candidatePortalId') || 'candidate-2';
      router.push(`/candidate/dashboard`);
    }
    else if (role === 'RECRUITER') router.push('/recruiter/dashboard');
    else if (role === 'ADMIN') router.push('/admin/audit-logs');
  };

  const handleResetDb = async () => {
    setResetting(true);
    setResetMsg('');
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setResetMsg('Database reset successfully!');
        // Refresh page to load fresh candidates
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setResetMsg('Reset failed.');
      }
    } catch {
      setResetMsg('Reset failed.');
    } finally {
      setTimeout(() => {
        setResetting(false);
        setResetMsg('');
      }, 3000);
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg group-hover:glow-cyan transition-all">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="font-mono text-sm font-extrabold tracking-widest text-white block">
              CENTRAL <span className="text-primary">PERK</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-slate-500 block uppercase">
              Verification Intelligence Node
            </span>
          </div>
        </Link>

        {/* Navigation Portal Links */}
        <nav className="hidden md:flex items-center space-x-6 font-mono text-xs text-slate-400">
          <Link 
            href="/" 
            className={`hover:text-white transition-colors ${pathname === '/' ? 'text-primary font-bold' : ''}`}
          >
            LANDING
          </Link>
          <Link 
            href="/candidate/dashboard" 
            className={`hover:text-white transition-colors ${pathname.startsWith('/candidate') ? 'text-primary font-bold' : ''}`}
          >
            CANDIDATE PORTAL
          </Link>
          <Link 
            href="/recruiter/dashboard" 
            className={`hover:text-white transition-colors ${pathname.startsWith('/recruiter') ? 'text-primary font-bold' : ''}`}
          >
            RECRUITER DASHBOARD
          </Link>
          <Link 
            href="/admin/audit-logs" 
            className={`hover:text-white transition-colors ${pathname.startsWith('/admin') ? 'text-primary font-bold' : ''}`}
          >
            ADMIN LOGS
          </Link>
        </nav>

        {/* Right Side: Demo Mode Controls */}
        <div className="flex items-center space-x-4">
          {/* Quick Database Reset button */}
          <button
            onClick={handleResetDb}
            disabled={resetting}
            className="flex items-center space-x-2 border border-slate-800 text-[10px] font-mono font-bold text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-900/50 hover:bg-slate-900 transition-all disabled:opacity-50"
            title="Reset DB seed data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin text-primary' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">{resetMsg || 'RESET DEMO DB'}</span>
          </button>

          {/* Sandbox Portal Switcher */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 hover:border-primary/50 transition-all shadow-md"
            >
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">SANDBOX:</span>
              <span className="text-primary font-bold">{activeRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-modal rounded-xl overflow-hidden shadow-2xl z-50">
                <div className="p-3 border-b border-slate-800 bg-slate-950/90 flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                    Change active view
                  </span>
                </div>
                <div className="p-1.5 space-y-1 bg-slate-950/90">
                  <button
                    onClick={() => handleRoleChange('PUBLIC')}
                    className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
                      activeRole === 'PUBLIC' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span>1. Public Landing</span>
                    {activeRole === 'PUBLIC' && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('CANDIDATE')}
                    className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
                      activeRole === 'CANDIDATE' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span>2. Candidate Portal</span>
                    {activeRole === 'CANDIDATE' && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('RECRUITER')}
                    className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
                      activeRole === 'RECRUITER' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span>3. Recruiter Dashboard</span>
                    {activeRole === 'RECRUITER' && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('ADMIN')}
                    className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
                      activeRole === 'ADMIN' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span>4. Admin Logs</span>
                    {activeRole === 'ADMIN' && <Check className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
