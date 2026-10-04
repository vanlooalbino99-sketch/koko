// Prospects : tableau triable (bureau), cartes (mobile), filtres, actions groupées, export ; Pipeline kanban.
import { useMemo, useState } from 'preact/hooks';
import { db, useStore } from '../lib/store.js';
import { open } from '../lib/nav.js';
import { ui, setUi } from '../lib/theme.js';
import { STATUTS, STATUT_ORDER, PIPELINE_COLUMNS, SECTEURS, PRIORITES } from '../lib/constants.js';
import { setStatut } from '../lib/actions.js';
import { norm, digits, fmtPhone, fmtRelative, fmtDate, eur, compact, today, toCsv, download, plural } from '../lib/util.js';
import { PageHeader, Button, IconButton, SearchInput, Segmented, StatusBadge, PrioriteBadge, Avatar, Checkbox, Menu, EmptyState, Card, cx, useDesktop } from '../components/ui.jsx';
import { Icon } from '../components/icons.jsx';
import { statusMenuItems, confirmDelete } from './ProspectDetail.jsx';
import { startSession, loadDemo } from './Today.jsx';

export function exportProspectsCsv(list) {
  const csv = toCsv(list, [
    { key: 'entreprise', label: 'Entreprise' },
    { key: 'contact', label: 'Contact' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'email', label: 'Email' },
    { key: 'ville', label: 'Ville' },
    { key: 'secteur', label: 'Secteur' },
    { key: 'canal', label: 'Canal' },
    { label: 'Statut', get: (p) => STATUTS[p.statut]?.label || p.statut },
    { label: 'Priorité', get: (p) => PRIORITES[p.priorite]?.label || '' },
    { label: 'Étiquettes', get: (p) => (p.tags || []).join(', ') },
    { key: 'prochaineRelance', label: 'Prochaine relance' },
    { key: 'dealValue', label: 'Montant projet' },
    { key: 'mrrValue', label: 'MRR' },
    { label: 'Nb appels', get: (p) => (p.callLog || []).length },
    { key: 'siret', label: 'SIRET' },
    { key: 'notes', label: 'Notes' },
    { key: 'createdAt', label: 'Créé le' },
  ]);
  download(`prospects-${today()}.csv`, csv, 'text/csv;charset=utf-8');
}

const SORTS = {
  relance: { label: 'Prochaine relance', fn: (a, b) => (a.prochaineRelance || '9999') .localeCompare(b.prochaineRelance || '9999') || (a.prochaineRelanceHeure || '').localeCompare(b.prochaineRelanceHeure || '') },
  entreprise: { label: 'Nom', fn: (a, b) => a.entreprise.localeCompare(b.entreprise, 'fr') },
  statut: { label: 'Statut', fn: (a, b) => STATUT_ORDER.indexOf(a.statut) - STATUT_ORDER.indexOf(b.statut) },
  priorite: { label: 'Priorité', fn: (a, b) => (PRIORITES[b.priorite]?.rank || 0) - (PRIORITES[a.priorite]?.rank || 0) },
  valeur: { label: 'Valeur', fn: (a, b) => b.dealValue + b.mrrValue * 12 - (a.dealValue + a.mrrValue * 12) },
  recent: { label: 'Ajout récent', fn: (a, b) => (b.createdAt || '').localeCompare(a.createdAt || '') },
  appels: { label: "Nombre d'appels", fn: (a, b) => (b.callLog || []).length - (a.callLog || []).length },
};

function useFiltered(prospects, { q, statut, secteur, priorite, sort, dir }) {
  return useMemo(() => {
    const n = norm(q);
    const d = digits(q);
    let l = prospects.filter((p) => {
      if (statut === 'open' && ['client_signe', 'perdu', 'resilie'].includes(p.statut)) return false;
      if (statut !== 'all' && statut !== 'open' && p.statut !== statut) return false;
      if (secteur && p.secteur !== secteur) return false;
      if (priorite && p.priorite !== priorite) return false;
      if (n && !(norm(p.entreprise).includes(n) || norm(p.contact).includes(n) || norm(p.ville).includes(n) || norm(p.email).includes(n) || (p.tags || []).some((t) => norm(t).includes(n)) || (d.length >= 3 && digits(p.telephone).includes(d)))) return false;
      return true;
    });
    l = [...l].sort(SORTS[sort].fn);
    if (dir < 0) l.reverse();
    return l;
  }, [prospects, q, statut, secteur, priorite, sort, dir]);
}

