// Subject Activity Timeline — end-to-end intelligence picture for a single subject.
// Three predictive enhancements over the baseline version:
//   1. Velocity scoring    — same-type events in a tight window amplify per-event
//      risk deltas (5 SIMs in 33 min scores like a critical cluster, not 5 unrelated SIMs).
//   2. Behavioral fingerprints — known cross-stream patterns (Shadow Corridor, Rapid
//      Comms Setup, etc.) fire proactive alerts before individual thresholds trigger.
//   3. Cross-entity propagation — wire-transfer recipients/exchange locations checked
//      against the FIU watchlist; linked-entity alerts add to the subject's score.

import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import {
  useSubjectFeed, runDemoScenario, clearSubjectEvents,
  DEMO_SUBJECT,
  type AmeenEvent, type EventSeverity, type EventCategory,
} from "@/services/ameenEventBus";
import {
  computeVelocityMultiplier, detectPatterns, detectLinkedEntities,
  type PatternMatch, type LinkedEntityAlert,
} from "@/services/patternDetector";

const DEMO_IMEI = "352819110123456";

// ── Metadata maps ─────────────────────────────────────────────────────────────

const SEVERITY_META: Record<EventSeverity, { color: string; bg: string; label: string; labelAr: string; icon: string }> = {
  clear:    { color: "#4ADE80", bg: "rgba(74,222,128,0.10)",  label: "Clear",    labelAr: "نظيف",    icon: "ri-check-line" },
  info:     { color: "#60A5FA", bg: "rgba(96,165,250,0.10)",  label: "Info",     labelAr: "معلومة",  icon: "ri-information-line" },
  review:   { color: "#FACC15", bg: "rgba(250,204,21,0.10)",  label: "Review",   labelAr: "مراجعة",  icon: "ri-eye-line" },
  flagged:  { color: "#F97316", bg: "rgba(249,115,22,0.10)",  label: "Flagged",  labelAr: "مُعلَّم", icon: "ri-flag-line" },
  critical: { color: "#C94A5E", bg: "rgba(201,74,94,0.12)",   label: "Critical", labelAr: "حرج",     icon: "ri-alarm-warning-line" },
};

const CATEGORY_META: Record<EventCategory, { label: string; labelAr: string; color: string; icon: string }> = {
  rop_internal:    { label: "ROP Internal",    labelAr: "داخلي — ROP",   color: "#60A5FA", icon: "ri-shield-star-line" },
  border:          { label: "Border / AMR",    labelAr: "حدود / AMR",    color: "#D6B47E", icon: "ri-passport-line" },
  hotel:           { label: "Hotel",           labelAr: "فندق",          color: "#4A7AA8", icon: "ri-hotel-bed-line" },
  car_rental:      { label: "Car Rental",      labelAr: "تأجير سيارة",   color: "#4ADE80", icon: "ri-car-line" },
  mobile:          { label: "Mobile / SIM",    labelAr: "جوال / SIM",    color: "#A78BFA", icon: "ri-sim-card-line" },
  financial:       { label: "Financial",       labelAr: "مالي",          color: "#FACC15", icon: "ri-exchange-dollar-line" },
  alert:           { label: "System Alert",    labelAr: "تنبيه النظام",  color: "#C94A5E", icon: "ri-alarm-warning-line" },
  risk_assessment: { label: "Risk Assessment", labelAr: "تقييم المخاطر", color: "#8A1F3C", icon: "ri-gauge-line" },
};

const EVENT_TYPE_LABEL: Record<string, { en: string; ar: string }> = {
  VISA_ISSUED:          { en: "Visa Issued",               ar: "إصدار تأشيرة" },
  BORDER_ENTRY:         { en: "Border Entry (AMR)",        ar: "دخول حدودي (AMR)" },
  HOTEL_CHECKIN:        { en: "Hotel Check-In",            ar: "تسجيل دخول فندق" },
  HOTEL_CHECKOUT:       { en: "Hotel Check-Out",           ar: "تسجيل خروج فندق" },
  CAR_PICKUP:           { en: "Vehicle Pick-Up",           ar: "استلام مركبة" },
  CAR_DROPOFF:          { en: "Vehicle Drop-Off",          ar: "إعادة مركبة" },
  SIM_ACTIVATION:       { en: "SIM Activation",            ar: "تفعيل شريحة SIM" },
  IMEI_MULTI_SIM_ALERT: { en: "⚠ Multi-SIM on Same IMEI", ar: "⚠ شرائح متعددة على نفس IMEI" },
  WIRE_TRANSFER:        { en: "Wire Transfer",             ar: "تحويل بنكي" },
  CURRENCY_EXCHANGE:    { en: "Currency Exchange",         ar: "صرف عملة" },
  AML_THRESHOLD_ALERT:  { en: "⚠ AML Threshold Breach",   ar: "⚠ خرق حد غسل الأموال" },
  RISK_ASSESSMENT:      { en: "Risk Assessment Generated", ar: "إنشاء تقييم مخاطر" },
};

// ── Risk score simulation ─────────────────────────────────────────────────────
// Base deltas per event type. Velocity scoring in computeRunningScore will
// multiply these when same-type events cluster within their time window.

