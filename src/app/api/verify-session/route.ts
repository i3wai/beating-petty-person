import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      return NextResponse.json({
        paid: true,
        plan: session.metadata?.plan || '',
        enemyCategory: session.metadata?.enemyCategory || 'custom',
        enemyName: session.metadata?.enemyName || '',
      });
    }

    return NextResponse.json({ paid: false });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ error: 'Failed to verify session' }, { status: 500 });
  }
}
