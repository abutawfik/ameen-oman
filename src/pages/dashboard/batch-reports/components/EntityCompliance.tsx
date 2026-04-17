import { useState } from "react";

interface Props { isAr: boolean; }

const ENTITIES = [
  { name: "Al Bustan Palace Hotel",    nameAr: "فندق البستان بالاس",       icon: "ri-hotel-line",         color: "#D4A84B", rating: "gold",   score: 98, events: 1284, rejected: 12, trend: [88,90,91,93,94,95,96,97,97,98,98,98] },
  { name: "Oman Car Rental Co.",       nameAr: "شركة عُمان لتأجير السيارات",icon: "ri-car-line",           color: "#4ADE80", rating: "gold",   score: 96, events: 2103, rejected: 34, trend: [82,84,86,88,90,91,92,93,94,95,96,96] },
  { name: "Omantel",                   nameAr: "عُمانتل",                   icon: "ri-sim-card-line",      color: "#A78BFA", rating: "gold",   score: 97, events: 8412, rejected: 89, trend: [90,91,92,93,94,95,95,96,96,97,97,97] },
  { name: "Muscat Municipality",       nameAr: "بلدية مسقط",               icon: "ri-government-line",    color: "#FACC15", rating: "silver", score: 89, events: 891,  rejected: 67, trend: [78,80,81,82,83,84,85,86,87,88,89,89] },
  { name: "Bank Muscat",               nameAr: "بنك مسقط",                 icon: "ri-bank-card-line",     color: "#4ADE80", rating: "gold",   score: 99, events: 24891,rejected: 18, trend: [94,95,96,97,97,98,98,99,99,99,99,99] },
  { name: "iBorders System",           nameAr: "نظام iBorders",            icon: "ri-passport-line",      color: "#60A5FA", rating: "gold",   score: 99, events: 16303,rejected: 8,  trend: [96,97,97,98,98,99,99,99,99,99,99,99] },
  { name: "OIFC Electricity",          nameAr: "شركة الكهرباء",            icon: "ri-flashlight-line",    color: "#FACC15", rating: "silver", score: 87, events: 412,  rejected: 45, trend: [75,77,79,80,81,82,83,84,85,86,87,87] },
  { name: "Ministry of Labour",        nameAr: "وزارة العمل",              icon: "ri-briefcase-line",     color: "#F9A8D4", rating: "bronze", score: 78, events: 3891, rejected: 234,trend: [65,67,69,70,71,72,73,74,75,76,78,78] },
  { name: "Mwasalat",                  nameAr: "مواصلات",                  icon: "ri-bus-line",           color: "#FB923C", rating: "silver", score: 91, events: 42891,rejected: 156,trend: [82,84,85,86,87,88,89,90,90,91,91,91] },
  { name: "Oman Digital Commerce",     nameAr: "التجارة الرقمية عُمان",    icon: "ri-shopping-cart-line", color: "#34D399", rating: "silver", score: 88, events: 18234,rejected: 189,trend: [78,80,81,82,83,84,85,86,87,88,88,88] },
];

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const RATING_CONFIG = {
  gold:   { label: "Gold",   labelAr: "ذهبي",   color: "#D4A84B", icon: "ri-medal-line",   bg: "rgba(181,142,60,0.1)",  border: "rgba(181,142,60,0.25)" },
  silver: { label: "Silver", labelAr: "فضي",    color: "#FACC15", icon: "ri-medal-2-line", bg: "rgba(250,204,21,0.1)",  border: "rgba(250,204,21,0.25)" },
  bronze: { label: "Bronze", labelAr: "برونزي", color: "#9CA3AF", icon: "ri-award-line",   bg: "rgba(156,163,175,0.1)", border: "rgba(156,163,175,0.25)" },
};