const SCORE_DELTA: Record<string, number> = {
  VISA_ISSUED:          0,
  BORDER_ENTRY:         0,
  HOTEL_CHECKIN:        0,
  CAR_PICKUP:           2,
  SIM_ACTIVATION:       4,
  IMEI_MULTI_SIM_ALERT: 18,
  WIRE_TRANSFER:        10,
  AML_THRESHOLD_ALERT:  10,
  RISK_ASSESSMENT:      0,
};

interface ScoredEvent {
  ev: AmeenEvent;
  score: number;
  velocityMult: number; // 1.0 = no velocity boost
}

function computeRunningScore(events: AmeenEvent[]): ScoredEvent[] {
  let score = 12;
  return events.map((ev, i) => {
    const mult  = computeVelocityMultiplier(events, i);
    const delta = Math.round((SCORE_DELTA[ev.eventType] ?? 0) * mult);
    score = Math.min(100, score + delta);
    return { ev, score, velocityMult: mult };
  });
}

// ── Rasad classified intel (hardcoded for demo subject) ──────────────────────

const RASAD_INTEL = {
  records: [
    {
      source: "HUMINT Bulletin IB-0412",
      classification: "RESTRICTED",
      color: "#F97316",
      en: "Subject was observed meeting with a previously flagged individual at a transit hub in Istanbul (2025-Q4). Nature of contact: unknown.",
      ar: "رُصد الشخص في اجتماع مع فرد مُعلَّم سابقاً في مطار عبور باسطنبول (2025-Q4). طبيعة الاتصال: غير معروفة.",
    },
    {
      source: "Financial Intelligence Unit — Ref FIU-226",
      classification: "INTERNAL",
      color: "#FACC15",
      en: "Subject's name appears as a secondary signatory on an account linked to a sanctioned entity (two hops). Account frozen 2025-11.",
      ar: "اسم الشخص يظهر كموقِّع ثانوي على حساب مرتبط بكيان خاضع للعقوبات (درجتان). الحساب مُجمَّد منذ 2025-11.",
    },
    {
      source: "Partner Service Exchange — Ref PSE-0089",
      classification: "CLASSIFIED",
      color: "#C94A5E",
      en: "Prior travel pattern matches known logistics profile for undeclared goods movement across Levant corridor.",
      ar: "نمط السفر السابق يطابق ملفاً لوجستياً معروفاً لحركة بضائع غير مُصرَّح بها عبر ممر المشرق.",
    },
  ],
  scoreDelta: 18,
};

// ── Velocity badge ────────────────────────────────────────────────────────────

const VelocityBadge = ({ mult }: { mult: number }) => (
  <span
    className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold font-['JetBrains_Mono'] whitespace-nowrap"
    style={{
      background: "rgba(249,115,22,0.12)",
      color: "#F97316",
      border: "1px solid rgba(249,115,22,0.35)",
    }}
  >
    <i className="ri-flashlight-line" />
    ×{mult.toFixed(1)}
  </span>
);

// ── Timeline event row ────────────────────────────────────────────────────────

