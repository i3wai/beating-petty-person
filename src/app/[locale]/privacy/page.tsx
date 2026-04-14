import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });

  return {
    title: t('title'),
    description: t('intro'),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'privacy' });

  return (
    <div className="min-h-[80dvh] px-4 py-16 sm:py-24 max-w-2xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-paper font-serif text-center mb-2 animate-fade-in-up">
        {t('title')}
      </h1>
      <p className="text-paper-muted/60 text-xs font-serif text-center mb-10">
        {t('lastUpdated')}
      </p>

      <p className="text-paper-muted font-serif text-base leading-relaxed mb-10 animate-fade-in-up">
        {t('intro')}
      </p>

      {/* Information We Collect */}
      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-bold text-gold font-serif">
          {t('infoTitle')}
        </h2>
        <p className="text-paper font-serif text-base leading-relaxed">
          {t('infoP1')}
        </p>
        <p className="text-paper font-serif text-base leading-relaxed">
          {t('infoP2')}
        </p>
        <p className="text-paper font-serif text-base leading-relaxed">
          {t('infoP3')}
        </p>
      </section>

      {/* Cookies */}
      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-bold text-gold font-serif">
          {t('cookiesTitle')}
        </h2>
        <p className="text-paper font-serif text-base leading-relaxed">
          {t('cookiesP1')}
        </p>
      </section>

      {/* Data Sharing */}
      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-bold text-gold font-serif">
          {t('dataTitle')}
        </h2>
        <p className="text-paper font-serif text-base leading-relaxed">
          {t('dataP1')}
        </p>
      </section>

      {/* Your Rights */}
      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-bold text-gold font-serif">
          {t('rightsTitle')}
        </h2>
        <p className="text-paper font-serif text-base leading-relaxed">
          {t('rightsP1')}{' '}
          <a
            href="mailto:beatpettyinfo@gmail.com"
            className="text-gold underline underline-offset-4 hover:text-gold-light transition-colors"
          >
            beatpettyinfo@gmail.com
          </a>.
        </p>
      </section>

      {/* Changes */}
      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-bold text-gold font-serif">
          {t('changesTitle')}
        </h2>
        <p className="text-paper font-serif text-base leading-relaxed">
          {t('changesP1')}
        </p>
      </section>

      {/* Contact */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gold font-serif">
          {t('contactTitle')}
        </h2>
        <p className="text-paper font-serif text-base leading-relaxed">
          {t('contactP1')}{' '}
          <a
            href="mailto:beatpettyinfo@gmail.com"
            className="text-gold underline underline-offset-4 hover:text-gold-light transition-colors"
          >
            beatpettyinfo@gmail.com
          </a>.
        </p>
      </section>
    </div>
  );
}
