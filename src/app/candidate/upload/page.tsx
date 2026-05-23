'use client';

import React from 'react';
import Header from '@/components/Header';
import UploadForm from '@/components/UploadForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CandidateUploadPage() {
  return (
    <div className="min-h-screen bg-background text-slate-100 pb-20">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-xs font-mono text-slate-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO SECURITY LANDING</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase font-mono">
            Candidate Upload Portal
          </h2>
          <p className="text-slate-400 text-xs font-mono">
            Cryptographic authentication and AI checks will be triggered automatically post upload.
          </p>
        </div>

        <UploadForm />
      </div>
    </div>
  );
}
