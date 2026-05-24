import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { Inquiry } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const db = readDb();
    
    // Sort inquiries by newest first
    const inquiries = [...db.inquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return NextResponse.json(inquiries);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDb();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      listingId: body.listingId || undefined,
      listingTitle: body.listingTitle || undefined,
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      message: body.message,
      type: body.type || 'general',
      createdAt: new Date().toISOString(),
      status: 'unread'
    };

    db.inquiries.push(newInquiry);
    writeDb(db);

    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDb();
    
    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'Inquiry ID and status are required' }, { status: 400 });
    }

    const index = db.inquiries.findIndex(inq => inq.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    db.inquiries[index].status = body.status;
    writeDb(db);

    return NextResponse.json(db.inquiries[index]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
