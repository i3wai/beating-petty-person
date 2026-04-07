import { useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

export function Footer({ locale }: { locale: string }) {
  const footerText: Record<string, string> = {
    en: "Based on authentic Cantonese folk traditions",
    "zh-TW": "源自正宗廣東民間傳統",
    "zh-Hans": "源自正宗广东民间传统",
  };

  return (
    <footer className="border-t border-ink-lighter bg-ink">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center">
        <p className="text-paper-muted text-sm font-serif italic">
          {footerText[locale] ?? footerText.en}
        </p>
        <p className="text-smoke text-xs mt-2">
          beatpetty.com
        </p>
      </div>
    </footer>
  );
}
