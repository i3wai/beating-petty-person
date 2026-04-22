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
          className={`px-3 py-2 text-xs font-serif rounded transition-colors focus-visible:outline-2 focus-visible:ring-2 focus-visible:ring-gold min-h-[36px] min-w-[36px] ${
            l === locale
              ? "bg-gold text-ink"
              : "text-white hover:text-paper hover:bg-ink-light"
          }`}
          aria-label={`Switch to ${localeLabels[l]}`}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  );
}
