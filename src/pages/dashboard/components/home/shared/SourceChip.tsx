import type { OsintSource } from "@/mocks/osintData";

interface Props {
  source: OsintSource;
  isAr?: boolean;
  compact?: boolean;
}

const statusMeta: Record<string, { color: string; bg: string; label: string; labelAr: string }> = {
  healthy:  { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",  label: "HEALTHY",  labelAr: "سليم" },
  degraded: { color: "#FB923C", bg: "rgba(251,146,60,0.1)",  label: "DEGRADED", labelAr: "متدهور" },
  stale:    { color: "#FACC15", bg: "rgba(250,204,21,0.1)",  label: "STALE",    labelAr: "قديم" },
  down:     { color: "#F87171", bg: "rgba(248,113,113,0.1)", label: "DOWN",     labelAr: "متوقف" },
};

// Compact source-status chip. Used in Supervisor's source-health grid and
// anywhere else we need a quick "is this source alive" signal.
const SourceChip = ({ source, isAr = false, compact = false }: Props) => {
  const meta = statusMeta[source.status] ?? statusMeta.healthy;

  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg border"
      style={{
        background: "rgba(20,29,46,0.65)",
        borderColor: "rgba(181,142,60,0.12)",
      }}
    >
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: meta.color, boxShadow: `0 0 6px ${meta.color}` }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-bold text-white truncate">{source.name}</div>
        {!compact && (
          <div className="text-[10px] text-gray-500 font-['JetBrains_Mono'] truncate">
            {source.records24h.toLocaleString()} / 24h
          </div>
        )}
      </div>
      <span
        className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest font-['JetBrains_Mono'] flex-shrink-0"
        style={{ background: meta.bg, color: meta.color }}
      >
        {isAr ? meta.labelAr : meta.label}
      </span>
    </div>
  );
};

export default SourceChip;
