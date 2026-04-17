import { useState } from "react";

interface Props { isAr: boolean; }

interface TripEvent {
  id: string;
  type: "bus" | "taxi" | "ride-hail";
  time: string;
  from: string;
  fromAr: string;
  to: string;
  toAr: string;
  route?: string;
  fare: number;
  payment?: string;
  flag?: string;
  flagAr?: string;
  flagColor?: string;
  x1: number; y1: number;
  x2: number; y2: number;
}

interface PersonProfile {
  id: string;
  name: string;
  nameAr: string;
  nationality: string;
  flag: string;
  docNumber: string;
  visaType: string;
  visaTypeAr: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  trips: TripEvent[];
}

const PERSONS: PersonProfile[] = [
  {
    id: "P-001", name: "Reza Tehrani", nameAr: "رضا طهراني", nationality: "Iran", flag: "🇮🇷",
    docNumber: "IR-3312-F", visaType: "Tourist", visaTypeAr: "سياحي", riskLevel: "critical",
    trips: [
      { id: "T1", type: "bus", time: "07:14", from: "Central Bus Station", fromAr: "المحطة المركزية", to: "Industrial Zone", toAr: "المنطقة الصناعية", route: "Route 14", fare: 0.2, flag: "Tourist visiting industrial zone", flagAr: "سائح يزور منطقة صناعية", flagColor: "#C94A5E", x1: 60, y1: 38, x2: 58, y2: 44 },
      { id: "T2", type: "bus", time: "12:30", from: "Industrial Zone", fromAr: "المنطقة الصناعية", to: "Central Bus Station", toAr: "المحطة المركزية", route: "Route 14", fare: 0.2, x1: 58, y1: 44, x2: 60, y2: 38 },
      { id: "T3", type: "taxi", time: "14:15", from: "Central Station", fromAr: "المحطة المركزية", to: "North District", toAr: "الحي الشمالي", fare: 3.5, payment: "Cash", x1: 60, y1: 38, x2: 52, y2: 32 },
      { id: "T4", type: "bus", time: "07:08", from: "Central Bus Station", fromAr: "المحطة المركزية", to: "Industrial Zone", toAr: "المنطقة الصناعية", route: "Route 14", fare: 0.2, flag: "5th consecutive day same route", flagAr: "اليوم الخامس على التوالي نفس المسار", flagColor: "#C98A1B", x1: 60, y1: 38, x2: 58, y2: 44 },
      { id: "T5", type: "ride-hail", time: "23:45", from: "East District", fromAr: "الحي الشرقي", to: "Unknown Drop", toAr: "وجهة غير معروفة", fare: 6.2, flag: "Late-night movement, no registered address", flagAr: "تنقل ليلي متأخر، لا عنوان مسجّل", flagColor: "#C94A5E", x1: 46, y1: 28, x2: 55, y2: 36 },
    ],
  },
  {
    id: "P-002", name: "Priya Nair", nameAr: "بريا ناير", nationality: "India", flag: "🇮🇳",
    docNumber: "IN-7734-K", visaType: "Work", visaTypeAr: "عمل", riskLevel: "low",
    trips: [
      { id: "T1", type: "bus", time: "07:30", from: "North District", fromAr: "الحي الشمالي", to: "West District", toAr: "الحي الغربي", route: "Route 2", fare: 0.2, x1: 52, y1: 32, x2: 55, y2: 34 },
      { id: "T2", type: "bus", time: "17:00", from: "West District", fromAr: "الحي الغربي", to: "North District", toAr: "الحي الشمالي", route: "Route 2", fare: 0.2, x1: 55, y1: 34, x2: 52, y2: 32 },
      { id: "T3", type: "taxi", time: "12:30", from: "West District", fromAr: "الحي الغربي", to: "Central Station", toAr: "المحطة المركزية", fare: 2.8, payment: "Card", x1: 55, y1: 34, x2: 60, y2: 38 },
    ],
  },
  {
    id: "P-003", name: "Mohammed Al-Rashidi", nameAr: "محمد الراشدي", nationality: "Yemen", flag: "🇾🇪",
    docNumber: "YE-4821-X", visaType: "Visit", visaTypeAr: "زيارة", riskLevel: "high",
    trips: [
      { id: "T1", type: "taxi", time: "09:00", from: "Capital Airport", fromAr: "مطار العاصمة", to: "Central Station", toAr: "المحطة المركزية", fare: 8.5, payment: "Cash", x1: 63, y1: 30, x2: 60, y2: 38 },
      { id: "T2", type: "ride-hail", time: "11:20", from: "Central Station", fromAr: "المحطة المركزية", to: "East District", toAr: "الحي الشرقي", fare: 5.0, x1: 60, y1: 38, x2: 46, y2: 28 },
      { id: "T3", type: "ride-hail", time: "22:10", from: "East District", fromAr: "الحي الشرقي", to: "Coastal Town", toAr: "البلدة الساحلية", fare: 9.5, flag: "Late-night long-distance, no hotel registered", flagAr: "رحلة ليلية طويلة، لا فندق مسجّل", flagColor: "#C98A1B", x1: 46, y1: 28, x2: 50, y2: 24 },
    ],
  },
];

