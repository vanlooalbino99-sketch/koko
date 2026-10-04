// Moteur d'apparence : préréglages, mode clair/sombre/auto, accent, police, densité.
import { UI_KEY, LEGACY_UI_KEY } from './constants.js';
import { createStore } from './store.js';

export const PRESETS = [
  { id: 'nuit', label: 'Nuit Blackstart', accent: '#387CD5', dark: ['#0A1220', '#0F1B2E', '#EAF1FB'] },
  { id: 'graphite', label: 'Graphite', accent: '#4F7DF3', dark: ['#0B0C0F', '#15171B', '#ECEDF0'], light: ['#F5F6F8', '#FFFFFF', '#101217'] },
  { id: 'abysse', label: 'Abysse', accent: '#22C1D0', dark: ['#04131A', '#082230', '#E4F8FC'] },
  { id: 'orbite', label: 'Orbite', accent: '#8B5CF6', dark: ['#0C0A18', '#171230', '#EFEAFF'] },
  { id: 'menthe', label: 'Menthe', accent: '#10B981', dark: ['#04140E', '#08241B', '#E4FBF1'] },
  { id: 'braise', label: 'Braise', accent: '#F97316', dark: ['#140C06', '#22150C', '#FFF0E2'] },
  { id: 'rubis', label: 'Rubis', accent: '#F43F5E', dark: ['#15070D', '#251018', '#FFE9EE'] },
];

