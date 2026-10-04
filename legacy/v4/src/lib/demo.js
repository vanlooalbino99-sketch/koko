// Jeu de démonstration réaliste (pour découvrir l'app sans saisir de données).
import { uid, today, addDays, nowTime } from './util.js';
import { DEFAULT_SETTINGS } from './constants.js';

const NAMES = [
  ['Agence Immo du Centre', 'Immobilier', 'M. Dupont', 'Lyon'],
  ['Plomberie Martin & Fils', 'Artisans / BTP', 'Julien Martin', 'Villeurbanne'],
  ['Cabinet Dentaire Lumière', 'Santé & bien-être', 'Dr Sophie Bernard', 'Lyon'],
  ['Électricité Moreau', 'Artisans / BTP', 'Karim Moreau', 'Vénissieux'],
  ['Kiné Performance', 'Santé & bien-être', 'Claire Petit', 'Caluire'],
  ['Maison & Patrimoine', 'Immobilier', 'Laurent Garnier', 'Annecy'],
  ['Boutique Élégance', 'Commerce / e-commerce', 'Nadia Roux', 'Grenoble'],
  ['Expertise Comptable Roche', 'Services B2B', 'Henri Roche', 'Lyon'],
  ['Menuiserie Artisanale Blanc', 'Artisans / BTP', 'Thomas Blanc', 'Bourg-en-Bresse'],
  ['Institut Zen Beauté', 'Santé & bien-être', 'Emma Fontaine', 'Villefranche'],
  ['Square Habitat Lyon 6', 'Immobilier', 'Marc Chevalier', 'Lyon'],
  ['Chauffage Services Rhône', 'Artisans / BTP', 'Pierre Lambert', 'Givors'],
  ['Pharmacie des Brotteaux', 'Santé & bien-être', 'Isabelle Mercier', 'Lyon'],
  ['Atelier Vélo Urbain', 'Commerce / e-commerce', 'Hugo Girard', 'Lyon'],
  ['Conseil RH Partners', 'Services B2B', 'Anne Faure', 'Écully'],
  ['Toiture Duval', 'Artisans / BTP', 'Éric Duval', 'Saint-Étienne'],
  ['Orthodontie Bellecour', 'Santé & bien-être', 'Dr Paul André', 'Lyon'],
  ['Century Immo Croix-Rousse', 'Immobilier', 'Léa Bonnet', 'Lyon'],
  ['Garage Auto Prestige', 'Services B2B', 'Rachid Benali', 'Bron'],
  ['Serrurerie Express 69', 'Artisans / BTP', 'Kevin Dubois', 'Lyon'],
  ['Ostéo Santé Confluence', 'Santé & bien-être', 'Julie Lefèvre', 'Lyon'],
  ['Cave & Terroirs', 'Commerce / e-commerce', 'Olivier Marchand', 'Mâcon'],
  ['Syndic Horizon', 'Immobilier', 'Catherine Perrin', 'Villeurbanne'],
  ['Paysages Verts', 'Artisans / BTP', 'Sébastien Morel', 'Chambéry'],
  ['Dermato Clinique Part-Dieu', 'Santé & bien-être', 'Dr Nicolas Robin', 'Lyon'],
  ['Traiteur Saveurs', 'Commerce / e-commerce', 'Amélie Colin', 'Lyon'],
  ['Avocats Associés Terreaux', 'Services B2B', 'Me François Gauthier', 'Lyon'],
  ['Carrelage Design', 'Artisans / BTP', 'Yannick Picard', 'Meyzieu'],
  ['Optique Vision+', 'Commerce / e-commerce', 'Sarah Nicolas', 'Oullins'],
  ['Immo Prestige Ouest', 'Immobilier', 'Vincent Masson', 'Tassin'],
  ['Vétérinaire des Monts', 'Santé & bien-être', 'Dr Chloé Renaud', 'Limonest'],
  ['Nettoyage Pro Services', 'Services B2B', 'Mehdi Haddad', 'Saint-Priest'],
  ['Peinture & Déco Rousseau', 'Artisans / BTP', 'Antoine Rousseau', 'Décines'],
  ['Audioprothèse Écoute', 'Santé & bien-être', 'Martine Lemoine', 'Lyon'],
  ['Fleurs de Saison', 'Commerce / e-commerce', 'Pauline Arnaud', 'Lyon'],
  ['Déménagement Rapide', 'Services B2B', 'Bruno Carpentier', 'Vaulx-en-Velin'],
];
const CANAUX = ['Cold calling', 'Cold calling', 'Cold calling', 'LinkedIn', 'Réseau Orange Pro', 'Recommandation', 'Terrain', 'Partenaire'];

