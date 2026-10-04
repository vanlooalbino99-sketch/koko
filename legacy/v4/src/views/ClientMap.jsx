// Carte des clients : globe 3D, un point par client placé selon sa ville.
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { db, useStore } from '../lib/store.js';
import { open } from '../lib/nav.js';
import { ui } from '../lib/theme.js';
import { locate, geocodeOnline, normCity } from '../lib/geo.js';
import { createGlobe } from '../lib/globe.js';
import { STATUTS } from '../lib/constants.js';
import { eur, plural } from '../lib/util.js';
import { PageHeader, Card, Kpi, Button, IconButton, EmptyState, Avatar, Segmented, cx } from '../components/ui.jsx';
import { Icon } from '../components/icons.jsx';

const RAD = Math.PI / 180;
const MAX_FIT_ZOOM = 6;

/* Plusieurs clients dans la même ville : petite spirale autour du centre pour qu'ils restent distincts. */
function spread(list) {
  const seen = {};
  return list.map((x) => {
    const k = `${x.loc.lat},${x.loc.lon}`;
    const n = (seen[k] = (seen[k] || 0) + 1) - 1;
    if (!n) return { ...x, lat: x.loc.lat, lon: x.loc.lon };
    const r = 0.16 * Math.sqrt(n);
    const a = n * 2.39996;
    return { ...x, lat: x.loc.lat + r * Math.sin(a), lon: x.loc.lon + (r * Math.cos(a)) / Math.max(0.2, Math.cos(x.loc.lat * RAD)) };
  });
}

/* Centre et zoom qui englobent tous les points. */
function fit(points) {
  if (!points.length) return { lat: 20, lon: 0, zoom: 1 };
  let x = 0, y = 0, z = 0;
  const vs = points.map((p) => [Math.cos(p.lat * RAD) * Math.cos(p.lon * RAD), Math.sin(p.lat * RAD), Math.cos(p.lat * RAD) * Math.sin(p.lon * RAD)]);
  vs.forEach((v) => ((x += v[0]), (y += v[1]), (z += v[2])));
  const n = Math.hypot(x, y, z) || 1;
  const c = [x / n, y / n, z / n];
  const maxA = Math.max(...vs.map((v) => Math.acos(Math.min(1, v[0] * c[0] + v[1] * c[1] + v[2] * c[2]))));
  const zoom = Math.max(1, Math.min(MAX_FIT_ZOOM, 0.75 / Math.sin(Math.min(Math.PI / 2, Math.max(maxA, 2 * RAD)))));
  return { lat: Math.asin(c[1]) / RAD, lon: Math.atan2(c[2], c[0]) / RAD, zoom };
}

function readColors() {
  const cs = getComputedStyle(document.documentElement);
  const v = (k) => cs.getPropertyValue(k).trim();
  const dark = document.documentElement.getAttribute('data-scheme') !== 'light';
  return {
    sphere: v('--surface-2'),
    sphereHi: v('--surface-3'),
    land: `rgb(${v('--text-rgb')} / ${dark ? 0.42 : 0.3})`,
    rim: `rgb(${v('--text-rgb')} / ${dark ? 0.1 : 0.12})`,
    glow: `rgb(${v('--accent-rgb')} / ${dark ? 0.32 : 0.2})`,
    point: dark ? v('--accent-text') : v('--accent'),
    prospect: v('--series-2'),
    pointRing: v('--surface'),
  };
}

