import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface CriticalAlert {
  id: string;
  type: "target_match" | "sla_breach" | "source_down";
  severity: "CRITICAL" | "HIGH";
  title: string;
  titleAr: string;
  detail: string;
  detailAr: string;
  caseId?: string;
  route: string;
}

const MOCK_ALERT: CriticalAlert = {
  id: "alert-critical-001",
  type: "target_match",
  severity: "CRITICAL",
  title: "Target Match — Interpol Red Notice",
  titleAr: "مطابقة هدف — نشرة إنتربول الحمراء",
  detail: "Mohamed K. Al-Rashidi · PPT: A1234567 · Confidence 97% · Capital Int'l Airport",
  detailAr: "محمد خالد الراشدي · جواز: A1234567 · ثقة 97% · مطار العاصمة الدولي",
  caseId: "TM-2025-4891",
  route: "/dashboard/target-match",
};

const DISMISS_KEY = "ameen_critical_alert_dismissed_v1";
const AUTO_CLOSE_SEC = 60;

interface Props {
  isAr: boolean;
}

const CriticalAlertModal = ({ isAr }: Props) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_CLOSE_SEC);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Show once per session unless already dismissed
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch {
      return;
    }
    // Brief delay so the layout settles before the interrupt fires
    const show = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(show);
  }, []);

  useEffect(() => {
    if (!visible) return;
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          dismiss();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch { /* noop */ }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const reviewNow = () => {
    dismiss();
    navigate(MOCK_ALERT.route);
  };

  if (!visible) return null;

  const pct = (countdown / AUTO_CLOSE_SEC) * 100;
  const alert = MOCK_ALERT;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="alertdialog"
      aria-modal="true"
      aria-label={isAr ? "تنبيه حرج" : "Critical Alert"}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)" }}
        onClick={dismiss}
      />

      {/* Modal card */}
      <div
        className="relative mx-4 rounded-2xl border overflow-hidden"
        style={{
          width: "min(520px, 100vw - 32px)",
          background: "linear-gradient(145deg, rgba(10,25,45,0.98) 0%, rgba(15,35,55,0.98) 100%)",
          borderColor: "rgba(201,74,94,0.6)",
          boxShadow: "0 0 0 1px rgba(201,74,94,0.3), 0 0 60px rgba(201,74,94,0.18), 0 24px 60px rgba(0,0,0,0.7)",
        }}
      >
        {/* Countdown progress bar */}
        <div className="h-0.5 w-full" style={{ background: "rgba(201,74,94,0.15)" }}>
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{ width: `${pct}%`, background: "#C94A5E" }}
          />
        </div>

        {/* Header row */}
        <div className="px-6 pt-5 pb-4 border-b" style={{ borderColor: "rgba(201,74,94,0.15)" }}>
          <div className="flex items-center gap-3">
            {/* Pulsing CRITICAL badge */}
            <div className="relative flex-shrink-0">
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ background: "#C94A5E", transform: "scale(1.8)" }}
              />
              <div
                className="relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(201,74,94,0.2)", border: "2px solid #C94A5E" }}
              >
                <i className="ri-alarm-warning-line text-lg" style={{ color: "#C94A5E" }} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-black tracking-[0.15em] font-['JetBrains_Mono']"
                  style={{ background: "rgba(201,74,94,0.2)", color: "#C94A5E", border: "1px solid rgba(201,74,94,0.5)" }}
                >
                  {alert.severity}
                </span>
                {alert.caseId && (
                  <span className="text-[11px] text-gray-500 font-['JetBrains_Mono']">{alert.caseId}</span>
                )}
                <span className="ml-auto text-[11px] text-gray-600 font-['JetBrains_Mono']">
                  {isAr ? "يُغلق خلال" : "auto-closes"} {countdown}s
                </span>
              </div>
              <h2 className="text-white font-bold text-base leading-snug">
                {isAr ? alert.titleAr : alert.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Detail */}
        <div className="px-6 py-4">
          <p
            className="text-[13px] font-['JetBrains_Mono'] leading-relaxed"
            style={{ color: "#D1D5DB" }}
          >
            {isAr ? alert.detailAr : alert.detail}
          </p>

          {/* Alert type context strip */}
          <div
            className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(201,74,94,0.06)", border: "1px solid rgba(201,74,94,0.15)" }}
          >
            <i className="ri-crosshair-2-line text-sm" style={{ color: "#C94A5E" }} />
            <span className="text-xs font-['JetBrains_Mono']" style={{ color: "#D1D5DB" }}>
              {isAr
                ? "تم اكتشاف مطابقة بدرجة ثقة عالية في نقطة دخول نشطة. مطلوب مراجعة فورية."
                : "High-confidence match detected at an active entry point. Immediate review required."
              }
            </span>
          </div>

          {/* Who should act */}
          <div className="mt-3 flex items-center gap-2">
            <i className="ri-user-settings-line text-xs text-gray-600" />
            <span className="text-[11px] text-gray-600 font-['JetBrains_Mono']">
              {isAr ? "موجّه إلى: المشرف / المحلل المناوب" : "Routed to: Supervisor · On-duty analyst"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            type="button"
            onClick={reviewNow}
            className="flex-1 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all flex items-center justify-center gap-2"
            style={{
              background: "#C94A5E",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 14px rgba(201,74,94,0.4)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#A83850"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#C94A5E"; }}
          >
            <i className="ri-eye-line" />
            {isAr ? "مراجعة الآن" : "Review Now"}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all flex items-center justify-center gap-2"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#9CA3AF",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
          >
            <i className="ri-check-line" />
            {isAr ? "إقرار والمتابعة" : "Acknowledge & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CriticalAlertModal;
