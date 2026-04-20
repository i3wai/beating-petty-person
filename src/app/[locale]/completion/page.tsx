'use client';

import { useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import CurseCertificate from '@/components/CurseCertificate';
import type { GuidanceResult } from '@/lib/curseReading';

type DivinationResult = 'saint' | 'laugh' | 'anger';

function getStoredData() {
  try {
    const paidRaw = localStorage.getItem('beatpetty_paid');
    const reading = localStorage.getItem('beatpetty_reading');
    const guidanceRaw = localStorage.getItem('beatpetty_guidance');
    const divination = localStorage.getItem('beatpetty_divination') as DivinationResult | null;

    const paid = paidRaw ? JSON.parse(paidRaw) : null;
    const guidance: GuidanceResult | null = guidanceRaw ? JSON.parse(guidanceRaw) : null;

    return { paid, reading, guidance, divination };
  } catch {
    return { paid: null, reading: null, guidance: null, divination: null };
  }
}

export default function CompletionPage() {
  const t = useTranslations('completion');
  const tRitual = useTranslations('ritual');
  const locale = useLocale();

  const { paid, reading, guidance, divination } = getStoredData();
  const plan = paid?.plan as string;
  const isFull = plan === 'full';
  const enemyTypeLabel = paid?.enemyCategory || '';
  const enemyName = paid?.enemyName || '';

  const handleShare = useCallback(async () => {
    const shareData = {
      title: t('shareTitle'),
      text: t('shareText'),
      url: `https://beatpetty.com/${locale}`,
    };

    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      await navigator.clipboard.writeText(`https://beatpetty.com/${locale}`);
    }
  }, [t, locale]);

  return (
    <div className="min-h-[80dvh] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-lg animate-fade-in w-full">
        {/* Completion stamp */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-vermillion flex items-center justify-center animate-fade-in-up">
          <span className="text-3xl text-vermillion font-serif font-bold">成</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-vermillion font-serif mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-gold font-serif mb-2">
          {t('subtitle')}
        </p>

        {/* Divination result */}
        {divination && (
          <div className="mt-8 px-6 py-6 bg-ink-light border border-gold/30 rounded-sm max-w-md mx-auto text-center animate-fade-in-up">
            <h2 className="text-lg font-bold text-gold font-serif mb-3">
              {t('divinationTitle')}
            </h2>
            <p className={`text-xl font-serif font-bold ${
              divination === 'saint' ? 'text-gold' :
              divination === 'laugh' ? 'text-gray-400' :
              'text-vermillion'
            }`}>
              {tRitual(`divination.${divination}`)}
            </p>
            {divination === 'saint' && (
              <p className="mt-2 text-sm text-paper-muted font-serif italic">
                {tRitual('divination.saint')}
              </p>
            )}
          </div>
        )}

        {/* Full reading — only for $6.99 (full plan) */}
        {isFull && reading && (
          <>
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
          </>
        )}

        {/* Certificate — only for $6.99 (full plan), permanent */}
        {isFull && (
          <div className="mt-10">
            <CurseCertificate
              enemyName={enemyName || undefined}
              enemyCategory={enemyTypeLabel}
              permanent
            />
          </div>
        )}

        {/* Share + Start Over */}
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
