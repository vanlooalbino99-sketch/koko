import Link from 'next/link';
import { Clock, Lock, Phone, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Scenario } from '@/lib/db/schema';
import type { Difficulty, Family } from '@/lib/domain';
import { format, type Dictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const DIFFICULTY_TONE: Record<Difficulty, string> = {
  beginner: 'bg-success/10 text-success border-success/25',
  intermediate: 'bg-warning/10 text-warning border-warning/25',
  expert: 'bg-destructive/10 text-destructive border-destructive/25',
};

export function DifficultyBadge({ difficulty, t }: { difficulty: string; t: Dictionary }) {
  const d = difficulty as Difficulty;
  return (
    <Badge variant="outline" className={cn('border', DIFFICULTY_TONE[d])}>
      {t.enums.difficulty[d]}
    </Badge>
  );
}

export function ScenarioCard({ scenario, t, footer }: { scenario: Scenario; t: Dictionary; footer?: React.ReactNode }) {
  const ChannelIcon = scenario.channel === 'video' ? Video : Phone;
  return (
    <Link
      href={`/scenarios/${scenario.id}`}
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-primary/40 hover:bg-surface-2/40 focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="border-primary/30 bg-primary/10 text-foreground">
          {t.enums.family[scenario.family as Family]}
        </Badge>
        <DifficultyBadge difficulty={scenario.difficulty} t={t} />
        {scenario.organizationId && (
          <Badge variant="outline" className="border-teal/30 text-teal">
            <Lock aria-hidden="true" /> {t.scenarios.badgePrivate}
          </Badge>
        )}
      </div>
      <h3 className="font-medium leading-snug group-hover:text-foreground">{scenario.title}</h3>
      <p className="line-clamp-2 text-sm text-muted-foreground">{scenario.summary}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ChannelIcon className="size-3.5" aria-hidden="true" /> {t.enums.channel[scenario.channel as 'phone' | 'video']}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden="true" /> {format(t.scenarios.estimated, { n: scenario.estimatedMinutes })}
        </span>
        <span>{scenario.industry}</span>
        <span className="uppercase">{scenario.language}</span>
      </div>
      {footer}
    </Link>
  );
}
