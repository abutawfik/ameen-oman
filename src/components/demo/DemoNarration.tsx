// Demo narration overlay — Wave 3 · Deliverable 4 (+ Wave 4 · Deliverable 1)
// Press `N` to toggle. While active, the current route's scripted narration
// walks the viewer through key elements: traveling tooltip + brass highlight
// + dim backdrop. Used for recorded walkthroughs or unattended kiosk demos.
//
// Wave 4 additions:
//   · Deep-link via ?narrate=<id|index|true|1>
//   · Copy-deep-link button
//   · Cmd/Ctrl+Shift+N → log current script JSON to console

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { DEMO_NARRATIONS, type NarrationScript } from "@/mocks/osintData";
import { useBrandFonts } from "@/brand/typography";

const STORAGE_KEY = "ameen:narration";
const STEP_DURATION_MS = 6000;
const POLL_MS = 120;
const DEEP_LINK_PARAM = "narrate";

interface HighlightBox {
  top: number;
  left: number;
  width: number;
  height: number;
  found: boolean;
}

const findScript = (pathname: string): NarrationScript | null => {
  const exact = DEMO_NARRATIONS.find((s) => s.route === pathname);
  if (exact) return exact;
  // Fall back: longest-prefix match so sub-routes inherit the closest script.
  const prefix = [...DEMO_NARRATIONS]
    .filter((s) => pathname.startsWith(s.route))
    .sort((a, b) => b.route.length - a.route.length)[0];
  return prefix ?? null;
};

// Extract a `data-narrate-id="…"` value from a target selector so deep-links
// survive across reloads without needing the full selector string.
const narrateIdFromSelector = (selector: string): string | null => {
  const m = selector.match(/\[data-narrate-id=['"]([^'"]+)['"]\]/);
  return m ? m[1] : null;
};

const resolveInitialStep = (
  script: NarrationScript | null,
  param: string | null,
): number => {
  if (!script || !param) return 0;
  // Boolean-ish — always start at zero.
  if (param === "true" || param === "1") return 0;
  // Numeric index — clamp.
  const asInt = Number.parseInt(param, 10);
  if (!Number.isNaN(asInt) && Number.isFinite(asInt)) {
    return Math.min(Math.max(asInt, 0), script.steps.length - 1);
  }
  // Otherwise treat as a narrate-id target. Match by stripping the
  // [data-narrate-id="…"] prefix so callers can pass the raw id.
  const stepIdx = script.steps.findIndex((s) => narrateIdFromSelector(s.targetSelector) === param);
  return stepIdx >= 0 ? stepIdx : 0;
};

