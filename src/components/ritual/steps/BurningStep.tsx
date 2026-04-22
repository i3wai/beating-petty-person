'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import { ParticleSystem } from '@/components/canvas/ParticleSystem';
import { ParticleType } from '@/components/canvas/particles';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAudio, SOUND_IDS } from '@/components/audio/useAudio';
import { PAPER_FIGURE_PNG, DEFAULT_IMAGE_PNG, type EnemyCategory } from '@/components/ritual/silhouettes';

const BURN_DURATION_MS = 9000;
const FLAME_INTERVAL_MS = 200;
const IGNITE_DURATION_MS = 2000;
const IGNITE_BURST_COUNT = 3;

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
  const burnRafRef = useRef(0);
  const startTimeRef = useRef(0);

  // Long-press ignition state
  const [ignited, setIgnited] = useState(false);
  const [pressing, setPressing] = useState(false);
  const igniteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStartTimeRef = useRef(0);
  const rumbleActiveRef = useRef(false);

  // Stable audio refs — useAudio() returns a new object every render,
  // so we store the methods in refs to avoid cascading re-creations.
  const audioPlayAmbientRef = useRef(audio.playAmbient);
  const audioStopAmbientRef = useRef(audio.stopAmbient);
  const audioPlayActionRef = useRef(audio.playAction);
  audioPlayAmbientRef.current = audio.playAmbient;
  audioStopAmbientRef.current = audio.stopAmbient;
  audioPlayActionRef.current = audio.playAction;

  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    psRef.current?.stop();
    dispatch({ type: 'BURNING_COMPLETE' });
  }, [dispatch]);

  // --- Burn animation (starts after ignition) ---
  useEffect(() => {
    if (!ignited) return;

    if (reducedMotion) {
      try { audioStopAmbientRef.current(); } catch { /* no ambient playing */ }
      const timer = setTimeout(() => {
        setProgress(1);
        handleComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }

    // 1. Start progress animation FIRST — the core visual
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const p = Math.min(elapsed / BURN_DURATION_MS, 1);
      setProgress(p);
      if (p < 1) {
        burnRafRef.current = requestAnimationFrame(tick);
      } else {
        handleComplete();
      }
    };
    burnRafRef.current = requestAnimationFrame(tick);

    // 2. ParticleSystem (non-critical)
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        const ps = new ParticleSystem(canvas);
        psRef.current = ps;
        ps.start();

        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          ps.emit(ParticleType.FireFlame, rect.width / 2, rect.height * 0.65, IGNITE_BURST_COUNT);
        }
      } catch {
        // Canvas context failed — skip particles
      }
    }

    // 3. Audio (non-critical)
    try { audioStopAmbientRef.current(); } catch { /* no ambient playing */ }
    try { audioPlayAmbientRef.current(SOUND_IDS.AMBIENT_WIND); } catch { /* audio not ready */ }

    // 4. Particle intervals (non-critical)
    flameIntervalRef.current = setInterval(() => {
      const c = canvasRef.current;
      if (!c || !psRef.current) return;
      const rect = c.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const cx = rect.width / 2 + (Math.random() - 0.5) * 60;
      const cy = rect.height * 0.7;
      psRef.current.emit(ParticleType.FireFlame, cx, cy, 1);
    }, FLAME_INTERVAL_MS);

    return () => {
      if (flameIntervalRef.current) clearInterval(flameIntervalRef.current);
      if (burnRafRef.current) cancelAnimationFrame(burnRafRef.current);
      try { audioStopAmbientRef.current(); } catch { /* ignore */ }
      psRef.current?.destroy();
      psRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ignited]);

  // --- Rumble audio for long-press ---
  const startRumble = useCallback(() => {
    rumbleActiveRef.current = true;
    try { audioPlayAmbientRef.current(SOUND_IDS.AMBIENT_DRONE); } catch { /* ignore */ }
  }, []);

  const stopRumble = useCallback(() => {
    if (rumbleActiveRef.current) {
      rumbleActiveRef.current = false;
      try { audioStopAmbientRef.current(); } catch { /* ignore */ }
    }
  }, []);

  // --- Long-press handlers ---
  const handlePressStart = useCallback(() => {
    if (ignited) return;
    pressStartTimeRef.current = performance.now();
    setPressing(true);
    startRumble();

    // Auto-ignite after IGNITE_DURATION_MS
    igniteTimeoutRef.current = setTimeout(() => {
      setIgnited(true);
      setPressing(false);
      stopRumble();
      try { audioPlayActionRef.current(SOUND_IDS.ACTION_PAPER); } catch { /* ignore */ }
    }, IGNITE_DURATION_MS);
  }, [ignited, startRumble, stopRumble]);

  const handlePressEnd = useCallback(() => {
    if (ignited) return;
    const elapsed = performance.now() - pressStartTimeRef.current;
    setPressing(false);

    // Clear the auto-ignite timeout
    if (igniteTimeoutRef.current) {
      clearTimeout(igniteTimeoutRef.current);
      igniteTimeoutRef.current = null;
    }
    stopRumble();

    // Fallback: ignite on release if held long enough
    if (elapsed >= IGNITE_DURATION_MS * 0.9) {
      setIgnited(true);
      try { audioPlayActionRef.current(SOUND_IDS.ACTION_PAPER); } catch { /* ignore */ }
    }
  }, [ignited, stopRumble]);

  // Cleanup on unmount ONLY (empty deps — stopRumble uses refs internally)
  useEffect(() => {
    return () => {
      if (igniteTimeoutRef.current) clearTimeout(igniteTimeoutRef.current);
      stopRumble();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dissolution via scale + opacity — preserves humanoid clip-path from CSS
  const paperScale = Math.max(0, 1 - progress * 0.6);
  const paperOpacity = Math.max(0, 1 - progress * 0.85);
  const paperFilter = ignited
    ? `brightness(${1 - progress * 0.7}) sepia(${progress * 0.5})`
    : 'brightness(0.7) sepia(0.2)';

  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] relative select-none">
      <h2 className="text-2xl sm:text-3xl font-bold text-vermillion font-serif mb-8 animate-fade-in">
        {t('step3Title')}
      </h2>

      <p className="text-paper-muted font-serif text-sm mb-6">
        {t('step3Subtitle')}
      </p>

      <div className="relative w-[min(320px,90vw)] h-[min(400px,75dvh)] flex items-center justify-center pointer-events-none">
        {/* Background — AI-generated scene with white tiger & ground */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/white-tiger-ground.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
          style={{ pointerEvents: 'none', userSelect: 'none', opacity: 0.75 }}
          aria-hidden="true"
        />

        {/* Smoke wisps — CSS-animated, staggered timing */}
        <div
          className="smoke-wisp absolute"
          aria-hidden="true"
          style={{ '--smoke-duration': '8s', '--smoke-drift-duration': '6s', width: 80, height: 50, left: '5%', bottom: 10 } as React.CSSProperties}
        />
        <div
          className="smoke-wisp absolute"
          aria-hidden="true"
          style={{ '--smoke-duration': '10s', '--smoke-drift-duration': '7s', width: 120, height: 60, left: '30%', bottom: 5 } as React.CSSProperties}
        />
        <div
          className="smoke-wisp absolute"
          aria-hidden="true"
          style={{ '--smoke-duration': '12s', '--smoke-drift-duration': '8s', width: 100, height: 70, left: '55%', bottom: 15 } as React.CSSProperties}
        />
        <div
          className="smoke-wisp absolute"
          aria-hidden="true"
          style={{ '--smoke-duration': '15s', '--smoke-drift-duration': '10s', width: 60, height: 40, left: '80%', bottom: 0 } as React.CSSProperties}
        />

        {/* Canvas — particles drawn after ignition (embers only) */}
        {!reducedMotion && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-10"
            aria-hidden="true"
          />
        )}

        {/* CSS fire effect — visible after ignition, tracks paper figure */}
        {ignited && !reducedMotion && (
          <div
            className="fire-container"
            aria-hidden="true"
            style={{
              transform: `translate(-50%, -50%) scale(${ignited ? paperScale : 1})`,
              opacity: ignited ? paperOpacity : 1,
              transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
            }}
          >
            <div className="flame-glow" />
            <div className="flame flame-outer-1" />
            <div className="flame flame-outer-2" />
            <div className="flame flame-left" />
            <div className="flame flame-right" />
            <div className="flame flame-core" />
          </div>
        )}

        <div
          className="burning-paper-figure relative z-0 flex items-center justify-center"
          style={{
            width: 120,
            height: 180,
            ...(ignited ? {
              animation: 'paper-curl-burn 9s ease-in forwards',
            } : {}),
            filter: paperFilter,
            transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
          }}
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PAPER_FIGURE_PNG[(enemy?.category as EnemyCategory) ?? 'custom'] ?? DEFAULT_IMAGE_PNG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          />
          {enemy?.name && (
            <span
              className="relative z-10 text-paper font-serif text-sm font-semibold text-center leading-tight px-2 select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              style={{
                maxWidth: '80%',
                wordBreak: 'break-word',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              }}
            >
              {enemy.name}
            </span>
          )}
        </div>
      </div>

      {/* "Hold to Ignite" visual hint — disappears once ignition starts */}
      {!ignited && !pressing && (
        <p className="ignite-hint text-sm text-gold/70 font-serif text-center mt-4 select-none">
          {t('step3IgniteHint')}
        </p>
      )}

      {/* Ignite button — shown immediately (white tiger is always in background) */}
      {!ignited && (
        <div className="mt-4 flex flex-col items-center">
          <button
            className="relative w-[120px] h-[120px] rounded-full flex items-center justify-center cursor-pointer select-none"
            style={{ touchAction: 'none', WebkitTouchCallout: 'none' }}
            onPointerDown={(e) => {
              e.preventDefault();
              try { (e.target as HTMLButtonElement).setPointerCapture(e.pointerId); } catch { /* ignore */ }
              handlePressStart();
            }}
            onPointerUp={(e) => {
              try { (e.target as HTMLButtonElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ }
              handlePressEnd();
            }}
            onPointerCancel={handlePressEnd}
            onContextMenu={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePressStart();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handlePressEnd();
              }
            }}
            aria-label={t('step3Ignite')}
          >
            {/* SVG progress ring — animated via CSS when pressing */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 120 120"
            >
              {/* Background ring */}
              <circle
                cx="60" cy="60" r="56"
                fill="none"
                stroke="rgba(212, 168, 67, 0.15)"
                strokeWidth="4"
              />
              {/* Progress ring — CSS animation fills it over 2s */}
              <circle
                cx="60" cy="60" r="56"
                fill="none"
                stroke="var(--color-vermillion)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={351.86}
                strokeDashoffset={pressing ? 0 : 351.86}
                style={{
                  transition: pressing
                    ? `stroke-dashoffset ${IGNITE_DURATION_MS}ms linear`
                    : 'stroke-dashoffset 0.3s ease-out',
                }}
              />
            </svg>

            {/* Glow effect when pressing */}
            {pressing && (
              <div
                className="absolute inset-[-8px] rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(194, 54, 22, 0.3) 0%, transparent 70%)',
                }}
              />
            )}

            {/* Button inner circle */}
            <div
              className="relative z-10 w-[100px] h-[100px] rounded-full flex items-center justify-center"
              style={{
                background: pressing
                  ? 'linear-gradient(135deg, var(--color-vermillion), var(--color-vermillion-dark))'
                  : 'linear-gradient(135deg, var(--color-vermillion-dark), var(--color-ink-light))',
                boxShadow: pressing
                  ? '0 0 30px 8px rgba(194, 54, 22, 0.4), 0 0 60px 16px rgba(255, 107, 53, 0.2)'
                  : '0 0 12px 2px rgba(194, 54, 22, 0.15)',
                transform: pressing ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.15s, background 0.2s, box-shadow 0.3s',
              }}
            >
              <span className="text-paper font-serif text-sm font-bold text-center leading-tight px-3">
                {pressing ? t('step3Igniting') : t('step3Ignite')}
              </span>
            </div>
          </button>
        </div>
      )}

      <p className="mt-4 text-sm text-paper-muted font-serif">
        {ignited
          ? (progress < 1 ? t('step3Burning') : t('step3Complete'))
          : ''}
      </p>
    </div>
  );
}
