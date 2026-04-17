interface Props {
  isAr: boolean;
}

interface NationalityRow {
  country: string;
  countryAr: string;
  flag: string;
  count: number;
  risk: "low" | "medium" | "high" | "critical";
  pct: number;
}

const NATIONALITIES: NationalityRow[] = [
  { country: "India", countryAr: "الهند", flag: "🇮🇳", count: 1842, risk: "low", pct: 38 },
  { country: "Pakistan", countryAr: "باكستان", flag: "🇵🇰", count: 1124, risk: "low", pct: 23 },
  { country: "Bangladesh", countryAr: "بنغلاديش", flag: "🇧🇩", count: 687, risk: "low", pct: 14 },
  { country: "Philippines", countryAr: "الفلبين", flag: "🇵🇭", count: 412, risk: "low", pct: 8 },
  { country: "United Kingdom", countryAr: "المملكة المتحدة", flag: "🇬🇧", count: 287, risk: "low", pct: 6 },
  { country: "Egypt", countryAr: "مصر", flag: "🇪🇬", count: 198, risk: "low", pct: 4 },
  { country: "Yemen", countryAr: "اليمن", flag: "🇾🇪", count: 124, risk: "medium", pct: 2.5 },
  { country: "Iran", countryAr: "إيران", flag: "🇮🇷", count: 87, risk: "high", pct: 1.8 },
  { country: "Ethiopia", countryAr: "إثيوبيا", flag: "🇪🇹", count: 54, risk: "medium", pct: 1.1 },
  { country: "Somalia", countryAr: "الصومال", flag: "🇸🇴", count: 31, risk: "critical", pct: 0.6 },
];

const riskColor = (risk: NationalityRow["risk"]) => {
  if (risk === "low") return "#4ADE80";
  if (risk === "medium") return "#FACC15";
  if (risk === "high") return "#FB923C";
  return "#F87171";
};

const riskLabel = (risk: NationalityRow["risk"], isAr: boolean) => {
  const map: Record<string, [string, string]> = {
    low: ["Low", "منخفض"],
    medium: ["Medium", "متوسط"],
    high: ["High", "مرتفع"],
    critical: ["Critical", "حرج"],
  };
  return isAr ? map[risk][1] : map[risk][0];
};

const NationalityBreakdown = ({ isAr }: Props) => {
  const maxCount = Math.max(...NATIONALITIES.map((n) => n.count));

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.15)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(181,142,60,0.1)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
            <i className="ri-global-line text-gold-400 text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{isAr ? "توزيع الجنسيات" : "Nationality Breakdown"}</h3>
            <p className="text-gray-500 text-xs">{isAr ? "مرمّز بمستوى المخاطر — اليوم" : "Color-coded by risk tier — Today"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(["low", "medium", "high", "critical"] as const).map((r) => (
            <div key={r} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: riskColor(r) }} />
              <span className="text-gray-500 text-xs hidden lg:block">{riskLabel(r, isAr)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="divide-y" style={{ borderColor: "rgba(181,142,60,0.06)" }}>
        {NATIONALITIES.map((nat, idx) => {
          const color = riskColor(nat.risk);
          const barWidth = (nat.count / maxCount) * 100;
          return (
            <div key={nat.country} className="flex items-center gap-4 px-6 py-3 hover:bg-white/[0.02] transition-colors">
              <span className="text-gray-600 text-xs font-['JetBrains_Mono'] w-4 flex-shrink-0">{idx + 1}</span>
              <span className="text-lg flex-shrink-0">{nat.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-semibold">{isAr ? nat.countryAr : nat.country}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color }}>{nat.count.toLocaleString()}</span>
                    <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: `${color}15`, color, border: `1px solid ${color}30`, fontSize: "9px" }}>
                      {riskLabel(nat.risk, isAr)}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${barWidth}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} />
                </div>
              </div>
              <span className="text-gray-600 text-xs font-['JetBrains_Mono'] w-10 text-right flex-shrink-0">{nat.pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NationalityBreakdown;
