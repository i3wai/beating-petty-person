# Blog SEO Master Strategy

> **One doc for all blog SEO context. EN + ZH keyword planning, strategy, decisions, Phase 2.**
> **寫 blog 內容時，先讀 `docs/BLOG_SEO_STANDARD.md`（格式標準）+ 本文件（策略與關鍵字）。**
> Consolidated: 2026-04-19. Source: 4 docs → 1.

---

## 1. Core Strategy

### EN and ZH are two independent content systems

- **EN blog**: Attacks English high-volume long-tail (curse, hex, black magic, voodoo) — occult market
- **ZH blog**: Attacks Chinese culture + fortune keywords (打小人, 驚蟄, 太歲, 去霉運) — folk belief market
- **Never direct-translate.** Same concept can have matching topics, but titles, content, angles, cultural references are fully independent
- **URLs can correspond** (EN `/blog/history-of-villain-hitting` ↔ ZH `/blog/驚蟄打小人攻略`), but content fights independently

### Why not translate

1. Search intent differs: EN users search "how to curse someone", ZH users search "驚蟄打小人"
2. Cultural context differs: EN market sees 打小人 as exotic occult; ZH market sees it as daily folk custom
3. Competition differs: EN competitors are spell/witchcraft sites; ZH competitors are fortune blogs and Wikipedia
4. Keywords have zero overlap between languages

### Pillar-Spoke Model

- Spokes support Pillars. Low-KD spoke articles build semantic foundation for high-KD pillars.
- Every article links to `/ritual`. Free curse ritual is the conversion endpoint for all content.
- Content is product. Dark mystic Grimoire tone. Not academic, not comedy.
- Chinese slugs for ZH articles (e.g. `/blog/打小人完整攻略`). Google handles Chinese URLs well, higher SERP CTR.

### Brand Positioning Guardrails

BeatPetty = **curse ritual**. Not therapy, not workplace advice, not feng shui classroom. All content must:

1. Strengthen "打小人 = curse ritual" brand perception
2. Drive users to complete online ritual (conversion endpoint)
3. Build topical authority in "curse/folk belief" domain

Keywords偏离 this positioning, no matter how high volume, are noise.

---

## 2. Phase 1 Completion Summary

### EN Blog: 9/9 articles complete, deployed to production

| # | Slug | Cluster | Role | Words | FAQs |
|---|------|---------|------|------:|-----:|
| B1 | what-is-da-siu-yan | C | spoke | 4,558 | 6 |
| B2 | how-to-curse-someone | A | spoke | 3,807 | 8 |
| B3 | history-of-villain-hitting | C | spoke | 3,904 | 7 |
| B4 | what-is-black-magic | A | **pillar** | 4,556 | 8 |
| B5 | revenge-spells | A | spoke | 2,570 | 6 |
| B6 | voodoo-magic-curses | C | **pillar** | 3,681 | 6 |
| B7 | hex-spells-curses | A | spoke | 2,844 | 6 |
| B8 | how-to-get-rid-of-bad-luck | B | **pillar** | ~3,500 | 7 |
| B9 | how-to-remove-a-curse | B | spoke | ~2,300 | 5 |

Two SEO audits passed. 87 external URLs audited, 2 broken Wikipedia links fixed.

### ZH Blog: 11 articles × 2 variants (zh-TW + zh-Hans) = 22 complete, deployed to production

Full SEO audit of 22 posts passed. 6 old EN-slug ZH posts deleted with 301 redirects in `next.config.ts`.

### Technical SEO: All P0 items implemented

- JSON-LD (Organization, Article, FAQPage, BreadcrumbList)
- hreflang alternates + canonical URLs on all blog articles
- Blog Hub organized by cluster
- RelatedArticles component
- Breadcrumb component
- BlogCtaBlock component
- Dynamic sitemap with lastmod
- Old pages (/what-is, /how-it-works, /history) → 301 redirected to blog
- Lighthouse SEO 90+

