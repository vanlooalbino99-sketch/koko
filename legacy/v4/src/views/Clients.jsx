// Clients (portefeuille, MRR, résiliation) et Paiements (liens, encaissements).
import { useState } from 'preact/hooks';
import { db, useStore } from '../lib/store.js';
import { open, toast } from '../lib/nav.js';
import { revenueStats, groupSum, ancienneteJours, totals, isFactureLate } from '../lib/business.js';
import { setStatut, setFactureStatut } from '../lib/actions.js';
import { eur, eur2, fmtDateFull, fmtRelative, plural, copyText, sum, inPeriod } from '../lib/util.js';
import { PageHeader, Card, Kpi, Button, IconButton, EmptyState, Avatar, StatusBadge, FactureBadge, Meter, Menu, Field, Input, Segmented, cx, useDesktop } from '../components/ui.jsx';
import { HBars } from '../components/charts.jsx';
import { Icon } from '../components/icons.jsx';

export function Clients() {
  const { prospects, settings } = useStore(db);
  const desktop = useDesktop();
  const [show, setShow] = useState('actifs');
  const rev = revenueStats(prospects);
  const resilies = prospects.filter((p) => p.statut === 'resilie');
  const avgAge = rev.actifs.length ? Math.round(sum(rev.actifs, ancienneteJours) / rev.actifs.length) : 0;
  const bySector = groupSum(rev.actifs, (p) => p.secteur, (p) => p.mrrValue);
  const top = [...rev.actifs].sort((a, b) => b.mrrValue - a.mrrValue).slice(0, 5);
  const panier = rev.activeCount ? Math.round(rev.mrr / rev.activeCount) : 0;
  const list = (show === 'actifs' ? rev.actifs : resilies).sort((a, b) => b.mrrValue - a.mrrValue);

  return (
    <>
      <PageHeader title="Clients" subtitle="Vue d'ensemble de votre portefeuille clients" />
      <div class="kpis mb-16">
        <Kpi label="Clients actifs" value={rev.activeCount} sub={`Panier moyen ${eur(panier)}/mois`} icon="briefcase" tone="emerald" />
        <Kpi label="MRR total" value={eur(rev.mrr)} sub={`ARR ${eur(rev.arr)}`} icon="trendUp" tone="blue">
          {settings.targetMrr > 0 && <Meter value={rev.mrr} max={settings.targetMrr} />}
        </Kpi>
        <Kpi label="Ancienneté moyenne" value={`${avgAge} j`} sub="depuis la signature" icon="clock" tone="violet" />
        <Kpi label="Taux de résiliation" value={`${rev.churnRate.toLocaleString('fr-FR')} %`} sub={`${plural(rev.churned, 'client résilié', 'clients résiliés')}`} icon="logout" tone="rose" />
      </div>
      {!rev.everSigned ? (
        <Card>
          <EmptyState icon="briefcase" title="Aucun client pour le moment" text="Dès qu'un prospect sera marqué « Client signé », il apparaîtra ici avec son abonnement." />
        </Card>
      ) : (
        <div class="stack">
          <div class="layout-2b">
            <Card title="MRR par secteur" subtitle="Répartition des abonnements actifs" icon="barChart">
              <HBars data={bySector} format={(v) => eur(v)} emptyText="Aucun client actif pour le moment" />
            </Card>
            <Card title="Top clients" subtitle="Classés par abonnement mensuel" icon="star" pad={false}>
              {top.length ? (
                top.map((p, i) => (
                  <div class="list-item clickable" onClick={() => open('prospect', { id: p.id })}>
                    <span class="text-3 fw-7 num" style={{ width: 16 }}>
                      {i + 1}
                    </span>
                    <Avatar name={p.entreprise} size={32} />
                    <div class="li-main">
                      <div class="li-title">{p.entreprise}</div>
                      <div class="li-sub">
                        {p.secteur} · client depuis {plural(ancienneteJours(p), 'jour')}
                      </div>
                    </div>
                    <div class="fw-7 num">{eur(p.mrrValue)}<span class="xs text-3">/m</span></div>
                  </div>
                ))
              ) : (
                <EmptyState compact title="Aucun client actif" />
              )}
            </Card>
          </div>
          <Card
            pad={false}
            title="Portefeuille"
            icon="users"
            actions={
              <Segmented
                size="sm"
                value={show}
                onChange={setShow}
                options={[
                  { value: 'actifs', label: 'Actifs', count: rev.activeCount },
                  { value: 'resilies', label: 'Résiliés', count: resilies.length },
                ]}
              />
            }
          >
            {!list.length ? (
              <EmptyState compact title={show === 'actifs' ? 'Aucun client actif' : 'Aucun client résilié'} />
            ) : desktop ? (
              <div class="table-wrap">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Secteur</th>
                      <th>Signé le</th>
                      <th class="right">Projet</th>
                      <th class="right">Abonnement</th>
                      <th>Statut</th>
                      <th class="td-actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((p) => (
                      <tr class="clickable" onClick={() => open('prospect', { id: p.id })}>
                        <td>
                          <div class="row gap-12">
                            <Avatar name={p.entreprise} size={30} />
                            <div class="min-w-0">
                              <div class="cell-main truncate">{p.entreprise}</div>
                              <div class="cell-sub">{p.contact || '—'}</div>
                            </div>
                          </div>
                        </td>
                        <td class="sm">{p.secteur}</td>
                        <td class="sm">{fmtDateFull(p.signedAt)}</td>
                        <td class="right num">{eur(p.dealValue)}</td>
                        <td class="right num fw-6">{eur(p.mrrValue)}/m</td>
                        <td>
                          <StatusBadge statut={p.statut} />
                        </td>
                        <td class="td-actions" onClick={(e) => e.stopPropagation()}>
                          <Menu
                            trigger={<IconButton icon="more" label="Actions" />}
                            items={[
                              { label: 'Nouvelle facture', icon: 'receipt', onClick: () => open('factureForm', { prospectId: p.id }) },
                              { label: 'Composer un email', icon: 'mail', onClick: () => open('email', { id: p.id }) },
                              '-',
                              p.statut === 'client_signe'
                                ? { label: 'Marquer comme résilié', icon: 'logout', danger: true, onClick: () => open('confirm', { title: 'Résilier ce client ?', text: 'Son abonnement ne sera plus compté dans le MRR.', confirmLabel: 'Résilier', danger: true, onConfirm: () => setStatut(p.id, 'resilie') }) }
                                : { label: 'Réactiver le client', icon: 'refresh', onClick: () => setStatut(p.id, 'client_signe') },
                            ]}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              list.map((p) => (
                <div class="list-item clickable" onClick={() => open('prospect', { id: p.id })}>
                  <Avatar name={p.entreprise} size={36} />
                  <div class="li-main">
                    <div class="li-title">{p.entreprise}</div>
                    <div class="li-sub">
                      {p.secteur} · depuis le {fmtDateFull(p.signedAt)}
                    </div>
                  </div>
                  <div class="li-meta">
                    <span class="fw-7 num">{eur(p.mrrValue)}/m</span>
                    <StatusBadge statut={p.statut} short />
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      )}
    </>
  );
}

/* ---------------- Paiements ---------------- */
export function Payments() {
  const { companyInfo, factures } = useStore(db);
  const [copied, setCopied] = useState('');
  const tot = (f) => totals(f.lignes, f.remise).totalTTC;
  const unpaid = factures.filter((f) => f.statut === 'a_payer').sort((a, b) => (a.dateEcheance || '').localeCompare(b.dateEcheance || ''));
  const late = unpaid.filter(isFactureLate);
  const paid = factures.filter((f) => f.statut === 'payee').sort((a, b) => (b.datePaiement || '').localeCompare(a.datePaiement || ''));
  const setCompany = (patch) => db.set((s) => ({ companyInfo: { ...s.companyInfo, ...patch } }));
  const setLink = (k, v) => db.set((s) => ({ companyInfo: { ...s.companyInfo, paymentLinks: { ...s.companyInfo.paymentLinks, [k]: v } } }));
  async function copy(k, v) {
    if (v && (await copyText(v))) {
      setCopied(k);
      setTimeout(() => setCopied(''), 1500);
    }
  }
  const links = [
    ['stripe', 'Stripe', 'https://buy.stripe.com/…', 'violet'],
    ['paypal', 'PayPal', 'https://paypal.me/…', 'blue'],
    ['payoneer', 'Payoneer', 'https://payoneer.me/…', 'orange'],
  ];
  return (
    <>
      <PageHeader title="Paiements" subtitle="Liens de paiement réutilisables et suivi des encaissements">
        <Button variant="primary" icon="receipt" onClick={() => open('factureForm')}>
          Nouvelle facture
        </Button>
      </PageHeader>
      <div class="kpis mb-16">
        <Kpi label="À encaisser" value={eur(sum(unpaid, tot))} sub={plural(unpaid.length, 'facture')} icon="wallet" tone="amber" />
        <Kpi label="En retard" value={eur(sum(late, tot))} sub={plural(late.length, 'facture')} icon="alert" tone="rose" />
        <Kpi label="Encaissé ce mois" value={eur(sum(paid.filter((f) => inPeriod(f.datePaiement, 'month')), tot))} icon="euro" tone="emerald" />
        <Kpi label="Encaissé au total" value={eur(sum(paid, tot))} sub={plural(paid.length, 'paiement')} icon="check2" tone="blue" />
      </div>
      <div class="layout-2">
        <div class="stack">
          <Card title="Factures à encaisser" icon="receipt" pad={false} subtitle={unpaid.length ? `${plural(unpaid.length, 'facture')} en attente de règlement` : 'Tout est encaissé'}>
            {unpaid.length ? (
              unpaid.map((f) => (
                <div class="list-item clickable" onClick={() => open('facture', { id: f.id })}>
                  <span class={cx('file-ic', isFactureLate(f) ? 'tone-rose' : 'tone-amber')}>
                    <Icon name="receipt" size={16} />
                  </span>
                  <div class="li-main">
                    <div class="li-title">{f.clientNom || 'Sans client'}</div>
                    <div class={cx('li-sub', isFactureLate(f) && 'text-bad')}>
                      {f.numero} · échéance {fmtRelative(f.dateEcheance).toLowerCase()}
                    </div>
                  </div>
                  <span class="fw-7 num hide-mobile">{eur2(tot(f))}</span>
                  <div class="row gap-4" onClick={(e) => e.stopPropagation()}>
                    {f.prospectId && <IconButton icon="mail" label="Relancer par email" onClick={() => open('email', { id: f.prospectId, factureId: f.id, template: 'envoi_facture' })} />}
                    <Button size="sm" variant="soft" icon="check" onClick={() => setFactureStatut(f.id, 'payee')}>
                      Payée
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState compact icon="check2" title="Aucune facture en attente" />
            )}
          </Card>
          <Card title="Derniers encaissements" icon="history" pad={false}>
            {paid.length ? (
              paid.slice(0, 8).map((f) => (
                <div class="list-item clickable" onClick={() => open('facture', { id: f.id })}>
                  <span class="file-ic tone-emerald">
                    <Icon name="check" size={16} />
                  </span>
                  <div class="li-main">
                    <div class="li-title">{f.clientNom}</div>
                    <div class="li-sub">
                      {f.numero} · {fmtDateFull(f.datePaiement)}
                      {f.moyenPaiement ? ` · ${f.moyenPaiement}` : ''}
                    </div>
                  </div>
                  <span class="fw-7 num">{eur2(tot(f))}</span>
                </div>
              ))
            ) : (
              <EmptyState compact icon="wallet" title="Aucun paiement enregistré" />
            )}
          </Card>
        </div>
        <div class="stack">
          <Card title="Liens de paiement" subtitle="Copiez-les pour les envoyer à vos clients" icon="link">
            <div class="stack-sm">
              {links.map(([k, label, ph, tone]) => (
                <Field label={label}>
                  <div class="input-group">
                    <Input value={(companyInfo.paymentLinks || {})[k] || ''} onInput={(e) => setLink(k, e.target.value)} placeholder={ph} />
                    <Button icon={copied === k ? 'check' : 'copy'} onClick={() => copy(k, (companyInfo.paymentLinks || {})[k])} disabled={!(companyInfo.paymentLinks || {})[k]}>
                      {copied === k ? 'Copié' : 'Copier'}
                    </Button>
                  </div>
                </Field>
              ))}
            </div>
          </Card>
          <Card title="Virement bancaire" subtitle="Affiché sur vos factures" icon="card">
            <div class="stack-sm">
              <Field label="IBAN">
                <div class="input-group">
                  <Input value={companyInfo.iban || ''} onInput={(e) => setCompany({ iban: e.target.value })} placeholder="FR76 …" class="mono" />
                  <Button icon={copied === 'iban' ? 'check' : 'copy'} onClick={() => copy('iban', companyInfo.iban)} disabled={!companyInfo.iban}>
                    {copied === 'iban' ? 'Copié' : 'Copier'}
                  </Button>
                </div>
              </Field>
              <Field label="BIC">
                <Input value={companyInfo.bic || ''} onInput={(e) => setCompany({ bic: e.target.value })} placeholder="AGRIFRPP" class="mono" />
              </Field>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
