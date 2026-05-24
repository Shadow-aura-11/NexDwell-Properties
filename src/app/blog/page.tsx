'use client';

import React, { useState, useEffect } from 'react';
import BlogCard from '@/components/BlogCard';
import { Post } from '@/lib/types';
import { Search, Calendar, Sparkles, Filter, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState<string[]>(['Architecture', 'Market Trends', 'Technology', 'Marketing']);

  // Subscription states
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (activeCategory) params.set('category', activeCategory);

    fetch(`/api/blog?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
      })
      .catch((err) => console.error('Failed to load blog posts', err))
      .finally(() => setLoading(false));
  }, [search, activeCategory]);

  // Load all posts once to compile unique categories dynamically
  useEffect(() => {
    fetch('/api/blog?status=all')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const cats = new Set<string>();
          data.forEach((p: Post) => {
            if (p.categories) p.categories.forEach(c => cats.add(c));
          });
          if (cats.size > 0) {
            setCategories(Array.from(cats));
          }
        }
      })
      .catch((err) => console.error('Failed loading categories', err));
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubLoading(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Blog Newsletter Subscriber',
          email,
          message: 'Newsletter subscription via Blog page',
          type: 'general',
        }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setActiveCategory('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-left">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-850 p-8 sm:p-12 mb-12 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full mb-4 text-glow-emerald">
            <Sparkles className="w-3.5 h-3.5" />
            REAL ESTATE INTELLIGENCE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">Bookkaro Insights</h1>
          <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
            Market research reports, modern design principles, structural engineering breakdowns, and real estate SEO tactics generated autonomously via NVIDIA NIM engines.
          </p>
        </div>
      </div>

      {/* 2. Search & Category Filters Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-5 border-b border-slate-900">
        {/* Category filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none flex-wrap">
          <button
            onClick={() => setActiveCategory('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 border uppercase cursor-pointer ${
              activeCategory === ''
                ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-md shadow-emerald-500/15'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Articles
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 border uppercase cursor-pointer ${
                activeCategory === cat
                  ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-md shadow-emerald-500/15'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative flex items-center w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate-500 absolute left-3" />
          <input
            type="text"
            placeholder="Search insights..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors duration-300"
          />
        </div>
      </div>

      {/* 3. Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Blog Posts Column */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
              <p className="text-xs text-slate-500">Retrieving articles...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-900 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-1.5">No Articles Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                We haven't published content matching this query yet. Try checking another category pill.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Newsletter & About Column */}
        <div className="space-y-6">
          {/* Custom sidebar newsletter card */}
          <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
            <h3 className="text-base font-bold text-white mb-2 tracking-tight">Stay Ahead of the Market</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Sign up to receive weekly brief breakdowns of global luxury transactions, design trends, and AI property analytics.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-xl">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-[11px] font-semibold">Verification registered. Thank you.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={subLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {subLoading ? 'Registering...' : 'Subscribe Inquiries'}
                </button>
              </form>
            )}
          </div>

          {/* Featured content sidebar widget */}
          <div className="bg-slate-900/60 border border-slate-900 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-4 tracking-tight">Trending Search Pillars</h3>
            <div className="flex flex-wrap gap-2 text-[10px] uppercase font-bold text-slate-400">
              <span className="px-2.5 py-1.5 bg-slate-900 rounded-lg border border-slate-800">#JapandiMinimalism</span>
              <span className="px-2.5 py-1.5 bg-slate-900 rounded-lg border border-slate-800">#MiamiBrickellPenthouses</span>
              <span className="px-2.5 py-1.5 bg-slate-900 rounded-lg border border-slate-800">#NVIDIASEOTactics</span>
              <span className="px-2.5 py-1.5 bg-slate-900 rounded-lg border border-slate-800">#MalibuCoastEstates</span>
              <span className="px-2.5 py-1.5 bg-slate-900 rounded-lg border border-slate-800">#GreenEnergyLEED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
