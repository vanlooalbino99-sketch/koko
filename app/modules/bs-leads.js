/* Blackstart CRM : rubrique « Nouveaux leads » (menu › Prospection).
 *
 * Un générateur de vrais leads : de vraies entreprises françaises en activité, tirées de la base officielle Sirene
 * (INSEE) par l'API publique « Recherche d'entreprises » de l'État, sans clé ni abonnement.
 * - on choisit un secteur (et, si on veut, un métier précis), une zone (ville, code postal, département ou toute la
 *   France, avec un rayon autour d'une ville) et la taille des entreprises ;
 * - chaque clic sur « Générer » propose un nouveau lot, jamais proposé auparavant dans ce navigateur et absent du
 *   CRM (même SIRET, même nom + ville ou même téléphone) : les pages de résultats sont tirées au hasard et mémorisées ;
 * - téléphone, site et email ne figurent pas dans Sirene : ils sont cherchés sur OpenStreetMap autour de l'adresse,
 *   et affichés seulement s'ils y sont publiés. Sinon, l'interface le dit et propose des liens de recherche ;
 * - « Ajouter au CRM » crée un prospect « À appeler » (relance aujourd'hui, donc dans la file d'appels du jour).
 */
(function () {
  'use strict';
  if (window.bsLeads) return;

  var API = 'https://recherche-entreprises.api.gouv.fr';
  var GEO = 'https://geo.api.gouv.fr';
  var OVERPASS = 'https://overpass-api.de/api/interpreter';
  var PREFS_KEY = 'bs-leads-prefs', SEEN_KEY = 'bs-leads-vus', CUR_KEY = 'bs-leads-recherches';
  var LOT = 12, PER_PAGE = 25, MAX_PAGE = 400, CANAL = 'Générateur de leads';

  // Secteurs du CRM (mêmes noms que la fiche prospect) et métiers ciblés, par code d'activité (NAF).
  var SECTEURS = [
    { id: 'Artisans / BTP', icon: 'wrench', metiers: [
      { id: 'plombier', label: 'Plombiers & chauffagistes', naf: ['43.22A', '43.22B'] },
      { id: 'electricien', label: 'Électriciens', naf: ['43.21A'] },
      { id: 'menuisier', label: 'Menuisiers', naf: ['43.32A'] },
      { id: 'serrurier', label: 'Serruriers & métalliers', naf: ['43.32B'] },
      { id: 'macon', label: 'Maçons', naf: ['43.99C'] },
      { id: 'constructeur', label: 'Constructeurs de maisons', naf: ['41.20A'] },
      { id: 'peintre', label: 'Peintres', naf: ['43.34Z'] },
      { id: 'couvreur', label: 'Couvreurs', naf: ['43.91B'] },
      { id: 'platrier', label: 'Plâtriers & plaquistes', naf: ['43.31Z'] },
      { id: 'carreleur', label: 'Carreleurs', naf: ['43.33Z'] },
      { id: 'paysagiste', label: 'Paysagistes', naf: ['81.30Z'] },
      { id: 'garage', label: 'Garages automobiles', naf: ['45.20A'] },
    ] },
    { id: 'Immobilier', icon: 'home', metiers: [
      { id: 'agence-immo', label: 'Agences immobilières', naf: ['68.31Z'] },
      { id: 'syndic', label: 'Syndics & gestion locative', naf: ['68.32A'] },
      { id: 'diagnostiqueur', label: 'Diagnostiqueurs & contrôle technique', naf: ['71.20B'] },
    ] },
    { id: 'Santé & bien-être', icon: 'heart', metiers: [
      { id: 'dentiste', label: 'Cabinets dentaires', naf: ['86.23Z'] },
      { id: 'medecin', label: 'Médecins généralistes', naf: ['86.21Z'] },
      { id: 'specialiste', label: 'Médecins spécialistes', naf: ['86.22C'] },
      { id: 'kine', label: 'Kinés & rééducation', naf: ['86.90E'] },
      { id: 'osteo', label: 'Ostéopathes & autres soins', naf: ['86.90F'] },
      { id: 'veterinaire', label: 'Vétérinaires', naf: ['75.00Z'] },
      { id: 'coiffeur', label: 'Coiffeurs', naf: ['96.02A'] },
      { id: 'beaute', label: 'Instituts de beauté', naf: ['96.02B'] },
      { id: 'sport', label: 'Salles de sport', naf: ['93.13Z'] },
      { id: 'pharmacie', label: 'Pharmacies', naf: ['47.73Z'] },
    ] },
    { id: 'Commerce / e-commerce', icon: 'shoppingBag', metiers: [
      { id: 'restaurant', label: 'Restaurants', naf: ['56.10A'] },
      { id: 'rapide', label: 'Restauration rapide', naf: ['56.10C'] },
      { id: 'boulangerie', label: 'Boulangeries', naf: ['10.71C'] },
      { id: 'hotel', label: 'Hôtels', naf: ['55.10Z'] },
      { id: 'fleuriste', label: 'Fleuristes', naf: ['47.76Z'] },
      { id: 'opticien', label: 'Opticiens', naf: ['47.78A'] },
      { id: 'vetements', label: 'Boutiques de vêtements', naf: ['47.71Z'] },
      { id: 'vad', label: 'Vente à distance (e-commerce)', naf: ['47.91B'] },
    ] },
    { id: 'Services B2B', icon: 'briefcase', metiers: [
      { id: 'comptable', label: 'Experts-comptables', naf: ['69.20Z'] },
      { id: 'avocat', label: 'Avocats & juristes', naf: ['69.10Z'] },
      { id: 'conseil', label: 'Conseil en gestion', naf: ['70.22Z'] },
      { id: 'assurance', label: 'Agents & courtiers en assurance', naf: ['66.22Z'] },
      { id: 'nettoyage', label: 'Entreprises de nettoyage', naf: ['81.21Z'] },
      { id: 'pub', label: 'Agences de communication', naf: ['73.11Z'] },
      { id: 'auto-ecole', label: 'Auto-écoles', naf: ['85.53Z'] },
      { id: 'informatique', label: 'Services informatiques', naf: ['62.02A'] },
    ] },
  ];
  var TAILLES = [
    { id: 'toutes', label: 'Toutes tailles', codes: '' },
    { id: 'salaries', label: 'Avec salariés', codes: '01,02,03,11,12,21,22,31,32,41,42,51,52,53' },
    { id: 'pme', label: '10 salariés et plus', codes: '11,12,21,22,31,32,41,42,51,52,53' },
  ];
  var RAYONS = [['0', 'Commune seule'], ['10', '+ 10 km'], ['25', '+ 25 km'], ['50', '+ 50 km']];
  var EFFECTIFS = { NN: '', '00': '0 salarié', '01': '1 ou 2 salariés', '02': '3 à 5 salariés', '03': '6 à 9 salariés', '11': '10 à 19 salariés', '12': '20 à 49 salariés', '21': '50 à 99 salariés', '22': '100 à 199 salariés', '31': '200 à 249 salariés', '32': '250 à 499 salariés', '41': '500 à 999 salariés', '42': '1 000 à 1 999 salariés', '51': '2 000 à 4 999 salariés', '52': '5 000 à 9 999 salariés', '53': '10 000 salariés et plus' };
  var NAF_LABEL = {};
  SECTEURS.forEach(function (s) { s.metiers.forEach(function (m) { m.naf.forEach(function (c) { NAF_LABEL[c] = m.label; }); }); });

  // ------------------------------------------------------------------ outils
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ic(name, size) {
    var p = window.bsIcones && window.bsIcones.svg ? window.bsIcones.svg(name) : '';
    return '<svg width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (p || '<circle cx="12" cy="12" r="8"/>') + '</svg>';
  }
  function readJson(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : d; } catch (e) { return d; } }
  function writeJson(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
  function digits(s) { return String(s || '').replace(/\D/g, ''); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function nowTime() { var d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
  function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function plural(n, one, many) { return n + ' ' + (n > 1 ? (many || one + 's') : one); }
  var SIGLES = /^(sarl|sas|sasu|eurl|sa|sci|snc|selarl|selas|scp|scm|eirl|ei|earl|gaec|sccv|scea|sel|asso|ste|cie|sc|sarlu)$/i;
  var PETITS = /^(de|du|des|la|le|les|et|en|au|aux|sur|sous|a|l|d)$/i;
  // « PLOMBERIE DU RHONE SARL » → « Plomberie du Rhone SARL » (les sigles restent en majuscules).
  function joli(s) {
    var t = String(s || '').trim();
    if (!t || t !== t.toUpperCase()) return t;
    return t.toLowerCase().replace(/[\p{L}\p{N}]+/gu, function (w, i) {
      if (SIGLES.test(w)) return w.toUpperCase();
      if (i > 0 && PETITS.test(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    });
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function getJson(url, opts, timeout) {
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var t = setTimeout(function () { if (ctl) ctl.abort(); }, timeout || 15000);
    return fetch(url, Object.assign({ signal: ctl ? ctl.signal : undefined, headers: { Accept: 'application/json' } }, opts || {}))
      .then(function (r) {
        if (r.status === 429) throw new Error('Trop de demandes envoyées à la base officielle : patientez quelques secondes et réessayez.');
        if (!r.ok) { var e = new Error('Erreur de la base officielle (' + r.status + ')'); e.status = r.status; throw e; }
        return r.json();
      })
      .finally(function () { clearTimeout(t); });
  }

  // ------------------------------------------------------------------ préférences, mémoire des leads déjà proposés
  function defaultPrefs() {
    var st = window.__bsStore ? window.__bsStore.get() : {};
    var ci = (st && st.companyInfo) || {};
    return { secteur: SECTEURS[0].id, metier: '', zone: ci.ville || '', rayon: '0', taille: 'toutes' };
  }
  function readPrefs() { var p = readJson(PREFS_KEY, null); return Object.assign(defaultPrefs(), p || {}); }
  function secteurOf(id) { return SECTEURS.filter(function (s) { return s.id === id; })[0] || SECTEURS[0]; }
  function metierOf(sect, id) { return sect.metiers.filter(function (m) { return m.id === id; })[0] || null; }
  function nafOf(prefs) {
    var s = secteurOf(prefs.secteur), m = metierOf(s, prefs.metier);
    return m ? m.naf : s.metiers.reduce(function (a, x) { return a.concat(x.naf); }, []);
  }
  function searchKey(prefs) { return [prefs.secteur, prefs.metier || '*', norm(prefs.zone) || 'france', prefs.zone ? prefs.rayon : '0', prefs.taille].join('|'); }

  // Leads déjà proposés : { siren: 'AAAA-MM-JJ' }, gardés dans ce navigateur (les 20 000 plus récents).
  var seen = readJson(SEEN_KEY, {});
  function saveSeen() {
    var ks = Object.keys(seen);
    if (ks.length > 20000) { ks.sort(function (a, b) { return seen[a] < seen[b] ? -1 : 1; }).slice(0, ks.length - 20000).forEach(function (k) { delete seen[k]; }); }
    writeJson(SEEN_KEY, seen);
  }
  // Par recherche : nombre de pages, pages déjà lues, leads proposés, et réserve de leads lus mais pas encore montrés.
  var cursors = readJson(CUR_KEY, {});
  function saveCursors() {
    var ks = Object.keys(cursors);
    if (ks.length > 60) ks.sort(function (a, b) { return (cursors[a].at || '') < (cursors[b].at || '') ? -1 : 1; }).slice(0, ks.length - 60).forEach(function (k) { delete cursors[k]; });
    writeJson(CUR_KEY, cursors);
  }

  // ------------------------------------------------------------------ CRM : doublons et ajout
  function crmIndex() {
    var st = window.__bsStore ? window.__bsStore.get() : {};
    var ix = { siren: {}, nomVille: {}, tel: {} };
    (st.prospects || []).forEach(function (p) {
      var s = digits(p.siret);
      if (s.length >= 9) ix.siren[s.slice(0, 9)] = p.id;
      if (p.entreprise) ix.nomVille[norm(p.entreprise) + '|' + norm(p.ville)] = p.id;
      var t = digits(p.telephone).slice(-9);
      if (t.length === 9) ix.tel[t] = p.id;
    });
    return ix;
  }
  function inCrm(lead, ix) {
    ix = ix || crmIndex();
    return ix.siren[lead.siren] || ix.nomVille[norm(lead.nom) + '|' + norm(lead.ville)] || (lead.enseigne && ix.nomVille[norm(lead.enseigne) + '|' + norm(lead.ville)]) ||
      (lead.telephone && ix.tel[digits(lead.telephone).slice(-9)]) || null;
  }
  function addToCrm(lead) {
    var ix = crmIndex(), dup = inCrm(lead, ix);
    if (dup) return { id: dup, duplicate: true };
    var d = today(), ts = new Date().toISOString(), id = newId();
    var notes = [
      'Lead proposé par le générateur de leads le ' + new Date().toLocaleDateString('fr-FR') + ' (base officielle Sirene).',
      lead.nafLabel ? 'Activité : ' + lead.nafLabel + (lead.naf ? ' (NAF ' + lead.naf + ')' : '') : '',
      lead.dirigeant ? 'Dirigeant : ' + lead.dirigeant + (lead.qualite ? ' (' + lead.qualite + ')' : '') : '',
      [lead.creation ? 'Créée en ' + lead.creation : '', lead.effectif].filter(Boolean).join(' · '),
      lead.osm ? 'Coordonnées trouvées sur OpenStreetMap' + (lead.osm.nom ? ' (« ' + lead.osm.nom + ' »)' : '') + '.' : 'Téléphone et email non publiés dans les sources ouvertes : à rechercher.',
      'Fiche officielle : https://annuaire-entreprises.data.gouv.fr/entreprise/' + lead.siren,
    ].filter(Boolean).join('\n');
    var p = {
      id: id, entreprise: lead.enseigne || lead.nom, secteur: lead.secteur, contact: lead.dirigeant || '',
      telephone: lead.telephone || '', email: lead.email || '', ville: lead.ville || '', adresse: lead.adresse || '',
      siret: lead.siret || lead.siren, site: lead.site || '', canal: CANAL, statut: 'a_appeler', priorite: 'moyenne',
      tags: ['Lead généré'].concat(lead.metier ? [lead.metier] : []), notes: notes, dealValue: 0, mrrValue: 0, signedAt: null, resilieAt: null,
      prochaineRelance: d, prochaineRelanceHeure: '', createdAt: d, updatedAt: d, callLog: [],
      events: [{ id: newId(), ts: ts, date: d, time: nowTime(), type: 'create', text: 'Prospect créé par le générateur de leads (' + (lead.metier || lead.secteur) + ')' }],
    };
    window.__bsStore.set(function (s) { return { prospects: [p].concat(s.prospects || []) }; });
    return { id: id, duplicate: false };
  }

  // ------------------------------------------------------------------ base officielle (Sirene)
  var zoneCache = {};
  // Zone saisie → filtres de l'API : département, code postal, commune, ou rayon autour du centre d'une commune.
  function resolveZone(prefs) {
    var z = String(prefs.zone || '').trim(), rayon = +prefs.rayon || 0;
    var key = norm(z) + '|' + rayon;
    if (zoneCache[key]) return Promise.resolve(zoneCache[key]);
    var done = function (v) { zoneCache[key] = v; return v; };
    if (!z) return Promise.resolve(done({ label: 'toute la France', params: {} }));
    if (/^(\d{2}|2a|2b|97\d)$/i.test(z)) return Promise.resolve(done({ label: 'département ' + z.toUpperCase(), params: { departement: z.toUpperCase() } }));
    var isCp = /^\d{5}$/.test(z);
    if (isCp && !rayon) return Promise.resolve(done({ label: z, params: { code_postal: z } }));
    var url = GEO + '/communes?' + (isCp ? 'codePostal=' + z : 'nom=' + encodeURIComponent(z) + '&boost=population') + '&fields=nom,code,codesPostaux,centre,codeDepartement&limit=5';
    return getJson(url, null, 10000).then(function (list) {
      var c = Array.isArray(list) && list[0];
      if (!c) throw new Error('Zone « ' + z + ' » introuvable : essayez une ville, un code postal (69003) ou un département (69).');
      var dep = { departement: c.codeDepartement };
      if (rayon && c.centre && c.centre.coordinates) {
        return done({ label: c.nom + ' + ' + rayon + ' km', near: { lat: c.centre.coordinates[1], long: c.centre.coordinates[0], radius: rayon }, params: {}, fallback: dep });
      }
      // Paris, Lyon et Marseille : les établissements sont rattachés aux arrondissements → tous leurs codes postaux.
      if (/^(75056|69123|13055)$/.test(c.code) && c.codesPostaux && c.codesPostaux.length) return done({ label: c.nom, params: { code_postal: c.codesPostaux.join(',') } });
      return done({ label: c.nom, params: { code_commune: c.code } });
    });
  }
  function fetchPage(zone, prefs, page) {
    var q = new URLSearchParams();
    q.set('activite_principale', nafOf(prefs).join(','));
    q.set('etat_administratif', 'A');
    q.set('per_page', String(PER_PAGE));
    q.set('page', String(page));
    var t = TAILLES.filter(function (x) { return x.id === prefs.taille; })[0];
    if (t && t.codes) q.set('tranche_effectif_salarie', t.codes);
    var base = API + '/search', params = zone.params;
    if (zone.near && !zone.nearKo) { base = API + '/near_point'; q.set('lat', zone.near.lat); q.set('long', zone.near.long); q.set('radius', zone.near.radius); }
    else if (zone.near) params = zone.fallback;
    Object.keys(params || {}).forEach(function (k) { q.set(k, params[k]); });
    return getJson(base + '?' + q.toString()).catch(function (e) {
      // Recherche par rayon indisponible : on se replie sur le département de la commune.
      if (zone.near && !zone.nearKo && e.status && e.status !== 429) { zone.nearKo = true; zone.label = zone.label.replace(/ \+ \d+ km$/, '') + ' (département)'; return fetchPage(zone, prefs, page); }
      throw e;
    });
  }
  function qualite(d) { return joli(d.qualite || '').replace(/^./, function (c) { return c.toUpperCase(); }); }
  // Résultat brut de l'API → lead affichable (null si inexploitable).
  function toLead(o, prefs) {
    if (!o || !o.siren) return null;
    var etabs = (o.matching_etablissements || []).filter(function (e) { return e && e.etat_administratif !== 'F'; });
    var e = etabs[0] || o.siege || {};
    var nom = o.nom_complet || o.nom_raison_sociale || '';
    if (!nom || /non.?diffusible/i.test(nom + ' ' + (e.adresse || ''))) return null;
    var ens = (e.liste_enseignes && e.liste_enseignes[0]) || e.nom_commercial || '';
    var pers = (o.dirigeants || []).filter(function (d) { return d && (d.nom || d.prenoms) && d.type_dirigeant !== 'personne morale'; })[0];
    var ei = o.complements && o.complements.est_entrepreneur_individuel;
    var dir = pers ? joli([String(pers.prenoms || '').split(/\s+/)[0], pers.nom].filter(Boolean).join(' ').toUpperCase()) : (ei ? joli(nom.replace(/\s*\(.*\)\s*$/, '')) : '');
    var naf = e.activite_principale || o.activite_principale || '';
    var sect = secteurOf(prefs.secteur), m = metierOf(sect, prefs.metier);
    var lat = parseFloat(e.latitude), lon = parseFloat(e.longitude);
    var crea = String(e.date_creation || o.date_creation || '').slice(0, 4);
    var tr = e.tranche_effectif_salarie || o.tranche_effectif_salarie || '';
    return {
      siren: String(o.siren), siret: e.siret || '', nom: joli(nom), enseigne: ens && norm(ens) !== norm(nom) ? joli(ens) : '',
      dirigeant: dir, qualite: pers ? qualite(pers) : (ei ? 'Entrepreneur individuel' : ''),
      adresse: joli(e.adresse || ''), cp: e.code_postal || '', ville: joli(e.libelle_commune || ''),
      lat: isFinite(lat) ? lat : null, lon: isFinite(lon) ? lon : null,
      naf: naf, nafLabel: NAF_LABEL[naf] || (o.libelle_activite_principale || ''), secteur: sect.id, metier: m ? m.label : (NAF_LABEL[naf] || ''),
      creation: /^\d{4}$/.test(crea) ? +crea : null, effectif: EFFECTIFS[tr] || '', trancheCode: tr,
      etablissements: +o.nombre_etablissements_ouverts || 1, categorie: o.categorie_entreprise || '',
      telephone: '', email: '', site: '', osm: null,
    };
  }
  // Un nouveau lot : pages tirées au hasard parmi celles pas encore lues, leads déjà vus ou déjà au CRM écartés.
  function generer(prefs, onProgress) {
    var key = searchKey(prefs);
    var cur = cursors[key] || (cursors[key] = { total: 0, done: [], ids: [], reserve: [] });
    cur.at = new Date().toISOString();
    var lot = [], ix = crmIndex(), stats = { dejaCrm: 0, total: cur.totalResults || 0 }, zone;
    function prendre(lead) {
      if (!lead || seen[lead.siren] || lot.some(function (l) { return l.siren === lead.siren; })) return false;
      if (inCrm(lead, ix)) { stats.dejaCrm++; seen[lead.siren] = today(); return false; }
      lot.push(lead); return true;
    }
    var reste = [];
    (cur.reserve || []).forEach(function (l) { if (lot.length < LOT) prendre(l); else if (!seen[l.siren]) reste.push(l); });
    cur.reserve = reste;
    function choosePage() {
      if (!cur.total) return cur.done.indexOf(1) < 0 ? 1 : 0;
      var max = Math.min(cur.total, MAX_PAGE);
      if (cur.done.length >= max) return 0;
      for (var i = 0; i < 40; i++) { var p = 1 + Math.floor(Math.random() * max); if (cur.done.indexOf(p) < 0) return p; }
      for (var j = 1; j <= max; j++) if (cur.done.indexOf(j) < 0) return j;
      return 0;
    }
    var tries = 0;
    function step() {
      if (lot.length >= LOT || tries >= 8) return Promise.resolve();
      var page = choosePage();
      if (!page) { stats.epuise = true; return Promise.resolve(); }
      tries++;
      if (onProgress) onProgress(tries);
      return fetchPage(zone, prefs, page).then(function (data) {
        cur.total = Math.max(0, Math.min(MAX_PAGE, +data.total_pages || 0));
        cur.totalResults = stats.total = +data.total_results || 0;
        cur.done.push(page);
        var res = Array.isArray(data.results) ? data.results : [];
        res.forEach(function (o) {
          var lead = toLead(o, prefs);
          if (!lead) return;
          if (lot.length < LOT) prendre(lead);
          else if (!seen[lead.siren] && cur.reserve.length < 60 && !cur.reserve.some(function (l) { return l.siren === lead.siren; })) cur.reserve.push(lead);
        });
        if (!res.length && page === 1) { stats.epuise = true; return; }
        return sleep(160).then(step);
      });
    }
    return resolveZone(prefs).then(function (z) { zone = z; stats.zone = z.label; return step(); }).then(function () {
      lot.forEach(function (l) { seen[l.siren] = today(); cur.ids.push(l.siren); });
      if (cur.ids.length > 3000) cur.ids = cur.ids.slice(-3000);
      stats.proposes = cur.ids.length;
      saveSeen(); saveCursors();
      return { leads: lot, stats: stats };
    });
  }
  // Recommencer une recherche épuisée : ses leads déjà proposés (et pas ajoutés) peuvent revenir.
  function reinitialiser(prefs) {
    var key = searchKey(prefs), cur = cursors[key];
    if (!cur) return;
    (cur.ids || []).forEach(function (s) { delete seen[s]; });
    delete cursors[key];
    saveSeen(); saveCursors();
  }

  // ------------------------------------------------------------------ OpenStreetMap : téléphone, site, email
  var STOP = /^(sarl|sas|sasu|eurl|sa|sci|snc|selarl|selas|scp|scm|eirl|ei|ets|etablissements|societe|ste|cabinet|entreprise|groupe|et|de|du|des|la|le|les|l|d|a|au|aux|en|chez|the)$/;
  function tokens(s) { return norm(s).split(' ').filter(function (w) { return w.length > 1 && !STOP.test(w); }); }
  function sameName(a, b) {
    var ta = tokens(a), tb = tokens(b);
    if (!ta.length || !tb.length) return 0;
    var na = ta.join(' '), nb = tb.join(' ');
    if (na === nb) return 1;
    if ((na.length >= 5 && nb.indexOf(na) >= 0) || (nb.length >= 5 && na.indexOf(nb) >= 0)) return 0.9;
    var inter = ta.filter(function (w) { return tb.indexOf(w) >= 0; }).length;
    return inter / Math.min(ta.length, tb.length) * (inter >= 2 || Math.min(ta.length, tb.length) === 1 ? 1 : 0.6);
  }
  function cleanUrl(u) { u = String(u || '').trim(); if (!u) return ''; if (!/^https?:\/\//i.test(u)) u = 'https://' + u; return /^https?:\/\/[^\s"'<>]+$/i.test(u) ? u : ''; }
  function enrichir(leads) {
    var pts = leads.filter(function (l) { return l.lat != null && !l.osmDone; });
    if (!pts.length) return Promise.resolve(false);
    var q = '[out:json][timeout:20];(' + pts.map(function (l) {
      return 'nwr(around:150,' + l.lat.toFixed(6) + ',' + l.lon.toFixed(6) + ')["name"][~"^(phone|contact:phone|website|contact:website|email|contact:email)$"~"."];';
    }).join('') + ');out tags center;';
    return getJson(OVERPASS, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' }, body: 'data=' + encodeURIComponent(q) }, 25000).then(function (data) {
      var els = (data && data.elements) || [];
      pts.forEach(function (l) {
        l.osmDone = true;
        var best = null, bestScore = 0;
        els.forEach(function (el) {
          var t = el.tags || {}, c = el.center || el;
          if (c.lat != null && Math.abs(c.lat - l.lat) > 0.003) return;
          var s = Math.max(sameName(t.name, l.nom), l.enseigne ? sameName(t.name, l.enseigne) : 0, t.brand ? sameName(t.brand, l.enseigne || l.nom) : 0);
          if (s > bestScore) { bestScore = s; best = t; }
        });
        if (!best || bestScore < 0.75) return;
        l.osm = { nom: best.name };
        l.telephone = String(best.phone || best['contact:phone'] || best['contact:mobile'] || '').split(';')[0].trim();
        l.site = cleanUrl(best.website || best['contact:website']);
        l.email = String(best.email || best['contact:email'] || '').split(';')[0].trim();
      });
      return true;
    }).catch(function () { pts.forEach(function (l) { l.osmDone = true; l.osmKo = true; }); return true; });
  }

  // ------------------------------------------------------------------ page
  var state = { leads: [], stats: null, prefs: null, statut: {}, busy: false, err: '', osmBusy: false };

  function monter(root) {
    if (!root || root.getAttribute('data-bsl')) return;
    root.setAttribute('data-bsl', '1');
    ensureCss();
    if (!state.prefs) state.prefs = readPrefs();
    var prefs = state.prefs;

    function savePrefs() { writeJson(PREFS_KEY, prefs); }
    function metierOptions() {
      var s = secteurOf(prefs.secteur);
      return '<option value="">Tous les métiers du secteur</option>' + s.metiers.map(function (m) { return '<option value="' + m.id + '"' + (prefs.metier === m.id ? ' selected' : '') + '>' + esc(m.label) + '</option>'; }).join('');
    }
    function signaux(l) {
      var out = [], an = new Date().getFullYear();
      if (l.creation && an - l.creation <= 1) out.push(['green', 'Nouvelle entreprise']);
      if (l.trancheCode && /^(1|2|3|4|5)/.test(l.trancheCode)) out.push(['blue', '10 salariés et plus']);
      if (l.etablissements > 1) out.push(['violet', plural(l.etablissements, 'établissement')]);
      return out;
    }
    function leadCard(l, i) {
      var st = state.statut[l.siren] || (inCrm(l) ? 'deja' : '');
      var titre = l.enseigne || l.nom, q = encodeURIComponent((l.enseigne || l.nom) + ' ' + l.ville);
      var contact;
      if (l.telephone || l.site || l.email) {
        contact = '<div class="bsl-contact">' +
          (l.telephone ? '<a href="tel:' + esc(digits(l.telephone).replace(/^33/, '+33')) + '">' + ic('phone', 14) + esc(l.telephone) + '</a>' : '') +
          (l.site ? '<a href="' + esc(l.site) + '" target="_blank" rel="noopener noreferrer">' + ic('globe', 14) + esc(l.site.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '')) + '</a>' : '') +
          (l.email ? '<a href="mailto:' + esc(l.email) + '">' + ic('mail', 14) + esc(l.email) + '</a>' : '') +
          '<span class="bsl-src">Source : OpenStreetMap</span></div>';
      } else if (l.lat != null && !l.osmDone) {
        contact = '<div class="bsl-contact bsl-wait"><span class="bsl-spin"></span>Recherche du téléphone et du site sur OpenStreetMap…</div>';
      } else {
        contact = '<div class="bsl-contact bsl-none">' + ic('info', 14) + '<span>' + (l.osmKo ? 'OpenStreetMap ne répond pas : téléphone et site à chercher.' : 'Téléphone, site et email non publiés dans les sources ouvertes.') + '</span></div>';
      }
      return '<article class="card bsl-card' + (st === 'ajoute' ? ' added' : '') + (st === 'ecarte' ? ' gone' : '') + '" data-i="' + i + '" style="--i:' + i + '">' +
        '<div class="bsl-top"><span class="bsl-av" style="--h:' + hue(titre) + '">' + esc(initials(titre)) + '</span><div class="bsl-tt"><h3>' + esc(titre) + '</h3>' +
        '<p>' + esc(l.enseigne ? l.nom + ' · ' : '') + esc(l.metier || l.nafLabel || l.naf) + '</p></div></div>' +
        (signaux(l).length ? '<div class="bsl-sig">' + signaux(l).map(function (s) { return '<span class="bsl-chip ' + s[0] + '">' + esc(s[1]) + '</span>'; }).join('') + '</div>' : '') +
        '<ul class="bsl-facts">' +
        '<li>' + ic('map-pin', 14) + '<span>' + esc(l.adresse || [l.cp, l.ville].join(' ')) + '</span></li>' +
        (l.dirigeant ? '<li>' + ic('user', 14) + '<span>' + esc(l.dirigeant) + (l.qualite ? ' <em>· ' + esc(l.qualite) + '</em>' : '') + '</span></li>' : '<li class="muted">' + ic('user', 14) + '<span>Dirigeant non publié</span></li>') +
        '<li>' + ic('calendar', 14) + '<span>' + (l.creation ? 'Créée en ' + l.creation : 'Date de création inconnue') + (l.effectif ? ' · ' + esc(l.effectif) : '') + '</span></li>' +
        '</ul>' + contact +
        '<div class="bsl-links">' +
        (l.telephone ? '' : '<a href="https://www.google.com/search?q=' + q + '+t%C3%A9l%C3%A9phone" target="_blank" rel="noopener noreferrer">Chercher le numéro</a>') +
        '<a href="https://www.pagesjaunes.fr/annuaire/chercherlespros?quoiqui=' + encodeURIComponent(l.enseigne || l.nom) + '&ou=' + encodeURIComponent(l.ville) + '" target="_blank" rel="noopener noreferrer">PagesJaunes</a>' +
        '<a href="https://annuaire-entreprises.data.gouv.fr/entreprise/' + esc(l.siren) + '" target="_blank" rel="noopener noreferrer">Fiche officielle</a></div>' +
        '<div class="bsl-act">' +
        (st === 'ajoute' ? '<span class="bsl-ok">' + ic('check', 15) + 'Ajouté au CRM</span><button type="button" class="btn btn-ghost btn-sm" data-open="' + i + '">Ouvrir la fiche</button>'
          : st === 'deja' ? '<span class="bsl-ok muted">' + ic('check', 15) + 'Déjà dans votre CRM</span><button type="button" class="btn btn-ghost btn-sm" data-open="' + i + '">Ouvrir la fiche</button>'
          : st === 'ecarte' ? '<span class="bsl-ok muted">Écarté</span><button type="button" class="btn btn-ghost btn-sm" data-undo="' + i + '">Annuler</button>'
          : '<button type="button" class="btn btn-primary btn-sm" data-add="' + i + '">' + ic('plus', 15) + 'Ajouter au CRM</button><button type="button" class="btn btn-ghost btn-sm" data-skip="' + i + '">Écarter</button>') +
        '</div></article>';
    }
    function initials(s) { return String(s || '?').replace(/[^\p{L}\p{N} ]/gu, ' ').trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase() || '?'; }
    function hue(s) { var h = 0; String(s || '').split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) % 360; }); return h; }
    function restants() { return state.leads.filter(function (l) { return !state.statut[l.siren] && !inCrm(l); }); }

    function render() {
      var s = secteurOf(prefs.secteur), st = state.stats, rest = restants();
      var html =
        '<div class="page-head"><div class="page-head-text"><h1 class="page-title">Nouveaux leads</h1>' +
        '<p class="page-sub">De vraies entreprises en activité, tirées de la base officielle Sirene. Chaque lot est nouveau : jamais deux fois le même lead.</p></div></div>' +
        '<section class="card bsl-form" aria-label="Critères">' +
        '<div class="bsl-secteurs" role="tablist" aria-label="Secteur">' + SECTEURS.map(function (x) {
          return '<button type="button" role="tab" aria-selected="' + (x.id === s.id) + '" class="bsl-sect' + (x.id === s.id ? ' on' : '') + '" data-sect="' + esc(x.id) + '">' + esc(x.id) + '</button>';
        }).join('') + '</div>' +
        '<div class="bsl-grid">' +
        '<label class="field"><span class="field-label">Métier</span><span class="select-wrap"><select class="input select" name="metier">' + metierOptions() + '</select><span class="select-caret">' + ic('chevron-down', 16) + '</span></span></label>' +
        '<label class="field bsl-zone"><span class="field-label">Zone</span><input class="input" name="zone" type="search" autocomplete="off" placeholder="Ville, code postal ou département (vide : toute la France)" value="' + esc(prefs.zone) + '"></label>' +
        '<label class="field"><span class="field-label">Rayon</span><span class="select-wrap"><select class="input select" name="rayon"' + (prefs.zone && !/^(\d{2}|2a|2b|97\d)$/i.test(prefs.zone.trim()) ? '' : ' disabled') + '>' + RAYONS.map(function (r) { return '<option value="' + r[0] + '"' + (prefs.rayon === r[0] ? ' selected' : '') + '>' + r[1] + '</option>'; }).join('') + '</select><span class="select-caret">' + ic('chevron-down', 16) + '</span></span></label>' +
        '<label class="field"><span class="field-label">Taille</span><span class="select-wrap"><select class="input select" name="taille">' + TAILLES.map(function (t) { return '<option value="' + t.id + '"' + (prefs.taille === t.id ? ' selected' : '') + '>' + t.label + '</option>'; }).join('') + '</select><span class="select-caret">' + ic('chevron-down', 16) + '</span></span></label>' +
        '</div><div class="bsl-go"><button type="button" class="btn btn-primary bsl-gen" data-act="gen"' + (state.busy ? ' disabled' : '') + '>' + (state.busy ? '<span class="bsl-spin"></span>Recherche de nouveaux leads…' : ic('sparkles', 16) + (state.leads.length ? 'Générer d’autres leads' : 'Générer des leads')) + '</button>' +
        (st ? '<span class="bsl-meta">' + esc(st.total ? st.total.toLocaleString('fr-FR') + ' entreprises trouvées · ' : '') + esc(st.zone || '') + ' · ' + plural(st.proposes || 0, 'lead proposé', 'leads proposés') + ' pour cette recherche' + (st.dejaCrm ? ' · ' + plural(st.dejaCrm, 'déjà au CRM ignoré', 'déjà au CRM ignorés') : '') + '</span>' : '') +
        '</div></section>' +
        (state.err ? '<div class="bsl-msg bad" role="alert">' + ic('triangle-alert', 16) + '<span>' + esc(state.err) + '</span></div>' : '') +
        (st && st.epuise && !state.busy ? '<div class="bsl-msg">' + ic('info', 16) + '<span>' + (state.leads.length ? 'Ce sont les derniers leads de cette recherche.' : 'Tous les leads de cette recherche vous ont déjà été proposés.') + ' Changez de métier, élargissez la zone, ou revoyez ceux que vous n’avez pas ajoutés.</span><button type="button" class="btn btn-secondary btn-sm" data-act="reset">Revoir les leads déjà proposés</button></div>' : '') +
        (state.busy && !state.leads.length ? '<div class="bsl-list">' + [0, 1, 2, 3, 4, 5].map(function (i) { return '<div class="card bsl-card bsl-skel" style="--i:' + i + '"><i></i><i></i><i></i><i></i></div>'; }).join('') + '</div>' : '') +
        (state.leads.length ? '<div class="bsl-bar"><h2>' + plural(state.leads.length, 'nouveau lead', 'nouveaux leads') + (state.osmBusy ? '<small><span class="bsl-spin"></span>coordonnées en cours…</small>' : '') + '</h2>' +
          (rest.length > 1 ? '<button type="button" class="btn btn-secondary btn-sm" data-act="all">' + ic('plus', 15) + 'Tout ajouter (' + rest.length + ')</button>' : '') + '</div>' +
          '<div class="bsl-list' + (state.busy ? ' busy' : '') + '">' + state.leads.map(leadCard).join('') + '</div>' +
          '<div class="bsl-more"><button type="button" class="btn btn-primary" data-act="gen"' + (state.busy ? ' disabled' : '') + '>' + ic('repeat', 16) + 'Proposer d’autres leads</button></div>' : '') +
        (!st && !state.busy && !state.leads.length && !state.err ? '<div class="card bsl-empty">' + ic('sparkles', 28) + '<h2>Choisissez un secteur et une zone</h2><p>Puis cliquez sur « Générer des leads ». Chaque lot contient ' + LOT + ' entreprises que vous n’avez encore jamais vues.</p></div>' : '') +
        '<p class="bsl-note">' + ic('shield-check', 14) + '<span>Sources : base Sirene de l’INSEE (API Recherche d’entreprises de l’État) pour l’identité, l’adresse et le dirigeant ; OpenStreetMap pour le téléphone, le site et l’email, quand ils y sont publiés. Les emails sont rarement publics. Prospection B2B : votre offre doit concerner leur activité, et chaque contact doit pouvoir refuser d’être recontacté (RGPD).</span></p>';
      root.innerHTML = html;
    }

    function lancer() {
      if (state.busy) return;
      state.busy = true; state.err = '';
      render();
      generer(prefs).then(function (r) {
        state.leads = r.leads; state.stats = r.stats; state.statut = {}; state.busy = false;
        if (!r.leads.length && !r.stats.epuise) state.err = 'Aucun nouveau lead trouvé pour l’instant. Essayez une zone plus large ou un autre métier.';
        if (root.isConnected) { render(); var bar = root.querySelector('.bsl-bar'); if (bar && bar.scrollIntoView && window.scrollY > bar.offsetTop) bar.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
        state.osmBusy = r.leads.some(function (l) { return l.lat != null; });
        if (state.osmBusy) enrichir(r.leads).then(function () { state.osmBusy = false; if (root.isConnected) render(); });
      }).catch(function (e) {
        state.busy = false;
        state.err = e && e.name === 'AbortError' ? 'La base officielle ne répond pas : réessayez dans un instant.'
          : e && /fetch|network/i.test(e.message || '') ? 'Pas de connexion à la base officielle (internet indisponible ?). Réessayez.' : (e && e.message) || 'Erreur inconnue.';
        if (root.isConnected) render();
      });
    }
    function openFiche(id) { if (window.__bsY && id) window.__bsY.set(function (s) { return { overlays: (s.overlays || []).concat([{ key: 'bsl' + Date.now(), type: 'prospect', id: id }]) }; }); }

    root.addEventListener('click', function (ev) {
      var b = ev.target.closest('button');
      if (!b || !root.contains(b)) return;
      var i;
      if (b.hasAttribute('data-sect')) { prefs.secteur = b.getAttribute('data-sect'); prefs.metier = ''; savePrefs(); state.stats = null; render(); return; }
      if ((i = b.getAttribute('data-add')) != null) { var l = state.leads[+i], r = addToCrm(l); l.crmId = r.id; state.statut[l.siren] = 'ajoute'; render(); return; }
      if ((i = b.getAttribute('data-skip')) != null) { state.statut[state.leads[+i].siren] = 'ecarte'; render(); return; }
      if ((i = b.getAttribute('data-undo')) != null) { delete state.statut[state.leads[+i].siren]; render(); return; }
      if ((i = b.getAttribute('data-open')) != null) { var x = state.leads[+i]; openFiche(x.crmId || inCrm(x)); return; }
      var act = b.getAttribute('data-act');
      if (act === 'gen') lancer();
      else if (act === 'all') { restants().forEach(function (x) { var r2 = addToCrm(x); x.crmId = r2.id; state.statut[x.siren] = 'ajoute'; }); render(); }
      else if (act === 'reset') { reinitialiser(prefs); state.stats = null; lancer(); }
    });
    root.addEventListener('change', function (ev) {
      var t = ev.target, n = t && t.name;
      if (n === 'metier' || n === 'rayon' || n === 'taille') { prefs[n] = t.value; savePrefs(); state.stats = null; render(); }
      if (n === 'zone') { prefs.zone = t.value.trim(); savePrefs(); state.stats = null; render(); }
    });
    root.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' && ev.target && ev.target.name === 'zone') { prefs.zone = ev.target.value.trim(); savePrefs(); lancer(); }
    });
    render();
    // À chaque visite : un lot tout neuf si aucun n'est en cours d'examen.
    if (!state.leads.length && !state.busy && readJson(PREFS_KEY, null)) lancer();
  }

  // ------------------------------------------------------------------ styles
  var CSS = [
    '.bsl-root{display:flex;flex-direction:column;gap:16px;min-width:0}',
    '.bsl-root .page-head{margin-bottom:0}',
    '.bsl-form{padding:16px;display:flex;flex-direction:column;gap:14px}',
    '.bsl-secteurs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:0 -2px;padding:2px}',
    '.bsl-secteurs::-webkit-scrollbar{display:none}',
    '.bsl-sect{flex:none;height:34px;padding:0 14px;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--text-2);font-weight:600;font-size:.86em;white-space:nowrap;transition:background-color .15s,color .15s,border-color .15s}',
    '.bsl-sect:hover{color:var(--text);border-color:rgb(var(--text-rgb)/.28)}',
    '.bsl-sect.on{background:var(--accent);border-color:var(--accent);color:#fff}',
    '.bsl-grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1.6fr) minmax(0,.8fr) minmax(0,.9fr);gap:12px}',
    '.bsl-grid select:disabled{opacity:.55;cursor:not-allowed}',
    '.bsl-go{display:flex;align-items:center;gap:14px;flex-wrap:wrap}',
    '.bsl-gen{height:42px;padding:0 18px}',
    '.bsl-meta{font-size:.82em;color:var(--text-3)}',
    '.bsl-msg{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 14px;border-radius:var(--radius-sm,10px);border:1px solid var(--border);background:var(--surface-2);color:var(--text-2);font-size:.9em}',
    '.bsl-msg>span{flex:1;min-width:200px}',
    '.bsl-msg.bad{border-color:rgb(244 63 94/.35);background:rgb(244 63 94/.08);color:var(--text)}',
    '.bsl-msg.bad svg{color:#f43f5e}',
    '.bsl-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}',
    '.bsl-bar h2{font-size:1.05em;font-weight:700;margin:0;display:flex;align-items:center;gap:10px}',
    '.bsl-bar h2 small{font-size:.78em;font-weight:500;color:var(--text-3);display:inline-flex;align-items:center;gap:6px}',
    '.bsl-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;transition:opacity .2s}',
    '.bsl-list.busy{opacity:.5;pointer-events:none}',
    '.bsl-card{padding:16px;display:flex;flex-direction:column;gap:12px;min-width:0;animation:bslIn .4s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0)*35ms);transition:opacity .2s,border-color .2s}',
    '@keyframes bslIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
    '@media (prefers-reduced-motion:reduce){.bsl-card{animation:none}}',
    '.bsl-card.added{border-color:rgb(16 185 129/.55)}',
    '.bsl-card.gone{opacity:.45}',
    '.bsl-top{display:flex;gap:12px;align-items:flex-start;min-width:0}',
    '.bsl-av{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-weight:800;font-size:.85em;color:#fff;background:linear-gradient(135deg,hsl(var(--h) 70% 52%),hsl(calc(var(--h) + 40) 70% 42%))}',
    '.bsl-tt{min-width:0}',
    '.bsl-tt h3{margin:0;font-size:1em;font-weight:700;line-height:1.3;overflow-wrap:anywhere}',
    '.bsl-tt p{margin:2px 0 0;font-size:.82em;color:var(--text-3);overflow-wrap:anywhere}',
    '.bsl-sig{display:flex;flex-wrap:wrap;gap:6px}',
    '.bsl-chip{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:999px;font-size:.74em;font-weight:600}',
    '.bsl-chip.green{background:rgb(16 185 129/.13);color:#059669}',
    '.bsl-chip.blue{background:rgb(59 130 246/.13);color:#2563eb}',
    '.bsl-chip.violet{background:rgb(139 92 246/.13);color:#7c3aed}',
    '[data-scheme=dark] .bsl-chip.green{color:#34d399}[data-scheme=dark] .bsl-chip.blue{color:#93c5fd}[data-scheme=dark] .bsl-chip.violet{color:#c4b5fd}',
    '.bsl-facts{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:7px;font-size:.87em;color:var(--text-2)}',
    '.bsl-facts li{display:flex;gap:8px;align-items:flex-start;min-width:0}',
    '.bsl-facts li svg{flex:none;margin-top:2px;color:var(--text-3)}',
    '.bsl-facts li span{min-width:0;overflow-wrap:anywhere}',
    '.bsl-facts em{font-style:normal;color:var(--text-3)}',
    '.bsl-facts li.muted{color:var(--text-3)}',
    '.bsl-contact{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);font-size:.86em}',
    '.bsl-contact a{display:flex;align-items:center;gap:8px;color:var(--accent-text,var(--accent));font-weight:600;text-decoration:none;min-width:0;overflow-wrap:anywhere}',
    '.bsl-contact a:hover{text-decoration:underline}',
    '.bsl-contact a svg{flex:none}',
    '.bsl-src{font-size:.85em;color:var(--text-3)}',
    '.bsl-none,.bsl-wait{flex-direction:row;align-items:flex-start;gap:8px;color:var(--text-3)}',
    '.bsl-none svg{flex:none;margin-top:2px}',
    '.bsl-links{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:.8em}',
    '.bsl-links a{color:var(--text-2);text-decoration:underline;text-decoration-color:rgb(var(--text-rgb)/.25);text-underline-offset:3px}',
    '.bsl-links a:hover{color:var(--text)}',
    '.bsl-act{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:auto;padding-top:4px}',
    '.bsl-ok{display:inline-flex;align-items:center;gap:6px;font-weight:600;font-size:.88em;color:#059669;margin-right:auto}',
    '[data-scheme=dark] .bsl-ok{color:#34d399}',
    '.bsl-ok.muted{color:var(--text-3)}',
    '.bsl-more{display:flex;justify-content:center;padding:4px 0 8px}',
    '.bsl-empty{padding:40px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;color:var(--text-3)}',
    '.bsl-empty h2{margin:6px 0 0;font-size:1.05em;color:var(--text)}',
    '.bsl-empty p{margin:0;max-width:440px;font-size:.9em}',
    '.bsl-note{display:flex;gap:8px;align-items:flex-start;margin:0;font-size:.78em;line-height:1.5;color:var(--text-3)}',
    '.bsl-note svg{flex:none;margin-top:2px}',
    '.bsl-spin{display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:bslSpin .7s linear infinite;flex:none}',
    '@keyframes bslSpin{to{transform:rotate(360deg)}}',
    '.bsl-skel{min-height:230px;gap:14px}',
    '.bsl-skel i{display:block;height:14px;border-radius:6px;background:linear-gradient(90deg,var(--surface-2),var(--surface-3),var(--surface-2));background-size:200% 100%;animation:bslSh 1.2s linear infinite}',
    '.bsl-skel i:nth-child(1){width:60%;height:18px}.bsl-skel i:nth-child(2){width:85%}.bsl-skel i:nth-child(3){width:70%}.bsl-skel i:nth-child(4){width:100%;height:56px;margin-top:auto}',
    '@keyframes bslSh{to{background-position:-200% 0}}',
    '@media (max-width:900px){.bsl-grid{grid-template-columns:1fr 1fr}.bsl-zone{grid-column:1/-1;order:-1}}',
    '@media (max-width:560px){.bsl-grid{grid-template-columns:1fr}.bsl-form{padding:14px}.bsl-gen{width:100%;justify-content:center}.bsl-list{grid-template-columns:1fr}.bsl-act .btn{flex:1;justify-content:center}}',
  ].join('\n');
  function ensureCss() {
    if (document.getElementById('bs-leads-css')) return;
    var s = document.createElement('style'); s.id = 'bs-leads-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  window.bsLeads = { monter: monter, _interne: { toLead: toLead, sameName: sameName, joli: joli, searchKey: searchKey } };
})();
