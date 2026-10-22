/* Blackstart CRM : rubrique « Marché » (menu › Analyse).
 *
 * Où chercher vos prochains clients, avec les chiffres officiels et ceux du CRM :
 * - Potentiel : pour chaque métier du générateur de leads, le nombre d'entreprises en activité dans la zone (base
 *   Sirene, API publique « Recherche d'entreprises »), celles déjà dans le CRM, votre taux de signature et la valeur
 *   d'un client (calculés sur vos prospects, ou hypothèses modifiables), et les clients possibles. Les métiers sont
 *   classés du plus prometteur au moins prometteur ; « Prospecter » ouvre le générateur de leads réglé dessus.
 * - Nouvelles entreprises : les créations publiées au BODACC (API publique de la DILA) dans le département, ces derniers
 *   jours. Elles ont tout à mettre en place (clients, outils, site) : à appeler vite. Ajout au CRM en un clic.
 * - Concurrence : les agences et prestataires de la zone (communication, web, intégration, centres d'appels, conseil),
 *   combien d'entreprises ciblables pour chaque concurrent direct, et les mieux établis.
 * Les données publiques sont lues depuis le navigateur, sans clé ; les résultats restent une journée dans ce navigateur.
 */
(function () {
  'use strict';
  if (window.bsMarche) return;
  var API = 'https://recherche-entreprises.api.gouv.fr';
  var GEO = 'https://geo.api.gouv.fr';
  var BODACC = 'https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/annonces-commerciales/records';
  var CACHE_KEY = 'bs-marche', UI_KEY = 'bs-marche-ui', JOUR = 86400000;
  var CANAL_CREATIONS = 'Nouvelles entreprises (BODACC)';
  var CONTACTES = ['injoignable', 'rdv_pris', 'audit_realise', 'proposition_envoyee', 'client_signe', 'resilie', 'perdu'];
  var CLIENTS = ['client_signe', 'resilie'];
  var MIN_ECHANTILLON = 5, LISSAGE = 10, VISIBLES = 12;
  var TAUX_DEFAUT = 2;
  // Concurrents : codes d'activité (NAF) des agences et prestataires qui vendent la même chose (directs) ou s'en approchent.
  var CONCURRENTS = [
    { naf: '73.11Z', label: 'Agences de communication & publicité', direct: true },
    { naf: '62.01Z', label: 'Développeurs web & logiciels', direct: true },
    { naf: '62.02A', label: 'Intégrateurs & conseil informatique', direct: true },
    { naf: '82.20Z', label: 'Centres d’appels (prospection téléphonique)', direct: true },
    { naf: '70.22Z', label: 'Conseil en gestion & stratégie commerciale', direct: false },
    { naf: '73.20Z', label: 'Études de marché', direct: false },
  ];
  var ETABLIS = '11,12,21,22,31,32,41,42,51,52,53';
  var EFFECTIFS = { '00': '0 salarié', '01': '1 ou 2 salariés', '02': '3 à 5 salariés', '03': '6 à 9 salariés', '11': '10 à 19 salariés', '12': '20 à 49 salariés', '21': '50 à 99 salariés', '22': '100 à 199 salariés', '31': '200 à 249 salariés', '32': '250 à 499 salariés', '41': '500 à 999 salariés', '42': '1 000 à 1 999 salariés', '51': '2 000 à 4 999 salariés', '52': '5 000 à 9 999 salariés', '53': '10 000 salariés et plus' };
  // Secteur du CRM deviné d'après l'activité déclarée au BODACC.
  var MOTS_SECTEURS = [
    ['Artisans / BTP', /plomb|chauffag|[ée]lectri|menuis|ma[çc]on|b[âa]timent|couvert|couvreur|peintur|r[ée]novation|travaux|carrel|pl[âa]tr|serrur|charpent|terrassement|paysag|garage|r[ée]paration automobile/i],
    ['Immobilier', /immobili|transaction sur immeubles|gestion locative|syndic|marchand de biens|diagnostic/i],
    ['Santé & bien-être', /sant[ée]|soins|coiff|beaut[ée]|esth[ée]ti|m[ée]dic|kin[ée]|ost[ée]o|dentaire|sport|fitness|pharmac|bien-[êe]tre|massage|v[ée]t[ée]rinaire/i],
    ['Commerce / e-commerce', /restaura|commerce|boulang|p[âa]tiss|h[ôo]tel|caf[ée]|bar |boutique|e-commerce|vente [àa] distance|alimentation|[ée]picerie|fleur|v[êe]tement|pr[êe]t-[àa]-porter|snack/i],
    ['Services B2B', /conseil|comptab|informatique|nettoyage|communication|assurance|formation|services aux entreprises|courtage|juridique|marketing|logiciel|recrutement|transport/i],
  ];

  // ------------------------------------------------------------------ outils
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ic(name, size) {
    var p = window.bsIcones && window.bsIcones.svg ? window.bsIcones.svg(name) : '';
    return '<svg width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (p || '<circle cx="12" cy="12" r="8"/>') + '</svg>';
  }
  var nf = function (n) { return new Intl.NumberFormat('fr-FR').format(Math.round(n)); };
  var euro = function (n) { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n); };
  function pct(n) { return (Math.round(n * 10) / 10).toString().replace('.', ',') + ' %'; }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
  function digits(s) { return String(s || '').replace(/\D/g, ''); }
  function joli(s) { return window.bsLeads && window.bsLeads._interne ? window.bsLeads._interne.joli(s) : String(s || ''); }
  function readJson(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : d; } catch (e) { return d; } }
  function writeJson(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function aujourdhui() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function ilYa(jours) { var d = new Date(Date.now() - jours * JOUR); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function dateFr(d) { return d ? new Date(String(d).slice(0, 10) + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''; }
  function nouvelId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function store() { return window.__bsStore ? window.__bsStore.get() : { prospects: [] }; }
  function secteurs() { return (window.bsLeads && window.bsLeads.SECTEURS) || []; }
  function tailles() { return (window.bsLeads && window.bsLeads.TAILLES) || [{ id: 'toutes', label: 'Toutes tailles', codes: '' }]; }

  function getJson(url, essai) {
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var t = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
    return fetch(url, { signal: ctl ? ctl.signal : undefined, headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (r.status === 429 && !essai) return sleep(1500).then(function () { return getJson(url, 1); });
        if (r.status === 429) throw new Error('Trop de demandes envoyées à la base officielle : patientez quelques secondes et relancez.');
        if (!r.ok) { var e = new Error('La base officielle ne répond pas (erreur ' + r.status + ') : réessayez dans un instant.'); e.status = r.status; throw e; }
        return r.json();
      }, function () { throw new Error('La base officielle ne répond pas : vérifiez la connexion et réessayez.'); })
      .finally(function () { clearTimeout(t); });
  }

  // Zone saisie → filtres de l'API Sirene + département (pour le BODACC).
  var zones = {};
  function resoudreZone(z) {
    z = String(z || '').trim();
    var cle = norm(z);
    if (zones[cle]) return Promise.resolve(zones[cle]);
    var fin = function (v) { zones[cle] = v; return v; };
    if (!z) return Promise.resolve(fin({ label: 'toute la France', params: {}, dep: '' }));
    if (/^(\d{2}|2a|2b|97\d)$/i.test(z)) return Promise.resolve(fin({ label: 'département ' + z.toUpperCase(), params: { departement: z.toUpperCase() }, dep: z.toUpperCase() }));
    var cp = /^\d{5}$/.test(z);
    return getJson(GEO + '/communes?' + (cp ? 'codePostal=' + z : 'nom=' + encodeURIComponent(z) + '&boost=population') + '&fields=nom,code,codesPostaux,codeDepartement&limit=5').then(function (l) {
      var c = Array.isArray(l) && l[0];
      if (!c) throw new Error('Zone « ' + z + ' » introuvable : essayez une ville, un code postal (69003) ou un département (69).');
      if (cp) return fin({ label: z + ' (' + c.nom + ')', params: { code_postal: z }, dep: c.codeDepartement });
      // Paris, Lyon, Marseille : établissements rattachés aux arrondissements → tous leurs codes postaux.
      if (/^(75056|69123|13055)$/.test(c.code) && c.codesPostaux && c.codesPostaux.length) return fin({ label: c.nom, params: { code_postal: c.codesPostaux.join(',') }, dep: c.codeDepartement });
      return fin({ label: c.nom, params: { code_commune: c.code }, dep: c.codeDepartement });
    });
  }
  function recherche(zone, naf, tranches, parPage) {
    var q = new URLSearchParams();
    q.set('activite_principale', naf);
    q.set('etat_administratif', 'A');
    q.set('per_page', String(parPage || 1));
    q.set('page', '1');
    if (tranches) q.set('tranche_effectif_salarie', tranches);
    Object.keys(zone.params || {}).forEach(function (k) { q.set(k, zone.params[k]); });
    return getJson(API + '/search?' + q.toString());
  }

  // ------------------------------------------------------------------ chiffres du CRM
  function crm() {
    var ps = store().prospects || [];
    var parSecteur = {}, g = { contactes: 0, clients: 0 }, valeurs = [];
    ps.forEach(function (p) {
      var s = parSecteur[p.secteur || ''] || (parSecteur[p.secteur || ''] = { contactes: 0, clients: 0 });
      if (CONTACTES.indexOf(p.statut) >= 0) { s.contactes++; g.contactes++; }
      if (CLIENTS.indexOf(p.statut) >= 0) {
        s.clients++; g.clients++;
        var v = (+p.dealValue || 0) + 12 * (+p.mrrValue || 0);
        if (v > 0) valeurs.push(v);
      }
    });
    var taux = function (x) { return x.contactes >= MIN_ECHANTILLON ? x.clients / x.contactes * 100 : null; };
    var tg = taux(g);
    return {
      prospects: ps, parSecteur: parSecteur,
      // Taux d'un secteur lissé vers la moyenne du CRM (poids de 10 prospects) : 0 client sur 5 appels ne veut pas dire 0 %.
      tauxSecteur: function (id) { var s = parSecteur[id]; return s && tg != null && s.contactes >= MIN_ECHANTILLON ? (s.clients + LISSAGE * tg / 100) / (s.contactes + LISSAGE) * 100 : null; },
      tauxBrut: function (id) { var s = parSecteur[id]; return s ? taux(s) : null; },
      tauxGlobal: tg, contactes: g.contactes,
      valeur: valeurs.length ? valeurs.reduce(function (a, b) { return a + b; }, 0) / valeurs.length : null,
      nbValeurs: valeurs.length,
    };
  }
  function auCrmMetier(ps, m) { return ps.filter(function (p) { return (p.tags || []).indexOf(m.label) >= 0; }).length; }

  // ------------------------------------------------------------------ état
  var ui = Object.assign({ onglet: 'potentiel', zone: '', taille: 'toutes', choix: [], jours: '14', filtre: '', secteurC: '', taux: '', valeur: '' }, readJson(UI_KEY, {}));
  var cache = readJson(CACHE_KEY, {});
  var S = { charge: '', progres: 0, total: 0, err: '', msg: null, ajoutes: {} };
  var racine = null;
  function sauverUi() { writeJson(UI_KEY, ui); }
  function lire(cle) { var c = cache[cle]; return c && Date.now() - c.at < JOUR ? c : null; }
  function garder(cle, v) {
    v.at = Date.now(); cache[cle] = v;
    Object.keys(cache).forEach(function (k) { if (Date.now() - cache[k].at > JOUR) delete cache[k]; });
    writeJson(CACHE_KEY, cache);
  }
  function zoneParDefaut() {
    var c = (store().settings || {}).clientIdeal;
    if (c && Array.isArray(c.zones) && c.zones[0]) return c.zones[0];
    return (store().companyInfo || {}).ville || '';
  }
  function metiersChoisis() {
    var tous = [];
    secteurs().forEach(function (s) { s.metiers.forEach(function (m) { tous.push({ m: m, s: s }); }); });
    if (!ui.choix.length) return tous;
    return tous.filter(function (x) { return ui.choix.indexOf(x.s.id) >= 0; });
  }
  function clePotentiel() { return 'pot|' + norm(ui.zone) + '|' + ui.taille + '|' + (ui.choix.slice().sort().join(',') || 'tous'); }
  function cleConcurrence() { return 'conc|' + norm(ui.zone); }
  function cleCreations(zone) { return 'crea|' + (zone.dep || '') + '|' + ui.jours; }

  // ------------------------------------------------------------------ Potentiel
  function analyser() {
    var liste = metiersChoisis(), t = tailles().filter(function (x) { return x.id === ui.taille; })[0];
    S.charge = 'potentiel'; S.err = ''; S.progres = 0; S.total = liste.length; rendre();
    var lignes = [];
    return resoudreZone(ui.zone).then(function (zone) {
      return liste.reduce(function (p, x, i) {
        return p.then(function () {
          return recherche(zone, x.m.naf.join(','), t && t.codes).then(function (d) {
            lignes.push({ id: x.m.id, label: x.m.label, secteur: x.s.id, total: +d.total_results || 0 });
            S.progres = i + 1; rendre();
            return sleep(140);
          });
        });
      }, Promise.resolve()).then(function () {
        garder(clePotentiel(), { zone: zone.label, lignes: lignes });
        if (!lire(cleConcurrence())) S.msg = null;
      });
    }).catch(function (e) { S.err = e.message; }).then(function () { S.charge = ''; rendre(); });
  }
  function hypotheses(c) {
    var taux = parseFloat(String(ui.taux).replace(',', '.'));
    var valeur = parseFloat(String(ui.valeur).replace(/\s/g, '').replace(',', '.'));
    return {
      taux: c.tauxGlobal != null ? c.tauxGlobal : (taux > 0 ? taux : TAUX_DEFAUT),
      tauxSource: c.tauxGlobal != null ? 'crm' : 'hypothese',
      valeur: c.valeur != null ? c.valeur : (valeur > 0 ? valeur : null),
      valeurSource: c.valeur != null ? 'crm' : 'hypothese',
    };
  }
  function calculer(res) {
    var c = crm(), h = hypotheses(c), parId = {};
    metiersChoisis().forEach(function (x) { parId[x.m.id] = x.m; });
    var lignes = res.lignes.map(function (l) {
      var m = parId[l.id] || { label: l.label };
      var au = auCrmMetier(c.prospects, m), reste = Math.max(0, l.total - au);
      var ts = c.tauxSecteur(l.secteur), taux = ts != null ? ts : h.taux;
      var clients = reste * taux / 100;
      return { id: l.id, label: l.label, secteur: l.secteur, total: l.total, au: au, reste: reste, taux: taux, tauxPropre: ts != null, clients: clients, valeur: h.valeur != null ? clients * h.valeur : null };
    }).sort(function (a, b) { return b.clients - a.clients || b.total - a.total; });
    return { c: c, h: h, lignes: lignes };
  }
  function vuePotentiel() {
    var res = lire(clePotentiel()), h = '';
    var ts = tailles();
    h += '<section class="card bsmar-card"><header class="card-head"><div><h3 class="card-title">Votre marché</h3><p class="card-sub">Entreprises en activité dans la zone, d’après la base officielle Sirene (INSEE).</p></div></header>' +
      '<form class="bsmar-form" data-form="potentiel">' +
      '<label class="field"><span class="field-label">Zone</span><input class="input" name="zone" value="' + esc(ui.zone) + '" placeholder="Ville, code postal ou département : Lyon, 69003, 69"><span class="field-hint">Vide : toute la France.</span></label>' +
      '<label class="field"><span class="field-label">Taille</span><select class="input" name="taille">' + ts.map(function (t) { return '<option value="' + esc(t.id) + '"' + (ui.taille === t.id ? ' selected' : '') + '>' + esc(t.label) + '</option>'; }).join('') + '</select></label>' +
      '<button type="submit" class="btn btn-primary btn-md"' + (S.charge ? ' disabled' : '') + '>' + ic('search', 15) + (S.charge === 'potentiel' ? ' Analyse… ' + S.progres + '/' + S.total : ' Analyser le marché') + '</button></form>' +
      '<div class="bsmar-chips" role="group" aria-label="Secteurs analysés"><span>Secteurs :</span>' + secteurs().map(function (s) {
        var on = !ui.choix.length || ui.choix.indexOf(s.id) >= 0;
        return '<button type="button" class="bsmar-chip' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-sect="' + esc(s.id) + '">' + (on ? ic('check', 12) : '') + esc(s.id) + '</button>';
      }).join('') + '</div>' +
      (S.charge === 'potentiel' ? '<div class="bsmar-prog"><i style="width:' + Math.round(S.progres / Math.max(1, S.total) * 100) + '%"></i></div>' : '') +
      (S.err && S.charge === '' && ui.onglet === 'potentiel' ? '<div class="bsmar-msg warn">' + esc(S.err) + '</div>' : '') + '</section>';
    if (!res) return h + (S.charge ? '' : '<p class="bsmar-vide">' + ic('trending-up', 18) + 'Choisissez votre zone puis « Analyser le marché » : le CRM compte les entreprises de chaque métier, les compare à vos résultats et vous dit où prospecter en premier.</p>');
    var k = calculer(res), L = k.lignes, c = k.c, hy = k.h;
    var total = L.reduce(function (a, l) { return a + l.total; }, 0), au = L.reduce(function (a, l) { return a + l.au; }, 0);
    var clients = L.reduce(function (a, l) { return a + l.clients; }, 0), valeur = hy.valeur != null ? L.reduce(function (a, l) { return a + (l.valeur || 0); }, 0) : null;
    var max = Math.max.apply(null, L.map(function (l) { return l.clients; }).concat([1]));
    h += '<div class="bsmar-kpis">' + [
      ['building', nf(total), 'entreprises ciblables', esc(res.zone)],
      ['users', nf(au), 'déjà dans le CRM', total ? pct(au / total * 100) + ' du marché couvert' : ''],
      ['target', pct(hy.taux), 'taux de signature', hy.tauxSource === 'crm' ? 'calculé sur vos ' + c.contactes + ' prospects contactés' : 'hypothèse, à ajuster ci-dessous'],
      ['trending-up', valeur != null ? euro(valeur) : nf(clients), valeur != null ? 'de chiffre d’affaires possible' : 'clients possibles', valeur != null ? nf(clients) + ' clients possibles sur 12 mois' : 'indiquez la valeur d’un client pour voir le chiffre d’affaires'],
    ].map(function (x) { return '<div class="bsmar-kpi"><span class="bsmar-kic">' + ic(x[0], 16) + '</span><div><b>' + x[1] + '</b><span>' + x[2] + '</span><small>' + x[3] + '</small></div></div>'; }).join('') + '</div>';

    var conseils = [], top = L[0];
    if (top && top.total) conseils.push('Commencez par les <b>' + esc(top.label.toLowerCase()) + '</b> : ' + nf(top.total) + ' entreprises dans la zone, ' + (top.au ? nf(top.au) + ' déjà dans le CRM' : 'aucune encore dans le CRM') + ', soit environ ' + nf(top.clients) + ' clients possibles.');
    var meilleurs = secteurs().map(function (s) { return { s: s.id, t: c.tauxBrut(s.id) }; }).filter(function (x) { return x.t != null; }).sort(function (a, b) { return b.t - a.t; });
    if (meilleurs.length && c.tauxGlobal != null && meilleurs[0].t > c.tauxGlobal) conseils.push('Votre secteur qui signe le mieux : <b>' + esc(meilleurs[0].s) + '</b>, ' + pct(meilleurs[0].t) + ' des prospects contactés deviennent clients (moyenne du CRM : ' + pct(c.tauxGlobal) + ').');
    var vierge = L.filter(function (l) { return !l.au && l.total >= 20; }).sort(function (a, b) { return b.total - a.total; })[0];
    if (vierge && vierge !== top) conseils.push('Marché encore vierge pour vous : <b>' + esc(vierge.label.toLowerCase()) + '</b>, ' + nf(vierge.total) + ' entreprises et aucune dans le CRM.');
    if (hy.tauxSource !== 'crm') conseils.push('Le taux de signature sera calculé sur vos chiffres dès ' + MIN_ECHANTILLON + ' prospects contactés (vous en avez ' + c.contactes + ').');
    if (conseils.length) h += '<section class="card bsmar-card"><header class="card-head"><div><h3 class="card-title">À retenir</h3></div></header><ul class="bsmar-conseils">' + conseils.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></section>';

    h += '<section class="card bsmar-card"><header class="card-head"><div><h3 class="card-title">Où prospecter en priorité</h3><p class="card-sub">Clients possibles = entreprises pas encore dans le CRM × taux de signature (celui du secteur dès ' + MIN_ECHANTILLON + ' prospects contactés, rapproché de votre moyenne tant qu’ils sont peu nombreux).</p></div></header>' +
      '<div class="table-wrap"><table class="table bsmar-table"><thead><tr><th>Métier</th><th class="num">Entreprises</th><th class="num">Au CRM</th><th class="num">Signature</th><th class="num">Clients possibles</th>' + (hy.valeur != null ? '<th class="num">CA possible</th>' : '') + '<th></th></tr></thead><tbody>' +
      L.slice(0, ui.tout ? L.length : VISIBLES).map(function (l) {
        return '<tr data-metier="' + esc(l.id) + '"><td><b>' + esc(l.label) + '</b><small>' + esc(l.secteur) + '</small></td><td class="num">' + nf(l.total) + '</td><td class="num">' + (l.au ? nf(l.au) : '–') + '</td>' +
          '<td class="num">' + pct(l.taux) + (l.tauxPropre ? '' : '<small>' + (hy.tauxSource === 'crm' ? 'moy. CRM' : 'hypothèse') + '</small>') + '</td>' +
          '<td class="num"><span class="bsmar-bar"><i style="width:' + Math.round(l.clients / max * 100) + '%"></i></span>' + nf(l.clients) + '</td>' +
          (hy.valeur != null ? '<td class="num">' + euro(l.valeur) + '</td>' : '') +
          '<td class="num"><button type="button" class="btn btn-secondary btn-sm" data-prospecter="' + esc(l.id) + '"' + (l.reste ? '' : ' disabled') + '>' + ic('sparkles', 14) + ' Prospecter</button></td></tr>';
      }).join('') + '</tbody></table></div>' +
      (L.length > VISIBLES ? '<button type="button" class="btn btn-ghost btn-sm bsmar-plus" data-act="tout">' + (ui.tout ? 'Voir les ' + VISIBLES + ' premiers' : 'Voir les ' + L.length + ' métiers') + '</button>' : '') +
      '<form class="bsmar-hyp" data-form="hypotheses">' +
      (hy.tauxSource === 'crm' ? '<span>Taux de signature : <b>' + pct(hy.taux) + '</b> (vos chiffres)</span>' : '<label>Taux de signature (hypothèse) <input class="input" name="taux" inputmode="decimal" value="' + esc(ui.taux || String(TAUX_DEFAUT)) + '"> %</label>') +
      (hy.valeurSource === 'crm' ? '<span>Valeur d’un client sur 12 mois : <b>' + euro(hy.valeur) + '</b> (moyenne de vos ' + c.nbValeurs + ' clients)</span>' : '<label>Valeur d’un client sur 12 mois <input class="input" name="valeur" inputmode="decimal" placeholder="ex. 1500" value="' + esc(ui.valeur) + '"> €</label>') +
      (hy.tauxSource === 'crm' && hy.valeurSource === 'crm' ? '' : '<button type="submit" class="btn btn-ghost btn-sm">Recalculer</button>') + '</form>' +
      '<p class="bsmar-note">Chiffres Sirene du ' + new Date(res.at).toLocaleDateString('fr-FR') + ' (gardés une journée). « Prospecter » ouvre Nouveaux leads sur ce métier et cette zone.</p></section>';
    return h;
  }

  // ------------------------------------------------------------------ Nouvelles entreprises (BODACC)
  function objet(v) { if (!v) return null; if (typeof v === 'object') return v; try { return JSON.parse(v); } catch (e) { return null; } }
  function chercherCle(o, cles, prof) {
    if (!o || typeof o !== 'object' || (prof || 0) > 6) return '';
    for (var k in o) {
      if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
      if (cles.indexOf(k) >= 0 && typeof o[k] === 'string' && o[k].trim()) return o[k].trim();
    }
    for (var k2 in o) {
      if (!Object.prototype.hasOwnProperty.call(o, k2) || typeof o[k2] !== 'object') continue;
      var r = chercherCle(o[k2], cles, (prof || 0) + 1);
      if (r) return r;
    }
    return '';
  }
  function secteurDe(texte) { for (var i = 0; i < MOTS_SECTEURS.length; i++) if (MOTS_SECTEURS[i][1].test(texte)) return MOTS_SECTEURS[i][0]; return ''; }
  function creation(r) {
    if (!r || !r.commercant) return null;
    var reg = [].concat(r.registre || []).map(digits).filter(function (x) { return x.length === 9; })[0] || '';
    var etab = objet(r.listeetablissements), acte = objet(r.acte), pers = objet(r.listepersonnes);
    var activite = chercherCle(etab, ['activite']) || chercherCle(acte, ['activite']) || chercherCle(pers, ['activite']);
    var forme = chercherCle(pers, ['formeJuridique', 'forme_juridique']);
    var admin = chercherCle(pers, ['administration']);
    var debut = chercherCle(acte, ['dateCommencementActivite', 'dateImmatriculation']);
    return {
      id: String(r.id || reg || r.commercant), siren: reg, nom: joli(String(r.commercant).trim()), ville: joli(r.ville || ''), cp: r.cp || '',
      date: String(r.dateparution || '').slice(0, 10), activite: activite.slice(0, 220), forme: forme, dirigeant: admin.slice(0, 160), debut: debut,
      lien: /^https:\/\//.test(r.url_complete || '') ? r.url_complete : '', secteur: secteurDe(activite + ' ' + r.commercant),
    };
  }
  function chargerCreations(forcer) {
    S.charge = 'creations'; S.err = ''; rendre();
    return resoudreZone(ui.zone).then(function (zone) {
      if (!zone.dep) throw new Error('Choisissez une zone (ville, code postal ou département) : le BODACC est lu département par département.');
      var cle = cleCreations(zone);
      if (!forcer && lire(cle)) return;
      var where = '(familleavis="creation" OR familleavis="cr" OR familleavis_lib="Créations") AND numerodepartement="' + zone.dep + '" AND dateparution>=date\'' + ilYa(+ui.jours) + '\'';
      var url = BODACC + '?where=' + encodeURIComponent(where) + '&order_by=' + encodeURIComponent('dateparution desc') + '&limit=100';
      return getJson(url).then(function (d) {
        var liste = (d.results || []).map(creation).filter(Boolean);
        garder(cle, { zone: zone.label, dep: zone.dep, total: +d.total_count || liste.length, liste: liste });
      });
    }).catch(function (e) { S.err = e.message.replace('La base officielle', 'Le BODACC'); }).then(function () { S.charge = ''; rendre(); });
  }
  function dansCrm(x) {
    var ps = store().prospects || [], n = norm(x.nom) + '|' + norm(x.ville);
    return ps.filter(function (p) { var s = digits(p.siret); return (x.siren && s.slice(0, 9) === x.siren) || norm(p.entreprise) + '|' + norm(p.ville) === n; })[0] || null;
  }
  function ajouterCreation(x) {
    if (dansCrm(x)) return false;
    var d = aujourdhui(), id = nouvelId(), n = new Date();
    var notes = [
      'Nouvelle entreprise repérée dans la rubrique Marché le ' + n.toLocaleDateString('fr-FR') + ' (BODACC, annonce du ' + new Date(x.date + 'T12:00:00').toLocaleDateString('fr-FR') + ').',
      x.activite ? 'Activité : ' + x.activite : '', x.forme ? 'Forme : ' + x.forme : '', x.dirigeant ? 'Dirigeants : ' + x.dirigeant : '',
      'Téléphone et email à rechercher (non publiés au BODACC).',
      x.lien ? 'Annonce : ' + x.lien : '', x.siren ? 'Fiche officielle : https://annuaire-entreprises.data.gouv.fr/entreprise/' + x.siren : '',
    ].filter(Boolean).join('\n');
    var p = {
      id: id, entreprise: x.nom, secteur: x.secteur || '', contact: '', telephone: '', email: '', ville: x.ville, adresse: x.cp ? x.cp + ' ' + x.ville : '',
      siret: x.siren, site: '', canal: CANAL_CREATIONS, statut: 'a_appeler', priorite: 'haute', tags: ['Nouvelle entreprise'], notes: notes,
      dealValue: 0, mrrValue: 0, signedAt: null, resilieAt: null, prochaineRelance: d, prochaineRelanceHeure: '', createdAt: d, updatedAt: d, callLog: [],
      events: [{ id: nouvelId(), ts: n.toISOString(), date: d, time: n.toTimeString().slice(0, 5), type: 'create', text: 'Prospect créé depuis Marché › Nouvelles entreprises (BODACC)' }],
    };
    window.__bsStore.set(function (s) { return { prospects: [p].concat(s.prospects || []) }; });
    S.ajoutes[x.id] = id;
    return true;
  }
  function vueCreations() {
    var zone = zones[norm(ui.zone)], res = zone && lire(cleCreations(zone)), h = '';
    h += '<section class="card bsmar-card"><header class="card-head"><div><h3 class="card-title">Entreprises qui viennent de se créer</h3><p class="card-sub">Publiées au BODACC (Bulletin officiel des annonces civiles et commerciales). Elles ont tout à mettre en place : clients, outils, site. Appelez-les dans les deux semaines.</p></div></header>' +
      '<form class="bsmar-form" data-form="creations"><label class="field"><span class="field-label">Zone</span><input class="input" name="zone" value="' + esc(ui.zone) + '" placeholder="Ville, code postal ou département"><span class="field-hint">Tout le département de la zone.</span></label>' +
      '<label class="field"><span class="field-label">Période</span><select class="input" name="jours">' + [['7', '7 derniers jours'], ['14', '14 derniers jours'], ['30', '30 derniers jours']].map(function (p) { return '<option value="' + p[0] + '"' + (ui.jours === p[0] ? ' selected' : '') + '>' + p[1] + '</option>'; }).join('') + '</select></label>' +
      '<button type="submit" class="btn btn-primary btn-md"' + (S.charge ? ' disabled' : '') + '>' + ic('search', 15) + (S.charge === 'creations' ? ' Recherche…' : ' Voir les créations') + '</button></form>' +
      (S.err && ui.onglet === 'creations' ? '<div class="bsmar-msg warn">' + esc(S.err) + '</div>' : '') + '</section>';
    if (!res) return h + (S.charge ? '' : '<p class="bsmar-vide">' + ic('sparkles', 18) + 'Les sociétés immatriculées ces derniers jours dans votre département, à ajouter au CRM d’un clic.</p>');
    var f = norm(ui.filtre), liste = res.liste.filter(function (x) {
      return (!ui.secteurC || x.secteur === ui.secteurC) && (!f || norm(x.nom + ' ' + x.activite + ' ' + x.ville).indexOf(f) >= 0);
    });
    var parS = {};
    res.liste.forEach(function (x) { if (x.secteur) parS[x.secteur] = (parS[x.secteur] || 0) + 1; });
    h += '<section class="card bsmar-card"><header class="card-head"><div><h3 class="card-title">' + nf(res.total) + ' création' + (res.total > 1 ? 's' : '') + ' · ' + esc(res.zone === 'département ' + res.dep ? res.zone : 'département ' + res.dep) + '</h3><p class="card-sub">' + (res.total > res.liste.length ? 'Les ' + res.liste.length + ' plus récentes. ' : '') + 'Mis à jour le ' + new Date(res.at).toLocaleDateString('fr-FR') + '.</p></div>' +
      '<div class="card-actions"><button type="button" class="btn btn-ghost btn-sm" data-act="actualiser-creations">Actualiser</button></div></header>' +
      '<div class="bsmar-filtres"><input class="input" data-filtre placeholder="Filtrer : restaurant, plomberie, Lyon…" value="' + esc(ui.filtre) + '">' +
      '<div class="bsmar-chips"><button type="button" class="bsmar-chip' + (!ui.secteurC ? ' on' : '') + '" data-secteurc="">Tous</button>' + Object.keys(parS).sort(function (a, b) { return parS[b] - parS[a]; }).map(function (s) {
        return '<button type="button" class="bsmar-chip' + (ui.secteurC === s ? ' on' : '') + '" data-secteurc="' + esc(s) + '">' + esc(s) + ' <em>' + parS[s] + '</em></button>';
      }).join('') + '</div></div>' +
      (liste.length ? '<div class="bsmar-liste">' + liste.slice(0, 60).map(function (x) {
        var dej = S.ajoutes[x.id] || (dansCrm(x) || {}).id;
        return '<div class="bsmar-crea" data-crea="' + esc(x.id) + '"><div class="bsmar-crea-t"><b>' + esc(x.nom) + '</b><span>' + esc([dateFr(x.date), x.ville + (x.cp ? ' (' + x.cp + ')' : ''), x.forme].filter(Boolean).join(' · ')) + '</span>' +
          (x.activite ? '<p>' + esc(x.activite) + '</p>' : '') + (x.secteur ? '<em class="bsmar-tag">' + esc(x.secteur) + '</em>' : '') + '</div>' +
          '<div class="bsmar-crea-a">' + (dej ? '<button type="button" class="btn btn-ghost btn-sm" data-ouvrir="' + esc(dej) + '">' + ic('check', 14) + ' Dans le CRM</button>' : '<button type="button" class="btn btn-primary btn-sm" data-ajouter="' + esc(x.id) + '">' + ic('plus', 14) + ' Ajouter au CRM</button>') +
          '<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://www.google.com/search?q=' + encodeURIComponent(x.nom + ' ' + x.ville) + '">' + ic('search', 14) + ' Téléphone</a>' +
          (x.lien ? '<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="' + esc(x.lien) + '">Annonce</a>' : '') + '</div></div>';
      }).join('') + '</div>' : '<p class="bsmar-vide">Aucune création ne correspond à ce filtre.</p>') + '</section>';
    return h;
  }

  // ------------------------------------------------------------------ Concurrence
  function chargerConcurrence() {
    S.charge = 'concurrence'; S.err = ''; S.progres = 0; S.total = CONCURRENTS.length * 2; rendre();
    return resoudreZone(ui.zone).then(function (zone) {
      var cats = [], top = [];
      return CONCURRENTS.reduce(function (p, c) {
        return p.then(function () {
          return recherche(zone, c.naf, '', 1).then(function (d) {
            var ligne = { naf: c.naf, label: c.label, direct: c.direct, total: +d.total_results || 0 };
            S.progres++; rendre();
            return sleep(140).then(function () { return recherche(zone, c.naf, ETABLIS, c.direct ? 10 : 1); }).then(function (d2) {
              ligne.etablis = +d2.total_results || 0;
              if (c.direct) (d2.results || []).forEach(function (o) {
                var e = (o.matching_etablissements || [])[0] || o.siege || {};
                var tr = e.tranche_effectif_salarie || o.tranche_effectif_salarie || '';
                top.push({ siren: String(o.siren || ''), nom: joli(o.nom_complet || o.nom_raison_sociale || ''), ville: joli(e.libelle_commune || ''), metier: c.label, effectif: EFFECTIFS[tr] || '', tr: tr, creation: String(o.date_creation || '').slice(0, 4) });
              });
              cats.push(ligne); S.progres++; rendre();
              return sleep(140);
            });
          });
        });
      }, Promise.resolve()).then(function () {
        var vus = {};
        top = top.filter(function (x) { if (!x.nom || vus[x.siren || x.nom]) return false; vus[x.siren || x.nom] = true; return true; });
        top.sort(function (a, b) { return (b.tr || '').localeCompare(a.tr || '') || a.nom.localeCompare(b.nom); });
        garder(cleConcurrence(), { zone: zone.label, cats: cats, top: top.slice(0, 12) });
      });
    }).catch(function (e) { S.err = e.message; }).then(function () { S.charge = ''; rendre(); });
  }
  function vueConcurrence() {
    var res = lire(cleConcurrence()), pot = lire(clePotentiel()), h = '';
    h += '<section class="card bsmar-card"><header class="card-head"><div><h3 class="card-title">Vos concurrents dans la zone</h3><p class="card-sub">Agences et prestataires en activité qui vendent la même chose que vous, d’après la base officielle Sirene.</p></div></header>' +
      '<form class="bsmar-form" data-form="concurrence"><label class="field"><span class="field-label">Zone</span><input class="input" name="zone" value="' + esc(ui.zone) + '" placeholder="Ville, code postal ou département"></label>' +
      '<button type="submit" class="btn btn-primary btn-md"' + (S.charge ? ' disabled' : '') + '>' + ic('search', 15) + (S.charge === 'concurrence' ? ' Recherche… ' + S.progres + '/' + S.total : ' Voir la concurrence') + '</button></form>' +
      (S.charge === 'concurrence' ? '<div class="bsmar-prog"><i style="width:' + Math.round(S.progres / Math.max(1, S.total) * 100) + '%"></i></div>' : '') +
      (S.err && ui.onglet === 'concurrence' ? '<div class="bsmar-msg warn">' + esc(S.err) + '</div>' : '') + '</section>';
    if (!res) return h + (S.charge ? '' : '<p class="bsmar-vide">' + ic('users', 18) + 'Combien d’agences se partagent votre zone, et combien d’entreprises ciblables il reste pour chacune.</p>');
    var directs = res.cats.filter(function (c) { return c.direct; }).reduce(function (a, c) { return a + c.total; }, 0);
    var etablis = res.cats.filter(function (c) { return c.direct; }).reduce(function (a, c) { return a + c.etablis; }, 0);
    var cibles = pot ? pot.lignes.reduce(function (a, l) { return a + l.total; }, 0) : 0;
    var ratio = cibles && directs ? cibles / directs : 0;
    h += '<div class="bsmar-kpis">' + [
      ['users', nf(directs), 'concurrents directs', esc(res.zone)],
      ['building', nf(etablis), 'avec 10 salariés et plus', directs ? pct(etablis / directs * 100) + ' des concurrents directs' : ''],
      ['target', ratio ? nf(ratio) : '–', 'entreprises ciblables par concurrent', ratio ? (ratio >= 50 ? 'marché peu disputé : foncez' : ratio >= 15 ? 'concurrence normale : misez sur une niche' : 'marché disputé : spécialisez-vous') : 'lancez l’onglet Potentiel sur la même zone pour comparer'],
    ].map(function (x) { return '<div class="bsmar-kpi"><span class="bsmar-kic">' + ic(x[0], 16) + '</span><div><b>' + x[1] + '</b><span>' + x[2] + '</span><small>' + x[3] + '</small></div></div>'; }).join('') + '</div>';
    var max = Math.max.apply(null, res.cats.map(function (c) { return c.total; }).concat([1]));
    h += '<section class="card bsmar-card"><header class="card-head"><div><h3 class="card-title">Par type de prestataire</h3></div></header><div class="table-wrap"><table class="table bsmar-table"><thead><tr><th>Type</th><th class="num">En activité</th><th class="num">10 salariés et plus</th></tr></thead><tbody>' +
      res.cats.map(function (c) {
        return '<tr><td><b>' + esc(c.label) + '</b><small>' + (c.direct ? 'concurrent direct' : 'concurrent indirect') + ' · NAF ' + esc(c.naf) + '</small></td><td class="num"><span class="bsmar-bar"><i style="width:' + Math.round(c.total / max * 100) + '%"></i></span>' + nf(c.total) + '</td><td class="num">' + nf(c.etablis) + '</td></tr>';
      }).join('') + '</tbody></table></div></section>';
    if (res.top.length) {
      h += '<section class="card bsmar-card"><header class="card-head"><div><h3 class="card-title">Les mieux établis</h3><p class="card-sub">Regardez leurs offres et leurs prix pour vous démarquer.</p></div></header><div class="bsmar-liste">' + res.top.map(function (x) {
        return '<div class="bsmar-crea"><div class="bsmar-crea-t"><b>' + esc(x.nom) + '</b><span>' + esc([x.ville, x.effectif, x.creation ? 'créée en ' + x.creation : ''].filter(Boolean).join(' · ')) + '</span><em class="bsmar-tag">' + esc(x.metier) + '</em></div>' +
          '<div class="bsmar-crea-a"><a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://www.google.com/search?q=' + encodeURIComponent(x.nom + ' ' + x.ville) + '">' + ic('search', 14) + ' Site et avis</a>' +
          (x.siren ? '<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://annuaire-entreprises.data.gouv.fr/entreprise/' + esc(x.siren) + '">Fiche officielle</a>' : '') + '</div></div>';
      }).join('') + '</div></section>';
    }
    return h;
  }

  // ------------------------------------------------------------------ rendu
  var ONGLETS = [['potentiel', 'Potentiel', 'trending-up'], ['creations', 'Nouvelles entreprises', 'sparkles'], ['concurrence', 'Concurrence', 'users']];
  function rendre() {
    if (!racine || !racine.isConnected) return;
    var actif = document.activeElement, focusFiltre = actif && actif.hasAttribute && actif.hasAttribute('data-filtre'), pos = focusFiltre ? actif.selectionStart : 0;
    racine.innerHTML = '<div class="page-head"><div class="page-head-text"><h1 class="page-title">Marché</h1><p class="page-sub">Où sont vos prochains clients : taille du marché, nouvelles entreprises et concurrence, chiffres officiels à l’appui</p></div></div>' +
      '<div role="tablist" class="segmented bsmar-tabs">' + ONGLETS.map(function (o) {
        return '<button type="button" role="tab" aria-selected="' + (ui.onglet === o[0]) + '" class="seg' + (ui.onglet === o[0] ? ' active' : '') + '" data-onglet="' + o[0] + '">' + ic(o[2], 14) + '<span>' + o[1] + '</span></button>';
      }).join('') + '</div>' +
      (ui.onglet === 'creations' ? vueCreations() : ui.onglet === 'concurrence' ? vueConcurrence() : vuePotentiel()) +
      (S.msg ? '<div class="bsmar-msg ' + S.msg.k + '">' + esc(S.msg.t) + '</div>' : '');
    if (focusFiltre) { var f = racine.querySelector('[data-filtre]'); if (f) { f.focus(); try { f.setSelectionRange(pos, pos); } catch (e) {} } }
  }
  function brancher(el) {
    el.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var f = ev.target, quoi = f.getAttribute('data-form');
      if (f.zone) ui.zone = f.zone.value.trim();
      if (f.taille) ui.taille = f.taille.value;
      if (f.jours) ui.jours = f.jours.value;
      if (quoi === 'hypotheses') { if (f.taux) ui.taux = f.taux.value.trim(); if (f.valeur) ui.valeur = f.valeur.value.trim(); sauverUi(); rendre(); return; }
      sauverUi(); S.msg = null;
      if (quoi === 'potentiel') analyser();
      if (quoi === 'creations') chargerCreations(false);
      if (quoi === 'concurrence') chargerConcurrence();
    });
    el.addEventListener('input', function (ev) {
      if (!ev.target.hasAttribute('data-filtre')) return;
      ui.filtre = ev.target.value; sauverUi(); rendre();
    });
    el.addEventListener('click', function (ev) {
      var t = ev.target.closest('[data-onglet],[data-sect],[data-prospecter],[data-ajouter],[data-secteurc],[data-act],[data-ouvrir]'); if (!t) return;
      if (t.hasAttribute('data-onglet')) {
        ui.onglet = t.getAttribute('data-onglet'); S.err = ''; S.msg = null; sauverUi(); rendre();
        if (ui.onglet === 'creations' && ui.zone && !S.charge) { var z = zones[norm(ui.zone)]; if (!z || !lire(cleCreations(z))) chargerCreations(false); }
        return;
      }
      if (t.hasAttribute('data-sect')) {
        var id = t.getAttribute('data-sect'), tous = secteurs().map(function (s) { return s.id; });
        var cur = ui.choix.length ? ui.choix.slice() : tous.slice();
        cur = cur.indexOf(id) >= 0 ? cur.filter(function (x) { return x !== id; }) : cur.concat([id]);
        ui.choix = !cur.length || cur.length === tous.length ? [] : cur;
        sauverUi(); rendre(); return;
      }
      if (t.hasAttribute('data-prospecter')) {
        var mid = t.getAttribute('data-prospecter'), x = metiersChoisis().filter(function (y) { return y.m.id === mid; })[0];
        if (x && window.bsLeads && window.bsLeads.cibler) window.bsLeads.cibler({ secteur: x.s.id, metier: x.m.id, zone: ui.zone, rayon: '0', taille: ui.taille });
        return;
      }
      if (t.hasAttribute('data-ajouter')) {
        var zone = zones[norm(ui.zone)], res = zone && lire(cleCreations(zone));
        var c = res && res.liste.filter(function (y) { return y.id === t.getAttribute('data-ajouter'); })[0];
        if (c && ajouterCreation(c)) S.msg = { k: 'ok', t: c.nom + ' est dans le CRM, à appeler aujourd’hui.' };
        rendre(); return;
      }
      if (t.hasAttribute('data-ouvrir')) {
        ev.preventDefault();
        var pid = t.getAttribute('data-ouvrir'), Y = window.__bsY;
        if (Y && Y.set) Y.set(function (a) { return { overlays: (a.overlays || []).concat([{ key: nouvelId(), type: 'prospect', id: pid }]) }; });
        return;
      }
      if (t.hasAttribute('data-secteurc')) { ui.secteurC = t.getAttribute('data-secteurc'); sauverUi(); rendre(); return; }
      if (t.getAttribute('data-act') === 'actualiser-creations') chargerCreations(true);
      if (t.getAttribute('data-act') === 'tout') { ui.tout = !ui.tout; sauverUi(); rendre(); }
    });
  }
  var CSS = [
    '.bsmar{display:flex;flex-direction:column;gap:16px}',
    '.bsmar-tabs{align-self:flex-start;max-width:100%;overflow-x:auto}.bsmar-tabs .seg{display:inline-flex;align-items:center;gap:6px}',
    '.bsmar-card>*:not(.card-head):not(.table-wrap){margin-left:18px;margin-right:18px}.bsmar-card{padding-bottom:14px}',
    '.bsmar-form{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end}.bsmar-form .field{flex:1 1 200px;min-width:0;margin:0}.bsmar-form .field:nth-child(2){flex:0 1 200px}',
    '.bsmar-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:12px;font-size:13px;color:var(--text-3)}',
    '.bsmar-chip{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--border);background:var(--surface);color:var(--text-2);border-radius:999px;padding:4px 10px;font-size:12.5px;font-weight:600;cursor:pointer}',
    '.bsmar-chip.on{border-color:rgb(var(--accent-rgb)/.55);background:rgb(var(--accent-rgb)/.12);color:var(--accent-text)}.bsmar-chip em{font-style:normal;opacity:.7}',
    '.bsmar-prog{height:6px;border-radius:999px;background:var(--surface-2);overflow:hidden;margin-top:12px}.bsmar-prog i{display:block;height:100%;background:var(--accent);transition:width .2s}',
    '.bsmar-msg{border-radius:10px;padding:9px 12px;font-size:13.5px;margin-top:12px;border:1px solid var(--border);background:var(--surface-2)}.bsmar-msg.ok{border-color:rgba(34,197,94,.45);background:rgba(34,197,94,.1)}.bsmar-msg.warn{border-color:rgba(245,158,11,.5);background:rgba(245,158,11,.1)}',
    '.bsmar-vide{display:flex;gap:10px;align-items:center;color:var(--text-2);font-size:14px;padding:4px 2px;margin:0}.bsmar-vide svg{flex:none;color:var(--accent-text)}',
    '.bsmar-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}',
    '.bsmar-kpi{display:flex;gap:10px;align-items:flex-start;padding:14px;border-radius:14px;background:var(--surface);border:1px solid var(--border)}.bsmar-kpi>div{min-width:0}',
    '.bsmar-kic{flex:none;width:32px;height:32px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;background:rgb(var(--accent-rgb)/.12);color:var(--accent-text)}',
    '.bsmar-kpi b{display:block;font-size:22px;letter-spacing:-.02em;line-height:1.15}.bsmar-kpi span{display:block;font-size:13px;color:var(--text-2);font-weight:600}.bsmar-kpi small{display:block;font-size:12px;color:var(--text-3);margin-top:2px}',
    '.bsmar-conseils{margin:0;padding:0 18px 0 36px;display:flex;flex-direction:column;gap:6px;font-size:14px;line-height:1.5;color:var(--text-2)}.bsmar-conseils b{color:var(--text)}',
    '.bsmar-table td small{display:block;font-size:11.5px;color:var(--text-3);font-weight:500}.bsmar-table td b{font-weight:650}',
    '.bsmar-bar{display:inline-block;vertical-align:middle;width:60px;height:6px;border-radius:999px;background:var(--surface-2);margin-right:8px;overflow:hidden}.bsmar-bar i{display:block;height:100%;background:var(--accent);border-radius:999px}',
    '.bsmar-hyp{display:flex;flex-wrap:wrap;gap:8px 18px;align-items:center;font-size:13px;color:var(--text-2);margin-top:12px}.bsmar-hyp label{display:inline-flex;gap:6px;align-items:center}.bsmar-hyp .input{width:90px;padding:4px 8px;height:30px}',
    '.bsmar-note{font-size:12px;color:var(--text-3);margin-top:8px}.bsmar-plus{margin-top:8px}',
    '.bsmar-filtres{display:flex;flex-direction:column;gap:2px;margin-bottom:6px}.bsmar-filtres .bsmar-chips{margin-top:8px}',
    '.bsmar-liste{display:flex;flex-direction:column}',
    '.bsmar-crea{display:flex;gap:10px 16px;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:10px 0;border-top:1px solid var(--border)}.bsmar-crea:first-child{border-top:0}',
    '.bsmar-crea-t{flex:1 1 300px;min-width:0}.bsmar-crea-t b{display:block;font-size:14.5px}.bsmar-crea-t span{display:block;font-size:12.5px;color:var(--text-3)}.bsmar-crea-t p{margin:3px 0 0;font-size:13px;color:var(--text-2);line-height:1.4}',
    '.bsmar-tag{display:inline-block;margin-top:4px;font-style:normal;font-size:11.5px;font-weight:700;border-radius:999px;padding:1px 8px;background:rgb(var(--accent-rgb)/.12);color:var(--accent-text)}',
    '.bsmar-crea-a{display:flex;gap:6px;flex-wrap:wrap}',
    '@media (max-width:640px){.bsmar-card>*:not(.card-head):not(.table-wrap){margin-left:12px;margin-right:12px}.bsmar-kpi b{font-size:19px}}',
  ].join('');
  function css() { if (document.getElementById('bsmar-css')) return; var s = document.createElement('style'); s.id = 'bsmar-css'; s.textContent = CSS; document.head.appendChild(s); }

  function monter(el) {
    if (!el) return;
    css();
    el.classList.add('bsmar');
    if (!ui.zone) ui.zone = zoneParDefaut();
    if (el === racine && el.__bsMar) { rendre(); return; }
    racine = el; el.__bsMar = true;
    brancher(el);
    rendre();
  }

  window.bsMarche = { monter: monter, _interne: { creation: creation, secteurDe: secteurDe, calculer: calculer, resoudreZone: resoudreZone } };
})();
