import type { NextConfig } from 'next';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// En-têtes de sécurité communs à toutes les pages.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  // Le site a son propre package.json dans le dépôt du CRM : on trace les fichiers depuis ce dossier.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  images: { formats: ['image/avif', 'image/webp'] },
  // CSS inliné dans le HTML : plus de feuille de style bloquante au premier affichage (Lighthouse).
  experimental: { optimizePackageImports: ['lucide-react', 'date-fns'], inlineCss: true },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default config;
