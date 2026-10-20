/* Blackstart CRM : Marketing › « Sources & ROI ».
 *
 * D'où viennent les prospects (champ « source » de la fiche : site internet, générateur de leads, LinkedIn,
 * recommandation…), combien deviennent des rendez-vous puis des clients, combien ils rapportent (factures
 * payées du CRM) et, avec le budget mensuel saisi pour chaque source, le coût par lead, le coût par client
 * et le retour sur investissement. Filtre de période.
 */
(function () {
  'use strict';
  if (window.bsSources || !window.bsMarketing) return;
  var M = window.bsMarketing, esc = M.esc;

  var SOURCES_CRM = ['Site internet', 'Générateur de leads', 'Cold calling', 'Réseau Orange Pro', 'LinkedIn', 'Terrain', 'Recommandation', 'Partenaire'];
  var PERIODES = { '30': '30 derniers jours', '90': '3 derniers mois', annee: 'Cette année', '12m': '12 derniers mois', tout: 'Depuis le début' };
  var S = { periode: '90', msg: null };

  function nomSource(p) { return String(p.canal || '').trim() || 'Non renseignée'; }
  function debutPeriode() {
    var a = M.auj();
    if (S.periode === '30') return M.plusJours(a, -29);
    if (S.periode === '90') return M.plusJours(a, -89);
    if (S.periode === 'annee') return a.slice(0, 4) + '-01-01';
    if (S.periode === '12m') return M.plusJours(a, -364);
    var min = a; M.prospects().forEach(function (p) { var c = String(p.createdAt || '').slice(0, 10); if (c && c < min) min = c; });
    return min;
  }
  function moisDans(debut) { return Math.max(1, Math.round(M.ecart(debut, M.auj()) / 30.44 * 10) / 10); }
  function client(p) { return p.statut === 'client_signe' || !!p.signedAt; }
  function rdv(p) { return client(p) || (M.ETAPE[p.statut] || 0) >= 1; }
  function htFacture(f) {
    var s = 0; (f.lignes || []).forEach(function (l) { s += (Number(l.quantite) || 0) * (Number(l.prixUnitaire) || 0); });
    return s * (1 - Math.min(100, Math.max(0, Number(f.remise) || 0)) / 100);
  }
  function budgets() { var o = {}; M.actifs(M.data().budgets).forEach(function (b) { o[String(b.id).toLowerCase()] = Number(b.mensuel) || 0; }); return o; }
  function calculer() {
    var debut = debutPeriode(), fin = M.auj(), mois = moisDans(debut), bud = budgets();
    var par = {}, ordre = [];
    function ligne(nom) {
      var k = nom.toLowerCase();
      if (!par[k]) { par[k] = { nom: nom, leads: 0, rdv: 0, clients: 0, ca: 0, mrr: 0, budget: bud[k] || 0 }; ordre.push(k); }
      return par[k];
    }
    SOURCES_CRM.forEach(ligne);
    var source = {};
    M.prospects().forEach(function (p) {
      var l = ligne(nomSource(p)); source[p.id] = l;
      if (p.statut === 'client_signe') l.mrr += Number(p.mrrValue) || 0;
      var c = String(p.createdAt || '').slice(0, 10);
      if (!c || c < debut || c > fin) return;
      l.leads++;
      if (rdv(p)) l.rdv++;
      if (client(p)) l.clients++;
    });
    (M.etat().factures || []).forEach(function (f) {
      if (f.statut !== 'payee' || !f.prospectId || !source[f.prospectId]) return;
      var d = String(f.datePaiement || f.dateEmission || '').slice(0, 10);
      if (d && d >= debut && d <= fin) source[f.prospectId].ca += htFacture(f);
    });
    var lignes = ordre.map(function (k) { var l = par[k]; l.depense = l.budget * mois; return l; })
      .filter(function (l) { return l.leads || l.ca || l.budget || l.mrr || SOURCES_CRM.indexOf(l.nom) >= 0; })
      .sort(function (a, b) { return b.leads - a.leads || b.ca - a.ca || a.nom.localeCompare(b.nom, 'fr'); });
    var tot = { leads: 0, rdv: 0, clients: 0, ca: 0, mrr: 0, depense: 0 };
    lignes.forEach(function (l) { Object.keys(tot).forEach(function (k) { tot[k] += l[k]; }); });
    return { debut: debut, mois: mois, lignes: lignes, tot: tot };
  }
  function pct(a, b) { return b ? Math.round(a / b * 100) + ' %' : '—'; }
  function cout(d, n) { return d && n ? M.euros(d / n) : '—'; }
  function roi(ca, d) { return d ? Math.round((ca - d) / d * 100) + ' %' : '—'; }
  function tendance() {
    var mois = [], a = new Date(M.auj() + 'T12:00:00');
    for (var i = 5; i >= 0; i--) { var d = new Date(a.getFullYear(), a.getMonth() - i, 15); mois.push(d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2)); }
    var n = {}, c = {}; mois.forEach(function (m) { n[m] = 0; c[m] = 0; });
    M.prospects().forEach(function (p) { var m = String(p.createdAt || '').slice(0, 7); if (m in n) { n[m]++; if (client(p)) c[m]++; } });
    var max = Math.max.apply(null, mois.map(function (m) { return n[m]; }).concat([1]));
    return '<div class="bssr-tend">' + mois.map(function (m) {
      return '<div class="bssr-col" title="' + n[m] + ' leads, ' + c[m] + ' clients"><div class="bssr-barres"><i style="height:' + Math.round(n[m] / max * 100) + '%"></i><b style="height:' + Math.round(c[m] / max * 100) + '%"></b></div>' +
        '<small>' + esc(new Date(m + '-15T12:00:00').toLocaleDateString('fr-FR', { month: 'short' })) + '</small><span>' + n[m] + '</span></div>';
    }).join('') + '</div><div class="bsmk-act" style="margin-top:6px"><small><i class="bssr-leg"></i> leads créés</small><small><i class="bssr-leg c"></i> devenus clients</small></div>';
  }
  var CSS = '.bssr-tend{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;align-items:end;height:150px}' +
    '.bssr-col{display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;min-width:0}.bssr-col small{font-size:12px;color:var(--text-3)}.bssr-col span{font-size:12px;font-weight:700;color:var(--text-2)}' +
    '.bssr-barres{flex:1;width:100%;max-width:46px;position:relative;display:flex;align-items:flex-end;justify-content:center}' +
    '.bssr-barres i{display:block;width:100%;border-radius:6px 6px 2px 2px;background:var(--accent);opacity:.35;min-height:2px}.bssr-barres b{position:absolute;bottom:0;left:25%;width:50%;border-radius:4px 4px 2px 2px;background:var(--accent)}' +
    '.bssr-leg{display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--accent);opacity:.35;margin-right:4px;vertical-align:-1px}.bssr-leg.c{opacity:1}' +
    '.bssr-bud{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}.bssr-bud label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:var(--text-2)}';
  function rendre(el) {
    if (!document.getElementById('bssr-css')) { var s = document.createElement('style'); s.id = 'bssr-css'; s.textContent = CSS; document.head.appendChild(s); }
    var r = calculer(), t = r.tot, bud = budgets();
    var meilleure = r.lignes.filter(function (l) { return l.leads >= 3; }).sort(function (a, b) { return (b.clients / b.leads) - (a.clients / a.leads) || b.clients - a.clients; })[0];
    var h = M.tete('Sources & ROI', 'D’où viennent vos clients, combien ils coûtent et combien ils rapportent.',
      '<select class="input select" name="periode" aria-label="Période">' + Object.keys(PERIODES).map(function (k) { return '<option value="' + k + '"' + (S.periode === k ? ' selected' : '') + '>' + PERIODES[k] + '</option>'; }).join('') + '</select>') + M.message(S.msg);
    h += '<div class="bsmk-kpis">' + [['Nouveaux prospects', t.leads, 'depuis le ' + M.dateFr(r.debut, { day: 'numeric', month: 'long', year: 'numeric' })], ['Rendez-vous', t.rdv, pct(t.rdv, t.leads) + ' des prospects'],
      ['Clients', t.clients, pct(t.clients, t.leads) + ' des prospects'], ['Encaissé (HT)', M.euros(t.ca), t.depense ? 'ROI ' + roi(t.ca, t.depense) : 'factures payées']].map(function (k) { return M.kpi(k[0], k[1], k[2]); }).join('') + '</div>';
    if (meilleure && meilleure.clients) h += '<div class="bsmk-msg ok">Meilleure source sur la période : <b>' + esc(meilleure.nom) + '</b>, ' + pct(meilleure.clients, meilleure.leads) + ' des prospects deviennent clients' + (meilleure.depense ? ', pour ' + cout(meilleure.depense, meilleure.clients) + ' par client' : '') + '.</div>';
    var maxL = Math.max.apply(null, r.lignes.map(function (l) { return l.leads; }).concat([1]));
    h += '<section class="card bsmk-card"><header class="card-head"><div><h3 class="card-title">Par source</h3><p class="card-sub">La source est celle de la fiche du prospect. Dépense = budget mensuel × ' + String(r.mois).replace('.', ',') + ' mois.</p></div></header>' +
      '<div class="bsmk-scroll"><table class="bsmk-tbl"><thead><tr><th>Source</th><th>Prospects</th><th></th><th>RDV</th><th>Clients</th><th>Conversion</th><th>Encaissé</th><th>Abonnements</th><th>Dépense</th><th>Coût / prospect</th><th>Coût / client</th><th>ROI</th></tr></thead><tbody>' +
      r.lignes.map(function (l) {
        return '<tr><td><b>' + esc(l.nom) + '</b></td><td>' + l.leads + '</td><td><div class="bsmk-bar"><i style="width:' + Math.round(l.leads / maxL * 100) + '%"></i></div></td><td>' + l.rdv + '</td><td>' + l.clients + '</td><td>' + pct(l.clients, l.leads) + '</td>' +
          '<td>' + M.euros(l.ca) + '</td><td>' + (l.mrr ? M.euros(l.mrr) + '/mois' : '—') + '</td><td>' + (l.depense ? M.euros(l.depense) : '—') + '</td><td>' + cout(l.depense, l.leads) + '</td><td>' + cout(l.depense, l.clients) + '</td><td>' + roi(l.ca, l.depense) + '</td></tr>';
      }).join('') +
      '<tr><td><b>Total</b></td><td><b>' + t.leads + '</b></td><td></td><td><b>' + t.rdv + '</b></td><td><b>' + t.clients + '</b></td><td><b>' + pct(t.clients, t.leads) + '</b></td><td><b>' + M.euros(t.ca) + '</b></td><td><b>' + (t.mrr ? M.euros(t.mrr) + '/mois' : '—') + '</b></td><td><b>' + (t.depense ? M.euros(t.depense) : '—') + '</b></td><td><b>' + cout(t.depense, t.leads) + '</b></td><td><b>' + cout(t.depense, t.clients) + '</b></td><td><b>' + roi(t.ca, t.depense) + '</b></td></tr>' +
      '</tbody></table></div></section>';
    h += '<section class="card bsmk-card"><header class="card-head"><div><h3 class="card-title">Prospects des 6 derniers mois</h3></div></header>' + tendance() + '</section>';
    h += '<section class="card bsmk-card"><header class="card-head"><div><h3 class="card-title">Budget mensuel par source</h3><p class="card-sub">Ce que vous dépensez chaque mois (publicité, abonnement, fichier, temps passé si vous le chiffrez). Enregistré pour toute l’équipe.</p></div></header>' +
      '<div class="bssr-bud">' + r.lignes.map(function (l) {
        return '<label>' + esc(l.nom) + '<input class="input" type="number" min="0" step="10" inputmode="decimal" data-budget="' + esc(l.nom) + '" value="' + (bud[l.nom.toLowerCase()] || '') + '" placeholder="0 €"></label>';
      }).join('') + '</div><p class="bsmk-vide" style="margin-top:10px">Astuce : renseignez la source sur chaque fiche prospect (champ « Source ») pour des chiffres justes.</p></section>';
    el.innerHTML = h;
  }
  function brancher(el, dessiner) {
    el.addEventListener('change', function (ev) {
      var t = ev.target;
      if (t.name === 'periode') { S.periode = t.value; dessiner(true); return; }
      var src = t.getAttribute('data-budget');
      if (src) {
        var v = Math.max(0, Number(String(t.value).replace(',', '.')) || 0);
        M.majElement('budgets', src.toLowerCase(), { source: src, mensuel: v });
        S.msg = { k: 'ok', t: 'Budget « ' + src + ' » enregistré : ' + M.euros(v) + ' par mois.' };
      }
    });
  }
  var P = M.page(rendre, brancher);
  window.bsSources = { monter: P.monter, _calculer: calculer };
})();
