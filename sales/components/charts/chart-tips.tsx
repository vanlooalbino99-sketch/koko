'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// Bulle des graphiques : tout élément qui porte data-tip (« titre\nvaleur\ndétail ») affiche une bulle au survol,
// ou au toucher sur téléphone. Un seul écouteur pour toute l'application : les graphiques restent dessinés par le
// serveur et n'ont qu'à poser l'attribut.
type Tip = { lines: string[]; x: number; y: number };

const GAP = 14;

export function ChartTips() {
  const [tip, setTip] = useState<Tip | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const hideTimer = useRef(0);

  useEffect(() => {
    const target = (e: Event) => (e.target instanceof Element ? e.target.closest<Element>('[data-tip]') : null);
    const show = (el: Element, x: number, y: number) => {
      const text = el.getAttribute('data-tip');
      if (!text) return;
      setTip({ lines: text.split('\n'), x, y });
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const el = target(e);
      if (el) show(el, e.clientX, e.clientY);
      else setTip(null);
    };
    // Au toucher : la bulle reste quelques secondes, ou jusqu'au toucher suivant ailleurs.
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      const el = target(e);
      window.clearTimeout(hideTimer.current);
      if (!el) return setTip(null);
      show(el, e.clientX, e.clientY);
      hideTimer.current = window.setTimeout(() => setTip(null), 3500);
    };
    const hide = () => setTip(null);
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerdown', down, { passive: true });
    document.addEventListener('pointerleave', hide);
    window.addEventListener('scroll', hide, { passive: true, capture: true });
    window.addEventListener('blur', hide);
    return () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerdown', down);
      document.removeEventListener('pointerleave', hide);
      window.removeEventListener('scroll', hide, { capture: true });
      window.removeEventListener('blur', hide);
      window.clearTimeout(hideTimer.current);
    };
  }, []);

  // Placée au-dessus du pointeur (en dessous s'il n'y a pas la place), jamais hors de l'écran ; avant l'affichage.
  useLayoutEffect(() => {
    const el = box.current;
    if (!el || !tip) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    let left = tip.x - w / 2;
    left = Math.max(8, Math.min(window.innerWidth - w - 8, left));
    let top = tip.y - h - GAP;
    if (top < 8) top = tip.y + GAP + 6;
    el.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
  }, [tip]);

  if (!tip) return null;
  const [title, ...rest] = tip.lines;
  return (
    <div ref={box} role="tooltip" data-chart-tip="" className="bs-chart-tip">
      {rest.length ? <p className="bs-chart-tip-title">{title}</p> : null}
      {(rest.length ? rest : [title]).map((line, i) => (
        <p key={i} className={i === 0 ? 'bs-chart-tip-value' : 'bs-chart-tip-detail'}>
          {line}
        </p>
      ))}
    </div>
  );
}
