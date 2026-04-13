import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'landing.about' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'landing.about' });

  return (
    <div className="min-h-[80dvh] px-4 py-16 sm:py-24 max-w-2xl mx-auto">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-vermillion font-serif text-center mb-4 animate-fade-in-up">
        {t('title')}
      </h1>
      <p className="text-paper-muted font-serif text-base sm:text-lg text-center mb-12 animate-fade-in-up">
        {t('subtitle')}
      </p>

      {/* Story section */}
      <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-bold text-gold font-serif mb-4">
          {t('storyTitle')}
        </h2>
        <p className="text-paper font-serif text-base leading-relaxed">
          {t('storyP1')}
        </p>
        <p className="text-paper font-serif text-base leading-relaxed">
          {t('storyP2')}
        </p>
        <p className="text-paper font-serif text-base leading-relaxed">
          {t('storyP3')}
        </p>
      </section>

      {/* Divider */}
      <div className="my-12 h-px bg-gradient-to-r from-transparent via-ink-lighter to-transparent" />

      {/* Mission section */}
      <section className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-2xl font-bold text-gold font-serif mb-4">
          {t('missionTitle')}
        </h2>
        <p className="text-paper font-serif text-base leading-relaxed">
          {t('missionText')}
        </p>
      </section>

      {/* Decorative seal character */}
      <div className="mt-16 flex justify-center" aria-hidden="true">
        <span className="text-vermillion/20 text-6xl font-serif font-bold select-none">
          打
        </span>
      </div>
    </div>
  );
}
