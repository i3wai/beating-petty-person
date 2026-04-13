'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function BlogCtaBlock() {
  const t = useTranslations('blog.cta');
  return (
    <div className="mt-12 p-8 bg-ink-light border-l-4 border-vermillion rounded-r-lg relative overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-vermillion/5 to-transparent pointer-events-none" />
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <h2 className="text-2xl font-serif font-bold text-vermillion mb-3">
          {t('heading')}
        </h2>
        <p className="text-gray-400 mb-6 text-lg">
          {t('subheading')}
        </p>
        <Link
          href="/ritual"
          className="inline-flex items-center px-8 py-3 bg-vermillion-dark text-paper rounded-lg font-serif font-bold text-lg transition-all duration-200 hover:bg-vermillion hover:scale-105 hover:shadow-lg hover:shadow-vermillion/30"
        >
          {t('button')}
        </Link>
      </div>
    </div>
  );
}
