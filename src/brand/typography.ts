// ============================================================================
// Al-Ameen · Brand Typography Service
// ----------------------------------------------------------------------------
// Single source of truth for every font family used across the app.
//   · display  — ceremonial headlines (hero titles, section titles, greetings)
//   · sans     — body / UI (buttons, form labels, nav links, paragraphs)
//   · arabic   — Always-Arabic counterpart rendered *alongside* an EN primary
//                (rare — mostly inside the <BrandLogo /> when a wordmark pair
//                 shows both scripts simultaneously). When the UI is fully in
//                AR, use `sans`/`display` — they already resolve to the
//                Arabic families via isAr.
//   · mono     — metadata, IDs, timestamps, classification labels, eyebrows
//
// Anywhere you'd otherwise inline `'Cormorant Garamond', Georgia, serif`
// you should call `useBrandFonts()` (inside a component) or `getBrandFont()`
// (outside React) and read the role you need.
// ============================================================================

import { useEffect, useState } from "react";
import i18n from "@/i18n";

// ── Raw family stacks ────────────────────────────────────────────────────────
// Arabic family locked to Cairo per brand decision 17-Apr-2026
// (`al-ameen-brand/arabic-font-options.html` Option C).
// Cairo reads clean, modern, and pairs well with Cormorant Garamond's
// ceremonial English serif.
export const BRAND_FONTS = {
  // Display — ceremonial headlines
  display: {
    en: "'Cormorant Garamond', Georgia, serif",
    ar: "'Cairo', 'Tajawal', 'IBM Plex Sans Arabic', sans-serif",
  },
  // Body / UI
  sans: {
    en: "'Inter', ui-sans-serif, system-ui, sans-serif",
    ar: "'Cairo', 'Tajawal', 'IBM Plex Sans Arabic', sans-serif",
  },
  // Always-Arabic counterpart (when rendered alongside an EN primary —
  // rare, mostly inside <BrandLogo /> when both wordmarks show together)
  arabic: "'Cairo', 'Tajawal', 'IBM Plex Sans Arabic', sans-serif",
  // Monospace — tech / audit metadata
  mono: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
} as const;

export type BrandFontRole = "display" | "sans" | "arabic" | "mono";

// ── Imperative helper — safe to call outside React ──────────────────────────
export const getBrandFont = (role: BrandFontRole, isAr: boolean): string => {
  switch (role) {
    case "display":
      return isAr ? BRAND_FONTS.display.ar : BRAND_FONTS.display.en;
    case "sans":
      return isAr ? BRAND_FONTS.sans.ar : BRAND_FONTS.sans.en;
    case "arabic":
      return BRAND_FONTS.arabic;
    case "mono":
      return BRAND_FONTS.mono;
  }
};

// ── React hook — tolerates being called outside the DashboardLayout outlet ──
//
//   Inside a dashboard route the outlet context already exposes `isAr`, but
//   this hook must also work on the public landing page, login, and 404 —
//   none of which live under the DashboardLayout outlet. So we read directly
//   from i18n.language and subscribe to language changes.
//
export interface BrandFonts {
  display: string;
  sans: string;
  arabic: string;
  mono: string;
  isAr: boolean;
}

export const useBrandFonts = (): BrandFonts => {
  const [lang, setLang] = useState<string>(i18n.language || "en");

  useEffect(() => {
    const handler = (next: string) => setLang(next);
    i18n.on("languageChanged", handler);
    return () => {
      i18n.off("languageChanged", handler);
    };
  }, []);

  const isAr = lang === "ar";

  return {
    display: getBrandFont("display", isAr),
    sans: getBrandFont("sans", isAr),
    arabic: BRAND_FONTS.arabic,
    mono: BRAND_FONTS.mono,
    isAr,
  };
};