const typeIcon = (t: TripEvent["type"]) => t === "bus" ? "ri-bus-line" : t === "taxi" ? "ri-taxi-line" : "ri-car-line";
const typeColor = (t: TripEvent["type"]) => t === "bus" ? "#D6B47E" : t === "taxi" ? "#4ADE80" : "#A78BFA";
const typeLabel = (t: TripEvent["type"], isAr: boolean) => {
  if (t === "bus") return isAr ? "حافلة" : "Bus";
  if (t === "taxi") return isAr ? "تاكسي" : "Taxi";
  return isAr ? "توصيل" : "Ride-Hail";
};
const riskColor = (r: PersonProfile["riskLevel"]) => {
  if (r === "low") return "#4ADE80";
  if (r === "medium") return "#FACC15";
  if (r === "high") return "#C98A1B";
  return "#C94A5E";
};

const PersonMovementViewer = ({ isAr }: Props) => {
  const [selectedPerson, setSelectedPerson] = useState<PersonProfile>(PERSONS[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = PERSONS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.docNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.15)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: "rgba(184,138,60,0.1)" }}>
        <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
          <i className="ri-user-location-line text-gold-400 text-sm" />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm">{isAr ? "نمط تنقل الشخص" : "Person Movement Pattern"}</h3>
          <p className="text-gray-500 text-xs">{isAr ? "جميع أحداث النقل مرتبطة بالشخص" : "All transport events linked to person"}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Person selector */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r flex-shrink-0" style={{ borderColor: "rgba(184,138,60,0.1)" }}>
          <div className="p-3 border-b" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
              <input
                type="text"
                placeholder={isAr ? "بحث..." : "Search person..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg text-xs text-white placeholder-gray-600 outline-none"
                style={{ background: "#0F1923", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={(e) => { e.target.style.borderColor = "#D6B47E"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
              />
            </div>
          </div>
          <div className="divide-y overflow-y-auto" style={{ borderColor: "rgba(184,138,60,0.06)", maxHeight: "340px" }}>
            {filtered.map((person) => {
              const color = riskColor(person.riskLevel);
              const isActive = selectedPerson.id === person.id;
              return (
                <button key={person.id} type="button" onClick={() => setSelectedPerson(person)}
                  className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors text-left"
                  style={{ background: isActive ? `${color}08` : "transparent", borderLeft: isActive ? `3px solid ${color}` : "3px solid transparent" }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                  <span className="text-xl flex-shrink-0">{person.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-semibold truncate">{isAr ? person.nameAr : person.name}</div>
                    <div className="text-gray-500 text-xs font-['JetBrains_Mono']">{person.docNumber}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: `${color}15`, color, fontSize: "9px" }}>
                      {person.riskLevel.toUpperCase()}
                    </span>
                    <span className="text-gray-600 text-xs">{person.trips.length} {isAr ? "رحلة" : "trips"}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Movement detail */}
        <div className="flex-1 p-5">
          {/* Person header */}
          <div className="flex items-center gap-4 mb-5 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <span className="text-3xl">{selectedPerson.flag}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-bold text-base">{isAr ? selectedPerson.nameAr : selectedPerson.name}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: `${riskColor(selectedPerson.riskLevel)}15`, color: riskColor(selectedPerson.riskLevel), border: `1px solid ${riskColor(selectedPerson.riskLevel)}30` }}>
                  {selectedPerson.riskLevel.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                <span className="text-gray-400 text-xs font-['JetBrains_Mono']">{selectedPerson.docNumber}</span>
                <span className="text-gray-600 text-xs">·</span>
                <span className="text-gray-400 text-xs">{isAr ? selectedPerson.visaTypeAr : selectedPerson.visaType} {isAr ? "تأشيرة" : "Visa"}</span>
                <span className="text-gray-600 text-xs">·</span>
                <span className="text-gray-400 text-xs">{selectedPerson.trips.length} {isAr ? "رحلة مسجّلة" : "recorded trips"}</span>
              </div>
            </div>
          </div>

          {/* Map path visualization */}
          <div className="relative rounded-xl mb-5 overflow-hidden" style={{ height: "160px", background: "rgba(5,20,40,0.8)", border: "1px solid rgba(184,138,60,0.1)" }}>
            <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(184,138,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.03) 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
            <svg className="absolute inset-0 w-full h-full">
              {selectedPerson.trips.map((trip, i) => {
                const color = trip.flagColor || typeColor(trip.type);
                return (
                  <g key={trip.id}>
                    <line x1={`${trip.x1}%`} y1={`${trip.y1}%`} x2={`${trip.x2}%`} y2={`${trip.y2}%`}
                      stroke={color} strokeWidth="2" strokeOpacity="0.7"
                      strokeDasharray={trip.flag ? "5 3" : "none"} />
                    <circle cx={`${trip.x1}%`} cy={`${trip.y1}%`} r="4" fill={color} fillOpacity="0.8" />
                    {i === selectedPerson.trips.length - 1 && (
                      <circle cx={`${trip.x2}%`} cy={`${trip.y2}%`} r="4" fill={color} fillOpacity="0.8" />
                    )}
                    <text x={`${(trip.x1 + trip.x2) / 2}%`} y={`${(trip.y1 + trip.y2) / 2 - 2}%`}
                      fill={color} fontSize="8" textAnchor="middle" opacity="0.8">{trip.time}</text>
                  </g>
                );
              })}
            </svg>
            <div className="absolute bottom-2 right-2 text-gray-600 text-xs font-['JetBrains_Mono']" style={{ fontSize: "9px" }}>OMAN</div>
          </div>

          {/* Trip timeline */}
          <div className="space-y-2">
            {selectedPerson.trips.map((trip) => {
              const color = typeColor(trip.type);
              return (
                <div key={trip.id} className="flex items-start gap-3 px-4 py-3 rounded-xl transition-colors"
                  style={{ background: trip.flag ? `${trip.flagColor}08` : "rgba(255,255,255,0.03)", border: `1px solid ${trip.flag ? `${trip.flagColor}25` : "rgba(255,255,255,0.06)"}` }}>
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <i className={`${typeIcon(trip.type)} text-xs`} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-white text-xs font-semibold">{isAr ? trip.fromAr : trip.from}</span>
                      <i className="ri-arrow-right-line text-gray-600 text-xs" />
                      <span className="text-white text-xs font-semibold">{isAr ? trip.toAr : trip.to}</span>
                      <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: `${color}12`, color, fontSize: "9px" }}>{typeLabel(trip.type, isAr)}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{trip.time}</span>
                      {trip.route && <span className="text-gray-500 text-xs">{trip.route}</span>}
                      <span className="text-gold-400 text-xs font-['JetBrains_Mono']">{trip.fare.toFixed(3)} LCY</span>
                      {trip.payment && <span className="text-gray-500 text-xs">{trip.payment}</span>}
                    </div>
                    {trip.flag && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <i className="ri-alarm-warning-line text-xs flex-shrink-0" style={{ color: trip.flagColor }} />
                        <span className="text-xs font-semibold" style={{ color: trip.flagColor }}>{isAr ? trip.flagAr : trip.flag}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-gray-600 text-xs font-['JetBrains_Mono'] flex-shrink-0">{trip.id}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonMovementViewer;
