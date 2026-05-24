import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

// Helper to generate Table of Contents from markdown content
function generateTableOfContents(content: string) {
  const lines = content.split('\n');
  const toc: Array<{ id: string; text: string; depth: number }> = [];
  
  for (const line of lines) {
    const match = line.match(/^(##|###)\s+(.+)$/);
    if (match) {
      const depth = match[1].length;
      const text = match[2].replace(/[#*`_]/g, '').trim();
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

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const db = readDb();
    const index = db.posts.findIndex(post => post.slug === params.slug);

    if (index === -1) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Increment views
    db.posts[index].views = (db.posts[index].views || 0) + 1;
    writeDb(db);

    return NextResponse.json(db.posts[index]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const body = await req.json();
    const db = readDb();
    const index = db.posts.findIndex(post => post.slug === params.slug);

    if (index === -1) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const originalPost = db.posts[index];

    // Re-calculate TOC and read time if content is updated
    let updatedToc = originalPost.tableOfContents;
    let updatedReadTime = originalPost.readTime;
    if (body.content !== undefined && body.content !== originalPost.content) {
      updatedToc = generateTableOfContents(body.content);
      updatedReadTime = estimateReadTime(body.content);
    }

    const updatedPost = {
      ...originalPost,
      ...body,
      tableOfContents: updatedToc,
      readTime: updatedReadTime,
      // Handle potential manual slug updates
      slug: body.slug ? body.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : originalPost.slug
    };

    db.posts[index] = updatedPost;
    writeDb(db);

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const db = readDb();
    const filteredPosts = db.posts.filter(post => post.slug !== params.slug);

    if (filteredPosts.length === db.posts.length) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    db.posts = filteredPosts;
    writeDb(db);

    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