const EntityCompliance = ({ isAr }: Props) => {
  const [selected, setSelected] = useState<typeof ENTITIES[0] | null>(null);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {(["gold", "silver", "bronze"] as const).map((r) => {
          const cfg = RATING_CONFIG[r];
          const count = ENTITIES.filter((e) => e.rating === r).length;
          return (
            <div key={r} className="rounded-2xl border p-4 flex items-center gap-4"
              style={{ background: cfg.bg, borderColor: cfg.border, backdropFilter: "blur(12px)" }}>
              <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}>
                <i className={`${cfg.icon} text-lg`} style={{ color: cfg.color }} />
              </div>
              <div>
                <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: cfg.color }}>{count}</div>
                <div className="text-gray-400 text-xs">{isAr ? cfg.labelAr : cfg.label} {isAr ? "تصنيف" : "Rated"}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Entity table */}
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
          <div className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
            <i className="ri-building-line text-gold-400 text-sm" />
          </div>
          <h3 className="text-white font-bold text-sm">{isAr ? "امتثال الكيانات" : "Entity Compliance"}</h3>
          <span className="text-gray-500 text-xs ml-2">{isAr ? "ملخص شهري" : "Monthly Summary"}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr style={{ background: "rgba(181,142,60,0.04)", borderBottom: "1px solid rgba(181,142,60,0.08)" }}>
                {[
                  isAr ? "الكيان" : "Entity",
                  isAr ? "التصنيف" : "Rating",
                  isAr ? "النتيجة" : "Score",
                  isAr ? "الأحداث" : "Events",
                  isAr ? "المرفوضة" : "Rejected",
                  isAr ? "معدل الرفض" : "Reject Rate",
                  isAr ? "اتجاه 12 شهر" : "12-Month Trend",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ENTITIES.map((entity, idx) => {
                const cfg = RATING_CONFIG[entity.rating as keyof typeof RATING_CONFIG];
                const rejectRate = ((entity.rejected / entity.events) * 100).toFixed(1);
                return (
                  <tr key={entity.name}
                    onClick={() => setSelected(selected?.name === entity.name ? null : entity)}
                    className="border-b cursor-pointer transition-colors"
                    style={{
                      background: selected?.name === entity.name ? "rgba(181,142,60,0.05)" : idx % 2 === 0 ? "rgba(20,29,46,0.6)" : "rgba(11,18,32,0.4)",
                      borderColor: "rgba(181,142,60,0.05)",
                    }}
                    onMouseEnter={(e) => { if (selected?.name !== entity.name) (e.currentTarget as HTMLElement).style.background = "rgba(181,142,60,0.03)"; }}
                    onMouseLeave={(e) => { if (selected?.name !== entity.name) (e.currentTarget as HTMLElement).style.background = idx % 2 === 0 ? "rgba(20,29,46,0.6)" : "rgba(11,18,32,0.4)"; }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
                          style={{ background: `${entity.color}12`, border: `1px solid ${entity.color}20` }}>
                          <i className={`${entity.icon} text-xs`} style={{ color: entity.color }} />
                        </div>
                        <span className="text-white text-xs font-semibold whitespace-nowrap">{isAr ? entity.nameAr : entity.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold w-fit"
                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                        <i className={`${cfg.icon} text-xs`} />
                        {isAr ? cfg.labelAr : cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm font-['JetBrains_Mono']">{entity.score}%</span>
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full" style={{ width: `${entity.score}%`, background: cfg.color }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-300 text-xs font-['JetBrains_Mono']">{entity.events.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-red-400 text-xs font-['JetBrains_Mono']">{entity.rejected}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-['JetBrains_Mono']"
                        style={{ color: Number(rejectRate) < 1 ? "#4ADE80" : Number(rejectRate) < 3 ? "#FACC15" : "#F87171" }}>
                        {rejectRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {/* Mini sparkline */}
                      <div className="flex items-end gap-0.5 h-6">
                        {entity.trend.map((v, i) => (
                          <div key={i} className="flex-1 rounded-sm"
                            style={{ height: `${((v - 60) / 40) * 100}%`, background: i === entity.trend.length - 1 ? cfg.color : `${cfg.color}40`, minHeight: "2px" }} />
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="rounded-2xl border p-6"
          style={{ background: "rgba(11,18,32,0.95)", borderColor: "rgba(181,142,60,0.2)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl"
                style={{ background: `${selected.color}12`, border: `1px solid ${selected.color}25` }}>
                <i className={`${selected.icon} text-base`} style={{ color: selected.color }} />
              </div>
              <div>
                <h3 className="text-white font-bold">{isAr ? selected.nameAr : selected.name}</h3>
                <p className="text-gray-500 text-xs">{isAr ? "تفاصيل الامتثال الشهري" : "Monthly Compliance Details"}</p>
              </div>
            </div>
            <button type="button" onClick={() => setSelected(null)}
              className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer text-gray-500 hover:text-white"
              style={{ background: "rgba(255,255,255,0.05)" }}>
              <i className="ri-close-line text-sm" />
            </button>
          </div>
          {/* 12-month bar chart */}
          <div className="mb-4">
            <p className="text-gray-500 text-xs mb-3 font-['JetBrains_Mono'] uppercase tracking-wider">{isAr ? "اتجاه 12 شهر" : "12-Month Trend"}</p>
            <div className="flex items-end gap-2 h-20">
              {selected.trend.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm" style={{ height: `${((v - 60) / 40) * 100}%`, background: i === selected.trend.length - 1 ? selected.color : `${selected.color}50`, minHeight: "4px" }} />
                  <span className="text-gray-600 font-['JetBrains_Mono']" style={{ fontSize: "8px" }}>{MONTHS_SHORT[i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: isAr ? "إجمالي الأحداث" : "Total Events", value: selected.events.toLocaleString(), color: selected.color },
              { label: isAr ? "المرفوضة" : "Rejected", value: selected.rejected.toString(), color: "#F87171" },
              { label: isAr ? "معدل القبول" : "Acceptance Rate", value: `${(100 - (selected.rejected / selected.events) * 100).toFixed(1)}%`, color: "#4ADE80" },
            ].map((stat) => (
              <div key={stat.label} className="px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-xl font-black font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-gray-500 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityCompliance;
