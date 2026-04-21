# BeatPetty Architecture Map

> Quick reference for Claude sessions — read this instead of scanning the whole codebase.
> Last updated: 2026-04-20

## Tech Risks

| Risk | Mitigation |
|------|------------|
| Low-end Android Canvas lag | 20fps auto-degradation, CSS-only fallback ready |
| iOS Safari audio needs user gesture | "Click to enter ritual" = AudioContext trigger |
| Vercel free tier 100GB | External image hosting or upgrade |
| Vercel Git auto-deploy silently cancels | Must use CLI `npx vercel --prod --yes` |
| Paid users skip steps 6-8 (Stripe redirect) | ✅ Fixed — localStorage persistence + `/ritual?continue=true` flow |

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
│       ├── about/page.tsx       # About page: founder story + cultural mission
│       ├── pricing/page.tsx     # Pricing page: 4-tier cards + Stripe Checkout
│       ├── result/page.tsx      # Result page: 4 views (free/reading/completion/full) + 3 pricing buttons
│       ├── completion/page.tsx  # Completion page: divination result + full reading ($6.99 grand finale)
│       ├── ritual/page.tsx      # Ritual page wrapper (server component) + ?continue=true support
│       └── opengraph-image.tsx  # Dynamic OG image (1200x630, dark+vermillion)
│
│   └── api/
│       ├── checkout/route.ts    # POST: create Stripe Checkout Session
│       ├── webhook/route.ts     # POST: Stripe webhook signature verification
│       └── verify-session/route.ts # GET: verify payment session status
│
├── components/
│   ├── Header.tsx               # Sticky header + LanguageSwitcher (client)
│   ├── Footer.tsx               # Site footer: privacy/refund policy, About link (server)
│   ├── LanguageSwitcher.tsx     # EN/繁/简 buttons (client)
│   │
│   │  # Landing Page Sections — all client components
│   ├── HeroSection.tsx          # 85dvh hero: CandleFlame + FlickerGlow + FloatingParticles + title + CTA
│   ├── WhatIsSection.tsx        # 打小人 explanation with dark atmospheric bg (goose-neck-bridge-ground.jpg + overlay)
│   ├── HowItWorksSection.tsx    # 8-step 八部曲 grid: Chinese numerals (壹-捌) + Arabic step numbers (1-8), free/paid phases
│   ├── TrustSection.tsx         # Honest heritage messaging (no fake counters)
│   ├── FinalCtaSection.tsx      # Bold headline + vermillion pulsing CTA
│   ├── FooterNote.tsx           # Heritage statement — NOT rendered on landing page
│   │
│   │  # Atmospheric Effects — pure CSS animation
│   ├── CandleFlame.tsx          # 3 candles (sm/md/lg) with flame inner/outer, wick, body
│   ├── FlickerGlow.tsx          # 3 glow orbs: primary (center-bottom), secondary (top-right), tertiary (bottom-left)
│   ├── FloatingParticles.tsx    # 10 particles with unique timing, dual animation (float + drift)
│   │
│   │  # Ritual Flow — traditional 8-step (八部曲)
│   ├── ritual/
│   │   ├── RitualProvider.tsx      # useReducer state machine + Context (10 states, 10 actions) + initialState prop for continue flow
│   │   ├── RitualOrchestrator.tsx  # Lazy-loads step components, renders by state
│   │   ├── RitualPageClient.tsx    # Client wrapper: reads ?continue=true, sets up RitualProvider, IdleScreen + RitualOrchestrator
│   │   ├── InvocationTransition.tsx # Step 1: 6s candle-lighting transition + focus trap
│   │   ├── FirePassTransition.tsx  # Step 3: Passive 3s paper-over-AI-flames animation + paper figure (PNG)
│   │   ├── PaywallTransition.tsx   # Payment wall: saves to localStorage + navigates to /result
│   │   ├── silhouettes.ts         # Shared clip-paths + paper figure images for 6 enemy types
│   │   └── steps/
│   │       ├── EnemySelectStep.tsx  # Step 2: 6-card grid + name input + shimmer loading + sticky confirm
│   │       ├── BeatingStep.tsx      # Step 4: Rage meter + slipper cursor + curse chants + Canvas HitSpark + aria-live milestones + keyboard + haptic escalation + responsive area + name char-by-char
│   │       ├── BurningStep.tsx      # Step 5: AI-generated white tiger background + long-press ignite + Canvas FireFlame/Smoke + CSS fire + paper dissolution (rises toward tiger) + keyboard a11y
│   │       ├── PurificationStep.tsx # Step 6: AI bg + tap-to-scatter (min 7 taps, auto 10s) + warmth ring + enemy cleanse text
│   │       ├── BlessingStep.tsx     # Step 7: 7.5s cinematic (AI bg + slow zoom + 18 gold sparks + enemy seal) + ambient drone
│   │       └── DivinationStep.tsx   # Step 8: AI bg + poe blocks + 3-throw mechanic (paid) + result sounds/images + Cast Again / Continue → /completion
│   │
│   │  # Canvas Engine
│   ├── canvas/
│   │   ├── ParticleSystem.ts       # Canvas 2D engine: object pool (max 80), DPR cap 2, 20fps auto-degrade
│   │   ├── particles.ts            # ParticleType enum + preset configs (HitSpark, FireFlame, Smoke)
│   │   └── useCanvas.ts            # React hook: canvas ref, ResizeObserver, start/stop/emit
│   │
│   │  # Audio Engine — Web Audio API synthesis (no MP3 files)
│   ├── audio/
│   │   ├── AudioManager.ts         # Singleton: 12 sounds, 3 volume layers
│   │   └── useAudio.ts             # React hook: init, playAction, playAmbient, stopAmbient, playTransition
│   │
│   │  # Shared
│   ├── CurseCertificate.tsx        # Digital curse certificate (stamp: 詛), supports permanent mode for $6.99
│
├── hooks/
│   ├── useHaptic.ts             # Mobile vibration feedback
│   └── useReducedMotion.ts      # prefers-reduced-motion detection
│
├── i18n/
│   ├── navigation.ts           # Link, pathnames, redirect exports
│   ├── request.ts              # getRequestConfig for next-intl
│   └── routing.ts              # Locale definitions (en, zh-TW, zh-Hans), localePrefix: 'always'
│
├── lib/
│   ├── stripe.ts               # Stripe singleton + plan config (name/seal/full)
│   ├── content.ts              # PostMeta interface, blog helpers (getPostsByCluster, getRelatedPosts)
│   ├── json-ld.ts              # JSON-LD generators (Organization, Article, FAQPage, etc.)
│   └── curseReading.ts         # Deterministic modular curse reading generator (~945 combinations) + Oracle guidance (54 fragments)
│
├── mdx-components.tsx          # MDX component registry (BlogCtaBlock, etc.)
└── middleware.ts                # next-intl middleware (locale detection, redirect)

