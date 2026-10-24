import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { ScenarioCard } from '@/components/scenarios/scenario-card';
import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/ui/field';
import { Input, Select } from '@/components/ui/input';
import { getDb } from '@/lib/db/client';
import { DIFFICULTIES, FAMILIES, LOCALES, isOneOf } from '@/lib/domain';
import { format } from '@/lib/i18n';
import { listScenarios } from '@/lib/scenarios/service';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { cn } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.scenarios.title };
}

type Params = { q?: string; family?: string; difficulty?: string; language?: string; scope?: string; saved?: string };

export default async function ScenariosPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { auth } = await requireOnboarded();
  const { t } = await getI18n();
  const s = t.scenarios;
  const params = await searchParams;
  const scope = isOneOf(['all', 'catalog', 'private'] as const, params.scope) ? params.scope : 'all';
  const filters = {
    q: params.q?.slice(0, 80),
    family: isOneOf(FAMILIES, params.family) ? params.family : undefined,
    difficulty: isOneOf(DIFFICULTIES, params.difficulty) ? params.difficulty : undefined,
    language: isOneOf(LOCALES, params.language) ? params.language : undefined,
    scope,
  };
  const rows = await listScenarios(await getDb(), auth, filters);
  const tabHref = (value: string) => {
    const next = new URLSearchParams(Object.entries({ ...filters, scope: value }).filter((e): e is [string, string] => !!e[1]));
    return `/scenarios?${next}`;
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{s.title}</h1>
        <p className="mt-1 text-muted-foreground">{s.subtitle}</p>
      </div>
      {params.saved === 'archived' && <FormAlert tone="success" message={s.archived} />}

      <nav aria-label={s.title} className="flex gap-1 border-b border-border">
        {(
          [
            ['all', s.scopeAll],
            ['catalog', s.scopeCatalog],
            ['private', s.scopePrivate],
          ] as const
        ).map(([value, label]) => (
          <Link
            key={value}
            href={tabHref(value)}
            aria-current={scope === value ? 'page' : undefined}
            className={cn(
              '-mb-px border-b-2 px-3 py-2 text-sm transition-colors',
              scope === value ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      <form className="grid gap-3 rounded-2xl border border-border bg-surface p-4 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto]" role="search">
        <input type="hidden" name="scope" value={scope} />
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input name="q" type="search" defaultValue={filters.q} placeholder={t.nav.search} aria-label={t.nav.search} className="pl-9" />
        </div>
        <Select name="family" defaultValue={filters.family ?? ''} aria-label={s.filterFamily}>
          <option value="">{s.filterFamily} · {s.any}</option>
          {FAMILIES.map((f) => (
            <option key={f} value={f}>
              {t.enums.family[f]}
            </option>
          ))}
        </Select>
        <Select name="difficulty" defaultValue={filters.difficulty ?? ''} aria-label={s.filterDifficulty}>
          <option value="">{s.filterDifficulty} · {s.any}</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {t.enums.difficulty[d]}
            </option>
          ))}
        </Select>
        <Select name="language" defaultValue={filters.language ?? ''} aria-label={s.filterLanguage}>
          <option value="">{s.filterLanguage} · {s.any}</option>
          {LOCALES.map((l) => (
            <option key={l} value={l}>
              {t.enums.language[l]}
            </option>
          ))}
        </Select>
        <div className="flex gap-2">
          <Button type="submit">{s.apply}</Button>
          <Button asChild variant="ghost">
            <Link href={`/scenarios?scope=${scope}`}>{s.reset}</Link>
          </Button>
        </div>
      </form>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {format(s.count, { n: rows.length })}
      </p>
      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-4 py-12 text-center text-muted-foreground">
          {scope === 'private' ? s.emptyPrivate : s.empty}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => (
            <ScenarioCard key={row.id} scenario={row} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}
