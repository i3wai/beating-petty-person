# Beating the Petty Person 打小人

Digital 打小人 website — one-person company. Global market, Chinese culture as hook.

> Future roadmap & business analysis moved to `docs/FUTURE_ROADMAP.md`

## Business Model
- **One-time payment** (NO subscription for MVP)
- Free basic ritual + paid enhancements
- USD $2.99 (打人名) / USD $4.99 (封印詛咒) / USD $4.99 (全套)
- Core logic: 不靠回頭率，靠全球新用戶持續增長。像電影票 — 不斷有新好奇用戶付 $2.99-4.99

## Core Strategy: 「寧可信其有」
- Position as **curse ritual**, NOT game or therapy — 暗黑 atmosphere
- Hook: "萬一呢？" — suggest supernatural possibility without claiming results
- Dark candlelit aesthetic, ritual chanting sounds, solemn pacing
- 全球包裝：不是「遊戲」，是「你不知道存在的真實古老中國詛咒儀式」。類比 Voodoo、黑魔術的迷戀
- 不回避「詛咒」——用戶搜 "curse" 來的，就給他們 curse

## Product Design

### Pages
- 5 core pages: Landing, Game/Ritual, Pricing, Result, (Blog + Knowledge Base in Phase 2)
- Mobile-first (70%+ mobile), PWA only (no native app)

### Color Palette
- ink black #1a1a1a, vermillion red #c23616, gold #d4a843, paper white #f5f0e8

### Ritual Flow (4 steps)
1. **選擇小人類型** — 6 種泛型（免費）/ 輸入具體名字（付費 $2.99）
2. **打小人** — 互動點擊動畫（30-60秒）
3. **燒掉** — 燃燒動畫 + 煙霧效果
4. **結果揭示** — 基本結果（免費）/ 強化封印 + 證書（付費 $4.99）

**設計原則**：Invocation/Sealing 做過場動畫非獨立步驟。總時間 1-2 分鐘。故意放慢節奏營造儀式感。

### 小人分類

**中文版（6 種）**：是非小人、職場小人、感情小人、財運小人、官非小人、自定義
**英文版（6 種）**：The Backstabber、The Toxic Boss、The Ex、The Energy Vampire、The Bully、Custom

兩套完全不同的文案，不是直接翻譯。視覺符號通用。

### 付費模式

**免費版**：選泛型 → 打 → 燒 → 基本結果（完整體驗）
**付費 A — 打人名 $2.99**：輸入具體名字 + 名字燃燒動畫 + 針對性結果
**付費 B — 封印詛咒 $4.99**：強化封印動畫 + 數位證書 + 強化版結果
**付費 C — 全套 $4.99**（組合價）：A + B 全部

**UX 原則**：付費點在儀式完成後（沉沒成本）。免費是「完整」，付費是「加強」。用儀式化語言（「封印」「奉獻」）。不需帳號，Stripe Session ID + localStorage。

### 用戶三重門檻
1. **「這不是玩笑嗎？」** → 暗色調、燭光、低頻鼓聲、毛筆字體。每個細節傳達「這是認真的」
2. **「值得付錢嗎？」** → 免費版足夠好到讓人驚訝。$2.99 是衝動消費。Apple Pay / Google Pay 一鍵付款
3. **「跟別人說不出口」** → 分享卡片：「I just experienced an ancient Chinese ritual」。分享「酷」不分享「羞恥」

## 三語策略

### URL 結構
```
beatpetty.com/           → 自動偵測語言，redirect
beatpetty.com/en/        → 英文（默認全球入口）
beatpetty.com/zh-TW/     → 繁體中文
beatpetty.com/zh-Hans/   → 簡體中文
```

### 技術：Next.js App Router + next-intl，[locale] 動態路由，localePrefix: 'always'
### 三語差異化：英文加教學旁白，繁體省略教學直接儀式，簡體白話平衡

## Tech Stack
- Next.js (App Router, SSR/SSG) + Tailwind CSS
- Canvas 2D + CSS animation (not WebGL, not Lottie)
- next-intl for i18n
- Vercel (free tier) + Stripe Checkout (no Subscription)
- Gemini API for graphic/video generation
- PWA (@serwist/next) + Google Analytics 4 + Search Console

