import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const db = readDb();
    const listing = db.listings.find(item => item.id === params.id);

    if (!listing) {
      return NextResponse.json({ error: 'Property listing not found' }, { status: 404 });
    }

    return NextResponse.json(listing);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const body = await req.json();
    const db = readDb();
    const index = db.listings.findIndex(item => item.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Property listing not found' }, { status: 404 });
    }

    // Merge updates
    const updatedListing = {
      ...db.listings[index],
      ...body,
      // Ensure key properties don't get overwritten with bad data types
      price: body.price !== undefined ? parseFloat(body.price) : db.listings[index].price,
      beds: body.beds !== undefined ? parseInt(body.beds) : db.listings[index].beds,
      baths: body.baths !== undefined ? parseFloat(body.baths) : db.listings[index].baths,
      area: body.area !== undefined ? parseFloat(body.area) : db.listings[index].area,
      featured: body.featured !== undefined ? (body.featured === true || body.featured === 'true') : db.listings[index].featured,
    };

    db.listings[index] = updatedListing;
    writeDb(db);

    return NextResponse.json(updatedListing);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const db = readDb();
    const filteredListings = db.listings.filter(item => item.id !== params.id);

    if (filteredListings.length === db.listings.length) {
      return NextResponse.json({ error: 'Property listing not found' }, { status: 404 });
    }

    db.listings = filteredListings;
    writeDb(db);

    return NextResponse.json({ success: true, message: 'Property listing deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
