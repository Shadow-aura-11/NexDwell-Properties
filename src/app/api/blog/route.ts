import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { Post } from '@/lib/types';

// Helper to generate Table of Contents from markdown content
function generateTableOfContents(content: string) {
  const lines = content.split('\n');
  const toc: Array<{ id: string; text: string; depth: number }> = [];
  
  for (const line of lines) {
    // Match H2 (##) and H3 (###) headers
    const match = line.match(/^(##|###)\s+(.+)$/);
    if (match) {
      const depth = match[1].length; // 2 for H2, 3 for H3
      const text = match[2].replace(/[#*`_]/g, '').trim();
      // Generate URL friendly slug from heading text
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      toc.push({ id, text, depth });
    }
  }
  return toc;
}

// Helper to estimate read time in minutes
function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'published'; // 'published' | 'draft' | 'all'

    const db = readDb();
    let results = [...db.posts];

    // Filter by status
    if (status !== 'all') {
      results = results.filter(post => post.status === status);
    }

    if (category) {
      results = results.filter(post => 
        post.categories.some(c => c.toLowerCase() === category.toLowerCase())
      );
    }

    if (tag) {
      results = results.filter(post => 
        post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        post =>
          post.title.toLowerCase().includes(q) ||
          post.content.toLowerCase().includes(q) ||
          post.categories.some(c => c.toLowerCase().includes(q))
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

    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Custom or auto-generated slug
    const cleanSlug = (body.slug || body.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check slug collision
    if (db.posts.some(post => post.slug === cleanSlug)) {
      return NextResponse.json({ error: 'A post with this slug or title already exists' }, { status: 400 });
    }

    const estimatedMins = estimateReadTime(body.content);
    const generatedToc = generateTableOfContents(body.content);

    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: body.title,
      content: body.content,
      slug: cleanSlug,
      status: body.status || 'draft',
      categories: body.categories || ['General'],
      tags: body.tags || [],
      featuredImage: body.featuredImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
      seoTitle: body.seoTitle || `${body.title} | Bookkaro Insights`,
      seoDescription: body.seoDescription || body.content.slice(0, 150).replace(/[#*`_]/g, '') || '',
      seoKeywords: body.seoKeywords || [],
      schemaMarkup: body.schemaMarkup || '',
      faqs: body.faqs || [],
      author: body.author || {
        name: 'Alexander Wright',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100',
        role: 'Principal Broker'
      },
      tableOfContents: generatedToc,
      readTime: estimatedMins,
      scheduledPublishDate: body.scheduledPublishDate || undefined,
      createdAt: new Date().toISOString(),
      views: 0
    };

    db.posts.push(newPost);
    writeDb(db);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
