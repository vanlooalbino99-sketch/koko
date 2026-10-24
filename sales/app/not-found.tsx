import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getI18n } from '@/lib/server/context';

export default async function NotFound() {
  const { t } = await getI18n();
  return (
    <main className="grid min-h-[60dvh] place-items-center px-4 text-center">
      <div>
        <p className="font-mono text-sm text-primary">404</p>
        <h1 className="mt-2 text-2xl font-semibold">{t.common.notFound}</h1>
        <p className="mt-2 text-muted-foreground">{t.common.notFoundText}</p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/">{t.common.home}</Link>
        </Button>
      </div>
    </main>
  );
}
