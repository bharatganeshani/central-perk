import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase';

const useSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

async function uploadToSupabase(file: File, candidateId: string): Promise<string> {
  const bucketName = 'central-perk-uploads';
  const filePath = `${candidateId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

  try {
    // 1. Check/Create Bucket
    const { error: bucketError } = await supabaseAdmin.storage.getBucket(bucketName);
    if (bucketError) {
      console.log(`Bucket ${bucketName} not found, creating...`);
      await supabaseAdmin.storage.createBucket(bucketName, { public: true });
    }

    // 2. Convert to ArrayBuffer -> Buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 3. Upload File
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      console.error('Supabase upload error details:', uploadError);
      throw uploadError;
    }

    // 4. Return Public URL
    const { data: urlData } = supabaseAdmin.storage.from(bucketName).getPublicUrl(filePath);
    return urlData.publicUrl;
  } catch (err) {
    console.error('Failed to upload file to Supabase storage, using mock path:', err);
    return `/uploads/${file.name}`;
  }
}

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
      if (resumeFile.size > 10 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: 'Resume file exceeds 10MB limit.' }, { status: 400 });
      }

      let fileUrl = `/uploads/${resumeFile.name}`;
      if (useSupabase) {
        fileUrl = await uploadToSupabase(resumeFile, candidate.id);
      }
      
      const doc = await db.createDocument({
        candidateId: candidate.id,
        type: 'RESUME',
        fileName: resumeFile.name,
        fileUrl
      });
      documentIds.push(doc.id);
    }

    // 4. Process Certificate
    if (certificateFile && certificateFile.size > 0) {
      if (certificateFile.size > 10 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: 'Certificate file exceeds 10MB limit.' }, { status: 400 });
      }

      let fileUrl = `/uploads/${certificateFile.name}`;
      if (useSupabase) {
        fileUrl = await uploadToSupabase(certificateFile, candidate.id);
      }

      const doc = await db.createDocument({
        candidateId: candidate.id,
        type: 'CERTIFICATE',
        fileName: certificateFile.name,
        fileUrl
      });
      documentIds.push(doc.id);
    }

    // 5. Process Portfolio
    if (portfolioFile && portfolioFile.size > 0) {
      if (portfolioFile.size > 10 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: 'Portfolio file exceeds 10MB limit.' }, { status: 400 });
      }

      let fileUrl = `/uploads/${portfolioFile.name}`;
      if (useSupabase) {
        fileUrl = await uploadToSupabase(portfolioFile, candidate.id);
      }

      const doc = await db.createDocument({
        candidateId: candidate.id,
        type: 'PORTFOLIO',
        fileName: portfolioFile.name,
        fileUrl
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
