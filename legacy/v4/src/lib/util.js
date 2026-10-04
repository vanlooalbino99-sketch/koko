// Utilitaires : identifiants, dates, formats, CSV, modèles.

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

/* ---------- Dates (toujours en heure locale, format AAAA-MM-JJ) ---------- */
const pad = (n) => String(n).padStart(2, '0');
export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const today = () => toKey(new Date());
export const nowTime = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
export const parseKey = (k) => new Date(k + 'T00:00:00');
export const addDays = (key, n) => {
  const d = parseKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
};
export const inDays = (n) => addDays(today(), n);
export const monthKey = (key) => (key || '').slice(0, 7);
export const startOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  d.setHours(0, 0, 0, 0);
  return d;
};
export const weekKeys = (date = new Date()) => {
  const s = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(s);
    d.setDate(s.getDate() + i);
    return toKey(d);
  });
};
export function inPeriod(key, period) {
  if (!key) return false;
  if (period === 'today') return key === today();
  if (period === 'week') {
    const s = toKey(startOfWeek());
    return key >= s && key <= addDays(s, 6);
  }
  if (period === 'month') return monthKey(key) === monthKey(today());
  if (period === 'lastWeek') {
    const s = addDays(toKey(startOfWeek()), -7);
    return key >= s && key <= addDays(s, 6);
  }
  if (period === 'lastMonth') {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - 1);
    return monthKey(key) === monthKey(toKey(d));
  }
  return true;
}
export function lastMonths(n = 6) {
  const out = [];
  const t = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(t.getFullYear(), t.getMonth() - i, 1);
    out.push({ key: `${d.getFullYear()}-${pad(d.getMonth() + 1)}`, label: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '') });
  }
  return out;
}
export const daysBetween = (a, b) => Math.round((parseKey(b) - parseKey(a)) / 864e5);

export function fmtDate(key, opts) {
  if (!key) return '—';
  return parseKey(key).toLocaleDateString('fr-FR', opts || { day: '2-digit', month: 'short' });
}
export const fmtDateLong = (key) => (key ? cap(parseKey(key).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })) : '—');
export const fmtDateFull = (key) => (key ? parseKey(key).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—');
export function fmtRelative(key) {
  if (!key) return '—';
  const n = daysBetween(today(), key);
  if (n === 0) return "Aujourd'hui";
  if (n === 1) return 'Demain';
  if (n === -1) return 'Hier';
  if (n > 1 && n < 7) return cap(parseKey(key).toLocaleDateString('fr-FR', { weekday: 'long' }));
  if (n < 0 && n > -30) return `Il y a ${-n} j`;
  return fmtDate(key);
}
export function fmtWhen(date, heure) {
  if (!date) return 'Aucune date choisie';
  return heure ? `${fmtDateLong(date)} à ${heure}` : fmtDateLong(date);
}
export const fmtDuration = (s) => `${Math.floor((s || 0) / 60)}:${pad((s || 0) % 60)}`;

/* ---------- Nombres ---------- */
export const eur = (n, digits = 0) =>
  (Number(n) || 0).toLocaleString('fr-FR', { minimumFractionDigits: digits, maximumFractionDigits: digits }) + ' €';
export const eur2 = (n) => eur(n, 2);
export const num = (n) => (Number(n) || 0).toLocaleString('fr-FR', { maximumFractionDigits: 1 });
export function compact(n) {
  const v = Number(n) || 0;
  if (Math.abs(v) >= 1e6) return (v / 1e6).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' M';
  if (Math.abs(v) >= 1e4) return (v / 1e3).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' k';
  return v.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
}
export const pct = (a, b) => (b ? Math.round((a / b) * 1000) / 10 : 0);

/* ---------- Texte ---------- */
export const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
export const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
export const digits = (s) => String(s || '').replace(/[^\d]/g, '');
export function initials(name) {
  const w = String(name || '?').replace(/[^\p{L}\p{N} ]/gu, ' ').trim().split(/\s+/);
  return ((w[0] || '?')[0] + (w[1] ? w[1][0] : '')).toUpperCase();
}
export function fmtPhone(p) {
  const d = digits(p);
  if (d.length === 10) return d.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  return p || '';
}
/* Numéro au format international pour WhatsApp (France par défaut). */
export function waPhone(p) {
  let d = digits(p);
  if (d.startsWith('00')) d = d.slice(2);
  else if (d.length === 10 && d.startsWith('0')) d = '33' + d.slice(1);
  return d;
}
export const fillTemplate = (tpl, vars) => String(tpl || '').replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : ''));
export const plural = (n, one, many) => `${n} ${n > 1 ? many || one + 's' : one}`;

/* ---------- CSV ---------- */
export function detectSep(line) {
  const c = { ',': (line.match(/,/g) || []).length, ';': (line.match(/;/g) || []).length, '\t': (line.match(/\t/g) || []).length };
  return Object.entries(c).sort((a, b) => b[1] - a[1])[0][0];
}
export function splitCsvLine(line, sep) {
  const out = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (q && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else q = !q;
    } else if (ch === sep && !q) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}
export function parseCsv(text) {
  const lines = String(text || '')
    .replace(/^﻿/, '')
    .split(/\r\n|\n/)
    .filter((l) => l.trim());
  if (!lines.length) return { headers: [], rows: [] };
  const sep = detectSep(lines[0]);
  return { headers: splitCsvLine(lines[0], sep), rows: lines.slice(1).map((l) => splitCsvLine(l, sep)) };
}
export function toCsv(rows, headers) {
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[";\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  return '﻿' + [headers.map((h) => esc(h.label)).join(';'), ...rows.map((r) => headers.map((h) => esc(typeof h.get === 'function' ? h.get(r) : r[h.key])).join(';'))].join('\r\n');
}

/* ---------- Fichiers ---------- */
export function download(filename, content, mime = 'text/plain;charset=utf-8') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
export const readFileText = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result || ''));
    r.onerror = rej;
    r.readAsText(file);
  });
export function fmtSize(b) {
  if (!b) return '0 o';
  if (b < 1024) return b + ' o';
  if (b < 1048576) return (b / 1024).toFixed(0) + ' Ko';
  return (b / 1048576).toFixed(1) + ' Mo';
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    try {
      const t = document.createElement('textarea');
      t.value = text;
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      const ok = document.execCommand('copy');
      t.remove();
      return ok;
    } catch (e2) {
      return false;
    }
  }
}

export const clamp = (n, a, b) => (n < a ? a : n > b ? b : n);
export const sum = (arr, f) => arr.reduce((s, x) => s + (Number(f ? f(x) : x) || 0), 0);
export const isTyping = (el) => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
