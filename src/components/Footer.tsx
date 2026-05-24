'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Newsletter Subscriber',
          email,
          phone: '',
          message: 'Newsletter subscription request',
          type: 'general'
        })
      });

      if (res.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch (err) {
      console.error('Failed to subscribe', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 font-sans">
      {/* Top Newsletter CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 border-b border-slate-900 items-center">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-2 font-sans tracking-tight">
              Subscribe to NexDwell Insights & Trends
            </h3>
            <p className="text-sm text-slate-400">
              Receive curated research reports, architectural trends, and private portfolio releases directly in your inbox.
            </p>
          </div>
          <div className="w-full">
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-xl">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold">You have been subscribed to our mailing list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors duration-300 pr-12"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1 top-1 bottom-1 px-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold rounded-lg flex items-center justify-center transition-colors duration-300 disabled:opacity-50"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Logo & About */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-blue-600 tracking-tight">
              NexDwell<span className="text-blue-800 font-bold"> Properties</span>
            </h4>
            <p className="text-sm leading-relaxed text-slate-400">
              We engineer digital platforms for ultra-luxury residential listings, premium grade commercial properties, and dynamic investment intelligence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-900 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-all duration-300 flex items-center justify-center" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/></svg>
              </a>
              <a href="#" className="p-2 bg-slate-900 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-all duration-300 flex items-center justify-center" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="p-2 bg-slate-900 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-all duration-300 flex items-center justify-center" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="p-2 bg-slate-900 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-all duration-300 flex items-center justify-center" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-blue-600 text-sm font-bold tracking-wider uppercase mb-4">Quick Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors duration-300">Homepage</Link>
              </li>
              <li>
                <Link href="/listings" className="hover:text-emerald-400 transition-colors duration-300">Property Listings</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-emerald-400 transition-colors duration-300">Insights Blog</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition-colors duration-300">Admin Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-blue-600 text-sm font-bold tracking-wider uppercase mb-4">Prime Locations</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/listings?city=Malibu" className="hover:text-emerald-400 transition-colors duration-300">Malibu Coastline</Link>
              </li>
              <li>
                <Link href="/listings?city=Miami" className="hover:text-emerald-400 transition-colors duration-300">Miami Brickell & Beach</Link>
              </li>
              <li>
                <Link href="/listings?city=Palo%20Alto" className="hover:text-emerald-400 transition-colors duration-300">Palo Alto Foothills</Link>
              </li>
              <li>
                <Link href="/listings?type=villa" className="hover:text-emerald-400 transition-colors duration-300">Luxury Villas</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-sm">
            <h4 className="text-blue-600 text-sm font-bold tracking-wider uppercase mb-4">HQ Inquiries</h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>888 Skyline Drive, Suite 100, Los Angeles, CA 90069</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0" />
              <span>+1 (555) 900-8000</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0" />
              <span>contact@nexdwell.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="border-t border-slate-900 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NexDwell Properties. All rights reserved. Seamless Luxury Bookings.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors duration-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors duration-300">Terms of Service</Link>
            <Link href="/sitemap.xml" className="hover:text-slate-300 transition-colors duration-300">XML Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
