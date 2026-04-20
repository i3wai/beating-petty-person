'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useHaptic } from '@/hooks/useHaptic';
import { useAudio, SOUND_IDS } from '@/components/audio/useAudio';

const AUTO_COMPLETE_MS = 3000;
const MIN_TAPS_TO_COMPLETE = 3;
const HAPTIC_DURATION = 30;

// Particle colors for rice (white/beige) and beans (brown)
const PARTICLE_COLORS = [
  'rgba(245, 240, 232, 0.9)',  // rice white
  'rgba(232, 224, 208, 0.9)',  // rice beige
  'rgba(180, 140, 100, 0.9)',  // bean brown
  'rgba(160, 120, 80, 0.9)',   // bean dark brown
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
  const { dispatch } = useRitual();
  const reducedMotion = useReducedMotion();
  const { vibrate } = useHaptic();
  const audio = useAudio();

  const completedRef = useRef(false);
  const [tapCount, setTapCount] = useState(0);
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const [sceneWarmth, setSceneWarmth] = useState(0); // 0 = cool gray, 1 = warm
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    dispatch({ type: 'PURIFICATION_COMPLETE' });
  }, [dispatch]);

  // Initialize audio on mount
  useEffect(() => {
    audio.init().catch(() => {});
  }, [audio]);

  // Auto-complete timer — runs once on mount, not reset by taps
  useEffect(() => {
    if (completedRef.current) return;

    if (reducedMotion) {
      const timer = setTimeout(() => {
        handleComplete();
      }, 200);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      handleComplete();
    }, AUTO_COMPLETE_MS);
    return () => clearTimeout(timer);
  }, [reducedMotion, handleComplete]);

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
        size: 3 + Math.random() * 4,
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
        style={{ background: `rgba(17, 17, 17, ${0.5 - sceneWarmth * 0.15})`, transition: 'background 1s ease-out' }}
        aria-hidden="true"
      />

      <h2 className="text-2xl sm:text-3xl font-bold text-gold font-serif text-center animate-fade-in z-10">
        {t('step6Title')}
      </h2>
      <p className="mt-4 text-sm sm:text-base text-paper-muted font-serif text-center animate-fade-in-up z-10">
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
            background: 'radial-gradient(circle, rgba(245, 240, 232, 0.6) 0%, rgba(180, 140, 100, 0.3) 60%, transparent 80%)',
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

        {/* Tap count indicator */}
        {!reducedMotion && tapCount > 0 && (
          <span className="absolute -top-8 text-gold font-serif text-sm">
            {tapCount}/{MIN_TAPS_TO_COMPLETE}
          </span>
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

      <p className="mt-8 text-xs text-paper-muted/50 font-serif italic animate-fade-in-up z-10">
        {t('step6Subtitle')}
      </p>
    </div>
  );
}
