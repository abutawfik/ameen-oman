import { useState } from "react";
import type { FlaggedPerson } from "@/mocks/riskAssessmentData";
import RiskScoreGauge from "./RiskScoreGauge";
import CrossEntityTimeline from "./CrossEntityTimeline";

interface FlaggedEventDetailProps {
  person: FlaggedPerson;
  isAr: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  onDismiss: (id: string) => void;
  onEscalate: (id: string) => void;
}

const FLAG_CATEGORY_ICONS: Record<string, string> = {
  watchlist: "ri-eye-line",
  overstay:  "ri-time-line",
  document:  "ri-file-warning-line",
  pattern:   "ri-git-branch-line",
  manual:    "ri-flag-line",
};

const FLOW_STEPS = [
  { label: "Event",      labelAr: "حدث",          icon: "ri-pulse-line",        color: "#22D3EE", done: true  },
  { label: "AMEEN DB",   labelAr: "قاعدة أمين",   icon: "ri-database-2-line",   color: "#22D3EE", done: true  },
  { label: "Sec Dept 1", labelAr: "أمن 1",         icon: "ri-server-line",       color: "#22D3EE", done: true  },
  { label: "Sec Dept 2", labelAr: "أمن 2",         icon: "ri-server-line",       color: "#22D3EE", done: true  },
  { label: "Assessment", labelAr: "تقييم",         icon: "ri-shield-line",       color: "#FACC15", done: true  },
  { label: "Police DB",  labelAr: "قاعدة الشرطة",  icon: "ri-database-line",     color: "#4ADE80", done: false },
];

