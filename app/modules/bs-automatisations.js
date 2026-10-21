/* Blackstart CRM : rubrique « Automatisations ».
 *
 * Des règles « quand… alors… » qui font le travail répétitif pour toute l'équipe : file d'appels des nouveaux
 * leads, préparation des rendez-vous, relance des propositions et des devis, mise en route des nouveaux clients,
 * prospects oubliés, factures en retard, clients sans nouvelles. Plus, pour chacun, le briefing du matin préparé
 * par l'assistant IA.
 *
 * Les réglages et l'historique sont rangés avec les données du CRM (clé « automatisations » du magasin), donc
 * partagés par l'équipe : { regles: { id: { actif, jours } }, faits: { clé: date }, journal: [...] }.
 * Chaque navigateur ouvert fait tourner les règles. Les tâches créées ont un identifiant tiré de la règle et de
 * sa cible, et chaque exécution est notée dans « faits » : deux navigateurs qui font la même chose écrivent la
 * même chose, et la fusion du serveur n'en garde qu'une.
 * Seuls les administrateurs changent les règles.
 */
(function () {
  'use strict';
  if (window.bsAutomatisations) return;

  var CONF = window.BS_SERVER && typeof window.BS_SERVER === 'object' ? window.BS_SERVER : null;
  var USER = CONF && CONF.user ? CONF.user : null;
  var MINUTES_PAR_ACTION = 3;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function deux(n) { return (n < 10 ? '0' : '') + n; }
  function jour(d) { d = d || new Date(); return d.getFullYear() + '-' + deux(d.getMonth() + 1) + '-' + deux(d.getDate()); }
  function plus(iso, n) { var d = new Date(String(iso).slice(0, 10) + 'T12:00:00'); d.setDate(d.getDate() + (Number(n) || 0)); return jour(d); }
  function ecart(a, b) { return Math.round((new Date(String(b).slice(0, 10) + 'T12:00:00') - new Date(String(a).slice(0, 10) + 'T12:00:00')) / 86400000); }
  function semaine(iso) { var d = new Date(String(iso).slice(0, 10) + 'T12:00:00'); var j = (d.getDay() + 6) % 7; d.setDate(d.getDate() - j); return jour(d); }
  function heure() { var n = new Date(); return deux(n.getHours()) + ':' + deux(n.getMinutes()); }
  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36); }
  function dateFr(iso) { try { return new Date(String(iso).slice(0, 10) + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }); } catch (e) { return iso; } }
  function ic(name, size) {
    var hs = window.__bsHs ? window.__bsHs() : null;
    var inner = (window.bsIcones && window.bsIcones.svg(name)) || (hs && hs[name]) || '';
    return '<svg class="ic" width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }

  function R() { return window.__bsStore || null; }
  function etat() { var r = R(); return r && r.get ? r.get() : {}; }
  function config() { var a = etat().automatisations; return a && typeof a === 'object' && !Array.isArray(a) ? a : {}; }
  var FERMES = ['client_signe', 'perdu', 'resilie'];
  function actif(p) { return p && !p.supprime && FERMES.indexOf(p.statut) < 0 && !p.nePlusContacter; }
  // Dernière trace d'activité sur un prospect (appel, événement), en date AAAA-MM-JJ.
  function derniere(p) {
    var d = p.createdAt || '';
    (p.callLog || []).forEach(function (c) { if (c.date > d) d = c.date; });
    (p.events || []).forEach(function (e) { if (e.date && e.date > d) d = e.date; });
    return d;
  }

  // ---------------------------------------------------------------- règles
  // Chaque règle : soit « transition » (un prospect change de statut), soit « balayage » (vérifiée régulièrement).
  // Elle renvoie des opérations : { cle, texte, prospectId, tache?, relance?, patch?, note? }.
  var REGLES = [
    { id: 'nouveau_lead', groupe: 'Prospection', icone: 'user-plus', titre: 'Nouveau lead → appel le jour même', defaut: true,
      desc: 'Chaque prospect ajouté (site internet, générateur de leads, LinkedIn, import) sans relance prévue entre dans la file d’appels du jour.',
      balayage: function (c) {
        return c.prospects.filter(function (p) { return actif(p) && p.statut === 'a_appeler' && !p.prochaineRelance && p.createdAt && ecart(p.createdAt, c.auj) <= 2; })
          .map(function (p) { return { cle: 'nouveau_lead:' + p.id, prospectId: p.id, relance: { date: c.auj }, texte: 'Mis dans la file d’appels du jour' }; });
      } },
    { id: 'oubli', groupe: 'Prospection', icone: 'alarm-clock', titre: 'Prospect oublié → retour dans la file d’appels', defaut: true, jours: 21, unite: 'jours sans activité',
      desc: 'Un prospect en cours sans relance prévue et sans activité depuis ce délai revient dans la file d’appels du jour.',
      balayage: function (c, j) {
        return c.prospects.filter(function (p) { var d = derniere(p); return actif(p) && !p.prochaineRelance && d && ecart(d, c.auj) >= j; })
          .map(function (p) { return { cle: 'oubli:' + p.id + ':' + semaine(c.auj), prospectId: p.id, relance: { date: c.auj }, texte: 'Sans nouvelles depuis ' + ecart(derniere(p), c.auj) + ' jours : remis dans la file d’appels' }; });
      } },
    { id: 'injoignable_froid', groupe: 'Prospection', icone: 'phone-off', titre: 'Injoignable plusieurs fois → prospect froid, rappel dans 30 jours', defaut: false, jours: 3, unite: 'appels sans réponse de suite',
      desc: 'Après ce nombre d’appels sans réponse d’affilée, le prospect passe en « Froid » et sera rappelé dans 30 jours, pour laisser la place aux autres.',
      balayage: function (c, n) {
        return c.prospects.filter(function (p) {
          var l = p.callLog || [];
          return actif(p) && p.priorite !== 'basse' && l.length >= n && l.slice(0, n).every(function (x) { return x.outcome === 'injoignable'; });
        }).map(function (p) { return { cle: 'injoignable_froid:' + p.id + ':' + (p.callLog || []).length, prospectId: p.id, patch: { priorite: 'basse' }, relance: { date: plus(c.auj, 30) }, texte: n + ' appels sans réponse : passé en froid, rappel le ' + dateFr(plus(c.auj, 30)) }; });
      } },
    { id: 'rdv_preparer', groupe: 'Ventes', icone: 'calendar-check', titre: 'RDV pris → tâche « Préparer le rendez-vous »', defaut: true,
      desc: 'Dès qu’un rendez-vous est obtenu, une tâche de préparation est créée pour le jour du rendez-vous (ou demain s’il n’est pas daté).',
      transition: 'rdv_pris',
      action: function (c, p) {
        var d = p.prochaineRelance && p.prochaineRelance >= c.auj ? p.prochaineRelance : plus(c.auj, 1);
        return [{ cle: 'rdv_preparer:' + p.id + ':' + c.auj, prospectId: p.id, tache: { titre: 'Préparer le rendez-vous : ' + p.entreprise, due: d, heure: '' }, texte: 'Tâche « Préparer le rendez-vous » le ' + dateFr(d) }];
      } },
    { id: 'proposition_relance', groupe: 'Ventes', icone: 'send', titre: 'Proposition envoyée → relance programmée', defaut: true, jours: 3, unite: 'jours après l’envoi',
      desc: 'Quand une proposition part, la relance du prospect est programmée automatiquement, avec une tâche pour la faire.',
      transition: 'proposition_envoyee',
      action: function (c, p, j) {
        var d = plus(c.auj, j);
        return [{ cle: 'proposition_relance:' + p.id + ':' + c.auj, prospectId: p.id, relance: { date: d }, tache: { titre: 'Relancer la proposition : ' + p.entreprise, due: d, heure: '' }, texte: 'Relance de la proposition programmée le ' + dateFr(d) }];
      } },
    { id: 'devis_relance', groupe: 'Ventes', icone: 'file-text', titre: 'Devis sans réponse → tâche de relance', defaut: true, jours: 5, unite: 'jours après l’envoi',
      desc: 'Un devis envoyé, ni accepté ni refusé après ce délai, crée une tâche de relance (une fois par devis).',
      balayage: function (c, j) {
        return c.devis.filter(function (d) { return d && d.statut === 'envoye' && d.dateCreation && ecart(d.dateCreation, c.auj) >= j; })
          .map(function (d) { return { cle: 'devis_relance:' + d.id, prospectId: d.prospectId || null, tache: { titre: 'Relancer le devis ' + (d.numero || '') + (d.clientNom ? ' : ' + d.clientNom : ''), due: c.auj, heure: '' }, texte: 'Devis ' + (d.numero || '') + ' sans réponse depuis ' + ecart(d.dateCreation, c.auj) + ' jours : tâche de relance' }; });
      } },
    { id: 'client_lancement', groupe: 'Clients & production', icone: 'rocket', titre: 'Client signé → check-list de mise en route', defaut: true,
      desc: 'À la signature, les étapes de mise en route sont créées en tâches datées : lancement, accès, paramétrage, formation, mise en service, point de satisfaction.',
      transition: 'client_signe',
      action: function (c, p) {
        var etapes = [[1, 'Réunion de lancement'], [2, 'Collecter les accès et les données'], [7, 'Paramétrer le CRM et les automatisations'], [12, 'Former l’équipe du client'], [14, 'Recette et mise en service'], [30, 'Point de satisfaction (et demande d’avis)']];
        return etapes.map(function (e, i) {
          return { cle: 'client_lancement:' + p.id + ':' + i, prospectId: p.id, tache: { titre: e[1] + ' : ' + p.entreprise, due: plus(c.auj, e[0]), heure: '' }, texte: i ? '' : 'Check-list de mise en route créée (6 tâches)' };
        });
      } },
    { id: 'client_nouvelles', groupe: 'Clients & production', icone: 'heart-handshake', titre: 'Client sans nouvelles → prendre des nouvelles', defaut: true, jours: 30, unite: 'jours sans contact',
      desc: 'Un client actif sans contact depuis ce délai crée une tâche pour prendre de ses nouvelles : moins de résiliations, plus de recommandations.',
      balayage: function (c, j) {
        return c.prospects.filter(function (p) { var d = derniere(p) || p.signedAt; return p.statut === 'client_signe' && !p.supprime && d && ecart(d, c.auj) >= j; })
          .map(function (p) { return { cle: 'client_nouvelles:' + p.id + ':' + c.auj.slice(0, 7), prospectId: p.id, tache: { titre: 'Prendre des nouvelles : ' + p.entreprise, due: c.auj, heure: '' }, texte: 'Client sans contact depuis ' + ecart(derniere(p) || p.signedAt, c.auj) + ' jours : tâche créée' }; });
      } },
    { id: 'facture_retard', groupe: 'Facturation', icone: 'receipt', titre: 'Facture en retard → tâche de relance chaque semaine', defaut: true,
      desc: 'Une facture à payer dont l’échéance est passée crée une tâche de relance, une fois par semaine jusqu’au paiement.',
      balayage: function (c) {
        return c.factures.filter(function (f) { return f && f.statut === 'a_payer' && f.dateEcheance && f.dateEcheance < c.auj; })
          .map(function (f) { return { cle: 'facture_retard:' + f.id + ':' + semaine(c.auj), prospectId: f.prospectId || null, tache: { titre: 'Relancer la facture ' + (f.numero || '') + (f.clientNom ? ' : ' + f.clientNom : ''), due: c.auj, heure: '' }, texte: 'Facture ' + (f.numero || '') + ' en retard de ' + ecart(f.dateEcheance, c.auj) + ' jours : tâche de relance' }; });
      } },
  ];
  function regle(id) { return REGLES.filter(function (r) { return r.id === id; })[0] || null; }
  function reglage(r) {
    var x = (config().regles || {})[r.id] || {};
    return { actif: x.actif != null ? !!x.actif : r.defaut, jours: r.jours ? Math.max(1, Math.min(365, Number(x.jours) || r.jours)) : null };
  }

  // ---------------------------------------------------------------- moteur
  function appliquer(ops, regleId) {
    var r = R(); if (!r || !r.set || !ops.length) return 0;
    var faits = config().faits || {};
    ops = ops.filter(function (o) { return o && o.cle && !faits[o.cle]; });
    if (!ops.length) return 0;
    var auj = jour(), t = heure();
    r.set(function (s) {
      var a = Object.assign({}, s.automatisations && typeof s.automatisations === 'object' ? s.automatisations : {});
      var f = Object.assign({}, a.faits || {});
      var journal = (Array.isArray(a.journal) ? a.journal : []).slice();
      var taches = (s.tasks || []).slice(), ids = {};
      taches.forEach(function (x) { ids[x.id] = 1; });
      var parP = {};
      ops.forEach(function (o) {
        if (f[o.cle]) return;
        f[o.cle] = auj;
        var nomR = (regle(o.regle || regleId) || {}).titre || '';
        if (o.tache) {
          var id = 'auto-' + hash(o.cle);
          if (!ids[id]) { ids[id] = 1; taches.unshift({ id: id, title: o.tache.titre, prospectId: o.prospectId || null, due: o.tache.due || auj, heure: o.tache.heure || '', priorite: '', notes: 'Créée par l’automatisation « ' + nomR + ' ».', done: false, createdAt: auj }); }
        }
        if (o.prospectId && (o.relance || o.patch || o.texte)) {
          var q = parP[o.prospectId] || (parP[o.prospectId] = { patch: {}, events: [] });
          if (o.patch) Object.assign(q.patch, o.patch);
          if (o.relance) { q.patch.prochaineRelance = o.relance.date; q.patch.prochaineRelanceHeure = o.relance.heure || ''; }
          if (o.texte) q.events.push({ id: 'auto-ev-' + hash(o.cle), ts: new Date().toISOString(), date: auj, time: t, type: o.relance ? 'relance' : 'note', text: o.texte + ' (automatisation)' });
        }
        if (o.texte) journal.unshift({ id: 'j-' + hash(o.cle), at: new Date().toISOString(), regle: o.regle || regleId, texte: o.texte, prospectId: o.prospectId || null });
      });
      // Les traces de plus de 120 jours sont oubliées.
      var limite = plus(auj, -120);
      Object.keys(f).forEach(function (k) { if (f[k] < limite) delete f[k]; });
      a.faits = f; a.journal = journal.slice(0, 300);
      var out = { automatisations: a, tasks: taches };
      if (Object.keys(parP).length) {
        out.prospects = (s.prospects || []).map(function (p) {
          var q = parP[p.id]; if (!q) return p;
          var ev = q.events.filter(function (e) { return !(p.events || []).some(function (x) { return x.id === e.id; }); });
          return Object.assign({}, p, q.patch, { events: ev.concat(p.events || []).slice(0, 200) });
        });
      }
      return out;
    });
    return ops.length;
  }
  function contexteRegles() {
    var s = etat();
    return { auj: jour(), prospects: (s.prospects || []).filter(function (p) { return p && !p.supprime; }), devis: s.devisList || [], factures: s.factures || [] };
  }
  function balayer() {
    var s = etat(); if (!s.loaded || !(s.prospects || []).length) return;
    var c = contexteRegles(), ops = [];
    REGLES.forEach(function (r) {
      var g = reglage(r); if (!g.actif || !r.balayage) return;
      try { r.balayage(c, g.jours).forEach(function (o) { o.regle = r.id; ops.push(o); }); } catch (e) { /* une règle en erreur n'arrête pas les autres */ }
    });
    appliquer(ops);
  }
  var avant = null;
  function surChangement(s) {
    if (!s || !s.loaded) return;
    var map = {};
    (s.prospects || []).forEach(function (p) { map[p.id] = p.statut; });
    if (avant) {
      var c = contexteRegles(), ops = [];
      (s.prospects || []).forEach(function (p) {
        var prec = avant[p.id];
        if (!prec || prec === p.statut) return;
        REGLES.forEach(function (r) {
          if (r.transition !== p.statut) return;
          var g = reglage(r); if (!g.actif) return;
          try { r.action(c, p, g.jours).forEach(function (o) { o.regle = r.id; ops.push(o); }); } catch (e) { /* idem */ }
        });
      });
      if (ops.length) setTimeout(function () { appliquer(ops); }, 0);
    }
    avant = map;
  }
  var demarre = false, minuteurBalayage = 0;
  function demarrer() {
    if (demarre) return;
    var r = R();
    if (!r || !r.get || !r.get().loaded) { setTimeout(demarrer, 1000); return; }
    demarre = true;
    surChangement(r.get());
    if (r.subscribe) r.subscribe(function (s) {
      if (s.prospects === dernierVu) return;
      dernierVu = s.prospects;
      surChangement(s);
      clearTimeout(minuteurBalayage); minuteurBalayage = setTimeout(balayer, 4000);
    });
    setTimeout(balayer, 3000);
    setInterval(balayer, 10 * 60 * 1000);
    setTimeout(briefing, 6000);
  }
  var dernierVu = null;

  // ---------------------------------------------------------------- briefing du matin (personnel, avec Claude)
  var CLE_BRIEFING = 'bs-auto-briefing-' + (USER ? USER.id : 'local');
  function briefingActif() { try { return localStorage.getItem(CLE_BRIEFING) === 'on'; } catch (e) { return false; } }
  function briefing() {
    if (!briefingActif() || !window.bsAssistants) return;
    var fait = ''; try { fait = localStorage.getItem(CLE_BRIEFING + '-jour') || ''; } catch (e) { /* facultatif */ }
    if (fait === jour() || new Date().getHours() < 5) return;
    window.bsAssistants.charger().then(function (l) {
      var a = (l || []).filter(function (x) { return x.id === 'membre'; })[0];
      if (!a || !window.bsAssistants.ia()) return;
      var m = (a.competences || []).filter(function (x) { return x.id === 'journee'; })[0];
      if (!m) return;
      try { localStorage.setItem(CLE_BRIEFING + '-jour', jour()); } catch (e) { /* facultatif */ }
      window.bsAssistants.envoyer('membre', m.consigne, m);
    });
  }

  // ---------------------------------------------------------------- page
  var UI = { racine: null };
  function estAdmin() { return !CONF || (USER && USER.role === 'admin'); }
  function majRegle(id, patch) {
    var r = R(); if (!r || !r.set) return;
    r.set(function (s) {
      var a = Object.assign({}, s.automatisations && typeof s.automatisations === 'object' ? s.automatisations : {});
      var rg = Object.assign({}, a.regles || {});
      var x = regle(id), cur = reglage(x);
      rg[id] = Object.assign({ actif: cur.actif, jours: cur.jours }, rg[id] || {}, patch);
      a.regles = rg;
      return { automatisations: a };
    });
    setTimeout(balayer, 300);
  }
  function ilya(iso) {
    var t = Date.parse(iso); if (isNaN(t)) return '';
    var s = (Date.now() - t) / 1000;
    if (s < 60) return 'à l’instant'; if (s < 3600) return 'il y a ' + Math.floor(s / 60) + ' min'; if (s < 86400) return 'il y a ' + Math.floor(s / 3600) + ' h';
    return new Date(t).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }
  function dessiner() {
    var el = UI.racine; if (!el || !el.isConnected) return;
    var cfg = config(), journal = Array.isArray(cfg.journal) ? cfg.journal : [], admin = estAdmin();
    var auj = jour(), lundi = semaine(auj);
    var semaineN = journal.filter(function (j) { return String(j.at).slice(0, 10) >= lundi; }).length;
    var actives = REGLES.filter(function (r) { return reglage(r).actif; }).length;
    var parRegle = {};
    journal.forEach(function (j) { var x = parRegle[j.regle] || (parRegle[j.regle] = { n: 0, dernier: j.at }); x.n++; });
    var groupes = [];
    REGLES.forEach(function (r) { if (groupes.indexOf(r.groupe) < 0) groupes.push(r.groupe); });
    var ps = etat().prospects || [];
    var nomP = function (id) { var p = ps.filter(function (x) { return x.id === id; })[0]; return p ? (p.entreprise || p.contact) : ''; };
    var bri = briefingActif();
    el.innerHTML = '<div class="bsau">' +
      '<header class="bsau-tete"><div><h1>Automatisations</h1><p>Le CRM fait le travail répétitif pour toute l’équipe : chaque règle active s’applique toute seule et note ce qu’elle a fait.</p></div></header>' +
      '<div class="bsau-chiffres"><div><b>' + actives + ' / ' + REGLES.length + '</b><span>règles actives</span></div><div><b>' + semaineN + '</b><span>actions automatiques cette semaine</span></div><div><b>≈ ' + Math.round(semaineN * MINUTES_PAR_ACTION) + ' min</b><span>de travail évité cette semaine</span></div></div>' +
      (admin ? '' : '<p class="bsau-note">' + ic('info', 15) + 'Seuls les administrateurs peuvent changer les règles.</p>') +
      '<div class="bsau-corps"><div class="bsau-regles">' + groupes.map(function (g) {
        return '<h2>' + esc(g) + '</h2>' + REGLES.filter(function (r) { return r.groupe === g; }).map(function (r) {
          var x = reglage(r), st = parRegle[r.id];
          return '<article class="bsau-regle' + (x.actif ? ' on' : '') + '"><span class="bsau-ic">' + ic(r.icone, 18) + '</span><div class="bsau-t"><b>' + esc(r.titre) + '</b><p>' + esc(r.desc) + '</p>' +
            (r.jours ? '<label class="bsau-param">Délai <input type="number" min="1" max="365" value="' + x.jours + '" data-jours="' + r.id + '"' + (admin ? '' : ' disabled') + '> ' + esc(r.unite) + '</label>' : '') +
            '<small>' + (st ? st.n + ' fois · dernière ' + esc(ilya(st.dernier)) : 'Pas encore utilisée') + '</small></div>' +
            '<label class="bsau-switch" title="' + (x.actif ? 'Désactiver' : 'Activer') + '"><input type="checkbox" data-regle="' + r.id + '"' + (x.actif ? ' checked' : '') + (admin ? '' : ' disabled') + ' aria-label="' + esc(r.titre) + '"><i></i></label></article>';
        }).join('');
      }).join('') +
      '<h2>Avec l’IA</h2>' +
      '<article class="bsau-regle' + (bri ? ' on' : '') + '"><span class="bsau-ic ia">' + ic('sparkles', 18) + '</span><div class="bsau-t"><b>Briefing du matin par votre assistant IA</b><p>Chaque jour, à la première ouverture du CRM, l’assistant prépare votre journée : appels par priorité, relances et tâches à appliquer d’un clic. Réglage personnel ; il faut que Claude soit branché.</p><small>Le briefing s’affiche dans l’assistant de la page Aujourd’hui.</small></div>' +
      '<label class="bsau-switch"><input type="checkbox" data-briefing' + (bri ? ' checked' : '') + ' aria-label="Briefing du matin"><i></i></label></article>' +
      '<a class="bsau-lien" href="#/assistants">' + ic('bot', 18) + '<span><b>Employés IA</b><small>48 compétences métier en un clic : préparer la journée, revue du pipeline, relancer les impayés, planifier un nouveau client…</small></span>' + ic('chevron-right', 16) + '</a>' +
      '<a class="bsau-lien" href="#/campagnes">' + ic('megaphone', 18) + '<span><b>Séquences d’e-mails</b><small>Les relances par e-mail à J+3, J+7… se règlent dans Campagnes.</small></span>' + ic('chevron-right', 16) + '</a>' +
      '</div><aside class="bsau-journal"><h2>Historique</h2>' + (journal.length ? '<ul>' + journal.slice(0, 40).map(function (j) {
        var r = regle(j.regle);
        return '<li><button type="button"' + (j.prospectId ? ' data-fiche="' + esc(j.prospectId) + '"' : '') + '><span class="bsau-ic petit">' + ic(r ? r.icone : 'zap', 14) + '</span><span class="bsau-jt"><b>' + esc(j.texte) + '</b><small>' + esc([nomP(j.prospectId), ilya(j.at)].filter(Boolean).join(' · ')) + '</small></span></button></li>';
      }).join('') + '</ul>' : '<p class="bsau-vide">Les actions faites par les automatisations apparaîtront ici.</p>') + '</aside></div></div>';
  }
  function monter(el) {
    if (!el) return;
    css();
    if (el === UI.racine && el.__bsau) { dessiner(); return; }
    UI.racine = el; el.__bsau = true;
    el.addEventListener('change', function (ev) {
      var t = ev.target;
      if (t.dataset.regle) { majRegle(t.dataset.regle, { actif: t.checked }); return; }
      if (t.dataset.jours) { majRegle(t.dataset.jours, { jours: Math.max(1, Math.min(365, Number(t.value) || 1)) }); return; }
      if (t.hasAttribute('data-briefing')) { try { localStorage.setItem(CLE_BRIEFING, t.checked ? 'on' : 'off'); } catch (e) { /* facultatif */ } dessiner(); if (t.checked) briefing(); }
    });
    el.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-fiche]'); if (!b) return;
      var Y = window.__bsY; if (Y && Y.set) Y.set(function (s) { return { overlays: (s.overlays || []).concat([{ key: 'bsau' + Date.now(), type: 'prospect', id: b.dataset.fiche }]) }; });
    });
    var r = R();
    if (r && r.subscribe) {
      var vu = null;
      var sub = r.subscribe(function (s) {
        if (!UI.racine || !UI.racine.isConnected) { if (typeof sub === 'function') sub(); return; }
        if (s.automatisations === vu) return;
        vu = s.automatisations;
        var actifEl = document.activeElement;
        if (actifEl && actifEl.dataset && actifEl.dataset.jours && UI.racine.contains(actifEl)) return;
        dessiner();
      });
    }
    dessiner();
  }

  var cssFait = false;
  function css() {
    if (cssFait) return; cssFait = true;
    var st = document.createElement('style'); st.id = 'bs-automatisations-css';
    st.textContent = [
      '.bsau{display:flex;flex-direction:column;gap:18px}',
      '.bsau-tete h1{margin:0;font-size:1.9em;font-weight:800;letter-spacing:-.02em}',
      '.bsau-tete p{margin:6px 0 0;color:var(--text-2);max-width:760px}',
      '.bsau-chiffres{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}',
      '.bsau-chiffres div{display:flex;flex-direction:column;gap:2px;padding:16px;border-radius:16px;border:1px solid var(--border);background:var(--surface)}',
      '.bsau-chiffres b{font-size:1.7em;font-weight:800;letter-spacing:-.02em}',
      '.bsau-chiffres span{font-size:.86em;color:var(--text-2)}',
      '.bsau-note{display:flex;align-items:center;gap:8px;margin:0;color:var(--text-2);font-size:.9em}',
      '.bsau-corps{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,360px);gap:20px;align-items:start}',
      '.bsau-regles{display:flex;flex-direction:column;gap:10px;min-width:0}',
      '.bsau h2{margin:10px 0 2px;font-size:.78em;font-weight:750;text-transform:uppercase;letter-spacing:.08em;color:var(--text-3)}',
      '.bsau-regles h2:first-child{margin-top:0}',
      '.bsau-regle{display:flex;align-items:flex-start;gap:14px;padding:16px;border-radius:16px;border:1px solid var(--border);background:var(--surface);transition:border-color .15s}',
      '.bsau-regle.on{border-color:rgb(var(--accent-rgb)/.45)}',
      '.bsau-ic{flex:none;width:38px;height:38px;border-radius:11px;display:grid;place-items:center;color:var(--text-2);background:var(--surface-2);border:1px solid var(--border)}',
      '.bsau-regle.on .bsau-ic{color:#fff;border-color:transparent;background:linear-gradient(145deg,rgb(var(--accent-rgb)),rgb(var(--accent-rgb)/.7))}',
      '.bsau-regle.on .bsau-ic.ia{background:linear-gradient(145deg,#8b5cf6,#6d28d9)}',
      '.bsau-ic.petit{width:28px;height:28px;border-radius:8px}',
      '.bsau-t{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}',
      '.bsau-t b{font-size:.98em;font-weight:700}',
      '.bsau-t p{margin:0;font-size:.86em;color:var(--text-2);line-height:1.45}',
      '.bsau-t small{font-size:.78em;color:var(--text-3)}',
      '.bsau-param{display:inline-flex;align-items:center;gap:6px;font-size:.84em;color:var(--text-2)}',
      '.bsau-param input{width:62px;height:30px;padding:0 8px;border-radius:8px;border:1px solid var(--border-2);background:var(--surface-2);color:var(--text);font:inherit}',
      '.bsau-switch{flex:none;position:relative;width:44px;height:26px;cursor:pointer}',
      '.bsau-switch input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}',
      '.bsau-switch i{position:absolute;inset:0;border-radius:999px;background:var(--surface-3);border:1px solid var(--border-2);transition:background .2s}',
      '.bsau-switch i::after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgb(0 0 0/.3);transition:transform .2s}',
      '.bsau-switch input:checked+i{background:rgb(var(--accent-rgb));border-color:transparent}',
      '.bsau-switch input:checked+i::after{transform:translateX(18px)}',
      '.bsau-switch input:disabled+i{opacity:.5}',
      '.bsau-switch input:focus-visible+i{box-shadow:0 0 0 3px rgb(var(--accent-rgb)/.35)}',
      '.bsau-lien{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:14px;border:1px dashed var(--border-2);color:var(--text);text-decoration:none}',
      '.bsau-lien:hover{border-color:rgb(var(--accent-rgb)/.6)}',
      '.bsau-lien span{flex:1;display:flex;flex-direction:column;gap:2px}',
      '.bsau-lien small{font-size:.84em;color:var(--text-2)}',
      '.bsau-journal{position:sticky;top:12px;padding:16px;border-radius:16px;border:1px solid var(--border);background:var(--surface);max-height:calc(100vh - 140px);overflow:auto}',
      '.bsau-journal h2{margin-top:0}',
      '.bsau-journal ul{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column}',
      '.bsau-journal button{display:flex;align-items:flex-start;gap:10px;width:100%;padding:8px 4px;border:0;border-radius:10px;background:none;color:var(--text);font:inherit;text-align:left;cursor:default}',
      '.bsau-journal button[data-fiche]{cursor:pointer}.bsau-journal button[data-fiche]:hover{background:var(--surface-2)}',
      '.bsau-jt{display:flex;flex-direction:column;gap:2px;min-width:0}',
      '.bsau-jt b{font-size:.86em;font-weight:600;line-height:1.35}',
      '.bsau-jt small{font-size:.76em;color:var(--text-3)}',
      '.bsau-vide{margin:8px 0 0;color:var(--text-3);font-size:.88em}',
      '@media (max-width:1000px){.bsau-corps{grid-template-columns:minmax(0,1fr)}.bsau-journal{position:static;max-height:none}}',
      '@media (max-width:640px){.bsau-chiffres{grid-template-columns:1fr}.bsau-regle{padding:14px}}',
    ].join('\n');
    document.head.appendChild(st);
  }

  window.bsAutomatisations = { monter: monter, regles: REGLES, balayer: balayer, demarrer: demarrer, etat: function () { return config(); } };
  // Les règles tournent dès que le CRM a chargé ses données, sur toutes les pages.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})();
