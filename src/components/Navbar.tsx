'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building, Menu, X, ArrowUpRight, Compass } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navLinks, setNavLinks] = useState<NavLink[]>([
    { label: 'Home', href: '/' },
    { label: 'Properties', href: '/listings' },
    { label: 'Insights & Blog', href: '/blog' },
  ]);

  // Handle scroll visual state change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch nav links from settings API
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.navLinks) {
          // Filter out hash links for sub-routes if needed, or keep
          setNavLinks(data.navLinks);
        }
      })
      .catch(err => console.log('Error loading nav links', err));
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-900 shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-300">
                <Building className="h-5 w-5 text-white font-bold" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans font-bold text-lg tracking-tight text-blue-600 leading-none group-hover:text-blue-700 transition-colors duration-300">
                  NexDwell<span className="text-blue-800 font-bold"> Properties</span>
                </span>
                <span className="text-[9px] text-slate-500 font-medium tracking-wider mt-0.5 leading-none">
                  Seamless Luxury Bookings
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`font-medium text-sm tracking-wide transition-all duration-300 relative py-1 hover:text-emerald-400 ${
                    isActive ? 'text-emerald-400' : 'text-slate-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                  )}
                </Link>
              );
            })}
            <Link
              href="/admin"
              className="font-medium text-sm text-slate-400 hover:text-white transition-colors duration-300"
            >
              CMS Admin
            </Link>
          </div>

          {/* Call-to-action button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/listings?featured=true"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white-always rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 transition-all duration-300 shadow-md shadow-blue-500/10 gap-1"
            >
              Explore Portfolios
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white p-2 rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`md:hidden fixed inset-0 top-[60px] bg-slate-950/95 backdrop-blur-lg z-45 transition-all duration-300 border-t border-slate-900 ${
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        <div className="px-4 pt-8 pb-12 space-y-4 flex flex-col items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium py-2 transition-colors duration-300 ${
                  isActive ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="text-lg text-slate-400 hover:text-white py-2"
          >
            CMS Admin Panel
          </Link>
          <div className="pt-8 w-full px-6">
            <Link
              href="/#contact"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Compass className="w-4 h-4" />
              Inquire Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
