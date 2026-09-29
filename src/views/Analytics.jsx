// Tableau de bord (performance vs objectifs) et Rapports (tendances 6 mois, répartitions).
import { useState } from 'preact/hooks';
import { db, useStore } from '../lib/store.js';
import { open, go } from '../lib/nav.js';
import { callStats, revenueStats, monthlySeries, dailyCalls, funnel, groupSum, pipelineValue, allCalls } from '../lib/business.js';
import { STATUTS, PIPELINE_COLUMNS, OUTCOMES } from '../lib/constants.js';
import { eur, pct, compact, plural, today, addDays, toCsv, download, sum, inPeriod } from '../lib/util.js';
import { PageHeader, Card, Kpi, Button, Segmented, Meter, EmptyState, Stepper, Field } from '../components/ui.jsx';
import { Columns, Area, HBars, Funnel, Ring, Legend, Heatmap } from '../components/charts.jsx';
import { Icon } from '../components/icons.jsx';

const delta = (a, b) => (b ? Math.round(((a - b) / b) * 100) : a ? 100 : 0);

export function Dashboard() {
  const { prospects, settings } = useStore(db);
  const [period, setPeriod] = useState('week');
  const s = callStats(prospects, period);
  const prev = callStats(prospects, period === 'week' ? 'lastWeek' : 'lastMonth');
  const sMonth = callStats(prospects, 'month');
  const rev = revenueStats(prospects);
  const daily = dailyCalls(prospects, 14);
  const tCalls = period === 'week' ? settings.targetCallsWeek : settings.targetCallsWeek * 4.33;
  const tRdv = period === 'week' ? settings.targetRdvWeek : settings.targetRdvWeek * 4.33;
  const panier = rev.activeCount ? Math.round(rev.mrr / rev.activeCount) : 0;
  const roi = sMonth.appels ? Math.round(rev.caMonth / sMonth.appels) : 0;
  const cpa = sMonth.clients ? Math.round((sMonth.appels / sMonth.clients) * 10) / 10 : 0;
  const setTarget = (k, v) => db.set((st) => ({ settings: { ...st.settings, [k]: Math.max(0, v) } }));
  const avgDur = s.appels ? Math.round(s.duree / s.appels) : 0;

  return (
    <>
      <PageHeader title="Tableau de bord" subtitle="Votre performance commerciale face à vos objectifs">
        <Segmented
          value={period}
          onChange={setPeriod}
          options={[
            { value: 'week', label: 'Cette semaine' },
            { value: 'month', label: 'Ce mois' },
          ]}
        />
      </PageHeader>
      <div class="kpis mb-16">
        <Kpi label="Appels émis" value={s.appels} delta={delta(s.appels, prev.appels)} deltaSuffix=" %" sub={`vs ${period === 'week' ? 'semaine' : 'mois'} précédent`} icon="phone" tone="blue" />
        <Kpi label="Contacts joints" value={s.contactsJoints} sub={`${pct(s.contactsJoints, s.appels).toLocaleString('fr-FR')} % de joignabilité`} icon="headset" tone="sky" />
        <Kpi label="RDV obtenus" value={s.rdv} delta={delta(s.rdv, prev.rdv)} deltaSuffix=" %" sub={`${pct(s.rdv, s.contactsJoints).toLocaleString('fr-FR')} % des contacts`} icon="calendar" tone="violet" />
        <Kpi label="Clients signés" value={s.clients} delta={delta(s.clients, prev.clients)} deltaSuffix=" %" sub={`${pct(s.clients, s.appels).toLocaleString('fr-FR')} % des appels`} icon="star" tone="emerald" />
      </div>
      <div class="layout-2b mb-16">
        <Card title="Objectifs" subtitle={period === 'week' ? 'Cette semaine' : 'Ce mois (objectif hebdo × 4,33)'} icon="target">
          <div class="row" style={{ justifyContent: 'space-around', flexWrap: 'wrap', gap: 20 }}>
            <div class="col" style={{ alignItems: 'center' }}>
              <Ring value={s.appels} max={tCalls} label={`${Math.round(pct(s.appels, tCalls))} %`} sub={`${s.appels} / ${Math.round(tCalls)} appels`} />
              <span class="sm fw-6">Appels</span>
            </div>
            <div class="col" style={{ alignItems: 'center' }}>
              <Ring value={s.rdv} max={tRdv} label={`${Math.round(pct(s.rdv, tRdv))} %`} sub={`${s.rdv} / ${Math.round(tRdv)} RDV`} />
              <span class="sm fw-6">Rendez-vous</span>
            </div>
          </div>
          <div class="grid-2 mt-16">
            <Field label="Objectif appels / semaine">
              <Stepper value={settings.targetCallsWeek} step={5} onChange={(v) => setTarget('targetCallsWeek', v)} />
            </Field>
            <Field label="Objectif RDV / semaine">
              <Stepper value={settings.targetRdvWeek} onChange={(v) => setTarget('targetRdvWeek', v)} />
            </Field>
          </div>
        </Card>
        <Card title="Entonnoir de conversion" subtitle={`${period === 'week' ? 'Semaine' : 'Mois'} en cours · taux de passage entre étapes`} icon="filter">
          {s.appels ? <Funnel steps={funnel(s)} /> : <EmptyState compact icon="filter" title="Aucun appel sur la période" text="Lancez une session d'appels depuis « Aujourd'hui »." />}
          {s.appels > 0 && (
            <div class="row-wrap mt-16 sm text-2">
              <span class="pill">
                Conversion globale <strong class="text-accent">{pct(s.clients, s.appels).toLocaleString('fr-FR')} %</strong>
              </span>
              <span class="pill">Durée moyenne {Math.floor(avgDur / 60)} min {String(avgDur % 60).padStart(2, '0')}</span>
            </div>
          )}
        </Card>
      </div>
      <Card title="Appels par jour" subtitle="14 derniers jours" icon="barChart" class="mb-16">
        <Columns data={daily.map((d) => ({ ...d, label: d.short, tipLabel: new Date(d.key + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) }))} series={[{ key: 'value', label: 'Appels', color: 'var(--accent)', unit: 'appels' }]} target={Math.round(settings.targetCallsWeek / 5)} targetLabel="Objectif/jour" height={210} />
      </Card>
      <div class="kpis">
        <Kpi label="MRR actuel" value={eur(rev.mrr)} sub={`${plural(rev.activeCount, 'client actif', 'clients actifs')}`} icon="trendUp" tone="emerald">
          {settings.targetMrr > 0 && <Meter value={rev.mrr} max={settings.targetMrr} />}
        </Kpi>
        <Kpi label="CA signé (mois)" value={eur(rev.caMonth)} sub={settings.targetCaMonth ? `Objectif ${eur(settings.targetCaMonth)}` : ''} icon="euro" tone="blue">
          {settings.targetCaMonth > 0 && <Meter value={rev.caMonth} max={settings.targetCaMonth} />}
        </Kpi>
        <Kpi label="Panier moyen" value={`${eur(panier)}/m`} sub="MRR par client" icon="briefcase" tone="violet" />
        <Kpi label="Valeur du pipeline" value={eur(pipelineValue(prospects))} sub="projets + 12 mois d'abonnement" icon="kanban" tone="amber" onClick={() => go('pipeline')} />
        <Kpi label="ROI par appel" value={eur(roi)} sub="CA signé du mois / appels" icon="zap" tone="sky" />
        <Kpi label="Appels par client" value={cpa || '—'} sub="Coût d'acquisition (mois)" icon="target" tone="indigo" />
        <Kpi label="Taux de résiliation" value={`${rev.churnRate.toLocaleString('fr-FR')} %`} sub={plural(rev.churned, 'résiliation')} icon="logout" tone="rose" />
        <Kpi label="ARR" value={eur(rev.arr)} sub="revenu récurrent annuel" icon="lineChart" tone="cyan" />
      </div>
    </>
  );
}

