# Beating the Petty Person 打小人

Digital 打小人 website — one-person company. Global market, Chinese culture as hook.

## Business Model
- **One-time payment model** (NO monthly subscription for MVP)
- Free basic ritual + paid enhancements
- Global unified pricing: USD $2.99 (打人名) / USD $4.99 (封印詛咒) / USD $4.99 (全套)
- Revenue target: HKD $5k-10k/month (realistic steady state: HKD $2k-5k/month, 驚蟄月可能衝到 HKD $10k+)
- SEO-driven organic traffic + TikTok/X viral growth
- **Core monetization logic**: 不靠回頭率，靠全球新用戶持續增長。打小人是 one-off 體驗，像電影票 — 不需要同一個人每月回來，只需要不斷有新好奇用戶付 $2.99-4.99。但需要一個低成本回鉤機制（見「回訪策略」）。

## Core Strategy: 「寧可信其有」
- Position as **curse ritual**, NOT game or therapy — 暗黑 atmosphere, not playful, not healing
- Hook: "萬一呢？" — suggest supernatural possibility without claiming guaranteed results
- Dark candlelit aesthetic, ritual chanting sounds, solemn pacing
- Never claim "guaranteed effective" — let users convince themselves
- **全球市場的包裝**：這不是「遊戲」或「療癒工具」，而是「你不知道存在的真實古老中國詛咒儀式」。類比西方人對 Voodoo doll、黑魔術的迷戀 — 神秘、異國、有一點危險感。
- **不回避「詛咒」這個詞**：用戶搜 "curse" 來的，就給他們 curse。不用「釋放負能量」「保護自己」這類稀釋包裝。直接說：這是一個 300 年歷史的中國詛咒儀式。

## Product Design

### Pages
- 5 core pages: Landing, Game/Ritual, Pricing, Result, (Blog + Knowledge Base in Phase 2)
- Mobile-first (70%+ mobile users globally)
- PWA only (no native app for MVP). Save 30% Apple/Google tax. Native app only when monthly revenue > HKD $30K.

### Color Palette
- ink black #1a1a1a, vermillion red #c23616, gold #d4a843, paper white #f5f0e8

### Ritual Flow (4 steps)
1. **選擇小人類型** — 選擇 6 種泛型（免費）/ 輸入具體名字（付費 $2.99）
2. **打小人** — 互動點擊動畫（30-60秒）
3. **燒掉** — 燃燒動畫 + 煙霧效果
4. **結果揭示** — 基本結果（免費）/ 強化封印 + 證書（付費 $4.99）

**重要設計原則**：
- Invocation（點蠟燭）和 Sealing（蓋印收尾）做成**過場動畫**，不是獨立步驟
- 核心心理循環：投入 → 投射 → 宣洩 → 釋放
- 總時間 1-2 分鐘，不拖長
- 故意放慢節奏營造儀式感（載入動畫「準備儀式空間」）
- 音效：低頻鼓聲、敲擊聲、燃燒聲（用現成免費素材，不錄製）

### 小人分類 — 按語言/文化區分

**中文版（6 種傳統分類）**：
1. 是非小人 — 搬弄是非
2. 職場小人 — 背後插刀
3. 感情小人 — 小三/爛桃花
4. 財運小人 — 擋財運
5. 官非小人 — 惹官非
6. 自定義

**英文版（6 種跨文化原型）**：
1. The Backstabber — Betrays your trust
2. The Toxic Boss — Makes work miserable
3. The Ex — Won't let go
4. The Energy Vampire — Drains your energy
5. The Bully — Intimidates and harms
6. Custom — Define your own

**設計原則**：兩套完全不同的分類文案，不是直接翻譯。視覺符號通用（剪影、紙人形象，文化中立）。

### 付費模式（混合方案）

**免費版**：選泛型小人 → 打 → 燒 → 基本結果（完整體驗，不破壞神聖感）

**付費 A —「打人名」USD $2.99**：
- 選完類型後可輸入具體名字
- 名字寫在紙上燃燒的動畫
- 針對性結果描述

