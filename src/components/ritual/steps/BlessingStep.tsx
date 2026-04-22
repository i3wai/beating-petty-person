'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAudio, SOUND_IDS } from '@/components/audio/useAudio';

const DURATION_MS = 7500;
const TEXT_REVEAL_MS = 3000;
const ENEMY_REVEAL_MS = 5000;

// Pre-generated gold spark positions (avoids re-renders)
const SPARKS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: 10 + Math.random() * 80,
  delay: Math.random() * 4000,
  duration: 3000 + Math.random() * 2000,
  size: 2 + Math.random() * 3,
}));

export default function BlessingStep() {
  const t = useTranslations('ritual');
  const { dispatch, enemy } = useRitual();
  const reducedMotion = useReducedMotion();
  const audio = useAudio();
  const completedRef = useRef(false);
  const transitionPlayedRef = useRef(false);

  const [showText, setShowText] = useState(false);
  const [showEnemy, setShowEnemy] = useState(false);
  const [progress, setProgress] = useState(0);

  const enemyName = enemy?.name || (enemy?.category ? t(`enemies.${enemy.category}.name` as Parameters<typeof t>[0]) : '');

  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    dispatch({ type: 'BLESSING_COMPLETE' });
  }, [dispatch]);

  // Initialize audio and start ambient drone on mount
  useEffect(() => {
    audio.init().catch(() => {});
    audio.playAmbient(SOUND_IDS.AMBIENT_DRONE);
    return () => { audio.stopAmbient(); };
  }, [audio]);

  useEffect(() => {
    if (reducedMotion) {
      // Reduced motion: show static content for 4s then complete
      const timer = setTimeout(() => {
        handleComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }

    if (!transitionPlayedRef.current) {
      transitionPlayedRef.current = true;
      try { audio.playTransition(SOUND_IDS.TRANSITION_BLESSING); } catch { /* ignore */ }
    }

    // Progress animation
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / DURATION_MS, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Phase 2: reveal text at 3s
    const textTimer = setTimeout(() => setShowText(true), TEXT_REVEAL_MS);

    // Phase 3: reveal enemy name at 5s
    const enemyTimer = setTimeout(() => setShowEnemy(true), ENEMY_REVEAL_MS);

    // Complete at 7.5s
    const completeTimer = setTimeout(() => {
      handleComplete();
    }, DURATION_MS);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(enemyTimer);
      clearTimeout(completeTimer);
    };
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
      {/* AI background image with slow zoom */}
      <div className="fixed inset-0 overflow-hidden" aria-hidden="true">
        <img
          src="/images/blessing-gold.jpg"
          alt=""
          className="w-full h-full object-cover blessing-zoom"
        />
      </div>
      {/* Dark overlay — fades from 0.6 to 0.3 as blessing descends */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-[7000ms] ease-out"
        style={{ background: 'rgba(17, 17, 17, 0.45)', opacity: showEnemy ? 0.4 : 1 }}
        aria-hidden="true"
      />

      {/* Expanding gold radial glow */}
      <div
        className="fixed inset-0 pointer-events-none blessing-radial-glow-slow"
        style={{
          background: 'radial-gradient(circle at center, rgba(212, 168, 67, 0.15) 0%, rgba(212, 168, 67, 0.05) 30%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Rising gold sparks — fade out on completion */}
      <div className={`fixed inset-0 pointer-events-none overflow-hidden transition-opacity duration-500 ${completedRef.current ? 'opacity-0' : 'opacity-100'}`} aria-hidden="true">
        {SPARKS.map((spark) => (
          <div
            key={spark.id}
            className="blessing-spark"
            style={{
              left: `${spark.left}%`,
              bottom: '-10px',
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              animationDelay: `${spark.delay}ms`,
              animationDuration: `${spark.duration}ms`,
            }}
          />
        ))}
      </div>

      {/* Initial hint — visible immediately, fades out when text appears */}
      <p className={`relative z-10 text-xs text-gold/70 font-serif italic animate-pulse transition-opacity duration-1000 ${showText ? 'opacity-0' : 'opacity-100'}`}>
        {t('step7Receiving')}
      </p>

      {/* Title + subtitle — fades in at 3s */}
      <div className={`relative z-10 text-center transition-all duration-[2000ms] ease-out ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-2xl sm:text-3xl font-bold text-gold font-serif">
          {t('step7Title')}
        </h2>
        <p className="mt-4 text-sm sm:text-base text-gold/80 font-serif">
          {t('step7Subtitle')}
        </p>
      </div>

      {/* Enemy name seal — reveals at 5s */}
      {showEnemy && enemyName && (
        <div className="blessing-enemy-reveal relative z-10 mt-8 text-center">
          <p className="text-gold font-serif text-base sm:text-lg tracking-wide">
            {t('step7EnemySealed', { target: enemyName })}
          </p>
        </div>
      )}

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

      {/* Thin progress bar at bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-[3px] z-20" aria-hidden="true">
        <div
          className="h-full"
          style={{
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, rgba(212, 168, 67, 0.5), rgba(212, 168, 67, 1))',
            transition: 'width 0.1s linear',
          }}
        />
      </div>
    </div>
  );
}
