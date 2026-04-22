'use client';

import { useTranslations } from 'next-intl';

interface StepHeaderProps {
  labelKey: string;
  purposeKey: string;
}

export default function StepHeader({ labelKey, purposeKey }: StepHeaderProps) {
  const t = useTranslations('ritual');
  return (
    <div className="text-center mb-3 animate-fade-in">
      <div className="text-xs text-gold/70 font-serif tracking-[0.2em] mb-1">
        {t(labelKey)}
      </div>
      <div className="text-sm text-paper-muted/60 font-serif italic">
        {t(purposeKey)}
      </div>
    </div>
  );
}
