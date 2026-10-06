'use client';

import { useEffect } from 'react';

/**
 * Effets qui suivent la souris, avec un seul écouteur pour toute la page :
 * - [data-spot] : halo lumineux sous le pointeur (variables --mx / --my) ;
 * - [data-tilt] : légère inclinaison 3D (--rx / --ry) ;
 * - [data-magnet] : le bouton se laisse attirer par le pointeur.
 * Inactif au tactile et avec « réduire les animations ».
 */
export function PointerFx() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    let tilted: HTMLElement | null = null;
    let magnet: HTMLElement | null = null;

    const reset = (el: HTMLElement | null, ...props: string[]) => props.forEach((p) => el?.style.removeProperty(p));

    const apply = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target instanceof Element ? e.target : null;

      const spot = target?.closest<HTMLElement>('[data-spot]');
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
        spot.style.setProperty('--my', `${e.clientY - r.top}px`);
      }

      const tilt = target?.closest<HTMLElement>('[data-tilt]') ?? null;
      if (tilt !== tilted) { reset(tilted, '--rx', '--ry'); tilted = tilt; }
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
        tilt.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`);
      }

      const mag = target?.closest<HTMLElement>('[data-magnet]') ?? null;
      if (mag !== magnet) { reset(magnet, '--tx', '--ty'); magnet = mag; }
      if (mag) {
        const r = mag.getBoundingClientRect();
        mag.style.setProperty('--tx', `${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px`);
        mag.style.setProperty('--ty', `${((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px`);
      }
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => { reset(tilted, '--rx', '--ry'); reset(magnet, '--tx', '--ty'); tilted = magnet = null; };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);
  return null;
}
