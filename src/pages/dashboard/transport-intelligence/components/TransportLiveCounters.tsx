import { useState, useEffect } from "react";

interface Props { isAr: boolean; }

const TransportLiveCounters = ({ isAr }: Props) => {
  const [busTrips, setBusTrips] = useState(14821);
  const [taxiTrips, setTaxiTrips] = useState(3247);
  const [rideHail, setRideHail] = useState(8934);
  const [flagged, setFlagged] = useState(23);

  useEffect(() => {
    const interval = setInterval(() => {
      setBusTrips((v) => v + Math.floor(Math.random() * 4));
      setTaxiTrips((v) => v + Math.floor(Math.random() * 2));
      setRideHail((v) => v + Math.floor(Math.random() * 3));
      setFlagged((v) => v + (Math.random() > 0.97 ? 1 : 0));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: isAr ? "رحلات الحافلات اليوم" : "Bus Journeys Today", sub: isAr ? "شركة الحافلات الوطنية" : "National Bus Co.", value: busTrips, icon: "ri-bus-line", color: "#D4A84B", trend: "+6%" },
    { label: isAr ? "رحلات التاكسي" : "Taxi Trips Today", sub: isAr ? "شركات التاكسي المرخّصة" : "Licensed taxi operators", value: taxiTrips, icon: "ri-taxi-line", color: "#4ADE80", trend: "+3%" },
    { label: isAr ? "رحلات التوصيل" : "Ride-Hail Trips", sub: isAr ? "تطبيقات الشراكة" : "Partner ride-hail apps", value: rideHail, icon: "ri-car-line", color: "#A78BFA", trend: "+11%" },
    { label: isAr ? "أنماط مُبلَّغة" : "Flagged Patterns", sub: isAr ? "يتطلب مراجعة" : "Requires review", value: flagged, icon: "ri-alarm-warning-line", color: "#F87171", trend: "+2" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="relative rounded-2xl border p-5 overflow-hidden"
          style={{ background: "rgba(20,29,46,0.8)", borderColor: `${s.color}25`, backdropFilter: "blur(12px)" }}>
          <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at top right, ${s.color}, transparent 70%)` }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                <i className={`${s.icon} text-base`} style={{ color: s.color }} />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono']"
                style={{ background: "rgba(74,222,128,0.1)", color: "#4ADE80" }}>
                <i className="ri-arrow-up-line text-xs" />{s.trend}
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

export default TransportLiveCounters;
