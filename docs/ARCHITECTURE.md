# BeatPetty Architecture Map

> Quick reference for Claude sessions — read this instead of scanning the whole codebase.

## Tech Risks

| Risk | Mitigation |
|------|------------|
| Low-end Android Canvas lag | 20fps auto-degradation, CSS-only fallback ready |
| iOS Safari audio needs user gesture | "Click to enter ritual" = AudioContext trigger |
| Vercel free tier 100GB | External image hosting or upgrade |
| Vercel Git auto-deploy silently cancels | Must use CLI `npx vercel --prod --yes` |

## Tech Stack

| Layer | Tech | Version |
|-------|------|---------|
| Framework | Next.js App Router | 16.2.2 |
| Styling | Tailwind CSS (@theme in globals.css, NO tailwind.config.ts) | 4.2.2 |
| i18n | next-intl | 4.9.0 |
| Canvas | Canvas 2D API (ParticleSystem class) | — |
| Audio | Web Audio API synthesis (OscillatorNode + noise buffers) | — |
| State | React useReducer + Context (RitualProvider) | — |
| Deploy | Vercel (CLI deploy `npx vercel --prod --yes`) | — |
| Analytics | GA4 (G-HVR1CTNSQ6) via next/script | — |
| TypeScript | Strict mode | — |

## Directory Structure

