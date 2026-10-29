import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Suspense } from 'react';
import { ChartTips } from '@/components/charts/chart-tips';
import { NavProgress } from '@/components/shell/nav-progress';
import { getI18n } from '@/lib/server/context';
import '@fontsource-variable/outfit';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: { default: t.meta.title, template: `%s · ${t.common.appName}` }, description: t.meta.description };
}

export const viewport: Viewport = { themeColor: '#090c15', colorScheme: 'dark' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale } = await getI18n();
  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        <Suspense>
          <NavProgress />
        </Suspense>
        {children}
        <ChartTips />
      </body>
    </html>
  );
}
