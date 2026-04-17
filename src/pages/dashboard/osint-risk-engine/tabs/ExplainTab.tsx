// Explainability tab — traveler header, coverage strip, sub-score bars,
// per-sub-score contributions list. The collapsible as-of replay and the
// developer-mode feature-vector inspector live under ../components.

import {
  BarChart, Bar, Cell, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";
import {
  DEFAULT_SUB_SCORE_WEIGHTS, RISK_RULES, SCORE_BAND_META,
  type FeatureVector, type ScoredRecord, type SubScoreKey, type SubScoreWeight,
} from "@/mocks/osintData";
import ClassificationPill from "../components/ClassificationPill";
import RedactableText from "../components/RedactableText";
import AsOfReplayPanel from "../components/AsOfReplayPanel";
import FeatureVectorInspector from "../components/FeatureVectorInspector";
import { confidenceColor, scoreColor } from "../helpers/shared";

const ExplainTab = ({
  isAr, record, weights, onBack, presenterMode, scenarioToast, onDismissToast, featureVector,
}: {
  isAr: boolean;
  record: ScoredRecord | null;
  weights: SubScoreWeight[];
  onBack: () => void;
  presenterMode: boolean;
  scenarioToast: string | null;
  onDismissToast: () => void;
  featureVector: FeatureVector | null;
}) => {
  if (!record) {
    return (
      <div className="rounded-xl border p-8 text-center"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <i className="ri-focus-3-line text-5xl text-gray-600 mb-3" />
        <p className="text-gray-400 mb-4">{isAr ? "اختر سجلاً من قائمة المشغّل لعرض الشرح" : "Select a record from the Operator Queue to see its explainability breakdown"}</p>
        <button onClick={onBack}
          className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
          style={{ background: "rgba(184,138,60,0.1)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.3)" }}>
          {isAr ? "فتح قائمة المشغّل" : "Open Operator Queue"}
        </button>
      </div>
    );
  }

  const subChartData = weights.map((w) => ({
    key: w.key,
    label: w.labelEn,
    value: record.subScores[w.key],
    color: w.color,
  }));

  // Group contributions by sub-score for readability — all 9 keys.
  const contribsBySub: Record<SubScoreKey, typeof record.contributions> = {
    sanctions: [], geopolitical: [], biosecurity: [], routing: [],
    behavioral: [], declaration: [], entity: [], presence: [], document: [],
  };
  record.contributions.forEach((c) => contribsBySub[c.subScore].push(c));

  // D3 — coverage stats
  const expectedSources = record.sourcesAvailable.length + record.sourcesUnavailable.length;
  const availablePct = expectedSources > 0
    ? Math.round((record.sourcesAvailable.length / expectedSources) * 100)
    : 100;
  const activeRules = RISK_RULES.filter((r) => r.enabled && !record.rulesSkipped.includes(r.id)).length;
  const totalRules = RISK_RULES.length;
  const degraded = record.sourcesUnavailable.length > 0 || record.rulesSkipped.length > 0;

  return (
    <div className="space-y-4">
      {/* F2 — scenario toast */}
      {scenarioToast && (
        <div className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
          style={{
            background: "linear-gradient(135deg, rgba(184,138,60,0.14), rgba(107,79,174,0.08))",
            borderColor: "rgba(184,138,60,0.4)",
          }}>
          <div className="flex items-center gap-3">
            <i className="ri-sparkling-2-line text-[#D6B47E] text-lg" />
            <span className="text-white text-sm font-semibold">{scenarioToast}</span>
          </div>
          <button onClick={onDismissToast}
            className="text-gray-400 hover:text-white cursor-pointer"
            aria-label={isAr ? "إخفاء" : "Dismiss"}>
            <i className="ri-close-line text-lg" />
          </button>
        </div>
      )}

      {/* Traveler header */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border p-5"
        style={{
          background: `linear-gradient(135deg, ${scoreColor(record.band)}14, rgba(10,37,64,0.8))`,
          borderColor: `${scoreColor(record.band)}44`,
        }}>
        <div className="flex items-start gap-4">
          <button onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
            <i className="ri-arrow-left-line" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-white text-xl font-bold">{record.travelerName}</h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest font-['JetBrains_Mono']"
                style={{ background: `${scoreColor(record.band)}22`, color: scoreColor(record.band), border: `1px solid ${scoreColor(record.band)}55` }}>
                {SCORE_BAND_META[record.band].labelEn}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-['JetBrains_Mono']"
                style={{
                  background: record.decisionPoint === "ETA" ? "rgba(184,138,60,0.1)" : "rgba(107,79,174,0.1)",
                  color: record.decisionPoint === "ETA" ? "#D6B47E" : "#6B4FAE",
                }}>
                {record.decisionPoint}
              </span>
              {/* B2 — classification pill on Explain header */}
              <ClassificationPill classification={record.classification} isAr={isAr} />
            </div>
            <p className="text-gray-500 text-xs font-['JetBrains_Mono']">
              {record.passportNumber} · {record.nationality} · {record.carrierIata} {record.flightNumber} · {record.originIata} → {record.destIata}
            </p>
            <p className="text-gray-500 text-xs font-['JetBrains_Mono'] mt-0.5">
              {isAr ? "الكفيل" : "Sponsor"}: {record.sponsor ?? "—"} · {record.visaType}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-500 text-[10px] font-bold tracking-widest font-['JetBrains_Mono']">UNIFIED SCORE</span>
          <span className="font-black font-['JetBrains_Mono']"
            style={{
              color: scoreColor(record.band),
              fontSize: presenterMode ? "3.5rem" : "2.5rem",
              lineHeight: 1,
            }}>
            {record.unifiedScore}
          </span>
          {!presenterMode && (
            <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">
              model {record.modelVersion}
            </span>
          )}
        </div>
      </div>

      {/* D3 — coverage strip */}
      <div data-narrate-id="osint-explain-coverage" className="rounded-xl border px-4 py-3"
        style={{
          background: degraded
            ? "linear-gradient(135deg, rgba(201,138,27,0.08), rgba(10,37,64,0.8))"
            : "rgba(10,37,64,0.65)",
          borderColor: degraded ? "rgba(201,138,27,0.3)" : "rgba(184,138,60,0.12)",
        }}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-['JetBrains_Mono']">
          <span className="flex items-center gap-2 text-gray-300">
            <i className="ri-radar-line text-[#D6B47E]" />
            {isAr
              ? `يستند إلى ${record.sourcesAvailable.length}/${expectedSources} مصادر OSINT · ${activeRules}/${totalRules} قواعد نشطة`
              : `Based on ${record.sourcesAvailable.length}/${expectedSources} OSINT sources · ${activeRules}/${totalRules} rules fired`}
          </span>
          {degraded && (
            <span className="flex items-center gap-2" style={{ color: "#C98A1B" }}>
              <i className="ri-error-warning-line" />
              {isAr ? "مُتخطّى: " : "Skipped: "}
              {[
                ...record.sourcesUnavailable.map((s) => `${s} (${isAr ? "تغذية قديمة" : "feed stale"})`),
                ...record.rulesSkipped.map((r) => `${r} (${isAr ? "معطّلة" : "disabled"})`),
              ].join(" · ")}
            </span>
          )}
          <span className="flex items-center gap-2 ml-auto text-gray-300">
            {isAr ? "الثقة" : "Confidence"}:
            <span className="font-bold" style={{ color: availablePct >= 90 ? "#4ADE80" : availablePct >= 75 ? "#C98A1B" : "#C94A5E" }}>
              {availablePct}%
            </span>
            <span className="inline-block h-1.5 w-32 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <span className="block h-full rounded-full"
                style={{
                  width: `${availablePct}%`,
                  background: availablePct >= 90 ? "#4ADE80" : availablePct >= 75 ? "#C98A1B" : "#C94A5E",
                }} />
            </span>
          </span>
        </div>
      </div>

      {/* Sub-score bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <h3 className="text-white text-sm font-bold mb-4">{isAr ? "الدرجات الفرعية" : "Sub-score contribution"}</h3>
          <div style={{ height: presenterMode ? 340 : 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,138,60,0.08)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#6B7280" tick={{ fontSize: presenterMode ? 12 : 10, fontFamily: "JetBrains Mono" }} />
                <YAxis type="category" dataKey="label" stroke="#6B7280" tick={{ fontSize: presenterMode ? 13 : 11, fontFamily: "Inter" }} width={130} />
                <Tooltip contentStyle={{ background: "#0A2540", border: "1px solid rgba(184,138,60,0.3)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {subChartData.map((d) => (<Cell key={d.key} fill={d.color} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight contribution legend */}
        <div className="rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <h3 className="text-white text-sm font-bold mb-4">{isAr ? "الأوزان النشطة" : "Active weights"}</h3>
          <div className="space-y-2">
            {weights.map((w) => {
              const sub = record.subScores[w.key];
              const pts = (sub * (w.weight / 100)).toFixed(1);
              return (
                <div key={w.key} className="flex items-center gap-3 text-xs">
                  <i className={`${w.icon} text-base`} style={{ color: w.color }} />
                  <span className="text-gray-300 flex-1 font-semibold">{isAr ? w.labelAr : w.labelEn}</span>
                  <span className="text-gray-500 font-['JetBrains_Mono']">{w.weight}%</span>
                  <span className="text-gray-600 font-['JetBrains_Mono']">×</span>
                  <span className="text-white font-['JetBrains_Mono'] w-8 text-right">{sub}</span>
                  <span className="text-gray-600 font-['JetBrains_Mono']">=</span>
                  <span className="font-['JetBrains_Mono'] w-10 text-right font-bold" style={{ color: w.color }}>{pts}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contributions per sub-score */}
      <div className="rounded-xl border p-5"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <h3 className="text-white text-sm font-bold mb-4">
          {isAr ? "الإسهامات التفصيلية" : "Contributing signals"}
          <span className="ml-3 text-xs font-['JetBrains_Mono'] text-gray-600">
            {record.contributions.length} {isAr ? "إسهاماً" : "contributions"}
          </span>
        </h3>
        <div className="space-y-4">
          {(Object.keys(contribsBySub) as SubScoreKey[]).map((sub) => {
            const items = contribsBySub[sub];
            if (items.length === 0) return null;
            const meta = DEFAULT_SUB_SCORE_WEIGHTS.find((w) => w.key === sub)!;
            return (
              <div key={sub}>
                <div className="flex items-center gap-2 mb-2">
                  <i className={`${meta.icon} text-sm`} style={{ color: meta.color }} />
                  <span className="text-xs font-bold tracking-widest uppercase font-['JetBrains_Mono']" style={{ color: meta.color }}>
                    {isAr ? meta.labelAr : meta.labelEn}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {items.map((c, i) => (
                    <div key={`${c.ref}-${i}`} className="flex items-start gap-3 px-3 py-2 rounded-md"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-['JetBrains_Mono'] tracking-widest flex-shrink-0"
                        style={{
                          background: c.type === "rule" ? "rgba(184,138,60,0.12)" : "rgba(107,79,174,0.12)",
                          color: c.type === "rule" ? "#D6B47E" : "#6B4FAE",
                        }}>
                        {c.type === "rule" ? "RULE" : "ML"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-gray-200 text-xs font-bold font-['JetBrains_Mono']">{c.ref}</span>
                          <span className="text-gray-600 text-[10px]">·</span>
                          <span className="text-gray-500 text-[10px] font-['JetBrains_Mono']">{c.source}</span>
                          <span className="text-[10px] font-bold font-['JetBrains_Mono'] px-1.5 py-0.5 rounded"
                            style={{ background: `${confidenceColor[c.confidence]}18`, color: confidenceColor[c.confidence] }}>
                            {c.confidence}
                          </span>
                        </div>
                        {/* D5 — redact observed text for classified records. */}
                        <RedactableText fieldClass={record.classification} value={c.observed} className="text-gray-400 text-xs block" />
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[10px] text-gray-600 font-['JetBrains_Mono']">+pts</div>
                        <div className="text-sm font-bold font-['JetBrains_Mono']" style={{ color: meta.color }}>
                          {c.contribution.toFixed(0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wave 2 · D5 — Score replay (as-of time travel) */}
      {!presenterMode && (
        <AsOfReplayPanel isAr={isAr} record={record} />
      )}

      {/* D4 — Feature Vector inspector (developer mode, hidden in presenter) */}
      {!presenterMode && featureVector && (
        <FeatureVectorInspector isAr={isAr} vector={featureVector} />
      )}
    </div>
  );
};

export default ExplainTab;
