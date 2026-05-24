import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json(db.settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDb();
    
    // Merge new settings
    db.settings = {
      ...db.settings,
      ...body
    };
    
    writeDb(db);
    return NextResponse.json(db.settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
