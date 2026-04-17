// ============================================================================
// SkipToMain — WCAG 2.1 AA · SC 2.4.1 (Bypass Blocks)
// ----------------------------------------------------------------------------
// First focusable element on every page. Hidden off-screen until keyboard
// focus lands on it; then it becomes visible at the top-left (top-right in
// RTL) and activates an anchor jump to #main. Keyboard & screen-reader users
// skip past the nav chrome to the primary content region in one keystroke.
//
// Uses inline styles (not Tailwind) so the component works even if Tailwind's
// JIT hasn't compiled utilities that target the RTL selector.
//
// The target `<main id="main">` is provided by:
//   · DashboardLayout.tsx — wraps the <Outlet />
//   · Home page wrapper   — wraps HeroSection + sibling sections
//   · Login page wrapper  — wraps the split-canvas form area
// ============================================================================

import { useEffect, useState } from "react";
import i18n from "@/i18n";

interface Props {
  /** Anchor target id; defaults to "main". */
  href?: string;
}

const SkipToMain = ({ href = "main" }: Props) => {
  const [isAr, setIsAr] = useState(() => i18n.language === "ar");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const handler = (lng: string) => setIsAr(lng === "ar");
    i18n.on("languageChanged", handler);
    return () => { i18n.off("languageChanged", handler); };
  }, []);

  const label = isAr ? "تخطِّ إلى المحتوى الرئيسي" : "Skip to main content";

  return (
    <a
      href={`#${href}`}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={(e) => {
        // Move focus to the target so subsequent Tabs start from the main region.
        const target = document.getElementById(href);
        if (target) {
          e.preventDefault();
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: false });
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }}
      style={{
        position: "fixed",
        top: focused ? 12 : -100,
        insetInlineStart: 12,
        zIndex: 9999,
        padding: "0.625rem 1rem",
        background: "var(--alm-ocean-900, #020A14)",
        color: "#D6B47E",
        fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        border: "2px solid #D6B47E",
        borderRadius: 6,
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        textDecoration: "none",
        transition: "top 150ms ease-out",
      }}
    >
      {label}
    </a>
  );
};

export default SkipToMain;
