# BeatPetty — Current Process State

> **Every new session: read this file first. Every session end: update this file.**
> Last updated: 2026-04-20

---

## Active Task: Ritual Redesign + Paid Tier Restructure

### Status: STEPS 6-8 QUALITY FIX COMPLETE (2026-04-20)

Ritual redesign + payment flow restructure + steps 6-8 quality fix complete. Build passes.

- **Design + Implementation plan**: `docs/ritual-redesign.md` — decisions, flow design, 9-phase plan
- **Traditional reference**: `docs/ritual-process-hk.md` — correct Hong Kong 打小人 process
- **$2.99 Reading system (implemented)**: `docs/ritual-name-redesign.md`

#### Payment Flow — 4 Paths (implemented 2026-04-20):

| Path | Flow | Result |
|------|------|--------|
| **Free** | Steps 1-5 → Paywall → "View Results" → `/result` | Blurred reading + 3 pricing buttons |
| **$2.99** | `/result` click $2.99 → Stripe → `/result` | Full reading + guidance + cert (7-day) |
| **$4.99** | `/result` click $4.99 → Stripe → `/result` → "Continue" → `/ritual?continue=true` → Steps 6-8 → `/completion` | Divination only, no cert |
| **$6.99** | Same as $4.99 but reading held back until `/completion` (grand finale) | Divination + reading + guidance + permanent cert |

**Key changes**: PaywallTransition saves to localStorage + navigates to `/result`. ResultStep deleted. State machine simplified (10 states, 10 actions — removed `result`, `SKIP_PAYMENT`, `DIVINATION_COMPLETE`). New `/completion` page. DivinationStep navigates to `/completion` directly. `CurseCertificate` supports `permanent` prop.

#### Key Decisions (Allen + CC, 2026-04-18):
1. **Flow split**: Steps 1-5 = free (毀滅), Steps 6-8 = $4.99 (收尾)
2. **Free ending**: Burning (step 5) as natural endpoint. "Curse cast, but temporary"
3. **$4.99 content**: Steps 6-8 (化解→祈福→擲筊). Seamless continuation after payment
4. **Delete 封印**: Not traditional, false claim. Remove SealingTransition entirely
5. **Paywall placement**: Between step 5 and step 6 (mid-ritual, highest emotional point)
6. **過火 = passive transition** (Allen decision, 2026-04-19): Changed from interactive step to 3s passive animation between select and beating

#### Pricing (updated 2026-04-19):
| Tier | Price | Content |
|------|-------|---------|
| Free | $0 | Steps 1-5: 請神→稟告→過火→打小人→焚化 |
| $2.99 | $2.99 | Curse reading (~945 combinations) + Oracle guidance (insight/resolution/prophecy) + Curse certificate (stamp: 詛) |
| $4.99 | $4.99 | Steps 6-8: 化解→祈福→擲筊 |
| $6.99 | $6.99 | $2.99 + $4.99 combined |

#### Implementation Progress:
- [x] **Phase 1**: State machine (11 states, 12 actions) + infrastructure + SealingTransition deleted
- [x] **Phase 2**: FirePassTransition (passive 3s) + PurificationStep (tap scatter) + BlessingStep (gold glow) + DivinationStep (4-phase poe blocks)
- [x] **Phase 3**: PaywallTransition (stagger animation, CTA optimization)
- [x] **Phase 4**: BurningStep +白虎 (3s tiger intro), InvocationTransition 6s, ResultStep restructure (free temporary messaging, updated buttons, dead code cleanup)
- [x] **Phase 5**: ~~Delete SealingTransition~~ (already done in Phase 1)
- [x] **Phase 6**: i18n stubs (17 new keys × 3 languages)
- [x] **Phase 7**: Audio engine (3 new sounds: action-scatter, transition-blessing, action-divination)
- [x] **Phase 8**: CSS (divination keyframes, purification/blessing classes, reduced-motion)
- [x] **Phase 9**: Architecture doc update

### Completed This Session: Phase 4 — Upgrade Existing Components (2026-04-19)

**4a: BurningStep +白虎**: Added 3s pre-burn tiger phase. Two pulsing red tiger eyes (CSS) appear at top of scene → paper figure flies up toward tiger mouth and fades (1.5s) → tiger chomp flash → ignite button appears. Total burn flow: ~14s.

**4b: InvocationTransition 3s→6s**: Increased duration constant + extended transition sound (sine 200→60Hz, 1500ms→5000ms).

