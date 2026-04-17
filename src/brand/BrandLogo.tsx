// ============================================================================
// Al-Ameen · <BrandLogo />
// ----------------------------------------------------------------------------
// Composes the shipped shield mark (in three tones) with a two-script
// wordmark whose hierarchy flips based on the active language:
//
//   · EN mode → "Al-Ameen" primary (Cormorant Garamond), "الأمين" counterpart
//   · AR mode → "الأمين" primary (Cairo),                "Al-Ameen" counterpart
//
// The shipped brand bundle only includes the English-primary lockup as an
// SVG. Rather than author a new Arabic-primary SVG, we re-compose the mark
// + wordmark pair in HTML/CSS at runtime. This keeps the asset pipeline
// simple and guarantees perfect parity between the two language modes.
// ============================================================================

import type { CSSProperties } from "react";
import { useBrandFonts } from "./typography";

// ── Tokens — kept inline so the component has zero dependency on Tailwind. ──
const TOKENS = {
  ivory100: "#F5EFE3",
  ivory200: "#EFE7D3",
  gold400:  "#D4A84B",
  gold500:  "#C99C48",
  gold600:  "#B58E3C",
  midnight700: "#141D2E",
  midnight800: "#0B1220",
  omanRed600:  "#9A1F24",
} as const;

export type BrandLogoVariant = "horizontal" | "stacked" | "mark";
export type BrandLogoTone = "light" | "dark" | "full";
export type BrandLogoSize = "sm" | "md" | "lg";

export interface BrandLogoProps {
  variant?: BrandLogoVariant;
  tone?: BrandLogoTone;
  size?: BrandLogoSize;
  showTagline?: boolean;
  /** Override language detection. Default reads from useBrandFonts() (i18n). */
  isAr?: boolean;
  className?: string;
  style?: CSSProperties;
}

// ── Size presets (mark size in px + matched type scale) ─────────────────────
const SIZE = {
  sm: { mark: 24, primary: "0.9375rem", counterpart: "0.625rem", tagline: "0.625rem"  },
  md: { mark: 36, primary: "1.375rem",  counterpart: "0.75rem",  tagline: "0.6875rem" },
  lg: { mark: 72, primary: "3rem",      counterpart: "1.5rem",   tagline: "1rem"      },
} as const;

const MARK_SRC: Record<BrandLogoTone, string> = {
  light: "/brand/al-ameen-mark-mono-light.svg",
  dark:  "/brand/al-ameen-mark-mono-dark.svg",
  full:  "/brand/al-ameen-mark.svg",
};

// Color of the primary wordmark text per tone.
const primaryColor = (tone: BrandLogoTone): string => {
  if (tone === "light") return TOKENS.ivory100; // on dark canvases
  if (tone === "dark")  return TOKENS.midnight800; // on light canvases
  return TOKENS.ivory100; // `full` is effectively a dark-canvas usage
};

// Color of the counterpart (always the gold accent for signal).
const counterpartColor = (tone: BrandLogoTone): string =>
  tone === "dark" ? TOKENS.gold600 : TOKENS.gold400;

const taglineColor = (tone: BrandLogoTone): string =>
  tone === "dark" ? TOKENS.midnight700 : TOKENS.ivory200;

// Tagline copy — EN italic display-font / AR Cairo 500.
const TAGLINE = {
  en: "The Nation's Trusted Guardian",
  ar: "الحارس الأمين للوطن",
} as const;

// Wordmark copy per language.
const WORDMARK = {
  en: "Al-Ameen",
  ar: "الأمين",
} as const;