function rnd(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function demoData() {
  const r = rnd(42);
  const pick = (a) => a[Math.floor(r() * a.length)];
  const t = today();
  const prospects = NAMES.map(([entreprise, secteur, contact, ville], i) => {
    const created = addDays(t, -Math.floor(10 + r() * 170));
    const tel = '06' + String(Math.floor(r() * 1e8)).padStart(8, '0');
    const stage = r();
    let statut = 'a_appeler';
    if (i % 9 === 0) statut = 'client_signe';
    else if (stage < 0.18) statut = 'injoignable';
    else if (stage < 0.32) statut = 'rdv_pris';
    else if (stage < 0.42) statut = 'audit_realise';
    else if (stage < 0.52) statut = 'proposition_envoyee';
    else if (stage < 0.62) statut = 'client_signe';
    else if (stage < 0.68) statut = 'perdu';
    else if (stage < 0.71) statut = 'resilie';

    const nCalls = 1 + Math.floor(r() * 5);
    const callLog = [];
    for (let k = 0; k < nCalls; k++) {
      const date = addDays(t, -Math.floor(r() * 150));
      const outcome = k === 0 && statut !== 'a_appeler' && statut !== 'resilie' ? (statut === 'client_signe' ? 'client_signe' : statut === 'perdu' ? 'perdu' : statut) : pick(['injoignable', 'injoignable', 'rappel', 'rdv_pris', 'injoignable']);
      callLog.push({ date, time: `${String(9 + Math.floor(r() * 9)).padStart(2, '0')}:${pick(['05', '20', '35', '50'])}`, outcome, note: '', duration: Math.floor(40 + r() * 600) });
    }
    // quelques appels cette semaine / aujourd'hui pour animer le tableau de bord
    for (let k = 0; k < Math.floor(r() * 4); k++) {
      callLog.push({ date: addDays(t, -Math.floor(r() * 5)), time: nowTime(), outcome: pick(['injoignable', 'rappel', 'injoignable', 'rdv_pris']), note: '', duration: Math.floor(30 + r() * 300) });
    }
    callLog.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
    const signed = statut === 'client_signe' || statut === 'resilie';
    const signedAt = signed ? addDays(t, -Math.floor(5 + r() * 160)) : null;
    const open = !['client_signe', 'perdu', 'resilie'].includes(statut);
    const rel = open ? addDays(t, Math.floor(r() * 12) - 4) : null;
    return {
      id: uid() + i,
      entreprise,
      secteur,
      contact,
      telephone: tel,
      email: contact.toLowerCase().replace(/^(dr|me|m\.)\s+/, '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]+/g, '.') + '@' + entreprise.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]+/g, '').slice(0, 14) + '.fr',
      ville,
      adresse: '',
      siret: '',
      site: '',
      canal: pick(CANAUX),
      statut,
      priorite: open ? pick(['haute', 'moyenne', 'basse', '', 'moyenne']) : '',
      tags: r() < 0.25 ? [pick(['Décideur', 'Multi-sites', 'Urgent', 'Budget validé'])] : [],
      notes: statut === 'rdv_pris' ? 'Intéressé par la prise d\'appels hors horaires. Audit à préparer.' : '',
      dealValue: signed ? pick([1800, 2200, 2500, 3200, 4500]) : statut === 'proposition_envoyee' ? pick([2200, 3000]) : 0,
      mrrValue: signed ? pick([149, 190, 220, 290, 390]) : 0,
      signedAt,
      resilieAt: statut === 'resilie' ? addDays(signedAt, 60) : null,
      prochaineRelance: rel,
      prochaineRelanceHeure: rel ? pick([null, '09:30', '11:00', '14:00', '16:30']) : null,
      createdAt: created,
      updatedAt: t,
      callLog,
      events: [],
    };
  });

  const byName = (n) => prospects.find((p) => p.entreprise === n);
  const year = new Date().getFullYear();
  const L = (designation, quantite, prixUnitaire, tva = 20) => ({ id: uid(), designation, quantite, prixUnitaire, tva });
  const mk = (i, p, statut, lignes, created) => ({
    id: uid() + 'd' + i,
    numero: `DEV-${year}-${String(i).padStart(3, '0')}`,
    prospectId: p.id,
    clientNom: p.entreprise,
    clientAdresse: `${p.ville}`,
    lignes,
    remise: 0,
    statut,
    dateCreation: created,
    dateValidite: addDays(created, 30),
    notes: 'Mise en service sous 7 jours ouvrés après signature.',
  });
  const devisList = [
    mk(1, byName('Agence Immo du Centre'), 'accepte', [L('Mise en place standard IA Blackstart', 1, 1800), L('Abonnement mensuel — 1er mois', 1, 220)], addDays(t, -40)),
    mk(2, byName('Cabinet Dentaire Lumière'), 'envoye', [L('Audit & paramétrage agent vocal', 1, 1200), L('Intégration agenda Doctolib', 1, 600)], addDays(t, -6)),
    mk(3, byName('Maison & Patrimoine'), 'envoye', [L('Pack Agence — 3 lignes', 1, 2900)], addDays(t, -38)),
    mk(4, byName('Expertise Comptable Roche'), 'brouillon', [L('Standard IA — heures de pointe', 1, 1500), L('Formation équipe (2h)', 2, 150)], addDays(t, -1)),
    mk(5, byName('Kiné Performance'), 'refuse', [L('Mise en place standard IA', 1, 1600)], addDays(t, -70)),
  ];
  const d1 = devisList[0];
  const factures = [
    {
      id: uid() + 'f1',
      numero: `FAC-${year}-001`,
      devisId: d1.id,
      prospectId: d1.prospectId,
      clientNom: d1.clientNom,
      clientAdresse: d1.clientAdresse,
      lignes: d1.lignes.map((l) => ({ ...l, id: uid() })),
      remise: 0,
      statut: 'payee',
      dateEmission: addDays(t, -35),
      dateEcheance: addDays(t, -5),
      datePaiement: addDays(t, -20),
      moyenPaiement: 'Virement',
      notes: '',
    },
    {
      id: uid() + 'f2',
      numero: `FAC-${year}-002`,
      devisId: null,
      prospectId: byName('Square Habitat Lyon 6').id,
      clientNom: 'Square Habitat Lyon 6',
      clientAdresse: 'Lyon',
      lignes: [L('Abonnement Blackstart — mois en cours', 1, 290)],
      remise: 0,
      statut: 'a_payer',
      dateEmission: addDays(t, -12),
      dateEcheance: addDays(t, 18),
      datePaiement: null,
      moyenPaiement: '',
      notes: '',
    },
    {
      id: uid() + 'f3',
      numero: `FAC-${year}-003`,
      devisId: null,
      prospectId: byName('Plomberie Martin & Fils').id,
      clientNom: 'Plomberie Martin & Fils',
      clientAdresse: 'Villeurbanne',
      lignes: [L('Installation agent vocal', 1, 1500)],
      remise: 5,
      statut: 'a_payer',
      dateEmission: addDays(t, -45),
      dateEcheance: addDays(t, -15),
      datePaiement: null,
      moyenPaiement: '',
      notes: '',
    },
  ];
  d1.factureId = factures[0].id;
  const tasks = [
    { id: uid() + 't1', title: 'Préparer l\'audit du cabinet dentaire', prospectId: byName('Cabinet Dentaire Lumière').id, due: t, heure: '10:00', priorite: 'haute', notes: '', done: false, createdAt: t },
    { id: uid() + 't2', title: 'Relancer le devis DEV-003', prospectId: byName('Maison & Patrimoine').id, due: addDays(t, -1), heure: '', priorite: 'moyenne', notes: '', done: false, createdAt: t },
    { id: uid() + 't3', title: 'Envoyer la doc technique', prospectId: byName('Expertise Comptable Roche').id, due: addDays(t, 2), heure: '', priorite: '', notes: '', done: false, createdAt: t },
    { id: uid() + 't4', title: 'Mettre à jour la liste de leads LinkedIn', prospectId: null, due: addDays(t, 1), heure: '', priorite: 'basse', notes: '', done: false, createdAt: t },
    { id: uid() + 't5', title: 'Appeler le comptable pour la TVA', prospectId: null, due: addDays(t, -2), heure: '', priorite: '', notes: '', done: true, doneAt: addDays(t, -2), createdAt: addDays(t, -4) },
  ];
  return {
    prospects,
    devisList,
    factures,
    tasks,
    settings: { ...DEFAULT_SETTINGS },
    companyInfo: {
      nom: 'Blackstart AI',
      adresse: '12 rue de la Prospection, 69002 Lyon',
      siret: '912 345 678 00012',
      email: 'contact@blackstart.ai',
      telephone: '04 78 00 00 00',
      expediteur: 'Alex — Blackstart AI',
      site: 'blackstart.ai',
      iban: 'FR76 3000 6000 0112 3456 7890 189',
      bic: 'AGRIFRPP',
      paymentLinks: { payoneer: '', stripe: 'https://buy.stripe.com/demo', paypal: 'https://paypal.me/blackstart' },
    },
  };
}
