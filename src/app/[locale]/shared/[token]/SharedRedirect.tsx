'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function SharedRedirect({ locale, valid, cardUrl }: { locale: string; valid: boolean; cardUrl: string | null }) {
  const t = useTranslations('shared');

  if (!valid) {
    return (
      <div className="min-h-[80dvh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in">
          <h1 className="text-2xl font-bold text-vermillion font-serif mb-4">
            {t('invalidTitle')}
          </h1>
          <p className="text-paper-muted font-serif mb-6">
            {t('invalidDescription')}
          </p>
          <Link
            href={`/${locale}`}
            className="inline-block px-8 py-3 bg-gold text-ink font-serif font-semibold rounded-sm hover:bg-gold-light transition-colors"
          >
            {t('invalidCta')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80dvh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg animate-fade-in w-full">
        {/* Share card image — large */}
        {cardUrl && (
          <div className="mb-8 rounded-sm overflow-hidden border border-gold/20 shadow-[0_0_40px_rgba(212,168,67,0.2)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cardUrl}
              alt="BeatPetty Curse Ritual"
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gold flex items-center justify-center">
          <span className="text-xl text-gold font-serif font-bold">成</span>
        </div>

        <h1 className="text-2xl font-bold text-gold font-serif mb-3">
          {t('validTitle')}
        </h1>
        <p className="text-paper-muted font-serif mb-8">
          {t('validDescription')}
        </p>

        <Link
          href={`/${locale}`}
          className="inline-block px-10 py-4 bg-gold text-ink font-serif font-semibold text-lg rounded-sm hover:bg-gold-light transition-colors animate-pulse-glow"
        >
          {t('validCta')}
        </Link>
      </div>
    </div>
  );
}
