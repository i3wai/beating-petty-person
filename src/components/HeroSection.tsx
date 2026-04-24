'use client';

import { useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import FloatingParticles from "@/components/FloatingParticles";
import { getAudioManager } from "@/components/audio/AudioManager";

export function HeroSection() {
  const t = useTranslations("landing.hero");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const audioStarted = useRef(false);

  const startLandingAudio = useCallback(() => {
    if (audioStarted.current) return;
    audioStarted.current = true;
    const mgr = getAudioManager();
    mgr.init().then(() => {
      mgr.playAmbient('landing-suspense');
    }).catch(() => {});
  }, []);

  const handleBeginRitual = useCallback(() => {
    getAudioManager().stopAmbient();
    const main = document.getElementById('main-content') || document.body;
    main.classList.add('landing-fade-out');
    setTimeout(() => {
      router.push('/ritual');
    }, 450);
  }, [router]);

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[85dvh] px-4 py-16 overflow-hidden bg-ink"
      onPointerDown={startLandingAudio}
      onKeyDown={startLandingAudio}
    >
      {/* Cinematic black curtain */}
      <div className="absolute inset-0 bg-ink z-[20] animate-curtain-lift pointer-events-none" />

      {/* Candle ignite glow */}
      <div
        className="absolute bottom-1/4 left-1/2 w-[400px] h-[400px] rounded-full pointer-events-none z-[19] animate-candle-ignite"
        style={{
          background: "radial-gradient(circle, rgba(194, 54, 22, 0.5) 0%, rgba(255, 107, 53, 0.2) 30%, transparent 70%)",
        }}
      />

      {/* Mobile hero video — 9:16 portrait, 5s loop */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-candidate-1.jpg"
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover object-center sm:hidden animate-hero-image-reveal"
        aria-hidden="true"
      >
        <source src="/videos/hero-mobile-seamless.mp4" type="video/mp4" />
      </video>

      {/* Desktop hero video — 16:9 landscape, 30s seamless loop */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-v2-wide-2.jpg"
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover object-center hidden sm:block animate-hero-image-reveal"
        aria-hidden="true"
      >
        <source src="/videos/hero-seamless.mp4" type="video/mp4" />
      </video>

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
