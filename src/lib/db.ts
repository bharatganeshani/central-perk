import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from './supabase';

// Interfaces for type safety
export interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
  createdAt: string;
  password?: string;
}

export interface CandidateProfileData {
  id: string;
  userId: string;
  fullName: string;
  headline: string;
  avatarUrl: string;
  trustScore: number;
  status: 'PENDING' | 'VERIFIED' | 'FLAGGED';
  createdAt: string;
}

export interface DocumentData {
  id: string;
  candidateId: string;
  type: 'RESUME' | 'CERTIFICATE' | 'PORTFOLIO';
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
}

export interface VerificationReportData {
  id: string;
  documentId: string;
  category: 'AI_DETECTION' | 'PLAGIARISM' | 'SIGNATURE' | 'CONSISTENCY';
  score: number;
  flags: string[]; // parsed JSON string array
  summary: string;
  analyzedAt: string;
}

export interface TrustBreakdownData {
  id: string;
  candidateId: string;
  resumeScore: number;
  certificateScore: number;
  portfolioScore: number;
  finalScore: number;
  lastUpdated: string;
}

export interface AuditLogData {
  id: string;
  actorId: string;
  action: string;
  targetId: string;
  targetType: string;
  timestamp: string;
  metadata: string; // JSON string
}

// Local File Database path (within workspace for persistence fallback)
const DB_FILE = path.join(process.cwd(), 'src', 'lib', 'mockDb.json');

let localDbCache: {
  users: UserData[];
  candidates: CandidateProfileData[];
  documents: DocumentData[];
  reports: VerificationReportData[];
  breakdowns: TrustBreakdownData[];
  logs: AuditLogData[];
} | null = null;

function readLocalDb() {
  if (localDbCache) return localDbCache;

  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      localDbCache = JSON.parse(content);
      return localDbCache!;
    } catch (e) {
      console.error('Error reading mockDb.json, creating new one.', e);
    }
  }

  localDbCache = {
    users: [],
    candidates: [],
    documents: [],
    reports: [],
    breakdowns: [],
    logs: []
  };
  writeLocalDb();
  return localDbCache;
}

function writeLocalDb() {
  if (!localDbCache) return;
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(localDbCache, null, 2), 'utf-8');
}

// Check Supabase activation credentials
const useSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

if (useSupabase) {
  console.log('Supabase Connection established as DB provider.');
} else {
  console.log('No Supabase credentials found in environment. Defaulting to local JSON database.');
}

// Converters: DB (snake_case) <-> JS (camelCase)
function toJsUser(u: any): UserData {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.created_at,
    password: u.password
  };
}

function toDbUser(u: UserData) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    password: u.password,
    created_at: u.createdAt
  };
}

function toJsCandidate(c: any): CandidateProfileData {
  return {
    id: c.id,
    userId: c.user_id,
    fullName: c.full_name,
    headline: c.headline,
    avatarUrl: c.avatar_url,
    trustScore: c.trust_score,
    status: c.status,
    createdAt: c.created_at
  };
}

function toDbCandidate(c: CandidateProfileData) {
  return {
    id: c.id,
    user_id: c.userId,
    full_name: c.fullName,
    headline: c.headline,
    avatar_url: c.avatarUrl,
    trust_score: c.trustScore,
    status: c.status,
    created_at: c.createdAt
  };
}

function toJsDocument(d: any): DocumentData {
  return {
    id: d.id,
    candidateId: d.candidate_id,
    type: d.type,
    fileUrl: d.file_url,
    fileName: d.file_name,
    uploadedAt: d.uploaded_at
  };
}

function toDbDocument(d: DocumentData) {
  return {
    id: d.id,
    candidate_id: d.candidateId,
    type: d.type,
    file_url: d.fileUrl,
    file_name: d.fileName,
    uploaded_at: d.uploadedAt
  };
}

function toJsReport(r: any): VerificationReportData {
  return {
    id: r.id,
    documentId: r.document_id,
    category: r.category,
    score: r.score,
    flags: typeof r.flags === 'string' ? JSON.parse(r.flags) : (Array.isArray(r.flags) ? r.flags : []),
    summary: r.summary,
    analyzedAt: r.analyzed_at
  };
}

