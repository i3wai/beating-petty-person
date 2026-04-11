"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

function RitualCounter() {
  const t = useTranslations("landing.trust");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const base = 47 + (seed % 38);
    const hourFraction = (today.getHours() * 60 + today.getMinutes()) / 1440;
    const daily = Math.floor(base + hourFraction * 12);
    setCount(daily);
  }, []);

  if (count === 0) return null;

  return (
    <p className="text-vermillion text-base font-serif font-semibold mt-2 animate-pulse">
      {t("counter", { count })}
    </p>
  );
}

export function TrustSection() {
  const t = useTranslations("landing.trust");

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="h-px bg-gradient-to-r from-transparent via-ink-lighter to-transparent mb-8" />

        <p className="text-paper-muted text-sm font-serif italic mb-3 tracking-wide">
          {t("line1")}
        </p>
        <p className="text-paper/80 text-sm font-serif mb-2">
          {t("line2")}
        </p>
        <RitualCounter />
      </div>
    </section>
  );
}
