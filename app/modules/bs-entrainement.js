/* Blackstart CRM : rubrique « Simulations IA » (ancienne « Entraînement »).
 *
 * Simulateur d'appel dans le CRM, en trois colonnes : scénarios à gauche (modèles prêts à l'emploi avec des
 * prospects fictifs, ou vos prospects du CRM), appel au centre, profil du prospect, analyse de performance et
 * recommandations à droite. Claude joue le prospect à la voix (micro + voix du navigateur) ou au clavier, puis note
 * l'appel sur 10 avec six compétences sur 100. Sans clé Claude, un prospect « sans IA » enchaîne les objections du
 * script et l'appel reçoit une note estimée. La fiche envoyée à Claude ne contient ni nom de contact, ni e-mail,
 * ni téléphone.
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
  if (!P.appels || typeof P.appels !== 'object') P.appels = {};
  if (!P.notes || typeof P.notes !== 'object') P.notes = {};

  var Reco = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var synth = window.speechSynthesis || null;

  // ia : null (on ne sait pas encore), true, false. appel : simulation en cours. rapport : note de la dernière simulation.
  // sel : scénario choisi (modèle, prospect du CRM ou scénario personnalisé). filtre : famille affichée à gauche.
  var S = { prospectId: '', objectif: '', fiche: '', modifiee: false, integrable: null, ouvert: false, msg: null,
    ia: null, admin: false, source: null, cleMsg: null, cleEnvoi: false, voirCle: false, appel: null, rapport: null,
    sel: { type: 'modele', id: 'ia-b2b' }, filtre: 'tout', onglet: 'transcription' };
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
    rappel: 'Rattraper un prospect qui n’avait pas répondu et obtenir un rendez-vous.',
    decouverte: 'Comprendre son besoin, son budget et son calendrier, puis fixer un rendez-vous pour présenter une proposition.'
  };
  var OBJ_COURT = { rdv: 'Obtenir un rendez-vous', relance: 'Relancer une proposition', signature: 'Conclure la vente', rappel: 'Rattraper un injoignable', decouverte: 'Découvrir le besoin' };
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
      // Jamais le nom du contact, son e-mail ni son téléphone : seulement l'entreprise et le contexte.
      l.push('Prospect à jouer : le dirigeant de ' + p.entreprise + (p.secteur ? ' (' + p.secteur + ')' : '') + (p.ville ? ', à ' + p.ville : '') + '.');
      if (p.site) l.push('Son site : ' + p.site);
      var appels = (p.callLog || []).slice().sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
      var h = 'Où on en est : prospect « ' + (STATUTS[p.statut] || p.statut || 'nouveau') + ' »';
      if (appels.length) h += ', ' + appels.length + ' appel' + (appels.length > 1 ? 's' : '') + ' déjà passé' + (appels.length > 1 ? 's' : '') + ' (dernier : ' + (RESULTATS[appels[0].outcome] || appels[0].outcome || 'sans résultat') + (appels[0].date ? ', le ' + dateFr(appels[0].date) : '') + ')';
      l.push(h + '.');
      var notes = String(p.notes || '').replace(/\s+/g, ' ').trim();
      var dernieres = appels.map(function (a) { return String(a.note || '').replace(/\s+/g, ' ').trim(); }).filter(Boolean).slice(0, 2);
      if (notes || dernieres.length) l.push('Ce que je sais déjà : ' + sansCoordonnees([notes].concat(dernieres).filter(Boolean).join(' · ')).slice(0, 700));
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
  function sansCoordonnees(t) {
    var p = prospect(S.prospectId);
    var x = String(t || '').replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '[e-mail]').replace(/\+?\d[\d .-]{7,}\d/g, '[téléphone]');
    if (p && p.contact) String(p.contact).split(/\s+/).filter(function (m) { return m.length > 2; }).forEach(function (m) { x = x.split(m).join('[contact]'); });
    return x;
  }

  // ---------------------------------------------------------------- scénarios prêts à l'emploi (personnages fictifs)
  var FAMILLES = { prospection: 'Prospection', decouverte: 'Découverte', objections: 'Objections', closing: 'Closing', relance: 'Relance' };
  var SCENARIOS = [
    { id: 'ia-b2b', titre: 'Vente de solution IA B2B', famille: 'prospection', niveau: 'difficile', duree: '12-15 min', objectif: 'rdv', tags: ['Expert', 'B2B', 'SaaS'], conseille: true,
      persona: { nom: 'Thomas Bernard', poste: 'Directeur informatique', entreprise: 'TechSolutions', ville: 'Paris', secteur: 'Services informatiques', taille: '120 salariés', traits: ['Analytique', 'Professionnel', 'Prudent', 'Sensible au prix'] },
      contexte: 'TechSolutions veut automatiser son support client. Thomas a déjà vu deux démonstrations d’autres éditeurs et doute du retour sur investissement.',
      offre: 'un assistant IA qui répond aux demandes du support client et les trie automatiquement',
      objections: ['« On a déjà testé deux outils, sans résultat »', '« Quel retour sur investissement concret ? »', '« Nos données ne doivent pas sortir de l’entreprise »', '« Le budget est bouclé pour cette année »'] },
    { id: 'agence', titre: 'Cold call : agence digitale', famille: 'prospection', niveau: 'normal', duree: '8-12 min', objectif: 'rdv', tags: ['B2B', 'Appel à froid'],
      persona: { nom: 'Julie Moreau', poste: 'Gérante', entreprise: 'Studio Pixel', ville: 'Lyon', secteur: 'Agence web', taille: '9 salariés', traits: ['Pressée', 'Directe', 'Curieuse'] },
      contexte: 'Appel à froid un lundi matin. Studio Pixel perd des contrats faute de relancer ses devis.',
      offre: 'un CRM sur mesure qui relance automatiquement les devis',
      objections: ['« Je n’ai pas le temps, là »', '« On a déjà un tableur qui marche »', '« Envoyez-moi une documentation »'] },
    { id: 'prix', titre: 'Objection prix : version difficile', famille: 'objections', niveau: 'difficile', duree: '8-10 min', objectif: 'signature', tags: ['Négociation', 'BTP'],
      persona: { nom: 'Marc Lefèvre', poste: 'Gérant', entreprise: 'Lefèvre Bâtiment', ville: 'Bordeaux', secteur: 'BTP', taille: '25 salariés', traits: ['Négociateur', 'Méfiant', 'Pressé'] },
      contexte: 'Vous avez envoyé une proposition à 4 900 €. Marc vous rappelle pour négocier.', decroche: 'Oui, bonjour, Marc Lefèvre. Je vous rappelle au sujet de votre proposition.',
      offre: 'un CRM et une campagne de génération de leads pour 4 900 €',
      objections: ['« C’est trop cher »', '« Un concurrent fait moitié prix »', '« Faites-moi 30 % de remise »', '« Je dois en parler à mon associé »'] },
    { id: 'hotel', titre: 'Appel de découverte : hôtel', famille: 'decouverte', niveau: 'normal', duree: '10-12 min', objectif: 'decouverte', tags: ['Hôtellerie', 'Entrant'],
      persona: { nom: 'Claire Dubois', poste: 'Directrice', entreprise: 'Hôtel Les Mimosas', ville: 'Nice', secteur: 'Hôtellerie', taille: '35 chambres', traits: ['Ouverte', 'Bavarde', 'Indécise'] },
      contexte: 'Claire a rempli le formulaire de votre site : elle veut plus de réservations en direct, hors saison surtout.',
      offre: 'un CRM de réservation et des campagnes pour remplir les chambres hors saison',
      objections: ['« On passe déjà par Booking »', '« Je n’ai personne pour s’en occuper »', '« Combien ça coûte ? »'] },
    { id: 'relance', titre: 'Relance client', famille: 'relance', niveau: 'facile', duree: '5-8 min', objectif: 'relance', tags: ['Devis', 'Relance'],
      persona: { nom: 'Sophie Laurent', poste: 'Fondatrice', entreprise: 'Institut Belle Peau', ville: 'Nantes', secteur: 'Esthétique', taille: '4 salariées', traits: ['Aimable', 'Occupée', 'Hésitante'] },
      contexte: 'Devis envoyé il y a dix jours, sans réponse depuis.',
      offre: 'un site avec prise de rendez-vous en ligne et rappels par SMS',
      objections: ['« Je n’ai pas eu le temps de regarder »', '« Je dois réfléchir »'] },
    { id: 'saas-pme', titre: 'Vente SaaS : PME', famille: 'decouverte', niveau: 'normal', duree: '10-15 min', objectif: 'rdv', tags: ['SaaS', 'Industrie'],
      persona: { nom: 'David Martin', poste: 'Directeur administratif et financier', entreprise: 'Martin Industrie', ville: 'Lille', secteur: 'Industrie', taille: '60 salariés', traits: ['Rigoureux', 'Chiffré', 'Ne décide pas seul'] },
      contexte: 'David compare trois logiciels de gestion commerciale. Le PDG signera.',
      offre: 'un CRM avec tableaux de bord des ventes',
      objections: ['« Je ne décide pas seul »', '« Montrez-moi des chiffres »', '« La migration va prendre des mois »'] },
    { id: 'closing', titre: 'Closing : haut niveau', famille: 'closing', niveau: 'difficile', duree: '15-20 min', objectif: 'signature', tags: ['Expert', 'High-ticket'],
      persona: { nom: 'Nathalie Roux', poste: 'PDG', entreprise: 'Roux Conseil', ville: 'Paris', secteur: 'Conseil', taille: '40 salariés', traits: ['Exigeante', 'Rapide', 'Stratégique'] },
      contexte: 'Troisième rendez-vous. Proposition à 15 000 € pour un CRM et six mois de génération de leads.', decroche: 'Nathalie Roux. Je vous écoute, j’ai un quart d’heure.',
      offre: 'un CRM et six mois de génération de leads pour 15 000 €',
      objections: ['« Le moment n’est pas idéal »', '« Garantissez-moi des résultats »', '« Je veux m’engager trois mois seulement »'] }
  ];
  function modele(id) { return SCENARIOS.filter(function (m) { return m.id === id; })[0] || null; }
  function modeleCourant() { return S.sel.type === 'modele' ? modele(S.sel.id) : null; }
  function niveauCourant() { var m = modeleCourant(); return m ? m.niveau : P.niveau; }
  function cleCourante() { return S.sel.type === 'modele' ? 'm:' + S.sel.id : S.prospectId ? 'p:' + S.prospectId : 'perso'; }
  function titreCourant() {
    var m = modeleCourant(), p = m ? null : prospect(S.prospectId);
    return m ? m.titre : p ? 'Appel : ' + (p.entreprise || p.contact) : 'Scénario personnalisé';
  }
  function dernier(cle) { return P.appels[cle] || null; }
  // Dernier appel de chaque scénario (10 scénarios au plus) : transcription, note et compétences.
  function garderAppel(cle, rec) {
    P.appels[cle] = rec;
    Object.keys(P.appels).sort(function (x, y) { return String(P.appels[y].at).localeCompare(String(P.appels[x].at)); }).slice(10).forEach(function (k) { delete P.appels[k]; });
    ecrire();
  }
  function ficheModele(m) {
    var x = m.persona;
    return ['Appel de prospection B2B en français. Je suis commercial chez ' + moi() + '. Je vends ' + m.offre + '.', '',
      'Prospect à jouer : ' + x.nom + ', ' + x.poste.toLowerCase() + ' de ' + x.entreprise + ' (' + x.secteur + ', ' + x.taille + '), à ' + x.ville + '.',
      'Situation : ' + m.contexte, '',
      'Caractère : ' + x.traits.join(', ').toLowerCase() + '. ' + NIVEAUX[m.niveau][1],
      'Objections à me faire, une à la fois et naturellement : ' + m.objections.join(', ') + '.',
      'Mon objectif : ' + OBJECTIFS[m.objectif], '',
      'À la fin, note mon appel sur 10 et dis-moi les 3 choses à améliorer en priorité.'].join('\n');
  }
  function regenerer() {
    var m = modeleCourant();
    if (m) { S.objectif = m.objectif; S.fiche = ficheModele(m); S.modifiee = false; return; }
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
  // Voix d'homme ou de femme selon le prénom du prospect (Julie, Claire, Nathalie… ont une voix féminine).
  var voix = { f: null, h: null, defaut: null };
  var FEMMES = /^(julie|claire|sophie|nathalie|marie|anne|camille|léa|lea|emma|chloé|chloe|sarah|laura|céline|celine|isabelle|sandrine|valérie|valerie|aminata|fatou|awa|grace|nadia|inès|ines|audrey|amélie|amelie|élodie|elodie|caroline|charlotte|florence|martine|christine|catherine|sylvie|aurélie|aurelie|stéphanie|stephanie|mélanie|melanie|manon|lucie|clara|zoé|zoe|eva|rose|fanny|karine|laetitia|delphine|virginie|vanessa|pauline|juliette|mathilde|alice|hélène|helene|agnès|agnes|béatrice|beatrice|brigitte|nicole|monique|patricia|corinne|jessica|jennifer|mariam|yasmine|salma|nora|sabrina)$/i;
  var NOMS_F = /amélie|amelie|audrey|denise|julie|marie|aurélie|aurelie|céline|celine|virginie|hortense|brigitte|vivienne|eloise|éloïse|charline|coralie|joséphine|josephine|google|female|femme/i;
  var NOMS_H = /thomas|henri|paul|daniel|nicolas|rémi|remi|antoine|claude|jacques|gérard|gerard|yves|alain|jean|male|homme/i;
  function femme(nom) {
    var prenom = String(nom || '').trim().split(/[\s-]+/)[0] || '';
    return FEMMES.test(prenom) || /(ette|elle|ine|ie|ienne)$/i.test(prenom);
  }
  function choisirVoix() {
    if (!synth) return;
    var v = synth.getVoices().filter(function (x) { return /^fr(-|_|$)/i.test(x.lang); });
    var bonnes = /natural|online|neural|premium|enhanced/i;
    function meilleure(liste) { return liste.filter(function (x) { return bonnes.test(x.name) && /fr.FR/i.test(x.lang); })[0] || liste.filter(function (x) { return /fr.FR/i.test(x.lang); })[0] || liste[0] || null; }
    var f = v.filter(function (x) { return NOMS_F.test(x.name) && !/\bmale\b/i.test(x.name); });
    var h = v.filter(function (x) { return NOMS_H.test(x.name) || (!NOMS_F.test(x.name) && /\bmale\b/i.test(x.name)); });
    var defaut = meilleure(v);
    voix = { f: meilleure(f), h: meilleure(h) || defaut, defaut: defaut };
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
      u.lang = 'fr-FR'; u.rate = 1.04;
      var f = A && femme(nomProspect(A)), choix = f ? voix.f || voix.defaut : voix.h;
      if (choix) u.voice = choix;
      if (f && !voix.f) u.pitch = 1.25; // aucune voix de femme installée : voix plus aiguë
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
    var presente = /je m.appelle|je suis|de la part de|ici /i.test(v[0] || '') || (v[0] || '').toLowerCase().indexOf(moi().toLowerCase()) >= 0;
    if (presente) { note += 1; forts.push('Vous vous présentez dès le début.'); } else amel.push('Présentez-vous en une phrase au début : prénom, société, raison de l’appel.');
    var x = A.modele ? A.modele.persona : p, bas = tout.toLowerCase();
    var noms = x ? [String(x.entreprise || '').split(' ')[0]].concat(String(x.contact || x.nom || '').split(/\s+/)).filter(function (m) { return m.length > 2; }) : [];
    var perso = noms.some(function (m) { return bas.indexOf(m.toLowerCase()) >= 0; });
    if (perso) { note += 1; forts.push('Vous personnalisez avec le nom du prospect.'); }
    var moy = mots.reduce(function (a, b) { return a + b; }, 0) / Math.max(1, mots.length);
    if (moy >= 8 && moy <= 60) note += 1; else if (moy < 8) amel.push('Vos réponses sont très courtes : face à une objection, reconnaissez-la puis rebondissez avec un bénéfice concret.'); else amel.push('Vos répliques sont longues : visez 2 ou 3 phrases, puis laissez parler le prospect.');
    var trait = v.slice(1).filter(function (t) { return t.split(/\s+/).length >= 8; }).length;
    note += Math.min(2, trait * 0.5);
    note = Math.max(0, Math.min(10, Math.round(note)));
    if (v.length < 3) { note = Math.min(note, 3); amel.unshift('L’appel a été très court : tenez jusqu’à la demande de rendez-vous.'); }
    if (!(rdv && A.fin)) note = Math.min(note, 8); // estimation : pas de note maximale sans rendez-vous accepté
    if (!forts.length) forts.push('Vous êtes allé au bout de l’appel.');
    var reform = /je comprends|si je comprends bien|vous voulez dire|autrement dit|effectivement|je vous entends/i.test(tout);
    var benef = (tout.match(/gagner|économiser|economiser|temps|clients?\b|chiffre|résultat|resultat|rentab|automati|retour sur|€|euros/gi) || []).length;
    var competences = { ouverture: Math.min(100, (presente ? 80 : 35) + (perso ? 10 : 0)), ecoute: Math.min(100, (q ? 60 : 40) + (reform ? 20 : 0)), questions: Math.min(100, 30 + q * 20),
      valeur: Math.min(90, 40 + benef * 12), objections: Math.min(90, 40 + trait * 15), conclusion: rdv ? 85 : 30 };
    if (v.length < 3) Object.keys(competences).forEach(function (k) { competences[k] = Math.min(competences[k], 40); });
    return { note: note, verdict: rdv ? 'Appel mené jusqu’à la proposition de rendez-vous.' : 'Il manque une demande d’engagement claire.', objectif_atteint: rdv && A.fin,
      points_forts: forts.slice(0, 3), a_ameliorer: amel.slice(0, 3), objections: [], phrase_a_essayer: 'Je comprends. Justement, 20 minutes suffisent pour voir si ça vaut le coup : mardi 10 h ou jeudi 14 h, qu’est-ce qui vous arrange ?', competences: competences, estimee: true };
  }

  // ---------------------------------------------------------------- appel
  function decroche(p, m, niveau) {
    if (m && m.decroche) return m.decroche;
    if (!p && !m) return 'Allô, oui ?';
    if (niveau === 'difficile') return 'Oui ? C’est pour quoi ?';
    var ent = m ? m.persona.entreprise : p.entreprise;
    return ent ? String(ent).slice(0, 60) + ', bonjour ?' : 'Allô, oui ?';
  }
  function ecoule(A) { return Math.round((Date.now() - A.debut) / 1000); }
  function demarrer() {
    var zone = racine && racine.querySelector('textarea[name=fiche]');
    if (zone && S.modifiee) S.fiche = zone.value;
    var m = modeleCourant(), p = m ? null : prospect(S.prospectId), niveau = niveauCourant();
    var A = { debut: Date.now(), messages: [], etat: 'prospect', mode: P.mode === 'voix' && Reco ? 'voix' : 'clavier', ia: !!S.ia, prospect: p, modele: m, cle: cleCourante(), titre: titreCourant(),
      fiche: S.fiche, niveau: niveau, objectif: m ? m.objectif : S.objectif || 'rdv', graine: Math.floor(Math.random() * 5), dicte: '', interim: '', alerte: P.mode === 'voix' && !Reco ? 'Votre navigateur ne reconnaît pas la voix : répondez au clavier (Chrome, Edge et Safari le permettent).' : '' };
    S.appel = A; S.rapport = null; S.msg = null;
    rendre();
    var premiere = decroche(p, m, niveau);
    A.messages.push({ de: 'prospect', texte: premiere, t: 0 });
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
    A.messages.push({ de: 'vendeur', texte: t, t: ecoule(A) }); A.dicte = ''; A.interim = ''; A.alerte = '';
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
      A.messages.push({ de: 'prospect', texte: b.texte, t: ecoule(A) }); A.etat = 'prospect'; A.fin = !!b.fin;
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
    var p = A.prospect, ia = A.ia && !n.estimee;
    var rec = { at: new Date().toISOString(), titre: A.titre, duree: A.duree, niveau: A.niveau, objectif: A.objectif, ia: ia, n: n, messages: A.messages.slice(-80), prospectId: p ? p.id : '' };
    garderAppel(A.cle, rec);
    S.rapport = A.cle; S.onglet = 'analyse'; S.appel = null;
    memoriser({ at: rec.at, cle: A.cle, titre: A.titre, prospectId: rec.prospectId, nom: p ? p.entreprise : A.modele ? A.modele.persona.entreprise : 'Prospect type', niveau: A.niveau, note: n.note, mode: ia ? 'claude' : 'script' });
    noterSurFiche(p, 'Simulation IA ' + (ia ? 'avec Claude' : 'sans IA') + ' sur ce prospect : ' + n.note + '/10' + (n.objectif_atteint ? ', objectif atteint' : '') + ' (' + NIVEAUX[A.niveau][0].toLowerCase() + ')');
    rendre();
    try { racine.querySelector('.bsent-onglets').scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* rien */ }
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
  function nomProspect(A) { return A.modele ? A.modele.persona.nom : A.prospect ? (A.prospect.contact || A.prospect.entreprise) : 'Prospect'; }
  function sousProspect(A) { return A.modele ? A.modele.persona.poste + ' · ' + A.modele.persona.entreprise : A.prospect && A.prospect.contact ? A.prospect.entreprise || '' : ''; }
  function monNom() { var u = window.BS_SERVER && window.BS_SERVER.user; return (u && u.name) || 'Vous'; }
  function bulle(m, nom, sous) {
    var lui = m.de === 'prospect';
    return '<div class="bsent-msgl ' + (lui ? 'lui' : 'moi') + '">' + (lui ? '<span class="bsent-av">' + esc(initiales(nom)) + '</span>' : '') +
      '<div class="bsent-msgc">' + (lui ? '<small><b>' + esc(nom) + '</b>' + (sous ? ' · ' + esc(sous) : '') + '</small>' : '') +
      '<div class="bsent-bulle ' + (lui ? 'lui' : 'moi') + '">' + esc(m.texte) + (m.t != null ? '<time>' + duree(m.t) + '</time>' : '') + '</div></div>' +
      (lui ? '' : '<span class="bsent-av moi">' + esc(initiales(monNom())) + '</span>') + '</div>';
  }
  function majAppel() {
    var A = S.appel; if (!A || !racine) return;
    var fil = racine.querySelector('[data-z=fil]'); if (!fil) return;
    var nom = nomProspect(A), sous = sousProspect(A);
    fil.innerHTML = A.messages.map(function (m) { return bulle(m, nom, sous); }).join('') +
      (A.etat === 'attente' ? '<div class="bsent-msgl lui"><span class="bsent-av">' + esc(initiales(nom)) + '</span><div class="bsent-bulle lui bsent-points"><span></span><span></span><span></span></div></div>' : '');
    fil.scrollTop = fil.scrollHeight;
    var etat = racine.querySelector('[data-z=etat]');
    if (etat) { etat.textContent = A.etat === 'vendeur' && A.mode === 'voix' && A.ecoute ? 'À vous : parlez' : ETATS[A.etat] || ''; etat.className = 'bsent-etat ' + A.etat; }
    var al = racine.querySelector('[data-z=alerte]');
    if (al) { al.hidden = !A.alerte; al.innerHTML = A.alerte ? esc(A.alerte) + (A.etat === 'erreur' ? ' <button type="button" class="btn btn-ghost btn-sm" data-act="reessayer">Réessayer</button>' : '') : ''; }
    var voixZ = racine.querySelector('[data-z=voix]'), clavier = racine.querySelector('[data-z=clavier]');
    if (voixZ) voixZ.hidden = A.mode !== 'voix';
    if (clavier) clavier.hidden = A.mode === 'voix';
    var mic = racine.querySelector('[data-act=micro]');
    if (mic) { mic.classList.toggle('on', !!A.ecoute); mic.disabled = A.etat !== 'vendeur' || A.mode !== 'voix'; mic.setAttribute('aria-label', A.ecoute ? 'Micro ouvert' : 'Ouvrir le micro'); }
    var champ = racine.querySelector('input[name=reponse]'), bout = racine.querySelector('[data-act=envoyer]');
    if (champ) champ.disabled = A.etat !== 'vendeur';
    if (bout) bout.disabled = A.etat !== 'vendeur';
    var bascule = racine.querySelector('[data-act=bascule]');
    if (bascule) { bascule.hidden = !Reco; bascule.textContent = A.mode === 'voix' ? 'Répondre au clavier' : 'Répondre à la voix'; }
    Array.prototype.forEach.call(racine.querySelectorAll('[data-act=raccrocher]'), function (b) { b.disabled = A.etat === 'notation'; });
    Array.prototype.forEach.call(racine.querySelectorAll('.bsent-onde'), function (o) { o.classList.toggle('lui', A.etat === 'prospect'); o.classList.toggle('moi', !!A.ecoute && A.etat === 'vendeur'); });
    var me = racine.querySelector('[data-z=micro-etat]'); if (me) me.textContent = A.mode !== 'voix' ? 'Clavier' : A.ecoute ? 'Activé' : 'En attente';
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
    var m = modeleCourant(), p = m ? null : prospect(S.prospectId);
    memoriser({ at: new Date().toISOString(), cle: cleCourante(), titre: titreCourant(), prospectId: p ? p.id : '', nom: p ? p.entreprise : m ? m.persona.entreprise : 'Prospect type', niveau: niveauCourant(), mode: 'pitchbase' });
    noterSurFiche(p, 'Entraînement Pitchbase sur ce prospect (' + NIVEAUX[niveauCourant()][0].toLowerCase() + ')');
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
  function svg(d, plein) { return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="' + (plein ? 'currentColor' : 'none') + '" stroke="' + (plein ? 'none' : 'currentColor') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; }
  var IC = {
    tel: svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'),
    mic: svg('<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/>'),
    raccrocher: svg('<path d="M2.6 14.6c5.4-4.8 13.4-4.8 18.8 0 .5.4.6 1.2.1 1.7l-2 2.2c-.4.4-1 .5-1.5.2l-2.6-1.4a1.2 1.2 0 0 1-.6-1.1v-1.9a12.4 12.4 0 0 0-5.6 0v1.9c0 .5-.2.9-.6 1.1l-2.6 1.4c-.5.3-1.1.2-1.5-.2l-2-2.2a1.2 1.2 0 0 1 .1-1.7z"/>', true),
    claude: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l1.6 5.2 5.2-2.3-3.1 4.7 5.3 1.9-5.3 1.9 3.1 4.7-5.2-2.3L12 21.5l-1.6-5.2-5.2 2.3 3.1-4.7L3 12l5.3-1.9-3.1-4.7 5.2 2.3z" fill="#d97757"/></svg>',
    horloge: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    chevron: svg('<path d="M9 6l6 6-6 6"/>'),
    recherche: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    etincelle: svg('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>'),
    cible: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>'),
    courbe: svg('<path d="M4 19V5M4 19h16M8 15l3-4 3 2 5-6"/>'),
    profil: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="11" r="2.5"/><path d="M5.5 17c.8-1.8 2-2.6 3.5-2.6s2.7.8 3.5 2.6M14 10h4M14 14h3"/>'),
    batiment: svg('<path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 10h4a1 1 0 0 1 1 1v10M3 21h18M8 8h3M8 12h3M8 16h3"/>'),
    lieu: svg('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    ext: svg('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    onde: svg('<path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"/>'),
    couronne: svg('<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>'),
    relance: svg('<path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6"/>'),
    langue: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>'),
    voix: svg('<path d="M11 5L6 9H3v6h3l5 4zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>')
  };
  var TEINTE = { prospection: '#3b82f6', decouverte: '#06b6d4', objections: '#f97316', closing: '#eab308', relance: '#8b5cf6' };
  var ICF = { prospection: IC.tel, decouverte: IC.recherche, objections: IC.cible, closing: IC.couronne, relance: IC.relance };
  var COMP = [['ouverture', 'Ouverture'], ['ecoute', 'Écoute active'], ['questions', 'Questions'], ['valeur', 'Proposition de valeur'], ['objections', 'Objections'], ['conclusion', 'Conclusion']];
  // Compétence la plus faible → scénario pour la travailler.
  var EXO = { ouverture: ['agence', 'Accroche des 30 premières secondes'], ecoute: ['hotel', 'Écoute active et reformulation'], questions: ['saas-pme', 'Questions de découverte approfondies'],
    valeur: ['ia-b2b', 'Proposition de valeur chiffrée'], objections: ['prix', 'Gestion des objections sur le prix'], conclusion: ['closing', 'Techniques de closing'] };

  var CSS = '.bsent-root{display:flex;flex-direction:column;gap:16px;container-type:inline-size}.bsent-root [hidden]{display:none!important}' +
    '.bsent-3{display:grid;gap:16px;grid-template-columns:minmax(0,1fr);grid-template-areas:"c" "d" "g"}' +
    '.bsent-g{grid-area:g;min-width:0}.bsent-c{grid-area:c;min-width:0;display:flex;flex-direction:column;gap:16px}.bsent-d{grid-area:d;min-width:0;display:flex;flex-direction:column;gap:16px}' +
    '@container (min-width:860px){.bsent-3{grid-template-columns:284px minmax(0,1fr);grid-template-areas:"g c" "g d";align-items:start}}' +
    '@container (min-width:1120px){.bsent-3{grid-template-columns:284px minmax(0,1fr) 304px;grid-template-areas:"g c d"}}' +
    '.bsent-root .card.bsent-p{padding:16px}' +
    '.bsent-titre h2,.bsent-entete h2{margin:0;font-size:20px;font-weight:750;letter-spacing:-.01em;color:var(--text)}.bsent-titre p{margin:4px 0 0;font-size:13px;color:var(--text-2);line-height:1.45}' +
    '.bsent-cherche{position:relative;display:block;margin:14px 0 12px}.bsent-cherche svg{position:absolute;left:11px;top:50%;width:16px;height:16px;transform:translateY(-50%);color:var(--text-3);pointer-events:none}.bsent-cherche input{width:100%;box-sizing:border-box;padding-left:34px}' +
    '.bsent-puces{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}' +
    '.bsent-puce{flex:none;border:1px solid var(--border);background:var(--surface-2);color:var(--text-2);border-radius:9px;padding:6px 11px;font:inherit;font-size:12.5px;font-weight:600;cursor:pointer}.bsent-puce.on{background:var(--neon,var(--accent));border-color:transparent;color:#fff}' +
    '.bsent-liste{display:flex;flex-direction:column;gap:8px}' +
    '.bsent-sc{display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:1px solid var(--border);background:var(--surface-2);color:var(--text);border-radius:14px;padding:10px 8px 10px 10px;font:inherit;cursor:pointer;transition:border-color .15s,box-shadow .15s}' +
    '.bsent-sc:hover{border-color:color-mix(in srgb,var(--accent) 45%,var(--border))}.bsent-sc.on{border-color:var(--neon,var(--accent));box-shadow:0 0 0 1px var(--neon,var(--accent)),0 12px 30px -18px var(--neon,var(--accent))}' +
    '.bsent-sc>svg{width:14px;height:14px;flex:none;color:var(--text-3)}' +
    '.bsent-tuile{width:42px;height:42px;flex:none;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;background:linear-gradient(135deg,var(--t),color-mix(in srgb,var(--t) 55%,#0b1220));font-weight:750;font-size:14px}.bsent-tuile svg{width:21px;height:21px}' +
    '.bsent-sc-txt{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.bsent-sc-txt b{font-size:13.5px;line-height:1.25}.bsent-sc-txt small{display:flex;flex-wrap:wrap;align-items:center;gap:2px 5px;font-size:11.5px;color:var(--text-3)}.bsent-sc-txt small svg{width:12px;height:12px}' +
    '.bsent-reco{align-self:flex-start;font-style:normal;font-size:10.5px;font-weight:700;color:#fff;background:var(--neon,var(--accent));border-radius:6px;padding:1px 7px}' +
    '.bsent-tags{display:flex;flex-wrap:wrap;gap:4px}.bsent-tags i{font-style:normal;font-size:10.5px;font-weight:650;border-radius:6px;padding:1px 6px;background:color-mix(in srgb,var(--accent) 16%,transparent);color:var(--text-2);border:1px solid color-mix(in srgb,var(--accent) 22%,transparent)}' +
    '.bsent-tags i.n-difficile{background:rgba(239,68,68,.14);border-color:rgba(239,68,68,.3);color:#fca5a5}.bsent-tags i.n-facile{background:rgba(34,197,94,.14);border-color:rgba(34,197,94,.3);color:#86efac}' +
    'html[data-scheme="light"] .bsent-tags i.n-difficile{color:#b91c1c}html[data-scheme="light"] .bsent-tags i.n-facile{color:#15803d}' +
    '.bsent-perso{border-style:dashed}.bsent-vide{margin:6px 0;font-size:13px;color:var(--text-3);line-height:1.5}' +
    '.bsent-histo{margin-top:16px;border-top:1px solid var(--border);padding-top:12px}.bsent-histo h3{margin:0 0 4px;font-size:13px;font-weight:700;color:var(--text-2)}' +
    '.bsent-h{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border);font-size:13px}.bsent-h:last-child{border-bottom:0}.bsent-h>span{flex:1;min-width:0;display:flex;flex-direction:column}.bsent-h b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}.bsent-h small{color:var(--text-3);font-size:11.5px}' +
    '.bsent-h em{font-style:normal;font-weight:750;font-variant-numeric:tabular-nums}.bsent-h button{flex:none}' +
    '.n-b{color:#22c55e}.n-m{color:#f59e0b}.n-f{color:#ef4444}' +
    '.bsent-entete{display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap}.bsent-entete>div{flex:1;min-width:200px;display:flex;flex-direction:column;gap:6px}.bsent-entete h2{font-size:18px}' +
    '.bsent-pill{flex:none;font-size:12px;font-weight:700;border-radius:8px;padding:5px 10px;background:var(--surface-2);border:1px solid var(--border);color:var(--text-2)}.bsent-pill.direct{background:var(--neon,var(--accent));color:#fff;border-color:transparent}.bsent-pill.fait{color:#22c55e;border-color:rgba(34,197,94,.4)}' +
    '.bsent-duree{display:flex;align-items:center;gap:5px;font-size:12.5px;color:var(--text-2);white-space:nowrap}.bsent-duree svg{width:14px;height:14px}' +
    '.bsent-brief{display:flex;flex-direction:column;gap:14px;margin-top:16px}.bsent-brief h4{margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3)}.bsent-brief p{margin:0;font-size:14px;line-height:1.5;color:var(--text)}' +
    '.bsent-objectif{border-left:3px solid var(--neon,var(--accent));padding:8px 12px;border-radius:0 10px 10px 0;background:color-mix(in srgb,var(--accent) 9%,transparent)}' +
    '.bsent-blocs{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}' +
    '.bsent-objs{margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:6px}.bsent-objs li{font-size:13px;border:1px solid var(--border);background:var(--surface-2);border-radius:9px;padding:5px 10px}' +
    '.bsent-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.bsent-grid label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:var(--text-2);min-width:0}.bsent-grid :is(select,input){width:100%;min-width:0;box-sizing:border-box}' +
    '.bsent-fiche{display:block;box-sizing:border-box;width:100%;min-height:220px;resize:vertical;line-height:1.5;margin-top:10px;font-size:13.5px}' +
    '.bsent-details{font-size:13.5px}.bsent-details summary{cursor:pointer;color:var(--text-2);font-weight:600}' +
    '.bsent-act{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.bsent-act small{color:var(--text-3);font-size:12.5px;flex-basis:100%}' +
    '.bsent-go svg{width:17px;height:17px;margin-right:6px;vertical-align:-3px}' +
    '.bsent-mode{display:inline-flex;border:1px solid var(--border);border-radius:10px;overflow:hidden}.bsent-mode button{border:0;background:transparent;color:var(--text-2);padding:7px 12px;font:inherit;font-size:13px;cursor:pointer}.bsent-mode button.on{background:var(--accent);color:#fff}' +
    '.bsent-msg{border-radius:10px;padding:10px 14px;font-size:13.5px;margin-top:10px;background:var(--surface-2);border:1px solid var(--border);line-height:1.45}.bsent-msg.ok{border-color:rgba(34,197,94,.45);background:rgba(34,197,94,.1)}.bsent-msg.warn{border-color:rgba(245,158,11,.5);background:rgba(245,158,11,.1)}' +
    '.bsent-cle{border:1px dashed var(--border);border-radius:12px;padding:12px 14px;font-size:13.5px;line-height:1.5}.bsent-cle ol{margin:6px 0 10px;padding-left:20px}.bsent-cle form{display:flex;gap:8px;flex-wrap:wrap}.bsent-cle input{flex:1;min-width:0}' +
    '.bsent-lien{background:none;border:0;padding:0;color:var(--accent);font:inherit;font-size:13px;cursor:pointer;text-decoration:underline}' +
    '.bsent-appel{display:flex;flex-direction:column;gap:12px;margin-top:14px}' +
    '.bsent-barre{display:flex;align-items:center;gap:12px;border:1px solid var(--neon-line-hi,var(--border));border-radius:14px;padding:10px 12px;background:color-mix(in srgb,var(--accent) 8%,var(--surface-2))}' +
    '.bsent-orbe{width:46px;height:46px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--neon,var(--accent)) 70%,#fff),var(--neon,var(--accent)) 60%,#0b1a3d);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 18%,transparent),0 0 22px -4px var(--neon,var(--accent))}.bsent-orbe svg{width:22px;height:22px}' +
    '.bsent-barre>div{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.bsent-barre b{font-size:14.5px}.bsent-barre small{font-size:12.5px;color:var(--text-2)}' +
    '.bsent-chrono{font-variant-numeric:tabular-nums;font-weight:700;color:var(--text-2);margin-left:6px}' +
    '.bsent-etat{font-size:12.5px;font-weight:600;color:var(--text-2)}.bsent-etat.vendeur{color:#22c55e}.bsent-etat.erreur{color:#ef4444}' +
    '.bsent-rouge{background:#ef4444;color:#fff;border-color:#ef4444}.bsent-rouge:hover{background:#dc2626}.bsent-rouge svg{width:16px;height:16px;margin-right:6px;vertical-align:-3px}' +
    '.bsent-fil{display:flex;flex-direction:column;gap:12px;max-height:min(52vh,520px);min-height:200px;overflow-y:auto;padding:4px 2px}' +
    '.bsent-msgl{display:flex;align-items:flex-end;gap:8px;max-width:88%}.bsent-msgl.moi{align-self:flex-end}.bsent-msgc{min-width:0;display:flex;flex-direction:column;gap:3px}.bsent-msgc small{font-size:12px;color:var(--text-3)}.bsent-msgc small b{color:var(--text);font-weight:650}' +
    '.bsent-av{width:34px;height:34px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:750;color:#fff;background:linear-gradient(135deg,#3b82f6,#6366f1)}.bsent-av.moi{background:linear-gradient(135deg,#14b8a6,#0ea5e9)}' +
    '.bsent-bulle{padding:9px 13px;border-radius:14px;font-size:14px;line-height:1.45;word-wrap:break-word}.bsent-bulle time{display:block;margin-top:4px;font-size:10.5px;opacity:.7;text-align:right;font-variant-numeric:tabular-nums}' +
    '.bsent-bulle.lui{background:var(--neon,var(--accent));color:#fff;border-bottom-left-radius:4px}.bsent-bulle.moi{background:var(--surface-2);border:1px solid var(--border);border-bottom-right-radius:4px}' +
    '.bsent-points{display:flex;gap:4px;padding:12px 14px}.bsent-points span{width:7px;height:7px;border-radius:50%;background:#fff;animation:bsent-p 1.2s infinite}.bsent-points span:nth-child(2){animation-delay:.2s}.bsent-points span:nth-child(3){animation-delay:.4s}' +
    '@keyframes bsent-p{0%,80%,100%{opacity:.25}40%{opacity:1}}' +
    '.bsent-alerte{border-radius:10px;padding:8px 12px;font-size:13.5px;background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.45)}' +
    '.bsent-console{border:1px solid var(--border);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:12px;background:var(--surface-2)}' +
    '.bsent-ctrl{display:flex;align-items:center;justify-content:center;gap:14px}' +
    '.bsent-onde{display:flex;align-items:center;gap:3px;height:40px;flex:1;max-width:170px;justify-content:center}.bsent-onde i{width:3px;height:6px;border-radius:2px;background:linear-gradient(180deg,#60a5fa,#a78bfa);opacity:.45}' +
    '.bsent-onde.lui i,.bsent-onde.moi i{opacity:1;animation:bsent-o 1s ease-in-out infinite}.bsent-onde i:nth-child(3n){animation-delay:.15s}.bsent-onde i:nth-child(3n+1){animation-delay:.35s}.bsent-onde i:nth-child(4n){animation-delay:.55s}' +
    '@keyframes bsent-o{0%,100%{height:6px}50%{height:34px}}' +
    '.bsent-mic{width:64px;height:64px;border-radius:50%;flex:none;border:0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;background:linear-gradient(135deg,#3b82f6,#6366f1);box-shadow:0 10px 28px -10px #3b82f6}.bsent-mic svg{width:26px;height:26px}' +
    '.bsent-mic.on{background:#16a34a;animation:bsent-on 1.6s infinite}.bsent-mic:disabled{opacity:.55;cursor:default}' +
    '@keyframes bsent-on{0%{box-shadow:0 0 0 0 rgba(22,163,74,.45)}70%{box-shadow:0 0 0 14px rgba(22,163,74,0)}100%{box-shadow:0 0 0 0 rgba(22,163,74,0)}}' +
    '.bsent-fin{width:46px;height:46px;border-radius:50%;flex:none;border:0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;background:#ef4444}.bsent-fin svg{width:22px;height:22px}.bsent-fin:disabled{opacity:.5}' +
    '.bsent-voix{display:flex;align-items:center;gap:10px}.bsent-dicte{flex:1;min-width:0;min-height:42px;padding:8px 12px;border-radius:12px;border:1px solid var(--border);background:var(--surface);font-size:14px;line-height:1.4}.bsent-dicte span{color:var(--text-3);font-size:13px}.bsent-dicte i{color:var(--text-3)}' +
    '.bsent-clavier{display:flex;gap:8px}.bsent-clavier input{flex:1;min-width:0}' +
    '.bsent-infos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;border-top:1px solid var(--border);padding-top:10px}.bsent-infos span{display:flex;flex-direction:column;gap:1px;min-width:0}.bsent-infos small{font-size:11.5px;color:var(--text-3)}.bsent-infos b{font-size:12.5px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.bsent-bas{display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between}' +
    '.bsent-tabs{display:flex;gap:4px;border-bottom:1px solid var(--border);margin:-4px 0 12px}.bsent-tabs button{border:0;background:none;color:var(--text-2);font:inherit;font-size:13.5px;font-weight:600;padding:8px 12px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px}.bsent-tabs button.on{color:var(--text);border-bottom-color:var(--neon,var(--accent))}' +
    '.bsent-tl{display:grid;grid-template-columns:44px 74px minmax(0,1fr);gap:8px;padding:7px 0;border-bottom:1px solid var(--border);font-size:13.5px;line-height:1.45}.bsent-tl:last-of-type{border-bottom:0}.bsent-tl time{color:var(--text-3);font-variant-numeric:tabular-nums}.bsent-tl b{font-weight:650}' +
    '.bsent-notes{display:block;box-sizing:border-box;width:100%;min-height:120px;resize:vertical;font-size:14px;line-height:1.5}.bsent-aide{display:block;margin-top:6px;font-size:12px;color:var(--text-3)}' +
    '.bsent-note{display:flex;align-items:center;gap:16px;flex-wrap:wrap}.bsent-score{font-size:42px;font-weight:800;line-height:1}.bsent-score small{font-size:17px;color:var(--text-3);font-weight:700}' +
    '.bsent-badge{display:inline-block;font-size:12px;font-weight:700;border-radius:999px;padding:3px 10px;background:var(--surface-2);border:1px solid var(--border);margin-top:6px}.bsent-badge.ok{background:rgba(34,197,94,.12);border-color:rgba(34,197,94,.45);color:#22c55e}' +
    '.bsent-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:14px}.bsent-cols h4,.bsent-obj h4{margin:0 0 6px;font-size:13px}.bsent-cols ul{margin:0;padding-left:18px;font-size:13.5px;line-height:1.5}' +
    '.bsent-obj{margin-top:12px;font-size:13.5px}.bsent-obj div{padding:7px 0;border-bottom:1px solid var(--border)}.bsent-obj div:last-child{border-bottom:0}.bsent-obj small{display:block;color:var(--text-2)}' +
    '.bsent-phrase{margin-top:12px;padding:10px 14px;border-left:3px solid var(--neon,var(--accent));background:var(--surface-2);border-radius:0 10px 10px 0;font-size:14px}' +
    '.bsent-h3{display:flex;align-items:center;gap:8px;margin:0 0 12px;font-size:15px;font-weight:700;color:var(--text)}.bsent-h3>svg{width:18px;height:18px;color:var(--neon,var(--accent));flex:none}' +
    '.bsent-claude{margin-left:auto;display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;color:var(--text-3);border:1px solid var(--border);border-radius:7px;padding:2px 7px}.bsent-claude svg{width:12px;height:12px}' +
    '.bsent-pp{display:flex;gap:12px;align-items:flex-start}.bsent-photo{width:64px;height:64px;flex:none;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:#fff;background:linear-gradient(135deg,#1d4ed8,#6366f1 60%,#0ea5e9)}' +
    '.bsent-pp>div{min-width:0;display:flex;flex-direction:column;gap:3px}.bsent-pp b{font-size:16px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}.bsent-pp small{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--text-2)}.bsent-pp small svg{width:13px;height:13px;flex:none;color:var(--text-3)}' +
    '.bsent-fictif{font-style:normal;font-size:10.5px;font-weight:700;border-radius:6px;padding:1px 6px;background:color-mix(in srgb,var(--accent) 20%,transparent);color:var(--text-2)}' +
    '.bsent-jauge{display:grid;grid-template-columns:1fr auto;gap:4px 8px;margin-top:12px;font-size:12.5px;color:var(--text-2)}.bsent-jauge b{color:var(--text)}.bsent-jauge i{grid-column:1/-1;height:6px;border-radius:4px;background:var(--surface-2);overflow:hidden}.bsent-jauge s{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,#22c55e,#14b8a6)}' +
    '.bsent-traits{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}.bsent-traits span{font-size:12px;font-weight:600;border:1px solid var(--border);background:var(--surface-2);border-radius:9px;padding:4px 10px;color:var(--text-2)}' +
    '.bsent-perf{display:flex;flex-direction:column;gap:14px}.bsent-anneau{position:relative;width:124px;height:124px;flex:none;align-self:center}.bsent-anneau svg{width:100%;height:100%;transform:rotate(-90deg)}.bsent-anneau circle{fill:none;stroke-width:9}.bsent-anneau .f{stroke:var(--surface-2)}.bsent-anneau .v{stroke:url(#bsent-ring);stroke-linecap:round}' +
    '.bsent-anneau span{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}.bsent-anneau b{font-size:28px;font-weight:800;line-height:1}.bsent-anneau b small{font-size:13px;color:var(--text-3);font-weight:600}.bsent-anneau em{font-style:normal;font-size:11px;font-weight:650;color:#22c55e;margin-top:4px;max-width:84px;text-align:center;line-height:1.2}' +
    '.bsent-barres{flex:1;min-width:0;display:flex;flex-direction:column;gap:7px}.bsent-bl{display:grid;grid-template-columns:minmax(0,1fr) 84px 26px;align-items:center;gap:6px;font-size:12px;color:var(--text-2)}.bsent-bl span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bsent-bl b{text-align:right;color:var(--text);font-variant-numeric:tabular-nums}' +
    '.bsent-bl i{height:6px;border-radius:4px;background:var(--surface-2);overflow:hidden}.bsent-bl s{display:block;height:100%;border-radius:4px}.bsent-bl s.b{background:linear-gradient(90deg,#14b8a6,#22c55e)}.bsent-bl s.m{background:linear-gradient(90deg,#6366f1,#a78bfa)}.bsent-bl s.f{background:linear-gradient(90deg,#f59e0b,#fbbf24)}' +
    '.bsent-etape{border:1px solid var(--neon-line-hi,var(--border));border-radius:12px;padding:10px 12px;background:color-mix(in srgb,var(--accent) 8%,transparent)}.bsent-etape b{font-size:13.5px}.bsent-etape p{margin:4px 0 0;font-size:13px;line-height:1.5;color:var(--text-2)}' +
    '.bsent-h4{display:flex;align-items:center;gap:6px;margin:14px 0 6px;font-size:13px;font-weight:700}.bsent-h4 svg{width:15px;height:15px;color:var(--neon,var(--accent))}' +
    '.bsent-exos{display:flex;flex-direction:column;gap:4px}.bsent-exos button{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:0;border-radius:9px;background:none;color:var(--text);font:inherit;font-size:13px;padding:6px 6px;cursor:pointer}.bsent-exos button:hover{background:var(--surface-2)}' +
    '.bsent-exos button>svg{width:15px;height:15px;flex:none}.bsent-exos button>svg:first-child{color:#22c55e}.bsent-exos button>svg:last-child{color:var(--text-3)}.bsent-exos span{flex:1;min-width:0;display:flex;flex-direction:column}.bsent-exos small{font-size:11.5px;color:var(--text-3)}' +
    '.bsent-plan{margin:0;padding-left:20px;font-size:13px;line-height:1.5}.bsent-plan li{margin:3px 0}' +
    '.bsent-txt{margin:0 0 10px;font-size:13px;line-height:1.5;color:var(--text-2)}.bsent-mini{display:inline-flex;width:20px;height:20px;border-radius:6px;overflow:hidden}.bsent-mini svg{width:100%;height:100%}' +
    '.bsent-cadre{width:100%;height:min(78vh,860px);border:1px solid var(--border);border-radius:12px;background:#fff;display:block}' +
    '.bsent-occupe .bsent-g{opacity:.6;pointer-events:none}' +
    '@media (max-width:640px){.bsent-msgl{max-width:96%}.bsent-score{font-size:36px}.bsent-tl{grid-template-columns:40px minmax(0,1fr)}.bsent-tl b{grid-column:2}.bsent-tl p{grid-column:1/-1}.bsent-onde{max-width:90px}}';
  function css() {
    if (document.getElementById('bsent-css')) return;
    var s = document.createElement('style'); s.id = 'bsent-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  function initiales(t) { return String(t || '?').split(/\s+/).filter(function (x) { return /^[\p{L}\d]/u.test(x); }).slice(0, 2).map(function (x) { return x[0]; }).join('').toUpperCase() || '?'; }
  function li(x) { return '<li>' + esc(x) + '</li>'; }
  function classeNote(n) { return n >= 7 ? 'n-b' : n >= 5 ? 'n-m' : 'n-f'; }
  function quand(d) { try { return new Date(d).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
  function nomVoix() { if (!synth) return 'Sans voix'; var A = S.appel, v = A && femme(nomProspect(A)) ? voix.f || voix.defaut : voix.h; return v ? String(v.name).replace(/\s*\(.*\)\s*$/, '').replace(/^(Microsoft|Google)\s+/, '') : 'Voix du navigateur'; }
  function telDe(p) { return p && p.telephone ? '<a class="btn btn-secondary" href="tel:' + esc(String(p.telephone).replace(/[^\d+]/g, '')) + '">Appeler ' + esc(p.entreprise || p.contact) + ' pour de vrai</a>' : ''; }

  // ---------------------------------------------------------------- colonne de gauche : scénarios
  function meilleure(cle) { var b = null; P.historique.forEach(function (h) { if (h.cle === cle && typeof h.note === 'number' && (b === null || h.note > b)) b = h.note; }); return b; }
  function prospectsTries() {
    var sc = window.bsAujourdhui && typeof window.bsAujourdhui.score === 'function' ? window.bsAujourdhui.score : null, s = {};
    var ps = prospects().filter(function (p) { return ['client_signe', 'perdu', 'resilie'].indexOf(p.statut) < 0 && !p.nePlusContacter; });
    if (sc) { ps.forEach(function (p) { try { s[p.id] = +sc(p) || 0; } catch (e) { s[p.id] = 0; } }); ps.sort(function (a, b) { return s[b.id] - s[a.id]; }); }
    return ps;
  }
  function carteModele(m) {
    var on = S.sel.type === 'modele' && S.sel.id === m.id, b = meilleure('m:' + m.id);
    return '<button type="button" class="bsent-sc' + (on ? ' on' : '') + '" data-scenario="' + m.id + '" data-texte="' + esc((m.titre + ' ' + m.tags.join(' ') + ' ' + m.persona.entreprise + ' ' + m.persona.nom + ' ' + FAMILLES[m.famille]).toLowerCase()) + '"' + (on ? ' aria-current="true"' : '') + '>' +
      '<span class="bsent-tuile" style="--t:' + TEINTE[m.famille] + '">' + ICF[m.famille] + '</span>' +
      '<span class="bsent-sc-txt">' + (m.conseille ? '<em class="bsent-reco">Recommandé</em>' : '') + '<b>' + esc(m.titre) + '</b>' +
      '<span class="bsent-tags"><i class="n-' + m.niveau + '">' + NIVEAUX[m.niveau][0] + '</i>' + m.tags.slice(0, 1).map(function (t) { return '<i>' + esc(t) + '</i>'; }).join('') + '</span>' +
      '<small>' + IC.horloge + '<span>' + esc(m.duree) + (b !== null ? ' · meilleure note ' + b + '/10' : '') + '</span></small></span>' + IC.chevron + '</button>';
  }
  function carteProspect(p) {
    var on = S.sel.type === 'perso' && S.prospectId === p.id, nom = p.entreprise || p.contact;
    return '<button type="button" class="bsent-sc' + (on ? ' on' : '') + '" data-prospect="' + esc(p.id) + '" data-texte="' + esc([nom, p.secteur, p.ville].filter(Boolean).join(' ').toLowerCase()) + '"' + (on ? ' aria-current="true"' : '') + '>' +
      '<span class="bsent-tuile" style="--t:#14b8a6">' + esc(initiales(nom)) + '</span><span class="bsent-sc-txt"><b>' + esc(nom) + '</b>' +
      '<span class="bsent-tags"><i>' + esc(STATUTS[p.statut] || 'nouveau') + '</i>' + (p.secteur ? '<i>' + esc(String(p.secteur).slice(0, 24)) + '</i>' : '') + '</span>' +
      '<small>' + esc(OBJ_COURT[objectifPour(p)] + (p.ville ? ' · ' + p.ville : '')) + '</small></span>' + IC.chevron + '</button>';
  }
  function vueHistorique() {
    if (!P.historique.length) return '';
    return '<div class="bsent-histo"><h3>Derniers entraînements</h3>' + P.historique.slice(0, 6).map(function (h) {
      var mode = h.mode === 'claude' ? 'Claude' : h.mode === 'script' ? 'Sans IA' : 'Pitchbase';
      var cle = h.cle || (h.prospectId ? 'p:' + h.prospectId : '');
      var existe = cle.indexOf('m:') === 0 ? !!modele(cle.slice(2)) : cle.indexOf('p:') === 0 ? !!prospect(cle.slice(2)) : false;
      return '<div class="bsent-h"><span><b>' + esc(h.titre || h.nom) + '</b><small>' + esc(mode + ' · ' + quand(h.at)) + '</small></span>' +
        (typeof h.note === 'number' ? '<em class="' + classeNote(h.note) + '">' + h.note + '/10</em>' : '') +
        (existe ? '<button type="button" class="btn btn-ghost btn-sm" data-rejouer="' + esc(cle) + '">Rejouer</button>' : '') + '</div>';
    }).join('') + '</div>';
  }
  function vueListe() {
    var f = S.filtre;
    var puces = [['tout', 'Tout']].concat(Object.keys(FAMILLES).map(function (k) { return [k, FAMILLES[k]]; })).concat([['crm', 'Vos prospects']]);
    var corps;
    if (f === 'crm') {
      var ps = prospectsTries().slice(0, 40);
      corps = ps.length ? ps.map(carteProspect).join('') : '<p class="bsent-vide">Aucun prospect à appeler dans le CRM pour l’instant. Ajoutez-en dans Prospects ou Nouveaux leads.</p>';
    } else {
      corps = SCENARIOS.filter(function (m) { return f === 'tout' || m.famille === f; }).map(carteModele).join('');
    }
    return '<section class="card bsent-p"><div class="bsent-titre"><h2>Scénarios</h2><p>Entraînez-vous sur des appels réalistes, adaptés à vos objectifs.</p></div>' +
      '<label class="bsent-cherche">' + IC.recherche + '<input class="input" name="recherche" type="search" placeholder="Rechercher un scénario…" aria-label="Rechercher un scénario" autocomplete="off"></label>' +
      '<div class="bsent-puces" role="group" aria-label="Familles de scénarios">' + puces.map(function (x) { return '<button type="button" class="bsent-puce' + (f === x[0] ? ' on' : '') + '" data-filtre="' + x[0] + '" aria-pressed="' + (f === x[0]) + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>' +
      '<div class="bsent-liste">' + corps +
      '<button type="button" class="bsent-sc bsent-perso' + (S.sel.type === 'perso' && !S.prospectId ? ' on' : '') + '" data-perso="1"><span class="bsent-tuile" style="--t:#6366f1">' + IC.plus + '</span><span class="bsent-sc-txt"><b>Créer un scénario personnalisé</b><small>Votre offre, votre prospect, votre objectif.</small></span></button>' +
      '</div>' + vueHistorique() + '</section>';
  }
  function filtrer(q) {
    q = String(q || '').trim().toLowerCase();
    Array.prototype.forEach.call(racine.querySelectorAll('.bsent-liste [data-texte]'), function (b) { b.hidden = !!q && b.getAttribute('data-texte').indexOf(q) < 0; });
  }

  // ---------------------------------------------------------------- colonne du centre : brief, appel, onglets
  function boutonsDepart() {
    return '<div class="bsent-act"><button type="button" class="btn btn-primary bsent-go" data-act="demarrer"' + (S.ia === null && window.BS_SERVER ? ' disabled' : '') + '>' + IC.tel + 'Démarrer l’appel</button>' +
      '<span class="bsent-mode" role="group" aria-label="Façon de répondre"><button type="button" data-mode="voix" class="' + (P.mode === 'voix' ? 'on' : '') + '">À la voix</button><button type="button" data-mode="clavier" class="' + (P.mode === 'clavier' ? 'on' : '') + '">Au clavier</button></span>' +
      '<small>' + (P.mode === 'voix' ? (Reco ? 'Autorisez le micro quand le navigateur le demande. Mettez le son.' : 'Ce navigateur ne reconnaît pas la voix : utilisez Chrome, Edge ou Safari, ou répondez au clavier.') : 'Le prospect parle quand même à voix haute : mettez le son.') + '</small></div>';
  }
  function zoneFiche() {
    return '<details class="bsent-details"' + (S.modifiee ? ' open' : '') + '><summary>Voir ou modifier la fiche envoyée à l’IA</summary>' +
      '<textarea class="input bsent-fiche" name="fiche" spellcheck="false" aria-label="Fiche du prospect">' + esc(S.fiche) + '</textarea>' +
      (S.modifiee ? '<button type="button" class="btn btn-ghost btn-sm" style="margin-top:8px" data-act="refaire">Refaire la fiche</button>' : '') + '</details>';
  }
  function vueBrief(m) {
    return '<div class="bsent-brief"><div class="bsent-objectif"><h4>Objectif</h4><p>' + esc(OBJECTIFS[m.objectif]) + '</p></div>' +
      '<div class="bsent-blocs"><div><h4>Contexte</h4><p>' + esc(m.contexte) + '</p></div><div><h4>Ce que vous vendez</h4><p>' + esc(m.offre.charAt(0).toUpperCase() + m.offre.slice(1)) + '</p></div></div>' +
      '<div><h4>Objections à prévoir</h4><ul class="bsent-objs">' + m.objections.map(li).join('') + '</ul></div>' +
      zoneFiche() + vueCle() + boutonsDepart() + '</div>';
  }
  function vuePreparer() {
    var liste = prospects(), p = prospect(S.prospectId);
    return '<div class="bsent-brief"><p style="color:var(--text-2)">Choisissez un prospect du CRM ou un prospect type, l’objectif et ce que vous vendez : l’IA joue le prospect.</p>' +
      '<div class="bsent-grid">' +
      '<label>Prospect à appeler<select class="input" name="prospect"><option value="">Un prospect type (sans fiche)</option>' +
      liste.slice(0, 500).map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === S.prospectId ? ' selected' : '') + '>' + esc((x.entreprise || x.contact) + (x.ville ? ' · ' + x.ville : '')) + '</option>'; }).join('') + '</select></label>' +
      '<label>Difficulté<select class="input" name="niveau">' + Object.keys(NIVEAUX).map(function (k) { return '<option value="' + k + '"' + (P.niveau === k ? ' selected' : '') + '>' + NIVEAUX[k][0] + '</option>'; }).join('') + '</select></label>' +
      '<label>Objectif de l’appel<select class="input" name="objectif">' + Object.keys(OBJECTIFS).map(function (k) { return '<option value="' + k + '"' + (S.objectif === k ? ' selected' : '') + '>' + OBJ_COURT[k] + '</option>'; }).join('') + '</select></label>' +
      '</div>' +
      '<div class="bsent-grid" style="grid-template-columns:1fr"><label>Ce que vous vendez<input class="input" name="offre" value="' + esc(P.offre) + '"></label></div>' +
      zoneFiche() + vueCle() + boutonsDepart() +
      (p && p.telephone ? '<p style="font-size:13px;color:var(--text-2)">Prêt ? Appelez ' + esc(p.entreprise) + ' au <a href="tel:' + esc(String(p.telephone).replace(/[^\d+]/g, '')) + '">' + esc(p.telephone) + '</a>.</p>' : '') + '</div>';
  }
  function barres(n) { var h = ''; for (var i = 0; i < n; i++) h += '<i></i>'; return h; }
  function vueAppel() {
    var A = S.appel;
    return '<div class="bsent-appel">' +
      '<div class="bsent-barre"><span class="bsent-orbe">' + IC.onde + '</span><div><b>Appel en cours<span class="bsent-chrono" data-z="chrono">0:00</span></b><small>' + (A.ia ? 'Vous parlez avec un prospect joué par Claude' : 'Prospect sans IA : il suit les objections du script') + ' · <span class="bsent-etat" data-z="etat"></span></small></div>' +
      '<button type="button" class="btn bsent-rouge" data-act="raccrocher">' + IC.raccrocher + 'Mettre fin</button></div>' +
      '<div class="bsent-fil" data-z="fil" aria-live="polite"></div>' +
      '<div class="bsent-alerte" data-z="alerte" hidden></div>' +
      '<div class="bsent-console"><div class="bsent-ctrl"><span class="bsent-onde" aria-hidden="true">' + barres(16) + '</span>' +
      '<button type="button" class="bsent-mic" data-act="micro" aria-label="Ouvrir le micro">' + IC.mic + '</button>' +
      '<span class="bsent-onde" aria-hidden="true">' + barres(16) + '</span><button type="button" class="bsent-fin" data-act="raccrocher" aria-label="Raccrocher">' + IC.raccrocher + '</button></div>' +
      '<div class="bsent-voix" data-z="voix"><div class="bsent-dicte" data-z="dicte"></div><button type="button" class="btn btn-secondary btn-sm" data-act="envoyer-dicte" disabled>Envoyer</button></div>' +
      '<form class="bsent-clavier" data-z="clavier"><input class="input" name="reponse" autocomplete="off" placeholder="Votre réponse au prospect…" aria-label="Votre réponse"><button type="submit" class="btn btn-primary" data-act="envoyer">Envoyer</button></form>' +
      '<div class="bsent-infos"><span><small>Microphone</small><b data-z="micro-etat"></b></span><span><small>Langue</small><b>Français</b></span><span><small>Voix du prospect</small><b>' + esc(nomVoix()) + '</b></span></div>' +
      '<div class="bsent-bas"><button type="button" class="btn btn-ghost btn-sm" data-act="bascule">Répondre au clavier</button><button type="button" class="btn btn-ghost btn-sm" data-act="abandonner">Annuler l’appel</button></div></div>' +
      '</div>';
  }
  function paneTranscription(rec) {
    if (!rec) return '<p class="bsent-vide">Pas encore d’appel sur ce scénario. La transcription du dernier appel s’affichera ici.</p>';
    return rec.messages.map(function (m) {
      return '<div class="bsent-tl"><time>' + (m.t != null ? duree(m.t) : '') + '</time><b>' + (m.de === 'prospect' ? 'Prospect' : 'Vous') + '</b><p style="margin:0">' + esc(m.texte) + '</p></div>';
    }).join('') + '<div class="bsent-act" style="margin-top:10px"><small style="flex-basis:auto">' + esc(quand(rec.at) + ' · ' + duree(rec.duree)) + '</small><button type="button" class="btn btn-ghost btn-sm" data-act="copier-rapport">Copier le compte rendu</button></div>';
  }
  function paneAnalyse(rec) {
    if (!rec) return '<p class="bsent-vide">Faites un appel : l’analyse détaillée (points forts, objections, phrase à essayer) s’affichera ici.</p>';
    var n = rec.n;
    return (n.alerte ? '<div class="bsent-msg warn" style="margin:0 0 12px">' + esc(n.alerte) + '</div>' : '') +
      '<div class="bsent-note"><span class="bsent-score ' + classeNote(n.note) + '">' + n.note + '<small>/10</small></span><div style="flex:1;min-width:200px"><p style="margin:0;font-size:14px;line-height:1.5">' + esc(n.verdict) + '</p>' +
      '<span class="bsent-badge' + (n.objectif_atteint ? ' ok">Objectif atteint' : '">Objectif pas encore atteint') + '</span></div></div>' +
      '<div class="bsent-cols"><div><h4>Points forts</h4><ul>' + (n.points_forts || []).map(li).join('') + '</ul></div><div><h4>À améliorer en priorité</h4><ul>' + (n.a_ameliorer || []).map(li).join('') + '</ul></div></div>' +
      ((n.objections || []).length ? '<div class="bsent-obj"><h4>Objections</h4>' + n.objections.map(function (o) {
        return '<div>' + (o.bien_traitee ? '✅ ' : '⚠️ ') + esc(o.objection) + '<small>' + esc(o.conseil) + '</small></div>';
      }).join('') + '</div>' : '') +
      (n.phrase_a_essayer ? '<div class="bsent-phrase"><b>À essayer au prochain appel :</b> « ' + esc(n.phrase_a_essayer) + ' »</div>' : '') +
      '<div class="bsent-act" style="margin-top:14px"><button type="button" class="btn btn-primary bsent-go" data-act="demarrer">' + IC.tel + 'Recommencer</button>' + telDe(prospect(rec.prospectId)) +
      '<button type="button" class="btn btn-ghost btn-sm" data-act="copier-rapport">Copier le compte rendu</button></div>';
  }
  function vueOnglets(rec) {
    var cle = cleCourante();
    var t = S.appel ? [['notes', 'Notes']] : [['transcription', 'Transcription'], ['analyse', 'Analyse IA'], ['notes', 'Notes']];
    var on = S.appel ? 'notes' : S.onglet;
    function pane(k, html) { return '<div data-pane="' + k + '"' + (on !== k ? ' hidden' : '') + '>' + html + '</div>'; }
    return '<section class="card bsent-p bsent-onglets"><div class="bsent-tabs" role="tablist">' + t.map(function (x) {
      return '<button type="button" role="tab" data-onglet="' + x[0] + '" aria-selected="' + (on === x[0]) + '" class="' + (on === x[0] ? 'on' : '') + '">' + x[1] + '</button>';
    }).join('') + '</div>' +
      (S.appel ? '' : pane('transcription', paneTranscription(rec)) + pane('analyse', paneAnalyse(rec))) +
      pane('notes', '<textarea class="input bsent-notes" name="notes" placeholder="Vos notes sur ce scénario : phrases qui marchent, objections à retravailler…" aria-label="Notes sur ce scénario">' + esc(P.notes[cle] || '') + '</textarea><small class="bsent-aide">Gardées sur cet appareil, pour ce scénario.</small>') +
      '</section>';
  }
  function vueCentre(rec) {
    var m = modeleCourant(), A = S.appel;
    var etat = A ? ['direct', 'En cours'] : rec ? ['fait', 'Déjà joué'] : ['', 'Prêt'];
    var tags = m ? [['n-' + m.niveau, NIVEAUX[m.niveau][0]]].concat(m.tags.map(function (t) { return ['', t]; })) : [['n-' + P.niveau, NIVEAUX[P.niveau][0]], ['', OBJ_COURT[S.objectif || 'rdv']]];
    return '<section class="card bsent-p"><header class="bsent-entete"><span class="bsent-pill ' + etat[0] + '">' + etat[1] + '</span><div><h2>' + esc(titreCourant()) + '</h2>' +
      '<span class="bsent-tags">' + tags.map(function (t) { return '<i class="' + t[0] + '">' + esc(t[1]) + '</i>'; }).join('') + '</span></div>' +
      (m ? '<small class="bsent-duree">' + IC.horloge + esc(m.duree) + '</small>' : '') +
      (!A && S.ia && S.admin && S.source === 'crm' ? '<button type="button" class="bsent-lien" data-act="voir-cle">Clé Claude</button>' : '') + '</header>' +
      (A ? vueAppel() : m ? vueBrief(m) : vuePreparer()) + '</section>' + vueOnglets(rec);
  }

  // ---------------------------------------------------------------- colonne de droite : profil, performance, recommandations
  function jauge(label, v) { return '<div class="bsent-jauge"><span>' + esc(label) + '</span><b>' + v + ' %</b><i><s style="width:' + v + '%"></s></i></div>'; }
  function vueProfil() {
    var m = modeleCourant(), p = m ? null : prospect(S.prospectId);
    var h = '<section class="card bsent-p"><h3 class="bsent-h3">' + IC.profil + 'Profil du prospect</h3>';
    if (m) {
      var x = m.persona;
      return h + '<div class="bsent-pp"><span class="bsent-photo">' + esc(initiales(x.nom)) + '</span><div><b>' + esc(x.nom) + '<i class="bsent-fictif" title="Personnage fictif créé pour l’entraînement">Fictif</i></b><small>' + esc(x.poste) + '</small>' +
        '<small>' + IC.batiment + esc(x.entreprise) + ' · <span>' + esc(x.taille) + '</span></small><small>' + IC.lieu + esc(x.ville) + '</small></div></div>' +
        jauge('Ouverture à l’appel', { facile: 75, normal: 50, difficile: 25 }[m.niveau]) +
        '<div class="bsent-traits">' + x.traits.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div></section>';
    }
    if (p) {
      var sc = null, appels = (p.callLog || []).length;
      try { if (window.bsAujourdhui && window.bsAujourdhui.score) sc = window.bsAujourdhui.score(p); } catch (e) { sc = null; }
      return h + '<div class="bsent-pp"><span class="bsent-photo">' + esc(initiales(p.entreprise || p.contact)) + '</span><div><b>' + esc(p.entreprise || p.contact) + '</b>' +
        (p.contact && p.entreprise ? '<small>' + esc(p.contact) + '</small>' : '') + (p.secteur ? '<small>' + IC.batiment + esc(p.secteur) + '</small>' : '') + (p.ville ? '<small>' + IC.lieu + esc(p.ville) + '</small>' : '') + '</div></div>' +
        (typeof sc === 'number' ? jauge('Score IA du lead', sc) : '') +
        '<div class="bsent-traits"><span>' + esc(STATUTS[p.statut] || 'nouveau') + '</span><span>' + appels + ' appel' + (appels > 1 ? 's' : '') + '</span>' + (p.priorite === 'haute' ? '<span>Priorité haute</span>' : '') + '</div>' +
        '<div class="bsent-act" style="margin-top:12px"><button type="button" class="btn btn-ghost btn-sm" data-act="fiche-prospect">Ouvrir la fiche</button></div>' +
        '<p class="bsent-aide">Le nom du contact, son e-mail et son téléphone ne sont jamais envoyés à l’IA.</p></section>';
    }
    return h + '<p class="bsent-vide">Prospect type : le gérant d’une petite entreprise qui ne vous connaît pas. Choisissez un prospect du CRM pour un appel sur mesure.</p></section>';
  }
  function niveauTexte(v) { return v >= 80 ? 'Très bon niveau' : v >= 60 ? 'Bon niveau' : v >= 40 ? 'À travailler' : 'Débutant'; }
  function vuePerf(rec) {
    var h = '<section class="card bsent-p"><h3 class="bsent-h3">' + IC.courbe + 'Analyse de performance</h3>';
    if (!rec) return h + '<p class="bsent-vide">Faites un premier appel sur ce scénario : votre note sur 100 et vos six compétences s’affichent ici.</p></section>';
    var n = rec.n, sc = Math.max(0, Math.min(100, Math.round(n.note * 10))), c = n.competences || {};
    return h + '<div class="bsent-perf"><div class="bsent-anneau"><svg viewBox="0 0 120 120"><defs><linearGradient id="bsent-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22c55e"/><stop offset="1" stop-color="#14b8a6"/></linearGradient></defs><circle class="f" cx="60" cy="60" r="50"/>' +
      '<circle class="v" cx="60" cy="60" r="50" pathLength="100" stroke-dasharray="' + sc + ' 100"/></svg><span><b>' + sc + '<small>/100</small></b><em>' + niveauTexte(sc) + '</em></span></div>' +
      '<div class="bsent-barres">' + COMP.map(function (k) {
        var v = typeof c[k[0]] === 'number' ? Math.max(0, Math.min(100, c[k[0]])) : null;
        return '<div class="bsent-bl"><span>' + k[1] + '</span><i><s class="' + (v === null ? '' : v >= 75 ? 'b' : v >= 55 ? 'm' : 'f') + '" style="width:' + (v || 0) + '%"></s></i><b>' + (v === null ? '–' : v) + '</b></div>';
      }).join('') + '</div></div>' +
      '<small class="bsent-aide">' + (rec.ia ? 'Notée par Claude' : 'Note estimée sans IA') + ' · ' + esc(quand(rec.at)) + '</small></section>';
  }
  function exercices(c) {
    if (!c) return [];
    var cour = modeleCourant(), vus = {};
    return COMP.map(function (k) { return [k[0], typeof c[k[0]] === 'number' ? c[k[0]] : 100]; }).sort(function (a, b) { return a[1] - b[1]; })
      .map(function (k) { return { id: EXO[k[0]][0], txt: EXO[k[0]][1] }; })
      .filter(function (e) { if (vus[e.id] || (cour && cour.id === e.id)) return false; vus[e.id] = true; return true; }).slice(0, 3);
  }
  function vueReco(rec) {
    var h = '<section class="card bsent-p"><h3 class="bsent-h3">' + IC.etincelle + 'Recommandations' + (rec && rec.ia ? '<span class="bsent-claude">' + IC.claude + 'Générées par Claude</span>' : '') + '</h3>';
    if (!rec) return h + '<p class="bsent-vide">Après votre premier appel : la phrase à essayer, les exercices ciblés et votre plan d’amélioration.</p></section>';
    var n = rec.n, ex = exercices(n.competences);
    return h + (n.phrase_a_essayer ? '<div class="bsent-etape"><b>Votre prochaine étape</b><p>« ' + esc(n.phrase_a_essayer) + ' »</p></div>' : '') +
      (ex.length ? '<h4 class="bsent-h4">' + IC.cible + 'Exercices recommandés</h4><div class="bsent-exos">' + ex.map(function (e) {
        return '<button type="button" data-scenario="' + e.id + '">' + IC.check + '<span>' + esc(e.txt) + '<small>' + esc(modele(e.id).titre) + '</small></span>' + IC.chevron + '</button>';
      }).join('') + '</div>' : '') +
      ((n.a_ameliorer || []).length ? '<h4 class="bsent-h4">' + IC.courbe + 'Plan d’amélioration</h4><ol class="bsent-plan">' + n.a_ameliorer.slice(0, 3).map(li).join('') + '</ol>' : '') + '</section>';
  }
  function vueOutils() {
    return '<section class="card bsent-p"><h3 class="bsent-h3">' + IC.onde + 'Sales Intelligence</h3><p class="bsent-txt">Notre simulateur vocal avancé : voix réalistes, rapport détaillé et « Rejouer ce moment ».</p>' +
      '<a class="btn btn-secondary btn-sm" href="https://blackstart-sales.onrender.com" target="_blank" rel="noopener">Ouvrir Sales Intelligence</a></section>' +
      '<section class="card bsent-p"><h3 class="bsent-h3"><span class="bsent-mini">' + LOGO + '</span>Pitchbase</h3><p class="bsent-txt">Un autre simulateur, dans une fenêtre à côté (compte Pitchbase nécessaire). Le CRM copie la fiche du scénario : collez-la dans Pitchbase.</p>' +
      (S.msg ? '<div class="bsent-msg ' + S.msg.k + '" style="margin:0 0 10px">' + esc(S.msg.t) + '</div>' : '') +
      '<div class="bsent-act"><button type="button" class="btn btn-secondary btn-sm" data-act="pitchbase">Copier la fiche et ouvrir Pitchbase</button><button type="button" class="btn btn-ghost btn-sm" data-act="copier">Copier la fiche</button></div></section>';
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
      '<p class="bsent-txt" style="margin:8px 0 0;font-size:12.5px">Comptez environ 15 à 20 centimes par simulation de 5 minutes. En attendant, le simulateur marche sans IA.</p>' +
      (S.cleMsg ? '<div class="bsent-msg ' + S.cleMsg.k + '">' + esc(S.cleMsg.t) + '</div>' : '') + '</div>';
  }

  function page() {
    var rec = dernier(cleCourante());
    var cadre = S.integrable && S.ouvert
      ? '<section class="card bsent-p"><div class="bsent-act" style="justify-content:space-between;margin-bottom:10px"><h3 class="bsent-h3" style="margin:0"><span class="bsent-mini">' + LOGO + '</span>Pitchbase</h3><button type="button" class="btn btn-ghost btn-sm" data-act="fenetre">Ouvrir dans une fenêtre</button></div>' +
        '<iframe class="bsent-cadre" src="' + SITE + '" title="Pitchbase" allow="microphone; camera; autoplay; clipboard-read; clipboard-write; fullscreen"></iframe></section>'
      : '';
    return tete() + '<div class="bsent-3"><div class="bsent-g">' + vueListe() + '</div><div class="bsent-c">' + vueCentre(rec) + '</div>' +
      '<div class="bsent-d">' + vueProfil() + vuePerf(rec) + vueReco(rec) + vueOutils() + '</div></div>' + cadre;
  }
  function rendre() {
    if (!racine || !racine.isConnected) return;
    if (S.appel) {
      if (!racine.querySelector('[data-z=fil]')) { racine.innerHTML = page(); racine.classList.add('bsent-occupe'); }
      majAppel(); majChrono();
      return;
    }
    racine.classList.remove('bsent-occupe');
    var zone = racine.querySelector('textarea[name=fiche]');
    if (zone && S.modifiee) S.fiche = zone.value;
    var q = racine.querySelector('input[name=recherche]'), texte = q ? q.value : '';
    racine.innerHTML = page();
    if (texte) { racine.querySelector('input[name=recherche]').value = texte; filtrer(texte); }
  }
  function tete() {
    return '<div class="page-head"><div class="page-head-text"><h1 class="page-title">Simulations IA</h1><p class="page-sub">Entraînez-vous face à un prospect joué par l’IA, à la voix, puis appelez pour de vrai.</p></div></div>';
  }

  function compteRendu() {
    var R = dernier(cleCourante()); if (!R) return '';
    var n = R.n, l = ['Simulation ' + (R.ia ? 'avec Claude' : 'sans IA') + ' : ' + R.titre + ' (' + NIVEAUX[R.niveau][0].toLowerCase() + ', ' + duree(R.duree) + ')', 'Note : ' + n.note + '/10. ' + n.verdict, ''];
    if (n.competences) l.push('Compétences : ' + COMP.map(function (k) { return k[1] + ' ' + n.competences[k[0]] + '/100'; }).join(', '), '');
    l.push('Points forts :'); (n.points_forts || []).forEach(function (x) { l.push('- ' + x); });
    l.push('', 'À améliorer :'); (n.a_ameliorer || []).forEach(function (x) { l.push('- ' + x); });
    if (n.phrase_a_essayer) l.push('', 'À essayer : « ' + n.phrase_a_essayer + ' »');
    l.push('', 'Transcription :'); R.messages.forEach(function (m) { l.push((m.de === 'prospect' ? 'Prospect' : 'Vous') + ' : ' + m.texte); });
    return l.join('\n');
  }

  function choisir(cle) {
    if (S.appel) return;
    if (cle.indexOf('m:') === 0 && modele(cle.slice(2))) S.sel = { type: 'modele', id: cle.slice(2) };
    else { S.sel = { type: 'perso' }; S.prospectId = cle.indexOf('p:') === 0 ? cle.slice(2) : ''; S.objectif = ''; }
    S.msg = null; S.rapport = null; S.onglet = dernier(cleCourante()) ? 'analyse' : 'transcription';
    regenerer(); rendre();
    var c = racine.querySelector('.bsent-c');
    if (c && window.matchMedia('(max-width: 1100px)').matches) try { c.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* rien */ }
  }
  function onglet(k) {
    S.onglet = k;
    Array.prototype.forEach.call(racine.querySelectorAll('[data-onglet]'), function (b) { var on = b.getAttribute('data-onglet') === k; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); });
    Array.prototype.forEach.call(racine.querySelectorAll('[data-pane]'), function (x) { x.hidden = x.getAttribute('data-pane') !== k; });
  }

  function brancher(el) {
    el.addEventListener('change', function (ev) {
      var n = ev.target.name;
      if (n === 'prospect') { S.prospectId = ev.target.value; S.objectif = ''; S.msg = null; regenerer(); rendre(); }
      if (n === 'niveau') { P.niveau = ev.target.value; ecrire(); if (!S.modifiee) regenerer(); rendre(); }
      if (n === 'objectif') { S.objectif = ev.target.value; if (!S.modifiee) regenerer(); rendre(); }
      if (n === 'offre') { P.offre = ev.target.value.trim() || P.offre; ecrire(); if (!S.modifiee) regenerer(); rendre(); }
    });
    el.addEventListener('input', function (ev) {
      var n = ev.target.name;
      if (n === 'fiche') { S.fiche = ev.target.value; S.modifiee = true; }
      if (n === 'recherche') filtrer(ev.target.value);
      if (n === 'notes') { var c = S.appel ? S.appel.cle : cleCourante(); if (ev.target.value.trim()) P.notes[c] = ev.target.value.slice(0, 5000); else delete P.notes[c]; ecrire(); }
    });
    el.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var f = ev.target;
      if (f.getAttribute('data-form') === 'cle') { var v = (f.querySelector('input[name=cle]') || {}).value || ''; if (v.trim()) enregistrerCle(v.trim()); return; }
      if (f.getAttribute('data-z') === 'clavier') { var c = f.querySelector('input[name=reponse]'); envoyer(c && c.value); }
    });
    el.addEventListener('click', function (ev) {
      var m = ev.target.closest('[data-mode]');
      if (m) { P.mode = m.getAttribute('data-mode'); ecrire(); rendre(); return; }
      var o = ev.target.closest('[data-onglet]'); if (o) { onglet(o.getAttribute('data-onglet')); return; }
      var f = ev.target.closest('[data-filtre]'); if (f) { if (!S.appel) { S.filtre = f.getAttribute('data-filtre'); rendre(); } return; }
      var sc = ev.target.closest('[data-scenario],[data-prospect],[data-perso],[data-rejouer]');
      if (sc) {
        choisir(sc.hasAttribute('data-scenario') ? 'm:' + sc.getAttribute('data-scenario') : sc.hasAttribute('data-prospect') ? 'p:' + sc.getAttribute('data-prospect') : sc.hasAttribute('data-rejouer') ? sc.getAttribute('data-rejouer') : 'perso');
        return;
      }
      var t = ev.target.closest('[data-act]'); if (!t) return;
      var a = t.getAttribute('data-act'), A = S.appel;
      if (a === 'demarrer') demarrer();
      if (a === 'raccrocher') terminer();
      if (a === 'abandonner') abandonner();
      if (a === 'reessayer' && A) { A.alerte = ''; repondre(A); }
      if (a === 'envoyer-dicte' && A) envoyer((A.dicte + ' ' + A.interim).trim());
      if (a === 'micro' && A) { if (A.ecoute) { arreterEcoute(); majAppel(); } else ecouter(); }
      if (a === 'bascule' && A) { A.mode = A.mode === 'voix' ? 'clavier' : 'voix'; A.alerte = ''; if (A.mode === 'voix') ecouter(); else { arreterEcoute(); } majAppel(); }
      if (a === 'pitchbase') lancerPitchbase();
      if (a === 'copier') copier(S.fiche).then(function (ok) { S.msg = ok ? { k: 'ok', t: 'Fiche copiée : collez-la dans Pitchbase (Ctrl + V).' } : { k: 'warn', t: 'Copie impossible : ouvrez la fiche du scénario, sélectionnez le texte et copiez-le.' }; rendre(); });
      if (a === 'copier-rapport') copier(compteRendu()).then(function (ok) { t.textContent = ok ? 'Compte rendu copié' : 'Copie impossible'; });
      if (a === 'refaire') { regenerer(); rendre(); }
      if (a === 'voir-cle') { S.voirCle = !S.voirCle; S.cleMsg = null; rendre(); }
      if (a === 'retirer-cle') retirerCle();
      if (a === 'fiche-prospect' && S.prospectId) { var Y = window.__bsY; if (Y && Y.set) Y.set(function (s) { return { overlays: (s.overlays || []).concat([{ key: 'bsent' + Date.now(), type: 'prospect', id: S.prospectId }]) }; }); }
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
