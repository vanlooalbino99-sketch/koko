// Devis & factures : liste, formulaire, document A4 imprimable, email.
import { useState, useMemo, useEffect, useRef } from 'preact/hooks';
import { render } from 'preact';
import { db, useStore, addEvent } from '../lib/store.js';
import { open, replaceTop, toast } from '../lib/nav.js';
import { DEVIS_STATUTS, FACTURE_STATUTS, TVA_RATES } from '../lib/constants.js';
import { saveDevis, saveFacture, duplicateDevis, deleteDevis, setDevisStatut, devisToFacture, setFactureStatut, deleteFacture } from '../lib/actions.js';
import { totals, isDevisExpired, isFactureLate } from '../lib/business.js';
import { uid, today, addDays, eur, eur2, fmtDateFull, fmtDate, fmtRelative, norm, fillTemplate, copyText, fmtWhen, plural, inPeriod, sum } from '../lib/util.js';
import { PageHeader, Button, IconButton, Card, Kpi, Tabs, SearchInput, EmptyState, Modal, Field, Input, Textarea, Select, Menu, DevisBadge, FactureBadge, Avatar, cx, useDesktop } from '../components/ui.jsx';
import { Icon } from '../components/icons.jsx';

const K = {
  devis: { list: 'devisList', label: 'Devis', one: 'devis', icon: 'fileText', statuts: DEVIS_STATUTS },
  facture: { list: 'factures', label: 'Facture', one: 'facture', icon: 'receipt', statuts: FACTURE_STATUTS },
};

