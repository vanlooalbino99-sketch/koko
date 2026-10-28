/* Blackstart CRM : l'équipe d'assistants IA (Claude).
 *
 * Assistant de l'équipe, CEO, VP Sales, Directeur de production, Chasseur de leads, Marketing, Finance, Clients :
 * le serveur (/api/ia/assistants) donne la liste de ceux ouverts au membre connecté ; un administrateur les voit
 * tous et choisit qui a accès à chacun.
 * - panneau(el, o) : la carte « Assistant IA » de la page Aujourd'hui (choix de l'assistant, conversation).
 * - contexte() : l'état du CRM envoyé à Claude avec la question. Chiffres, entreprises, statuts, montants, dates ;
 *   jamais les noms, téléphones ni e-mails des contacts.
 * Les conversations restent dans ce navigateur (une par assistant et par membre).
 */
(function () {
  'use strict';
  if (window.bsAssistants) return;

  var CONF = window.BS_SERVER && typeof window.BS_SERVER === 'object' ? window.BS_SERVER : null;
  var USER = CONF && CONF.user ? CONF.user : null;
  var API = '/api/ia';
  var MAX_MSG = 40;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function deux(n) { return (n < 10 ? '0' : '') + n; }
  function jour(d) { d = d || new Date(); return d.getFullYear() + '-' + deux(d.getMonth() + 1) + '-' + deux(d.getDate()); }
  function euros(n) { return (Number(n) || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }); }
  var EXTRA = {
    'ia-send': '<path d="M3.7 3.2 21 12 3.7 20.8a.5.5 0 0 1-.7-.6L5.6 12 3 3.8a.5.5 0 0 1 .7-.6Z"/><path d="M5.6 12H12"/>',
    'chev-down': '<path d="m6 9 6 6 6-6"/>',
  };
  function ic(name, size) {
    var pl = window.bsIcones && window.bsIcones.plein && window.bsIcones.plein(name);
    var hs = window.__bsHs ? window.__bsHs() : null;
    var inner = pl || EXTRA[name] || (window.bsIcones && window.bsIcones.svg(name)) || (hs && hs[name]) || '';
    return '<svg class="ic" width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }
  function api(method, path, body) {
    return fetch(API + path, { method: method, credentials: 'same-origin', headers: Object.assign({ 'X-Requested-With': 'blackstart' }, body ? { 'Content-Type': 'application/json' } : {}), body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { if (!r.ok) { var e = new Error(b.error || 'Le serveur ne répond pas : réessayez.'); e.code = b.code; e.status = r.status; throw e; } return b; }); });
  }
  function prenom() {
    var n = (USER && USER.name) || '';
    if (!n) { var s = etat(); n = ((s.companyInfo || {}).expediteur || '').split(/[\s—-]/)[0]; }
    return String(n).trim().split(/\s+/)[0] || '';
  }

  // ---------------------------------------------------------------- état du CRM pour Claude
  function etat() { var r = window.__bsStore; return r && r.get ? r.get() : {}; }
  var STATUTS = { a_appeler: 'À appeler', injoignable: 'Injoignable', rdv_pris: 'RDV pris', audit_realise: 'Audit réalisé', proposition_envoyee: 'Proposition envoyée', client_signe: 'Client actif', resilie: 'Résilié', perdu: 'Perdu' };
  var FERMES = ['client_signe', 'perdu', 'resilie'];
  function appels(ps, du, au) {
    var n = 0, joints = 0, rdv = 0;
    ps.forEach(function (p) { (p.callLog || []).forEach(function (c) { if (c.date >= du && c.date <= au) { n++; if (c.outcome !== 'injoignable') joints++; if (c.outcome === 'rdv_pris') rdv++; } }); });
    return { n: n, joints: joints, rdv: rdv };
  }
  // refs : « P3 » → identifiant du prospect, pour les actions proposées par l'assistant.
  function contexteComplet() {
    var s = etat(), ps = (s.prospects || []).filter(function (p) { return p && !p.supprime; }), t = jour(), lignes = [];
    var refs = {}, refDe = {}, nRef = 0;
    function ref(p) { if (!refDe[p.id]) { nRef++; refDe[p.id] = 'P' + nRef; refs['P' + nRef] = p.id; } return '[' + refDe[p.id] + '] '; }
    var d7 = new Date(); d7.setDate(d7.getDate() - 6); d7 = jour(d7);
    var d30 = new Date(); d30.setDate(d30.getDate() - 29); d30 = jour(d30);
    var parStatut = {};
    ps.forEach(function (p) { parStatut[p.statut] = (parStatut[p.statut] || 0) + 1; });
    var aAppeler = ps.filter(function (p) { return p.prochaineRelance && p.prochaineRelance <= t && FERMES.indexOf(p.statut) < 0 && !p.nePlusContacter; });
    var retard = aAppeler.filter(function (p) { return p.prochaineRelance < t; });
    var a1 = appels(ps, t, t), a7 = appels(ps, d7, t), a30 = appels(ps, d30, t);
    var clients = ps.filter(function (p) { return p.statut === 'client_signe'; });
    var mrr = clients.reduce(function (x, p) { return x + (Number(p.mrrValue) || 0); }, 0);
    var st = s.settings || {};
    lignes.push('Date : ' + new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    if (s.companyInfo && s.companyInfo.nom) lignes.push('Entreprise : ' + s.companyInfo.nom);
    lignes.push('Prospects : ' + ps.length + ' (' + Object.keys(parStatut).map(function (k) { return (STATUTS[k] || k) + ' ' + parStatut[k]; }).join(', ') + ')');
    lignes.push('Appels prévus aujourd’hui : ' + aAppeler.length + ', dont ' + retard.length + ' en retard');
    lignes.push('Appels aujourd’hui : ' + a1.n + ' (' + a1.joints + ' joints, ' + a1.rdv + ' RDV) ; 7 derniers jours : ' + a7.n + ' (' + a7.joints + ' joints, ' + a7.rdv + ' RDV) ; 30 jours : ' + a30.n + ' (' + a30.joints + ' joints, ' + a30.rdv + ' RDV)');
    lignes.push('Objectifs : ' + (st.targetCallsWeek || 0) + ' appels et ' + (st.targetRdvWeek || 0) + ' RDV par semaine, ' + euros(st.targetCaMonth) + ' signés par mois, MRR visé ' + euros(st.targetMrr));
    lignes.push('Clients actifs : ' + clients.length + ', MRR ' + euros(mrr));
    var nouveaux = ps.filter(function (p) { return p.createdAt && p.createdAt >= d7; }).length;
    lignes.push('Nouveaux prospects sur 7 jours : ' + nouveaux);
    var secteurs = {};
    ps.forEach(function (p) { if (p.secteur) secteurs[p.secteur] = (secteurs[p.secteur] || 0) + 1; });
    // Sources des prospects (champ « canal ») et combien sont devenus clients, pour le ROI des sources.
    var sources = {};
    ps.forEach(function (p) { var k = String(p.canal || '').trim(); if (!k) return; var x = sources[k] || (sources[k] = { n: 0, c: 0 }); x.n++; if (p.statut === 'client_signe') x.c++; });
    if (Object.keys(sources).length) lignes.push('Sources des prospects : ' + Object.keys(sources).sort(function (a, b) { return sources[b].n - sources[a].n; }).slice(0, 10).map(function (k) { return k + ' ' + sources[k].n + ' (' + sources[k].c + ' clients)'; }).join(', '));
    lignes.push('Secteurs : ' + Object.keys(secteurs).sort(function (a, b) { return secteurs[b] - secteurs[a]; }).slice(0, 8).map(function (k) { return k + ' ' + secteurs[k]; }).join(', '));
    // Affaires en cours (entreprise, secteur, ville, statut, valeur, relance, dernier appel), sans les contacts.
    var enCours = ps.filter(function (p) { return FERMES.indexOf(p.statut) < 0; }).sort(function (a, b) { return String(a.prochaineRelance || '9999').localeCompare(String(b.prochaineRelance || '9999')); }).slice(0, 40);
    if (enCours.length) {
      lignes.push('Affaires en cours (40 au plus, relance la plus proche d’abord) :');
      enCours.forEach(function (p) {
        var dernier = (p.callLog || [])[0];
        lignes.push('- ' + ref(p) + [p.entreprise, p.secteur, p.ville].filter(Boolean).join(' · ') + ' | ' + (STATUTS[p.statut] || p.statut) +
          (p.priorite ? ' | priorité ' + p.priorite : '') + (p.dealValue ? ' | ' + euros(p.dealValue) : '') +
          (p.prochaineRelance ? ' | relance ' + p.prochaineRelance + (p.prochaineRelance < t ? ' (en retard)' : '') : '') +
          (dernier ? ' | dernier appel ' + dernier.date + ' : ' + (STATUTS[dernier.outcome] || dernier.outcome) : ''));
      });
    }
    if (clients.length) {
      lignes.push('Clients actifs (25 au plus, les plus récents d’abord) :');
      clients.slice().sort(function (a, b) { return String(b.signedAt || '').localeCompare(String(a.signedAt || '')); }).slice(0, 25).forEach(function (p) {
        var dernier = (p.callLog || [])[0];
        lignes.push('- ' + ref(p) + [p.entreprise, p.secteur, p.ville].filter(Boolean).join(' · ') + (p.signedAt ? ' | client depuis ' + p.signedAt : '') +
          (p.mrrValue ? ' | ' + euros(p.mrrValue) + ' par mois' : '') + (dernier ? ' | dernier appel ' + dernier.date : ' | aucun appel noté'));
      });
    }
    var fact = (s.factures || []).filter(function (f) { return f && f.statut === 'a_payer'; });
    if (fact.length) {
      lignes.push('Factures à payer : ' + fact.length);
      fact.slice(0, 15).forEach(function (f) {
        var p = ps.filter(function (x) { return x.id === f.prospectId; })[0];
        lignes.push('- ' + (f.numero || 'Facture') + (p ? ' · ' + ref(p) + p.entreprise : '') + (f.echeance ? ' · échéance ' + f.echeance : '') + (f.date ? ' · émise le ' + f.date : ''));
      });
    }
    var taches = (s.tasks || []).filter(function (x) { return x && !x.done && x.due && x.due <= t; });
    if (taches.length) lignes.push('Tâches à faire aujourd’hui ou en retard : ' + taches.slice(0, 12).map(function (x) { return x.title; }).join(' ; '));
    return { texte: lignes.join('\n').slice(0, 29000), refs: refs };
  }
  function contexte() { return contexteComplet().texte; }

  // ---------------------------------------------------------------- liste et conversations
  var S = { liste: null, ia: null, charge: null, err: '', conv: {}, envoi: {}, choisi: null };
  var cleConv = 'bs-assistants-conv-' + (USER ? USER.id : 'local');
  try { S.conv = JSON.parse(localStorage.getItem(cleConv) || '{}') || {}; } catch (e) { S.conv = {}; }
  try { S.choisi = localStorage.getItem('bs-assistants-choisi') || null; } catch (e) { /* facultatif */ }
  function garder() { try { localStorage.setItem(cleConv, JSON.stringify(S.conv)); } catch (e) { /* facultatif */ } }
  var abonnes = [];
  function prevenir() { abonnes = abonnes.filter(function (f) { return f(); }); }
  function charger(force) {
    if (!CONF) { S.liste = []; S.ia = false; return Promise.resolve(S.liste); }
    if (S.charge && !force) return S.charge;
    S.charge = api('GET', '/assistants').then(function (b) { S.liste = b.assistants || []; S.ia = !!b.ia; S.err = ''; prevenir(); return S.liste; })
      .catch(function (e) { S.liste = S.liste || []; S.err = e.message; S.charge = null; prevenir(); return S.liste; });
    return S.charge;
  }
  function assistant(id) { return (S.liste || []).filter(function (a) { return a.id === id; })[0] || null; }
  function messages(id) { return S.conv[id] || (S.conv[id] = []); }
  // comp : la compétence lancée ({ id, titre }), dont le serveur met la méthode en avant.
  function envoyer(id, texte, comp) {
    texte = String(texte || '').trim();
    if (!texte || S.envoi[id]) return;
    var l = messages(id);
    l.push(Object.assign({ de: 'moi', texte: texte, at: Date.now() }, comp ? { comp: { id: comp.id, titre: comp.titre } } : {}));
    if (l.length > MAX_MSG) l.splice(0, l.length - MAX_MSG);
    garder();
    if (!CONF) { l.push({ de: 'ia', texte: 'L’assistant IA fonctionne avec la version en ligne du CRM (connexion de l’équipe).', at: Date.now(), info: true }); garder(); prevenir(); return; }
    S.envoi[id] = true; prevenir();
    var ctx = contexteComplet();
    api('POST', '/assistants/' + encodeURIComponent(id), { messages: l.filter(function (m) { return !m.info; }).map(function (m) { return { de: m.de, texte: m.texte + resumeActions(m) }; }), contexte: ctx.texte, competence: comp ? comp.id : undefined, langue: window.bsLangue ? window.bsLangue.langue : undefined })
      .then(function (b) { l.push({ de: 'ia', texte: b.texte || '…', at: Date.now(), actions: Array.isArray(b.actions) ? b.actions : [], refs: ctx.refs }); })
      .catch(function (e) {
        var t = e.code === 'SANS_CLE'
          ? (USER && USER.role === 'admin' ? 'Claude n’est pas encore branché. Collez votre clé Claude dans Simulations IA (lien « Clé Claude »), puis reposez votre question.' : 'Claude n’est pas encore branché : demandez à un administrateur de coller la clé Claude dans Simulations IA.')
          : e.message;
        l.push({ de: 'ia', texte: t, at: Date.now(), info: true });
      })
      .then(function () { S.envoi[id] = false; garder(); prevenir(); });
  }
  function effacer(id) { S.conv[id] = []; garder(); prevenir(); }

  // ---------------------------------------------------------------- actions proposées (les « employés IA »)
  var STATUT_LABEL = { a_appeler: 'À appeler', injoignable: 'Injoignable', rdv_pris: 'RDV pris', audit_realise: 'Audit réalisé', proposition_envoyee: 'Proposition envoyée', client_signe: 'Client actif', perdu: 'Perdu' };
  var CANAL_LABEL = { email: 'e-mail', sms: 'SMS', linkedin: 'LinkedIn', whatsapp: 'WhatsApp', appel: 'script d’appel' };
  function prospectDe(m, a) { var id = a.prospect && m.refs ? m.refs[a.prospect] : null; return id ? (etat().prospects || []).filter(function (p) { return p.id === id; })[0] || null : null; }
  function dateCourte(d, h) { if (!d) return h || ''; try { return new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) + (h ? ' à ' + h : ''); } catch (e) { return d; } }
  // Ce que l'assistant avait proposé, rappelé dans l'historique envoyé à Claude.
  function resumeActions(m) {
    if (!m.actions || !m.actions.length) return '';
    return '\n(Actions proposées : ' + m.actions.map(function (a) { return a.type + (a.prospect ? ' ' + a.prospect : '') + (a.titre ? ' « ' + a.titre + ' »' : '') + (a.fait ? ' [appliquée]' : ''); }).join(' ; ') + ')';
  }
  function decrire(m, a) {
    var p = prospectDe(m, a), ent = p ? (p.entreprise || p.contact) : '';
    switch (a.type) {
      case 'tache': return { i: 'list-checks', t: 'Tâche : ' + (a.titre || 'sans titre'), d: [dateCourte(a.date, a.heure), ent].filter(Boolean).join(' · ') };
      case 'relance': return { i: 'calendar-check', t: 'Relance : ' + (ent || '?'), d: dateCourte(a.date, a.heure) || 'Date à choisir', manque: !p || !a.date };
      case 'statut': return { i: 'activity', t: 'Statut : ' + (ent || '?') + ' → ' + (STATUT_LABEL[a.statut] || '?'), d: '', manque: !p || !a.statut };
      case 'note': return { i: 'sticky-note', t: 'Note sur ' + (ent || '?'), d: a.texte.slice(0, 160) + (a.texte.length > 160 ? '…' : ''), manque: !p || !a.texte };
      case 'email': return { i: 'mail', t: 'E-mail à ' + (ent || '?') + (a.objet ? ' : ' + a.objet : ''), d: a.texte.slice(0, 160) + (a.texte.length > 160 ? '…' : ''), manque: !p, mail: true };
      case 'modele': return { i: 'library', t: 'Modèle ' + (CANAL_LABEL[a.canal] || 'de message') + ' : ' + (a.titre || 'sans titre'), d: a.texte.slice(0, 160) + (a.texte.length > 160 ? '…' : ''), manque: !a.texte };
    }
    return { i: 'circle', t: a.type, d: '', manque: true };
  }
  function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
  function heureNow() { var n = new Date(); return deux(n.getHours()) + ':' + deux(n.getMinutes()); }
  function evenement(pid, type, texte) {
    var r = window.__bsStore; if (!r || !r.set) return;
    var ev = { id: uid(), ts: new Date().toISOString(), date: jour(), time: heureNow(), type: type, text: texte };
    r.set(function (s) { return { prospects: (s.prospects || []).map(function (x) { return x.id === pid ? Object.assign({}, x, { events: [ev].concat(x.events || []).slice(0, 200), updatedAt: jour() }) : x; }) }; });
  }
  function toast(t, tone) {
    var Y = window.__bsY; if (!Y || !Y.set) return;
    var x = { id: uid(), message: t, tone: tone || 'success', action: null, actionLabel: 'Annuler' };
    Y.set(function (s) { return { toasts: (s.toasts || []).slice(-2).concat([x]) }; });
    setTimeout(function () { Y.set(function (s) { return { toasts: (s.toasts || []).filter(function (y) { return y.id !== x.id; }) }; }); }, 2800);
  }
  function remplir(txt, p) {
    var c = String(p.contact || '').trim(), pre = /^(m\.|mme|mlle|dr|me|pr)\b/i.test(c) ? c : c.split(/\s+/)[0];
    var moi = (USER && USER.name) || ((etat().companyInfo || {}).expediteur) || '';
    return String(txt || '').replace(/\{\{\s*prenom\s*\}\}/gi, pre || '').replace(/\{\{\s*entreprise\s*\}\}/gi, p.entreprise || '').replace(/\{\{\s*moi\s*\}\}/gi, moi)
      .replace(/Bonjour ,/g, 'Bonjour,');
  }
  // Applique une action ; renvoie un message d'erreur, ou '' quand c'est fait.
  function executer(nomAssistant, m, a) {
    var r = window.__bsStore; if (!r || !r.set) return 'Le CRM n’est pas prêt.';
    var p = prospectDe(m, a), par = ' (' + nomAssistant + ')';
    if ((a.type === 'relance' || a.type === 'statut' || a.type === 'note' || a.type === 'email') && !p) return 'Prospect introuvable.';
    if (a.type === 'tache') {
      var tache = { id: uid(), title: a.titre || 'Tâche', prospectId: p ? p.id : null, due: a.date || jour(), heure: a.heure || '', priorite: '', notes: 'Proposée par ' + nomAssistant + '.', done: false, createdAt: jour() };
      r.set(function (s) { return { tasks: [tache].concat(s.tasks || []) }; });
      if (p) evenement(p.id, 'task', 'Tâche : ' + tache.title + par);
    } else if (a.type === 'relance') {
      if (!a.date) return 'Date de relance manquante.';
      r.set(function (s) { return { prospects: (s.prospects || []).map(function (x) { return x.id === p.id ? Object.assign({}, x, { prochaineRelance: a.date, prochaineRelanceHeure: a.heure || '' }) : x; }) }; });
      evenement(p.id, 'relance', 'Relance planifiée le ' + dateCourte(a.date, a.heure) + par);
    } else if (a.type === 'statut') {
      if (!STATUT_LABEL[a.statut]) return 'Statut inconnu.';
      r.set(function (s) { return { prospects: (s.prospects || []).map(function (x) { return x.id === p.id ? Object.assign({}, x, { statut: a.statut }, a.statut === 'client_signe' && !x.signedAt ? { signedAt: jour() } : {}) : x; }) }; });
      evenement(p.id, 'status', 'Statut : ' + STATUT_LABEL[a.statut] + par);
    } else if (a.type === 'note') {
      evenement(p.id, 'note', a.texte + par);
    } else if (a.type === 'email') {
      if (!window.bsMail || !window.bsMail.composer) return 'La rubrique Mail n’est pas disponible.';
      window.bsMail.composer({ a: p.email || '', sujet: remplir(a.objet, p), texte: remplir(a.texte, p), prospectId: p.id });
      return '';
    } else if (a.type === 'modele') {
      if (!window.bsMarketing || !window.bsMarketing.majListe) return 'La rubrique Modèles n’est pas disponible.';
      var mo = { id: 'mdl-ia-' + uid(), type: CANAL_LABEL[a.canal] ? a.canal : 'email', titre: a.titre || 'Modèle', sujet: a.objet || '', texte: a.texte, creeLe: new Date().toISOString(), modifieLe: new Date().toISOString() };
      window.bsMarketing.majListe('modeles', function (l) { return [mo].concat(l); });
    }
    return '';
  }
  function appliquer(idAssistant, mi, ai) {
    var m = messages(idAssistant)[mi], a = m && m.actions && m.actions[ai], as = assistant(idAssistant);
    if (!a || (a.fait && a.type !== 'email')) return;
    var err = executer(as ? nomCourt(as) : 'Assistant IA', m, a);
    if (err) { toast(err, 'error'); return; }
    a.fait = true; garder(); prevenir();
    if (a.type !== 'email') toast(decrire(m, a).t.split(' :')[0] + ' : fait');
  }
  function toutAppliquer(idAssistant, mi) {
    var m = messages(idAssistant)[mi]; if (!m || !m.actions) return;
    var n = 0, as = assistant(idAssistant);
    m.actions.forEach(function (a) { if (a.fait || a.type === 'email' || decrire(m, a).manque) return; if (!executer(as ? nomCourt(as) : 'Assistant IA', m, a)) { a.fait = true; n++; } });
    garder(); prevenir();
    toast(n + ' action' + (n > 1 ? 's' : '') + ' appliquée' + (n > 1 ? 's' : ''));
  }
  function actionsHtml(m, mi) {
    if (!m.actions || !m.actions.length) return '';
    var restant = m.actions.filter(function (a) { return !a.fait && a.type !== 'email' && !decrire(m, a).manque; }).length;
    return '<div class="bsas-actions">' + m.actions.map(function (a, ai) {
      var d = decrire(m, a);
      return '<div class="bsas-action' + (a.fait ? ' fait' : '') + '"><span class="bsas-action-ic">' + ic(d.i, 15) + '</span><div class="bsas-action-t"><b>' + esc(d.t) + '</b>' + (d.d ? '<small>' + esc(d.d) + '</small>' : '') + '</div>' +
        (a.fait && !d.mail ? '<span class="bsas-ok">' + ic('check', 14) + 'Fait</span>'
          : '<button type="button" data-appliquer="' + mi + ':' + ai + '"' + (d.manque ? ' disabled title="Il manque une information"' : '') + '>' + (d.mail ? 'Ouvrir dans Mail' : 'Appliquer') + '</button>') + '</div>';
    }).join('') + (restant > 1 ? '<button type="button" class="bsas-tout" data-tout-appliquer="' + mi + '">Tout appliquer (' + restant + ')</button>' : '') + '</div>';
  }

  // Texte de Claude → HTML simple : gras, listes, paragraphes.
  function md(t) {
    var out = [], liste = null;
    String(t || '').split('\n').forEach(function (ligne) {
      var l = esc(ligne).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/(^|\s)\*([^*\s][^*]*)\*/g, '$1<i>$2</i>');
      var m = /^\s*(?:[-•*]|(\d+)[.)])\s+(.*)$/.exec(l);
      if (m) {
        var type = m[1] ? 'ol' : 'ul';
        if (!liste || liste.type !== type) { if (liste) out.push('</' + liste.type + '>'); liste = { type: type }; out.push('<' + type + '>'); }
        out.push('<li>' + m[2] + '</li>');
        return;
      }
      if (liste) { out.push('</' + liste.type + '>'); liste = null; }
      if (l.trim()) out.push('<p>' + l.replace(/^#+\s*/, '') + '</p>');
    });
    if (liste) out.push('</' + liste.type + '>');
    return out.join('');
  }

  // ---------------------------------------------------------------- carte « Assistant IA » (page Aujourd'hui)
  // Ce que l'assistant de l'équipe propose, chaque ligne mène à la bonne rubrique.
  var AIDES = [
    { t: 'Trouver des prospects qualifiés', page: 'leads' },
    { t: 'Rédiger des messages personnalisés', page: 'modeles' },
    { t: 'Lancer des campagnes d’emailing', page: 'campagnes' },
    { t: 'Suivre vos réponses et rendez-vous', page: 'agenda' },
    { t: 'Automatiser toute votre prospection', act: 'session' },
  ];
  function titreDe(a) { return a.id === 'membre' ? 'Assistant IA - ' + (prenom() || 'Blackstart') + ' 2.0' : a.nom; }
  function nomCourt(a) { return a.id === 'membre' ? (prenom() || 'Blackstart') + ' 2.0' : a.nom; }

  function panneau(el, o) {
    o = o || {};
    css();
    if (el.__bsas) { el.__bsas.dessiner(); return el.__bsas; }
    var ui = { menu: false, comps: false, methode: -1, amorce: null };
    // Une compétence : lancée tout de suite, ou le champ pré-rempli quand elle a besoin d'un détail (« amorce »).
    function lancer(c) {
      var a = choisi(); if (!a || !c) return;
      ui.comps = false;
      if (!c.amorce) { ui.amorce = null; envoyer(a.id, c.consigne, c); return; }
      ui.amorce = c; dessiner();
      var champ = el.querySelector('.bsas-champ');
      if (champ) { champ.value = c.amorce; champ.focus(); try { champ.setSelectionRange(champ.value.length, champ.value.length); } catch (e) { /* facultatif */ } }
    }
    function choisi() {
      var l = S.liste || [];
      return assistant(S.choisi) || assistant(o.defaut || 'membre') || l[0] || null;
    }
    function dessiner() {
      if (!el.isConnected && el.__bsasVu) return false;
      el.__bsasVu = true;
      var a = choisi(), l = S.liste || [];
      if (a && ui.pour !== a.id) { ui.pour = a.id; ui.comps = false; ui.methode = -1; ui.amorce = null; }
      if (!S.liste) { el.innerHTML = '<div class="bsas-card"><div class="bsas-tete"><span class="bsas-logo">IA</span><div class="bsas-t"><b>Assistant IA</b><span>Chargement…</span></div></div></div>'; return true; }
      if (!a) {
        el.innerHTML = '<div class="bsas-card"><div class="bsas-tete"><span class="bsas-logo">IA</span><div class="bsas-t"><b>Assistant IA</b><span>' +
          esc(S.err || (CONF ? 'Aucun assistant IA n’est ouvert à votre compte : demandez l’accès à un administrateur.' : 'L’assistant IA fonctionne avec la version en ligne du CRM.')) + '</span></div></div></div>';
        return true;
      }
      var msgs = messages(a.id), occupe = !!S.envoi[a.id];
      var intro = '<div class="bsas-bulle bsas-intro"><p>Bonjour ! Je suis ' + esc(nomCourt(a)) + ', ' + (a.id === 'membre' ? 'votre assistant IA.' : esc(a.titre.charAt(0).toLowerCase() + a.titre.slice(1)) + '.') + '<br>Je peux vous aider à :</p>' +
        (a.id === 'membre'
          ? '<ul class="bsas-aides">' + AIDES.map(function (x, i) { return '<li><button type="button" data-aide="' + i + '">' + ic('check', 15) + '<span>' + esc(x.t) + '</span></button></li>'; }).join('') + '</ul>'
          : '<p class="bsas-desc">' + esc(a.description) + '</p>') + '</div>';
      var conv = msgs.map(function (m, mi) {
        return '<div class="bsas-bulle ' + (m.de === 'moi' ? 'moi' : 'ia') + (m.info ? ' info' : '') + '">' + (m.comp ? '<span class="bsas-tag">' + ic('zap', 12) + esc(m.comp.titre) + '</span>' : '') +
          (m.de === 'moi' ? '<p>' + esc(m.texte).replace(/\n/g, '<br>') + '</p>' : md(m.texte) + actionsHtml(m, mi)) + '</div>';
      }).join('');
      var comps = a.competences || [], voirComps = comps.length && (!msgs.length || ui.comps);
      var missions = !voirComps ? '' : o.detaille
        ? '<div class="bsas-comp-l"><span class="bsas-comp-h">' + ic('zap', 13) + comps.length + ' compétences</span>' + comps.map(function (c, i) {
          return '<div class="bsas-comp-r' + (ui.methode === i ? ' ouvert' : '') + '"><button type="button" class="bsas-comp-go" data-comp="' + i + '"><b>' + esc(c.titre) + '</b><small>' + esc(c.resume) + '</small></button>' +
            '<button type="button" class="bsas-comp-m" data-methode="' + i + '" aria-expanded="' + (ui.methode === i) + '">Méthode</button>' + (ui.methode === i ? '<p>' + esc(c.methode) + '</p>' : '') + '</div>';
        }).join('') + '</div>'
        : '<div class="bsas-missions"><span>' + ic('zap', 13) + 'Compétences</span>' + comps.map(function (c, i) { return '<button type="button" data-comp="' + i + '" title="' + esc(c.resume) + '">' + esc(c.titre) + '</button>'; }).join('') + '</div>';
      var sugg = (!msgs.length || o.toujoursSuggestions) && a.id !== 'membre' && a.suggestions && a.suggestions.length
        ? '<div class="bsas-sugg">' + a.suggestions.map(function (s, i) { return '<button type="button" data-sugg="' + i + '">' + esc(s) + '</button>'; }).join('') + '</div>' : '';
      if (o.sansMenu) l = [a];
      var menu = ui.menu ? '<div class="bsas-menu" role="menu">' + l.map(function (x) {
        return '<button type="button" role="menuitem" data-choisir="' + esc(x.id) + '" class="' + (x.id === a.id ? 'on' : '') + '"><span class="bsas-pastille c-' + esc(x.couleur) + '">' + ic(x.icone, 15) + '</span><span><b>' + esc(nomCourt(x)) + '</b><small>' + esc(x.titre) + '</small></span></button>';
      }).join('') + (o.lienPage !== false ? '<a href="#/assistants" class="bsas-menu-tout">' + ic('users', 15) + 'Toute l’équipe IA</a>' : '') + '</div>' : '';
      var garde = el.querySelector('.bsas-champ'), brouillon = garde ? garde.value : '', focus = garde && document.activeElement === garde;
      el.innerHTML = '<section class="bsas-card c-' + esc(a.couleur) + '">' +
        '<div class="bsas-tete"><span class="bsas-logo">' + (a.id === 'membre' ? 'IA' : ic(a.icone, 22)) + '</span><div class="bsas-t"><b>' + esc(titreDe(a)) + '</b><span>' + (a.id === 'membre' ? 'Votre assistant intelligent pour une prospection plus efficace.' : esc(a.titre)) + '</span></div>' +
        (l.length > 1 ? '<button type="button" class="bsas-choix" data-act="menu" aria-expanded="' + ui.menu + '" title="Changer d’assistant">' + ic('users', 15) + '<span>' + l.length + '</span>' + ic('chev-down', 14) + '</button>' : '') + menu + '</div>' +
        '<div class="bsas-fil">' + intro + conv + (occupe ? '<div class="bsas-bulle ia bsas-ecrit"><i></i><i></i><i></i></div>' : '') + '</div>' + missions + sugg +
        '<form class="bsas-form" autocomplete="off"><input class="bsas-champ" placeholder="Posez votre question..." maxlength="2000" aria-label="Votre question à ' + esc(nomCourt(a)) + '"><button type="submit" class="bsas-go" aria-label="Envoyer"' + (occupe ? ' disabled' : '') + '>' + ic('ia-send', 17) + '</button></form>' +
        (msgs.length ? '<div class="bsas-pied">' + (comps.length ? '<button type="button" class="bsas-effacer" data-act="comps" aria-expanded="' + !!ui.comps + '">' + ic('zap', 12) + (ui.comps ? 'Masquer les compétences' : 'Compétences') + '</button>' : '') +
          '<button type="button" class="bsas-effacer" data-act="effacer">Nouvelle conversation</button></div>' : '') + '</section>';
      var champ = el.querySelector('.bsas-champ');
      if (champ) { champ.value = brouillon; if (focus) champ.focus(); }
      var fil = el.querySelector('.bsas-fil'); if (fil && msgs.length) fil.scrollTop = fil.scrollHeight;
      return true;
    }
    el.addEventListener('click', function (ev) {
      var t = ev.target.closest('button,a'); if (!t || !el.contains(t)) return;
      var a = choisi(); if (!a) return;
      if (t.dataset.act === 'menu') { ui.menu = !ui.menu; dessiner(); return; }
      if (t.dataset.choisir) { S.choisi = t.dataset.choisir; ui.menu = false; try { localStorage.setItem('bs-assistants-choisi', S.choisi); } catch (e) { /* facultatif */ } dessiner(); return; }
      if (t.classList.contains('bsas-menu-tout')) { ui.menu = false; return; }
      if (t.dataset.act === 'effacer') { ui.comps = false; ui.amorce = null; effacer(a.id); return; }
      if (t.dataset.act === 'comps') { ui.comps = !ui.comps; dessiner(); return; }
      if (t.dataset.comp != null) { lancer((a.competences || [])[+t.dataset.comp]); return; }
      if (t.dataset.methode != null) { ui.methode = ui.methode === +t.dataset.methode ? -1 : +t.dataset.methode; dessiner(); return; }
      if (t.dataset.sugg != null) { envoyer(a.id, a.suggestions[+t.dataset.sugg]); return; }
      if (t.dataset.appliquer) { var x = t.dataset.appliquer.split(':'); appliquer(a.id, +x[0], +x[1]); return; }
      if (t.dataset.toutAppliquer != null) { toutAppliquer(a.id, +t.dataset.toutAppliquer); return; }
      if (t.dataset.aide != null) {
        var x = AIDES[+t.dataset.aide];
        if (x.act === 'session' && o.session) o.session(); else if (x.page) location.hash = '#/' + x.page;
      }
    });
    el.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var a = choisi(), champ = el.querySelector('.bsas-champ'); if (!a || !champ) return;
      var v = champ.value.trim(), c = ui.amorce, debut = c ? c.amorce.trim() : '';
      ui.amorce = null; champ.value = '';
      if (c && v === debut) { envoyer(a.id, c.consigne, c); return; }
      envoyer(a.id, v, c && v.indexOf(debut) === 0 ? c : null);
    });
    document.addEventListener('pointerdown', function (ev) { if (ui.menu && !el.contains(ev.target)) { ui.menu = false; dessiner(); } });
    var api_ = { dessiner: dessiner, lancer: lancer };
    el.__bsas = api_;
    abonnes.push(dessiner);
    dessiner(); charger();
    return api_;
  }

  // ---------------------------------------------------------------- page « Assistants IA »
  // L'équipe IA : une carte par assistant (rôle, compétences, accès), la conversation à droite. L'administrateur
  // choisit qui a accès à chaque assistant.
  var P = { racine: null, acces: null, membres: null, err: '', enreg: false };
  function compteAcces(a) {
    if (!a.acces) return '';
    if (a.acces.tous) return 'Toute l’équipe';
    var n = a.acces.membres.length;
    return n ? 'Administrateurs + ' + n + ' membre' + (n > 1 ? 's' : '') : 'Administrateurs seulement';
  }
  function dessinerPage() {
    var el = P.racine; if (!el || !el.isConnected) return false;
    var l = S.liste, estAdmin = USER && USER.role === 'admin';
    var cur = assistant(S.choisi) || (l && l[0]) || null;
    var cartes = !l ? '<p class="bsasp-vide">Chargement…</p>' : !l.length
      ? '<p class="bsasp-vide">' + esc(S.err || (CONF ? 'Aucun assistant IA n’est ouvert à votre compte : demandez l’accès à un administrateur.' : 'Les assistants IA fonctionnent avec la version en ligne du CRM.')) + '</p>'
      : l.map(function (a) {
        return '<article class="bsasp-carte c-' + esc(a.couleur) + (cur && cur.id === a.id ? ' on' : '') + '" data-ouvrir-ia="' + esc(a.id) + '">' +
          '<div class="bsasp-c-tete"><span class="bsas-pastille c-' + esc(a.couleur) + '">' + ic(a.icone, 18) + '</span><div><b>' + esc(nomCourt(a)) + '</b><small>' + esc(a.titre) + '</small></div></div>' +
          '<p>' + esc(a.description) + '</p>' +
          (a.competences && a.competences.length ? '<div class="bsasp-comp-h">' + ic('zap', 13) + a.competences.length + ' compétences</div><div class="bsasp-missions">' + a.competences.map(function (c, i) { return '<button type="button" data-lancer="' + esc(a.id) + ':' + i + '" title="' + esc(c.resume) + '">' + esc(c.titre) + '</button>'; }).join('') + '</div>' : '') +
          (estAdmin ? '<div class="bsasp-acces"><span>' + ic('users', 14) + esc(compteAcces(a)) + '</span><button type="button" data-acces="' + esc(a.id) + '">Gérer l’accès</button></div>' : '') +
          '</article>';
      }).join('');
    var bandeau = S.ia === false && CONF ? '<div class="bsasp-bandeau">' + ic('info', 16) + '<span>' + (estAdmin ? 'Pour que les assistants répondent, collez une fois votre clé Claude dans Simulations IA.' : 'Les assistants répondront dès qu’un administrateur aura branché Claude.') + '</span>' +
      (estAdmin ? '<a href="#/entrainement">Ouvrir Simulations IA</a>' : '') + '</div>' : '';
    var garde = el.querySelector('[data-z=chat]');
    if (!garde) {
      el.innerHTML = '<div class="bsasp"><header class="bsasp-tete"><h1>Assistants IA</h1><p>Votre équipe IA : chacun a son rôle et 6 compétences métier, avec la méthode d’un expert. Posez une question ou lancez une compétence ; les actions proposées s’appliquent quand vous cliquez sur « Appliquer ».</p></header>' +
        '<div data-z="bandeau"></div><div class="bsasp-corps"><div class="bsasp-grille" data-z="cartes"></div><div class="bsasp-chat" data-z="chat"></div></div><div data-z="modal"></div></div>';
      garde = el.querySelector('[data-z=chat]');
    }
    el.querySelector('[data-z=bandeau]').innerHTML = bandeau;
    el.querySelector('[data-z=cartes]').innerHTML = cartes;
    if (cur) panneau(garde, { sansMenu: true, lienPage: false, detaille: true });
    el.querySelector('[data-z=modal]').innerHTML = modalAcces();
    return true;
  }
  function modalAcces() {
    if (!P.acces) return '';
    var a = assistant(P.acces); if (!a || !a.acces) return '';
    var membres = P.membres;
    var corps = !membres ? '<p class="bsasp-vide">Chargement de l’équipe…</p>'
      : '<label class="bsasp-tous"><input type="checkbox" data-tous' + (P.brouillon.tous ? ' checked' : '') + '><span><b>Toute l’équipe</b><small>Chaque membre, y compris les futurs, a accès à cet assistant.</small></span></label>' +
        '<div class="bsasp-liste' + (P.brouillon.tous ? ' gris' : '') + '">' + membres.map(function (u) {
          var adm = u.role === 'admin', on = adm || P.brouillon.tous || P.brouillon.membres.indexOf(u.id) >= 0;
          return '<label class="bsasp-m"><input type="checkbox" data-membre="' + esc(u.id) + '"' + (on ? ' checked' : '') + (adm || P.brouillon.tous ? ' disabled' : '') + '><span><b>' + esc(u.name) + '</b><small>' + esc(adm ? 'Administrateur : toujours accès' : (u.poste || 'Membre')) + '</small></span></label>';
        }).join('') + '</div>';
    return '<div class="bsasp-fond" data-fermer-acces><form class="bsasp-modal" role="dialog" aria-modal="true" aria-label="Accès à ' + esc(nomCourt(a)) + '">' +
      '<h2><span class="bsas-pastille c-' + esc(a.couleur) + '">' + ic(a.icone, 16) + '</span>Accès à ' + esc(nomCourt(a)) + '</h2><p>Choisissez qui peut utiliser cet assistant. Les administrateurs ont toujours accès à toute l’équipe IA.</p>' +
      (P.err ? '<div class="bsasp-err">' + esc(P.err) + '</div>' : '') + corps +
      '<div class="bsasp-pied"><button type="button" class="btn btn-secondary btn-md" data-fermer-acces>Annuler</button><button type="submit" class="btn btn-primary btn-md"' + (P.enreg || !membres ? ' disabled' : '') + '>Enregistrer</button></div></form></div>';
  }
  function ouvrirAcces(id) {
    var a = assistant(id); if (!a || !a.acces) return;
    P.acces = id; P.err = ''; P.brouillon = { tous: a.acces.tous, membres: a.acces.membres.slice() };
    dessinerPage();
    fetch('/api/users', { credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart' } }).then(function (r) { return r.json(); })
      .then(function (b) { P.membres = (b.users || []).slice().sort(function (x, y) { return (x.role === 'admin' ? 0 : 1) - (y.role === 'admin' ? 0 : 1) || String(x.name).localeCompare(String(y.name), 'fr'); }); dessinerPage(); })
      .catch(function () { P.err = 'Impossible de charger l’équipe : réessayez.'; dessinerPage(); });
  }
  function monter(el) {
    if (!el) return;
    css();
    if (el === P.racine && el.__bsasp) return;
    P.racine = el; el.__bsasp = true; el.classList.add('bsasp-root');
    el.addEventListener('click', function (ev) {
      var t = ev.target;
      if (t.closest('[data-z=chat]')) return;
      var b = t.closest('button,a,[data-ouvrir-ia],[data-fermer-acces],input,label');
      if (!b) return;
      if (b.hasAttribute('data-fermer-acces') && (b.tagName === 'BUTTON' || t === b)) { P.acces = null; dessinerPage(); return; }
      if (b.dataset.acces) { ouvrirAcces(b.dataset.acces); return; }
      if (b.dataset.lancer) {
        var x = b.dataset.lancer.split(':'), a = assistant(x[0]);
        if (a) {
          S.choisi = a.id; try { localStorage.setItem('bs-assistants-choisi', S.choisi); } catch (e) { /* facultatif */ }
          dessinerPage();
          var chat = el.querySelector('[data-z=chat]');
          if (chat && chat.__bsas) chat.__bsas.lancer((a.competences || [])[+x[1]]);
        }
        return;
      }
      if (b.dataset.ouvrirIa) { S.choisi = b.dataset.ouvrirIa; try { localStorage.setItem('bs-assistants-choisi', S.choisi); } catch (e) { /* facultatif */ } dessinerPage(); var c = el.querySelector('.bsas-champ'); if (c && window.innerWidth > 900) c.focus(); }
    });
    el.addEventListener('change', function (ev) {
      var t = ev.target; if (!P.brouillon) return;
      if (t.hasAttribute('data-tous')) { P.brouillon.tous = t.checked; dessinerPage(); }
      else if (t.dataset.membre) {
        var i = P.brouillon.membres.indexOf(t.dataset.membre);
        if (t.checked && i < 0) P.brouillon.membres.push(t.dataset.membre); else if (!t.checked && i >= 0) P.brouillon.membres.splice(i, 1);
      }
    });
    el.addEventListener('submit', function (ev) {
      if (!ev.target.classList.contains('bsasp-modal')) return;
      ev.preventDefault();
      var id = P.acces; P.enreg = true; dessinerPage();
      api('PUT', '/assistants/' + encodeURIComponent(id) + '/acces', P.brouillon).then(function (b) {
        var a = assistant(id); if (a) a.acces = b.acces;
        P.enreg = false; P.acces = null; dessinerPage(); toast('Accès enregistré');
      }).catch(function (e) { P.enreg = false; P.err = e.message; dessinerPage(); });
    });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && P.acces && P.racine && P.racine.isConnected) { P.acces = null; dessinerPage(); } });
    abonnes.push(dessinerPage);
    // La page relit la liste : une clé Claude collée entre-temps dans Simulations IA est prise en compte.
    dessinerPage(); charger(true);
  }

  var cssFait = false;
  function css() {
    if (cssFait) return; cssFait = true;
    var st = document.createElement('style'); st.id = 'bs-assistants-css';
    st.textContent = [
      '.bsas-card{--c:var(--accent-rgb,56 124 213);position:relative;display:flex;flex-direction:column;gap:14px;padding:20px;border-radius:18px;border:1px solid var(--border);background:var(--surface);box-shadow:var(--shadow-sm)}',
      '.bsas-card.c-violet{--c:139 92 246}.bsas-card.c-emerald{--c:16 185 129}.bsas-card.c-orange{--c:249 115 22}.bsas-card.c-cyan{--c:6 182 212}.bsas-card.c-pink{--c:236 72 153}.bsas-card.c-amber{--c:245 158 11}.bsas-card.c-rose{--c:244 63 94}',
      '.bsas-tete{position:relative;display:flex;align-items:flex-start;gap:14px}',
      '.bsas-logo{flex:none;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:800;font-size:17px;letter-spacing:.02em;background:linear-gradient(140deg,rgb(var(--c)/1),rgb(var(--c)/.65));box-shadow:0 8px 22px -8px rgb(var(--c)/.8),inset 0 1px 0 rgb(255 255 255/.25)}',
      '.bsas-t{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;padding-top:2px}',
      '.bsas-t b{font-size:1.12em;font-weight:750;line-height:1.25}',
      '.bsas-t span{font-size:.88em;color:var(--text-2);line-height:1.4}',
      '.bsas-choix{flex:none;display:inline-flex;align-items:center;gap:4px;height:30px;padding:0 8px;border-radius:9px;border:1px solid var(--border);background:var(--surface-2);color:var(--text-2);font:inherit;font-size:.8em;font-weight:700;cursor:pointer}',
      '.bsas-choix:hover,.bsas-choix[aria-expanded=true]{color:var(--text);border-color:var(--border-2)}',
      '.bsas-menu{position:absolute;z-index:30;right:0;top:38px;width:290px;max-height:420px;overflow:auto;padding:6px;border-radius:14px;border:1px solid var(--border-2);background:var(--surface);box-shadow:var(--shadow-lg,0 20px 50px -12px rgb(0 0 0/.5))}',
      '.bsas-menu button,.bsas-menu a{display:flex;align-items:center;gap:10px;width:100%;padding:8px;border:0;border-radius:10px;background:none;color:var(--text);font:inherit;text-align:left;text-decoration:none;cursor:pointer}',
      '.bsas-menu button:hover,.bsas-menu a:hover,.bsas-menu button.on{background:var(--surface-2)}',
      '.bsas-menu span:not(.bsas-pastille){display:flex;flex-direction:column;min-width:0}',
      '.bsas-menu b{font-size:.9em}.bsas-menu small{font-size:.76em;color:var(--text-3)}',
      '.bsas-menu-tout{margin-top:4px;border-top:1px solid var(--border)!important;border-radius:0 0 10px 10px!important;font-size:.86em;font-weight:650;color:var(--accent-text,var(--accent))!important}',
      '.bsas-pastille{flex:none;width:30px;height:30px;border-radius:9px;display:grid;place-items:center;color:#fff;background:rgb(var(--c,56 124 213))}',
      '.bsas-pastille.c-blue{--c:59 130 246}.bsas-pastille.c-violet{--c:139 92 246}.bsas-pastille.c-emerald{--c:16 185 129}.bsas-pastille.c-orange{--c:249 115 22}.bsas-pastille.c-cyan{--c:6 182 212}.bsas-pastille.c-pink{--c:236 72 153}.bsas-pastille.c-amber{--c:245 158 11}.bsas-pastille.c-rose{--c:244 63 94}',
      '.bsas-fil{display:flex;flex-direction:column;gap:10px;max-height:380px;overflow:auto;scrollbar-width:thin}',
      '.bsas-bulle{padding:12px 14px;border-radius:14px;border:1px solid var(--border);background:var(--surface-2);font-size:.9em;line-height:1.5}',
      '.bsas-bulle p{margin:0}.bsas-bulle p+p{margin-top:6px}',
      '.bsas-bulle ul,.bsas-bulle ol{margin:6px 0 0;padding-left:20px}.bsas-bulle li+li{margin-top:3px}',
      '.bsas-bulle.moi{align-self:flex-end;max-width:88%;background:rgb(var(--c)/.9);border-color:transparent;color:#fff}',
      '.bsas-bulle.ia{align-self:flex-start;max-width:100%}',
      '.bsas-bulle.info{border-style:dashed;color:var(--text-2)}',
      '.bsas-desc{margin-top:6px!important;color:var(--text-2)}',
      '.bsas-intro .bsas-aides{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column;gap:2px}',
      '.bsas-aides button{display:flex;align-items:center;gap:9px;width:100%;padding:3px 4px;border:0;border-radius:7px;background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}',
      '.bsas-aides button:hover{background:rgb(var(--c)/.12)}',
      '.bsas-aides svg{flex:none;color:var(--text-2)}',
      '.bsas-ecrit{display:flex;gap:4px;align-items:center;padding:14px 16px}',
      '.bsas-ecrit i{width:6px;height:6px;border-radius:50%;background:var(--text-3);animation:bsasPoint 1s infinite ease-in-out}',
      '.bsas-ecrit i:nth-child(2){animation-delay:.15s}.bsas-ecrit i:nth-child(3){animation-delay:.3s}',
      '@keyframes bsasPoint{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}',
      '.bsas-sugg{display:flex;flex-wrap:wrap;gap:6px}',
      '.bsas-sugg button{padding:6px 10px;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--text-2);font:inherit;font-size:.8em;font-weight:600;cursor:pointer}',
      '.bsas-sugg button:hover{color:var(--text);border-color:rgb(var(--c)/.6)}',
      '.bsas-form{display:flex;gap:8px;align-items:center;padding:5px 5px 5px 14px;border-radius:12px;border:1px solid var(--border-2);background:var(--surface-2)}',
      '.bsas-form:focus-within{border-color:rgb(var(--c)/.7);box-shadow:0 0 0 3px rgb(var(--c)/.15)}',
      '.bsas-champ{flex:1;min-width:0;border:0;background:none;color:var(--text);font:inherit;font-size:.92em;outline:none;padding:8px 0}',
      '.bsas-champ::placeholder{color:var(--text-3)}',
      '.bsas-go{flex:none;width:38px;height:38px;border-radius:10px;border:0;display:grid;place-items:center;color:#fff;background:rgb(var(--c));cursor:pointer;box-shadow:0 6px 16px -6px rgb(var(--c)/.9)}',
      '.bsas-go:disabled{opacity:.5;cursor:default}',
      '.bsas-missions{display:flex;flex-wrap:wrap;align-items:center;gap:6px}',
      '.bsas-missions>span{display:inline-flex;align-items:center;gap:4px;font-size:.74em;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin-right:2px}',
      '.bsas-missions button,.bsasp-missions button{display:inline-flex;align-items:center;gap:5px;padding:6px 10px;border-radius:999px;border:1px solid rgb(var(--c,56 124 213)/.45);background:rgb(var(--c,56 124 213)/.12);color:var(--text);font:inherit;font-size:.8em;font-weight:650;cursor:pointer}',
      '.bsas-missions button:hover,.bsasp-missions button:hover{background:rgb(var(--c,56 124 213)/.22)}',
      '.bsas-actions{display:flex;flex-direction:column;gap:6px;margin-top:10px}',
      '.bsas-action{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;border:1px solid var(--border);background:var(--surface)}',
      '.bsas-action.fait{opacity:.7}',
      '.bsas-action-ic{flex:none;width:28px;height:28px;border-radius:8px;display:grid;place-items:center;color:#fff;background:rgb(var(--c))}',
      '.bsas-action-t{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}',
      '.bsas-action-t b{font-size:.92em;font-weight:650}',
      '.bsas-action-t small{font-size:.82em;color:var(--text-3);white-space:pre-line;overflow-wrap:anywhere}',
      '.bsas-action button,.bsas-tout{flex:none;height:30px;padding:0 10px;border-radius:8px;border:0;background:rgb(var(--c));color:#fff;font:inherit;font-size:.82em;font-weight:700;cursor:pointer}',
      '.bsas-action button:disabled{opacity:.4;cursor:default}',
      '.bsas-tout{align-self:flex-start;background:none;border:1px solid rgb(var(--c)/.6);color:var(--text)}',
      '.bsas-ok{flex:none;display:inline-flex;align-items:center;gap:4px;font-size:.8em;font-weight:700;color:#22c55e}',
      '.bsasp{display:flex;flex-direction:column;gap:18px}',
      '.bsasp-tete h1{margin:0;font-size:1.9em;font-weight:800;letter-spacing:-.02em}',
      '.bsasp-tete p{margin:6px 0 0;color:var(--text-2);max-width:760px}',
      '.bsasp-bandeau{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 14px;border-radius:12px;border:1px solid rgb(var(--accent-rgb)/.4);background:rgb(var(--accent-rgb)/.1);font-size:.9em}',
      '.bsasp-bandeau span{flex:1;min-width:200px}',
      '.bsasp-bandeau a{font-weight:700;color:var(--accent-text,var(--text))}',
      '.bsasp-corps{display:grid;grid-template-columns:minmax(0,1fr) minmax(340px,430px);gap:20px;align-items:start}',
      '.bsasp-grille{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}',
      '.bsasp-carte{--c:59 130 246;display:flex;flex-direction:column;gap:10px;padding:16px;border-radius:16px;border:1px solid var(--border);background:var(--surface);cursor:pointer;transition:border-color .15s,box-shadow .15s}',
      '.bsasp-carte.c-violet{--c:139 92 246}.bsasp-carte.c-emerald{--c:16 185 129}.bsasp-carte.c-orange{--c:249 115 22}.bsasp-carte.c-cyan{--c:6 182 212}.bsasp-carte.c-pink{--c:236 72 153}.bsasp-carte.c-amber{--c:245 158 11}.bsasp-carte.c-rose{--c:244 63 94}',
      '.bsasp-carte:hover{border-color:rgb(var(--c)/.55)}',
      '.bsasp-carte.on{border-color:rgb(var(--c));box-shadow:0 0 0 3px rgb(var(--c)/.18)}',
      '.bsasp-c-tete{display:flex;align-items:center;gap:10px}',
      '.bsasp-c-tete .bsas-pastille{width:38px;height:38px;border-radius:11px}',
      '.bsasp-c-tete div{display:flex;flex-direction:column;min-width:0}',
      '.bsasp-c-tete b{font-size:1em;font-weight:750}.bsasp-c-tete small{font-size:.8em;color:var(--text-3)}',
      '.bsasp-carte p{margin:0;font-size:.86em;color:var(--text-2);line-height:1.45}',
      '.bsasp-missions{display:flex;flex-wrap:wrap;gap:6px}',
      '.bsasp-acces{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:auto;padding-top:10px;border-top:1px solid var(--border);font-size:.8em;color:var(--text-3)}',
      '.bsasp-acces span{display:inline-flex;align-items:center;gap:6px}',
      '.bsasp-acces button{border:0;background:none;color:var(--accent-text,var(--text));font:inherit;font-weight:700;cursor:pointer}',
      '.bsasp-chat{position:sticky;top:12px}',
      '.bsasp-chat .bsas-fil{max-height:calc(100vh - 330px);min-height:220px}',
      '.bsasp-vide{color:var(--text-3)}',
      '.bsasp-fond{position:fixed;inset:0;z-index:120;display:grid;place-items:center;padding:16px;background:rgb(0 0 0/.5);backdrop-filter:blur(3px)}',
      '.bsasp-modal{width:min(480px,100%);max-height:90vh;overflow:auto;display:flex;flex-direction:column;gap:12px;padding:20px;border-radius:18px;border:1px solid var(--border-2);background:var(--surface);box-shadow:0 30px 80px -20px rgb(0 0 0/.6)}',
      '.bsasp-modal h2{display:flex;align-items:center;gap:10px;margin:0;font-size:1.15em}',
      '.bsasp-modal>p{margin:0;font-size:.88em;color:var(--text-2)}',
      '.bsasp-tous,.bsasp-m{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);cursor:pointer}',
      '.bsasp-tous span,.bsasp-m span{display:flex;flex-direction:column}',
      '.bsasp-tous small,.bsasp-m small{font-size:.8em;color:var(--text-3)}',
      '.bsasp-tous input,.bsasp-m input{width:18px;height:18px;accent-color:rgb(var(--accent-rgb))}',
      '.bsasp-liste{display:flex;flex-direction:column;gap:6px}',
      '.bsasp-liste.gris{opacity:.55}',
      '.bsasp-err{padding:8px 10px;border-radius:8px;background:rgb(239 68 68/.12);color:#fca5a5;font-size:.86em}',
      '.bsasp-pied{display:flex;justify-content:flex-end;gap:8px;margin-top:4px}',
      '@media (max-width:1100px){.bsasp-corps{grid-template-columns:minmax(0,1fr)}.bsasp-chat{position:static}.bsasp-chat .bsas-fil{max-height:420px}}',
      '.bsas-effacer{align-self:flex-start;margin-top:-6px;padding:0;border:0;background:none;color:var(--text-3);font:inherit;font-size:.78em;cursor:pointer}',
      '.bsas-effacer:hover{color:var(--text)}',
      '.bsas-pied{display:flex;justify-content:space-between;gap:10px;margin-top:-6px}.bsas-pied .bsas-effacer{margin:0;display:inline-flex;align-items:center;gap:4px}',
      '.bsas-tag{display:inline-flex;align-items:center;gap:4px;margin-bottom:4px;padding:2px 8px;border-radius:999px;background:rgb(255 255 255/.2);font-size:.74em;font-weight:700}',
      '.bsas-comp-l{display:flex;flex-direction:column;gap:6px;max-height:340px;overflow:auto;padding-right:2px}',
      '.bsas-comp-h,.bsasp-comp-h{display:inline-flex;align-items:center;gap:4px;font-size:.74em;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3)}',
      '.bsasp-comp-h{margin-bottom:-4px}',
      '.bsas-comp-r{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:4px 8px;padding:8px 10px;border-radius:12px;border:1px solid var(--border);background:var(--surface-2);transition:border-color .15s}',
      '.bsas-comp-r:hover,.bsas-comp-r.ouvert{border-color:rgb(var(--c)/.55)}',
      '.bsas-comp-go{display:flex;flex-direction:column;align-items:flex-start;gap:1px;min-width:0;padding:0;border:0;background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}',
      '.bsas-comp-go b{font-size:.86em;font-weight:700}.bsas-comp-go small{font-size:.76em;color:var(--text-3);line-height:1.35}',
      '.bsas-comp-go:hover b{color:rgb(var(--c))}',
      '.bsas-comp-m{padding:4px 8px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text-2);font:inherit;font-size:.72em;font-weight:600;cursor:pointer}',
      '.bsas-comp-m:hover,.bsas-comp-m[aria-expanded=true]{color:var(--text);border-color:rgb(var(--c)/.6)}',
      '.bsas-comp-r p{grid-column:1/-1;margin:4px 0 0;font-size:.78em;line-height:1.5;color:var(--text-2)}',
    ].join('\n');
    document.head.appendChild(st);
  }

  window.bsAssistants = { monter: monter, appliquer: appliquer, charger: charger, liste: function () { return S.liste; }, ia: function () { return S.ia; }, contexte: contexte, envoyer: envoyer, panneau: panneau, md: md, etat: function () { return S; } };
})();
