import { requireOnboarded } from '@/lib/server/context';

// Écrans plein cadre (appel en direct) : pas de coque d'application, mais le même accès que l'espace d'entraînement.
export default async function FocusLayout({ children }: { children: React.ReactNode }) {
  await requireOnboarded();
  return children;
}
