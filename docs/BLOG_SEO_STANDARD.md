# BeatPetty Blog SEO Standard

> **When writing or reviewing blog content for this project, follow this standard.**
> Reference article: `content/en/blog/how-to-curse-someone.mdx` (the gold standard)

## Frontmatter (Required for ALL posts)

Every MDX file MUST include these fields:

```yaml
---
title: "Primary Keyword: Descriptive Subtitle"       # EN: 50-60 chars | ZH: 25-30 chars
description: "..."                                     # EN: 150-160 chars | ZH: 80-100 chars
keywords: ["primary kw", "secondary kw", ...]         # 5-8 keywords from research
date: "YYYY-MM-DD"                                     # REQUIRED — missing = post invisible in blog hub
cluster: "A" | "B" | "C"                               # Topic cluster assignment
updatedDate: "YYYY-MM-DD"                              # Same as date on first publish
ogImage: "/og-image.png"                               # Path from public/, fallback to generic
---
```

> **Meta length is based on pixel width, not character count.** Google truncates titles at ~600px and descriptions at ~920px. Chinese characters are ~2x the pixel width of English characters, so ZH must use shorter character limits.
>
> | Field | EN limit | ZH limit (zh-TW / zh-Hans) |
> |-------|----------|---------------------------|
> | Title | 50-60 chars | 25-30 Chinese chars |
> | Description | 150-160 chars | 80-100 Chinese chars |
>
> **ZH rules**: Primary keyword within first 10-15 chars of title. Use half-width `:` or `-` as separator, avoid full-width punctuation that wastes pixels.
> **Title format**: `[Primary Keyword]: [Descriptive Subtitle]`
> **URL slug**: keyword-rich, uses hyphens, matches primary keyword intent

Optional fields (add when applicable):

```yaml
steps:                          # HowTo schema — add for tutorial/how-to articles
  - name: "Step Title"
    text: "Step description for schema (1-2 sentences)"
faqs:                           # FAQ schema — add for all articles
  - question: "PAA-style question?"
    answer: "2-3 sentence answer targeting featured snippet"
```

**Critical rule**: Missing `date` field causes the post to be filtered out of blog hub listings AND renders "Invalid Date" on the article page.

## Word Count & Structure Targets

Word count is a **reference range**, not a hard target. Do NOT pad content to hit a number — AI-generated fluff is worse than a shorter, denser article. Instead, use **structural depth** to naturally achieve appropriate length.

**Chinese has higher information density than English** — fewer characters convey the same depth. ZH targets are lower by character count but equivalent in information value.

| Type | EN range | ZH range (chars) | Structure requirement |
|------|----------|-------------------|----------------------|
| **Pillar** | ~3,000-4,000 words | ~2,500-3,500 chars | At least 8-10 H2/H3 sections, each with substantive depth |
| **Spoke** | ~1,500-2,500 words | ~1,500-2,500 chars | At least 5-7 H2/H3 sections, focused on one sub-topic |

**How to hit depth without fluff:**
- Provide specific examples, historical dates, cultural details
- Include data points (costs, timelines, statistics) where available
- Compare and contrast different methods/traditions
- Address common misconceptions with evidence

## Title / H1 / Snippet Triad

Google may rewrite your `<title>` using the page's H1 or prominent on-page text. To maintain control:

- **`<title>`** (from frontmatter): Primary keyword + descriptive subtitle — optimized for SERP CTR
- **H1** (first visible heading): Can be identical to title, or a slight variation — must contain primary keyword
- **Snippet sentence** (first sentence after H1): A clear, single-sentence definition of the article's topic — Google may use this as meta description or featured snippet text

**Rules:**
- All three must be **consistent in topic** but **not verbatim copies** of each other
- Primary keyword must appear in all three
- Each locale's triad must be **unique** across the site (no duplicate titles across locales or articles)

## Tone & Brand Voice

