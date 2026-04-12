# Blog SEO 架構設計規格書

**日期**: 2026-04-12
**範圍**: 英文 Blog 文章 — 9 篇文章、3 個主題集群、技術 SEO 基礎設施
**審查者**: Dr. Sarah Chen（技術 SEO）、Marcus Rivera（內容 SEO）、Aisha Patel（競爭 SEO）
**狀態**: 專家團隊審核通過

---

## 1. 概覽

BeatPetty 的 Blog（「咒語集 The Grimoire」）將包含 9 篇文章，分為 3 個主題集群。策略優先搶低 KD 關鍵字，透過 pillar-spoke 內部連結建立 topical authority，並以 BeatPetty 獨有的互動儀式作為競爭壁壘。

### 核心原則

- **Spokes 支撐 Pillars。** 低 KD 的 spoke 文章先發，為高 KD pillar 建立語義基礎。
- **每篇文章都連到 /ritual。** 免費詛咒儀式是所有內容的轉換終點。
- **內容就是產品。** 暗黑神秘、Grimoire 風格。不走學術路線，不走搞笑路線。
- **技術 SEO 是 P0。** 目前 codebase 零 JSON-LD，必須在任何文章上線前修好。

---

## 2. 文章矩陣

### Cluster A: 詛咒與黑魔法（可驗證月搜量 ~50,000+）

| # | Slug | 角色 | 主關鍵字 | 月搜量 | KD | 字數 | FAQ 數 |
|---|------|------|---------|--------|-----|------|--------|
| B4 | `/blog/what-is-black-magic` | **支柱** | what is black magic, black magic, is black magic real, black magic spells | 2,900 + 22,200 + 1,900 + 1,300 | 60 | 3,000-4,000 | 6-8 |
| B2 | `/blog/how-to-curse-someone` | 輻條 | how to curse someone, how to curse people, how to curse a person | 1,300 + 590 + 480 | 25 | 1,500-2,000 | 4-5 |
| B7 | `/blog/hex-spells-curses` | 輻條 | hexes, hexing, how to hex someone, hex spell, hex spells | 1,900 + 1,600 + 880 + 590 + 480 | 25-33 | 1,800-2,200 | 4-5 |
| B5 | `/blog/revenge-spells` | 輻條 | revenge spells, revenge spell, spells for revenge | 590 + 320 + ~200 | 24 | 1,500-1,800 | 4-5 |

**Cluster A 輔助關鍵字：**
- "white magic vs black magic" (1,600) → B4 子段落
- "black magic meaning" (880) → B4
- "how to do black magic" (480) → B4
- "black magic ritual" (320) → B4
- "how to put a curse on someone" (1,300) → B2
- "hexes and curses" (320) → B7
- "put a hex on someone" (260) → B7
- "how do you hex someone" (590) → B7

### Cluster B: 厄運與詛咒解除（可驗證月搜量 ~4,560+）

| # | Slug | 角色 | 主關鍵字 | 月搜量 | KD | 字數 | FAQ 數 |
|---|------|------|---------|--------|-----|------|--------|
| B8 | `/blog/how-to-get-rid-of-bad-luck` | **支柱** | how to get rid of bad luck, bad luck, how to remove bad luck | 1,000 + 3,600 + 480 | 23-55 | 2,500-3,500 | 6-8 |
| B9 | `/blog/how-to-remove-a-curse` | 輻條 | how to remove a curse, signs of a curse, curse protection | 1,300 + 590 + 480 | ~30 | 1,500-2,000 | 4-5 |

**Cluster B 輔助關鍵字：**
- "karma spell" (720) → B8（防禦/恢復意圖，不是報復）
- "how to undo bad luck" (480) → B8
- "is bad luck real" (480) → B8 FAQ
- "how to tell if someone put a curse on you" (210) → B9
- "get rid of a curse spell" (210) → B9

### Cluster C: 全球詛咒傳統（可驗證月搜量 ~2,400+）

