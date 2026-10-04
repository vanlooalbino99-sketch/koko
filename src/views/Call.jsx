// Écran d'appel plein écran : chrono, composition, script, notes, compte-rendu.
import { useEffect, useState } from 'preact/hooks';
import { db, useStore } from '../lib/store.js';
import { app, replaceTop, toast } from '../lib/nav.js';
import { OUTCOMES, STATUTS } from '../lib/constants.js';
import { logCall } from '../lib/actions.js';
import { chimeSuccess } from '../lib/sound.js';
import { inDays, fmtDuration, fmtWhen, fmtPhone, toKey, fmtDate, eur } from '../lib/util.js';
import { Button, IconButton, Field, Input, Textarea, Segmented, StatusBadge, Badge, cx, useDesktop } from '../components/ui.jsx';
import { Icon } from '../components/icons.jsx';

export function ReminderPicker({ date, heure, onChange }) {
  const pad = (n) => String(n).padStart(2, '0');
  const quick = [
    {
      label: 'Dans 2h',
      get: () => {
        const d = new Date();
        d.setHours(d.getHours() + 2);
        return [toKey(d), `${pad(d.getHours())}:${pad(d.getMinutes())}`];
      },
    },
    { label: 'Demain 9h', get: () => [inDays(1), '09:00'] },
    { label: 'Demain 14h', get: () => [inDays(1), '14:00'] },
    { label: 'Dans 3 jours', get: () => [inDays(3), '09:00'] },
    { label: 'Semaine pro.', get: () => [inDays(7), '09:00'] },
    { label: 'Dans 1 mois', get: () => [inDays(30), '09:00'] },
  ];
  return (
    <div class="col" style={{ gap: 10 }}>
      <div class="quick-dates">
        {quick.map((q) => {
          const [d, h] = q.get();
          return (
            <button type="button" class={cx(d === date && h === heure && 'on')} onClick={() => onChange(d, h)}>
              {q.label}
            </button>
          );
        })}
      </div>
      <div class="grid-2">
        <Input type="date" value={date || ''} onInput={(e) => onChange(e.target.value, heure)} aria-label="Date de relance" />
        <Input type="time" value={heure || ''} onInput={(e) => onChange(date, e.target.value)} aria-label="Heure de relance" />
      </div>
      <div class="when-preview">
        <Icon name="calendarClock" size={15} />
        {fmtWhen(date, heure)}
      </div>
    </div>
  );
}

