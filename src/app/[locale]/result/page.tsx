'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import CurseCertificate from '@/components/CurseCertificate';
import ShareButtons from '@/components/ShareButtons';
import type { GuidanceResult } from '@/lib/curseReading';
import type { PlanType } from '@/lib/stripe';

interface PaymentInfo {
  paid: boolean;
  plan: string;
  enemyCategory: string;
  enemyName: string;
}

type ViewState = 'verifying' | 'free' | 'reading' | 'completion' | 'full' | 'error';

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80dvh] flex flex-col items-center justify-center px-4">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}

function getStoredData() {
  try {
    const enemyRaw = localStorage.getItem('beatpetty_enemy');
    const reading = localStorage.getItem('beatpetty_reading');
    const guidanceRaw = localStorage.getItem('beatpetty_guidance');
    const enemy = enemyRaw ? JSON.parse(enemyRaw) : null;
    const guidance: GuidanceResult | null = guidanceRaw ? JSON.parse(guidanceRaw) : null;
    return { enemy, reading, guidance };
  } catch {
    return { enemy: null, reading: null, guidance: null };
  }
}

function ResultContent() {
  const t = useTranslations('result');
  const tRitual = useTranslations('ritual');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [view, setView] = useState<ViewState>(sessionId ? 'verifying' : 'free');
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<PlanType | null>(null);
  const [checkoutError, setCheckoutError] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/verify-session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.paid) {
          setPayment(data);
          try {
            localStorage.setItem('beatpetty_paid', JSON.stringify(data));
          } catch {}

          const plan = data.plan as string;
          if (plan === 'name') setView('reading');
          else if (plan === 'seal') setView('completion');
          else if (plan === 'full') setView('full');
          else setView('free');
        } else {
          setView('free');
        }
      })
      .catch(() => setView('error'));
  }, [sessionId]);

  const handleCheckout = useCallback(async (plan: PlanType) => {
    setCheckoutLoading(plan);
    setCheckoutError(false);

    const { enemy } = getStoredData();

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          enemyCategory: enemy?.category,
          enemyName: enemy?.name,
          locale,
        }),
      });

      if (!res.ok) throw new Error('Checkout failed');

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setCheckoutError(true);
      setCheckoutLoading(null);
    }
  }, [locale]);

  const handleContinue = useCallback(() => {
    router.push(`/${locale}/ritual?continue=true`);
  }, [locale, router]);

  // --- Verifying ---
  if (view === 'verifying') {
    return (
      <div className="min-h-[80dvh] flex flex-col items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-paper-muted font-serif">{t('verifying')}</p>
        </div>
      </div>
    );
  }

  // --- Error ---
  if (view === 'error') {
    return (
      <div className="min-h-[80dvh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in">
          <h1 className="text-2xl font-bold text-vermillion font-serif mb-4">
            {t('title')}
          </h1>
          <p className="text-paper-muted font-serif">{t('verificationFailed')}</p>
          <Link
            href={`/${locale}`}
            className="mt-6 inline-block text-gold font-serif underline underline-offset-4 hover:text-gold-light"
          >
            {t('backToHome')}
          </Link>
        </div>
      </div>
    );
  }

  // --- $4.99 / $6.99 Continue ---
  if (view === 'completion' || view === 'full') {
    const isFull = view === 'full';

    return (
      <div className="min-h-[80dvh] flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-lg animate-fade-in w-full">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-gold flex items-center justify-center animate-fade-in-up">
            <span className="text-2xl text-gold font-serif font-bold">續</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-vermillion font-serif mb-4">
            {t('continueTitle')}
          </h1>
          <p className="text-paper-muted font-serif leading-relaxed mb-8 max-w-md mx-auto">
            {isFull ? t('continueDescriptionFull') : t('continueDescriptionSeal')}
          </p>

          <button
            onClick={handleContinue}
            className="
              px-10 py-4 rounded-sm
              bg-gold text-ink font-serif font-semibold text-lg
              hover:bg-gold-light transition-colors
              animate-pulse-glow
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
            "
          >
            {t('continueButton')}
          </button>
        </div>
      </div>
    );
  }

  // --- $2.99 Reading ---
  if (view === 'reading' && payment) {
    const { reading, guidance } = getStoredData();
    const enemyTypeLabel = payment.enemyCategory || '';

    return (
      <div className="min-h-[80dvh] flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-lg animate-fade-in w-full">
          <h1 className="text-3xl sm:text-4xl font-bold text-vermillion font-serif mb-4">
            {t('readingTitle')}
          </h1>

          {reading && (
            <div className="mt-8 px-6 py-6 bg-ink-light border border-gold/30 rounded-sm max-w-md mx-auto text-left animate-fade-in-up">
              <h2 className="text-lg font-bold text-gold font-serif mb-4 text-center">
                {t('readingTitle')}
              </h2>
              {reading.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-paper-muted font-serif text-sm leading-relaxed mb-3 last:mb-0 italic">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {guidance && (
            <div className="mt-6 px-6 py-6 bg-ink/80 border border-gold/20 rounded-sm max-w-md mx-auto text-left animate-fade-in-up">
              <h2 className="text-lg font-bold text-gold/90 font-serif mb-5 text-center tracking-wide">
                {t('guidanceTitle')}
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gold/50 font-serif uppercase tracking-widest mb-1.5">
                    {t('guidanceInsight')}
                  </p>
                  <p className="text-paper-muted font-serif text-sm leading-relaxed italic">
                    {guidance.insight}
                  </p>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                <div>
                  <p className="text-xs text-gold/50 font-serif uppercase tracking-widest mb-1.5">
                    {t('guidanceResolution')}
                  </p>
                  <p className="text-paper-muted font-serif text-sm leading-relaxed italic">
                    {guidance.resolution}
                  </p>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                <div>
                  <p className="text-xs text-gold/50 font-serif uppercase tracking-widest mb-1.5">
                    {t('guidanceProphecy')}
                  </p>
                  <p className="text-paper-muted font-serif text-sm leading-relaxed italic">
                    {guidance.prophecy}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10">
            <CurseCertificate
              enemyName={payment.enemyName || undefined}
              enemyCategory={enemyTypeLabel}
            />
          </div>

          <ShareButtons
            enemyCategory={enemyTypeLabel}
            tier="reading"
            locale={locale}
            readingTeaser={reading?.slice(0, 80) || undefined}
          />

          <div className="flex flex-col items-center gap-4 mt-4">
            <Link
              href={`/${locale}/ritual`}
              className="text-sm text-paper-muted/60 font-serif underline underline-offset-4 hover:text-paper-muted transition-colors"
            >
              {t('startOver')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Free View ---
  const { reading } = getStoredData();

  return (
    <div className="min-h-[80dvh] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-lg animate-fade-in w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-vermillion font-serif mb-4">
          {t('freeTitle')}
        </h1>
        <p className="text-lg text-paper-muted font-serif mb-2">
          {t('freeSubtitle')}
        </p>
        <p className="text-sm text-paper-muted font-serif leading-relaxed mb-8">
          {t('freeDescription')}
        </p>

        {/* Blurred reading preview */}
        {reading && (
          <div className="mb-8 px-4 py-4 bg-ink-light border border-ink-lighter rounded-lg relative overflow-hidden animate-fade-in-up">
            <p className="text-xs text-gold/60 font-serif mb-2 text-center">
              {tRitual('reading.title')}
            </p>
            {reading.split('\n\n').map((paragraph, i) => (
              <p
                key={i}
                className={`text-sm text-paper-muted font-serif italic leading-relaxed mb-2 select-none ${
                  i === 0 ? '' : 'blur-[8px]'
                }`}
              >
                {paragraph}
              </p>
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gold font-serif text-sm">
                {tRitual('readingPreviewBlur')}
              </span>
            </div>
          </div>
        )}

        {checkoutError && (
          <p className="text-sm text-vermillion font-serif text-center mb-4">
            {tRitual('resultCheckoutError')}
          </p>
        )}

        {/* 3 Pricing buttons */}
        <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
          <button
            onClick={() => handleCheckout('name')}
            disabled={checkoutLoading !== null}
            className="
              w-full px-6 py-3 rounded-lg
              bg-vermillion text-paper font-serif font-semibold text-base
              hover:bg-vermillion-light active:bg-vermillion-dark
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermillion
            "
          >
            {checkoutLoading === 'name' ? '...' : tRitual('resultNameButton')}
          </button>

          <button
            onClick={() => handleCheckout('seal')}
            disabled={checkoutLoading !== null}
            className="
              w-full px-6 py-3 rounded-lg
              bg-ink-light border border-gold/40 text-gold
              font-serif font-semibold text-base
              hover:border-gold hover:bg-ink-lighter
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
            "
          >
            {checkoutLoading === 'seal' ? '...' : tRitual('resultSealButton')}
          </button>

          <button
            onClick={() => handleCheckout('full')}
            disabled={checkoutLoading !== null}
            className="
              w-full px-6 py-4 rounded-lg
              bg-gold text-ink font-serif font-bold text-lg
              hover:bg-gold-light
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
              relative
              shadow-[0_0_20px_rgba(212,168,67,0.3)]
              hover:shadow-[0_0_30px_rgba(212,168,67,0.5)]
            "
          >
            {checkoutLoading === 'full' ? '...' : tRitual('resultFullButton')}
            <span className="absolute -top-2 -right-2 text-[10px] bg-vermillion text-paper px-1.5 py-0.5 rounded-sm font-serif font-bold">
              {tRitual('resultBestValue')}
            </span>
          </button>
        </div>

        {/* Stripe trust badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-paper-muted/50 animate-fade-in-up">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-7.076-2.268l-.917 5.576C5.018 23.025 7.734 24 11.386 24c2.65 0 4.795-.637 6.335-1.844 1.655-1.284 2.537-3.187 2.537-5.735 0-4.128-2.524-5.853-6.682-7.271H13.976z" fill="currentColor"/>
          </svg>
          <span className="text-xs font-serif">Secure payment by Stripe</span>
        </div>

        <div className="flex flex-col items-center gap-4 mt-6">
          <Link
            href={`/${locale}/ritual`}
            className="text-sm text-paper-muted/60 font-serif underline underline-offset-4 hover:text-paper-muted transition-colors"
          >
            {t('startOver')}
          </Link>
        </div>
      </div>
    </div>
  );
}