| # | Slug | 角色 | 主關鍵字 | 月搜量 | KD | 字數 | FAQ 數 |
|---|------|------|---------|--------|-----|------|--------|
| B6 | `/blog/voodoo-magic-curses` | **支柱** | voodoo magic, is voodoo demonic, voodoo hex | 1,600 + 480 + 210 | 41 | 2,000-2,500 | 5-6 |
| B1 | `/blog/what-is-da-siu-yan` | 輻條 | villain hitting, Da Siu Yan, what is beating petty person | ~200 | <20 | 1,200-1,500 | 3-4 |
| B3 | `/blog/history-of-villain-hitting` | 輻條 | Goose Neck Bridge Hong Kong, Jingzhe curse tradition | ~500 | <15 | 1,200-1,500 | 3-4 |

**Cluster C 輔助關鍵字：**
- "is voodoo real" (1,900) → B6 FAQ（重大長尾發現）
- "how does voodoo work" (590) → B6
- "voodoo vs black magic" (320) → B6，連到 B4
- "Chinese folk magic" (260) → B1
- "voodoo curse" (~300) → B6

---

## 3. 主題集群內部連結地圖

### Cluster A 內部連結

```
B4（支柱: what-is-black-magic）
  → /ritual（CTA）
  → B2 how-to-curse-someone（同集群輻條）
  → B7 hex-spells-curses（同集群輻條）
  → B5 revenge-spells（同集群輻條）
  → B8 how-to-get-rid-of-bad-luck（跨集群）
  → B6 voodoo-magic-curses（跨集群）

B2（輻條 → 支柱 B4）
  → /ritual（CTA）
  → B4 what-is-black-magic（回到支柱）
  → B7 hex-spells-curses（同集群）
  → B8 how-to-get-rid-of-bad-luck（跨集群）

B7（輻條 → 支柱 B4）
  → /ritual（CTA）
  → B4 what-is-black-magic（回到支柱）
  → B5 revenge-spells（同集群）
  → B2 how-to-curse-someone（同集群）
  → B1 what-is-da-siu-yan（跨集群）

B5（輻條 → 支柱 B4）
  → /ritual（CTA）
  → B4 what-is-black-magic（回到支柱）
  → B7 hex-spells-curses（同集群）
  → B8 how-to-get-rid-of-bad-luck（跨集群）
```

### Cluster B 內部連結

```
B8（支柱: how-to-get-rid-of-bad-luck）
  → /ritual（CTA）
  → B9 how-to-remove-a-curse（同集群輻條）
  → B4 what-is-black-magic（跨集群）
  → B5 revenge-spells（跨集群）

B9（輻條 → 支柱 B8）
  → /ritual（CTA）
  → B8 how-to-get-rid-of-bad-luck（回到支柱）
  → B4 what-is-black-magic（跨集群）
  → B6 voodoo-magic-curses（跨集群）
```

### Cluster C 內部連結

```
B6（支柱: voodoo-magic-curses）
  → /ritual（CTA）
  → B1 what-is-da-siu-yan（同集群輻條，品牌識別）
  → B3 history-of-villain-hitting（同集群輻條）
  → B4 what-is-black-magic（跨集群）
  → B7 hex-spells-curses（跨集群）

B1（輻條 → 支柱 B6）
  → /ritual（CTA）
  → B6 voodoo-magic-curses（回到支柱）
  → B3 history-of-villain-hitting（同集群）
  → B2 how-to-curse-someone（跨集群）

B3（輻條 → 支柱 B6）
  → /ritual（CTA）
  → B6 voodoo-magic-curses（回到支柱）
  → B1 what-is-da-siu-yan（同集群）
  → B4 what-is-black-magic（跨集群）
```

### 連結錨文本規則

| 連結類型 | 規則 | 範例 |
|----------|------|------|
| 連到支柱 | 用目標關鍵字 | "black magic" → B4 |
| 連到輻條 | 用描述性文字 | "hex spells and curses" → B7 |
| 連到 /ritual | 用 CTA 文案 | "Try the free curse ritual" |
| 跨集群 | 自然語言 | "In Chinese tradition, cursing works differently" |
| **禁止** | "click here"、"learn more"、"read more" | — |

