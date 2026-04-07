import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingContent />;
}

function LandingContent() {
  const t = useTranslations("landing");

  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] px-4 py-16">
      <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-vermillion mb-6 font-serif leading-tight">
          {t("hero")}
        </h1>

        <p className="text-paper-muted text-base sm:text-lg mb-10 font-serif leading-relaxed">
          {t("tagline")}
        </p>

        <Link
          href="/ritual"
          className="inline-flex items-center px-8 py-4 bg-vermillion text-paper font-serif font-semibold text-lg rounded-sm hover:bg-vermillion-dark transition-colors animate-pulse-glow"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
