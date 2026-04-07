import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default async function RitualPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RitualContent />;
}

function RitualContent() {
  const t = useTranslations("ritual");

  return (
    <div className="min-h-[80dvh] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold text-vermillion mb-8 font-serif">
          {t("step1Title")}
        </h1>
        <p className="text-paper-muted font-serif">
          {/* Ritual flow will be built here */}
        </p>
      </div>
    </div>
  );
}
