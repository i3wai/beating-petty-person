"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";

export function FinalCtaSection() {
  const t = useTranslations("landing.finalCta");
  const router = useRouter();

  const handleBeginRitual = useCallback(() => {
    const main = document.getElementById('main-content') || document.body;
    main.classList.add('landing-fade-out');
    setTimeout(() => {
      router.push('/ritual');
    }, 450);
  }, [router]);

  return (
    <section className="relative px-4 py-20 sm:py-28 overflow-hidden bg-ink">
      {/* Background image — burning paper figure */}
      <Image
        src="/hero-v2-wide-3.jpg"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden="true"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/60 to-ink/80 z-[1]" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="text-paper-dark text-xs font-mono tracking-[0.2em] uppercase mb-8 animate-pulse">
          {t("hint")}
        </p>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-paper font-serif leading-tight mb-4">
          {t("headline")}
        </h2>

        <p className="text-paper-muted text-sm font-serif mb-10">
          {t("subtext")}
        </p>

        <button
          onClick={handleBeginRitual}
          className="inline-flex items-center px-10 py-5 bg-vermillion-dark text-paper font-serif font-semibold text-xl rounded-sm hover:bg-vermillion transition-colors animate-pulse-glow focus-visible:outline-2 focus-visible:ring-2 focus-visible:ring-vermillion cursor-pointer"
        >
          {t("button")}
        </button>
      </div>
    </section>
  );
}
