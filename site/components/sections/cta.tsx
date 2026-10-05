import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { site } from '@/lib/site';

export function Cta({ title = 'Combien d’appels avez-vous manqués cette semaine ?', text = 'Réservez un audit gratuit de 20 minutes : nous chiffrons ce que vous perdez et ce que l’IA peut récupérer.' }: { title?: string; text?: string }) {
  return (
    <section className="px-4 pb-20 sm:px-6 md:pb-28">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-foreground px-6 py-14 text-background sm:px-12 md:py-16">
        <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-primary/40 blur-3xl" aria-hidden />
        <div className="relative max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg opacity-80">{text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
              <Link href="/rendez-vous">
                Réserver mon audit gratuit
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-background hover:bg-background/10 hover:text-background">
              <a href={`tel:${site.phone.replace(/\s/g, '')}`}>
                <Phone aria-hidden />
                {site.phoneDisplay}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
