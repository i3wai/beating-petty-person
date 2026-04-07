'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import { useAudio, SOUND_IDS } from '@/components/audio/useAudio';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Sealing animation duration in ms */
const SEALING_DURATION_MS = 3000;

/**
 * SealingTransition — 3-second stamp slam + rune flash animation.
 * Stops burning audio immediately on mount, plays sealing transition sound.
 */
export default function SealingTransition() {
  const t = useTranslations('ritual');
  const { dispatch } = useRitual();
  const audio = useAudio();
  const reducedMotion = useReducedMotion();
  const completedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const completeSealing = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    dispatch({ type: 'SEALING_COMPLETE' });
  }, [dispatch]);

  // Stable ref so useEffect doesn't re-run
  const completeRef = useRef(completeSealing);
  completeRef.current = completeSealing;

  useEffect(() => {
    // IMMEDIATELY stop burning ambient — no overlap
    audio.stopAmbient();
    // Play sealing transition sound
    audio.playTransition(SOUND_IDS.TRANSITION_SEALING);

    // Reduced motion: skip animation, complete immediately
    if (reducedMotion) {
      completeRef.current();
      return;
    }

    timerRef.current = setTimeout(() => completeRef.current(), SEALING_DURATION_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reduced motion: render nothing (instant state change)
  if (reducedMotion) {
    return null;
  }

  return (
    <div className="sealing-overlay fixed inset-0 z-50 flex flex-col items-center justify-center">
      {/* Background dark */}
      <div className="absolute inset-0 bg-shadow" />

      {/* Rune circle — flashes gold */}
      <div className="sealing-rune-circle absolute z-10" aria-hidden="true" />

      {/* Stamp element */}
      <div className="sealing-stamp relative z-20" aria-hidden="true">
        {/* Vermillion stamp block */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-vermillion rounded-sm flex items-center justify-center shadow-[0_0_30px_8px_rgba(194,54,22,0.5)]">
          <span className="text-paper text-3xl sm:text-5xl font-serif font-bold select-none">
            封
          </span>
        </div>
      </div>

      {/* Title */}
      <h2 className="relative z-20 mt-10 text-2xl sm:text-3xl font-bold text-gold font-serif animate-fade-in">
        {t('sealingTitle')}
      </h2>
      <p className="relative z-20 mt-2 text-sm sm:text-base text-paper-muted font-serif animate-fade-in">
        {t('sealingSubtitle')}
      </p>
    </div>
  );
}
