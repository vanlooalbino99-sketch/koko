import { auditLog } from './db/schema.ts';
import type { Db } from './db/client.ts';

type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];

// Journal des actions sensibles. Jamais de mot de passe, de jeton ni de contenu de conversation dans metadata.
export async function audit(
  db: Db | Tx,
  entry: {
    action: string;
    organizationId?: string | null;
    actorUserId?: string | null;
    targetType?: string;
    targetId?: string;
    metadata?: Record<string, string | number | boolean | null>;
  },
) {
  await db.insert(auditLog).values({
    action: entry.action,
    organizationId: entry.organizationId ?? null,
    actorUserId: entry.actorUserId ?? null,
    targetType: entry.targetType,
    targetId: entry.targetId,
    metadata: entry.metadata ?? {},
  });
}
