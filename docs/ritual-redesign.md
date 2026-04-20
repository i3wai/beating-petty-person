# 儀式流程重新設計 — 決策 + 實作計畫

> **Status: ALL PHASES COMPLETE + UI REFINEMENTS (2026-04-19)**
> Created: 2026-04-18 | Decided: 2026-04-18 | Last updated: 2026-04-19
> 傳統流程參考: `docs/ritual-process-hk.md`
> $2.99 Reading 系統設計（已實作）: `docs/ritual-name-redesign.md`

---

## 1. 問題診斷

### 現有流程 vs 傳統八部曲

| # | 傳統步驟 | 產品現有 | 狀態 |
|---|---------|---------|------|
| 1 | 請神 | `InvocationTransition` — 點燭動畫 3s | ✅ 已有 |
| 2 | 稟告 | `EnemySelectStep` — 選敵人+名字 | ✅ 已有 |
| 3 | 過火 | `FirePassTransition` — 被動 3s 過場動畫 | ✅ 已有 |
| 4 | 打小人 | `BeatingStep` — 點擊+粒子+怒氣值 ~30s | ✅ 已有 |
| 5 | 祭白虎/焚化 | `BurningStep` — AI 白虎背景+長按點火+9s燃燒 | ✅ AI 背景圖升級 |
| 6 | 化解 | `PurificationStep` — 點擊撒米豆 | ✅ 已有 |
| 7 | 祈福/進寶 | `BlessingStep` — 被動 3s 金光 | ✅ 已有 |
| 8 | 擲筊 | `DivinationStep` — 擲筊互動 (75/20/5%) | ✅ 已有 |
| — | 封印（非傳統） | `SealingTransition` | ✅ 已刪除 |

**結論**: **全部完成。** Phase 1-9 已完成。後續 UI 優化：BurningStep 白虎改 AI 背景圖、PaywallTransition/ResultStep 簡化、雙圖片集（JPG+PNG）。

---

## 2. 已確認決策（Allen + CC，2026-04-18）

### 核心決策：儀式拆分為「毀滅」+「收尾」

- **前半段「毀滅」（步驟 1-5）= 免費** — 請神→稟告→過火→打小人→焚化。詛咒已下，但未封印。「效果暫時，不持久」。
- **後半段「收尾」（步驟 6-8）= $4.99** — 化解→祈福→擲筊。清除殘餘陰氣、祈求祝福、神明確認。

**為什麼焚化是天然分界點**：
1. 小人已毀，詛咒已下，但儀式未完成
2. 免費用戶得到完整的「詛咒」體驗（1-5），付費得到完整的「收尾」體驗（6-8）
3. 「暫時有效，不持久」跟傳統認知一致 — 不是假的
4. 付費觸發點在儀式情緒最高點（剛燒完紙人），比結果頁按鈕更有說服力

### 定價結構（定案）

| Tier | 價格 | 得到什麼 |
|------|------|---------|
| Free | $0 | 八部曲前半（1-5）：請神→稟告→過火→打小人→焚化。詛咒已下，但未封印 |
| $2.99 | $2.99 | 詛咒解讀（~945 種組合）+ 儀式啟示（洞察/化解/預言）+ 詛咒證書（印章：詛） |
| $4.99 | $4.99 | 八部曲後半（6-8）：化解→祈福→擲筊。完整儀式收尾 |
| $6.99 | $6.99 | $2.99 + $4.99 全部 |

### 封印處置

**刪除。** 不存在於傳統流程，虛假宣傳。焚化直接作為免費結尾。

### 轉場設計

免費用戶焚化後敘事收尾：

> 「小人已毀，但殘餘陰氣未散。完成化解祈福，方能永絕後患。」

在這裡放付費牆。$4.99 付費用戶無縫接續步驟6-8。

### 架構約束

- **付費在步驟5和步驟6之間**（儀式中段），不在結果頁
- Mobile-first（80%+ 手機用戶）
- 總時長 ~60-90 秒（免費 ~45s，付費追加 ~15-20s）
- 必須支援 reduced-motion

---

## 3. 新流程設計

### Flow Diagram

```
CURRENT:
idle → invocation → select → beating → burning → sealing → result
       請神        稟告      打小人    焚化       封印(假)

NEW:
idle → invocation → select → firePass → beating → burning → paywall → purification → blessing → divination → result
       請神        稟告      過火       打小人    焚化      付費牆    化解            祈福       擲筊        結果
                            ←── 免費 (1-5) ──→                          ←── $4.99 (6-8) ──→
```

### 完整版流程（52-62 秒）