**付費 B —「封印詛咒」USD $4.99**：
- 儀式完成後的強化封印動畫
- 數位儀式證書（可分享）
- 強化版結果揭示

**付費 C —「全套儀式」USD $4.99**（組合價）：
- 打人名 + 封印詛咒全部功能

**關鍵 UX 原則**：
- 付費點在儀式完成後，不是之前（用戶已完成完整體驗，沉沒成本產生）
- 免費用戶已有完整結果，付費是「加強」不是「解鎖」
- 用儀式化語言（「封印」、「奉獻」）而非商業用語（「購買」、「升級」）
- 不需要用戶帳號：用 Stripe Session ID + localStorage 追蹤付費狀態
- Stripe guest checkout，Apple Pay / Google Pay 支援

**為什麼不用 $1.99**：Stripe 手續費 $0.30 固定 + 2.9%，$1.99 被吃掉 18%。$2.99 只佔 13%，$4.99 只佔 9%。

**為什麼沒有月費制**：打小人本質上是 one-off 體驗。誰會每月訂閱打小人服務？月費制在用戶心理上違和。未來如果延伸到「每日運程/小人指數」可考慮月費，但 MVP 不做。

## 三語策略

### URL 結構
```
beatpetty.com/           → 自動偵測語言，redirect
beatpetty.com/en/        → 英文主頁（默認，全球入口）
beatpetty.com/zh-TW/     → 繁體中文
beatpetty.com/zh-Hans/   → 簡體中文
```

### 技術實現
- Next.js App Router + `next-intl`
- `[locale]` 動態路由，`localePrefix: 'always'`
- Root "/" 根據 Accept-Language 偵測，302 redirect
- 每頁自動生成 hreflang 標籤
- 不用 cookie/JS 切換語言（SEO 殺手）

### 三語差異化（不是簡單翻譯）

**英文版（通用易明版）**：
- 小人類型用心理學描述
- 儀式流程加入教學性質旁白（「In Chinese tradition...」）
- 結果用「西方玄學」語言包裝
- Landing page 有 30 秒「What is this?」解釋
- 視覺偏暗黑美學，類似 Tarot card app

**繁體中文版（傳統術語版）**：
- 小人類型用傳統分類（口舌小人、是非小人）
- 省略教學，直接進入儀式
- 結果用傳統民俗語言（「小人已送走，諸事順遂」）
- 視覺更接近真實驚蟄打小人（銅鞋、磚頭、紙人質感）

**簡體中文版（平衡版）**：
- 介於兩者之間，用語比繁體版稍白話
- 大陸用戶對打小人熟悉度不如港台

### 語言偵測策略
1. 第一次到訪 → 偵測 Accept-Language + IP（輔助）
2. 重定向到偵測語言版本
3. 用戶手動切換 → cookie 記錄（365 天）
4. 此後用 cookie 偏好，不再偵測
5. 語言切換器永遠可見（地球圖標 + 下拉選單）
6. 儀式進行中不顯示語言切換提示（不打斷沉浸感）

## Tech Stack
- Next.js (App Router, SSR/SSG for SEO)
- Tailwind CSS
- Canvas 2D + CSS animation for ritual (not WebGL, not Lottie)
- next-intl for i18n
- Vercel hosting (free tier initially)
- Stripe for payments (Checkout Session, no Subscription)
- Gemini API for graphic/video generation (user-provided)
- PWA (next-pwa or @serwist/next) — manifest.json + Service Worker
- Google Analytics 4 + Search Console

### 技術決策理由
- **Canvas 2D** 不是 WebGL：打小人動畫不需要 3D，2D 粒子效果足夠，手機效能可控
- **PWA** 不是 Native App：省 30% 平台稅，一套代碼，零額外成本
- **不建用戶系統**：一次性體驗，Stripe Session ID + localStorage 追蹤付費即可
- **MDX for content** (Phase 2 Blog/Knowledge Base，no CMS needed)
- **Cloudflare Registrar** for domain（成本價，免費 WHOIS privacy）

