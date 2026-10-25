import { DemoLayer } from '@/components/demo/demo-layer';
import { getI18n, requireOnboarded } from '@/lib/server/context';

// Écrans plein cadre (appel en direct) : pas de coque d'application, mais le même accès que l'espace d'entraînement.
export default async function FocusLayout({ children }: { children: React.ReactNode }) {
  const { auth } = await requireOnboarded();
  const { t } = await getI18n();
  return (
    <>
      {children}
      <DemoLayer auth={auth} t={t} />
    </>
  );
}
