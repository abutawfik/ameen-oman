import { useState, useEffect } from "react";

interface Props {
  isAr: boolean;
}

const LiveCounters = ({ isAr }: Props) => {
  const [arrivals, setArrivals] = useState(4821);
  const [departures, setDepartures] = useState(4387);
  const [visaIssued, setVisaIssued] = useState(1432);
  const [overstay, setOverstay] = useState(31);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setArrivals((v) => v + Math.floor(Math.random() * 3));
      setDepartures((v) => v + Math.floor(Math.random() * 2));
      setVisaIssued((v) => v + (Math.random() > 0.7 ? 1 : 0));
      setOverstay((v) => v + (Math.random() > 0.95 ? 1 : 0));
      setTick((t) => t + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const counters = [
    { label: isAr ? "الوصول اليوم" : "Arrivals Today", labelSub: isAr ? "دخول مسجّل" : "Registered entries", value: arrivals, icon: "ri-login-box-line", color: "#4ADE80", trend: "+12%", up: true },
    { label: isAr ? "المغادرة اليوم" : "Departures Today", labelSub: isAr ? "خروج مسجّل" : "Registered exits", value: departures, icon: "ri-logout-box-line", color: "#D6B47E", trend: "+8%", up: true },
    { label: isAr ? "تأشيرات صادرة" : "Visas Issued", labelSub: isAr ? "عبر بوابة eVisa" : "Via eVisa portal", value: visaIssued, icon: "ri-file-check-line", color: "#A78BFA", trend: "+5%", up: true },
    { label: isAr ? "تجاوز الإقامة" : "Overstay Detected", labelSub: isAr ? "يتطلب إجراء" : "Requires action", value: overstay, icon: "ri-alarm-warning-line", color: "#C94A5E", trend: "+3", up: false },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {counters.map((c) => (
        <div key={c.label} className="relative rounded-2xl border p-5 overflow-hidden" style={{ background: "rgba(10,37,64,0.8)", borderColor: `${c.color}25`, backdropFilter: "blur(12px)" }}>
          <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at top right, ${c.color}, transparent 70%)` }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}>
                <i className={`${c.icon} text-base`} style={{ color: c.color }} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono']`}
                style={{ background: c.up ? "rgba(74,222,128,0.1)" : "rgba(201,74,94,0.1)", color: c.up ? "#4ADE80" : "#C94A5E" }}>
                <i className={c.up ? "ri-arrow-up-line text-xs" : "ri-arrow-up-line text-xs"} />
                {c.trend}
              </div>
            </div>
            <div className="text-4xl font-black font-['JetBrains_Mono'] mb-1 tabular-nums" style={{ color: c.color }}>
              {c.value.toLocaleString()}
            </div>
            <div className="text-white font-semibold text-sm mb-0.5">{c.label}</div>
            <div className="text-gray-500 text-xs">{c.labelSub}</div>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c.color }} />
              <span className="text-xs font-['JetBrains_Mono']" style={{ color: c.color }}>{isAr ? "تحديث مباشر" : "LIVE"}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveCounters;