**4c: ResultStep restructure**: Updated for free users — shows "temporary effect" messaging (`resultFreeTemporary`). Removed staggered CTA reveal. Buttons updated: "Complete the Ritual" (not "Sealing"), "Full Ritual + Reading". Standalone result page stamp changed from 封 to 成. i18n updated for all 3 languages.

**Phase 3 fixes**: PurificationStep auto-complete timer no longer resets on tap. BlessingStep handleComplete wrapped in useCallback. Both now call audio.init() on mount.

**Dead code cleanup**: Removed `transition-sealing` from AudioManager.ts and useAudio.ts.

**Full review fixes**: P0 FirePassTransition wrong i18n key (`step3Title`→`firePassTitle`). P1 BurningStep removed unused imports (`SILHOUETTE_CLIPS`, `DEFAULT_CLIP`). P1 PurificationStep removed unused `containerRef`. P2 all 3 languages: removed dead keys (`sealingTitle`, `sealingSubtitle`, `resultFreeDescription`, `step3Instruction`), added `firePassTitle`/`firePassSubtitle`.

Build passes.

### Completed This Session: Ritual UI Refinements + AI Images (2026-04-19)

**PaywallTransition simplified**: Removed ALL pricing buttons ($4.99/$2.99/$6.99) and Stripe badge. Now only shows title/subtitle + single "View Results" free skip button. Pricing lives on /pricing page and ResultStep only. Rationale: duplicate pricing on multiple pages felt strange.

**ResultStep simplified**: Replaced 3 pricing tier buttons with single "View Results" button → triggers $2.99 curse reading checkout. Removed `resultPaidPrompt` text.

**BurningStep white tiger redesigned**: Removed CSS tiger eyes + SVG silhouette + separate tiger animation phase. Replaced with AI-generated background image (`/images/white-tiger-ground.jpg`) — spectral white tiger in dark atmospheric scene, integrated into burning background. Paper figure now rises upward toward tiger via updated `paper-curl-burn` keyframes (translateY 0→-200px). Ignite button shows immediately (no tiger phase wait). Removed `tigerVisible` state and timer.

**FirePassTransition upgraded**: Added paper figure image (PNG) with enemy name overlay. Replaced CSS gradient flames with AI-generated background image (`/images/fire-pass-flames.jpg`). Known minor issue: brief flash of JPG background on first load (browser cache, low priority).

**Dual paper figure image sets**: New `PAPER_FIGURE_PNG` export in silhouettes.ts — transparent PNGs for ritual stages (BeatingStep, BurningStep, FirePassTransition). Original `PAPER_FIGURE_IMAGES` (JPG with white bg) kept for EnemySelectStep. Allen created 6 transparent PNGs externally (848x1264px).

**PNG preloading**: InvocationTransition preloads all 6 PNG paper figures during 6s animation using `new Image()`.

**BurningStep ambient sound fix**: Burn effect cleanup now stops `AMBIENT_WIND`. Previously music continued after burning step ended.

**Candle stands**: Added `<div className="candle-stand" />` to all 3 candles in CandleFlame.tsx. Replaced standalone `invocation-candle-base` div with per-candle stands.

**CSS updates**: Removed `.tiger-eye`, `.tiger-chomp`, related keyframes. Updated `paper-curl-burn` with translateY movement. Added `.candle-stand` class. Replaced `.invocation-candle-base` with `.candle-stand`.

**i18n**: Added `viewResultButton` ("View Results" / "查看結果" / "查看结果") across 3 languages.

Build passes.

### Completed This Session: Landing Page 八部曲 Update (2026-04-19)

**HowItWorksSection.tsx**: Complete rewrite. Replaced 3-step image-based cards with authentic 8-step 八部曲 grid using Chinese numerals (壹-捌) as visual markers + Arabic step numbers (1-8) for sequence clarity. Two-phase layout: Free/Destruction (vermillion, 5 cards) + Paid/Completion (gold, 3 cards) with atmospheric divider.

**WhatIsSection.tsx**: Added dark atmospheric background image (`goose-neck-bridge-ground.jpg` + `bg-ink/70` overlay). Fixes visual drop-off from cinematic Hero to plain text. Pattern matches AtmosphereSection/FinalCtaSection.

**i18n updates (3 languages)**:
- `landing.howItWorks`: New 8-step structure with title, subtitle, freeLabel, paidLabel, dividerText, steps[8]
- `landing.hero.subtitle` (zh-TW/zh-Hans): Removed 封印 → "燃燒成灰。正宗八部曲。"
- `landing.whatIs.description`: "Strike. Burn. Seal." → "Strike. Burn." (removed sealing)
- `landing.faq.items[1]` + `[2]`: Updated to reflect 5 free + 3 paid structure, removed sealing references

