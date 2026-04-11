"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function FaqSection() {
  const t = useTranslations("landing.faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = t.raw("items") as Array<{ question: string; answer: string }>;

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="h-px bg-gradient-to-r from-transparent via-ink-lighter to-transparent mb-8" />

        <h2 className="text-xl font-serif text-paper mb-8 text-center">
          {t("title")}
        </h2>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="border border-ink-lighter/30 rounded">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left px-4 py-3 flex justify-between items-center gap-4 text-paper-muted hover:text-paper transition-colors"
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-serif">{item.question}</span>
                <span className="text-paper-dark text-xs shrink-0">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <div className="px-4 pb-3 text-paper-dark text-sm leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
