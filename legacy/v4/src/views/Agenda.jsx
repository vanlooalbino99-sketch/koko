// Agenda : jour / semaine / mois, relances + tâches, planification de créneaux.
import { useState, useMemo } from 'preact/hooks';
import { db, useStore } from '../lib/store.js';
import { open } from '../lib/nav.js';
import { STATUTS } from '../lib/constants.js';
import { relancesByDate, isOpen } from '../lib/business.js';
import { scheduleSlot } from '../lib/actions.js';
import { toKey, parseKey, today, addDays, startOfWeek, fmtDateLong, cap, norm, plural } from '../lib/util.js';
import { PageHeader, Button, IconButton, Segmented, Card, Modal, Field, Input, Select, EmptyState, cx, useDesktop } from '../components/ui.jsx';
import { Icon } from '../components/icons.jsx';
import { ReminderPicker } from './Call.jsx';
import { QueueRow } from './Today.jsx';

function useEvents() {
  const prospects = useStore(db, (s) => s.prospects);
  const tasks = useStore(db, (s) => s.tasks);
  return useMemo(() => {
    const map = {};
    const push = (k, e) => (map[k] = map[k] || []).push(e);
    Object.entries(relancesByDate(prospects)).forEach(([k, list]) =>
      list.forEach((p) => push(k, { kind: 'p', id: p.id, title: p.entreprise, time: p.prochaineRelanceHeure || '', tone: STATUTS[p.statut]?.tone || 'blue' })),
    );
    tasks.filter((t) => !t.done && t.due).forEach((t) => push(t.due, { kind: 't', id: t.id, title: t.title, time: t.heure || '', tone: 'amber' }));
    Object.values(map).forEach((l) => l.sort((a, b) => (a.time || '99').localeCompare(b.time || '99')));
    return map;
  }, [prospects, tasks]);
}
const openEv = (e) => (e.kind === 'p' ? open('prospect', { id: e.id }) : open('taskForm', { id: e.id }));
function Ev({ e }) {
  return (
    <button
      class={cx('ev', `tone-${e.tone}`)}
      onClick={(ev) => {
        ev.stopPropagation();
        openEv(e);
      }}
      title={`${e.time ? e.time + ' · ' : ''}${e.title}`}
    >
      {e.kind === 't' && <Icon name="checkSquare" size={11} />}
      {e.time && <span class="ev-t">{e.time}</span>}
      <span class="truncate">{e.title}</span>
    </button>
  );
}

