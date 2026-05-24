# Antigravity Estate — Premium Luxury Real Estate Platform & NVIDIA AI CMS

Antigravity Estate is a state-of-the-art, high-performance luxury real estate portal engineered with Next.js (App Router), React 19, Tailwind CSS v4, and TypeScript. It features a lightweight local JSON-based CMS, dynamic CRM pipelines, and integrated NVIDIA NIM AI models (Meta Llama 3) for SEO copywriting, semantic scoring, FAQ generation, and interlinking recommendations.

The platform is optimized for search engines (SEO), content marketing, page speed (Google Core Web Vitals), and lead generation.

---

## 🗺️ Workspace Folder Structure

The project has been organized according to modern Next.js App Router conventions:

```text
├── src/
│   ├── app/
│   │   ├── admin/                 # CMS, CRM, and Site Settings Console
│   │   │   └── page.tsx           # CMS Panel component
│   │   ├── api/                   # Database API endpoints
│   │   │   ├── ai/                # NVIDIA NIM AI gateway route
│   │   │   │   └── route.ts
│   │   │   ├── blog/              # CMS Articles GET/POST endpoint
│   │   │   │   ├── [slug]/        # Article details PUT/DELETE endpoint
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── inquiries/         # CRM Lead submission GET/POST/PUT endpoint
│   │   │   │   └── route.ts
│   │   │   ├── listings/          # Real estate catalog GET/POST endpoint
│   │   │   │   ├── [id]/          # Property detail PUT/DELETE endpoint
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── settings/          # Layout Configurations GET/PUT endpoint
│   │   │       └── route.ts
│   │   ├── blog/                  # Frontend Insights Blog index
│   │   │   ├── [slug]/            # Markdown article viewer (dynamic metadata)
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── listings/              # Real estate catalog grid (with filter panel)
│   │   │   ├── [id]/              # Property page details (schema, contact, gallery)
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── globals.css            # Custom CSS Variable Design System
│   │   ├── layout.tsx             # Root layout with navbar & footer
│   │   ├── page.tsx               # Homepage Server Component
│   │   ├── HomeClientWrapper.tsx  # Homepage Client-side Interactive Layer
│   │   ├── robots.ts              # Dynamic robots.txt generation
│   │   └── sitemap.ts             # Dynamic sitemap.xml generation
│   ├── components/                # Reusable UI widgets
│   │   ├── BlogComments.tsx       # Blog post client discussions
│   │   ├── Footer.tsx             # Main footer with newsletter subscriptions
│   │   ├── Navbar.tsx             # Navigation header
│   │   ├── PropertyContactForm.tsx# CRM contact widget
│   │   ├── PropertyGallery.tsx    # Details page image slider
│   │   ├── PropertyMap.tsx        # Coordinates SVGs tracking radar
│   │   └── ReadingProgress.tsx    # Scroll percentage indicator
│   ├── data/                      # Local JSON Database mocks
│   │   └── db.json
│   └── lib/                       # Utility and AI classes
│       ├── db.ts                  # Read/write interfaces for db.json
│       ├── nvidia.ts              # NVIDIA NIM API wrappers
│       └── utils.ts               # CSS and layout helpers
```

---

## 🗄️ Database Schema & Data Models

The system implements a local file-based JSON database engine located in `src/data/db.json` with dynamic interfaces inside `src/lib/db.ts`. The schema maintains four core collections:

### 1. `listings` (Real Estate Listings)
Stores properties containing geographic, structural, amenity, and target SEO metadata tags:
```typescript
interface Listing {
  id: string;
  title: string;
  type: 'apartment' | 'villa' | 'commercial' | 'plots' | 'rentals';
  status: 'draft' | 'published';
  price: number;
  city: string;
  address: string;
  beds: number;
  baths: number;
  area: number; // Sq. Ft.
  images: string[];
  description: string;
  amenities: string[];
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  createdAt: string;
}
```

### 2. `posts` (Insights & Blog Content)
Bespoke Markdown articles integrated with structured FAQ models for semantic search indexers:
```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown supported
  status: 'draft' | 'published';
  categories: string[];
  tags: string[];
  featuredImage: string;
  views: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  faqs: { question: string; answer: string }[];
  createdAt: string;
}
```

### 3. `inquiries` (CRM Leads Pipeline)
Captures interactions, callbacks, and WhatsApp redirection trails for broker follow-ups:
```typescript
interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  type: 'general' | 'whatsapp' | 'callback';
  listingId?: string;
  listingTitle?: string;
  status: 'unread' | 'read' | 'contacted';
  createdAt: string;
}
```

### 4. `settings` (Site Configs & Layouts)
Saves global branding variables, metadata values, and hero layout parameters:
```typescript
interface Settings {
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}
```

---

## 🌐 API Gateway Architecture

The platform exposes RESTful endpoints supporting JSON payloads to facilitate CRUD operations for CMS admins:

