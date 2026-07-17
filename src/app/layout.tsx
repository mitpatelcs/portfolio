import type { Metadata } from 'next';
import { Geist_Mono, Hanken_Grotesk, Instrument_Serif } from 'next/font/google';

import ClickSound from '@/components/layout/ClickSound';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import LenisProvider from '@/components/layout/LenisProvider';
import Oneko from '@/components/layout/Oneko';
import RotatingQuote from '@/components/layout/RotatingQuote';
import ThemeProvider from '@/components/layout/ThemeProvider';
import { config, knowsAbout, profile, quotes, seo, siteUrl, socials } from '@/lib/data';

import './globals.css';

const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
const instrumentSerif = Instrument_Serif({ weight: '400', subsets: ['latin'], variable: '--font-instrument-serif' });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: seo.siteTitle,
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: profile.fullName, url: siteUrl }],
  creator: profile.fullName,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: seo.siteTitle,
    description: seo.description,
    siteName: profile.fullName,
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.siteTitle,
    description: seo.description,
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.fullName,
  alternateName: profile.alias,
  url: siteUrl,
  image: `${siteUrl}${profile.avatar.image}`,
  jobTitle: profile.jobTitle,
  email: `mailto:${profile.email}`,
  sameAs: socials.filter((s) => !s.url.startsWith('mailto:')).map((s) => s.url),
  knowsAbout,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${hanken.variable} ${geistMono.variable} ${instrumentSerif.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme={config.features.themeToggle.defaultTheme}>
          <Header />
          <main className="min-h-screen">{children}</main>
          {quotes ? <RotatingQuote items={quotes.items} intervalSeconds={quotes.intervalSeconds} /> : null}
          <Footer />
        </ThemeProvider>
        {config.features.smoothScroll ? <LenisProvider /> : null}
        {config.features.oneko ? <Oneko /> : null}
        {config.features.uiSounds ? <ClickSound /> : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  );
}
