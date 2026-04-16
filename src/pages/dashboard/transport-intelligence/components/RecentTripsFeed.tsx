import { useState, useEffect } from "react";

interface Props { isAr: boolean; }

interface TripRecord {
  id: string;
  type: "bus" | "taxi" | "ride-hail";
  time: string;
  from: string;
  fromAr: string;
  to: string;
  toAr: string;
  fare: number;
  personRef: string;
  matchMethod: "transit-card" | "phone" | "payment-card" | "anonymous";
  flagged: boolean;
  provider: string;
}

const INITIAL_TRIPS: TripRecord[] = [
  { id: "AMN-TRN-20260405-4821", type: "bus", time: "14:32:07", from: "Central Bus Station", fromAr: "المحطة المركزية", to: "Industrial Zone", toAr: "المنطقة الصناعية", fare: 0.2, personRef: "P-3312-F", matchMethod: "transit-card", flagged: true, provider: "National Bus Co." },
  { id: "AMN-TRN-20260405-4820", type: "taxi", time: "14:31:44", from: "Capital Airport", fromAr: "مطار العاصمة", to: "North District", toAr: "الحي الشمالي", fare: 8.5, personRef: "P-7734-K", matchMethod: "payment-card", flagged: false, provider: "Taxi Co. A" },
  { id: "AMN-TRN-20260405-4819", type: "ride-hail", time: "14:30:12", from: "West District", fromAr: "الحي الغربي", to: "Central Station", toAr: "المحطة المركزية", fare: 3.2, personRef: "P-8821-K", matchMethod: "phone", flagged: false, provider: "Ride-Hail App A" },
  { id: "AMN-TRN-20260405-4818", type: "bus", time: "14:29:55", from: "East District", fromAr: "الحي الشرقي", to: "Coastal Town", toAr: "البلدة الساحلية", fare: 0.3, personRef: "P-4412-M", matchMethod: "transit-card", flagged: false, provider: "National Bus Co." },
  { id: "AMN-TRN-20260405-4817", type: "ride-hail", time: "14:28:30", from: "North District", fromAr: "الحي الشمالي", to: "Industrial Zone", toAr: "المنطقة الصناعية", fare: 4.1, personRef: "P-1122-M", matchMethod: "phone", flagged: true, provider: "Ride-Hail App B" },
  { id: "AMN-TRN-20260405-4816", type: "taxi", time: "14:27:18", from: "Central City", fromAr: "المدينة المركزية", to: "Capital Region", toAr: "منطقة العاصمة", fare: 22.0, personRef: "P-4821-X", matchMethod: "payment-card", flagged: true, provider: "Taxi Co. B" },
  { id: "AMN-TRN-20260405-4815", type: "bus", time: "14:26:44", from: "Northern City", fromAr: "المدينة الشمالية", to: "Coastal Town", toAr: "البلدة الساحلية", fare: 0.5, personRef: "P-3312-R", matchMethod: "transit-card", flagged: false, provider: "National Bus Co." },
  { id: "AMN-TRN-20260405-4814", type: "ride-hail", time: "14:25:10", from: "Southern Airport", fromAr: "المطار الجنوبي", to: "Southern City", toAr: "المدينة الجنوبية", fare: 5.5, personRef: "ANON", matchMethod: "anonymous", flagged: false, provider: "Ride-Hail App A" },
];

const typeIcon = (t: TripRecord["type"]) => t === "bus" ? "ri-bus-line" : t === "taxi" ? "ri-taxi-line" : "ri-car-line";
const typeColor = (t: TripRecord["type"]) => t === "bus" ? "#22D3EE" : t === "taxi" ? "#4ADE80" : "#A78BFA";
const matchIcon = (m: TripRecord["matchMethod"]) => {
  if (m === "transit-card") return "ri-bank-card-line";
  if (m === "phone") return "ri-smartphone-line";
  if (m === "payment-card") return "ri-secure-payment-line";
  return "ri-user-unfollow-line";
};
const matchColor = (m: TripRecord["matchMethod"]) => {
  if (m === "anonymous") return "#9CA3AF";
  return "#4ADE80";
};