/* ---------------- Page ---------------- */
export function Sales() {
  const { devisList, factures, prospects } = useStore(db);
  const desktop = useDesktop();
  const [tab, setTab] = useState('devis');
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  useEffect(() => setFilter('all'), [tab]);

  const tot = (d) => totals(d.lignes, d.remise).totalTTC;
  const pendingDevis = devisList.filter((d) => (d.statut === 'brouillon' || d.statut === 'envoye') && !isDevisExpired(d));
  const accepted = devisList.filter((d) => d.statut === 'accepte').length;
  const decided = devisList.filter((d) => ['accepte', 'refuse'].includes(d.statut)).length;
  const toCollect = factures.filter((f) => f.statut === 'a_payer');
  const cashed = factures.filter((f) => f.statut === 'payee' && inPeriod(f.datePaiement, 'month'));

  const n = norm(q);
  const base = tab === 'devis' ? devisList : factures;
  const list = base
    .filter((d) => !n || norm(d.numero).includes(n) || norm(d.clientNom).includes(n))
    .filter((d) => {
      if (filter === 'all') return true;
      if (tab === 'devis') {
        if (filter === 'pending') return (d.statut === 'brouillon' || d.statut === 'envoye') && !isDevisExpired(d);
        if (filter === 'accepte') return d.statut === 'accepte';
        if (filter === 'lost') return d.statut === 'refuse' || d.statut === 'expire' || isDevisExpired(d);
      } else {
        if (filter === 'a_payer') return d.statut === 'a_payer' && !isFactureLate(d);
        if (filter === 'late') return isFactureLate(d);
        if (filter === 'payee') return d.statut === 'payee';
      }
      return true;
    })
    .sort((a, b) => (b.numero || '').localeCompare(a.numero || ''));
  const chips =
    tab === 'devis'
      ? [
          ['all', 'Tous', devisList.length],
          ['pending', 'En attente', pendingDevis.length],
          ['accepte', 'Acceptés', accepted],
          ['lost', 'Refusés / expirés', devisList.filter((d) => d.statut === 'refuse' || d.statut === 'expire' || isDevisExpired(d)).length],
        ]
      : [
          ['all', 'Toutes', factures.length],
          ['a_payer', 'À payer', factures.filter((f) => f.statut === 'a_payer' && !isFactureLate(f)).length],
          ['late', 'En retard', factures.filter(isFactureLate).length],
          ['payee', 'Payées', factures.filter((f) => f.statut === 'payee').length],
        ];
  const dateOf = (d) => (tab === 'devis' ? d.dateCreation : d.dateEmission);
  const dueOf = (d) => (tab === 'devis' ? d.dateValidite : d.dateEcheance);
  const badge = (d) => (tab === 'devis' ? <DevisBadge statut={d.statut} expired={isDevisExpired(d)} /> : <FactureBadge statut={d.statut} late={isFactureLate(d)} />);

  return (
    <>
      <PageHeader title="Devis & factures" subtitle="Créez, envoyez et suivez vos documents commerciaux">
        <Button icon="receipt" onClick={() => open('factureForm')}>
          Facture
        </Button>
        <Button variant="primary" icon="plus" onClick={() => open('devisForm')}>
          Nouveau devis
        </Button>
      </PageHeader>
      <div class="kpis mb-16">
        <Kpi label="Devis en attente" value={eur(sum(pendingDevis, tot))} sub={plural(pendingDevis.length, 'devis', 'devis')} icon="fileText" tone="sky" onClick={() => (setTab('devis'), setFilter('pending'))} />
        <Kpi label="Taux d'acceptation" value={decided ? `${Math.round((accepted / decided) * 100)} %` : '—'} sub={`${accepted} accepté${accepted > 1 ? 's' : ''} sur ${decided} décidé${decided > 1 ? 's' : ''}`} icon="check2" tone="emerald" />
        <Kpi label="À encaisser" value={eur(sum(toCollect, tot))} sub={`${plural(toCollect.length, 'facture')}${factures.filter(isFactureLate).length ? ` · ${factures.filter(isFactureLate).length} en retard` : ''}`} icon="wallet" tone="amber" onClick={() => (setTab('facture'), setFilter('a_payer'))} />
        <Kpi label="Encaissé ce mois" value={eur(sum(cashed, tot))} sub={plural(cashed.length, 'paiement')} icon="euro" tone="violet" />
      </div>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'devis', label: 'Devis', icon: 'fileText', count: devisList.length },
          { value: 'facture', label: 'Factures', icon: 'receipt', count: factures.length },
        ]}
      />
      <div class="toolbar mt-16">
        <SearchInput value={q} onInput={setQ} placeholder="Numéro ou client…" />
        <div class="chips" style={{ margin: 0 }}>
          {chips.map(([k, l, c]) => (
            <button class={cx('chip', filter === k && 'active')} onClick={() => setFilter(k)}>
              {l}
              <span class="chip-count">{c}</span>
            </button>
          ))}
        </div>
      </div>
      {!list.length ? (
        <Card>
          <EmptyState icon={K[tab].icon} title={base.length ? 'Aucun résultat' : tab === 'devis' ? 'Aucun devis' : 'Aucune facture'} text={base.length ? 'Modifiez la recherche ou le filtre.' : tab === 'devis' ? 'Créez votre premier devis pour un prospect ou un client.' : 'Créez une facture, ou convertissez un devis accepté en facture en un clic.'}>
            {!base.length && (
              <Button variant="primary" icon="plus" onClick={() => open(tab === 'devis' ? 'devisForm' : 'factureForm')}>
                {tab === 'devis' ? 'Créer un devis' : 'Créer une facture'}
              </Button>
            )}
          </EmptyState>
        </Card>
      ) : desktop ? (
        <Card pad={false}>
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Client</th>
                  <th>{tab === 'devis' ? 'Créé le' : 'Émise le'}</th>
                  <th>{tab === 'devis' ? 'Validité' : 'Échéance'}</th>
                  <th class="right">Montant TTC</th>
                  <th>Statut</th>
                  <th class="td-actions" />
                </tr>
              </thead>
              <tbody>
                {list.map((d) => (
                  <tr class="clickable" onClick={() => open(tab, { id: d.id })}>
                    <td class="fw-6 mono">{d.numero}</td>
                    <td>
                      <div class="row gap-12">
                        <Avatar name={d.clientNom || '?'} size={28} />
                        <span class="truncate" style={{ maxWidth: 260 }}>
                          {d.clientNom || <span class="text-3">Sans client</span>}
                        </span>
                      </div>
                    </td>
                    <td class="sm">{fmtDateFull(dateOf(d))}</td>
                    <td class={cx('sm', ((tab === 'devis' && isDevisExpired(d)) || (tab === 'facture' && isFactureLate(d))) && 'text-bad fw-6')}>{d.statut === 'payee' ? `Payée le ${fmtDate(d.datePaiement)}` : ['accepte', 'refuse', 'annulee'].includes(d.statut) ? fmtDateFull(dueOf(d)) : fmtRelative(dueOf(d))}</td>
                    <td class="right num fw-6">{eur2(tot(d))}</td>
                    <td>{badge(d)}</td>
                    <td class="td-actions" onClick={(e) => e.stopPropagation()}>
                      <DocMenu kind={tab} d={d} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card pad={false}>
          {list.map((d) => (
            <div class="list-item clickable" onClick={() => open(tab, { id: d.id })}>
              <span class={cx('file-ic', tab === 'devis' ? 'tone-sky' : 'tone-emerald')}>
                <Icon name={K[tab].icon} size={17} />
              </span>
              <div class="li-main">
                <div class="li-title">{d.clientNom || 'Sans client'}</div>
                <div class="li-sub">
                  {d.numero} · {fmtDate(dateOf(d))}
                </div>
              </div>
              <div class="li-meta">
                <span class="fw-7 num">{eur(tot(d))}</span>
                {badge(d)}
              </div>
            </div>
          ))}
        </Card>
      )}
    </>
  );
}

function DocMenu({ kind, d }) {
  const items =
    kind === 'devis'
      ? [
          { label: 'Ouvrir', icon: 'eye', onClick: () => open('devis', { id: d.id }) },
          { label: 'Modifier', icon: 'pencil', onClick: () => open('devisForm', { id: d.id }) },
          { label: 'Imprimer / PDF', icon: 'printer', onClick: () => printDoc('devis', d) },
          { label: 'Dupliquer', icon: 'copy', onClick: () => duplicateDevis(d.id) },
          { label: 'Convertir en facture', icon: 'receipt', onClick: () => open('facture', { id: devisToFacture(d.id) }) },
          '-',
          ...Object.entries(DEVIS_STATUTS).map(([k, v]) => ({ label: v.label, dot: v.tone, active: d.statut === k, onClick: () => setDevisStatut(d.id, k) })),
          '-',
          { label: 'Supprimer', icon: 'trash', danger: true, onClick: () => deleteDevis(d.id) },
        ]
      : [
          { label: 'Ouvrir', icon: 'eye', onClick: () => open('facture', { id: d.id }) },
          { label: 'Modifier', icon: 'pencil', onClick: () => open('factureForm', { id: d.id }) },
          { label: 'Imprimer / PDF', icon: 'printer', onClick: () => printDoc('facture', d) },
          d.statut !== 'payee' ? { label: 'Marquer payée', icon: 'check2', onClick: () => setFactureStatut(d.id, 'payee') } : { label: 'Marquer à payer', icon: 'undo', onClick: () => setFactureStatut(d.id, 'a_payer') },
          '-',
          { label: 'Supprimer', icon: 'trash', danger: true, onClick: () => deleteFacture(d.id) },
        ];
  return <Menu trigger={<IconButton icon="more" label="Actions" />} items={items} />;
}

/* ---------------- Formulaire ---------------- */
export function DocForm({ ov, onClose, kind }) {
  const { prospects, devisList, factures } = useStore(db);
  const conf = K[kind];
  const existing = ov.id ? (kind === 'devis' ? devisList : factures).find((x) => x.id === ov.id) : null;
  const pre = ov.prospectId ? prospects.find((p) => p.id === ov.prospectId) : null;
  const [f, setF] = useState(() =>
    existing
      ? JSON.parse(JSON.stringify(existing))
      : {
          prospectId: pre ? pre.id : '',
          clientNom: pre ? pre.entreprise : '',
          clientAdresse: pre ? [pre.adresse, pre.ville].filter(Boolean).join(', ') : '',
          lignes: [{ id: uid(), designation: '', quantite: 1, prixUnitaire: 0, tva: 20 }],
          remise: 0,
          dateValidite: addDays(today(), 30),
          dateEmission: today(),
          dateEcheance: addDays(today(), 30),
          notes: '',
        },
  );
  const suggestions = useMemo(() => [...new Set([...devisList, ...factures].flatMap((d) => (d.lignes || []).map((l) => l.designation)).filter(Boolean))].slice(0, 40), [devisList, factures]);
  const t = totals(f.lignes, f.remise);
  const set = (k) => (e) => setF((o) => ({ ...o, [k]: e && e.target ? e.target.value : e }));
  const setLine = (id, k, v) => setF((o) => ({ ...o, lignes: o.lignes.map((l) => (l.id === id ? { ...l, [k]: v } : l)) }));
  const addLine = (preset) => setF((o) => ({ ...o, lignes: [...o.lignes, { id: uid(), designation: '', quantite: 1, prixUnitaire: 0, tva: 20, ...preset }] }));
  const delLine = (id) => setF((o) => ({ ...o, lignes: o.lignes.length > 1 ? o.lignes.filter((l) => l.id !== id) : o.lignes }));
  const valid = f.clientNom.trim() && f.lignes.some((l) => l.designation.trim());

  function pickProspect(id) {
    const p = prospects.find((x) => x.id === id);
    setF((o) => ({ ...o, prospectId: id, clientNom: p ? p.entreprise : o.clientNom, clientAdresse: p ? [p.adresse, p.ville].filter(Boolean).join(', ') || o.clientAdresse : o.clientAdresse }));
  }
  function submit() {
    if (!valid) return;
    const data = { ...f, lignes: f.lignes.filter((l) => l.designation.trim()).map((l) => ({ ...l, quantite: Number(l.quantite) || 0, prixUnitaire: Number(l.prixUnitaire) || 0, tva: Number(l.tva) || 0 })), prospectId: f.prospectId || null, remise: Number(f.remise) || 0 };
    const id = kind === 'devis' ? saveDevis(data) : saveFacture(data);
    replaceTop(kind, { id });
  }

  return (
    <Modal
      title={existing ? `Modifier ${existing.numero}` : kind === 'devis' ? 'Nouveau devis' : 'Nouvelle facture'}
      subtitle={existing ? existing.clientNom : 'Les numéros sont attribués automatiquement'}
      icon={conf.icon}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <div class="grow sm text-2 hide-mobile">
            Total : <strong class="text-accent">{eur2(t.totalTTC)} TTC</strong>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" icon="check" disabled={!valid} onClick={submit}>
            {existing ? 'Enregistrer' : kind === 'devis' ? 'Créer le devis' : 'Créer la facture'}
          </Button>
        </>
      }
    >
      <div class="stack">
        <div class="grid-2">
          <Field label="Prospect / client existant">
            <Select value={f.prospectId || ''} onChange={(e) => pickProspect(e.target.value)}>
              <option value="">— Client libre —</option>
              {[...prospects]
                .sort((a, b) => a.entreprise.localeCompare(b.entreprise, 'fr'))
                .map((p) => (
                  <option value={p.id}>{p.entreprise}</option>
                ))}
            </Select>
          </Field>
          <Field label="Nom du client / entreprise" required>
            <Input value={f.clientNom} onInput={set('clientNom')} placeholder="Agence Immo du Centre" />
          </Field>
          <Field label="Adresse de facturation" class="span-2">
            <Input value={f.clientAdresse} onInput={set('clientAdresse')} placeholder="12 rue des Lilas, 75000 Paris" />
          </Field>
        </div>

        <div>
          <div class="row between mb-8">
            <div class="field-label">Prestations</div>
          </div>
          <datalist id="designations">
            {suggestions.map((s) => (
              <option value={s} />
            ))}
          </datalist>
          <div class="doc-lines">
            <div class="doc-line doc-line-head">
              <span>Désignation</span>
              <span>Qté</span>
              <span>Prix unit. HT</span>
              <span>TVA</span>
              <span />
            </div>
            {f.lignes.map((l) => (
              <div class="doc-line">
                <Input class="dl-desc" list="designations" value={l.designation} onInput={(e) => setLine(l.id, 'designation', e.target.value)} placeholder="Désignation de la prestation" />
                <Input type="number" inputMode="decimal" min="0" step="any" value={l.quantite} onInput={(e) => setLine(l.id, 'quantite', e.target.value)} aria-label="Quantité" />
                <div class="input-suffix">
                  <Input type="number" inputMode="decimal" min="0" step="any" value={l.prixUnitaire} onInput={(e) => setLine(l.id, 'prixUnitaire', e.target.value)} aria-label="Prix unitaire HT" />
                  <span>€</span>
                </div>
                <Select value={String(l.tva)} onChange={(e) => setLine(l.id, 'tva', Number(e.target.value))} options={TVA_RATES.map((r) => ({ value: String(r), label: `${String(r).replace('.', ',')} %` }))} />
                <IconButton icon="trash" label="Supprimer la ligne" onClick={() => delLine(l.id)} disabled={f.lignes.length < 2} />
              </div>
            ))}
          </div>
          <div class="row-wrap mt-12">
            <Button size="sm" icon="plus" onClick={() => addLine()}>
              Ajouter une ligne
            </Button>
            <Button size="sm" variant="ghost" onClick={() => addLine({ designation: 'Mise en place standard IA Blackstart', prixUnitaire: 1800 })}>
              + Mise en place
            </Button>
            <Button size="sm" variant="ghost" onClick={() => addLine({ designation: 'Abonnement mensuel Blackstart AI', prixUnitaire: 220 })}>
              + Abonnement
            </Button>
          </div>
        </div>

        <div class="grid-2" style={{ alignItems: 'start' }}>
          <div class="stack-sm">
            <Field label="Remise globale">
              <div class="input-suffix">
                <Input type="number" inputMode="decimal" min="0" max="100" value={f.remise} onInput={set('remise')} />
                <span>%</span>
              </div>
            </Field>
            {kind === 'devis' ? (
              <Field label="Date de validité">
                <Input type="date" value={f.dateValidite} onInput={set('dateValidite')} />
              </Field>
            ) : (
              <div class="grid-2">
                <Field label="Date d'émission">
                  <Input type="date" value={f.dateEmission} onInput={set('dateEmission')} />
                </Field>
                <Field label="Échéance">
                  <Input type="date" value={f.dateEcheance} onInput={set('dateEcheance')} />
                </Field>
              </div>
            )}
          </div>
          <div class="totals-box card" style={{ maxWidth: 'none' }}>
            <div class="t-row">
              <span class="text-2">Total HT</span>
              <span class="num">{eur2(t.brutHT)}</span>
            </div>
            {t.remiseMontant > 0 && (
              <div class="t-row">
                <span class="text-2">Remise ({f.remise} %)</span>
                <span class="num">− {eur2(t.remiseMontant)}</span>
              </div>
            )}
            {t.tvaDetail.map((x) => (
              <div class="t-row">
                <span class="text-2">TVA {String(x.taux).replace('.', ',')} %</span>
                <span class="num">{eur2(x.montant)}</span>
              </div>
            ))}
            <div class="t-row t-total">
              <span>Total TTC</span>
              <span class="num">{eur2(t.totalTTC)}</span>
            </div>
          </div>
        </div>
        <Field label="Notes / conditions particulières">
          <Textarea value={f.notes} onInput={set('notes')} placeholder="Modalités de paiement, délais de mise en service, remarques…" />
        </Field>
      </div>
    </Modal>
  );
}

