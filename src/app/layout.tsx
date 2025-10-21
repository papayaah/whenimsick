import type { Metadata } from 'next';
import { Geist, Geist_Mono, Barrio } from 'next/font/google';
import './globals.css';
import FloatingNavigation from '@/components/FloatingNavigation';
import LegalGate from '@/components/LegalGate';
import FamilyPolaroid from '@/components/FamilyPolaroid';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const barrio = Barrio({
  weight: '400',
  variable: '--font-barrio',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "When I'm Sick - Built-in Chrome AI Symptom Tracker",
  description:
    "Track your symptoms and get AI-powered health insights using Chrome's built-in AI. Free, private, and secure health tracking with intelligent analysis.",
  keywords: [
    "symptom tracker",
    "health tracking",
    "Built-in Chrome AI",
    "medical diary",
    "health insights",
    "symptom analysis",
    "health monitoring",
    "medical journal",
    "AI health assistant",
    "private health tracking"
  ],
  authors: [{ name: "When I'm Sick Team" }],
  creator: "When I'm Sick",
  publisher: "When I'm Sick",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://whenimsick.com',
    siteName: "When I'm Sick",
    title: "When I'm Sick - Built-in Chrome AI Symptom Tracker",
    description: "Track your symptoms and get AI-powered health insights using Chrome's built-in AI. Free, private, and secure health tracking with intelligent analysis.",
    images: [
      {
        url: '/screenshots/whenimsick.png',
        width: 1200,
        height: 630,
        alt: "When I'm Sick - Built-in Chrome AI Symptom Tracker",
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@whenimsick',
    creator: '@whenimsick',
    title: "When I'm Sick - Built-in Chrome AI Symptom Tracker",
    description: "Track your symptoms and get AI-powered health insights using Chrome's built-in AI. Free, private, and secure health tracking.",
    images: ['/screenshots/whenimsick.png'],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': "When I'm Sick",
    'mobile-web-app-capable': 'yes',
    'theme-color': '#9D84B7',
    'msapplication-TileColor': '#9D84B7',
    'msapplication-config': '/browserconfig.xml',
    'format-detection': 'telephone=no',
    'referrer': 'origin-when-cross-origin',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "When I'm Sick - Built-in Chrome AI Symptom Tracker",
    "description": "Track your symptoms and get AI-powered health insights using Chrome's built-in AI. Free, private, and secure health tracking with intelligent analysis.",
    "url": "https://whenimsick.com",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Symptom Tracking",
      "AI-Powered Health Insights",
      "Medical Term Glossary",
      "Health Timeline",
      "Privacy-First Design",
      "Built-in Chrome AI Integration"
    ],
    "screenshot": "https://whenimsick.com/screenshots/whenimsick.png",
    "author": {
      "@type": "Organization",
      "name": "When I'm Sick Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "When I'm Sick"
    }
  };

  return (
    <html lang='en'>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${barrio.variable} antialiased`}
        style={{
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
            minHeight: '100vh',
            position: 'relative',
            /* Let content reach the very bottom; floating nav floats over */
          }}
        >
          {/* Alpha Version Ribbon Badge */}
          <div
            style={{
              position: 'fixed',
              top: '20px',
              right: '-60px',
              background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 50%, #ffa8c5 100%)',
              color: 'white',
              padding: '8px 80px',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              transform: 'rotate(45deg)',
              boxShadow: '0 4px 12px rgba(255, 107, 157, 0.3)',
              zIndex: 1000,
              border: '2px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
              lineHeight: '1.4',
              fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
            }}
          >
            <div>
              Alpha <span style={{ fontSize: '9px', fontWeight: '400' }}>v0.1</span>
            </div>
            <div style={{ fontSize: '9px', fontWeight: '400', textTransform: 'none', letterSpacing: '0.3px' }}>
              Still Making It Better
            </div>
          </div>
          
          <LegalGate>
            {children}
            {/* Persistent Floating Navigation and Capy across routes */}
            <FloatingNavigation />
            {/* Family Polaroid - appears on all screens */}
            <FamilyPolaroid />
          </LegalGate>
        </div>
        {/* Remove analytics during local dev to silence console logs */}
        {process.env.NODE_ENV === 'production' ? <Analytics /> : null}
      </body>
    </html>
  );
}
