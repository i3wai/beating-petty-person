'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useRitual } from '@/components/ritual/RitualProvider';
import StepHeader from '@/components/ritual/StepHeader';
import { useHaptic } from '@/hooks/useHaptic';
import { getAudioManager } from '@/components/audio/AudioManager';
import type { DivinationResult } from '@/components/ritual/RitualProvider';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const RESULT_STAMP: Record<DivinationResult, string> = {
  saint: '/images/stamp-saint.png',
  laugh: '/images/stamp-laugh.png',
  anger: '/images/stamp-anger.png',
};

const RESULT_SOUND: Record<DivinationResult, string> = {
  saint: 'result-saint',
  laugh: 'result-laugh',
  anger: 'result-anger',
};

const POE_FACE_UP = '/images/poe-block-face-up.png';
const POE_FACE_DOWN = '/images/poe-block-face-down.png';

function rollDivination(throwCount: number, isPaid: boolean): DivinationResult {
  if (!isPaid) {
    const r = Math.random();
    if (r < 0.75) return 'saint';
    if (r < 0.95) return 'laugh';
    return 'anger';
  }

  if (throwCount === 1) {
    return Math.random() < 0.5 ? 'laugh' : 'anger';
  }
  if (throwCount === 2) {
    const r = Math.random();
    if (r < 0.333) return 'saint';
    if (r < 0.666) return 'laugh';
    return 'anger';
  }
  return 'saint';
}

type Phase = 'idle' | 'spinning' | 'landed' | 'silence' | 'result';

const SPIN_DURATION_MS = 3000;
const LAND_DURATION_MS = 800;
const SILENCE_DURATION_MS = 1500;
const CONTINUE_DELAY_MS = 1000;
const AUTO_NAV_MS = 5000;
const MIN_SWIPE_PX = 50;