---

## 3. EN Blog — Keyword Targets

### Cluster A: Curses & Black Magic (~50,000+ monthly search volume)

| # | Slug | Role | Primary Keywords | Vol | KD |
|---|------|------|-----------------|-----|-----|
| B4 | what-is-black-magic | **pillar** | what is black magic, black magic, is black magic real, black magic spells | 2,900 + 22,200 + 1,900 + 1,300 | 60 |
| B2 | how-to-curse-someone | spoke | how to curse someone, how to curse people, how to curse a person | 1,300 + 590 + 480 | 25 |
| B7 | hex-spells-curses | spoke | hexes, hexing, how to hex someone, hex spell, hex spells | 1,900 + 1,600 + 880 + 590 + 480 | 25-33 |
| B5 | revenge-spells | spoke | revenge spells, revenge spell, spells for revenge | 590 + 320 + ~200 | 24 |

**Cluster A auxiliary keywords:**
- "white magic vs black magic" (1,600) → B4
- "black magic meaning" (880) → B4
- "how to do black magic" (480) → B4
- "black magic ritual" (320) → B4
- "how to put a curse on someone" (1,300) → B2
- "hexes and curses" (320) → B7
- "put a hex on someone" (260) → B7
- "how do you hex someone" (590) → B7

### Cluster B: Bad Luck & Curse Removal (~4,560+ monthly search volume)

| # | Slug | Role | Primary Keywords | Vol | KD |
|---|------|------|-----------------|-----|-----|
| B8 | how-to-get-rid-of-bad-luck | **pillar** | how to get rid of bad luck, bad luck, how to remove bad luck | 1,000 + 3,600 + 480 | 23-55 |
| B9 | how-to-remove-a-curse | spoke | how to remove a curse, signs of a curse, curse protection | 1,300 + 590 + 480 | ~30 |

**Cluster B auxiliary keywords:**
- "karma spell" (720) → B8 (defensive/recovery intent, NOT revenge)
- "how to undo bad luck" (480) → B8
- "is bad luck real" (480) → B8 FAQ
- "how to tell if someone put a curse on you" (210) → B9
- "get rid of a curse spell" (210) → B9

### Cluster C: Global Curse Traditions (~2,400+ monthly search volume)

| # | Slug | Role | Primary Keywords | Vol | KD |
|---|------|------|-----------------|-----|-----|
| B6 | voodoo-magic-curses | **pillar** | voodoo magic, is voodoo demonic, voodoo hex | 1,600 + 480 + 210 | 41 |
| B1 | what-is-da-siu-yan | spoke | villain hitting, Da Siu Yan, what is beating petty person | ~200 | <20 |
| B3 | history-of-villain-hitting | spoke | Goose Neck Bridge Hong Kong, Jingzhe curse tradition | ~500 | <15 |

**Cluster C auxiliary keywords:**
- "is voodoo real" (1,900) → B6 FAQ (major long-tail discovery)
- "how does voodoo work" (590) → B6
- "voodoo vs black magic" (320) → B6, links to B4
- "Chinese folk magic" (260) → B1

### EN Internal Link Map

```
B4 (pillar) → /ritual, B2, B7, B5, B8 (cross), B6 (cross)
B2 (spoke → B4) → /ritual, B4, B7, B8 (cross)
B7 (spoke → B4) → /ritual, B4, B5, B2, B1 (cross)
B5 (spoke → B4) → /ritual, B4, B7, B8 (cross)
B8 (pillar) → /ritual, B9, B4 (cross), B5 (cross)
B9 (spoke → B8) → /ritual, B8, B4 (cross), B6 (cross)
B6 (pillar) → /ritual, B1, B3, B4 (cross), B7 (cross)
B1 (spoke → B6) → /ritual, B6, B3, B2 (cross)
B3 (spoke → B6) → /ritual, B6, B1, B4 (cross)
```

### EN FAQ Keyword Targets (35-42 total)

