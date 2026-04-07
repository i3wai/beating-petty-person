"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const localeLabels: Record<string, string> = {
    en: "EN",
    "zh-TW": "繁",
    "zh-Hans": "简",
  };

  function handleChange(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => handleChange(l)}
          className={`px-2 py-1 text-xs font-serif rounded transition-colors ${
            l === locale
              ? "bg-vermillion text-paper"
              : "text-paper-muted hover:text-paper hover:bg-ink-light"
          }`}
          aria-label={`Switch to ${localeLabels[l]}`}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  );
}
