import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readDb } from '@/lib/db';
import ReadingProgress from '@/components/ReadingProgress';
import BlogComments from '@/components/BlogComments';
import BlogCard from '@/components/BlogCard';
import { Calendar, Clock, ChevronRight, Share2, Sparkles, BookOpen } from 'lucide-react';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate Dynamic SEO Metadata for Blog Post
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const db = readDb();
  const post = db.posts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: 'Article Not Found | Bookkaro Insights',
    };
  }

  return {
    title: `${post.seoTitle || post.title} | Bookkaro`,
    description: post.seoDescription || post.content.replace(/[#*`_]/g, '').slice(0, 155),
    keywords: post.seoKeywords || post.tags || ['real estate insights'],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.content.replace(/[#*`_]/g, '').slice(0, 155),
      images: [{ url: post.featuredImage }],
      type: 'article',
      publishedTime: post.createdAt,
      authors: [post.author.name],
      tags: post.tags,
    },
  };
}

export default async function BlogDetailPage(props: PageProps) {
  const params = await props.params;
  const db = readDb();
  const post = db.posts.find((p) => p.slug === params.slug && p.status === 'published');

  if (!post) {
    notFound();
  }

  // Get related posts (excluding current post, matching category/tags)
  const relatedPosts = db.posts
    .filter(
      (p) =>
        p.status === 'published' &&
        p.id !== post.id &&
        (p.categories.some((c) => post.categories.includes(c)) || p.tags.some((t) => post.tags.includes(t)))
    )
    .slice(0, 3);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Blog Posting JSON-LD Schema markup for Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.seoDescription || post.content.replace(/[#*`_]/g, '').slice(0, 150),
    'image': post.featuredImage,
    'datePublished': post.createdAt,
    'dateModified': post.createdAt,
    'author': {
      '@type': 'Person',
      'name': post.author.name,
      'jobTitle': post.author.role,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Bookkaro',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bookkaro.com'}/blog/${post.slug}`,
    },
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans min-h-screen relative">
      {/* Scroll indicator Progress Bar */}
      <ReadingProgress />

      {/* JSON-LD Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-8 pb-4 border-b border-slate-900/60 text-left">
          <Link href="/" className="hover:text-emerald-400 transition-colors duration-300">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/blog" className="hover:text-emerald-400 transition-colors duration-300">Insights & Blog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-emerald-400 font-medium truncate max-w-[250px]">{post.title}</span>
        </nav>

        {/* Article Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 text-left">
          {/* Main Content Column (3/4 on large viewports) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header info */}
            <header className="space-y-4">
              <div className="flex gap-2">
                {post.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded uppercase tracking-wider"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {post.title}
              </h1>

              {/* Author & Meta Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-y border-slate-900 py-3">
                <Link href={`/profile/${post.author.name.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-none">{post.author.name}</p>
                    <p className="text-[10px] text-slate-500 mt-1 block leading-none">{post.author.role}</p>
                  </div>
                </Link>

                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-850 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Post Content previewer prose-custom */}
            <div
              className="prose prose-emerald max-w-none prose-custom"
              dangerouslySetInnerHTML={{
                __html: post.content
                  // Simple markdown H2/H3 tag parser for safe visual rendering
                  .replace(/## (.+)/g, '<h2 id="$1">$1</h2>')
                  .replace(/### (.+)/g, '<h3>$1</h3>')
                  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                  // Simple code blocks
                  .replace(/```([a-z]+)?\n([\s\S]+?)\n```/g, '<pre><code>$2</code></pre>')
                  .replace(/\n\n/g, '</p><p>')
                  // Simple link parsing
                  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-emerald-400 hover:underline">$1</a>')
              }}
            />

            {/* Tags Pills */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-900">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 bg-slate-900 border border-slate-850 text-slate-300 text-[10px] font-bold rounded-lg uppercase tracking-wider"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Structured FAQ accordion boards */}
            {post.faqs && post.faqs.length > 0 && (
              <div className="pt-8 border-t border-slate-900 space-y-4">
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Frequently Asked Questions (Google Indexable)
                </h3>
                <div className="space-y-3">
                  {post.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/60 border border-slate-900 rounded-xl p-4 space-y-1.5"
                    >
                      <h4 className="text-xs font-bold text-white">{faq.question}</h4>
                      <p className="text-xs text-slate-400 font-light leading-normal">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Form & List */}
            <BlogComments postSlug={post.slug} />
          </div>

          {/* Sidebar Column (Table of Contents + Social Share) */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Table of Contents sticky card */}
            {post.tableOfContents && post.tableOfContents.length > 0 && (
              <div className="sticky top-24 bg-slate-900 border border-slate-850 p-5 rounded-2xl shadow-lg">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  Table of Contents
                </h4>
                <ul className="space-y-3 text-xs">
                  {post.tableOfContents.map((h, i) => (
                    <li
                      key={i}
                      style={{ paddingLeft: `${(h.depth - 2) * 12}px` }}
                      className="border-l border-slate-800 pl-3 py-0.5 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                      <a href={`#${h.text}`} className="text-slate-400 hover:text-emerald-400 transition-colors block truncate">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 5. Recommended Articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-10 border-t border-slate-900 text-left">
            <div className="mb-8">
              <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-1">Articles In Focus</h2>
              <h3 className="text-xl font-bold text-white tracking-tight">Related Market Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((item) => (
                <BlogCard key={item.id} post={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
