'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import { useAudio, SOUND_IDS } from '@/components/audio/useAudio';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import StepHeader from '@/components/ritual/StepHeader';
import CandleFlame from '@/components/CandleFlame';
import { PAPER_FIGURE_PNG, ENEMY_CATEGORIES } from '@/components/ritual/silhouettes';

/** Total invocation animation duration in ms */
const INVOCATION_DURATION_MS = 6000;

/**
 * InvocationTransition — 6-second darkening transition with candle flames.
 * This is the iOS AudioContext unlock point (requires user gesture to trigger).
 * Includes focus trap for accessibility.
 */
export default function InvocationTransition() {
  const t = useTranslations('ritual');
  const { dispatch } = useRitual();
  const audio = useAudio();
  const reducedMotion = useReducedMotion();
  const completedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const completeInvocation = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    dispatch({ type: 'INVOCATION_COMPLETE' });
  }, [dispatch]);

  // Focus trap: save previous focus, trap Tab within overlay, restore on unmount
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus the overlay itself
    if (overlayRef.current) {
      overlayRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !overlayRef.current) return;

      const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  // Preload transparent PNG paper figures during 6s animation
  useEffect(() => {
    for (const cat of ENEMY_CATEGORIES) {
      const img = new Image();
      img.src = PAPER_FIGURE_PNG[cat];
    }
  }, []);

  useEffect(() => {
    // Init audio (iOS AudioContext unlock) + play transition sound
    const initAudio = async () => {
      try {
        await audio.init();
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

    // Normal: complete after 6 seconds
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
    <div
      ref={overlayRef}
      className="invocation-overlay fixed inset-0 z-50 flex flex-col items-center justify-center"
      tabIndex={-1}
      aria-label={t('invocationTitle')}
    >
      {/* Darkening layer */}
      <div className="invocation-darken absolute inset-0 bg-shadow" />

      {/* Radial glow — center */}
      <div className="invocation-radial-glow absolute inset-0 pointer-events-none" />

      {/* Candles with visible candle body */}
      <div className="invocation-candles animate-fade-in relative z-10 mb-8">
        <CandleFlame />
      </div>

      {/* Step header */}
      <div className="relative z-10 animate-fade-in-up text-center px-6">
        <StepHeader labelKey="stepLabel1" purposeKey="stepPurpose1" />
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
