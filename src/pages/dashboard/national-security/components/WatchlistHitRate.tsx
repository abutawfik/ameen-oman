import { useState } from "react";
import { watchlistHits } from "@/mocks/nationalSecurityData";

interface Props {
  isAr: boolean;
}

const WatchlistHitRate = ({ isAr }: Props) => {
  const [activeFilter, setActiveFilter] = useState<"all" | "confirmed" | "pending" | "false_positive">("all");

  const filtered = activeFilter === "all" ? watchlistHits : watchlistHits.filter((h) => h.status === activeFilter);

  const confirmed = watchlistHits.filter((h) => h.status === "confirmed").length;
  const pending = watchlistHits.filter((h) => h.status === "pending").length;
  const fp = watchlistHits.filter((h) => h.status === "false_positive").length;
  const hitRate = Math.round((confirmed / watchlistHits.length) * 100);

  const listTypeCounts: Record<string, number> = {};
  watchlistHits.forEach((h) => {
    listTypeCounts[h.listType] = (listTypeCounts[h.listType] || 0) + 1;
  });

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-xl"
            style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
            <i className="ri-eye-line text-red-400 text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{isAr ? "معدل إصابات قائمة المراقبة" : "Watchlist Hit Rate"}</h3>
            <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{isAr ? "آخر 24 ساعة" : "Last 24 hours"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
          style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.2)" }}>
          <span className="text-red-400 text-lg font-black font-['JetBrains_Mono']">{hitRate}%</span>
          <span className="text-gray-500 text-xs">{isAr ? "معدل الإصابة" : "hit rate"}</span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 divide-x" style={{ borderBottom: "1px solid rgba(34,211,238,0.08)", borderColor: "rgba(34,211,238,0.08)" }}>
        {[
          { label: isAr ? "إجمالي الإصابات" : "Total Hits",    value: watchlistHits.length, color: "#22D3EE" },
          { label: isAr ? "مؤكد" : "Confirmed",                value: confirmed,             color: "#F87171" },
          { label: isAr ? "معلق" : "Pending",                  value: pending,               color: "#FACC15" },
          { label: isAr ? "إيجابي كاذب" : "False Positive",   value: fp,                    color: "#4ADE80" },
        ].map((s) => (
          <div key={s.label} className="px-4 py-3 text-center" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
            <div className="text-xl font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</div>
            <div className="text-gray-500 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* List type breakdown */}
      <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">{isAr ? "حسب نوع القائمة" : "By List Type"}</p>
        <div className="space-y-2">
          {Object.entries(listTypeCounts).map(([type, count]) => {
            const hit = watchlistHits.find((h) => h.listType === type);
            const color = hit?.listColor || "#22D3EE";
            return (
              <div key={type} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-gray-400 text-xs flex-1">{type}</span>
                <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(count / watchlistHits.length) * 100}%`, background: color }} />
                </div>
                <span className="text-xs font-bold font-['JetBrains_Mono'] w-4 text-right" style={{ color }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1 px-5 py-3 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
        {(["all", "confirmed", "pending", "false_positive"] as const).map((f) => (
          <button key={f} type="button" onClick={() => setActiveFilter(f)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
            style={{
              background: activeFilter === f ? "rgba(34,211,238,0.12)" : "transparent",
              border: `1px solid ${activeFilter === f ? "rgba(34,211,238,0.25)" : "transparent"}`,
              color: activeFilter === f ? "#22D3EE" : "#6B7280",
            }}>
            {f === "all" ? (isAr ? "الكل" : "All") : f === "confirmed" ? (isAr ? "مؤكد" : "Confirmed") : f === "pending" ? (isAr ? "معلق" : "Pending") : (isAr ? "إيجابي كاذب" : "False Positive")}
          </button>
        ))}
      </div>

      {/* Hit list */}
      <div className="divide-y overflow-y-auto" style={{ maxHeight: "420px", borderColor: "rgba(34,211,238,0.04)" }}>
        {filtered.map((hit) => {
          const statusColor = hit.status === "confirmed" ? "#F87171" : hit.status === "pending" ? "#FACC15" : "#4ADE80";
          const statusLabel = hit.status === "confirmed" ? (isAr ? "مؤكد" : "Confirmed") : hit.status === "pending" ? (isAr ? "معلق" : "Pending") : (isAr ? "إيجابي كاذب" : "False Positive");
          return (
            <div key={hit.id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0 mt-0.5"
                  style={{ background: `${hit.listColor}12`, border: `1px solid ${hit.listColor}25` }}>
                  <i className={`${hit.streamIcon} text-xs`} style={{ color: hit.listColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-white text-xs font-bold font-['JetBrains_Mono']">{hit.personRef}</span>
                    <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{hit.nationality}</span>
                    <span className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: `${hit.listColor}12`, color: hit.listColor, fontSize: "9px" }}>
                      {hit.listType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <span>{hit.stream}</span>
                    <span>·</span>
                    <span>{hit.location}</span>
                    <span>·</span>
                    <span className="font-['JetBrains_Mono']">{hit.time}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{hit.action}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: `${statusColor}12`, color: statusColor }}>
                    {statusLabel}
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${hit.matchConfidence}%`, background: statusColor }} />
                    </div>
                    <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: statusColor }}>{hit.matchConfidence}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
        <span className="text-gray-600 text-xs font-['JetBrains_Mono']">
          {isAr ? "مصدر: قاعدة بيانات المراقبة الوطنية" : "Source: National Watchlist Database"}
        </span>
        <button type="button"
          className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap"
          style={{ color: "#22D3EE" }}>
          <i className="ri-external-link-line text-xs" />
          {isAr ? "إدارة القوائم" : "Manage Lists"}
        </button>
      </div>
    </div>
  );
};

export default WatchlistHitRate;
