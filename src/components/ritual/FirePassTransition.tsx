'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { PAPER_FIGURE_PNG, DEFAULT_IMAGE_PNG, type EnemyCategory } from '@/components/ritual/silhouettes';

const DURATION_MS = 3000;
const REDUCED_DURATION_MS = 200;

/**
 * FirePassTransition — passive 3s animation between enemy select and beating.
 * Paper figure passes over sacred flames for purification.
 * Auto-advances to beating step when complete.
 */
export default function FirePassTransition() {
  const t = useTranslations('ritual');
  const { dispatch, enemy } = useRitual();
  const reducedMotion = useReducedMotion();
  const completedRef = useRef(false);
  const [phase, setPhase] = useState<'enter' | 'pass' | 'glow'>('enter');

  const duration = reducedMotion ? REDUCED_DURATION_MS : DURATION_MS;

  useEffect(() => {
    if (reducedMotion) {
      const timer = setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          dispatch({ type: 'FIRE_PASS_COMPLETE' });
        }
      }, REDUCED_DURATION_MS);
      return () => clearTimeout(timer);
    }

    // Phase 1: Enter (0-800ms) — paper figure appears
    const enterTimer = setTimeout(() => setPhase('pass'), 800);
    // Phase 2: Pass (800-2200ms) — paper sweeps over flames
    const passTimer = setTimeout(() => setPhase('glow'), 2200);
    // Phase 3: Glow (2200-3000ms) — purification complete, advance
    const completeTimer = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        dispatch({ type: 'FIRE_PASS_COMPLETE' });
      }
    }, DURATION_MS);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(passTimer);
      clearTimeout(completeTimer);
    };
  }, [dispatch, reducedMotion]);

  if (reducedMotion) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label={t('firePassTitle')}
    >
      {/* AI-generated flames background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/fire-pass-flames.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        aria-hidden="true"
      />

      {/* Paper figure — sweeps left to right over flames */}
      <div
        className="relative z-10"
        style={{
          transform: phase === 'enter'
            ? 'translateX(-80px) scale(0.9)'
            : phase === 'pass'
              ? 'translateX(80px) scale(1)'
              : 'translateX(80px) scale(1)',
          opacity: phase === 'enter' ? 0 : phase === 'glow' ? 0.6 : 1,
          transition: phase === 'enter'
            ? 'none'
            : 'transform 1.4s ease-in-out, opacity 0.8s ease',
        }}
      >
        <div
          className="w-16 h-24 relative overflow-hidden flex items-center justify-center"
          style={{
            boxShadow: phase === 'pass'
              ? '0 0 20px 4px rgba(239, 96, 48, 0.4), 0 0 40px 8px rgba(239, 96, 48, 0.15)'
              : phase === 'glow'
                ? '0 0 30px 8px rgba(212, 168, 67, 0.5), 0 0 60px 12px rgba(212, 168, 67, 0.2)'
                : 'none',
            transition: 'box-shadow 0.6s ease',
          }}
        >
          {/* Paper figure image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PAPER_FIGURE_PNG[(enemy?.category as EnemyCategory) ?? 'custom'] ?? DEFAULT_IMAGE_PNG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          />
          {enemy?.name && (
            <span className="relative z-10 text-[10px] text-paper/90 font-serif text-center break-all px-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {enemy.name}
            </span>
          )}
        </div>
      </div>

      {/* Title — fades in during pass phase */}
      <h2
        className="absolute bottom-[15%] text-lg sm:text-xl font-bold text-gold font-serif text-center"
        style={{
          opacity: phase === 'pass' || phase === 'glow' ? 1 : 0,
          transform: phase === 'pass' || phase === 'glow' ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        {t('firePassTitle')}
      </h2>
    </div>
  );
}
