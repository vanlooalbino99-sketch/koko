
/* Blackstart CRM : Formations en motion design (rubrique « Formations »).
 *
 * Chaque module est un film d'animation dessiné en direct dans le navigateur (aucun fichier vidéo) : maquettes du
 * CRM qui se construisent, curseur qui clique, chiffres qui défilent, graphiques qui se tracent, sous-titres.
 * - Lecteur complet : lecture / pause, barre de progression avec chapitres, retour en arrière, vitesse,
 *   plein écran, sous-titres, voix off (synthèse vocale du navigateur, en français), clavier.
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
  var SEEN_KEY = 'bs_formations_vus', QUIZ_KEY = 'bs-formation-quiz', PREF_KEY = 'bs-formation-prefs';
  var SERVER = !!window.BS_SERVER;
  var C = { bg: '#0a1220', surf: '#0f1b2e', surf2: '#16233a', line: 'rgba(148,163,184,.18)', text: '#eaf1fb', text2: '#a9bfdd', text3: '#7d93b5',
    acc: '#3b82f6', acc2: '#60a5fa', cyan: '#22d3ee', green: '#34d399', amber: '#fbbf24', rose: '#fb7185', violet: '#a78bfa', orange: '#fb923c' };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ic(name, size, color) {
    var lib = EXTRA[name] || (window.bsIcones && window.bsIcones.svg ? window.bsIcones.svg(name) : '');
    return '<svg width="' + (size || 18) + '" height="' + (size || 18) + '" viewBox="0 0 24 24" fill="none" stroke="' + (color || 'currentColor') +
      '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (lib || '<circle cx="12" cy="12" r="8"/>') + '</svg>';
  }
  var EXTRA = { 'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>' };
  function fmtTime(ms) { var s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function euro(v) { return Math.round(v).toLocaleString('fr-FR') + ' €'; }
  var EASE = 'cubic-bezier(.16,1,.3,1)', EASE_IO = 'cubic-bezier(.65,0,.35,1)', SPRING = 'cubic-bezier(.34,1.56,.64,1)';

  // ================================================================== moteur de scène
  // Une scène reçoit S : éléments positionnés, animations sur l'horloge de la scène, sous-titres synchronisés.
  function makeScene(def, layer) {
    var anims = [], tickers = [];
    var beats = [], t = 500;
    def.captions.forEach(function (c) { beats.push(t); t += Math.max(2600, c.length * 62 + 900); });
    var dur = Math.max(def.min || 0, t + 600);
    var S = {
      d: dur, beats: beats,
      b: function (i) { return beats[Math.min(i, beats.length - 1)]; },
      el: function (html, css, cls) {
        var e = document.createElement('div');
        e.className = 'bsf-el' + (cls ? ' ' + cls : '');
        if (css) e.style.cssText = css;
        e.innerHTML = html || '';
        layer.appendChild(e);
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
      pop: function (el, at, d) { return S.a(el, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)' }], at, d || 650, SPRING); },
      slide: function (el, at, dx, dy, d) { return S.a(el, [{ opacity: 0, transform: 'translate(' + (dx || 0) + 'px,' + (dy || 0) + 'px)' }, { opacity: 1, transform: 'none' }], at, d || 800); },
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
      cursor: function (pts, clicks) {
        var cu = S.el('<svg width="26" height="26" viewBox="0 0 24 24"><path d="M4 2l15 9-6.5 1.6L16 20l-2.6 1.3-3.4-7.2L4 19z" fill="#fff" stroke="#0a1220" stroke-width="1.4" stroke-linejoin="round"/></svg>', 'left:0;top:0;z-index:50', 'bsf-cursor');
        var frames = pts.map(function (p, i) { return { transform: 'translate(' + p[0] + 'px,' + p[1] + 'px)', offset: i / Math.max(1, pts.length - 1) }; });
        var t0 = pts[0][2], t1 = pts[pts.length - 1][2];
        // Positions à des instants précis : on reconstruit les « offsets » à partir des instants.
        frames.forEach(function (f, i) { f.offset = t1 > t0 ? (pts[i][2] - t0) / (t1 - t0) : i / Math.max(1, pts.length - 1); f.easing = EASE_IO; });
        S.a(cu, frames, t0, Math.max(1, t1 - t0), 'linear');
        S.a(cu, [{ opacity: 0 }, { opacity: 1 }], t0 - 300, 300, 'linear');
        (clicks || []).forEach(function (at) {
          var p = posAt(pts, at);
          var r = S.el('', 'left:' + (p[0] - 18) + 'px;top:' + (p[1] - 18) + 'px;width:36px;height:36px;z-index:49', 'bsf-ripple');
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
    S.a(layer, [{ opacity: 0 }, { opacity: 1 }], 0, 450, 'linear');
    S.a(layer, [{ opacity: 1 }, { opacity: 0 }], dur - 380, 380, 'linear', { fill: 'forwards' });
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
    ['dashboard', 'Tableau de bord', 'layout-dashboard'], ['reports', 'Rapports', 'chart-line'], ['formations', 'Formations', 'graduation-cap'], ['tools', 'Outils', 'wrench'], ['settings', 'Réglages', 'settings']];

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
        var t = S.el(title.split(' ').map(function (w) { return '<span>' + esc(w) + '</span>'; }).join(' '), 'left:80px;top:350px;width:1120px', 'bsf-bigtitle');
        Array.prototype.forEach.call(t.children, function (w, i) { S.a(w, [{ opacity: 0, transform: 'translateY(40px) rotate(4deg)' }, { opacity: 1, transform: 'none' }], 900 + i * 90, 800); });
        var line = S.el('', 'left:540px;top:446px;width:200px;height:3px', 'bsf-line');
        S.growX(line, 1500, 900);
        var chips = S.el((items || []).map(function (x) { return '<span>' + esc(x) + '</span>'; }).join(''), 'left:0;top:478px;width:1280px', 'bsf-chips');
        Array.prototype.forEach.call(chips.children, function (c, i) { S.pop(c, S.b(1) + i * 160, 500); });
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

  // ================================================================== les 7 modules
  var MODULES = [
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
        recapScene(['Enregistreur, script et modèles : vos outils au quotidien.', 'Réglages : un CRM à votre image.', 'Sauvegardes : exportez, ou laissez le serveur s’en charger.'], null),
      ] },
  ];

  // ================================================================== progression (navigateur + serveur)
  var seen = readJson(SEEN_KEY, []), quiz = readJson(QUIZ_KEY, {}), prefs = Object.assign({ voix: false, st: true, vit: 1 }, readJson(PREF_KEY, {}));
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
      def.captions.forEach(function (c) { tLoc += Math.max(2600, c.length * 62 + 900); });
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
    function speak(text) {
      if (!window.speechSynthesis) return;
      try {
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.lang = 'fr-FR'; u.rate = Math.min(1.6, .98 * prefs.vit);
        var v = speechSynthesis.getVoices().filter(function (x) { return /^fr/i.test(x.lang); });
        if (v.length) u.voice = v.filter(function (x) { return /Google|Amélie|Thomas|Audrey|Denise|Henri|Natural/i.test(x.name); })[0] || v[0];
        speaking = true; spoken = text;
        u.onend = u.onerror = function () { if (spoken === text) speaking = false; };
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
    function play() { if (t >= total) seek(0); playing = true; lastCap = ''; render(); hooks.onState(true); }
    function pause() { playing = false; speaking = false; try { speechSynthesis.cancel(); } catch (e) {} hooks.onState(false); }
    function seek(time) { t = Math.max(0, Math.min(total, time)); speaking = false; try { speechSynthesis.cancel(); } catch (e) {} lastCap = '__'; render(); }
    raf = requestAnimationFrame(frame);
    render();
    return {
      play: play, pause: pause, seek: seek, toggle: function () { playing ? pause() : play(); },
      get playing() { return playing; }, get t() { return t; }, total: total, starts: starts, durs: durs,
      chapter: function (i) { seek(starts[i] + 1); },
      destroy: function () { cancelAnimationFrame(raf); pause(); },
      refreshCaption: function () { lastCap = '__'; render(); },
    };
  }

  // ================================================================== rubrique « Formations »
  function monter(root) {
    if (!root || root.getAttribute('data-bsf')) return;
    root.setAttribute('data-bsf', '1');
    ensureCss();
    var ui = { idx: firstUnseen(), quiz: null, cert: false };
    var player = null, resizeObs = null;
    function firstUnseen() { for (var i = 0; i < MODULES.length; i++) if (seen.indexOf(MODULES[i].f) < 0) return i; return 0; }
    function nbSeen() { return MODULES.filter(function (m) { return seen.indexOf(m.f) >= 0; }).length; }

    function render() {
      if (player) { player.destroy(); player = null; }
      var m = MODULES[ui.idx], done = nbSeen();
      root.innerHTML =
        '<div class="page-head"><div class="page-head-text"><h1 class="page-title">Formations</h1><p class="page-sub">Le CRM expliqué en motion design, module par module</p></div>' +
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
        '<button type="button" class="bsf-cb-btn" data-act="full" title="Plein écran (F)">' + ic('fullscreen', 17) + '</button></div>' +
        '<div class="bsf-meta"><div class="min-w-0"><div class="bsf-kick">Module ' + (ui.idx + 1) + ' sur ' + MODULES.length + ' · <span class="bsf-dur"></span></div><h2 class="bsf-title">' + esc(m.t) + '</h2><p class="bsf-sub">' + esc(m.s) + '</p></div>' +
        '<div class="bsf-actions">' + (seen.indexOf(m.f) < 0 ? '<button type="button" class="btn btn-ghost btn-sm" data-act="seen">' + ic('check', 15) + ' Marquer comme vu</button>' : '') +
        '<button type="button" class="btn btn-secondary btn-sm" data-act="quiz">' + ic('sparkles', 15) + ' Quiz' + (quiz[m.f] != null ? ' · ' + quiz[m.f] + '/3' : '') + '</button>' +
        (ui.idx < MODULES.length - 1 ? '<button type="button" class="btn btn-primary btn-sm" data-act="next">Module suivant ' + ic('arrow-right', 15) + '</button>' : '') + '</div></div></div>' +
        '<div class="card card-flush bsf-list">' + MODULES.map(function (mm, i) {
          var v = seen.indexOf(mm.f) >= 0;
          return '<button type="button" class="bsf-item' + (i === ui.idx ? ' active' : '') + (v ? ' done' : '') + '" data-mod="' + i + '"><span class="bsf-inum">' + (v ? ic('check', 15) : i + 1) + '</span>' +
            '<span class="bsf-itxt"><span class="bsf-it">' + esc(mm.t) + '</span><span class="bsf-is">' + esc(mm.s) + (quiz[mm.f] != null ? ' · quiz ' + quiz[mm.f] + '/3' : '') + '</span></span>' + (i === ui.idx ? ic('play', 15) : '') + '</button>';
        }).join('') + '</div></div>' + teamHtml();
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
        onEnd: function () { markSeen(m.f); openQuiz(true); },
      });
      root.querySelector('.bsf-dur').textContent = fmtTime(player.total);
      root.querySelector('.bsf-scrub-chap').innerHTML = player.starts.map(function (s, i) {
        return '<i style="left:' + (s / player.total * 100) + '%" title="' + esc(MODULES[ui.idx].scenes[i].captions[0]) + '"></i>';
      }).join('');
      if (ui.quiz) showQuiz(); else if (ui.cert) showCert();
    }
    function fit(screen) {
      var stage = screen.querySelector('.bsf-stage');
      var apply = function () { var w = screen.clientWidth || 800; stage.style.transform = 'scale(' + (w / W) + ')'; };
      apply();
      if (resizeObs) resizeObs.disconnect();
      if (window.ResizeObserver) { resizeObs = new ResizeObserver(apply); resizeObs.observe(screen); }
      else window.addEventListener('resize', apply);
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
      var t = e.target.closest('[data-act],[data-mod],[data-opt]');
      if (!t && e.target.closest('.bsf-stage') && player) { player.toggle(); return; }
      if (!t || t.disabled) return;
      if (t.hasAttribute('data-mod')) { ui.idx = +t.getAttribute('data-mod'); closeOver(); render(); try { root.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (er) {} return; }
      if (t.hasAttribute('data-opt')) { var q = ui.quiz, Q = MODULES[ui.idx].quiz[q.i]; q.picked = +t.getAttribute('data-opt'); if (q.picked === Q[2]) q.score++; showQuiz(); return; }
      var act = t.getAttribute('data-act');
      if (act === 'play' || act === 'toggle') { player.toggle(); root.querySelector('.bsf-screen').focus(); }
      else if (act === 'speed') { var sp = [1, 1.25, 1.5, .75]; prefs.vit = sp[(sp.indexOf(prefs.vit) + 1) % sp.length]; writeJson(PREF_KEY, prefs); t.textContent = prefs.vit + '×'; }
      else if (act === 'st') { prefs.st = !prefs.st; writeJson(PREF_KEY, prefs); t.classList.toggle('on', prefs.st); player.refreshCaption(); }
      else if (act === 'voix') {
        prefs.voix = !prefs.voix; writeJson(PREF_KEY, prefs); t.classList.toggle('on', prefs.voix);
        if (!window.speechSynthesis) alert('La voix off n’est pas disponible dans ce navigateur.');
        else if (!prefs.voix) speechSynthesis.cancel(); else player.refreshCaption();
      }
      else if (act === 'full') { var sc = root.querySelector('.bsf-player'); if (document.fullscreenElement) document.exitFullscreen(); else if (sc.requestFullscreen) sc.requestFullscreen().catch(function () {}); }
      else if (act === 'seen') { markSeen(MODULES[ui.idx].f); render(); }
      else if (act === 'next') { markSeen(MODULES[ui.idx].f); ui.idx = Math.min(MODULES.length - 1, ui.idx + 1); closeOver(); render(); player.play(); }
      else if (act === 'quiz') openQuiz(false);
      else if (act === 'qnext') { ui.quiz.i++; ui.quiz.picked = null; showQuiz(); }
      else if (act === 'replay') { closeOver(); render(); player.play(); }
      else if (act === 'close') { closeOver(); render(); }
      else if (act === 'cert') { ui.cert = true; ui.quiz = null; showCert(); }
      else if (act === 'print') printCert();
    });
    // Barre de progression : clic ou glisser pour se déplacer.
    root.addEventListener('pointerdown', function (e) {
      var bar = e.target.closest('.bsf-scrub'); if (!bar) return;
      var go = function (ev) { var r = bar.getBoundingClientRect(); player.seek(Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * player.total); };
      go(e); bar.setPointerCapture && bar.setPointerCapture(e.pointerId);
      var mv = function (ev) { go(ev); }, up = function () { bar.removeEventListener('pointermove', mv); bar.removeEventListener('pointerup', up); };
      bar.addEventListener('pointermove', mv); bar.addEventListener('pointerup', up);
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
    });
    // On quitte la page : le film s'arrête.
    var mo = new MutationObserver(function () { if (!root.isConnected) { if (player) player.destroy(); if (resizeObs) resizeObs.disconnect(); mo.disconnect(); } });
    mo.observe(document.body, { childList: true, subtree: true });
    render();
    loadServer(function () { if (root.isConnected && !(player && player.playing)) render(); });
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
    '.bsf-ripple{border-radius:50%;border:3px solid #fff}',
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
  ].join('\n');
  function ensureCss() {
    if (document.getElementById('bs-formation-css')) return;
    var st = document.createElement('style'); st.id = 'bs-formation-css'; st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  window.bsFormation = { monter: monter, modules: MODULES, lecteur: function () { return curPlayer; } };
})();
