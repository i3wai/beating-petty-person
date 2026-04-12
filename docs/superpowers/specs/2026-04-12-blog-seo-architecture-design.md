# Blog SEO Architecture — Design Spec

**Date**: 2026-04-12
**Scope**: English blog articles — 9 articles, 3 topic clusters, technical SEO infrastructure
**Reviewers**: Dr. Sarah Chen (Technical SEO), Marcus Rivera (Content SEO), Aisha Patel (Competitive SEO)
**Status**: Approved by expert panel

---

## 1. Overview

BeatPetty's blog ("The Grimoire") will contain 9 articles organized into 3 topic clusters. The strategy prioritizes low-KD keywords first, builds topical authority through pillar-spoke internal linking, and leverages BeatPetty's unique interactive ritual as a competitive moat.

### Key Principles

- **Spokes support pillars.** Low-KD spoke articles publish first, building semantic context before high-KD pillars are expanded.
- **Every article links to /ritual.** The free curse ritual is the conversion endpoint for all content.
- **Content is the product.** Dark, mysterious, Grimoire tone. Not academic, not comedic.
- **Technical SEO is P0.** Zero JSON-LD exists in the codebase. Fix before any article goes live.

---

## 2. Article Matrix

### Cluster A: Curse & Hex Magic (~50,000+ verified monthly search volume)

| # | Slug | Role | Primary Keywords | Vol | KD | Words | FAQ Count |
|---|------|------|-----------------|------|-----|-------|-----------|
| B4 | `/blog/what-is-black-magic` | **Pillar** | what is black magic, black magic, is black magic real, black magic spells | 2,900 + 22,200 + 1,900 + 1,300 | 60 | 3,000-4,000 | 6-8 |
| B2 | `/blog/how-to-curse-someone` | Spoke | how to curse someone, how to curse people, how to curse a person | 1,300 + 590 + 480 | 25 | 1,500-2,000 | 4-5 |
| B7 | `/blog/hex-spells-curses` | Spoke | hexes, hexing, how to hex someone, hex spell, hex spells | 1,900 + 1,600 + 880 + 590 + 480 | 25-33 | 1,800-2,200 | 4-5 |
| B5 | `/blog/revenge-spells` | Spoke | revenge spells, revenge spell, spells for revenge | 590 + 320 + ~200 | 24 | 1,500-1,800 | 4-5 |

**Cluster A secondary keywords to weave in:**
- "white magic vs black magic" (1,600 vol) → B4 subsection
- "black magic meaning" (880 vol) → B4
- "how to do black magic" (480 vol) → B4
- "black magic ritual" (320 vol) → B4
- "how to put a curse on someone" (1,300 vol) → B2
- "hexes and curses" (320 vol) → B7
- "put a hex on someone" (260 vol) → B7
- "how do you hex someone" (590 vol) → B7

### Cluster B: Bad Luck & Curse Removal (~4,560+ verified monthly search volume)

| # | Slug | Role | Primary Keywords | Vol | KD | Words | FAQ Count |
|---|------|------|-----------------|------|-----|-------|-----------|
| B8 | `/blog/how-to-get-rid-of-bad-luck` | **Pillar** | how to get rid of bad luck, bad luck, how to remove bad luck | 1,000 + 3,600 + 480 | 23-55 | 2,500-3,500 | 6-8 |
| B9 | `/blog/how-to-remove-a-curse` | Spoke | how to remove a curse, signs of a curse, curse protection | 1,300 + 590 + 480 | ~30 | 1,500-2,000 | 4-5 |

**Cluster B secondary keywords:**
- "karma spell" (720 vol) → B8 (defensive/recovery intent, NOT revenge)
- "how to undo bad luck" (480 vol) → B8
- "is bad luck real" (480 vol) → B8 FAQ
- "how to tell if someone put a curse on you" (210 vol) → B9
- "get rid of a curse spell" (210 vol) → B9

### Cluster C: World Curse Traditions (~2,400+ verified monthly search volume)

| # | Slug | Role | Primary Keywords | Vol | KD | Words | FAQ Count |
|---|------|------|-----------------|------|-----|-------|-----------|
| B6 | `/blog/voodoo-magic-curses` | **Pillar** | voodoo magic, is voodoo demonic, voodoo hex | 1,600 + 480 + 210 | 41 | 2,000-2,500 | 5-6 |
| B1 | `/blog/what-is-da-siu-yan` | Spoke | villain hitting, Da Siu Yan, what is beating petty person | ~200 | <20 | 1,200-1,500 | 3-4 |
| B3 | `/blog/history-of-villain-hitting` | Spoke | Goose Neck Bridge Hong Kong, Jingzhe curse tradition | ~500 | <15 | 1,200-1,500 | 3-4 |

