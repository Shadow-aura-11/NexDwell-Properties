import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readDb } from '@/lib/db';
import PropertyGallery from '@/components/PropertyGallery';
import PropertyContactForm from '@/components/PropertyContactForm';
import PropertyMap from '@/components/PropertyMap';
import PropertyCard from '@/components/PropertyCard';
import { Bed, Bath, Maximize, MapPin, Sparkles, Shield, ChevronRight, Award } from 'lucide-react';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate Dynamic SEO Metadata
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const db = readDb();
  const listing = db.listings.find((item) => item.id === params.id);

  if (!listing) {
    return {
      title: 'Listing Not Found | Bookkaro',
    };
  }

  return {
    title: `${listing.seoTitle || listing.title} | Bookkaro`,
    description: listing.seoDescription || listing.description.slice(0, 155),
    keywords: listing.seoKeywords || [listing.type, listing.city, 'luxury home'],
    alternates: {
      canonical: `/listings/${listing.id}`,
    },
    openGraph: {
      title: listing.seoTitle || listing.title,
      description: listing.seoDescription || listing.description.slice(0, 155),
      images: [{ url: listing.images[0] }],
    },
  };
}

export default async function PropertyDetailPage(props: PageProps) {
  const params = await props.params;
  const db = readDb();
  const listing = db.listings.find((item) => item.id === params.id && item.status === 'published');

  if (!listing) {
    notFound();
  }

  // Get matching agent
  const agent = db.agents.find((a) => a.id === listing.agentId) || db.agents[0];

  // Get similar properties (same city or type, excluding current)
  const similarProperties = db.listings
    .filter((l) => l.status === 'published' && l.id !== listing.id && (l.city === listing.city || l.type === listing.type))
    .slice(0, 3);

  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(listing.price);

  const displayPrice = listing.type === 'rental' ? `${formattedPrice}/mo` : formattedPrice;

  // JSON-LD Structured Data Schema for Google indexing
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    'name': listing.title,
    'description': listing.description,
    'url': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bookkaro.com'}/listings/${listing.id}`,
    'image': listing.images,
    'datePosted': listing.createdAt,
    'priceCurrency': 'USD',
    'price': listing.price,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': listing.address,
      'addressLocality': listing.city,
      'addressCountry': 'US'
    },
    'numberOfRooms': listing.beds,
    'numberOfBathroomsTotal': listing.baths,
    'floorSize': {
      '@type': 'QuantitativeValue',
      'value': listing.area,
      'unitCode': 'FTK'
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans bg-slate-950 text-slate-100">
      {/* 1. Inject JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 2. Breadcrumbs navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-8 pb-4 border-b border-slate-900/60">
        <Link href="/" className="hover:text-emerald-400 transition-colors duration-300">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/listings" className="hover:text-emerald-400 transition-colors duration-300">Properties</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-400 capitalize">{listing.city}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-emerald-400 font-medium truncate max-w-[200px]">{listing.title}</span>
      </nav>

      {/* 3. Main Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column (Gallery + Description + Amenities + Floor Plans) */}
        <div className="lg:col-span-2 space-y-10">
          {/* Gallery */}
          <PropertyGallery images={listing.images} />

          {/* Heading details */}
          <div className="border-b border-slate-900 pb-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded uppercase tracking-wider">
                {listing.type}
              </span>
              {listing.featured && (
                <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold rounded uppercase tracking-wider">
                  Exclusive Estate
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
              {listing.title}
            </h1>
            <div className="flex items-center gap-1 text-slate-400 text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{listing.address}</span>
            </div>
          </div>

          {/* Key specifications row */}
          <div className="grid grid-cols-3 gap-4 bg-slate-900 border border-slate-850 rounded-2xl p-5 text-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider flex items-center justify-center gap-1">
                <Bed className="w-3.5 h-3.5 text-emerald-400" /> Bedrooms
              </p>
              <p className="text-lg font-bold text-white tracking-tight">{listing.beds > 0 ? listing.beds : 'N/A'}</p>
            </div>
            <div className="border-x border-slate-850">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider flex items-center justify-center gap-1">
                <Bath className="w-3.5 h-3.5 text-emerald-400" /> Bathrooms
              </p>
              <p className="text-lg font-bold text-white tracking-tight">{listing.baths > 0 ? listing.baths : 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider flex items-center justify-center gap-1">
                <Maximize className="w-3.5 h-3.5 text-emerald-400" /> Total Area
              </p>
              <p className="text-lg font-bold text-white tracking-tight">{listing.area.toLocaleString()} sq.ft.</p>
            </div>
          </div>

          {/* Description */}
          <div className="text-left space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-emerald-400" />
              Architectural Concept & Lifestyle
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-light">
              {listing.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="text-left space-y-4 pt-4 border-t border-slate-900">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
              Premium Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {listing.amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-900 border border-slate-850 rounded-xl text-xs text-slate-200"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floor Plans List */}
          {listing.floorPlans && listing.floorPlans.length > 0 && (
            <div className="text-left space-y-4 pt-4 border-t border-slate-900">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Shield className="w-4.5 h-4.5 text-emerald-400" />
                Floor Configuration
              </h3>
              <div className="space-y-2.5">
                {listing.floorPlans.map((plan, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center px-4 py-3 bg-slate-900/60 border border-slate-900 rounded-xl text-xs"
                  >
                    <span className="text-slate-300 font-medium">{plan}</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Audited Structurally</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Price + Contact Form + Map) */}
        <div className="space-y-6 lg:pl-4">
          {/* Price Card */}
          <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl text-left">
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 leading-none">Valuation Estimate</span>
            <p className="text-3xl font-extrabold text-white tracking-tight mt-2 leading-none">{displayPrice}</p>
            <p className="text-[10px] text-emerald-400 mt-2 font-semibold flex items-center gap-1">
              • Escrow & Closing Advisory Available
            </p>
          </div>

          {/* Contact Form Card */}
          <PropertyContactForm
            listingId={listing.id}
            listingTitle={listing.title}
            agent={agent}
          />

          {/* Location Map Card */}
          <PropertyMap
            lat={listing.mapCoords?.lat || 34.0522}
            lng={listing.mapCoords?.lng || -118.2437}
            address={listing.address}
            city={listing.city}
          />
        </div>
      </div>

      {/* 4. Similar Properties recommendation */}
      {similarProperties.length > 0 && (
        <section className="mt-20 pt-10 border-t border-slate-900 text-left">
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-1">Portfolio Matcher</h2>
            <h3 className="text-xl font-bold text-white tracking-tight">Similar Spaces in Focus</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarProperties.map((item) => (
              <PropertyCard
                key={item.id}
                listing={item}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
