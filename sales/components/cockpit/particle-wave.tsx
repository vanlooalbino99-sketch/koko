'use client';

import { useEffect, useRef } from 'react';

// Vague de particules (première carte de la maquette) : deux rubans de points violet → cyan dont la hauteur suit la
// série du serveur, qui ondulent lentement. Sans données, le ruban reste au ras du bas avec une ondulation légère.
// Animation suspendue hors écran et coupée si l'utilisateur réduit les animations.

const COUNT = 2200;

function resample(values: number[], n: number) {
  if (values.length === 0) return Array.from({ length: n }, () => 0);
  if (values.length === 1) return Array.from({ length: n }, () => values[0]);
  return Array.from({ length: n }, (_, i) => {
    const x = (i / (n - 1)) * (values.length - 1);
    const i0 = Math.floor(x);
    const i1 = Math.min(values.length - 1, i0 + 1);
    return values[i0] + (values[i1] - values[i0]) * (x - i0);
  });
}

function mix(a: number[], b: number[], t: number) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

const STOPS = [
  [104, 74, 255],
  [76, 110, 245],
  [56, 208, 240],
];

function colorAt(u: number) {
  return u < 0.5 ? mix(STOPS[0], STOPS[1], u * 2) : mix(STOPS[1], STOPS[2], (u - 0.5) * 2);
}

// tips : une bulle par tranche de la période, de gauche à droite (colonnes invisibles posées sur la vague).
export function ParticleWave({ values, label, tips }: { values: number[]; label: string; tips?: string[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const key = values.join(',');

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const series = key ? key.split(',').map(Number) : [];
    const max = Math.max(...series, 0);
    const level = resample(series.map((v) => (max ? v / max : 0)), 64);
    // Lissage : moyenne glissante sur treize points, pour une vague douce comme sur la maquette.
    const smooth = level.map((_, i) => {
      const w = level.slice(Math.max(0, i - 6), i + 7);
      return w.reduce((a, b) => a + b, 0) / w.length;
    });
    const hasData = max > 0;
    // Particules fixes : position le long de la vague, écart au centre du ruban, ruban 1 ou 2, scintillement.
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5;
    const parts = Array.from({ length: COUNT }, () => ({ u: rand(), off: gauss(), strand: rand() < 0.5 ? 0 : 1, tw: rand() * Math.PI * 2 }));

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = el.clientWidth;
      height = el.clientHeight;
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (time: number) => {
      const t = time / 1000;
      ctx.clearRect(0, 0, width, height);
      const amp = height * (hasData ? 0.16 : 0.05);
      for (const p of parts) {
        const lvl = smooth[Math.min(63, Math.floor(p.u * 64))];
        // Deux rubans déphasés qui se croisent, comme la maquette.
        const phase = p.strand ? 2.1 : 0;
        const base = height * (0.66 - 0.36 * lvl);
        const yc = base + amp * Math.sin(Math.PI * 2 * (p.u * 1.35) + t * 0.45 + phase);
        const y = yc + p.off * height * 0.11;
        const x = p.u * width;
        const [r, g, b] = colorAt(p.u);
        const alpha = Math.max(0, 0.95 - Math.abs(p.off) * 0.55) * (0.65 + 0.35 * Math.sin(t * 1.3 + p.tw));
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx.fillRect(x, y, 1.25, 1.25);
      }
    };

    resize();
    let frame = 0;
    let visible = true;
    const loop = (time: number) => {
      draw(time);
      if (!reduce && visible) frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was && !reduce) frame = requestAnimationFrame(loop);
    });
    io.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
    };
  }, [key]);

  return (
    <div className="relative">
      <canvas ref={canvas} role="img" aria-label={label} className="block h-[96px] w-full" />
      {tips && tips.length > 0 && (
        <div className="absolute inset-0 flex">
          {tips.map((tip, i) => (
            <span key={i} data-tip={tip} className="h-full flex-1 transition-colors hover:bg-white/[0.05]" />
          ))}
        </div>
      )}
    </div>
  );
}