const RecentTripsFeed = ({ isAr }: Props) => {
  const [trips, setTrips] = useState<TripRecord[]>(INITIAL_TRIPS);
  const [filter, setFilter] = useState<"all" | "bus" | "taxi" | "ride-hail" | "flagged">("all");

  useEffect(() => {
    const interval = setInterval(() => {
      const types: TripRecord["type"][] = ["bus", "taxi", "ride-hail"];
      const methods: TripRecord["matchMethod"][] = ["transit-card", "phone", "payment-card", "anonymous"];
      const providers = ["National Bus Co.", "Taxi Co. A", "Taxi Co. B", "Ride-Hail App A", "Ride-Hail App B"];
      const newTrip: TripRecord = {
        id: `AMN-TRN-20260405-${Math.floor(Math.random() * 9000) + 1000}`,
        type: types[Math.floor(Math.random() * types.length)],
        time: new Date().toLocaleTimeString("en-GB"),
        from: "Al Khuwair", fromAr: "الخوير",
        to: "Ruwi", toAr: "روي",
        fare: parseFloat((Math.random() * 10 + 0.2).toFixed(3)),
        personRef: Math.random() > 0.3 ? "OM-XXXX-X" : "ANON",
        matchMethod: methods[Math.floor(Math.random() * methods.length)],
        flagged: Math.random() > 0.85,
        provider: providers[Math.floor(Math.random() * providers.length)],
      };
      setTrips((prev) => [newTrip, ...prev.slice(0, 19)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = trips.filter((t) => {
    if (filter === "flagged") return t.flagged;
    if (filter === "all") return true;
    return t.type === filter;
  });

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.15)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center justify-between px-6 py-4 border-b flex-wrap gap-3" style={{ borderColor: "rgba(34,211,238,0.1)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
            <i className="ri-pulse-line text-cyan-400 text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{isAr ? "تغذية الرحلات المباشرة" : "Live Trip Feed"}</h3>
            <p className="text-gray-500 text-xs">{isAr ? "جميع مزودي النقل — تحديث كل 5 ثوانٍ" : "All transport providers — updates every 5s"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "bus", "taxi", "ride-hail", "flagged"] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
              style={{
                background: filter === f ? (f === "flagged" ? "rgba(248,113,113,0.15)" : "rgba(34,211,238,0.15)") : "rgba(255,255,255,0.04)",
                border: `1px solid ${filter === f ? (f === "flagged" ? "rgba(248,113,113,0.4)" : "rgba(34,211,238,0.4)") : "rgba(255,255,255,0.08)"}`,
                color: filter === f ? (f === "flagged" ? "#F87171" : "#22D3EE") : "#6B7280",
              }}>
              {f === "all" ? (isAr ? "الكل" : "All") : f === "bus" ? (isAr ? "حافلة" : "Bus") : f === "taxi" ? (isAr ? "تاكسي" : "Taxi") : f === "ride-hail" ? (isAr ? "توصيل" : "Ride-Hail") : (isAr ? "مُبلَّغ" : "Flagged")}
            </button>
          ))}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-['JetBrains_Mono']">LIVE</span>
          </div>
        </div>
      </div>

      <div className="divide-y overflow-y-auto" style={{ borderColor: "rgba(34,211,238,0.06)", maxHeight: "420px" }}>
        {filtered.map((trip) => {
          const color = typeColor(trip.type);
          return (
            <div key={trip.id} className="flex items-center gap-4 px-6 py-3 hover:bg-white/[0.02] transition-colors"
              style={{ borderLeft: trip.flagged ? "3px solid #F87171" : "3px solid transparent" }}>
              <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                <i className={`${typeIcon(trip.type)} text-sm`} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-white text-xs font-semibold">{isAr ? trip.fromAr : trip.from}</span>
                  <i className="ri-arrow-right-line text-gray-600 text-xs" />
                  <span className="text-white text-xs font-semibold">{isAr ? trip.toAr : trip.to}</span>
                  {trip.flagged && <i className="ri-alarm-warning-line text-red-400 text-xs" />}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-500 text-xs">{trip.provider}</span>
                  <span className="text-gray-600 text-xs">·</span>
                  <div className="flex items-center gap-1">
                    <i className={`${matchIcon(trip.matchMethod)} text-xs`} style={{ color: matchColor(trip.matchMethod) }} />
                    <span className="text-xs font-['JetBrains_Mono']" style={{ color: matchColor(trip.matchMethod), fontSize: "9px" }}>
                      {trip.personRef === "ANON" ? (isAr ? "مجهول" : "ANON") : trip.personRef}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-cyan-400 text-xs font-bold font-['JetBrains_Mono']">{trip.fare.toFixed(3)} LCY</div>
                <div className="text-gray-600 text-xs font-['JetBrains_Mono']">{trip.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTripsFeed;
