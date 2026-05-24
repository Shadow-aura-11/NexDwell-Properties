import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readDb } from '@/lib/db';
import { 
  User, BookOpen, Building, Mail, MapPin, Award, 
  ChevronRight, Calendar, ArrowRight, Eye, Send 
} from 'lucide-react';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate dynamic SEO metadata for user profiles
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const db = readDb();
  
  // Find user by ID or lowercase name slug
  const user = db.users.find(
    (u) => u.id === params.id || u.name.toLowerCase().replace(/\s+/g, '-') === params.id
  );

  if (!user) {
    return {
      title: 'Profile Not Found | Bookkaro',
    };
  }

  return {
    title: `${user.name} - ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} | Bookkaro`,
    description: user.bio || `View published articles and estate listings managed by ${user.name} at Bookkaro.`,
    openGraph: {
      title: `${user.name} Profile`,
      description: user.bio,
      images: [{ url: user.avatar }],
    },
  };
}

export default async function UserProfilePage(props: PageProps) {
  const params = await props.params;
  const db = readDb();
  
  // Resolve user
  const user = db.users.find(
    (u) => u.id === params.id || u.name.toLowerCase().replace(/\s+/g, '-') === params.id
  );

  if (!user) {
    notFound();
  }

  // Fetch blogs authored by this user
  const userPosts = db.posts.filter(
    (post) => post.status === 'published' && post.author?.name.toLowerCase() === user.name.toLowerCase()
  );

  // Fetch properties published by this user
  const userListings = db.listings.filter(
    (list) => list.status === 'published' && list.agentId === user.id
  );

  // Calculate cumulative stats
  const totalViews = userPosts.reduce((acc, p) => acc + (p.views || 0), 0);

  return (
    <div className="bg-slate-950 text-slate-100 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-8 pb-4 border-b border-slate-900/60 text-left">
          <Link href="/" className="hover:text-blue-400 transition-colors duration-300">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-400">Team Profiles</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-blue-400 font-semibold">{user.name}</span>
        </nav>

        {/* Profile Info Header Panel */}
        <div className="relative rounded-3xl bg-slate-900 border border-slate-850 p-6 sm:p-10 mb-10 overflow-hidden shadow-xl text-left">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-blue-500/20 shadow-2xl flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-grow space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                {user.role}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">{user.name}</h1>
              <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-1.5 font-mono">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> {user.email}
              </p>
              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed max-w-2xl pt-2">
                {user.bio || "No professional bio provided yet. Specializes in luxury portfolios, brand alignments, and smart architectural integration at Bookkaro."}
              </p>
            </div>

            {/* Micro KPI Widget Grid */}
            <div className="grid grid-cols-3 gap-3 w-full md:w-auto md:min-w-[280px] bg-slate-950/40 p-4 border border-slate-850 rounded-2xl">
              <div className="text-center">
                <p className="text-lg font-bold text-white leading-none">{userPosts.length}</p>
                <span className="text-[9px] uppercase font-bold text-slate-500 mt-1 block">Articles</span>
              </div>
              <div className="text-center border-x border-slate-850">
                <p className="text-lg font-bold text-white leading-none">{userListings.length}</p>
                <span className="text-[9px] uppercase font-bold text-slate-500 mt-1 block">Listings</span>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-400 leading-none">
                  {totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews}
                </p>
                <span className="text-[9px] uppercase font-bold text-slate-500 mt-1 block">Views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Split Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
          
          {/* Main Feed Column (2/3) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* 1. Listings Section */}
            <div>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-400" />
                    Property Portfolio ({userListings.length})
                  </h2>
                  <p className="text-xs text-slate-500">Active luxury estate options published by this user.</p>
                </div>
              </div>

              {userListings.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/30 border border-slate-900 rounded-2xl p-6">
                  <p className="text-xs text-slate-500">This member hasn't listed any active properties on the platform yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {userListings.map((item) => (
                    <div key={item.id} className="group bg-slate-900 border border-slate-850 hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
                      <div className="relative aspect-video overflow-hidden bg-slate-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-extrabold uppercase text-blue-400 border border-blue-500/20">
                          {item.type}
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <span className="text-[10px] text-slate-500 flex items-center gap-0.5"><MapPin className="w-3 h-3 text-blue-400" /> {item.city}</span>
                        <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-blue-400 transition-colors">{item.title}</h4>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-850/60">
                          <span className="font-mono text-xs font-bold text-emerald-400">${item.price.toLocaleString()}</span>
                          <Link href={`/listings/${item.id}`} className="text-[10px] font-bold text-blue-400 flex items-center gap-0.5 hover:text-white transition-colors">
                            Explore <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Blog Posts Section */}
            <div>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    Insights & Articles ({userPosts.length})
                  </h2>
                  <p className="text-xs text-slate-500">Autonomous design briefings and market reviews authored by this user.</p>
                </div>
              </div>

              {userPosts.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/30 border border-slate-900 rounded-2xl p-6">
                  <p className="text-xs text-slate-500">This member hasn't authored any published insights yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPosts.map((post) => (
                    <div key={post.id} className="group bg-slate-900/50 border border-slate-900 hover:border-blue-500/30 hover:bg-slate-900 p-4 rounded-2xl flex items-center gap-4 transition-all duration-300">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-105" />
                      </div>
                      <div className="flex-grow space-y-1">
                        <span className="text-[8px] uppercase tracking-wider font-extrabold text-blue-400 px-1.5 py-0.5 bg-blue-500/10 rounded-md border border-blue-500/15">{post.categories[0]}</span>
                        <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-blue-400 transition-colors pt-1">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-0.5">
                          <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span className="flex items-center gap-0.5 text-glow-blue"><Eye className="w-3 h-3 text-blue-500" /> {post.views || 0} views</span>
                        </div>
                      </div>
                      <Link href={`/blog/${post.slug}`} className="p-2 bg-slate-950 border border-slate-850 hover:bg-blue-600 hover:border-blue-500 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Column (About / Contact Form) (1/3) */}
          <div className="space-y-6">
            
            {/* Direct CRM Contact Panel */}
            <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
              <h3 className="text-base font-bold text-white mb-2 tracking-tight">Direct Consultation</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Connect directly with {user.name.split(' ')[0]} regarding properties, editorial queries, or general market strategies.
              </p>

              {/* Simple action-directed form */}
              <form action="/api/inquiries" method="POST" className="space-y-3">
                <input
                  type="hidden"
                  name="message_prefix"
                  value={`[Inquiry routed specifically to team member: ${user.name}] `}
                />
                <div>
                  <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1 font-mono">Your Name</label>
                  <input
                    type="text"
                    required
                    name="name"
                    placeholder="Enter your name"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1 font-mono">Your Email</label>
                  <input
                    type="email"
                    required
                    name="email"
                    placeholder="name@example.com"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1 font-mono">Message Brief</label>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    placeholder={`Write your inquiry for ${user.name.split(' ')[0]}...`}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10 cursor-pointer transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  Route Inquiry
                </button>
              </form>
            </div>

            {/* Agency info card */}
            <div className="bg-slate-900/60 border border-slate-900 p-6 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Bookkaro HQ</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Bookkaro operates state-of-the-art brokerage divisions across the nation's premier metropolitan centers. All members undergo rigorous regulatory licensure validation.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
