import { useState, useEffect } from "react";

interface Props { isAr: boolean; dateRange: string; }

const ReportKpiCards = ({ isAr, dateRange }: Props) => {
  const [totalEvents, setTotalEvents] = useState(48291);
  const [acceptRate, setAcceptRate] = useState(94.7);
  const [avgTime, setAvgTime] = useState(1.34);
  const [uniquePersons, setUniquePersons] = useState(12847);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalEvents((v) => v + Math.floor(Math.random() * 5));
      setAcceptRate((v) => Math.min(99.9, Math.max(90, v + (Math.random() - 0.5) * 0.1)));
      setAvgTime((v) => Math.max(0.8, Math.min(3, v + (Math.random() - 0.5) * 0.05)));
      setUniquePersons((v) => v + Math.floor(Math.random() * 2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const multiplier = dateRange === "today" ? 1 : dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;

  const cards = [
    {
      label: isAr ? "إجمالي الأحداث" : "Total Events",
      value: (totalEvents * (multiplier > 1 ? multiplier * 0.8 : 1)).toFixed(0),
      trend: "+8.4%",
      trendUp: true,
      icon: "ri-calendar-check-line",
      color: "#D6B47E",
      sub: isAr ? "جميع الوحدات" : "All modules",
    },
    {
      label: isAr ? "معدل القبول" : "Acceptance Rate",
      value: `${acceptRate.toFixed(1)}%`,
      trend: "+0.3%",
      trendUp: true,
      icon: "ri-checkbox-circle-line",
      color: "#4ADE80",
      sub: isAr ? "مقبول / إجمالي" : "Accepted / Total",
    },
    {
      label: isAr ? "متوسط وقت المعالجة" : "Avg Processing Time",
      value: `${avgTime.toFixed(2)}s`,
      trend: "-0.12s",
      trendUp: true,
      icon: "ri-timer-line",
      color: "#FACC15",
      sub: isAr ? "لكل حدث" : "Per event",
    },
    {
      label: isAr ? "أشخاص فريدون" : "Unique Persons",
      value: (uniquePersons * (multiplier > 1 ? multiplier * 0.3 : 1)).toFixed(0),
      trend: "+12.1%",
      trendUp: true,
      icon: "ri-user-line",
      color: "#C98A1B",
      sub: isAr ? "هويات مميزة" : "Distinct identities",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="relative rounded-2xl border p-5 overflow-hidden"
          style={{ background: "rgba(10,37,64,0.8)", borderColor: `${c.color}25`, backdropFilter: "blur(12px)" }}>
          <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at top right, ${c.color}, transparent 70%)` }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 flex items-center justify-center rounded-xl"
                style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}>
                <i className={`${c.icon} text-base`} style={{ color: c.color }} />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono']"
                style={{ background: c.trendUp ? "rgba(74,222,128,0.1)" : "rgba(201,74,94,0.1)", color: c.trendUp ? "#4ADE80" : "#C94A5E" }}>
                <i className={`${c.trendUp ? "ri-arrow-up-line" : "ri-arrow-down-line"} text-xs`} />
                {c.trend}
              </div>
            </div>
            <div className="text-3xl font-black font-['JetBrains_Mono'] mb-1 tabular-nums" style={{ color: c.color }}>
              {Number(c.value.replace("%", "").replace("s", "")).toLocaleString()}{c.value.includes("%") ? "%" : c.value.includes("s") ? "s" : ""}
            </div>
            <div className="text-white font-semibold text-sm mb-0.5">{c.label}</div>
            <div className="text-gray-500 text-xs">{c.sub}</div>
          </div>
        </div>
      ))}

      {/* Batch vs Individual donut */}
      <div className="col-span-2 lg:col-span-4 rounded-2xl border p-5"
        style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
            <i className="ri-pie-chart-line text-gold-400 text-sm" />
          </div>
          <h3 className="text-white font-bold text-sm">{isAr ? "دُفعة مقابل فردي" : "Batch vs Individual Submission"}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-8">
          {/* Donut visual */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D6B47E" strokeWidth="3"
                strokeDasharray="62 38" strokeLinecap="round" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#4ADE80" strokeWidth="3"
                strokeDasharray="38 62" strokeDashoffset="-62" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white font-black text-sm font-['JetBrains_Mono']">62%</span>
              <span className="text-gray-500 text-xs">{isAr ? "دُفعة" : "Batch"}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            {[
              { label: isAr ? "رفع دُفعة" : "Batch Upload", pct: "62%", count: "29,940", color: "#D6B47E" },
              { label: isAr ? "إرسال فردي" : "Individual Submit", pct: "38%", count: "18,351", color: "#4ADE80" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <div>
                  <div className="text-white font-bold text-sm">{item.label}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black font-['JetBrains_Mono']" style={{ color: item.color }}>{item.pct}</span>
                    <span className="text-gray-500 text-xs">({item.count} {isAr ? "حدث" : "events"})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportKpiCards;
