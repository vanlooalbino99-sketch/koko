// Globe 3D en points (projection orthographique sur <canvas>), sans dépendance.
// Rotation automatique, rotation à la souris / au doigt avec inertie, zoom molette / pincement.
import { LAND } from './geodata.js';

const RAD = Math.PI / 180;
const GOLD = Math.PI * (3 - Math.sqrt(5));
const MAX_ZOOM = 8; // au-delà, la trame des terres devient trop lâche pour rester lisible
const clamp = (n, a, b) => (n < a ? a : n > b ? b : n);

/* Points de terre : sphère de Fibonacci filtrée par le masque généré (même formule que scripts/gen-geodata.mjs).
   Deux niveaux : trame large en vue d'ensemble, trame fine quand on zoome. */
const lands = [];
function landPoints(level) {
  if (lands[level]) return lands[level];
  const { n, bits } = LAND[level];
  const bin = atob(bits);
  const pts = [];
  for (let i = 0; i < n; i++) {
    if (!(bin.charCodeAt(i >> 3) & (1 << (i & 7)))) continue;
    const y = 1 - ((i + 0.5) * 2) / n;
    const r = Math.sqrt(1 - y * y);
    const t = (i * GOLD) % (2 * Math.PI);
    // Vecteur unitaire (x vers lon 0, z vers lon 90° E, y vers le pôle Nord)
    pts.push(r * Math.cos(t), y, r * Math.sin(t));
  }
  lands[level] = { pts: new Float32Array(pts), spacing: Math.sqrt((4 * Math.PI) / n) };
  return lands[level];
}

