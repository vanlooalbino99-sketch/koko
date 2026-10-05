import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Page introuvable' };

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-sm font-semibold text-primary">Erreur 404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Cette page n’existe pas</h1>
      <p className="mt-4 text-muted-foreground">Elle a peut-être été déplacée. Revenez à l’accueil ou contactez-nous.</p>
      <div className="mt-8 flex gap-3">
        <Button asChild><Link href="/">Accueil</Link></Button>
        <Button asChild variant="outline"><Link href="/contact">Contact</Link></Button>
      </div>
    </section>
  );
}
