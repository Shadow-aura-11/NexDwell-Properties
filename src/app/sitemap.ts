import { MetadataRoute } from 'next';
import { readDb } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = readDb();
  
  // Base URLs
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bookkaro.com';

  // Static routes
  const routes = [
    '',
    '/listings',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic listing routes
  const propertyRoutes = db.listings
    .filter((l) => l.status === 'published')
    .map((listing) => ({
      url: `${baseUrl}/listings/${listing.id}`,
      lastModified: listing.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  // Dynamic blog post routes
  const blogRoutes = db.posts
    .filter((p) => p.status === 'published')
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  return [...routes, ...propertyRoutes, ...blogRoutes];
}
