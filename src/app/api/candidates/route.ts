import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { seedAll } from '@/lib/seed';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const status = searchParams.get('status') || ''; // VERIFIED, FLAGGED, PENDING
    const risk = searchParams.get('risk') || ''; // LOW, MEDIUM, HIGH
    const minScore = parseInt(searchParams.get('minScore') || '0', 10);
    const maxScore = parseInt(searchParams.get('maxScore') || '100', 10);

    let candidates = await db.getCandidates();
    
    // Auto-seed database if empty
    if (candidates.length === 0) {
      console.log('Database empty on candidate query. Auto-seeding default profiles...');
      await seedAll();
      candidates = await db.getCandidates();
    }
    
    // Filter candidates
    const filteredCandidates = candidates.filter(c => {
      // 1. Search Query
      if (query) {
        const q = query.toLowerCase();
        const nameMatch = c.fullName.toLowerCase().includes(q);
        const headlineMatch = (c.headline || '').toLowerCase().includes(q);
        const emailMatch = c.user && c.user.email && c.user.email.toLowerCase() === q;
        if (!nameMatch && !headlineMatch && !emailMatch) return false;
      }

      // 2. Status
      if (status && c.status !== status) return false;

      // 3. Risk Level
      if (risk) {
        let candidateRisk = 'LOW';
        if (c.trustScore <= 40) candidateRisk = 'HIGH';
        else if (c.trustScore <= 70) candidateRisk = 'MEDIUM';

        if (candidateRisk !== risk) return false;
      }

      // 4. Score Range
      if (c.trustScore < minScore || c.trustScore > maxScore) return false;

      return true;
    });

    return NextResponse.json({ success: true, candidates: filteredCandidates });
  } catch (error: any) {
    console.error('Failed to get candidates:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
