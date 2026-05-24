'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building, BookOpen, MessageSquare, Settings, LayoutDashboard, Plus, 
  Sparkles, Trash2, Edit3, ArrowRight, Eye, CheckCircle2, CloudUpload, 
  ChevronRight, Award, Key, FileText, AlertCircle, RefreshCw, Layers,
  Users, Shield, UserPlus, AlertTriangle, Check, LogOut, Lock,
  Bold, Italic, List, Table, Image, Link
} from 'lucide-react';
import { Listing, Post, Inquiry, SiteSettings, Agent, User } from '@/lib/types';

// Yoast & RankMath SEO Real-time Content Grader Engine
const getSEOAnalysis = (
  content: string,
  focusKeyword: string,
  title: string,
  description: string,
  slug: string
) => {
  const checks: Array<{ name: string; status: 'success' | 'warning' | 'error'; text: string }> = [];
  let score = 0;
  const kw = focusKeyword.trim().toLowerCase();

  if (!kw) {
    return {
      score: 0,
      checks: [
        { name: 'Focus Keyword', status: 'warning' as const, text: 'Provide a target keyword to enable real-time Yoast & RankMath checkmarks.' }
      ]
    };
  }

  // 1. Focus Keyword in SEO Title
  const titleLower = title.toLowerCase();
  if (titleLower.includes(kw)) {
    checks.push({ name: 'Focus Keyword in SEO Title', status: 'success', text: 'Target keyword is present in your SEO title.' });
    score += 15;
  } else {
    checks.push({ name: 'Focus Keyword in SEO Title', status: 'error', text: 'Target keyword was not found in your SEO title.' });
  }

  // 2. Focus Keyword in Meta Description
  const descLower = description.toLowerCase();
  if (descLower.includes(kw)) {
    checks.push({ name: 'Focus Keyword in Meta Description', status: 'success', text: 'Target keyword is present in your meta description.' });
    score += 15;
  } else {
    checks.push({ name: 'Focus Keyword in Meta Description', status: 'error', text: 'Target keyword was not found in your meta description.' });
  }

  // 3. Focus Keyword in URL Slug
  const slugLower = slug.toLowerCase();
  const normalizedKw = kw.replace(/\s+/g, '-');
  if (slugLower.includes(normalizedKw)) {
    checks.push({ name: 'Focus Keyword in Slug URL', status: 'success', text: 'Target keyword matches your URL slug.' });
    score += 10;
  } else {
    checks.push({ name: 'Focus Keyword in Slug URL', status: 'warning', text: 'Target keyword is missing from slug. Adjust slug to match.' });
    score += 5;
  }

  // 4. Focus Keyword in First Paragraph (Intro)
  const contentLower = content.toLowerCase();
  const firstParagraph = contentLower.slice(0, Math.max(120, Math.ceil(contentLower.length * 0.15)));
  if (firstParagraph.includes(kw)) {
    checks.push({ name: 'Focus Keyword in Introduction', status: 'success', text: 'Target keyword appears in the first paragraph.' });
    score += 10;
  } else {
    checks.push({ name: 'Focus Keyword in Introduction', status: 'error', text: 'First paragraph does not contain your target keyword.' });
  }

  // 5. Content Word Count
  const words = content.split(/\s+/).filter(Boolean).length;
  if (words >= 600) {
    checks.push({ name: 'Word Count', status: 'success', text: `Excellent content length! (${words} words)` });
    score += 15;
  } else if (words >= 300) {
    checks.push({ name: 'Word Count', status: 'warning', text: `Satisfactory word count, but thin. Aim for 600+. (${words} words)` });
    score += 8;
  } else {
    checks.push({ name: 'Word Count', status: 'error', text: `Text is too short. Under 300 words is hard to index. (${words} words)` });
  }

  // 6. Keyword Density
  if (words > 0) {
    const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKw}\\b`, 'g');
    const matches = contentLower.match(regex);
    const count = matches ? matches.length : 0;
    const density = (count / words) * 100;
    if (density >= 1.0 && density <= 2.5) {
      checks.push({ name: 'Keyword Density', status: 'success', text: `Density is ideal. (${density.toFixed(2)}% - keyword used ${count} times)` });
      score += 15;
    } else if (density > 2.5) {
      checks.push({ name: 'Keyword Density', status: 'error', text: `Keyword stuffing! Density is high. (${density.toFixed(2)}% - limit: 2.5%)` });
    } else {
      checks.push({ name: 'Keyword Density', status: 'warning', text: `Density is low. Use keyword more. (${density.toFixed(2)}% - aim for 1.0-2.5%)` });
      score += 5;
    }
  } else {
    checks.push({ name: 'Keyword Density', status: 'error', text: 'No content written yet to analyze keyword density.' });
  }

  // 7. Heading Tags (H2/H3 presence)
  const hasHeadings = /^(##|###)\s+/m.test(content);
  if (hasHeadings) {
    checks.push({ name: 'Heading Hierarchy (H2/H3)', status: 'success', text: 'Blog content contains H2/H3 headings.' });
    score += 10;
  } else {
    checks.push({ name: 'Heading Hierarchy (H2/H3)', status: 'warning', text: 'No H2/H3 headings found. Use subheadings to outline chapters.' });
  }

  // 8. Image Alt Attributes
  const hasImages = /!\[.*?\]\(.*?\)/.test(content);
  const hasAlt = /!\[.+?\]\(.*?\)/.test(content);
  if (hasImages) {
    if (hasAlt) {
      checks.push({ name: 'Images Alt Text', status: 'success', text: 'Images contain custom alt tags.' });
      score += 5;
    } else {
      checks.push({ name: 'Images Alt Text', status: 'warning', text: 'Images found but missing alt tags. Add alt values.' });
    }
  } else {
    checks.push({ name: 'Images Alt Text', status: 'warning', text: 'No images in markdown. Consider adding relevant graphics.' });
    score += 3;
  }

  // 9. Links (internal & external)
  const hasInternal = /\[.*?\]\((\/|https?:\/\/bookkaro\.com)/.test(content);
  const hasExternal = /\[.*?\]\(https?:\/\/(?!bookkaro\.com)[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}\b/.test(content);
  if (hasInternal && hasExternal) {
    checks.push({ name: 'Internal & External Links', status: 'success', text: 'Contains both internal anchors and external references.' });
    score += 10;
  } else if (hasInternal) {
    checks.push({ name: 'Internal & External Links', status: 'warning', text: 'Internal links found, but missing outbound external sources.' });
    score += 5;
  } else if (hasExternal) {
    checks.push({ name: 'Internal & External Links', status: 'warning', text: 'External links found, but missing internal interlinks.' });
    score += 5;
  } else {
    checks.push({ name: 'Internal & External Links', status: 'error', text: 'No hyperlinked paths found. Add links to relevant articles.' });
  }

  return { score: Math.min(100, score), checks };
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'blog' | 'inquiries' | 'users' | 'settings'>('dashboard');
  
  // Data States
  const [listings, setListings] = useState<Listing[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Yoast / RankMath Focus Keyword
  const [focusKeyword, setFocusKeyword] = useState('');

  // USER CMS MANAGEMENT STATES
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userForm, setUserForm] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'author' as User['role'],
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
  });

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, postRes, inqRes, setRes, userRes, agentRes] = await Promise.all([
        fetch('/api/listings?status=all'),
        fetch('/api/blog?status=all'),
        fetch('/api/inquiries'),
        fetch('/api/settings'),
        fetch('/api/users'),
        fetch('/api/agents')
      ]);

      const listData = await listRes.json();
      const postData = await postRes.json();
      const inqData = await inqRes.json();
      const setData = await setRes.json();
      const userData = await userRes.json();
      const agentData = await agentRes.json();

      if (Array.isArray(listData)) setListings(listData);
      if (Array.isArray(postData)) setPosts(postData);
      if (Array.isArray(inqData)) setInquiries(inqData);
      if (Array.isArray(userData)) setUsers(userData);
      if (Array.isArray(agentData)) setAgents(agentData);
      setSettings(setData);
    } catch (e) {
      console.error('Failed fetching admin data', e);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // CLIENT-SIDE SESSION AUTHENTICATION
  // ----------------------------------------------------
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setActionLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        
        // Load initial tab based on role permissions
        if (data.user.role === 'author') {
          setActiveTab('blog');
        } else if (data.user.role === 'editor') {
          setActiveTab('properties');
        } else {
          setActiveTab('dashboard');
        }
      } else {
        setLoginError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Authentication failed. Server issue.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setCurrentUser(u);
        if (u.role === 'author') {
          setActiveTab('blog');
        } else if (u.role === 'editor') {
          setActiveTab('properties');
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, []);

  // ----------------------------------------------------
  // LISTING WIZARD STATES
  // ----------------------------------------------------
  const [wizardStep, setWizardStep] = useState(1);
  const [isAddingListing, setIsAddingListing] = useState(false);
  const [listingForm, setListingForm] = useState({
    id: '',
    title: '',
    price: '',
    city: '',
    address: '',
    type: 'villa' as Listing['type'],
    beds: '3',
    baths: '3',
    area: '2500',
    furnished: 'furnished' as Listing['furnished'],
    images: [] as string[],
    amenities: [] as string[],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [] as string[],
    status: 'draft' as Listing['status'],
    featured: false
  });
  const [dragActive, setDragActive] = useState(false);
  const [aiDescriptionLoading, setAiDescriptionLoading] = useState(false);
  const [aiSeoLoading, setAiSeoLoading] = useState(false);

  // Default amenities catalog
  const amenitiesCatalog = ['Infinity Pool', 'Gym', 'Private Spa', 'Smart Home Integration', 'Wine Cellar', 'Oceanfront', 'Helipad Access', 'Zen Garden', 'Home Cinema', 'Elevator'];

  // Toggle amenity selection
  const handleToggleAmenity = (name: string) => {
    if (listingForm.amenities.includes(name)) {
      setListingForm({ ...listingForm, amenities: listingForm.amenities.filter(a => a !== name) });
    } else {
      setListingForm({ ...listingForm, amenities: [...listingForm.amenities, name] });
    }
  };

  // File Upload Helper to use our local API
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    const data = await res.json();
    return data.url;
  };

  // Real File Drag and Drop upload
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setActionLoading(true);
      try {
        const uploadPromises = Array.from(e.dataTransfer.files).map(file => uploadFile(file));
        const urls = await Promise.all(uploadPromises);
        setListingForm(prev => ({
          ...prev,
          images: [...prev.images, ...urls]
        }));
      } catch (err: any) {
        alert(err.message || 'Failed to upload one or more images from device');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handlePropertyImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setActionLoading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadFile(file));
      const urls = await Promise.all(uploadPromises);
      setListingForm(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));
    } catch (err: any) {
      alert(err.message || 'Failed to upload one or more images from device');
    } finally {
      setActionLoading(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const url = prompt('Enter a valid image URL (Unsplash real estate links recommended):');
    if (url) {
      setListingForm(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    }
  };

  // Step 4: NVIDIA AI Description Generator
  const triggerAiDescription = async () => {
    if (!listingForm.title || !listingForm.city) {
      alert('Please fill out Title and City in Step 1 first.');
      return;
    }
    setAiDescriptionLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'description',
          title: listingForm.title,
          type: listingForm.type,
          city: listingForm.city,
          address: listingForm.address,
          beds: listingForm.beds,
          baths: listingForm.baths,
          area: listingForm.area,
          furnished: listingForm.furnished,
          amenities: listingForm.amenities
        })
      });
      const data = await res.json();
      if (data.description) {
        // Set description
        setListingForm(prev => ({ ...prev, description: data.description }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiDescriptionLoading(false);
    }
  };

  // Step 4: NVIDIA AI SEO Generator
  const triggerAiSeo = async () => {
    if (!listingForm.title) {
      alert('Please enter a listing title first.');
      return;
    }
    setAiSeoLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'seo',
          title: listingForm.title,
          type: 'property',
          descriptionOrContent: (listingForm as any).description || 'Luxury home development.'
        })
      });
      const data = await res.json();
      if (data.seoTitle) {
        setListingForm(prev => ({
          ...prev,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          seoKeywords: data.seoKeywords
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiSeoLoading(false);
    }
  };

  const handleSaveListing = async () => {
    setActionLoading(true);
    try {
      const isEdit = !!listingForm.id;
      const url = isEdit ? `/api/listings/${listingForm.id}` : '/api/listings';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        ...listingForm,
        agentId: isEdit ? (listingForm as any).agentId || currentUser?.id || 'user-1' : currentUser?.id || 'user-1'
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsAddingListing(false);
        setWizardStep(1);
        // Clear form
        setListingForm({
          id: '',
          title: '',
          price: '',
          city: '',
          address: '',
          type: 'villa',
          beds: '3',
          baths: '3',
          area: '2500',
          furnished: 'furnished',
          images: [],
          amenities: [],
          seoTitle: '',
          seoDescription: '',
          seoKeywords: [],
          status: 'draft',
          featured: false
        });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditListing = (listing: Listing) => {
    setListingForm({
      id: listing.id,
      title: listing.title,
      price: listing.price.toString(),
      city: listing.city,
      address: listing.address,
      type: listing.type,
      beds: listing.beds.toString(),
      baths: listing.baths.toString(),
      area: listing.area.toString(),
      furnished: listing.furnished,
      images: listing.images,
      amenities: listing.amenities,
      seoTitle: listing.seoTitle || '',
      seoDescription: listing.seoDescription || '',
      seoKeywords: listing.seoKeywords || [],
      status: listing.status,
      featured: listing.featured
    });
    // Set other field not in listingForm structure
    (listingForm as any).description = listing.description;
    
    setIsAddingListing(true);
    setWizardStep(1);
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // ----------------------------------------------------
  // BLOG EDITOR STATES
  // ----------------------------------------------------
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [postForm, setPostForm] = useState({
    id: '',
    title: '',
    content: '',
    slug: '',
    status: 'draft' as Post['status'],
    categories: ['Architecture'],
    tags: [] as string[],
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [] as string[],
    faqs: [] as Array<{ question: string; answer: string }>
  });

  // Editor rich controls refs & helpers
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const propertyFilesInputRef = React.useRef<HTMLInputElement>(null);

  const insertAtCursor = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = before + selectedText + after;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setPostForm(prev => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 50);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const altText = prompt('Enter Image Alt Text (essential for Yoast & RankMath search optimization):') || 'Image graphic';
    
    setActionLoading(true);
    try {
      const url = await uploadFile(file);
      insertAtCursor(`![${altText}](${url})`);
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setActionLoading(false);
      e.target.value = '';
    }
  };

  const [aiOutlineLoading, setAiOutlineLoading] = useState(false);
  const [aiScoreLoading, setAiScoreLoading] = useState(false);
  const [aiScoreResult, setAiScoreResult] = useState<any | null>(null);
  const [aiLinkSuggestions, setAiLinkSuggestions] = useState<any[]>([]);
  const [aiLinkLoading, setAiLinkLoading] = useState(false);

  // NVIDIA AI Outline Generator
  const triggerAiOutline = async () => {
    if (!postForm.title) {
      alert('Please fill out the post Title first.');
      return;
    }
    setAiOutlineLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'outline',
          title: postForm.title,
          category: postForm.categories[0]
        })
      });
      const data = await res.json();
      if (data.outline) {
        setPostForm(prev => ({
          ...prev,
          content: prev.content + '\n' + data.outline
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiOutlineLoading(false);
    }
  };

  // NVIDIA AI Grader Content Scoring
  const triggerAiGrader = async () => {
    if (!postForm.content) {
      alert('Write some content first.');
      return;
    }
    setAiScoreLoading(true);
    try {
      const keywords = postForm.seoKeywords.length > 0 ? postForm.seoKeywords : [postForm.title, 'real estate'];
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'score',
          content: postForm.content,
          keywords
        })
      });
      const data = await res.json();
      setAiScoreResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAiScoreLoading(false);
    }
  };

  // NVIDIA AI Internal Linking Suggestions
  const triggerAiLinks = async () => {
    if (!postForm.content) {
      alert('Write some content first.');
      return;
    }
    setAiLinkLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest-links',
          content: postForm.content
        })
      });
      const data = await res.json();
      if (data.suggestions) {
        setAiLinkSuggestions(data.suggestions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLinkLoading(false);
    }
  };

  // NVIDIA AI FAQ Generator
  const triggerAiFaqs = async () => {
    if (!postForm.title || !postForm.content) {
      alert('Fill out title and content first.');
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'faqs',
          title: postForm.title,
          content: postForm.content
        })
      });
      const data = await res.json();
      if (data.faqs) {
        setPostForm(prev => ({
          ...prev,
          faqs: data.faqs
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSavePost = async () => {
    setActionLoading(true);
    try {
      const isEdit = !!postForm.id;
      const url = isEdit ? `/api/blog/${postForm.slug}` : '/api/blog';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postForm)
      });

      if (res.ok) {
        setIsEditingPost(false);
        setPostForm({
          id: '',
          title: '',
          content: '',
          slug: '',
          status: 'draft',
          categories: ['Architecture'],
          tags: [],
          featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
          seoTitle: '',
          seoDescription: '',
          seoKeywords: [],
          faqs: []
        });
        setAiScoreResult(null);
        setAiLinkSuggestions([]);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed saving blog post');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditPost = (post: Post) => {
    setPostForm({
      id: post.id,
      title: post.title,
      content: post.content,
      slug: post.slug,
      status: post.status,
      categories: post.categories,
      tags: post.tags,
      featuredImage: post.featuredImage,
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      seoKeywords: post.seoKeywords || [],
      faqs: post.faqs || []
    });
    setIsEditingPost(true);
  };

  const handleDeletePost = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // ----------------------------------------------------
  // INQUIRY LEAD MANAGEMENT
  // ----------------------------------------------------
  const handleMarkInquiry = async (id: string, currentStatus: Inquiry['status']) => {
    setActionLoading(true);
    const nextStatus = currentStatus === 'unread' ? 'read' : 'contacted';
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // ----------------------------------------------------
  // USER CMS MANAGEMENT HANDLERS
  // ----------------------------------------------------
  const handleSaveUser = async () => {
    if (!userForm.name || !userForm.email) {
      alert('Please fill out Name and Email.');
      return;
    }
    setActionLoading(true);
    try {
      const isEdit = !!userForm.id;
      const url = '/api/users';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });

      if (res.ok) {
        setIsEditingUser(false);
        setUserForm({
          id: '',
          name: '',
          email: '',
          password: '',
          role: 'author',
          bio: '',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
        });
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed saving user profile');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setUserForm({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password || '',
      role: user.role,
      bio: user.bio || '',
      avatar: user.avatar
    });
    setIsEditingUser(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed deleting user');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // ----------------------------------------------------
  // SETTINGS MANAGEMENT
  // ----------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) alert('Layout Settings Updated Successfully');
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center font-sans">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-500">Decrypting CMS Console credentials...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 px-6 py-10 bg-slate-900 border border-slate-850 rounded-3xl shadow-2xl text-left font-sans">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-white mt-4 tracking-tight">WordPress CMS Console</h2>
          <p className="text-xs text-slate-500 mt-1">Sign in with Admin, Editor, or Author credentials to access dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {loginError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 font-mono">Email Address</label>
            <input
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="e.g. sarah@bookkaro.com"
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 font-mono">Password</label>
            <input
              type="password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Enter password (e.g. admin123)"
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={actionLoading}
            className="w-full py-2.5 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
          >
            {actionLoading ? 'Verifying...' : 'Authenticate Account'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-[10px] text-slate-500 leading-normal space-y-1">
          <p className="font-bold text-slate-400">Demo Accounts Available:</p>
          <p>• Administrator: <code className="text-slate-300">sarah@bookkaro.com</code> / <code className="text-slate-300">admin123</code></p>
          <p>• Editor: <code className="text-slate-300">james.c@bookkaro.com</code> / <code className="text-slate-300">editor123</code></p>
          <p>• Author: <code className="text-slate-300">amara@bookkaro.com</code> / <code className="text-slate-300">author123</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans bg-slate-950 text-slate-200 text-left min-h-[80vh] flex flex-col md:flex-row gap-8">
      {/* 1. Left Sidebar Panels */}
      <aside className="w-full md:w-64 bg-slate-900 border border-slate-850 rounded-2xl p-4 h-fit flex flex-col gap-1.5 shadow-xl">
        <div className="px-3 py-2.5 mb-2 border-b border-slate-800 flex items-center gap-2.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-7.5 h-7.5 rounded-full object-cover border border-slate-700 shadow-md"
          />
          <div className="text-left">
            <h3 className="text-xs font-bold text-white leading-tight truncate max-w-[130px]">{currentUser.name}</h3>
            <span className="text-[9px] text-slate-500 mt-0.5 block uppercase font-mono tracking-widest leading-none">{currentUser.role}</span>
          </div>
        </div>

        {[
          { id: 'dashboard', label: 'Overview Metrics', icon: LayoutDashboard, roles: ['administrator'] },
          { id: 'properties', label: 'Estates Wizard', icon: Building, roles: ['administrator', 'editor'] },
          { id: 'blog', label: 'Blogging CMS', icon: BookOpen, roles: ['administrator', 'editor', 'author'] },
          { id: 'inquiries', label: 'CRM Leads Log', icon: MessageSquare, count: inquiries.filter(i => i.status === 'unread').length, roles: ['administrator', 'editor'] },
          { id: 'users', label: 'CMS Users/Authors', icon: Users, roles: ['administrator'] },
          { id: 'settings', label: 'Layout Config', icon: Settings, roles: ['administrator'] },
        ]
        .filter(tab => tab.roles.includes(currentUser.role))
        .map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setIsAddingListing(false);
              setIsEditingPost(false);
              setIsEditingUser(false);
            }}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-300 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-500/10 to-indigo-400/5 border border-blue-500/20 text-blue-400'
                : 'text-slate-400 hover:bg-slate-950 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <tab.icon className="w-4.5 h-4.5" />
              {tab.label}
            </span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-extrabold rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}

        <div className="mt-auto pt-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer text-left"
          >
            <LogOut className="w-4.5 h-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content Panels */}
      <main className="flex-grow bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl relative min-h-[600px]">
        {actionLoading && (
          <div className="absolute top-4 right-4 z-40 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-semibold text-emerald-400 flex items-center gap-1.5 backdrop-blur">
            <RefreshCw className="w-3 h-3 animate-spin" /> Synchronizing data...
          </div>
        )}

        {/* ================================================================================= */}
        {/* METRICS DASHBOARD TAB */}
        {/* ================================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Overview Metrics Dashboard</h2>
              <p className="text-xs text-slate-500 mt-1">Real-time indicators across property pipelines, traffic indexes, and lead captures.</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500">Unread Leads</span>
                <p className="text-2xl font-bold text-rose-400 mt-1">{inquiries.filter(i => i.status === 'unread').length}</p>
                <span className="text-[9px] text-slate-500">Requires follow-ups</span>
              </div>
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500">Listed Portfolios</span>
                <p className="text-2xl font-bold text-white mt-1">{listings.length}</p>
                <span className="text-[9px] text-slate-500">{listings.filter(l => l.status === 'published').length} Active, {listings.filter(l => l.status === 'draft').length} Drafts</span>
              </div>
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500">Blog Content</span>
                <p className="text-2xl font-bold text-white mt-1">{posts.length}</p>
                <span className="text-[9px] text-slate-500">{posts.filter(p => p.status === 'published').length} published articles</span>
              </div>
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500">Total Insights Views</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {posts.reduce((acc, p) => acc + (p.views || 0), 0).toLocaleString()}
                </p>
                <span className="text-[9px] text-slate-500">Organic impressions</span>
              </div>
            </div>

            {/* Quick action logs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Latest Inbound CRM Leads</h4>
                {inquiries.slice(0, 3).map(inq => (
                  <div key={inq.id} className="py-2.5 border-b border-slate-900/60 last:border-0 flex justify-between items-start text-xs">
                    <div>
                      <p className="font-bold text-white">{inq.name}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{inq.message}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      inq.status === 'unread' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Highest Performing Blogs</h4>
                {posts.slice(0, 3).map(post => (
                  <div key={post.id} className="py-2.5 border-b border-slate-900/60 last:border-0 flex justify-between items-center text-xs">
                    <p className="font-semibold text-slate-300 truncate max-w-[200px]">{post.title}</p>
                    <span className="text-[10px] text-emerald-400 font-bold">{post.views || 0} views</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================================= */}
        {/* PROPERTIES WIZARD TAB */}
        {/* ================================================================================= */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            {!isAddingListing ? (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Active Portfolios & Listings</h2>
                    <p className="text-xs text-slate-500 mt-1">Manage active listings, draft status, and call AI generators.</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAddingListing(true);
                      setWizardStep(1);
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    New Estate Listing
                  </button>
                </div>

                {/* Listings tables */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 font-bold">
                        <th className="py-3 px-4">Estate Details</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Class</th>
                        <th className="py-3 px-4">Publisher</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map(item => (
                        <tr key={item.id} className="border-b border-slate-900 hover:bg-slate-950/20 transition-colors">
                          <td className="py-3 px-4 font-semibold text-white text-left">
                            {item.title}
                            <span className="block text-[10px] text-slate-500 font-normal mt-0.5 text-left">{item.city} ({item.beds} beds / {item.area} sqft)</span>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-emerald-400">${item.price.toLocaleString()}</td>
                          <td className="py-3 px-4 capitalize text-slate-400">{item.type}</td>
                          <td className="py-3 px-4 text-left">
                            {(() => {
                              const publisher = users.find(u => u.id === item.agentId) || agents.find(a => a.id === item.agentId);
                              if (publisher) {
                                return (
                                  <div className="flex items-center gap-1.5">
                                    <img src={publisher.avatar} alt={publisher.name} className="w-5.5 h-5.5 rounded-full object-cover border border-slate-800" />
                                    <div>
                                      <p className="font-bold text-white leading-none">{publisher.name}</p>
                                      <p className="text-[8px] text-slate-500 mt-0.5 uppercase tracking-wide leading-none">{('role' in publisher) ? publisher.role : 'Agent'}</p>
                                    </div>
                                  </div>
                                );
                              }
                              return <span className="text-slate-500 font-medium">System</span>;
                            })()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              item.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleEditListing(item)}
                              className="p-1.5 bg-slate-950 text-slate-400 hover:text-emerald-400 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                              aria-label="Edit listing"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteListing(item.id)}
                              className="p-1.5 bg-slate-950 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                              aria-label="Delete listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              /* Step-by-Step Listing Wizard */
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {listingForm.id ? 'Edit Estate Listing' : 'Step-by-Step Property Creator'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Progressively catalog property layouts and configure AI SEO tags.</p>
                  </div>
                  <button
                    onClick={() => setIsAddingListing(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel Wizard
                  </button>
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold uppercase text-slate-500">
                  {[
                    { step: 1, label: 'Details' },
                    { step: 2, label: 'Media' },
                    { step: 3, label: 'Amenities' },
                    { step: 4, label: 'AI SEO Builder' },
                    { step: 5, label: 'Publish' },
                  ].map((s) => (
                    <div
                      key={s.step}
                      className={`pb-2 border-b-2 transition-colors duration-300 ${
                        wizardStep === s.step
                          ? 'border-emerald-500 text-emerald-400'
                          : wizardStep > s.step
                          ? 'border-slate-700 text-slate-300'
                          : 'border-slate-850'
                      }`}
                    >
                      Step {s.step}: {s.label}
                    </div>
                  ))}
                </div>

                {/* STEP 1: BASIC DETAILS */}
                {wizardStep === 1 && (
                  <div className="space-y-4 max-w-xl text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Property Title</label>
                        <input
                          type="text"
                          required
                          value={listingForm.title}
                          onChange={(e) => setListingForm({ ...listingForm, title: e.target.value })}
                          placeholder="e.g. The Obsidian Glass Mansion"
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Valuation Price ($)</label>
                        <input
                          type="number"
                          required
                          value={listingForm.price}
                          onChange={(e) => setListingForm({ ...listingForm, price: e.target.value })}
                          placeholder="e.g. 12500000"
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">City Location</label>
                        <input
                          type="text"
                          required
                          value={listingForm.city}
                          onChange={(e) => setListingForm({ ...listingForm, city: e.target.value })}
                          placeholder="e.g. Malibu"
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Full Address</label>
                        <input
                          type="text"
                          required
                          value={listingForm.address}
                          onChange={(e) => setListingForm({ ...listingForm, address: e.target.value })}
                          placeholder="e.g. 27040 Pacific Highway"
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Property Class</label>
                        <select
                          value={listingForm.type}
                          onChange={(e) => setListingForm({ ...listingForm, type: e.target.value as any })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                        >
                          <option value="villa">Villa</option>
                          <option value="apartment">Apartment</option>
                          <option value="commercial">Commercial</option>
                          <option value="plot">Plot</option>
                          <option value="rental">Rental</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Bedrooms</label>
                        <input
                          type="number"
                          value={listingForm.beds}
                          onChange={(e) => setListingForm({ ...listingForm, beds: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Bathrooms</label>
                        <input
                          type="number"
                          value={listingForm.baths}
                          onChange={(e) => setListingForm({ ...listingForm, baths: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Area Size (sqft)</label>
                        <input
                          type="number"
                          value={listingForm.area}
                          onChange={(e) => setListingForm({ ...listingForm, area: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: PHOTO UPLOAD */}
                {wizardStep === 2 && (
                  <div className="space-y-4 max-w-xl text-xs">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Property Imagery Library</label>
                    
                    {/* Simulated Drag & Drop Zone */}
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => propertyFilesInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer ${
                        dragActive 
                          ? 'border-emerald-500 bg-emerald-950/15' 
                          : 'border-slate-850 hover:border-slate-700 bg-slate-950/20'
                      }`}
                    >
                      <CloudUpload className="w-10 h-10 text-slate-500" />
                      <div className="text-center">
                        <p className="font-semibold text-white">Drag & drop files here, or click to upload</p>
                        <p className="text-[10px] text-slate-500 mt-1">Upload JPEG/PNG files directly from your device.</p>
                      </div>
                      <div className="flex gap-2.5 mt-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => propertyFilesInputRef.current?.click()}
                          className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <CloudUpload className="w-3.5 h-3.5" />
                          Upload from Device
                        </button>
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="px-4 py-1.5 bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 rounded-lg hover:text-white cursor-pointer"
                        >
                          Paste URL
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            // Seed random image
                            const randoms = [
                              'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200',
                              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
                              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'
                            ];
                            const img = randoms[Math.floor(Math.random() * randoms.length)];
                            setListingForm(prev => ({ ...prev, images: [...prev.images, img] }));
                          }}
                          className="px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:text-white cursor-pointer"
                        >
                          Simulate Drag
                        </button>
                      </div>
                      <input
                        type="file"
                        ref={propertyFilesInputRef}
                        multiple
                        accept="image/*"
                        onChange={handlePropertyImagesUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Previews grid */}
                    {listingForm.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-3 pt-4">
                        {listingForm.images.map((img, idx) => (
                          <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setListingForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                              className="absolute top-1 right-1 p-1 bg-slate-950 hover:bg-rose-600 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Remove image"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: AMENITIES */}
                {wizardStep === 3 && (
                  <div className="space-y-4 max-w-xl text-xs">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Bespoke Amenities Grid</label>
                    <p className="text-[10px] text-slate-500">Select luxury options included in the asset.</p>
                    
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      {amenitiesCatalog.map((name) => {
                        const selected = listingForm.amenities.includes(name);
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => handleToggleAmenity(name)}
                            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                              selected
                                ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                                : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:text-white'
                            }`}
                          >
                            {name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 4: NVIDIA AI SEO BUILDER */}
                {wizardStep === 4 && (
                  <div className="space-y-5 text-xs text-left">
                    <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-800">
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                          NVIDIA NIM AI-Powered SEO Copywriting
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-1 leading-normal max-w-md">
                          Calls model <span className="font-mono text-emerald-400">meta/llama-3.1-70b-instruct</span> to write descriptions, title tags, schemas, and target search keywords.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={aiDescriptionLoading}
                          onClick={triggerAiDescription}
                          className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-[10px] rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer"
                        >
                          {aiDescriptionLoading ? 'Generating Text...' : 'Auto-Generate Description'}
                        </button>
                        <button
                          type="button"
                          disabled={aiSeoLoading}
                          onClick={triggerAiSeo}
                          className="px-3 py-2 bg-emerald-950/40 border border-emerald-900/50 hover:bg-emerald-900/60 text-emerald-400 font-bold text-[10px] rounded-xl transition-all duration-300 disabled:opacity-50 cursor-pointer"
                        >
                          {aiSeoLoading ? 'Scoring SEO...' : 'AI SEO Tags'}
                        </button>
                      </div>
                    </div>

                    {/* AI generated textboxes */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Property Description</label>
                        <textarea
                          rows={6}
                          value={(listingForm as any).description || ''}
                          onChange={(e) => setListingForm({ ...listingForm, description: e.target.value } as any)}
                          placeholder="Write listing description or click generate description..."
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">SEO Meta Title (Google Index)</label>
                          <input
                            type="text"
                            value={listingForm.seoTitle}
                            onChange={(e) => setListingForm({ ...listingForm, seoTitle: e.target.value })}
                            placeholder="e.g. Modern Villa For Sale Malibu | Bookkaro"
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">SEO Meta Description</label>
                          <input
                            type="text"
                            value={listingForm.seoDescription}
                            onChange={(e) => setListingForm({ ...listingForm, seoDescription: e.target.value })}
                            placeholder="e.g. 6 bedroom beachfront Malibu estate with subterranean pool..."
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">SEO Target Keywords (Separated by comma)</label>
                        <input
                          type="text"
                          value={listingForm.seoKeywords.join(', ')}
                          onChange={(e) => setListingForm({ ...listingForm, seoKeywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) })}
                          placeholder="e.g. Malibu villa, beach estate, buy house Malibu"
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: PUBLISH STATUS */}
                {wizardStep === 5 && (
                  <div className="space-y-4 max-w-xl text-xs text-left">
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Estate State & Visibility</label>
                    <p className="text-[10px] text-slate-500">Draft listings remain private; published listings auto-inject into active sitemaps and XML endpoints.</p>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => setListingForm({ ...listingForm, status: 'draft' })}
                        className={`p-5 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center gap-2 cursor-pointer ${
                          listingForm.status === 'draft'
                            ? 'bg-slate-800 border-amber-500/50 text-white'
                            : 'bg-slate-950/40 border-slate-850 text-slate-400'
                        }`}
                      >
                        <FileText className="w-6 h-6 text-amber-400" />
                        <div>
                          <p className="font-bold text-white">Save as Draft</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">Private developer access only</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setListingForm({ ...listingForm, status: 'published' })}
                        className={`p-5 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center gap-2 cursor-pointer ${
                          listingForm.status === 'published'
                            ? 'bg-slate-800 border-emerald-500/50 text-white'
                            : 'bg-slate-950/40 border-slate-850 text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        <div>
                          <p className="font-bold text-white">Publish Active</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">Instantly index and publish live</p>
                        </div>
                      </button>
                    </div>

                    <div className="pt-4 border-t border-slate-850 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          id="featured-checkbox"
                          type="checkbox"
                          checked={listingForm.featured}
                          onChange={(e) => setListingForm({ ...listingForm, featured: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-emerald-400 focus:ring-emerald-500 focus:ring-opacity-25"
                        />
                        <label htmlFor="featured-checkbox" className="text-xs text-white font-bold tracking-tight">Mark as Exclusive Portfolio</label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Wizard Controls */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-850">
                  <button
                    type="button"
                    disabled={wizardStep === 1}
                    onClick={() => setWizardStep(prev => prev - 1)}
                    className="px-4 py-2 bg-slate-950 border border-slate-850 rounded-xl hover:text-white text-xs disabled:opacity-30 cursor-pointer"
                  >
                    Back
                  </button>
                  
                  {wizardStep < 5 ? (
                    <button
                      type="button"
                      onClick={() => setWizardStep(prev => prev + 1)}
                      className="px-4 py-2 bg-slate-800 border border-slate-700 hover:text-white rounded-xl text-xs cursor-pointer"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={handleSaveListing}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow-lg shadow-emerald-500/10 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {listingForm.id ? 'Save Changes' : 'Publish Property'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================================= */}
        {/* BLOG CMS TAB */}
        {/* ================================================================================= */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            {!isEditingPost ? (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Blogging CMS Panel</h2>
                    <p className="text-xs text-slate-500 mt-1">Manage articles, run AI outline builders, and check SEO scoring grades.</p>
                  </div>
                  <button
                    onClick={() => {
                      const defaultAuthor = currentUser ? {
                        name: currentUser.name,
                        avatar: currentUser.avatar,
                        role: currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
                      } : (users[0] ? {
                        name: users[0].name,
                        avatar: users[0].avatar,
                        role: users[0].role.charAt(0).toUpperCase() + users[0].role.slice(1)
                      } : {
                        name: 'Sarah Jenkins',
                        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
                        role: 'Administrator'
                      });
                      setIsEditingPost(true);
                      setPostForm({
                        id: '',
                        title: '',
                        content: '',
                        slug: '',
                        status: 'draft',
                        categories: ['Architecture'],
                        tags: [],
                        featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
                        seoTitle: '',
                        seoDescription: '',
                        seoKeywords: [],
                        faqs: [],
                        author: defaultAuthor
                      } as any);
                      setAiScoreResult(null);
                      setAiLinkSuggestions([]);
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Article
                  </button>
                </div>
 
                {/* Posts Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 font-bold">
                        <th className="py-3 px-4 text-left">Article Title</th>
                        <th className="py-3 px-4">Categories</th>
                        <th className="py-3 px-4">Author</th>
                        <th className="py-3 px-4">Views</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts
                        .filter(post => currentUser?.role === 'author' ? post.author?.name === currentUser?.name : true)
                        .map(post => (
                        <tr key={post.id} className="border-b border-slate-900 hover:bg-slate-950/20 transition-colors">
                          <td className="py-3 px-4 font-semibold text-white text-left">
                            {post.title}
                            <span className="block text-[10px] text-slate-500 font-normal mt-0.5 text-left">slug: {post.slug}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-left">{post.categories.join(', ')}</td>
                          <td className="py-3 px-4 text-left">
                            <div className="flex items-center gap-1.5">
                              <img src={post.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} alt={post.author?.name || 'Admin'} className="w-5.5 h-5.5 rounded-full object-cover border border-slate-850" />
                              <div>
                                <p className="font-bold text-white leading-none">{post.author?.name || 'System'}</p>
                                <p className="text-[8px] text-slate-500 mt-0.5 uppercase tracking-wide leading-none">{post.author?.role || 'Administrator'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-400">{post.views || 0}</td>
                          <td className="py-3 px-4 text-left">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="p-1.5 bg-slate-950 text-slate-400 hover:text-emerald-400 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                              aria-label="Edit post"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.slug)}
                              className="p-1.5 bg-slate-950 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                              aria-label="Delete post"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              /* Write/Edit Post Pane */
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {postForm.id ? 'Edit Article' : 'Bespoke Markdown Blogger'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Write Markdown articles, query NVIDIA outlines, and generate FAQ schema tags.</p>
                  </div>
                  <button
                    onClick={() => setIsEditingPost(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Close Editor
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Writing Workspace (2/3) */}
                  <div className="lg:col-span-2 space-y-4 text-xs text-left">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Article Title</label>
                      <input
                        type="text"
                        required
                        value={postForm.title}
                        onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                        placeholder="e.g. Modern Beachfront Design Principles"
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Article Category</label>
                        <select
                          value={postForm.categories[0]}
                          onChange={(e) => setPostForm({ ...postForm, categories: [e.target.value] })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                        >
                          <option value="Architecture">Architecture</option>
                          <option value="Market Trends">Market Trends</option>
                          <option value="Technology">Technology</option>
                          <option value="Marketing">Marketing</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Article Author</label>
                        <select
                          value={(postForm as any).author?.name || ''}
                          disabled={currentUser?.role === 'author'}
                          onChange={(e) => {
                            const selectedUser = users.find(u => u.name === e.target.value);
                            if (selectedUser) {
                              setPostForm({
                                ...postForm,
                                author: {
                                  name: selectedUser.name,
                                  avatar: selectedUser.avatar,
                                  role: selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)
                                }
                              } as any);
                            }
                          }}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <option value="">Select Author...</option>
                          {users.map(u => (
                            <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">URL Slug Customization</label>
                        <input
                          type="text"
                          value={postForm.slug}
                          onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
                          placeholder="e.g. beach-design-principles (leave blank to auto-slug)"
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Markdown editor */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-bold uppercase text-slate-500">Body Content (Markdown Supported)</label>
                        <button
                          type="button"
                          disabled={aiOutlineLoading}
                          onClick={triggerAiOutline}
                          className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] rounded-lg hover:bg-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                          {aiOutlineLoading ? 'Generating Outline...' : 'NVIDIA AI Article Outline'}
                        </button>
                      </div>
                      
                      {/* Interactive Rich Formatting Toolbar */}
                      <div className="bg-slate-900 border border-slate-850 border-b-0 rounded-t-xl p-2 flex flex-wrap gap-1.5 items-center">
                        <button
                          type="button"
                          onClick={() => insertAtCursor('**', '**')}
                          title="Bold Text"
                          className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-all cursor-pointer"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertAtCursor('*', '*')}
                          title="Italic Text"
                          className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-all cursor-pointer"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertAtCursor('\n## ', '\n')}
                          title="Header 2 (##)"
                          className="px-2 py-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white text-[10px] font-bold transition-all cursor-pointer"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => insertAtCursor('\n### ', '\n')}
                          title="Header 3 (###)"
                          className="px-2 py-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white text-[10px] font-bold transition-all cursor-pointer"
                        >
                          H3
                        </button>
                        
                        <div className="w-px h-4 bg-slate-850 mx-1" />

                        <button
                          type="button"
                          onClick={() => insertAtCursor('\n- ', '\n')}
                          title="Bullet Points"
                          className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-all cursor-pointer"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('Enter hyperlink URL:');
                            if (url) {
                              const text = prompt('Enter link display text:', 'learn more') || 'link';
                              insertAtCursor(`[${text}](${url})`);
                            }
                          }}
                          title="Insert Hyperlink"
                          className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-all cursor-pointer"
                        >
                          <Link className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertAtCursor('\n| Header 1 | Header 2 |\n|---|---|\n| Cell 1 | Cell 2 |\n')}
                          title="Insert Table Grid"
                          className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-all cursor-pointer"
                        >
                          <Table className="w-3.5 h-3.5" />
                        </button>

                        <div className="w-px h-4 bg-slate-850 mx-1" />

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          title="Upload Image from Device"
                          className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <CloudUpload className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-[9px] font-semibold text-blue-400">Device Image</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('Enter Image URL:');
                            if (url) {
                              const alt = prompt('Enter Image Alt Description:', 'visual reference') || 'visual reference';
                              insertAtCursor(`![${alt}](${url})`);
                            }
                          }}
                          title="Add Image via Link"
                          className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Image className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-semibold">Web URL</span>
                        </button>
                        
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>

                      <textarea
                        ref={textareaRef}
                        rows={14}
                        required
                        value={postForm.content}
                        onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                        placeholder="Write in markdown headers (##, ###), bullet points, and codeblocks. Or trigger outline generation..."
                        className="w-full bg-slate-950 border border-slate-850 rounded-b-xl rounded-t-none px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors font-mono resize-y"
                      />
                    </div>

                    {/* FAQ array management */}
                    <div className="border-t border-slate-850 pt-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-bold uppercase text-slate-500">Google FAQ Schema Markup</h4>
                        <button
                          type="button"
                          onClick={triggerAiFaqs}
                          className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-emerald-400 text-[10px] rounded-lg hover:border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          Auto-Generate FAQs
                        </button>
                      </div>
                      {postForm.faqs.map((faq, idx) => (
                        <div key={idx} className="p-3 bg-slate-950 border border-slate-900 rounded-xl relative">
                          <p className="font-semibold text-white">Q: {faq.question}</p>
                          <p className="text-[10px] text-slate-400 mt-1">A: {faq.answer}</p>
                          <button
                            type="button"
                            onClick={() => setPostForm(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== idx) }))}
                            className="absolute top-2 right-2 text-rose-400 hover:text-rose-500"
                            aria-label="Remove FAQ"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side Tools & AI SEO Graders (1/3) */}
                  <div className="space-y-4 text-xs">
                    {/* Save & Draft Pane */}
                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3.5 text-left">
                      <h4 className="text-[10px] font-bold uppercase text-slate-500">Publish Configuration</h4>
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-[9px] font-bold uppercase text-slate-500">Featured Image</label>
                          <label className="text-[9px] font-bold uppercase text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer">
                            <CloudUpload className="w-3 h-3" />
                            Upload from Device
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setActionLoading(true);
                                try {
                                  const url = await uploadFile(file);
                                  setPostForm(prev => ({ ...prev, featuredImage: url }));
                                } catch (err: any) {
                                  alert(err.message || 'Upload failed');
                                } finally {
                                  setActionLoading(false);
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>
                        </div>
                        <input
                          type="text"
                          value={postForm.featuredImage}
                          onChange={(e) => setPostForm({ ...postForm, featuredImage: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-black focus:outline-none"
                          placeholder="Image URL or uploaded path"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1.5">Visibility Status</label>
                        <select
                          value={postForm.status}
                          onChange={(e) => setPostForm({ ...postForm, status: e.target.value as any })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-black focus:outline-none select-custom"
                        >
                          <option value="draft">Draft (Private)</option>
                          <option value="published">Publish Active</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={handleSavePost}
                        className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold rounded-lg shadow-lg flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Save Article
                      </button>
                    </div>

                    {/* RankMath & Yoast Real-Time SEO Analyzer */}
                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3.5 text-left">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                        <h4 className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          Yoast & RankMath SEO
                        </h4>
                        {(() => {
                          const analysis = getSEOAnalysis(
                            postForm.content,
                            focusKeyword,
                            postForm.seoTitle || postForm.title,
                            postForm.seoDescription || '',
                            postForm.slug || postForm.title
                          );
                          const scoreColor = analysis.score >= 80 ? 'bg-emerald-500/10 text-emerald-400' : analysis.score >= 50 ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400';
                          return (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${scoreColor}`}>
                              Score: {analysis.score}/100
                            </span>
                          );
                        })()}
                      </div>

                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Focus Keyword</label>
                          <input
                            type="text"
                            value={focusKeyword}
                            onChange={(e) => setFocusKeyword(e.target.value)}
                            placeholder="Enter focal keyword (e.g. villa)"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-black focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">SEO Meta Title</label>
                          <input
                            type="text"
                            value={postForm.seoTitle}
                            onChange={(e) => setPostForm({ ...postForm, seoTitle: e.target.value })}
                            placeholder="SEO Meta Title (defaults to article title)"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-black focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">SEO Meta Description</label>
                          <textarea
                            rows={3}
                            value={postForm.seoDescription}
                            onChange={(e) => setPostForm({ ...postForm, seoDescription: e.target.value })}
                            placeholder="Provide a compelling snippet for search results..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-black focus:outline-none resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">SEO Meta Keywords</label>
                          <input
                            type="text"
                            value={postForm.seoKeywords.join(', ')}
                            onChange={(e) => setPostForm({ ...postForm, seoKeywords: e.target.value.trim() ? e.target.value.split(',').map(s => s.trim()) : [] })}
                            placeholder="beachfront, modern villa, design"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-black focus:outline-none"
                          />
                        </div>

                        <div className="space-y-2 mt-3 max-h-[220px] overflow-y-auto pr-1">
                          {(() => {
                            const analysis = getSEOAnalysis(
                              postForm.content,
                              focusKeyword,
                              postForm.seoTitle || postForm.title,
                              postForm.seoDescription || '',
                              postForm.slug || postForm.title
                            );
                            return analysis.checks.map((check, idx) => {
                              let Icon = Check;
                              let iconColor = 'text-emerald-400 bg-emerald-500/10';
                              if (check.status === 'warning') {
                                Icon = AlertTriangle;
                                iconColor = 'text-amber-400 bg-amber-500/10';
                              } else if (check.status === 'error') {
                                Icon = AlertCircle;
                                iconColor = 'text-rose-400 bg-rose-500/10';
                              }

                              return (
                                <div key={idx} className="flex gap-2 items-start text-[10px]">
                                  <div className={`p-0.5 rounded flex-shrink-0 ${iconColor}`}>
                                    <Icon className="w-3 h-3" />
                                  </div>
                                  <div className="leading-tight">
                                    <p className="font-semibold text-white">{check.name}</p>
                                    <p className="text-slate-500 text-[9px]">{check.text}</p>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Internal link optimizer */}
                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3 text-left">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          Link suggestions
                        </h4>
                        <button
                          type="button"
                          disabled={aiLinkLoading}
                          onClick={triggerAiLinks}
                          className="px-2 py-0.5 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded text-[10px] text-slate-300 flex items-center gap-1 cursor-pointer"
                        >
                          {aiLinkLoading ? 'Finding...' : 'Link Optimize'}
                        </button>
                      </div>

                      {aiLinkSuggestions.length > 0 ? (
                        <div className="space-y-3.5 pt-2">
                          {aiLinkSuggestions.map((link, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-900 border border-slate-850 rounded-xl space-y-1">
                              <p className="text-white text-[11px] font-bold">Hyperlink keyword: <span className="text-emerald-400 font-mono">"{link.textToLink}"</span></p>
                              <p className="text-[10px] text-slate-400">Target path: <span className="text-slate-200 font-mono">{link.url}</span></p>
                              <p className="text-[9px] text-slate-500 font-light leading-normal">{link.reason}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-500 leading-normal">Query internal interlink models to dynamically anchor listings and related posts.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================================= */}
        {/* CRM INQUIRIES TAB */}
        {/* ================================================================================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">CRM Inbound Lead Pipelines</h2>
              <p className="text-xs text-slate-500 mt-1">Review contact inquiries, callback requests, and WhatsApp redirections from active buyers.</p>
            </div>

            {/* Inquiries List */}
            <div className="space-y-4">
              {inquiries.length === 0 ? (
                <div className="text-center py-20 bg-slate-950/40 border border-slate-900 rounded-xl p-8">
                  <MessageSquare className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-white mb-1.5">Clean Pipelines</h4>
                  <p className="text-xs text-slate-400">No inbound inquiries logged at this timestamp.</p>
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`p-4 bg-slate-950 border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 text-left ${
                      inq.status === 'unread' ? 'border-rose-500/30 bg-rose-500/[0.01]' : 'border-slate-850'
                    }`}
                  >
                    <div className="space-y-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-sm">{inq.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                          inq.type === 'whatsapp'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : inq.type === 'callback'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {inq.type.replace('_', ' ')}
                        </span>
                        {inq.listingTitle && (
                          <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 text-[8px] font-bold rounded">
                            Ref: {inq.listingTitle}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 font-medium">
                        <span>Email: <a href={`mailto:${inq.email}`} className="text-emerald-400 hover:underline">{inq.email}</a></span>
                        {inq.phone && <span>Phone: <a href={`tel:${inq.phone}`} className="text-emerald-400 hover:underline">{inq.phone}</a></span>}
                        <span className="text-slate-500">Submitted: {new Date(inq.createdAt).toLocaleString()}</span>
                      </div>

                      <p className="text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-900 leading-normal font-light">
                        "{inq.message}"
                      </p>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      {inq.status === 'unread' ? (
                        <button
                          onClick={() => handleMarkInquiry(inq.id, 'unread')}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-[10px] font-bold text-emerald-400 transition-all cursor-pointer"
                        >
                          Mark as Read
                        </button>
                      ) : inq.status === 'read' ? (
                        <button
                          onClick={() => handleMarkInquiry(inq.id, 'read')}
                          className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-[10px] transition-all cursor-pointer"
                        >
                          Mark Contacted
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Contacted
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================================================================================= */}
        {/* USER CMS REGISTRY TAB */}
        {/* ================================================================================= */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">CMS User & Author Registry</h2>
                <p className="text-xs text-slate-500 mt-1">Manage team members, roles, bio descriptions, and article authorship permissions.</p>
              </div>
              {!isEditingUser && (
                <button
                  onClick={() => {
                    setIsEditingUser(true);
                    setUserForm({
                      id: '',
                      name: '',
                      email: '',
                      password: '',
                      role: 'author',
                      bio: '',
                      avatar: `https://images.unsplash.com/photo-${[
                        '1535713875002-d1d0cf377fde',
                        '1494790108377-be9c29b29330',
                        '1570295999919-56ceb5ecca61',
                        '1438761681033-6461ffad8d80'
                      ][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&q=80&w=200`
                    });
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow-lg shadow-emerald-500/10 cursor-pointer animate-pulse-subtle"
                >
                  <UserPlus className="w-4 h-4" />
                  Add New User
                </button>
              )}
            </div>

            {isEditingUser ? (
              <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-4 text-xs text-left max-w-2xl shadow-2xl">
                <h3 className="text-sm font-bold text-white mb-4">
                  {userForm.id ? 'Edit User Profile' : 'Register New WordPress-style Author'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 font-sans">Full Name</label>
                    <input
                      type="text"
                      required
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 font-sans">Email Address</label>
                    <input
                      type="email"
                      required
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      placeholder="e.g. eleanor@bookkaro.com"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 font-sans">Password</label>
                  <input
                    type="password"
                    value={userForm.password || ''}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    placeholder="Set or update password"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 font-sans">System Role</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors select-custom"
                    >
                      <option value="administrator">Administrator</option>
                      <option value="editor">Editor</option>
                      <option value="author">Author</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5 font-sans">
                      <label className="block text-[10px] font-bold uppercase text-slate-500">Avatar Image</label>
                      <label className="text-[9px] font-bold uppercase text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer">
                        <CloudUpload className="w-3 h-3" />
                        Upload from Device
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setActionLoading(true);
                            try {
                              const url = await uploadFile(file);
                              setUserForm(prev => ({ ...prev, avatar: url }));
                            } catch (err: any) {
                              alert(err.message || 'Upload failed');
                            } finally {
                              setActionLoading(false);
                              e.target.value = '';
                            }
                          }}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={userForm.avatar}
                      onChange={(e) => setUserForm({ ...userForm, avatar: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Image URL or uploaded path"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 font-sans">Author Bio (Displayed on Blog Posts)</label>
                  <textarea
                    rows={3}
                    value={userForm.bio}
                    onChange={(e) => setUserForm({ ...userForm, bio: e.target.value })}
                    placeholder="Short description of experience, specializations, and roles..."
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveUser}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Save Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingUser(false)}
                    className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => {
                  const postCount = posts.filter(p => p.author?.name === user.name).length;
                  return (
                    <div key={user.id} className="bg-slate-900 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative group overflow-hidden">
                      <div className="text-left">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-white leading-tight">{user.name}</h3>
                            <p className="text-[10px] text-slate-500 mt-0.5">{user.email}</p>
                          </div>
                        </div>

                        <div className="mt-3.5 flex gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase flex items-center gap-1 ${
                            user.role === 'administrator' 
                              ? 'bg-purple-500/10 text-purple-400' 
                              : user.role === 'editor' 
                              ? 'bg-blue-500/10 text-blue-400' 
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            <Shield className="w-2.5 h-2.5" />
                            {user.role}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-950 border border-slate-850 text-slate-400 text-[9px] font-extrabold rounded">
                            {postCount} Articles
                          </span>
                        </div>

                        <p className="mt-4 text-[11px] text-slate-400 leading-normal font-light line-clamp-3 min-h-[50px]">
                          {user.bio || 'No biography written yet.'}
                        </p>
                      </div>

                      <div className="mt-4 pt-3.5 border-t border-slate-800/60 flex justify-end gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-2.5 py-1.5 bg-slate-950 text-slate-400 hover:text-emerald-400 border border-slate-850 hover:border-slate-700 rounded-lg text-[10px] transition-colors cursor-pointer"
                        >
                          Edit Profile
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-2.5 py-1.5 bg-slate-950 text-slate-400 hover:text-rose-400 border border-slate-850 hover:border-slate-700 rounded-lg text-[10px] transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================================= */}
        {/* SITE SETTINGS TAB */}
        {/* ================================================================================= */}
        {activeTab === 'settings' && settings && (
          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs text-left">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Layout & Settings Configuration</h2>
              <p className="text-xs text-slate-500 mt-1">Configure homepage visual values, global navigation links, and administrative profiles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Homepage elements */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase text-slate-500 border-b border-slate-800 pb-2">Homepage Elements</h4>
                
                <div>
                  <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1.5">Hero Large Headline</label>
                  <input
                    type="text"
                    required
                    value={settings.heroTitle}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1.5">Hero Subtitle</label>
                  <input
                    type="text"
                    required
                    value={settings.heroSubtitle}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5 font-sans">
                    <label className="block text-[9px] font-bold uppercase text-slate-500">Hero Background Image</label>
                    <label className="text-[9px] font-bold uppercase text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-semibold">
                      <CloudUpload className="w-3 h-3" />
                      Upload from Device
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setActionLoading(true);
                          try {
                            const url = await uploadFile(file);
                            setSettings(prev => prev ? ({ ...prev, heroBgImage: url }) : null);
                          } catch (err: any) {
                            alert(err.message || 'Upload failed');
                          } finally {
                            setActionLoading(false);
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    value={settings.heroBgImage}
                    onChange={(e) => setSettings({ ...settings, heroBgImage: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="Image URL or uploaded path"
                  />
                </div>
              </div>

              {/* Company Info */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase text-slate-500 border-b border-slate-800 pb-2">Company Configuration</h4>
                
                <div>
                  <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1.5">Corporate Branding Name</label>
                  <input
                    type="text"
                    required
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1.5">Support Email</label>
                    <input
                      type="email"
                      required
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1.5">Brokerage Phone</label>
                    <input
                      type="text"
                      required
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1.5">HQ Physical Address</label>
                  <input
                    type="text"
                    required
                    value={settings.contactAddress}
                    onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-black focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-slate-850 flex justify-end">
              <button
                type="submit"
                disabled={actionLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Synchronize Configuration
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
