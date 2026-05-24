'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle2, User } from 'lucide-react';

interface Comment {
  id: string;
  name: string;
  comment: string;
  createdAt: string;
}

interface BlogCommentsProps {
  postSlug: string;
}

export default function BlogComments({ postSlug }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Load comments from localStorage
  useEffect(() => {
    const key = `comments_${postSlug}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setComments(JSON.parse(stored) as Comment[]);
    } else {
      // Default mock comments
      const defaults: Comment[] = [
        {
          id: '1',
          name: 'Adrian Thorne',
          comment: 'Remarkable analysis. The correlation between structural layout transparency and closing premiums is highly visible in modern portfolios.',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'Sarah Vance',
          comment: 'Does this structural shift also apply to secondary tier metropolitan spaces, or is it isolated strictly to Malibu/Miami waterfronts?',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setComments(defaults);
      localStorage.setItem(key, JSON.stringify(defaults));
    }
  }, [postSlug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !commentText) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      name,
      comment: commentText,
      createdAt: new Date().toISOString()
    };

    const key = `comments_${postSlug}`;
    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(key, JSON.stringify(updated));
    
    setCommentText('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="border-t border-slate-900 pt-10 font-sans text-left">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-emerald-400" />
        Discussion ({comments.length})
      </h3>

      {/* Write Comment Box */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-850 p-5 rounded-2xl mb-8 space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Leave a Comment</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="comment-name" className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Name</label>
            <input
              id="comment-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="comment-text" className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Your Comment</label>
          <textarea
            id="comment-text"
            rows={3}
            required
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your feedback or questions..."
            className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none transition-colors resize-none"
          />
        </div>

        <div className="flex justify-between items-center">
          {submitted ? (
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Comment logged locally
            </span>
          ) : (
            <span className="text-[10px] text-slate-500">Subject to moderations</span>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 transition-all duration-300 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            Submit
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="p-4 bg-slate-900/50 border border-slate-900 rounded-xl flex gap-3.5">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 flex-shrink-0">
              <User className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-white">{c.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {new Date(c.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-light">{c.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
