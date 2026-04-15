# BeatPetty Project Memory

> Project-specific lessons and decisions. Generic memories stay in ~/.claude.

## Day 3 Mistakes (2026-04-07)

### Audio
- useAudio unmount 時不能 dispose singleton AudioManager — 只提供播放方法
- Web Audio API 合成取代外部 MP3（目錼是空的）— MVP 零外部依賴
- 轉場組件 mount 時必須立即停前一個步驟的 ambient，不能等 completion

### React/Effect
- useAudio() 返回不穩定引用，不能放進 useEffect deps — 用 empty `[]` + ref
- 所有 completion handler 用 `completedRef = useRef(false)` 防重複 dispatch

### Visual
- 跨步驟共享視覺數據（clip-path、顏色）必須放獨立共享模組（silhouettes.ts）
- 溶解效果用 transform + opacity + filter，不用 clip-path（會覆蓋形狀）

### Process
- Agent 完成後必須 build + 手動測試，不能假設代碼正確

## Day 4 Mistakes (2026-04-07)

### Stripe
- Stripe SDK 初始化時沒有 key 會 crash — 用 null-safe singleton，routes 回 503
- `apiVersion` 不要硬編碼，讓 SDK 用預設值
- checkout route 要驗證 priceId 是否為空（env var 沒設時）
- locale 參數要白名單驗證，不能直接信任前端傳值

### UI/UX
- 付費按鈕失敗時必須顯示錯誤訊息，不能靜默失敗
- Pricing page features array：next-intl 可能返回 string 或 array，要 type check
- ResultStep 的 share 按鈕不能是 dead button
- "Best Value" badge 要 i18n，不能硬編碼英文

### Next.js
- `useSearchParams()` 必須包 `<Suspense>` boundary
- 刪掉 unused imports（useAudio 在 ResultStep 裡沒用到但 import 了）
- OG image 用 `opengraph-image.tsx` file convention，放在 [locale] 目錄下

## Day 5 Mistakes (2026-04-08)

### next-intl v4
- `t('key')` 對 array 值會拋 INVALID_MESSAGE — 必須用 `t.raw('key')` 取得原始 array
- Pricing page 因此 SSR 500（features 是 array）
- `typeof raw === 'string' ? JSON.parse(raw) : raw` 的防禦不夠，要用 `t.raw()` + `Array.isArray()`

### SEO/OG
- opengraph-image.tsx 的 `export const alt` 會覆蓋 layout metadata 的 images[].alt — 不能刪掉 alt export
- `og:image` 和 `twitter:image` 不能指向不存在的 `/og-image.png`，要指向 `/${locale}/opengraph-image`
- OG image 裡的顏色要跟 CSS @theme 保持同步（vermillion 改了 OG 沒改）

### Contrast/A11y
- `bg-vermillion text-paper` 按鈕對比度不夠（vermillion #c23616 太暗）→ 用 `bg-vermillion-dark` (#c23616) 當按鈕背景
- `bg-gold text-paper` 活躍語言按鈕對比度 2.44:1 → 改成 `bg-gold text-ink`
- vermillion 需要拉到 #ef6030 才能在 #1a1a1a 背景上過 4.5:1

### PWA
- @serwist/next 不支援 Turbopack（Next.js 16 預設）→ 只做 manifest + icons，不做 service worker
- PWA manifest 的 start_url 用 `/en` 不是 `/`

### Process
- macOS 的 zsh for loop 裡不能直接用 curl，要用 `/usr/bin/curl` 完整路徑
- macOS grep 不支援 `-P` (Perl regex)，要用 `-o` 替代

## Day 13 Lessons (2026-04-13) — Expert Review + UX Overhaul

### Expert Review Process
- 3-expert panel (Marketing/UX/Cultural) scored ritual 5.3/10 pre-fix — useful structured assessment
- Foreground Agent calls more reliable than background TeamCreate agents for parallel code work
- Team agents (TeamCreate + SendMessage) unreliable: went idle repeatedly, messages not delivered, shutdown stuck
- Manual `rm -rf ~/.claude/teams/ ~/.claude/tasks/` needed when team cleanup fails

### Trust Strategy
- Fake social proof (daily counter, "數千人完成") is anti-pattern for curse ritual — destroys credibility
- Honest heritage messaging > fake numbers: "源自正宗廣東民間傳統"
- Privacy policy + refund guarantee ("不滿意？全額退款") are conversion tools, not legal afterthoughts
- Stripe trust badge on result page reduces payment anxiety

