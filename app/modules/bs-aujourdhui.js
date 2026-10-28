/* Blackstart CRM : page « Aujourd'hui ».
 *
 * - En-tête : bonjour, date du jour.
 * - 4 chiffres du jour comparés à hier : nouveaux prospects, messages envoyés (appels + e-mails), réponses reçues
 *   (appels où le contact a décroché), rendez-vous planifiés.
 * - Mes prospects : onglets par étape, recherche, filtres, score IA, dernière action, e-mail, appel, fiche ;
 *   cases à cocher pour enchaîner les appels de la sélection.
 * - À droite : l'assistant IA (window.bsAssistants), la performance de la prospection (7 ou 30 jours) et les
 *   dernières activités.
 * Le CRM monte cette page à la place de l'ancienne dès qu'il y a des prospects (sinon l'accueil « Charger la démo »).
 */
(function () {
  'use strict';
  if (window.bsAujourdhui) return;

  var CONF = window.BS_SERVER && typeof window.BS_SERVER === 'object' ? window.BS_SERVER : null;
  var USER = CONF && CONF.user ? CONF.user : null;
  var PAR_PAGE = 8;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function deux(n) { return (n < 10 ? '0' : '') + n; }
  function jour(d) { d = d || new Date(); return d.getFullYear() + '-' + deux(d.getMonth() + 1) + '-' + deux(d.getDate()); }
  function decale(n) { var d = new Date(); d.setDate(d.getDate() + n); return jour(d); }
  function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  var EXTRA = {
    'aj-plus': '<path d="M12 5v14M5 12h14"/>',
    'aj-points': '<circle cx="12" cy="5" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="19" r="1.4" fill="currentColor"/>',
    'aj-haut': '<path d="M12 19V5M5 12l7-7 7 7"/>',
    'aj-bas': '<path d="M12 5v14M19 12l-7 7-7-7"/>',
  };
  function ic(name, size) {
    var pl = window.bsIcones && window.bsIcones.plein && window.bsIcones.plein(name);
    var hs = window.__bsHs ? window.__bsHs() : null;
    var inner = pl || EXTRA[name] || (window.bsIcones && window.bsIcones.svg(name)) || (hs && hs[name]) || '';
    return '<svg class="ic" width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }

  // ---------------------------------------------------------------- données
  function R() { return window.__bsStore || null; }
  function etat() { var r = R(); return r && r.get ? r.get() : {}; }
  function prospects() { return (etat().prospects || []).filter(function (p) { return p && !p.supprime && (p.entreprise || p.contact); }); }
  var STATUTS = {
    a_appeler: { l: 'À appeler', t: 'blue' }, injoignable: { l: 'Injoignable', t: 'orange' }, rdv_pris: { l: 'RDV pris', t: 'sky' },
    audit_realise: { l: 'Audit réalisé', t: 'violet' }, proposition_envoyee: { l: 'Proposition', t: 'indigo' }, client_signe: { l: 'Client', t: 'emerald' },
    resilie: { l: 'Résilié', t: 'rose' }, perdu: { l: 'Perdu', t: 'slate' },
  };
  var FERMES = ['client_signe', 'perdu', 'resilie'];
  var ONGLETS = [
    { id: 'tous', l: 'Tous', f: function () { return true; } },
    { id: 'contacter', l: 'À contacter', f: function (p) { return p.statut === 'a_appeler' || p.statut === 'injoignable'; } },
    { id: 'cours', l: 'En cours', f: function (p) { return p.statut === 'rdv_pris' || p.statut === 'audit_realise' || p.statut === 'proposition_envoyee'; } },
    { id: 'clients', l: 'Clients', f: function (p) { return p.statut === 'client_signe'; } },
    { id: 'perdus', l: 'Non intéressés', f: function (p) { return p.statut === 'perdu' || p.statut === 'resilie'; } },
  ];
  var PRIO = { haute: 'Chaud', moyenne: 'Tiède', basse: 'Froid' };

  // Moment d'une entrée d'historique (appel ou événement) en millisecondes.
  function quand(date, heure, ts) {
    if (ts) { var x = Date.parse(ts); if (!isNaN(x)) return x; }
    if (!date) return 0;
    var y = Date.parse(String(date).slice(0, 10) + 'T' + (heure && /^\d{1,2}:\d{2}/.test(heure) ? (heure.length === 4 ? '0' + heure : heure.slice(0, 5)) : '12:00') + ':00');
    return isNaN(y) ? 0 : y;
  }
  function derniere(p) {
    var t = 0;
    (p.callLog || []).forEach(function (c) { t = Math.max(t, quand(c.date, c.time)); });
    (p.events || []).forEach(function (e) { t = Math.max(t, quand(e.date, e.time, e.ts || e.at)); });
    if (!t && p.updatedAt) t = quand(p.updatedAt);
    if (!t && p.createdAt) t = quand(p.createdAt);
    return t;
  }
  function ilya(t) {
    if (!t) return '—';
    if (t > Date.now() + 60000) return jour(new Date(t)) === jour() ? 'Aujourd’hui' : new Date(t).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    var s = Math.max(0, (Date.now() - t) / 1000);
    if (s < 60) return 'À l’instant';
    if (s < 3600) return 'Il y a ' + Math.floor(s / 60) + ' min';
    if (s < 86400) return 'Il y a ' + Math.floor(s / 3600) + ' h';
    var j = Math.floor(s / 86400);
    if (j < 31) return 'Il y a ' + j + ' j';
    return new Date(t).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }
  // Score IA : estimation automatique de la chance de signer (étape, chaleur, coordonnées, activité récente).
  var BASE = { a_appeler: 46, injoignable: 32, rdv_pris: 70, audit_realise: 78, proposition_envoyee: 86, client_signe: 96, resilie: 14, perdu: 8 };
  function score(p) {
    var s = BASE[p.statut] != null ? BASE[p.statut] : 40;
    if (p.priorite === 'haute') s += 8; else if (p.priorite === 'basse') s -= 8;
    if (p.email) s += 3; if (p.telephone) s += 3; if (p.contact) s += 2;
    var joints = (p.callLog || []).filter(function (c) { return c.outcome && c.outcome !== 'injoignable'; }).length;
    s += Math.min(6, joints * 2);
    var d = derniere(p), age = d ? (Date.now() - d) / 86400000 : 999;
    if (age <= 7) s += 4; else if (age > 60) s -= 6;
    if (p.nePlusContacter) s = Math.min(s, 5);
    return Math.max(3, Math.min(99, Math.round(s)));
  }
  function aAppeler(ps) {
    var t = jour();
    return ps.filter(function (p) { return p.prochaineRelance && p.prochaineRelance <= t && FERMES.indexOf(p.statut) < 0 && !p.nePlusContacter; })
      .sort(function (a, b) { return (a.prochaineRelance + (a.prochaineRelanceHeure || '99')).localeCompare(b.prochaineRelance + (b.prochaineRelanceHeure || '99')); });
  }
  // Chiffres d'une journée (ou d'une période du..au).
  function chiffres(ps, du, au) {
    au = au || du;
    var c = { nouveaux: 0, appels: 0, emails: 0, joints: 0, rdv: 0 };
    ps.forEach(function (p) {
      if (p.createdAt && p.createdAt >= du && p.createdAt <= au) c.nouveaux++;
      (p.callLog || []).forEach(function (x) {
        if (x.date < du || x.date > au) return;
        c.appels++;
        if (x.outcome && x.outcome !== 'injoignable') c.joints++;
        if (x.outcome === 'rdv_pris') c.rdv++;
      });
      (p.events || []).forEach(function (e) { if (e.type === 'email' && e.date >= du && e.date <= au) c.emails++; });
    });
    return c;
  }

  // ---------------------------------------------------------------- actions du CRM
  function ouvrir(type, extra) {
    var Y = window.__bsY; if (!Y || !Y.set) return;
    Y.set(function (s) { return { overlays: (s.overlays || []).concat([Object.assign({ key: 'bsaj' + uid(), type: type }, extra || {})]) }; });
  }
  function session(ids) {
    var Y = window.__bsY; if (!Y || !Y.set) return;
    ids = ids && ids.length ? ids : aAppeler(prospects()).map(function (p) { return p.id; });
    if (!ids.length) { toast('Aucun appel en attente'); return; }
    Y.set({ session: { ids: ids, index: 0, done: 0, startedAt: Date.now() } });
    ouvrir('call', { id: ids[0], mode: 'live', session: true });
  }
  function toast(t) {
    var Y = window.__bsY; if (!Y || !Y.set) return;
    var x = { id: uid(), message: t, tone: 'error', action: null, actionLabel: 'Annuler' };
    Y.set(function (s) { return { toasts: (s.toasts || []).slice(-2).concat([x]) }; });
    setTimeout(function () { Y.set(function (s) { return { toasts: (s.toasts || []).filter(function (y) { return y.id !== x.id; }) }; }); }, 2800);
  }

  // ---------------------------------------------------------------- page
  var UI = { onglet: 'tous', q: '', secteur: '', prio: '', tri: 'action', page: 0, sel: {}, filtres: false, periode: 7, survol: -1 };
  var racine = null, desabo = null, minuteur = 0;

  function bonjour() {
    var n = (USER && USER.name) || ((etat().companyInfo || {}).expediteur || '').split(/[\s—-]/)[0] || '';
    n = String(n).trim().split(/\s+/)[0];
    return (new Date().getHours() < 18 ? 'Bonjour' : 'Bonsoir') + (n ? ' ' + esc(n) : '') + ' 👋';
  }
  function dateLongue() { var s = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); return s.charAt(0).toUpperCase() + s.slice(1); }

  function variation(a, b, unite) {
    if (!a && !b) return '<span class="bsaj-var nul">—</span>';
    if (!b) return '<span class="bsaj-var up">' + ic('aj-haut', 13) + '+' + a + (unite || '') + '</span>';
    var p = Math.round((a - b) / b * 100);
    if (!p) return '<span class="bsaj-var nul">=</span>';
    return '<span class="bsaj-var ' + (p > 0 ? 'up' : 'down') + '">' + ic(p > 0 ? 'aj-haut' : 'aj-bas', 13) + (p > 0 ? '+' : '') + p + '%</span>';
  }
  function zoneKpis(ps) {
    var a = chiffres(ps, jour()), h = chiffres(ps, decale(-1));
    var k = [
      { i: 'users', l: 'Nouveaux prospects', v: a.nouveaux, w: h.nouveaux, t: 'Prospects ajoutés aujourd’hui' },
      { i: 'mail', l: 'Messages envoyés', v: a.appels + a.emails, w: h.appels + h.emails, t: 'Appels passés et e-mails envoyés aujourd’hui' },
      { i: 'message-square', l: 'Réponses reçues', v: a.joints, w: h.joints, t: 'Appels où le contact a décroché aujourd’hui' },
      { i: 'calendar', l: 'Rendez-vous planifiés', v: a.rdv, w: h.rdv, t: 'Rendez-vous obtenus aujourd’hui' },
    ];
    return k.map(function (x) {
      return '<div class="bsaj-kpi" title="' + esc(x.t) + '"><span class="bsaj-kpi-ic">' + ic(x.i, 20) + '</span><div class="bsaj-kpi-l">' + esc(x.l) + '</div>' +
        '<div class="bsaj-kpi-v"><b>' + x.v.toLocaleString('fr-FR') + '</b>' + variation(x.v, x.w) + '</div><div class="bsaj-kpi-s">vs. hier</div></div>';
    }).join('');
  }

  function filtrer(ps) {
    var o = ONGLETS.filter(function (x) { return x.id === UI.onglet; })[0] || ONGLETS[0], q = norm(UI.q).trim();
    var l = ps.filter(o.f).filter(function (p) {
      if (UI.secteur && p.secteur !== UI.secteur) return false;
      if (UI.prio && p.priorite !== UI.prio) return false;
      if (!q) return true;
      return norm([p.entreprise, p.contact, p.ville, p.secteur, p.email, p.telephone, (p.tags || []).join(' ')].join(' ')).indexOf(q) >= 0;
    }).map(function (p) { return { p: p, s: score(p), d: derniere(p) }; });
    l.sort(UI.tri === 'score' ? function (a, b) { return b.s - a.s || b.d - a.d; }
      : UI.tri === 'nom' ? function (a, b) { return String(a.p.entreprise || '').localeCompare(String(b.p.entreprise || ''), 'fr'); }
        : function (a, b) { return b.d - a.d; });
    return l;
  }
  function initiales(n) { var m = String(n || '?').replace(/[^\p{L}\p{N}\s]/gu, ' ').trim().split(/\s+/); return ((m[0] || '?')[0] + (m[1] ? m[1][0] : (m[0] || '')[1] || '')).toUpperCase(); }
  function teinte(s) { var h = 0; s = String(s || ''); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360; return h; }
  function zoneOnglets(ps) {
    return ONGLETS.map(function (o) {
      return '<button type="button" class="bsaj-onglet' + (UI.onglet === o.id ? ' on' : '') + '" data-onglet="' + o.id + '">' + esc(o.l) + ' (' + ps.filter(o.f).length + ')</button>';
    }).join('');
  }
  function zoneTable(ps) {
    var l = filtrer(ps), pages = Math.max(1, Math.ceil(l.length / PAR_PAGE));
    if (UI.page >= pages) UI.page = pages - 1;
    var vus = l.slice(UI.page * PAR_PAGE, UI.page * PAR_PAGE + PAR_PAGE);
    var tousCoches = vus.length && vus.every(function (x) { return UI.sel[x.p.id]; });
    var nSel = Object.keys(UI.sel).length;
    var lignes = vus.map(function (x) {
      var p = x.p, st = STATUTS[p.statut] || { l: p.statut || '—', t: 'slate' };
      var sc = x.s >= 75 ? 'haut' : x.s >= 50 ? 'moyen' : 'bas';
      return '<tr data-fiche="' + esc(p.id) + '"><td class="bsaj-cc"><input type="checkbox" data-sel="' + esc(p.id) + '"' + (UI.sel[p.id] ? ' checked' : '') + ' aria-label="Sélectionner ' + esc(p.entreprise) + '"></td>' +
        '<td><div class="bsaj-ent"><span class="bsaj-logo" style="--h:' + teinte(p.entreprise) + '">' + esc(initiales(p.entreprise || p.contact)) + '</span><span><b>' + esc(p.entreprise || p.contact) + '</b><small>' + esc(p.secteur || p.ville || '') + '</small></span></div></td>' +
        '<td><div class="bsaj-ct"><b>' + esc(p.contact || '—') + '</b><small>' + esc(p.poste || p.ville || (PRIO[p.priorite] || '')) + '</small></div></td>' +
        '<td><span class="bsaj-statut tone-' + st.t + '">' + esc(st.l) + '</span></td>' +
        '<td><span class="bsaj-score ' + sc + '">' + x.s + '%</span></td>' +
        '<td class="bsaj-quand">' + esc(ilya(x.d)) + '</td>' +
        '<td><div class="bsaj-acts">' +
        '<button type="button" data-mail="' + esc(p.id) + '" title="' + (p.email ? 'Envoyer un e-mail' : 'Pas d’e-mail sur la fiche') + '"' + (p.email ? '' : ' disabled') + '>' + ic('mail', 15) + '</button>' +
        '<button type="button" data-appel="' + esc(p.id) + '" title="Appeler"' + (p.telephone ? '' : ' disabled') + '>' + ic('phone', 15) + '</button>' +
        '<button type="button" data-ouvrir="' + esc(p.id) + '" title="Ouvrir la fiche" class="nu">' + ic('aj-points', 16) + '</button></div></td></tr>';
    }).join('');
    return '<div class="bsaj-tablewrap"><table class="bsaj-table"><thead><tr><th class="bsaj-cc"><input type="checkbox" data-tout' + (tousCoches ? ' checked' : '') + ' aria-label="Tout sélectionner"></th><th>Entreprise</th><th>Contact</th><th>Statut</th><th title="Estimation automatique : étape, chaleur, coordonnées et activité récente">Score IA</th><th>Dernière action</th><th>Actions</th></tr></thead>' +
      '<tbody>' + (lignes || '<tr><td colspan="7" class="bsaj-vide">Aucun prospect ne correspond.</td></tr>') + '</tbody></table></div>' +
      '<div class="bsaj-pied"><span>' + (l.length ? (UI.page * PAR_PAGE + 1) + '–' + Math.min(l.length, UI.page * PAR_PAGE + PAR_PAGE) + ' sur ' + l.length : '0 prospect') + '</span>' +
      (nSel ? '<span class="bsaj-sel">' + nSel + ' sélectionné' + (nSel > 1 ? 's' : '') + ' <button type="button" data-act="appeler-sel">' + ic('phone', 14) + 'Appeler la sélection</button><button type="button" data-act="vider-sel">Annuler</button></span>' : '') +
      '<span class="bsaj-pages"><button type="button" data-page="-1"' + (UI.page ? '' : ' disabled') + ' aria-label="Page précédente">‹</button><button type="button" data-page="1"' + (UI.page < pages - 1 ? '' : ' disabled') + ' aria-label="Page suivante">›</button></span></div>';
  }
  function zoneFiltres(ps) {
    if (!UI.filtres) return '';
    var secteurs = {};
    ps.forEach(function (p) { if (p.secteur) secteurs[p.secteur] = 1; });
    var opt = function (v, l, cur) { return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(l) + '</option>'; };
    return '<div class="bsaj-filtres">' +
      '<label>Secteur<select data-f="secteur">' + opt('', 'Tous', UI.secteur) + Object.keys(secteurs).sort().map(function (s) { return opt(s, s, UI.secteur); }).join('') + '</select></label>' +
      '<label>Chaleur<select data-f="prio">' + opt('', 'Toutes', UI.prio) + opt('haute', 'Chaud', UI.prio) + opt('moyenne', 'Tiède', UI.prio) + opt('basse', 'Froid', UI.prio) + '</select></label>' +
      '<label>Trier par<select data-f="tri">' + opt('action', 'Dernière action', UI.tri) + opt('score', 'Score IA', UI.tri) + opt('nom', 'Nom', UI.tri) + '</select></label>' +
      ((UI.secteur || UI.prio) ? '<button type="button" data-act="raz">Effacer les filtres</button>' : '') + '</div>';
  }

  // Performance : activité de prospection par jour (appels + e-mails), leads générés et taux de réponse.
  function zonePerf(ps) {
    var n = UI.periode, jours = [], i;
    for (i = n - 1; i >= 0; i--) jours.push(decale(-i));
    var serie = jours.map(function (d) { var c = chiffres(ps, d); return { d: d, v: c.appels + c.emails, c: c }; });
    var du = jours[0], au = jours[n - 1], avDu = decale(-(2 * n - 1)), avAu = decale(-n);
    var cur = chiffres(ps, du, au), av = chiffres(ps, avDu, avAu);
    var taux = cur.appels ? Math.round(cur.joints / cur.appels * 100) : 0, tauxAv = av.appels ? Math.round(av.joints / av.appels * 100) : 0;
    var leadsTxt = av.nouveaux ? ((cur.nouveaux >= av.nouveaux ? '+' : '') + Math.round((cur.nouveaux - av.nouveaux) / av.nouveaux * 100) + '%') : (cur.nouveaux ? '+' + cur.nouveaux : '0');
    var tauxTxt = av.appels && cur.appels ? ((taux >= tauxAv ? '+' : '') + (taux - tauxAv) + ' pts') : taux + '%';
    var W = 340, H = 120, P = 6, max = Math.max(4, Math.max.apply(null, serie.map(function (x) { return x.v; })));
    var pts = serie.map(function (x, k) { return [P + k * (W - 2 * P) / Math.max(1, n - 1), H - P - x.v / max * (H - 2 * P - 10)]; });
    var lisse = pts.map(function (p, k) {
      if (!k) return 'M' + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
      var a = pts[k - 1], cx = (a[0] + p[0]) / 2;
      return 'C' + cx.toFixed(1) + ' ' + a[1].toFixed(1) + ' ' + cx.toFixed(1) + ' ' + p[1].toFixed(1) + ' ' + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
    }).join(' ');
    var aire = lisse + ' L' + pts[n - 1][0].toFixed(1) + ' ' + H + ' L' + pts[0][0].toFixed(1) + ' ' + H + ' Z';
    var sv = UI.survol >= 0 && UI.survol < n ? serie[UI.survol] : null, sp = sv ? pts[UI.survol] : null;
    var bulle = sv ? '<div class="bsaj-bulle" style="left:' + (sp[0] / W * 100).toFixed(1) + '%;top:' + (sp[1] / H * 100).toFixed(1) + '%"><b>' +
      esc(new Date(sv.d + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })) + '</b>' +
      sv.c.appels + ' appel' + (sv.c.appels > 1 ? 's' : '') + ' · ' + sv.c.emails + ' e-mail' + (sv.c.emails > 1 ? 's' : '') + '<br>' + sv.c.joints + ' réponse' + (sv.c.joints > 1 ? 's' : '') + ' · ' + sv.c.rdv + ' RDV</div>' : '';
    return '<div class="bsaj-carte-tete"><span class="bsaj-tic">' + ic('trending-up', 18) + '</span><b>Performance de la prospection</b>' +
      '<select class="bsaj-periode" data-f="periode" aria-label="Période"><option value="7"' + (n === 7 ? ' selected' : '') + '>7 derniers jours</option><option value="30"' + (n === 30 ? ' selected' : '') + '>30 derniers jours</option></select></div>' +
      '<div class="bsaj-graph" data-graph>' +
      '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="Appels et e-mails par jour sur ' + n + ' jours">' +
      '<defs><linearGradient id="bsajAire" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(var(--accent-rgb))" stop-opacity=".45"/><stop offset="1" stop-color="rgb(var(--accent-rgb))" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="bsajLigne" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6d5dfc"/><stop offset="1" stop-color="rgb(var(--accent-rgb))"/></linearGradient></defs>' +
      '<path d="' + aire + '" fill="url(#bsajAire)"/><path d="' + lisse + '" fill="none" stroke="url(#bsajLigne)" stroke-width="2.6" stroke-linecap="round" vector-effect="non-scaling-stroke"/>' +
      (sp ? '<line x1="' + sp[0] + '" x2="' + sp[0] + '" y1="0" y2="' + H + '" stroke="var(--border-2)" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/>' : '') +
      '</svg>' + (sp ? '<i class="bsaj-point" style="left:' + (sp[0] / W * 100).toFixed(1) + '%;top:' + (sp[1] / H * 100).toFixed(1) + '%"></i>' : '') + bulle + '</div>' +
      '<div class="bsaj-perf-chiffres"><div><b class="c1">' + esc(leadsTxt) + '</b><span>de leads générés</span><small>' + cur.nouveaux + ' sur ' + n + ' jours</small></div>' +
      '<div><b class="c2">' + esc(tauxTxt) + '</b><span>de taux de réponse</span><small>' + taux + '% des appels décrochés</small></div></div>';
  }

  // Dernières activités de toute l'équipe sur les prospects.
  var TYPES = {
    rdv: { i: 'calendar', t: 'Nouveau rendez-vous planifié' }, client: { i: 'circle-check', t: 'Client signé' }, joint: { i: 'phone-call', t: 'Réponse reçue' },
    injoignable: { i: 'phone', t: 'Appel sans réponse' }, appel: { i: 'phone', t: 'Appel passé' }, email: { i: 'mail', t: 'E-mail envoyé' },
    create: { i: 'user-plus', t: 'Nouveau prospect' }, status: { i: 'activity', t: 'Statut modifié' }, devis: { i: 'file-text', t: 'Devis' },
    facture: { i: 'receipt', t: 'Facture' }, task: { i: 'list-checks', t: 'Tâche planifiée' }, relance: { i: 'calendar-check', t: 'Relance planifiée' },
    note: { i: 'sticky-note', t: 'Note ajoutée' }, call: { i: 'phone-call', t: 'Appel' },
  };
  function activites(ps) {
    var l = [];
    ps.forEach(function (p) {
      (p.callLog || []).slice(0, 10).forEach(function (c) {
        var k = c.outcome === 'rdv_pris' ? 'rdv' : c.outcome === 'client_signe' ? 'client' : c.outcome === 'injoignable' ? 'injoignable' : c.outcome ? 'joint' : 'appel';
        l.push({ k: k, p: p, t: quand(c.date, c.time) });
      });
      (p.events || []).slice(0, 10).forEach(function (e) {
        if (!TYPES[e.type]) return;
        l.push({ k: e.type, p: p, t: quand(e.date, e.time, e.ts || e.at), x: e.type === 'status' || e.type === 'devis' || e.type === 'facture' ? e.text : '' });
      });
    });
    return l.filter(function (x) { return x.t && x.t <= Date.now() + 60000; }).sort(function (a, b) { return b.t - a.t; }).slice(0, 6);
  }
  function zoneActs(ps) {
    var l = activites(ps);
    return '<div class="bsaj-carte-tete"><span class="bsaj-tic">' + ic('activity', 18) + '</span><b>Dernières activités</b></div>' +
      (l.length ? '<ul class="bsaj-acts-l">' + l.map(function (x) {
        var ty = TYPES[x.k] || TYPES.appel;
        return '<li><button type="button" data-ouvrir="' + esc(x.p.id) + '"><span class="bsaj-acts-ic k-' + esc(x.k) + '">' + ic(ty.i, 16) + '</span><span class="bsaj-acts-t"><b>' + esc(x.x || ty.t) + '</b><small>' + esc(x.p.entreprise || x.p.contact) + '</small></span><time>' + esc(ilya(x.t)) + '</time></button></li>';
      }).join('') + '</ul>' : '<p class="bsaj-rien">Les appels, e-mails et rendez-vous apparaîtront ici.</p>');
  }

  function dessiner(tout) {
    if (!racine) return;
    var ps = prospects();
    if (tout || !racine.querySelector('.bsaj')) {
      var file = aAppeler(ps).length;
      // Administrateurs : la vue d'ensemble CEO (équipe, simulations, objectifs) passe en tête de page.
      var ceo = !!(window.bsCeo && window.BS_SERVER && window.BS_SERVER.user && window.BS_SERVER.user.role === 'admin');
      racine.innerHTML = (ceo ? '<div data-z="ceo"></div>' : '') + '<div class="bsaj">' +
        '<div class="bsaj-gauche">' +
        (ceo ? '<header class="bsaj-tete bsaj-tete-ceo"><div><h2>Ma prospection du jour</h2><p>Vos prospects, vos appels et vos rendez-vous.</p></div><time>' + esc(dateLongue()) + '</time></header>'
          : '<header class="bsaj-tete"><div><h1>' + bonjour() + '</h1><p>Voici un aperçu de votre prospection aujourd’hui.</p></div><time>' + esc(dateLongue()) + '</time></header>') +
        '<div class="bsaj-kpis" data-z="kpis"></div>' +
        '<section class="bsaj-carte bsaj-prospects"><div class="bsaj-p-tete"><div><h2>Mes prospects</h2><p>Liste des prospects qualifiés pour votre campagne.</p></div>' +
        '<div class="bsaj-p-boutons"><button type="button" class="bsaj-btn2" data-act="session" title="Session d’appels : enchaîner les appels prévus aujourd’hui">' + ic('zap', 16) + 'Appels<span data-z="file">' + (file ? ' (' + file + ')' : '') + '</span></button>' +
        '<button type="button" class="bsaj-btn" data-act="ajouter">' + ic('aj-plus', 17) + 'Ajouter des prospects</button></div></div>' +
        '<div class="bsaj-onglets" data-z="onglets"></div>' +
        '<div class="bsaj-cherche"><label class="bsaj-q">' + ic('search', 16) + '<input type="search" data-q placeholder="Rechercher un prospect..." value="' + esc(UI.q) + '" aria-label="Rechercher un prospect"></label>' +
        '<button type="button" class="bsaj-fbtn' + (UI.filtres || UI.secteur || UI.prio ? ' on' : '') + '" data-act="filtres" aria-expanded="' + UI.filtres + '">' + ic('list-filter', 16) + 'Filtres</button></div>' +
        '<div data-z="filtres"></div><div data-z="table"></div></section></div>' +
        '<aside class="bsaj-droite"><div data-z="ia"></div><section class="bsaj-carte bsaj-perf" data-z="perf"></section><section class="bsaj-carte bsaj-activ" data-z="acts"></section></aside></div>';
      if (window.bsAssistants) window.bsAssistants.panneau(racine.querySelector('.bsaj [data-z=ia]'), { defaut: 'membre', session: function () { session(); } });
      if (ceo) window.bsCeo.monter(racine.querySelector('[data-z=ceo]'));
    }
    var z = function (n) { return racine.querySelector('.bsaj [data-z=' + n + ']'); };
    z('kpis').innerHTML = zoneKpis(ps);
    z('onglets').innerHTML = zoneOnglets(ps);
    z('filtres').innerHTML = zoneFiltres(ps);
    z('table').innerHTML = zoneTable(ps);
    z('perf').innerHTML = zonePerf(ps);
    z('acts').innerHTML = zoneActs(ps);
    var f = aAppeler(ps).length; z('file').textContent = f ? ' (' + f + ')' : '';
    var fb = racine.querySelector('.bsaj-fbtn'); if (fb) { fb.classList.toggle('on', !!(UI.filtres || UI.secteur || UI.prio)); fb.setAttribute('aria-expanded', UI.filtres); }
  }

  function brancher(el) {
    el.addEventListener('click', function (ev) {
      var t = ev.target;
      var b = t.closest('button,input,a,select,label');
      if (b && b.closest('.bsaj [data-z=ia],[data-z=ceo]')) return;
      if (b && b.dataset) {
        var d = b.dataset;
        if (d.onglet) { UI.onglet = d.onglet; UI.page = 0; dessiner(); return; }
        if (d.page) { UI.page = Math.max(0, UI.page + Number(d.page)); dessiner(); return; }
        if (d.mail) { ouvrir('email', { id: d.mail }); return; }
        if (d.appel) { ouvrir('call', { id: d.appel, mode: 'live' }); return; }
        if (d.ouvrir) { ouvrir('prospect', { id: d.ouvrir }); return; }
        if (d.sel != null || d.tout != null) return;
        if (d.act === 'ajouter') { ouvrir('prospectForm'); return; }
        if (d.act === 'session') { session(); return; }
        if (d.act === 'filtres') { UI.filtres = !UI.filtres; dessiner(); return; }
        if (d.act === 'raz') { UI.secteur = ''; UI.prio = ''; UI.page = 0; dessiner(); return; }
        if (d.act === 'appeler-sel') {
          var ordre = filtrer(prospects()).map(function (x) { return x.p.id; }).filter(function (id) { return UI.sel[id]; });
          var autres = Object.keys(UI.sel).filter(function (id) { return ordre.indexOf(id) < 0 && prospects().some(function (p) { return p.id === id; }); });
          session(ordre.concat(autres)); return;
        }
        if (d.act === 'vider-sel') { UI.sel = {}; dessiner(); return; }
        if (b.tagName === 'INPUT' || b.tagName === 'SELECT' || b.tagName === 'LABEL') return;
      }
      var tr = t.closest('tr[data-fiche]');
      if (tr && !t.closest('.bsaj-cc')) ouvrir('prospect', { id: tr.dataset.fiche });
    });
    el.addEventListener('change', function (ev) {
      var t = ev.target, d = t.dataset || {};
      if (t.closest('[data-z=ceo]')) return;
      if (d.sel) { if (t.checked) UI.sel[d.sel] = 1; else delete UI.sel[d.sel]; dessiner(); return; }
      if (d.tout != null) {
        var l = filtrer(prospects()).slice(UI.page * PAR_PAGE, UI.page * PAR_PAGE + PAR_PAGE);
        l.forEach(function (x) { if (t.checked) UI.sel[x.p.id] = 1; else delete UI.sel[x.p.id]; });
        dessiner(); return;
      }
      if (d.f === 'periode') { UI.periode = Number(t.value) || 7; UI.survol = -1; dessiner(); return; }
      if (d.f) { UI[d.f] = t.value; UI.page = 0; dessiner(); }
    });
    el.addEventListener('input', function (ev) {
      if (ev.target.dataset && ev.target.dataset.q != null) { UI.q = ev.target.value; UI.page = 0; dessiner(); }
    });
    el.addEventListener('pointermove', function (ev) {
      var g = ev.target.closest && ev.target.closest('.bsaj [data-graph]'); if (!g) { if (UI.survol >= 0) { UI.survol = -1; dessiner(); } return; }
      var r = g.getBoundingClientRect(), n = UI.periode, k = Math.round((ev.clientX - r.left) / r.width * (n - 1));
      k = Math.max(0, Math.min(n - 1, k));
      if (k !== UI.survol) { UI.survol = k; racine.querySelector('.bsaj [data-z=perf]').innerHTML = zonePerf(prospects()); }
    });
    el.addEventListener('pointerleave', function () { if (UI.survol >= 0) { UI.survol = -1; var p = racine && racine.querySelector('.bsaj [data-z=perf]'); if (p) p.innerHTML = zonePerf(prospects()); } });
  }

  function monter(el) {
    if (!el) return;
    css();
    if (el === racine && el.__bsaj) return;
    racine = el; el.__bsaj = true; el.classList.add('bsaj-root');
    brancher(el);
    dessiner(true);
    if (desabo) { try { desabo(); } catch (e) { /* déjà fait */ } desabo = null; }
    var r = R();
    if (r && r.subscribe) {
      var avant = null;
      var sub = r.subscribe(function (s) {
        if (!racine || !racine.isConnected) { if (desabo) { desabo(); desabo = null; } return; }
        if (avant === s.prospects) return;
        avant = s.prospects; clearTimeout(minuteur); minuteur = setTimeout(function () { dessiner(); }, 200);
        if (window.bsCeo && racine.querySelector('[data-z=ceo]')) window.bsCeo.rafraichir();
      });
      desabo = typeof sub === 'function' ? sub : null;
    }
    // L'heure relative (« il y a 5 min ») et le bonjour/bonsoir avancent avec le temps.
    var tic = setInterval(function () { if (!racine || !racine.isConnected) { clearInterval(tic); return; } if (!document.hidden) dessiner(); }, 60000);
  }

  var cssFait = false;
  function css() {
    if (cssFait) return; cssFait = true;
    var st = document.createElement('style'); st.id = 'bs-aujourdhui-css';
    st.textContent = [
      '.bsaj{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,350px);gap:20px;align-items:start}',
      '.bsaj-gauche,.bsaj-droite{display:flex;flex-direction:column;gap:20px;min-width:0}',
      '.bsaj-tete{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;padding:6px 2px 0}',
      '.bsaj-tete h1{margin:0;font-size:2em;font-weight:800;letter-spacing:-.02em;line-height:1.15}',
      '.bsaj-tete p{margin:6px 0 0;color:var(--text-2);font-size:1.02em}',
      '.bsaj-tete time{flex:none;margin-top:8px;color:var(--text-2);font-size:.9em;font-weight:500}',
      '.bsaj-tete-ceo h2{margin:0;font-size:1.35em;font-weight:800;letter-spacing:-.01em}.bsaj-tete-ceo p{font-size:.92em}',
      '.bsaj-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}',
      '.bsaj-kpi{display:flex;flex-direction:column;gap:4px;padding:16px;border-radius:16px;border:1px solid var(--border);background:var(--surface);box-shadow:var(--shadow-sm);min-width:0}',
      '.bsaj-kpi-ic{width:40px;height:40px;border-radius:11px;display:grid;place-items:center;color:#fff;margin-bottom:10px;background:linear-gradient(145deg,rgb(var(--accent-rgb)),rgb(var(--accent-rgb)/.7));box-shadow:0 8px 20px -8px rgb(var(--accent-rgb)/.85),inset 0 1px 0 rgb(255 255 255/.22)}',
      '.bsaj-kpi-l{font-size:.9em;font-weight:600;color:var(--text)}',
      '.bsaj-kpi-v{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}',
      '.bsaj-kpi-v b{font-size:1.95em;font-weight:800;letter-spacing:-.02em;font-variant-numeric:tabular-nums}',
      '.bsaj-var{display:inline-flex;align-items:center;gap:2px;font-size:.84em;font-weight:700}',
      '.bsaj-var.up{color:#22c55e}.bsaj-var.down{color:#ef4444}.bsaj-var.nul{color:var(--text-3)}',
      '.bsaj-kpi-s{font-size:.8em;color:var(--text-3)}',
      '.bsaj-carte{padding:20px;border-radius:18px;border:1px solid var(--border);background:var(--surface);box-shadow:var(--shadow-sm);min-width:0}',
      '.bsaj-p-tete{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}',
      '.bsaj-p-tete>div:first-child{flex:1;min-width:220px}',
      '.bsaj-p-tete h2{margin:0;font-size:1.3em;font-weight:750}',
      '.bsaj-p-tete p{margin:4px 0 0;color:var(--text-2);font-size:.9em}',
      '.bsaj-p-boutons{display:flex;gap:8px;flex-wrap:wrap}',
      '.bsaj-btn,.bsaj-btn2{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px;border-radius:11px;font:inherit;font-weight:650;font-size:.92em;cursor:pointer;white-space:nowrap}',
      '.bsaj-btn{border:0;color:#fff;background:linear-gradient(180deg,rgb(var(--accent-rgb)/1),rgb(var(--accent-rgb)/.86));box-shadow:0 10px 24px -10px rgb(var(--accent-rgb)/.95),inset 0 1px 0 rgb(255 255 255/.2)}',
      '.bsaj-btn:hover{filter:brightness(1.08)}',
      '.bsaj-btn2{border:1px solid var(--border-2);color:var(--text);background:var(--surface-2)}',
      '.bsaj-btn2:hover{border-color:rgb(var(--accent-rgb)/.6)}',
      '.bsaj-btn2 span{color:var(--text-3);font-weight:600}',
      '.bsaj-onglets{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0 14px}',
      '.bsaj-onglet{height:34px;padding:0 14px;border-radius:9px;border:1px solid var(--border);background:var(--surface-2);color:var(--text-2);font:inherit;font-size:.86em;font-weight:600;cursor:pointer}',
      '.bsaj-onglet:hover{color:var(--text)}',
      '.bsaj-onglet.on{background:rgb(var(--accent-rgb));border-color:transparent;color:#fff;box-shadow:0 6px 16px -8px rgb(var(--accent-rgb))}',
      '.bsaj-cherche{display:flex;gap:10px;margin-bottom:12px}',
      '.bsaj-q{flex:1;display:flex;align-items:center;gap:10px;height:42px;padding:0 14px;border-radius:11px;border:1px solid var(--border-2);background:var(--surface-2);color:var(--text-3)}',
      '.bsaj-q:focus-within{border-color:rgb(var(--accent-rgb)/.7)}',
      '.bsaj-q input{flex:1;min-width:0;border:0;background:none;color:var(--text);font:inherit;font-size:.92em;outline:none}',
      '.bsaj-fbtn{display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 14px;border-radius:11px;border:1px solid var(--border-2);background:var(--surface-2);color:var(--text);font:inherit;font-weight:600;font-size:.9em;cursor:pointer}',
      '.bsaj-fbtn.on{border-color:rgb(var(--accent-rgb)/.7);color:var(--accent-text,var(--text))}',
      '.bsaj-filtres{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;margin:-2px 0 12px;padding:12px;border-radius:12px;border:1px solid var(--border);background:var(--surface-2)}',
      '.bsaj-filtres label{display:flex;flex-direction:column;gap:4px;font-size:.78em;font-weight:600;color:var(--text-3)}',
      '.bsaj-filtres select{height:34px;min-width:150px;padding:0 8px;border-radius:8px;border:1px solid var(--border-2);background:var(--surface);color:var(--text);font:inherit;font-size:1.12em}',
      '.bsaj-filtres button{height:34px;padding:0 10px;border:0;background:none;color:var(--text-2);font:inherit;font-size:.85em;cursor:pointer;text-decoration:underline}',
      '.bsaj-tablewrap{overflow-x:auto;margin:0 -20px;padding:0 20px}',
      '.bsaj-table{width:100%;border-collapse:collapse;font-size:.88em;min-width:660px}',
      '.bsaj-table th{text-align:left;font-weight:600;color:var(--text-2);font-size:.92em;padding:12px 8px;border-bottom:1px solid var(--border);background:rgb(var(--text-rgb,148 163 184)/.03);white-space:nowrap}',
      '.bsaj-table td{padding:11px 8px;border-bottom:1px solid var(--border);vertical-align:middle}',
      '.bsaj-table tbody tr{cursor:pointer;transition:background .12s}',
      '.bsaj-table tbody tr:hover{background:rgb(var(--accent-rgb)/.06)}',
      '.bsaj-cc{width:34px}',
      '.bsaj-table input[type=checkbox]{width:16px;height:16px;accent-color:rgb(var(--accent-rgb));cursor:pointer}',
      '.bsaj-ent,.bsaj-ct{display:flex;align-items:center;gap:12px;min-width:0}',
      '.bsaj-ent>span:last-child,.bsaj-ct{flex-direction:column;align-items:flex-start;gap:2px}',
      '.bsaj-ent b,.bsaj-ct b{font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:170px}',
      '.bsaj-ent small,.bsaj-ct small{color:var(--text-3);font-size:.9em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:170px}',
      '.bsaj-ent>span:last-child{display:flex;min-width:0}',
      '.bsaj-logo{flex:none;width:36px;height:36px;border-radius:9px;display:grid;place-items:center;font-size:.82em;font-weight:800;color:hsl(var(--h) 80% 82%);background:linear-gradient(145deg,hsl(var(--h) 45% 32%),hsl(var(--h) 50% 22%));box-shadow:inset 0 0 0 1px hsl(var(--h) 50% 50%/.35)}',
      '.bsaj-statut{display:inline-flex;align-items:center;height:26px;padding:0 11px;border-radius:7px;font-size:.88em;font-weight:650;white-space:nowrap;color:#fff;background:rgb(var(--t));box-shadow:0 4px 12px -6px rgb(var(--t))}',
      '.bsaj-score{font-weight:750;font-variant-numeric:tabular-nums}',
      '.bsaj-score.haut{color:var(--text)}.bsaj-score.moyen{color:var(--text-2)}.bsaj-score.bas{color:var(--text-3)}',
      '.bsaj-quand{color:var(--text-2);white-space:nowrap}',
      '.bsaj-acts{display:flex;gap:5px}',
      '.bsaj-acts button{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;border:1px solid var(--border);background:var(--surface-2);color:var(--text);cursor:pointer}',
      '.bsaj-acts button.nu{border-color:transparent;background:none;color:var(--text-2)}',
      '.bsaj-acts button:hover:not(:disabled){border-color:rgb(var(--accent-rgb)/.6);color:var(--accent-text,var(--text))}',
      '.bsaj-acts button:disabled{opacity:.35;cursor:default}',
      '.bsaj-vide{text-align:center;color:var(--text-3);padding:28px 10px!important;cursor:default}',
      '.bsaj-pied{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding-top:12px;font-size:.84em;color:var(--text-3)}',
      '.bsaj-sel{display:inline-flex;align-items:center;gap:8px;color:var(--text)}',
      '.bsaj-sel button{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px;border-radius:8px;border:1px solid var(--border-2);background:var(--surface-2);color:var(--text);font:inherit;font-weight:600;cursor:pointer}',
      '.bsaj-sel button:first-of-type{border:0;color:#fff;background:rgb(var(--accent-rgb))}',
      '.bsaj-pages{margin-left:auto;display:flex;gap:6px}',
      '.bsaj-pages button{width:30px;height:30px;border-radius:8px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1.2em;cursor:pointer}',
      '.bsaj-pages button:disabled{opacity:.35;cursor:default}',
      '.bsaj-carte-tete{display:flex;align-items:center;gap:10px;margin-bottom:12px}',
      '.bsaj-carte-tete b{flex:1;font-size:1.02em;font-weight:700}',
      '.bsaj-tic{display:grid;place-items:center;color:var(--accent-text,rgb(var(--accent-rgb)))}',
      '.bsaj-periode{height:30px;padding:0 6px;border-radius:8px;border:1px solid var(--border);background:var(--surface-2);color:var(--text-2);font:inherit;font-size:.8em}',
      '.bsaj-graph{position:relative;height:130px;margin:0 -4px}',
      '.bsaj-graph svg{display:block;width:100%;height:100%;overflow:visible}',
      '.bsaj-graph path[stroke]{filter:drop-shadow(0 4px 10px rgb(var(--accent-rgb)/.6))}',
      '.bsaj-point{position:absolute;width:11px;height:11px;margin:-5.5px 0 0 -5.5px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px rgb(var(--accent-rgb)),0 0 14px rgb(var(--accent-rgb));pointer-events:none}',
      '.bsaj-bulle{position:absolute;transform:translate(-50%,calc(-100% - 14px));padding:7px 10px;border-radius:9px;background:var(--surface-3);border:1px solid var(--border-2);font-size:.76em;line-height:1.45;white-space:nowrap;pointer-events:none;box-shadow:var(--shadow-md)}',
      '.bsaj-bulle b{display:block;font-size:1.05em}',
      '.bsaj-perf-chiffres{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}',
      '.bsaj-perf-chiffres div{display:flex;flex-direction:column;gap:1px}',
      '.bsaj-perf-chiffres b{font-size:1.45em;font-weight:800;letter-spacing:-.01em}',
      '.bsaj-perf-chiffres b.c1{color:var(--accent-text,rgb(var(--accent-rgb)))}.bsaj-perf-chiffres b.c2{color:#a78bfa}',
      '.bsaj-perf-chiffres span{font-size:.84em;color:var(--text-2)}',
      '.bsaj-perf-chiffres small{font-size:.74em;color:var(--text-3)}',
      '.bsaj-acts-l{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}',
      '.bsaj-acts-l button{display:flex;align-items:center;gap:12px;width:100%;padding:9px 6px;border:0;border-radius:10px;background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}',
      '.bsaj-acts-l button:hover{background:var(--surface-2)}',
      '.bsaj-acts-ic{flex:none;width:36px;height:36px;border-radius:10px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,rgb(var(--accent-rgb)),rgb(var(--accent-rgb)/.7))}',
      '.bsaj-acts-ic.k-client{background:linear-gradient(145deg,#10b981,#059669)}.bsaj-acts-ic.k-injoignable{background:var(--surface-3);color:var(--text-2)}.bsaj-acts-ic.k-create{background:linear-gradient(145deg,#8b5cf6,#6d28d9)}',
      '.bsaj-acts-t{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}',
      '.bsaj-acts-t b{font-size:.88em;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bsaj-acts-t small{font-size:.8em;color:var(--text-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bsaj-acts-l time{flex:none;font-size:.76em;color:var(--text-3)}',
      '.bsaj-rien{margin:0;color:var(--text-3);font-size:.88em}',
      '@media (max-width:1240px){.bsaj{grid-template-columns:minmax(0,1fr)}.bsaj-droite{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}}',
      '@media (max-width:900px){.bsaj-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}',
      '@media (max-width:640px){.bsaj-tete{flex-direction:column;gap:4px}.bsaj-tete h1{font-size:1.6em}.bsaj-tete time{margin-top:0}.bsaj-kpi{padding:14px}.bsaj-kpi-v b{font-size:1.6em}.bsaj-carte{padding:16px}.bsaj-tablewrap{margin:0 -16px;padding:0 16px}.bsaj-droite{display:flex}}',
    ].join('\n');
    document.head.appendChild(st);
  }

  window.bsAujourdhui = { monter: monter, score: score, session: session, etat: function () { return UI; } };
})();
