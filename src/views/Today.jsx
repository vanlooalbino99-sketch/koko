// Aujourd'hui : file d'appels, session d'appels enchaînés, tâches et objectifs du jour.
import { db, useStore, importData } from '../lib/store.js';
import { app, open, go, toast } from '../lib/nav.js';
import { dueQueue, callStats, revenueStats, relancesByDate, streak } from '../lib/business.js';
import { today, addDays, fmtDateLong, fmtRelative, daysBetween, eur, plural, fmtDate } from '../lib/util.js';
import { Card, Button, EmptyState, StatusBadge, PrioriteBadge, Avatar, Meter, Checkbox, cx, Badge } from '../components/ui.jsx';
import { Icon } from '../components/icons.jsx';
import { toggleTask } from '../lib/actions.js';
import { demoData } from '../lib/demo.js';

export function startSession(ids) {
  const list = ids || dueQueue(db.get().prospects).map((p) => p.id);
  if (!list.length) return toast('Aucun appel en attente', { tone: 'error' });
  app.set({ session: { ids: list, index: 0, done: 0, startedAt: Date.now() } });
  open('call', { id: list[0], mode: 'live', session: true });
}

export function loadDemo() {
  importData(demoData());
  toast('Données de démonstration chargées');
}

function greeting() {
  const h = new Date().getHours();
  return h < 5 ? 'Bonne nuit' : h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
}

export function QueueRow({ p, showDate, compact }) {
  const t = today();
  const late = p.prochaineRelance && p.prochaineRelance < t;
  const lateDays = late ? daysBetween(p.prochaineRelance, t) : 0;
  return (
    <div class="queue-item" onClick={() => open('prospect', { id: p.id })} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && open('prospect', { id: p.id })}>
      <div class={cx('queue-time', late && 'late')}>
        {late ? (
          <>
            <Icon name="alert" size={13} style={{ margin: '0 auto 2px' }} />+{lateDays} j
          </>
        ) : showDate ? (
          fmtDate(p.prochaineRelance)
        ) : (
          p.prochaineRelanceHeure || '—'
        )}
      </div>
      <Avatar name={p.entreprise} size={36} />
      <div class="li-main">
        <div class="li-title">{p.entreprise}</div>
        <div class="li-sub">{[p.contact, p.secteur, p.ville].filter(Boolean).join(' · ')}</div>
      </div>
      {!compact && (
        <div class="row hide-mobile">
          <PrioriteBadge priorite={p.priorite} />
          <StatusBadge statut={p.statut} short />
        </div>
      )}
      <button
        class="call-btn"
        title="Appeler maintenant"
        aria-label={`Appeler ${p.entreprise}`}
        onClick={(e) => {
          e.stopPropagation();
          open('call', { id: p.id, mode: 'live' });
        }}
      >
        <Icon name="phone" size={17} />
      </button>
    </div>
  );
}

