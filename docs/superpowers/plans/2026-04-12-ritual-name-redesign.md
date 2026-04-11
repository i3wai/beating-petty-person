# Ritual "Name Your Enemy" Flow Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redefine $2.99 tier from "Name Your Enemy" (animation) to "Curse Reading" (personalized modular curse text). Free users can input enemy names. Three tiers sell different value types: content, proof, everything.

**Architecture:** New `curseReading.ts` module generates deterministic personalized readings from modular text fragments. Result page and ritual steps get updated CTAs and name display. All i18n files get new reading content. No Stripe or backend changes.

**Tech Stack:** Next.js 16 App Router, next-intl, TypeScript, Tailwind v4

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `src/lib/curseReading.ts` | Seed-based modular reading generator |
| Modify | `messages/en.json` | Updated keys + 54 reading fragments |
| Modify | `messages/zh-TW.json` | Updated keys + 54 reading fragments |
| Modify | `messages/zh-Hans.json` | Updated keys + 54 reading fragments |
| Modify | `src/components/ritual/steps/EnemySelectStep.tsx` | Remove $2.99 from custom label |
| Modify | `src/components/ritual/steps/BeatingStep.tsx` | Display enemy name on paper figure |
| Modify | `src/components/ritual/steps/BurningStep.tsx` | Display enemy name during burning |
| Modify | `src/components/ritual/steps/ResultStep.tsx` | New CTA copy + reading display |
| Modify | `src/app/[locale]/pricing/page.tsx` | No code changes (driven by i18n) |
| Modify | `src/lib/stripe.ts` | Update plan display name for 'name' |

---

### Task 1: Curse Reading Generator

**Files:**
- Create: `src/lib/curseReading.ts`

This module takes an enemy category, optional name, and a seed, and returns a composed 3-sentence curse reading. The reading fragments live in i18n JSON files — this module just handles the deterministic selection and composition logic.

- [ ] **Step 1: Create `src/lib/curseReading.ts`**

```typescript
import type { EnemyCategory } from '@/components/ritual/silhouettes';

/**
 * Deterministic modular curse reading generator.
 * Composes 3 sentences (opening, impact, closing) from per-type fragments.
 * Seed makes the same session produce the same reading.
 */

export interface ReadingFragments {
  openings: string[];
  impacts: string[];
  closings: string[];
}

/**
 * Simple deterministic hash from seed string → number.
 */
function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Pick an item from array using deterministic seed.
 */
function pickFragment<T>(arr: T[], seed: number, offset: number): T {
  return arr[(seed + offset) % arr.length];
}

/**
 * Generate a personalized curse reading.
 *
 * @param fragments - The 3 arrays of sentence fragments from i18n
 * @param targetName - The enemy name (or type name for generic)
 * @param seed - Deterministic seed (e.g., session timestamp)
 * @returns Composed reading string (3 sentences, one per line)
 */
export function generateReading(
  fragments: ReadingFragments,
  targetName: string,
  seed: string,
): string {
  const hash = hashSeed(seed);

  const opening = pickFragment(fragments.openings, hash, 0)
    .replace(/\{target\}/g, targetName);
  const impact = pickFragment(fragments.impacts, hash, 7)
    .replace(/\{target\}/g, targetName);
  const closing = pickFragment(fragments.closings, hash, 13)
    .replace(/\{target\}/g, targetName);

  return `${opening}\n\n${impact}\n\n${closing}`;
}

/**
 * Resolve the target name for the reading.
 * If the user typed a custom name, use it.
 * Otherwise use the localized enemy type name.
 */
export function resolveTarget(
  enemyCategory: EnemyCategory,
  enemyName: string | undefined,
  localizedTypeName: string,
): string {
  return enemyName?.trim() || localizedTypeName;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/curseReading.ts
git commit -m "feat: add curse reading generator module"
```

---

### Task 2: English i18n — Reading Fragments + Updated Keys

**Files:**
- Modify: `messages/en.json`

