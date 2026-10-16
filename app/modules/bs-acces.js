/* Blackstart CRM : rubriques ouvertes à chaque membre (version équipe).
 *
 * L'administrateur coche, dans Réglages › Équipe & compte, les rubriques qu'un membre peut ouvrir.
 * Les autres disparaissent de son menu (ordinateur et téléphone), de la recherche et des raccourcis ; s'il
 * y arrive par un lien, il revient sur sa première rubrique ouverte. Le serveur refuse aussi la messagerie,
 * les groupes, la visio, les formations et le générateur de leads.
 * Les changements s'appliquent tout de suite (événement temps réel 'acces', sinon vérification chaque minute).
 * Version autonome (sans serveur) : tout reste ouvert.
 */
(function () {
  'use strict';
  if (window.bsAcces) return;

  var CONF = window.BS_SERVER && typeof window.BS_SERVER === 'object' ? window.BS_SERVER : null;
  var USER = CONF && CONF.user ? CONF.user : null;

  // Même liste que server/src/acces.js (ACCES), dans le même ordre.
  var RUBRIQUES = [
    { groupe: 'Prospection', items: [
      { id: 'today', label: 'Aujourd’hui' }, { id: 'agenda', label: 'Agenda' }, { id: 'prospects', label: 'Prospects' },
      { id: 'leads', label: 'Nouveaux leads', serveur: true }, { id: 'pipeline', label: 'Pipeline' }, { id: 'tasks', label: 'Tâches' }] },
    { groupe: 'Ventes', items: [
      { id: 'telephone', label: 'Téléphone (Ringover)' }, { id: 'mail', label: 'Mail', serveur: true }, { id: 'devis', label: 'Devis & factures' }, { id: 'clients', label: 'Clients' }, { id: 'payments', label: 'Paiements' }] },
    { groupe: 'Équipe', items: [
      { id: 'messages', label: 'Messages', serveur: true }, { id: 'groupes', label: 'Groupes', serveur: true }, { id: 'visio', label: 'Visio', serveur: true }, { id: 'entrainement', label: 'Entraînement (Pitchbase)' }] },
    { groupe: 'Analyse', items: [
      { id: 'dashboard', label: 'Tableau de bord' }, { id: 'reports', label: 'Rapports' }, { id: 'carte', label: 'Carte clients' }] },
    { groupe: 'Autres', items: [
      { id: 'formations', label: 'Formations', serveur: true }, { id: 'tools', label: 'Outils' }] },
    { groupe: 'Réglages', items: [
      { id: 'settings.company', label: 'Entreprise' }, { id: 'settings.goals', label: 'Objectifs' },
      { id: 'settings.data', label: 'Données (sauvegarde, restauration)' }] }
  ];
  var CLES = [];
  RUBRIQUES.forEach(function (g) { g.items.forEach(function (r) { CLES.push(r.id); }); });
  // Ordre des pages du menu : la première ouverte sert d'accueil.
  var PAGES = ['today', 'agenda', 'prospects', 'leads', 'pipeline', 'tasks', 'messages', 'groupes', 'visio', 'entrainement', 'telephone', 'mail', 'devis',
    'clients', 'payments', 'dashboard', 'reports', 'carte', 'formations', 'tools', 'settings'];

  function effectif(role, acces) { return role !== 'admin' && Array.isArray(acces) ? acces.slice() : null; }
  var acces = USER ? effectif(USER.role, USER.acces) : null;
  var rev = 0;
  var abonnes = [];

  function peut(k) { return !acces || CLES.indexOf(k) < 0 || acces.indexOf(k) >= 0; }
  function accueil() {
    for (var i = 0; i < PAGES.length; i++) if (peut(PAGES[i])) return PAGES[i];
    return 'settings';
  }
  function pageCourante() { var m = /^#\/([\w-]+)/.exec(location.hash || ''); return m ? m[1] : 'today'; }
  function corrigerAdresse() {
    var p = pageCourante();
    if (PAGES.indexOf(p) >= 0 && !peut(p)) history.replaceState(null, '', '#/' + accueil());
  }

  function memes(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  function appliquer(role, liste) {
    var avant = acces;
    var roleAvant = USER && USER.role;
    if (USER) { USER.role = role || USER.role; USER.acces = liste === undefined ? null : liste; }
    acces = effectif(USER ? USER.role : role, liste);
    if (memes(avant, acces) && roleAvant === (USER && USER.role)) return;
    rev++;
    var Y = window.__bsY;
    var cur = Y && Y.get ? Y.get().page : pageCourante();
    var cible = peut(cur) ? cur : accueil();
    if (Y && Y.set) Y.set({ bsAcces: rev, page: cible });
    if (cible !== cur) history.replaceState(null, '', '#/' + cible);
    abonnes.slice().forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
    try { window.dispatchEvent(new CustomEvent('bs:acces-change', { detail: { role: USER && USER.role, acces: acces } })); } catch (e) { /* vieux navigateur */ }
  }

  function rafraichir() {
    if (!USER || !window.fetch) return;
    fetch('/api/auth/me', { credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.user) appliquer(j.user.role, j.user.acces); })
      .catch(function () { /* hors connexion : on réessaiera */ });
  }

  if (USER) {
    corrigerAdresse();
    window.addEventListener('hashchange', corrigerAdresse);
    window.addEventListener('bs:acces', function (e) { var d = e.detail || {}; appliquer(d.role, d.acces); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) rafraichir(); });
    setInterval(function () { if (!document.hidden) rafraichir(); }, 60000);
  }

  window.bsAcces = {
    peut: peut,
    accueil: accueil,
    rubriques: RUBRIQUES,
    cles: CLES,
    liste: function () { return acces ? acces.slice() : null; },
    complet: function () { return !acces; },
    ecouter: function (fn) { abonnes.push(fn); return function () { abonnes = abonnes.filter(function (f) { return f !== fn; }); }; },
    rafraichir: rafraichir,
    appliquer: appliquer
  };
})();
