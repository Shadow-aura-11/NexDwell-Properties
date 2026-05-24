import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { Listing } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const beds = searchParams.get('beds');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'published'; // default to published for public queries

    const db = readDb();
    let results = [...db.listings];

    // Filter by status (unless 'all' is requested, typically in admin panel)
    if (status !== 'all') {
      results = results.filter(item => item.status === status);
    }

    if (type) {
      results = results.filter(item => item.type === type);
    }

    if (city) {
      results = results.filter(item => item.city.toLowerCase() === city.toLowerCase());
    }

    if (minPrice) {
      results = results.filter(item => item.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      results = results.filter(item => item.price <= parseFloat(maxPrice));
    }

    if (beds) {
      results = results.filter(item => item.beds >= parseInt(beds));
    }

    if (featured === 'true') {
      results = results.filter(item => item.featured);
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          item.amenities.some(a => a.toLowerCase().includes(q))
      );
    }

    // Sort by newest by default
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = readDb();

    // Basic validation
    if (!body.title || !body.price || !body.city || !body.type) {
      return NextResponse.json({ error: 'Missing required property details' }, { status: 400 });
    }

    const newListing: Listing = {
      id: `list-${Date.now()}`,
      title: body.title,
      description: body.description || '',
      price: parseFloat(body.price),
      city: body.city,
      address: body.address || '',
      type: body.type,
      beds: parseInt(body.beds || 0),
      baths: parseFloat(body.baths || 0),
      area: parseFloat(body.area || 0),
      furnished: body.furnished || 'unfurnished',
      images: body.images && body.images.length > 0 ? body.images : [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200'
      ],
      amenities: body.amenities || [],
      floorPlans: body.floorPlans || [],
      mapCoords: body.mapCoords || { lat: 34.0522, lng: -118.2437 }, // Default center
      seoTitle: body.seoTitle || `${body.title} | Bookkaro`,
      seoDescription: body.seoDescription || body.description?.slice(0, 155) || '',
      seoKeywords: body.seoKeywords || [],
      featured: body.featured === true || body.featured === 'true',
      status: body.status || 'draft',
      agentId: body.agentId || 'agent-1',
      createdAt: new Date().toISOString()
    };

    db.listings.push(newListing);
    writeDb(db);

    return NextResponse.json(newListing, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
