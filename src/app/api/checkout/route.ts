import { NextRequest, NextResponse } from 'next/server';
import { stripe, getPlanConfig, type PlanType } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { plan, enemyCategory, enemyName, locale } = body as {
      plan: PlanType;
      enemyCategory?: string;
      enemyName?: string;
      locale?: string;
    };

    if (!plan || !['name', 'seal', 'full'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const config = getPlanConfig(plan);

    if (!config.priceId) {
      return NextResponse.json({ error: 'Price not configured — missing STRIPE_PRICE_ID env var' }, { status: 503 });
    }

    const origin = req.headers.get('origin') || 'https://beatpetty.com';
    const validLocales = ['en', 'zh-TW', 'zh-Hans'];
    const lang = validLocales.includes(locale ?? '') ? locale! : 'en';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: config.priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/${lang}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${lang}/ritual`,
      metadata: {
        plan,
        enemyCategory: enemyCategory || 'custom',
        enemyName: enemyName || '',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
