/* Blackstart CRM : page « Calendrier » (maquette d'albino, 27 octobre 2026). Remplace l'ancien agenda.
 * Vues Jour / Semaine / Mois, fuseau horaire au choix, mini-calendrier, prochains rendez-vous et statistiques.
 * Les rendez-vous sont les vraies relances des prospects (date + heure) et les tâches à échéance du CRM :
 * un clic sur un rendez-vous ouvre sa fiche, un clic sur un créneau libre (ou le bouton +) en planifie un.
 */
(function () {
  'use strict';
  if (window.bsCalendrier) return;

  // Les dates s'écrivent directement dans la langue choisie (le reste passe par le dictionnaire de bs-langue).
  var EN = !!(window.bsLangue && window.bsLangue.langue === 'en');
  var JOURS = EN ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  var INITIALES = EN ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  var MOIS = EN ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    : ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var MOIS_C = EN ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  function tr(x) { return window.bsLangue && window.bsLangue.t ? window.bsLangue.t(x) : x; }
  var TONS = {
    blue: '#3b82f6', sky: '#0ea5e9', violet: '#8b5cf6', purple: '#a855f7', indigo: '#6366f1', green: '#10b981',
    orange: '#f97316', amber: '#f59e0b', pink: '#ec4899', rose: '#f43f5e', slate: '#64748b',
  };
  // Type de rendez-vous selon le statut du prospect : préfixe du titre, icône, étiquette, couleur, durée (min).
  var TYPES = {
    a_appeler: ['Appel', 'phone', 'Prospection', 'blue', 30, 'Appel de prospection'],
    injoignable: ['Rappel', 'phone', 'Relance', 'orange', 30, 'Rappel'],
    rdv_pris: ['Rendez-vous', 'users', 'Rendez-vous', 'purple', 60, 'Rendez-vous client'],
    audit_realise: ['Suivi audit', 'clipboard-check', 'Audit', 'pink', 60, 'Suivi d’audit'],
    proposition_envoyee: ['Suivi proposition', 'file-text', 'Négociation', 'green', 30, 'Suivi de proposition'],
    client_signe: ['Suivi client', 'user-check', 'Client', 'sky', 30, 'Suivi client'],
  };
  var FUSEAUX = [
    ['Indian/Antananarivo', 'Madagascar'], ['Europe/Paris', 'Paris'], ['Europe/Brussels', 'Bruxelles'], ['Europe/Zurich', 'Zurich'],
    ['Europe/London', 'Londres'], ['Africa/Casablanca', 'Casablanca'], ['Africa/Abidjan', 'Abidjan'], ['Africa/Dakar', 'Dakar'],
    ['Africa/Douala', 'Douala'], ['Africa/Kinshasa', 'Kinshasa'], ['Indian/Reunion', 'La Réunion'], ['Indian/Mauritius', 'Maurice'],
    ['America/Montreal', 'Montréal'], ['America/New_York', 'New York'], ['UTC', 'UTC'],
  ];
  var RH = 68; // hauteur d'une heure dans la grille (px)

  var LOCAL = (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { return 'UTC'; } })();
  var S = { vue: '', curseur: '', mini: '', tz: lire('bs-cal-fuseau') || LOCAL, tout: false };
  var racine = null, desabo = null, minuteur = 0;

  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* facultatif */ } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function deux(n) { return (n < 10 ? '0' : '') + n; }
  function jour(d) { return d.getFullYear() + '-' + deux(d.getMonth() + 1) + '-' + deux(d.getDate()); }
  function date(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function plus(s, n) { var d = date(s); d.setDate(d.getDate() + n); return jour(d); }
  function lundi(s) { var d = date(s); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return jour(d); }
  function hm(min) { return deux(Math.floor(min / 60) % 24) + ':' + deux(min % 60); }
  function majuscule(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  var EXTRA = {
    'cal-g': '<path d="M15 18l-6-6 6-6"/>', 'cal-d': '<path d="M9 18l6-6-6-6"/>', 'cal-plus': '<path d="M12 5v14M5 12h14"/>',
    'cal-fleche': '<path d="M5 12h14M13 6l6 6-6 6"/>', 'cal-bas': '<path d="M6 9l6 6 6-6"/>',
  };
  function ic(name, size) {
    var pl = window.bsIcones && window.bsIcones.plein && window.bsIcones.plein(name);
    var hs = window.__bsHs ? window.__bsHs() : null;
    var inner = pl || EXTRA[name] || (window.bsIcones && window.bsIcones.svg(name)) || (hs && hs[name]) || '';
    return '<svg class="ic" width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }

  // ---------------------------------------------------------------- fuseau horaire
  var formats = {};
  function parts(tz, ts) {
    var f = formats[tz] || (formats[tz] = new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }));
    var o = {};
    f.formatToParts(new Date(ts)).forEach(function (p) { o[p.type] = p.value; });
    return { d: o.year + '-' + o.month + '-' + o.day, min: (+o.hour % 24) * 60 + +o.minute };
  }
  function decalage(tz, ts) { var p = parts(tz, ts), d = date(p.d); return Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, p.min) - Math.floor(ts / 60000) * 60000) / 60000); }
  function fuseauValide(tz) { try { parts(tz, Date.now()); return true; } catch (e) { return false; } }
  // Heure locale de l'appareil (celle des relances enregistrées) → jour et minute dans le fuseau choisi.
  function versZone(d, min) {
    if (S.tz === LOCAL) return { d: d, min: min };
    var x = date(d); x.setMinutes(min);
    return parts(S.tz, x.getTime());
  }
  // Créneau du fuseau choisi → jour et heure locales de l'appareil (pour l'enregistrer).
  function versLocal(d, min) {
    if (S.tz === LOCAL) return { d: d, h: hm(min) };
    var x = date(d), g = Date.UTC(x.getFullYear(), x.getMonth(), x.getDate(), 0, min);
    var ts = g - decalage(S.tz, g) * 60000; ts = g - decalage(S.tz, ts) * 60000;
    var l = new Date(ts);
    return { d: jour(l), h: hm(l.getHours() * 60 + l.getMinutes()) };
  }
  function nomFuseau(tz) {
    var o = decalage(tz, Date.now()), signe = o < 0 ? '-' : '+', a = Math.abs(o);
    var ville = (FUSEAUX.filter(function (f) { return f[0] === tz; })[0] || [0, String(tz).split('/').pop().replace(/_/g, ' ')])[1];
    return 'UTC' + signe + deux(Math.floor(a / 60)) + ':' + deux(a % 60) + ' (' + ville + ')';
  }
  function aujourdhui() { return S.tz === LOCAL ? jour(new Date()) : parts(S.tz, Date.now()).d; }
  function maintenant() { return S.tz === LOCAL ? (function (d) { return d.getHours() * 60 + d.getMinutes(); })(new Date()) : parts(S.tz, Date.now()).min; }

  // ---------------------------------------------------------------- données
  function R() { return window.__bsStore || null; }
  function etat() { var r = R(); return r && r.get ? r.get() : {}; }
  function reglages() { return etat().settings || {}; }
  function minutes(h) { var m = /^(\d{1,2}):(\d{2})/.exec(String(h || '')); return m ? Math.min(23, +m[1]) * 60 + Math.min(59, +m[2]) : null; }
  // Tous les rendez-vous du CRM, dans le fuseau choisi.
  function evenements() {
    var st = etat(), out = [], parId = {};
    (st.prospects || []).forEach(function (p) {
      if (!p || p.supprime) return;
      parId[p.id] = p;
      var ty = TYPES[p.statut];
      if (!ty || !p.prochaineRelance) return;
      var m = minutes(p.prochaineRelanceHeure), z = m === null ? { d: p.prochaineRelance, min: null } : versZone(p.prochaineRelance, m);
      out.push({ k: 'p', id: p.id, d: z.d, min: z.min, dur: ty[4], titre: tr(ty[0]) + ' - ' + (p.entreprise || p.contact || 'Prospect'),
        sous: [p.contact && p.entreprise ? p.contact : '', p.ville || p.secteur || ''].filter(Boolean).join(' · '), tag: ty[2], ton: ty[3], ic: ty[1],
        quoi: ty[5], qui: p.entreprise || p.contact || '' });
    });
    (st.tasks || []).forEach(function (t) {
      if (!t || t.done || !t.due) return;
      var m = minutes(t.heure), z = m === null ? { d: t.due, min: null } : versZone(t.due, m), p = t.prospectId && parId[t.prospectId];
      out.push({ k: 't', id: t.id, d: z.d, min: z.min, dur: 30, titre: t.title || 'Tâche', sous: p ? p.entreprise || p.contact || '' : 'Tâche', tag: 'Tâche', ton: 'amber', ic: 'square-check',
        quoi: t.title || 'Tâche', qui: p ? p.entreprise || p.contact || '' : 'Tâche' });
    });
    out.sort(function (a, b) { return a.d < b.d ? -1 : a.d > b.d ? 1 : (a.min === null ? -1 : a.min) - (b.min === null ? -1 : b.min); });
    return out;
  }
  function parJour(evs) { var o = {}; evs.forEach(function (e) { (o[e.d] = o[e.d] || []).push(e); }); return o; }

  // ---------------------------------------------------------------- dessin
  function titrePeriode() {
    var c = date(S.curseur);
    if (S.vue === 'jour') return majuscule(c.toLocaleDateString(EN ? 'en-GB' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    if (S.vue === 'mois') return majuscule(MOIS[c.getMonth()]) + ' ' + c.getFullYear();
    var l = date(lundi(S.curseur));
    if (EN) return 'Week of ' + l.getDate() + ' ' + MOIS[l.getMonth()] + ' ' + l.getFullYear();
    return 'Semaine du ' + (l.getDate() === 1 ? '1er' : l.getDate()) + ' ' + MOIS[l.getMonth()] + ' ' + l.getFullYear();
  }
  function carte(e, style) {
    var t = TONS[e.ton] || TONS.blue;
    return '<button type="button" class="bscal-ev" data-ev="' + e.k + ':' + esc(e.id) + '" style="--t:' + t + (style || '') + '" title="' + esc((e.min === null ? '' : hm(e.min) + ' · ') + e.titre) + '">' +
      '<span class="bscal-ev-ic">' + ic(e.ic, 15) + '</span><span class="bscal-ev-t">' +
      (e.min === null ? '<small>Journée</small>' : '<small>' + hm(e.min) + ' – ' + hm(e.min + e.dur) + '</small>') +
      '<b>' + esc(e.titre) + '</b>' + (e.sous ? '<span>' + esc(e.sous) + '</span>' : '') + '<em>' + esc(e.tag) + '</em></span></button>';
  }
  // Rendez-vous qui se chevauchent : côte à côte.
  function couloirs(l) {
    var fin = [], groupe = [], out = [];
    function clore() { var n = Math.max.apply(null, groupe.map(function (x) { return x.c; })) + 1; groupe.forEach(function (x) { x.n = n; out.push(x); }); groupe = []; fin = []; }
    l.forEach(function (e) {
      var d = e.min, f = e.min + Math.max(e.dur, 60);
      if (groupe.length && fin.every(function (x) { return x <= d; })) clore();
      var c = fin.findIndex(function (x) { return x <= d; }); if (c < 0) { c = fin.length; fin.push(f); } else fin[c] = f;
      groupe.push({ e: e, c: c });
    });
    if (groupe.length) clore();
    return out;
  }
  function grille(jours, evs) {
    var o = reglages(), h0 = Math.max(0, Math.min(23, Number(o.workStart) || 8)), h1 = Math.max(h0, Math.min(23, Number(o.workEnd) || 18));
    var pj = parJour(evs), auj = aujourdhui(), journee = false;
    jours.forEach(function (d) { (pj[d] || []).forEach(function (e) {
      if (e.min === null) { journee = true; return; }
      h0 = Math.min(h0, Math.floor(e.min / 60)); h1 = Math.max(h1, Math.min(23, Math.floor((e.min + Math.max(e.dur, 60) - 1) / 60)));
    }); });
    var n = h1 - h0 + 1, cols = 'grid-template-columns:58px repeat(' + jours.length + ',minmax(0,1fr))';
    var tete = '<div class="bscal-g-tete" style="' + cols + '"><span></span>' + jours.map(function (d) {
      var x = date(d);
      return '<button type="button" class="bscal-jt' + (d === auj ? ' auj' : '') + '" data-jour="' + d + '"><span>' + JOURS[(x.getDay() + 6) % 7] + '</span><b>' + (EN ? MOIS_C[x.getMonth()] + ' ' + x.getDate() : x.getDate() + ' ' + MOIS_C[x.getMonth()]) + '</b></button>';
    }).join('') + '</div>';
    var haut = journee ? '<div class="bscal-g-journee" style="' + cols + '"><span>Journée</span>' + jours.map(function (d) {
      return '<div class="' + (d === auj ? 'auj' : '') + '">' + (pj[d] || []).filter(function (e) { return e.min === null; }).map(function (e) {
        return '<button type="button" class="bscal-pastille" data-ev="' + e.k + ':' + esc(e.id) + '" style="--t:' + (TONS[e.ton] || TONS.blue) + '" title="' + esc(e.titre + ' · ' + e.tag) + '">' + ic(e.ic, 12) + '<span>' + esc(e.titre) + '</span></button>';
      }).join('') + '</div>';
    }).join('') + '</div>' : '';
    var heures = '';
    for (var h = h0; h <= h1; h++) heures += '<span style="height:' + RH + 'px">' + deux(h) + ':00</span>';
    var corps = '<div class="bscal-g-corps" style="' + cols + '"><div class="bscal-heures">' + heures + '</div>' + jours.map(function (d) {
      var l = (pj[d] || []).filter(function (e) { return e.min !== null; });
      return '<div class="bscal-col' + (d === auj ? ' auj' : '') + '" data-col="' + d + '" data-h0="' + h0 + '" style="height:' + n * RH + 'px;--rh:' + RH + 'px">' +
        couloirs(l).map(function (x) {
          var top = (x.e.min - h0 * 60) / 60 * RH + 3, haut = Math.max(x.e.dur, 60) / 60 * RH - 6;
          return carte(x.e, ';top:' + top.toFixed(1) + 'px;height:' + haut.toFixed(1) + 'px;left:calc(' + (x.c / x.n * 100).toFixed(2) + '% + 4px);width:calc(' + (100 / x.n).toFixed(2) + '% - 8px)');
        }).join('') + '</div>';
    }).join('') + '</div>';
    return '<div class="bscal-g' + (jours.length === 1 ? ' un' : '') + '">' + tete + haut + '<div class="bscal-g-defil">' + corps + '</div></div>';
  }
  function vueMois(evs) {
    var c = date(S.curseur), debut = lundi(jour(new Date(c.getFullYear(), c.getMonth(), 1))), pj = parJour(evs), auj = aujourdhui(), cases = [];
    for (var i = 0; i < 42; i++) {
      var d = plus(debut, i), x = date(d);
      if (i >= 35 && x.getMonth() !== c.getMonth() && i % 7 === 0) break;
      var l = pj[d] || [];
      cases.push('<div class="bscal-mc' + (x.getMonth() !== c.getMonth() ? ' hors' : '') + (d === auj ? ' auj' : '') + '" data-mois-jour="' + d + '"><b>' + x.getDate() + '</b>' +
        l.slice(0, 3).map(function (e) { return '<button type="button" class="bscal-mc-ev" data-ev="' + e.k + ':' + esc(e.id) + '" style="--t:' + (TONS[e.ton] || TONS.blue) + '"><i></i>' + (e.min === null ? '' : '<small>' + hm(e.min) + '</small>') + '<span>' + esc(e.titre) + '</span></button>'; }).join('') +
        (l.length > 3 ? '<span class="bscal-mc-plus">+' + (l.length - 3) + '</span>' : '') + '</div>');
    }
    return '<div class="bscal-m"><div class="bscal-m-tete">' + JOURS.map(function (j) { return '<span>' + j + '</span>'; }).join('') + '</div><div class="bscal-m-g">' + cases.join('') + '</div></div>';
  }
  function miniCal() {
    var m = date(S.mini), debut = lundi(jour(new Date(m.getFullYear(), m.getMonth(), 1))), auj = aujourdhui(), sel = lundi(S.curseur), cases = '';
    for (var i = 0; i < 42; i++) {
      var d = plus(debut, i), x = date(d);
      if (i >= 35 && x.getMonth() !== m.getMonth() && i % 7 === 0) break;
      var dansSem = S.vue !== 'mois' && d >= sel && d < plus(sel, 7);
      cases += '<button type="button" data-mini="' + d + '" class="' + [x.getMonth() !== m.getMonth() ? 'hors' : '', d === auj ? 'auj' : '', d === S.curseur ? 'sel' : '', dansSem ? 'sem' : ''].join(' ').trim() + '">' + x.getDate() + '</button>';
    }
    return '<section class="bscal-carte bscal-mini"><div class="bscal-mini-t"><b>' + majuscule(MOIS[m.getMonth()]) + ' ' + m.getFullYear() + '</b>' +
      '<button type="button" data-mini-nav="-1" aria-label="Mois précédent">' + ic('cal-g', 15) + '</button><button type="button" data-mini-nav="1" aria-label="Mois suivant">' + ic('cal-d', 15) + '</button></div>' +
      '<div class="bscal-mini-g">' + INITIALES.map(function (j) { return '<span>' + j + '</span>'; }).join('') + cases + '</div></section>';
  }
  function prochains(evs) {
    var auj = aujourdhui(), mn = maintenant();
    var l = evs.filter(function (e) { return e.d > auj || (e.d === auj && (e.min === null || e.min >= mn)); });
    var n = S.tout ? 12 : 4;
    return '<section class="bscal-carte bscal-pro"><div class="bscal-carte-t"><b>Prochains rendez-vous</b>' + (l.length > 4 ? '<button type="button" data-act="tout">' + (S.tout ? 'Réduire' : 'Voir tout') + '</button>' : '') + '</div>' +
      (l.length ? '<ul>' + l.slice(0, n).map(function (e) {
        var x = date(e.d), quand = e.d === auj ? '' : EN ? JOURS[(x.getDay() + 6) % 7] + ' ' + x.getDate() + ' ' + MOIS_C[x.getMonth()] : JOURS[(x.getDay() + 6) % 7].toLowerCase() + '. ' + x.getDate() + ' ' + MOIS_C[x.getMonth()];
        return '<li><button type="button" data-ev="' + e.k + ':' + esc(e.id) + '"><i style="--t:' + (TONS[e.ton] || TONS.blue) + '"></i><time>' + (e.min === null ? '–' : hm(e.min)) + '</time>' +
          '<span><b>' + esc(e.quoi) + '</b><small>' + esc([e.qui, quand, e.min === null ? 'journée' : ''].filter(Boolean).join(' · ')) + '</small></span></button></li>';
      }).join('') + '</ul>' : '<p class="bscal-vide">Aucun rendez-vous à venir. Touchez un créneau libre pour en planifier un.</p>') + '</section>';
  }
  function stats(evs) {
    var sel = lundi(S.vue === 'semaine' ? S.curseur : aujourdhui()), fin = plus(sel, 7);
    var rdv = evs.filter(function (e) { return e.k === 'p' && e.d >= sel && e.d < fin; }).length;
    var ps = (etat().prospects || []).filter(function (p) { return p && !p.supprime; });
    var actifs = ps.filter(function (p) { return ['perdu', 'resilie'].indexOf(p.statut) < 0; }).length;
    var opp = ps.filter(function (p) { return ['rdv_pris', 'audit_realise', 'proposition_envoyee'].indexOf(p.statut) >= 0; }).length;
    var l = [['calendar-days', rdv, 'rendez-vous cette semaine'], ['users', actifs, 'contacts actifs'], ['trending-up', opp, 'opportunités en cours']];
    return '<section class="bscal-carte bscal-stats"><div class="bscal-carte-t"><b>Statistiques rapides</b></div><ul>' + l.map(function (x) {
      return '<li><span class="bscal-st-ic">' + ic(x[0], 18) + '</span><span><b>' + x[1].toLocaleString('fr-FR') + '</b><small>' + x[2] + '</small></span></li>';
    }).join('') + '</ul></section>';
  }
  function optionsFuseau() {
    var l = FUSEAUX.slice();
    if (!l.some(function (f) { return f[0] === LOCAL; })) l.unshift([LOCAL, LOCAL.split('/').pop().replace(/_/g, ' ')]);
    if (!l.some(function (f) { return f[0] === S.tz; })) l.unshift([S.tz, S.tz]);
    return l.filter(function (f) { return fuseauValide(f[0]); }).map(function (f) {
      return '<option value="' + esc(f[0]) + '"' + (f[0] === S.tz ? ' selected' : '') + '>' + esc(nomFuseau(f[0])) + '</option>';
    }).join('');
  }
  function dessiner() {
    if (!racine || !racine.isConnected) return;
    var evs = evenements(), defil = racine.querySelector('.bscal-g-defil'), y = defil ? defil.scrollTop : null;
    var jours = S.vue === 'jour' ? [S.curseur] : Array.from({ length: 7 }, function (_, i) { return plus(lundi(S.curseur), i); });
    racine.innerHTML = '<div class="bscal"><div class="bscal-principal">' +
      '<header class="bscal-tete"><span class="bscal-logo">' + ic('calendar-days', 24) + '</span><div><h1>Calendrier</h1><p>Gérez vos rendez-vous, suivez vos prospects et ne manquez aucune opportunité.</p></div></header>' +
      '<section class="bscal-carte bscal-cal"><div class="bscal-barre">' +
      '<div class="bscal-vues" role="tablist">' + [['jour', 'Jour'], ['semaine', 'Semaine'], ['mois', 'Mois']].map(function (v) {
        return '<button type="button" role="tab" aria-selected="' + (S.vue === v[0]) + '" class="' + (S.vue === v[0] ? 'on' : '') + '" data-vue="' + v[0] + '">' + v[1] + '</button>';
      }).join('') + '</div>' +
      '<div class="bscal-periode"><button type="button" data-nav="-1" aria-label="Précédent">' + ic('cal-g', 16) + '</button><b>' + esc(titrePeriode()) + '</b>' +
      '<button type="button" data-nav="1" aria-label="Suivant">' + ic('cal-d', 16) + '</button>' +
      '<label class="bscal-choix-date" title="Aller à une date">' + ic('calendar', 16) + '<input type="date" data-aller value="' + S.curseur + '" aria-label="Aller à une date"></label>' +
      (S.curseur !== aujourdhui() ? '<button type="button" class="bscal-auj" data-act="auj">Aujourd’hui</button>' : '') + '</div>' +
      '<label class="bscal-fuseau">' + '<select data-tz aria-label="Fuseau horaire">' + optionsFuseau() + '</select>' + ic('cal-bas', 14) + '</label></div>' +
      (S.vue === 'mois' ? vueMois(evs) : grille(jours, evs)) + '</section></div>' +
      '<aside class="bscal-cote">' + miniCal() + prochains(evs) + stats(evs) +
      '<button type="button" class="bscal-fab" data-act="planifier" aria-label="Planifier un rendez-vous" title="Planifier un rendez-vous">' + ic('cal-plus', 24) + '</button></aside></div>';
    var nd = racine.querySelector('.bscal-g-defil');
    if (nd) {
      if (y !== null) nd.scrollTop = y;
    }
  }

  // ---------------------------------------------------------------- actions
  function ouvrir(type, extra) {
    var Y = window.__bsY; if (!Y || !Y.set) return;
    Y.set(function (s) { return { overlays: (s.overlays || []).concat([Object.assign({ key: 'bscal' + Date.now() + Math.random().toString(36).slice(2, 6), type: type }, extra || {})]) }; });
  }
  function aller(d) { S.curseur = d; S.mini = d; dessiner(); }
  function brancher(el) {
    el.addEventListener('click', function (ev) {
      var t = ev.target, b = t.closest('button,[data-col],[data-mois-jour]');
      if (!b || !el.contains(b)) return;
      var d = b.dataset;
      if (d.ev) { var p = d.ev.split(':'), id = d.ev.slice(2); if (p[0] === 'p') ouvrir('prospect', { id: id }); else ouvrir('taskForm', { id: id }); return; }
      if (d.vue) { S.vue = d.vue; ecrire('bs-cal-vue', S.vue); dessiner(); return; }
      if (d.nav) {
        var c = date(S.curseur), n = Number(d.nav);
        if (S.vue === 'jour') c.setDate(c.getDate() + n); else if (S.vue === 'semaine') c.setDate(c.getDate() + 7 * n); else { c.setDate(1); c.setMonth(c.getMonth() + n); }
        aller(jour(c)); return;
      }
      if (d.jour) { S.vue = 'jour'; aller(d.jour); return; }
      if (d.moisJour && !t.closest('.bscal-mc-ev')) { S.vue = 'jour'; aller(d.moisJour); return; }
      if (d.mini) { aller(d.mini); return; }
      if (d.miniNav) { var m = date(S.mini); m.setDate(1); m.setMonth(m.getMonth() + Number(d.miniNav)); S.mini = jour(m); dessiner(); return; }
      if (d.act === 'auj') { aller(aujourdhui()); return; }
      if (d.act === 'tout') { S.tout = !S.tout; dessiner(); return; }
      if (d.act === 'planifier') { ouvrir('schedule', { date: S.curseur < aujourdhui() ? aujourdhui() : S.curseur, heure: '' }); return; }
      if (d.col) {
        // Créneau libre : l'heure touchée, à la demi-heure.
        var r = b.getBoundingClientRect(), min = Number(d.h0) * 60 + Math.floor((ev.clientY - r.top) / RH * 2) * 30;
        var l = versLocal(d.col, Math.max(0, Math.min(23 * 60 + 30, min)));
        ouvrir('schedule', { date: l.d, heure: l.h });
      }
    });
    el.addEventListener('change', function (ev) {
      var t = ev.target;
      if (t.matches('[data-tz]')) { S.tz = fuseauValide(t.value) ? t.value : LOCAL; ecrire('bs-cal-fuseau', S.tz); dessiner(); return; }
      if (t.matches('[data-aller]') && /^\d{4}-\d{2}-\d{2}$/.test(t.value)) aller(t.value);
    });
  }

  function monter(el) {
    if (!el) return;
    css();
    if (!fuseauValide(S.tz)) S.tz = LOCAL;
    if (!S.vue) S.vue = { jour: 1, semaine: 1, mois: 1 }[lire('bs-cal-vue')] ? lire('bs-cal-vue') : (window.innerWidth < 760 ? 'jour' : 'semaine');
    if (!S.curseur) { S.curseur = aujourdhui(); S.mini = S.curseur; }
    if (racine !== el) { racine = el; brancher(el); }
    dessiner();
    if (desabo) { try { desabo(); } catch (e) { /* déjà fait */ } desabo = null; }
    var r = R();
    if (r && r.subscribe) {
      var avant = null, avantT = null;
      var sub = r.subscribe(function (s) {
        if (!racine || !racine.isConnected) { if (desabo) { desabo(); desabo = null; } return; }
        if (avant === s.prospects && avantT === s.tasks) return;
        avant = s.prospects; avantT = s.tasks; clearTimeout(minuteur); minuteur = setTimeout(dessiner, 150);
      });
      desabo = typeof sub === 'function' ? sub : null;
    }
  }

  var cssFait = false;
  function css() {
    if (cssFait) return; cssFait = true;
    var st = document.createElement('style'); st.id = 'bs-calendrier-css';
    st.textContent = [
      '.bscal{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:18px;align-items:start}',
      '.bscal-principal{min-width:0;display:flex;flex-direction:column;gap:16px}',
      '.bscal-tete{display:flex;align-items:center;gap:14px}.bscal-tete h1{margin:0;font-size:1.75em;font-weight:800;letter-spacing:-.02em;color:var(--text)}.bscal-tete p{margin:3px 0 0;color:var(--text-2);font-size:.95em}',
      '.bscal-logo{flex:none;display:grid;place-items:center;width:48px;height:48px;border-radius:14px;color:#c4b5fd;background:linear-gradient(145deg,rgba(124,58,237,.35),rgba(79,70,229,.18));border:1px solid rgba(139,92,246,.45);box-shadow:0 0 22px -6px rgba(139,92,246,.7)}',
      '.bscal-carte{border:1px solid var(--neon-line,var(--border));border-radius:16px;background:color-mix(in srgb,var(--surface) 82%,transparent);box-shadow:var(--shadow-sm);min-width:0}',
      '.bscal-cal{padding:14px 14px 10px}',
      '.bscal-barre{display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap}',
      '.bscal-vues{display:flex;gap:4px;padding:4px;border-radius:12px;border:1px solid var(--neon-line,var(--border));background:color-mix(in srgb,var(--surface-2) 60%,transparent)}',
      '.bscal-vues button{font:inherit;font-size:.86em;font-weight:600;padding:7px 18px;border-radius:9px;border:0;background:none;color:var(--text-2);cursor:pointer}',
      '.bscal-vues button.on{color:#fff;background:linear-gradient(135deg,#7c3aed,#6d28d9);box-shadow:0 6px 18px -8px rgba(124,58,237,.9),inset 0 1px 0 rgba(255,255,255,.18)}',
      '.bscal-periode{flex:1;display:flex;align-items:center;justify-content:center;gap:10px;min-width:0}',
      '.bscal-periode>b{font-size:.98em;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bscal-periode>button,.bscal-choix-date{display:grid;place-items:center;width:32px;height:32px;border-radius:9px;border:1px solid transparent;background:none;color:var(--text-2);cursor:pointer;position:relative}',
      '.bscal-periode>button:hover,.bscal-choix-date:hover{color:var(--text);border-color:var(--neon-line,var(--border));background:var(--surface-2)}',
      '.bscal-choix-date input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}',
      '.bscal-periode>.bscal-auj{width:auto;padding:0 12px;font:inherit;font-size:.8em;font-weight:600;border-color:var(--neon-line,var(--border))}',
      '.bscal-fuseau{position:relative;display:flex;align-items:center}.bscal-fuseau select{appearance:none;-webkit-appearance:none;font:inherit;font-size:.82em;color:var(--text);padding:8px 32px 8px 12px;border-radius:10px;border:1px solid var(--neon-line,var(--border));background:color-mix(in srgb,var(--surface-2) 60%,transparent);cursor:pointer;max-width:240px}',
      '.bscal-fuseau .ic{position:absolute;right:10px;pointer-events:none;color:var(--text-2)}',
      // Grille jour / semaine
      '.bscal-g{border:1px solid var(--neon-line,var(--border));border-radius:12px;overflow:hidden;background:color-mix(in srgb,var(--bg,#070b1a) 35%,transparent)}',
      '.bscal-g-tete,.bscal-g-journee,.bscal-g-corps{display:grid}',
      '.bscal-g-tete{border-bottom:1px solid var(--neon-line,var(--border))}.bscal-g-tete>span{border-right:1px solid var(--border)}',
      '.bscal-jt{font:inherit;border:0;border-right:1px solid var(--border);background:none;color:var(--text-2);padding:10px 4px;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;min-width:0}',
      '.bscal-jt:last-child{border-right:0}.bscal-jt span{font-size:.82em;font-weight:600;color:var(--text)}.bscal-jt b{font-size:.78em;font-weight:500;color:var(--text-2);white-space:nowrap}',
      '.bscal-jt.auj{background:linear-gradient(180deg,rgba(124,58,237,.75),rgba(91,33,182,.55));box-shadow:inset 0 -2px 0 #a78bfa}.bscal-jt.auj span,.bscal-jt.auj b{color:#fff}',
      '.bscal-g-journee{border-bottom:1px solid var(--neon-line,var(--border))}.bscal-g-journee>span{font-size:.72em;color:var(--text-3);padding:8px 6px;text-align:right;border-right:1px solid var(--border)}',
      '.bscal-g-journee>div{display:flex;flex-direction:column;gap:4px;padding:4px;border-right:1px solid var(--border);min-width:0}.bscal-g-journee>div.auj{background:rgba(124,58,237,.08)}',
      '.bscal-pastille{display:flex;align-items:center;gap:5px;font:inherit;font-size:.72em;font-weight:600;text-align:left;padding:4px 7px;border-radius:7px;cursor:pointer;color:var(--text);min-width:0;border:1px solid color-mix(in srgb,var(--t) 55%,transparent);background:color-mix(in srgb,var(--t) 22%,transparent)}',
      '.bscal-pastille .ic{flex:none;color:var(--t)}.bscal-pastille span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bscal-g-defil{max-height:calc(100dvh - var(--topbar-h,60px) - 250px);min-height:360px;overflow-y:auto;scrollbar-width:thin}',
      '.bscal-heures{display:flex;flex-direction:column;border-right:1px solid var(--border)}.bscal-heures span{box-sizing:border-box;padding:6px 8px 0 0;text-align:right;font-size:.74em;font-weight:600;color:var(--text-2);border-top:1px solid var(--border)}',
      '.bscal-heures span:first-child,.bscal-col{border-top:0}',
      '.bscal-col{position:relative;border-right:1px solid var(--border);cursor:copy;background-image:linear-gradient(to bottom,var(--border) 1px,transparent 1px);background-size:100% var(--rh)}',
      '.bscal-col:last-child{border-right:0}.bscal-col.auj{background-color:rgba(124,58,237,.09)}',
      '.bscal-col:hover{background-color:color-mix(in srgb,var(--surface-2) 30%,transparent)}.bscal-col.auj:hover{background-color:rgba(124,58,237,.13)}',
      // Rendez-vous
      '.bscal-ev{position:absolute;display:flex;gap:7px;align-items:flex-start;text-align:left;font:inherit;padding:5px 7px;border-radius:8px;overflow:hidden;cursor:pointer;color:#fff;',
      'border:1px solid color-mix(in srgb,var(--t) 70%,transparent);background:linear-gradient(160deg,color-mix(in srgb,var(--t) 42%,#0b1027),color-mix(in srgb,var(--t) 22%,#0b1027));box-shadow:0 8px 20px -12px var(--t),inset 0 1px 0 rgba(255,255,255,.08);transition:transform .12s,box-shadow .12s}',
      '.bscal-ev:hover{transform:translateY(-1px);box-shadow:0 10px 24px -10px var(--t)}',
      '.bscal-ev-ic{flex:none;display:grid;place-items:center;color:color-mix(in srgb,var(--t) 45%,#fff);margin-top:1px}',
      '.bscal-ev-t{min-width:0;display:flex;flex-direction:column;gap:1px;line-height:1.16}',
      '.bscal-ev-t small{font-size:10px;color:rgba(255,255,255,.75);white-space:nowrap}.bscal-ev-t b{font-size:11.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bscal-ev-t>span{font-size:10px;color:rgba(255,255,255,.72);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bscal-ev-t em{align-self:flex-start;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px;font-style:normal;font-size:9.5px;font-weight:600;padding:1px 7px;border-radius:999px;color:#fff;background:color-mix(in srgb,var(--t) 55%,transparent);border:1px solid color-mix(in srgb,var(--t) 70%,transparent)}',
      '.bscal-g.un .bscal-ev-t b{font-size:12.5px}',
      'html[data-scheme="light"] .bscal-ev{background:linear-gradient(160deg,color-mix(in srgb,var(--t) 26%,#fff),color-mix(in srgb,var(--t) 12%,#fff));color:#0f172a}',
      'html[data-scheme="light"] .bscal-ev-t small,html[data-scheme="light"] .bscal-ev-t>span{color:#334155}html[data-scheme="light"] .bscal-ev-ic{color:var(--t)}html[data-scheme="light"] .bscal-ev-t em{color:#0f172a}',
      // Mois
      '.bscal-m{border:1px solid var(--neon-line,var(--border));border-radius:12px;overflow:hidden}',
      '.bscal-m-tete{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));border-bottom:1px solid var(--neon-line,var(--border))}.bscal-m-tete span{padding:9px;text-align:center;font-size:.8em;font-weight:600;color:var(--text-2)}',
      '.bscal-m-g{display:grid;grid-template-columns:repeat(7,minmax(0,1fr))}',
      '.bscal-mc{min-height:104px;padding:6px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);display:flex;flex-direction:column;gap:3px;cursor:pointer;min-width:0}',
      '.bscal-mc:nth-child(7n){border-right:0}.bscal-mc.hors{opacity:.45}.bscal-mc.auj{background:rgba(124,58,237,.1)}',
      '.bscal-mc>b{font-size:.8em;font-weight:700;color:var(--text);width:24px;height:24px;display:grid;place-items:center;border-radius:50%}.bscal-mc.auj>b{background:#7c3aed;color:#fff}',
      '.bscal-mc-ev{display:flex;align-items:center;gap:5px;font:inherit;font-size:.72em;text-align:left;padding:3px 6px;border-radius:6px;border:0;color:var(--text);background:color-mix(in srgb,var(--t) 22%,transparent);cursor:pointer;min-width:0}',
      '.bscal-mc-ev i{flex:none;width:6px;height:6px;border-radius:50%;background:var(--t)}.bscal-mc-ev small{color:var(--text-2)}.bscal-mc-ev span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bscal-mc-plus{font-size:.72em;color:var(--text-3);padding-left:4px}',
      // Colonne de droite
      '.bscal-cote{display:flex;flex-direction:column;gap:14px;position:sticky;top:calc(var(--topbar-h,60px) + 12px)}',
      '.bscal-mini{padding:14px}.bscal-mini-t{display:flex;align-items:center;gap:4px;margin-bottom:10px}.bscal-mini-t b{flex:1;padding-left:4px;font-size:.92em;color:var(--text)}',
      '.bscal-mini-t button{display:grid;place-items:center;width:28px;height:28px;border-radius:8px;border:0;background:none;color:var(--text-2);cursor:pointer}.bscal-mini-t button:hover{background:var(--surface-2);color:var(--text)}',
      '.bscal-mini-g{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px;text-align:center}.bscal-mini-g>span{font-size:.72em;font-weight:600;color:var(--text-3);padding:4px 0}',
      '.bscal-mini-g button{font:inherit;font-size:.8em;aspect-ratio:1;border-radius:50%;border:0;background:none;color:var(--text);cursor:pointer;display:grid;place-items:center}',
      '.bscal-mini-g button:hover{background:var(--surface-2)}.bscal-mini-g button.hors{color:var(--text-3)}',
      '.bscal-mini-g button.sem{background:color-mix(in srgb,#7c3aed 16%,transparent)}.bscal-mini-g button.sel{box-shadow:inset 0 0 0 1.5px #a78bfa}',
      '.bscal-mini-g button.auj{background:#7c3aed;color:#fff;font-weight:700;box-shadow:0 0 14px -2px rgba(124,58,237,.9)}',
      '.bscal-carte-t{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}.bscal-carte-t b{font-size:.95em;color:var(--text)}',
      '.bscal-carte-t button{font:inherit;font-size:.78em;font-weight:600;border:0;background:none;color:#a78bfa;cursor:pointer}',
      '.bscal-pro,.bscal-stats{padding:14px}.bscal-pro ul,.bscal-stats ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px}',
      '.bscal-pro li button{width:100%;display:flex;align-items:flex-start;gap:10px;font:inherit;text-align:left;padding:7px 6px;border-radius:10px;border:0;background:none;color:var(--text);cursor:pointer}',
      '.bscal-pro li button:hover{background:var(--surface-2)}',
      '.bscal-pro li i{flex:none;width:9px;height:9px;margin-top:4px;border-radius:50%;background:var(--t);box-shadow:0 0 10px -1px var(--t)}',
      '.bscal-pro time{flex:none;width:42px;font-size:.84em;font-weight:600;color:var(--text)}.bscal-pro li span{min-width:0;display:flex;flex-direction:column}',
      '.bscal-pro li b{font-size:.84em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bscal-pro li small{font-size:.75em;color:var(--text-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bscal-vide{margin:0;font-size:.82em;color:var(--text-3);line-height:1.45}',
      '.bscal-stats li{display:flex;align-items:center;gap:12px;padding:6px 2px}',
      '.bscal-st-ic{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:12px;color:#c4b5fd;background:color-mix(in srgb,#7c3aed 18%,transparent);border:1px solid rgba(139,92,246,.35)}',
      '.bscal-stats li b{display:block;font-size:1.3em;font-weight:800;color:var(--text);line-height:1.1}.bscal-stats li small{font-size:.76em;color:var(--text-3)}',
      '.bscal-fab{position:relative;align-self:flex-end;margin:-40px -8px 0 0;z-index:2;display:grid;place-items:center;width:56px;height:56px;border-radius:50%;border:0;color:#fff;cursor:pointer;background:linear-gradient(140deg,#8b5cf6,#6d28d9);box-shadow:0 12px 30px -8px rgba(124,58,237,.95),inset 0 1px 0 rgba(255,255,255,.25);transition:transform .15s}',
      '.bscal-fab:hover{transform:scale(1.06)}',
      '@media (max-width:1180px){.bscal{grid-template-columns:minmax(0,1fr)}.bscal-cote{position:static;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}}',
      '@media (max-width:760px){.bscal-barre{gap:8px}.bscal-periode{order:3;flex-basis:100%}.bscal-fuseau select{max-width:170px}.bscal-ev-t em,.bscal-ev-t>span{display:none}.bscal-ev{padding:4px 5px}.bscal-ev-ic{display:none}.bscal-mc{min-height:70px}.bscal-mc-ev span{display:none}}',
    ].join('\n');
    document.head.appendChild(st);
  }

  window.bsCalendrier = { monter: monter, evenements: evenements, etat: function () { return S; } };
})();
