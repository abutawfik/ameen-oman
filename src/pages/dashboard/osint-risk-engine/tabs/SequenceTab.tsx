// Sequence Coherence tab (A2) — renders the per-traveler presence-coherence
// timeline (APIS → Hotel → SIM → Rental / MOL). Model 3 narrative.

import {
  SEQUENCE_TIMELINES,
  type SequenceTimeline, type SequenceTouchpoint,
} from "@/mocks/osintData";
import ClassificationPill from "../components/ClassificationPill";

const VERDICT_META: Record<SequenceTimeline["verdict"], { color: string; labelEn: string; labelAr: string }> = {
  coherent:          { color: "#4ADE80", labelEn: "COHERENT",           labelAr: "متماسك" },
  "mildly-gapped":   { color: "#FACC15", labelEn: "MILDLY GAPPED",      labelAr: "فجوة خفيفة" },
  "strongly-gapped": { color: "#C94A5E", labelEn: "STRONGLY GAPPED",    labelAr: "فجوة كبيرة" },
  missing:           { color: "#C98A1B", labelEn: "SIGNALS MISSING",    labelAr: "إشارات مفقودة" },
};

const gapColor = (observedHrs: number | null, expectedWithinHrs: number): string => {
  if (observedHrs === null) return "#C98A1B";
  // Ratio of observed to expected window — <=1 is green, 1-2 amber, >2 red.
  if (expectedWithinHrs === 0) return "#4ADE80";
  const r = observedHrs / expectedWithinHrs;
  if (r <= 1) return "#4ADE80";
  if (r <= 2) return "#FACC15";
  return "#C94A5E";
};

