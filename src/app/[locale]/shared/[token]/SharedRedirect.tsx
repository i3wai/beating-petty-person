'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function SharedRedirect({ locale, valid }: { locale: string; valid: boolean }) {
  const router = useRouter();
  const t = useTranslations('shared');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!valid) return;
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          router.push(`/${locale}`);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [locale, router, valid]);

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
      <div className="text-center max-w-md animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-gold flex items-center justify-center animate-fade-in-up">
          <span className="text-2xl text-gold font-serif font-bold">成</span>
        </div>

        <h1 className="text-2xl font-bold text-gold font-serif mb-4">
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

        <p className="mt-4 text-paper-muted/40 text-xs font-serif">
          {countdown > 0 ? t('redirecting', { countdown }) : t('redirectingNow')}
        </p>
      </div>
    </div>
  );
}
