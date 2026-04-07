"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ locale }: { locale: string }) {
  const t = useTranslations("site");
  const tNav = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-ink-lighter bg-ink/95 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-gold text-xl font-bold font-serif group-hover:text-gold-light transition-colors focus-visible:outline-2 focus-visible:ring-2 focus-visible:ring-gold">
            {t("title")}
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/blog"
            className="font-serif text-sm text-paper-muted hover:text-vermillion transition-colors"
          >
            {tNav("blog")}
          </Link>
          <Link
            href="/ritual"
            className="font-serif text-sm text-paper-muted hover:text-vermillion transition-colors"
          >
            {tNav("ritual")}
          </Link>
        </nav>
        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}
