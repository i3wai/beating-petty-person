'use client';

import { useTranslations } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import RitualOrchestrator from '@/components/ritual/RitualOrchestrator';

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
        onClick={() => dispatch({ type: 'START_RITUAL' })}
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

/**
 * Client wrapper — must be rendered INSIDE RitualProvider.
 * Renders IdleScreen or RitualOrchestrator based on state.
 * Includes skip navigation link and semantic landmarks.
 */
export default function RitualPageClient() {
  const { state } = useRitual();
  const tCommon = useTranslations('common');

  return (
    <>
      {/* Skip navigation link */}
      <a href="#ritual-main-content" className="skip-nav font-serif">
        {tCommon('skipToRitual')}
      </a>

      <div className="min-h-[100dvh]" role="main" aria-label="Ritual">
        {state === 'idle' && <IdleScreen />}
        {state !== 'idle' && (
          <section aria-label="Ritual progress">
            <RitualOrchestrator />
          </section>
        )}
      </div>
    </>
  );
}
