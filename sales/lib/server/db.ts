import 'server-only';
import { cookies } from 'next/headers';
import { getDb as getMainDb, type Db } from '@/lib/db/client';
import { DEMO_COOKIE, demoDb, demoSpaceEnabled } from '@/lib/demo/space';

// Base de la requête. Pendant la visite de démo (cookie bs_demo), l'espace de démonstration : données fictives, en
// lecture seule. Sinon la vraie base.
export async function getDb(): Promise<Db> {
  if (demoSpaceEnabled() && (await cookies()).has(DEMO_COOKIE)) return demoDb();
  return getMainDb();
}