```
src/
├── app/
│   ├── globals.css              # ALL custom CSS: @theme vars, component styles, keyframes, reduced-motion
│   ├── layout.tsx               # Root layout (html lang, body wrapper)
│   ├── page.tsx                 # Root redirect (middleware handles locale)
│   └── [locale]/
│       ├── layout.tsx           # Locale layout: fonts (Noto Serif TC, Crimson Text), SEO metadata, Header/Footer, GA4
│       ├── page.tsx             # Landing page: 6 sections composition (server component)
│       ├── pricing/page.tsx     # Pricing page: 4-tier cards + Stripe Checkout (Day 4)
│       ├── result/page.tsx      # Result page: payment verification + enhanced result (Day 4)
│       ├── ritual/page.tsx      # Ritual page wrapper (server component)
│       └── opengraph-image.tsx  # Dynamic OG image (1200×630, dark+vermillion, Day 4)
│
│   └── api/
│       ├── checkout/route.ts    # POST: create Stripe Checkout Session
│       ├── webhook/route.ts     # POST: Stripe webhook signature verification
│       └── verify-session/route.ts # GET: verify payment session status
│
├── components/
│   ├── Header.tsx               # Sticky header + LanguageSwitcher (client)
│   ├── Footer.tsx               # Site footer (server)
│   ├── LanguageSwitcher.tsx     # EN/繁/简 buttons (client)
│   │
│   │  # Landing Page Sections (Day 2) — all client components
│   ├── HeroSection.tsx          # 85dvh hero: CandleFlame + FlickerGlow + FloatingParticles + title + CTA
│   ├── WhatIsSection.tsx        # 打小人 explanation with gradient separator
│   ├── HowItWorksSection.tsx    # 3 steps (✠⚔☢) with icons, responsive grid
│   ├── TrustSection.tsx         # Two trust lines
│   ├── FinalCtaSection.tsx      # Bold headline + vermillion pulsing CTA
│   ├── FooterNote.tsx           # Heritage statement (80% opacity)
│   │
│   │  # Atmospheric Effects (Day 2) — pure CSS animation
│   ├── CandleFlame.tsx          # 3 candles (sm/md/lg) with flame inner/outer, wick, body
│   ├── FlickerGlow.tsx          # 3 glow orbs: primary (center-bottom), secondary (top-right), tertiary (bottom-left)
│   ├── FloatingParticles.tsx    # 10 particles with unique timing, dual animation (float + drift)
│   │
│   │  # Ritual Flow (Day 3) — client components
│   ├── ritual/
│   │   ├── RitualProvider.tsx      # useReducer state machine + Context (7 states)
│   │   ├── RitualOrchestrator.tsx  # Lazy-loads step components, renders by state
│   │   ├── RitualPageClient.tsx    # Client wrapper: IdleScreen + RitualOrchestrator
│   │   ├── InvocationTransition.tsx # 3s candle-lighting transition (CSS animation)
│   │   ├── SealingTransition.tsx   # 3s stamp-slam + rune-flash transition
│   │   ├── silhouettes.ts         # Shared clip-paths for 6 enemy types
│   │   └── steps/
│   │       ├── EnemySelectStep.tsx  # Step 1: 6-card grid + custom name input
│   │       ├── BeatingStep.tsx      # Step 2: Canvas HitSpark + tap counter + timer (30s)
│   │       ├── BurningStep.tsx      # Step 3: Canvas FireFlame/Smoke + paper dissolution (9s)
│   │       └── ResultStep.tsx       # Step 4: Result + Stripe Checkout CTAs
│   │
│   │  # Canvas Engine (Day 1 prep, Day 3 integrated)
│   ├── canvas/
│   │   ├── ParticleSystem.ts       # Canvas 2D engine: object pool (max 80), DPR cap 2, 20fps auto-degrade
│   │   ├── particles.ts            # ParticleType enum + preset configs (HitSpark, FireFlame, Smoke)
│   │   └── useCanvas.ts            # React hook: canvas ref, ResizeObserver, start/stop/emit
│   │
│   │  # Audio Engine (Day 3 rewrite)
│   ├── audio/
│   │   ├── AudioManager.ts         # Singleton: Web Audio API synthesis (7 sounds), 3 volume layers
│   │   └── useAudio.ts             # React hook: init, playAction, playAmbient, stopAmbient, playTransition
│
├── hooks/
│   ├── useHaptic.ts             # Mobile vibration feedback (50ms)
│   └── useReducedMotion.ts      # prefers-reduced-motion detection
│
├── i18n/
│   ├── navigation.ts           # Link, pathnames, redirect exports
│   ├── request.ts              # getRequestConfig for next-intl
│   └── routing.ts              # Locale definitions (en, zh-TW, zh-Hans), localePrefix: 'always'
│
├── lib/
│   └── stripe.ts               # Stripe singleton + plan config (name/seal/full)
│
└── middleware.ts                # next-intl middleware (locale detection, redirect)

messages/
├── en.json                     # English translations
├── zh-TW.json                  # Traditional Chinese (Hong Kong)
└── zh-Hans.json                # Simplified Chinese

docs/
├── ARCHITECTURE.md             # THIS FILE
├── FUTURE_ROADMAP.md           # Business roadmap & analysis
└── ritual-architecture.md      # Ritual flow technical design

memory/
└── MEMORY.md                   # Project-specific mistakes & decisions

public/
├── manifest.json               # PWA manifest (Add to Home Screen)
├── robots.txt                  # Search engine crawling rules
├── sitemap.xml                 # All locale URLs for search engines
└── icons/
    ├── icon-192.png            # PWA icon (封 on dark bg)
    └── icon-512.png            # PWA icon (封 on dark bg)
```

## Ritual State Machine

```
idle → START_RITUAL → invocation → INVOCATION_COMPLETE → select
select → SELECT_ENEMY → beating → BEATING_COMPLETE → burning
burning → BURNING_COMPLETE → sealing → SEALING_COMPLETE → result
result → RESET → idle
```

State shape (`RitualState`):
```typescript
{
  step: 'idle' | 'invocation' | 'select' | 'beating' | 'burning' | 'sealing' | 'result';
  enemy: { category: EnemyCategory; name?: string } | null;
}
```

Actions: `START_RITUAL`, `INVOCATION_COMPLETE`, `SELECT_ENEMY`, `BEATING_COMPLETE`, `BURNING_COMPLETE`, `SEALING_COMPLETE`, `RESET`

## Ritual Flow — Timing & Tech

