'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useRitual } from '@/components/ritual/RitualProvider';
import { useHaptic } from '@/hooks/useHaptic';
import { getAudioManager } from '@/components/audio/AudioManager';
import type { DivinationResult } from '@/components/ritual/RitualProvider';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const RESULT_IMAGE: Record<DivinationResult, string> = {
  saint: '/images/result-saint.jpg',
  laugh: '/images/result-laugh.jpg',
  anger: '/images/result-anger.jpg',
};

const RESULT_SOUND: Record<DivinationResult, string> = {
  saint: 'result-saint',
  laugh: 'result-laugh',
  anger: 'result-anger',
};

function rollDivination(): DivinationResult {
  const r = Math.random();
  if (r < 0.75) return 'saint';
  if (r < 0.95) return 'laugh';
  return 'anger';
}

type Phase = 'idle' | 'spinning' | 'landed' | 'result';

const SPIN_DURATION_MS = 2000;
const LAND_DURATION_MS = 1000;
const CONTINUE_DELAY_MS = 1500;
const AUTO_NAV_MS = 8000;

export default function DivinationStep() {
  const t = useTranslations('ritual');
  const locale = useLocale();
  const router = useRouter();
  const { dispatch } = useRitual();
  const { vibrate } = useHaptic();
  const reducedMotion = useReducedMotion();
  const completedRef = useRef(false);
  const navigatedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [isLeftFaceUp, setIsLeftFaceUp] = useState(false);
  const [isRightFaceUp, setIsRightFaceUp] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  const navigateToCompletion = useCallback((divResult: string) => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    try {
      localStorage.setItem('beatpetty_divination', divResult);
    } catch {}
    router.push(`/${locale}/completion`);
  }, [locale, router]);

  const handleDivine = useCallback(() => {
    if (completedRef.current || phase !== 'idle') return;
    completedRef.current = true;

    const audio = getAudioManager();
    audio.playAction('action-divination');

    setPhase('spinning');

    const divinationResult = rollDivination();
    setResult(divinationResult);

    if (divinationResult === 'saint') {
      const leftUp = Math.random() > 0.5;
      setIsLeftFaceUp(leftUp);
      setIsRightFaceUp(!leftUp);
    } else if (divinationResult === 'laugh') {
      setIsLeftFaceUp(true);
      setIsRightFaceUp(true);
    } else {
      setIsLeftFaceUp(false);
      setIsRightFaceUp(false);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'spinning') {
      const duration = reducedMotion ? 500 : SPIN_DURATION_MS;
      const timer = setTimeout(() => {
        setPhase('landed');
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (phase === 'landed') {
      const duration = reducedMotion ? 100 : LAND_DURATION_MS;
      const timer = setTimeout(() => {
        setPhase('result');
        vibrate(100);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [phase, reducedMotion, vibrate]);

  // Show continue button + play result sound + auto-navigate safety net
  useEffect(() => {
    if (phase !== 'result' || !result) return;

    // Play result-specific sound
    const audio = getAudioManager();
    audio.playTransition(RESULT_SOUND[result]);

    // Show continue button after delay
    const continueTimer = setTimeout(() => {
      setShowContinue(true);
    }, CONTINUE_DELAY_MS);

    // Auto-navigate safety net
    const navTimer = setTimeout(() => {
      navigateToCompletion(result);
    }, AUTO_NAV_MS);

    return () => {
      clearTimeout(continueTimer);
      clearTimeout(navTimer);
    };
  }, [phase, result, navigateToCompletion]);

  const resultClassName = result ? `divination-${result}` : '';

  return (
    <div className="flex flex-col items-center min-h-[80dvh] px-4 py-12 sm:py-16 max-w-lg mx-auto bg-ink">
      {/* AI background image */}
      <img
        src="/images/divination-ground.jpg"
        alt=""
        className="fixed inset-0 w-full h-full object-cover pointer-events-none opacity-60"
        aria-hidden="true"
      />
      {/* Background switches to result image on reveal */}
      {phase === 'result' && result && (
        <img
          src={RESULT_IMAGE[result]}
          alt=""
          className="fixed inset-0 w-full h-full object-cover pointer-events-none opacity-0 animate-[fade-in_1.5s_ease-out_0.2s_forwards]"
          aria-hidden="true"
        />
      )}
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
            bg-gold/20 text-gold border border-gold/30
            font-serif font-semibold text-base
            hover:bg-gold/30 hover:border-gold/50
            active:bg-gold/40
            transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50
          "
          aria-label={t('step8Button')}
        >
          {t('step8Button')}
        </button>
      )}

      {/* Loading/processing text during animations */}
      {(phase === 'spinning' || phase === 'landed') && (
        <p className="mt-12 text-paper-muted font-serif text-sm animate-pulse" aria-live="polite">
          {phase === 'spinning' ? t('divination.spinning') : t('divination.landing')}
        </p>
      )}

      {/* Continue button — appears 1.5s after result */}
      {showContinue && result && (
        <button
          onClick={() => navigateToCompletion(result)}
          className="
            mt-8 px-8 py-3 rounded-lg
            bg-gold/20 text-gold border border-gold/30
            font-serif font-semibold text-base
            hover:bg-gold/30 hover:border-gold/50
            active:bg-gold/40
            transition-colors duration-200 animate-fade-in
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50
          "
        >
          {t('divination.continue')}
        </button>
      )}
    </div>
  );
}
