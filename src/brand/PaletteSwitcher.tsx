// ============================================================================
// Al-Ameen \u00B7 Runtime Palette Switcher
// ----------------------------------------------------------------------------
// Floating pill pinned to the bottom corner of the viewport. Lets us flip
// the ocean ramp between palette variants at runtime (without a rebuild) so
// brand reviews can compare proposals against real pages.
//
// The switcher is a pure UI concern \u2014 persistence is localStorage, and
// application is one attribute on <html>. All visual flipping is driven by
// CSS variable scopes in src/index.css.
// ============================================================================

import { useEffect, useState } from "react";
import {
  DEFAULT_PALETTE,
  PALETTE_CHANGED_EVENT,
  PALETTE_ORDER,
  PALETTE_STORAGE_KEY,
  PALETTES,
  isPaletteId,
  type PaletteId,
} from "./palettes";

// ── Brand tokens used by the switcher chrome ────────────────────────────────
// Kept inline so the switcher never depends on tailwind JIT and can load on
// the very first paint even if other styles are still streaming in.
const BRASS_600 = "#B88A3C";
const BRASS_400 = "#D6B47E";
const OCEAN_200 = "#7A9CBF";
const IVORY_100 = "#F8F5F0";

const readStoredPalette = (): PaletteId => {
  if (typeof window === "undefined") return DEFAULT_PALETTE;
  try {
    const stored = window.localStorage.getItem(PALETTE_STORAGE_KEY);
    return isPaletteId(stored) ? stored : DEFAULT_PALETTE;
  } catch {
    return DEFAULT_PALETTE;
  }
};

const applyPaletteToDom = (id: PaletteId): void => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-palette", id);
};

const isRtl = (): boolean => {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("dir") === "rtl";
};

const PaletteSwitcher = () => {
  const [palette, setPalette] = useState<PaletteId>(DEFAULT_PALETTE);
  const [open, setOpen] = useState(false);
  const [rtl, setRtl] = useState(false);

  // Apply the persisted palette on mount so first paint is correct.
  useEffect(() => {
    const initial = readStoredPalette();
    setPalette(initial);
    applyPaletteToDom(initial);
    setRtl(isRtl());
  }, []);

  // Track dir changes so the pill floats on the opposite side in RTL.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    const observer = new MutationObserver(() => setRtl(isRtl()));
    observer.observe(html, { attributes: true, attributeFilter: ["dir", "lang"] });
    return () => observer.disconnect();
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + Shift + P cycles palettes.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isToggleChord =
        (e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "P" || e.key === "p");
      if (!isToggleChord) return;
      e.preventDefault();
      setPalette((current) => {
        const idx = PALETTE_ORDER.indexOf(current);
        const next = PALETTE_ORDER[(idx + 1) % PALETTE_ORDER.length];
        commit(next);
        return next;
      });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist + apply + broadcast a palette change.
  const commit = (next: PaletteId) => {
    try {
      window.localStorage.setItem(PALETTE_STORAGE_KEY, next);
    } catch {
      /* storage can throw in private mode \u2014 swallow */
    }
    applyPaletteToDom(next);
    try {
      window.dispatchEvent(
        new CustomEvent(PALETTE_CHANGED_EVENT, { detail: { id: next } }),
      );
    } catch {
      /* CustomEvent unsupported \u2014 ignore */
    }
  };

  const handleSelect = (next: PaletteId) => {
    if (next === palette) return;
    setPalette(next);
    commit(next);
  };

  const activeDef = PALETTES[palette];

  // ── Layout ────────────────────────────────────────────────────────────────
  // Outer wrapper pins to the viewport corner; inner pill handles the actual
  // chrome so the hover hotzone is tight against the pill edges.
  const anchorStyle: React.CSSProperties = rtl
    ? { left: "1rem", right: "auto" }
    : { right: "1rem", left: "auto" };

  const shellStyle: React.CSSProperties = {
    background: "rgba(15, 43, 92, 0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${BRASS_600}66`,
    borderRadius: 9999,
    boxShadow:
      "0 10px 32px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(184, 138, 60, 0.08)",
    color: IVORY_100,
    fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
    padding: open ? "0.4rem 0.5rem" : "0.4rem",
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    transition: "padding 180ms ease, background 180ms ease",
    cursor: open ? "default" : "pointer",
    userSelect: "none",
  };

  return (
    <div
      aria-label="Palette switcher"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        // Only collapse when focus leaves the whole pill, not when it moves
        // between the two buttons inside it.
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      style={{
        position: "fixed",
        bottom: "1rem",
        zIndex: 9999,
        ...anchorStyle,
      }}
    >
      <div style={shellStyle}>
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Palette: ${activeDef.name}`}
            title={`Palette: ${activeDef.name} (Cmd/Ctrl+Shift+P to cycle)`}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: `1px solid ${BRASS_600}`,
              background: `radial-gradient(circle at 30% 30%, ${BRASS_400}, ${BRASS_600})`,
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 2px rgba(184, 138, 60, 0.18)",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: activeDef.ocean[700],
                display: "block",
              }}
            />
          </button>
        ) : (
          <>
            {PALETTE_ORDER.map((id) => {
              const def = PALETTES[id];
              const active = id === palette;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelect(id)}
                  title={def.description}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.375rem 0.625rem",
                    borderRadius: 9999,
                    border: `1px solid ${active ? BRASS_600 : "transparent"}`,
                    background: active
                      ? "rgba(184, 138, 60, 0.18)"
                      : "transparent",
                    color: active ? BRASS_400 : OCEAN_200,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    cursor: active ? "default" : "pointer",
                    transition: "background 150ms, color 150ms, border-color 150ms",
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  }}
                  aria-pressed={active}
                >
                  {/* 3-stripe preview swatch — ocean 800 / 700 / 600 */}
                  <span
                    aria-hidden
                    style={{
                      display: "inline-flex",
                      width: 24,
                      height: 12,
                      borderRadius: 3,
                      overflow: "hidden",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                    }}
                  >
                    <span style={{ flex: 1, background: def.ocean[800] }} />
                    <span style={{ flex: 1, background: def.ocean[700] }} />
                    <span style={{ flex: 1, background: def.ocean[600] }} />
                  </span>
                  <span>{id === "v1" ? "v1.0" : "v1.1"}</span>
                </button>
              );
            })}
            {/* Caption — tiny brass mono subtitle showing the active palette */}
            <span
              style={{
                marginInlineStart: "0.25rem",
                paddingInlineStart: "0.5rem",
                borderInlineStart: `1px solid ${BRASS_600}4D`,
                fontSize: "0.625rem",
                color: BRASS_400,
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
              }}
            >
              {activeDef.name}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default PaletteSwitcher;
