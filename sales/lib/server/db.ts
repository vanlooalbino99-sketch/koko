import 'server-only';
import { cookies } from 'next/headers';
import { getDb as getMainDb, type Db } from '@/lib/db/client';
import { DEMO_COOKIE, demoSpace, demoSpaceEnabled } from '@/lib/demo/space';

// Base de la requête. Pendant la visite de démo (cookie bs_demo), la base de démonstration : en mémoire, remplie de
// données fictives et en lecture seule. Sinon la vraie base.
export async function getDb(): Promise<Db> {
  if (demoSpaceEnabled() && (await cookies()).has(DEMO_COOKIE)) return (await demoSpace()).db;
  return getMainDb();
}