### 技術風險
- 低端 Android Canvas 卡頓 → 降級 CSS-only
- iOS Safari 音頻需用戶互動 → 「點擊進入儀式」作為 audio context 觸發點
- Vercel free tier 100GB → 圖片外部託管或升級

## 動畫與音效規格

| 步驟 | 視覺 | 技術 | 音效 |
|------|------|------|------|
| 過場：Invocation | 蠟燭點燃，光線搖曳 | CSS animation + blur | 低頻環境 drone |
| Step 1 選擇 | 紙人剪影浮現 | CSS hover/active | 輕微紙張聲 |
| Step 2 打擊 | 粒子火花 + 手機震動 | Canvas 2D 粒子 | 木魚/鞋敲聲 |
| Step 3 燃燒 | 火焰粒子 + 紙人漸消 | Canvas 2D 粒子 | 火焰 + 燃燒聲 |
| 過場：Sealing | 蓋印 + 符文閃爍 | CSS keyframes | 銅鑼/風聲 |

音效三層：環境音（持續）+ 動作音（觸發）+ 轉場音。來源：freesound.org、pixabay。粒子上限 80。偵測 prefers-reduced-motion 降級。

## 付費文案 UX

**免費版結果**：「小人勢力已被削弱...但尚未完全消除。」
**付費觸發**：「小人已被打擊，但尚未封印。完成封印儀式可確保效果持續。」
**按鈕文案**：❌「Upgrade」「Pay to unlock」→ ✓「Complete the Sealing Ritual」「Name Your Enemy — $2.99」

**Stripe 流程**：sessionId(UUID) → Checkout Session → success_url → /api/verify-payment → localStorage 標記 → Webhook 記錄

## SEO (Phase 1)

| 頁面 | 核心關鍵字 |
|------|----------|
| /en/ | ancient Chinese curse, Chinese curse ritual, beat petty person |
| /en/what-is | what is beating petty person, Chinese folk curse |
| /en/how-it-works | how to curse someone, online curse ritual |
| /en/history | petty person curse history, 驚蟄 curse tradition |
| /zh-TW/ | 打小人 |
| /zh-TW/打小人是什麼 | 打小人是什麼 |

## Budget
- **Startup**: ~HKD $76-152 (Cloudflare Registrar domain only)
- **Monthly**: ~HKD $6-13 | Vercel free | Stripe per-transaction | Zero financial risk

## Domain
- **Primary**: beatpetty.com（短、有力、全球通用）
- 短 domain 在 TikTok/社交分享「三秒法則」下更容易記住

## Allen 開工前 Checklist
- [ ] 註冊 Cloudflare → 購買 beatpetty.com (10 min)
- [ ] 註冊 Stripe HK → Test API Keys (20 min)
- [ ] 註冊 Vercel (GitHub 登入) (10 min)
- [ ] Google Search Console + GA4 (20 min)
- [ ] 把所有 Keys 提供給 Claude (5 min)

Stripe Keys: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`

## 5-Day MVP Plan

| Day | 工作 | 產出 |
|-----|------|------|
| **1** | Next.js + next-intl 3語 + Tailwind 深色主題 + 部署 + Domain | 3 語骨架 |
| **2** | Landing Page 3語 + 燭光動畫 + 響應式 + SEO meta | 完整 Landing |
| **3** | 儀式核心（4步流程 + Canvas 動畫 + 音效）3語 | 完整 Ritual |
| **4** | Stripe Checkout + Result Page + Pricing Page | 可收費 |
| **5** | 打磨 + PWA + 全流程測試 + Search Console + 上線 | **上線** |

## Status
- Project initialized: 2026-04-03
- Planning completed: 2026-04-06
- Phase: **Ready to build MVP (5 days)**
- Owner: Allen (business, content, tool setup) | Claude (design, code, SEO, tech)

### 重要設計原則
- 免費版 = 完整體驗，付費 = 「加強」不是「解鎖」
- 付費牆在儀式結束後，不在中間
- 匿名制，不收集個資
- 英文版優先開發
- 所有資源投入儀式體驗的 2-3 分鐘
- 分享用語「酷」不「羞恥」
- 驚蟄不重要。好奇心 + 寧可信其有 + 發洩 + 中國文化才是核心