| Article | FAQ Count | Top Keyword Targets |
|---------|-----------|-------------------|
| B4 | 6-8 | "is black magic real" (1,900), "black magic vs white magic" (~590) |
| B8 | 6-8 | "is bad luck real" (480), "signs of bad luck" (~480) |
| B6 | 5-6 | "is voodoo real" (1,900 — major), "is voodoo demonic" (480) |
| B7 | 4-5 | "what does hexing mean" (1,300) |
| B2 | 4-5 | "how do you curse someone" (210) |
| B9 | 4-5 | "signs you are cursed" (~590), "how to break a curse" (~320) |
| B5 | 4-5 | "do revenge spells work" (~260) |
| B1 | 3-4 | "what is Da Siu Yan" (~50) |
| B3 | 3-4 | "where to beat petty person in Hong Kong" (~200) |

### EN 打小人 Paragraph Angles (50-80 words each, unique per article)

- B4: 打小人 in global black magic traditions — comparison angle
- B7: Eastern hex vs Western hex — contrast angle
- B5: When revenge meets real cultural practice — authenticity angle
- B8: Ancient bad luck removal ritual — practical angle
- B6: Voodoo vs 打小人 — head-to-head comparison angle
- B2: Try it yourself — online curse ritual — direct CTA angle
- B9: Fight fire with fire — curse removal tradition — reversal angle
- B1: The original curse ritual from Hong Kong — origin angle
- B3: From Goose Neck Bridge to your screen — journey angle

---

## 4. ZH Blog — Keyword Targets

### Cluster A: 打小人 Core (5 articles)

| # | Slug (zh-TW) | Role | Primary Keywords | Vol | KD | Words |
|---|---------------|------|-----------------|-----|-----|------|
| ZH1 | 打小人完整攻略 | **pillar** | 打小人, 打小人儀式, 打小人方法 | 2,500-5,000 | 中 | ~4,000 |
| ZH2 | 驚蟄打小人攻略 | spoke | 驚蟄打小人, 驚蟄儀式, 三月打小人 | 1,000-3,000 | 低 | ~3,000 |
| ZH3 | 打小人咒語 | spoke | 打小人咒語, 打小人禁忌 | 100-300 | 低 | ~2,500 |
| ZH4 | 鵝頸橋打小人 | spoke | 鵝頸橋打小人, 香港打小人 | 500-1,000 | 中 | ~2,500 |
| ZH11 | 台灣打小人文化 | spoke | 台灣打小人, 台灣民俗, 打小人在台灣 | 200-500 | 低 | ~2,500 |

**Cluster A auxiliary:**
- 線上打小人 (200-500, 極低競爭) → ZH1
- 網上打小人 (100-300, 極低競爭) → ZH1
- 打小人是什麼 (500-1,000) → ZH1
- 怎麼打小人 (200-500) → ZH1
- 打小人時間 (100-300) → ZH2
- 打小人步驟 (100-200) → ZH1

### Cluster B: 命理與改運 (4 articles)

| # | Slug (zh-TW) | Role | Primary Keywords | Vol | KD | Words |
|---|---------------|------|-----------------|-----|-----|------|
| ZH5 | 去霉運方法 | **pillar** | 去霉運, 轉運, 改運方法 | 1,000-3,000 | 中 | ~4,000 |
| ZH6 | 犯太歲化解 | spoke | 犯太歲, 化太歲, 太歲化解 | 2,000-5,000 | 中 | ~3,000 |
| ZH7 | 鬼月禁忌與化解 | spoke | 鬼月禁忌, 中元節, 農曆七月 | 1,000-3,000 | 中 | ~3,000 |
| ZH8 | 小人作祟的徵兆 | spoke | 小人作祟, 避小人方法, 反小人 | 200-500 | 低 | ~2,500 |

