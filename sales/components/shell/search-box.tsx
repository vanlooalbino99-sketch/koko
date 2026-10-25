'use client';

import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

// Recherche de scénarios, ouverte au clavier avec ⌘K (Mac) ou Ctrl K.
export function SearchBox({ label }: { label: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [mac, setMac] = useState(true);
  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <form action="/scenarios" role="search" className="relative w-full max-w-[290px]">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9aa1b2]" aria-hidden="true" />
      <input
        ref={input}
        name="q"
        type="search"
        placeholder={label}
        aria-label={label}
        className="h-9 w-full rounded-lg border border-border bg-surface pr-14 pl-9 text-[13px] outline-none placeholder:text-[#9aa1b2] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-sans text-[10.5px] text-[#c9cedb]">
        {mac ? '⌘K' : 'Ctrl K'}
      </kbd>
    </form>
  );
}
