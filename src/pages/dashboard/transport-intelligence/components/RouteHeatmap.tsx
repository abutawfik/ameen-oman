import { useState } from "react";

interface Props { isAr: boolean; }

interface RoutePoint {
  id: string;
  name: string;
  nameAr: string;
  x: number;
  y: number;
  density: "normal" | "frequent" | "anomaly";
  trips: number;
  type: "bus" | "taxi" | "hub";
}

interface RouteLink {
  from: string;
  to: string;
  density: "normal" | "frequent" | "anomaly";
  trips: number;
}

const POINTS: RoutePoint[] = [
  { id: "mct-airport", name: "Capital Airport", nameAr: "مطار العاصمة", x: 63, y: 30, density: "frequent", trips: 2841, type: "hub" },
  { id: "ruwi", name: "Capital Bus Station", nameAr: "محطة العاصمة", x: 60, y: 38, density: "frequent", trips: 4120, type: "hub" },
  { id: "qurum", name: "West District", nameAr: "الحي الغربي", x: 55, y: 34, density: "normal", trips: 1240, type: "bus" },
  { id: "khuwair", name: "Al Khuwair", nameAr: "الخوير", x: 52, y: 32, density: "normal", trips: 980, type: "bus" },
  { id: "seeb", name: "East District", nameAr: "الحي الشرقي", x: 46, y: 28, density: "normal", trips: 760, type: "bus" },
  { id: "industrial", name: "Industrial Zone", nameAr: "المنطقة الصناعية", x: 58, y: 44, density: "anomaly", trips: 312, type: "bus" },
  { id: "sohar", name: "Northern City", nameAr: "المدينة الشمالية", x: 48, y: 16, density: "normal", trips: 420, type: "hub" },
  { id: "nizwa", name: "Central City", nameAr: "المدينة المركزية", x: 42, y: 48, density: "normal", trips: 290, type: "hub" },
  { id: "salalah", name: "Southern City", nameAr: "المدينة الجنوبية", x: 36, y: 82, density: "normal", trips: 380, type: "hub" },
  { id: "barka", name: "Coastal Town", nameAr: "البلدة الساحلية", x: 50, y: 24, density: "normal", trips: 540, type: "bus" },
];

const LINKS: RouteLink[] = [
  { from: "ruwi", to: "mct-airport", density: "frequent", trips: 1820 },
  { from: "ruwi", to: "qurum", density: "normal", trips: 940 },
  { from: "qurum", to: "khuwair", density: "normal", trips: 780 },
  { from: "khuwair", to: "seeb", density: "normal", trips: 620 },
  { from: "seeb", to: "barka", density: "normal", trips: 410 },
  { from: "ruwi", to: "industrial", density: "anomaly", trips: 312 },
  { from: "barka", to: "sohar", density: "normal", trips: 290 },
  { from: "ruwi", to: "nizwa", density: "normal", trips: 240 },
];

const densityColor = (d: RoutePoint["density"]) => {
  if (d === "normal") return "#D6B47E";
  if (d === "frequent") return "#FACC15";
  return "#C94A5E";
};

const densityLabel = (d: RoutePoint["density"], isAr: boolean) => {
  if (d === "normal") return isAr ? "عادي" : "Normal";
  if (d === "frequent") return isAr ? "متكرر" : "Frequent";
  return isAr ? "شذوذ" : "Anomaly";
};