### EN Tone: Dark Grimoire
Western users searching "curse" come from occult/Wicca/witchcraft context. Match their expectations.

- **Positioning**: Curse ritual, NOT game or therapy — dark Grimoire atmosphere
- **Hook**: "What if it works?" — suggest supernatural possibility without claiming results
- **Language**: Direct, authoritative, slightly ominous. Use words like "ritual", "curse", "sealed", "verdict"
- **Avoid**: Playful tone, disclaimers in body text, clinical language, "just for fun" framing
- **CTA style**: "Begin the Ritual" not "Try it now"; "Name Your Enemy" not "Upgrade"
- **Sharing hook**: "I just experienced an ancient Chinese curse ritual" — cool, not shameful

### ZH Tone: 正統民俗檔案館 (Authentic Folklore Archive)
Chinese users searching 「打小人」「去霉運」「犯太歲」come from folk religion/道敎/命理 context. Use cultural authority, not Western occult framing. The trust basis is 「正宗」「師傅」「傳承」— reverence, not spectacle.

- **Positioning**: Authentic folk tradition with 300+ years of history — cultural heritage, not game
- **Hook**: 「萬一呢？」— same supernatural suggestion, but rooted in cultural belief, not Gothic fantasy
- **Language**: Authoritative, respectful, culturally grounded. Use authentic terminology:
  - **Use**: 科儀, 煞氣, 反噬, 因果, 符籙, 淨化, 磁場, 厄運, 封印, 傳承, 正宗, 師傅
  - **Avoid (translation tone)**: 詛咒儀式 → 用「打小人科儀」, 黑魔法 → 用「民間法術」, 驅魔 → 用「驅邪化煞」
  - **Note**: 「詛咒」is acceptable when it's the actual keyword being targeted (e.g., ZH9 詛咒術大比較), but default to folk religion vocabulary for general descriptions
- **Avoid**: Gothic/Grimoire tone, Western occult vocabulary, playful framing, clinical disclaimers, anything that sounds like 中二病
- **CTA style**: 「親自體驗打小人儀式」「免費體驗正宗打小人」not 「開始詛咒」「Name Your Enemy」
- **zh-TW vs zh-Hans**: Same tone foundation, but zh-TW uses Cantonese/HK cultural references (鵝頸橋, 驚蟄), zh-Hans uses general Chinese cultural vocabulary. **Not just simplified/traditional conversion — different local context.**

## Keyword Strategy

### Before writing: check the keyword plan

Every article's target keywords are defined in `docs/blog-seo-en.md` (EN) or `docs/blog-seo-zh.md` (ZH). Read the relevant file first to find the assigned keywords for the article you're writing.

### Entity-Based SEO (modern approach)

Google NLP no longer relies on keyword counting. Instead, it understands **entities** — the people, places, things, and concepts related to a topic. To rank, your article must demonstrate **topical completeness** by covering all relevant entities, not just repeating keywords.

**How to apply:**
- When writing about "打小人", Google expects to see related entities: 驚蟄, 鵝頸橋, 紙人, 舊鞋, 百解符, 非物質文化遺產
- When writing about "curse", Google expects: ritual, hex, spell, effigy, invocation, sealing
- **Cover the topic's full semantic web**, not just the target keyword

### Keyword placement rules

- **Primary keyword**: MUST appear in title, first 50 words of body, at least 1 H2, and meta description (minimum baseline). Beyond that, let it occur naturally — do NOT force frequency
- **Secondary keywords** (2-3 per article): weave naturally across different sections
- **Long-tail variants**: target in specific sections (e.g., "how to curse someone with words", "how to curse someone who hurt you")
- **Entity coverage**: ensure all topic-relevant entities appear at least once in the article

### Keyword distribution guidelines (reference, not hard counts)

