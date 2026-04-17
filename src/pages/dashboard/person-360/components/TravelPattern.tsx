import { useState } from "react";
import type { TravelStop } from "@/mocks/person360Data";

interface Props {
  stops: TravelStop[];
  isAr: boolean;
  onGenerateDossier: () => void;
}

const TravelPattern = ({ stops, isAr, onGenerateDossier }: Props) => {
  const [hoveredStop, setHoveredStop] = useState<number | null>(null);
  const [selectedStop, setSelectedStop] = useState<number | null>(null);

  const totalDistance = stops.reduce((sum, s) => {
    if (!s.distance || s.distance === "—") return sum;
    return sum + parseInt(s.distance.replace(" km", ""), 10);
  }, 0);

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.15)", backdropFilter: "blur(12px)" }}
    >
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h3 className="text-white font-bold font-['Inter'] text-sm uppercase tracking-wider">
            {isAr ? "نمط التنقل — خريطة عُمان" : "Travel Pattern — Oman Map"}
          </h3>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-gray-500 text-xs font-['JetBrains_Mono']">
              {stops.length} {isAr ? "محطة" : "stops"}
            </span>
            <span className="text-gray-500 text-xs font-['JetBrains_Mono']">
              ~{totalDistance} km {isAr ? "إجمالي" : "total"}
            </span>
            <span className="text-gray-500 text-xs font-['JetBrains_Mono']">
              {isAr ? "21 يوماً داخل البلاد" : "21 days in-country"}
            </span>
          </div>
        </div>
        <button
          onClick={onGenerateDossier}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold font-['Inter'] cursor-pointer transition-all whitespace-nowrap"
          style={{ background: "#D6B47E", color: "#051428", boxShadow: "0 0 20px rgba(184,138,60,0.3)" }}
        >
          <i className="ri-file-pdf-line" />
          {isAr ? "إنشاء ملف شامل" : "Generate Dossier"}
        </button>
      </div>

      <div className="flex gap-5 flex-col lg:flex-row">
        {/* Map */}
        <div
          className="flex-1 relative rounded-xl overflow-hidden"
          style={{ background: "rgba(5,20,40,0.8)", border: "1px solid rgba(184,138,60,0.1)", minHeight: "340px" }}
        >
          {/* Map background */}
          <img
            src="https://readdy.ai/api/search-image?query=dark%20minimalist%20satellite%20map%20of%20Oman%20showing%20coastline%20and%20terrain%2C%20dark%20navy%20blue%20background%2C%20subtle%20geographic%20features%2C%20no%20text%20labels%2C%20clean%20intelligence%20dashboard%20aesthetic%2C%20muted%20tones%20with%20slight%20cyan%20tint&width=600&height=340&seq=oman-travel-map-002&orientation=landscape"
            alt="Oman Map"
            className="w-full h-full object-cover object-center opacity-25"
            style={{ position: "absolute", inset: 0 }}
          />

          {/* Grid overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="travel-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D6B47E" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#travel-grid)" />
          </svg>

          {/* SVG path + stops */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 340" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pathGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D6B47E" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#D6B47E" stopOpacity="0.3" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Path connecting stops */}
            <polyline
              points="380,120 370,130 360,140 380,120 340,80 355,125 375,138 355,125 355,125"
              fill="none"
              stroke="url(#pathGrad2)"
              strokeWidth="1.5"
              strokeDasharray="6 3"
              filter="url(#glow)"
            />

            {/* Stop markers */}
            {[
              { x: 380, y: 120, seq: 1, color: "#60A5FA" },
              { x: 370, y: 130, seq: 2, color: "#D6B47E" },
              { x: 360, y: 140, seq: 3, color: "#D6B47E" },
              { x: 380, y: 120, seq: 4, color: "#C98A1B" },
              { x: 340, y: 80,  seq: 5, color: "#FACC15" },
              { x: 355, y: 125, seq: 6, color: "#DDB96B" },
              { x: 355, y: 128, seq: 7, color: "#FCD34D" },
              { x: 375, y: 138, seq: 8, color: "#D6B47E" },
              { x: 355, y: 125, seq: 9, color: "#FACC15" },
            ].map((pt) => {
              const isHov = hoveredStop === pt.seq - 1 || selectedStop === pt.seq - 1;
              return (
                <g key={pt.seq} filter={isHov ? "url(#glow)" : undefined}>
                  <circle
                    cx={pt.x} cy={pt.y}
                    r={isHov ? 13 : 10}
                    fill={`${pt.color}22`}
                    stroke={pt.color}
                    strokeWidth={isHov ? 2 : 1.5}
                    style={{ transition: "r 0.2s" }}
                  />
                  <text
                    x={pt.x} y={pt.y + 4}
                    textAnchor="middle"
                    fill={pt.color}
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {pt.seq}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map label */}
          <div className="absolute top-3 left-3">
            <span
              className="px-2 py-1 rounded text-[10px] font-['JetBrains_Mono'] font-bold"
              style={{ background: "rgba(5,20,40,0.85)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.2)" }}
            >
              {isAr ? "عُمان" : "OMAN"}
            </span>
          </div>

          {/* Stats overlay */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            {[
              { label: isAr ? "محطات" : "Stops", value: stops.length, color: "#D6B47E" },
              { label: isAr ? "كم" : "km", value: `~${totalDistance}`, color: "#FACC15" },
            ].map(s => (
              <div
                key={s.label}
                className="px-2 py-1 rounded text-[10px] font-['JetBrains_Mono']"
                style={{ background: "rgba(5,20,40,0.85)", color: s.color, border: `1px solid ${s.color}30` }}
              >
                <span className="font-bold">{s.value}</span> {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Stop list */}
        <div className="w-full lg:w-72 flex-shrink-0 overflow-y-auto" style={{ maxHeight: "340px", scrollbarWidth: "none" }}>
          <div className="space-y-2">
            {stops.map((stop, idx) => (
              <div
                key={stop.seq}
                className="flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  background: selectedStop === idx
                    ? `${stop.streamColor}12`
                    : hoveredStop === idx
                      ? "rgba(184,138,60,0.06)"
                      : "rgba(5,20,40,0.6)",
                  border: selectedStop === idx
                    ? `1px solid ${stop.streamColor}50`
                    : hoveredStop === idx
                      ? "1px solid rgba(184,138,60,0.25)"
                      : "1px solid rgba(255,255,255,0.05)",
                }}
                onMouseEnter={() => setHoveredStop(idx)}
                onMouseLeave={() => setHoveredStop(null)}
                onClick={() => setSelectedStop(selectedStop === idx ? null : idx)}
              >
                {/* Sequence number */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs font-['JetBrains_Mono']"
                  style={{ background: `${stop.streamColor}22`, border: `2px solid ${stop.streamColor}`, color: stop.streamColor }}
                >
                  {stop.seq}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-['Inter'] font-semibold leading-snug truncate">{stop.location}</p>
                  <p className="text-gray-500 text-[10px] font-['JetBrains_Mono'] mt-0.5">{stop.datetime}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className="text-[9px] font-['JetBrains_Mono'] px-1.5 py-0.5 rounded"
                      style={{ background: `${stop.streamColor}18`, color: stop.streamColor }}
                    >
                      {stop.event}
                    </span>
                    {stop.distance && stop.distance !== "—" && (
                      <span className="text-gray-600 text-[9px] font-['JetBrains_Mono'] flex items-center gap-0.5">
                        <i className="ri-route-line" style={{ fontSize: 9 }} />
                        {stop.distance}
                      </span>
                    )}
                    {stop.duration && stop.duration !== "—" && (
                      <span className="text-gray-600 text-[9px] font-['JetBrains_Mono'] flex items-center gap-0.5">
                        <i className="ri-time-line" style={{ fontSize: 9 }} />
                        {stop.duration}
                      </span>
                    )}
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

export default TravelPattern;
