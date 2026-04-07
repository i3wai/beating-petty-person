'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import { ParticleSystem } from '@/components/canvas/ParticleSystem';
import { ParticleType } from '@/components/canvas/particles';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAudio, SOUND_IDS } from '@/components/audio/useAudio';
import { SILHOUETTE_CLIPS, DEFAULT_CLIP, type EnemyCategory } from '@/components/ritual/silhouettes';

const BURN_DURATION_MS = 9000;
const FLAME_INTERVAL_MS = 120;
const SMOKE_INTERVAL_MS = 250;
const FLAME_COUNT = 3;
const SMOKE_COUNT = 2;

export default function BurningStep() {
  const t = useTranslations('ritual');
  const { dispatch, enemy } = useRitual();
  const reducedMotion = useReducedMotion();
  const audio = useAudio();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const psRef = useRef<ParticleSystem | null>(null);
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);
  const flameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const smokeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = useRef(0);
  const startTimeRef = useRef(0);

  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    psRef.current?.stop();
    dispatch({ type: 'BURNING_COMPLETE' });
  }, [dispatch]);

  useEffect(() => {
    if (reducedMotion) {
      audio.stopAmbient();

      const timer = setTimeout(() => {
        setProgress(1);
        handleComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Create ParticleSystem directly from canvas ref
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        const ps = new ParticleSystem(canvas);
        psRef.current = ps;
        ps.start();
      } catch {
        // Canvas context failed — skip particles, still run dissolution
      }
    }

    // Audio: switch to wind ambient
    audio.stopAmbient();
    audio.playAmbient(SOUND_IDS.AMBIENT_WIND);

    startTimeRef.current = performance.now();

    // Flame emission
    flameIntervalRef.current = setInterval(() => {
      const c = canvasRef.current;
      if (!c || !psRef.current) return;
      const rect = c.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const cx = rect.width / 2 + (Math.random() - 0.5) * 60;
      const cy = rect.height * 0.7;
      psRef.current.emit(ParticleType.FireFlame, cx, cy, FLAME_COUNT);
    }, FLAME_INTERVAL_MS);

    // Smoke emission
    smokeIntervalRef.current = setInterval(() => {
      const c = canvasRef.current;
      if (!c || !psRef.current) return;
      const rect = c.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const cx = rect.width / 2 + (Math.random() - 0.5) * 40;
      const cy = rect.height * 0.5;
      psRef.current.emit(ParticleType.Smoke, cx, cy, SMOKE_COUNT);
    }, SMOKE_INTERVAL_MS);

    // Dissolution rAF
    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const p = Math.min(elapsed / BURN_DURATION_MS, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        handleComplete();
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (flameIntervalRef.current) clearInterval(flameIntervalRef.current);
      if (smokeIntervalRef.current) clearInterval(smokeIntervalRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      psRef.current?.destroy();
      psRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dissolution via scale + opacity — preserves humanoid clip-path from CSS
  const paperScale = Math.max(0, 1 - progress * 0.6);
  const paperOpacity = Math.max(0, 1 - progress * 0.85);
  // Slight char color shift: paper-white → dark/ash
  const paperFilter = `brightness(${1 - progress * 0.7}) sepia(${progress * 0.5})`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] relative select-none">
      <h2 className="text-2xl sm:text-3xl font-bold text-vermillion font-serif mb-8 animate-fade-in">
        {t('step3Title')}
      </h2>

      <p className="text-paper-muted font-serif text-sm mb-6">
        {t('step3Subtitle')}
      </p>

      <div className="relative w-[320px] h-[400px] flex items-center justify-center pointer-events-none">
        {/* Canvas on top with explicit z-index */}
        {!reducedMotion && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-10"
            aria-hidden="true"
          />
        )}

        <div
          className="paper-figure burning-paper-figure relative z-0"
          style={{
            clipPath: SILHOUETTE_CLIPS[(enemy?.category as EnemyCategory) ?? 'custom'] ?? DEFAULT_CLIP,
            transform: `scale(${paperScale})`,
            opacity: paperOpacity,
            filter: paperFilter,
            transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
          }}
          aria-hidden="true"
        />
      </div>

      <p className="mt-4 text-sm text-paper-muted font-serif">
        {progress < 1 ? t('step3Burning') : t('step3Complete')}
      </p>
    </div>
  );
}