**Cluster C secondary keywords:**
- "is voodoo real" (1,900 vol) → B6 FAQ (major long-tail find)
- "how does voodoo work" (590 vol) → B6
- "voodoo vs black magic" (320 vol) → B6, links to B4
- "Chinese folk magic" (260 vol) → B1
- "voodoo curse" (~300 vol) → B6

---

## 3. Topic Cluster Internal Link Map

### Cluster A Internal Links

```
B4 (pillar: what-is-black-magic)
  → /ritual (CTA)
  → B2 how-to-curse-someone (same cluster spoke)
  → B7 hex-spells-curses (same cluster spoke)
  → B5 revenge-spells (same cluster spoke)
  → B8 how-to-get-rid-of-bad-luck (cross-cluster)
  → B6 voodoo-magic-curses (cross-cluster)

B2 (spoke → pillar B4)
  → /ritual (CTA)
  → B4 what-is-black-magic (back to pillar)
  → B7 hex-spells-curses (same cluster)
  → B8 how-to-get-rid-of-bad-luck (cross-cluster)

B7 (spoke → pillar B4)
  → /ritual (CTA)
  → B4 what-is-black-magic (back to pillar)
  → B5 revenge-spells (same cluster)
  → B2 how-to-curse-someone (same cluster)
  → B1 what-is-da-siu-yan (cross-cluster)

B5 (spoke → pillar B4)
  → /ritual (CTA)
  → B4 what-is-black-magic (back to pillar)
  → B7 hex-spells-curses (same cluster)
  → B8 how-to-get-rid-of-bad-luck (cross-cluster)
```

### Cluster B Internal Links

```
B8 (pillar: how-to-get-rid-of-bad-luck)
  → /ritual (CTA)
  → B9 how-to-remove-a-curse (same cluster spoke)
  → B4 what-is-black-magic (cross-cluster)
  → B5 revenge-spells (cross-cluster)

B9 (spoke → pillar B8)
  → /ritual (CTA)
  → B8 how-to-get-rid-of-bad-luck (back to pillar)
  → B4 what-is-black-magic (cross-cluster)
  → B6 voodoo-magic-curses (cross-cluster)
```

### Cluster C Internal Links

```
B6 (pillar: voodoo-magic-curses)
  → /ritual (CTA)
  → B1 what-is-da-siu-yan (same cluster spoke, brand identity)
  → B3 history-of-villain-hitting (same cluster spoke)
  → B4 what-is-black-magic (cross-cluster)
  → B7 hex-spells-curses (cross-cluster)

B1 (spoke → pillar B6)
  → /ritual (CTA)
  → B6 voodoo-magic-curses (back to pillar)
  → B3 history-of-villain-hitting (same cluster)
  → B2 how-to-curse-someone (cross-cluster)

B3 (spoke → pillar B6)
  → /ritual (CTA)
  → B6 voodoo-magic-curses (back to pillar)
  → B1 what-is-da-siu-yan (same cluster)
  → B4 what-is-black-magic (cross-cluster)
```

### Anchor Text Rules

| Link Type | Rule | Example |
|-----------|------|---------|
| Link to pillar | Use target keyword | "black magic" → B4 |
| Link to spoke | Use descriptive text | "hex spells and curses" → B7 |
| Link to /ritual | Use CTA copy | "Try the free curse ritual" |
| Cross-cluster | Natural language | "In Chinese tradition, cursing works differently" |
| **NEVER** | "click here", "learn more", "read more" | — |

---

## 4. Per-Article Template

