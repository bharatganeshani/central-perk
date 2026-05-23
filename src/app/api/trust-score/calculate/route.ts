import { NextRequest, NextResponse } from 'next/server';
import { verificationEngine } from '@/lib/verification';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { candidateId } = json;

    if (!candidateId) {
      return NextResponse.json({ success: false, error: 'candidateId is required.' }, { status: 400 });
    }

    const finalScore = await verificationEngine.calculateTrustScore(candidateId);
    return NextResponse.json({ success: true, finalScore });
  } catch (error: any) {
    console.error('Failed to calculate trust score:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
