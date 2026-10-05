import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from '@/components/theme-provider';
import { RevealObserver } from '@/components/motion/reveal-observer';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { JsonLd, organizationJsonLd } from '@/lib/seo';
import { site } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · Assistant téléphonique IA pour entreprises locales`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: ['assistant téléphonique IA', 'standard téléphonique', 'prise de rendez-vous automatique', 'agence IA', 'automatisation', 'Lyon'],
  authors: [{ name: site.name }],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: site.locale, url: '/', siteName: site.name, title: site.name, description: site.description },
  twitter: { card: 'summary_large_image', title: site.name, description: site.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#070b14' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={GeistSans.variable}>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <Header />
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <Footer />
          <RevealObserver />
        </ThemeProvider>
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