| Keyword type | Guidance | Where to place |
|-------------|----------|---------------|
| Primary | Naturally throughout, minimum in title + intro + 1 H2 + meta | Title, intro, H2s, body paragraphs, meta description |
| Secondary 1 | Naturally across sections | Intro area + 1-2 body sections |
| Secondary 2 | Naturally across sections | Body sections (not clumped together) |
| Secondary 3 | Natural fit | Relevant section |
| Entity terms | At least 1 mention each | Spread naturally across the article |
| Long-tail variants | 1 each | Spread across steps/sections |

### Anti-patterns to avoid

- **Do NOT** force exact keywords where they break natural flow
- **Do NOT** cluster all keywords in the first 200 words
- **Do NOT** exceed 8 exact matches for any single keyword — if it feels repetitive, it IS repetitive
- **DO** use semantic variations naturally (Google NLP handles synonyms)
- **DO** prioritize entity coverage over keyword repetition
- **DO** provide **information gain** — unique insights, historical facts, or cultural details that competitors don't have. If your article is just a summary of top 10 results, it won't rank in top 3

## Content Structure

### Required hierarchy

```
## H1 (implicit from title) — keyword in first 50 words of intro paragraph
### H2 — major sections (each is a TOC entry)
#### H3 — subsections within H2
```

### Required sections (ALL posts)

1. **Intro paragraph** — Hook + primary keyword in first 50 words + what the article covers
2. **Key Takeaways (TL;DR)** — 3 bullet points summarizing the article's core value, placed immediately after the intro paragraph (before the first H2). This improves UX, reduces bounce rate, and increases Featured Snippet chances
3. **Main body** — H2 sections with substantive content
4. **FAQ section** — minimum 5 questions (via frontmatter `faqs` array)
5. **Further Reading / Related** — internal links to other blog posts

### Anti-hallucination rules (CRITICAL)

When writing about cultural traditions, historical events, or ritual practices:

- **Do NOT fabricate** historical events, spell incantations, mythological figures, or cultural practices that cannot be verified
- **If uncertain, omit or label as legend** — write "據說" / "legend has it" rather than stating unverified claims as fact
- **All cultural proper nouns must use correct original language**: Latin, Sanskrit, Cantonese pinyin, etc. Do NOT guess transliterations
- **Especially critical for Cluster C** (global curse traditions): cross-reference multiple sources before making comparative claims

### Pillar-only sections

5. **Summary/comparison table** — at least one table comparing methods/types/traditions
6. **CTA block** — `<BlogCtaBlock />` component placed after the main how-to section (before FAQ)
7. **In-text CTA** — A contextual link like `[Begin the curse ritual →](/ritual)` placed at a natural break point in the body (e.g., after the main how-to section, before deep-dive sections). This is separate from `<BlogCtaBlock />`

## Internal Linking

- **Minimum 6 contextual internal links** in body text (link to other blog posts, /ritual, /pricing)
- **Further Reading section** at the end with 4-6 links to related articles
- Use correct paths: `/blog/[slug]`, `/ritual`, `/pricing` (i18n Link handles locale prefix)
- Internal links should use natural anchor text, not "click here"
- **Cluster linking rule**: Pillar must link to all spokes in its cluster; each spoke must link back to its pillar
- **Cross-cluster linking**: Link to articles in other clusters when contextually relevant (at least 1-2 cross-cluster links)

## External Links

- **Minimum 1 authoritative external link** per article
- **Prefer academic sources** (民俗學術期刊, university archives, peer-reviewed research) when available for historical/cultural claims
- Wikipedia is an acceptable fallback when academic sources are scarce (common for niche folk religion topics)
- External links open in new tab (handled by CustomLink component)
- Use for: historical facts, cultural references, terminology definitions
- **Do NOT fabricate academic citations** — only link to real, verifiable sources

## Images

