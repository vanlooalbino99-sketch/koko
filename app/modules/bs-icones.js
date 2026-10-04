
/* Blackstart CRM : icônes du menu (Réglages › Icônes du menu).
 *
 * - Chaque rubrique du menu (Aujourd'hui, Agenda, Formations…) peut recevoir une autre icône, choisie parmi
 *   près de 1 000 icônes classées par thème (bibliothèque bs-icones-lib.js), avec une recherche en français
 *   et des idées adaptées à chaque rubrique.
 * - Le choix est rangé avec les réglages d'ambiance : dans ce navigateur pour la version autonome, sur le
 *   serveur (partagé avec l'équipe, modifiable par les administrateurs) pour la version équipe.
 * - Couleurs : neutre (blanc en mode sombre), accent, multicolore ou une couleur personnalisée pour tout le
 *   menu ; chaque rubrique peut aussi recevoir sa propre couleur (pastilles ou nuancier), qui prime sur le reste.
 * - L'interface appelle window.bsIcones.nav(id, icôneParDéfaut) pour dessiner le menu, et le composant
 *   d'icône de l'interface se sert de window.bsIcones.svg(nom) pour les icônes qu'il ne connaît pas.
 */
(function () {
  'use strict';
  if (window.bsIcones) return;

  var LIB = window.bsIconesLib || { d: {}, t: {}, g: [], s: '', i: {} };
  var SERVER = !!window.BS_SERVER;
  var CACHE_KEY = 'bs-icones';
  var NAV = [
    { group: 'Prospection' },
    { id: 'today', label: 'Aujourd’hui', def: 'phone' },
    { id: 'agenda', label: 'Agenda', def: 'calendar' },
    { id: 'prospects', label: 'Prospects', def: 'users' },
    { id: 'pipeline', label: 'Pipeline', def: 'kanban' },
    { id: 'tasks', label: 'Tâches', def: 'checkSquare' },
    { group: 'Ventes' },
    { id: 'devis', label: 'Devis & factures', def: 'fileText' },
    { id: 'clients', label: 'Clients', def: 'briefcase' },
    { id: 'payments', label: 'Paiements', def: 'wallet' },
    { group: 'Analyse' },
    { id: 'dashboard', label: 'Tableau de bord', def: 'dashboard' },
    { id: 'reports', label: 'Rapports', def: 'lineChart' },
    { group: 'Bas du menu' },
    { id: 'formations', label: 'Formations', def: 'play' },
    { id: 'tools', label: 'Outils', def: 'wrench' },
    { id: 'settings', label: 'Réglages', def: 'settings' },
  ];
  var GROUPS = {
    education: 'Éducation & savoir', business: 'Business & finance', graphiques: 'Graphiques & analyse',
    communication: 'Communication', personnes: 'Personnes & équipe', temps: 'Temps & agenda', ia: 'IA & technologie',
    fichiers: 'Fichiers & documents', outils: 'Outils & réglages', lieux: 'Lieux & voyages', transport: 'Transport',
    securite: 'Sécurité', medias: 'Médias & photo', nature: 'Nature & météo', sante: 'Santé & sport',
    loisirs: 'Loisirs & cuisine', divers: 'Divers',
  };
  // Recherche en français : chaque mot est traduit vers les mots-clés (anglais) de la bibliothèque.
  var FR = {
    formation: 'graduation school education learn lesson training teach study presentation', former: 'education teach learn',
    apprendre: 'learn education study school', apprentissage: 'learn education study', ecole: 'school education',
    universite: 'university graduation school college', diplome: 'diploma graduation certificate award',
    cours: 'lesson class education presentation graduation', classe: 'class school', eleve: 'student school', etudiant: 'student school graduation',
    livre: 'book read library', lire: 'read book', bibliotheque: 'library book', etude: 'study education', etudier: 'study education',
    savoir: 'knowledge education book brain', connaissance: 'knowledge education book', idee: 'idea lightbulb', ampoule: 'lightbulb',
    cerveau: 'brain', ia: 'bot brain ai robot cpu circuit artificial intelligence wand', intelligence: 'ai intelligence brain bot',
    artificielle: 'ai artificial robot bot', robot: 'robot bot', automatisation: 'bot workflow automation zap', magie: 'magic sparkles wand',
    etoile: 'star sparkles', telephone: 'phone call', appel: 'phone call', appeler: 'phone call', casque: 'headset headphones',
    agenda: 'calendar date schedule', calendrier: 'calendar date schedule', rendez: 'calendar appointment meeting', rdv: 'calendar appointment meeting',
    reunion: 'meeting users presentation', date: 'calendar date', heure: 'clock time watch', horloge: 'clock time', temps: 'clock time hourglass timer',
    minuteur: 'timer stopwatch', chrono: 'timer stopwatch', alarme: 'alarm', reveil: 'alarm clock', sablier: 'hourglass',
    client: 'user users contact briefcase customer', prospect: 'user target search users contact', contact: 'contact user phone mail address',
    equipe: 'users team group', personne: 'user person account', utilisateur: 'user account', profil: 'user profile account',
    pipeline: 'kanban workflow funnel columns', entonnoir: 'funnel filter', tache: 'check task todo list clipboard', liste: 'list',
    valider: 'check done', coche: 'check done', fait: 'check done', devis: 'file text receipt document quote calculator',
    facture: 'receipt invoice bill file', document: 'file document text', fichier: 'file', dossier: 'folder',
    signature: 'signature pen sign', signer: 'signature pen sign', contrat: 'file signature handshake scroll',
    paiement: 'wallet credit card payment money banknote', payer: 'wallet credit card payment money', argent: 'money banknote coins wallet euro dollar piggy',
    banque: 'bank landmark vault', euro: 'euro', dollar: 'dollar', portefeuille: 'wallet', epargne: 'piggy savings', tirelire: 'piggy',
    prix: 'tag price award', tarif: 'tag price', promo: 'percent tag discount', reduction: 'percent tag discount',
    achat: 'shopping cart bag', acheter: 'shopping cart bag', panier: 'shopping cart basket', boutique: 'store shop', magasin: 'store shop',
    vente: 'sale shopping trending handshake', affaire: 'handshake deal briefcase', accord: 'handshake deal agreement',
    entreprise: 'building briefcase factory company', societe: 'building briefcase company', bureau: 'building briefcase office desk', travail: 'briefcase work',
    tableau: 'dashboard layout gauge', bord: 'dashboard gauge', statistique: 'chart graph analytics trending', stat: 'chart graph analytics',
    analyse: 'chart graph analytics trending', rapport: 'chart report presentation file', graphique: 'chart graph', courbe: 'chart line spline',
    croissance: 'trending growth rocket sprout', hausse: 'trending up', baisse: 'trending down', objectif: 'target goal flag',
    cible: 'target crosshair', but: 'target goal', reussite: 'trophy award medal crown star', succes: 'trophy award medal success',
    victoire: 'trophy medal crown', gagner: 'trophy award medal', recompense: 'award trophy medal gift', fusee: 'rocket launch', lancement: 'rocket launch',
    outil: 'wrench tool hammer toolbox', reglage: 'settings cog sliders', parametre: 'settings cog sliders', configuration: 'settings cog sliders',
    maison: 'house home', accueil: 'house home', jour: 'sun calendar today', soleil: 'sun', lune: 'moon', nuit: 'moon night',
    meteo: 'cloud sun weather rain', nature: 'leaf tree flower', plante: 'sprout leaf plant flower', arbre: 'tree', fleur: 'flower',
    montagne: 'mountain', mer: 'waves sea', plage: 'beach waves', vague: 'waves', voyage: 'plane travel luggage map', avion: 'plane',
    voiture: 'car', camion: 'truck', livraison: 'truck delivery package', colis: 'package box', paquet: 'package box',
    carte: 'map card credit', plan: 'map', lieu: 'map pin location', adresse: 'map pin location', monde: 'globe world earth',
    international: 'globe world', boussole: 'compass', message: 'message chat', discussion: 'message chat messages', chat: 'message chat',
    mail: 'mail inbox', email: 'mail inbox', courriel: 'mail inbox', notification: 'bell notification', alerte: 'bell alert siren',
    cloche: 'bell', envoyer: 'send', partager: 'share', lien: 'link', recherche: 'search', chercher: 'search', loupe: 'search zoom',
    oeil: 'eye', voir: 'eye view', securite: 'lock shield security', cadenas: 'lock', verrou: 'lock', cle: 'key', bouclier: 'shield',
    coeur: 'heart', amour: 'heart', favori: 'heart star bookmark', sourire: 'smile', content: 'smile happy', pouce: 'thumbs',
    feu: 'flame fire', flamme: 'flame', eclair: 'zap bolt', energie: 'zap battery energy', diamant: 'gem diamond', couronne: 'crown',
    cadeau: 'gift', fete: 'party celebration cake', video: 'video film clapperboard play', film: 'film clapperboard video',
    jouer: 'play gamepad', musique: 'music', micro: 'mic microphone', photo: 'camera image', image: 'image picture',
    couleur: 'palette paint color', peinture: 'paint brush palette', design: 'palette pen brush', ecrire: 'pen pencil write',
    stylo: 'pen', crayon: 'pencil', note: 'notebook note sticky', carnet: 'notebook', presentation: 'presentation screen',
    ecran: 'monitor screen', ordinateur: 'monitor laptop computer', portable: 'laptop smartphone', mobile: 'smartphone mobile',
    puce: 'cpu chip microchip', processeur: 'cpu chip', donnee: 'database data server', base: 'database', serveur: 'server',
    nuage: 'cloud', code: 'code terminal braces', science: 'flask atom microscope', labo: 'flask microscope', atome: 'atom',
    sante: 'heart pulse stethoscope medical', medecin: 'stethoscope medical', sport: 'dumbbell trophy bike', cafe: 'coffee',
    repas: 'utensils food', restaurant: 'utensils chef', manger: 'utensils food', calcul: 'calculator', calculatrice: 'calculator',
    pourcentage: 'percent', drapeau: 'flag', signet: 'bookmark', etiquette: 'tag label', historique: 'history',
    telecharger: 'download', importer: 'upload import', exporter: 'download export share', imprimer: 'printer',
    supprimer: 'trash delete', poubelle: 'trash', ajouter: 'plus add', annonce: 'megaphone announcement', marketing: 'megaphone target',
    publicite: 'megaphone ad', reseau: 'network share wifi link', connexion: 'link wifi plug log', satellite: 'satellite',
    infini: 'infinity', aide: 'help question', question: 'help question', info: 'info', attention: 'alert triangle warning',
    animal: 'dog cat bird fish paw', chien: 'dog', chat2: 'cat', oiseau: 'bird', poisson: 'fish', jeu: 'gamepad dice puzzle',
    puzzle: 'puzzle', cle2: 'key', medaille: 'medal award', trophee: 'trophy', etoiles: 'sparkles star',
  };

  var map = readCache();     // id de rubrique -> nom d'icône de la bibliothèque
  var style = readStyle();   // { trait: fin | normal | gras, couleur: neutre | accent | multi | perso, perso: #hex, teintes: { rubrique: #hex } }
  var STYLE_KEY = 'bs-icones-style';
  // Nuancier proposé pour les icônes (le sélecteur de couleur permet n'importe quelle autre teinte).
  var NUANCIER = ['#ffffff', '#cbd5e1', '#94a3b8', '#60a5fa', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9'];
  // Couleur propre à chaque rubrique en style « Multicolore ».
  var TEINTES = { today: '#3b82f6', agenda: '#8b5cf6', prospects: '#06b6d4', pipeline: '#6366f1', tasks: '#10b981', devis: '#f59e0b', clients: '#f97316', payments: '#22c55e', dashboard: '#0ea5e9', reports: '#f43f5e', formations: '#eab308', tools: '#94a3b8', settings: '#a1a1aa' };
  // Packs : un jeu complet d'icônes cohérentes, appliqué en un clic (l'ordre suit celui du menu).
  var ORDRE = ['today', 'agenda', 'prospects', 'pipeline', 'tasks', 'devis', 'clients', 'payments', 'dashboard', 'reports', 'formations', 'tools', 'settings'];
  var PACKS = [
    { id: 'origine', nom: 'Origine', desc: 'Les icônes livrées avec le CRM', noms: '' },
    { id: 'moderne', nom: 'Moderne', desc: 'Lignes nettes, esprit produit tech', noms: 'sun calendar-days radar workflow list-checks file-pen-line gem credit-card gauge chart-spline graduation-cap wand-sparkles sliders-horizontal' },
    { id: 'business', nom: 'Business', desc: 'Classique et rassurant pour la vente', noms: 'phone-call calendar-clock target funnel clipboard-check receipt handshake banknote chart-pie presentation school toolbox cog' },
    { id: 'energie', nom: 'Énergie', desc: 'Dynamique et motivant pour l’équipe', noms: 'rocket calendar-heart magnet route circle-check-big scroll-text crown piggy-bank compass trending-up lightbulb bot settings-2' },
    { id: 'epure', nom: 'Épuré', desc: 'Formes simples, lecture immédiate', noms: 'house calendar user search square-check-big file briefcase-business euro layout-grid chart-no-axes-column book-open hammer settings' },
  ];
  PACKS.forEach(function (pk) {
    pk.map = {};
    if (pk.noms) pk.noms.split(' ').forEach(function (n, i) { if (LIB.d[n]) pk.map[ORDRE[i]] = n; });
  });
  // Mots (français) qui complètent les idées de chaque rubrique avec les meilleurs résultats de recherche.
  var IDEES_MOTS = {
    today: 'telephone appel jour objectif fusee', agenda: 'agenda calendrier heure rendez minuteur', prospects: 'prospect cible recherche annonce',
    pipeline: 'pipeline entonnoir croissance', tasks: 'tache valider liste note', devis: 'devis facture signature contrat calcul',
    clients: 'client accord couronne entreprise', payments: 'paiement argent banque epargne', dashboard: 'tableau bord statistique ecran',
    reports: 'rapport graphique croissance analyse', formations: 'formation diplome livre savoir idee video', tools: 'outil ia automatisation magie',
    settings: 'reglage securite cle profil',
  };
  var rev = 0;
  var svgCache = {};

  function readStyle() { try { return cleanStyle(JSON.parse(localStorage.getItem('bs-icones-style') || '{}')); } catch (e) { return cleanStyle({}); } }
  function isHex(c) { return typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c); }
  function cleanStyle(st) {
    st = st && typeof st === 'object' ? st : {};
    var teintes = {};
    if (st.teintes && typeof st.teintes === 'object') NAV.forEach(function (n) { if (n.id && isHex(st.teintes[n.id])) teintes[n.id] = st.teintes[n.id].toLowerCase(); });
    return {
      trait: ['fin', 'normal', 'gras'].indexOf(st.trait) >= 0 ? st.trait : 'normal',
      couleur: ['neutre', 'accent', 'multi', 'perso'].indexOf(st.couleur) >= 0 ? st.couleur : 'neutre',
      perso: isHex(st.perso) ? st.perso.toLowerCase() : '#60a5fa',
      teintes: teintes,
    };
  }
  // Couleur effective d'une rubrique ('' = couleur par défaut du thème).
  function teinte(id) {
    return style.teintes[id] || (style.couleur === 'multi' ? TEINTES[id] : style.couleur === 'perso' ? style.perso : '');
  }
  function applyStyle() {
    var h = document.documentElement;
    h.setAttribute('data-bsi-trait', style.trait); h.setAttribute('data-bsi-couleur', style.couleur);
    h.style.setProperty('--bsi-perso', style.perso);
    // Couleur choisie pour une rubrique : elle prime sur le style du menu, même sur la rubrique active.
    var el = document.getElementById('bs-icones-teintes');
    if (!el) { el = document.createElement('style'); el.id = 'bs-icones-teintes'; (document.head || document.documentElement).appendChild(el); }
    el.textContent = Object.keys(style.teintes).map(function (id) {
      return '.sidebar [data-nav="' + id + '"] .ic,.bottom-nav [data-nav="' + id + '"] .ic{color:' + style.teintes[id] + '!important}';
    }).join('\n');
  }
  function readCache() { try { return clean(JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')); } catch (e) { return {}; } }
  function writeCache() { try { localStorage.setItem(CACHE_KEY, JSON.stringify(map)); } catch (e) {} }
  function clean(m) {
    var out = {};
    if (!m || typeof m !== 'object') return out;
    NAV.forEach(function (n) { if (n.id && typeof m[n.id] === 'string' && LIB.d[m[n.id]]) out[n.id] = m[n.id]; });
    return out;
  }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // ---------------------------------------------------------------- dessin
  function svg(name) {
    if (!LIB.d[name]) return '';
    return svgCache[name] || (svgCache[name] = LIB.d[name].split('|').map(function (d) { return '<path d="' + d + '"/>'; }).join(''));
  }
  // Une icône quelconque : celle de l'interface d'abord (mêmes noms que le menu d'origine), sinon la bibliothèque.
  function inner(name) {
    var hs = window.__bsHs ? window.__bsHs() : null;
    return (hs && hs[name]) || svg(name) || (hs && hs.circle) || '';
  }
  function icon(name, size) {
    return '<svg class="ic" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner(name) + '</svg>';
  }
  function nav(id, def) { return map[id] || def; }
  function refresh() {
    rev++;
    if (window.__bsY) window.__bsY.set({ bsIc: rev });
    listeners.forEach(function (l) { l(); });
  }
  var listeners = [];

  // ---------------------------------------------------------------- enregistrement
  function amb() { return window.bsAmbiance && window.bsAmbiance.etat ? window.bsAmbiance : null; }
  function canEdit() { var a = amb(); return !a || a.etat().modifiable !== false; }
  function save(next) {
    map = clean(next); writeCache(); refresh();
    var a = amb();
    if (a) return Promise.resolve(a.reglages({ icones: map }));
    return Promise.resolve();
  }
  function saveStyle(patch) {
    style = cleanStyle(Object.assign({}, style, patch));
    try { localStorage.setItem(STYLE_KEY, JSON.stringify(style)); } catch (e) {}
    applyStyle(); listeners.forEach(function (l) { l(); });
    var a = amb();
    if (a) return Promise.resolve(a.reglages({ iconesStyle: style }));
    return Promise.resolve();
  }
  function syncFromAmbiance() {
    var a = amb(); if (!a) return;
    var c = a.etat().config || {};
    if (!a.etat().pret) return;
    var next = clean(c.icones || {});
    if (JSON.stringify(next) !== JSON.stringify(map)) { map = next; writeCache(); refresh(); }
    var st = cleanStyle(c.iconesStyle);
    if (JSON.stringify(st) !== JSON.stringify(style)) { style = st; try { localStorage.setItem(STYLE_KEY, JSON.stringify(style)); } catch (e) {} applyStyle(); listeners.forEach(function (l) { l(); }); }
  }
  function hook() {
    var a = amb();
    if (a && a.ecouter) { a.ecouter(syncFromAmbiance); syncFromAmbiance(); }
    else setTimeout(hook, 200);
  }

  // ---------------------------------------------------------------- recherche
  var index = null;
  function buildIndex() {
    index = {};
    var groupOf = {};
    LIB.g.forEach(function (g) { g[1].split(' ').forEach(function (n) { groupOf[n] = g[0]; }); });
    Object.keys(LIB.d).forEach(function (n) {
      index[n] = { g: groupOf[n] || 'divers', tags: norm(LIB.t[n] || '').split(' '), grp: norm(GROUPS[groupOf[n]] || '').split(' ') };
    });
  }
  // Mots-clés à chercher pour un mot tapé : le mot lui-même, puis sa traduction (les premiers mots comptent plus).
  function terms(word) {
    var out = [word], w = word.replace(/s$/, '');
    Object.keys(FR).forEach(function (k) {
      var key = k.replace(/\d+$/, '');
      if (key === word || key === w || (w.length >= 4 && key.indexOf(w) === 0)) out = out.concat(FR[k].split(' '));
    });
    return out.filter(function (t, i) { return t && out.indexOf(t) === i; });
  }
  // Pertinence d'une icône pour un mot : nom de l'icône > mots-clés > thème. 0 = ne correspond pas.
  function weight(ix, n, ts) {
    var best = 0, nameWords = n.split('-');
    for (var i = 0; i < ts.length; i++) {
      var t = ts[i], k = 1 - Math.min(i, 12) * 0.04, wgt = 0;
      var match = function (x) { return t.length < 3 ? x === t : x.indexOf(t) === 0; };
      if (nameWords.some(function (x) { return x === t; })) wgt = 8;
      else if (nameWords.some(match)) wgt = 5;
      else if (ix.tags.some(match)) wgt = 2.5;
      else if (ix.grp.some(match)) wgt = 1;
      if (wgt * k > best) best = wgt * k;
    }
    return best;
  }
  function search(q) {
    if (!index) buildIndex();
    var words = norm(q).split(' ').filter(function (x) { return x.length >= 2; });
    if (!words.length) return [];
    var lists = words.map(terms), res = [];
    Object.keys(index).forEach(function (n) {
      var score = 0;
      for (var i = 0; i < lists.length; i++) { var w = weight(index[n], n, lists[i]); if (!w) return; score += w; }
      res.push([n, score]);
    });
    res.sort(function (a, b) { return b[1] - a[1] || a[0].length - b[0].length || (a[0] < b[0] ? -1 : 1); });
    return res.map(function (r) { return r[0]; });
  }
  function groupList(id) {
    if (!index) buildIndex();
    if (id === 'toutes') return Object.keys(LIB.d).sort();
    var g = LIB.g.filter(function (x) { return x[0] === id; })[0];
    return g ? g[1].split(' ') : [];
  }
  var ideasCache = {};
  function ideas(navId) {
    if (ideasCache[navId]) return ideasCache[navId];
    var out = (LIB.i[navId] || '').split(' ').filter(function (n) { return LIB.d[n]; });
    // Puis, mot par mot, les meilleures icônes de la recherche, en alternant pour garder de la variété.
    var lists = (IDEES_MOTS[navId] || '').split(' ').filter(Boolean).map(function (w) { return search(w).slice(0, 12); });
    var bof = /(^|-)(x|off|minus|lock|dashed|slash|bug|omega|alert|question|playing)(-|$)/;
    lists = lists.map(function (l) { return l.filter(function (n) { return !bof.test(n); }); });
    for (var r = 0; r < 12 && out.length < 40; r++) lists.forEach(function (l) { var n = l[r]; if (n && out.indexOf(n) < 0 && out.length < 40) out.push(n); });
    return (ideasCache[navId] = out);
  }
  function samePack(pk) {
    var a = Object.keys(map), b = Object.keys(pk.map);
    return a.length === b.length && b.every(function (k) { return map[k] === pk.map[k]; });
  }

  // ---------------------------------------------------------------- styles
  // Style des icônes du menu (toujours chargé) : épaisseur du trait et couleur.
  function globalCss() {
    var st = document.createElement('style'); st.id = 'bs-icones-menu';
    var multi = Object.keys(TEINTES).map(function (id) {
      return 'html[data-bsi-couleur="multi"] [data-nav="' + id + '"] .ic{color:' + TEINTES[id] + '}';
    });
    st.textContent = [
      // Mode sombre : rubriques du menu bien blanches (texte et icônes), active comprise.
      '[data-scheme="dark"] .sidebar .nav-item,[data-scheme="dark"] .sidebar .nav-item:hover,[data-scheme="dark"] .sidebar .nav-item.active{color:#fff}',
      '[data-scheme="dark"][data-bsi-couleur="neutre"] .sidebar .nav-item .ic{color:#fff}',
      '[data-scheme="dark"] .bottom-nav .bn-item,[data-scheme="dark"] .bottom-nav .bn-item.active{color:#fff}',
      'html[data-bsi-couleur="perso"] .sidebar .nav-item .ic,html[data-bsi-couleur="perso"] .bottom-nav .bn-item .ic{color:var(--bsi-perso)}',
      'html[data-bsi-trait="fin"] .sidebar .nav-item .ic,html[data-bsi-trait="fin"] .bottom-nav .ic{stroke-width:1.5}',
      'html[data-bsi-trait="gras"] .sidebar .nav-item .ic,html[data-bsi-trait="gras"] .bottom-nav .ic{stroke-width:2.6}',
      'html[data-bsi-couleur="accent"] .sidebar .nav-item .ic{color:var(--accent-text,var(--accent))}',
      '[data-scheme="light"][data-bsi-couleur="accent"] .sidebar .nav-item .ic{color:var(--accent)}',
      'html[data-bsi-couleur="multi"] .sidebar .nav-item .ic{filter:drop-shadow(0 0 6px currentColor) saturate(1.1)}',
      '[data-scheme="light"][data-bsi-couleur="multi"] .sidebar .nav-item .ic{filter:none}',
    ].concat(multi).join('\n');
    (document.head || document.documentElement).appendChild(st);
  }
  var cssDone = false;
  function ensureCss() {
    if (cssDone) return; cssDone = true;
    var st = document.createElement('style'); st.id = 'bs-icones-css';
    st.textContent = [
      '.bsi-layout{display:grid;grid-template-columns:minmax(220px,280px) 1fr;gap:18px;margin-top:14px;align-items:start}',
      '@media (max-width:900px){.bsi-layout{grid-template-columns:1fr}}',
      '.bsi-nav{display:flex;flex-direction:column;gap:3px;position:sticky;top:12px}',
      '.bsi-gl{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text-3);margin:10px 10px 4px}',
      '.bsi-gl:first-child{margin-top:0}',
      '.bsi-row{display:flex;align-items:center;gap:10px;width:100%;padding:5px 8px;border-radius:12px;border:1px solid transparent;background:transparent;color:var(--text-2);font:inherit;font-size:14px;font-weight:600;text-align:left;cursor:pointer;transition:background .15s,border-color .15s,color .15s}',
      '.bsi-row:hover{background:rgb(var(--text-rgb)/.05);color:var(--text)}',
      '.bsi-row.sel{background:linear-gradient(180deg,rgb(var(--accent-rgb)/.2),rgb(var(--accent-rgb)/.1));border-color:rgb(var(--accent-rgb)/.45);color:var(--text);box-shadow:inset 0 1px 0 rgb(255 255 255/.08),0 6px 18px -8px rgb(var(--accent-rgb)/.6)}',
      '.bsi-cur{width:30px;height:30px;flex:none;display:grid;place-items:center;border-radius:10px;background:linear-gradient(180deg,rgb(var(--text-rgb)/.08),rgb(var(--text-rgb)/.03));border:1px solid var(--border);color:var(--text)}',
      '.bsi-row[style] .bsi-cur{color:var(--bsi-t)}',
      '.bsi-row.sel .bsi-cur{background:linear-gradient(180deg,rgb(var(--accent-rgb)),color-mix(in srgb,rgb(var(--accent-rgb)) 70%,#000));border-color:transparent;color:#fff;box-shadow:0 4px 12px -4px rgb(var(--accent-rgb)/.8)}',
      '.bsi-lab{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.bsi-mod{font-size:10.5px;font-weight:700;padding:2px 7px;border-radius:999px;background:rgb(var(--accent-rgb)/.16);color:rgb(var(--accent-rgb))}',
      '.bsi-pick{min-width:0;border:1px solid var(--border);border-radius:16px;padding:16px;background:linear-gradient(180deg,rgb(var(--text-rgb)/.035),transparent 60%)}',
      '.bsi-head{display:flex;align-items:center;gap:14px;margin-bottom:14px;flex-wrap:wrap}',
      '.bsi-big{width:58px;height:58px;flex:none;display:grid;place-items:center;border-radius:16px;color:#fff;background:radial-gradient(120% 100% at 30% 15%,color-mix(in srgb,rgb(var(--accent-rgb)) 55%,#fff),rgb(var(--accent-rgb)) 45%,color-mix(in srgb,rgb(var(--accent-rgb)) 55%,#000));box-shadow:inset 0 1px 0 rgb(255 255 255/.35),0 10px 24px -10px rgb(var(--accent-rgb)/.9)}',
      '.bsi-ht{flex:1;min-width:200px}',
      '.bsi-ht b{display:block;font-size:15.5px;color:var(--text);line-height:1.3}',
      '.bsi-ht span{font-size:13px;color:var(--text-3)}',
      '.bsi-tools{display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap}',
      '.bsi-tools .search{flex:1;min-width:220px}',
      '.bsi-count{font-size:12.5px;color:var(--text-3);white-space:nowrap}',
      '.bsi-chips{display:flex;gap:6px;flex-wrap:nowrap;overflow-x:auto;margin:0 -4px 12px;padding:2px 4px 6px;scrollbar-width:thin;-webkit-mask-image:linear-gradient(90deg,#000 92%,transparent);mask-image:linear-gradient(90deg,#000 92%,transparent)}',
      '.bsi-chip{flex:none;white-space:nowrap;padding:5px 11px;border-radius:999px;border:1px solid var(--border);background:var(--surface);color:var(--text-2);font:inherit;font-size:12.5px;font-weight:600;cursor:pointer;transition:all .15s}',
      '.bsi-chip:hover{color:var(--text);border-color:rgb(var(--accent-rgb)/.4)}',
      '.bsi-chip.on{background:rgb(var(--accent-rgb));border-color:rgb(var(--accent-rgb));color:#fff;box-shadow:0 4px 12px -5px rgb(var(--accent-rgb)/.9)}',
      '.bsi-chip small{opacity:.7;font-weight:600;margin-left:3px}',
      '.bsi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(52px,1fr));gap:6px;max-height:440px;overflow:auto;padding:2px;scrollbar-width:thin}',
      '.bsi-ic{aspect-ratio:1;display:grid;place-items:center;border-radius:12px;border:1px solid transparent;background:rgb(var(--text-rgb)/.04);color:var(--text-2);cursor:pointer;transition:background .12s,color .12s,border-color .12s,transform .12s}',
      '.bsi-ic:hover{background:rgb(var(--accent-rgb)/.14);color:var(--text);border-color:rgb(var(--accent-rgb)/.35);transform:translateY(-1px)}',
      '.bsi-ic.on{background:linear-gradient(180deg,rgb(var(--accent-rgb)),color-mix(in srgb,rgb(var(--accent-rgb)) 70%,#000));color:#fff;border-color:transparent;box-shadow:0 6px 16px -6px rgb(var(--accent-rgb)/.9)}',
      '.bsi-ic:disabled{cursor:default;transform:none}',
      '.bsi-empty{padding:26px 8px;text-align:center;color:var(--text-3);font-size:13.5px}',
      '.bsi-foot{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-top:14px}',
      '.bsi-lock{display:flex;gap:8px;align-items:center;padding:10px 12px;border-radius:12px;background:rgb(var(--text-rgb)/.05);color:var(--text-2);font-size:13px;margin-top:12px}',
      '.bsi-hint{font-size:12.5px;color:var(--text-3)}',
      '.bsi-packs{display:grid;grid-template-columns:repeat(auto-fill,minmax(158px,1fr));gap:10px;margin-top:14px}',
      '.bsi-pack{position:relative;display:flex;flex-direction:column;gap:4px;align-items:stretch;text-align:left;padding:12px 13px 11px;border-radius:14px;border:1px solid var(--border);background:linear-gradient(180deg,rgb(var(--text-rgb)/.045),rgb(var(--text-rgb)/.015));color:var(--text);font:inherit;cursor:pointer;transition:border-color .15s,box-shadow .15s,transform .15s,background .15s}',
      '.bsi-pack:hover{border-color:rgb(var(--accent-rgb)/.45);transform:translateY(-1px);box-shadow:0 10px 24px -14px rgb(var(--accent-rgb)/.8)}',
      '.bsi-pack.on{border-color:rgb(var(--accent-rgb)/.7);background:linear-gradient(180deg,rgb(var(--accent-rgb)/.16),rgb(var(--accent-rgb)/.05));box-shadow:inset 0 1px 0 rgb(255 255 255/.08),0 10px 26px -14px rgb(var(--accent-rgb)/.9)}',
      '.bsi-pack:disabled{cursor:default;transform:none}',
      '.bsi-pk-h{display:flex;align-items:center;justify-content:space-between;gap:8px}',
      '.bsi-pk-h b{font-size:14px}',
      '.bsi-pk-ok{display:inline-flex;align-items:center;gap:3px;font-size:10.5px;font-weight:700;padding:2px 7px 2px 5px;border-radius:999px;background:rgb(var(--accent-rgb));color:#fff}',
      '.bsi-pk-d{font-size:12px;color:var(--text-3);line-height:1.35}',
      '.bsi-pk-s{display:grid;grid-template-columns:repeat(7,1fr);gap:4px 3px;margin-top:7px;color:var(--text-2)}',
      '.bsi-pk-s i{display:grid;place-items:center;height:22px;border-radius:6px;background:rgb(var(--text-rgb)/.05)}',
      '.bsi-pack.on .bsi-pk-s{color:var(--text)}',
      'html[data-bsi-trait="fin"] .bsi-pk-s .ic{stroke-width:1.5}',
      'html[data-bsi-trait="gras"] .bsi-pk-s .ic{stroke-width:2.6}',
      '.bsi-style{display:flex;gap:18px;flex-wrap:wrap;margin-top:14px;padding:12px 14px;border-radius:14px;border:1px solid var(--border);background:rgb(var(--text-rgb)/.025)}',
      '.bsi-st{display:flex;align-items:center;gap:10px}',
      '.bsi-st-l{font-size:13px;font-weight:650;color:var(--text-2)}',
      '.bsi-colors{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 14px;padding:10px 12px;border-radius:12px;border:1px solid var(--border);background:rgb(var(--text-rgb)/.025)}',
      '.bsi-colors .bsi-st-l{margin-right:2px}',
      '.bsi-sw{display:flex;gap:6px;flex-wrap:wrap;align-items:center}',
      '.bsi-dot{width:24px;height:24px;border-radius:50%;border:2px solid rgb(var(--text-rgb)/.18);background:var(--c);cursor:pointer;padding:0;transition:transform .12s,box-shadow .12s}',
      '.bsi-dot:hover{transform:scale(1.12)}',
      '.bsi-dot.on{box-shadow:0 0 0 2px var(--surface),0 0 0 4px rgb(var(--accent-rgb))}',
      '.bsi-dot:disabled{cursor:default;transform:none}',
      '.bsi-pick-c{position:relative;width:30px;height:30px;border-radius:9px;overflow:hidden;border:1px solid var(--border);background:conic-gradient(red,yellow,lime,cyan,blue,magenta,red);cursor:pointer;flex:none}',
      '.bsi-pick-c input{position:absolute;inset:-6px;width:calc(100% + 12px);height:calc(100% + 12px);opacity:0;cursor:pointer;border:0;padding:0}',
      '.bsi-auto{font-size:12.5px}',
      'html[data-bsi-trait="fin"] .bsi-cur .ic{stroke-width:1.5}',
      'html[data-bsi-trait="gras"] .bsi-cur .ic{stroke-width:2.6}',
    ].join('\n');
    document.head.appendChild(st);
  }

  // ---------------------------------------------------------------- Réglages › Icônes du menu
  function monterReglages(el) {
    if (!el || el.getAttribute('data-bsi')) return;
    el.setAttribute('data-bsi', '1');
    ensureCss();
    var ui = { sel: 'formations', q: '', cat: 'idees' };
    function current(id) { var n = NAV.filter(function (x) { return x.id === id; })[0]; return map[id] || (n && n.def); }
    function list() {
      if (ui.q.trim()) return search(ui.q);
      if (ui.cat === 'idees') return ideas(ui.sel);
      return groupList(ui.cat);
    }
    function gridHtml(ro) {
      var names = list(), cur = map[ui.sel] || '';
      if (!names.length) return '<div class="bsi-empty">Aucune icône pour « ' + esc(ui.q) + ' ». Essayez un autre mot : formation, argent, équipe, fusée…</div>';
      return names.map(function (n) {
        return '<button type="button" class="bsi-ic' + (n === cur ? ' on' : '') + '" data-ic="' + n + '" title="' + esc(n.replace(/-/g, ' ')) + '"' + (ro ? ' disabled' : '') + '>' + icon(n, 22) + '</button>';
      }).join('');
    }
    function countTxt() {
      var n = list().length;
      return n + ' icône' + (n > 1 ? 's' : '');
    }
    function render() {
      if (!el.isConnected) return;
      var ro = !canEdit(), selNav = NAV.filter(function (x) { return x.id === ui.sel; })[0];
      var total = Object.keys(LIB.d).length, mods = Object.keys(map).length;
      var where = SERVER ? 'Le choix est partagé avec toute l’équipe.' : 'Le choix est enregistré dans ce navigateur.';
      var left = '<nav class="bsi-nav" aria-label="Rubriques du menu">' + NAV.map(function (n) {
        if (n.group) return '<div class="bsi-gl">' + esc(n.group) + '</div>';
        return '<button type="button" class="bsi-row' + (n.id === ui.sel ? ' sel' : '') + '" data-navsel="' + n.id + '"' + (teinte(n.id) && n.id !== ui.sel ? ' style="--bsi-t:' + teinte(n.id) + '"' : '') + '><span class="bsi-cur">' + icon(current(n.id), 17) + '</span><span class="bsi-lab">' + esc(n.label) + '</span>' + (map[n.id] || style.teintes[n.id] ? '<span class="bsi-mod">modifiée</span>' : '') + '</button>';
      }).join('') + '</nav>';
      var chips = [['idees', 'Idées pour « ' + selNav.label + ' »']].concat([['toutes', 'Toutes', total]]).concat(LIB.g.map(function (g) { return [g[0], GROUPS[g[0]] || g[0], g[1].split(' ').length]; }));
      var right = '<div class="bsi-pick">' +
        '<div class="bsi-head"><span class="bsi-big"' + (teinte(ui.sel) ? ' style="color:' + teinte(ui.sel) + ';background:radial-gradient(120% 100% at 30% 15%,#2a3448,#0b111c)"' : '') + '>' + icon(current(ui.sel), 30) + '</span><div class="bsi-ht"><b>Icône de « ' + esc(selNav.label) + ' »</b><span>' + (map[ui.sel] ? 'Icône choisie : ' + esc(map[ui.sel].replace(/-/g, ' ')) : 'Icône d’origine') + '</span></div>' +
        (map[ui.sel] && !ro ? '<button type="button" class="btn btn-secondary btn-md" data-act="reset">Remettre l’icône d’origine</button>' : '') + '</div>' +
        colorRow(ro) +
        '<div class="bsi-tools"><div class="search"><svg class="ic" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner('search') + '</svg>' +
        '<input class="search-input" data-q placeholder="Rechercher : formation, argent, équipe, fusée…" value="' + esc(ui.q) + '" aria-label="Rechercher une icône"></div><span class="bsi-count" data-count>' + countTxt() + '</span></div>' +
        '<div class="bsi-chips"' + (ui.q.trim() ? ' style="opacity:.45"' : '') + '>' + chips.map(function (c) {
          return '<button type="button" class="bsi-chip' + (!ui.q.trim() && ui.cat === c[0] ? ' on' : '') + '" data-cat="' + c[0] + '">' + esc(c[1]) + (c[2] ? '<small>' + c[2] + '</small>' : '') + '</button>';
        }).join('') + '</div>' +
        '<div class="bsi-grid" data-grid>' + gridHtml(ro) + '</div>' +
        '<div class="bsi-foot"><span class="bsi-hint">' + (ro ? '' : 'Cliquez sur une icône : le menu change tout de suite.') + '</span>' +
        (mods && !ro ? '<button type="button" class="btn btn-ghost btn-md" data-act="resetall">Tout remettre d’origine (' + mods + ')</button>' : '') + '</div></div>';
      var lock = ro ? '<div class="bsi-lock">' + icon('lock', 15) + 'Seul un administrateur peut changer les icônes du menu de l’équipe.</div>' : '';
      var focusQ = document.activeElement && document.activeElement.hasAttribute && document.activeElement.hasAttribute('data-q') && el.contains(document.activeElement);
      el.innerHTML = '<section class="card"><header class="card-head"><div class="card-title-wrap"><span class="card-icon">' + icon('shapes', 16) + '</span><div><h3 class="card-title">Icônes du menu</h3>' +
        '<p class="card-sub">Donnez à chaque rubrique l’icône qui lui parle, parmi ' + total.toLocaleString('fr-FR') + ' icônes classées par thème. ' + where + '</p></div></div></header>' +
        lock + packsHtml(ro) + styleRow(ro) + '<div class="bsi-layout">' + left + right + '</div></section>';
      if (focusQ) { var qi = el.querySelector('[data-q]'); qi.focus(); qi.setSelectionRange(qi.value.length, qi.value.length); }
    }
    function seg(key, opts, ro) {
      return '<div role="tablist" class="segmented">' + opts.map(function (o) {
        var on = style[key] === o[0];
        return '<button type="button" role="tab" aria-selected="' + on + '" class="seg' + (on ? ' active' : '') + '" data-st="' + key + ':' + o[0] + '"' + (ro ? ' disabled' : '') + '><span>' + o[1] + '</span></button>';
      }).join('') + '</div>';
    }
    function packsHtml(ro) {
      return '<div class="bsi-packs" role="list" aria-label="Packs d’icônes">' + PACKS.map(function (pk) {
        var on = samePack(pk);
        var strip = ORDRE.map(function (id) {
          var n = pk.map[id] || NAV.filter(function (x) { return x.id === id; })[0].def;
          return '<i' + (teinte(id) ? ' style="color:' + teinte(id) + '"' : '') + '>' + icon(n, 15) + '</i>';
        }).join('');
        return '<button type="button" role="listitem" class="bsi-pack' + (on ? ' on' : '') + '" data-pack="' + pk.id + '"' + (ro ? ' disabled' : '') + ' aria-pressed="' + on + '">' +
          '<span class="bsi-pk-h"><b>' + esc(pk.nom) + '</b>' + (on ? '<span class="bsi-pk-ok">' + icon('check', 12) + 'Actif</span>' : '') + '</span>' +
          '<span class="bsi-pk-d">' + esc(pk.desc) + '</span><span class="bsi-pk-s">' + strip + '</span></button>';
      }).join('') + '</div>';
    }
    function swatches(cur, kind, ro) {
      return '<div class="bsi-sw">' + NUANCIER.map(function (c) {
        return '<button type="button" class="bsi-dot' + (cur === c ? ' on' : '') + '" style="--c:' + c + '" data-col="' + kind + ':' + c + '" title="' + c + '" aria-label="Couleur ' + c + '"' + (ro ? ' disabled' : '') + '></button>';
      }).join('') +
        '<label class="bsi-pick-c" title="Autre couleur…"><input type="color" value="' + (cur || '#60a5fa') + '" data-colin="' + kind + '" aria-label="Choisir une autre couleur"' + (ro ? ' disabled' : '') + '></label></div>';
    }
    function styleRow(ro) {
      var nT = Object.keys(style.teintes).length;
      return '<div class="bsi-style"><div class="bsi-st"><span class="bsi-st-l">Trait</span>' + seg('trait', [['fin', 'Fin'], ['normal', 'Normal'], ['gras', 'Gras']], ro) + '</div>' +
        '<div class="bsi-st"><span class="bsi-st-l">Couleur</span>' + seg('couleur', [['neutre', 'Neutre'], ['accent', 'Accent'], ['multi', 'Multicolore'], ['perso', 'Personnalisée']], ro) + '</div>' +
        (style.couleur === 'perso' ? '<div class="bsi-st"><span class="bsi-st-l">Teinte du menu</span>' + swatches(style.perso, 'perso', ro) + '</div>' : '') +
        (nT && !ro ? '<button type="button" class="btn btn-ghost btn-sm" data-act="resetcol">Effacer les couleurs par rubrique (' + nT + ')</button>' : '') + '</div>';
    }
    function colorRow(ro) {
      var own = style.teintes[ui.sel] || '';
      return '<div class="bsi-colors"><span class="bsi-st-l">Couleur de l’icône</span>' + swatches(own, 'sel', ro) +
        (own && !ro ? '<button type="button" class="btn btn-ghost btn-sm bsi-auto" data-act="autocol">Couleur automatique</button>' : '<span class="bsi-hint">' + (own ? '' : 'Automatique : suit le style du menu.') + '</span>') + '</div>';
    }
    // Choix d'une couleur : aperçu immédiat, enregistrement à la validation.
    function colorPatch(kind, c) {
      if (kind === 'perso') return { perso: c, couleur: 'perso' };
      var t = Object.assign({}, style.teintes); t[ui.sel] = c;
      return { teintes: t };
    }
    function renderGrid() {
      var g = el.querySelector('[data-grid]'), c = el.querySelector('[data-count]'), chips = el.querySelector('.bsi-chips');
      if (!g) return render();
      g.innerHTML = gridHtml(!canEdit()); g.scrollTop = 0;
      if (c) c.textContent = countTxt();
      if (chips) {
        chips.style.opacity = ui.q.trim() ? '.45' : '';
        Array.prototype.forEach.call(chips.children, function (b) { b.classList.toggle('on', !ui.q.trim() && b.getAttribute('data-cat') === ui.cat); });
      }
    }
    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-navsel],[data-cat],[data-ic],[data-act],[data-st],[data-pack],[data-col]'); if (!t || t.disabled) return;
      if (t.hasAttribute('data-col')) { if (!canEdit()) return; var kc = t.getAttribute('data-col').split(':'); saveStyle(colorPatch(kc[0], kc[1])); return; }
      if (t.hasAttribute('data-pack')) { if (!canEdit()) return; var pk = PACKS.filter(function (x) { return x.id === t.getAttribute('data-pack'); })[0]; if (pk) save(Object.assign({}, pk.map)); return; }
      if (t.hasAttribute('data-st')) { if (!canEdit()) return; var kv = t.getAttribute('data-st').split(':'), p = {}; p[kv[0]] = kv[1]; saveStyle(p); return; }
      if (t.hasAttribute('data-navsel')) { ui.sel = t.getAttribute('data-navsel'); if (ui.cat === 'idees' || !ui.q) ui.cat = 'idees'; render(); return; }
      if (t.hasAttribute('data-cat')) { ui.cat = t.getAttribute('data-cat'); ui.q = ''; var qi = el.querySelector('[data-q]'); if (qi) qi.value = ''; renderGrid(); return; }
      if (!canEdit()) return;
      if (t.hasAttribute('data-ic')) { var next = Object.assign({}, map); next[ui.sel] = t.getAttribute('data-ic'); save(next); return; }
      var act = t.getAttribute('data-act');
      if (act === 'autocol') { var t2 = Object.assign({}, style.teintes); delete t2[ui.sel]; saveStyle({ teintes: t2 }); return; }
      if (act === 'resetcol') { if (confirm('Effacer les couleurs choisies rubrique par rubrique ?')) saveStyle({ teintes: {} }); return; }
      if (act === 'reset') { var n2 = Object.assign({}, map); delete n2[ui.sel]; save(n2); }
      else if (act === 'resetall' && confirm('Remettre toutes les icônes du menu d’origine ?')) save({});
    });
    var tmr = null;
    el.addEventListener('input', function (e) {
      if (e.target.hasAttribute && e.target.hasAttribute('data-colin')) {
        // Aperçu en direct pendant qu'on glisse dans le nuancier (sans enregistrer à chaque pas).
        var p = colorPatch(e.target.getAttribute('data-colin'), e.target.value.toLowerCase());
        style = cleanStyle(Object.assign({}, style, p)); applyStyle();
        return;
      }
      if (!e.target.hasAttribute || !e.target.hasAttribute('data-q')) return;
      ui.q = e.target.value; clearTimeout(tmr); tmr = setTimeout(renderGrid, 120);
    });
    el.addEventListener('change', function (e) {
      if (!e.target.hasAttribute || !e.target.hasAttribute('data-colin') || !canEdit()) return;
      saveStyle(colorPatch(e.target.getAttribute('data-colin'), e.target.value.toLowerCase()));
    });
    var l = function () { if (!el.isConnected) { listeners.splice(listeners.indexOf(l), 1); return; } render(); };
    listeners.push(l);
    render();
  }

  window.bsIcones = { svg: svg, nav: nav, monterReglages: monterReglages, choix: function () { return Object.assign({}, map); }, choisir: function (id, nom) { var n = Object.assign({}, map); if (nom) n[id] = nom; else delete n[id]; return save(n); }, chercher: search };
  applyStyle();
  if (document.head) globalCss(); else document.addEventListener('DOMContentLoaded', globalCss);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hook); else hook();
})();

