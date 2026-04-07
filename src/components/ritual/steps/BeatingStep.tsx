'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import { useCanvas } from '@/components/canvas/useCanvas';
import { ParticleType } from '@/components/canvas/particles';
import { useHaptic } from '@/hooks/useHaptic';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAudio, SOUND_IDS } from '@/components/audio/useAudio';
import { SILHOUETTE_CLIPS, DEFAULT_CLIP, type EnemyCategory } from '@/components/ritual/silhouettes';

/** How many milliseconds between accepted taps */
const TAP_DEBOUNCE_MS = 100;
/** Default timer duration in seconds */
const TIMER_DURATION_S = 30;
/** Min / max HitSpark particles per burst */
const SPARK_MIN = 8;
const SPARK_MAX = 12;

/**
 * Step 2 of the ritual — beat the paper effigy.
 * Canvas 2D overlay with HitSpark particles on tap.
 */
export default function BeatingStep() {
  const t = useTranslations('ritual');
  const { dispatch, enemy } = useRitual();
  const { vibrate } = useHaptic();
  const reducedMotion = useReducedMotion();
  const audio = useAudio();

  // Canvas (skip when reduced motion)
  const { canvasRef, emit, start, stop } = useCanvas({
    autoStart: !reducedMotion,
  });

  // Tap state
  const [tapCount, setTapCount] = useState(0);
  const lastTapRef = useRef(0);

  // Timer state
  const [secondsLeft, setSecondsLeft] = useState(TIMER_DURATION_S);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Ref to hold latest secondsLeft so interval callback never goes stale
  const secondsLeftRef = useRef(TIMER_DURATION_S);

  // ---- Timer ----
  useEffect(() => {
    timerRef.current = setInterval(() => {
      secondsLeftRef.current -= 1;
      setSecondsLeft(secondsLeftRef.current);

      if (secondsLeftRef.current <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        handleComplete();
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Cleanup on unmount ----
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Double-dispatch guard
  const completedRef = useRef(false);

  // ---- Completion handler ----
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    stop();
    dispatch({ type: 'BEATING_COMPLETE' });
  }, [dispatch, stop]);

  // ---- Tap handler ----
  const handleTap = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      // Debounce
      const now = performance.now();
      if (now - lastTapRef.current < TAP_DEBOUNCE_MS) return;
      lastTapRef.current = now;

      // Determine coordinates relative to the interaction container
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      let clientX: number;
      let clientY: number;

      if ('touches' in e) {
        const touch = e.touches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Emit particles (unless reduced motion)
      if (!reducedMotion) {
        const count = SPARK_MIN + Math.floor(Math.random() * (SPARK_MAX - SPARK_MIN + 1));
        emit(ParticleType.HitSpark, x, y, count);
      }

      // Haptic feedback
      vibrate(50);

      // Sound
      audio.playAction(SOUND_IDS.ACTION_BEAT);

      // Update tap count
      setTapCount((prev) => prev + 1);
    },
    [reducedMotion, emit, vibrate, audio],
  );

  // ---- Paper figure visual degradation ----
  // As taps increase: slight rotation, scale down, reduce opacity
  const maxTaps = 60; // saturation point
  const progress = Math.min(tapCount / maxTaps, 1);
  const figureRotate = progress * 12 * (tapCount % 2 === 0 ? 1 : -1);
  const figureScale = 1 - progress * 0.25;
  const figureOpacity = 1 - progress * 0.5;

  // Reduced-motion: CSS scale pulse on tap
  const [pulseActive, setPulseActive] = useState(false);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTapReduced = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      handleTap(e);
      setPulseActive(true);
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
      pulseTimeoutRef.current = setTimeout(() => setPulseActive(false), 200);
    },
    [handleTap],
  );

  const tapHandler = reducedMotion ? handleTapReduced : handleTap;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] relative select-none">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-vermillion font-serif mb-6 animate-fade-in">
        {t('step2Title')}
      </h2>

      {/* Timer */}
      <div className="mb-6 text-lg font-serif text-paper-muted">
        <span
          className={`font-mono text-2xl tabular-nums ${
            secondsLeft <= 5 ? 'text-vermillion animate-pulse-glow' : 'text-gold'
          }`}
        >
          {secondsLeft}s
        </span>
      </div>

      {/* Interaction area */}
      <div
        className="relative w-[320px] h-[400px] flex items-center justify-center cursor-pointer"
        onClick={tapHandler}
        onTouchStart={tapHandler}
        role="button"
        tabIndex={0}
        aria-label={t('step2TapAria')}
      >
        {/* Canvas overlay — pointer-events-none so taps pass through */}
        {!reducedMotion && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Paper figure — clip-path matches selected enemy */}
        <div
          className={`
            relative
            ${reducedMotion && pulseActive ? 'paper-figure-pulse' : ''}
          `}
          style={{
            width: 120,
            height: 180,
            background: '#f5f0e8',
            clipPath: SILHOUETTE_CLIPS[(enemy?.category as EnemyCategory) ?? 'custom'] ?? DEFAULT_CLIP,
            boxShadow: '0 0 20px 4px rgba(245, 240, 232, 0.1)',
            transform: `rotate(${figureRotate}deg) scale(${figureScale})`,
            opacity: figureOpacity,
            transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Tap counter */}
      <p className="mt-4 text-sm text-paper-muted font-serif">
        {t('step2TapCount', { count: tapCount })}
      </p>

      {/* Enough button */}
      <button
        onClick={handleComplete}
        className="
          mt-6 px-8 py-3 rounded-sm
          bg-ink-light border border-ink-lighter
          text-paper-muted font-serif text-sm
          hover:border-vermillion hover:text-vermillion
          transition-colors duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermillion
        "
        aria-label={t('step2Enough')}
      >
        {t('step2Enough')}
      </button>
    </div>
  );
}
