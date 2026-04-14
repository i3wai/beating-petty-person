'use client';

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import FloatingParticles from "@/components/FloatingParticles";

export function HeroSection() {
  const t = useTranslations("landing.hero");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const handleBeginRitual = useCallback(() => {
    const main = document.getElementById('main-content') || document.body;
    main.classList.add('landing-fade-out');
    setTimeout(() => {
      router.push('/ritual');
    }, 450);
  }, [router]);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[85dvh] px-4 py-16 overflow-hidden bg-ink">
      {/* Cinematic black curtain — fades out to reveal scene */}
      <div className="absolute inset-0 bg-ink z-[20] animate-curtain-lift pointer-events-none" />

      {/* Candle ignite glow — brief warm flash before curtain lifts */}
      <div
        className="absolute bottom-1/4 left-1/2 w-[400px] h-[400px] rounded-full pointer-events-none z-[19] animate-candle-ignite"
        style={{
          background: "radial-gradient(circle, rgba(194, 54, 22, 0.5) 0%, rgba(255, 107, 53, 0.2) 30%, transparent 70%)",
        }}
      />

      {/* Hero background — portrait for mobile, landscape for desktop */}
      <Image
        src="/hero-candidate-1.jpg"
        alt=""
        fill
        className="object-cover object-center sm:hidden animate-hero-image-reveal"
        priority
        sizes="100vw"
        aria-hidden="true"
      />
      <Image
        src="/hero-v2-wide-2.jpg"
        alt=""
        fill
        className="object-cover object-center hidden sm:block animate-hero-image-reveal"
        priority
        sizes="100vw"
        aria-hidden="true"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink/10 z-[1]" />

      {/* Floating embers */}
      <FloatingParticles />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-paper font-serif leading-tight mb-6"
          style={{ animation: 'fade-in-up 0.8s ease-out 1.5s both' }}
        >
          <span className="text-vermillion">{t("title")}</span>
        </h1>

        <p
          className="text-paper-muted text-base sm:text-lg mb-10 font-serif leading-relaxed max-w-xl mx-auto"
          style={{ animation: 'fade-in-up 0.8s ease-out 2.0s both' }}
        >
          {t("subtitle")}
        </p>

        <button
          onClick={handleBeginRitual}
          className="inline-flex items-center px-8 py-4 bg-gold text-ink font-serif font-semibold text-lg rounded-sm hover:bg-gold-light transition-colors focus-visible:outline-2 focus-visible:ring-2 focus-visible:ring-gold cursor-pointer"
          style={{ animation: 'fade-in-up 0.8s ease-out 2.5s both, pulse-glow 2s ease-in-out 3.5s infinite' }}
        >
          {t("cta")}
        </button>

        <p
          className="hidden sm:block mt-6 text-paper-muted/40 text-xs font-serif"
          style={{ animation: 'fade-in-up 0.6s ease-out 2.8s both' }}
        >
          {tCommon("mobileHint")}
        </p>
      </div>
    </section>
  );
}
