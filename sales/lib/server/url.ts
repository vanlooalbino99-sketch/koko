import 'server-only';
import { headers } from 'next/headers';

// Adresse publique de l'application, pour les liens de retour (Stripe) et d'invitation. Render fournit
// RENDER_EXTERNAL_URL ; APP_URL la remplace si un domaine personnalisé est branché.
export async function appUrl(): Promise<string> {
  const configured = process.env.APP_URL?.trim() || process.env.RENDER_EXTERNAL_URL?.trim();
  if (configured) return configured.replace(/\/+$/, '');
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  const proto = h.get('x-forwarded-proto') ?? (local ? 'http' : 'https');
  return `${proto}://${host}`;
}
