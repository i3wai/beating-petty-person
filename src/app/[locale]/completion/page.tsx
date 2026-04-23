'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import CurseCertificate from '@/components/CurseCertificate';
import ShareButtons from '@/components/ShareButtons';
import type { GuidanceResult } from '@/lib/curseReading';

type DivinationResult = 'saint' | 'laugh' | 'anger';

interface StoredData {
  paid: { plan: string; enemyCategory: string; enemyName: string } | null;
  reading: string | null;
  guidance: GuidanceResult | null;
  divination: DivinationResult | null;
  throws: number;
}

function getStoredData(): StoredData {
  try {
    const paidRaw = localStorage.getItem('beatpetty_paid');
    const reading = localStorage.getItem('beatpetty_reading');
    const guidanceRaw = localStorage.getItem('beatpetty_guidance');
    const divination = localStorage.getItem('beatpetty_divination') as DivinationResult | null;
    const divinationThrows = localStorage.getItem('beatpetty_divination_throws');

    const paid = paidRaw ? JSON.parse(paidRaw) : null;
    const guidance: GuidanceResult | null = guidanceRaw ? JSON.parse(guidanceRaw) : null;
    const throws = divinationThrows ? parseInt(divinationThrows, 10) : 1;

    return { paid, reading, guidance, divination, throws };
  } catch {
    return { paid: null, reading: null, guidance: null, divination: null, throws: 1 };
  }
}

export default function CompletionPage() {
  const t = useTranslations('completion');
  const tRitual = useTranslations('ritual');
  const locale = useLocale();

  const [data, setData] = useState<StoredData>({ paid: null, reading: null, guidance: null, divination: null, throws: 1 });

  useEffect(() => {
    setData(getStoredData());
  }, []);

  const { paid, reading, guidance, divination, throws } = data;
  const plan = paid?.plan as string;
  const isFull = plan === 'full';
  const enemyCategory = paid?.enemyCategory || '';
  const enemyName = paid?.enemyName || '';

  const shareTier = plan === 'full' ? 'full' as const : 'completion' as const;
  const readingTeaser = reading?.slice(0, 80) || undefined;

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

        {/* Divination result — always 聖杯 for paid users */}
        {divination && (
          <div className="mt-8 px-6 py-6 bg-ink-light border border-gold/30 rounded-sm max-w-md mx-auto text-center animate-fade-in-up">
            <h2 className="text-lg font-bold text-gold font-serif mb-3">
              {t('divinationTitle')}
            </h2>
            <div className="flex justify-center mb-4">
              <span className="text-4xl font-serif font-bold text-gold">聖杯</span>
            </div>
            <p className="text-paper font-serif text-base leading-relaxed">
              {t('divinationSaint')}
            </p>
            {throws > 1 && (
              <p className="mt-4 text-sm text-gold/70 font-serif italic">
                {t('divinationThrows', { count: throws })}
              </p>
            )}
            <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent my-4" />
            <p className="text-xs text-paper-muted font-serif italic leading-relaxed">
              {t('divinationContext')}
            </p>
          </div>
        )}

        {/* Ritual summary */}
        <div className="mt-6 px-6 py-5 bg-ink-light/50 border border-gold/15 rounded-sm max-w-md mx-auto text-center animate-fade-in-up">
          <h3 className="text-sm font-bold text-gold/80 font-serif uppercase tracking-widest mb-3">
            {t('ritualSummaryTitle')}
          </h3>
          <p className="text-sm text-paper-muted font-serif leading-relaxed">
            {t('ritualSummary')}
          </p>
        </div>

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
              enemyCategory={enemyCategory}
              permanent
            />
          </div>
        )}

        {/* Share + Start Over */}
        <ShareButtons
          enemyCategory={enemyCategory}
          tier={shareTier}
          locale={locale}
          readingTeaser={readingTeaser}
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
