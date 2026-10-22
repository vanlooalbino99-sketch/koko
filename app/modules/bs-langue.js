/* Blackstart CRM : langue de l'interface (français ou anglais).
 *
 * Le CRM est écrit en français. En anglais, ce module traduit l'affichage à la volée : chaque texte de la page
 * (et les attributs title, placeholder, aria-label, alt) est cherché dans le dictionnaire window.BS_EN
 * (modules/bs-langue-en.js, généré depuis i18n/en/*.tsv), puis dans quelques formes avec des nombres.
 * Les textes saisis (champs, messages de la messagerie, corps des mails, notes) ne sont jamais touchés.
 * Le choix est gardé dans ce navigateur (localStorage « bs-langue ») ; changer de langue recharge la page.
 */
(function () {
  'use strict';
  if (window.bsLangue) return;
  var CLE = 'bs-langue';
  var langue = 'fr';
  try { langue = localStorage.getItem(CLE) === 'en' ? 'en' : 'fr'; } catch (e) { /* stockage bloqué */ }

  function choisir(l) {
    try { localStorage.setItem(CLE, l === 'en' ? 'en' : 'fr'); } catch (e) { /* stockage bloqué */ }
    location.reload();
  }
  var D = null;
  // Formes avec un nombre ou une partie variable : « 3 prospects », « Il y a 2 jours »…
  var MOTIFS = [];
  function motif(re, f) { MOTIFS.push([re, f]); }

  function brut(s) {
    if (!D) return null;
    var v = D[s];
    if (typeof v === 'string') return v;
    // Ponctuation à la française : « Statut : » → « Status: », « Chargement… »
    var m = /^(.*?)\s*([:!?;])$/.exec(s);
    if (m && m[1] && typeof D[m[1]] === 'string') return D[m[1]] + m[2];
    m = /^(.*?)(…|\.\.\.|\.)$/.exec(s);
    if (m && m[1] && typeof D[m[1]] === 'string') return D[m[1]] + m[2];
    m = /^([·•—–\-+(]\s*)(.+?)(\s*[)·•])?$/.exec(s);
    if (m && typeof D[m[2]] === 'string') return m[1] + D[m[2]] + (m[3] || '');
    for (var i = 0; i < MOTIFS.length; i++) {
      var x = MOTIFS[i][0].exec(s);
      if (x) { var r = MOTIFS[i][1].apply(null, x); if (r != null) return r; }
    }
    return null;
  }
  // Traduit un texte en gardant ses espaces autour ; renvoie le texte tel quel s'il est inconnu.
  function t(s) {
    if (langue !== 'en' || s == null) return s;
    s = String(s);
    var a = /^\s*/.exec(s)[0], z = /\s*$/.exec(s)[0];
    var c = s.slice(a.length, s.length - z.length);
    if (!c || !/[A-Za-zÀ-ÿ]/.test(c)) return s;
    var r = brut(c.replace(/\s+/g, ' '));
    return r == null ? s : a + r + z;
  }
  window.bsLangue = { langue: langue, choisir: choisir, t: t, motif: motif };
  if (langue !== 'en') return;

  document.documentElement.lang = 'en';
  // Nombres suivis d'un mot connu : « 12 prospects », « 3 relance(s) en retard ».
  motif(/^(\d[\d\s  .,]*)\s*(%|€)?\s+(.+)$/, function (_, n, u, reste) {
    var r = brut(reste); return r == null ? null : n + (u || '') + ' ' + r;
  });
  // Texte connu suivi d'un nombre ou d'un compte entre parenthèses : « Clients (12) », « Relancer 3 ».
  motif(/^(.+?)\s*(\(\d[^)]*\)|\d[\d\s  .,]*)$/, function (_, debut, n) {
    var r = brut(debut); return r == null ? null : r + ' ' + n;
  });
  motif(/^Il y a (\d+) (min|minutes?|h|heures?|jours?|semaines?|mois|ans?)$/, function (_, n, u) {
    var U = { min: 'min', minute: 'minute', minutes: 'minutes', h: 'h', heure: 'hour', heures: 'hours', jour: 'day', jours: 'days', semaine: 'week', semaines: 'weeks', mois: n > 1 ? 'months' : 'month', an: 'year', ans: 'years' };
    return n + ' ' + U[u] + ' ago';
  });
  motif(/^Dans (\d+) (min|minutes?|h|heures?|jours?|semaines?|mois)$/, function (_, n, u) {
    var U = { min: 'min', minute: 'minute', minutes: 'minutes', h: 'h', heure: 'hour', heures: 'hours', jour: 'day', jours: 'days', semaine: 'week', semaines: 'weeks', mois: n > 1 ? 'months' : 'month' };
    return 'In ' + n + ' ' + U[u];
  });

  // Dates et heures en anglais (les montants gardent leur format).
  var FR = /^fr(-|$)/i;
  function loc(l) { return (l == null || (typeof l === 'string' && FR.test(l)) || (Array.isArray(l) && FR.test(l[0] || ''))) ? 'en-GB' : l; }
  ['toLocaleDateString', 'toLocaleTimeString', 'toLocaleString'].forEach(function (k) {
    var f = Date.prototype[k];
    Date.prototype[k] = function (l, o) { return f.call(this, loc(l), o); };
  });
  var DTF = Intl.DateTimeFormat;
  var DTF2 = function (l, o) { return new DTF(loc(l), o); };
  DTF2.prototype = DTF.prototype; DTF2.supportedLocalesOf = DTF.supportedLocalesOf;
  Intl.DateTimeFormat = DTF2;
  if (Intl.RelativeTimeFormat) {
    var RTF = Intl.RelativeTimeFormat;
    var RTF2 = function (l, o) { return new RTF(loc(l), o); };
    RTF2.prototype = RTF.prototype; RTF2.supportedLocalesOf = RTF.supportedLocalesOf;
    Intl.RelativeTimeFormat = RTF2;
  }
  ['alert', 'confirm', 'prompt'].forEach(function (k) {
    var f = window[k];
    window[k] = function (msg, def) { return f.call(window, t(msg), def); };
  });

  // Zones jamais traduites : ce que les gens écrivent ou reçoivent.
  var IGNORE = 'script,style,textarea,[contenteditable=""],[contenteditable=true],.bsm-txt,.bsm-auteur,code,pre,[translate=no],.notranslate,[data-brut]';
  var ATTRS = ['title', 'placeholder', 'aria-label', 'alt'];
  function ignore(el) { return !!(el && el.closest && el.closest(IGNORE)); }
  function texte(n) {
    var p = n.parentNode;
    if (!p || p.nodeType !== 1 || ignore(p)) return;
    var v = n.data, r = t(v);
    if (r !== v) n.data = r;
  }
  function attrs(el) {
    if (el.tagName !== 'TEXTAREA' && ignore(el)) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var v = el.getAttribute(ATTRS[i]);
      if (v) { var r = t(v); if (r !== v) el.setAttribute(ATTRS[i], r); }
    }
    if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit') && el.value) { var w = t(el.value); if (w !== el.value) el.value = w; }
  }
  function arbre(racine) {
    if (racine.nodeType === 3) { texte(racine); return; }
    if (racine.nodeType !== 1 && racine.nodeType !== 9 && racine.nodeType !== 11) return;
    if (racine.nodeType === 1) { attrs(racine); if (ignore(racine)) return; }
    var w = document.createTreeWalker(racine, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (n.nodeType !== 1 || !n.matches(IGNORE)) return NodeFilter.FILTER_ACCEPT;
        if (n.tagName === 'TEXTAREA') attrs(n);
        return NodeFilter.FILTER_REJECT;
      },
    });
    var n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) texte(n); else attrs(n); }
  }
  var obs = new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) {
      var m = list[i];
      if (m.type === 'childList') for (var j = 0; j < m.addedNodes.length; j++) arbre(m.addedNodes[j]);
      else if (m.type === 'characterData') texte(m.target);
      else if (m.type === 'attributes') attrs(m.target);
    }
  });
  function demarrer() {
    D = window.BS_EN || {};
    arbre(document.documentElement);
    obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS.concat(['value']) });
  }
  if (window.BS_EN) demarrer();
  else window.addEventListener('bs-langue-en', demarrer, { once: true });
})();
