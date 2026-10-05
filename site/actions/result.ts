export type ActionResult<T = object> =
  | ({ ok: true } & T)
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const safeRequestId = (id: unknown) => (typeof id === 'string' && UUID_RE.test(id) ? id : crypto.randomUUID());