This is the biggest content task. Add 54 reading fragment strings (6 types × 3 modules × 3 fragments) and update existing keys.

- [ ] **Step 1: Update `messages/en.json`**

Changes to make:

1. `ritual.step1CustomLabel`: `"Name your enemy — $2.99"` → `"Enter their name"`
2. `ritual.resultNameButton`: `"Name Your Enemy — $2.99"` → `"Reveal the Curse Reading — $2.99"`
3. Add new `ritual.reading` namespace with all fragments
4. Update `pricing.name` section (name, description, features, cta)

In the `ritual` section, update these keys:

```json
"step1CustomLabel": "Enter their name",
"resultNameButton": "Reveal the Curse Reading — $2.99",
```

Add new `reading` key inside `ritual`:

```json
"reading": {
  "title": "The Curse Reading",
  "backstabber": {
    "openings": [
      "The curse has found its mark. {target}, the betrayer, will not escape what has been set in motion.",
      "The ritual energy has locked onto {target}. Their shadow has been claimed.",
      "The ancient words have been spoken. {target}'s fate is now sealed in fire."
    ],
    "impacts": [
      "Their deceptions will turn against them. By the next moon, those they betrayed will see the truth.",
      "Every lie they speak will cost them an ally. The curse feeds on their greatest weakness — their tongue.",
      "The bonds of trust they fractured will never heal in their favor. Isolation awaits."
    ],
    "closings": [
      "This is not a warning. This is a verdict.",
      "The curse has been spoken. It cannot be unspoken.",
      "What is done cannot be undone. The fire has consumed. The ash has settled."
    ]
  },
  "toxicBoss": {
    "openings": [
      "The curse descends upon {target}. Their authority means nothing here.",
      "The ritual has named {target}. Power without wisdom invites its own destruction.",
      "{target}'s reign of cruelty has been witnessed. The spirits remember."
    ],
    "impacts": [
      "Those they crushed will rise. Their influence will crumble from within.",
      "The fear they planted in others will bloom in their own chest. Sleep will not come easily.",
      "Their commands will lose their weight. Subordinates will see through the illusion of strength."
    ],
    "closings": [
      "The curse does not negotiate. Neither did they.",
      "What they built on fear will collapse. The foundation was always hollow.",
      "The ritual is complete. Their power was never real."
    ]
  },
  "ex": {
    "openings": [
      "The curse reaches through closed doors. {target} is not beyond its grasp.",
      "{target} should have stayed in the past. The ritual ensures they will.",
      "The flame that burns for {target} is not love. It is reckoning."
    ],
    "impacts": [
      "The memories they left behind will haunt them in reverse. What they took will be returned — doubled.",
      "Their new foundations will crack. What they built on betrayal cannot stand.",
      "Every door they closed will lock from the other side. They will knock. No one will answer."
    ],
    "closings": [
      "Some doors should stay closed. The curse agrees.",
      "This chapter is finished. The book has been burned.",
      "The ritual has spoken. {target} is the past. The past stays buried."
    ]
  },
  "energyVampire": {
    "openings": [
      "The curse has identified {target}. The drain ends now.",
      "{target} has fed long enough. The ritual cuts the cord they never deserved.",
      "The spirits see {target} for what they are — a parasite in human form."
    ],
    "impacts": [
      "The energy they stole will sour in their possession. What nourished them will poison them.",
      "Their presence will repel instead of attract. The rooms they enter will grow cold.",
      "The void they carry will consume them from within. They will drain themselves dry."
    ],
    "closings": [
      "The cord is cut. {target} feeds on nothing now.",
      "The parasite has been named. The host is free.",
      "The ritual is sealed. Their hunger will be their ruin."
    ]
  },
  "bully": {
    "openings": [
      "The curse confronts {target}. Their cruelty has been recorded.",
      "{target} ruled through fear. The ritual answers with something older.",
      "The spirits have weighed {target} and found them wanting."
    ],
    "impacts": [
      "The fear they planted will harvest in their own fields. They will know how it feels.",
      "Their strength will become their prison. The walls they built for others will close in on them.",
      "Those who stood silent will find their voice. {target} will not recognize the world they wake up in."
    ],
    "closings": [
      "The table has turned. {target} just doesn't know it yet.",
      "The ritual does not forget. Neither do the broken.",
      "What goes around has come around. The circle is complete."
    ]
  },
  "custom": {
    "openings": [
      "The curse has been aimed. {target} — you know exactly who they are. So does the ritual now.",
      "The name {target} has been spoken into the fire. It cannot be unspoken.",
      "The ritual accepts your target. {target} has been marked."
    ],
    "impacts": [
      "Their plans will unravel. Their certainties will become questions. Their ground will shift beneath their feet.",
      "The universe has been nudged. Coincidences will stack against them. Not dramatic — just relentless.",
      "The curse works in silence. {target} will not see it coming. But they will feel it."
    ],
    "closings": [
      "You named them. The ritual heard. What happens next is between them and the curse.",
      "The paper has burned. The ash has scattered. The curse is loose.",
      "This is between you, {target}, and the ancient ones. The ritual is done."
    ]
  }
}
```

