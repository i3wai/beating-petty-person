'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import StepHeader from '@/components/ritual/StepHeader';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useHaptic } from '@/hooks/useHaptic';
import { useAudio, SOUND_IDS } from '@/components/audio/useAudio';

const AUTO_COMPLETE_MS = 10000;
const MIN_TAPS_TO_COMPLETE = 7;
const HAPTIC_DURATION = 30;

// Particle colors — bright with strong glow for visibility against dark overlay
const PARTICLE_COLORS = [
  'rgba(255, 248, 235, 0.95)',  // bright rice white
  'rgba(255, 235, 200, 0.95)',  // warm rice gold
  'rgba(220, 180, 120, 0.95)',  // golden bean
  'rgba(200, 155, 90, 0.95)',   // amber bean
];

interface ParticleProps {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
  delay: number;
}

export default function PurificationStep() {
  const t = useTranslations('ritual');
  const { dispatch, enemy } = useRitual();
  const reducedMotion = useReducedMotion();
  const { vibrate } = useHaptic();
  const audio = useAudio();

  const completedRef = useRef(false);
  const [tapCount, setTapCount] = useState(0);
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const [sceneWarmth, setSceneWarmth] = useState(0); // 0 = cool gray, 1 = warm
  const [showEnemyCleanse, setShowEnemyCleanse] = useState(false);

  const enemyName = enemy?.name || (enemy?.category ? t(`enemies.${enemy.category}.name` as Parameters<typeof t>[0]) : '');
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    dispatch({ type: 'PURIFICATION_COMPLETE' });
  }, [dispatch]);

  // Initialize audio on mount
  useEffect(() => {
    audio.init().catch(() => {});
  }, [audio]);

  // Auto-complete timer — starts after first tap, not on mount
  useEffect(() => {
    if (completedRef.current) return;

    if (reducedMotion) {
      // Reduced motion: show static content for 4s then complete
      if (tapCount === 0) {
        const timer = setTimeout(() => handleComplete(), 4000);
        return () => clearTimeout(timer);
      }
      return;
    }

    if (tapCount === 0) return;

    const timer = setTimeout(() => {
      handleComplete();
    }, AUTO_COMPLETE_MS);
    return () => clearTimeout(timer);
  }, [tapCount, reducedMotion, handleComplete]);

  // Warm up the scene based on tap count
  useEffect(() => {
    if (reducedMotion) return;
    const warmth = Math.min(tapCount / MIN_TAPS_TO_COMPLETE, 1);
    setSceneWarmth(warmth);
  }, [tapCount, reducedMotion]);

  // Handle tap to scatter particles
  const handleScatter = useCallback(() => {
    if (completedRef.current || reducedMotion) return;

    vibrate(HAPTIC_DURATION);
    try { audio.playAction(SOUND_IDS.ACTION_SCATTER); } catch { /* ignore */ }

    const newCount = tapCount + 1;
    setTapCount(newCount);

    // Create 8-12 particles per tap
    const newParticles: ParticleProps[] = [];
    const particleCount = 8 + Math.floor(Math.random() * 5);

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const distance = 60 + Math.random() * 80;
      const delay = Math.random() * 100;

      newParticles.push({
        id: `${Date.now()}-${i}`,
        x: 50, // center %
        y: 50, // center %
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        size: 4 + Math.random() * 5,
        angle,
        distance,
        delay,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    // Auto-complete after enough taps
    if (newCount >= MIN_TAPS_TO_COMPLETE) {
      setTimeout(() => handleComplete(), 300);
    }
  }, [tapCount, completedRef, reducedMotion, vibrate, audio, handleComplete]);

  // Clean up old particles
  useEffect(() => {
    if (reducedMotion) return;

    const cleanup = setInterval(() => {
      setParticles((prev) => prev.filter((p) => Date.now() - parseInt(p.id) < 2000));
    }, 500);

    return () => clearInterval(cleanup);
  }, [reducedMotion]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] relative select-none bg-ink">
      {/* AI background image */}
      <img
        src="/images/purification-ground.jpg"
        alt=""
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.55 + sceneWarmth * 0.2, transition: 'opacity 1s ease-out' }}
        aria-hidden="true"
      />
      {/* Dark overlay for readability */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: `rgba(17, 17, 17, ${0.45 - sceneWarmth * 0.15})`, transition: 'background 1s ease-out' }}
        aria-hidden="true"
      />

      <StepHeader labelKey="stepLabel6" purposeKey="stepPurpose6" />
      <h2 className="text-2xl sm:text-3xl font-bold text-gold font-serif text-center animate-fade-in z-10">
        {t('step6Title')}
      </h2>
      <p className="mt-4 text-sm sm:text-base text-gold/80 font-serif text-center animate-fade-in-up z-10">
        {t('step6Instruction')}
      </p>

      {/* Central tap area */}
      <button
        onClick={handleScatter}
        disabled={completedRef.current || reducedMotion}
        className="mt-12 relative w-40 h-40 rounded-full flex items-center justify-center cursor-pointer select-none z-10 focus:outline-none focus:ring-2 focus:ring-gold/50"
        style={{
          background: reducedMotion ? 'transparent' : 'radial-gradient(circle, rgba(212, 168, 67, 0.1) 0%, transparent 70%)',
          transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out',
          boxShadow: reducedMotion ? 'none' : `0 0 ${30 + tapCount * 10}px rgba(212, 168, 67, ${0.1 + tapCount * 0.05})`,
        }}
        aria-label={t('step6Instruction')}
      >
        {/* Central rice pile visualization */}
        <div
          className="relative"
          style={{
            width: '60px',
            height: '60px',
            background: 'radial-gradient(circle, rgba(255, 248, 235, 0.7) 0%, rgba(220, 180, 120, 0.4) 60%, transparent 80%)',
            boxShadow: '0 0 15px 4px rgba(212, 168, 67, 0.2)',
            borderRadius: '50%',
            animation: reducedMotion ? 'none' : 'pile-pulse 2s ease-in-out infinite',
          }}
          aria-hidden="true"
        >
          {/* Small grain dots */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: '4px',
                height: '4px',
                backgroundColor: PARTICLE_COLORS[i % 2],
                left: `${20 + Math.cos((i / 8) * Math.PI * 2) * 20}px`,
                top: `${20 + Math.sin((i / 8) * Math.PI * 2) * 20}px`,
              }}
            />
          ))}
        </div>

        {/* Atmospheric warmth ring — fills as scene warms */}
        {!reducedMotion && tapCount > 0 && (
          <div
            className="absolute inset-[-6px] rounded-full pointer-events-none"
            style={{
              background: `conic-gradient(rgba(212, 168, 67, ${sceneWarmth * 0.6}) ${sceneWarmth * 360}deg, transparent ${sceneWarmth * 360}deg)`,
              filter: `blur(4px)`,
              transition: 'background 0.5s ease-out',
            }}
            aria-hidden="true"
          />
        )}
      </button>

      {/* Flying particles */}
      {!reducedMotion && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="purification-particle absolute rounded-full"
              style={{
                left: particle.x + '%',
                top: particle.y + '%',
                width: particle.size + 'px',
                height: particle.size + 'px',
                backgroundColor: particle.color,
                boxShadow: `0 0 6px 2px ${particle.color}`,
                '--particle-angle': particle.angle + 'rad',
                '--particle-distance': particle.distance + 'px',
                '--particle-delay': particle.delay + 'ms',
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Completion glow */}
      {!reducedMotion && completedRef.current && (
        <div
          className="fixed inset-0 pointer-events-none animate-gold-flash"
          style={{
            background: 'radial-gradient(circle, rgba(212, 168, 67, 0.3) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Tap progress indicator */}
      {!reducedMotion && !completedRef.current && tapCount > 0 && (
        <p className="mt-4 text-xs text-gold/50 font-serif z-10 animate-fade-in" aria-live="polite">
          {tapCount < MIN_TAPS_TO_COMPLETE
            ? `${tapCount} / ${MIN_TAPS_TO_COMPLETE}`
            : t('step6Complete')
          }
        </p>
      )}

      {/* Enemy cleanse text on completion */}
      {completedRef.current && enemyName && (
        <p className="mt-6 text-sm text-gold/80 font-serif text-center z-10 animate-fade-in">
          {t('step6EnemyCleanse', { target: enemyName })}
        </p>
      )}

      <p className="mt-8 text-xs text-gold/60 font-serif italic animate-fade-in-up z-10">
        {t('step6Subtitle')}
      </p>
    </div>
  );
}