| # | 步驟 | 互動方式 | 時長 | WOW |
|---|------|---------|------|-----|
| 1 | 請神 | 被動觀看，點燭動畫 | 6s | ★ |
| 2 | 稟告 | 選敵人 + 輸入名字 | 手動 | ★ |
| 3 | 過火 | **被動**：紙人（PNG）左→右掃過 AI 火焰背景 + vermillion glow | 3s | ★★ |
| 4 | 打小人 | 點擊紙人，怒氣值，粒子效果 | 25-35s | ★★★ |
| 5 | 祭白虎/焚化 | AI 白虎背景 + 長按點火 + 燃燒（紙人飄向白虎） | 11s | ★★★★ |
| 6 | 化解 | 點擊撒米豆（MIN_TAPS=3） | 2-3s | ★★ |
| 7 | 祈福/進寶 | 金光 + 燒元寶動畫 | 3s | ★★ |
| 8 | 擲筊 | 點擊擲筊 → 筊杯旋轉落地 → 聖杯/笑杯/怒杯 | 5s | ★★★★★ |

### 情緒曲線

```
張力
 ▲
 ★★★★★                                          擲筊
 ★★★★                               祭白虎
 ★★★                    打小人
 ★★          過火                           化解  祈福
 ★   請神
 ──────────────────────────────────────────────────────▶ 時間
          ← 免費 (1-5) →              ← $4.99 (6-8) →
```

### 擲筊三種結果

| 結果 | 機率 | 視覺 | 含義 |
|------|------|------|------|
| 聖杯（一正一反） | 75% | 金色光芒爆發 | 儀式成功，詛咒已下 |
| 笑杯（兩面朝上） | 20% | 銀色閃爍 | 神明未定，結果未知 |
| 怒杯（兩面朝下） | 5% | 紅色閃爍 | 儀式受阻 |

---

## 4. 實作計畫

### Phase 1: State Machine + Infrastructure

改動文件少，但所有後續工作依賴這一步。

**Files to modify:**

| File | Change |
|------|--------|
| `src/components/ritual/RitualProvider.tsx` | 新增狀態、刪除 sealing、新增 actions、更新 PaymentTier |
| `src/components/ritual/RitualOrchestrator.tsx` | 新增 lazy-load 新組件，刪除 SealingTransition import |
| `src/lib/stripe.ts` | 更新 plan names（保持 price ID 不變） |
| `src/app/api/checkout/route.ts` | 更新 plan validation |

**新狀態機:**

```typescript
type RitualState =
  | 'idle'
  | 'invocation'      // Step 1: 請神
  | 'select'          // Step 2: 稟告
  | 'firePass'        // Step 3: 過火 (NEW)
  | 'beating'         // Step 4: 打小人
  | 'burning'         // Step 5: 焚化（祭白虎升級）
  | 'paywall'         // 付費轉場 (NEW)
  | 'purification'    // Step 6: 化解 (NEW)
  | 'blessing'        // Step 7: 祈福 (NEW)
  | 'divination'      // Step 8: 擲筊 (NEW)
  | 'result';         // 結果頁

type PaymentTier = 'free' | 'reading' | 'completion' | 'full';
```

**Actions:**

```typescript
type RitualAction =
  | { type: 'START_RITUAL' }
  | { type: 'INVOCATION_COMPLETE' }
  | { type: 'SELECT_ENEMY'; payload: EnemyData }
  | { type: 'FIRE_PASS_COMPLETE' }
  | { type: 'BEATING_COMPLETE' }
  | { type: 'BURNING_COMPLETE' }
  | { type: 'PAYMENT_COMPLETED'; payload: { tier: PaymentTier } }
  | { type: 'PURIFICATION_COMPLETE' }
  | { type: 'BLESSING_COMPLETE' }
  | { type: 'DIVINATION_COMPLETE'; payload: { result: 'saint' | 'laugh' | 'anger' } }
  | { type: 'SKIP_PAYMENT' }
  | { type: 'RESET' };
```

**Reducer 轉場:**

```
idle → START_RITUAL → invocation
invocation → INVOCATION_COMPLETE → select
select → SELECT_ENEMY → firePass
firePass → FIRE_PASS_COMPLETE → beating
beating → BEATING_COMPLETE → burning
burning → BURNING_COMPLETE → paywall
paywall → PAYMENT_COMPLETED('completion'|'full') → purification
paywall → SKIP_PAYMENT → result
purification → PURIFICATION_COMPLETE → blessing
blessing → BLESSING_COMPLETE → divination
divination → DIVINATION_COMPLETE → result
result → RESET → idle
```

---

### Phase 2: New Step Components（4 個新組件）✅ COMPLETE

按順序實作，每個獨立可測試。

#### 2a. FirePassTransition（過火）— Step 3 ✅

> **Allen decision (2026-04-19)**: 從互動步驟改為被動 3s 過場動畫。互動步驟已足夠（選小人+打小人+燒紙人）。