const DemoNarration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fonts = useBrandFonts();
  // Pull once per render — we read the incoming deep-link param eagerly.
  const deepLinkParam = searchParams.get(DEEP_LINK_PARAM);

  const [active, setActive] = useState<boolean>(() => {
    // If a deep-link param is present on first mount, force-activate regardless
    // of the persisted toggle. Otherwise honor the saved preference.
    try {
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (url.searchParams.get(DEEP_LINK_PARAM)) return true;
      }
    } catch { /* noop */ }
    try { return window.localStorage.getItem(STORAGE_KEY) === "on"; } catch { return false; }
  });
  const [stepIdx, setStepIdx] = useState(0);
  const [highlight, setHighlight] = useState<HighlightBox | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [paused, setPaused] = useState(false);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const tickerRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  // Remember which param value we've already consumed so React Strict-mode
  // double-invokes don't re-apply it on every render.
  const consumedParamRef = useRef<string | null>(null);

  const script = useMemo(() => findScript(location.pathname), [location.pathname]);
  const step = script?.steps[stepIdx] ?? null;

  // Persist on toggle. Reset step when route changes.
  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, active ? "on" : "off"); } catch { /* noop */ }
  }, [active]);

  // Reset step on route change — but if a deep-link param is present on this
  // route, honor it instead of dropping back to step 0.
  useEffect(() => {
    if (deepLinkParam) {
      setStepIdx(resolveInitialStep(script, deepLinkParam));
      // Force-activate if the URL asked us to.
      setActive(true);
      consumedParamRef.current = deepLinkParam;
    } else {
      setStepIdx(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, deepLinkParam, script?.route]);

  // Keyboard: N toggles narration; arrow keys / space walk steps;
  // Cmd/Ctrl+Shift+N logs current script JSON for developers.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement | null;
      const inField = tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA" || tgt.isContentEditable);
      // Dev shortcut — Cmd/Ctrl+Shift+N
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        // eslint-disable-next-line no-console
        console.log(
          `[narration] route=${location.pathname} script=`,
          script ? JSON.stringify(script, null, 2) : "(no script for this route)",
        );
        return;
      }
      if (inField) return;
      if (e.key === "n" || e.key === "N") {
        setActive((v) => !v);
        return;
      }
      if (!active) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setStepIdx((i) => (script ? Math.min(i + 1, script.steps.length - 1) : 0));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setStepIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Escape") {
        closeWithCleanup();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, script, location.pathname]);

  // Strip the ?narrate= param from the URL so refreshing doesn't retrigger.
  const stripDeepLink = () => {
    if (!searchParams.has(DEEP_LINK_PARAM)) return;
    const next = new URLSearchParams(searchParams);
    next.delete(DEEP_LINK_PARAM);
    const qs = next.toString();
    navigate(`${location.pathname}${qs ? `?${qs}` : ""}${location.hash || ""}`, { replace: true });
  };

  const closeWithCleanup = () => {
    setActive(false);
    stripDeepLink();
  };

  // Poll for the target element so the highlight tracks scroll + DOM updates.
  useEffect(() => {
    if (!active || !step) {
      setHighlight(null);
      return;
    }
    const updateBox = () => {
      const el = document.querySelector<HTMLElement>(step.targetSelector);
      if (!el) {
        setHighlight({ top: 0, left: 0, width: 0, height: 0, found: false });
        return;
      }
      // Scroll into view once when the step changes — subsequent polls just
      // track the existing geometry so the box stays glued while the user
      // moves around the page.
      const rect = el.getBoundingClientRect();
      setHighlight({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        found: true,
      });
    };
    updateBox();
    // Scroll into view just after the step changes — use requestAnimationFrame
    // to avoid yanking during the transition.
    const el = document.querySelector<HTMLElement>(step.targetSelector);
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    tickerRef.current = window.setInterval(updateBox, POLL_MS);
    const onScroll = () => updateBox();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      if (tickerRef.current) window.clearInterval(tickerRef.current);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [active, step, stepIdx]);

  // Auto-advance the step.
  useEffect(() => {
    if (!active || !script || !autoAdvance || paused) return;
    const duration = step?.durationMs ?? STEP_DURATION_MS;
    timerRef.current = window.setTimeout(() => {
      setStepIdx((i) => (i + 1 < script.steps.length ? i + 1 : i));
    }, duration);
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, [active, script, stepIdx, autoAdvance, paused, step?.durationMs]);

  // Copy deep-link for current step to clipboard.
  const handleCopyDeepLink = async () => {
    if (typeof window === "undefined" || !step) return;
    const id = narrateIdFromSelector(step.targetSelector);
    const url = new URL(window.location.href);
    url.searchParams.set(DEEP_LINK_PARAM, id ?? String(stepIdx));
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopyToast(fonts.isAr ? "تم نسخ الرابط" : "Deep link copied");
    } catch {
      // Fallback: create a temp textarea.
      try {
        const ta = document.createElement("textarea");
        ta.value = url.toString();
        ta.style.position = "fixed"; ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopyToast(fonts.isAr ? "تم نسخ الرابط" : "Deep link copied");
      } catch {
        setCopyToast(fonts.isAr ? "تعذّر النسخ" : "Copy failed");
      }
    }
    window.setTimeout(() => setCopyToast(null), 2400);
  };

  if (!active) return null;

  return (
    <>
      {/* Dim backdrop + cutout over the highlighted element.
          Implementation: we draw 4 overlay rects around the target box so the
          target itself stays fully lit while everything around dims. */}
      {highlight && highlight.found ? (
        <>
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: Math.max(0, highlight.top - 6), background: "rgba(0,0,0,0.55)", zIndex: 90, pointerEvents: "none" }} />
          <div style={{ position: "fixed", top: Math.max(0, highlight.top - 6), bottom: 0, left: 0, width: Math.max(0, highlight.left - 6), background: "rgba(0,0,0,0.55)", zIndex: 90, pointerEvents: "none" }} />
          <div style={{ position: "fixed", top: Math.max(0, highlight.top - 6), bottom: 0, left: highlight.left + highlight.width + 6, right: 0, background: "rgba(0,0,0,0.55)", zIndex: 90, pointerEvents: "none" }} />
          <div style={{ position: "fixed", top: highlight.top + highlight.height + 6, bottom: 0, left: Math.max(0, highlight.left - 6), width: highlight.width + 12, background: "rgba(0,0,0,0.55)", zIndex: 90, pointerEvents: "none" }} />
          {/* Glow ring */}
          <div
            style={{
              position: "fixed",
              top: highlight.top - 6,
              left: highlight.left - 6,
              width: highlight.width + 12,
              height: highlight.height + 12,
              border: "2px solid #D6B47E",
              borderRadius: 12,
              boxShadow: "0 0 0 6px rgba(184,138,60,0.2), 0 0 28px rgba(184,138,60,0.4)",
              zIndex: 91,
              pointerEvents: "none",
              transition: "all 0.25s ease-out",
            }}
          />
        </>
      ) : (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 90, pointerEvents: "none" }} />
      )}

      {/* Floating narration panel */}
      <div
        role="dialog"
        aria-label="Demo narration"
        style={{
          position: "fixed",
          top: 76,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(620px, calc(100% - 48px))",
          zIndex: 95,
          background: "linear-gradient(135deg, rgba(10,37,64,0.98), rgba(10,37,64,0.92))",
          border: "1px solid rgba(184,138,60,0.45)",
          borderRadius: 14,
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          backdropFilter: "blur(12px)",
          padding: 16,
          fontFamily: fonts.sans,
          color: "#F8F5F0",
        }}
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <i className="ri-mic-line" style={{ color: "#D6B47E" }} />
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#D6B47E", fontFamily: fonts.mono }}>
              {fonts.isAr ? "شرح مباشر" : "DEMO NARRATION"}
            </span>
            {script && (
              <span className="text-[10px] tracking-widest" style={{ color: "#6B7280", fontFamily: fonts.mono }}>
                · {fonts.isAr ? script.titleAr : script.title}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {script && (
              <span className="text-[11px] font-bold" style={{ color: "#D6B47E", fontFamily: fonts.mono }}>
                {stepIdx + 1} / {script.steps.length}
              </span>
            )}
            {/* Copy deep link */}
            {script && step && (
              <button type="button" onClick={handleCopyDeepLink}
                className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer"
                style={{ background: "rgba(184,138,60,0.12)", color: "#D6B47E", border: "1px solid #D6B47E55" }}
                title={fonts.isAr ? "نسخ رابط هذه الخطوة" : "Copy deep link to this step"}>
                <i className="ri-link" />
              </button>
            )}
            <button type="button" onClick={() => setPaused((p) => !p)}
              className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer"
              style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.1)" }}
              title={paused ? "Resume" : "Pause"}>
              <i className={paused ? "ri-play-mini-line" : "ri-pause-mini-line"} />
            </button>
            <button type="button" onClick={() => setAutoAdvance((v) => !v)}
              className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer"
              style={{
                background: autoAdvance ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.04)",
                color: autoAdvance ? "#4ADE80" : "#9CA3AF",
                border: `1px solid ${autoAdvance ? "#4ADE8055" : "rgba(255,255,255,0.1)"}`,
              }}
              title={autoAdvance ? "Auto-advance on" : "Auto-advance off"}>
              <i className="ri-timer-line" />
            </button>
            <button type="button" onClick={closeWithCleanup}
              className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer"
              style={{ background: "rgba(201,74,94,0.12)", color: "#C94A5E", border: "1px solid #C94A5E55" }}
              title="Close (N or Esc)">
              <i className="ri-close-line" />
            </button>
          </div>
        </div>

        {/* Copy toast — ephemeral, sits above the step body */}
        {copyToast && (
          <div className="mb-2 rounded-md px-2 py-1 text-[11px]"
            style={{ background: "rgba(74,222,128,0.1)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.3)", fontFamily: fonts.mono }}>
            <i className="ri-check-double-line mr-1" />
            {copyToast}
          </div>
        )}

        {script && step ? (
          <>
            <h3 className="text-white text-base font-bold mb-1" style={{ fontFamily: fonts.display }}>
              {fonts.isAr ? step.titleAr : step.titleEn}
            </h3>
            <p className="text-gray-300 text-sm leading-snug">
              {fonts.isAr ? step.bodyAr : step.bodyEn}
            </p>

            {!highlight?.found && (
              <p className="mt-2 text-[11px]"
                style={{ color: "#C98A1B", fontFamily: fonts.mono }}>
                <i className="ri-search-line mr-1" />
                {fonts.isAr
                  ? "العنصر المستهدف غير مرئي — مرّر للأعلى أو غيّر التبويب."
                  : "Target element not visible — scroll or switch tab to reveal."}
              </p>
            )}

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setStepIdx((i) => Math.max(i - 1, 0))}
                  disabled={stepIdx === 0}
                  className="px-3 py-1 rounded-md text-xs font-bold cursor-pointer disabled:opacity-40 flex items-center gap-1"
                  style={{ background: "rgba(255,255,255,0.04)", color: "#D6B47E", border: "1px solid #D6B47E55" }}>
                  <i className="ri-arrow-left-s-line" />
                  {fonts.isAr ? "السابق" : "Prev"}
                </button>
                <button type="button" onClick={() => setStepIdx((i) => Math.min(i + 1, script.steps.length - 1))}
                  disabled={stepIdx === script.steps.length - 1}
                  className="px-3 py-1 rounded-md text-xs font-bold cursor-pointer disabled:opacity-40 flex items-center gap-1"
                  style={{ background: "#D6B47E", color: "var(--alm-ocean-900)", border: "1px solid #D6B47E" }}>
                  {fonts.isAr ? "التالي" : "Next"}
                  <i className="ri-arrow-right-s-line" />
                </button>
              </div>
              <span className="text-[10px]" style={{ color: "#6B7280", fontFamily: fonts.mono }}>
                {fonts.isAr ? "اضغط N للإغلاق · → / ← للتنقّل" : "Press N to close · → / ← to navigate"}
              </span>
            </div>

            {/* Progress bar — visual cue that auto-advance is running */}
            {autoAdvance && !paused && (
              <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  key={`${location.pathname}-${stepIdx}`}
                  style={{
                    height: "100%",
                    background: "#D6B47E",
                    width: "100%",
                    animation: `narrationTick ${(step.durationMs ?? STEP_DURATION_MS) / 1000}s linear forwards`,
                  }} />
              </div>
            )}
          </>
        ) : (
          <>
            <h3 className="text-white text-base font-bold mb-1" style={{ fontFamily: fonts.display }}>
              {fonts.isAr ? "لا يوجد شرح لهذه الصفحة" : "No narration on this page"}
            </h3>
            <p className="text-gray-400 text-sm">
              {fonts.isAr
                ? "انتقل إلى لوحة التحكّم أو OSINT أو ملف الشخص أو إدارة القضايا أو سجل التدقيق أو حل الكيانات."
                : "Navigate to Dashboard, OSINT Risk Engine, Person 360°, Case Management, Audit Log, or Entity Resolution."}
            </p>
            <div className="mt-2 text-[11px]" style={{ color: "#6B7280", fontFamily: fonts.mono }}>
              {fonts.isAr ? "اضغط N للإغلاق" : "Press N to close."}
            </div>
          </>
        )}
      </div>

      {/* Keyframes — injected once inline so we don't need a tailwind plugin. */}
      <style>{`
        @keyframes narrationTick {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </>
  );
};

export default DemoNarration;
