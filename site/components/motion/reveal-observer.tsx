'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Apparitions au défilement : tout élément [data-reveal] reçoit data-in quand il entre à l'écran
 * (une seule fois). Sans JavaScript ou avec « réduire les animations », le contenu reste simplement visible.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    root.classList.add('motion');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.in = '';
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-in])').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