### 技術風險與備案
- Canvas 動畫在低端 Android 可能卡頓 → 降級為 CSS-only 方案
- iOS Safari 音頻需用戶互動才能播放 → 設計「點擊進入儀式」作為 audio context 觸發點
- Vercel free tier 100GB bandwidth/月 → 圖片外部託管（Cloudinary free tier）或升級 Pro

## SEO Strategy

### 目標：SEO 持續帶來新好奇用戶，每人付 $2.99-4.99

### Phase 1 — Landing Page 基礎 SEO

**英文關鍵字**（對齊「詛咒」定位）：

| 頁面 | 核心關鍵字 | 搜索意圖 |
|------|----------|---------|
| /en/ (首頁) | ancient Chinese curse, Chinese curse ritual, beat petty person | Brand + 詛咒體驗 |
| /en/what-is | what is beating petty person, Chinese folk curse | 資訊性 |
| /en/how-it-works | how to curse someone, online curse ritual | How-to |
| /en/history | petty person curse history, 驚蟄 curse tradition | 深度資訊 |

**中文關鍵字**：

| 頁面 | 核心關鍵字 | 搜索意圖 |
|------|----------|---------|
| /zh-TW/ (首頁) | 打小人 | Brand + 體驗 |
| /zh-TW/打小人是什麼 | 打小人是什麼 | 資訊性 |
| /zh-TW/打小人方法 | 打小人方法, 步驟 | How-to |
| /zh-TW/鵝頸橋 | 鵝頸橋打小人 | 本地/旅遊 |
| /zh-TW/打小人咒語 | 打小人咒語 | 深度興趣 |

### Phase 2 — Blog/Knowledge Base SEO 攻勢

**英文高搜索量長尾詞**（每月全球搜索量 10K-80K）：

| 關鍵字群 | 預估月搜索量 | 競爭 | 我們機會 |
|---------|-------------|------|---------|
| "how to curse someone" | 10K-50K | 中 | 高 |
| "revenge spell" | 20K-80K | 中高 | 中 |
| "voodoo doll online" | 5K-20K | 中 | 高 |
| "hex someone" | 10K-30K | 中 | 高 |
| "Chinese ritual curse" | 1K-3K | 極低 | 極高 |
| "bad luck curse" | 5K-15K | 低 | 高 |

**SEO 不用 "petty person" 做主關鍵字**（月搜索 <500），改用以上高流量詞。Domain 品牌用 beatpetty.com，SEO 內容圍繞高搜索量詞。所有頁面標題和內容直接使用「curse」「ritual」字眼，對齊用戶搜索意圖。

### Keyword Cannibalization 防範
- 每個頁面攻一組核心詞，嚴格不重疊
- /what-is 只講「是什麼」不講「怎麼做」
- /how-it-works 只講「怎麼做」不重複背景
- /history 只講歷史淵源
- 每頁 `<title>` 和 `<h1>` 嚴格區分
- Blog 頁各攻一個長尾詞群

## Growth Strategy (SEO 以外)

### TikTok（主要戰場）
**三大內容支柱**：

1. **Discovery 系列**（最高 viral 潛力）
   - 15-30 秒，快節奏紀錄片風格
   - 鉤子：「在香港的橋底下，有一種持續了 300 年的詛咒儀式」
   - 配暗黑美學視覺 + 中式恐怖風格背景音
   - 字幕必須有（85% 用戶靜音觀看）

2. **POV 體驗系列**（沉浸代入）
   - 30-60 秒，第一人稱視角
   - 錄屏展示網站體驗流程
   - 「POV: You just tried an ancient Chinese curse ritual」

3. **UGC 見證系列**（轉化導向，Phase 2）
   - 用戶自行拍攝，標記 @beatpetty
   - 分享見證可獲免費「封印詛咒」
   - 永遠不說「definitely worked」，暗示巧合

