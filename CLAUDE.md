# Beating the Petty Person 打小人

Digital 打小人 website — one-person company. Global market, Chinese culture as hook.

> **每個新 session 第一件事：讀 `process.md`，掌握當前任務進度。然後讀 `docs/ARCHITECTURE.md`，不要全掃描 codebase。**
> **寫或改 blog 內容時，先讀 `docs/BLOG_SEO_STANDARD.md` 和 `docs/blog-seo-en.md`（EN）/ `docs/blog-seo-zh.md`（ZH），按標準和關鍵詞計劃執行。**
> **項目 mistakes + decisions 在 `memory/MEMORY.md`。**
> **每個 session 結束前或中斷時，更新 `process.md` 記錄進度和待辦事項。**

## Business Model
- One-time payment, NO subscription
- Free basic ritual + paid enhancements
- USD $2.99 (打人名) / USD $4.99 (封印詛咒) / USD $6.99 (全套)
- 不靠回頭率，靠全球新用戶持續增長

## Core Strategy: 「寧可信其有」
- Position as **curse ritual**, NOT game or therapy — 暗黑 atmosphere
- Hook: "萬一呢？" — suggest supernatural possibility without claiming results
- 不回避「詛咒」——用戶搜 "curse" 來的，就給他們 curse
- 分享用語「酷」不「羞恥」——"I just experienced an ancient Chinese ritual"

## Product Design

### Ritual Flow (4 steps)
1. **選擇小人類型** — 6 種泛型（免費）/ 輸入具體名字（免費）
2. **打小人** — 互動點擊動畫（30s）
3. **燒掉** — 燃燒動畫 + 煙霧效果（9s）
4. **結果揭示** — 基本結果（免費）/ 強化封印 + 證書（付費 $4.99）

詳細 timing/tech/音效見 `docs/ARCHITECTURE.md`

### 小人分類

**EN**: The Backstabber, The Toxic Boss, The Ex, The Energy Vampire, The Bully, Custom
**ZH**: 是非小人, 職場小人, 感情小人, 財運小人, 官非小人, 自定義

兩套完全不同的文案，不是直接翻譯。

### 付費模式

| 方案 | 價格 | 內容 |
|------|------|------|
| 免費 | $0 | 選泛型 → 打 → 燒 → 基本結果（完整體驗）|
| A 詛咒解讀 | $2.99 | 個人化模組化詛咒解讀（162 種獨特解讀） |
| B 封印詛咒 | $4.99 | 強化封印動畫 + 數位證書 + 強化版結果 |
| C 全套 | $6.99 | A + B 全部 |

**UX 原則**：免費 = 完整，付費 = 「加強」。付費牆在儀式結束後（沉沒成本）。不需帳號，Stripe Session ID + localStorage。
**信任原則**：不造假數據（無假計數器/假評價），用真實文化遺產代替。明確隱私政策 + 全額退款保證。Stripe 信任標章。

### 按鈕文案
- ❌「Upgrade」「Pay to unlock」
- ✓「Complete the Sealing Ritual」「Reveal the Curse Reading — $2.99」

### 新增頁面
- `/about` — 創辦人故事 + 文化使命（3 語言）

## Tech Stack & Details
→ 見 `docs/ARCHITECTURE.md`（完整目錄結構、狀態機、音頻/Canvas 架構、CSS、顏色、技術風險）

## Status
- Project initialized: 2026-04-03
- **Day 1 completed: 2026-04-07** — 3-language skeleton, Tailwind dark theme, GA4, beatpetty.com live
- **Day 2 completed: 2026-04-07** — Full landing page, candle/glow/particle animations, SEO
- **Day 3 completed: 2026-04-07** — Full ritual flow (4 steps + 2 transitions), Canvas particles, Web Audio synthesis, shared silhouettes
- **Day 4 completed: 2026-04-07** — Stripe Checkout API, Webhook, Pricing Page, Result Page, OG image
- **Day 5 completed: 2026-04-08** — PWA manifest+icons, Lighthouse A11y 100, SEO (robots.txt, sitemap, hreflang), contrast fixes, pricing page bug fix, OG image URL fix
- Phase 2 SEO completed: 2026-04-08 — MDX blog system, /what-is, /how-it-works, /history pages
- **Landing Page SEO completed: 2026-04-12** — EN meta/hero/body/FAQ optimized, ZH-TW/ZH-Hans optimized, keyword cannibalization fixed, sitemap lastmod added
- **GSC submitted: 2026-04-12** — sitemap.xml with lastmod, hreflang
- **Ritual Redesign completed: 2026-04-12** — $2.99 tier repositioned as "Curse Reading" (personalized modular reading), free name input in Step 1, name on paper figure, 162 unique readings (6 types × 27 combinations × 3 languages)
- **Expert Review + UX Overhaul completed: 2026-04-13** — 3-expert panel (Marketing/UX/Cultural) scored 5.3/10 pre-fix → 39 improvements executed: removed fake counter & fake social proof, added honest heritage messaging, privacy policy, refund policy, About page (/about), keyboard accessibility, aria-live announcements, responsive interaction area (clamp), staggered entrance animations, landing page fade-out transition, Stripe trust badge on result page, haptic escalation, name always visible on paper figure, ignite hint pulsing text
- **Conversion Optimization completed: 2026-04-13** — 8 fixes based on expert review: atmosphere false claim removed, reading seed mismatch fixed (preview=checkout), share button i18n, suspenseful free result copy ("ashes hold a message"), 2.5s reading ceremony loading, "Best Value" badge on $6.99, EN enemy descriptions aligned with ZH concepts (fortune/conflict), BurningStep keyboard accessibility
- **ZH Blog SEO Strategy completed: 2026-04-14** — 3-agent discussion (SEO/Conversion/Cultural) + Elon critique: 3 clusters (打小人核心/命理與改運/詛咒文化), 11 posts planned, rejected "生氣怎麼辦"/"發洩情緒" (intent mismatch), identified 太歲/鬼月 as missed opportunities. Strategy doc: `docs/blog-seo-zh.md`
- **ZH Blog Content Progress: 2026-04-15** — **11/11 posts completed** (zh-TW + zh-Hans). All stubs expanded to full SEO-standard articles. Old EN-slug posts deleted, 301 redirects in `next.config.ts`. 14/21 new blog images generated via Gemini API, 7 remaining (VPN required). See `process.md` for current state.
- Phase: **Soft Launch — Stripe live, accepting payments**
- Owner: Allen (business, content, tool setup) | Claude (design, code, SEO, tech)
- Deploy: `npx vercel --prod --yes`

## Launch Status

- [x] Stripe HK 帳號註冊
- [x] 3 Products 建立: 打人名 $2.99, 封印詛咒 $4.99, 全套 $6.99
- [x] Vercel env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_NAME`, `STRIPE_PRICE_ID_SEAL`, `STRIPE_PRICE_ID_FULL`
- [x] Stripe live mode
- [x] 實機測試 (iPhone Safari + Android Chrome)
- [x] Google Search Console 提交 (sitemap.xml + hreflang)

## Post-Launch → Phase 2
→ 見 `docs/FUTURE_ROADMAP.md`
