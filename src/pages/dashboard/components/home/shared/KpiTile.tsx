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

// One compact KPI card with icon, value, optional delta, optional sparkline.
// Shared between Supervisor and Manager hero strips.
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

  return (
    <div
      className="rounded-xl border p-4 flex flex-col justify-between gap-3 min-h-[118px]"
      style={{ background: "rgba(10,22,40,0.65)", borderColor: "rgba(34,211,238,0.12)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <i className={`${icon} text-lg`} style={{ color }} />
          <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase font-['JetBrains_Mono']">
            {label}
          </span>
        </div>
        {typeof deltaPct === "number" && (
          <span
            className="flex items-center gap-0.5 text-[10px] font-bold font-['JetBrains_Mono']"
            style={{ color: deltaColor }}
          >
            <i className={deltaIcon} />
            {Math.abs(deltaPct).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color }}>
            {value}
          </div>
          {subtitle && (
            <div className="text-[10px] text-gray-600 font-['JetBrains_Mono'] mt-0.5">
              {subtitle}
            </div>
          )}
        </div>
        {sparkData.length > 1 && (
          <div className="w-24 h-10 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={sparkId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.55} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="y"
                  stroke={color}
                  strokeWidth={1.5}
                  fill={`url(#${sparkId})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiTile;
