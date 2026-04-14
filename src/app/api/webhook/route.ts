import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const logData = {
      event: 'payment.completed',
      sessionId: session.id,
      plan: session.metadata?.plan ?? '',
      enemyCategory: session.metadata?.enemyCategory ?? '',
      enemyName: session.metadata?.enemyName ?? '',
      amount: session.amount_total ?? 0,
      currency: session.currency ?? '',
      email: session.customer_details?.email ?? '',
    };
    console.log(JSON.stringify(logData));
  }

  return NextResponse.json({ received: true });
}
