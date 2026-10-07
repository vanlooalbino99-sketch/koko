import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { packs } from '@/lib/site';
import { cn } from '@/lib/utils';

/** Les quatre packs. En version courte (accueil), seules les premières prestations sont listées. */
export function PackCards({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
      {packs.map((p, i) => {
        const shown = compact ? p.features.slice(0, 5) : p.features;
        const more = p.features.length - shown.length;
        return (
          <article
            key={p.slug}
            id={p.slug}
            data-reveal
            data-spot
            style={{ '--d': i } as React.CSSProperties}
            className={cn(
              'lift relative flex scroll-mt-24 flex-col rounded-2xl border bg-card p-6',
              p.featured && 'beam border-primary/50 bg-gradient-to-b from-primary/10 to-card shadow-xl shadow-primary/10 xl:-my-3 xl:py-9',
            )}
          >
            {p.featured && (
              <Badge className="absolute -top-3 left-6 gap-1 px-3 py-1 text-xs">
                <Sparkles aria-hidden /> Recommandé
              </Badge>
            )}
            <h3 className="text-sm font-semibold tracking-wide text-primary uppercase">Pack « {p.name} »</h3>
            <p className="mt-3 text-sm text-pretty text-muted-foreground">{p.pitch}</p>
            {p.audience && (
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Pour qui">
                {p.audience.map((a) => <li key={a}><Badge variant="outline" className="font-normal">{a}</Badge></li>)}
              </ul>
            )}
            <div className="mt-6 border-t pt-5">
              <p className="flex items-baseline gap-1.5">
                <span className="num-grad text-3xl font-semibold tracking-tight">{p.setupLabel}</span>
              </p>
              <p className="text-xs text-muted-foreground">mise en place</p>
              <p className="mt-2 text-lg font-semibold">
                + {p.monthlyLabel}<span className="text-sm font-normal text-muted-foreground"> / mois</span>
              </p>
            </div>
            <ul className="mt-5 flex-1 space-y-2.5 text-sm">
              {shown.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
              {more > 0 && <li className="pl-6.5 text-muted-foreground">+ {more} autre{more > 1 ? 's' : ''} inclus</li>}
            </ul>
            <Button asChild size="lg" variant={p.featured ? 'default' : 'outline'} className={cn('mt-6 w-full', p.featured && 'sheen glow-btn')} data-magnet>
              <Link href={`/rendez-vous?service=pack-${p.slug}`}>
                Choisir ce pack <ArrowRight aria-hidden />
              </Link>
            </Button>
          </article>
        );
      })}
    </div>
  );
}
