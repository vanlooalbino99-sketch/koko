import { Card } from '@/components/ui/card';

// Une tuile de chiffre clé : libellé, icône, valeur, détail facultatif.
export function Kpi({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: React.ReactNode; detail?: React.ReactNode }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {label}
        <span className="grid size-8 place-items-center rounded-lg bg-surface-2 text-primary">{icon}</span>
      </div>
      <div className="text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
      {detail && <div className="text-xs text-muted-foreground">{detail}</div>}
    </Card>
  );
}
