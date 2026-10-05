import { cn } from '@/lib/utils';

export function Section({ className, children, ...props }: React.ComponentProps<'section'>) {
  return (
    <section className={cn('px-4 py-16 sm:px-6 md:py-24', className)} {...props}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, intro, align = 'center', as: Tag = 'h2' }: { eyebrow?: string; title: string; intro?: string; align?: 'center' | 'left'; as?: 'h1' | 'h2' }) {
  return (
    <div data-reveal className={cn('mb-12 max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && <p className="mb-3 text-sm font-semibold tracking-wide text-primary uppercase">{eyebrow}</p>}
      <Tag className={cn('font-semibold tracking-tight text-balance', Tag === 'h1' ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl')}>{title}</Tag>
      {intro && <p className="mt-4 text-lg text-pretty text-muted-foreground">{intro}</p>}
    </div>
  );
}

/** En-tête des pages intérieures. */
export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b px-4 pt-16 pb-14 sm:px-6 md:pt-24 md:pb-20">
      <div className="aurora pointer-events-none" aria-hidden><i /><i /><i /></div>
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="bg-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="rise mb-3 text-sm font-semibold tracking-wide text-primary uppercase">{eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{title}</h1>
        <p style={{ '--d': 1 } as React.CSSProperties} className="rise mx-auto mt-5 max-w-2xl text-lg text-pretty text-muted-foreground">{intro}</p>
        <div style={{ '--d': 2 } as React.CSSProperties} className="rise">{children}</div>
      </div>
    </section>
  );
}
