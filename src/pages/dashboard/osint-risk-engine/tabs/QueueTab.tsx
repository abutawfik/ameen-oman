// Operator Queue tab — filter bar, demo scenario loader, scored-records table.
// All filter state + selection live in the page shell; this tab only renders
// and emits events via the `setFilter*` / `onSelect` / `onScenarioLoad` props.

import { SCORE_BAND_META, type DecisionPoint, type RiskBand, type ScoredRecord } from "@/mocks/osintData";
import ClassificationPill from "../components/ClassificationPill";
import RedactableText from "../components/RedactableText";
import { scoreColor } from "../helpers/shared";
import { DEMO_SCENARIO_CARDS } from "../helpers/demoScenarios";

const QueueTab = ({
  isAr, records, filterBand, setFilterBand, filterDecision, setFilterDecision,
  onSelect, scenarioFilter, onScenarioLoad, onClearScenario, presenterMode,
}: {
  isAr: boolean;
  records: ScoredRecord[];
  filterBand: "all" | RiskBand;
  setFilterBand: (v: "all" | RiskBand) => void;
  filterDecision: "all" | DecisionPoint;
  setFilterDecision: (v: "all" | DecisionPoint) => void;
  onSelect: (r: ScoredRecord) => void;
  scenarioFilter: string | null;
  onScenarioLoad: (scenarioKey: string) => void;
  onClearScenario: () => void;
  presenterMode: boolean;
}) => {
  const BANDS: ("all" | RiskBand)[] = ["all", "critical", "high", "elevated", "borderline", "low"];
  const DPOINTS: ("all" | DecisionPoint)[] = ["all", "ETA", "API_PNR"];

  return (
    <div className="space-y-4">
      {/* F2 — Demo scenario loader */}
      <div className="rounded-xl border p-4"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-white text-sm font-bold flex items-center gap-2">
              <i className="ri-slideshow-line text-[#6B4FAE]" />
              {isAr ? "سيناريوهات العرض" : "Demo Scenarios"}
            </h3>
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
              {isAr ? "اضغط لتشغيل أي سيناريو تعليمي" : "Click any card to play the scenario end-to-end"}
            </p>
          </div>
          {scenarioFilter && (
            <button onClick={onClearScenario}
              className="px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
              <i className="ri-close-line mr-1" />
              {isAr ? "إلغاء السيناريو" : "Clear scenario"}
            </button>
          )}
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory" }}>
          {DEMO_SCENARIO_CARDS.map((s) => {
            const active = scenarioFilter === s.scenarioKey;
            return (
              <div key={s.scenarioKey}
                className="flex-shrink-0 rounded-xl border p-3 flex flex-col gap-2"
                style={{
                  width: 220,
                  scrollSnapAlign: "start",
                  background: active
                    ? `linear-gradient(135deg, ${s.color}22, rgba(10,37,64,0.8))`
                    : "rgba(10,37,64,0.85)",
                  borderColor: active ? `${s.color}55` : "rgba(184,138,60,0.1)",
                }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${s.color}18`, border: `1px solid ${s.color}44` }}>
                    <i className={`${s.icon} text-base`} style={{ color: s.color }} />
                  </div>
                  <h4 className="text-white text-xs font-bold leading-tight">{isAr ? s.titleAr : s.titleEn}</h4>
                </div>
                <p className="text-gray-400 text-[11px] leading-snug flex-1">
                  {isAr ? s.narrativeAr : s.narrativeEn}
                </p>
                <button onClick={() => onScenarioLoad(s.scenarioKey)}
                  className="mt-1 px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer flex items-center justify-center gap-1 transition-all"
                  style={{
                    background: active ? `${s.color}22` : "rgba(184,138,60,0.1)",
                    color: active ? s.color : "#D6B47E",
                    border: `1px solid ${active ? s.color : "#D6B47E"}55`,
                  }}>
                  {isAr ? "تشغيل السيناريو" : "Play scenario"}
                  <i className={isAr ? "ri-play-mini-line" : "ri-play-mini-line"} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <span className="text-gray-500 text-xs font-bold tracking-widest uppercase font-['JetBrains_Mono']">
          {isAr ? "تصفية" : "Filter"}
        </span>
        <div className="flex gap-1">
          {BANDS.map((b) => {
            const active = filterBand === b;
            const col = b === "all" ? "#D6B47E" : SCORE_BAND_META[b as RiskBand].color;
            return (
              <button key={b} onClick={() => setFilterBand(b)}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold font-['JetBrains_Mono'] tracking-widest uppercase cursor-pointer"
                style={{
                  background: active ? `${col}22` : "transparent",
                  color: active ? col : "#6B7280",
                  border: active ? `1px solid ${col}55` : "1px solid rgba(255,255,255,0.08)",
                }}>
                {b === "all" ? "ALL" : SCORE_BAND_META[b as RiskBand].labelEn}
              </button>
            );
          })}
        </div>
        <div className="w-px h-6 mx-2" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="flex gap-1">
          {DPOINTS.map((d) => {
            const active = filterDecision === d;
            return (
              <button key={d} onClick={() => setFilterDecision(d)}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold font-['JetBrains_Mono'] tracking-widest uppercase cursor-pointer"
                style={{
                  background: active ? "rgba(107,79,174,0.18)" : "transparent",
                  color: active ? "#6B4FAE" : "#6B7280",
                  border: active ? "1px solid rgba(107,79,174,0.4)" : "1px solid rgba(255,255,255,0.08)",
                }}>
                {d}
              </button>
            );
          })}
        </div>
        <div className="ml-auto text-gray-500 text-xs font-['JetBrains_Mono']">
          {records.length} {isAr ? "سجلات" : "records"}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b text-[10px] font-bold tracking-widest uppercase font-['JetBrains_Mono']"
          style={{ borderColor: "rgba(184,138,60,0.08)", color: "#6B7280" }}>
          <div className="col-span-1">{isAr ? "الدرجة" : "Score"}</div>
          <div className="col-span-3">{isAr ? "المسافر" : "Traveler"}</div>
          <div className="col-span-1">{isAr ? "الجنسية" : "Nat."}</div>
          <div className="col-span-2">{isAr ? "الرحلة" : "Flight"}</div>
          <div className="col-span-2">{isAr ? "الكفيل" : "Sponsor / Visa"}</div>
          <div className="col-span-1">{isAr ? "النقطة" : "Point"}</div>
          <div className="col-span-1">{isAr ? "النطاق" : "Band"}</div>
          <div className="col-span-1 text-right">{isAr ? "الشرح" : "Explain"}</div>
        </div>
        {records.map((r, rowIdx) => (
          <button
            key={r.id}
            data-narrate-id={rowIdx === 0 ? "osint-queue-first-row" : undefined}
            onClick={() => onSelect(r)}
            className="w-full grid grid-cols-12 gap-2 px-4 py-3 border-b cursor-pointer transition-colors text-left hover:bg-white/[0.03]"
            style={{ borderColor: "rgba(184,138,60,0.05)" }}
          >
            {/* Score */}
            <div className="col-span-1 flex items-center">
              <div className="relative flex items-center justify-center rounded-lg"
                style={{
                  background: `${scoreColor(r.band)}18`,
                  border: `2px solid ${scoreColor(r.band)}55`,
                  width: presenterMode ? 56 : 48,
                  height: presenterMode ? 56 : 48,
                }}>
                <span className="font-black font-['JetBrains_Mono']"
                  style={{ color: scoreColor(r.band), fontSize: presenterMode ? "1.125rem" : "0.875rem" }}>
                  {r.unifiedScore}
                </span>
              </div>
            </div>
            {/* Traveler */}
            <div className="col-span-3 flex flex-col justify-center min-w-0 gap-0.5">
              <div className="flex items-center gap-2 min-w-0">
                <RedactableText
                  fieldClass={r.classification}
                  value={r.travelerName}
                  className="text-white text-sm font-semibold truncate"
                />
                <ClassificationPill classification={r.classification} isAr={isAr} compact />
              </div>
              <span className="text-gray-600 text-xs font-['JetBrains_Mono'] truncate">{r.passportNumber}</span>
            </div>
            {/* Nat */}
            <div className="col-span-1 flex items-center text-gray-400 text-xs font-['JetBrains_Mono']">{r.nationality}</div>
            {/* Flight */}
            <div className="col-span-2 flex flex-col justify-center">
              <span className="text-gray-300 text-xs font-['JetBrains_Mono']">{r.carrierIata} {r.flightNumber}</span>
              <span className="text-gray-600 text-[11px] font-['JetBrains_Mono']">{r.originIata} → {r.destIata}</span>
            </div>
            {/* Sponsor */}
            <div className="col-span-2 flex flex-col justify-center min-w-0">
              <span className="text-gray-300 text-xs truncate">{r.sponsor ?? "—"}</span>
              <span className="text-gray-600 text-[11px]">{r.visaType}</span>
            </div>
            {/* Point */}
            <div className="col-span-1 flex items-center">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider font-['JetBrains_Mono']"
                style={{
                  background: r.decisionPoint === "ETA" ? "rgba(184,138,60,0.1)" : "rgba(107,79,174,0.1)",
                  color: r.decisionPoint === "ETA" ? "#D6B47E" : "#6B4FAE",
                }}>
                {r.decisionPoint}
              </span>
            </div>
            {/* Band */}
            <div className="col-span-1 flex items-center">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider font-['JetBrains_Mono']"
                style={{ background: `${scoreColor(r.band)}20`, color: scoreColor(r.band) }}>
                {SCORE_BAND_META[r.band].labelEn}
              </span>
            </div>
            {/* Arrow */}
            <div className="col-span-1 flex items-center justify-end text-gray-500">
              <i className="ri-arrow-right-s-line text-xl" />
            </div>
          </button>
        ))}
        {records.length === 0 && (
          <div className="py-10 text-center text-gray-500 text-sm">
            {isAr ? "لا توجد سجلات ضمن المرشحات الحالية" : "No records match current filters"}
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueTab;