---

## 4. 每篇文章模板

```markdown
---
title: "[主關鍵字] — [吸引眼球的副標]"    # < 60 字元
description: "[含關鍵字的描述，帶 CTA 語氣]"  # < 155 字元
keywords: [主關鍵字, 輔助1, 輔助2, ...]
date: "2026-04-XX"
cluster: "A" | "B" | "C"           # 新增：用於 Blog Hub 分組
updatedDate: "2026-04-XX"           # 新增：用於 freshness 信號
ogImage: "/og-blog-[slug].png"      # 可選
---

## H1: [主關鍵字 + 吸引眼球的標題]

[開場：2-3 句包含主關鍵字。直擊搜索意圖。不廢話。]

## H2: [第一個子主題 — 含次要關鍵字]

[深度內容。支柱 600-1000 字，輻條 400-600 字。]

## H2: [第二個子主題]

[包含內部連結到支柱或同集群輻條。]

## H2: [第三個子主題]

[包含跨集群連結。以下是打小人段落：]

### [打小人段落 — 50-80 字，每篇文章角度不同]
[每篇不同的切入點：]
- B4: 「打小人在全球黑魔法傳統中的定位」
- B7: 「東方 hex 與西方 hex 的差異」
- B5: 「當報復遇上真實文化實踐」
- B8: 「古老的厄運消除儀式」
- B6: 「Voodoo 與打小人——兩種詛咒傳統比較」
- B2: 「親自試試——線上詛咒儀式」
- B9: 「以毒攻毒——詛咒解除傳統」
- B1: 「源自香港的原始詛咒儀式」
- B3: 「從鵝頸橋到你的螢幕」

[CTA 區塊 — 暗黑 Grimoire 風格組件]
> 讀夠了。親自試試。
> [開始詛咒儀式 →]
> 免費。60 秒。萬一呢？

## H2: 常見問題

### [FAQ 1 — 針對特定長尾關鍵字]
### [FAQ 2 — 針對 PAA 問題]
### [FAQ 3 — 針對長尾關鍵字]
### [支柱 4-8 題，輻條 4-5 題]
```

---

## 5. 發布排程

| 週 | 文章 | 理由 |
|---|------|------|
| **1** | B8（厄運支柱，2,500-3,500 字）+ B2（如何詛咒，1,500-2,000 字） | 最高流量快速勝利（KD23-25）。內部連結從第一天就有效。 |
| **2** | B6（voodoo 支柱，2,000-2,500 字） | KD19 精選摘要機會，最低競爭支柱 |
| **3** | B7（hex 法術，1,800-2,200 字）+ B9（解除詛咒，1,500-2,000 字） | Cluster A 輻條 + Cluster B 輻條 |
| **4** | B5（報復法術，1,500-1,800 字）+ B1（打小人是什麼，1,200-1,500 字） | Cluster A 輻條 + Cluster C 輻條（品牌識別） |
| **5** | B3（打小人歷史，1,200-1,500 字） | 完成 Cluster C |
| **6** | B4（黑魔法支柱，3,000-4,000 字） | 最高流量、最高 KD。最後發，由 8 篇輻條提供語義支持。 |

**規則**：每週不超過 2 篇。每篇文章有自己的 freshness 信號和推廣窗口。

---

## 6. 技術 SEO 需求（P0 — 任何文章發布前必須完成）

### 6.1 JSON-LD 結構化資料（目前為零）

| Schema | 位置 | 優先級 |
|--------|------|--------|
| `Organization` | 根 `layout.tsx` | P0 |
| `Article` | 每篇 blog 文章的 `generateMetadata` | P0 |
| `FAQPage` | 每篇有 FAQ 的文章 | P0 |
| `BreadcrumbList` | 每篇 blog 文章 + blog hub | P0 |
| `HowTo` | B2, B8, B9（how-to 意圖文章） | P1 |
| `WebSite` | 根 `layout.tsx` | P2 |
| `Speakable` | B4, B6（語音搜索目標） | P3 |

