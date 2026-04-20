'use client';

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";

const BLOG_LINKS: Record<string, string> = {
  en: "/en/blog/what-is-da-siu-yan",
  "zh-TW": "/zh-TW/blog/打小人的歷史",
  "zh-Hans": "/zh-Hans/blog/打小人的歷史",
};

export function WhatIsSection() {
  const t = useTranslations("landing.whatIs");
  const locale = useLocale();

  return (
    <section className="relative px-4 py-16 sm:py-20 overflow-hidden">
      {/* Background image — ritual ground scene */}
      <Image
        src="/images/goose-neck-bridge-ground.jpg"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden="true"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-ink/70 z-[1]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl">
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
