import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'refund' });

  return {
    title: t('title'),
    description: t('intro'),
  };
}

export default async function RefundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'refund' });

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

      {/* Full Refund Guarantee */}
      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-bold text-gold font-serif">
          {t('guaranteeTitle')}
        </h2>
        <p className="text-paper font-serif text-base leading-relaxed">
          {t('guaranteeP1')}
        </p>
      </section>

      {/* How to Request */}
      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-bold text-gold font-serif">
          {t('howTitle')}
        </h2>
        <p className="text-paper font-serif text-base leading-relaxed">
          {t('howP1')}{' '}
          <a
            href="mailto:beatpettyinfo@gmail.com"
            className="text-gold underline underline-offset-4 hover:text-gold-light transition-colors"
          >
            beatpettyinfo@gmail.com
          </a>{' '}
          {t('howP2')}
        </p>
      </section>

      {/* How Refunds Are Processed */}
      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-bold text-gold font-serif">
          {t('processTitle')}
        </h2>
        <p className="text-paper font-serif text-base leading-relaxed">
          {t('processP1')}
        </p>
      </section>

      {/* Digital Content */}
      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-bold text-gold font-serif">
          {t('digitalTitle')}
        </h2>
        <p className="text-paper font-serif text-base leading-relaxed">
          {t('digitalP1')}
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
