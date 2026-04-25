# Beating the Petty Person — Future Roadmap & Reference

> Phase 1 (MVP) complete. This doc covers Phase 2/3 growth strategy.
> Last updated: 2026-04-25

---

## 用戶三重門檻

1. **「這不是玩笑嗎？」** → 暗色調、燭光、低頻鼓聲、毛筆字體。每個細節傳達「這是認真的」 ✅
2. **「值得付錢嗎？」** → 免費版足夠好到讓人驚訝。Stripe 信任標章 + 退款保證。 ✅
3. **「跟別人說不出口」** → 分享卡片：「I just experienced an ancient Chinese ritual」。 ✅

---

## Budget

- **Startup**: ~HKD $76-152 (domain only)
- **Monthly**: ~HKD $6-13 | Vercel free | Stripe per-transaction

---

## Phase 2 — Growth (Current)

Priority order:
1. **Email 7-day hook** — Optional email input, "curse status" reminder after 7 days
2. **More blog content** — 30+ EN articles by month 6, 50+ by month 12
3. **TikTok/X organic content** — $0 budget, CapCat free editing

### Email 7-day Hook

- 付費用戶完成儀式後，結果頁顯示：「詛咒效果將在 7 天後開始減弱」
- 可選 email 輸入 → Resend API → 7 天後觸發郵件
- 郵件：「詛咒狀態：仍在生效 / 需要強化」+ 「再打一個小人」$2.99
- 免費用戶：localStorage 記錄日期，7 天後回訪解鎖「後續發展」動畫
- MVP 實現成本：半天

### Blog Phase 2

**EN new articles (Month 2-3):**

| Slug | Target Keyword | Vol |
|------|---------------|-----|
| signs-you-are-cursed | signs of a curse | 2,400 |
| what-is-evil-eye | what is the evil eye | 8,100 |
| psychology-of-revenge | psychology of revenge | ~500 |

**EN new articles (Month 4-6):**

| Slug | Target Keyword |
|------|---------------|
| famous-curses-in-history | famous curses |
| chinese-folk-religion-traditions | Chinese folk religion |

**ZH**: Depends on GSC data. Candidates: 驚蟄 seasonal landing page, expand 太歲/霉運 topics.

### TikTok Strategy

1. **Discovery 系列** — 15-30s 紀錄片風格，香港詛咒儀式鉤子
2. **POV 體驗系列** — 錄屏展示網站體驗
3. **UGC 見證系列** — 用戶自行拍攝，標記 @beatpetty

發布節奏：初期每週 3-4 支。預算：$0。

### X (Twitter)

- Thread 文化科普 + 蹭熱點
- 每週 1 個長 thread，每天 2-3 推文
- 最佳時間：HKT 晚上 8-11 點

---

## Phase 3 — Expansion

- PWA 推送通知（需 service worker）
- 月費會員（每日運程/小人指數）
- 驚蟄限定版儀式
- 原生 App（當月收入 > HKD $30K）
- 更多語言（日文、韓文）

---

## 收入預測

| 情境 | 月流量 | 轉換率 | 月收入 |
|------|--------|--------|--------|
| 保守（第 1 年） | 5,000 | 3% | ~HKD $4,100 |
| 中等（第 2 年） | 20,000 | 4% | ~HKD $21,800 |
| 樂觀（viral） | 100,000+ | 5% | ~HKD $130,000+ |

---

## 文化風險與應對

### 核心策略：被指控文化挪用時，反擊「我在保存正在消亡的文化」

**回應模板**：
> 「這個儀式正在消亡。鵝頸橋下的打小人婆婆每年都在減少。我們做的事情，是把一個快要消失的廣東民俗帶給全世界。」

**具體準備**：
1. Blog 預埋「打小人的文化遺產價值」
2. Landing page 底部：「Based on authentic Cantonese folk traditions.」
3. 被圍攻時：發鵝頸橋真實照片，不刪帖、不道歉、不辯論
4. 長期：考慮部分收入捐給香港民俗文化保育組織

---

## 用戶心理動機

| 動機 | 佔比 | 觸發場景 |
|------|------|---------|
| 情緒宣洩 | 35% | 被老闆罵、被背叛 |
| 好奇嘗鮮 | 25% | 看到社群分享 |
| 療癒儀式 | 20% | 生活失控感 |
| 控制感重建 | 12% | 遭遇不公 |
| 娛樂社交 | 8% | 朋友分享 |
