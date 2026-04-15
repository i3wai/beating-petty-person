# BeatPetty — Current Process State

> **Every new session: read this file first. Every session end: update this file.**
> Last updated: 2026-04-15

---

## Active Task: ZH Blog SEO Full Audit & Image Generation

### Status: IN PROGRESS — images 67% complete

### What was done (this session)

1. **Full SEO audit of all 11 ZH blog posts** (zh-TW + zh-Hans) against `docs/BLOG_SEO_STANDARD.md`
2. **Image gaps identified and fixed:**
   - All 11 zh-TW articles updated with 3-4 image placeholders each (proper alt text, correct placement)
   - All 11 zh-Hans articles synced with identical image additions
   - Reused existing EN blog images where fitting (history-goose-neck-bridge.jpg, history-paper-burning-seal.jpg, curse-traditions-world.jpg, curse-ritual-tools.jpg)
3. **SEO gaps fixed:**
   - ZH5 去霉運方法: added 2 missing Wikipedia external links (神道, 風水)
   - ZH6 犯太歲化解: added 1 missing Wikipedia external link (太歲)
4. **14/21 new images generated via Gemini API** (see below)
5. **Build verified:** `npm run build` passes with zero errors
6. **Created `scripts/generate-blog-images.mjs`** for batch image generation

### Images generated (14/21 done)

| # | File | Size | Used in |
|---|------|------|---------|
| 1 | villain-paper-burning-fire.jpg | 151KB | ZH1 |
| 2 | online-digital-ritual-screen.jpg | 154KB | ZH1 |
| 3 | jingzhe-spring-thunder-awakening.jpg | 216KB | ZH2 |
| 4 | curse-spell-chanting-ritual.jpg | 217KB | ZH3 |
| 5 | paper-effigy-beating-closeup.jpg | 241KB | ZH3 |
| 6 | elderly-woman-ritual-service.jpg | 191KB | ZH4 |
| 7 | goose-neck-bridge-panoramic.jpg | 243KB | ZH4 |
| 8 | bad-luck-removal-overview.jpg | 169KB | ZH5 |
| 9 | salt-water-purification-bath.jpg | 189KB | ZH5 |
| 10 | feng-shui-home-luck.jpg | 206KB | ZH5 |
| 11 | taisui-temple-worship.jpg | 204KB | ZH6 |
| 12 | zodiac-taisui-animals.jpg | 229KB | ZH6 |
| 13 | protection-charms-red-rope.jpg | 193KB | ZH6 |
| 14 | ghost-month-atmosphere.jpg | 181KB | ZH7 |

### Outstanding: 7 images not yet generated

| # | File | Used in |
|---|------|---------|
| 15 | zhongyuan-festival-offerings.jpg | ZH7 鬼月禁忌與化解 |
| 16 | petty-person-signs-surrounded.jpg | ZH8 小人作祟的徵兆 |
| 17 | villain-protection-defense.jpg | ZH8 小人作祟的徵兆 |
| 18 | global-curse-traditions-map.jpg | ZH9 詛咒術大比較 |
| 19 | qing-dynasty-villain-hitting.jpg | ZH10 打小人的歷史 |
| 20 | taiwan-temple-petty-person.jpg | ZH11 台灣打小人文化 |
| 21 | taiwan-folk-ritual-elements.jpg | ZH11 台灣打小人文化 |

### How to continue image generation

1. Ensure VPN is enabled (Gemini API blocked in Taiwan)
2. Run: `node scripts/generate-blog-images.mjs`
3. Script skips already-generated images, only generates the 7 remaining
4. Images save to `public/blog/`, auto-converted to JPG 1200x630

### Per-article image count after completion

| Article | Type | Target | Existing | New gen | Reused | Total |
|---------|------|--------|----------|---------|--------|-------|
| ZH1 打小人完整攻略 | Pillar | 3-4 | 2 | 2 | 0 | 4 |
| ZH2 驚蟄打小人攻略 | Spoke | 3-4 | 2 | 1 | 0 | 3 |
| ZH3 打小人咒語 | Spoke | 3-4 | 0 | 2 | 1 | 3 |
| ZH4 鵝頸橋打小人 | Spoke | 3-4 | 1 | 2 | 1 | 4 |
| ZH5 去霉運方法 | Pillar | 3-4 | 0 | 3 | 0 | 3 |
| ZH6 犯太歲化解 | Spoke | 3-4 | 0 | 3 | 0 | 3 |
| ZH7 鬼月禁忌與化解 | Spoke | 3-4 | 0 | 2 | 0 | 2→3 |
| ZH8 小人作祟的徵兆 | Spoke | 3-4 | 0 | 2 | 0 | 2→3 |
| ZH9 詛咒術大比較 | Pillar | 3-4 | 0 | 1 | 1 | 2→3 |
| ZH10 打小人的歷史 | Spoke | 3-4 | 0 | 1 | 2 | 3 |
| ZH11 台灣打小人文化 | Spoke | 3-4 | 0 | 2 | 0 | 2→3 |

### After images are done

1. `npm run build` — verify
2. Deploy: `npx vercel --prod --yes`
3. Update CLAUDE.md status section (ZH Blog Content Progress → 11/11 complete with images)
4. Consider: submit updated sitemap to Google Search Console

---

## Previously Completed (prior sessions)

- 11/11 ZH blog posts fully written (zh-TW + zh-Hans)
- 6 old EN-slug ZH posts deleted, 301 redirects in `next.config.ts`
- Build passes, deployed to Vercel production
- 4/11 posts completed earlier: ZH1, ZH2, ZH5, ZH6
- 7/11 posts rewritten this session: ZH3, ZH4, ZH7, ZH8, ZH9, ZH10, ZH11

---

## Notes

- Gemini API (`gemini-3.1-flash-image-preview`) requires VPN from Taiwan
- `GEMINI_API_KEY` env var is set
- Image generation script: `scripts/generate-blog-images.mjs`
- Each image: ~150-250KB, 1200x630, 16:9, dark fantasy style
- All images have descriptive alt text (15-30 words) in the MDX files
