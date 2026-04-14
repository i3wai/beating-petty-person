'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import type { PlanType } from '@/lib/stripe';
import { generateReading, resolveTarget } from '@/lib/curseReading';
import type { EnemyCategory } from '@/components/ritual/silhouettes';

const LS_KEY_ENEMY = 'beatpetty_enemy';

/**
 * ResultStep — shows free result + paid upsell options.
 * Paid buttons redirect to Stripe Checkout.
 */
export default function ResultStep() {
  const t = useTranslations('ritual');
  const tResult = useTranslations('result');
  const locale = useLocale();
  const { dispatch, enemy } = useRitual();
  const [loading, setLoading] = useState<PlanType | null>(null);
  const [error, setError] = useState(false);
  const [previewReading, setPreviewReading] = useState<string | null>(null);
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [showThird, setShowThird] = useState(false);

  // Stable seed for reading generation (prevents preview/checkout mismatch)
  const readingSeedRef = useRef(String(Date.now()));

  // Reading ceremony state
  const [readingReady, setReadingReady] = useState(false);

  // Generate reading on mount for blur preview
  useEffect(() => {
    try {
      const category = (enemy?.category ?? 'custom') as EnemyCategory;
      const fragments = {
        openings: t.raw(`reading.${category}.openings`),
        impacts: t.raw(`reading.${category}.impacts`),
        timings: t.raw(`reading.${category}.timings`),
        weaknesses: t.raw(`reading.${category}.weaknesses`),
        closings: t.raw(`reading.${category}.closings`),
      };
      const target = resolveTarget(category, enemy?.name, t(`enemies.${category}.name`));
      const reading = generateReading(fragments, target, readingSeedRef.current);
      setPreviewReading(reading);
    } catch {
      // fail silently
    }
  }, [enemy, t]);

  // Staggered CTA reveal
  useEffect(() => {
    const t1 = setTimeout(() => setShowFirst(true), 500);
    const t2 = setTimeout(() => setShowSecond(true), 2000);
    const t3 = setTimeout(() => setShowThird(true), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Reading ceremony — reveal blur preview after 2.5s "reading" animation
  useEffect(() => {
    const timer = setTimeout(() => setReadingReady(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleStartOver = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  const handleCheckout = useCallback(
    async (plan: PlanType) => {
      setLoading(plan);
      setError(false);

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

      // Generate and store curse reading before redirect (for result page)
      if (plan === 'name' || plan === 'full') {
        try {
          const category = (enemy?.category ?? 'custom') as EnemyCategory;
          const fragments = {
            openings: t.raw(`reading.${category}.openings`),
            impacts: t.raw(`reading.${category}.impacts`),
            timings: t.raw(`reading.${category}.timings`),
            weaknesses: t.raw(`reading.${category}.weaknesses`),
            closings: t.raw(`reading.${category}.closings`),
          };
          const target = resolveTarget(
            category,
            enemy?.name,
            t(`enemies.${category}.name`),
          );
          const reading = generateReading(fragments, target, readingSeedRef.current);
          localStorage.setItem('beatpetty_reading', reading);
        } catch {
          // reading generation failed — non-critical
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
      } catch {
        setError(true);
        setLoading(null);
      }
    },
    [enemy, locale, t],
  );

  return (
    <div className="flex flex-col items-center min-h-[80dvh] px-4 py-12 sm:py-16 max-w-lg mx-auto">
      {/* Atmospheric background glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--color-vermillion-dark)_0%,_transparent_50%)] opacity-5" aria-hidden="true" />

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
        <div className="mt-6 px-4 py-2 bg-ink-light border border-ink-lighter rounded-lg animate-fade-in-up">
          <span className="text-sm text-gold font-serif">
            {enemy.name}
          </span>
        </div>
      )}

      {/* Curse Reading prompt */}
      <div className="mt-10 animate-fade-in-up w-full flex flex-col items-center">
        {error && (
          <p className="text-sm text-vermillion font-serif text-center mb-4">
            {t('resultCheckoutError')}
          </p>
        )}

        {/* Blurred reading preview — shows actual content behind blur */}
        {!readingReady && previewReading && (
          <div className="mb-8 px-4 py-6 bg-ink-light border border-ink-lighter rounded-lg text-center animate-fade-in-up">
            <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gold/70 font-serif italic">
              {t('readingLoading')}
            </p>
          </div>
        )}
        {readingReady && previewReading && (
          <div className="mb-8 px-4 py-4 bg-ink-light border border-ink-lighter rounded-lg relative overflow-hidden">
            <p className="text-xs text-gold/60 font-serif mb-2 text-center">
              {t('reading.title')}
            </p>
            {previewReading.split('\n\n').map((paragraph, i) => (
              <p
                key={i}
                className={`text-sm text-paper-muted font-serif italic leading-relaxed mb-2 select-none ${
                  i === 0 ? '' : 'blur-[8px]'
                }`}
              >
                {paragraph}
              </p>
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gold font-serif text-sm">
                {t('readingPreviewBlur')}
              </span>
            </div>
          </div>
        )}

        <p className="text-sm sm:text-base text-gold font-serif text-center mb-6">
          {t('resultPaidPrompt')}
        </p>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          {/* Reveal the Curse Reading — $2.99 */}
          {showFirst && (
            <button
              onClick={() => handleCheckout('name')}
              disabled={loading !== null}
              className="
                w-full px-6 py-3 rounded-lg animate-fade-in-up
                bg-gold text-ink font-serif font-semibold text-base
                hover:bg-gold-light active:bg-gold-dark
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
              "
              aria-label={t('resultNameButton')}
            >
              {loading === 'name' ? '...' : t('resultNameButton')}
            </button>
          )}

          {/* Complete the Sealing — $4.99 */}
          {showSecond && (
            <button
              onClick={() => handleCheckout('seal')}
              disabled={loading !== null}
              className="
                w-full px-6 py-3 rounded-lg animate-fade-in-up
                bg-vermillion text-paper font-serif font-semibold text-base
                hover:bg-vermillion-light active:bg-vermillion-dark
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermillion
              "
              aria-label={t('resultSealButton')}
            >
              {loading === 'seal' ? '...' : t('resultSealButton')}
            </button>
          )}

          {/* Full Power Ritual — $6.99 */}
          {showThird && (
            <button
              onClick={() => handleCheckout('full')}
              disabled={loading !== null}
              className="
                w-full px-6 py-3 rounded-lg animate-fade-in-up
                bg-ink-light border border-vermillion/40 text-vermillion
                font-serif font-semibold text-base
                hover:border-vermillion hover:bg-ink-lighter
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermillion
                relative
              "
              aria-label={t('resultFullButton')}
            >
              <span className="absolute -top-2.5 right-3 px-2 py-0.5 text-xs font-bold bg-gold text-ink rounded-sm font-serif">
                {t('resultBestValue')}
              </span>
              {loading === 'full' ? '...' : t('resultFullButton')}
            </button>
          )}
        </div>
      </div>

      {/* Stripe trust badge */}
      <div className="mt-4 flex flex-col items-center gap-1 animate-fade-in-up">
        <div className="flex items-center gap-1.5 text-paper-muted/50">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-7.076-2.268l-.917 5.576C5.018 23.025 7.734 24 11.386 24c2.65 0 4.795-.637 6.335-1.844 1.655-1.284 2.537-3.187 2.537-5.735 0-4.128-2.524-5.853-6.682-7.271H13.976z" fill="currentColor"/>
          </svg>
          <span className="text-xs font-serif">Secure payment by Stripe</span>
        </div>
      </div>

      {/* Share + Start Over */}
      <div className="mt-8 flex flex-col items-center gap-4 animate-fade-in-up">
        <button
          onClick={async () => {
            try {
              if (navigator.share) {
                await navigator.share({
                  title: tResult('shareTitle'),
                  text: tResult('shareText'),
                  url: `https://beatpetty.com/${locale}`,
                });
              } else {
                await navigator.clipboard.writeText(`https://beatpetty.com/${locale}`);
              }
            } catch {
              // user cancelled or clipboard unavailable
            }
          }}
          className="
            px-8 py-2.5 rounded-lg
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
