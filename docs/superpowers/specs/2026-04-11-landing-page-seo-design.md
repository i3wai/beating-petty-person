# Landing Page SEO Optimization — Design Spec

**Date**: 2026-04-11
**Scope**: English Landing Page only (messages/en.json)
**Constraints**: No structural changes — only copy and meta edits

---

## 1. Keyword Allocation

### Landing Page owns (transactional intent — "do it now")

| Keyword | Est. Vol/mo | KD | Placement |
|---------|------------|-----|-----------|
| "online curse ritual" | ~30 | ~10 | meta title, H1 |
| "curse someone online" | 20 | 0 | meta description, body |
| "free curse ritual" | ~20 | ~5 | meta description, body |
| "curse your enemy" | 50 | 17 | body (What Is section) |
| "ancient curse ritual" | ~50 | ~15 | body (hero subtitle) |
| "beat petty person" | 20 | 12 | body (hero subtitle, trust) |
| "Da Siu Yan" | ~50 | ~5 | body (hero subtitle, What Is) |
| "paper effigy" | ~20 | ~10 | body (What Is, How It Works) |

### Reserved for other pages — DO NOT USE on Landing Page

| Keyword | Owned by | Vol/mo |
|---------|----------|--------|
| "how to curse someone" | /how-it-works | 1,300 |
| "how to hex someone" | /how-it-works | 880 |
| "how to put a curse on someone" | /how-it-works | 1,300 |
| "Chinese curse ritual" | /how-it-works | ~200 |
| "curse ritual online" | /how-it-works | ~30 |
| "what is beating petty person" | /what-is | ~50 |
| "villain hitting" | /what-is | ~100 |
| "black magic" | Blog (reserved) | 2,900+ |
| "revenge spell" | Blog (reserved) | 590 |
| "voodoo magic" | Blog (reserved) | 1,600 |

---

## 2. Changes to messages/en.json

### 2.1 meta.title

```
BEFORE: "BeatPetty — Ancient Chinese Curse Ritual | 打小人"
AFTER:  "Online Curse Ritual — Free Chinese Curse | BeatPetty"
```

Targets: "online curse ritual", "free", "Chinese curse". Brand name at end.

### 2.2 meta.description

```
BEFORE: "Experience 打小人, a 300-year-old Chinese curse ritual from Hong Kong. Strike paper effigies, burn your enemy's influence. The ancient art of cursing petty people — now online."
AFTER:  "Curse someone with an ancient Chinese ritual. Strike a paper effigy, burn your enemy's influence. Free online curse ritual — what if it works?"
```

Targets: "curse someone", "paper effigy", "free", "online curse ritual", "enemy".
CTA tone: "what if it works?" = "寧可信其有".

### 2.3 meta.ogTitle

```
BEFORE: "BeatPetty — The Ancient Chinese Curse Ritual"
AFTER:  "BeatPetty — Free Online Curse Ritual"
```

### 2.4 meta.ogDescription

```
BEFORE: "A 300-year-old curse ritual from the streets of Hong Kong. Strike. Burn. Seal. What if it works?"
AFTER:  "Curse your enemy with a 300-year-old Chinese ritual. Free online. What if it works?"
```

### 2.5 landing.hero.title

```
BEFORE: "The Ancient Curse Ritual They Don't Want You to Know About"
AFTER:  "Curse Someone With a 300-Year-Old Chinese Ritual"
```

Targets: "curse someone" in H1. Still dark/mysterious tone. Specific > vague.

### 2.6 landing.hero.subtitle

```
BEFORE: "打小人 — Da Siu Yan — \"Beating the Petty Person.\" A 300-year-old Chinese curse ritual from the streets of Hong Kong. Strike a paper effigy. Curse your enemy. Now it is in your hands."
AFTER:  "打小人 — Da Siu Yan — \"Beating the Petty Person.\" A 300-year-old Chinese curse ritual from the streets of Hong Kong. Strike a paper effigy. Curse your enemy online. Free. What if it works?"
```

Targets: "Da Siu Yan", "beat petty person", "paper effigy", "curse your enemy", "online", "free".
Replaces vague "Now it is in your hands" with keyword-rich CTA "Curse your enemy online. Free. What if it works?"

### 2.7 landing.whatIs.title

```
BEFORE: "What Is This?"
AFTER:  "What Is This Curse Ritual?"
```

Adds "curse ritual" to the section heading naturally.

### 2.8 landing.whatIs.description

```
BEFORE: "打小人 — Beating the Petty Person — is a 300-year-old curse ritual born on the streets of Hong Kong. Practitioners gather beneath bridges at the start of spring, striking paper effigies to curse those who wronged them. The ritual is real. The tradition is alive. The question is not whether it works — but whether you dare to try."
AFTER:  "打小人 — Beating the Petty Person — is a 300-year-old curse ritual born on the streets of Hong Kong. Practitioners gather beneath bridges at the start of spring, striking paper effigies to curse their enemies. For centuries, people have used this ritual to curse those who wronged them — striking paper figures, chanting, burning. The ritual is real. The tradition is alive. What if it works?"
```

Targets: "curse their enemies", "paper effigies", "curse those who wronged them", "ritual".
Replaces "whether you dare to try" with "What if it works?" for brand consistency.

