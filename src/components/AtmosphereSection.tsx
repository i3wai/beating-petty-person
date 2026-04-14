"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export function AtmosphereSection() {
  const t = useTranslations("landing.atmosphere");
  const line = t("line");

  return (
    <section className="relative px-4 py-20 sm:py-28 overflow-hidden">
      {/* Background image — candles + smoke */}
      <Image
        src="/hero-candidate-3.jpg"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden="true"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-ink/60 z-[1]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-lg text-center">
        <p className="text-paper/80 text-lg sm:text-xl font-serif italic leading-relaxed tracking-wide animate-shimmer">
          {line}
        </p>
      </div>
    </section>
  );
}