const BrandLogo = ({
  variant = "horizontal",
  tone = "full",
  size = "md",
  showTagline = false,
  isAr: isArProp,
  className,
  style,
}: BrandLogoProps) => {
  const fonts = useBrandFonts();
  const isAr = isArProp ?? fonts.isAr;
  const dims = SIZE[size];

  // Primary / counterpart text + font stacks.
  const primaryText     = isAr ? WORDMARK.ar : WORDMARK.en;
  const counterpartText = isAr ? WORDMARK.en : WORDMARK.ar;
  const primaryFont     = isAr ? fonts.display /* Cairo in AR */ : fonts.display /* Cormorant in EN */;
  // Counterpart is always in the *opposite* script, so we pick the always-arabic
  // stack when the UI is in EN, and the EN display stack when the UI is in AR.
  const counterpartFont = isAr
    ? "'Cormorant Garamond', Georgia, serif" // EN counterpart under AR primary
    : fonts.arabic;                            // AR counterpart under EN primary

  // Tagline — primary in current language, counterpart tiny in opposite.
  const taglineText = isAr ? TAGLINE.ar : TAGLINE.en;

  // ── MARK-ONLY ─────────────────────────────────────────────────────────────
  if (variant === "mark") {
    return (
      <img
        src={MARK_SRC[tone]}
        alt="Al-Ameen"
        className={className}
        style={{
          width: dims.mark,
          height: dims.mark,
          display: "block",
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  // ── Wordmark block (shared by horizontal + stacked) ──────────────────────
  const wordmark = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: variant === "stacked" ? "center" : isAr ? "flex-end" : "flex-start",
        lineHeight: 1,
        textAlign: variant === "stacked" ? "center" : (isAr ? "right" : "left"),
      }}
    >
      {/* Primary */}
      <span
        style={{
          fontFamily: primaryFont,
          fontSize: dims.primary,
          fontWeight: isAr ? 600 : 500,
          letterSpacing: isAr ? "0" : "-0.01em",
          color: primaryColor(tone),
          direction: isAr ? "rtl" : "ltr",
        }}
      >
        {primaryText}
      </span>
      {/* Counterpart */}
      <span
        style={{
          fontFamily: counterpartFont,
          fontSize: dims.counterpart,
          fontWeight: isAr ? 400 : 500,
          color: counterpartColor(tone),
          marginTop: 2,
          direction: isAr ? "ltr" : "rtl",
          letterSpacing: isAr ? "0.02em" : "0",
        }}
      >
        {counterpartText}
      </span>
      {/* Tagline — optional */}
      {showTagline && (
        <span
          style={{
            fontFamily: isAr
              ? BRAND_FONT_AR_TAGLINE
              : "'Cormorant Garamond', Georgia, serif",
            fontSize: dims.tagline,
            fontStyle: isAr ? "normal" : "italic",
            fontWeight: isAr ? 500 : 400,
            color: taglineColor(tone),
            marginTop: size === "lg" ? 8 : 4,
            direction: isAr ? "rtl" : "ltr",
            opacity: 0.9,
            letterSpacing: "0.02em",
          }}
        >
          {taglineText}
        </span>
      )}
    </div>
  );

  // ── STACKED — mark on top, wordmark below, centred ───────────────────────
  if (variant === "stacked") {
    return (
      <div
        className={className}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          gap: size === "lg" ? 16 : 10,
          ...style,
        }}
      >
        <img
          src={MARK_SRC[tone]}
          alt=""
          aria-hidden
          style={{ width: dims.mark, height: dims.mark, display: "block" }}
        />
        {wordmark}
      </div>
    );
  }

  // ── HORIZONTAL — mark on leading edge, wordmark beside ───────────────────
  // In AR, the mark renders on the right (logical "leading" in RTL).
  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        flexDirection: isAr ? "row-reverse" : "row",
        alignItems: "center",
        gap: size === "lg" ? 16 : size === "md" ? 12 : 8,
        ...style,
      }}
    >
      <img
        src={MARK_SRC[tone]}
        alt=""
        aria-hidden
        style={{ width: dims.mark, height: dims.mark, display: "block", flexShrink: 0 }}
      />
      {wordmark}
    </div>
  );
};

// Separate constant so the JSX above stays readable. Cairo carries the
// Arabic tagline (brand-locked per Option C); Cormorant italic the English one.
const BRAND_FONT_AR_TAGLINE = "'Cairo', 'Tajawal', 'IBM Plex Sans Arabic', sans-serif";

export default BrandLogo;
