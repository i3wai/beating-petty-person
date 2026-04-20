'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useRitual } from '@/components/ritual/RitualProvider';
import { useHaptic } from '@/hooks/useHaptic';
import { getAudioManager } from '@/components/audio/AudioManager';
import type { DivinationResult } from '@/components/ritual/RitualProvider';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function rollDivination(): DivinationResult {
  const r = Math.random();
  if (r < 0.75) return 'saint';
  if (r < 0.95) return 'laugh';
  return 'anger';
}

type Phase = 'idle' | 'spinning' | 'landed' | 'result';

const SPIN_DURATION_MS = 2000;
const LAND_DURATION_MS = 1000;
const RESULT_DISPLAY_MS = 2000;

export default function DivinationStep() {
  const t = useTranslations('ritual');
  const locale = useLocale();
  const router = useRouter();
  const { dispatch } = useRitual();
  const { vibrate } = useHaptic();
  const reducedMotion = useReducedMotion();
  const completedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [isLeftFaceUp, setIsLeftFaceUp] = useState(false);
  const [isRightFaceUp, setIsRightFaceUp] = useState(false);

  const handleDivine = useCallback(() => {
    if (completedRef.current || phase !== 'idle') return;
    completedRef.current = true;

    // Play sound
    const audio = getAudioManager();
    audio.playAction('action-divination');

    // Start spin animation
    setPhase('spinning');

    // Determine result
    const divinationResult = rollDivination();
    setResult(divinationResult);

    // Determine final orientations
    if (divinationResult === 'saint') {
      // One up, one down
      const leftUp = Math.random() > 0.5;
      setIsLeftFaceUp(leftUp);
      setIsRightFaceUp(!leftUp);
    } else if (divinationResult === 'laugh') {
      // Both up
      setIsLeftFaceUp(true);
      setIsRightFaceUp(true);
    } else {
      // Both down (anger)
      setIsLeftFaceUp(false);
      setIsRightFaceUp(false);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'spinning') {
      // Reduced motion: skip to result after 500ms
      const duration = reducedMotion ? 500 : SPIN_DURATION_MS;
      const timer = setTimeout(() => {
        setPhase('landed');
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (phase === 'landed') {
      // Reduced motion: minimal bounce
      const duration = reducedMotion ? 100 : LAND_DURATION_MS;
      const timer = setTimeout(() => {
        setPhase('result');
        // Haptic feedback when result is revealed
        vibrate(100);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [phase, reducedMotion, vibrate]);

  useEffect(() => {
    if (phase === 'result' && result) {
      const timer = setTimeout(() => {
        // Save divination result for /completion page
        try {
          localStorage.setItem('beatpetty_divination', result);
        } catch {}

        // Navigate to completion page
        router.push(`/${locale}/completion`);
      }, RESULT_DISPLAY_MS);
      return () => clearTimeout(timer);
    }
  }, [phase, result, locale, router]);

  const resultClassName = result
    ? `divination-${result}`
    : '';

  return (
    <div className="flex flex-col items-center min-h-[80dvh] px-4 py-12 sm:py-16 max-w-lg mx-auto bg-ink">
      {/* AI background image */}
      <img
        src="/images/divination-ground.jpg"
        alt=""
        className="fixed inset-0 w-full h-full object-cover pointer-events-none opacity-60"
        aria-hidden="true"
      />
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 pointer-events-none bg-ink/45" aria-hidden="true" />

      <h2 className="text-2xl sm:text-3xl font-bold text-gold font-serif text-center animate-fade-in">
        {t('step8Title')}
      </h2>
      <p className="mt-4 text-sm sm:text-base text-paper-muted font-serif text-center animate-fade-in-up">
        {t('step8Subtitle')}
      </p>

      {/* Poe blocks area */}
      <div className={`mt-12 relative ${resultClassName}`}>
        {phase === 'result' && (
          <div className="divination-burst" aria-hidden="true" />
        )}

        <div className="poe-container">
          {/* Left poe block */}
          <div className="poe-wrapper">
            <div className={`poe-block ${phase === 'spinning' ? 'poe-spinning-left' : ''} ${phase === 'landed' ? 'poe-landed' : ''}`}>
              <div
                className={`poe-block-face ${isLeftFaceUp || phase !== 'result' ? '' : 'opacity-0'}`}
                aria-hidden="true"
              />
              <div
                className={`poe-block-back ${!isLeftFaceUp || phase !== 'result' ? '' : 'opacity-0'}`}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Right poe block */}
          <div className="poe-wrapper">
            <div className={`poe-block ${phase === 'spinning' ? 'poe-spinning-right' : ''} ${phase === 'landed' ? 'poe-landed' : ''}`}>
              <div
                className={`poe-block-face ${isRightFaceUp || phase !== 'result' ? '' : 'opacity-0'}`}
                aria-hidden="true"
              />
              <div
                className={`poe-block-back ${!isRightFaceUp || phase !== 'result' ? '' : 'opacity-0'}`}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Result text */}
        {phase === 'result' && result && (
          <div className="divination-result-text mt-8 text-center">
            <p className={`text-lg font-serif ${
              result === 'saint' ? 'text-gold' :
              result === 'laugh' ? 'text-gray-400' :
              'text-vermillion'
            }`}>
              {t(`divination.${result}`)}
            </p>
          </div>
        )}
      </div>

      {/* Cast button - only visible in idle phase */}
      {phase === 'idle' && (
        <button
          onClick={handleDivine}
          className="
            mt-12 px-8 py-3 rounded-lg
            bg-gold text-ink font-serif font-semibold text-base
            hover:bg-gold-light active:bg-gold-dark
            transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
          "
          aria-label={t('step8Button')}
        >
          {t('step8Button')}
        </button>
      )}

      {/* Loading/processing text during animations */}
      {(phase === 'spinning' || phase === 'landed') && (
        <p className="mt-12 text-paper-muted font-serif text-sm animate-pulse" aria-live="polite">
          {phase === 'spinning' ? '...' : '...'}
        </p>
      )}
    </div>
  );
}
