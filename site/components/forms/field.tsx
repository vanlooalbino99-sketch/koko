import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/** Libellé + champ + message d'erreur, reliés pour les lecteurs d'écran. */
export function Field({ id, label, error, hint, optional, className, children }: {
  id: string; label: string; error?: string; hint?: string; optional?: boolean; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor={id}>
        {label}
        {optional && <span className="font-normal text-muted-foreground">(facultatif)</span>}
      </Label>
      {children}
      {hint && !error && <p id={`${id}-aide`} className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p id={`${id}-erreur`} role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

/** Attributs d'accessibilité d'un champ selon son état. */
export const a11y = (id: string, error?: string, hint?: boolean) => ({
  id,
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error ? `${id}-erreur` : hint ? `${id}-aide` : undefined,
});

export const selectClass =
  'flex h-11 w-full appearance-none rounded-md border border-input bg-background bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat px-3 pr-10 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 aria-invalid:border-destructive md:text-sm ' +
  "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23808a9b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")]";

/** Case d'accord RGPD. */
export function Consent({ error, ...props }: React.ComponentProps<'input'> & { error?: string }) {
  return (
    <div className="grid gap-2">
      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]" aria-invalid={error ? true : undefined} aria-describedby={error ? 'consentement-erreur' : undefined} {...props} />
        <span>J’accepte que Blackstart AI utilise ces informations pour me recontacter. Elles ne sont jamais revendues.</span>
      </label>
      {error && <p id="consentement-erreur" role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

/** Champ piège invisible pour les robots. */
export function Honeypot(props: React.ComponentProps<'input'>) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Site web
        <input type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
}
