import { ImageResponse } from 'next/og';

export const alt = 'BeatPetty — Ancient Chinese Curse Ritual';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background pattern — radial lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 50% 80%, rgba(194,54,22,0.15) 0%, transparent 60%)',
          }}
        />

        {/* Top border */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, transparent, #c23616, transparent)',
          }}
        />

        {/* Bottom border */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, transparent, #c23616, transparent)',
          }}
        />

        {/* Decorative symbols */}
        <div
          style={{
            fontSize: 28,
            color: '#c23616',
            opacity: 0.4,
            letterSpacing: 32,
            marginBottom: 24,
          }}
        >
          ✠ ⚔ ☢
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: '#f5f0e8',
            letterSpacing: -1,
            lineHeight: 1.1,
          }}
        >
          BeatPetty
        </div>

        {/* Chinese title */}
        <div
          style={{
            fontSize: 40,
            color: '#c23616',
            marginTop: 8,
            fontWeight: 700,
          }}
        >
          打小人
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 2,
            backgroundColor: '#d4a843',
            marginTop: 24,
            marginBottom: 24,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: '#a89e90',
            letterSpacing: 1,
          }}
        >
          The Ancient Chinese Curse Ritual
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 16,
            color: '#4a4a4a',
            marginTop: 16,
          }}
        >
          Strike. Burn. Seal. What if it works?
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            fontSize: 14,
            color: '#d4a843',
            opacity: 0.7,
          }}
        >
          beatpetty.com
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
