
/* Blackstart CRM : Formations en motion design (rubrique « Formations »).
 *
 * Chaque module est un film d'animation dessiné en direct dans le navigateur (aucun fichier vidéo) : maquettes du
 * CRM qui se construisent, curseur qui clique, chiffres qui défilent, graphiques qui se tracent, sous-titres.
 * - Lecteur complet : lecture / pause, barre de progression avec chapitres, retour en arrière, vitesse,
 *   plein écran, sous-titres, voix off neuronale française (fichiers voix/, synthèse du navigateur en secours),
 *   musique entraînante générée en direct qui baisse sous la voix, clavier.
 * - Le moteur pilote toutes les animations sur une même horloge (Web Animations API, en pause, positionnées à
 *   l'instant voulu) : on peut avancer, reculer ou sauter à un chapitre sans rien casser.
 * - À la fin de chaque module : quiz de 3 questions ; progression enregistrée ; certificat quand tout est vu.
 * - Version équipe (serveur) : progression enregistrée sur le compte, et l'administrateur voit celle de l'équipe.
 * L'interface appelle window.bsFormation.monter(élément) pour afficher la rubrique.
 */
(function () {
  'use strict';
  if (window.bsFormation) return;

  var W = 1280, H = 720;
  var SEEN_KEY = 'bs_formations_vus', QUIZ_KEY = 'bs-formation-quiz', PREF_KEY = 'bs-formation-prefs-v2';
  var SERVER = !!window.BS_SERVER;
  var C = { bg: '#0a1220', surf: '#0f1b2e', surf2: '#16233a', line: 'rgba(148,163,184,.18)', text: '#eaf1fb', text2: '#a9bfdd', text3: '#7d93b5',
    acc: '#3b82f6', acc2: '#60a5fa', cyan: '#22d3ee', green: '#34d399', amber: '#fbbf24', rose: '#fb7185', violet: '#a78bfa', orange: '#fb923c' };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ic(name, size, color) {
    var pl = window.bsIcones && window.bsIcones.plein && window.bsIcones.plein(name);
    var lib = pl || EXTRA[name] || (window.bsIcones && window.bsIcones.svg ? window.bsIcones.svg(name) : '');
    return '<svg width="' + (size || 18) + '" height="' + (size || 18) + '" viewBox="0 0 24 24" fill="none" stroke="' + (color || 'currentColor') +
      '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (lib || '<circle cx="12" cy="12" r="8"/>') + '</svg>';
  }
  var EXTRA = { 'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>', zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>' };
  var MUSIC_ICON = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
  function fmtTime(ms) { var s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function euro(v) { return Math.round(v).toLocaleString('fr-FR') + ' €'; }
  var EASE = 'cubic-bezier(.16,1,.3,1)', EASE_IO = 'cubic-bezier(.65,0,.35,1)', SPRING = 'cubic-bezier(.34,1.56,.64,1)';
  // Ressorts physiques et cascades de Motion (modules/bs-motion.js), joués sur l'horloge des scènes.
  function ressort(o) { return window.bsMotion ? window.bsMotion.ressort(o) : { d: Math.round((o && o.duree || .6) * 1100), easing: SPRING }; }
  function cascade(n, pas, depuis) {
    if (window.bsMotion) return window.bsMotion.cascade(n, pas, depuis);
    var out = []; for (var i = 0; i < n; i++) out.push(depuis === 'center' ? Math.abs(i - (n - 1) / 2) * pas : depuis === 'last' ? (n - 1 - i) * pas : i * pas); return out;
  }

  // ================================================================== voix off et durées
  // Voix off neuronale pré-enregistrée (fichiers voix/<empreinte>.mp3, durées dans window.BS_VOIX) ; sinon la
  // synthèse vocale du navigateur prend le relais. L'empreinte (FNV-1a 32 bits) est la même côté générateur.
  function hashCap(s) { var h = 0x811c9dc5; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); }
  // Voix ElevenLabs gardée par le serveur (window.BS_VOIX_11 = { empreinte: [durée ms, fichier] }) en priorité.
  function voix11(c) { var v = SERVER && window.BS_VOIX_11; return v && v[hashCap(c)] || null; }
  function voixMs(c) { var e = voix11(c); if (e) return e[0]; var v = window.BS_VOIX; return v && v[hashCap(c)] || 0; }
  function capDur(c) { var v = voixMs(c); return v ? Math.max(2200, v + 650) : Math.max(2600, c.length * 62 + 900); }

  // ================================================================== moteur de scène
  // Une scène reçoit S : éléments positionnés, animations sur l'horloge de la scène, sous-titres synchronisés.
  function makeScene(def, layer) {
    var anims = [], tickers = [];
    var beats = [], t = 500;
    def.captions.forEach(function (c) { beats.push(t); t += capDur(c); });
    var dur = Math.max(def.min || 0, t + 600);
    var S = {
      d: dur, beats: beats,
      b: function (i) { return beats[Math.min(i, beats.length - 1)]; },
      el: function (html, css, cls, parent) {
        var e = document.createElement('div');
        e.className = 'bsf-el' + (cls ? ' ' + cls : '');
        if (css) e.style.cssText = css;
        e.innerHTML = html || '';
        (parent || layer).appendChild(e);
        return e;
      },
      a: function (el, frames, at, d, ease, extra) {
        if (!el || !el.animate) return null;
        var an = el.animate(frames, Object.assign({ duration: d || 600, delay: at || 0, fill: 'both', easing: ease || EASE }, extra || {}));
        an.pause(); anims.push(an);
        return an;
      },
      tick: function (fn) { tickers.push(fn); },
      fadeUp: function (el, at, d, dist) { return S.a(el, [{ opacity: 0, transform: 'translateY(' + (dist == null ? 24 : dist) + 'px)' }, { opacity: 1, transform: 'none' }], at, d || 700); },
      fadeIn: function (el, at, d) { return S.a(el, [{ opacity: 0 }, { opacity: 1 }], at, d || 500, 'linear'); },
      fadeOut: function (el, at, d) { return S.a(el, [{ opacity: 1 }, { opacity: 0 }], at, d || 400, 'linear', { fill: 'forwards' }); },
      // Ressort : o = { duree (s), rebond (0 à 1) } ; la durée vient de la physique du ressort.
      spring: function (el, frames, at, o, extra) { var r = ressort(o); return S.a(el, frames, at, r.d, r.easing, extra); },
      pop: function (el, at, d) {
        S.a(el, [{ opacity: 0 }, { opacity: 1 }], at, 220, 'linear');
        return S.spring(el, [{ transform: 'scale(.55)' }, { transform: 'scale(1)' }], at, { duree: (d || 650) / 1000 * .7, rebond: .45 });
      },
      slide: function (el, at, dx, dy, d) {
        S.a(el, [{ opacity: 0 }, { opacity: 1 }], at, 300, 'linear');
        return S.spring(el, [{ transform: 'translate(' + (dx || 0) + 'px,' + (dy || 0) + 'px)' }, { transform: 'none' }], at, { duree: (d || 800) / 1000 * .65, rebond: .22 });
      },
      move: function (el, at, d, from, to, ease) { return S.a(el, [{ transform: from }, { transform: to }], at, d, ease || EASE_IO, { fill: 'forwards' }); },
      draw: function (path, at, d) { return S.a(path, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], at, d || 1200, EASE_IO); },
      grow: function (el, at, d, origin) { el.style.transformOrigin = origin || '50% 100%'; return S.a(el, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], at, d || 900); },
      growX: function (el, at, d) { el.style.transformOrigin = '0 50%'; return S.a(el, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], at, d || 900); },
      count: function (el, at, d, from, to, fmt) {
        fmt = fmt || function (v) { return Math.round(v).toLocaleString('fr-FR'); };
        S.tick(function (lt) { var k = Math.max(0, Math.min(1, (lt - at) / d)); k = 1 - Math.pow(1 - k, 3); el.textContent = fmt(from + (to - from) * k); });
      },
      type: function (el, at, text, cps) {
        S.tick(function (lt) { var n = Math.max(0, Math.min(text.length, Math.floor((lt - at) / 1000 * (cps || 16)))); el.textContent = text.slice(0, n); el.classList.toggle('bsf-caret', lt >= at && n < text.length + 4); });
      },
      // Pointeur de souris : suite de points [x, y, instant] ; clics : instants.
      cursor: function (pts, clicks, parent, size) {
        var cu = S.el('<svg width="' + (size || 26) + '" height="' + (size || 26) + '" viewBox="0 0 24 24"><path d="M4 2l15 9-6.5 1.6L16 20l-2.6 1.3-3.4-7.2L4 19z" fill="#fff" stroke="#0a1220" stroke-width="1.4" stroke-linejoin="round"/></svg>', 'left:0;top:0;z-index:50', 'bsf-cursor', parent);
        var frames = pts.map(function (p, i) { return { transform: 'translate(' + p[0] + 'px,' + p[1] + 'px)', offset: i / Math.max(1, pts.length - 1) }; });
        var t0 = pts[0][2], t1 = pts[pts.length - 1][2];
        // Positions à des instants précis : on reconstruit les « offsets » à partir des instants.
        frames.forEach(function (f, i) { f.offset = t1 > t0 ? (pts[i][2] - t0) / (t1 - t0) : i / Math.max(1, pts.length - 1); f.easing = EASE_IO; });
        S.a(cu, frames, t0, Math.max(1, t1 - t0), 'linear');
        S.a(cu, [{ opacity: 0 }, { opacity: 1 }], t0 - 300, 300, 'linear');
        (clicks || []).forEach(function (at) {
          var p = posAt(pts, at);
          var r = S.el('', 'left:' + (p[0] - 18) + 'px;top:' + (p[1] - 18) + 'px;width:36px;height:36px;z-index:49', 'bsf-ripple', parent);
          S.a(r, [{ opacity: .9, transform: 'scale(.2)' }, { opacity: 0, transform: 'scale(1.6)' }], at, 600, 'ease-out', { fill: 'none' });
          S.a(cu, [{ transform: 'translate(' + p[0] + 'px,' + p[1] + 'px) scale(1)' }, { transform: 'translate(' + p[0] + 'px,' + p[1] + 'px) scale(.82)' }, { transform: 'translate(' + p[0] + 'px,' + p[1] + 'px) scale(1)' }], at, 260, 'ease-out', { fill: 'none', composite: 'replace' });
        });
        return cu;
      },
      key: function (label, x, y, at) {
        var k = S.el(label, 'left:' + x + 'px;top:' + y + 'px', 'bsf-key');
        S.pop(k, at, 450);
        S.a(k, [{ transform: 'translateY(0)', boxShadow: '0 5px 0 #0b1426' }, { transform: 'translateY(4px)', boxShadow: '0 1px 0 #0b1426' }, { transform: 'translateY(0)', boxShadow: '0 5px 0 #0b1426' }], at + 500, 260, 'ease-out', { fill: 'none' });
        return k;
      },
    };
    function posAt(pts, at) {
      if (at <= pts[0][2]) return pts[0];
      for (var i = 1; i < pts.length; i++) if (at <= pts[i][2]) {
        var a = pts[i - 1], b = pts[i], k = (at - a[2]) / Math.max(1, b[2] - a[2]);
        return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
      }
      return pts[pts.length - 1];
    }
    // Entrée et sortie de la scène.
    // Fondu flou à l'entrée et à la sortie, et lent travelling avant pendant toute la scène (effet caméra).
    S.a(layer, [{ opacity: 0, filter: 'blur(12px) brightness(1.4)' }, { opacity: 1, filter: 'blur(0) brightness(1)' }], 0, 700, EASE);
    S.a(layer, [{ opacity: 1, filter: 'blur(0)' }, { opacity: 0, filter: 'blur(10px)' }], dur - 420, 420, 'ease-in', { fill: 'forwards' });
    S.a(layer, [{ transform: 'scale(1.06)' }, { transform: 'scale(1)', offset: .12 }, { transform: 'scale(1.03)' }], 0, dur, 'linear');
    def.build(S);
    return {
      dur: dur, beats: beats, captions: def.captions,
      seek: function (lt) {
        for (var i = 0; i < anims.length; i++) { try { anims[i].currentTime = lt; } catch (e) {} }
        for (var j = 0; j < tickers.length; j++) tickers[j](lt);
      },
    };
  }

  // ================================================================== éléments réutilisables
  var NAV = [['today', 'Aujourd’hui', 'phone'], ['agenda', 'Agenda', 'calendar'], ['prospects', 'Prospects', 'users'], ['pipeline', 'Pipeline', 'kanban'],
    ['tasks', 'Tâches', 'square-check'], ['devis', 'Devis & factures', 'file-text'], ['clients', 'Clients', 'briefcase'], ['payments', 'Paiements', 'wallet'],
    ['dashboard', 'Tableau de bord', 'layout-dashboard'], ['reports', 'Rapports', 'chart-line'], ['carte', 'Carte clients', 'globe'], ['formations', 'Formations', 'graduation-cap'], ['tools', 'Outils', 'wrench'], ['settings', 'Réglages', 'settings']];

  // Fenêtre du CRM stylisée : menu, barre du haut, zone de contenu (coordonnées relatives à la zone de contenu).
  function appWindow(S, o) {
    o = o || {};
    var win = S.el('', 'left:90px;top:56px;width:1100px;height:608px', 'bsf-win');
    var side = '<div class="bsf-brand"><span class="bsf-bm">B</span><b>BLACKSTART <i>AI</i></b></div>' + NAV.map(function (n) {
      return '<div class="bsf-nav' + (n[0] === o.active ? ' on' : '') + '" data-n="' + n[0] + '">' + ic(n[2], 15) + '<span>' + n[1] + '</span></div>';
    }).join('');
    win.innerHTML = '<div class="bsf-side">' + side + '</div><div class="bsf-top"><div class="bsf-search">' + ic('search', 14) + '<span>Rechercher…</span><kbd>Ctrl K</kbd></div>' +
      '<div class="bsf-create">' + ic('plus', 14) + 'Créer</div></div><div class="bsf-content"></div>';
    var content = win.querySelector('.bsf-content');
    if (o.enter !== false) S.a(win, [{ opacity: 0, transform: 'translateY(30px) scale(.97)' }, { opacity: 1, transform: 'none' }], o.at || 0, 900);
    if (o.cascade) Array.prototype.forEach.call(win.querySelectorAll('.bsf-nav'), function (n, i) { S.slide(n, (o.at || 0) + 300 + i * 70, -24, 0, 500); });
    function add(html, css, cls) {
      var e = document.createElement('div');
      e.className = 'bsf-el' + (cls ? ' ' + cls : '');
      if (css) e.style.cssText = css;
      e.innerHTML = html || '';
      content.appendChild(e);
      return e;
    }
    function title(t, sub, at) {
      var h = add('<h3>' + esc(t) + '</h3>' + (sub ? '<p>' + esc(sub) + '</p>' : ''), 'left:28px;top:22px;width:600px', 'bsf-h');
      S.fadeUp(h, at || 0, 600, 14);
      return h;
    }
    return { win: win, content: content, add: add, title: title, nav: function (id) { return win.querySelector('[data-n="' + id + '"]'); } };
  }
  // Coordonnées écran d'un point de la zone de contenu (pour le curseur).
  var NAV_Y = 56 + 14 + 24 + 10; // première rubrique du menu, en coordonnées de la scène
  function cx(x) { return 90 + 200 + x; }
  function cy(y) { return 56 + 52 + y; }

  function titleScene(num, title, sub, items) {
    return {
      captions: ['Module ' + num + ' : ' + title + '.', sub],
      build: function (S) {
        var glow = S.el('', 'left:340px;top:60px;width:600px;height:600px', 'bsf-orb');
        S.a(glow, [{ transform: 'scale(.6)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], 0, 1600);
        var n = S.el('<svg width="320" height="200" viewBox="0 0 320 200"><text x="160" y="160" text-anchor="middle" class="bsf-num">' + ('0' + num).slice(-2) + '</text></svg>', 'left:480px;top:90px');
        S.a(n.querySelector('text'), [{ strokeDashoffset: 700, fillOpacity: 0 }, { strokeDashoffset: 0, fillOpacity: 0, offset: .7 }, { strokeDashoffset: 0, fillOpacity: 1 }], 200, 1800, EASE_IO);
        var k = S.el('Formation Blackstart CRM', 'left:0;top:318px;width:1280px', 'bsf-kicker');
        S.fadeUp(k, 700, 700, 12);
        var t = S.el(title.split(' ').map(function (w) { return '<span>' + esc(w) + '</span>'; }).join(' '), 'left:80px;top:350px;width:1120px' + (title.length > 32 ? ';font-size:' + Math.max(38, Math.round(56 * 32 / title.length)) + 'px' : ''), 'bsf-bigtitle');
        var dl = cascade(t.children.length, 90);
        Array.prototype.forEach.call(t.children, function (w, i) {
          S.a(w, [{ opacity: 0 }, { opacity: 1 }], 900 + dl[i], 260, 'linear');
          S.spring(w, [{ transform: 'translateY(46px) rotate(5deg) scale(.9)' }, { transform: 'none' }], 900 + dl[i], { duree: .55, rebond: .4 });
        });
        var line = S.el('', 'left:540px;top:446px;width:200px;height:3px', 'bsf-line');
        S.growX(line, 1500, 900);
        var chips = S.el((items || []).map(function (x) { return '<span>' + esc(x) + '</span>'; }).join(''), 'left:0;top:478px;width:1280px', 'bsf-chips');
        var dc = cascade(chips.children.length, 140, 'center');
        Array.prototype.forEach.call(chips.children, function (c, i) { S.pop(c, S.b(1) + dc[i], 500); });
      },
    };
  }
  // Exemple concret animé : un membre de l'équipe, une petite histoire en étapes, et le résultat.
  // o : { titre, qui: [initiales, nom, rôle, couleur], intro, etapes: [[heure, icône, texte court, phrase dite]], fin: [icône, texte, phrase dite] }
  var TEINTES = { bleu: ['#3b82f6', '#22d3ee'], violet: ['#8b5cf6', '#ec4899'], vert: ['#10b981', '#84cc16'], orange: ['#f97316', '#facc15'], rose: ['#f43f5e', '#a855f7'] };
  function exempleScene(o) {
    var et = o.etapes, caps = [o.intro].concat(et.map(function (e) { return e[3]; })).concat(o.fin ? [o.fin[2]] : []);
    return {
      exemple: true, captions: caps,
      build: function (S) {
        var tc = TEINTES[o.qui[3]] || TEINTES.bleu;
        var k = S.el(ic('sparkles', 15, '#fde68a') + '<span>Exemple concret</span>', 'left:90px;top:52px', 'bsf-ex-kick');
        S.pop(k, 150, 500);
        var h = S.el(esc(o.titre), 'left:90px;top:92px;width:1100px', 'bsf-ex-h');
        S.spring(h, [{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'none' }], 300, { duree: .6, rebond: .25 });
        // Le personnage : carte qui rebondit, avatar qui respire.
        var p = S.el('<div class="bsf-ex-av" style="background:linear-gradient(135deg,' + tc[0] + ',' + tc[1] + ')">' + esc(o.qui[0]) + '</div><b>' + esc(o.qui[1]) + '</b><span>' + esc(o.qui[2]) + '</span>',
          'left:90px;top:168px;width:300px;height:226px', 'bsf-ex-qui');
        S.a(p, [{ opacity: 0 }, { opacity: 1 }], 500, 300, 'linear');
        S.spring(p, [{ transform: 'translateX(-80px) rotate(-6deg) scale(.85)' }, { transform: 'none' }], 500, { duree: .7, rebond: .35 });
        S.a(p.querySelector('.bsf-ex-av'), [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], 1400, 2400, 'ease-in-out', { iterations: 40 });
        // La frise : un trait qui se dessine, une carte par étape.
        var top0 = 176, pas = Math.min(104, 320 / Math.max(1, et.length - 1));
        var rail = S.el('', 'left:470px;top:' + (top0 + 20) + 'px;width:3px;height:' + (pas * (et.length - 1) + 30) + 'px;background:linear-gradient(' + tc[0] + ',' + tc[1] + ');border-radius:3px', '');
        rail.style.transformOrigin = '50% 0'; S.a(rail, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], S.b(1) - 300, (S.b(caps.length - 1) - S.b(1)) || 1200, 'linear');
        et.forEach(function (e, i) {
          var at = S.b(i + 1), y = top0 + i * pas;
          var dot = S.el(ic(e[1], 20, '#fff'), 'left:450px;top:' + y + 'px;width:44px;height:44px;background:linear-gradient(135deg,' + tc[0] + ',' + tc[1] + ')', 'bsf-ex-dot');
          S.pop(dot, at - 150, 550);
          var c = S.el('<em>' + esc(e[0]) + '</em><span>' + esc(e[2]) + '</span>', 'left:516px;top:' + (y - 6) + 'px;width:680px', 'bsf-ex-card');
          S.a(c, [{ opacity: 0 }, { opacity: 1 }], at, 280, 'linear');
          S.spring(c, [{ transform: 'translateX(120px) scale(.92)' }, { transform: 'none' }], at, { duree: .6, rebond: .3 });
          if (i < et.length - 1) S.a(c, [{ opacity: 1 }, { opacity: .55 }], S.b(i + 2), 500, 'linear', { fill: 'forwards' });
        });
        if (o.fin) {
          var at = S.b(caps.length - 1);
          var f = S.el(ic(o.fin[0], 22, '#052e1b') + '<span>' + esc(o.fin[1]) + '</span>', 'left:90px;top:414px;width:300px', 'bsf-ex-fin');
          S.a(f, [{ opacity: 0 }, { opacity: 1 }], at, 200, 'linear');
          S.spring(f, [{ transform: 'scale(.3) rotate(-8deg)' }, { transform: 'none' }], at, { duree: .5, rebond: .55 });
          // Petites étincelles qui jaillissent du badge.
          var dl = cascade(12, 25, 'center');
          for (var j = 0; j < 12; j++) {
            var a = j / 12 * Math.PI * 2, sp = S.el('', 'left:236px;top:440px;width:8px;height:8px;opacity:0;background:' + [C.amber, C.green, C.cyan, C.rose][j % 4], 'bsf-ex-spark');
            S.a(sp, [{ opacity: 1, transform: 'translate(0,0) scale(1)' }, { opacity: 0, transform: 'translate(' + Math.round(Math.cos(a) * 170) + 'px,' + Math.round(Math.sin(a) * 110) + 'px) scale(.3)' }], at + 120 + dl[j], 900, 'cubic-bezier(.2,.8,.3,1)', { fill: 'forwards' });
          }
        }
      },
    };
  }
  function recapScene(points, next) {
    return {
      captions: ['À retenir.'].concat(points).concat(next ? ['Prochain module : ' + next + '.'] : ['Bravo, vous connaissez maintenant tout le CRM !']),
      build: function (S) {
        var h = S.el('À retenir', 'left:150px;top:70px', 'bsf-recap-h');
        S.fadeUp(h, 200, 700);
        points.forEach(function (p, i) {
          var row = S.el('<span class="bsf-check"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" pathLength="1" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span>' + esc(p) + '</span>', 'left:150px;top:' + (158 + i * 78) + 'px;width:980px', 'bsf-recap');
          S.slide(row, S.b(i + 1) - 200, -40, 0, 700);
          S.pop(row.querySelector('.bsf-check'), S.b(i + 1), 500);
          S.draw(row.querySelector('path'), S.b(i + 1) + 200, 500);
        });
        var nx = S.el(next ? 'Suivant : ' + esc(next) + ' ' + ic('arrow-right', 18) : ic('trophy', 22) + ' Formation terminée', 'left:150px;top:' + (178 + points.length * 78) + 'px', 'bsf-next');
        S.fadeUp(nx, S.b(points.length + 1), 700);
      },
    };
  }

  // ================================================================== scènes « vraie interface »
  // Captures réelles du CRM (scripts/formation/ecrans.mjs → formation/ecrans/<id>-<clair|sombre>.webp, zones dans
  // window.BS_ECRANS) mises en scène : fenêtre de navigateur, zoom caméra, curseur, clics, surlignage, bulles.
  // Version équipe seulement (la version autonome n'a pas les images) : sinon la scène est retirée du module.
  var ECRANS = window.BS_ECRANS || null;
  function ecranOk(id) { return !!(SERVER && ECRANS && ECRANS[id]); }
  function ecranUrl(id) {
    var light = document.documentElement.getAttribute('data-scheme') === 'light';
    return 'formation/ecrans/' + id + '-' + (light ? 'clair' : 'sombre') + '.webp' + (ECRANS && ECRANS._v ? '?v=' + ECRANS._v : '');
  }
  // o : { t: titre du tuto, ecran: id, captions, steps: [{ b: n° de phrase, d: décalage ms, ecran, zoom, s, curseur, clic, spot, bulle }] }
  //  zoom : nom de zone (ou null pour revenir au plan large) ; curseur : zone visée ; spot : zone surlignée (false = retire).
  function tuto(o) {
    var ids = [o.ecran].concat((o.steps || []).filter(function (s) { return s.ecran; }).map(function (s) { return s.ecran; }));
    if (!ids.every(ecranOk)) return null;
    return {
      tuto: o.t, nouveau: !!o.nouveau, ecrans: ids, captions: o.captions, min: o.min,
      build: function (S) {
        var E0 = ECRANS[o.ecran], mobile = E0.w < 600;
        // Fenêtre : navigateur (ordinateur) ou téléphone, au format de la capture.
        var VW = mobile ? 300 : 1040, VH = Math.round(VW * E0.h / E0.w), k = VW / E0.w;
        var left = Math.round((W - VW) / 2), top = mobile ? 26 : 16;
        var win = S.el('<div class="bsf-bbar"><i></i><i></i><i></i><span>' + ic('lock', 11) + ' crm.blackstart.ai/#/' + esc(o.page || '') + '</span></div><div class="bsf-bview"><div class="bsf-bcam"></div></div>',
          'left:' + left + 'px;top:' + top + 'px;width:' + VW + 'px', 'bsf-browser' + (mobile ? ' phone' : ''));
        var view = win.querySelector('.bsf-bview'), cam = win.querySelector('.bsf-bcam');
        view.style.height = VH + 'px';
        cam.style.cssText = 'width:' + VW + 'px;height:' + VH + 'px';
        S.a(win, [{ opacity: 0 }, { opacity: 1 }], 0, 380, 'linear');
        S.spring(win, [{ transform: 'translateY(60px) scale(.92) rotateX(10deg)' }, { transform: 'none' }], 0, { duree: .75, rebond: .25 });
        var tag = S.el(ic('play', 12) + '<span>Tuto</span>' + esc(o.t), 'left:' + (left + 14) + 'px;top:' + (top + (mobile ? 14 : 44)) + 'px', 'bsf-tutotag');
        S.a(tag, [{ opacity: 0, transform: 'translateX(-20px)' }, { opacity: 1, transform: 'none', offset: .15 }, { opacity: 1, transform: 'none', offset: .85 }, { opacity: 0, transform: 'translateX(-10px)' }], 500, 3600, 'linear');
        function img(id) { var i = new Image(); i.src = ecranUrl(id); i.alt = ''; i.className = 'bsf-shot'; i.draggable = false; cam.appendChild(i); return i; }
        img(o.ecran);
        function zone(id, name) {
          var Z = ECRANS[id].z || {}, r = Array.isArray(name) ? name : Z[name];
          return r ? [r[0] * k, r[1] * k, r[2] * k, r[3] * k] : null;
        }
        var curId = o.ecran, camNow = [0, 0, 1], spotEl = null, curPts = [[VW * .62, VH * .7, 300]], clicks = [];
        function tr(c) { return 'translate(' + c[0].toFixed(1) + 'px,' + c[1].toFixed(1) + 'px) scale(' + c[2].toFixed(3) + ')'; }
        function camFor(z, sc) {
          if (!z) return [0, 0, 1];
          var s = sc || Math.max(1, Math.min(mobile ? 1.8 : 2.3, Math.min(VW / (z[2] * 1.3), VH / (z[3] * 1.35))));
          var cx = z[0] + z[2] / 2, cy = z[1] + z[3] / 2;
          var tx = Math.min(0, Math.max(VW - VW * s, VW / 2 - cx * s)), ty = Math.min(0, Math.max(VH - VH * s, VH / 2 - cy * s));
          return [tx, ty, s];
        }
        (o.steps || []).forEach(function (st) {
          var at = (st.b != null ? S.b(st.b) : 400) + (st.d || 0);
          if (st.ecran && st.ecran !== curId) {
            var im = img(st.ecran); curId = st.ecran;
            S.a(im, [{ opacity: 0, filter: 'blur(6px)' }, { opacity: 1, filter: 'blur(0)' }], at, 500, 'ease-out');
          }
          if (st.zoom !== undefined) {
            var to = camFor(st.zoom ? zone(curId, st.zoom) : null, st.s);
            S.a(cam, [{ transform: tr(camNow) }, { transform: tr(to) }], at, st.lent ? 1800 : 1150, EASE_IO, { fill: 'forwards' });
            camNow = to;
          }
          if (st.spot !== undefined) {
            if (spotEl) S.fadeOut(spotEl, at, 300);
            spotEl = null;
            var z = st.spot && zone(curId, st.spot);
            if (z) {
              spotEl = S.el('', 'left:' + (z[0] - 5) + 'px;top:' + (z[1] - 5) + 'px;width:' + (z[2] + 10) + 'px;height:' + (z[3] + 10) + 'px', 'bsf-halo', cam);
              S.a(spotEl, [{ opacity: 0, transform: 'scale(1.08)' }, { opacity: 1, transform: 'none' }], at + 150, 600);
            }
          }
          if (st.curseur) {
            var zc = zone(curId, st.curseur);
            if (zc) {
              var px = zc[0] + Math.min(zc[2] / 2, 40 * k + zc[2] * .25), py = zc[1] + zc[3] / 2;
              if (st.centre) px = zc[0] + zc[2] / 2;
              curPts.push([curPts[curPts.length - 1][0], curPts[curPts.length - 1][1], Math.max(curPts[curPts.length - 1][2] + 50, at - 900)]);
              curPts.push([px, py, at]);
              if (st.clic) clicks.push(at + 120);
            }
          }
          if (st.bulle) {
            var zb = zone(curId, st.bulle[0]);
            if (zb) {
              var below = zb[1] + zb[3] + 54 < VH, bl = S.el(esc(st.bulle[1]), 'left:' + (zb[0] + zb[2] / 2) + 'px;top:' + (below ? zb[1] + zb[3] + 10 : zb[1] - 10) + 'px', 'bsf-bulle' + (below ? '' : ' up'), cam);
              S.a(bl, [{ opacity: 0 }, { opacity: 1 }], at + 300, 200, 'linear');
              S.spring(bl, [{ transform: 'translate(-50%,' + (below ? '0' : '-100%') + ') translateY(' + (below ? 14 : -14) + 'px) scale(.7)' }, { transform: 'translate(-50%,' + (below ? '0' : '-100%') + ')' }], at + 300, { duree: .45, rebond: .5 });
              S.a(bl, [{ opacity: 1 }, { opacity: 0 }], at + (st.duree || 3200), 300, 'linear', { fill: 'forwards' });
            }
          }
        });
        if (curPts.length > 1) S.cursor(curPts, clicks, cam, mobile ? 30 : 22);
      },
    };
  }
  // Scènes d'un module : on retire celles dont les captures manquent.
  function scenes(list) { return list.filter(Boolean); }

  // Planète stylisée (SVG) pour les scènes « carte clients ».
  function globeSvg(zoomed) {
    var pts = '', arcs = '', P = [[300, 250], [338, 214], [262, 300], [352, 300], [228, 220], [390, 258], [300, 340], [250, 170]];
    var dots = '';
    for (var y = 70; y <= 530; y += 18) for (var x = 70; x <= 530; x += 18) {
      var dx = x - 300, dy = y - 300, r = Math.sqrt(dx * dx + dy * dy);
      if (r < 238 && (Math.sin(x * .05) + Math.cos(y * .045) + Math.sin((x + y) * .02)) > .35) dots += '<circle cx="' + x + '" cy="' + y + '" r="' + (2.6 - r / 200) + '" fill="#60a5fa" opacity="' + (0.85 - r / 330).toFixed(2) + '"/>';
    }
    P.forEach(function (p, i) {
      var c = i < 3 ? '#34d399' : '#60a5fa';
      pts += '<circle class="pt" cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="' + c + '" style="transform-origin:' + p[0] + 'px ' + p[1] + 'px;filter:drop-shadow(0 0 8px ' + c + ')"/>';
      if (i) arcs += '<path class="arc" pathLength="1" d="M300 250 Q ' + ((300 + p[0]) / 2) + ' ' + (Math.min(250, p[1]) - 60) + ' ' + p[0] + ' ' + p[1] + '" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="1" stroke-dashoffset="1" opacity=".8"/>';
    });
    return '<svg width="100%" height="100%" viewBox="0 0 600 600"><defs><radialGradient id="bsfG' + (zoomed ? 'z' : '') + '" cx="40%" cy="35%"><stop offset="0" stop-color="#1e3a8a"/><stop offset="1" stop-color="#030712"/></radialGradient></defs>' +
      '<circle cx="300" cy="300" r="262" fill="none" stroke="rgba(96,165,250,.25)" stroke-width="18" style="filter:blur(10px)"/>' +
      '<circle cx="300" cy="300" r="250" fill="url(#bsfG' + (zoomed ? 'z' : '') + ')" stroke="rgba(96,165,250,.5)"/>' +
      [0, 1, 2, 3, 4, 5].map(function () { return '<ellipse class="mer" cx="300" cy="300" rx="250" ry="250" fill="none" stroke="rgba(148,163,184,.14)"/>'; }).join('') +
      [-150, -75, 0, 75, 150].map(function (d) { var w = Math.sqrt(250 * 250 - d * d); return '<ellipse cx="300" cy="' + (300 + d) + '" rx="' + w + '" ry="' + (w * .12) + '" fill="none" stroke="rgba(148,163,184,.12)"/>'; }).join('') +
      dots + arcs + pts + '<circle cx="300" cy="250" r="8" fill="#fbbf24" style="filter:drop-shadow(0 0 10px #fbbf24)"/></svg>';
  }

  // ================================================================== les 8 modules
  var ANCIENS = [
    { f: '01-prise-en-main', t: 'Prise en main de l’interface', s: 'Menu, recherche Ctrl K, bouton Créer, mode clair ou sombre.',
      quiz: [
        ['Quel raccourci ouvre la recherche et les commandes ?', ['Ctrl + K', 'Ctrl + P', 'Alt + F4'], 0],
        ['Où créer rapidement un prospect, une tâche ou un devis ?', ['Dans Réglages', 'Avec le bouton « Créer » en haut', 'Dans Rapports'], 1],
        ['Où passer en mode clair ou sombre ?', ['Réglages › Apparence (ou l’icône soleil)', 'Paiements', 'Ce n’est pas possible'], 0],
      ],
      scenes: [
        titleScene(1, 'Prise en main de l’interface', 'En deux minutes, vous saurez vous repérer partout.', ['Menu', 'Recherche', 'Créer', 'Thème']),
        { captions: ['À gauche, le menu regroupe toutes les rubriques : prospection, ventes et analyse.', 'La rubrique active est surlignée : un clic suffit pour changer de page.'],
          build: function (S) {
            var w = appWindow(S, { active: 'today', cascade: true });
            var hl = S.el('', 'left:96px;top:' + (NAV_Y + 2 * 36) + 'px;width:188px;height:32px', 'bsf-focus');
            S.a(hl, [{ opacity: 0, transform: 'scale(1.3)' }, { opacity: 1, transform: 'scale(1)' }], S.b(1), 500);
            w.title('Aujourd’hui', 'Votre journée en un coup d’œil', 600);
            [0, 1, 2].forEach(function (i) {
              var c = w.add('<b>' + ['7', '3', '12'][i] + '</b><span>' + ['Appels à passer', 'Rendez-vous', 'Tâches'][i] + '</span>', 'left:' + (28 + i * 280) + 'px;top:100px;width:260px;height:110px', 'bsf-kpi');
              S.fadeUp(c, 900 + i * 150);
            });
            S.cursor([[700, 600, S.b(1) - 300], [190, NAV_Y + 2 * 36 + 16, S.b(1) + 400], [190, NAV_Y + 2 * 36 + 16, S.b(1) + 1600]], [S.b(1) + 600]);
            S.tick(function (lt) {
              var on = lt >= S.b(1) + 600 ? 'prospects' : 'today';
              Array.prototype.forEach.call(w.win.querySelectorAll('.bsf-nav'), function (n) { n.classList.toggle('on', n.getAttribute('data-n') === on); });
            });
          } },
        { captions: ['Ctrl + K ouvre la recherche : prospects, devis, pages et actions, au même endroit.', 'Tapez quelques lettres, puis Entrée pour ouvrir le résultat.'],
          build: function (S) {
            var w = appWindow(S, { active: 'today', enter: false });
            w.title('Aujourd’hui', '', 0);
            var dim = S.el('', 'left:0;top:0;width:1280px;height:720px', 'bsf-dim');
            S.fadeIn(dim, S.b(0) + 900, 300);
            S.key('Ctrl', 520, 60, S.b(0));
            S.key('K', 650, 60, S.b(0) + 180);
            var pal = S.el('<div class="bsf-pal-in">' + ic('search', 18) + '<span class="bsf-typed"></span></div><div class="bsf-pal-res"></div>', 'left:340px;top:160px;width:600px', 'bsf-pal');
            S.a(pal, [{ opacity: 0, transform: 'translateY(-16px) scale(.96)' }, { opacity: 1, transform: 'none' }], S.b(0) + 1000, 500);
            S.type(pal.querySelector('.bsf-typed'), S.b(1), 'Dupont', 7);
            var res = pal.querySelector('.bsf-pal-res');
            [['users', 'Boulangerie Dupont', 'Prospect · Lyon'], ['file-text', 'Devis DEV-014 · Dupont', '1 450 € TTC'], ['phone', 'Appeler Dupont', 'Action']].forEach(function (r, i) {
              var row = document.createElement('div'); row.className = 'bsf-pal-row' + (i === 0 ? ' on' : '');
              row.innerHTML = ic(r[0], 16) + '<b>' + esc(r[1]) + '</b><span>' + esc(r[2]) + '</span>';
              res.appendChild(row);
              S.fadeUp(row, S.b(1) + 700 + i * 140, 400, 8);
            });
            S.key('Entrée', 1010, 420, S.b(1) + 1600);
          } },
        { captions: ['Le bouton Créer, en haut à droite, ajoute un prospect, une tâche ou un devis depuis n’importe quelle page.'],
          build: function (S) {
            var w = appWindow(S, { active: 'pipeline', enter: false });
            w.title('Pipeline', '', 0);
            var menu = S.el(['Nouveau prospect', 'Nouvelle tâche', 'Nouveau devis', 'Nouvelle facture'].map(function (x, i) {
              return '<div>' + ic(['users', 'square-check', 'file-text', 'receipt'][i], 15) + x + '</div>';
            }).join(''), 'left:1030px;top:118px;width:200px', 'bsf-menu');
            S.a(menu, [{ opacity: 0, transform: 'translateY(-10px) scale(.95)' }, { opacity: 1, transform: 'none' }], 1700, 400);
            Array.prototype.forEach.call(menu.children, function (m, i) { S.fadeUp(m, 1800 + i * 90, 350, 8); });
            S.cursor([[640, 500, 400], [1140, 84, 1400], [1140, 84, 1900], [1110, 132, 2700]], [1450, 2750]);
            var toast = S.el(ic('circle-check', 18, C.green) + 'Prospect créé', 'left:520px;top:620px', 'bsf-toast');
            S.slide(toast, 3000, 0, 30, 500);
          } },
        { captions: ['Clair ou sombre : choisissez le thème qui vous repose les yeux, ou laissez le CRM suivre votre ordinateur.'],
          build: function (S) {
            var dark = S.el('', 'left:240px;top:120px;width:800px;height:470px', 'bsf-theme dark');
            var light = S.el('', 'left:240px;top:120px;width:800px;height:470px', 'bsf-theme light');
            [dark, light].forEach(function (el) {
              el.innerHTML = '<div class="th-side"></div><div class="th-top"></div><div class="th-c"><i></i><i></i><i></i></div><div class="th-c2"><i></i><i></i></div>';
            });
            S.fadeUp(dark, 0, 800);
            S.a(light, [{ clipPath: 'circle(0% at 92% 6%)' }, { clipPath: 'circle(150% at 92% 6%)' }], 1800, 1400, EASE_IO);
            S.a(light, [{ clipPath: 'circle(150% at 92% 6%)' }, { clipPath: 'circle(0% at 92% 6%)' }], 4200, 1200, EASE_IO, { fill: 'forwards' });
            var sun = S.el(ic('sun', 26, C.amber), 'left:990px;top:128px', 'bsf-round');
            S.pop(sun, 1000);
            S.a(sun, [{ transform: 'rotate(0)' }, { transform: 'rotate(180deg)' }], 1800, 1400);
          } },
        recapScene(['Le menu à gauche mène à toutes les rubriques.', 'Ctrl + K : rechercher et agir, au clavier.', 'Le bouton Créer, partout en haut à droite.', 'Le thème clair ou sombre, dans Apparence.'], 'Ma journée et la session d’appels'),
      ] },

    { f: '02-journee-et-appels', t: 'Ma journée et la session d’appels', s: 'Écran Aujourd’hui, file d’appels, script, résultat et relance.',
      quiz: [
        ['Dans la file d’appels, quels prospects passent en premier ?', ['Les plus récents', 'Les relances en retard', 'Par ordre alphabétique'], 1],
        ['Que propose la session d’appels ?', ['D’enchaîner les appels sans revenir à la liste', 'D’envoyer des SMS groupés', 'D’imprimer la liste'], 0],
        ['Après « À rappeler », que fait le CRM ?', ['Rien', 'Il supprime le prospect', 'Il programme la relance dans l’agenda'], 2],
      ],
      scenes: [
        titleScene(2, 'Ma journée et la session d’appels', 'Le cœur de la prospection : appeler, noter, relancer.', ['File d’appels', 'Script', 'Résultat', 'Relance']),
        { captions: ['L’écran Aujourd’hui affiche votre file d’appels : les relances en retard passent en premier.', 'Vos objectifs de la semaine progressent à chaque appel.'],
          build: function (S) {
            var w = appWindow(S, { active: 'today' });
            w.title('Aujourd’hui', 'Lundi · 7 appels à passer', 400);
            var rows = [['Plomberie Martin', 'En retard · 2 j', C.rose], ['Cabinet Lefèvre', 'En retard · 1 j', C.rose], ['Garage du Centre', 'Aujourd’hui 10:30', C.amber], ['Studio Nova', 'Aujourd’hui 14:00', C.amber], ['Pharmacie Bellecour', 'Nouveau', C.acc2]];
            rows.forEach(function (r, i) {
              var row = w.add('<span class="bsf-av" style="background:' + r[2] + '22;color:' + r[2] + '">' + r[0].split(' ').map(function (x) { return x[0]; }).join('').slice(0, 2) + '</span><b>' + esc(r[0]) + '</b><span class="bsf-pill" style="color:' + r[2] + ';background:' + r[2] + '1f">' + esc(r[1]) + '</span><span class="bsf-callbtn">' + ic('phone', 15) + '</span>', 'left:28px;top:' + (96 + i * 62) + 'px;width:540px;height:52px', 'bsf-row');
              S.slide(row, 800 + i * 140, -30, 0, 600);
            });
            var goal = w.add('<b>Objectifs de la semaine</b><div class="bsf-goal"><span>Appels</span><i><u style="background:' + C.acc + '"></u></i><em class="g1">0</em></div><div class="bsf-goal"><span>Rendez-vous</span><i><u style="background:' + C.green + '"></u></i><em class="g2">0</em></div>', 'left:596px;top:96px;width:270px;height:200px', 'bsf-card');
            S.fadeUp(goal, 1200);
            var bars = goal.querySelectorAll('u');
            S.a(bars[0], [{ width: '0%' }, { width: '68%' }], S.b(1), 1400);
            S.a(bars[1], [{ width: '0%' }, { width: '45%' }], S.b(1) + 200, 1400);
            S.count(goal.querySelector('.g1'), S.b(1), 1400, 0, 34, function (v) { return Math.round(v) + ' / 50'; });
            S.count(goal.querySelector('.g2'), S.b(1) + 200, 1400, 0, 4, function (v) { return Math.round(v) + ' / 9'; });
          } },
        { captions: ['Lancez la session d’appels : le CRM compose le numéro et chronomètre l’appel.', 'Le script s’affiche pendant que vous parlez ; cochez chaque étape au fil de la conversation.'],
          build: function (S) {
            var card = S.el('<div class="bsf-call-h"><span class="bsf-av big">PM</span><div><b>Plomberie Martin</b><span>Jean Martin · 04 72 00 00 00</span></div><span class="bsf-live">● En appel</span><span class="bsf-timer">00:00</span></div>' +
              '<div class="bsf-script"><b>Script d’appel</b>' + ['Se présenter en 10 secondes', 'Question : comment gérez-vous vos appels ?', 'Proposer un audit gratuit', 'Fixer le rendez-vous'].map(function (x) {
                return '<div class="bsf-step"><i></i><span>' + esc(x) + '</span></div>';
              }).join('') + '</div>', 'left:260px;top:90px;width:760px;height:540px', 'bsf-callcard');
            S.a(card, [{ opacity: 0, transform: 'scale(.9)' }, { opacity: 1, transform: 'none' }], 200, 800, SPRING);
            var ring = S.el('', 'left:300px;top:118px;width:76px;height:76px', 'bsf-ringpulse');
            S.a(ring, [{ transform: 'scale(.8)', opacity: .8 }, { transform: 'scale(1.8)', opacity: 0 }], 900, 1200, 'ease-out', { iterations: 3 });
            var timer = card.querySelector('.bsf-timer');
            S.tick(function (lt) { var s = Math.max(0, Math.floor((lt - 1000) / 1000 * 3)); timer.textContent = ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + s % 60).slice(-2); });
            Array.prototype.forEach.call(card.querySelectorAll('.bsf-step'), function (st, i) {
              S.fadeUp(st, 1400 + i * 150, 500, 10);
              S.a(st.querySelector('i'), [{ background: 'transparent', borderColor: 'rgba(148,163,184,.5)' }, { background: C.green, borderColor: C.green }], S.b(1) + 400 + i * 900, 300, 'linear');
              S.a(st, [{ color: C.text2 }, { color: C.text }], S.b(1) + 400 + i * 900, 300, 'linear');
            });
          } },
        { captions: ['Choisissez le résultat : rendez-vous pris, à rappeler, injoignable…', 'À rappeler : le CRM programme la relance dans l’agenda, rien ne se perd.'],
          build: function (S) {
            var res = [['RDV pris', C.green, 'calendar'], ['À rappeler', C.amber, 'clock'], ['Injoignable', C.text3, 'phone'], ['Pas intéressé', C.rose, 'circle-check']];
            res.forEach(function (r, i) {
              var b = S.el(ic(r[2], 20, r[1]) + '<span>' + r[0] + '</span>', 'left:' + (180 + i * 235) + 'px;top:170px;width:210px;border-color:' + r[1] + '55', 'bsf-result');
              S.pop(b, 300 + i * 120);
              if (i === 1) S.a(b, [{ background: 'rgba(255,255,255,.04)' }, { background: r[1] + '33' }], S.b(1) - 300, 300, 'linear');
            });
            S.cursor([[640, 600, 300], [650, 205, S.b(1) - 600], [650, 205, S.b(1) + 200]], [S.b(1) - 350]);
            var cal = S.el('<div class="bsf-cal-h">' + ic('calendar', 16) + ' Agenda · semaine</div><div class="bsf-cal-g">' + ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'].map(function (d) { return '<div><span>' + d + '</span><i></i><i></i><i></i></div>'; }).join('') + '</div>', 'left:300px;top:300px;width:680px;height:300px', 'bsf-card bsf-cal');
            S.fadeUp(cal, S.b(1) + 300);
            var ev = S.el(ic('phone', 13) + ' Rappeler Plomberie Martin · 10:00', 'left:540px;top:300px', 'bsf-event');
            S.a(ev, [{ opacity: 0, transform: 'translate(110px,-140px) scale(1.2)' }, { opacity: 1, transform: 'translate(-50px,130px) scale(1)' }], S.b(1) + 1100, 1100, SPRING);
          } },
        recapScene(['La file d’appels met les retards en premier.', 'La session enchaîne les appels, avec chrono et script.', 'Un résultat par appel ; la relance part dans l’agenda.'], 'Gérer vos prospects'),
      ] },

    { f: '03-prospects', t: 'Gérer vos prospects', s: 'Filtres, fiche prospect, emails, création, import et export.',
      quiz: [
        ['Comment réduire la liste aux prospects « Chauds » de Lyon ?', ['En les supprimant', 'Avec les filtres en haut du tableau', 'En exportant en CSV'], 1],
        ['Que contient la fiche d’un prospect ?', ['Uniquement le téléphone', 'Tout l’historique : appels, emails, tâches, documents', 'Seulement les factures'], 1],
        ['Comment ajouter 200 prospects d’un coup ?', ['Importer un fichier CSV ou Excel', 'Les taper un par un', 'Impossible'], 0],
      ],
      scenes: [
        titleScene(3, 'Gérer vos prospects', 'Un fichier clair, filtré, à jour.', ['Filtres', 'Fiche', 'Emails', 'Import CSV']),
        { captions: ['Le tableau des prospects se trie et se filtre : statut, secteur, priorité, ville.', 'Deux clics, et il ne reste que ceux qui comptent aujourd’hui.'],
          build: function (S) {
            var w = appWindow(S, { active: 'prospects' });
            w.title('Prospects', '36 prospects', 400);
            var chips = w.add('<span>Tous</span><span class="f1">' + ic('flame', 13) + ' Chaud</span><span class="f2">Lyon</span><span>Artisans</span>', 'left:28px;top:84px;width:700px', 'bsf-fchips');
            S.fadeUp(chips, 700);
            var data = [['Plomberie Martin', 'Chaud', 'Lyon', 1], ['Studio Nova', 'Tiède', 'Paris', 0], ['Garage du Centre', 'Chaud', 'Lyon', 1], ['Cabinet Lefèvre', 'Froid', 'Lille', 0], ['Pharmacie Bellecour', 'Chaud', 'Lyon', 1], ['Atelier Bois', 'Tiède', 'Nantes', 0]];
            var kept = 0;
            data.forEach(function (d, i) {
              var col = d[1] === 'Chaud' ? C.rose : d[1] === 'Tiède' ? C.amber : C.acc2;
              var row = w.add('<b>' + esc(d[0]) + '</b><span class="bsf-pill" style="color:' + col + ';background:' + col + '1f">' + d[1] + '</span><span>' + d[2] + '</span>', 'left:28px;top:' + (130 + i * 54) + 'px;width:820px;height:46px', 'bsf-row bsf-trow');
              S.slide(row, 900 + i * 110, 0, 16, 500);
              if (!d[3]) S.a(row, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(40px)' }], S.b(1), 500, EASE, { fill: 'forwards' });
              else { var to = 130 + kept * 54, from = 130 + i * 54; kept++; if (to !== from) S.move(row, S.b(1) + 500, 600, 'translateY(0)', 'translateY(' + (to - from) + 'px)'); }
            });
            ['.f1', '.f2'].forEach(function (s, i) { S.a(chips.querySelector(s), [{ background: 'rgba(255,255,255,.05)', color: C.text2 }, { background: C.acc, color: '#fff' }], S.b(1) - 500 + i * 300, 250, 'linear'); });
            S.cursor([[700, 640, S.b(0) + 1200], [cx(150), cy(98), S.b(1) - 600], [cx(240), cy(98), S.b(1) - 250], [cx(400), cy(400), S.b(1) + 900]], [S.b(1) - 500, S.b(1) - 200]);
          } },
        { captions: ['La fiche prospect rassemble tout : coordonnées, historique des appels, emails, tâches et documents.', 'Appel, email, SMS ou WhatsApp : un bouton, et l’action est notée dans l’historique.'],
          build: function (S) {
            var pan = S.el('<div class="bsf-fiche-h"><span class="bsf-av big" style="background:#fb718533;color:#fb7185">PM</span><div><b>Plomberie Martin</b><span>Jean Martin · Lyon 3e · Artisans</span></div></div>' +
              '<div class="bsf-acts">' + [['phone', 'Appeler'], ['mail', 'Email'], ['message-square', 'SMS'], ['send', 'WhatsApp']].map(function (a) { return '<span>' + ic(a[0], 15) + a[1] + '</span>'; }).join('') + '</div>' +
              '<div class="bsf-tl"></div>', 'left:300px;top:70px;width:680px;height:580px', 'bsf-card bsf-fiche');
            S.a(pan, [{ opacity: 0, transform: 'translateX(120px)' }, { opacity: 1, transform: 'none' }], 200, 900);
            var tl = pan.querySelector('.bsf-tl');
            [['phone', 'Appel · 4 min · intéressé', 'Hier 10:12', C.acc2], ['mail', 'Email « Proposition d’audit » envoyé', 'Hier 10:20', C.violet], ['calendar', 'RDV fixé jeudi 14:00', 'Hier 10:21', C.green], ['file-text', 'Devis DEV-014 · 1 450 €', 'Aujourd’hui', C.amber]].forEach(function (e, i) {
              var it = document.createElement('div'); it.className = 'bsf-tli';
              it.innerHTML = '<span class="bsf-dotc" style="background:' + e[3] + '22;color:' + e[3] + '">' + ic(e[0], 14) + '</span><b>' + esc(e[1]) + '</b><em>' + esc(e[2]) + '</em>';
              tl.appendChild(it);
              S.slide(it, 1300 + i * 260, 30, 0, 600);
            });
            var line = S.el('', 'left:349px;top:262px;width:2px;height:300px', 'bsf-vline');
            S.grow(line, 1200, 1300, '50% 0');
            Array.prototype.forEach.call(pan.querySelectorAll('.bsf-acts span'), function (s, i) { S.pop(s, S.b(1) + i * 120, 450); });
            S.a(pan.querySelectorAll('.bsf-acts span')[1], [{ background: 'rgba(255,255,255,.05)' }, { background: C.acc }], S.b(1) + 1300, 250, 'linear');
          } },
        { captions: ['Importez un fichier CSV ou Excel : le CRM reconnaît les colonnes et repère les doublons.', 'Et à tout moment, exportez votre fichier en un clic.'],
          build: function (S) {
            var file = S.el(ic('file-text', 40, C.green) + '<b>prospects-salon.csv</b><span>214 lignes</span>', 'left:150px;top:200px;width:220px;height:200px', 'bsf-file');
            S.a(file, [{ opacity: 0, transform: 'translate(-80px,-60px) rotate(-12deg)' }, { opacity: 1, transform: 'none' }], 300, 1000, SPRING);
            var arrow = S.el('<svg width="200" height="60" viewBox="0 0 200 60"><path d="M5 30 C70 0 130 60 190 30" pathLength="1" fill="none" stroke="' + C.acc2 + '" stroke-width="3" stroke-dasharray="1" stroke-linecap="round"/></svg>', 'left:390px;top:270px');
            S.draw(arrow.querySelector('path'), 1300, 900);
            var tbl = S.el('<div class="bsf-map">' + ['Entreprise', 'Contact', 'Téléphone', 'Ville'].map(function (h) { return '<span>' + h + ' ' + ic('check', 13, C.green) + '</span>'; }).join('') + '</div><div class="bsf-imp"></div>', 'left:610px;top:150px;width:520px;height:360px', 'bsf-card');
            S.fadeUp(tbl, 1700);
            Array.prototype.forEach.call(tbl.querySelectorAll('.bsf-map span'), function (s, i) { S.pop(s, 2000 + i * 150, 400); });
            var imp = tbl.querySelector('.bsf-imp');
            for (var i = 0; i < 6; i++) { var r = document.createElement('i'); imp.appendChild(r); S.slide(r, 2600 + i * 120, -30, 0, 400); }
            var badge = S.el(ic('circle-check', 18, C.green) + '<span class="bsf-cnt">0</span> prospects importés · 3 doublons ignorés', 'left:610px;top:530px', 'bsf-toast');
            S.fadeUp(badge, S.b(0) + 3200);
            S.count(badge.querySelector('.bsf-cnt'), S.b(0) + 3200, 1200, 0, 211);
            var exp = S.el(ic('download', 18) + 'Exporter CSV', 'left:900px;top:600px', 'bsf-btn');
            S.pop(exp, S.b(1));
            S.a(exp, [{ boxShadow: '0 0 0 0 rgba(59,130,246,.7)' }, { boxShadow: '0 0 0 18px rgba(59,130,246,0)' }], S.b(1) + 700, 900, 'ease-out');
          } },
        recapScene(['Filtres et tri : la bonne liste en deux clics.', 'La fiche garde tout l’historique, action par action.', 'Import CSV ou Excel, export en un clic.'], 'Pipeline, agenda et tâches'),
      ] },

    { f: '04-pipeline-agenda-taches', t: 'Pipeline, agenda et tâches', s: 'Glisser-déposer, vues jour, semaine, mois, planifier, tâches.',
      quiz: [
        ['Comment faire avancer une affaire dans le pipeline ?', ['Glisser la carte dans la colonne suivante', 'La supprimer puis la recréer', 'Envoyer un email'], 0],
        ['Quelles vues propose l’agenda ?', ['Uniquement l’année', 'Jour, semaine et mois', 'Aucune'], 1],
        ['Où voir les tâches du jour ?', ['Dans Paiements', 'Sur l’écran Aujourd’hui et dans Tâches', 'Nulle part'], 1],
      ],
      scenes: [
        titleScene(4, 'Pipeline, agenda et tâches', 'Voir où en est chaque affaire, et ne rater aucun rendez-vous.', ['Kanban', 'Agenda', 'Tâches']),
        { captions: ['Le pipeline montre chaque affaire, colonne par colonne, de « À appeler » à « Client ».', 'Glissez une carte d’une colonne à l’autre : le statut et l’historique se mettent à jour.'],
          build: function (S) {
            var cols = [['À appeler', C.acc2], ['RDV pris', C.violet], ['Proposition', C.amber], ['Client', C.green]];
            cols.forEach(function (c, i) {
              var col = S.el('<div class="bsf-col-h" style="color:' + c[1] + '"><i style="background:' + c[1] + '"></i>' + c[0] + '</div>', 'left:' + (100 + i * 275) + 'px;top:110px;width:255px;height:500px', 'bsf-col');
              S.fadeUp(col, 200 + i * 150);
              for (var k = 0; k < (i === 0 ? 3 : 2); k++) {
                var card = S.el('<b>' + ['Studio Nova', 'Atelier Bois', 'Garage du Centre', 'Cabinet Lefèvre', 'Pharmacie Bellecour', 'Boulangerie Dupont', 'Hôtel Saône', 'Optique Vision', 'Agence Lumen'][i * 2 + k] + '</b><span>' + ['1 200 €', '850 €', '2 400 €', '990 €', '1 450 €'][(i + k) % 5] + '</span>', 'left:' + (112 + i * 275) + 'px;top:' + (164 + k * 84) + 'px;width:231px;height:72px', 'bsf-kcard');
                S.fadeUp(card, 500 + i * 150 + k * 100, 500, 12);
              }
            });
            var drag = S.el('<b>Plomberie Martin</b><span>1 800 €</span>', 'left:112px;top:416px;width:231px;height:72px;z-index:20', 'bsf-kcard drag');
            S.fadeUp(drag, 900, 500, 12);
            S.a(drag, [{ transform: 'translate(0,0) rotate(0)', boxShadow: '0 4px 10px rgba(0,0,0,.2)' }, { transform: 'translate(0,-6px) rotate(-3deg)', boxShadow: '0 22px 40px rgba(0,0,0,.45)', offset: .12 },
              { transform: 'translate(275px,-84px) rotate(-3deg)', boxShadow: '0 22px 40px rgba(0,0,0,.45)', offset: .85 }, { transform: 'translate(275px,-84px) rotate(0)', boxShadow: '0 4px 10px rgba(0,0,0,.2)' }], S.b(1), 1800, EASE_IO);
            S.cursor([[700, 650, S.b(1) - 800], [230, 450, S.b(1) - 100], [505, 366, S.b(1) + 1500], [560, 420, S.b(1) + 2200]], [S.b(1) - 50]);
            var flash = S.el('Statut : RDV pris · noté dans l’historique', 'left:390px;top:630px', 'bsf-toast');
            S.slide(flash, S.b(1) + 1900, 0, 20, 500);
          } },
        { captions: ['L’agenda réunit relances et tâches : vue jour, semaine ou mois.', 'Planifiez un créneau directement depuis la fiche du prospect.'],
          build: function (S) {
            var seg = S.el('<span>Jour</span><span class="on">Semaine</span><span>Mois</span>', 'left:480px;top:80px', 'bsf-seg');
            S.fadeUp(seg, 200);
            var ind = S.el('', 'left:0;top:0;width:96px;height:34px', 'bsf-seg-ind');
            S.a(ind, [{ transform: 'translate(484px,84px)' }, { transform: 'translate(580px,84px)', offset: .3 }, { transform: 'translate(580px,84px)', offset: .6 }, { transform: 'translate(676px,84px)' }], 400, 5200, EASE_IO);
            var grid = S.el('', 'left:160px;top:150px;width:960px;height:470px', 'bsf-card bsf-week');
            S.fadeUp(grid, 400);
            for (var d = 0; d < 5; d++) {
              var dc = document.createElement('div'); dc.className = 'bsf-day'; dc.innerHTML = '<span>' + ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'][d] + ' ' + (13 + d) + '</span>'; grid.appendChild(dc);
            }
            [[0, 1, 'Rappel · Studio Nova', C.amber], [1, 3, 'RDV · Garage du Centre', C.violet], [2, 0, 'Tâche · Envoyer devis', C.green], [3, 2, 'RDV · Plomberie Martin', C.violet], [4, 4, 'Rappel · Atelier Bois', C.amber], [2, 3, 'Appel · Lumen', C.acc2]].forEach(function (e, i) {
              var ev = S.el(esc(e[2]), 'left:' + (172 + e[0] * 190) + 'px;top:' + (210 + e[1] * 78) + 'px;width:176px;border-left-color:' + e[3] + ';background:' + e[3] + '22', 'bsf-evt');
              S.pop(ev, 1000 + i * 180, 500);
            });
            var plan = S.el(ic('calendar', 16) + ' Planifier · jeudi 16 · 14:00', 'left:820px;top:610px', 'bsf-btn');
            S.slide(plan, S.b(1), 0, 20, 600);
          } },
        { captions: ['Les tâches gardent la liste de ce qu’il reste à faire, avec une échéance.', 'Cochez-les au fur et à mesure : celles du jour s’affichent aussi sur l’écran Aujourd’hui.'],
          build: function (S) {
            var list = S.el('<b class="bsf-cardt">' + ic('square-check', 18) + ' Tâches du jour</b>', 'left:330px;top:120px;width:620px;height:460px', 'bsf-card');
            S.fadeUp(list, 200);
            ['Envoyer le devis à Studio Nova', 'Préparer l’audit Garage du Centre', 'Relancer la facture FAC-007', 'Mettre à jour le script d’appel'].forEach(function (t, i) {
              var row = S.el('<span class="bsf-cb"><svg width="16" height="16" viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" pathLength="1" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="bsf-tt">' + esc(t) + '</span><em>' + ['10:00', '11:30', '14:00', '17:00'][i] + '</em>', 'left:360px;top:' + (186 + i * 84) + 'px;width:560px;height:62px', 'bsf-row bsf-task');
              S.slide(row, 500 + i * 140, -20, 0, 500);
              if (i < 3) {
                var at = S.b(1) + i * 700;
                S.a(row.querySelector('.bsf-cb'), [{ background: 'transparent', borderColor: 'rgba(148,163,184,.6)' }, { background: C.green, borderColor: C.green }], at, 250, 'linear');
                S.draw(row.querySelector('path'), at + 100, 350);
                S.a(row.querySelector('.bsf-tt'), [{ opacity: 1, textDecorationColor: 'transparent' }, { opacity: .5, textDecorationColor: C.text2 }], at + 200, 300, 'linear');
              }
            });
          } },
        recapScene(['Le pipeline se pilote au glisser-déposer.', 'L’agenda : jour, semaine, mois ; on planifie depuis la fiche.', 'Les tâches du jour remontent sur l’écran Aujourd’hui.'], 'Devis, factures et paiements'),
      ] },

    { f: '05-devis-factures-paiements', t: 'Devis, factures et paiements', s: 'Créer un devis, aperçu, PDF, facture, encaissements.',
      quiz: [
        ['Comment transformer un devis accepté en facture ?', ['La retaper entièrement', 'Bouton « Convertir en facture »', 'Ce n’est pas possible'], 1],
        ['Que calcule le CRM automatiquement ?', ['Totaux, remise et TVA', 'Rien', 'Seulement la date'], 0],
        ['Comment suivre les encaissements ?', ['Dans Paiements, facture par facture', 'Dans Formations', 'Par téléphone'], 0],
      ],
      scenes: [
        titleScene(5, 'Devis, factures et paiements', 'Du devis à l’encaissement, sans ressaisie.', ['Devis', 'PDF', 'Facture', 'Paiement']),
        { captions: ['Créez un devis : choisissez le client, ajoutez vos lignes ; la numérotation est automatique.', 'Totaux, remise et TVA se calculent pendant que vous tapez.'],
          build: function (S) {
            var doc = S.el('<div class="bsf-doc-h"><b>DEVIS</b><span>DEV-015 · 4 oct.</span></div><div class="bsf-doc-to">Pour : <b>Studio Nova</b> · Paris</div><div class="bsf-lines"></div>' +
              '<div class="bsf-tot"><div><span>Total HT</span><b class="ht">0 €</b></div><div><span>TVA 20 %</span><b class="tva">0 €</b></div><div class="ttc"><span>Total TTC</span><b class="ttcv">0 €</b></div></div>', 'left:370px;top:50px;width:540px;height:620px', 'bsf-doc');
            S.a(doc, [{ opacity: 0, transform: 'translateY(40px) rotate(-2deg)' }, { opacity: 1, transform: 'none' }], 200, 900);
            var lines = doc.querySelector('.bsf-lines');
            [['Audit de la gestion des appels', 450], ['Paramétrage du standard', 600], ['Formation de l’équipe (2 h)', 300]].forEach(function (l, i) {
              var r = document.createElement('div'); r.className = 'bsf-line'; r.innerHTML = '<span class="t"></span><b>' + euro(l[1]) + '</b>';
              lines.appendChild(r);
              S.fadeIn(r, S.b(0) + 900 + i * 900, 300);
              S.type(r.querySelector('.t'), S.b(0) + 900 + i * 900, l[0], 30);
            });
            S.count(doc.querySelector('.ht'), S.b(1), 1400, 0, 1350, euro);
            S.count(doc.querySelector('.tva'), S.b(1) + 200, 1400, 0, 270, euro);
            S.count(doc.querySelector('.ttcv'), S.b(1) + 400, 1600, 0, 1620, euro);
          } },
        { captions: ['L’aperçu A4 est prêt à imprimer, ou à envoyer en PDF.', 'Devis accepté ? Un clic le convertit en facture, avec ses propres numéros.'],
          build: function (S) {
            var pdf = S.el('<div class="bsf-doc-h"><b>DEVIS</b><span>DEV-015</span></div><div class="bsf-fake"><i></i><i></i><i></i><i></i></div>', 'left:260px;top:90px;width:360px;height:500px', 'bsf-doc small');
            S.fadeUp(pdf, 200);
            var tag = S.el(ic('download', 16) + ' PDF', 'left:470px;top:110px', 'bsf-tagpdf');
            S.pop(tag, 900);
            var arrow = S.el('<svg width="120" height="40" viewBox="0 0 120 40"><path d="M5 20H110M95 6l15 14-15 14" pathLength="1" fill="none" stroke="' + C.acc2 + '" stroke-width="3" stroke-dasharray="1" stroke-linecap="round" stroke-linejoin="round"/></svg>', 'left:640px;top:320px');
            S.draw(arrow.querySelector('path'), S.b(1), 800);
            var fac = S.el('<div class="bsf-doc-h"><b>FACTURE</b><span>FAC-009</span></div><div class="bsf-fake"><i></i><i></i><i></i><i></i></div>', 'left:780px;top:90px;width:360px;height:500px', 'bsf-doc small');
            S.a(fac, [{ opacity: 0, transform: 'translateX(-200px) rotateY(60deg)' }, { opacity: 1, transform: 'none' }], S.b(1) + 600, 1000);
            var stamp = S.el('ACCEPTÉ', 'left:300px;top:420px', 'bsf-stamp');
            S.a(stamp, [{ opacity: 0, transform: 'scale(2.4) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-14deg)' }], S.b(1) - 400, 450, 'cubic-bezier(.2,1.6,.4,1)');
          } },
        { captions: ['Dans Paiements, suivez chaque facture : envoyée, payée en partie, réglée.', 'Liens de paiement, virement avec QR code : vos clients règlent plus vite.'],
          build: function (S) {
            var card = S.el('<b class="bsf-cardt">' + ic('wallet', 18) + ' Paiements</b>', 'left:250px;top:90px;width:780px;height:420px', 'bsf-card');
            S.fadeUp(card, 200);
            [['FAC-009 · Studio Nova', 1620, 1, C.green, 'Payée'], ['FAC-008 · Garage du Centre', 2400, .5, C.amber, 'Partiel'], ['FAC-007 · Atelier Bois', 850, 0, C.rose, 'En attente']].forEach(function (f, i) {
              var row = S.el('<b>' + esc(f[0]) + '</b><span class="bsf-prog"><u style="background:' + f[3] + '"></u></span><em style="color:' + f[3] + '">' + f[4] + '</em><strong>' + euro(f[1]) + '</strong>', 'left:280px;top:' + (160 + i * 100) + 'px;width:720px;height:72px', 'bsf-row bsf-pay');
              S.slide(row, 600 + i * 200, -20, 0, 500);
              S.a(row.querySelector('u'), [{ width: '0%' }, { width: (f[2] * 100) + '%' }], 1200 + i * 200, 1400);
            });
            var qr = S.el('<div class="bsf-qr">' + Array.apply(null, Array(49)).map(function (_, i) { return '<i style="opacity:' + ((i * 7 + (i % 5) * 3) % 4 ? 1 : 0) + '"></i>'; }).join('') + '</div><span>Virement SEPA · QR code</span>', 'left:1060px;top:200px;width:170px', 'bsf-card bsf-qrc');
            S.pop(qr, S.b(1));
            Array.prototype.forEach.call(qr.querySelectorAll('.bsf-qr i'), function (q, i) { S.fadeIn(q, S.b(1) + 300 + (i % 7) * 40 + Math.floor(i / 7) * 40, 200); });
            var link = S.el(ic('credit-card', 16) + ' Lien de paiement envoyé', 'left:500px;top:560px', 'bsf-toast');
            S.slide(link, S.b(1) + 900, 0, 20, 500);
          } },
        recapScene(['Un devis se crée en quelques lignes ; les totaux suivent.', 'Aperçu A4, PDF, puis conversion en facture.', 'Paiements : on voit tout de suite qui a réglé.'], 'Clients, tableau de bord et rapports'),
      ] },

    { f: '06-clients-tableau-de-bord-rapports', t: 'Clients, tableau de bord et rapports', s: 'Portefeuille, MRR, objectifs, entonnoir, rapports.',
      quiz: [
        ['Que mesure le MRR ?', ['Le revenu récurrent mensuel', 'Le nombre d’appels', 'Le stock'], 0],
        ['Que montre l’entonnoir ?', ['La météo', 'Combien d’appels deviennent RDV puis clients', 'Les factures impayées'], 1],
        ['La courbe de tendance d’un graphique indique…', ['La direction que prend la série', 'Le jour le plus chaud', 'Rien de particulier'], 0],
      ],
      scenes: [
        titleScene(6, 'Clients, tableau de bord et rapports', 'Mesurer pour mieux décider.', ['Clients', 'MRR', 'Entonnoir', 'Tendances']),
        { captions: ['Le tableau de bord résume l’activité : appels, rendez-vous, clients, chiffre d’affaires.', 'Le MRR, votre revenu récurrent mensuel, grimpe à chaque client signé.'],
          build: function (S) {
            [['Appels', 139, C.acc2, 'phone'], ['RDV', 30, C.violet, 'calendar'], ['Clients', 7, C.green, 'star'], ['CA signé', 23200, C.amber, 'euro']].forEach(function (k, i) {
              var c = S.el('<span class="bsf-kic" style="color:' + k[2] + ';background:' + k[2] + '22">' + ic(k[3], 16) + '</span><span>' + k[0] + '</span><b>0</b>', 'left:' + (100 + i * 275) + 'px;top:90px;width:255px;height:120px', 'bsf-kpi big');
              S.fadeUp(c, 200 + i * 150);
              S.count(c.querySelector('b'), 500 + i * 150, 1600, 0, k[1], i === 3 ? euro : null);
            });
            var chart = S.el('<b class="bsf-cardt">MRR cumulé</b><svg width="1020" height="300" viewBox="0 0 1020 300"><defs><linearGradient id="bsfA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + C.green + '" stop-opacity=".35"/><stop offset="1" stop-color="' + C.green + '" stop-opacity="0"/></linearGradient></defs>' +
              '<path class="ar" d="M20 260 L180 240 L340 200 L500 175 L660 120 L820 80 L1000 50 L1000 290 L20 290Z" fill="url(#bsfA)"/>' +
              '<path class="ln" d="M20 260 L180 240 L340 200 L500 175 L660 120 L820 80 L1000 50" pathLength="1" fill="none" stroke="' + C.green + '" stroke-width="4" stroke-dasharray="1" stroke-linecap="round" stroke-linejoin="round"/>' +
              '<circle cx="1000" cy="50" r="7" fill="' + C.green + '"/></svg><span class="bsf-mrr">0 €</span>', 'left:100px;top:240px;width:1080px;height:390px', 'bsf-card');
            S.fadeUp(chart, S.b(1) - 300);
            S.draw(chart.querySelector('.ln'), S.b(1), 1800);
            S.a(chart.querySelector('.ar'), [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], S.b(1), 1800, EASE_IO);
            S.pop(chart.querySelector('circle'), S.b(1) + 1700, 400);
            S.count(chart.querySelector('.bsf-mrr'), S.b(1), 1800, 0, 1748, function (v) { return euro(v) + ' / mois'; });
          } },
        { captions: ['L’entonnoir montre où vos prospects s’arrêtent : appels, contacts, rendez-vous, clients.', 'Repérez l’étape qui coince, et travaillez-la en priorité.'],
          build: function (S) {
            [['Appels', 139, 1, C.acc2], ['Contacts joints', 72, .52, C.cyan], ['Rendez-vous', 30, .22, C.violet], ['Clients', 7, .05, C.green]].forEach(function (f, i) {
              var w0 = 860 * Math.max(.3, f[2]), row = S.el('<span>' + f[0] + '</span><b>0</b>', 'left:' + (210 + (860 - w0) / 2) + 'px;top:' + (130 + i * 115) + 'px;width:' + w0 + 'px;height:92px;background:linear-gradient(90deg,' + f[3] + 'cc,' + f[3] + '66)', 'bsf-funnel');
              S.a(row, [{ opacity: 0, transform: 'scaleX(.2)' }, { opacity: 1, transform: 'none' }], 300 + i * 350, 900, SPRING);
              S.count(row.querySelector('b'), 400 + i * 350, 1200, 0, f[1]);
              if (i) { var rate = S.el(Math.round(f[1] / [139, 139, 72, 30][i] * 100) + ' %', 'left:1100px;top:' + (100 + i * 115) + 'px', 'bsf-rate'); S.pop(rate, 900 + i * 350); }
            });
            var hl = S.el('', 'left:200px;top:350px;width:880px;height:112px', 'bsf-focus warn');
            S.a(hl, [{ opacity: 0, transform: 'scale(1.1)' }, { opacity: 1, transform: 'none' }], S.b(1), 600);
          } },
        { captions: ['Les rapports suivent six mois d’activité, avec une courbe de tendance sur chaque graphique.', 'La flèche dorée vous dit tout de suite si ça monte… ou si ça baisse.'],
          build: function (S) {
            var card = S.el('<b class="bsf-cardt">Activité commerciale · appels par mois</b>', 'left:140px;top:90px;width:1000px;height:520px', 'bsf-card');
            S.fadeUp(card, 200);
            [8, 17, 27, 24, 30, 33].forEach(function (v, i) {
              var bar = S.el('', 'left:' + (220 + i * 150) + 'px;top:' + (560 - v * 12) + 'px;width:60px;height:' + (v * 12) + 'px', 'bsf-bar');
              S.grow(bar, 600 + i * 120, 900);
              var lab = S.el(['mai', 'juin', 'juil', 'août', 'sept', 'oct'][i], 'left:' + (220 + i * 150) + 'px;top:570px;width:60px', 'bsf-axis');
              S.fadeIn(lab, 600 + i * 120);
            });
            var tr = S.el('<svg width="1000" height="520" viewBox="0 0 1000 520"><path d="M110 395 L860 85" pathLength="1" fill="none" stroke="' + C.amber + '" stroke-width="4" stroke-dasharray="1" stroke-linecap="round"/><path d="M860 85 L940 52" pathLength="1" fill="none" stroke="' + C.amber + '" stroke-width="3" stroke-dasharray=".04 .04" stroke-linecap="round"/></svg>', 'left:140px;top:90px');
            S.draw(tr.querySelector('path'), S.b(0) + 1600, 1200);
            S.fadeIn(tr.querySelectorAll('path')[1], S.b(0) + 2800, 400);
            var pill = S.el('<i style="background:' + C.amber + '"></i>Tendance ↗ +4,6 / mois', 'left:180px;top:150px', 'bsf-trendpill');
            S.pop(pill, S.b(1));
          } },
        recapScene(['Le tableau de bord : vos chiffres clés en direct.', 'L’entonnoir montre l’étape à améliorer.', 'Les tendances disent où va votre activité.'], 'Outils et réglages'),
      ] },

    { f: '07-outils-et-reglages', t: 'Outils et réglages', s: 'Enregistreur, script, modèles, réglages et sauvegarde.',
      quiz: [
        ['Où modifier le script affiché pendant les appels ?', ['Outils › Script d’appel', 'Rapports', 'Clients'], 0],
        ['Comment personnaliser l’apparence du CRM ?', ['Réglages : thème, couleur, ambiance, icônes', 'C’est impossible', 'En changeant d’ordinateur'], 0],
        ['Comment protéger vos données en version autonome ?', ['Réglages › Données › Exporter une sauvegarde', 'Fermer l’onglet', 'Vider le navigateur'], 0],
      ],
      scenes: [
        titleScene(7, 'Outils et réglages', 'Votre CRM, à votre image.', ['Enregistreur', 'Script', 'Modèles', 'Sauvegarde']),
        { captions: ['L’enregistreur garde vos appels et vos notes vocales, sur votre appareil.', 'Le script d’appel et les modèles d’emails se modifient en quelques secondes.'],
          build: function (S) {
            var rec = S.el('<b class="bsf-cardt">' + ic('mic', 18, C.rose) + ' Enregistreur</b><div class="bsf-wave"></div><span class="bsf-rec">● REC <em>00:00</em></span>', 'left:120px;top:120px;width:480px;height:300px', 'bsf-card');
            S.fadeUp(rec, 200);
            var wave = rec.querySelector('.bsf-wave');
            for (var i = 0; i < 36; i++) { var b = document.createElement('i'); wave.appendChild(b); }
            var bars = wave.children;
            S.tick(function (lt) {
              var on = lt > 800;
              for (var j = 0; j < bars.length; j++) bars[j].style.height = (on ? 10 + Math.abs(Math.sin(lt / 180 + j * .7) * Math.cos(lt / 420 + j * .3)) * 90 : 6) + 'px';
              var s = Math.max(0, Math.floor((lt - 800) / 1000));
              rec.querySelector('em').textContent = '00:' + ('0' + Math.min(59, s)).slice(-2);
            });
            var tpl = S.el('<b class="bsf-cardt">' + ic('pencil', 18) + ' Modèle d’email</b><div class="bsf-mail"><span>Objet :</span> <span class="o"></span></div><div class="bsf-mail body"><span class="m"></span></div>', 'left:640px;top:120px;width:520px;height:420px', 'bsf-card');
            S.fadeUp(tpl, S.b(1) - 400);
            S.type(tpl.querySelector('.o'), S.b(1), 'Votre audit gratuit, {entreprise}', 22);
            S.type(tpl.querySelector('.m'), S.b(1) + 1600, 'Bonjour {contact}, suite à notre échange, voici la proposition…', 26);
          } },
        { captions: ['Dans Réglages : informations de l’entreprise, objectifs, thème, couleur d’accent, ambiances et icônes du menu.', 'En version équipe, chacun a son compte et tout est partagé et sauvegardé.'],
          build: function (S) {
            var panel = S.el('', 'left:200px;top:90px;width:880px;height:500px', 'bsf-card bsf-settings');
            S.fadeUp(panel, 200);
            [['Thème sombre', 1], ['Images d’ambiance animées', 1], ['Icônes multicolores', 0], ['Sons de notification', 0]].forEach(function (t, i) {
              var row = S.el('<span>' + esc(t[0]) + '</span><span class="bsf-tg"><i></i></span>', 'left:240px;top:' + (130 + i * 78) + 'px;width:520px;height:58px', 'bsf-row bsf-trow');
              S.slide(row, 500 + i * 140, -20, 0, 500);
              var tg = row.querySelector('.bsf-tg'), at = 1400 + i * 400;
              if (!t[1]) {
                S.a(tg, [{ background: 'rgba(148,163,184,.3)' }, { background: C.acc }], at + 900, 250, 'linear');
                S.a(tg.querySelector('i'), [{ transform: 'translateX(0)' }, { transform: 'translateX(20px)' }], at + 900, 300, SPRING);
              } else { tg.style.background = C.acc; tg.querySelector('i').style.transform = 'translateX(20px)'; }
            });
            ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e'].forEach(function (c, i) {
              var dot = S.el('', 'left:' + (820 + (i % 3) * 64) + 'px;top:' + (150 + Math.floor(i / 3) * 64) + 'px;width:44px;height:44px;background:' + c, 'bsf-swatch');
              S.pop(dot, 1000 + i * 120);
            });
            var team = S.el(['AL', 'MC', 'JD', 'SR'].map(function (n, i) { return '<span style="background:' + [C.acc, C.violet, C.green, C.amber][i] + '">' + n + '</span>'; }).join('') + '<b>Équipe · synchronisé</b>', 'left:780px;top:430px', 'bsf-team');
            Array.prototype.forEach.call(team.querySelectorAll('span'), function (s, i) { S.pop(s, S.b(1) + i * 150, 450); });
            S.fadeIn(team.querySelector('b'), S.b(1) + 700, 400);
          } },
        { captions: ['Version autonome : exportez régulièrement une sauvegarde, et restaurez-la en un clic.', 'Version équipe : le serveur garde les cent dernières versions, restaurables à tout moment.'],
          build: function (S) {
            var disk = S.el(ic('database', 60, C.acc2), 'left:340px;top:220px;width:160px;height:160px', 'bsf-round big');
            S.pop(disk, 300);
            var file = S.el(ic('file-text', 22, C.green) + '<span>sauvegarde-crm.json</span>', 'left:420px;top:280px', 'bsf-chipfile');
            S.a(file, [{ opacity: 0, transform: 'translate(0,0) scale(.6)' }, { opacity: 1, transform: 'translate(150px,110px) scale(1)' }], 1200, 1300, EASE);
            var cloud = S.el('<div class="bsf-vers">' + [100, 99, 98, 97, 96].map(function (v) { return '<i>v' + v + '</i>'; }).join('') + '</div>', 'left:820px;top:200px;width:260px;height:220px', 'bsf-card');
            S.fadeUp(cloud, S.b(1) - 300);
            Array.prototype.forEach.call(cloud.querySelectorAll('i'), function (v, i) { S.slide(v, S.b(1) + i * 150, 0, -16, 400); });
          } },
        recapScene(['Enregistreur, script et modèles : vos outils au quotidien.', 'Réglages : un CRM à votre image.', 'Sauvegardes : exportez, ou laissez le serveur s’en charger.'], 'Les nouveautés'),
      ] },
    { f: '08-nouveautes-site-carte', t: 'Les nouveautés : site, rendez-vous et carte clients', s: 'Les RDV du site arrivent dans le CRM, la carte clients montre votre territoire.',
      quiz: [
        ['Que se passe-t-il quand un visiteur réserve sur le site ?', ['Rien, il faut recopier le rendez-vous', 'Le RDV et une tâche de rappel arrivent dans le CRM', 'Un email part sans rien créer'], 1],
        ['Jusqu’à quand peut-on réserver sur le site ?', ['45 jours maximum', 'Seulement la semaine en cours', 'Sans limite : toutes les années'], 2],
        ['À quoi sert la visite guidée de la carte clients ?', ['À survoler vos principales villes une à une', 'À imprimer la carte', 'À supprimer des fiches'], 0],
      ],
      scenes: [
        titleScene(8, 'Les nouveautés', 'Votre site remplit l’agenda tout seul, et la planète montre votre territoire.', ['Site internet', 'Rendez-vous', 'Carte clients', 'Fiches']),
        { captions: ['Sur votre site, un visiteur choisit un jour et un horaire, sans limite de date : toutes les années sont ouvertes.', 'Il remplit ses coordonnées et confirme : le rendez-vous est réservé en deux clics.'],
          build: function (S) {
            var br = S.el('<div class="bsf-brw-bar"><i></i><i></i><i></i><span>blackstart.fr/rendez-vous</span></div><div class="bsf-brw-body"></div>', 'left:150px;top:60px;width:980px;height:600px', 'bsf-brw');
            S.a(br, [{ opacity: 0, transform: 'translateY(40px) rotateX(12deg) scale(.94)' }, { opacity: 1, transform: 'none' }], 0, 1000);
            var body = br.querySelector('.bsf-brw-body');
            var h = '<div class="bsf-cal"><div class="bsf-cal-h"><b>«</b><span>Octobre</span><strong>2029</strong><b>»</b></div><div class="bsf-cal-g">';
            for (var d = 1; d <= 31; d++) h += '<i class="' + ([6, 7, 13, 14, 20, 21, 27, 28].indexOf(d) >= 0 ? 'off' : '') + (d === 4 ? ' pick' : '') + '">' + d + '</i>';
            h += '</div></div><div class="bsf-slots">' + ['9 h 00', '9 h 30', '10 h 00', '10 h 30', '11 h 00', '14 h 00', '14 h 30', '15 h 00'].map(function (t, i) { return '<i class="' + (i === 2 ? 'pick' : '') + '">' + t + '</i>'; }).join('') + '</div>' +
              '<div class="bsf-form"><span>Nom</span><em class="n"></em><span>Téléphone</span><em class="t"></em><div class="bsf-cta">Confirmer le rendez-vous</div></div>' +
              '<div class="bsf-ok">' + ic('circle-check', 54, C.green) + '<b>Rendez-vous confirmé</b><span>jeudi 4 octobre 2029 à 10 h 00</span></div>';
            body.innerHTML = h;
            var year = body.querySelector('.bsf-cal-h strong');
            S.tick(function (lt) { year.textContent = String(2026 + Math.max(0, Math.min(3, Math.floor((lt - 900) / 450)))); });
            Array.prototype.forEach.call(body.querySelectorAll('.bsf-cal-g i'), function (c, i) { S.a(c, [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'none' }], 700 + i * 22, 380, SPRING); });
            S.a(body.querySelector('.bsf-cal-g .pick'), [{ background: 'rgba(59,130,246,0)', color: C.text }, { background: C.acc, color: '#fff' }], 3300, 250, 'linear');
            Array.prototype.forEach.call(body.querySelectorAll('.bsf-slots i'), function (c, i) { S.fadeUp(c, 3500 + i * 70, 400, 10); });
            S.a(body.querySelector('.bsf-slots .pick'), [{ background: 'rgba(59,130,246,0)' }, { background: C.acc }], 4700, 250, 'linear');
            S.fadeUp(body.querySelector('.bsf-form'), S.b(1) - 200, 600);
            S.type(body.querySelector('.n'), S.b(1) + 300, 'Julie Martin · Boulangerie Martin', 26);
            S.type(body.querySelector('.t'), S.b(1) + 1700, '06 12 34 56 78', 18);
            S.a(body.querySelector('.bsf-cta'), [{ transform: 'scale(1)' }, { transform: 'scale(.94)' }, { transform: 'scale(1)' }], S.b(1) + 2900, 300);
            S.a(body.querySelector('.bsf-ok'), [{ opacity: 0, transform: 'scale(.7)' }, { opacity: 1, transform: 'none' }], S.b(1) + 3200, 700, SPRING);
            S.cursor([[700, 640, 600], [520, 130, 1900], [548, 238, 3100], [700, 318, 4500], [1010, 520, S.b(1) + 2700], [1010, 520, S.b(1) + 3600]], [1950, 2350, 2750, 3250, 4750, S.b(1) + 2900]);
          } },
        { captions: ['Aussitôt, le rendez-vous arrive dans votre agenda du CRM, avec une tâche pour rappeler le lead.', 'Le prospect est créé tout seul : canal « Site internet », priorité haute. Vous n’avez plus qu’à appeler.'],
          build: function (S) {
            var w = appWindow(S, { active: 'agenda' });
            w.title('Agenda', 'Semaine du 1er octobre 2029', 400);
            var days = ['Lun 1', 'Mar 2', 'Mer 3', 'Jeu 4', 'Ven 5'];
            days.forEach(function (d, i) {
              var col = w.add('<b>' + d + '</b>', 'left:' + (28 + i * 168) + 'px;top:96px;width:156px;height:380px', 'bsf-daycol');
              S.fadeUp(col, 600 + i * 90, 500, 16);
            });
            [[0, 140, 'Garage du Centre', C.violet], [1, 230, 'Studio Nova', C.amber], [4, 180, 'Cabinet Lefèvre', C.violet]].forEach(function (e, i) {
              var ev = w.add(esc(e[2]), 'left:' + (36 + e[0] * 168) + 'px;top:' + e[1] + 'px;width:140px;border-color:' + e[3], 'bsf-evt');
              S.fadeIn(ev, 1100 + i * 120, 400);
            });
            var nev = w.add('<em>Nouveau · Site</em><b>Boulangerie Martin</b><span>10 h 00 · Audit gratuit</span>', 'left:' + (36 + 3 * 168) + 'px;top:200px;width:140px', 'bsf-evt new');
            S.a(nev, [{ opacity: 0, transform: 'translateY(-120px) scale(.6)' }, { opacity: 1, transform: 'none' }], 1500, 900, SPRING);
            var toast = S.el(ic('calendar', 18, C.green) + '<div><b>Nouveau rendez-vous depuis le site</b><span>Boulangerie Martin · jeudi 10 h 00</span></div>', 'left:780px;top:600px;width:400px', 'bsf-toast');
            S.slide(toast, 1800, 60, 0, 700);
            S.fadeOut(toast, S.b(1) - 300, 400);
            var task = w.add(ic('square-check', 16, C.acc2) + '<div><b>Audit : appeler Julie Martin</b><span>Tâche créée automatiquement · priorité haute</span></div>', 'left:28px;top:494px;width:520px', 'bsf-taskrow');
            S.slide(task, S.b(1), -40, 0, 700);
            var badge = w.add('<i>' + ic('globe', 13) + ' Site internet</i><i class="hot">Priorité haute</i>', 'left:572px;top:504px', 'bsf-badges');
            Array.prototype.forEach.call(badge.children, function (b, i) { S.pop(b, S.b(1) + 600 + i * 200, 500); });
          } },
        { captions: ['Nouvelle rubrique : la carte clients. Une planète qui montre où sont vos clients et vos prospects, en direct.', 'En haut, les chiffres clés défilent : clients actifs, abonnements par mois et montants en jeu.'],
          build: function (S) {
            var g = S.el(globeSvg(), 'left:120px;top:100px;width:560px;height:560px', 'bsf-globe');
            S.a(g, [{ opacity: 0, transform: 'scale(.4) rotate(-30deg)' }, { opacity: 1, transform: 'none' }], 100, 1500, EASE);
            var mer = g.querySelectorAll('.mer');
            S.tick(function (lt) { Array.prototype.forEach.call(mer, function (m, i) { var a = ((lt / 40 + i * 30) % 180) - 90; m.setAttribute('rx', Math.abs(Math.cos(a * Math.PI / 180)) * 250); }); });
            Array.prototype.forEach.call(g.querySelectorAll('.pt'), function (p, i) { S.a(p, [{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1)' }], 1300 + i * 110, 500, SPRING); });
            Array.prototype.forEach.call(g.querySelectorAll('.arc'), function (p, i) { S.draw(p, 1800 + i * 160, 900); });
            [['Clients actifs', 7, '', C.green], ['Abonnements / mois', 1748, ' €', C.green], ['En négociation', 5200, ' €', C.amber]].forEach(function (k, i) {
              var c = S.el('<span>' + esc(k[0]) + '</span><b style="color:' + k[3] + '">0</b>', 'left:760px;top:' + (150 + i * 130) + 'px;width:380px;height:108px', 'bsf-card bsf-gkpi');
              S.slide(c, S.b(1) - 300 + i * 180, 60, 0, 700);
              S.count(c.querySelector('b'), S.b(1) + i * 180, 1400, 0, k[1], function (v) { return Math.round(v).toLocaleString('fr-FR') + k[2]; });
            });
          } },
        { captions: ['Cliquez sur une ville : ses fiches s’affichent, avec le statut, le montant et la prochaine relance.', 'Lancez la visite guidée : la caméra survole vos villes une à une. Un clic ouvre la fiche, un autre lance l’appel.'],
          build: function (S) {
            var g = S.el(globeSvg(true), 'left:60px;top:80px;width:600px;height:600px', 'bsf-globe');
            S.a(g, [{ transform: 'scale(1)' }, { transform: 'scale(1.35) translate(40px,20px)' }], 600, 2400, EASE_IO);
            var spot = S.el('<span>Ville sélectionnée</span><b>Lyon</b><p>3 clients · 12 prospects · <strong>829 €/mois</strong></p>', 'left:90px;top:470px;width:330px', 'bsf-spot');
            S.slide(spot, 2200, 0, 30, 700);
            [['Cabinet Dentaire Lumière', 'Client actif', '390 €/mois', C.green], ['Agence Immo du Centre', 'Client actif', '290 €/mois', C.green], ['Square Habitat', 'Audit réalisé', '2 oct. · 11:00', C.cyan], ['Boulangerie Martin', 'RDV pris', 'jeu. · 10:00', C.violet]].forEach(function (p, i) {
              var c = S.el('<span class="av" style="background:' + p[3] + '">' + p[0].split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('') + '</span><div><b>' + esc(p[0]) + '</b><em style="color:' + p[3] + '">' + esc(p[1]) + '</em></div><strong>' + esc(p[2]) + '</strong>', 'left:720px;top:' + (110 + i * 104) + 'px;width:470px;border-left-color:' + p[3], 'bsf-person');
              S.slide(c, 2600 + i * 160, 50, 0, 600);
            });
            var tourBtn = S.el(ic('play', 15) + ' Visite guidée', 'left:90px;top:96px', 'bsf-tourbtn');
            S.pop(tourBtn, S.b(1) - 400);
            S.a(tourBtn, [{ background: 'rgba(59,130,246,.15)' }, { background: C.acc }], S.b(1) + 500, 300, 'linear');
            Array.prototype.forEach.call(g.querySelectorAll('.pt'), function (p, i) { S.a(p, [{ r: 4 }, { r: 11 }, { r: 4 }], S.b(1) + 800 + i * 500, 600, EASE_IO); });
            S.cursor([[600, 640, 300], [272, 288, 1700], [272, 288, 2300], [160, 112, S.b(1) + 200], [1150, 160, S.b(1) + 2600]], [1900, S.b(1) + 500, S.b(1) + 2900]);
          } },
        recapScene(['Les RDV du site arrivent dans le CRM, avec un rappel.', 'Le calendrier du site couvre toutes les années.', 'La carte clients montre votre territoire en direct.'], null),
      ] },
  ];
  // ================================================================== la formation (11 modules, de A à Z)
  // Chaque module : générique en motion design, tutos sur la vraie interface, récapitulatif, quiz.
  // Sans les captures (version autonome), le module reprend les anciennes scènes animées (ANCIENS).
  function module(o) {
    var tutos = o.tutos.filter(Boolean);
    var ex = o.exemple ? [exempleScene(o.exemple)] : [];
    var list = tutos.length ? [titleScene(o.n, o.t, o.accroche, o.chips)].concat(ex, o.avant || [], tutos, o.apres || [], [recapScene(o.recap, o.suivant)]) : o.secours.slice(0, 1).concat(ex, o.secours.slice(1));
    tutos.forEach(function (s) { s.module = o.n; });
    return { f: o.f, t: o.t, s: o.s, quiz: o.quiz, scenes: list };
  }
  var MODULES = [
    module({ n: 1, f: '01-bien-demarrer', t: 'Bien démarrer dans le CRM', s: 'Connexion, menu, recherche Ctrl K, bouton Créer, profil, anglais et mobile.',
      accroche: 'Trois minutes pour vous sentir chez vous dans le CRM.', chips: ['Connexion', 'Menu', 'Ctrl K', 'Créer', 'Profil', 'Mobile'],
      exemple: { titre: 'Le premier matin de Lucas', qui: ['LM', 'Lucas Moreau', 'Commercial terrain', 'vert'], intro: 'Exemple concret : c’est le premier jour de Lucas, notre nouveau commercial. Voyons comment il prend ses marques.',
        etapes: [['8 h 55', 'lock', 'Il se connecte avec son e-mail', 'Lucas se connecte avec son e-mail et le mot de passe reçu par son responsable.'],
          ['9 h 00', 'search', 'Ctrl K, « Plomberie »', 'Il tape Contrôle K, puis « Plomberie » : la fiche de Plomberie Martin s’ouvre en une seconde.'],
          ['9 h 02', 'plus', 'Créer › Nouveau prospect', 'Un artisan l’appelle ? Le bouton Créer lui ouvre une nouvelle fiche, sans quitter sa page.']],
        fin: ['check', 'Opérationnel en 5 minutes', 'Résultat : Lucas est opérationnel en cinq minutes, sans formation en salle !'] },
      quiz: [
        ['Quel raccourci ouvre la recherche et les commandes ?', ['Ctrl + K', 'Ctrl + P', 'Alt + F4'], 0],
        ['Où passer le CRM en anglais ?', ['Dans Paiements', 'Dans le menu de votre profil, en haut à droite', 'Ce n’est pas possible'], 1],
        ['Le CRM fonctionne-t-il sur téléphone ?', ['Non', 'Oui, avec une barre de navigation en bas', 'Seulement en lecture'], 1],
      ],
      tutos: [
        tuto({ t: 'Se connecter', ecran: 'connexion', page: 'connexion', captions: ['Chaque membre de l’équipe a son propre compte : votre e-mail et votre mot de passe suffisent.', 'Une fois connecté, vous retrouvez les données de toute l’équipe, à jour en temps réel.'],
          steps: [{ b: 0, d: 600, zoom: 'formulaire', spot: 'formulaire' }, { b: 0, d: 1400, curseur: 'email', clic: true }, { b: 1, zoom: null, spot: false }] }),
        tuto({ t: 'Se repérer dans le menu', ecran: 'accueil', page: 'today', captions: ['À gauche, le menu est rangé par familles : prospection, ventes, marketing, automatisation, équipe et analyse.', 'Les pastilles bleues comptent ce qui vous attend. Par exemple, sept appels à passer aujourd’hui.', 'Besoin de place ? « Replier le menu » ne garde que les icônes deux tons.'],
          steps: [{ b: 0, d: 300, zoom: 'menu', spot: 'menu', lent: true }, { b: 1, curseur: 'prospection' }, { b: 1, d: 400, bulle: ['prospection', 'Pastille = à traiter aujourd’hui'] }, { b: 2, curseur: 'replier', spot: 'replier' }, { b: 2, d: 2600, zoom: null, spot: false }] }),
        tuto({ t: 'Tout trouver avec Ctrl K', ecran: 'accueil', page: 'today', captions: ['La barre de recherche, ou Contrôle K, trouve tout : un prospect, un devis, une action.', 'Exemple : tapez « ost » et l’Ostéo Santé Confluence apparaît. Entrée pour ouvrir sa fiche.'],
          steps: [{ b: 0, d: 300, zoom: 'recherche', s: 2, spot: 'recherche', curseur: 'recherche', clic: true }, { b: 1, ecran: 'recherche', zoom: 'palette', spot: 'palette' }, { b: 1, d: 1600, spot: 'resultat' }] }),
        tuto({ t: 'Créer en un clic', ecran: 'accueil', page: 'today', captions: ['Le bouton Créer, en haut, crée un prospect, un devis, une facture, une tâche ou un rendez-vous, depuis n’importe quelle page.', 'Astuce : la touche N ouvre un nouveau prospect, la touche T une nouvelle tâche.'],
          steps: [{ b: 0, d: 200, zoom: 'creer', s: 2.2, spot: 'creer', curseur: 'creer', clic: true, centre: true }, { b: 0, d: 1400, ecran: 'creer', zoom: 'menu', spot: 'menu' }, { b: 1, zoom: null, spot: false }] }),
        tuto({ t: 'Profil, déconnexion et anglais', nouveau: true, ecran: 'accueil', page: 'today', captions: ['Cliquez sur votre nom en haut à droite : mon compte, l’organigramme, les réglages et la déconnexion.', 'Un collègue anglophone ? « Switch to English » passe tout le CRM en anglais, pour lui seul.'],
          steps: [{ b: 0, d: 200, zoom: 'moi', s: 2 }, { b: 0, d: 700, curseur: 'moi', clic: true, centre: true }, { b: 0, d: 1300, ecran: 'moi', zoom: 'menu', spot: 'menu' }, { b: 1, d: 300, bulle: ['menu', 'Français ou anglais'] }] }),
        tuto({ t: 'Le CRM sur téléphone', ecran: 'mobile', page: 'today', captions: ['Sur téléphone, le CRM s’adapte : les rubriques principales passent dans une barre en bas de l’écran.', 'Entre deux rendez-vous, Lucas lance sa session d’appels depuis le parking.'],
          steps: [{ b: 0, d: 600, spot: 'barre', bulle: ['barre', 'Navigation en bas'] }, { b: 1, spot: 'session', curseur: 'session', clic: true, centre: true }] }),
      ],
      recap: ['Le menu par familles, la recherche Ctrl K en haut.', 'Le bouton Créer, partout, pour aller vite.', 'Votre nom en haut à droite : compte, anglais, déconnexion.'], suivant: 'Votre journée et la vue CEO',
      secours: ANCIENS[0].scenes }),

    module({ n: 2, f: '02-ma-journee', t: 'Votre journée et la vue CEO', s: 'Vue d’ensemble CEO, assistant IA, file d’appels, session, notes et résultat.',
      accroche: 'Chaque matin, le CRM vous dit quoi faire, et au dirigeant comment va l’équipe.', chips: ['Vue CEO', 'Assistant', 'File d’appels', 'Session', 'Résultat'],
      exemple: { titre: 'Le lundi de Sarah', qui: ['SB', 'Sarah Benali', 'Responsable commerciale', 'bleu'], intro: 'Exemple concret : lundi matin, Sarah ouvre l’écran Aujourd’hui.',
        etapes: [['9 h 00', 'phone', 'Relance en retard : Plomberie Martin', 'En tête de file : Plomberie Martin, une relance en retard de trois jours.'],
          ['9 h 04', 'mic', 'Script + notes pendant l’appel', 'Elle appelle, suit le script, et note : « intéressé par un audit, rappeler jeudi ».'],
          ['9 h 07', 'calendar', 'Résultat : RDV jeudi 14 h', 'Résultat « rendez-vous pris » : le rendez-vous de jeudi 14 heures part tout seul dans le calendrier.']],
        fin: ['zap', '3 appels de plus avant 10 h', 'Sans chercher un seul numéro, elle enchaîne trois appels de plus avant dix heures !'] },
      quiz: [
        ['Que montre la vue d’ensemble CEO ?', ['L’équipe active, les simulations IA, le taux de réussite et l’activité récente', 'Seulement la météo', 'Les mots de passe'], 0],
        ['Dans quel ordre la file d’appels classe-t-elle les prospects ?', ['Par ordre alphabétique', 'Les relances en retard d’abord', 'Au hasard'], 1],
        ['Après un appel « rendez-vous pris », que fait le CRM ?', ['Rien', 'Il supprime la fiche', 'Il programme le rendez-vous dans le calendrier'], 2],
      ],
      tutos: [
        tuto({ t: 'La vue d’ensemble CEO', nouveau: true, ecran: 'ceo', page: 'today', captions: ['Pour le dirigeant, Aujourd’hui commence par la vue d’ensemble CEO : un bonjour, et la santé de l’entreprise.', 'Quatre chiffres clés : l’équipe active, les simulations IA réalisées, le taux de réussite et la consommation IA.', 'Plus bas, la performance des équipes, la répartition des formations et l’activité récente de chacun.'],
          steps: [{ b: 0, d: 300, zoom: 'hero', spot: 'hero' }, { b: 1, zoom: 'kpi', spot: 'kpi' }, { b: 2, zoom: null, spot: 'perf' }, { b: 2, d: 2200, spot: 'activite' }] }),
        tuto({ t: 'Poser une question à l’assistant', nouveau: true, ecran: 'ceo', page: 'today', captions: ['À droite, l’assistant IA résume les points à surveiller cette semaine.', 'Posez-lui une question, par exemple : « Quels prospects relancer en priorité ? ». Il répond avec vos vraies données.'],
          steps: [{ b: 0, d: 300, zoom: 'assistant', spot: 'assistant' }, { b: 1, curseur: 'assistant', clic: true }, { b: 1, d: 300, bulle: ['assistant', 'Vos données, en clair'] }] }),
        tuto({ t: 'L’écran Aujourd’hui du commercial', nouveau: true, ecran: 'aujourdhui', page: 'today', captions: ['Pour un commercial, Aujourd’hui commence par ses chiffres du jour : nouveaux prospects, messages envoyés, réponses reçues et rendez-vous.', 'Mes prospects : filtrez « À contacter », « En cours » ou « Clients ». Le score IA dit qui appeler en premier.', 'À droite, son assistant IA personnel, avec ses compétences : planifier sa journée, préparer un appel, répondre à une objection.'],
          steps: [{ b: 0, d: 300, zoom: 'kpi', spot: 'kpi' }, { b: 1, zoom: 'prospects', spot: 'prospects' }, { b: 1, d: 1800, spot: 'onglets', curseur: 'onglets', clic: true }, { b: 1, d: 3600, spot: 'premier' }, { b: 2, zoom: 'assistant', spot: 'assistant' }] }),
        tuto({ t: 'Lancer une session d’appels', ecran: 'aujourdhui', page: 'today', captions: ['Le bouton Appels lance la session : les appels du jour s’enchaînent, sans chercher le numéro suivant.', 'Pour chaque appel : le bouton pour composer, le script pas à pas, la fiche et un bloc-notes.', 'Suivez les six étapes du script, de l’accroche à la prise de rendez-vous.'],
          steps: [{ b: 0, d: 200, zoom: 'session', s: 2.2, spot: 'session' }, { b: 0, d: 900, curseur: 'session', clic: true, centre: true }, { b: 1, ecran: 'appel', zoom: null, spot: false }, { b: 1, d: 900, spot: 'composer', curseur: 'composer' }, { b: 2, zoom: 'script', spot: 'script' }] }),
        tuto({ t: 'Noter et clore un appel', ecran: 'appel', page: 'today', captions: ['Notez ce qui se dit pendant l’appel. Exemple : « Intéressée par un audit, rappeler jeudi ».', 'Terminer l’appel ouvre le compte-rendu : choisissez le résultat, la relance se programme toute seule.'],
          steps: [{ b: 0, d: 200, zoom: 'notes', spot: 'notes' }, { b: 0, d: 700, curseur: 'notes', clic: true }, { b: 1, curseur: 'terminer', clic: true, spot: 'terminer' }, { b: 1, d: 1300, ecran: 'resultat', zoom: 'fenetre', spot: 'fenetre' }] }),
      ],
      recap: ['La vue CEO : la santé de l’équipe en un coup d’œil.', 'Le commercial : ses chiffres du jour, ses prospects classés par score.', 'Un résultat par appel, la relance part dans le calendrier.'], suivant: 'Les simulations IA',
      secours: ANCIENS[1].scenes }),

    module({ n: 3, f: '03-simulations-ia', t: 'S’entraîner avec les simulations IA', s: 'Scénarios, fiche du prospect, appel simulé à la voix, note et recommandations.',
      accroche: 'Rater devant une IA, pour réussir devant le client.', chips: ['Scénarios', 'Objections', 'Appel simulé', 'Note'],
      exemple: { titre: 'Inès apprivoise l’objection prix', qui: ['IG', 'Inès Garnier', 'Chargée de clientèle', 'violet'], intro: 'Exemple concret : Inès a perdu deux ventes sur « c’est trop cher ». Elle s’entraîne.',
        etapes: [['Mardi', 'target', 'Scénario « Objection prix : version difficile »', 'Elle choisit le scénario « Objection prix, version difficile ».'],
          ['5 min', 'mic', 'Appel à la voix avec un prospect joué par l’IA', 'Elle parle à voix haute : le prospect, joué par l’IA, la pousse dans ses retranchements.'],
          ['Après', 'chart-line', 'Note 58, puis 81 sur 100', 'Première note : cinquante-huit sur cent. Elle suit les conseils, recommence : quatre-vingt-un !']],
        fin: ['award', 'Vente signée vendredi', 'Vendredi, face à un vrai client, elle a la bonne réponse. Vente signée !'] },
      quiz: [
        ['À quoi servent les simulations IA ?', ['À s’entraîner face à un prospect joué par l’IA, à la voix', 'À envoyer des factures', 'À changer de thème'], 0],
        ['Que trouve-t-on dans la fiche d’un scénario ?', ['L’objectif, le contexte et les objections à prévoir', 'Un code promo', 'Rien'], 0],
        ['Après l’appel simulé, que donne le CRM ?', ['Une note sur 100, une analyse et des recommandations', 'Une amende', 'Un e-mail au client'], 0],
      ],
      tutos: [
        tuto({ t: 'Choisir un scénario', nouveau: true, ecran: 'simulations', page: 'entrainement', captions: ['Simulations IA : à gauche, les scénarios. Prospection, découverte, objections, closing, relance, et même vos propres prospects.', 'Le badge « Recommandé » vous dit par quoi commencer.', 'Au centre, la fiche : l’objectif à atteindre, le contexte, et les objections à prévoir.'],
          steps: [{ b: 0, d: 300, zoom: 'scenarios', spot: 'scenarios' }, { b: 0, d: 2600, spot: 'filtres', curseur: 'filtres' }, { b: 1, zoom: 'recommande', s: 2, spot: 'recommande', curseur: 'recommande', clic: true }, { b: 2, zoom: 'fiche', spot: 'fiche' }, { b: 2, d: 2600, spot: 'objections' }] }),
        tuto({ t: 'Le profil du prospect', nouveau: true, ecran: 'simulations', page: 'entrainement', captions: ['À droite, qui vous allez appeler. Exemple : Thomas Bernard, directeur informatique, analytique, prudent et sensible au prix.', 'Son ouverture à l’appel démarre à vingt-cinq pour cent : à vous de la faire monter.'],
          steps: [{ b: 0, d: 300, zoom: 'profil', spot: 'profil' }, { b: 1, d: 300, bulle: ['profil', 'À convaincre !'] }] }),
        tuto({ t: 'Passer l’appel simulé', nouveau: true, ecran: 'simulations', page: 'entrainement', captions: ['« Démarrer l’appel » : parlez au micro, l’IA répond à la voix, comme un vrai prospect.', 'Raccrochez quand vous avez obtenu le rendez-vous… ou quand il vous a raccroché au nez !'],
          steps: [{ b: 0, d: 300, zoom: 'fiche', spot: false }, { b: 0, d: 1200, ecran: 'simulation-appel', zoom: null, spot: 'appel' }, { b: 1, zoom: 'raccrocher', s: 2, spot: 'raccrocher', curseur: 'raccrocher' }] }),
        tuto({ t: 'Lire sa note et progresser', nouveau: true, ecran: 'simulations', page: 'entrainement', captions: ['Après l’appel, l’analyse de performance donne une note sur cent et six compétences.', 'Les recommandations proposent la phrase à essayer et l’exercice ciblé pour progresser.'],
          steps: [{ b: 0, d: 300, zoom: 'analyse', spot: 'analyse' }, { b: 1, zoom: null, spot: 'analyse' }] }),
      ],
      recap: ['Un scénario recommandé, avec objectif et objections.', 'Un appel à la voix face à un prospect joué par l’IA.', 'Une note sur 100 et des conseils pour progresser.'], suivant: 'Prospects et fiches',
      secours: ANCIENS[1].scenes }),

    module({ n: 4, f: '04-prospects', t: 'Prospects et fiches', s: 'Statuts, recherche, filtres, fiche prospect, création, import et export.',
      accroche: 'Un fichier clair, filtré, toujours à jour.', chips: ['Statuts', 'Filtres', 'Fiche', 'Import'],
      exemple: { titre: 'Alex importe son vieux fichier Excel', qui: ['AM', 'Alex Martin', 'Fondateur & gérant', 'orange'], intro: 'Exemple concret : Alex a deux cents contacts dans un vieux fichier Excel.',
        etapes: [['Étape 1', 'upload', 'Importer › contacts.xlsx', 'Il clique sur Importer et choisit son fichier : le CRM reconnaît les colonnes tout seul.'],
          ['Étape 2', 'users', '12 doublons repérés', 'Douze doublons sont repérés avant l’import : rien n’est en double.'],
          ['Étape 3', 'filter', 'Pastille « À appeler » : 188', 'Un clic sur la pastille « À appeler », et la liste de la semaine est prête.']],
        fin: ['check', '188 prospects prêts', 'Résultat : cent quatre-vingt-huit prospects propres, prêts à être appelés.'] },
      quiz: [
        ['Comment voir seulement les prospects « RDV pris » ?', ['Avec la pastille de statut en haut de la liste', 'Il faut tout exporter', 'Dans Réglages'], 0],
        ['Que contient la fiche d’un prospect ?', ['Seulement son nom', 'Coordonnées, historique complet, tâches et documents', 'Uniquement les devis'], 1],
        ['Comment ajouter 200 contacts d’un coup ?', ['Un par un', 'Avec « Importer » (CSV ou Excel)', 'Ce n’est pas possible'], 1],
      ],
      tutos: [
        tuto({ t: 'Filtrer ses prospects', ecran: 'prospects', page: 'prospects', captions: ['La liste des prospects : en haut, une pastille par statut, avec le nombre de fiches.', 'Cherchez par entreprise, contact, ville ou téléphone. Exemple : « Lyon » pour vos prospects lyonnais.', 'Passez de la vue tableau à la vue liste selon vos préférences.'],
          steps: [{ b: 0, d: 300, zoom: 'statuts', spot: 'statuts' }, { b: 0, d: 1500, bulle: ['statuts', 'Un clic = un filtre'] }, { b: 1, zoom: 'recherche', spot: 'recherche', curseur: 'recherche', clic: true }, { b: 1, d: 1800, curseur: 'filtres', spot: 'filtres' }, { b: 2, zoom: null, spot: 'vue', curseur: 'vue' }] }),
        tuto({ t: 'Ouvrir une fiche prospect', ecran: 'prospects', page: 'prospects', captions: ['Cliquez sur une ligne : la fiche du prospect s’ouvre.', 'Tout y est : coordonnées, appel, e-mail, SMS ou WhatsApp en un clic, et l’historique complet de chaque action.'],
          steps: [{ b: 0, d: 200, zoom: 'premier', spot: 'premier' }, { b: 0, d: 700, curseur: 'premier', clic: true }, { b: 1, ecran: 'fiche', zoom: null, spot: 'fiche' }] }),
        tuto({ t: 'Créer et importer des prospects', ecran: 'prospects', page: 'prospects', captions: ['Le bouton Nouveau ouvre la fiche de création : entreprise, contact, téléphone, secteur.', 'Importer charge un fichier CSV ou Excel ; les doublons sont détectés. Exporter télécharge votre liste.'],
          steps: [{ b: 0, d: 200, zoom: 'nouveau', s: 2, curseur: 'nouveau', clic: true, centre: true }, { b: 0, d: 1300, ecran: 'nouveau-prospect', zoom: 'fenetre', spot: 'fenetre' }, { b: 1, ecran: 'import', zoom: 'fenetre', spot: 'fenetre' }] }),
      ],
      recap: ['Une pastille par statut pour filtrer en un clic.', 'La fiche garde tout l’historique, action par action.', 'Import CSV ou Excel, doublons détectés.'], suivant: 'Trouver de nouveaux clients',
      secours: ANCIENS[2].scenes }),

    module({ n: 5, f: '05-nouveaux-clients', t: 'Trouver de nouveaux clients', s: 'Générateur de leads Sirene, LinkedIn, suivi de niche et analyse du marché.',
      accroche: 'De vraies entreprises, jamais deux fois les mêmes, là où ça rapporte.', chips: ['Leads', 'LinkedIn', 'Niche', 'Marché'],
      exemple: { titre: 'Sarah cherche des plombiers à Lyon', qui: ['SB', 'Sarah Benali', 'Responsable commerciale', 'bleu'], intro: 'Exemple concret : Sarah veut vingt nouveaux plombiers lyonnais à appeler cette semaine.',
        etapes: [['Lundi', 'chart-line', 'Marché : 1 240 plombiers dans le Rhône', 'Dans Marché, elle découvre mille deux cent quarante entreprises de plomberie dans le Rhône.'],
          ['Lundi', 'sparkles', 'Nouveaux leads › Plomberie › Lyon', 'Dans Nouveaux leads : Artisans, Plomberie, Lyon. Douze vraies entreprises, avec le dirigeant.'],
          ['Lundi', 'plus', 'Un clic : ajoutés à appeler aujourd’hui', 'Un clic par entreprise : elles arrivent dans ses prospects, à appeler aujourd’hui.']],
        fin: ['zap', '12 leads frais, zéro doublon', 'Et la semaine prochaine ? Douze autres, jamais les mêmes.'] },
      quiz: [
        ['D’où viennent les leads proposés ?', ['Inventés au hasard', 'Du registre officiel des entreprises (Sirene), entreprises actives', 'De vos anciens clients'], 1],
        ['Que propose l’onglet LinkedIn de Nouveaux leads ?', ['Importer vos contacts LinkedIn et les classer par intérêt', 'Publier des vidéos', 'Rien'], 0],
        ['À quoi sert la page Marché ?', ['À mesurer le nombre d’entreprises par métier, les nouvelles entreprises et la concurrence', 'À acheter des fichiers', 'À changer le thème'], 0],
      ],
      tutos: [
        tuto({ t: 'Générer des leads', ecran: 'leads', page: 'leads', captions: ['Nouveaux leads : choisissez un secteur, un métier et une zone, ville, code postal ou département.', 'Le générateur trouve de vraies entreprises actives, avec le dirigeant, l’adresse, et quand il les trouve, le téléphone, le site et l’e-mail.', 'Un clic ajoute le lead à vos prospects, à appeler aujourd’hui.'],
          steps: [{ b: 0, d: 300, zoom: 'formulaire', spot: 'formulaire' }, { b: 0, d: 1200, curseur: 'generer', clic: true, centre: true }, { b: 1, zoom: 'cartes', spot: 'cartes', lent: true }, { b: 2, zoom: 'carte', spot: 'carte' }, { b: 2, d: 600, curseur: 'ajouter', clic: true }] }),
        tuto({ t: 'Vos contacts LinkedIn', nouveau: true, ecran: 'linkedin', page: 'leads', captions: ['Onglet LinkedIn : collez un profil, utilisez le bouton à glisser dans vos favoris, ou importez tout votre réseau avec le fichier Connections.', 'Le CRM note chaque contact selon votre client idéal, pour appeler d’abord les plus prometteurs.'],
          steps: [{ b: 0, d: 300, zoom: 'onglets', s: 2, spot: 'onglets' }, { b: 0, d: 1600, zoom: null, spot: false }] }),
        tuto({ t: 'Mesurer son marché', nouveau: true, ecran: 'marche', page: 'marche', captions: ['Marché : tapez une zone, par exemple Lyon, puis « Analyser le marché ».', 'Le CRM compte les entreprises de chaque métier, les compare à vos résultats, et vous dit où prospecter en premier.', 'Deux autres onglets : les nouvelles entreprises du mois, et la concurrence.'],
          steps: [{ b: 0, d: 300, zoom: 'zone', spot: 'zone' }, { b: 0, d: 1500, curseur: 'analyser', clic: true }, { b: 1, zoom: null, spot: 'zone' }, { b: 2, zoom: 'onglets', s: 2, spot: 'onglets', curseur: 'onglets' }] }),
        tuto({ t: 'Suivre sa niche', ecran: 'niche', page: 'reports', captions: ['Le suivi de ma niche compare vos secteurs : prospects, contacts, rendez-vous, clients et conversion.', 'Définissez votre client idéal : le générateur vous propose ensuite les leads qui lui ressemblent.'],
          steps: [{ b: 0, d: 300, zoom: 'niche', spot: 'niche', lent: true }, { b: 1, curseur: 'ideal', clic: true, spot: 'ideal' }] }),
      ],
      recap: ['Sirene : des leads réels et nouveaux, en un clic.', 'LinkedIn : votre réseau, classé par intérêt.', 'Marché et niche : prospectez là où ça rapporte.'], suivant: 'Calendrier, pipeline et tâches',
      secours: ANCIENS[2].scenes }),

    module({ n: 6, f: '06-calendrier-pipeline', t: 'Calendrier, pipeline et tâches', s: 'Le nouveau calendrier jour, semaine, mois, le pipeline au glisser-déposer et les tâches.',
      accroche: 'Voir où en est chaque affaire, et ne rater aucun rendez-vous.', chips: ['Calendrier', 'Pipeline', 'Tâches'],
      exemple: { titre: 'Le Cabinet Lumière, de l’appel à la signature', qui: ['SB', 'Sarah Benali', 'Responsable commerciale', 'rose'], intro: 'Exemple concret : suivons le Cabinet Dentaire Lumière dans le pipeline de Sarah.',
        etapes: [['Lundi', 'phone', 'Colonne « Rendez-vous »', 'Lundi, rendez-vous obtenu : Sarah glisse la carte dans la colonne Rendez-vous.'],
          ['Mercredi', 'calendar', 'Audit mercredi 11 h au calendrier', 'Mercredi onze heures, l’audit apparaît dans son calendrier, avec un rappel.'],
          ['Jeudi', 'file-text', 'Tâche : envoyer la proposition', 'Jeudi, une tâche lui rappelle d’envoyer la proposition. Elle la coche.']],
        fin: ['award', 'Client signé ! 🎉', 'Vendredi : glissée dans « Client signé ». Bravo Sarah !'] },
      quiz: [
        ['Quelles vues propose le calendrier ?', ['Jour, semaine et mois', 'Seulement l’année', 'Aucune'], 0],
        ['Comment changer le statut d’une affaire dans le pipeline ?', ['En la glissant dans une autre colonne', 'En la supprimant', 'Par e-mail'], 0],
        ['Où voir toutes les tâches en retard ?', ['Dans Tâches, en haut', 'Dans Clients', 'Dans Carte clients'], 0],
      ],
      tutos: [
        tuto({ t: 'Le calendrier', nouveau: true, ecran: 'calendrier', page: 'agenda', captions: ['Le calendrier réunit vos rendez-vous, vos relances et vos tâches. Chaque couleur a son sens : appel, rendez-vous, audit, tâche.', 'Passez du jour à la semaine ou au mois, et changez de fuseau horaire pour vos clients à l’étranger.', 'À droite : le mini calendrier, les prochains rendez-vous et vos statistiques de la semaine.'],
          steps: [{ b: 0, d: 300, zoom: 'semaine', spot: 'semaine', lent: true }, { b: 1, zoom: 'vues', s: 2, spot: 'vues', curseur: 'vues', clic: true }, { b: 1, d: 2600, ecran: 'calendrier-mois', zoom: null, spot: 'mois' }, { b: 2, ecran: 'calendrier', zoom: 'prochains', spot: 'prochains' }, { b: 2, d: 2600, spot: 'stats' }] }),
        tuto({ t: 'Le pipeline', ecran: 'pipeline', page: 'pipeline', captions: ['Le pipeline montre chaque affaire, colonne par colonne : à appeler, injoignable, rendez-vous, audit, proposition.', 'Glissez une carte d’une colonne à l’autre : le statut et l’historique se mettent à jour.'],
          steps: [{ b: 0, d: 400, zoom: 'colonnes', spot: 'colonnes', lent: true }, { b: 1, zoom: 'carte', s: 1.9, spot: 'carte', curseur: 'carte' }, { b: 1, d: 1300, curseur: 'colonne2', clic: true }] }),
        tuto({ t: 'Les tâches', ecran: 'taches', page: 'tasks', captions: ['Tâches : en retard, aujourd’hui, à venir. Cochez-les au fur et à mesure.', 'Celles du jour s’affichent aussi sur l’écran Aujourd’hui et dans le calendrier.'],
          steps: [{ b: 0, d: 300, zoom: 'retard', spot: 'retard' }, { b: 0, d: 2000, zoom: 'jour', spot: 'jour' }, { b: 1, zoom: null, spot: 'nouvelle', curseur: 'nouvelle' }] }),
      ],
      recap: ['Le calendrier : jour, semaine, mois, et fuseau horaire.', 'Le pipeline se pilote au glisser-déposer.', 'Les tâches du jour vous suivent partout.'], suivant: 'Téléphone et mail',
      secours: ANCIENS[3].scenes }),

    module({ n: 7, f: '07-telephone-mail', t: 'Téléphone et mail', s: 'Ringover dans le CRM, appel en un clic, vos boîtes mail, envoyer depuis le CRM.',
      accroche: 'Appeler et écrire sans jamais quitter le CRM.', chips: ['Ringover', 'Click-to-call', 'Gmail', 'Mail pro'],
      exemple: { titre: 'Lucas rappelle Kiné Performance', qui: ['LM', 'Lucas Moreau', 'Commercial terrain', 'vert'], intro: 'Exemple concret : Lucas doit rappeler Kiné Performance, puis envoyer un devis.',
        etapes: [['14 h 00', 'phone', 'Clic sur le numéro : Ringover appelle', 'Il clique sur le numéro dans la fiche : Ringover compose, sans toucher son téléphone.'],
          ['14 h 06', 'clock', 'Appel de 6 min noté sur la fiche', 'L’appel de six minutes est noté tout seul sur la fiche du prospect.'],
          ['14 h 08', 'mail', 'Mail + devis PDF depuis son adresse pro', 'Dans Mail, il envoie le devis en PDF, depuis sa propre adresse professionnelle.']],
        fin: ['check', 'Tout est dans l’historique', 'Appel, mail et devis : tout est dans l’historique. Rien à recopier !'] },
      quiz: [
        ['Que se passe-t-il quand on clique sur un numéro avec Ringover activé ?', ['L’appel part depuis votre ligne Ringover', 'Rien', 'Un SMS part'], 0],
        ['Depuis quelle adresse partent les mails du CRM ?', ['Une adresse inconnue', 'Votre propre boîte : Gmail, Hostinger, OVH…', 'Celle de Blackstart'], 1],
        ['Où l’appel est-il noté ?', ['Nulle part', 'Sur la fiche du prospect, avec sa durée', 'Dans les réglages'], 1],
      ],
      tutos: [
        tuto({ t: 'Ringover dans le CRM', nouveau: true, ecran: 'telephone', page: 'telephone', captions: ['Téléphone : Ringover s’ouvre dans une fenêtre du CRM, et reste ouvert quand vous changez de page.', 'Un clic sur le numéro d’un prospect lance l’appel. Chaque appel, sortant, entrant ou manqué, est noté sur sa fiche.', 'Activez Ringover une seule fois sur chaque ordinateur ou téléphone.'],
          steps: [{ b: 0, d: 300, zoom: 'ringover', spot: 'ringover' }, { b: 1, d: 300, bulle: ['ringover', 'Appel en un clic'] }, { b: 2, curseur: 'activer', clic: true, spot: 'activer' }] }),
        tuto({ t: 'Connecter sa boîte mail', nouveau: true, ecran: 'mail-boites', page: 'mail', captions: ['Mail, onglet Mes boîtes : choisissez votre messagerie. Gmail, Hostinger, OVH, IONOS, Zoho et les autres.', 'Exemple : Gmail se connecte avec votre compte Google, en deux clics. Les mails partent comme si vous les envoyiez vous-même.'],
          steps: [{ b: 0, d: 300, zoom: 'fournisseurs', spot: 'fournisseurs' }, { b: 1, curseur: 'gmail', clic: true, spot: 'gmail' }] }),
        tuto({ t: 'Écrire un mail', nouveau: true, ecran: 'mail-ecrire', page: 'mail', captions: ['Onglet Nouveau mail : une fois votre boîte connectée, écrivez au prospect, et joignez un devis ou une facture en PDF.', 'L’onglet Envoyés garde la trace de tout, et chaque mail s’ajoute à l’historique du prospect.'],
          steps: [{ b: 0, d: 300, zoom: 'onglets', s: 2, spot: 'onglets' }, { b: 1, zoom: null, spot: false }] }),
      ],
      recap: ['Ringover : un clic sur un numéro, l’appel part.', 'Vos mails partent de votre propre boîte.', 'Appels et mails s’ajoutent à l’historique du prospect.'], suivant: 'Devis, factures et paiements',
      secours: ANCIENS[2].scenes }),

    module({ n: 8, f: '08-devis-paiements', t: 'Devis, factures et paiements en ligne', s: 'Créer un devis, aperçu A4, facture, paiement par carte et PayPal, encaissements.',
      accroche: 'Du devis à l’argent sur le compte, sans ressaisie.', chips: ['Devis', 'Facture', 'Stripe', 'PayPal', 'Encaissements'],
      exemple: { titre: 'Square Habitat paie en 2 minutes', qui: ['AM', 'Alex Martin', 'Fondateur & gérant', 'vert'], intro: 'Exemple concret : Square Habitat Lyon 6 a accepté un devis de trois cent quarante-huit euros.',
        etapes: [['10 h 00', 'file-text', 'Devis accepté › Convertir en facture', 'Alex convertit le devis en facture, en un clic, avec sa numérotation.'],
          ['10 h 01', 'credit-card', 'Facture envoyée avec un lien de paiement', 'La facture part avec un lien de paiement : carte bancaire, Apple Pay ou PayPal.'],
          ['10 h 03', 'wallet', 'Le client paie depuis son téléphone', 'Deux minutes plus tard, le client paie depuis son téléphone.']],
        fin: ['check', 'Facture « payée » toute seule', 'La facture passe en « payée » toute seule. Plus besoin de relancer !'] },
      quiz: [
        ['Les totaux d’un devis se calculent…', ['à la main', 'automatiquement, remise et TVA comprises', 'à l’export seulement'], 1],
        ['Comment un client peut-il payer une facture en ligne ?', ['Par un lien Stripe ou PayPal ajouté à la facture', 'Par fax', 'Ce n’est pas possible'], 0],
        ['Que se passe-t-il quand le client a payé en ligne ?', ['La facture passe en « payée » toute seule', 'Rien', 'Il faut tout ressaisir'], 0],
      ],
      tutos: [
        tuto({ t: 'Créer un devis', ecran: 'devis', page: 'devis', captions: ['Devis et factures : en haut, ce qui est en attente, le taux d’acceptation et ce qui reste à encaisser.', 'Nouveau devis : choisissez le client, ajoutez vos lignes ; remise et TVA se calculent pendant que vous tapez.'],
          steps: [{ b: 0, d: 300, zoom: 'kpi', spot: 'kpi' }, { b: 1, curseur: 'nouveau', clic: true, spot: 'nouveau' }, { b: 1, d: 1200, ecran: 'devis-edition', zoom: null, spot: 'fenetre' }] }),
        tuto({ t: 'Aperçu, PDF et facture', ecran: 'devis', page: 'devis', captions: ['Ouvrez un devis : l’aperçu A4 est prêt à imprimer ou à envoyer en PDF.', 'Devis accepté ? Un clic le convertit en facture, avec sa propre numérotation.'],
          steps: [{ b: 0, d: 200, zoom: 'liste', spot: 'liste', curseur: 'liste', clic: true }, { b: 0, d: 1500, ecran: 'devis-apercu', zoom: null, spot: 'document' }, { b: 1, spot: 'actions', zoom: 'actions' }] }),
        tuto({ t: 'Le paiement en ligne', nouveau: true, ecran: 'paiement-en-ligne', page: 'payments', captions: ['Paiements : à encaisser, en retard, encaissé ce mois et au total.', 'Paiement en ligne : connectez Stripe ou PayPal une fois. Chaque facture reçoit son lien de paiement, ajouté au mail d’envoi.', 'Quand le client a payé, la facture passe en « payée » toute seule.'],
          steps: [{ b: 0, d: 300, zoom: 'kpi', spot: 'kpi' }, { b: 1, zoom: 'enligne', spot: 'enligne' }, { b: 1, d: 2400, curseur: 'stripe', clic: true }, { b: 2, zoom: 'factures', spot: 'factures' }] }),
      ],
      recap: ['Un devis en quelques lignes ; les totaux suivent.', 'Aperçu A4, PDF, puis conversion en facture.', 'Stripe ou PayPal : le client paie, la facture se met à jour.'], suivant: 'Le marketing',
      secours: ANCIENS[4].scenes }),

    module({ n: 9, f: '09-marketing', t: 'Le marketing : campagnes, modèles et contenu', s: 'Séquences de mails, modèles de messages, calendrier de publications, sources et ROI.',
      accroche: 'Faire venir les clients pendant que vous dormez (ou presque).', chips: ['Campagnes', 'Modèles', 'Contenu', 'Sources & ROI'],
      exemple: { titre: 'La campagne « Dentistes de Lyon »', qui: ['SB', 'Sarah Benali', 'Responsable commerciale', 'violet'], intro: 'Exemple concret : Sarah lance une campagne vers trente cabinets dentaires de Lyon.',
        etapes: [['Jour 0', 'mail', 'Mail 1 : premier contact', 'Jour zéro : le premier mail part depuis sa boîte, avec le prénom et le nom du cabinet.'],
          ['Jour 3', 'refresh-cw', 'Relance automatique à J+3', 'Jour trois : une relance, seulement pour ceux qui n’ont pas répondu.'],
          ['Jour 7', 'message-circle', '4 réponses, 2 rendez-vous', 'Jour sept : quatre réponses, deux rendez-vous. Ceux qui répondent sortent de la séquence.']],
        fin: ['chart-line', 'Sources & ROI : 1 € investi, 9 € gagnés', 'Et dans Sources et ROI, elle voit enfin ce que chaque canal lui rapporte.'] },
      quiz: [
        ['Qu’est-ce qu’une campagne dans le CRM ?', ['Une séquence de mails : premier contact, relance à J+3, dernier message à J+7', 'Une affiche', 'Un appel groupé'], 0],
        ['Que se passe-t-il quand un prospect répond à la campagne ?', ['Il reçoit quand même toutes les relances', 'Il sort de la séquence', 'Il est supprimé'], 1],
        ['À quoi sert Sources & ROI ?', ['À savoir d’où viennent vos clients et ce que chaque canal rapporte', 'À changer de mot de passe', 'À rien'], 0],
      ],
      tutos: [
        tuto({ t: 'Les campagnes de mails', nouveau: true, ecran: 'campagnes', page: 'campagnes', captions: ['Campagnes : des séquences de mails de prospection. Le CRM prépare chaque jour les mails à envoyer, depuis votre boîte.', 'Votre première campagne est déjà écrite : premier contact, relance à J plus trois, dernier message à J plus sept.', 'Ceux qui répondent, changent de statut ou demandent à ne plus être contactés sortent tout seuls de la séquence.'],
          steps: [{ b: 0, d: 300, zoom: 'jour', spot: 'jour' }, { b: 1, zoom: 'premiere', spot: 'premiere', curseur: 'premiere', clic: true }, { b: 1, d: 1800, ecran: 'campagne-edition', zoom: null, spot: 'editeur' }, { b: 2, spot: false }] }),
        tuto({ t: 'Les modèles de messages', nouveau: true, ecran: 'modeles-messages', page: 'modeles', captions: ['Modèles : vos messages prêts à l’emploi, par canal. E-mail, SMS, LinkedIn, WhatsApp et script d’appel.', 'Cliquez sur Utiliser, choisissez un prospect : le prénom et le nom de l’entreprise se remplissent tout seuls.'],
          steps: [{ b: 0, d: 300, zoom: 'canaux', s: 1.8, spot: 'canaux' }, { b: 1, zoom: 'modele', spot: 'modele' }, { b: 1, d: 1400, curseur: 'utiliser', clic: true, spot: 'utiliser' }] }),
        tuto({ t: 'Planifier ses publications', nouveau: true, ecran: 'contenu', page: 'contenu', captions: ['Contenu : le calendrier de vos publications. LinkedIn d’abord, puis Facebook, Instagram et Google Business.', 'Pas d’idée ? La banque d’idées vous en propose. Le conseil du CRM : deux à trois posts LinkedIn par semaine, le mardi et le jeudi.'],
          steps: [{ b: 0, d: 300, zoom: 'calendrier', spot: 'calendrier' }, { b: 0, d: 2600, zoom: 'reseaux', s: 2, spot: 'reseaux' }, { b: 1, zoom: null, spot: 'idees', curseur: 'idees', clic: true }] }),
        tuto({ t: 'Sources et ROI', nouveau: true, ecran: 'sources', page: 'sources', captions: ['Sources et ROI : d’où viennent vos clients, combien ils coûtent et combien ils rapportent.', 'Exemple : le terrain transforme trente-trois pour cent des prospects en clients. Le CRM vous le dit en vert, juste au-dessus.', 'Pour chaque source : prospects, rendez-vous, clients, encaissé, coût par client et retour sur investissement.'],
          steps: [{ b: 0, d: 300, zoom: 'kpi', spot: 'kpi' }, { b: 1, zoom: 'meilleure', spot: 'meilleure' }, { b: 2, zoom: 'table', spot: 'table' }] }),
      ],
      recap: ['Campagnes : J0, J+3, J+7, et ceux qui répondent sortent.', 'Modèles : le texte se remplit tout seul.', 'Contenu et ROI : publier régulièrement, mesurer ce qui rapporte.'], suivant: 'Assistants IA et automatisations',
      secours: ANCIENS[6].scenes }),

    module({ n: 10, f: '10-assistants-automatisations', t: 'Assistants IA et automatisations', s: 'Huit assistants experts, leurs compétences, et les règles qui travaillent pour vous.',
      accroche: 'Une équipe d’experts IA, et un CRM qui fait le travail répétitif.', chips: ['Assistants', 'Compétences', 'Règles', 'Historique'],
      exemple: { titre: 'Un nouveau lead à 18 h 42', qui: ['AM', 'Alex Martin', 'Fondateur & gérant', 'orange'], intro: 'Exemple concret : un vendredi à dix-huit heures quarante-deux, un visiteur remplit le formulaire du site.',
        etapes: [['18 h 42', 'globe', 'Lead du site : Électricité Moreau', 'Le lead Électricité Moreau arrive tout seul dans les prospects.'],
          ['18 h 42', 'zap', 'Règle : appel le jour même', 'La règle « Nouveau lead, appel le jour même » le met dans la file d’appels.'],
          ['Lundi 9 h', 'sparkles', 'Alex 2.0 prépare l’appel', 'Lundi matin, l’assistant Alex 2.0 prépare l’appel : accroche, questions et objections probables.']],
        fin: ['check', 'Zéro lead oublié', 'Résultat : aucun lead oublié, et douze minutes de travail évitées cette semaine.'] },
      quiz: [
        ['Combien de compétences a chaque assistant IA ?', ['Une', 'Six, avec la méthode d’un expert', 'Cent'], 1],
        ['Que fait une automatisation active ?', ['Elle s’applique toute seule et note ce qu’elle a fait', 'Elle supprime des fiches', 'Rien'], 0],
        ['Où voir ce que les automatisations ont fait ?', ['Dans l’historique de la page Automatisations', 'Nulle part', 'Dans Paiements'], 0],
      ],
      tutos: [
        tuto({ t: 'Les assistants IA', nouveau: true, ecran: 'assistants', page: 'assistants', captions: ['Assistants IA : votre équipe d’experts. Alex 2.0, le coach du quotidien, l’assistant CEO, le VP Sales, le directeur de production, et d’autres.', 'Chacun a six compétences. Exemple : « Planifier ma journée », « Préparer un appel » ou « Répondre à une objection ».', 'Posez une question ou lancez une compétence ; cliquez sur « Appliquer » pour que ses actions se fassent dans le CRM.'],
          steps: [{ b: 0, d: 300, zoom: 'alex', spot: 'alex' }, { b: 0, d: 2800, spot: 'ceo' }, { b: 1, zoom: 'competences', s: 2, spot: 'competences', curseur: 'competences', clic: true }, { b: 2, zoom: 'panneau', spot: 'panneau' }] }),
        tuto({ t: 'Les automatisations', nouveau: true, ecran: 'automatisations', page: 'automatisations', captions: ['Automatisations : le CRM fait le travail répétitif pour toute l’équipe. En haut, les règles actives et le temps gagné.', 'Exemple : « Prospect oublié, retour dans la file d’appels » après vingt et un jours sans activité. Réglez le délai, activez l’interrupteur.', 'L’historique, à droite, montre tout ce que les règles ont fait.'],
          steps: [{ b: 0, d: 300, zoom: 'kpi', spot: 'kpi' }, { b: 1, zoom: 'regle', spot: 'regle' }, { b: 1, d: 2400, curseur: 'interrupteur', clic: true }, { b: 2, zoom: 'historique', spot: 'historique' }] }),
      ],
      recap: ['Huit assistants, six compétences chacun.', '« Appliquer » : les actions se font dans le CRM.', 'Des règles qui travaillent pour vous, avec historique.'], suivant: 'Messages, groupes et visio',
      secours: ANCIENS[6].scenes }),

    module({ n: 11, f: '11-messagerie', t: 'Messages, groupes et visio', s: 'Messagerie en trois colonnes, réactions, vocaux, pièces jointes, groupes et visio.',
      accroche: 'Toute l’équipe se parle sans quitter le CRM.', chips: ['Messages', 'Réactions', 'Groupes', 'Visio'],
      exemple: { titre: 'Une bonne nouvelle à partager', qui: ['SB', 'Sarah Benali', 'Responsable commerciale', 'rose'], intro: 'Exemple concret : le Cabinet Lumière vient de valider son devis.',
        etapes: [['11 h 30', 'message-circle', '« Le cabinet Lumière a validé ! 🎉 »', 'Sarah l’annonce à Alex dans Messages. Une bannière s’affiche sur son écran.'],
          ['11 h 31', 'heart', 'Réaction 🎉 d’Alex', 'Alex répond d’une réaction et demande la facture d’acompte.'],
          ['14 h 00', 'video', 'Visio d’équipe en un clic', 'À quatorze heures, visio d’équipe en un clic pour fêter ça et préparer la suite.']],
        fin: ['users', 'Toute l’équipe au courant', 'Tout est resté dans le CRM, lié au prospect. Aucune info perdue dans un autre outil !'] },
      quiz: [
        ['Comment réagir à un message sans écrire ?', ['Avec une réaction emoji', 'En le supprimant', 'Ce n’est pas possible'], 0],
        ['Que se passe-t-il quand on clique sur une photo reçue ?', ['Elle s’ouvre en grand, avec zoom et téléchargement', 'Rien', 'Elle se supprime'], 0],
        ['Que se passe-t-il quand quelqu’un lance une visio ?', ['Une sonnerie et une carte d’appel apparaissent', 'Rien', 'Un e-mail part'], 0],
      ],
      tutos: [
        tuto({ t: 'La messagerie en trois colonnes', nouveau: true, ecran: 'messages', page: 'messages', captions: ['Messages : vos conversations à gauche, avec les filtres non lus, épinglés et favoris. Le fil au centre.', 'Écrivez en bas : texte, message vocal, fichier ou modèle. Et réagissez d’un emoji à n’importe quel message.', 'À droite : les membres, et le prospect lié à la conversation. Les onglets Tâches, Événements et Notes sont juste au-dessus du fil.'],
          steps: [{ b: 0, d: 300, zoom: 'liste', spot: 'liste' }, { b: 0, d: 2400, zoom: 'fil', spot: 'fil' }, { b: 1, zoom: 'saisie', spot: 'saisie', curseur: 'saisie', clic: true }, { b: 2, zoom: null, spot: 'details' }] }),
        tuto({ t: 'Ouvrir une pièce jointe en grand', ecran: 'piece-jointe', page: 'messages', captions: ['Une photo, une vidéo ou un PDF reçu ? Cliquez dessus : il s’ouvre en grand, par-dessus le CRM.', 'Zoomez, passez à la pièce suivante avec les flèches, téléchargez, puis Échap pour fermer.'],
          steps: [{ b: 0, d: 300, zoom: 'image', spot: 'image' }, { b: 0, d: 1500, curseur: 'image', clic: true, centre: true }, { b: 1, ecran: 'visionneuse', zoom: null, spot: false }, { b: 1, d: 1600, bulle: ['telecharger', 'Télécharger'], curseur: 'telecharger' }, { b: 1, d: 3200, curseur: 'fermer', clic: true }] }),
        tuto({ t: 'Les groupes', ecran: 'groupes', page: 'groupes', captions: ['Groupes : un espace par équipe ou par projet, avec une image et les mêmes possibilités que les messages.', 'Nouveau groupe : donnez un nom, choisissez les membres. Exemple : « Équipe commerciale ».'],
          steps: [{ b: 0, d: 300, zoom: 'fil', spot: 'fil' }, { b: 1, zoom: 'nouveau', s: 2, spot: 'nouveau', curseur: 'nouveau', clic: true }] }),
        tuto({ t: 'Lancer une visio', ecran: 'visio', page: 'visio', captions: ['Visio : lancez une réunion avec l’équipe ou avec un groupe, en un clic.', 'Vos collègues reçoivent une sonnerie et une carte d’appel pour rejoindre.'],
          steps: [{ b: 0, d: 300, zoom: 'lancer', s: 2, spot: 'lancer', curseur: 'lancer', clic: true }, { b: 1, zoom: null, spot: false }] }),
      ],
      recap: ['Trois colonnes : conversations, fil, prospect lié.', 'Réactions, vocaux, fichiers qui s’ouvrent en grand.', 'Groupes et visio en un clic.'], suivant: 'Analyse : rapports, clients et carte',
      secours: ANCIENS[6].scenes }),

    module({ n: 12, f: '12-analyse', t: 'Analyse : rapports, clients et carte', s: 'Rapports animés, mode présentation, clients et MRR, tableau de bord, carte clients.',
      accroche: 'Mesurer pour mieux décider, et briller en réunion.', chips: ['Rapports', 'Présenter', 'Clients', 'Carte'],
      exemple: { titre: 'La réunion du lundi d’Alex', qui: ['AM', 'Alex Martin', 'Fondateur & gérant', 'bleu'], intro: 'Exemple concret : lundi, réunion d’équipe. Alex n’a rien préparé… et ce n’est pas grave.',
        etapes: [['9 h 30', 'chart-line', 'Rapports › Présenter (touche P)', 'Il ouvre Rapports et appuie sur P : le mode présentation s’affiche en plein écran.'],
          ['9 h 32', 'trending-up', '23 200 € de chiffre, +63 %', 'Diapo après diapo, les chiffres s’animent : vingt-trois mille deux cents euros, plus soixante-trois pour cent.'],
          ['9 h 40', 'globe', 'Carte clients : objectif Villeurbanne', 'Il finit sur la carte clients : prochaine zone à conquérir, Villeurbanne.']],
        fin: ['award', 'Réunion bouclée en 15 min', 'Réunion bouclée en quinze minutes, toute l’équipe motivée !'] },
      quiz: [
        ['Comment présenter vos chiffres en réunion ?', ['Avec « Présenter » (touche P) dans Rapports', 'En recopiant à la main', 'Ce n’est pas possible'], 0],
        ['Que mesure le MRR ?', ['Le revenu récurrent mensuel', 'Le nombre d’appels', 'Le nombre de devis'], 0],
        ['Que montre la carte clients ?', ['Vos clients et prospects ville par ville, en carte ou en globe 3D', 'La météo', 'Les factures'], 0],
      ],
      tutos: [
        tuto({ t: 'Les rapports animés', nouveau: true, ecran: 'rapports', page: 'reports', captions: ['Rapports et analyses : quatre chiffres clés comparés au mois précédent. Prospects contactés, rendez-vous, conversion et revenus.', 'Les graphiques s’animent à l’ouverture. Passez la souris sur un point : la valeur exacte s’affiche.', 'Choisissez la période en haut, et exportez le rapport en un clic.'],
          steps: [{ b: 0, d: 300, zoom: 'kpi', spot: 'kpi' }, { b: 1, zoom: 'perf', spot: 'perf' }, { b: 1, d: 2400, spot: 'ca' }, { b: 2, zoom: null, spot: 'exporter', curseur: 'periode' }] }),
        tuto({ t: 'Le mode présentation', nouveau: true, ecran: 'rapports', page: 'reports', captions: ['Le bouton Présenter, ou la touche P, transforme vos rapports en diaporama plein écran.', 'Une diapo par chiffre clé et par graphique, avec ses animations. Idéal pour la réunion du lundi.'],
          steps: [{ b: 0, d: 300, zoom: 'presenter', s: 2.2, spot: 'presenter', curseur: 'presenter', clic: true }, { b: 1, ecran: 'rapports-presentation', zoom: null, spot: false }] }),
        tuto({ t: 'Le portefeuille clients', ecran: 'clients', page: 'clients', captions: ['Clients : vos clients actifs, le revenu mensuel récurrent, l’ancienneté et le taux de résiliation.', 'Le MRR par secteur et le top clients montrent d’où vient votre chiffre.'],
          steps: [{ b: 0, d: 300, zoom: 'kpi', spot: 'kpi' }, { b: 1, zoom: 'mrr', spot: 'mrr' }, { b: 1, d: 2200, zoom: 'top', spot: 'top' }] }),
        tuto({ t: 'Le tableau de bord', ecran: 'tableau', page: 'dashboard', captions: ['Le tableau de bord : vos chiffres clés de la semaine, vos objectifs d’appels et de rendez-vous.', 'L’entonnoir montre l’étape à améliorer, des appels jusqu’aux clients signés.'],
          steps: [{ b: 0, d: 300, zoom: 'kpi', spot: 'kpi' }, { b: 0, d: 2400, zoom: 'objectifs', spot: 'objectifs' }, { b: 1, zoom: 'entonnoir', spot: 'entonnoir' }] }),
        tuto({ t: 'La carte clients', ecran: 'carte', page: 'carte', captions: ['La carte clients place chaque fiche sur sa ville : en vert les clients, en bleu les prospects. À droite, le classement de vos villes.', 'Trois vues : la carte, le globe 3D qui tourne, et la vue réaliste par satellite.'],
          steps: [{ b: 0, d: 400, zoom: 'carte', spot: 'carte', lent: true }, { b: 0, d: 2800, zoom: 'villes', spot: 'villes' }, { b: 1, zoom: 'vues', spot: 'vues', curseur: 'vues', clic: true }, { b: 1, d: 1800, ecran: 'globe', zoom: null, spot: false }] }),
      ],
      recap: ['Rapports animés, valeurs au survol, export.', 'Présenter (touche P) : vos chiffres en diaporama.', 'Clients, tableau de bord et carte : tout votre territoire.'], suivant: 'Équipe, outils et réglages',
      secours: ANCIENS[5].scenes }),

    module({ n: 13, f: '13-equipe-reglages', t: 'Équipe, outils et réglages', s: 'Compte, organigramme, accès des membres, sauvegardes, enregistrements, sons, icônes et ambiance.',
      accroche: 'Chacun son compte, et un CRM à votre image.', chips: ['Compte', 'Accès', 'Sauvegardes', 'Sons', 'Icônes'],
      exemple: { titre: 'Alex accueille une stagiaire', qui: ['AM', 'Alex Martin', 'Fondateur & gérant', 'violet'], intro: 'Exemple concret : Alex accueille Emma, stagiaire pour deux mois.',
        etapes: [['Lundi', 'user-plus', 'Inviter Emma, rôle membre', 'Il l’invite dans Réglages, Équipe et compte, avec le rôle membre.'],
          ['Lundi', 'shield', 'Accès : Prospects, Simulations, Formations', 'Colonne Accès : il ne coche que Prospects, Simulations IA et Formations. Le reste lui est caché.'],
          ['Vendredi', 'graduation-cap', 'Suivi : 13 modules vus, quiz 37 / 39', 'Vendredi, il voit dans Formations qu’Emma a suivi les treize modules. Quiz : trente-sept sur trente-neuf !']],
        fin: ['award', 'Emma est prête à appeler', 'Emma est prête à prospecter, et les données sensibles sont restées protégées.'] },
      quiz: [
        ['Comment limiter les rubriques qu’un membre peut ouvrir ?', ['Ce n’est pas possible', 'Colonne Accès : l’administrateur coche ses rubriques', 'En lui donnant un autre mot de passe'], 1],
        ['Combien de versions de vos données le serveur garde-t-il ?', ['Aucune', 'Les cent dernières, restaurables', 'Une seule'], 1],
        ['Comment changer les icônes du menu ?', ['Réglages, Icônes du menu : plus de deux mille icônes deux tons', 'En changeant d’ordinateur', 'Ce n’est pas possible'], 0],
      ],
      tutos: [
        tuto({ t: 'Mon compte et l’organigramme', ecran: 'compte', page: 'today', captions: ['Mon compte : votre nom, votre photo de profil et votre mot de passe.', 'L’organigramme montre le poste et le responsable de chaque membre, avec sa photo.'],
          steps: [{ b: 0, d: 300, zoom: 'fenetre', spot: 'fenetre' }, { b: 1, ecran: 'organigramme', zoom: 'organigramme', spot: 'organigramme', lent: true }] }),
        tuto({ t: 'Inviter et choisir les accès', ecran: 'equipe', page: 'settings', captions: ['Réglages, Équipe et compte : l’administrateur invite les membres et choisit leur rôle.', 'Colonne Accès : cochez les rubriques que chaque membre peut ouvrir. Son menu change tout de suite.'],
          steps: [{ b: 0, d: 300, zoom: 'membres', spot: 'membres' }, { b: 0, d: 1800, curseur: 'inviter', clic: true, spot: 'inviter' }, { b: 1, ecran: 'acces', zoom: 'panneau', spot: 'panneau' }, { b: 1, d: 2400, bulle: ['panneau', 'Une case par rubrique'] }] }),
        tuto({ t: 'Sauvegardes et versions', ecran: 'donnees', page: 'settings', captions: ['Données : le serveur garde les cent dernières versions de vos données.', 'Une erreur ? Restaurez une version en un clic, ou exportez une sauvegarde.'],
          steps: [{ b: 0, d: 300, zoom: 'versions', spot: 'versions' }, { b: 1, zoom: 'sauvegarde', spot: 'sauvegarde' }] }),
        tuto({ t: 'Écouter les enregistrements', ecran: 'enregistrements-equipe', page: 'tools', captions: ['Outils : les enregistrements d’appels de chaque membre arrivent tout seuls sur le serveur.', 'L’administrateur les écoute, les télécharge, et filtre par membre. Parfait pour coacher l’équipe.'],
          steps: [{ b: 0, d: 300, zoom: 'liste', spot: 'liste' }, { b: 1, curseur: 'filtre', clic: true, spot: 'filtre' }, { b: 1, d: 1800, curseur: 'ecouter', clic: true, spot: 'ecouter' }] }),
        tuto({ t: 'Vos propres sons MP3', ecran: 'sons', page: 'settings', captions: ['Sons du CRM : un son pour la visio, un pour les messages reçus, un pour les messages envoyés.', 'Choisissez un MP3 de votre ordinateur. Pourquoi pas un petit « cha-ching » à chaque message ?'],
          steps: [{ b: 0, d: 300, zoom: 'sons', spot: 'sons' }, { b: 1, curseur: 'mp3', clic: true, spot: 'mp3' }, { b: 1, d: 1400, bulle: ['mp3', 'Votre fichier MP3'] }] }),
        tuto({ t: 'Icônes deux tons et ambiance', nouveau: true, ecran: 'icones', page: 'settings', captions: ['Réglages, Icônes du menu : plus de deux mille icônes deux tons pour personnaliser chaque rubrique.', 'Apparence et Ambiance : thème clair ou sombre, couleur d’accent, et le fond animé de particules.'],
          steps: [{ b: 0, d: 300, zoom: 'icones', spot: 'icones' }, { b: 1, ecran: 'apparence', zoom: null, spot: 'themes' }, { b: 1, d: 2400, ecran: 'ambiance', spot: 'ambiance' }] }),
        tuto({ t: 'Le suivi de la formation', ecran: 'suivi', page: 'formations', captions: ['Ici, dans Formations, l’administrateur voit les modules vus et le score aux quiz de chaque membre.'],
          steps: [{ b: 0, d: 300, zoom: 'suivi', spot: 'suivi' }] }),
      ],
      recap: ['Compte, organigramme, rôles et accès cochés par l’administrateur.', 'Cent versions de sauvegarde, et les enregistrements de l’équipe.', 'Sons, icônes deux tons et ambiance : un CRM à votre image.'], suivant: null,
      secours: ANCIENS[6].scenes }),
  ];
  // Tous les tutos (onglet « Tutos rapides ») : chaque scène sur la vraie interface, rangée par module.
  var TUTOS = [];
  MODULES.forEach(function (m, i) { m.scenes.forEach(function (s) { if (s.tuto) TUTOS.push({ f: null, t: s.tuto, s: m.t, mod: i, quiz: [], scenes: [s] }); }); });

  // ================================================================== musique
  // Musique rigolote générée en direct (Web Audio) : marimba, ukulélé, basse qui rebondit, claquements de doigts,
  // sifflement, kazoo, glockenspiel et petits « boing » en fin de phrase. Quatre couplets qui tournent, rien ne
  // se répète trop. Aucun fichier, aucun droit d'auteur. Elle baisse toute seule quand la voix off parle.
  var Musique = (function () {
    var ctx = null, master = null, duck = null, noise = null, timer = 0, step = 0, nextT = 0, cycle = 0, pans = {};
    var SPB = 60 / 116 / 4; // double croche à 116 battements par minute
    // Do, La mineur, Fa, Sol7 : la grille la plus joyeuse qui soit.
    var CH = [[60, 64, 67, 72], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 65]];
    var MEL = [
      [72, 0, 74, 76, 0, 79, 0, 76, 74, 0, 72, 0, 67, 0, 0, 0], [69, 0, 72, 0, 76, 0, 74, 72, 0, 69, 0, 72, 0, 0, 0, 0],
      [65, 0, 69, 72, 0, 77, 0, 76, 0, 74, 72, 0, 69, 0, 0, 0], [71, 0, 74, 0, 77, 76, 74, 0, 72, 0, 71, 0, 67, 0, 79, 0]];
    var REP = [ // réponses courtes (glockenspiel, kazoo) entre les phrases
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 84, 86, 88], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 81, 0, 84],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 77, 81, 84], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
    function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
    function bus(p) { // une sortie par position dans l'espace stéréo
      if (pans[p] != null) return pans[p];
      var n = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
      if (n.pan) n.pan.value = p;
      n.connect(duck); pans[p] = n; return n;
    }
    function tone(m, t, v, d, type, dest, detune) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = hz(m); if (detune) o.detune.value = detune;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(dest || duck); o.start(t); o.stop(t + d + 0.05);
    }
    function marimba(m, t, v) { tone(m, t, v, 0.42, 'sine', bus(-0.25)); tone(m + 24, t, v * 0.22, 0.07, 'sine', bus(-0.25)); }
    function glock(m, t, v) { tone(m, t, v, 0.7, 'sine', bus(0.4)); tone(m + 31.02, t, v * 0.18, 0.25, 'sine', bus(0.4)); }
    function whistle(m, t, v) {
      var o = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(hz(m) * 0.94, t); o.frequency.exponentialRampToValueAtTime(hz(m), t + 0.07);
      lfo.frequency.value = 5.5; lg.gain.value = hz(m) * 0.014; lfo.connect(lg); lg.connect(o.frequency);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.connect(g); g.connect(bus(0.15)); o.start(t); lfo.start(t); o.stop(t + 0.34); lfo.stop(t + 0.34);
    }
    // Kazoo : dent de scie filtrée, vibrato rapide, petit glissé à l'attaque.
    function kazoo(m, t, v) {
      var o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(hz(m - 1), t); o.frequency.linearRampToValueAtTime(hz(m), t + 0.05);
      lfo.frequency.value = 7; lg.gain.value = hz(m) * 0.02; lfo.connect(lg); lg.connect(o.frequency);
      f.type = 'bandpass'; f.frequency.value = 1300; f.Q.value = 2.2;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.02); g.gain.setValueAtTime(v, t + 0.14); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
      o.connect(f); f.connect(g); g.connect(bus(0.3)); o.start(t); lfo.start(t); o.stop(t + 0.27); lfo.stop(t + 0.27);
    }
    // « Boing » : une note qui tombe en glissant, façon dessin animé.
    function boing(t, haut) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(haut ? 720 : 420, t); o.frequency.exponentialRampToValueAtTime(haut ? 180 : 110, t + 0.32);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.36);
      o.connect(g); g.connect(bus(-0.4)); o.start(t); o.stop(t + 0.4);
    }
    function hit(t, f, q, v, d, p) {
      var s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = noise; fl.type = 'bandpass'; fl.frequency.value = f; fl.Q.value = q;
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      s.connect(fl); fl.connect(g); g.connect(p == null ? duck : bus(p)); s.start(t); s.stop(t + d + 0.02);
    }
    function snap(t) { hit(t, 2600, 4, 0.32, 0.05, 0.35); }
    function kick(t) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
      g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      o.connect(g); g.connect(duck); o.start(t); o.stop(t + 0.22);
    }
    function play16(i, t) {
      var bar = Math.floor(i / 16) % 4, k = i % 16, ch = CH[bar], part = cycle % 4;
      // Batterie : grosse caisse qui sautille, claquements de mains ou de doigts, charleston léger.
      if (k === 0 || k === 8 || (k === 10 && part % 2)) kick(t);
      if (k === 4 || k === 12) { if (part === 2) snap(t); else { hit(t, 1400, 0.8, 0.24, 0.13, -0.1); hit(t + 0.014, 2200, 1.2, 0.16, 0.1, 0.1); } }
      if (k % 2 === 0) hit(t, 8000, 1.5, k % 4 === 2 ? 0.08 : 0.045, 0.04, 0.25);
      // Basse qui rebondit d'une octave.
      if (k === 0 || k === 8) tone(ch[0] - 24, t, 0.26, 0.26, 'triangle');
      if (k === 3 || k === 11) tone(ch[0] - 12, t, 0.16, 0.12, 'triangle');
      if (k === 6 || k === 14) tone(ch[2] - 24, t, 0.2, 0.18, 'triangle');
      // Ukulélé : accords brefs à contretemps.
      if (k % 4 === 2) ch.slice(0, 3).forEach(function (n, j) { tone(n, t + j * 0.011, 0.04, 0.2, 'triangle', bus(-0.35), j * 4); });
      // Mélodie : marimba, puis sifflement, puis kazoo, puis marimba + glockenspiel.
      var m = MEL[bar][k];
      if (m) { if (part === 1) whistle(m + 12, t, 0.055); else if (part === 2) kazoo(m, t, 0.05); else marimba(m, t, 0.11); }
      var r = REP[bar][k];
      if (r && part !== 2) glock(r, t, 0.05);
      if (bar === 3 && k === 15) boing(t, part % 2);
    }
    function sched() {
      while (nextT < ctx.currentTime + 0.15) {
        play16(step, nextT); nextT += SPB * (step % 2 ? 0.9 : 1.1); // swing sautillant
        step++; if (step % 64 === 0) cycle++;
      }
    }
    return {
      start: function (vol) {
        try {
          if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            master = ctx.createGain(); duck = ctx.createGain(); duck.connect(master); master.connect(ctx.destination);
            noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
            var d = noise.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
          }
          ctx.resume(); master.gain.cancelScheduledValues(ctx.currentTime);
          master.gain.setTargetAtTime(vol == null ? 0.2 : vol, ctx.currentTime, 0.4);
          if (!timer) { nextT = ctx.currentTime + 0.08; timer = setInterval(sched, 25); }
        } catch (e) {}
      },
      stop: function () {
        if (!ctx) return;
        master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.12);
        clearInterval(timer); timer = 0;
      },
      duck: function (on) { if (ctx) duck.gain.setTargetAtTime(on ? 0.3 : 1, ctx.currentTime, on ? 0.08 : 0.5); },
    };
  })();

  // ================================================================== progression (navigateur + serveur)
  var seen = readJson(SEEN_KEY, []), quiz = readJson(QUIZ_KEY, {}), prefs = Object.assign({ voix: true, musique: true, st: true, vit: 1 }, readJson(PREF_KEY, {}));
  var team = null;
  function readJson(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function writeJson(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function api(method, path, body) {
    var h = { 'X-Requested-With': 'blackstart' }; if (body) h['Content-Type'] = 'application/json';
    return fetch(path, { method: method, credentials: 'same-origin', headers: h, body: body ? JSON.stringify(body) : undefined }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.status === 204 ? null : r.json(); });
  }
  function markSeen(f) {
    if (seen.indexOf(f) < 0) { seen.push(f); writeJson(SEEN_KEY, seen); }
    if (SERVER) api('PUT', '/api/formation/' + f, { vu: true }).catch(function () {});
  }
  function saveQuiz(f, score) {
    quiz[f] = Math.max(quiz[f] || 0, score); writeJson(QUIZ_KEY, quiz);
    if (SERVER) api('PUT', '/api/formation/' + f, { vu: true, quiz: score }).catch(function () {});
  }
  function loadServer(cb) {
    if (!SERVER) return;
    api('GET', '/api/formation').then(function (b) {
      Object.keys(b.mine || {}).forEach(function (f) {
        if (b.mine[f].vu && seen.indexOf(f) < 0) seen.push(f);
        if (b.mine[f].quiz != null) quiz[f] = Math.max(quiz[f] || 0, b.mine[f].quiz);
      });
      writeJson(SEEN_KEY, seen); writeJson(QUIZ_KEY, quiz);
      // Ce qui a été vu avant la version équipe remonte au serveur.
      seen.forEach(function (f) { if (!(b.mine || {})[f]) api('PUT', '/api/formation/' + f, { vu: true, quiz: quiz[f] }).catch(function () {}); });
      team = b.equipe || null;
      cb();
    }).catch(function () {});
  }

  // ================================================================== lecteur
  function Player(screen, mod, hooks) {
    var stage = screen.querySelector('.bsf-stage');
    var scenes = mod.scenes, built = null, cur = -1, t = 0, playing = false, raf = 0, last = 0;
    // Durées calculées une fois (scène construite à blanc, sans rien afficher).
    var durs = scenes.map(function (def) {
      var tLoc = 500;
      def.captions.forEach(function (c) { tLoc += capDur(c); });
      return Math.max(def.min || 0, tLoc + 600);
    });
    var starts = [], total = 0;
    durs.forEach(function (d) { starts.push(total); total += d; });
    var bg = stage.querySelector('.bsf-bgfx');
    var capEl = screen.querySelector('.bsf-cap'), lastCap = '', spoken = '', speaking = false, holdUntilSpeechEnd = false;

    function sceneAt(time) { for (var i = scenes.length - 1; i >= 0; i--) if (time >= starts[i]) return i; return 0; }
    function mount(i) {
      var old = stage.querySelector('.bsf-layer');
      if (old) old.remove();
      var layer = document.createElement('div'); layer.className = 'bsf-layer';
      stage.appendChild(layer);
      built = makeScene(scenes[i], layer);
      cur = i;
    }
    function render() {
      var i = sceneAt(t);
      if (i !== cur) mount(i);
      var lt = t - starts[i];
      built.seek(lt);
      // Fond vivant : léger mouvement continu.
      if (bg) bg.style.setProperty('--bsf-t', (t / 1000).toFixed(2));
      // Sous-titre courant.
      var ci = -1;
      built.beats.forEach(function (b, k) { if (lt >= b) ci = k; });
      var cap = ci >= 0 ? built.captions[ci] : '';
      if (cap !== lastCap) {
        lastCap = cap;
        capEl.textContent = cap;
        capEl.classList.toggle('on', !!cap && prefs.st);
        if (cap && playing && prefs.voix) speak(cap);
      }
      hooks.onTime(t, total, i);
    }
    // Voix off : fichier neuronal pré-enregistré quand le serveur le fournit, sinon synthèse du navigateur.
    var audio = null, AUDIO_OK = /^https?:/.test(location.protocol) && !!window.BS_VOIX;
    function stopVoice() {
      if (audio) { audio.onended = audio.onerror = null; try { audio.pause(); } catch (e) {} audio = null; }
      try { speechSynthesis.cancel(); } catch (e) {}
      speaking = false; Musique.duck(false);
    }
    function speak(text) {
      stopVoice();
      var e11 = voix11(text);
      if (e11 || (AUDIO_OK && voixMs(text))) {
        var a = audio = new Audio(e11 ? '/api/formation/voix/' + e11[1] + '.mp3' : 'voix/' + hashCap(text) + '.mp3');
        a.playbackRate = prefs.vit; a.preservesPitch = true;
        speaking = true; spoken = text; Musique.duck(true);
        a.onended = function () { if (audio === a) { speaking = false; Musique.duck(false); } };
        a.onerror = function () { if (audio === a) { audio = null; synth(text); } };
        var pr = a.play(); if (pr && pr.catch) pr.catch(function () { if (audio === a) { audio = null; synth(text); } });
        return;
      }
      synth(text);
    }
    function synth(text) {
      if (!window.speechSynthesis) { speaking = false; Musique.duck(false); return; }
      try {
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.lang = 'fr-FR'; u.rate = Math.min(1.6, .98 * prefs.vit);
        var v = speechSynthesis.getVoices().filter(function (x) { return /^fr/i.test(x.lang); });
        if (v.length) u.voice = v.filter(function (x) { return /Google|Amélie|Thomas|Audrey|Denise|Henri|Natural/i.test(x.name); })[0] || v[0];
        speaking = true; spoken = text; Musique.duck(true);
        u.onend = u.onerror = function () { if (spoken === text) { speaking = false; Musique.duck(false); } };
        speechSynthesis.speak(u);
      } catch (e) { speaking = false; }
    }
    function nextBeatAfter(time) {
      var i = sceneAt(time), lt = time - starts[i], b = built && cur === i ? built.beats : [];
      for (var k = 0; k < b.length; k++) if (b[k] > lt) return starts[i] + b[k];
      return starts[i] + durs[i] - 380; // avant la sortie de scène
    }
    function frame(ts) {
      raf = requestAnimationFrame(frame);
      var dt = last ? Math.min(100, ts - last) : 16; last = ts;
      if (!playing) return;
      var nt = t + dt * prefs.vit;
      // Voix off : on attend la fin de la phrase avant de passer à la suivante.
      if (prefs.voix && speaking) { var lim = nextBeatAfter(t); if (nt >= lim) nt = Math.max(t, lim - 1); }
      t = nt;
      if (t >= total) { t = total; render(); pause(); hooks.onEnd(); return; }
      render();
    }
    function play() { if (t >= total) seek(0); playing = true; lastCap = ''; if (prefs.musique) Musique.start(); render(); hooks.onState(true); }
    function pause() { playing = false; stopVoice(); Musique.stop(); hooks.onState(false); }
    function seek(time) { t = Math.max(0, Math.min(total, time)); stopVoice(); lastCap = '__'; render(); }
    raf = requestAnimationFrame(frame);
    render();
    return {
      play: play, pause: pause, seek: seek, toggle: function () { playing ? pause() : play(); },
      get playing() { return playing; }, get t() { return t; }, total: total, starts: starts, durs: durs,
      chapter: function (i) { seek(starts[i] + 1); },
      destroy: function () { cancelAnimationFrame(raf); pause(); },
      refreshCaption: function () { lastCap = '__'; render(); },
      musique: function (on) { if (on && playing) Musique.start(); else Musique.stop(); },
      stopVoice: stopVoice,
    };
  }

  // ================================================================== rubrique « Formations »
  function monter(root) {
    if (!root || root.getAttribute('data-bsf')) return;
    root.setAttribute('data-bsf', '1');
    ensureCss();
    var ui = { idx: firstUnseen(), quiz: null, cert: false, mode: 'formation', tidx: 0 };
    var player = null, resizeObs = null;
    // Onglet « Tutos rapides » : chaque tuto de la vraie interface, seul, sans quiz.
    function tutos() { return ui.mode === 'tutos' && TUTOS.length; }
    function cur() { return tutos() ? TUTOS[ui.tidx] : MODULES[ui.idx]; }
    function firstUnseen() { for (var i = 0; i < MODULES.length; i++) if (seen.indexOf(MODULES[i].f) < 0) return i; return 0; }
    function nbSeen() { return MODULES.filter(function (m) { return seen.indexOf(m.f) >= 0; }).length; }

    function render() {
      if (player) { player.destroy(); player = null; }
      var m = cur(), done = nbSeen(), T = tutos();
      root.innerHTML =
        '<div class="page-head"><div class="page-head-text"><h1 class="page-title">Formations</h1><p class="page-sub">' + (TUTOS.length ? 'Le CRM de A à Z : motion design et tutos sur la vraie interface' : 'Le CRM expliqué en motion design, module par module') + '</p></div>' +
        (TUTOS.length ? '<div class="seg bsf-modes" role="tablist"><button type="button" role="tab" class="seg-btn' + (T ? '' : ' active') + '" aria-selected="' + !T + '" data-mode="formation">' + ic('play', 14) + ' Formation complète</button>' +
          '<button type="button" role="tab" class="seg-btn' + (T ? ' active' : '') + '" aria-selected="' + !!T + '" data-mode="tutos">' + ic('zap', 14) + ' Tutos rapides · ' + TUTOS.length + '</button></div>' : '') +
        '<div class="bsf-progress"><strong>' + done + ' / ' + MODULES.length + '</strong> modules vus<span class="bsf-pbar"><i style="width:' + Math.round(done / MODULES.length * 100) + '%"></i></span>' +
        (done === MODULES.length ? '<button type="button" class="btn btn-secondary btn-sm" data-act="cert">' + ic('award', 15) + ' Mon certificat</button>' : '') + '</div></div>' +
        '<div class="bsf-layout"><div class="card bsf-player">' +
        '<div class="bsf-screen" tabindex="0" aria-label="Lecteur de la formation"><div class="bsf-stage"><div class="bsf-bgfx"><i></i><i></i><i></i></div></div><div class="bsf-cap" aria-live="polite"></div>' +
        '<button type="button" class="bsf-bigplay" data-act="play" aria-label="Lecture">' + ic('play', 34, '#fff') + '</button><div class="bsf-over"></div></div>' +
        '<div class="bsf-ctrl"><button type="button" class="bsf-cb-btn" data-act="toggle" aria-label="Lecture ou pause">' + ic('play', 18) + '</button>' +
        '<span class="bsf-time">0:00 / 0:00</span><div class="bsf-scrub" role="slider" aria-label="Avancement" tabindex="0"><div class="bsf-scrub-fill"></div><div class="bsf-scrub-chap"></div><div class="bsf-scrub-knob"></div></div>' +
        '<button type="button" class="bsf-cb-btn txt" data-act="speed" title="Vitesse">' + prefs.vit + '×</button>' +
        '<button type="button" class="bsf-cb-btn' + (prefs.st ? ' on' : '') + '" data-act="st" title="Sous-titres (C)">CC</button>' +
        '<button type="button" class="bsf-cb-btn' + (prefs.voix ? ' on' : '') + '" data-act="voix" title="Voix off (V)">' + ic('mic', 17) + '</button>' +
        '<button type="button" class="bsf-cb-btn' + (prefs.musique ? ' on' : '') + '" data-act="musique" title="Musique (M)" aria-label="Musique">' + MUSIC_ICON + '</button>' +
        '<button type="button" class="bsf-cb-btn" data-act="full" title="Plein écran (F)">' + ic('fullscreen', 17) + '</button></div>' +
        (T ? '<div class="bsf-meta"><div class="min-w-0"><div class="bsf-kick">Tuto ' + (ui.tidx + 1) + ' sur ' + TUTOS.length + ' · ' + esc(m.s) + ' · <span class="bsf-dur"></span></div><h2 class="bsf-title">' + esc(m.t) + '</h2><p class="bsf-sub">Sur la vraie interface du CRM</p></div>' +
          '<div class="bsf-actions"><button type="button" class="btn btn-ghost btn-sm" data-act="module">' + ic('play', 15) + ' Voir le module complet</button>' +
          (ui.tidx < TUTOS.length - 1 ? '<button type="button" class="btn btn-primary btn-sm" data-act="next">Tuto suivant ' + ic('arrow-right', 15) + '</button>' : '') + '</div></div></div>' +
          '<div class="card card-flush bsf-list bsf-tlist"><div class="bsf-tsearch"><input type="search" class="input" placeholder="Chercher un tuto…" aria-label="Chercher un tuto" value="' + esc(ui.q || '') + '"></div>' + TUTOS.map(function (tt, i) {
            return (i === 0 || TUTOS[i - 1].mod !== tt.mod ? '<div class="bsf-tgroup" data-g="' + tt.mod + '">' + (tt.mod + 1) + '. ' + esc(MODULES[tt.mod].t) + '</div>' : '') +
              '<button type="button" class="bsf-item bsf-titem' + (i === ui.tidx ? ' active' : '') + '" data-tuto="' + i + '" data-g="' + tt.mod + '"><span class="bsf-inum">' + ic(i === ui.tidx ? 'play' : 'zap', 14) + '</span>' +
              '<span class="bsf-itxt"><span class="bsf-it">' + esc(tt.t) + (tt.scenes[0].nouveau ? ' <em class="bsf-new">Nouveau</em>' : '') + '</span><span class="bsf-is">' + esc(tt.scenes[0].captions[0]) + '</span></span></button>';
          }).join('') + '</div></div>' :
        '<div class="bsf-meta"><div class="min-w-0"><div class="bsf-kick">Module ' + (ui.idx + 1) + ' sur ' + MODULES.length + ' · <span class="bsf-dur"></span></div><h2 class="bsf-title">' + esc(m.t) + '</h2><p class="bsf-sub">' + esc(m.s) + '</p></div>' +
        '<div class="bsf-actions">' + (seen.indexOf(m.f) < 0 ? '<button type="button" class="btn btn-ghost btn-sm" data-act="seen">' + ic('check', 15) + ' Marquer comme vu</button>' : '') +
        '<button type="button" class="btn btn-secondary btn-sm" data-act="quiz">' + ic('sparkles', 15) + ' Quiz' + (quiz[m.f] != null ? ' · ' + quiz[m.f] + '/3' : '') + '</button>' +
        (ui.idx < MODULES.length - 1 ? '<button type="button" class="btn btn-primary btn-sm" data-act="next">Module suivant ' + ic('arrow-right', 15) + '</button>' : '') + '</div></div></div>' +
        '<div class="card card-flush bsf-list">' + MODULES.map(function (mm, i) {
          var v = seen.indexOf(mm.f) >= 0;
          return '<button type="button" class="bsf-item' + (i === ui.idx ? ' active' : '') + (v ? ' done' : '') + '" data-mod="' + i + '"><span class="bsf-inum">' + (v ? ic('check', 15) : i + 1) + '</span>' +
            '<span class="bsf-itxt"><span class="bsf-it">' + esc(mm.t) + '</span><span class="bsf-is">' + esc(mm.s) + (quiz[mm.f] != null ? ' · quiz ' + quiz[mm.f] + '/3' : '') + '</span></span>' + (i === ui.idx ? ic('play', 15) : '') + '</button>';
        }).join('') + '</div></div>') + teamHtml() + voixHtml();
      if (T) filtrer();
      precharger(m);
      var screen = root.querySelector('.bsf-screen');
      fit(screen);
      player = curPlayer = Player(screen, m, {
        onTime: function (t, total, sc) {
          var p = total ? t / total : 0;
          var fill = root.querySelector('.bsf-scrub-fill'), knob = root.querySelector('.bsf-scrub-knob'), tm = root.querySelector('.bsf-time');
          if (fill) fill.style.width = (p * 100) + '%';
          if (knob) knob.style.left = (p * 100) + '%';
          if (tm) tm.textContent = fmtTime(t) + ' / ' + fmtTime(total);
          var scr = root.querySelector('.bsf-screen'); if (scr) scr.classList.toggle('started', t > 0 && t < total);
          Array.prototype.forEach.call(root.querySelectorAll('.bsf-scrub-chap i'), function (c, k) { c.classList.toggle('on', k <= sc); });
        },
        onState: function (on) {
          var b = root.querySelector('[data-act="toggle"]'); if (b) b.innerHTML = on ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>' : ic('play', 18);
          root.querySelector('.bsf-screen').classList.toggle('playing', on);
        },
        onEnd: function () { if (T) return; markSeen(m.f); openQuiz(true); },
      });
      root.querySelector('.bsf-dur').textContent = fmtTime(player.total);
      root.querySelector('.bsf-scrub-chap').innerHTML = player.starts.map(function (s, i) {
        return '<i style="left:' + (s / player.total * 100) + '%" title="' + esc(m.scenes[i].captions[0]) + '"></i>';
      }).join('');
      if (ui.quiz) showQuiz(); else if (ui.cert) showCert();
    }
    function filtrer() {
      var inp = root.querySelector('.bsf-tsearch input'); if (!inp) return;
      var q = (ui.q || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), vis = {};
      Array.prototype.forEach.call(root.querySelectorAll('.bsf-titem'), function (b) {
        var tt = TUTOS[+b.getAttribute('data-tuto')], txt = (tt.t + ' ' + tt.s + ' ' + tt.scenes[0].captions.join(' ')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        var ok = !q || txt.indexOf(q) >= 0; b.hidden = !ok; if (ok) vis[tt.mod] = 1;
      });
      Array.prototype.forEach.call(root.querySelectorAll('.bsf-tgroup'), function (g) { g.hidden = !vis[g.getAttribute('data-g')]; });
    }
    // Les captures du module se chargent à l'avance : pas d'écran vide pendant la lecture.
    function precharger(m) {
      m.scenes.forEach(function (sc) { (sc.ecrans || []).forEach(function (id) { var im = new Image(); im.src = ecranUrl(id); }); });
    }
    function fit(screen) {
      var stage = screen.querySelector('.bsf-stage');
      var apply = function () { var w = screen.clientWidth || 800; stage.style.transform = 'scale(' + (w / W) + ')'; };
      apply();
      if (resizeObs) resizeObs.disconnect();
      if (window.ResizeObserver) { resizeObs = new ResizeObserver(apply); resizeObs.observe(screen); }
      else window.addEventListener('resize', apply);
    }
    // ---------------- voix off ElevenLabs (administrateurs) : clé, choix de la voix, crédits, génération
    var vx = { etat: null, liste: null, auto: false, poll: 0, msg: '' };
    function phrases() {
      var vu = {}, out = [];
      MODULES.forEach(function (m) { m.scenes.forEach(function (sc) { sc.captions.forEach(function (c) { var h = hashCap(c); if (!vu[h]) { vu[h] = 1; out.push({ h: h, t: c }); } }); }); });
      return out;
    }
    function voixHtml() {
      var e = vx.etat;
      if (!SERVER || !e || !e.admin) return '';
      var tot = phrases().length, n = Math.min(tot, e.generees || 0), tr = e.travail || {};
      var body;
      if (!e.cle) {
        body = '<p class="bsf-vx-p">Collez votre clé ElevenLabs (elevenlabs.io › Developers › API Keys) : chaque phrase de la formation est lue une fois par une voix réaliste, puis gardée par le serveur pour toute l’équipe.</p>' +
          '<div class="bsf-vx-row"><input type="password" class="input" data-vx="cle" placeholder="Clé ElevenLabs" autocomplete="off" aria-label="Clé ElevenLabs"><button type="button" class="btn btn-primary btn-sm" data-act="vx-cle">Brancher</button></div>';
      } else {
        var cr = e.credits, opts = (vx.liste || []).map(function (v) {
          return '<option value="' + esc(v.id) + '"' + (e.voix && e.voix.voix === v.id ? ' selected' : '') + '>' + esc(v.nom) + (v.langue || v.accent ? ' · ' + esc(v.langue || v.accent) : '') + (v.genre ? ' · ' + esc(v.genre) : '') + '</option>';
        }).join('');
        body = '<div class="bsf-vx-row"><label class="bsf-vx-l">Voix</label><select class="input" data-vx="voix" aria-label="Voix de la formation">' + (opts || '<option>' + esc(e.voix && e.voix.nom || 'Chargement…') + '</option>') + '</select>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-act="vx-ecouter">' + ic('play', 14) + ' Écouter</button></div>' +
          '<div class="bsf-vx-prog"><span><b>' + n + ' / ' + tot + '</b> phrases lues par ElevenLabs' + (tr.reste ? ' · ' + tr.reste + ' en cours…' : '') + '</span><span class="bsf-pbar"><i style="width:' + Math.round(n / Math.max(1, tot) * 100) + '%"></i></span></div>' +
          (cr ? '<p class="bsf-vx-p">Crédits du mois : ' + Number(cr.utilises).toLocaleString('fr-FR') + ' / ' + Number(cr.limite).toLocaleString('fr-FR') + ' (plan ' + esc(cr.plan || '?') + ')' + (cr.renouvellement ? ', renouvelés le ' + new Date(cr.renouvellement * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : '') + '. Modèle ' + esc(e.modele) + '.</p>' : e.creditsErreur ? '<p class="bsf-vx-p err">' + esc(e.creditsErreur) + '</p>' : '') +
          (tr.erreur ? '<p class="bsf-vx-p err">' + esc(tr.erreur) + '</p>' : '') +
          '<div class="bsf-vx-row">' + (n < tot && !tr.reste ? '<button type="button" class="btn btn-primary btn-sm" data-act="vx-generer">' + ic('mic', 14) + (tr.erreur ? ' Reprendre' : ' Générer les voix manquantes') + '</button>' : '') +
          (e.source === 'crm' ? '<button type="button" class="btn btn-ghost btn-sm" data-act="vx-retirer">Retirer la clé</button>' : '') + '</div>';
      }
      return '<section class="card bsf-vx-card"><header class="card-head"><div class="card-title-wrap"><span class="card-icon">' + ic('mic', 16) + '</span><div><h3 class="card-title">Voix off ElevenLabs</h3><p class="card-sub">Une voix réaliste pour toute la formation (visible par les administrateurs).</p></div></div></header>' +
        body + (vx.msg ? '<p class="bsf-vx-p">' + esc(vx.msg) + '</p>' : '') + '</section>';
    }
    function majVoix() {
      var old = root.querySelector('.bsf-vx-card'), html = voixHtml();
      if (old) { var tmp = document.createElement('div'); tmp.innerHTML = html; if (tmp.firstChild) old.replaceWith(tmp.firstChild); else old.remove(); }
      else if (html) root.insertAdjacentHTML('beforeend', html);
    }
    function lireIndex() { return api('GET', '/api/formation/voix/index').then(function (b) { window.BS_VOIX_11 = b.voix || {}; }); }
    function etatVoix() {
      if (!SERVER) return;
      api('GET', '/api/formation/voix/etat').then(function (e) {
        var avant = vx.etat && vx.etat.generees;
        vx.etat = e;
        if (!root.isConnected) return;
        if (e.admin && e.cle && !vx.liste) api('GET', '/api/formation/voix/voix').then(function (b) { vx.liste = b.voix; majVoix(); }).catch(function () {});
        // Les voix manquantes partent toutes seules à la génération, une fois par visite.
        if (e.admin && e.cle && !vx.auto && !e.travail.erreur && e.generees < phrases().length) { vx.auto = true; generer(false); }
        if (avant != null && e.generees !== avant) lireIndex().catch(function () {});
        clearTimeout(vx.poll);
        if (e.travail && e.travail.reste) vx.poll = setTimeout(etatVoix, 4000);
        majVoix();
      }).catch(function () {});
    }
    function generer(reprendre) {
      api('POST', '/api/formation/voix/generer', { phrases: phrases(), reprendre: !!reprendre }).then(function () { vx.msg = ''; setTimeout(etatVoix, 1200); })
        .catch(function () { vx.msg = 'La génération n’a pas pu démarrer.'; majVoix(); });
    }
    function apiErr(method, path, body) {
      var h = { 'X-Requested-With': 'blackstart', 'Content-Type': 'application/json' };
      return fetch(path, { method: method, credentials: 'same-origin', headers: h, body: body ? JSON.stringify(body) : undefined })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { if (!r.ok) throw new Error(b.error || 'HTTP ' + r.status); return b; }); });
    }
    function teamHtml() {
      if (!SERVER || !team) return '';
      return '<section class="card bsf-team-card"><header class="card-head"><div class="card-title-wrap"><span class="card-icon">' + ic('users', 16) + '</span><div><h3 class="card-title">Suivi de l’équipe</h3><p class="card-sub">Modules vus et score aux quiz, par membre (visible par les administrateurs).</p></div></div></header>' +
        '<div class="table-wrap"><table class="table"><thead><tr><th>Membre</th>' + MODULES.map(function (m, i) { return '<th title="' + esc(m.t) + '" style="text-align:center">' + (i + 1) + '</th>'; }).join('') + '<th>Total</th></tr></thead><tbody>' +
        team.map(function (u) {
          var n = 0;
          return '<tr><td><b>' + esc(u.name) + '</b></td>' + MODULES.map(function (m) {
            var x = (u.modules || {})[m.f]; if (x && x.vu) n++;
            return '<td style="text-align:center">' + (x && x.vu ? '<span class="bsf-tv">' + ic('check', 13) + (x.quiz != null ? '<em>' + x.quiz + '/3</em>' : '') + '</span>' : '<span class="bsf-tn">·</span>') + '</td>';
          }).join('') + '<td><b>' + n + ' / ' + MODULES.length + '</b></td></tr>';
        }).join('') + '</tbody></table></div></section>';
    }

    // ---------------- quiz
    function openQuiz(auto) { if (player) player.pause(); ui.quiz = { i: 0, score: 0, picked: null, auto: !!auto }; showQuiz(); }
    function showQuiz() {
      var m = MODULES[ui.idx], q = ui.quiz, over = root.querySelector('.bsf-over');
      over.classList.add('on');
      if (q.i >= m.quiz.length) {
        saveQuiz(m.f, q.score);
        var perfect = q.score === m.quiz.length;
        over.innerHTML = '<div class="bsf-quiz end"><div class="bsf-score' + (perfect ? ' ok' : '') + '">' + q.score + '<small>/' + m.quiz.length + '</small></div><h3>' + (perfect ? 'Parfait !' : q.score >= 2 ? 'Bien joué !' : 'À revoir un peu') + '</h3>' +
          '<p>' + (perfect ? 'Vous maîtrisez ce module.' : 'Revoyez les passages utiles : la barre de progression permet de sauter à chaque chapitre.') + '</p><div class="bsf-qa">' +
          '<button type="button" class="btn btn-ghost btn-md" data-act="replay">' + ic('play', 15) + ' Revoir le module</button>' +
          (ui.idx < MODULES.length - 1 ? '<button type="button" class="btn btn-primary btn-md" data-act="next">Module suivant ' + ic('arrow-right', 15) + '</button>' : nbSeen() === MODULES.length ? '<button type="button" class="btn btn-primary btn-md" data-act="cert">' + ic('award', 15) + ' Mon certificat</button>' : '<button type="button" class="btn btn-primary btn-md" data-act="close">Fermer</button>') + '</div></div>';
        burst(over, perfect);
        return;
      }
      var Q = m.quiz[q.i];
      over.innerHTML = '<div class="bsf-quiz"><div class="bsf-qh"><span>Quiz · question ' + (q.i + 1) + ' sur ' + m.quiz.length + '</span><button type="button" data-act="close" aria-label="Fermer">×</button></div><h3>' + esc(Q[0]) + '</h3>' +
        '<div class="bsf-opts">' + Q[1].map(function (o, k) {
          var cls = q.picked == null ? '' : k === Q[2] ? ' good' : k === q.picked ? ' bad' : ' dim';
          return '<button type="button" class="bsf-opt' + cls + '" data-opt="' + k + '"' + (q.picked != null ? ' disabled' : '') + '><span>' + 'ABC'[k] + '</span>' + esc(o) + '</button>';
        }).join('') + '</div>' + (q.picked != null ? '<div class="bsf-qa"><button type="button" class="btn btn-primary btn-md" data-act="qnext">' + (q.i + 1 < m.quiz.length ? 'Question suivante' : 'Voir mon score') + '</button></div>' : '') + '</div>';
    }
    function burst(over, big) {
      for (var i = 0; i < (big ? 40 : 14); i++) {
        var c = document.createElement('i'); c.className = 'bsf-conf';
        c.style.cssText = 'left:50%;top:38%;background:' + [C.acc, C.green, C.amber, C.rose, C.violet, C.cyan][i % 6];
        over.appendChild(c);
        if (c.animate) c.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: 'translate(' + (Math.random() * 600 - 300) + 'px,' + (Math.random() * 360 - 60) + 'px) rotate(' + (Math.random() * 720) + 'deg)', opacity: 0 }], { duration: 1200 + Math.random() * 800, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
      }
    }
    // ---------------- certificat
    function showCert() {
      if (player) player.pause();
      var over = root.querySelector('.bsf-over');
      over.classList.add('on');
      var name = (window.bsEquipe && window.bsEquipe.utilisateur && window.bsEquipe.utilisateur() || {}).name ||
        (window.__bsStore && (window.__bsStore.get().companyInfo || {}).expediteur) || '';
      var avg = MODULES.reduce(function (s, m) { return s + (quiz[m.f] || 0); }, 0);
      over.innerHTML = '<div class="bsf-cert"><div class="bsf-cert-in"><span class="bsf-cert-k">Certificat de formation</span><h3>Blackstart CRM</h3><p>décerné à</p><div class="bsf-cert-n">' + esc(name || 'vous') + '</div>' +
        '<p>pour avoir suivi les ' + MODULES.length + ' modules de formation · quiz : ' + avg + ' / ' + (MODULES.length * 3) + '</p><em>' + new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) + '</em></div>' +
        '<div class="bsf-qa"><button type="button" class="btn btn-ghost btn-md" data-act="close">Fermer</button><button type="button" class="btn btn-primary btn-md" data-act="print">' + ic('printer', 15) + ' Imprimer</button></div></div>';
      burst(over, true);
    }
    function closeOver() { ui.quiz = null; ui.cert = false; var o = root.querySelector('.bsf-over'); if (o) { o.classList.remove('on'); o.innerHTML = ''; } }

    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-act],[data-mod],[data-opt],[data-mode],[data-tuto]');
      if (!t && e.target.closest('.bsf-stage') && player) { player.toggle(); return; }
      if (!t || t.disabled) return;
      if (t.hasAttribute('data-mode')) { ui.mode = t.getAttribute('data-mode'); closeOver(); render(); return; }
      if (t.hasAttribute('data-tuto')) { ui.tidx = +t.getAttribute('data-tuto'); render(); player.play(); try { root.querySelector('.bsf-player').scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (er) {} return; }
      if (t.hasAttribute('data-mod')) { ui.idx = +t.getAttribute('data-mod'); closeOver(); render(); try { root.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (er) {} return; }
      if (t.hasAttribute('data-opt')) { var q = ui.quiz, Q = MODULES[ui.idx].quiz[q.i]; q.picked = +t.getAttribute('data-opt'); if (q.picked === Q[2]) q.score++; showQuiz(); return; }
      var act = t.getAttribute('data-act');
      if (act === 'play' || act === 'toggle') { player.toggle(); root.querySelector('.bsf-screen').focus(); }
      else if (act === 'speed') { var sp = [1, 1.25, 1.5, .75]; prefs.vit = sp[(sp.indexOf(prefs.vit) + 1) % sp.length]; writeJson(PREF_KEY, prefs); t.textContent = prefs.vit + '×'; }
      else if (act === 'st') { prefs.st = !prefs.st; writeJson(PREF_KEY, prefs); t.classList.toggle('on', prefs.st); player.refreshCaption(); }
      else if (act === 'voix') {
        prefs.voix = !prefs.voix; writeJson(PREF_KEY, prefs); t.classList.toggle('on', prefs.voix);
        if (!prefs.voix) player.stopVoice(); else player.refreshCaption();
      }
      else if (act === 'musique') { prefs.musique = !prefs.musique; writeJson(PREF_KEY, prefs); t.classList.toggle('on', prefs.musique); player.musique(prefs.musique); }
      else if (act === 'full') { var sc = root.querySelector('.bsf-player'); if (document.fullscreenElement) document.exitFullscreen(); else if (sc.requestFullscreen) sc.requestFullscreen().catch(function () {}); }
      else if (act === 'seen') { markSeen(MODULES[ui.idx].f); render(); }
      else if (act === 'next' && tutos()) { ui.tidx = Math.min(TUTOS.length - 1, ui.tidx + 1); render(); player.play(); }
      else if (act === 'module') { ui.mode = 'formation'; ui.idx = TUTOS[ui.tidx].mod; render(); }
      else if (act === 'next') { markSeen(MODULES[ui.idx].f); ui.idx = Math.min(MODULES.length - 1, ui.idx + 1); closeOver(); render(); player.play(); }
      else if (act === 'quiz') openQuiz(false);
      else if (act === 'qnext') { ui.quiz.i++; ui.quiz.picked = null; showQuiz(); }
      else if (act === 'replay') { closeOver(); render(); player.play(); }
      else if (act === 'close') { closeOver(); render(); }
      else if (act === 'cert') { ui.cert = true; ui.quiz = null; showCert(); }
      else if (act === 'print') printCert();
      else if (act === 'vx-cle') {
        var inp = root.querySelector('[data-vx="cle"]'); vx.msg = 'Vérification de la clé…'; majVoix();
        apiErr('PUT', '/api/formation/voix/cle', { cle: inp ? inp.value : '' }).then(function () { vx.msg = ''; vx.liste = null; vx.auto = false; etatVoix(); })
          .catch(function (er) { vx.msg = er.message; majVoix(); });
      }
      else if (act === 'vx-retirer') { apiErr('DELETE', '/api/formation/voix/cle').then(function () { vx.liste = null; etatVoix(); }).catch(function () {}); }
      else if (act === 'vx-generer') generer(true);
      else if (act === 'vx-ecouter') {
        var sel = root.querySelector('[data-vx="voix"]'); if (!sel || !sel.value) return;
        vx.msg = 'Lecture d’un court essai…'; majVoix();
        fetch('/api/formation/voix/echantillon', { method: 'POST', credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart', 'Content-Type': 'application/json' }, body: JSON.stringify({ voix: sel.value }) })
          .then(function (r) { if (!r.ok) return r.json().then(function (b) { throw new Error(b.error); }); return r.blob(); })
          .then(function (b) { vx.msg = ''; majVoix(); new Audio(URL.createObjectURL(b)).play().catch(function () {}); })
          .catch(function (er) { vx.msg = er.message || 'Essai impossible.'; majVoix(); });
      }
    });
    // Barre de progression : clic ou glisser pour se déplacer.
    root.addEventListener('pointerdown', function (e) {
      var bar = e.target.closest('.bsf-scrub'); if (!bar) return;
      var go = function (ev) { var r = bar.getBoundingClientRect(); player.seek(Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * player.total); };
      go(e); bar.setPointerCapture && bar.setPointerCapture(e.pointerId);
      var mv = function (ev) { go(ev); }, up = function () { bar.removeEventListener('pointermove', mv); bar.removeEventListener('pointerup', up); };
      bar.addEventListener('pointermove', mv); bar.addEventListener('pointerup', up);
    });
    root.addEventListener('input', function (e) { if (e.target.closest('.bsf-tsearch')) { ui.q = e.target.value; filtrer(); } });
    // Nouvelle voix choisie : les phrases seront relues avec elle.
    root.addEventListener('change', function (e) {
      var sel = e.target.closest('[data-vx="voix"]'); if (!sel) return;
      var v = (vx.liste || []).filter(function (x) { return x.id === sel.value; })[0];
      apiErr('PUT', '/api/formation/voix/reglage', { voix: sel.value, nom: v ? v.nom : '' }).then(function () { window.BS_VOIX_11 = {}; vx.auto = false; etatVoix(); })
        .catch(function (er) { vx.msg = er.message; majVoix(); });
    });
    root.addEventListener('keydown', function (e) {
      if (!e.target.closest || !e.target.closest('.bsf-player') || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      var k = e.key;
      if (k === ' ' || k === 'k') { e.preventDefault(); player.toggle(); }
      else if (k === 'ArrowRight') { e.preventDefault(); player.seek(player.t + 5000); }
      else if (k === 'ArrowLeft') { e.preventDefault(); player.seek(player.t - 5000); }
      else if (k === 'f' || k === 'F') root.querySelector('[data-act="full"]').click();
      else if (k === 'c' || k === 'C') root.querySelector('[data-act="st"]').click();
      else if (k === 'v' || k === 'V') root.querySelector('[data-act="voix"]').click();
      else if (k === 'm' || k === 'M') root.querySelector('[data-act="musique"]').click();
    });
    // On quitte la page : le film s'arrête.
    var mo = new MutationObserver(function () { if (!root.isConnected) { if (player) player.destroy(); if (resizeObs) resizeObs.disconnect(); mo.disconnect(); } });
    mo.observe(document.body, { childList: true, subtree: true });
    render();
    loadServer(function () { if (root.isConnected && !(player && player.playing)) render(); });
    // Voix ElevenLabs déjà lues : les durées des scènes suivent ces fichiers, donc on recompose le lecteur.
    if (SERVER) lireIndex().then(function () { if (root.isConnected && !(player && player.playing) && Object.keys(window.BS_VOIX_11).length) render(); etatVoix(); }).catch(etatVoix);
  }

  var curPlayer = null;
  function printCert() {
    var c = document.querySelector('.bsf-cert-in'); if (!c) return;
    var w = window.open('', '_blank');
    if (!w) return;
    w.document.write('<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Certificat Blackstart CRM</title><style>' + CERT_CSS + '</style></head><body>' + c.outerHTML + '<script>setTimeout(function(){print()},300)<\/script></body></html>');
    w.document.close();
  }

  // ================================================================== styles
  var CERT_CSS = 'body{margin:0;display:grid;place-items:center;min-height:100vh;font-family:Inter,system-ui,sans-serif;background:#fff}.bsf-cert-in{width:760px;padding:56px;border:3px double #1d4ed8;border-radius:18px;text-align:center;color:#0b1220}.bsf-cert-k{letter-spacing:.3em;text-transform:uppercase;font-size:12px;color:#1d4ed8;font-weight:800}.bsf-cert-in h3{font-size:40px;margin:14px 0}.bsf-cert-n{font-size:34px;font-weight:800;margin:10px 0 16px;color:#1d4ed8}.bsf-cert-in p{color:#334155}.bsf-cert-in em{display:block;margin-top:24px;color:#64748b}';
  var CSS = [
    '.bsf-progress{display:flex;align-items:center;gap:10px;font-size:.9em;color:var(--text-2);flex-wrap:wrap}',
    '.bsf-pbar{display:inline-block;width:110px;height:7px;border-radius:99px;background:var(--surface-3);overflow:hidden}',
    '.bsf-pbar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--accent),#22d3ee);transition:width .6s}',
    '.bsf-layout{display:grid;gap:16px;grid-template-columns:minmax(0,1fr);margin-top:4px}',
    '@media (min-width:1150px){.bsf-layout{grid-template-columns:minmax(0,1fr) 330px;align-items:start}}',
    '.bsf-player{padding:0;overflow:hidden}',
    '.bsf-player:fullscreen{display:flex;flex-direction:column;justify-content:center;background:#05080f;border-radius:0}',
    '.bsf-player:fullscreen .bsf-meta{display:none}',
    '.bsf-screen{position:relative;aspect-ratio:16/9;overflow:hidden;background:#060b16;outline:none;cursor:pointer;user-select:none}',
    '.bsf-player:fullscreen .bsf-screen{max-height:calc(100vh - 60px);width:min(100vw,calc((100vh - 60px)*16/9));margin:0 auto}',
    '.bsf-stage{position:absolute;left:0;top:0;width:1280px;height:720px;transform-origin:0 0;overflow:hidden;font-family:Inter,system-ui,sans-serif;color:' + C.text + ';background:radial-gradient(120% 100% at 50% 0%,#12213b,#0a1220 55%,#060b16)}',
    '.bsf-bgfx{position:absolute;inset:0;--bsf-t:0}',
    '.bsf-bgfx i{position:absolute;border-radius:50%;filter:blur(60px);opacity:.35}',
    '.bsf-bgfx i:nth-child(1){width:520px;height:520px;left:-120px;top:-160px;background:#1d4ed8;transform:translate(calc(sin(var(--bsf-t)*.3rad)*60px),calc(cos(var(--bsf-t)*.25rad)*40px))}',
    '.bsf-bgfx i:nth-child(2){width:460px;height:460px;right:-120px;bottom:-140px;background:#7c3aed;opacity:.22;transform:translate(calc(cos(var(--bsf-t)*.22rad)*50px),calc(sin(var(--bsf-t)*.3rad)*40px))}',
    '.bsf-bgfx i:nth-child(3){width:300px;height:300px;left:55%;top:40%;background:#0891b2;opacity:.16;transform:translate(calc(sin(var(--bsf-t)*.4rad)*80px),0)}',
    '.bsf-layer{position:absolute;inset:0}',
    '.bsf-el{position:absolute;box-sizing:border-box}',
    // sous-titres
    '.bsf-cap{position:absolute;left:50%;bottom:4.5%;transform:translate(-50%,8px);max-width:82%;padding:.55em 1.1em;border-radius:12px;background:rgb(3 7 15/.78);color:#fff;font-size:clamp(12px,1.7vw,19px);font-weight:600;line-height:1.35;text-align:center;opacity:0;transition:opacity .3s,transform .3s;pointer-events:none;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}',
    '.bsf-cap.on{opacity:1;transform:translate(-50%,0)}',
    '.bsf-bigplay{position:absolute;left:50%;top:50%;width:84px;height:84px;margin:-42px 0 0 -42px;border-radius:50%;border:0;display:grid;place-items:center;background:rgb(59 130 246/.92);box-shadow:0 0 0 10px rgb(59 130 246/.2),0 20px 40px -10px rgb(0 0 0/.6);cursor:pointer;transition:opacity .3s,transform .3s;padding-left:6px}',
    '.bsf-bigplay:hover{transform:scale(1.06)}',
    '.bsf-screen.playing .bsf-bigplay,.bsf-screen.started .bsf-bigplay{opacity:0;pointer-events:none;transform:scale(.8)}',
    // contrôles
    '.bsf-ctrl{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--border);background:rgb(var(--text-rgb)/.02)}',
    '.bsf-player:fullscreen .bsf-ctrl{background:#0b1220;border:0}',
    '.bsf-cb-btn{min-width:34px;height:34px;border-radius:9px;border:1px solid transparent;background:transparent;color:var(--text);display:grid;place-items:center;cursor:pointer;font:inherit;font-size:12.5px;font-weight:700;padding:0 6px}',
    '.bsf-cb-btn:hover{background:rgb(var(--text-rgb)/.08)}',
    '.bsf-cb-btn.on{color:rgb(var(--accent-rgb));background:rgb(var(--accent-rgb)/.14)}',
    '.bsf-time{font-size:12.5px;color:var(--text-2);font-variant-numeric:tabular-nums;min-width:86px}',
    '.bsf-scrub{position:relative;flex:1;height:22px;cursor:pointer;touch-action:none}',
    '.bsf-scrub::before{content:"";position:absolute;left:0;right:0;top:9px;height:4px;border-radius:99px;background:rgb(var(--text-rgb)/.14)}',
    '.bsf-scrub-fill{position:absolute;left:0;top:9px;height:4px;border-radius:99px;background:linear-gradient(90deg,var(--accent),#22d3ee)}',
    '.bsf-scrub-chap i{position:absolute;top:6px;width:2px;height:10px;margin-left:-1px;border-radius:2px;background:rgb(var(--text-rgb)/.35)}',
    '.bsf-scrub-chap i.on{background:#fff}',
    '.bsf-scrub-knob{position:absolute;top:4px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px rgb(var(--accent-rgb)/.35)}',
    '.bsf-meta{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start;justify-content:space-between;padding:16px 18px 18px}',
    '.bsf-kick{font-size:.78em;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--accent-text,var(--text-2))}',
    '.bsf-title{margin:4px 0;font-size:1.25em}',
    '.bsf-sub{margin:0;color:var(--text-2);font-size:.92em}',
    '.bsf-actions{display:flex;gap:8px;flex-wrap:wrap}',
    '.bsf-list{display:flex;flex-direction:column;padding:6px}',
    '.bsf-modes{display:inline-flex;gap:2px;padding:3px;border-radius:12px;background:var(--surface-2);border:1px solid var(--border)}',
    '.bsf-modes button{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border:0;border-radius:9px;background:none;color:var(--text-2);font:inherit;font-size:.88em;font-weight:600;cursor:pointer;white-space:nowrap}',
    '.bsf-modes button.active{background:var(--surface);color:var(--text);box-shadow:0 1px 3px rgb(0 0 0/.18)}',
    '.bsf-tsearch{padding:6px 6px 8px;position:sticky;top:0;z-index:1;background:inherit}.bsf-tsearch input{width:100%}',
    '.bsf-tgroup{padding:12px 10px 4px;font-size:.72em;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3)}',
    '.bsf-titem .bsf-is{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}',
    '.bsf-titem[hidden],.bsf-tgroup[hidden]{display:none}',
    '.bsf-new{font-style:normal;font-size:.72em;font-weight:700;padding:1px 6px;border-radius:6px;background:rgba(16,185,129,.16);color:#10b981;margin-left:4px;vertical-align:1px}',
    '.bsf-tlist{max-height:560px;overflow:auto}@media (min-width:1150px){.bsf-tlist{max-height:calc(100vh - 150px);position:sticky;top:12px}}',
    '.bsf-item{display:flex;align-items:center;gap:12px;width:100%;padding:10px;border-radius:12px;text-align:left;color:var(--text);background:none;border:0;cursor:pointer;font:inherit;transition:background .2s}',
    '.bsf-item:hover{background:var(--surface-2)}',
    '.bsf-item.active{background:var(--accent-soft)}',
    '.bsf-inum{flex-shrink:0;width:30px;height:30px;border-radius:9px;display:grid;place-items:center;font-weight:800;font-size:.85em;background:var(--surface-3);color:var(--text-2)}',
    '.bsf-item.active .bsf-inum{background:var(--accent);color:#fff}',
    '.bsf-item.done .bsf-inum{background:rgba(16,185,129,.18);color:#10b981}',
    '.bsf-itxt{display:flex;flex-direction:column;flex:1;min-width:0}',
    '.bsf-it{font-weight:650;font-size:.92em;line-height:1.3}',
    '.bsf-is{font-size:.78em;color:var(--text-3)}',
    '.bsf-team-card{margin-top:16px}',
    '.bsf-vx-card{margin-top:16px;display:flex;flex-direction:column;gap:10px}',
    '.bsf-vx-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:0 18px}',
    '.bsf-vx-row .input{flex:1 1 220px;max-width:420px}',
    '.bsf-vx-l{font-size:13px;color:var(--text-2);min-width:42px}',
    '.bsf-vx-p{margin:0;padding:0 18px;font-size:13px;color:var(--text-2)}',
    '.bsf-vx-p.err{color:#f87171}',
    '.bsf-vx-prog{display:flex;flex-wrap:wrap;align-items:center;gap:10px;padding:0 18px;font-size:13px}',
    '.bsf-vx-card>:last-child{margin-bottom:16px}',
    '.bsf-tv{display:inline-flex;align-items:center;gap:3px;color:#10b981}',
    '.bsf-tv em{font-style:normal;font-size:11px;color:var(--text-3)}',
    '.bsf-tn{color:var(--text-3)}',
    // quiz, certificat
    '.bsf-over{position:absolute;inset:0;display:none;place-items:center;background:rgb(4 8 18/.78);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);overflow:hidden;cursor:default}',
    '.bsf-over.on{display:grid;animation:bsfIn .35s ease}',
    '@keyframes bsfIn{from{opacity:0}}',
    '.bsf-quiz,.bsf-cert{width:min(560px,88%);padding:22px 24px;border-radius:18px;background:rgb(15 27 46/.96);border:1px solid rgb(148 163 184/.2);color:#eaf1fb;box-shadow:0 30px 70px -20px #000;animation:bsfPop .45s cubic-bezier(.34,1.56,.64,1)}',
    '@keyframes bsfPop{from{transform:scale(.9);opacity:0}}',
    '.bsf-qh{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#93c5fd}',
    '.bsf-qh button{border:0;background:none;color:#a9bfdd;font-size:22px;cursor:pointer;line-height:1}',
    '.bsf-quiz h3{font-size:clamp(15px,2vw,20px);margin:10px 0 14px;line-height:1.35}',
    '.bsf-opts{display:grid;gap:8px}',
    '.bsf-opt{display:flex;align-items:center;gap:10px;text-align:left;padding:11px 12px;border-radius:12px;border:1px solid rgb(148 163 184/.22);background:rgb(255 255 255/.04);color:#eaf1fb;font:inherit;font-size:14px;cursor:pointer;transition:background .2s,border-color .2s,transform .2s}',
    '.bsf-opt:hover:not(:disabled){background:rgb(59 130 246/.16);border-color:rgb(59 130 246/.6);transform:translateX(3px)}',
    '.bsf-opt span{width:24px;height:24px;flex:none;border-radius:7px;display:grid;place-items:center;font-size:12px;font-weight:800;background:rgb(255 255 255/.08)}',
    '.bsf-opt.good{background:rgb(16 185 129/.2);border-color:#10b981}',
    '.bsf-opt.good span{background:#10b981}',
    '.bsf-opt.bad{background:rgb(244 63 94/.18);border-color:#f43f5e;animation:bsfShake .4s}',
    '.bsf-opt.dim{opacity:.5}',
    '@keyframes bsfShake{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}',
    '.bsf-qa{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:16px}',
    '.bsf-quiz.end{text-align:center}',
    '.bsf-quiz.end .bsf-qa{justify-content:center}',
    '.bsf-score{width:96px;height:96px;margin:4px auto 8px;border-radius:50%;display:grid;place-items:center;font-size:40px;font-weight:800;border:4px solid #f59e0b;color:#fbbf24}',
    '.bsf-score.ok{border-color:#10b981;color:#34d399}',
    '.bsf-score small{font-size:16px;margin-left:2px}',
    '.bsf-quiz.end p{color:#a9bfdd;margin:4px 0 0}',
    '.bsf-conf{position:absolute;width:9px;height:14px;border-radius:2px;pointer-events:none}',
    '.bsf-cert-in{padding:22px;border:2px solid rgb(96 165 250/.5);border-radius:14px;text-align:center;background:radial-gradient(100% 80% at 50% 0,rgb(59 130 246/.18),transparent)}',
    '.bsf-cert-k{font-size:11px;font-weight:800;letter-spacing:.3em;text-transform:uppercase;color:#93c5fd}',
    '.bsf-cert-in h3{font-size:clamp(20px,3vw,30px);margin:8px 0 4px}',
    '.bsf-cert-in p{color:#a9bfdd;margin:6px 0;font-size:13.5px}',
    '.bsf-cert-n{font-size:clamp(20px,3vw,30px);font-weight:800;background:linear-gradient(90deg,#60a5fa,#22d3ee);-webkit-background-clip:text;background-clip:text;color:transparent}',
    '.bsf-cert-in em{display:block;margin-top:10px;color:#7d93b5;font-size:12.5px}',
    // ----- éléments des scènes (dimensions en pixels de la scène 1280 × 720)
    '.bsf-stage svg{display:block}',
    '.bsf-orb{border-radius:50%;background:radial-gradient(circle,rgb(59 130 246/.35),transparent 65%)}',
    '.bsf-num{font:900 170px/1 Inter,system-ui,sans-serif;fill:#3b82f6;stroke:#93c5fd;stroke-width:2;stroke-dasharray:700;paint-order:stroke}',
    '.bsf-kicker{text-align:center;font-size:15px;font-weight:800;letter-spacing:.32em;text-transform:uppercase;color:#93c5fd}',
    '.bsf-bigtitle{text-align:center;font-size:56px;font-weight:800;letter-spacing:-.03em;line-height:1.1}',
    '.bsf-bigtitle span{display:inline-block}',
    '.bsf-line{border-radius:3px;background:linear-gradient(90deg,#3b82f6,#22d3ee)}',
    '.bsf-chips{display:flex;justify-content:center;gap:12px}',
    '.bsf-ex-kick{display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:99px;background:rgb(250 204 21/.12);border:1px solid rgb(250 204 21/.35);color:#fde68a;font-size:14px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}',
    '.bsf-ex-h{font-size:44px;font-weight:800;letter-spacing:-.02em;line-height:1.1}',
    '.bsf-ex-qui{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border-radius:26px;background:linear-gradient(160deg,rgb(255 255 255/.09),rgb(255 255 255/.02));border:1px solid rgb(148 163 184/.22);box-shadow:0 30px 60px -30px rgb(0 0 0/.7)}',
    '.bsf-ex-qui b{font-size:24px;margin-top:10px}',
    '.bsf-ex-qui span{font-size:15px;color:' + C.text2 + '}',
    '.bsf-ex-av{width:104px;height:104px;border-radius:30px;display:grid;place-items:center;font-size:38px;font-weight:800;color:#fff;box-shadow:0 18px 40px -12px rgb(59 130 246/.6)}',
    '.bsf-ex-dot{display:grid;place-items:center;border-radius:14px;box-shadow:0 10px 24px -8px rgb(0 0 0/.6)}',
    '.bsf-ex-card{display:flex;flex-direction:column;gap:3px;padding:12px 18px;border-radius:16px;background:rgb(255 255 255/.06);border:1px solid rgb(148 163 184/.2)}',
    '.bsf-ex-card em{font-style:normal;font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#93c5fd}',
    '.bsf-ex-card span{font-size:20px;font-weight:600;line-height:1.3}',
    '.bsf-ex-fin{display:flex;align-items:center;gap:12px;padding:16px 18px;border-radius:18px;background:linear-gradient(135deg,#34d399,#a3e635);color:#052e1b;font-size:19px;font-weight:800;box-shadow:0 20px 44px -16px rgb(52 211 153/.7)}',
    '.bsf-ex-spark{border-radius:50%}',
    '.bsf-chips span{padding:8px 16px;border-radius:99px;border:1px solid rgb(148 163 184/.25);background:rgb(255 255 255/.05);font-size:16px;font-weight:600;color:#cfe0f7}',
    '.bsf-recap-h{font-size:44px;font-weight:800;letter-spacing:-.02em}',
    '.bsf-recap{display:flex;align-items:center;gap:20px;font-size:26px;font-weight:600}',
    '.bsf-check{width:44px;height:44px;border-radius:50%;flex:none;display:grid;place-items:center;background:linear-gradient(135deg,#10b981,#059669);box-shadow:0 8px 20px -6px #10b981}',
    '.bsf-check path{stroke-dasharray:1}',
    '.bsf-next{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:700;color:#93c5fd;padding:12px 20px;border-radius:14px;background:rgb(59 130 246/.14);border:1px solid rgb(59 130 246/.4)}',
    // fenêtre du CRM
    '.bsf-win{border-radius:18px;background:#0c1729;border:1px solid rgb(148 163 184/.18);box-shadow:0 40px 90px -30px #000,inset 0 1px 0 rgb(255 255 255/.05);overflow:hidden}',
    '.bsf-side{position:absolute;left:0;top:0;bottom:0;width:200px;padding:14px 10px;background:#0a1322;border-right:1px solid rgb(148 163 184/.12)}',
    '.bsf-brand{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:800;letter-spacing:.03em;margin:0 4px 10px}',
    '.bsf-brand i{font-style:normal;color:#60a5fa}',
    '.bsf-bm{width:24px;height:24px;border-radius:7px;display:grid;place-items:center;background:linear-gradient(135deg,#3b82f6,#1d4ed8);font-size:13px}',
    '.bsf-nav{position:relative;display:flex;align-items:center;gap:9px;height:32px;padding:0 10px;margin-bottom:4px;border-radius:9px;color:#fff;font-size:13px;font-weight:600}',
    '.bsf-nav.on{background:rgb(59 130 246/.2)}',
    '.bsf-nav.on::before{content:"";position:absolute;left:-10px;top:7px;bottom:7px;width:3px;border-radius:0 3px 3px 0;background:#3b82f6;box-shadow:0 0 10px #3b82f6}',
    '.bsf-top{position:absolute;left:200px;right:0;top:0;height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;border-bottom:1px solid rgb(148 163 184/.12)}',
    '.bsf-search{display:flex;align-items:center;gap:8px;width:330px;height:32px;padding:0 10px;border-radius:9px;background:rgb(255 255 255/.05);border:1px solid rgb(148 163 184/.15);color:#7d93b5;font-size:13px}',
    '.bsf-search kbd{margin-left:auto;font:600 11px Inter;padding:2px 6px;border-radius:5px;border:1px solid rgb(148 163 184/.3)}',
    '.bsf-create{display:flex;align-items:center;gap:6px;height:32px;padding:0 14px;border-radius:9px;background:linear-gradient(180deg,#4a8be0,#3b82f6);font-size:13px;font-weight:700}',
    '.bsf-content{position:absolute;left:200px;top:52px;right:0;bottom:0}',
    '.bsf-h h3{margin:0;font-size:24px;letter-spacing:-.02em}',
    '.bsf-h p{margin:2px 0 0;color:#a9bfdd;font-size:13.5px}',
    '.bsf-card{border-radius:16px;background:linear-gradient(180deg,#13223a,#0f1b2e);border:1px solid rgb(148 163 184/.16);box-shadow:0 20px 40px -24px #000;padding:18px}',
    '.bsf-cardt{display:flex;align-items:center;gap:8px;font-size:16px;margin-bottom:12px}',
    '.bsf-kpi{border-radius:14px;padding:16px;background:linear-gradient(180deg,#14243d,#0f1b2e);border:1px solid rgb(148 163 184/.16);display:flex;flex-direction:column-reverse;justify-content:flex-end;gap:4px}',
    '.bsf-kpi b{font-size:36px;letter-spacing:-.03em}',
    '.bsf-kpi span{color:#a9bfdd;font-size:13px}',
    '.bsf-kpi.big{flex-direction:column}',
    '.bsf-kpi.big b{font-size:38px;order:3}',
    '.bsf-kic{width:34px;height:34px;border-radius:10px;display:grid;place-items:center}',
    '.bsf-row{display:flex;align-items:center;gap:14px;padding:0 14px;border-radius:12px;background:rgb(255 255 255/.035);border:1px solid rgb(148 163 184/.12);font-size:14px}',
    '.bsf-row b{flex:1;font-weight:650}',
    '.bsf-trow b{flex:1}',
    '.bsf-trow span:last-child{min-width:70px;color:#a9bfdd}',
    '.bsf-av{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;font-size:12px;font-weight:800;flex:none}',
    '.bsf-av.big{width:52px;height:52px;border-radius:14px;font-size:18px;background:#3b82f633;color:#93c5fd}',
    '.bsf-pill{padding:4px 10px;border-radius:99px;font-size:12px;font-weight:700}',
    '.bsf-callbtn{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:rgb(16 185 129/.18);color:#34d399}',
    '.bsf-goal{display:grid;grid-template-columns:90px 1fr 60px;align-items:center;gap:10px;margin-top:22px;font-size:13px;color:#a9bfdd}',
    '.bsf-goal i{height:8px;border-radius:99px;background:rgb(255 255 255/.08);overflow:hidden}',
    '.bsf-goal u{display:block;height:100%;border-radius:99px}',
    '.bsf-goal em{font-style:normal;font-weight:700;color:#fff;font-variant-numeric:tabular-nums}',
    '.bsf-focus{border-radius:12px;border:2px solid #60a5fa;box-shadow:0 0 0 6px rgb(96 165 250/.18),0 0 30px rgb(96 165 250/.5)}',
    '.bsf-focus.warn{border-color:#fbbf24;box-shadow:0 0 0 6px rgb(251 191 36/.16),0 0 30px rgb(251 191 36/.45)}',
    '.bsf-cursor{filter:drop-shadow(0 4px 6px rgb(0 0 0/.5))}',
    '.bsf-ripple{border-radius:50%;border:3px solid #fff;opacity:0}',
    // Scènes « vraie interface »
    '.bsf-browser{border-radius:14px;overflow:hidden;background:#0b1424;box-shadow:0 30px 80px -20px rgb(0 0 0/.75),0 0 0 1px rgb(148 163 184/.22),0 0 60px -10px rgb(59 130 246/.35)}',
    '.bsf-bbar{height:28px;display:flex;align-items:center;gap:7px;padding:0 12px;background:linear-gradient(#1b2840,#131e33);border-bottom:1px solid rgb(148 163 184/.16)}',
    '.bsf-bbar>i{width:10px;height:10px;border-radius:50%;background:#f87171}.bsf-bbar>i:nth-child(2){background:#fbbf24}.bsf-bbar>i:nth-child(3){background:#34d399}',
    '.bsf-bbar>span{margin:0 auto;display:flex;align-items:center;gap:6px;padding:3px 14px;border-radius:7px;background:rgb(2 6 23/.45);color:#a9bfdd;font:500 11px/1.2 Inter,system-ui,sans-serif;transform:translateX(-24px)}',
    '.bsf-bview{position:relative;overflow:hidden}',
    '.bsf-bcam{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform}',
    '.bsf-shot{position:absolute;left:0;top:0;width:100%;height:100%;display:block;user-select:none}',
    '.bsf-browser.phone{border-radius:38px;padding:10px;background:#05080f;box-shadow:0 30px 80px -20px rgb(0 0 0/.8),0 0 0 2px #2a3550,0 0 60px -10px rgb(59 130 246/.4)}',
    '.bsf-browser.phone .bsf-bbar{display:none}.bsf-browser.phone .bsf-bview{border-radius:28px}',
    '.bsf-halo{border-radius:10px;border:2px solid #60a5fa;box-shadow:0 0 0 4000px rgb(2 6 23/.5),0 0 22px 4px rgb(96 165 250/.65),inset 0 0 18px rgb(96 165 250/.25);pointer-events:none;z-index:40}',
    '.bsf-bulle{z-index:45;white-space:nowrap;padding:6px 11px;border-radius:9px;background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;font:700 12px/1.25 Inter,system-ui,sans-serif;box-shadow:0 10px 24px -6px rgb(37 99 235/.7)}',
    '.bsf-bulle::before{content:"";position:absolute;left:50%;top:-5px;width:10px;height:10px;background:#4f7cf6;transform:translateX(-50%) rotate(45deg);border-radius:2px}',
    '.bsf-bulle.up::before{top:auto;bottom:-5px;background:#5b72f3}',
    '.bsf-tutotag{z-index:60;display:flex;align-items:center;gap:8px;padding:7px 14px 7px 10px;border-radius:999px;background:rgb(2 6 23/.78);backdrop-filter:blur(8px);border:1px solid rgb(96 165 250/.45);color:#eaf1fb;font:700 14px/1.2 Inter,system-ui,sans-serif;box-shadow:0 12px 30px -8px rgb(0 0 0/.6)}',
    '.bsf-tutotag svg{color:#60a5fa}.bsf-tutotag span{padding:2px 7px;border-radius:6px;background:#3b82f6;color:#fff;font-size:10px;letter-spacing:.08em;text-transform:uppercase}',
    '.bsf-key{min-width:70px;height:70px;padding:0 16px;border-radius:14px;display:grid;place-items:center;font-size:24px;font-weight:800;background:linear-gradient(180deg,#22314d,#16233a);border:1px solid rgb(148 163 184/.3);box-shadow:0 5px 0 #0b1426;z-index:40}',
    '.bsf-dim{background:rgb(3 7 15/.6)}',
    '.bsf-pal{border-radius:16px;background:#101d33;border:1px solid rgb(148 163 184/.25);box-shadow:0 40px 80px -20px #000;overflow:hidden;z-index:30}',
    '.bsf-pal-in{display:flex;align-items:center;gap:12px;height:62px;padding:0 18px;border-bottom:1px solid rgb(148 163 184/.15);font-size:22px;font-weight:600}',
    '.bsf-pal-res{padding:8px}',
    '.bsf-pal-row{display:flex;align-items:center;gap:12px;height:52px;padding:0 12px;border-radius:10px;font-size:15px;color:#cfe0f7}',
    '.bsf-pal-row b{flex:1}',
    '.bsf-pal-row span{color:#7d93b5;font-size:13px}',
    '.bsf-pal-row.on{background:rgb(59 130 246/.2)}',
    '.bsf-caret::after{content:"";display:inline-block;width:2px;height:1em;margin-left:2px;vertical-align:-.12em;background:#60a5fa;animation:bsfBlink 1s steps(1) infinite}',
    '@keyframes bsfBlink{50%{opacity:0}}',
    '.bsf-menu{border-radius:14px;padding:6px;background:#13223a;border:1px solid rgb(148 163 184/.22);box-shadow:0 24px 50px -16px #000;z-index:30}',
    '.bsf-menu div{display:flex;align-items:center;gap:10px;height:40px;padding:0 10px;border-radius:9px;font-size:14px;font-weight:600}',
    '.bsf-menu div:first-child{background:rgb(59 130 246/.2)}',
    '.bsf-toast{display:flex;align-items:center;gap:10px;padding:12px 18px;border-radius:14px;background:#13223a;border:1px solid rgb(148 163 184/.22);box-shadow:0 20px 40px -14px #000;font-size:15px;font-weight:600;z-index:30}',
    '.bsf-theme{border-radius:16px;overflow:hidden;border:1px solid rgb(148 163 184/.2);box-shadow:0 30px 60px -20px #000}',
    '.bsf-theme.dark{background:#0c1729}.bsf-theme.light{background:#f1f5fb}',
    '.bsf-theme .th-side{position:absolute;left:0;top:0;bottom:0;width:150px}',
    '.bsf-theme.dark .th-side{background:#0a1322}.bsf-theme.light .th-side{background:#fff;border-right:1px solid #e2e8f0}',
    '.bsf-theme .th-top{position:absolute;left:150px;right:0;top:0;height:46px;border-bottom:1px solid rgb(148 163 184/.2)}',
    '.bsf-theme .th-c{position:absolute;left:180px;right:30px;top:76px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}',
    '.bsf-theme .th-c i,.bsf-theme .th-c2 i{display:block;height:100px;border-radius:12px}',
    '.bsf-theme .th-c2{position:absolute;left:180px;right:30px;top:200px;display:grid;grid-template-columns:2fr 1fr;gap:16px}',
    '.bsf-theme .th-c2 i{height:230px}',
    '.bsf-theme.dark .th-c i,.bsf-theme.dark .th-c2 i{background:#14243d}',
    '.bsf-theme.light .th-c i,.bsf-theme.light .th-c2 i{background:#fff;box-shadow:0 4px 14px rgb(15 23 42/.08)}',
    '.bsf-round{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:#13223a;border:1px solid rgb(148 163 184/.25);z-index:5}',
    '.bsf-round.big{width:160px;height:160px;background:radial-gradient(circle,#1b3460,#101d33)}',
    '.bsf-live{margin-left:auto;color:#fb7185;font-weight:700;font-size:14px}',
    '.bsf-timer{font:800 28px Inter;font-variant-numeric:tabular-nums}',
    '.bsf-callcard{border-radius:22px;padding:28px;background:linear-gradient(180deg,#14243d,#0d182b);border:1px solid rgb(148 163 184/.2);box-shadow:0 40px 80px -30px #000}',
    '.bsf-call-h{display:flex;align-items:center;gap:16px}',
    '.bsf-call-h b{display:block;font-size:22px}',
    '.bsf-call-h span{color:#a9bfdd;font-size:14px}',
    '.bsf-ringpulse{border-radius:18px;border:3px solid #34d399}',
    '.bsf-script{margin-top:28px;padding:18px;border-radius:16px;background:rgb(255 255 255/.03);border:1px solid rgb(148 163 184/.12)}',
    '.bsf-script b{font-size:15px;color:#93c5fd}',
    '.bsf-step{display:flex;align-items:center;gap:14px;margin-top:16px;font-size:19px;font-weight:600;color:#a9bfdd}',
    '.bsf-step i{width:22px;height:22px;border-radius:7px;border:2px solid rgb(148 163 184/.5);flex:none}',
    '.bsf-result{display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px 10px;border-radius:16px;border:1px solid;background:rgb(255 255 255/.04);font-size:17px;font-weight:700}',
    '.bsf-cal-h{font-weight:700;display:flex;gap:8px;align-items:center}',
    '.bsf-cal-g{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:14px}',
    '.bsf-cal-g div{display:grid;gap:8px}',
    '.bsf-cal-g span{font-size:12px;color:#7d93b5;font-weight:700}',
    '.bsf-cal-g i{height:52px;border-radius:9px;background:rgb(255 255 255/.04)}',
    '.bsf-event{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;background:#f59e0b;color:#1a1204;font-weight:800;font-size:13.5px;box-shadow:0 14px 30px -10px #f59e0b;z-index:10}',
    '.bsf-fchips{display:flex;gap:8px}',
    '.bsf-fchips span{display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:99px;border:1px solid rgb(148 163 184/.2);font-size:13px;font-weight:600;color:#a9bfdd;background:rgba(255,255,255,.05)}',
    '.bsf-fiche-h{display:flex;align-items:center;gap:14px}',
    '.bsf-fiche-h b{display:block;font-size:22px}',
    '.bsf-fiche-h span{color:#a9bfdd;font-size:14px}',
    '.bsf-acts{display:flex;gap:10px;margin:20px 0 18px}',
    '.bsf-acts span{display:flex;align-items:center;gap:7px;padding:9px 14px;border-radius:11px;background:rgba(255,255,255,.05);border:1px solid rgb(148 163 184/.18);font-weight:700;font-size:14px}',
    '.bsf-tl{display:grid;gap:14px;padding-left:12px}',
    '.bsf-tli{display:grid;grid-template-columns:40px 1fr auto;align-items:center;gap:12px;font-size:15px}',
    '.bsf-tli em{font-style:normal;color:#7d93b5;font-size:13px}',
    '.bsf-dotc{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;z-index:2}',
    '.bsf-vline{background:linear-gradient(#3b82f6,transparent);border-radius:2px}',
    '.bsf-file{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border-radius:16px;background:#13223a;border:2px dashed rgb(52 211 153/.6);font-size:15px}',
    '.bsf-file span{color:#a9bfdd;font-size:13px}',
    '.bsf-map{display:flex;gap:8px;flex-wrap:wrap}',
    '.bsf-map span{display:flex;align-items:center;gap:5px;padding:6px 10px;border-radius:9px;background:rgb(52 211 153/.12);color:#a7f3d0;font-size:13px;font-weight:700}',
    '.bsf-imp{display:grid;gap:8px;margin-top:16px}',
    '.bsf-imp i{display:block;height:30px;border-radius:8px;background:linear-gradient(90deg,rgb(255 255 255/.07),rgb(255 255 255/.02))}',
    '.bsf-btn{display:flex;align-items:center;gap:8px;padding:12px 18px;border-radius:12px;background:linear-gradient(180deg,#4a8be0,#3b82f6);font-weight:700;font-size:15px;z-index:20}',
    '.bsf-col{border-radius:16px;padding:12px;background:rgb(255 255 255/.03);border:1px solid rgb(148 163 184/.12)}',
    '.bsf-col-h{display:flex;align-items:center;gap:8px;font-weight:800;font-size:14px}',
    '.bsf-col-h i{width:9px;height:9px;border-radius:50%}',
    '.bsf-kcard{border-radius:12px;padding:12px 14px;background:#15253f;border:1px solid rgb(148 163 184/.18);display:flex;flex-direction:column;justify-content:space-between;font-size:14px}',
    '.bsf-kcard span{color:#34d399;font-weight:700;font-size:13px}',
    '.bsf-kcard.drag{border-color:#60a5fa;background:#1a2f52}',
    '.bsf-seg{display:flex;padding:4px;border-radius:12px;background:rgb(255 255 255/.06);gap:0;z-index:2}',
    '.bsf-seg span{width:96px;height:34px;display:grid;place-items:center;font-weight:700;font-size:14px;position:relative;z-index:2}',
    '.bsf-seg-ind{border-radius:9px;background:#3b82f6;z-index:1}',
    '.bsf-week{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}',
    '.bsf-day{border-radius:10px;background:rgb(255 255 255/.03);padding:8px}',
    '.bsf-day span{font-size:13px;font-weight:700;color:#7d93b5}',
    '.bsf-evt{padding:10px 12px;border-radius:9px;border-left:4px solid;font-size:13px;font-weight:700;z-index:3}',
    '.bsf-cb{width:26px;height:26px;border-radius:8px;border:2px solid rgb(148 163 184/.6);display:grid;place-items:center;flex:none}',
    '.bsf-cb path{stroke-dasharray:1;stroke-dashoffset:1}',
    '.bsf-tt{flex:1;font-weight:600;text-decoration:line-through;text-decoration-thickness:2px;text-decoration-color:transparent}',
    '.bsf-task em{font-style:normal;color:#7d93b5;font-size:13px}',
    '.bsf-doc{border-radius:12px;padding:30px 34px;background:#fff;color:#0b1220;box-shadow:0 40px 80px -30px #000;font-size:15px}',
    '.bsf-doc.small{padding:22px}',
    '.bsf-doc-h{display:flex;justify-content:space-between;align-items:baseline;border-bottom:3px solid #1d4ed8;padding-bottom:10px}',
    '.bsf-doc-h b{font-size:26px;letter-spacing:.08em;color:#1d4ed8}',
    '.bsf-doc-h span{color:#64748b;font-size:13px}',
    '.bsf-doc-to{margin:14px 0 18px;color:#334155}',
    '.bsf-lines{display:grid;gap:10px;min-height:150px}',
    '.bsf-line{display:flex;justify-content:space-between;gap:10px;padding:10px 12px;border-radius:8px;background:#f1f5f9}',
    '.bsf-tot{margin-top:24px;margin-left:auto;width:260px;display:grid;gap:8px}',
    '.bsf-tot div{display:flex;justify-content:space-between;font-variant-numeric:tabular-nums}',
    '.bsf-tot .ttc{padding:12px;border-radius:10px;background:#1d4ed8;color:#fff;font-size:18px}',
    '.bsf-fake{display:grid;gap:14px;margin-top:20px}',
    '.bsf-fake i{display:block;height:22px;border-radius:6px;background:#e2e8f0}',
    '.bsf-fake i:nth-child(2){width:70%}.bsf-fake i:nth-child(4){width:50%;margin-left:auto;background:#bfdbfe}',
    '.bsf-tagpdf{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;background:#f43f5e;color:#fff;font-weight:800;font-size:14px;box-shadow:0 10px 24px -8px #f43f5e}',
    '.bsf-stamp{padding:8px 18px;border:4px solid #10b981;border-radius:10px;color:#10b981;font:900 34px Inter;letter-spacing:.1em;background:rgb(255 255 255/.85)}',
    '.bsf-prog{flex:none;width:220px;height:10px;border-radius:99px;background:rgb(255 255 255/.08);overflow:hidden}',
    '.bsf-prog u{display:block;height:100%;border-radius:99px}',
    '.bsf-pay em{font-style:normal;font-weight:800;width:100px}',
    '.bsf-pay strong{font-variant-numeric:tabular-nums;width:100px;text-align:right}',
    '.bsf-qrc{display:flex;flex-direction:column;align-items:center;gap:10px;font-size:12.5px;color:#a9bfdd;text-align:center}',
    '.bsf-qr{display:grid;grid-template-columns:repeat(7,16px);gap:2px;padding:10px;background:#fff;border-radius:10px}',
    '.bsf-qr i{width:16px;height:16px;background:#0b1220;border-radius:2px}',
    '.bsf-mrr{position:absolute;right:28px;top:18px;font-size:30px;font-weight:800;color:#34d399;font-variant-numeric:tabular-nums}',
    '.bsf-funnel{display:flex;align-items:center;justify-content:space-between;padding:0 26px;border-radius:16px;font-size:19px;font-weight:700;box-shadow:0 16px 30px -18px #000}',
    '.bsf-funnel b{font-size:30px;font-variant-numeric:tabular-nums}',
    '.bsf-rate{padding:6px 12px;border-radius:99px;background:rgb(255 255 255/.08);font-weight:800;font-size:15px;color:#cfe0f7}',
    '.bsf-bar{border-radius:8px 8px 0 0;background:linear-gradient(180deg,#60a5fa,#2563eb)}',
    '.bsf-axis{text-align:center;color:#7d93b5;font-size:14px}',
    '.bsf-trendpill{display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:99px;background:#101d33;border:1px solid rgb(251 191 36/.4);font-weight:700;font-size:15px;color:#fde68a}',
    '.bsf-trendpill i{width:16px;height:3px;border-radius:2px;transform:rotate(-30deg)}',
    '.bsf-wave{display:flex;align-items:center;gap:5px;height:130px;margin:26px 0 10px}',
    '.bsf-wave i{display:block;width:7px;border-radius:4px;background:linear-gradient(180deg,#fb7185,#e11d48)}',
    '.bsf-rec{color:#fb7185;font-weight:800}',
    '.bsf-rec em{font-style:normal;color:#fff;margin-left:6px;font-variant-numeric:tabular-nums}',
    '.bsf-mail{padding:12px;border-radius:10px;background:rgb(255 255 255/.04);margin-top:12px;font-size:15px}',
    '.bsf-mail span:first-child{color:#7d93b5}',
    '.bsf-mail.body{min-height:150px;line-height:1.5}',
    '.bsf-tg{width:46px;height:26px;border-radius:99px;background:rgb(148 163 184/.3);padding:3px;flex:none}',
    '.bsf-tg i{display:block;width:20px;height:20px;border-radius:50%;background:#fff}',
    '.bsf-swatch{border-radius:50%;box-shadow:0 0 0 3px rgb(255 255 255/.12)}',
    '.bsf-team{display:flex;align-items:center;gap:0;z-index:3}',
    '.bsf-team span{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;font-weight:800;border:3px solid #0f1b2e;margin-left:-10px}',
    '.bsf-team b{margin-left:14px;color:#34d399}',
    '.bsf-chipfile{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:12px;background:#13223a;border:1px solid rgb(52 211 153/.4);font-weight:700}',
    '.bsf-vers{display:grid;gap:10px}',
    '.bsf-vers i{display:block;font-style:normal;padding:10px 14px;border-radius:10px;background:rgb(255 255 255/.05);font-weight:700}',
    '.bsf-vers i:first-child{background:rgb(16 185 129/.18);color:#34d399}',
    '[data-motion="reduced"] .bsf-bgfx i{transform:none!important}',
  
    /* module 08 : site, agenda, carte clients */
    '.bsf-brw{border-radius:18px;overflow:hidden;background:#0b1424;border:1px solid rgba(148,163,184,.22);box-shadow:0 40px 80px -30px #000}',
    '.bsf-brw-bar{display:flex;align-items:center;gap:7px;height:40px;padding:0 16px;background:#111c30;border-bottom:1px solid rgba(148,163,184,.15)}',
    '.bsf-brw-bar i{width:11px;height:11px;border-radius:50%;background:#fb7185}.bsf-brw-bar i:nth-child(2){background:#fbbf24}.bsf-brw-bar i:nth-child(3){background:#34d399}',
    '.bsf-brw-bar span{margin-left:14px;padding:4px 14px;border-radius:8px;background:#0a1220;color:#a9bfdd;font-size:13px}',
    '.bsf-brw-body{position:relative;height:560px}',
    '.bsf-cal{position:absolute;left:36px;top:30px;width:360px;padding:16px;border-radius:16px;background:#0f1b2e;border:1px solid rgba(148,163,184,.18)}',
    '.bsf-cal-h{display:flex;align-items:center;gap:10px;margin-bottom:12px;color:#eaf1fb;font-size:15px}.bsf-cal-h b{color:#7d93b5}.bsf-cal-h span{flex:1;font-weight:700}.bsf-cal-h strong{font-size:18px;color:#60a5fa;font-variant-numeric:tabular-nums}',
    '.bsf-cal-g{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}',
    '.bsf-cal-g i{font-style:normal;height:38px;border-radius:10px;display:grid;place-items:center;color:#eaf1fb;font-size:14px;font-weight:600}',
    '.bsf-cal-g i.off{color:#3b4a63;text-decoration:line-through}',
    '.bsf-slots{position:absolute;left:36px;top:400px;width:360px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}',
    '.bsf-slots i{font-style:normal;height:40px;border-radius:10px;border:1px solid rgba(148,163,184,.25);display:grid;place-items:center;color:#eaf1fb;font-size:13px;font-weight:600}',
    '.bsf-form{position:absolute;left:440px;top:30px;width:500px;padding:24px;border-radius:16px;background:#0f1b2e;border:1px solid rgba(148,163,184,.18);display:flex;flex-direction:column;gap:8px}',
    '.bsf-form span{color:#a9bfdd;font-size:13px;font-weight:600}',
    '.bsf-form em{font-style:normal;height:44px;line-height:44px;padding:0 14px;border-radius:10px;background:#0a1220;border:1px solid rgba(148,163,184,.2);color:#eaf1fb;font-size:15px;margin-bottom:8px}',
    '.bsf-cta{margin-top:12px;height:52px;border-radius:12px;background:linear-gradient(90deg,#3b82f6,#22d3ee);color:#fff;font-weight:800;font-size:16px;display:grid;place-items:center}',
    '.bsf-ok{position:absolute;left:440px;top:330px;width:500px;padding:26px;border-radius:16px;background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.45);display:flex;flex-direction:column;align-items:center;gap:6px;color:#eaf1fb}',
    '.bsf-ok b{font-size:22px}.bsf-ok span{color:#6ee7b7;font-size:15px}',
    '.bsf-daycol{border-radius:14px;background:rgba(148,163,184,.06);border:1px solid rgba(148,163,184,.12);padding:10px;color:#a9bfdd;font-size:13px}',
    '.bsf-evt.new{padding:10px 12px;border-radius:12px;background:linear-gradient(160deg,rgba(167,139,250,.35),rgba(59,130,246,.25));border:1px solid #a78bfa;color:#fff;box-shadow:0 0 0 4px rgba(167,139,250,.15),0 20px 30px -12px #000}',
    '.bsf-evt.new em{display:block;font-style:normal;font-size:11px;font-weight:800;color:#c4b5fd;text-transform:uppercase;letter-spacing:.06em}',
    '.bsf-evt.new b{display:block;font-size:14px;margin:2px 0}.bsf-evt.new span{font-size:12px;color:#dbeafe}',
    '.bsf-taskrow{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:14px;background:#0f1b2e;border:1px solid rgba(96,165,250,.4);color:#eaf1fb}',
    '.bsf-taskrow b{display:block;font-size:15px}.bsf-taskrow span{font-size:12.5px;color:#a9bfdd}',
    '.bsf-badges{display:flex;gap:8px}.bsf-badges i{display:flex;align-items:center;gap:6px;font-style:normal;padding:7px 12px;border-radius:99px;background:rgba(59,130,246,.18);color:#93c5fd;font-size:13px;font-weight:700}',
    '.bsf-badges i.hot{background:rgba(251,113,133,.16);color:#fda4af}',
    '.bsf-globe svg{overflow:visible}',
    '.bsf-gkpi{display:flex;flex-direction:column;justify-content:center;gap:4px;padding:0 26px}',
    '.bsf-gkpi span{color:#a9bfdd;font-size:15px;font-weight:600}.bsf-gkpi b{font-size:40px;letter-spacing:-.02em;font-variant-numeric:tabular-nums}',
    '.bsf-spot{padding:16px 18px;border-radius:16px;background:linear-gradient(160deg,rgba(15,27,46,.95),rgba(8,16,32,.9));border:1px solid rgba(96,165,250,.4);color:#eaf1fb;box-shadow:0 24px 40px -18px #000}',
    '.bsf-spot span{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#93c5fd}.bsf-spot b{display:block;font-size:26px}.bsf-spot p{margin:4px 0 0;color:#a9bfdd;font-size:14px}.bsf-spot strong{color:#6ee7b7}',
    '.bsf-person{display:grid;grid-template-columns:48px 1fr auto;gap:14px;align-items:center;padding:14px 18px;border-radius:16px;background:#0f1b2e;border:1px solid rgba(148,163,184,.18);border-left:4px solid;color:#eaf1fb}',
    '.bsf-person .av{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;color:#06101f;font-weight:900;font-size:16px}',
    '.bsf-person b{display:block;font-size:16px}.bsf-person em{font-style:normal;font-size:13px;font-weight:700}.bsf-person strong{font-size:15px;color:#eaf1fb}',
    '.bsf-tourbtn{display:flex;align-items:center;gap:8px;padding:9px 16px;border-radius:99px;background:rgba(59,130,246,.15);border:1px solid rgba(96,165,250,.5);color:#dbeafe;font-weight:800;font-size:15px}',
  ].join('\n');
  function ensureCss() {
    if (document.getElementById('bs-formation-css')) return;
    var st = document.createElement('style'); st.id = 'bs-formation-css'; st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  window.bsFormation = { monter: monter, modules: MODULES, tutos: TUTOS, lecteur: function () { return curPlayer; } };
})();
