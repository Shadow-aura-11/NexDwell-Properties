'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, PhoneCall, MessageSquare } from 'lucide-react';
import { Listing } from '@/lib/types';

interface InquiryModalProps {
  listing?: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InquiryModal({ listing, isOpen, onClose }: InquiryModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(
    listing
      ? `I am interested in "${listing.title}" located in ${listing.city}. Please send me detailed brochures and coordinate a viewing schedule.`
      : 'I would like to request a general portfolio consultation.'
  );
  const [type, setType] = useState<'property_inquiry' | 'callback' | 'whatsapp'>('property_inquiry');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing?.id,
          listingTitle: listing?.title,
          name,
          email,
          phone,
          message,
          type
        })
      });

      if (res.ok) {
        setSubmitted(true);
        // If whatsapp is chosen, redirect in a new tab
        if (type === 'whatsapp') {
          const text = encodeURIComponent(
            `Hi, my name is ${name}. I am inquiring about the listing: "${listing?.title || 'General Inquiries'}".`
          );
          const whatsappNumber = '15559008000'; // HQ WhatsApp from settings
          window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${text}`, '_blank');
        }
      }
    } catch (err) {
      console.error('Error submitting inquiry:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Backdrop Blur */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl z-10 overflow-hidden transition-all duration-300 font-sans">
        {/* Header decoration */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-950/40 rounded-lg border border-slate-800 transition-colors duration-300"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          /* Success Screen */
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Request Transmitted Successfully</h3>
            <p className="text-sm text-slate-400 max-w-sm mb-6">
              Thank you, <span className="text-emerald-400 font-semibold">{name}</span>. A NexDwell verified broker has received your portfolio request and will contact you within 2 business hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-all duration-300 border border-slate-700"
            >
              Return to Catalog
            </button>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                {listing ? 'Property Consultation' : 'General Portfolio Request'}
              </span>
              <h3 className="text-lg font-bold text-white mt-1 tracking-tight">
                {listing ? `Inquire: ${listing.title}` : 'Consult with NexDwell Brokers'}
              </h3>
              {listing && (
                <p className="text-xs text-slate-400 mt-1 truncate">
                  Address: {listing.address} | Price: {listing.type === 'rental' ? `$${listing.price.toLocaleString()}/mo` : `$${listing.price.toLocaleString()}`}
                </p>
              )}
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setType('property_inquiry')}
                className={`py-2 px-3 rounded-lg border transition-all duration-300 text-center flex flex-col items-center gap-1.5 ${
                  type === 'property_inquiry'
                    ? 'bg-slate-800 border-emerald-500/50 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                Email Form
              </button>
              <button
                type="button"
                onClick={() => setType('callback')}
                className={`py-2 px-3 rounded-lg border transition-all duration-300 text-center flex flex-col items-center gap-1.5 ${
                  type === 'callback'
                    ? 'bg-slate-800 border-emerald-500/50 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Request Call
              </button>
              <button
                type="button"
                onClick={() => setType('whatsapp')}
                className={`py-2 px-3 rounded-lg border transition-all duration-300 text-center flex flex-col items-center gap-1.5 ${
                  type === 'whatsapp'
                    ? 'bg-slate-800 border-emerald-500/50 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp Go
              </button>
            </div>

            {/* Input fields */}
            <div className="space-y-3.5">
              <div>
                <label htmlFor="inquiry-name" className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Full Name</label>
                <input
                  id="inquiry-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Victoria Montgomery"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none transition-colors duration-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="inquiry-email" className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Email Address</label>
                  <input
                    id="inquiry-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. victoria@capital.com"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="inquiry-phone" className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Phone Number</label>
                  <input
                    id="inquiry-phone"
                    type="tel"
                    required={type === 'callback'}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 728-1928"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none transition-colors duration-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inquiry-message" className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Message / Requirements</label>
                <textarea
                  id="inquiry-message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none transition-colors duration-300 resize-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <span>Transmitting Broker Request...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  {type === 'whatsapp' ? 'Initiate WhatsApp Chat' : 'Submit Inquire Request'}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
