// Limiteur en mémoire (une seule instance). À remplacer par Redis si l'application passe à plusieurs instances.
// Rangé sur globalThis : Next.js charge ce module une fois par route, et un compteur par route se contournerait.
const holder = globalThis as typeof globalThis & { __blackstartRateLimits?: Map<string, { count: number; resetAt: number }> };
const buckets = (holder.__blackstartRateLimits ??= new Map());

export function hit(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 10_000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }
    return true;
  }
  bucket.count++;
  return bucket.count <= limit;
}

export function resetRateLimits() {
  buckets.clear();
}
