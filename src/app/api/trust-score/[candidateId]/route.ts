import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { candidateId: string } }) {
  try {
    const candidateId = params.candidateId;
    const candidate = await db.getCandidateById(candidateId);

    if (!candidate) {
      return NextResponse.json({ success: false, error: 'Candidate not found.' }, { status: 404 });
    }

    if (!candidate.trustBreakdown) {
      return NextResponse.json({
        success: true,
        trustBreakdown: {
          resumeScore: 0,
          certificateScore: 0,
          portfolioScore: 0,
          finalScore: 0
        }
      });
    }

    return NextResponse.json({ success: true, trustBreakdown: candidate.trustBreakdown });
  } catch (error: any) {
    console.error('Failed to get trust score breakdown:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
