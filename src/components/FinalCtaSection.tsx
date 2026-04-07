import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function FinalCtaSection() {
  const t = useTranslations("landing.finalCta");

  return (
    <section className="relative px-4 py-20 sm:py-28">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-vermillion)_0%,_transparent_50%)] opacity-8 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-paper font-serif leading-tight mb-10">
          {t("headline")}
        </h2>

        <Link
          href="/ritual"
          className="inline-flex items-center px-10 py-5 bg-vermillion-dark text-paper font-serif font-semibold text-xl rounded-sm hover:bg-vermillion transition-colors animate-pulse-glow focus-visible:outline-2 focus-visible:ring-2 focus-visible:ring-vermillion"
        >
          {t("button")}
        </Link>
      </div>
    </section>
  );
}
