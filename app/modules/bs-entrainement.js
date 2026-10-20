/* Blackstart CRM : rubrique « Entraînement ».
 *
 * Simulateur d'appel dans le CRM : Claude joue le prospect choisi (fiche construite depuis le CRM : entreprise,
 * contact, historique d'appels, notes, objections de notre script, objectif), à la voix (micro + voix du navigateur)
 * ou au clavier, puis note l'appel sur 10 avec les points à améliorer. Sans clé Claude, un prospect « sans IA »
 * enchaîne les objections du script et l'appel reçoit une note estimée.
 * Pitchbase (pitchbase.app) reste disponible dans une fenêtre à côté : il refuse d'être affiché dans un autre site.
 * Chaque entraînement est noté sur la fiche du prospect.
 */
(function () {
  'use strict';
  if (window.bsEntrainement) return;

  var SITE = 'https://pitchbase.app/app';
  var CLE = 'bs-entrainement';
  function lire(d) { try { var v = JSON.parse(localStorage.getItem(CLE)); return v && typeof v === 'object' ? v : d; } catch (e) { return d; } }
  function ecrire() { try { localStorage.setItem(CLE, JSON.stringify(P)); } catch (e) { /* stockage indisponible */ } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var P = lire({});
  if (!P.offre) P.offre = 'un CRM sur mesure et de la génération de leads, pour trouver de nouveaux clients et ne plus en perdre';
  if (!P.niveau) P.niveau = 'normal';
  if (!P.mode) P.mode = 'voix';
  if (!Array.isArray(P.historique)) P.historique = [];

  var Reco = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var synth = window.speechSynthesis || null;

  // ia : null (on ne sait pas encore), true, false. appel : simulation en cours. rapport : note de la dernière simulation.
  var S = { prospectId: '', objectif: '', fiche: '', modifiee: false, integrable: null, ouvert: false, msg: null,
    ia: null, admin: false, source: null, cleMsg: null, cleEnvoi: false, voirCle: false, appel: null, rapport: null };
  var racine, fenetre;

  var NIVEAUX = {
    facile: ['Facile', 'Curieux et poli, il pose des questions mais finit par écouter.'],
    normal: ['Normal', 'Pressé et un peu méfiant : il veut savoir vite pourquoi je l’appelle.'],
    difficile: ['Difficile', 'Fermé, il cherche à raccrocher et enchaîne les objections.']
  };
  var OBJECTIFS = {
    rdv: 'Obtenir un rendez-vous pour un audit gratuit de 20 minutes (proposer deux créneaux).',
    relance: 'Relancer la proposition envoyée et obtenir une décision ou une date de signature.',
    signature: 'Conclure : faire valider la proposition et fixer le démarrage.',
    rappel: 'Rattraper un prospect qui n’avait pas répondu et obtenir un rendez-vous.'
  };
  var OBJ_COURT = { rdv: 'Obtenir un rendez-vous', relance: 'Relancer une proposition', signature: 'Conclure la vente', rappel: 'Rattraper un injoignable' };
  var OBJECTIONS = ['« Je n’ai pas le temps »', '« On n’a pas de budget pour ça »', '« Envoyez-moi une documentation »', '« On a déjà quelqu’un / un logiciel pour ça »', '« Rappelez-moi plus tard »'];
  var STATUTS = { a_appeler: 'à appeler', injoignable: 'injoignable', rdv_pris: 'rendez-vous pris', audit_realise: 'audit réalisé', proposition_envoyee: 'proposition envoyée', client_signe: 'client', perdu: 'perdu', resilie: 'résilié' };
  var RESULTATS = { injoignable: 'injoignable', rappel: 'à rappeler plus tard', rdv_pris: 'rendez-vous obtenu', audit_realise: 'audit réalisé', proposition_envoyee: 'proposition envoyée', client_signe: 'client signé', perdu: 'refus' };

  function store() { var R = window.__bsStore; return R && R.get ? R.get() : {}; }
  function prospects() { return (store().prospects || []).filter(function (p) { return p.entreprise || p.contact; }); }
  function prospect(id) { return prospects().filter(function (p) { return p.id === id; })[0] || null; }
  function moi() { return (store().companyInfo || {}).nom || 'Blackstart AI'; }
  function objectifPour(p) {
    if (!p) return 'rdv';
    if (p.statut === 'proposition_envoyee' || p.statut === 'audit_realise') return 'relance';
    if (p.statut === 'rdv_pris') return 'signature';
    if (p.statut === 'injoignable') return 'rappel';
    return 'rdv';
  }
  function dateFr(d) { try { return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }); } catch (e) { return d || ''; } }

  // Fiche du scénario : tout ce qu'il faut à l'IA (Claude ou Pitchbase) pour jouer ce prospect-là.
  function fiche(p, objectif) {
    var l = ['Appel de prospection B2B en français. Je suis commercial chez ' + moi() + '. Je vends ' + P.offre + '.', ''];
    if (p) {
      l.push('Prospect à jouer : ' + (p.contact ? p.contact + ', décideur de ' : 'le gérant de ') + p.entreprise + (p.secteur ? ' (' + p.secteur + ')' : '') + (p.ville ? ', à ' + p.ville : '') + '.');
      if (p.site) l.push('Son site : ' + p.site);
      var appels = (p.callLog || []).slice().sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
      var h = 'Où on en est : prospect « ' + (STATUTS[p.statut] || p.statut || 'nouveau') + ' »';
      if (appels.length) h += ', ' + appels.length + ' appel' + (appels.length > 1 ? 's' : '') + ' déjà passé' + (appels.length > 1 ? 's' : '') + ' (dernier : ' + (RESULTATS[appels[0].outcome] || appels[0].outcome || 'sans résultat') + (appels[0].date ? ', le ' + dateFr(appels[0].date) : '') + ')';
      l.push(h + '.');
      var notes = String(p.notes || '').replace(/\s+/g, ' ').trim();
      var dernieres = appels.map(function (a) { return String(a.note || '').replace(/\s+/g, ' ').trim(); }).filter(Boolean).slice(0, 2);
      if (notes || dernieres.length) l.push('Ce que je sais déjà : ' + [notes].concat(dernieres).filter(Boolean).join(' · ').slice(0, 700));
    } else {
      l.push('Prospect à jouer : le gérant d’une petite entreprise française qui n’a jamais entendu parler de nous.');
    }
    l.push('');
    l.push('Caractère : ' + NIVEAUX[P.niveau][1]);
    l.push('Objections à me faire, une à la fois et naturellement : ' + OBJECTIONS.join(', ') + '.');
    l.push('Mon objectif : ' + OBJECTIFS[objectif || 'rdv']);
    l.push('');
    l.push('À la fin, note mon appel sur 10 et dis-moi les 3 choses à améliorer en priorité.');
    return l.join('\n');
  }
  function regenerer() {
    var p = prospect(S.prospectId);
    if (!S.objectif) S.objectif = objectifPour(p);
    S.fiche = fiche(p, S.objectif); S.modifiee = false;
  }

  function copier(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).then(function () { return true; }, function () { return copierVieux(t); });
    return Promise.resolve(copierVieux(t));
  }
  function copierVieux(t) {
    var z = document.createElement('textarea'); z.value = t; z.style.position = 'fixed'; z.style.opacity = '0';
    document.body.appendChild(z); z.select(); var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    z.remove(); return ok;
  }

  function noterSurFiche(p, texte) {
    try {
      var R = window.__bsStore; if (!R || !R.set || !p) return;
      var n = new Date();
      var ev = { id: Math.random().toString(36).slice(2) + n.getTime().toString(36), at: n.toISOString(), date: n.toISOString().slice(0, 10), time: n.toTimeString().slice(0, 5), type: 'note', text: texte };
      R.set(function (s) { return { prospects: s.prospects.map(function (x) { return x.id === p.id ? Object.assign({}, x, { events: [ev].concat(x.events || []).slice(0, 200) }) : x; }) }; });
    } catch (e) { /* la fiche est un plus */ }
  }
  function memoriser(h) { P.historique = [h].concat(P.historique).slice(0, 30); ecrire(); }

  function api(methode, url, corps) {
    return fetch(url, { method: methode, credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart', 'Content-Type': 'application/json' }, body: corps ? JSON.stringify(corps) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { if (!r.ok) throw Object.assign(new Error(b.error || 'Erreur ' + r.status), { code: b.code, status: r.status }); return b; }); });
  }
  function etatIA() {
    if (!window.BS_SERVER) { S.ia = false; return; }
    api('GET', '/api/ia/etat').then(function (b) { S.ia = !!b.ia; S.admin = !!b.admin; S.source = b.source; rendre(); }, function () { S.ia = false; rendre(); });
  }

  // ---------------------------------------------------------------- voix
  var voix = null;
  function choisirVoix() {
    if (!synth) return;
    var v = synth.getVoices().filter(function (x) { return /^fr(-|_|$)/i.test(x.lang); });
    var bonnes = /natural|online|neural|google|premium|enhanced|thomas|amélie|amelie|audrey|denise|henri|paul|julie/i;
    voix = v.filter(function (x) { return bonnes.test(x.name) && /fr.FR/i.test(x.lang); })[0] || v.filter(function (x) { return /fr.FR/i.test(x.lang); })[0] || v[0] || null;
  }
  if (synth) { choisirVoix(); try { synth.addEventListener('voiceschanged', choisirVoix); } catch (e) { /* vieux navigateur */ } }

  function parler(t, ensuite) {
    var A = S.appel;
    var fini = false, garde;
    function fin() { if (fini) return; fini = true; clearTimeout(garde); if (S.appel === A && ensuite) ensuite(); }
    if (!synth || P.son === false) { garde = setTimeout(fin, 250); return; }
    try {
      synth.cancel();
      var u = new SpeechSynthesisUtterance(t);
      u.lang = 'fr-FR'; u.rate = 1.04; if (voix) u.voice = voix;
      u.onend = fin; u.onerror = fin;
      synth.speak(u);
      garde = setTimeout(fin, 2500 + t.length * 85); // filet si le navigateur ne signale pas la fin
    } catch (e) { garde = setTimeout(fin, 250); }
  }

  var reco = null;
  function ecouter() {
    var A = S.appel;
    if (!A || A.mode !== 'voix' || !Reco || A.etat !== 'vendeur') return;
    arreterEcoute();
    var r = new Reco(); reco = r;
    r.lang = 'fr-FR'; r.continuous = true; r.interimResults = true;
    var silence;
    r.onresult = function (ev) {
      if (S.appel !== A || reco !== r) return;
      var fin = '', enCours = '';
      for (var i = 0; i < ev.results.length; i++) { var x = ev.results[i]; if (x.isFinal) fin += x[0].transcript; else enCours += x[0].transcript; }
      A.dicte = fin.trim(); A.interim = enCours.trim();
      majSaisie();
      clearTimeout(silence);
      if (A.dicte && !A.interim) silence = setTimeout(function () { if (S.appel === A && A.etat === 'vendeur' && A.dicte) envoyer(A.dicte); }, 1700);
    };
    r.onerror = function (ev) {
      if (reco !== r) return;
      if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed' || ev.error === 'audio-capture') {
        A.mode = 'clavier'; A.alerte = 'Micro indisponible ou refusé : répondez au clavier (ou autorisez le micro pour ce site puis recommencez).'; reco = null; majAppel();
      }
    };
    r.onend = function () { if (reco === r && S.appel === A && A.etat === 'vendeur' && A.mode === 'voix') { try { r.start(); } catch (e) { /* déjà relancé */ } } };
    try { r.start(); A.ecoute = true; } catch (e) { A.ecoute = false; }
    majAppel();
  }
  function arreterEcoute() {
    var r = reco; reco = null;
    if (r) { try { r.onend = null; r.abort(); } catch (e) { /* déjà arrêté */ } }
    if (S.appel) S.appel.ecoute = false;
  }

  // ---------------------------------------------------------------- prospect sans IA (objections du script)
  var REPLIQUES = ['Écoutez, je n’ai vraiment pas le temps, là.', 'Honnêtement, on n’a pas de budget pour ce genre de choses en ce moment.', 'Envoyez-moi plutôt une documentation par mail, je regarderai.',
    'On a déjà un logiciel pour ça, et ça nous suffit.', 'Rappelez-moi plus tard, je suis en plein rush.'];
  var CRENEAU = /rendez-vous|rdv|créneau|creneau|lundi|mardi|mercredi|jeudi|vendredi|demain|\b\d{1,2} ?h|heure|semaine prochaine|visio|passer vous voir/i;
  function repliqueScript(A) {
    var n = A.messages.filter(function (m) { return m.de === 'vendeur'; }).length;
    var nb = { facile: 1, normal: 2, difficile: 4 }[A.niveau] || 2;
    var dernier = A.messages[A.messages.length - 1].texte;
    if (n === 1) return { texte: 'Oui… c’est à quel sujet ?' };
    if (n - 1 <= nb) return { texte: REPLIQUES[(A.graine + n) % REPLIQUES.length] };
    if (n - 1 === nb + 1 && !CRENEAU.test(dernier)) return { texte: 'Bon. Et concrètement, vous me proposez quoi ?' };
    if (CRENEAU.test(dernier)) return { texte: 'D’accord, ça me va. Envoyez-moi une invitation par mail. Au revoir.', fin: true };
    return { texte: 'Bon, je vais réfléchir. Au revoir.', fin: true };
  }
  function noteScript(A) {
    var v = A.messages.filter(function (m) { return m.de === 'vendeur'; }).map(function (m) { return m.texte; });
    var tout = v.join(' '), mots = v.map(function (t) { return t.split(/\s+/).filter(Boolean).length; });
    var p = A.prospect, note = 0, forts = [], amel = [];
    var rdv = CRENEAU.test(tout);
    if (rdv) { note += 3; forts.push('Vous avez proposé un rendez-vous ou un créneau.'); } else amel.push('Demandez un rendez-vous précis : proposez deux créneaux (« mardi 10 h ou jeudi 14 h ? »).');
    var q = v.filter(function (t) { return t.indexOf('?') >= 0 || /^(est-ce|comment|pourquoi|quel|quelle|combien|qu’est|qu'est)/i.test(t); }).length;
    if (q >= 2) { note += 2; forts.push('Vous posez des questions pour comprendre le besoin.'); } else { note += q; amel.push('Posez au moins deux questions de découverte (comment ils trouvent leurs clients, ce qui leur fait perdre du temps…).'); }
    if (/je m.appelle|je suis|de la part de|ici /i.test(v[0] || '') || (v[0] || '').toLowerCase().indexOf(moi().toLowerCase()) >= 0) { note += 1; forts.push('Vous vous présentez dès le début.'); } else amel.push('Présentez-vous en une phrase au début : prénom, société, raison de l’appel.');
    if (p && ((p.entreprise && tout.toLowerCase().indexOf(String(p.entreprise).toLowerCase().split(' ')[0]) >= 0) || (p.contact && tout.toLowerCase().indexOf(String(p.contact).toLowerCase().split(' ')[0]) >= 0))) { note += 1; forts.push('Vous personnalisez avec le nom du prospect.'); }
    var moy = mots.reduce(function (a, b) { return a + b; }, 0) / Math.max(1, mots.length);
    if (moy >= 8 && moy <= 60) note += 1; else if (moy < 8) amel.push('Vos réponses sont très courtes : face à une objection, reconnaissez-la puis rebondissez avec un bénéfice concret.'); else amel.push('Vos répliques sont longues : visez 2 ou 3 phrases, puis laissez parler le prospect.');
    var trait = v.slice(1).filter(function (t) { return t.split(/\s+/).length >= 8; }).length;
    note += Math.min(2, trait * 0.5);
    note = Math.max(0, Math.min(10, Math.round(note)));
    if (v.length < 3) { note = Math.min(note, 3); amel.unshift('L’appel a été très court : tenez jusqu’à la demande de rendez-vous.'); }
    if (!forts.length) forts.push('Vous êtes allé au bout de l’appel.');
    return { note: note, verdict: rdv ? 'Appel mené jusqu’à la proposition de rendez-vous.' : 'Il manque une demande d’engagement claire.', objectif_atteint: rdv && A.fin,
      points_forts: forts.slice(0, 3), a_ameliorer: amel.slice(0, 3), objections: [], phrase_a_essayer: 'Je comprends. Justement, 20 minutes suffisent pour voir si ça vaut le coup : mardi 10 h ou jeudi 14 h, qu’est-ce qui vous arrange ?', estimee: true };
  }

  // ---------------------------------------------------------------- appel
  function decroche(p) {
    if (!p) return 'Allô, oui ?';
    if (P.niveau === 'difficile') return 'Oui ? C’est pour quoi ?';
    return p.entreprise ? String(p.entreprise).slice(0, 60) + ', bonjour ?' : 'Allô, oui ?';
  }
  function demarrer() {
    var zone = racine && racine.querySelector('textarea[name=fiche]');
    if (zone && S.modifiee) S.fiche = zone.value;
    var p = prospect(S.prospectId);
    var A = { debut: Date.now(), messages: [], etat: 'prospect', mode: P.mode === 'voix' && Reco ? 'voix' : 'clavier', ia: !!S.ia, prospect: p,
      fiche: S.fiche, niveau: P.niveau, objectif: S.objectif || 'rdv', graine: Math.floor(Math.random() * 5), dicte: '', interim: '', alerte: P.mode === 'voix' && !Reco ? 'Votre navigateur ne reconnaît pas la voix : répondez au clavier (Chrome, Edge et Safari le permettent).' : '' };
    S.appel = A; S.rapport = null; S.msg = null;
    rendre();
    var premiere = decroche(p);
    A.messages.push({ de: 'prospect', texte: premiere });
    majAppel();
    parler(premiere, aMoi); // lancé dans le clic : le navigateur autorise alors la voix
    clearInterval(A.chrono); A.chrono = setInterval(majChrono, 1000);
  }
  function aMoi() {
    var A = S.appel; if (!A || A.etat === 'fini') return;
    A.etat = 'vendeur'; A.dicte = ''; A.interim = '';
    majAppel(); ecouter();
    var champ = racine && racine.querySelector('input[name=reponse]');
    if (champ && A.mode === 'clavier' && window.matchMedia('(min-width: 700px)').matches) champ.focus();
  }
  function envoyer(t) {
    var A = S.appel; t = String(t || '').trim();
    if (!A || A.etat !== 'vendeur' || !t) return;
    arreterEcoute();
    A.messages.push({ de: 'vendeur', texte: t }); A.dicte = ''; A.interim = ''; A.alerte = '';
    var champ = racine && racine.querySelector('input[name=reponse]'); if (champ) champ.value = '';
    repondre(A);
  }
  function repondre(A) {
    A.etat = 'attente'; majAppel();
    var suite = A.ia
      ? api('POST', '/api/ia/simulation/repondre', { fiche: A.fiche, messages: A.messages })
      : new Promise(function (ok) { setTimeout(function () { ok(repliqueScript(A)); }, 650); });
    suite.then(function (b) {
      if (S.appel !== A) return;
      A.messages.push({ de: 'prospect', texte: b.texte }); A.etat = 'prospect'; A.fin = !!b.fin;
      majAppel();
      parler(b.texte, function () { if (A.fin) terminer(); else aMoi(); });
    }, function (e) {
      if (S.appel !== A) return;
      if (e.code === 'SANS_CLE') { A.ia = false; S.ia = false; A.alerte = 'Claude n’est pas branché : le prospect continue sans IA.'; return repondre(A); }
      A.etat = 'erreur'; A.alerte = e.message || 'Claude n’a pas pu répondre.'; majAppel();
    });
  }
  function terminer() {
    var A = S.appel; if (!A || A.etat === 'fini' || A.etat === 'notation') return;
    arreterEcoute(); if (synth) try { synth.cancel(); } catch (e) { /* rien */ }
    clearInterval(A.chrono);
    A.duree = Math.round((Date.now() - A.debut) / 1000);
    if (!A.messages.some(function (m) { return m.de === 'vendeur'; })) { S.appel = null; rendre(); return; }
    A.etat = 'notation'; majAppel();
    var note = A.ia ? api('POST', '/api/ia/simulation/noter', { fiche: A.fiche, messages: A.messages, duree: A.duree }) : Promise.resolve(noteScript(A));
    note.then(function (n) { conclure(A, n); }, function (e) {
      if (S.appel !== A) return;
      var n = noteScript(A); n.alerte = 'Claude n’a pas pu noter l’appel (' + (e.message || 'erreur') + ') : voici une note estimée.';
      conclure(A, n);
    });
  }
  function conclure(A, n) {
    if (S.appel !== A) return;
    A.etat = 'fini';
    S.rapport = { n: n, messages: A.messages, prospect: A.prospect, duree: A.duree, ia: A.ia && !n.estimee, niveau: A.niveau, objectif: A.objectif };
    S.appel = null;
    var p = A.prospect;
    memoriser({ at: new Date().toISOString(), prospectId: p ? p.id : '', nom: p ? p.entreprise : 'Prospect type', niveau: A.niveau, note: n.note, mode: S.rapport.ia ? 'claude' : 'script' });
    noterSurFiche(p, 'Entraînement ' + (S.rapport.ia ? 'avec Claude' : 'sans IA') + ' sur ce prospect : ' + n.note + '/10' + (n.objectif_atteint ? ', objectif atteint' : '') + ' (' + NIVEAUX[A.niveau][0].toLowerCase() + ')');
    rendre();
    try { racine.querySelector('.bsent-rapport').scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* rien */ }
  }
  function abandonner() {
    var A = S.appel; if (!A) return;
    arreterEcoute(); if (synth) try { synth.cancel(); } catch (e) { /* rien */ }
    clearInterval(A.chrono); S.appel = null; rendre();
  }

  // Mises à jour ciblées pendant l'appel (sans tout redessiner : le champ de saisie garde son texte).
  function duree(s) { s = Math.max(0, s | 0); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function majChrono() { var A = S.appel, el = racine && racine.querySelector('[data-z=chrono]'); if (A && el) el.textContent = duree((Date.now() - A.debut) / 1000); }
  function majSaisie() {
    var A = S.appel, el = racine && racine.querySelector('[data-z=dicte]'); if (!A || !el) return;
    var t = (A.dicte + ' ' + A.interim).trim();
    el.innerHTML = t ? esc(A.dicte) + (A.interim ? ' <i>' + esc(A.interim) + '</i>' : '') : '<span>Parlez : votre réponse s’affiche ici, elle part toute seule quand vous vous arrêtez.</span>';
    var b = racine.querySelector('[data-act=envoyer-dicte]'); if (b) b.disabled = !A.dicte && !A.interim;
  }
  var ETATS = { prospect: 'Le prospect parle…', vendeur: 'À vous', attente: 'Le prospect réfléchit…', notation: 'Claude note votre appel…', erreur: 'Problème', fini: 'Terminé' };
  function majAppel() {
    var A = S.appel; if (!A || !racine) return;
    var fil = racine.querySelector('[data-z=fil]'); if (!fil) return;
    var nom = A.prospect ? (A.prospect.contact || A.prospect.entreprise) : 'Prospect';
    fil.innerHTML = A.messages.map(function (m) {
      return '<div class="bsent-bulle ' + (m.de === 'prospect' ? 'lui' : 'moi') + '"><small>' + esc(m.de === 'prospect' ? nom : 'Vous') + '</small>' + esc(m.texte) + '</div>';
    }).join('') + (A.etat === 'attente' ? '<div class="bsent-bulle lui bsent-points"><span></span><span></span><span></span></div>' : '');
    fil.scrollTop = fil.scrollHeight;
    var etat = racine.querySelector('[data-z=etat]');
    if (etat) { etat.textContent = A.etat === 'vendeur' && A.mode === 'voix' && A.ecoute ? 'À vous : parlez' : ETATS[A.etat] || ''; etat.className = 'bsent-etat ' + A.etat; }
    var al = racine.querySelector('[data-z=alerte]');
    if (al) { al.hidden = !A.alerte; al.innerHTML = A.alerte ? esc(A.alerte) + (A.etat === 'erreur' ? ' <button type="button" class="btn btn-ghost btn-sm" data-act="reessayer">Réessayer</button>' : '') : ''; }
    var voixZ = racine.querySelector('[data-z=voix]'), clavier = racine.querySelector('[data-z=clavier]');
    if (voixZ) voixZ.hidden = A.mode !== 'voix';
    if (clavier) clavier.hidden = A.mode === 'voix';
    var mic = racine.querySelector('[data-act=micro]');
    if (mic) { mic.classList.toggle('on', !!A.ecoute); mic.disabled = A.etat !== 'vendeur'; mic.setAttribute('aria-label', A.ecoute ? 'Micro ouvert' : 'Ouvrir le micro'); }
    var champ = racine.querySelector('input[name=reponse]'), bout = racine.querySelector('[data-act=envoyer]');
    if (champ) champ.disabled = A.etat !== 'vendeur';
    if (bout) bout.disabled = A.etat !== 'vendeur';
    var bascule = racine.querySelector('[data-act=bascule]');
    if (bascule) { bascule.hidden = !Reco; bascule.textContent = A.mode === 'voix' ? 'Répondre au clavier' : 'Répondre à la voix'; }
    var fin = racine.querySelector('[data-act=raccrocher]'); if (fin) fin.disabled = A.etat === 'notation';
    majSaisie();
  }

  // ---------------------------------------------------------------- clé Claude (administrateur)
  function enregistrerCle(v) {
    S.cleEnvoi = true; S.cleMsg = null; rendre();
    api('PUT', '/api/ia/cle', { cle: v }).then(function (b) {
      S.cleEnvoi = false; S.ia = true; S.source = b.source; S.voirCle = false; S.cleMsg = { k: 'ok', t: 'Claude est branché : lancez votre premier appel.' }; rendre();
    }, function (e) { S.cleEnvoi = false; S.cleMsg = { k: 'warn', t: e.message }; rendre(); });
  }
  function retirerCle() {
    if (!window.confirm('Retirer la clé Claude ? Le simulateur repassera en mode sans IA pour toute l’équipe.')) return;
    api('DELETE', '/api/ia/cle').then(function (b) { S.ia = !!b.ia; S.source = b.ia ? 'env' : null; S.cleMsg = { k: 'ok', t: 'Clé Claude retirée.' }; rendre(); }, function (e) { S.cleMsg = { k: 'warn', t: e.message }; rendre(); });
  }

  // ---------------------------------------------------------------- Pitchbase (fenêtre à côté)
  function lancerPitchbase() {
    var p = prospect(S.prospectId);
    memoriser({ at: new Date().toISOString(), prospectId: p ? p.id : '', nom: p ? p.entreprise : 'Prospect type', niveau: P.niveau, mode: 'pitchbase' });
    noterSurFiche(p, 'Entraînement Pitchbase sur ce prospect (' + NIVEAUX[P.niveau][0].toLowerCase() + ')');
    return copier(S.fiche).then(function (ok) {
      if (S.integrable) { S.ouvert = true; S.msg = { k: 'ok', t: ok ? 'Fiche copiée. Dans Pitchbase, créez un scénario et collez-la (Ctrl + V) dans la description du prospect.' : 'Copiez la fiche, puis collez-la dans Pitchbase.' }; }
      else {
        if (!fenetre || fenetre.closed) fenetre = window.open(SITE, 'pitchbase', 'width=1180,height=860');
        else { try { fenetre.focus(); } catch (e) { /* fenêtre d'un autre site */ } }
        S.msg = { k: fenetre ? 'ok' : 'warn', t: (ok ? 'Fiche copiée. ' : 'Copiez la fiche. ') + (fenetre ? 'Pitchbase s’est ouvert dans une fenêtre à côté du CRM : créez un scénario et collez la fiche (Ctrl + V) dans la description du prospect.' : 'Votre navigateur a bloqué la fenêtre Pitchbase : autorisez les fenêtres pour ce site, ou utilisez le bouton « Ouvrir Pitchbase ».') };
      }
      rendre();
    });
  }

  // ---------------------------------------------------------------- affichage
  var LOGO = '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="bsent-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#6366f1"/></linearGradient></defs><rect width="48" height="48" rx="11" fill="url(#bsent-g)"/><path d="M17 13h9c5.2 0 8.6 3 8.6 7.6S31.2 28 26 28h-3.4v7H17zm5.6 4.7v5.6h3c2.1 0 3.4-1.1 3.4-2.8s-1.3-2.8-3.4-2.8z" fill="#fff"/><circle cx="36" cy="12" r="3" fill="#fde68a"/></svg>';
  var SIMU = '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="bsent-s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14b8a6"/><stop offset="1" stop-color="#6366f1"/></linearGradient></defs><rect width="48" height="48" rx="11" fill="url(#bsent-s)"/><path d="M34 29.6v3.3a2.2 2.2 0 0 1-2.4 2.2 21.8 21.8 0 0 1-9.5-3.4 21.5 21.5 0 0 1-6.6-6.6 21.8 21.8 0 0 1-3.4-9.6A2.2 2.2 0 0 1 14.3 13h3.3a2.2 2.2 0 0 1 2.2 1.9c.1 1 .4 2 .8 3a2.2 2.2 0 0 1-.5 2.3l-1.4 1.4a17.6 17.6 0 0 0 6.6 6.6l1.4-1.4a2.2 2.2 0 0 1 2.3-.5c1 .4 2 .6 3 .8a2.2 2.2 0 0 1 1.9 2.2z" fill="#fff"/></svg>';
  var IC = {
    tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    claude: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l1.6 5.2 5.2-2.3-3.1 4.7 5.3 1.9-5.3 1.9 3.1 4.7-5.2-2.3L12 21.5l-1.6-5.2-5.2 2.3 3.1-4.7L3 12l5.3-1.9-3.1-4.7 5.2 2.3z" fill="#d97757"/></svg>'
  };
  var CSS = '.bsent-root{display:flex;flex-direction:column;gap:16px;max-width:1080px}.bsent-root [hidden]{display:none!important}' +
    '.bsent-card{padding-bottom:16px}.bsent-card>*:not(.card-head){margin-left:18px;margin-right:18px}' +
    '.bsent-fh{display:flex;align-items:center;gap:12px;min-width:0}.bsent-logo{display:inline-flex;width:44px;height:44px;flex:none;border-radius:12px;overflow:hidden}.bsent-logo svg{width:100%;height:100%}' +
    '.bsent-logo.claude{background:rgba(217,119,87,.14);align-items:center;justify-content:center}.bsent-logo.claude svg{width:26px;height:26px}' +
    '.bsent-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.bsent-grid label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:var(--text-2);min-width:0}' +
    '.bsent-fiche{display:block;box-sizing:border-box;width:100%;min-height:230px;resize:vertical;line-height:1.5;margin-top:10px;font-size:14px}' +
    '.bsent-details{margin-top:12px;font-size:14px}.bsent-details summary{cursor:pointer;color:var(--text-2);font-weight:600}' +
    '.bsent-act{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:14px}.bsent-act small{color:var(--text-3);font-size:12.5px}' +
    '.bsent-go svg{width:17px;height:17px;margin-right:6px;vertical-align:-3px}' +
    '.bsent-mode{display:inline-flex;border:1px solid var(--border);border-radius:10px;overflow:hidden}.bsent-mode button{border:0;background:transparent;color:var(--text-2);padding:7px 12px;font:inherit;font-size:13px;cursor:pointer}.bsent-mode button.on{background:var(--accent);color:#fff}' +
    '.bsent-msg{border-radius:10px;padding:10px 14px;font-size:14px;margin-top:12px;background:var(--surface-2);border:1px solid var(--border);line-height:1.45}.bsent-msg.ok{border-color:rgba(34,197,94,.45);background:rgba(34,197,94,.1)}.bsent-msg.warn{border-color:rgba(245,158,11,.5);background:rgba(245,158,11,.1)}' +
    '.bsent-cle{margin-top:12px;border:1px dashed var(--border);border-radius:12px;padding:12px 14px;font-size:14px;line-height:1.5}.bsent-cle ol{margin:6px 0 10px;padding-left:20px}.bsent-cle form{display:flex;gap:8px;flex-wrap:wrap}.bsent-cle input{flex:1;min-width:0}' +
    '.bsent-lien{background:none;border:0;padding:0;color:var(--accent);font:inherit;font-size:13px;cursor:pointer;text-decoration:underline}' +
    '.bsent-appel{display:flex;flex-direction:column;gap:12px}' +
    '.bsent-tete{display:flex;align-items:center;gap:12px}.bsent-avatar{width:46px;height:46px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;background:linear-gradient(135deg,#8b5cf6,#6366f1)}' +
    '.bsent-tete b{display:block;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bsent-tete>div{flex:1;min-width:0}.bsent-tete small{color:var(--text-3);font-size:12.5px}' +
    '.bsent-chrono{font-variant-numeric:tabular-nums;font-weight:700;color:var(--text-2)}' +
    '.bsent-etat{display:inline-block;margin-top:2px;font-size:12.5px;font-weight:600;color:var(--text-2)}.bsent-etat.vendeur{color:#16a34a}.bsent-etat.erreur{color:#dc2626}' +
    '.bsent-fil{display:flex;flex-direction:column;gap:8px;max-height:min(46vh,420px);min-height:160px;overflow-y:auto;padding:12px;border-radius:12px;background:var(--surface-2);border:1px solid var(--border)}' +
    '.bsent-bulle{max-width:82%;padding:8px 12px;border-radius:14px;font-size:14.5px;line-height:1.4;word-wrap:break-word}.bsent-bulle small{display:block;font-size:11.5px;font-weight:600;opacity:.7;margin-bottom:2px}' +
    '.bsent-bulle.lui{align-self:flex-start;background:var(--surface,#fff);border:1px solid var(--border);border-bottom-left-radius:4px}.bsent-bulle.moi{align-self:flex-end;background:var(--accent);color:#fff;border-bottom-right-radius:4px}' +
    '.bsent-points{display:flex;gap:4px;padding:12px 14px}.bsent-points span{width:7px;height:7px;border-radius:50%;background:var(--text-3);animation:bsent-p 1.2s infinite}.bsent-points span:nth-child(2){animation-delay:.2s}.bsent-points span:nth-child(3){animation-delay:.4s}' +
    '@keyframes bsent-p{0%,80%,100%{opacity:.25}40%{opacity:1}}' +
    '.bsent-alerte{border-radius:10px;padding:8px 12px;font-size:13.5px;background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.45)}' +
    '.bsent-voix{display:flex;align-items:center;gap:12px}.bsent-dicte{flex:1;min-width:0;min-height:44px;padding:8px 12px;border-radius:12px;border:1px solid var(--border);font-size:14.5px;line-height:1.4}.bsent-dicte span{color:var(--text-3);font-size:13px}.bsent-dicte i{color:var(--text-3)}' +
    '.bsent-mic{width:52px;height:52px;border-radius:50%;flex:none;border:0;cursor:pointer;display:flex;align-items:center;justify-content:center;background:var(--surface-3,#e5e7eb);color:var(--text)}.bsent-mic svg{width:22px;height:22px}' +
    '.bsent-mic.on{background:#16a34a;color:#fff;box-shadow:0 0 0 0 rgba(22,163,74,.5);animation:bsent-on 1.6s infinite}.bsent-mic:disabled{opacity:.5;cursor:default}' +
    '@keyframes bsent-on{0%{box-shadow:0 0 0 0 rgba(22,163,74,.45)}70%{box-shadow:0 0 0 12px rgba(22,163,74,0)}100%{box-shadow:0 0 0 0 rgba(22,163,74,0)}}' +
    '.bsent-clavier{display:flex;gap:8px}.bsent-clavier input{flex:1;min-width:0}' +
    '.bsent-bas{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between}' +
    '.bsent-rouge{background:#dc2626;color:#fff;border-color:#dc2626}.bsent-rouge:hover{background:#b91c1c}' +
    '.bsent-note{display:flex;align-items:center;gap:16px;flex-wrap:wrap}.bsent-score{font-size:44px;font-weight:800;line-height:1}.bsent-score small{font-size:18px;color:var(--text-3);font-weight:700}' +
    '.bsent-score.b{color:#16a34a}.bsent-score.m{color:#d97706}.bsent-score.f{color:#dc2626}' +
    '.bsent-badge{display:inline-block;font-size:12.5px;font-weight:700;border-radius:999px;padding:3px 10px;background:var(--surface-2);border:1px solid var(--border)}.bsent-badge.ok{background:rgba(34,197,94,.12);border-color:rgba(34,197,94,.45);color:#15803d}' +
    '.bsent-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-top:14px}.bsent-cols h4{margin:0 0 6px;font-size:13.5px}.bsent-cols ul{margin:0;padding-left:18px;font-size:14px;line-height:1.5}' +
    '.bsent-obj{margin-top:12px;font-size:14px}.bsent-obj div{padding:7px 0;border-bottom:1px solid var(--border)}.bsent-obj div:last-child{border-bottom:0}.bsent-obj small{display:block;color:var(--text-2)}' +
    '.bsent-phrase{margin-top:12px;padding:10px 14px;border-left:3px solid var(--accent);background:var(--surface-2);border-radius:0 10px 10px 0;font-size:14.5px}' +
    '.bsent-cadre{width:100%;height:min(78vh,860px);border:1px solid var(--border);border-radius:12px;background:#fff;display:block}' +
    '.bsent-h{display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--border);font-size:14px}.bsent-h:last-child{border-bottom:0}.bsent-h b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bsent-h small{color:var(--text-3);white-space:nowrap}' +
    '.bsent-h em{font-style:normal;font-weight:700;min-width:44px;text-align:right}' +
    '.bsent-txt{margin:0;font-size:14px;line-height:1.5;color:var(--text-2)}' +
    '@media (max-width:640px){.bsent-card>*:not(.card-head){margin-left:12px;margin-right:12px}.bsent-bulle{max-width:90%}.bsent-h small{display:none}.bsent-score{font-size:38px}}';
  function css() {
    if (document.getElementById('bsent-css')) return;
    var s = document.createElement('style'); s.id = 'bsent-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  function initiales(t) { return String(t || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(function (x) { return x[0]; }).join('').toUpperCase() || '?'; }

  function vueAppel() {
    var A = S.appel, p = A.prospect;
    var nom = p ? (p.contact || p.entreprise) : 'Prospect type';
    return '<section class="card bsent-card"><header class="card-head"><div class="bsent-fh"><span class="bsent-logo' + (A.ia ? ' claude">' + IC.claude : '">' + SIMU) + '</span><div><h3 class="card-title">' + (A.ia ? 'Appel simulé avec Claude' : 'Appel simulé sans IA') + '</h3><p class="card-sub">' + esc(NIVEAUX[A.niveau][0] + ' · ' + OBJ_COURT[A.objectif]) + '</p></div></div></header>' +
      '<div class="bsent-appel"><div class="bsent-tete"><span class="bsent-avatar">' + esc(initiales(nom)) + '</span><div><b>' + esc(nom) + (p && p.contact && p.entreprise ? ' · ' + esc(p.entreprise) : '') + '</b><span class="bsent-etat" data-z="etat"></span></div><span class="bsent-chrono" data-z="chrono">0:00</span></div>' +
      '<div class="bsent-fil" data-z="fil" aria-live="polite"></div>' +
      '<div class="bsent-alerte" data-z="alerte" hidden></div>' +
      '<div class="bsent-voix" data-z="voix"><button type="button" class="bsent-mic" data-act="micro" aria-label="Ouvrir le micro">' + IC.mic + '</button><div class="bsent-dicte" data-z="dicte"></div><button type="button" class="btn btn-secondary btn-sm" data-act="envoyer-dicte" disabled>Envoyer</button></div>' +
      '<form class="bsent-clavier" data-z="clavier"><input class="input" name="reponse" autocomplete="off" placeholder="Votre réponse au prospect…" aria-label="Votre réponse"><button type="submit" class="btn btn-primary" data-act="envoyer">Envoyer</button></form>' +
      '<div class="bsent-bas"><button type="button" class="btn btn-ghost btn-sm" data-act="bascule">Répondre au clavier</button><span style="display:flex;gap:8px"><button type="button" class="btn btn-ghost btn-sm" data-act="abandonner">Annuler</button><button type="button" class="btn bsent-rouge" data-act="raccrocher">Raccrocher et voir ma note</button></span></div>' +
      '</div></section>';
  }

  function vueRapport() {
    var R = S.rapport, n = R.n, p = R.prospect;
    var c = n.note >= 7 ? 'b' : n.note >= 5 ? 'm' : 'f';
    var li = function (a) { return (a || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join(''); };
    return '<section class="card bsent-card bsent-rapport"><header class="card-head"><div class="bsent-fh"><span class="bsent-logo' + (R.ia ? ' claude">' + IC.claude : '">' + SIMU) + '</span><div><h3 class="card-title">Votre note</h3><p class="card-sub">' + esc((p ? p.entreprise : 'Prospect type') + ' · ' + duree(R.duree) + ' · ' + (R.ia ? 'notée par Claude' : 'note estimée sans IA')) + '</p></div></div></header>' +
      (n.alerte ? '<div class="bsent-msg warn">' + esc(n.alerte) + '</div>' : '') +
      '<div class="bsent-note"><span class="bsent-score ' + c + '">' + n.note + '<small>/10</small></span><div style="flex:1;min-width:200px"><p class="bsent-txt" style="color:var(--text)">' + esc(n.verdict) + '</p>' +
      '<span class="bsent-badge' + (n.objectif_atteint ? ' ok">Objectif atteint' : '">Objectif pas encore atteint') + '</span></div></div>' +
      '<div class="bsent-cols"><div><h4>Points forts</h4><ul>' + li(n.points_forts) + '</ul></div><div><h4>À améliorer en priorité</h4><ul>' + li(n.a_ameliorer) + '</ul></div></div>' +
      ((n.objections || []).length ? '<div class="bsent-obj"><h4 style="margin:6px 0 2px;font-size:13.5px">Objections</h4>' + n.objections.map(function (o) {
        return '<div>' + (o.bien_traitee ? '✅ ' : '⚠️ ') + esc(o.objection) + '<small>' + esc(o.conseil) + '</small></div>';
      }).join('') + '</div>' : '') +
      (n.phrase_a_essayer ? '<div class="bsent-phrase"><b>À essayer au prochain appel :</b> « ' + esc(n.phrase_a_essayer) + ' »</div>' : '') +
      '<details class="bsent-details"><summary>Revoir l’appel</summary><div class="bsent-fil" style="margin-top:8px;max-height:none">' + R.messages.map(function (m) {
        return '<div class="bsent-bulle ' + (m.de === 'prospect' ? 'lui' : 'moi') + '">' + esc(m.texte) + '</div>';
      }).join('') + '</div></details>' +
      '<div class="bsent-act"><button type="button" class="btn btn-primary bsent-go" data-act="demarrer">' + IC.tel + 'Recommencer</button>' +
      (p && p.telephone ? '<a class="btn btn-secondary" href="tel:' + esc(String(p.telephone).replace(/[^\d+]/g, '')) + '">Appeler ' + esc(p.entreprise) + ' pour de vrai</a>' : '') +
      '<button type="button" class="btn btn-ghost btn-sm" data-act="copier-rapport">Copier le compte rendu</button></div></section>';
  }

  function vueCle() {
    if (S.ia === null) return '';
    if (S.ia) {
      if (!S.admin || S.source !== 'crm') return S.cleMsg ? '<div class="bsent-msg ' + S.cleMsg.k + '">' + esc(S.cleMsg.t) + '</div>' : '';
      return (S.cleMsg ? '<div class="bsent-msg ' + S.cleMsg.k + '">' + esc(S.cleMsg.t) + '</div>' : '') +
        (S.voirCle ? '<div class="bsent-cle"><form data-form="cle"><input class="input" type="password" name="cle" placeholder="Nouvelle clé sk-ant-…" autocomplete="off" aria-label="Clé Claude"><button type="submit" class="btn btn-secondary btn-sm"' + (S.cleEnvoi ? ' disabled' : '') + '>' + (S.cleEnvoi ? 'Vérification…' : 'Remplacer') + '</button><button type="button" class="btn btn-ghost btn-sm" data-act="retirer-cle">Retirer la clé</button></form></div>' : '');
    }
    if (!S.admin) return '<div class="bsent-msg">Mode sans IA : le prospect enchaîne les objections du script. Pour un vrai prospect qui vous répond, demandez à un administrateur de brancher Claude ici.</div>';
    return '<div class="bsent-cle"><b>Brancher Claude (une fois pour toute l’équipe)</b><ol>' +
      '<li>Créez un compte sur <a href="https://console.anthropic.com" target="_blank" rel="noopener">console.anthropic.com</a> et ajoutez du crédit (rubrique Billing ; 5 $ suffisent pour commencer).</li>' +
      '<li>Rubrique API Keys : « Create Key », puis copiez la clé (elle commence par sk-ant-).</li><li>Collez-la ici. Elle est gardée chiffrée sur le serveur du CRM.</li></ol>' +
      '<form data-form="cle"><input class="input" type="password" name="cle" placeholder="sk-ant-…" autocomplete="off" aria-label="Clé Claude"><button type="submit" class="btn btn-primary btn-sm"' + (S.cleEnvoi ? ' disabled' : '') + '>' + (S.cleEnvoi ? 'Vérification…' : 'Brancher Claude') + '</button></form>' +
      '<p class="bsent-txt" style="margin-top:8px;font-size:12.5px">Comptez environ 15 à 20 centimes par simulation de 5 minutes. En attendant, le simulateur marche sans IA.</p>' +
      (S.cleMsg ? '<div class="bsent-msg ' + S.cleMsg.k + '">' + esc(S.cleMsg.t) + '</div>' : '') + '</div>';
  }

  function vuePreparer() {
    var liste = prospects();
    var p = prospect(S.prospectId);
    var titre = S.ia ? 'Simulateur d’appel avec Claude' : 'Simulateur d’appel';
    var sous = S.ia ? 'Claude joue votre prospect au téléphone. Parlez-lui comme pour de vrai, puis recevez votre note.' : 'Entraînez-vous à voix haute face à un prospect qui vous fait les objections de votre script.';
    return '<section class="card bsent-card"><header class="card-head"><div class="bsent-fh"><span class="bsent-logo' + (S.ia ? ' claude">' + IC.claude : '">' + SIMU) + '</span><div><h3 class="card-title">' + titre + '</h3><p class="card-sub">' + sous + '</p></div></div>' +
      (S.ia && S.admin && S.source === 'crm' ? '<div class="card-actions"><button type="button" class="bsent-lien" data-act="voir-cle">Clé Claude</button></div>' : '') + '</header>' +
      '<div class="bsent-grid">' +
      '<label>Prospect à appeler<select class="input" name="prospect"><option value="">Un prospect type (sans fiche)</option>' +
      liste.slice(0, 500).map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === S.prospectId ? ' selected' : '') + '>' + esc((x.entreprise || x.contact) + (x.ville ? ' · ' + x.ville : '')) + '</option>'; }).join('') + '</select></label>' +
      '<label>Difficulté<select class="input" name="niveau">' + Object.keys(NIVEAUX).map(function (k) { return '<option value="' + k + '"' + (P.niveau === k ? ' selected' : '') + '>' + NIVEAUX[k][0] + '</option>'; }).join('') + '</select></label>' +
      '<label>Objectif de l’appel<select class="input" name="objectif">' + Object.keys(OBJECTIFS).map(function (k) { return '<option value="' + k + '"' + (S.objectif === k ? ' selected' : '') + '>' + OBJ_COURT[k] + '</option>'; }).join('') + '</select></label>' +
      '</div>' +
      '<div class="bsent-grid" style="grid-template-columns:1fr;margin-top:10px"><label>Ce que vous vendez<input class="input" name="offre" value="' + esc(P.offre) + '"></label></div>' +
      '<details class="bsent-details"' + (S.modifiee ? ' open' : '') + '><summary>Voir ou modifier la fiche du prospect</summary>' +
      '<textarea class="input bsent-fiche" name="fiche" spellcheck="false" aria-label="Fiche du prospect">' + esc(S.fiche) + '</textarea>' +
      (S.modifiee ? '<button type="button" class="btn btn-ghost btn-sm" style="margin-top:8px" data-act="refaire">Refaire la fiche</button>' : '') + '</details>' +
      vueCle() +
      '<div class="bsent-act"><button type="button" class="btn btn-primary bsent-go" data-act="demarrer"' + (S.ia === null && window.BS_SERVER ? ' disabled' : '') + '>' + IC.tel + 'Démarrer l’appel</button>' +
      '<span class="bsent-mode" role="group" aria-label="Façon de répondre"><button type="button" data-mode="voix" class="' + (P.mode === 'voix' ? 'on' : '') + '">À la voix</button><button type="button" data-mode="clavier" class="' + (P.mode === 'clavier' ? 'on' : '') + '">Au clavier</button></span>' +
      '<small>' + (P.mode === 'voix' ? (Reco ? 'Autorisez le micro quand le navigateur le demande. Mettez le son.' : 'Ce navigateur ne reconnaît pas la voix : utilisez Chrome, Edge ou Safari, ou répondez au clavier.') : 'Le prospect parle quand même à voix haute : mettez le son.') + '</small></div>' +
      (p && p.telephone ? '<p class="bsent-txt" style="margin-top:10px;font-size:13px">Prêt ? Appelez ' + esc(p.entreprise) + ' au <a href="tel:' + esc(String(p.telephone).replace(/[^\d+]/g, '')) + '">' + esc(p.telephone) + '</a>.</p>' : '') +
      '</section>';
  }

  function rendre() {
    if (!racine || !racine.isConnected) return;
    if (S.appel) {
      if (!racine.querySelector('[data-z=fil]')) { racine.innerHTML = tete() + vueAppel(); }
      majAppel(); majChrono();
      return;
    }
    var zone = racine.querySelector('textarea[name=fiche]');
    if (zone && S.modifiee) S.fiche = zone.value;
    var pitch = S.integrable && S.ouvert
      ? '<section class="card bsent-card"><header class="card-head"><div class="bsent-fh"><span class="bsent-logo">' + LOGO + '</span><div><h3 class="card-title">Pitchbase</h3><p class="card-sub">Votre simulation, sans quitter le CRM.</p></div></div>' +
        '<div class="card-actions"><button type="button" class="btn btn-ghost btn-sm" data-act="fenetre">Ouvrir dans une fenêtre</button></div></header>' +
        '<iframe class="bsent-cadre" src="' + SITE + '" title="Pitchbase" allow="microphone; camera; autoplay; clipboard-read; clipboard-write; fullscreen"></iframe></section>'
      : '';
    racine.innerHTML = tete() + (S.rapport ? vueRapport() : '') + vuePreparer() + pitch +
      '<section class="card bsent-card"><header class="card-head"><div class="bsent-fh"><span class="bsent-logo">' + LOGO + '</span><div><h3 class="card-title">Avec Pitchbase</h3><p class="card-sub">Pitchbase s’ouvre dans une fenêtre à côté du CRM (il refuse d’être affiché dans un autre site).</p></div></div>' +
      '<div class="card-actions"><button type="button" class="btn btn-ghost btn-sm" data-act="ouvrir">Ouvrir Pitchbase</button></div></header>' +
      '<p class="bsent-txt">Il faut un compte Pitchbase (essai gratuit, puis abonnement par personne). Le CRM copie la fiche du prospect ci-dessus : collez-la dans un scénario Pitchbase.</p>' +
      (S.msg ? '<div class="bsent-msg ' + S.msg.k + '">' + esc(S.msg.t) + '</div>' : '') +
      '<div class="bsent-act"><button type="button" class="btn btn-secondary btn-sm" data-act="pitchbase">Copier la fiche et ouvrir Pitchbase</button><button type="button" class="btn btn-ghost btn-sm" data-act="copier">Copier la fiche</button></div></section>' +
      (P.historique.length ? '<section class="card bsent-card"><header class="card-head"><div><h3 class="card-title">Derniers entraînements</h3><p class="card-sub">Sur cet appareil.</p></div></header><div>' +
        P.historique.slice(0, 10).map(function (h) {
          var mode = h.mode === 'claude' ? 'Claude' : h.mode === 'script' ? 'Sans IA' : 'Pitchbase';
          return '<div class="bsent-h"><b>' + esc(h.nom) + '</b><small>' + esc(mode + ' · ' + (NIVEAUX[h.niveau] || NIVEAUX.normal)[0] + ' · ' + new Date(h.at).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })) + '</small>' +
            (typeof h.note === 'number' ? '<em>' + h.note + '/10</em>' : '') +
            (h.prospectId && prospect(h.prospectId) ? '<button type="button" class="btn btn-ghost btn-sm" data-refaire="' + esc(h.prospectId) + '">Rejouer</button>' : '') + '</div>';
        }).join('') + '</div></section>' : '');
  }
  function tete() {
    return '<div class="page-head"><div class="page-head-text"><h1 class="page-title">Entraînement</h1><p class="page-sub">Simulez l’appel face à un prospect joué par l’IA, à la voix, puis appelez pour de vrai.</p></div></div>';
  }

  function compteRendu() {
    var R = S.rapport; if (!R) return '';
    var n = R.n, l = ['Entraînement ' + (R.ia ? 'avec Claude' : 'sans IA') + ' : ' + (R.prospect ? R.prospect.entreprise : 'prospect type') + ' (' + NIVEAUX[R.niveau][0].toLowerCase() + ', ' + duree(R.duree) + ')', 'Note : ' + n.note + '/10. ' + n.verdict, ''];
    l.push('Points forts :'); (n.points_forts || []).forEach(function (x) { l.push('- ' + x); });
    l.push('', 'À améliorer :'); (n.a_ameliorer || []).forEach(function (x) { l.push('- ' + x); });
    if (n.phrase_a_essayer) l.push('', 'À essayer : « ' + n.phrase_a_essayer + ' »');
    l.push('', 'Transcription :'); R.messages.forEach(function (m) { l.push((m.de === 'prospect' ? 'Prospect' : 'Vous') + ' : ' + m.texte); });
    return l.join('\n');
  }

  function brancher(el) {
    el.addEventListener('change', function (ev) {
      var n = ev.target.name;
      if (n === 'prospect') { S.prospectId = ev.target.value; S.objectif = ''; S.msg = null; regenerer(); rendre(); }
      if (n === 'niveau') { P.niveau = ev.target.value; ecrire(); if (!S.modifiee) regenerer(); rendre(); }
      if (n === 'objectif') { S.objectif = ev.target.value; if (!S.modifiee) regenerer(); rendre(); }
      if (n === 'offre') { P.offre = ev.target.value.trim() || P.offre; ecrire(); if (!S.modifiee) regenerer(); rendre(); }
    });
    el.addEventListener('input', function (ev) { if (ev.target.name === 'fiche') { S.fiche = ev.target.value; S.modifiee = true; } });
    el.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var f = ev.target;
      if (f.getAttribute('data-form') === 'cle') { var v = (f.querySelector('input[name=cle]') || {}).value || ''; if (v.trim()) enregistrerCle(v.trim()); return; }
      if (f.getAttribute('data-z') === 'clavier') { var c = f.querySelector('input[name=reponse]'); envoyer(c && c.value); }
    });
    el.addEventListener('click', function (ev) {
      var m = ev.target.closest('[data-mode]');
      if (m) { P.mode = m.getAttribute('data-mode'); ecrire(); rendre(); return; }
      var t = ev.target.closest('[data-act],[data-refaire]'); if (!t) return;
      if (t.hasAttribute('data-refaire')) { S.prospectId = t.getAttribute('data-refaire'); S.objectif = ''; S.rapport = null; regenerer(); S.msg = null; rendre(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      var a = t.getAttribute('data-act'), A = S.appel;
      if (a === 'demarrer') demarrer();
      if (a === 'raccrocher') terminer();
      if (a === 'abandonner') abandonner();
      if (a === 'reessayer' && A) { A.alerte = ''; repondre(A); }
      if (a === 'envoyer-dicte' && A) envoyer((A.dicte + ' ' + A.interim).trim());
      if (a === 'micro' && A) { if (A.ecoute) { arreterEcoute(); majAppel(); } else ecouter(); }
      if (a === 'bascule' && A) { A.mode = A.mode === 'voix' ? 'clavier' : 'voix'; A.alerte = ''; if (A.mode === 'voix') ecouter(); else { arreterEcoute(); } majAppel(); }
      if (a === 'pitchbase') lancerPitchbase();
      if (a === 'copier') copier(S.fiche).then(function (ok) { S.msg = ok ? { k: 'ok', t: 'Fiche copiée : collez-la dans Pitchbase (Ctrl + V).' } : { k: 'warn', t: 'Copie impossible : ouvrez la fiche ci-dessus, sélectionnez le texte et copiez-le.' }; rendre(); });
      if (a === 'copier-rapport') copier(compteRendu()).then(function (ok) { t.textContent = ok ? 'Compte rendu copié' : 'Copie impossible'; });
      if (a === 'refaire') { regenerer(); rendre(); }
      if (a === 'voir-cle') { S.voirCle = !S.voirCle; S.cleMsg = null; rendre(); }
      if (a === 'retirer-cle') retirerCle();
      if (a === 'ouvrir' || a === 'fenetre') { fenetre = window.open(SITE, 'pitchbase', 'width=1180,height=860'); if (a === 'fenetre') { S.ouvert = false; rendre(); } }
    });
    el.addEventListener('keydown', function (ev) {
      var A = S.appel; if (!A || A.mode !== 'voix' || ev.key !== 'Enter' || ev.target.closest('input,textarea,select')) return;
      if (A.etat === 'vendeur' && (A.dicte || A.interim)) { ev.preventDefault(); envoyer((A.dicte + ' ' + A.interim).trim()); }
    });
  }

  function verifierCadre() {
    if (S.integrable !== null || !window.BS_SERVER) { if (!window.BS_SERVER) S.integrable = false; return; }
    fetch('/api/integrations/cadre/pitchbase', { credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart' } })
      .then(function (r) { return r.ok ? r.json() : { integrable: false }; })
      .then(function (b) { S.integrable = !!b.integrable; if (!S.appel) rendre(); }, function () { S.integrable = false; });
  }

  // Quitter la page pendant un appel : on coupe le micro et la voix.
  window.addEventListener('hashchange', function () { if (S.appel && !/entrainement/.test(location.hash)) abandonner(); });

  function monter(el) {
    if (!el) return;
    css();
    if (el === racine && el.__bsEnt) return;
    racine = el; el.__bsEnt = true; el.classList.add('bsent-root');
    brancher(el);
    if (!S.fiche || !S.modifiee) regenerer();
    rendre();
    if (S.ia === null) etatIA();
    verifierCadre();
  }

  window.bsEntrainement = { monter: monter, fiche: fiche, _etat: S, _noteScript: noteScript, _repliqueScript: repliqueScript };
})();
