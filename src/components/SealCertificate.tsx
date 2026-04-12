'use client';

import { useTranslations } from 'next-intl';

interface SealCertificateProps {
  enemyName?: string;
  enemyCategory?: string;
}

export default function SealCertificate({ enemyName, enemyCategory }: SealCertificateProps) {
  const t = useTranslations('result');

  const today = new Date();
  const expiry = new Date(today);
  expiry.setDate(expiry.getDate() + 7);

  const formatDate = (d: Date) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;

  return (
    <div
      className="
        relative w-full max-w-sm mx-auto
        border-2 border-gold/60 rounded-sm
        bg-ink-light/80
        px-6 py-8 sm:px-8 sm:py-10
        animate-fade-in-up
      "
    >
      {/* Inner border decoration */}
      <div className="absolute inset-2 border border-gold/20 rounded-sm pointer-events-none" />

      {/* Title */}
      <h3 className="text-center text-gold font-serif text-base sm:text-lg font-bold mb-6 tracking-widest">
        {t('certificateTitle')}
      </h3>

      {/* Seal stamp */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-vermillion flex items-center justify-center">
          <span className="text-2xl text-vermillion font-serif font-bold">封</span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 text-center">
        {enemyName && (
          <div>
            <span className="text-xs text-paper-muted font-serif block mb-0.5">
              {t('certificateTarget')}
            </span>
            <span className="text-base text-paper font-serif font-semibold">
              {enemyName}
            </span>
          </div>
        )}

        {enemyCategory && (
          <div>
            <span className="text-xs text-paper-muted font-serif block mb-0.5">
              {t('certificateType')}
            </span>
            <span className="text-sm text-vermillion-light font-serif">
              {enemyCategory}
            </span>
          </div>
        )}

        <div>
          <span className="text-xs text-paper-muted font-serif block mb-0.5">
            {t('certificateSealed')}
          </span>
          <span className="text-sm text-paper font-serif font-mono">
            {formatDate(today)}
          </span>
        </div>

        <div>
          <span className="text-xs text-paper-muted font-serif block mb-0.5">
            {t('certificateExpires')}
          </span>
          <span className="text-sm text-vermillion font-serif font-mono">
            {formatDate(expiry)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-paper-muted/60 font-serif">
        {t('certificateFooter')}
      </p>
    </div>
  );
}
