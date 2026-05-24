import React from 'react';
import Link from 'next/link';
import { readDb } from '@/lib/db';
import PropertyCard from '@/components/PropertyCard';
import BlogCard from '@/components/BlogCard';
import { Search, MapPin, Building2, TrendingUp, ShieldCheck, Star, Sparkles, MessageCircle, ArrowRight, ChevronDown } from 'lucide-react';
import HomeClientWrapper from './HomeClientWrapper';

// Define metadata for SEO
export const metadata = {
  title: 'NexDwell Properties | Seamless Luxury Bookings & Premium Residences',
  description: 'Explore California, Malibu, and Miami\'s finest luxury homes, beachfront villas, and state-of-the-art office spaces. Backed by AI-driven search trends.',
};

export default async function HomePage() {
  const db = readDb();
  
  // Get featured listings
  const featuredListings = db.listings.filter(l => l.status === 'published').slice(0, 3);
  
  // Get latest 3 blog posts
  const latestPosts = db.posts.filter(p => p.status === 'published').slice(0, 3);

  // Extract cities and calculate count
  const cities = db.settings.featuredCities || [];
  const processedCities = cities.map(city => {
    const count = db.listings.filter(l => l.city.toLowerCase() === city.name.toLowerCase() && l.status === 'published').length;
    return { ...city, count };
  });

  return (
    <div className="bg-slate-950 text-slate-100 font-sans min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Zoom and Dark overlay */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={db.settings.heroBgImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920"}
            alt="Luxury architecture background"
            className="w-full h-full object-cover animate-pulse-subtle filter brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/70 to-slate-950" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full mb-6 text-glow-emerald">
            <Sparkles className="w-3.5 h-3.5" />
            NEXDWELL PROPERTIES • SEAMLESS LUXURY BOOKINGS
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white-always tracking-tight leading-none mb-6">
            {db.settings.heroTitle}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white-always opacity-80 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            {db.settings.heroSubtitle}
          </p>

          {/* Interactive Search Overlay */}
          <HomeClientWrapper listings={db.listings} />
        </div>
      </section>

      {/* 1.5. Credibility Stats Bar */}
      <section className="relative z-20 -mt-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="flex flex-col items-center justify-center p-2">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent tracking-tight mb-1">$1.2B+</span>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Volume Managed</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-6 md:pt-2">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent tracking-tight mb-1">180+</span>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Audited Estates</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-6 md:pt-2">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent tracking-tight mb-1">99.4%</span>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Retained Investors</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-6 md:pt-2">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent tracking-tight mb-1">4.8 Hrs</span>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Avg. Close Speed</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Section */}
      <section className="py-16 border-b border-slate-900 relative z-10 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">Curated Assets</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Browse Portfolios By Class</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { type: 'villa', label: 'Villas & Estates', icon: Building2, count: db.listings.filter(l => l.type === 'villa').length, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=300' },
              { type: 'apartment', label: 'Penthouse & Apts', icon: Building2, count: db.listings.filter(l => l.type === 'apartment').length, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=300' },
              { type: 'commercial', label: 'Commercial HQ', icon: Building2, count: db.listings.filter(l => l.type === 'commercial').length, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=300' },
              { type: 'rental', label: 'Luxury Lease', icon: Building2, count: db.listings.filter(l => l.type === 'rental').length, image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=300' },
              { type: 'plot', label: 'Prime Plots', icon: Building2, count: db.listings.filter(l => l.type === 'plot').length, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=300' },
            ].map((cat) => (
              <Link
                key={cat.type}
                href={`/listings?type=${cat.type}`}
                className="group relative h-40 rounded-2xl overflow-hidden border border-slate-900 hover:border-emerald-500/30 transition-all duration-300 shadow-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover filter brightness-30 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="text-xs text-emerald-400 font-semibold mb-1 block">{cat.count} listings</span>
                  <h3 className="text-sm font-bold text-white-always tracking-tight group-hover:text-emerald-300 transition-colors duration-300">
                    {cat.label}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Portfolios Section */}
      <section className="py-20 bg-slate-950/50 relative z-10 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">Prime Selections</h2>
              <p className="text-3xl font-extrabold text-white tracking-tight">Featured Residences</p>
            </div>
            <Link
              href="/listings"
              className="mt-4 md:mt-0 text-sm font-bold text-emerald-400 hover:text-white inline-flex items-center gap-1.5 transition-colors duration-300 group"
            >
              View Full Catalog
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          <HomeClientWrapper listings={db.listings} isFeaturedSection={true} initialListings={featuredListings} />
        </div>
      </section>

      {/* 3.5. How It Works Section */}
      <section className="py-20 bg-slate-950 relative z-10 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">Acquisition Roadmap</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Vetted Step-By-Step Journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Timeline connector line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800/80 -translate-y-8 z-0" />

            {[
              { step: '01', title: 'Spatial Discovery', desc: 'Browse audited premium villas, workspaces, or high-yield portfolios with our custom metrics.' },
              { step: '02', title: 'Principal Broker Alignment', desc: 'Get matched with local vetted broker teams instantly via encrypted chat or direct coordinates routing.' },
              { step: '03', title: 'Audit & Escrow Vetting', desc: 'We verify land title documents, energy ratings, and finalize structures under secure partner escrow.' },
              { step: '04', title: 'Immediate Handover', desc: 'Complete title registration securely with full backing from legal advisors and direct keys handover.' },
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center group hover:border-emerald-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white-always font-bold text-sm mb-4 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h4 className="text-sm font-bold text-white mb-2 tracking-tight">{item.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. City/Location Browser */}
      <section className="py-20 bg-slate-950 relative z-10 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">Exclusive Terrains</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">Explore By Strategic Locations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processedCities.map((city) => (
              <Link
                key={city.name}
                href={`/listings?city=${city.name}`}
                className="group relative h-64 rounded-2xl overflow-hidden border border-slate-900 shadow-xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover filter brightness-40 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-md uppercase tracking-wider mb-2 inline-block">
                    {city.count} Properties Active
                  </span>
                  <h3 className="text-xl font-bold text-white-always tracking-tight group-hover:text-emerald-300 transition-colors duration-300">
                    {city.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trust / Advantages Banner */}
      <section className="py-16 bg-slate-900 border-y border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1.5 tracking-tight">Verified Design Integrity</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We verify architectural specs, material finishes, energy certifications, and land titles for every listing on our platform.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start border-y md:border-y-0 md:border-x border-slate-800 py-6 md:py-0 md:px-8">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1.5 tracking-tight">AI Trend Intelligence</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Leveraging NVIDIA Build models to compile hyper-local search intent trends and property valuation estimates.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1.5 tracking-tight">24/7 Concierge Network</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct one-click connection to local principal brokers, legal teams, and property managers via encrypted WhatsApp channels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-20 bg-slate-950 relative z-10 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">Endorsements</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">What Our Investors Say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Marcus Sterling', role: 'Founder, Sterling Capital', quote: 'The spatial calculations, direct broker messaging, and structural verification process made our commercial acquisitions extremely seamless. A highly engineered portal.', rating: 5 },
              { name: 'Diana Thorne', role: 'Creative Director', quote: 'Finding a minimal, Japandi-concept house in Silicon Valley felt impossible until I browsed NexDwell. The description matched the reality exactly.', rating: 5 },
              { name: 'Robert Vance', role: 'Real Estate Developer', quote: 'The integrated SEO blogging engine is a game changer. We published our project releases and started ranking page-one in days.', rating: 5 },
            ].map((t, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-colors duration-300">
                <div>
                  <div className="flex gap-1 mb-4 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-xs italic leading-relaxed mb-6">"{t.quote}"</p>
                </div>
                <div className="border-t border-slate-800/80 pt-4">
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <span className="text-[10px] text-slate-500">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Blog Highlights Section */}
      <section className="py-20 bg-slate-950/50 relative z-10 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">Market Intelligence</h2>
              <p className="text-3xl font-extrabold text-white tracking-tight">Latest Insights & Trends</p>
            </div>
            <Link
              href="/blog"
              className="mt-4 md:mt-0 text-sm font-bold text-emerald-400 hover:text-white inline-flex items-center gap-1.5 transition-colors duration-300 group"
            >
              Browse All Articles
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* 7.5. FAQ Section */}
      <section className="py-20 bg-slate-950 relative z-10 border-b border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">Platform FAQ</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</p>
          </div>

          <div className="space-y-4 text-left">
            {[
              {
                q: 'How does NexDwell Properties verify properties listed on the platform?',
                a: 'Every single residential, commercial, and lease listing undergoes a rigid verification audit. Our legal and engineering partners inspect land registry documents, structural plans, energy certifications, and confirm physical specs before publishing.'
              },
              {
                q: 'What is the function of the Nvidia NIM AI SEO engine?',
                a: 'NexDwell Properties integrates with NVIDIA NIM inference models to compile hyper-local real estate search metrics, search volume intent, and write optimized SEO content. This helps our property listing pages rank faster and gain high-quality exposure automatically.'
              },
              {
                q: 'Can I directly contact the designated brokers?',
                a: 'Yes. NexDwell Properties provides one-click broker engagement. Every listing card features direct links to principal broker WhatsApp numbers or secure callback/email coordinate submission boxes.'
              },
              {
                q: 'Does NexDwell Properties handle escrow and closing legal advisory?',
                a: 'We partner with premium escrow offices and legal counsels to coordinate secure title transfers, escrow management, and verify closing disclosures, ensuring an institutional-grade security standard.'
              },
              {
                q: 'Is there a fee for listing properties on the NexDwell network?',
                a: 'NexDwell Properties offers full blogging and listings creation CMS tools to administrators, editors, and vetted agents. Detailed plans for listing packages can be discussed during agent onboarding.'
              }
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group bg-slate-900 border border-slate-800 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:border-slate-700 transition-colors duration-300"
              >
                <summary className="flex justify-between items-center text-xs sm:text-sm font-bold text-white list-none select-none">
                  {faq.q}
                  <span className="transition-transform duration-300 group-open:rotate-180 text-emerald-400 flex-shrink-0 ml-4">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <p className="mt-3 text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call to Action Lead Form Section */}
      <section id="contact" className="py-20 bg-slate-950 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle bg glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-teal-500/5 blur-3xl" />

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">Ready to Begin Your Acquisition?</h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto mb-8 font-light leading-relaxed">
            Our principal brokers are available for private consultations, legal advisory, and custom spatial matching. Submit your coordinates below.
          </p>

          <HomeClientWrapper isContactForm={true} />
        </div>
      </section>
    </div>
  );
}