const TimelineRow = ({
  ev, isAr, runningScore, isLast, velocityMult,
}: {
  ev: AmeenEvent;
  isAr: boolean;
  runningScore: number;
  isLast: boolean;
  velocityMult: number;
}) => {
  const sev       = SEVERITY_META[ev.severity ?? "info"];
  const cat       = ev.category ? CATEGORY_META[ev.category] : null;
  const typeLabel = EVENT_TYPE_LABEL[ev.eventType] ?? { en: ev.eventType, ar: ev.eventType };
  const isAlert      = ev.category === "alert";
  const isRiskAssess = ev.category === "risk_assessment";
  const showVelocity = velocityMult > 1.0 && (SCORE_DELTA[ev.eventType] ?? 0) > 0;
  const timeStr = ev.occurredAt
    ? new Date(ev.occurredAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : ev.timestamp;

  return (
    <div className={`relative flex gap-4 ${!isLast ? "pb-5" : ""}`}>
      {/* Vertical connector */}
      {!isLast && (
        <div
          className="absolute left-[19px] top-8 bottom-0 w-px"
          style={{ background: isAlert || isRiskAssess ? `${sev.color}40` : "rgba(184,138,60,0.12)" }}
        />
      )}

      {/* Icon bubble */}
      <div
        className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full z-10"
        style={{
          background: sev.bg,
          border: `2px solid ${sev.color}66`,
          boxShadow: isAlert || isRiskAssess ? `0 0 12px ${sev.color}30` : "none",
        }}
      >
        <i className={cat?.icon ?? "ri-circle-line"} style={{ color: sev.color, fontSize: "1rem" }} />
      </div>

      {/* Content */}
      <div
        className={`flex-1 rounded-xl border p-3.5 mb-1 ${isAlert ? "border-l-4" : ""}`}
        style={{
          background: isAlert || isRiskAssess ? sev.bg : "rgba(10,37,64,0.55)",
          borderColor: isAlert || isRiskAssess ? sev.color : "rgba(184,138,60,0.10)",
          borderLeftColor: isAlert ? sev.color : undefined,
        }}
      >
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-500 text-[11px] font-['JetBrains_Mono']">{timeStr}</span>
            <span className="text-white text-sm font-bold">{isAr ? typeLabel.ar : typeLabel.en}</span>
            {cat && (
              <span
                className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest font-['JetBrains_Mono']"
                style={{ background: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}40` }}
              >
                {isAr ? cat.labelAr : cat.label}
              </span>
            )}
          </div>

          {/* Score + velocity */}
          <div className="flex items-center gap-2">
            {showVelocity && <VelocityBadge mult={velocityMult} />}
            <span className="text-[10px] font-['JetBrains_Mono'] text-gray-600">
              {isAr ? "درجة" : "score"}
            </span>
            <span
              className="font-black font-['JetBrains_Mono'] text-sm"
              style={{ color: runningScore >= 70 ? "#C94A5E" : runningScore >= 40 ? "#F97316" : "#4ADE80" }}
            >
              {runningScore}
            </span>
          </div>
        </div>

        {/* Detail lines */}
        <div className="mt-1.5 space-y-1">
          {ev.hotelBranch && (
            <p className="text-gray-400 text-xs">
              <i className="ri-hotel-line mr-1" />
              {ev.hotelBranch}{ev.roomNumber ? ` · Rm ${ev.roomNumber}` : ""}
            </p>
          )}
          {ev.vehicleModel && (
            <p className="text-gray-400 text-xs">
              <i className="ri-car-line mr-1" />
              {ev.vehicleModel} · {ev.vehiclePlate}
            </p>
          )}
          {ev.msisdn && (
            <p className="text-gray-400 text-xs font-['JetBrains_Mono']">
              <i className="ri-sim-card-line mr-1" />
              {ev.msisdn}
              {ev.imei && <span className="ml-2 text-gray-600">IMEI: {ev.imei}</span>}
            </p>
          )}
          {ev.simCount && (
            <p className="text-xs font-['JetBrains_Mono']" style={{ color: sev.color }}>
              <i className="ri-sim-card-2-line mr-1" />
              {ev.simCount} SIMs · IMEI: {ev.imei}
            </p>
          )}
          {ev.amount !== undefined && (
            <p className="text-xs font-['JetBrains_Mono']" style={{ color: sev.color }}>
              <i className="ri-money-dollar-circle-line mr-1" />
              {ev.currency} {ev.amount?.toLocaleString()}
              {ev.transferTo && <span className="text-gray-500 ml-2">→ {ev.transferTo}</span>}
            </p>
          )}
          {ev.location && (
            <p className="text-gray-600 text-[11px]">
              <i className="ri-map-pin-line mr-1" />{ev.location}
            </p>
          )}
          {ev.riskFlag && (
            <p className="mt-1 text-xs font-semibold" style={{ color: sev.color }}>
              <i className={`${sev.icon} mr-1`} />
              {isAr ? ev.riskFlagAr : ev.riskFlag}
            </p>
          )}
          <p className="text-gray-700 text-[10px] font-['JetBrains_Mono']">{ev.ameenRef}</p>
        </div>
      </div>
    </div>
  );
};

// ── Behavioral fingerprint card ───────────────────────────────────────────────

const FingerprintCard = ({ match, isAr }: { match: PatternMatch; isAr: boolean }) => {
  const isCritical = match.severity === "critical";
  const color = isCritical ? "#C94A5E" : "#F97316";
  const bg    = isCritical ? "rgba(201,74,94,0.08)" : "rgba(249,115,22,0.08)";
  const border = isCritical ? "rgba(201,74,94,0.35)" : "rgba(249,115,22,0.35)";

  return (
    <div
      className="rounded-xl border p-3.5"
      style={{ background: bg, borderColor: border }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest font-['JetBrains_Mono']"
            style={{ background: `${color}15`, color, border: `1px solid ${color}40` }}
          >
            {isAr ? (isCritical ? "حرج" : "مُعلَّم") : match.severity.toUpperCase()}
          </span>
          <span className="text-white text-sm font-bold">
            {isAr ? match.nameAr : match.name}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[9px] font-['JetBrains_Mono']" style={{ color }}>
            {isAr ? "ثقة" : "conf"} {match.confidence}%
          </span>
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-bold font-['JetBrains_Mono']"
            style={{ background: `${color}15`, color }}
          >
            +{match.scoreDelta}
          </span>
        </div>
      </div>
      <p className="text-gray-400 text-xs leading-relaxed">
        {isAr ? match.descriptionAr : match.description}
      </p>
    </div>
  );
};

// ── Linked entity alert card ──────────────────────────────────────────────────

const LinkedEntityCard = ({ alert, isAr }: { alert: LinkedEntityAlert; isAr: boolean }) => (
  <div
    className="rounded-xl border p-3.5"
    style={{ background: "rgba(250,204,21,0.05)", borderColor: "rgba(250,204,21,0.25)" }}
  >
    <div className="flex items-start justify-between gap-2 mb-2">
      <div className="flex items-center gap-2 flex-wrap">
        <i className="ri-links-line text-yellow-400 text-xs" />
        <span className="text-yellow-300 text-xs font-bold">
          {isAr ? alert.linkTypeAr : alert.linkType}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-[10px] font-['JetBrains_Mono']" style={{ color: "#FACC15" }}>
          {isAr ? "درجة الكيان" : "entity"} {alert.riskScore}
        </span>
        <span
          className="px-1.5 py-0.5 rounded text-[10px] font-bold font-['JetBrains_Mono']"
          style={{ background: "rgba(250,204,21,0.12)", color: "#FACC15" }}
        >
          +{alert.scoreDelta}
        </span>
      </div>
    </div>
    <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] truncate mb-1.5">
      {alert.entityName}
    </p>
    <p className="text-gray-400 text-xs leading-relaxed">
      {isAr ? alert.reasonAr : alert.reason}
    </p>
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────

const SubjectTimelinePage = () => {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const events    = useSubjectFeed(DEMO_SUBJECT.subjectId);
  const [running, setRunning]         = useState(false);
  const [rasadQueried, setRasadQueried] = useState(false);
  const [rasadLoading, setRasadLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Chronological sort
  const sorted = [...events].sort((a, b) => {
    const ta = a.occurredAt ?? a.timestamp;
    const tb = b.occurredAt ?? b.timestamp;
    return ta < tb ? -1 : ta > tb ? 1 : 0;
  });

  // Velocity-aware running score
  const scored     = computeRunningScore(sorted);
  const finalScore = scored.length ? scored[scored.length - 1].score : 12;
  const rasadScore = rasadQueried ? Math.min(100, finalScore + RASAD_INTEL.scoreDelta) : finalScore;

  // Intelligence analysis
  const patterns      = detectPatterns(sorted);
  const linkedAlerts  = detectLinkedEntities(sorted);
  const patternsDelta = patterns.reduce((s, p) => s + p.scoreDelta, 0);
  const linkedDelta   = linkedAlerts.reduce((s, a) => s + a.scoreDelta, 0);

  // Displayed composite score (OSINT + patterns + linked entities + Rasad)
  const compositeScore = Math.min(
    100,
    (rasadQueried ? rasadScore : finalScore) + patternsDelta + linkedDelta,
  );

  // Flags
  const hasCritical  = events.some((e) => e.severity === "critical");
  const simEvents    = events.filter((e) => e.eventType === "SIM_ACTIVATION");
  const hasIMEIAlert = events.some((e) => e.eventType === "IMEI_MULTI_SIM_ALERT");
  const hasAML       = events.some((e) => e.eventType === "AML_THRESHOLD_ALERT");
  const hasVelocity  = scored.some((s) => s.velocityMult > 1.0);
  const hasPatterns  = patterns.length > 0;

  const handleRunScenario = () => {
    setRunning(true);
    setRasadQueried(false);
    runDemoScenario(() => setRunning(false));
  };

  const handleQueryRasad = () => {
    setRasadLoading(true);
    setTimeout(() => { setRasadLoading(false); setRasadQueried(true); }, 2200);
  };

  // Score label for ring — keep short to fit under the ring
  const scoreColor = compositeScore >= 70 ? "#C94A5E" : compositeScore >= 40 ? "#F97316" : "#4ADE80";
  const scoreLabel = rasadQueried
    ? "OSINT+RASAD"
    : (hasPatterns || linkedAlerts.length > 0)
      ? "COMPOSITE"
      : "OSINT";

  return (
    <div className="min-h-screen" style={{ background: "#051428" }}>
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-8">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <i className="ri-user-follow-line text-xl" style={{ color: "#D6B47E" }} />
              <h1 className="text-white font-bold text-2xl font-['Inter']">
                {isAr ? "الجدول الزمني للنشاط — جلسة تحليل" : "Subject Activity Timeline"}
              </h1>
            </div>
            <p className="text-gray-500 text-sm">
              {isAr
                ? "عرض موحَّد لجميع الأحداث المرتبطة بشخص عبر جميع مصادر البيانات · سرعة التوالي · البصمات السلوكية"
                : "Unified cross-source view · hotel · car · mobile · financial · ROP internal · velocity scoring · fingerprints"}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => { clearSubjectEvents(DEMO_SUBJECT.subjectId); setRasadQueried(false); }}
              disabled={running || events.length === 0}
              className="px-4 py-2 rounded-lg text-sm border cursor-pointer transition-all disabled:opacity-40"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "#6B7280" }}
            >
              <i className="ri-delete-bin-line mr-1.5" />
              {isAr ? "مسح" : "Clear"}
            </button>
            <button
              onClick={handleRunScenario}
              disabled={running}
              className="px-5 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all flex items-center gap-2 disabled:opacity-60"
              style={{
                background: "rgba(184,138,60,0.12)",
                border: "1px solid rgba(184,138,60,0.4)",
                color: "#D6B47E",
              }}
            >
              {running
                ? <><i className="ri-loader-2-line animate-spin" /> {isAr ? "جارٍ التشغيل…" : "Running scenario…"}</>
                : <><i className="ri-play-circle-line" /> {isAr ? "تشغيل السيناريو التجريبي" : "Run demo scenario"}</>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">

          {/* ── Left: subject card + alerts + timeline ─────────────────────── */}
          <div className="col-span-12 lg:col-span-7 space-y-5">

            {/* Subject profile card */}
            <div
              className="rounded-xl border p-5 flex items-center gap-5 flex-wrap"
              style={{
                background: "rgba(10,37,64,0.7)",
                borderColor: hasCritical ? "rgba(201,74,94,0.4)" : "rgba(184,138,60,0.15)",
              }}
            >
              <div
                className="w-14 h-14 flex items-center justify-center rounded-full flex-shrink-0"
                style={{ background: "rgba(184,138,60,0.10)", border: "2px solid rgba(184,138,60,0.3)" }}
              >
                <i className="ri-user-3-line text-2xl" style={{ color: "#D6B47E" }} />
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-white font-bold text-lg">{DEMO_SUBJECT.subjectName}</h2>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-bold font-['JetBrains_Mono']"
                    style={{ background: "rgba(96,165,250,0.1)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.3)" }}
                  >
                    {DEMO_SUBJECT.subjectNationality}
                  </span>
                  {hasCritical && (
                    <span
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest font-['JetBrains_Mono']"
                      style={{ background: "rgba(201,74,94,0.15)", color: "#C94A5E", border: "1px solid rgba(201,74,94,0.4)" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
                      {isAr ? "خطر مرتفع" : "HIGH RISK"}
                    </span>
                  )}
                  {hasVelocity && (
                    <span
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest font-['JetBrains_Mono']"
                      style={{ background: "rgba(249,115,22,0.12)", color: "#F97316", border: "1px solid rgba(249,115,22,0.35)" }}
                    >
                      <i className="ri-flashlight-line" />
                      {isAr ? "سرعة توالٍ" : "VELOCITY"}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm font-['JetBrains_Mono'] mt-0.5">
                  {DEMO_SUBJECT.subjectDocNumber} · {isAr ? "وصل إلى عُمان" : "Arrived in Oman"} · 2026-05-08
                </p>
              </div>
              {/* Composite score ring */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-16 h-16 flex flex-col items-center justify-center rounded-full"
                  style={{
                    background: compositeScore >= 70 ? "rgba(201,74,94,0.15)" : "rgba(249,115,22,0.12)",
                    border: `3px solid ${scoreColor}55`,
                  }}
                >
                  <span
                    className="font-black text-xl font-['JetBrains_Mono'] leading-none"
                    style={{ color: scoreColor }}
                  >
                    {compositeScore}
                  </span>
                </div>
                <span className="text-[9px] font-['JetBrains_Mono'] text-gray-500 tracking-wide text-center">
                  {scoreLabel}
                </span>
              </div>
            </div>

            {/* Flag summary bar */}
            {(hasIMEIAlert || hasAML) && (
              <div
                className="rounded-xl border p-4 flex flex-wrap gap-3"
                style={{ background: "rgba(201,74,94,0.07)", borderColor: "rgba(201,74,94,0.35)" }}
              >
                <span className="text-sm font-bold" style={{ color: "#C94A5E" }}>
                  <i className="ri-alarm-warning-line mr-1" />
                  {isAr ? "تنبيهات النظام" : "System flags"}
                </span>
                {hasIMEIAlert && (
                  <span
                    className="px-2 py-1 rounded-md text-xs font-bold font-['JetBrains_Mono']"
                    style={{ background: "rgba(167,139,250,0.12)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.35)" }}
                  >
                    <i className="ri-sim-card-2-line mr-1" />
                    {simEvents.length} SIMs · {isAr ? "نفس IMEI" : "same IMEI"} · {DEMO_IMEI}
                  </span>
                )}
                {hasAML && (
                  <span
                    className="px-2 py-1 rounded-md text-xs font-bold font-['JetBrains_Mono']"
                    style={{ background: "rgba(250,204,21,0.10)", color: "#FACC15", border: "1px solid rgba(250,204,21,0.35)" }}
                  >
                    <i className="ri-money-dollar-circle-line mr-1" />
                    {isAr ? "خرق AML · OMR 5,000" : "AML breach · OMR 5,000"}
                  </span>
                )}
              </div>
            )}

            {/* Behavioral fingerprint alert banner (compact, in-line) */}
            {hasPatterns && (
              <div
                className="rounded-xl border p-4 flex items-start gap-3"
                style={{ background: "rgba(201,74,94,0.06)", borderColor: "rgba(201,74,94,0.4)" }}
              >
                <i className="ri-dna-line text-red-400 text-base flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-red-400 text-xs font-bold mb-1">
                    {isAr
                      ? `${patterns.length} بصمة سلوكية مكتشفة — راجع اللوحة اليمنى`
                      : `${patterns.length} behavioral fingerprint${patterns.length > 1 ? "s" : ""} matched — see right panel`}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {patterns.map((p) => (
                      <span
                        key={p.id}
                        className="px-2 py-0.5 rounded text-[10px] font-bold font-['JetBrains_Mono']"
                        style={{ background: "rgba(201,74,94,0.12)", color: "#C94A5E", border: "1px solid rgba(201,74,94,0.3)" }}
                      >
                        {isAr ? p.nameAr : p.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            {sorted.length === 0 ? (
              <div
                className="rounded-xl border p-12 text-center"
                style={{ background: "rgba(10,37,64,0.55)", borderColor: "rgba(184,138,60,0.1)", borderStyle: "dashed" }}
              >
                <i className="ri-time-line text-4xl text-gray-700 block mb-3" />
                <p className="text-gray-500 text-sm mb-2">
                  {isAr ? "لا أحداث بعد لهذا الشخص" : "No events yet for this subject"}
                </p>
                <p className="text-gray-700 text-xs">
                  {isAr
                    ? "اضغط \"تشغيل السيناريو التجريبي\" لمشاهدة الأحداث تصل في الوقت الحقيقي"
                    : "Click \"Run demo scenario\" to watch events arrive in real time"}
                </p>
              </div>
            ) : (
              <div
                className="rounded-xl border p-5"
                style={{ background: "rgba(10,37,64,0.55)", borderColor: "rgba(184,138,60,0.10)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-sm font-bold flex items-center gap-2">
                    <i className="ri-timeline-view" style={{ color: "#D6B47E" }} />
                    {isAr ? "الجدول الزمني للنشاط" : "Activity timeline"}
                    <span
                      className="px-1.5 py-0.5 rounded-full text-[10px] font-['JetBrains_Mono']"
                      style={{ background: "rgba(184,138,60,0.15)", color: "#D6B47E" }}
                    >
                      {sorted.length}
                    </span>
                  </h3>
                  {running && (
                    <span className="flex items-center gap-1.5 text-xs font-['JetBrains_Mono']" style={{ color: "#4ADE80" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      {isAr ? "يستقبل أحداثاً…" : "receiving events…"}
                    </span>
                  )}
                </div>
                <div>
                  {scored.map(({ ev, score, velocityMult }, i) => (
                    <TimelineRow
                      key={ev.id}
                      ev={ev}
                      isAr={isAr}
                      runningScore={score}
                      isLast={i === scored.length - 1}
                      velocityMult={velocityMult}
                    />
                  ))}
                  <div ref={bottomRef} />
                </div>
              </div>
            )}
          </div>

          {/* ── Right: analytics + intelligence panels ─────────────────────── */}
          <div className="col-span-12 lg:col-span-5 space-y-5">

            {/* Event summary */}
            <div
              className="rounded-xl border p-5"
              style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}
            >
              <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                <i className="ri-bar-chart-horizontal-line" style={{ color: "#D6B47E" }} />
                {isAr ? "ملخص الأحداث" : "Event summary"}
              </h3>
              {events.length === 0 ? (
                <p className="text-gray-600 text-xs text-center py-4">
                  {isAr ? "—" : "No events yet"}
                </p>
              ) : (
                <div className="space-y-2.5">
                  {(Object.keys(CATEGORY_META) as EventCategory[]).map((cat) => {
                    const cnt = events.filter((e) => e.category === cat).length;
                    if (!cnt) return null;
                    const meta = CATEGORY_META[cat];
                    return (
                      <div key={cat} className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 flex items-center justify-center rounded-md flex-shrink-0"
                          style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}40` }}
                        >
                          <i className={`${meta.icon} text-sm`} style={{ color: meta.color }} />
                        </div>
                        <span className="flex-1 text-gray-300 text-xs">{isAr ? meta.labelAr : meta.label}</span>
                        <span className="font-bold font-['JetBrains_Mono'] text-sm" style={{ color: meta.color }}>{cnt}</span>
                        <div className="w-16 h-1 rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${(cnt / Math.max(events.length, 1)) * 100}%`, background: meta.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Behavioral fingerprints panel ──────────────────────────── */}
            {sorted.length > 0 && (
              <div
                className="rounded-xl border p-5"
                style={{
                  background: hasPatterns
                    ? "linear-gradient(135deg, rgba(201,74,94,0.07), rgba(10,37,64,0.75))"
                    : "rgba(10,37,64,0.65)",
                  borderColor: hasPatterns ? "rgba(201,74,94,0.35)" : "rgba(184,138,60,0.12)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{
                      background: hasPatterns ? "rgba(201,74,94,0.15)" : "rgba(184,138,60,0.08)",
                      border: `1px solid ${hasPatterns ? "rgba(201,74,94,0.4)" : "rgba(184,138,60,0.2)"}`,
                    }}
                  >
                    <i className="ri-dna-line text-sm" style={{ color: hasPatterns ? "#C94A5E" : "#D6B47E" }} />
                  </div>
                  <h3 className="text-white text-sm font-bold flex-1">
                    {isAr ? "البصمات السلوكية" : "Behavioral Fingerprints"}
                  </h3>
                  {hasPatterns && (
                    <span
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest font-['JetBrains_Mono']"
                      style={{ background: "rgba(201,74,94,0.15)", color: "#C94A5E", border: "1px solid rgba(201,74,94,0.3)" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
                      {patterns.length} {isAr ? "مطابق" : "MATCHED"}
                    </span>
                  )}
                </div>

                {!hasPatterns ? (
                  <div className="text-center py-3">
                    <i className="ri-shield-check-line text-2xl text-gray-700 block mb-1" />
                    <p className="text-gray-600 text-xs">
                      {isAr ? "لم تُكتشف بصمات سلوكية بعد" : "No behavioral fingerprints detected yet"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-500 text-xs">
                      {isAr
                        ? `${patterns.length} نمط تهديد معروف مطابق — درجة إجمالية إضافية: +${patternsDelta}`
                        : `${patterns.length} known threat profile${patterns.length > 1 ? "s" : ""} matched — total score contribution: +${patternsDelta}`}
                    </p>
                    {patterns.map((p) => (
                      <FingerprintCard key={p.id} match={p} isAr={isAr} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Cross-entity / linked entity panel ─────────────────────── */}
            {linkedAlerts.length > 0 && (
              <div
                className="rounded-xl border p-5"
                style={{ background: "rgba(250,204,21,0.04)", borderColor: "rgba(250,204,21,0.22)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ background: "rgba(250,204,21,0.10)", border: "1px solid rgba(250,204,21,0.3)" }}
                  >
                    <i className="ri-links-line text-sm" style={{ color: "#FACC15" }} />
                  </div>
                  <h3 className="text-white text-sm font-bold flex-1">
                    {isAr ? "كيانات مرتبطة" : "Cross-Entity Alerts"}
                  </h3>
                  <span
                    className="px-2 py-0.5 rounded text-[9px] font-bold tracking-widest font-['JetBrains_Mono']"
                    style={{ background: "rgba(250,204,21,0.10)", color: "#FACC15", border: "1px solid rgba(250,204,21,0.3)" }}
                  >
                    +{linkedDelta} {isAr ? "للدرجة" : "TO SCORE"}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mb-3">
                  {isAr
                    ? "كيانات مرتبطة بتحويلات هذا الشخص مُبلَّغ عنها في سجل FIU"
                    : "Entities linked to this subject's transfers flagged in the FIU entity registry"}
                </p>
                <div className="space-y-3">
                  {linkedAlerts.map((alert, i) => (
                    <LinkedEntityCard key={i} alert={alert} isAr={isAr} />
                  ))}
                </div>
              </div>
            )}

            {/* Risk score progression */}
            {scored.length > 0 && (
              <div
                className="rounded-xl border p-5"
                style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}
              >
                <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                  <i className="ri-pulse-line" style={{ color: "#D6B47E" }} />
                  {isAr ? "تطور درجة المخاطر" : "Risk score progression"}
                </h3>
                <div className="space-y-1.5">
                  {scored.map(({ ev, score, velocityMult }, i) => {
                    const typeLabel = EVENT_TYPE_LABEL[ev.eventType] ?? { en: ev.eventType, ar: ev.eventType };
                    const delta     = i === 0 ? score - 12 : score - scored[i - 1].score;
                    const showVel   = velocityMult > 1.0 && delta > 0;
                    return (
                      <div key={ev.id} className="flex items-center gap-2">
                        <span className="text-gray-600 text-[10px] font-['JetBrains_Mono'] w-10 text-right flex-shrink-0">
                          {i === 0 ? "12" : scored[i - 1].score}→
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${score}%`,
                              background: score >= 70 ? "#C94A5E" : score >= 40 ? "#F97316" : "#4ADE80",
                            }}
                          />
                        </div>
                        <span
                          className="font-bold font-['JetBrains_Mono'] text-xs w-6 flex-shrink-0"
                          style={{ color: score >= 70 ? "#C94A5E" : score >= 40 ? "#F97316" : "#4ADE80" }}
                        >
                          {score}
                        </span>
                        {delta > 0 ? (
                          <span className="text-[9px] font-['JetBrains_Mono'] w-10 flex-shrink-0 flex items-center gap-0.5" style={{ color: "#C94A5E" }}>
                            +{delta}
                            {showVel && <i className="ri-flashlight-line" style={{ color: "#F97316" }} />}
                          </span>
                        ) : (
                          <span className="w-10 flex-shrink-0" />
                        )}
                        <span className="text-gray-600 text-[10px] truncate min-w-0">
                          {isAr ? typeLabel.ar : typeLabel.en}
                        </span>
                      </div>
                    );
                  })}

                  {/* Pattern fingerprint contribution */}
                  {hasPatterns && (
                    <div
                      className="flex items-center gap-2 border-t pt-2 mt-1"
                      style={{ borderColor: "rgba(201,74,94,0.2)" }}
                    >
                      <span className="text-gray-600 text-[10px] font-['JetBrains_Mono'] w-10 text-right flex-shrink-0">
                        {finalScore}→
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min(100, finalScore + patternsDelta)}%`, background: "#C94A5E" }}
                        />
                      </div>
                      <span className="font-bold font-['JetBrains_Mono'] text-xs w-6" style={{ color: "#C94A5E" }}>
                        {Math.min(100, finalScore + patternsDelta)}
                      </span>
                      <span className="text-[9px] font-['JetBrains_Mono'] w-10" style={{ color: "#C94A5E" }}>+{patternsDelta}</span>
                      <span className="text-[10px] flex items-center gap-1" style={{ color: "#C94A5E" }}>
                        <i className="ri-dna-line" />
                        {isAr ? "بصمات سلوكية" : "fingerprints"}
                      </span>
                    </div>
                  )}

                  {/* Cross-entity contribution */}
                  {linkedAlerts.length > 0 && (
                    <div
                      className="flex items-center gap-2 border-t pt-2 mt-1"
                      style={{ borderColor: "rgba(250,204,21,0.2)" }}
                    >
                      <span className="text-gray-600 text-[10px] font-['JetBrains_Mono'] w-10 text-right flex-shrink-0">
                        {Math.min(100, finalScore + patternsDelta)}→
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, finalScore + patternsDelta + linkedDelta)}%`,
                            background: "#FACC15",
                          }}
                        />
                      </div>
                      <span className="font-bold font-['JetBrains_Mono'] text-xs w-6" style={{ color: "#FACC15" }}>
                        {Math.min(100, finalScore + patternsDelta + linkedDelta)}
                      </span>
                      <span className="text-[9px] font-['JetBrains_Mono'] w-10" style={{ color: "#FACC15" }}>+{linkedDelta}</span>
                      <span className="text-[10px] flex items-center gap-1" style={{ color: "#FACC15" }}>
                        <i className="ri-links-line" />
                        {isAr ? "كيانات مرتبطة" : "entity links"}
                      </span>
                    </div>
                  )}

                  {/* Rasad boost */}
                  {rasadQueried && (
                    <div
                      className="flex items-center gap-2 border-t pt-2 mt-1"
                      style={{ borderColor: "rgba(201,74,94,0.3)" }}
                    >
                      <span className="text-gray-600 text-[10px] font-['JetBrains_Mono'] w-10 text-right flex-shrink-0">
                        {Math.min(100, finalScore + patternsDelta + linkedDelta)}→
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${compositeScore}%`, background: "#C94A5E" }}
                        />
                      </div>
                      <span className="font-bold font-['JetBrains_Mono'] text-xs w-6" style={{ color: "#C94A5E" }}>{compositeScore}</span>
                      <span className="text-[9px] font-['JetBrains_Mono'] w-10" style={{ color: "#C94A5E" }}>
                        +{RASAD_INTEL.scoreDelta}
                      </span>
                      <span className="text-[10px]" style={{ color: "#C94A5E" }}>
                        {isAr ? "رصد مُصنَّف" : "Rasad classified"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rasad query panel */}
            <div
              className="rounded-xl border p-5"
              style={{
                background: rasadQueried
                  ? "linear-gradient(135deg, rgba(138,31,60,0.14), rgba(10,37,64,0.85))"
                  : "rgba(10,37,64,0.65)",
                borderColor: rasadQueried ? "rgba(201,74,94,0.45)" : "rgba(184,138,60,0.12)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: "rgba(138,31,60,0.18)", border: "1px solid rgba(201,74,94,0.4)" }}
                >
                  <i className="ri-shield-keyhole-line" style={{ color: "#C94A5E" }} />
                </div>
                <div>
                  <h3 className="text-white text-sm font-bold">
                    {isAr ? "استعلام رصد" : "Query Rasad"}
                  </h3>
                  <p className="text-gray-600 text-[11px] font-['JetBrains_Mono']">
                    {isAr ? "مصادر مُصنَّفة — وضع الظل" : "Classified sources — shadow mode"}
                  </p>
                </div>
                {rasadQueried && (
                  <span
                    className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest font-['JetBrains_Mono']"
                    style={{ background: "rgba(74,222,128,0.1)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.3)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                    {isAr ? "مُستعلَم" : "QUERIED"}
                  </span>
                )}
              </div>

              {!rasadQueried && !rasadLoading && events.length > 0 && (
                <button
                  onClick={handleQueryRasad}
                  className="w-full py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-all"
                  style={{ background: "rgba(138,31,60,0.18)", border: "1px solid rgba(201,74,94,0.4)", color: "#C94A5E" }}
                >
                  <i className="ri-shield-keyhole-line mr-1.5" />
                  {isAr ? "استعلام عن هذا الشخص في رصد" : "Query this subject in Rasad"}
                </button>
              )}

              {events.length === 0 && (
                <p className="text-gray-600 text-xs text-center py-2">
                  {isAr ? "شغّل السيناريو أولاً" : "Run scenario first"}
                </p>
              )}

              {rasadLoading && (
                <div className="text-center py-4">
                  <i className="ri-loader-2-line animate-spin text-2xl block mb-2" style={{ color: "#C94A5E" }} />
                  <p className="text-xs font-['JetBrains_Mono']" style={{ color: "#C94A5E" }}>
                    {isAr ? "جارٍ الاستعلام عن المصادر المُصنَّفة…" : "Querying classified sources…"}
                  </p>
                </div>
              )}

              {rasadQueried && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400 mb-3">
                    {isAr
                      ? `وُجد ${RASAD_INTEL.records.length} سجلات مُصنَّفة مرتبطة بهذا الشخص — الدرجة المركّبة: ${compositeScore}`
                      : `${RASAD_INTEL.records.length} classified records found — composite score: ${compositeScore}`}
                  </p>
                  {RASAD_INTEL.records.map((rec, i) => (
                    <div
                      key={i}
                      className="rounded-lg border p-3"
                      style={{ background: "rgba(255,255,255,0.025)", borderColor: `${rec.color}35` }}
                    >
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest font-['JetBrains_Mono']"
                          style={{ background: `${rec.color}15`, color: rec.color, border: `1px solid ${rec.color}40` }}
                        >
                          {rec.classification}
                        </span>
                        <span className="text-gray-500 text-[10px] font-['JetBrains_Mono']">{rec.source}</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {isAr ? rec.ar : rec.en}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectTimelinePage;