**Cluster B auxiliary:**
- 運氣差怎麼辦 (300-800) → ZH5
- 化解小人 (200-500) → ZH8
- 本命年禁忌 (500-1,000) → ZH6 (seasonal spike)
- 安太歲 (500-1,000) → ZH6
- 農曆七月禁忌 (1,000+) → ZH7 (seasonal spike)

**太歲 and 鬼月 are golden opportunities missed in original proposal:**
- 犯太歲: steady year-round search, peaks during 本命年. Clear 化解 need → direct to 打小人 ritual
- 鬼月: Lunar 7th month = folk belief traffic peak. Taboo + 化解 demand perfectly aligns with 打小人 positioning

### Cluster C: 詛咒文化與全球比較 (2 articles)

| # | Slug (zh-TW) | Role | Primary Keywords | Vol | KD | Words |
|---|---------------|------|-----------------|-----|-----|------|
| ZH9 | 詛咒術大比較 | **pillar** | 詛咒, 詛咒術, 降頭, 巫毒 | 500-2,000 | 中 | ~4,000 |
| ZH10 | 打小人的歷史 | spoke | 打小人歷史, 廣東民俗, 非物質文化遺產 | 100-500 | 低 | ~3,000 |

**Cluster C auxiliary:**
- 降頭術 (1,000-3,000) → ZH9 (Southeast Asian Chinese market)
- 茅山術 (500-1,000) → ZH9
- 民間法術 (200-500) → ZH9

### ZH Internal Link Map

```
ZH1 (pillar) → /ritual, ZH2, ZH3, ZH4, ZH11, ZH5 (cross), ZH10 (cross)
ZH2 (spoke → ZH1) → /ritual, ZH1, ZH3, ZH6 (cross — 驚蟄↔太歲)
ZH3 (spoke → ZH1) → /ritual, ZH1, ZH4
ZH4 (spoke → ZH1) → /ritual, ZH1, ZH11, ZH10 (cross)
ZH11 (spoke → ZH1) → /ritual, ZH1, ZH4, ZH8 (cross)
ZH5 (pillar) → /ritual, ZH6, ZH7, ZH8, ZH1 (cross)
ZH6 (spoke → ZH5) → /ritual, ZH5, ZH2 (cross), ZH7
ZH7 (spoke → ZH5) → /ritual, ZH5, ZH9 (cross), ZH6
ZH8 (spoke → ZH5) → /ritual, ZH5, ZH1 (cross)
ZH9 (pillar) → /ritual, ZH10, ZH1 (cross), ZH3 (cross)
ZH10 (spoke → ZH9) → /ritual, ZH9, ZH4 (cross), ZH1 (cross)
```

### ZH Rejected Keywords & Rationale

| Keyword | Volume | Why Rejected |
|---------|--------|-------------|
| 生氣怎麼辦 | High | Search intent = emotional regulation, not curse/folk belief. Zero conversion, confuses brand |
| 發洩情緒方法 | High | Same. Users want psychology answers, not 打小人. We're curse ritual, not anger management |
| 轉運方法 | Medium | Too broad. Competes with too many feng shui/fortune sites. Can be auxiliary keyword, not standalone article |
| 職場小人 | 5,000+ | Intent = "how to handle", not curse. Can be context keyword for 打小人, not standalone |

### ZH vs EN Cluster Comparison

| ZH Cluster | ZH Focus | EN Equivalent | EN Focus | Relationship |
|------------|----------|--------------|----------|-------------|
| A: 打小人 core | 打小人 itself (culture, methods, history, locations) | C: Global traditions | Da Siu Yan as one of many traditions | ZH deeper, EN treats it as one example |
| B: 命理與改運 | 去霉運, 太歲, 鬼月, 小人徵兆 | B: Bad luck removal | Bad luck, curse removal | Cultural context completely different, but search intent structure similar |
| C: 詛咒文化比較 | Global curse traditions (降頭, 茅山) | A: Curses & black magic | Black magic, hexes, revenge | ZH from Chinese perspective, EN from Western occult |

