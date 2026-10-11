'use client';

import { useEffect, useRef } from 'react';

/**
 * Aperçu animé d'une démo : vidéo en boucle où un curseur parcourt le CRM
 * (enregistrée par scripts/apercus-demos.mjs). Elle ne se charge et ne joue qu'à l'écran ;
 * avec « réduire les animations », seule l'image d'affiche reste.
 */
export function DemoPreview({ slug, className }: { slug: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.25 });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={`/demos/apercus/${slug}.jpg`}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      tabIndex={-1}
    >
      <source src={`/demos/apercus/${slug}.mp4`} type="video/mp4" />
    </video>
  );
}
