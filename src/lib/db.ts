import fs from 'fs';
import path from 'path';
import { Listing, Post, Inquiry, Agent, SiteSettings, User } from './types';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Helper to ensure database directory and file exist
function initializeDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const defaultData = getSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

// Function to read all data from local JSON database
export function readDb(): {
  listings: Listing[];
  posts: Post[];
  inquiries: Inquiry[];
  agents: Agent[];
  users: User[];
  settings: SiteSettings;
} {
  initializeDb();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed.users || parsed.users.length === 0 || !parsed.users[0].password) {
      parsed.users = getSeedData().users;
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch (error) {
    console.error('Error reading database file, using seeds', error);
    return getSeedData();
  }
}

// Function to write data back to JSON database
export function writeDb(data: any): void {
  initializeDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database file', error);
  }
}

// Seed Data definition
function getSeedData() {
  const agents: Agent[] = [
    {
      id: 'agent-1',
      name: 'Alexander Wright',
      role: 'Principal Broker / Partner',
      email: 'alexander@bookkaro.com',
      phone: '+1 (555) 892-0192',
      whatsapp: '15558920192',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
      bio: 'Over 15 years of luxury residential sales. Expert in high-end developments and investment portfolios.',
      listingsCount: 4
    },
    {
      id: 'agent-2',
      name: 'Seraphina Vance',
      role: 'Luxury Property Consultant',
      email: 'seraphina@bookkaro.com',
      phone: '+1 (555) 234-9811',
      whatsapp: '15552349811',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      bio: 'Specializing in beachfront estates, glass penthouses, and smart home properties across metro areas.',
      listingsCount: 3
    }
  ];

  const listings: Listing[] = [
    {
      id: 'list-1',
      title: 'The Obsidian Glass Mansion',
      description: 'Suspended above the coastline, this architectural marvel features clean structural lines, dark glass facade, and a cascading double infinity pool. Experience premium luxury with smart home controls, a subterranean car gallery, private health spa, and panoramic ocean vistas from every room. Designed by award-winning architect Kengo Kuma, the residence merges organic materials with bold minimalism.',
      price: 12500000,
      city: 'Malibu',
      address: '27040 Pacific Coast Highway, Malibu, CA 90265',
      type: 'villa',
      beds: 6,
      baths: 7,
      area: 8450,
      furnished: 'furnished',
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'
      ],
      amenities: ['Infinity Pool', 'Subterranean Car Gallery', 'Private Spa', 'Smart Home Integration', 'Private Beach Access', 'Wine Cellar', 'Elevator', 'Home Cinema'],
      floorPlans: ['Main Level - 4,500 sq ft', 'Lower Level (Spa & Gallery) - 3,950 sq ft'],
      mapCoords: { lat: 34.0259, lng: -118.7798 },
      seoTitle: 'The Obsidian Glass Mansion for Sale in Malibu | NexDwell',
      seoDescription: 'Discover Malibu\'s most exclusive coastal estate: The Obsidian Glass Mansion. Features 6 beds, 7 baths, a cascading infinity pool, and subterranean car gallery.',
      seoKeywords: ['Malibu luxury villa', 'Obsidian glass mansion', 'Malibu oceanfront estate', 'buy luxury home Malibu'],
      featured: true,
      status: 'published',
      agentId: 'agent-1',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    },
    {
      id: 'list-2',
      title: 'Aura Heights Triplex Penthouse',
      description: 'Towering above the financial center, the Aura Heights Triplex Penthouse offers unmatched 360-degree city views. It spans the top three floors of the prestigious Aura Tower, boasting a double-height living room with structural columns, Italian marble flooring, and custom bespoke light installations. Features include a private rooftop helipad, a plunge pool, a private executive library, and a butler service kitchen.',
      price: 6800000,
      city: 'Miami',
      address: '777 Brickell Ave, Penthouse A, Miami, FL 33131',
      type: 'apartment',
      beds: 4,
      baths: 5,
      area: 5200,
      furnished: 'furnished',
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1200'
      ],
      amenities: ['Rooftop Plunge Pool', 'Helipad Access', '24/7 White Glove Butler Service', 'Executive Library', 'Private Gym', 'Marble Bathrooms'],
      floorPlans: ['Floor 50 (Day Living)', 'Floor 51 (Night Suites)', 'Floor 52 (Rooftop Deck)'],
      mapCoords: { lat: 25.7651, lng: -80.1909 },
      seoTitle: 'Luxury Triplex Penthouse for Sale in Brickell, Miami | NexDwell',
      seoDescription: 'Unrivaled 360-degree views from the Aura Heights Triplex Penthouse in Miami. Over 5,200 sqft of pure luxury with rooftop plunge pool and 24/7 concierge.',
      seoKeywords: ['Miami penthouse', 'Brickell triplex apartment', 'luxury apartment Miami', 'Miami real estate'],
      featured: true,
      status: 'published',
      agentId: 'agent-2',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
    },
    {
      id: 'list-3',
      title: 'Komorebi Minimalist Villa',
      description: 'Named after the sunlight filtering through leaves, the Komorebi Villa is a sanctuary of peace in the Silicon Valley foothills. Emphasizing Japanese minimalist concepts and Scandinavian warmth (Japandi), the home uses light cedar wood, polished plaster, and soaring structural columns. The courtyard features a dry Zen garden, reflecting pond, and bonsai trees. Heated tatami-mat yoga room and complete eco-friendly passive insulation.',
      price: 4950000,
      city: 'Palo Alto',
      address: '1420 Foothill Road, Palo Alto, CA 94306',
      type: 'villa',
      beds: 3,
      baths: 3.5,
      area: 3800,
      furnished: 'furnished',
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200'
      ],
      amenities: ['Zen Garden', 'Reflecting Pond', 'Geothermal Heating', 'Solar Powered System', 'Yoga Shala', 'Steam Room'],
      floorPlans: ['Single Level Layout - 3,800 sq ft'],
      mapCoords: { lat: 37.4419, lng: -122.143 },
      seoTitle: 'Komorebi Japandi Minimalist Villa in Palo Alto | NexDwell',
      seoDescription: 'Experience Palo Alto living in the Japandi-styled Komorebi Villa. Minimalist architecture, eco-friendly systems, and tranquil private Zen garden.',
      seoKeywords: ['Palo Alto home for sale', 'Japandi style villa Palo Alto', 'minimalist house California'],
      featured: false,
      status: 'published',
      agentId: 'agent-1',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'list-4',
      title: 'Aero Commercial Hub & HQ Office',
      description: 'A premium, modern corporate office building and showroom space ready for a high-tech company or luxury retail headquarters. Features high structural ceilings, floating conference rooms, fully integrated fiber internet, and green wall insulation. The glass lobby offers a grand reception area, and the rooftop skydeck is perfect for corporate networking and events.',
      price: 18900000,
      city: 'Miami',
      address: '120 Biscayne Blvd, Miami, FL 33132',
      type: 'commercial',
      beds: 0,
      baths: 12,
      area: 25000,
      furnished: 'unfurnished',
      images: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'
      ],
      amenities: ['Fiber Internet', 'Rooftop Skydeck', 'Floating Conference Rooms', 'Smart Security Access', 'Underground Parking', 'LEED Certified Green Building'],
      mapCoords: { lat: 25.7781, lng: -80.187 },
      seoTitle: 'Commercial Building Headquarters for Sale in Miami | NexDwell',
      seoDescription: 'Bespoke corporate building on Biscayne Blvd, Miami. Spans 25,000 sq ft of ultra-modern, LEED-certified workspace, floating meeting suites, and rooftop skydeck.',
      seoKeywords: ['Miami commercial building', 'corporate office headquarters Miami', 'Miami real estate commercial'],
      featured: false,
      status: 'published',
      agentId: 'agent-1',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'list-5',
      title: 'Sanctuary Waterfront Villa (Rental)',
      description: 'Live the luxury coastal dream on a rental lease. Located in a private cove, the Sanctuary Waterfront Villa offers daily ocean breezes, a custom teak sun deck, and a saltwater swimming pool. The interior design features soft linen textures, white oak floors, and premium appliances. Perfect for long-term executive retreats.',
      price: 25000, // Monthly rent
      city: 'Malibu',
      address: '22000 Malibu Road, Malibu, CA 90265',
      type: 'rental',
      beds: 3,
      baths: 3,
      area: 3200,
      furnished: 'furnished',
      images: [
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=1200'
      ],
      amenities: ['Saltwater Pool', 'Teak Deck', 'Private Cove Access', 'Chef\'s Kitchen', 'Security Cameras', 'Smart HVAC'],
      mapCoords: { lat: 34.029, lng: -118.692 },
      seoTitle: 'Luxury Oceanfront Villa for Rent in Malibu | NexDwell Rent',
      seoDescription: 'Waterfront rental available. 3 beds, 3 baths, private cove access, saltwater swimming pool, and bespoke furnishings on Malibu Road. Lease details inside.',
      seoKeywords: ['Malibu rental house', 'luxury rent Malibu', 'beachfront house lease CA'],
      featured: true,
      status: 'published',
      agentId: 'agent-2',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const posts: Post[] = [
    {
      id: 'post-1',
      title: 'The Shift Toward Architectural Minimalism in High-End Real Estate',
      content: '## The Evolution of Luxury Space\n\nLuxury is no longer defined by heavy gold-plated moldings, dark draperies, and overcrowded rooms. In recent years, a strong structural shift toward **architectural minimalism** has reshaped the highest tier of real estate. Modern buyers look for light, space, and a deep connection to the surrounding environment.\n\n### Core Pillars of Modern Minimalist Architecture\n\n1. **Seamless Transitions:** Floor-to-ceiling glass doors that slide into wall pockets, blurring the line between indoor living rooms and outdoor terraces.\n2. **Organic Materials:** Polished concrete, raw cedar, and unrefined limestone that age gracefully and create texturized warmth instead of clinical coldness.\n3. **Hidden Functional Mechanics:** Inverted ceiling light slots, invisible handleless cabinets, and hidden HVAC diffusers that reduce visual clutter.\n\n```html\n<!-- Example of a minimalist layout pattern -->\n<div class="glassmorphism-card transition-all duration-500 hover:shadow-2xl">\n  <h3 class="font-sans text-xl text-emerald-400">Pure Geometry</h3>\n  <p class="text-slate-300">Clean lines dictate flow, allowing natural light to be the artwork.</p>\n</div>\n```\n\n### Sustainability and Smart Tech Integration\n\nThis aesthetic simplicity is powered by complex engineering. Underneath the clean lines lie smart HVAC systems controlled by artificial intelligence, geothermal heating panels, and double-insulated glass that blocks heat while letting light in. Real estate values for homes with high structural design integrity have outperformed traditional homes by nearly **18% over the past three years**.\n\n*Buying a home is no longer just about square footage. It is about spatial harmony.*',
      slug: 'architectural-minimalism-high-end-real-estate',
      status: 'published',
      categories: ['Architecture', 'Market Trends'],
      tags: ['Luxury Design', 'Minimalism', 'Smart Homes'],
      featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      seoTitle: 'Minimalist Architecture Trends in Luxury Real Estate',
      seoDescription: 'Explore the structural shift toward minimalist architecture in premium real estate. Discover why high-end buyers prioritize spatial harmony and raw organic materials.',
      seoKeywords: ['luxury architecture', 'minimalist real estate', 'modern home design', 'Japandi luxury homes'],
      schemaMarkup: '{"@context":"https://schema.org","@type":"BlogPosting","headline":"The Shift Toward Architectural Minimalism in High-End Real Estate","description":"Explore the structural shift toward minimalist architecture in premium real estate.","image":"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800","author":{"@type":"Person","name":"Alexander Wright"}}',
      faqs: [
        {
          question: 'What is Japandi design in luxury homes?',
          answer: 'Japandi is the blending of Japanese artistic minimalism and Scandinavian rustic warmth, focusing on clean lines, light woods, and organic textures.'
        },
        {
          question: 'Do minimalist homes have lower energy costs?',
          answer: 'Yes. Most modern minimalist designs use advanced structural glazing and passive building techniques that yield high thermal efficiency.'
        }
      ],
      author: {
        name: 'Alexander Wright',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100',
        role: 'Principal Broker'
      },
      tableOfContents: [
        { id: 'the-evolution-of-luxury-space', text: 'The Evolution of Luxury Space', depth: 2 },
        { id: 'core-pillars-of-modern-minimalist-architecture', text: 'Core Pillars of Modern Minimalist Architecture', depth: 3 },
        { id: 'sustainability-and-smart-tech-integration', text: 'Sustainability and Smart Tech Integration', depth: 3 }
      ],
      readTime: 4,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      views: 1420
    },
    {
      id: 'post-2',
      title: 'How AI and SEO are Changing the Property Listing Ecosystem',
      content: '## A Digital Renaissance in Home Searching\n\nOver **92% of homebuyers** begin their journey online. In this crowded marketplace, traditional listing techniques are no longer sufficient. Agents who harness artificial intelligence to generate localized, semantic SEO content are claiming the top spots on Google Search, outranking bloated portal aggregates.\n\n### The Power of Localized SEO Semantics\n\nSearch engines have evolved from keyword matching to understanding search intent. Instead of typing "villas for sale in Malibu," buyers search for "secluded mid-century homes with ocean access Malibu." AI models are optimized to write descriptions targeting these exact high-value long-tail keywords.\n\n*   **Structured Schema Data:** JSON-LD schema lets engines index bedroom counts, prices, and locations directly.\n*   **FAQ Content Strategy:** Generating responses to common local questions captures Google\'s Featured Snippets.\n*   **Semantic Interlinking:** Creating structural paths between listings and blogs keeps users on page longer.',
      slug: 'ai-seo-changing-property-listing-ecosystem',
      status: 'published',
      categories: ['Marketing', 'Technology'],
      tags: ['AI SEO', 'Real Estate SEO', 'Digital Marketing'],
      featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
      seoTitle: 'AI and SEO Strategies for Real Estate Listings',
      seoDescription: 'Learn how AI-driven SEO is revolutionizing property listings. Outrank aggregate platforms using long-tail local keywords and structured schema markup.',
      seoKeywords: ['real estate AI SEO', 'property SEO strategy', 'AI copywriter real estate'],
      schemaMarkup: '{"@context":"https://schema.org","@type":"BlogPosting","headline":"How AI and SEO are Changing the Property Listing Ecosystem","image":"https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800","author":{"@type":"Person","name":"Seraphina Vance"}}',
      faqs: [
        {
          question: 'How does AI help in property SEO?',
          answer: 'AI clusters keywords, writes optimized descriptions, creates local business sitemaps, and formats structured property schema.'
        }
      ],
      author: {
        name: 'Seraphina Vance',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100',
        role: 'Marketing Director'
      },
      tableOfContents: [
        { id: 'a-digital-renaissance-in-home-searching', text: 'A Digital Renaissance in Home Searching', depth: 2 },
        { id: 'the-power-of-localized-seo-semantics', text: 'The Power of Localized SEO Semantics', depth: 3 }
      ],
      readTime: 3,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      views: 940
    }
  ];

  const inquiries: Inquiry[] = [
    {
      id: 'inq-1',
      listingId: 'list-1',
      listingTitle: 'The Obsidian Glass Mansion',
      name: 'Victoria Montgomery',
      email: 'victoria@montgomerycap.com',
      phone: '+1 (555) 728-1928',
      message: 'I am interested in scheduling a private, closed-door walkthrough of the Obsidian Glass Mansion for next Thursday. Please coordinate with my assistant.',
      type: 'property_inquiry',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'unread'
    },
    {
      id: 'inq-2',
      name: 'James Sterling',
      email: 'james@sterlingventures.dev',
      phone: '+1 (555) 302-9118',
      message: 'Looking to set up a WhatsApp group with Seraphina regarding Miami penthouse investments.',
      type: 'whatsapp',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'read'
    }
  ];

  const settings: SiteSettings = {
    heroTitle: 'Structural Perfection. Unrivaled Locations.',
    heroSubtitle: 'Bespoke architectural estates and premium spaces designed for the forward-thinking investor.',
    heroBgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920',
    featuredCities: [
      { name: 'Malibu', image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=500', count: 2 },
      { name: 'Miami', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=500', count: 2 },
      { name: 'Palo Alto', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=500', count: 1 }
    ],
    navLinks: [
      { label: 'Home', href: '/' },
      { label: 'Listings', href: '/listings' },
      { label: 'Blog Insights', href: '/blog' },
      { label: 'Inquire', href: '/#contact' }
    ],
    footerLinks: [
      { label: 'About Us', href: '/#about' },
      { label: 'All Listings', href: '/listings' },
      { label: 'Insights & Trends', href: '/blog' },
      { label: 'Privacy Policy', href: '/privacy' }
    ],
    companyName: 'NexDwell Properties',
    contactEmail: 'contact@nexdwell.com',
    contactPhone: '+1 (555) 900-8000',
    contactAddress: '888 Skyline Drive, Suite 100, Los Angeles, CA 90069',
    socials: {
      facebook: 'https://facebook.com/nexdwell',
      twitter: 'https://twitter.com/nexdwell',
      instagram: 'https://instagram.com/nexdwell',
      linkedin: 'https://linkedin.com/company/nexdwell'
    }
  };

  const users: User[] = [
    {
      id: 'user-1',
      name: 'Sarah Jenkins',
      email: 'sarah@nexdwell.com',
      role: 'administrator',
      password: 'admin123',
      bio: 'Director of Editorial and Brand Strategy. Specializes in modern architectural trends and high-end residential design history.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      postsCount: 1
    },
    {
      id: 'user-2',
      name: 'James Corden',
      email: 'james.c@nexdwell.com',
      role: 'editor',
      password: 'editor123',
      bio: 'Principal Architect and Tech Editor. Focuses on smart home technology, eco-friendly structures, and passive house designs.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      postsCount: 1
    },
    {
      id: 'user-3',
      name: 'Amara Okafor',
      email: 'amara@nexdwell.com',
      role: 'author',
      password: 'author123',
      bio: 'Luxury Portfolio Analyst and Real Estate Writer. Analyzes luxury real estate markets, yield returns, and marketing technology.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      postsCount: 0
    }
  ];

  return { listings, posts, inquiries, agents, users, settings };
}
