// Actions métier (mutations + retours utilisateur).
import { db, setList, patchProspect, addEvent, snapshot, restore, normalizeProspect } from './store.js';
import { toast } from './nav.js';
import { OUTCOMES, STATUTS, DEVIS_STATUTS, FACTURE_STATUTS, SECTEURS, CANAUX } from './constants.js';
import { uid, today, nowTime, addDays, digits, norm, plural } from './util.js';
import { nextNumero } from './business.js';

function undoable(message, fn) {
  const snap = snapshot();
  fn();
  toast(message, { action: () => restore(snap), actionLabel: 'Annuler' });
}

/* ---------------- Prospects ---------------- */
export function findDuplicate(data, excludeId) {
  const tel = digits(data.telephone);
  const name = norm(data.entreprise);
  return db.get().prospects.find(
    (p) => p.id !== excludeId && ((tel && tel.length >= 9 && digits(p.telephone) === tel) || (name && norm(p.entreprise) === name && norm(p.ville) === norm(data.ville))),
  );
}

export function saveProspect(data) {
  if (data.id) {
    const before = db.get().prospects.find((p) => p.id === data.id);
    patchProspect(data.id, data);
    if (before && data.statut && before.statut !== data.statut) addEvent(data.id, 'status', `Statut : ${STATUTS[before.statut]?.label || before.statut} → ${STATUTS[data.statut]?.label || data.statut}`);
    toast('Prospect mis à jour');
    return data.id;
  }
  const p = normalizeProspect({
    ...data,
    id: uid(),
    statut: data.statut || 'a_appeler',
    prochaineRelance: data.prochaineRelance || today(),
    createdAt: today(),
    callLog: [],
    events: [{ id: uid(), ts: new Date().toISOString(), date: today(), time: nowTime(), type: 'create', text: 'Prospect créé' }],
  });
  setList('prospects', (l) => [p, ...l]);
  toast('Prospect ajouté');
  return p.id;
}

export function deleteProspects(ids) {
  const set = new Set(ids);
  undoable(ids.length > 1 ? `${ids.length} prospects supprimés` : 'Prospect supprimé', () => {
    setList('prospects', (l) => l.filter((p) => !set.has(p.id)));
    setList('tasks', (l) => l.filter((t) => !set.has(t.prospectId)));
  });
}

export function setStatut(ids, statut) {
  const list = Array.isArray(ids) ? ids : [ids];
  const label = STATUTS[statut]?.label || statut;
  list.forEach((id) => {
    const p = db.get().prospects.find((x) => x.id === id);
    if (!p || p.statut === statut) return;
    const patch = { statut };
    if (statut === 'client_signe' && !p.signedAt) patch.signedAt = today();
    if (statut === 'resilie') patch.resilieAt = today();
    if (['client_signe', 'perdu', 'resilie'].includes(statut)) {
      patch.prochaineRelance = null;
      patch.prochaineRelanceHeure = null;
    }
    patchProspect(id, patch);
    addEvent(id, 'status', `Statut : ${STATUTS[p.statut]?.label || p.statut} → ${label}`);
  });
  toast(list.length > 1 ? `${list.length} prospects → ${label}` : `Statut : ${label}`);
}

export function resilier(id) {
  setStatut(id, 'resilie');
}

export function setRelance(id, date, heure) {
  patchProspect(id, { prochaineRelance: date || null, prochaineRelanceHeure: heure || null });
  addEvent(id, 'relance', date ? `Relance planifiée le ${date.split('-').reverse().join('/')}${heure ? ' à ' + heure : ''}` : 'Relance retirée');
}

/* Enregistrement d'un appel (même logique que la v3). */
export function logCall(id, { outcome, note, date, heure, dealValue, mrrValue, duration }) {
  const o = OUTCOMES.find((x) => x.id === outcome);
  if (!o) return;
  patchProspect(id, (p) => {
    const closed = o.statut === 'client_signe' || o.statut === 'perdu';
    const entry = { date: today(), time: nowTime(), outcome, note: note || '', duration: duration || 0 };
    const next = {
      statut: o.statut,
      notes: note ? note : p.notes,
      prochaineRelance: closed ? null : date || p.prochaineRelance,
      prochaineRelanceHeure: closed ? null : heure || p.prochaineRelanceHeure || null,
      callLog: [entry, ...(p.callLog || [])],
    };
    if (o.statut === 'client_signe') {
      next.signedAt = p.signedAt || today();
      next.dealValue = Number(dealValue) || p.dealValue || 0;
      next.mrrValue = Number(mrrValue) || p.mrrValue || 0;
    }
    return next;
  });
  toast('Appel enregistré');
}