**Visual verification**: EN desktop, EN mobile (375x812), ZH-TW desktop + mobile — all render correctly. Deployed to production.

**Landing page visual rhythm**: Hero(重)→WhatIs(重)→HowItWorks(中)→Trust(輕)→Atmosphere(重)→FAQ(輕)→FinalCta(重). No more atmosphere gap between Hero and WhatIs.

### Completed This Session: $2.99 Tier Enhancement (2026-04-19)

**Oracle Guidance system** (`curseReading.ts`): New `generateGuidance()` function + `GuidanceFragments` type. 3 modules (insights/resolutions/prophecies) × 3 variants × 6 enemy types = 54 fragments × 3 languages. Displayed on result page as separate visual section below curse reading.

**Content quality pass**: Cut 7 weakest reading variants (90→83, ~1,458→~945 combinations). Rewrote 8 weakest guidance fragments from self-help tone to oracle/prophetic tone (e.g. "Trust actions, not words" → "Let them prove their words before you carry them. The spirits do not rush."). All 3 languages updated.

**Certificate moved to $2.99**: `SealCertificate` → `CurseCertificate`. Stamp character changed 封→詛. Now shown for all paid plans (`name/seal/full`). Labels updated: "SEAL CERTIFICATE"→"CURSE CERTIFICATE", "Sealed On"→"Cursed On", "Seal No."→"Curse No.". 7 i18n keys × 3 languages updated.

**$2.99 tier now delivers**: Curse reading (5-part, ~945 combinations) + Oracle guidance (3-part personal insight) + Curse certificate (visual, shareable).

### Completed This Session: Steps 6-8 AI Image Enhancement (2026-04-20)

**Image generation**: 3 AI atmospheric backgrounds generated via Gemini API (`scripts/generate-ritual-images.mjs`, model `gemini-3.1-flash-image-preview`, 9:16 aspect, 2K):
- `public/images/purification-ground.jpg` (3,388KB) — dark stone surface with scattered rice/beans, dim candlelight, smoke wisps
- `public/images/blessing-gold.jpg` (3,251KB) — traditional Chinese gold ingots (元寶) with golden flames, red paper offerings, incense smoke
- `public/images/divination-ground.jpg` (3,107KB) — dark temple floor with crescent-shaped wooden poe blocks (筊杯), candlelight, ritual atmosphere

**PurificationStep (Step 6)**: Added `purification-ground.jpg` as fixed background. Background opacity increases with tap warmth (0.55→0.75). Dark overlay fades as scene warms (ink/0.5→0.35). Removed dynamic `bgColor` computed RGB style. Kept particle scatter as foreground interactive layer.

**BlessingStep (Step 7)**: Added `blessing-gold.jpg` as fixed background with 1.5s fade-in animation (`blessing-bg-reveal`). Removed all CSS ingot shapes (`.blessing-ingot`, `.blessing-ingot-body`, `.blessing-ingot-top`, `.blessing-ingot-middle`, `.blessing-ingot-char`, `.blessing-ingot-bottom`) and `@keyframes ingot-fall`. Kept gold radial glow overlay + completion pulse flash on top of image.

**DivinationStep (Step 8)**: Added `divination-ground.jpg` as fixed background (opacity 0.60) with `bg-ink/45` overlay. Removed old gold radial gradient placeholder. Kept interactive poe block animation as foreground.

**CSS cleanup**: Removed dead classes (`.blessing-ingot*`, `@keyframes ingot-fall`). Added `.blessing-bg-reveal` + `@keyframes blessing-bg-fade-in`. Updated reduced-motion rules.

Build passes.

### Completed This Session: Steps 6-8 Quality Fix (2026-04-20)

**Fixes based on `docs/step6-8-review.md` action items. Total paid duration: 8-11s → 20-25s.**

**i18n rewrite (all 3 languages)**: Steps 6-8 titles, subtitles, instructions rewritten from greeting-card tone to dark-cinematic tone. EN: "Blessings & Fortune" → "Receive the Blessing", "May fortune find its way to you" → "Fortune descends upon the cursed ground". Added `divination.spinning`, `divination.landing`, `step7EnemySealed` keys (3 languages). Anger result reframed: "ritual disrupted, try again" → "deity demands more reverence / 神明另有旨意".

**Step 6 (PurificationStep)**: `AUTO_COMPLETE_MS` 3s→10s, `MIN_TAPS_TO_COMPLETE` 3→7. Removed gamey "3/3" counter. Replaced with atmospheric conic-gradient warmth ring that fills as taps increase. Existing particle scatter and background warmth effects unchanged.