messages/
├── en.json                     # English translations
├── zh-TW.json                  # Traditional Chinese (Hong Kong)
└── zh-Hans.json                # Simplified Chinese

docs/
├── ARCHITECTURE.md             # THIS FILE
├── BLOG_SEO_STANDARD.md        # Blog writing standard (read before writing any blog)
├── blog-seo-master.md          # Blog SEO master strategy (EN + ZH, consolidated)
├── FUTURE_ROADMAP.md           # Business roadmap & analysis
├── ritual-redesign.md          # Ritual redesign decisions + implementation plan (COMPLETE)
├── ritual-process-hk.md        # Traditional Hong Kong 8-step process reference
├── ritual-name-redesign.md     # Curse Reading system design ($2.99 tier, completed)

public/
├── manifest.json               # PWA manifest (Add to Home Screen)
├── robots.txt                  # Search engine crawling rules
├── sitemap.xml                 # All locale URLs for search engines
├── icons/
│   ├── icon-192.png            # PWA icon
│   └── icon-512.png            # PWA icon
└── images/
    ├── white-tiger-ground.jpg  # AI-generated: spectral white tiger, dark atmospheric scene (BurningStep bg)
    ├── fire-pass-flames.jpg    # AI-generated: ritual flames at bottom, dark smoke above (FirePassTransition bg)
    ├── purification-ground.jpg # AI-generated: dark stone surface, rice/beans, candlelight (PurificationStep bg)
    ├── blessing-gold.jpg       # AI-generated: gold ingots, golden flames, red paper offerings (BlessingStep bg)
    ├── divination-ground.jpg   # AI-generated: dark temple floor, poe blocks, candlelight (DivinationStep bg)
    ├── result-saint.jpg        # AI-generated: golden temple light, red lanterns (saint result reveal)
    ├── result-laugh.jpg        # AI-generated: thick incense smoke, ambiguous (laugh result reveal)
    ├── result-anger.jpg        # AI-generated: broken incense, extinguished candles (anger result reveal)
    └── paper-figures/          # Dual image sets for 6 enemy types
        ├── *.jpg               # JPG with white bg (EnemySelectStep cards)
        └── *.png               # Transparent PNG (ritual stages: Beating, Burning, FirePass)
