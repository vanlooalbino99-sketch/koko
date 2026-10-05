import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number, MetadataRoute.Sitemap[number]['changeFrequency']][] = [
    ['/', 1, 'weekly'],
    ['/services', 0.9, 'monthly'],
    ['/rendez-vous', 0.9, 'monthly'],
    ['/a-propos', 0.7, 'monthly'],
    ['/contact', 0.8, 'yearly'],
    ['/mentions-legales', 0.2, 'yearly'],
  ];
  return pages.map(([path, priority, changeFrequency]) => ({ url: `${site.url}${path === '/' ? '' : path}`, lastModified: new Date(), changeFrequency, priority }));
}
