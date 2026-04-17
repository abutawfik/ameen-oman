import { SCORE_BAND_META, type OriginRisk } from "@/mocks/osintData";

interface Props {
  origins: OriginRisk[];
  topN?: number;
  sortBy?: "flagged" | "avgScore" | "arrivals";
  isAr?: boolean;
  title?: string;
  subtitle?: string;
  onSelect?: (iso2: string) => void;
}

// Top-N origin-country risk league table. Used by Supervisor (top-5) and
// Manager (top-10). Compact, sortable by flagged24h / avgScore / arrivals.
const OriginLeagueTable = ({
  origins,
  topN = 5,
  sortBy = "flagged",
  isAr = false,
  title,
  subtitle,
  onSelect,
}: Props) => {
  const sorted = [...origins].sort((a, b) => {
    if (sortBy === "avgScore") return b.avgScore - a.avgScore;
    if (sortBy === "arrivals") return b.arrivals24h - a.arrivals24h;
    return b.flagged24h - a.flagged24h;
  });
  const rows = sorted.slice(0, topN);

  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}
    >
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <h3 className="text-white text-sm font-bold">{title}</h3>}
          {subtitle && (
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">{subtitle}</p>
          )}
        </div>
      )}
      <div className="space-y-1.5">
        <div className="grid grid-cols-12 gap-2 px-2 text-[9px] font-bold tracking-widest uppercase font-['JetBrains_Mono'] text-gray-600">
          <span className="col-span-1">#</span>
          <span className="col-span-5">{isAr ? "البلد" : "Country"}</span>
          <span className="col-span-2 text-right">{isAr ? "وصول" : "Arrivals"}</span>
          <span className="col-span-2 text-right">{isAr ? "مُرفَع" : "Flagged"}</span>
          <span className="col-span-2 text-right">{isAr ? "درجة" : "AvgScr"}</span>
        </div>
        {rows.map((o, i) => {
          const meta = SCORE_BAND_META[o.topBand];
          const flaggedRate = o.arrivals24h > 0 ? (o.flagged24h / o.arrivals24h) * 100 : 0;
          const Component: "button" | "div" = onSelect ? "button" : "div";
          return (
            <Component
              key={o.iso2}
              onClick={onSelect ? () => onSelect(o.iso2) : undefined}
              className={`grid grid-cols-12 gap-2 items-center px-2 py-1.5 rounded-md transition-colors ${onSelect ? "cursor-pointer hover:bg-white/[0.03] text-left w-full" : ""}`}
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <span className="col-span-1 text-[11px] font-bold font-['JetBrains_Mono'] text-gray-500">
                {i + 1}
              </span>
              <div className="col-span-5 flex items-center gap-2 min-w-0">
                <span
                  className="px-1.5 py-0.5 rounded text-[9px] font-bold font-['JetBrains_Mono']"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#9CA3AF" }}
                >
                  {o.iso3}
                </span>
                <span className="text-white text-xs truncate">{isAr ? o.nameAr : o.nameEn}</span>
              </div>
              <span className="col-span-2 text-right text-gray-300 text-xs font-['JetBrains_Mono']">
                {o.arrivals24h.toLocaleString()}
              </span>
              <span
                className="col-span-2 text-right text-xs font-bold font-['JetBrains_Mono']"
                style={{ color: flaggedRate > 20 ? "#C94A5E" : flaggedRate > 10 ? "#C98A1B" : "#9CA3AF" }}
              >
                {o.flagged24h}
              </span>
              <span className="col-span-2 flex justify-end">
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold font-['JetBrains_Mono']"
                  style={{ background: `${meta.color}18`, color: meta.color }}
                >
                  {o.avgScore}
                </span>
              </span>
            </Component>
          );
        })}
      </div>
    </div>
  );
};

export default OriginLeagueTable;