| Endpoint | Method | Description | Role / Usage |
|---|---|---|---|
| `/api/listings` | `GET` | Retrieve list of properties (filtered or full catalog) | Listings Search Page |
| `/api/listings` | `POST` | Create a new property listing with draft/published state | Admin Console Wizard |
| `/api/listings/[id]` | `PUT` | Update a listing's specifications and SEO parameters | Admin Listing Edit |
| `/api/listings/[id]` | `DELETE` | Remove a property listing from the catalog | Admin Listing Deletion |
| `/api/blog` | `GET` | Retrieve articles list | Blog Index page |
| `/api/blog` | `POST` | Create a new Markdown article | Admin CMS Editor |
| `/api/blog/[slug]` | `PUT` | Update article body, FAQs, and metadata fields | Admin Post Editor |
| `/api/blog/[slug]` | `DELETE` | Remove article from database | Admin Post Deletion |
| `/api/inquiries` | `GET` | Get all contact leads sorted by timestamp | CRM Pipeline tab |
| `/api/inquiries` | `POST` | Submit an inquiry (general, WhatsApp, callback) | Property details / Advisory form |
| `/api/inquiries` | `PUT` | Update lead state (`unread` ➔ `read` ➔ `contacted`) | CRM pipeline actions |
| `/api/settings` | `GET` | Retrieve current layout settings | Global Navbar/Footer/Hero |
| `/api/settings` | `PUT` | Save updated corporate information and branding | Layout & Settings Config |
| `/api/ai` | `POST` | Route requests to NVIDIA NIM AI models | AI SEO/Content Helpers |

---

## 🚀 NVIDIA NIM AI Integration Guide

All AI features connect securely to **NVIDIA Build Models** via API gateways. 

### Model Endpoint Specs
*   **Model**: `meta/llama-3.1-70b-instruct`
*   **Gateway Script**: `src/lib/nvidia.ts`
*   **Base URL**: `https://integrate.api.nvidia.com/v1`
*   **Authorization**: Bearer token via `NVIDIA_API_KEY` environment variable.

### AI Capabilities Triggered in Admin Panel
1.  **Property Descriptions (`/api/ai?action=description`)**: Generates optimized copy highlighting beds, baths, furnished state, and neighborhood amenities.
2.  **SEO Title/Description Generator (`/api/ai?action=seo`)**: Generates dynamic SEO titles and meta descriptions fitting Google's character limitations.
3.  **Blog Outline Creator (`/api/ai?action=outline`)**: Generates structured, readable markdown outlines based on a topic.
4.  **Google FAQ Schema Generator (`/api/ai?action=faqs`)**: Automatically extracts reader questions and answers based on blog content to inject into JSON-LD scripts.
5.  **SEO Semantic Grader (`/api/ai?action=score`)**: Evaluates keyword density, counts heading tags, and gives an optimization score out of 100 with recommended optimizations.
6.  **Internal Link Suggestion Tool (`/api/ai?action=suggest-links`)**: Evaluates the writing and cross-references existing listings and posts to suggest logical anchor text.

---

## 📈 SEO & Core Web Vitals Strategy

SEO has been built directly into the codebase's skeleton using Next.js best practices:

### 1. Structural Schema Injection (JSON-LD)
Pages dynamically inject search engine metadata to display rich snippets in SERPs:
*   **Property Detail Pages**: Injects a `SingleFamilyResidence` or `Product` schema detailing pricing, description, coordinates, and address.
*   **Blog Article Pages**: Injects an `Article` schema, detailing header tags, publishing dates, author details, and a nested `FAQPage` schema constructed from CMS FAQs.

### 2. Core Web Vitals Optimizations
*   **Cumulative Layout Shift (CLS)**: Image dimensions are hard-locked or mapped to dynamic aspect ratios. Skeleton screens are rendered while filters load.
*   **Largest Contentful Paint (LCP)**: Hero sections use Next.js font optimizations (`next/font/google` Geist loading) and load lightweight optimized assets.
*   **Interaction to Next Paint (INP)**: Form submissions, slider transitions, and dashboard steps execute instantly using React 19 transition states.
*   **XML Sitemap & Robots**: Generated dynamically at `/sitemap.xml` and `/robots.txt` respectively, instantly updating as new properties or posts are published.

---

## 🛠️ Environment Variables Configuration

To run the application in a production environment, define the following variables in a `.env.local` (local development) or inside your hosting provider settings (Vercel/AWS):

```env
# URL configuration for canonical tag mapping (No trailing slash)
NEXT_PUBLIC_SITE_URL=https://antigravityestate.com

# NVIDIA NIM API credentials (Get from https://build.nvidia.com/)
NVIDIA_API_KEY=nvapi-your-nvidia-nim-developer-token-here
```

---

## 🏁 Development and Deployment Instructions

### Local Development
To launch the application locally, run:
```bash
# Install package dependencies
npm install

# Run the dev server with Hot Module Reloading
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the platform.

### Build and Compilation Check
To compile the project for production, run:
```bash
# Generates a highly optimized build using Turbopack compiler
npm run build
```

### Production Deployments

#### Option A: Vercel (Recommended)
1.  Connect your GitHub repository to Vercel.
2.  In the Project Settings, add `NEXT_PUBLIC_SITE_URL` and `NVIDIA_API_KEY` to the **Environment Variables** panel.
3.  Vercel automatically detects Next.js, installs dependencies, runs `next build`, and deploys pages instantly.

#### Option B: AWS or Docker Containerization
A basic `Dockerfile` can be set up in the root of the project to package the Next.js server:
```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
```
Build and run the container:
```bash
docker build -t real-estate-app .
docker run -p 3000:3000 --env-file .env.production real-estate-app
```
