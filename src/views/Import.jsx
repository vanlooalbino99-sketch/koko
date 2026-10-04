// Import de leads : fichier CSV / copier-coller avec correspondance des colonnes, ou base officielle Sirene.
import { useState, useRef } from 'preact/hooks';
import { IMPORT_FIELDS, IMPORT_DETECT, API_SUGGESTIONS } from '../lib/constants.js';
import { importLeads } from '../lib/actions.js';
import { parseCsv, readFileText, norm, plural } from '../lib/util.js';
import { Modal, Button, Tabs, Field, Input, Textarea, Select, Checkbox, EmptyState, cx } from '../components/ui.jsx';
import { Icon } from '../components/icons.jsx';

function detect(headers) {
  return headers.map((h) => {
    const n = norm(h);
    const m = IMPORT_DETECT.find((d) => d.keys.some((k) => n.includes(norm(k))));
    return m ? m.field : 'ignore';
  });
}

async function searchSirene(q, cp, perPage = 20) {
  const p = new URLSearchParams({ q: q || '', page: '1', per_page: String(perPage) });
  if (cp) p.set('code_postal', cp);
  const r = await fetch(`https://recherche-entreprises.api.gouv.fr/search?${p}`);
  if (!r.ok) throw new Error(`Erreur API (${r.status})`);
  const j = await r.json();
  return (Array.isArray(j.results) ? j.results : []).map((u) => {
    const s = u.siege || {};
    const dir = (u.dirigeants || []).find((d) => d.nom || d.prenoms);
    return {
      siret: s.siret || u.siret || '',
      siren: u.siren || '',
      nom: u.nom_complet || u.nom_raison_sociale || s.nom_complet || 'Entreprise sans nom',
      adresse: s.adresse || s.geo_adresse || '',
      codePostal: s.code_postal || '',
      ville: s.libelle_commune || s.commune || '',
      lat: parseFloat(s.latitude),
      lon: parseFloat(s.longitude),
      naf: u.activite_principale || s.activite_principale || '',
      dirigeant: dir ? [dir.prenoms, dir.nom].filter(Boolean).join(' ').replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\B\w/g, (c) => c.toLowerCase()) : '',
      effectif: u.tranche_effectif_salarie || '',
    };
  });
}

export function ImportModal({ onClose }) {
  const [tab, setTab] = useState('csv');
  return (
    <Modal title="Importer des leads" subtitle="Les doublons (même téléphone, ou même nom + ville) sont ignorés" icon="upload" size="lg" onClose={onClose}>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'csv', label: 'Fichier / copier-coller', icon: 'fileSheet' },
          { value: 'api', label: 'Base officielle (Sirene)', icon: 'globe' },
        ]}
      />
      <div class="mt-16">{tab === 'csv' ? <CsvImport onDone={onClose} /> : <ApiImport onDone={onClose} />}</div>
    </Modal>
  );
}

