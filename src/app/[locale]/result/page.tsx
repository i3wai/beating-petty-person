'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SealCertificate from '@/components/SealCertificate';

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
    const plan = payment.plan as 'name' | 'seal' | 'full' | '';
    const showReading = plan === 'name' || plan === 'full';
    const showSeal = plan === 'seal' || plan === 'full';

    // Get localized enemy type name for certificate
    const enemyTypeLabel = payment.enemyCategory || '';

    return (
      <div className="min-h-[80dvh] flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-lg animate-fade-in w-full">
          {/* Seal stamp visual — only for seal/full plans */}
          {showSeal && (
            <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-vermillion flex items-center justify-center animate-fade-in-up">
              <span className="text-3xl text-vermillion font-serif font-bold">封</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold text-vermillion font-serif mb-4">
            {showSeal ? t('paidTitle') : t('readingTitle')}
          </h1>
          <p className="text-lg text-gold font-serif mb-2">
            {showSeal ? t('paidSubtitle') : ''}
          </p>
          {showSeal && (
            <p className="text-paper-muted font-serif leading-relaxed mb-8">
              {payment.enemyName
                ? t('paidDescription', { enemyName: payment.enemyName })
                : t('paidDescriptionNoName')}
            </p>
          )}

          {/* Curse Reading display — only for name/full plans */}
          {showReading && (() => {
            try {
              const reading = localStorage.getItem('beatpetty_reading');
              if (!reading) return null;
              return (
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
              );
            } catch {
              return null;
            }
          })()}

          {/* Seal Certificate — only for seal/full plans */}
          {showSeal && (
            <div className="mt-10">
              <SealCertificate
                enemyName={payment.enemyName || undefined}
                enemyCategory={enemyTypeLabel}
              />
            </div>
          )}

          <div className="flex flex-col items-center gap-4 mt-8">
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
