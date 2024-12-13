import { NextResponse } from 'next/server';
import { db } from '@/src/db';

export async function GET() {
  try {
    const users = await db.getAllUsers();
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

