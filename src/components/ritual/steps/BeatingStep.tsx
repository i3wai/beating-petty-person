'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations, useMessages } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import { useCanvas } from '@/components/canvas/useCanvas';
import { ParticleType } from '@/components/canvas/particles';
import { useHaptic } from '@/hooks/useHaptic';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAudio, SOUND_IDS } from '@/components/audio/useAudio';
import { SILHOUETTE_CLIPS, DEFAULT_CLIP, PAPER_FIGURE_IMAGES, DEFAULT_IMAGE, type EnemyCategory } from '@/components/ritual/silhouettes';

type DamageType = 'tear' | 'wrinkle' | 'scorch';

/** Slipper cursor — AI-generated flip-flop image */
const SLIPPER_CURSOR = 'url(/images/slippers-cursor-64.png) 32 56, pointer';

/** Damage mark types */

/** How many milliseconds between accepted taps */
const TAP_DEBOUNCE_MS = 100;
/** Min / max HitSpark particles per burst */
const SPARK_MIN = 8;
const SPARK_MAX = 12;
/** Rage meter config */
const RAGE_MAX = 100;
/** Name animation speed in ms per character */
const NAME_CHAR_INTERVAL_MS = 120;
/** SVG circle properties for rage ring */
const RAGE_RING_RADIUS = 105;
const RAGE_RING_CIRCUMFERENCE = 2 * Math.PI * RAGE_RING_RADIUS;

/**
 * Step 2 of the ritual — beat the paper effigy.
 * Canvas 2D overlay with HitSpark particles on tap.
 * Rage meter replaces the old 30s timer.
 * Enemy name appears character by character.
 */