```markdown
---
title: "[Primary keyword] — [Compelling subtitle]"    # < 60 chars
description: "[Keyword-rich description with CTA tone]"  # < 155 chars
keywords: [primary, secondary1, secondary2, ...]
date: "2026-04-XX"
cluster: "A" | "B" | "C"           # NEW: for blog hub grouping
updatedDate: "2026-04-XX"           # NEW: for freshness signal
ogImage: "/og-blog-[slug].png"      # optional
---

## H1: [Primary keyword + compelling hook]

[Opening: 2-3 sentences containing primary keyword. Direct hit on search intent. No fluff.]

## H2: [First subtopic — contains secondary keyword]

[Deep content. 600-1000 words for pillars, 400-600 for spokes.]

## H2: [Second subtopic]

[Contains internal link to pillar or same-cluster spoke.]

## H2: [Third subtopic]

[Contains cross-cluster link. For spokes, this is the Da Siu Yan angle:]

### [Da Siu Yan section — 50-80 words, UNIQUE per article]
[Context-specific transition. Each article has a DIFFERENT angle:]
- B4: "How Da Siu Yan fits among global black magic traditions"
- B7: "Eastern hexing vs Western hexing"
- B5: "When revenge meets real cultural practice"
- B8: "Ancient bad luck removal rituals"
- B6: "Voodoo vs Da Siu Yan — two traditions compared"
- B2: "Try it yourself — the online curse ritual"
- B9: "Fighting fire with fire — curse removal traditions"
- B1: "The original curse ritual from Hong Kong"
- B3: "From Goose Neck Bridge to your screen"

[CTA Block — styled dark/grimoire component]
> Enough reading. Try it yourself.
> [Begin the Curse Ritual →]
> Free. 60 seconds. What if it works?

## H2: Frequently Asked Questions

### [FAQ 1 — targets specific long-tail keyword]
### [FAQ 2 — targets PAA question]
### [FAQ 3 — targets long-tail keyword]
### [FAQ 4-8 for pillars, 4-5 for spokes]
```

---

## 5. Publishing Schedule

| Week | Articles | Rationale |
|------|----------|-----------|
| **1** | B8 (bad luck pillar, 2,500-3,500 words) + B2 (how to curse, 1,500-2,000 words) | Highest-volume quick wins (KD23-25). Internal links work from day 1. |
| **2** | B6 (voodoo pillar, 2,000-2,500 words) | KD19 snippet opportunity, lowest competition pillar |
| **3** | B7 (hex spells, 1,800-2,200 words) + B9 (remove curse, 1,500-2,000 words) | Cluster A spoke + Cluster B spoke |
| **4** | B5 (revenge spells, 1,500-1,800 words) + B1 (Da Siu Yan, 1,200-1,500 words) | Cluster A spoke + Cluster C spoke (brand identity) |
| **5** | B3 (history, 1,200-1,500 words) | Complete Cluster C |
| **6** | B4 (black magic pillar, 3,000-4,000 words) | Highest-volume, highest-KD. Published LAST when 8 spokes provide semantic support. |

**Rule**: Never publish more than 2 articles per week. Each article gets its own freshness signal and promotion window.

---

## 6. Technical SEO Requirements (P0 — Before Any Article Publishes)

### 6.1 JSON-LD Structured Data (Zero exists currently)

| Schema | Where | Priority |
|--------|-------|----------|
| `Organization` | Root `layout.tsx` | P0 |
| `Article` | Each blog post `generateMetadata` | P0 |
| `FAQPage` | Each blog post with FAQ section | P0 |
| `BreadcrumbList` | Each blog post + blog hub | P0 |
| `HowTo` | B2, B8, B9 (how-to intent articles) | P1 |
| `WebSite` | Root `layout.tsx` | P2 |
| `Speakable` | B4, B6 (voice search targets) | P3 |

### 6.2 Blog Post Metadata Fixes

Current `generateMetadata` in `/blog/[slug]/page.tsx` is missing:
- `alternates.canonical` — must set explicit canonical URL
- `alternates.languages` — must declare hreflang for all 3 locales
- `openGraph.type: "article"` with `publishedTime` and `modifiedTime`

### 6.3 PostMeta Interface Extensions

Add to `src/lib/content.ts` PostMeta:
```typescript
{
  // existing fields...
  cluster: "A" | "B" | "C";      // for blog hub grouping
  updatedDate?: string;            // for dateModified in Article schema
}
```

### 6.4 Blog Hub Restructure

Current `/blog` lists posts chronologically. Restructure to:
- H1: "The Grimoire — Ancient Curse Knowledge & Forbidden Wisdom"
- Brief intro (2-3 sentences with "curse ritual", "ancient magic")
- 3 cluster sections, each with pillar featured first
- CTA to /ritual at bottom

### 6.5 Related Articles Component

Add to blog post template (`/blog/[slug]/page.tsx`):
- "Related Articles" section at bottom
- Shows 2-3 same-cluster articles
- Uses cluster frontmatter field for grouping

### 6.6 Breadcrumb Navigation

Add breadcrumb UI + BreadcrumbList schema:
- `Home > Blog > [Article Title]`
- Implemented as a shared component

### 6.7 Sitemap Migration

- Replace static `public/sitemap.xml` with dynamic generation
- Add blog post URLs automatically
- Remove `changefreq` and `priority` (Google ignores them)
- Keep accurate `lastmod` from frontmatter dates
- Add `xhtml:link` hreflang alternates in sitemap

### 6.8 301 Redirects

