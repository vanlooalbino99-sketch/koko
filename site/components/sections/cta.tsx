import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { site } from '@/lib/site';

export function Cta({ title = 'Combien d’appels avez-vous manqués cette semaine ?', text = 'Réservez un audit gratuit de 20 minutes : nous chiffrons ce que vous perdez et ce que l’IA peut récupérer.' }: { title?: string; text?: string }) {
  return (
    <section className="px-4 pb-20 sm:px-6 md:pb-28">
      <div data-reveal="zoom" className="cta-mesh beam relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-14 sm:px-12 md:py-20" data-spot>
        <div className="float pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-primary/40 blur-3xl" aria-hidden />
        <div className="float pointer-events-none absolute -bottom-28 left-1/3 size-64 rounded-full bg-cyan-400/20 blur-3xl [animation-delay:-3s]" aria-hidden />
        <div className="relative max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-white/80">{text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="sheen bg-white text-[#070b14] hover:bg-white/90" data-magnet>
              <Link href="/rendez-vous">
                Réserver mon audit gratuit
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" data-magnet>
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