/* Import de leads avec détection de doublons (téléphone, ou nom + ville). */
export function importLeads(rows) {
  let added = 0;
  let skipped = 0;
  setList('prospects', (list) => {
    const tels = new Set(list.map((p) => digits(p.telephone)).filter(Boolean));
    const keys = new Set(list.map((p) => `${norm(p.entreprise)}|${norm(p.ville)}`));
    const out = [...list];
    rows.forEach((r) => {
      const tel = digits(r.telephone);
      const key = `${norm(r.entreprise)}|${norm(r.ville)}`;
      if (!r.entreprise || (tel && tels.has(tel)) || (!tel && keys.has(key))) {
        skipped++;
        return;
      }
      if (tel) tels.add(tel);
      keys.add(key);
      out.unshift(
        normalizeProspect({
          ...r,
          id: uid(),
          secteur: r.secteur || SECTEURS[0],
          canal: r.canal || 'Import',
          statut: 'a_appeler',
          prochaineRelance: today(),
          createdAt: today(),
          callLog: [],
          events: [{ id: uid(), ts: new Date().toISOString(), date: today(), time: nowTime(), type: 'create', text: `Importé (${r.canal || 'Import'})` }],
        }),
      );
      added++;
    });
    return out;
  });
  toast(`${plural(added, 'lead importé', 'leads importés')}${skipped ? `, ${plural(skipped, 'doublon ignoré', 'doublons ignorés')}` : ''}`);
  return { added, skipped };
}

export function scheduleSlot(prospectId, date, heure, newName) {
  if (prospectId) {
    setRelance(prospectId, date, heure);
    toast('Créneau planifié');
  } else if (newName && newName.trim()) {
    const id = saveProspect({ entreprise: newName.trim(), secteur: SECTEURS[0], canal: CANAUX[0], prochaineRelance: date });
    patchProspect(id, { prochaineRelanceHeure: heure || null });
    toast('Prospect créé et créneau planifié');
  }
}

/* ---------------- Devis ---------------- */
export function saveDevis(d) {
  if (d.id) {
    setList('devisList', (l) => l.map((x) => (x.id === d.id ? { ...x, ...d } : x)));
    toast('Devis mis à jour');
    return d.id;
  }
  const numero = nextNumero(db.get().devisList, 'DEV');
  const nd = {
    id: uid(),
    numero,
    prospectId: d.prospectId || null,
    clientNom: d.clientNom || '',
    clientAdresse: d.clientAdresse || '',
    lignes: d.lignes && d.lignes.length ? d.lignes : [{ id: uid(), designation: '', quantite: 1, prixUnitaire: 0, tva: 20 }],
    remise: Number(d.remise) || 0,
    statut: 'brouillon',
    dateCreation: today(),
    dateValidite: d.dateValidite || addDays(today(), 30),
    notes: d.notes || '',
  };
  setList('devisList', (l) => [nd, ...l]);
  if (nd.prospectId) addEvent(nd.prospectId, 'devis', `Devis ${numero} créé`);
  toast(`Devis ${numero} créé`);
  return nd.id;
}
export function duplicateDevis(id) {
  const d = db.get().devisList.find((x) => x.id === id);
  if (!d) return null;
  const numero = nextNumero(db.get().devisList, 'DEV');
  const nd = { ...d, id: uid(), numero, statut: 'brouillon', dateCreation: today(), dateValidite: addDays(today(), 30), lignes: d.lignes.map((l) => ({ ...l, id: uid() })), factureId: null };
  setList('devisList', (l) => [nd, ...l]);
  toast(`Devis ${numero} créé (copie)`);
  return nd.id;
}
export function deleteDevis(id) {
  undoable('Devis supprimé', () => setList('devisList', (l) => l.filter((x) => x.id !== id)));
}
export function setDevisStatut(id, statut) {
  const d = db.get().devisList.find((x) => x.id === id);
  setList('devisList', (l) => l.map((x) => (x.id === id ? { ...x, statut, ...(statut === 'envoye' && !x.dateEnvoi ? { dateEnvoi: today() } : {}), ...(statut === 'accepte' ? { dateAcceptation: today() } : {}) } : x)));
  if (d && d.prospectId) addEvent(d.prospectId, 'devis', `Devis ${d.numero} : ${DEVIS_STATUTS[statut]?.label || statut}`);
  toast(`Devis marqué « ${DEVIS_STATUTS[statut]?.label || statut} »`);
}