When articles go live, add redirects in `next.config.ts`:
- `/en/what-is` → `/en/blog/what-is-da-siu-yan`
- `/en/how-it-works` → `/en/blog/how-to-curse-someone`
- `/en/history` → `/en/blog/history-of-villain-hitting`
- Same for zh-TW and zh-Hans variants
- Remove old MDX files and page components after redirect is verified

### 6.9 Robots Directives

- `/result` page: add `noindex` (utility page, not organic target)

---

## 7. Existing Page Content Migration

| Old Route | New Route | Action |
|-----------|-----------|--------|
| `/[locale]/what-is` | `/[locale]/blog/what-is-da-siu-yan` | 301 redirect, move MDX to blog/, expand content |
| `/[locale]/how-it-works` | `/[locale]/blog/how-to-curse-someone` | 301 redirect, move MDX to blog/, expand content |
| `/[locale]/history` | `/[locale]/blog/history-of-villain-hitting` | 301 redirect, move MDX to blog/, expand content |

**Risk**: Low. Pages are 10 days old with zero backlinks. No equity to lose.

**Process**:
1. Create new blog MDX files with expanded content
2. Add 301 redirects in next.config.ts
3. Remove old page components and MDX files
4. Verify redirects work before deploying

---

## 8. Content Differentiation Strategy

BeatPetty has 4 unique advantages no competitor can replicate:

1. **Interactive ritual.** Only site in the SERP where users can actually DO something. Dwell time advantage: 2-5 min vs 30 sec on Wikipedia.
2. **Original data.** "We analyzed 1,000+ rituals. Most common enemy: The Backstabber (34%)." Data-driven content earns backlinks.
3. **First-person experiential voice.** E-E-A-T rewards Experience. Our Grimoire tone + first-person is something Wikipedia cannot do.
4. **Cultural authenticity.** Real Chinese heritage (Goose Neck Bridge, 300 years), not made-up Wicca. Nobody else in the English SERP has this.

---

## 9. FAQ Keyword Targets (35-42 Total)

### B4 FAQ (6-8)
- "Is black magic real?" (1,900 vol)
- "What is the difference between black magic and white magic?" (~590 vol)
- "Is black magic dangerous?" (~480 vol)
- "Can black magic be removed?" (~320 vol)
- "Types of black magic around the world" (~260 vol)
- "How does black magic work?" (~480 vol)

### B8 FAQ (6-8)
- "What are signs of bad luck?" (~480 vol)
- "Can someone put a curse of bad luck on you?" (~260 vol)
- "How long does bad luck last?" (~320 vol)
- "Is bad luck real?" (480 vol)
- "How to reverse bad luck?" (~260 vol)
- "Why do I have bad luck?" (~320 vol)

### B6 FAQ (5-6)
- "Is voodoo real?" (1,900 vol — major find)
- "How does voodoo work?" (~590 vol)
- "Is voodoo demonic?" (480 vol)
- "Voodoo vs black magic" (~320 vol)
- "What is voodoo magic?" (~260 vol)

### B7 FAQ (4-5)
- "What does hexing mean?" (1,300 vol)
- "What does it mean to hex someone?" (210 vol)
- "How does hex work?" (260 vol)
- "Are hexes real?" (~260 vol)

### B2 FAQ (4-5)
- "How do you curse someone?" (210 vol)
- "How to curse effectively?" (210 vol)
- "Can you curse someone online?" (~200 vol)
- "Is cursing someone real?" (~200 vol)

### B9 FAQ (4-5)
- "How to tell if someone put a curse on you?" (210 vol)
- "How to break a curse?" (~320 vol)
- "Can a curse be removed?" (~260 vol)
- "Signs you are cursed" (~590 vol)

### B5 FAQ (4-5)
- "Do revenge spells work?" (~260 vol)
- "Are revenge spells real?" (~200 vol)
- "What is a karma spell?" (~320 vol)
- "How to cast a revenge spell?" (~260 vol)

### B1 FAQ (3-4)
- "What is Da Siu Yan?" (~50 vol)
- "What does 打小人 mean?" (~50 vol)
- "Is beating the petty person real?" (~30 vol)

### B3 FAQ (3-4)
- "Where to beat petty person in Hong Kong?" (~200 vol)
- "When is the best time for Da Siu Yan?" (~100 vol)
- "What happens during villain hitting?" (~100 vol)

---

## 10. Phase 2 (Post-Launch Enhancements)

### Month 2-3: Content Expansion
- Expand B4 to full 3,000-4,000 word pillar (if published thin initially)
- Expand B8 to full 2,500-3,500 word pillar
- Add mini-ritual embed component (lazy-loaded, < 15KB gzipped)

