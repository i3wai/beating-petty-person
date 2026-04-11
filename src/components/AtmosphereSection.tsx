"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function AtmosphereSection() {
  const t = useTranslations("landing.atmosphere");
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleLines(1), 600),
      setTimeout(() => setVisibleLines(2), 1800),
      setTimeout(() => setVisibleLines(3), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const lines = t.raw("lines") as string[];

  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-lg text-center space-y-4">
        {lines.map((line, i) => (
          <p
            key={i}
            className={`text-sm font-mono tracking-wider transition-all duration-700 ${
              i < visibleLines
                ? "text-paper/60 translate-y-0 opacity-100"
                : "text-paper/0 translate-y-2 opacity-0"
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
