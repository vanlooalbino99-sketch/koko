/* Blackstart CRM : leads LinkedIn (rubrique « Nouveaux leads », onglet LinkedIn).
 *
 * Le CRM ne parcourt pas LinkedIn tout seul : un robot connecté au compte de l'utilisateur se fait repérer et bloquer
 * par LinkedIn, et la CNIL sanctionne l'aspiration massive de profils. Ici, c'est l'utilisateur qui navigue :
 * - « Chercher » ouvre une recherche de décideurs toute prête (LinkedIn, Sales Navigator ou Google) ;
 * - le bouton « Envoyer au CRM » (un favori à glisser dans la barre du navigateur) lit la page LinkedIn ouverte :
 *   résultats de recherche, profil, page Personnes d'une entreprise, Sales Navigator, relations, ou recherche Google
 *   de profils. Il ouvre le CRM avec ces personnes dans l'adresse (après le #, rien ne passe par un serveur) ;
 * - sans le bouton : copier-coller de la page, ou import du fichier officiel de LinkedIn (Connections.csv ou le .zip) ;
 * - chaque lead est noté (décideur ? secteur ? zone ?) et son entreprise vérifiée dans la base Sirene ;
 *   avec Claude (version équipe), une note plus fine et une invitation LinkedIn personnalisée, sans envoyer les noms.
 * Les leads à trier restent dans ce navigateur (localStorage) jusqu'à leur ajout au CRM.
 */
