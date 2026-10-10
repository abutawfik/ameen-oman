# Al-Ameen — Brand system
Approved direction · 10 October 2026 · Brand edition 2

## Identity
Arabic leads: **الأمين**. English supports: **AL-AMEEN**. The gold protective brackets surround an angular A and central diamond, expressing guardianship and unified intelligence. The English wordmark retains the custom gold triangle in its first A. This hierarchy stays the same in English and Arabic interfaces; only surrounding UI changes direction.

English tagline: **The Nation’s Trusted Guardian**.
Arabic tagline: **الحارس الأمين للوطن**.
Tone: assured, precise, restrained, modern, accountable. Avoid militaristic ornament, decorative circuits, exaggerated security claims and ceremonial serif lettering.

## Logo assets and usage
- `logos/approved-brand-board.png`: approved visual master and composition reference.
- `logos/al-ameen-lockup-navy.png`: Arabic-first lockup for dark website surfaces.
- `logos/al-ameen-lockup-ivory.png`: lockup for light document and website surfaces.
- `logos/al-ameen-emblem-navy.png`: compact mark for collapsed navigation, favicon and app icon.
- Hero and footer use the navy lockup with a live, accessible tagline below.

Logo lettering is custom artwork; **it is not an identified commercial font**. Preserve the artwork rather than typing the logo in Manrope or Cairo. These font families are the surrounding site typography, not an exact recreation of the logo.

These implementation assets are PNGs with navy or ivory backgrounds. Transparency exports were rejected for rough edges. Transparent/vector masters are not included and must be professionally traced from the approved master for print or arbitrary-color placement. Do not wrap a PNG in SVG and describe it as a vector logo.

Clear space: at least 25% of emblem width on each side; hero at least 40px desktop / 24px mobile. Never distort, mirror, rotate, recolor arbitrarily, or separate Arabic dots. Keep emblem left of lettering even in RTL. Do not flip the English wordmark. Avoid adding a second emblem above the combined logo.

Recommended digital sizes: header 180–210px wide; mobile header 170–185px; hero clamp(280px, 68vw, 640px); footer 240–280px; standalone icon 24–40px. At small sizes omit the tagline. Use the emblem below 140px lockup width. Respect the actual image ratio; height auto. Provide alt text “Al-Ameen — الأمين”; decorative duplicates have empty alt.

## Colors
| Role | Hex | Use |
|---|---|---|
| Midnight | #071426 | Base, header, hero, dark logo background |
| Deep ink | #030A14 | Footer, deepest canvas |
| Raised navy | #0D2138 | Panels and inputs |
| Navy hover | #15314D | Hover surfaces |
| Guardian gold | #C5A365 | Emblem, highlights, primary action fill |
| Gold hover | #D6B77E | Primary action hover |
| Ivory | #F8F5F0 | Main text on dark; light logo background |
| Muted text | #AAB8C7 | Secondary text on dark |
| Border | #294059 | Dividers / form outlines |
| Burgundy | #8A1F3C | Restrained existing portal accent |
| Success | #62C69B | Positive status |
| Warning | #E2B65A | Attention required |
| Danger | #EF8791 | Risk/error text on dark |
| Focus | #9EC7ED | Keyboard focus outline |

Use gold sparingly (roughly 10% of a view) and never as the sole indicator of status. Gold-filled buttons use Midnight text. Small gold text is intended for Midnight backgrounds, not Ivory. Light surfaces use Midnight text. Semantic risk colors retain their meanings and accessible labels. Keep text contrast at least 4.5:1 for normal text and 3:1 for large text; visible controls and focus indicators at least 3:1 against adjacent colors. Existing charts retain categorical distinctions.

## Typography
| Role | Family | Weights | Usage |
|---|---|---|---|
| English display / UI | Manrope | 400, 500, 600, 700, 800 | Headings, body, navigation, forms |
| Arabic display / UI | Cairo | 400, 500, 600, 700, 800 | Arabic headings, body and controls |
| Data / metadata | JetBrains Mono | 400, 500, 600 | IDs, version, timestamps, technical values |

Font files and their Open Font License are bundled in `fonts/`. Self-host them; no Google Fonts request is required at runtime. Sources: [Manrope](https://github.com/google/fonts/tree/main/ofl/manrope), [Cairo](https://github.com/google/fonts/tree/main/ofl/cairo), [JetBrains Mono](https://github.com/google/fonts/tree/main/ofl/jetbrainsmono).

Display 48–64px desktop / 32–40px mobile, weight 800, line-height 1.15 EN / 1.45 AR. H1 40/48, H2 32/40, H3 24/32, body 16/26, supporting 14/22, label 13/20, metadata 12/18. Arabic has more vertical space and no letter spacing. English headings -0.02em; body normal; uppercase eyebrows 0.1em. Avoid all-caps long sentences. Tagline is upright sans-serif, not italic. Keep body lines under 70 characters. Preserve tabular numerals for data.

## Website styling
8px spacing foundation with 4px fine adjustment. Section spacing 80–112px desktop / 48–64px mobile; content width 1200–1400px. Header height 72px. Keep generous space around the hero logo and remove competing decorative marks. Maintain existing sections, routes and user flows.

Buttons: 40–44px minimum height, 16–20px horizontal padding, radius 6px, weight 700. Primary gold on navy text; secondary transparent with border; destructive uses semantic red and a clear label. Inputs: 44px high, raised navy, border #294059, ivory text. Focus: 2px #9EC7ED with 3px offset. Cards: radius 10px, 1px border, very subtle elevation; avoid nested cards and gratuitous gradients. Tables: compact rows 44–52px with subtle separators, clear heading hierarchy, aligned numeric columns.

Icon family: keep existing Remix Icon line set; 20px navigation / 16px metadata / 24px feature icons. Use consistent stroke and baseline. Do not override icon fonts through global font-family selectors.

Hero: Midnight canvas, very faint grid only outside the logo region if retained. Arabic-first combined lockup, then a readable English tagline and Arabic tagline. Login, reset-password, header, titlebar and footer use the shared BrandLogo asset component.

Motion: 150–200ms controls, 250ms panel transitions. Respect prefers-reduced-motion; no perpetual pulsing required for a static logo. RTL: mirror UI spacing/navigation with logical properties; keep logo artwork unmirrored and numerical IDs LTR.

## Rollout and acceptance
Replace the old shield and serif wordmark everywhere the live shared brand appears. Retain existing product copy, authentication, routing, data and permissions. Keep any historical brand comparison page explicitly labeled as historical rather than silently pretending old examples are current.

Inspect 390px mobile and desktop in English and Arabic; no clipping or horizontal overflow. Verify menu, language switch, login link, shared auth logo, footer and collapsed sidebar. Run the existing type check/build. Update version.json through the existing bump tool: this visual enhancement is a MINOR release; CI remains responsible for BUILD. Do not deploy or commit without an explicit request.

Dashboard placement: show one logo in the top bar. The sidebar starts with user information, without a second logo. Compact top-bar lockups use a 58px-high clipped container to trim empty export padding and prevent background overhang.
