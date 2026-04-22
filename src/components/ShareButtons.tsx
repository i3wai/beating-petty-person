'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { encodeShareToken, generateSerial } from '@/lib/shareToken';
import type { EnemyCategory } from '@/components/ritual/silhouettes';

type ShareTier = 'free' | 'reading' | 'completion' | 'full';

interface ShareButtonsProps {
  enemyCategory: string;
  tier: ShareTier;
  locale: string;
  readingTeaser?: string;
}

export default function ShareButtons({ enemyCategory, tier, locale, readingTeaser }: ShareButtonsProps) {
  const t = useTranslations('share');
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);
  const imageBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    setHasNativeShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const serial = useMemo(() => generateSerial(new Date()), []);
  const cat = (['backstabber', 'toxicBoss', 'ex', 'energyVampire', 'bully', 'custom'].includes(enemyCategory)
    ? enemyCategory
    : 'custom') as EnemyCategory;

  const shareUrl = useMemo(() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://beatpetty.com';
    const token = encodeShareToken({
      cat,
      tier,
      serial,
      locale,
      rt: readingTeaser?.slice(0, 80) || undefined,
    });
    return `${siteUrl}/${locale}/shared/${token}`;
  }, [cat, tier, serial, locale, readingTeaser]);

  const cardUrl = useMemo(() => {
    const params = new URLSearchParams({ cat, tier, serial, locale });
    if (readingTeaser) params.set('rt', readingTeaser.slice(0, 80));
    return `/api/share-card?${params}`;
  }, [cat, tier, serial, locale, readingTeaser]);

  const shareText = useMemo(() => {
    try {
      return t(`tiers.${tier}.text`);
    } catch {
      return t('tiers.free.text');
    }
  }, [t, tier]);

  const fetchImage = useCallback(async (): Promise<Blob | null> => {
    if (imageBlobRef.current) return imageBlobRef.current;
    try {
      const res = await fetch(cardUrl);
      if (!res.ok) return null;
      const blob = await res.blob();
      imageBlobRef.current = blob;
      return blob;
    } catch {
      return null;
    }
  }, [cardUrl]);

  const handleWhatsApp = useCallback(async () => {
    // On mobile with native share, send image directly
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      setSharing(true);
      const blob = await fetchImage();
      if (blob && navigator.canShare?.({ files: [new File([blob], 'beatpetty-ritual.png', { type: 'image/png' })] })) {
        const file = new File([blob], 'beatpetty-ritual.png', { type: 'image/png' });
        try {
          await navigator.share({ text: shareText + ' ' + shareUrl, files: [file] });
          setSharing(false);
          return;
        } catch (e: unknown) {
          // User cancelled — stop, don't fall through to wa.me
          if (e instanceof Error && e.name === 'AbortError') {
            setSharing(false);
            return;
          }
        }
      }
      setSharing(false);
    }
    // Fallback: text + URL via wa.me
    let text: string;
    try { text = t(`tiers.${tier}.whatsapp`); } catch { text = t('tiers.free.whatsapp'); }
    window.open(`https://wa.me/?text=${encodeURIComponent(text + shareUrl)}`, '_blank');
  }, [t, tier, shareUrl, shareText, fetchImage]);

  const handleTwitter = useCallback(() => {
    let text: string;
    try { text = t(`tiers.${tier}.twitter`); } catch { text = t('tiers.free.twitter'); }
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
    );
  }, [t, tier, shareUrl]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [shareUrl]);

  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) return;
    setSharing(true);
    const blob = await fetchImage();
    if (blob && navigator.canShare?.({ files: [new File([blob], 'beatpetty-ritual.png', { type: 'image/png' })] })) {
      const file = new File([blob], 'beatpetty-ritual.png', { type: 'image/png' });
      try {
        await navigator.share({ title: 'BeatPetty', text: shareText, url: shareUrl, files: [file] });
        setSharing(false);
        return;
      } catch {}
    }
    // Fallback without image
    try {
      await navigator.share({ title: 'BeatPetty', text: shareText, url: shareUrl });
    } catch {}
    setSharing(false);
  }, [shareText, shareUrl, fetchImage]);

  return (
    <div className="w-full max-w-sm mx-auto mt-8">
      <h3 className="text-lg font-bold text-gold font-serif text-center mb-1">
        {t('sectionTitle')}
      </h3>
      <p className="text-xs text-paper-muted font-serif text-center mb-5">
        {t('sectionSubtitle')}
      </p>

      {/* Share card preview */}
      <div className="mb-5 rounded-sm overflow-hidden border border-gold/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cardUrl}
          alt={t('previewAlt')}
          className="w-full h-auto"
          loading="lazy"
        />
      </div>

      {/* Platform buttons */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          disabled={sharing}
          className="share-btn share-btn-whatsapp"
          aria-label={t('whatsapp')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>{sharing ? '...' : t('whatsapp')}</span>
        </button>

        {/* Twitter/X */}
        <button
          onClick={handleTwitter}
          className="share-btn share-btn-twitter"
          aria-label={t('twitter')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>{t('twitter')}</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="share-btn share-btn-copy"
          aria-label={t('copy')}
        >
          {copied ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          )}
          <span>{copied ? t('copySuccess') : t('copy')}</span>
        </button>

        {/* Native Share (mobile) — sends image file */}
        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            disabled={sharing}
            className="share-btn share-btn-native"
            aria-label={t('nativeShare')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            <span>{sharing ? '...' : t('nativeShare')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
