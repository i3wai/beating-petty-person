'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import { useAudio, SOUND_IDS } from '@/components/audio/useAudio';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import CandleFlame from '@/components/CandleFlame';

/** Total invocation animation duration in ms */
const INVOCATION_DURATION_MS = 3000;

/**
 * InvocationTransition — 3-second darkening transition with candle flames.
 * This is the iOS AudioContext unlock point (requires user gesture to trigger).
 */
export default function InvocationTransition() {
  const t = useTranslations('ritual');
  const { dispatch } = useRitual();
  const audio = useAudio();
  const reducedMotion = useReducedMotion();
  const completedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const completeInvocation = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    dispatch({ type: 'INVOCATION_COMPLETE' });
  }, [dispatch]);

  useEffect(() => {
    // Init audio (iOS AudioContext unlock) + play ambient + transition sound
    const initAudio = async () => {
      try {
        await audio.init();
        audio.playAmbient(SOUND_IDS.AMBIENT_DRONE);
        audio.playTransition(SOUND_IDS.TRANSITION_INVOCATION);
      } catch {
        // Audio init may fail silently — ritual continues
      }
    };

    void initAudio();

    // Reduced motion: skip animation entirely, complete immediately
    if (reducedMotion) {
      completeInvocation();
      return;
    }

    // Normal: complete after 3 seconds
    timerRef.current = setTimeout(completeInvocation, INVOCATION_DURATION_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [audio, reducedMotion, completeInvocation]);

  // Reduced motion: render nothing (instant state change)
  if (reducedMotion) {
    return null;
  }

  return (
    <div className="invocation-overlay fixed inset-0 z-50 flex flex-col items-center justify-center">
      {/* Darkening layer */}
      <div className="invocation-darken absolute inset-0 bg-shadow" />

      {/* Radial glow — center */}
      <div className="invocation-radial-glow absolute inset-0 pointer-events-none" />

      {/* Candles */}
      <div className="invocation-candles animate-fade-in relative z-10 mb-8">
        <CandleFlame />
      </div>

      {/* Title */}
      <h2
        className="
          relative z-10 text-2xl sm:text-4xl font-bold text-paper font-serif
          animate-fade-in-up text-center px-6
        "
      >
        {t('invocationTitle')}
      </h2>
      <p
        className="
          relative z-10 text-sm sm:text-base text-paper-muted font-serif mt-3
          animate-fade-in-up text-center px-6
        "
      >
        {t('invocationSubtitle')}
      </p>
    </div>
  );
}
