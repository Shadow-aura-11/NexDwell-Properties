'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, PhoneCall, MessageCircle } from 'lucide-react';
import { Agent } from '@/lib/types';

interface PropertyContactFormProps {
  listingId: string;
  listingTitle: string;
  agent: Agent;
}

export default function PropertyContactForm({ listingId, listingTitle, agent }: PropertyContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(`I am interested in scheduling a walkthrough of "${listingTitle}". Please send through the floor plan details.`);
  const [type, setType] = useState<'property_inquiry' | 'callback' | 'whatsapp'>('property_inquiry');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          listingTitle,
          name,
          email,
          phone,
          message,
          type
        })
      });

      if (res.ok) {
        setSubmitted(true);
        if (type === 'whatsapp') {
          const text = encodeURIComponent(`Hi ${agent.name}, my name is ${name}. I am inquiring about "${listingTitle}".`);
          window.open(`https://api.whatsapp.com/send?phone=${agent.whatsapp || '15559008000'}&text=${text}`, '_blank');
        }
      }
    } catch (err) {
      console.error('Error submitting detail inquiry:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl font-sans text-left">
      {/* Agent Quick Profile */}
      <div className="flex items-center gap-3.5 pb-4 mb-4 border-b border-slate-850">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={agent.avatar}
          alt={agent.name}
          className="w-12 h-12 rounded-full border border-slate-700 object-cover"
        />
        <div>
          <h4 className="text-xs font-bold text-white leading-none">{agent.name}</h4>
          <span className="text-[10px] text-slate-500 mt-1 block">{agent.role}</span>
          <span className="text-[9px] text-emerald-400 font-semibold mt-0.5 block">{agent.phone}</span>
        </div>
      </div>

      {submitted ? (
        <div className="text-center py-6">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
            <CheckCircle2 className="w-5 h-5 animate-pulse" />
          </div>
          <h5 className="text-sm font-bold text-white mb-1">Inquiry Dispatched</h5>
          <p className="text-[11px] text-slate-400 leading-normal max-w-[200px] mx-auto">
            Alexander has received your coordinates and will email/call you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Action Tabs */}
          <div className="grid grid-cols-3 gap-1 mb-2 font-semibold">
            <button
              type="button"
              onClick={() => setType('property_inquiry')}
              className={`py-1.5 rounded-lg border transition-all duration-300 text-center ${
                type === 'property_inquiry'
                  ? 'bg-slate-800 border-emerald-500/50 text-black'
                  : 'bg-slate-950/30 border-slate-850 text-slate-400'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setType('callback')}
              className={`py-1.5 rounded-lg border transition-all duration-300 text-center ${
                type === 'callback'
                  ? 'bg-slate-800 border-emerald-500/50 text-black'
                  : 'bg-slate-950/30 border-slate-850 text-slate-400'
              }`}
            >
              Callback
            </button>
            <button
              type="button"
              onClick={() => setType('whatsapp')}
              className={`py-1.5 rounded-lg border transition-all duration-300 text-center flex items-center justify-center gap-1 ${
                type === 'whatsapp'
                  ? 'bg-slate-800 border-emerald-500/50 text-black'
                  : 'bg-slate-950/30 border-slate-850 text-slate-400'
              }`}
            >
              <MessageCircle className="w-3 h-3 text-emerald-400" />
              WhatsApp
            </button>
          </div>
 
          {/* Name */}
          <div>
            <label htmlFor="detail-name" className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Name</label>
            <input
              id="detail-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marcus Thorne"
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-black focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>
 
          {/* Email */}
          <div>
            <label htmlFor="detail-email" className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Email</label>
            <input
              id="detail-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. marcus@creative.co"
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-black focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>
 
          {/* Phone */}
          <div>
            <label htmlFor="detail-phone" className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Phone</label>
            <input
              id="detail-phone"
              type="tel"
              required={type === 'callback'}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 (555) 390-2910"
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-black focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>
 
          {/* Message */}
          <div>
            <label htmlFor="detail-message" className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Message</label>
            <textarea
              id="detail-message"
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-black focus:border-emerald-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            {loading ? 'Sending...' : type === 'whatsapp' ? 'Connect WhatsApp' : 'Submit Coordinates'}
          </button>
        </form>
      )}
    </div>
  );
}
