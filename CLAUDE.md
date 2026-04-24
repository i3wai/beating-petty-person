# Beating the Petty Person 打小人

Digital 打小人 website — one-person company. Global market, Chinese culture as hook.

> **每個新 session 第一件事：讀 `process.md`，掌握當前任務進度。然後讀 `docs/ARCHITECTURE.md`，不要全掃描 codebase。**
> **寫或改 blog 內容時，先讀 `docs/BLOG_SEO_STANDARD.md`（格式標準）和 `docs/blog-seo-master.md`（策略與關鍵字），按標準和計劃執行。**
> **任何涉及儀式流程（ritual steps、打小人流程、儀式互動設計）的任務，先讀 `docs/ritual-process-hk.md`，以香港正宗八部曲為準。**
> **每個 session 結束前或中斷時，更新 `process.md` 記錄進度和待辦事項。**

## Business Model
- One-time payment, NO subscription
- Free basic ritual + paid enhancements
- USD $2.99 (詛咒解讀) / USD $4.99 (完整儀式) / USD $6.99 (全套)
- 不靠回頭率，靠全球新用戶持續增長

## Core Strategy: 「寧可信其有」
- Position as **curse ritual**, NOT game or therapy — 暗黑 atmosphere
- Hook: "萬一有用呢？" — suggest supernatural possibility without claiming results
- 不回避「詛咒」——用戶搜 "curse" 來的，就給他們 curse
- 分享用語「酷」不「羞恥」——"I just experienced an ancient Chinese ritual"

## Product Design

### Ritual Flow (8 steps — traditional 八部曲)

**免費段（步驟 1-5「毀滅」）**:
1. **請神** — 點燭動畫
2. **稟告** — 選敵人+名字
3. **過火** — 被動過場
4. **打小人** — 互動點擊
5. **焚化** — 長按點火+燃燒

**付費段（步驟 6-8「收尾」= $4.99）**:
6. **化解** — 拖動撒米豆（自動 ~10s）
7. **祈福** — 金光動畫 + 按住符咒
8. **擲筊** — 上滑/點擊擲筊（3D 翻轉 + 聖杯保證）

**付費牆**: 步驟 5→6 之間。免費用戶看到「詛咒暫時有效」後結束。

詳細 timing/tech/音效/定價見 `docs/ARCHITECTURE.md`

### 小人分類

**EN**: The Backstabber, The Toxic Boss, The Ex, The Energy Vampire, The Bully, Custom
**ZH**: 是非小人, 職場小人, 感情小人, 財運小人, 官非小人, 自定義

兩套完全不同的文案，不是直接翻譯。

### 按鈕文案
- ❌「Upgrade」「Pay to unlock」
- ✓「Complete the Ritual」「Reveal the Curse Reading — $2.99」

**UX 原則**：免費 = 完整毀滅體驗。付費牆在焚化後（情緒最高點）。不需帳號，Stripe Session ID + localStorage。
**信任原則**：不造假數據（無假計數器/假評價），用真實文化遺產代替。明確隱私政策 + 全額退款保證。Stripe 信任標章。

## Tech Stack & Details
→ 見 `docs/ARCHITECTURE.md`（完整目錄結構、狀態機、音頻/Canvas 架構、CSS、顏色、技術風險、定價）

## Current State

- Phase: **Soft Launch — Stripe live, share system live, accepting payments**
- Owner: Allen (business, content, tool setup) | Claude (design, code, SEO, tech)
- Deploy: `npx vercel --prod --yes`

### Payment Flow (4 Paths)

| Path | Flow | Result |
|------|------|--------|
| **Free** | Steps 1-5 → Paywall → "View Results" → `/result` | Blurred reading + 3 pricing buttons |
| **$2.99** | `/result` click $2.99 → Stripe → `/result` | Full reading + guidance + cert (7-day) |
| **$4.99** | `/result` click $4.99 → Stripe → `/result` → "Continue" → `/ritual?continue=true` → Steps 6-8 → `/completion` | Divination only, no cert |
| **$6.99** | Same as $4.99 but reading held back until `/completion` | Divination + reading + guidance + permanent cert |

**Certificate**: $2.99 = cert + 7-day | $4.99 = no cert | $6.99 = cert + permanent (no expiry)

**localStorage keys**: `beatpetty_enemy`, `beatpetty_seed`, `beatpetty_reading`, `beatpetty_guidance`, `beatpetty_paid`, `beatpetty_divination`, `beatpetty_divination_throws`

**State machine**: 10 states, 10 actions (idle → invocation → select → firePass → beating → burning → paywall → purification → blessing → divination). No `result` state — results render on separate pages (`/result`, `/completion`). No `DIVINATION_COMPLETE` — DivinationStep navigates to `/completion` directly.

## Post-Launch → Phase 2

Priority order:
1. ~~**Viral Share Engine**~~ ✅ Done — Share cards with native image sharing across all platforms
2. **Email 7-day hook** — Optional email input, "curse status" reminder after 7 days
3. **More blog content** — Continue SEO content

→ 見 `docs/FUTURE_ROADMAP.md`
