'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import StepHeader from '@/components/ritual/StepHeader';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useHaptic } from '@/hooks/useHaptic';
import { useAudio, SOUND_IDS } from '@/components/audio/useAudio';

const AUTO_COMPLETE_MS = 10000;
const DRAG_COOLDOWN_MS = 120;
const HAPTIC_DURATION = 15;

const PARTICLE_COLORS = [
  'rgba(255, 248, 235, 0.95)',
  'rgba(255, 235, 200, 0.95)',
  'rgba(220, 180, 120, 0.95)',
  'rgba(200, 155, 90, 0.95)',
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
  const lastDragRef = useRef(0);
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const [sceneWarmth, setSceneWarmth] = useState(0);
  const [showEnemyCleanse, setShowEnemyCleanse] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const interactionCountRef = useRef(0);

  const enemyName = enemy?.name || (enemy?.category ? t(`enemies.${enemy.category}.name` as Parameters<typeof t>[0]) : '');

  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    dispatch({ type: 'PURIFICATION_COMPLETE' });
  }, [dispatch]);

  useEffect(() => {
    audio.init().catch(() => {});
  }, [audio]);

  // Auto-complete timer — starts after first interaction
  useEffect(() => {
    if (completedRef.current || !hasInteracted) return;

    if (reducedMotion) {
      const timer = setTimeout(() => handleComplete(), 4000);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      handleComplete();
    }, AUTO_COMPLETE_MS);
    return () => clearTimeout(timer);
  }, [hasInteracted, reducedMotion, handleComplete]);

  // Warm up the scene based on interaction count
  useEffect(() => {
    if (reducedMotion) return;
    const warmth = Math.min(interactionCountRef.current / 15, 1);
    setSceneWarmth(warmth);
  }, [particles.length, reducedMotion]);

  const spawnParticles = useCallback(
    (xPct: number, yPct: number) => {
      if (interactionCountRef.current === 0) {
        setHasInteracted(true);
      }
      interactionCountRef.current += 1;

      const count = 5 + Math.floor(Math.random() * 4);
      const newParticles: ParticleProps[] = [];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
        const distance = 30 + Math.random() * 60;
        const delay = Math.random() * 80;

        newParticles.push({
          id: `${Date.now()}-${i}`,
          x: xPct,
          y: yPct,
          color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          size: 3 + Math.random() * 5,
          angle,
          distance,
          delay,
        });
      }

      setParticles((prev) => [...prev, ...newParticles]);
    },
    [],
  );

  const handleDrag = useCallback(
    (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
      if (completedRef.current || reducedMotion) return;

      const now = performance.now();
      if (now - lastDragRef.current < DRAG_COOLDOWN_MS) return;
      lastDragRef.current = now;

      const rect = e.currentTarget.getBoundingClientRect();
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

      const xPct = ((clientX - rect.left) / rect.width) * 100;
      const yPct = ((clientY - rect.top) / rect.height) * 100;

      vibrate(HAPTIC_DURATION);
      try { audio.playAction(SOUND_IDS.ACTION_SCATTER); } catch { /* ignore */ }

      spawnParticles(xPct, yPct);
    },
    [reducedMotion, vibrate, audio, spawnParticles],
  );

  // Click fallback — tap to scatter at center
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (completedRef.current || reducedMotion) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;

      vibrate(HAPTIC_DURATION);
      try { audio.playAction(SOUND_IDS.ACTION_SCATTER); } catch { /* ignore */ }

      spawnParticles(xPct, yPct);
    },
    [reducedMotion, vibrate, audio, spawnParticles],
  );

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

      {/* Grain scatter decorative image */}
      <img
        src="/images/grain-scatter.png"
        alt=""
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.15 + sceneWarmth * 0.15, transition: 'opacity 1.5s ease-out' }}
        aria-hidden="true"
      />

      <StepHeader labelKey="stepLabel6" purposeKey="stepPurpose6" />
      <h2 className="text-2xl sm:text-3xl font-bold text-gold font-serif text-center animate-fade-in z-10">
        {t('step6Title')}
      </h2>
      <p className="mt-4 text-sm sm:text-base text-gold/80 font-serif text-center animate-fade-in-up z-10">
        {t('step6Instruction')}
      </p>

      {/* Full-area drag + click interaction zone */}
      <div
        onTouchMove={handleDrag}
        onMouseMove={handleDrag}
        onClick={handleClick}
        className="mt-8 relative w-full max-w-md flex-1 min-h-[300px] rounded-xl cursor-grab active:cursor-grabbing z-10"
        style={{
          background: reducedMotion ? 'transparent' : `radial-gradient(circle at 50% 50%, rgba(212, 168, 67, ${0.03 + sceneWarmth * 0.08}) 0%, transparent 60%)`,
          touchAction: 'none',
        }}
        role="application"
        aria-label={t('step6Instruction')}
      >
        {/* Warmth ring indicator */}
        {!reducedMotion && sceneWarmth > 0 && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: `conic-gradient(rgba(212, 168, 67, ${sceneWarmth * 0.4}) ${sceneWarmth * 360}deg, transparent ${sceneWarmth * 360}deg)`,
              filter: 'blur(6px)',
              transition: 'background 0.5s ease-out',
            }}
            aria-hidden="true"
          />
        )}
      </div>

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

      {/* Enemy cleanse text on completion */}
      {completedRef.current && enemyName && (
        <p className="mt-6 text-sm text-gold/80 font-serif text-center z-10 animate-fade-in">
          {t('step6EnemyCleanse', { target: enemyName })}
        </p>
      )}

      <p className="mt-6 text-xs text-gold/60 font-serif italic animate-fade-in-up z-10">
        {t('step6Subtitle')}
      </p>
    </div>
  );
}
