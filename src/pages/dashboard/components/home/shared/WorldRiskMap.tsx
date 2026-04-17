import { useMemo, useState } from "react";
import { SCORE_BAND_META, type OriginRisk } from "@/mocks/osintData";
import { CONTINENT_PATHS, OMAN_PATH } from "./worldPaths";

interface Props {
  origins: OriginRisk[];
  onSelectCountry?: (iso2: string) => void;
  isAr: boolean;
  selectedIso2?: string | null;
}

// Stylised equirectangular world map + bubble overlays for each origin country.
// Pure compile-time SVG (no runtime deps). Bubble radius encodes arrivals24h,
// fill encodes avgScore band, hover shows a tooltip.
const WorldRiskMap = ({ origins, onSelectCountry, isAr, selectedIso2 }: Props) => {
  // Equirectangular projection: x = lon, y = -lat. viewBox sized to the
  // approximate land extent so we're not wasting screen on empty ocean.
  const viewBox = "-170 -85 340 145";

  const [hovered, setHovered] = useState<string | null>(null);

  const maxArrivals = useMemo(
    () => origins.reduce((m, o) => Math.max(m, o.arrivals24h), 1),
    [origins],
  );

  const bubbleRadius = (arrivals: number) => {
    // Area-proportional scaling so big origins don't dwarf the map.
    const norm = Math.sqrt(arrivals / maxArrivals);
    return Math.max(1.2, norm * 8);
  };

  // Oman anchor sits around (56, 21) lat/lon.
  const omanMarker = { lon: 57.0, lat: 21.5 };

  return (
    <div
      className="relative rounded-xl border overflow-hidden"
      style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}
    >
      <div className="flex items-center justify-between px-4 pt-4">
        <div>
          <h3 className="text-white text-sm font-bold">
            {isAr ? "خريطة المخاطر حسب المنشأ" : "Origin-country risk map"}
          </h3>
          <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
            {isAr
              ? "حجم الدائرة = وصول خلال 24 ساعة · اللون = نطاق متوسط الدرجة"
              : "bubble size = arrivals 24h · colour = avg-score band"}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[10px] font-['JetBrains_Mono']">
          {(["low", "borderline", "elevated", "high", "critical"] as const).map((b) => (
            <span key={b} className="flex items-center gap-1 text-gray-400">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: SCORE_BAND_META[b].color }}
              />
              {SCORE_BAND_META[b].labelEn}
            </span>
          ))}
        </div>
      </div>

      <div className="relative w-full" style={{ aspectRatio: "340 / 145" }}>
        <svg
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full"
        >
          {/* Faint graticule */}
          <g stroke="rgba(184,138,60,0.08)" strokeWidth={0.3} fill="none">
            {[-60, -30, 0, 30, 60].map((lat) => (
              <line key={`lat-${lat}`} x1={-170} x2={170} y1={-lat} y2={-lat} />
            ))}
            {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => (
              <line key={`lon-${lon}`} x1={lon} x2={lon} y1={-85} y2={60} />
            ))}
          </g>

          {/* Continent silhouettes */}
          <g
            fill="rgba(184,138,60,0.06)"
            stroke="rgba(184,138,60,0.25)"
            strokeWidth={0.4}
            strokeLinejoin="round"
          >
            {CONTINENT_PATHS.map((c) => (
              <path key={c.id} d={c.d} />
            ))}
          </g>

          {/* Oman anchor outline + marker */}
          <path d={OMAN_PATH} fill="rgba(184,138,60,0.35)" stroke="#D6B47E" strokeWidth={0.6} />
          <circle
            cx={omanMarker.lon}
            cy={-omanMarker.lat}
            r={2.6}
            fill="#D6B47E"
            opacity={0.9}
          />
          <circle
            cx={omanMarker.lon}
            cy={-omanMarker.lat}
            r={5.2}
            fill="none"
            stroke="#D6B47E"
            strokeWidth={0.5}
            opacity={0.5}
          >
            <animate
              attributeName="r"
              values="3;7;3"
              dur="2.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0;0.6"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Bubbles */}
          {origins.map((o) => {
            const meta = SCORE_BAND_META[o.topBand];
            const r = bubbleRadius(o.arrivals24h);
            const isSel = selectedIso2 === o.iso2;
            const isHover = hovered === o.iso2;
            return (
              <g
                key={o.iso2}
                style={{ cursor: onSelectCountry ? "pointer" : "default" }}
                onMouseEnter={() => setHovered(o.iso2)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelectCountry?.(o.iso2)}
              >
                <circle
                  cx={o.lon}
                  cy={-o.lat}
                  r={r + 1.5}
                  fill={meta.color}
                  opacity={isSel || isHover ? 0.25 : 0.1}
                />
                <circle
                  cx={o.lon}
                  cy={-o.lat}
                  r={r}
                  fill={meta.color}
                  opacity={0.85}
                  stroke={isSel ? "#FFFFFF" : "rgba(255,255,255,0.25)"}
                  strokeWidth={isSel ? 0.8 : 0.3}
                >
                  <title>
                    {`${isAr ? o.nameAr : o.nameEn} · arrivals ${o.arrivals24h.toLocaleString()} · avg score ${o.avgScore} · flagged ${o.flagged24h}`}
                  </title>
                </circle>
              </g>
            );
          })}

          {/* Destination label */}
          <text
            x={omanMarker.lon}
            y={-omanMarker.lat - 4}
            fill="#D6B47E"
            fontFamily="JetBrains Mono, monospace"
            fontSize="2.2"
            fontWeight="bold"
            textAnchor="middle"
          >
            MCT
          </text>
        </svg>

        {/* Hover tooltip overlay */}
        {hovered && (() => {
          const o = origins.find((x) => x.iso2 === hovered);
          if (!o) return null;
          const meta = SCORE_BAND_META[o.topBand];
          return (
            <div
              className="absolute top-3 right-3 px-3 py-2 rounded-lg text-xs font-['JetBrains_Mono'] pointer-events-none"
              style={{
                background: "rgba(5,20,40,0.92)",
                border: `1px solid ${meta.color}66`,
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: meta.color }}
                />
                <span className="text-white font-bold">
                  {isAr ? o.nameAr : o.nameEn}
                </span>
                <span className="text-gray-500">{o.iso3}</span>
              </div>
              <div className="flex gap-3 text-[11px] text-gray-400">
                <span>
                  {isAr ? "وصول" : "arrivals"}{" "}
                  <span className="text-white">{o.arrivals24h.toLocaleString()}</span>
                </span>
                <span>
                  {isAr ? "مُرفَع" : "flagged"}{" "}
                  <span className="text-white">{o.flagged24h}</span>
                </span>
                <span>
                  {isAr ? "درجة" : "avg"}{" "}
                  <span style={{ color: meta.color }}>{o.avgScore}</span>
                </span>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default WorldRiskMap;
