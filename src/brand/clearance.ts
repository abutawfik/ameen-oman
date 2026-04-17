// ============================================================================
// Al-Ameen · Clearance simulator (Wave 3 · Deliverable 5 + Wave 4 · D3)
// ----------------------------------------------------------------------------
// Demo-only clearance context. In production each operator has a static
// clearance assigned via RBAC; for the demo we expose a pill in the title bar
// that cycles through PUBLIC → INTERNAL → RESTRICTED → CLASSIFIED so the viewer
// can watch fields redact in real time across Queue / Explain / Identity /
// Audit Log surfaces.
//
// Ordinal rule: higher clearance dominates. A field classified `restricted`
// is viewable iff viewer clearance >= restricted.
//
// Wave 4 · D3 — every clearance cycle now writes a synthetic AuditEntry into
// a module-level mutable log AND dispatches a custom window event so the
// Audit Log page can merge live changes into its seeded roster without a
// full re-render of its data source.
// ============================================================================

import { createContext, useContext, useEffect, useState, type ReactNode, createElement } from "react";
import type { AuditEntry, Classification } from "@/mocks/osintData";

// Ordered low → high. Index acts as the ordinal used by canView().
export const CLEARANCE_LEVELS: Classification[] = ["public", "internal", "restricted", "classified"];

const STORAGE_KEY = "ameen:clearance";
export const CLEARANCE_AUDIT_EVENT = "ameen:audit:clearance-changed";

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

/**
 * Module-level mutable log — the Audit Log page reads from this alongside
 * the seeded AUDIT_LOG to surface runtime clearance cycles.
 */
export const CLEARANCE_CHANGE_LOG: AuditEntry[] = [];

const currentOperator = {
  id: "current-operator",
  name: "Ahmed Al-Amri",
  role: "analyst" as const,
};

/**
 * Build the synthetic AuditEntry for a cycle event. Kept lightweight —
 * classification on the entry mirrors the new clearance level so the row
 * colors visibly shift when the viewer steps up.
 */
const buildClearanceEntry = (prev: Classification, next: Classification): AuditEntry => ({
  id: `AU-CLR-${Date.now()}`,
  occurredAt: new Date().toISOString(),
  actor: { ...currentOperator },
  eventType: "clearance_changed",
  targetId: `clearance:${prev}→${next}`,
  classification: next,
  details: {
    prev,
    next,
    interactive: true,
    source: "clearance_pill_cycle",
  },
});

interface ClearanceContextShape {
  clearance: Classification;
  setClearance: (next: Classification) => void;
  cycleClearance: () => void;
  canView: (fieldClass: Classification) => boolean;
}

const ClearanceContext = createContext<ClearanceContextShape | null>(null);

export const ClearanceProvider = ({ children }: { children: ReactNode }) => {
  const [clearance, setClearanceState] = useState<Classification>(() => {
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

  // Write an audit entry whenever the clearance actually changes. We gate on
  // prev !== next so idempotent setClearance(prev) calls don't spam the log.
  const recordChange = (prev: Classification, next: Classification) => {
    if (prev === next) return;
    const entry = buildClearanceEntry(prev, next);
    CLEARANCE_CHANGE_LOG.unshift(entry);
    try {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(CLEARANCE_AUDIT_EVENT, { detail: entry }));
      }
    } catch { /* noop */ }
  };

  const setClearance = (next: Classification) => {
    setClearanceState((prev) => {
      recordChange(prev, next);
      return next;
    });
  };

  const cycleClearance = () => {
    setClearanceState((cur) => {
      const idx = CLEARANCE_LEVELS.indexOf(cur);
      const next = CLEARANCE_LEVELS[(idx + 1) % CLEARANCE_LEVELS.length];
      recordChange(cur, next);
      return next;
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
