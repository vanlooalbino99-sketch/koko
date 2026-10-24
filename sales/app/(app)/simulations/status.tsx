import { Badge } from '@/components/ui/badge';
import type { Dictionary } from '@/lib/i18n';

type Status = keyof Dictionary['enums']['status'];

const TONE: Record<Status, string> = {
  created: 'text-muted-foreground',
  connecting: 'text-muted-foreground',
  in_progress: 'border-primary/30 text-primary',
  processing: 'border-primary/30 text-primary',
  completed: 'border-teal/30 text-teal',
  failed: 'border-destructive/30 text-destructive',
  cancelled: 'text-muted-foreground',
};

export function StatusBadge({ status, t }: { status: string; t: Dictionary }) {
  const key = (status in TONE ? status : 'created') as Status;
  return (
    <Badge variant="outline" className={TONE[key]}>
      {t.enums.status[key]}
    </Badge>
  );
}

export function duration(seconds: number, template: string, format: (t: string, v: Record<string, number>) => string) {
  return format(template, { m: Math.floor(seconds / 60), s: seconds % 60 });
}