/* Même couleur, totalement transparente (un dégradé vers « transparent » noircit les teintes claires). */
const fades = {};
function fade(c) {
  if (fades[c]) return fades[c];
  let rgb = null;
  if (/^#[0-9a-f]{6}$/i.test(c)) rgb = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  else rgb = (c.match(/[\d.]+/g) || []).slice(0, 3);
  return (fades[c] = rgb.length === 3 ? `rgba(${rgb.join(',')},0)` : 'rgba(0,0,0,0)');
}

const toVec = (lat, lon) => [Math.cos(lat * RAD) * Math.cos(lon * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.sin(lon * RAD)];

export function createGlobe(canvas, opts = {}) {
  const ctx = canvas.getContext('2d');
  const state = {
    lon: opts.lon ?? 0, // longitude au centre de la vue
    lat: opts.lat ?? 20, // latitude au centre de la vue
    zoom: 1,
    targetZoom: 1,
    vLon: 0,
    vLat: 0,
    spin: true,
    reduced: !!opts.reduced,
    dragging: false,
    lastInteract: 0,
    fly: null,
    points: [],
    colors: opts.colors || {},
    hover: null,
    track: null, // id du point suivi par l'infobulle
    w: 0,
    h: 0,
    dpr: 1,
  };
  const projected = []; // points clients visibles à l'écran (pour le survol)
  let raf = 0;
  let last = performance.now();

  function resize() {
    const rect = canvas.getBoundingClientRect();
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.w = rect.width;
    state.h = rect.height;
    canvas.width = Math.round(rect.width * state.dpr);
    canvas.height = Math.round(rect.height * state.dpr);
    draw(0);
  }

  function frame(now) {
    const dt = Math.min(64, now - last);
    last = now;
    const s = state;
    if (s.fly) {
      const f = s.fly;
      f.t = Math.min(1, f.t + dt / 900);
      const e = 1 - Math.pow(1 - f.t, 3);
      s.lon = f.lon0 + f.dLon * e;
      s.lat = f.lat0 + (f.lat1 - f.lat0) * e;
      if (f.t >= 1) s.fly = null;
    } else if (!s.dragging) {
      s.lon += s.vLon * dt;
      s.lat = clamp(s.lat + s.vLat * dt, -75, 75);
      s.vLon *= Math.pow(0.94, dt / 16);
      s.vLat *= Math.pow(0.94, dt / 16);
      const idle = now - s.lastInteract > 2500 && !s.hold;
      if (s.spin && !s.reduced && idle && Math.abs(s.vLon) < 0.004) s.lon += (dt * 0.006) / s.zoom;
    }
    s.zoom += (s.targetZoom - s.zoom) * Math.min(1, dt / 120);
    draw(now);
    raf = requestAnimationFrame(frame);
  }

  function draw(now) {
    const s = state;
    const c = s.colors;
    const { w, h, dpr } = s;
    if (!w || !h) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const R = Math.min(w, h) * 0.42 * s.zoom;
    const cx = w / 2;
    const cy = h / 2;

    // Rotation : la vue regarde le point (s.lat, s.lon).
    const cl = Math.cos(-s.lon * RAD), sl = Math.sin(-s.lon * RAD);
    const cp = Math.cos(s.lat * RAD), sp = Math.sin(s.lat * RAD);
    // Vecteur (x,y,z) → écran : rotation autour de l'axe polaire puis inclinaison.
    const proj = (x, y, z) => {
      const x1 = x * cl - z * sl; // composante vers l'observateur (avant inclinaison)
      const z1 = x * sl + z * cl; // composante horizontale à l'écran
      const depth = x1 * cp + y * sp;
      const y2 = y * cp - x1 * sp;
      return [cx + z1 * R, cy - y2 * R, depth];
    };

    // Halo atmosphérique
    const halo = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.22);
    const glow = c.glow || 'rgba(56,124,213,0.35)';
    halo.addColorStop(0, glow);
    halo.addColorStop(1, fade(glow));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.22, 0, Math.PI * 2);
    ctx.fill();

    // Sphère
    const g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    g.addColorStop(0, c.sphereHi || '#1c2a44');
    g.addColorStop(1, c.sphere || '#0f1b2e');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = c.rim || 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Terres : un point par cellule, plus petit vers le bord pour l'effet de relief.
    const { pts: L, spacing } = landPoints(s.zoom >= 3 ? 1 : 0);
    const base = clamp(R * spacing * 0.33, 0.6, 2.8);
    ctx.fillStyle = c.land || 'rgba(234,241,251,0.4)';
    ctx.beginPath();
    for (let i = 0; i < L.length; i += 3) {
      const [x, y, d] = proj(L[i], L[i + 1], L[i + 2]);
      if (d <= 0.02 || x < -4 || y < -4 || x > w + 4 || y > h + 4) continue;
      const r = base * (0.45 + 0.55 * Math.sqrt(d));
      ctx.moveTo(x + r, y);
      ctx.arc(x, y, r, 0, Math.PI * 2);
    }
    ctx.fill();

    // Clients
    projected.length = 0;
    const pulse = s.reduced ? 0 : ((now || 0) % 2400) / 2400;
    const pr = clamp(3 + s.zoom * 0.4, 3.4, 6.5);
    for (const p of s.points) {
      const [x, y, d] = proj(p.v[0], p.v[1], p.v[2]);
      if (d <= 0) continue;
      projected.push({ p, x, y });
      const col = p.color || c.point || '#387CD5';
      const a = 0.35 + 0.65 * Math.sqrt(d);
      ctx.globalAlpha = a;
      if (pulse) {
        ctx.globalAlpha = a * (1 - pulse) * 0.6;
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, pr + pulse * pr * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = a;
      }
      const gl = ctx.createRadialGradient(x, y, 0, x, y, pr * 3);
      gl.addColorStop(0, col);
      gl.addColorStop(1, fade(col));
      ctx.globalAlpha = a * 0.35;
      ctx.fillStyle = gl;
      ctx.beginPath();
      ctx.arc(x, y, pr * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = a;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, s.hover === p ? pr * 1.6 : pr, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = c.pointRing || '#fff';
      ctx.lineWidth = s.hover === p ? 2 : 1.2;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    if (s.track && opts.onTrack) {
      const q = projected.find((x) => x.p.id === s.track);
      opts.onTrack(q ? { x: q.x, y: q.y } : null);
    }
  }

  /* ---------- interactions ---------- */
  const pointers = new Map();
  let pinch = 0;
  let downAt = null;
  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  function hit(x, y, radius = 14) {
    let best = null;
    let bd = radius * radius;
    for (let i = projected.length - 1; i >= 0; i--) {
      const q = projected[i];
      const d = (q.x - x) ** 2 + (q.y - y) ** 2;
      if (d < bd) (bd = d), (best = q);
    }
    return best;
  }
  function onDown(e) {
    canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, pos(e));
    state.lastInteract = performance.now();
    state.fly = null;
    if (pointers.size === 1) {
      state.dragging = true;
      state.vLon = state.vLat = 0;
      downAt = { ...pos(e), t: performance.now(), moved: 0 };
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = Math.hypot(a.x - b.x, a.y - b.y);
    }
  }
  function onMove(e) {
    const p = pos(e);
    if (!pointers.has(e.pointerId)) {
      if (e.pointerType === 'mouse') {
        const h = hit(p.x, p.y);
        const hp = h ? h.p : null;
        if (hp !== state.hover) {
          state.hover = hp;
          canvas.style.cursor = hp ? 'pointer' : 'grab';
          opts.onHover && opts.onHover(h ? { point: hp, x: h.x, y: h.y } : null);
        }
      }
      return;
    }
    const prev = pointers.get(e.pointerId);
    pointers.set(e.pointerId, p);
    state.lastInteract = performance.now();
    if (pointers.size >= 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch) setZoom(state.targetZoom * (d / pinch), true);
      pinch = d;
      if (downAt) downAt.moved = 99;
      return;
    }
    const R = Math.min(state.w, state.h) * 0.42 * state.zoom;
    const dx = p.x - prev.x;
    const dy = p.y - prev.y;
    if (downAt) downAt.moved += Math.abs(dx) + Math.abs(dy);
    const k = 1 / R / RAD;
    state.lon -= dx * k;
    state.lat = clamp(state.lat + dy * k, -75, 75);
    const dt = Math.max(8, e.timeStamp - (prev.t || e.timeStamp - 16));
    state.vLon = (-dx * k) / dt;
    state.vLat = (dy * k) / dt;
    pointers.get(e.pointerId).t = e.timeStamp;
    if (state.hover) (state.hover = null), opts.onHover && opts.onHover(null);
    canvas.style.cursor = 'grabbing';
  }
  function onUp(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = 0;
    if (pointers.size === 0) {
      state.dragging = false;
      canvas.style.cursor = 'grab';
      if (downAt && downAt.moved < 6 && e.type === 'pointerup') {
        const p = pos(e);
        const h = hit(p.x, p.y, e.pointerType === 'mouse' ? 14 : 22);
        opts.onSelect && opts.onSelect(h ? { point: h.p, x: h.x, y: h.y } : null);
        state.vLon = state.vLat = 0;
      }
      downAt = null;
    }
    state.lastInteract = performance.now();
  }
  function onLeave() {
    if (state.hover) (state.hover = null), opts.onHover && opts.onHover(null);
  }
  function onWheel(e) {
    e.preventDefault();
    state.lastInteract = performance.now();
    setZoom(state.targetZoom * Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0015)));
  }
  function setZoom(z, instant) {
    state.targetZoom = clamp(z, 0.8, MAX_ZOOM);
    if (instant) state.zoom = state.targetZoom;
  }

  canvas.style.cursor = 'grab';
  canvas.style.touchAction = 'none';
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  ro ? ro.observe(canvas) : window.addEventListener('resize', resize);
  resize();
  raf = requestAnimationFrame(frame);

  return {
    setPoints(list) {
      state.points = list.map((p) => ({ ...p, v: toVec(p.lat, p.lon) }));
      if (state.hover && !state.points.some((p) => p.id === state.hover.id)) state.hover = null;
    },
    setColors(colors) {
      state.colors = colors;
    },
    setReduced(r) {
      state.reduced = r;
    },
    /* L'infobulle suit ce point ; la rotation automatique s'arrête tant qu'une fiche est épinglée. */
    track(id, hold) {
      state.track = id;
      state.hold = !!hold;
    },
    setSpin(on) {
      state.spin = on;
      state.lastInteract = 0;
    },
    zoomBy(f) {
      state.lastInteract = performance.now();
      setZoom(state.targetZoom * f);
    },
    flyTo(lat, lon, zoom) {
      let d = (lon - state.lon) % 360;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      state.vLon = state.vLat = 0;
      state.lastInteract = performance.now();
      state.fly = { t: state.reduced ? 1 : 0, lon0: state.lon, dLon: d, lat0: state.lat, lat1: clamp(lat, -75, 75) };
      if (state.reduced) (state.lon = lon), (state.lat = clamp(lat, -75, 75)), (state.fly = null);
      if (zoom) setZoom(zoom, state.reduced);
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro ? ro.disconnect() : window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('wheel', onWheel);
    },
  };
}