function toDbReport(r: VerificationReportData) {
  return {
    id: r.id,
    document_id: r.documentId,
    category: r.category,
    score: r.score,
    flags: JSON.stringify(r.flags),
    summary: r.summary,
    analyzed_at: r.analyzedAt
  };
}

function toJsBreakdown(b: any): TrustBreakdownData {
  return {
    id: b.id,
    candidateId: b.candidate_id,
    resumeScore: b.resume_score,
    certificateScore: b.certificate_score,
    portfolioScore: b.portfolio_score,
    finalScore: b.final_score,
    lastUpdated: b.last_updated
  };
}

function toDbBreakdown(b: TrustBreakdownData) {
  return {
    id: b.id,
    candidate_id: b.candidateId,
    resume_score: b.resumeScore,
    certificate_score: b.certificateScore,
    portfolio_score: b.portfolioScore,
    final_score: b.finalScore,
    last_updated: b.lastUpdated
  };
}

function toJsAuditLog(l: any): AuditLogData {
  return {
    id: l.id,
    actorId: l.actor_id,
    action: l.action,
    targetId: l.target_id,
    targetType: l.target_type,
    timestamp: l.timestamp,
    metadata: l.metadata
  };
}

function toDbAuditLog(l: AuditLogData) {
  return {
    id: l.id,
    actor_id: l.actorId,
    action: l.action,
    target_id: l.targetId,
    target_type: l.targetType,
    timestamp: l.timestamp,
    metadata: l.metadata
  };
}