Update the `pricing.name` section:

```json
"name": {
  "name": "Curse Reading",
  "price": "$2.99",
  "description": "Unlock a personalized curse interpretation. Learn exactly how the curse will affect your enemy.",
  "features": ["Personalized curse reading", "Enemy-specific prophecy", "Name woven into the curse"],
  "cta": "Reveal the Curse Reading — $2.99"
},
```

- [ ] **Step 2: Commit**

```bash
git add messages/en.json
git commit -m "feat(en): add curse reading fragments + update name tier copy"
```

---

### Task 3: Traditional Chinese i18n — Reading Fragments + Updated Keys

**Files:**
- Modify: `messages/zh-TW.json`

Same structure as English, but ZH is completely different copy — classical/literary Chinese curse language, not translation.

- [ ] **Step 1: Update `messages/zh-TW.json`**

Changes:

1. `ritual.step1CustomLabel`: `"點名小人 — $2.99"` → `"輸入名字"`
2. `ritual.resultNameButton`: `"點名小人 — $2.99"` → `"揭示詛咒解讀 — $2.99"`
3. Add `ritual.reading` namespace
4. Update `pricing.name` section

Updated keys:

```json
"step1CustomLabel": "輸入名字",
"resultNameButton": "揭示詛咒解讀 — $2.99",
```

Add `reading` inside `ritual`:

