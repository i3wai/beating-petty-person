# BeatPetty — Current Process State

> **Every new session: read this file first. Every session end: update this file.**
> Last updated: 2026-04-21

---

## Current Status: Phase 1 COMPLETE + UX Polish

Ritual redesign + payment flow + Steps 6-8 UX polish. All tested locally, pending deploy.

### What's Built

- **Ritual Flow**: 8-step traditional 八部曲, free (1-5) + paid (6-8)
- **Payment**: 4 paths (Free / $2.99 Reading / $4.99 Completion / $6.99 Full), Stripe Checkout
- **Content**: Curse reading (~945 combos) + Oracle guidance (54 fragments) + Curse certificate
- **Blog**: 9 EN + 11 ZH articles, all with AI images, deployed
- **AI Images**: 7 atmospheric backgrounds (white tiger, flames, purification, blessing, divination, 3 result images)
- **Audio**: 12 synthesized sounds (Web Audio API, no MP3)
- **i18n**: EN + zh-TW + zh-Hans, culturally accurate (not direct translations)

### Latest Changes (2026-04-21) — Steps 6-8 UX Polish

| Change | Detail |
|--------|--------|
| **Divination 3-throw mechanic** | Paid users: 1st throw = 50/50 laugh/anger, 2nd = 33/33/33, 3rd = 100% saint. Guaranteed positive ending |
| **"Cast Again" button** | Non-saint results show red "Cast Again", saint shows gold "Continue" |
| **Throw count tracking** | `beatpetty_divination_throws` in localStorage, displayed on completion page |
| **Completion page rewrite** | Rich 聖杯 interpretation + traditional context + 八部曲 ritual summary + throw count narrative |
| **Step 6 progress indicator** | Shows "3 / 7" tap progress during purification |
| **Step 7 status hint** | "Receiving the blessing..." pulse text, fades when title appears at 3s |
| **CurseCertificate fix** | Enemy category now translates `toxicBoss` → "The Toxic Boss" via i18n lookup |
| **3-locale messages updated** | EN / zh-TW / zh-Hans all synced with new keys |

### Key Architecture Decisions

- **Flow split**: Steps 1-5 free (毀滅), Steps 6-8 paid $4.99 (收尾). Paywall at step 5→6.
- **封印 deleted**: Not traditional. BurningStep is natural free endpoint.
- **PlanType keys**: `'name' | 'seal' | 'full'` — `'seal'` is legacy naming, kept for Stripe compatibility
- **State machine**: 10 states, 10 actions in RitualProvider (useReducer)
- **Results on separate pages**: `/result` (free/paid reading), `/completion` (paid ritual finish)
- **No accounts**: localStorage + Stripe Session ID
- **Paid divination**: 3-throw mechanic, guaranteed 聖杯. Paid = always positive ending.

### Files to Read First

| File | Purpose |
|------|---------|
| `docs/ARCHITECTURE.md` | Full tech architecture (read instead of scanning codebase) |
| `docs/ritual-process-hk.md` | Traditional 8-step reference |
| `docs/BLOG_SEO_STANDARD.md` | Blog writing standards |
| `docs/blog-seo-master.md` | SEO strategy + keyword planning |
| `docs/FUTURE_ROADMAP.md` | Phase 2/3 roadmap |

### Known Technical Debt

- `'seal'` plan key name is legacy but kept for Stripe price ID compatibility
- FirePassTransition PNG background flash on first load (low priority)
- OG image alt text is English-only
- PWA is manifest-only (no service worker)
- No error boundary around Canvas
- Completion page hydration mismatch (localStorage SSR vs client — pre-existing, non-blocking)

---

## Next: Deploy UX Polish to Production

1. Test full $4.99 flow locally (Steps 1-8 + completion page)
2. `npx vercel --prod --yes`
3. Verify on beatpetty.com

---

## Next: Stripe Sandbox Testing

**Pending**: Test all 3 payment paths ($2.99 / $4.99 / $6.99) in Stripe test mode.

Steps needed:
1. Allen gets Stripe test mode keys + price IDs from Dashboard
2. Create `.env.local` with test keys
3. Run `npm run dev` and test with card `4242 4242 4242 4242`
4. Verify all 4 flows work end-to-end

---

## Next: Phase 2 — Growth

Priority order:
1. **Viral Share Engine** — Share cards after payment, turn payers into free traffic source
2. **Email 7-day hook** — Optional email input, "curse status" reminder after 7 days
3. **More blog content** — Continue SEO content攻势

Full roadmap: `docs/FUTURE_ROADMAP.md`
