import { NextResponse } from 'next/server';
import { seedAll } from '@/lib/seed';

export async function POST() {
  try {
    await seedAll();
    return NextResponse.json({ success: true, message: 'Database successfully reset to seed data.' });
  } catch (error: any) {
    console.error('Database reset failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  // Allow GET as well for simple browser resetting
  try {
    await seedAll();
    return NextResponse.json({ success: true, message: 'Database successfully reset to seed data.' });
  } catch (error: any) {
    console.error('Database reset failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