```json
"reading": {
  "title": "詛咒解讀",
  "backstabber": {
    "openings": [
      "詛咒已鎖定目標。{target}——背叛者——逃不過今日所種之因。",
      "儀式之力已纏上{target}。其影已被收押。",
      "古語已誦。{target}之命，已封於火。"
    ],
    "impacts": [
      "其謊言將反噬自身。下個月圓之時，被其出賣之人將看清真相。",
      "每一句謊話，將令其失去一個盟友。詛咒以其最弱之處為食——那張嘴。",
      "其親手撕裂的信任，將永遠無法為其所用。孤立無援，是其終局。"
    ],
    "closings": [
      "此非警告。此乃判決。",
      "詛咒已出。無法收回。",
      "業已成灰。灰已散去。詛咒已釋。"
    ]
  },
  "toxicBoss": {
    "openings": [
      "詛咒降於{target}。其權勢，在此無用。",
      "儀式已點名{target}。有權無德，自取滅亡。",
      "{target}之暴行已被記錄。鬼神記得。"
    ],
    "impacts": [
      "被其踐踏之人將站起。其影響力將從內部崩塌。",
      "其種下的恐懼，將在自己的胸中開花。夜不能寐。",
      "其號令將失其威。下屬將看穿其虛弱的真相。"
    ],
    "closings": [
      "詛咒不談判。正如他們從不。",
      "建於恐懼之上的，終將崩塌。其根基從來就是空的。",
      "儀式已成。其權力從非真實。"
    ]
  },
  "ex": {
    "openings": [
      "詛咒穿透緊閉之門。{target}不在其觸及之外。",
      "{target}本該留在過去。儀式確保他們如此。",
      "為{target}燃燒的不是舊情。是清算。"
    ],
    "impacts": [
      "其留下的記憶將反噬。其所取之物將被歸還——加倍奉還。",
      "其新建的根基將開裂。建於背叛之上的，站不住腳。",
      "其關上的每一扇門，將從另一面反鎖。他們會敲門。無人應答。"
    ],
    "closings": [
      "有些門該永遠關上。詛咒同意。",
      "此章已完。書已燒盡。",
      "儀式已宣告。{target}是過去。過去該埋葬。"
    ]
  },
  "energyVampire": {
    "openings": [
      "詛咒已認出{target}。吸血到此為止。",
      "{target}已吸食夠久。儀式斬斷其不配擁有的牽絆。",
      "鬼神看穿{target}的本相——人形寄生之物。"
    ],
    "impacts": [
      "其盜取的能量將在其手中腐爛。滋養之物將化為毒藥。",
      "其存在將令人反感而非吸引。其踏入的房間將變冷。",
      "其內心的空洞將反噬自身。終將自我榨乾。"
    ],
    "closings": [
      "牽絆已斷。{target}從此無物可食。",
      "寄生者已被點名。宿主已自由。",
      "儀式已封印。其饑渴將成其覆滅。"
    ]
  },
  "bully": {
    "openings": [
      "詛咒直面{target}。其惡行已被記錄在案。",
      "{target}以恐懼為王。儀式以更古老之物回應。",
      "鬼神已權衡{target}，判定其不足。"
    ],
    "impacts": [
      "其種下的恐懼將在自己的田中收割。他們將嘗到那滋味。",
      "其力量將成為其牢籠。其為他人築的牆，將向其合攏。",
      "沉默之人將找到聲音。{target}將認不出他們醒來的世界。"
    ],
    "closings": [
      "風水輪流轉。{target}只是還不知道。",
      "儀式不忘。被傷害之人亦不忘。",
      "善惡到頭終有報。輪迴已成。"
    ]
  },
  "custom": {
    "openings": [
      "詛咒已瞄準。{target}——你心知肚明是誰。儀式現在也知道了。",
      "{target}之名已被誦入火中。無法收回。",
      "儀式接受你的目標。{target}已被標記。"
    ],
    "impacts": [
      "其計劃將脫軌。其確定將成疑問。其腳下之地將動搖。",
      "天地已被輕推。巧合將反覆堆疊。不張揚——只是永不停止。",
      "詛咒在暗處運作。{target}不會看見。但他們會感覺到。"
    ],
    "closings": [
      "你點了名。儀式聽到了。接下來的事，在他們與詛咒之間。",
      "紙已燃盡。灰已四散。詛咒已釋。",
      "此乃你、{target}與古神之間的事。儀式已成。"
    ]
  }
}
```

Update `pricing.name`:

```json
"name": {
  "name": "詛咒解讀",
  "price": "$2.99",
  "description": "解鎖個人化詛咒解讀。了解詛咒將如何影響你的小人。",
  "features": ["個人化詛咒解讀", "針對性預言", "名字編入詛咒"],
  "cta": "揭示詛咒解讀 — $2.99"
},
```

- [ ] **Step 2: Commit**

```bash
git add messages/zh-TW.json
git commit -m "feat(zh-TW): add curse reading fragments + update name tier copy"
```

---

### Task 4: Simplified Chinese i18n — Reading Fragments + Updated Keys

**Files:**
- Modify: `messages/zh-Hans.json`

Same structure as Traditional Chinese but in Simplified characters. Content should match zh-TW meaning but use simplified script.

- [ ] **Step 1: Read current `messages/zh-Hans.json` and apply the same pattern**

