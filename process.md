# BeatPetty — Current Process State

> **Every new session: read this file first. Every session end: update this file.**
> Last updated: 2026-04-22

---

## Current Status: Phase 1 COMPLETE + UX Polish

Ritual redesign + payment flow + Steps 6-8 UX polish. All tested locally, pending deploy.

### What's Built

- **Ritual Flow**: 8-step traditional 八部曲, free (1-5) + paid (6-8)
- **Payment**: 4 paths (Free / $2.99 Reading / $4.99 Completion / $6.99 Full), Stripe Checkout
- **Content**: Curse reading (~945 combos) + Oracle guidance (54 fragments) + Curse certificate
- **Blog**: 9 EN + 11 ZH articles, all with AI images, deployed
- **AI Images**: 7 atmospheric backgrounds (white tiger, flames, purification, blessing, divination, 3 result images)
- **Audio**: 12 synthesized sounds (Web Audio API, no MP3)
- **i18n**: EN + zh-TW + zh-Hans, culturally accurate (not direct translations)

### Latest Changes (2026-04-21) — Steps 6-8 UX Polish

| Change | Detail |
|--------|--------|
| **Divination 3-throw mechanic** | Paid users: 1st throw = 50/50 laugh/anger, 2nd = 33/33/33, 3rd = 100% saint. Guaranteed positive ending |
| **"Cast Again" button** | Non-saint results show red "Cast Again", saint shows gold "Continue" |
| **Throw count tracking** | `beatpetty_divination_throws` in localStorage, displayed on completion page |
| **Completion page rewrite** | Rich 聖杯 interpretation + traditional context + 八部曲 ritual summary + throw count narrative |
| **Step 6 progress indicator** | Shows "3 / 7" tap progress during purification |
| **Step 7 status hint** | "Receiving the blessing..." pulse text, fades when title appears at 3s |
| **CurseCertificate fix** | Enemy category now translates `toxicBoss` → "The Toxic Boss" via i18n lookup |
| **3-locale messages updated** | EN / zh-TW / zh-Hans all synced with new keys |

### Latest Changes (2026-04-22) — Full Ritual Review + Bug Fixes + UX Polish

| Change | Detail |
|--------|--------|
| **zh-Hans typo fix** | "影呃" → "影响" in resultPaidPrompt |
| **Blog nav consistency** | Nav now shows "The Grimoire" (was "The Spellbook" — inconsistent with blog page) |
| **BeatingStep crash guard** | `chantPhrases` empty array no longer causes NaN crash |
| **DivinationStep haptic** | Added vibrate(50) on cast — consistent with PurificationStep |
| **DivinationStep enemy name** | Saint result now shows "The curse upon {target} is confirmed" below result text |
| **DivinationStep timing** | Continue delay 1.5s→1s, auto-nav 8s→5s — less dead time |
| **BurningStep responsive** | Container uses `min(320px,90vw)` / `min(400px,75dvh)` — no overflow on small screens |
| **3-locale messages added** | `step8EnemyConfirmed` key in EN / zh-TW / zh-Hans |
| **Step 6 particle visibility** | Brighter gold/white particle colors + glow boxShadow + darker overlay (0.5→0.6) + larger particles |
| **Step 7 progress bar** | Thin 2px gold progress bar at bottom during 7.5s cinematic — passive flow preserved |

### Latest Changes (2026-04-22) — Viral Share Feature

| Change | Detail |
|--------|--------|
| **Share card API** | `/api/share-card` — server-side 1200x630 PNG via `next/og` ImageResponse. Params: cat, tier, serial, locale, rt |
| **Share card design** | Dark #1a1a1a bg, 詛 seal stamp circle, enemy category label, tier label, serial, reading teaser, BeatPetty branding |
| **Share token system** | `/src/lib/shareToken.ts` — base64url encode/decode + serial generation (BP-YYYYMMDD-XXXX) |
| **Shared landing page** | `/[locale]/shared/[token]` — server-rendered OG meta for crawlers, 3s redirect to homepage |
| **ShareButtons component** | WhatsApp / Twitter/X / Copy Link / Native Share. Shows card preview thumbnail |
| **Result page wiring** | ShareButtons in reading view ($2.99 tier) |
| **Completion page wiring** | ShareButtons for completion ($4.99) and full ($6.99) tiers |
| **3-locale messages** | `share` namespace in EN / zh-TW / zh-Hans — tiered text per platform |
| **CSS styles** | `.share-btn` base + WhatsApp (green) / Twitter (white) / Copy (gold) / Native (vermillion) |
| **Bug fix: adjacent text nodes** | Satori crashes on `{'\u201C'}{text}{'\u201D'}` — fixed by concatenating into single string |

### Latest Changes (2026-04-22) — Bug Fixes + Share Card Polish

