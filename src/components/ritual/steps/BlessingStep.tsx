'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAudio, SOUND_IDS } from '@/components/audio/useAudio';

const DURATION_MS = 3000;

export default function BlessingStep() {
  const t = useTranslations('ritual');
  const { dispatch } = useRitual();
  const reducedMotion = useReducedMotion();
  const audio = useAudio();
  const completedRef = useRef(false);
  const transitionPlayedRef = useRef(false);

  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    dispatch({ type: 'BLESSING_COMPLETE' });
  }, [dispatch]);

  // Initialize audio on mount
  useEffect(() => {
    audio.init().catch(() => {});
  }, [audio]);

  useEffect(() => {
    if (reducedMotion) {
      const timer = setTimeout(() => {
        handleComplete();
      }, 200);
      return () => clearTimeout(timer);
    }

    // Play transition sound once
    if (!transitionPlayedRef.current) {
      transitionPlayedRef.current = true;
      try { audio.playTransition(SOUND_IDS.TRANSITION_BLESSING); } catch { /* ignore */ }
    }

    const timer = setTimeout(() => {
      handleComplete();
    }, DURATION_MS);
    return () => clearTimeout(timer);
  }, [reducedMotion, audio, handleComplete]);

  if (reducedMotion) {
    return (
      <div className="flex flex-col items-center min-h-[80dvh] px-4 py-12 sm:py-16 max-w-lg mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold font-serif text-center">
          {t('step7Title')}
        </h2>
        <p className="mt-4 text-sm sm:text-base text-paper-muted font-serif text-center">
          {t('step7Subtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-[80dvh] px-4 py-12 sm:py-16 max-w-lg mx-auto relative overflow-hidden bg-ink">
      {/* AI background image */}
      <img
        src="/images/blessing-gold.jpg"
        alt=""
        className="fixed inset-0 w-full h-full object-cover pointer-events-none blessing-bg-reveal"
        aria-hidden="true"
      />
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 pointer-events-none bg-ink/40" aria-hidden="true" />

      {/* Expanding gold radial glow on top of image */}
      <div
        className="fixed inset-0 pointer-events-none blessing-radial-glow"
        style={{
          background: 'radial-gradient(circle at center, rgba(212, 168, 67, 0.15) 0%, rgba(212, 168, 67, 0.05) 30%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <h2 className="text-2xl sm:text-3xl font-bold text-gold font-serif text-center animate-fade-in relative z-10">
        {t('step7Title')}
      </h2>
      <p className="mt-4 text-sm sm:text-base text-paper-muted font-serif text-center animate-fade-in-up relative z-10">
        {t('step7Subtitle')}
      </p>

      {/* Completion pulse flash */}
      {completedRef.current && (
        <div
          className="fixed inset-0 pointer-events-none blessing-pulse-flash"
          style={{
            background: 'radial-gradient(circle, rgba(212, 168, 67, 0.4) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
