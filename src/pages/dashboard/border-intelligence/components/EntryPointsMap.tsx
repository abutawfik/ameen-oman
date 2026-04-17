import { useState } from "react";

interface Props {
  isAr: boolean;
}

interface BorderPoint {
  id: string;
  name: string;
  nameAr: string;
  type: "air" | "sea" | "land";
  x: number;
  y: number;
  arrivals: number;
  departures: number;
  status: "active" | "busy" | "quiet";
}

const BORDER_POINTS: BorderPoint[] = [
  { id: "mct", name: "Capital Int'l Airport", nameAr: "مطار العاصمة الدولي", type: "air", x: 62, y: 32, arrivals: 2841, departures: 2654, status: "busy" },
  { id: "slh", name: "Southern Airport", nameAr: "مطار الجنوب", type: "air", x: 38, y: 82, arrivals: 412, departures: 387, status: "active" },
  { id: "soh", name: "Northern Port", nameAr: "ميناء الشمال", type: "sea", x: 55, y: 18, arrivals: 189, departures: 201, status: "active" },
  { id: "msc", name: "Capital Port", nameAr: "ميناء العاصمة", type: "sea", x: 65, y: 35, arrivals: 94, departures: 87, status: "active" },
  { id: "htt", name: "Eastern Crossing", nameAr: "معبر الشرق", type: "land", x: 72, y: 22, arrivals: 621, departures: 589, status: "busy" },
  { id: "bur", name: "Western Crossing", nameAr: "معبر الغرب", type: "land", x: 48, y: 14, arrivals: 387, departures: 312, status: "active" },
  { id: "mzn", name: "Southern Crossing", nameAr: "معبر الجنوب", type: "land", x: 42, y: 78, arrivals: 156, departures: 143, status: "quiet" },
  { id: "khs", name: "Northern Airport", nameAr: "مطار الشمال", type: "air", x: 68, y: 8, arrivals: 98, departures: 91, status: "quiet" },
];

const typeIcon = (type: BorderPoint["type"]) => {
  if (type === "air") return "ri-flight-takeoff-line";
  if (type === "sea") return "ri-ship-line";
  return "ri-road-map-line";
};

const typeColor = (type: BorderPoint["type"]) => {
  if (type === "air") return "#D4A84B";
  if (type === "sea") return "#4ADE80";
  return "#FB923C";
};

const statusColor = (status: BorderPoint["status"]) => {
  if (status === "busy") return "#FACC15";
  if (status === "active") return "#4ADE80";
  return "#9CA3AF";
};

const EntryPointsMap = ({ isAr }: Props) => {
  const [selected, setSelected] = useState<BorderPoint | null>(null);

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.15)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(181,142,60,0.1)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
            <i className="ri-map-pin-2-line text-gold-400 text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{isAr ? "خريطة نقاط الحدود" : "Entry Points Map"}</h3>
            <p className="text-gray-500 text-xs">{isAr ? "الشبكة الحدودية الوطنية — جميع المنافذ" : "National Border Network — All crossings"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {[
            { type: "air", label: isAr ? "جوي" : "Air", color: "#D4A84B" },
            { type: "sea", label: isAr ? "بحري" : "Sea", color: "#4ADE80" },
            { type: "land", label: isAr ? "بري" : "Land", color: "#FB923C" },
          ].map((leg) => (
            <div key={leg.type} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: leg.color }} />
              <span className="text-gray-400 text-xs">{leg.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Map area */}
        <div className="relative flex-1 min-h-[340px]" style={{ background: "rgba(11,18,32,0.6)" }}>
          {/* Oman silhouette (stylized grid background) */}
          <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(181,142,60,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.04) 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />
          {/* Oman shape hint */}
          <div className="absolute inset-4 rounded-2xl opacity-10" style={{ background: "linear-gradient(135deg, rgba(181,142,60,0.3) 0%, transparent 60%)", border: "1px solid rgba(181,142,60,0.2)" }} />
          <div className="absolute top-4 left-4 text-gray-600 text-xs font-['JetBrains_Mono'] opacity-60">OMAN</div>

          {/* Border points */}
          {BORDER_POINTS.map((point) => {
            const color = typeColor(point.type);
            const isSelected = selected?.id === point.id;
            return (
              <button
                key={point.id}
                type="button"
                onClick={() => setSelected(isSelected ? null : point)}
                className="absolute cursor-pointer group"
                style={{ left: `${point.x}%`, top: `${point.y}%`, transform: "translate(-50%, -50%)" }}
              >
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: color, transform: "scale(2)" }} />
                {/* Dot */}
                <div className="relative w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                  style={{ background: isSelected ? color : `${color}30`, borderColor: color, boxShadow: isSelected ? `0 0 12px ${color}80` : "none", transform: isSelected ? "scale(1.4)" : "scale(1)" }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                </div>
                {/* Count badge */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono'] whitespace-nowrap"
                  style={{ background: `${color}20`, color, border: `1px solid ${color}40`, fontSize: "9px" }}>
                  {(point.arrivals + point.departures).toLocaleString()}
                </div>
              </button>
            );
          })}
        </div>

        {/* Side panel */}
        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l overflow-y-auto" style={{ borderColor: "rgba(181,142,60,0.1)", maxHeight: "340px" }}>
          {selected ? (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: `${typeColor(selected.type)}15`, border: `1px solid ${typeColor(selected.type)}30` }}>
                  <i className={`${typeIcon(selected.type)} text-sm`} style={{ color: typeColor(selected.type) }} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{isAr ? selected.nameAr : selected.name}</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor(selected.status) }} />
                    <span className="text-xs capitalize" style={{ color: statusColor(selected.status) }}>{selected.status}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: isAr ? "الوصول" : "Arrivals", value: selected.arrivals, color: "#4ADE80" },
                  { label: isAr ? "المغادرة" : "Departures", value: selected.departures, color: "#D4A84B" },
                  { label: isAr ? "الإجمالي" : "Total", value: selected.arrivals + selected.departures, color: "#FACC15" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-gray-400 text-xs">{stat.label}</span>
                    <span className="font-bold text-sm font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "rgba(181,142,60,0.06)" }}>
              {BORDER_POINTS.sort((a, b) => (b.arrivals + b.departures) - (a.arrivals + a.departures)).map((point) => (
                <button key={point.id} type="button" onClick={() => setSelected(point)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer text-left">
                  <div className="w-6 h-6 flex items-center justify-center rounded flex-shrink-0" style={{ background: `${typeColor(point.type)}12` }}>
                    <i className={`${typeIcon(point.type)} text-xs`} style={{ color: typeColor(point.type) }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-semibold truncate">{isAr ? point.nameAr : point.name}</div>
                  </div>
                  <div className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: typeColor(point.type) }}>
                    {(point.arrivals + point.departures).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryPointsMap;
