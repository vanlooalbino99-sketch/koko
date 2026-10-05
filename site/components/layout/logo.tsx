import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-md font-semibold tracking-tight">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect width="32" height="32" rx="8" className="fill-foreground" />
        <path d="M11 8h6.5a5 5 0 0 1 2.9 9.1A5.2 5.2 0 0 1 18 24h-7z" className="fill-background" />
        <circle cx="23.5" cy="8.5" r="2.5" fill="#4f8cdb" />
      </svg>
      <span className="text-lg">
        Blackstart<span className="text-primary"> AI</span>
      </span>
    </Link>
  );
}
