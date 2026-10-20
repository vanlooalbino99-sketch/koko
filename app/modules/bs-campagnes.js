/* Blackstart CRM : Marketing › « Campagnes » (séquences de mails de prospection).
 *
 * Une campagne = un segment de prospects (statut, secteur, ville, source, étiquette) + 1 à 4 mails espacés
 * (J+0, J+3, J+7…) écrits avec des variables ({{prenom}}, {{entreprise}}…). Chaque jour, la page liste les
 * mails à envoyer et les envoie un par un depuis la boîte mail du membre (rubrique Mail, /api/mail/envoyer),
 * avec une pause entre deux envois et un plafond par jour. Chaque mail envoyé est noté sur la fiche.
 * Un prospect sort de la séquence quand son statut change, quand il est marqué « a répondu » ou
 * « ne plus contacter ». Une ligne de désinscription est ajoutée en bas des mails (modifiable).
 */
(function () {
  'use strict';
  if (window.bsCampagnes || !window.bsMarketing) return;
  var M = window.bsMarketing, esc = M.esc;

  var OPTOUT = 'Si vous ne souhaitez plus recevoir mes messages, répondez simplement STOP.';
  var PAUSE = 2500;
  var CLE_COMPTE = 'bs-campagnes-compte';
  var MAX_ETAPES = 4;
  var FINS = { repondu: 'A répondu', stop: 'Ne plus contacter', retire: 'Retiré de la campagne', termine: 'Séquence terminée' };
  var MODELE = [
    { delai: 0, sujet: '{{entreprise}} : une question rapide', texte: 'Bonjour {{prenom}},\n\nJe travaille avec des entreprises du secteur {{secteur}} et je vois souvent la même chose : des demandes de clients qui se perdent entre le téléphone, les mails et les carnets.\n\nChez {{agence}}, nous mettons en place un CRM simple, adapté à votre métier, et nous vous apportons de nouveaux clients chaque mois.\n\nSeriez-vous ouvert à un échange de 15 minutes cette semaine pour voir si cela peut aider {{entreprise}} ?\n\nBien à vous,\n{{moi}}' },
    { delai: 3, sujet: 'Re : {{entreprise}} : une question rapide', texte: 'Bonjour {{prenom}},\n\nJe me permets de remonter mon message, il a pu se perdre.\n\nEn 15 minutes, je peux vous montrer comment d’autres entreprises comme {{entreprise}} suivent chaque demande et relancent au bon moment, sans y passer leurs soirées.\n\nMardi ou jeudi, quel moment vous arrangerait ?\n\n{{moi}}' },
    { delai: 7, sujet: 'Je ferme le dossier ?', texte: 'Bonjour {{prenom}},\n\nSans retour de votre part, je suppose que ce n’est pas le bon moment : je ne vous relancerai plus après ce message.\n\nSi la question des nouveaux clients ou du suivi de vos demandes revient sur la table, il vous suffit de répondre à ce mail.\n\nBelle journée,\n{{moi}}' }
  ];

  var S = { vue: 'liste', brouillon: null, comptes: null, compteErr: null, compte: lireCompte(), envoi: null, msg: null, apercu: '', ia: null, redaction: -1 };
  function lireCompte() { try { return localStorage.getItem(CLE_COMPTE) || ''; } catch (e) { return ''; } }
  function ecrireCompte(v) { try { localStorage.setItem(CLE_COMPTE, v); } catch (e) { /* stockage indisponible */ } }

  // ---------------------------------------------------------------- règles
  function campagnes() { return M.actifs(M.data().campagnes); }
  function campagne(id) { return M.data().campagnes.filter(function (c) { return c.id === id; })[0] || null; }
  function emailOk(e) { return /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/.test(String(e || '').trim()); }
  function egal(a, b) { return String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase(); }
  function correspond(f, p) {
    f = f || {};
    if (f.statut && p.statut !== f.statut) return false;
    if (f.secteur && !egal(p.secteur, f.secteur)) return false;
    if (f.ville && !egal(p.ville, f.ville)) return false;
    if (f.canal && !egal(p.canal, f.canal)) return false;
    if (f.tag && !(p.tags || []).some(function (t) { return egal(t, f.tag); })) return false;
    return true;
  }
  // État d'un inscrit : { actif, raison } (actif = recevra encore des mails).
  function etatInscrit(c, ins) {
    var p = M.prospect(ins.id);
    if (!p) return { actif: false, raison: 'Prospect supprimé' };
    if (ins.fini) return { actif: false, raison: FINS[ins.fini] || 'Sorti' };
    if (M.bloque(p)) return { actif: false, raison: 'Ne plus contacter' };
    if (ins.depart && p.statut !== ins.depart) return { actif: false, raison: 'Statut changé : ' + (M.STATUTS[p.statut] || p.statut) };
    if (!emailOk(p.email)) return { actif: false, raison: 'Pas d’email' };
    if ((ins.etape || 0) >= (c.etapes || []).length) return { actif: false, raison: FINS.termine };
    return { actif: true, raison: '' };
  }
  function dejaAilleurs(c, pid) {
    return campagnes().some(function (x) {
      return x.id !== c.id && x.actif !== false && (x.inscrits || []).some(function (i) { return i.id === pid && etatInscrit(x, i).actif; });
    });
  }
  // Prospects du segment qui peuvent être inscrits : { ok: [...], sansEmail, ailleurs, bloques }
  function candidats(c) {
    var r = { ok: [], sansEmail: 0, ailleurs: 0, bloques: 0, deja: 0 };
    var inscrits = {};
    (c.inscrits || []).forEach(function (i) { inscrits[i.id] = 1; });
    M.prospects().forEach(function (p) {
      if (!correspond(c.filtres, p)) return;
      if (inscrits[p.id]) { r.deja++; return; }
      if (M.bloque(p)) { r.bloques++; return; }
      if (!emailOk(p.email)) { r.sansEmail++; return; }
      if (dejaAilleurs(c, p.id)) { r.ailleurs++; return; }
      r.ok.push(p);
    });
    return r;
  }
  function inscription(p) { var a = M.auj(); return { id: p.id, at: a, depart: p.statut, etape: 0, prochain: a, fini: '', envois: [] }; }
  function inscrire(cid, liste) {
    if (!liste.length) return;
    M.majElement('campagnes', cid, function (c) {
      var deja = {}; (c.inscrits || []).forEach(function (i) { deja[i.id] = 1; });
      return { inscrits: (c.inscrits || []).concat(liste.filter(function (p) { return !deja[p.id]; }).map(inscription)) };
    });
  }
  // Nouveaux prospects (créés depuis la campagne) qui correspondent : inscrits d'office si la campagne le demande.
  function synchroniser() {
    campagnes().forEach(function (c) {
      if (c.actif === false || !c.auto) return;
      var depuis = String(c.creeLe || '').slice(0, 10);
      var nouveaux = candidats(c).ok.filter(function (p) { return !depuis || String(p.createdAt || '').slice(0, 10) >= depuis; });
      if (nouveaux.length) inscrire(c.id, nouveaux);
    });
  }
  function envoyesAujourdhui(c) {
    var a = M.auj(), n = 0;
    (c.inscrits || []).forEach(function (i) { (i.envois || []).forEach(function (e) { if (String(e.at || '').slice(0, 10) === a) n++; }); });
    return n;
  }
  // Mails à envoyer aujourd'hui, toutes campagnes actives confondues (dans la limite par jour de chaque campagne).
  function dus() {
    var a = M.auj(), out = [];
    campagnes().forEach(function (c) {
      if (c.actif === false || !(c.etapes || []).length) return;
      var reste = Math.max(0, (Number(c.maxJour) || 40) - envoyesAujourdhui(c));
      (c.inscrits || []).forEach(function (ins) {
        if (reste <= 0 || !etatInscrit(c, ins).actif || String(ins.prochain || '') > a) return;
        reste--;
        out.push({ cid: c.id, pid: ins.id });
      });
    });
    return out;
  }
  function prochainEnvoi() {
    var best = null, n = 0;
    campagnes().forEach(function (c) {
      if (c.actif === false) return;
      (c.inscrits || []).forEach(function (ins) {
        if (!etatInscrit(c, ins).actif) return;
        if (!best || ins.prochain < best) { best = ins.prochain; n = 1; } else if (ins.prochain === best) n++;
      });
    });
    return best ? { date: best, n: n } : null;
  }
  function stats(c) {
    var s = { inscrits: 0, envoyes: 0, reponses: 0, rdv: 0, actifs: 0 };
    (c.inscrits || []).forEach(function (i) {
      s.inscrits++;
      s.envoyes += (i.envois || []).length;
      if (i.fini === 'repondu') s.reponses++;
      var p = M.prospect(i.id);
      if (p && (M.ETAPE[p.statut] || 0) >= 1 && (M.ETAPE[p.statut] || 0) > (M.ETAPE[i.depart] || 0)) s.rdv++;
      if (etatInscrit(c, i).actif) s.actifs++;
    });
    return s;
  }
  function majInscrit(cid, pid, patch) {
    M.majElement('campagnes', cid, function (c) {
      return { inscrits: (c.inscrits || []).map(function (i) { return i.id === pid ? Object.assign({}, i, typeof patch === 'function' ? patch(i) : patch) : i; }) };
    });
  }
  function segmentTexte(f) {
    f = f || {};
    var l = [];
    if (f.statut) l.push(M.STATUTS[f.statut] || f.statut);
    if (f.secteur) l.push(f.secteur);
    if (f.ville) l.push(f.ville);
    if (f.canal) l.push('source ' + f.canal);
    if (f.tag) l.push('étiquette « ' + f.tag + ' »');
    return l.length ? l.join(' · ') : 'Tous les prospects';
  }

  // ---------------------------------------------------------------- envoi
  function api(method, path, body) {
    var o = { method: method, credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart' } };
    if (body !== undefined) { o.headers['Content-Type'] = 'application/json'; o.body = JSON.stringify(body); }
    return fetch(path, o).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (b) {
        if (!r.ok) { var e = new Error(b.error || 'Erreur ' + r.status); e.status = r.status; e.reseau = b.reseau; e.lien = b.lien; e.lienTexte = b.lienTexte; throw e; }
        return b;
      });
    });
  }
  function chargerComptes(dessiner) {
    if (!M.serveur || S.comptes) return;
    S.comptes = [];
    api('GET', '/api/mail/comptes').then(function (b) {
      S.comptes = b.comptes || []; S.compteErr = null;
      if (!S.comptes.some(function (c) { return c.id === S.compte; })) S.compte = S.comptes.length ? S.comptes[0].id : '';
      dessiner();
    }, function (e) { S.comptes = []; S.compteErr = e.status === 403 ? 'La rubrique Mail n’est pas ouverte à votre compte : demandez-la à un administrateur pour envoyer les campagnes.' : e.message; dessiner(); });
  }
  function envoyer(dessiner) {
    if (S.envoi && S.envoi.en) return;
    synchroniser();
    var liste = dus();
    if (!liste.length) return;
    if (!S.compte) { S.msg = { k: 'warn', t: 'Choisissez la boîte mail d’envoi.' }; dessiner(); return; }
    S.envoi = { en: true, fait: 0, total: liste.length, ok: 0, erreurs: [], stop: false };
    S.msg = null;
    var i = 0, echecs = 0;
    function fin() { S.envoi.en = false; dessiner(); }
    function suivant() {
      if (S.envoi.stop || i >= liste.length) { fin(); return; }
      var d = liste[i++];
      var c = campagne(d.cid), ins = c && (c.inscrits || []).filter(function (x) { return x.id === d.pid; })[0], p = M.prospect(d.pid);
      if (!c || !ins || !p || !etatInscrit(c, ins).actif || String(ins.prochain || '') > M.auj()) { S.envoi.fait++; suivant(); return; }
      var k = ins.etape || 0, et = c.etapes[k];
      var sujet = M.remplir(et.sujet, p), texte = M.remplir(et.texte, p) + (c.optout ? '\n\n' + c.optout : '');
      api('POST', '/api/mail/envoyer', { compte: S.compte, a: p.email, sujet: sujet, texte: texte, prospectId: p.id })
        .then(function () {
          var a = M.auj(), suite = c.etapes[k + 1];
          majInscrit(c.id, p.id, function (x) {
            return { etape: k + 1, erreur: '', fini: suite ? x.fini : 'termine', prochain: suite ? M.plusJours(a, Math.max(1, (Number(suite.delai) || 0) - (Number(et.delai) || 0))) : '',
              envois: (x.envois || []).concat([{ etape: k, at: new Date().toISOString(), par: (M.user && M.user.name) || '' }]) };
          });
          M.noter(p.id, 'email', 'Campagne « ' + c.nom + ' » : mail ' + (k + 1) + '/' + c.etapes.length + ' « ' + sujet + ' » envoyé');
          S.envoi.ok++; echecs = 0;
        }, function (e) {
          echecs++;
          S.envoi.erreurs.push({ nom: p.entreprise || p.contact, t: e.message });
          majInscrit(c.id, p.id, { erreur: e.message });
          if (e.status === 401 || e.status === 403 || e.reseau || echecs >= 3) {
            S.envoi.stop = true;
            S.msg = { k: 'err', t: 'Envoi arrêté : ' + e.message, lien: e.lien, lienTexte: e.lienTexte };
          }
        })
        .then(function () { S.envoi.fait++; dessiner(true); if (!S.envoi.stop && i < liste.length) setTimeout(suivant, PAUSE); else fin(); });
    }
    dessiner(true);
    suivant();
  }

  // ---------------------------------------------------------------- brouillon (édition)
  function nouveau() {
    return { id: M.uid(), nouveau: true, nom: 'Prospection ' + new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }), actif: true, auto: true,
      filtres: { statut: 'a_appeler', secteur: '', ville: '', canal: '', tag: '' }, optout: OPTOUT, maxJour: 40,
      etapes: MODELE.map(function (e) { return { id: M.uid(), delai: e.delai, sujet: e.sujet, texte: e.texte }; }) };
  }
  function ouvrir(c) {
    S.brouillon = c ? JSON.parse(JSON.stringify({ id: c.id, nom: c.nom, actif: c.actif !== false, auto: !!c.auto, filtres: c.filtres || {}, optout: c.optout == null ? OPTOUT : c.optout,
      maxJour: c.maxJour || 40, etapes: c.etapes || [] })) : nouveau();
    S.vue = 'edit'; S.msg = null; S.apercu = ''; S.redaction = -1;
  }
  function enregistrer() {
    var b = S.brouillon; if (!b) return null;
    var etapes = b.etapes.map(function (e) { return { id: e.id || M.uid(), delai: Math.max(0, Math.round(Number(e.delai) || 0)), sujet: String(e.sujet || '').trim(), texte: String(e.texte || '') }; })
      .filter(function (e) { return e.sujet || e.texte.trim(); }).sort(function (x, y) { return x.delai - y.delai; });
    if (!String(b.nom || '').trim()) return 'Donnez un nom à la campagne.';
    if (!etapes.length) return 'Écrivez au moins un mail.';
    if (etapes.some(function (e) { return !e.sujet; })) return 'Chaque mail a besoin d’un objet.';
    var patch = { nom: String(b.nom).trim(), actif: b.actif !== false, auto: !!b.auto, filtres: b.filtres, optout: String(b.optout || ''), maxJour: Math.min(200, Math.max(1, Math.round(Number(b.maxJour) || 40))), etapes: etapes };
    if (b.nouveau || !campagne(b.id)) {
      M.majListe('campagnes', function (l) { return [Object.assign({ id: b.id, creeLe: new Date().toISOString(), creePar: (M.user && M.user.name) || '', inscrits: [] }, patch)].concat(l); });
      b.nouveau = false;
    } else M.majElement('campagnes', b.id, patch);
    b.etapes = etapes;
    return null;
  }

  // ---------------------------------------------------------------- affichage
  function options(liste, val, vide) {
    return '<option value="">' + esc(vide) + '</option>' + liste.map(function (v) { return '<option value="' + esc(v) + '"' + (egal(v, val) ? ' selected' : '') + '>' + esc(v) + '</option>'; }).join('');
  }
  function distincts(champ) {
    var vu = {}, out = [];
    M.prospects().forEach(function (p) {
      var vals = champ === 'tags' ? (p.tags || []) : [p[champ]];
      vals.forEach(function (v) { v = String(v || '').trim(); var k = v.toLowerCase(); if (v && !vu[k]) { vu[k] = 1; out.push(v); } });
    });
    return out.sort(function (a, b) { return a.localeCompare(b, 'fr'); });
  }
  function kpis(s, cle) {
    return '<div class="bsmk-kpis">' + [['Inscrits', s.inscrits], ['Mails envoyés', s.envoyes], ['Réponses', s.reponses], ['Rendez-vous', s.rdv]].map(function (k) {
      return M.kpi(k[0], k[1]).replace('data-kpi="', 'data-kpi="' + cle + ':');
    }).join('') + '</div>';
  }
  function carteEnvoi() {
    var liste = dus(), n = liste.length, e = S.envoi;
    var h = '<section class="card bsmk-card"><header class="card-head"><div><h3 class="card-title">À envoyer aujourd’hui (' + n + ')</h3>' +
      '<p class="card-sub">Les mails partent un par un depuis votre boîte, avec une pause entre chaque envoi.</p></div></header>';
    if (!M.serveur) return h + '<p class="bsmk-txt">L’envoi des campagnes se fait avec la version équipe du CRM (serveur), depuis la rubrique Mail.</p></section>';
    if (e && (e.en || e.fait)) {
      var pc = e.total ? Math.round(e.fait / e.total * 100) : 100;
      h += '<div class="bsmk-act" style="margin-bottom:10px"><div class="bsmk-bar" style="flex:1"><i style="width:' + pc + '%"></i></div><small>' + e.fait + '/' + e.total + (e.en ? ' · envoi en cours…' : ' · terminé') + ' · ' + e.ok + ' envoyé' + (e.ok > 1 ? 's' : '') + (e.erreurs.length ? ' · ' + e.erreurs.length + ' échec' + (e.erreurs.length > 1 ? 's' : '') : '') + '</small>' +
        (e.en ? '<button type="button" class="btn btn-ghost btn-sm" data-act="stop">Arrêter</button>' : '') + '</div>';
      if (e.erreurs.length) h += '<div class="bsmk-msg err" style="margin-bottom:10px">' + e.erreurs.slice(-5).map(function (x) { return esc(x.nom + ' : ' + x.t); }).join('<br>') + '</div>';
    }
    if (S.compteErr) return h + '<div class="bsmk-msg warn">' + esc(S.compteErr) + '</div></section>';
    if (S.comptes && !S.comptes.length) return h + '<div class="bsmk-msg warn">Connectez d’abord une boîte mail dans la rubrique Mail (onglet « Mes boîtes »). <a href="#/mail">Ouvrir Mail</a></div></section>';
    if (!n) {
      var pr = prochainEnvoi();
      return h + '<p class="bsmk-vide">' + (pr ? 'Rien à envoyer aujourd’hui. Prochain envoi : ' + esc(M.dateFr(pr.date, { weekday: 'long', day: 'numeric', month: 'long' })) + ' (' + pr.n + ' mail' + (pr.n > 1 ? 's' : '') + ').' : 'Rien à envoyer : créez une campagne et inscrivez des prospects.') + '</p></section>';
    }
    h += '<div>' + liste.slice(0, 8).map(function (d) {
      var c = campagne(d.cid), p = M.prospect(d.pid), ins = (c.inscrits || []).filter(function (x) { return x.id === d.pid; })[0], et = c.etapes[ins.etape || 0];
      return '<div class="bsmk-row"><div class="bsmk-t"><b>' + esc(p.entreprise || p.contact) + '</b><small>' + esc(c.nom + ' · mail ' + ((ins.etape || 0) + 1) + '/' + c.etapes.length + ' · ' + M.remplir(et.sujet, p)) + '</small>' +
        (ins.erreur ? '<small style="color:var(--bad,#ef4444)">' + esc(ins.erreur) + '</small>' : '') + '</div>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-repondu="' + esc(c.id + '|' + p.id) + '">A répondu</button></div>';
    }).join('') + (n > 8 ? '<p class="bsmk-vide">… et ' + (n - 8) + ' autre' + (n - 8 > 1 ? 's' : '') + '.</p>' : '') + '</div>';
    h += '<div class="bsmk-act" style="margin-top:12px"><select class="input select" name="compte" aria-label="Boîte d’envoi" style="max-width:320px">' +
      (S.comptes || []).map(function (c) { return '<option value="' + esc(c.id) + '"' + (c.id === S.compte ? ' selected' : '') + '>' + esc(c.email) + '</option>'; }).join('') + '</select>' +
      '<button type="button" class="btn btn-primary" data-act="envoyer"' + (e && e.en ? ' disabled' : '') + '>Envoyer les ' + n + ' mail' + (n > 1 ? 's' : '') + '</button>' +
      '<small>Quelqu’un a répondu ? Cliquez sur « A répondu » avant d’envoyer : il ne recevra plus les relances.</small></div></section>';
    return h;
  }
  function vueListe() {
    var l = campagnes();
    var h = M.tete('Campagnes', 'Séquences de mails de prospection : le CRM prépare chaque jour les mails à envoyer et les envoie depuis votre boîte.',
      '<button type="button" class="btn btn-primary" data-act="nouvelle">Nouvelle campagne</button>') + M.message(S.msg) + carteEnvoi();
    if (!l.length) {
      return h + '<section class="card bsmk-card"><header class="card-head"><div><h3 class="card-title">Votre première campagne</h3><p class="card-sub">3 mails déjà écrits pour votre agence : premier contact, relance à J+3, dernier message à J+7.</p></div></header>' +
        '<p class="bsmk-txt">Choisissez les prospects (par exemple « À appeler » d’un secteur), relisez les mails, inscrivez-les : le CRM vous dit chaque jour quoi envoyer. Les prospects qui répondent, changent de statut ou demandent à ne plus être contactés sortent de la séquence.</p>' +
        '<div class="bsmk-act" style="margin-top:12px"><button type="button" class="btn btn-primary" data-act="nouvelle">Créer ma première campagne</button></div></section>';
    }
    return h + l.map(function (c) {
      var s = stats(c);
      return '<section class="card bsmk-card"><header class="card-head"><div style="min-width:0"><h3 class="card-title">' + esc(c.nom) + ' <span class="badge ' + (c.actif === false ? 'tone-slate' : 'tone-emerald') + '">' + (c.actif === false ? 'En pause' : 'Active') + '</span></h3>' +
        '<p class="card-sub">' + esc(segmentTexte(c.filtres)) + ' · ' + (c.etapes || []).length + ' mail' + ((c.etapes || []).length > 1 ? 's' : '') + ' (' + (c.etapes || []).map(function (e) { return 'J+' + e.delai; }).join(', ') + ')' + (c.auto ? ' · inscription automatique' : '') + '</p></div>' +
        '<div class="card-actions"><button type="button" class="btn btn-ghost btn-sm" data-pause="' + esc(c.id) + '">' + (c.actif === false ? 'Reprendre' : 'Mettre en pause') + '</button><button type="button" class="btn btn-secondary btn-sm" data-ouvrir="' + esc(c.id) + '">Ouvrir</button></div></header>' +
        kpis(s, c.id) + '<p class="bsmk-vide" style="margin-top:8px">' + s.actifs + ' prospect' + (s.actifs > 1 ? 's' : '') + ' encore dans la séquence' + (s.inscrits ? ' · taux de réponse ' + Math.round(s.reponses / s.inscrits * 100) + ' %' : '') + '</p></section>';
    }).join('');
  }
  function vueEdition() {
    var b = S.brouillon, f = b.filtres || (b.filtres = {});
    var enBase = campagne(b.id);
    var c = enBase ? Object.assign({}, enBase, { filtres: f, etapes: b.etapes }) : { id: b.id, filtres: f, etapes: b.etapes, inscrits: [] };
    var cand = candidats(c);
    var statuts = Object.keys(M.STATUTS).map(function (k) { return '<option value="' + k + '"' + (f.statut === k ? ' selected' : '') + '>' + M.STATUTS[k] + '</option>'; }).join('');
    var h = M.tete(enBase ? b.nom : 'Nouvelle campagne', 'Choisissez qui reçoit les mails, écrivez la séquence, relisez avec un vrai prospect.',
      '<button type="button" class="btn btn-ghost" data-act="retour">Retour</button><button type="button" class="btn btn-primary" data-act="enregistrer">Enregistrer</button>') + M.message(S.msg);
    h += '<section class="card bsmk-card"><header class="card-head"><div><h3 class="card-title">1. Qui reçoit les mails ?</h3><p class="card-sub">Les prospects du segment, avec un email, qui ne sont pas déjà dans une autre campagne.</p></div></header>' +
      '<div class="bsmk-grid"><label>Nom de la campagne<input class="input" data-f="nom" value="' + esc(b.nom) + '"></label>' +
      '<label>Statut<select class="input select" data-f="filtres.statut"><option value="">Tous les statuts</option>' + statuts + '</select></label>' +
      '<label>Secteur<select class="input select" data-f="filtres.secteur">' + options(distincts('secteur'), f.secteur, 'Tous les secteurs') + '</select></label>' +
      '<label>Ville<select class="input select" data-f="filtres.ville">' + options(distincts('ville'), f.ville, 'Toutes les villes') + '</select></label>' +
      '<label>Source<select class="input select" data-f="filtres.canal">' + options(distincts('canal'), f.canal, 'Toutes les sources') + '</select></label>' +
      '<label>Étiquette<select class="input select" data-f="filtres.tag">' + options(distincts('tags'), f.tag, 'Toutes les étiquettes') + '</select></label></div>' +
      '<label class="bsmk-act" style="margin-top:12px;font-size:14px"><input type="checkbox" data-f="auto"' + (b.auto ? ' checked' : '') + '> Inscrire automatiquement les nouveaux prospects qui correspondent</label>' +
      '<label class="bsmk-act" style="font-size:14px"><input type="checkbox" data-f="actif"' + (b.actif !== false ? ' checked' : '') + '> Campagne active (décochez pour la mettre en pause)</label>' +
      '<div class="bsmk-msg" style="margin-top:12px"><b>' + cand.ok.length + ' prospect' + (cand.ok.length > 1 ? 's' : '') + ' à inscrire</b>' +
      [[cand.deja, 'déjà inscrit'], [cand.sansEmail, 'sans email'], [cand.ailleurs, 'dans une autre campagne'], [cand.bloques, 'à ne plus contacter']].filter(function (x) { return x[0]; }).map(function (x) { return ' · ' + x[0] + ' ' + x[1] + (x[0] > 1 && x[1].indexOf('déjà') === 0 ? 's' : ''); }).join('') + '</div>' +
      '<div class="bsmk-act" style="margin-top:10px"><button type="button" class="btn btn-secondary" data-act="inscrire"' + (cand.ok.length ? '' : ' disabled') + '>Inscrire ces ' + cand.ok.length + ' prospects</button><small>Le premier mail part le jour de l’inscription.</small></div></section>';
    h += '<section class="card bsmk-card"><header class="card-head"><div><h3 class="card-title">2. Les mails</h3><p class="card-sub">Jusqu’à 4 mails. J+ = nombre de jours après l’inscription.</p></div></header>' +
      b.etapes.map(function (e, i) {
        return '<div>' + (i ? '<div class="bsmk-sep"></div>' : '') +
          '<div class="bsmk-act" style="justify-content:space-between"><b style="font-size:14px">Mail ' + (i + 1) + '</b><span class="bsmk-act">' +
          (S.ia && S.ia.ia ? '<button type="button" class="btn btn-ghost btn-sm" data-ia="' + i + '"' + (S.redaction === i ? ' disabled' : '') + '>' + (S.redaction === i ? 'Claude écrit…' : 'Rédiger avec Claude') + '</button>' : '') +
          (b.etapes.length > 1 ? '<button type="button" class="btn btn-ghost btn-sm" data-retirer-etape="' + i + '">Retirer</button>' : '') + '</span></div>' +
          '<div class="bsmk-grid" style="grid-template-columns:110px 1fr;margin-top:8px"><label>Envoi à J+<input class="input" type="number" min="0" max="90" data-e="' + i + '" data-k="delai" value="' + esc(e.delai) + '"></label>' +
          '<label>Objet<input class="input" data-e="' + i + '" data-k="sujet" value="' + esc(e.sujet) + '"></label></div>' +
          '<label class="bsmk-l" style="margin-top:10px">Message<textarea class="input bsmk-area" data-e="' + i + '" data-k="texte" rows="9">' + esc(e.texte) + '</textarea></label></div>';
      }).join('') +
      '<div style="margin-top:10px">' + M.boutonsVariables() + '</div>' +
      '<div class="bsmk-act" style="margin-top:12px">' + (b.etapes.length < MAX_ETAPES ? '<button type="button" class="btn btn-secondary btn-sm" data-act="ajouter-etape">Ajouter un mail</button>' : '') + '</div>' +
      '<div class="bsmk-grid" style="margin-top:12px;grid-template-columns:1fr 160px"><label>Ligne de désinscription (ajoutée en bas de chaque mail)<input class="input" data-f="optout" value="' + esc(b.optout) + '"></label>' +
      '<label>Maximum par jour<input class="input" type="number" min="1" max="200" data-f="maxJour" value="' + esc(b.maxJour) + '"></label></div></section>';
    var exemples = (cand.ok.length ? cand.ok : M.prospects()).slice(0, 300);
    var ap = M.prospect(S.apercu) || exemples[0] || null;
    h += '<section class="card bsmk-card"><header class="card-head"><div><h3 class="card-title">3. Aperçu</h3><p class="card-sub">Les mails tels que le prospect les recevra.</p></div></header>' +
      '<label class="bsmk-l" style="max-width:420px">Prospect<select class="input select" name="apercu">' + exemples.map(function (p) { return '<option value="' + esc(p.id) + '"' + (ap && ap.id === p.id ? ' selected' : '') + '>' + esc((p.entreprise || p.contact) + (p.ville ? ' · ' + p.ville : '')) + '</option>'; }).join('') + '</select></label>' +
      '<div style="display:flex;flex-direction:column;gap:10px;margin-top:12px">' + b.etapes.map(function (e, i) {
        return '<div class="bsmk-apercu"><b>J+' + esc(e.delai) + ' · ' + esc(M.remplir(e.sujet, ap)) + '</b>' + esc(M.remplir(e.texte, ap) + (b.optout ? '\n\n' + b.optout : '')) + '</div>';
      }).join('') + '</div></section>';
    if (enBase && (enBase.inscrits || []).length) {
      var ins = enBase.inscrits.slice().sort(function (x, y) { return (etatInscrit(enBase, y).actif ? 1 : 0) - (etatInscrit(enBase, x).actif ? 1 : 0) || String(x.prochain || '').localeCompare(String(y.prochain || '')); });
      h += '<section class="card bsmk-card"><header class="card-head"><div><h3 class="card-title">Inscrits (' + ins.length + ')</h3><p class="card-sub">' + esc(kpiTexte(stats(enBase))) + '</p></div></header><div>' +
        ins.slice(0, 200).map(function (i) {
          var p = M.prospect(i.id), st = etatInscrit(enBase, i);
          var info = st.actif ? 'Mail ' + ((i.etape || 0) + 1) + '/' + enBase.etapes.length + ' le ' + M.dateFr(i.prochain) : st.raison;
          return '<div class="bsmk-row"><div class="bsmk-t"><b>' + esc(p ? (p.entreprise || p.contact) : 'Prospect supprimé') + '</b><small>' + esc(info + ' · ' + (i.envois || []).length + ' envoyé' + ((i.envois || []).length > 1 ? 's' : '') + (p && p.email ? ' · ' + p.email : '')) + '</small>' +
            (i.erreur ? '<small style="color:var(--bad,#ef4444)">' + esc(i.erreur) + '</small>' : '') + '</div>' +
            (p ? '<button type="button" class="btn btn-ghost btn-sm" data-fiche="' + esc(p.id) + '">Fiche</button>' : '') +
            (st.actif ? '<button type="button" class="btn btn-ghost btn-sm" data-repondu="' + esc(enBase.id + '|' + i.id) + '">A répondu</button><button type="button" class="btn btn-ghost btn-sm" data-stop="' + esc(i.id) + '">Ne plus contacter</button>' : '') +
            (i.fini && i.fini !== 'stop' ? '<button type="button" class="btn btn-ghost btn-sm" data-reprendre="' + esc(enBase.id + '|' + i.id) + '">Remettre</button>' : '') + '</div>';
        }).join('') + '</div></section>';
    }
    if (enBase) h += '<div class="bsmk-act"><button type="button" class="btn btn-ghost" data-act="supprimer">Supprimer la campagne</button></div>';
    return h;
  }
  function kpiTexte(s) { return s.inscrits + ' inscrits · ' + s.envoyes + ' mails envoyés · ' + s.reponses + ' réponses · ' + s.rdv + ' rendez-vous'; }

  function rendre(el) {
    if (S.vue === 'edit' && S.brouillon) el.innerHTML = vueEdition();
    else { S.vue = 'liste'; el.innerHTML = vueListe(); }
  }

  function brancher(el, dessiner) {
    function lireChamp(t) {
      var b = S.brouillon; if (!b) return;
      var f = t.getAttribute('data-f'), e = t.getAttribute('data-e');
      if (f) {
        var v = t.type === 'checkbox' ? t.checked : t.value;
        if (f.indexOf('filtres.') === 0) { b.filtres = b.filtres || {}; b.filtres[f.slice(8)] = v; } else b[f] = v;
      } else if (e !== null && b.etapes[+e]) b.etapes[+e][t.getAttribute('data-k')] = t.value;
    }
    el.addEventListener('input', function (ev) { lireChamp(ev.target); });
    el.addEventListener('change', function (ev) {
      var t = ev.target;
      if (t.name === 'compte') { S.compte = t.value; ecrireCompte(t.value); return; }
      if (t.name === 'apercu') { S.apercu = t.value; dessiner(true); return; }
      lireChamp(t);
      if (t.tagName === 'SELECT' || t.type === 'checkbox' || t.getAttribute('data-k') === 'delai') dessiner(true);
    });
    el.addEventListener('click', function (ev) {
      var t = ev.target.closest('button'); if (!t || !el.contains(t)) return;
      var a = t.getAttribute('data-act');
      if (a === 'nouvelle') { ouvrir(null); dessiner(true); window.scrollTo(0, 0); return; }
      if (a === 'retour') { S.vue = 'liste'; S.brouillon = null; S.msg = null; dessiner(true); return; }
      if (a === 'enregistrer') {
        var err = enregistrer();
        S.msg = err ? { k: 'err', t: err } : { k: 'ok', t: 'Campagne enregistrée.' };
        if (!err) { S.vue = 'liste'; S.brouillon = null; }
        dessiner(true); window.scrollTo(0, 0); return;
      }
      if (a === 'inscrire') {
        var e2 = enregistrer();
        if (e2) { S.msg = { k: 'err', t: e2 }; dessiner(true); return; }
        var c = campagne(S.brouillon.id), liste = candidats(c).ok;
        inscrire(c.id, liste);
        S.msg = { k: 'ok', t: liste.length + ' prospect' + (liste.length > 1 ? 's' : '') + ' inscrit' + (liste.length > 1 ? 's' : '') + '. Les premiers mails sont dans « À envoyer aujourd’hui ».' };
        dessiner(true); return;
      }
      if (a === 'ajouter-etape') {
        var der = S.brouillon.etapes[S.brouillon.etapes.length - 1];
        S.brouillon.etapes.push({ id: M.uid(), delai: (der ? Number(der.delai) || 0 : 0) + 4, sujet: 'Re : ' + (S.brouillon.etapes[0] ? S.brouillon.etapes[0].sujet : '{{entreprise}}'), texte: 'Bonjour {{prenom}},\n\n\n\n{{moi}}' });
        dessiner(true); return;
      }
      if (a === 'supprimer') {
        if (!window.confirm('Supprimer la campagne « ' + S.brouillon.nom + ' » ? Les mails déjà envoyés restent notés sur les fiches.')) return;
        M.majElement('campagnes', S.brouillon.id, { supprime: true, actif: false });
        S.vue = 'liste'; S.brouillon = null; S.msg = { k: 'ok', t: 'Campagne supprimée.' }; dessiner(true); return;
      }
      if (a === 'envoyer') { envoyer(dessiner); return; }
      if (a === 'stop') { if (S.envoi) S.envoi.stop = true; return; }
      if (t.hasAttribute('data-ouvrir')) { ouvrir(campagne(t.getAttribute('data-ouvrir'))); dessiner(true); window.scrollTo(0, 0); return; }
      if (t.hasAttribute('data-pause')) { var c2 = campagne(t.getAttribute('data-pause')); if (c2) M.majElement('campagnes', c2.id, { actif: c2.actif === false }); return; }
      if (t.hasAttribute('data-retirer-etape')) { S.brouillon.etapes.splice(+t.getAttribute('data-retirer-etape'), 1); dessiner(true); return; }
      if (t.hasAttribute('data-fiche')) { M.ouvrirFiche(t.getAttribute('data-fiche')); return; }
      if (t.hasAttribute('data-repondu') || t.hasAttribute('data-reprendre')) {
        var r = (t.getAttribute('data-repondu') || t.getAttribute('data-reprendre')).split('|'), c3 = campagne(r[0]);
        if (t.hasAttribute('data-repondu')) { majInscrit(r[0], r[1], { fini: 'repondu' }); if (c3) M.noter(r[1], 'note', 'A répondu à la campagne « ' + c3.nom + ' »'); }
        else majInscrit(r[0], r[1], function (i) { return { fini: '', prochain: i.prochain || M.auj() }; });
        return;
      }
      if (t.hasAttribute('data-stop')) {
        var pid = t.getAttribute('data-stop');
        M.majProspect(pid, function () { return { nePlusContacter: true }; });
        M.noter(pid, 'note', 'Ne plus contacter (marketing)');
        return;
      }
      if (t.hasAttribute('data-ia')) {
        var i = +t.getAttribute('data-ia'), b = S.brouillon, et = b.etapes[i];
        S.redaction = i; dessiner(true);
        var consigne = M.contexteAgence() + '\nÉcris le mail n°' + (i + 1) + ' sur ' + b.etapes.length + ' d’une séquence de prospection à froid, envoyé à J+' + et.delai + '.' +
          (i ? ' Les mails précédents :\n' + b.etapes.slice(0, i).map(function (x) { return 'Objet : ' + x.sujet + '\n' + x.texte; }).join('\n---\n') : '') +
          '\nCible : ' + segmentTexte(b.filtres) + '.\nUtilise les variables {{prenom}}, {{entreprise}}, {{secteur}}, {{ville}} et signe avec {{moi}}. Vouvoiement, 60 à 110 mots, une seule demande claire (un appel de 15 minutes), aucune formule creuse.' +
          '\nRéponds avec la première ligne « Objet : … », une ligne vide, puis le message.';
        M.rediger('email', consigne).then(function (txt) {
          var m = /^\s*objet\s*:\s*(.+)\n+([\s\S]*)$/i.exec(txt);
          if (m) { et.sujet = m[1].trim(); et.texte = m[2].trim(); } else et.texte = txt.trim();
          S.redaction = -1; S.msg = null; dessiner(true);
        }, function (e) { S.redaction = -1; S.msg = { k: 'err', t: e.message }; dessiner(true); });
      }
    });
  }

  var P = M.page(rendre, brancher);
  function monter(el) {
    synchroniser();
    chargerComptes(P.dessiner);
    M.iaEtat(function (e) { S.ia = e; P.dessiner(); });
    P.monter(el);
  }

  window.bsCampagnes = { monter: monter, _dus: dus, _candidats: candidats, _etat: S };
})();