### UX Discoveries
- Name input should always be visible (not just when "Custom" selected) — users want personalization regardless
- First result paragraph must be clear text, rest blurred — immediate gratification then paywall tease
- Result paragraph blur-[8px] for i > 0 is the right balance (too much blur = illegible tease fails)
- FooterNote on landing page duplicated Footer text — remove component from page when Footer already shows it
- Responsive interaction area: clamp(280px, 80vmin, 400px) better than fixed px for cross-device
- Haptic escalation (50ms → 40ms → 30ms+20ms double) keeps physical engagement building

### A11y
- Skip nav link + aria-live milestones + focus trap in transitions = meaningful a11y, not checkbox compliance
- Keyboard support (Enter/Space on beating area) required for mobile keyboard users too

### Landing Page
- Fade-out transition on CTA click (add class → wait 300ms → router.push) creates cinematic feel before ritual
- Mobile hint ("Best experienced on desktop") hidden on mobile with `hidden sm:block`

## Day 13b Lessons (2026-04-13) — Conversion Optimization

### Fact-Checking Discipline
- NEVER make claims about content without reading the source files first
- "缺少財運小人和官非小人" was WRONG — they exist as energyVampire→財運小人, bully→官非小人 in ZH localization
- EN-ZH localization is NOT "replacement" — it's parallel cultural adaptation (different names, same code key)
- Always read ALL three message files (en.json, zh-TW.json, zh-Hans.json) before making cultural claims

### Conversion Findings
- Reading seed mismatch (preview uses Date.now() at T1, checkout uses Date.now() at T2) = different readings shown vs delivered. Fix: store seed in useRef, reuse for checkout
- AtmosphereSection "A ritual was completed 4 minutes ago" contradicts trust strategy — changed to atmospheric text without false claims
- Free result copy "The curse has been cast" feels terminal, doesn't bridge to paid → changed to "The ashes hold a message..." to create anticipation
- Share button in ResultStep was hardcoded English while /result page correctly used i18n — two different code paths, different quality
- $6.99 button had lowest visual weight (bg-ink-light border) and no "Best Value" badge — added gold badge
- 2.5s "Reading the ashes..." loading animation before blur preview adds perceived value to $2.99 product
- EN enemy descriptions for energyVampire ("drain your light") and bully ("feed on fear") don't align with ZH concepts (財運/官非) → added "fortune" and "conflict/chaos" keywords

### Process
- TeamCreate agents unreliable for report delivery — agents go idle without sending messages
- Direct analysis by coordinator is faster and more reliable than agent-based review panels
- `rm -rf ~/.claude/teams/ ~/.claude/tasks/` for cleanup when team agents stall

## Day 14 Lessons (2026-04-14) — ZH Blog SEO Strategy

### 策略決策
- ZH blog 是獨立內容體系，不做 EN blog 的翻譯。搜索意圖、文化語境、競爭格局完全不同
- 從 4 集群精簡為 3 集群：刪「職場與情緒」（意圖不匹配），「驚蟄」併入打小人核心
- 「生氣怎麼辦」「發洩情緒方法」被否決：搜索意圖是心理調節，不是詛咒。流量再高也不碰
- 太歲和鬼月是原提案漏掉的黃金機會：持續性搜索需求，文化語境完美對齊打小人
- 第一篇寫「驚蟄打小人攻略」：低 KD、高意圖、品牌最強連結

### 關鍵詞取捨原則
- 所有內容必須服務於「詛咒儀式」品牌定位
- 偏離定位的關鍵詞（情緒管理、職場建議）即使流量高也是噪音
- 有限度擴展到命理（去霉運、太歲）可接受，因為同在民俗信仰體系內

### ZH blog 11 篇文章排優先序
1. ZH2 驚蟄打小人攻略 → 2. ZH1 打小人完整攻略 → 3. ZH6 犯太歲化解 → 4. ZH5 去霉運方法 → 5. ZH8 小人作祟 → 6. ZH11 台灣打小人 → 7. ZH4 鵝頸橋 → 8. ZH3 咒語 → 9. ZH7 鬼月 → 10. ZH9 詛咒比較 → 11. ZH10 歷史

### 文件位置
- 完整策略：`docs/blog-seo-zh.md`
- EN blog 架構：`docs/blog-seo-en.md`
