interface Props {
  isAr: boolean;
}

const SEGMENTS = [
  { label: "Valid", labelAr: "سارية", value: 68, color: "#4ADE80", count: 14821 },
  { label: "Extended", labelAr: "ممتدة", value: 18, color: "#D6B47E", count: 3912 },
  { label: "Expired", labelAr: "منتهية", value: 10, color: "#C98A1B", count: 2174 },
  { label: "Overstay", labelAr: "تجاوز", value: 4, color: "#C94A5E", count: 870 },
];

const FrequentCrosserAlerts = ({ isAr }: Props) => {
  const ALERTS = [
    { id: "FC-001", name: "Tariq Al-Balushi", nameAr: "طارق البلوشي", nationality: "Oman", flag: "🇴🇲", crossings: 47, days: 30, lastEntry: "2026-04-05", entryPoint: "Hatta Crossing", risk: "high" as const },
    { id: "FC-002", name: "Vikram Sharma", nameAr: "فيكرام شارما", nationality: "India", flag: "🇮🇳", crossings: 38, days: 30, lastEntry: "2026-04-04", entryPoint: "Buraimi Crossing", risk: "high" as const },
    { id: "FC-003", name: "Ali Hassan Al-Yemeni", nameAr: "علي حسن اليمني", nationality: "Yemen", flag: "🇾🇪", crossings: 29, days: 14, lastEntry: "2026-04-05", entryPoint: "Muscat Int'l", risk: "critical" as const },
    { id: "FC-004", name: "Reza Moradi", nameAr: "رضا مرادي", nationality: "Iran", flag: "🇮🇷", crossings: 22, days: 21, lastEntry: "2026-04-03", entryPoint: "Hatta Crossing", risk: "critical" as const },
  ];

  const riskColor = (r: "high" | "critical") => r === "critical" ? "#C94A5E" : "#C98A1B";

  return (
    <div className="space-y-4">
      {/* Visa Compliance Pie */}
      <div className="rounded-2xl border p-6" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.15)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
            <i className="ri-pie-chart-line text-gold-400 text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{isAr ? "امتثال التأشيرات" : "Visa Compliance"}</h3>
            <p className="text-gray-500 text-xs">{isAr ? "توزيع حالات التأشيرة" : "Visa status distribution"}</p>
          </div>
        </div>

        {/* Donut chart (CSS-based) */}
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              {(() => {
                let offset = 0;
                return SEGMENTS.map((seg) => {
                  const dash = seg.value;
                  const gap = 100 - dash;
                  const el = (
                    <circle key={seg.label} cx="18" cy="18" r="15.9" fill="none"
                      stroke={seg.color} strokeWidth="3.5"
                      strokeDasharray={`${dash} ${gap}`}
                      strokeDashoffset={-offset}
                      style={{ transition: "stroke-dasharray 0.5s ease" }} />
                  );
                  offset += dash;
                  return el;
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white font-black text-lg font-['JetBrains_Mono']">68%</span>
              <span className="text-gray-500 text-xs">{isAr ? "سارية" : "Valid"}</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {SEGMENTS.map((seg) => (
              <div key={seg.label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                <span className="text-gray-300 text-xs flex-1">{isAr ? seg.labelAr : seg.label}</span>
                <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: seg.color }}>{seg.count.toLocaleString()}</span>
                <span className="text-gray-600 text-xs w-8 text-right">{seg.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frequent Crosser Alerts */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(201,74,94,0.2)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(201,74,94,0.12)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(201,74,94,0.1)", border: "1px solid rgba(201,74,94,0.25)" }}>
              <i className="ri-repeat-line text-red-400 text-sm" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{isAr ? "تنبيهات المتكررين" : "Frequent Crosser Alerts"}</h3>
              <p className="text-gray-500 text-xs">{isAr ? "تجاوز الحد المسموح به من العبور" : "Exceeded crossing threshold"}</p>
            </div>
          </div>
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          {ALERTS.map((alert) => {
            const color = riskColor(alert.risk);
            return (
              <div key={alert.id} className="flex items-start gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors" style={{ borderLeft: `3px solid ${color}` }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-base">{alert.flag}</span>
                    <span className="text-white font-semibold text-sm">{isAr ? alert.nameAr : alert.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: `${color}15`, color, border: `1px solid ${color}30`, fontSize: "9px" }}>
                      {alert.risk.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-500 text-xs">{alert.entryPoint}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{alert.id}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color }}>{alert.crossings}</div>
                  <div className="text-gray-500 text-xs">{isAr ? `عبور / ${alert.days} يوم` : `crossings / ${alert.days}d`}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const VisaComplianceChart = ({ isAr }: Props) => <FrequentCrosserAlerts isAr={isAr} />;

export default VisaComplianceChart;
