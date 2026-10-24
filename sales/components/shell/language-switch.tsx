import { setLocaleAction } from '@/app/actions/auth';
import { LOCALES, type Locale } from '@/lib/domain';
import { cn } from '@/lib/utils';

export function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  return (
    <form action={setLocaleAction} className="flex items-center rounded-lg border border-border bg-surface p-0.5" aria-label={label}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="submit"
          name="locale"
          value={l}
          aria-pressed={l === locale}
          className={cn(
            'rounded-md px-2 py-1 text-xs font-medium uppercase transition-colors',
            l === locale ? 'bg-surface-2 text-foreground' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {l}
        </button>
      ))}
    </form>
  );
}
