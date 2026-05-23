import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verificationEngine } from '@/lib/verification';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const candidateId = params.id;
    let candidate = await db.getCandidateById(candidateId);
    
    if (!candidate) {
      return NextResponse.json({ success: false, error: 'Candidate not found.' }, { status: 404 });
    }

    // Check if the candidate analysis is PENDING
    if (candidate.status === 'PENDING') {
      const elapsed = Date.now() - new Date(candidate.createdAt).getTime();
      
      if (elapsed >= 6000) {
        // Run verification pipeline
        console.log(`Running verification pipeline for candidate: ${candidate.fullName}`);
        
        // Loop through documents and verify
        for (const doc of candidate.documents) {
          // Check if report already exists for this document to avoid duplicate runs
          if (doc.reports && doc.reports.length > 0) continue;
          
          if (doc.type === 'RESUME') {
            // Include cliches and contradictions dynamically to test pipeline logic
            const mockResumeText = `
              Full Name: ${candidate.fullName}
              Objective: A highly dynamic developer seeking to delve into synergistic paradigms and spearhead cutting-edge microservice integrations.
              Skills: Kubernetes (10 years experience), React, TailwindCSS, PostgreSQL.
              Professional History:
              - Junior React Developer (2024 - Present): Handled UI updates.
              - Intern (2023 - 2024): Assisted in dev tasks.
            `;
            await verificationEngine.verifyResume(doc.id, mockResumeText);
          } else if (doc.type === 'CERTIFICATE') {
            const hasTampered = doc.fileName.toLowerCase().includes('tampered') || 
                                doc.fileName.toLowerCase().includes('forged') ||
                                doc.fileName.toLowerCase().includes('fake');
            const mockCertText = `AWS Certified Solutions Architect Associate. Verification ID: ${hasTampered ? 'AWS-SA-98310-MC' : 'AWS-SA-VALID-991'}`;
            await verificationEngine.verifyCertificate(doc.id, {
              fileName: doc.fileName,
              text: mockCertText
            });
          } else if (doc.type === 'PORTFOLIO') {
            const isBoilerplate = doc.fileName.toLowerCase().includes('boilerplate') || 
                                  doc.fileName.toLowerCase().includes('template') ||
                                  doc.fileName.toLowerCase().includes('next');
            const mockCode = `
              import React from 'react';
              // Standard Next.js boilerplate template matching community
              // Get started by editing src/app/page.tsx
              export default function Home() {
                return (
                  <main className="flex min-h-screen flex-col items-center justify-between p-24">
                    <div>Get started by editing src/app/page.tsx</div>
                  </main>
                );
              }
            `;
            await verificationEngine.verifyPortfolio(doc.id, {
              urlOrFiles: doc.fileUrl,
              textContent: isBoilerplate ? mockCode : 'Unique custom logic implementation for a neural network dashboard in React.'
            });
          }
        }

        // Calculate final trust score and update DB status
        await verificationEngine.calculateTrustScore(candidateId);
        
        // Fetch freshly updated candidate details
        const updated = await db.getCandidateById(candidateId);
        if (updated) {
          candidate = updated;
        }

        // Log the completion of analysis in audit logs
        await db.createAuditLog({
          actorId: 'system-pipeline',
          action: 'VERIFICATION_COMPLETE',
          targetId: candidateId,
          targetType: 'CANDIDATE',
          metadata: JSON.stringify({ finalScore: candidate.trustScore, status: candidate.status })
        });
      } else {
        // Return with progress state
        let progressStep = 'UPLOADED';
        if (elapsed >= 4500) progressStep = 'SCORING';
        else if (elapsed >= 3000) progressStep = 'AI_ANALYSIS';
        else if (elapsed >= 1500) progressStep = 'PARSING';

        return NextResponse.json({
          success: true,
          candidate: {
            ...candidate,
            progressStep,
            elapsedMs: elapsed
          }
        });
      }
    }

    // Log standard recruiter view event
    await db.createAuditLog({
      actorId: 'user-recruiter-1',
      action: 'VIEW_PROFILE',
      targetId: candidateId,
      targetType: 'CANDIDATE',
      metadata: JSON.stringify({ ip: '127.0.0.1', timestamp: new Date().toISOString() })
    });

    return NextResponse.json({ success: true, candidate });
  } catch (error: any) {
    console.error(`Failed to get candidate ${params.id}:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