- **Pillar: 3-4 images**, **Spoke: 1-2 images** (roughly 1 image per 800-1,000 words)
- **Auto-generate via Gemini API** (`gemini-3.1-flash-image-preview`, env var `GEMINI_API_KEY`)
- Images saved to `public/blog/` as JPG, resized to **1200x630** (16:9), compressed to **~150-250KB**
- Reference in MDX as `![descriptive alt text](/blog/filename.jpg)`

### Image Placement Strategy

Distribute images evenly throughout the article to break up text walls:
1. **After intro paragraph** — hero image showing the article's main topic
2. **At section transitions** — images matching the section's content (e.g., traditions, tools, history)
3. **After long text blocks** — tables, lists, or timelines benefit from a visual break

### Image Generation Prompt Template

```
Dark atmospheric illustration/photograph of [SUBJECT], [DETAILS].
[CANDLE/FIRE/GOLD lighting description]. Dark moody background with [COLORS].
Art style: [dark fantasy illustration / photorealistic / painterly], cinematic lighting, high contrast.
No visible text or English words. 16:9 landscape composition.
```

### Alt-Text Requirements

Every image MUST have descriptive alt-text following this pattern:
```
![Subject description + action/scene + lighting/atmosphere details](/blog/filename.jpg)
```

**Example:**
```
![A paper effigy burning during a Da Siu Yan curse ritual, with flames and smoke rising from the figure — dark atmospheric scene with red and gold firelight](/blog/how-to-curse-someone-ritual.jpg)
```

**Alt-text rules:**
- Describe what is actually in the image (for accessibility)
- Include article keyword where natural
- 15-30 words, specific and visual
- Never leave alt-text empty or use generic text like "image" or "photo"

## Tables

- Use GFM table syntax (`| col | col |`)
- At least 1 summary/comparison table in pillar articles
- Tables must have clear headers and be scannable

## FAQ Requirements

- **Minimum 5 questions** for spoke, **6-8 for pillar**
- Questions should target People Also Ask (PAA) queries
- Each answer: 2-3 sentences, targeting featured snippet format
- Delivered via frontmatter `faqs` array (not hardcoded in MDX body)
- Automatically renders FAQ section + FAQPage JSON-LD schema

## HowTo Schema

- Add `steps` to frontmatter for tutorial/how-to articles
- 3-5 steps, each with `name` (short title) and `text` (1-2 sentence description)
- Automatically renders HowTo JSON-LD schema

## Auto-Generated by Template

The blog post template (`src/app/[locale]/blog/[slug]/page.tsx`) generates all of the following from frontmatter — do NOT add manually:

**JSON-LD Schemas:**

| Schema | Condition |
|--------|-----------|
| BlogPosting | All blog posts (always) |
| BreadcrumbList | All blog posts (always) |
| FAQPage | When `faqs` array exists in frontmatter |
| HowTo | When `steps` array exists in frontmatter |

**Metadata:**

| Meta | Source |
|------|--------|
| Canonical URL | `https://beatpetty.com/{locale}/blog/{slug}` |
| Hreflang alternates | Only locales where the same slug exists (existence-checked) |
| OG title / description / image | From `title`, `description`, `ogImage` fields |
| Published / Modified time | `date` and `updatedDate` fields |
| Twitter card | `summary_large_image` |
| Reading time / Word count | Auto-calculated |

## Components Available in MDX

| Component | Usage |
|-----------|-------|
| `<BlogCtaBlock />` | Dark CTA block linking to /ritual — use once per article |
| `<CtaButton href="/ritual">Text</CtaButton>` | Inline CTA button |
| `[link text](/blog/slug)` | Internal link (i18n-aware via CustomLink) |
| `[link text](https://...)` | External link (auto opens in new tab) |

## i18n Rules

- **3 locales**: en, zh-TW, zh-Hans
- Blog components must NOT hardcode English text — use i18n keys or accept translated props
- `TableOfContents` accepts `title` prop from server component
- `RelatedArticles` accepts `heading` prop from server component
- `BlogCtaBlock` is a client component using `useTranslations('blog.cta')`
- Blog post page uses `getTranslations('blog')` for FAQ heading, TOC title, etc.
- **ZH blog 是獨立內容體系，不是 EN 的翻譯。** 同一概念可以有對應主題，但標題、內容、角度、文化引用完全獨立。見 `docs/blog-seo-zh.md`

