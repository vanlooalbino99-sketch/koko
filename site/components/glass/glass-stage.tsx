'use client';

import { useEffect, useRef } from 'react';
import { glassMark, glassPalette } from './shape';

const chapters = ['Accueil', 'Méthode', 'Services', 'Résultats', 'Offres'];

function hasWebGL2() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Accueil cinématique : le logo en verre (Three.js) se décompose puis se recompose au défilement,
 * pendant que les quatre chapitres (`slides`) se succèdent. `after` défile ensuite par-dessus la scène.
 * Sans WebGL 2 ou avec « réduire les animations », les chapitres s'affichent simplement les uns sous les autres.
 */
export function GlassStage({ slides, after }: { slides: React.ReactNode; after: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const fallback = () => root.classList.add('glass-static');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !hasWebGL2()) {
      fallback();
      return;
    }
    let stop: (() => void) | undefined;
    let cancelled = false;
    const html = document.documentElement;
    import('./engine.js').then(({ startGlass }) => {
      if (cancelled) return;
      try {
        stop = startGlass({ root, canvas, shape: glassMark, palette: glassPalette, contactCard: root.querySelector<HTMLElement>('[data-glass-card]') });
        root.classList.add('glass-live');
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) html.classList.add('glass-cursor');
      } catch (error) {
        console.warn('[glass] scène 3D indisponible', error);
        fallback();
      }
    }, fallback);
    return () => {
      cancelled = true;
      stop?.();
      html.classList.remove('glass-cursor');
    };
  }, []);

  return (
    <div ref={rootRef} className="glass-root">
      <canvas ref={canvasRef} className="glass-canvas" aria-hidden />
      <div className="glass-slides">{slides}</div>
      <nav className="story-progress" aria-label="Chapitres de la page">
        <p className="story-counter" aria-hidden>
          <span data-chapter>01</span>
          <span className="counter-sep" />
          05
        </p>
        <ol>
          {chapters.map((label, i) => (
            <li key={label}>
              <a href={['#accueil', '#methode', '#ce-que-nous-faisons', '#resultats', '#offres'][i]} data-goto={i < 4 ? [0, 0.34, 0.62, 0.94][i] : 'after'} className={i === 0 ? 'is-active' : undefined}>
                <span className="story-label">{label}</span>
                <span className="story-dash">{i < 4 && <span className="story-dash-fill" data-dash={i + 1} />}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="scroll-stage" aria-hidden />
      <div data-glass-after className="glass-after">{after}</div>
      <div className="cursor-inner" aria-hidden />
      <div className="cursor-outer" aria-hidden><span className="cursor-ticks"><span /><span /><span /><span /></span></div>
      <div className="cursor-label" aria-hidden>000</div>
    </div>
  );
}
