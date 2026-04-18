# BeatPetty — Current Process State

> **Every new session: read this file first. Every session end: update this file.**
> Last updated: 2026-04-18

---

## Active Task: Ritual Redesign + Paid Tier Restructure

### Status: PLANNING (2026-04-18)

Redesigning ritual flow to match traditional Hong Kong 8-step process (八部曲) and restructuring paid tiers.

- **Discussion doc**: `docs/ritual-redesign.md` — current discussion, options, unresolved questions
- **Traditional reference**: `docs/ritual-process-hk.md` — correct Hong Kong 打小人 process
- **3 unresolved questions** (need Allen's decision):
  1. Free users' ritual ending: keep fake 封印 / direct result / 擲筊 for all?
  2. $4.99 "new ritual" = what exactly?
  3. Main flow includes all 8 steps or abbreviated for free?
- **Pricing structure (Allen confirmed)**: Free / $2.99 (reading + certificate) / $4.99 (new ritual experience) / $6.99 (all combined)
- **Current ritual gaps**: missing 4/8 steps (過火, 化解, 祈福, 擲筊), 1 step needs upgrade (祭白虎), 1 non-traditional step to remove (封印)

### Previous Task: EN Blog Complete — ALL COMPLETE

All 9 EN blog articles written, images generated, deployed to production.

---

## Completed This Session: URL Audit + SEO Verification + Deployment (2026-04-18)

### EN Blog URL 404 Audit (2026-04-18)

Full URL audit of all 9 EN blog articles — 87 URLs checked (32 internal blog paths, 8 /ritual paths, 25 Wikipedia URLs, 28 image paths). 2 broken external Wikipedia links found and fixed:

- **B7 hex-spells-curses**: `https://en.wikipedia.org/wiki/Hex_(witch)` (404) → `https://en.wikipedia.org/wiki/Hex` (200)
- **B8 how-to-get-rid-of-bad-luck**: `https://en.wikipedia.org/wiki/Salt_in_Roman_religion` (404) → `https://en.wikipedia.org/wiki/Salt#In_religion` (200)

All 87 URLs now return 200. Deployed to production.

### EN Blog Second SEO Audit — Verification Pass (2026-04-18)

Full re-audit of all 9 EN blog articles after first audit fixes. Result: 8/9 pass, 1 remaining issue found and fixed:

- **B3 description**: was 142 chars (under 150 min) → fixed to 150 chars ("and now reaches your screen" wording)
- All 9 original audit fixes verified as correctly applied
- Zero keyword cannibalization across all 9 articles
- All cluster linking rules satisfied
- Deployed to production

### EN Blog Full SEO Audit + Fixes (2026-04-18)

Comprehensive SEO audit of all 9 EN blog articles against BLOG_SEO_STANDARD.md + blog-seo-en.md. 9 issues found and fixed:

**P0 Fixes:**
- B9: added 3 external links (Wikipedia: curse tablet, Chinese folk religion, curanderismo, nocebo effect) — was zero
- B5: resolved "karma spell" keyword cannibalization with B8 — removed from B5 keywords, shortened karma spell section from ~230w to ~120w, added link to B8's full section
- B8: generated 2 new pillar images (bad-luck-signs.jpg 151KB, bad-luck-four-step.jpg 152KB) — now 4/4 images

**P1 Fixes:**
- B5 title trimmed: 64→55 chars
- B9 title trimmed: 62→53 chars
- B3 description trimmed: ~167→~147 chars
- B5 description trimmed: ~177→~150 chars
- B7 description trimmed: ~189→~140 chars
- B9 description trimmed: ~169→~140 chars
- B3 H1 fixed: "A 300-Year Curse That Refused to Die" → "Villain Hitting — 300 Years of a Curse That Refused to Die"

**P2 Fixes:**
- B1: removed "Goose Neck Bridge Hong Kong" from keywords (B3 owns this)
- B3: removed "Chinese folk magic" from keywords (B1 owns this)
- B8: added "how to undo bad luck" naturally in four-step section
- B9: added "get rid of a curse spell" naturally in intro

### B8 How to Get Rid of Bad Luck — Cluster B Pillar — DEPLOYED

- Full rewrite from 225w placeholder to ~3,500w Cluster B pillar
- Keywords: how to get rid of bad luck (1,000), bad luck (3,600), how to remove bad luck (480), karma spell (720), how to undo bad luck (480), is bad luck real (480), signs of bad luck, how to reverse bad luck
- 8 H2 + 3 H3 sections: What Is Bad Luck, Signs of Bad Luck (spiritual + observable), Why Do You Have Bad Luck (spiritual/psychological/environmental), Cleansing Rituals Across Cultures (salt/sage/egg/misogi/Ganga/Da Siu Yan), Karma Spell, How Long Does Bad Luck Last, Cleansing Methods Compared (table), Universal Four-Step Method
- 7 FAQs: signs of bad luck, curse of bad luck, how long, is it real, reverse, why, curse vs bad luck
- 1 comparison table: 7 cleansing methods across traditions
- HowTo steps: 4-step universal cleansing method
- 2 images: bad-luck-cleansing.jpg (178KB), bad-luck-karma.jpg (174KB)
- Internal links: B9, B4, B5, B7, B2, B1, B3, /ritual (10+)
- External links: Wikipedia (evil eye, salt in Roman religion, nocebo)
- `<BlogCtaBlock />` + in-text CTA to /ritual
- Deployed to production

### B9 How to Remove a Curse — Cluster B Spoke — DEPLOYED

- Full rewrite from 224w placeholder to ~2,300w Cluster B spoke
- Keywords: how to remove a curse (1,300), signs of a curse (590), curse protection (480), how to tell if someone put a curse on you (210), get rid of a curse spell (210), how to break a curse (320), signs you are cursed (590)
- 6 H2 + 2 H3 sections: Signs You Are Cursed (pattern test + what it's not), How to Tell If Someone Put a Curse on You, Curse-Breaking Rituals (salt/fire, mirror reversal, Da Siu Yan, egg cleansing), Universal Four-Step Method, Curse Protection
- 5 FAQs: how to tell if cursed, how to break a curse, can a curse be removed, signs you are cursed, curse protection
- HowTo steps: 4-step curse-breaking method
- 1 image: curse-removal-ritual.jpg (181KB)
- Internal links: B8 (pillar), B4, B6, B7, B2, B1, /ritual (10+)
- `<BlogCtaBlock />` + in-text CTA to /ritual
- Deployed to production

---

## Previously Completed (this session)

### B5 Revenge Spells Rewrite — DEPLOYED (2026-04-18)

- Full rewrite from 190w placeholder to 2,570w Cluster A spoke
- 6 FAQs, 2 images, 8+ internal links
- Deployed to production

### B6 Voodoo Magic Curses Pillar Rewrite — DEPLOYED (2026-04-18)

- Full rewrite from ~200w placeholder to ~3,500w Cluster C pillar
- 6 FAQs, 3 images, 5 comparison tables
- Commit: `da1fcbb`, deployed to production

### B7 Hex Spells Curses Spoke Rewrite — DEPLOYED (2026-04-17)

- Full rewrite from ~200w placeholder to ~2,800w Cluster A spoke
- 6 FAQs, 2 images, 8 internal links
- Commit: `c6484ee`

### B3 + B2 Minor Fixes — DEPLOYED (2026-04-17)

- B3: added 2 FAQs (cost + home practice) to hit pillar minimum of 7
- B2: added cross-link to B4 pillar in intro paragraph
- Same commit: `c6484ee`

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

## EN Blog Status (9 articles — ALL COMPLETE)

| # | Slug | Role | Words | FAQs | Status |
|---|------|------|------:|-----:|--------|
| B1 | what-is-da-siu-yan | C spoke | 4,558 | 6 | **Complete** |
| B2 | how-to-curse-someone | A spoke | 3,807 | 8 | **Complete** |
| B3 | history-of-villain-hitting | C spoke | 3,904 | 7 | **Complete** |
| B4 | what-is-black-magic | A pillar | 4,556 | 8 | **Complete** |
| B5 | revenge-spells | A spoke | 2,570 | 6 | **Complete (2026-04-18)** |
| B6 | voodoo-magic-curses | C pillar | 3,681 | 6 | **Complete (2026-04-18)** |
| B7 | hex-spells-curses | A spoke | 2,844 | 6 | **Complete (2026-04-17)** |
| B8 | how-to-get-rid-of-bad-luck | B pillar | ~3,500 | 7 | **Complete (2026-04-18)** |
| B9 | how-to-remove-a-curse | B spoke | ~2,300 | 5 | **Complete (2026-04-18)** |

---

## Paused Task: Paid Tier Product Upgrade

### Status: SUPERSEDED by Ritual Redesign (2026-04-18)

This section's original plan (progressive reveal, canvas certificate, fix false claims) has been superseded by the full ritual redesign. See `docs/ritual-redesign.md` for the new approach.

---

## Next Steps — Allen's Growth Roadmap (2026-04-18)

Four-phase plan, strictly sequential. Don't skip ahead.

### Phase 1: Ritual Redesign + Paid Tier Restructure (CURRENT)
- Redesign ritual flow to match traditional 8-step process
- Restructure pricing: Free / $2.99 (reading + cert) / $4.99 (new ritual) / $6.99 (all)
- Full discussion: `docs/ritual-redesign.md`
- **Blocked on**: Allen's decision on 3 key questions (free user ending, $4.99 content, main flow scope)
- Traditional reference: `docs/ritual-process-hk.md`

### Phase 2: Viral Share Engine (parallel with Phase 1)
- Revise share button UX and share content
- Goal: make something cool enough that visitors share on X and TikTok organically
- Target both free and paid users — free users are the volume driver
- Hacker growth: each share = free acquisition

### Phase 3: Seedance 2 Video — "Wow" Factor
- AI-generated dark ritual video (Seedance 2 API)
- Possible uses: mainpage background animation, paid tier enhancement, shareable clip
- **Needs tech spike first**: test cost, speed, quality before committing to placement
- If fast+cheap enough → mainpage; if slow/expensive → paid tier only

### Phase 4: Paid Acquisition (after 1-3 complete)
- Product polished, share engine live, wow factor in place
- Then buy ads: Meta (Instagram/TikTok audience overlap) or Google Search
- Don't scale traffic until conversion funnel is proven

### Ongoing (background)
- Monitor GSC for indexing and click data (weekly check)
- Consider Phase 2 blog articles when existing content establishes authority