| Change | Detail |
|--------|--------|
| **Share card background fix** | Satori cannot render base64 data URI (produces black). Switched to HTTP URL `${origin}/images/share-composited.jpg` — Satori fetches directly |
| **Share card re-composited** | Paper figure reduced 270→140px, positioned bottom-left. Gemini atmospheric background now fully visible (right 60%) |
| **Step 6 text readability** | Instruction: `text-paper-muted` → `text-gold/80`. Subtitle: `text-paper-muted/50` → `text-gold/60`. Overlay: 0.6 → 0.45 |
| **Step 7 stuck bug** | `useAudio()` returned new object every render → BlessingStep useEffect reset timers at 60fps. Fixed with `useMemo` wrapper on return value |
| **Step 7 progress bar** | 2px → 3px, gradient opacity 0.3→0.8 → 0.5→1.0. Dark overlay 0.6 → 0.45 |
| **Step 8 text readability** | Subtitle: `text-paper-muted` → `text-gold/80`. Spinner text: `text-paper-muted` → `text-gold/70`. Overlay: `bg-ink/45` → `bg-ink/30` |
| **Image sharing (Web Share API)** | WhatsApp + Native Share now send actual PNG file via `navigator.share({ files })`. Desktop falls back to text+URL. Image blob cached in ref |

### Key Architecture Decisions

- **Flow split**: Steps 1-5 free (毀滅), Steps 6-8 paid $4.99 (收尾). Paywall at step 5→6.
- **封印 deleted**: Not traditional. BurningStep is natural free endpoint.
- **PlanType keys**: `'name' | 'seal' | 'full'` — `'seal'` is legacy naming, kept for Stripe compatibility
- **State machine**: 10 states, 10 actions in RitualProvider (useReducer)
- **Results on separate pages**: `/result` (free/paid reading), `/completion` (paid ritual finish)
- **No accounts**: localStorage + Stripe Session ID
- **Paid divination**: 3-throw mechanic, guaranteed 聖杯. Paid = always positive ending.

### Files to Read First

| File | Purpose |
|------|---------|
| `docs/ARCHITECTURE.md` | Full tech architecture (read instead of scanning codebase) |
| `docs/ritual-process-hk.md` | Traditional 8-step reference |
| `docs/BLOG_SEO_STANDARD.md` | Blog writing standards |
| `docs/blog-seo-master.md` | SEO strategy + keyword planning |
| `docs/FUTURE_ROADMAP.md` | Phase 2/3 roadmap |

### Known Technical Debt

- `'seal'` plan key name is legacy but kept for Stripe price ID compatibility
- FirePassTransition PNG background flash on first load (low priority)
- OG image alt text is English-only
- PWA is manifest-only (no service worker)
- No error boundary around Canvas
- Completion page hydration mismatch (localStorage SSR vs client — pre-existing, non-blocking)

---

## DONE: Deploy Bug Fixes + Share Polish to Production (2026-04-22)

1. ✅ Share card background — Gemini atmospheric image now renders correctly
2. ✅ Steps 6/7/8 text readability — brighter text, lighter overlays
3. ✅ Step 7 stuck 30s — useAudio useMemo fix, timers fire at 3s/5s/7.5s
4. ✅ Share card layout — paper figure no longer covers Gemini background
5. ✅ Image sharing — WhatsApp + Native Share send PNG via Web Share API
6. ✅ `npx vercel --prod --yes` — deployed to beatpetty.com

---

## DONE: Deploy UX Polish to Production (2026-04-22)

1. ✅ Tested locally, all 8 steps working
2. ✅ `npx vercel --prod --yes` — deployed to beatpetty.com
3. ✅ Verified production

---

## DONE: Stripe Sandbox Testing (2026-04-22)

All 3 payment paths tested with card `4242 4242 4242 4242`:

| Path | Stripe Product | Result Page | Verified |
|------|---------------|-------------|----------|
| $2.99 Reading | "Curse Reading" | Full reading + guidance + cert (7-day) | ✅ |
| $4.99 Completion | "Complete the Sealing Ritual" | Continue → Steps 6-8 → completion (no cert) | ✅ |
| $6.99 Full | "Full Power Ritual" | Reading held → Continue → Steps 6-8 → completion (eternal cert + reading + guidance) | ✅ |

Note: Stripe product names still use legacy names ("Sealing", "Full Power"). Can update in Stripe Dashboard later.

---

## Next: Phase 2 — Growth

Priority order:
1. **Viral Share Engine** — Share cards after payment, turn payers into free traffic source
2. **Email 7-day hook** — Optional email input, "curse status" reminder after 7 days
3. **More blog content** — Continue SEO content攻势

Full roadmap: `docs/FUTURE_ROADMAP.md`