**發布節奏**：初期每週 3-4 支，測試哪種內容最有效。

### X (Twitter)
- Thread 形式文化科普：「The most unhinged Hong Kong ritual you've never heard of:」
- 截圖分享儀式關鍵畫面
- 蹭熱點：名人「被小人搞」新聞時及時發布
- 每天 2-3 則推文，每週 1 個長 thread
- 最佳發布時間：HKT 晚上 8-11 點（覆蓋亞洲晚上 + 歐美早上）

**社交媒體預算：$0**。前 3 個月純 organic。CapCut 免費剪輯。

## Budget
- **Startup**: ~HKD $76-152 (domain only, Cloudflare Registrar)
  - beatpetty.com: ~USD $9.77/年 (HKD $76)
  - 可選 beatpetty.com redirect: 再 +HKD $76/年
- **Monthly**: ~HKD $6-13 (domain 攤分)
- Vercel: Free tier (100GB bandwidth, unlimited static deploys)
- Stripe: No monthly fee, 2.9% + $0.30 per transaction
- Email（回訪策略）: Resend free tier (100 emails/day) 或 Vercel内置
- Zero financial risk, main cost is time

## 回訪策略：「封印守護」7 天回鉤

一次性產品在注意力經濟裡是逆風。需要一個零成本的回訪機制。

### 機制
1. 付費用戶完成儀式後，結果頁顯示：「你的封印將在 7 天後開始減弱」
2. 可選輸入 email（不強制，不建帳號）→ 7 天後收到一封邮件
3. 郵件內容：「你的封印狀態：仍在生效 / 需要強化」+ 一個「再打一個小人」$2.99 按鈕
4. 回到網站看結果頁面 → 順便看到新的付費提示

### 技術實現
- Email input + Resend API（或 Vercel 内置 email）
- Cron job（Vercel cron 或簡單的 setTimeout）7 天後觸發
- 郵件模板：暗黑美學，儀式語言，不是商業郵件
- 不需要用戶帳號——用 sessionId + email 綁定

### 為什麼有效
- Email 是唯一不依賴第三方演算法的分發渠道
- 付費用戶已有投入（沉沒成本），回訪意願高
- 不違反「不訂閱」原則——只是一封提醒，不是月費
- MVP 實現成本：半天

### 免費用戶的回鉤
- 結果頁顯示：「7 天後回來查看完整影響」
- 用 localStorage 記錄日期，7 天後回訪時解鎖一個「後續發展」動畫
- 零成本，純前端實現

## Allen 開工前 Checklist
- [ ] 註冊 Cloudflare → 購買 beatpetty.com (10 min)
- [ ] 註冊 Stripe HK (Individual / Sole Proprietor) → 取得 Test API Keys (20 min)
- [ ] 註冊 Vercel (用 GitHub 登入) (10 min)
- [ ] 設定 Google Search Console → 驗證域名 (10 min)
- [ ] 設定 Google Analytics 4 → 取得 Measurement ID (10 min)
- [ ] 把所有 Keys 提供給 Claude (5 min)
- 總計約 1-1.5 小時

### Stripe API Keys needed
- `STRIPE_SECRET_KEY` (sk_test_...)
- `STRIPE_PUBLISHABLE_KEY` (pk_test_...)
- `STRIPE_WEBHOOK_SECRET` (whsec_...)
- 開發用 Test Mode，上線切 Live Mode

## 5-Day MVP Development Plan

### Phase 1 (5 Days) — 核心功能

| Day | 工作 | 產出 |
|-----|------|------|
| **Day 1** | Next.js + next-intl 3語配置 + Tailwind 深色主題 + Cloudflare/Vercel 部署 + Domain 連接 | 可部署的 3 語骨架 |
| **Day 2** | Landing Page 3語 + 燭光動畫 + 響應式 + SEO meta + hreflang | 完整 Landing |
| **Day 3** | 儀式核心（4步流程 + Canvas 動畫 + 音效）3語 | 完整 Ritual flow |
| **Day 4** | Stripe Checkout（打人名 $2.99 + 封印 $4.99）+ Result Page + Pricing Page | 可收費 |
| **Day 5** | 打磨 + PWA manifest + 全流程測試 + Search Console 提交 + 上線 | **上線** |

