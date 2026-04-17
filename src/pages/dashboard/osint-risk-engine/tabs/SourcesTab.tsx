// Sources tab — OSINT + Internal stream catalog, filter toggle, per-source
// card grid. Rasad-readiness footer frames the adapter pattern.

import { useMemo, useState } from "react";
import {
  CLASSIFICATION_META, INTERNAL_STREAMS, OSINT_SOURCES,
  type OsintSource,
} from "@/mocks/osintData";
import ClassificationPill from "../components/ClassificationPill";
import { confidenceColor, sourceStatusMeta, timeSince, type SourceFilter } from "../helpers/shared";

const SourcesTab = ({ isAr, presenterMode }: { isAr: boolean; presenterMode: boolean }) => {
  const [filter, setFilter] = useState<SourceFilter>("all");
  const allSources: OsintSource[] = useMemo(
    () => [...OSINT_SOURCES, ...INTERNAL_STREAMS],
    [],
  );
  const filtered = allSources.filter((s) => (filter === "all" ? true : s.sourceType === filter));

  const osintCount = OSINT_SOURCES.length;
  const internalCount = INTERNAL_STREAMS.length;

  const FILTER_TABS: { id: SourceFilter; labelEn: string; labelAr: string; count: number; color: string }[] = [
    { id: "all",      labelEn: "All",              labelAr: "الكل",           count: osintCount + internalCount, color: "#D6B47E" },
    { id: "osint",    labelEn: "OSINT",            labelAr: "مصادر مفتوحة",   count: osintCount,                 color: "#D6B47E" },
    { id: "internal", labelEn: "Internal Streams", labelAr: "تدفقات داخلية",  count: internalCount,              color: "#4ADE80" },
  ];

  return (
    <div className="space-y-4" data-narrate-id="osint-sources-mix">
      {/* Filter toggle */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <span className="text-gray-500 text-xs font-bold tracking-widest uppercase font-['JetBrains_Mono']">
          {isAr ? "نوع المصدر" : "Source type"}
        </span>
        <div className="flex gap-1">
          {FILTER_TABS.map((t) => {
            const active = filter === t.id;
            return (
              <button key={t.id} onClick={() => setFilter(t.id)}
                className="px-3 py-1 rounded-md text-[11px] font-bold font-['JetBrains_Mono'] tracking-widest uppercase cursor-pointer"
                style={{
                  background: active ? `${t.color}22` : "transparent",
                  color: active ? t.color : "#6B7280",
                  border: active ? `1px solid ${t.color}55` : "1px solid rgba(255,255,255,0.08)",
                }}>
                {isAr ? t.labelAr : t.labelEn} · {t.count}
              </button>
            );
          })}
        </div>
        <div className="ml-auto text-gray-500 text-xs font-['JetBrains_Mono']">
          {filtered.length} {isAr ? "مصادر مرئية" : "shown"}
        </div>
      </div>

      {/* Source grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((s) => {
          const st = sourceStatusMeta[s.status];
          const cls = CLASSIFICATION_META[s.classification];
          return (
            <div key={s.id} className="rounded-xl border p-4 flex flex-col gap-3 relative overflow-hidden"
              style={{
                background: "rgba(10,37,64,0.65)",
                borderColor: "rgba(184,138,60,0.12)",
                borderLeft: `3px solid ${cls.color}`,
              }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: st.color, boxShadow: `0 0 8px ${st.color}` }} />
                    <h4 className="text-white text-sm font-bold truncate">{s.name}</h4>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-gray-500 text-[11px] font-['JetBrains_Mono'] truncate">{s.category}</p>
                    <ClassificationPill classification={s.classification} isAr={isAr} compact />
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest font-['JetBrains_Mono'] flex-shrink-0"
                  style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}55` }}>
                  {st.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md py-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest font-['JetBrains_Mono']">{isAr ? "التحديث" : "Refresh"}</div>
                  <div className="text-[11px] font-bold font-['JetBrains_Mono']" style={{ color: s.color }}>{s.refresh}</div>
                </div>
                <div className="rounded-md py-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest font-['JetBrains_Mono']">{isAr ? "سجلات 24 ساعة" : "24h records"}</div>
                  <div className="text-[11px] font-bold text-white font-['JetBrains_Mono']">{s.records24h.toLocaleString()}</div>
                </div>
                <div className="rounded-md py-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest font-['JetBrains_Mono']">{isAr ? "الثقة" : "Confidence"}</div>
                  <div className="text-[11px] font-bold font-['JetBrains_Mono']" style={{ color: confidenceColor[s.confidence] }}>
                    {s.confidence}
                  </div>
                </div>
              </div>

              <p className="text-gray-400 text-xs leading-relaxed flex-1">{s.signalContribution}</p>

              {!presenterMode && (
                <div className="flex items-center justify-between text-[10px] font-['JetBrains_Mono'] pt-2 border-t"
                  style={{ borderColor: "rgba(184,138,60,0.08)" }}>
                  <span className="text-gray-600 truncate">{s.endpoint}</span>
                  <span className="flex items-center gap-1 flex-shrink-0" style={{ color: st.color }}>
                    <i className="ri-time-line" /> {timeSince(s.lastSuccess)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border p-4 flex items-start gap-3"
        style={{ background: "rgba(107,79,174,0.06)", borderColor: "rgba(107,79,174,0.25)" }}>
        <i className="ri-lock-2-line text-[#6B4FAE] text-lg mt-0.5" />
        <div>
          <p className="text-white text-sm font-semibold mb-1">{isAr ? "جاهزية رصد — التصميم المنفصل للمصادر" : "Rasad readiness — source-agnostic adapter pattern"}</p>
          <p className="text-gray-400 text-xs leading-relaxed">
            Classified feeds land into the same Event / Entity / Signal schema as OSINT + Internal, with separate weight
            profiles, classification-aware routing, and segregated audit logging. No re-architecting when access is granted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SourcesTab;
