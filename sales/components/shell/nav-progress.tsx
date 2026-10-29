'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Fine barre en haut de l'écran dès qu'on clique sur un lien interne, jusqu'à l'arrivée de la nouvelle page :
// le clic se voit tout de suite, même quand le serveur met un instant à répondre.
export function NavProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [state, setState] = useState<'idle' | 'running' | 'done'>('idle');
  const timer = useRef(0);

  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
      if (!(a instanceof HTMLAnchorElement) || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
      window.clearTimeout(timer.current);
      setState('running');
    };
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, []);

  // Nouvelle page affichée : la barre se remplit puis s'efface.
  useEffect(() => {
    setState((s) => (s === 'running' ? 'done' : s));
    timer.current = window.setTimeout(() => setState((s) => (s === 'done' ? 'idle' : s)), 350);
    return () => window.clearTimeout(timer.current);
  }, [pathname, search]);

  if (state === 'idle') return null;
  return <div aria-hidden="true" className={state === 'running' ? 'bs-nav-progress bs-nav-running' : 'bs-nav-progress bs-nav-done'} />;
}
