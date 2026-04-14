import { useTranslations } from "next-intl";
import Image from "next/image";

export function HowItWorksSection() {
  const t = useTranslations("landing.howItWorks");

  const steps = [
    { index: 0, image: "/step-choose.jpg", color: "text-vermillion" },
    { index: 1, image: "/step-strike.jpg", color: "text-gold" },
    { index: 2, image: "/step-burn.jpg", color: "text-vermillion" },
  ] as const;

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-paper text-2xl sm:text-3xl font-bold font-serif mb-12">
          {t("title")}
        </h2>

        <div className="flex flex-col md:flex-row gap-8 md:gap-6 items-stretch">
          {steps.map(({ index, image, color }) => (
            <div
              key={index}
              className="flex-1 text-center px-4 py-6 border border-ink-lighter rounded-sm bg-ink/50"
            >
              {/* Step image */}
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border border-ink-lighter">
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                  aria-hidden="true"
                />
              </div>

              {/* Step number */}
              <div className={`text-sm font-serif mb-2 ${color}`}>
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="text-paper text-lg font-bold font-serif mb-2">
                {t(`steps.${index}.title`)}
              </h3>

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