Apply identical structural changes as Task 3 but with Simplified Chinese characters:
- `ritual.step1CustomLabel` → `"输入名字"`
- `ritual.resultNameButton` → `"揭示诅咒解读 — $2.99"`
- Add `ritual.reading` with all 6 types × 3 modules × 3 fragments (same content as zh-TW but simplified)
- Update `pricing.name` section

The reading fragments should be the same content as zh-TW but with simplified characters (e.g., 詛咒→诅咒, 儀式→仪式, 點名→点名, etc.)

- [ ] **Step 2: Commit**

```bash
git add messages/zh-Hans.json
git commit -m "feat(zh-Hans): add curse reading fragments + update name tier copy"
```

---

### Task 5: EnemySelectStep — Remove Price from Custom Label

**Files:**
- Modify: `src/components/ritual/steps/EnemySelectStep.tsx`

Trivial change — the i18n key `step1CustomLabel` already drives the label text. Since Tasks 2-4 already changed the i18n values, no code change is needed in this file. Verify by reading the component and confirming it uses `t('step1CustomLabel')`.

- [ ] **Step 1: Verify `EnemySelectStep.tsx` uses `t('step1CustomLabel')` for the label**

Read the file. At line 104 it should be:
```tsx
<label htmlFor="custom-name" className="block text-sm text-gold font-serif mb-2">
  {t('step1CustomLabel')}
</label>
```

This is already the case — no code change needed. The i18n changes from Tasks 2-4 will flow through automatically.

- [ ] **Step 2: Move on (no commit needed for this task)**

---

### Task 6: BeatingStep — Display Enemy Name on Paper Figure

**Files:**
- Modify: `src/components/ritual/steps/BeatingStep.tsx`

Add the enemy name as text on the paper figure. The name should appear centered on the silhouette, degrade with the figure (same transform/opacity), and sit below the canvas layer.

- [ ] **Step 1: Add name display inside the paper figure div**

In `BeatingStep.tsx`, inside the paper figure `<div>` (around line 189-205), add a `<span>` for the enemy name. The name div is inside the clip-path silhouette, so it gets clipped too.

Find the paper figure div (the one with `style={{ width: 120, height: 180, ... }}`) and add a centered name span inside it:

```tsx
{/* Paper figure — clip-path matches selected enemy */}
<div
  className={`
    relative flex items-center justify-center
    ${reducedMotion && pulseActive ? 'paper-figure-pulse' : ''}
  `}
  style={{
    width: 120,
    height: 180,
    background: '#f5f0e8',
    clipPath: SILHOUETTE_CLIPS[(enemy?.category as EnemyCategory) ?? 'custom'] ?? DEFAULT_CLIP,
    boxShadow: '0 0 20px 4px rgba(245, 240, 232, 0.1)',
    transform: `rotate(${figureRotate}deg) scale(${figureScale})`,
    opacity: figureOpacity,
    transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
  }}
  aria-hidden="true"
>
  {/* Enemy name on the paper figure */}
  {enemy?.name && (
    <span
      className="text-ink font-serif text-sm font-semibold text-center leading-tight px-2 select-none"
      style={{
        maxWidth: '80%',
        wordBreak: 'break-word',
      }}
    >
      {enemy.name}
    </span>
  )}
</div>
```

This replaces the existing paper figure div. The key changes:
- Added `flex items-center justify-center` to center the name
- Added the `{enemy?.name && (...)}` conditional span inside the div
- The span is inside the clip-path boundary so it gets clipped too

- [ ] **Step 2: Commit**

```bash
git add src/components/ritual/steps/BeatingStep.tsx
git commit -m "feat: display enemy name on paper figure during beating"
```

---

### Task 7: BurningStep — Display Enemy Name During Burning

**Files:**
- Modify: `src/components/ritual/steps/BurningStep.tsx`

Same pattern as BeatingStep — add the enemy name inside the paper figure div.

