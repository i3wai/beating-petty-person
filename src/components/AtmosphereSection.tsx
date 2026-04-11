"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function AtmosphereSection() {
  const t = useTranslations("landing.atmosphere");
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleLines(1), 800),
      setTimeout(() => setVisibleLines(2), 2400),
      setTimeout(() => setVisibleLines(3), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const lines = t.raw("lines") as string[];

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-md text-center space-y-3">
        {lines.map((line, i) => (
          <p
            key={i}
            className={`text-xs font-mono tracking-wider transition-all duration-1000 ${
              i < visibleLines
                ? "text-paper-dark/70 opacity-100"
                : "text-paper-dark/0"
            }`}
            aria-hidden={i >= visibleLines}
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