export default function DivinationStep() {
  const t = useTranslations('ritual');
  const locale = useLocale();
  const router = useRouter();
  const { dispatch, isPaid, enemy } = useRitual();
  const { vibrate } = useHaptic();
  const reducedMotion = useReducedMotion();
  const navigatedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [isLeftFaceUp, setIsLeftFaceUp] = useState(false);
  const [isRightFaceUp, setIsRightFaceUp] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [throwCount, setThrowCount] = useState(0);

  // Swipe tracking
  const swipeStartRef = useRef<{ y: number; time: number } | null>(null);

  const navigateToCompletion = useCallback((divResult: string, throws: number) => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    try {
      localStorage.setItem('beatpetty_divination', divResult);
      localStorage.setItem('beatpetty_divination_throws', String(throws));
    } catch {}
    router.push(`/${locale}/completion`);
  }, [locale, router]);

  const handleDivine = useCallback(() => {
    if (phase !== 'idle') return;

    const audio = getAudioManager();
    audio.playAction('action-divination');
    vibrate(50);

    const newThrowCount = throwCount + 1;
    setThrowCount(newThrowCount);
    setPhase('spinning');
    setShowContinue(false);

    const divinationResult = rollDivination(newThrowCount, isPaid);
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
  }, [phase, throwCount, isPaid]);

  // Swipe handlers
  const handleSwipeStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (phase !== 'idle') return;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    swipeStartRef.current = { y, time: Date.now() };
  }, [phase]);

  const handleSwipeEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!swipeStartRef.current || phase !== 'idle') return;
    const y = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    const deltaY = swipeStartRef.current.y - y; // positive = swipe up
    if (deltaY >= MIN_SWIPE_PX) {
      handleDivine();
    }
    swipeStartRef.current = null;
  }, [phase, handleDivine]);

  const handleThrowAgain = useCallback(() => {
    setResult(null);
    setPhase('idle');
    setShowContinue(false);
  }, []);

  // Phase transitions
  useEffect(() => {
    if (phase === 'spinning') {
      const duration = reducedMotion ? 500 : SPIN_DURATION_MS;
      const timer = setTimeout(() => setPhase('landed'), duration);
      return () => clearTimeout(timer);
    }
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (phase === 'landed') {
      const duration = reducedMotion ? 100 : LAND_DURATION_MS;
      const timer = setTimeout(() => {
        vibrate(100);
        setPhase('silence');
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [phase, reducedMotion, vibrate]);

  useEffect(() => {
    if (phase === 'silence') {
      const duration = reducedMotion ? 200 : SILENCE_DURATION_MS;
      const timer = setTimeout(() => setPhase('result'), duration);
      return () => clearTimeout(timer);
    }
  }, [phase, reducedMotion]);

  // Result phase — play sound, show buttons
  useEffect(() => {
    if (phase !== 'result' || !result) return;

    const audio = getAudioManager();
    audio.playTransition(RESULT_SOUND[result]);

    const continueTimer = setTimeout(() => setShowContinue(true), CONTINUE_DELAY_MS);

    let navTimer: ReturnType<typeof setTimeout> | undefined;
    if (result === 'saint') {
      navTimer = setTimeout(() => navigateToCompletion(result, throwCount), AUTO_NAV_MS);
    }

    return () => {
      clearTimeout(continueTimer);
      if (navTimer) clearTimeout(navTimer);
    };
  }, [phase, result, throwCount, navigateToCompletion]);

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
          src={RESULT_STAMP[result]}
          alt=""
          className="fixed inset-0 w-full h-full object-contain pointer-events-none opacity-0 animate-[fade-in_2s_ease-out_0.5s_forwards]"
          aria-hidden="true"
        />
      )}
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 pointer-events-none bg-ink/50" aria-hidden="true" />

      <StepHeader labelKey="stepLabel8" purposeKey="stepPurpose8" />
      <h2 className="text-2xl sm:text-3xl font-bold text-gold font-serif text-center animate-fade-in drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        {t('step8Title')}
      </h2>
      <p className="mt-4 text-sm sm:text-base text-gold/80 font-serif text-center animate-fade-in-up drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
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
              <img
                src={POE_FACE_UP}
                alt=""
                className={`poe-block-img ${isLeftFaceUp || phase !== 'result' ? '' : 'opacity-0'}`}
                draggable={false}
              />
              <img
                src={POE_FACE_DOWN}
                alt=""
                className={`poe-block-img ${!isLeftFaceUp || phase !== 'result' ? '' : 'opacity-0'}`}
                style={{ transform: 'rotateY(180deg)' }}
                draggable={false}
              />
            </div>
          </div>

          {/* Right poe block */}
          <div className="poe-wrapper">
            <div className={`poe-block ${phase === 'spinning' ? 'poe-spinning-right' : ''} ${phase === 'landed' ? 'poe-landed' : ''}`}>
              <img
                src={POE_FACE_UP}
                alt=""
                className={`poe-block-img ${isRightFaceUp || phase !== 'result' ? '' : 'opacity-0'}`}
                draggable={false}
              />
              <img
                src={POE_FACE_DOWN}
                alt=""
                className={`poe-block-img ${!isRightFaceUp || phase !== 'result' ? '' : 'opacity-0'}`}
                style={{ transform: 'rotateY(180deg)' }}
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Result text */}
        {phase === 'result' && result && (
          <div className="divination-result-text mt-8 text-center">
            <p className={`text-lg font-serif drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] ${
              result === 'saint' ? 'text-gold' :
              result === 'laugh' ? 'text-gray-400' :
              'text-vermillion'
            }`}>
              {t(`divination.${result}`)}
            </p>
            {result === 'saint' && enemy?.name && (
              <p className="mt-3 text-sm text-gold/60 font-serif drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                {t('step8EnemyConfirmed', { target: enemy.name })}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Swipe / click area — only visible in idle phase */}
      {phase === 'idle' && (
        <div
          onTouchStart={handleSwipeStart}
          onTouchEnd={handleSwipeEnd}
          onMouseDown={handleSwipeStart}
          onMouseUp={handleSwipeEnd}
          onClick={handleDivine}
          className="
            mt-12 px-8 py-6 rounded-xl
            bg-gold/10 border border-gold/20
            font-serif text-center text-gold/70 text-sm
            select-none cursor-grab active:cursor-grabbing
            transition-colors duration-200
            hover:bg-gold/15 hover:border-gold/30
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50
          "
          style={{ touchAction: 'none' }}
          role="button"
          tabIndex={0}
          aria-label={t('divination.swipeHint')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDivine(); }}
        >
          {t('divination.swipeHint')}
        </div>
      )}

      {/* Loading/processing text during animations */}
      {(phase === 'spinning' || phase === 'landed') && (
        <p className="mt-12 text-gold/70 font-serif text-sm animate-pulse" aria-live="polite">
          {phase === 'spinning' ? t('divination.spinning') : t('divination.landing')}
        </p>
      )}

      {/* Silence phase — moment of reverence */}
      {phase === 'silence' && (
        <p className="mt-12 text-gold/40 font-serif text-xs italic animate-pulse" aria-live="polite">
          ...
        </p>
      )}

      {/* Continue / Throw again button — appears after result */}
      {showContinue && result && (
        result === 'saint' ? (
          <button
            onClick={() => navigateToCompletion(result, throwCount)}
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
        ) : (
          <button
            onClick={handleThrowAgain}
            className="
              mt-8 px-8 py-3 rounded-lg
              bg-gold/10 text-gold/70 border border-gold/20
              font-serif font-semibold text-base
              hover:bg-gold/15 hover:border-gold/30
              active:bg-gold/20
              transition-colors duration-200 animate-fade-in
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30
            "
          >
            {t('divination.throwAgain')}
          </button>
        )
      )}
    </div>
  );
}
