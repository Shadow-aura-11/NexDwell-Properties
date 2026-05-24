'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Listing } from '@/lib/types';
import { Bed, Bath, Maximize2, MapPin, Heart, Share2, MessageCircle } from 'lucide-react';

interface PropertyCardProps {
  listing: Listing;
  onInquireClick?: (listing: Listing) => void;
}

export default function PropertyCard({ listing, onInquireClick }: PropertyCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Check if property is saved in localStorage
    const saved = localStorage.getItem('saved_properties');
    if (saved) {
      const ids = JSON.parse(saved) as string[];
      setIsSaved(ids.includes(listing.id));
    }
  }, [listing.id]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const saved = localStorage.getItem('saved_properties');
    let ids: string[] = [];
    if (saved) {
      ids = JSON.parse(saved) as string[];
    }

    if (ids.includes(listing.id)) {
      ids = ids.filter(id => id !== listing.id);
      setIsSaved(false);
    } else {
      ids.push(listing.id);
      setIsSaved(true);
    }
    localStorage.setItem('saved_properties', JSON.stringify(ids));
  };

  const shareWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = window.location.origin + `/listings/${listing.id}`;
    const text = encodeURIComponent(`Hi! Check out this incredible property: ${listing.title} in ${listing.city} - ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);

    return type === 'rental' ? `${formatted}/mo` : formatted;
  };

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/5 flex flex-col h-full font-sans">
      {/* Property Image & Badges */}
      <div className="relative aspect-video overflow-hidden bg-neutral-950">
        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Favorite Icon */}
        <button
          onClick={toggleSave}
          className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/85 backdrop-blur-md text-white-always rounded-full transition-all duration-300 z-10 border border-white/10"
          aria-label={isSaved ? "Remove from saved" : "Save property"}
        >
          <Heart className={`w-4.5 h-4.5 transition-colors duration-300 ${isSaved ? 'fill-emerald-400 text-emerald-400' : 'text-white-always'}`} />
        </button>

        {/* Top-Left Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-bold rounded-lg uppercase tracking-wider">
            {listing.type}
          </span>
          {listing.featured && (
            <span className="px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded-lg uppercase tracking-wider">
              Exclusive Portfolio
            </span>
          )}
        </div>

        {/* Price Tag Overlay bottom */}
        <div className="absolute bottom-4 left-4 z-10">
          <span className="text-xl font-bold text-white-always tracking-tight drop-shadow-md">
            {formatPrice(listing.price, listing.type)}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 mb-2 line-clamp-1 tracking-tight">
          <Link href={`/listings/${listing.id}`}>{listing.title}</Link>
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-slate-400 text-xs mb-4">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="truncate">{listing.address}</span>
        </div>

        {/* Description Excerpt */}
        <p className="text-slate-400 text-xs line-clamp-2 mb-5 leading-relaxed">
          {listing.description}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800 text-slate-400 text-xs mb-5 mt-auto">
          <div className="flex items-center gap-1.5 justify-center">
            <Bed className="w-4 h-4 text-emerald-400" />
            <span>{listing.beds > 0 ? `${listing.beds} Beds` : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center border-x border-slate-800">
            <Bath className="w-4 h-4 text-emerald-400" />
            <span>{listing.baths > 0 ? `${listing.baths} Baths` : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <Maximize2 className="w-4 h-4 text-emerald-400" />
            <span>{listing.area.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Card Action Buttons */}
        <div className="flex gap-2 w-full">
          <Link
            href={`/listings/${listing.id}`}
            className="flex-grow py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center transition-colors duration-300 border border-slate-700"
          >
            Details
          </Link>
          <button
            onClick={() => onInquireClick?.(listing)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl transition-all duration-300 flex items-center gap-1.5"
          >
            Inquire
          </button>
          <button
            onClick={shareWhatsApp}
            className="p-2.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-900/50 text-emerald-400 rounded-xl transition-all duration-300"
            aria-label="Share on WhatsApp"
          >
            <MessageCircle className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
