import { useTranslations } from "next-intl";

export function FooterNote() {
  const t = useTranslations("landing.footer");

  return (
    <div className="px-4 py-6">
      <p className="mx-auto max-w-2xl text-center text-paper-muted text-xs font-serif opacity-60 leading-relaxed">
        {t("heritage")}
      </p>
    </div>
  );
}
