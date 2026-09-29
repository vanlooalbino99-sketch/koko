// Tâches : à faire, en retard, à venir, terminées — liées ou non à un prospect.
import { useState } from 'preact/hooks';
import { db, useStore } from '../lib/store.js';
import { open } from '../lib/nav.js';
import { TASK_PRIORITES as PRIORITES } from '../lib/constants.js';
import { saveTask, toggleTask, deleteTask } from '../lib/actions.js';
import { today, inDays, fmtRelative, plural } from '../lib/util.js';
import { PageHeader, Button, IconButton, Card, Checkbox, EmptyState, Modal, Field, Input, Textarea, Select, Segmented, PrioriteBadge, Tabs, cx } from '../components/ui.jsx';
import { Icon } from '../components/icons.jsx';

export function Tasks() {
  const { tasks, prospects } = useStore(db);
  const [tab, setTab] = useState('todo');
  const t = today();
  const pending = tasks.filter((x) => !x.done);
  const groups = {
    late: pending.filter((x) => x.due && x.due < t),
    today: pending.filter((x) => x.due === t),
    next: pending.filter((x) => !x.due || x.due > t),
    done: tasks.filter((x) => x.done),
  };
  const sortFn = (a, b) => (a.due || '9999').localeCompare(b.due || '9999') || (a.heure || '99').localeCompare(b.heure || '99') || (PRIORITES[b.priorite]?.rank || 0) - (PRIORITES[a.priorite]?.rank || 0);
  const Row = ({ x }) => {
    const p = x.prospectId && prospects.find((pp) => pp.id === x.prospectId);
    return (
      <div class={cx('task-row', x.done && 'done')}>
        <Checkbox class="round" checked={x.done} onChange={() => toggleTask(x.id)} label={x.done ? 'Rouvrir' : 'Terminer'} />
        <button class="grow min-w-0" style={{ textAlign: 'left' }} onClick={() => open('taskForm', { id: x.id })}>
          <div class="task-title">{x.title}</div>
          <div class="task-meta">
            <span class={cx(!x.done && x.due && x.due < t && 'text-bad fw-6')}>
              <Icon name="calendar" size={11} style={{ display: 'inline', verticalAlign: '-1px' }} /> {x.due ? fmtRelative(x.due) : 'Sans date'}
              {x.heure ? ` · ${x.heure}` : ''}
            </span>
            {p && (
              <span
                class="link-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  open('prospect', { id: p.id });
                }}
              >
                <Icon name="building" size={11} /> {p.entreprise}
              </span>
            )}
            <PrioriteBadge priorite={x.priorite} task />
          </div>
          {x.notes && <div class="xs text-3 mt-4 truncate">{x.notes}</div>}
        </button>
        <IconButton icon="trash" label="Supprimer" onClick={() => deleteTask(x.id)} />
      </div>
    );
  };
  const Section = ({ title, list, tone }) =>
    list.length ? (
      <Card pad={false} title={title} subtitle={plural(list.length, 'tâche')} icon={tone}>
        {[...list].sort(sortFn).map((x) => (
          <Row x={x} />
        ))}
      </Card>
    ) : null;
  return (
    <>
      <PageHeader title="Tâches" subtitle={`${plural(pending.length, 'tâche')} à faire${groups.late.length ? ` · ${groups.late.length} en retard` : ''}`}>
        <Button variant="primary" icon="plus" onClick={() => open('taskForm')}>
          Nouvelle tâche
        </Button>
      </PageHeader>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'todo', label: 'À faire', count: pending.length },
          { value: 'done', label: 'Terminées', count: groups.done.length },
        ]}
      />
      <div class="stack mt-16">
        {tab === 'todo' ? (
          pending.length ? (
            <>
              <Section title="En retard" list={groups.late} tone="alert" />
              <Section title="Aujourd'hui" list={groups.today} tone="sun" />
              <Section title="À venir" list={groups.next} tone="calendar" />
            </>
          ) : (
            <Card>
              <EmptyState icon="check2" title="Tout est fait 🎉" text="Ajoutez des tâches pour ne rien oublier : envoyer une doc, préparer un audit, relancer un devis…">
                <Button variant="primary" icon="plus" onClick={() => open('taskForm')}>
                  Nouvelle tâche
                </Button>
              </EmptyState>
            </Card>
          )
        ) : groups.done.length ? (
          <Card pad={false}>
            {[...groups.done]
              .sort((a, b) => (b.doneAt || '').localeCompare(a.doneAt || ''))
              .map((x) => (
                <Row x={x} />
              ))}
          </Card>
        ) : (
          <Card>
            <EmptyState icon="checkSquare" title="Aucune tâche terminée" />
          </Card>
        )}
      </div>
    </>
  );
}