---

## 5. Key Strategic Decisions

Expert panel (3 specialists: Technical SEO, Content SEO, Competitive SEO) + Elon review, 2026-04-12.

### Consensus decisions

1. **B4 slug**: `what-is-black-magic` (not `black-magic-curse`). Question-style URL matches featured snippet wins. Title/H1 still targets "black magic" head term.
2. **B6 is Cluster C pillar** (not B1). B1 at ~200 vol wastes pillar status. B6 at 1,600+ vol drives traffic.
3. **B2 belongs to Cluster A** (attack intent), not Cluster B (defensive).
4. **B9 "how to remove a curse" added** — 1,300 vol gap. Fear-driven keyword. "Feel cursed? Fight back with 打小人."
5. **Publish order**: Spokes first at full length, pillars last. B2 first (highest commercial intent). Never publish thin content.
6. **"Dark arts" removed** from B4 primary keywords. Pop culture intent (Harry Potter), not real occult practice.
7. **"Karma spell" in B8** (not B5). Defensive/recovery intent, not attack.
8. **Mini-ritual embed**: Phase 2. Phase 1 uses static CTA block. No interactive Canvas in content articles.
9. **JSON-LD is CTR optimization**, not ranking boost. But for DA-0 site, CTR is the battlefield.
10. **Dark Grimoire tone is our weapon**. Wikipedia is dry, Wicca blogs are earthy. Nobody occupies the dark atmospheric space. Keep it.

### Anchor text rules

| Link type | Rule | Example |
|-----------|------|---------|
| To pillar | Use target keyword | "black magic" → B4, "打小人" → ZH1 |
| To spoke | Use descriptive text | "hex spells and curses" → B7 |
| To /ritual | Use CTA copy | "Try the free curse ritual" |
| Cross-cluster | Natural language | "In Chinese tradition, cursing works differently" |
| **Forbidden** | "click here", "learn more", "read more" | — |

---

## 6. ZH Market & Cultural Insights

### Market segmentation

**Hong Kong (zh-TW)**: Google dominant. Mixed ZH+EN queries. Physical ritual location (鵝頸橋) creates informational queries. Strong 驚蟄 spike. Tone: practical/transactional, "正宗" and "傳統" resonate.

**Taiwan (zh-TW)**: Google near 100%. Less location-specific. Cultural curiosity + emotional release. Tone: cultural/educational, "百年" and "文化" resonate.

**Mainland China (zh-Hans)**: Baidu dominant. Entertainment-forward. Stripe blocked — position as brand awareness, focus monetization on HK/TW/overseas. Tone: "酷" and "新奇".

**Overseas Chinese**: Google in local markets. Low competition, high engagement. Cultural connection + novelty.

### Regional terminology

Terminology is relatively consistent across markets (打小人, 小人, 詛咒), simplifying keyword strategy. Main differences: 線上 (HK/TW) vs 线上/在线 (CN), 儀式 vs 仪式.

### Seasonal opportunities

- **驚蟄 (Jingzhe)**: March 5-6. Traffic spike starts 1 week before, peaks on the day, tapers 1 week after. 300-500% uplift for 打小人 searches. ZH2 targets this.
- **鬼月 (Ghost Month)**: Lunar 7th month. Folk belief traffic peak. Taboo + 化解 demand. ZH7 targets this.
- **本命年 / 犯太歲**: Year-round steady search with annual spike. ZH6 targets this.

### ZH tone guide

- Don't avoid 詛咒 and 小人 — they're the product and the search terms
- Orthodox cultural voice: 正宗, 傳統, 百年 — not comedy, not academic, but reverence
- Imply supernatural: 萬一有用呢？ — never promise results, but suggest possibility
- zh-TW: Cantonese/HK cultural references (驚蟄, 鵝頸橋)
- zh-Hans: General mainland usage

### ZH 打小人 paragraph angles (50-80 words each)

