// ============================================================================
// Al-Ameen · Clearance simulator (Wave 3 · Deliverable 5)
// ----------------------------------------------------------------------------
// Demo-only clearance context. In production each operator has a static
// clearance assigned via RBAC; for the demo we expose a pill in the title bar
// that cycles through PUBLIC → INTERNAL → RESTRICTED → CLASSIFIED so the viewer
// can watch fields redact in real time across Queue / Explain / Identity /
// Audit Log surfaces.
//
// Ordinal rule: higher clearance dominates. A field classified `restricted`
// is viewable iff viewer clearance >= restricted.
// ============================================================================

import { createContext, useContext, useEffect, useState, type ReactNode, createElement } from "react";
import type { Classification } from "@/mocks/osintData";

// Ordered low → high. Index acts as the ordinal used by canView().
export const CLEARANCE_LEVELS: Classification[] = ["public", "internal", "restricted", "classified"];

const STORAGE_KEY = "ameen:clearance";

const clearanceRank = (c: Classification): number => CLEARANCE_LEVELS.indexOf(c);

/**
 * Gate for redaction — returns true if a viewer at `viewerClearance` is
 * allowed to see a field labeled `fieldClass`. Ordinal comparison:
 * viewer >= field classification.
 */
export const canView = (fieldClass: Classification, viewerClearance: Classification): boolean =>
  clearanceRank(viewerClearance) >= clearanceRank(fieldClass);

/** Monospaced █ block used everywhere a redacted value is rendered. */
export const REDACTED_GLYPH = "█████████";

interface ClearanceContextShape {
  clearance: Classification;
  setClearance: (next: Classification) => void;
  cycleClearance: () => void;
  canView: (fieldClass: Classification) => boolean;
}

const ClearanceContext = createContext<ClearanceContextShape | null>(null);

export const ClearanceProvider = ({ children }: { children: ReactNode }) => {
  const [clearance, setClearance] = useState<Classification>(() => {
    try {
      const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (saved && (CLEARANCE_LEVELS as string[]).includes(saved)) {
        return saved as Classification;
      }
    } catch { /* noop */ }
    return "internal"; // sensible default — matches most operator roles
  });

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, clearance); } catch { /* noop */ }
  }, [clearance]);

  const cycleClearance = () => {
    setClearance((cur) => {
      const idx = CLEARANCE_LEVELS.indexOf(cur);
      return CLEARANCE_LEVELS[(idx + 1) % CLEARANCE_LEVELS.length];
    });
  };

  const value: ClearanceContextShape = {
    clearance,
    setClearance,
    cycleClearance,
    canView: (fieldClass: Classification) => canView(fieldClass, clearance),
  };

  // createElement avoids needing JSX in this .ts file (so we keep it
  // framework-light and don't have to rename to .tsx).
  return createElement(ClearanceContext.Provider, { value }, children);
};

export const useClearance = (): ClearanceContextShape => {
  const ctx = useContext(ClearanceContext);
  if (!ctx) {
    // Provider-less fallback (e.g., storybook) — public clearance, no setter.
    return {
      clearance: "public",
      setClearance: () => { /* noop */ },
      cycleClearance: () => { /* noop */ },
      canView: (fieldClass: Classification) => canView(fieldClass, "public"),
    };
  }
  return ctx;
};
