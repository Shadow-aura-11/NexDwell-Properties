import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexDwell Properties | Seamless Luxury Bookings & Real Estate CMS",
  description: "A premium real estate platform featuring ultra-luxury listings, custom CRM pipelines, and integrated NVIDIA NIM AI SEO optimization engines.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nexdwell.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NexDwell Properties | Seamless Luxury Bookings',
    description: 'A premium real estate platform featuring ultra-luxury listings and integrated NVIDIA NIM AI SEO optimization.',
    url: 'https://nexdwell.com',
    siteName: 'NexDwell Properties',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'NexDwell Premium Portfolios',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexDwell Properties | Seamless Luxury Bookings',
    description: 'Premium real estate listings and integrated NVIDIA NIM AI SEO optimization.',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-grow pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

