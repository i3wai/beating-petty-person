"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations("landing.footer");
  const tCommon = useTranslations("common");

  return (
    <footer className="border-t border-ink-lighter bg-ink">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center">
        <p className="text-paper-muted text-sm font-serif italic">
          {t("heritage")}
        </p>
        <p className="text-smoke text-xs mt-2">
          beatpetty.com
        </p>
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-paper-muted/60 font-serif">
          <Link href="/about" className="hover:text-paper-muted transition-colors">
            {tCommon("aboutLink")}
          </Link>
          <span className="text-ink-lighter">|</span>
          <span>{tCommon("privacyLink")}</span>
          <span className="text-ink-lighter">|</span>
          <span>{tCommon("refundPolicy")}</span>
        </div>
        <p className="text-paper-muted/40 text-xs mt-2 font-serif">
          {tCommon("privacyFull")}
        </p>
      </div>
    </footer>
  );
}
