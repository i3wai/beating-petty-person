import { useTranslations } from "next-intl";

const NUMERALS = ['壹', '貳', '參', '肆', '伍', '陸', '柒', '捌'];

export function HowItWorksSection() {
  const t = useTranslations("landing.howItWorks");

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-paper text-2xl sm:text-3xl font-bold font-serif mb-3">
          {t("title")}
        </h2>
        <p className="text-center text-paper-muted text-sm font-serif mb-12 max-w-lg mx-auto leading-relaxed">
          {t("subtitle")}
        </p>

        {/* Phase 1: Free — Destruction (Steps 1-5) */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-vermillion text-xs tracking-[0.2em] uppercase font-serif font-bold whitespace-nowrap">
              {t("freeLabel")}
            </span>
            <div className="flex-1 h-px bg-vermillion/30" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center px-3 py-5 border border-ink-lighter rounded-sm bg-ink/50">
                <div className="text-vermillion text-2xl font-serif mb-1 opacity-80">
                  {NUMERALS[i]}
                </div>
                <div className="text-paper-muted/40 text-[10px] font-serif mb-2">
                  {i + 1}
                </div>
                <h3 className="text-paper text-sm font-bold font-serif mb-1.5">
                  {t(`steps.${i}.title`)}
                </h3>
                <p className="text-paper-muted text-xs font-serif leading-relaxed">
                  {t(`steps.${i}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Paywall divider */}
        <div className="relative my-10 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-ink-lighter/40" />
          </div>
          <div className="relative bg-ink px-5 text-center">
            <p className="text-paper-muted/50 text-xs font-serif italic">
              {t("dividerText")}
            </p>
          </div>
        </div>

        {/* Phase 2: Paid — Completion (Steps 6-8) */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-gold text-xs tracking-[0.2em] uppercase font-serif font-bold whitespace-nowrap">
              {t("paidLabel")}
            </span>
            <div className="flex-1 h-px bg-gold/30" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[5, 6, 7].map((i) => (
              <div key={i} className="text-center px-3 py-5 border border-gold/20 rounded-sm bg-ink/50">
                <div className="text-gold text-2xl font-serif mb-1 opacity-80">
                  {NUMERALS[i]}
                </div>
                <div className="text-paper-muted/40 text-[10px] font-serif mb-2">
                  {i + 1}
                </div>
                <h3 className="text-paper text-sm font-bold font-serif mb-1.5">
                  {t(`steps.${i}.title`)}
                </h3>
                <p className="text-paper-muted text-xs font-serif leading-relaxed">
                  {t(`steps.${i}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
