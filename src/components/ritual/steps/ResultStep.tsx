'use client';

import { useCallback, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import type { PlanType } from '@/lib/stripe';

const LS_KEY_ENEMY = 'beatpetty_enemy';

/**
 * ResultStep — shows free result + paid upsell options.
 * Paid buttons redirect to Stripe Checkout.
 */
export default function ResultStep() {
  const t = useTranslations('ritual');
  const locale = useLocale();
  const { dispatch, enemy } = useRitual();
  const [loading, setLoading] = useState<PlanType | null>(null);

  const handleStartOver = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  const handleCheckout = useCallback(
    async (plan: PlanType) => {
      setLoading(plan);

      // Save enemy info to localStorage before leaving
      if (enemy) {
        try {
          localStorage.setItem(
            LS_KEY_ENEMY,
            JSON.stringify({ category: enemy.category, name: enemy.name ?? '' }),
          );
        } catch {
          // localStorage unavailable — metadata still passed via Stripe
        }
      }

      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan,
            enemyCategory: enemy?.category,
            enemyName: enemy?.name,
            locale,
          }),
        });

        if (!res.ok) {
          throw new Error('Checkout failed');
        }

        const { url } = await res.json();
        if (url) {
          window.location.href = url;
        }
      } catch (error) {
        console.error('Checkout error:', error);
        setLoading(null);
      }
    },
    [enemy, locale],
  );

  return (
    <div className="flex flex-col items-center min-h-[80dvh] px-4 py-12 sm:py-16 max-w-lg mx-auto">
      {/* Result title */}
      <h2
        className="
          text-2xl sm:text-3xl font-bold text-vermillion font-serif
          text-center animate-fade-in
        "
      >
        {t('step4Title')}
      </h2>

      {/* Free result block */}
      <div className="mt-8 space-y-4 text-center animate-fade-in-up">
        <h3 className="text-lg sm:text-xl font-semibold text-paper font-serif">
          {t('resultFreeTitle')}
        </h3>
        <p className="text-base sm:text-lg text-vermillion-light font-serif">
          {t('resultFreeSubtitle')}
        </p>
        <p className="text-sm sm:text-base text-paper-muted font-serif leading-relaxed max-w-md">
          {t('resultFreeDescription')}
        </p>
      </div>

      {/* Enemy info */}
      {enemy?.name && (
        <div className="mt-6 px-4 py-2 bg-ink-light border border-ink-lighter rounded-sm animate-fade-in-up">
          <span className="text-sm text-gold font-serif">
            {enemy.name}
          </span>
        </div>
      )}

      {/* Paid upsell prompt */}
      <div className="mt-10 animate-fade-in-up">
        <p className="text-sm sm:text-base text-gold font-serif text-center mb-6">
          {t('resultPaidPrompt')}
        </p>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          {/* Full Power Ritual — $4.99 */}
          <button
            onClick={() => handleCheckout('full')}
            disabled={loading !== null}
            className="
              w-full px-6 py-3 rounded-sm
              bg-vermillion text-paper font-serif font-semibold text-base
              hover:bg-vermillion-light active:bg-vermillion-dark
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermillion
            "
            aria-label={t('resultFullButton')}
          >
            {loading === 'full' ? '...' : t('resultFullButton')}
          </button>

          {/* Complete the Sealing — $4.99 */}
          <button
            onClick={() => handleCheckout('seal')}
            disabled={loading !== null}
            className="
              w-full px-6 py-3 rounded-sm
              bg-gold text-ink font-serif font-semibold text-base
              hover:bg-gold-light active:bg-gold-dark
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
            "
            aria-label={t('resultSealButton')}
          >
            {loading === 'seal' ? '...' : t('resultSealButton')}
          </button>

          {/* Name Your Enemy — $2.99 */}
          <button
            onClick={() => handleCheckout('name')}
            disabled={loading !== null}
            className="
              w-full px-6 py-3 rounded-sm
              bg-ink-light border border-gold/40 text-gold
              font-serif font-semibold text-base
              hover:border-gold hover:bg-ink-lighter
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
            "
            aria-label={t('resultNameButton')}
          >
            {loading === 'name' ? '...' : t('resultNameButton')}
          </button>
        </div>
      </div>

      {/* Share + Start Over */}
      <div className="mt-8 flex flex-col items-center gap-4 animate-fade-in-up">
        <button
          onClick={async () => {
            try {
              if (navigator.share) {
                await navigator.share({
                  title: 'BeatPetty — Ancient Chinese Curse Ritual',
                  text: 'Strike. Burn. Seal. What if it works?',
                  url: 'https://beatpetty.com',
                });
              } else {
                await navigator.clipboard.writeText('https://beatpetty.com');
              }
            } catch {
              // user cancelled or clipboard unavailable
            }
          }}
          className="
            px-8 py-2.5 rounded-sm
            border border-ink-lighter text-paper-muted
            font-serif text-sm
            hover:border-paper-muted hover:text-paper
            transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper-muted
          "
          aria-label={t('resultShareButton')}
        >
          {t('resultShareButton')}
        </button>

        <button
          onClick={handleStartOver}
          className="
            text-sm text-paper-muted/60 font-serif underline underline-offset-4
            hover:text-paper-muted
            transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-muted
          "
          aria-label={t('startOver')}
        >
          {t('startOver')}
        </button>
      </div>
    </div>
  );
}
