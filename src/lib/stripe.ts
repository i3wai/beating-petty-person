import Stripe from 'stripe';

export type PlanType = 'name' | 'seal' | 'full';

const PLAN_CONFIG: Record<PlanType, { priceId: string; amount: number; name: string }> = {
  name: {
    priceId: process.env.STRIPE_PRICE_ID_NAME ?? '',
    amount: 299,
    name: 'Curse Reading',
  },
  seal: {
    priceId: process.env.STRIPE_PRICE_ID_SEAL ?? '',
    amount: 499,
    name: 'Complete the Sealing Ritual',
  },
  full: {
    priceId: process.env.STRIPE_PRICE_ID_FULL ?? '',
    amount: 699,
    name: 'Full Power Ritual',
  },
};

export function getPlanConfig(plan: PlanType) {
  return PLAN_CONFIG[plan];
}

const secretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = secretKey
  ? new Stripe(secretKey)
  : null;
