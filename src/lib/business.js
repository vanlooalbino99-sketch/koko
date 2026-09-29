// Règles métier : totaux devis/factures, numérotation, statistiques commerciales.
import { CLOSED_STATUTS } from './constants.js';
import { today, inPeriod, lastMonths, monthKey, pct, sum, addDays, parseKey, daysBetween } from './util.js';

/* ---------- Devis & factures ---------- */
export function totals(lignes, remise = 0) {
  const byRate = {};
  let brut = 0;
  (lignes || []).forEach((l) => {
    const q = Number(l.quantite) || 0;
    const pu = Number(l.prixUnitaire) || 0;
    const t = Number(l.tva) || 0;
    const ht = q * pu;
    brut += ht;
    byRate[t] = (byRate[t] || 0) + ht;
  });
  const r = Math.min(100, Math.max(0, Number(remise) || 0)) / 100;
  const remiseMontant = brut * r;
  let totalTVA = 0;
  const tvaDetail = Object.entries(byRate)
    .map(([taux, base]) => {
      const b = base * (1 - r);
      const m = b * (Number(taux) / 100);
      totalTVA += m;
      return { taux: Number(taux), baseHT: b, montant: m };
    })
    .sort((a, b) => a.taux - b.taux);
  const totalHT = brut - remiseMontant;
  return { brutHT: brut, remiseMontant, totalHT, totalTVA, totalTTC: totalHT + totalTVA, tvaDetail };
}

export function nextNumero(list, prefix) {
  const p = `${prefix}-${new Date().getFullYear()}-`;
  const nums = (list || [])
    .map((d) => d.numero || '')
    .filter((n) => n.startsWith(p))
    .map((n) => parseInt(n.slice(p.length), 10))
    .filter((n) => !isNaN(n));
  return `${p}${String((nums.length ? Math.max(...nums) : 0) + 1).padStart(3, '0')}`;
}

export const isDevisExpired = (d) => d.statut === 'envoye' && d.dateValidite && d.dateValidite < today();
export const isFactureLate = (f) => f.statut === 'a_payer' && f.dateEcheance && f.dateEcheance < today();

/* ---------- Relances ---------- */
export const isOpen = (p) => !CLOSED_STATUTS.includes(p.statut);
export function dueQueue(prospects) {
  const t = today();
  return prospects
    .filter((p) => p.prochaineRelance && p.prochaineRelance <= t && isOpen(p))
    .sort((a, b) => (a.prochaineRelance + (a.prochaineRelanceHeure || '99')).localeCompare(b.prochaineRelance + (b.prochaineRelanceHeure || '99')));
}
export const overdueCount = (prospects) => prospects.filter((p) => p.prochaineRelance && p.prochaineRelance < today() && isOpen(p)).length;
export function relancesByDate(prospects) {
  const map = {};
  prospects.forEach((p) => {
    if (!p.prochaineRelance || !isOpen(p)) return;
    (map[p.prochaineRelance] = map[p.prochaineRelance] || []).push(p);
  });
  Object.values(map).forEach((l) => l.sort((a, b) => (a.prochaineRelanceHeure || '99').localeCompare(b.prochaineRelanceHeure || '99')));
  return map;
}

/* ---------- Statistiques d'appels (mêmes définitions que la v3) ---------- */
export function allCalls(prospects) {
  const out = [];
  prospects.forEach((p) => (p.callLog || []).forEach((c) => out.push({ ...c, prospectId: p.id, entreprise: p.entreprise })));
  return out;
}
export function callStats(prospects, period) {
  const calls = allCalls(prospects).filter((c) => inPeriod(c.date, period));
  const appels = calls.length;
  const injoignables = calls.filter((c) => c.outcome === 'injoignable').length;
  return {
    appels,
    contactsJoints: appels - injoignables,
    rdv: calls.filter((c) => c.outcome === 'rdv_pris').length,
    audits: calls.filter((c) => c.outcome === 'audit_realise').length,
    propositions: calls.filter((c) => c.outcome === 'proposition_envoyee').length,
    clients: calls.filter((c) => c.outcome === 'client_signe').length,
    duree: sum(calls, (c) => c.duration),
  };
}

export function revenueStats(prospects) {
  const actifs = prospects.filter((p) => p.statut === 'client_signe');
  const mrr = sum(actifs, (p) => p.mrrValue);
  const caMonth = sum(prospects.filter((p) => p.signedAt && inPeriod(p.signedAt, 'month')), (p) => p.dealValue);
  const everSigned = prospects.filter((p) => p.signedAt).length;
  const churned = prospects.filter((p) => p.statut === 'resilie').length;
  return { actifs, activeCount: actifs.length, mrr, caMonth, churned, churnRate: pct(churned, everSigned), everSigned, arr: mrr * 12 };
}

export function monthlySeries(prospects, n = 6) {
  const calls = allCalls(prospects);
  return lastMonths(n).map((m) => {
    const mc = calls.filter((c) => monthKey(c.date) === m.key);
    return {
      key: m.key,
      label: m.label,
      appels: mc.length,
      rdv: mc.filter((c) => c.outcome === 'rdv_pris').length,
      clients: mc.filter((c) => c.outcome === 'client_signe').length,
      ca: sum(prospects.filter((p) => p.signedAt && monthKey(p.signedAt) === m.key), (p) => p.dealValue),
      mrr: sum(prospects.filter((p) => p.signedAt && monthKey(p.signedAt) <= m.key && p.statut !== 'resilie'), (p) => p.mrrValue),
    };
  });
}

export function dailyCalls(prospects, days = 14) {
  const calls = allCalls(prospects);
  const t = today();
  return Array.from({ length: days }, (_, i) => {
    const k = addDays(t, i - days + 1);
    const d = parseKey(k);
    return {
      key: k,
      label: d.toLocaleDateString('fr-FR', { weekday: 'narrow' }) + d.getDate(),
      short: String(d.getDate()),
      value: calls.filter((c) => c.date === k).length,
    };
  });
}

export function funnel(stats) {
  return [
    { label: 'Appels', value: stats.appels },
    { label: 'Contacts joints', value: stats.contactsJoints },
    { label: 'RDV obtenus', value: stats.rdv },
    { label: 'Audits', value: stats.audits },
    { label: 'Clients signés', value: stats.clients },
  ];
}

export function groupSum(list, keyFn, valFn) {
  const map = {};
  list.forEach((x) => {
    const k = keyFn(x) || 'Autre';
    map[k] = (map[k] || 0) + (valFn ? Number(valFn(x)) || 0 : 1);
  });
  return Object.entries(map)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function pipelineValue(prospects) {
  return sum(prospects.filter((p) => isOpen(p) && p.statut !== 'injoignable'), (p) => (Number(p.dealValue) || 0) + (Number(p.mrrValue) || 0) * 12);
}

export function streak(prospects) {
  // Nombre de jours ouvrés consécutifs avec au moins un appel (jusqu'à aujourd'hui ou hier).
  const days = new Set(allCalls(prospects).map((c) => c.date));
  let n = 0;
  let k = today();
  if (!days.has(k)) k = addDays(k, -1);
  for (let i = 0; i < 365; i++) {
    const d = parseKey(k).getDay();
    if (d === 0 || d === 6) {
      k = addDays(k, -1);
      continue;
    }
    if (!days.has(k)) break;
    n++;
    k = addDays(k, -1);
  }
  return n;
}

export const ancienneteJours = (p) => (p.signedAt ? Math.max(0, daysBetween(p.signedAt, today())) : 0);