### 3 Agent 開發團隊配置
| Agent | 角色 | 負責檔案範圍 |
|-------|------|-------------|
| A | 架構工程師 | /lib/, /app/api/, /middleware.ts, i18n 配置 |
| B | 前端工程師 | /components/, /app/[locale]/, /public/, 動畫 |
| C | SEO/品質工程師 | sitemap, structured data, meta tags, 測試, 部署 |
| GM (我) | Team Lead | 協調、品質把關、跟 Allen 溝通 |

### Phase 2 — Blog + Knowledge Base + 進階功能
- Blog 系統 (MDX)
- Knowledge Base（6-10 頁 × 3 語言）— SEO 主力流量引擎
- SEO 高流量長尾詞內容攻勢
- 更多小人類型
- Email 通知（7 天後「結果追蹤」）
- 用戶見證系統
- 更精緻的音效設計
- TikTok/X 內容製作

### Phase 3 — 擴展
- PWA 推送通知
- 月費會員（如果延伸到每日運程/小人指數）
- 驚蟄限定版儀式
- 原生 App（當月收入 > HKD $30K）
- 更多語言（日文、韓文）

## Domain
- **Primary**: beatpetty.com（短、有力、全球通用、像指令「打倒小人」）
- **Optional redirect**: beatthepetty.com 或 打小人.com（301 redirect 到主站）
- beatpetty.com 不含高搜索量 SEO 關鍵字，但 domain 不影響 SEO 排名，SEO 透過頁面內容優化
- **為什麼不用 daxiaoren.com**：這是大陸普通話拼音，香港用戶不會直覺理解（港人用粵語不是普通話）。團隊初期一致推薦此域名是個失誤。
- **為什麼不用 beatthepetty.com 作主站**：多一個 "the" 在口語傳播中容易被漏掉，導致用戶打錯 URL。TikTok/社交分享的「三秒法則」下，短 domain 更容易被記住。

## 競品參考與市場數據

### 競品分析
| 產品 | 模式 | 月流量（估算）| 我們學什麼 |
|------|------|-------------|-----------|
| Labyrinthos（塔羅）| Freemium + 課程 | 500K+ | 簡約儀式感，精美視覺 |
| Co-Star（占星）| 訂閱 $4.99/月 | 2M+ | 社交分享，個人化解讀 |
| Etsy Spell Services | $5-100/次 | N/A | 客製化，評價系統 |
| The Pattern | Freemium | 1M+ | 社群功能強 |

### 市場數據（決策參考）
- WitchTok 是 TikTok 最大靈性社群之一，數十億 hashtag views
- 神秘學服務市場（塔羅、占星、psychic services）全球約 $2B+/年
- 占星 App 市場預計 2028 年達 $4-5B（Co-Star、The Pattern 等）
- 全球 wellness 經濟約 $1.8 萬億，靈性是增長最快的子板塊
- Gen Z / Millennials 是主要驅動力，TikTok 為主要發現渠道

### 用戶心理動機光譜
| 動機 | 佔比 | 代表性用戶 | 觸發場景 |
|------|------|-----------|---------|
| 情緒宣洩 | 35% | 職場受壓者、失戀者 | 被老闆罵、被背叛 |
| 好奇嘗鮮 | 25% | Z世代、文化探索者 | 看到社群分享 |
| 療癒儀式 | 20% | 焦慮型、靈性追求者 | 生活失控感 |
| 控制感重建 | 12% | 受害者心態者 | 遭遇不公 |
| 娛樂社交 | 8% | 派對型用戶 | 朋友分享 |

