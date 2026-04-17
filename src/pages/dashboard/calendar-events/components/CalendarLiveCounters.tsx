import { useState, useEffect } from "react";

interface Props { isAr: boolean; }

const CalendarLiveCounters = ({ isAr }: Props) => {
  const [totalToday, setTotalToday] = useState(1284);
  const [pending, setPending] = useState(47);
  const [failed, setFailed] = useState(12);
  const [upcoming, setUpcoming] = useState(389);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalToday((v) => v + Math.floor(Math.random() * 3));
      setPending((v) => Math.max(0, v + (Math.random() > 0.6 ? 1 : -1)));
      setFailed((v) => v + (Math.random() > 0.95 ? 1 : 0));
      setUpcoming((v) => v + Math.floor(Math.random() * 2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: isAr ? "أحداث اليوم" : "Events Today",
      sub: isAr ? "جميع الوحدات" : "All modules",
      value: totalToday,
      icon: "ri-calendar-check-line",
      color: "#D4A84B",
      trend: "+8%",
      trendUp: true,
    },
    {
      label: isAr ? "قيد الانتظار" : "Pending Review",
      sub: isAr ? "تحتاج إجراء" : "Needs action",
      value: pending,
      icon: "ri-time-line",
      color: "#FACC15",
      trend: `${pending > 47 ? "+" : ""}${pending - 47}`,
      trendUp: pending >= 47,
    },
    {
      label: isAr ? "أحداث فاشلة" : "Failed Events",
      sub: isAr ? "إعادة الإرسال متاحة" : "Re-submit available",
      value: failed,
      icon: "ri-close-circle-line",
      color: "#F87171",
      trend: "+2",
      trendUp: false,
    },
    {
      label: isAr ? "أحداث قادمة" : "Upcoming Events",
      sub: isAr ? "الأسبوع القادم" : "Next 7 days",
      value: upcoming,
      icon: "ri-calendar-2-line",
      color: "#4ADE80",
      trend: "+12%",
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="relative rounded-2xl border p-5 overflow-hidden"
          style={{ background: "rgba(20,29,46,0.8)", borderColor: `${s.color}25`, backdropFilter: "blur(12px)" }}>
          {/* Glow bg */}
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ background: `radial-gradient(circle at top right, ${s.color}, transparent 70%)` }} />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 flex items-center justify-center rounded-xl"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                <i className={`${s.icon} text-base`} style={{ color: s.color }} />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono']"
                style={{
                  background: s.trendUp ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                  color: s.trendUp ? "#4ADE80" : "#F87171",
                }}>
                <i className={`${s.trendUp ? "ri-arrow-up-line" : "ri-arrow-down-line"} text-xs`} />
                {s.trend}
              </div>
            </div>

            <div className="text-4xl font-black font-['JetBrains_Mono'] mb-1 tabular-nums" style={{ color: s.color }}>
              {s.value.toLocaleString()}
            </div>
            <div className="text-white font-semibold text-sm mb-0.5">{s.label}</div>
            <div className="text-gray-500 text-xs">{s.sub}</div>

            <div className="mt-3 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.color }} />
              <span className="text-xs font-['JetBrains_Mono']" style={{ color: s.color }}>LIVE</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarLiveCounters;