export function Today() {
  const { prospects, settings, tasks, companyInfo } = useStore(db);
  const queue = dueQueue(prospects);
  const t = today();
  const sToday = callStats(prospects, 'today');
  const sWeek = callStats(prospects, 'week');
  const rev = revenueStats(prospects);
  const byDate = relancesByDate(prospects);
  const upcoming = [];
  for (let i = 1; i <= 7 && upcoming.length < 6; i++) (byDate[addDays(t, i)] || []).forEach((p) => upcoming.length < 6 && upcoming.push(p));
  const myTasks = tasks.filter((x) => !x.done && x.due && x.due <= t).sort((a, b) => (a.due + (a.heure || '99')).localeCompare(b.due + (b.heure || '99')));
  const late = queue.filter((p) => p.prochaineRelance < t).length;
  const st = streak(prospects);
  const name = (companyInfo.expediteur || '').split(/[\s—-]/)[0];

  if (!prospects.length) {
    return (
      <div class="stack-lg">
        <div class="hero">
          <div class="hero-hello">Bienvenue sur Blackstart CRM 👋</div>
          <p class="hero-date">{fmtDateLong(t)}</p>
        </div>
        <Card>
          <EmptyState icon="rocket" title="Commencez par ajouter vos premiers prospects" text="Ajoutez un prospect, importez une liste (CSV, copier-coller, base officielle des entreprises) ou explorez l'app avec des données de démonstration.">
            <Button variant="primary" icon="userPlus" onClick={() => open('prospectForm')}>
              Ajouter un prospect
            </Button>
            <Button icon="upload" onClick={() => open('import')}>
              Importer des leads
            </Button>
            <Button variant="ghost" icon="sparkles" onClick={loadDemo}>
              Charger la démo
            </Button>
          </EmptyState>
        </Card>
      </div>
    );
  }

  return (
    <div class="stack">
      <section class="hero">
        <div class="hero-grid">
          <div>
            <div class="hero-hello">
              {greeting()}
              {name ? `, ${name}` : ''} 👋
            </div>
            <p class="hero-date">
              {fmtDateLong(t)}
              {st > 1 && <span class="dot-sep">🔥 {st} jours d'appels d'affilée</span>}
            </p>
            <div class="hero-stats mt-16">
              <div class="hs">
                <div class="hs-v">{sToday.appels}</div>
                <div class="hs-l">Appels aujourd'hui</div>
              </div>
              <div class="hs">
                <div class="hs-v">
                  {sWeek.appels}
                  <span class="text-3" style={{ fontSize: '0.6em', fontWeight: 600 }}> / {settings.targetCallsWeek}</span>
                </div>
                <div class="hs-l">Appels semaine</div>
                <Meter value={sWeek.appels} max={settings.targetCallsWeek} />
              </div>
              <div class="hs">
                <div class="hs-v">
                  {sWeek.rdv}
                  <span class="text-3" style={{ fontSize: '0.6em', fontWeight: 600 }}> / {settings.targetRdvWeek}</span>
                </div>
                <div class="hs-l">RDV semaine</div>
                <Meter value={sWeek.rdv} max={settings.targetRdvWeek} />
              </div>
            </div>
          </div>
          <div class="col" style={{ gap: 10 }}>
            <button class="session-cta" onClick={() => startSession()} disabled={!queue.length}>
              <span class="session-cta-icon">
                <Icon name="zap" size={20} />
              </span>
              <span class="grow">
                <span class="session-cta-t" style={{ display: 'block' }}>
                  Lancer la session d'appels
                </span>
                <span class="session-cta-s">{queue.length ? `${plural(queue.length, 'prospect')} à appeler, enchaînés automatiquement` : 'Aucun appel en attente — bravo !'}</span>
              </span>
              <Icon name="arrowRight" size={18} />
            </button>
            <div class="grid-2">
              <Button icon="userPlus" onClick={() => open('prospectForm')}>
                Prospect
              </Button>
              <Button icon="calendarClock" onClick={() => open('schedule', {})}>
                Planifier
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div class="layout-2">
        <Card
          pad={false}
          title="File d'appels"
          subtitle={queue.length ? `${plural(queue.length, 'appel')} prévus${late ? ` · ${late} en retard` : ''}` : 'Tout est à jour'}
          icon="phoneCall"
          actions={
            queue.length > 0 && (
              <Button size="sm" variant="soft" icon="zap" onClick={() => startSession()}>
                Enchaîner
              </Button>
            )
          }
        >
          {queue.length ? (
            <div>
              {queue.map((p) => (
                <QueueRow p={p} />
              ))}
            </div>
          ) : (
            <EmptyState icon="check2" title="File d'appel vide" text="Aucun appel prévu aujourd'hui. Ajoutez de nouveaux prospects ou attendez vos prochaines relances planifiées.">
              <Button icon="users" onClick={() => go('prospects')}>
                Voir les prospects
              </Button>
            </EmptyState>
          )}
        </Card>

        <div class="stack">
          <Card
            pad={false}
            title="Tâches du jour"
            icon="checkSquare"
            subtitle={myTasks.length ? plural(myTasks.length, 'tâche') + ' à faire' : 'Rien en attente'}
            actions={
              <Button size="sm" variant="ghost" icon="plus" onClick={() => open('taskForm')}>
                Ajouter
              </Button>
            }
          >
            {myTasks.length ? (
              myTasks.slice(0, 6).map((x) => {
                const p = x.prospectId && prospects.find((pp) => pp.id === x.prospectId);
                return (
                  <div class="task-row">
                    <Checkbox class="round" checked={x.done} onChange={() => toggleTask(x.id)} label="Terminer la tâche" />
                    <div class="grow min-w-0" style={{ cursor: 'pointer' }} onClick={() => open('taskForm', { id: x.id })}>
                      <div class="task-title">{x.title}</div>
                      <div class="task-meta">
                        {x.due < t ? <span class="text-bad fw-6">En retard · {fmtRelative(x.due)}</span> : <span>{x.heure || "Aujourd'hui"}</span>}
                        {p && (
                          <span class="row gap-4">
                            <Icon name="building" size={11} />
                            {p.entreprise}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState compact icon="checkSquare" title="Aucune tâche aujourd'hui" />
            )}
            {myTasks.length > 6 && (
              <div class="p-section">
                <button class="link-btn" onClick={() => go('tasks')}>
                  Voir les {myTasks.length} tâches <Icon name="arrowRight" size={13} />
                </button>
              </div>
            )}
          </Card>

          <Card pad={false} title="Prochaines relances" icon="calendar" subtitle="7 prochains jours" actions={<Button size="sm" variant="ghost" iconRight="arrowRight" onClick={() => go('agenda')}>Agenda</Button>}>
            {upcoming.length ? upcoming.map((p) => <QueueRow p={p} showDate compact />) : <EmptyState compact icon="calendar" title="Rien de planifié cette semaine" />}
          </Card>

          <div class="grid-2">
            <div class="kpi">
              <span class="kpi-label">MRR actuel</span>
              <span class="kpi-value">{eur(rev.mrr)}</span>
              <span class="kpi-sub">{plural(rev.activeCount, 'client actif', 'clients actifs')}</span>
            </div>
            <div class="kpi">
              <span class="kpi-label">CA signé (mois)</span>
              <span class="kpi-value">{eur(rev.caMonth)}</span>
              <Meter value={rev.caMonth} max={settings.targetCaMonth || 1} />
            </div>
          </div>
          {sToday.appels > 0 && (
            <div class="callout tone-emerald">
              <Icon name="trendUp" size={16} />
              <span>
                Aujourd'hui : <strong>{sToday.appels}</strong> appels, <strong>{sToday.contactsJoints}</strong> contacts joints, <strong>{sToday.rdv}</strong> RDV.{' '}
                {sToday.duree > 0 && <span class="text-2">Temps au téléphone : {Math.round(sToday.duree / 60)} min.</span>}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