```

## Ritual State Machine

10 states, 10 actions. Traditional 8-step flow split into free (1-5) and paid (6-8).

```
idle → START_RITUAL → invocation → INVOCATION_COMPLETE → select
select → SELECT_ENEMY → firePass → FIRE_PASS_COMPLETE → beating
beating → BEATING_COMPLETE → burning → BURNING_COMPLETE → paywall
paywall → [navigate to /result]                                    [free path, exits SPA]
paywall → PAYMENT_COMPLETED → purification → PURIFICATION_COMPLETE → blessing
blessing → BLESSING_COMPLETE → divination → [up to 3 throws] → [navigate to /completion]  [paid path, exits SPA]
```

**Continue flow** (`/ritual?continue=true`): RitualProvider initialized at `purification` state with enemy/payment data from localStorage. Steps 6-8 play normally, then navigate to `/completion`.

State shape (`RitualInternalState`):
```typescript
{
  ritualState: 'idle' | 'invocation' | 'select' | 'firePass' | 'beating' | 'burning'
             | 'paywall' | 'purification' | 'blessing' | 'divination';
  enemy: { category: string; name?: string } | null;
  paymentTier: 'free' | 'reading' | 'completion' | 'full';
  divinationResult: 'saint' | 'laugh' | 'anger' | null;
}
```

Context shape (`RitualContextShape`):
```typescript
{
  state: RitualState;
  dispatch: Dispatch<RitualAction>;
  enemy: EnemyData | null;
  paymentTier: PaymentTier;
  isPaid: boolean;              // paymentTier !== 'free'
  divinationResult: DivinationResult | null;
}
```

Actions: `START_RITUAL`, `INVOCATION_COMPLETE`, `SELECT_ENEMY`, `FIRE_PASS_COMPLETE`, `BEATING_COMPLETE`, `BURNING_COMPLETE`, `PAYMENT_COMPLETED`, `PURIFICATION_COMPLETE`, `BLESSING_COMPLETE`, `RESET`

## Payment Flow — 4 Paths

| Path | Flow | What User Sees |
|------|------|----------------|
| **Free** | Steps 1-5 → Paywall → "View Results" → `/result` | Blurred reading preview + 3 pricing buttons ($2.99/$4.99/$6.99) |
| **$2.99 Reading** | `/result` click $2.99 → Stripe → `/result` | Full reading + guidance + certificate (7-day expiry) |
| **$4.99 Complete** | `/result` click $4.99 → Stripe → `/result` → "Continue" → `/ritual?continue=true` → Steps 6-8 → `/completion` | Divination result only, no reading, no certificate |
| **$6.99 Full** | Same as $4.99 but reading held back until `/completion` (grand finale) | Divination + full reading + guidance + permanent certificate |

**Certificate logic**: $2.99 = cert (7-day) | $4.99 = no cert | $6.99 = cert (permanent, no expiry)

**localStorage keys** (persisted across Stripe redirects):
- `beatpetty_enemy` — `{ category, name }`
- `beatpetty_seed` — deterministic reading seed
- `beatpetty_reading` — generated curse reading text
- `beatpetty_guidance` — `{ insight, resolution, prophecy }` JSON
- `beatpetty_paid` — `{ paid, plan, enemyCategory, enemyName }` from verify-session API
- `beatpetty_divination` — `'saint' | 'laugh' | 'anger'` (always `'saint'` for paid users)
- `beatpetty_divination_throws` — number of throws to get 聖杯 (1-3 for paid users)

**Page responsibilities**:
- `/result` — 4 views based on payment state. Handles all Stripe checkout buttons.
- `/ritual?continue=true` — Restores state from localStorage, starts at step 6.
- `/completion` — Grand finale. Reads divination + reading + guidance from localStorage.

## Ritual Flow — Timing & Tech

| Phase | Duration | Visual | Audio | Tech |
|-------|----------|--------|-------|------|
| **Step 1: Invocation** | 6s | Candle CSS animation + dark overlay | transition-invocation (sine sweep 200→60Hz 5s) | CSS keyframes |
| **Step 2: Select** | User-paced | 6-card grid, clip-path silhouettes, name input | action-paper (bandpass noise 120ms) | CSS + React state |
| **Step 3: Fire Pass** | 3s passive | Paper figure (PNG) sweeps L→R over AI-generated flames background, vermillion→gold glow | transition-invocation (shared) | AI background image + CSS animation, auto-advance |
| **Step 4: Beating** | ~30s | Canvas HitSpark, slipper cursor, curse chants, rage meter, aria-live, haptic escalation | action-beat + action-thwack + ambient-drone | Canvas 2D + keyboard a11y |
| **Step 5: Burning** | 2s hold + 9s burn ≈ 11s | AI-generated white tiger background + long-press ignite + Canvas fire + CSS fire + paper dissolution (paper rises toward tiger) | ambient-drone → ambient-wind | AI background image + Canvas 2D + CSS fire + keyboard a11y |
| **Paywall** | User-paced | Title + subtitle + "View Results" button (saves to localStorage → navigates to /result) | — | router.push → /result |
| **Step 6: Purification** | 2-10s | AI bg + tap-to-scatter (min 7 taps) + progress indicator "3/7" + atmospheric warmth ring + enemy cleanse text | action-scatter (highpass noise 200ms) | CSS particles + haptic 30ms, auto 10s |
| **Step 7: Blessing** | 7.5s cinematic | AI bg + slow zoom (1.0→1.15) + "Receiving the blessing..." hint + 18 rising gold sparks + enemy seal reveal at 5s + pulse flash | ambient-drone + transition-blessing (sine 300→600Hz 2s) | CSS animation, auto-advance |
| **Step 8: Divination** | ~5s per throw × up to 3 | AI bg + poe blocks spin (2s) → land (1s) → result reveal. **Paid users**: 3-throw mechanic (1st=50/50 laugh/anger, 2nd=33/33/33, 3rd=100% saint). Non-saint shows "Cast Again", saint shows "Continue" → /completion | action-divination + result-saint/laugh/anger (per result) | CSS 3D transforms + haptic 100ms → /completion |
| **/result** | User-paced | Free: blurred reading + 3 pricing buttons. $2.99: reading + cert. $4.99/$6.99: "Continue" button. | — | React + Stripe + localStorage |
| **/completion** | User-paced | $4.99: 聖杯 interpretation + throw count + ritual summary. $6.99: same + reading + guidance + permanent cert (grand finale). | — | React + localStorage |

**Total timing**: Free path ~45s (steps 1-5 + paywall skip + result). Paid path ($4.99/$6.99): steps 1-5 (~45s) + Stripe redirect → /result → Steps 6-8 (~25-45s depending on throws) → /completion.

**Divination probabilities**: Free users: Saint 75%, Laugh 20%, Anger 5%. **Paid users**: 3-throw mechanic — 1st throw 50/50 laugh/anger, 2nd 33/33/33, 3rd 100% saint. Always ends with 聖杯 (guaranteed positive ending).

## Pricing & Stripe

| Tier | Price | Internal key | Content |
|------|-------|-------------|---------|
| Free | $0 | — | Steps 1-5: 請神→稟告→過火→打小人→焚化 |
| Reading | $2.99 | `'name'` | Curse reading (~945 combinations) + Oracle guidance (insight/resolution/prophecy) + Curse certificate (stamp: 詛) |
| Completion | $4.99 | `'seal'` | Steps 6-8: 化解→祈福→擲筊 |
| Full | $6.99 | `'full'` | Reading + Completion combined |

`PlanType = 'name' | 'seal' | 'full'` — keys unchanged, display names updated.

**Payment flow**: PaywallTransition → Stripe Checkout → redirect to `/result?session_id=...` → verify-session API → show paid content.

**Important**: The `'seal'` key name is legacy (from deleted "Sealing" step) but kept for Stripe price ID compatibility. Display name is "Complete the Ritual".

## Shared Silhouettes

`src/components/ritual/silhouettes.ts` — 6 enemy clip-paths (`backstabber | toxicBoss | ex | energyVampire | bully | custom`) + dual paper figure image sets:

- `PAPER_FIGURE_IMAGES` (JPG, white bg) — EnemySelectStep card display
- `PAPER_FIGURE_PNG` (transparent PNG) — BeatingStep, BurningStep, FirePassTransition (no bg interference)
- EN/ZH names and descriptions live in message files (en.json, zh-TW.json, zh-Hans.json) — NOT here

## Audio Architecture

**AudioManager.ts** — Singleton, Web Audio API synthesis (no external MP3 files)

| Sound ID | Layer | Synthesis | Duration |
|----------|-------|-----------|----------|
| ambient-drone | Ambient | 55Hz sawtooth + lowpass 200Hz | Continuous |
| ambient-wind | Ambient | White noise + bandpass 800Hz | Continuous |
| action-beat | Action | White noise + highpass 2000Hz | 80ms burst |
| action-paper | Action | White noise + bandpass 4000Hz | 120ms burst |
| action-thwack | Action | White noise + bandpass 1200Hz | 60ms burst |
| action-scatter | Action | White noise + highpass 3000Hz | 200ms burst |
| action-divination | Action | White noise + bandpass 800Hz | 150ms burst |
| transition-invocation | Transition | Sine sweep 200→60Hz | 5s |
| transition-blessing | Transition | Sine sweep 300→600Hz | 2s |
| result-saint | Transition | Sine 180→120Hz | 1.5s |
| result-laugh | Transition | Noise + bandpass 2000Hz | 80ms |
| result-anger | Transition | Noise + lowpass 200Hz (Q=3) | 250ms |
| transition-result | Transition | White noise + lowpass 500Hz | 1s |

Volume layers: ambient 0.3, action 0.6, transition 0.8

**useAudio.ts** — React hook wrapping singleton. Exports: `{ init, playAction, playAmbient, stopAmbient, playTransition, isReady }` + `SOUND_IDS`

**Critical pattern**: useAudio does NOT dispose AudioManager on unmount. Singleton survives across step transitions.

**Audio init**: InvocationTransition is the first component to call `audio.init()` (iOS AudioContext unlock). Subsequent steps that play audio (PurificationStep, BlessingStep) also call `audio.init()` on mount for robustness. DivinationStep uses `getAudioManager()` singleton directly.

## Canvas Architecture

**ParticleSystem.ts** — Pure Canvas 2D engine
- Object pool: max 80 particles, oldest recycled when full
- DPR: capped at 2 for performance
- Auto-degradation: drops below 20fps → reduces particle count
- Particle types: HitSpark (orange/ember circles, gravity), FireFlame (red-orange, upward), Smoke (gray, upward, fade)

**useCanvas.ts** — React hook for BeatingStep
- Returns: `{ canvasRef, emit, start, stop }`
- ResizeObserver auto-adjusts canvas size

**BurningStep** — Creates ParticleSystem directly from canvasRef (not useCanvas hook) to avoid timing issues with useEffect deps

## prefers-reduced-motion Degradation

Each step checks `useReducedMotion()` hook, conditionally renders fallback.

| Feature | Normal | Reduced Motion |
|---------|--------|----------------|
| Particle effects | Canvas 2D animation | Disabled entirely |
| Invocation (step 1) | 6s candle flicker | Instant state change (return null) |
| Fire pass (step 3) | 3s paper animation | Return null, auto-advance 200ms |
| Beating sparks | Canvas burst per tap | Simple CSS scale pulse |
| Burning fire + tiger | Canvas particles + AI tiger background | Skip particles, CSS fade-out 2s |
| Purification particles | CSS rice/bean scatter | 4s static bg + text + enemy cleanse |
| Blessing glow | 7.5s cinematic zoom + sparks + seal | 4s static bg + text |
| Divination poe blocks | 2s spin + 1s land + result image + sound | 500ms spin + 100ms land |
| Ambient audio | Plays | Still plays (not motion-related) |
| Haptic feedback | Vibrates | Still vibrates (not motion-related) |

## Performance Targets

- FPS >= 30 during beating/burning steps. Particle pool max 80, auto-degrade at <20fps.
- Low-end Android baseline: Snapdragon 450, 2GB RAM. Below 15fps → disable particles, CSS-only.

## Edge Cases

| Case | Handling |
|------|----------|
| User refreshes mid-ritual | State lost (by design — ritual = one continuous session). Re-start from idle. |
| Tab backgrounds during burning | Canvas pauses (rAF stops). Resume from same point on return. |
| Stripe redirect loses ritual state | Paid users land on standalone /result page. `?continue=true` flow restores state from localStorage to reach steps 6-8. |
| DivinationStep double-dispatch | `completedRef` prevents duplicate navigation to /completion |
| Beating double-tap / fast tapping | Debounce 100ms, cap 4 bursts/second max. |

## i18n

`messages/{en,zh-TW,zh-Hans}.json` — EN and ZH are NOT direct translations, completely different copy with same meaning. Namespaces: `site`, `landing`, `meta`, `ritual` (~60 keys), `pricing`, `result`, `about`, `common`. Use `t.raw()` for array values (not `t()`).

## CSS Architecture (globals.css)

- **Tailwind v4 `@theme` block**: colors (ink/vermillion/gold/paper/ember/smoke), fonts (serif/body), animations
- **NO tailwind.config.ts** — everything through `@theme` in globals.css
- Component classes: candle, glow, particle, enemy-card, poe-block, purification, blessing, divination — all in globals.css
- **`@media (prefers-reduced-motion: reduce)`**: single block covering all components

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| ink | #1a1a1a | Background (dark base) |
| ink-light | #2a2a2a | Borders, subtle bg |
| ink-lighter | #3a3a3a | Borders, dividers |
| vermillion | #ef6030 | Primary accent (text, titles, flames) — WCAG AA on #1a1a1a |
| vermillion-dark | #c23616 | CTA button backgrounds (contrasts with text-paper) |
| vermillion-light | #ff7050 | Button hover states, glow effects |
| gold | #d4a843 | Secondary accent (buttons, icons, divination) |
| gold-dark | #b8922e | — |
| gold-light | #e8c46a | Hover states |
| paper | #f5f0e8 | Text color (light on dark) |
| paper-dark | #d8d0c4 | — |
| paper-muted | #b0a698 | Secondary text |
| ember | #ff6b35 | Particle color |
| smoke | #8a8078 | Tertiary text (WCAG AA on #1a1a1a) |
| shadow | #0d0d0d | Deepest dark |

## Deployment

- **Primary**: `npx vercel --prod --yes` (CLI direct deploy)
- **Git auto-deploy**: Connected but unreliable — deployments may get canceled silently
- **Always verify**: `curl -s https://beatpetty.com/en | grep "keyword"` after deploy
- **Branch**: `master` (not `main`)
- **Remote**: `https://github.com/i3wai/beating-petty-person.git`

## Environment Variables

| Var | Purpose | Status |
|-----|---------|--------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 (G-HVR1CTNSQ6) | Set |
| `STRIPE_SECRET_KEY` | Stripe backend (null = routes return 503) | Set (live) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe frontend (not used — Checkout redirect) | Not set |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification | Set (live) |
| `STRIPE_PRICE_ID_NAME` | Price for Curse Reading $2.99 | Set (live) |
| `STRIPE_PRICE_ID_SEAL` | Price for Complete the Ritual $4.99 | Set (live) |
| `STRIPE_PRICE_ID_FULL` | Price for Full Ritual + Reading $6.99 | Set (live) |

## Known Technical Debt

- **`'seal'` plan key name is legacy** (from deleted "Sealing" step) but kept for Stripe price ID compatibility.
- **FirePassTransition PNG background flash**: Brief flash on first load. Low priority.
- OG image alt text is English-only
- PWA is manifest-only — no service worker (@serwist/next incompatible with Turbopack)
- No error boundary around Canvas — if context fails, particles silently skip
