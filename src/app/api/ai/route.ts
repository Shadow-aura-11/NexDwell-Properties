import { NextRequest, NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import {
  generatePropertyDescription,
  generateBlogOutline,
  generateSeoMeta,
  generateFaqs,
  clusterKeywords,
  scoreContent,
  suggestInternalLinks,
  rewriteText
} from '@/lib/nvidia';

export async function POST(req: NextRequest) {
  let body: any = null;
  try {
    body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action parameter is required' }, { status: 400 });
    }

    switch (action) {
      case 'description': {
        const { title, type, city, address, beds, baths, area, furnished, amenities } = body;
        if (!title || !type || !city) {
          return NextResponse.json({ error: 'Missing listing fields for description' }, { status: 400 });
        }
        const description = await generatePropertyDescription({
          title,
          type,
          city,
          address: address || '',
          beds: beds || 0,
          baths: baths || 0,
          area: area || 0,
          furnished: furnished || 'unfurnished',
          amenities: amenities || []
        });
        return NextResponse.json({ description });
      }

      case 'outline': {
        const { title, category } = body;
        if (!title || !category) {
          return NextResponse.json({ error: 'Title and category are required for blog outline' }, { status: 400 });
        }
        const outline = await generateBlogOutline(title, category);
        return NextResponse.json({ outline });
      }

      case 'seo': {
        const { title, type, descriptionOrContent } = body;
        if (!title || !type || !descriptionOrContent) {
          return NextResponse.json({ error: 'Title, type, and content are required for SEO generation' }, { status: 400 });
        }
        const seoData = await generateSeoMeta({ title, type, descriptionOrContent });
        return NextResponse.json(seoData);
      }

      case 'faqs': {
        const { title, content } = body;
        if (!title || !content) {
          return NextResponse.json({ error: 'Title and content are required for FAQ generation' }, { status: 400 });
        }
        const faqs = await generateFaqs(title, content);
        return NextResponse.json({ faqs });
      }

      case 'cluster': {
        const { keywords } = body;
        if (!keywords || !Array.isArray(keywords)) {
          return NextResponse.json({ error: 'Keywords array is required for clustering' }, { status: 400 });
        }
        const clusters = await clusterKeywords(keywords);
        return NextResponse.json({ clusters });
      }

      case 'score': {
        const { content, keywords } = body;
        if (!content || !keywords) {
          return NextResponse.json({ error: 'Content and keywords are required for scoring' }, { status: 400 });
        }
        const scoreResult = await scoreContent(content, keywords);
        return NextResponse.json(scoreResult);
      }

      case 'suggest-links': {
        const { content } = body;
        if (!content) {
          return NextResponse.json({ error: 'Content is required for internal link suggestions' }, { status: 400 });
        }
        
        // Fetch current DB listings and posts to suggest real links!
        const db = readDb();
        const availableListings = db.listings.map(l => ({ id: l.id, title: l.title, city: l.city }));
        const availablePosts = db.posts.map(p => ({ id: p.id, title: p.title, slug: p.slug }));
        
        const suggestions = await suggestInternalLinks({
          content,
          availableListings,
          availablePosts
        });
        return NextResponse.json({ suggestions });
      }

      case 'rewrite': {
        const { text, tone } = body;
        if (!text || !tone) {
          return NextResponse.json({ error: 'Text and tone are required for rewriting' }, { status: 400 });
        }
        const rewritten = await rewriteText(text, tone);
        return NextResponse.json({ rewritten });
      }

      default:
        return NextResponse.json({ error: `Unknown AI action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    console.error(`AI API error during action "${body?.action}":`, error);
    return NextResponse.json({ error: error.message || 'AI generation failed' }, { status: 500 });
  }
}