export function TaskForm({ ov, onClose }) {
  const { tasks, prospects } = useStore(db);
  const existing = ov.id ? tasks.find((x) => x.id === ov.id) : null;
  const [f, setF] = useState(existing || { title: '', prospectId: ov.prospectId || '', due: today(), heure: '', priorite: '', notes: '' });
  const set = (k) => (e) => setF((o) => ({ ...o, [k]: e && e.target ? e.target.value : e }));
  const submit = (e) => {
    e && e.preventDefault();
    if (!f.title.trim()) return;
    saveTask({ ...f, title: f.title.trim(), prospectId: f.prospectId || null });
    onClose();
  };
  return (
    <Modal
      title={existing ? 'Modifier la tâche' : 'Nouvelle tâche'}
      icon="checkSquare"
      onClose={onClose}
      footer={
        <>
          {existing && (
            <Button
              variant="danger-ghost"
              icon="trash"
              onClick={() => {
                deleteTask(existing.id);
                onClose();
              }}
            >
              Supprimer
            </Button>
          )}
          <span class="spacer" />
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" icon="check" disabled={!f.title.trim()} onClick={submit}>
            Enregistrer
          </Button>
        </>
      }
    >
      <form class="stack" onSubmit={submit}>
        <Field label="Intitulé" required>
          <Input value={f.title} onInput={set('title')} placeholder="Ex : Envoyer la plaquette, préparer l'audit…" data-autofocus />
        </Field>
        <Field label="Prospect lié">
          <Select value={f.prospectId || ''} onChange={set('prospectId')}>
            <option value="">— Aucun —</option>
            {[...prospects]
              .sort((a, b) => a.entreprise.localeCompare(b.entreprise, 'fr'))
              .map((p) => (
                <option value={p.id}>{p.entreprise}</option>
              ))}
          </Select>
        </Field>
        <div class="grid-2">
          <Field label="Échéance">
            <Input type="date" value={f.due || ''} onInput={set('due')} />
          </Field>
          <Field label="Heure (rappel)">
            <Input type="time" value={f.heure || ''} onInput={set('heure')} />
          </Field>
        </div>
        <div class="quick-dates">
          {[
            ["Aujourd'hui", today()],
            ['Demain', inDays(1)],
            ['Dans 3 jours', inDays(3)],
            ['Semaine pro.', inDays(7)],
          ].map(([l, d]) => (
            <button type="button" class={cx(f.due === d && 'on')} onClick={() => setF((o) => ({ ...o, due: d }))}>
              {l}
            </button>
          ))}
        </div>
        <Field label="Priorité">
          <Segmented value={f.priorite || ''} onChange={set('priorite')} options={[{ value: '', label: 'Normale' }, ...Object.entries(PRIORITES).map(([k, v]) => ({ value: k, label: v.label }))]} />
        </Field>
        <Field label="Notes">
          <Textarea value={f.notes} onInput={set('notes')} placeholder="Détails…" />
        </Field>
        <button type="submit" hidden />
      </form>
    </Modal>
  );
}
