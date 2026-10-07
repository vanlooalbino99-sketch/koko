
/* Blackstart CRM : version équipe (serveur) et Réglages › Équipe & compte.
 *
 * Quand le CRM est servi par le serveur Blackstart (window.BS_SERVER, injecté par le serveur) :
 * - window.storage : les données du CRM (prospects, devis, factures, tâches, réglages) sont enregistrées sur le
 *   serveur et partagées par l'équipe, au lieu du stockage du navigateur. L'interface s'en sert d'elle-même.
 * - Enregistrement en arrière-plan : l'écran ne bloque jamais ; si deux personnes enregistrent en même temps, le
 *   serveur fusionne les deux et l'écran se met à jour. Hors connexion, les modifications attendent dans le
 *   navigateur et partent au retour du réseau (même après avoir fermé l'onglet).
 * - Mises à jour de l'équipe affichées toutes seules (vérification toutes les 20 s et au retour sur l'onglet).
 * - Réglages › Équipe & compte : mon compte, mot de passe, déconnexion ; membres de l'équipe et sauvegardes
 *   (administrateurs).
 * Version autonome (fichier HTML seul) : rien ne change, l'onglet explique la version équipe.
 */
(function () {
  'use strict';
  if (window.bsEquipe) return;

  var CONF = window.BS_SERVER && typeof window.BS_SERVER === 'object' ? window.BS_SERVER : null;
  var USER = CONF && CONF.user ? CONF.user : null;
  var DATA_KEY = 'blackstart-data-v1';
  var POLL_MS = 20000;
  var listeners = [];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function emit() { listeners.slice().forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } }); }
  function fmtDate(iso) {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return iso; }
  }
  function fmtSize(n) { return n > 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' Mo' : Math.max(1, Math.round(n / 1024)) + ' Ko'; }

  // ---------------------------------------------------------------- API
  var expired = false;
  function api(method, path, body) {
    var headers = { 'X-Requested-With': 'blackstart' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    return fetch(path, { method: method, credentials: 'same-origin', headers: headers, body: body !== undefined ? JSON.stringify(body) : undefined })
      .then(function (r) {
        if (r.status === 401) { sessionExpired(); var e1 = new Error('Session expirée.'); e1.status = 401; throw e1; }
        if (r.status === 204) return null;
        return r.json().catch(function () { return {}; }).then(function (b) {
          if (!r.ok) { var e = new Error(b.error || ('Erreur ' + r.status)); e.status = r.status; throw e; }
          return b;
        });
      });
  }
  function sessionExpired() {
    if (expired) return;
    expired = true;
    setStatus('expired');
    setTimeout(function () { location.href = '/connexion?retour=' + encodeURIComponent(location.pathname + location.hash); }, 1800);
  }

  // ---------------------------------------------------------------- synchronisation des données
  // Par clé : version du serveur, version d'où part l'état affiché (base), dernière valeur connue du serveur,
  // valeur en attente d'envoi.
  var S = {};
  function st(key) { return S[key] || (S[key] = { version: 0, base: 0, server: null, pending: null, pushing: false, retry: 0, timer: 0, at: null }); }
  var userPart = USER ? USER.id : 'anonyme';
  var PENDING_KEY = 'bs-serveur-attente:' + userPart, CACHE_KEY = 'bs-serveur-cache:' + userPart + ':';
  function readPending() { try { return JSON.parse(localStorage.getItem(PENDING_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function writePending(key, entry) {
    var all = readPending();
    if (entry) all[key] = entry; else delete all[key];
    try { localStorage.setItem(PENDING_KEY, JSON.stringify(all)); } catch (e) { /* stockage plein : l'envoi continue sans filet */ }
  }
  // Copie locale de la dernière version du serveur : le CRM s'ouvre même si le réseau tombe.
  var cacheT = {};
  function writeCache(key) {
    clearTimeout(cacheT[key]);
    cacheT[key] = setTimeout(function () {
      var s = st(key);
      try { localStorage.setItem(CACHE_KEY + key, JSON.stringify({ version: s.version, value: s.server })); } catch (e) {}
    }, 1500);
  }
  function readCache(key) { try { return JSON.parse(localStorage.getItem(CACHE_KEY + key) || 'null'); } catch (e) { return null; } }

  function parse(s) { try { return JSON.parse(s); } catch (e) { return undefined; } }
  function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    var i;
    if (Array.isArray(a)) { if (a.length !== b.length) return false; for (i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false; return true; }
    var ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (i = 0; i < ka.length; i++) if (!Object.prototype.hasOwnProperty.call(b, ka[i]) || !deepEqual(a[ka[i]], b[ka[i]])) return false;
    return true;
  }
  function sameData(a, b) { return a === b || (a != null && b != null && deepEqual(parse(a), parse(b))); }

  // Remplace les données affichées par celles du serveur (fusion ou mise à jour d'un collègue).
  function applyRemote(key, value) {
    if (key !== DATA_KEY || !window.__bsStore) return;
    var d = parse(value);
    if (!d || typeof d !== 'object') return;
    var patch = {};
    Object.keys(d).forEach(function (k) { if (k !== 'version') patch[k] = d[k]; });
    window.__bsStore.set(patch);
  }

  function schedule(key, ms) {
    var s = st(key);
    clearTimeout(s.timer);
    s.timer = setTimeout(function () { push(key); }, ms || 0);
  }
  function push(key) {
    var s = st(key);
    if (s.pushing || s.pending == null || expired) return;
    s.pushing = true;
    var value = s.pending, base = s.base;
    api('PUT', '/api/data/' + encodeURIComponent(key), { value: value, baseVersion: base }).then(function (b) {
      s.pushing = false; s.retry = 0; s.version = b.version; s.at = new Date().toISOString();
      var more = s.pending !== value;
      if (!more) { s.pending = null; writePending(key, null); }
      if (b.merged && typeof b.value === 'string') {
        s.server = b.value;
        // Fusion faite par le serveur : l'écran prend le résultat, sauf si l'on a déjà retapé quelque chose
        // (ce nouvel envoi repartira de l'ancienne base et sera fusionné à son tour : rien ne se perd).
        if (!more) { s.base = b.version; applyRemote(key, b.value); }
      } else {
        s.server = value; s.base = b.version;
      }
      writeCache(key);
      if (s.pending != null) schedule(key, 0); else setStatus('ok');
    }).catch(function (e) {
      s.pushing = false;
      if (e.status === 401) return;
      s.retry = Math.min(30000, (s.retry || 1000) * 2);
      setStatus(!e.status || navigator.onLine === false ? 'offline' : 'error', e.message);
      schedule(key, s.retry);
    });
  }
  function poll() {
    if (expired || document.hidden) return;
    Object.keys(S).forEach(function (key) {
      var s = st(key);
      if (s.pending != null || s.pushing || !s.loaded) return;
      api('GET', '/api/data/' + encodeURIComponent(key) + '?since=' + s.version).then(function (b) {
        if (!b.changed || s.pending != null || s.pushing) return;
        s.version = b.version; s.base = b.version; s.at = new Date().toISOString();
        if (b.value != null && !sameData(b.value, s.server)) {
          s.server = b.value; applyRemote(key, b.value);
          if (b.updatedBy && (!USER || b.updatedBy !== USER.name)) flash('Données mises à jour par ' + b.updatedBy);
        }
        writeCache(key);
        if (status === 'offline' || status === 'error') setStatus('ok');
      }).catch(function (e) { if (e.status !== 401 && !e.status) setStatus('offline'); });
    });
  }

  if (CONF) {
    window.storage = {
      get: function (key) {
        var s = st(key);
        var saved = readPending()[key];
        return api('GET', '/api/data/' + encodeURIComponent(key)).then(function (b) {
          s.loaded = true; s.version = b.version; s.base = b.version; s.server = b.value; s.at = new Date().toISOString();
          writeCache(key);
          if (saved && typeof saved.value === 'string' && !sameData(saved.value, b.value)) {
            // Modifications restées en attente (onglet fermé hors connexion) : renvoyées, le serveur fusionne.
            s.pending = saved.value; s.base = saved.baseVersion || 0; setStatus('pending'); schedule(key, 400);
            return { key: key, value: saved.value };
          }
          if (saved) writePending(key, null);
          return b.value == null ? null : { key: key, value: b.value };
        }).catch(function (e) {
          var c = readCache(key);
          if (e.status === 401 || !c) { setStatus('offline'); throw e; }
          // Hors connexion au démarrage : dernière copie connue (+ ce qui attendait d'être envoyé).
          s.loaded = true; s.version = c.version; s.base = saved ? saved.baseVersion || 0 : c.version; s.server = c.value;
          if (saved && typeof saved.value === 'string') { s.pending = saved.value; schedule(key, 3000); }
          setStatus('offline');
          var v = saved && typeof saved.value === 'string' ? saved.value : c.value;
          return v == null ? null : { key: key, value: v };
        });
      },
      set: function (key, value) {
        var s = st(key);
        value = String(value);
        if (s.pending == null && sameData(value, s.server)) return Promise.resolve({ key: key, value: value });
        s.pending = value;
        writePending(key, { value: value, baseVersion: s.base });
        if (!s.pushing) schedule(key, 0);
        if (status === 'ok') setStatus('pending');
        return Promise.resolve({ key: key, value: value });
      },
    };
    setInterval(poll, POLL_MS);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) poll(); });
    window.addEventListener('online', function () { Object.keys(S).forEach(function (k) { if (st(k).pending != null) schedule(k, 0); }); poll(); });
    window.addEventListener('beforeunload', function (e) {
      var waiting = Object.keys(S).some(function (k) { return st(k).pending != null; });
      if (waiting) { e.preventDefault(); e.returnValue = ''; }
    });
  }

  // ---------------------------------------------------------------- état de la synchronisation
  var status = 'ok', statusMsg = '', pill = null, pillT = 0;
  var CSS = [
    '#bs-sync{position:fixed;left:16px;bottom:16px;z-index:300;display:flex;align-items:center;gap:8px;max-width:min(440px,calc(100vw - 32px));padding:9px 14px;border-radius:999px;font-size:13px;font-weight:600;color:var(--text,#eaf1fb);background:rgb(var(--surface-rgb,15 27 46)/.94);border:1px solid var(--border-2,rgb(148 163 184/.25));box-shadow:0 12px 30px -12px rgb(0 0 0/.55);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);transition:opacity .3s,transform .3s;opacity:0;transform:translateY(8px);pointer-events:none}',
    '#bs-sync.on{opacity:1;transform:none}',
    '#bs-sync i{width:8px;height:8px;border-radius:50%;flex:none;background:var(--c,#60a5fa)}',
    '#bs-sync.pending i{animation:bsSyncP 1s ease-in-out infinite}',
    '@keyframes bsSyncP{50%{opacity:.3}}',
    '@media (max-width:760px){#bs-sync{bottom:84px}}',
    // Réglages › Équipe & compte
    '.bse-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}',
    '.bse-me{display:flex;align-items:center;gap:14px;flex-wrap:wrap}',
    '.bse-av{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;font-weight:800;font-size:17px;color:#fff;background:linear-gradient(135deg,rgb(var(--accent-rgb)),color-mix(in srgb,rgb(var(--accent-rgb)) 60%,#000))}',
    '.bse-me b{display:block;font-size:15.5px}',
    '.bse-me span{color:var(--text-3);font-size:13px}',
    '.bse-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:14px}',
    '.bse-msg{margin-top:10px;font-size:13px;color:var(--text-2)}',
    '.bse-msg.err{color:var(--bad,#f87171)}',
    '.bse-msg.ok{color:var(--good,#34d399)}',
    '.bse-table td,.bse-table th{vertical-align:middle}',
    '.bse-table .select{min-width:130px}',
    '.bse-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;background:var(--c)}',
    '.bse-code{font-family:ui-monospace,Menlo,monospace;font-size:12.5px;padding:2px 6px;border-radius:6px;background:rgb(var(--text-rgb)/.07)}',
    '.bse-sep{height:1px;background:var(--border);margin:16px 0}',
    // Photo de profil : dans Mon compte et en haut à droite.
    '.bse-av.ph,.bs-moi .ph{background:var(--ph) center/cover no-repeat;color:transparent}',
    '.bse-me .bse-av{width:64px;height:64px;border-radius:50%;font-size:22px}',
    '.bse-photo{display:flex;gap:6px;flex-wrap:wrap;margin-left:auto}',
    '.bs-moi{flex:none;display:inline-flex;align-items:center;gap:8px;padding:3px 10px 3px 3px;margin-left:6px;border-radius:999px;border:1px solid var(--border);background:rgb(var(--text-rgb,148 163 184)/.04);color:var(--text);font:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:background .15s,border-color .15s}',
    '.bs-moi:hover{background:rgb(var(--text-rgb,148 163 184)/.09);border-color:var(--border-2,var(--border))}',
    '.bs-moi .ph,.bs-moi .ini{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:800;color:#fff;background-color:rgb(var(--accent-rgb));flex:none}',
    '.bs-moi .ph{background-color:transparent}',
    '@media (max-width:760px){.bs-moi{padding:2px;border:0;background:none}.bs-moi .nm{display:none}}',
  ].join('\n');
  function ensureCss() {
    if (document.getElementById('bs-serveur-css')) return;
    var s = document.createElement('style'); s.id = 'bs-serveur-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }
  var STATUS = {
    ok: ['Synchronisé', '#34d399'],
    pending: ['Enregistrement…', '#60a5fa'],
    offline: ['Hors connexion : vos modifications partiront dès le retour du réseau', '#f59e0b'],
    error: ['Échec de l’enregistrement, nouvel essai en cours', '#f87171'],
    expired: ['Session expirée : reconnexion…', '#f87171'],
  };
  function setStatus(s, msg) {
    status = s; statusMsg = msg || '';
    if (!document.body) return;
    ensureCss();
    if (!pill) { pill = document.createElement('div'); pill.id = 'bs-sync'; pill.setAttribute('role', 'status'); document.body.appendChild(pill); }
    var d = STATUS[s] || STATUS.ok;
    pill.className = s;
    pill.style.setProperty('--c', d[1]);
    pill.innerHTML = '<i></i><span>' + esc(d[0]) + '</span>';
    clearTimeout(pillT);
    // « Enregistrement… » ne s'affiche que s'il dure ; « Synchronisé » disparaît vite.
    if (s === 'pending') pillT = setTimeout(function () { pill.classList.add('on'); }, 1500);
    else if (s === 'ok') { if (pill.classList.contains('on')) pillT = setTimeout(function () { pill.classList.remove('on'); }, 1200); }
    else pill.classList.add('on');
    emit();
  }
  function flash(text) {
    if (!document.body) return;
    ensureCss();
    if (!pill) { pill = document.createElement('div'); pill.id = 'bs-sync'; pill.setAttribute('role', 'status'); document.body.appendChild(pill); }
    pill.className = 'ok on'; pill.style.setProperty('--c', '#60a5fa');
    pill.innerHTML = '<i></i><span>' + esc(text) + '</span>';
    clearTimeout(pillT); pillT = setTimeout(function () { pill.classList.remove('on'); }, 3500);
  }

  // ---------------------------------------------------------------- Réglages › Équipe & compte
  function card(title, sub, body, icon) {
    return '<section class="card"><header class="card-head"><div class="card-title-wrap"><span class="card-icon">' + (icon || ICON.users) + '</span><div><h3 class="card-title">' + title + '</h3>' +
      (sub ? '<p class="card-sub">' + sub + '</p>' : '') + '</div></div></header>' + body + '</section>';
  }
  var ICON = {
    users: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    cloud: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
    history: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5M12 7v5l4 2"/></svg>',
    server: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/></svg>',
  };
  function initials(n) { return String(n || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('') || '?'; }
  function genPassword() {
    var abc = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789', a = new Uint32Array(12), out = '';
    crypto.getRandomValues(a);
    for (var i = 0; i < a.length; i++) out += abc[a[i] % abc.length];
    return out;
  }
  // ---------------------------------------------------------------- photo de profil
  function photoUrl(id, v) { return '/api/photos/' + encodeURIComponent(id) + '?v=' + encodeURIComponent(v); }
  function pastille(u, cls) {
    return u.photo ? '<span class="' + cls + ' ph" style="--ph:url(&quot;' + esc(photoUrl(u.id, u.photo)) + '&quot;)" role="img" aria-label="' + esc(u.name) + '"></span>'
      : '<span class="' + cls + ' ini">' + esc(initials(u.name)) + '</span>';
  }
  // Recadrée au carré et réduite à 320 px dans le navigateur : le serveur ne garde qu'une petite image.
  function reduire(file) {
    return new Promise(function (ok, ko) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var s = Math.min(img.naturalWidth, img.naturalHeight), c = document.createElement('canvas');
        c.width = c.height = 320;
        c.getContext('2d').drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, 320, 320);
        URL.revokeObjectURL(url);
        ok(c.toDataURL('image/jpeg', 0.86));
      };
      img.onerror = function () { URL.revokeObjectURL(url); ko(new Error('Cette image ne peut pas être lue : essayez une photo JPEG ou PNG.')); };
      img.src = url;
    });
  }
  function choisirPhoto(done) {
    var input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = function () {
      var f = input.files && input.files[0]; if (!f) return;
      reduire(f).then(function (data) { return api('PUT', '/api/photos/moi', { image: data }); })
        .then(function (b) { majPhoto(b.photo); done(); }).catch(done);
    };
    input.click();
  }
  function majPhoto(v) {
    if (!USER) return;
    USER.photo = v;
    var b = document.querySelector('.bs-moi'); if (b) b.remove();
    placerMoi();
    window.dispatchEvent(new CustomEvent('bs:profil', { detail: { userId: USER.id, photo: v } }));
  }
  // Pastille du compte en haut à droite : photo et prénom, ouvre Réglages › Équipe & compte.
  function placerMoi() {
    var bar = document.querySelector('.topbar');
    if (!USER || !bar || bar.querySelector('.bs-moi')) return;
    ensureCss();
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'bs-moi'; b.title = 'Mon compte';
    b.innerHTML = pastille(USER, '') + '<span class="nm">' + esc(String(USER.name).split(' ')[0]) + '</span>';
    b.onclick = function () {
      location.hash = '#/settings';
      var n = 0, t = setInterval(function () {
        var tab = [].slice.call(document.querySelectorAll('button,a,[role=tab]')).filter(function (x) { return x.textContent.trim() === 'Équipe & compte'; })[0];
        if (tab || ++n > 20) { clearInterval(t); if (tab) tab.click(); }
      }, 50);
    };
    bar.appendChild(b);
  }
  if (USER) {
    var moiT = 0;
    new MutationObserver(function () { if (!moiT) moiT = requestAnimationFrame(function () { moiT = 0; placerMoi(); }); })
      .observe(document.documentElement, { childList: true, subtree: true });
  }
  function roleBadge(r) { return r === 'admin' ? '<span class="badge tone-accent">Administrateur</span>' : '<span class="badge tone-slate">Membre</span>'; }

  function monterReglages(el) {
    if (!el || el.getAttribute('data-bse')) return;
    el.setAttribute('data-bse', '1');
    ensureCss();
    if (!CONF) {
      el.innerHTML = card('Version autonome', 'Vos données sont enregistrées dans ce navigateur, sur cet appareil.',
        '<p class="sr-hint">La <b>version équipe</b> fonctionne avec le serveur Blackstart (Node.js) : chaque membre a son compte, ' +
        'les prospects, devis, factures, tâches et ambiances sont partagés et synchronisés en direct, avec un historique des sauvegardes. ' +
        'Installation : voir le fichier README du projet (dossier <span class="bse-code">server/</span>, commande <span class="bse-code">npm start</span> ou Docker).</p>' +
        '<p class="sr-hint" style="margin-top:10px">Pour y passer avec vos données : Réglages › Données › Exporter, puis importez le fichier une fois connecté à la version équipe.</p>', ICON.server);
      return;
    }
    var isAdmin = USER && USER.role === 'admin';
    var ui = { users: null, history: null, msg: {}, newPass: '', clear: {} };
    function setMsg(zone, text, kind) { ui.msg[zone] = { text: text, kind: kind || '' }; render(); }
    function msg(zone) { var m = ui.msg[zone]; return m && m.text ? '<div class="bse-msg ' + m.kind + '">' + esc(m.text) + '</div>' : ''; }
    function loadUsers() { if (!isAdmin) return; api('GET', '/api/users').then(function (b) { ui.users = b.users; render(); }).catch(function (e) { setMsg('team', e.message, 'err'); }); }
    function loadHistory() { if (!isAdmin) return; api('GET', '/api/data/' + DATA_KEY + '/history').then(function (b) { ui.history = b.history; render(); }).catch(function (e) { setMsg('hist', e.message, 'err'); }); }

    function render() {
      if (!el.isConnected) return;
      var s = st(DATA_KEY), d = STATUS[status] || STATUS.ok;
      var me = card('Mon compte', 'Connecté à la version équipe' + (CONF.version ? ' (v' + esc(CONF.version) + ')' : '') + '.',
        '<div class="bse-me">' + pastille(USER, 'bse-av') + '<div><b>' + esc(USER.name) + '</b><span>' + esc(USER.email) + '</span></div>' + roleBadge(USER.role) +
        '<div class="bse-photo"><button type="button" class="btn btn-secondary btn-sm" data-act="photo">' + (USER.photo ? 'Changer la photo' : 'Ajouter une photo') + '</button>' +
        (USER.photo ? '<button type="button" class="btn btn-ghost btn-sm" data-act="sans-photo">Retirer</button>' : '') + '</div></div>' + msg('photo') +
        '<div class="bse-sep"></div>' +
        '<form data-form="pass"><div class="bse-grid">' +
        '<label class="field"><span class="field-label">Mot de passe actuel</span><input class="input" type="password" name="current" autocomplete="current-password" required></label>' +
        '<label class="field"><span class="field-label">Nouveau mot de passe</span><input class="input" type="password" name="next" autocomplete="new-password" minlength="8" required></label>' +
        '</div><div class="bse-actions"><button type="submit" class="btn btn-secondary btn-md">Changer le mot de passe</button>' +
        '<span style="flex:1"></span><button type="button" class="btn btn-ghost btn-md" data-act="logout">Se déconnecter</button></div>' + msg('pass') + '</form>', ICON.user);
      var sync = card('Synchronisation', 'Les données du CRM sont enregistrées sur le serveur et partagées avec l’équipe.',
        '<div class="setting-row"><div class="sr-text"><div class="sr-label"><span class="bse-dot" style="--c:' + d[1] + '"></span>' + esc(d[0]) + '</div>' +
        '<div class="sr-hint">Version ' + s.version + (s.at ? ' · vérifiée le ' + esc(fmtDate(s.at)) : '') + (statusMsg && status !== 'ok' ? ' · ' + esc(statusMsg) : '') + '</div></div>' +
        '<button type="button" class="btn btn-secondary btn-md" data-act="sync">Synchroniser maintenant</button></div>', ICON.cloud);
      var team = '';
      if (isAdmin) {
        var rows = (ui.users || []).map(function (u) {
          var self = u.id === USER.id;
          return '<tr><td><b>' + esc(u.name) + '</b>' + (self ? ' <span class="badge tone-sky">vous</span>' : '') + '<div class="sr-hint">' + esc(u.email) + '</div></td>' +
            '<td><select class="input select" data-role="' + esc(u.id) + '"' + (self ? ' disabled' : '') + '><option value="membre"' + (u.role === 'membre' ? ' selected' : '') + '>Membre</option><option value="admin"' + (u.role === 'admin' ? ' selected' : '') + '>Administrateur</option></select></td>' +
            '<td class="sr-hint">' + esc(fmtDate(u.lastLogin)) + '</td>' +
            '<td style="text-align:right;white-space:nowrap">' + (self ? '' : '<button type="button" class="btn btn-ghost btn-sm" data-reset="' + esc(u.id) + '">Nouveau mot de passe</button> <button type="button" class="btn btn-ghost btn-sm" data-del="' + esc(u.id) + '">Retirer</button>') + '</td></tr>';
        }).join('');
        team = card('Équipe', 'Les membres voient et modifient les données du CRM ; les administrateurs gèrent aussi l’équipe, les ambiances, les icônes et les sauvegardes.',
          (ui.users ? '<div class="table-wrap"><table class="table bse-table"><thead><tr><th>Membre</th><th>Rôle</th><th>Dernière connexion</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '<p class="sr-hint">Chargement…</p>') +
          msg('team') + '<div class="bse-sep"></div>' +
          '<form data-form="add"><div class="sr-label" style="margin-bottom:10px">Ajouter un membre</div><div class="bse-grid">' +
          '<label class="field"><span class="field-label">Nom</span><input class="input" name="name" required maxlength="80" placeholder="Prénom Nom"></label>' +
          '<label class="field"><span class="field-label">E-mail</span><input class="input" type="email" name="email" required placeholder="nom@entreprise.fr"></label>' +
          '<label class="field"><span class="field-label">Mot de passe provisoire</span><input class="input" name="password" required minlength="8" value="' + esc(ui.newPass || (ui.newPass = genPassword())) + '"></label>' +
          '<label class="field"><span class="field-label">Rôle</span><select class="input select" name="role"><option value="membre">Membre</option><option value="admin">Administrateur</option></select></label>' +
          '</div><div class="bse-actions"><button type="submit" class="btn btn-primary btn-md">Ajouter à l’équipe</button><span class="sr-hint">Transmettez-lui l’adresse du CRM, son e-mail et ce mot de passe ; il pourra le changer ici.</span></div>' + msg('add') + '</form>', ICON.users);
        var hist = (ui.history || []).slice(0, 15).map(function (h, i) {
          return '<tr><td><b>v' + h.version + '</b>' + (i === 0 ? ' <span class="badge tone-emerald">actuelle</span>' : '') + '</td><td>' + esc(fmtDate(h.updatedAt)) + '</td><td>' + esc(h.updatedBy || '—') + '</td><td class="sr-hint">' + fmtSize(h.size) + '</td>' +
            '<td style="text-align:right">' + (i === 0 ? '' : '<button type="button" class="btn btn-ghost btn-sm" data-restore="' + h.version + '">Restaurer</button>') + '</td></tr>';
        }).join('');
        team += card('Sauvegardes', 'Chaque enregistrement est conservé (100 dernières versions). Restaurer remet le CRM de toute l’équipe dans l’état choisi ; la version actuelle reste dans l’historique.',
          (ui.history ? (hist ? '<div class="table-wrap"><table class="table bse-table"><thead><tr><th>Version</th><th>Date</th><th>Par</th><th>Taille</th><th></th></tr></thead><tbody>' + hist + '</tbody></table></div>' : '<p class="sr-hint">Aucune sauvegarde pour l’instant.</p>') : '<p class="sr-hint">Chargement…</p>') +
          '<div class="bse-actions"><button type="button" class="btn btn-ghost btn-sm" data-act="hist">Actualiser</button></div>' + msg('hist'), ICON.history);
      } else {
        team = card('Équipe', '', '<p class="sr-hint">Seul un administrateur ajoute ou retire des membres de l’équipe.</p>', ICON.users);
      }
      // La liste peut arriver pendant qu'on tape : la saisie en cours et le curseur sont conservés.
      var keep = {}, act = document.activeElement, focusKey = '';
      Array.prototype.forEach.call(el.querySelectorAll('form[data-form] [name]'), function (i) {
        var k = i.form.getAttribute('data-form') + ':' + i.name;
        if (!ui.clear[i.form.getAttribute('data-form')]) keep[k] = i.value;
        if (i === act) focusKey = k;
      });
      ui.clear = {};
      el.innerHTML = me + sync + team;
      Array.prototype.forEach.call(el.querySelectorAll('form[data-form] [name]'), function (i) {
        var k = i.form.getAttribute('data-form') + ':' + i.name;
        if (k in keep) i.value = keep[k];
        if (k === focusKey) i.focus();
      });
    }

    el.addEventListener('submit', function (e) {
      var f = e.target.closest('[data-form]'); if (!f) return;
      e.preventDefault();
      var data = {}; new FormData(f).forEach(function (v, k) { data[k] = v; });
      var kind = f.getAttribute('data-form');
      if (kind === 'pass') {
        api('POST', '/api/auth/password', { current: data.current, next: data.next })
          .then(function () { ui.clear.pass = true; setMsg('pass', 'Mot de passe changé.', 'ok'); })
          .catch(function (er) { setMsg('pass', er.message, 'err'); });
      } else if (kind === 'add') {
        api('POST', '/api/users', data).then(function (b) {
          ui.newPass = ''; ui.clear.add = true;
          setMsg('add', b.user.name + ' peut se connecter avec ' + b.user.email + ' et le mot de passe « ' + data.password + ' ».', 'ok');
          loadUsers();
        }).catch(function (er) { setMsg('add', er.message, 'err'); });
      }
    });
    el.addEventListener('change', function (e) {
      var id = e.target.getAttribute && e.target.getAttribute('data-role'); if (!id) return;
      api('PATCH', '/api/users/' + encodeURIComponent(id), { role: e.target.value })
        .then(function () { setMsg('team', 'Rôle mis à jour.', 'ok'); loadUsers(); })
        .catch(function (er) { setMsg('team', er.message, 'err'); loadUsers(); });
    });
    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-act],[data-reset],[data-del],[data-restore]'); if (!t) return;
      var u = function (id) { return (ui.users || []).filter(function (x) { return x.id === id; })[0] || {}; };
      if (t.hasAttribute('data-reset')) {
        var id = t.getAttribute('data-reset'), pw = genPassword();
        if (!confirm('Donner un nouveau mot de passe à ' + u(id).name + ' ? Ses sessions ouvertes seront fermées.')) return;
        api('PATCH', '/api/users/' + encodeURIComponent(id), { password: pw })
          .then(function () { setMsg('team', 'Nouveau mot de passe de ' + u(id).name + ' : « ' + pw + ' » (à lui transmettre).', 'ok'); })
          .catch(function (er) { setMsg('team', er.message, 'err'); });
      } else if (t.hasAttribute('data-del')) {
        var id2 = t.getAttribute('data-del');
        if (!confirm('Retirer ' + u(id2).name + ' de l’équipe ? Son compte sera supprimé (les données du CRM restent).')) return;
        api('DELETE', '/api/users/' + encodeURIComponent(id2)).then(function () { setMsg('team', 'Membre retiré.', 'ok'); loadUsers(); })
          .catch(function (er) { setMsg('team', er.message, 'err'); });
      } else if (t.hasAttribute('data-restore')) {
        var v = Number(t.getAttribute('data-restore'));
        if (!confirm('Restaurer la version ' + v + ' pour toute l’équipe ?')) return;
        api('POST', '/api/data/' + DATA_KEY + '/restore', { version: v }).then(function (b) {
          var s = st(DATA_KEY);
          s.version = b.version; s.base = b.version; s.server = b.value; s.pending = null; writePending(DATA_KEY, null);
          applyRemote(DATA_KEY, b.value); writeCache(DATA_KEY);
          setMsg('hist', 'Version ' + v + ' restaurée.', 'ok'); loadHistory();
        }).catch(function (er) { setMsg('hist', er.message, 'err'); });
      } else {
        var act = t.getAttribute('data-act');
        if (act === 'logout') api('POST', '/api/auth/logout').then(function () { location.href = '/connexion'; }).catch(function () { location.href = '/connexion'; });
        else if (act === 'sync') { Object.keys(S).forEach(function (k) { if (st(k).pending != null) schedule(k, 0); }); poll(); setTimeout(render, 800); }
        else if (act === 'hist') loadHistory();
        else if (act === 'photo') choisirPhoto(function (er) { if (er) setMsg('photo', er.message, 'err'); else { ui.msg.photo = null; render(); } });
        else if (act === 'sans-photo') api('DELETE', '/api/photos/moi').then(function () { majPhoto(null); render(); }).catch(function (er) { setMsg('photo', er.message, 'err'); });
      }
    });
    var l = function () { if (!el.isConnected) { listeners.splice(listeners.indexOf(l), 1); return; } if (!el.contains(document.activeElement)) render(); };
    listeners.push(l);
    render(); loadUsers(); loadHistory();
  }

  window.bsEquipe = {
    monterReglages: monterReglages,
    utilisateur: function () { return USER ? Object.assign({}, USER) : null; },
    photoUrl: photoUrl,
    serveur: !!CONF,
    etat: function () { var s = st(DATA_KEY); return { statut: status, version: s.version, enAttente: s.pending != null }; },
  };
})();
