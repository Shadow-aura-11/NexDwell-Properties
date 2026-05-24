'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import InquiryModal from '@/components/InquiryModal';
import { Listing } from '@/lib/types';
import { Filter, Search, MapPin, Building, DollarSign, BedDouble, SlidersHorizontal, RefreshCw } from 'lucide-react';

function ListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Load initial query params
  const initialType = searchParams.get('type') || '';
  const initialCity = searchParams.get('city') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialFeatured = searchParams.get('featured') || '';

  // Filter States
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [type, setType] = useState(initialType);
  const [city, setCity] = useState(initialCity);
  const [beds, setBeds] = useState('');
  const [furnished, setFurnished] = useState('');
  const [priceRange, setPriceRange] = useState('');

  // Inquiry Modal State
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load listings from API
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (city) params.set('city', city);
    if (search) params.set('search', search);
    if (initialFeatured) params.set('featured', initialFeatured);
    
    // Parse price ranges
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    
    fetch(`/api/listings?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        let filtered = data as Listing[];
        
        // Frontend filtering for beds and furnishing status (if not supported directly by API)
        if (beds) {
          filtered = filtered.filter(l => l.beds >= parseInt(beds));
        }
        if (furnished) {
          filtered = filtered.filter(l => l.furnished === furnished);
        }
        
        setListings(filtered);
      })
      .catch(err => console.error('Failed to load listings', err))
      .finally(() => setLoading(false));
  }, [type, city, search, priceRange, beds, furnished, initialFeatured]);

  // Extract unique cities dynamically from active items
  const [availableCities, setAvailableCities] = useState<string[]>(['Malibu', 'Miami', 'Palo Alto']);
  useEffect(() => {
    fetch('/api/listings?status=all')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const cities = Array.from(new Set(data.map((l: Listing) => l.city))) as string[];
          if (cities.length > 0) setAvailableCities(cities);
        }
      })
      .catch(err => console.error('Error fetching list cities', err));
  }, []);

  const handleResetFilters = () => {
    setSearch('');
    setType('');
    setCity('');
    setBeds('');
    setFurnished('');
    setPriceRange('');
    router.push('/listings');
  };

  const handleInquireClick = (listing: Listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      {/* Page Header */}
      <div className="mb-10 text-left">
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-400">Bookkaro Portfolios</span>
        <h1 className="text-3xl font-extrabold text-white mt-1 tracking-tight">Luxury Property Catalog</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Browse luxury assets, corporate workspaces, and long-term lease properties. Fully audited with verified floor plans and smart automations.
        </p>
      </div>

      {/* Filter panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-10 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-850">
          <div className="flex items-center gap-2 text-white">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold tracking-tight">Search & Filter Engine</span>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Controls
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* 1. Keyword search */}
          <div className="space-y-1.5 col-span-1 sm:col-span-2">
            <label className="block text-[10px] font-bold uppercase text-slate-500">Keyword Search</label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-500 absolute left-3" />
              <input
                type="text"
                placeholder="e.g. glass pool, oceanfront"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-9 pr-4 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>

          {/* 2. City select */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase text-slate-500">Location</label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-9 pr-3 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors duration-300 select-custom"
              >
                <option value="">All Cities</option>
                {availableCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Type select */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase text-slate-500">Property Class</label>
            <div className="relative flex items-center">
              <Building className="w-4 h-4 text-slate-500 absolute left-3" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-9 pr-3 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors duration-300 select-custom"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial</option>
                <option value="plot">Plot</option>
                <option value="rental">Rental Lease</option>
              </select>
            </div>
          </div>

          {/* 4. Price range select */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase text-slate-500">Budget Range</label>
            <div className="relative flex items-center">
              <DollarSign className="w-4 h-4 text-slate-500 absolute left-3" />
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-9 pr-3 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors duration-300 select-custom"
              >
                <option value="">Any Budget</option>
                <option value="0-1000000">Under $1M</option>
                <option value="1000000-5000000">$1M - $5M</option>
                <option value="5000000-10000000">$5M - $10M</option>
                <option value="10000000-50000000">$10M+</option>
              </select>
            </div>
          </div>

          {/* 5. Bedrooms select */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase text-slate-500">Min Bedrooms</label>
            <div className="relative flex items-center">
              <BedDouble className="w-4 h-4 text-slate-500 absolute left-3" />
              <select
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-9 pr-3 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors duration-300 select-custom"
              >
                <option value="">Any Beds</option>
                <option value="1">1+ Beds</option>
                <option value="2">2+ Beds</option>
                <option value="3">3+ Beds</option>
                <option value="4">4+ Beds</option>
                <option value="6">6+ Beds</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="text-sm text-slate-500">Auditing available properties...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-900 rounded-2xl p-8">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-4">
            <Filter className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Matching Spaces Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            We currently do not hold listings matching your custom query parameters. Try widening your price filter or selecting another asset category.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl transition-all duration-300"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {listings.map(item => (
            <PropertyCard
              key={item.id}
              listing={item}
              onInquireClick={handleInquireClick}
            />
          ))}
        </div>
      )}

      {/* Inquiry Modal */}
      <InquiryModal
        listing={selectedListing}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-500">Loading catalog views...</p>
      </div>
    }>
      <ListingsContent />
    </Suspense>
  );
}
