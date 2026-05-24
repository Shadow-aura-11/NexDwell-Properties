import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json(db.agents || []);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve agents' }, { status: 500 });
  }
}
