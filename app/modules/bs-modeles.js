/* Blackstart CRM : Marketing › « Modèles » (bibliothèque de messages).
 *
 * Modèles d'email, de SMS, de message LinkedIn ou WhatsApp et de script d'appel, avec les variables
 * {{prenom}}, {{entreprise}}… Une dizaine de modèles pensés pour l'agence sont ajoutés à la première visite
 * (identifiants fixes, donc jamais en double dans l'équipe). « Utiliser » : on choisit un prospect, le texte
 * se remplit, puis on l'envoie (Mail du CRM, messagerie, SMS, WhatsApp, LinkedIn) ou on le copie ; l'envoi
 * préparé est noté sur la fiche du prospect.
 */
(function () {
  'use strict';
  if (window.bsModeles || !window.bsMarketing) return;
  var M = window.bsMarketing, esc = M.esc;

  var TYPES = { email: ['Email', 'tone-blue'], sms: ['SMS', 'tone-emerald'], linkedin: ['LinkedIn', 'tone-sky'], whatsapp: ['WhatsApp', 'tone-cyan'], appel: ['Script d’appel', 'tone-violet'] };
  var DEFAUTS = [
    { id: 'mdl-premier-mail', type: 'email', titre: 'Premier mail de prospection', sujet: '{{entreprise}} : une question rapide',
      texte: 'Bonjour {{prenom}},\n\nJe m’occupe de la prospection et du suivi client pour des entreprises du secteur {{secteur}}.\n\nSouvent, les demandes arrivent par téléphone, par mail, par le site… et une partie se perd. Nous mettons en place un CRM simple, adapté à votre métier, et nous vous apportons de nouveaux clients chaque mois.\n\nAuriez-vous 15 minutes cette semaine pour voir si cela peut servir à {{entreprise}} ?\n\nBien à vous,\n{{moi}}\n{{agence}}' },
    { id: 'mdl-relance-j3', type: 'email', titre: 'Relance à J+3', sujet: 'Re : {{entreprise}} : une question rapide',
      texte: 'Bonjour {{prenom}},\n\nJe remonte mon message de la semaine, il a pu se perdre.\n\nEn 15 minutes, je vous montre comment d’autres entreprises comme {{entreprise}} ne laissent plus passer une demande et relancent au bon moment.\n\nMardi ou jeudi, qu’est-ce qui vous arrange le mieux ?\n\n{{moi}}' },
    { id: 'mdl-apres-appel', type: 'email', titre: 'Après un appel', sujet: 'Suite à notre appel : {{entreprise}}',
      texte: 'Bonjour {{prenom}},\n\nMerci pour votre temps au téléphone tout à l’heure.\n\nComme convenu, voici en deux mots ce que nous ferions pour {{entreprise}} :\n- un CRM simple pour suivre chaque demande et chaque devis ;\n- des relances automatiques pour ne plus perdre de clients ;\n- de nouveaux contacts qualifiés chaque mois dans votre secteur.\n\nJe vous propose de faire le point lors d’un audit gratuit de 20 minutes. Quel créneau vous convient ?\n\nBien à vous,\n{{moi}}' },
    { id: 'mdl-apres-audit', type: 'email', titre: 'Compte rendu après l’audit', sujet: '{{entreprise}} : le compte rendu de notre audit',
      texte: 'Bonjour {{prenom}},\n\nMerci pour l’échange d’aujourd’hui. Voici ce que je retiens pour {{entreprise}} :\n\n1. Ce qui fonctionne déjà : …\n2. Ce qui vous fait perdre des clients : …\n3. Ce que nous proposons : …\n\nVous recevrez la proposition détaillée d’ici demain. N’hésitez pas à me poser vos questions d’ici là.\n\nBien à vous,\n{{moi}}' },
    { id: 'mdl-relance-devis', type: 'email', titre: 'Relance du devis', sujet: 'Votre proposition {{entreprise}}',
      texte: 'Bonjour {{prenom}},\n\nAvez-vous pu regarder la proposition que je vous ai envoyée ?\n\nSi un point vous retient (le prix, le délai, le démarrage), dites-le-moi simplement : on peut l’ajuster.\n\nJe peux aussi vous rappeler 10 minutes pour en parler. Quel moment vous arrange ?\n\n{{moi}}' },
    { id: 'mdl-invitation-linkedin', type: 'linkedin', titre: 'Invitation LinkedIn', sujet: '',
      texte: 'Bonjour {{prenom}}, j’accompagne des entreprises du secteur {{secteur}} pour trouver de nouveaux clients et mieux suivre leurs demandes. Je serais ravi d’échanger avec vous. {{moi}}' },
    { id: 'mdl-message-linkedin', type: 'linkedin', titre: 'Message après l’invitation acceptée', sujet: '',
      texte: 'Merci pour l’invitation, {{prenom}} !\n\nPar curiosité : aujourd’hui, comment {{entreprise}} suit ses demandes de clients et ses devis ? Fichier Excel, carnet, logiciel ?\n\nJe pose la question parce que c’est souvent là que se perdent les ventes. Si le sujet vous parle, je vous montre en 15 minutes ce que nous faisons pour d’autres entreprises de votre secteur.' },
    { id: 'mdl-sms-rappel-rdv', type: 'sms', titre: 'Rappel de rendez-vous', sujet: '',
      texte: 'Bonjour {{prenom}}, c’est {{moi}} de {{agence}}. Je vous confirme notre rendez-vous de demain. À bientôt !' },
    { id: 'mdl-sms-injoignable', type: 'sms', titre: 'Après un appel sans réponse', sujet: '',
      texte: 'Bonjour {{prenom}}, {{moi}} de {{agence}}. J’ai essayé de vous joindre au sujet de {{entreprise}}. Quel moment vous arrange pour un appel de 10 minutes ?' },
    { id: 'mdl-avis-google', type: 'whatsapp', titre: 'Demande d’avis Google', sujet: '',
      texte: 'Bonjour {{prenom}}, merci encore pour votre confiance ! Si vous êtes satisfait de notre travail pour {{entreprise}}, un avis Google nous aiderait beaucoup (2 minutes) : [lien de votre fiche Google]. Merci ! {{moi}}' },
    { id: 'mdl-parrainage', type: 'email', titre: 'Parrainage', sujet: 'Une petite faveur, {{prenom}} ?',
      texte: 'Bonjour {{prenom}},\n\nJe suis ravi que notre collaboration fonctionne bien pour {{entreprise}}.\n\nConnaissez-vous un chef d’entreprise de votre entourage qui perd du temps avec ses demandes de clients ou qui cherche de nouveaux clients ? Si vous me mettez en relation et qu’il signe, je vous offre un mois d’abonnement.\n\nUn simple nom et un numéro suffisent.\n\nMerci d’avance,\n{{moi}}' },
    { id: 'mdl-script-premier-appel', type: 'appel', titre: 'Script : premier appel', sujet: '',
      texte: '1. Accroche : « Bonjour {{prenom}}, {{moi}} de {{agence}}. Je vous appelle parce que j’accompagne des entreprises du secteur {{secteur}} à {{ville}}. Vous avez deux minutes ? »\n\n2. Question : « Aujourd’hui, comment gérez-vous les demandes qui arrivent quand vous êtes sur un chantier ou en rendez-vous ? »\n\n3. Écoute, puis reformulation du problème.\n\n4. Proposition : « Je vous propose un audit gratuit de 20 minutes : je vous montre où vous perdez des clients et comment les récupérer. Mardi 10 h ou jeudi 14 h ? »\n\n5. Objections : pas le temps → « justement, 20 minutes pour en gagner plusieurs heures par semaine » ; envoyez une documentation → « avec plaisir, et on cale 15 minutes pour la regarder ensemble ? »' }
  ];

  var S = { filtre: 'tous', edition: null, brouillon: null, utiliser: null, prospectId: '', texte: null, sujet: null, msg: null, ia: null, redaction: false, recherche: '' };

  function modeles() { return M.actifs(M.data().modeles); }
  function modele(id) { return M.data().modeles.filter(function (m) { return m.id === id; })[0] || null; }
  function initialiser() {
    var d = M.data();
    if (d.reglages.modelesInities || !window.__bsStore) return;
    var deja = {}; d.modeles.forEach(function (m) { deja[m.id] = 1; });
    var neufs = DEFAUTS.filter(function (m) { return !deja[m.id]; }).map(function (m) { return Object.assign({ defaut: true }, m); });
    if (neufs.length) M.majListe('modeles', function (l) { return l.concat(neufs); });
    M.majReglages({ modelesInities: true });
  }

  function apercu(t) { var l = String(t || '').split('\n').filter(function (x) { return x.trim(); }); return l.slice(0, 3).join(' · ').slice(0, 200); }
  function carteEdition(b) {
    return '<div class="bsmk-grid" style="margin-top:4px"><label>Type<select class="input select" data-b="type">' + Object.keys(TYPES).map(function (k) { return '<option value="' + k + '"' + (b.type === k ? ' selected' : '') + '>' + TYPES[k][0] + '</option>'; }).join('') + '</select></label>' +
      '<label>Titre<input class="input" data-b="titre" value="' + esc(b.titre) + '"></label></div>' +
      (b.type === 'email' ? '<label class="bsmk-l" style="margin-top:10px">Objet<input class="input" data-b="sujet" value="' + esc(b.sujet) + '"></label>' : '') +
      '<label class="bsmk-l" style="margin-top:10px">Texte<textarea class="input bsmk-area" data-b="texte" rows="10">' + esc(b.texte) + '</textarea></label>' +
      '<small class="bsmk-vide">' + String(b.texte || '').length + ' caractères' + (b.type === 'linkedin' ? ' (invitation LinkedIn : 300 au plus)' : b.type === 'sms' ? ' (un SMS : 160)' : '') + '</small>' +
      '<div style="margin-top:8px">' + M.boutonsVariables() + '</div>' +
      '<div class="bsmk-act" style="margin-top:12px"><button type="button" class="btn btn-primary" data-act="enregistrer">Enregistrer</button><button type="button" class="btn btn-ghost" data-act="annuler">Annuler</button>' +
      (S.ia && S.ia.ia ? '<button type="button" class="btn btn-secondary" data-act="ia"' + (S.redaction ? ' disabled' : '') + '>' + (S.redaction ? 'Claude écrit…' : 'Rédiger avec Claude') + '</button>' : '') +
      (modele(b.id) ? '<button type="button" class="btn btn-ghost" data-act="supprimer">Supprimer</button>' : '') + '</div>';
  }
  function carteUtiliser(m) {
    var liste = M.prospects().slice().sort(function (a, b) { return String(a.entreprise || a.contact).localeCompare(String(b.entreprise || b.contact), 'fr'); });
    var p = M.prospect(S.prospectId);
    if (S.texte === null) { S.texte = M.remplir(m.texte, p); S.sujet = M.remplir(m.sujet, p); }
    var tel = M.telDe(p), h = '<div class="bsmk-sep"></div><div class="bsmk-grid"><label>Pour quel prospect ?<select class="input select" name="prospect"><option value="">Choisir un prospect…</option>' +
      liste.slice(0, 2000).map(function (x) { return '<option value="' + esc(x.id) + '"' + (p && p.id === x.id ? ' selected' : '') + '>' + esc((x.entreprise || x.contact) + (x.ville ? ' · ' + x.ville : '') + (M.bloque(x) ? ' (ne plus contacter)' : '')) + '</option>'; }).join('') + '</select></label></div>';
    if (p && M.bloque(p)) h += '<div class="bsmk-msg warn" style="margin-top:10px">Ce prospect a demandé à ne plus être contacté.</div>';
    if (m.type === 'email') h += '<label class="bsmk-l" style="margin-top:10px">Objet<input class="input" name="u-sujet" value="' + esc(S.sujet) + '"></label>';
    h += '<label class="bsmk-l" style="margin-top:10px">Texte prêt à envoyer<textarea class="input bsmk-area" name="u-texte" rows="9">' + esc(S.texte) + '</textarea></label><div class="bsmk-act" style="margin-top:10px">';
    var b = function (act, txt, prim, off) { return '<button type="button" class="btn ' + (prim ? 'btn-primary' : 'btn-secondary') + '" data-u="' + act + '"' + (off ? ' disabled' : '') + '>' + txt + '</button>'; };
    if (m.type === 'email') {
      if (M.serveur && window.bsMail) h += b('mail', 'Écrire le mail dans le CRM', true, !p || !p.email);
      h += b('mailto', 'Ouvrir dans ma messagerie', !(M.serveur && window.bsMail), !p || !p.email);
    }
    if (m.type === 'sms') h += b('sms', 'Envoyer par SMS', true, !tel);
    if (m.type === 'whatsapp') h += b('whatsapp', 'Ouvrir WhatsApp', true, !tel);
    if (m.type === 'linkedin') h += b('linkedin', 'Copier et ouvrir LinkedIn', true, !p);
    if (m.type === 'appel') h += b('appel', tel ? 'Appeler ' + esc(tel) : 'Pas de numéro', true, !tel);
    h += b('copier', 'Copier', false, false) + '<button type="button" class="btn btn-ghost" data-u="fermer">Fermer</button>';
    if (p && (m.type === 'email' && !p.email)) h += '<small>Pas d’email sur la fiche de ce prospect.</small>';
    if (p && /sms|whatsapp|appel/.test(m.type) && !tel) h += '<small>Pas de numéro sur la fiche de ce prospect.</small>';
    return h + '</div>';
  }
  function rendre(el) {
    var l = modeles(), q = S.recherche.trim().toLowerCase();
    var compte = {}; l.forEach(function (m) { compte[m.type] = (compte[m.type] || 0) + 1; });
    var vis = l.filter(function (m) { return (S.filtre === 'tous' || m.type === S.filtre) && (!q || (m.titre + ' ' + m.texte).toLowerCase().indexOf(q) >= 0); });
    var h = M.tete('Modèles', 'Vos messages prêts à l’emploi : choisissez un prospect, le texte se remplit tout seul.', '<button type="button" class="btn btn-primary" data-act="nouveau">Nouveau modèle</button>') + M.message(S.msg);
    if (S.edition === 'nouveau') h += '<section class="card bsmk-card"><header class="card-head"><div><h3 class="card-title">Nouveau modèle</h3></div></header>' + carteEdition(S.brouillon) + '</section>';
    h += '<div class="bsmk-act" style="justify-content:space-between"><div class="bsmk-tabs">' + [['tous', 'Tous', l.length]].concat(Object.keys(TYPES).map(function (k) { return [k, TYPES[k][0], compte[k] || 0]; })).map(function (t) {
      return '<button type="button" class="bsmk-tab' + (S.filtre === t[0] ? ' on' : '') + '" data-filtre="' + t[0] + '">' + esc(t[1]) + ' (' + t[2] + ')</button>';
    }).join('') + '</div><input class="input" type="search" name="recherche" placeholder="Rechercher un modèle" value="' + esc(S.recherche) + '" style="max-width:240px"></div>';
    if (!vis.length) h += '<p class="bsmk-vide">Aucun modèle ici pour le moment.</p>';
    h += vis.map(function (m) {
      var t = TYPES[m.type] || TYPES.email;
      var corps = S.edition === m.id ? carteEdition(S.brouillon)
        : '<p class="bsmk-txt">' + (m.sujet ? '<b>' + esc(m.sujet) + '</b><br>' : '') + esc(apercu(m.texte)) + '</p>' +
          (S.utiliser === m.id ? carteUtiliser(m) : '<div class="bsmk-act" style="margin-top:12px"><button type="button" class="btn btn-primary btn-sm" data-utiliser="' + esc(m.id) + '">Utiliser</button><button type="button" class="btn btn-ghost btn-sm" data-modifier="' + esc(m.id) + '">Modifier</button></div>');
      return '<section class="card bsmk-card" data-id="' + esc(m.id) + '"><header class="card-head"><div style="min-width:0"><h3 class="card-title">' + esc(m.titre) + ' <span class="badge ' + t[1] + '">' + t[0] + '</span></h3></div></header>' + corps + '</section>';
    }).join('');
    el.innerHTML = h;
  }
  function noterEnvoi(m, p, quoi) { if (p) M.noter(p.id, m.type === 'appel' ? 'note' : m.type === 'email' ? 'email' : 'note', quoi + ' (modèle « ' + m.titre + ' »)'); }
  function brancher(el, dessiner) {
    el.addEventListener('input', function (ev) {
      var t = ev.target, k = t.getAttribute('data-b');
      if (k && S.brouillon) S.brouillon[k] = t.value;
      if (t.name === 'u-texte') S.texte = t.value;
      if (t.name === 'u-sujet') S.sujet = t.value;
      if (t.name === 'recherche') { S.recherche = t.value; clearTimeout(S.tr); S.tr = setTimeout(function () { var pos = t.selectionStart; dessiner(true); var n = el.querySelector('input[name=recherche]'); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) { /* champ de recherche */ } } }, 250); }
    });
    el.addEventListener('change', function (ev) {
      var t = ev.target;
      if (t.getAttribute('data-b') === 'type' && S.brouillon) { S.brouillon.type = t.value; dessiner(true); }
      if (t.name === 'prospect') { S.prospectId = t.value; S.texte = null; S.sujet = null; dessiner(true); }
    });
    el.addEventListener('click', function (ev) {
      var t = ev.target.closest('button'); if (!t || !el.contains(t)) return;
      var a = t.getAttribute('data-act');
      if (t.hasAttribute('data-filtre')) { S.filtre = t.getAttribute('data-filtre'); dessiner(true); return; }
      if (a === 'nouveau') { S.edition = 'nouveau'; S.utiliser = null; S.brouillon = { id: 'mdl-' + M.uid(), type: S.filtre !== 'tous' ? S.filtre : 'email', titre: '', sujet: '', texte: 'Bonjour {{prenom}},\n\n\n\n{{moi}}' }; S.msg = null; dessiner(true); window.scrollTo(0, 0); return; }
      if (t.hasAttribute('data-modifier')) { var m0 = modele(t.getAttribute('data-modifier')); S.edition = m0.id; S.utiliser = null; S.brouillon = JSON.parse(JSON.stringify(m0)); S.msg = null; dessiner(true); return; }
      if (t.hasAttribute('data-utiliser')) { S.utiliser = t.getAttribute('data-utiliser'); S.edition = null; S.texte = null; S.sujet = null; dessiner(true); return; }
      if (a === 'annuler') { S.edition = null; S.brouillon = null; dessiner(true); return; }
      if (a === 'enregistrer') {
        var b = S.brouillon;
        if (!String(b.titre || '').trim() || !String(b.texte || '').trim()) { S.msg = { k: 'err', t: 'Donnez un titre et un texte au modèle.' }; dessiner(true); return; }
        var champs = { type: b.type, titre: String(b.titre).trim(), sujet: b.type === 'email' ? String(b.sujet || '') : '', texte: String(b.texte) };
        if (modele(b.id)) M.majElement('modeles', b.id, champs);
        else M.majListe('modeles', function (l) { return [Object.assign({ id: b.id, creeLe: new Date().toISOString() }, champs)].concat(l); });
        S.edition = null; S.brouillon = null; S.msg = { k: 'ok', t: 'Modèle enregistré.' }; dessiner(true); return;
      }
      if (a === 'supprimer') { if (!window.confirm('Supprimer ce modèle ?')) return; M.majElement('modeles', S.brouillon.id, { supprime: true }); S.edition = null; S.brouillon = null; dessiner(true); return; }
      if (a === 'ia') {
        var br = S.brouillon; S.redaction = true; dessiner(true);
        var consigne = M.contexteAgence() + '\nÉcris un modèle de ' + (TYPES[br.type] || TYPES.email)[0] + ' : « ' + (br.titre || 'message de prospection') + ' ».' +
          (br.texte && br.texte.replace(/[{}\s]|prenom|moi|Bonjour/g, '').length > 20 ? '\nAméliore ce brouillon :\n' + br.texte : '') +
          '\nUtilise les variables {{prenom}}, {{entreprise}}, {{secteur}}, {{ville}}, {{moi}}, {{agence}} quand c’est utile. Vouvoiement, ton direct et chaleureux.' +
          (br.type === 'linkedin' ? ' 300 caractères au plus.' : br.type === 'sms' ? ' 160 caractères au plus.' : br.type === 'email' ? ' Réponds avec la première ligne « Objet : … », une ligne vide, puis le message.' : '');
        M.rediger(br.type === 'appel' ? 'email' : br.type === 'whatsapp' ? 'sms' : br.type, consigne).then(function (txt) {
          var m = /^\s*objet\s*:\s*(.+)\n+([\s\S]*)$/i.exec(txt);
          if (m && br.type === 'email') { br.sujet = m[1].trim(); br.texte = m[2].trim(); } else br.texte = txt.trim();
          S.redaction = false; dessiner(true);
        }, function (e) { S.redaction = false; S.msg = { k: 'err', t: e.message }; dessiner(true); });
        return;
      }
      var u = t.getAttribute('data-u'); if (!u) return;
      var mod = modele(S.utiliser), p = M.prospect(S.prospectId), txt = S.texte || '', tel = M.telDe(p);
      if (u === 'fermer') { S.utiliser = null; dessiner(true); return; }
      if (u === 'copier') { M.copier((mod.type === 'email' && S.sujet ? 'Objet : ' + S.sujet + '\n\n' : '') + txt).then(function (ok) { S.msg = { k: ok ? 'ok' : 'warn', t: ok ? 'Texte copié.' : 'Copie impossible : sélectionnez le texte et copiez-le.' }; dessiner(true); }); return; }
      if (u === 'mail') { window.bsMail.composer({ a: p.email, sujet: S.sujet, texte: txt, prospectId: p.id }); return; }
      if (u === 'mailto') { window.location.href = 'mailto:' + encodeURIComponent(p.email) + '?subject=' + encodeURIComponent(S.sujet || '') + '&body=' + encodeURIComponent(txt); noterEnvoi(mod, p, 'Email préparé'); return; }
      if (u === 'sms') { window.location.href = 'sms:' + tel.replace(/[^\d+]/g, '') + (/iPhone|iPad|Mac/.test(navigator.userAgent) ? '&' : '?') + 'body=' + encodeURIComponent(txt); noterEnvoi(mod, p, 'SMS préparé'); return; }
      if (u === 'whatsapp') { window.open('https://wa.me/' + M.international(tel) + '?text=' + encodeURIComponent(txt), '_blank', 'noopener'); noterEnvoi(mod, p, 'Message WhatsApp préparé'); return; }
      if (u === 'linkedin') {
        M.copier(txt).then(function () {
          // Lead venu de LinkedIn : son profil ; sinon une recherche par nom et entreprise.
          var profil = /^https:\/\/www\.linkedin\.com\/(in|sales\/lead)\/[^\s"'<>]+$/.test(p.linkedin || '') ? p.linkedin : '';
          window.open(profil || 'https://www.linkedin.com/search/results/people/?keywords=' + encodeURIComponent(((p.contact || '') + ' ' + (p.entreprise || '')).trim()), '_blank', 'noopener');
          noterEnvoi(mod, p, 'Message LinkedIn préparé'); S.msg = { k: 'ok', t: 'Message copié : collez-le dans LinkedIn (Ctrl + V).' }; dessiner(true);
        });
        return;
      }
      if (u === 'appel') { var a2 = document.createElement('a'); a2.href = 'tel:' + tel.replace(/[^\d+]/g, ''); document.body.appendChild(a2); a2.click(); a2.remove(); }
    });
  }

  var P = M.page(rendre, brancher);
  function monter(el) {
    initialiser();
    M.iaEtat(function (e) { S.ia = e; P.dessiner(); });
    P.monter(el);
  }
  window.bsModeles = { monter: monter, DEFAUTS: DEFAUTS };
})();
