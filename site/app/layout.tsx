import type { Metadata, Viewport } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { RevealObserver } from '@/components/motion/reveal-observer';
import { PointerFx } from '@/components/motion/pointer-fx';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { JsonLd, organizationJsonLd } from '@/lib/seo';
import { site } from '@/lib/site';
import './globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-space-grotesk', display: 'swap' });

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
    { media: '(prefers-color-scheme: light)', color: '#030407' },
    { media: '(prefers-color-scheme: dark)', color: '#030407' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`dark ${spaceGrotesk.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <div className="site-backdrop" aria-hidden />
          <div className="scroll-progress" aria-hidden />
          <Header />
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <Footer />
          <RevealObserver />
          <PointerFx />
        </ThemeProvider>
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
