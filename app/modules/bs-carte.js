
/* Blackstart CRM : rubrique « Carte clients » (menu › Analyse).
 *
 * Deux vues de votre territoire : une carte vectorielle nette (bs-carte-map : pays, départements teintés selon le
 * nombre de fiches, bulles par ville, cadrage automatique) et la planète animée (bs-globe), à la manière de la vue
 * « en direct » de Shopify. Le choix est gardé dans ce navigateur.
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
  var VUE_KEY = 'bs-carte-vue';
  function readVue() { try { return localStorage.getItem(VUE_KEY) === 'globe' || !window.bsCarteMap ? 'globe' : 'carte'; } catch (e) { return 'carte'; } }
  function writeVue(v) { try { localStorage.setItem(VUE_KEY, v); } catch (e) {} }
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
    var ui = { filtre: 'tous', sel: null, busy: false, msg: '', vue: readVue() };
    var globe = null, eng = null, cache = readCache(), places = [], unlocated = [], feed = [], feedIdx = 0, feedTimer = 0, hub = null, unsub = null;

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

    // ---------------------------------------------------------------- affichage
    var STAT_COL = { a_appeler: '#60a5fa', injoignable: '#94a3b8', rdv_pris: '#a78bfa', audit_realise: '#22d3ee', proposition_envoyee: '#fbbf24', client_signe: '#34d399', resilie: '#fb7185', perdu: '#fb7185' };
    function euro(v) { return Math.round(v || 0).toLocaleString('fr-FR') + ' €'; }
    function initials(s) { return String(s || '?').replace(/[^\p{L}\p{N} ]/gu, ' ').trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase() || '?'; }
    function hue(s) { var h = 0; String(s || '').split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) % 360; }); return h; }
    function mrr(list) { return list.reduce(function (s, p) { return s + (isClient(p) ? +p.mrrValue || 0 : 0); }, 0); }
    function pipe(list) { return list.reduce(function (s, p) { return s + (isProspect(p) ? +p.dealValue || 0 : 0); }, 0); }
    function frDate(d) { if (!d) return ''; var x = new Date(d + 'T12:00:00'); return isNaN(x) ? '' : x.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }); }
    function openFiche(id) { if (window.__bsY) window.__bsY.set(function (s) { return { overlays: (s.overlays || []).concat([{ key: 'bsc' + Date.now(), type: 'prospect', id: id }]) }; }); }
    function placeOf(key) { return places.filter(function (x) { return x.key === key; })[0]; }
    // Zoom qui montre une ville et ses voisines, sans perdre le relief de la planète.
    function cityZoom() { return Math.max(5, Math.min(12, initialView().zoom * 0.8)); }
    // Vue carte : largeur (km) qui montre une ville et ses voisines les plus proches.
    function nearSpan(g) {
      var d = places.filter(function (o) { return o !== g; }).map(function (o) { return Math.hypot(o.lat - g.lat, (o.lon - g.lon) * Math.cos(g.lat * Math.PI / 180)) * 111; }).sort(function (a, b) { return a - b; });
      return Math.max(14, Math.min(160, (d[Math.min(2, d.length - 1)] || 20) * 2.4));
    }

    function feedHtml() {
      return '<section class="card bsc-card bsc-feedcard"><h3>' + ic('activity', 15) + ' Activité récente<span class="bsc-h3s">s’allume sur la carte</span></h3>' + (feed.length ? '<div class="bsc-feed">' + feed.slice(0, 8).map(function (f, i) {
        return '<div class="bsc-ev" data-ev="' + i + '"><span class="bsc-evi">' + ic(f.type === 'call' || f.type === 'appel' ? 'phone' : f.type === 'email' ? 'mail' : f.type === 'rdv' ? 'calendar' : f.type === 'signature' ? 'award' : 'sparkles', 14) + '</span><div><b>' + esc(f.p.entreprise) + '</b><span>' + esc(f.label + ' · ' + (f.p.ville || f.loc.name)) + '</span></div><em>' + esc(ago(f.ts)) + '</em></div>';
      }).join('') + '</div>' : '<p class="sr-hint">Les appels, emails et rendez-vous s’afficheront ici et s’allumeront sur la carte.</p>') + '</section>';
    }
    function render() {
      if (eng) { eng.destroy(); eng = null; } globe = null;
      clearInterval(feedTimer); stopTour(true);
      compute();
      var isMap = ui.vue === 'carte' && !!window.bsCarteMap;
      var st = store(), all = (st.prospects || []), nbClients = all.filter(isClient).length;
      var located = places.reduce(function (s, g) { return s + g.items.length; }, 0), total = located + unlocated.length;
      var max = Math.max(1, places.length ? places[0].items.length : 1);
      var listed = places.reduce(function (a, g) { return a.concat(g.items); }, []).concat(unlocated);
      var kpis = [
        ['map-pin', located, '/' + total, 'fiches localisées', ''],
        ['globe', places.length, '', places.length > 1 ? 'villes' : 'ville', ''],
        ['award', nbClients, '', 'clients actifs', 'green'],
        ['trending-up', mrr(listed), ' €', 'abonnements / mois', 'green'],
        ['target', pipe(listed), ' €', 'en négociation', 'amber'],
      ];
      root.innerHTML =
        '<div class="page-head bsc-head"><div class="page-head-text"><h1 class="page-title">Carte clients</h1><p class="page-sub">Votre territoire en direct : qui, où, combien, et ce qui bouge en ce moment</p></div>' +
        '<div class="bsc-headtools"><label class="bsc-search">' + ic('search', 15) + '<input type="search" placeholder="Trouver un client ou une ville…" aria-label="Trouver un client ou une ville" list="bsc-dl"><datalist id="bsc-dl">' +
        listed.slice(0, 400).map(function (p) { return '<option value="' + esc(p.entreprise) + '">'; }).join('') + places.map(function (g) { return '<option value="' + esc(g.name) + '">'; }).join('') + '</datalist></label>' +
        '<div role="tablist" class="segmented">' + [['tous', 'Tous'], ['clients', 'Clients'], ['prospects', 'Prospects']].map(function (f) {
          return '<button type="button" role="tab" aria-selected="' + (ui.filtre === f[0]) + '" class="seg' + (ui.filtre === f[0] ? ' active' : '') + '" data-f="' + f[0] + '"><span>' + f[1] + '</span></button>';
        }).join('') + '</div></div></div>' +
        '<div class="bsc-kpis">' + kpis.map(function (k, i) {
          return '<div class="bsc-kpi ' + k[4] + '" style="--i:' + i + '"><span class="bsc-kic">' + ic(k[0], 16) + '</span><div><b data-count="' + k[1] + '" data-suffix="' + esc(k[2]) + '">' + (k[2] === ' €' ? euro(k[1]) : k[1] + '<small>' + esc(k[2]) + '</small>') + '</b><span>' + k[3] + '</span></div></div>';
        }).join('') + '</div>' +
        '<div class="bsc-layout"><div class="bsc-main"><div class="card bsc-globe-card' + (isMap ? ' map' : '') + '"><canvas class="bsc-canvas" aria-label="' + (isMap ? 'Carte des clients : glissez pour déplacer, molette pour zoomer' : 'Planète des clients : glissez pour la faire tourner') + '"></canvas>' +
        (isMap ? '' : '<div class="bsc-vignette" aria-hidden="true"></div>') +
        '<div class="bsc-tip" hidden></div>' +
        '<div class="bsc-topbar"><div class="bsc-live"><i></i>En direct</div><div class="bsc-mode" role="group" aria-label="Type de vue">' +
        [['carte', 'map', 'Carte'], ['globe', 'globe', 'Globe 3D']].map(function (v) { return '<button type="button" data-vue="' + v[0] + '" aria-pressed="' + (ui.vue === v[0]) + '">' + ic(v[1], 13) + '<span>' + v[2] + '</span></button>'; }).join('') +
        '</div><button type="button" class="bsc-tour" data-act="tour" aria-pressed="false">' + ic('play', 13) + '<span>Visite guidée</span></button></div>' +
        '<div class="bsc-tools">' + fsButton() + '<button type="button" data-z="1.5" title="Zoomer" aria-label="Zoomer">+</button><button type="button" data-z="0.67" title="Dézoomer" aria-label="Dézoomer">−</button><button type="button" data-act="home" title="Recentrer sur mes fiches" aria-label="Recentrer">' + ic('target', 15) + '</button><button type="button" data-act="world" title="Vue du monde" aria-label="Vue du monde">' + ic('globe', 15) + '</button></div>' +
        '<div class="bsc-spot" hidden></div>' +
        '<div class="bsc-legend"><span><i style="background:' + COL.client + '"></i>Clients</span><span><i style="background:' + COL.prospect + '"></i>Prospects</span>' + (hub ? '<span><i class="hub" style="background:' + COL.hub + '"></i>Siège</span>' : '') +
        (isMap ? '<span class="bsc-lg-heat" title="Teinte des départements selon le nombre de fiches"><b></b>Fiches par département</span>' : '') + '</div>' +
        (isMap ? '' : '<div class="bsc-hint">Glissez pour tourner · molette pour zoomer · clic sur une ville</div>') + '</div>' +
        feedHtml() + '</div>' +
        '<div class="bsc-side">' +
        '<div class="bsc-selwrap">' + (ui.sel ? selHtml() : '') + '</div>' +
        '<section class="card bsc-card"><h3>' + ic('map-pin', 15) + ' Top villes<span class="bsc-h3s">clients · prospects</span></h3>' + (places.length ? '<div class="bsc-places">' + places.slice(0, 10).map(function (g, i) {
          var c = g.clients, pr = g.items.length - c, m = mrr(g.items);
          return '<button type="button" class="bsc-place' + (ui.sel === g.key ? ' on' : '') + '" data-p="' + i + '" style="--i:' + i + '"><span class="bsc-rank">' + (i + 1) + '</span><span class="bsc-pn">' + esc(g.name) + (g.approx ? ' <em>(département)</em>' : '') +
            '<small>' + (m ? euro(m) + '/mois' : g.items.length + (g.items.length > 1 ? ' fiches' : ' fiche')) + '</small></span>' +
            '<span class="bsc-pbar" title="' + c + ' client(s), ' + pr + ' prospect(s)"><i class="c" style="width:' + (c / max * 100) + '%"></i><i class="p" style="width:' + (pr / max * 100) + '%"></i></span><b>' + g.items.length + '</b></button>';
        }).join('') + '</div>' : '<p class="sr-hint">Aucune fiche localisée pour l’instant. Renseignez la ville de vos prospects.</p>') + '</section>' +
        (unlocated.length ? '<section class="card bsc-card"><h3>' + ic('search', 15) + ' Non localisées (' + unlocated.length + ')</h3><p class="sr-hint">Ville absente ou inconnue de l’annuaire intégré : ' + esc(unlocated.slice(0, 6).map(function (p) { return p.entreprise + (p.ville ? ' (' + p.ville + ')' : ''); }).join(', ')) + (unlocated.length > 6 ? '…' : '') + '</p>' +
          '<div class="bsc-actions"><button type="button" class="btn btn-secondary btn-sm" data-act="osm"' + (ui.busy ? ' disabled' : '') + '>' + ic('globe', 15) + ' Chercher sur OpenStreetMap</button></div>' +
          '<p class="sr-hint bsc-small">Envoie seulement le nom de la ville (ou l’adresse) au service public OpenStreetMap, une à la fois. Résultat gardé dans ce navigateur.</p>' + (ui.msg ? '<p class="bsc-msg">' + esc(ui.msg) + '</p>' : '') + '</section>' : '') +
        '</div></div>';
      countUp();
      var canvas = root.querySelector('.bsc-canvas'), tip = root.querySelector('.bsc-tip'), view = initialView();
      // Infobulle : une ville, ou un groupe de villes voisines (vue carte, avant de zoomer).
      function showTip(list, mx, my) {
        if (!list || !list.length) { tip.hidden = true; return; }
        var items = list.reduce(function (a, g) { return a.concat(g.items); }, []), cl = list.reduce(function (s, g) { return s + g.clients; }, 0), mm = mrr(items);
        tip.innerHTML = '<b>' + esc(list.length > 1 ? list[0].name + ' et ' + (list.length - 1) + ' ville' + (list.length > 2 ? 's' : '') + ' proche' + (list.length > 2 ? 's' : '') : list[0].name) + '</b><span>' + items.length + (items.length > 1 ? ' fiches' : ' fiche') + ' · ' + cl + ' client' + (cl > 1 ? 's' : '') + (mm ? ' · ' + euro(mm) + '/mois' : '') + '</span>' +
          (list.length > 1 ? list.slice(0, 5).map(function (g) { return '<div><i style="background:' + (g.clients ? COL.client : COL.prospect) + '"></i>' + esc(g.name) + ' · ' + g.items.length + '</div>'; }).join('') + '<div class="more">Cliquez pour zoomer</div>'
            : items.slice(0, 5).map(function (p) { return '<div><i style="background:' + (STAT_COL[p.statut] || COL.prospect) + '"></i>' + esc(p.entreprise) + '</div>'; }).join('') + (items.length > 5 ? '<div class="more">+ ' + (items.length - 5) + ' autres</div>' : ''));
        tip.style.left = Math.max(8, Math.min(mx + 14, canvas.clientWidth - 240)) + 'px'; tip.style.top = Math.max(8, Math.min(my - 20, canvas.clientHeight - 170)) + 'px'; tip.hidden = false;
      }
      function pick(g) { stopTour(); select(g, true); }
      if (isMap) {
        var map = window.bsCarteMap.create(canvas, {
          markers: places.map(function (g) {
            var m = mrr(g.items);
            return { key: g.key, lon: g.lon, lat: g.lat, n: g.items.length, clients: g.clients, name: g.name, place: g,
              sub: g.items.length + (g.items.length > 1 ? ' fiches' : ' fiche') + (m ? ' · ' + euro(m) + '/mois' : '') };
          }),
          hub: hub,
          onHover: function (c, mx, my) { showTip(c ? c.items.map(function (m) { return m.place; }) : null, mx, my); },
          onPick: function (m) { if (m.place) pick(m.place); },
        });
        eng = {
          home: function () { map.fit(places.length ? places : null); },
          city: function (g) { map.focus(g.lon, g.lat, nearSpan(g)); },
          at: function (lon, lat) { map.focus(lon, lat, 30); },
          world: function () { map.world(); },
          ping: map.ping, zoomBy: map.zoomBy, select: map.select, destroy: map.destroy,
        };
        // Entrée en scène : vue de la France, puis cadrage sur vos fiches.
        map.fit([], 0);
        if (places.length) setTimeout(function () { if (eng) eng.home(); }, 350);
      } else {
        globe = window.bsGlobe.create(canvas, {
          background: 'space', center: [0.5, 0.52], radius: 0.38, lon: view.lon - 70, lat: view.lat * 0.4, autoRotate: 5, maxZoom: 40, markers: markers(), hub: hub, labels: true,
          onHover: function (m, mx, my) { showTip(m && m.place ? [m.place] : null, mx, my); },
          onPick: function (m) { if (m.place) pick(m.place); },
        });
        var gl = globe;
        eng = {
          home: function () { var v = initialView(); gl.focus(v.lon, v.lat, Math.min(v.zoom, 5.5)); },
          city: function (g) { gl.focus(g.lon, g.lat, cityZoom()); },
          at: function (lon, lat) { gl.focus(lon, lat, cityZoom()); },
          world: function () { var w = initialView(); gl.focus(w.lon, w.lat * 0.5, 0.8); },
          ping: gl.ping, zoomBy: gl.zoomBy, select: function () {}, destroy: gl.destroy,
        };
        // Entrée en scène : la planète arrive de loin en tournant, puis plonge sur vos fiches.
        setTimeout(function () { if (eng) eng.home(); }, 700);
      }
      if (ui.sel) { var g0 = placeOf(ui.sel); if (g0) { spot(g0); eng.select(g0.key); } }
      // Activité en direct : chaque événement s'allume tour à tour.
      feedIdx = 0;
      feedTimer = setInterval(function () {
        if (!root.isConnected) { cleanup(); return; }
        if (!feed.length || document.hidden || !eng || tour) return;
        var n = Math.min(feed.length, 8), f = feed[feedIdx++ % n];
        eng.ping(f.loc.lon, f.loc.lat, f.type === 'signature' || isClient(f.p) ? COL.client : COL.prospect, f.label + ' · ' + f.p.entreprise);
        Array.prototype.forEach.call(root.querySelectorAll('.bsc-ev'), function (el) { el.classList.toggle('on', +el.getAttribute('data-ev') === (feedIdx - 1) % n); });
      }, 3800);
    }
    // Les chiffres défilent jusqu'à leur valeur.
    function countUp() {
      var reduce = document.documentElement.getAttribute('data-motion') === 'reduced' || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (reduce) return;
      Array.prototype.forEach.call(root.querySelectorAll('[data-count]'), function (el) {
        var to = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix'), t0 = performance.now(), d = 1100;
        (function step(t) {
          if (!el.isConnected) return;
          var k = Math.min(1, (t - t0) / d), v = to * (1 - Math.pow(1 - k, 3));
          el.innerHTML = suf === ' €' ? euro(v) : Math.round(v) + '<small>' + esc(suf) + '</small>';
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      });
    }
    function personHtml(p, i) {
      var col = STAT_COL[p.statut] || COL.prospect, val = isClient(p) ? (+p.mrrValue ? euro(p.mrrValue) + '<small>/mois</small>' : '') : (+p.dealValue ? euro(p.dealValue) + '<small> en jeu</small>' : '');
      var tel = String(p.telephone || '').replace(/[^\d+]/g, '');
      return '<article class="bsc-person" style="--i:' + i + ';--c:' + col + '" data-pid="' + esc(p.id) + '">' +
        '<span class="bsc-av" style="--h:' + hue(p.entreprise) + '">' + esc(initials(p.entreprise)) + '</span>' +
        '<div class="bsc-pm"><b>' + esc(p.entreprise) + '</b><span>' + esc([p.contact, p.secteur].filter(Boolean).join(' · ')) + '</span>' +
        '<div class="bsc-tags"><em class="bsc-stat">' + esc(STATUTS[p.statut] || 'Prospect') + '</em>' + (p.prochaineRelance ? '<em>' + ic('calendar', 11) + ' ' + esc(frDate(p.prochaineRelance) + (p.prochaineRelanceHeure ? ' · ' + p.prochaineRelanceHeure : '')) + '</em>' : '') + (p.priorite === 'haute' ? '<em class="hot">Priorité haute</em>' : '') + '</div></div>' +
        '<div class="bsc-pv">' + (val ? '<strong>' + val + '</strong>' : '') + '<div class="bsc-pa">' + (tel ? '<a href="tel:' + esc(tel) + '" title="Appeler ' + esc(p.contact || p.entreprise) + '" aria-label="Appeler">' + ic('phone', 14) + '</a>' : '') +
        '<button type="button" data-open="' + esc(p.id) + '" title="Ouvrir la fiche" aria-label="Ouvrir la fiche de ' + esc(p.entreprise) + '">' + ic('external-link', 14) + '</button></div></div></article>';
    }
    function selHtml() {
      var g = placeOf(ui.sel);
      if (!g) return '';
      var items = g.items.slice().sort(function (a, b) { return (isClient(b) - isClient(a)) || ((+b.mrrValue || +b.dealValue || 0) - (+a.mrrValue || +a.dealValue || 0)); });
      var m = mrr(g.items), pv = pipe(g.items);
      return '<section class="card bsc-card bsc-sel"><h3>' + ic('map-pin', 15) + ' ' + esc(g.name) + '<button type="button" data-act="unsel" aria-label="Fermer">×</button></h3>' +
        '<div class="bsc-selk"><div><b>' + g.clients + '</b><span>client' + (g.clients > 1 ? 's' : '') + '</span></div><div><b>' + (g.items.length - g.clients) + '</b><span>prospect' + (g.items.length - g.clients > 1 ? 's' : '') + '</span></div><div><b>' + euro(m) + '</b><span>par mois</span></div><div><b>' + euro(pv) + '</b><span>en jeu</span></div></div>' +
        '<div class="bsc-people">' + items.map(personHtml).join('') + '</div></section>';
    }
    // Carte flottante sur la planète : la ville en cours (sélection ou visite guidée).
    function spot(g) {
      var el = root.querySelector('.bsc-spot'); if (!el) return;
      if (!g) { el.hidden = true; return; }
      var m = mrr(g.items), top = g.items.slice().sort(function (a, b) { return (isClient(b) - isClient(a)); }).slice(0, 3);
      el.innerHTML = '<div class="bsc-spot-in"><span class="bsc-spot-k">' + (tour ? 'Visite · ' + (tourIdx) + '/' + Math.min(places.length, 8) : 'Ville sélectionnée') + '</span><b>' + esc(g.name) + '</b>' +
        '<p>' + g.clients + ' client' + (g.clients > 1 ? 's' : '') + ' · ' + (g.items.length - g.clients) + ' prospect' + (g.items.length - g.clients > 1 ? 's' : '') + (m ? ' · <strong>' + euro(m) + '/mois</strong>' : '') + '</p>' +
        '<ul>' + top.map(function (p) { return '<li><i style="background:' + (STAT_COL[p.statut] || COL.prospect) + '"></i>' + esc(p.entreprise) + '</li>'; }).join('') + '</ul></div>';
      el.hidden = false; el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
    }
    function select(g, fly) {
      ui.sel = g.key;
      if (fly && eng) eng.city(g);
      if (eng) { eng.ping(g.lon, g.lat, g.clients ? COL.client : COL.prospect, g.name); eng.select(g.key); }
      refreshSide(); spot(g);
      Array.prototype.forEach.call(root.querySelectorAll('.bsc-place'), function (b) { b.classList.toggle('on', places[+b.getAttribute('data-p')] === g); });
    }
    // Mise à jour du panneau sans recréer la planète.
    function refreshSide() {
      var w = root.querySelector('.bsc-selwrap'); if (w) w.innerHTML = ui.sel ? selHtml() : '';
      if (!ui.sel) spot(null);
    }
    // Visite guidée : la caméra survole vos principales villes, une à une.
    var tour = 0, tourIdx = 0;
    function startTour() {
      if (!places.length || !eng) return;
      tourIdx = 0; step();
      tour = setInterval(step, 5200);
      var b = root.querySelector('.bsc-tour'); if (b) { b.setAttribute('aria-pressed', 'true'); b.innerHTML = ic('pause', 13) + '<span>Arrêter la visite</span>'; }
      function step() {
        if (!root.isConnected || !eng) { stopTour(true); return; }
        var n = Math.min(places.length, 8);
        if (tourIdx >= n) { stopTour(); eng.home(); return; }
        var g = places[tourIdx++]; select(g, true);
      }
    }
    function stopTour(silent) {
      if (!tour) return;
      clearInterval(tour); tour = 0;
      if (silent) return;
      var b = root.querySelector('.bsc-tour'); if (b) { b.setAttribute('aria-pressed', 'false'); b.innerHTML = ic('play', 13) + '<span>Visite guidée</span>'; }
    }
    function find(q) {
      q = window.bsGlobe.norm ? window.bsGlobe.norm(q) : String(q).toLowerCase(); if (!q) return;
      var hit = null, pid = null;
      places.some(function (g) {
        if ((window.bsGlobe.norm ? window.bsGlobe.norm(g.name) : g.name.toLowerCase()).indexOf(q) === 0) { hit = g; return true; }
        return g.items.some(function (p) { var n = window.bsGlobe.norm ? window.bsGlobe.norm(p.entreprise + ' ' + (p.contact || '')) : (p.entreprise + ' ' + (p.contact || '')).toLowerCase(); if (n.indexOf(q) >= 0) { hit = g; pid = p.id; return true; } return false; });
      });
      if (!hit) { ui.msg = ''; var s = root.querySelector('.bsc-search'); if (s) { s.classList.remove('miss'); void s.offsetWidth; s.classList.add('miss'); } return; }
      stopTour(); select(hit, true);
      if (pid) { var el = root.querySelector('.bsc-person[data-pid="' + (window.CSS && CSS.escape ? CSS.escape(pid) : pid) + '"]'); if (el) { el.classList.add('flash'); el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } }
    }
    function cleanup() { clearInterval(feedTimer); stopTour(true); if (eng) eng.destroy(); eng = null; globe = null; if (unsub) unsub(); unsub = null; if (!root.isConnected) fsOff(); }

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

    // Plein écran : toute la rubrique passe en plein écran (la carte occupe l'écran, le reste est masqué), pour que
    // changer de vue ou de filtre n'en fasse pas sortir. Sans l'API (iPhone), la carte couvre la fenêtre.
    var pseudoFs = false;
    function isFs() { return pseudoFs || document.fullscreenElement === root || document.webkitFullscreenElement === root; }
    function fsSvg(on) {
      var d = on ? ['M8 3v3a2 2 0 0 1-2 2H3', 'M21 8h-3a2 2 0 0 1-2-2V3', 'M3 16h3a2 2 0 0 1 2 2v3', 'M16 21v-3a2 2 0 0 1 2-2h3']
        : ['M8 3H5a2 2 0 0 0-2 2v3', 'M21 8V5a2 2 0 0 0-2-2h-3', 'M3 16v3a2 2 0 0 0 2 2h3', 'M16 21h3a2 2 0 0 0 2-2v-3'];
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d.map(function (x) { return '<path d="' + x + '"/>'; }).join('') + '</svg>';
    }
    function fsButton() {
      var on = isFs(), lab = on ? 'Quitter le plein écran (Échap)' : 'Plein écran';
      return '<button type="button" class="bsc-fsbtn" data-act="fs" title="' + lab + '" aria-label="' + lab + '" aria-pressed="' + on + '">' + fsSvg(on) + '</button>';
    }
    function syncFs() {
      if (!root.isConnected) { fsOff(); return; }
      var on = isFs();
      root.classList.toggle('bsc-is-fs', on);
      root.classList.toggle('bsc-fs', pseudoFs);
      document.documentElement.classList.toggle('bsc-noscroll', pseudoFs);
      var b = root.querySelector('[data-act=fs]');
      if (b) b.outerHTML = fsButton();
      if (eng && eng.home) setTimeout(function () { if (eng) eng.home(); }, 120);
    }
    function pseudoOn() { pseudoFs = true; syncFs(); }
    function enterFs() {
      var req = root.requestFullscreen || root.webkitRequestFullscreen;
      if (!req) { pseudoOn(); return; }
      try { var pr = req.call(root); if (pr && pr.catch) pr.catch(pseudoOn); } catch (err) { pseudoOn(); }
    }
    function exitFs() {
      if (pseudoFs) { pseudoFs = false; syncFs(); return; }
      var ex = document.exitFullscreen || document.webkitExitFullscreen;
      if (ex && (document.fullscreenElement || document.webkitFullscreenElement)) { try { var pr = ex.call(document); if (pr && pr.catch) pr.catch(function () {}); } catch (err) {} }
    }
    function onFsKey(e) { if (e.key === 'Escape' && pseudoFs) exitFs(); }
    function fsOff() {
      document.removeEventListener('fullscreenchange', syncFs); document.removeEventListener('webkitfullscreenchange', syncFs);
      document.removeEventListener('keydown', onFsKey);
      if (pseudoFs) { pseudoFs = false; document.documentElement.classList.remove('bsc-noscroll'); }
    }
    document.addEventListener('fullscreenchange', syncFs); document.addEventListener('webkitfullscreenchange', syncFs);
    document.addEventListener('keydown', onFsKey);

    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-f],[data-z],[data-act],[data-p],[data-ev],[data-open],[data-vue]'); if (!t || t.disabled) return;
      if (t.hasAttribute('data-open')) { var oid = t.getAttribute('data-open'); if (isFs()) { exitFs(); setTimeout(function () { openFiche(oid); }, 150); } else openFiche(oid); return; }
      if (t.getAttribute('data-act') === 'fs') { if (isFs()) exitFs(); else enterFs(); return; }
      if (t.hasAttribute('data-f')) { ui.filtre = t.getAttribute('data-f'); ui.sel = null; render(); return; }
      if (t.hasAttribute('data-vue')) { var nv = t.getAttribute('data-vue'); if (nv !== ui.vue) { ui.vue = nv; writeVue(nv); render(); } return; }
      stopTour();
      if (!eng) return;
      if (t.hasAttribute('data-z')) { eng.zoomBy(+t.getAttribute('data-z')); return; }
      if (t.hasAttribute('data-p')) { select(places[+t.getAttribute('data-p')], true); return; }
      if (t.hasAttribute('data-ev')) { var f = feed[+t.getAttribute('data-ev')]; if (f) { eng.at(f.loc.lon, f.loc.lat); eng.ping(f.loc.lon, f.loc.lat, isClient(f.p) ? COL.client : COL.prospect, f.p.entreprise); } return; }
      var act = t.getAttribute('data-act');
      if (act === 'home') eng.home();
      else if (act === 'world') eng.world();
      else if (act === 'tour') { if (t.getAttribute('aria-pressed') === 'true') stopTour(); else startTour(); }
      else if (act === 'unsel') { ui.sel = null; eng.select(null); refreshSide(); Array.prototype.forEach.call(root.querySelectorAll('.bsc-place'), function (b) { b.classList.remove('on'); }); }
      else if (act === 'osm') osm();
    });
    // Recherche : Entrée, ou choix dans la liste proposée.
    root.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.matches('.bsc-search input')) { e.preventDefault(); find(e.target.value); } });
    root.addEventListener('change', function (e) { if (e.target.matches('.bsc-search input')) find(e.target.value); });
    // Toucher la planète arrête la visite guidée.
    root.addEventListener('pointerdown', function (e) { if (e.target.classList && e.target.classList.contains('bsc-canvas')) stopTour(); });
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
    '.bsc-root.bsc-is-fs{background:var(--bg);overflow:hidden;width:100vw;height:100vh;max-width:none;margin:0;padding:0}',
    '.bsc-root.bsc-fs{position:fixed;inset:0;z-index:1000;height:100dvh}',
    '.bsc-root.bsc-is-fs>:not(.bsc-layout){display:none!important}',
    '.bsc-is-fs .bsc-layout{display:block;height:100%}',
    '.bsc-is-fs .bsc-side,.bsc-is-fs .bsc-main>:not(.bsc-globe-card){display:none!important}',
    '.bsc-is-fs .bsc-main{height:100%}',
    '.bsc-is-fs .bsc-globe-card,.bsc-is-fs .bsc-globe-card.map{height:100%!important;min-height:0;margin:0;border:0;border-radius:0;box-shadow:none}',
    '.bsc-is-fs .bsc-tools{top:calc(14px + env(safe-area-inset-top));right:calc(14px + env(safe-area-inset-right))}',
    '.bsc-tools .bsc-fsbtn{margin-bottom:4px}',
    'html.bsc-noscroll,html.bsc-noscroll body{overflow:hidden}',
    'html.bsc-noscroll .topbar,html.bsc-noscroll .bottom-nav,html.bsc-noscroll .sidebar,html.bsc-noscroll .fab{visibility:hidden}',
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
    '.bsc-actions{margin:8px 0}',
    '.bsc-small{font-size:11.5px}',
    '.bsc-msg{font-size:13px;color:var(--text-2);margin:6px 0 0}',
    /* ---- v2 : en-tête, indicateurs, visite guidée, carte flottante, fiches riches */
    '.bsc-head{flex-wrap:wrap;gap:12px}',
    '.bsc-headtools{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end}',
    '.bsc-search{display:flex;align-items:center;gap:8px;height:38px;padding:0 12px;border-radius:12px;background:var(--surface);border:1px solid var(--border);color:var(--text-3);min-width:min(260px,100%)}',
    '.bsc-search:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px rgb(var(--accent-rgb)/.18)}',
    '.bsc-search input{flex:1;min-width:0;border:0;background:none;color:var(--text);font:inherit;font-size:13.5px;outline:none}',
    '.bsc-search.miss{animation:bscShake .4s}',
    '@keyframes bscShake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}',
    '.bsc-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:0 0 16px}',
    '.bsc-kpi{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:16px;background:var(--surface);border:1px solid var(--border);position:relative;overflow:hidden;animation:bscUp .7s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--i)*70ms)}',
    '.bsc-kpi::after{content:"";position:absolute;inset:auto -30% -60% auto;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgb(var(--accent-rgb)/.18),transparent 70%)}',
    '.bsc-kpi.green::after{background:radial-gradient(circle,rgb(52 211 153/.2),transparent 70%)}',
    '.bsc-kpi.amber::after{background:radial-gradient(circle,rgb(251 191 36/.2),transparent 70%)}',
    '.bsc-kic{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;flex:none;background:rgb(var(--accent-rgb)/.14);color:var(--accent)}',
    '.bsc-kpi.green .bsc-kic{background:rgb(52 211 153/.14);color:#10b981}',
    '.bsc-kpi.amber .bsc-kic{background:rgb(251 191 36/.16);color:#d97706}',
    '.bsc-kpi b{display:block;font-size:21px;letter-spacing:-.02em;font-variant-numeric:tabular-nums;white-space:nowrap}',
    '.bsc-kpi span{font-size:12px;color:var(--text-3)}',
    '@keyframes bscUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}',
    '.bsc-globe-card{height:min(74vh,720px);box-shadow:0 30px 60px -30px rgb(2 6 23/.7)}',
    '.bsc-vignette{position:absolute;inset:0;pointer-events:none;background:radial-gradient(120% 90% at 50% 45%,transparent 55%,rgb(1 3 10/.75) 100%)}',
    '.bsc-topbar{position:absolute;left:16px;top:14px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;right:70px}',
    '.bsc-topbar .bsc-live{position:static}',
    '.bsc-tour{display:flex;align-items:center;gap:7px;height:31px;padding:0 13px;border-radius:99px;border:1px solid rgb(96 165 250/.45);background:rgb(3 8 18/.7);color:#dbeafe;font:700 12.5px Inter,system-ui;cursor:pointer;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:background .2s,border-color .2s}',
    '.bsc-tour:hover{background:rgb(59 130 246/.35)}',
    '.bsc-tour[aria-pressed=true]{background:rgb(59 130 246/.55);border-color:#93c5fd}',
    '.bsc-spot{position:absolute;left:16px;bottom:58px;z-index:4;width:min(290px,calc(100% - 32px));pointer-events:none}',
    '.bsc-spot-in{padding:14px 16px;border-radius:16px;background:linear-gradient(160deg,rgb(15 27 46/.92),rgb(8 16 32/.88));border:1px solid rgb(96 165 250/.35);color:#eaf1fb;box-shadow:0 20px 40px -18px #000;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}',
    '.bsc-spot.in .bsc-spot-in{animation:bscSpot .6s cubic-bezier(.16,1,.3,1) both}',
    '@keyframes bscSpot{from{opacity:0;transform:translateY(16px) scale(.96);filter:blur(4px)}to{opacity:1;transform:none;filter:none}}',
    '.bsc-spot-k{display:block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#93c5fd}',
    '.bsc-spot b{display:block;font-size:20px;letter-spacing:-.02em;margin-top:2px}',
    '.bsc-spot p{margin:4px 0 8px;font-size:12.5px;color:#a9bfdd}',
    '.bsc-spot strong{color:#6ee7b7}',
    '.bsc-spot ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px;font-size:12.5px}',
    '.bsc-spot li{display:flex;align-items:center;gap:7px}',
    '.bsc-spot li i{width:7px;height:7px;border-radius:50%;box-shadow:0 0 8px currentColor}',
    '.bsc-h3s{margin-left:auto;font-size:11px;font-weight:600;color:var(--text-3)}',
    '.bsc-place{grid-template-columns:22px minmax(0,1fr) 74px 26px;animation:bscUp .5s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--i)*40ms);transition:background .2s}',
    '.bsc-place.on{background:rgb(var(--accent-rgb)/.14);box-shadow:inset 3px 0 0 var(--accent)}',
    '.bsc-rank{font-size:11.5px;font-weight:800;color:var(--text-3);text-align:center}',
    '.bsc-pn small{display:block;font-size:11.5px;font-weight:500;color:var(--text-3)}',
    '.bsc-pbar{display:flex;gap:1px}',
    '.bsc-pbar i.c{background:linear-gradient(90deg,#10b981,#34d399)}',
    '.bsc-pbar i.p{background:linear-gradient(90deg,#3b82f6,#60a5fa)}',
    '.bsc-sel{border-color:rgb(var(--accent-rgb)/.45);animation:bscUp .5s cubic-bezier(.16,1,.3,1) both}',
    '.bsc-selk{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:0 0 10px}',
    '.bsc-selk div{padding:8px;border-radius:10px;background:var(--surface-2);text-align:center;min-width:0}',
    '.bsc-selk b{display:block;font-size:14px;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.bsc-selk span{font-size:11px;color:var(--text-3)}',
    '.bsc-people{display:flex;flex-direction:column;gap:8px;max-height:420px;overflow:auto;padding-right:2px}',
    '.bsc-person{display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px;border-radius:14px;background:var(--surface-2);border:1px solid var(--border);box-shadow:inset 3px 0 0 var(--c);animation:bscUp .45s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--i)*45ms);transition:transform .2s,border-color .2s}',
    '.bsc-person:hover{transform:translateY(-1px);border-color:rgb(var(--accent-rgb)/.4)}',
    '.bsc-person.flash{animation:bscFlash 1.6s ease}',
    '@keyframes bscFlash{0%,100%{box-shadow:inset 3px 0 0 var(--c)}30%{box-shadow:inset 3px 0 0 var(--c),0 0 0 3px rgb(var(--accent-rgb)/.5)}}',
    '.bsc-av{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-weight:800;font-size:13.5px;color:#fff;background:linear-gradient(135deg,hsl(var(--h) 70% 52%),hsl(calc(var(--h) + 40) 70% 42%))}',
    '.bsc-pm{min-width:0}',
    '.bsc-pm b{display:block;font-size:13.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.bsc-pm>span{display:block;font-size:12px;color:var(--text-3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.bsc-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px}',
    '.bsc-tags em{display:inline-flex;align-items:center;gap:3px;font-style:normal;font-size:10.5px;font-weight:700;padding:2px 7px;border-radius:99px;background:var(--surface-3);color:var(--text-2)}',
    '.bsc-tags em.bsc-stat{background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c)}',
    '.bsc-tags em.hot{background:rgb(251 113 133/.16);color:#fb7185}',
    '.bsc-pv{display:flex;flex-direction:column;align-items:flex-end;gap:6px}',
    '.bsc-pv strong{font-size:13px;font-variant-numeric:tabular-nums;white-space:nowrap}',
    '.bsc-pv strong small{font-size:10.5px;font-weight:600;color:var(--text-3)}',
    '.bsc-pa{display:flex;gap:4px}',
    '.bsc-pa a,.bsc-pa button{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;border:1px solid var(--border);background:var(--surface);color:var(--text-2);cursor:pointer;transition:background .2s,color .2s}',
    '.bsc-pa a:hover,.bsc-pa button:hover{background:var(--accent);color:#fff;border-color:var(--accent)}',
    '@media (max-width:700px){.bsc-globe-card{height:62vh;min-height:380px}.bsc-spot{bottom:56px}.bsc-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.bsc-kpi{padding:12px}.bsc-kpi b{font-size:18px}.bsc-headtools{width:100%}.bsc-search{flex:1}}',
    '@media (prefers-reduced-motion:reduce){.bsc-kpi,.bsc-place,.bsc-person,.bsc-sel,.bsc-spot.in .bsc-spot-in{animation:none}}',
    /* ---- v3 : carte vectorielle, choix de la vue, activité sous la carte, mode clair */
    '.bsc-main{display:flex;flex-direction:column;gap:16px;min-width:0}',
    '.bsc-globe-card.map{background:#0a1630;height:min(70vh,660px)}',
    '.bsc-mode{display:flex;padding:3px;border-radius:99px;background:rgb(3 8 18/.7);border:1px solid rgb(148 163 184/.3);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}',
    '.bsc-mode button{display:flex;align-items:center;gap:6px;height:25px;padding:0 11px;border:0;border-radius:99px;background:none;color:#b7c8e2;font:700 12px Inter,system-ui;cursor:pointer;transition:background .2s,color .2s}',
    '.bsc-mode button[aria-pressed=true]{background:rgb(59 130 246/.9);color:#fff;box-shadow:0 4px 14px -4px rgb(59 130 246/.8)}',
    '.bsc-mode button:not([aria-pressed=true]):hover{color:#fff}',
    '.bsc-legend i.hub{border-radius:2px;transform:rotate(45deg)}',
    '.bsc-lg-heat b{width:30px;height:9px;border-radius:3px;background:linear-gradient(90deg,rgb(56 189 248/.12),rgb(56 189 248/.6))}',
    '.bsc-globe-card.map .bsc-hint{bottom:12px}',
    '.bsc-globe-card.map .bsc-legend{bottom:12px}',
    '.bsc-feedcard .bsc-feed{display:grid;grid-template-columns:minmax(0,1fr);gap:2px 14px}',
    '@media (min-width:900px){.bsc-feedcard .bsc-feed{grid-template-columns:repeat(2,minmax(0,1fr))}}',
    '@media (max-width:700px){.bsc-kpi:last-child:nth-child(odd){grid-column:1/-1}.bsc-globe-card.map{height:58vh;min-height:360px}.bsc-mode button span{display:none}.bsc-mode button{padding:0 9px}.bsc-tour span{display:none}.bsc-tour{padding:0 10px}.bsc-legend{gap:10px;font-size:11.5px;padding:6px 10px;right:16px;flex-wrap:wrap}.bsc-lg-heat{display:none!important}}',
    /* Mode clair : la carte et ses commandes passent en verre clair. */
    '[data-scheme=light] .bsc-globe-card.map{background:#e3ecf7;box-shadow:0 24px 50px -30px rgb(30 58 138/.35)}',
    '[data-scheme=light] .bsc-globe-card.map .bsc-live,[data-scheme=light] .bsc-globe-card.map .bsc-mode,[data-scheme=light] .bsc-globe-card.map .bsc-tour,[data-scheme=light] .bsc-globe-card.map .bsc-tools button,[data-scheme=light] .bsc-globe-card.map .bsc-legend{background:rgb(255 255 255/.82);border-color:rgb(148 163 184/.45);color:#0f172a;box-shadow:0 6px 18px -10px rgb(15 23 42/.35)}',
    '[data-scheme=light] .bsc-globe-card.map .bsc-live{color:#047857;border-color:rgb(16 185 129/.45)}',
    '[data-scheme=light] .bsc-globe-card.map .bsc-mode button{color:#475569}',
    '[data-scheme=light] .bsc-globe-card.map .bsc-mode button[aria-pressed=true]{color:#fff;background:#2563eb}',
    '[data-scheme=light] .bsc-globe-card.map .bsc-tour{color:#1d4ed8}',
    '[data-scheme=light] .bsc-globe-card.map .bsc-tools button:hover,[data-scheme=light] .bsc-globe-card.map .bsc-tour:hover{background:#dbeafe}',
    '[data-scheme=light] .bsc-globe-card.map .bsc-hint{color:#64748b}',
    '[data-scheme=light] .bsc-globe-card.map .bsc-lg-heat b{background:linear-gradient(90deg,rgb(37 99 235/.1),rgb(37 99 235/.5))}',
    '[data-scheme=light] .bsc-globe-card.map .bsc-tip{background:rgb(255 255 255/.97);border-color:rgb(148 163 184/.5);color:#0f172a;box-shadow:0 16px 34px -14px rgb(15 23 42/.4)}',
    '[data-scheme=light] .bsc-globe-card.map .bsc-tip span{color:#2563eb}',
    '[data-scheme=light] .bsc-globe-card.map .bsc-tip .more{color:#64748b}',
    '[data-scheme=light] .bsc-globe-card.map .bsc-spot-in{background:rgb(255 255 255/.95);border-color:rgb(148 163 184/.5);color:#0f172a;box-shadow:0 18px 40px -18px rgb(15 23 42/.45)}',
    '[data-scheme=light] .bsc-globe-card.map .bsc-spot p{color:#475569}',
    '[data-scheme=light] .bsc-globe-card.map .bsc-spot strong{color:#047857}',
    '[data-scheme=light] .bsc-globe-card.map .bsc-spot-k{color:#2563eb}',
  ].join('\n');
  function ensureCss() {
    if (document.getElementById('bs-carte-css')) return;
    var s = document.createElement('style'); s.id = 'bs-carte-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  window.bsCarte = { monter: monter };
})();
