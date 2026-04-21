'use client';

import { useTranslations } from 'next-intl';

interface CurseCertificateProps {
  enemyName?: string;
  enemyCategory?: string;
  permanent?: boolean;
}

function getLunarDateString(date: Date): string {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches = ['子', '醜', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const stemIdx = (date.getFullYear() - 4) % 10;
  const branchIdx = (date.getFullYear() - 4) % 12;
  return `${stems[stemIdx]}${branches[branchIdx]}年`;
}

function generateSerial(date: Date, name?: string): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  // Simple deterministic hash from name
  let hash = 0;
  const src = name || 'ANON';
  for (let i = 0; i < src.length; i++) {
    hash = ((hash << 5) - hash + src.charCodeAt(i)) | 0;
  }
  const suffix = Math.abs(hash % 10000).toString().padStart(4, '0');
  return `BP-${y}${m}${d}-${suffix}`;
}

export default function CurseCertificate({ enemyName, enemyCategory, permanent }: CurseCertificateProps) {
  const t = useTranslations(permanent ? 'completion' : 'result');
  const tRitual = useTranslations('ritual');

  const today = new Date();
  const expiry = new Date(today);
  expiry.setDate(expiry.getDate() + 7);

  const formatDate = (d: Date) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;

  const lunarYear = getLunarDateString(today);
  const serial = generateSerial(today, enemyName);

  return (
    <div className="certificate-outer animate-fade-in-up">
      {/* Anti-counterfeit watermark */}
      <div className="certificate-watermark" aria-hidden="true" />

      {/* Double gold border */}
      <div className="certificate-border-outer">
        <div className="certificate-border-inner">
          {/* Rice paper texture overlay */}
          <div className="certificate-paper" />

          {/* Title */}
          <h3 className="certificate-title">
            {t('certificateTitle')}
          </h3>

          {/* Seal stamp — 詛 character with seal mud effect */}
          <div className="flex justify-center mb-5">
            <div className="certificate-seal-stamp">
              <span className="certificate-seal-char">詛</span>
            </div>
          </div>

          {/* Divider */}
          <div className="certificate-divider" />

          {/* Details */}
          <div className="certificate-details">
            {enemyName && (
              <div className="certificate-field">
                <span className="certificate-label">
                  {t('certificateTarget')}
                </span>
                <span className="certificate-value-name">
                  {enemyName}
                </span>
              </div>
            )}

            {enemyCategory && (
              <div className="certificate-field">
                <span className="certificate-label">
                  {t('certificateType')}
                </span>
                <span className="certificate-value-type">
                  {enemyCategory === 'custom' ? tRitual('enemies.custom.name') : tRitual(`enemies.${enemyCategory}.name`)}
                </span>
              </div>
            )}

            <div className="certificate-field">
              <span className="certificate-label">
                {t('certificateSealed')}
              </span>
              <span className="certificate-value-date">
                {lunarYear} · {formatDate(today)}
              </span>
            </div>

            <div className="certificate-field">
              <span className="certificate-label">
                {t('certificateExpires')}
              </span>
              <span className="certificate-value-expiry">
                {permanent ? t('certificateEternal') : formatDate(expiry)}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="certificate-divider" />

          {/* Serial number */}
          <p className="certificate-serial">
            {t('certificateSerial')}: {serial}
          </p>

          {/* Official footer */}
          <p className="certificate-official">
            {t('certificateOfficial')}
          </p>

          {/* Description — value proposition */}
          <p className="text-center font-serif text-xs text-paper-muted mt-3 leading-relaxed px-2">
            {t('certificateDescription')}
          </p>
        </div>
      </div>
    </div>
  );
}
