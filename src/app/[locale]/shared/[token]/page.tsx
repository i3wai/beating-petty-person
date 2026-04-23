import { Metadata } from 'next';
import { decodeShareToken } from '@/lib/shareToken';
import SharedRedirect from './SharedRedirect';

interface Props {
  params: Promise<{ token: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token, locale } = await params;
  const data = decodeShareToken(token);

  if (!data) {
    return {
      title: 'BeatPetty — Ancient Chinese Curse Ritual',
      description: 'An ancient Chinese curse ritual. Strike. Burn. What if it works? — 萬一有用呢？',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://beatpetty.com';
  const cardUrl = `${siteUrl}/api/share-card?cat=${encodeURIComponent(data.cat)}&tier=${encodeURIComponent(data.tier)}&serial=${encodeURIComponent(data.serial)}&locale=${encodeURIComponent(locale)}${data.rt ? `&rt=${encodeURIComponent(data.rt)}` : ''}`;

  const titles: Record<string, string> = {
    en: 'I just experienced an ancient Chinese curse ritual',
    'zh-TW': '我剛完成了一個古老的中國詛咒儀式',
    'zh-Hans': '我刚完成了一个古老的中国诅咒仪式',
  };

  return {
    title: titles[locale] || titles.en,
    description: 'BeatPetty — The 300-year-old curse ritual from Hong Kong',
    openGraph: {
      title: titles[locale] || titles.en,
      description: 'BeatPetty — The 300-year-old curse ritual from Hong Kong',
      url: `${siteUrl}/${locale}`,
      siteName: 'BeatPetty',
      type: 'website',
      images: [{ url: cardUrl, width: 1200, height: 630, alt: 'BeatPetty Curse Ritual' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles.en,
      description: 'BeatPetty — The 300-year-old curse ritual from Hong Kong',
      images: [cardUrl],
    },
    robots: { index: false, follow: true },
  };
}

export default async function SharedPage({ params }: Props) {
  const { token, locale } = await params;
  const data = decodeShareToken(token);

  let cardUrl: string | null = null;
  if (data) {
    cardUrl = `/api/share-card?cat=${encodeURIComponent(data.cat)}&tier=${encodeURIComponent(data.tier)}&serial=${encodeURIComponent(data.serial)}&locale=${encodeURIComponent(locale)}${data.rt ? `&rt=${encodeURIComponent(data.rt)}` : ''}`;
  }

  return <SharedRedirect locale={locale} valid={!!data} cardUrl={cardUrl} />;
}
