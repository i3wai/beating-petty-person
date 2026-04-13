"use client";

import { useTranslations } from "next-intl";

export function TrustSection() {
  const t = useTranslations("landing.trust");

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="h-px bg-gradient-to-r from-transparent via-ink-lighter to-transparent mb-8" />

        <p className="text-paper-muted text-sm font-serif italic mb-3 tracking-wide">
          {t("line1")}
        </p>
        <p className="text-paper/80 text-sm font-serif">
          {t("line2")}
        </p>
      </div>
    </section>
  );
}
