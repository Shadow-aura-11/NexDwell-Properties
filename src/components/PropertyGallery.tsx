'use client';

import React, { useState } from 'react';

interface PropertyGalleryProps {
  images: string[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-video rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
        No Images Available
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      {/* Primary Display */}
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-slate-850 shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[activeIdx]}
          alt={`Property image ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-slate-950/70 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
          Image {activeIdx + 1} of {images.length}
        </div>
      </div>

      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-video rounded-xl overflow-hidden border-2 bg-slate-950 transition-all duration-300 ${
                idx === activeIdx
                  ? 'border-emerald-500 shadow-md shadow-emerald-500/10'
                  : 'border-slate-850 opacity-60 hover:opacity-100 hover:border-slate-700'
              }`}
              aria-label={`Select image thumbnail ${idx + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Property thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