### 6.2 Blog 文章 Metadata 修復

目前 `/blog/[slug]/page.tsx` 的 `generateMetadata` 缺少：
- `alternates.canonical` — 必須設定明確的 canonical URL
- `alternates.languages` — 必須為 3 種語言宣告 hreflang
- `openGraph.type: "article"` 加上 `publishedTime` 和 `modifiedTime`

### 6.3 PostMeta 介面擴充

在 `src/lib/content.ts` 的 PostMeta 新增：
```typescript
{
  // 現有欄位...
  cluster: "A" | "B" | "C";      // 用於 blog hub 分組
  updatedDate?: string;            // 用於 Article schema 的 dateModified
}
```

### 6.4 Blog Hub 重構

目前 `/blog` 按時間排序列出文章。重構為：
- H1: "The Grimoire — Ancient Curse Knowledge & Forbidden Wisdom"
- 簡短介紹（2-3 句，含 "curse ritual"、"ancient magic"）
- 3 個集群區塊，每區支柱文章置頂
- 底部 CTA 到 /ritual

### 6.5 相關文章組件

加到 blog 文章模板（`/blog/[slug]/page.tsx`）：
- 底部「相關文章」區塊
- 顯示 2-3 篇同集群文章
- 用 cluster frontmatter 欄位分組

### 6.6 麵包屑導航

加麵包屑 UI + BreadcrumbList schema：
- `Home > Blog > [文章標題]`
- 實作為共享組件

### 6.7 Sitemap 遷移

- 將靜態 `public/sitemap.xml` 改為動態生成
- 自動加入 blog 文章 URL
- 移除 `changefreq` 和 `priority`（Google 忽略它們）
- 保持準確的 `lastmod`（從 frontmatter date 取得）
- 在 sitemap 中加入 `xhtml:link` hreflang alternates

### 6.8 301 重定向

文章上線時，在 `next.config.ts` 加入重定向：
- `/en/what-is` → `/en/blog/what-is-da-siu-yan`
- `/en/how-it-works` → `/en/blog/how-to-curse-someone`
- `/en/history` → `/en/blog/history-of-villain-hitting`
- zh-TW 和 zh-Hans 版本同理
- 驗證重定向正常後刪除舊 MDX 檔案和頁面組件

### 6.9 Robots 指令

- `/result` 頁面：加 `noindex`（工具頁，非有機流量目標）

---

## 7. 現有頁面內容遷移

| 舊路由 | 新路由 | 操作 |
|--------|--------|------|
| `/[locale]/what-is` | `/[locale]/blog/what-is-da-siu-yan` | 301 重定向，MDX 移至 blog/，擴充內容 |
| `/[locale]/how-it-works` | `/[locale]/blog/how-to-curse-someone` | 301 重定向，MDX 移至 blog/，擴充內容 |
| `/[locale]/history` | `/[locale]/blog/history-of-villain-hitting` | 301 重定向，MDX 移至 blog/，擴充內容 |

**風險**：低。頁面只有 10 天，零外部反向連結。無權重損失。

**流程**：
1. 建立擴充內容的新 blog MDX 檔案
2. 在 next.config.ts 加入 301 重定向
3. 移除舊頁面組件和 MDX 檔案
4. 部署前驗證重定向正常

---

## 8. 內容差異化策略

BeatPetty 有 4 個競爭對手無法複製的獨特優勢：

1. **互動儀式。** SERP 中唯一讓用戶可以「做些什麼」的網站。停留時間優勢：2-5 分鐘 vs Wikipedia 的 30 秒。
2. **原始數據。**「我們分析了 1,000+ 儀式。最常見的敵人類型：是非小人（34%）。」數據驅動的內容能賺反向連結。
3. **第一人稱體驗視角。** Google E-E-A-T 獎勵 Experience。我們的 Grimoire 調性 + 第一人稱是 Wikipedia 做不到的。
4. **文化真實性。** 真正的中國文化遺產（鵝頸橋、300 年歷史），不是編造的 Wicca 內容。英文 SERP 中沒人有這個。

