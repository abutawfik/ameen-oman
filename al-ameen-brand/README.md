# Al-Ameen · Brand &amp; Design System · v1.0

**الأمين — The Nation's Trusted Guardian**

A unified visual, verbal, and interaction language for Al-Ameen — the National Intelligence Platform operated by border authorities and built on the SITA Borders MEA portfolio.

---

## What's in this bundle

```
al-ameen-brand/
├── Al-Ameen-Brand-Guidelines.pdf      Brand book — stakeholder-ready, 14 pages A4
├── style-guide.html                    Interactive style guide — open in any browser
├── logo/
│   ├── al-ameen-primary-horizontal.svg   Horizontal lockup (mark + wordmark)
│   ├── al-ameen-primary-stacked.svg      Stacked lockup (for posters, covers)
│   ├── al-ameen-mark.svg                 Mark only, full color
│   ├── al-ameen-mark-mono-light.svg      Mark only, monochrome light (dark canvas)
│   ├── al-ameen-mark-mono-dark.svg       Mark only, monochrome dark (light canvas)
│   └── al-ameen-favicon.svg              Favicon / app icon (32 px optimized)
├── tokens/
│   ├── tokens.css                        CSS variables — drop into global.css
│   ├── tailwind.config.js                Tailwind config — merge with project config
│   └── tokens.json                       DTCG-format tokens (Style Dictionary / Figma)
└── README.md                             This file
```

---

## Quick start for the `localhost:3021` React app

### 1 · Install fonts

Add to `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Readex+Pro:wght@400;500;600;700&display=swap">
```

### 2 · Wire up tokens

**Option A — CSS variables (framework-agnostic):**

```css
/* src/styles/global.css */
@import "./al-ameen-brand/tokens/tokens.css";

body {
  background: var(--alm-bg-canvas);
  color: var(--alm-fg-primary);
  font-family: var(--alm-font-sans);
}
```

**Option B — Tailwind (recommended):**

```js
// tailwind.config.js
const alAmeenTokens = require('./al-ameen-brand/tokens/tailwind.config.js');

module.exports = {
  ...alAmeenTokens,
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
};
```

### 3 · Replace the favicon

```html
<link rel="icon" type="image/svg+xml" href="/al-ameen-brand/logo/al-ameen-favicon.svg">
```

### 4 · Use the logo

```jsx
// Top nav — horizontal lockup
import Logo from './al-ameen-brand/logo/al-ameen-primary-horizontal.svg';

<img src={Logo} alt="Al-Ameen" className="h-10" />

// Portal login hero — stacked lockup, on dark
import LogoStacked from './al-ameen-brand/logo/al-ameen-primary-stacked.svg';
```

---

## Using tokens in React

```jsx
// Primary action
<button className="bg-oman-600 hover:bg-oman-700 text-ivory-100
                   px-4 py-2.5 rounded-md font-medium text-sm
                   transition-all duration-fast ease-std">
  Adjudicate ETA
</button>

// Risk tier chip
<span className="inline-flex items-center gap-1.5 px-3 py-1
                 rounded-full text-xs font-semibold
                 bg-risk-high/10 text-risk-high">
  ● High · 78
</span>

// Hero title (bilingual)
<h1 className="font-display text-6xl font-medium tracking-tight">
  Al-Ameen
</h1>
<span className="font-arabic text-3xl text-oman-600">الأمين</span>

// Stream card with category rail
<article className="relative bg-ivory-000 border border-ivory-300
                    rounded-lg p-5 before:absolute before:inset-y-0
                    before:left-0 before:w-0.5 before:bg-cat-core">
  <span className="text-xs font-semibold uppercase tracking-wider text-cat-core">
    Core Intelligence
  </span>
  <h3 className="font-display text-lg font-medium">Hotel Intelligence</h3>
  <p className="font-arabic text-xs text-midnight-300 direction-rtl">
    الاستخبارات الفندقية
  </p>
</article>

// Executive card (ceremonial, gold glow)
<article className="bg-gradient-to-b from-midnight-700 to-midnight-900
                    text-ivory-100 border border-gold-700
                    rounded-lg p-6 shadow-gold">
  …
</article>
```

---

## Key decisions baked in

| Decision | Rationale |
|---|---|
| Name kept as **Al-Ameen** | Strong equity, already in URL/UI, meaning ("the trustworthy") is precisely on-brief. |
| Palette pivot from cyan to **Oman red + gold + navy + ivory** | Current SOC-aesthetic cyan reads generic-tech; sovereign palette reads national + ceremonial. |
| **Frankincense Gold** reserved for ceremonial | Over-use destroys its signal; use only for IG/ministry surfaces and the explainability highlight. |
| **5-tier risk model** with semantic colors | Matches the Oman Risk Engine tech spec. Clear / Low / Elevated / High / Critical. |
| **12 category hues** for streams | Preserves the useful multi-color semantics already in the build; formalizes naming. |
| **Bilingual equality** | Arabic and English are peers — never Arabic-as-translation. Typography scale maintains both. |
| **Explainability as visual primary** | The signal-contribution breakdown is the hero component, not a side panel. |

---

## Page mockups included

The `style-guide.html` contains full mockups of:

1. **Public Landing** — the `/` route, refreshed hero + streams grid.
2. **Portal Login** — split-canvas, sovereign left + focused form right.
3. **Operator Dashboard** — three-pane queue + active case + feed health.
4. **Risk Case Detail** — full explainability view with contribution breakdown, lineage trace, and decision actions.

These map directly onto the routes currently unbuilt at `/portal`, `/streams/*`, etc.

---

## What v1.0 does NOT include (roadmap → v1.1)

- React component library (shadcn-based, tokens-wired) — scheduled for next sprint
- Figma library with auto-layout components — scheduled alongside PoC demo build
- Custom icon set for the 16 streams (currently uses placeholder glyphs in guide)
- Motion spec (per-component timing and easing curves)
- Print identity (letterhead, report covers, deck template)

---

## Governance

This brand system is custodianed by the **SITA Borders MEA Portfolio Director**. All external applications — IG briefings, ministry-facing decks, public-web pages — require review prior to release. Deviations in code are acceptable during PoC; production applications must align with v1.0 tokens.

For updates or exceptions, open a brand-review issue with the proposed deviation, the rationale, and the surface affected.

---

**v1.0 · 17 April 2026 · Prepared by Alaa Fada, Portfolio Director — Borders MEA**
