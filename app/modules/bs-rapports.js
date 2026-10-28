/* Blackstart CRM : page « Rapports & analyses » (maquette d'albino, 27 octobre 2026). Remplace l'ancienne page Rapports.
 * Uniquement les vraies données du CRM : appels enregistrés sur les fiches (callLog), prospects (canal, secteur,
 * statut, signature, montants), relances planifiées, et pour les administrateurs les simulations IA de l'équipe.
 * Les recommandations sont calculées à partir de ces chiffres (meilleur secteur, meilleur créneau d'appel).
 */
(function () {
  'use strict';
  if (window.bsRapports) return;

  var EN = !!(window.bsLangue && window.bsLangue.langue === 'en');
  var MOIS = EN ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] : ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
  var MOIS_L = EN ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    : ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var C = { bleu: '#3b82f6', violet: '#8b5cf6', turquoise: '#2dd4bf', cyan: '#22d3ee', indigo: '#6366f1', rose: '#ec4899', gris: '#64748b' };
  var SOURCES = [C.bleu, C.violet, C.indigo, C.cyan, C.turquoise, C.rose, C.gris];
  var S = { mois: Number(lire('bs-rapports-mois')) || 6, menu: false, survol: -1, equipe: null };
  var racine = null, desabo = null, minuteur = 0;
  // Données de chaque graphique pour les chiffres clés du mode présentation (bs-anim lit data-bsc).
  var BSC = {};
  // Survol : colonnes de chaque graphique (TIPS), courbes des KPI, sources, lignes (pipeline, résultats) et jours.
  var TIPS = {}, KPIS = {}, SRC = [], ROWS = {}, REG = [];
  var animerApres = false;

  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* facultatif */ } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function deux(n) { return (n < 10 ? '0' : '') + n; }
  function jour(d) { return d.getFullYear() + '-' + deux(d.getMonth() + 1) + '-' + deux(d.getDate()); }
  function nb(n) { return Math.round(Number(n) || 0).toLocaleString(EN ? 'en-GB' : 'fr-FR').replace(/ /g, ' '); }
  function euros(n) { return EN ? '€' + nb(n) : nb(n) + ' €'; }
  function pc(n, d) { return Math.round((Number(n) || 0) * Math.pow(10, d || 0)) / Math.pow(10, d || 0); }
  function virgule(x) { return EN ? String(x) : String(x).replace('.', ','); }
  function signeE(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + euros(Math.abs(v)); }
  function dateLongue(d) { return d.toLocaleDateString(EN ? 'en-GB' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }); }
  function court(n) { n = Number(n) || 0; return n >= 1000 ? virgule(pc(n / 1000, n >= 10000 ? 0 : 1)) + (EN ? 'k' : ' k') : String(Math.round(n)); }

  var EXTRA = {
    'rap-haut': '<path d="M12 19V5M6 11l6-6 6 6"/>', 'rap-bas': '<path d="M12 5v14M6 13l6 6 6-6"/>', 'rap-fleche': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'rap-chevron': '<path d="M6 9l6 6 6-6"/>', 'rap-lecture': '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>', 'rap-pourcent': '<path d="M19 5L5 19M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM17.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>',
  };
  function ic(name, size) {
    var hs = window.__bsHs ? window.__bsHs() : null;
    var inner = EXTRA[name] || (window.bsIcones && window.bsIcones.svg(name)) || (hs && hs[name]) || '';
    return '<svg class="ic" width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }

  // ---------------------------------------------------------------- données
  function R() { return window.__bsStore || null; }
  function etat() { var r = R(); return r && r.get ? r.get() : {}; }
  function prospects() { return (etat().prospects || []).filter(function (p) { return p && !p.supprime; }); }
  function appels(ps) {
    var l = [];
    ps.forEach(function (p) { (p.callLog || []).forEach(function (c) { if (c && c.date) l.push({ p: p, d: String(c.date).slice(0, 10), h: c.time ? parseInt(c.time, 10) : null, o: c.outcome || '' }); }); });
    return l;
  }
  function periode() {
    var n = S.mois, d = new Date(), l = [];
    for (var i = n - 1; i >= 0; i--) { var x = new Date(d.getFullYear(), d.getMonth() - i, 1); l.push({ cle: x.getFullYear() + '-' + deux(x.getMonth() + 1), m: x.getMonth(), a: x.getFullYear() }); }
    return l;
  }
  // Chiffres par mois de la période : prospects contactés, appels, rendez-vous, clients, CA, CA cumulé, MRR.
  function mensuel() {
    var ps = prospects(), ap = appels(ps), mois = periode(), cum = 0;
    return mois.map(function (m) {
      var a = ap.filter(function (c) { return c.d.slice(0, 7) === m.cle; }), vus = {};
      a.forEach(function (c) { vus[c.p.id] = 1; });
      var contactes = Object.keys(vus).length, rdv = a.filter(function (c) { return c.o === 'rdv_pris'; }).length;
      var ca = ps.filter(function (p) { return p.signedAt && String(p.signedAt).slice(0, 7) === m.cle; }).reduce(function (s, p) { return s + (Number(p.dealValue) || 0); }, 0);
      var mrr = ps.filter(function (p) { return p.signedAt && String(p.signedAt).slice(0, 7) <= m.cle && p.statut !== 'resilie'; }).reduce(function (s, p) { return s + (Number(p.mrrValue) || 0); }, 0);
      cum += ca;
      return { cle: m.cle, label: MOIS[m.m], long: MOIS_L[m.m] + ' ' + m.a, contactes: contactes, appels: a.length, rdv: rdv, clients: a.filter(function (c) { return c.o === 'client_signe'; }).length,
        taux: contactes ? pc(rdv / contactes * 100, 1) : 0, ca: ca, cum: cum, mrr: mrr };
    });
  }
  function totaux(m) {
    var ps = prospects(), debut = m[0].cle, vus = {}, rdv = 0;
    appels(ps).forEach(function (c) { if (c.d.slice(0, 7) >= debut) { vus[c.p.id] = 1; if (c.o === 'rdv_pris') rdv++; } });
    var n = Object.keys(vus).length;
    return { contactes: n, rdv: rdv, taux: n ? pc(rdv / n * 100, 1) : 0, ca: m[m.length - 1].cum };
  }

  // ---------------------------------------------------------------- petits éléments
  function evolution(a, b, pts) {
    if (pts) { var d = pc(a - b, 1); return { v: (d >= 0 ? '+' : '') + virgule(d) + ' pts', bon: d >= 0 }; }
    if (!b) return a ? { v: EN ? 'new' : 'nouveau', bon: true } : null;
    var x = Math.round((a - b) / b * 100); return { v: (x >= 0 ? '+' : '') + x + ' %', bon: x >= 0 };
  }
  function puce(e) { return e ? '<span class="bsr-ev ' + (e.bon ? 'bon' : 'mal') + '">' + ic(e.bon ? 'rap-haut' : 'rap-bas', 13) + esc(e.v) + '</span>' : '<span class="bsr-ev nul">–</span>'; }
  function lisse(p) {
    if (!p.length) return '';
    var d = 'M' + p[0][0].toFixed(1) + ' ' + p[0][1].toFixed(1);
    for (var i = 1; i < p.length; i++) { var a = p[i - 1], b = p[i], cx = (a[0] + b[0]) / 2; d += ' C' + cx.toFixed(1) + ' ' + a[1].toFixed(1) + ' ' + cx.toFixed(1) + ' ' + b[1].toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1); }
    return d;
  }
  function etincelle(vals, couleur, id) {
    var W = 120, H = 46, max = Math.max.apply(null, vals.concat([1])), min = Math.min.apply(null, vals.concat([max]));
    var p = vals.map(function (v, i) { return [2 + i * (W - 4) / Math.max(1, vals.length - 1), 4 + (1 - (v - min) / Math.max(1, max - min)) * (H - 10)]; });
    var l = lisse(p), aire = l + ' L' + (W - 2) + ' ' + H + ' L2 ' + H + ' Z', fin = p[p.length - 1];
    return '<svg class="bsr-etin" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + couleur + '" stop-opacity=".45"/><stop offset="1" stop-color="' + couleur + '" stop-opacity="0"/></linearGradient></defs>' +
      '<path class="bsr-aire" d="' + aire + '" fill="url(#' + id + ')"/><path class="bsr-ligne" d="' + l + '" fill="none" stroke="' + couleur + '" stroke-width="2"/><circle class="bsr-pt" cx="' + fin[0].toFixed(1) + '" cy="' + fin[1].toFixed(1) + '" r="3" fill="' + couleur + '"/></svg>';
  }
  function graduation(max) { var p = Math.pow(10, Math.floor(Math.log10(Math.max(1, max)))), l = [1, 2, 2.5, 5, 10].map(function (k) { return k * p; }).filter(function (s) { return s * 4 >= max; }); return (l[0] || p * 10) * 4; }

  // ---------------------------------------------------------------- graphiques (dessinés à la largeur réelle)
  function grPerf(W, m) {
    var H = 250, G = 40, D = 40, B = 26, T = 12, ih = H - B - T, iw = W - G - D;
    var max = graduation(Math.max.apply(null, m.map(function (x) { return Math.max(x.contactes, x.rdv); }).concat([4])));
    var tmax = Math.max(20, Math.ceil(Math.max.apply(null, m.map(function (x) { return x.taux; }).concat([0])) / 5) * 5);
    var pas = iw / m.length, bw = Math.min(26, pas * 0.26), y = function (v) { return T + ih - v / max * ih; }, yt = function (v) { return T + ih - v / tmax * ih; };
    var s = '';
    for (var k = 0; k <= 4; k++) {
      var v = max / 4 * k, vt = tmax / 4 * k;
      s += '<line x1="' + G + '" x2="' + (W - D) + '" y1="' + y(v) + '" y2="' + y(v) + '" class="bsr-grille"/><text x="' + (G - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + nb(v) + '</text><text x="' + (W - D + 8) + '" y="' + (yt(vt) + 4) + '">' + Math.round(vt) + '%</text>';
    }
    var pts = [];
    m.forEach(function (x, i) {
      var cx = G + pas * i + pas / 2;
      s += '<rect class="bsr-barre" x="' + (cx - bw - 2) + '" y="' + y(x.contactes) + '" width="' + bw + '" height="' + (T + ih - y(x.contactes)) + '" rx="4" fill="url(#bsrB)"/>' +
        '<rect class="bsr-barre" x="' + (cx + 2) + '" y="' + y(x.rdv) + '" width="' + bw + '" height="' + (T + ih - y(x.rdv)) + '" rx="4" fill="url(#bsrV)"/>' +
        '<text x="' + cx + '" y="' + (H - 6) + '" text-anchor="middle">' + esc(x.label) + '</text>';
      pts.push([cx, yt(x.taux)]);
    });
    s += '<path class="bsr-ligne" d="' + lisse(pts) + '" fill="none" stroke="' + C.turquoise + '" stroke-width="2.2" filter="url(#bsrLueur)"/>' + pts.map(function (p, i) { return '<circle class="bsr-pt" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.5" fill="' + C.turquoise + '" stroke="#0b1027" stroke-width="1.5"/>'; }).join('');
    TIPS.perf = m.map(function (x, i) {
      var cx = G + pas * i + pas / 2;
      return { x0: G + pas * i, x1: G + pas * (i + 1), cx: cx, t: x.long, b: [T, ih], hl: [cx - pas / 2 + 4, pas - 8], p: [[cx, yt(x.taux), C.turquoise]],
        l: [[C.bleu, 'Prospects contactés', nb(x.contactes)], [C.violet, 'Rendez-vous obtenus', nb(x.rdv)], [C.turquoise, 'Taux de conversion', virgule(x.taux) + ' %'], ['', 'Appels passés', nb(x.appels)], ['', 'Clients signés', nb(x.clients)]] };
    });
    return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Prospects contactés, rendez-vous obtenus et taux de conversion par mois"><defs>' +
      '<linearGradient id="bsrB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#60a5fa"/><stop offset="1" stop-color="#1d4ed8"/></linearGradient>' +
      '<linearGradient id="bsrV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c084fc"/><stop offset="1" stop-color="#6d28d9"/></linearGradient>' +
      '<filter id="bsrLueur" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="2.5" result="f"/><feMerge><feMergeNode in="f"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' + s + '</svg>';
  }
  // Courbe en aire violette (maquette « Évolution du chiffre d'affaires ») : chiffre d'affaires cumulé ou MRR.
  function grAire(W, m, cle, id, label) {
    var H = 210, G = 58, B = 24, T = 12, ih = H - B - T, iw = W - G - 14, max = graduation(Math.max.apply(null, m.map(function (x) { return x[cle]; }).concat([cle === 'mrr' ? 100 : 1000])));
    var y = function (v) { return T + ih - v / max * ih; }, x = function (i) { return G + 6 + i * iw / Math.max(1, m.length - 1); }, s = '';
    for (var k = 0; k <= 5; k++) { var v = max / 5 * k; s += '<line x1="' + G + '" x2="' + (W - 6) + '" y1="' + y(v) + '" y2="' + y(v) + '" class="bsr-grille"/><text x="' + (G - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + esc(euros(v)) + '</text>'; }
    var p = m.map(function (d, i) { return [x(i), y(d[cle])]; }), l = lisse(p);
    s += '<path class="bsr-aire" d="' + l + ' L' + p[p.length - 1][0].toFixed(1) + ' ' + (T + ih) + ' L' + p[0][0].toFixed(1) + ' ' + (T + ih) + ' Z" fill="url(#' + id + ')"/>' +
      '<path class="bsr-ligne" d="' + l + '" fill="none" stroke="#a78bfa" stroke-width="2.4"/>' + p.map(function (q) { return '<circle class="bsr-pt" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="3.5" fill="#c4b5fd" stroke="#4c1d95" stroke-width="1.5"/>'; }).join('') +
      m.map(function (d, i) { return '<text x="' + x(i) + '" y="' + (H - 5) + '" text-anchor="middle">' + esc(d.label) + '</text>'; }).join('');
    TIPS[cle === 'mrr' ? 'mrr' : 'ca'] = m.map(function (d, i) {
      var a = i ? x(i - 1) : G, b = i < m.length - 1 ? x(i + 1) : W, prev = m[i - 1];
      var l = cle === 'mrr'
        ? [['#a78bfa', 'MRR', euros(d.mrr)], ['', 'ARR', euros(d.mrr * 12)], ['', 'Variation', prev ? signeE(d.mrr - prev.mrr) : '–']]
        : [['#a78bfa', 'Chiffre d’affaires du mois', euros(d.ca)], ['', 'Cumulé sur la période', euros(d.cum)], ['', 'Clients signés', nb(d.clients)]];
      return { x0: i ? (a + x(i)) / 2 : G, x1: i < m.length - 1 ? (b + x(i)) / 2 : W, cx: x(i), t: d.long, g: [T, ih], p: [[x(i), y(d[cle]), '#c4b5fd']], l: l };
    });
    return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(label) + '"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c3aed" stop-opacity=".55"/><stop offset="1" stop-color="#4f46e5" stop-opacity=".04"/></linearGradient></defs>' + s + '</svg>';
  }
  function grEquipe(W) {
    var d = S.equipe;
    TIPS.equipe = [];
    if (d === 'interdit') return '<p class="bsr-vide" data-pres-vide>Réservé aux administrateurs : les simulations IA de chaque membre.</p>';
    if (!d) return '<p class="bsr-vide" data-pres-vide>Chargement de l’équipe…</p>';
    var debut = new Date(); debut.setMonth(debut.getMonth() - S.mois + 1, 1); debut.setHours(0, 0, 0, 0);
    var l = d.membres.map(function (mb) {
      var s = d.simulations.filter(function (x) { return x.userId === mb.id && Date.parse(x.at) >= debut.getTime(); });
      return { m: mb, n: s.length, r: s.length ? Math.round(s.filter(function (x) { return x.note >= 70; }).length / s.length * 100) : 0,
        note: s.length ? Math.round(s.reduce(function (a, x) { return a + (Number(x.note) || 0); }, 0) / s.length) : 0 };
    }).filter(function (x) { return x.n; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 5);
    BSC.equipe = l.length ? { t: 'bar', s: ['Simulations IA'], d: l.map(function (x) { return { l: String(x.m.name || '?').trim().split(/\s+/)[0], v: [x.n], f: [String(x.n)] }; }) } : null;
    if (!l.length) return '<p class="bsr-vide" data-pres-vide>Les simulations IA de l’équipe apparaîtront ici (page Simulations IA).</p>';
    var H = 180, G = 30, D = 34, B = 8, T = 16, ih = H - B - T, iw = W - G - D, max = graduation(Math.max.apply(null, l.map(function (x) { return x.n; }).concat([4])));
    var pas = iw / l.length, bw = Math.min(22, pas * 0.26), y = function (v) { return T + ih - v / max * ih; }, yt = function (v) { return T + ih - v / 100 * ih; }, s = '';
    for (var k = 0; k <= 4; k++) s += '<line x1="' + G + '" x2="' + (W - D) + '" y1="' + y(max / 4 * k) + '" y2="' + y(max / 4 * k) + '" class="bsr-grille"/><text x="' + (G - 6) + '" y="' + (y(max / 4 * k) + 4) + '" text-anchor="end">' + Math.round(max / 4 * k) + '</text><text x="' + (W - D + 6) + '" y="' + (yt(25 * k) + 4) + '">' + 25 * k + '%</text>';
    TIPS.equipe = l.map(function (x, i) {
      return { x0: G + pas * i, x1: G + pas * (i + 1), cx: G + pas * i + pas / 2, t: x.m.name || '?', b: [T, ih], hl: [G + pas * i + 4, pas - 8],
        l: [[C.violet, 'Simulations IA', nb(x.n)], [C.turquoise, 'Taux de réussite', x.r + ' %'], ['', 'Note moyenne', x.note + '/100']] };
    });
    l.forEach(function (x, i) {
      var cx = G + pas * i + pas / 2;
      s += '<rect class="bsr-barre" x="' + (cx - bw - 2) + '" y="' + y(x.n) + '" width="' + bw + '" height="' + (T + ih - y(x.n)) + '" rx="3" fill="url(#bsrV2)"/><rect class="bsr-barre" x="' + (cx + 2) + '" y="' + yt(x.r) + '" width="' + bw + '" height="' + (T + ih - yt(x.r)) + '" rx="3" fill="url(#bsrT2)"/>' +
        '<text x="' + (cx - bw / 2 - 2) + '" y="' + (y(x.n) - 4) + '" text-anchor="middle" class="fort">' + x.n + '</text><text x="' + (cx + bw / 2 + 2) + '" y="' + (yt(x.r) - 4) + '" text-anchor="middle" class="fort">' + x.r + '%</text>';
    });
    return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Simulations et taux de réussite par membre"><defs>' +
      '<linearGradient id="bsrV2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a855f7"/><stop offset="1" stop-color="#6d28d9"/></linearGradient>' +
      '<linearGradient id="bsrT2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5eead4"/><stop offset="1" stop-color="#0d9488"/></linearGradient></defs>' + s + '</svg>' +
      '<div class="bsr-membres" style="padding:0 ' + D + 'px 0 ' + G + 'px">' + l.map(function (x) {
        var n = String(x.m.name || '?').trim().split(/\s+/), ini = ((n[0] || '?')[0] + (n[1] ? n[1][0] : '')).toUpperCase();
        return '<span><i style="--h:' + (Array.from(String(x.m.name)).reduce(function (h, c) { return (h * 31 + c.charCodeAt(0)) % 360; }, 0)) + '">' + (x.m.photo ? '<img src="' + esc(x.m.photo) + '" alt="">' : esc(ini)) + '</i>' + esc(n[0]) + '</span>';
      }).join('') + '</div>';
  }
  function grCreneaux(W) {
    var ap = appels(prospects()), l = [];
    TIPS.creneaux = [];
    for (var h = 8; h <= 18; h++) { var a = ap.filter(function (c) { return c.h === h; }); l.push({ h: h, n: a.length, v: a.length ? Math.round(a.filter(function (c) { return c.o && c.o !== 'injoignable'; }).length / a.length * 100) : 0 }); }
    BSC.creneaux = l.some(function (x) { return x.n; }) ? { t: 'bar', d: l.filter(function (x) { return x.n; }).map(function (x) { return { l: x.h + ' h', v: [x.v], f: [x.v + ' %'] }; }) } : null;
    if (!BSC.creneaux) return '<p class="bsr-vide" data-pres-vide>Les heures d’appel s’affichent dès que des appels sont enregistrés.</p>';
    var H = 196, G = 34, B = 22, T = 10, ih = H - B - T, iw = W - G - 4, pas = iw / l.length, bw = Math.min(26, pas * 0.62), y = function (v) { return T + ih - v / 40 * ih; }, max = Math.max(40, Math.ceil(Math.max.apply(null, l.map(function (x) { return x.v; })) / 10) * 10), s = '';
    y = function (v) { return T + ih - v / max * ih; };
    for (var k = 0; k <= 4; k++) s += '<line x1="' + G + '" x2="' + W + '" y1="' + y(max / 4 * k) + '" y2="' + y(max / 4 * k) + '" class="bsr-grille"/><text x="' + (G - 6) + '" y="' + (y(max / 4 * k) + 4) + '" text-anchor="end">' + Math.round(max / 4 * k) + '%</text>';
    l.forEach(function (x, i) {
      var cx = G + pas * i + pas / 2;
      s += '<rect class="bsr-barre" x="' + (cx - bw / 2) + '" y="' + y(x.v) + '" width="' + bw + '" height="' + (T + ih - y(x.v)) + '" rx="4" fill="url(#bsrC)"/>' +
        (x.h % 2 === 0 ? '<text x="' + cx + '" y="' + (H - 5) + '" text-anchor="middle">' + x.h + 'h</text>' : '');
      TIPS.creneaux.push({ x0: G + pas * i, x1: G + pas * (i + 1), cx: cx, t: x.h + ' h – ' + (x.h + 1) + ' h', b: [T, ih], hl: [cx - pas / 2 + 2, pas - 4],
        l: [['#60a5fa', 'Taux de réponse', x.v + ' %'], ['', 'Appels passés', nb(x.n)]] });
    });
    return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Taux de réponse par heure d’appel"><defs><linearGradient id="bsrC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#60a5fa"/><stop offset="1" stop-color="#4338ca"/></linearGradient></defs>' + s + '</svg>';
  }
  // ---------------------------------------------------------------- encarts
  function carteKpi(ic1, couleur, label, valeur, e, vals, id, fmt, mois) {
    KPIS[id] = { v: vals, f: fmt, c: couleur, l: label, m: mois };
    return '<section class="bsr-carte bsr-kpi" data-pres-kpi data-pres-anim data-kpi="' + id + '"><span class="bsr-kpi-ic" style="--c:' + couleur + '">' + ic1 + '</span><div class="bsr-kpi-t"><small>' + label + '</small><b data-pres-val>' + valeur + '</b>' +
      '<span>' + puce(e) + '<em>vs. mois précédent</em></span></div>' + etincelle(vals, couleur, id) + '</section>';
  }
  function sources() {
    var ps = prospects(), g = {}, signe = function (p) { return p.statut === 'client_signe' || p.statut === 'resilie'; };
    ps.forEach(function (p) { var k = String(p.canal || '').trim() || 'Autres', e = g[k] || (g[k] = { n: 0, c: 0 }); e.n++; if (signe(p)) e.c++; });
    var l = Object.keys(g).map(function (k) { return { l: k, n: g[k].n, c: g[k].c }; }).sort(function (a, b) { return b.n - a.n; });
    if (l.length > 5) { var reste = l.slice(4); l = l.slice(0, 4).concat([{ l: 'Autres', n: reste.reduce(function (s, x) { return s + x.n; }, 0), c: reste.reduce(function (s, x) { return s + x.c; }, 0) }]); }
    SRC = l.map(function (x, i) {
      return { t: x.l, l: [[SOURCES[i % SOURCES.length], 'Prospects', nb(x.n)], ['', 'Part', (ps.length ? Math.round(x.n / ps.length * 100) : 0) + ' %'], ['', 'Clients signés', nb(x.c)], ['', 'Taux de conversion', (x.n ? Math.round(x.c / x.n * 100) : 0) + ' %']] };
    });
    var tot = ps.length, R0 = 52, Cc = 2 * Math.PI * R0, off = 0;
    var anneau = '<svg viewBox="0 0 140 140" class="bsr-donut" aria-hidden="true"><circle cx="70" cy="70" r="' + R0 + '" fill="none" stroke="var(--border)" stroke-width="16"/>' + l.map(function (x, i) {
      var len = tot ? x.n / tot * Cc : 0, c = '<circle class="bsr-arc" data-src="' + i + '" cx="70" cy="70" r="' + R0 + '" fill="none" stroke="' + SOURCES[i % SOURCES.length] + '" stroke-width="16" stroke-dasharray="' + Math.max(0, len - 2).toFixed(2) + ' ' + Cc.toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 70 70)"/>';
      off += len; return c;
    }).join('') + '</svg>';
    return '<div class="bsr-tete" data-pres-skip>' + '<span class="bsr-tic">' + ic('target', 17) + '</span><div><h2 data-pres-t>Sources de conversion</h2><p data-pres-s>Origine des prospects</p></div></div>' +
      (tot ? '<div class="bsr-sources" data-pres-anim data-bsc="' + esc(JSON.stringify({ t: 'bar', d: l.map(function (x) { return { l: x.l, v: [x.n], f: [nb(x.n)] }; }) })) + '"><div class="bsr-donut-w">' + anneau + '<div><b>' + nb(tot) + '</b><span>prospects</span></div></div><ul>' + l.map(function (x, i) {
        return '<li data-src="' + i + '"><i style="background:' + SOURCES[i % SOURCES.length] + '"></i><span>' + esc(x.l) + '</span><b>' + Math.round(x.n / tot * 100) + '%</b><em>' + nb(x.n) + '</em></li>';
      }).join('') + '</ul></div>' : '<p class="bsr-vide" data-pres-vide>Ajoutez des prospects pour voir leur origine.</p>');
  }
  function activite() {
    var evs = window.bsCalendrier && window.bsCalendrier.evenements ? window.bsCalendrier.evenements() : [];
    var auj = jour(new Date()), maint = new Date().getHours() * 60 + new Date().getMinutes();
    var l = evs.filter(function (e) { return e.d === auj && e.min !== null; });
    var titre = 'Rendez-vous du jour';
    if (!l.length) { l = evs.filter(function (e) { return e.d > auj && e.min !== null; }); titre = 'Prochains rendez-vous'; }
    l = l.slice(0, 4);
    return '<div class="bsr-tete" data-pres-skip><span class="bsr-tic">' + ic('activity', 17) + '</span><div><h2 data-pres-t>Activité commerciale</h2><p data-pres-s>' + titre + '</p></div></div>' +
      (l.length ? '<ul class="bsr-act">' + l.map(function (e) {
        var etat = e.d === auj && maint >= e.min && maint < e.min + e.dur ? ['En cours', 'cours'] : e.d === auj && maint >= e.min + e.dur ? ['Passé', 'passe'] : ['À venir', 'venir'];
        return '<li><button type="button" data-ev="' + e.k + ':' + esc(e.id) + '"><span class="bsr-act-ic" style="--c:' + ({ blue: C.bleu, purple: C.violet, pink: C.rose, green: '#10b981', orange: '#f97316', amber: '#f59e0b', sky: '#0ea5e9' }[e.ton] || C.bleu) + '">' + ic(e.ic, 15) + '</span>' +
          '<time>' + (e.d === auj ? '' : '<small>' + esc(e.d.slice(8) + '/' + e.d.slice(5, 7)) + '</small>') + deux(Math.floor(e.min / 60)) + ':' + deux(e.min % 60) + '</time><span class="bsr-act-t"><b>' + esc(e.quoi || e.titre) + '</b><small>' + esc(e.qui || e.sous || '') + '</small></span>' +
          '<em class="' + etat[1] + '">' + etat[0] + '</em></button></li>';
      }).join('') + '</ul>' : '<p class="bsr-vide" data-pres-vide>Aucun rendez-vous planifié. Planifiez vos relances depuis le Calendrier.</p>');
  }
  function recommandations() {
    var ps = prospects(), recs = [];
    var avance = function (p) { return ['rdv_pris', 'audit_realise', 'proposition_envoyee', 'client_signe'].indexOf(p.statut) >= 0; };
    var tot = ps.length ? ps.filter(avance).length / ps.length * 100 : 0, g = {};
    ps.forEach(function (p) { var k = p.secteur || ''; if (!k) return; (g[k] = g[k] || []).push(p); });
    var best = Object.keys(g).filter(function (k) { return g[k].length >= 3; }).map(function (k) { return { k: k, n: g[k].length, t: g[k].filter(avance).length / g[k].length * 100 }; }).sort(function (a, b) { return b.t - a.t; })[0];
    if (best && best.t > tot) recs.push(['target', 'Ciblez davantage le secteur ' + best.k, 'Ce secteur présente un taux de conversion de ' + Math.round(best.t) + ' %, soit +' + Math.round(best.t - tot) + ' pts au-dessus de la moyenne.', 'Voir les prospects', '#/prospects']);
    var ap = appels(ps), heures = [];
    for (var h = 8; h <= 17; h++) { var a = ap.filter(function (c) { return c.h === h || c.h === h + 1; }); heures.push({ h: h, n: a.length, v: a.length ? a.filter(function (c) { return c.o && c.o !== 'injoignable'; }).length / a.length : 0 }); }
    var moy = ap.filter(function (c) { return c.h !== null; }), m0 = moy.length ? moy.filter(function (c) { return c.o && c.o !== 'injoignable'; }).length / moy.length : 0;
    var bh = heures.filter(function (x) { return x.n >= 3; }).sort(function (a, b) { return b.v - a.v; })[0];
    if (bh && m0 && bh.v > m0) recs.push(['clock', 'Privilégiez les appels entre ' + bh.h + 'h et ' + (bh.h + 2) + 'h', 'Ce créneau génère ' + Math.round((bh.v - m0) / m0 * 100) + ' % de réponses en plus que la moyenne.', 'Voir les horaires', '#creneaux']);
    while (recs.length < 2) recs.push(['sparkles', recs.length ? 'Enregistrez l’heure de vos appels' : 'Renseignez le secteur de vos prospects', 'Les recommandations se précisent à mesure que vos appels et vos fiches sont enregistrés dans le CRM.', 'Voir les prospects', '#/prospects']);
    return '<div class="bsr-reco-g"><span class="bsr-reco-logo">' + ic('sparkles', 26) + '</span><div><h2 data-pres-t>Recommandations IA</h2><p data-pres-s>Nos algorithmes analysent vos appels et vos prospects pour proposer des actions qui améliorent vos performances.</p></div></div>' +
      recs.slice(0, 2).map(function (r) {
        return '<div class="bsr-reco"><span class="bsr-tic">' + ic(r[0], 18) + '</span><div><b>' + esc(r[1]) + '</b><p>' + esc(r[2]) + '</p></div><a href="' + r[4] + '"' + (r[4] === '#creneaux' ? ' data-act="creneaux"' : '') + '>' + esc(r[3]) + ic('rap-fleche', 13) + '</a></div>';
      }).join('');
  }
  function pipeline() {
    var ps = prospects(), l = [['a_appeler', 'À appeler'], ['injoignable', 'Injoignable'], ['rdv_pris', 'RDV pris'], ['audit_realise', 'Audit réalisé'], ['proposition_envoyee', 'Proposition envoyée'], ['client_signe', 'Client actif'], ['perdu', 'Perdu / Refus']];
    var n0 = l.map(function (x) { return ps.filter(function (p) { return p.statut === x[0]; }).length; }), max = Math.max.apply(null, n0.concat([1]));
    var bsc = { t: 'bar', d: l.map(function (x, i) { return { l: x[1], v: [n0[i]], f: [nb(n0[i])] }; }) }, tot = ps.length;
    ROWS.pipe = l.map(function (x, i) {
      var val = ps.filter(function (p) { return p.statut === x[0]; }).reduce(function (s, p) { return s + (Number(p.dealValue) || 0); }, 0);
      return { t: x[1], l: [['#8b5cf6', 'Prospects', nb(n0[i])], ['', 'Part du pipeline', (tot ? Math.round(n0[i] / tot * 100) : 0) + ' %'], ['', 'Valeur des projets', euros(val)]] };
    });
    return '<div class="bsr-tete" data-pres-skip><span class="bsr-tic">' + ic('kanban', 17) + '</span><div><h2 data-pres-t>Répartition du pipeline</h2><p data-pres-s>Nombre de prospects par étape</p></div><a class="bsr-voir" href="#/pipeline">Voir le pipeline' + ic('rap-fleche', 13) + '</a></div><ul class="bsr-pipe" data-pres-anim data-bsc="' + esc(JSON.stringify(bsc)) + '">' + l.map(function (x, i) {
      var n = ps.filter(function (p) { return p.statut === x[0]; }).length;
      return '<li data-row="pipe:' + i + '"><span>' + esc(x[1]) + '</span><i><i style="width:' + (n / max * 100).toFixed(1) + '%"></i></i><b>' + nb(n) + '</b></li>';
    }).join('') + '</ul>';
  }

  // Issue de chaque appel de la période (le résultat choisi à la fin de l'appel sur la fiche).
  var ISSUES = [['injoignable', 'Injoignable', '#f97316'], ['rappel', 'À rappeler plus tard', '#3b82f6'], ['rdv_pris', 'RDV obtenu', '#0ea5e9'], ['audit_realise', 'Audit réalisé', '#8b5cf6'],
    ['proposition_envoyee', 'Proposition envoyée', '#6366f1'], ['client_signe', 'Client signé', '#10b981'], ['perdu', 'Perdu / Refus', '#64748b']];
  function resultats(m) {
    var debut = m[0].cle, a = appels(prospects()).filter(function (c) { return c.d.slice(0, 7) >= debut; }), tot = a.length;
    var l = ISSUES.map(function (x) { return { x: x, n: a.filter(function (c) { return c.o === x[0]; }).length }; }), max = Math.max.apply(null, l.map(function (r) { return r.n; }).concat([1]));
    ROWS.res = l.map(function (r) { return { t: r.x[1], l: [[r.x[2], 'Appels', nb(r.n)], ['', 'Part des appels', (tot ? Math.round(r.n / tot * 100) : 0) + ' %']] }; });
    var bsc = { t: 'bar', d: l.filter(function (r) { return r.n; }).map(function (r) { return { l: r.x[1], v: [r.n], f: [nb(r.n)] }; }) };
    return '<div class="bsr-tete" data-pres-skip><span class="bsr-tic">' + ic('phone', 17) + '</span><div><h2 data-pres-t>Résultats des appels</h2><p data-pres-s>Issue de chaque appel sur la période</p></div>' +
      '<span class="bsr-total"><b>' + nb(tot) + '</b><small>Appels</small></span></div>' +
      (tot ? '<ul class="bsr-pipe bsr-res" data-pres-anim data-bsc="' + esc(JSON.stringify(bsc)) + '">' + l.map(function (r, i) {
        return '<li data-row="res:' + i + '"><span>' + esc(r.x[1]) + '</span><i><i style="width:' + (r.n / max * 100).toFixed(1) + '%;background:' + r.x[2] + '"></i></i><b>' + nb(r.n) + '</b></li>';
      }).join('') + '</ul>' : '<p class="bsr-vide" data-pres-vide>Aucun appel enregistré sur la période.</p>');
  }
  // Régularité : appels par jour sur les 12 dernières semaines (lundi → dimanche), série en cours et records.
  function regularite() {
    var ap = appels(prospects()), par = {}, auj = new Date(); auj.setHours(0, 0, 0, 0);
    ap.forEach(function (c) { var e = par[c.d] || (par[c.d] = { n: 0, rdv: 0 }); e.n++; if (c.o === 'rdv_pris') e.rdv++; });
    var debut = new Date(auj); debut.setDate(debut.getDate() - (debut.getDay() + 6) % 7 - 77);
    var jours = [];
    for (var d = new Date(debut); d <= auj; d.setDate(d.getDate() + 1)) { var e = par[jour(d)] || { n: 0, rdv: 0 }; jours.push({ d: new Date(d), n: e.n, rdv: e.rdv }); }
    var max = Math.max.apply(null, jours.map(function (j) { return j.n; }).concat([1])), total = jours.reduce(function (s, j) { return s + j.n; }, 0);
    var actifs = jours.filter(function (j) { return j.n; }).length;
    // Série en cours : jours d'affilée avec au moins un appel, jusqu'à aujourd'hui (ou hier tant qu'aujourd'hui est vide).
    var serie = 0, k = jours.length - 1, record = 0, cours = 0;
    if (k >= 0 && !jours[k].n) k--;
    for (; k >= 0 && jours[k].n; k--) serie++;
    jours.forEach(function (j) { cours = j.n ? cours + 1 : 0; record = Math.max(record, cours); });
    var meilleur = jours.filter(function (j) { return j.n; }).sort(function (a, b) { return b.n - a.n || b.d - a.d; })[0];
    var sem = [0, 1, 2, 3, 4, 5, 6].map(function (w) {
      var l = jours.filter(function (j) { return (j.d.getDay() + 6) % 7 === w; });
      return { w: w, v: l.length ? l.reduce(function (s, j) { return s + j.n; }, 0) / l.length : 0, d: l[l.length - 1].d };
    }).sort(function (a, b) { return b.v - a.v; })[0];
    REG = jours.map(function (j) { return { t: dateLongue(j.d), l: [['#8b5cf6', 'Appels', nb(j.n)], ['#0ea5e9', 'Rendez-vous obtenus', nb(j.rdv)]] }; });
    var semaines = [];
    for (var w = 0; w < jours.length; w += 7) semaines.push(jours.slice(w, w + 7));
    var bsc = { t: 'bar', s: ['Appels'], d: semaines.map(function (l) { var n = l.reduce(function (s, j) { return s + j.n; }, 0); return { l: l[0].d.getDate() + ' ' + MOIS[l[0].d.getMonth()], v: [n], f: [nb(n)] }; }) };
    var moisL = semaines.map(function (l, i) { var mo = l[0].d.getMonth(); return '<span>' + (!i || semaines[i - 1][0].d.getMonth() !== mo ? esc(MOIS[mo]) : '') + '</span>'; }).join('');
    var jl = EN ? ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'] : ['Lun', '', 'Mer', '', 'Ven', '', 'Dim'];
    var tuile = function (label, val, sous) { return '<div class="bsr-reg-t"><small>' + label + '</small><b>' + val + '</b>' + (sous ? '<em>' + sous + '</em>' : '') + '</div>'; };
    return '<div class="bsr-tete" data-pres-skip><span class="bsr-tic">' + ic('calendar', 17) + '</span><div><h2 data-pres-t>Régularité</h2><p data-pres-s>Appels par jour · 12 dernières semaines</p></div></div>' +
      '<div class="bsr-reg" data-pres-anim data-bsc="' + esc(JSON.stringify(bsc)) + '"><div class="bsr-reg-carte"><div class="bsr-reg-m">' + moisL + '</div><div class="bsr-reg-c"><div class="bsr-reg-w">' + jl.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>' +
      '<div class="bsr-reg-g">' + jours.map(function (j, i) { return '<i class="bsr-cell n' + (j.n ? Math.max(1, Math.ceil(j.n / max * 4)) : 0) + '" data-j="' + i + '"></i>'; }).join('') + '</div></div>' +
      '<div class="bsr-reg-leg"><span>Moins</span><i class="bsr-cell n0"></i><i class="bsr-cell n1"></i><i class="bsr-cell n2"></i><i class="bsr-cell n3"></i><i class="bsr-cell n4"></i><span>Plus</span></div></div>' +
      '<div class="bsr-reg-s">' +
      tuile('Appels', nb(total), 'sur 12 semaines') +
      tuile('Jours actifs', actifs + '<span>/' + jours.length + '</span>', 'avec au moins un appel') +
      tuile('Série en cours', serie + '<span>' + (serie > 1 ? (EN ? ' days' : ' jours') : (EN ? ' day' : ' jour')) + '</span>', '<span>Record</span> ' + record) +
      tuile('Jour le plus actif', total ? esc(sem.d.toLocaleDateString(EN ? 'en-GB' : 'fr-FR', { weekday: 'long' })) : '–', meilleur ? '<span>Meilleur jour</span> ' + esc(meilleur.d.getDate() + ' ' + MOIS[meilleur.d.getMonth()].toLowerCase()) + ' · ' + meilleur.n : '') +
      '</div></div>';
  }

  // ---------------------------------------------------------------- survol
  // Une bulle commune à tous les graphiques : bande ou repère vertical, points mis en avant, puis titre et valeurs.
  var actif = null;
  function afficher(h, c) {
    var k = h.querySelector(':scope > .bsr-calque');
    if (!k) { k = document.createElement('div'); k.className = 'bsr-calque'; k.innerHTML = '<div class="bsr-hl"></div><div class="bsr-guide"></div><div class="bsr-pts"></div><div class="bsr-bulle"></div>'; h.appendChild(k); }
    var hl = k.children[0], gd = k.children[1], pts = k.children[2], bu = k.children[3], hx = c.hl || [c.x0, (c.x1 || 0) - (c.x0 || 0)];
    hl.style.cssText = c.b ? 'display:block;left:' + hx[0] + 'px;width:' + hx[1] + 'px;top:' + c.b[0] + 'px;height:' + c.b[1] + 'px' : 'display:none';
    gd.style.cssText = c.g ? 'display:block;left:' + c.cx + 'px;top:' + c.g[0] + 'px;height:' + c.g[1] + 'px' : 'display:none';
    pts.innerHTML = (c.p || []).map(function (q) { return '<i style="left:' + q[0].toFixed(1) + 'px;top:' + q[1].toFixed(1) + 'px;--c:' + q[2] + '"></i>'; }).join('');
    bu.innerHTML = '<b>' + esc(c.t) + '</b>' + c.l.map(function (x) { return '<span>' + (x[0] ? '<i style="background:' + x[0] + '"></i>' : '<i></i>') + esc(x[1]) + '<b>' + esc(x[2]) + '</b></span>'; }).join('');
    k.classList.add('on');
    var W = h.clientWidth, bw = bu.offsetWidth || 180;
    bu.style.left = Math.min(W - bw / 2 - 2, Math.max(bw / 2 + 2, c.cx)) + 'px';
    bu.style.top = (c.top != null ? c.top : 6) + 'px';
  }
  function poser(r) {
    if (actif) {
      if (!r || actif.h !== r.h) { var k = actif.h.querySelector(':scope > .bsr-calque'); if (k) k.classList.remove('on'); }
      (actif.on || []).forEach(function (x) { x.classList.remove('bsr-on'); });
    }
    actif = r;
    if (!r) return;
    afficher(r.h, r.c);
    (r.on || []).forEach(function (x) { x.classList.add('bsr-on'); });
  }
  function trouver(ev) {
    var t = ev.target; if (!t || !t.closest) return null;
    var j = t.closest('[data-j]');
    if (j && REG[+j.dataset.j]) return { h: j.parentNode, c: Object.assign({ cx: j.offsetLeft + j.offsetWidth / 2, top: j.offsetTop + j.offsetHeight + 8 }, REG[+j.dataset.j]), on: [j] };
    var s = t.closest('[data-src]');
    if (s && SRC[+s.dataset.src]) {
      var hs = s.closest('.bsr-sources'), rs = hs.getBoundingClientRect();
      return { h: hs, c: Object.assign({ cx: ev.clientX - rs.left, top: ev.clientY - rs.top + 16 }, SRC[+s.dataset.src]), on: Array.prototype.slice.call(hs.querySelectorAll('[data-src="' + s.dataset.src + '"]')) };
    }
    var row = t.closest('[data-row]');
    if (row) {
      var q = row.dataset.row.split(':'), x = ROWS[q[0]] && ROWS[q[0]][+q[1]];
      if (x) { var hu = row.parentNode, ru = hu.getBoundingClientRect(); return { h: hu, c: Object.assign({ cx: ev.clientX - ru.left, top: row.offsetTop + row.offsetHeight + 4 }, x), on: [row] }; }
    }
    var kc = t.closest('.bsr-kpi[data-kpi]'), et = kc && kc.querySelector('.bsr-etin'), K = kc && KPIS[kc.dataset.kpi];
    if (et && K && K.v.length) {
      var re = et.getBoundingClientRect(), rc = kc.getBoundingClientRect();
      if (ev.clientX >= re.left - 10 && ev.clientX <= re.right + 10 && ev.clientY >= re.top - 14 && ev.clientY <= re.bottom + 10) {
        var n = K.v.length, i = Math.max(0, Math.min(n - 1, Math.round((ev.clientX - re.left) / re.width * (n - 1)))), mx = Math.max.apply(null, K.v.concat([1])), mn = Math.min.apply(null, K.v.concat([mx]));
        var px = re.left - rc.left + (2 + i * 116 / Math.max(1, n - 1)) / 120 * re.width, py = re.top - rc.top + (4 + (1 - (K.v[i] - mn) / Math.max(1, mx - mn)) * 36) / 46 * re.height;
        return { h: kc, c: { cx: px, top: re.bottom - rc.top + 10, t: K.m[i], p: [[px, py, K.c]], l: [[K.c, K.l, K.f(K.v[i])]] } };
      }
    }
    var g = t.closest('[data-g]');
    if (g && TIPS[g.dataset.g]) {
      var rg = g.getBoundingClientRect(), x0 = ev.clientX - rg.left, c = TIPS[g.dataset.g].filter(function (z) { return x0 >= z.x0 && x0 < z.x1; })[0];
      if (c) return { h: g, c: c };
    }
    return null;
  }

  // ---------------------------------------------------------------- présentation animée
  // Apparition à l'arrivée sur la page et au changement de période : les cartes arrivent en cascade, les barres
  // poussent, les courbes se dessinent, l'anneau se remplit, les chiffres défilent. Les cartes plus bas s'animent
  // quand on les fait défiler. Le mode présentation (bs-anim) rejoue ces animations sur chaque diapositive.
  var EASE = 'cubic-bezier(.16,1,.3,1)', EASE_IO = 'cubic-bezier(.65,0,.35,1)', obs = null;
  function reduit() { return document.documentElement.getAttribute('data-motion') === 'reduced' || !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function an(el, frames, o) { if (!el || !el.animate) return; try { el.animate(frames, Object.assign({ fill: 'backwards', easing: EASE }, o)); } catch (e) { /* navigateur ancien */ } }
  function tracer(p, delai, duree) {
    var L = 0; try { L = p.getTotalLength(); } catch (e) { /* hors affichage */ }
    if (L) an(p, [{ strokeDasharray: L + ' ' + L, strokeDashoffset: L }, { strokeDasharray: L + ' ' + L, strokeDashoffset: 0 }], { duration: duree, delay: delai, easing: EASE_IO });
  }
  function animerGraph(g, b, lent) {
    var sl = lent ? 1.3 : 1, svg = g.querySelector('svg');
    if (svg) {
      svg.querySelectorAll('.bsr-grille').forEach(function (l, i) { an(l, [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: b + i * 40 }); });
      var barres = svg.querySelectorAll('.bsr-barre');
      barres.forEach(function (r, i) {
        r.style.transformBox = 'fill-box'; r.style.transformOrigin = '50% 100%';
        an(r, [{ transform: 'scaleY(0)', opacity: 0.4 }, { transform: 'scaleY(1.06)', opacity: 1, offset: 0.72 }, { transform: 'scaleY(1)', opacity: 1 }], { duration: 900 * sl, delay: b + 150 + Math.min(i, 24) * 40 });
      });
      var t0 = b + 150 + (barres.length ? Math.min(barres.length, 24) * 40 + 250 : 0), D = 1100 * sl;
      svg.querySelectorAll('.bsr-ligne').forEach(function (p) { tracer(p, t0, D); });
      svg.querySelectorAll('.bsr-aire').forEach(function (p) { an(p, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: D, delay: t0, easing: EASE_IO }); });
      var pts = svg.querySelectorAll('.bsr-pt');
      pts.forEach(function (c, i) {
        c.style.transformBox = 'fill-box'; c.style.transformOrigin = '50% 50%';
        an(c, [{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1.7)', opacity: 1, offset: 0.6 }, { transform: 'scale(1)', opacity: 1 }], { duration: 600, delay: t0 + D * (pts.length > 1 ? i / (pts.length - 1) : 1) - 80 });
      });
      svg.querySelectorAll('text.fort').forEach(function (t, i) { an(t, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: t0 + i * 30 }); });
      svg.querySelectorAll('.bsr-arc').forEach(function (c, i) {
        var da = (c.getAttribute('stroke-dasharray') || '').split(/[ ,]+/);
        if (da.length === 2) an(c, [{ strokeDasharray: '0 ' + da[1] }, { strokeDasharray: da.join(' ') }], { duration: 800 * sl, delay: b + 200 + i * 160 });
      });
    }
    g.querySelectorAll('.bsr-membres > span, .bsr-sources li').forEach(function (x, i) { an(x, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: b + 400 + i * 70 }); });
    g.querySelectorAll('.bsr-reg-g .bsr-cell').forEach(function (x, i) { an(x, [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: b + 120 + Math.floor(i / 7) * 45 + (i % 7) * 12 }); });
    g.querySelectorAll('.bsr-reg-t').forEach(function (x, i) { an(x, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: b + 300 + i * 90 }); });
    g.querySelectorAll('.bsr-pipe li > i > i').forEach(function (x, i) { x.style.transformOrigin = '0 50%'; an(x, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 900 * sl, delay: b + 150 + i * 80 }); });
    if (window.bsAnim && window.bsAnim.countUp) g.querySelectorAll('.bsr-donut-w b, .bsr-pipe li > b').forEach(function (x, i) { window.bsAnim.countUp(x, b + 200 + i * 60, 1000); });
  }
  function animerCarte(c, b) {
    an(c, [{ opacity: 0, transform: 'translateY(22px) scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: b });
    var cu = window.bsAnim && window.bsAnim.countUp;
    if (c.matches('.bsr-kpi')) { if (cu) cu(c.querySelector('[data-pres-val]'), b + 150, 1100); animerGraph(c, b + 150); }
    if (cu) c.querySelectorAll('.bsr-ca-t > b, .bsr-ca-t .bsr-badge').forEach(function (x) { cu(x, b + 150, 1200); });
    c.querySelectorAll('[data-pres-anim]').forEach(function (g) { animerGraph(g, b + 120); });
  }
  function animerPage() {
    if (!racine || reduit()) return;
    if (obs) obs.disconnect();
    var cartes = racine.querySelectorAll('.bsr-carte');
    if (!('IntersectionObserver' in window)) { cartes.forEach(function (c, i) { animerCarte(c, Math.min(i, 10) * 70); }); return; }
    var file = [], t = null;
    obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { obs.unobserve(e.target); file.push(e.target); } });
      if (file.length && !t) t = setTimeout(function () {
        t = null;
        var l = file.splice(0);
        l.sort(function (a, b) { var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return (ra.top - rb.top) || (ra.left - rb.left); });
        l.forEach(function (c, i) { animerCarte(c, Math.min(i, 10) * 80); });
      }, 30);
    }, { threshold: 0.12 });
    cartes.forEach(function (c) { obs.observe(c); });
  }
  // Diapositives du mode présentation : bs-anim envoie « bs:animer » sur les copies des graphiques.
  document.addEventListener('bs:animer', function (e) {
    var el = e.target, d = e.detail || {};
    if (!el || !el.closest || !el.closest('#bs-pres') || reduit()) return;
    animerGraph(el, d.delay || 0, d.slow);
  });

  // ---------------------------------------------------------------- page
  function libellePeriode() {
    var d = new Date(), a = new Date(d.getFullYear(), d.getMonth() - S.mois + 1, 1);
    var f = function (x, an) { return x.getDate() + ' ' + (EN ? MOIS[x.getMonth()] : MOIS_L[x.getMonth()].length > 5 ? MOIS[x.getMonth()].toLowerCase() : MOIS_L[x.getMonth()]) + (an ? ' ' + x.getFullYear() : ''); };
    return f(a, true) + ' → ' + f(d, true);
  }
  function dessiner() {
    if (!racine || !racine.isConnected) return;
    actif = null;
    var m = mensuel(), t = totaux(m), n = m.length, der = m[n - 1], av = m[n - 2] || { contactes: 0, rdv: 0, taux: 0, cum: 0, ca: 0, mrr: 0 };
    var eCA = evolution(der.cum, av.cum), mois = m.map(function (x) { return x.long; });
    racine.innerHTML = '<div class="bsr">' +
      '<header class="bsr-entete"><span class="bsr-logo">' + ic('chart-column', 24) + '</span><div><h1 data-pres-titre>Rapports &amp; analyses</h1><p data-pres-sous>Pilotez la performance commerciale avec des données fiables.</p></div>' +
      '<div class="bsr-actions"><div class="bsr-per"><button type="button" class="bsr-per-b" data-act="menu" aria-expanded="' + S.menu + '">' + ic('calendar', 16) + '<span>' + esc(libellePeriode()) + '</span>' + ic('rap-chevron', 14) + '</button>' +
      (S.menu ? '<div class="bsr-menu" role="menu">' + [3, 6, 12].map(function (k) { return '<button type="button" role="menuitem" data-mois="' + k + '" class="' + (k === S.mois ? 'on' : '') + '">' + k + ' derniers mois</button>'; }).join('') + '</div>' : '') + '</div>' +
      '<button type="button" class="bsr-per-b bsr-pres-b" data-act="presenter" title="Mode présentation : diaporama plein écran (touche P)">' + ic('rap-lecture', 15) + '<span>Présenter</span><kbd>P</kbd></button>' +
      '<button type="button" class="btn btn-primary bsr-export" data-act="export">' + ic('download', 16) + 'Exporter le rapport</button></div></header>' +
      '<div class="bsr-kpis">' +
      carteKpi(ic('users', 20), C.bleu, 'Prospects contactés', nb(t.contactes), evolution(der.contactes, av.contactes), m.map(function (x) { return x.contactes; }), 'bsrE1', nb, mois) +
      carteKpi(ic('calendar', 20), C.violet, 'Rendez-vous obtenus', nb(t.rdv), evolution(der.rdv, av.rdv), m.map(function (x) { return x.rdv; }), 'bsrE2', nb, mois) +
      carteKpi(ic('rap-pourcent', 20), C.turquoise, 'Taux de conversion', virgule(t.taux) + ' %', evolution(der.taux, av.taux, true), m.map(function (x) { return x.taux; }), 'bsrE3', function (v) { return virgule(v) + ' %'; }, mois) +
      carteKpi(ic('euro', 20), '#a78bfa', 'Revenus générés', esc(euros(t.ca)), eCA, m.map(function (x) { return x.cum; }), 'bsrE4', euros, mois) + '</div>' +
      '<div class="bsr-l1"><section class="bsr-carte" data-pres-carte><div class="bsr-tete" data-pres-skip><span class="bsr-tic">' + ic('chart-column', 17) + '</span><div><h2 data-pres-t>Performance commerciale</h2><p data-pres-s>Prospects contactés, rendez-vous obtenus et taux de conversion</p></div>' +
      '<div class="bsr-leg"><span><i style="background:' + C.bleu + '"></i>Prospects contactés</span><span><i style="background:' + C.violet + '"></i>Rendez-vous obtenus</span><span><i class="rond" style="background:' + C.turquoise + '"></i>Taux de conversion</span></div></div>' +
      '<div class="bsr-g" data-pres-anim data-g="perf"></div></section>' +
      '<section class="bsr-carte" data-pres-carte><div class="bsr-tete" data-pres-skip><span class="bsr-tic">' + ic('chart-line', 17) + '</span><div><h2 data-pres-t>Évolution du chiffre d’affaires</h2><p data-pres-s>Revenus générés par mois (cumulés)</p></div></div>' +
      '<div class="bsr-ca-t"><b>' + esc(euros(t.ca)) + '</b><span class="bsr-badge">' + esc(euros(der.cum)) + '</span></div><div class="bsr-ca-e">' + puce(eCA) + '<em>vs. mois précédent</em></div><div class="bsr-g" data-pres-anim data-g="ca"></div></section></div>' +
      '<div class="bsr-l2"><section class="bsr-carte bsr-src-carte" data-pres-carte>' + sources() + '</section>' +
      '<section class="bsr-carte" data-pres-carte><div class="bsr-tete" data-pres-skip><span class="bsr-tic">' + ic('users', 17) + '</span><div><h2 data-pres-t>Performance par équipe</h2><p data-pres-s>Simulations IA et taux de réussite par membre</p></div></div>' +
      '<div class="bsr-leg petit"><span><i style="background:' + C.violet + '"></i>Simulations</span><span><i style="background:' + C.turquoise + '"></i>Taux de réussite</span></div><div class="bsr-g" data-pres-anim data-g="equipe"></div></section>' +
      '<section class="bsr-carte">' + activite() + '</section>' +
      '<section class="bsr-carte" id="bsr-creneaux" data-pres-carte><div class="bsr-tete" data-pres-skip><span class="bsr-tic">' + ic('clock', 17) + '</span><div><h2 data-pres-t>Meilleurs créneaux d’appel</h2><p data-pres-s>Taux de réponse des prospects</p></div></div><div class="bsr-g" data-pres-anim data-g="creneaux"></div></section></div>' +
      '<section class="bsr-carte bsr-recos">' + recommandations() + '</section>' +
      '<div class="bsr-l3"><section class="bsr-carte" data-pres-carte><div class="bsr-tete" data-pres-skip><span class="bsr-tic">' + ic('trending-up', 17) + '</span><div><h2 data-pres-t>Revenu récurrent (MRR)</h2><p data-pres-s>Abonnements actifs en fin de mois</p></div></div>' +
      '<div class="bsr-ca-t"><b>' + esc(euros(der.mrr)) + '</b><span class="bsr-badge" title="Revenu récurrent annuel (MRR × 12)">ARR ' + esc(euros(der.mrr * 12)) + '</span></div><div class="bsr-ca-e">' + puce(evolution(der.mrr, av.mrr)) + '<em>vs. mois précédent</em></div><div class="bsr-g" data-pres-anim data-g="mrr"></div></section>' +
      '<section class="bsr-carte" data-pres-carte>' + pipeline() + '</section></div>' +
      '<div class="bsr-l4"><section class="bsr-carte" data-pres-carte>' + regularite() + '</section><section class="bsr-carte" data-pres-carte>' + resultats(m) + '</section></div>' +
      '<div class="bsn-root bsr-niche"></div></div>';
    graphiques(m);
    var ni = racine.querySelector('.bsr-niche'); if (ni && window.bsNiche) window.bsNiche.monter(ni);
    if (animerApres) { animerApres = false; animerPage(); }
  }
  var dernier = null;
  function graphiques(m) {
    if (!racine) return;
    m = m || mensuel(); dernier = m;
    var f = { perf: function (W) { return grPerf(W, m); }, ca: function (W) { return grAire(W, m, 'cum', 'bsrCA', 'Chiffre d’affaires cumulé par mois'); }, equipe: grEquipe, creneaux: grCreneaux, mrr: function (W) { return grAire(W, m, 'mrr', 'bsrMRR', 'Revenu récurrent mensuel'); } };
    var serie = function (cle, fmt) { return m.map(function (x) { return { l: x.label, v: [x[cle]], f: [fmt(x[cle])] }; }); };
    BSC.perf = { t: 'bar', s: ['Rendez-vous obtenus'], d: serie('rdv', nb) };
    BSC.ca = { t: 'bar', s: ['Chiffre d’affaires'], d: serie('ca', euros) };
    BSC.mrr = { t: 'line', d: serie('mrr', euros) };
    racine.querySelectorAll('[data-g]').forEach(function (el) {
      var W = Math.max(220, Math.floor(el.clientWidth));
      el.innerHTML = f[el.dataset.g](W);
      if (BSC[el.dataset.g]) el.setAttribute('data-bsc', JSON.stringify(BSC[el.dataset.g])); else el.removeAttribute('data-bsc');
    });
  }
  // L'équipe arrive après coup : seul son graphique est redessiné (les autres finissent leur animation).
  function equipe(animer) {
    var g = racine && racine.querySelector('[data-g=equipe]'); if (!g) return;
    g.innerHTML = grEquipe(Math.max(220, Math.floor(g.clientWidth)));
    if (BSC.equipe) g.setAttribute('data-bsc', JSON.stringify(BSC.equipe)); else g.removeAttribute('data-bsc');
    if (animer && !reduit()) animerGraph(g, 0);
  }
  function exporter() {
    var m = mensuel(), l = [['Mois', 'Prospects contactés', 'Appels', 'Rendez-vous obtenus', 'Taux de conversion (%)', 'Clients signés', 'CA nouveau (€)', 'CA cumulé (€)', 'MRR (€)']];
    m.forEach(function (x) { l.push([x.long, x.contactes, x.appels, x.rdv, x.taux, x.clients, x.ca, x.cum, x.mrr]); });
    var csv = '﻿' + l.map(function (r) { return r.map(function (c) { c = String(c); return /[;"\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(';'); }).join('\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'rapport-' + jour(new Date()) + '.csv';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  function ouvrir(type, extra) {
    var Y = window.__bsY; if (!Y || !Y.set) return;
    Y.set(function (s) { return { overlays: (s.overlays || []).concat([Object.assign({ key: 'bsr' + Date.now(), type: type }, extra || {})]) }; });
  }
  function chargerEquipe() {
    var u = window.BS_SERVER && window.BS_SERVER.user;
    if (!u || u.role !== 'admin') { S.equipe = 'interdit'; return; }
    fetch('/api/equipe/apercu', { credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart' } })
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(function (d) { S.equipe = d; equipe(true); })
      .catch(function () { S.equipe = 'interdit'; equipe(false); });
  }
  function brancher(el) {
    el.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-row^="pipe:"]')) { location.hash = '#/pipeline'; return; }
      var b = ev.target.closest('button,a'); if (!b || !el.contains(b) || b.closest('.bsr-niche')) { if (S.menu && !ev.target.closest('.bsr-per')) { S.menu = false; dessiner(); } return; }
      var d = b.dataset;
      if (d.act === 'menu') { S.menu = !S.menu; dessiner(); return; }
      if (d.mois) { S.mois = Number(d.mois); S.menu = false; ecrire('bs-rapports-mois', S.mois); animerApres = true; dessiner(); return; }
      if (d.act === 'presenter') { if (window.bsAnim && window.bsAnim.present) window.bsAnim.present(); return; }
      if (d.act === 'export') { exporter(); return; }
      if (d.act === 'creneaux') { ev.preventDefault(); var c = racine.querySelector('#bsr-creneaux'); if (c) { c.scrollIntoView({ behavior: 'smooth', block: 'center' }); c.classList.add('vu'); setTimeout(function () { c.classList.remove('vu'); }, 1600); } return; }
      if (d.ev) { var id = d.ev.slice(2); if (d.ev[0] === 'p') ouvrir('prospect', { id: id }); else ouvrir('taskForm', { id: id }); return; }
      if (S.menu && !b.closest('.bsr-per')) { S.menu = false; dessiner(); }
    });
    el.addEventListener('pointermove', function (ev) { poser(trouver(ev)); });
    el.addEventListener('pointerdown', function (ev) { if (ev.pointerType !== 'mouse') poser(trouver(ev)); });
    el.addEventListener('pointerleave', function () { poser(null); });
  }
  var surTaille = function () { clearTimeout(minuteur); minuteur = setTimeout(function () { if (racine && racine.isConnected) graphiques(dernier); else window.removeEventListener('resize', surTaille); }, 120); };

  function monter(el) {
    if (!el) return;
    css();
    if (racine !== el) { racine = el; brancher(el); }
    S.menu = false; S.survol = -1;
    animerApres = true;
    dessiner();
    if (S.equipe === null || typeof S.equipe === 'object') chargerEquipe();
    window.removeEventListener('resize', surTaille); window.addEventListener('resize', surTaille);
    if (desabo) { try { desabo(); } catch (e) { /* déjà fait */ } desabo = null; }
    var r = R();
    if (r && r.subscribe) {
      var avant = null, avantT = null;
      var sub = r.subscribe(function (s) {
        if (!racine || !racine.isConnected) { if (desabo) { desabo(); desabo = null; } return; }
        if (avant === s.prospects && avantT === s.tasks) return;
        avant = s.prospects; avantT = s.tasks; clearTimeout(minuteur); minuteur = setTimeout(dessiner, 200);
      });
      desabo = typeof sub === 'function' ? sub : null;
    }
  }

  var cssFait = false;
  function css() {
    if (cssFait) return; cssFait = true;
    var st = document.createElement('style'); st.id = 'bs-rapports-css';
    st.textContent = [
      '.bsr{display:flex;flex-direction:column;gap:16px}',
      '.bsr-entete{display:flex;align-items:center;gap:14px;flex-wrap:wrap}.bsr-entete>div:nth-child(2){flex:1;min-width:220px}',
      '.bsr-entete h1{margin:0;font-size:1.75em;font-weight:800;letter-spacing:-.02em;color:var(--text)}.bsr-entete p{margin:3px 0 0;color:var(--text-2);font-size:.95em}',
      '.bsr-logo{flex:none;display:grid;place-items:center;width:48px;height:48px;border-radius:14px;color:#c4b5fd;background:linear-gradient(145deg,rgba(124,58,237,.35),rgba(59,130,246,.18));border:1px solid rgba(139,92,246,.45);box-shadow:0 0 22px -6px rgba(139,92,246,.7)}',
      '.bsr-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.bsr-per{position:relative}',
      '.bsr-per-b,.bsr-pres-b{display:flex;align-items:center;gap:9px;font:inherit;font-size:.86em;color:var(--text);padding:9px 12px;border-radius:10px;border:1px solid var(--neon-line,var(--border));background:color-mix(in srgb,var(--surface) 80%,transparent);cursor:pointer}',
      '.bsr-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:30;min-width:180px;padding:6px;border-radius:12px;border:1px solid var(--neon-line,var(--border));background:var(--surface);box-shadow:var(--shadow-lg,0 20px 40px -12px rgba(0,0,0,.6))}',
      '.bsr-menu button{display:block;width:100%;text-align:left;font:inherit;font-size:.86em;padding:8px 10px;border-radius:8px;border:0;background:none;color:var(--text);cursor:pointer}.bsr-menu button:hover,.bsr-menu button.on{background:var(--surface-2)}.bsr-menu button.on{color:#a78bfa;font-weight:600}',
      '.bsr-export{display:inline-flex;align-items:center;gap:8px}',
      '.bsr-carte{position:relative;min-width:0;padding:16px 18px;border-radius:16px;border:1px solid var(--neon-line,var(--border));background:color-mix(in srgb,var(--surface) 82%,transparent);box-shadow:var(--shadow-sm)}',
      '.bsr-carte.vu{box-shadow:0 0 0 2px #8b5cf6,0 0 30px -6px #8b5cf6}',
      '.bsr-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}',
      '.bsr-kpi{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr);align-items:start;gap:14px;padding:18px 18px 16px;min-height:118px}.bsr-kpi-ic{align-self:center}',
      '.bsr-kpi-ic{display:grid;place-items:center;width:46px;height:46px;border-radius:12px;color:#fff;background:linear-gradient(145deg,color-mix(in srgb,var(--c) 75%,#fff 0%),color-mix(in srgb,var(--c) 55%,#0b1027));box-shadow:0 8px 22px -10px var(--c)}',
      '.bsr-kpi-t{min-width:0}.bsr-kpi-t small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:.84em;font-weight:600;color:var(--text)}.bsr-kpi-t>b{display:block;font-size:1.75em;font-weight:800;letter-spacing:-.02em;color:var(--text);white-space:nowrap;margin:2px 0}',
      '.bsr-kpi-t>span{display:flex;flex-direction:column;align-items:flex-start;gap:3px}.bsr-kpi-t em,.bsr-ca-e em{font-style:normal;font-size:.72em;color:var(--text-3)}',
      '.bsr-etin{position:absolute;right:14px;bottom:16px;width:33%;max-width:116px;height:36px}',
      '.bsr-ev{display:inline-flex;align-items:center;gap:2px;font-size:.8em;font-weight:700;white-space:nowrap}.bsr-ev.bon{color:#22c55e}.bsr-ev.mal{color:#f43f5e}.bsr-ev.nul{color:var(--text-3)}',
      '.bsr-l1{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:14px}',
      '.bsr-l2{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}',
      '.bsr-l3{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px}',
      '.bsr-tete{display:flex;align-items:flex-start;gap:11px;margin-bottom:12px}.bsr-tete>div{flex:1;min-width:0}',
      '.bsr-tete h2{margin:0;font-size:.98em;font-weight:700;color:var(--text)}.bsr-tete p{margin:2px 0 0;font-size:.76em;color:var(--text-3)}',
      '.bsr-tic{flex:none;display:grid;place-items:center;width:34px;height:34px;border-radius:10px;color:#a5b4fc;background:color-mix(in srgb,#6366f1 16%,transparent);border:1px solid rgba(99,102,241,.35)}',
      '.bsr-leg{display:flex;gap:14px;flex-wrap:wrap;font-size:.76em;color:var(--text-2)}.bsr-leg span{display:inline-flex;align-items:center;gap:6px}.bsr-leg i{width:10px;height:10px;border-radius:3px}.bsr-leg i.rond{border-radius:50%}',
      '.bsr-leg.petit{margin:-4px 0 6px;justify-content:flex-end}',
      '.bsr-g{position:relative;min-width:0}.bsr-g svg{display:block;overflow:visible}.bsr-g text{font-size:10.5px;fill:var(--text-3)}.bsr-g text.fort{fill:var(--text);font-weight:700;font-size:10px}',
      '.bsr-grille{stroke:var(--border);stroke-dasharray:3 4}.bsr-survol{fill:color-mix(in srgb,#8b5cf6 12%,transparent)}',
      '.bsr-bulle{position:absolute;top:6px;transform:translateX(-50%);min-width:180px;padding:10px 12px;border-radius:12px;border:1px solid var(--neon-line,var(--border));background:color-mix(in srgb,var(--surface) 94%,transparent);box-shadow:0 18px 36px -14px rgba(0,0,0,.7);pointer-events:none;font-size:.74em;color:var(--text-2)}',
      '.bsr-bulle>b{display:block;font-size:1.1em;color:var(--text);margin-bottom:6px}.bsr-bulle>b::first-letter{text-transform:uppercase}.bsr-bulle span{display:flex;align-items:center;gap:7px;margin-top:3px}.bsr-bulle span b{margin-left:auto;padding-left:14px;color:var(--text)}.bsr-bulle i{flex:none;width:8px;height:8px;border-radius:50%}',
      '.bsr-calque{position:absolute;inset:0;z-index:6;pointer-events:none;opacity:0;transition:opacity .14s}.bsr-calque.on{opacity:1}.bsr-calque .bsr-bulle{top:6px;white-space:nowrap;z-index:2}',
      '.bsr-hl{position:absolute;border-radius:8px;background:color-mix(in srgb,#8b5cf6 13%,transparent)}.bsr-guide{position:absolute;width:0;border-left:1px dashed color-mix(in srgb,#a78bfa 75%,transparent)}',
      '.bsr-pts i{position:absolute;width:11px;height:11px;margin:-5.5px 0 0 -5.5px;border-radius:50%;background:var(--c);border:2px solid #0b1027;box-shadow:0 0 0 4px color-mix(in srgb,var(--c) 28%,transparent),0 0 16px var(--c)}',
      '.bsr-arc{transition:stroke-width .15s;cursor:pointer}.bsr-arc.bsr-on{stroke-width:21}.bsr-sources{position:relative}.bsr-sources li,.bsr-pipe li{border-radius:8px;padding:2px 4px;margin:0 -4px;transition:background .15s}.bsr-sources li.bsr-on,.bsr-pipe li.bsr-on{background:var(--surface-2)}',
      '.bsr-pipe{position:relative}.bsr-pipe li[data-row^="pipe:"]{cursor:pointer}',
      '.bsr-l4{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr);gap:14px}',
      '.bsr-total{display:flex;flex-direction:column;align-items:flex-end;line-height:1.1}.bsr-total b{font-size:1.3em;font-weight:800;color:var(--text)}.bsr-total small{font-size:.72em;color:var(--text-3)}',
      '.bsr-res li{grid-template-columns:150px minmax(0,1fr) 40px}',
      '.bsr-reg{display:flex;align-items:flex-start;gap:22px;flex-wrap:wrap}.bsr-reg-carte{flex:none}',
      '.bsr-reg-m{display:grid;grid-auto-flow:column;grid-auto-columns:18px;gap:4px;margin:0 0 5px 34px;height:14px;font-size:10px;color:var(--text-3)}.bsr-reg-m span{white-space:nowrap;overflow:visible}',
      '.bsr-reg-c{display:flex;gap:6px}.bsr-reg-w{display:grid;grid-template-rows:repeat(7,18px);gap:4px;width:28px;font-size:10px;color:var(--text-3);align-items:center}',
      '.bsr-reg-g{position:relative;display:grid;grid-template-rows:repeat(7,18px);grid-auto-flow:column;grid-auto-columns:18px;gap:4px}',
      '.bsr-cell{display:block;width:18px;height:18px;border-radius:5px;background:color-mix(in srgb,var(--text) 7%,transparent);transition:transform .12s}',
      '.bsr-cell.n1{background:rgba(139,92,246,.3)}.bsr-cell.n2{background:rgba(139,92,246,.52)}.bsr-cell.n3{background:rgba(139,92,246,.76)}.bsr-cell.n4{background:#a78bfa;box-shadow:0 0 10px -2px #8b5cf6}',
      '.bsr-reg-g .bsr-cell{cursor:pointer}.bsr-reg-g .bsr-cell.bsr-on{transform:scale(1.25);outline:2px solid #c4b5fd;outline-offset:1px}',
      '.bsr-reg-leg{display:flex;align-items:center;gap:4px;margin:10px 0 0 34px;font-size:10px;color:var(--text-3)}.bsr-reg-leg .bsr-cell{width:12px;height:12px;border-radius:3px}.bsr-reg-leg span{margin:0 4px}',
      '.bsr-reg-s{flex:1;min-width:220px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
      '.bsr-reg-t{padding:12px 14px;border-radius:12px;border:1px solid var(--neon-line,var(--border));background:color-mix(in srgb,var(--surface-2) 45%,transparent);min-width:0}',
      '.bsr-reg-t small{display:block;font-size:.74em;color:var(--text-3)}.bsr-reg-t b{display:block;margin:3px 0 2px;font-size:1.45em;font-weight:800;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bsr-reg-t b::first-letter{text-transform:uppercase}.bsr-reg-t b span{font-size:.6em;font-weight:600;color:var(--text-3)}',
      '.bsr-reg-t em{display:block;font-style:normal;font-size:.72em;color:var(--text-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bsr-ca-t{display:flex;align-items:center;justify-content:space-between;gap:10px}.bsr-ca-t>b{font-size:2em;font-weight:800;letter-spacing:-.02em;color:var(--text)}',
      '.bsr-badge{font-size:.8em;font-weight:700;padding:5px 10px;border-radius:9px;color:#e9d5ff;background:color-mix(in srgb,#7c3aed 30%,transparent);border:1px solid rgba(167,139,250,.5)}',
      '.bsr-ca-e{display:flex;align-items:center;gap:6px;margin:2px 0 8px}',
      '.bsr-sources{display:flex;align-items:center;gap:14px}.bsr-donut-w{position:relative;width:128px;flex:none}.bsr-donut{width:100%;display:block}',
      '.bsr-donut-w>div{position:absolute;inset:0;pointer-events:none;display:flex;flex-direction:column;align-items:center;justify-content:center}.bsr-donut-w b{font-size:1.4em;font-weight:800;color:var(--text)}.bsr-donut-w span{font-size:.72em;color:var(--text-3)}',
      '.bsr-sources ul{list-style:none;margin:0;padding:0;flex:1;min-width:0;display:grid;gap:9px}',
      '.bsr-src-carte{container-type:inline-size}@container (max-width:380px){.bsr-sources{flex-direction:column;align-items:stretch}.bsr-donut-w{margin:4px auto 8px;width:136px}}.bsr-sources li{display:grid;grid-template-columns:10px minmax(0,1fr) auto 28px;align-items:center;gap:8px;font-size:.8em;color:var(--text)}.bsr-sources li i{width:9px;height:9px;border-radius:50%}',
      '.bsr-sources li span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bsr-sources li em{font-style:normal;color:var(--text-3);text-align:right}',
      '.bsr-membres{display:flex;justify-content:space-around;margin-top:6px}.bsr-membres span{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:.72em;color:var(--text-2);min-width:0}',
      '.bsr-membres i{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;overflow:hidden;font-style:normal;font-size:.9em;font-weight:700;color:#fff;background:hsl(var(--h) 55% 45%)}.bsr-membres img{width:100%;height:100%;object-fit:cover}',
      '.bsr-act{list-style:none;margin:0;padding:0;display:grid;gap:6px}',
      '.bsr-act button{width:100%;display:grid;grid-template-columns:32px 44px minmax(0,1fr) auto;align-items:center;gap:9px;font:inherit;text-align:left;padding:7px 6px;border-radius:10px;border:0;background:none;color:var(--text);cursor:pointer}.bsr-act button:hover{background:var(--surface-2)}',
      '.bsr-act-ic{display:grid;place-items:center;width:32px;height:32px;border-radius:9px;color:#fff;background:linear-gradient(145deg,var(--c),color-mix(in srgb,var(--c) 55%,#0b1027))}',
      '.bsr-act time{font-size:.8em;font-weight:700;display:flex;flex-direction:column}.bsr-act time small{font-size:.8em;font-weight:500;color:var(--text-3)}',
      '.bsr-act-t{min-width:0;display:flex;flex-direction:column}.bsr-act-t b{font-size:.8em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bsr-act-t small{font-size:.72em;color:var(--neon,var(--accent));white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bsr-act em{font-style:normal;font-size:.7em;font-weight:600;padding:4px 9px;border-radius:8px;border:1px solid var(--neon-line,var(--border));color:var(--text-2);white-space:nowrap}',
      '.bsr-act em.cours{color:#93c5fd;border-color:rgba(59,130,246,.5);background:rgba(59,130,246,.14)}.bsr-act em.passe{opacity:.6}',
      '.bsr-vide{margin:8px 0;font-size:.82em;color:var(--text-3);line-height:1.5}',
      '.bsr-recos{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:stretch}',
      '.bsr-reco-g{display:flex;gap:14px;align-items:center}.bsr-reco-g h2{margin:0 0 4px;font-size:1.05em;font-weight:800;color:var(--text)}.bsr-reco-g p{margin:0;font-size:.8em;line-height:1.5;color:var(--text-2)}',
      '.bsr-reco-logo{flex:none;display:grid;place-items:center;width:56px;height:56px;border-radius:16px;color:#fff;background:linear-gradient(145deg,#4f46e5,#7c3aed);box-shadow:0 0 26px -6px rgba(124,58,237,.9)}',
      '.bsr-reco{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 12px;padding:14px;border-radius:14px;border:1px solid var(--neon-line,var(--border));background:color-mix(in srgb,var(--surface-2) 45%,transparent)}',
      '.bsr-reco b{font-size:.86em;color:var(--text)}.bsr-reco p{margin:4px 0 0;font-size:.76em;line-height:1.45;color:var(--text-2)}',
      '.bsr-reco a{grid-column:2;justify-self:end;display:inline-flex;align-items:center;gap:5px;margin-top:8px;font-size:.76em;font-weight:600;color:var(--text);text-decoration:none;padding:6px 11px;border-radius:9px;border:1px solid var(--neon-line,var(--border))}.bsr-reco a:hover{border-color:#8b5cf6;color:#c4b5fd}',
      '.bsr-mrr{font-size:1.25em;font-weight:800;color:var(--text);white-space:nowrap}.bsr-voir{font-size:.76em;color:#a78bfa;text-decoration:none;display:inline-flex;align-items:center;gap:4px;white-space:nowrap}',
      '.bsr-pipe{list-style:none;margin:0;padding:0;display:grid;gap:9px}.bsr-pipe li{display:grid;grid-template-columns:150px minmax(0,1fr) 40px;align-items:center;gap:10px;font-size:.8em;color:var(--text)}',
      '.bsr-pipe li>i{height:8px;border-radius:9px;background:var(--border);overflow:hidden}.bsr-pipe li>i>i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#3b82f6,#8b5cf6)}.bsr-pipe b{text-align:right}',
      '@media (max-width:1400px){.bsr-l2{grid-template-columns:repeat(2,minmax(0,1fr))}}',
      '@media (max-width:1100px){.bsr-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.bsr-l1,.bsr-l3,.bsr-l4{grid-template-columns:minmax(0,1fr)}.bsr-recos{grid-template-columns:minmax(0,1fr)}}',
      '@media (max-width:640px){.bsr-kpis,.bsr-l2{grid-template-columns:minmax(0,1fr)}.bsr-leg{gap:8px}.bsr-pipe li{grid-template-columns:110px minmax(0,1fr) 34px}.bsr-reg-carte{overflow-x:auto;max-width:100%}.bsr-sources{flex-direction:column}}',
    ].join('\n');
    document.head.appendChild(st);
  }

  window.bsRapports = { monter: monter, mensuel: mensuel, animer: animerPage };
})();
