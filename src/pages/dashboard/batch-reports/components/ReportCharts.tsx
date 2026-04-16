import { useState } from "react";

interface Props { isAr: boolean; }

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAYS_AR = ["اثن", "ثلا", "أرب", "خمي", "جمع", "سبت", "أحد"];
const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

const TIME_SERIES = [
  { day: "Apr 1", hotel: 420, mobile: 380, financial: 290, border: 180, other: 340 },
  { day: "Apr 2", hotel: 510, mobile: 420, financial: 310, border: 210, other: 390 },
  { day: "Apr 3", hotel: 380, mobile: 350, financial: 270, border: 160, other: 310 },
  { day: "Apr 4", hotel: 620, mobile: 490, financial: 380, border: 240, other: 450 },
  { day: "Apr 5", hotel: 580, mobile: 460, financial: 350, border: 220, other: 420 },
  { day: "Apr 6", hotel: 440, mobile: 390, financial: 300, border: 190, other: 360 },
  { day: "Apr 7", hotel: 700, mobile: 540, financial: 410, border: 270, other: 510 },
];

const DONUT_DATA = [
  { label: "Hotel Events",       labelAr: "أحداث الفنادق",    pct: 22, color: "#22D3EE" },
  { label: "Mobile Operators",   labelAr: "مشغلو الاتصالات",  pct: 19, color: "#4ADE80" },
  { label: "Financial Services", labelAr: "الخدمات المالية",  pct: 16, color: "#FACC15" },
  { label: "Border Intelligence",labelAr: "استخبارات الحدود", pct: 11, color: "#60A5FA" },
  { label: "Car Rental",         labelAr: "تأجير السيارات",   pct: 9,  color: "#FB923C" },
  { label: "Employment",         labelAr: "التوظيف",           pct: 8,  color: "#F9A8D4" },
  { label: "Other Modules",      labelAr: "وحدات أخرى",       pct: 15, color: "#A78BFA" },
];

const NATIONALITIES = [
  { nat: "Omani",      natAr: "عُماني",    count: 18420, pct: 38, color: "#22D3EE" },
  { nat: "Indian",     natAr: "هندي",      count: 9840,  pct: 20, color: "#4ADE80" },
  { nat: "Pakistani",  natAr: "باكستاني",  count: 5820,  pct: 12, color: "#FACC15" },
  { nat: "Bangladeshi",natAr: "بنغلاديشي", count: 3890,  pct: 8,  color: "#FB923C" },
  { nat: "British",    natAr: "بريطاني",   count: 2940,  pct: 6,  color: "#A78BFA" },
  { nat: "Filipino",   natAr: "فلبيني",    count: 2450,  pct: 5,  color: "#F9A8D4" },
  { nat: "Other",      natAr: "أخرى",      count: 4931,  pct: 11, color: "#6B7280" },
];

// Heatmap data: 7 days x 24 hours
const HEATMAP: number[][] = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 24 }, (_, h) => {
    const base = h >= 8 && h <= 20 ? 60 : 10;
    const peak = (h >= 9 && h <= 11) || (h >= 14 && h <= 17) ? 40 : 0;
    const weekend = d >= 5 ? -20 : 0;
    return Math.max(0, Math.min(100, base + peak + weekend + Math.floor(Math.random() * 20)));
  })
);

const heatColor = (val: number) => {
  if (val < 20) return "rgba(34,211,238,0.05)";
  if (val < 40) return "rgba(34,211,238,0.15)";
  if (val < 60) return "rgba(34,211,238,0.35)";
  if (val < 80) return "rgba(34,211,238,0.6)";
  return "rgba(34,211,238,0.9)";
};

