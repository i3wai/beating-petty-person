# BeatPetty — Current Process State

> **Every new session: read this file first. Every session end: update this file.**
> Last updated: 2026-04-24

---

## Current Status: Soft Launch — All Systems Live

Ritual flow + payment + share system all deployed to production at beatpetty.com.

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

### Latest Changes (2026-04-24) — Steps 6-8 UX Overhaul + AI-Generated UI Elements

| Change | Detail |
|--------|--------|
| **Step 6 drag-to-scatter** | Replaced tap counter ("3/7") with drag/click scatter. Particles spawn at pointer position. No progress counter. Auto-completes ~10s after first interaction. Scene warmth via `hasInteracted` state. |
| **Step 6 grain image** | Added `grain-scatter.png` (Gemini-generated) as background layer, opacity increases with scene warmth |
| **Step 6 i18n** | Instruction changed: "Tap to scatter" → "Drag to scatter" (EN), "點擊撒米豆" → "滑動撒米豆" (zh-TW/Hans) |
| **Step 7 hold-to-receive** | Added optional talisman interaction at 3s mark. `talisman-glow.png` (Gemini-generated) fades in. Hold intensifies gold radial glow + adds pulse ring. Auto-completes at 7.5s regardless — no failure state. |
| **Step 7 i18n** | Added `step7HoldInstruction`: "Hold to receive the blessing" / "按住以接收祝福" |
| **Step 8 swipe-to-cast** | Replaced button with swipe/click area. Swipe up (50px min) or click triggers throw. Added `onClick` fallback for tap accessibility. Keyboard (Enter/Space) still works. |
| **Step 8 slower animation** | Spin 2s→3s. Added `silence` phase (1.5s) between land and result. Total reveal ~5.3s (was ~3s). |
| **Step 8 solemn language** | "Cast Again" red button → "神明請您再問一次" / "The spirits invite you to ask again" in subdued gold style |
| **Step 8 poe block images** | CSS shapes replaced with Gemini-generated `poe-block-face-up.png` and `poe-block-face-down.png`. Added `backface-visibility: hidden` + `rotateY(180deg)` for proper 3D flip. Poe block size 40x60→56x80. |
| **Step 8 result stamps** | Added Gemini-generated stamp overlays: `stamp-saint.png` (gold), `stamp-laugh.png` (silver), `stamp-anger.png` (red) — fade in during result phase |
| **Step 8 swipe hint i18n** | Added `divination.swipeHint`: "Swipe up to cast" / "向上滑動擲筊" |
| **8 Gemini-generated images** | `poe-block-face-up.png`, `poe-block-face-down.png`, `talisman-glow.png`, `stamp-saint.png`, `stamp-laugh.png`, `stamp-anger.png`, `grain-scatter.png`, `gold-ingots-float.png` — all in `/public/images/` |
| **Generation script** | `scripts/generate-ui-elements.mjs` — generates ritual UI element images via Gemini API |

### Design Decisions (2026-04-24)

- **Ritual gestures, not game mechanics**: Steps 6-8 interactions map to real traditional actions (drag=scatter rice, hold=receive blessing, swipe=throw poe blocks). No scores, points, badges, or combos.
- **Tone shift**: Steps 1-5 = destruction arc (aggressive, physical). Steps 6-8 = restoration arc (deliberate, solemn, cinematic). The contrast IS the value.
- **Optional interaction**: Step 7 hold is purely optional — auto-completes regardless. Step 6 click is fallback for drag. Step 8 click is fallback for swipe.
- **3-throw divination kept**: Paid users guaranteed saint on throw 3. Reframed as "re-consultation" not retry. Language changed from failure/retry to invitation.

### Latest Changes (2026-04-24) — Steps 1-8 UX Polish Round 2