**互動**: 被動觀看（3 phases: enter 0-800ms / pass 800-2200ms / glow 2200-3000ms）
**視覺**: 紙人（PNG）左→右掃過 AI 火焰背景 + vermillion glow + 完成時金色光芒 + 敵人名字
**技術**: AI 背景圖 + CSS animation
**音效**: `transition-invocation`（已有）
**reduced-motion**: 返回 null，200ms 後自動完成
**File**: `src/components/ritual/FirePassTransition.tsx`

#### 2b. PurificationStep（化解）— Step 6 ✅

**互動**: 點擊中央區域撒米豆（MIN_TAPS_TO_COMPLETE=3, AUTO_COMPLETE_MS=3000）
**視覺**: CSS 粒子（米白/米黃/豆棕）+ 場景從冷灰→暖金 + 完成時明亮化
**技術**: CSS animation（非 Canvas）
**音效**: `action-scatter`（白噪音 + highpass 200ms）
**haptic**: 短震動 30ms
**reduced-motion**: 自動播放撒米動畫
**File**: `src/components/ritual/steps/PurificationStep.tsx`

#### 2c. BlessingStep（祈福/進寶）— Step 7 ✅

**互動**: 被動觀看，3s 自動完成
**視覺**: 金色 radial glow 擴散 + 4 個元寶 CSS 形狀飄落 + 完成時金色脈衝
**技術**: CSS animation
**音效**: `transition-blessing`（sine 300→600Hz 2s）
**reduced-motion**: 200ms 後跳過
**File**: `src/components/ritual/steps/BlessingStep.tsx`

#### 2d. DivinationStep（擲筊）— Step 8 ★ 最重要 ✅

**互動**: 點擊「擲筊」→ 筊杯旋轉落地 → 揭示結果
**時長**: ~5s（spinning 2s + landed 1s + result 2s）
**視覺**: 兩片月牙形筊杯 CSS → 3D CSS transform 旋轉拋出 → 彈跳落地 → 結果爆發效果
**結果**: 聖杯 75%（金色爆發）/ 笑杯 20%（銀色閃爍）/ 怒杯 5%（紅色閃爍）
**技術**: CSS 3D transforms + keyframes
**音效**: `action-divination`（bandpass 800Hz noise burst 150ms）
**haptic**: 結果揭曉強震 100ms
**reduced-motion**: spinning 500ms, landed 100ms
**File**: `src/components/ritual/steps/DivinationStep.tsx`

```typescript
function rollDivination(): 'saint' | 'laugh' | 'anger' {
  const r = Math.random();
  if (r < 0.75) return 'saint';
  if (r < 0.95) return 'laugh';
  return 'anger';
}
```

---

### Phase 3: PaywallTransition（付費轉場）✅ COMPLETE — simplified 2026-04-19

決定轉換率的核心。

**流程（簡化版 2026-04-19）**:
1. 焚化結束 → 畫面暗下
2. 文字浮現：「小人已毀，但殘餘陰氣未散...」
3. 單一按鈕：「View Results」（免費跳過 → result）
4. 定價只在 /pricing 頁和 ResultStep 出現

**變更原因**: 多頁面重複定價讓用戶困惑。PaywallTransition 簡化為純過場。

**File**: `src/components/ritual/PaywallTransition.tsx`
**注意**: 僅作為過場。定價在 /pricing 和 ResultStep。

---

### Phase 4: Upgrade Existing Components

| Component | Change | File |
|-----------|--------|------|
| BurningStep +白虎 | AI-generated 白虎背景圖（取代 CSS tiger），紙人向上飄向白虎（translateY）。點火按鈕即時顯示 | `steps/BurningStep.tsx` ✅ |
| InvocationTransition | 時長 3s→6s，增加儀式感。新增 PNG 預載入 | `InvocationTransition.tsx` ✅ |
| ResultStep | 免費用戶：暫時有效結果+單一「查看結果」按鈕（$2.99 解讀）。移除 3 個定價按鈕 | `steps/ResultStep.tsx` ✅ |

---

### Phase 5: Delete Old Code ✅ COMPLETE (done in Phase 1)

SealingTransition.tsx 和所有 sealing CSS 在 Phase 1 實作時一併刪除。

| Target | Action | Status |
|--------|--------|--------|
| `src/components/ritual/SealingTransition.tsx` | DELETE | ✅ Done |
| globals.css `.sealing-*` keyframes | DELETE | ✅ Done |
| globals.css sealing reduced-motion rules | DELETE | ✅ Done |

**Dead code remaining**: ~~`transition-sealing` in AudioManager.ts + useAudio.ts~~ ✅ Cleaned in Phase 4

---

### Phase 6: i18n Updates ✅ COMPLETE

3 個語言文件：`messages/en.json`, `messages/zh-TW.json`, `messages/zh-Hans.json`

