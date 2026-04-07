'use client';

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import CandleFlame from "@/components/CandleFlame";
import FlickerGlow from "@/components/FlickerGlow";
import FloatingParticles from "@/components/FloatingParticles";

export function HeroSection() {
  const t = useTranslations("landing.hero");

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[85dvh] px-4 py-16 overflow-hidden">
      {/* Background atmospheric effects */}
      <FlickerGlow />
      <FloatingParticles />

      {/* Radial glow behind text */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-vermillion-dark)_0%,_transparent_60%)] opacity-15 pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Candle animation */}
        <div className="mx-auto mb-8" aria-hidden="true">
          <CandleFlame />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-paper font-serif leading-tight mb-6 animate-fade-in-up">
          <span className="text-vermillion">{t("title")}</span>
        </h1>

        <p className="text-paper-muted text-base sm:text-lg mb-10 font-serif leading-relaxed animate-fade-in-up max-w-xl mx-auto" style={{ animationDelay: "0.2s" }}>
          {t("subtitle")}
        </p>

        <Link
          href="/ritual"
          className="inline-flex items-center px-8 py-4 bg-gold text-ink font-serif font-semibold text-lg rounded-sm hover:bg-gold-light transition-colors animate-pulse-glow focus-visible:outline-2 focus-visible:ring-2 focus-visible:ring-gold"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