export default function BeatingStep() {
  const t = useTranslations('ritual');
  const { dispatch, enemy } = useRitual();
  const { vibrate } = useHaptic();
  const reducedMotion = useReducedMotion();
  const audio = useAudio();

  // Canvas (skip when reduced motion)
  const { canvasRef, emit, start, stop } = useCanvas({
    autoStart: !reducedMotion,
  });

  // Safe emit wrapper — canvas context may fail
  const safeEmit = useCallback(
    (...args: Parameters<typeof emit>) => {
      try {
        emit(...args);
      } catch {
        // Canvas context failed — particles are non-critical
      }
    },
    [emit],
  );

  // Tap state
  const [tapCount, setTapCount] = useState(0);
  const lastTapRef = useRef(0);

  // Ritual authenticity state
  const nextIdRef = useRef(0);
  const [slippers, setSlippers] = useState<{ id: number; x: number; y: number }[]>([]);
  const [chantTexts, setChantTexts] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const [damages, setDamages] = useState<{ id: number; type: DamageType; x: number; y: number; size: number }[]>([]);

  // Chant phrases from i18n (useMessages bypasses t.raw() array resolution issue)
  const messages = useMessages();
  const ritual = messages.ritual as Record<string, unknown>;
  const chantPhrases = (ritual.step2Chants ?? []) as string[];

  // Rage meter state (0–100)
  const [rageMeter, setRageMeter] = useState(0);
  const rageRef = useRef(0);
  const lastMilestoneRef = useRef(0);
  const [ariaAnnouncement, setAriaAnnouncement] = useState('');

  // Rage-complete flash state
  const [rageFlash, setRageFlash] = useState(false);

  // Name animation state
  const enemyName = enemy?.name ?? '';
  const [visibleChars, setVisibleChars] = useState(0);
  const [nameGlow, setNameGlow] = useState(false);
  const nameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Double-dispatch guard
  const completedRef = useRef(false);

  // ---- Cleanup on unmount ----
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // ---- Name writing animation (plays once on mount) ----
  useEffect(() => {
    if (!enemyName) return;

    let chars = 0;
    nameIntervalRef.current = setInterval(() => {
      chars += 1;
      setVisibleChars(chars);
      if (chars >= enemyName.length) {
        if (nameIntervalRef.current) clearInterval(nameIntervalRef.current);
        // Golden glow when complete
        setNameGlow(true);
        setTimeout(() => setNameGlow(false), 500);
        // Gold particle burst
        if (!reducedMotion) {
          safeEmit(ParticleType.SealGlow, 160, 200, 10);
        }
      }
    }, NAME_CHAR_INTERVAL_MS);

    return () => {
      if (nameIntervalRef.current) clearInterval(nameIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Completion handler ----
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    stop();
    dispatch({ type: 'BEATING_COMPLETE' });
  }, [dispatch, stop]);

  // ---- Rage milestone screen reader announcements ----
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    for (const m of milestones) {
      if (rageMeter >= m && lastMilestoneRef.current < m) {
        lastMilestoneRef.current = m;
        const key = `step2RageMilestone${m}` as 'step2RageMilestone25' | 'step2RageMilestone50' | 'step2RageMilestone75' | 'step2RageMilestone100';
        setAriaAnnouncement(t(key));
        // Clear after announcement
        setTimeout(() => setAriaAnnouncement(''), 2000);
        break;
      }
    }
  }, [rageMeter, t]);

  // ---- Rage-full auto-complete ----
  useEffect(() => {
    if (rageMeter >= RAGE_MAX && !completedRef.current) {
      // Flash paper figure red
      setRageFlash(true);

      const flashTimeout = setTimeout(() => {
        setRageFlash(false);
      }, 500);

      const advanceTimeout = setTimeout(() => {
        handleComplete();
      }, 800);

      return () => {
        clearTimeout(flashTimeout);
        clearTimeout(advanceTimeout);
      };
    }
  }, [rageMeter, handleComplete]);

  // ---- Tap handler ----
  const handleTap = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (completedRef.current) return;

      // Debounce
      const now = performance.now();
      if (now - lastTapRef.current < TAP_DEBOUNCE_MS) return;
      const interval = now - lastTapRef.current;
      lastTapRef.current = now;

      // Determine coordinates relative to the interaction container
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
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

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Emit particles (unless reduced motion)
      if (!reducedMotion) {
        const count = SPARK_MIN + Math.floor(Math.random() * (SPARK_MAX - SPARK_MIN + 1));
        safeEmit(ParticleType.HitSpark, x, y, count);
      }

      // Haptic feedback — escalate with rage
      const currentRage = rageRef.current;
      if (currentRage >= 80) {
        vibrate(30);
        setTimeout(() => vibrate(20), 50);
      } else if (currentRage >= 50) {
        vibrate(40);
      } else {
        vibrate(50);
      }

      // Sound — beat + thwack
      audio.playAction(SOUND_IDS.ACTION_BEAT);
      audio.playAction(SOUND_IDS.ACTION_THWACK);

      // Update tap count
      setTapCount((prev) => {
        const next = prev + 1;

        // --- Slipper weapon (skip in reduced motion) ---
        if (!reducedMotion) {
          const slipperId = nextIdRef.current++;
          const slipperEntry = { id: slipperId, x, y };
          setSlippers((prev) => {
            const updated = [...prev, slipperEntry];
            return updated.length > 5 ? updated.slice(-5) : updated;
          });
          setTimeout(() => {
            setSlippers((prev) => prev.filter((s) => s.id !== slipperId));
          }, 350);
        }

        // --- Curse chant (skip in reduced motion) ---
        if (!reducedMotion) {
          const chantId = nextIdRef.current++;
          const chantText = chantPhrases[next % chantPhrases.length];
          const chantEntry = { id: chantId, text: chantText, x, y };
          setChantTexts((prev) => {
            const updated = [...prev, chantEntry];
            return updated.length > 10 ? updated.slice(-10) : updated;
          });
          setTimeout(() => {
            setChantTexts((prev) => prev.filter((c) => c.id !== chantId));
          }, 1600);
        }

        // --- Paper damage marks ---
        const damageCount = 1 + Math.floor(Math.random() * 2); // 1 or 2
        const newDamages: { id: number; type: DamageType; x: number; y: number; size: number }[] = [];
        for (let i = 0; i < damageCount; i++) {
          const types: DamageType[] = ['tear', 'wrinkle', 'scorch'];
          const type = types[Math.floor(Math.random() * types.length)];
          // Position relative to paper figure center (160, 200) — keep within 120x180 bounds
          const dx = (Math.random() - 0.5) * 90;
          const dy = (Math.random() - 0.5) * 130;
          let size: number;
          if (type === 'tear') size = 8 + Math.floor(Math.random() * 11); // 8-18px
          else if (type === 'wrinkle') size = 15 + Math.floor(Math.random() * 16); // 15-30px
          else size = 6 + Math.floor(Math.random() * 9); // 6-14px
          newDamages.push({
            id: nextIdRef.current++,
            type,
            x: 160 + dx,
            y: 200 + dy,
            size,
          });
        }
        setDamages((prev) => {
          const updated = [...prev, ...newDamages];
          return updated.length > 30 ? updated.slice(-30) : updated;
        });

        return next;
      });

      // Rage meter: faster taps = more points
      let points: number;
      if (interval < 200) {
        points = 5;
      } else if (interval < 400) {
        points = 4;
      } else {
        points = 3;
      }

      rageRef.current = Math.min(rageRef.current + points, RAGE_MAX);
      setRageMeter(rageRef.current);
    },
    [reducedMotion, safeEmit, vibrate, audio, chantPhrases],
  );

  // ---- Paper figure visual degradation (MORE dramatic with rage) ----
  const rageProgress = rageMeter / RAGE_MAX;
  const tapProgress = Math.min(tapCount / 40, 1);
  const combinedProgress = Math.max(rageProgress, tapProgress);
  const figureRotate = combinedProgress * 20 * (tapCount % 2 === 0 ? 1 : -1);
  const figureScale = 1 - combinedProgress * 0.35;
  const figureOpacity = 1 - combinedProgress * 0.6;

  // Reduced-motion: CSS scale pulse on tap
  const [pulseActive, setPulseActive] = useState(false);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTapReduced = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      handleTap(e);
      setPulseActive(true);
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
      pulseTimeoutRef.current = setTimeout(() => setPulseActive(false), 200);
    },
    [handleTap],
  );

  const tapHandler = reducedMotion ? handleTapReduced : handleTap;

  // ---- Keyboard handler (Enter/Space) for accessibility ----
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Synthesize a tap at center of the interaction area
        const fakeEvent = {
          currentTarget: e.currentTarget,
          clientX: e.currentTarget.getBoundingClientRect().left + e.currentTarget.getBoundingClientRect().width / 2,
          clientY: e.currentTarget.getBoundingClientRect().top + e.currentTarget.getBoundingClientRect().height / 2,
        } as unknown as React.MouseEvent<HTMLDivElement>;
        tapHandler(fakeEvent);
      }
    },
    [tapHandler],
  );

  // SVG circle stroke-dashoffset for rage ring
  const rageDashOffset = RAGE_RING_CIRCUMFERENCE * (1 - rageProgress);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] relative select-none">
      {/* Screen reader rage announcements */}
      <div aria-live="polite" className="sr-only">
        {ariaAnnouncement}
      </div>

      {/* Title — staggered entrance */}
      <h2 className="text-2xl sm:text-3xl font-bold text-vermillion font-serif mb-6 stagger-fade-in stagger-1">
        {t('step2Title')}
      </h2>

      {/* Rage progress display — staggered entrance */}
      <div className="mb-6 text-lg font-serif text-paper-muted stagger-fade-in stagger-2">
        {rageMeter >= RAGE_MAX ? (
          <span className="text-vermillion animate-pulse-glow text-2xl font-mono">
            {t('step2RageFull')}
          </span>
        ) : (
          <span
            className={`font-mono text-2xl tabular-nums ${
              rageMeter >= 80 ? 'text-vermillion animate-pulse-glow' : 'text-gold'
            }`}
          >
            {rageMeter}%
          </span>
        )}
      </div>

      {/* Interaction area — responsive sizing, staggered entrance */}
      <div
        className="relative flex items-center justify-center stagger-fade-in stagger-3"
        style={{
          cursor: SLIPPER_CURSOR,
          width: 'clamp(280px, 80vmin, 400px)',
          height: 'clamp(360px, 90vmin, 500px)',
        }}
        onClick={tapHandler}
        onTouchStart={tapHandler}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={t('step2TapAria')}
      >
        {/* Layer 1: Goose Neck Bridge ground (bottom) */}
        <div
          className="absolute inset-0 rounded"
          aria-hidden="true"
          style={{
            backgroundImage: 'url(/images/goose-neck-bridge-ground.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.6,
          }}
        />

        {/* Layer 2: Smoke wisps (skip in reduced motion) */}
        {!reducedMotion && (
          <>
            <div
              className="smoke-wisp"
              aria-hidden="true"
              style={{
                left: '5%',
                bottom: '-10px',
                width: '80px',
                height: '40px',
                '--smoke-duration': '8s',
                '--smoke-drift-duration': '6s',
              } as React.CSSProperties}
            />
            <div
              className="smoke-wisp"
              aria-hidden="true"
              style={{
                left: '28%',
                bottom: '-10px',
                width: '70px',
                height: '35px',
                '--smoke-duration': '10s',
                '--smoke-drift-duration': '8s',
              } as React.CSSProperties}
            />
            <div
              className="smoke-wisp"
              aria-hidden="true"
              style={{
                left: '52%',
                bottom: '-10px',
                width: '90px',
                height: '45px',
                '--smoke-duration': '12s',
                '--smoke-drift-duration': '7s',
              } as React.CSSProperties}
            />
            <div
              className="smoke-wisp"
              aria-hidden="true"
              style={{
                left: '75%',
                bottom: '-10px',
                width: '75px',
                height: '38px',
                '--smoke-duration': '15s',
                '--smoke-drift-duration': '10s',
              } as React.CSSProperties}
            />
          </>
        )}

        {/* Layer 3: Canvas overlay — pointer-events-none so taps pass through */}
        {!reducedMotion && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
            aria-hidden="true"
          />
        )}

        {/* Layer 4: Slipper weapons (animated) */}
        {!reducedMotion &&
          slippers.map((s) => (
            <div
              key={s.id}
              className="slipper-weapon absolute pointer-events-none z-[4]"
              style={{ left: s.x - 28, top: s.y - 16 }}
              aria-hidden="true"
            >
              <svg width="56" height="32" viewBox="0 0 56 32" fill="none">
                {/* Flat sole */}
                <ellipse cx="28" cy="22" rx="24" ry="8" fill="#b8a080" stroke="#8b7355" strokeWidth="1.5" />
                {/* Strap */}
                <path d="M18 18 Q28 4 38 18" stroke="#6b5b45" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Toe post */}
                <circle cx="28" cy="16" r="2.5" fill="#8b7355" />
              </svg>
            </div>
          ))}

        {/* Layer 5: Curse chants (floating text) */}
        {!reducedMotion &&
          chantTexts.map((c) => (
            <span
              key={c.id}
              className="curse-chant absolute pointer-events-none z-[9] text-xs font-serif font-bold whitespace-nowrap"
              style={{ left: c.x, top: c.y }}
              aria-hidden="true"
            >
              {c.text}
            </span>
          ))}

        {/* Layer 6: Rage ring (SVG circle) — responsive */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-[6]"
          viewBox="0 0 320 400"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {/* Background ring */}
          <circle
            cx="160"
            cy="200"
            r={RAGE_RING_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="4"
          />
          {/* Progress ring */}
          <circle
            cx="160"
            cy="200"
            r={RAGE_RING_RADIUS}
            fill="none"
            stroke={rageMeter >= 80 ? '#ef6030' : '#d4a843'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={RAGE_RING_CIRCUMFERENCE}
            strokeDashoffset={rageDashOffset}
            transform="rotate(-90 160 200)"
            style={{
              transition: 'stroke-dashoffset 0.2s ease-out, stroke 0.3s ease',
            }}
          />
        </svg>

        {/* Layer 7: Paper figure image (z-[7]) */}
        <div
          className={`
            relative flex items-center justify-center z-[7]
            ${reducedMotion && pulseActive ? 'paper-figure-pulse' : ''}
          `}
          style={{
            width: 120,
            height: 180,
            boxShadow: rageFlash
              ? '0 0 40px 12px rgba(239, 96, 48, 0.6)'
              : `0 0 ${20 + rageProgress * 20}px ${4 + rageProgress * 8}px rgba(${rageProgress > 0.5 ? '239, 96, 48' : '245, 240, 232'}, ${0.1 + rageProgress * 0.15})`,
            transform: `rotate(${figureRotate}deg) scale(${figureScale})`,
            opacity: figureOpacity,
            transition: 'transform 0.15s ease-out, opacity 0.15s ease-out, box-shadow 0.3s ease',
            filter: rageFlash ? 'brightness(1.3) saturate(1.5)' : undefined,
          }}
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PAPER_FIGURE_IMAGES[(enemy?.category as EnemyCategory) ?? 'custom'] ?? DEFAULT_IMAGE}
            alt=""
            className="absolute inset-0 w-full h-full object-cover rounded-sm"
            draggable={false}
            style={{ opacity: rageFlash ? 0.7 : 1, pointerEvents: 'none', userSelect: 'none' }}
          />
          {/* Enemy name overlay — character by character reveal, ink-on-paper style */}
          {enemyName && (
            <span
              className={`relative z-10 text-ink font-serif text-sm font-semibold text-center leading-tight px-2 select-none ${
                nameGlow ? 'animate-[goldenGlow_0.5s_ease-out]' : ''
              }`}
              style={{
                maxWidth: '80%',
                wordBreak: 'break-word',
                transform: 'rotate(-3deg)',
                fontStyle: 'italic',
                color: '#1a1a1a',
                textShadow: nameGlow
                  ? '0 0 8px rgba(212, 168, 67, 0.8), 0 0 16px rgba(212, 168, 67, 0.4)'
                  : '0 0.5px 1px rgba(0,0,0,0.3)',
                transition: 'text-shadow 0.5s ease-out',
              }}
            >
              {enemyName.slice(0, visibleChars)}
            </span>
          )}
        </div>

        {/* Layer 8: Damage marks — paper tears & scorch (z-[8]) */}
        <div className="absolute inset-0 pointer-events-none z-[8]" aria-hidden="true">
          {damages.map((d) => (
            <div
              key={d.id}
              className={`damage-mark damage-${d.type} damage-appear`}
              style={{
                left: d.x - d.size / 2,
                top: d.y - (d.type === 'wrinkle' ? 1 : d.size / 2),
                width: d.size,
                ...(d.type === 'wrinkle' ? { height: 2 } : { height: d.size }),
              }}
            />
          ))}
        </div>
      </div>

      {/* Tap counter — staggered entrance */}
      <p className="mt-4 text-sm text-paper-muted font-serif stagger-fade-in stagger-4">
        {t('step2TapCount', { count: tapCount })}
      </p>

      {/* Enough button — min 44x44px touch target */}
      <button
        onClick={handleComplete}
        className="
          mt-6 px-8 py-3 rounded-lg min-h-[44px] min-w-[120px]
          bg-ink-light border border-ink-lighter
          text-paper-muted font-serif text-base
          hover:border-vermillion hover:text-vermillion
          transition-colors duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermillion
        "
        aria-label={t('step2Enough')}
      >
        {t('step2Enough')}
      </button>
    </div>
  );
}
