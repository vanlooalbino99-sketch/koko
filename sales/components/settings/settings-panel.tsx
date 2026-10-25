import { cn } from '@/lib/utils';

// Panneau d'une section des réglages : titre, sous-titre et action à droite, puis le contenu.
export function SettingsPanel({
  title,
  subtitle,
  actions,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby="settings-title" className="min-h-full rounded-xl border border-border bg-surface">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
        <div className="min-w-0">
          <h1 id="settings-title" className="text-[15px] font-semibold tracking-tight">
            {title}
          </h1>
          {subtitle && <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>}
        </div>
        {actions}
      </header>
      <div className={cn('grid gap-5 p-3 sm:p-5', className)}>{children}</div>
    </section>
  );
}
