# Al-Ameen · Brand &amp; Design System · v1.1 · Majlis Azure

**الأمين — الحارس الأمين للوطن**
**The Nation's Trusted Guardian**

A unified visual, verbal, and interaction language for Al-Ameen — the National Intelligence Platform operated by border authorities and built on the SITA Borders MEA portfolio.

---

## What's in this bundle

```
al-ameen-brand/
├── Al-Ameen-Brand-Guidelines.pdf      Brand book — stakeholder-ready, 13 pages A4
├── style-guide.html                    Interactive style guide — open in any browser
├── palette-options.html                Decision artifact — the 3 palettes compared (for reference)
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

## Palette · Majlis Azure at a glance

| Role | Color | Hex |
|---|---|---|
| Canvas · dark (shell) | Ocean 800 | `#051428` |
| Canvas · dark (card) | Ocean 700 | `#0A2540` |
| Canvas · light | Alabaster 200 | `#F8F5F0` |
| Primary action | Ocean 700 | `#0A2540` |
| Ceremonial accent | Brass 600 | `#B88A3C` |
| Alert / high risk | Rose 400 | `#C94A5E` |
| Critical risk / destructive | Rose 600 | `#8A1F3C` |
| Success / clear | Sea-teal | `#14786A` |

Four typefaces: **Cormorant Garamond** (display), **Inter** (interface), **Cairo** (Arabic — treated as an equal peer to Latin), **JetBrains Mono** (data).

---

## Quick start for the `localhost:3021` React app

### 1 · Install fonts

Add to `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Cairo:wght@400;500;600;700&display=swap">
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
// Primary action (ocean blue, sovereign)
<button className="bg-ocean-700 hover:bg-ocean-600 text-alabaster-100
                   px-4 py-2.5 rounded-md font-medium text-sm
                   transition-all duration-fast ease-std">
  Adjudicate ETA
</button>

// Ceremonial action (brass glow — IG / exec surfaces only)
<button className="bg-brass-600 hover:bg-brass-500 text-ocean-800
                   px-4 py-2.5 rounded-md font-medium text-sm shadow-brass">
  ✦ Seal &amp; sign
</button>

// Destructive (persian rose)
<button className="bg-rose-400 hover:bg-rose-500 text-alabaster-100
                   px-4 py-2.5 rounded-md font-medium text-sm">
  Deny ETA
</button>

// Risk tier chip · HIGH
<span className="inline-flex items-center gap-1.5 px-3 py-1
                 rounded-full text-xs font-semibold
                 bg-rose-400/10 text-rose-400">
  ● High · 78
</span>

// Hero — bilingual with Arabic slogan as first-class element
<section className="bg-ocean-800 text-alabaster-100 py-24 text-center">
  <h1 className="font-display text-7xl font-medium tracking-tight">
    Al-Ameen
  </h1>
  <div className="font-arabic text-4xl text-brass-400 mt-3">الأمين</div>

  {/* Arabic slogan — not a translation, a peer */}
  <div className="font-arabic text-3xl text-alabaster-100 mt-6"
       dir="rtl" style={{fontFeatureSettings: '"ss01"'}}>
    الحارس الأمين للوطن
  </div>

  {/* English as secondary caption with thin brass rules */}
  <div className="flex items-center justify-center gap-4 mt-3 opacity-80">
    <span className="h-px w-12 bg-gradient-to-r from-transparent to-brass-500"></span>
    <em className="font-display italic text-lg text-alabaster-200">
      The Nation's Trusted Guardian
    </em>
    <span className="h-px w-12 bg-gradient-to-r from-brass-500 to-transparent"></span>
  </div>
</section>

// Stream card with category rail
<article className="relative bg-alabaster-50 border border-alabaster-300
                    rounded-lg p-5 before:absolute before:inset-y-0
                    before:left-0 before:w-0.5 before:bg-cat-core">
  <span className="text-xs font-semibold uppercase tracking-wider text-cat-core">
    Core Intelligence
  </span>
  <h3 className="font-display text-lg font-medium">Hotel Intelligence</h3>
  <p className="font-arabic text-xs text-ocean-300" dir="rtl">
    الاستخبارات الفندقية
  </p>
</article>
```

