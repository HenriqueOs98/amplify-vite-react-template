import { NextResponse } from 'next/server';
import { db } from '@/src/db';

export async function GET() {
  try {
    const courses = await db.client.collection('courses').getList(1, 50, {
      sort: 'title',
    });
    return NextResponse.json(courses);
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

