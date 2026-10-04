
/* Blackstart CRM : rubrique « Carte clients » (menu › Analyse).
 *
 * Une planète animée qui tourne et montre où se trouvent vos clients et prospects, à la manière de la vue
 * « en direct » de Shopify :
 * - un point lumineux par ville (taille = nombre de fiches), vert pour les clients, bleu pour les prospects ;
 * - des arcs partent du siège de l'entreprise (Réglages › Entreprise) vers chaque ville ;
 * - l'activité récente (appels, rendez-vous, signatures…) s'allume tour à tour sur la planète ;
 * - glisser pour tourner, molette ou boutons pour zoomer, clic sur une ville pour voir ses fiches.
 * Localisation : la ville (ou le code postal) de chaque fiche, d'après un annuaire intégré, hors ligne. Les villes
 * inconnues peuvent être cherchées sur OpenStreetMap, à la demande (le résultat est gardé dans ce navigateur).
 */
(function () {
  'use strict';
  if (window.bsCarte) return;

  var GEO_KEY = 'bs-geo-cache';
  var COL = { client: '#34d399', prospect: '#60a5fa', hub: '#fbbf24' };
  var STATUTS = { a_appeler: 'À appeler', injoignable: 'Injoignable', rdv_pris: 'RDV pris', audit_realise: 'Audit réalisé', proposition_envoyee: 'Proposition envoyée', client_signe: 'Client actif', resilie: 'Résilié', perdu: 'Perdu' };
  var EVT = { call: 'Appel', appel: 'Appel', email: 'Email', sms: 'SMS', rdv: 'Rendez-vous', status: 'Statut', note: 'Note', devis: 'Devis', facture: 'Facture', whatsapp: 'WhatsApp' };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ic(name, size) {
    var p = window.bsIcones && window.bsIcones.svg ? window.bsIcones.svg(name) : '';
    return '<svg width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (p || '<circle cx="12" cy="12" r="8"/>') + '</svg>';
  }
  function readCache() { try { return JSON.parse(localStorage.getItem(GEO_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function writeCache(c) { try { localStorage.setItem(GEO_KEY, JSON.stringify(c)); } catch (e) {} }
  function ago(iso) {
    var d = (Date.now() - Date.parse(iso)) / 60000;
    if (!isFinite(d)) return '';
    if (d < 60) return 'il y a ' + Math.max(1, Math.round(d)) + ' min';
    if (d < 1440) return 'il y a ' + Math.round(d / 60) + ' h';
    return 'il y a ' + Math.round(d / 1440) + ' j';
  }
  function isClient(p) { return p.statut === 'client_signe'; }
  function isProspect(p) { return ['perdu', 'resilie', 'client_signe'].indexOf(p.statut) < 0; }

  function monter(root) {
    if (!root || root.getAttribute('data-bsc')) return;
    root.setAttribute('data-bsc', '1');
    ensureCss();
    var ui = { filtre: 'tous', sel: null, busy: false, msg: '' };
    var globe = null, cache = readCache(), places = [], unlocated = [], feed = [], feedIdx = 0, feedTimer = 0, hub = null, unsub = null;

    function store() { return window.__bsStore ? window.__bsStore.get() : { prospects: [] }; }
    function compute() {
      var st = store(), list = (st.prospects || []).filter(function (p) {
        return ui.filtre === 'clients' ? isClient(p) : ui.filtre === 'prospects' ? isProspect(p) : (isClient(p) || isProspect(p));
      });
      var by = {};
      unlocated = [];
      list.forEach(function (p) {
        var loc = window.bsGlobe.locate(p.ville, p.adresse, cache);
        if (!loc) { unlocated.push(p); return; }
        var k = loc.lat.toFixed(2) + ',' + loc.lon.toFixed(2);
        var g = by[k] || (by[k] = { key: k, lat: loc.lat, lon: loc.lon, name: (p.ville || loc.name || '').trim() || loc.name, approx: loc.approx, items: [], clients: 0 });
        g.items.push(p); if (isClient(p)) g.clients++;
      });
      places = Object.keys(by).map(function (k) { return by[k]; }).sort(function (a, b) { return b.items.length - a.items.length; });
      var ci = st.companyInfo || {};
      var h = window.bsGlobe.locate(ci.ville, ci.adresse, cache);
      hub = h ? { lon: h.lon, lat: h.lat, name: ci.nom || 'Siège' } : null;
      // Activité récente : derniers événements des fiches localisées.
      feed = [];
      list.forEach(function (p) {
        var loc = window.bsGlobe.locate(p.ville, p.adresse, cache);
        if (!loc) return;
        (p.events || []).slice(0, 6).forEach(function (ev) {
          var ts = ev && (ev.ts || (ev.date ? ev.date + 'T' + (ev.time || '09:00') + ':00' : ''));
          if (ts) feed.push({ ts: ts, type: ev.type, label: EVT[ev.type] || 'Action', p: p, loc: loc });
        });
        // Journal d'appels et signatures (fiches créées avant l'historique détaillé, ou données de démonstration).
        (p.callLog || []).slice(0, 4).forEach(function (c) {
          if (c && c.date) feed.push({ ts: c.date + 'T' + (c.time || '09:00') + ':00', type: 'call', label: 'Appel' + (STATUTS[c.outcome] ? ' · ' + STATUTS[c.outcome] : ''), p: p, loc: loc });
        });
        if (p.signedAt) feed.push({ ts: p.signedAt + 'T12:00:00', type: 'signature', label: 'Client signé', p: p, loc: loc });
      });
      feed.sort(function (a, b) { return a.ts < b.ts ? 1 : -1; });
      var seenKey = {};
      feed = feed.filter(function (f) { var k = f.p.id + f.ts; if (seenKey[k]) return false; seenKey[k] = 1; return Date.parse(f.ts) <= Date.now() + 60000; }).slice(0, 12);
    }
    function markers() {
      var max = Math.max(1, places.reduce(function (m, g) { return Math.max(m, g.items.length); }, 1));
      var out = places.map(function (g) {
        var cl = g.clients >= g.items.length - g.clients;
        return { lon: g.lon, lat: g.lat, color: cl ? COL.client : COL.prospect, size: 0.75 + 0.9 * Math.sqrt(g.items.length / max),
          label: g.name + ' · ' + g.items.length + (g.items.length > 1 ? ' fiches' : ' fiche'), place: g };
      });
      if (hub) out.push({ lon: hub.lon, lat: hub.lat, color: COL.hub, size: 1.2, label: hub.name + ' · siège', hub: true, always: true });
      return out;
    }
    // Vue de départ : centrée sur vos fiches, zoomée selon leur étalement.
    function initialView() {
      if (!places.length) return { lon: 2.3, lat: 46.5, zoom: 1.6 };
      var x = 0, y = 0, z = 0, n = 0;
      places.forEach(function (g) { var c = Math.cos(g.lat * Math.PI / 180), w = g.items.length; x += c * Math.sin(g.lon * Math.PI / 180) * w; y += Math.sin(g.lat * Math.PI / 180) * w; z += c * Math.cos(g.lon * Math.PI / 180) * w; n += w; });
      var lon = Math.atan2(x, z) * 180 / Math.PI, lat = Math.atan2(y, Math.hypot(x, z)) * 180 / Math.PI, spread = 0.3;
      places.forEach(function (g) { spread = Math.max(spread, Math.hypot(g.lat - lat, (g.lon - lon) * Math.cos(lat * Math.PI / 180))); });
      return { lon: lon, lat: lat, zoom: Math.max(1, Math.min(14, 0.32 / Math.sin(spread * Math.PI / 180))) };
    }

    function render() {
      if (globe) { globe.destroy(); globe = null; }
      clearInterval(feedTimer);
      compute();
      var st = store(), all = (st.prospects || []), nbClients = all.filter(isClient).length;
      var located = places.reduce(function (s, g) { return s + g.items.length; }, 0), total = located + unlocated.length;
      var max = Math.max(1, places.length ? places[0].items.length : 1);
      root.innerHTML =
        '<div class="page-head"><div class="page-head-text"><h1 class="page-title">Carte clients</h1><p class="page-sub">Où se trouvent vos clients et prospects, en direct sur la planète</p></div>' +
        '<div role="tablist" class="segmented">' + [['tous', 'Tous'], ['clients', 'Clients'], ['prospects', 'Prospects']].map(function (f) {
          return '<button type="button" role="tab" aria-selected="' + (ui.filtre === f[0]) + '" class="seg' + (ui.filtre === f[0] ? ' active' : '') + '" data-f="' + f[0] + '"><span>' + f[1] + '</span></button>';
        }).join('') + '</div></div>' +
        '<div class="bsc-layout"><div class="card bsc-globe-card"><canvas class="bsc-canvas" aria-label="Planète des clients : glissez pour la faire tourner"></canvas>' +
        '<div class="bsc-tip" hidden></div>' +
        '<div class="bsc-live"><i></i>En direct</div>' +
        '<div class="bsc-tools"><button type="button" data-z="1.5" title="Zoomer">+</button><button type="button" data-z="0.67" title="Dézoomer">−</button><button type="button" data-act="home" title="Recentrer">' + ic('target', 15) + '</button></div>' +
        '<div class="bsc-legend"><span><i style="background:' + COL.client + '"></i>Clients</span><span><i style="background:' + COL.prospect + '"></i>Prospects</span>' + (hub ? '<span><i style="background:' + COL.hub + '"></i>Siège</span>' : '') + '</div>' +
        '<div class="bsc-hint">Glissez pour faire tourner · molette pour zoomer · clic sur une ville</div></div>' +
        '<div class="bsc-side">' +
        '<div class="bsc-kpis"><div class="bsc-kpi"><b>' + located + '<small>/' + total + '</small></b><span>fiches localisées</span></div><div class="bsc-kpi"><b>' + places.length + '</b><span>villes</span></div><div class="bsc-kpi"><b>' + nbClients + '</b><span>clients actifs</span></div></div>' +
        (ui.sel ? selHtml() : '') +
        '<section class="card bsc-card"><h3>' + ic('map-pin', 15) + ' Par ville</h3>' + (places.length ? '<div class="bsc-places">' + places.slice(0, 12).map(function (g, i) {
          return '<button type="button" class="bsc-place" data-p="' + i + '"><span class="bsc-dot" style="background:' + (g.clients >= g.items.length - g.clients ? COL.client : COL.prospect) + '"></span><span class="bsc-pn">' + esc(g.name) + (g.approx ? ' <em>(département)</em>' : '') + '</span>' +
            '<span class="bsc-pbar"><i style="width:' + Math.round(g.items.length / max * 100) + '%"></i></span><b>' + g.items.length + '</b></button>';
        }).join('') + '</div>' : '<p class="sr-hint">Aucune fiche localisée pour l’instant. Renseignez la ville de vos prospects.</p>') + '</section>' +
        '<section class="card bsc-card"><h3>' + ic('activity', 15) + ' Activité récente</h3>' + (feed.length ? '<div class="bsc-feed">' + feed.slice(0, 7).map(function (f, i) {
          return '<div class="bsc-ev" data-ev="' + i + '"><span class="bsc-evi">' + ic(f.type === 'call' || f.type === 'appel' ? 'phone' : f.type === 'email' ? 'mail' : f.type === 'rdv' ? 'calendar' : f.type === 'signature' ? 'award' : 'sparkles', 14) + '</span><div><b>' + esc(f.p.entreprise) + '</b><span>' + esc(f.label + ' · ' + (f.p.ville || f.loc.name)) + '</span></div><em>' + esc(ago(f.ts)) + '</em></div>';
        }).join('') + '</div>' : '<p class="sr-hint">Les appels, emails et rendez-vous s’afficheront ici et s’allumeront sur la planète.</p>') + '</section>' +
        (unlocated.length ? '<section class="card bsc-card"><h3>' + ic('search', 15) + ' Non localisées (' + unlocated.length + ')</h3><p class="sr-hint">Ville absente ou inconnue de l’annuaire intégré : ' + esc(unlocated.slice(0, 6).map(function (p) { return p.entreprise + (p.ville ? ' (' + p.ville + ')' : ''); }).join(', ')) + (unlocated.length > 6 ? '…' : '') + '</p>' +
          '<div class="bsc-actions"><button type="button" class="btn btn-secondary btn-sm" data-act="osm"' + (ui.busy ? ' disabled' : '') + '>' + ic('globe', 15) + ' Chercher sur OpenStreetMap</button></div>' +
          '<p class="sr-hint bsc-small">Envoie seulement le nom de la ville (ou l’adresse) au service public OpenStreetMap, une à la fois. Résultat gardé dans ce navigateur.</p>' + (ui.msg ? '<p class="bsc-msg">' + esc(ui.msg) + '</p>' : '') + '</section>' : '') +
        '</div></div>';
      var canvas = root.querySelector('.bsc-canvas'), tip = root.querySelector('.bsc-tip'), view = initialView();
      globe = window.bsGlobe.create(canvas, {
        background: 'space', center: [0.5, 0.52], radius: 0.38, lon: view.lon, lat: view.lat, autoRotate: 5, maxZoom: 40, markers: markers(), hub: hub, labels: true,
        onHover: function (m, mx, my) {
          if (!m || !m.place) { tip.hidden = true; return; }
          var g = m.place;
          tip.innerHTML = '<b>' + esc(g.name) + '</b><span>' + g.items.length + (g.items.length > 1 ? ' fiches' : ' fiche') + ' · ' + g.clients + ' client' + (g.clients > 1 ? 's' : '') + '</span>' +
            g.items.slice(0, 5).map(function (p) { return '<div><i style="background:' + (isClient(p) ? COL.client : COL.prospect) + '"></i>' + esc(p.entreprise) + '</div>'; }).join('') + (g.items.length > 5 ? '<div class="more">+ ' + (g.items.length - 5) + ' autres</div>' : '');
          tip.style.left = Math.min(mx + 14, canvas.clientWidth - 230) + 'px'; tip.style.top = Math.max(8, my - 20) + 'px'; tip.hidden = false;
        },
        onPick: function (m) { if (m.place) { ui.sel = m.place.key; globe.focus(m.place.lon, m.place.lat); refreshSide(); } },
      });
      // La planète arrive en tournant, puis se cale sur vos fiches.
      setTimeout(function () { if (globe) globe.focus(view.lon, view.lat, 1.15); }, 400);
      // Activité en direct : chaque événement s'allume tour à tour.
      feedIdx = 0;
      feedTimer = setInterval(function () {
        if (!root.isConnected) { cleanup(); return; }
        if (!feed.length || document.hidden || !globe) return;
        var f = feed[feedIdx++ % Math.min(feed.length, 7)];
        globe.ping(f.loc.lon, f.loc.lat, f.type === 'signature' || isClient(f.p) ? COL.client : COL.prospect, f.label + ' · ' + f.p.entreprise);
        Array.prototype.forEach.call(root.querySelectorAll('.bsc-ev'), function (el) { el.classList.toggle('on', +el.getAttribute('data-ev') === (feedIdx - 1) % Math.min(feed.length, 7)); });
      }, 3800);
    }
    function selHtml() {
      var g = places.filter(function (x) { return x.key === ui.sel; })[0];
      if (!g) return '';
      return '<section class="card bsc-card bsc-sel"><h3>' + ic('map-pin', 15) + ' ' + esc(g.name) + '<button type="button" data-act="unsel" aria-label="Fermer">×</button></h3><div class="bsc-people">' + g.items.map(function (p) {
        return '<div><span class="bsc-dot" style="background:' + (isClient(p) ? COL.client : COL.prospect) + '"></span><b>' + esc(p.entreprise) + '</b><span>' + esc(p.contact || '') + '</span><em>' + esc(STATUTS[p.statut] || '') + '</em></div>';
      }).join('') + '</div></section>';
    }
    // Mise à jour du panneau sans recréer la planète.
    function refreshSide() {
      var side = root.querySelector('.bsc-side'), old = side && side.querySelector('.bsc-sel');
      if (old) old.remove();
      if (ui.sel && side) { var d = document.createElement('div'); d.innerHTML = selHtml(); var kp = side.querySelector('.bsc-kpis'); if (d.firstChild) kp.parentNode.insertBefore(d.firstChild, kp.nextSibling); }
    }
    function cleanup() { clearInterval(feedTimer); if (globe) globe.destroy(); globe = null; if (unsub) unsub(); unsub = null; }

    // Recherche en ligne des villes inconnues, une par seconde.
    function osm() {
      var todo = {}, keys;
      unlocated.forEach(function (p) { var q = (p.ville || '').trim() || (p.adresse || '').trim(); if (q) todo[window.bsGlobe.norm(q)] = q; });
      keys = Object.keys(todo).filter(function (k) { return !(k in cache); });
      if (!keys.length) { ui.msg = 'Rien de plus à chercher : complétez la ville des fiches restantes.'; render(); return; }
      ui.busy = true; ui.msg = 'Recherche de ' + keys.length + ' lieu(x)…'; render();
      var found = 0, i = 0;
      (function next() {
        if (i >= keys.length) { writeCache(cache); ui.busy = false; ui.msg = found + ' lieu(x) trouvé(s) sur ' + keys.length + '.'; render(); return; }
        var k = keys[i++], q = todo[k];
        window.bsGlobe.geocodeOnline(/\d{5}|france/i.test(q) ? q : q + ', France').then(function (r) {
          cache[k] = r ? { name: q, lat: r.lat, lon: r.lon } : false; if (r) found++;
        }).catch(function () { /* hors ligne : on réessaiera plus tard */ }).then(function () { setTimeout(next, 1100); });
      })();
    }

    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-f],[data-z],[data-act],[data-p],[data-ev]'); if (!t || t.disabled) return;
      if (t.hasAttribute('data-f')) { ui.filtre = t.getAttribute('data-f'); ui.sel = null; render(); return; }
      if (t.hasAttribute('data-z')) { globe && globe.zoomBy(+t.getAttribute('data-z')); return; }
      if (t.hasAttribute('data-p')) { var g = places[+t.getAttribute('data-p')]; ui.sel = g.key; globe.focus(g.lon, g.lat, 12); refreshSide(); return; }
      if (t.hasAttribute('data-ev')) { var f = feed[+t.getAttribute('data-ev')]; if (f) { globe.focus(f.loc.lon, f.loc.lat); globe.ping(f.loc.lon, f.loc.lat, isClient(f.p) ? COL.client : COL.prospect, f.p.entreprise); } return; }
      var act = t.getAttribute('data-act');
      if (act === 'home') { var v = initialView(); globe.focus(v.lon, v.lat, v.zoom); }
      else if (act === 'unsel') { ui.sel = null; refreshSide(); }
      else if (act === 'osm') osm();
    });
    // Les fiches changent (nouveau client, ville corrigée, collègue) : la carte suit.
    if (window.__bsStore && window.__bsStore.subscribe) {
      var lastSig = '', tm = 0;
      var sub = window.__bsStore.subscribe(function (s) {
        if (!root.isConnected) { cleanup(); return; }
        var sig = (s.prospects || []).map(function (p) { return p.id + p.statut + (p.ville || '') + ((p.events || [])[0] || {}).ts; }).join('|');
        if (sig === lastSig) return;
        lastSig = sig; clearTimeout(tm); tm = setTimeout(function () { if (!ui.busy) render(); }, 400);
      });
      unsub = typeof sub === 'function' ? sub : null;
      lastSig = (store().prospects || []).map(function (p) { return p.id + p.statut + (p.ville || '') + ((p.events || [])[0] || {}).ts; }).join('|');
    }
    render();
  }

  var CSS = [
    '.bsc-layout{display:grid;gap:16px;grid-template-columns:minmax(0,1fr)}',
    '@media (min-width:1150px){.bsc-layout{grid-template-columns:minmax(0,1fr) 340px;align-items:start}}',
    '.bsc-globe-card{position:relative;padding:0;overflow:hidden;height:min(72vh,680px);min-height:420px;background:#01030a}',
    '.bsc-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}',
    '.bsc-live{position:absolute;left:16px;top:14px;display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:99px;background:rgb(3 8 18/.7);border:1px solid rgb(52 211 153/.4);color:#a7f3d0;font-size:12.5px;font-weight:700;letter-spacing:.04em;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}',
    '.bsc-live i{width:8px;height:8px;border-radius:50%;background:#34d399;box-shadow:0 0 0 0 rgb(52 211 153/.7);animation:bscLive 1.6s infinite}',
    '@keyframes bscLive{70%{box-shadow:0 0 0 8px rgb(52 211 153/0)}100%{box-shadow:0 0 0 0 rgb(52 211 153/0)}}',
    '.bsc-tools{position:absolute;right:14px;top:14px;display:flex;flex-direction:column;gap:6px}',
    '.bsc-tools button{width:36px;height:36px;border-radius:10px;border:1px solid rgb(148 163 184/.3);background:rgb(3 8 18/.7);color:#eaf1fb;font:700 18px/1 Inter,system-ui;display:grid;place-items:center;cursor:pointer;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}',
    '.bsc-tools button:hover{background:rgb(59 130 246/.35)}',
    '.bsc-legend{position:absolute;left:16px;bottom:14px;display:flex;gap:14px;padding:7px 12px;border-radius:12px;background:rgb(3 8 18/.7);color:#cfe0f7;font-size:12.5px;font-weight:600;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}',
    '.bsc-legend span{display:flex;align-items:center;gap:6px}',
    '.bsc-legend i,.bsc-dot{width:9px;height:9px;border-radius:50%;flex:none;box-shadow:0 0 8px currentColor}',
    '.bsc-hint{position:absolute;right:16px;bottom:16px;color:rgb(207 224 247/.6);font-size:12px}',
    '@media (max-width:700px){.bsc-hint{display:none}}',
    '.bsc-tip{position:absolute;z-index:5;min-width:180px;max-width:230px;padding:10px 12px;border-radius:12px;background:rgb(8 16 32/.94);border:1px solid rgb(96 165 250/.4);color:#eaf1fb;font-size:12.5px;pointer-events:none;box-shadow:0 14px 30px -10px #000}',
    '.bsc-tip b{display:block;font-size:14px}',
    '.bsc-tip span{display:block;color:#93c5fd;margin:2px 0 6px}',
    '.bsc-tip div{display:flex;align-items:center;gap:6px;margin-top:3px}',
    '.bsc-tip div i{width:7px;height:7px;border-radius:50%}',
    '.bsc-tip .more{color:#7d93b5}',
    '.bsc-side{display:flex;flex-direction:column;gap:14px;min-width:0}',
    '.bsc-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}',
    '.bsc-kpi{padding:12px;border-radius:14px;background:var(--surface);border:1px solid var(--border)}',
    '.bsc-kpi b{display:block;font-size:22px;letter-spacing:-.02em}',
    '.bsc-kpi b small{font-size:13px;color:var(--text-3);font-weight:600}',
    '.bsc-kpi span{font-size:12px;color:var(--text-3)}',
    '.bsc-card{padding:14px 14px 12px}',
    '.bsc-card h3{display:flex;align-items:center;gap:8px;margin:0 0 10px;font-size:14.5px}',
    '.bsc-card h3 button{margin-left:auto;border:0;background:none;color:var(--text-3);font-size:20px;cursor:pointer;line-height:1}',
    '.bsc-places{display:flex;flex-direction:column;gap:2px}',
    '.bsc-place{display:grid;grid-template-columns:auto minmax(0,1fr) 70px 28px;align-items:center;gap:9px;padding:7px 8px;border-radius:10px;border:0;background:none;color:var(--text);font:inherit;font-size:13.5px;text-align:left;cursor:pointer}',
    '.bsc-place:hover{background:var(--surface-2)}',
    '.bsc-pn{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}',
    '.bsc-pn em{font-style:normal;color:var(--text-3);font-weight:500;font-size:11.5px}',
    '.bsc-pbar{height:6px;border-radius:99px;background:var(--surface-3);overflow:hidden}',
    '.bsc-pbar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--accent),#22d3ee)}',
    '.bsc-place b{text-align:right;font-variant-numeric:tabular-nums}',
    '.bsc-feed{display:flex;flex-direction:column;gap:2px}',
    '.bsc-ev{display:grid;grid-template-columns:28px minmax(0,1fr) auto;align-items:center;gap:9px;padding:7px 8px;border-radius:10px;cursor:pointer;transition:background .3s}',
    '.bsc-ev:hover,.bsc-ev.on{background:rgb(var(--accent-rgb)/.12)}',
    '.bsc-ev.on .bsc-evi{background:var(--accent);color:#fff}',
    '.bsc-evi{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;background:var(--surface-3);color:var(--text-2);transition:background .3s,color .3s}',
    '.bsc-ev b{display:block;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.bsc-ev span{font-size:12px;color:var(--text-3)}',
    '.bsc-ev em{font-style:normal;font-size:11.5px;color:var(--text-3);white-space:nowrap}',
    '.bsc-people{display:flex;flex-direction:column;gap:6px;max-height:260px;overflow:auto}',
    '.bsc-people div{display:grid;grid-template-columns:auto minmax(0,1fr) auto;column-gap:8px;align-items:center;font-size:13px}',
    '.bsc-people span:not(.bsc-dot){grid-column:2;color:var(--text-3);font-size:12px}',
    '.bsc-people em{grid-column:3;grid-row:1;font-style:normal;font-size:11.5px;color:var(--text-2)}',
    '.bsc-actions{margin:8px 0}',
    '.bsc-small{font-size:11.5px}',
    '.bsc-msg{font-size:13px;color:var(--text-2);margin:6px 0 0}',
  ].join('\n');
  function ensureCss() {
    if (document.getElementById('bs-carte-css')) return;
    var s = document.createElement('style'); s.id = 'bs-carte-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  window.bsCarte = { monter: monter };
})();