| Change | Detail |
|--------|--------|
| **FirePass audio** | Added `transition-invocation` sound to Step 3 (was completely silent) |
| **FirePass longer** | Duration 3s→4.5s, sweep range ±120→±180px, transition 1.4s→2.1s |
| **BeatingStep chant text** | Display time 1600ms→2600ms (user couldn't read before disappearing) |
| **BurningStep white tiger** | Opacity 0.75→0.85 (+10% more visible) |
| **Free result oracle preview** | Added blurred "The Oracle Speaks" section below blurred reading — visitors see payment has 2 parts |
| **Step 6 interaction-driven** | Ring = interaction count (30 to complete), NOT timer. No timer. User controls pace. Mouse must move within zone. |
| **Step 6 progress bar** | Bottom 3px bar tracks interaction progress (same as ring) |
| **Step 7 blessing 20s** | Duration 7.5s→20s base. Hold talisman = 1.5x speed boost. Text: "Hold to accumulate blessing faster" |
| **Step 7 virtual time** | rAF tick uses `dt * speed` — holding advances virtual clock faster |
| **Step 8 desktop UX** | Cursor `cursor-grab`→`cursor-pointer` + `animate-pulse`. Text: "Click or swipe up to cast" |

### Latest Changes (2026-04-22) — Share System Overhaul + Ritual Polish

| Change | Detail |
|--------|--------|
| **Fire Pass range** | Paper figure translateX ±80px → ±120px (50% wider sweep) |
| **Step 7 text readability** | BlessingStep overlay 0.45→0.6, fade 0.4→0.45, h2 + subtitle + enemy text all get `drop-shadow` |
| **Step 8 text readability** | DivinationStep overlay bg-ink/30→bg-ink/50, h2 + subtitle + result + enemy text get `drop-shadow` |
| **Share card JPEG conversion** | API now converts PNG→JPEG via `sharp` (1.1MB → ~119KB). Response Content-Type: image/jpeg. 7-day CDN cache |
| **Instagram share button** | Mobile: native share sheet with image. Desktop: copy link + toast guidance |
| **TikTok share button** | Mobile: native share sheet with image. Desktop: copy link + toast guidance |
| **Native share for all platforms** | WhatsApp, X, IG, TikTok all use `navigator.share({ files })` on mobile — actual image attached |
| **X mobile image fix** | Desktop: intent/tweet URL. Mobile: native share sheet (X intent API doesn't support images) |
| **Shared page enlarged** | Card image now `max-w-lg` with gold shadow border. Removed auto-redirect (was 5s countdown) |
| **Completion page hydration fix** | localStorage reads wrapped in useState+useEffect to prevent SSR/client mismatch |
| **`sharp` dependency** | Added for server-side PNG→JPEG conversion in share card API |
| **CSS share buttons** | `.share-btn-instagram` (pink #e1306c), `.share-btn-tiktok` (white/light), disabled states |
| **3-locale messages** | Added `instagram`, `tiktok`, `igToast`, `tiktokToast` keys |
| **`NEXT_PUBLIC_SITE_URL`** | Added to `.env.local` for share URL generation |

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
| **Share card API** | `/api/share-card` — server-side 1200x630 JPEG via `next/og` ImageResponse + sharp. Params: cat, tier, serial, locale, rt |
| **Share card design** | Dark #1a1a1a bg, 詛 seal stamp circle, enemy category label, tier label, serial, reading teaser, BeatPetty branding |
| **Share token system** | `/src/lib/shareToken.ts` — base64url encode/decode + serial generation (BP-YYYYMMDD-XXXX) |
| **Shared landing page** | `/[locale]/shared/[token]` — server-rendered OG meta for crawlers, prominent card image, no redirect |
| **ShareButtons component** | WhatsApp / Twitter/X / Instagram / TikTok / Copy Link / Native Share. Mobile: native share with image. Desktop: platform links or copy+toast |
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
| **Image sharing (Web Share API)** | All platforms send actual JPEG file via `navigator.share({ files })` on mobile. Desktop: WhatsApp→wa.me, X→intent/tweet, IG/TikTok→copy link + toast. Image blob cached in ref |
| **Share card API** | Now returns JPEG (sharp PNG→JPEG, ~119KB). Content-Type: image/jpeg. Cache-Control: public, s-maxage=604800 |

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

---

## DONE: Share System Overhaul + Ritual Polish (2026-04-22)

1. ✅ Fire Pass paper figure range ±80px → ±120px
2. ✅ Steps 7 & 8 text readability — darker overlays + drop shadows
3. ✅ Share card JPEG conversion — sharp, 1.1MB→~119KB
4. ✅ Instagram + TikTok share buttons (native share mobile, copy link desktop)
5. ✅ All platforms use native share with image on mobile
6. ✅ Shared page enlarged, no auto-redirect
7. ✅ Completion page hydration fix
8. ✅ Deployed to beatpetty.com

---

## DONE: Deploy Bug Fixes + Share Polish to Production (2026-04-22)

1. ✅ Share card background — Gemini atmospheric image now renders correctly
2. ✅ Steps 6/7/8 text readability — brighter text, lighter overlays
3. ✅ Step 7 stuck 30s — useAudio useMemo fix, timers fire at 3s/5s/7.5s
4. ✅ Share card layout — paper figure no longer covers Gemini background
5. ✅ Image sharing — WhatsApp + Native Share send JPEG via Web Share API
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
1. ~~**Viral Share Engine**~~ ✅ Done — Share cards with native image sharing across all platforms
2. **Email 7-day hook** — Optional email input, "curse status" reminder after 7 days
3. **More blog content** — Continue SEO content攻势

Full roadmap: `docs/FUTURE_ROADMAP.md`