### 用戶三重門檻（必須解決）
1. **「這不是玩笑嗎？」** → 解決方案：視覺質量決定可信度。暗色調、燭光效果、低頻鼓聲、毛筆字體。每個細節傳達「這是認真的」。
2. **「值得付錢嗎？」** → 解決方案：免費版已經足夠好到讓人驚訝。付費是「加強」不是「解鎖」。$2.99 是衝動消費。實現 Apple Pay / Google Pay 一鍵付款減少摩擦。
3. **「跟別人說不出口」** → 解決方案：分享卡片不說「我詛咒了某人」，而是神秘風格：「I just experienced an ancient Chinese ritual」。分享的是「酷」的東西，不是「羞恥」的東西。用 html-to-image 生成分享卡片，Web Share API 原生分享。

## 收入預測與流量模型

### 保守情境（第 1 年）
- 月流量 5,000 訪客
- 付費轉換率 3% = 150 人/月
- 平均付費 $3.50 = ~USD $525/月 = ~HKD $4,100/月

### 中等情境（第 2 年，SEO 累積後）
- 月流量 20,000 訪客
- 付費轉換率 4% = 800 人/月
- 平均付費 $3.50 = ~USD $2,800/月 = ~HKD $21,800/月

### 樂觀情境（viral 爆發 + 驚蟄）
- 單月流量 100,000+（TikTok viral + 驚蟄）
- 付費轉換率 5% = 5,000 人
- 單月收入 ~HKD $130,000+

### 達到 HKD $5,000/月需要
- ~333 個 $2.99 付費用戶（或 ~215 個 $4.99）
- 轉換率 3% → 需要 ~11,000-16,600 月活訪客
- 純靠 SEO 約需 12-18 個月，但 1-2 次 viral 可縮短到 3-6 個月

## 動畫與音效設計規格

### 各步驟動畫細節
| 步驟 | 視覺效果 | 技術 | 音效 |
|------|---------|------|------|
| 過場：Invocation | 蠟燭點燃，光線搖曳 | CSS animation + blur | 低頻環境 drone |
| Step 1 選擇 | 紙人剪影浮現，點選時微動 | CSS hover/active | 輕微紙張聲 |
| Step 2 打擊 | 紙人搖晃 + 粒子火花 + 手機震動 | Canvas 2D 粒子 | 木魚/鞋敲聲（每次點擊） |
| Step 3 燃燒 | 火焰粒子 + 煙霧上升 + 紙人漸消 | Canvas 2D 粒子 | 火焰聲 + 紙張燃燒 |
| 過場：Sealing | 蓋印動畫 + 神秘符文閃爍 | CSS keyframes | 銅鑼/風聲 |

### 音效層次設計
- **Layer 1 — 環境音**：低頻誦經/鼓聲，持續播放，可調音量
- **Layer 2 — 動作音**：打擊聲、燃燒聲，跟隨用戶操作觸發
- **Layer 3 — 轉場音**：過場時的銅鑼、風聲
- **音效來源**：免費素材庫（freesound.org、pixabay），MVP 不錄製

### 效能控制
- 粒子數量上限 80（手機）
- 使用 requestAnimationFrame
- 偵測 `prefers-reduced-motion` 降級為最小動畫
- 低端設備（hardwareConcurrency < 4）自動降級 CSS-only

## 付費文案與 UX 設計

### 免費版結果文案（暗示付費）
- 英文：「The petty person's influence has been weakened... but not fully neutralized.」
- 中文：「小人勢力已被削弱...但尚未完全消除。」

### 付費觸發文案（用儀式語言，不用商業語言）
- 「小人已被打擊，但尚未封印。完成封印儀式可確保效果持續。」
- 「古法中，打小人後需要進行封印，否則小人可能捲土重來。」
- 這裡巧妙暗示「不封印 = 可能無效」，利用損失趨避心理

### 付費按鈕文案
- ❌ 不要用：「Upgrade for $4.99」「Pay to unlock」
- ✓ 應該用：「Complete the Sealing Ritual」「Seal the Curse — $4.99」
- ✓ 應該用：「Name Your Enemy — $2.99」「指名打擊 — HKD $23」

