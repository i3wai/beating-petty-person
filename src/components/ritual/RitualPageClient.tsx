'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { RitualProvider, useRitual, type EnemyData, type PaymentTier } from '@/components/ritual/RitualProvider';
import RitualOrchestrator from '@/components/ritual/RitualOrchestrator';
import { getAudioManager } from '@/components/audio/AudioManager';

interface ContinueState {
  ritualState: 'purification';
  enemy: EnemyData;
  paymentTier: PaymentTier;
}

function getContinueState(): ContinueState | undefined {
  try {
    const enemyRaw = localStorage.getItem('beatpetty_enemy');
    const paidRaw = localStorage.getItem('beatpetty_paid');

    if (!enemyRaw) return undefined;

    const enemy = JSON.parse(enemyRaw);
    const paid = paidRaw ? JSON.parse(paidRaw) : null;

    const tier: PaymentTier = paid?.plan === 'full' ? 'full' : 'completion';

    return {
      ritualState: 'purification',
      enemy: { category: enemy.category || 'custom', name: enemy.name || undefined },
      paymentTier: tier,
    };
  } catch {
    return undefined;
  }
}

/** Idle state — "Begin the Ritual" entry point */
function IdleScreen() {
  const t = useTranslations('ritual');
  const tCommon = useTranslations('common');
  const { dispatch } = useRitual();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] px-4">
      {/* Atmospheric candle dot */}
      <div className="mb-8" aria-hidden="true">
        <div className="w-4 h-4 rounded-full bg-gold opacity-80 animate-shimmer" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-vermillion font-serif mb-6 animate-fade-in-up text-center">
        {t('invocationTitle')}
      </h1>

      <p className="text-paper-muted font-serif text-base sm:text-lg mb-10 text-center max-w-md animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {t('invocationSubtitle')}
      </p>

      <button
        id="ritual-main-content"
        onClick={() => {
          // Init AudioContext synchronously in click handler for iOS Safari
          getAudioManager().init().catch(() => {});
          dispatch({ type: 'START_RITUAL' });
        }}
        className="
          px-10 py-4 rounded-sm
          bg-gold text-ink font-serif font-semibold text-lg
          hover:bg-gold-light transition-colors
          animate-pulse-glow
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
        "
      >
        {t('beginButton')}
      </button>
    </div>
  );
}

function RitualIdleOrContinue() {
  const { state } = useRitual();

  return (
    <>
      {state === 'idle' && <IdleScreen />}
      {state !== 'idle' && (
        <section aria-label="Ritual progress">
          <RitualOrchestrator />
        </section>
      )}
    </>
  );
}

/**
 * Client wrapper — reads ?continue=true, sets up RitualProvider with correct initial state.
 * RitualProvider is here (not in the server page) so we can pass initialState from localStorage.
 */
export default function RitualPageClient() {
  const searchParams = useSearchParams();
  const isContinue = searchParams.get('continue') === 'true';
  const tCommon = useTranslations('common');

  const continueState = isContinue ? getContinueState() : undefined;

  useEffect(() => {
    const main = document.querySelector('main');
    if (main) {
      main.classList.remove('landing-fade-out');
      main.style.opacity = '1';
    }
  }, []);

  return (
    <RitualProvider initialState={continueState}>
      {/* Skip navigation link */}
      <a href="#ritual-main-content" className="skip-nav font-serif">
        {tCommon('skipToRitual')}
      </a>

      <div className="min-h-[100dvh]" role="main" aria-label="Ritual">
        {continueState ? (
          <section aria-label="Ritual progress">
            <RitualOrchestrator />
          </section>
        ) : (
          <RitualIdleOrContinue />
        )}
      </div>
    </RitualProvider>
  );
}
