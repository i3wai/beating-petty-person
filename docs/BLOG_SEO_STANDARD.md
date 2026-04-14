# BeatPetty Blog SEO Standard

> **When writing or reviewing blog content for this project, follow this standard.**
> Reference article: `content/en/blog/how-to-curse-someone.mdx` (the gold standard)

## Frontmatter (Required for ALL posts)

Every MDX file MUST include these fields:

```yaml
---
title: "Primary Keyword: Descriptive Subtitle"       # 50-60 chars, primary keyword first
description: "..."                                     # 150-160 chars, includes primary + secondary keywords
keywords: ["primary kw", "secondary kw", ...]         # 5-8 keywords from research
date: "YYYY-MM-DD"                                     # REQUIRED — missing = post invisible in blog hub
cluster: "A" | "B" | "C"                               # Topic cluster assignment
updatedDate: "YYYY-MM-DD"                              # Same as date on first publish
ogImage: "/og-image.png"                               # Path from public/, fallback to generic
---
```

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

## Word Count Targets

| Type | Target | Description |
|------|--------|-------------|
| **Pillar** | 3,000-4,000 words | Comprehensive guide covering a broad topic |
| **Spoke** | 1,500-2,500 words | Focused article on one sub-topic |

Everything else in this standard applies equally to both. The only difference is depth and breadth.

## Title & URL

