import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { seedAll } from '@/lib/seed';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || '';
    const actorId = searchParams.get('actorId') || '';

    let logs = await db.getAuditLogs();
    
    // Auto-seed database if empty
    if (logs.length === 0) {
      console.log('Database empty on audit logs query. Auto-seeding default profiles...');
      await seedAll();
      logs = await db.getAuditLogs();
    }
    
    const filteredLogs = logs.filter(l => {
      if (action && l.action !== action) return false;
      if (actorId && l.actorId.toLowerCase() !== actorId.toLowerCase()) return false;
      return true;
    });

    return NextResponse.json({ success: true, logs: filteredLogs });
  } catch (error: any) {
    console.error('Failed to get audit logs:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
