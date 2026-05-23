import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, email, role, password } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, error: 'Name, email, password, and role are required.' }, { status: 400 });
    }

    // 1. Check if user already exists
    const existing = await db.getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ success: false, error: 'User email already registered.' }, { status: 400 });
    }

    // 2. Create User in DB
    const user = await db.createUser({
      email,
      name,
      role,
      password
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