const ReportCharts = ({ isAr }: Props) => {
  const [hoveredCell, setHoveredCell] = useState<{ d: number; h: number } | null>(null);

  const maxBar = Math.max(...TIME_SERIES.map((d) => d.hotel + d.mobile + d.financial + d.border + d.other));

  return (
    <div className="space-y-6">
      {/* Events Over Time */}
      <div className="rounded-2xl border p-6"
        style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
            <i className="ri-line-chart-line text-cyan-400 text-sm" />
          </div>
          <h3 className="text-white font-bold text-sm">{isAr ? "الأحداث عبر الزمن" : "Events Over Time"}</h3>
          <div className="ml-auto flex flex-wrap gap-3">
            {[
              { label: "Hotel", labelAr: "فنادق", color: "#22D3EE" },
              { label: "Mobile", labelAr: "اتصالات", color: "#4ADE80" },
              { label: "Financial", labelAr: "مالية", color: "#FACC15" },
              { label: "Border", labelAr: "حدود", color: "#60A5FA" },
              { label: "Other", labelAr: "أخرى", color: "#A78BFA" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                <span className="text-gray-500 text-xs">{isAr ? l.labelAr : l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-2 h-48">
          {TIME_SERIES.map((d) => {
            const total = d.hotel + d.mobile + d.financial + d.border + d.other;
            const scale = (v: number) => (v / maxBar) * 100;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col-reverse rounded-t-sm overflow-hidden" style={{ height: `${scale(total)}%` }}>
                  {[
                    { val: d.hotel, color: "#22D3EE" },
                    { val: d.mobile, color: "#4ADE80" },
                    { val: d.financial, color: "#FACC15" },
                    { val: d.border, color: "#60A5FA" },
                    { val: d.other, color: "#A78BFA" },
                  ].map((seg, i) => (
                    <div key={i} style={{ height: `${(seg.val / total) * 100}%`, background: seg.color, opacity: 0.85 }} />
                  ))}
                </div>
                <span className="text-gray-600 text-xs font-['JetBrains_Mono'] whitespace-nowrap" style={{ fontSize: "9px" }}>{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donut + Nationality side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Type Distribution */}
        <div className="rounded-2xl border p-6"
          style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
              <i className="ri-donut-chart-line text-cyan-400 text-sm" />
            </div>
            <h3 className="text-white font-bold text-sm">{isAr ? "توزيع أنواع الأحداث" : "Event Type Distribution"}</h3>
          </div>
          <div className="flex items-center gap-6">
            {/* Donut */}
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {(() => {
                  let offset = 0;
                  return DONUT_DATA.map((seg) => {
                    const dash = seg.pct;
                    const el = (
                      <circle key={seg.label} cx="18" cy="18" r="15.9" fill="none"
                        stroke={seg.color} strokeWidth="3.5"
                        strokeDasharray={`${dash} ${100 - dash}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="butt" />
                    );
                    offset += dash;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white font-black text-sm font-['JetBrains_Mono']">7</span>
                <span className="text-gray-500 text-xs">{isAr ? "وحدة" : "modules"}</span>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {DONUT_DATA.map((seg) => (
                <div key={seg.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                  <span className="text-gray-400 text-xs flex-1 truncate">{isAr ? seg.labelAr : seg.label}</span>
                  <span className="text-white text-xs font-bold font-['JetBrains_Mono']">{seg.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nationality Breakdown */}
        <div className="rounded-2xl border p-6"
          style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
              <i className="ri-flag-line text-cyan-400 text-sm" />
            </div>
            <h3 className="text-white font-bold text-sm">{isAr ? "توزيع الجنسيات" : "Nationality Breakdown"}</h3>
          </div>
          <div className="space-y-3">
            {NATIONALITIES.map((n) => (
              <div key={n.nat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 text-xs">{isAr ? n.natAr : n.nat}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{n.count.toLocaleString()}</span>
                    <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: n.color }}>{n.pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${n.pct}%`, background: n.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Hours Heatmap */}
      <div className="rounded-2xl border p-6"
        style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
            <i className="ri-fire-line text-cyan-400 text-sm" />
          </div>
          <h3 className="text-white font-bold text-sm">{isAr ? "خريطة ساعات الذروة" : "Peak Hours Heatmap"}</h3>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-gray-600 text-xs">{isAr ? "منخفض" : "Low"}</span>
            {[0.05, 0.15, 0.35, 0.6, 0.9].map((op) => (
              <div key={op} className="w-4 h-4 rounded-sm" style={{ background: `rgba(34,211,238,${op})` }} />
            ))}
            <span className="text-gray-600 text-xs">{isAr ? "مرتفع" : "High"}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Hour labels */}
            <div className="flex mb-1 ml-12">
              {HOURS.filter((_, i) => i % 3 === 0).map((h) => (
                <div key={h} className="flex-1 text-center text-gray-600 font-['JetBrains_Mono']" style={{ fontSize: "9px" }}>{h}</div>
              ))}
            </div>
            {/* Grid */}
            {HEATMAP.map((row, d) => (
              <div key={d} className="flex items-center gap-0.5 mb-0.5">
                <div className="w-10 text-right pr-2 text-gray-600 font-['JetBrains_Mono'] flex-shrink-0" style={{ fontSize: "9px" }}>
                  {isAr ? DAYS_AR[d] : DAYS[d]}
                </div>
                {row.map((val, h) => (
                  <div key={h}
                    onMouseEnter={() => setHoveredCell({ d, h })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className="flex-1 h-5 rounded-sm cursor-pointer transition-all relative"
                    style={{ background: heatColor(val), border: hoveredCell?.d === d && hoveredCell?.h === h ? "1px solid #22D3EE" : "1px solid transparent" }}>
                    {hoveredCell?.d === d && hoveredCell?.h === h && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded text-xs whitespace-nowrap z-10 pointer-events-none"
                        style={{ background: "rgba(6,13,26,0.95)", border: "1px solid rgba(34,211,238,0.3)", color: "#22D3EE", fontSize: "9px" }}>
                        {DAYS[d]} {HOURS[h]}: {val}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCharts;