/* ---------------- Document (aperçu + impression) ---------------- */
export function Paper({ kind, d, company, prospect, accent }) {
  const t = totals(d.lignes, d.remise);
  const pay = company.paymentLinks || {};
  const links = [['Stripe', pay.stripe], ['PayPal', pay.paypal], ['Payoneer', pay.payoneer]].filter(([, v]) => v);
  const isF = kind === 'facture';
  return (
    <div class="paper" style={{ '--doc-accent': accent || '#387CD5' }}>
      <div class="pp-head">
        <div>
          <div class="pp-logo">
            <span class="pp-logo-mark">{(company.nom || 'B').trim()[0].toUpperCase()}</span>
            <span class="pp-company">{company.nom || 'Votre entreprise'}</span>
          </div>
          <div class="pp-muted" style={{ marginTop: 10, whiteSpace: 'pre-line' }}>
            {[company.adresse, company.telephone, company.email, company.site].filter(Boolean).join('\n')}
          </div>
        </div>
        <div class="pp-type">
          <h1>{isF ? 'FACTURE' : 'DEVIS'}</h1>
          <div class="pp-meta">
            <span>N°</span>
            <strong>{d.numero}</strong>
            <span>{isF ? "Date d'émission" : 'Date'}</span>
            <span>{fmtDateFull(isF ? d.dateEmission : d.dateCreation)}</span>
            <span>{isF ? 'Échéance' : "Valable jusqu'au"}</span>
            <span>{fmtDateFull(isF ? d.dateEcheance : d.dateValidite)}</span>
          </div>
          {isF && d.statut === 'payee' && <div class="pp-stamp">PAYÉE</div>}
        </div>
      </div>
      <div class="pp-parties">
        <div class="pp-box">
          <div class="pp-box-label">Émetteur</div>
          <strong>{company.nom}</strong>
          <div class="pp-muted" style={{ fontSize: 12 }}>
            {company.siret && <div>SIRET {company.siret}</div>}
            {company.tvaIntra && <div>TVA {company.tvaIntra}</div>}
            {company.ein && <div>EIN {company.ein}</div>}
          </div>
        </div>
        <div class="pp-box">
          <div class="pp-box-label">{isF ? 'Facturé à' : 'Destinataire'}</div>
          <strong>{d.clientNom || (prospect && prospect.entreprise) || '—'}</strong>
          {prospect && prospect.contact && <div>À l'attention de {prospect.contact}</div>}
          {d.clientAdresse && <div class="pp-muted">{d.clientAdresse}</div>}
        </div>
      </div>
      <table class="pp-table">
        <thead>
          <tr>
            <th>Désignation</th>
            <th class="r">Qté</th>
            <th class="r">PU HT</th>
            <th class="r">TVA</th>
            <th class="r">Total HT</th>
          </tr>
        </thead>
        <tbody>
          {d.lignes.map((l) => (
            <tr>
              <td>{l.designation}</td>
              <td class="r">{Number(l.quantite).toLocaleString('fr-FR')}</td>
              <td class="r">{eur2(l.prixUnitaire)}</td>
              <td class="r">{String(l.tva).replace('.', ',')} %</td>
              <td class="r">{eur2((Number(l.quantite) || 0) * (Number(l.prixUnitaire) || 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div class="pp-totals">
        <div>
          <span class="pp-muted">Total HT</span>
          <span>{eur2(t.brutHT)}</span>
        </div>
        {t.remiseMontant > 0 && (
          <div>
            <span class="pp-muted">Remise {d.remise} %</span>
            <span>− {eur2(t.remiseMontant)}</span>
          </div>
        )}
        {t.remiseMontant > 0 && (
          <div>
            <span class="pp-muted">Net HT</span>
            <span>{eur2(t.totalHT)}</span>
          </div>
        )}
        {t.tvaDetail.map((x) => (
          <div>
            <span class="pp-muted">TVA {String(x.taux).replace('.', ',')} %</span>
            <span>{eur2(x.montant)}</span>
          </div>
        ))}
        <div class="grand">
          <span>Total TTC</span>
          <span>{eur2(t.totalTTC)}</span>
        </div>
      </div>
      {d.notes && (
        <div class="pp-notes">
          <div class="pp-box-label">Conditions</div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{d.notes}</div>
        </div>
      )}
      {isF && (company.iban || links.length > 0) && (
        <div class="pp-pay">
          <div class="pp-box-label">Règlement</div>
          {company.iban && (
            <div>
              Virement — IBAN <strong>{company.iban}</strong>
              {company.bic ? ` · BIC ${company.bic}` : ''}
            </div>
          )}
          {links.map(([k, v]) => (
            <div>
              Paiement en ligne ({k}) : {v}
            </div>
          ))}
        </div>
      )}
      {!isF && (
        <div class="pp-sign">
          <div class="pp-box">
            <div class="pp-box-label">Pour {company.nom}</div>
          </div>
          <div class="pp-box">
            <div class="pp-box-label">Bon pour accord — date et signature du client</div>
          </div>
        </div>
      )}
      <div class="pp-foot">
        {isF && company.mentions ? <div style={{ marginBottom: 4 }}>{company.mentions}</div> : null}
        {[company.nom, company.siret && `SIRET ${company.siret}`, company.email, company.telephone].filter(Boolean).join(' · ')}
      </div>
    </div>
  );
}

export function printDoc(kind, d) {
  const s = db.get();
  const prospect = d.prospectId ? s.prospects.find((p) => p.id === d.prospectId) : null;
  let root = document.getElementById('print-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'print-root';
    document.body.appendChild(root);
  }
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  render(<Paper kind={kind} d={d} company={s.companyInfo} prospect={prospect} accent={accent} />, root);
  const title = document.title;
  document.title = `${d.numero} — ${d.clientNom || ''}`.trim();
  const done = () => {
    document.title = title;
    window.removeEventListener('afterprint', done);
  };
  window.addEventListener('afterprint', done);
  setTimeout(() => window.print(), 60);
}

function ScaledPaper(props) {
  const wrap = useRef(null);
  const inner = useRef(null);
  const [scale, setScale] = useState(1);
  const [h, setH] = useState(0);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const f = () => {
      setScale(Math.min(1, (el.clientWidth - 24) / 794));
      if (inner.current) setH(inner.current.offsetHeight);
    };
    f();
    const ro = window.ResizeObserver ? new ResizeObserver(f) : null;
    if (ro) {
      ro.observe(el);
      inner.current && ro.observe(inner.current);
    }
    return () => ro && ro.disconnect();
  }, []);
  return (
    <div class="paper-wrap" ref={wrap}>
      <div style={{ width: 794 * scale, height: h ? h * scale : 'auto', margin: '0 auto', overflow: 'hidden' }}>
        <div ref={inner} class="paper-scale" style={{ transform: `scale(${scale})`, width: 794 }}>
          <Paper {...props} />
        </div>
      </div>
    </div>
  );
}

export function DocView({ ov, onClose, kind }) {
  const s = useStore(db);
  const d = (kind === 'devis' ? s.devisList : s.factures).find((x) => x.id === ov.id);
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  if (!d) return null;
  const prospect = d.prospectId ? s.prospects.find((p) => p.id === d.prospectId) : null;
  const t = totals(d.lignes, d.remise);
  const linkedF = kind === 'devis' && d.factureId ? s.factures.find((f) => f.id === d.factureId) : null;
  const linkedD = kind === 'facture' && d.devisId ? s.devisList.find((x) => x.id === d.devisId) : null;
  return (
    <Modal
      title={d.numero}
      subtitle={`${d.clientNom || 'Sans client'} · ${eur2(t.totalTTC)} TTC`}
      icon={K[kind].icon}
      size="xl"
      onClose={onClose}
      noAutoFocus
      footer={
        <>
          <Menu
            trigger={<IconButton icon="more" label="Plus d'actions" variant="secondary" />}
            align="left"
            items={[
              kind === 'devis' && { label: 'Dupliquer', icon: 'copy', onClick: () => open('devis', { id: duplicateDevis(d.id) }) },
              kind === 'devis' && { header: 'Statut du devis' },
              ...(kind === 'devis'
                ? Object.entries(DEVIS_STATUTS).map(([k, v]) => ({ label: v.label, dot: v.tone, active: d.statut === k, onClick: () => setDevisStatut(d.id, k) }))
                : Object.entries(FACTURE_STATUTS).map(([k, v]) => ({ label: v.label, dot: v.tone, active: d.statut === k, onClick: () => setFactureStatut(d.id, k) }))),
              '-',
              {
                label: 'Supprimer',
                icon: 'trash',
                danger: true,
                onClick: () => {
                  onClose();
                  kind === 'devis' ? deleteDevis(d.id) : deleteFacture(d.id);
                },
              },
            ]}
          />
          <span class="spacer" />
          <Button icon="pencil" onClick={() => open(kind === 'devis' ? 'devisForm' : 'factureForm', { id: d.id })}>
            Modifier
          </Button>
          <Button icon="printer" onClick={() => printDoc(kind, d)}>
            PDF
          </Button>
          {prospect && (
            <Button icon="mail" onClick={() => open('email', { id: prospect.id, [kind === 'devis' ? 'devisId' : 'factureId']: d.id })}>
              Email
            </Button>
          )}
          {kind === 'devis' ? (
            <Button variant="primary" icon="receipt" onClick={() => replaceTop('facture', { id: devisToFacture(d.id) })}>
              {linkedF ? 'Voir la facture' : 'Facturer'}
            </Button>
          ) : d.statut !== 'payee' ? (
            <Menu
              trigger={
                <Button variant="success" icon="check2">
                  Marquer payée
                </Button>
              }
              items={[{ header: 'Moyen de paiement' }, ...['Virement', 'Carte (Stripe)', 'PayPal', 'Payoneer', 'Chèque', 'Espèces', 'Prélèvement'].map((m) => ({ label: m, onClick: () => setFactureStatut(d.id, 'payee', m) }))]}
            />
          ) : (
            <Button icon="undo" onClick={() => setFactureStatut(d.id, 'a_payer')}>
              Annuler le paiement
            </Button>
          )}
        </>
      }
    >
      <div class="row-wrap mb-16">
        {kind === 'devis' ? <DevisBadge statut={d.statut} expired={isDevisExpired(d)} /> : <FactureBadge statut={d.statut} late={isFactureLate(d)} />}
        {kind === 'facture' && d.statut === 'payee' && (
          <span class="sm text-2">
            Payée le {fmtDateFull(d.datePaiement)}
            {d.moyenPaiement ? ` · ${d.moyenPaiement}` : ''}
          </span>
        )}
        {kind === 'devis' && d.statut === 'envoye' && <span class="sm text-2">Valable jusqu'au {fmtDateFull(d.dateValidite)}</span>}
        {kind === 'facture' && d.statut === 'a_payer' && <span class={cx('sm', isFactureLate(d) ? 'text-bad fw-6' : 'text-2')}>Échéance {fmtRelative(d.dateEcheance).toLowerCase()}</span>}
        <span class="grow" />
        {prospect && (
          <button class="pill" onClick={() => open('prospect', { id: prospect.id })}>
            <Icon name="building" size={12} /> {prospect.entreprise}
          </button>
        )}
        {linkedF && (
          <button class="pill" onClick={() => replaceTop('facture', { id: linkedF.id })}>
            <Icon name="receipt" size={12} /> {linkedF.numero}
          </button>
        )}
        {linkedD && (
          <button class="pill" onClick={() => replaceTop('devis', { id: linkedD.id })}>
            <Icon name="fileText" size={12} /> {linkedD.numero}
          </button>
        )}
      </div>
      <ScaledPaper kind={kind} d={d} company={s.companyInfo} prospect={prospect} accent={accent} />
    </Modal>
  );
}

/* ---------------- Email ---------------- */
export function EmailComposer({ ov, onClose }) {
  const { prospects, devisList, factures, companyInfo, templates } = useStore(db);
  const p = prospects.find((x) => x.id === ov.id);
  const devis = ov.devisId ? devisList.find((x) => x.id === ov.devisId) : null;
  const facture = ov.factureId ? factures.find((x) => x.id === ov.factureId) : null;
  const pay = companyInfo.paymentLinks || {};
  const payText = [pay.stripe && `Carte bancaire : ${pay.stripe}`, pay.paypal && `PayPal : ${pay.paypal}`, pay.payoneer && `Payoneer : ${pay.payoneer}`, companyInfo.iban && `Virement : IBAN ${companyInfo.iban}${companyInfo.bic ? ` — BIC ${companyInfo.bic}` : ''}`].filter(Boolean).join('\n');
  const vars = p
    ? {
        entreprise: p.entreprise,
        contact: p.contact || 'Madame, Monsieur',
        secteur: p.secteur || 'votre secteur',
        ville: p.ville || '',
        expediteur: companyInfo.expediteur || companyInfo.nom || 'Blackstart AI',
        rdv: p.statut === 'rdv_pris' && p.prochaineRelance ? ` le ${fmtWhen(p.prochaineRelance, p.prochaineRelanceHeure).toLowerCase()}` : '',
        paiement: payText || '(ajoutez vos liens de paiement dans Réglages › Paiements)',
      }
    : {};
  const initial = ov.template || (facture ? 'envoi_facture' : devis ? 'envoi_devis' : p && p.statut === 'rdv_pris' ? 'confirmation_rdv' : p && (p.callLog || []).length ? 'relance_rdv' : 'premier_contact');
  const tpl0 = templates.find((x) => x.id === initial) || templates[0];
  const [tplId, setTplId] = useState(tpl0.id);
  const [to, setTo] = useState(p ? p.email || '' : '');
  const [subject, setSubject] = useState(() => fillTemplate(tpl0.subject, vars));
  const [body, setBody] = useState(() => fillTemplate(tpl0.body, vars));
  const [copied, setCopied] = useState(false);
  if (!p) return null;
  const doc = devis || facture;
  const fullBody = doc ? `${body}\n\n— ${devis ? 'Devis' : 'Facture'} ${doc.numero} : ${eur2(totals(doc.lignes, doc.remise).totalTTC)} TTC —` : body;
  function pick(id) {
    const x = templates.find((t) => t.id === id);
    if (!x) return;
    setTplId(id);
    setSubject(fillTemplate(x.subject, vars));
    setBody(fillTemplate(x.body, vars));
  }
  function sent(channel) {
    addEvent(p.id, 'email', `Email « ${subject} »${channel ? ` (${channel})` : ''}`);
    if (devis && devis.statut === 'brouillon') setDevisStatut(devis.id, 'envoye');
    else toast('Email préparé — vérifiez votre messagerie');
  }
  const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;
  return (
    <Modal
      title="Composer un email"
      subtitle={p.entreprise}
      icon="mail"
      size="lg"
      onClose={onClose}
      noAutoFocus
      footer={
        <>
          <Button
            icon={copied ? 'check' : 'copy'}
            onClick={async () => {
              if (await copyText(`Objet : ${subject}\n\n${fullBody}`)) {
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              }
            }}
          >
            {copied ? 'Copié !' : 'Copier'}
          </Button>
          <span class="spacer" />
          <a class="btn btn-secondary btn-md" href={gmail} target="_blank" rel="noopener" onClick={() => sent('Gmail')} style={{ textDecoration: 'none' }}>
            <Icon name="external" size={15} /> Gmail
          </a>
          <a
            class="btn btn-primary btn-md"
            href={mailto}
            onClick={() => {
              sent('');
              setTimeout(onClose, 300);
            }}
            style={{ textDecoration: 'none' }}
          >
            <Icon name="send" size={15} /> Ouvrir dans ma messagerie
          </a>
        </>
      }
    >
      <div class="stack">
        {!p.email && (
          <div class="callout tone-amber">
            <Icon name="alert" size={16} />
            <span>Ce prospect n'a pas d'adresse email enregistrée. Saisissez-la ci-dessous, ou copiez le message.</span>
          </div>
        )}
        <div class="grid-2">
          <Field label="Modèle">
            <Select value={tplId} onChange={(e) => pick(e.target.value)} options={templates.map((t) => ({ value: t.id, label: t.label }))} />
          </Field>
          <Field label="Destinataire">
            <Input type="email" value={to} onInput={(e) => setTo(e.target.value)} placeholder="adresse@entreprise.fr" />
          </Field>
        </div>
        <Field label="Objet">
          <Input value={subject} onInput={(e) => setSubject(e.target.value)} />
        </Field>
        <Field label="Message" hint={doc ? `La référence du ${devis ? 'devis' : 'document'} ${doc.numero} sera ajoutée en fin de message. Pensez à joindre le PDF.` : 'Modifiez librement le texte avant l\'envoi.'}>
          <Textarea value={body} onInput={(e) => setBody(e.target.value)} style={{ minHeight: 240 }} />
        </Field>
        {doc && (
          <Button size="sm" icon="printer" onClick={() => printDoc(devis ? 'devis' : 'facture', doc)} style={{ alignSelf: 'flex-start' }}>
            Générer le PDF à joindre
          </Button>
        )}
      </div>
    </Modal>
  );
}