export function ClientMap() {
  const prospects = useStore(db, (s) => s.prospects);
  const cfg = useStore(ui);
  const [mode, setMode] = useState('clients');
  const [spin, setSpin] = useState(true);
  const [tip, setTip] = useState(null); // { point, x, y, pinned }
  const [geoTick, setGeoTick] = useState(0);
  const canvasRef = useRef(null);
  const globeRef = useRef(null);
  const fitRef = useRef(null);
  const tipRef = useRef(null);

  const touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;
  const reduced = cfg.motion === 'reduced' || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [colors, setColors] = useState(readColors);
  /* Le moteur de thème écrit ses couleurs sur <html> : on les relit à chaque changement (clair/sombre, accent, mode auto). */
  useEffect(() => {
    if (typeof MutationObserver === 'undefined') return;
    const mo = new MutationObserver(() => {
      const c = readColors();
      setColors((o) => (JSON.stringify(o) === JSON.stringify(c) ? o : c));
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'data-scheme'] });
    return () => mo.disconnect();
  }, []);

  const shown = useMemo(
    () => prospects.filter((p) => p.statut === 'client_signe' || (mode === 'tous' && !['perdu', 'resilie'].includes(p.statut))),
    [prospects, mode],
  );
  const { located, missing } = useMemo(() => {
    const located = [];
    const missing = [];
    shown.forEach((p) => {
      const loc = locate(p);
      if (loc) located.push({ p, loc });
      else missing.push(p);
    });
    return { located, missing };
  }, [shown, geoTick]);

  const points = useMemo(
    () =>
      spread(located).map(({ p, lat, lon, loc }) => ({
        id: p.id,
        lat,
        lon,
        p,
        city: loc.name,
        color: p.statut === 'client_signe' ? colors.point : colors.prospect,
      })),
    [located, colors],
  );
  const cities = useMemo(() => {
    const m = new Map();
    located.forEach(({ p, loc }) => {
      const k = `${loc.lat},${loc.lon}`;
      const c = m.get(k) || { name: loc.name, lat: loc.lat, lon: loc.lon, count: 0, mrr: 0 };
      c.count++;
      c.mrr += p.statut === 'client_signe' ? p.mrrValue : 0;
      m.set(k, c);
    });
    return [...m.values()].sort((a, b) => b.count - a.count || b.mrr - a.mrr);
  }, [located]);

  /* Villes absentes du répertoire intégré : recherche en ligne (communes françaises). */
  useEffect(() => {
    const todo = missing.map((p) => p.ville).filter((v) => normCity(v));
    if (!todo.length || !navigator.onLine) return;
    let alive = true;
    geocodeOnline(todo).then((n) => alive && n && setGeoTick((t) => t + 1));
    return () => (alive = false);
  }, [missing.map((p) => p.ville).join('|')]);

  /* Création du globe (une seule fois), centré sur les clients. */
  useEffect(() => {
    const f = fit(points);
    fitRef.current = f;
    const g = createGlobe(canvasRef.current, {
      lat: Math.max(-30, Math.min(55, f.lat - 8)),
      lon: f.lon,
      colors,
      reduced,
      onHover: (h) => setTip((t) => (t && t.pinned ? t : h)),
      onSelect: (h) => setTip(h ? { ...h, pinned: true } : null),
      onTrack: (q) => {
        const el = tipRef.current;
        if (!el) return;
        el.style.visibility = q ? '' : 'hidden';
        if (!q) return;
        const half = el.offsetWidth / 2 + 8;
        const w = el.parentNode.clientWidth;
        el.style.left = Math.max(half, Math.min(w - half, q.x)) + 'px';
        el.style.top = Math.max(el.offsetHeight + 22, q.y) + 'px';
      },
    });
    globeRef.current = g;
    return () => g.destroy();
  }, []);
  useEffect(() => globeRef.current && globeRef.current.setPoints(points), [points]);
  useEffect(() => globeRef.current && globeRef.current.setColors(colors), [colors]);
  useEffect(() => globeRef.current && globeRef.current.setReduced(reduced), [reduced]);
  useEffect(() => globeRef.current && globeRef.current.setSpin(spin), [spin]);
  useEffect(() => {
    fitRef.current = fit(points);
  }, [points]);
  useEffect(() => setTip(null), [mode]);
  useEffect(() => globeRef.current && globeRef.current.track(tip ? tip.point.id : null, tip && tip.pinned), [tip]);

  const globe = () => globeRef.current;
  const total = shown.length;
  const top = cities[0];

  return (
    <>
      <PageHeader title="Carte des clients" subtitle="Où se trouvent vos clients, sur un globe que vous pouvez faire tourner">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: 'clients', label: 'Clients', count: prospects.filter((p) => p.statut === 'client_signe').length },
            { value: 'tous', label: 'Clients + prospects' },
          ]}
        />
      </PageHeader>
      <div class="globe-page">
      <div class="kpis">
        <Kpi label="Sur la carte" value={`${located.length}/${total}`} sub={mode === 'clients' ? 'clients actifs localisés' : 'contacts localisés'} icon="mapPin" tone="blue" />
        <Kpi label="Villes" value={cities.length} sub={plural(cities.length, 'ville couverte', 'villes couvertes')} icon="building" tone="violet" />
        <Kpi label="Ville principale" value={top ? top.name : '—'} sub={top ? plural(top.count, mode === 'clients' ? 'client' : 'contact') : 'aucune'} icon="star" tone="amber" />
        <Kpi label="À localiser" value={missing.length} sub={missing.length ? 'ville absente ou inconnue' : 'tout est placé'} icon="alert" tone={missing.length ? 'rose' : 'emerald'} />
      </div>
      <div class="layout-2">
        <Card class="globe-card" pad={false}>
          <div class="globe-wrap">
            <canvas ref={canvasRef} class="globe-canvas" role="img" aria-label={`Globe : ${plural(located.length, 'point')} répartis dans ${plural(cities.length, 'ville')}`} />
            {!total && (
              <div class="globe-empty">
                <EmptyState compact icon="globe" title={mode === 'clients' ? 'Aucun client actif pour le moment' : 'Aucun contact'} text="Chaque client signé apparaîtra ici, placé selon sa ville." />
              </div>
            )}
            <div class="globe-tools">
              <IconButton icon="plus" label="Zoomer" variant="secondary" onClick={() => globe().zoomBy(1.6)} />
              <IconButton icon="minus" label="Dézoomer" variant="secondary" onClick={() => globe().zoomBy(1 / 1.6)} />
              <IconButton icon="mapPin" label="Centrer sur mes clients" variant="secondary" disabled={!points.length} onClick={() => fitRef.current && globe().flyTo(fitRef.current.lat, fitRef.current.lon, fitRef.current.zoom)} />
              <IconButton icon="globe" label="Vue du globe entier" variant="secondary" onClick={() => globe().flyTo(fitRef.current ? fitRef.current.lat - 8 : 20, fitRef.current ? fitRef.current.lon : 0, 1)} />
              {!reduced && <IconButton icon={spin ? 'pause' : 'play'} label={spin ? 'Arrêter la rotation' : 'Reprendre la rotation'} variant="secondary" onClick={() => setSpin(!spin)} />}
            </div>
            {mode === 'tous' && (
              <div class="globe-legend">
                <span><i style={{ background: colors.point }} /> Clients</span>
                <span><i style={{ background: colors.prospect }} /> Prospects</span>
              </div>
            )}
            {total > 0 && <div class="globe-hint">{touch ? 'Glissez pour tourner · pincez pour zoomer' : 'Glissez pour tourner · molette pour zoomer'}</div>}
            {tip && (
              <div ref={tipRef} class={cx('globe-tip', tip.pinned && 'pinned')} style={{ left: tip.x, top: tip.y }}>
                <div class="row min-w-0">
                  <Avatar name={tip.point.p.entreprise} size={28} />
                  <div class="min-w-0">
                    <div class="fw-7 truncate">{tip.point.p.entreprise}</div>
                    <div class="xs text-2 truncate">
                      {[tip.point.city, tip.point.p.statut === 'client_signe' ? `${eur(tip.point.p.mrrValue)}/mois` : STATUTS[tip.point.p.statut] && STATUTS[tip.point.p.statut].label].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </div>
                {tip.pinned && (
                  <Button size="sm" variant="primary" iconRight="arrowRight" block class="mt-8" onClick={() => open('prospect', { id: tip.point.id })}>
                    Ouvrir la fiche
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
        <div class="stack">
          <Card title="Par ville" subtitle="Cliquez pour survoler la ville" icon="mapPin" pad={false}>
            {cities.length ? (
              <div class="globe-cities">
                {cities.map((c) => (
                  <button class="list-item clickable" onClick={() => (setTip(null), globe().flyTo(c.lat, c.lon, MAX_FIT_ZOOM))}>
                    <span class="globe-dot" />
                    <div class="li-main">
                      <div class="li-title">{c.name}</div>
                      {c.mrr > 0 && <div class="li-sub">{eur(c.mrr)}/mois</div>}
                    </div>
                    <span class="fw-7 num">{c.count}</span>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState compact title="Aucune ville pour le moment" />
            )}
          </Card>
          {missing.length > 0 && (
            <Card title="À localiser" subtitle="Renseignez la ville dans la fiche pour placer le point" icon="alert" pad={false}>
              {missing.slice(0, 30).map((p) => (
                <button class="list-item clickable" onClick={() => open('prospect', { id: p.id })}>
                  <Avatar name={p.entreprise} size={28} />
                  <div class="li-main">
                    <div class="li-title">{p.entreprise}</div>
                    <div class="li-sub">{p.ville ? `« ${p.ville} » introuvable` : 'Ville non renseignée'}</div>
                  </div>
                  <Icon name="chevronRight" size={16} class="text-3" />
                </button>
              ))}
            </Card>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
