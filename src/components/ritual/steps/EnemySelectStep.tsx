'use client';

import { useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRitual } from '@/components/ritual/RitualProvider';
import { useAudio, SOUND_IDS } from '@/components/audio/useAudio';
import { ENEMY_CATEGORIES, PAPER_FIGURE_IMAGES, type EnemyCategory } from '@/components/ritual/silhouettes';

export default function EnemySelectStep() {
  const t = useTranslations('ritual');
  const tCommon = useTranslations('common');
  const { dispatch } = useRitual();
  const audio = useAudio();

  const [selected, setSelected] = useState<EnemyCategory | null>(null);
  const [customName, setCustomName] = useState('');

  const handleSelect = useCallback(
    (category: EnemyCategory) => {
      setSelected(category);
      audio.playAction(SOUND_IDS.ACTION_PAPER);
    },
    [audio],
  );

  const handleConfirm = useCallback(() => {
    if (!selected) return;

    dispatch({
      type: 'SELECT_ENEMY',
      payload: {
        category: selected,
        ...(customName.trim() ? { name: customName.trim() } : {}),
      },
    });
  }, [selected, customName, dispatch]);

  return (
    <div className="flex flex-col items-center min-h-[80dvh] px-4 py-8 sm:py-12 pb-24">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-vermillion font-serif mb-2 animate-fade-in">
        {t('step1Title')}
      </h2>
      <p className="text-paper-muted font-serif text-sm sm:text-base mb-8 animate-fade-in">
        {t('step1Subtitle')}
      </p>

      {/* Enemy Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg sm:max-w-2xl">
        {ENEMY_CATEGORIES.map((category) => {
          const isSelected = selected === category;
          const name = t(`enemies.${category}.name`);
          const desc = t(`enemies.${category}.desc`);

          return (
            <button
              key={category}
              onClick={() => handleSelect(category)}
              className={`
                enemy-card
                group relative flex flex-col items-center justify-center
                p-4 sm:p-5 rounded-lg
                bg-ink-light/60 border
                transition-all duration-200 ease-out
                cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermillion
                ${isSelected
                  ? 'border-vermillion scale-[1.04] shadow-[0_0_16px_2px_rgba(194,54,22,0.4)]'
                  : 'border-ink-lighter hover:border-vermillion/50 hover:shadow-[0_0_10px_1px_rgba(194,54,22,0.2)]'
                }
              `}
              aria-pressed={isSelected}
              aria-label={name}
            >
              {/* Paper figure image — skeleton loading state */}
              <div className="relative w-20 h-28 sm:w-16 sm:h-22">
                <div
                  className="skeleton-placeholder absolute inset-0 rounded-lg img-skeleton"
                  aria-hidden="true"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PAPER_FIGURE_IMAGES[category as EnemyCategory]}
                  alt=""
                  className="relative w-full h-full object-cover rounded-lg mb-3 opacity-60 group-hover:opacity-90 transition-opacity"
                  draggable={false}
                  aria-hidden="true"
                  onLoad={(e) => {
                    const el = e.currentTarget.parentElement?.querySelector('.skeleton-placeholder');
                    if (el) el.classList.add('hidden');
                  }}
                />
              </div>

              {/* Name */}
              <span
                className={`
                  text-sm sm:text-base font-serif font-semibold text-center leading-tight
                  transition-colors duration-200
                  ${isSelected ? 'text-vermillion' : 'text-paper group-hover:text-vermillion-light'}
                `}
              >
                {name}
              </span>

              {/* Description */}
              <span className="text-xs sm:text-sm text-paper-muted font-serif text-center mt-1 leading-snug">
                {desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom name input — always visible, optional */}
      <div className="mt-6 w-full max-w-sm animate-fade-in-up">
        <label htmlFor="custom-name" className="block text-sm text-gold font-serif mb-2">
          {t('step1CustomLabel')}
        </label>
        <input
          id="custom-name"
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder={t('step1CustomPlaceholder')}
          maxLength={50}
          className="
            w-full px-4 py-2.5 rounded-lg
            bg-ink-light border border-ink-lighter
            text-paper font-serif text-base
            placeholder:text-paper-muted/50
            focus:border-vermillion focus:outline-none focus:ring-1 focus:ring-vermillion
            transition-colors duration-200
          "
        />
        <p className="mt-2 text-xs text-paper-muted/60 font-serif">
          {tCommon('privacyNote')}
        </p>
      </div>

      {/* Confirm button — sticky footer, visible above keyboard */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-ink/95 backdrop-blur-sm border-t border-ink-lighter/50 py-3 px-4">
        <button
          onClick={handleConfirm}
          disabled={!selected}
          className={`
            w-full max-w-sm mx-auto block px-10 py-3 rounded-lg
            font-serif text-base font-semibold
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
            ${selected
              ? 'bg-gold text-ink hover:bg-gold-light active:bg-gold-dark cursor-pointer'
              : 'bg-ink-lighter text-paper-muted/40 cursor-not-allowed'
            }
          `}
          aria-label={t('step1Confirm')}
        >
          {t('step1Confirm')}
        </button>
      </div>
    </div>
  );
}
