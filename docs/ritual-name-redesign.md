# Ritual "Name Your Enemy" Flow Redesign

> Date: 2026-04-12 | Status: Implemented (2026-04-12) | Scope: Ritual flow + Result page + Pricing

## Problem

The "Name Your Enemy" ($2.99) tier has a broken UX flow:

1. Step 1 lets users type a custom name for free (the $2.99 label was never enforced)
2. Result page shows "Name Your Enemy — $2.99" but the user already named their enemy
3. The $2.99 value proposition ("name burning animation + targeted result") is too weak — decoration, not value

## Design Decision

**Redefine the three tiers to sell different TYPES of value:**

| Tier | Sells | User Gets |
|------|-------|-----------|
| $2.99 | **Content** — Curse Reading | Personalized 4-5 sentence curse interpretation |
| $4.99 | **Proof** — Seal + Certificate | Seal animation, digital certificate, "seal holds 7 days" |
| $6.99 | **Everything** — Full Power | Reading + Seal + Certificate + name burning + premium result |

## Changes

### 1. Step 1: EnemySelectStep (minor)

- Remove `$2.99` from custom name input label
- `step1CustomLabel`: "Name your enemy — $2.99" → "Enter their name" / "輸入名字"
- Custom name input is completely free, zero payment friction

### 2. BeatingStep (visual enhancement)

If `enemy.name` exists, display it on the paper figure:
- White text, centered on the silhouette, positioned at ~60% height
- Font: serif, ~14-16px, matches paper-figure aesthetic
- Degrades with the paper figure (same transform/opacity)
- Particles render on top (z-index), name underneath

### 3. BurningStep (visual enhancement)

Name persists on the paper figure during burning:
- Scales and fades with the paper figure dissolution
- No special "name burning" effect for free users — that's paid ($6.99)

### 4. ResultStep (major redesign)

**Three CTAs always visible (all users see all three):**

| Button | Copy | Style |
|--------|------|-------|
| Primary | `Reveal the Curse Reading — $2.99` | bg-gold text-ink (impulse buy) |
| Secondary | `Seal the Curse — $4.99` | bg-vermillion text-paper |
| Full | `Full Power Ritual — $6.99` | bg-vermillion text-paper + "Best Value" badge |

**After payment ($2.99 Curse Reading):**
- The /result page shows the personalized Curse Reading below the free result
- Reading is 3 sentences composed from modular fragments (see section 5)
- If enemy has a name: `{name}` is woven into the text
- If generic type: type name is used (e.g., "The Backstabber")

### 5. Curse Reading System (new)

**Structure:** Each enemy type has 3 modules, each with 3-4 sentence fragments:

```
Opening (3-4 variants) → sets the tone, names the target
Impact (3-4 variants) → describes the curse's effect
Closing (3-4 variants) → seals the prophecy
```

**Example for "backstabber" type:**

Openings:
- "The curse has found its mark. {target}, the betrayer, will not escape what has been set in motion."
- "The ritual energy has locked onto {target}. Their shadow has been claimed."
- "The ancient words have been spoken. {target}'s fate is now sealed in fire."

Impacts:
- "Their deceptions will turn against them. By the next moon, those they betrayed will see the truth."
- "Every lie they speak will cost them an ally. The curse feeds on their greatest weakness — their tongue."
- "The bonds of trust they fractured will never heal in their favor. Isolation awaits."

Closings:
- "This is not a warning. This is a verdict."
- "The curse has been spoken. It cannot be unspoken."
- "What is done cannot be undone. The fire has consumed. The ash has settled."

**{target} resolution:**
- If `enemy.name` exists: use the name (e.g., "Kevin")
- If generic: use the localized type name (e.g., "The Backstabber" / "是非小人")

**Combination:** 3 openings × 3 impacts × 3 closings = 27 per type × 6 types = 162 unique readings

**Seed:** Deterministic from session timestamp (same session = same reading). Different session = potentially different reading.

### 6. i18n

**Updated keys (all 3 languages):**

`ritual` namespace:
- `step1CustomLabel`: remove price reference
- `resultReadingButton`: "Reveal the Curse Reading — $2.99" (replaces `resultNameButton`)
- `resultSealButton`: unchanged
- `resultFullButton`: unchanged
- `reading.*`: new namespace for curse reading fragments

  Per enemy type (6): `reading.backstabber.openings[0-2]`, `reading.backstabber.impacts[0-2]`, `reading.backstabber.closings[0-2]`
  Total: 6 types × 3 modules × 3 fragments = 54 keys × 3 languages

**Key principle:** EN and ZH are completely different copy, never direct translations. ZH uses more classical/literary Chinese curse language.

`pricing` namespace:
- `pricing.name.name`: "Curse Reading" (was "Name Your Enemy")
- `pricing.name.description`: updated to describe reading content
- `pricing.name.features`: updated
- `pricing.name.cta`: "Reveal the Curse Reading — $2.99"

### 7. Stripe

**No changes.** Same 3 Products, same Prices. Only frontend copy changes.

### 8. Pricing Page

Update $2.99 card to match new positioning:
- Name: "Curse Reading"
- Description: "Unlock a personalized curse interpretation. Learn exactly how the curse will affect your enemy."
- Features: ["Personalized curse reading", "Enemy-specific prophecy", "Name woven into the curse"]
- CTA: "Reveal the Curse Reading — $2.99"

## Files Changed

| File | Change |
|------|--------|
| `src/components/ritual/steps/EnemySelectStep.tsx` | Remove $2.99 from custom input label |
| `src/components/ritual/steps/BeatingStep.tsx` | Display enemy name on paper figure |
| `src/components/ritual/steps/BurningStep.tsx` | Display enemy name during burning |
| `src/components/ritual/steps/ResultStep.tsx` | New CTA copy, reading display after payment |
| `src/components/ritual/RitualProvider.tsx` | No changes needed |
| `src/lib/curseReading.ts` | New: reading generation module (seed + compose) |
| `messages/en.json` | Updated keys + 54 new reading fragments |
| `messages/zh-TW.json` | Updated keys + 54 new reading fragments |
| `messages/zh-Hans.json` | Updated keys + 54 new reading fragments |
| `src/app/[locale]/pricing/page.tsx` | Update $2.99 card content |
| `src/app/[locale]/result/page.tsx` | Display reading for paid users |

## Out of Scope

- Name burning animation (stays as $6.99 feature, existing behavior)
- Seal animation (stays as $4.99 feature, existing behavior)
- Certificate design (stays as $4.99+ feature, existing behavior)
- 7-day return hook (future feature)
- Stripe product/price changes