**Step 7 (BlessingStep)**: Complete cinematic redesign. Duration 3s→7.5s. 3-phase sequence: (1) 0-3s dark reveal with slow zoom on bg image (scale 1.0→1.15), (2) 3-5s title/subtitle fade in + 18 rising gold spark particles (CSS-only, staggered delays, infinite loop), (3) 5-7.5s enemy name seal reveal ("The curse upon {target} is sealed") + gold pulse flash. No tap interaction — 祈福 is receiving, not doing. Added `.blessing-zoom`, `.blessing-spark`/`@keyframes blessing-rise`, `.blessing-enemy-reveal` CSS. Updated reduced-motion rules.

**Step 8 (DivinationStep)**: Replaced hardcoded "..." with `t('divination.spinning')` / `t('divination.landing')` i18n strings. Meaningful per-phase text: "The blocks fall through the air..." / "Reading the divine answer...".

Build passes.

### Completed This Session: Steps 6-8 Deep Audit Fix (2026-04-20)

**Full audit of all 3 paid steps — code, CSS, i18n, cultural accuracy, audio, edge cases. 9 issues fixed.**

**P0-1: Enemy name fallback bug**: BlessingStep `enemy?.name || enemy?.category` displayed internal ID ("toxicBoss") when no custom name entered. Fixed to use i18n display name via `t('enemies.${category}.name')`.

**P0-2: DivinationStep anger text contradiction**: Text "ritual continues" but auto-navigates to completion. Fixed all 3 languages: "deity has spoken differently / 神明另有回應。儀式已記錄。"

**P0-3: BlessingStep overlay dead transition**: CSS `transition-opacity` on overlay with no state change. Fixed to fade from opacity 1→0.5 when enemy name reveals.

**P1-1: No transitions between paid steps**: RitualOrchestrator had crossfade only for burning step. Added `paidStepVisible` state with 500ms opacity fade for purification→blessing→divination.

**P1-2: Cultural accuracy regression (zh-TW/zh-Hans)**: "掃除殘穢" (Japanese-influenced) → "化解凶煞" (authentic Cantonese). "承接福報" → "祈福進寶" (authentic Taoist). "福報降臨，金光護體" → "元寶焚化，金光引貴人" (describes actual ritual action). "驅散殘留的陰氣" → "化解殘留的煞氣" (correct terminology).

**P1-3: No ambient audio in paid steps**: Free steps had ambient drone throughout. Paid steps were silent. Added ambient drone playback in BlessingStep with cleanup on unmount.

**P1-4: PurificationStep timer started on mount**: Auto-complete timer penalized slow readers. Changed to start on first tap (tapCount > 0) instead of on mount.

**P1-5: Step 8 cast button too bright**: `bg-gold text-ink` was standard CTA. Changed to `bg-gold/20 text-gold border border-gold/30` — semi-transparent dark style matching ritual aesthetic.

**P1-6: BlessingStep gold sparks animate after completion**: Infinite loop particles continued after step completed. Added `completedRef.current ? 'opacity-0' : 'opacity-100'` with 500ms fade-out.

Build passes.

### Completed This Session: Steps 6-8 Deep Audit P2 Fixes (2026-04-20)

**4 critical upgrades that were previously misclassified as "polish". These determine whether $4.99 feels justified.**

**Reduced motion fix**: Paid reduced motion was 1.3s of plain text ($3.84/sec). Now: Step 6 = 4s static bg+text+enemy cleanse, Step 7 = 4s static bg+text, Step 8 = ~3.6s. Total ~11.6s with real visual content. Removed `completedRef.current` early-exit that skipped all content.

**Divination result sounds**: All 3 results had visual bursts but zero audio difference. Added 3 new synthesized sounds to AudioManager: `result-saint` (low bell, sine 180→120Hz, 1.5s), `result-laugh` (light tap, noise 80ms bandpass), `result-anger` (deep drum, noise 250ms lowpass 200Hz). Played via `playTransition` on result reveal.

**Continue button after divination**: Previously auto-navigated at 2s with no user agency at the ritual climax. Now: result sound plays immediately, Continue button fades in at 1.5s, 8s auto-navigate as safety net. User controls when to leave the sacred moment. New i18n key `divination.continue` (3 languages).

**Step 6 enemy name callback**: Step 6 was impersonal — zero connection to the cursed target. Now shows "{target} 的煞氣正在消散" / "The darkness around {target} disperses" on completion. Uses same i18n display name fix from P0-1. New i18n key `step6EnemyCleanse` (3 languages).

Build passes.

---

## Previous Task: EN Blog Complete — ALL COMPLETE

