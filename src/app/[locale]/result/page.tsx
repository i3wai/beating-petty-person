'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface PaymentInfo {
  paid: boolean;
  plan: string;
  enemyCategory: string;
  enemyName: string;
}

type ViewState = 'verifying' | 'paid' | 'free' | 'error';

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

function ResultContent() {
  const t = useTranslations('result');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [state, setState] = useState<ViewState>(sessionId ? 'verifying' : 'free');
  const [payment, setPayment] = useState<PaymentInfo | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/verify-session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.paid) {
          setPayment(data);
          setState('paid');
          try {
            localStorage.setItem('beatpetty_paid', JSON.stringify(data));
          } catch {
            // ignore
          }
        } else {
          setState('free');
        }
      })
      .catch(() => {
        setState('error');
      });
  }, [sessionId]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: t('shareTitle'),
      text: t('shareText'),
      url: 'https://beatpetty.com',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText('https://beatpetty.com');
    }
  }, [t]);

  if (state === 'verifying') {
    return (
      <div className="min-h-[80dvh] flex flex-col items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-paper-muted font-serif">{t('verifying')}</p>
        </div>
      </div>
    );
  }

  if (state === 'error') {
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

  if (state === 'paid' && payment) {
    return (
      <div className="min-h-[80dvh] flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-lg animate-fade-in">
          {/* Seal stamp visual */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-vermillion flex items-center justify-center animate-fade-in-up">
            <span className="text-3xl text-vermillion font-serif font-bold">封</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-vermillion font-serif mb-4">
            {t('paidTitle')}
          </h1>
          <p className="text-lg text-gold font-serif mb-2">
            {t('paidSubtitle')}
          </p>
          <p className="text-paper-muted font-serif leading-relaxed mb-8">
            {payment.enemyName
              ? t('paidDescription', { enemyName: payment.enemyName })
              : t('paidDescriptionNoName')}
          </p>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleShare}
              className="
                px-8 py-3 rounded-sm
                bg-ink-light border border-gold/40 text-gold
                font-serif font-semibold
                hover:border-gold hover:bg-ink-lighter
                transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
              "
            >
              {t('shareTitle')}
            </button>

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

  // Free / no session
  return (
    <div className="min-h-[80dvh] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-lg animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold text-vermillion font-serif mb-4">
          {t('freeTitle')}
        </h1>
        <p className="text-lg text-paper-muted font-serif mb-2">
          {t('freeSubtitle')}
        </p>
        <p className="text-sm text-paper-muted font-serif leading-relaxed mb-8">
          {t('freeDescription')}
        </p>

        <div className="flex flex-col items-center gap-4">
          <Link
            href={`/${locale}/ritual`}
            className="
              px-8 py-3 rounded-sm
              bg-vermillion text-paper font-serif font-semibold
              hover:bg-vermillion-light
              transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermillion
            "
          >
            {t('startOver')}
          </Link>

          <Link
            href={`/${locale}`}
            className="text-sm text-paper-muted/60 font-serif underline underline-offset-4 hover:text-paper-muted transition-colors"
          >
            {t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
