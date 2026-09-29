// Fiche prospect (panneau latéral), formulaire d'édition et replanification.
import { useState, useMemo } from 'preact/hooks';
import { db, useStore, patchProspect } from '../lib/store.js';
import { open, close } from '../lib/nav.js';
import { STATUTS, STATUT_ORDER, SECTEURS, CANAUX, PRIORITES, OUTCOMES } from '../lib/constants.js';
import { saveProspect, deleteProspects, setStatut, setRelance, findDuplicate, toggleTask } from '../lib/actions.js';
import { totals, isDevisExpired, isFactureLate, ancienneteJours } from '../lib/business.js';
import { fmtDate, fmtDateFull, fmtWhen, fmtRelative, fmtPhone, waPhone, eur, fmtDuration, today, plural } from '../lib/util.js';
import { Drawer, Modal, Button, IconButton, Menu, Field, Input, Textarea, Select, Segmented, StatusBadge, PrioriteBadge, DevisBadge, FactureBadge, Avatar, Badge, Checkbox, cx, EmptyState } from '../components/ui.jsx';
import { Icon } from '../components/icons.jsx';
import { ReminderPicker } from './Call.jsx';

const EVENT_ICON = { call: ['phone', 'blue'], status: ['flag', 'violet'], create: ['plus', 'slate'], relance: ['calendarClock', 'sky'], devis: ['fileText', 'indigo'], facture: ['receipt', 'emerald'], email: ['mail', 'cyan'], task: ['checkSquare', 'amber'], note: ['pencil', 'slate'] };

function timeline(p) {
  const calls = (p.callLog || []).map((c) => {
    const o = OUTCOMES.find((x) => x.id === c.outcome);
    return { type: 'call', date: c.date, time: c.time || '', title: `Appel — ${o ? o.label : c.outcome}`, note: c.note, extra: c.duration ? fmtDuration(c.duration) : '', tone: o ? o.tone : 'blue' };
  });
  const ev = (p.events || []).map((e) => ({ type: e.type, date: e.date, time: e.time || '', title: e.text }));
  return [...calls, ...ev].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}

export function statusMenuItems(p) {
  return [{ header: 'Changer le statut' }, ...STATUT_ORDER.map((s) => ({ label: STATUTS[s].label, dot: STATUTS[s].tone, active: p.statut === s, onClick: () => setStatut(p.id, s) }))];
}

export function confirmDelete(ids, after) {
  open('confirm', {
    title: ids.length > 1 ? `Supprimer ${ids.length} prospects ?` : 'Supprimer ce prospect ?',
    text: 'Son historique d\'appels et ses tâches seront supprimés. Vous pourrez annuler juste après.',
    confirmLabel: 'Supprimer',
    danger: true,
    onConfirm: () => {
      deleteProspects(ids);
      after && after();
    },
  });
}