/* ---------------- Factures ---------------- */
export function saveFacture(f) {
  if (f.id) {
    setList('factures', (l) => l.map((x) => (x.id === f.id ? { ...x, ...f } : x)));
    toast('Facture mise à jour');
    return f.id;
  }
  const numero = nextNumero(db.get().factures, 'FAC');
  const nf = {
    id: uid(),
    numero,
    devisId: f.devisId || null,
    prospectId: f.prospectId || null,
    clientNom: f.clientNom || '',
    clientAdresse: f.clientAdresse || '',
    lignes: f.lignes && f.lignes.length ? f.lignes.map((l) => ({ ...l, id: uid() })) : [{ id: uid(), designation: '', quantite: 1, prixUnitaire: 0, tva: 20 }],
    remise: Number(f.remise) || 0,
    statut: 'a_payer',
    dateEmission: f.dateEmission || today(),
    dateEcheance: f.dateEcheance || addDays(today(), 30),
    datePaiement: null,
    moyenPaiement: '',
    notes: f.notes || '',
  };
  setList('factures', (l) => [nf, ...l]);
  if (nf.prospectId) addEvent(nf.prospectId, 'facture', `Facture ${numero} émise`);
  toast(`Facture ${numero} créée`);
  return nf.id;
}
export function devisToFacture(devisId) {
  const d = db.get().devisList.find((x) => x.id === devisId);
  if (!d) return null;
  if (d.factureId && db.get().factures.some((f) => f.id === d.factureId)) return d.factureId;
  const id = saveFacture({ devisId: d.id, prospectId: d.prospectId, clientNom: d.clientNom, clientAdresse: d.clientAdresse, lignes: d.lignes, remise: d.remise, notes: d.notes });
  setList('devisList', (l) => l.map((x) => (x.id === devisId ? { ...x, factureId: id, statut: 'accepte' } : x)));
  return id;
}
export function setFactureStatut(id, statut, moyen) {
  const f = db.get().factures.find((x) => x.id === id);
  setList('factures', (l) => l.map((x) => (x.id === id ? { ...x, statut, datePaiement: statut === 'payee' ? today() : null, moyenPaiement: statut === 'payee' ? moyen || x.moyenPaiement || '' : x.moyenPaiement } : x)));
  if (f && f.prospectId) addEvent(f.prospectId, 'facture', `Facture ${f.numero} : ${FACTURE_STATUTS[statut]?.label || statut}`);
  toast(`Facture ${FACTURE_STATUTS[statut]?.label.toLowerCase() || statut}`);
}
export function deleteFacture(id) {
  undoable('Facture supprimée', () => {
    setList('factures', (l) => l.filter((x) => x.id !== id));
    setList('devisList', (l) => l.map((d) => (d.factureId === id ? { ...d, factureId: null } : d)));
  });
}

/* ---------------- Tâches ---------------- */
export function saveTask(t) {
  if (t.id) {
    setList('tasks', (l) => l.map((x) => (x.id === t.id ? { ...x, ...t } : x)));
    toast('Tâche mise à jour');
    return;
  }
  const nt = { id: uid(), title: t.title || '', prospectId: t.prospectId || null, due: t.due || today(), heure: t.heure || '', priorite: t.priorite || '', notes: t.notes || '', done: false, createdAt: today() };
  setList('tasks', (l) => [nt, ...l]);
  if (nt.prospectId) addEvent(nt.prospectId, 'task', `Tâche : ${nt.title}`);
  toast('Tâche ajoutée');
}
export function toggleTask(id) {
  setList('tasks', (l) => l.map((x) => (x.id === id ? { ...x, done: !x.done, doneAt: !x.done ? today() : null } : x)));
}
export function deleteTask(id) {
  undoable('Tâche supprimée', () => setList('tasks', (l) => l.filter((x) => x.id !== id)));
}