- [ ] **Step 1: Add name display inside the burning paper figure div**

In `BurningStep.tsx`, find the paper figure div (around line 141-150, the one with `className="paper-figure burning-paper-figure relative z-0"`). Add a centered name span inside it:

```tsx
<div
  className="paper-figure burning-paper-figure relative z-0 flex items-center justify-center"
  style={{
    clipPath: SILHOUETTE_CLIPS[(enemy?.category as EnemyCategory) ?? 'custom'] ?? DEFAULT_CLIP,
    transform: `scale(${paperScale})`,
    opacity: paperOpacity,
    filter: paperFilter,
    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
  }}
  aria-hidden="true"
>
  {/* Enemy name burns with the paper figure */}
  {enemy?.name && (
    <span
      className="text-ink font-serif text-sm font-semibold text-center leading-tight px-2 select-none"
      style={{
        maxWidth: '80%',
        wordBreak: 'break-word',
        filter: paperFilter,
      }}
    >
      {enemy.name}
    </span>
  )}
</div>
```

Key changes:
- Added `flex items-center justify-center` to the outer div
- Added conditional name span with the same filter as the paper figure
- Name gets the same sepia/brightness degradation as the paper

- [ ] **Step 2: Commit**

```bash
git add src/components/ritual/steps/BurningStep.tsx
git commit -m "feat: display enemy name on paper figure during burning"
```

---

### Task 8: ResultStep — New CTA Copy + Curse Reading Display

**Files:**
- Modify: `src/components/ritual/steps/ResultStep.tsx`

This is the largest code change. Two things:
1. CTA buttons already use i18n keys (`resultNameButton`, `resultSealButton`, `resultFullButton`) — updated in Tasks 2-4
2. Add a "Curse Reading preview" prompt after the free result, before the payment buttons — this is the $2.99 pitch

- [ ] **Step 1: Add curse reading prompt and display logic**

In `ResultStep.tsx`, add imports at the top:

```tsx
import { generateReading, resolveTarget } from '@/lib/curseReading';
import type { EnemyCategory } from '@/components/ritual/silhouettes';
```

Add a computed reading preview section. After the "paid upsell prompt" section (around line 105), replace the entire payment buttons area with:

```tsx
{/* Curse Reading prompt */}
<div className="mt-10 animate-fade-in-up">
  {error && (
    <p className="text-sm text-vermillion font-serif text-center mb-4">
      {t('resultCheckoutError')}
    </p>
  )}

  {/* Reading preview tease — shown before payment */}
  <div className="mb-8 px-4 py-4 bg-ink-light border border-ink-lighter rounded-sm text-center">
    <p className="text-sm text-paper-muted font-serif italic leading-relaxed">
      {t('readingPreview')}
    </p>
  </div>

  <p className="text-sm sm:text-base text-gold font-serif text-center mb-6">
    {t('resultPaidPrompt')}
  </p>

  <div className="flex flex-col gap-3 w-full max-w-sm">
    {/* Reveal the Curse Reading — $2.99 */}
    <button
      onClick={() => handleCheckout('name')}
      disabled={loading !== null}
      className="
        w-full px-6 py-3 rounded-sm
        bg-gold text-ink font-serif font-semibold text-base
        hover:bg-gold-light active:bg-gold-dark
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
      "
      aria-label={t('resultNameButton')}
    >
      {loading === 'name' ? '...' : t('resultNameButton')}
    </button>

    {/* Complete the Sealing — $4.99 */}
    <button
      onClick={() => handleCheckout('seal')}
      disabled={loading !== null}
      className="
        w-full px-6 py-3 rounded-sm
        bg-vermillion text-paper font-serif font-semibold text-base
        hover:bg-vermillion-light active:bg-vermillion-dark
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermillion
      "
      aria-label={t('resultSealButton')}
    >
      {loading === 'seal' ? '...' : t('resultSealButton')}
    </button>

    {/* Full Power Ritual — $6.99 */}
    <button
      onClick={() => handleCheckout('full')}
      disabled={loading !== null}
      className="
        w-full px-6 py-3 rounded-sm
        bg-ink-light border border-vermillion/40 text-vermillion
        font-serif font-semibold text-base
        hover:border-vermillion hover:bg-ink-lighter
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermillion
      "
      aria-label={t('resultFullButton')}
    >
      {loading === 'full' ? '...' : t('resultFullButton')}
    </button>
  </div>
</div>
```

