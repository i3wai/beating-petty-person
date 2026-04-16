'use client';

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";

const BLOG_LINKS: Record<string, string> = {
  en: "/en/blog/what-is-da-siu-yan",
  "zh-TW": "/zh-TW/blog/打小人的歷史",
  "zh-Hans": "/zh-Hans/blog/打小人的歷史",
};

export function WhatIsSection() {
  const t = useTranslations("landing.whatIs");
  const locale = useLocale();

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        {/* Decorative top divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-ink-lighter to-transparent" />
          <h2 className="text-gold text-xs tracking-[0.3em] uppercase font-serif">
            {t("title")}
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-ink-lighter to-transparent" />
        </div>

        <p className="text-paper-muted text-base sm:text-lg font-serif leading-relaxed text-center">
          {t("description")}
        </p>

        <div className="mt-6 text-center">
          <Link
            href={BLOG_LINKS[locale] || BLOG_LINKS["en"]}
            className="text-gold/70 hover:text-gold text-sm font-serif transition-colors duration-300"
          >
            {t("linkText")}
          </Link>
        </div>
      </div>
    </section>
  );
}
