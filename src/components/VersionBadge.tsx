// ============================================================================
// <VersionBadge />
// ----------------------------------------------------------------------------
// Renders the app version as `v1.2.3.4` (or `v1.2.0-rc.1` when pre-release).
// Reads the compile-time constants `__APP_VERSION__` + `__APP_VERSION_META__`
// injected from version.json by vite.config.ts. No runtime fetch.
//
// Click to open a tooltip showing commit hash + build timestamp — useful for
// support / audit / bug reports.
//
// Designed to slot into footer, sidebar-bottom, or about screen. Minimal
// surface, brass mono, brand-aligned. Bilingual-neutral (version strings
// don't translate).
// ============================================================================

import { useState } from "react";

type Tone = "light" | "dark";
type Size = "sm" | "md";

interface Props {
  /** `light` for dark surfaces (sidebar / ceremonial footer),
   *  `dark` for light surfaces (ivory canvas). */
  tone?: Tone;
  size?: Size;
  /** Show the `v` prefix. Default true. */
  prefix?: boolean;
  /** Additional className — caller can position. */
  className?: string;
}

const C = {
  brassLight: "#D6B47E",
  brassMid:   "#B88A3C",
  oceanDark:  "#051428",
  oceanCard:  "#0A2540",
  ivory:      "#F8F5F0",
  muted:      "#7A9CBF",
};

const VersionBadge = ({ tone = "light", size = "sm", prefix = true, className }: Props) => {
  const [open, setOpen] = useState(false);

  // Version string resolves at build time from version.json. Fall back
  // gracefully in dev-preview where define() may not have replaced it.
  const version = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "0.0.0.0";
  const meta = typeof __APP_VERSION_META__ !== "undefined"
    ? __APP_VERSION_META__
    : { version, commit: "unknown", builtAt: "—", major: 0, minor: 0, patch: 0, build: 0, preRelease: null };

  const label = prefix ? `v${version}` : version;
  const isLight = tone === "light";
  const color = isLight ? C.brassLight : C.brassMid;
  const bg = isLight ? "rgba(184,138,60,0.1)" : "rgba(184,138,60,0.1)";
  const border = isLight ? "rgba(184,138,60,0.3)" : "rgba(184,138,60,0.35)";

  const fontSize = size === "sm" ? "0.6875rem" : "0.75rem";

  return (
    <div
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        aria-label={`Version ${version}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35em",
          padding: size === "sm" ? "0.2rem 0.55rem" : "0.3rem 0.7rem",
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 9999,
          fontSize,
          fontWeight: 600,
          letterSpacing: "0.04em",
          color,
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          cursor: "pointer",
          transition: "background 150ms ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(184,138,60,0.18)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = bg)}
      >
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
        {label}
      </button>

      {open && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            minWidth: 240,
            padding: "0.75rem 0.875rem",
            background: C.oceanDark,
            color: C.ivory,
            border: `1px solid ${border}`,
            borderRadius: 8,
            fontSize: "0.75rem",
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            lineHeight: 1.6,
            boxShadow: "0 12px 32px rgba(2,10,20,0.45)",
            zIndex: 1000,
            whiteSpace: "nowrap",
          }}
        >
          <Row label="VERSION"  value={version} highlight />
          <Row label="COMMIT"   value={meta.commit} />
          <Row label="BUILT AT" value={fmtDate(meta.builtAt)} />
          {meta.preRelease && <Row label="STAGE" value={meta.preRelease.toUpperCase()} highlight />}
          <div
            style={{
              marginTop: "0.5rem",
              paddingTop: "0.5rem",
              borderTop: `1px solid ${border}`,
              fontSize: "0.625rem",
              color: C.muted,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            MAJOR.MINOR.PATCH.BUILD
          </div>
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: "1.25rem" }}>
    <span
      style={{
        color: "#7A9CBF",
        fontSize: "0.625rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
    <span style={{ color: highlight ? C.brassLight : C.ivory }}>{value}</span>
  </div>
);

const fmtDate = (iso: string) => {
  if (!iso || iso === "—") return iso;
  try {
    const d = new Date(iso);
    return d.toISOString().replace("T", " ").slice(0, 16) + " UTC";
  } catch {
    return iso;
  }
};

export default VersionBadge;
