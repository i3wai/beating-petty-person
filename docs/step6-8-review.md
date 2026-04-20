# Steps 6-8 Quality Review — ARCHIVED

> All action items addressed. See git history for implementation details.

## Issues Found → Fixed

| Priority | Issue | Fix |
|----------|-------|-----|
| P0 | Total paid duration 8-11s | Step 6: 3→10s, Step 7: 3→7.5s, Step 8: continue button. Total ~22-30s |
| P0 | Step 7 passive with no tension | Cinematic 3-phase: slow zoom + 18 gold sparks + enemy seal reveal |
| P1 | "..." placeholder in Step 8 | Replaced with i18n strings per phase |
| P1 | English text too soft | Dark-cinematic rewrite (3 languages) |
| P1 | Anger result = "ritual failed" | Reframed: "deity has spoken differently" |
| P1 | No transitions between paid steps | 500ms crossfade in RitualOrchestrator |
| P1 | No ambient audio in paid steps | Added ambient drone to BlessingStep |
| P1 | Enemy name showing internal ID | Fixed to use i18n display name |
| P2 | Tap counter (3/3) gamey | Replaced with atmospheric warmth ring |
| P2 | Cast button too bright | Changed to semi-transparent dark style |
| P2 | Reduced motion 1.3s plain text | Extended to ~11.6s with static backgrounds |
