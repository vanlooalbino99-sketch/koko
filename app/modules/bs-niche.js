/* Blackstart CRM : « Suivi de ma niche » (Rapports).
 *
 * - On définit son client idéal : secteurs, métiers, zone (villes, codes postaux ou départements) et taille.
 *   Il est rangé dans les réglages du CRM (settings.clientIdeal) : partagé avec l'équipe en version serveur.
 * - Le rapport suit la niche de bout en bout : prospects, contactés, RDV, clients signés, abonnements, et compare
 *   la conversion de la niche au reste des prospects ; un tableau donne les mêmes résultats par secteur et par
 *   métier (étiquette posée par le générateur de leads), pour voir quelle niche marche le mieux.
 * - « Générer des leads dans ma niche » ouvre le générateur réglé sur ce client idéal.
 * La rubrique Rapports appelle window.bsNiche.monter(élément) ; sans ce module, elle s'affiche sans ce suivi.
 */
(function () {
  'use strict';
  if (window.bsNiche) return;

  var CONTACTES = ['injoignable', 'rdv_pris', 'audit_realise', 'proposition_envoyee', 'client_signe', 'resilie', 'perdu'];
  var RDV = ['rdv_pris', 'audit_realise', 'proposition_envoyee', 'client_signe', 'resilie'];
  var CLIENTS = ['client_signe', 'resilie'];
  var PERIODES = [['tout', 'Tout'], ['6m', '6 mois'], ['30j', '30 jours']];
  var MIN_ECHANTILLON = 5;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ic(name, size) {
    var p = window.bsIcones && window.bsIcones.svg ? window.bsIcones.svg(name) : '';
    return '<svg width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (p || '<circle cx="12" cy="12" r="8"/>') + '</svg>';
  }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
  function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }
  function euro(v) { return Math.round(v || 0).toLocaleString('fr-FR') + ' €'; }
  function plural(n, one, many) { return n + ' ' + (n > 1 ? (many || one + 's') : one); }
  function secteurs() { return (window.bsLeads && window.bsLeads.SECTEURS) || []; }
  function metierById(id) {
    var out = null;
    secteurs().forEach(function (s) { s.metiers.forEach(function (m) { if (m.id === id) out = { metier: m, secteur: s }; }); });
    return out;
  }
  function store() { return window.__bsStore ? window.__bsStore.get() : { prospects: [], settings: {} }; }
  function readIdeal() {
    var c = (store().settings || {}).clientIdeal;
    if (!c || typeof c !== 'object') return null;
    return {
      secteurs: Array.isArray(c.secteurs) ? c.secteurs.filter(Boolean) : [],
      metiers: Array.isArray(c.metiers) ? c.metiers.filter(Boolean) : [],
      zones: Array.isArray(c.zones) ? c.zones.filter(Boolean) : [],
      taille: c.taille || 'toutes',
    };
  }
  function saveIdeal(ideal) {
    window.__bsStore.set(function (s) { return { settings: Object.assign({}, s.settings, { clientIdeal: ideal }) }; });
  }
  function idealVide(c) { return !c || (!c.secteurs.length && !c.metiers.length && !c.zones.length); }

  // ------------------------------------------------------------------ calculs
  function codePostal(p) { var m = String(p.adresse || '').match(/\b(\d{5})\b/) || String(p.ville || '').match(/\b(\d{5})\b/); return m ? m[1] : ''; }
  function dansZone(p, zones) {
    if (!zones.length) return true;
    var cp = codePostal(p), v = norm(p.ville);
    return zones.some(function (z) {
      var zn = norm(z);
      if (!zn) return false;
      if (/^\d{5}$/.test(zn)) return cp === zn;
      if (/^(\d{2,3}|2a|2b)$/.test(zn)) return !!cp && cp.indexOf(/^2[ab]$/.test(zn) ? '20' : zn) === 0;
      return !!v && (v === zn || v.indexOf(zn + ' ') === 0);
    });
  }
  function metierDe(p) {
    var tags = (p.tags || []).map(norm), out = '';
    secteurs().forEach(function (s) { s.metiers.forEach(function (m) { if (!out && tags.indexOf(norm(m.label)) >= 0) out = m.id; }); });
    return out;
  }
  function dansNiche(p, c) {
    if (idealVide(c)) return false;
    var mt = c.metiers.length ? metierDe(p) : '';
    // Un métier choisi précise son secteur : une fiche de ce secteur sans métier connu reste dans la niche.
    var secteursOk = c.secteurs.concat(c.metiers.map(function (id) { var x = metierById(id); return x ? x.secteur.id : ''; }));
    if (secteursOk.length && secteursOk.indexOf(p.secteur) < 0) return false;
    if (c.metiers.length && mt && c.metiers.indexOf(mt) < 0) return false;
    return dansZone(p, c.zones);
  }
  function contacte(p) { return CONTACTES.indexOf(p.statut) >= 0 || (p.callLog || []).length > 0; }
  function bilan(list) {
    var b = { n: list.length, contactes: 0, rdv: 0, clients: 0, actifs: 0, mrr: 0, ca: 0, generes: 0 };
    list.forEach(function (p) {
      if (contacte(p)) b.contactes++;
      if (RDV.indexOf(p.statut) >= 0) b.rdv++;
      if (CLIENTS.indexOf(p.statut) >= 0) { b.clients++; b.ca += +p.dealValue || 0; }
      if (p.statut === 'client_signe') { b.actifs++; b.mrr += +p.mrrValue || 0; }
      if (window.bsLeads && p.canal === window.bsLeads.CANAL) b.generes++;
    });
    b.conv = pct(b.clients, b.n);
    return b;
  }
  function depuis(periode) {
    if (periode === 'tout') return '';
    var d = new Date();
    if (periode === '30j') d.setDate(d.getDate() - 30); else d.setMonth(d.getMonth() - 6);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  // ------------------------------------------------------------------ affichage
  function monter(root) {
    if (!root || root.getAttribute('data-bsn')) return;
    root.setAttribute('data-bsn', '1');
    ensureCss();
    var ui = { edit: false, periode: 'tout', brouillon: null };
    var timer = 0, unsub = window.__bsStore ? window.__bsStore.subscribe(function () {
      if (!root.isConnected) { if (unsub) unsub(); return; }
      if (ui.edit) return;
      clearTimeout(timer); timer = setTimeout(render, 120);
    }) : null;

    function chips(c) {
      var out = [];
      c.secteurs.forEach(function (s) { out.push(['sect', s]); });
      c.metiers.forEach(function (id) { var x = metierById(id); if (x) out.push(['met', x.metier.label]); });
      c.zones.forEach(function (z) { out.push(['zone', z]); });
      var t = (window.bsLeads && window.bsLeads.TAILLES || []).filter(function (x) { return x.id === c.taille; })[0];
      if (t && t.id !== 'toutes') out.push(['taille', t.label]);
      return out.map(function (x) {
        var icn = { sect: 'briefcase', met: 'wrench', zone: 'map-pin', taille: 'users' }[x[0]];
        return '<span class="bsn-chip">' + ic(icn, 13) + esc(x[1]) + '</span>';
      }).join('');
    }
    function kpi(label, value, sub, icon, tone) {
      return '<div class="kpi"><div class="kpi-top"><span class="kpi-label">' + esc(label) + '</span><span class="kpi-icon tone-' + tone + '">' + ic(icon, 15) + '</span></div>' +
        '<div class="kpi-value">' + value + '</div><div class="kpi-foot"><span class="kpi-sub">' + sub + '</span></div></div>';
    }
    function entonnoir(b, h) {
      var etapes = [['Prospects', b.n, h.n], ['Contactés', b.contactes, h.contactes], ['RDV obtenus', b.rdv, h.rdv], ['Clients signés', b.clients, h.clients]];
      return '<div class="bsn-funnel">' + etapes.map(function (e, i) {
        var w = b.n ? Math.max(2, e[1] / b.n * 100) : 0, wh = h.n ? Math.max(2, e[2] / h.n * 100) : 0;
        var step = i ? pct(e[1], etapes[i - 1][1]) : 100, steph = i ? pct(e[2], etapes[i - 1][2]) : 100;
        return '<div class="bsn-step"><div class="bsn-step-h"><span>' + e[0] + '</span><b>' + e[1] + '</b>' + (i ? '<em>' + step + ' % de l’étape précédente</em>' : '') + '</div>' +
          '<div class="bsn-bar"><i style="width:' + w + '%"></i></div>' +
          (h.n ? '<div class="bsn-bar ref" title="Hors niche : ' + e[2] + (i ? ' (' + steph + ' %)' : '') + '"><i style="width:' + wh + '%"></i></div>' : '') + '</div>';
      }).join('') + '</div>' +
        (h.n ? '<div class="bsn-legend"><span><i></i>Ma niche</span><span><i class="ref"></i>Hors niche (' + h.n + ')</span></div>' : '');
    }
    function tableau(titre, lignes, cibles) {
      if (!lignes.length) return '';
      return '<div class="bsn-table"><h4>' + esc(titre) + '</h4><div class="table-wrap"><table class="table"><thead><tr><th>' + esc(titre.replace(/^Par /, '').replace(/^./, function (c) { return c.toUpperCase(); })) + '</th><th class="num">Prospects</th><th class="num">Contactés</th><th class="num">RDV</th><th class="num">Clients</th><th class="num">Conversion</th><th class="num">Abonnements</th></tr></thead><tbody>' +
        lignes.map(function (l) {
          var cible = cibles.indexOf(l.id) >= 0;
          return '<tr' + (cible ? ' class="cible"' : '') + '><td><span class="bsn-name">' + esc(l.label) + (cible ? '<span class="bsn-tag">Cible</span>' : '') + '</span></td>' +
            '<td class="num">' + l.b.n + '</td><td class="num">' + l.b.contactes + '</td><td class="num">' + l.b.rdv + '</td><td class="num">' + l.b.clients + '</td>' +
            '<td class="num"><span class="bsn-conv"><i style="width:' + Math.min(100, l.b.conv) + '%"></i></span>' + l.b.conv + ' %</td><td class="num">' + (l.b.mrr ? euro(l.b.mrr) + '/m' : '–') + '</td></tr>';
        }).join('') + '</tbody></table></div></div>';
    }
    function editeur() {
      var d = ui.brouillon, ss = secteurs();
      var tailles = (window.bsLeads && window.bsLeads.TAILLES) || [{ id: 'toutes', label: 'Toutes tailles' }];
      var visibles = ss.filter(function (s) { return d.secteurs.indexOf(s.id) >= 0; });
      return '<div class="bsn-edit">' +
        '<div class="field"><span class="field-label">Secteurs</span><div class="bsn-pick">' + ss.map(function (s) {
          var on = d.secteurs.indexOf(s.id) >= 0;
          return '<button type="button" class="bsn-opt' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-sect="' + esc(s.id) + '">' + (on ? ic('check', 13) : '') + esc(s.id) + '</button>';
        }).join('') + '</div></div>' +
        '<div class="field"><span class="field-label">Métiers <span class="field-hint">(facultatif' + (visibles.length ? '' : ' : choisissez d’abord un secteur') + ')</span></span>' +
        (visibles.length ? visibles.map(function (s) {
          return '<div class="bsn-pick sub"><small>' + esc(s.id) + '</small>' + s.metiers.map(function (m) {
            var on = d.metiers.indexOf(m.id) >= 0;
            return '<button type="button" class="bsn-opt sm' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-met="' + esc(m.id) + '">' + (on ? ic('check', 12) : '') + esc(m.label) + '</button>';
          }).join('') + '</div>';
        }).join('') : '') + '</div>' +
        '<div class="bsn-row2"><label class="field"><span class="field-label">Zone</span><input class="input" name="zones" placeholder="Villes, codes postaux ou départements : Lyon, 69, 38" value="' + esc(d.zones.join(', ')) + '"><span class="field-hint">Vide : toute la France.</span></label>' +
        '<label class="field"><span class="field-label">Taille des entreprises</span><span class="select-wrap"><select class="input select" name="taille">' + tailles.map(function (t) { return '<option value="' + t.id + '"' + (d.taille === t.id ? ' selected' : '') + '>' + esc(t.label) + '</option>'; }).join('') + '</select><span class="select-caret">' + ic('chevron-down', 16) + '</span></span><span class="field-hint">Utilisée par le générateur de leads.</span></label></div>' +
        '<div class="bsn-actions"><button type="button" class="btn btn-primary" data-act="save">' + ic('check', 15) + 'Enregistrer mon client idéal</button><button type="button" class="btn btn-ghost" data-act="cancel">Annuler</button></div></div>';
    }

    function render() {
      if (!root.isConnected) return;
      var st = store(), c = readIdeal(), cut = depuis(ui.periode);
      var all = (st.prospects || []).filter(function (p) { return !cut || (p.createdAt || '') >= cut; });
      var vide = idealVide(c);
      var niche = vide ? [] : all.filter(function (p) { return dansNiche(p, c); });
      var hors = vide ? [] : all.filter(function (p) { return !dansNiche(p, c); });
      var b = bilan(niche), h = bilan(hors);

      // Par secteur : tous les secteurs présents (ou ciblés), cibles en tête.
      var cibSect = vide ? [] : c.secteurs.concat(c.metiers.map(function (id) { var x = metierById(id); return x ? x.secteur.id : ''; }));
      var parSect = {};
      all.forEach(function (p) { var k = p.secteur || 'Autre'; (parSect[k] = parSect[k] || []).push(p); });
      cibSect.forEach(function (k) { if (k && !parSect[k]) parSect[k] = []; });
      var lignesSect = Object.keys(parSect).map(function (k) { return { id: k, label: k, b: bilan(parSect[k]) }; })
        .sort(function (x, y) { return (cibSect.indexOf(y.id) >= 0) - (cibSect.indexOf(x.id) >= 0) || y.b.n - x.b.n; });
      // Par métier : d'après l'étiquette posée par le générateur de leads.
      var parMet = {};
      all.forEach(function (p) { var m = metierDe(p); if (m) (parMet[m] = parMet[m] || []).push(p); });
      var cibMet = vide ? [] : c.metiers;
      cibMet.forEach(function (k) { if (!parMet[k]) parMet[k] = []; });
      var lignesMet = Object.keys(parMet).map(function (k) { var x = metierById(k); return { id: k, label: x ? x.metier.label : k, b: bilan(parMet[k]) }; })
        .sort(function (x, y) { return (cibMet.indexOf(y.id) >= 0) - (cibMet.indexOf(x.id) >= 0) || y.b.n - x.b.n; });

      // Ce que disent les chiffres (seulement avec assez de fiches pour que le taux veuille dire quelque chose).
      var notes = [];
      var fiables = lignesSect.filter(function (l) { return l.b.n >= MIN_ECHANTILLON; });
      if (fiables.length > 1) {
        var best = fiables.slice().sort(function (x, y) { return y.b.conv - x.b.conv || y.b.n - x.b.n; })[0];
        if (best.b.clients) notes.push('Meilleure conversion : <b>' + esc(best.label) + '</b>, ' + best.b.clients + ' client' + (best.b.clients > 1 ? 's' : '') + ' sur ' + best.b.n + ' prospects (' + best.b.conv + ' %).' + (cibSect.length && cibSect.indexOf(best.id) < 0 ? ' Ce secteur n’est pas dans votre client idéal.' : ''));
      }
      if (!vide && b.n >= MIN_ECHANTILLON && h.n >= MIN_ECHANTILLON) {
        var hc = pct(h.clients, h.n);
        notes.push(b.conv > hc ? 'Votre niche convertit mieux que le reste : ' + b.conv + ' % contre ' + hc + ' %.' : b.conv < hc ? 'Votre niche convertit moins bien que le reste : ' + b.conv + ' % contre ' + hc + ' %. À surveiller.' : 'Votre niche convertit comme le reste (' + b.conv + ' %).');
      }
      if (!vide && b.n && b.contactes < b.n) notes.push(plural(b.n - b.contactes, 'prospect de la niche reste', 'prospects de la niche restent') + ' à contacter.');
      if (!vide && b.n < MIN_ECHANTILLON && b.n >= 0) notes.push(b.n ? 'Encore peu de fiches dans votre niche (' + b.n + ') : les taux deviendront parlants à partir de ' + MIN_ECHANTILLON + '.' : 'Aucune fiche ne correspond encore à votre client idéal sur cette période.');

      root.innerHTML = '<section class="card bsn-card">' +
        '<header class="card-head"><div class="card-title-wrap"><span class="card-icon">' + ic('target', 15) + '</span><div><h3 class="card-title">Suivi de ma niche</h3><p class="card-sub">Votre client idéal et ses résultats, comparés au reste de vos prospects</p></div></div>' +
        '<div class="card-actions bsn-head-act"><div class="segmented" role="tablist" aria-label="Période">' + PERIODES.map(function (p) {
          return '<button type="button" role="tab" class="seg' + (ui.periode === p[0] ? ' active' : '') + '" aria-selected="' + (ui.periode === p[0]) + '" data-per="' + p[0] + '">' + p[1] + '</button>';
        }).join('') + '</div></div></header>' +
        (ui.edit ? editeur()
          : '<div class="bsn-ideal"><span class="bsn-ideal-l">Client idéal</span>' + (vide ? '<span class="bsn-none">Pas encore défini : choisissez vos secteurs, métiers et zone pour suivre votre niche.</span>' : chips(c)) +
            '<span class="bsn-ideal-act"><button type="button" class="btn btn-secondary btn-sm" data-act="edit">' + ic(vide ? 'plus' : 'pencil', 14) + (vide ? 'Définir mon client idéal' : 'Modifier') + '</button>' +
            (vide ? '' : '<button type="button" class="btn btn-primary btn-sm" data-act="gen">' + ic('sparkles', 14) + 'Générer des leads dans ma niche</button>') + '</span></div>') +
        (vide ? '' :
          '<div class="kpis bsn-kpis">' +
          kpi('Prospects dans la niche', b.n, pct(b.n, all.length) + ' % de vos prospects' + (b.generes ? ' · ' + b.generes + ' générés' : ''), 'users', 'blue') +
          kpi('Contactés', b.contactes, b.n ? pct(b.contactes, b.n) + ' % de la niche' : '–', 'phone', 'cyan') +
          kpi('RDV obtenus', b.rdv, b.contactes ? pct(b.rdv, b.contactes) + ' % des contactés' : '–', 'calendar', 'violet') +
          kpi('Clients signés', b.clients, b.n ? 'Conversion ' + b.conv + ' %' + (h.n ? ' (hors niche ' + pct(h.clients, h.n) + ' %)' : '') : '–', 'star', 'emerald') +
          '</div>' +
          '<div class="bsn-grid"><div class="bsn-block"><h4>Parcours de la niche</h4>' + (b.n ? entonnoir(b, h) : '<p class="bsn-empty">Aucune fiche de votre niche sur cette période.</p>') + '</div>' +
          '<div class="bsn-block"><h4>Ce que disent les chiffres</h4>' + (notes.length ? '<ul class="bsn-notes">' + notes.map(function (n) { return '<li>' + ic('info', 14) + '<span>' + n + '</span></li>'; }).join('') + '</ul>' : '<p class="bsn-empty">Pas encore assez de données.</p>') +
          (b.mrr ? '<p class="bsn-mrr">' + ic('trending-up', 14) + 'Abonnements de la niche : <b>' + euro(b.mrr) + ' / mois</b> (' + plural(b.actifs, 'client actif', 'clients actifs') + ')</p>' : '') + '</div></div>') +
        tableau('Par secteur', lignesSect, cibSect) +
        tableau('Par métier', lignesMet, cibMet) +
        (!lignesMet.length && !ui.edit ? '<p class="bsn-foot">' + ic('info', 13) + '<span>Le suivi par métier se remplit avec les leads ajoutés depuis « Nouveaux leads » (étiquette du métier sur la fiche).</span></p>' : '') +
        '</section>';
    }

    root.addEventListener('click', function (ev) {
      var t = ev.target.closest('button');
      if (!t || !root.contains(t)) return;
      var per = t.getAttribute('data-per'), act = t.getAttribute('data-act'), s = t.getAttribute('data-sect'), m = t.getAttribute('data-met');
      if (per) { ui.periode = per; render(); return; }
      if (s != null && ui.brouillon) {
        var d = ui.brouillon, i = d.secteurs.indexOf(s);
        if (i >= 0) {
          d.secteurs.splice(i, 1);
          var sec = secteurs().filter(function (x) { return x.id === s; })[0];
          if (sec) d.metiers = d.metiers.filter(function (id) { return !sec.metiers.some(function (mm) { return mm.id === id; }); });
        } else d.secteurs.push(s);
        render(); return;
      }
      if (m != null && ui.brouillon) { var k = ui.brouillon.metiers.indexOf(m); if (k >= 0) ui.brouillon.metiers.splice(k, 1); else ui.brouillon.metiers.push(m); render(); return; }
      if (act === 'edit') { var c = readIdeal() || { secteurs: [], metiers: [], zones: [], taille: 'toutes' }; ui.brouillon = JSON.parse(JSON.stringify(c)); ui.edit = true; render(); return; }
      if (act === 'cancel') { ui.edit = false; ui.brouillon = null; render(); return; }
      if (act === 'save') {
        var z = root.querySelector('input[name=zones]'), ta = root.querySelector('select[name=taille]'), dd = ui.brouillon;
        dd.zones = String(z ? z.value : '').split(/[,;]+/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 20);
        dd.taille = ta ? ta.value : 'toutes';
        ui.edit = false; ui.brouillon = null;
        saveIdeal({ secteurs: dd.secteurs, metiers: dd.metiers, zones: dd.zones, taille: dd.taille, majLe: new Date().toISOString().slice(0, 10) });
        render(); return;
      }
      if (act === 'gen') {
        var ci = readIdeal();
        if (!ci || !window.bsLeads) return;
        var met = ci.metiers.map(metierById).filter(Boolean)[0];
        var sect = met ? met.secteur.id : ci.secteurs[0];
        window.bsLeads.cibler({ secteur: sect || undefined, metier: met ? met.metier.id : '', zone: ci.zones[0] || '', rayon: '0', taille: ci.taille || 'toutes' });
      }
    });
    root.addEventListener('input', function (ev) {
      if (ev.target && ev.target.name === 'zones' && ui.brouillon) ui.brouillon.zones = ev.target.value.split(/[,;]+/).map(function (x) { return x.trim(); }).filter(Boolean);
    });
    root.addEventListener('change', function (ev) {
      if (ev.target && ev.target.name === 'taille' && ui.brouillon) ui.brouillon.taille = ev.target.value;
    });
    render();
  }

  var CSS = [
    '.bsn-root{min-width:0}',
    '.bsn-card{display:flex;flex-direction:column;gap:16px;min-width:0}',
    '.bsn-card .card-head{margin-bottom:0;flex-wrap:wrap}',
    '.bsn-ideal{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:12px 14px;border-radius:12px;background:var(--surface-2);border:1px solid var(--border)}',
    '.bsn-ideal-l{font-size:.78em;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin-right:4px}',
    '.bsn-none{font-size:.88em;color:var(--text-2);flex:1;min-width:200px}',
    '.bsn-ideal-act{display:flex;gap:8px;flex-wrap:wrap;margin-left:auto}',
    '.bsn-chip{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 10px;border-radius:999px;font-size:.8em;font-weight:600;background:var(--accent-soft);color:var(--accent-text,var(--accent));max-width:100%}',
    '.bsn-chip svg{flex:none}',
    '.bsn-kpis{margin:0}',
    '.bsn-grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:16px}',
    '.bsn-block{min-width:0}',
    '.bsn-block h4,.bsn-table h4{margin:0 0 10px;font-size:.86em;font-weight:650;color:var(--text-2)}',
    '.bsn-funnel{display:flex;flex-direction:column;gap:12px}',
    '.bsn-step-h{display:flex;align-items:baseline;gap:8px;font-size:.86em;margin-bottom:5px;flex-wrap:wrap}',
    '.bsn-step-h span{color:var(--text-2)}',
    '.bsn-step-h b{font-size:1.05em}',
    '.bsn-step-h em{font-style:normal;font-size:.88em;color:var(--text-3);margin-left:auto}',
    '.bsn-bar{height:10px;border-radius:999px;background:var(--surface-2);overflow:hidden}',
    '.bsn-bar i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--accent),color-mix(in srgb,var(--accent) 70%,#22d3ee));transition:width .5s cubic-bezier(.2,.8,.2,1)}',
    '.bsn-bar.ref{height:5px;margin-top:3px}',
    '.bsn-bar.ref i{background:rgb(var(--text-rgb)/.28)}',
    '.bsn-legend{display:flex;gap:16px;margin-top:10px;font-size:.78em;color:var(--text-3)}',
    '.bsn-legend span{display:inline-flex;align-items:center;gap:6px}',
    '.bsn-legend i{width:14px;height:6px;border-radius:999px;background:var(--accent)}',
    '.bsn-legend i.ref{background:rgb(var(--text-rgb)/.28)}',
    '.bsn-notes{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;font-size:.87em;color:var(--text-2)}',
    '.bsn-notes li{display:flex;gap:8px;align-items:flex-start}',
    '.bsn-notes svg,.bsn-mrr svg,.bsn-foot svg{flex:none;margin-top:2px;color:var(--text-3)}',
    '.bsn-notes b{color:var(--text)}',
    '.bsn-mrr{display:flex;gap:8px;align-items:flex-start;margin:12px 0 0;font-size:.87em;color:var(--text-2)}',
    '.bsn-empty{margin:0;font-size:.86em;color:var(--text-3)}',
    '.bsn-table .table td{padding:9px 12px;border-bottom:1px solid var(--border);white-space:nowrap}',
    '.bsn-table .table tr:last-child td{border-bottom:0}',
    '.bsn-table .table .num{text-align:right}',
    '.bsn-table tr.cible td{background:color-mix(in srgb,var(--accent) 7%,transparent)}',
    '.bsn-name{display:inline-flex;align-items:center;gap:8px;font-weight:600}',
    '.bsn-tag{font-size:.72em;font-weight:700;padding:2px 7px;border-radius:999px;background:var(--accent);color:#fff}',
    '.bsn-conv{display:inline-block;width:46px;height:5px;border-radius:999px;background:var(--surface-3);overflow:hidden;margin-right:8px;vertical-align:middle}',
    '.bsn-conv i{display:block;height:100%;background:#10b981}',
    '.bsn-foot{display:flex;gap:8px;align-items:flex-start;margin:0;font-size:.8em;color:var(--text-3)}',
    '.bsn-edit{display:flex;flex-direction:column;gap:16px;padding:14px;border-radius:12px;border:1px solid var(--border);background:var(--surface-2)}',
    '.bsn-pick{display:flex;flex-wrap:wrap;gap:6px;align-items:center}',
    '.bsn-pick.sub{margin-top:6px}',
    '.bsn-pick small{width:100%;font-size:.76em;color:var(--text-3);font-weight:600}',
    '.bsn-opt{display:inline-flex;align-items:center;gap:5px;height:32px;padding:0 12px;border-radius:999px;border:1px solid var(--border);background:var(--surface);color:var(--text-2);font-weight:600;font-size:.84em;transition:background-color .15s,color .15s,border-color .15s}',
    '.bsn-opt.sm{height:28px;font-size:.8em;padding:0 10px}',
    '.bsn-opt:hover{color:var(--text);border-color:rgb(var(--text-rgb)/.28)}',
    '.bsn-opt.on{background:var(--accent);border-color:var(--accent);color:#fff}',
    '.bsn-row2{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:12px}',
    '.bsn-actions{display:flex;gap:8px;flex-wrap:wrap}',
    '@media (max-width:900px){.bsn-grid{grid-template-columns:1fr}}',
    '@media (max-width:560px){.bsn-row2{grid-template-columns:1fr}.bsn-ideal-act{margin-left:0;width:100%}.bsn-ideal-act .btn{flex:1;justify-content:center}.bsn-head-act{width:100%}.bsn-step-h em{margin-left:0;width:100%}}',
  ].join('\n');
  function ensureCss() {
    if (document.getElementById('bs-niche-css')) return;
    var s = document.createElement('style'); s.id = 'bs-niche-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  window.bsNiche = { monter: monter, _interne: { dansNiche: dansNiche, dansZone: dansZone, bilan: bilan } };
})();
