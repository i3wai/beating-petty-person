import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

// --- CJK font loading (Google Fonts subset) ---
let cjkFontCache: ArrayBuffer | null = null;

function collectCJKChars(readingTeaser: string): string {
  const fixed = '詛咒解讀儀式圓滿已成是非小人職場感情財運官非打焚完盡萬一有用呢';
  const all = new Set(fixed.split(''));
  readingTeaser.split('').forEach(c => all.add(c));
  return [...all].join('');
}

async function loadCJKFont(chars: string): Promise<ArrayBuffer | null> {
  if (cjkFontCache) return cjkFontCache;
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;900&text=${encodeURIComponent(chars)}`;
    const cssRes = await fetch(cssUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' },
    });
    const css = await cssRes.text();
    const urlMatch = css.match(/src:\s*url\(["']?([^"')]+)["']?\)/);
    if (!urlMatch) return null;
    const fontRes = await fetch(urlMatch[1]);
    cjkFontCache = await fontRes.arrayBuffer();
    return cjkFontCache;
  } catch {
    return null;
  }
}

const COLORS = {
  vermillion: '#ef6030',
  blood: '#a82020',
  ember: '#d44a00',
  gold: '#c9a040',
  goldDim: '#8a7030',
  parchment: '#d8ccb8',
  smoke: '#6a6058',
  ash: '#3a3530',
};

const ENEMY_LABELS: Record<string, Record<string, string>> = {
  en: {
    backstabber: 'THE BACKSTABBER',
    toxicBoss: 'THE TOXIC BOSS',
    ex: 'THE EX',
    energyVampire: 'THE ENERGY VAMPIRE',
    bully: 'THE BULLY',
    custom: 'THE PETTY PERSON',
  },
  'zh-TW': {
    backstabber: '是非小人',
    toxicBoss: '職場小人',
    ex: '感情小人',
    energyVampire: '財運小人',
    bully: '官非小人',
    custom: '小人',
  },
  'zh-Hans': {
    backstabber: '是非小人',
    toxicBoss: '职场小人',
    ex: '感情小人',
    energyVampire: '财运小人',
    bully: '官非小人',
    custom: '小人',
  },
};

const TIER_LABELS: Record<string, Record<string, string>> = {
  en: { reading: 'CURSE READING', completion: 'RITUAL COMPLETED', full: 'RITUAL COMPLETED', free: 'CURSE CAST' },
  'zh-TW': { reading: '詛咒解讀', completion: '儀式圓滿', full: '儀式圓滿', free: '詛咒已成' },
  'zh-Hans': { reading: '诅咒解读', completion: '仪式圆满', full: '仪式圆满', free: '诅咒已成' },
};

const DEFAULT_TEASER: Record<string, string> = {
  en: 'Strike. Burn. What if it works?',
  'zh-TW': '打完。焚盡。萬一有用呢？',
  'zh-Hans': '打完。焚尽。万一有用呢？',
};

let compositedBgSrc: string | null = null;

function getCompositedBg(origin: string): string {
  if (compositedBgSrc) return compositedBgSrc;
  compositedBgSrc = `${origin}/images/share-composited.jpg`;
  return compositedBgSrc;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const cat = searchParams.get('cat') || 'custom';
    const tier = searchParams.get('tier') || 'free';
    const serial = searchParams.get('serial') || 'BP-00000000-0000';
    const locale = searchParams.get('locale') || 'en';
    const readingTeaser = searchParams.get('rt') || '';

    const enemyLabel = ENEMY_LABELS[locale]?.[cat] || ENEMY_LABELS.en[cat] || ENEMY_LABELS.en.custom;
    const tierLabel = TIER_LABELS[locale]?.[tier] || TIER_LABELS.en[tier] || 'BEATPETTY';
    const bgImage = getCompositedBg(request.nextUrl.origin);
    const teaserText = readingTeaser || DEFAULT_TEASER[locale] || DEFAULT_TEASER.en;
    const isZH = locale === 'zh-TW' || locale === 'zh-Hans';
    const cjkFont = await loadCJKFont(collectCJKChars(readingTeaser));

    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: 'flex',
            position: 'relative',
            fontFamily: cjkFont ? '"Noto Serif SC", serif' : 'serif',
          }}
        >
          {/* Pre-composited background (Gemini temple + paper figure + vignette + glow) */}
          <img src={bgImage} width={1200} height={630} style={{ position: 'absolute', inset: 0 }} />

          {/* Text overlay — right half only */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '45%',
              marginLeft: '55%',
              padding: '36px 48px 28px',
              gap: 10,
            }}
          >
            {/* 詛 Seal stamp */}
            <div
              style={{
                width: 130,
                height: 130,
                border: '4px solid ' + COLORS.blood,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 66, color: COLORS.blood, fontWeight: 900 }}>
                {'詛'}
              </span>
            </div>

            {/* Tier label */}
            <div
              style={{
                fontSize: isZH ? 14 : 12,
                color: COLORS.goldDim,
                fontWeight: 700,
                letterSpacing: isZH ? 3 : 5,
              }}
            >
              {tierLabel}
            </div>

            {/* Enemy category */}
            <div
              style={{
                fontSize: isZH ? 38 : 32,
                color: COLORS.vermillion,
                fontWeight: 900,
                letterSpacing: isZH ? 4 : 2,
              }}
            >
              {enemyLabel}
            </div>

            {/* Divider */}
            <div
              style={{
                width: 120,
                height: 1,
                background: 'linear-gradient(90deg, transparent, ' + COLORS.ash + ', transparent)',
                margin: '4px 0',
              }}
            />

            {/* Reading teaser */}
            <div
              style={{
                fontSize: isZH ? 17 : 15,
                color: COLORS.parchment,
                lineHeight: 1.7,
                textAlign: 'center',
                maxWidth: 460,
                opacity: 0.8,
              }}
            >
              {readingTeaser ? ('\u201C' + readingTeaser + '\u201D') : teaserText}
            </div>

            {/* Bottom info */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                marginTop: 'auto',
                paddingTop: 12,
              }}
            >
              <div style={{ fontSize: 10, color: COLORS.smoke, letterSpacing: 2, opacity: 0.7 }}>
                {serial}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 16,
                  color: COLORS.goldDim,
                  fontWeight: 700,
                  letterSpacing: 2,
                  opacity: 0.8,
                }}
              >
                <span style={{ color: COLORS.goldDim, fontSize: 8 }}>{'\u25C6'}</span>
                {'BeatPetty'}
                <span style={{ color: COLORS.blood, fontSize: 8 }}>{'\u25C6'}</span>
              </div>
            </div>
          </div>

          {/* Top border glow */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, transparent, ' + COLORS.ember + ', ' + COLORS.blood + ', ' + COLORS.ember + ', transparent)',
              opacity: 0.5,
            }}
          />
          {/* Bottom border glow */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, transparent, ' + COLORS.ember + ', ' + COLORS.blood + ', ' + COLORS.ember + ', transparent)',
              opacity: 0.5,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: cjkFont ? [{ name: 'Noto Serif SC', data: cjkFont, style: 'normal' as const, weight: 400 }] : [],
        headers: { 'Cache-Control': 'public, s-maxage=604800, max-age=86400' },
      },
    );
  } catch (error) {
    console.error('share-card error:', error);
    return new Response('Error generating image', { status: 500 });
  }
}
