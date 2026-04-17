// As-of replay — Wave 2 · D5.
// Collapsible panel under the Explainability tab. Lets an operator recompute
// a traveler's score at historical points in time (the tech-spec §8.1
// "time travel"). Renders the current-vs-as-of score, a side-by-side sub-score
// BarChart, per-sub-score deltas, and the underlying change log.

import { useState } from "react";
import {
  BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";
import {
  AS_OF_SNAPSHOTS, DEFAULT_SUB_SCORE_WEIGHTS, SCORE_BAND_META,
  type ScoredRecord,
} from "@/mocks/osintData";
import { scoreColor } from "../helpers/shared";

const AsOfReplayPanel = ({ isAr, record }: { isAr: boolean; record: ScoredRecord }) => {
  const [open, setOpen] = useState(false);
  const snaps = AS_OF_SNAPSHOTS[record.id] ?? [];
  const [pickIdx, setPickIdx] = useState(0);
  const snap = snaps[pickIdx];

  if (snaps.length === 0) return null;

  const bucketLabel = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime();
    const hrs = Math.round(diff / 3_600_000);
    if (hrs < 48) return isAr ? `${hrs} ساعة مضت` : `${hrs}h ago`;
    const d = Math.round(hrs / 24);
    return isAr ? `${d} يوماً مضى` : `${d}d ago`;
  };

  const subChartData = DEFAULT_SUB_SCORE_WEIGHTS.map((w) => ({
    key: w.key,
    label: isAr ? w.labelAr : w.labelEn,
    current: record.subScores[w.key],
    asOf: snap.subScores[w.key],
    color: w.color,
  }));

  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-3 cursor-pointer text-left"
        style={{ background: open ? "rgba(184,138,60,0.06)" : "transparent" }}
      >
        <div className="flex items-center gap-2">
          <i className="ri-history-line text-base" style={{ color: "#D6B47E" }} />
          <h3 className="text-white text-sm font-bold">
            {isAr ? "إعادة تشغيل الدرجة · السفر الزمني" : "Score replay · as-of time travel"}
            <span className="ml-2 text-[10px] tracking-widest font-['JetBrains_Mono'] px-2 py-0.5 rounded"
              style={{ background: "rgba(184,138,60,0.15)", color: "#D6B47E" }}>
              {isAr ? "تقني" : "SPEC §8.1"}
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">
            {isAr ? "أعد حساب الدرجة بالوقت الماضي" : "Recompute score at a past time"}
          </span>
          <i className={open ? "ri-arrow-up-s-line text-xl text-gray-400" : "ri-arrow-down-s-line text-xl text-gray-400"} />
        </div>
      </button>

      {open && (
        <div className="p-5 pt-3 border-t" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-[10px] tracking-widest text-gray-500 font-['JetBrains_Mono']">
              {isAr ? "وقت الاستعلام" : "AS-OF"}
            </span>
            {snaps.map((s, i) => (
              <button key={s.asOf} onClick={() => setPickIdx(i)}
                className="px-3 py-1 rounded-md text-xs cursor-pointer"
                style={{
                  background: i === pickIdx ? "rgba(184,138,60,0.15)" : "rgba(255,255,255,0.04)",
                  color: i === pickIdx ? "#D6B47E" : "#9CA3AF",
                  border: `1px solid ${i === pickIdx ? "#D6B47E66" : "rgba(255,255,255,0.08)"}`,
                  fontFamily: "JetBrains Mono",
                }}>
                {bucketLabel(s.asOf)}
              </button>
            ))}
            <span className="ml-auto text-[10px] font-bold tracking-widest px-2 py-0.5 rounded"
              style={{ background: "rgba(107,79,174,0.12)", color: "#6B4FAE", fontFamily: "JetBrains Mono" }}>
              {snap.featureSnapshotHash}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current */}
            <div className="rounded-lg p-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h4 className="text-[10px] tracking-widest text-gray-500 mb-2 font-['JetBrains_Mono']">
                {isAr ? "الآن" : "CURRENT"}
              </h4>
              <p className="font-black font-['JetBrains_Mono']"
                style={{ color: scoreColor(record.band), fontSize: "2.5rem", lineHeight: 1 }}>
                {record.unifiedScore}
              </p>
              <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-widest font-['JetBrains_Mono']"
                style={{ background: `${scoreColor(record.band)}22`, color: scoreColor(record.band), border: `1px solid ${scoreColor(record.band)}55` }}>
                {SCORE_BAND_META[record.band].labelEn}
              </span>
            </div>
            {/* As-of */}
            <div className="rounded-lg p-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h4 className="text-[10px] tracking-widest text-gray-500 mb-2 font-['JetBrains_Mono']">
                {isAr ? "بتاريخ" : `AS-OF ${bucketLabel(snap.asOf).toUpperCase()}`}
              </h4>
              <p className="font-black font-['JetBrains_Mono']"
                style={{ color: "#9CA3AF", fontSize: "2.5rem", lineHeight: 1 }}>
                {snap.unifiedScore}
              </p>
              <p className="text-[10px] text-gray-500 mt-1 font-['JetBrains_Mono']">
                Δ {snap.unifiedScore - record.unifiedScore > 0 ? "+" : ""}{snap.unifiedScore - record.unifiedScore} pts vs current
              </p>
            </div>
          </div>

          {/* Sub-score side-by-side bars */}
          <div className="mt-4 rounded-lg p-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h4 className="text-white text-sm font-bold mb-3">
              {isAr ? "مقارنة الدرجات الفرعية" : "Sub-score comparison"}
            </h4>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,138,60,0.08)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#6B7280" tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
                  <YAxis type="category" dataKey="label" stroke="#6B7280" tick={{ fontSize: 10, fontFamily: "Inter" }} width={130} />
                  <Tooltip contentStyle={{ background: "#0A2540", border: "1px solid rgba(184,138,60,0.3)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="asOf" name={isAr ? "بتاريخ" : "As-of"} fill="#6B7280" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="current" name={isAr ? "الآن" : "Current"} fill="#D6B47E" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Delta per sub */}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-1.5">
              {subChartData.map((d) => {
                const delta = d.current - d.asOf;
                if (delta === 0) return null;
                const worse = delta > 0;
                return (
                  <div key={d.key} className="flex items-center gap-2 text-[11px] px-2 py-1 rounded-md"
                    style={{ background: "rgba(255,255,255,0.03)" }}>
                    <i className={worse ? "ri-arrow-up-line" : "ri-arrow-down-line"}
                      style={{ color: worse ? "#C98A1B" : "#4A8E3A" }} />
                    <span className="text-gray-300 flex-1 truncate font-['Inter']">{d.label}</span>
                    <span className="font-bold font-['JetBrains_Mono']"
                      style={{ color: worse ? "#C98A1B" : "#4A8E3A" }}>
                      {delta > 0 ? "+" : ""}{delta}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Change log */}
          <div className="mt-4 rounded-lg p-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h4 className="text-white text-sm font-bold mb-3">
              {isAr ? "السجل التفصيلي" : "Change log"}
            </h4>
            <ul className="space-y-1.5">
              {snap.differences.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <i className="ri-arrow-right-line mt-0.5" style={{ color: "#D6B47E" }} />
                  <span className="flex-1 text-gray-300 font-['Inter']">
                    <span className="text-gray-500">{d.source}: </span>
                    <span className="text-gray-400">{d.thenValue}</span>
                    <span className="mx-1 text-gray-600">→</span>
                    <span className="text-white">{d.nowValue}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[10px] text-gray-500 font-['JetBrains_Mono']">
              {isAr ? "إعادة تشغيل حتمية — نفس المدخلات + نفس إصدار النموذج = نفس الدرجة ضمن 0.01" : "Deterministic replay — same input + same model version = same score within 0.01"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsOfReplayPanel;