function CsvImport({ onDone }) {
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [map, setMap] = useState([]);
  const [over, setOver] = useState(false);
  const fileRef = useRef(null);
  function analyse(t) {
    const p = parseCsv(t);
    if (!p.headers.length) return;
    setParsed(p);
    setMap(detect(p.headers));
  }
  async function onFile(f) {
    if (!f) return;
    const t = await readFileText(f);
    setText(t);
    analyse(t);
  }
  const rows = parsed
    ? parsed.rows
        .map((r) => {
          const o = {};
          map.forEach((f, i) => {
            if (f !== 'ignore' && r[i]) o[f] = o[f] ? o[f] + ' ' + r[i] : r[i];
          });
          return o;
        })
        .filter((o) => o.entreprise)
    : [];
  if (!parsed)
    return (
      <div class="stack">
        <p class="sm text-2">Collez une liste (export LinkedIn, Pages Jaunes Pro, fichier client) ou importez un fichier CSV. La première ligne doit contenir les en-têtes de colonnes.</p>
        <div
          class={cx('dropzone', over && 'over')}
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => (e.preventDefault(), setOver(true))}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            onFile(e.dataTransfer.files[0]);
          }}
        >
          <Icon name="upload" size={22} style={{ margin: '0 auto 8px', color: 'var(--accent-text)' }} />
          <div class="fw-6">Déposez un fichier CSV ici</div>
          <div class="xs text-3">ou cliquez pour parcourir — séparateurs , ; ou tabulation</div>
          <input ref={fileRef} type="file" accept=".csv,.txt,text/csv" hidden onChange={(e) => onFile(e.target.files[0])} />
        </div>
        <div class="upper" style={{ textAlign: 'center' }}>ou collez le texte ci-dessous</div>
        <Textarea
          rows={6}
          value={text}
          onInput={(e) => setText(e.target.value)}
          placeholder={'Entreprise;Secteur;Contact;Téléphone\nAgence Immo du Centre;Immobilier;M. Dupont;0612345678'}
          class="mono"
        />
        <div class="row" style={{ justifyContent: 'flex-end' }}>
          <Button variant="primary" icon="arrowRight" disabled={!text.trim()} onClick={() => analyse(text)}>
            Analyser
          </Button>
        </div>
      </div>
    );
  return (
    <div class="stack">
      <div class="row between">
        <div class="fw-6">Correspondance des colonnes</div>
        <Button size="sm" variant="ghost" icon="refresh" onClick={() => setParsed(null)}>
          Recommencer
        </Button>
      </div>
      <div class="grid-2">
        {parsed.headers.map((h, i) => (
          <Field label={h || `Colonne ${i + 1}`}>
            <Select value={map[i]} onChange={(e) => setMap((m) => m.map((x, j) => (j === i ? e.target.value : x)))} options={IMPORT_FIELDS.map((f) => ({ value: f.id, label: f.label }))} />
          </Field>
        ))}
      </div>
      {!map.includes('entreprise') && (
        <div class="callout tone-amber">
          <Icon name="alert" size={16} />
          Associez au moins une colonne au champ « Entreprise ».
        </div>
      )}
      <div>
        <div class="upper mb-8">Aperçu (5 premières lignes)</div>
        <div class="table-wrap card card-flush">
          <table class="table">
            <thead>
              <tr>
                {['entreprise', 'contact', 'telephone', 'email', 'ville', 'secteur'].map((k) => (
                  <th>{IMPORT_FIELDS.find((f) => f.id === k).label.replace(' *', '')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 5).map((r) => (
                <tr>
                  {['entreprise', 'contact', 'telephone', 'email', 'ville', 'secteur'].map((k) => (
                    <td class="sm">{r[k] || <span class="text-3">—</span>}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div class="row" style={{ justifyContent: 'flex-end' }}>
        <Button
          variant="primary"
          icon="check"
          disabled={!rows.length}
          onClick={() => {
            importLeads(rows);
            onDone();
          }}
        >
          Importer {plural(rows.length, 'lead')}
        </Button>
      </div>
    </div>
  );
}

function ApiImport({ onDone }) {
  const [q, setQ] = useState('');
  const [cp, setCp] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [res, setRes] = useState(null);
  const [sel, setSel] = useState(new Set());
  async function run(query) {
    const qq = query != null ? query : q;
    if (!qq.trim()) return;
    if (query != null) setQ(query);
    setLoading(true);
    setErr('');
    try {
      const r = await searchSirene(qq, cp.trim(), 25);
      setRes(r);
      setSel(new Set(r.map((x) => x.siret || x.siren)));
    } catch (e) {
      setErr("Recherche impossible : vérifiez votre connexion internet. (" + e.message + ')');
      setRes(null);
    }
    setLoading(false);
  }
  const chosen = (res || []).filter((x) => sel.has(x.siret || x.siren));
  return (
    <div class="stack">
      <div class="callout tone-sky">
        <Icon name="info" size={16} />
        <span>Base officielle des entreprises françaises (data.gouv.fr / Sirene). Données réelles et vérifiées : nom, SIRET, adresse, dirigeant. Ne fournit pas de téléphone — à compléter après import.</span>
      </div>
      <form
        class="row"
        style={{ alignItems: 'flex-end' }}
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
      >
        <Field label="Activité ou nom" class="grow">
          <Input value={q} onInput={(e) => setQ(e.target.value)} placeholder="ex : plombier" />
        </Field>
        <Field label="Code postal" style={{ width: 110 }}>
          <Input value={cp} onInput={(e) => setCp(e.target.value)} placeholder="69002" inputMode="numeric" style={{ width: 110 }} />
        </Field>
        <Button type="submit" variant="primary" icon="search" loading={loading}>
          Chercher
        </Button>
      </form>
      <div class="quick-dates">
        {API_SUGGESTIONS.map((s) => (
          <button type="button" onClick={() => run(s)}>
            {s}
          </button>
        ))}
      </div>
      {err && (
        <div class="callout tone-rose">
          <Icon name="alert" size={16} />
          {err}
        </div>
      )}
      {res && !res.length && <EmptyState compact icon="search" title="Aucun résultat pour cette recherche." />}
      {res && res.length > 0 && (
        <>
          <div class="row between">
            <span class="sm text-2">
              {res.length} résultats · {chosen.length} sélectionnés
            </span>
            <button class="link-btn" onClick={() => setSel(chosen.length === res.length ? new Set() : new Set(res.map((x) => x.siret || x.siren)))}>
              {chosen.length === res.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          </div>
          <div class="card card-flush" style={{ maxHeight: 340, overflowY: 'auto' }}>
            {res.map((x) => {
              const k = x.siret || x.siren;
              return (
                <div
                  class="list-item clickable"
                  onClick={() =>
                    setSel((s) => {
                      const n = new Set(s);
                      n.has(k) ? n.delete(k) : n.add(k);
                      return n;
                    })
                  }
                >
                  <Checkbox checked={sel.has(k)} onChange={() => {}} />
                  <div class="li-main">
                    <div class="li-title">{x.nom}</div>
                    <div class="li-sub">
                      {[x.dirigeant, x.adresse || `${x.codePostal} ${x.ville}`].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <span class="xs text-3 mono hide-mobile">{x.siret || x.siren}</span>
                </div>
              );
            })}
          </div>
          <div class="row" style={{ justifyContent: 'flex-end' }}>
            <Button
              variant="primary"
              icon="check"
              disabled={!chosen.length}
              onClick={() => {
                importLeads(
                  chosen.map((x) => ({
                    entreprise: x.nom,
                    contact: x.dirigeant,
                    ville: x.ville,
                    adresse: x.adresse,
                    siret: x.siret,
                    ...(Number.isFinite(x.lat) && Number.isFinite(x.lon) ? { geo: { lat: x.lat, lon: x.lon, ville: x.ville } } : {}),
                    canal: 'Base Sirene',
                    notes: `Import API officielle (data.gouv.fr) — SIRET ${x.siret || 'n/c'}${x.naf ? ` — NAF ${x.naf}` : ''}`,
                  })),
                );
                onDone();
              }}
            >
              Importer {plural(chosen.length, 'entreprise')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