export const db = {
  // Reset and Seed DB
  async resetAndSeed(seedData: {
    users: UserData[];
    candidates: CandidateProfileData[];
    documents: DocumentData[];
    reports: VerificationReportData[];
    breakdowns: TrustBreakdownData[];
    logs: AuditLogData[];
  }) {
    if (useSupabase) {
      try {
        // Clear all (order matters for foreign keys)
        await supabaseAdmin.from('audit_logs').delete().neq('id', '0');
        await supabaseAdmin.from('trust_breakdowns').delete().neq('id', '0');
        await supabaseAdmin.from('verification_reports').delete().neq('id', '0');
        await supabaseAdmin.from('documents').delete().neq('id', '0');
        await supabaseAdmin.from('candidate_profiles').delete().neq('id', '0');
        await supabaseAdmin.from('users').delete().neq('id', '0');

        // Insert seed tables
        await supabaseAdmin.from('users').insert(seedData.users.map(toDbUser));
        await supabaseAdmin.from('candidate_profiles').insert(seedData.candidates.map(toDbCandidate));
        await supabaseAdmin.from('documents').insert(seedData.documents.map(toDbDocument));
        await supabaseAdmin.from('verification_reports').insert(seedData.reports.map(toDbReport));
        await supabaseAdmin.from('trust_breakdowns').insert(seedData.breakdowns.map(toDbBreakdown));
        await supabaseAdmin.from('audit_logs').insert(seedData.logs.map(toDbAuditLog));
        
        console.log('Seeded database via Supabase client.');
        return;
      } catch (err) {
        console.error('Supabase seeding failed, falling back to local storage', err);
      }
    }

    // fallback local storage
    localDbCache = {
      users: [...seedData.users],
      candidates: [...seedData.candidates],
      documents: [...seedData.documents],
      reports: [...seedData.reports],
      breakdowns: [...seedData.breakdowns],
      logs: [...seedData.logs]
    };
    writeLocalDb();
    console.log('Seeded local JSON database.');
  },

  // Users
  async getUsers(): Promise<UserData[]> {
    if (useSupabase) {
      try {
        const { data, error } = await supabaseAdmin.from('users').select('*');
        if (error) throw error;
        return data.map(toJsUser);
      } catch (e) {
        console.error('Supabase getUsers error, falling back.', e);
      }
    }
    const dbData = readLocalDb();
    return dbData.users;
  },

  async getUserByEmail(email: string): Promise<UserData | null> {
    if (useSupabase) {
      try {
        const { data, error } = await supabaseAdmin.from('users').select('*').eq('email', email).maybeSingle();
        if (error) throw error;
        if (data) return toJsUser(data);
        return null;
      } catch (e) {
        console.error('Supabase getUserByEmail error, falling back.', e);
      }
    }
    const dbData = readLocalDb();
    return dbData.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getUserById(id: string): Promise<UserData | null> {
    if (useSupabase) {
      try {
        const { data, error } = await supabaseAdmin.from('users').select('*').eq('id', id).maybeSingle();
        if (error) throw error;
        if (data) return toJsUser(data);
        return null;
      } catch (e) {
        console.error('Supabase getUserById error, falling back.', e);
      }
    }
    const dbData = readLocalDb();
    return dbData.users.find(u => u.id === id) || null;
  },

  async createUser(data: Omit<UserData, 'id' | 'createdAt'>): Promise<UserData> {
    const newUser: UserData = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...data
    };

    if (useSupabase) {
      try {
        const { data: inserted, error } = await supabaseAdmin.from('users').insert(toDbUser(newUser)).select().single();
        if (error) throw error;
        return toJsUser(inserted);
      } catch (e) {
        console.error('Supabase createUser error, falling back.', e);
      }
    }

    const dbData = readLocalDb();
    dbData.users.push(newUser);
    writeLocalDb();
    return newUser;
  },

  // Candidates
  async getCandidates(): Promise<(CandidateProfileData & { user: UserData; trustBreakdown?: TrustBreakdownData })[]> {
    if (useSupabase) {
      try {
        // Query details and relations
        const { data, error } = await supabaseAdmin
          .from('candidate_profiles')
          .select('*, users(*), trust_breakdowns(*)');
        
        if (error) throw error;
        
        return data.map((c: any) => {
          const user = c.users ? toJsUser(c.users) : { id: c.user_id, email: '', name: c.full_name, role: 'CANDIDATE' as const, createdAt: '' };
          const trustBreakdown = c.trust_breakdowns ? toJsBreakdown(c.trust_breakdowns) : undefined;
          return {
            ...toJsCandidate(c),
            user,
            trustBreakdown
          };
        });
      } catch (e) {
        console.error('Supabase getCandidates error, falling back.', e);
      }
    }

    const dbData = readLocalDb();
    return dbData.candidates.map(c => {
      const user = dbData.users.find(u => u.id === c.userId) || { id: c.userId, email: '', name: c.fullName, role: 'CANDIDATE' as const, createdAt: '' };
      const trustBreakdown = dbData.breakdowns.find(b => b.candidateId === c.id);
      return {
        ...c,
        user,
        trustBreakdown
      };
    });
  },

  async getCandidateById(id: string): Promise<(CandidateProfileData & { user: UserData; trustBreakdown?: TrustBreakdownData; documents: (DocumentData & { reports: VerificationReportData[] })[] }) | null> {
    if (useSupabase) {
      try {
        // Get relations
        const { data: c, error } = await supabaseAdmin
          .from('candidate_profiles')
          .select('*, users(*), trust_breakdowns(*), documents(*, verification_reports(*))')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        if (!c) return null;

        const user = c.users ? toJsUser(c.users) : { id: c.user_id, email: '', name: c.full_name, role: 'CANDIDATE' as const, createdAt: '' };
        const trustBreakdown = c.trust_breakdowns ? toJsBreakdown(c.trust_breakdowns) : undefined;
        
        const documents = (c.documents || []).map((d: any) => {
          const reports = (d.verification_reports || []).map(toJsReport);
          return {
            ...toJsDocument(d),
            reports
          };
        });

        return {
          ...toJsCandidate(c),
          user,
          trustBreakdown,
          documents
        };
      } catch (e) {
        console.error('Supabase getCandidateById error, falling back.', e);
      }
    }

    const dbData = readLocalDb();
    const c = dbData.candidates.find(x => x.id === id);
    if (!c) return null;

    const user = dbData.users.find(u => u.id === c.userId) || { id: c.userId, email: '', name: c.fullName, role: 'CANDIDATE' as const, createdAt: '' };
    const trustBreakdown = dbData.breakdowns.find(b => b.candidateId === c.id);
    const documents = dbData.documents
      .filter(d => d.candidateId === c.id)
      .map(d => {
        const reports = dbData.reports.filter(r => r.documentId === d.id);
        return {
          ...d,
          reports
        };
      });

    return {
      ...c,
      user,
      trustBreakdown,
      documents
    };
  },

  async getCandidateByUserId(userId: string): Promise<(CandidateProfileData & { trustBreakdown?: TrustBreakdownData }) | null> {
    if (useSupabase) {
      try {
        const { data: c, error } = await supabaseAdmin
          .from('candidate_profiles')
          .select('*, trust_breakdowns(*)')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) throw error;
        if (!c) return null;

        const trustBreakdown = c.trust_breakdowns ? toJsBreakdown(c.trust_breakdowns) : undefined;
        return {
          ...toJsCandidate(c),
          trustBreakdown
        };
      } catch (e) {
        console.error('Supabase getCandidateByUserId error, falling back.', e);
      }
    }
    const dbData = readLocalDb();
    const c = dbData.candidates.find(x => x.userId === userId);
    if (!c) return null;
    const trustBreakdown = dbData.breakdowns.find(b => b.candidateId === c.id);
    return { ...c, trustBreakdown };
  },

  async createCandidateProfile(data: Omit<CandidateProfileData, 'id' | 'createdAt' | 'trustScore' | 'status'>): Promise<CandidateProfileData> {
    const newProfile: CandidateProfileData = {
      id: crypto.randomUUID(),
      trustScore: 0,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      ...data
    };

    if (useSupabase) {
      try {
        const { data: inserted, error } = await supabaseAdmin.from('candidate_profiles').insert(toDbCandidate(newProfile)).select().single();
        if (error) throw error;
        return toJsCandidate(inserted);
      } catch (e) {
        console.error('Supabase createCandidateProfile error, falling back.', e);
      }
    }

    const dbData = readLocalDb();
    dbData.candidates.push(newProfile);
    writeLocalDb();
    return newProfile;
  },

  async updateCandidateProfile(id: string, data: Partial<CandidateProfileData>): Promise<CandidateProfileData> {
    if (useSupabase) {
      try {
        const dbUpdateData: any = {};
        if (data.fullName !== undefined) dbUpdateData.full_name = data.fullName;
        if (data.headline !== undefined) dbUpdateData.headline = data.headline;
        if (data.avatarUrl !== undefined) dbUpdateData.avatar_url = data.avatarUrl;
        if (data.trustScore !== undefined) dbUpdateData.trust_score = data.trustScore;
        if (data.status !== undefined) dbUpdateData.status = data.status;

        const { data: updated, error } = await supabaseAdmin
          .from('candidate_profiles')
          .update(dbUpdateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return toJsCandidate(updated);
      } catch (e) {
        console.error('Supabase updateCandidateProfile error, falling back.', e);
      }
    }

    const dbData = readLocalDb();
    const idx = dbData.candidates.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Candidate not found');

    dbData.candidates[idx] = {
      ...dbData.candidates[idx],
      ...data
    };
    writeLocalDb();
    return dbData.candidates[idx];
  },

  // Documents
  async createDocument(data: Omit<DocumentData, 'id' | 'uploadedAt'>): Promise<DocumentData> {
    const newDoc: DocumentData = {
      id: crypto.randomUUID(),
      uploadedAt: new Date().toISOString(),
      ...data
    };

    if (useSupabase) {
      try {
        const { data: inserted, error } = await supabaseAdmin.from('documents').insert(toDbDocument(newDoc)).select().single();
        if (error) throw error;
        return toJsDocument(inserted);
      } catch (e) {
        console.error('Supabase createDocument error, falling back.', e);
      }
    }

    const dbData = readLocalDb();
    dbData.documents.push(newDoc);
    writeLocalDb();
    return newDoc;
  },

  async getDocumentById(id: string): Promise<DocumentData | null> {
    if (useSupabase) {
      try {
        const { data, error } = await supabaseAdmin.from('documents').select('*').eq('id', id).maybeSingle();
        if (error) throw error;
        if (data) return toJsDocument(data);
        return null;
      } catch (e) {
        console.error('Supabase getDocumentById error, falling back.', e);
      }
    }
    const dbData = readLocalDb();
    return dbData.documents.find(d => d.id === id) || null;
  },

  // Reports
  async createReport(data: Omit<VerificationReportData, 'id' | 'analyzedAt'>): Promise<VerificationReportData> {
    const newReport: VerificationReportData = {
      id: crypto.randomUUID(),
      analyzedAt: new Date().toISOString(),
      ...data
    };

    if (useSupabase) {
      try {
        const { data: inserted, error } = await supabaseAdmin.from('verification_reports').insert(toDbReport(newReport)).select().single();
        if (error) throw error;
        return toJsReport(inserted);
      } catch (e) {
        console.error('Supabase createReport error, falling back.', e);
      }
    }

    const dbData = readLocalDb();
    dbData.reports.push(newReport);
    writeLocalDb();
    return newReport;
  },

  // Trust Breakdown
  async upsertTrustBreakdown(data: Omit<TrustBreakdownData, 'id' | 'lastUpdated'>): Promise<TrustBreakdownData> {
    const newBreakdown: TrustBreakdownData = {
      id: crypto.randomUUID(),
      lastUpdated: new Date().toISOString(),
      ...data
    };

    if (useSupabase) {
      try {
        // Check existence
        const { data: existing } = await supabaseAdmin.from('trust_breakdowns').select('id').eq('candidate_id', data.candidateId).maybeSingle();
        
        let upserted;
        if (existing) {
          const { data: updated, error } = await supabaseAdmin
            .from('trust_breakdowns')
            .update({
              resume_score: data.resumeScore,
              certificate_score: data.certificateScore,
              portfolio_score: data.portfolioScore,
              final_score: data.finalScore,
              last_updated: newBreakdown.lastUpdated
            })
            .eq('candidate_id', data.candidateId)
            .select()
            .single();
          if (error) throw error;
          upserted = updated;
        } else {
          const { data: inserted, error } = await supabaseAdmin
            .from('trust_breakdowns')
            .insert(toDbBreakdown(newBreakdown))
            .select()
            .single();
          if (error) throw error;
          upserted = inserted;
        }
        
        return toJsBreakdown(upserted);
      } catch (e) {
        console.error('Supabase upsertTrustBreakdown error, falling back.', e);
      }
    }

    const dbData = readLocalDb();
    const idx = dbData.breakdowns.findIndex(b => b.candidateId === data.candidateId);
    if (idx === -1) {
      dbData.breakdowns.push(newBreakdown);
    } else {
      dbData.breakdowns[idx] = {
        ...dbData.breakdowns[idx],
        resumeScore: data.resumeScore,
        certificateScore: data.certificateScore,
        portfolioScore: data.portfolioScore,
        finalScore: data.finalScore,
        lastUpdated: newBreakdown.lastUpdated
      };
    }
    writeLocalDb();
    return idx === -1 ? newBreakdown : dbData.breakdowns[idx];
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLogData[]> {
    if (useSupabase) {
      try {
        const { data, error } = await supabaseAdmin.from('audit_logs').select('*').order('timestamp', { ascending: false });
        if (error) throw error;
        return data.map(toJsAuditLog);
      } catch (e) {
        console.error('Supabase getAuditLogs error, falling back.', e);
      }
    }
    const dbData = readLocalDb();
    return dbData.logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async createAuditLog(data: Omit<AuditLogData, 'id' | 'timestamp'>): Promise<AuditLogData> {
    const newLog: AuditLogData = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...data
    };

    if (useSupabase) {
      try {
        const { data: inserted, error } = await supabaseAdmin.from('audit_logs').insert(toDbAuditLog(newLog)).select().single();
        if (error) throw error;
        return toJsAuditLog(inserted);
      } catch (e) {
        console.error('Supabase createAuditLog error, falling back.', e);
      }
    }

    const dbData = readLocalDb();
    dbData.logs.push(newLog);
    writeLocalDb();
    return newLog;
  }
};
