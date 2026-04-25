# Beating the Petty Person 打小人

Digital 打小人 website — one-person company. Global market, Chinese culture as hook.

> **每個新 session 第一件事：讀 `process.md`，掌握當前任務進度。然後讀 `docs/ARCHITECTURE.md`，不要全掃描 codebase。**
> **寫或改 blog 內容時，先讀 `docs/BLOG_SEO_STANDARD.md`（格式標準）和 `docs/blog-seo-master.md`（策略與關鍵字），按標準和計劃執行。**
> **任何涉及儀式流程的任務，先讀 `docs/ritual-process-hk.md`，以香港正宗八部曲為準。**
> **每個 session 結束前或中斷時，更新 `process.md` 記錄進度和待辦事項。**

## Business Model

- One-time payment, NO subscription
- Free basic ritual + paid enhancements
- USD $2.99 (Curse Reading) / USD $4.99 (Complete Ritual Steps 6-8) / USD $6.99 (Full Package)
- 不靠回頭率，靠全球新用戶持續增長

## Core Strategy: 「寧可信其有」

- Position as **curse ritual**, NOT game or therapy — 暗黑 atmosphere
- Hook: "萬一有用呢？" — suggest supernatural possibility without claiming results
- 不回避「詛咒」——用戶搜 "curse" 來的，就給他們 curse
- 分享用語「酷」不「羞恥」——"I just experienced an ancient Chinese ritual"

## Product Design

### Ritual Flow (8 steps — traditional 八部曲)

**免費段（步驟 1-5「毀滅」）**: 請神 → 稟告 → 過火 → 打小人 → 焚化

**付費段（步驟 6-8「收尾」= $4.99）**: 化解 → 祈福 → 擲筊

**付費牆**: 步驟 5→6 之間。免費用戶看到「詛咒暫時有效」後結束。

詳細 timing/tech/音效/定價見 `docs/ARCHITECTURE.md`

### 小人分類

**EN**: The Backstabber, The Toxic Boss, The Ex, The Energy Vampire, The Bully, Custom
**ZH**: 是非小人, 職場小人, 感情小人, 財運小人, 官非小人, 自定義

兩套完全不同的文案，不是直接翻譯。

### UX 原則

- 免費 = 完整毀滅體驗。付費牆在焚化後（情緒最高點）
- 不需帳號，Stripe Session ID + localStorage
- 不造假數據（無假計數器/假評價），用真實文化遺產代替
- 明確隱私政策 + 全額退款保證 + Stripe 信任標章

## Current Phase

- **Soft Launch** — Stripe live, share system live, accepting payments
- Owner: Allen (business, content) | Claude (design, code, SEO, tech)
- Deploy: `npx vercel --prod --yes`

## Files to Read First

| File | Purpose |
|------|---------|
| `process.md` | Current task progress and next steps |
| `docs/ARCHITECTURE.md` | Full tech architecture (read instead of scanning codebase) |
| `docs/ritual-process-hk.md` | Traditional 8-step reference |
| `docs/BLOG_SEO_STANDARD.md` | Blog writing standards |
| `docs/blog-seo-master.md` | SEO strategy + keyword planning |
| `docs/FUTURE_ROADMAP.md` | Phase 2/3 roadmap |
