'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Listing } from '@/lib/types';
import PropertyCard from '@/components/PropertyCard';
import InquiryModal from '@/components/InquiryModal';
import { Search, MapPin, Building, DollarSign, Send, CheckCircle2 } from 'lucide-react';

interface HomeClientWrapperProps {
  listings?: Listing[];
  isFeaturedSection?: boolean;
  isContactForm?: boolean;
  initialListings?: Listing[];
}

export default function HomeClientWrapper({
  listings = [],
  isFeaturedSection = false,
  isContactForm = false,
  initialListings = []
}: HomeClientWrapperProps) {
  const router = useRouter();

  // 1. STATE FOR INQUIRY MODAL (Featured Listings)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. STATE FOR SEARCH FORM
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('');

  // 3. STATE FOR CONTACT FORM
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  // Handle inquiry click on a card
  const handleInquireClick = (listing: Listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (searchCity) params.set('city', searchCity);
    if (searchType) params.set('type', searchType);
    
    router.push(`/listings?${params.toString()}`);
  };

  // Handle Contact Submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    setContactLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          message: contactMsg,
          type: 'general'
        })
      });

      if (res.ok) {
        setContactSubmitted(true);
        setContactName('');
        setContactEmail('');
        setContactPhone('');
        setContactMsg('');
      }
    } catch (err) {
      console.error('Contact submission error', err);
    } finally {
      setContactLoading(false);
    }
  };

  // --- RENDER FOR BOTTOM CONTACT FORM ---
  if (isContactForm) {
    if (contactSubmitted) {
      return (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 animate-pulse">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1.5">Consultation Logged</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Thank you. An executive advisor will connect with you via email shortly.
          </p>
        </div>
      );
    }

    return (
      <form onSubmit={handleContactSubmit} className="max-w-xl mx-auto text-left space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            required
            placeholder="Full Name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none transition-colors duration-300"
          />
          <input
            type="email"
            required
            placeholder="Email Address"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none transition-colors duration-300"
          />
        </div>
        <input
          type="tel"
          placeholder="Phone Number (Optional)"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none transition-colors duration-300"
        />
        <textarea
          rows={4}
          required
          placeholder="Describe your property acquisition target criteria..."
          value={contactMsg}
          onChange={(e) => setContactMsg(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none transition-colors duration-300 resize-none"
        />
        <button
          type="submit"
          disabled={contactLoading}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 transition-all duration-300"
        >
          {contactLoading ? 'Transmitting Inquire...' : 'Inquire Advisory'}
          <Send className="w-3 h-3" />
        </button>
      </form>
    );
  }

  // --- RENDER FOR FEATURED LISTINGS GRID ---
  if (isFeaturedSection) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {initialListings.map((listing) => (
            <PropertyCard
              key={listing.id}
              listing={listing}
              onInquireClick={handleInquireClick}
            />
          ))}
        </div>

        {/* Dynamic inquiry modal */}
        <InquiryModal
          listing={selectedListing}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  // --- RENDER FOR HERO SEARCH FORM ---
  const uniqueCities = Array.from(new Set(listings.map((l) => l.city)));

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="w-full max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row gap-2"
    >
      {/* 1. Keyword search */}
      <div className="flex-grow flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-slate-800/85">
        <Search className="w-4 h-4 text-emerald-400 mr-2.5 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by keywords, amenities, addresses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-0 text-black text-xs w-full focus:outline-none focus:ring-0 placeholder-slate-500"
        />
      </div>

      {/* 2. City select */}
      <div className="flex-grow md:max-w-[200px] flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-slate-800/85">
        <MapPin className="w-4 h-4 text-emerald-400 mr-2.5 flex-shrink-0" />
        <select
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          className="bg-transparent border-0 text-black text-xs w-full focus:outline-none focus:ring-0 appearance-none pr-8 select-custom"
        >
          <option value="" className="bg-white text-slate-500">All Cities</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city} className="bg-white text-black">
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Type select */}
      <div className="flex-grow md:max-w-[200px] flex items-center px-4 py-2">
        <Building className="w-4 h-4 text-emerald-400 mr-2.5 flex-shrink-0" />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="bg-transparent border-0 text-black text-xs w-full focus:outline-none focus:ring-0 appearance-none pr-8 select-custom"
        >
          <option value="" className="bg-white text-slate-500">All Types</option>
          <option value="apartment" className="bg-white text-black">Apartment</option>
          <option value="villa" className="bg-white text-black">Villa</option>
          <option value="commercial" className="bg-white text-black">Commercial</option>
          <option value="plot" className="bg-white text-black">Plot</option>
          <option value="rental" className="bg-white text-black">Rental</option>
        </select>
      </div>

      {/* 4. Find button */}
      <button
        type="submit"
        className="w-full md:w-auto px-8 py-3.5 md:py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl md:rounded-full flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer"
      >
        <Search className="w-3.5 h-3.5" />
        Find Spaces
      </button>
    </form>
  );
}