- Title format: `[Primary Keyword]: [Descriptive Subtitle]`
- URL slug: keyword-rich, uses hyphens, matches primary keyword intent
- Title length: 50-60 characters (don't truncate in SERPs)

## Tone & Brand Voice

- **Positioning**: Curse ritual, NOT game or therapy — dark Grimoire atmosphere
- **Hook**: "萬一呢？" ("What if it works?") — suggest supernatural possibility without claiming results
- **Language**: Direct, authoritative, slightly ominous. Use words like "ritual", "curse", "sealed", "verdict"
- **Avoid**: Playful tone, disclaimers in body text, clinical language, "just for fun" framing
- **CTA style**: "Begin the Ritual" not "Try it now"; "Name Your Enemy" not "Upgrade"
- **Sharing hook**: "I just experienced an ancient Chinese curse ritual" — cool, not shameful

## Keyword Strategy

### Before writing: check the keyword plan

Every article's target keywords are defined in `docs/superpowers/specs/2026-04-12-blog-seo-architecture-design.md`. Read this file first to find the assigned keywords for the article you're writing.

### Keyword placement rules

- **Primary keyword**: appears in title, first 50 words of body, at least 2 H2s, meta description, **5-7 times in body** total
- **Secondary keywords** (2-3 per article): each appears **2-3 times in body**, spread across different sections
- **Long-tail variants**: target in specific sections (e.g., "how to curse someone with words", "how to curse someone who hurt you")
- **Keyword frequency guideline**: primary keyword 5-7 times per 3,000 words; each secondary keyword 2-3 times

### Keyword distribution template

| Keyword type | Count | Where to place |
|-------------|-------|---------------|
| Primary | 5-7 | Title, intro (first 50 words), 2+ H2s, 1-2 body paragraphs, meta description |
| Secondary 1 | 2-3 | Intro area + 1 body section |
| Secondary 2 | 2-3 | Body sections (not clumped together) |
| Secondary 3 | 1-2 | Natural fit in relevant section |
| Long-tail variants | 1 each | Spread across steps/sections |

### Anti-patterns to avoid

- **Do NOT** force exact keywords where they break natural flow
- **Do NOT** cluster all keywords in the first 200 words
- **Do NOT** exceed 8 exact matches for any single keyword
- **DO** use semantic variations naturally (Google NLP handles synonyms)

## Content Structure

### Required hierarchy

```
## H1 (implicit from title) — keyword in first 50 words of intro paragraph
### H2 — major sections (each is a TOC entry)
#### H3 — subsections within H2
```

### Required sections (ALL posts)

1. **Intro paragraph** — Hook + primary keyword in first 50 words + what the article covers
2. **Main body** — H2 sections with substantive content
3. **FAQ section** — minimum 5 questions (via frontmatter `faqs` array)
4. **Further Reading / Related** — internal links to other blog posts

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

- **Minimum 1 Wikipedia or authoritative external link** per article
- External links open in new tab (handled by CustomLink component)
- Use for: historical facts, cultural references, terminology definitions

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

## JSON-LD Schemas (Automatic)

These are injected by the blog post template — do NOT add manually:

| Schema | Condition |
|--------|-----------|
| BlogPosting | All blog posts (always) |
| BreadcrumbList | All blog posts (always) |
| FAQPage | When `faqs` array exists in frontmatter |
| HowTo | When `steps` array exists in frontmatter |

## Auto-Generated Metadata

The blog post template (`src/app/[locale]/blog/[slug]/page.tsx`) automatically generates from frontmatter:

| Meta | Source |
|------|--------|
| Canonical URL | `https://beatpetty.com/{locale}/blog/{slug}` |
| Hreflang alternates | en, zh-TW, zh-Hans (all 3 locales) |
| OG title | `title` field |
| OG description | `description` field |
| OG image | `ogImage` field (1200x630), falls back to `/og-image.png` |
| OG type | `article` |
| Published time | `date` field |
| Modified time | `updatedDate` field (falls back to `date`) |
| Twitter card | `summary_large_image` |
| Reading time | Auto-calculated from word count |
| Word count | Auto-calculated, included in BlogPosting schema |

Do NOT add these manually in MDX — the template handles everything.

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
- **ZH blog 是獨立內容體系，不是 EN 的翻譯。** 同一概念可以有對應主題，但標題、內容、角度、文化引用完全獨立。見 `docs/superpowers/plans/2026-04-14-zh-blog-seo-strategy.md`

## 3-Language Workflow

When writing a blog article:

1. Write EN version first (it's the SEO reference)
2. Create zh-TW and zh-Hans versions with culturally adapted content
3. All 3 must have same frontmatter structure (title, description, keywords adapted to language)
4. All 3 must have same `cluster` assignment
5. All 3 must have `date` field

## Cluster Assignment

### EN Blog Clusters

| Cluster | Name | Topics |
|---------|------|--------|
| A | Curses & Black Magic | Core curse/ritual topics |
| B | Bad Luck & Curse Removal | Luck, cleansing, protection |
| C | Global Curse Traditions | Cultural/historical traditions |

### ZH Blog Clusters (獨立架構，非 EN 翻譯)

> 完整策略見 `docs/superpowers/plans/2026-04-14-zh-blog-seo-strategy.md`

| Cluster | Name | Topics |
|---------|------|--------|
| A | 打小人核心 | 打小人方法、驚蟄打小人、咒語、鵝頸橋 |
| B | 命理與改運 | 去霉運、犯太歲、鬼月、小人作祟 |
| C | 詛咒文化與比較 | 全球詛咒比較、打小人歷史 |

**重要**：ZH 和 EN blog 使用相同 cluster 代號 (A/B/C)，但因為 blog hub 按語言分開渲染（/en/blog vs /zh-TW/blog），代號不衝突。集群標題用 i18n key。

## Quality Checklist (Before Publishing)

- [ ] `date` field present in frontmatter
- [ ] Title 50-60 chars, primary keyword first
- [ ] Description 150-160 chars, includes keywords
- [ ] Primary keyword in first 50 words of body, 5-7 times total
- [ ] Each secondary keyword 2-3 times in body, spread across sections
- [ ] Keywords match plan in `docs/superpowers/specs/2026-04-12-blog-seo-architecture-design.md`
- [ ] Tone matches brand: dark, authoritative, "What if it works?"
- [ ] At least 5 H2 sections for pillar, 3 for spoke
- [ ] FAQ section with 5+ questions in frontmatter
- [ ] HowTo steps in frontmatter (if tutorial)
- [ ] 6+ contextual internal links in body
- [ ] Cluster linking: pillar ↔ all spokes in same cluster
- [ ] 1-2 cross-cluster links
- [ ] 4-6 links in Further Reading section
- [ ] At least 1 external authoritative link
- [ ] 3-4 images (pillar) or 1-2 (spoke), evenly distributed
- [ ] All images have descriptive alt-text (15-30 words, specific and visual)
- [ ] Images generated via Gemini, resized to 1200x630, compressed ~150-250KB
- [ ] At least 1 summary/comparison table (pillar)
- [ ] `<BlogCtaBlock />` placed after main content (pillar)
- [ ] In-text CTA link to /ritual at natural break point (pillar)
- [ ] No hardcoded English in components
- [ ] All 3 language versions created with `date` field
- [ ] Build passes (`npm run build`)