| Phase | Duration | Visual | Audio | Tech |
|-------|----------|--------|-------|------|
| Invocation | 3s | Candle CSS animation + dark overlay | transition-invocation (sine sweep 200→80Hz) | CSS keyframes |
| Step 1: Select | User-paced | 6-card grid, clip-path silhouettes | action-paper (bandpass noise 120ms) | CSS + React state |
| Step 2: Beating | 30s timer | Canvas HitSpark (8-12/burst), paper degradation | action-beat (highpass noise 80ms) + ambient-drone | Canvas 2D + useCanvas hook |
| Step 3: Burning | 9s auto | Canvas FireFlame (3/120ms) + Smoke (2/250ms), paper dissolution | ambient-wind | Canvas 2D (direct ParticleSystem) |
| Sealing | 3s | Stamp slam + rune flash CSS | transition-sealing (sine sweep 120→60Hz) | CSS keyframes |
| Step 4: Result | User-paced | Result text + payment CTAs | transition-result (lowpass noise) | React + Stripe (Day 4) |

## Shared Silhouettes

`src/components/ritual/silhouettes.ts` — 6 enemy clip-paths used across EnemySelectStep, BeatingStep, BurningStep:

```typescript
type EnemyCategory = 'backstabber' | 'toxicBoss' | 'ex' | 'energyVampire' | 'bully' | 'custom';
```

BeatingStep & BurningStep select clip-path via: `SILHOUETTE_CLIPS[(enemy?.category as EnemyCategory) ?? 'custom'] ?? DEFAULT_CLIP`

## Audio Architecture

**AudioManager.ts** — Singleton, Web Audio API synthesis (no external MP3 files)

| Sound ID | Type | Synthesis | Duration |
|----------|------|-----------|----------|
| ambient-drone | Ambient | 55Hz sawtooth + gain tremolo | Continuous |
| ambient-wind | Ambient | White noise + bandpass filter 800Hz | Continuous |
| action-beat | Action | White noise + highpass filter 2000Hz | 80ms burst |
| action-paper | Action | White noise + bandpass filter 2000Hz | 120ms burst |
| transition-invocation | Transition | Sine sweep 200→80Hz + lowpass | 1.5s |
| transition-sealing | Transition | Sine sweep 120→60Hz + lowpass | 1.5s |
| transition-result | Transition | White noise + lowpass filter 400Hz | 500ms |

Volume layers: ambient 0.3, action 0.6, transition 0.8

**useAudio.ts** — React hook wrapping singleton. Exports: `{ init, playAction, playAmbient, stopAmbient, playTransition, isReady }` + `SOUND_IDS`

**Critical pattern**: useAudio does NOT dispose AudioManager on unmount. Singleton survives across step transitions.

## Canvas Architecture

**ParticleSystem.ts** — Pure Canvas 2D engine
- Object pool: max 80 particles, oldest recycled when full
- DPR: capped at 2 for performance
- Auto-degradation: drops below 20fps → reduces particle count
- Particle types: HitSpark (orange/ember, gravity), FireFlame (red-orange, upward), Smoke (gray, upward, fade)

**useCanvas.ts** — React hook for BeatingStep
- Returns: `{ canvasRef, emit, start, stop }`
- ResizeObserver auto-adjusts canvas size

**BurningStep** — Creates ParticleSystem directly from canvasRef (not useCanvas hook) to avoid timing issues with useEffect deps

## i18n Message Namespaces

```
site          → title, subtitle, description (global)
landing       → hero{title,subtitle,cta}, whatIs{title,description}, howItWorks{title,steps[]},
                 trust{line1,line2}, finalCta{headline,button}, footer{heritage}, cta, learnMore
meta          → title, description, ogTitle, ogDescription
ritual        → ~28 keys: step1–4 titles/subtitles, enemies.{6 types}.name/desc,
                 invocation/sealing text, result text, payment buttons, beginButton, tapCount
pricing       → title, subtitle, free/name/seal/full {name, price, description, features[], cta}
result        → title, paid/free titles/descriptions, share, verifying, startOver, backToHome
common        → comingSoon
```

**Key**: EN and ZH are NOT direct translations — completely different copy with same meaning.

## CSS Architecture (globals.css)

