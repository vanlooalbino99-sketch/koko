/* Blackstart CRM : vue d'ensemble CEO, en haut de la page « Aujourd'hui » des administrateurs (maquette d'albino,
 * 27 octobre 2026). Uniquement de vraies données :
 * - équipe, simulations IA (note sur 100), formation, messages et requêtes Claude : /api/equipe/apercu ;
 * - appels, rendez-vous, clients signés et objectifs : les prospects et les Réglages du CRM.
 * Sans donnée, un encart le dit et propose l'action qui la crée (aucun chiffre inventé).
 */
(function () {
  'use strict';
  if (window.bsCeo || !window.BS_SERVER || typeof window.BS_SERVER !== 'object') return;

  var USER = window.BS_SERVER.user || null;
  var J = 86400000;
  var SALES = 'https://blackstart-sales.onrender.com';
  var FAMILLES = [
    ['prospection', 'Prospection', '#3b82f6'], ['decouverte', 'Découverte', '#8b5cf6'], ['objections', 'Objections', '#22d3ee'],
    ['closing', 'Closing', '#6366f1'], ['relance', 'Relance', '#10b981'], ['autre', 'Autres', '#94a3b8'],
  ];
  var SERIES = [['Simulations', '#7c8cff'], ['Décrochés', '#3b82f6'], ['RDV', '#2dd4bf']];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function deux(n) { return (n < 10 ? '0' : '') + n; }
  function jour(d) { d = d || new Date(); return d.getFullYear() + '-' + deux(d.getMonth() + 1) + '-' + deux(d.getDate()); }
  function decale(n) { var d = new Date(); d.setDate(d.getDate() + n); return jour(d); }
  function nb(n) { return Number(n || 0).toLocaleString('fr-FR'); }
  var EXTRA = {
    'ceo-fleche': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'ceo-haut': '<path d="M12 19V5M6 11l6-6 6 6"/>',
    'ceo-bas': '<path d="M12 5v14M6 13l6 6 6-6"/>',
    'ceo-chevron': '<path d="M6 9l6 6 6-6"/>',
    'ceo-envoi': '<path d="M5 12h12M12 6l6 6-6 6"/>',
  };
  function ic(name, size) {
    var hs = window.__bsHs ? window.__bsHs() : null;
    var inner = EXTRA[name] || (window.bsIcones && window.bsIcones.svg(name)) || (hs && hs[name]) || '';
    return '<svg class="ic" width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }
  function initiales(n) { var m = String(n || '?').trim().split(/\s+/); return ((m[0] || '?')[0] + (m[1] ? m[1][0] : '')).toUpperCase(); }
  function teinte(s) { var h = 0; s = String(s || ''); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360; return h; }
  function avatar(m, taille) {
    return '<span class="bsceo-av" style="--h:' + teinte(m && m.name) + ';--t:' + (taille || 38) + 'px">' + (m && m.photo ? '<img src="' + esc(m.photo) + '" alt="">' : esc(initiales(m && m.name))) + '</span>';
  }
  function ilya(t) {
    var s = Math.max(0, (Date.now() - t) / 1000);
    if (s < 60) return 'À l’instant';
    if (s < 3600) return 'Il y a ' + Math.floor(s / 60) + ' min';
    if (s < 86400) return 'Il y a ' + Math.floor(s / 3600) + ' h';
    var j = Math.floor(s / 86400);
    return j < 31 ? 'Il y a ' + j + ' j' : new Date(t).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }
  // Évolution : en % (quantités) ou en points (taux). Rien à comparer : rien d'affiché.
  function evol(a, b, pts) {
    if (a == null || b == null) return '';
    var v = pts ? Math.round(a - b) : b ? Math.round((a - b) / b * 100) : null;
    if (v === null) return a > 0 ? '<em class="bsceo-ev up">' + ic('ceo-haut', 12) + 'nouveau</em>' : '';
    if (!v) return '<em class="bsceo-ev nul">=</em>';
    return '<em class="bsceo-ev ' + (v > 0 ? 'up' : 'down') + '">' + ic(v > 0 ? 'ceo-haut' : 'ceo-bas', 12) + (v > 0 ? '+' : '') + v + (pts ? ' pts' : ' %') + '</em>';
  }
  function moyenne(l) { return l.length ? Math.round(l.reduce(function (a, b) { return a + b; }, 0) / l.length) : null; }

  // ---------------------------------------------------------------- données
  var S = { d: null, err: '', ia: null, perf: 7, survol: -1, survolEvo: -1, q: '' };
  var racine = null, globe = null;
  function etat() { var r = window.__bsStore; return r && r.get ? r.get() : {}; }
  function prospects() { return (etat().prospects || []).filter(function (p) { return p && !p.supprime; }); }
  function reglages() {
    var s = etat().settings || {};
    return { appels: Number(s.targetCallsWeek) || 175, rdv: Number(s.targetRdvWeek) || 10, ca: Number(s.targetCaMonth) || 5000 };
  }
  function appels() {
    var l = [];
    prospects().forEach(function (p) { (p.callLog || []).forEach(function (c) { if (c && c.date) l.push(c); }); });
    return l;
  }
  function api(url) {
    return fetch(url, { credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart' } })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { if (!r.ok) throw new Error(b.error || 'Erreur ' + r.status); return b; }); });
  }
  function charger() {
    api('/api/equipe/apercu').then(function (b) { S.d = b; S.err = ''; dessiner(); }, function (e) { S.err = e.message; dessiner(); });
    api('/api/ia/etat').then(function (b) { S.ia = !!b.ia; dessiner(); }, function () { S.ia = false; });
  }
  function ms(iso) { var t = Date.parse(iso); return isNaN(t) ? 0 : t; }
  function simsEntre(du, au, uid) { return ((S.d && S.d.simulations) || []).filter(function (s) { var t = ms(s.at); return t >= du && t < au && (!uid || s.userId === uid); }); }
  function notes(l) { return l.map(function (s) { return s.note; }); }
  function membre(id) { return ((S.d && S.d.membres) || []).filter(function (m) { return m.id === id; })[0] || null; }
  // Actif sur une période : connexion, message, simulation ou module de formation.
  function actifs(du, au) {
    var d = S.d, a = {};
    d.membres.forEach(function (m) { var t = ms(m.connexion); if (t >= du && t < au) a[m.id] = 1; });
    d.messages.forEach(function (x) { var t = ms(x.jour + 'T12:00:00'); if (t >= du && t < au) a[x.userId] = 1; });
    d.simulations.forEach(function (x) { var t = ms(x.at); if (t >= du && t < au) a[x.userId] = 1; });
    d.formation.forEach(function (x) { var t = ms(x.vuLe); if (t >= du && t < au) a[x.userId] = 1; });
    return Object.keys(a).filter(function (id) { return membre(id); }).length;
  }
  function modulesFormation() { var f = window.bsFormation; return f && f.modules && f.modules.length ? f.modules.length : 0; }
  function debutSemaine() { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; }

  // ---------------------------------------------------------------- encarts
  function zoneHero() {
    var n = USER && USER.name ? String(USER.name).trim().split(/\s+/)[0] : '';
    var d = S.d, now = Date.now();
    var k = [];
    if (d) {
      var a30 = actifs(now - 30 * J, now), a60 = actifs(now - 60 * J, now - 30 * J);
      var s7 = simsEntre(now - 7 * J, now), s14 = simsEntre(now - 14 * J, now - 7 * J);
      var r30 = simsEntre(now - 30 * J, now), r60 = simsEntre(now - 60 * J, now - 30 * J);
      var reussite = function (l) { return l.length ? Math.round(l.filter(function (s) { return s.note >= 70; }).length / l.length * 100) : null; };
      var t30 = reussite(r30), t60 = reussite(r60);
      var mois = d.ia.mois, part = d.ia.moisPrecedent ? Math.round(mois / d.ia.moisPrecedent * 100) : null;
      k = [
        { i: 'users', l: 'Équipe active', v: nb(a30), e: evol(a30, a60), s: 'sur les 30 derniers jours · ' + d.membres.length + ' membre' + (d.membres.length > 1 ? 's' : ''), t: 'Membres connectés ou actifs (messages, simulations, formation) ces 30 derniers jours' },
        { i: 'target', l: 'Simulations réalisées', v: nb(s7.length), e: evol(s7.length, s14.length), s: 'sur les 7 derniers jours', t: 'Simulations IA notées, toute l’équipe' },
        { i: 'star', l: 'Taux de réussite', v: t30 === null ? '–' : t30 + ' %', e: t30 === null ? '' : evol(t30, t60, true), s: 'simulations notées 70 ou plus', t: 'Part des simulations des 30 derniers jours notées 70/100 ou plus' },
        { i: 'database', l: 'Consommation IA', v: nb(mois), e: '', s: 'requêtes Claude ce mois' + (part === null ? '' : ' · ' + part + ' % du mois dernier'), barre: part === null ? null : Math.min(100, part), t: 'Requêtes envoyées à Claude (simulations, assistants, rédaction) depuis le 1er du mois' },
      ];
    }
    return '<section class="card bsceo-c bsceo-hero"><canvas class="bsceo-globe" aria-hidden="true"></canvas>' +
      '<div class="bsceo-hero-t"><span class="bsceo-badge">' + ic('award', 14) + 'Vue d’ensemble CEO</span>' +
      '<h1>' + (new Date().getHours() >= 18 ? 'Bonsoir' : 'Bonjour') + (n ? ' ' + esc(n) : '') + ',</h1><p>Voici un aperçu de la performance de votre entreprise aujourd’hui.</p></div>' +
      '<blockquote class="bsceo-citation">Les meilleures équipes ne sont pas les plus grandes, mais celles qui apprennent le plus vite.<cite>Blackstart AI</cite></blockquote>' +
      '<div class="bsceo-kpis">' + (d ? k.map(function (x) {
        return '<div class="bsceo-kpi" title="' + esc(x.t) + '"><span class="bsceo-kpi-ic">' + ic(x.i, 20) + '</span><div><small>' + esc(x.l) + '</small><b>' + x.v + x.e + '</b>' +
          (x.barre != null ? '<i class="bsceo-jauge"><i style="width:' + x.barre + '%"></i></i>' : '') + '<span>' + esc(x.s) + '</span></div></div>';
      }).join('') : '<p class="bsceo-charge">' + (S.err ? esc(S.err) : 'Chargement des chiffres de l’équipe…') + '</p>') + '</div></section>';
  }

  function zoneIA() {
    var d = S.d, now = Date.now(), points = [];
    if (d) {
      var s7 = simsEntre(now - 7 * J, now).length, s14 = simsEntre(now - 14 * J, now - 7 * J).length;
      points.push(s7 || s14 ? 'Simulations cette semaine : ' + s7 + (s14 ? ' (' + (s7 >= s14 ? '+' : '') + Math.round((s7 - s14) / s14 * 100) + ' %)' : '') : 'Aucune simulation cette semaine : lancez l’équipe sur Simulations IA');
      var faibles = d.membres.filter(function (m) { var l = notes(simsEntre(now - 30 * J, now, m.id)); return l.length && moyenne(l) < 60; }).length;
      points.push(faibles + ' membre' + (faibles > 1 ? 's' : '') + ' à accompagner (score < 60)');
      var ps = prospects(), j = jour(), retard = ps.filter(function (p) { return p.prochaineRelance && p.prochaineRelance < j && ['client_signe', 'perdu', 'resilie'].indexOf(p.statut) < 0; }).length;
      points.push(retard ? retard + ' relance' + (retard > 1 ? 's' : '') + ' en retard sur les prospects' : 'Aucune relance en retard');
      points.push('Requêtes Claude ce mois : ' + nb(d.ia.mois));
    }
    var etatIa = S.ia === null ? '' : S.ia ? '<span class="bsceo-ligne on">En ligne</span>' : '<span class="bsceo-ligne">Clé Claude à coller</span>';
    return '<section class="card bsceo-c bsceo-ia"><div class="bsceo-tete"><span class="bsceo-logo">' + ic('sparkles', 16) + '</span><h2>Assistant IA</h2>' + etatIa + '</div>' +
      '<div class="bsceo-ia-box"><p>Voici les points clés à surveiller cette semaine :</p><ul>' + points.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      '<a class="btn btn-primary btn-sm bsceo-rapport" href="#/dashboard">Voir le rapport détaillé' + ic('ceo-fleche', 15) + '</a></div>' +
      '<form class="bsceo-q"><input name="q" maxlength="600" placeholder="Posez une question à votre assistant…" aria-label="Question pour l’assistant CEO" value="' + esc(S.q) + '"><button type="submit" class="btn btn-primary" aria-label="Envoyer à l’assistant CEO">' + ic('send', 16) + '</button></form></section>';
  }

  // Courbes lissées (Bézier) ; les jours sans donnée coupent la courbe.
  function courbe(pts) {
    var out = '', prev = null;
    pts.forEach(function (p) {
      if (!p) { prev = null; return; }
      if (!prev) out += 'M' + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
      else { var cx = (prev[0] + p[0]) / 2; out += 'C' + cx.toFixed(1) + ' ' + prev[1].toFixed(1) + ' ' + cx.toFixed(1) + ' ' + p[1].toFixed(1) + ' ' + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
      prev = p;
    });
    return out;
  }
  function seriesPerf(n) {
    var jours = [], i, ap = appels();
    for (i = n - 1; i >= 0; i--) jours.push(decale(-i));
    return jours.map(function (dj) {
      var sims = ((S.d && S.d.simulations) || []).filter(function (s) { return jour(new Date(ms(s.at))) === dj; });
      var a = ap.filter(function (c) { return c.date === dj; }), joints = a.filter(function (c) { return c.outcome && c.outcome !== 'injoignable'; });
      var rdv = joints.filter(function (c) { return c.outcome === 'rdv_pris'; }).length;
      return { d: dj, v: [moyenne(notes(sims)), a.length ? Math.round(joints.length / a.length * 100) : null, joints.length ? Math.round(rdv / joints.length * 100) : null], n: [sims.length, a.length, rdv] };
    });
  }
  function zonePerf() {
    var n = S.perf, l = seriesPerf(n), W = 360, H = 150, G = 26, B = 18;
    var x = function (k) { return G + k * (W - G - 6) / Math.max(1, n - 1); }, y = function (v) { return 6 + (100 - v) / 100 * (H - B - 6); };
    var vide = l.every(function (j) { return j.v.every(function (v) { return v === null; }); });
    var grille = [0, 25, 50, 75, 100].map(function (v) { return '<line x1="' + G + '" x2="' + W + '" y1="' + y(v) + '" y2="' + y(v) + '" class="bsceo-grille"/><text x="' + (G - 6) + '" y="' + (y(v) + 3) + '" text-anchor="end">' + v + '</text>'; }).join('');
    var pas = n > 7 ? 5 : 1, axe = l.map(function (j, k) { return k % pas && k !== n - 1 ? '' : '<text x="' + x(k) + '" y="' + (H - 3) + '" text-anchor="middle">' + esc(new Date(j.d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })) + '</text>'; }).join('');
    var lignes = SERIES.map(function (s, si) {
      var pts = l.map(function (j, k) { return j.v[si] === null ? null : [x(k), y(j.v[si])]; });
      return '<path d="' + courbe(pts) + '" fill="none" stroke="' + s[1] + '" stroke-width="2.2" stroke-linecap="round" vector-effect="non-scaling-stroke"/>' +
        pts.map(function (p) { return p ? '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="2.4" fill="' + s[1] + '"/>' : ''; }).join('');
    }).join('');
    var sv = S.survol >= 0 && S.survol < n ? l[S.survol] : null;
    var bulle = sv ? '<div class="bsceo-bulle" style="left:' + (x(S.survol) / W * 100).toFixed(1) + '%"><b>' + esc(new Date(sv.d + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' })) + '</b>' +
      SERIES.map(function (s, si) { return '<span><i style="background:' + s[1] + '"></i>' + s[0] + '<b>' + (sv.v[si] === null ? '–' : sv.v[si] + ' %') + '</b></span>'; }).join('') + '</div>' : '';
    return '<div class="bsceo-tete">' + ic('chart-line', 18) + '<h2>Performance des équipes</h2><select data-f="perf" aria-label="Période"><option value="7"' + (n === 7 ? ' selected' : '') + '>7 derniers jours</option><option value="30"' + (n === 30 ? ' selected' : '') + '>30 derniers jours</option></select></div>' +
      '<div class="bsceo-legende">' + SERIES.map(function (s, si) { return '<span title="' + ['Note moyenne des simulations IA', 'Part des appels où le contact a décroché', 'Part des appels décrochés qui donnent un rendez-vous'][si] + '"><i style="background:' + s[1] + '"></i>' + s[0] + '</span>'; }).join('') + '</div>' +
      '<div class="bsceo-graph" data-graph="perf"><svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="Note des simulations, appels décrochés et rendez-vous par jour, en pourcentage">' + grille + axe +
      (sv ? '<line x1="' + x(S.survol) + '" x2="' + x(S.survol) + '" y1="6" y2="' + (H - B) + '" class="bsceo-curseur"/>' : '') + lignes + '</svg>' + bulle +
      (vide ? '<p class="bsceo-vide-g">Pas encore de simulation ni d’appel sur la période.</p>' : '') + '</div>';
  }

  function donut(parts, total) {
    var R = 54, C = 2 * Math.PI * R, off = 0;
    return '<svg viewBox="0 0 140 140" class="bsceo-donut" role="img" aria-label="' + total + ' simulations"><circle cx="70" cy="70" r="' + R + '" fill="none" stroke="var(--border)" stroke-width="14"/>' +
      parts.map(function (p) {
        var l = total ? p.n / total * C : 0, s = '<circle cx="70" cy="70" r="' + R + '" fill="none" stroke="' + p.c + '" stroke-width="14" stroke-dasharray="' + Math.max(0, l - 2).toFixed(2) + ' ' + C.toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 70 70)" stroke-linecap="butt"/>';
        off += l; return s;
      }).join('') + '</svg>';
  }
  function zoneFormations() {
    var d0 = new Date(); d0.setDate(1); d0.setHours(0, 0, 0, 0);
    var l = simsEntre(d0.getTime(), Date.now() + 60000), total = l.length;
    var parts = FAMILLES.map(function (f) { return { l: f[1], c: f[2], n: l.filter(function (s) { return s.famille === f[0]; }).length }; });
    return '<div class="bsceo-tete">' + ic('chart-pie', 18) + '<h2>Répartition des formations</h2><span class="bsceo-puce">Ce mois-ci</span></div>' +
      '<div class="bsceo-forma"><div class="bsceo-donut-w">' + donut(parts, total) + '<div><b>' + nb(total) + '</b><span>simulation' + (total > 1 ? 's' : '') + '</span></div></div>' +
      '<ul>' + parts.map(function (p) { return '<li><i style="background:' + p.c + '"></i>' + esc(p.l) + '<b>' + (total ? Math.round(p.n / total * 100) : 0) + ' %</b></li>'; }).join('') + '</ul></div>' +
      (total ? '' : '<a class="bsceo-lien" href="#/entrainement">Lancer une simulation IA' + ic('ceo-fleche', 14) + '</a>');
  }

  function zoneActivite() {
    var d = S.d, l = [];
    if (d) {
      d.simulations.slice(0, 12).forEach(function (s) { l.push({ t: ms(s.at), m: membre(s.userId), x: 'a terminé une simulation', b: s.note + ' / 100', bon: s.note >= 70, sous: s.titre }); });
      var titres = {}; ((window.bsFormation && window.bsFormation.modules) || []).forEach(function (m) { if (m && m.f) titres[m.f] = m.t; });
      d.formation.forEach(function (f) { if (f.vuLe) l.push({ t: ms(f.vuLe), m: membre(f.userId), x: 'a complété un module de formation', b: f.quiz == null ? '' : 'Quiz ' + f.quiz + '/10', bon: f.quiz >= 7, sous: titres[f.module] || '' }); });
      d.membres.forEach(function (m) { l.push({ t: ms(m.creeLe), m: m, x: 'a rejoint l’équipe', b: '', sous: m.poste || '' }); });
    }
    l = l.filter(function (a) { return a.m && a.t && a.t <= Date.now() + 60000; }).sort(function (a, b) { return b.t - a.t; }).slice(0, 5);
    return '<div class="bsceo-tete">' + ic('activity', 18) + '<h2>Activité récente</h2></div>' +
      (l.length ? '<ul class="bsceo-act">' + l.map(function (a) {
        return '<li>' + avatar(a.m, 36) + '<div><b>' + esc(a.m.name) + '</b><span>' + esc(a.x) + (a.sous ? ' · ' + esc(a.sous) : '') + '</span><small>' + esc(ilya(a.t)) + '</small></div>' + (a.b ? '<em class="' + (a.bon ? 'bon' : '') + '">' + esc(a.b) + '</em>' : '') + '</li>';
      }).join('') + '</ul>' : '<p class="bsceo-vide">' + (d ? 'Les simulations, formations et arrivées de l’équipe apparaîtront ici.' : 'Chargement…') + '</p>');
  }

  function duree(s) { s = Math.round(s); return s >= 60 ? Math.floor(s / 60) + 'm ' + deux(s % 60) + 's' : s + 's'; }
  function zoneEvolution() {
    var now = Date.now(), d30 = decale(-29), d60 = decale(-59), ap = appels();
    var cur = ap.filter(function (c) { return c.date >= d30; }), av = ap.filter(function (c) { return c.date >= d60 && c.date < d30; });
    var dur = function (l) { var x = l.map(function (c) { return Number(c.duration) || 0; }).filter(function (v) { return v > 0; }); return x.length ? x.reduce(function (a, b) { return a + b; }, 0) / x.length : null; };
    var taux = function (l) { return l.length ? Math.round(l.filter(function (c) { return c.outcome === 'rdv_pris'; }).length / l.length * 100) : null; };
    var signes = function (l) { return l.filter(function (c) { return c.outcome === 'client_signe'; }).length; };
    var sc = moyenne(notes(simsEntre(now - 30 * J, now))), scAv = moyenne(notes(simsEntre(now - 60 * J, now - 30 * J)));
    var du1 = dur(cur), du0 = dur(av), t1 = taux(cur), t0 = taux(av);
    var tuiles = [
      ['Score moyen', sc === null ? '–' : sc + ' %', sc === null ? '' : evol(sc, scAv, true), 'Note moyenne des simulations IA sur 30 jours'],
      ['Durée d’appel', du1 === null ? '–' : duree(du1), du1 === null ? '' : evol(du1, du0), 'Appels avec une durée enregistrée, 30 jours'],
      ['Conversion', t1 === null ? '–' : t1 + ' %', t1 === null ? '' : evol(t1, t0, true), 'Appels qui donnent un rendez-vous, 30 jours'],
      ['Clients signés', nb(signes(cur)), evol(signes(cur), signes(av)), 'Appels conclus par une signature, 30 jours'],
    ];
    // Courbe : note moyenne des simulations par jour sur 30 jours.
    var jours = [], i;
    for (i = 29; i >= 0; i--) jours.push(decale(-i));
    var v = jours.map(function (dj) { return moyenne(notes(((S.d && S.d.simulations) || []).filter(function (s) { return jour(new Date(ms(s.at))) === dj; }))); });
    var W = 360, H = 120, G = 30, B = 16, x = function (k) { return G + k * (W - G - 6) / 29; }, y = function (q) { return 6 + (100 - q) / 100 * (H - B - 6); };
    var pts = v.map(function (q, k) { return q === null ? null : [x(k), y(q)]; }), defs = pts.filter(Boolean);
    var lisse = courbe(defs), aire = defs.length > 1 ? lisse + ' L' + defs[defs.length - 1][0].toFixed(1) + ' ' + (H - B) + ' L' + defs[0][0].toFixed(1) + ' ' + (H - B) + ' Z' : '';
    var dernier = defs[defs.length - 1], kSv = S.survolEvo >= 0 && v[S.survolEvo] !== null ? S.survolEvo : -1;
    if (kSv < 0 && S.survolEvo >= 0) { var best = -1; v.forEach(function (q, k) { if (q !== null && (best < 0 || Math.abs(k - S.survolEvo) < Math.abs(best - S.survolEvo))) best = k; }); kSv = best; }
    var grille = [0, 25, 50, 75, 100].map(function (q) { return '<line x1="' + G + '" x2="' + W + '" y1="' + y(q) + '" y2="' + y(q) + '" class="bsceo-grille"/><text x="' + (G - 5) + '" y="' + (y(q) + 3) + '" text-anchor="end">' + q + '%</text>'; }).join('');
    var axe = jours.map(function (dj, k) { return k % 6 && k !== 29 ? '' : '<text x="' + x(k) + '" y="' + (H - 2) + '" text-anchor="middle">' + esc(new Date(dj + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })) + '</text>'; }).join('');
    return '<div class="bsceo-tete">' + ic('chart-spline', 18) + '<h2>Évolution des performances</h2><span class="bsceo-puce">30 jours</span></div>' +
      '<div class="bsceo-tuiles">' + tuiles.map(function (t) { return '<div title="' + esc(t[3]) + '"><small>' + esc(t[0]) + '</small><b>' + t[1] + '</b>' + (t[2] || '<em class="bsceo-ev nul">&nbsp;</em>') + '</div>'; }).join('') + '</div>' +
      '<div class="bsceo-graph" data-graph="evo"><svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="Score moyen des simulations par jour sur 30 jours">' +
      '<defs><linearGradient id="bsceoAire" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b82f6" stop-opacity=".5"/><stop offset="1" stop-color="#3b82f6" stop-opacity="0"/></linearGradient></defs>' + grille + axe +
      (aire ? '<path d="' + aire + '" fill="url(#bsceoAire)"/>' : '') + '<path d="' + lisse + '" fill="none" stroke="#4f8bff" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      (dernier ? '<circle cx="' + dernier[0].toFixed(1) + '" cy="' + dernier[1].toFixed(1) + '" r="4" fill="#fff" stroke="#4f8bff" stroke-width="2"/>' : '') + '</svg>' +
      (kSv >= 0 ? '<div class="bsceo-bulle" style="left:' + (x(kSv) / W * 100).toFixed(1) + '%"><b>' + esc(new Date(jours[kSv] + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })) + '</b><span>Score moyen<b>' + v[kSv] + ' %</b></span></div>' : '') +
      (defs.length ? '' : '<p class="bsceo-vide-g">La courbe se remplit avec les simulations notées.</p>') + '</div>';
  }

  var POSTES = [[/vent|commerc|sales|clos|business|bdr|sdr/i, 'users', '#3b82f6'], [/market|commun|content/i, 'megaphone', '#06b6d4'], [/produit|product|tech|dev/i, 'package', '#f97316'],
    [/support|service|client|succ/i, 'headset', '#6366f1'], [/direct|ceo|fond|gérant|manag|chef|respons/i, 'briefcase', '#8b5cf6']];
  function zoneDepartements() {
    var d = S.d, now = Date.now(), g = {};
    if (d) d.membres.forEach(function (m) { var k = (m.poste || (m.role === 'admin' ? 'Direction' : 'Équipe')).trim(); (g[k] = g[k] || []).push(m); });
    var l = Object.keys(g).map(function (k) {
      var ids = g[k].map(function (m) { return m.id; });
      var cur = notes(simsEntre(now - 30 * J, now).filter(function (s) { return ids.indexOf(s.userId) >= 0; })), av = notes(simsEntre(now - 60 * J, now - 30 * J).filter(function (s) { return ids.indexOf(s.userId) >= 0; }));
      var st = POSTES.filter(function (p) { return p[0].test(k); })[0] || [null, 'users-round', '#64748b'];
      return { k: k, n: g[k].length, v: moyenne(cur), av: moyenne(av), i: st[1], c: st[2] };
    }).sort(function (a, b) { return b.n - a.n || (b.v || 0) - (a.v || 0); }).slice(0, 5);
    return '<div class="bsceo-tete">' + ic('building', 18) + '<h2>Répartition par département</h2><span class="bsceo-puce">30 jours</span></div>' +
      (l.length ? '<ul class="bsceo-dep">' + l.map(function (x) {
        return '<li><span class="bsceo-dep-ic" style="--c:' + x.c + '">' + ic(x.i, 18) + '</span><div><b>' + esc(x.k) + '</b><small>' + x.n + ' membre' + (x.n > 1 ? 's' : '') + '</small></div>' +
          '<i class="bsceo-barre"><i style="width:' + (x.v || 0) + '%"></i></i><strong>' + (x.v === null ? '–' : x.v + ' %') + '</strong>' + (x.v === null ? '<em class="bsceo-ev nul">&nbsp;</em>' : evol(x.v, x.av, true)) + '</li>';
      }).join('') + '</ul><p class="bsceo-note">Score moyen des simulations par poste (organigramme).</p>' : '<p class="bsceo-vide">Chargement…</p>');
  }

  function zoneObjectifs() {
    var o = reglages(), deb = jour(debutSemaine()), mois = jour().slice(0, 7), ap = appels();
    var sem = ap.filter(function (c) { return c.date >= deb; }), rdv = sem.filter(function (c) { return c.outcome === 'rdv_pris'; }).length;
    var ca = ap.filter(function (c) { return c.outcome === 'client_signe' && String(c.date).slice(0, 7) === mois; }).reduce(function (a, c) { return a + (Number(c.dealValue) || 0); }, 0);
    var nbMod = modulesFormation(), d = S.d, formes = null;
    if (d && nbMod) {
      var vus = {};
      d.formation.forEach(function (f) { if (f.vuLe) vus[f.userId] = (vus[f.userId] || 0) + 1; });
      formes = d.membres.length ? Math.round(d.membres.filter(function (m) { return (vus[m.id] || 0) >= nbMod; }).length / d.membres.length * 100) : 0;
    }
    var pct = function (a, b) { return b ? Math.min(100, Math.round(a / b * 100)) : 0; };
    var pr = pct(rdv, o.rdv);
    var items = [
      ['Appels de la semaine', pct(sem.length, o.appels), nb(sem.length) + ' / ' + nb(o.appels)],
      ['Chiffre d’affaires du mois', pct(ca, o.ca), nb(ca) + ' € / ' + nb(o.ca) + ' €'],
    ];
    if (formes !== null) items.push(['Former 100 % de l’équipe', formes, formes + ' % formés']);
    return '<div class="bsceo-tete">' + ic('target', 18) + '<h2>Objectifs &amp; progression</h2><a class="bsceo-voir" href="#/settings">Modifier' + ic('ceo-fleche', 13) + '</a></div>' +
      '<div class="bsceo-obj-main"><span class="bsceo-obj-ic">' + ic('target', 22) + '</span><div><small>Objectif de la semaine</small><b>' + nb(o.rdv) + ' rendez-vous obtenus en appel</b>' +
      '<i class="bsceo-barre grand"><i style="width:' + pr + '%"></i></i><span>' + rdv + ' / ' + o.rdv + ' rendez-vous</span></div><strong>' + pr + ' %</strong></div>' +
      '<ul class="bsceo-obj">' + items.map(function (x) {
        return '<li><span class="bsceo-ok' + (x[1] >= 100 ? ' fini' : x[1] > 0 ? ' encours' : '') + '">' + ic(x[1] >= 100 ? 'circle-check' : 'loader-circle', 17) + '</span><span>' + esc(x[0]) + '<small>' + esc(x[2]) + '</small></span><b>' + x[1] + ' %</b></li>';
      }).join('') + '</ul>';
  }

  function anneau(v) {
    var R = 17, C = 2 * Math.PI * R, l = v == null ? 0 : v / 100 * C;
    return '<span class="bsceo-anneau"><svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="' + R + '" fill="none" stroke="var(--border)" stroke-width="4"/>' +
      '<circle cx="21" cy="21" r="' + R + '" fill="none" stroke="url(#bsceoAnneau)" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + l.toFixed(1) + ' ' + C.toFixed(1) + '" transform="rotate(-90 21 21)"/></svg><b>' + (v == null ? '–' : v + '%') + '</b></span>';
  }
  function zoneEquipes() {
    var d = S.d, now = Date.now();
    var l = d ? d.membres.map(function (m) {
      var cur = notes(simsEntre(now - 30 * J, now, m.id)), av = notes(simsEntre(now - 60 * J, now - 30 * J, m.id));
      return { m: m, v: moyenne(cur), av: moyenne(av), n: cur.length };
    }).sort(function (a, b) { return (b.v == null ? -1 : b.v) - (a.v == null ? -1 : a.v) || b.n - a.n; }) : [];
    return '<div class="bsceo-tete">' + ic('crown', 18) + '<h2>Vos équipes en un coup d’œil</h2><a class="bsceo-voir" href="#/messages" data-act="organigramme">Voir tous les membres' + ic('ceo-fleche', 13) + '</a></div>' +
      '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="bsceoAnneau" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset="1" stop-color="#6366f1"/></linearGradient></defs></svg>' +
      (l.length ? '<div class="bsceo-eq">' + l.slice(0, 5).map(function (x) {
        var moi = USER && x.m.id === USER.id;
        return '<div class="bsceo-membre">' + avatar(x.m, 40) + '<div class="bsceo-membre-t"><b>' + esc(x.m.name) + '</b><small>' + esc(x.m.poste || (x.m.role === 'admin' ? 'Administrateur' : 'Membre')) + '</small></div>' +
          '<div class="bsceo-membre-b">' + anneau(x.v) + (x.v == null ? '<small class="bsceo-sans">' + (x.n ? '' : 'pas de simulation') + '</small>' : evol(x.v, x.av, true)) +
          '<button type="button" class="bsceo-rond" ' + (moi ? 'data-act="organigramme" aria-label="Voir l’organigramme"' : 'data-ecrire="' + esc(x.m.id) + '" aria-label="Écrire à ' + esc(x.m.name) + '"') + '>' + ic('ceo-fleche', 15) + '</button></div></div>';
      }).join('') + '</div>' : '<p class="bsceo-vide">Chargement…</p>');
  }

  function zoneOffre() {
    return '<div class="bsceo-offre-fond" aria-hidden="true"><svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice">' + ville() + '</svg></div>' +
      '<div class="bsceo-offre-t"><h2>Passez au niveau supérieur</h2><p>Entraînez toute l’équipe avec Blackstart AI Sales Intelligence : appels vocaux avec des prospects IA, analyse de chaque appel et coaching.</p>' +
      '<a class="btn btn-primary bsceo-offre-btn" href="' + SALES + '" target="_blank" rel="noopener">Voir les options Enterprise' + ic('ceo-fleche', 15) + '</a></div>';
  }
  function ville() {
    var s = '', x = 0, g = 7;
    while (x < 400) {
      var w = 14 + (g = (g * 37 + 11) % 97) % 26, h = 40 + (g * 13) % 120;
      s += '<rect x="' + x + '" y="' + (200 - h) + '" width="' + w + '" height="' + h + '" fill="rgba(59,91,219,.28)"/>';
      for (var fy = 200 - h + 6; fy < 196; fy += 9) for (var fx = x + 3; fx < x + w - 3; fx += 6) if ((fx * 7 + fy * 3 + g) % 5 === 0) s += '<rect x="' + fx + '" y="' + fy + '" width="2.4" height="3" fill="rgba(147,197,253,.75)"/>';
      x += w + 2;
    }
    return s;
  }

  // ---------------------------------------------------------------- globe du bandeau (points lumineux en rotation)
  function lancerGlobe() {
    var cv = racine && racine.querySelector('.bsceo-globe');
    if (!cv) return;
    if (globe && globe.cv === cv) return;
    if (globe) globe.stop();
    var ctx = cv.getContext('2d'); if (!ctx) return;
    var pts = [], N = 1400, i;
    for (i = 0; i < N; i++) { var yy = 1 - (i + 0.5) / N * 2, r = Math.sqrt(1 - yy * yy), th = i * 2.399963; pts.push([Math.cos(th) * r, yy, Math.sin(th) * r, (i * 7919) % 13 === 0]); }
    var fige = /reduced|none/.test(document.documentElement.getAttribute('data-motion') || ''), fini = false, img = 0, prec = 0;
    function taille() { var b = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 1.5); cv.width = Math.max(1, Math.round(b.width * dpr)); cv.height = Math.max(1, Math.round(b.height * dpr)); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); return b; }
    var b = taille();
    function dessin(t) {
      var W = b.width, H = b.height, R = Math.min(W * 0.62, H * 1.05), cx = W * 0.62, cy = H * 0.98, a = t * 0.00006;
      ctx.clearRect(0, 0, W, H);
      var halo = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.25);
      halo.addColorStop(0, 'rgba(59,130,246,.28)'); halo.addColorStop(1, 'rgba(59,130,246,0)');
      ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, 7); ctx.fill();
      var corps = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.5, R * 0.1, cx, cy, R);
      corps.addColorStop(0, 'rgba(30,64,175,.55)'); corps.addColorStop(1, 'rgba(8,15,40,.9)');
      ctx.fillStyle = corps; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(125,180,255,.55)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI, 2 * Math.PI); ctx.stroke();
      var ca = Math.cos(a), sa = Math.sin(a), ct = Math.cos(0.35), st = Math.sin(0.35);
      for (var k = 0; k < N; k++) {
        var p = pts[k], x = p[0] * ca + p[2] * sa, z = -p[0] * sa + p[2] * ca, y = p[1] * ct - z * st; z = p[1] * st + z * ct;
        if (z < 0) continue;
        var px = cx + x * R, py = cy - y * R;
        if (py > H || px < 0 || px > W) continue;
        ctx.globalAlpha = 0.25 + z * 0.65;
        ctx.fillStyle = p[3] ? '#e0f2fe' : '#60a5fa';
        var s = p[3] ? 2.2 : 1.3; ctx.fillRect(px, py, s, s);
      }
      ctx.globalAlpha = 1;
    }
    function boucle(t) { if (fini) return; img = requestAnimationFrame(boucle); if (!cv.isConnected) { stop(); return; } if (document.hidden || t - prec < 40) return; prec = t; dessin(t); }
    function surTaille() { b = taille(); dessin(performance.now()); }
    function stop() { fini = true; cancelAnimationFrame(img); window.removeEventListener('resize', surTaille); }
    window.addEventListener('resize', surTaille);
    dessin(performance.now()); if (!fige) img = requestAnimationFrame(boucle);
    globe = { cv: cv, stop: stop };
  }

  // ---------------------------------------------------------------- page
  function dessiner() {
    if (!racine || !racine.isConnected) return;
    var garder = racine.querySelector('.bsceo-q input'), focus = garder && document.activeElement === garder;
    if (!racine.querySelector('.bsceo')) {
      racine.innerHTML = '<div class="bsceo">' +
        '<div data-z="hero" class="bsceo-z-hero"></div><div data-z="ia" class="bsceo-z-ia"></div>' +
        '<section class="card bsceo-c" data-z="perf"></section><section class="card bsceo-c" data-z="forma"></section><section class="card bsceo-c bsceo-z-act" data-z="act"></section>' +
        '<section class="card bsceo-c" data-z="evo"></section><section class="card bsceo-c" data-z="dep"></section><section class="card bsceo-c" data-z="obj"></section>' +
        '<section class="card bsceo-c bsceo-z-eq" data-z="eq"></section><section class="card bsceo-c bsceo-offre" data-z="offre"></section></div>';
      racine.querySelector('[data-z=offre]').innerHTML = zoneOffre();
    }
    var z = function (n) { return racine.querySelector('[data-z=' + n + ']'); };
    var hero = z('hero'), cv = hero.querySelector('canvas');
    if (cv) { var h2 = zoneHero(), tmp = document.createElement('div'); tmp.innerHTML = h2; var neuf = tmp.firstChild; neuf.replaceChild(cv, neuf.querySelector('canvas')); hero.replaceChildren(neuf); }
    else hero.innerHTML = zoneHero();
    if (!focus) z('ia').innerHTML = zoneIA();
    z('perf').innerHTML = zonePerf();
    z('forma').innerHTML = zoneFormations();
    z('act').innerHTML = zoneActivite();
    z('evo').innerHTML = zoneEvolution();
    z('dep').innerHTML = zoneDepartements();
    z('obj').innerHTML = zoneObjectifs();
    z('eq').innerHTML = zoneEquipes();
    lancerGlobe();
  }
  function brancher(el) {
    el.addEventListener('change', function (ev) { var t = ev.target; if (t.dataset && t.dataset.f === 'perf') { S.perf = Number(t.value) || 7; S.survol = -1; dessiner(); } });
    el.addEventListener('input', function (ev) { if (ev.target.name === 'q' && ev.target.closest('.bsceo-q')) S.q = ev.target.value; });
    el.addEventListener('submit', function (ev) {
      var f = ev.target.closest('.bsceo-q'); if (!f) return;
      ev.preventDefault();
      var q = (f.querySelector('input').value || '').trim(), A = window.bsAssistants;
      if (!q || !A) return;
      // Question posée à l'Assistant CEO, réponse sur la page des assistants.
      try { localStorage.setItem('bs-assistants-choisi', 'ceo'); } catch (e) { /* facultatif */ }
      if (A.etat) A.etat().choisi = 'ceo';
      A.envoyer('ceo', q);
      S.q = ''; location.hash = '#/assistants';
    });
    el.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-ecrire],[data-act]'); if (!b || !el.contains(b)) return;
      if (b.dataset.ecrire && window.bsMessages && window.bsMessages.ecrireA) { ev.preventDefault(); window.bsMessages.ecrireA(b.dataset.ecrire); return; }
      if (b.dataset.act === 'organigramme' && window.bsMessages && window.bsMessages.organigramme) { ev.preventDefault(); window.bsMessages.organigramme(); }
    });
    el.addEventListener('pointermove', function (ev) {
      var g = ev.target.closest && ev.target.closest('[data-graph]');
      if (!g) return;
      var r = g.getBoundingClientRect(), W = 360, G = g.dataset.graph === 'perf' ? 26 : 30, n = g.dataset.graph === 'perf' ? S.perf : 30;
      var k = Math.round(((ev.clientX - r.left) / r.width * W - G) / (W - G - 6) * (n - 1));
      k = Math.max(0, Math.min(n - 1, k));
      if (g.dataset.graph === 'perf' && k !== S.survol) { S.survol = k; racine.querySelector('[data-z=perf]').innerHTML = zonePerf(); }
      if (g.dataset.graph === 'evo' && k !== S.survolEvo) { S.survolEvo = k; racine.querySelector('[data-z=evo]').innerHTML = zoneEvolution(); }
    });
    el.addEventListener('pointerleave', function () {
      if (S.survol >= 0) { S.survol = -1; var p = racine.querySelector('[data-z=perf]'); if (p) p.innerHTML = zonePerf(); }
      if (S.survolEvo >= 0) { S.survolEvo = -1; var e = racine.querySelector('[data-z=evo]'); if (e) e.innerHTML = zoneEvolution(); }
    });
  }

  // Monté par la page Aujourd'hui (administrateurs) : se recharge à chaque visite et suit les prospects du CRM.
  function monter(el) {
    if (!el || !USER || USER.role !== 'admin') return false;
    css();
    if (racine !== el) { racine = el; brancher(el); }
    dessiner(); charger();
    return true;
  }
  var minuteur = 0;
  function rafraichir() { clearTimeout(minuteur); minuteur = setTimeout(dessiner, 250); }

  var cssFait = false;
  function css() {
    if (cssFait) return; cssFait = true;
    var st = document.createElement('style'); st.id = 'bs-ceo-css';
    st.textContent = [
      '.bsceo{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,.94fr);gap:14px;margin-bottom:22px}',
      '.bsceo-z-hero{grid-column:1/3;display:flex}.bsceo-z-ia{display:flex}.bsceo-z-eq{grid-column:1/3}',
      '.bsceo-c{position:relative;padding:16px 18px!important;min-width:0;border-radius:16px}',
      '.bsceo-tete{display:flex;align-items:center;gap:9px;margin-bottom:12px;color:var(--text)}.bsceo-tete>.ic{color:var(--neon,var(--accent))}',
      '.bsceo-tete h2{margin:0;font-size:14.5px;font-weight:700;flex:1;min-width:0}',
      '.bsceo-tete select,.bsceo-puce{font:inherit;font-size:11.5px;color:var(--text-2);background:color-mix(in srgb,var(--surface) 70%,transparent);border:1px solid var(--neon-line,var(--border));border-radius:8px;padding:5px 8px}',
      '.bsceo-voir{font-size:11.5px;color:var(--neon,var(--accent));text-decoration:none;display:inline-flex;align-items:center;gap:4px;white-space:nowrap}',
      // Bandeau
      '.bsceo-hero{flex:1;overflow:hidden;display:grid;grid-template-columns:1fr minmax(150px,.42fr);grid-template-rows:auto 1fr;gap:6px 18px;min-height:250px;background:radial-gradient(70% 90% at 70% 100%,rgba(37,99,235,.28),transparent 70%),var(--aur-glass,var(--surface))!important}',
      '.bsceo-globe{position:absolute;right:0;top:0;width:68%;height:100%;pointer-events:none;-webkit-mask-image:linear-gradient(90deg,transparent,#000 30%);mask-image:linear-gradient(90deg,transparent,#000 30%)}',
      '.bsceo-hero-t{position:relative;z-index:1}.bsceo-hero h1{margin:10px 0 4px;font-size:28px;font-weight:800;letter-spacing:-.01em;color:var(--text)}.bsceo-hero p{margin:0;color:var(--text-2);font-size:14px}',
      '.bsceo-badge{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600;color:var(--text);padding:5px 10px;border-radius:999px;border:1px solid var(--neon-line-hi,var(--border));background:color-mix(in srgb,var(--surface) 60%,transparent)}',
      '.bsceo-citation{position:relative;z-index:1;margin:6px 0 0;font-size:12.5px;line-height:1.55;color:var(--text);max-width:230px;justify-self:end;text-shadow:0 1px 8px rgba(0,0,0,.6)}',
      '.bsceo-citation cite{display:block;margin-top:8px;font-style:normal;font-size:11px;color:var(--text-3)}.bsceo-citation cite::before{content:"— "}',
      '.bsceo-kpis{grid-column:1/-1;position:relative;z-index:1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;align-self:end}',
      '.bsceo-kpi{display:flex;gap:11px;align-items:center;padding:12px;border-radius:13px;border:1px solid var(--neon-line,var(--border));background:color-mix(in srgb,var(--surface) 72%,transparent);backdrop-filter:blur(6px);min-width:0}',
      '.bsceo-kpi-ic{flex:none;display:grid;place-items:center;width:42px;height:42px;border-radius:50%;color:#fff;background:radial-gradient(circle at 30% 30%,#3b82f6,#1e3a8a);box-shadow:0 0 18px -4px #3b82f6}',
      '.bsceo-kpi>div{min-width:0}.bsceo-kpi small{display:block;font-size:11.5px;color:var(--text-2)}.bsceo-kpi b{display:flex;flex-wrap:wrap;align-items:baseline;column-gap:7px;font-size:21px;font-weight:800;color:var(--text);margin:2px 0;white-space:nowrap}',
      '.bsceo-kpi>div>span{display:block;font-size:10.5px;line-height:1.35;color:var(--text-3)}.bsceo-ev{white-space:nowrap}',
      '.bsceo-jauge{display:block;height:5px;border-radius:9px;background:var(--border);margin:3px 0 4px;overflow:hidden}.bsceo-jauge i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#22d3ee,#6366f1)}',
      '.bsceo-ev{display:inline-flex;align-items:center;gap:2px;font-size:11px;font-weight:700;font-style:normal;color:#22c55e}.bsceo-ev.down{color:#f87171}.bsceo-ev.nul{color:var(--text-3)}',
      '.bsceo-charge{grid-column:1/-1;color:var(--text-3);font-size:13px}',
      // Assistant
      '.bsceo-ia{flex:1;display:flex;flex-direction:column}.bsceo-logo{display:grid;place-items:center;width:30px;height:30px;border-radius:9px;color:#fff;background:linear-gradient(135deg,#3b82f6,#6366f1)}',
      '.bsceo-ligne{font-size:11px;color:var(--text-3);display:inline-flex;align-items:center;gap:5px}.bsceo-ligne::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}.bsceo-ligne.on{color:#22c55e}',
      '.bsceo-ia-box{flex:1;padding:14px;border-radius:12px;border:1px solid var(--neon-line,var(--border));background:color-mix(in srgb,var(--surface) 60%,transparent)}',
      '.bsceo-ia-box p{margin:0 0 6px;font-size:13px;color:var(--text)}.bsceo-ia-box ul{margin:0 0 12px;padding-left:18px;font-size:12.5px;line-height:1.7;color:var(--text-2)}',
      '.bsceo-rapport{display:inline-flex;align-items:center;gap:6px;text-decoration:none}',
      '.bsceo-q{display:flex;gap:6px;margin-top:12px;padding:5px 5px 5px 12px;border-radius:12px;border:1px solid var(--neon-line,var(--border));background:color-mix(in srgb,var(--surface) 60%,transparent)}',
      '.bsceo-q input{flex:1;min-width:0;border:0;background:none;color:var(--text);font:inherit;font-size:13px;outline:none}.bsceo-q .btn{width:34px;height:34px;padding:0;display:grid;place-items:center;border-radius:9px}',
      // Graphiques
      '.bsceo-legende{display:flex;gap:14px;font-size:11.5px;color:var(--text-2);margin:-4px 0 6px}.bsceo-legende span{display:inline-flex;align-items:center;gap:6px}.bsceo-legende i,.bsceo-bulle i{width:8px;height:8px;border-radius:50%}',
      '.bsceo-graph{position:relative}.bsceo-graph svg{display:block;width:100%;height:170px;overflow:visible}[data-z=evo] .bsceo-graph svg{height:130px}',
      '.bsceo-graph text{font-size:8.5px;fill:var(--text-3)}.bsceo-grille{stroke:var(--border);stroke-dasharray:2 4;vector-effect:non-scaling-stroke}.bsceo-curseur{stroke:var(--border-2,var(--border));stroke-dasharray:3 3;vector-effect:non-scaling-stroke}',
      '.bsceo-bulle{position:absolute;top:4px;transform:translateX(-50%);pointer-events:none;z-index:2;min-width:132px;padding:8px 10px;border-radius:10px;font-size:11px;color:var(--text);background:color-mix(in srgb,var(--surface) 92%,transparent);border:1px solid var(--neon-line-hi,var(--border));box-shadow:0 10px 26px -12px #000}',
      '.bsceo-bulle>b{display:block;margin-bottom:4px;font-size:11px}.bsceo-bulle span{display:flex;align-items:center;gap:6px;color:var(--text-2)}.bsceo-bulle span b{margin-left:auto;color:var(--text)}',
      '.bsceo-vide-g{position:absolute;inset:40% 0 auto;text-align:center;font-size:12px;color:var(--text-3);margin:0}',
      '.bsceo-vide{font-size:12.5px;color:var(--text-3);margin:6px 0}.bsceo-note{font-size:11px;color:var(--text-3);margin:8px 0 0}',
      '.bsceo-lien{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--neon,var(--accent));text-decoration:none;margin-top:8px}',
      // Formations
      '.bsceo-forma{display:flex;align-items:center;gap:18px}.bsceo-donut-w{position:relative;flex:none;width:150px;height:150px}.bsceo-donut{width:100%;height:100%;filter:drop-shadow(0 0 10px rgba(99,102,241,.35))}',
      '.bsceo-donut-w>div{position:absolute;inset:0;display:grid;place-content:center;text-align:center}.bsceo-donut-w b{font-size:24px;font-weight:800;color:var(--text)}.bsceo-donut-w span{font-size:11px;color:var(--text-2)}',
      '.bsceo-forma ul{list-style:none;margin:0;padding:0;flex:1;display:grid;gap:9px;font-size:12.5px;color:var(--text)}.bsceo-forma li{display:flex;align-items:center;gap:9px}.bsceo-forma li i{width:9px;height:9px;border-radius:50%}.bsceo-forma li b{margin-left:auto}',
      // Activité
      '.bsceo-act{list-style:none;margin:0;padding:0;display:grid;gap:12px}.bsceo-act li{display:flex;align-items:center;gap:10px;min-width:0}.bsceo-act li>div{flex:1;min-width:0}',
      '.bsceo-act b{display:block;font-size:12.5px;color:var(--text)}.bsceo-act li>div>span{display:block;font-size:11.5px;color:var(--neon,var(--accent));white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bsceo-act small{font-size:10.5px;color:var(--text-3)}',
      '.bsceo-act em{flex:none;font-style:normal;font-size:10.5px;font-weight:700;padding:3px 8px;border-radius:999px;color:#93c5fd;background:rgba(59,130,246,.14);border:1px solid rgba(59,130,246,.3)}.bsceo-act em.bon{color:#4ade80;background:rgba(34,197,94,.12);border-color:rgba(34,197,94,.3)}',
      '.bsceo-av{flex:none;display:grid;place-items:center;width:var(--t);height:var(--t);border-radius:50%;overflow:hidden;font-size:calc(var(--t) * .36);font-weight:700;color:#fff;background:hsl(var(--h) 55% 42%);box-shadow:0 0 0 2px color-mix(in srgb,var(--surface) 80%,transparent)}.bsceo-av img{width:100%;height:100%;object-fit:cover}',
      // Évolution
      '.bsceo-tuiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:10px}.bsceo-tuiles>div{padding:9px 10px;border-radius:11px;border:1px solid var(--neon-line,var(--border));background:color-mix(in srgb,var(--surface) 55%,transparent);min-width:0}',
      '.bsceo-tuiles small{display:block;font-size:10.5px;line-height:1.25;min-height:2.5em;color:var(--text-2)}.bsceo-tuiles b{display:block;white-space:nowrap;font-size:18px;font-weight:800;color:var(--text);margin:4px 0 2px}.bsceo-tuiles .bsceo-ev{display:flex;justify-content:flex-end}',
      // Départements
      '.bsceo-dep{list-style:none;margin:0;padding:0;display:grid;gap:12px}.bsceo-dep li{display:grid;grid-template-columns:38px minmax(0,1fr) minmax(60px,1.1fr) 42px 60px;align-items:center;gap:10px}',
      '.bsceo-dep-ic{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;color:#fff;background:radial-gradient(circle at 30% 30%,color-mix(in srgb,var(--c) 85%,#fff),var(--c))}',
      '.bsceo-dep b{display:block;font-size:12.5px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bsceo-dep small{font-size:11px;color:var(--neon,var(--accent))}.bsceo-dep strong{font-size:12.5px;color:var(--text);text-align:right}',
      '.bsceo-barre{display:block;height:7px;border-radius:9px;background:var(--border);overflow:hidden}.bsceo-barre i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#3b82f6,#8b5cf6)}.bsceo-barre.grand{height:8px;margin:8px 0 5px}',
      // Objectifs
      '.bsceo-obj-main{display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;border:1px solid var(--neon-line,var(--border));background:color-mix(in srgb,var(--surface) 55%,transparent)}',
      '.bsceo-obj-ic{flex:none;display:grid;place-items:center;width:46px;height:46px;border-radius:50%;color:#fff;background:radial-gradient(circle at 30% 30%,#3b82f6,#1e3a8a);box-shadow:0 0 18px -4px #3b82f6}',
      '.bsceo-obj-main>div{flex:1;min-width:0}.bsceo-obj-main small{font-size:11px;color:var(--text-2)}.bsceo-obj-main b{display:block;font-size:14px;color:var(--text)}.bsceo-obj-main>div>span{font-size:11px;color:var(--neon,var(--accent))}.bsceo-obj-main strong{font-size:13px;color:var(--neon,var(--accent))}',
      '.bsceo-obj{list-style:none;margin:10px 0 0;padding:0;display:grid}.bsceo-obj li{display:flex;align-items:center;gap:10px;padding:8px 2px;border-top:1px solid var(--border);font-size:12.5px;color:var(--text)}',
      '.bsceo-obj li>span:nth-child(2){flex:1;min-width:0}.bsceo-obj small{display:block;font-size:10.5px;color:var(--text-3)}.bsceo-obj li>b{font-size:12px;color:var(--neon,var(--accent))}',
      '.bsceo-ok{display:grid;place-items:center;color:var(--text-3)}.bsceo-ok.encours{color:#f59e0b}.bsceo-ok.fini{color:#22c55e}',
      // Équipes
      '.bsceo-eq{display:grid;grid-template-columns:repeat(auto-fit,minmax(138px,1fr));gap:10px}',
      '.bsceo-membre{padding:11px;border-radius:12px;border:1px solid var(--neon-line,var(--border));background:color-mix(in srgb,var(--surface) 55%,transparent);display:grid;grid-template-columns:auto 1fr;gap:9px;align-items:center}',
      '.bsceo-membre-t{min-width:0}.bsceo-membre-t b{display:block;font-size:12.5px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bsceo-membre-t small{font-size:11px;color:var(--text-3)}',
      '.bsceo-membre-b{grid-column:1/-1;display:flex;align-items:center;gap:8px}.bsceo-membre-b .bsceo-sans{font-size:10.5px;color:var(--text-3)}',
      '.bsceo-anneau{position:relative;width:42px;height:42px;flex:none}.bsceo-anneau svg{width:100%;height:100%}.bsceo-anneau b{position:absolute;inset:0;display:grid;place-items:center;font-size:10.5px;color:var(--text)}',
      '.bsceo-rond{margin-left:auto;display:grid;place-items:center;width:30px;height:30px;border-radius:50%;border:1px solid var(--neon-line,var(--border));background:none;color:var(--text);cursor:pointer}.bsceo-rond:hover{border-color:var(--neon,var(--accent));color:var(--neon,var(--accent))}',
      // Offre
      '.bsceo-offre{overflow:hidden;display:flex;align-items:flex-end;min-height:150px;background:linear-gradient(120deg,rgba(30,27,75,.92),rgba(30,58,138,.75))!important}',
      '.bsceo-offre-fond{position:absolute;inset:0}.bsceo-offre-fond svg{width:100%;height:100%;opacity:.9}',
      '.bsceo-offre-t{position:relative;margin-left:auto;max-width:300px}.bsceo-offre h2{margin:0 0 6px;font-size:17px;font-weight:800;color:#fff}.bsceo-offre p{margin:0 0 12px;font-size:12px;line-height:1.5;color:rgba(226,232,255,.85)}',
      '.bsceo-offre-btn{display:inline-flex;align-items:center;gap:6px;text-decoration:none}',
      'html[data-scheme="light"] .bsceo-offre-t h2{color:#fff}',
      '@media (max-width:1280px){.bsceo{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.bsceo-z-hero,.bsceo-z-eq{grid-column:1/-1}.bsceo-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}',
      '@media (max-width:760px){.bsceo{grid-template-columns:minmax(0,1fr)}.bsceo-hero{grid-template-columns:1fr}.bsceo-citation{display:none}.bsceo-kpis{grid-template-columns:1fr 1fr}.bsceo-tuiles{grid-template-columns:1fr 1fr}.bsceo-forma{flex-direction:column}.bsceo-dep li{grid-template-columns:34px minmax(0,1fr) 40px 50px}.bsceo-dep .bsceo-barre{display:none}}',
    ].join('\n');
    document.head.appendChild(st);
  }

  window.bsCeo = { monter: monter, rafraichir: rafraichir, recharger: charger };
})();
