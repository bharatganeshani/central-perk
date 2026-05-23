import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const fullName = formData.get('fullName') as string;
    const headline = formData.get('headline') as string;
    const email = formData.get('email') as string || `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    const avatarUrl = formData.get('avatarUrl') as string || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 100000)}?w=150`;

    // Files
    const resumeFile = formData.get('resume') as File | null;
    const certificateFile = formData.get('certificate') as File | null;
    const portfolioFile = formData.get('portfolio') as File | null;
    const portfolioUrl = formData.get('portfolioUrl') as string || '';

    if (!fullName) {
      return NextResponse.json({ success: false, error: 'Full Name is required.' }, { status: 400 });
    }

    // 1. Create or get User
    let user = await db.getUserByEmail(email);
    if (!user) {
      user = await db.createUser({
        email,
        name: fullName,
        role: 'CANDIDATE',
        password: 'password123'
      });
    }

    // 2. Create Candidate Profile
    const candidate = await db.createCandidateProfile({
      userId: user.id,
      fullName,
      headline,
      avatarUrl
    });

    const documentIds: string[] = [];

    // 3. Process Resume
    if (resumeFile && resumeFile.size > 0) {
      // Validate size < 10MB
      if (resumeFile.size > 10 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: 'Resume file exceeds 10MB limit.' }, { status: 400 });
      }
      
      const doc = await db.createDocument({
        candidateId: candidate.id,
        type: 'RESUME',
        fileName: resumeFile.name,
        fileUrl: `/uploads/${resumeFile.name}` // local storage mock path
      });
      documentIds.push(doc.id);
    }

    // 4. Process Certificate
    if (certificateFile && certificateFile.size > 0) {
      if (certificateFile.size > 10 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: 'Certificate file exceeds 10MB limit.' }, { status: 400 });
      }

      const doc = await db.createDocument({
        candidateId: candidate.id,
        type: 'CERTIFICATE',
        fileName: certificateFile.name,
        fileUrl: `/uploads/${certificateFile.name}`
      });
      documentIds.push(doc.id);
    }

    // 5. Process Portfolio
    if (portfolioFile && portfolioFile.size > 0) {
      if (portfolioFile.size > 10 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: 'Portfolio file exceeds 10MB limit.' }, { status: 400 });
      }

      const doc = await db.createDocument({
        candidateId: candidate.id,
        type: 'PORTFOLIO',
        fileName: portfolioFile.name,
        fileUrl: `/uploads/${portfolioFile.name}`
      });
      documentIds.push(doc.id);
    } else if (portfolioUrl) {
      const doc = await db.createDocument({
        candidateId: candidate.id,
        type: 'PORTFOLIO',
        fileName: 'Portfolio URL Link',
        fileUrl: portfolioUrl
      });
      documentIds.push(doc.id);
    }

    // Log the upload action
    await db.createAuditLog({
      actorId: user.id,
      action: 'UPLOAD_DOCUMENTS',
      targetId: candidate.id,
      targetType: 'CANDIDATE',
      metadata: JSON.stringify({ documentCount: documentIds.length, files: [resumeFile?.name, certificateFile?.name, portfolioFile?.name].filter(Boolean) })
    });

    return NextResponse.json({
      success: true,
      candidateId: candidate.id,
      documentIds,
      status: 'processing'
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