export function Agenda() {
  const desktop = useDesktop();
  const settings = useStore(db, (s) => s.settings);
  const prospects = useStore(db, (s) => s.prospects);
  const [view, setView] = useState(desktop ? 'week' : 'day');
  const [cursor, setCursor] = useState(today());
  const events = useEvents();
  const t = today();
  const overdue = prospects.filter((p) => isOpen(p) && p.prochaineRelance && p.prochaineRelance < t).sort((a, b) => a.prochaineRelance.localeCompare(b.prochaineRelance));
  const hours = [];
  for (let h = settings.workStart || 8; h <= (settings.workEnd || 19); h++) hours.push(h);
  const plan = (date, heure) => open('schedule', { date, heure });

  function shift(n) {
    const d = parseKey(cursor);
    if (view === 'day') d.setDate(d.getDate() + n);
    else if (view === 'week') d.setDate(d.getDate() + 7 * n);
    else {
      d.setDate(1);
      d.setMonth(d.getMonth() + n);
    }
    setCursor(toKey(d));
  }
  const weekStart = toKey(startOfWeek(parseKey(cursor)));
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const title =
    view === 'day'
      ? fmtDateLong(cursor)
      : view === 'week'
        ? `Semaine du ${parseKey(weekStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
        : cap(parseKey(cursor).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }));
  const hourOf = (e) => (e.time ? parseInt(e.time, 10) : null);
  const inGrid = (e) => {
    const h = hourOf(e);
    return h != null && h >= hours[0] && h <= hours[hours.length - 1];
  };

  return (
    <>
      <PageHeader title="Agenda" subtitle="Vos relances et tâches planifiées — touchez un créneau libre pour planifier">
        <Button variant="primary" icon="plus" onClick={() => plan(cursor === t ? t : cursor, '')}>
          Planifier
        </Button>
      </PageHeader>

      {overdue.length > 0 && (
        <Card pad={false} class="mb-16" title={`${plural(overdue.length, 'relance')} en retard`} subtitle="À traiter en priorité" icon="alert">
          {overdue.slice(0, 5).map((p) => (
            <QueueRow p={p} />
          ))}
          {overdue.length > 5 && <div class="p-section xs text-3">+ {plural(overdue.length - 5, 'autre')} dans la file « Aujourd'hui »</div>}
        </Card>
      )}

      <div class="cal-head">
        <div class="row gap-4">
          <IconButton icon="chevronLeft" label="Précédent" variant="secondary" onClick={() => shift(-1)} />
          <IconButton icon="chevronRight" label="Suivant" variant="secondary" onClick={() => shift(1)} />
        </div>
        <Button size="sm" onClick={() => setCursor(t)}>
          Aujourd'hui
        </Button>
        <div class="cal-title grow">{title}</div>
        <Segmented
          size="sm"
          value={view}
          onChange={setView}
          options={[
            { value: 'day', label: 'Jour' },
            { value: 'week', label: 'Semaine' },
            { value: 'month', label: 'Mois' },
          ]}
        />
      </div>

      {view === 'day' && (
        <Card pad={false} class="day-list">
          {(events[cursor] || []).filter((e) => !inGrid(e)).length > 0 && (
            <div class="slot">
              <span class="slot-h">Journée</span>
              <div class="grow col" style={{ gap: 4 }}>
                {(events[cursor] || [])
                  .filter((e) => !inGrid(e))
                  .map((e) => (
                    <Ev e={e} />
                  ))}
              </div>
            </div>
          )}
          {hours.map((h) => {
            const evs = (events[cursor] || []).filter((e) => hourOf(e) === h);
            const hh = String(h).padStart(2, '0') + ':00';
            return (
              <div class="slot">
                <span class="slot-h">{hh}</span>
                {evs.length ? (
                  <div class="grow col" style={{ gap: 4 }}>
                    {evs.map((e) => (
                      <Ev e={e} />
                    ))}
                  </div>
                ) : (
                  <button class="slot-empty" onClick={() => plan(cursor, hh)}>
                    + Planifier à {hh}
                  </button>
                )}
              </div>
            );
          })}
        </Card>
      )}

      {view === 'week' && (
        <div class="week-wrap">
          <div class="week">
            <div class="wk-corner" />
            {weekDays.map((d) => {
              const dt = parseKey(d);
              return (
                <div class={cx('wk-dayhead', d === t && 'today')} onClick={() => (setCursor(d), setView('day'))}>
                  {cap(dt.toLocaleDateString('fr-FR', { weekday: 'short' }))}
                  <div class="d">{dt.getDate()}</div>
                </div>
              );
            })}
            <div class="wk-hour" style={{ height: 'auto' }}>
              Jour
            </div>
            {weekDays.map((d) => (
              <div class={cx('wk-cell wk-allday', d === t && 'today')} onClick={() => plan(d, '')}>
                {(events[d] || [])
                  .filter((e) => !inGrid(e))
                  .map((e) => (
                    <Ev e={e} />
                  ))}
              </div>
            ))}
            {hours.map((h) => {
              const hh = String(h).padStart(2, '0') + ':00';
              return (
                <>
                  <div class="wk-hour">{hh}</div>
                  {weekDays.map((d) => (
                    <div class={cx('wk-cell', d === t && 'today')} onClick={() => plan(d, hh)} title={`Planifier le ${d.split('-').reverse().join('/')} à ${hh}`}>
                      {(events[d] || [])
                        .filter((e) => hourOf(e) === h)
                        .map((e) => (
                          <Ev e={e} />
                        ))}
                    </div>
                  ))}
                </>
              );
            })}
          </div>
        </div>
      )}

      {view === 'month' && <MonthGrid cursor={cursor} events={events} onDay={(d) => (setCursor(d), setView('day'))} />}
    </>
  );
}

function MonthGrid({ cursor, events, onDay }) {
  const d0 = parseKey(cursor);
  const first = new Date(d0.getFullYear(), d0.getMonth(), 1);
  const start = startOfWeek(first);
  const t = today();
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const rows = days[35].getMonth() !== d0.getMonth() && days[28].getMonth() !== d0.getMonth() ? 28 : days[35].getMonth() !== d0.getMonth() ? 35 : 42;
  return (
    <div class="month">
      {['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'].map((d) => (
        <div class="mo-dow">{d}</div>
      ))}
      {days.slice(0, rows).map((d) => {
        const k = toKey(d);
        const evs = events[k] || [];
        return (
          <div class={cx('mo-cell', d.getMonth() !== d0.getMonth() && 'out', k === t && 'today')} onClick={() => onDay(k)}>
            <span class="mo-num">{d.getDate()}</span>
            {evs.slice(0, 3).map((e) => (
              <Ev e={e} />
            ))}
            {evs.length > 3 && <span class="mo-more">+{evs.length - 3}</span>}
            <div class="mo-dots">
              {evs.slice(0, 6).map((e) => (
                <span class={cx('mo-dot', `tone-${e.tone}`)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ScheduleModal({ ov, onClose }) {
  const prospects = useStore(db, (s) => s.prospects);
  const [pid, setPid] = useState(ov.prospectId || '');
  const [newName, setNewName] = useState('');
  const [date, setDate] = useState(ov.date || today());
  const [heure, setHeure] = useState(ov.heure || '09:00');
  const [q, setQ] = useState('');
  const options = prospects
    .filter((p) => isOpen(p))
    .filter((p) => !q || norm(p.entreprise).includes(norm(q)))
    .sort((a, b) => a.entreprise.localeCompare(b.entreprise, 'fr'))
    .slice(0, 200);
  const isNew = pid === '__new';
  const can = (isNew ? newName.trim() : pid) && date;
  return (
    <Modal
      title="Planifier un créneau"
      subtitle="Choisissez un prospect et un créneau de rappel"
      icon="calendarClock"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="primary"
            icon="check"
            disabled={!can}
            onClick={() => {
              scheduleSlot(isNew ? null : pid, date, heure, isNew ? newName : '');
              onClose();
            }}
          >
            Planifier le créneau
          </Button>
        </>
      }
    >
      <div class="stack">
        <Field label="Prospect">
          <div class="col" style={{ gap: 8 }}>
            {options.length > 8 && <Input value={q} onInput={(e) => setQ(e.target.value)} placeholder="Filtrer la liste…" />}
            <Select value={pid} onChange={(e) => setPid(e.target.value)}>
              <option value="">— Choisir un prospect —</option>
              <option value="__new">+ Nouveau prospect</option>
              {options.map((p) => (
                <option value={p.id}>
                  {p.entreprise}
                  {p.contact ? ` — ${p.contact}` : ''}
                </option>
              ))}
            </Select>
          </div>
        </Field>
        {isNew && (
          <Field label="Nom de l'entreprise" required>
            <Input value={newName} onInput={(e) => setNewName(e.target.value)} placeholder="Ex : Agence Immo du Centre" autoFocus />
          </Field>
        )}
        <div>
          <div class="field-label mb-8">Créneau</div>
          <ReminderPicker
            date={date}
            heure={heure}
            onChange={(d, h) => {
              setDate(d);
              setHeure(h);
            }}
          />
        </div>
        {!prospects.length && <EmptyState compact icon="users" title="Aucun prospect pour l'instant" text="Choisissez « + Nouveau prospect » pour en créer un." />}
      </div>
    </Modal>
  );
}
