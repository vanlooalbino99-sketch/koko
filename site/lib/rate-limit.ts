import 'server-only';
import { headers } from 'next/headers';

// Limite simple par adresse IP (mémoire du processus) contre les envois en rafale.
const hits = new Map<string, { count: number; reset: number }>();

export async function clientIp() {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'inconnue';
}

export async function rateLimited(scope: string, max = 5, windowMs = 10 * 60_000) {
  const key = `${scope}:${await clientIp()}`;
  const now = Date.now();
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > max;
}