## 3-Language Workflow

When writing a blog article:

1. Write EN version first (it's the SEO reference)
2. Create zh-TW and zh-Hans versions with culturally adapted content
3. All 3 must have same frontmatter structure (title, description, keywords adapted to language)
4. All 3 must have same `cluster` assignment
5. All 3 must have `date` field

## Cluster Assignment

Same A/B/C codes for EN and ZH, but **ZH clusters are independent, not translations** — full plans in `docs/blog-seo-en.md` and `docs/blog-seo-zh.md`.

| Cluster | EN | ZH |
|---------|----|----|
| A | Curses & Black Magic | 打小人核心（方法、驚蟄、咒語、鵝頸橋） |
| B | Bad Luck & Curse Removal | 命理與改運（去霉運、犯太歲、鬼月） |
| C | Global Curse Traditions | 詛咒文化與比較（全球比較、歷史） |

Blog hubs render per-locale (`/en/blog`, `/zh-TW/blog`), so codes don't conflict. Cluster headings use i18n keys.

## Quality Checklist (Before Publishing)

### All posts (universal)
- [ ] `date` field present in frontmatter
- [ ] Primary keyword in title, first 50 words, at least 1 H2, meta description (minimum baseline)
- [ ] Topic-relevant entities covered throughout the article
- [ ] Key Takeaways (TL;DR) — 3 bullet points after intro paragraph
- [ ] At least 8-10 H2/H3 sections for pillar, 5-7 for spoke (structural depth drives word count)
- [ ] No fluff or filler content — every section adds value
- [ ] FAQ section with 5+ questions in frontmatter (6-8 for pillar)
- [ ] HowTo steps in frontmatter (if tutorial)
- [ ] 6+ contextual internal links in body
- [ ] Cluster linking: pillar ↔ all spokes in same cluster
- [ ] 1-2 cross-cluster links
- [ ] 4-6 links in Further Reading section
- [ ] At least 1 authoritative external link (academic preferred, Wikipedia acceptable)
- [ ] 3-4 images (pillar) or 1-2 (spoke), evenly distributed
- [ ] All images have descriptive alt-text (15-30 words, specific and visual)
- [ ] Images generated via Gemini, resized to 1200x630, compressed ~150-250KB
- [ ] At least 1 summary/comparison table (pillar)
- [ ] `<BlogCtaBlock />` placed after main content (pillar)
- [ ] In-text CTA link to /ritual at natural break point (pillar)
- [ ] No hardcoded English in components
- [ ] All 3 language versions created with `date` field
- [ ] No fabricated historical facts, spell texts, or cultural practices (anti-hallucination check)
- [ ] Information gain: article contains unique insights not found in top 10 results
- [ ] Build passes (`npm run build`)

### EN-specific
- [ ] Title 50-60 chars, primary keyword first
- [ ] Description 150-160 chars, includes keywords
- [ ] Keywords match plan in `docs/blog-seo-en.md`
- [ ] Tone: Dark Grimoire — authoritative, ominous, occult vocabulary

### ZH-specific
- [ ] Title 25-30 Chinese chars, primary keyword within first 10-15 chars
- [ ] Description 80-100 Chinese chars, includes keywords (pixel-width safe)
- [ ] Keywords match plan in `docs/blog-seo-zh.md`
- [ ] Tone: 正統民俗 — use 科儀/煞氣/符籙 vocabulary, NOT Western occult translation tone
- [ ] zh-TW uses Cantonese/HK cultural references; zh-Hans uses general Chinese vocabulary
- [ ] Full-width punctuation only; half-width space between CJK and Latin characters
