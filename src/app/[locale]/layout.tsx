import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Serif_TC, Crimson_Text } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "../globals.css";

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-noto-serif-tc",
  display: "swap",
});

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-crimson-text",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const siteUrl = "https://beatpetty.com";
  const localePath = `/${locale}`;
  const canonicalUrl = `${siteUrl}${localePath}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: `%s | BeatPetty`,
    },
    description: t("description"),
    keywords: [
      "打小人",
      "beat petty person",
      "ancient Chinese curse",
      "curse ritual",
      "Chinese folk tradition",
      "Hong Kong ritual",
      "诅咒仪式",
      "詛咒儀式",
      "廣東民間傳統",
      "广东民间传统",
      "鹅颈桥",
      "鵝頸橋",
      "惊蛰",
      "驚蟄",
    ],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteUrl}/en`,
        "zh-TW": `${siteUrl}/zh-TW`,
        "zh-Hans": `${siteUrl}/zh-Hans`,
      },
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: canonicalUrl,
      siteName: "BeatPetty",
      locale: locale === "zh-TW" ? "zh_HK" : locale === "zh-Hans" ? "zh_CN" : "en_US",
      type: "website",
      images: [
        {
          url: `${siteUrl}/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: t("ogTitle"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [`${siteUrl}/${locale}/opengraph-image`],
    },
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "BeatPetty",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return null;
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${notoSerifTC.variable} ${crimsonText.variable}`}
    >
      <body className="font-body antialiased bg-ink text-paper min-h-dvh flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID.trim()}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID.trim()}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