All 9 EN blog articles written, images generated, deployed to production.

---

## Previously Completed This Session

### EN Blog URL 404 Audit (2026-04-18)

Full URL audit of all 9 EN blog articles — 87 URLs checked. 2 broken external Wikipedia links found and fixed.

### EN Blog Second SEO Audit — Verification Pass (2026-04-18)

Full re-audit of all 9 EN blog articles after first audit fixes. Result: 8/9 pass, 1 remaining issue found and fixed.

### EN Blog Full SEO Audit + Fixes (2026-04-18)

Comprehensive SEO audit of all 9 EN blog articles. 9 issues found and fixed across P0/P1/P2 priorities.

### B8 How to Get Rid of Bad Luck — Cluster B Pillar — DEPLOYED

Full rewrite from 225w placeholder to ~3,500w Cluster B pillar. Deployed to production.

### B9 How to Remove a Curse — Cluster B Spoke — DEPLOYED

Full rewrite from 224w placeholder to ~2,300w Cluster B spoke. Deployed to production.

---

## Previously Completed (prior sessions)

- 11/11 ZH blog posts fully written (zh-TW + zh-Hans)
- 21/21 ZH blog images generated
- Full SEO audit of 22 ZH blog posts
- 6 old EN-slug ZH posts deleted, 301 redirects in `next.config.ts`
- Build passes, deployed to Vercel production
- ZH Blog SEO Strategy completed (consolidated into docs/blog-seo-master.md)

---

## EN Blog Status (9 articles — ALL COMPLETE)

| # | Slug | Role | Words | FAQs | Status |
|---|------|------|------:|-----:|--------|
| B1 | what-is-da-siu-yan | C spoke | 4,558 | 6 | **Complete** |
| B2 | how-to-curse-someone | A spoke | 3,807 | 8 | **Complete** |
| B3 | history-of-villain-hitting | C spoke | 3,904 | 7 | **Complete** |
| B4 | what-is-black-magic | A pillar | 4,556 | 8 | **Complete** |
| B5 | revenge-spells | A spoke | 2,570 | 6 | **Complete** |
| B6 | voodoo-magic-curses | C pillar | 3,681 | 6 | **Complete** |
| B7 | hex-spells-curses | A spoke | 2,844 | 6 | **Complete** |
| B8 | how-to-get-rid-of-bad-luck | B pillar | ~3,500 | 7 | **Complete** |
| B9 | how-to-remove-a-curse | B spoke | ~2,300 | 5 | **Complete** |

---

## Next Steps — Allen's Growth Roadmap (2026-04-18)

Four-phase plan, strictly sequential. Don't skip ahead.

### Phase 1: Ritual Redesign + Paid Tier Restructure (COMPLETE)
- Redesign ritual flow to match traditional 8-step process
- Restructure pricing: Free / $2.99 (reading + guidance + cert) / $4.99 (ritual completion) / $6.99 (all)
- Full discussion: `docs/ritual-redesign.md`
- **Landing page updated** (2026-04-19): HowItWorksSection 8-step + WhatIsSection atmospheric bg + all 封印 references removed
- **Ritual UI refinements** (2026-04-19): PaywallTransition/ResultStep simplified, AI-generated background images (tiger+flames), dual paper figure image sets (JPG+PNG), candle stands, ambient sound fix
- **$2.99 tier enhanced** (2026-04-19): Oracle guidance system, content quality pass, certificate moved from $4.99 (Seal→Curse, 封→詛)
- **Steps 6-8 AI image enhancement** (2026-04-20): 3 AI-generated atmospheric backgrounds integrated
- **Steps 6-8 quality fix** (2026-04-20): Paid duration 8-11s → 20-25s. Step 6: 3→7 taps, 3→10s auto, warmth ring. Step 7: 3s→7.5s cinematic (gold particles, slow zoom, enemy name seal). Step 8: "..." replaced with meaningful i18n. Anger reframed. All text dark-cinematic tone (3 languages). Full report: `docs/step6-8-review.md`

### Phase 2: Viral Share Engine (parallel with Phase 1)
- Revise share button UX and share content
- Goal: make something cool enough that visitors share on X and TikTok organically

### Phase 3: Seedance 2 Video — "Wow" Factor
- AI-generated dark ritual video
- **Needs tech spike first**: test cost, speed, quality before committing

### Phase 4: Paid Acquisition (after 1-3 complete)
- Product polished, share engine live, wow factor in place
- Then buy ads: Meta (Instagram/TikTok) or Google Search

### Ongoing (background)
- Monitor GSC for indexing and click data (weekly check)
