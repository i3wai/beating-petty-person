'use client';

import { useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useRitual } from '@/components/ritual/RitualProvider';
import { generateReading, generateGuidance, resolveTarget } from '@/lib/curseReading';
import type { EnemyCategory } from '@/components/ritual/silhouettes';

export default function PaywallTransition() {
  const t = useTranslations('ritual');
  const locale = useLocale();
  const router = useRouter();
  const { enemy } = useRitual();
  const readingSeedRef = useRef(String(Date.now()));

  const handleViewResults = useCallback(() => {
    try {
      const category = (enemy?.category ?? 'custom') as EnemyCategory;
      const seed = readingSeedRef.current;

      // Save enemy info
      localStorage.setItem('beatpetty_enemy', JSON.stringify({
        category: enemy?.category ?? 'custom',
        name: enemy?.name ?? '',
      }));

      // Save seed for deterministic reading
      localStorage.setItem('beatpetty_seed', seed);

      // Generate and save reading
      const fragments = {
        openings: t.raw(`reading.${category}.openings`),
        impacts: t.raw(`reading.${category}.impacts`),
        timings: t.raw(`reading.${category}.timings`),
        weaknesses: t.raw(`reading.${category}.weaknesses`),
        closings: t.raw(`reading.${category}.closings`),
      };
      const target = resolveTarget(category, enemy?.name, t(`enemies.${category}.name`));
      const reading = generateReading(fragments, target, seed);
      localStorage.setItem('beatpetty_reading', reading);

      // Generate and save guidance
      const guidanceFragments = {
        insights: t.raw(`guidance.${category}.insights`),
        resolutions: t.raw(`guidance.${category}.resolutions`),
        prophecies: t.raw(`guidance.${category}.prophecies`),
      };
      const guidance = generateGuidance(guidanceFragments, target, seed);
      localStorage.setItem('beatpetty_guidance', JSON.stringify(guidance));
    } catch {
      // localStorage or reading generation failed — non-critical
    }

    router.push(`/${locale}/result`);
  }, [enemy, locale, router, t]);

  return (
    <div className="flex flex-col items-center min-h-[80dvh] px-4 py-12 sm:py-16 max-w-lg mx-auto">
      {/* Dark transition background */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-ink via-ink to-ink-light opacity-80" aria-hidden="true" />

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-vermillion font-serif text-center stagger-fade-in stagger-1">
        {t('paywallTitle')}
      </h2>
      <p className="mt-4 text-sm sm:text-base text-paper-muted font-serif text-center max-w-md stagger-fade-in-up stagger-1">
        {t('paywallSubtitle')}
      </p>

      {/* Single CTA */}
      <div className="mt-10 w-full max-w-sm">
        <button
          onClick={handleViewResults}
          className="
            w-full px-6 py-3 rounded-lg stagger-fade-in-up stagger-2
            bg-vermillion text-paper font-serif font-semibold text-base
            hover:bg-vermillion-light active:bg-vermillion-dark
            transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermillion
          "
        >
          {t('paywallFreeButton')}
        </button>
      </div>
    </div>
  );
}