---

## Arabic slogan treatment — important

The Arabic slogan **الحارس الأمين للوطن** is now elevated to a first-class hero element — not a translation of the English line, but a peer. Recommended treatment on the live site:

- **Size:** 1.5× the English tagline (≈ `text-3xl` where English is `text-lg`)
- **Position:** Between the Arabic wordmark (الأمين) and the English italic tagline
- **Color:** Alabaster on dark / Ocean on light (same contrast weight as the English tagline)
- **Font:** Cairo, weight 500, `dir="rtl"`, line-height 1.3
- **No flourishes on the Arabic:** The brass rules flank the English line only — the Arabic stands on its own strength.

This follows the Arabic-as-peer rule in the voice guide: Arabic is never a subtitle in ROP-facing materials.

---

## Key decisions baked in

| Decision | Rationale |
|---|---|
| Name kept as **Al-Ameen (الأمين)** | Strong equity, already in URL/UI, meaning ("the trustworthy") is precisely on-brief. |
| Palette: **Majlis Azure** (ocean + brass + persian rose + alabaster) | Diplomatic over military. Reads as "ministry of foreign affairs / sovereign wealth" rather than "interior police." Exportable across the MEA portfolio. |
| **Brass** replaces gold for ceremonial | Close tonally to frankincense gold but cooler and more institutional — pairs properly with ocean. |
| **Persian Rose** replaces Oman red | Still warm and serious for critical/destructive, without the "alarm-system" feel of full oman red. |
| **Deep ocean** is primary action color | Dark-on-light primary buttons read as sovereign, not commercial. |
| **5-tier risk model** with semantic colors | Matches the Oman Risk Engine tech spec. Clear / Low / Elevated / High / Critical. |
| **12 category hues** for streams | Preserves the useful multi-color semantics already in the build; formalizes naming. |
| **Bilingual equality** — Arabic slogan is first-class | Never Arabic-as-translation. Slogan gets its own hero row, sized with intent. |
| **Explainability as visual primary** | The signal-contribution breakdown is the hero component, not a side panel. |

---

## Page mockups included

The `style-guide.html` contains full mockups of:

1. **Public Landing** — the `/` route, with the Arabic slogan promoted into the hero block.
2. **Portal Login** — split-canvas, sovereign left + focused form right.
3. **Operator Dashboard** — three-pane queue + active case + feed health.
4. **Risk Case Detail** — full explainability view with contribution breakdown, lineage trace, and decision actions.

These map directly onto the routes currently unbuilt at `/portal`, `/streams/*`, etc.

---

## What v1.1 does NOT include (roadmap → v1.2)

- React component library (shadcn-based, tokens-wired) — scheduled for next sprint
- Figma library with auto-layout components — scheduled alongside PoC demo build
- Custom icon set for the 16 streams (currently uses placeholder glyphs in guide)
- Motion spec (per-component timing and easing curves)
- Print identity (letterhead, report covers, deck template)
- Arabic typography refinements (ligature tables, tatweel usage rules)

---

## Version history

| Version | Date | Change |
|---|---|---|
| v1.0 | 17 Apr 2026 | First release · Oman Sovereign palette (deep midnight + oman red + gold + ivory) |
| **v1.1** | **17 Apr 2026** | **Majlis Azure palette adopted · Arabic slogan promoted to first-class hero element** |

---

## Governance

This brand system is custodianed by the **SITA Borders MEA Portfolio Director**. All external applications — IG briefings, ministry-facing decks, public-web pages — require review prior to release. Deviations in code are acceptable during PoC; production applications must align with v1.1 tokens.

For updates or exceptions, open a brand-review issue with the proposed deviation, the rationale, and the surface affected.

---

**v1.1 · 17 April 2026 · Prepared by Alaa Fada, Portfolio Director — Borders MEA**
