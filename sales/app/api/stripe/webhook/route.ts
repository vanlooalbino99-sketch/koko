import { handleWebhook } from '@/lib/billing/service';
import { billingProviderFromEnv, WebhookSignatureError } from '@/lib/billing/stripe';
import { getDb } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

// Webhook Stripe : la signature est vérifiée sur le corps brut avant toute lecture.
export async function POST(request: Request) {
  const provider = billingProviderFromEnv();
  if (!provider) return Response.json({ error: 'not_configured' }, { status: 503 });
  const signature = request.headers.get('stripe-signature');
  if (!signature) return Response.json({ error: 'missing_signature' }, { status: 400 });
  const body = await request.text();
  try {
    const result = await handleWebhook(await getDb(), provider, body, signature);
    return Response.json({ received: true, result });
  } catch (error) {
    if (error instanceof WebhookSignatureError) return Response.json({ error: 'invalid_signature' }, { status: 400 });
    console.error('[billing] webhook', error instanceof Error ? error.message : error);
    // 500 : Stripe renverra l'événement plus tard.
    return Response.json({ error: 'processing_failed' }, { status: 500 });
  }
}