---

## 9. FAQ 關鍵字目標（共 35-42 題）

### B4 FAQ（6-8 題）
- "Is black magic real?" (1,900)
- "What is the difference between black magic and white magic?" (~590)
- "Is black magic dangerous?" (~480)
- "Can black magic be removed?" (~320)
- "Types of black magic around the world" (~260)
- "How does black magic work?" (~480)

### B8 FAQ（6-8 題）
- "What are signs of bad luck?" (~480)
- "Can someone put a curse of bad luck on you?" (~260)
- "How long does bad luck last?" (~320)
- "Is bad luck real?" (480)
- "How to reverse bad luck?" (~260)
- "Why do I have bad luck?" (~320)

### B6 FAQ（5-6 題）
- "Is voodoo real?" (1,900 — 重大發現)
- "How does voodoo work?" (~590)
- "Is voodoo demonic?" (480)
- "Voodoo vs black magic" (~320)
- "What is voodoo magic?" (~260)

### B7 FAQ（4-5 題）
- "What does hexing mean?" (1,300)
- "What does it mean to hex someone?" (210)
- "How does hex work?" (260)
- "Are hexes real?" (~260)

### B2 FAQ（4-5 題）
- "How do you curse someone?" (210)
- "How to curse effectively?" (210)
- "Can you curse someone online?" (~200)
- "Is cursing someone real?" (~200)

### B9 FAQ（4-5 題）
- "How to tell if someone put a curse on you?" (210)
- "How to break a curse?" (~320)
- "Can a curse be removed?" (~260)
- "Signs you are cursed" (~590)

### B5 FAQ（4-5 題）
- "Do revenge spells work?" (~260)
- "Are revenge spells real?" (~200)
- "What is a karma spell?" (~320)
- "How to cast a revenge spell?" (~260)

### B1 FAQ（3-4 題）
- "What is Da Siu Yan?" (~50)
- "What does 打小人 mean?" (~50)
- "Is beating the petty person real?" (~30)

### B3 FAQ（3-4 題）
- "Where to beat petty person in Hong Kong?" (~200)
- "When is the best time for Da Siu Yan?" (~100)
- "What happens during villain hitting?" (~100)

---

## 10. 第二階段（上線後增強）

### 第 2-3 個月：內容擴充
- 將 B4 擴充至完整 3,000-4,000 字支柱
- 將 B8 擴充至完整 2,500-3,500 字支柱
- 加入 mini-ritual 嵌入組件（延遲載入，< 15KB gzipped）

### 第 2-3 個月：新文章
- "Signs you've been cursed" (2,400 vol, KD30)
- "What is the evil eye" (8,100 vol, KD45)
- "The psychology of revenge"（學術角度，賺 .edu 反向連結）

### 第 4-6 個月：權威建設
- "Famous curses in history"（長青內容，易分享）
- "Chinese folk religion traditions"（更廣泛的 topical authority）
- 目標：30+ 篇文章建立真正的 topical authority

### 反向連結策略
- **Tier 1**: 數位公關 —「古老中國詛咒儀式數位化」→ 科技/文化媒體
- **Tier 2**: 利基目錄 — occult/spirituality、中國文化、「weird web」
- **Tier 3**: 內容驅動 — 原創數據研究、資訊圖表、可嵌入的 mini-ritual 小工具

---

## 11. 排名時間線預估（專家共識）

| KD 範圍 | 範例關鍵字 | 首頁時間線 |
|---------|-----------|-----------|
| < 20 | "villain hitting"、"is voodoo demonic" | 2-4 個月 |
| 20-30 | "how to curse someone"、"how to get rid of bad luck"、"revenge spells" | 4-8 個月 |
| 30-45 | "voodoo magic"、"hexes" | 6-12 個月 |
| 60+ | "black magic"、"bad luck"（頭部詞） | 12-18 個月，需積極執行 |

