import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const siteUrl = "https://beatpetty.com";
  const canonicalUrl = `${siteUrl}/${locale}/result`;

  return {
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ResultLayout({ children }: Props) {
  return <>{children}</>;
}
