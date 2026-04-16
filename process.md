# BeatPetty — Current Process State

> **Every new session: read this file first. Every session end: update this file.**
> Last updated: 2026-04-15

---

## Active Task: Paid Tier Product Upgrade

### Status: PLANNING

### Problem Statement

All three paid tiers have delivery quality issues:

| Tier | Price | Current Delivery | Problem |
|------|-------|-----------------|---------|
| Curse Reading | $2.99 | 5 paragraphs of text, assembled from JSON | No visual artifact, no ceremony, no reveal animation. Just plain text on a page. |
| Sealing Ritual | $4.99 | CSS-styled certificate (NOT downloadable image) + 24px seal stamp | "Enhanced sealing animation" is misleading — free users see the same 3s animation. Certificate is CSS, not a savable image. |
| Full Power | $6.99 | $2.99 + $4.99 combined | Only tier that logically works — but only because both lower tiers are included |

### Root Causes

1. **$2.99 reading has no ceremony** — 5 paragraphs dumped at once. No progressive reveal, no "materializing from ashes" effect. Free users already see paragraph 1 in the blur preview.
2. **No visual artifact at $2.99** — $4.99 has a certificate. $2.99 has nothing users can save/share. Close the page = gone.
3. **$4.99 certificate is CSS, not a real image** — Users can't download it. Not canvas-generated. No share functionality.
4. **"Enhanced sealing animation" is false advertising** — The 3s sealing transition runs for ALL users (free included). The $4.99 tier adds nothing to the animation itself.

### Architecture Facts (from code review)

- Reading generation: `src/lib/curseReading.ts` — 5 components (opening, impact, timing, weakness, closing), 3 options each = 243 combos per enemy type
- Result page: `src/app/[locale]/result/page.tsx` — plan === 'name' shows reading, plan === 'seal' shows certificate, plan === 'full' shows both
- Sealing transition: `src/components/ritual/SealingTransition.tsx` — runs for ALL users, 3 seconds
- Certificate: `src/components/SealCertificate.tsx` — CSS-only, not canvas-generated, not downloadable
- Stripe plans: `src/lib/stripe.ts` — name($2.99), seal($4.99), full($6.99)

### Planned Improvements (Priority Order)

1. **$2.99 Reading — Progressive Reveal Animation**
   - Each paragraph "materializes from ashes" one at a time (1-2s per paragraph)
   - Total reveal: ~10-12s instead of instant dump
   - Fire/smoke particle effects during reveal

2. **$2.99 Reading — Curse Scroll Image (Canvas-generated)**
   - Generate a dark parchment/scroll visual with the reading text
   - Users can save and share (like the seal certificate but for reading)
   - Unique rune/sigil per reading combination (visual variety beyond text)

3. **$4.99 Certificate — Make it a Real Downloadable Image**
   - Convert CSS certificate to Canvas-generated PNG
   - Add download button + share button
   - Currently CSS-only with no save functionality

4. **Fix "Enhanced Sealing Animation" Claim**
   - Option A: Make it real — add exclusive sealing visual for $4.99 users (e.g., stronger seal stamp, different animation)
   - Option B: Remove the claim from pricing copy
   - Current pricing copy says "Enhanced sealing animation" but free users see the same thing

5. **$2.99 Reading Content Upgrade**
   - Add a "prophecy" paragraph with specific details (dates, numbers, signs)
   - More personalization beyond just {target} name replacement
   - Enemy-type-specific imagery and language

---

## Previously Completed (this session)

### Landing Page Keyword Cannibalization Fix — DEPLOYED

1. **EN H1**: `"Curse Someone With a 300-Year-Old Chinese Ritual"` → `"Your Enemy's Luck Ends Here"` (no longer competes with B2 "How to Curse Someone")
2. **EN WhatIs**: `"What Is This Curse Ritual?"` → `"An Ancient Curse, Alive Online"` + teaser text + link to B1 blog post (no longer competes with B1)
3. **EN Meta**: `"Online Curse Ritual — Free Chinese Curse"` → `"BeatPetty — Free Online Curse Ritual"` (brand-first)
4. **ZH H1**: `"打小人 — 在線正宗詛咒儀式"` → `"你的小人，氣數已盡"` (CTA-oriented, no longer competes with ZH1)
5. **ZH WhatIs**: Removed 驚蟄/鵝頸橋 keywords, replaced with teaser + link to ZH10
6. **ZH Meta**: Removed 鵝頸橋 keyword, brand-focused
7. **WhatIsSection component**: Added locale-aware blog link (EN→B1, ZH→ZH10)
8. **All changes applied to zh-TW + zh-Hans**
9. **Deployed to production**: `npx vercel --prod --yes`

---

## Previously Completed (prior sessions)

- 11/11 ZH blog posts fully written (zh-TW + zh-Hans)
- 21/21 ZH blog images generated
- Full SEO audit of 22 ZH blog posts
- 6 old EN-slug ZH posts deleted, 301 redirects in `next.config.ts`
- Build passes, deployed to Vercel production
- ZH Blog SEO Strategy completed (docs/blog-seo-zh.md)

---

## Next Steps

1. Implement $2.99 reading improvements (progressive reveal + scroll image)
2. Convert $4.99 certificate to downloadable canvas image
3. Fix "enhanced sealing animation" claim
4. Deploy and test on real devices
5. Submit updated sitemap to GSC
6. Monitor GSC for indexing and click data
