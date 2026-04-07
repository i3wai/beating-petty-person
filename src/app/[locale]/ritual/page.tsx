import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { RitualProvider } from '@/components/ritual/RitualProvider';
import RitualPageClient from '@/components/ritual/RitualPageClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ritual' });

  return {
    title: t('step1Title') + ' — BeatPetty',
    description: t('step1Subtitle'),
  };
}

export default async function RitualPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <RitualProvider>
      <RitualPageClient />
    </RitualProvider>
  );
}
