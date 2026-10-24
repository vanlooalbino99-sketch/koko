import { cn } from '@/lib/utils';

// Monogramme Blackstart : une onde vocale stylisée dans un carré arrondi.
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('size-8', className)}>
      <rect width="32" height="32" rx="9" fill="url(#bs-grad)" />
      <path d="M9 13v6M13 10v12M17 8v16M21 11v10M25 14v4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <defs>
        <linearGradient id="bs-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c6cff" />
          <stop offset="1" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Brand({ name, sub }: { name: string; sub: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark />
      <span className="leading-tight">
        <span className="block text-sm font-semibold tracking-tight">{name}</span>
        <span className="block text-xs text-muted-foreground">{sub}</span>
      </span>
    </span>
  );
}
