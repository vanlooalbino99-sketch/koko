/* Blackstart CRM : Marketing › « Contenu » (calendrier des publications).
 *
 * Publications LinkedIn (d'abord), Facebook, Instagram et Google Business : date, réseau, statut (idée,
 * à rédiger, prêt, publié) et texte. Vue mois sur ordinateur, liste sur téléphone. Une banque de 25 idées
 * de publications pour une agence CRM et génération de leads. « Copier et ouvrir » copie le texte et ouvre
 * le réseau (LinkedIn ouvre la fenêtre de publication avec le texte déjà rempli).
 */
(function () {
  'use strict';
  if (window.bsContenu || !window.bsMarketing) return;
  var M = window.bsMarketing, esc = M.esc;

  var RESEAUX = {
    linkedin: { nom: 'LinkedIn', coul: '#0a66c2', max: 3000, url: function (t) { return 'https://www.linkedin.com/feed/?shareActive=true&text=' + encodeURIComponent(t); } },
    facebook: { nom: 'Facebook', coul: '#1877f2', max: 63206, url: function () { return 'https://www.facebook.com/'; } },
    instagram: { nom: 'Instagram', coul: '#e1306c', max: 2200, url: function () { return 'https://www.instagram.com/'; } },
    google: { nom: 'Google Business', coul: '#34a853', max: 1500, url: function () { return 'https://business.google.com/locations'; } }
  };
  var STATUTS = { idee: ['Idée', 'tone-slate'], a_rediger: ['À rédiger', 'tone-amber'], pret: ['Prêt', 'tone-sky'], publie: ['Publié', 'tone-emerald'] };
  var IDEES = [
    ['i01', 'Conseil', 'Les 3 signes que vous perdez des clients sans le savoir', 'Appels manqués, devis jamais relancés, demandes notées sur un carnet : un exemple concret pour chaque signe.'],
    ['i02', 'Cas client', 'Avant / après : d’Excel à un CRM simple', 'Raconter un client (sans le nommer si besoin) : la situation, ce qui a changé, un chiffre.'],
    ['i03', 'Chiffres', 'Combien vous coûte un client perdu ?', 'Le calcul en 30 secondes : panier moyen × clients perdus par mois × 12.'],
    ['i04', 'Coulisses', 'Ma routine de prospection du lundi matin', 'Les 3 blocs de la matinée, l’outil utilisé, le nombre d’appels.'],
    ['i05', 'Conseil', 'Le message de relance qui obtient le plus de réponses', 'Partager le message exact, et pourquoi il marche (court, une seule question).'],
    ['i06', 'Opinion', 'Un artisan n’a pas besoin d’un logiciel compliqué', 'Prendre position : simple et utilisé tous les jours vaut mieux que complet et abandonné.'],
    ['i07', 'Sondage', 'Comment suivez-vous vos devis aujourd’hui ?', 'Sondage LinkedIn : carnet, Excel, logiciel, rien. Répondre à chaque commentaire.'],
    ['i08', 'Liste', 'Les 5 erreurs de relance les plus courantes', 'Relancer trop tard, sans valeur, sans date proposée, par le mauvais canal, jamais.'],
    ['i09', 'Secteur', 'Ce qu’un CRM change pour une agence immobilière', 'Mandats, visites, relances acquéreurs : 3 situations du quotidien.'],
    ['i10', 'Preuve', 'Le témoignage d’un client en 3 phrases', 'Une citation, une photo ou le logo (avec accord), le résultat obtenu.'],
    ['i11', 'Chiffres', 'Combien de leads par mois pour un artisan ?', 'Vos chiffres réels (ou une fourchette honnête) et ce qui les fait varier.'],
    ['i12', 'Personnel', 'Pourquoi j’ai lancé mon agence', 'Votre parcours en relation client et en vente, le déclic, la mission.'],
    ['i13', 'Ressource', 'La checklist pour ne plus oublier un rappel client', 'Une liste de 7 points à copier ; proposer de l’envoyer en commentaire.'],
    ['i14', 'Opinion', 'Le bouche-à-oreille ne suffit plus', 'Pourquoi compter seulement sur lui rend une entreprise fragile.'],
    ['i15', 'Démonstration', 'Une journée type avec un CRM bien rangé', 'Une capture d’écran commentée : les rappels du jour, le pipeline, les devis.'],
    ['i16', 'Conseil', '3 questions à poser avant d’acheter un logiciel', 'Qui va l’utiliser ? Combien de temps pour démarrer ? Que se passe-t-il si j’arrête ?'],
    ['i17', 'Leçons', 'Ce que m’ont appris 100 appels de prospection', '3 leçons concrètes, une anecdote, une phrase qui marche.'],
    ['i18', 'Chiffres', 'Le délai idéal pour répondre à une demande de devis', 'Répondre dans l’heure multiplie les chances : expliquer et donner une astuce.'],
    ['i19', 'Actualité', 'Bienvenue à notre nouveau client', 'Annoncer un nouveau client (avec son accord) et ce que vous allez faire ensemble.'],
    ['i20', 'Vidéo', 'Tuto : relancer un devis en 2 clics', 'Une vidéo d’écran de 30 secondes, sous-titrée.'],
    ['i21', 'Débat', '« Je n’ai pas le temps de prospecter »', 'Mythe ou réalité ? Ouvrir le débat et donner votre méthode en 20 minutes par jour.'],
    ['i22', 'Ressource', 'Les outils gratuits que j’utilise chaque semaine', '4 ou 5 outils, à quoi ils servent, un lien vers chacun en commentaire.'],
    ['i23', 'Méthode', 'Comment trouver des clients sans payer de publicité', 'Votre méthode : fichier ciblé, appel, mail, relance, recommandation.'],
    ['i24', 'Offre', 'Ce mois-ci : un audit gratuit de 20 minutes', 'Présenter l’audit, à qui il s’adresse, comment réserver. Pas plus d’une fois par mois.'],
    ['i25', 'Transparence', 'Le bilan du mois : ce qui a marché, ce qui n’a pas marché', 'Des chiffres simples et une leçon ; les abonnés aiment l’honnêteté.']
  ];
  var JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  var d0 = new Date();
  var S = { mois: d0.getFullYear() + '-' + ('0' + (d0.getMonth() + 1)).slice(-2), reseau: 'tous', edition: null, brouillon: null, idees: false, msg: null, ia: null, redaction: false };

  function posts() { return M.actifs(M.data().posts); }
  function post(id) { return M.data().posts.filter(function (p) { return p.id === id; })[0] || null; }
  function filtrer(l) { return S.reseau === 'tous' ? l : l.filter(function (p) { return p.reseau === S.reseau; }); }
  function moisDecale(m, n) { var d = new Date(m + '-01T12:00:00'); d.setMonth(d.getMonth() + n); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2); }
  function prochainCreneau() {
    // Prochain mardi ou jeudi libre (les meilleurs jours pour LinkedIn), à partir de demain.
    var pris = {}; posts().forEach(function (p) { pris[p.date] = 1; });
    for (var i = 1; i < 120; i++) {
      var j = M.plusJours(M.auj(), i), w = new Date(j + 'T12:00:00').getDay();
      if ((w === 2 || w === 4) && !pris[j]) return j;
    }
    return M.plusJours(M.auj(), 1);
  }
  function puce(p) {
    var r = RESEAUX[p.reseau] || RESEAUX.linkedin, s = STATUTS[p.statut] || STATUTS.idee;
    return '<button type="button" class="bsct-puce' + (p.statut === 'publie' ? ' fait' : '') + '" data-post="' + esc(p.id) + '" title="' + esc(r.nom + ' · ' + s[0] + ' · ' + (p.titre || '')) + '"><i style="background:' + r.coul + '"></i><span>' + esc(p.titre || p.texte || 'Sans titre') + '</span></button>';
  }
  function calendrier(l) {
    var premier = new Date(S.mois + '-01T12:00:00'), decal = (premier.getDay() + 6) % 7, debut = M.plusJours(S.mois + '-01', -decal);
    var parJour = {}; l.forEach(function (p) { (parJour[p.date] = parJour[p.date] || []).push(p); });
    var h = '<div class="bsct-cal">' + JOURS.map(function (j) { return '<div class="bsct-jh">' + j + '</div>'; }).join('');
    for (var i = 0; i < 42; i++) {
      var j = M.plusJours(debut, i);
      if (i >= 35 && j.slice(0, 7) !== S.mois) break;
      var dans = j.slice(0, 7) === S.mois;
      h += '<div class="bsct-j' + (dans ? '' : ' hors') + (j === M.auj() ? ' auj' : '') + '" data-jour="' + j + '"><span class="bsct-n">' + Number(j.slice(8)) + '</span>' + (parJour[j] || []).map(puce).join('') + '</div>';
    }
    return h + '</div>';
  }
  function liste(l) {
    var mois = l.filter(function (p) { return p.date && p.date.slice(0, 7) === S.mois; }).sort(function (a, b) { return a.date.localeCompare(b.date); });
    if (!mois.length) return '<div class="bsct-liste"><p class="bsmk-vide">Aucune publication ce mois-ci.</p></div>';
    return '<div class="bsct-liste">' + mois.map(function (p) {
      var r = RESEAUX[p.reseau] || RESEAUX.linkedin, s = STATUTS[p.statut] || STATUTS.idee;
      return '<button type="button" class="bsmk-row bsct-ligne" data-post="' + esc(p.id) + '"><span class="bsct-date">' + esc(M.dateFr(p.date, { weekday: 'short', day: 'numeric' })) + '</span><span class="bsmk-t"><b>' + esc(p.titre || 'Sans titre') + '</b><small>' + esc(r.nom) + '</small></span><span class="badge ' + s[1] + '">' + s[0] + '</span></button>';
    }).join('') + '</div>';
  }
  function editeur(b) {
    var r = RESEAUX[b.reseau] || RESEAUX.linkedin, n = String(b.texte || '').length;
    return '<section class="card bsmk-card"><header class="card-head"><div><h3 class="card-title">' + (post(b.id) ? 'Modifier la publication' : 'Nouvelle publication') + '</h3></div></header>' +
      '<div class="bsmk-grid"><label>Date<input class="input" type="date" data-b="date" value="' + esc(b.date) + '"></label>' +
      '<label>Réseau<select class="input select" data-b="reseau">' + Object.keys(RESEAUX).map(function (k) { return '<option value="' + k + '"' + (b.reseau === k ? ' selected' : '') + '>' + RESEAUX[k].nom + '</option>'; }).join('') + '</select></label>' +
      '<label>Statut<select class="input select" data-b="statut">' + Object.keys(STATUTS).map(function (k) { return '<option value="' + k + '"' + (b.statut === k ? ' selected' : '') + '>' + STATUTS[k][0] + '</option>'; }).join('') + '</select></label></div>' +
      '<label class="bsmk-l" style="margin-top:10px">Sujet<input class="input" data-b="titre" value="' + esc(b.titre) + '"></label>' +
      '<label class="bsmk-l" style="margin-top:10px">Texte<textarea class="input bsmk-area" data-b="texte" rows="11">' + esc(b.texte) + '</textarea></label>' +
      '<small class="bsmk-vide" data-compteur>' + n + ' / ' + r.max + ' caractères' + (n > r.max ? ' : trop long pour ' + r.nom : '') + '</small>' +
      '<div class="bsmk-act" style="margin-top:12px"><button type="button" class="btn btn-primary" data-act="enregistrer">Enregistrer</button>' +
      (S.ia && S.ia.ia ? '<button type="button" class="btn btn-secondary" data-act="ia"' + (S.redaction ? ' disabled' : '') + '>' + (S.redaction ? 'Claude écrit…' : 'Rédiger avec Claude') + '</button>' : '') +
      '<button type="button" class="btn btn-secondary" data-act="publier">Copier et ouvrir ' + esc(r.nom) + '</button>' +
      (b.statut !== 'publie' ? '<button type="button" class="btn btn-ghost" data-act="publie">Marquer publié</button>' : '') +
      '<button type="button" class="btn btn-ghost" data-act="annuler">Fermer</button>' + (post(b.id) ? '<button type="button" class="btn btn-ghost" data-act="supprimer">Supprimer</button>' : '') + '</div></section>';
  }
  function banque() {
    var utilisees = {}; posts().forEach(function (p) { if (p.idee) utilisees[p.idee] = p.date; });
    return '<section class="card bsmk-card"><header class="card-head"><div><h3 class="card-title">Banque d’idées (' + IDEES.length + ')</h3><p class="card-sub">Des sujets qui marchent pour une agence CRM et génération de leads. « Planifier » les place sur le prochain mardi ou jeudi libre.</p></div>' +
      '<div class="card-actions"><button type="button" class="btn btn-ghost btn-sm" data-act="idees">Fermer</button></div></header><div>' +
      IDEES.map(function (i) {
        return '<div class="bsmk-row"><div class="bsmk-t"><b>' + esc(i[2]) + '</b><small>' + esc(i[1] + ' · ' + i[3]) + '</small></div>' +
          (utilisees[i[0]] ? '<span class="badge tone-emerald">Prévu le ' + esc(M.dateFr(utilisees[i[0]])) + '</span>' : '<button type="button" class="btn btn-secondary btn-sm" data-idee="' + i[0] + '">Planifier</button>') + '</div>';
      }).join('') + '</div></section>';
  }
  var CSS = '.bsct-cal{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}.bsct-jh{font-size:12px;font-weight:700;color:var(--text-3);text-align:center;padding:2px 0}' +
    '.bsct-j{min-height:96px;border:1px solid var(--border);border-radius:10px;padding:6px;display:flex;flex-direction:column;gap:4px;cursor:pointer;background:var(--surface);min-width:0}' +
    '.bsct-j:hover{border-color:var(--accent)}.bsct-j.hors{opacity:.45}.bsct-j.auj{box-shadow:0 0 0 2px var(--accent) inset}.bsct-n{font-size:12px;font-weight:700;color:var(--text-2)}' +
    '.bsct-puce{display:flex;align-items:center;gap:5px;border:0;border-radius:7px;background:var(--surface-2);color:var(--text);font:inherit;font-size:12px;padding:3px 6px;cursor:pointer;text-align:left;min-width:0;width:100%}' +
    '.bsct-puce i{width:7px;height:7px;border-radius:50%;flex:none}.bsct-puce span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bsct-puce.fait{opacity:.6;text-decoration:line-through}' +
    '.bsct-liste{display:none}.bsct-ligne{width:100%;background:none;border:0;border-bottom:1px solid var(--border);color:var(--text);font:inherit;text-align:left;cursor:pointer}' +
    '.bsct-date{font-size:12.5px;font-weight:700;color:var(--text-2);width:64px;flex:none;text-transform:capitalize}' +
    '.bsct-nav{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:space-between}.bsct-nav h3{margin:0;font-size:16px;text-transform:capitalize;min-width:150px;text-align:center}' +
    '@media (max-width:760px){.bsct-cal{display:none}.bsct-liste{display:block}}';
  function rendre(el) {
    if (!document.getElementById('bsct-css')) { var s = document.createElement('style'); s.id = 'bsct-css'; s.textContent = CSS; document.head.appendChild(s); }
    var tous = posts(), l = filtrer(tous);
    var duMois = tous.filter(function (p) { return p.date && p.date.slice(0, 7) === S.mois; });
    var il4 = M.plusJours(M.auj(), -28);
    var publies4 = tous.filter(function (p) { return p.statut === 'publie' && p.date >= il4 && p.date <= M.auj(); }).length;
    var h = M.tete('Contenu', 'Planifiez vos publications : LinkedIn d’abord, puis Facebook, Instagram et Google Business.',
      '<button type="button" class="btn btn-secondary" data-act="idees">Banque d’idées</button><button type="button" class="btn btn-primary" data-act="nouveau">Nouvelle publication</button>') + M.message(S.msg);
    if (S.edition) h += editeur(S.brouillon);
    if (S.idees) h += banque();
    h += '<div class="bsmk-kpis">' + [['Prévues ce mois', duMois.length], ['Prêtes', duMois.filter(function (p) { return p.statut === 'pret'; }).length], ['Publiées ce mois', duMois.filter(function (p) { return p.statut === 'publie'; }).length],
      ['Rythme (4 sem.)', (publies4 / 4).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' / sem.']].map(function (k) { return M.kpi(k[0], k[1]); }).join('') + '</div>';
    h += '<section class="card bsmk-card"><header class="card-head"><div class="bsct-nav" style="width:100%"><div class="bsmk-act"><button type="button" class="btn btn-ghost btn-sm" data-mois="-1" aria-label="Mois précédent">‹</button><h3>' +
      esc(new Date(S.mois + '-01T12:00:00').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })) + '</h3><button type="button" class="btn btn-ghost btn-sm" data-mois="1" aria-label="Mois suivant">›</button>' +
      '<button type="button" class="btn btn-ghost btn-sm" data-mois="0">Aujourd’hui</button></div><div class="bsmk-tabs">' + [['tous', 'Tous']].concat(Object.keys(RESEAUX).map(function (k) { return [k, RESEAUX[k].nom]; })).map(function (t) {
      return '<button type="button" class="bsmk-tab' + (S.reseau === t[0] ? ' on' : '') + '" data-reseau="' + t[0] + '">' + esc(t[1]) + '</button>';
    }).join('') + '</div></div></header>' + calendrier(l) + liste(l) +
      '<p class="bsmk-vide" style="margin-top:10px">Conseil : 2 à 3 publications LinkedIn par semaine, le mardi et le jeudi matin, et une réponse à chaque commentaire dans l’heure.</p></section>';
    el.innerHTML = h;
  }
  function ouvrir(p) { S.edition = p.id; S.brouillon = JSON.parse(JSON.stringify(p)); S.msg = null; }
  function sauver() {
    var b = S.brouillon;
    var champs = { date: b.date || M.auj(), reseau: b.reseau, statut: b.statut, titre: String(b.titre || '').trim(), texte: String(b.texte || ''), idee: b.idee || '', publieLe: b.statut === 'publie' ? (b.publieLe || new Date().toISOString()) : '' };
    if (post(b.id)) M.majElement('posts', b.id, champs);
    else M.majListe('posts', function (l) { return [Object.assign({ id: b.id, creeLe: new Date().toISOString(), creePar: (M.user && M.user.name) || '' }, champs)].concat(l); });
  }
  function brancher(el, dessiner) {
    el.addEventListener('input', function (ev) {
      var k = ev.target.getAttribute('data-b');
      if (!k || !S.brouillon) return;
      S.brouillon[k] = ev.target.value;
      if (k === 'texte') {
        var r = RESEAUX[S.brouillon.reseau] || RESEAUX.linkedin, n = ev.target.value.length, c = el.querySelector('[data-compteur]');
        if (c) c.textContent = n + ' / ' + r.max + ' caractères' + (n > r.max ? ' : trop long pour ' + r.nom : '');
      }
    });
    el.addEventListener('change', function (ev) { var k = ev.target.getAttribute('data-b'); if (k && S.brouillon) { S.brouillon[k] = ev.target.value; if (k !== 'texte' && k !== 'titre') dessiner(true); } });
    el.addEventListener('click', function (ev) {
      var t = ev.target.closest('button,[data-jour]'); if (!t || !el.contains(t)) return;
      var a = t.getAttribute('data-act');
      if (t.hasAttribute('data-post')) { var p0 = post(t.getAttribute('data-post')); if (p0) { ouvrir(p0); dessiner(true); window.scrollTo(0, 0); } return; }
      if (t.hasAttribute('data-jour')) { S.edition = 'nouveau'; S.brouillon = { id: 'post-' + M.uid(), date: t.getAttribute('data-jour'), reseau: S.reseau !== 'tous' ? S.reseau : 'linkedin', statut: 'a_rediger', titre: '', texte: '' }; S.msg = null; dessiner(true); window.scrollTo(0, 0); return; }
      if (t.hasAttribute('data-mois')) { var n = +t.getAttribute('data-mois'); S.mois = n ? moisDecale(S.mois, n) : M.auj().slice(0, 7); dessiner(true); return; }
      if (t.hasAttribute('data-reseau')) { S.reseau = t.getAttribute('data-reseau'); dessiner(true); return; }
      if (t.hasAttribute('data-idee')) {
        var i = IDEES.filter(function (x) { return x[0] === t.getAttribute('data-idee'); })[0], j = prochainCreneau();
        M.majListe('posts', function (l) { return [{ id: 'post-' + M.uid(), date: j, reseau: 'linkedin', statut: 'a_rediger', titre: i[2], texte: '', idee: i[0], note: i[3], creeLe: new Date().toISOString() }].concat(l); });
        S.msg = { k: 'ok', t: '« ' + i[2] + ' » est prévu le ' + M.dateFr(j, { weekday: 'long', day: 'numeric', month: 'long' }) + '.' };
        S.mois = j.slice(0, 7); dessiner(true); return;
      }
      if (a === 'nouveau') { S.edition = 'nouveau'; S.brouillon = { id: 'post-' + M.uid(), date: prochainCreneau(), reseau: 'linkedin', statut: 'a_rediger', titre: '', texte: '' }; S.msg = null; dessiner(true); return; }
      if (a === 'idees') { S.idees = !S.idees; dessiner(true); return; }
      if (a === 'annuler') { S.edition = null; S.brouillon = null; dessiner(true); return; }
      if (a === 'enregistrer') { sauver(); S.edition = null; S.brouillon = null; S.msg = { k: 'ok', t: 'Publication enregistrée.' }; dessiner(true); return; }
      if (a === 'publie') { S.brouillon.statut = 'publie'; sauver(); S.edition = null; S.brouillon = null; S.msg = { k: 'ok', t: 'Bravo, publication marquée comme publiée.' }; dessiner(true); return; }
      if (a === 'supprimer') { if (!window.confirm('Supprimer cette publication ?')) return; M.majElement('posts', S.brouillon.id, { supprime: true }); S.edition = null; S.brouillon = null; dessiner(true); return; }
      if (a === 'publier') {
        var b = S.brouillon, r = RESEAUX[b.reseau] || RESEAUX.linkedin;
        if (b.statut === 'idee' || b.statut === 'a_rediger') b.statut = 'pret';
        sauver();
        M.copier(b.texte || '').then(function (ok) {
          window.open(r.url(b.texte || ''), '_blank', 'noopener');
          S.msg = { k: 'ok', t: (ok ? 'Texte copié. ' : '') + r.nom + ' s’ouvre dans un nouvel onglet' + (b.reseau === 'linkedin' ? ' avec le texte déjà rempli' : ' : collez le texte (Ctrl + V)') + '. Revenez cliquer sur « Marquer publié » une fois en ligne.' };
          dessiner(true);
        });
        return;
      }
      if (a === 'ia') {
        var br = S.brouillon; S.redaction = true; dessiner(true);
        var rr = RESEAUX[br.reseau] || RESEAUX.linkedin, idee = IDEES.filter(function (x) { return x[0] === br.idee; })[0];
        var consigne = M.contexteAgence() + '\nÉcris une publication ' + rr.nom + ' sur le sujet : « ' + (br.titre || 'la prospection et le suivi client') + ' ».' + (idee ? '\nAngle : ' + idee[3] : '') +
          (br.texte && br.texte.trim().length > 30 ? '\nAméliore ce brouillon :\n' + br.texte : '') +
          '\nPremière ligne accrocheuse, phrases courtes, aérée, une question à la fin pour faire réagir, 3 hashtags au plus. ' + Math.min(rr.max, 1300) + ' caractères au plus. Pas d’émojis en excès.';
        M.rediger('post', consigne).then(function (txt) { br.texte = txt.trim(); if (br.statut === 'idee' || br.statut === 'a_rediger') br.statut = 'pret'; S.redaction = false; dessiner(true); },
          function (e) { S.redaction = false; S.msg = { k: 'err', t: e.message }; dessiner(true); });
      }
    });
  }

  var P = M.page(rendre, brancher);
  function monter(el) { M.iaEtat(function (e) { S.ia = e; P.dessiner(); }); P.monter(el); }
  window.bsContenu = { monter: monter, IDEES: IDEES };
})();
