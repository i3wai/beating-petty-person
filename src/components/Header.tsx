"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ locale }: { locale: string }) {
  const t = useTranslations("site");

  return (
    <header className="sticky top-0 z-50 border-b border-ink-lighter bg-ink/95 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-vermillion text-xl font-bold font-serif group-hover:text-vermillion-light transition-colors">
            {t("title")}
          </span>
        </Link>
        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}
