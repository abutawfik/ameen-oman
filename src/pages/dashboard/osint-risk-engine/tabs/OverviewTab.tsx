// Overview tab — KPI strip, 24-hour throughput chart, band distribution,
// engine narrative. No state of its own (all derived from mocks + aggregate).

import { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  INTERNAL_STREAMS, OSINT_SOURCES, SCORED_RECORDS, SCORE_BAND_META,
  THROUGHPUT_24H, aggregate, type RiskBand,
} from "@/mocks/osintData";

const TOTAL_OSINT_BASELINE = OSINT_SOURCES.length;

const OverviewTab = ({ isAr, agg, presenterMode }: { isAr: boolean; agg: ReturnType<typeof aggregate>; presenterMode: boolean }) => {
  const bandCounts = useMemo(() => {
    const c: Record<RiskBand, number> = { critical: 0, high: 0, elevated: 0, borderline: 0, low: 0 };
    SCORED_RECORDS.forEach((r) => { c[r.band]++; });
    return c;
  }, []);

  const kpis = [
    { label: isAr ? "مسجّل خلال 24 ساعة"  : "Scored · 24h",      value: agg.total24h.toLocaleString(),  color: "#D6B47E", icon: "ri-pulse-line" },
    { label: isAr ? "مُرفَع للمراجعة" : "Flagged · 24h",           value: agg.flagged24h.toString(),      color: "#C94A5E", icon: "ri-alarm-warning-line" },
    { label: isAr ? "معدل الرفع"       : "Flag rate",              value: `${agg.flagRate}%`,             color: "#C98A1B", icon: "ri-percent-line" },
    { label: isAr ? "متوسط الدرجة"    : "Avg unified score",       value: agg.avgScore.toString(),        color: "#6B4FAE", icon: "ri-scales-3-line" },
    { label: isAr ? "مصادر حيّة"       : "Sources live",            value: `${agg.sourcesHealthy + INTERNAL_STREAMS.filter((s) => s.status === "healthy").length}/${TOTAL_OSINT_BASELINE + INTERNAL_STREAMS.length}`, color: "#4ADE80", icon: "ri-broadcast-line" },
    { label: isAr ? "إصدار النموذج"   : "Model version",            value: "mvp-0.3.1",                    color: "#FACC15", icon: "ri-git-commit-line" },
  ];

  const visibleKpis = presenterMode ? kpis.filter((k) => k.label !== "Model version") : kpis;

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div data-narrate-id="osint-overview-kpis" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {visibleKpis.map((k) => (
          <div key={k.label} className="rounded-xl border p-4"
            style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
            <div className="flex items-center gap-2 mb-2">
              <i className={`${k.icon} text-lg`} style={{ color: k.color }} />
              <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase font-['JetBrains_Mono']">{k.label}</span>
            </div>
            <div className="text-white font-black font-['JetBrains_Mono']"
              style={{ color: k.color, fontSize: presenterMode ? "2rem" : "1.5rem" }}>
              {k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Throughput chart */}
      <div className="rounded-xl border p-5"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-base font-bold">{isAr ? "إنتاجية المحرّك · آخر 24 ساعة" : "Engine throughput · last 24h"}</h3>
            <p className="text-gray-500 text-xs font-['JetBrains_Mono']">scored vs flagged · hourly</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-['JetBrains_Mono']">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "#D6B47E" }} /> <span className="text-gray-400">scored</span></span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "#C94A5E" }} /> <span className="text-gray-400">flagged</span></span>
          </div>
        </div>
        <div
          className="h-64"
          role="img"
          aria-label={isAr
            ? "رسم مساحي يوضّح إنتاجية المحرّك خلال آخر 24 ساعة: سجلات مفحوصة مقابل سجلات مُعلَّمة لكل ساعة"
            : "Area chart showing engine throughput over the last 24 hours: scored vs flagged records per hour"}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={THROUGHPUT_24H}>
              <defs>
                <linearGradient id="g-scored" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D6B47E" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#D6B47E" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="g-flagged" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C94A5E" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#C94A5E" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,138,60,0.08)" />
              <XAxis dataKey="hour" stroke="#6B7280" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <YAxis stroke="#6B7280" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <Tooltip contentStyle={{ background: "#0A2540", border: "1px solid rgba(184,138,60,0.3)", borderRadius: 8, fontSize: 12, fontFamily: "JetBrains Mono" }} />
              <Area type="monotone" dataKey="scored"  stroke="#D6B47E" strokeWidth={2} fill="url(#g-scored)"  />
              <Area type="monotone" dataKey="flagged" stroke="#C94A5E" strokeWidth={2} fill="url(#g-flagged)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Band distribution + Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <h3 className="text-white text-base font-bold mb-4">{isAr ? "توزيع نطاقات المخاطر" : "Risk-band distribution"}</h3>
          <div className="space-y-3">
            {(Object.keys(bandCounts) as RiskBand[]).map((b) => {
              const count = bandCounts[b];
              const pct = Math.round((count / SCORED_RECORDS.length) * 100);
              return (
                <div key={b} className="flex items-center gap-3">
                  <span className="text-xs font-bold font-['JetBrains_Mono'] w-24"
                    style={{ color: SCORE_BAND_META[b].color }}>
                    {SCORE_BAND_META[b].labelEn}
                  </span>
                  <div className="flex-1 h-6 rounded-md relative overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="h-full rounded-md transition-all"
                      style={{ width: `${pct}%`, background: SCORE_BAND_META[b].color, opacity: 0.85 }} />
                  </div>
                  <span className="text-white text-sm font-bold font-['JetBrains_Mono'] w-14 text-right">{count}</span>
                  <span className="text-gray-500 text-xs font-['JetBrains_Mono'] w-12 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border p-5 flex flex-col gap-3"
          style={{ background: "linear-gradient(135deg, rgba(107,79,174,0.08), rgba(184,138,60,0.04))", borderColor: "rgba(107,79,174,0.25)" }}>
          <div className="flex items-center gap-2">
            <i className="ri-lightbulb-flash-line text-[#6B4FAE]" />
            <h3 className="text-white text-sm font-bold">{isAr ? "ما الذي يفعله المحرّك" : "What the engine does"}</h3>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Fuses open-source intelligence (OpenSanctions, GDELT, ACLED, WHO, OpenSky + advisories) with ROP internal
            streams (APIS, eVisa history, Hotels, MOL, Mobile Operators) into one unified 0–100 risk score at ETA
            adjudication and API/PNR pre-arrival. Nine sub-scores — deterministic rules for auditability, unsupervised
            ML for pattern detection, SHAP-style attribution for every flag.
          </p>
          <p className="text-gray-500 text-[11px] font-['JetBrains_Mono'] pt-2 border-t" style={{ borderColor: "rgba(107,79,174,0.2)" }}>
            Architected source-agnostic — Rasad integrates as a new adapter when access is granted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
