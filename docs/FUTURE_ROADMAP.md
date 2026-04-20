# Beating the Petty Person — Future Roadmap & Reference

> MVP 開發階段不需要的內容，但為未來 Phase 2/3 保留。

---

## 用戶三重門檻

1. **「這不是玩笑嗎？」** → 暗色調、燭光、低頻鼓聲、毛筆字體。每個細節傳達「這是認真的」
2. **「值得付錢嗎？」** → 免費版足夠好到讓人驚訝。$2.99 是衝動消費。Stripe 信任標章 + 退款保證。✅ 付費產品已升級（Steps 6-8 cinematic、curse reading + guidance + cert、AI result images）
3. **「跟別人說不出口」** → 分享卡片：「I just experienced an ancient Chinese ritual」。分享「酷」不分享「羞恥」。→ Phase 2: Viral Share Engine

---

## Budget

- **Startup**: ~HKD $76-152 (Cloudflare Registrar domain only)
- **Monthly**: ~HKD $6-13 | Vercel free | Stripe per-transaction | Zero financial risk

---

## SEO (Phase 1)

| 頁面 | 核心關鍵字 |
|------|----------|
| /en/ | BeatPetty brand, free online curse ritual (transactional intent — NOT informational keywords) |
| /en/blog/what-is-da-siu-yan | what is beating petty person, Chinese folk curse |
| /en/blog/how-to-curse-someone | how to curse someone, online curse ritual |
| /en/blog/history-of-villain-hitting | petty person curse history, 驚蟄 curse tradition |
| /zh-TW/ | BeatPetty brand, 線上打小人 (transactional intent — NOT 打小人攻略/驚蟄/鵝頸橋) |

---

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

---

## 回訪策略：7 天回鉤

一次性產品在注意力經濟裡是逆風。需要一個零成本的回訪機制。

### 機制
1. 付費用戶完成儀式後，結果頁顯示：「詛咒效果將在 7 天後開始減弱」
2. 可選輸入 email（不強制，不建帳號）→ 7 天後收到一封郵件
3. 郵件內容：「詛咒狀態：仍在生效 / 需要強化」+ 一個「再打一個小人」$2.99 按鈕
4. 回到網站看結果頁面 → 順便看到新的付費提示

### 技術實現
- Email input + Resend API（或 Vercel 內置 email）
- Cron job 7 天後觸發
- 郵件模板：暗黑美學，儀式語言，不是商業郵件
- 不需要用戶帳號——用 sessionId + email 綁定
- MVP 實現成本：半天

### 免費用戶的回鉤
- 結果頁顯示：「7 天後回來查看完整影響」
- 用 localStorage 記錄日期，7 天後回訪時解鎖一個「後續發展」動畫
- 零成本，純前端實現

---

## Phase 2 SEO — Blog/Knowledge Base 攻勢

### 英文高搜索量長尾詞（每月全球搜索量 10K-80K）

| 關鍵字群 | 預估月搜索量 | 競爭 | 我們機會 |
|---------|-------------|------|---------|
| "how to curse someone" | 10K-50K | 中 | 高 |
| "revenge spell" | 20K-80K | 中高 | 中 |
| "voodoo doll online" | 5K-20K | 中 | 高 |
| "hex someone" | 10K-30K | 中 | 高 |
| "Chinese ritual curse" | 1K-3K | 極低 | 極高 |
| "bad luck curse" | 5K-15K | 低 | 高 |

SEO 不用 "petty person" 做主關鍵字（月搜索 <500），改用以上高流量詞。Domain 品牌用 beatpetty.com，SEO 內容圍繞高搜索量詞。所有頁面標題和內容直接使用「curse」「ritual」字眼，對齊用戶搜索意圖。

### 中文 Blog 獨立 SEO 策略

> 完整策略文件：`docs/blog-seo-master.md`

中文 blog 是獨立內容體系，不是英文 blog 的翻譯。3 個集群：

| Cluster | 名稱 | 篇數 | 核心關鍵字 |
|---------|------|------|-----------|
| A | 打小人核心 | 5 | 打小人, 驚蟄打小人, 打小人咒語, 台灣打小人 |
| B | 命理與改運 | 4 | 去霉運, 犯太歲, 鬼月禁忌 |
| C | 詛咒文化與比較 | 2 | 詛咒術, 降頭, 打小人歷史 |

**第一篇**：驚蟄打小人攻略（低 KD、高意圖、品牌最強連結）

### Keyword Cannibalization 防範
- 每個頁面攻一組核心詞，嚴格不重疊
- 每頁 `<title>` 和 `<h1>` 嚴格區分
- Blog 頁各攻一個長尾詞群
- **Landing page = transactional/brand intent, NOT informational**
  - EN: "BeatPetty — Free Online Curse Ritual" (brand + action)
  - ZH: "BeatPetty — 線上打小人 | 免費詛咒儀式" (brand + action)
  - Avoid: "What is...", "How to curse someone", "打小人是什麼", "驚蟄", "鵝頸橋"
- **Blog posts = informational intent** — explain, teach, history
- **Landing page WhatIs section = teaser with link to blog** — don't explain, just hook + redirect
- 2026-04-15 fix deployed: H1/meta/WhatIs updated across EN/ZH-TW/ZH-Hans

---

## Phase 2 — Blog + Knowledge Base + 進階功能
- Blog 系統 (MDX)
- Knowledge Base（6-10 頁 × 3 語言）— SEO 主力流量引擎
- SEO 高流量長尾詞內容攻勢
- 更多小人類型
- Email 通知（7 天後「結果追蹤」）
- 用戶見證系統
- 更精緻的音效設計
- TikTok/X 內容製作

## Phase 3 — 擴展
- PWA 推送通知（需 service worker，@serwist/next 待 Turbopack 支援或遷移方案）
- 月費會員（如果延伸到每日運程/小人指數）
- 驚蟄限定版儀式
- 原生 App（當月收入 > HKD $30K）
- 更多語言（日文、韓文）

---

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

---

## 用戶心理動機光譜
| 動機 | 佔比 | 代表性用戶 | 觸發場景 |
|------|------|-----------|---------|
| 情緒宣洩 | 35% | 職場受壓者、失戀者 | 被老闆罵、被背叛 |
| 好奇嘗鮮 | 25% | Z世代、文化探索者 | 看到社群分享 |
| 療癒儀式 | 20% | 焦慮型、靈性追求者 | 生活失控感 |
| 控制感重建 | 12% | 受害者心態者 | 遭遇不公 |
| 娛樂社交 | 8% | 派對型用戶 | 朋友分享 |

---

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

---

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