- ZH1: What is 打小人? From this article to actual experience
- ZH2: 驚蟄 is when 打小人 is most effective online
- ZH5: Fastest way to get rid of bad luck? Try 300-year-old 打小人 ritual
- ZH6: 犯太歲? 打小人 can resolve bad luck from 小人
- ZH8: If you have these signs, 小人 is already at work — beat them
- ZH9: So many curse traditions worldwide, why has 打小人 survived 300 years?
- ZH11: 打小人 in Taiwan too — from temples to online, curse tradition across the strait

---

## 7. Content Differentiation (Competitive Moat)

4 things competitors cannot replicate:

1. **Interactive ritual.** Only site in the SERP where users can "do" something. Dwell time: 2-5 min vs Wikipedia's 30s.
2. **Original data.** "We analyzed 1,000+ rituals. Most common enemy type: 是非小人 (34%)." Data-driven content earns backlinks.
3. **First-person experience.** Google E-E-A-T rewards Experience. Grimoire tone + first-person is something Wikipedia cannot do.
4. **Cultural authenticity.** Real Chinese heritage (Goose Neck Bridge, 300 years). Nobody in EN SERP has this.

---

## 8. Ranking Timeline (Expert Consensus)

| KD Range | Example Keywords | Page 1 Timeline |
|----------|-----------------|-----------------|
| < 20 | villain hitting, is voodoo demonic | 2-4 months |
| 20-30 | how to curse someone, how to get rid of bad luck, revenge spells | 4-8 months |
| 30-45 | voodoo magic, hexes | 6-12 months |
| 60+ | black magic, bad luck (head terms) | 12-18 months, requires aggressive execution |

**DA-0 reality**: BeatPetty won't rank for "black magic" (KD60) for 12+ months. Focus on KD<25 first for early wins.

---

## 9. Phase 2 SEO Blog Plan

### EN — New articles (Month 2-3)

| Proposed Slug | Target Keyword | Vol | KD | Notes |
|---------------|---------------|-----|-----|-------|
| signs-you-are-cursed | signs of a curse / signs you are cursed | 2,400 | 30 | Fear-driven, direct conversion path |
| what-is-evil-eye | what is the evil eye | 8,100 | 45 | Highest volume new topic |
| psychology-of-revenge | psychology of revenge | ~500 | 35 | Academic angle, earns .edu backlinks |

### EN — New articles (Month 4-6)

| Proposed Slug | Target Keyword | Notes |
|---------------|---------------|-------|
| famous-curses-in-history | famous curses | Evergreen, highly shareable |
| chinese-folk-religion-traditions | Chinese folk religion | Broader topical authority |

**Target**: 30+ articles by month 6. 50+ by month 12.

### ZH — Potential new articles

Depends on Phase 1 GSC data. Candidates:
- 驚蟄 seasonal landing page (not blog) — create before March 2027
- 擴充 ZH5/ZH6 if太歲/霉運 keywords gain traction
- Cross-cluster connections based on actual user paths

### Content expansion

- Expand B4 to full 3,000-4,000 word pillar (already done)
- Mini-ritual embed component (deferred loading, < 15KB gzipped) — Phase 2
- Shareable result cards ("I just cursed a 是非小人 using a 300-year Chinese ritual") — Phase 2

### Backlink strategy

**Tier 1 — Digital PR (highest ROI)**:
- "Ancient curse ritual digitized" angle → The Verge, Wired, Vice
- Cultural feature → HK travel/culture blogs
- Data story → "Most commonly cursed enemy types in 2026"

**Tier 2**: Niche directories — occult/spirituality, Chinese culture, "weird web"

**Tier 3**: Content-driven — original research, infographics, embeddable mini-ritual widget

**Target**: 10-15 quality backlinks by month 3. 30+ by month 6.

---

*Consolidated from: seo-chinese-keyword-research.md, blog-seo-en.md, blog-seo-expert-panel.md, blog-seo-zh.md — 2026-04-19*
