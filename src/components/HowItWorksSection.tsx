import { useTranslations } from "next-intl";

export function HowItWorksSection() {
  const t = useTranslations("landing.howItWorks");

  const steps = [0, 1, 2] as const;
  const stepColors = ["text-vermillion", "text-gold", "text-vermillion"];

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-paper text-2xl sm:text-3xl font-bold font-serif mb-12">
          {t("title")}
        </h2>

        {/* Steps */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-6 items-stretch">
          {steps.map((index) => (
            <div
              key={index}
              className="flex-1 text-center px-4 py-6 border border-ink-lighter rounded-sm"
            >
              {/* Step number */}
              <span
                className={`inline-block text-4xl mb-3 ${stepColors[index]} font-serif`}
                aria-hidden="true"
              >
                {t(`steps.${index}.icon`)}
              </span>

              {/* Step number indicator */}
              <div className={`text-sm font-serif mb-2 ${stepColors[index]}`}>
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Title */}
              <h3 className="text-paper text-lg font-bold font-serif mb-2">
                {t(`steps.${index}.title`)}
              </h3>

              {/* Description */}
              <p className="text-paper-muted text-sm font-serif leading-relaxed">
                {t(`steps.${index}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