---

## 12. 需建立/修改的檔案

### 新建檔案
| 檔案 | 用途 |
|------|------|
| `content/en/blog/how-to-get-rid-of-bad-luck.mdx` | B8 文章 |
| `content/en/blog/how-to-curse-someone.mdx` | B2 文章（從 how-it-works 遷移） |
| `content/en/blog/voodoo-magic-curses.mdx` | B6 文章 |
| `content/en/blog/hex-spells-curses.mdx` | B7 文章 |
| `content/en/blog/revenge-spells.mdx` | B5 文章 |
| `content/en/blog/what-is-da-siu-yan.mdx` | B1 文章（從 what-is 遷移） |
| `content/en/blog/history-of-villain-hitting.mdx` | B3 文章（從 history 遷移） |
| `content/en/blog/what-is-black-magic.mdx` | B4 文章 |
| `content/en/blog/how-to-remove-a-curse.mdx` | B9 文章 |
| （zh-TW 和 zh-Hans 同結構 — 第二階段） | |
| `src/components/Breadcrumb.tsx` | 麵包屑導航組件 |
| `src/components/RelatedArticles.tsx` | 相關文章組件 |
| `src/components/BlogCtaBlock.tsx` | 暗黑風格 CTA 區塊 |
| `src/lib/json-ld.ts` | JSON-LD 生成工具 |

### 修改檔案
| 檔案 | 變更 |
|------|------|
| `src/app/[locale]/layout.tsx` | 加入 Organization + WebSite JSON-LD |
| `src/app/[locale]/blog/page.tsx` | 重構為集群式 Hub |
| `src/app/[locale]/blog/[slug]/page.tsx` | 加入 canonical、hreflang、Article+FAQPage+BreadcrumbList JSON-LD、相關文章、麵包屑 |
| `src/lib/content.ts` | PostMeta 加入 `cluster`、`updatedDate` |
| `src/lib/mdx-components.tsx` | 註冊 BlogCtaBlock 組件 |
| `next.config.ts` | 加入舊頁面 URL 的 301 重定向 |
| `public/sitemap.xml` | 遷移至動態生成（或 `src/app/sitemap.ts`） |

### 刪除檔案（重定向驗證後）
| 檔案 | 原因 |
|------|------|
| `src/app/[locale]/what-is/page.tsx` | 已重定向到 blog |
| `src/app/[locale]/how-it-works/page.tsx` | 已重定向到 blog |
| `src/app/[locale]/history/page.tsx` | 已重定向到 blog |
| `content/en/what-is.mdx` | 已移至 blog/ |
| `content/en/how-it-works.mdx` | 已移至 blog/ |
| `content/en/history.mdx` | 已移至 blog/ |
| （zh-TW、zh-Hans 同理） | |

---

## 13. 驗證清單

實作完成後：
- [ ] `npm run build` 無錯誤通過
- [ ] 9 篇 blog 文章在正確 URL 上渲染
- [ ] 舊 URL（/what-is、/how-it-works、/history）返回 301 到新 URL
- [ ] JSON-LD 驗證通過（Organization、Article、FAQPage、BreadcrumbList）
- [ ] 每篇 blog 文章都有 hreflang alternates
- [ ] 每篇 blog 文章都有 canonical URL
- [ ] 文章間內部連結正常（無死連結）
- [ ] Blog Hub 按集群分組顯示文章
- [ ] 相關文章組件顯示同集群文章
- [ ] 麵包屑導航在 blog 文章上正確渲染
- [ ] FAQ 區塊以正確的 H3 標題渲染
- [ ] CTA 區塊正確渲染並連到 /ritual
- [ ] Sitemap 包含所有新 blog URL
- [ ] Lighthouse SEO 分數 90+
