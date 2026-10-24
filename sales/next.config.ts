import type { NextConfig } from 'next';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// En-têtes de sécurité communs à toutes les pages. Le micro est autorisé pour la simulation vocale.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
];

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // L'application a son propre package.json dans le dépôt : on trace les fichiers depuis ce dossier.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  // PGlite (base en mémoire du développement local) charge son propre fichier WebAssembly.
  serverExternalPackages: ['@electric-sql/pglite', 'pg'],
  experimental: { optimizePackageImports: ['lucide-react'] },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default config;
