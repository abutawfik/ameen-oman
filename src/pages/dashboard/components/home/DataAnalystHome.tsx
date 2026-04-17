import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PERSONAL_QUEUE,
  SCORED_RECORDS,
  OSINT_SOURCES,
  SCORE_BAND_META,
  type PersonalQueueItem,
} from "@/mocks/osintData";
import SlaCountdown from "./shared/SlaCountdown";
import ScoreBadge from "./shared/ScoreBadge";

interface Props {
  isAr: boolean;
}

const severityMeta: Record<
  PersonalQueueItem["severity"],
  { color: string; bg: string; labelEn: string; labelAr: string }
> = {
  CRITICAL: { color: "#8A1F3C", bg: "rgba(138,31,60,0.15)",  labelEn: "CRITICAL", labelAr: "حرج" },
  HIGH:     { color: "#C94A5E", bg: "rgba(201,74,94,0.15)", labelEn: "HIGH",     labelAr: "مرتفع" },
  MEDIUM:   { color: "#C98A1B", bg: "rgba(201,138,27,0.15)", labelEn: "MEDIUM",   labelAr: "متوسط" },
  LOW:      { color: "#FACC15", bg: "rgba(250,204,21,0.15)", labelEn: "LOW",       labelAr: "منخفض" },
};

const typeIcon: Record<PersonalQueueItem["type"], string> = {
  alert: "ri-alarm-warning-line",
  case_note: "ri-file-text-line",
  reassignment: "ri-user-shared-line",
};

