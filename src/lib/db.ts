import fs from 'fs';
import path from 'path';

// Interface for type safety
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
  flags: string[]; // parsed from JSON array
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

// Local File Database path (within workspace for persistence)
const DB_FILE = path.join(process.cwd(), 'src', 'lib', 'mockDb.json');

// Memory cache for local database
let localDbCache: {
  users: UserData[];
  candidates: CandidateProfileData[];
  documents: DocumentData[];
  reports: VerificationReportData[];
  breakdowns: TrustBreakdownData[];
  logs: AuditLogData[];
} | null = null;

// Initialize or read the local database
function readLocalDb() {
  if (localDbCache) return localDbCache;

  // Make sure directory exists
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

  // Set default structure
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

// Try initializing Prisma
let prisma: any = null;
let usePrisma = false;

if (process.env.DATABASE_URL) {
  try {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
    usePrisma = true;
    console.log('Prisma Client initialized with DATABASE_URL.');
  } catch (e) {
    console.warn('Prisma package/client not ready. Defaulting to local JSON database.');
  }
} else {
  console.log('No DATABASE_URL found in environment. Defaulting to local JSON database.');
}

// Exported Database Interface (DAO)
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
    if (usePrisma) {
      try {
        await prisma.auditLog.deleteMany({});
        await prisma.trustBreakdown.deleteMany({});
        await prisma.verificationReport.deleteMany({});
        await prisma.document.deleteMany({});
        await prisma.candidateProfile.deleteMany({});
        await prisma.user.deleteMany({});

        // Create Users
        for (const u of seedData.users) {
          await prisma.user.create({
            data: { id: u.id, email: u.email, name: u.name, role: u.role, password: u.password, createdAt: new Date(u.createdAt) }
          });
        }
        // Create Profiles
        for (const c of seedData.candidates) {
          await prisma.candidateProfile.create({
            data: {
              id: c.id,
              userId: c.userId,
              fullName: c.fullName,
              headline: c.headline,
              avatarUrl: c.avatarUrl,
              trustScore: c.trustScore,
              status: c.status,
              createdAt: new Date(c.createdAt)
            }
          });
        }
        // Create Documents
        for (const d of seedData.documents) {
          await prisma.document.create({
            data: { id: d.id, candidateId: d.candidateId, type: d.type, fileUrl: d.fileUrl, fileName: d.fileName, uploadedAt: new Date(d.uploadedAt) }
          });
        }
        // Create Reports
        for (const r of seedData.reports) {
          await prisma.verificationReport.create({
            data: {
              id: r.id,
              documentId: r.documentId,
              category: r.category,
              score: r.score,
              flags: JSON.stringify(r.flags),
              summary: r.summary,
              analyzedAt: new Date(r.analyzedAt)
            }
          });
        }
        // Create Breakdowns
        for (const b of seedData.breakdowns) {
          await prisma.trustBreakdown.create({
            data: {
              id: b.id,
              candidateId: b.candidateId,
              resumeScore: b.resumeScore,
              certificateScore: b.certificateScore,
              portfolioScore: b.portfolioScore,
              finalScore: b.finalScore,
              lastUpdated: new Date(b.lastUpdated)
            }
          });
        }
        // Create Logs
        for (const l of seedData.logs) {
          await prisma.auditLog.create({
            data: {
              id: l.id,
              actorId: l.actorId,
              action: l.action,
              targetId: l.targetId,
              targetType: l.targetType,
              timestamp: new Date(l.timestamp),
              metadata: l.metadata
            }
          });
        }
        console.log('Seeded database via Prisma.');
        return;
      } catch (err) {
        console.error('Prisma seeding failed, falling back to local storage', err);
      }
    }

    // JSON file database implementation
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
    if (usePrisma) {
      try {
        const u = await prisma.user.findMany();
        return u.map((x: any) => ({ ...x, createdAt: x.createdAt.toISOString() }));
      } catch (e) {
        console.error('Prisma getUsers error, falling back to local JSON.', e);
      }
    }
    const dbData = readLocalDb();
    return dbData.users;
  },

  async getUserByEmail(email: string): Promise<UserData | null> {
    if (usePrisma) {
      try {
        const u = await prisma.user.findUnique({ where: { email } });
        if (u) return { ...u, createdAt: u.createdAt.toISOString() };
        return null;
      } catch (e) {
        console.error('Prisma getUserByEmail error, falling back to local JSON.', e);
      }
    }
    const dbData = readLocalDb();
    return dbData.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getUserById(id: string): Promise<UserData | null> {
    if (usePrisma) {
      try {
        const u = await prisma.user.findUnique({ where: { id } });
        if (u) return { ...u, createdAt: u.createdAt.toISOString() };
        return null;
      } catch (e) {
        console.error('Prisma getUserById error, falling back.', e);
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

    if (usePrisma) {
      try {
        const u = await prisma.user.create({
          data: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            password: newUser.password,
            createdAt: new Date(newUser.createdAt)
          }
        });
        return { ...u, createdAt: u.createdAt.toISOString() };
      } catch (e) {
        console.error('Prisma createUser error, falling back.', e);
      }
    }

    const dbData = readLocalDb();
    dbData.users.push(newUser);
    writeLocalDb();
    return newUser;
  },

  // Candidates
  async getCandidates(): Promise<(CandidateProfileData & { user: UserData; trustBreakdown?: TrustBreakdownData })[]> {
    if (usePrisma) {
      try {
        const list = await prisma.candidateProfile.findMany({
          include: {
            user: true,
            trustBreakdown: true
          }
        });
        return list.map((c: any) => ({
          id: c.id,
          userId: c.userId,
          fullName: c.fullName,
          headline: c.headline,
          avatarUrl: c.avatarUrl,
          trustScore: c.trustScore,
          status: c.status,
          createdAt: c.createdAt.toISOString(),
          user: {
            id: c.user.id,
            email: c.user.email,
            name: c.user.name,
            role: c.user.role,
            createdAt: c.user.createdAt.toISOString()
          },
          trustBreakdown: c.trustBreakdown ? {
            id: c.trustBreakdown.id,
            candidateId: c.trustBreakdown.candidateId,
            resumeScore: c.trustBreakdown.resumeScore,
            certificateScore: c.trustBreakdown.certificateScore,
            portfolioScore: c.trustBreakdown.portfolioScore,
            finalScore: c.trustBreakdown.finalScore,
            lastUpdated: c.trustBreakdown.lastUpdated.toISOString()
          } : undefined
        }));
      } catch (e) {
        console.error('Prisma getCandidates error, falling back.', e);
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
    if (usePrisma) {
      try {
        const c = await prisma.candidateProfile.findUnique({
          where: { id },
          include: {
            user: true,
            trustBreakdown: true,
            documents: {
              include: {
                reports: true
              }
            }
          }
        });
        if (!c) return null;
        return {
          id: c.id,
          userId: c.userId,
          fullName: c.fullName,
          headline: c.headline,
          avatarUrl: c.avatarUrl,
          trustScore: c.trustScore,
          status: c.status,
          createdAt: c.createdAt.toISOString(),
          user: {
            id: c.user.id,
            email: c.user.email,
            name: c.user.name,
            role: c.user.role,
            createdAt: c.user.createdAt.toISOString()
          },
          trustBreakdown: c.trustBreakdown ? {
            id: c.trustBreakdown.id,
            candidateId: c.trustBreakdown.candidateId,
            resumeScore: c.trustBreakdown.resumeScore,
            certificateScore: c.trustBreakdown.certificateScore,
            portfolioScore: c.trustBreakdown.portfolioScore,
            finalScore: c.trustBreakdown.finalScore,
            lastUpdated: c.trustBreakdown.lastUpdated.toISOString()
          } : undefined,
          documents: c.documents.map((d: any) => ({
            id: d.id,
            candidateId: d.candidateId,
            type: d.type,
            fileUrl: d.fileUrl,
            fileName: d.fileName,
            uploadedAt: d.uploadedAt.toISOString(),
            reports: d.reports.map((r: any) => ({
              id: r.id,
              documentId: r.documentId,
              category: r.category,
              score: r.score,
              flags: JSON.parse(r.flags),
              summary: r.summary,
              analyzedAt: r.analyzedAt.toISOString()
            }))
          }))
        };
      } catch (e) {
        console.error('Prisma getCandidateById error, falling back.', e);
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
    if (usePrisma) {
      try {
        const c = await prisma.candidateProfile.findUnique({
          where: { userId },
          include: { trustBreakdown: true }
        });
        if (!c) return null;
        return {
          id: c.id,
          userId: c.userId,
          fullName: c.fullName,
          headline: c.headline,
          avatarUrl: c.avatarUrl,
          trustScore: c.trustScore,
          status: c.status,
          createdAt: c.createdAt.toISOString(),
          trustBreakdown: c.trustBreakdown ? {
            id: c.trustBreakdown.id,
            candidateId: c.trustBreakdown.candidateId,
            resumeScore: c.trustBreakdown.resumeScore,
            certificateScore: c.trustBreakdown.certificateScore,
            portfolioScore: c.trustBreakdown.portfolioScore,
            finalScore: c.trustBreakdown.finalScore,
            lastUpdated: c.trustBreakdown.lastUpdated.toISOString()
          } : undefined
        };
      } catch (e) {
        console.error('Prisma getCandidateByUserId error, falling back.', e);
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

    if (usePrisma) {
      try {
        const c = await prisma.candidateProfile.create({
          data: {
            id: newProfile.id,
            userId: newProfile.userId,
            fullName: newProfile.fullName,
            headline: newProfile.headline,
            avatarUrl: newProfile.avatarUrl,
            trustScore: newProfile.trustScore,
            status: newProfile.status,
            createdAt: new Date(newProfile.createdAt)
          }
        });
        return { ...c, createdAt: c.createdAt.toISOString() };
      } catch (e) {
        console.error('Prisma createCandidateProfile error, falling back.', e);
      }
    }

    const dbData = readLocalDb();
    dbData.candidates.push(newProfile);
    writeLocalDb();
    return newProfile;
  },

  async updateCandidateProfile(id: string, data: Partial<CandidateProfileData>): Promise<CandidateProfileData> {
    if (usePrisma) {
      try {
        const c = await prisma.candidateProfile.update({
          where: { id },
          data: {
            ...data,
            // Convert strings back to Enums/Dates
            status: data.status,
          }
        });
        return { ...c, createdAt: c.createdAt.toISOString() };
      } catch (e) {
        console.error('Prisma updateCandidateProfile error, falling back.', e);
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

    if (usePrisma) {
      try {
        const d = await prisma.document.create({
          data: {
            id: newDoc.id,
            candidateId: newDoc.candidateId,
            type: newDoc.type,
            fileUrl: newDoc.fileUrl,
            fileName: newDoc.fileName,
            uploadedAt: new Date(newDoc.uploadedAt)
          }
        });
        return { ...d, uploadedAt: d.uploadedAt.toISOString() };
      } catch (e) {
        console.error('Prisma createDocument error, falling back.', e);
      }
    }

    const dbData = readLocalDb();
    dbData.documents.push(newDoc);
    writeLocalDb();
    return newDoc;
  },

  async getDocumentById(id: string): Promise<DocumentData | null> {
    if (usePrisma) {
      try {
        const d = await prisma.document.findUnique({ where: { id } });
        if (d) return { ...d, uploadedAt: d.uploadedAt.toISOString() };
        return null;
      } catch (e) {
        console.error('Prisma getDocumentById error, falling back.', e);
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

    if (usePrisma) {
      try {
        const r = await prisma.verificationReport.create({
          data: {
            id: newReport.id,
            documentId: newReport.documentId,
            category: newReport.category,
            score: newReport.score,
            flags: JSON.stringify(newReport.flags),
            summary: newReport.summary,
            analyzedAt: new Date(newReport.analyzedAt)
          }
        });
        return { ...r, flags: JSON.parse(r.flags), analyzedAt: r.analyzedAt.toISOString() };
      } catch (e) {
        console.error('Prisma createReport error, falling back.', e);
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

    if (usePrisma) {
      try {
        const b = await prisma.trustBreakdown.upsert({
          where: { candidateId: data.candidateId },
          update: {
            resumeScore: data.resumeScore,
            certificateScore: data.certificateScore,
            portfolioScore: data.portfolioScore,
            finalScore: data.finalScore,
            lastUpdated: new Date(newBreakdown.lastUpdated)
          },
          create: {
            id: newBreakdown.id,
            candidateId: data.candidateId,
            resumeScore: data.resumeScore,
            certificateScore: data.certificateScore,
            portfolioScore: data.portfolioScore,
            finalScore: data.finalScore,
            lastUpdated: new Date(newBreakdown.lastUpdated)
          }
        });
        return { ...b, lastUpdated: b.lastUpdated.toISOString() };
      } catch (e) {
        console.error('Prisma upsertTrustBreakdown error, falling back.', e);
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
    if (usePrisma) {
      try {
        const logs = await prisma.auditLog.findMany({ orderBy: { timestamp: 'desc' } });
        return logs.map((l: any) => ({
          id: l.id,
          actorId: l.actorId,
          action: l.action,
          targetId: l.targetId,
          targetType: l.targetType,
          timestamp: l.timestamp.toISOString(),
          metadata: l.metadata || '{}'
        }));
      } catch (e) {
        console.error('Prisma getAuditLogs error, falling back.', e);
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

    if (usePrisma) {
      try {
        const l = await prisma.auditLog.create({
          data: {
            id: newLog.id,
            actorId: newLog.actorId,
            action: newLog.action,
            targetId: newLog.targetId,
            targetType: newLog.targetType,
            timestamp: new Date(newLog.timestamp),
            metadata: newLog.metadata
          }
        });
        return {
          id: l.id,
          actorId: l.actorId,
          action: l.action,
          targetId: l.targetId,
          targetType: l.targetType,
          timestamp: l.timestamp.toISOString(),
          metadata: l.metadata || '{}'
        };
      } catch (e) {
        console.error('Prisma createAuditLog error, falling back.', e);
      }
    }

    const dbData = readLocalDb();
    dbData.logs.push(newLog);
    writeLocalDb();
    return newLog;
  }
};