export function CallScreen({ ov, onClose }) {
  const prospect = useStore(db, (s) => s.prospects.find((p) => p.id === ov.id));
  const script = useStore(db, (s) => s.script);
  const session = useStore(app, (s) => s.session);
  const desktop = useDesktop();
  const [phase, setPhase] = useState(ov.mode === 'quick' ? 'wrap' : 'live');
  const [secs, setSecs] = useState(0);
  const [tab, setTab] = useState('script');
  const [openStep, setOpenStep] = useState(0);
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState(null);
  const [date, setDate] = useState(null);
  const [heure, setHeure] = useState(null);
  const [deal, setDeal] = useState(prospect ? prospect.dealValue || '' : '');
  const [mrr, setMrr] = useState(prospect ? prospect.mrrValue || '' : '');
  const inSession = ov.session && session;

  useEffect(() => {
    if (phase !== 'live') return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);
  if (!prospect) return null;

  function pickOutcome(o) {
    setOutcome(o.id);
    if (o.relanceDays) {
      setDate(inDays(o.relanceDays));
      setHeure('09:00');
    } else {
      setDate(null);
      setHeure(null);
    }
  }
  function next(save) {
    if (save) {
      logCall(prospect.id, { outcome, note: notes, date, heure, dealValue: deal, mrrValue: mrr, duration: secs });
      if (outcome === 'client_signe' || outcome === 'rdv_pris') chimeSuccess();
    }
    if (inSession) {
      const s = app.get().session;
      const idx = s.index + 1;
      const done = s.done + (save ? 1 : 0);
      if (idx < s.ids.length) {
        app.set({ session: { ...s, index: idx, done } });
        replaceTop('call', { id: s.ids[idx], mode: 'live', session: true });
        return;
      }
      app.set({ session: null });
      toast(`Session terminée — ${done} appel${done > 1 ? 's' : ''} enregistré${done > 1 ? 's' : ''} 🎯`);
    }
    onClose();
  }
  function quit() {
    if (inSession) app.set({ session: null });
    onClose();
  }

  const last = (prospect.callLog || [])[0];
  const needsDate = outcome && outcome !== 'client_signe' && outcome !== 'perdu';

  const scriptPane = (
    <div>
      {script.map((st, i) => (
        <div class={cx('script-step', openStep === i && 'open')}>
          <button class="script-head" onClick={() => setOpenStep(openStep === i ? -1 : i)}>
            <span class="script-num">{i + 1}</span>
            <span class="grow min-w-0">
              <span class="fw-6" style={{ display: 'block' }}>
                {st.title.replace(/^\d+\.\s*/, '')}
              </span>
              <span class="xs text-3">{st.subtitle}</span>
            </span>
            <Icon name={openStep === i ? 'chevronUp' : 'chevronDown'} size={16} class="text-3" />
          </button>
          {openStep === i && (
            <ul class="script-points">
              {st.points.map((pt) => (
                <li>{pt.replace(/\[secteur\]/g, prospect.secteur).replace(/\[Prénom\]/g, prospect.contact || '[Prénom]')}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
  const notesPane = <Textarea value={notes} onInput={(e) => setNotes(e.target.value)} placeholder="Notez ce qui se dit pendant l'appel : besoins, objections, décideur, budget…" style={{ minHeight: desktop ? 220 : '45vh' }} />;
  const infoPane = (
    <div class="stack-sm">
      <dl class="kv">
        <dt>Contact</dt>
        <dd>{prospect.contact || '—'}</dd>
        <dt>Téléphone</dt>
        <dd>{prospect.telephone ? fmtPhone(prospect.telephone) : '—'}</dd>
        <dt>Secteur</dt>
        <dd>{prospect.secteur}</dd>
        <dt>Ville</dt>
        <dd>{prospect.ville || '—'}</dd>
        <dt>Statut</dt>
        <dd>
          <StatusBadge statut={prospect.statut} />
        </dd>
      </dl>
      {prospect.notes && (
        <div class="tl-note" style={{ marginTop: 10 }}>
          {prospect.notes}
        </div>
      )}
      {last && (
        <div class="xs text-3 mt-8">
          Dernier appel : {fmtDate(last.date)} — {(OUTCOMES.find((o) => o.id === last.outcome) || {}).label || last.outcome}
          {last.note ? ` · « ${last.note.slice(0, 80)} »` : ''}
        </div>
      )}
    </div>
  );

  return (
    <div class="call-screen" role="dialog" aria-modal="true" aria-label={`Appel — ${prospect.entreprise}`}>
      <div class={cx('call-top', phase === 'live' && 'live')}>
        <div class="row" style={{ position: 'relative', zIndex: 1 }}>
          <IconButton icon="arrowLeft" label="Quitter l'appel" onClick={quit} />
          <div class="grow min-w-0">
            <div class="fw-7 truncate lg">{prospect.entreprise}</div>
            <div class="xs text-3 truncate">
              {[prospect.contact, prospect.secteur].filter(Boolean).join(' · ')}
              {inSession && ` · Session ${session.index + 1}/${session.ids.length}`}
            </div>
          </div>
          {phase === 'live' ? (
            <span class="call-timer">
              <i />
              {fmtDuration(secs)}
            </span>
          ) : (
            <Badge tone="slate">{fmtDuration(secs)}</Badge>
          )}
        </div>
        {phase === 'live' && (
          <div class="row mt-12" style={{ position: 'relative', zIndex: 1 }}>
            <a class="btn btn-primary btn-lg grow" href={prospect.telephone ? `tel:${prospect.telephone.replace(/\s/g, '')}` : undefined} style={{ textDecoration: 'none' }} aria-disabled={!prospect.telephone}>
              <Icon name="phone" size={17} />
              {prospect.telephone ? `Composer ${fmtPhone(prospect.telephone)}` : 'Pas de numéro enregistré'}
            </a>
          </div>
        )}
      </div>

      {phase === 'live' ? (
        desktop ? (
          <div class="call-body">
            <div class="call-pane">
              <div class="upper mb-8">Script d'appel</div>
              {scriptPane}
            </div>
            <div class="call-pane call-side stack">
              <div>
                <div class="upper mb-8">Notes</div>
                {notesPane}
              </div>
              <div>
                <div class="upper mb-8">Fiche</div>
                {infoPane}
              </div>
            </div>
          </div>
        ) : (
          <div class="call-pane" style={{ flex: 1 }}>
            <Segmented
              value={tab}
              onChange={setTab}
              options={[
                { value: 'script', label: 'Script', icon: 'book' },
                { value: 'notes', label: 'Notes', icon: 'pencil' },
                { value: 'info', label: 'Fiche', icon: 'info' },
              ]}
              class="mb-12"
            />
            {tab === 'script' ? scriptPane : tab === 'notes' ? notesPane : infoPane}
          </div>
        )
      ) : (
        <div class="call-pane" style={{ flex: 1 }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }} class="stack">
            <div>
              <div class="upper mb-8">Résultat de l'appel</div>
              <div class="outcomes">
                {OUTCOMES.map((o) => (
                  <button class={cx('outcome', `tone-${o.tone}`, outcome === o.id && 'on')} onClick={() => pickOutcome(o)}>
                    <span class="badge-dot" style={{ background: `rgb(var(--t))` }} />
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            {outcome === 'client_signe' && (
              <div class="grid-2">
                <Field label="Montant projet (€)">
                  <Input type="number" inputMode="decimal" value={deal} onInput={(e) => setDeal(e.target.value)} placeholder="2200" />
                </Field>
                <Field label="Abonnement / mois (€)">
                  <Input type="number" inputMode="decimal" value={mrr} onInput={(e) => setMrr(e.target.value)} placeholder="220" />
                </Field>
              </div>
            )}
            {needsDate && (
              <div>
                <div class="upper mb-8">Prochaine relance</div>
                <ReminderPicker
                  date={date}
                  heure={heure}
                  onChange={(d, h) => {
                    setDate(d);
                    setHeure(h);
                  }}
                />
              </div>
            )}
            <Field label="Compte-rendu">
              <Textarea value={notes} onInput={(e) => setNotes(e.target.value)} placeholder="Détail de l'échange…" />
            </Field>
            {outcome && (
              <div class="xs text-3">
                Le statut passera à <strong>{STATUTS[(OUTCOMES.find((o) => o.id === outcome) || {}).statut]?.label}</strong>
                {outcome === 'client_signe' && (deal || mrr) ? ` · ${eur(deal)} + ${eur(mrr)}/mois` : ''}.
              </div>
            )}
          </div>
        </div>
      )}

      <div class="call-foot">
        {phase === 'live' ? (
          <>
            {inSession && (
              <Button size="lg" variant="ghost" icon="skip" onClick={() => next(false)}>
                Passer
              </Button>
            )}
            <Button size="lg" variant="danger" block icon="phoneOff" onClick={() => setPhase('wrap')} class="grow">
              Terminer l'appel
            </Button>
          </>
        ) : (
          <>
            {ov.mode !== 'quick' && (
              <Button size="lg" variant="ghost" icon="phone" onClick={() => setPhase('live')}>
                Reprendre
              </Button>
            )}
            <Button size="lg" variant="primary" block class="grow" icon={inSession ? 'arrowRight' : 'check'} disabled={!outcome} onClick={() => next(true)}>
              {inSession ? (session.index + 1 < session.ids.length ? 'Enregistrer & suivant' : 'Enregistrer & terminer') : "Enregistrer l'appel"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
