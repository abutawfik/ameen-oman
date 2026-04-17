import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface Props {
  label: string;
  value: string;
  icon: string;
  color: string;
  deltaPct?: number; // optional, positive or negative
  deltaDirHint?: "up_is_good" | "down_is_good";
  sparkline?: number[];
  subtitle?: string;
}

// Compact KPI card for hero strips (Supervisor + Manager homes).
//
// Layout:
//   ┌──────────────────────────────────┐
//   │ [icon] LABEL…………………   ↑ 6.4%  │ ← top row: icon + small-caps label (wraps ok),
//   │                                   │   delta floats to the right (absolute, never displaces label)
//   │  VALUE                            │ ← big value, auto-shrinks if long
//   │  subtitle                         │
//   │  ~~~~sparkline bg~~~~~~~~~~~~~~~  │ ← sparkline renders as a faint absolute layer
//   └──────────────────────────────────┘   behind the content so it never steals horizontal width
//
// Designed for a grid that may squeeze to ~170–220px per tile — every piece
// of content sits in its own row so narrow columns don't wrap labels into a
// disaster. Sparkline sits behind text so value + subtitle can use 100% width.
const KpiTile = ({ label, value, icon, color, deltaPct, deltaDirHint = "up_is_good", sparkline, subtitle }: Props) => {
  const deltaColor =
    typeof deltaPct === "number"
      ? (deltaDirHint === "up_is_good" ? deltaPct >= 0 : deltaPct <= 0)
        ? "#4ADE80"
        : "#F87171"
      : "#6B7280";
  const deltaIcon =
    typeof deltaPct === "number"
      ? deltaPct > 0
        ? "ri-arrow-up-line"
        : deltaPct < 0
          ? "ri-arrow-down-line"
          : "ri-subtract-line"
      : "";

  const sparkData = (sparkline ?? []).map((v, i) => ({ x: i, y: v }));
  const sparkId = `spark-${label.replace(/\s+/g, "-")}-${color.replace("#", "")}`;

  // Auto-shrink value font if the string is long (e.g. "35,309", "4.25 OMR").
  // Keeps the BIG feel for short values (e.g. "42") while never breaking the
  // tile width on long ones.
  const valueLen = value.length;
  const valueSize =
    valueLen <= 4 ? "1.75rem" : valueLen <= 6 ? "1.5rem" : valueLen <= 9 ? "1.25rem" : "1.05rem";

  return (
    <div
      className="relative rounded-xl border p-4 flex flex-col min-w-0 overflow-hidden min-h-[120px]"
      style={{ background: "rgba(20,29,46,0.65)", borderColor: "rgba(184,138,60,0.12)" }}
    >
      {/* Sparkline — absolute background, 40% height at the bottom, faint */}
      {sparkData.length > 1 && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 bottom-0"
          style={{ height: "45%", opacity: 0.55 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={sparkId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.38} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="y"
                stroke={color}
                strokeWidth={1.25}
                fill={`url(#${sparkId})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Delta — absolute top-right, never displaces the label */}
      {typeof deltaPct === "number" && (
        <span
          className="absolute top-3 right-3 flex items-center gap-0.5 text-[10px] font-bold font-['JetBrains_Mono'] whitespace-nowrap"
          style={{ color: deltaColor }}
        >
          <i className={deltaIcon} />
          {Math.abs(deltaPct).toFixed(1)}%
        </span>
      )}

      {/* Content stack — lives above the sparkline layer */}
      <div className="relative flex flex-col gap-2 min-w-0">
        {/* Label row */}
        <div className="flex items-center gap-1.5 min-w-0 pr-12">
          <i className={`${icon} text-sm flex-shrink-0`} style={{ color }} />
          <span
            className="text-[10px] font-bold tracking-[0.1em] uppercase font-['JetBrains_Mono'] leading-tight"
            style={{ color: "#9CA3AF" }}
          >
            {label}
          </span>
        </div>

        {/* Value */}
        <div
          className="font-black font-['JetBrains_Mono'] leading-none whitespace-nowrap"
          style={{ color, fontSize: valueSize }}
        >
          {value}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            className="text-[10px] font-['JetBrains_Mono'] leading-tight"
            style={{ color: "#6B7280" }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiTile;