// Analyst home — tactical, "get through my queue" focus.
const DataAnalystHome = ({ isAr }: Props) => {
  const navigate = useNavigate();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const sortedQueue = useMemo(
    () => [...PERSONAL_QUEUE].sort((a, b) => new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime()),
    [],
  );

  const nextBreach = sortedQueue[0];
  const nextBreachMs = nextBreach ? new Date(nextBreach.slaDeadline).getTime() - now : 0;
  const nextBreachMins = Math.max(0, Math.floor(Math.abs(nextBreachMs) / 60_000));
  const nextBreachSecs = Math.max(0, Math.floor((Math.abs(nextBreachMs) % 60_000) / 1000));
  const isCrit = nextBreachMs > 0 && nextBreachMs < 5 * 60_000;

  const liveQueue = useMemo(
    () => [...SCORED_RECORDS].sort((a, b) => b.unifiedScore - a.unifiedScore).slice(0, 8),
    [],
  );

  // Mock "my recent actions" — scoped to the component per brief.
  const recentActions = [
    { icon: "ri-check-double-line", label: isAr ? "أُغلقت القضية مع تأكيد التهديد"  : "Closed case with confirmed threat", meta: "rec-000129 · Abdul R. Hashemi", ago: isAr ? "قبل 4د" : "4m ago", color: "#4ADE80" },
    { icon: "ri-user-shared-line",  label: isAr ? "تم تصعيد القضية إلى المشرف"       : "Escalated to supervisor",            meta: "demo-highrisk-sponsor · Petrov", ago: isAr ? "قبل 12د" : "12m ago", color: "#6B4FAE" },
    { icon: "ri-check-line",        label: isAr ? "تم الإشعار بالتنبيه"                : "Acked alert",                         meta: "rec-000131 · Hasan Al-Bakri",     ago: isAr ? "قبل 18د" : "18m ago", color: "#D6B47E" },
    { icon: "ri-close-circle-line", label: isAr ? "تمّ إغلاق التنبيه كـ 'إيجابي كاذب'"  : "Closed alert as false positive",       meta: "rec-000128 · Elena Marković",     ago: isAr ? "قبل 34د" : "34m ago", color: "#FACC15" },
    { icon: "ri-edit-line",         label: isAr ? "أُضيفت ملاحظة على السجل"           : "Added case note",                    meta: "demo-anomaly · Leila Benaissa",   ago: isAr ? "قبل 48د" : "48m ago", color: "#D6B47E" },
    { icon: "ri-check-line",        label: isAr ? "تم الإشعار بالتنبيه"                : "Acked alert",                         meta: "rec-000137 · Noor Al-Hakim",      ago: isAr ? "قبل 58د" : "58m ago", color: "#D6B47E" },
    { icon: "ri-check-double-line", label: isAr ? "أُغلقت القضية — مسار روتيني"        : "Closed case — routine routing",       meta: "rec-000132 · Priya Raman",        ago: isAr ? "قبل 1س 12د" : "1h 12m ago", color: "#4ADE80" },
    { icon: "ri-search-eye-line",   label: isAr ? "فُتح الشرح ومراجعته"                : "Opened explain + reviewed",           meta: "demo-borderline · Yasir Karim",   ago: isAr ? "قبل 1س 24د" : "1h 24m ago", color: "#6B4FAE" },
  ];

  // Hot signals — compact chips of deltas over 24h. Mock deltas; steady is fine for demo.
  const hotSignals = [
    { label: isAr ? "العقوبات" : "sanctions",          delta: "+12%", color: "#C94A5E", source: "OpenSanctions" },
    { label: isAr ? "شذوذ المسار" : "routing anomaly", delta: "+30%", color: "#6B4FAE", source: "OpenSky" },
    { label: isAr ? "تحذيرات السفر" : "advisories",    delta: "+8%",  color: "#D6B47E", source: "US/UK" },
    { label: isAr ? "كثافة النزاع" : "conflict GDELT", delta: "+18%", color: "#C98A1B", source: "GDELT" },
    { label: isAr ? "تفشٍ حيوي" : "biosec outbreak",   delta: "+3",   color: "#FACC15", source: "WHO" },
    { label: isAr ? "كيانات الكفيل" : "sponsor flags", delta: "+14%", color: "#4ADE80", source: "OpenCorporates" },
  ];

  const breachedCount = sortedQueue.filter((i) => new Date(i.slaDeadline).getTime() < now).length;
  const criticalCount = sortedQueue.filter((i) => i.severity === "CRITICAL").length;

  return (
    <div className="relative z-10 p-4 md:p-6 max-w-[1600px] mx-auto space-y-5">
      {/* 1. SLA countdown bar */}
      <div
        role="status"
        aria-live="polite"
        aria-label={isAr ? "مؤشّر مهلة الاستجابة" : "SLA watch"}
        className="rounded-xl border p-4 flex flex-col md:flex-row md:items-center gap-4"
        style={{
          background: isCrit
            ? "linear-gradient(135deg, rgba(201,74,94,0.15), rgba(10,37,64,0.85))"
            : "linear-gradient(135deg, rgba(184,138,60,0.08), rgba(10,37,64,0.75))",
          borderColor: isCrit ? "rgba(201,74,94,0.35)" : "rgba(184,138,60,0.2)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 flex items-center justify-center rounded-xl ${isCrit ? "animate-pulse" : ""}`}
            style={{
              background: isCrit ? "rgba(201,74,94,0.2)" : "rgba(184,138,60,0.15)",
              border: isCrit ? "1px solid rgba(201,74,94,0.5)" : "1px solid rgba(184,138,60,0.3)",
            }}
          >
            <i className={`ri-timer-flash-line text-xl ${isCrit ? "text-red-400" : "text-gold-400"}`} />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest font-['JetBrains_Mono'] text-gray-500">
              {isAr ? "مهلة الاستجابة" : "SLA WATCH"}
            </div>
            <div className="text-white font-bold text-sm">
              {sortedQueue.length} {isAr ? "تنبيهات مُسندة إليك" : "alerts assigned to you"}
              <span className="text-gray-600 mx-2">·</span>
              <span className={isCrit ? "text-red-400" : "text-gold-400"}>
                {criticalCount} {isAr ? "حرجة" : "critical"}
              </span>
              {breachedCount > 0 && (
                <>
                  <span className="text-gray-600 mx-2">·</span>
                  <span className="text-red-400">
                    {breachedCount} {isAr ? "متأخرة" : "breached"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="md:ml-auto flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-bold tracking-widest font-['JetBrains_Mono'] text-gray-500">
              {isAr ? "أقرب مهلة تنتهي في" : "NEXT BREACH IN"}
            </div>
            <div
              className={`text-3xl font-black font-['JetBrains_Mono'] ${isCrit ? "animate-pulse" : ""}`}
              style={{ color: isCrit ? "#C94A5E" : "#D6B47E" }}
            >
              {nextBreachMins}m {nextBreachSecs.toString().padStart(2, "0")}s
            </div>
          </div>
        </div>
      </div>

      {/* 2. Two-panel row: My Queue + Live Operator Queue */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* My Queue (5/12) */}
        <div
          className="xl:col-span-5 rounded-xl border"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
            <div>
              <h3 className="text-white text-sm font-bold">
                {isAr ? "قائمتي" : "My Queue"}
              </h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "مُرتَّبة حسب أقرب مهلة" : "sorted by earliest SLA"}
              </p>
            </div>
            <span
              className="px-2 py-0.5 rounded-md text-[10px] font-bold font-['JetBrains_Mono'] tracking-widest"
              style={{ background: "rgba(184,138,60,0.12)", color: "#D6B47E" }}
            >
              {sortedQueue.length}
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(184,138,60,0.05)" }}>
            {sortedQueue.map((item) => {
              const sev = severityMeta[item.severity];
              return (
                <div
                  key={item.id}
                  className="px-4 py-3 hover:bg-white/[0.02] transition-colors"
                  style={{ borderColor: "rgba(184,138,60,0.05)" }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="px-2 py-0.5 rounded-md text-[9px] font-bold tracking-widest font-['JetBrains_Mono'] flex-shrink-0 mt-0.5"
                      style={{ background: sev.bg, color: sev.color, border: `1px solid ${sev.color}55` }}
                    >
                      {isAr ? sev.labelAr : sev.labelEn}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <i className={`${typeIcon[item.type]} text-gray-500 text-xs`} />
                        <span className="text-white text-xs font-semibold truncate">
                          {isAr ? item.titleAr : item.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-['JetBrains_Mono'] truncate">
                        {item.subject}
                      </div>
                    </div>
                    <SlaCountdown deadline={item.slaDeadline} isAr={isAr} compact />
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5 pl-[72px]">
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer font-['JetBrains_Mono'] tracking-wider"
                      style={{ background: "rgba(74,222,128,0.1)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.3)" }}
                    >
                      {isAr ? "إشعار" : "ACK"}
                    </button>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer font-['JetBrains_Mono'] tracking-wider"
                      style={{ background: "rgba(107,79,174,0.1)", color: "#6B4FAE", border: "1px solid rgba(107,79,174,0.3)" }}
                    >
                      {isAr ? "تصعيد" : "ESCALATE"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard/osint-risk-engine")}
                      className="px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer font-['JetBrains_Mono'] tracking-wider ml-auto"
                      style={{ background: "rgba(184,138,60,0.1)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.3)" }}
                    >
                      {isAr ? "فتح" : "OPEN"} →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Operator Queue (7/12) */}
        <div
          className="xl:col-span-7 rounded-xl border overflow-hidden"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
            <div>
              <h3 className="text-white text-sm font-bold">
                {isAr ? "قائمة المشغّل المباشرة" : "Live Operator Queue"}
              </h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "أعلى الدرجات خلال 24 ساعة" : "top unified scores · last 24h"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/osint-risk-engine")}
              className="text-[11px] text-gold-400 font-semibold hover:text-gold-300 font-['JetBrains_Mono']"
            >
              {isAr ? "عرض الكل" : "view all"} →
            </button>
          </div>
          <div>
            <div
              className="grid grid-cols-12 gap-2 px-4 py-2 border-b text-[9px] font-bold tracking-widest uppercase font-['JetBrains_Mono']"
              style={{ borderColor: "rgba(184,138,60,0.05)", color: "#6B7280" }}
            >
              <div className="col-span-1">{isAr ? "درجة" : "Score"}</div>
              <div className="col-span-4">{isAr ? "المسافر" : "Traveler"}</div>
              <div className="col-span-2">{isAr ? "الجنسية" : "Nat."}</div>
              <div className="col-span-3">{isAr ? "رحلة" : "Flight"}</div>
              <div className="col-span-2">{isAr ? "النقطة" : "Point"}</div>
            </div>
            {liveQueue.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => navigate("/dashboard/osint-risk-engine")}
                className="w-full grid grid-cols-12 gap-2 px-4 py-2.5 border-b cursor-pointer text-left hover:bg-white/[0.03] transition-colors items-center"
                style={{ borderColor: "rgba(184,138,60,0.04)" }}
              >
                <div className="col-span-1">
                  <ScoreBadge score={r.unifiedScore} band={r.band} size="sm" />
                </div>
                <div className="col-span-4 min-w-0">
                  <div className="text-white text-xs font-semibold truncate">{r.travelerName}</div>
                  <div className="text-gray-600 text-[10px] font-['JetBrains_Mono'] truncate">
                    {r.passportNumber}
                  </div>
                </div>
                <div className="col-span-2 text-gray-400 text-[11px] font-['JetBrains_Mono']">
                  {r.nationality}
                </div>
                <div className="col-span-3 min-w-0">
                  <div className="text-gray-300 text-[11px] font-['JetBrains_Mono']">
                    {r.carrierIata} {r.flightNumber}
                  </div>
                  <div className="text-gray-600 text-[10px] font-['JetBrains_Mono'] truncate">
                    {r.originIata} → {r.destIata}
                  </div>
                </div>
                <div className="col-span-2">
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider font-['JetBrains_Mono']"
                    style={{
                      background: r.decisionPoint === "ETA" ? "rgba(184,138,60,0.1)" : "rgba(107,79,174,0.1)",
                      color: r.decisionPoint === "ETA" ? "#D6B47E" : "#6B4FAE",
                    }}
                  >
                    {r.decisionPoint}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recent Actions + 4. Hot Signals (side-by-side for breathing room) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div
          className="xl:col-span-7 rounded-xl border"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
            <div>
              <h3 className="text-white text-sm font-bold">
                {isAr ? "أحدث أفعالي" : "My Recent Actions"}
              </h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "آخر 8 أحداث" : "last 8 events"}
              </p>
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(184,138,60,0.05)" }}>
            {recentActions.map((a, i) => (
              <div key={i} className="px-4 py-2.5 flex items-center gap-3" style={{ borderColor: "rgba(184,138,60,0.05)" }}>
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: `${a.color}15`, border: `1px solid ${a.color}30` }}
                >
                  <i className={`${a.icon} text-sm`} style={{ color: a.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-semibold truncate">{a.label}</div>
                  <div className="text-gray-600 text-[10px] font-['JetBrains_Mono'] truncate">{a.meta}</div>
                </div>
                <span className="text-gray-500 text-[10px] font-['JetBrains_Mono'] flex-shrink-0">{a.ago}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="xl:col-span-5 rounded-xl border"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
            <div>
              <h3 className="text-white text-sm font-bold flex items-center gap-2">
                <span>{isAr ? "الإشارات الساخنة" : "Hot Signals"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              </h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "تغيّر 24 ساعة" : "24h delta · OSINT sources"}
              </p>
            </div>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {hotSignals.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg"
                style={{ background: `${s.color}10`, border: `1px solid ${s.color}33` }}
              >
                <div className="min-w-0">
                  <div className="text-white text-xs font-bold truncate">{s.label}</div>
                  <div className="text-gray-600 text-[9px] font-['JetBrains_Mono'] truncate">{s.source}</div>
                </div>
                <span
                  className="text-xs font-black font-['JetBrains_Mono'] flex-shrink-0"
                  style={{ color: s.color }}
                >
                  {s.delta}
                </span>
              </div>
            ))}
          </div>
          {/* Bonus: live source summary strip */}
          <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: "rgba(184,138,60,0.06)" }}>
            <div className="flex items-center gap-3 text-[10px] font-['JetBrains_Mono'] text-gray-500">
              <span>{isAr ? "المصادر حيّة:" : "sources live:"}</span>
              <span className="text-green-400 font-bold">
                {OSINT_SOURCES.filter((s) => s.status === "healthy").length}/{OSINT_SOURCES.length}
              </span>
              {(() => {
                const top = [...OSINT_SOURCES].sort((a, b) => b.records24h - a.records24h).slice(0, 1)[0];
                return (
                  <span className="ml-auto">
                    {isAr ? "الأعلى:" : "top:"} <span className="text-white">{top.name}</span> ·{" "}
                    <span style={{ color: SCORE_BAND_META.elevated.color }}>
                      {top.records24h.toLocaleString()}
                    </span>
                  </span>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAnalystHome;
