'use client';

import { useEffect, useRef, useState } from 'react';

/** Chiffre qui défile jusqu'à sa valeur quand il apparaît (« 62 % », « 14 j », « 24/7 » reste tel quel). */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const m = /^(\D*)(\d+)(.*)$/.exec(value);
  const target = m && !value.includes('/') ? Number(m[2]) : null;
  const [n, setN] = useState<number | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (target === null || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / duration);
        setN(Math.round(target * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      setN(0);
      raf = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, duration]);
  if (!m || target === null) return <span>{value}</span>;
  return (
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">{value}</span>
      <span aria-hidden>{m[1]}{n ?? target}{m[3]}</span>
    </span>
  );
}
