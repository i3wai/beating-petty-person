import { useTranslations } from "next-intl";

export function TrustSection() {
  const t = useTranslations("landing.trust");

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        {/* Subtle divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-ink-lighter to-transparent mb-8" />

        <p className="text-paper-muted text-sm font-serif italic mb-3 tracking-wide">
          {t("line1")}
        </p>
        <p className="text-paper-dark text-xs font-serif">
          {t("line2")}
        </p>
      </div>
    </section>
  );
}
