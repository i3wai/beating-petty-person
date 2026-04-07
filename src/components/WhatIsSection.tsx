import { useTranslations } from "next-intl";

export function WhatIsSection() {
  const t = useTranslations("landing.whatIs");

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        {/* Decorative top divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-ink-lighter to-transparent" />
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-serif">
            {t("title")}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-ink-lighter to-transparent" />
        </div>

        <p className="text-paper-muted text-base sm:text-lg font-serif leading-relaxed text-center">
          {t("description")}
        </p>
      </div>
    </section>
  );
}