const FlaggedEventDetail = ({ person, isAr, onClose, onConfirm, onDismiss, onEscalate }: FlaggedEventDetailProps) => {
  const [activeSection, setActiveSection] = useState<"overview" | "timeline" | "score">("overview");
  const [notesText, setNotesText] = useState("");
  const [caseCreated, setCaseCreated] = useState(false);
  const [fieldDeployed, setFieldDeployed] = useState(false);

  const scoreColor = person.riskScore <= 25 ? "#4ADE80"
    : person.riskScore <= 50 ? "#FACC15"
    : person.riskScore <= 75 ? "#FB923C"
    : "#F87171";

  const riskLabel = person.riskScore <= 25 ? (isAr ? "منخفض" : "LOW")
    : person.riskScore <= 50 ? (isAr ? "متوسط" : "MEDIUM")
    : person.riskScore <= 75 ? (isAr ? "عالٍ" : "HIGH")
    : (isAr ? "حرج" : "CRITICAL");

  const handleCreateCase = () => {
    setCaseCreated(true);
    setTimeout(() => setCaseCreated(false), 2500);
  };

  const handleDeployField = () => {
    setFieldDeployed(true);
    setTimeout(() => setFieldDeployed(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(10px)" }}>
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl border flex flex-col"
        style={{ background: "rgba(6,13,26,0.99)", borderColor: "rgba(34,211,238,0.18)", backdropFilter: "blur(24px)", boxShadow: `0 0 60px rgba(34,211,238,0.06), 0 0 0 1px rgba(34,211,238,0.08)` }}>

        {/* Classification stripe */}
        <div className="w-full py-1 px-6 flex items-center justify-between flex-shrink-0"
          style={{ background: "#7F1D1D", borderBottom: "1px solid rgba(248,113,113,0.3)" }}>
          <div className="flex items-center gap-2">
            <i className="ri-shield-keyhole-line text-red-300 text-xs" />
            <span className="text-white text-xs font-bold tracking-widest uppercase font-['JetBrains_Mono']">
              {isAr ? "سري — للأفراد المخوّلين فقط" : "RESTRICTED — Authorized Personnel Only"}
            </span>
          </div>
          <span className="text-red-300 text-xs font-['JetBrains_Mono'] opacity-60">AMEEN-RA-2026</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ background: "rgba(248,113,113,0.04)", borderColor: "rgba(248,113,113,0.15)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.25)" }}>
              <i className="ri-shield-cross-line text-red-400 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-black text-base">{isAr ? "حدث مُبلَّغ — تقييم المخاطر" : "Flagged Event — Risk Assessment"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(248,113,113,0.12)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)" }}>
                  {isAr ? "المرحلة 1" : "PHASE 1 — BINARY FLAG"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: `${scoreColor}12`, color: scoreColor, border: `1px solid ${scoreColor}25` }}>
                  {riskLabel}
                </span>
              </div>
              <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-0.5">
                {isAr ? "الحدث → قاعدة أمين → RES-A+RES-B → تقييم مستقل → صح/خطأ → قاعدة الشرطة" : "Event → AMEEN DB → Replicate RES-A+RES-B → Independent Assessment → True/False → Police DB"}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl border cursor-pointer transition-colors hover:border-red-400/40"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.08)", color: "#6B7280" }}>
            <i className="ri-close-line text-sm" />
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex items-center gap-1 px-6 py-2 border-b flex-shrink-0"
          style={{ borderColor: "rgba(34,211,238,0.07)" }}>
          {[
            { id: "overview" as const, label: isAr ? "نظرة عامة" : "Overview",              icon: "ri-user-line" },
            { id: "timeline" as const, label: isAr ? "الجدول الزمني" : "Cross-Entity Timeline", icon: "ri-time-line" },
            { id: "score"    as const, label: isAr ? "تفصيل النقاط" : "Score Breakdown",     icon: "ri-bar-chart-line" },
          ].map((s) => (
            <button key={s.id} type="button" onClick={() => setActiveSection(s.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
              style={{
                background: activeSection === s.id ? "rgba(34,211,238,0.08)" : "transparent",
                border: `1px solid ${activeSection === s.id ? "rgba(34,211,238,0.2)" : "transparent"}`,
                color: activeSection === s.id ? "#22D3EE" : "#6B7280",
              }}>
              <i className={`${s.icon} text-xs`} />{s.label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── OVERVIEW ── */}
          {activeSection === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* LEFT: Person Card */}
              <div className="lg:col-span-1 space-y-4">
                {/* Person glass card */}
                <div className="rounded-2xl border p-5 space-y-4"
                  style={{ background: "rgba(10,22,40,0.9)", borderColor: `${scoreColor}20`, backdropFilter: "blur(12px)" }}>
                  {/* Photo + identity */}
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <img src={person.photo} alt={person.name}
                        className="w-20 h-20 rounded-2xl object-cover object-top"
                        style={{ border: `2px solid ${scoreColor}35` }} />
                      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 flex items-center justify-center rounded-full"
                        style={{ background: scoreColor, border: "2px solid #060D1A" }}>
                        <i className="ri-shield-cross-line text-white" style={{ fontSize: "9px" }} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-black text-sm leading-tight">{isAr ? person.nameAr : person.name}</h3>
                      <p className="text-gray-500 text-xs font-['JetBrains_Mono'] mt-0.5">{person.docNumber}</p>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{ background: "rgba(255,255,255,0.05)", color: "#D1D5DB", border: "1px solid rgba(255,255,255,0.08)" }}>
                          {person.natCode}
                        </span>
                        <span className="text-gray-500 text-xs">{person.age}y</span>
                        <span className="text-gray-600 text-xs">·</span>
                        <span className="text-gray-500 text-xs">{isAr ? (person.gender === "Male" ? "ذكر" : "أنثى") : person.gender}</span>
                      </div>
                    </div>
                  </div>

                  {/* Risk gauge */}
                  <div className="flex flex-col items-center py-1">
                    <RiskScoreGauge score={person.riskScore} size={130} />
                    <div className="flex items-center gap-3 mt-2">
                      <div className="text-center">
                        <p className="text-gray-600 text-xs">{isAr ? "درجتك" : "Score"}</p>
                        <p className="font-black font-['JetBrains_Mono'] text-sm" style={{ color: scoreColor }}>{person.riskScore}</p>
                      </div>
                      <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.06)" }} />
                      <div className="text-center">
                        <p className="text-gray-600 text-xs">{isAr ? "المتوسط" : "Avg"}</p>
                        <p className="font-bold font-['JetBrains_Mono'] text-sm text-gray-400">23</p>
                      </div>
                      <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.06)" }} />
                      <div className="text-center">
                        <p className="text-gray-600 text-xs">{isAr ? "الفارق" : "Delta"}</p>
                        <p className="font-black font-['JetBrains_Mono'] text-sm" style={{ color: scoreColor }}>+{person.riskScore - 23}</p>
                      </div>
                    </div>
                  </div>

                  {/* Current location */}
                  <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(34,211,238,0.1)" }}>
                    <div className="flex items-center gap-2 px-3 py-2" style={{ background: "rgba(34,211,238,0.04)" }}>
                      <i className="ri-map-pin-line text-cyan-400 text-xs" />
                      <span className="text-gray-400 text-xs">{isAr ? "الموقع الحالي" : "Current Location"}</span>
                    </div>
                    <div className="px-3 py-2">
                      <p className="text-white text-xs font-semibold">{isAr ? person.currentLocationAr : person.currentLocation}</p>
                    </div>
                    {/* Mini map */}
                    <div className="relative flex items-center justify-center"
                      style={{ height: "80px", background: "rgba(6,13,26,0.9)" }}>
                      {/* Grid lines */}
                      <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)`,
                        backgroundSize: "16px 16px"
                      }} />
                      {/* Pulsing location dot */}
                      <div className="relative z-10 flex items-center justify-center">
                        <div className="absolute w-8 h-8 rounded-full animate-ping opacity-20" style={{ background: scoreColor }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: scoreColor, boxShadow: `0 0 8px ${scoreColor}` }} />
                      </div>
                      <div className="absolute bottom-1.5 right-2 text-gray-700 font-['JetBrains_Mono']" style={{ fontSize: "8px" }}>
                        {isAr ? "خريطة مصغرة" : "MINI MAP"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Processing flow */}
                <div className="rounded-2xl border p-4" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.08)" }}>
                  <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mb-3 uppercase tracking-wider">{isAr ? "تدفق المعالجة" : "Processing Flow"}</p>
                  <div className="space-y-1.5">
                    {FLOW_STEPS.map((step, i) => (
                      <div key={step.label} className="flex items-center gap-2">
                        <div className="w-5 h-5 flex items-center justify-center rounded-md flex-shrink-0"
                          style={{ background: step.done ? `${step.color}12` : "rgba(255,255,255,0.03)", border: `1px solid ${step.done ? step.color + "30" : "rgba(255,255,255,0.06)"}` }}>
                          <i className={`${step.icon}`} style={{ color: step.done ? step.color : "#374151", fontSize: "9px" }} />
                        </div>
                        <span className="text-xs font-semibold flex-1" style={{ color: step.done ? step.color : "#374151" }}>
                          {isAr ? step.labelAr : step.label}
                        </span>
                        {i < FLOW_STEPS.length - 1 && (
                          <i className="ri-arrow-down-s-line text-gray-700 text-xs" />
                        )}
                        {step.done && i < FLOW_STEPS.length - 1 && (
                          <i className="ri-checkbox-circle-fill text-xs" style={{ color: step.color, fontSize: "9px" }} />
                        )}
                        {!step.done && (
                          <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: "#FACC15", fontSize: "9px" }}>
                            {isAr ? "معلق" : "PENDING"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: Flag categories + Match info + Notes */}
              <div className="lg:col-span-2 space-y-4">

                {/* Flag categories */}
                <div className="rounded-2xl border p-5" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.1)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <i className="ri-flag-2-line text-red-400 text-sm" />
                    <h4 className="text-white font-bold text-sm">{isAr ? "فئات التنبيه" : "Flag Categories"}</h4>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                      {person.flagCategories.length}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {person.flagCategories.map((fc, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
                        style={{ background: `${fc.color}06`, border: `1px solid ${fc.color}18`, borderLeft: `3px solid ${fc.color}` }}>
                        <div className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0"
                          style={{ background: `${fc.color}12`, border: `1px solid ${fc.color}20` }}>
                          <i className={`${FLAG_CATEGORY_ICONS[fc.type]} text-sm`} style={{ color: fc.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold" style={{ color: fc.color }}>{isAr ? fc.labelAr : fc.label}</span>
                          </div>
                          <p className="text-gray-400 text-xs leading-relaxed">{isAr ? fc.detailAr : fc.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Match info */}
                <div className="rounded-2xl border p-5" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.1)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <i className="ri-fingerprint-line text-cyan-400 text-sm" />
                    <h4 className="text-white font-bold text-sm">{isAr ? "معلومات التطابق" : "Match Information"}</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        label: isAr ? "قاعدة البيانات" : "Database",
                        value: isAr ? person.matchInfo.databaseAr : person.matchInfo.database,
                        icon: "ri-database-2-line",
                        color: "#22D3EE",
                      },
                      {
                        label: isAr ? "مستوى الثقة" : "Confidence",
                        value: isAr ? person.matchInfo.confidenceAr : person.matchInfo.confidence,
                        icon: "ri-percent-line",
                        color: person.matchInfo.confidence === "Exact" ? "#4ADE80" : person.matchInfo.confidence === "Partial" ? "#FACC15" : "#FB923C",
                      },
                      {
                        label: isAr ? "تطابق على" : "Matched On",
                        value: isAr ? person.matchInfo.matchedOnAr : person.matchInfo.matchedOn,
                        icon: "ri-fingerprint-line",
                        color: "#A78BFA",
                      },
                    ].map((m) => (
                      <div key={m.label} className="px-4 py-3.5 rounded-xl"
                        style={{ background: `${m.color}05`, border: `1px solid ${m.color}12` }}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <i className={`${m.icon} text-xs`} style={{ color: m.color }} />
                          <span className="text-gray-500 text-xs">{m.label}</span>
                        </div>
                        <p className="text-white text-xs font-semibold leading-snug">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="rounded-2xl border p-5" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.1)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <i className="ri-sticky-note-line text-cyan-400 text-sm" />
                    <h4 className="text-white font-bold text-sm">{isAr ? "ملاحظات المحقق" : "Analyst Notes"}</h4>
                  </div>
                  <textarea
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    placeholder={isAr ? "أضف ملاحظاتك هنا..." : "Add your notes here..."}
                    rows={3}
                    className="w-full rounded-xl px-4 py-3 text-xs resize-none outline-none transition-colors"
                    style={{
                      background: "rgba(6,13,26,0.8)",
                      border: "1px solid rgba(34,211,238,0.12)",
                      color: "#D1D5DB",
                      fontFamily: "Inter, sans-serif",
                    }}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-700 text-xs font-['JetBrains_Mono']">{notesText.length}/500</span>
                    <button type="button"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                      style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", color: "#22D3EE" }}>
                      <i className="ri-save-line text-xs" />
                      {isAr ? "حفظ" : "Save Note"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TIMELINE ── */}
          {activeSection === "timeline" && (
            <div className="rounded-2xl border p-5" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.1)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 flex items-center justify-center rounded-xl"
                  style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.18)" }}>
                  <i className="ri-time-line text-cyan-400 text-sm" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{isAr ? "الجدول الزمني عبر الكيانات — جميع 14 تدفقاً" : "Cross-Entity Timeline — All 14 Streams"}</h4>
                  <p className="text-gray-500 text-xs">{isAr ? "مرتبة زمنياً — خط أزرق عمودي" : "Chronological order — cyan vertical line"}</p>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: "rgba(34,211,238,0.08)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.18)" }}>
                    {person.timeline.length} {isAr ? "حدث" : "events"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: "rgba(248,113,113,0.08)", color: "#F87171", border: "1px solid rgba(248,113,113,0.18)" }}>
                    {person.timeline.filter((t) => t.risk === "flagged").length} {isAr ? "مُبلَّغ" : "flagged"}
                  </span>
                </div>
              </div>
              <CrossEntityTimeline events={person.timeline} isAr={isAr} />
            </div>
          )}

          {/* ── SCORE BREAKDOWN ── */}
          {activeSection === "score" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Gauge */}
                <div className="rounded-2xl border p-5 flex flex-col items-center gap-4"
                  style={{ background: "rgba(10,22,40,0.8)", borderColor: `${scoreColor}20` }}>
                  <RiskScoreGauge score={person.riskScore} size={170} />
                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="text-gray-500 text-xs">{isAr ? "درجة الشخص" : "Person Score"}</span>
                      <span className="text-xs font-black font-['JetBrains_Mono']" style={{ color: scoreColor }}>{person.riskScore} / 100</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="text-gray-500 text-xs">{isAr ? "متوسط السكان" : "Population Average"}</span>
                      <span className="text-xs font-bold font-['JetBrains_Mono'] text-gray-400">23 / 100</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{ background: `${scoreColor}06`, border: `1px solid ${scoreColor}15` }}>
                      <span className="text-gray-400 text-xs">{isAr ? "الفارق عن المتوسط" : "Delta from Average"}</span>
                      <span className="text-xs font-black font-['JetBrains_Mono']" style={{ color: scoreColor }}>+{person.riskScore - 23} pts</span>
                    </div>
                  </div>
                </div>

                {/* Score history */}
                <div className="rounded-2xl border p-5" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.1)" }}>
                  <h4 className="text-white font-bold text-sm mb-4">{isAr ? "تطور درجة المخاطر (12 شهراً)" : "Risk Score Timeline (12 months)"}</h4>
                  <div className="relative" style={{ height: "120px" }}>
                    <svg width="100%" height="120" viewBox="0 0 300 120" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="scoreGradDetail" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={scoreColor} stopOpacity="0.3" />
                          <stop offset="100%" stopColor={scoreColor} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d={`M ${person.scoreHistory.map((p, i) => `${(i / (person.scoreHistory.length - 1)) * 300},${120 - (p.score / 100) * 110}`).join(" L ")} L 300,120 L 0,120 Z`}
                        fill="url(#scoreGradDetail)"
                      />
                      <polyline
                        points={person.scoreHistory.map((p, i) => `${(i / (person.scoreHistory.length - 1)) * 300},${120 - (p.score / 100) * 110}`).join(" ")}
                        fill="none" stroke={scoreColor} strokeWidth="2"
                        style={{ filter: `drop-shadow(0 0 4px ${scoreColor}60)` }}
                      />
                      <circle cx="300" cy={120 - (person.scoreHistory[person.scoreHistory.length - 1].score / 100) * 110} r="4" fill={scoreColor} />
                    </svg>
                  </div>
                  <div className="flex justify-between mt-1">
                    {person.scoreHistory.map((p) => (
                      <span key={p.date} className="text-gray-700 font-['JetBrains_Mono']" style={{ fontSize: "8px" }}>{p.date}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stream breakdown */}
              <div className="rounded-2xl border p-5" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.1)" }}>
                <h4 className="text-white font-bold text-sm mb-4">{isAr ? "تفصيل المساهمة حسب التدفق" : "Contribution Breakdown by Stream"}</h4>
                <div className="space-y-3">
                  {person.scoreBreakdown.sort((a, b) => b.contribution - a.contribution).map((s) => (
                    <div key={s.stream}>
                      <div className="flex items-center gap-3 mb-1.5">
                        <div className="w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0"
                          style={{ background: `${s.color}12`, border: `1px solid ${s.color}20` }}>
                          <i className={`${s.icon}`} style={{ color: s.color, fontSize: "9px" }} />
                        </div>
                        <span className="text-white text-xs font-semibold flex-1">{isAr ? s.streamAr : s.stream}</span>
                        <div className="flex items-center gap-2">
                          {s.multiplier > 1 && (
                            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                              style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)", fontSize: "9px" }}>
                              ×{s.multiplier}
                            </span>
                          )}
                          <span className="text-xs font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.contribution.toFixed(1)}</span>
                          <span className="text-gray-600 text-xs">pts</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden ml-9" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${(s.contribution / person.riskScore) * 100}%`, background: s.color, boxShadow: `0 0 6px ${s.color}50` }} />
                      </div>
                      {s.multiplierReason && (
                        <p className="text-gray-600 ml-9 mt-0.5 flex items-center gap-1" style={{ fontSize: "9px" }}>
                          <i className="ri-arrow-up-line" style={{ color: "#F87171", fontSize: "9px" }} />
                          {s.multiplierReason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-2 px-6 py-4 border-t flex-shrink-0 flex-wrap"
          style={{ background: "rgba(6,13,26,0.95)", borderColor: "rgba(34,211,238,0.08)" }}>
          {/* Primary: Confirm */}
          <button type="button" onClick={() => onConfirm(person.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:opacity-90"
            style={{ background: "#22D3EE", color: "#060D1A" }}>
            <i className="ri-checkbox-circle-line text-xs" />
            {isAr ? "تأكيد التنبيه → Police DB" : "Confirm Flag → Police DB"}
          </button>

          {/* Escalate */}
          <button type="button" onClick={() => onEscalate(person.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer whitespace-nowrap transition-all"
            style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.3)", color: "#F87171" }}>
            <i className="ri-arrow-up-double-line text-xs" />
            {isAr ? "تصعيد" : "Escalate"}
          </button>

          {/* Create Case */}
          <button type="button" onClick={handleCreateCase}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer whitespace-nowrap transition-all"
            style={{ background: caseCreated ? "rgba(167,139,250,0.12)" : "rgba(167,139,250,0.05)", borderColor: "rgba(167,139,250,0.3)", color: "#A78BFA" }}>
            <i className={`${caseCreated ? "ri-checkbox-circle-line" : "ri-folder-add-line"} text-xs`} />
            {caseCreated ? (isAr ? "تم إنشاء القضية!" : "Case Created!") : (isAr ? "إنشاء قضية" : "Create Case")}
          </button>

          {/* Deploy Field Team */}
          <button type="button" onClick={handleDeployField}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer whitespace-nowrap transition-all"
            style={{ background: fieldDeployed ? "rgba(251,146,60,0.12)" : "rgba(251,146,60,0.05)", borderColor: "rgba(251,146,60,0.3)", color: "#FB923C" }}>
            <i className={`${fieldDeployed ? "ri-checkbox-circle-line" : "ri-team-line"} text-xs`} />
            {fieldDeployed ? (isAr ? "تم النشر!" : "Deployed!") : (isAr ? "نشر فريق ميداني" : "Deploy Field Team")}
          </button>

          {/* Dismiss */}
          <button type="button" onClick={() => onDismiss(person.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer whitespace-nowrap ml-auto transition-all"
            style={{ background: "transparent", borderColor: "rgba(156,163,175,0.15)", color: "#6B7280" }}>
            <i className="ri-close-line text-xs" />
            {isAr ? "رفض" : "Dismiss"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlaggedEventDetail;
