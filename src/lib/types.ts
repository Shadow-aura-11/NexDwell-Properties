export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  address: string;
  type: 'apartment' | 'villa' | 'commercial' | 'plot' | 'rental';
  beds: number;
  baths: number;
  area: number; // in sq ft
  furnished: 'furnished' | 'semi-furnished' | 'unfurnished';
  images: string[];
  amenities: string[];
  floorPlans?: string[];
  mapCoords?: { lat: number; lng: number };
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  featured: boolean;
  status: 'published' | 'draft';
  agentId: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: 'published' | 'draft' | 'scheduled';
  categories: string[];
  tags: string[];
  featuredImage: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  schemaMarkup?: string;
  faqs?: Array<{ question: string; answer: string }>;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  tableOfContents?: Array<{ id: string; text: string; depth: number }>;
  readTime: number; // minutes
  scheduledPublishDate?: string;
  createdAt: string;
  views: number;
}

export interface Inquiry {
  id: string;
  listingId?: string;
  listingTitle?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  type: 'general' | 'property_inquiry' | 'callback' | 'whatsapp';
  createdAt: string;
  status: 'unread' | 'read' | 'contacted';
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  whatsapp?: string;
  avatar: string;
  bio?: string;
  listingsCount?: number;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage: string;
  featuredCities: Array<{ name: string; image: string; count?: number }>;
  navLinks: Array<{ label: string; href: string }>;
  footerLinks: Array<{ label: string; href: string }>;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socials: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface BlogAnalytics {
  totalViews: number;
  totalPosts: number;
  totalComments: number;
  popularPosts: Array<{ id: string; title: string; views: number; slug: string }>;
  viewsOverTime: Array<{ date: string; views: number }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'administrator' | 'editor' | 'author';
  bio?: string;
  avatar: string;
  postsCount?: number;
  password?: string;
}
