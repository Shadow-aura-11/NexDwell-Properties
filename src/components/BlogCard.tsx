'use client';

import React from 'react';
import Link from 'next/link';
import { Post } from '@/lib/types';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/5 flex flex-col h-full font-sans">
      {/* Blog Image */}
      <div className="relative aspect-video overflow-hidden bg-slate-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        {/* Category Pill */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          {post.categories.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-emerald-500/20"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Blog Details */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Metadata */}
        <div className="flex items-center gap-4 text-slate-500 text-xs mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{post.readTime} min read</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 mb-2.5 line-clamp-2 leading-snug tracking-tight">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-6">
          {post.seoDescription || post.content.replace(/[#*`_]/g, '').slice(0, 120) + '...'}
        </p>

        {/* Author + CTA Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
          <Link href={`/profile/${post.author.name.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full border border-slate-700 object-cover"
            />
            <div className="text-left">
              <p className="text-xs font-semibold text-white leading-none">{post.author.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-none">{post.author.role}</p>
            </div>
          </Link>
          
          <Link
            href={`/blog/${post.slug}`}
            className="text-xs font-bold text-emerald-400 group-hover:text-emerald-600 flex items-center gap-1 transition-colors duration-300"
          >
            Read Post
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </article>
  );
}