export function Reports() {
  const { prospects } = useStore(db);
  const series = monthlySeries(prospects, 6);
  const has = series.some((m) => m.appels || m.ca || m.mrr);
  const tot = series.reduce((a, m) => ({ appels: a.appels + m.appels, rdv: a.rdv + m.rdv, clients: a.clients + m.clients, ca: a.ca + m.ca }), { appels: 0, rdv: 0, clients: 0, ca: 0 });
  const calls = allCalls(prospects);
  const since = addDays(today(), -83);
  const heat = Array.from({ length: 84 }, (_, i) => {
    const k = addDays(since, i);
    return { title: new Date(k + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }), value: calls.filter((c) => c.date === k).length };
  });
  const byCanal = groupSum(prospects, (p) => p.canal);
  const canalConv = byCanal.map((c) => {
    const signed = prospects.filter((p) => (p.canal || 'Autre') === c.label && (p.statut === 'client_signe' || p.statut === 'resilie')).length;
    return { label: c.label, value: pct(signed, c.value), sub: `(${signed}/${c.value})` };
  }).sort((a, b) => b.value - a.value);
  const bySecteur = groupSum(prospects, (p) => p.secteur);
  const byStatut = PIPELINE_COLUMNS.concat('resilie').map((s) => ({ label: STATUTS[s].label, value: prospects.filter((p) => p.statut === s).length }));
  const byOutcome = OUTCOMES.map((o) => ({ label: o.label.replace(' 🎉', ''), value: calls.filter((c) => c.outcome === o.id && inPeriod(c.date, 'month')).length })).filter((x) => x.value);
  const hours = Array.from({ length: 12 }, (_, i) => i + 8).map((h) => {
    const hc = calls.filter((c) => c.time && parseInt(c.time, 10) === h);
    return { label: `${h}h`, tipLabel: `${h}h – ${h + 1}h`, value: hc.length ? Math.round((hc.filter((c) => c.outcome !== 'injoignable').length / hc.length) * 100) : 0, n: hc.length };
  });
  const hasHours = hours.some((h) => h.n);

  function exportCsv() {
    download(
      `rapport-${today()}.csv`,
      toCsv(series, [
        { key: 'label', label: 'Mois' },
        { key: 'appels', label: 'Appels' },
        { key: 'rdv', label: 'RDV' },
        { key: 'clients', label: 'Clients signés' },
        { key: 'ca', label: 'CA nouveau (€)' },
        { key: 'mrr', label: 'MRR cumulé (€)' },
      ]),
      'text/csv;charset=utf-8',
    );
  }

  if (!prospects.length)
    return (
      <>
        <PageHeader title="Rapports" subtitle="Analyse complète sur les 6 derniers mois" />
        <Card>
          <EmptyState icon="lineChart" title="Pas encore de données" text="Vos rapports apparaîtront dès vos premiers appels." />
        </Card>
      </>
    );

  return (
    <>
      <PageHeader title="Rapports" subtitle="Analyse complète sur les 6 derniers mois">
        <Button icon="download" onClick={exportCsv}>
          Exporter CSV
        </Button>
      </PageHeader>
      <div class="kpis mb-16">
        <Kpi label="Appels (6 mois)" value={compact(tot.appels)} icon="phone" tone="blue" />
        <Kpi label="RDV (6 mois)" value={tot.rdv} sub={`${pct(tot.rdv, tot.appels).toLocaleString('fr-FR')} % des appels`} icon="calendar" tone="violet" />
        <Kpi label="Clients (6 mois)" value={tot.clients} sub={`${pct(tot.clients, tot.appels).toLocaleString('fr-FR')} % des appels`} icon="star" tone="emerald" />
        <Kpi label="CA nouveau (6 mois)" value={eur(tot.ca)} icon="euro" tone="amber" />
      </div>
      <div class="layout-2b mb-16">
        <Card title="CA nouveau par mois" subtitle="Montant des projets signés" icon="euro">
          {has ? <Columns data={series} series={[{ key: 'ca', label: 'CA nouveau', color: 'var(--accent)', fmt: (v) => eur(v) }]} format={compact} /> : <EmptyState compact title="Pas encore de revenu enregistré" />}
        </Card>
        <Card title="MRR cumulé" subtitle="Revenu récurrent mensuel en fin de mois" icon="trendUp">
          {has ? <Area data={series.map((m) => ({ label: m.label, value: m.mrr }))} format={(v) => compact(v) + ' €'} label="MRR" color="var(--series-3)" /> : <EmptyState compact title="Pas encore d'abonnement" />}
        </Card>
      </div>
      <Card title="Activité commerciale" subtitle="Appels par mois" icon="barChart" class="mb-16">
        <Columns data={series} series={[{ key: 'appels', label: 'Appels', color: 'var(--series-1)', unit: 'appels' }]} height={200} />
      </Card>
      <Card title="Résultats par mois" subtitle="RDV obtenus et clients signés" icon="target" class="mb-16" actions={<Legend series={[{ label: 'RDV', color: 'var(--series-1)' }, { label: 'Clients', color: 'var(--series-2)' }]} />}>
        <Columns
          data={series}
          series={[
            { key: 'rdv', label: 'RDV', color: 'var(--series-1)' },
            { key: 'clients', label: 'Clients', color: 'var(--series-2)' },
          ]}
          height={200}
        />
      </Card>
      <div class="layout-2b mb-16">
        <Card title="Régularité" subtitle="Appels par jour · 12 dernières semaines" icon="calendar">
          <Heatmap days={heat} format={(v) => plural(v, 'appel')} />
          <div class="row between xs text-3 mt-8">
            <span>il y a 12 semaines</span>
            <span>aujourd'hui</span>
          </div>
        </Card>
        <Card title="Meilleurs créneaux" subtitle="Taux de joignabilité par heure d'appel" icon="clock">
          {hasHours ? <Columns data={hours} series={[{ key: 'value', label: 'Joignabilité', color: 'var(--accent)', fmt: (v) => v + ' %' }]} format={(v) => v + '%'} height={180} /> : <EmptyState compact title="Pas assez d'appels horodatés" text="Les heures d'appel sont enregistrées à partir de cette version." />}
        </Card>
      </div>
      <div class="layout-2b mb-16">
        <Card title="Conversion par canal" subtitle="Part des prospects devenus clients" icon="zap">
          <HBars data={canalConv} format={(v) => v.toLocaleString('fr-FR') + ' %'} max={100} />
        </Card>
        <Card title="Prospects par secteur" icon="building">
          <HBars data={bySecteur} format={(v) => String(v)} />
        </Card>
      </div>
      <div class="layout-2b">
        <Card title="Répartition du pipeline" subtitle="Nombre de prospects par statut" icon="kanban">
          <HBars data={byStatut} format={(v) => String(v)} onClick={() => go('pipeline')} />
        </Card>
        <Card title="Résultats d'appels (mois)" icon="phoneCall">
          <HBars data={byOutcome} format={(v) => String(v)} emptyText="Aucun appel ce mois-ci" />
        </Card>
      </div>
    </>
  );
}