### Stripe 無帳號付費流程
```
1. 用戶開始儀式 → 前端生成唯一 sessionId（UUID，存 localStorage）
2. 選擇付費 → 建立 Stripe Checkout Session（metadata: { sessionId, feature }）
3. 付款成功 → Stripe redirect 回 success_url（含 session_id）
4. 前端調用 /api/verify-payment → 後端驗證 Stripe session 狀態
5. 驗證通過 → localStorage 標記已購買 → 頁面解鎖功能
6. Webhook（checkout.session.completed）記錄付款狀態
```

## 文化風險與應對

### 風險矩陣
| 風險 | 嚴重度 | 應對 |
|------|--------|------|
| 文化挪用批評 | **高** | 這是最大商業風險。見下方「文化挪用公關策略」 |
| 「迷信」標籤 | 低 | 暗黑美學包裝，年輕用戶接受度高 |
| 鼓勵仇恨 | 中 | 禁止輸入完整個人資料（只需名字/暱稱），免責聲明強調娛樂性質 |

### 文化挪用公關策略（預案）

**核心策略：不要防禦，要進攻。被指控時不是說「我不是文化挪用」，而是反擊「我在保存正在消亡的文化」。**

**回應模板**：
> 「這個儀式正在消亡。鵝頸橋下的打小人婆婆每年都在減少。如果沒有人用新方式讓年輕人認識這個傳統，20 年後沒有人會記得它。我們做的事情，是把一個快要消失的廣東民俗帶給全世界。」

**具體準備**：
1. **Blog 預埋「打小人的文化遺產價值」**——SEO 長尾詞 + 公關彈藥。被攻擊時直接貼連結。
2. **Landing page 底部**：「Based on authentic Cantonese folk traditions. We work to preserve and share this cultural heritage.」（已加入品牌語言框架）
3. **如果爆了被圍攻**：不要刪帖、不要道歉、不要辯論。發一條：「香港鵝頸橋下還有幾位婆婆在做這件事。下次去香港，去看看她們。真正的文化在街頭，不在博物館。」——附一張鵝頸橋的真實照片。
4. **長期**：考慮將部分收入捐給香港民俗文化保育組織，作為持續的「文化保存」證據。

### 品牌語言框架
- 直接用「詛咒」「報復」「宣洩」——這是用戶搜尋的關鍵字，也是產品的真實定位
- 不用「釋放負能量」「保護自己」「心理療癒」——這些詞稀釋產品力，且對不上 SEO 意圖
- 免責聲明：「This is an authentic Chinese folk curse ritual, presented for cultural experience and entertainment. Results may vary.」——承認是詛咒，同時提供法律護盾
- Landing page 底部固定文字：「Based on authentic Cantonese folk traditions. We work to preserve and share this cultural heritage.」

## Status
- Project initialized: 2026-04-03
- Planning completed: 2026-04-06
- Phase: **Ready to build MVP (5 days)**
- Owner: Allen (business direction, content review, tool setup)
- Assistant: Claude (design, code, SEO, technical execution)

## How to apply
This is an active project. Allen is the business owner; Claude handles all technical execution. Use Gemini API for visual asset generation when needed.

### 重要設計原則（全員共識）
- 免費版必須是**完整體驗**，付費是「加強」不是「解鎖」
- 付費牆在儀式結束後，不在中間（破壞神聖感）
- 匿名制：不收集個資，降低法律風險和用戶摩擦
- 英文版優先開發（全球市場入口），中文版可稍後補齊
- 所有最好的資源投入儀式體驗的 2-3 分鐘，其他一切為這 2-3 分鐘服務
- 分享用語要「酷」不要「羞恥」：「I just experienced an ancient Chinese ritual」而非「我詛咒了某人」
- 驚蟄不重要：大部分港人都不知道。全球市場更不在意。好奇心 + 寧可信其有 + 發洩 + 中國文化才是核心賣點