const RouteHeatmap = ({ isAr }: Props) => {
  const [selected, setSelected] = useState<RoutePoint | null>(null);
  const [filter, setFilter] = useState<"all" | "bus" | "taxi" | "anomaly">("all");

  const filteredPoints = POINTS.filter((p) => {
    if (filter === "anomaly") return p.density === "anomaly";
    if (filter === "bus") return p.type === "bus" || p.type === "hub";
    return true;
  });

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.15)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center justify-between px-6 py-4 border-b flex-wrap gap-3" style={{ borderColor: "rgba(184,138,60,0.1)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
            <i className="ri-map-2-line text-gold-400 text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{isAr ? "خريطة كثافة المسارات" : "Route Density Heatmap"}</h3>
            <p className="text-gray-500 text-xs">{isAr ? "شبكة النقل الوطنية — جميع وسائل النقل" : "National Transport Network — All transport modes"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "bus", "taxi", "anomaly"] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
              style={{
                background: filter === f ? "rgba(184,138,60,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${filter === f ? "rgba(184,138,60,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: filter === f ? "#D6B47E" : "#6B7280",
              }}>
              {f === "all" ? (isAr ? "الكل" : "All") : f === "bus" ? (isAr ? "حافلة" : "Bus") : f === "taxi" ? (isAr ? "تاكسي" : "Taxi") : (isAr ? "شذوذ" : "Anomaly")}
            </button>
          ))}
          <div className="flex items-center gap-3 ml-2">
            {(["normal", "frequent", "anomaly"] as const).map((d) => (
              <div key={d} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: densityColor(d) }} />
                <span className="text-gray-500 text-xs">{densityLabel(d, isAr)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Map */}
        <div className="relative flex-1 min-h-[360px]" style={{ background: "rgba(5,20,40,0.6)" }}>
          <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(184,138,60,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.04) 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />
          <div className="absolute top-4 left-4 text-gray-600 text-xs font-['JetBrains_Mono'] opacity-60">OMAN</div>

          {/* SVG route lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
            {LINKS.map((link) => {
              const from = POINTS.find((p) => p.id === link.from);
              const to = POINTS.find((p) => p.id === link.to);
              if (!from || !to) return null;
              const color = densityColor(link.density);
              return (
                <line key={`${link.from}-${link.to}`}
                  x1={`${from.x}%`} y1={`${from.y}%`}
                  x2={`${to.x}%`} y2={`${to.y}%`}
                  stroke={color} strokeWidth={link.density === "anomaly" ? 2.5 : link.density === "frequent" ? 2 : 1.5}
                  strokeOpacity={link.density === "anomaly" ? 0.9 : 0.5}
                  strokeDasharray={link.density === "anomaly" ? "6 3" : "none"}
                />
              );
            })}
          </svg>

          {/* Points */}
          {filteredPoints.map((point) => {
            const color = densityColor(point.density);
            const isSelected = selected?.id === point.id;
            return (
              <button key={point.id} type="button" onClick={() => setSelected(isSelected ? null : point)}
                className="absolute cursor-pointer group"
                style={{ left: `${point.x}%`, top: `${point.y}%`, transform: "translate(-50%, -50%)" }}>
                {point.density === "anomaly" && (
                  <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ background: color, transform: "scale(2.5)" }} />
                )}
                <div className="relative rounded-full border-2 flex items-center justify-center transition-all duration-200"
                  style={{
                    width: point.type === "hub" ? "18px" : "14px",
                    height: point.type === "hub" ? "18px" : "14px",
                    background: isSelected ? color : `${color}30`,
                    borderColor: color,
                    boxShadow: isSelected ? `0 0 14px ${color}80` : "none",
                    transform: isSelected ? "scale(1.5)" : "scale(1)",
                  }}>
                  <div className="rounded-full" style={{ width: "6px", height: "6px", background: color }} />
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono'] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `${color}20`, color, border: `1px solid ${color}40`, fontSize: "9px" }}>
                  {isAr ? point.nameAr : point.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Side panel */}
        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l overflow-y-auto" style={{ borderColor: "rgba(184,138,60,0.1)", maxHeight: "360px" }}>
          {selected ? (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: `${densityColor(selected.density)}15`, border: `1px solid ${densityColor(selected.density)}30` }}>
                  <i className={`${selected.type === "hub" ? "ri-map-pin-2-line" : "ri-map-pin-line"} text-sm`} style={{ color: densityColor(selected.density) }} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{isAr ? selected.nameAr : selected.name}</div>
                  <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: `${densityColor(selected.density)}15`, color: densityColor(selected.density), fontSize: "9px" }}>
                    {densityLabel(selected.density, isAr).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: isAr ? "الرحلات اليوم" : "Trips Today", value: selected.trips.toLocaleString(), color: densityColor(selected.density) },
                  { label: isAr ? "النوع" : "Type", value: selected.type === "hub" ? (isAr ? "محطة رئيسية" : "Hub Station") : (isAr ? "محطة حافلة" : "Bus Stop"), color: "#D1D5DB" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-gray-400 text-xs">{stat.label}</span>
                    <span className="font-bold text-sm font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                ))}
                {selected.density === "anomaly" && (
                  <div className="flex items-start gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(201,74,94,0.08)", border: "1px solid rgba(201,74,94,0.2)" }}>
                    <i className="ri-alarm-warning-line text-red-400 text-xs mt-0.5 flex-shrink-0" />
                    <p className="text-red-400 text-xs">{isAr ? "نمط غير عادي — يتطلب مراجعة" : "Unusual pattern — requires review"}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "rgba(184,138,60,0.06)" }}>
              {[...POINTS].sort((a, b) => b.trips - a.trips).map((point) => (
                <button key={point.id} type="button" onClick={() => setSelected(point)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer text-left">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: densityColor(point.density) }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-semibold truncate">{isAr ? point.nameAr : point.name}</div>
                  </div>
                  <div className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: densityColor(point.density) }}>
                    {point.trips.toLocaleString()}
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

export default RouteHeatmap;
