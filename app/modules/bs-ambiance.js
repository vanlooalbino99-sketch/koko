
/* Blackstart CRM : images d'ambiance (Réglages › Ambiance).
 *
 * - Vos images s'affichent en fond de l'application (effet verre dépoli), sur la bannière d'« Aujourd'hui »,
 *   sur l'écran d'ouverture et, dans la version équipe, sur la page de connexion.
 * - Un voile adapté au thème (clair ou sombre) garde les textes lisibles.
 * - Mode immersion (touche I) : vos images en plein écran, l'heure, votre journée et une session d'appels chronométrée.
 * - Images vivantes : mouvement de caméra (zoom, travelling), lumières animées selon le sujet de l'image (étoiles
 *   filantes, flux de données, reflets sur l'eau, poussières dorées, halos), reflet qui balaie l'écran et léger
 *   relief qui suit la souris en mode immersion. Réglages › Ambiance › « Images animées » pour le fond et la
 *   bannière ; le mode immersion est toujours animé, sauf si « réduire les animations » est actif.
 * - Stockage : dans ce navigateur (IndexedDB) pour la version autonome, sur le serveur (partagé avec l'équipe)
 *   quand le CRM tourne sur le serveur (window.BS_SERVER).
 */
(function () {
  'use strict';
  if (window.bsAmbiance) return;

  var SERVER = !!window.BS_SERVER;
  var DEFAULTS = {
    fond: true, banniere: true, demarrage: true, connexion: true,
    mode: 'diaporama', vedette: '', intervalle: 40, voile: 58, flou: 0, mouvement: true,
    icones: {}, // icônes du menu choisies dans Réglages › Icônes du menu (module bs-icones)
    iconesStyle: { trait: 'normal', couleur: 'neutre' },
  };
  var MAX_IMAGES = 60;
  var PERSO_KEY = 'bs-ambiance-perso';

  var state = { config: Object.assign({}, DEFAULTS), images: [], canEdit: true, ready: false, error: '' };
  var urls = {};          // id -> { full, mini }
  var listeners = [];
  var current = '';       // image affichée
  var order = [];         // ordre du diaporama
  var timer = null;
  var perso = readPerso();

  function readPerso() { try { return JSON.parse(localStorage.getItem(PERSO_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function writePerso() { try { localStorage.setItem(PERSO_KEY, JSON.stringify(perso)); } catch (e) {} }
  function emit() { listeners.slice().forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } }); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid() {
    var a = new Uint8Array(16); crypto.getRandomValues(a);
    return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  function clamp(v, lo, hi, d) { v = Number(v); return isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d; }

  // ---------------------------------------------------------------- stockage : navigateur (IndexedDB)
  var local = {
    p: null,
    open: function () {
      if (this.p) return this.p;
      this.p = new Promise(function (res, rej) {
        if (!window.indexedDB) return rej(new Error('Stockage du navigateur indisponible.'));
        var r = indexedDB.open('bs-ambiance', 1);
        r.onupgradeneeded = function () { var d = r.result; d.createObjectStore('images', { keyPath: 'id' }); d.createObjectStore('kv'); };
        r.onsuccess = function () { res(r.result); };
        r.onerror = function () { rej(r.error || new Error('Stockage du navigateur indisponible.')); };
      });
      return this.p;
    },
    req: function (store, mode, fn) {
      return this.open().then(function (d) {
        return new Promise(function (res, rej) {
          var tx = d.transaction(store, mode), out;
          var r = fn(tx.objectStore(store));
          if (r) r.onsuccess = function () { out = r.result; };
          tx.oncomplete = function () { res(out); };
          tx.onerror = tx.onabort = function () { rej(tx.error || new Error('Écriture impossible (stockage plein ?).')); };
        });
      });
    },
    load: function () {
      var self = this;
      return Promise.all([
        self.req('images', 'readonly', function (s) { return s.getAll(); }),
        self.req('kv', 'readonly', function (s) { return s.get('config'); }),
      ]).then(function (r) {
        var imgs = (r[0] || []).sort(function (a, b) { return (a.created || '').localeCompare(b.created || ''); });
        imgs.forEach(function (i) {
          if (!urls[i.id]) urls[i.id] = { full: URL.createObjectURL(i.blob), mini: URL.createObjectURL(i.thumb || i.blob) };
        });
        return { config: r[1] || {}, canEdit: true, images: imgs.map(function (i) { return meta(i); }) };
      });
    },
    add: function (img) {
      return this.req('images', 'readwrite', function (s) { return s.put(img); }).then(function () {
        urls[img.id] = { full: URL.createObjectURL(img.blob), mini: URL.createObjectURL(img.thumb) };
        return meta(img);
      });
    },
    remove: function (id) {
      return this.req('images', 'readwrite', function (s) { return s.delete(id); }).then(function () {
        if (urls[id]) { URL.revokeObjectURL(urls[id].full); URL.revokeObjectURL(urls[id].mini); delete urls[id]; }
      });
    },
    // Renvoie la configuration enregistrée (comme le serveur), pas la clé rendue par IndexedDB.
    saveConfig: function (cfg) { return this.req('kv', 'readwrite', function (s) { return s.put(cfg, 'config'); }).then(function () { return cfg; }); },
  };
  function meta(i) { return { id: i.id, nom: i.nom, largeur: i.largeur, hauteur: i.hauteur, couleur: i.couleur, created: i.created }; }

  // ---------------------------------------------------------------- stockage : serveur de l'équipe
  function api(path, opts) {
    opts = opts || {};
    var headers = { 'X-Requested-With': 'blackstart' };
    if (opts.body) headers['Content-Type'] = 'application/json';
    return fetch(path, { method: opts.method || 'GET', credentials: 'same-origin', headers: headers, body: opts.body ? JSON.stringify(opts.body) : undefined })
      .then(function (r) {
        if (r.status === 204) return null;
        return r.json().catch(function () { return {}; }).then(function (b) {
          if (!r.ok) throw new Error(b.error || ('Erreur ' + r.status));
          return b;
        });
      });
  }
  function blobToDataUrl(blob) {
    return new Promise(function (res, rej) { var fr = new FileReader(); fr.onload = function () { res(fr.result); }; fr.onerror = function () { rej(fr.error); }; fr.readAsDataURL(blob); });
  }
  var remote = {
    load: function () {
      return api('/api/ambiance').then(function (b) {
        (b.images || []).forEach(function (i) { urls[i.id] = { full: '/ambiance/images/' + i.id, mini: '/ambiance/images/' + i.id + '?taille=mini' }; });
        return b;
      });
    },
    add: function (img) {
      return Promise.all([blobToDataUrl(img.blob), blobToDataUrl(img.thumb)]).then(function (d) {
        return api('/api/ambiance/images', { method: 'POST', body: { nom: img.nom, largeur: img.largeur, hauteur: img.hauteur, couleur: img.couleur, image: d[0], mini: d[1] } });
      }).then(function (m) {
        urls[m.id] = { full: '/ambiance/images/' + m.id, mini: '/ambiance/images/' + m.id + '?taille=mini' };
        return m;
      });
    },
    remove: function (id) { return api('/api/ambiance/images/' + encodeURIComponent(id), { method: 'DELETE' }).then(function () { delete urls[id]; }); },
    saveConfig: function (cfg) { return api('/api/ambiance/config', { method: 'PUT', body: cfg }).then(function (b) { return b && b.config; }); },
  };
  var backend = SERVER ? remote : local;

  // ---------------------------------------------------------------- préparation des images
  function canvasBlob(c, q) {
    return new Promise(function (res, rej) { c.toBlob(function (b) { b ? res(b) : rej(new Error('Conversion impossible.')); }, 'image/jpeg', q); });
  }
  function decode(file) {
    if (window.createImageBitmap) {
      return createImageBitmap(file).catch(function () { return viaImg(file); });
    }
    return viaImg(file);
  }
  function viaImg(file) {
    return new Promise(function (res, rej) {
      var u = URL.createObjectURL(file), im = new Image();
      im.onload = function () { res(im); setTimeout(function () { URL.revokeObjectURL(u); }, 1000); };
      im.onerror = function () { URL.revokeObjectURL(u); rej(new Error('format non lisible par le navigateur (HEIC ?). Enregistrez-la en JPG ou PNG.')); };
      im.src = u;
    });
  }
  function resized(src, w, h, max) {
    var k = Math.min(1, max / Math.max(w, h));
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));
    var x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, c.width, c.height);
    return c;
  }
  function averageColor(src, w, h) {
    var c = resized(src, w, h, 24), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, r = 0, g = 0, b = 0, n = 0;
    for (var i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
    var hex = function (v) { return ('0' + Math.round(v / n).toString(16)).slice(-2); };
    return '#' + hex(r) + hex(g) + hex(b);
  }
  function fromCanvasSource(src, w, h, nom) {
    var big = resized(src, w, h, 2560), mini = resized(src, w, h, 480);
    return Promise.all([canvasBlob(big, 0.86), canvasBlob(mini, 0.8)]).then(function (b) {
      return { id: uid(), nom: nom, blob: b[0], thumb: b[1], largeur: big.width, hauteur: big.height, couleur: averageColor(src, w, h), created: new Date().toISOString() };
    });
  }
  function prepare(file) {
    if (!/^image\//.test(file.type || '') && !/\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(file.name || ''))
      return Promise.reject(new Error((file.name || 'Fichier') + ' : ce n’est pas une image.'));
    return decode(file).then(function (src) {
      var w = src.naturalWidth || src.width, h = src.naturalHeight || src.height;
      if (!w || !h) throw new Error('image vide.');
      var nom = String(file.name || 'Image').replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').slice(0, 80) || 'Image';
      return fromCanvasSource(src, w, h, nom);
    }).catch(function (e) { throw new Error((file.name || 'Image') + ' : ' + e.message); });
  }

  // ---------------------------------------------------------------- actions
  function load() {
    return backend.load().then(function (b) {
      state.config = Object.assign({}, DEFAULTS, b.config || {});
      state.images = b.images || [];
      state.canEdit = b.canEdit !== false;
      state.ready = true; state.error = '';
      reorder(); apply(true); emit();
    }).catch(function (e) {
      state.ready = true; state.error = e.message; emit();
    });
  }
  function addFiles(files, onProgress) {
    files = Array.prototype.slice.call(files || []);
    var done = 0, errors = [];
    var room = MAX_IMAGES - state.images.length;
    if (files.length > room) { errors.push('Maximum ' + MAX_IMAGES + ' images : ' + (files.length - room) + ' ignorée(s).'); files = files.slice(0, Math.max(0, room)); }
    var chain = Promise.resolve();
    files.forEach(function (f) {
      chain = chain.then(function () {
        onProgress && onProgress('Préparation de « ' + (f.name || 'image') + ' » (' + (done + 1) + '/' + files.length + ')…');
        return prepare(f).then(function (img) { return backend.add(img); }).then(function (m) {
          state.images.push(m); done++;
        }).catch(function (e) { errors.push(e.message); });
      });
    });
    return chain.then(function () {
      reorder(); if (done) show(state.images[state.images.length - 1].id);
      apply(); emit();
      return { added: done, errors: errors };
    });
  }
  function remove(id) {
    return backend.remove(id).then(function () {
      state.images = state.images.filter(function (i) { return i.id !== id; });
      if (state.config.vedette === id) setConfig({ vedette: '' });
      if (current === id) current = '';
      reorder(); apply(true); emit();
    });
  }
  function setConfig(patch) {
    var next = Object.assign({}, state.config, patch);
    next.intervalle = clamp(next.intervalle, 8, 900, 40);
    next.voile = clamp(next.voile, 0, 95, 58);
    next.flou = clamp(next.flou, 0, 24, 0);
    var prevMode = state.config.mode, prevVed = state.config.vedette;
    state.config = next;
    var p = backend.saveConfig(next).then(function (saved) { if (saved) state.config = Object.assign({}, DEFAULTS, saved); }).catch(function (e) { state.error = e.message; emit(); });
    if (next.mode !== prevMode || next.vedette !== prevVed) { reorder(); apply(true); } else apply();
    emit();
    return p;
  }
  function setPerso(patch) { Object.assign(perso, patch); writePerso(); apply(true); emit(); }

  // ---------------------------------------------------------------- choix de l'image
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function reorder() { order = shuffle(state.images.map(function (i) { return i.id; })); }
  function dayIndex(n) { var d = new Date(); return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 864e5) % n; }
  function pick() {
    var ids = state.images.map(function (i) { return i.id; });
    if (!ids.length) return '';
    var c = state.config;
    if (c.mode === 'fixe') return ids.indexOf(c.vedette) >= 0 ? c.vedette : ids[0];
    if (c.mode === 'jour') return ids[dayIndex(ids.length)];
    if (current && ids.indexOf(current) >= 0) return current;
    return order[0] || ids[0];
  }
  function step(dir) {
    if (!order.length) return;
    var i = order.indexOf(current);
    show(order[(i + (dir || 1) + order.length) % order.length]);
  }
  function active() { return state.images.length > 0 && !perso.off; }

  // ---------------------------------------------------------------- affichage
  var CSS = [
    '#bs-amb{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;background:var(--bg);display:none}',
    'html.bs-amb-fond #bs-amb{display:block}',
    'html.bs-amb-fond body{background:transparent!important}',
    '.bs-amb-slide{position:absolute;inset:-4%;background-size:cover;background-position:center;opacity:0;transition:opacity 1.8s ease;filter:blur(var(--bs-amb-flou,0px));will-change:opacity,transform}',
    '.bs-amb-slide.on{opacity:1}',
    // Mouvement de caméra : quatre trajectoires, une nouvelle à chaque image. L'image qui s'efface garde
    // son mouvement pendant le fondu (pas d'à-coup).
    '.bs-amb-slide{animation-duration:36s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;animation-direction:alternate}',
    '#bs-amb-zen .bs-amb-slide{animation-duration:26s}',
    'html.bs-amb-kb #bs-amb .kb-a,#bs-amb-zen .kb-a{animation-name:bsAmbKa}',
    'html.bs-amb-kb #bs-amb .kb-b,#bs-amb-zen .kb-b{animation-name:bsAmbKb}',
    'html.bs-amb-kb #bs-amb .kb-c,#bs-amb-zen .kb-c{animation-name:bsAmbKc}',
    'html.bs-amb-kb #bs-amb .kb-d,#bs-amb-zen .kb-d{animation-name:bsAmbKd}',
    '@keyframes bsAmbKa{from{transform:scale(1.02) translate3d(0,0,0)}to{transform:scale(1.16) translate3d(-3%,-2%,0)}}',
    '@keyframes bsAmbKb{from{transform:scale(1.16) translate3d(3%,1%,0)}to{transform:scale(1.03) translate3d(0,0,0)}}',
    '@keyframes bsAmbKc{from{transform:scale(1.1) translate3d(-4%,0,0)}to{transform:scale(1.1) translate3d(4%,0,0)}}',
    '@keyframes bsAmbKd{from{transform:scale(1.04) translate3d(2%,2%,0)}to{transform:scale(1.15) translate3d(-1%,-3%,0)}}',
    // Lumières vivantes, entre l'image et le voile.
    '.bs-vie{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;transition:opacity .7s ease}',
    '#bs-amb .bs-vie{filter:blur(var(--bs-amb-flou,0px))}',
    '.bs-vie-globe{animation:bsVieIn .9s ease both}',
    '@keyframes bsVieIn{from{opacity:0}}',
    // Immersion : le globe reçoit la souris ; le texte et les voiles la laissent passer, les boutons restent cliquables.
    '#bs-amb-zen .bs-vie-globe.live{pointer-events:auto}',
    '#bs-amb-zen .z-shade,#bs-amb-zen .z-sweep,#bs-amb-zen .z-center,#bs-amb-zen .z-top,#bs-amb-zen .z-bottom{pointer-events:none}',
    '#bs-amb-zen button{pointer-events:auto}',
    '.bs-amb-veil{position:absolute;inset:0;background:linear-gradient(90deg,rgb(var(--bg-rgb)/min(1,calc(var(--bs-amb-voile) + .2))) 0,rgb(var(--bg-rgb)/var(--bs-amb-voile)) 300px,rgb(var(--bg-rgb)/max(0,calc(var(--bs-amb-voile) - .12))) 100%),radial-gradient(130% 100% at 60% 0,transparent 45%,rgb(var(--bg-rgb)/.45) 100%)}',
    // Verre dépoli : les blocs laissent deviner l'image sans gêner la lecture.
    'html.bs-amb-fond .sidebar{background:rgb(var(--bg-rgb)/.62)!important;-webkit-backdrop-filter:blur(18px) saturate(1.15);backdrop-filter:blur(18px) saturate(1.15)}',
    'html.bs-amb-fond .card,html.bs-amb-fond .hero,html.bs-amb-fond .kpi,html.bs-amb-fond .table-wrap,html.bs-amb-fond .kanban-col,html.bs-amb-fond .settings-nav{background-color:rgb(var(--surface-rgb)/.84)!important;-webkit-backdrop-filter:blur(14px) saturate(1.1);backdrop-filter:blur(14px) saturate(1.1)}',
    'html.bs-amb-fond .topbar{-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}',
    'html.bs-amb-fond .page-head-text{text-shadow:0 1px 14px rgb(var(--bg-rgb)/.95),0 0 3px rgb(var(--bg-rgb)/.8)}',
    'html.bs-amb-fond .page-sub,html.bs-amb-fond .eyebrow{color:var(--text-2)}',
    // Bannière « Aujourd'hui »
    'html.bs-amb-hero .hero{background-image:linear-gradient(100deg,rgb(var(--surface-rgb)/.95) 0%,rgb(var(--surface-rgb)/.82) 36%,rgb(var(--surface-rgb)/.25) 72%,rgb(var(--surface-rgb)/.05) 100%),var(--bs-amb-img)!important;background-size:cover!important;background-position:0 0,50% 50%;min-height:200px;transition:background-image 1.2s ease}',
    // Bannière : l'image glisse lentement dans le cadre.
    '@keyframes bsAmbHero{from{background-position:0 0,50% 15%}to{background-position:0 0,50% 85%}}',
    'html.bs-amb-hero.bs-amb-kb .hero{animation:bsAmbHero 40s ease-in-out infinite alternate}',
    '@media (max-width:760px){html.bs-amb-hero .hero{background-image:linear-gradient(180deg,rgb(var(--surface-rgb)/.55) 0%,rgb(var(--surface-rgb)/.92) 55%),var(--bs-amb-img)!important}}',
    '.bs-amb-zen-btn{position:absolute;right:14px;bottom:12px;z-index:2;display:none;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:99px;border:1px solid rgb(255 255 255/.28);background:rgb(0 0 0/.38);color:#fff;font:inherit;font-size:12.5px;font-weight:600;cursor:pointer;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:background .2s,transform .2s}',
    '.bs-amb-zen-btn:hover{background:rgb(0 0 0/.55);transform:translateY(-1px)}',
    'html.bs-amb-on .bs-amb-zen-btn{display:inline-flex}',
    // Écran d'ouverture
    'html.bs-amb-splash #splash{background-image:linear-gradient(rgb(var(--bg-rgb)/.25),rgb(var(--bg-rgb)/.7)),var(--bs-amb-img)!important;background-size:cover!important;background-position:center!important}',
    'html.bs-amb-splash #splash .splash-brand{filter:drop-shadow(0 2px 12px rgb(0 0 0/.45))}',
    // Mode immersion
    '#bs-amb-zen{position:fixed;inset:0;z-index:400;background:#05070c;color:#fff;overflow:hidden;opacity:0;transition:opacity .5s ease;font-family:var(--font,system-ui)}',
    '#bs-amb-zen.on{opacity:1}',
    '#bs-amb-zen.idle{cursor:none}',
    '#bs-amb-zen .bs-amb-slide{filter:none;inset:-5%}',
    // Relief : l'image suit doucement la souris ; un reflet balaie l'écran de temps en temps.
    '#bs-amb-zen .z-par{position:absolute;inset:0;transition:transform 1.4s cubic-bezier(.2,.7,.2,1);will-change:transform}',
    '#bs-amb-zen .z-sweep{position:absolute;inset:0;overflow:hidden;pointer-events:none}',
    '#bs-amb-zen .z-sweep::before{content:"";position:absolute;top:-25%;bottom:-25%;left:-55%;width:40%;background:linear-gradient(90deg,transparent,rgb(255 255 255/.07) 42%,rgb(255 255 255/.11) 50%,rgb(255 255 255/.07) 58%,transparent);mix-blend-mode:screen;transform:skewX(-16deg);animation:bsAmbSweep 17s ease-in-out infinite}',
    '@keyframes bsAmbSweep{0%,38%{transform:translateX(0) skewX(-16deg)}100%{transform:translateX(460%) skewX(-16deg)}}',
    '#bs-amb-zen .z-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgb(0 0 0/.45) 0%,rgb(0 0 0/.05) 30%,rgb(0 0 0/.08) 55%,rgb(0 0 0/.65) 100%)}',
    '#bs-amb-zen .z-top,#bs-amb-zen .z-bottom{position:absolute;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 28px;transition:opacity .6s}',
    '#bs-amb-zen .z-top{top:0}#bs-amb-zen .z-bottom{bottom:0;align-items:flex-end}',
    '#bs-amb-zen.idle .z-top,#bs-amb-zen.idle .z-actions{opacity:0}',
    '#bs-amb-zen .z-brand{font-weight:800;letter-spacing:.16em;font-size:13px;opacity:.9}',
    '#bs-amb-zen .z-actions{display:flex;gap:8px;transition:opacity .6s}',
    '#bs-amb-zen button{font:inherit;color:#fff;cursor:pointer}',
    '#bs-amb-zen .z-ic{width:40px;height:40px;border-radius:99px;border:1px solid rgb(255 255 255/.25);background:rgb(0 0 0/.3);display:grid;place-items:center;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}',
    '#bs-amb-zen .z-ic:hover{background:rgb(255 255 255/.18)}',
    '#bs-amb-zen .z-center{position:absolute;left:6vw;bottom:22vh;max-width:min(760px,88vw);text-shadow:0 2px 24px rgb(0 0 0/.5)}',
    '#bs-amb-zen .z-clock{font-size:clamp(64px,11vw,148px);font-weight:200;letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums}',
    '#bs-amb-zen .z-date{font-size:clamp(16px,1.6vw,22px);opacity:.88;margin-top:8px;text-transform:capitalize}',
    '#bs-amb-zen .z-hello{font-size:clamp(22px,2.4vw,34px);font-weight:650;margin-top:22px;letter-spacing:-.01em}',
    '#bs-amb-zen .z-day{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}',
    '#bs-amb-zen .z-chip{padding:6px 12px;border-radius:99px;background:rgb(0 0 0/.32);border:1px solid rgb(255 255 255/.2);font-size:13.5px;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);text-shadow:none}',
    '#bs-amb-zen .z-quote{margin:22px 0 0;font-size:clamp(15px,1.4vw,19px);font-style:italic;opacity:.92;max-width:620px;transition:opacity .8s}',
    '#bs-amb-zen .z-focus{display:flex;align-items:center;gap:14px;padding:10px 16px 10px 10px;border-radius:99px;background:rgb(0 0 0/.35);border:1px solid rgb(255 255 255/.2);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}',
    '#bs-amb-zen .z-ring{width:54px;height:54px;flex-shrink:0}',
    '#bs-amb-zen .z-ring circle{fill:none;stroke-width:4}',
    '#bs-amb-zen .z-ftxt{display:flex;flex-direction:column;gap:2px;font-size:13px}',
    '#bs-amb-zen .z-ftxt strong{font-size:18px;font-variant-numeric:tabular-nums}',
    '#bs-amb-zen .z-fbtn{border:0;background:#fff;color:#0b1220!important;font-weight:700;border-radius:99px;padding:8px 14px;font-size:13px}',
    '#bs-amb-zen .z-fbtn.ghost{background:transparent;color:#fff!important;border:1px solid rgb(255 255 255/.35)}',
    '#bs-amb-zen .z-cap{font-size:12.5px;opacity:.8;text-align:right;text-shadow:0 1px 8px rgb(0 0 0/.6)}',
    '#bs-amb-zen .z-keys{opacity:.65;margin-top:4px}',
    '@media (max-width:640px){#bs-amb-zen .z-center{bottom:28vh}#bs-amb-zen .z-bottom{flex-direction:column;align-items:flex-start}#bs-amb-zen .z-cap{text-align:left}#bs-amb-zen .z-keys{display:none}}',
    '.bs-amb-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:500;background:var(--surface,#111);color:var(--text,#fff);border:1px solid var(--border-2,#333);border-radius:12px;padding:12px 16px;box-shadow:0 12px 40px rgb(0 0 0/.35);font-size:14px}',
    'html[data-motion="reduced"] .bs-amb-slide,html[data-motion="reduced"] .hero,html[data-motion="reduced"] #bs-amb-zen .z-sweep::before{animation:none!important}',
    'html[data-motion="reduced"] .bs-vie{display:none}',
    '@media (prefers-reduced-motion:reduce){.bs-amb-slide,html .hero,#bs-amb-zen .z-sweep::before{animation:none!important}.bs-vie{display:none}}',
    // Réglages › Ambiance
    '.bsa-drop{border:2px dashed var(--border-2);border-radius:var(--radius-lg);padding:26px 18px;text-align:center;transition:border-color .2s,background .2s;background:rgb(var(--accent-rgb)/.04)}',
    '.bsa-drop.over{border-color:var(--accent);background:var(--accent-soft)}',
    '.bsa-drop-title{font-weight:650;font-size:1.05em}',
    '.bsa-drop .bsa-actions{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:14px}',
    '.bsa-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:12px;margin-top:16px}',
    '.bsa-tile{position:relative;aspect-ratio:16/10;border-radius:var(--radius);overflow:hidden;background-size:cover;background-position:center;border:1px solid var(--border);box-shadow:var(--shadow-sm)}',
    '.bsa-tile.cur{outline:2px solid var(--accent);outline-offset:2px}',
    // Galerie d'ambiances créées pour vous
    '.bsa-gchips{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}',
    '.bsa-gchip{padding:5px 12px;border-radius:999px;border:1px solid var(--border);background:var(--surface);color:var(--text-2);font:inherit;font-size:12.5px;font-weight:600;cursor:pointer}',
    '.bsa-gchip.on{background:var(--accent);border-color:var(--accent);color:var(--on-accent,#fff)}',
    '.bsa-gchip small{opacity:.7;margin-left:4px}',
    '.bsa-ggrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;margin-top:14px}',
    '.bsa-gtile{position:relative;aspect-ratio:16/9;border-radius:var(--radius);overflow:hidden;background:linear-gradient(135deg,rgb(var(--text-rgb)/.08),rgb(var(--text-rgb)/.02));background-size:cover;background-position:center;border:1px solid var(--border);box-shadow:var(--shadow-sm)}',
    '.bsa-gtile .bsa-name{position:absolute;left:0;right:0;bottom:0;padding:22px 10px 8px;font-size:12.5px;font-weight:650;color:#fff;background:linear-gradient(transparent,rgb(0 0 0/.75));display:flex;align-items:center;gap:6px}',
    '.bsa-gtile .bsa-cat{font-size:10px;font-weight:750;letter-spacing:.04em;text-transform:uppercase;padding:2px 7px;border-radius:99px;background:rgb(255 255 255/.18);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}',
    '.bsa-gtile .bsa-cat.ia{background:rgb(var(--accent-rgb)/.85)}',
    '.bsa-gtile .bsa-gact{position:absolute;right:8px;top:8px;display:flex;gap:6px}',
    '.bsa-gtile .bsa-gact button{height:30px;padding:0 10px;border-radius:9px;border:1px solid rgb(255 255 255/.25);background:rgb(0 0 0/.55);color:#fff;font:inherit;font-size:12px;font-weight:650;cursor:pointer;display:inline-flex;align-items:center;gap:5px;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}',
    '.bsa-gtile .bsa-gact button.add{background:var(--accent);border-color:transparent;color:var(--on-accent,#fff)}',
    '.bsa-gtile .bsa-gact button:disabled{opacity:.5;cursor:default}',
    '.bsa-gtile .bsa-wait{position:absolute;inset:0;display:grid;place-items:center;font-size:12px;color:var(--text-3)}',
    '.bsa-tile .bsa-name{position:absolute;left:0;right:0;bottom:0;padding:18px 8px 6px;font-size:12px;font-weight:600;color:#fff;background:linear-gradient(transparent,rgb(0 0 0/.7));white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.bsa-tile .bsa-badges{position:absolute;left:6px;top:6px;display:flex;gap:4px}',
    '.bsa-tile .bsa-badge{font-size:10.5px;font-weight:700;padding:2px 7px;border-radius:99px;background:rgb(0 0 0/.55);color:#fff}',
    '.bsa-tile .bsa-badge.acc{background:var(--accent);color:var(--on-accent)}',
    '.bsa-tile .bsa-tools{position:absolute;right:6px;top:6px;display:flex;gap:4px;opacity:0;transition:opacity .15s}',
    '.bsa-tile:hover .bsa-tools,.bsa-tile:focus-within .bsa-tools{opacity:1}',
    '@media (hover:none){.bsa-tile .bsa-tools{opacity:1}}',
    '.bsa-tile .bsa-tools button{width:28px;height:28px;border-radius:8px;border:0;background:rgb(0 0 0/.6);color:#fff;cursor:pointer;display:grid;place-items:center}',
    '.bsa-tile .bsa-tools button:hover{background:rgb(0 0 0/.85)}',
    '.bsa-tile .bsa-tools button.danger:hover{background:#c0392b}',
    '.bsa-msg{margin-top:10px;font-size:.88em;color:var(--text-2)}',
    '.bsa-msg.err{color:var(--bad,#e5484d)}',
    '.bsa-range{display:flex;align-items:center;gap:10px}',
    '.bsa-range output{min-width:52px;text-align:right;font-variant-numeric:tabular-nums;color:var(--text-2);font-size:.9em}',
    '.bsa-preview{position:relative;height:150px;border-radius:var(--radius-lg);overflow:hidden;margin-top:6px;background-size:cover;background-position:center;border:1px solid var(--border)}',
    '.bsa-preview .bsa-pv-veil{position:absolute;inset:0}',
    '.bsa-preview .bsa-pv-card{position:absolute;left:16px;top:16px;bottom:16px;width:46%;border-radius:var(--radius);background:rgb(var(--surface-rgb)/.84);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border:1px solid var(--border);padding:12px 14px;font-size:12px}',
    '.bsa-preview .bsa-pv-card b{display:block;font-size:14px;margin-bottom:4px}',
    '.bsa-lock{display:flex;gap:8px;align-items:center;font-size:.88em;color:var(--text-2);margin-bottom:10px}',
  ].join('\n');

  var layer = null, slides = [], flip = 0, preloaded = {};
  function ensureLayer() {
    if (!document.getElementById('bs-amb-css')) {
      var st = document.createElement('style'); st.id = 'bs-amb-css'; st.textContent = CSS;
      (document.head || document.documentElement).appendChild(st);
    }
    if (layer || !document.body) return;
    layer = document.createElement('div'); layer.id = 'bs-amb'; layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = '<div class="bs-amb-slide a"></div><div class="bs-amb-slide b"></div><canvas class="bs-vie"></canvas><div class="bs-amb-veil"></div>';
    document.body.insertBefore(layer, document.body.firstChild);
    slides = [layer.children[0], layer.children[1]];
    vieFond = makeVie(layer.querySelector('.bs-vie'), { hd: false, density: 0.7 });
  }
  function preload(url) {
    if (preloaded[url]) return preloaded[url];
    preloaded[url] = new Promise(function (res) {
      var im = new Image(); im.onload = im.onerror = function () { res(); }; im.src = url;
      if (im.decode) im.decode().then(res, res);
    });
    return preloaded[url];
  }
  function show(id) {
    if (!id || !urls[id]) return;
    current = id;
    var url = urls[id].full;
    preload(url).then(function () {
      if (current !== id) return;
      ensureLayer();
      var css = 'url("' + url + '")';
      document.documentElement.style.setProperty('--bs-amb-img', css);
      if (slides.length) {
        var next = slides[flip = 1 - flip], prev = slides[1 - flip];
        next.style.backgroundImage = css;
        next.classList.remove('on'); void next.offsetWidth; next.classList.add('on');
        camera(next);
        prev.classList.remove('on');
      }
      if (vieFond) vieFond.image(imageOf(id));
      zenShow(id);
      emit();
    });
    // Image suivante préchargée pour un fondu sans à-coup.
    var i = order.indexOf(id);
    if (order.length > 1 && urls[order[(i + 1) % order.length]]) preload(urls[order[(i + 1) % order.length]].full);
  }
  function apply(repick) {
    ensureLayer();
    var h = document.documentElement, c = state.config, on = active();
    h.classList.toggle('bs-amb-on', on);
    h.classList.toggle('bs-amb-fond', on && !!c.fond);
    h.classList.toggle('bs-amb-hero', on && !!c.banniere);
    h.classList.toggle('bs-amb-splash', on && !!c.demarrage);
    h.classList.toggle('bs-amb-kb', !!c.mouvement);
    h.style.setProperty('--bs-amb-voile', String(clamp(c.voile, 0, 95, 58) / 100));
    h.style.setProperty('--bs-amb-flou', clamp(c.flou, 0, 24, 0) + 'px');
    clearInterval(timer); timer = null;
    vieFondSync();
    if (!on) { current = ''; h.style.removeProperty('--bs-amb-img'); slides.forEach(function (s) { s.classList.remove('on'); }); return; }
    var want = pick();
    if (repick || want !== current || !h.style.getPropertyValue('--bs-amb-img')) show(want);
    if (c.mode === 'diaporama' && state.images.length > 1)
      timer = setInterval(function () { if (!document.hidden) step(1); }, clamp(c.intervalle, 8, 900, 40) * 1000);
  }

  // ---------------------------------------------------------------- images vivantes
  // Un calque de lumière animé se pose sur l'image, selon son sujet : étoiles qui scintillent et étoiles filantes
  // (nuits), flux de particules et impulsions (scènes d'intelligence artificielle), reflets sur l'eau et brume
  // (mer, lac), poussières dorées et brume chaude (couchers de soleil, dunes), halos de lumière (vos photos).
  // 30 images/s au plus, en pause quand l'onglet est caché ; rien ne bouge si « réduire les animations » est actif.
  var TAU = Math.PI * 2;
  var VIE_SUJET = { 'Aurore boréale': 'nuit', 'Ville de nuit': 'nuit', 'Horizon marin': 'eau', 'Lac miroir': 'eau',
    'Crépuscule sur les crêtes': 'or', 'Dunes dorées': 'or', 'Globe connecté': 'globe' };
  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reducedMotion() { return document.documentElement.getAttribute('data-motion') === 'reduced' || !!(mqReduce && mqReduce.matches); }
  function imageOf(id) { return state.images.filter(function (i) { return i.id === id; })[0] || null; }
  function sujetOf(img) {
    if (!img) return 'photo';
    if (VIE_SUJET[img.nom]) return VIE_SUJET[img.nom];
    var sc = scenes().filter(function (s) { return s.nom === img.nom; })[0];
    return !sc ? 'photo' : sc.cat === 'IA' ? 'ia' : sc.cat === 'Espace' ? 'nuit' : 'or';
  }
  function rgbOf(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(hex || ''));
    if (!m) return [255, 236, 205];
    var v = parseInt(m[1], 16);
    return [v >> 16 & 255, v >> 8 & 255, v & 255];
  }
  function toward(c, t, k) { return [c[0] + (t[0] - c[0]) * k, c[1] + (t[1] - c[1]) * k, c[2] + (t[2] - c[2]) * k]; }
  function vRgba(c, a) { return 'rgba(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')'; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  var WHITE = [255, 255, 255], GOLD = [255, 210, 140];
  var IA_COLS = [[110, 200, 255], [150, 130, 255], [90, 240, 215]];

  // Mouvement de caméra : une trajectoire différente à chaque image (zoom avant, recul, travelling, plongée).
  var KB = ['kb-a', 'kb-b', 'kb-c', 'kb-d'];
  function camera(el) {
    var box = el.parentNode, last = box && box.__bsKb != null ? box.__bsKb : -1; // jamais deux fois la même à la suite
    KB.forEach(function (k) { el.classList.remove(k); });
    void el.offsetWidth; // repart du début de la trajectoire
    var i = Math.floor(Math.random() * (last < 0 ? KB.length : KB.length - 1));
    if (last >= 0 && i >= last) i++;
    if (box) box.__bsKb = i;
    el.classList.add(KB[i]);
  }

  // o : hd (netteté écran Retina, pour le plein écran), density (0..1, nombre de particules).
  function makeVie(canvas, o) {
    var x = canvas.getContext('2d'), W = 0, H = 0, sujet = '', tint = [255, 236, 205];
    var P = [], F = [], raf = 0, last = 0, on = false, blank = true, clock = 0, nextFx = 0, swapT = 0;
    function size() {
      var r = canvas.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, o.hd ? 1.5 : 1);
      W = r.width; H = r.height;
      var w = Math.max(1, Math.round(W * d)), h = Math.max(1, Math.round(H * d));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      x.setTransform(d, 0, 0, d, 0, 0);
    }
    function count(per, cap) { return Math.max(4, Math.round(Math.min(cap, W * H / per) * (o.density || 1))); }
    function iaPart() {
      return { x: Math.random() * W, y: Math.random() * H, age: 0, life: rnd(4, 9), v: rnd(28, 70), r: rnd(0.8, 2), c: toward(IA_COLS[Math.floor(Math.random() * 3)], tint, 0.2), fresh: true };
    }
    function glint(first) {
      var dep = Math.pow(Math.random(), 0.8), y = H * (0.6 + dep * 0.4);
      // Plus serrés autour du centre : le chemin de lumière sur l'eau.
      return { x: W * (0.5 + (Math.random() - 0.5) * (0.35 + dep * 0.9)), y: y, w: 2 + dep * rnd(4, 18),
        age: -(first ? rnd(0, 2) : rnd(0.1, 1.8)), life: rnd(0.35, 1.1), a: rnd(0.4, 0.95) * (1 - dep * 0.35) };
    }
    function mote(first) {
      return { x: Math.random() * W, y: first ? Math.random() * H : H + 10, r: Math.random() < 0.8 ? rnd(0.7, 1.8) : rnd(2, 3.2),
        vy: -rnd(5, 16), sw: rnd(6, 22), sf: rnd(0.15, 0.5), p: rnd(0, TAU), a: rnd(0.25, 0.75), f: rnd(0.8, 2.2) };
    }
    function seed() {
      P = []; F = []; nextFx = clock + rnd(1.5, 4);
      var i, n;
      if (sujet === 'nuit') {
        n = count(6500, 170);
        for (i = 0; i < n; i++) P.push({ x: Math.random() * W, y: Math.pow(Math.random(), 1.4) * H * 0.5, r: Math.random() < 0.88 ? rnd(0.5, 1.3) : rnd(1.5, 2.3), a: rnd(0.35, 0.95), f: rnd(0.5, 2.6), p: rnd(0, TAU) });
      } else if (sujet === 'ia') {
        n = count(11000, 120);
        for (i = 0; i < n; i++) { var q = iaPart(); q.age = rnd(0, q.life); P.push(q); }
      } else if (sujet === 'eau') {
        n = count(5500, 150);
        for (i = 0; i < n; i++) P.push(glint(true));
        for (i = 0; i < 4; i++) F.push({ x: Math.random() * W, y: H * rnd(0.5, 0.66), w: W * rnd(0.45, 0.9), h: H * rnd(0.05, 0.1), v: rnd(5, 13) * (Math.random() < 0.5 ? -1 : 1), a: rnd(0.05, 0.09) });
      } else {
        var photo = sujet !== 'or';
        n = count(photo ? 15000 : 11000, photo ? 70 : 100);
        for (i = 0; i < n; i++) P.push(mote(true));
        var nb = photo ? Math.round(Math.min(18, W * H / 70000) * (o.density || 1)) + 4 : 3;
        for (i = 0; i < nb; i++) F.push({ x: Math.random() * W, y: Math.random() * H, r: photo ? rnd(30, 90) : rnd(W * 0.15, W * 0.3),
          vx: rnd(-6, 6), vy: rnd(-7, -1.5), a: photo ? rnd(0.05, 0.12) : rnd(0.035, 0.06), f: rnd(0.15, 0.4), p: rnd(0, TAU) });
      }
    }
    function dot(cx, cy, r, style) { x.fillStyle = style; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill(); }
    function soft(cx, cy, r, c, a, edge) {
      var g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, vRgba(c, a)); g.addColorStop(edge || 0.5, vRgba(c, a * (edge ? 0.8 : 0.45))); g.addColorStop(1, vRgba(c, 0));
      x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    function drawNuit(dt, t) {
      x.clearRect(0, 0, W, H);
      P.forEach(function (s) {
        var k = 0.5 + 0.5 * Math.sin(t * s.f + s.p), al = s.a * (0.15 + 0.85 * k * k);
        if (s.r > 1.4) soft(s.x, s.y, s.r * 5, [200, 225, 255], al * 0.35);
        dot(s.x, s.y, s.r, vRgba(WHITE, al));
      });
      // Étoiles filantes, de temps en temps.
      if (t >= nextFx) {
        nextFx = t + rnd(3, 8);
        var left = Math.random() < 0.5;
        F.push({ x: W * rnd(0.15, 0.95), y: H * rnd(0.02, 0.3), ang: (left ? rnd(150, 165) : rnd(15, 30)) * Math.PI / 180, v: W * rnd(0.55, 0.9), len: rnd(110, 240), age: 0, life: rnd(0.7, 1.1) });
      }
      F = F.filter(function (f) {
        f.age += dt;
        if (f.age >= f.life) return false;
        var env = Math.sin(Math.PI * f.age / f.life), c = Math.cos(f.ang), s = Math.sin(f.ang);
        var hx = f.x + c * f.v * f.age, hy = f.y + s * f.v * f.age, tx = hx - c * f.len, ty = hy - s * f.len;
        var g = x.createLinearGradient(tx, ty, hx, hy);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, vRgba(WHITE, 0.9 * env));
        x.strokeStyle = g; x.lineWidth = 1.6; x.lineCap = 'round';
        x.beginPath(); x.moveTo(tx, ty); x.lineTo(hx, hy); x.stroke();
        soft(hx, hy, 7, [210, 230, 255], 0.6 * env);
        return true;
      });
    }
    function drawIa(dt, t) {
      // Traînées : l'image précédente s'efface doucement au lieu d'être effacée d'un coup.
      x.globalCompositeOperation = 'destination-out'; x.fillStyle = 'rgba(0,0,0,0.16)'; x.fillRect(0, 0, W, H);
      x.globalCompositeOperation = 'lighter';
      for (var i = 0; i < P.length; i++) {
        var p = P[i];
        p.age += dt;
        if (p.age > p.life || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) { P[i] = iaPart(); continue; }
        var ang = Math.sin(p.x * 0.0023 + t * 0.12) * 1.2 + Math.cos(p.y * 0.0031 - t * 0.08) * 1.4 - 0.35;
        var nx = p.x + Math.cos(ang) * p.v * dt, ny = p.y + Math.sin(ang) * p.v * dt;
        var env = Math.sin(Math.PI * Math.min(1, p.age / p.life));
        if (!p.fresh) {
          x.strokeStyle = vRgba(toward(p.c, WHITE, 0.25), 0.85 * env); x.lineWidth = p.r; x.lineCap = 'round';
          x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(nx, ny); x.stroke();
        }
        p.fresh = false; p.x = nx; p.y = ny;
      }
      // Impulsions : un nœud s'allume et envoie une onde.
      if (t >= nextFx && P.length) {
        nextFx = t + rnd(1.2, 3.5);
        var src = P[Math.floor(Math.random() * P.length)];
        F.push({ x: src.x, y: src.y, age: 0, life: 1.8, c: src.c });
      }
      F = F.filter(function (f) {
        f.age += dt;
        if (f.age >= f.life) return false;
        var k = f.age / f.life, rad = 6 + 70 * (1 - Math.pow(1 - k, 3));
        x.strokeStyle = vRgba(f.c, 0.45 * (1 - k)); x.lineWidth = 1.3;
        x.beginPath(); x.arc(f.x, f.y, rad, 0, TAU); x.stroke();
        dot(f.x, f.y, 2.2, vRgba(WHITE, 0.9 * (1 - k)));
        return true;
      });
      x.globalCompositeOperation = 'source-over';
    }
    function drawEau(dt) {
      x.clearRect(0, 0, W, H);
      var mist = toward(tint, WHITE, 0.8), glow = toward([255, 248, 230], tint, 0.15);
      F.forEach(function (f) {
        f.x += f.v * dt;
        if (f.v > 0 && f.x - f.w > W) f.x = -f.w; else if (f.v < 0 && f.x + f.w < 0) f.x = W + f.w;
        x.save(); x.translate(f.x, f.y); x.scale(1, f.h / f.w); soft(0, 0, f.w, mist, f.a); x.restore();
      });
      for (var i = 0; i < P.length; i++) {
        var g = P[i];
        g.age += dt;
        if (g.age >= g.life) { P[i] = glint(false); continue; }
        if (g.age < 0) continue;
        var s = Math.sin(Math.PI * g.age / g.life), al = g.a * s * s;
        x.fillStyle = vRgba(glow, al); x.fillRect(g.x - g.w / 2, g.y - 0.6, g.w, 1.3);
        x.fillStyle = vRgba(WHITE, al); x.fillRect(g.x - g.w / 6, g.y - 0.8, g.w / 3, 1.6);
      }
    }
    function drawOr(dt, t) {
      x.clearRect(0, 0, W, H);
      var photo = sujet !== 'or';
      var halo = photo ? toward(tint, WHITE, 0.55) : GOLD, col = photo ? toward(tint, WHITE, 0.7) : [255, 214, 150];
      F.forEach(function (f) {
        f.x += f.vx * dt; f.y += f.vy * dt;
        if (f.x < -f.r) f.x = W + f.r; else if (f.x > W + f.r) f.x = -f.r;
        if (f.y < -f.r) f.y = H + f.r;
        var al = f.a * (0.6 + 0.4 * Math.sin(t * f.f + f.p));
        soft(f.x, f.y, f.r, halo, al, photo ? 0.72 : 0);
      });
      for (var i = 0; i < P.length; i++) {
        var m = P[i];
        m.y += m.vy * dt;
        if (m.y < -10) { P[i] = mote(false); continue; }
        var mx = m.x + Math.sin(t * m.sf + m.p) * m.sw, tw = 0.5 + 0.5 * Math.sin(t * m.f + m.p), al = m.a * (0.45 + 0.55 * tw);
        if (m.r > 1.9) dot(mx, m.y, m.r * 3.5, vRgba(col, al * 0.18));
        dot(mx, m.y, m.r, vRgba(col, al));
      }
    }
    function frame(ts) {
      raf = requestAnimationFrame(frame);
      if (document.hidden) { last = 0; return; }
      if (last && ts - last < 31) return;
      var dt = last ? Math.min(0.1, (ts - last) / 1000) : 0.033;
      last = ts;
      if (reducedMotion() || sujet === 'globe') { if (!blank) { x.clearRect(0, 0, W, H); blank = true; } return; }
      clock += dt; blank = false;
      if (sujet === 'nuit') drawNuit(dt, clock);
      else if (sujet === 'ia') drawIa(dt, clock);
      else if (sujet === 'eau') drawEau(dt, clock);
      else drawOr(dt, clock);
    }
    function run(want) {
      want = !!want;
      if (want === on) return;
      on = want;
      clearTimeout(swapT); canvas.style.opacity = '';
      if (on) { size(); seed(); last = 0; raf = requestAnimationFrame(frame); }
      else { cancelAnimationFrame(raf); raf = 0; x.clearRect(0, 0, W, H); blank = true; }
      syncGlobe();
    }
    // « Globe connecté » : la planète devient un vrai globe 3D qui tourne tout seul ; en mode immersion, on la
    // fait tourner à la souris (ou au doigt) et on zoome à la molette.
    var globe = null, globeEl = null;
    function syncGlobe() {
      var want = on && sujet === 'globe' && !!window.bsGlobe && !reducedMotion();
      if (want && !globe) {
        globeEl = document.createElement('canvas');
        globeEl.className = 'bs-vie bs-vie-globe' + (o.interactive ? ' live' : '');
        canvas.parentNode.insertBefore(globeEl, canvas.nextSibling);
        var deco = (window.bsVilles || []).slice(0, 26).map(function (v, i) { return { lon: v[0], lat: v[1], color: i % 4 ? '#7cc4ff' : '#fbbf24', size: 0.55 }; });
        globe = window.bsGlobe.create(globeEl, { interactive: !!o.interactive, zoom: !!o.interactive, center: [0.6, 0.53], radius: 0.43, lon: 15, lat: 26,
          autoRotate: 7, density: o.hd ? 1 : 0.7, labels: false, markers: deco, hub: { lon: 2.35, lat: 48.85 }, minZoom: 0.8, maxZoom: 2.5 });
      } else if (!want && globe) { globe.destroy(); globeEl.remove(); globe = globeEl = null; }
    }
    // Nouvelle image : le calque s'efface, change de sujet, puis revient.
    function image(img) {
      var s = sujetOf(img), c = rgbOf(img && img.couleur);
      if (s === sujet && c.join() === tint.join()) return;
      if (!on) { sujet = s; tint = c; return; }
      canvas.style.opacity = '0';
      clearTimeout(swapT);
      swapT = setTimeout(function () { sujet = s; tint = c; x.clearRect(0, 0, W, H); seed(); canvas.style.opacity = ''; syncGlobe(); }, 700);
    }
    function onResize() { if (on) { size(); seed(); } }
    window.addEventListener('resize', onResize);
    return { run: run, image: image, stop: function () { run(false); window.removeEventListener('resize', onResize); } };
  }
  var vieFond = null, vieZen = null;
  function vieFondSync() {
    if (!vieFond) return;
    var c = state.config, want = active() && !!c.fond && !!c.mouvement && !zen;
    if (want) vieFond.image(imageOf(current || pick()));
    vieFond.run(want);
  }
  function parallax(e) {
    if (!zen || reducedMotion()) return;
    var par = zen.querySelector('.z-par');
    if (!par) return;
    if (zen.querySelector('.bs-vie-globe')) { par.style.transform = ''; return; } // le globe se manipule : pas de relief
    var dx = e.clientX / window.innerWidth - 0.5, dy = e.clientY / window.innerHeight - 0.5;
    par.style.transform = 'translate3d(' + (-dx * 2.4).toFixed(2) + '%,' + (-dy * 2.4).toFixed(2) + '%,0)';
  }

  // ---------------------------------------------------------------- bouton « Immersion » sur la bannière
  var ICON = {
    plus: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    shuffle: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>',
    sparkles: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 3v4M17 5h4M5 17v4M3 19h4"/></svg>',
    prev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>',
    next: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>',
    pause: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    play: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z"/></svg>',
    full: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    pin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5M9 3h6l-1 6 3 3v2H7v-2l3-3z"/></svg>',
    eye: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
    lock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  };
  function decorateHero() {
    var heroes = document.querySelectorAll('#main .hero');
    for (var i = 0; i < heroes.length; i++) {
      if (heroes[i].querySelector('.bs-amb-zen-btn')) continue;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'bs-amb-zen-btn'; b.title = 'Mode immersion (touche I)';
      b.innerHTML = ICON.sparkles + '<span>Immersion</span>';
      b.addEventListener('click', function (e) { e.preventDefault(); immersion(); });
      heroes[i].appendChild(b);
    }
  }

  // ---------------------------------------------------------------- mode immersion
  var QUOTES = [
    'Chaque appel est une graine : certaines poussent aujourd’hui, d’autres dans trois mois.',
    'Le prochain « oui » est peut-être au bout du prochain numéro.',
    'Un « non » aujourd’hui, c’est souvent un « pas encore ».',
    'Ton pipeline d’aujourd’hui, c’est ton chiffre d’affaires de demain.',
    'Relancer, ce n’est pas déranger : c’est tenir parole.',
    'Respire, souris, compose. Au téléphone, le sourire s’entend.',
    'Écoute plus que tu ne parles : le client te dira comment l’aider.',
    'Petites actions chaque jour, grands résultats chaque trimestre.',
    'Concentre-toi sur la prochaine action, pas sur toute la montagne.',
    'Un bon devis part le jour même.',
    'La régularité bat le talent quand le talent ne décroche pas.',
    'Tu ne vends pas un produit, tu règles un problème.',
  ];
  var zen = null, zenSlides = [], zenFlip = 0, zenPaused = false, zenTimer = null, zenClock = null, zenIdle = null, zenQuote = 0;
  var focus = { end: 0, total: 25 * 60, tick: null };

  function storeState() {
    var s = window.__bs && window.__bs.R ? window.__bs.R : window.__bsStore;
    try { return s && s.get ? s.get() : null; } catch (e) { return null; }
  }
  function todayStr() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function dayChips() {
    var s = storeState(); if (!s) return [];
    var t = todayStr(), now = new Date(), hm = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
    var pros = s.prospects || [], tasks = s.tasks || [];
    var rdv = pros.filter(function (p) { return p.statut === 'rdv_pris' && p.prochaineRelance === t; });
    var rappels = pros.filter(function (p) { return p.statut !== 'rdv_pris' && p.prochaineRelance && p.prochaineRelance <= t && !/gagn|perdu|client|refus/i.test(p.statut || ''); });
    var todo = tasks.filter(function (x) { return !x.done && x.due && x.due <= t; });
    var next = rdv.filter(function (p) { return (p.prochaineRelanceHeure || '') >= hm; })
      .sort(function (a, b) { return (a.prochaineRelanceHeure || '').localeCompare(b.prochaineRelanceHeure || ''); })[0];
    var out = [];
    if (next) out.push('Prochain RDV ' + (next.prochaineRelanceHeure || '') + ' · ' + (next.entreprise || next.nom || 'prospect'));
    else if (rdv.length) out.push(rdv.length + ' RDV aujourd’hui');
    if (rappels.length) out.push(rappels.length + ' rappel' + (rappels.length > 1 ? 's' : '') + ' à passer');
    if (todo.length) out.push(todo.length + ' tâche' + (todo.length > 1 ? 's' : '') + ' du jour');
    if (!out.length) out.push('Rien d’urgent : journée libre pour prospecter');
    return out;
  }
  var userName = '';
  function firstName() {
    var s = storeState(), n = userName || (s && s.companyInfo && s.companyInfo.expediteur) || '';
    return String(n).trim().split(/[\s—-]+/)[0] || '';
  }
  function hello() {
    var h = new Date().getHours(), n = firstName();
    var base = h < 5 ? 'Bonne nuit' : h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
    return base + (n ? ', ' + n : '') + '.';
  }
  function fmtTime(sec) { sec = Math.max(0, Math.round(sec)); return Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2); }

  function immersion() {
    if (!state.images.length) { toast('Ajoutez d’abord une image dans Réglages › Ambiance.'); return; }
    if (zen) return;
    ensureLayer();
    zen = document.createElement('div'); zen.id = 'bs-amb-zen'; zen.setAttribute('role', 'dialog'); zen.setAttribute('aria-label', 'Mode immersion');
    zen.innerHTML =
      '<div class="z-par"><div class="bs-amb-slide a"></div><div class="bs-amb-slide b"></div><canvas class="bs-vie"></canvas></div><div class="z-sweep"></div><div class="z-shade"></div>' +
      '<div class="z-top"><span class="z-brand">BLACKSTART AI</span><div class="z-actions">' +
      '<button class="z-ic" data-z="prev" title="Image précédente (←)">' + ICON.prev + '</button>' +
      '<button class="z-ic" data-z="pause" title="Pause (Espace)">' + ICON.pause + '</button>' +
      '<button class="z-ic" data-z="next" title="Image suivante (→)">' + ICON.next + '</button>' +
      '<button class="z-ic" data-z="full" title="Plein écran (F)">' + ICON.full + '</button>' +
      '<button class="z-ic" data-z="close" title="Quitter (Échap)">' + ICON.close + '</button></div></div>' +
      '<div class="z-center"><div class="z-clock"></div><div class="z-date"></div><div class="z-hello"></div><div class="z-day"></div><p class="z-quote"></p></div>' +
      '<div class="z-bottom"><div class="z-focus"></div><div class="z-cap"><div class="z-name"></div><div class="z-keys">← → changer d’image · Espace pause · F plein écran · Échap quitter</div></div></div>';
    document.body.appendChild(zen);
    zenSlides = Array.prototype.slice.call(zen.querySelectorAll('.z-par > .bs-amb-slide'));
    vieZen = makeVie(zen.querySelector('.z-par .bs-vie'), { hd: true, density: 1, interactive: true });
    vieZen.image(imageOf(current || pick()));
    vieZen.run(true);
    vieFondSync(); // le fond se met en pause derrière l'immersion
    zen.addEventListener('click', function (e) {
      var b = e.target.closest('[data-z]'); if (!b) return;
      var a = b.getAttribute('data-z');
      if (a === 'close') closeZen();
      else if (a === 'next') zenStep(1);
      else if (a === 'prev') zenStep(-1);
      else if (a === 'pause') togglePause();
      else if (a === 'full') toggleFull();
      else if (a === 'focus') startFocus();
      else if (a === 'stop') stopFocus();
    });
    zen.addEventListener('mousemove', wake);
    zen.addEventListener('mousemove', parallax);
    zen.addEventListener('touchstart', wake, { passive: true });
    zenQuote = Math.floor(Math.random() * QUOTES.length);
    zen.querySelector('.z-hello').textContent = hello();
    zenRender(); renderFocus();
    zen.querySelector('.z-quote').textContent = QUOTES[zenQuote];
    zenShow(current || pick());
    zenClock = setInterval(function () {
      zenRender();
      if (new Date().getSeconds() === 0) zen.querySelector('.z-day').innerHTML = dayChips().map(function (c) { return '<span class="z-chip">' + esc(c) + '</span>'; }).join('');
    }, 1000);
    zenTimer = setInterval(function () { if (!zenPaused) zenStep(1, true); }, Math.min(25, clamp(state.config.intervalle, 8, 900, 40)) * 1000);
    zen.querySelector('.z-day').innerHTML = dayChips().map(function (c) { return '<span class="z-chip">' + esc(c) + '</span>'; }).join('');
    requestAnimationFrame(function () { zen && zen.classList.add('on'); });
    wake();
  }
  function zenRender() {
    if (!zen) return;
    var d = new Date();
    zen.querySelector('.z-clock').textContent = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    zen.querySelector('.z-date').textContent = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  function zenShow(id) {
    if (!zen || !id || !urls[id]) return;
    preload(urls[id].full).then(function () {
      if (!zen) return;
      var css = 'url("' + urls[id].full + '")';
      var next = zenSlides[zenFlip = 1 - zenFlip], prev = zenSlides[1 - zenFlip];
      next.style.backgroundImage = css; next.classList.remove('on'); void next.offsetWidth; next.classList.add('on'); camera(next); prev.classList.remove('on');
      if (vieZen) vieZen.image(imageOf(id));
      var img = state.images.filter(function (i) { return i.id === id; })[0];
      var ids = state.images.map(function (i) { return i.id; });
      zen.querySelector('.z-name').textContent = (img ? img.nom : '') + (ids.length > 1 ? '  ·  ' + (ids.indexOf(id) + 1) + '/' + ids.length : '');
    });
  }
  function zenStep(dir, auto) {
    if (!order.length) return;
    var i = order.indexOf(current);
    show(order[(i + dir + order.length) % order.length]);
    if (zen) {
      var q = zen.querySelector('.z-quote');
      q.style.opacity = 0;
      setTimeout(function () { if (!zen) return; zenQuote = (zenQuote + 1) % QUOTES.length; q.textContent = QUOTES[zenQuote]; q.style.opacity = ''; }, 700);
      if (!auto) wake();
    }
  }
  function togglePause() {
    zenPaused = !zenPaused;
    var b = zen && zen.querySelector('[data-z="pause"]');
    if (b) { b.innerHTML = zenPaused ? ICON.play : ICON.pause; b.title = zenPaused ? 'Reprendre (Espace)' : 'Pause (Espace)'; }
  }
  function toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    else if (zen && zen.requestFullscreen) zen.requestFullscreen().catch(function () {});
  }
  function wake() {
    if (!zen) return;
    zen.classList.remove('idle');
    clearTimeout(zenIdle);
    zenIdle = setTimeout(function () { zen && zen.classList.add('idle'); }, 3500);
  }
  function closeZen() {
    if (!zen) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    clearInterval(zenClock); clearInterval(zenTimer); clearTimeout(zenIdle);
    var z = zen; zen = null; z.classList.remove('on');
    if (vieZen) { vieZen.stop(); vieZen = null; }
    vieFondSync();
    setTimeout(function () { z.remove(); }, 450);
  }
  function renderFocus() {
    if (!zen) return;
    var box = zen.querySelector('.z-focus');
    var R = 23, C = 2 * Math.PI * R;
    if (!focus.end) {
      box.innerHTML = '<svg class="z-ring" viewBox="0 0 54 54"><circle cx="27" cy="27" r="' + R + '" stroke="rgb(255 255 255/.25)"/></svg>' +
        '<div class="z-ftxt"><span>Session d’appels</span><strong>25:00</strong></div>' +
        '<button class="z-fbtn" data-z="focus">Lancer</button>';
      return;
    }
    var left = (focus.end - Date.now()) / 1000, k = Math.max(0, Math.min(1, left / focus.total));
    box.innerHTML = '<svg class="z-ring" viewBox="0 0 54 54" style="transform:rotate(-90deg)"><circle cx="27" cy="27" r="' + R + '" stroke="rgb(255 255 255/.25)"/>' +
      '<circle cx="27" cy="27" r="' + R + '" stroke="#fff" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - k)).toFixed(1) + '"/></svg>' +
      '<div class="z-ftxt"><span>Session en cours : on enchaîne !</span><strong>' + fmtTime(left) + '</strong></div>' +
      '<button class="z-fbtn ghost" data-z="stop">Arrêter</button>';
  }
  function startFocus() {
    focus.end = Date.now() + focus.total * 1000;
    clearInterval(focus.tick);
    focus.tick = setInterval(function () {
      if (Date.now() >= focus.end) { endFocus(); return; }
      renderFocus();
    }, 1000);
    renderFocus();
    if (window.Notification && Notification.permission === 'default') Notification.requestPermission().catch(function () {});
  }
  function stopFocus() { clearInterval(focus.tick); focus.end = 0; renderFocus(); }
  function endFocus() {
    stopFocus(); chime();
    var msg = 'Session d’appels terminée. Bravo ! Prends 5 minutes, puis on repart.';
    toast(msg);
    try { if (window.Notification && Notification.permission === 'granted' && document.hidden) new Notification('Blackstart CRM', { body: msg }); } catch (e) {}
  }
  function chime() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return;
      var ac = new Ctx(), t = ac.currentTime;
      [659.25, 783.99, 1046.5].forEach(function (f, i) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine'; o.frequency.value = f; o.connect(g); g.connect(ac.destination);
        g.gain.setValueAtTime(0.0001, t + i * 0.18); g.gain.exponentialRampToValueAtTime(0.25, t + i * 0.18 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.18 + 1.2);
        o.start(t + i * 0.18); o.stop(t + i * 0.18 + 1.3);
      });
    } catch (e) {}
  }
  function toast(msg) {
    var t = document.createElement('div'); t.className = 'bs-amb-toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    (zen || document.body).appendChild(t);
    setTimeout(function () { t.remove(); }, 4500);
  }

  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    var typing = /INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable);
    if (zen) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeZen(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); zenStep(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); zenStep(-1); }
      else if (e.key === ' ') { e.preventDefault(); togglePause(); }
      else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFull(); }
      e.stopPropagation();
      return;
    }
    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
    if ((e.key === 'i' || e.key === 'I') && !document.querySelector('[role="dialog"]:not(#bs-amb-zen), .modal, .overlay')) {
      if (!state.images.length) return;
      e.preventDefault(); immersion();
    }
  }, true);

  // ---------------------------------------------------------------- ambiances générées (« Surprends-moi »)
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function ridge(x, w, h, base, amp, rough, r, color, steps) {
    var pts = [0, 0], n = 1 << (steps || 9);
    pts = new Array(n + 1); pts[0] = (r() - 0.5) * amp; pts[n] = (r() - 0.5) * amp;
    for (var size = n, a = amp; size > 1; size >>= 1, a *= rough)
      for (var i = size >> 1; i < n; i += size) pts[i] = (pts[i - (size >> 1)] + pts[i + (size >> 1)]) / 2 + (r() - 0.5) * a;
    x.beginPath(); x.moveTo(0, h);
    for (var j = 0; j <= n; j++) x.lineTo(j / n * w, base + pts[j]);
    x.lineTo(w, h); x.closePath(); x.fillStyle = color; x.fill();
  }
  function stars(x, w, hMax, count, r) {
    for (var i = 0; i < count; i++) {
      var s = r() < 0.92 ? r() * 1.4 + 0.3 : r() * 2.4 + 1.2;
      x.globalAlpha = 0.25 + r() * 0.75; x.fillStyle = r() < 0.15 ? '#cfe3ff' : '#ffffff';
      x.beginPath(); x.arc(r() * w, Math.pow(r(), 1.4) * hMax, s, 0, Math.PI * 2); x.fill();
    }
    x.globalAlpha = 1;
  }
  function vgrad(x, y0, y1, stops) { var g = x.createLinearGradient(0, y0, 0, y1); stops.forEach(function (s) { g.addColorStop(s[0], s[1]); }); return g; }
  var SCENES = [
    { id: 'aurore-boreale', nom: 'Aurore boréale', cat: 'Paysages', draw: function (x, w, h, r) {
      x.fillStyle = vgrad(x, 0, h, [[0, '#01040c'], [0.45, '#05132a'], [0.72, '#0b2c3f'], [1, '#03080f']]); x.fillRect(0, 0, w, h);
      stars(x, w, h * 0.7, 1400, r);
      // Les voiles sont dessinés en petit puis agrandis : l'agrandissement les adoucit, sans filtre de flou
      // (rapide même sur un ordinateur sans carte graphique).
      var K = 6, off = document.createElement('canvas'); off.width = Math.ceil(w / K); off.height = Math.ceil(h / K); var o = off.getContext('2d'); o.scale(1 / K, 1 / K);
      [[155, 0.34, 0.55, 260], [175, 0.26, 0.4, 200], [290, 0.22, 0.28, 150]].forEach(function (band) {
        var hue = band[0], yb = h * band[1], alpha = band[2], amp = band[3], ph = r() * 6, f = 0.0012 + r() * 0.0012;
        for (var px = -50; px < w + 50; px += 12) {
          var y = yb + Math.sin(px * f + ph) * amp + Math.sin(px * f * 2.7 + ph * 2) * amp * 0.35;
          var len = 220 + Math.sin(px * 0.004 + ph) * 140 + r() * 120;
          var g = x.createLinearGradient(0, y - len, 0, y + 40);
          g.addColorStop(0, 'hsla(' + (hue + 40) + ',90%,60%,0)');
          g.addColorStop(0.75, 'hsla(' + hue + ',95%,58%,' + (alpha * (0.5 + r() * 0.5)) + ')');
          g.addColorStop(1, 'hsla(' + hue + ',95%,70%,0)');
          o.fillStyle = g; o.fillRect(px, y - len, 18, len + 40);
        }
      });
      x.save(); x.globalCompositeOperation = 'screen'; x.imageSmoothingQuality = 'high'; x.drawImage(off, 0, 0, w, h); x.drawImage(off, 0, 0, w, h); x.restore();
      ridge(x, w, h, h * 0.74, h * 0.16, 0.55, r, '#0a1b2b');
      ridge(x, w, h, h * 0.82, h * 0.12, 0.5, r, '#050d17');
      x.fillStyle = vgrad(x, h * 0.86, h, [[0, '#04101c'], [1, '#02060c']]); x.fillRect(0, h * 0.88, w, h * 0.12);
      x.fillStyle = vgrad(x, h * 0.8, h * 0.9, [[0, 'rgba(90,200,190,0)'], [1, 'rgba(90,200,190,0.08)']]); x.fillRect(0, h * 0.8, w, h * 0.1);
    } },
    { id: 'crepuscule-cretes', nom: 'Crépuscule sur les crêtes', cat: 'Paysages', draw: function (x, w, h, r) {
      var hz = h * 0.6;
      x.fillStyle = vgrad(x, 0, hz, [[0, '#1b1847'], [0.35, '#5a2a6e'], [0.7, '#d4586a'], [1, '#f8b26a']]); x.fillRect(0, 0, w, h);
      var sx = w * (0.55 + r() * 0.2), sy = hz - h * 0.04;
      var glow = x.createRadialGradient(sx, sy, 10, sx, sy, w * 0.45);
      glow.addColorStop(0, 'rgba(255,236,180,0.95)'); glow.addColorStop(0.08, 'rgba(255,200,130,0.6)'); glow.addColorStop(0.4, 'rgba(255,140,110,0.18)'); glow.addColorStop(1, 'rgba(255,140,110,0)');
      x.fillStyle = glow; x.fillRect(0, 0, w, h);
      x.fillStyle = '#fff4d6'; x.beginPath(); x.arc(sx, sy, h * 0.045, 0, Math.PI * 2); x.fill();
      var cols = ['#c2607e', '#9b4a78', '#713a6d', '#4c2b5c', '#2e1d45', '#170f2b'];
      cols.forEach(function (c, i) {
        ridge(x, w, h, hz + i * h * 0.065 - h * 0.02, h * (0.12 + i * 0.02), 0.52, r, c);
        if (i < cols.length - 1) { x.fillStyle = vgrad(x, hz + i * h * 0.065 - h * 0.08, hz + i * h * 0.065 + h * 0.1, [[0, 'rgba(248,178,106,0)'], [1, 'rgba(248,178,106,0.10)']]); x.fillRect(0, 0, w, h); }
      });
      x.strokeStyle = 'rgba(30,15,40,0.75)'; x.lineWidth = 3; x.lineCap = 'round';
      for (var b = 0; b < 7; b++) {
        var bx = sx - w * 0.25 + r() * w * 0.3, by = h * (0.2 + r() * 0.2), s = 10 + r() * 14;
        x.beginPath(); x.moveTo(bx - s, by - s * 0.4); x.quadraticCurveTo(bx - s * 0.4, by - s * 0.5, bx, by); x.quadraticCurveTo(bx + s * 0.4, by - s * 0.5, bx + s, by - s * 0.4); x.stroke();
      }
    } },
    { id: 'ville-de-nuit', nom: 'Ville de nuit', cat: 'Paysages', draw: function (x, w, h, r) {
      var hz = h * 0.72;
      x.fillStyle = vgrad(x, 0, hz, [[0, '#040615'], [0.55, '#151140'], [0.85, '#3b1c5c'], [1, '#c2457a']]); x.fillRect(0, 0, w, h);
      stars(x, w, h * 0.45, 380, r);
      var mx = w * 0.18 + r() * w * 0.1, my = h * 0.18;
      var mg = x.createRadialGradient(mx, my, 10, mx, my, h * 0.3); mg.addColorStop(0, 'rgba(230,230,255,0.45)'); mg.addColorStop(1, 'rgba(230,230,255,0)');
      x.fillStyle = mg; x.fillRect(0, 0, w, h); x.fillStyle = '#f2f0ff'; x.beginPath(); x.arc(mx, my, h * 0.035, 0, Math.PI * 2); x.fill();
      function skyline(color, minH, maxH, winP, ctx) {
        var px = -20;
        while (px < w) {
          var bw = 50 + r() * 130, bh = minH + Math.pow(r(), 1.6) * (maxH - minH);
          ctx.fillStyle = color; ctx.fillRect(px, hz - bh, bw, bh);
          if (r() < 0.25) ctx.fillRect(px + bw * 0.45, hz - bh - 40 - r() * 60, 4, 60 + r() * 60);
          if (winP) for (var wy = hz - bh + 14; wy < hz - 10; wy += 22) for (var wx = px + 10; wx < px + bw - 12; wx += 16)
            if (r() < winP) { ctx.fillStyle = r() < 0.75 ? 'rgba(255,206,120,' + (0.55 + r() * 0.45) + ')' : 'rgba(130,215,255,' + (0.5 + r() * 0.4) + ')'; ctx.fillRect(wx, wy, 7, 11); }
          px += bw + (r() < 0.2 ? r() * 30 : 2);
        }
      }
      skyline('#1a1438', h * 0.12, h * 0.42, 0.12, x);
      skyline('#0b0a1f', h * 0.06, h * 0.3, 0.3, x);
      // Reflet dans l'eau
      // Copie tenant compte de l'échelle du dessin (miniatures de la galerie dessinées en petit).
      var k = x.getTransform ? x.getTransform().a : 1, c2 = document.createElement('canvas');
      c2.width = Math.max(1, Math.round(w * k)); c2.height = Math.max(1, Math.round(hz * k));
      c2.getContext('2d').drawImage(x.canvas, 0, 0, c2.width, c2.height, 0, 0, c2.width, c2.height);
      x.save(); x.translate(0, hz * 2); x.scale(1, -1); x.globalAlpha = 0.38; x.drawImage(c2, 0, 0, w, hz); x.restore();
      x.fillStyle = vgrad(x, hz, h, [[0, 'rgba(8,6,25,0.35)'], [1, 'rgba(3,3,12,0.95)']]); x.fillRect(0, hz, w, h - hz);
      x.fillStyle = 'rgba(255,255,255,0.05)';
      for (var l = 0; l < 220; l++) x.fillRect(r() * w, hz + r() * (h - hz), 40 + r() * 160, 1.5);
    } },
    { id: 'horizon-marin', nom: 'Horizon marin', cat: 'Paysages', draw: function (x, w, h, r) {
      var hz = h * 0.58;
      x.fillStyle = vgrad(x, 0, hz, [[0, '#5d9fd8'], [0.6, '#a9d1f0'], [1, '#fde4cc']]); x.fillRect(0, 0, w, hz);
      // Nuages : amas de bulles douces dessinés en petit puis agrandis.
      var K = 10, off = document.createElement('canvas'); off.width = Math.ceil(w / K); off.height = Math.ceil(hz / K); var o = off.getContext('2d'); o.scale(1 / K, 1 / K);
      for (var c = 0; c < 14; c++) {
        var cx = r() * w, cy = h * (0.08 + Math.pow(r(), 1.3) * 0.36), span = 260 + r() * 520, puffs = 10 + Math.floor(r() * 12);
        for (var q = 0; q < puffs; q++) {
          var px2 = cx + (r() - 0.5) * span, py2 = cy + (r() - 0.6) * span * 0.16, pr = 50 + r() * 110 * (1 - Math.abs(px2 - cx) / span);
          var cg = o.createRadialGradient(px2, py2, 0, px2, py2, pr);
          cg.addColorStop(0, 'rgba(255,255,255,0.55)'); cg.addColorStop(0.6, 'rgba(255,250,245,0.28)'); cg.addColorStop(1, 'rgba(255,250,245,0)');
          o.fillStyle = cg; o.fillRect(px2 - pr, py2 - pr, pr * 2, pr * 2);
        }
      }
      x.imageSmoothingQuality = 'high'; x.drawImage(off, 0, 0, w, hz);
      var sx = w * (0.4 + r() * 0.2);
      var sg = x.createRadialGradient(sx, hz - 30, 5, sx, hz - 30, h * 0.5); sg.addColorStop(0, 'rgba(255,250,230,0.95)'); sg.addColorStop(0.15, 'rgba(255,230,190,0.45)'); sg.addColorStop(1, 'rgba(255,230,190,0)');
      x.fillStyle = sg; x.fillRect(0, 0, w, hz);
      // Île lointaine : silhouette arrondie qui se fond dans l'horizon.
      var ix = w * (0.05 + r() * 0.15), iw = w * (0.18 + r() * 0.12), ih = h * (0.03 + r() * 0.02);
      x.beginPath(); x.moveTo(ix, hz + 1);
      for (var s2 = 0; s2 <= 64; s2++) {
        var u = s2 / 64, env = Math.pow(Math.sin(Math.PI * u), 0.6) * (1 - 0.35 * u);
        x.lineTo(ix + u * iw, hz - ih * env * (0.85 + 0.15 * Math.sin(u * 23 + ix)));
      }
      x.lineTo(ix + iw, hz + 1); x.closePath(); x.fillStyle = 'rgba(80,118,150,0.65)'; x.fill();
      x.fillStyle = vgrad(x, hz, h, [[0, '#4b8bb8'], [0.4, '#21618e'], [1, '#0c3456']]); x.fillRect(0, hz, w, h - hz);
      for (var i = 0; i < 1400; i++) {
        var yy = hz + Math.pow(r(), 1.8) * (h - hz), d = (yy - hz) / (h - hz);
        var near = Math.exp(-Math.pow((r() * w - sx) / (w * (0.06 + d * 0.12)), 2));
        var xx = sx + (r() - 0.5) * w * (0.08 + d * 0.3);
        x.fillStyle = 'rgba(255,245,220,' + (0.15 + 0.6 * near * (1 - d)) + ')';
        x.fillRect(xx, yy, 6 + d * 60 * r(), 1 + d * 2.5);
      }
      x.strokeStyle = 'rgba(255,255,255,0.08)'; x.lineWidth = 2;
      for (var k = 0; k < 90; k++) { var y2 = hz + Math.pow(r(), 1.5) * (h - hz), x2 = r() * w; x.beginPath(); x.moveTo(x2, y2); x.quadraticCurveTo(x2 + 40, y2 - 4, x2 + 80 + r() * 120, y2); x.stroke(); }
    } },
  ];
  // Galerie : les 4 scènes d'origine + les créations de bs-galerie.js (IA, espace, paysages, abstrait).
  var CATS = ['IA', 'Espace', 'Paysages', 'Abstrait'];
  function scenes() { return SCENES.concat(window.bsGalerie || []).filter(function (sc) { return sc && typeof sc.draw === 'function'; }); }
  function sceneId(sc) { return sc.id || sc.nom; }
  function hashSeed(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h | 0; }
  var seeds = {};          // scène -> graine de la version proposée (la miniature montre exactement l'image ajoutée)
  var thumbs = {}, thumbBusy = false; // aperçus de la galerie (session)
  function seedOf(sc) { var k = sceneId(sc); if (seeds[k] == null) seeds[k] = hashSeed(k); return seeds[k]; }
  function reseed(sc) { seeds[sceneId(sc)] = (Math.random() * 4294967296) | 0; }
  function drawScene(sc, cw, ch, seed) {
    var c = document.createElement('canvas'); c.width = cw; c.height = ch;
    var x = c.getContext('2d');
    if (cw !== 2560) x.scale(cw / 2560, ch / 1440);
    sc.draw(x, 2560, 1440, rng(seed));
    return c;
  }
  function addScenes(list, onProgress) {
    var room = MAX_IMAGES - state.images.length, errors = [], done = 0;
    if (list.length > room) { errors.push('Maximum ' + MAX_IMAGES + ' images : ' + (list.length - room) + ' ambiance(s) non ajoutée(s).'); list = list.slice(0, Math.max(0, room)); }
    var chain = Promise.resolve();
    list.forEach(function (sc, i) {
      chain = chain.then(function () {
        onProgress && onProgress('Création de « ' + sc.nom + ' » (' + (i + 1) + '/' + list.length + ')…');
        return new Promise(function (res) { setTimeout(res, 30); }).then(function () {
          var c = drawScene(sc, 2560, 1440, seedOf(sc));
          reseed(sc); // le prochain ajout de cette scène sera une autre version
          return fromCanvasSource(c, c.width, c.height, sc.nom);
        }).then(function (img) { return backend.add(img); }).then(function (m) { state.images.push(m); done++; })
          .catch(function (e) { errors.push(sc.nom + ' : ' + e.message); });
      });
    });
    return chain.then(function () {
      reorder(); if (done) show(state.images[state.images.length - 1].id);
      apply(); emit();
      return { added: done, errors: errors };
    });
  }
  // « Surprends-moi » : 4 ambiances au hasard, dont au moins 2 sur l'intelligence artificielle quand il y en a.
  function surprise(onProgress) {
    var all = scenes(), ia = shuffle(all.filter(function (sc) { return sc.cat === 'IA'; })).slice(0, 2);
    var rest = shuffle(all.filter(function (sc) { return ia.indexOf(sc) < 0; })).slice(0, 4 - ia.length);
    var list = shuffle(ia.concat(rest));
    list.forEach(reseed);
    return addScenes(list, onProgress);
  }

  // ---------------------------------------------------------------- Réglages › Ambiance
  function monterReglages(el) {
    if (!el || el.getAttribute('data-bsa')) return;
    el.setAttribute('data-bsa', '1');
    ensureLayer();
    var ui = { msg: '', err: false, busy: false, gcat: 'Toutes' };
    // Miniatures de la galerie : dessinées en petit, une à une, puis gardées pour la session.
    function thumbKey(sc) { return sceneId(sc) + ':' + seedOf(sc); }
    function queueThumbs() {
      var list = scenes().filter(function (sc) { return !thumbs[thumbKey(sc)]; });
      if (!list.length || thumbBusy) return;
      thumbBusy = true;
      var next = function () {
        if (!el.isConnected) { thumbBusy = false; return; }
        var sc = list.shift();
        if (!sc) { thumbBusy = false; return; }
        var key = thumbKey(sc);
        try { thumbs[key] = drawScene(sc, 480, 270, seedOf(sc)).toDataURL('image/jpeg', 0.84); } catch (e) { thumbs[key] = 'x'; }
        var tile = el.querySelector('[data-scene="' + sceneId(sc) + '"]');
        if (tile && thumbs[key] !== 'x') { tile.style.backgroundImage = 'url("' + thumbs[key] + '")'; var w = tile.querySelector('.bsa-wait'); if (w) w.remove(); }
        setTimeout(next, 16);
      };
      setTimeout(next, 60);
    }
    function setMsg(m, err) { ui.msg = m; ui.err = !!err; render(); }
    function busy(p) {
      ui.busy = true; render();
      return p.then(function (r) {
        ui.busy = false;
        var parts = [];
        if (r && r.added) parts.push(r.added + ' image' + (r.added > 1 ? 's ajoutées' : ' ajoutée') + '.');
        if (r && r.errors && r.errors.length) parts.push(r.errors.join(' '));
        setMsg(parts.join(' '), r && r.errors && r.errors.length > 0 && !r.added);
      }).catch(function (e) { ui.busy = false; setMsg(e.message, true); });
    }
    function toggle(key, label, hint, disabled) {
      var on = !!state.config[key];
      return '<label class="toggle-row' + (disabled ? ' is-disabled' : '') + '"><span class="toggle-text"><span class="toggle-label">' + label + '</span><span class="toggle-hint">' + hint + '</span></span>' +
        '<button type="button" role="switch" aria-checked="' + on + '" class="toggle' + (on ? ' on' : '') + '" data-tog="' + key + '"' + (disabled ? ' disabled' : '') + '><span></span></button></label>';
    }
    function range(key, label, hint, min, max, stepv, unit, ro) {
      var v = state.config[key];
      return '<div class="setting-row"><div class="sr-text"><div class="sr-label">' + label + '</div><div class="sr-hint">' + hint + '</div></div>' +
        '<div class="bsa-range"><input type="range" min="' + min + '" max="' + max + '" step="' + stepv + '" value="' + v + '" data-range="' + key + '"' + (ro ? ' disabled' : '') + '>' +
        '<output>' + fmtRange(key, v, unit) + '</output></div></div>';
    }
    function fmtRange(key, v, unit) {
      if (key === 'intervalle') return v >= 60 ? (Math.round(v / 6) / 10).toString().replace('.', ',') + ' min' : v + ' s';
      return v + unit;
    }
    function galerie() {
      var all = scenes(), counts = {};
      all.forEach(function (sc) { counts[sc.cat || 'Paysages'] = (counts[sc.cat || 'Paysages'] || 0) + 1; });
      var cats = ['Toutes'].concat(CATS.filter(function (c) { return counts[c]; }));
      var list = all.filter(function (sc) { return ui.gcat === 'Toutes' || (sc.cat || 'Paysages') === ui.gcat; });
      var full = state.images.length >= MAX_IMAGES;
      return '<div class="bsa-gchips">' + cats.map(function (c) {
        return '<button type="button" class="bsa-gchip' + (ui.gcat === c ? ' on' : '') + '" data-gcat="' + esc(c) + '">' + (c === 'IA' ? 'Intelligence artificielle' : esc(c)) + '<small>' + (c === 'Toutes' ? all.length : counts[c]) + '</small></button>';
      }).join('') + '<span style="flex:1"></span><button type="button" class="btn btn-secondary btn-sm" data-act="gall"' + (ui.busy || full ? ' disabled' : '') + '>' + ICON.plus + ' Tout ajouter (' + list.length + ')</button></div>' +
        '<div class="bsa-ggrid">' + list.map(function (sc) {
          var t = thumbs[thumbKey(sc)], cat = sc.cat || 'Paysages';
          return '<div class="bsa-gtile" data-scene="' + esc(sceneId(sc)) + '"' + (t && t !== 'x' ? ' style="background-image:url(&quot;' + t + '&quot;)"' : '') + '>' +
            (t ? '' : '<div class="bsa-wait">Création de l’aperçu…</div>') +
            '<div class="bsa-gact"><button type="button" title="Une autre version de cette ambiance" data-act="gvar" data-sc="' + esc(sceneId(sc)) + '"' + (ui.busy ? ' disabled' : '') + '>' + ICON.shuffle + '</button>' +
            '<button type="button" class="add" data-act="gadd" data-sc="' + esc(sceneId(sc)) + '"' + (ui.busy || full ? ' disabled' : '') + '>' + ICON.plus + ' Ajouter</button></div>' +
            '<div class="bsa-name"><span class="bsa-cat' + (cat === 'IA' ? ' ia' : '') + '">' + esc(cat) + '</span>' + esc(sc.nom) + '</div></div>';
        }).join('') + '</div>';
    }
    function card(title, sub, body) {
      return '<section class="card"><header class="card-head"><div class="card-title-wrap"><span class="card-icon">' + ICON.sparkles + '</span><div><h3 class="card-title">' + title + '</h3>' +
        (sub ? '<p class="card-sub">' + sub + '</p>' : '') + '</div></div></header>' + body + '</section>';
    }
    function render() {
      if (!el.isConnected) return;
      var c = state.config, ro = !state.canEdit, imgs = state.images;
      var where = SERVER ? 'Enregistrées sur le serveur et partagées avec toute l’équipe.' : 'Enregistrées dans ce navigateur, sur cet ordinateur.';
      var lock = ro ? '<div class="bsa-lock">' + ICON.lock + 'Seul un administrateur peut modifier l’ambiance de l’équipe. Vous pouvez la désactiver pour vous ci-dessous.</div>' : '';
      var drop = ro ? '' :
        '<div class="bsa-drop" data-drop>' +
        '<div class="bsa-drop-title">Glissez vos images ici</div>' +
        '<div class="sr-hint" style="margin-top:4px">ou collez-les avec Ctrl+V. JPG, PNG ou WebP, redimensionnées automatiquement (2560 px) pour rester fluides.</div>' +
        '<div class="bsa-actions">' +
        '<button type="button" class="btn btn-primary btn-md" data-act="pick"' + (ui.busy ? ' disabled' : '') + '>Choisir des images</button>' +
        '<button type="button" class="btn btn-secondary btn-md" data-act="surprise"' + (ui.busy ? ' disabled' : '') + '>' + ICON.sparkles + ' Surprends-moi</button>' +
        (imgs.length ? '<button type="button" class="btn btn-ghost btn-md" data-act="zen">Mode immersion (I)</button>' : '') +
        '</div><input type="file" accept="image/*" multiple hidden data-file></div>';
      var grid = imgs.length ? '<div class="bsa-grid">' + imgs.map(function (i) {
        var u = urls[i.id] ? urls[i.id].mini : '';
        var isCur = i.id === current, isPin = c.vedette === i.id;
        return '<div class="bsa-tile' + (isCur ? ' cur' : '') + '" style="background-color:' + esc(i.couleur || '#222') + ';background-image:url(&quot;' + esc(u) + '&quot;)">' +
          '<div class="bsa-badges">' + (isCur ? '<span class="bsa-badge acc">À l’écran</span>' : '') + (isPin ? '<span class="bsa-badge">Épinglée</span>' : '') + '</div>' +
          '<div class="bsa-tools">' +
          '<button type="button" title="Afficher maintenant" data-act="show" data-id="' + i.id + '">' + ICON.eye + '</button>' +
          (ro ? '' : '<button type="button" title="' + (isPin ? 'Désépingler' : 'Épingler (toujours celle-ci)') + '" data-act="pin" data-id="' + i.id + '">' + ICON.pin + '</button>' +
          '<button type="button" class="danger" title="Supprimer" data-act="del" data-id="' + i.id + '">' + ICON.trash + '</button>') +
          '</div><div class="bsa-name">' + esc(i.nom) + '</div></div>';
      }).join('') + '</div>' : (state.ready ? '<p class="sr-hint" style="margin-top:14px">Aucune image pour l’instant. Ajoutez vos photos, ou choisissez des ambiances créées pour vous dans la galerie ci-dessous (« Surprends-moi » en ajoute 4 au hasard).</p>' : '<p class="sr-hint" style="margin-top:14px">Chargement…</p>');
      var msg = ui.busy ? '<div class="bsa-msg">' + esc(ui.msg || 'Patientez…') + '</div>' : ui.msg || state.error ? '<div class="bsa-msg' + (ui.err || state.error ? ' err' : '') + '">' + esc(ui.msg || state.error) + '</div>' : '';
      var pv = current && urls[current] ? urls[current].full : '';
      var preview = imgs.length ? '<div class="bsa-preview" style="background-image:url(&quot;' + esc(pv) + '&quot;)"><div class="bsa-pv-veil" style="background:rgb(var(--bg-rgb)/' + (c.voile / 100) + ');backdrop-filter:blur(' + c.flou + 'px);-webkit-backdrop-filter:blur(' + c.flou + 'px)"></div><div class="bsa-pv-card"><b>Aperçu de lisibilité</b>Vos textes restent nets sur l’image grâce au voile et au verre dépoli.</div></div>' : '';

      el.innerHTML =
        card('Vos images d’ambiance', where + ' Elles s’affichent en fond, sur la bannière d’« Aujourd’hui » et à l’ouverture du CRM.', lock + drop + msg + grid) +
        (ro ? '' : card('Galerie d’ambiances', scenes().length + ' créations originales, dessinées dans votre navigateur en haute définition : intelligence artificielle, espace, paysages, abstrait. L’aperçu montre l’image exacte qui sera ajoutée ; « Autre version » en propose une nouvelle.', galerie())) +
        card('Où les afficher', '', toggle('fond', 'Fond de l’application', 'Image plein écran derrière toutes les pages, blocs en verre dépoli.', ro) +
          toggle('banniere', 'Bannière « Aujourd’hui »', 'L’image apparaît dans le bandeau d’accueil, avec un bouton « Immersion ».', ro) +
          toggle('demarrage', 'Écran d’ouverture', 'L’image accueille le chargement du CRM.', ro) +
          (SERVER ? toggle('connexion', 'Page de connexion', 'Fond de la page de connexion (visible sans compte : n’y mettez pas d’image confidentielle).', ro)
            : '<label class="toggle-row is-disabled"><span class="toggle-text"><span class="toggle-label">Page de connexion</span><span class="toggle-hint">Disponible dans la version équipe (serveur).</span></span></label>') +
          (SERVER ? '<label class="toggle-row"><span class="toggle-text"><span class="toggle-label">Désactiver sur cet appareil</span><span class="toggle-hint">Pour vous seulement, sans changer l’ambiance de l’équipe.</span></span><button type="button" role="switch" aria-checked="' + !!perso.off + '" class="toggle' + (perso.off ? ' on' : '') + '" data-perso="off"><span></span></button></label>' : '')) +
        card('Rythme et lisibilité', '',
          '<div class="setting-row"><div class="sr-text"><div class="sr-label">Choix de l’image</div><div class="sr-hint">Diaporama en fondu, une image différente chaque jour, ou toujours l’image épinglée.</div></div>' +
          '<div role="tablist" class="segmented">' + [['diaporama', 'Diaporama'], ['jour', 'Une par jour'], ['fixe', 'Épinglée']].map(function (m) {
            return '<button type="button" role="tab" aria-selected="' + (c.mode === m[0]) + '" class="seg' + (c.mode === m[0] ? ' active' : '') + '" data-mode="' + m[0] + '"' + (ro ? ' disabled' : '') + '><span>' + m[1] + '</span></button>';
          }).join('') + '</div></div>' +
          (c.mode === 'diaporama' ? range('intervalle', 'Changement d’image', 'Toutes les…', 10, 600, 5, '', ro) : '') +
          range('voile', 'Voile de lisibilité', 'Plus fort = textes plus contrastés, image plus discrète.', 15, 90, 1, ' %', ro) +
          range('flou', 'Flou du fond', 'Adoucit l’image derrière les pages.', 0, 16, 1, ' px', ro) +
          toggle('mouvement', 'Images animées', 'Mouvement de caméra et lumières vivantes (étoiles filantes, flux de données, reflets, poussières dorées) sur le fond et la bannière. Le mode immersion est toujours animé.', ro) + preview);

      var fi = el.querySelector('[data-file]');
      if (fi) fi.addEventListener('change', function () { if (fi.files.length) busy(addFiles(fi.files, setMsgBusy)); });
      var dz = el.querySelector('[data-drop]');
      if (dz) {
        dz.addEventListener('dragover', function (e) { e.preventDefault(); dz.classList.add('over'); });
        dz.addEventListener('dragleave', function () { dz.classList.remove('over'); });
        dz.addEventListener('drop', function (e) { e.preventDefault(); dz.classList.remove('over'); if (e.dataTransfer.files.length) busy(addFiles(e.dataTransfer.files, setMsgBusy)); });
      }
    }
    function setMsgBusy(m) { ui.msg = m; var box = el.querySelector('.bsa-msg'); if (box) box.textContent = m; else render(); }
    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-act],[data-tog],[data-mode],[data-perso],[data-gcat]'); if (!t || t.disabled) return;
      if (t.hasAttribute('data-gcat')) { ui.gcat = t.getAttribute('data-gcat'); render(); queueThumbs(); return; }
      if (t.hasAttribute('data-tog')) { var k = t.getAttribute('data-tog'), p = {}; p[k] = !state.config[k]; setConfig(p); return; }
      if (t.hasAttribute('data-perso')) { setPerso({ off: !perso.off }); return; }
      if (t.hasAttribute('data-mode')) { setConfig({ mode: t.getAttribute('data-mode') }); return; }
      var act = t.getAttribute('data-act'), id = t.getAttribute('data-id');
      if (act === 'pick') el.querySelector('[data-file]').click();
      else if (act === 'surprise') busy(surprise(setMsgBusy));
      else if (act === 'gadd' || act === 'gvar') {
        var sc = scenes().filter(function (x) { return sceneId(x) === t.getAttribute('data-sc'); })[0];
        if (!sc) return;
        if (act === 'gvar') { reseed(sc); render(); queueThumbs(); }
        else busy(addScenes([sc], setMsgBusy).then(function (r) { render(); queueThumbs(); return r; }));
      }
      else if (act === 'gall') {
        var lst = scenes().filter(function (x) { return ui.gcat === 'Toutes' || (x.cat || 'Paysages') === ui.gcat; });
        busy(addScenes(lst, setMsgBusy).then(function (r) { render(); queueThumbs(); return r; }));
      }
      else if (act === 'zen') immersion();
      else if (act === 'show') { if (perso.off) setPerso({ off: false }); show(id); }
      else if (act === 'pin') setConfig(state.config.vedette === id ? { vedette: '', mode: state.config.mode === 'fixe' ? 'diaporama' : state.config.mode } : { vedette: id, mode: 'fixe' });
      else if (act === 'del') {
        var img = state.images.filter(function (i) { return i.id === id; })[0];
        if (confirm('Supprimer l’image « ' + (img ? img.nom : '') + ' » ?')) remove(id).catch(function (er) { setMsg(er.message, true); });
      }
    });
    el.addEventListener('input', function (e) {
      var t = e.target; if (!t.hasAttribute || !t.hasAttribute('data-range')) return;
      var key = t.getAttribute('data-range'), v = Number(t.value), out = t.parentNode.querySelector('output');
      if (out) out.textContent = fmtRange(key, v, key === 'voile' ? ' %' : key === 'flou' ? ' px' : '');
      // Aperçu immédiat, enregistrement au relâchement.
      var h = document.documentElement;
      if (key === 'voile') h.style.setProperty('--bs-amb-voile', String(v / 100));
      if (key === 'flou') h.style.setProperty('--bs-amb-flou', v + 'px');
      var veil = el.querySelector('.bsa-pv-veil');
      if (veil && key === 'voile') veil.style.background = 'rgb(var(--bg-rgb)/' + v / 100 + ')';
      if (veil && key === 'flou') { veil.style.backdropFilter = 'blur(' + v + 'px)'; veil.style.webkitBackdropFilter = 'blur(' + v + 'px)'; }
    });
    el.addEventListener('change', function (e) {
      var t = e.target; if (!t.hasAttribute || !t.hasAttribute('data-range')) return;
      var p = {}; p[t.getAttribute('data-range')] = Number(t.value); setConfig(p);
    });
    var onPaste = function (e) {
      if (!el.isConnected) { document.removeEventListener('paste', onPaste); return; }
      if (!state.canEdit) return;
      var files = Array.prototype.filter.call((e.clipboardData && e.clipboardData.files) || [], function (f) { return /^image\//.test(f.type); });
      if (files.length) { e.preventDefault(); busy(addFiles(files, setMsgBusy)); }
    };
    document.addEventListener('paste', onPaste);
    var l = function () { if (!el.isConnected) { listeners.splice(listeners.indexOf(l), 1); document.removeEventListener('paste', onPaste); return; } if (!ui.busy) render(); };
    listeners.push(l);
    render();
    if (state.canEdit) queueThumbs();
  }

  // ---------------------------------------------------------------- démarrage
  function start() {
    ensureLayer();
    load();
    if (SERVER) fetch('/api/auth/me', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (b) { if (b && b.user) userName = b.user.name || ''; }).catch(function () {});
    var mo = new MutationObserver(function () { decorateHero(); });
    var watch = function () { var root = document.getElementById('root'); if (root) { mo.observe(root, { childList: true, subtree: true }); decorateHero(); } else setTimeout(watch, 200); };
    watch();
    // Version équipe : les changements faits par un administrateur arrivent sans recharger.
    if (SERVER) setInterval(function () { if (!document.hidden) backend.load().then(function (b) {
      var before = JSON.stringify([state.config, state.images.map(function (i) { return i.id; })]);
      state.config = Object.assign({}, DEFAULTS, b.config || {}); state.images = b.images || []; state.canEdit = b.canEdit !== false;
      if (JSON.stringify([state.config, state.images.map(function (i) { return i.id; })]) !== before) { reorder(); apply(true); emit(); }
    }).catch(function () {}); }, 120000);
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);

  window.bsAmbiance = {
    monterReglages: monterReglages,
    immersion: immersion,
    suivante: function () { step(1); },
    etat: function () { return { config: Object.assign({}, state.config), images: state.images.slice(), courante: current, serveur: SERVER, modifiable: state.canEdit, pret: state.ready }; },
    ecouter: function (fn) { listeners.push(fn); },
    ajouter: addFiles,
    surprise: surprise,
    reglages: setConfig,
    _scenes: scenes,
  };
})();