export function Prospects() {
  const prospects = useStore(db, (s) => s.prospects);
  const view = useStore(ui, (s) => s.prospectView);
  const desktop = useDesktop();
  const [q, setQ] = useState('');
  const [statut, setStatutF] = useState('all');
  const [secteur, setSecteur] = useState('');
  const [priorite, setPriorite] = useState('');
  const [sort, setSort] = useState('relance');
  const [dir, setDir] = useState(1);
  const [sel, setSel] = useState(new Set());
  const list = useFiltered(prospects, { q, statut, secteur, priorite, sort, dir });
  const counts = useMemo(() => {
    const c = { all: prospects.length, open: 0 };
    prospects.forEach((p) => {
      c[p.statut] = (c[p.statut] || 0) + 1;
      if (!['client_signe', 'perdu', 'resilie'].includes(p.statut)) c.open++;
    });
    return c;
  }, [prospects]);
  const t = today();
  const selIds = [...sel].filter((id) => list.some((p) => p.id === id));
  const allSel = list.length > 0 && selIds.length === list.length;
  const toggle = (id) =>
    setSel((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const sortBy = (k) => {
    if (sort === k) setDir(-dir);
    else {
      setSort(k);
      setDir(1);
    }
  };
  const Th = ({ k, children, class: c }) => (
    <th class={cx('sortable', c)} onClick={() => sortBy(k)}>
      {children}
      {sort === k && <Icon name={dir > 0 ? 'chevronDown' : 'chevronUp'} size={12} class="sort-ic" />}
    </th>
  );
  const useTable = desktop && view !== 'cards';

  if (!prospects.length)
    return (
      <>
        <PageHeader title="Prospects" subtitle="Votre base de leads et de clients" />
        <Card>
          <EmptyState icon="users" title="Aucun prospect" text="Ajoutez votre premier prospect ou importez une liste de leads.">
            <Button variant="primary" icon="userPlus" onClick={() => open('prospectForm')}>
              Ajouter
            </Button>
            <Button icon="upload" onClick={() => open('import')}>
              Importer
            </Button>
            <Button variant="ghost" icon="sparkles" onClick={loadDemo}>
              Charger la démo
            </Button>
          </EmptyState>
        </Card>
      </>
    );

  return (
    <>
      <PageHeader title="Prospects" subtitle={`${plural(prospects.length, 'entreprise')} · ${counts.open} en cours de prospection`}>
        <Button icon="download" onClick={() => exportProspectsCsv(list)} class="hide-mobile">
          Exporter
        </Button>
        <Button icon="upload" onClick={() => open('import')}>
          Importer
        </Button>
        <Button variant="primary" icon="plus" onClick={() => open('prospectForm')}>
          Nouveau
        </Button>
      </PageHeader>

      <div class="chips">
        {[['all', 'Tous'], ['open', 'En cours'], ...STATUT_ORDER.map((s) => [s, STATUTS[s].label])].map(([k, label]) =>
          k === 'all' || k === 'open' || counts[k] ? (
            <button class={cx('chip', statut === k && 'active', STATUTS[k] && `tone-${STATUTS[k].tone}`)} onClick={() => setStatutF(k)}>
              {STATUTS[k] && <span class="badge-dot" />}
              {label}
              <span class="chip-count">{counts[k] || 0}</span>
            </button>
          ) : null,
        )}
      </div>

      <div class="toolbar">
        <SearchInput value={q} onInput={setQ} placeholder="Entreprise, contact, ville, téléphone, étiquette…" />
        <Menu
          trigger={
            <Button icon="filter" variant={secteur || priorite ? 'soft' : 'secondary'}>
              Filtres{secteur || priorite ? ` (${[secteur, priorite].filter(Boolean).length})` : ''}
            </Button>
          }
          align="left"
          width={240}
          items={[
            { header: 'Secteur' },
            { label: 'Tous les secteurs', active: !secteur, onClick: () => setSecteur('') },
            ...[...new Set([...SECTEURS, ...prospects.map((p) => p.secteur)])].filter(Boolean).map((s) => ({ label: s, active: secteur === s, onClick: () => setSecteur(s) })),
            '-',
            { header: 'Priorité' },
            { label: 'Toutes', active: !priorite, onClick: () => setPriorite('') },
            ...Object.entries(PRIORITES).map(([k, v]) => ({ label: v.label, dot: v.tone, active: priorite === k, onClick: () => setPriorite(k) })),
          ]}
        />
        <Menu
          trigger={<Button icon="arrowUpDown">{SORTS[sort].label}</Button>}
          align="left"
          items={[{ header: 'Trier par' }, ...Object.entries(SORTS).map(([k, v]) => ({ label: v.label, active: sort === k, onClick: () => (setSort(k), setDir(1)) }))]}
        />
        <span class="grow" />
        {desktop && (
          <Segmented
            size="sm"
            value={view === 'cards' ? 'cards' : 'table'}
            onChange={(v) => setUi({ prospectView: v })}
            options={[
              { value: 'table', icon: 'table', title: 'Tableau' },
              { value: 'cards', icon: 'list', title: 'Liste' },
            ]}
          />
        )}
      </div>

      {!list.length ? (
        <Card>
          <EmptyState icon="search" title="Aucun résultat" text="Modifiez la recherche ou les filtres.">
            <Button
              onClick={() => {
                setQ('');
                setStatutF('all');
                setSecteur('');
                setPriorite('');
              }}
            >
              Réinitialiser les filtres
            </Button>
          </EmptyState>
        </Card>
      ) : useTable ? (
        <Card pad={false}>
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th class="td-check">
                    <Checkbox checked={allSel} indeterminate={selIds.length > 0 && !allSel} onChange={() => setSel(allSel ? new Set() : new Set(list.map((p) => p.id)))} label="Tout sélectionner" />
                  </th>
                  <Th k="entreprise">Entreprise</Th>
                  <Th k="statut">Statut</Th>
                  <Th k="priorite">Priorité</Th>
                  <th>Téléphone</th>
                  <th>Secteur · Ville</th>
                  <Th k="relance">Relance</Th>
                  <Th k="valeur" class="right">
                    Valeur
                  </Th>
                  <th class="td-actions" />
                </tr>
              </thead>
              <tbody>
                {list.map((p) => {
                  const late = p.prochaineRelance && p.prochaineRelance < t && !['client_signe', 'perdu', 'resilie'].includes(p.statut);
                  return (
                    <tr class={cx('clickable', sel.has(p.id) && 'selected')} onClick={() => open('prospect', { id: p.id })}>
                      <td class="td-check">
                        <Checkbox checked={sel.has(p.id)} onChange={() => toggle(p.id)} />
                      </td>
                      <td>
                        <div class="row gap-12">
                          <Avatar name={p.entreprise} size={32} />
                          <div class="min-w-0">
                            <div class="cell-main truncate" style={{ maxWidth: 260 }}>
                              {p.entreprise}
                            </div>
                            <div class="cell-sub truncate" style={{ maxWidth: 260 }}>
                              {p.contact || '—'}
                              {(p.tags || []).length ? ` · ${p.tags.join(', ')}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <Menu trigger={<button class="menu-trigger" title="Changer le statut"><StatusBadge statut={p.statut} /></button>} items={statusMenuItems(p)} align="left" />
                      </td>
                      <td>{p.priorite ? <PrioriteBadge priorite={p.priorite} /> : <span class="text-3">—</span>}</td>
                      <td class="num" style={{ whiteSpace: 'nowrap' }}>
                        {p.telephone ? fmtPhone(p.telephone) : <span class="text-3">—</span>}
                      </td>
                      <td>
                        <div class="sm truncate" style={{ maxWidth: 200 }}>
                          {p.secteur}
                        </div>
                        <div class="cell-sub">{p.ville || '—'}</div>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {p.prochaineRelance ? (
                          <span class={cx('sm', late && 'text-bad fw-6')}>
                            {fmtRelative(p.prochaineRelance)}
                            {p.prochaineRelanceHeure ? ` · ${p.prochaineRelanceHeure}` : ''}
                          </span>
                        ) : (
                          <span class="text-3">—</span>
                        )}
                      </td>
                      <td class="right num">
                        {p.mrrValue ? (
                          <span>
                            {eur(p.mrrValue)}
                            <span class="text-3 xs">/m</span>
                          </span>
                        ) : p.dealValue ? (
                          eur(p.dealValue)
                        ) : (
                          <span class="text-3">—</span>
                        )}
                      </td>
                      <td class="td-actions" onClick={(e) => e.stopPropagation()}>
                        <div class="row gap-4">
                          <IconButton icon="phone" label="Appeler" onClick={() => open('call', { id: p.id, mode: 'live' })} />
                          <Menu
                            trigger={<IconButton icon="more" label="Actions" />}
                            items={[
                              { label: 'Ouvrir la fiche', icon: 'eye', onClick: () => open('prospect', { id: p.id }) },
                              { label: 'Modifier', icon: 'pencil', onClick: () => open('prospectForm', { id: p.id }) },
                              { label: 'Compte-rendu d\'appel', icon: 'pencil', onClick: () => open('call', { id: p.id, mode: 'quick' }) },
                              { label: 'Planifier une relance', icon: 'calendarClock', onClick: () => open('reschedule', { id: p.id }) },
                              { label: 'Composer un email', icon: 'mail', onClick: () => open('email', { id: p.id }) },
                              { label: 'Nouveau devis', icon: 'fileText', onClick: () => open('devisForm', { prospectId: p.id }) },
                              '-',
                              { label: 'Supprimer', icon: 'trash', danger: true, onClick: () => confirmDelete([p.id]) },
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card pad={false}>
          {list.map((p) => {
            const late = p.prochaineRelance && p.prochaineRelance < t && !['client_signe', 'perdu', 'resilie'].includes(p.statut);
            return (
              <div class={cx('list-item clickable', sel.has(p.id) && 'selected')} onClick={() => open('prospect', { id: p.id })} role="button">
                {sel.size > 0 ? <Checkbox checked={sel.has(p.id)} onChange={() => toggle(p.id)} /> : <Avatar name={p.entreprise} size={38} />}
                <div class="li-main">
                  <div class="li-title">{p.entreprise}</div>
                  <div class="li-sub">{[p.contact, p.secteur, p.ville].filter(Boolean).join(' · ') || '—'}</div>
                  <div class="row-wrap mt-4" style={{ gap: 6 }}>
                    <StatusBadge statut={p.statut} short />
                    <PrioriteBadge priorite={p.priorite} />
                    {p.prochaineRelance && (
                      <span class={cx('xs', late ? 'text-bad fw-6' : 'text-3')}>
                        <Icon name="clock" size={11} style={{ display: 'inline', verticalAlign: '-1px' }} /> {fmtRelative(p.prochaineRelance)}
                        {p.prochaineRelanceHeure ? ` ${p.prochaineRelanceHeure}` : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div class="row gap-4" onClick={(e) => e.stopPropagation()}>
                  <button class="call-btn" aria-label={`Appeler ${p.entreprise}`} onClick={() => open('call', { id: p.id, mode: 'live' })}>
                    <Icon name="phone" size={17} />
                  </button>
                  <Menu
                    trigger={<IconButton icon="moreV" label="Actions" />}
                    items={[
                      { label: 'Sélectionner', icon: 'checkSquare', onClick: () => toggle(p.id) },
                      { label: 'Modifier', icon: 'pencil', onClick: () => open('prospectForm', { id: p.id }) },
                      { label: 'Planifier une relance', icon: 'calendarClock', onClick: () => open('reschedule', { id: p.id }) },
                      ...statusMenuItems(p),
                      '-',
                      { label: 'Supprimer', icon: 'trash', danger: true, onClick: () => confirmDelete([p.id]) },
                    ]}
                  />
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {selIds.length > 0 && (
        <div class="bulk-bar">
          <span class="fw-6 sm">{plural(selIds.length, 'sélectionné')}</span>
          <span class="grow" />
          <Button size="sm" variant="soft" icon="zap" onClick={() => startSession(selIds)}>
            Session d'appels
          </Button>
          <Menu
            trigger={
              <Button size="sm" icon="flag" iconRight="chevronDown">
                Statut
              </Button>
            }
            items={STATUT_ORDER.map((s) => ({ label: STATUTS[s].label, dot: STATUTS[s].tone, onClick: () => (setStatut(selIds, s), setSel(new Set())) }))}
          />
          <Button size="sm" icon="download" onClick={() => exportProspectsCsv(list.filter((p) => sel.has(p.id)))}>
            Exporter
          </Button>
          <Button size="sm" variant="danger-ghost" icon="trash" onClick={() => confirmDelete(selIds, () => setSel(new Set()))}>
            Supprimer
          </Button>
          <IconButton icon="x" label="Désélectionner" onClick={() => setSel(new Set())} />
        </div>
      )}
    </>
  );
}

/* ---------------- Pipeline kanban ---------------- */
export function Pipeline() {
  const prospects = useStore(db, (s) => s.prospects);
  const [q, setQ] = useState('');
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(null);
  const [showLost, setShowLost] = useState(false);
  const n = norm(q);
  const cols = PIPELINE_COLUMNS.filter((c) => showLost || c !== 'perdu');
  const filtered = prospects.filter((p) => !n || norm(p.entreprise).includes(n) || norm(p.contact).includes(n) || norm(p.ville).includes(n));
  const openCount = prospects.filter((p) => !['client_signe', 'perdu', 'resilie'].includes(p.statut)).length;
  const potential = prospects.filter((p) => ['rdv_pris', 'audit_realise', 'proposition_envoyee'].includes(p.statut)).reduce((s, p) => s + (p.dealValue || 0) + (p.mrrValue || 0) * 12, 0);

  return (
    <>
      <PageHeader title="Pipeline" subtitle={`${plural(openCount, 'opportunité')} en cours${potential ? ` · ${eur(potential)} de valeur potentielle` : ''}`}>
        <Button variant="primary" icon="plus" onClick={() => open('prospectForm')}>
          Nouveau
        </Button>
      </PageHeader>
      <div class="toolbar">
        <SearchInput value={q} onInput={setQ} placeholder="Filtrer le pipeline…" />
        <Button variant={showLost ? 'soft' : 'secondary'} icon="eye" onClick={() => setShowLost(!showLost)}>
          {showLost ? 'Masquer les perdus' : 'Afficher les perdus'}
        </Button>
        <span class="xs text-3 hide-mobile">Glissez-déposez une carte pour changer son statut.</span>
      </div>
      <div class="kanban">
        {cols.map((c) => {
          const items = filtered.filter((p) => p.statut === c).sort((a, b) => (a.prochaineRelance || '9').localeCompare(b.prochaineRelance || '9'));
          const val = items.reduce((s, p) => s + (c === 'client_signe' ? p.mrrValue || 0 : (p.dealValue || 0) + (p.mrrValue || 0) * 12), 0);
          return (
            <div
              class={cx('kb-col', over === c && drag && 'drop')}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(c);
              }}
              onDragLeave={() => setOver((o) => (o === c ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/plain') || drag;
                setOver(null);
                setDrag(null);
                if (id) setStatut(id, c);
              }}
            >
              <div class="kb-head">
                <span class={cx('badge-dot', `tone-${STATUTS[c].tone}`)} style={{ width: 8, height: 8 }} />
                <span class="kb-title">{STATUTS[c].label}</span>
                <span class="kb-count">{items.length}</span>
                {val > 0 && <span class="kb-sum">{compact(val)} €{c === 'client_signe' ? '/m' : ''}</span>}
              </div>
              <div class="kb-body">
                {items.length ? (
                  items.map((p) => (
                    <div
                      class={cx('kb-card', drag === p.id && 'dragging')}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', p.id);
                        e.dataTransfer.effectAllowed = 'move';
                        setDrag(p.id);
                      }}
                      onDragEnd={() => {
                        setDrag(null);
                        setOver(null);
                      }}
                      onClick={() => open('prospect', { id: p.id })}
                      role="button"
                      tabIndex={0}
                    >
                      <div class="row between" style={{ alignItems: 'flex-start' }}>
                        <div class="min-w-0">
                          <div class="kb-card-title truncate">{p.entreprise}</div>
                          <div class="kb-card-sub truncate">{[p.contact, p.ville].filter(Boolean).join(' · ') || p.secteur}</div>
                        </div>
                        <span onClick={(e) => e.stopPropagation()}>
                          <Menu trigger={<IconButton icon="more" label="Déplacer" size={14} />} items={statusMenuItems(p)} />
                        </span>
                      </div>
                      <div class="kb-card-foot">
                        <PrioriteBadge priorite={p.priorite} />
                        {p.prochaineRelance && (
                          <span class={p.prochaineRelance < today() ? 'text-bad fw-6' : ''}>
                            <Icon name="clock" size={11} style={{ display: 'inline', verticalAlign: '-1px' }} /> {fmtDate(p.prochaineRelance)}
                          </span>
                        )}
                        {(p.dealValue > 0 || p.mrrValue > 0) && <span class="ml-auto fw-6 text-2">{p.mrrValue ? `${eur(p.mrrValue)}/m` : eur(p.dealValue)}</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div class="kb-empty">Aucun prospect</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