(function () {
  'use strict';
  if (window.bsLinkedin) return;

  var CLE_LEADS = 'bs-linkedin-leads', CLE_CIBLE = 'bs-linkedin-cible', CLE_LOT = 'bs-linkedin-lot', CLE_ONGLET = 'bs-leads-onglet', CLE_JOUR = 'bs-linkedin-jour';
  var MAX = 5000, PAR_PAGE = 60, CANAL = 'LinkedIn';
  var API = 'https://recherche-entreprises.api.gouv.fr', GEO = 'https://geo.api.gouv.fr';

  // ================================================================== lecture d'une page LinkedIn
  // Exécutée telle quelle dans la page LinkedIn par le bouton « Envoyer au CRM » (sa source est recopiée dans le favori),
  // et dans le CRM sur une page collée : elle ne dépend de rien d'autre et ne s'appuie pas sur les classes CSS de
  // LinkedIn (elles changent souvent), mais sur les liens de profil, les titres, les attributs stables et le texte.
  function extraire(doc, adresse) {
    var MAXL = 200;
    var loc; try { loc = new URL(adresse || 'about:blank'); } catch (e) { loc = null; }
    var hote = loc ? loc.hostname : '', chemin = loc ? loc.pathname : '';
    var BLOC = /^(ADDRESS|ARTICLE|ASIDE|BLOCKQUOTE|BR|DD|DIV|DL|DT|FIELDSET|FIGCAPTION|FIGURE|FOOTER|FORM|H[1-6]|HEADER|HR|LI|MAIN|NAV|OL|P|SECTION|TABLE|TBODY|TD|TH|TR|UL)$/i;
    var SAUTE = /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|CODE|SVG|IMG|PICTURE|VIDEO|BUTTON|SELECT|OPTION|TEXTAREA|INPUT|IFRAME|DIALOG)$/i;
    var CACHE = /(^|\s)(visually-hidden|a11y-text|sr-only|artdeco-visually-hidden|hidden)(\s|$)/;
    var BRUIT = new RegExp('^(?:' + [
      'se connecter', 'connecter', 'connect', 'message', 'envoyer un message', 'suivre', 'follow', 'following', 'abonné\\(e\\)', 'en attente', 'pending',
      'enregistrer', 'save', 'voir plus', 'see more', 'plus', 'more', '…\\s*plus', '\\.\\.\\.\\s*plus', '…\\s*more', 'afficher plus.*', 'show more.*', 'retirer', 'remove',
      'ignorer', 'ignore', 'accepter', 'accept', 'statut\\s*:.*', 'status\\s*:.*', 'status is .*', 'premium', 'vérifié', 'verified', 'ouvert aux opportunités', 'open to work',
      '#?open ?to ?work', 'recrute', 'hiring', 'relation de \\d.*', '\\d+(?:er|e|ème|st|nd|rd|th)? (?:niveau|degree).*', '[•·]', '[•·]?\\s*(?:1er|1re|2e|3e(?: et \\+)?|3e\\+|1st|2nd|3rd\\+?)',
      'hors réseau', 'out of network', '.*relations? en commun.*', '.*relations? que vous avez en commun.*', '.*mutual connections?.*', '.*autres? relations?.*', '[\\d\\s.,k+]+\\s*(?:relations?|abonnés|followers|connections?)',
      'voir le profil.*', 'view .*profile.*', 'membre linkedin', 'linkedin member', 'coordonnées', 'contact info', 'ajouter une section', 'ajouter', 'add',
      'plus d’actions', 'plus d\'actions', 'more actions', 'envoyer inmail', 'inmail', 'enregistré', 'saved', 'lead enregistré', 'ajouter à la liste', 'save to list',
      'sélectionner', 'select', 'tout sélectionner', 'select all', 'nouveau', 'new', 'en ligne', 'online', 'actif', 'active', 'actif il y a .*', 'active \\d+.* ago',
      'mentionné dans l.*actualité.*', 'mentioned in the news.*', 'changé de poste.*', 'changed jobs.*', 'a publié .* récemment', 'posted .* recently', 'relation établie.*', 'connected on .*',
      'vous suit', 'follows you', 'ancien(?:ne)? étudiant(?:e)? .*', 'alumni', '\\d+\\s*(?:an|ans|mois|yr|yrs|mo|mos)(?: \\d+ mois)? (?:dans|in) .*', 'messages?', 'il y a .*', '.* ago',
    ].join('|') + ')$', 'i');
    var out = [], vus = {};
    function propre(s) { return String(s || '').replace(/[​-‏‪-‮⁠﻿]/g, '').replace(/\s+/g, ' ').trim(); }
    // Page affichée : on suit le CSS (bloc ou en ligne, caché). Page collée (pas de CSS) : balises et noms de classes.
    var vue = doc.defaultView && doc.defaultView.getComputedStyle ? doc.defaultView : null;
    var CLASSE_BLOC = /(^|[\s_-])(title|subtitle|name|occupation|headline|caption|location|badge|degree|summary|insight)/i;
    function classe(el) { return typeof el.className === 'string' ? el.className : (el.getAttribute && el.getAttribute('class')) || ''; }
    function cache(el) {
      if (el.hidden || el.getAttribute('aria-hidden') === 'true' && el.childElementCount === 0 && !propre(el.textContent)) return true;
      if (CACHE.test(classe(el))) return true;
      if (vue) { var st = vue.getComputedStyle(el); if (st.display === 'none' || st.visibility === 'hidden') return true; }
      return false;
    }
    function estBloc(el) {
      if (el.tagName === 'SPAN' && CLASSE_BLOC.test(classe(el))) return true;
      if (vue) { var d = vue.getComputedStyle(el).display; return !!d && d.indexOf('inline') !== 0 && d !== 'contents'; }
      return BLOC.test(el.tagName);
    }
    function lignes(el) {
      var res = [], cur = '';
      (function marche(n) {
        if (n.nodeType === 3) { cur += n.nodeValue; return; }
        if (n.nodeType !== 1 || SAUTE.test(n.tagName) || cache(n)) return;
        var b = estBloc(n);
        if (b) { res.push(cur); cur = ''; }
        else if (cur && !/\s$/.test(cur)) cur += ' ';
        for (var c = n.firstChild; c; c = c.nextSibling) marche(c);
        if (b) { res.push(cur); cur = ''; }
      })(el);
      res.push(cur);
      return res.map(propre).filter(Boolean);
    }
    function texte(el) { return el ? lignes(el).join(' ') : ''; }
    // « Jean Dupont • 2e », « Voir le profil de Jean Dupont », « Jean Dupont, MBA » → « Jean Dupont »
    function nomPropre(s) {
      s = propre(s).replace(/^(voir le profil de|view)\s+/i, '').replace(/[’']s profile$/i, '')
        .replace(/\s*[•·]\s*(1er|1re|2e|3e|3e\+|1st|2nd|3rd\+?).*$/i, '').replace(/\s*\((il|elle|iel|he|she|they)\b[^)]*\)\s*$/i, '')
        .replace(/\s*(statut|status)\s*:.*$/i, '').replace(/\s*(vérifié|verified)\s*$/i, '').replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu, '');
      s = s.split(/\s*[,|]\s*/)[0];
      return propre(s);
    }
    function estNom(s) {
      return !!s && s.length >= 3 && s.length <= 70 && /\p{L}/u.test(s) && !BRUIT.test(s) && !/linkedin|^\d|https?:|@/i.test(s) && s.split(' ').length <= 7;
    }
    function profil(href) {
      var h = String(href || '');
      try { if (/[?&](?:q|url|u)=/.test(h) && !/linkedin\.com\/(?:in|sales)\//.test(h.split('?')[0])) h = decodeURIComponent(h); } catch (e) { /* lien illisible */ }
      var m = h.match(/(?:^|linkedin\.com)\/in\/([^/?#&\s"']+)/i);
      if (m) return { url: 'https://www.linkedin.com/in/' + m[1] + '/', cle: 'in:' + safe(m[1]).toLowerCase() };
      m = h.match(/(?:^|linkedin\.com)\/sales\/(?:lead|people)\/([^/?#&\s"',]+)/i);
      if (m) return { url: 'https://www.linkedin.com/sales/lead/' + m[1] + '/', cle: 'sn:' + m[1] };
      return null;
    }
    function safe(s) { try { return decodeURIComponent(s); } catch (e) { return s; } }
    // « Gérant chez Plomberie Dupont | Chauffage » → { poste: « Gérant », entreprise: « Plomberie Dupont » }
    var ROLE = /\b(g[ée]rante?|fondat(eur|rice)|co-?fondat(eur|rice)|dirigeante?|pr[ée]sidente?|pdg|ceo|cto|coo|cfo|dg|directeur|directrice|responsable|manager|associ[ée]e?|artisan|owner|founder|propri[ée]taire|chef|head|consultante?|commer[cç]ial|agent)\b/i;
    function decouper(t) {
      var m = propre(t).match(/^(.*?)\s+(?:chez|at|@|auprès de|au sein de|pour)\s+(.+)$/i) || propre(t).match(/^(.*?)\s*@\s*(.+)$/);
      if (!m) {
        // « Gérante – Institut Beauté Zen » : un poste puis une seule autre partie, prise pour l'entreprise.
        var p = propre(t).split(/\s+[–—|-]\s+/);
        if (p.length === 2 && ROLE.test(p[0]) && !ROLE.test(p[1]) && p[1].length <= 60) m = [t, p[0], p[1]];
      }
      if (!m) return { poste: propre(t), entreprise: '' };
      return { poste: propre(m[1]), entreprise: propre(m[2].split(/\s+[|•·–—]\s+|\s+-\s+|\s*[|/]\s*|,\s+/)[0]) };
    }
    var LIEU = /france|belgique|suisse|luxembourg|canada|québec|maroc|tunisie|algérie|sénégal|région|region|périphérie|metropolitan|area|métropole|île-de-france|auvergne|bretagne|normandie|occitanie|provence|alpes|grand est|hauts-de-france|nouvelle-aquitaine|pays de la loire|centre-val|bourgogne|corse/i;
    function estLieu(s) { return !!s && s.length <= 90 && !/\s(chez|at)\s|[@|]/i.test(s) && (LIEU.test(s) || /^[\p{Lu}][\p{L}' -]+(,\s*[\p{Lu}][\p{L}' -]+){0,3}$/u.test(s)); }
    function ajouter(l, cle) {
      if (!l || !estNom(l.nom) || out.length >= MAXL) return;
      cle = cle || 'n:' + l.nom.toLowerCase() + '|' + (l.entreprise || '').toLowerCase();
      if (vus[cle]) {
        var a = vus[cle];
        ['poste', 'entreprise', 'lieu'].forEach(function (k) { if (!a[k] && l[k]) a[k] = l[k]; });
        return;
      }
      var d = l.poste && !l.entreprise ? decouper(l.poste) : null;
      var x = { nom: l.nom, poste: propre(l.poste).slice(0, 220), entreprise: propre(l.entreprise || (d && d.entreprise) || '').slice(0, 120), lieu: propre(l.lieu).slice(0, 100), url: l.url || '' };
      vus[cle] = x; out.push(x);
    }
    // Un résultat (carte) à partir d'un lien de profil : lignes du bloc → nom, titre, lieu, poste actuel.
    // Liens vers d'autres personnes que la carte (relations en commun, « Autres profils consultés », menus) : ignorés.
    var AUTRE = '[data-view-name*="social-proof"], [data-view-name*="insight"], [class*="insight"], aside, nav, header, [role="complementary"]';
    function annexe(a) {
      if (a.closest && a.closest(AUTRE)) return true;
      var t = propre(a.textContent), pt = a.parentElement ? propre(a.parentElement.textContent) : '';
      return BRUIT.test(t) || (pt.length < 200 && pt !== t && BRUIT.test(pt));
    }
    function seul(el, cle) {
      return !Array.prototype.some.call(el.querySelectorAll('a[href]'), function (x) { if (annexe(x)) return false; var q = profil(x.getAttribute('href')); return q && cle && q.cle !== cle.cle; });
    }
    function bloc(a, racine) {
      var SEL = 'li, [data-chameleon-result-urn], [data-view-name*="search-entity-result"], [data-view-name*="people"], .entity-result, .org-people-profile-card, .mn-connection-card, [role="listitem"]';
      var c = a.closest ? a.closest(SEL) : null, moi = profil(a.getAttribute('href'));
      if (c && !seul(c, moi)) c = null;
      // Carte imbriquée trop petite (le nom seul) : on prend la carte parente, si elle ne montre que cette personne.
      while (c && c !== racine && lignes(c).length < 2 && c.parentElement) {
        var c2 = c.parentElement.closest(SEL), cle = profil(a.getAttribute('href'));
        if (!c2 || Array.prototype.some.call(c2.querySelectorAll('a[href]'), function (x) { var q = profil(x.getAttribute('href')); return q && cle && q.cle !== cle.cle; })) break;
        c = c2;
      }
      if (c && c !== racine && racine.contains(c)) return c;
      // Sans repère connu : on remonte tant que le bloc ne montre que cette personne.
      var el = a;
      while (el.parentElement && el.parentElement !== racine && seul(el.parentElement, moi) && (el.parentElement.textContent || '').length < 1200) el = el.parentElement;
      return el;
    }
    function depuisBloc(c, p, liens) {
      var ls = lignes(c), nom = '';
      for (var i = 0; i < liens.length && !nom; i++) { var t = nomPropre(lignes(liens[i])[0] || ''); if (estNom(t)) nom = t; }
      if (!nom) { for (var j = 0; j < ls.length && !nom; j++) { var u = nomPropre(ls[j]); if (estNom(u)) nom = u; } }
      if (!nom) return null;
      var k = -1;
      for (var n = 0; n < ls.length; n++) { if (nomPropre(ls[n]) === nom || ls[n].indexOf(nom) === 0) { k = n; break; } }
      var actuel = '', reste = [];
      ls.slice(k + 1).forEach(function (l) {
        var m = l.match(/^(?:actuellement|actuel|current|poste actuel|entreprise actuelle)\s*:\s*(.+)$/i);
        if (m) { if (!actuel) actuel = m[1]; return; }
        if (/^(?:passé|past|précédemment|previously|compétences|skills|résumé|summary|à propos|about)\s*:/i.test(l)) return;
        if (BRUIT.test(l) || nomPropre(l) === nom || l.length < 2) return;
        reste.push(l);
      });
      var titre = reste[0] || '', lieu = '';
      if (reste[1] && estLieu(reste[1])) lieu = reste[1];
      else for (var q = 1; q < reste.length && !lieu; q++) if (estLieu(reste[q]) && reste[q].length < 60) lieu = reste[q];
      if (!lieu && reste[0] && estLieu(reste[0]) && reste[1]) { lieu = reste[0]; titre = reste[1]; }
      var d = decouper(actuel || titre);
      return { nom: nom, poste: titre || actuel, entreprise: d.entreprise, lieu: lieu, url: p.url };
    }
    function parLiens(racine) {
      var groupes = [], parBloc = [];
      Array.prototype.forEach.call(racine.querySelectorAll('a[href]'), function (a) {
        var p = profil(a.getAttribute('href'));
        if (!p || annexe(a)) return;
        var c = bloc(a, racine), g = null;
        for (var i = 0; i < parBloc.length; i++) if (parBloc[i].c === c) { g = parBloc[i]; break; }
        if (!g) { g = { c: c, p: p, liens: [] }; parBloc.push(g); groupes.push(g); }
        if (g.p.cle === p.cle) g.liens.push(a);
      });
      groupes.forEach(function (g) { var l = depuisBloc(g.c, g.p, g.liens); if (l) ajouter(l, g.p.cle); });
    }
    var page = 'autre';
    var racine = doc.querySelector('main') || doc.body || doc.documentElement;
    if (/(^|\.)linkedin\.com$/i.test(hote) && /^\/sales\//i.test(chemin) || doc.querySelector('[data-anonymize="person-name"]')) {
      // Sales Navigator : attributs data-anonymize stables (nom, poste, entreprise, lieu).
      page = 'salesnav';
      Array.prototype.forEach.call(doc.querySelectorAll('[data-anonymize="person-name"]'), function (el) {
        var c = el.closest('li, article, [data-x-search-result], tr') || el.parentElement;
        var a = el.closest('a[href]') || c.querySelector('a[href*="/sales/lead/"], a[href*="/sales/people/"], a[href*="/in/"]');
        var p = a ? profil(a.getAttribute('href')) : null;
        var q = function (k) { var x = c.querySelector('[data-anonymize="' + k + '"]'); return x ? texte(x) : ''; };
        var lieu = q('location');
        if (!lieu) { var ls = lignes(c); for (var i = 0; i < ls.length && !lieu; i++) if (estLieu(ls[i]) && ls[i].length < 60 && ls[i] !== texte(el)) lieu = ls[i]; }
        ajouter({ nom: nomPropre(texte(el)), poste: q('title') || q('job-title') || q('headline'), entreprise: q('company-name'), lieu: lieu, url: p ? p.url : '' }, p ? p.cle : null);
      });
      if (!out.length) parLiens(racine);
    } else if (/(^|\.)linkedin\.com$/i.test(hote) && /^\/in\/[^/]+\/?$/i.test(chemin)) {
      // Profil : le nom est le titre h1 ; titre juste après ; lieu juste avant « Coordonnées ».
      page = 'profil';
      // Nouvelle mise en page (2025-2026) : pas de h1, le nom est un h2 dans la carte du haut.
      var h1 = racine.querySelector('h1') || doc.querySelector('h1') || racine.querySelector('[componentkey*="topcard" i] h2, [componentkey^="ProfileVerificationTriggerRef"] h2');
      if (h1) {
        var sec = h1.closest('section') || h1.closest('[componentkey*="topcard" i]') || h1.parentElement.parentElement || racine;
        var ls = lignes(sec), nom = nomPropre(texte(h1)), i = -1;
        for (var n = 0; n < ls.length; n++) if (nomPropre(ls[n]) === nom) { i = n; break; }
        var apres = ls.slice(i + 1).filter(function (l) { return !BRUIT.test(l) && nomPropre(l) !== nom && !/^\(.*\)$/.test(l) && !/(coordonnées|contact info)$/i.test(l); });
        var lieu = '';
        for (var c = 0; c < ls.length; c++) {
          var mc = ls[c].match(/^(.*?)\s*[·•]?\s*(?:coordonnées|contact info)$/i);
          if (mc) {
            if (mc[1]) lieu = mc[1];
            else for (var rr = c - 1; rr >= 0 && !lieu; rr--) if (!/^[\s·•]*$/.test(ls[rr])) lieu = ls[rr].replace(/\s*[·•]\s*$/, '');
            break;
          }
        }
        if (!lieu) for (var e2 = 1; e2 < apres.length && !lieu; e2++) if (estLieu(apres[e2])) lieu = apres[e2];
        var ent = '';
        var b = sec.querySelector('[aria-label^="Entreprise actuelle"], [aria-label^="Current company"], [aria-label*="entreprise actuelle" i], [aria-label*="current company" i]');
        if (b) ent = propre(b.getAttribute('aria-label').replace(/^.*?:\s*/, '').replace(/\.\s.*$/, '').replace(/\.?\s*(Cliquez|Click).*$/i, ''));
        var titre = apres[0] && apres[0] !== lieu ? apres[0] : '';
        ajouter({ nom: nom, poste: titre, entreprise: ent || decouper(titre).entreprise, lieu: estLieu(lieu) ? lieu : '', url: 'https://www.linkedin.com' + chemin.replace(/\/?$/, '/') }, 'in:' + safe(chemin.split('/')[2] || '').toLowerCase());
      }
    } else if (/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|qwant\.com|ecosia\.org|search\.yahoo\.com)$/i.test(hote)) {
      // Recherche Google (ou Bing…) de profils : « Jean Dupont - Gérant - Plomberie Dupont | LinkedIn ».
      page = 'google';
      Array.prototype.forEach.call(doc.querySelectorAll('a[href*="linkedin.com/in/"], a[href*="linkedin.com%2Fin%2F"]'), function (a) {
        var p = profil(a.getAttribute('href'));
        if (!p || vus[p.cle]) return;
        var h = a.querySelector('h3, h2') || a;
        var t = propre(texte(h)).replace(/\s*[|·–—-]\s*LinkedIn.*$/i, '').replace(/\s*\.\.\.$|\s*…$/, '');
        // « Nom - Titre | LinkedIn » ou « Nom - Poste - Entreprise » : le nom avant le premier tiret, l'entreprise en dernier.
        var parts = t.split(/\s+[-–—]\s+/);
        if (parts.length > 3) parts = [parts[0], parts.slice(1, -1).join(' - '), parts[parts.length - 1]];
        var c = a.closest('div.g, li.b_algo, article, [data-hveid], [data-result], .result, li') || a.parentElement;
        var ext = c ? lignes(c).join(' · ') : '';
        var m = ext.match(/(?:Lieu|Location|Localisation)\s*:\s*([^·|\n]+?)(?:\s*[·|]|$)/i);
        var lieu = m ? m[1] : '';
        if (!lieu) { var seg = ext.split(/\s*·\s*/); for (var i = 0; i < seg.length && !lieu; i++) if (estLieu(seg[i]) && seg[i].length < 60 && seg[i] !== parts[0]) lieu = seg[i]; }
        var ent = parts[2] || '', poste = parts[1] || '';
        if (!ent) { var m2 = ext.match(/(?:Expérience|Experience)\s*:\s*([^·|\n]+?)(?:\s*[·|]|$)/i); if (m2) ent = m2[1]; }
        if (!ent && poste) { var d = decouper(poste); if (d.entreprise) { poste = d.poste; ent = d.entreprise; } }
        ajouter({ nom: nomPropre(parts[0]), poste: poste, entreprise: ent, lieu: lieu, url: p.url }, p.cle);
      });
    } else {
      if (/\/company\/[^/]+\/people/i.test(chemin)) page = 'entreprise';
      else if (/\/mynetwork\//i.test(chemin)) page = 'relations';
      else if (/\/search\/results\//i.test(chemin)) page = 'recherche';
      parLiens(racine);
      if (page === 'entreprise') {
        // Page « Personnes » d'une entreprise : l'entreprise est celle de la page.
        var h = doc.querySelector('h1');
        var nomEnt = h ? propre(texte(h)) : '';
        if (nomEnt) out.forEach(function (l) { if (!l.entreprise) l.entreprise = nomEnt; });
      }
    }
    return { page: page, leads: out, adresse: hote ? 'https://' + hote + chemin : '' };
  }

  // ================================================================== bouton « Envoyer au CRM » (favori)
  // Exécuté dans la page LinkedIn. CRM = adresse du CRM ; X = extraire().
  function envoi(CRM, X) {
    var ID = 'bs-crm-panneau';
    var vieux = document.getElementById(ID);
    if (vieux) vieux.parentNode.removeChild(vieux);
    if (!/(^|\.)(linkedin\.com|google\.[a-z.]+|bing\.com|duckduckgo\.com|qwant\.com|ecosia\.org|search\.yahoo\.com)$/i.test(location.hostname)) {
      alert('Blackstart CRM : ouvrez d’abord LinkedIn (une recherche de personnes, un profil, Sales Navigator, la page Personnes d’une entreprise…) puis cliquez de nouveau sur « Envoyer au CRM ».');
      return;
    }
    function code(r) {
      var json = JSON.stringify({ v: 1, p: r.page, u: r.adresse, l: r.leads.slice(0, 150).map(function (l) { return [l.nom, l.poste, l.entreprise, l.lieu, l.url.replace(/^https:\/\/www\.linkedin\.com\/in\/([^/]+)\/$/, 'in:$1')]; }) });
      return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    function panneau(msg, boutons, duree) {
      var p = document.createElement('div');
      p.id = ID;
      p.setAttribute('role', 'status');
      var s = p.style;
      s.position = 'fixed'; s.top = '16px'; s.right = '16px'; s.zIndex = '2147483647'; s.maxWidth = '340px'; s.padding = '14px 16px';
      s.background = '#111827'; s.color = '#fff'; s.borderRadius = '14px'; s.boxShadow = '0 12px 40px rgba(0,0,0,.35)';
      s.font = '14px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
      var t = document.createElement('div');
      t.style.fontWeight = '700'; t.style.marginBottom = '4px'; t.textContent = 'Blackstart CRM';
      var m = document.createElement('div');
      m.textContent = msg;
      p.appendChild(t); p.appendChild(m);
      var row = document.createElement('div');
      row.style.display = 'flex'; row.style.gap = '8px'; row.style.marginTop = '10px'; row.style.flexWrap = 'wrap';
      (boutons || []).concat([['Fermer', function () { p.remove(); }, 1]]).forEach(function (b) {
        var e = document.createElement('button');
        e.type = 'button'; e.textContent = b[0];
        var bs = e.style;
        bs.border = '0'; bs.borderRadius = '9px'; bs.padding = '7px 12px'; bs.cursor = 'pointer'; bs.font = '600 13px system-ui,sans-serif';
        bs.background = b[2] ? 'rgba(255,255,255,.14)' : '#6366f1'; bs.color = '#fff';
        e.addEventListener('click', b[1]);
        row.appendChild(e);
      });
      p.appendChild(row);
      document.body.appendChild(p);
      if (duree) setTimeout(function () { if (p.parentNode) p.remove(); }, duree);
      return p;
    }
    function copier(c) {
      var v = 'BSLI1:' + c;
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(ok, ko); else ko();
      function ok() { panneau('Copié. Dans le CRM (Nouveaux leads › LinkedIn), cliquez dans la zone « Coller » puis Ctrl+V.', [], 6000); }
      function ko() { window.prompt('Copiez ce texte (Ctrl+C) puis collez-le dans le CRM, zone « Coller » :', v); }
    }
    function fin(r, direct) {
      var n = Math.min(r.leads.length, 150);
      if (!n) {
        panneau('Aucune personne trouvée sur cette page. Ouvrez une recherche de personnes (onglet « Personnes »), un profil, une liste Sales Navigator ou la page « Personnes » d’une entreprise, puis cliquez de nouveau.');
        return;
      }
      var c = code(r), url = CRM + '#/leads?li=' + c;
      var w = direct ? window.open(url, 'bs-crm') : null;
      var txt = n + (n > 1 ? ' personnes' : ' personne');
      if (w) { panneau('✓ ' + txt + ' envoyée' + (n > 1 ? 's' : '') + ' au CRM. Passez à la page suivante et cliquez de nouveau pour continuer.', [], 5000); return; }
      panneau(txt + ' trouvée' + (n > 1 ? 's' : '') + ' sur cette page' + (r.leads.length > 150 ? ' (les 150 premières seront envoyées)' : '') + '.', [
        ['Envoyer au CRM', function () { if (window.open(url, 'bs-crm')) { document.getElementById(ID).remove(); } else copier(c); }],
        ['Copier', function () { copier(c); }, 1],
      ]);
    }
    // Sales Navigator n'affiche les résultats qu'au fil du défilement : on fait défiler la liste avant de lire.
    if (/^\/sales\//.test(location.pathname)) {
      var att = panneau('Lecture de la page…');
      var el = document.querySelector('#search-results-container') || (function () {
        var x = document.querySelector('[data-anonymize="person-name"]');
        while (x && x !== document.body) { var st = getComputedStyle(x); if (/(auto|scroll)/.test(st.overflowY) && x.scrollHeight > x.clientHeight + 20) return x; x = x.parentElement; }
        return document.scrollingElement || document.documentElement;
      })();
      var k = 0;
      (function pas() {
        var avant = el.scrollTop;
        el.scrollTop = avant + Math.max(300, el.clientHeight * 0.8);
        if (++k < 25 && el.scrollTop > avant && el.scrollTop + el.clientHeight < el.scrollHeight - 4) { setTimeout(pas, 350); return; }
        setTimeout(function () { if (att.parentNode) att.remove(); fin(X(document, location.href), false); }, 500);
      })();
      return;
    }
    fin(X(document, location.href), true);
  }

  function crmAdresse() { return String(location.href).split('#')[0]; }
  // Source compacte : sans les lignes de commentaire ni l'indentation (un favori garde mieux une adresse courte).
  function compacte(f) { return f.toString().split('\n').map(function (l) { return l.trim(); }).filter(function (l) { return l && l.indexOf('//') !== 0; }).join('\n'); }
  function codeBouton() { return '(' + compacte(envoi) + ')(' + JSON.stringify(crmAdresse()) + ',' + compacte(extraire) + ')'; }
  function lienBouton() { return 'javascript:' + codeBouton().replace(/%/g, '%25').replace(/#/g, '%23').replace(/\n/g, '%0A').replace(/"/g, '%22').replace(/</g, '%3C').replace(/>/g, '%3E'); }

  // ================================================================== outils
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ic(name, size) {
    var p = window.bsIcones && window.bsIcones.svg ? window.bsIcones.svg(name) : '';
    return '<svg width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (p || '<circle cx="12" cy="12" r="8"/>') + '</svg>';
  }
  var LOGO = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
  function lireJson(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function ecrireJson(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
  function propre(s, n) { return String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f​-‏⁠﻿]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n || 200); }
  function auj() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function heure() { var d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function pluriel(n, un, plusieurs) { return n + ' ' + (n > 1 ? (plusieurs || un + 's') : un); }
  function dormir(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function prenomDe(nom) { var p = String(nom || '').trim().split(/\s+/)[0] || ''; return p.charAt(0).toUpperCase() + p.slice(1); }
  function toast(msg, ton) {
    var Y = window.__bsY; if (!Y || !Y.set) return;
    var t = { id: uid(), message: msg, tone: ton || 'success', action: null, actionLabel: '' };
    Y.set(function (s) { return { toasts: (s.toasts || []).slice(-2).concat([t]) }; });
    setTimeout(function () { Y.set(function (s) { return { toasts: (s.toasts || []).filter(function (x) { return x.id !== t.id; }) }; }); }, 4200);
  }
  function getJson(url, opts, timeout) {
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var t = setTimeout(function () { if (ctl) ctl.abort(); }, timeout || 15000);
    return fetch(url, Object.assign({ signal: ctl ? ctl.signal : undefined, headers: { Accept: 'application/json' } }, opts || {}))
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { if (!r.ok) throw Object.assign(new Error(b.error || 'Erreur ' + r.status), { status: r.status, code: b.code }); return b; }); })
      .finally(function () { clearTimeout(t); });
  }
  function api(methode, url, corps) {
    return getJson(url, { method: methode, credentials: 'same-origin', headers: { Accept: 'application/json', 'X-Requested-With': 'blackstart', 'Content-Type': 'application/json' }, body: corps ? JSON.stringify(corps) : undefined }, 120000);
  }
  function profilUrl(u) {
    u = String(u || '').trim();
    var m = u.match(/^in:([^/?#\s]+)$/) || u.match(/^https?:\/\/(?:[a-z]{2,3}\.|www\.)?linkedin\.com\/in\/([^/?#\s]+)/i);
    if (m) return 'https://www.linkedin.com/in/' + m[1] + '/';
    m = u.match(/^https?:\/\/(?:www\.)?linkedin\.com\/sales\/(?:lead|people)\/([^/?#,\s]+)/i);
    return m ? 'https://www.linkedin.com/sales/lead/' + m[1] + '/' : '';
  }
  function cleProfil(u) { var m = String(u || '').match(/\/(in|sales\/lead)\/([^/]+)/); if (!m) return ''; var s = m[2]; try { s = decodeURIComponent(s); } catch (e) { /* tel quel */ } return (m[1] === 'in' ? 'in:' : 'sn:') + s.toLowerCase(); }
  function cleLead(l) { return cleProfil(l.url) || 'n:' + norm(l.nom) + '|' + norm(l.entreprise); }
  // Ville tirée du lieu LinkedIn : « Région de Lyon », « Lyon et périphérie », « Greater Lyon Area » → « Lyon ».
  function villeDe(lieu) {
    var v = String(lieu || '').split(',')[0].replace(/^(région de|grande région de|métropole de|agglomération de|greater)\s+/i, '').replace(/\s+(et périphérie|metropolitan area|area|region|métropole)$/i, '').trim();
    return /^(france|belgique|suisse|canada|luxembourg)$/i.test(v) ? '' : v;
  }

  // ================================================================== leads reçus (gardés dans ce navigateur)
  var LEADS = null, GARDER_JOURS = 30;
  function leads() {
    if (!LEADS) {
      LEADS = lireJson(CLE_LEADS, []);
      if (!Array.isArray(LEADS)) LEADS = [];
      // RGPD : un lead pas ajouté au CRM est effacé d'ici au bout de 30 jours.
      var limite = Date.now() - GARDER_JOURS * 864e5, avant = LEADS.length;
      LEADS = LEADS.filter(function (l) { return l.statut === 'ajoute' || !l.recu || Date.parse(l.recu) >= limite; });
      if (LEADS.length !== avant) ecrireJson(CLE_LEADS, LEADS);
    }
    return LEADS;
  }
  // Pages lues aujourd'hui avec le bouton (repère de rythme, gardé dans ce navigateur).
  function rythme() { var j = lireJson(CLE_JOUR, null); return j && j.d === auj() ? j : { d: auj(), pages: 0, personnes: 0 }; }
  function sauver() {
    var l = leads();
    if (l.length > MAX) {
      var ecartes = l.filter(function (x) { return x.statut; });
      while (l.length > MAX && ecartes.length) { var e = ecartes.pop(); l.splice(l.indexOf(e), 1); }
      if (l.length > MAX) l.length = MAX;
    }
    if (!ecrireJson(CLE_LEADS, l)) {
      // Plus de place : on oublie les leads déjà ajoutés ou écartés, les plus anciens d'abord.
      LEADS = l.filter(function (x) { return !x.statut; }).slice(0, 3000);
      ecrireJson(CLE_LEADS, LEADS);
    }
  }
  function normaliser(x, source) {
    if (!x) return null;
    var l = Array.isArray(x) ? { nom: x[0], poste: x[1], entreprise: x[2], lieu: x[3], url: x[4] } : x;
    var r = { nom: propre(l.nom, 80), poste: propre(l.poste, 220), entreprise: propre(l.entreprise, 120), lieu: propre(l.lieu, 100), url: profilUrl(l.url), email: '' };
    if (l.email && /^[^\s@<>]+@[^\s@<>]+\.[a-z]{2,}$/i.test(String(l.email).trim())) r.email = String(l.email).trim().slice(0, 120);
    if (l.connecte) r.connecte = propre(l.connecte, 30);
    if (!r.nom || !/\p{L}/u.test(r.nom)) return null;
    r.source = source || 'bouton';
    return r;
  }
  var PAGE_SURE = /^https:\/\/([a-z0-9-]+\.)*(linkedin\.com|google\.[a-z.]+|bing\.com|duckduckgo\.com|qwant\.com|ecosia\.org|search\.yahoo\.com)\/[^\s?#]*$/i;
  // Ajoute des leads à la liste à trier. capture = page où ils ont été vus. Retourne { nouveaux, connus }.
  function fusionner(liste, source, capture) {
    capture = PAGE_SURE.test(String(capture || '')) ? String(capture).slice(0, 200) : '';
    var l = leads(), index = {}, lot = new Date().toISOString(), res = { nouveaux: 0, connus: 0, ids: [] };
    l.forEach(function (x) { index[cleLead(x)] = x; });
    var neufs = [];
    (liste || []).forEach(function (brut) {
      var x = normaliser(brut, source);
      if (!x) return;
      var k = cleLead(x), a = index[k];
      if (a) {
        ['poste', 'entreprise', 'lieu', 'email', 'url'].forEach(function (c) { if (!a[c] && x[c]) a[c] = x[c]; });
        res.connus++; res.ids.push(a.id);
        return;
      }
      x.id = 'li' + uid(); x.recu = lot; x.statut = '';
      if (capture) x.vu = capture;
      index[k] = x; neufs.push(x); res.nouveaux++; res.ids.push(x.id);
    });
    LEADS = neufs.concat(l);
    if (neufs.length) ecrireJson(CLE_LOT, lot);
    if (source !== 'export' && (res.nouveaux || res.connus)) { var j = rythme(); j.pages++; j.personnes += res.nouveaux + res.connus; ecrireJson(CLE_JOUR, j); }
    sauver();
    return res;
  }
  function decoder(code) {
    var b = String(code || '').replace(/^BSLI1:/, '').replace(/-/g, '+').replace(/_/g, '/').replace(/[^A-Za-z0-9+/]/g, '');
    while (b.length % 4) b += '=';
    var json = decodeURIComponent(escape(atob(b)));
    var o = JSON.parse(json);
    if (!o || o.v !== 1 || !Array.isArray(o.l)) throw new Error('format');
    return o;
  }
  var SOURCES = { recherche: 'Recherche LinkedIn', profil: 'Profil LinkedIn', entreprise: 'Page entreprise', salesnav: 'Sales Navigator', relations: 'Mes relations', google: 'Recherche Google', autre: 'Page LinkedIn', collage: 'Page collée', export: 'Export LinkedIn' };
  function recevoirCode(code) {
    var o = decoder(code);
    var src = SOURCES[o.p] ? o.p : 'autre';
    var r = fusionner(o.l.slice(0, 200), src, o.u);
    r.page = src; r.adresse = String(o.u || '');
    return r;
  }
  function arrivee() {
    var m = String(location.hash || '').match(/^#\/leads\?(?:.*&)?li=([A-Za-z0-9_-]+)/);
    if (!m) return;
    var r = null;
    try { r = recevoirCode(m[1]); } catch (e) { r = null; }
    try { history.replaceState(null, '', '#/leads'); } catch (e) { /* adresse inchangée */ }
    // Recherche lancée depuis la fiche d'un prospect : ses contacts y sont rangés tout de suite.
    var rg = r ? rattacher(r) : null;
    if (rg) {
      // Tout est rangé : on rouvre la fiche du prospect. Sinon on ferme la fiche pour montrer les autres personnes de la page.
      var montrer = function () {
        if (rg.ajoutes) toast(pluriel(rg.ajoutes, 'contact LinkedIn ajouté', 'contacts LinkedIn ajoutés') + ' à la fiche de ' + rg.entreprise + '.');
        if (!window.__bsY) return;
        window.__bsY.set(function (s) {
          var o = (s.overlays || []).filter(function (x) { return x.type !== 'prospect'; });
          if (UI.pour && !UI.pour.autres.length) o = o.concat([{ key: 'bsli' + Date.now(), type: 'prospect', id: UI.pour.id }]);
          return { overlays: o };
        });
      };
      if (window.__bsY) montrer(); else setTimeout(montrer, 800);
    }
    if (rg) {
      ecrireJson(CLE_ONGLET, 'linkedin');
      if (window.bsLeads && window.bsLeads.onglet) window.bsLeads.onglet('linkedin');
      redessiner();
      return;
    }
    ecrireJson(CLE_ONGLET, 'linkedin');
    UI.filtre = 'nouveaux'; UI.garde = {};
    if (window.bsLeads && window.bsLeads.onglet) window.bsLeads.onglet('linkedin');
    redessiner();
    var dire = function () {
      if (!r) toast('Les leads LinkedIn reçus sont illisibles : renvoyez la page avec le bouton.', 'error');
      else toast(r.nouveaux ? pluriel(r.nouveaux, 'lead LinkedIn reçu', 'leads LinkedIn reçus') + (r.connus ? ' (' + r.connus + ' déjà reçus)' : '') : 'Ces personnes étaient déjà dans vos leads LinkedIn.');
    };
    if (window.__bsY) dire(); else setTimeout(dire, 800);
  }

  // ================================================================== export officiel de LinkedIn (Connections.csv / .zip)
  // Séparateur deviné sur la ligne d'en-tête : « , » chez LinkedIn, « ; » si le fichier a été réenregistré par Excel.
  function separateur(t) {
    var l = (String(t).split(/\r?\n/).filter(function (x) { return /first name|prénom|prenom/i.test(x); })[0]) || String(t).split(/\r?\n/)[0] || '';
    return (l.split(';').length > l.split(',').length) ? ';' : ',';
  }
  function entites(s) { return String(s).replace(/&(amp|lt|gt|quot|#39|apos);/g, function (m, e) { return { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'" }[e]; }); }
  function csvLignes(t) {
    var res = [], ligne = [], champ = '', q = false, sep = separateur(t);
    for (var i = 0; i < t.length; i++) {
      var c = t[i];
      if (q) { if (c === '"') { if (t[i + 1] === '"') { champ += '"'; i++; } else q = false; } else champ += c; continue; }
      if (c === '"') q = true;
      else if (c === sep) { ligne.push(champ); champ = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; ligne.push(champ); res.push(ligne); ligne = []; champ = ''; }
      else champ += c;
    }
    if (champ || ligne.length) { ligne.push(champ); res.push(ligne); }
    return res;
  }
  function lireRelations(t) {
    t = String(t || '').replace(/^﻿/, '');
    var rows = csvLignes(t), h = -1;
    for (var i = 0; i < Math.min(rows.length, 30); i++) {
      var n = rows[i].map(norm);
      if ((n.indexOf('first name') >= 0 || n.indexOf('prenom') >= 0) && (n.indexOf('last name') >= 0 || n.indexOf('nom') >= 0)) { h = i; break; }
    }
    if (h < 0) throw new Error('Ce fichier n’est pas la liste des relations LinkedIn (Connections.csv).');
    var tete = rows[h].map(norm);
    var col = function () { for (var a = 0; a < arguments.length; a++) { var k = tete.indexOf(arguments[a]); if (k >= 0) return k; } return -1; };
    var cP = col('first name', 'prenom'), cN = col('last name', 'nom'), cU = col('url', 'profile url', 'url du profil'), cE = col('email address', 'adresse e mail', 'e mail', 'email'),
      cC = col('company', 'entreprise', 'societe'), cT = col('position', 'poste', 'titre'), cD = col('connected on', 'date de connexion', 'connecte le');
    var v = function (r, k) { return k >= 0 ? entites(String(r[k] || '').trim()) : ''; };
    return rows.slice(h + 1).filter(function (r) { return r.length > 1 && (v(r, cP) || v(r, cN)); }).map(function (r) {
      return { nom: (v(r, cP) + ' ' + v(r, cN)).trim(), poste: v(r, cT), entreprise: v(r, cC), lieu: '', url: v(r, cU), email: v(r, cE), connecte: v(r, cD) };
    });
  }
  // Archive .zip de LinkedIn : on y prend Connections.csv (décompressé par le navigateur).
  function depuisZip(buf) {
    var d = new DataView(buf), u8 = new Uint8Array(buf), fin = -1;
    for (var i = u8.length - 22; i >= Math.max(0, u8.length - 70000); i--) if (d.getUint32(i, true) === 0x06054b50) { fin = i; break; }
    if (fin < 0) return Promise.reject(new Error('Archive .zip illisible.'));
    var nb = d.getUint16(fin + 10, true), p = d.getUint32(fin + 16, true);
    for (var k = 0; k < nb; k++) {
      if (d.getUint32(p, true) !== 0x02014b50) break;
      var meth = d.getUint16(p + 10, true), taille = d.getUint32(p + 20, true), ln = d.getUint16(p + 28, true), lx = d.getUint16(p + 30, true), lc = d.getUint16(p + 32, true), off = d.getUint32(p + 42, true);
      var nom = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + ln));
      p += 46 + ln + lx + lc;
      if (!/(^|\/)connections\.csv$/i.test(nom)) continue;
      var deb = off + 30 + d.getUint16(off + 26, true) + d.getUint16(off + 28, true);
      var data = u8.subarray(deb, deb + taille);
      if (meth === 0) return Promise.resolve(texteDe(data));
      if (meth !== 8 || typeof DecompressionStream === 'undefined') return Promise.reject(new Error('Décompressez l’archive puis choisissez le fichier Connections.csv.'));
      var flux = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      return new Response(flux).arrayBuffer().then(function (b) { return texteDe(new Uint8Array(b)); });
    }
    return Promise.reject(new Error('Pas de fichier Connections.csv dans cette archive : demandez à LinkedIn la copie de vos « Relations ».'));
  }
  // UTF-8 d'abord ; sinon Windows-1252 (fichier réenregistré par Excel sous Windows).
  function texteDe(u8) {
    try { return new TextDecoder('utf-8', { fatal: true }).decode(u8); } catch (e) { return new TextDecoder('windows-1252').decode(u8); }
  }
  function importerFichier(f) {
    if (!f) return Promise.resolve(null);
    if (f.size > 40 * 1024 * 1024) return Promise.reject(new Error('Fichier trop lourd.'));
    var estZip = /\.zip$/i.test(f.name) || f.type === 'application/zip';
    var lire = estZip ? f.arrayBuffer().then(depuisZip) : f.arrayBuffer().then(function (b) { return texteDe(new Uint8Array(b)); });
    return lire.then(function (t) { var l = lireRelations(t); return fusionner(l, 'export'); });
  }

  // ================================================================== cible et notation
  var MOTS_METIERS = {
    plombier: 'plombier, plomberie, chauffagiste, chauffage, sanitaire', electricien: 'électricien, électricité', menuisier: 'menuisier, menuiserie, ébéniste',
    serrurier: 'serrurier, serrurerie, métallier, métallerie', macon: 'maçon, maçonnerie, gros oeuvre', constructeur: 'constructeur, construction, maisons individuelles',
    peintre: 'peintre, peinture, décoration', couvreur: 'couvreur, couverture, toiture, charpente', platrier: 'plâtrier, plaquiste, plâtrerie', carreleur: 'carreleur, carrelage',
    paysagiste: 'paysagiste, espaces verts, jardin', garage: 'garage, garagiste, mécanique, automobile', 'agence-immo': 'immobilier, agence immobilière, agent immobilier, mandataire',
    syndic: 'syndic, gestion locative, administrateur de biens', diagnostiqueur: 'diagnostiqueur, diagnostic immobilier, contrôle technique', dentiste: 'dentiste, chirurgien-dentiste, cabinet dentaire',
    medecin: 'médecin, médecin généraliste', specialiste: 'médecin, cardiologue, dermatologue, ophtalmologue, radiologue', kine: 'kinésithérapeute, kiné, rééducation',
    osteo: 'ostéopathe, ostéopathie, podologue, infirmier', veterinaire: 'vétérinaire, clinique vétérinaire', coiffeur: 'coiffeur, coiffure, salon de coiffure, barbier',
    beaute: 'esthéticienne, institut de beauté, spa, onglerie', sport: 'salle de sport, coach sportif, fitness, crossfit', pharmacie: 'pharmacien, pharmacie',
    restaurant: 'restaurant, restaurateur, chef cuisinier', rapide: 'restauration rapide, snack, food truck', boulangerie: 'boulanger, boulangerie, pâtissier, pâtisserie',
    hotel: 'hôtel, hôtelier, hôtellerie', fleuriste: 'fleuriste', opticien: 'opticien, optique', vetements: 'boutique, prêt-à-porter, magasin de vêtements', vad: 'e-commerce, boutique en ligne, ecommerce',
    comptable: 'expert-comptable, cabinet comptable, comptabilité', avocat: 'avocat, cabinet d’avocats, juriste', conseil: 'consultant, conseil, cabinet de conseil', assurance: 'assurance, courtier, agent général',
    nettoyage: 'nettoyage, propreté', pub: 'agence de communication, communication, marketing', 'auto-ecole': 'auto-école, moniteur', informatique: 'informatique, infogérance, ESN',
  };
  var POSTES = 'gérant, fondateur, cofondateur, co-fondateur, dirigeant, président, PDG, CEO, directeur général, DG, chef d’entreprise, propriétaire, associé, artisan, owner, founder, managing director, directeur commercial';
  var EXCLURE = 'étudiant, stagiaire, alternant, apprenti, en recherche d’emploi, à la recherche, open to work, retraité';
  var MOYENS = 'directeur, directrice, responsable, manager, head of, chef de, cadre';
  function cibleParDefaut() {
    var p = lireJson('bs-leads-prefs', {}) || {};
    var st = window.__bsStore ? window.__bsStore.get() : {};
    var ideal = (st && st.settings && st.settings.clientIdeal) || {};
    var secteurs = '';
    if (p.metier && MOTS_METIERS[p.metier]) secteurs = MOTS_METIERS[p.metier];
    else if (ideal.metiers && ideal.metiers.length) secteurs = ideal.metiers.map(function (m) { return (MOTS_METIERS[m] || '').split(',')[0]; }).filter(Boolean).join(', ');
    var zone = p.zone || (ideal.zones && ideal.zones[0]) || ((st && st.companyInfo && st.companyInfo.ville) || '');
    return { postes: POSTES, secteurs: secteurs, zone: /^\d{5}$/.test(zone) ? '' : zone, exclure: EXCLURE };
  }
  function cible() { return Object.assign(cibleParDefaut(), lireJson(CLE_CIBLE, {}) || {}); }
  // Mots-clés saisis → { t: tel qu'écrit, v: formes à chercher } ; « fondateur » trouve aussi « fondatrice »,
  // « gérant » trouve « gérante » (on compare le début des mots).
  function mots(s) {
    return String(s || '').split(/[,;\n]|\s+(?:OR|ou)\s+/i).map(function (x) { return x.trim().replace(/^["'(]+|["')]+$/g, ''); }).filter(function (x) { return norm(x).length > 1; }).map(function (x) {
      var n = norm(x), v = [n];
      if (/teur\b/.test(n)) v.push(n.replace(/teur\b/g, 'trice'));
      else if (/eur\b/.test(n)) v.push(n.replace(/eur\b/g, 'euse'));
      if (/ien\b/.test(n)) v.push(n.replace(/ien\b/g, 'ienne'));
      return { t: x, v: v };
    });
  }
  function contient(t, m) { return (' ' + t + ' ').indexOf(' ' + m) >= 0; }
  function trouve(t, liste) {
    for (var i = 0; i < liste.length; i++) { var x = liste[i]; if (typeof x === 'string') { if (contient(t, x)) return x; continue; } for (var j = 0; j < x.v.length; j++) if (contient(t, x.v[j])) return x.t; }
    return '';
  }

  // Zone visée → noms de communes, département et région (geo.api.gouv.fr), pour comparer au lieu LinkedIn.
  var ZONES = {};
  function zoneInfo(z) {
    z = String(z || '').trim();
    if (!z) return null;
    var k = norm(z);
    if (ZONES[k]) return ZONES[k];
    var info = { villes: z.split(/\s*,\s*/).map(norm).filter(Boolean), proches: [], pret: false };
    if (/^(\d{2}|2a|2b|97\d)$/i.test(info.villes[0] || '')) info.villes.shift();
    ZONES[k] = info;
    var premier = z.split(/\s*,\s*/)[0];
    var url = /^(\d{2}|2a|2b|97\d)$/i.test(premier) ? GEO + '/departements/' + premier.toUpperCase() + '?fields=nom,codeRegion'
      : GEO + '/communes?nom=' + encodeURIComponent(premier) + '&fields=nom,departement,region&boost=population&limit=1';
    getJson(url, null, 8000).then(function (r) {
      var c = Array.isArray(r) ? r[0] : r;
      if (!c) return;
      if (c.departement) { info.villes.push(norm(c.nom)); info.proches.push(norm(c.departement.nom)); if (c.region) info.proches.push(norm(c.region.nom)); }
      else if (c.nom) { info.villes = [norm(c.nom)]; if (c.codeRegion) return getJson(GEO + '/regions/' + c.codeRegion + '?fields=nom', null, 8000).then(function (g) { if (g && g.nom) info.proches.push(norm(g.nom)); }); }
    }).catch(function () { /* comparaison sur le texte seul */ }).then(function () { info.pret = true; noterTout(); redessiner(); });
    return info;
  }
  // Note de 0 à 100 avec ses raisons : décideur (55), secteur (25), zone (20), puis l'entreprise vérifiée dans Sirene.
  function noter(l, c, zi) {
    var t = norm([l.poste, l.entreprise, l.sir && l.sir.nafLabel].filter(Boolean).join(' '));
    var raisons = [], gagne = 0, possible = 55;
    var ex = trouve(t, mots(c.exclure));
    var dec = trouve(t, mots(c.postes)), moyen = dec ? '' : trouve(t, mots(MOYENS));
    var dirigeant = l.sir && l.sir.dirigeant && norm(l.nom) && norm(l.sir.dirigeant).split(' ').some(function (w) { return w.length > 2 && norm(l.nom).split(' ').indexOf(w) >= 0; });
    if (dirigeant) { gagne += 55; raisons.push(['ok', 'Dirigeant de l’entreprise (Sirene)']); }
    else if (dec) { gagne += 55; raisons.push(['ok', 'Décideur : ' + dec]); }
    else if (moyen) { gagne += 30; raisons.push(['moy', 'Responsable : ' + moyen]); }
    else if (l.poste) raisons.push(['ko', 'Pas un poste de décideur']);
    else raisons.push(['moy', 'Poste inconnu']);
    var sects = mots(c.secteurs);
    if (sects.length) {
      possible += 25;
      var s = trouve(t, sects);
      if (s) { gagne += 25; raisons.push(['ok', 'Secteur : ' + s]); } else raisons.push(['ko', 'Autre secteur']);
    }
    if (zi) {
      possible += 20;
      var lieu = norm(l.lieu || (l.sir && l.sir.ville));
      if (!lieu) raisons.push(['moy', 'Lieu inconnu']);
      else if (trouve(lieu, zi.villes)) { gagne += 20; raisons.push(['ok', 'Dans la zone']); }
      else if (trouve(lieu, zi.proches)) { gagne += 12; raisons.push(['moy', 'Près de la zone']); }
      else raisons.push(['ko', 'Hors zone']);
    }
    var score = Math.round(100 * gagne / possible);
    if (l.sir) {
      if (/^(32|41|42|51|52|53)$/.test(l.sir.tranche || '') || l.sir.categorie === 'GE') { score -= 30; raisons.push(['ko', 'Grande entreprise']); }
      else { score += 5; raisons.push(['ok', 'Entreprise vérifiée' + (l.sir.effectif ? ' · ' + l.sir.effectif : '')]); }
    }
    if (ex) { score = Math.min(score, 10); raisons.unshift(['ko', 'À écarter : ' + ex]); }
    if (!l.poste && !dirigeant) score = Math.min(score, 50);
    score = Math.max(0, Math.min(100, score));
    return { score: score, categorie: score >= 70 ? 'qualifie' : score >= 40 ? 'a_verifier' : 'hors_cible', raisons: raisons };
  }
  var NOTES = {};
  function noterTout() {
    var c = cible(), zi = zoneInfo(c.zone);
    NOTES = {};
    leads().forEach(function (l) { NOTES[l.id] = noter(l, c, zi); });
  }
  function verdict(l) {
    var r = NOTES[l.id] || (NOTES[l.id] = noter(l, cible(), zoneInfo(cible().zone)));
    if (l.ia) return { score: l.ia.score, categorie: l.ia.categorie, raisons: r.raisons, ia: l.ia };
    return r;
  }

  // ================================================================== entreprise vérifiée dans Sirene
  var GENERIQUE = /^(freelance|free-lance|indépendant|independant|independent|self[- ]employed|auto[- ]?entrepreneur|micro[- ]?entrepreneur|confidentiel|confidential|stealth|en recherche.*|retraité|étudiant|student|linkedin|n\/a|na|-|aucune?)$/i;
  var SIRENE = { file: [], actif: false, cache: {} };
  function aVerifier(l) { return l.entreprise && l.sir === undefined && !l.statut && !GENERIQUE.test(l.entreprise.trim()) && l.entreprise.length >= 3; }
  function verifier(liste) {
    liste.filter(aVerifier).forEach(function (l) { if (SIRENE.file.indexOf(l) < 0) SIRENE.file.push(l); });
    if (SIRENE.actif || !SIRENE.file.length) return;
    SIRENE.actif = true;
    (function suivant() {
      var l = SIRENE.file.shift();
      if (!l) { SIRENE.actif = false; sauver(); noterTout(); redessiner(); return; }
      chercherSirene(l).then(function (s) { l.sir = s || false; }, function (e) { if (e && e.status === 429) SIRENE.file.unshift(l); })
        .then(function () { NOTES[l.id] = null; delete NOTES[l.id]; if (SIRENE.file.length % 5 === 0) { sauver(); redessiner(); } return dormir(220); })
        .then(suivant);
    })();
  }
  function chercherSirene(l) {
    var k = norm(l.entreprise) + '|' + norm(villeDe(l.lieu));
    if (SIRENE.cache[k] !== undefined) return Promise.resolve(SIRENE.cache[k]);
    var q = new URLSearchParams({ q: l.entreprise, per_page: '8', etat_administratif: 'A' });
    return getJson(API + '/search?' + q.toString(), null, 12000).then(function (data) {
      var T = window.bsLeads && window.bsLeads._interne;
      var sameName = T ? T.sameName : function (a, b) { return norm(a) === norm(b) ? 1 : 0; };
      var ville = norm(villeDe(l.lieu));
      var cands = (data && Array.isArray(data.results) ? data.results : []).filter(function (o) {
        if (!o || /non.?diffusible/i.test(o.nom_complet || '')) return false;
        var noms = [o.nom_complet, o.nom_raison_sociale, o.siege && o.siege.nom_commercial].concat((o.siege && o.siege.liste_enseignes) || []).concat((o.matching_etablissements || []).reduce(function (a, e) { return a.concat(e.liste_enseignes || []); }, []));
        return noms.some(function (n) { return n && sameName(n, l.entreprise) >= 0.9; });
      });
      if (ville && cands.length > 1) {
        var ici = cands.filter(function (o) { return [o.siege].concat(o.matching_etablissements || []).some(function (e) { return e && norm(e.libelle_commune).indexOf(ville) === 0; }); });
        if (ici.length) cands = ici;
      }
      var res = null;
      if (cands.length === 1 || (cands.length > 1 && cands[0].siren === cands[1].siren)) {
        var o = cands[0], lead = T && T.toLead ? T.toLead(o, { secteur: '', metier: '' }) : null;
        if (lead) res = { siren: lead.siren, siret: lead.siret, nom: lead.enseigne || lead.nom, ville: lead.ville, adresse: lead.adresse, naf: lead.naf, nafLabel: lead.nafLabel, effectif: lead.effectif, tranche: lead.trancheCode, creation: lead.creation, categorie: lead.categorie, dirigeant: lead.dirigeant };
      }
      SIRENE.cache[k] = res;
      return res;
    });
  }

  // ================================================================== Claude (version équipe)
  var IA = { etat: null, enCours: false, msg: '' };
  function etatIA() {
    if (IA.etat !== null) return;
    if (!window.BS_SERVER) { IA.etat = false; return; }
    IA.etat = 'attente';
    api('GET', '/api/ia/etat').then(function (b) { IA.etat = !!b.ia; IA.admin = !!b.admin; redessiner(); }, function () { IA.etat = false; redessiner(); });
  }
  function offre() {
    var st = window.__bsStore ? window.__bsStore.get() : {};
    var c = (st && st.companyInfo) || {};
    return (c.nom || 'Blackstart AI') + ' : création de CRM sur mesure et génération de leads pour les TPE et PME françaises.';
  }
  function qualifierIA(liste) {
    if (IA.enCours || !liste.length) return;
    IA.enCours = true; IA.msg = '';
    var c = cible(), lots = [];
    liste = liste.slice(0, 100);
    for (var i = 0; i < liste.length; i += 25) lots.push(liste.slice(i, i + 25));
    var fait = 0;
    redessiner();
    lots.reduce(function (p, lot) {
      return p.then(function () {
        return api('POST', '/api/ia/linkedin/qualifier', {
          cible: { offre: offre(), postes: c.postes, secteurs: c.secteurs, zone: c.zone, exclure: c.exclure },
          leads: lot.map(function (l) { return { id: l.id, poste: l.poste, entreprise: [l.entreprise, l.sir && l.sir.effectif ? '(' + l.sir.effectif + (l.sir.nafLabel ? ', ' + l.sir.nafLabel : '') + ')' : ''].filter(Boolean).join(' '), lieu: l.lieu }; }),
        }).then(function (b) {
          (b.leads || []).forEach(function (x) { var l = leads().filter(function (y) { return y.id === x.id; })[0]; if (l) l.ia = { score: x.score, categorie: x.categorie, raison: x.raison, message: x.message }; });
          fait += lot.length; sauver(); redessiner();
        });
      });
    }, Promise.resolve()).catch(function (e) {
      IA.msg = e && e.code === 'SANS_CLE' ? 'Claude n’est pas encore branché : un administrateur doit coller la clé Claude dans Équipe › Entraînement.' : (e && e.message) || 'Claude n’a pas pu qualifier ces leads.';
    }).then(function () { IA.enCours = false; if (fait && !IA.msg) toast(pluriel(fait, 'lead qualifié par Claude', 'leads qualifiés par Claude')); redessiner(); });
  }

  // ================================================================== ajout au CRM
  function crmIndex() {
    var st = window.__bsStore ? window.__bsStore.get() : {};
    var ix = { url: {}, nom: {}, siren: {}, stop: {} };
    (st.prospects || []).forEach(function (p) {
      if (p.nePlusContacter) ix.stop[p.id] = 1;
      if (p.linkedin) ix.url[cleProfil(p.linkedin)] = p.id;
      if (p.contact) ix.nom[norm(p.contact) + '|' + norm(p.entreprise)] = p.id;
      var s = String(p.siret || '').replace(/\D/g, '');
      if (s.length >= 9) ix.siren[s.slice(0, 9)] = p.id;
    });
    return ix;
  }
  function dansCrm(l, ix) {
    ix = ix || crmIndex();
    return (l.url && ix.url[cleProfil(l.url)]) || ix.nom[norm(l.nom) + '|' + norm(l.entreprise)] || (l.sir && l.sir.nom && ix.nom[norm(l.nom) + '|' + norm(l.sir.nom)]) || null;
  }
  function secteurDe(l) {
    var t = norm([l.poste, l.entreprise, l.sir && l.sir.nafLabel].join(' '));
    var S = window.bsLeads && window.bsLeads.SECTEURS;
    if (l.sir && l.sir.naf && S) { for (var i = 0; i < S.length; i++) for (var j = 0; j < S[i].metiers.length; j++) if (S[i].metiers[j].naf.indexOf(l.sir.naf) >= 0) return S[i].id; }
    var R = [['Immobilier', 'immobili immo syndic mandataire agent immobilier diagnostiqu'], ['Artisans / BTP', 'plomb chauffag electric menuis serrur macon batiment btp couvr peintre platr carrel paysag garage artisan renovation construct'],
      ['Santé & bien-être', 'dentis medecin kine osteo pharmac veterin coiff beaute esthetic spa sport fitness sante bien etre infirm podolog'],
      ['Commerce / e-commerce', 'restaura boulang patiss hotel fleur optic boutique commerce magasin e commerce ecommerce traiteur'],
      ['Services B2B', 'comptab avocat conseil consult assur nettoyage communication auto ecole informatique esn agence cabinet']];
    for (var k = 0; k < R.length; k++) if (R[k][1].split(' ').some(function (m) { return contient(t, m); })) return R[k][0];
    return 'Autre';
  }
  function ajouterAuCrm(l) {
    var ix = crmIndex(), dup = dansCrm(l, ix);
    if (dup && ix.stop[dup]) { l.statut = 'ecarte'; l.stop = 1; l.crmId = dup; return { id: dup, doublon: true, stop: true }; }
    if (dup) { l.statut = 'ajoute'; l.crmId = dup; return { id: dup, doublon: true }; }
    var v = verdict(l), d = auj(), id = uid(), s = l.sir || null;
    var msg = l.ia && l.ia.message ? l.ia.message.replace(/\{\{\s*prenom\s*\}\}/gi, prenomDe(l.nom)) : '';
    var notes = [
      'Lead LinkedIn (' + (SOURCES[l.source] || 'LinkedIn') + ') reçu le ' + new Date(l.recu || Date.now()).toLocaleDateString('fr-FR') + '.',
      l.poste ? 'Poste : ' + l.poste : '',
      l.lieu ? 'Lieu : ' + l.lieu : '',
      l.url ? 'Profil LinkedIn : ' + l.url : '',
      l.vu ? 'Vu sur : ' + l.vu : '',
      'Qualification : ' + v.score + '/100' + (l.ia ? ' (Claude) : ' + l.ia.raison : ' : ' + v.raisons.map(function (r) { return r[1]; }).join(', ')) + '.',
      s ? 'Entreprise : ' + s.nom + ' · SIREN ' + s.siren + (s.effectif ? ' · ' + s.effectif : '') + ' · https://annuaire-entreprises.data.gouv.fr/entreprise/' + s.siren : '',
      msg ? 'Invitation LinkedIn proposée : ' + msg : '',
      'RGPD : au premier message, dites d’où viennent ses coordonnées (LinkedIn) et proposez de ne plus le contacter s’il le souhaite.',
    ].filter(Boolean).join('\n');
    var p = {
      id: id, entreprise: (s && s.nom) || l.entreprise || l.nom, secteur: secteurDe(l), contact: l.nom, telephone: '', email: l.email || '',
      ville: (s && s.ville) || villeDe(l.lieu), adresse: (s && s.adresse) || '', siret: (s && (s.siret || s.siren)) || '', site: '', canal: CANAL,
      statut: 'a_appeler', priorite: v.categorie === 'qualifie' ? 'haute' : 'moyenne', tags: ['Lead LinkedIn'].concat(v.categorie === 'qualifie' ? ['Qualifié'] : []),
      notes: notes, dealValue: 0, mrrValue: 0, signedAt: null, resilieAt: null, prochaineRelance: d, prochaineRelanceHeure: '', createdAt: d, updatedAt: d, callLog: [],
      poste: l.poste, linkedin: l.url,
      events: [{ id: uid(), ts: new Date().toISOString(), date: d, time: heure(), type: 'create', text: 'Prospect créé depuis LinkedIn (' + (SOURCES[l.source] || 'LinkedIn') + ')' }],
    };
    window.__bsStore.set(function (st) { return { prospects: [p].concat(st.prospects || []) }; });
    l.statut = 'ajoute'; l.crmId = id;
    return { id: id, doublon: false };
  }

  // ================================================================== contacts d'un prospect
  // Depuis la fiche d'un prospect, « Trouver les décideurs » ouvre la recherche des personnes de cette entreprise sur
  // LinkedIn et retient pour quelle fiche on cherche (3 heures). Quand le bouton « Envoyer au CRM » renvoie la page,
  // les personnes de cette entreprise sont rangées d'elles-mêmes dans la fiche (prospect.contacts) ; les autres
  // restent proposées dans l'onglet LinkedIn. Le premier décideur devient le contact principal s'il n'y en a pas.
  var CLE_POUR = 'bs-linkedin-pour', POUR_MS = 3 * 3600e3, MAX_CONTACTS = 50;
  var FORMES = /^(sarl|sas|sasu|eurl|sa|sci|snc|selarl|selas|scp|scm|eirl|ei|ets|etablissements|societe|ste|groupe|holding|et|de|du|des|la|le|les|l|d|the)$/;
  function pour() { var x = lireJson(CLE_POUR, null); return x && x.id && Date.now() - (Number(x.at) || 0) < POUR_MS ? x : null; }
  function prospectDe(id) { var st = window.__bsStore ? window.__bsStore.get() : {}; return (st.prospects || []).filter(function (p) { return p.id === id; })[0] || null; }
  function motsEntreprise(s) { return norm(s).split(' ').filter(function (w) { return w.length > 1 && !FORMES.test(w); }).join(' '); }
  function memeEntreprise(a, b) {
    a = motsEntreprise(a); b = motsEntreprise(b);
    if (!a || !b) return false;
    return a === b || (a.length >= 4 && (' ' + b + ' ').indexOf(' ' + a + ' ') >= 0) || (b.length >= 4 && (' ' + a + ' ').indexOf(' ' + b + ' ') >= 0);
  }
  // Nom à chercher sur LinkedIn : sans forme juridique ni parenthèses (« BOULANGERIE MARTIN (SARL) » → « Boulangerie Martin »).
  function nomRecherche(s) {
    return String(s || '').replace(/\([^)]*\)/g, ' ').split(/\s+/).filter(function (w) { return w && !FORMES.test(norm(w)) || /^(de|du|des|la|le|les|et)$/i.test(w); }).join(' ')
      .replace(/^(de|du|des|la|le|les|et)\s+/i, '').trim().toLowerCase().replace(/(^|[\s'’-])(\p{L})/gu, function (m, a, b) { return a + b.toUpperCase(); });
  }
  function lienContacts(p, type) {
    var nom = nomRecherche(p.entreprise) || p.entreprise || '';
    var ville = String(p.ville || '').trim();
    if (type === 'google') return 'https://www.google.com/search?q=' + encodeURIComponent('site:linkedin.com/in "' + nom + '"' + (ville ? ' "' + ville + '"' : '')) + '&hl=fr&gl=fr';
    return 'https://www.linkedin.com/search/results/people/?keywords=' + encodeURIComponent('"' + nom + '"') + '&origin=GLOBAL_SEARCH_HEADER';
  }
  // 0 : décideur (gérant, fondateur…), 1 : cadre (directeur, responsable…), 2 : autre.
  var DECIDEURS = mots(POSTES), CADRES = mots(MOYENS);
  function rang(poste) { var t = norm(poste); return trouve(t, DECIDEURS) ? 0 : trouve(t, CADRES) ? 1 : 2; }
  function cleContact(c) { return cleProfil(c.linkedin || c.url) || 'n:' + norm(c.nom); }
  function contactsDe(p) { return Array.isArray(p && p.contacts) ? p.contacts.filter(function (c) { return c && c.nom; }) : []; }
  // Range des leads LinkedIn dans la fiche d'un prospect ; retourne le nombre de contacts nouveaux.
  function rangerContacts(pid, liste) {
    var p = prospectDe(pid); if (!p || !window.__bsStore) return 0;
    var vus = {};
    contactsDe(p).forEach(function (c) { vus[cleContact(c)] = 1; });
    var neufs = [];
    liste.forEach(function (l) {
      var c = { id: 'ct' + uid(), nom: l.nom, poste: l.poste || '', linkedin: l.url || '', email: l.email || '', lieu: l.lieu || '', source: 'LinkedIn', ajouteLe: auj() };
      var k = cleContact(c);
      if (!vus[k]) { vus[k] = 1; neufs.push(c); }
      l.statut = 'ajoute'; l.crmId = pid;
    });
    sauver();
    if (!neufs.length) return 0;
    var tous = contactsDe(p).concat(neufs).slice(0, MAX_CONTACTS);
    var principal = String(p.contact || '').trim(), patch = {};
    if (!principal) {
      var m = neufs.slice().sort(function (a, b) { return rang(a.poste) - rang(b.poste); })[0];
      patch = { contact: m.nom, poste: p.poste || m.poste, linkedin: p.linkedin || m.linkedin };
    } else {
      // Le contact principal est parmi les personnes trouvées : on complète son poste et son profil.
      var meme = neufs.filter(function (c) { return norm(c.nom) === norm(principal); })[0];
      if (meme) patch = { poste: p.poste || meme.poste, linkedin: p.linkedin || meme.linkedin };
    }
    var ev = { id: uid(), ts: new Date().toISOString(), date: auj(), time: heure(), type: 'note',
      text: pluriel(neufs.length, 'contact LinkedIn ajouté', 'contacts LinkedIn ajoutés') + ' : ' + neufs.map(function (c) { return c.nom + (c.poste ? ' (' + c.poste + ')' : ''); }).join(', ') };
    window.__bsStore.set(function (st) {
      return { prospects: (st.prospects || []).map(function (x) { return x.id === pid ? Object.assign({}, x, patch, { contacts: tous, updatedAt: auj(), events: [ev].concat(x.events || []).slice(0, 200) }) : x; }) };
    });
    return neufs.length;
  }
  function majContacts(pid, f) {
    window.__bsStore.set(function (st) { return { prospects: (st.prospects || []).map(function (x) { return x.id === pid ? Object.assign({}, x, f(x), { updatedAt: auj() }) : x; }) }; });
  }
  // Leads reçus par le bouton pendant une recherche « pour » un prospect : ceux de son entreprise vont dans sa fiche ;
  // les autres personnes de la page (entreprise illisible ou différente) sont proposées, pas rangées.
  function rattacher(r) {
    var x = pour(); if (!x) return null;
    var p = prospectDe(x.id); if (!p) return null;
    var lus = leads().filter(function (l) { return r.ids.indexOf(l.id) >= 0; });
    var cles = [p.entreprise, nomRecherche(p.entreprise)];
    var siens = lus.filter(function (l) { return cles.some(function (n) { return memeEntreprise(l.entreprise, n) || (l.sir && memeEntreprise(l.sir.nom, n)); }); });
    if (!lus.length) return null;
    var ajoutes = rangerContacts(p.id, siens);
    UI.pour = { id: p.id, entreprise: p.entreprise, ajoutes: siens.map(function (l) { return l.id; }), autres: lus.filter(function (l) { return siens.indexOf(l) < 0 && l.statut !== 'ajoute'; }).map(function (l) { return l.id; }) };
    return { ajoutes: ajoutes, entreprise: p.entreprise };
  }
  // Leads LinkedIn déjà reçus qui travaillent dans l'entreprise du prospect (pas encore rangés).
  function dejaRecus(p) {
    var cles = [p.entreprise, nomRecherche(p.entreprise)], vus = {};
    contactsDe(p).forEach(function (c) { vus[cleContact(c)] = 1; });
    return leads().filter(function (l) {
      return l.statut !== 'ecarte' && !(l.statut === 'ajoute' && l.crmId !== p.id) && !vus[cleContact({ nom: l.nom, linkedin: l.url })] &&
        cles.some(function (n) { return memeEntreprise(l.entreprise, n) || (l.sir && memeEntreprise(l.sir.nom, n)); });
    });
  }

  // Bloc « Contacts LinkedIn » de la fiche d'un prospect (monté par la fiche à chaque affichage).
  function contactsFiche(el, p) {
    if (!el || !p) return;
    ensureCss();
    el.setAttribute('data-pid', p.id);
    var cs = contactsDe(p).slice().sort(function (a, b) { return (norm(a.nom) === norm(p.contact) ? -1 : 0) - (norm(b.nom) === norm(p.contact) ? -1 : 0) || rang(a.poste) - rang(b.poste); });
    var recus = dejaRecus(p), attente = pour(), enCours = attente && attente.id === p.id;
    el.innerHTML = '<div class="p-section-title">Contacts LinkedIn' + (cs.length ? ' · ' + cs.length : '') + '</div>' +
      (cs.length ? '<ul class="bsli-ct-l">' + cs.map(function (c) {
        var princ = norm(c.nom) === norm(p.contact), ini = String(c.nom).split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase();
        return '<li class="bsli-ct' + (princ ? ' princ' : '') + '"><span class="bsli-ct-av">' + esc(ini) + '</span><div class="bsli-ct-t"><b>' + esc(c.nom) + (princ ? ' <span class="bsli-ct-badge">Principal</span>' : '') + '</b>' +
          (c.poste ? '<small>' + esc(c.poste) + '</small>' : '') + '</div><div class="bsli-ct-a">' +
          (c.linkedin ? '<a class="bsli-ct-b" href="' + esc(c.linkedin) + '" target="_blank" rel="noopener noreferrer" title="Profil LinkedIn" aria-label="Profil LinkedIn de ' + esc(c.nom) + '">' + LOGO.replace('width="18" height="18"', 'width="15" height="15"') + '</a>' : '') +
          (c.email ? '<button type="button" class="bsli-ct-b" data-ct-mail="' + esc(c.id) + '" title="Écrire un e-mail">' + ic('mail', 15) + '</button>' : '') +
          (princ ? '' : '<button type="button" class="bsli-ct-b" data-ct-princ="' + esc(c.id) + '" title="En faire le contact principal">' + ic('star', 15) + '</button>') +
          '<button type="button" class="bsli-ct-b" data-ct-suppr="' + esc(c.id) + '" title="Retirer ce contact">' + ic('x', 15) + '</button></div></li>';
      }).join('') + '</ul>' : '<p class="bsli-ct-vide">Trouvez le gérant, les dirigeants et les responsables de ' + esc(p.entreprise) + ' sur LinkedIn : ils arrivent ici, et le décideur devient le contact principal.</p>') +
      (recus.length ? '<div class="bsli-ct-recus">' + ic('user-search', 15) + '<span>' + pluriel(recus.length, 'personne', 'personnes') + ' de cette entreprise ' + (recus.length > 1 ? 'sont' : 'est') + ' déjà dans vos leads LinkedIn : ' +
        esc(recus.slice(0, 3).map(function (l) { return l.nom; }).join(', ')) + (recus.length > 3 ? '…' : '') + '</span><button type="button" class="btn btn-secondary btn-sm" data-ct-recus>Ajouter</button></div>' : '') +
      '<div class="bsli-ct-go"><a class="btn btn-sm bsli-in" href="' + esc(lienContacts(p, 'linkedin')) + '" target="_blank" rel="noopener noreferrer" data-ct-chercher="linkedin">' + LOGO.replace('width="18" height="18"', 'width="15" height="15"') + 'Trouver les décideurs sur LinkedIn</a>' +
      '<a class="btn btn-ghost btn-sm" href="' + esc(lienContacts(p, 'google')) + '" target="_blank" rel="noopener noreferrer" data-ct-chercher="google">' + ic('search', 14) + 'Via Google</a></div>' +
      (enCours ? '<p class="bsli-ct-aide on">' + ic('bookmark', 14) + '<span>Sur la page LinkedIn, cliquez sur votre favori <b>« Envoyer au CRM »</b> : les personnes de ' + esc(p.entreprise) + ' arrivent dans cette fiche. Page suivante, nouveau clic.</span></p>'
        : '<p class="bsli-ct-aide">' + ic('info', 14) + '<span>Il faut le bouton « Envoyer au CRM » dans vos favoris. <button type="button" class="bsli-ct-lien" data-ct-installer>L’installer</button></span></p>');
    if (el.__bsliCt) return;
    el.__bsliCt = true;
    el.addEventListener('click', function (ev) {
      var t = ev.target.closest('a,button'); if (!t || !el.contains(t)) return;
      var q = prospectDe(el.getAttribute('data-pid')); if (!q) return;
      var id;
      if (t.hasAttribute('data-ct-chercher')) { ecrireJson(CLE_POUR, { id: q.id, entreprise: q.entreprise, at: Date.now() }); setTimeout(function () { contactsFiche(el, prospectDe(q.id)); }, 0); return; }
      if (t.hasAttribute('data-ct-recus')) { var n = rangerContacts(q.id, dejaRecus(q)); toast(n ? pluriel(n, 'contact ajouté', 'contacts ajoutés') + ' à la fiche.' : 'Ces contacts sont déjà sur la fiche.'); redessiner(); return; }
      if (t.hasAttribute('data-ct-installer')) {
        ecrireJson(CLE_ONGLET, 'linkedin');
        if (window.__bsY) window.__bsY.set({ overlays: [] });
        location.hash = '#/leads';
        if (window.bsLeads && window.bsLeads.onglet) window.bsLeads.onglet('linkedin');
        return;
      }
      if ((id = t.getAttribute('data-ct-princ'))) {
        var c = contactsDe(q).filter(function (x) { return x.id === id; })[0]; if (!c) return;
        // Le poste et le profil suivent le contact principal ; l'e-mail de l'entreprise reste s'il y en a un.
        majContacts(q.id, function (x) { return { contact: c.nom, poste: c.poste || '', linkedin: c.linkedin || '', email: x.email || c.email || '' }; });
        toast(c.nom + ' est le contact principal.');
        return;
      }
      if ((id = t.getAttribute('data-ct-suppr'))) {
        majContacts(q.id, function (x) { return { contacts: contactsDe(x).filter(function (c) { return c.id !== id; }) }; });
        return;
      }
      if ((id = t.getAttribute('data-ct-mail'))) {
        var m = contactsDe(q).filter(function (x) { return x.id === id; })[0];
        if (m && window.bsMail && window.bsMail.composer) window.bsMail.composer({ a: m.email, sujet: '', texte: 'Bonjour ' + prenomDe(m.nom) + ',\n\n', prospectId: q.id });
      }
    });
  }

  // ================================================================== recherche toute prête
  function requete(c) {
    var postes = mots(c.postes).slice(0, 6), sects = String(c.secteurs || '').split(/[,;]/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 3);
    var ville = String(c.zone || '').split(',')[0].trim();
    var orq = function (l) { return l.length > 1 ? '(' + l.map(function (x) { return /\s/.test(x) ? '"' + x + '"' : x; }).join(' OR ') + ')' : l.map(function (x) { return /\s/.test(x) ? '"' + x + '"' : x; }).join(''); };
    var p = String(c.postes || '').split(/[,;]/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 5);
    return { postes: p, sects: sects, ville: ville, kw: [orq(p), orq(sects), ville].filter(Boolean).join(' '), brut: postes };
  }
  function lienRecherche(type, c) {
    var r = requete(c);
    if (type === 'google') {
      var g = 'site:linkedin.com/in ' + [r.postes.length ? '(' + r.postes.map(function (x) { return '"' + x + '"'; }).join(' OR ') + ')' : '', r.sects.length ? '(' + r.sects.map(function (x) { return '"' + x + '"'; }).join(' OR ') + ')' : '', r.ville ? '"' + r.ville + '"' : ''].filter(Boolean).join(' ');
      return 'https://www.google.com/search?q=' + encodeURIComponent(g) + '&hl=fr&gl=fr';
    }
    if (type === 'salesnav') {
      // Format des adresses Sales Navigator : query=(keywords:…), mots-clés encodés deux fois.
      var e1 = function (x) { return encodeURIComponent(x).replace(/[()'!*]/g, function (ch) { return '%' + ch.charCodeAt(0).toString(16).toUpperCase(); }); };
      return 'https://www.linkedin.com/sales/search/people?query=(spellCorrectionEnabled%3Atrue%2Ckeywords%3A' + e1(e1(r.kw)) + ')';
    }
    return 'https://www.linkedin.com/search/results/people/?keywords=' + encodeURIComponent(r.kw) + '&origin=GLOBAL_SEARCH_HEADER';
  }

  // ================================================================== page
  var UI = { filtre: 'qualifie', vus: PAR_PAGE, root: null, cibleOuverte: false, msg: null, aideOuverte: '', garde: {} };
  function redessiner() { if (UI.root && UI.root.isConnected && UI.dessiner) UI.dessiner(); }
  function nombres(liste) {
    var n = { nouveaux: 0, qualifie: 0, a_verifier: 0, hors_cible: 0, ajoute: 0, ecarte: 0, tous: 0 }, lot = lireJson(CLE_LOT, '');
    liste.forEach(function (l) {
      if (l.statut === 'ajoute') { n.ajoute++; return; }
      if (l.statut === 'ecarte') { n.ecarte++; return; }
      n.tous++;
      n[verdict(l).categorie]++;
      if (lot && l.recu === lot) n.nouveaux++;
    });
    return n;
  }
  // UI.garde : leads ajoutés ou écartés depuis l'ouverture du filtre ; ils restent à leur place jusqu'au changement de filtre.
  function filtrer(liste, f) {
    var lot = lireJson(CLE_LOT, '');
    return liste.filter(function (l) {
      if (f === 'ajoute' || f === 'ecarte') return l.statut === f;
      if (l.statut && !UI.garde[l.id]) return false;
      if (f === 'tous') return true;
      if (f === 'nouveaux') return lot && l.recu === lot;
      return verdict(l).categorie === f;
    }).sort(function (a, b) { return f === 'ajoute' || f === 'ecarte' ? 0 : verdict(b).score - verdict(a).score; });
  }
  var CATS = { qualifie: ['Qualifié', 'green'], a_verifier: ['À vérifier', 'amber'], hors_cible: ['Hors cible', 'gray'] };

  function monter(root) {
    if (!root || root.getAttribute('data-bsli')) return;
    root.setAttribute('data-bsli', '1');
    ensureCss();
    UI.root = root;
    etatIA();
    noterTout();

    function carte(l) {
      var v = verdict(l), cat = CATS[v.categorie], ini = String(l.nom).split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase();
      var lot = lireJson(CLE_LOT, ''), s = l.sir, msg = l.ia && l.ia.message ? l.ia.message.replace(/\{\{\s*prenom\s*\}\}/gi, prenomDe(l.nom)) : '';
      var h = 0; String(l.nom).split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) % 360; });
      var ix = crmIndex(), crm = l.statut === 'ajoute' ? (l.crmId || dansCrm(l, ix)) : dansCrm(l, ix), stop = l.stop || (crm && ix.stop[crm]);
      return '<article class="card bsli-card' + (l.statut === 'ajoute' ? ' added' : '') + (l.statut === 'ecarte' ? ' gone' : '') + '" data-id="' + esc(l.id) + '">' +
        '<div class="bsli-top"><span class="bsli-av" style="--h:' + h + '">' + esc(ini || '?') + '</span><div class="bsli-tt"><h3>' + esc(l.nom) +
        (lot && l.recu === lot && !l.statut ? ' <span class="bsl-chip blue">Nouveau</span>' : '') + '</h3>' +
        '<p>' + esc(l.poste || 'Poste non indiqué') + '</p></div>' +
        '<span class="bsli-score ' + cat[1] + '" title="' + (v.ia ? 'Note de Claude' : 'Note du CRM') + '"><b>' + v.score + '</b><small>' + cat[0] + '</small></span></div>' +
        '<ul class="bsl-facts">' +
        (l.entreprise || s ? '<li>' + ic('briefcase', 14) + '<span>' + esc((s && s.nom) || l.entreprise) + (s ? ' <em>· ' + esc([s.effectif, s.ville].filter(Boolean).join(' · ')) + '</em>' : '') + '</span></li>' : '') +
        (l.lieu ? '<li>' + ic('map-pin', 14) + '<span>' + esc(l.lieu) + '</span></li>' : '') +
        (l.email ? '<li>' + ic('mail', 14) + '<span>' + esc(l.email) + '</span></li>' : '') +
        '<li class="muted">' + ic('user-search', 14) + '<span>' + esc(SOURCES[l.source] || 'LinkedIn') + ' · ' + esc(new Date(l.recu).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })) + '</span></li>' +
        '</ul>' +
        '<div class="bsli-why">' + (v.ia ? '<p class="bsli-ia">' + ic('sparkles', 13) + '<span>' + esc(v.ia.raison) + '</span></p>' : '') +
        v.raisons.slice(0, 4).map(function (r) { return '<span class="bsli-r ' + r[0] + '">' + esc(r[1]) + '</span>'; }).join('') + '</div>' +
        (msg && !l.statut ? '<div class="bsli-msg"><span>' + esc(msg) + '</span><button type="button" class="btn btn-ghost btn-sm" data-li-copier="' + esc(l.id) + '">' + ic('files', 14) + 'Copier</button></div>' : '') +
        '<div class="bsl-act">' +
        (l.url ? '<a class="btn btn-ghost btn-sm" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer" data-li-profil="' + esc(l.id) + '">' + ic('external-link', 14) + 'Profil</a>' : '') +
        (l.statut === 'ajoute' ? '<span class="bsl-ok">' + ic('check', 15) + 'Dans le CRM</span><button type="button" class="btn btn-ghost btn-sm" data-li-ouvrir="' + esc(l.id) + '">Ouvrir la fiche</button>'
          : stop ? '<span class="bsl-ok muted">' + ic('ban', 15) + 'A demandé à ne plus être contacté</span><button type="button" class="btn btn-ghost btn-sm" data-li-ouvrir="' + esc(l.id) + '">Ouvrir la fiche</button>'
          : l.statut === 'ecarte' ? '<span class="bsl-ok muted">Écarté</span><button type="button" class="btn btn-ghost btn-sm" data-li-annuler="' + esc(l.id) + '">Annuler</button>'
          : crm ? '<span class="bsl-ok muted">' + ic('check', 15) + 'Déjà dans votre CRM</span><button type="button" class="btn btn-ghost btn-sm" data-li-ouvrir="' + esc(l.id) + '">Ouvrir la fiche</button>'
          : '<button type="button" class="btn btn-primary btn-sm" data-li-ajouter="' + esc(l.id) + '">' + ic('plus', 15) + 'Ajouter au CRM</button><button type="button" class="btn btn-ghost btn-sm" data-li-ecarter="' + esc(l.id) + '">Écarter</button>') +
        '</div></article>';
    }

    // Haut (critères, bouton, autres façons) et bas (leads) sont dessinés à part : modifier un critère ne redessine
    // que la liste, sans faire perdre la saisie en cours.
    function dessinerHaut() {
      var c = cible(), mobile = window.matchMedia && window.matchMedia('(max-width: 760px)').matches;
      var champ = function (nom, label, val, ph) { return '<label class="field"><span class="field-label">' + label + '</span><input class="input" name="li-' + nom + '" value="' + esc(val) + '" placeholder="' + esc(ph) + '" autocomplete="off"></label>'; };
      root.querySelector('.bsli-haut').innerHTML =
        '<div class="bsli-etape"><span class="bsli-num">1</span><div><h2>Cherchez vos clients idéaux sur LinkedIn</h2><p>Ces critères servent aussi à noter chaque lead.</p></div></div>' +
        '<div class="bsli-grid">' + champ('postes', 'Postes visés', c.postes, 'gérant, fondateur, dirigeant…') + champ('secteurs', 'Métiers ou secteurs', c.secteurs, 'plombier, plomberie…') + champ('zone', 'Zone', c.zone, 'Lyon, Villeurbanne… (vide : toute la France)') + '</div>' +
        (UI.cibleOuverte ? '<div class="bsli-grid one">' + champ('exclure', 'À écarter', c.exclure, 'étudiant, stagiaire…') + '</div>' : '') +
        '<div class="bsli-go">' +
        '<a class="btn btn-primary bsli-in" data-li-lien="linkedin" href="' + esc(lienRecherche('linkedin', c)) + '" target="_blank" rel="noopener noreferrer">' + LOGO + 'Chercher sur LinkedIn</a>' +
        '<a class="btn btn-secondary" data-li-lien="salesnav" href="' + esc(lienRecherche('salesnav', c)) + '" target="_blank" rel="noopener noreferrer">Sales Navigator</a>' +
        '<a class="btn btn-secondary" data-li-lien="google" href="' + esc(lienRecherche('google', c)) + '" target="_blank" rel="noopener noreferrer">' + ic('search', 15) + 'Google</a>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-li-act="cible">' + (UI.cibleOuverte ? 'Moins de critères' : 'Exclusions') + '</button>' +
        '</div>' +
        '<div class="bsli-etape"><span class="bsli-num">2</span><div><h2>Envoyez les personnes affichées au CRM</h2>' +
        '<p>' + (mobile ? 'Le bouton s’utilise sur ordinateur. Sur téléphone, importez vos relations ou collez une page (ci-dessous).' : 'Glissez ce bouton dans la barre de favoris de votre navigateur (Ctrl+Maj+B pour l’afficher). Ensuite, sur LinkedIn, cliquez dessus : les personnes de la page arrivent ici, notées.') + '</p></div></div>' +
        '<div class="bsli-bouton-l"><a class="bsli-bouton" href="' + esc(lienBouton()) + '" draggable="true" data-li-favori title="Glissez-moi dans la barre de favoris">' + LOGO + 'Envoyer au CRM</a>' +
        '<span class="bsli-pages">Marche sur : recherche de personnes · profil · page « Personnes » d’une entreprise · Sales Navigator · vos relations · recherche Google de profils.</span></div>' +
        (function () {
          var j = rythme(), trop = j.pages >= 25;
          return '<p class="bsli-rythme' + (trop ? ' trop' : '') + '" data-li-rythme>' + ic(trop ? 'triangle-alert' : 'hourglass', 14) + '<span>' +
            (j.pages ? 'Aujourd’hui : ' + pluriel(j.pages, 'page lue', 'pages lues') + ', ' + pluriel(j.personnes, 'personne') + '. ' : '') +
            (trop ? 'C’est beaucoup pour une journée : faites une pause, LinkedIn surveille les comptes trop rapides. ' : '') +
            'Repères LinkedIn : environ 80 profils ouverts par jour, 100 invitations par semaine, 300 recherches par mois sur un compte gratuit.</span></p>';
        })() +
        '<div class="bsli-autres">' +
        '<button type="button" class="bsli-aide-t" data-li-aide="coller" aria-expanded="' + (UI.aideOuverte === 'coller') + '">' + ic('clipboard-list', 15) + 'Coller une page LinkedIn</button>' +
        '<button type="button" class="bsli-aide-t" data-li-aide="export" aria-expanded="' + (UI.aideOuverte === 'export') + '">' + ic('upload', 15) + 'Importer mes relations LinkedIn</button>' +
        '<button type="button" class="bsli-aide-t" data-li-aide="favori" aria-expanded="' + (UI.aideOuverte === 'favori') + '">' + ic('info', 15) + 'Le bouton ne s’installe pas ?</button>' +
        '</div>' +
        (UI.aideOuverte === 'coller' ? '<div class="bsli-aide"><p>Sur LinkedIn : Ctrl+A puis Ctrl+C (Cmd sur Mac) sur une page de résultats. Ici : cliquez dans la zone puis Ctrl+V.</p><div class="bsli-coller" contenteditable="true" role="textbox" aria-label="Coller une page LinkedIn" data-li-coller tabindex="0">Cliquez ici puis collez (Ctrl+V)</div></div>' : '') +
        (UI.aideOuverte === 'export' ? '<div class="bsli-aide"><p>Vos relations, avec leur poste et leur entreprise, depuis la copie officielle de vos données LinkedIn : Moi › Préférences › Confidentialité des données › Obtenir une copie de vos données › cochez « Relations » › Demander l’archive. LinkedIn l’envoie par e-mail, souvent en quelques minutes. Choisissez ensuite le fichier .zip ou Connections.csv.</p><label class="btn btn-secondary btn-sm bsli-fichier">' + ic('upload', 15) + 'Choisir le fichier<input type="file" accept=".csv,.zip,text/csv,application/zip" data-li-fichier hidden></label>' +
          '<a class="bsli-lien" href="https://www.linkedin.com/mypreferences/d/download-my-data" target="_blank" rel="noopener noreferrer">Ouvrir la page de LinkedIn</a></div>' : '') +
        (UI.aideOuverte === 'favori' ? '<div class="bsli-aide"><p>Affichez la barre de favoris (Ctrl+Maj+B, ou Cmd+Maj+B sur Mac), puis faites glisser le bouton violet dessus. Si le glisser ne marche pas : copiez le code ci-dessous, créez un favori (Ctrl+D), nommez-le « Envoyer au CRM » et collez le code à la place de l’adresse. Le bouton marche sur Chrome, Edge, Brave et Firefox ; Safari le bloque sur LinkedIn : utilisez alors « Coller une page » ou l’import de vos relations.</p><button type="button" class="btn btn-secondary btn-sm" data-li-act="code">' + ic('files', 15) + 'Copier le code du bouton</button></div>' : '') +
        (UI.msg ? '<div class="bsl-msg' + (UI.msg.k === 'bad' ? ' bad' : '') + '" role="status">' + ic(UI.msg.k === 'bad' ? 'triangle-alert' : 'check', 16) + '<span>' + esc(UI.msg.t) + '</span></div>' : '');
    }
    function majLiens() {
      var c = {};
      ['postes', 'secteurs', 'zone', 'exclure'].forEach(function (k) { var i = root.querySelector('[name="li-' + k + '"]'); if (i) c[k] = i.value; });
      c = Object.assign(cible(), c);
      Array.prototype.forEach.call(root.querySelectorAll('[data-li-lien]'), function (a) { a.href = lienRecherche(a.getAttribute('data-li-lien'), c); });
    }
    function dessinerBas() {
      var liste = leads(), n = nombres(liste), f = UI.filtre;
      if (f === 'nouveaux' && !n.nouveaux && !Object.keys(UI.garde).length) f = UI.filtre = n.qualifie ? 'qualifie' : 'tous';
      var vue = filtrer(liste, f);
      var aQualifierIA = filtrer(liste, f === 'ajoute' || f === 'ecarte' ? 'tous' : f).filter(function (l) { return !l.ia; });
      var ajoutables = filtrer(liste, 'qualifie').filter(function (l) { return !dansCrm(l); });
      var filtres = [['nouveaux', 'Derniers reçus'], ['qualifie', 'Qualifiés'], ['a_verifier', 'À vérifier'], ['hors_cible', 'Hors cible'], ['tous', 'Tous à trier'], ['ajoute', 'Ajoutés'], ['ecarte', 'Écartés']]
        .filter(function (x) { return x[0] !== 'nouveaux' || n.nouveaux || f === 'nouveaux'; });
      root.querySelector('.bsli-bas').innerHTML =
        '<div class="bsli-etape bare"><span class="bsli-num">3</span><div><h2>Triez vos leads LinkedIn</h2><p>' + (n.tous + n.ajoute + n.ecarte ? pluriel(n.tous, 'lead à trier', 'leads à trier') + ' · ' + pluriel(n.qualifie, 'qualifié') + ' · ' + pluriel(n.ajoute, 'ajouté') + ' au CRM' : 'Aucun lead pour l’instant.') + '</p></div></div>' +
        (liste.length ? '<div class="bsli-filtres" role="tablist">' + filtres.map(function (x) { return '<button type="button" role="tab" aria-selected="' + (f === x[0]) + '" class="bsl-sect' + (f === x[0] ? ' on' : '') + '" data-li-filtre="' + x[0] + '">' + x[1] + ' <b>' + (x[0] === 'tous' ? n.tous : n[x[0]]) + '</b></button>'; }).join('') + '</div>' : '') +
        (liste.length ? '<div class="bsli-bar">' +
          (IA.etat === true ? '<button type="button" class="btn btn-secondary btn-sm" data-li-act="ia"' + (IA.enCours || !aQualifierIA.length ? ' disabled' : '') + '>' + (IA.enCours ? '<span class="bsl-spin"></span>Claude qualifie…' : ic('sparkles', 15) + 'Qualifier avec Claude' + (aQualifierIA.length ? ' (' + Math.min(aQualifierIA.length, 100) + ')' : '')) + '</button>' : '') +
          (ajoutables.length ? '<button type="button" class="btn btn-primary btn-sm" data-li-act="tout">' + ic('plus', 15) + 'Ajouter les qualifiés (' + ajoutables.length + ')</button>' : '') +
          (SIRENE.actif ? '<span class="bsli-attente"><span class="bsl-spin"></span>Vérification des entreprises…</span>' : '') +
          '<button type="button" class="btn btn-ghost btn-sm bsli-vider" data-li-act="vider">Vider la liste</button></div>' : '') +
        (IA.msg ? '<div class="bsl-msg bad" role="alert">' + ic('triangle-alert', 16) + '<span>' + esc(IA.msg) + '</span></div>' : '') +
        (vue.length ? '<div class="bsl-list">' + vue.slice(0, UI.vus).map(carte).join('') + '</div>' + (vue.length > UI.vus ? '<div class="bsl-more"><button type="button" class="btn btn-secondary" data-li-act="plus">Afficher plus (' + (vue.length - UI.vus) + ')</button></div>' : '')
          : '<div class="card bsl-empty">' + LOGO.replace('width="18" height="18"', 'width="28" height="28"') + '<h2>' + (liste.length ? 'Rien dans cette liste' : 'Vos leads LinkedIn arriveront ici') + '</h2><p>' + (liste.length ? 'Choisissez un autre filtre.' : 'Lancez une recherche sur LinkedIn, puis cliquez sur le bouton « Envoyer au CRM » dans vos favoris. Chaque personne est notée selon vos critères.') + '</p></div>');
      verifier(vue.slice(0, UI.vus));
    }
    // Contacts reçus pour la fiche d'un prospect : ceux rangés dans la fiche, et les autres personnes de la page.
    function dessinerPour() {
      var z = root.querySelector('.bsli-pour'), x = UI.pour, p = x && prospectDe(x.id);
      if (!z) return;
      if (!p) { z.innerHTML = ''; z.hidden = true; return; }
      var tous = leads(), parId = function (id) { return tous.filter(function (l) { return l.id === id; })[0]; };
      var autres = x.autres.map(parId).filter(function (l) { return l && l.statut !== 'ajoute' && l.statut !== 'ecarte'; });
      var cs = contactsDe(p);
      z.hidden = false;
      z.innerHTML = '<div class="bsli-pour-t">' + ic('building', 18) + '<div><h2>Contacts de ' + esc(p.entreprise) + '</h2><p>' +
        (cs.length ? pluriel(cs.length, 'contact', 'contacts') + ' sur la fiche' + (p.contact ? ' · principal : ' + esc(p.contact) : '') + '.' : 'Personne de cette entreprise sur cette page.') +
        ' Page suivante sur LinkedIn, puis nouveau clic sur « Envoyer au CRM » pour en trouver d’autres.</p></div></div>' +
        (autres.length ? '<p class="bsli-pour-s">Autres personnes de la page, à ajouter si elles travaillent chez ' + esc(p.entreprise) + ' :</p><ul class="bsli-pour-l">' + autres.slice(0, 20).map(function (l) {
          return '<li><div><b>' + esc(l.nom) + '</b><small>' + esc([l.poste, l.entreprise].filter(Boolean).join(' · ') || 'Poste non indiqué') + '</small></div><button type="button" class="btn btn-secondary btn-sm" data-pour-ajouter="' + esc(l.id) + '">' + ic('plus', 14) + 'Ajouter à la fiche</button></li>';
        }).join('') + '</ul>' : '') +
        '<div class="bsli-pour-a"><button type="button" class="btn btn-primary btn-sm" data-pour-ouvrir>' + ic('external-link', 14) + 'Ouvrir la fiche</button><button type="button" class="btn btn-ghost btn-sm" data-pour-fin>Terminé</button></div>';
    }
    function dessiner() { dessinerPour(); dessinerHaut(); dessinerBas(); }
    root.innerHTML = '<section class="card bsli-pour" hidden></section><section class="card bsli-etapes bsli-haut"></section><section class="bsli-liste-s bsli-bas"></section>' +
      '<p class="bsl-note">' + ic('shield-check', 14) + '<span>Le CRM lit seulement les pages LinkedIn que vous ouvrez vous-même, une à une : pas de robot qui parcourt LinkedIn à votre place (LinkedIn bloque les comptes qui en utilisent). Soyons francs : les conditions de LinkedIn interdisent les outils qui copient ses pages. Le bouton reste une copie à la demande, sur votre compte et à votre rythme ; l’import de vos relations est la voie la plus sûre. Les leads non ajoutés au CRM sont effacés d’ici au bout de 30 jours. RGPD : votre message doit concerner leur métier ; au premier contact, dites que vous avez trouvé leur profil sur LinkedIn et retirez la personne de vos listes si elle le demande. Avec Claude, seuls le poste, l’entreprise et le lieu sont envoyés, jamais le nom.</span></p>';
    UI.dessiner = function () { dessinerPour(); dessinerBas(); };

    function trouver(id) { return leads().filter(function (l) { return l.id === id; })[0]; }
    function ouvrir(id) { if (window.__bsY && id) window.__bsY.set(function (s) { return { overlays: (s.overlays || []).concat([{ key: 'bsli' + Date.now(), type: 'prospect', id: id }]) }; }); }
    function copier(t) {
      if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).then(function () { return true; }, function () { return false; });
      return Promise.resolve(false);
    }
    function dire(k, t) { UI.msg = { k: k, t: t }; dessinerHaut(); }

    root.addEventListener('click', function (ev) {
      var el = ev.target.closest('a, button');
      if (!el || !root.contains(el)) return;
      var id;
      if ((id = el.getAttribute('data-pour-ajouter'))) { var pa = trouver(id); if (pa && UI.pour) { rangerContacts(UI.pour.id, [pa]); toast(pa.nom + ' ajouté à la fiche.'); dessinerPour(); dessinerBas(); } return; }
      if (el.hasAttribute('data-pour-ouvrir')) { if (UI.pour) ouvrir(UI.pour.id); return; }
      if (el.hasAttribute('data-pour-fin')) { UI.pour = null; try { localStorage.removeItem(CLE_POUR); } catch (e) { /* facultatif */ } dessinerPour(); return; }
      if (el.hasAttribute('data-li-favori')) { ev.preventDefault(); dire('ok', 'Ne cliquez pas ici : faites glisser ce bouton dans votre barre de favoris, puis cliquez dessus quand vous êtes sur LinkedIn.'); return; }
      if ((id = el.getAttribute('data-li-ajouter'))) { var l = trouver(id); if (l) { UI.garde[id] = 1; var r = ajouterAuCrm(l); sauver(); toast(r.stop ? 'Cette personne a demandé à ne plus être contactée : lead écarté.' : r.doublon ? 'Déjà dans votre CRM.' : l.nom + ' ajouté au CRM.', r.stop ? 'error' : 'success'); dessinerBas(); } return; }
      if ((id = el.getAttribute('data-li-ecarter'))) { var e = trouver(id); if (e) { UI.garde[id] = 1; e.statut = 'ecarte'; sauver(); dessinerBas(); } return; }
      if ((id = el.getAttribute('data-li-annuler'))) { var a = trouver(id); if (a) { a.statut = ''; sauver(); dessinerBas(); } return; }
      if ((id = el.getAttribute('data-li-ouvrir'))) { var o = trouver(id); if (o) ouvrir(o.crmId || dansCrm(o)); return; }
      if ((id = el.getAttribute('data-li-copier'))) {
        var m = trouver(id);
        if (m && m.ia) copier(m.ia.message.replace(/\{\{\s*prenom\s*\}\}/gi, prenomDe(m.nom))).then(function (ok) { toast(ok ? 'Invitation copiée : collez-la sur LinkedIn.' : 'Copie impossible : sélectionnez le texte.', ok ? 'success' : 'error'); });
        return;
      }
      if ((id = el.getAttribute('data-li-profil'))) {
        var pr = trouver(id);
        if (pr && pr.ia && pr.ia.message && !pr.statut) copier(pr.ia.message.replace(/\{\{\s*prenom\s*\}\}/gi, prenomDe(pr.nom)));
        return;
      }
      var f = el.getAttribute('data-li-filtre');
      if (f) { UI.filtre = f; UI.vus = PAR_PAGE; UI.garde = {}; dessinerBas(); return; }
      var aide = el.getAttribute('data-li-aide');
      if (aide) { UI.aideOuverte = UI.aideOuverte === aide ? '' : aide; UI.msg = null; dessinerHaut(); return; }
      var act = el.getAttribute('data-li-act');
      if (act === 'cible') { UI.cibleOuverte = !UI.cibleOuverte; dessinerHaut(); }
      else if (act === 'plus') { UI.vus += PAR_PAGE; dessinerBas(); }
      else if (act === 'ia') qualifierIA(filtrer(leads(), UI.filtre === 'ajoute' || UI.filtre === 'ecarte' ? 'tous' : UI.filtre).filter(function (x) { return !x.ia; }));
      else if (act === 'tout') {
        var q = filtrer(leads(), 'qualifie').filter(function (x) { return !dansCrm(x); });
        q.forEach(function (x) { ajouterAuCrm(x); UI.garde[x.id] = 1; });
        sauver(); toast(pluriel(q.length, 'lead qualifié ajouté', 'leads qualifiés ajoutés') + ' au CRM.'); UI.filtre = 'ajoute'; dessinerBas();
      } else if (act === 'vider') {
        var nb = leads().filter(function (x) { return !x.statut; }).length;
        if (!window.confirm('Retirer les ' + nb + ' leads LinkedIn pas encore ajoutés au CRM ? Ceux déjà ajoutés restent dans le CRM.')) return;
        LEADS = []; sauver(); ecrireJson(CLE_LOT, ''); dessinerBas();
      } else if (act === 'code') {
        copier(lienBouton()).then(function (ok) { dire(ok ? 'ok' : 'bad', ok ? 'Code copié : créez un favori et collez-le à la place de l’adresse.' : 'Copie impossible dans ce navigateur : faites glisser le bouton.'); });
      }
    });
    function lireCible() {
      var c = {};
      ['postes', 'secteurs', 'zone', 'exclure'].forEach(function (k) { var i = root.querySelector('[name="li-' + k + '"]'); if (i) c[k] = i.value.trim(); });
      ecrireJson(CLE_CIBLE, Object.assign(lireJson(CLE_CIBLE, {}) || {}, c));
      noterTout();
    }
    root.addEventListener('change', function (ev) {
      var t = ev.target;
      if (t && /^li-/.test(t.name || '')) { lireCible(); majLiens(); dessinerBas(); }
      if (t && t.hasAttribute && t.hasAttribute('data-li-fichier')) {
        var fic = t.files && t.files[0];
        dire('ok', 'Lecture du fichier…');
        importerFichier(fic).then(function (r) {
          if (!r) return;
          noterTout(); UI.filtre = r.nouveaux ? 'nouveaux' : UI.filtre; dessinerBas();
          dire('ok', pluriel(r.nouveaux, 'relation importée', 'relations importées') + (r.connus ? ' (' + r.connus + ' déjà là)' : '') + '. Elles sont notées selon vos critères.');
        }, function (e) { dire('bad', (e && e.message) || 'Fichier illisible.'); });
      }
    });
    root.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' && ev.target && /^li-/.test(ev.target.name || '')) { ev.preventDefault(); lireCible(); majLiens(); dessinerBas(); }
    });
    root.addEventListener('input', function (ev) { if (ev.target && /^li-/.test(ev.target.name || '')) majLiens(); });
    root.addEventListener('paste', function (ev) {
      var z = ev.target && ev.target.closest && ev.target.closest('[data-li-coller]');
      if (!z) return;
      ev.preventDefault();
      var dt = ev.clipboardData, html = dt ? dt.getData('text/html') : '', txt = dt ? dt.getData('text/plain') : '';
      var r = null;
      try {
        if (/^\s*BSLI1:/.test(txt)) r = recevoirCode(txt.trim());
        else {
          var res = { leads: [], page: 'collage' };
          if (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var src = (html.match(/<!--\s*SourceURL:\s*(\S+)/i) || [])[1] || (/linkedin\.com\/sales\//.test(html) ? 'https://www.linkedin.com/sales/search/people' : 'https://www.linkedin.com/search/results/people/');
            res = extraire(doc, src);
          }
          if (!res.leads.length && txt) {
            // Texte seul : des adresses de profils.
            res.leads = (txt.match(/https?:\/\/[a-z.]*linkedin\.com\/in\/[^\s/?#"']+/gi) || []).map(function (u) {
              var s = u.split('/in/')[1]; try { s = decodeURIComponent(s); } catch (e) { /* tel quel */ }
              return { nom: s.replace(/-[0-9a-f]{6,}$/i, '').replace(/-\d+$/, '').split('-').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' '), poste: '', entreprise: '', lieu: '', url: u };
            });
          }
          r = fusionner(res.leads, 'collage', (html.match(/<!--\s*SourceURL:\s*(https:\/\/[^\s?#>]+)/i) || [])[1]);
        }
      } catch (e) { r = null; }
      noterTout();
      if (r && r.nouveaux) UI.filtre = 'nouveaux';
      dessinerBas();
      if (!r) dire('bad', 'Rien de lisible dans ce qui a été collé.');
      else if (!r.nouveaux && !r.connus) dire('bad', 'Aucune personne trouvée dans ce qui a été collé : copiez une page de résultats LinkedIn (Ctrl+A puis Ctrl+C).');
      else { dire('ok', pluriel(r.nouveaux, 'lead ajouté', 'leads ajoutés') + ' à trier' + (r.connus ? ' (' + r.connus + ' déjà là)' : '') + '.'); }
    });
    root.addEventListener('focusin', function (ev) { var z = ev.target.closest && ev.target.closest('[data-li-coller]'); if (z && /Cliquez ici/.test(z.textContent)) z.textContent = ''; });
    dessiner();
  }

  // ------------------------------------------------------------------ styles
  var CSS = [
    '.bsli-rythme{display:flex;gap:8px;align-items:flex-start;margin:10px 0 0;font-size:12.5px;color:var(--text-3);line-height:1.45}',
    '.bsli-rythme svg{flex:none;margin-top:2px}',
    '.bsli-rythme.trop{color:var(--warn,#b45309)}',
    '.bsli-root{display:flex;flex-direction:column;gap:16px;min-width:0}',
    '.bsli-etapes{padding:18px;display:flex;flex-direction:column;gap:14px}',
    '.bsli-etape{display:flex;gap:12px;align-items:flex-start}',
    '.bsli-etape h2{margin:0;font-size:1em;font-weight:700}',
    '.bsli-etape p{margin:2px 0 0;font-size:.86em;color:var(--text-3);max-width:720px}',
    '.bsli-etape+.bsli-grid{margin-top:-2px}',
    '.bsli-num{flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:.8em;background:var(--accent);color:#fff}',
    '.bsli-grid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1.2fr) minmax(0,1fr);gap:12px}',
    '.bsli-grid.one{grid-template-columns:1fr}',
    '.bsli-go{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding-bottom:6px;border-bottom:1px solid var(--border)}',
    '.bsli-go .btn{gap:8px}',
    '.bsli-in{background:#0a66c2;border-color:#0a66c2;color:#fff}',
    '.bsli-in:hover{background:#004182;border-color:#004182}',
    '.bsli-bouton-l{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-left:38px}',
    '.bsli-bouton{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px;border-radius:999px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff!important;font-weight:700;text-decoration:none;box-shadow:0 6px 18px rgb(99 102 241/.35);cursor:grab;user-select:none}',
    '.bsli-bouton:active{cursor:grabbing}',
    '.bsli-pages{font-size:.8em;color:var(--text-3);flex:1;min-width:220px}',
    '.bsli-autres{display:flex;flex-wrap:wrap;gap:6px 16px;padding-left:38px}',
    '.bsli-aide-t{display:inline-flex;align-items:center;gap:6px;border:0;background:none;padding:4px 0;color:var(--text-2);font-weight:600;font-size:.86em;cursor:pointer}',
    '.bsli-aide-t:hover,.bsli-aide-t[aria-expanded=true]{color:var(--accent-text,var(--accent))}',
    '.bsli-aide{margin-left:38px;padding:12px 14px;border-radius:12px;background:var(--surface-2);border:1px solid var(--border);display:flex;flex-direction:column;gap:10px;align-items:flex-start;font-size:.88em;color:var(--text-2)}',
    '.bsli-aide p{margin:0;line-height:1.5}',
    '.bsli-coller{width:100%;min-height:70px;max-height:140px;overflow:auto;padding:12px;border:2px dashed var(--border);border-radius:10px;color:var(--text-3);background:var(--surface);outline:none}',
    '.bsli-coller:focus{border-color:var(--accent);color:var(--text)}',
    '.bsli-fichier{cursor:pointer;gap:6px}',
    '.bsli-lien{font-size:.92em;color:var(--text-2)}',
    '.bsli-liste-s{display:flex;flex-direction:column;gap:12px;min-width:0}',
    '.bsli-etape.bare{padding:0 2px}',
    '.bsli-filtres{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:2px}',
    '.bsli-filtres::-webkit-scrollbar{display:none}',
    '.bsli-filtres b{font-weight:700;opacity:.7;margin-left:2px}',
    '.bsli-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
    '.bsli-vider{margin-left:auto}',
    '.bsli-attente{display:inline-flex;align-items:center;gap:6px;font-size:.82em;color:var(--text-3)}',
    '.bsli-card{padding:16px;display:flex;flex-direction:column;gap:12px;min-width:0;transition:opacity .2s,border-color .2s}',
    '.bsli-card.added{border-color:rgb(16 185 129/.55)}',
    '.bsli-card.gone{opacity:.5}',
    '.bsli-top{display:flex;gap:12px;align-items:flex-start;min-width:0}',
    '.bsli-av{flex:none;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:.85em;color:#fff;background:linear-gradient(135deg,hsl(var(--h) 65% 50%),hsl(calc(var(--h) + 40) 65% 40%))}',
    '.bsli-tt{min-width:0;flex:1}',
    '.bsli-tt h3{margin:0;font-size:1em;font-weight:700;line-height:1.3;overflow-wrap:anywhere;display:flex;align-items:center;gap:6px;flex-wrap:wrap}',
    '.bsli-tt p{margin:2px 0 0;font-size:.84em;color:var(--text-2);overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
    '.bsli-score{flex:none;display:flex;flex-direction:column;align-items:center;min-width:64px;padding:5px 8px;border-radius:12px;line-height:1.1}',
    '.bsli-score b{font-size:1.15em;font-weight:800}',
    '.bsli-score small{font-size:.68em;font-weight:700;white-space:nowrap}',
    '.bsli-score.green{background:rgb(16 185 129/.13);color:#047857}',
    '.bsli-score.amber{background:rgb(245 158 11/.15);color:#b45309}',
    '.bsli-score.gray{background:var(--surface-2);color:var(--text-3)}',
    '[data-scheme=dark] .bsli-score.green{color:#34d399}[data-scheme=dark] .bsli-score.amber{color:#fbbf24}',
    '.bsli-why{display:flex;flex-wrap:wrap;gap:5px}',
    '.bsli-r{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:999px;font-size:.74em;font-weight:600;background:var(--surface-2);color:var(--text-2)}',
    '.bsli-r.ok{background:rgb(16 185 129/.1);color:#047857}.bsli-r.ko{background:rgb(244 63 94/.08);color:#be123c}.bsli-r.moy{background:rgb(245 158 11/.12);color:#b45309}',
    '[data-scheme=dark] .bsli-r.ok{color:#34d399}[data-scheme=dark] .bsli-r.ko{color:#fda4af}[data-scheme=dark] .bsli-r.moy{color:#fbbf24}',
    '.bsli-ia{flex-basis:100%;display:flex;gap:6px;align-items:flex-start;margin:0 0 2px;font-size:.84em;color:var(--text-2)}',
    '.bsli-ia svg{flex:none;margin-top:2px;color:#8b5cf6}',
    '.bsli-msg{display:flex;gap:8px;align-items:flex-start;padding:10px 12px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);font-size:.84em;color:var(--text-2)}',
    '.bsli-msg span{flex:1;min-width:0;overflow-wrap:anywhere}',
    '@media (max-width:900px){.bsli-grid{grid-template-columns:1fr 1fr}.bsli-grid>:last-child{grid-column:1/-1}}',
    '@media (max-width:560px){.bsli-grid{grid-template-columns:1fr}.bsli-etapes{padding:14px}.bsli-bouton-l,.bsli-autres{padding-left:0}.bsli-aide{margin-left:0}.bsli-go .btn{flex:1 1 auto;justify-content:center}}',
    '.bsli-pour{padding:16px 18px;display:flex;flex-direction:column;gap:10px;border-color:rgb(10 102 194/.5);box-shadow:0 0 0 3px rgb(10 102 194/.12)}',
    '.bsli-pour[hidden]{display:none}',
    '.bsli-pour-t{display:flex;gap:12px;align-items:flex-start}.bsli-pour-t>svg{flex:none;color:#0a66c2;margin-top:2px}',
    '.bsli-pour-t h2{margin:0;font-size:1em;font-weight:700}.bsli-pour-t p{margin:2px 0 0;font-size:.86em;color:var(--text-3)}',
    '.bsli-pour-s{margin:0;font-size:.84em;color:var(--text-2)}',
    '.bsli-pour-l{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}',
    '.bsli-pour-l li{display:flex;align-items:center;gap:10px;justify-content:space-between;padding:8px 10px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border)}',
    '.bsli-pour-l li div{display:flex;flex-direction:column;min-width:0}.bsli-pour-l b{font-size:.9em}.bsli-pour-l small{font-size:.78em;color:var(--text-3)}',
    '.bsli-pour-a{display:flex;gap:8px;flex-wrap:wrap}',
    '.bsli-ct-l{list-style:none;margin:0 0 10px;padding:0;display:flex;flex-direction:column;gap:6px}',
    '.bsli-ct{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;border:1px solid var(--border);background:var(--surface-2)}',
    '.bsli-ct.princ{border-color:rgb(10 102 194/.45)}',
    '.bsli-ct-av{flex:none;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font-size:.72em;font-weight:800;color:#fff;background:#0a66c2}',
    '.bsli-ct-t{flex:1;min-width:0;display:flex;flex-direction:column}',
    '.bsli-ct-t b{font-size:.9em;display:flex;align-items:center;gap:6px;flex-wrap:wrap}.bsli-ct-t small{font-size:.78em;color:var(--text-3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.bsli-ct-badge{padding:1px 7px;border-radius:999px;background:rgb(10 102 194/.14);color:#0a66c2;font-size:.72em;font-weight:700}',
    '[data-scheme=dark] .bsli-ct-badge{color:#7cb7f0}',
    '.bsli-ct-a{display:flex;gap:2px;flex:none}',
    '.bsli-ct-b{width:30px;height:30px;display:grid;place-items:center;border-radius:8px;border:0;background:none;color:var(--text-3);cursor:pointer}',
    '.bsli-ct-b:hover{background:var(--surface);color:var(--text)}a.bsli-ct-b{color:#0a66c2}',
    '.bsli-ct-vide{margin:0 0 10px;font-size:.86em;color:var(--text-3);line-height:1.45}',
    '.bsli-ct-recus{display:flex;align-items:center;gap:8px;margin:0 0 10px;padding:8px 10px;border-radius:10px;background:rgb(10 102 194/.08);font-size:.84em;color:var(--text-2)}',
    '.bsli-ct-recus span{flex:1;min-width:0}.bsli-ct-recus svg{flex:none;color:#0a66c2}',
    '.bsli-ct-go{display:flex;gap:8px;flex-wrap:wrap}.bsli-ct-go .btn{gap:6px}',
    '.bsli-ct-aide{display:flex;gap:6px;align-items:flex-start;margin:8px 0 0;font-size:.8em;color:var(--text-3);line-height:1.45}.bsli-ct-aide svg{flex:none;margin-top:2px}',
    '.bsli-ct-aide.on{color:var(--text-2)}.bsli-ct-aide.on svg{color:#0a66c2}',
    '.bsli-ct-lien{padding:0;border:0;background:none;color:var(--accent-text,var(--accent));font:inherit;font-weight:600;cursor:pointer;text-decoration:underline}',
  ].join('\n');
  function ensureCss() {
    if (document.getElementById('bs-linkedin-css')) return;
    var s = document.createElement('style'); s.id = 'bs-linkedin-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  arrivee();
  window.addEventListener('hashchange', arrivee);
  // Un autre onglet du CRM a reçu ou trié des leads : on relit la liste.
  window.addEventListener('storage', function (e) { if (e.key === CLE_LEADS || e.key === null) { LEADS = null; NOTES = {}; redessiner(); } });

  window.bsLinkedin = {
    monter: monter, extraire: extraire, codeBouton: codeBouton, lienRecherche: lienRecherche, contactsFiche: contactsFiche, lienContacts: lienContacts,
    _interne: { rattacher: rattacher, rangerContacts: rangerContacts, memeEntreprise: memeEntreprise, nomRecherche: nomRecherche, leads: leads, fusionner: fusionner, recevoirCode: recevoirCode, lireRelations: lireRelations, depuisZip: depuisZip, noter: noter, cible: cible, ajouterAuCrm: ajouterAuCrm, villeDe: villeDe, envoi: envoi },
  };
})();
