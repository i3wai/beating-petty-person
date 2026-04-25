# BeatPetty — Current Process State

> **Every new session: read this file first. Every session end: update this file.**
> Last updated: 2026-04-25

---

## Status: Soft Launch — All Systems Live

**URL**: beatpetty.com | **Deploy**: `npx vercel --prod --yes` | **Branch**: master

### What's Built

- **Ritual Flow**: 8-step 八部曲, free (1-5) + paid (6-8)
- **Payment**: 4 paths (Free / $2.99 Reading / $4.99 Completion / $6.99 Full), Stripe Checkout
- **Content**: Curse reading (~945 combos) + Oracle guidance (54 fragments) + Curse certificate
- **Blog**: 9 EN + 11 zh-TW + 11 zh-Hans articles, all with AI images, deployed
- **Share System**: Share cards (JPEG, native share with image on mobile) across WhatsApp/X/IG/TikTok
- **Audio**: 13 synthesized sounds (Web Audio API, no MP3) + LFO modulation
- **Video**: Hero animated video (desktop 30s seamless + mobile 15s) + landing suspense audio
- **AI Images**: 7 atmospheric backgrounds + 8 UI element images (poe blocks, stamps, talisman, etc.)
- **i18n**: EN + zh-TW + zh-Hans, culturally accurate (not direct translations)
- **SEO**: JSON-LD, hreflang, sitemap, 301 redirects, Lighthouse 90+

### Known Technical Debt

- `'seal'` plan key name is legacy but kept for Stripe compatibility
- FirePassTransition PNG background flash on first load (low priority)
- OG image alt text is English-only
- PWA is manifest-only (no service worker)
- No error boundary around Canvas

---

## Next: Phase 2 — Growth

Priority order:
1. **Email 7-day hook** — Optional email input, "curse status" reminder after 7 days
2. **More blog content** — Continue SEO content expansion
3. **TikTok/X content** — Organic social media

Full roadmap: `docs/FUTURE_ROADMAP.md`

---

## Session Log

*(Pre-2026-04-25 history archived. Key milestones: Soft launch 2026-04-20, Stripe live 2026-04-22, Share system 2026-04-22, Steps 6-8 UX overhaul 2026-04-24, Hero video + audio 2026-04-24)*
