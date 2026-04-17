import { useState } from "react";
import type { FlaggedPerson } from "@/mocks/riskAssessmentData";
import { AVERAGE_RISK_SCORE } from "@/mocks/riskAssessmentData";
import RiskScoreGauge from "./RiskScoreGauge";
import CrossEntityTimeline from "./CrossEntityTimeline";

interface PersonRiskDashboardProps {
  persons: FlaggedPerson[];
  isAr: boolean;
}

const getScoreColor = (score: number) => {
  if (score <= 25) return "#4ADE80";
  if (score <= 50) return "#FACC15";
  if (score <= 75) return "#FB923C";
  return "#F87171";
};

const getScoreLabel = (score: number, isAr: boolean) => {
  if (score <= 25) return isAr ? "منخفض" : "LOW";
  if (score <= 50) return isAr ? "متوسط" : "MEDIUM";
  if (score <= 75) return isAr ? "عالٍ" : "HIGH";
  return isAr ? "حرج" : "CRITICAL";
};

const PersonRiskDashboard = ({ persons, isAr }: PersonRiskDashboardProps) => {
  const [selectedId, setSelectedId] = useState(persons[0]?.id ?? "");
  const person = persons.find((p) => p.id === selectedId) ?? persons[0];

  if (!person) return null;

  const scoreColor = getScoreColor(person.riskScore);
  const totalContribution = person.scoreBreakdown.reduce((s, b) => s + b.contribution, 0);

  return (
    <div className="space-y-5">
      {/* Person selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {persons.map((p) => {
          const c = getScoreColor(p.riskScore);
          const isSelected = selectedId === p.id;
          return (
            <button key={p.id} type="button" onClick={() => setSelectedId(p.id)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer transition-all"
              style={{
                background: isSelected ? `${c}08` : "rgba(20,29,46,0.6)",
                borderColor: isSelected ? `${c}30` : "rgba(255,255,255,0.06)",
                boxShadow: isSelected ? `0 0 12px ${c}10` : "none",
              }}>
              <img src={p.photo} alt={p.name} className="w-8 h-8 rounded-lg object-cover object-top flex-shrink-0" />
              <div className="text-left">
                <p className="text-white text-xs font-semibold whitespace-nowrap">{isAr ? p.nameAr : p.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black font-['JetBrains_Mono']" style={{ color: c }}>{p.riskScore}</span>
                  <span className="text-xs font-bold" style={{ color: c, fontSize: "9px" }}>· {getScoreLabel(p.riskScore, isAr)}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* LEFT: Gauge + stats + history */}
        <div className="space-y-4">
          {/* Gauge card */}
          <div className="rounded-2xl border p-5 flex flex-col items-center gap-4"
            style={{ background: "rgba(20,29,46,0.8)", borderColor: `${scoreColor}20`, backdropFilter: "blur(12px)" }}>
            <div className="flex items-center gap-3 self-start w-full">
              <img src={person.photo} alt={person.name} className="w-10 h-10 rounded-xl object-cover object-top flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">{isAr ? person.nameAr : person.name}</p>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{person.docNumber}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0"
                style={{ background: `${scoreColor}12`, color: scoreColor, border: `1px solid ${scoreColor}25` }}>
                {getScoreLabel(person.riskScore, isAr)}
              </span>
            </div>

            <RiskScoreGauge score={person.riskScore} size={160} />

            {/* Comparison stats */}
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ background: `${scoreColor}06`, border: `1px solid ${scoreColor}12` }}>
                <span className="text-gray-500 text-xs">{isAr ? "درجة الشخص" : "Person Score"}</span>
                <span className="text-xs font-black font-['JetBrains_Mono']" style={{ color: scoreColor }}>{person.riskScore}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-gray-500 text-xs">{isAr ? "متوسط السكان" : "Population Avg"}</span>
                <span className="text-xs font-bold font-['JetBrains_Mono'] text-gray-400">{AVERAGE_RISK_SCORE}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-gray-500 text-xs">{isAr ? "الفارق" : "Delta"}</span>
                <span className="text-xs font-black font-['JetBrains_Mono']" style={{ color: scoreColor }}>
                  +{person.riskScore - AVERAGE_RISK_SCORE} pts
                </span>
              </div>
            </div>

            {/* Comparison bar */}
            <div className="w-full">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 text-xs">{isAr ? "المتوسط" : "Avg"} ({AVERAGE_RISK_SCORE})</span>
                <span className="text-xs font-bold" style={{ color: scoreColor }}>{person.riskScore}</span>
              </div>
              <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                {/* Average marker */}
                <div className="absolute top-0 bottom-0 w-0.5 z-10"
                  style={{ left: `${AVERAGE_RISK_SCORE}%`, background: "rgba(255,255,255,0.3)" }} />
                {/* Score fill */}
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${person.riskScore}%`, background: `linear-gradient(to right, #4ADE80, ${scoreColor})` }} />
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="text-gray-700 font-['JetBrains_Mono']" style={{ fontSize: "8px" }}>0</span>
                <span className="text-gray-700 font-['JetBrains_Mono']" style={{ fontSize: "8px" }}>100</span>
              </div>
            </div>
          </div>

          {/* Score history */}
          <div className="rounded-2xl border p-4" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.1)", backdropFilter: "blur(12px)" }}>
            <h4 className="text-white font-bold text-xs mb-3">{isAr ? "تطور الدرجة (12 شهراً)" : "Score Evolution (12 months)"}</h4>
            <div className="relative" style={{ height: "80px" }}>
              <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`grad-${person.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={scoreColor} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={scoreColor} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M ${person.scoreHistory.map((p, i) => `${(i / (person.scoreHistory.length - 1)) * 300},${80 - (p.score / 100) * 75}`).join(" L ")} L 300,80 L 0,80 Z`}
                  fill={`url(#grad-${person.id})`}
                />
                <polyline
                  points={person.scoreHistory.map((p, i) => `${(i / (person.scoreHistory.length - 1)) * 300},${80 - (p.score / 100) * 75}`).join(" ")}
                  fill="none" stroke={scoreColor} strokeWidth="1.5"
                  style={{ filter: `drop-shadow(0 0 3px ${scoreColor}50)` }}
                />
                <circle cx="300" cy={80 - (person.scoreHistory[person.scoreHistory.length - 1].score / 100) * 75} r="3" fill={scoreColor} />
              </svg>
            </div>
            <div className="flex justify-between mt-1">
              {person.scoreHistory.filter((_, i) => i % 3 === 0).map((p) => (
                <span key={p.date} className="text-gray-700 font-['JetBrains_Mono']" style={{ fontSize: "8px" }}>{p.date}</span>
              ))}
            </div>
          </div>

          {/* Event summary */}
          <div className="rounded-2xl border p-4" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.1)", backdropFilter: "blur(12px)" }}>
            <h4 className="text-white font-bold text-xs mb-3">{isAr ? "ملخص الأحداث" : "Event Summary"}</h4>
            <div className="space-y-2">
              {[
                { label: isAr ? "إجمالي الأحداث" : "Total Events",       value: person.timeline.length,                                    color: "#D4A84B", icon: "ri-pulse-line" },
                { label: isAr ? "مُبلَّغة" : "Flagged",                   value: person.timeline.filter((t) => t.risk === "flagged").length, color: "#F87171", icon: "ri-shield-cross-line" },
                { label: isAr ? "للمراجعة" : "Under Review",              value: person.timeline.filter((t) => t.risk === "review").length,  color: "#FACC15", icon: "ri-eye-line" },
                { label: isAr ? "سليمة" : "Clear",                        value: person.timeline.filter((t) => t.risk === "clear").length,   color: "#4ADE80", icon: "ri-shield-check-line" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
                    <span className="text-gray-400 text-xs">{s.label}</span>
                  </div>
                  <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER: Stream breakdown */}
        <div className="rounded-2xl border p-5" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.1)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-2 mb-4">
            <i className="ri-bar-chart-2-line text-gold-400 text-sm" />
            <h4 className="text-white font-bold text-sm">{isAr ? "تفصيل حسب التدفق" : "Breakdown by Stream"}</h4>
          </div>
          <div className="space-y-3.5">
            {person.scoreBreakdown.sort((a, b) => b.contribution - a.contribution).map((s) => {
              const pct = totalContribution > 0 ? (s.contribution / totalContribution) * 100 : 0;
              return (
                <div key={s.stream}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0"
                      style={{ background: `${s.color}12`, border: `1px solid ${s.color}20` }}>
                      <i className={`${s.icon}`} style={{ color: s.color, fontSize: "9px" }} />
                    </div>
                    <span className="text-gray-300 text-xs flex-1">{isAr ? s.streamAr : s.stream}</span>
                    <div className="flex items-center gap-1.5">
                      {s.multiplier > 1 && (
                        <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: "#F87171", fontSize: "9px" }}>×{s.multiplier}</span>
                      )}
                      <span className="text-xs font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.contribution.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden ml-8" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: s.color, boxShadow: `0 0 4px ${s.color}40` }} />
                  </div>
                  {s.multiplierReason && (
                    <p className="text-gray-700 ml-8 mt-0.5 flex items-center gap-1" style={{ fontSize: "9px" }}>
                      <i className="ri-arrow-up-line" style={{ color: "#F87171", fontSize: "8px" }} />
                      {s.multiplierReason}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="mt-5 pt-4 border-t" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs font-semibold">{isAr ? "إجمالي الدرجة" : "Total Score"}</span>
              <span className="text-sm font-black font-['JetBrains_Mono']" style={{ color: scoreColor }}>{person.riskScore} / 100</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-600 text-xs">{isAr ? "التدفقات المساهمة" : "Contributing Streams"}</span>
              <span className="text-xs font-bold font-['JetBrains_Mono'] text-gold-400">{person.scoreBreakdown.length}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-600 text-xs">{isAr ? "المضاعفات المُفعَّلة" : "Active Multipliers"}</span>
              <span className="text-xs font-bold font-['JetBrains_Mono'] text-red-400">
                {person.scoreBreakdown.filter((s) => s.multiplier > 1).length}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Timeline */}
        <div className="rounded-2xl border p-5 flex flex-col" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.1)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-2 mb-4 flex-shrink-0">
            <i className="ri-time-line text-gold-400 text-sm" />
            <h4 className="text-white font-bold text-sm">{isAr ? "الأحداث المساهمة" : "Contributing Events"}</h4>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold ml-auto"
              style={{ background: "rgba(181,142,60,0.08)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.15)" }}>
              {person.timeline.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: "480px" }}>
            <CrossEntityTimeline events={person.timeline} isAr={isAr} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonRiskDashboard;
