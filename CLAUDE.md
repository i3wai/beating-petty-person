# Beating the Petty Person 打小人

Digital 打小人 website — one-person company. Global market, Chinese culture as hook.

> **每個新 session 第一件事：讀 `docs/ARCHITECTURE.md`，不要全掃描 codebase。**

## Business Model
- One-time payment, NO subscription
- Free basic ritual + paid enhancements
- USD $2.99 (打人名) / USD $4.99 (封印詛咒) / USD $4.99 (全套)
- 不靠回頭率，靠全球新用戶持續增長

## Core Strategy: 「寧可信其有」
- Position as **curse ritual**, NOT game or therapy — 暗黑 atmosphere
- Hook: "萬一呢？" — suggest supernatural possibility without claiming results
- 不回避「詛咒」——用戶搜 "curse" 來的，就給他們 curse
- 分享用語「酷」不「羞恥」——"I just experienced an ancient Chinese ritual"

## Product Design

### Ritual Flow (4 steps)
1. **選擇小人類型** — 6 種泛型（免費）/ 輸入具體名字（付費 $2.99）
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
| A 打人名 | $2.99 | 輸入具體名字 + 名字燃燒動畫 + 針對性結果 |
| B 封印詛咒 | $4.99 | 強化封印動畫 + 數位證書 + 強化版結果 |
| C 全套 | $4.99 | A + B 全部 |

**UX 原則**：免費 = 完整，付費 = 「加強」。付費牆在儀式結束後（沉沒成本）。不需帳號，Stripe Session ID + localStorage。

### 按鈕文案
- ❌「Upgrade」「Pay to unlock」
- ✓「Complete the Sealing Ritual」「Name Your Enemy — $2.99」

## Tech Stack & Details
→ 見 `docs/ARCHITECTURE.md`（完整目錄結構、狀態機、音頻/Canvas 架構、CSS、顏色、技術風險）

## Status
- Project initialized: 2026-04-03
- **Day 1 completed: 2026-04-07** — 3-language skeleton, Tailwind dark theme, GA4, beatpetty.com live
- **Day 2 completed: 2026-04-07** — Full landing page, candle/glow/particle animations, SEO
- **Day 3 completed: 2026-04-07** — Full ritual flow (4 steps + 2 transitions), Canvas particles, Web Audio synthesis, shared silhouettes
- Phase: **Day 4 — Stripe Checkout + Result Page + Pricing Page (UI done, Stripe keys pending)**
- Owner: Allen (business, content, tool setup) | Claude (design, code, SEO, tech)
- Deploy: `npx vercel --prod --yes`

## Day 4 Plan — Stripe + Result + Pricing

### 前置條件（Allen）⚠️ BLOCKER
1. 註冊 Stripe HK 帳號
2. 建立 3 個 Products: 打人名 $2.99, 封印詛咒 $4.99, 全套 $4.99
3. 提供 `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
4. 設定 Vercel env vars

### Claude 工作
1. ~~**Stripe Checkout API** — `/api/checkout` route, create Checkout Session~~ ✅
2. ~~**Stripe Webhook** — `/api/webhook` route, verify signature, mark payment~~ ✅
3. ~~**Result Page** — 免費結果 + 付費 CTA + payment verification~~ ✅
4. ~~**Pricing Page** — 4 方案卡片，Stripe Checkout 連結~~ ✅
5. ~~**Payment verification** — success_url callback → localStorage 標記~~ ✅
6. **og-image.png** — 生成 OG 分享圖 (pending)

## Day 5 Plan — Polish + PWA + Launch

1. **PWA** — @serwist/next 設定, manifest.json, service worker
2. **全流程 E2E 測試** — Landing → Ritual → Result → Payment (test mode)
3. **Mobile 測試** — iOS Safari, Android Chrome
4. **SEO 驗證** — Search Console 提交, hreflang 驗證
5. **Performance** — Lighthouse check
6. **Launch** — 切換 Stripe to live mode, final deploy
