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
  if (type === "air") return "#C5A365";
  if (type === "sea") return "#4ADE80";
  return "#C98A1B";
};

const statusColor = (status: BorderPoint["status"]) => {
  if (status === "busy") return "#FACC15";
  if (status === "active") return "#4ADE80";
  return "#9CA3AF";
};

const EntryPointsMap = ({ isAr }: Props) => {
  const [selected, setSelected] = useState<BorderPoint | null>(null);

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.15)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(184,138,60,0.1)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
            <i className="ri-map-pin-2-line text-gold-400 text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{isAr ? "خريطة نقاط الحدود" : "Entry Points Map"}</h3>
            <p className="text-gray-500 text-xs">{isAr ? "الشبكة الحدودية الوطنية — جميع المنافذ" : "National Border Network — All crossings"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {[
            { type: "air", label: isAr ? "جوي" : "Air", color: "#C5A365" },
            { type: "sea", label: isAr ? "بحري" : "Sea", color: "#4ADE80" },
            { type: "land", label: isAr ? "بري" : "Land", color: "#C98A1B" },
          ].map((leg) => (
            <div key={leg.type} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: leg.color }} />
              <span className="text-gray-400 text-xs">{leg.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Map area — satellite-style: dark terrain tones + distinct pin markers per crossing type */}
        <div className="relative flex-1 min-h-[340px]"
          style={{
            background: "linear-gradient(160deg, #071828 0%, #0a2035 40%, #061520 100%)",
          }}
        >
          {/* Terrain texture layer */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `
              radial-gradient(ellipse 60% 80% at 55% 45%, rgba(184,138,60,0.06) 0%, transparent 70%),
              linear-gradient(rgba(30,60,90,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(30,60,90,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "100% 100%, 40px 40px, 40px 40px",
          }} />
          {/* Coastline SVG hint — schematic Oman outline */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline
              points="58,8 62,14 66,22 68,30 72,38 71,42 68,50 72,56 80,50 82,42 80,35 75,28 70,22 65,14 60,8"
              fill="none" stroke="#C5A365" strokeWidth="0.8"
            />
            <polyline
              points="62,14 60,22 58,30 55,38 52,46 48,54 44,64 40,76 36,82 34,86"
              fill="none" stroke="#C5A365" strokeWidth="0.8"
            />
          </svg>
          <div className="absolute top-3 left-3 text-gray-600 text-[10px] font-['JetBrains_Mono'] tracking-widest opacity-50">OM — BORDER NETWORK</div>

          {/* Flight path lines between airports (faint dashed arcs) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            {BORDER_POINTS.filter((p) => p.type === "air").flatMap((a, ai, arr) =>
              arr.slice(ai + 1).map((b) => (
                <line
                  key={`${a.id}-${b.id}`}
                  x1={`${a.x}%`} y1={`${a.y}%`}
                  x2={`${b.x}%`} y2={`${b.y}%`}
                  stroke="#C5A365" strokeWidth="0.5" strokeDasharray="3 5" opacity="0.2"
                />
              ))
            )}
          </svg>

          {/* Border points — type-specific marker shapes */}
          {BORDER_POINTS.map((point) => {
            const color = typeColor(point.type);
            const isSelected = selected?.id === point.id;
            const isBusy = point.status === "busy";
            return (
              <button
                key={point.id}
                type="button"
                onClick={() => setSelected(isSelected ? null : point)}
                className="absolute cursor-pointer group"
                style={{ left: `${point.x}%`, top: `${point.y}%`, transform: "translate(-50%, -100%)" }}
                title={point.name}
              >
                {/* Busy pulse halo */}
                {isBusy && (
                  <div
                    className="absolute rounded-full animate-ping"
                    style={{
                      width: 28, height: 28,
                      top: "50%", left: "50%",
                      transform: "translate(-50%, -50%)",
                      background: `${color}20`,
                      border: `1px solid ${color}40`,
                    }}
                  />
                )}
                {/* Pin head — shape varies by type */}
                <div
                  className="relative flex items-center justify-center transition-all duration-200"
                  style={{
                    width: isSelected ? 32 : 26,
                    height: isSelected ? 32 : 26,
                    borderRadius: point.type === "land" ? "4px" : point.type === "sea" ? "0% 50% 50% 50%" : "50%",
                    background: isSelected ? color : `${color}22`,
                    border: `2px solid ${color}`,
                    boxShadow: isSelected ? `0 0 16px ${color}60, 0 4px 12px rgba(0,0,0,0.4)` : `0 2px 6px rgba(0,0,0,0.4)`,
                    transform: point.type === "sea" && !isSelected ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  <i
                    className={`${typeIcon(point.type)} text-[11px]`}
                    style={{
                      color: isSelected ? "#fff" : color,
                      transform: point.type === "sea" ? "rotate(-45deg)" : "none",
                    }}
                  />
                </div>
                {/* Pin stem */}
                <div className="mx-auto" style={{ width: 2, height: 6, background: color, opacity: 0.6 }} />
                {/* Name label (on select or hover) */}
                <div
                  className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded whitespace-nowrap text-white pointer-events-none transition-opacity"
                  style={{
                    background: "rgba(5,15,30,0.92)",
                    border: `1px solid ${color}40`,
                    fontSize: "9px",
                    fontFamily: "'JetBrains Mono', monospace",
                    opacity: isSelected ? 1 : 0,
                  }}
                >
                  {point.name}
                </div>
                {/* Traffic count */}
                <div
                  className="absolute -top-1 -right-1 px-1 rounded-full font-bold font-['JetBrains_Mono'] whitespace-nowrap leading-none py-0.5"
                  style={{ background: `${color}18`, color, border: `1px solid ${color}35`, fontSize: "8px" }}
                >
                  {(point.arrivals + point.departures) > 999
                    ? `${Math.round((point.arrivals + point.departures) / 1000)}k`
                    : (point.arrivals + point.departures)}
                </div>
              </button>
            );
          })}
        </div>

        {/* Side panel */}
        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l overflow-y-auto" style={{ borderColor: "rgba(184,138,60,0.1)", maxHeight: "340px" }}>
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
                  { label: isAr ? "المغادرة" : "Departures", value: selected.departures, color: "#C5A365" },
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
            <div className="divide-y" style={{ borderColor: "rgba(184,138,60,0.06)" }}>
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