export const FONTS = {
  inter: { label: 'Inter', stack: '"Inter"', url: '' },
  jakarta: { label: 'Plus Jakarta Sans', stack: '"Plus Jakarta Sans"', url: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap' },
  manrope: { label: 'Manrope', stack: '"Manrope"', url: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap' },
  grotesk: { label: 'Space Grotesk', stack: '"Space Grotesk"', url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap' },
  system: { label: 'Système', stack: 'system-ui', url: '' },
};

export const DEFAULT_UI = {
  preset: 'nuit',
  scheme: 'dark',
  accent: '#387CD5',
  font: 'inter',
  fontSize: 14,
  density: 'comfortable',
  radius: 12,
  sidebar: 'expanded',
  motion: 'full',
  sound: true,
  notifications: false,
  prospectView: 'table',
  bgCache: '',
};

/* ---------------- couleur ---------------- */
const clamp = (n, a, b) => (n < a ? a : n > b ? b : n);
export function h2r(hex) {
  let h = String(hex || '').trim().replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
export const r2h = (c) => '#' + c.map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
const str = (c) => c.map((v) => Math.round(v)).join(' ');
function r2hsl([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const d = mx - mn;
  let h = 0;
  let s = 0;
  const l = (mx + mn) / 2;
  if (d) {
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}
function hsl2r(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 1);
  l = clamp(l, 0, 1);
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}
function mix(a, b, t) {
  const A = Array.isArray(a) ? a : h2r(a) || [0, 0, 0];
  const B = Array.isArray(b) ? b : h2r(b) || [255, 255, 255];
  return [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t];
}
export const lum = (hex) => {
  const c = h2r(hex) || [0, 0, 0];
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
};
function tone(accent, l, sMul = 1) {
  const [h, s] = r2hsl(h2r(accent) || [56, 124, 213]);
  return hsl2r(h, clamp(s * sMul, 0, 1), l);
}

function paletteFor(cfg, dark) {
  const p = PRESETS.find((x) => x.id === cfg.preset);
  const accent = h2r(cfg.accent) ? cfg.accent : (p || PRESETS[0]).accent;
  const [h] = r2hsl(h2r(accent));
  if (dark) {
    if (p && p.dark && (!cfg.accent || cfg.accent.toLowerCase() === p.accent.toLowerCase())) return { accent, bg: p.dark[0], surface: p.dark[1], text: p.dark[2] };
    if (p && p.id === 'graphite') return { accent, bg: p.dark[0], surface: p.dark[1], text: p.dark[2] };
    return { accent, bg: r2h(hsl2r(h, 0.34, 0.068)), surface: r2h(hsl2r(h, 0.3, 0.118)), text: r2h(hsl2r(h, 0.55, 0.955)) };
  }
  if (p && p.light) return { accent, bg: p.light[0], surface: p.light[1], text: p.light[2] };
  return { accent, bg: r2h(hsl2r(h, 0.3, 0.965)), surface: '#FFFFFF', text: r2h(hsl2r(h, 0.4, 0.1)) };
}

export function isDark(cfg) {
  if (cfg.scheme === 'auto') return !(window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches);
  return cfg.scheme !== 'light';
}

const fontLoaded = {};
function loadFont(id) {
  const f = FONTS[id];
  if (!f || !f.url || fontLoaded[id]) return;
  fontLoaded[id] = true;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = f.url;
  document.head.appendChild(l);
}

export function applyTheme(cfg) {
  const dark = isDark(cfg);
  const { accent, bg, surface, text } = paletteFor(cfg, dark);
  const d = document.documentElement;
  const S = d.style;
  const A = h2r(accent);
  const set = (k, v) => S.setProperty(k, v);
  const rgb = (c) => `rgb(${str(c)})`;

  set('--bg', bg);
  set('--bg-rgb', str(h2r(bg)));
  set('--surface', surface);
  set('--surface-rgb', str(h2r(surface)));
  set('--surface-2', rgb(mix(surface, text, dark ? 0.045 : 0.03)));
  set('--surface-3', rgb(mix(surface, text, dark ? 0.085 : 0.06)));
  set('--sidebar', rgb(mix(bg, surface, dark ? 0.55 : 0.4)));
  set('--border', rgb(mix(surface, text, dark ? 0.1 : 0.1)));
  set('--border-2', rgb(mix(surface, text, dark ? 0.17 : 0.18)));
  set('--text', text);
  set('--text-rgb', str(h2r(text)));
  set('--text-2', rgb(mix(text, bg, dark ? 0.3 : 0.32)));
  set('--text-3', rgb(mix(text, bg, dark ? 0.5 : 0.52)));

  set('--accent', accent);
  set('--accent-rgb', str(A));
  set('--accent-strong', dark ? rgb(mix(accent, '#FFFFFF', 0.12)) : rgb(mix(accent, '#000000', 0.12)));
  set('--accent-soft', `rgb(${str(A)} / ${dark ? 0.16 : 0.1})`);
  set('--accent-soft-2', `rgb(${str(A)} / ${dark ? 0.26 : 0.18})`);
  set('--accent-text', dark ? rgb(tone(accent, 0.74, 0.95)) : rgb(tone(accent, 0.38, 1)));
  set('--on-accent', lum(accent) > 0.45 ? '#0B1220' : '#FFFFFF');
  set('--ring', `rgb(${str(A)} / 0.45)`);

  // Graphiques — palette catégorielle validée (clair/sombre).
  set('--series-1', dark ? '#3987e5' : '#2a78d6');
  set('--series-2', dark ? '#d95926' : '#eb6834');
  set('--series-3', dark ? '#199e70' : '#1baf7a');
  set('--grid', rgb(mix(surface, text, dark ? 0.09 : 0.09)));
  set('--axis', rgb(mix(surface, text, dark ? 0.2 : 0.24)));

  const f = FONTS[cfg.font] || FONTS.inter;
  loadFont(cfg.font);
  set('--font', `${f.stack}, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`);
  set('--fs', `${cfg.fontSize || 14}px`);
  set('--radius', `${cfg.radius}px`);
  set('--radius-sm', `${Math.max(4, Math.round(cfg.radius * 0.66))}px`);
  set('--radius-lg', `${Math.round(cfg.radius * 1.35)}px`);

  d.setAttribute('data-scheme', dark ? 'dark' : 'light');
  d.setAttribute('data-density', cfg.density);
  d.setAttribute('data-motion', cfg.motion);
  d.style.background = bg;
  document.body && (document.body.style.background = bg);
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute('content', bg);
  cfg.bgCache = bg;
}

/* ---------------- état ---------------- */
function loadUi() {
  let c = { ...DEFAULT_UI };
  try {
    const raw = localStorage.getItem(UI_KEY);
    if (raw) return { ...c, ...JSON.parse(raw) };
    // Reprise des réglages de la v3.
    const old = JSON.parse(localStorage.getItem(LEGACY_UI_KEY) || 'null');
    if (old) {
      if (h2r(old.accent)) c.accent = old.accent;
      c.scheme = old.scheme === 'light' ? 'light' : 'dark';
      const p = PRESETS.find((x) => x.id === old.preset);
      c.preset = p ? p.id : old.preset === 'jour' || old.preset === 'aube' ? 'graphite' : 'custom';
      if (old.font && FONTS[old.font]) c.font = old.font;
      if (typeof old.sound === 'boolean') c.sound = old.sound;
      if (old.motion === 'none' || old.motion === 'soft') c.motion = 'reduced';
      if (old.radius) c.radius = Math.max(6, Math.min(18, Math.round(old.radius * 0.7)));
    }
  } catch (e) {
    /* valeurs par défaut */
  }
  return c;
}

export const ui = createStore(loadUi());
export const uiCfg = () => ui.get();
export function setUi(patch) {
  ui.set(patch);
  const c = ui.get();
  applyTheme(c);
  try {
    localStorage.setItem(UI_KEY, JSON.stringify(c));
  } catch (e) {
    /* stockage indisponible */
  }
}
export function usePreset(id) {
  const p = PRESETS.find((x) => x.id === id);
  if (p) setUi({ preset: id, accent: p.accent });
}
export function initTheme() {
  applyTheme(ui.get());
  if (window.matchMedia) {
    const mq = matchMedia('(prefers-color-scheme: light)');
    const f = () => ui.get().scheme === 'auto' && applyTheme(ui.get());
    mq.addEventListener ? mq.addEventListener('change', f) : mq.addListener(f);
  }
}
