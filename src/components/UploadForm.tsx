'use client';

import React, { useState, useEffect } from 'react';
import { User, FileText, Award, FolderGit, CheckCircle2, ChevronRight, ChevronLeft, Upload, Link2, FileCode, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Prefill registered user details if they just registered
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const regName = localStorage.getItem('registeredName');
      const regEmail = localStorage.getItem('registeredEmail');
      if (regName) setFullName(regName);
      if (regEmail) setEmail(regEmail);
    }
  }, []);

  // Files State
  const [resume, setResume] = useState<File | null>(null);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Step names & icons
  const steps = [
    { num: 1, label: 'Identity', icon: <User className="w-4 h-4" /> },
    { num: 2, label: 'Resume', icon: <FileText className="w-4 h-4" /> },
    { num: 3, label: 'Credentials', icon: <Award className="w-4 h-4" /> },
    { num: 4, label: 'Portfolio', icon: <FolderGit className="w-4 h-4" /> },
    { num: 5, label: 'Verification', icon: <CheckCircle2 className="w-4 h-4" /> }
  ];

  const handleNext = () => {
    if (step === 1 && (!fullName || !email)) {
      setError('Name and Email are required.');
      return;
    }
    setError('');
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setError('');
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'cert' | 'portfolio') => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Maximum file size allowed is 10MB.');
        return;
      }
      setError('');
      if (type === 'resume') setResume(file);
      if (type === 'cert') setCertificate(file);
      if (type === 'portfolio') setPortfolioFile(file);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('headline', headline);
    formData.append('email', email);
    if (avatarUrl) formData.append('avatarUrl', avatarUrl);
    
    if (resume) formData.append('resume', resume);
    if (certificate) formData.append('certificate', certificate);
    if (portfolioFile) formData.append('portfolio', portfolioFile);
    if (portfolioUrl) formData.append('portfolioUrl', portfolioUrl);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Submission failed.');
      }

      // Successful upload, save candidateId to localStorage for candidate view and redirect to candidate dashboard
      localStorage.setItem('candidatePortalId', data.candidateId);
      router.push('/candidate/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Verification pipeline upload failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Visual Step Indicator */}
      <div className="bg-slate-900/50 border-b border-slate-800 p-6">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 font-mono text-xs ${
                  step === s.num
                    ? 'border-primary bg-primary/10 text-primary glow-cyan font-boldScale'
                    : step > s.num
                    ? 'border-success bg-success/10 text-success'
                    : 'border-slate-800 bg-slate-950 text-slate-500'
                }`}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.icon}
                </div>
                <span className={`text-[10px] font-mono tracking-widest uppercase mt-2 ${
                  step === s.num ? 'text-primary font-bold' : 'text-slate-500'
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-[1px] w-8 md:w-16 border-t ${
                  step > s.num + 1 ? 'border-success' : 'border-slate-800'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="p-8 min-h-[350px]">
        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start space-x-3 text-sm text-danger font-mono">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">Step 1: Security Registration Identity</h3>
              <p className="text-slate-400 text-xs mt-1">Please insert the official credentials for auditing records.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono tracking-widest text-slate-400 uppercase block">Full Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary focus:glow-cyan transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono tracking-widest text-slate-400 uppercase block">Contact Email</label>
                <input
                  type="email"
                  placeholder="e.g. sarah@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary focus:glow-cyan transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono tracking-widest text-slate-400 uppercase block">Professional Headline</label>
              <input
                type="text"
                placeholder="e.g. Senior Distributed Systems Engineer"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary focus:glow-cyan transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono tracking-widest text-slate-400 uppercase block">Profile Avatar Image Link (Optional)</label>
              <input
                type="text"
                placeholder="e.g. https://images.unsplash.com/photo-..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary focus:glow-cyan transition-all"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Resume Upload */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">Step 2: Resume Document Check</h3>
              <p className="text-slate-400 text-xs mt-1">AI modeling checks layout patterns, word frequency, and chronological consistencies.</p>
            </div>

            <div className="border border-dashed border-slate-800 hover:border-primary/50 bg-slate-950/60 hover:bg-slate-950 p-8 rounded-xl text-center transition-all cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => handleFileUpload(e, 'resume')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-10 h-10 text-primary/70 mx-auto mb-3" />
              <p className="text-sm text-slate-300 font-medium">Drag and drop your Resume PDF, DOCX or TXT here</p>
              <p className="text-xs text-slate-500 mt-1">Maximum clearance size: 10MB</p>
            </div>

            {resume && (
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between font-mono text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="truncate max-w-[250px]">{resume.name}</span>
                  <span className="text-slate-500">({Math.round(resume.size / 1024)} KB)</span>
                </div>
                <span className="text-success bg-success/10 border border-success/20 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold">READY</span>
              </div>
            )}
            
            <div className="bg-slate-950/50 p-3.5 border border-slate-800 rounded-lg text-xs font-mono text-slate-500">
              <span className="text-primary font-bold mr-1">ℹ️ DEMO TIP:</span>
              Upload files with "ai", "gpt" in the name to watch the system flag AI templates on the dashboard later!
            </div>
          </div>
        )}

        {/* STEP 3: Certificate Upload */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">Step 3: Academic & Certificate Audit</h3>
              <p className="text-slate-400 text-xs mt-1">Validation algorithms check issuer signatures against blockchain registers.</p>
            </div>

            <div className="border border-dashed border-slate-800 hover:border-success/50 bg-slate-950/60 hover:bg-slate-950 p-8 rounded-xl text-center transition-all cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.json"
                onChange={(e) => handleFileUpload(e, 'cert')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-10 h-10 text-success/70 mx-auto mb-3" />
              <p className="text-sm text-slate-300 font-medium">Upload Certifications, Diplomas or Signatures</p>
              <p className="text-xs text-slate-500 mt-1">Accepts PDF, JSON, PNG, or JPG up to 10MB</p>
            </div>

            {certificate && (
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between font-mono text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Award className="w-4 h-4 text-success" />
                  <span className="truncate max-w-[250px]">{certificate.name}</span>
                  <span className="text-slate-500">({Math.round(certificate.size / 1024)} KB)</span>
                </div>
                <span className="text-success bg-success/10 border border-success/20 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold">READY</span>
              </div>
            )}

            <div className="bg-slate-950/50 p-3.5 border border-slate-800 rounded-lg text-xs font-mono text-slate-500">
              <span className="text-success font-bold mr-1">💡 FORGERY CHECK DEMO:</span>
              Upload files containing "tampered" or "fake" to watch the cryptographic signature verification fail in real time!
            </div>
          </div>
        )}

        {/* STEP 4: Portfolio link or file */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">Step 4: Portfolio Originality Check</h3>
              <p className="text-slate-400 text-xs mt-1">Validates codebases against public repositories to detect plagiarism.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono tracking-widest text-slate-400 uppercase block">GitHub Repository URL / Portfolio Link</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. https://github.com/my-profile/project-name"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:border-primary focus:glow-cyan transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center my-4 font-mono text-xs text-slate-600">
                <span>- OR UPLOAD ZIP FILE -</span>
              </div>

              <div className="border border-dashed border-slate-800 hover:border-warning/50 bg-slate-950/60 hover:bg-slate-950 p-8 rounded-xl text-center transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept=".zip,.rar,.tar,.gz"
                  onChange={(e) => handleFileUpload(e, 'portfolio')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-10 h-10 text-warning/70 mx-auto mb-3" />
                <p className="text-sm text-slate-300 font-medium">Upload Project Code Zip Folder</p>
                <p className="text-xs text-slate-500 mt-1">Accepts ZIP, TAR up to 10MB</p>
              </div>

              {portfolioFile && (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <FileCode className="w-4 h-4 text-warning" />
                    <span className="truncate max-w-[250px]">{portfolioFile.name}</span>
                    <span className="text-slate-500">({Math.round(portfolioFile.size / 1024)} KB)</span>
                  </div>
                  <span className="text-success bg-success/10 border border-success/20 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold">READY</span>
                </div>
              )}
            </div>
            
            <div className="bg-slate-950/50 p-3.5 border border-slate-800 rounded-lg text-xs font-mono text-slate-500">
              <span className="text-warning font-bold mr-1">⚠️ PLAGIARISM DEMO:</span>
              Add "boilerplate" or "template" to the filename or link to trigger MOSS template plagiarism flags!
            </div>
          </div>
        )}

        {/* STEP 5: Review & Submit */}
        {step === 5 && (
          <div className="space-y-6 font-mono text-xs">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Step 5: Review Submission</h3>
              <p className="text-slate-400 text-xs mt-1">Confirm and trigger the AI-powered verification pipeline.</p>
            </div>

            <div className="space-y-4 bg-slate-950/80 border border-slate-800 rounded-xl p-5">
              <div className="grid grid-cols-3 gap-2 border-b border-slate-900 pb-3">
                <span className="text-slate-500">Candidate Name:</span>
                <span className="col-span-2 text-slate-200">{fullName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-slate-900 pb-3">
                <span className="text-slate-500">Contact Email:</span>
                <span className="col-span-2 text-slate-200">{email}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-slate-900 pb-3">
                <span className="text-slate-500">Headline:</span>
                <span className="col-span-2 text-slate-200">{headline || 'Not provided'}</span>
              </div>

              <div className="pt-2 space-y-2">
                <span className="text-slate-400 uppercase tracking-widest text-[10px] block mb-1">Payload Documents</span>
                <div className="space-y-2 font-sans">
                  <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                    <span className="text-slate-400 flex items-center"><FileText className="w-3.5 h-3.5 text-primary mr-2" /> Resume</span>
                    <span className={resume ? 'text-success font-bold font-mono' : 'text-slate-600'}>
                      {resume ? resume.name : 'Missing'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                    <span className="text-slate-400 flex items-center"><Award className="w-3.5 h-3.5 text-success mr-2" /> Academic Certs</span>
                    <span className={certificate ? 'text-success font-bold font-mono' : 'text-slate-600'}>
                      {certificate ? certificate.name : 'Missing'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                    <span className="text-slate-400 flex items-center"><FolderGit className="w-3.5 h-3.5 text-warning mr-2" /> Portfolios</span>
                    <span className={portfolioFile || portfolioUrl ? 'text-success font-bold font-mono' : 'text-slate-600'}>
                      {portfolioFile ? portfolioFile.name : (portfolioUrl ? 'GitHub Link Connected' : 'Missing')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-slate-500 leading-normal text-[10px]">
              By clicking SUBMIT AND ANALYZE, you authorize the Central Perk pipeline to run text extraction model arrays and verify digital signatures against official directories. This operation is recorded in the immutable audit logs.
            </p>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="bg-slate-900/50 border-t border-slate-800 p-6 flex justify-between">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 px-4 py-2 border border-slate-800 text-xs font-mono font-bold text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-slate-950 text-xs font-mono font-bold rounded-lg hover:bg-cyan-400 transition-colors duration-300"
          >
            <span>CONTINUE</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2.5 bg-success text-slate-950 text-xs font-mono font-bold rounded-lg hover:bg-emerald-400 transition-colors duration-300 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>ANALYZING PIPELINE...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>SUBMIT & RUN VERIFICATION</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