const SequenceRow = ({ timeline, isAr }: { timeline: SequenceTimeline; isAr: boolean }) => {
  const verdict = VERDICT_META[timeline.verdict];

  return (
    <div className="rounded-xl border p-5"
      style={{
        background: `linear-gradient(135deg, ${verdict.color}0d, rgba(10,37,64,0.75))`,
        borderColor: `${verdict.color}33`,
      }}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="text-white text-sm font-bold">{isAr ? timeline.travelerNameAr : timeline.travelerName}</h4>
            <span className="text-gray-500 text-[11px] font-['JetBrains_Mono']">{timeline.nationality}</span>
            <ClassificationPill classification={timeline.classification} isAr={isAr} compact />
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-['JetBrains_Mono'] tracking-widest"
              style={{ background: `${verdict.color}20`, color: verdict.color, border: `1px solid ${verdict.color}55` }}>
              {isAr ? verdict.labelAr : verdict.labelEn}
            </span>
          </div>
          <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
            {isAr ? "وصول APIS" : "APIS arrival"}: {new Date(timeline.apisArrivalTs).toISOString().replace("T", " ").slice(0, 16)}Z
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-500 text-[9px] font-bold tracking-widest font-['JetBrains_Mono']">
            {isAr ? "تماسك الحضور" : "PRESENCE COHERENCE"}
          </span>
          <span className="text-3xl font-black font-['JetBrains_Mono']" style={{ color: verdict.color }}>
            {timeline.presenceCoherenceScore}
          </span>
        </div>
      </div>

      {/* Timeline strip */}
      <div className="relative py-4">
        {/* connecting line */}
        <div className="absolute left-0 right-0 top-1/2 h-[2px]" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="relative grid grid-flow-col auto-cols-fr gap-1">
          {timeline.touchpoints.map((tp, i) => {
            const prev: SequenceTouchpoint | null = i > 0 ? timeline.touchpoints[i - 1] : null;
            const color = gapColor(tp.observedHrs, tp.expectedWithinHrs);
            const missing = tp.occurredAt === null && tp.expectedWithinHrs > 0;
            return (
              <div key={tp.stream} className="flex flex-col items-center gap-1 relative">
                {/* gap bar from prev to current */}
                {prev && (
                  <div className="absolute top-[calc(50%-1px)] left-0 h-[3px]"
                    style={{
                      background: missing ? "#C98A1B" : color,
                      width: "50%",
                      transform: "translateX(-50%)",
                      opacity: 0.85,
                    }} />
                )}
                <div className="w-10 h-10 rounded-full flex items-center justify-center relative z-10"
                  style={{
                    background: missing ? "rgba(10,37,64,0.95)" : `${tp.color}22`,
                    border: `2px solid ${missing ? "#C98A1B" : tp.color}`,
                  }}>
                  <i className={`${tp.icon} text-base`}
                    style={{ color: missing ? "#C98A1B" : tp.color, opacity: missing ? 0.4 : 1 }} />
                </div>
                <div className="text-center mt-1">
                  <div className="text-[10px] font-bold text-gray-300">{isAr ? tp.labelAr : tp.labelEn}</div>
                  <div className="text-[10px] font-['JetBrains_Mono']" style={{ color: missing ? "#C98A1B" : color }}>
                    {tp.observedHrs === null
                      ? (tp.expectedWithinHrs === 0 ? "t₀" : (isAr ? "مفقود" : "missing"))
                      : `+${tp.observedHrs}h`}
                  </div>
                  <div className="text-[9px] text-gray-600 font-['JetBrains_Mono']">
                    {tp.expectedWithinHrs === 0
                      ? (isAr ? "الأصل" : "origin")
                      : (isAr ? `متوقّع ≤${tp.expectedWithinHrs}س` : `expect ≤${tp.expectedWithinHrs}h`)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model narrative */}
      <div className="mt-3 pt-3 border-t flex flex-col gap-1"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-gray-300 text-xs leading-relaxed">
          {isAr ? timeline.narrativeAr : timeline.narrativeEn}
        </p>
        <p className="text-[11px] font-['JetBrains_Mono']" style={{ color: verdict.color }}>
          {isAr
            ? `مخرج النموذج: إسهام presence_coherence = ${timeline.presenceCoherenceScore}`
            : `Model output: presence_coherence sub-score contribution = ${timeline.presenceCoherenceScore}`}
        </p>
      </div>
    </div>
  );
};

const SequenceTab = ({ isAr }: { isAr: boolean }) => {
  return (
    <div className="space-y-4">
      {/* Header blurb */}
      <div className="rounded-xl border p-5 flex flex-col gap-2"
        style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(184,138,60,0.04))", borderColor: "rgba(245,158,11,0.3)" }}>
        <div className="flex items-center gap-2">
          <i className="ri-flow-chart text-[#F59E0B] text-lg" />
          <h3 className="text-white text-base font-bold">{isAr ? "النموذج الثالث — تماسك التسلسل" : "Model 3 — Sequence Coherence"}</h3>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-['JetBrains_Mono'] tracking-widest"
            style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}>
            PRESENCE
          </span>
        </div>
        <p className="text-gray-300 text-xs leading-relaxed">
          {isAr
            ? "يكتشف هذا النموذج فجوات الجدول الزمني عبر تدفقات متعددة. يقارن لكل مسافر نقاط الاتصال المتوقعة (APIS → فندق → شريحة هاتف → تأجير مركبة / وزارة العمل) بالأوقات الفعلية. الفجوات التي تتجاوز الحد تُسهم في الدرجة الفرعية `presence_coherence`."
            : "Detects multi-stream timeline gaps. For each traveler, compares expected cross-stream touchpoints (APIS → Hotel → SIM → Rental / MOL) to observed times. Gaps beyond threshold contribute to the presence_coherence sub-score."}
        </p>
      </div>

      {/* Timeline rows */}
      <div data-narrate-id="osint-sequence-gap" className="space-y-3">
        {SEQUENCE_TIMELINES.map((t) => (
          <SequenceRow key={t.travelerId} timeline={t} isAr={isAr} />
        ))}
      </div>
    </div>
  );
};

export default SequenceTab;