Note the new `readingPreview` key — this is a short tease like "The curse has spoken, but its words remain sealed..." that we need to add to i18n.

- [ ] **Step 2: Add `readingPreview` key to all 3 i18n files**

In each message file's `ritual` section, add:

EN: `"readingPreview": "The curse has spoken — but its words remain sealed. Reveal the full reading."`
zh-TW: `"readingPreview": "詛咒已出聲——但其言語仍被封印。解鎖完整解讀。"`
zh-Hans: `"readingPreview": "诅咒已出声——但其言语仍被封印。解锁完整解读。"`

- [ ] **Step 3: Commit**

```bash
git add src/components/ritual/steps/ResultStep.tsx messages/en.json messages/zh-TW.json messages/zh-Hans.json
git commit -m "feat: redesign result page CTAs with curse reading prompt"
```

---

### Task 9: Result Page — Display Curse Reading After Payment

**Files:**
- Modify: `src/app/[locale]/result/page.tsx`

After a user pays for the "name" plan (or any plan that includes reading), the `/result` page should display the composed curse reading.

- [ ] **Step 1: Add reading display to the paid state**

In `result/page.tsx`, add imports:

```tsx
import { generateReading, resolveTarget } from '@/lib/curseReading';
import type { EnemyCategory } from '@/components/ritual/silhouettes';
```

Add a helper function inside `ResultContent` (after the `handleShare` callback):

```tsx
// Generate curse reading if we have enemy data
const curseReading = useMemo(() => {
  if (!payment?.enemyCategory) return null;
  try {
    // These would need to come from a client-side context or be passed via API
    // For now, we store reading fragments check in localStorage
    const stored = localStorage.getItem('beatpetty_reading_fragments');
    if (!stored) return null;
    const fragments = JSON.parse(stored);
    const target = resolveTarget(
      payment.enemyCategory as EnemyCategory,
      payment.enemyName,
      payment.enemyCategory,
    );
    return generateReading(fragments, target, String(Date.now()));
  } catch {
    return null;
  }
}, [payment]);
```

Wait — the `/result` page is a separate page load (after Stripe redirect). The ritual i18n context isn't available here. We need a different approach.

**Better approach:** Store the generated reading text in localStorage before redirecting to Stripe, then display it on the result page.

This means the reading should be generated in `ResultStep.tsx` BEFORE the Stripe redirect, saved to localStorage, and then displayed on `/result` after payment verification.

- [ ] **Step 2 (revised): Generate and store reading in ResultStep before Stripe redirect**

In `ResultStep.tsx`, inside the `handleCheckout` callback (before the `fetch('/api/checkout')` call), add reading generation and localStorage save:

```tsx
const handleCheckout = useCallback(
  async (plan: PlanType) => {
    setLoading(plan);
    setError(false);

    // Save enemy info to localStorage before leaving
    if (enemy) {
      try {
        localStorage.setItem(
          LS_KEY_ENEMY,
          JSON.stringify({ category: enemy.category, name: enemy.name ?? '' }),
        );
      } catch {
        // localStorage unavailable
      }
    }

    // Generate and store curse reading before redirect (for result page)
    if (plan === 'name' || plan === 'full') {
      try {
        const category = (enemy?.category ?? 'custom') as EnemyCategory;
        const fragments = {
          openings: t.raw(`reading.${category}.openings`),
          impacts: t.raw(`reading.${category}.impacts`),
          closings: t.raw(`reading.${category}.closings`),
        };
        const target = resolveTarget(
          category,
          enemy?.name,
          t(`enemies.${category}.name`),
        );
        const reading = generateReading(fragments, target, String(Date.now()));
        localStorage.setItem('beatpetty_reading', reading);
      } catch {
        // reading generation failed — non-critical
      }
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          enemyCategory: enemy?.category,
          enemyName: enemy?.name,
          locale,
        }),
      });

      if (!res.ok) throw new Error('Checkout failed');

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setError(true);
      setLoading(null);
    }
  },
  [enemy, locale, t],
);
```