**新增 keys**（`ritual` namespace）:
- 過火: `step3Title`, `step3Subtitle`, `step3Instruction`
- 化解: `step6Title`, `step6Subtitle`, `step6Instruction`
- 祈福: `step7Title`, `step7Subtitle`
- 擲筊: `step8Title`, `step8Subtitle`, `step8Button`, `divination.saint/laugh/anger`
- 付費牆: `paywall.title/subtitle/freeButton/completeButton/readingButton/fullButton`
- 免費結果: `resultFreeTemporary`

**修改 keys**: `resultNameButton`, `resultSealButton`, `resultFullButton` 更新文案
**移除 keys**: 所有 `sealing` 相關

---

### Phase 7: Audio Engine ✅ COMPLETE

**File**: `src/components/audio/AudioManager.ts`

新增 3 個音效：

| Sound ID | Synthesis | Duration |
|----------|-----------|----------|
| `action-scatter` | White noise + highpass 3000Hz + short decay | 200ms |
| `transition-blessing` | Sine sweep 300→600Hz + gain swell | 2s |
| `action-divination` | Noise burst + bandpass 800Hz (wood click) | 150ms |

---

### Phase 8: CSS Additions ✅ COMPLETE

**File**: `src/app/globals.css`

新增 keyframes: `fire-pass-glow`, `rice-scatter`, `gold-ingot-fall`, `poe-spin`, `poe-land`, `divination-saint-burst`, `divination-laugh-flash`, `divination-anger-flash`

新增 component classes: `.fire-pass-*`, `.purification-*`, `.blessing-*`, `.divination-*`, `.paywall-*`

新增 reduced-motion rules for all new components.

---

### Phase 9: Architecture Doc Update

**File**: `docs/ARCHITECTURE.md`

更新: state machine diagram, ritual flow timing, directory structure, audio table, i18n namespace, CSS architecture, Stripe plan config.

---

## 5. Execution Order

嚴格順序。每個 phase 完成後 build 驗證。

```
Phase 1: State Machine + Infrastructure     ✅ COMPLETE
  ↓
Phase 2a: FirePassTransition (被動 3s)      ✅ COMPLETE
  ↓
Phase 2b: PurificationStep                  ✅ COMPLETE
  ↓
Phase 2c: BlessingStep                      ✅ COMPLETE
  ↓
Phase 2d: DivinationStep                    ✅ COMPLETE
  ↓
Phase 3: PaywallTransition + stagger        ✅ COMPLETE
  ↓
Phase 4a: BurningStep upgrade               ✅ COMPLETE
  ↓
Phase 4b: InvocationTransition adjust       ✅ COMPLETE
  ↓
Phase 4c: ResultStep restructure            ✅ COMPLETE
  ↓
Phase 5: Delete SealingTransition           ✅ COMPLETE (done in Phase 1)
  ↓
Phase 6-8: i18n + Audio + CSS               ✅ COMPLETE
  ↓
Phase 9: Architecture doc update            ✅ COMPLETE
  ↓
Build test + deploy
```

---

## 6. Risk + Notes

### Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| 狀態機改動破壞現有流程 | 高 | Phase 1 完成後先 deploy 確認舊流程仍可工作 |
| 擲筊 3D animation 低端機卡頓 | 中 | CSS transform 為主，不用 Canvas；20fps fallback |
| Paywall 文案不夠吸引 | 中 | Allen review 文案，A/B test 準備 |
| Stripe plan rename 影響現有付款 | 高 | 保持 price ID 不變，只改顯示名稱 |
| 總時長過長用戶流失 | 中 | 免費段 ~45s 可接受；追蹤 GA4 drop-off |

### GA4 Events (新增)

```typescript
fire_pass_complete      // 過火完成
paywall_shown           // 付費牆顯示
paywall_skip            // 免費用戶跳過
paywall_checkout        // 點擊付費
purification_complete   // 化解完成
blessing_complete       // 祈福完成
divination_result       // 擲筊結果 (saint/laugh/anger)
```

### Stripe Products

**不需要新建 Product。** 保持現有 3 個 Price ID，只更新 `stripe.ts` 顯示名稱：
- `seal` → `'Complete the Ritual'`
- `full` → `'Full Ritual + Reading'`

### Estimated Scope

| Phase | Files | Complexity |
|-------|-------|------------|
| Phase 1 | 4 modified | 中 |
| Phase 2 | 4 new | 中~高 |
| Phase 3 | 1 new | 高 |
| Phase 4 | 3 modified | 中 |
| Phase 5 | 1 delete + CSS | 低 |
| Phase 6 | 3 modified (i18n) | 低~中 |
| Phase 7 | 1 modified | 低 |
| Phase 8 | 1 modified (CSS) | 中 |
| Phase 9 | 1 modified (docs) | 低 |