export function ProspectDetail({ ov, onClose }) {
  const p = useStore(db, (s) => s.prospects.find((x) => x.id === ov.id));
  const { devisList, factures, tasks } = useStore(db);
  const [editNotes, setEditNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const tl = useMemo(() => (p ? timeline(p) : []), [p]);
  if (!p) return null;
  const docs = [
    ...devisList.filter((d) => d.prospectId === p.id).map((d) => ({ kind: 'devis', d })),
    ...factures.filter((f) => f.prospectId === p.id).map((f) => ({ kind: 'facture', d: f })),
  ];
  const myTasks = tasks.filter((t) => t.prospectId === p.id).sort((a, b) => Number(a.done) - Number(b.done) || (a.due || '').localeCompare(b.due || ''));
  const late = p.prochaineRelance && p.prochaineRelance < today();
  const closed = ['client_signe', 'perdu', 'resilie'].includes(p.statut);
  const tel = (p.telephone || '').replace(/\s/g, '');

  return (
    <Drawer onClose={onClose} width={600}>
      <div class="drawer-head">
        <IconButton icon="x" label="Fermer" onClick={onClose} />
        <span class="grow" />
        <Menu trigger={<Button size="sm" icon="flag" iconRight="chevronDown">{STATUTS[p.statut]?.short || 'Statut'}</Button>} items={statusMenuItems(p)} />
        <Button size="sm" icon="pencil" onClick={() => open('prospectForm', { id: p.id })}>
          Modifier
        </Button>
        <Menu
          trigger={<IconButton icon="more" label="Plus d'actions" />}
          items={[
            { label: 'Planifier une relance', icon: 'calendarClock', onClick: () => open('reschedule', { id: p.id }) },
            { label: 'Nouvelle tâche', icon: 'checkSquare', onClick: () => open('taskForm', { prospectId: p.id }) },
            { label: 'Nouveau devis', icon: 'fileText', onClick: () => open('devisForm', { prospectId: p.id }) },
            { label: 'Nouvelle facture', icon: 'receipt', onClick: () => open('factureForm', { prospectId: p.id }) },
            { label: 'Composer un email', icon: 'mail', onClick: () => open('email', { id: p.id }) },
            '-',
            p.statut === 'client_signe' && {
              label: 'Marquer comme résilié',
              icon: 'logout',
              danger: true,
              onClick: () => open('confirm', { title: 'Marquer ce client comme résilié ?', text: 'Son abonnement ne sera plus compté dans le MRR.', confirmLabel: 'Résilier', danger: true, onConfirm: () => setStatut(p.id, 'resilie') }),
            },
            { label: 'Supprimer le prospect', icon: 'trash', danger: true, onClick: () => confirmDelete([p.id], onClose) },
          ]}
        />
      </div>
      <div class="drawer-body">
        <div class="p-hero">
          <div class="row gap-12" style={{ alignItems: 'flex-start' }}>
            <Avatar name={p.entreprise} size={52} />
            <div class="grow min-w-0">
              <h2 class="p-name">{p.entreprise}</h2>
              <div class="text-2 sm mt-4">{[p.contact, p.secteur, p.ville].filter(Boolean).join(' · ')}</div>
              <div class="row-wrap mt-8">
                <StatusBadge statut={p.statut} />
                <PrioriteBadge priorite={p.priorite} />
                {(p.tags || []).map((t) => (
                  <span class="tag">
                    <Icon name="tag" size={11} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {!closed && (
            <button class={cx('pill mt-12', late && 'tone-rose')} style={late ? { color: 'var(--tt)', borderColor: 'rgb(var(--t) / .4)' } : null} onClick={() => open('reschedule', { id: p.id })}>
              <Icon name="calendarClock" size={13} />
              {p.prochaineRelance ? `Relance : ${fmtWhen(p.prochaineRelance, p.prochaineRelanceHeure)}${late ? ' (en retard)' : ''}` : 'Aucune relance — planifier'}
            </button>
          )}
          <div class="p-actions">
            <button class="p-action primary" onClick={() => open('call', { id: p.id, mode: 'live' })}>
              <Icon name="phone" size={18} />
              Appeler
            </button>
            <button class="p-action" onClick={() => open('call', { id: p.id, mode: 'quick' })}>
              <Icon name="pencil" size={18} />
              Résultat
            </button>
            <button class="p-action" onClick={() => open('email', { id: p.id })}>
              <Icon name="mail" size={18} />
              Email
            </button>
            <a class={cx('p-action', !tel && 'disabled')} href={tel ? `sms:${tel}` : undefined}>
              <Icon name="sms" size={18} />
              SMS
            </a>
            <a class={cx('p-action', !tel && 'disabled')} href={tel ? `https://wa.me/${waPhone(tel)}` : undefined} target="_blank" rel="noopener">
              <Icon name="whatsapp" size={18} />
              WhatsApp
            </a>
          </div>
        </div>

        {(p.statut === 'client_signe' || p.statut === 'resilie' || p.dealValue > 0 || p.mrrValue > 0) && (
          <div class="p-section">
            <div class="values-grid">
              <div class="value-box">
                <div class="l">Projet initial</div>
                <div class="v">{eur(p.dealValue)}</div>
              </div>
              <div class="value-box">
                <div class="l">Abonnement mensuel</div>
                <div class="v">{eur(p.mrrValue)}</div>
              </div>
            </div>
            {p.signedAt && (
              <div class="xs text-3 mt-8">
                Signé le {fmtDateFull(p.signedAt)} · client depuis {plural(ancienneteJours(p), 'jour')}
                {p.resilieAt ? ` · résilié le ${fmtDateFull(p.resilieAt)}` : ''}
              </div>
            )}
          </div>
        )}

        <div class="p-section">
          <div class="p-section-title">Coordonnées</div>
          <dl class="kv">
            <dt>Contact</dt>
            <dd>{p.contact || '—'}</dd>
            <dt>Téléphone</dt>
            <dd>{p.telephone ? <a href={`tel:${tel}`}>{fmtPhone(p.telephone)}</a> : '—'}</dd>
            <dt>Email</dt>
            <dd>{p.email ? <a href={`mailto:${p.email}`}>{p.email}</a> : '—'}</dd>
            <dt>Ville</dt>
            <dd>
              {p.ville || p.adresse ? (
                <a href={`https://www.google.com/maps/search/${encodeURIComponent([p.entreprise, p.adresse, p.ville].filter(Boolean).join(' '))}`} target="_blank" rel="noopener">
                  {[p.adresse, p.ville].filter(Boolean).join(', ')}
                </a>
              ) : (
                '—'
              )}
            </dd>
            {p.site && (
              <>
                <dt>Site web</dt>
                <dd>
                  <a href={/^https?:/.test(p.site) ? p.site : 'https://' + p.site} target="_blank" rel="noopener">
                    {p.site}
                  </a>
                </dd>
              </>
            )}
            {p.siret && (
              <>
                <dt>SIRET</dt>
                <dd class="mono">{p.siret}</dd>
              </>
            )}
            <dt>Canal</dt>
            <dd>{p.canal || '—'}</dd>
            <dt>Créé le</dt>
            <dd>{fmtDateFull(p.createdAt)}</dd>
          </dl>
        </div>

        <div class="p-section">
          <div class="p-section-title">
            Notes
            {!editNotes && (
              <button
                class="link-btn"
                onClick={() => {
                  setNotes(p.notes || '');
                  setEditNotes(true);
                }}
              >
                <Icon name="pencil" size={12} /> Modifier
              </button>
            )}
          </div>
          {editNotes ? (
            <div class="col">
              <Textarea value={notes} onInput={(e) => setNotes(e.target.value)} autoFocus />
              <div class="row" style={{ justifyContent: 'flex-end' }}>
                <Button size="sm" variant="ghost" onClick={() => setEditNotes(false)}>
                  Annuler
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    patchProspect(p.id, { notes });
                    setEditNotes(false);
                  }}
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          ) : p.notes ? (
            <div class="sm" style={{ whiteSpace: 'pre-wrap' }}>
              {p.notes}
            </div>
          ) : (
            <div class="sm text-3">Aucune note.</div>
          )}
        </div>

        <div class="p-section">
          <div class="p-section-title">
            Tâches
            <button class="link-btn" onClick={() => open('taskForm', { prospectId: p.id })}>
              <Icon name="plus" size={12} /> Ajouter
            </button>
          </div>
          {myTasks.length ? (
            <div class="col" style={{ gap: 8 }}>
              {myTasks.map((t) => (
                <div class={cx('row', t.done && 'text-3')} style={{ alignItems: 'flex-start' }}>
                  <Checkbox class="round" checked={t.done} onChange={() => toggleTask(t.id)} />
                  <button class="grow min-w-0" style={{ textAlign: 'left' }} onClick={() => open('taskForm', { id: t.id })}>
                    <div class="sm fw-5" style={t.done ? { textDecoration: 'line-through' } : null}>
                      {t.title}
                    </div>
                    <div class="xs text-3">{fmtRelative(t.due)}{t.heure ? ` · ${t.heure}` : ''}</div>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div class="sm text-3">Aucune tâche.</div>
          )}
        </div>

        <div class="p-section">
          <div class="p-section-title">
            Devis & factures
            <button class="link-btn" onClick={() => open('devisForm', { prospectId: p.id })}>
              <Icon name="plus" size={12} /> Devis
            </button>
          </div>
          {docs.length ? (
            <div class="col" style={{ gap: 6 }}>
              {docs.map(({ kind, d }) => (
                <button class="row" style={{ padding: '8px 10px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)' }} onClick={() => open(kind, { id: d.id })}>
                  <Icon name={kind === 'devis' ? 'fileText' : 'receipt'} size={15} class="text-3" />
                  <span class="grow min-w-0 truncate sm fw-6" style={{ textAlign: 'left' }}>
                    {d.numero}
                  </span>
                  <span class="sm num">{eur(totals(d.lignes, d.remise).totalTTC)}</span>
                  {kind === 'devis' ? <DevisBadge statut={d.statut} expired={isDevisExpired(d)} /> : <FactureBadge statut={d.statut} late={isFactureLate(d)} />}
                </button>
              ))}
            </div>
          ) : (
            <div class="sm text-3">Aucun document.</div>
          )}
        </div>

        <div class="p-section">
          <div class="p-section-title">Historique · {plural((p.callLog || []).length, 'appel')}</div>
          {tl.length ? (
            <div class="timeline">
              {tl.map((e) => {
                const [ic, tone] = EVENT_ICON[e.type] || EVENT_ICON.note;
                return (
                  <div class="tl-item">
                    <span class={cx('tl-icon', `tone-${e.type === 'call' ? e.tone : tone}`)}>
                      <Icon name={ic} size={13} />
                    </span>
                    <div class="tl-body">
                      <div class="row between gap-6">
                        <span class="tl-title">{e.title}</span>
                        <span class="tl-date shrink-0">
                          {fmtDate(e.date)}
                          {e.time ? ` · ${e.time}` : ''}
                          {e.extra ? ` · ${e.extra}` : ''}
                        </span>
                      </div>
                      {e.note && <div class="tl-note">{e.note}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState compact icon="history" title="Aucune activité" text="Les appels, changements de statut et documents apparaîtront ici." />
          )}
        </div>
      </div>
    </Drawer>
  );
}

export function ProspectForm({ ov, onClose }) {
  const existing = useStore(db, (s) => (ov.id ? s.prospects.find((x) => x.id === ov.id) : null));
  const init = existing || { entreprise: '', contact: '', telephone: '', email: '', secteur: SECTEURS[0], canal: CANAUX[0], ville: '', adresse: '', siret: '', site: '', priorite: '', tags: [], notes: '', prochaineRelance: today(), prochaineRelanceHeure: '', ...(ov.initial || {}) };
  const [f, setF] = useState({ ...init, tagsText: (init.tags || []).join(', ') });
  const [more, setMore] = useState(!!existing && !!(existing.adresse || existing.siret || existing.site));
  const set = (k) => (e) => setF((o) => ({ ...o, [k]: e && e.target ? e.target.value : e }));
  const dup = f.entreprise.trim().length > 2 || (f.telephone || '').replace(/\D/g, '').length >= 9 ? findDuplicate(f, existing && existing.id) : null;
  const signed = f.statut === 'client_signe' || f.statut === 'resilie';

  function submit(e) {
    e && e.preventDefault();
    if (!f.entreprise.trim()) return;
    const { tagsText, ...rest } = f;
    const data = {
      ...rest,
      entreprise: f.entreprise.trim(),
      tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
      prochaineRelanceHeure: f.prochaineRelanceHeure || null,
      dealValue: Number(f.dealValue) || 0,
      mrrValue: Number(f.mrrValue) || 0,
    };
    const id = saveProspect(data);
    onClose();
    if (!existing && ov.openAfter !== false) open('prospect', { id });
  }

  return (
    <Modal
      title={existing ? 'Modifier le prospect' : 'Nouveau prospect'}
      subtitle={existing ? existing.entreprise : 'Ajoutez une entreprise à votre pipeline'}
      icon={existing ? 'pencil' : 'userPlus'}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" icon="check" onClick={submit} disabled={!f.entreprise.trim()}>
            {existing ? 'Enregistrer' : 'Ajouter le prospect'}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} class="stack">
        <div class="grid-2">
          <Field label="Entreprise" required class="span-2">
            <Input value={f.entreprise} onInput={set('entreprise')} placeholder="Ex : Agence Immo du Centre" data-autofocus />
          </Field>
          {dup && (
            <div class="callout tone-amber span-2">
              <Icon name="alert" size={16} />
              <span>
                Doublon possible : <strong>{dup.entreprise}</strong> {dup.telephone && `(${fmtPhone(dup.telephone)})`} existe déjà.{' '}
                <button type="button" class="link-btn" onClick={() => (onClose(), open('prospect', { id: dup.id }))}>
                  Ouvrir la fiche
                </button>
              </span>
            </div>
          )}
          <Field label="Contact">
            <Input value={f.contact} onInput={set('contact')} placeholder="M. Dupont" />
          </Field>
          <Field label="Téléphone">
            <Input type="tel" inputMode="tel" value={f.telephone} onInput={set('telephone')} placeholder="06 12 34 56 78" />
          </Field>
          <Field label="Email">
            <Input type="email" inputMode="email" value={f.email} onInput={set('email')} placeholder="contact@entreprise.fr" />
          </Field>
          <Field label="Ville">
            <Input value={f.ville} onInput={set('ville')} placeholder="Lyon" />
          </Field>
          <Field label="Secteur">
            <Select value={f.secteur} onChange={set('secteur')} options={SECTEURS.includes(f.secteur) ? SECTEURS : [f.secteur, ...SECTEURS]} />
          </Field>
          <Field label="Canal d'acquisition">
            <Select value={f.canal} onChange={set('canal')} options={CANAUX.includes(f.canal) ? CANAUX : [f.canal, ...CANAUX]} />
          </Field>
          <Field label="Priorité">
            <Segmented
              value={f.priorite || ''}
              onChange={(v) => setF((o) => ({ ...o, priorite: v }))}
              options={[{ value: '', label: 'Aucune' }, ...Object.entries(PRIORITES).map(([k, v]) => ({ value: k, label: v.label }))]}
            />
          </Field>
          <Field label="Étiquettes" hint="Séparées par des virgules">
            <Input value={f.tagsText} onInput={set('tagsText')} placeholder="Décideur, Multi-sites" />
          </Field>
          {existing && (
            <Field label="Statut">
              <Select value={f.statut} onChange={set('statut')} options={STATUT_ORDER.map((s) => ({ value: s, label: STATUTS[s].label }))} />
            </Field>
          )}
          {signed && (
            <>
              <Field label="Montant projet (€)">
                <Input type="number" inputMode="decimal" value={f.dealValue} onInput={set('dealValue')} />
              </Field>
              <Field label="Abonnement / mois (€)">
                <Input type="number" inputMode="decimal" value={f.mrrValue} onInput={set('mrrValue')} />
              </Field>
              <Field label="Date de signature">
                <Input type="date" value={f.signedAt || ''} onInput={set('signedAt')} />
              </Field>
            </>
          )}
        </div>
        {!['client_signe', 'perdu', 'resilie'].includes(f.statut) && (
          <div>
            <div class="field-label mb-8">Prochaine relance</div>
            <ReminderPicker date={f.prochaineRelance} heure={f.prochaineRelanceHeure} onChange={(d, h) => setF((o) => ({ ...o, prochaineRelance: d, prochaineRelanceHeure: h }))} />
          </div>
        )}
        <Field label="Notes">
          <Textarea value={f.notes} onInput={set('notes')} placeholder="Contexte, besoins identifiés…" />
        </Field>
        {more ? (
          <div class="grid-2">
            <Field label="Adresse" class="span-2">
              <Input value={f.adresse} onInput={set('adresse')} placeholder="12 rue des Lilas" />
            </Field>
            <Field label="SIRET">
              <Input value={f.siret} onInput={set('siret')} placeholder="000 000 000 00000" />
            </Field>
            <Field label="Site web">
              <Input value={f.site} onInput={set('site')} placeholder="entreprise.fr" />
            </Field>
          </div>
        ) : (
          <button type="button" class="link-btn" onClick={() => setMore(true)}>
            <Icon name="plus" size={13} /> Adresse, SIRET, site web
          </button>
        )}
        <button type="submit" hidden />
      </form>
    </Modal>
  );
}

export function RescheduleModal({ ov, onClose }) {
  const p = useStore(db, (s) => s.prospects.find((x) => x.id === ov.id));
  const [d, setD] = useState(p ? p.prochaineRelance || today() : today());
  const [h, setH] = useState(p ? p.prochaineRelanceHeure || '' : '');
  if (!p) return null;
  return (
    <Modal
      title="Planifier une relance"
      subtitle={p.entreprise}
      icon="calendarClock"
      size="sm"
      onClose={onClose}
      noAutoFocus
      footer={
        <>
          {p.prochaineRelance && (
            <Button
              variant="danger-ghost"
              onClick={() => {
                setRelance(p.id, null, null);
                onClose();
              }}
            >
              Retirer
            </Button>
          )}
          <span class="spacer" />
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="primary"
            icon="check"
            onClick={() => {
              setRelance(p.id, d, h);
              onClose();
            }}
          >
            Planifier
          </Button>
        </>
      }
    >
      <ReminderPicker
        date={d}
        heure={h}
        onChange={(a, b) => {
          setD(a);
          setH(b);
        }}
      />
    </Modal>
  );
}