### 2.9 landing.howItWorks.steps — minor keyword additions

Step 1 (Choose):
```
BEFORE: "Six types of petty persons. Identify yours."
AFTER:  "Six types of petty persons. Identify your enemy."
```

Step 2 (Strike):
```
BEFORE: "Beat the paper effigy. Release your fury."
AFTER:  "Beat the paper effigy. Each strike carries your curse."
```

Step 3 (Burn):
```
BEFORE: "Burn it to ash. The curse is sealed."
AFTER:  "Burn the paper effigy to ash. The curse is sealed."
```

Adds "enemy" and "curse" and "paper effigy" naturally into step descriptions.

### 2.10 landing.trust.line2

```
BEFORE: "Join thousands who have completed the ritual"
AFTER:  "Join thousands who have completed the curse ritual"
```

### 2.11 landing.finalCta.headline

```
BEFORE: "Your enemy still walks free."
AFTER:  "Your enemy still walks free. Curse them now."
```

### 2.12 NEW: landing.faq — FAQ section

Add a new `faq` section to `landing` namespace in en.json:

```json
"faq": {
  "title": "Questions About the Curse Ritual",
  "items": [
    {
      "question": "Can I really curse someone online?",
      "answer": "This is a digital version of 打小人 (Da Siu Yan), a 300-year-old curse ritual from Hong Kong. You choose an enemy type, strike a paper effigy, and burn it to ash. The ritual is free to perform. What if it works?"
    },
    {
      "question": "What is 打小人 (Da Siu Yan)?",
      "answer": "打小人 — literally 'beating the petty person' — is a Cantonese curse ritual where practitioners strike paper effigies to curse their enemies. Originating in Guangdong province and practiced at Hong Kong's Goose Neck Bridge, it is recognized as part of Hong Kong's intangible cultural heritage."
    },
    {
      "question": "Is the curse ritual free?",
      "answer": "The basic curse ritual is completely free. Choose an enemy, strike the paper effigy, burn it, and receive your result. Optional enhancements — naming a specific enemy or sealing the curse — are available for a small fee."
    },
    {
      "question": "What happens during the curse ritual?",
      "answer": "You choose your enemy from six types of petty persons. Then you strike a paper effigy for 30 seconds — each hit carries your curse. Finally, the effigy is burned to ash. The entire ritual takes about one minute."
    },
    {
      "question": "Does the curse ritual actually work?",
      "answer": "This is a traditional Chinese folk practice, not a scientific process. Whether it works depends on what you believe. The emotional release is real. The tradition is ancient. What if it works?"
    },
    {
      "question": "Can I curse a specific person by name?",
      "answer": "Yes. The enhanced ritual lets you speak your enemy's true name into the ceremony. The name appears on the paper effigy and burns with it. This makes the curse personal."
    }
  ]
}
```

FAQ keyword targets:
- "curse someone online" (Q1)
- "what is 打小人" (Q2)
- "free curse ritual" (Q3)
- "what happens during curse ritual" (Q4)
- "does curse work" (Q5)
- "curse specific person name" (Q6)

Note: Future implementation can add FAQ Schema (JSON-LD) for rich snippets. Not in scope for this change.

---

## 3. Fix: /what-is MDX keyword cannibalization

Remove "Chinese curse ritual" from `/content/en/what-is.mdx` frontmatter keywords.
This keyword belongs exclusively to `/how-it-works`.

```
BEFORE: keywords: ["what is beating petty person", "打小人", "Chinese folk curse", "villain hitting", "Da Siu Yan", "Chinese curse ritual"]
AFTER:  keywords: ["what is beating petty person", "打小人", "Chinese folk curse", "villain hitting", "Da Siu Yan"]
```

Same fix for zh-TW and zh-Hans versions.

---

## 4. layout.tsx keywords array

Add "online curse ritual", "curse someone online", "free curse ritual" to the shared keywords array:

```
keywords: [
  "打小人",
  "beat petty person",
  "online curse ritual",
  "curse someone online",
  "free curse ritual",
  "ancient Chinese curse",
  "curse ritual",
  "Chinese folk tradition",
  "Hong Kong ritual",
  ...
]
```

---

## 5. Out of Scope (future)

- FAQ Schema (JSON-LD structured data)
- Chinese (zh-TW, zh-Hans) landing page SEO
- Blog article content
- Internal linking optimization
- Image alt text audit
- /how-it-works, /what-is, /history content improvements

---

## 6. Files Changed

| File | Change Type |
|------|------------|
| `messages/en.json` | Copy updates (meta, hero, whatIs, howItWorks, trust, finalCta, new faq) |
| `content/en/what-is.mdx` | Remove "Chinese curse ritual" from keywords |
| `content/zh-TW/what-is.mdx` | Same fix |
| `content/zh-Hans/what-is.mdx` | Same fix |
| `src/app/[locale]/layout.tsx` | Add keywords to array |

---

## 7. Validation

After changes:
1. `npm run build` — must pass without errors
2. Verify meta title/description render correctly via browser dev tools
3. Verify FAQ section renders on landing page
4. Verify /what-is page still works after keyword removal
