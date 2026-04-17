import { useState, useEffect } from "react";
import type { FieldAlert } from "@/mocks/mobileFieldData";

interface Props {
  alert: FieldAlert;
  isAr: boolean;
  onBack: () => void;
}

const priorityConfig = {
  critical: { color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.4)", label: "CRITICAL", labelAr: "حرج" },
  high:     { color: "#FB923C", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.35)", label: "HIGH",     labelAr: "عالٍ" },
  medium:   { color: "#FACC15", bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.3)",  label: "MEDIUM",   labelAr: "متوسط" },
  low:      { color: "#D4A84B", bg: "rgba(181,142,60,0.06)", border: "rgba(181,142,60,0.2)",  label: "LOW",      labelAr: "منخفض" },
};

type AlertStatus = "new" | "en-route" | "on-scene" | "resolved" | "escalated";

const statusFlow: AlertStatus[] = ["new", "en-route", "on-scene", "resolved"];

const AlertDetail = ({ alert, isAr, onBack }: Props) => {
  const [status, setStatus] = useState<AlertStatus>(alert.status);
  const [elapsed, setElapsed] = useState(0);
  const [escalationWarning, setEscalationWarning] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<{ status: AlertStatus; time: string }[]>([
    { status: "new", time: alert.time },
    ...(alert.enRouteAt ? [{ status: "en-route" as AlertStatus, time: alert.enRouteAt }] : []),
    ...(alert.onSceneAt ? [{ status: "on-scene" as AlertStatus, time: alert.onSceneAt }] : []),
  ]);

  const cfg = priorityConfig[alert.priority];

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1;
        if (status === "en-route" && next >= 30 * 60) {
          setEscalationWarning(isAr ? "⚠️ لم يتم تأكيد الوصول خلال 30 دقيقة — جارٍ التصعيد التلقائي" : "⚠️ No On-Scene confirmation in 30 min — Auto-escalating");
        }
        if (status === "on-scene" && next >= 60 * 60) {
          setEscalationWarning(isAr ? "🔴 لم يتم الحل خلال 60 دقيقة — تم إخطار المشرف" : "🔴 No resolution in 60 min — Supervisor notified");
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status, isAr]);

  const handleStatusChange = (newStatus: AlertStatus) => {
    setStatus(newStatus);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setTimeline((prev) => [...prev.filter((t) => t.status !== newStatus), { status: newStatus, time: timeStr }]);
    setEscalationWarning(null);
    setElapsed(0);
  };

  const statusButtons: { key: AlertStatus; labelEn: string; labelAr: string; color: string; bg: string; icon: string }[] = [
    { key: "en-route",  labelEn: "En Route",  labelAr: "في الطريق",  color: "#FACC15", bg: "rgba(250,204,21,0.12)",  icon: "ri-car-line" },
    { key: "on-scene",  labelEn: "On Scene",  labelAr: "في الموقع",  color: "#FB923C", bg: "rgba(251,146,60,0.12)",  icon: "ri-map-pin-2-fill" },
    { key: "resolved",  labelEn: "Resolved",  labelAr: "محلول",      color: "#4ADE80", bg: "rgba(74,222,128,0.12)",  icon: "ri-checkbox-circle-fill" },
    { key: "escalated", labelEn: "Escalate",  labelAr: "تصعيد",      color: "#F87171", bg: "rgba(248,113,113,0.12)", icon: "ri-arrow-up-line" },
  ];

  const elapsedMin = Math.floor(elapsed / 60);
  const elapsedSec = elapsed % 60;

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>

      {/* Alert header card */}
      <div className="mx-3 mt-3 rounded-2xl overflow-hidden" style={{ border: `2px solid ${cfg.color}55` }}>
        {/* Priority banner */}
        <div className="flex items-center gap-2 px-4 py-2" style={{ background: cfg.bg }}>
          <div className="w-2 h-2 rounded-full" style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }} />
          <span className="text-xs font-black font-['JetBrains_Mono'] uppercase tracking-widest" style={{ color: cfg.color }}>
            {isAr ? cfg.labelAr : cfg.label} — {isAr ? alert.ruleNameAr : alert.ruleName}
          </span>
        </div>

        {/* Person info */}
        <div className="p-4" style={{ background: "rgba(20,29,46,0.95)" }}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ border: `2px solid ${cfg.color}44` }}>
              <img src={alert.photo} alt="" className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-black font-['Inter'] leading-tight">{alert.personName}</p>
              <p className="text-gray-400 text-xs font-['Inter'] mt-0.5">{alert.nationalityFlag} {alert.nationality} · {alert.docNumber}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-black font-['JetBrains_Mono']" style={{ color: cfg.color }}>{alert.riskScore}</span>
                <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{isAr ? "درجة المخاطرة" : "Risk Score"}</span>
              </div>
            </div>
          </div>

          {/* Location + distance */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3" style={{ background: "rgba(11,18,32,0.7)", border: "1px solid rgba(181,142,60,0.15)" }}>
            <i className="ri-map-pin-2-fill text-gold-400 text-sm flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-['Inter'] truncate">{isAr ? alert.locationAr : alert.location}</p>
            </div>
            <span className="text-gold-400 text-xs font-bold font-['JetBrains_Mono'] flex-shrink-0">{alert.distance}</span>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer flex-shrink-0" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.25)" }}>
              <i className="ri-navigation-line text-gold-400 text-sm" />
            </button>
          </div>

          {/* Pattern explanation */}
          <div className="px-3 py-2.5 rounded-xl" style={{ background: "rgba(11,18,32,0.7)", border: `1px solid ${cfg.color}22` }}>
            <p className="text-gray-500 text-[9px] uppercase tracking-wider font-['JetBrains_Mono'] mb-1">{isAr ? "شرح النمط" : "Pattern Explanation"}</p>
            <p className="text-gray-300 text-xs font-['Inter'] leading-relaxed">{isAr ? alert.detailsAr : alert.details}</p>
          </div>
        </div>
      </div>

      {/* Escalation warning */}
      {escalationWarning && (
        <div className="mx-3 mt-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.4)" }}>
          <p className="text-red-400 text-xs font-['Inter'] font-semibold">{escalationWarning}</p>
        </div>
      )}

      {/* Elapsed timer */}
      {(status === "en-route" || status === "on-scene") && (
        <div className="mx-3 mt-2 flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{isAr ? "الوقت المنقضي" : "Elapsed"}</span>
          <span className="text-gold-400 text-sm font-black font-['JetBrains_Mono']">
            {String(elapsedMin).padStart(2, "0")}:{String(elapsedSec).padStart(2, "0")}
          </span>
        </div>
      )}

      {/* Map placeholder */}
      <div className="mx-3 mt-3 rounded-2xl overflow-hidden" style={{ height: "140px", border: "1px solid rgba(181,142,60,0.15)" }}>
        <div className="relative w-full h-full" style={{ background: "rgba(11,18,32,0.9)" }}>
          <img
            src="https://readdy.ai/api/search-image?query=dark%20minimalist%20city%20map%20of%20Muscat%20Oman%20with%20street%20grid%2C%20dark%20navy%20background%2C%20cyan%20accent%20roads%2C%20intelligence%20dashboard%20aesthetic%2C%20no%20labels&width=400&height=140&seq=alert-map-001&orientation=landscape"
            alt="Map" className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-gold-400 animate-pulse" style={{ boxShadow: "0 0 12px #D4A84B" }} />
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${cfg.color}22`, border: `2px solid ${cfg.color}` }}>
                <i className="ri-user-fill text-sm" style={{ color: cfg.color }} />
              </div>
            </div>
          </div>
          <div className="absolute bottom-2 right-2">
            <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-['JetBrains_Mono'] cursor-pointer" style={{ background: "rgba(11,18,32,0.9)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.3)" }}>
              <i className="ri-fullscreen-line text-[10px]" />
              {isAr ? "توسيع" : "Expand"}
            </button>
          </div>
        </div>
      </div>

      {/* Status buttons */}
      <div className="mx-3 mt-3">
        <p className="text-gray-500 text-[10px] uppercase tracking-wider font-['JetBrains_Mono'] mb-2">{isAr ? "تحديث الحالة" : "Update Status"}</p>
        <div className="grid grid-cols-2 gap-2">
          {statusButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => handleStatusChange(btn.key)}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold font-['Inter'] cursor-pointer transition-all"
              style={{
                background: status === btn.key ? btn.bg : "rgba(20,29,46,0.8)",
                color: btn.color,
                border: `1.5px solid ${status === btn.key ? btn.color : "rgba(255,255,255,0.08)"}`,
                boxShadow: status === btn.key ? `0 0 12px ${btn.color}33` : "none",
              }}
            >
              <i className={`${btn.icon} text-sm`} />
              {isAr ? btn.labelAr : btn.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Response timeline */}
      <div className="mx-3 mt-3 mb-4 rounded-2xl p-4" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-white text-xs font-bold font-['Inter'] uppercase tracking-wider mb-3">{isAr ? "الجدول الزمني للاستجابة" : "Response Timeline"}</p>
        <div className="space-y-2">
          {statusFlow.map((s, i) => {
            const entry = timeline.find((t) => t.status === s);
            const isActive = s === status;
            const isDone = entry !== undefined;
            const colors: Record<AlertStatus, string> = { new: "#F87171", "en-route": "#FACC15", "on-scene": "#FB923C", resolved: "#4ADE80", escalated: "#F87171" };
            const labels: Record<AlertStatus, { en: string; ar: string }> = {
              new: { en: "Alert Created", ar: "إنشاء التنبيه" },
              "en-route": { en: "En Route", ar: "في الطريق" },
              "on-scene": { en: "On Scene", ar: "في الموقع" },
              resolved: { en: "Resolved", ar: "محلول" },
              escalated: { en: "Escalated", ar: "مُصعَّد" },
            };
            return (
              <div key={s} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: isDone ? `${colors[s]}22` : "rgba(255,255,255,0.04)", border: `1.5px solid ${isDone ? colors[s] : "rgba(255,255,255,0.1)"}` }}>
                  {isDone ? <i className="ri-check-line text-[10px]" style={{ color: colors[s] }} /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-['Inter']" style={{ color: isDone ? "#D1D5DB" : "#4B5563" }}>{isAr ? labels[s].ar : labels[s].en}</p>
                </div>
                <span className="text-[10px] font-['JetBrains_Mono']" style={{ color: isDone ? colors[s] : "#374151" }}>
                  {entry?.time || "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AlertDetail;
