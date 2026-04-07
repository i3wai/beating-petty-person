'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { PlanType } from '@/lib/stripe';

type TierKey = 'free' | 'name' | 'seal' | 'full';

const TIERS: { key: TierKey; plan?: PlanType; highlight?: boolean }[] = [
  { key: 'free' },
  { key: 'name', plan: 'name' },
  { key: 'seal', plan: 'seal' },
  { key: 'full', plan: 'full', highlight: true },
];

export default function PricingPage() {
  return <PricingContent />;
}

function PricingContent() {
  const t = useTranslations('pricing');
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<PlanType | null>(null);

  const handleSelect = useCallback(
    async (tier: TierKey, plan?: PlanType) => {
      if (tier === 'free') {
        router.push(`/${locale}/ritual`);
        return;
      }

      if (!plan) return;
      setLoading(plan);

      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, locale }),
        });

        if (!res.ok) throw new Error('Checkout failed');

        const { url } = await res.json();
        if (url) {
          window.location.href = url;
        }
      } catch (error) {
        console.error('Checkout error:', error);
        setLoading(null);
      }
    },
    [locale, router],
  );

  // Parse features arrays from i18n once (t.raw for arrays)
  const features: Record<TierKey, string[]> = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const { key } of TIERS) {
      const raw = t.raw(`${key}.features`);
      result[key] = Array.isArray(raw) ? raw : typeof raw === 'string' ? JSON.parse(raw) : [];
    }
    return result as Record<TierKey, string[]>;
  }, [t]);

  return (
    <div className="min-h-[80dvh] flex flex-col items-center px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-vermillion font-serif mb-4 animate-fade-in">
        {t('title')}
      </h1>
      <p className="text-paper-muted font-serif text-center mb-12 max-w-lg animate-fade-in">
        {t('subtitle')}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full">
        {TIERS.map(({ key, plan, highlight }) => (
          <div
            key={key}
            className={`
              relative flex flex-col rounded-sm p-6
              border transition-colors duration-200
              ${
                highlight
                  ? 'border-vermillion bg-ink-light'
                  : 'border-ink-lighter bg-ink'
              }
            `}
          >
            {highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-vermillion text-paper text-xs font-serif font-semibold rounded-sm">
                {t(`${key}.badge`)}
              </div>
            )}

            <h3 className="text-lg font-bold text-paper font-serif mb-1">
              {t(`${key}.name`)}
            </h3>
            <p className="text-2xl font-bold text-gold font-serif mb-3">
              {t(`${key}.price`)}
            </p>
            <p className="text-sm text-paper-muted font-serif mb-4 flex-1">
              {t(`${key}.description`)}
            </p>

            <ul className="space-y-2 mb-6">
              {features[key].map((feat, i) => (
                <li key={i} className="text-xs text-paper-muted font-serif flex items-start gap-2">
                  <span className="text-gold mt-0.5">✠</span>
                  {feat}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelect(key, plan)}
              disabled={loading !== null}
              className={`
                w-full px-4 py-2.5 rounded-sm font-serif font-semibold text-sm
                transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                focus-visible:outline-none focus-visible:ring-2
                ${
                  highlight
                    ? 'bg-vermillion text-paper hover:bg-vermillion-light focus-visible:ring-vermillion'
                    : key === 'free'
                      ? 'bg-ink-lighter text-paper hover:bg-ink-light focus-visible:ring-paper-muted'
                      : 'bg-gold text-ink hover:bg-gold-light focus-visible:ring-gold'
                }
              `}
            >
              {loading === plan ? '...' : t(`${key}.cta`)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