- **Tailwind v4 `@theme` block**: colors (ink/vermillion/gold/paper/ember/smoke), fonts (serif/body), 7 animations
- **Component CSS classes**: `.candle*`, `.candle-flame*`, `.glow-orb*`, `.floating-particle`, `.paper-figure`, `.burning-paper-figure`, `.enemy-card`, `.enemy-silhouette`, `.sealing-*`, `.invocation-*`
- **Keyframes**: flame-flicker-1/2, flame-glow-pulse, particle-float, particle-drift, glow-pulse-1/2/3, paper-tap-pulse, invocation-darken/glow-in/candle-scale, stampSlam, runeFlash
- **`@layer base`**: dark theme (html, body, ::selection, scrollbar)
- **`@media (prefers-reduced-motion: reduce)`**: single block, all components
- **NO tailwind.config.ts** — everything through `@theme` in globals.css

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| ink | #1a1a1a | Background (dark base) |
| ink-light | #2a2a2a | Borders, subtle bg |
| ink-lighter | #3a3a3a | Borders, dividers |
| vermillion | #ef6030 | Primary accent (text, titles, flames) — WCAG AA on #1a1a1a |
| vermillion-dark | #c23616 | CTA button backgrounds (contrasts with text-paper) |
| vermillion-light | #ff7050 | Button hover states, glow effects |
| gold | #d4a843 | Secondary accent (buttons, icons) |
| gold-dark | #b8922e | — |
| gold-light | #e8c46a | Hover states |
| paper | #f5f0e8 | Text color (light on dark) |
| paper-dark | #d8d0c4 | — |
| paper-muted | #a89e90 | Secondary text |
| ember | #ff6b35 | Particle color |
| smoke | #8a8078 | Tertiary text (WCAG AA on #1a1a1a) |
| shadow | #0d0d0d | Deepest dark |

## Component Types

| Pattern | Server | Client |
|---------|--------|--------|
| `async function` + `getTranslations()` | Layout, Page, Footer | — |
| `'use client'` + `useTranslations()` | — | All sections, Header, ritual steps, transitions |
| `'use client'` + no translations | — | CandleFlame, FlickerGlow, FloatingParticles |

## Deployment

- **Primary**: `npx vercel --prod --yes` (CLI direct deploy)
- **Git auto-deploy**: Connected but unreliable — deployments may get canceled silently
- **Always verify**: `curl -s https://beatpetty.com/en | grep "keyword"` after deploy
- **Branch**: `master` (not `main`)
- **Remote**: `https://github.com/i3wai/beating-petty-person.git`

## Page Status

| Page | Status | Route |
|------|--------|-------|
| Landing | **Done (Day 2)** | `/[locale]/` |
| Ritual | **Done (Day 3)** | `/[locale]/ritual` |
| Pricing | **Done (Day 4)** | `/[locale]/pricing` |
| Result | **Done (Day 4)** | `/[locale]/result` |

## Environment Variables

| Var | Purpose | Status |
|-----|---------|--------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 (G-HVR1CTNSQ6) | Set |
| `STRIPE_SECRET_KEY` | Stripe backend (null = routes return 503) | **Not set** |
| `STRIPE_PUBLISHABLE_KEY` | Stripe frontend (not used — Checkout redirect) | Not set |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification | **Not set** |
| `STRIPE_PRICE_ID_NAME` | Price for 打人名 $2.99 | **Not set** |
| `STRIPE_PRICE_ID_SEAL` | Price for 封印詛咒 $4.99 | **Not set** |
| `STRIPE_PRICE_ID_FULL` | Price for 全套 $6.99 | **Not set** |

## Known Technical Debt (Post-MVP)

- OG image alt text is English-only (opengraph-image.tsx alt export overrides layout metadata)
- Web Audio synthesis is functional but crude — Phase 2 can upgrade to recorded samples
- No error boundary around Canvas — if context fails, particles silently skip
- PWA is manifest-only — no service worker (@serwist/next incompatible with Turbopack)
- next-intl `t.raw()` needed for array values — easy to forget when adding new features

## Lighthouse Scores (as of Day 5)

| Category | Score | Notes |
|----------|-------|-------|
| Performance | 67 | Google Fonts render-blocking; CDN improves FCP/LCP |
| Accessibility | 100 | WCAG AA contrast on all elements |
| Best Practices | 100 | — |
| SEO | 92+ | 100 on production (localhost canonical false positive) |