- [ ] **Step 3: Display stored reading on result page**

In `result/page.tsx`, in the paid state view (inside `state === 'paid' && payment`), after the payment description, add reading display:

```tsx
{/* Curse Reading display */}
{(() => {
  try {
    const reading = localStorage.getItem('beatpetty_reading');
    if (!reading) return null;
    return (
      <div className="mt-8 px-6 py-6 bg-ink-light border border-gold/30 rounded-sm text-left max-w-md animate-fade-in-up">
        <h2 className="text-lg font-bold text-gold font-serif mb-4 text-center">
          {t('readingTitle')}
        </h2>
        {reading.split('\n\n').map((paragraph, i) => (
          <p key={i} className="text-paper-muted font-serif text-sm leading-relaxed mb-3 last:mb-0 italic">
            {paragraph}
          </p>
        ))}
      </div>
    );
  } catch {
    return null;
  }
})()}
```

Add `readingTitle` to all 3 i18n files in the `result` section:

EN: `"readingTitle": "The Curse Reading"`
zh-TW: `"readingTitle": "詛咒解讀"`
zh-Hans: `"readingTitle": "诅咒解读"`

- [ ] **Step 4: Commit**

```bash
git add src/components/ritual/steps/ResultStep.tsx src/app/[locale]/result/page.tsx messages/en.json messages/zh-TW.json messages/zh-Hans.json
git commit -m "feat: generate + display curse reading after payment"
```

---

### Task 10: Stripe Display Name Update

**Files:**
- Modify: `src/lib/stripe.ts`

Update the display name for the 'name' plan to match new branding.

- [ ] **Step 1: Update plan name**

In `src/lib/stripe.ts`, line 9, change:

```typescript
name: 'Name Your Enemy',
```

to:

```typescript
name: 'Curse Reading',
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/stripe.ts
git commit -m "feat: update Stripe plan display name to 'Curse Reading'"
```

---

### Task 11: Build + Smoke Test

**Files:**
- None (verification only)

- [ ] **Step 1: Run build**

```bash
cd /Users/allenwong/Projects/beating-petty-person && npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Run dev server and verify manually**

```bash
npm run dev
```

Check these flows:
1. Go to `/en/ritual` → Start ritual → Select "Custom" → Confirm label says "Enter their name" (no $2.99)
2. Type a name → Confirm → Beating step shows name on paper figure
3. Beating completes → Burning step shows name on paper figure
4. Result page shows 3 CTAs with new copy: "Reveal the Curse Reading — $2.99", "Seal the Curse — $4.99", "Full Power Ritual — $6.99"
5. Go to `/en/pricing` → $2.99 card says "Curse Reading"
6. Repeat for `/zh-TW/ritual` and `/zh-Hans/ritual`

- [ ] **Step 3: Fix any issues found during testing**

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "fix: address issues from smoke testing"
```

---

### Task 12: Deploy

**Files:**
- None

- [ ] **Step 1: Deploy to production**

```bash
npx vercel --prod --yes
```

- [ ] **Step 2: Verify on production**

```bash
curl -s https://beatpetty.com/en/ritual | grep -c "Enter their name"
```

Expected: count > 0

- [ ] **Step 3: Update CLAUDE.md status**

Add to the Status section:
```
- **Ritual Redesign completed: 2026-04-12** — $2.99 tier repositioned as "Curse Reading", free name input, name on paper figure, modular reading system
```
