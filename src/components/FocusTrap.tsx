// ============================================================================
// FocusTrap — WCAG 2.1 AA · SC 2.4.3 (Focus Order) + SC 2.1.2 (No Keyboard Trap)
// ----------------------------------------------------------------------------
// Minimal zero-dependency focus trap for modal dialogs.
//
//   · On `active` flip to true: focuses the first focusable descendant of the
//     container (or the container itself if none are found).
//   · Tab cycles forward within the container; Shift+Tab cycles backward.
//   · Esc key fires `onEscape` so consumers can close the modal.
//   · On `active` flip back to false: returns focus to the element that
//     triggered the trap (captured at activation time).
//
// Usage:
//
//   const ref = useRef<HTMLDivElement>(null);
//   useFocusTrap(ref, isOpen, { onEscape: () => setOpen(false) });
//   return isOpen ? (
//     <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="…">
//       …modal content…
//     </div>
//   ) : null;
//
// RTL safe — Tab order follows DOM order, not visual layout, so RTL does not
// require any direction-aware branching here.
// ============================================================================

import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']",
].join(",");

interface Options {
  onEscape?: () => void;
  /** When true, Esc key is intercepted. Default true. */
  trapEscape?: boolean;
}

export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  active: boolean,
  options: Options = {},
) {
  const { onEscape, trapEscape = true } = options;
  const lastTriggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    // Remember who opened the dialog so we can restore focus on close.
    lastTriggerRef.current = document.activeElement;

    // Focus the first focusable node inside the dialog, or the dialog itself.
    const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    const first = focusables[0];
    if (first) {
      first.focus();
    } else {
      // Dialog has no inherent focus target — make it focusable so screen
      // readers land on it and announce the role + label.
      if (!container.hasAttribute("tabindex")) {
        container.setAttribute("tabindex", "-1");
      }
      container.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && trapEscape && onEscape) {
        e.stopPropagation();
        onEscape();
        return;
      }
      if (e.key !== "Tab") return;

      const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        .filter((n) => !n.hasAttribute("disabled") && n.offsetParent !== null);

      if (nodes.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }

      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (activeEl === firstNode || !container.contains(activeEl)) {
          e.preventDefault();
          lastNode.focus();
        }
      } else {
        if (activeEl === lastNode || !container.contains(activeEl)) {
          e.preventDefault();
          firstNode.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      // Restore focus to the trigger on close.
      const trigger = lastTriggerRef.current as HTMLElement | null;
      if (trigger && typeof trigger.focus === "function") {
        // Defer to next tick so React can unmount before focus returns —
        // otherwise focus can land on a node that is about to be removed.
        window.setTimeout(() => trigger.focus(), 0);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}

export default useFocusTrap;
