'use client';

import React from 'react';
import { Compass, Pin, Navigation, MapPin } from 'lucide-react';

interface PropertyMapProps {
  lat: number;
  lng: number;
  address: string;
  city: string;
}

export default function PropertyMap({ lat, lng, address, city }: PropertyMapProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl font-sans relative overflow-hidden h-72 flex flex-col justify-between">
      {/* High-tech tech grid styling in background */}
      <div className="absolute inset-0 z-0 opacity-15 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      {/* Radar scanning decoration */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border border-emerald-500/10 flex items-center justify-center z-0">
        <div className="w-32 h-32 rounded-full border border-emerald-500/10 flex items-center justify-center animate-pulse">
          <div className="w-16 h-16 rounded-full bg-emerald-500/5" />
        </div>
      </div>

      <div className="relative z-10 flex justify-between items-start">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Position Coordinates</span>
          <h4 className="text-sm font-bold text-white tracking-tight mt-1 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
            Satellite Targeting
          </h4>
        </div>
        <div className="px-2.5 py-1 bg-slate-950/70 border border-slate-800 rounded-lg text-[9px] font-mono text-emerald-400">
          LAT: {lat.toFixed(4)} / LNG: {lng.toFixed(4)}
        </div>
      </div>

      {/* Center Radar Locator */}
      <div className="relative z-10 mx-auto my-auto flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          {/* Ripple effects */}
          <div className="absolute w-12 h-12 rounded-full bg-emerald-500/20 animate-ping" />
          <div className="absolute w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/50">
            <MapPin className="w-2.5 h-2.5 text-slate-950" />
          </div>
        </div>
        <span className="text-[10px] text-white font-bold mt-2 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 backdrop-blur-sm">
          {city} Base Node
        </span>
      </div>

      {/* Bottom Coordinates Info */}
      <div className="relative z-10 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
          <Navigation className="w-4 h-4" />
        </div>
        <div className="truncate text-left">
          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider leading-none mb-1">Target Address</p>
          <p className="text-xs text-white truncate font-medium">{address}</p>
        </div>
      </div>
    </div>
  );
}