### Month 2-3: New Articles
- "Signs you've been cursed" (2,400 vol, KD30)
- "What is the evil eye" (8,100 vol, KD45)
- "The psychology of revenge" (academic angle, .edu backlink bait)

### Month 4-6: Authority Building
- "Famous curses in history" (evergreen, shareable)
- "Chinese folk religion traditions" (broader topical authority)
- Target 30+ articles total for meaningful topical authority

### Backlink Strategy
- **Tier 1**: Digital PR — "Ancient Chinese curse ritual goes digital" → tech/culture media
- **Tier 2**: Niche directories — occult/spirituality, Chinese culture, "weird web"
- **Tier 3**: Content-driven — original data studies, infographics, embeddable mini-ritual widget

---

## 11. Realistic Ranking Timeline (Expert Consensus)

| KD Range | Example Keywords | Timeline to Page 1 |
|----------|-----------------|-------------------|
| < 20 | "villain hitting", "is voodoo demonic" | 2-4 months |
| 20-30 | "how to curse someone", "how to get rid of bad luck", "revenge spells" | 4-8 months |
| 30-45 | "voodoo magic", "hexes" | 6-12 months |
| 60+ | "black magic", "bad luck" (head term) | 12-18 months with aggressive execution |

---

## 12. Files to Create/Modify

### New Files
| File | Purpose |
|------|---------|
| `content/en/blog/how-to-get-rid-of-bad-luck.mdx` | B8 article |
| `content/en/blog/how-to-curse-someone.mdx` | B2 article (migrated from how-it-works) |
| `content/en/blog/voodoo-magic-curses.mdx` | B6 article |
| `content/en/blog/hex-spells-curses.mdx` | B7 article |
| `content/en/blog/revenge-spells.mdx` | B5 article |
| `content/en/blog/what-is-da-siu-yan.mdx` | B1 article (migrated from what-is) |
| `content/en/blog/history-of-villain-hitting.mdx` | B3 article (migrated from history) |
| `content/en/blog/what-is-black-magic.mdx` | B4 article |
| `content/en/blog/how-to-remove-a-curse.mdx` | B9 article |
| (Same structure for zh-TW and zh-Hans — Phase 2) | |
| `src/components/Breadcrumb.tsx` | Breadcrumb navigation component |
| `src/components/RelatedArticles.tsx` | Related articles component |
| `src/components/BlogCtaBlock.tsx` | Dark styled CTA block for blog posts |
| `src/lib/json-ld.ts` | JSON-LD generation utilities |

### Modified Files
| File | Changes |
|------|---------|
| `src/app/[locale]/layout.tsx` | Add Organization + WebSite JSON-LD |
| `src/app/[locale]/blog/page.tsx` | Restructure as cluster-based hub |
| `src/app/[locale]/blog/[slug]/page.tsx` | Add canonical, hreflang, Article+FAQPage+BreadcrumbList JSON-LD, related articles, breadcrumb |
| `src/lib/content.ts` | Add `cluster`, `updatedDate` to PostMeta |
| `src/lib/mdx-components.tsx` | Register BlogCtaBlock component |
| `next.config.ts` | Add 301 redirects for old page URLs |
| `public/sitemap.xml` | Migrate to dynamic generation (or `src/app/sitemap.ts`) |

### Deleted Files (after redirect verification)
| File | Reason |
|------|--------|
| `src/app/[locale]/what-is/page.tsx` | Redirected to blog |
| `src/app/[locale]/how-it-works/page.tsx` | Redirected to blog |
| `src/app/[locale]/history/page.tsx` | Redirected to blog |
| `content/en/what-is.mdx` | Moved to blog/ |
| `content/en/how-it-works.mdx` | Moved to blog/ |
| `content/en/history.mdx` | Moved to blog/ |
| (Same for zh-TW, zh-Hans) | |

---

## 13. Validation Checklist

After implementation:
- [ ] `npm run build` passes without errors
- [ ] All 9 blog articles render at correct URLs
- [ ] Old URLs (/what-is, /how-it-works, /history) return 301 to new URLs
- [ ] JSON-LD validates (Organization, Article, FAQPage, BreadcrumbList)
- [ ] hreflang alternates present on every blog post
- [ ] Canonical URLs set on every blog post
- [ ] Internal links between articles work (no broken links)
- [ ] Blog hub groups articles by cluster
- [ ] Related articles component shows same-cluster articles
- [ ] Breadcrumb navigation renders on blog posts
- [ ] FAQ sections render with proper H3 headers
- [ ] CTA blocks render and link to /ritual
- [ ] Sitemap includes all new blog URLs
- [ ] Lighthouse SEO score 90+
