import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Archive, EyeOff, Lock, Mic, Pencil, Phone } from 'lucide-react';
import { archiveScenarioAction } from '@/app/actions/scenarios';
import { DifficultyBadge } from '@/components/scenarios/scenario-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { FormAlert } from '@/components/ui/field';
import { getDb } from '@/lib/server/db';
import { SKILLS, type DecisionPower, type Family, type Personality } from '@/lib/domain';
import { format } from '@/lib/i18n';
import { getScenario } from '@/lib/scenarios/service';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { voiceProviderFromEnv } from '@/lib/voice/provider';
import { ConfirmButton } from './confirm-button';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { auth } = await requireOnboarded();
  const detail = await getScenario(await getDb(), auth, (await params).id);
  return { title: detail?.scenario.title };
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{title}</h3>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export default async function ScenarioPage({ params, searchParams }: Props) {
  const { auth } = await requireOnboarded();
  const { t } = await getI18n();
  const s = t.scenarios;
  const detail = await getScenario(await getDb(), auth, (await params).id);
  if (!detail) notFound();
  const { scenario, content } = detail;
  const saved = (await searchParams).saved;
  const weights = content.skillWeights as Record<string, number | undefined>;
  const voiceReady = voiceProviderFromEnv() !== null;

  return (
    <div className="grid gap-6">
      <Link href="/scenarios" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> {t.nav.scenarios}
      </Link>
      {saved === 'created' && <FormAlert tone="success" message={s.created} />}
      {saved === 'updated' && <FormAlert tone="success" message={s.updated} />}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-foreground">
              {t.enums.family[scenario.family as Family]}
            </Badge>
            <DifficultyBadge difficulty={scenario.difficulty} t={t} />
            <Badge variant="outline" className={detail.isPrivate ? 'border-teal/30 text-teal' : 'text-muted-foreground'}>
              {detail.isPrivate && <Lock aria-hidden="true" />} {detail.isPrivate ? s.badgePrivate : s.badgeCatalog}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {format(s.version, { n: detail.version })} · {t.enums.language[scenario.language as 'fr' | 'en']} ·{' '}
              {format(s.estimated, { n: scenario.estimatedMinutes })}
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{scenario.title}</h1>
          <p className="mt-2 text-muted-foreground">{scenario.summary}</p>
        </div>
        {detail.canEdit && (
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/scenarios/${scenario.id}/edit`}>
                <Pencil /> {t.common.edit}
              </Link>
            </Button>
            <form action={archiveScenarioAction}>
              <input type="hidden" name="id" value={scenario.id} />
              <ConfirmButton message={s.archiveConfirm}>
                <Archive /> {s.archive}
              </ConfirmButton>
            </form>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="grid gap-4 lg:col-span-2">
          <Card className="grid gap-5">
            <Block title={s.objective}>{content.objective}</Block>
            {content.context && <Block title={s.context}>{content.context}</Block>}
            <div className="grid gap-5 sm:grid-cols-2">
              <Block title={s.need}>{content.need}</Block>
              <Block title={s.budget}>{content.budget}</Block>
            </div>
          </Card>
          <Card className="grid gap-5 sm:grid-cols-2">
            <Block title={s.objections}>
              <List items={content.objections} />
            </Block>
            <Block title={s.successCriteria}>
              <List items={content.successCriteria} />
            </Block>
            {content.constraints.length > 0 && (
              <Block title={s.constraints}>
                <List items={content.constraints} />
              </Block>
            )}
          </Card>
          {'hiddenFacts' in content && (
            <Card className="grid gap-5 border-warning/30 bg-warning/5">
              <div className="flex items-start gap-3">
                <EyeOff className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
                <div>
                  <CardTitle>{s.hiddenFacts}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">{s.hiddenFactsHint}</p>
                </div>
              </div>
              {content.hiddenFacts.length > 0 && <List items={content.hiddenFacts} />}
              {content.endConditions.length > 0 && (
                <Block title={s.endConditions}>
                  <List items={content.endConditions} />
                </Block>
              )}
            </Card>
          )}
        </div>

        <div className="grid content-start gap-4">
          <Card className="grid gap-4 border-primary/30 bg-primary/5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/20 text-primary">
                <Mic className="size-5" aria-hidden="true" />
              </span>
              <CardTitle>{s.startTitle}</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">{voiceReady ? s.startText : t.call.notConfigured}</p>
            {scenario.status === 'active' &&
              (voiceReady ? (
                <Button asChild size="lg">
                  <Link href={`/scenarios/${scenario.id}/call`}>
                    <Phone /> {t.call.start}
                  </Link>
                </Button>
              ) : (
                // Sans clé, l'écran d'appel reste visible : il explique pourquoi l'appel ne peut pas démarrer.
                <Button asChild size="lg" variant="outline">
                  <Link href={`/scenarios/${scenario.id}/call`}>
                    <Phone /> {t.call.preview}
                  </Link>
                </Button>
              ))}
          </Card>
          <Card className="grid gap-4">
            <CardTitle>{s.prospect}</CardTitle>
            <div>
              <p className="font-medium">{content.prospect.name}</p>
              <p className="text-sm text-muted-foreground">
                {content.prospect.role} · {content.prospect.company}
                {content.prospect.companySize && ` · ${content.prospect.companySize}`}
              </p>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">{s.personality}</dt>
              <dd className="text-right">{t.enums.personality[content.prospect.personality as Personality]}</dd>
              <dt className="text-muted-foreground">{s.decisionPower}</dt>
              <dd className="text-right">{t.enums.decisionPower[content.prospect.decisionPower as DecisionPower]}</dd>
            </dl>
            {content.prospect.publicProfile && <Block title={s.beforeCall}>{content.prospect.publicProfile}</Block>}
          </Card>
          <Card className="grid gap-3">
            <CardTitle>{s.offer}</CardTitle>
            <p className="font-medium">{content.offer.name}</p>
            {content.offer.description && <p className="text-sm text-muted-foreground">{content.offer.description}</p>}
            {content.offer.price && (
              <p className="text-sm">
                <span className="text-muted-foreground">{s.price} : </span>
                {content.offer.price}
              </p>
            )}
          </Card>
          <Card className="grid gap-3">
            <CardTitle>{s.skills}</CardTitle>
            <ul className="grid gap-2">
              {SKILLS.filter((k) => (weights[k] ?? 0) > 0).map((k) => (
                <li key={k} className="grid gap-1">
                  <div className="flex justify-between text-sm">
                    <span>{t.enums.skill[k]}</span>
                    <span className="text-xs text-muted-foreground">{format(s.weight, { n: weights[k]! })}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-2">
                    <div className="h-1.5 rounded-full bg-teal" style={{ width: `${(weights[k]! / 5) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
