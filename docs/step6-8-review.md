# Steps 6-8 Quality Review (2026-04-20)

> Paid tier ($4.99/$6.99) — must be near-perfect. Two specialist agents reviewed, coordinator synthesized.

---

## UX/Creative Review (Agent A)

### P0 — Critical

**P0-1: Step 7 is completely passive — 3 seconds of nothing.**
Zero user interaction. User stares at a background image fading in for 3s then auto-advances. Compared to free steps (canvas particles, rage meter, long-press ignition, 9s burn), this feels like a loading screen.
- Suggested fix: Add tap-to-offer interaction (3-5 taps to drop gold ingots with particle bursts) or extend to 5-6s with ascending gold particle system.

**P0-2: Total paid experience lasts ~8-11 seconds.**
Step 6 = 3s, Step 7 = 3s, Step 8 = ~5s. Free steps take 60-90s. Paid is 1/8th the duration. At $4.99 that's ~$0.50/sec.
- Suggested fix: Each step needs minimum 5-8s meaningful content. Raise Step 6 taps to 5-7, extend Step 7 with interaction, extend Step 8 result display.

**P0-3: Step 8 spin/land phases show only "..." text.**
Literally three dots for 3 seconds. Looks broken, not atmospheric.
- Suggested fix: Use distinct i18n strings like "The blocks fall through the air..." / "Reading the divine answer..." for each phase.

### P1 — Important

**P1-1: Step 6 particles are simplistic DOM divs vs free steps' Canvas particle system.**
Visual regression from free to paid is stark.
- Suggested fix: Use existing Canvas ParticleSystem with new ParticleType.ScatterRice.

**P1-2: Step 7 has zero dynamic elements — no particles, no canvas, no responsive feedback.**
CSS opacity animations only. Should have ascending gold sparks, floating 元寶 silhouettes.
- Suggested fix: Add Canvas gold particles and CSS floating ingots.

**P1-3: Step 8 "anger" result (5% chance) says "ritual disrupted, try again" but auto-navigates to completion with no retry.**
1 in 20 paying users told their ritual failed, then forced to results page.
- Suggested fix: Either remove anger outcome (85/15 saint/laugh split), or add retry button, or soften text.

**P1-4: No escalation across steps 6→7→8.**
Each step starts/ends independently with same fade-in. No accumulating effects, no callback to enemy name, no musical build.
- Suggested fix: Add transition audio between steps, accumulate visual elements, callback to enemy name.

**P1-5: English i18n text is generic vs dark-cinematic landing page tone.**
"Blessings & Fortune" / "May fortune find its way to you" reads like a greeting card, not "Strike the paper effigy. Release your fury."
- Suggested fix: Rewrite to match established dark-cinematic tone.

### P2 — Polish

- **P2-1**: Step 6 tap counter (3/3) feels gamey — replace with atmospheric indicator
- **P2-2**: Step 8 button is bright gold bg — too standard-CTA, should be darker/atmospheric
- **P2-3**: Reduced-motion Step 8 shows static poe blocks for 600ms — should skip to result
- **P2-4**: Inconsistent overlay techniques across steps (inline style vs Tailwind, different opacity)
- **P2-5**: localStorage write has try/catch but read on /completion may not

---

## Technical Review (Agent B)

*Pending — agent did not deliver full report before shutdown. To be re-run in next session.*

---

## Coordinator Synthesis (Elon / CC)

### Agreed Priorities

| Priority | Issue | Fix Direction |
|----------|-------|---------------|
| **P0** | Total duration 8-11s → need 25-30s minimum | Each step 2x longer, more content |
| **P0** | Step 7 passive with no tension | 6-8s cinematic visual + ascending gold particles + slow zoom on AI bg |
| **P1** | "..." placeholder text in Step 8 | Replace with meaningful i18n strings per phase |
| **P1** | English text too soft/generic | Rewrite to match dark-cinematic tone |
| **P1** | Anger result framing is harsh | Reframe as "deity responds differently", NOT "ritual failed" |
| **P2** | Tap counter feels gamey | Replace with atmospheric warmth indicator |
| **P2** | DOM particles vs Canvas | Low priority — perceptual difference is small for 3-5s step |

### Disagreements with UX Review

1. **P0-3 is P1, not P0.** "..." looks unpolished but doesn't make paid users feel cheated. It's atmospheric loading, not a functional defect. Downgraded.

2. **P1-1 (DOM→Canvas upgrade) is over-engineering.** Step 6 particles serve 3-5s of tap feedback. Canvas rewrite adds complexity without meaningful perceptual improvement. Low priority.

3. **"Add interaction to everything" is wrong for ritual pacing.** 祈福 (Step 7) is traditionally about *receiving*, not *doing*. The fix should make passive viewing cinematic (slow zoom, particles, sound layering), not force tap mechanics.

4. **Anger result should NOT get a retry button.** That's gamification, not ritual. Fix the text framing — 怒杯 means the deity has a different response, not "you failed."

### Not Yet Reviewed

- Technical/code review (bugs, edge cases, accessibility, i18n completeness)
- Cross-step state management correctness
- CSS consistency audit

---

## Action Items (To Fix)

- [ ] Extend Step 6 duration (increase min taps or add pre-scatter phase)
- [ ] Redesign Step 7 as 6-8s cinematic experience (slow zoom + gold particles ascending + sound layers)
- [ ] Replace "..." in Step 8 with meaningful per-phase i18n strings
- [ ] Rewrite EN/zh-TW/zh-Hans text for steps 6-8 to match dark-cinematic tone
- [ ] Reframe anger result text across 3 languages
- [ ] Replace tap counter (3/3) with atmospheric indicator
- [ ] Complete technical review (separate session)
