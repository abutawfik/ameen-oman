import { useState } from "react";
import { geoSubjects, movementPoints, type GeoSubject, type MovementPoint } from "@/mocks/geointData";

const MUSCAT_CENTER = { lat: 23.5880, lng: 58.5000 };

// Simple SVG-based map projection
function projectPoint(lat: number, lng: number, width: number, height: number) {
  const minLat = 23.55, maxLat = 23.65;
  const minLng = 58.35, maxLng = 58.65;
  const x = ((lng - minLng) / (maxLng - minLng)) * width;
  const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
  return { x, y };
}

const riskColors: Record<string, string> = {
  critical: "#F87171",
  high: "#FB923C",
  medium: "#FACC15",
  low: "#4ADE80",
};

const subjectTrailColors = ["#22D3EE", "#F87171", "#A78BFA", "#4ADE80", "#FB923C"];

interface Props {
  selectedSubjectId: string | null;
  onSelectSubject: (id: string | null) => void;
}

const MovementTrailMap = ({ selectedSubjectId, onSelectSubject }: Props) => {
  const [hoveredPoint, setHoveredPoint] = useState<MovementPoint | null>(null);
  const [showAllSubjects, setShowAllSubjects] = useState(true);

  const W = 900;
  const H = 500;

  const filteredPoints = selectedSubjectId
    ? movementPoints.filter((p) => p.subjectId === selectedSubjectId)
    : movementPoints;

  const subjectIds = [...new Set(movementPoints.map((p) => p.subjectId))];

  const getSubjectColor = (subjectId: string) => {
    const idx = subjectIds.indexOf(subjectId);
    return subjectTrailColors[idx % subjectTrailColors.length];
  };

  // Group points by subject for trail lines
  const trailsBySubject = subjectIds.map((sid) => ({
    subjectId: sid,
    points: movementPoints
      .filter((p) => p.subjectId === sid)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    color: getSubjectColor(sid),
  }));

  const visibleTrails = selectedSubjectId
    ? trailsBySubject.filter((t) => t.subjectId === selectedSubjectId)
    : trailsBySubject;

  // District labels
  const districts = [
    { name: "Seeb / Airport", lat: 23.5900, lng: 58.3900 },
    { name: "Muttrah Port", lat: 23.5970, lng: 58.5620 },
    { name: "Ruwi", lat: 23.6060, lng: 58.5720 },
    { name: "Qurum", lat: 23.6200, lng: 58.5820 },
    { name: "Shati Al Qurum", lat: 23.6120, lng: 58.5950 },
    { name: "Old Muscat", lat: 23.5720, lng: 58.5420 },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="text-xs font-['JetBrains_Mono'] text-gray-400 uppercase tracking-wider">Filter Subject:</span>
        <button
          onClick={() => onSelectSubject(null)}
          className={`px-3 py-1 rounded-full text-xs font-['Inter'] font-medium transition-all cursor-pointer whitespace-nowrap ${
            !selectedSubjectId ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40" : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"
          }`}
        >
          All Subjects
        </button>
        {geoSubjects.map((s, i) => (
          <button
            key={s.id}
            onClick={() => onSelectSubject(selectedSubjectId === s.id ? null : s.id)}
            className={`px-3 py-1 rounded-full text-xs font-['Inter'] font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedSubjectId === s.id ? "border" : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"
            }`}
            style={selectedSubjectId === s.id ? {
              background: `${subjectTrailColors[i % subjectTrailColors.length]}20`,
              color: subjectTrailColors[i % subjectTrailColors.length],
              borderColor: `${subjectTrailColors[i % subjectTrailColors.length]}60`,
            } : {}}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: subjectTrailColors[i % subjectTrailColors.length] }} />
            {s.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Map SVG */}
      <div className="relative flex-1 rounded-xl overflow-hidden" style={{ background: "#0D1B2E", border: "1px solid rgba(34,211,238,0.15)", minHeight: "420px" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(34,211,238,0.04)" strokeWidth="1" />
            </pattern>
            <radialGradient id="hotGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F87171" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F87171" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width={W} height={H} fill="url(#grid)" />

          {/* Coastline / water suggestion */}
          <path
            d="M 0 420 Q 100 400 200 410 Q 300 420 350 400 Q 400 380 450 390 Q 500 400 550 380 Q 600 360 650 370 Q 700 380 750 360 Q 800 340 900 350 L 900 500 L 0 500 Z"
            fill="rgba(34,211,238,0.04)"
            stroke="rgba(34,211,238,0.1)"
            strokeWidth="1"
          />
          <text x="820" y="470" fill="rgba(34,211,238,0.2)" fontSize="10" textAnchor="middle">Gulf of Oman</text>

          {/* District labels */}
          {districts.map((d) => {
            const { x, y } = projectPoint(d.lat, d.lng, W, H);
            return (
              <text key={d.name} x={x} y={y} fill="rgba(255,255,255,0.15)" fontSize="9" textAnchor="middle">
                {d.name}
              </text>
            );
          })}

          {/* Trail lines */}
          {visibleTrails.map((trail) => {
            if (trail.points.length < 2) return null;
            const pathData = trail.points.map((p, i) => {
              const { x, y } = projectPoint(p.lat, p.lng, W, H);
              return `${i === 0 ? "M" : "L"} ${x} ${y}`;
            }).join(" ");
            return (
              <g key={trail.subjectId}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={trail.color}
                  strokeWidth="2"
                  strokeDasharray="6 3"
                  strokeOpacity="0.6"
                />
                {/* Animated dot on trail */}
                <circle r="4" fill={trail.color} opacity="0.8">
                  <animateMotion dur="8s" repeatCount="indefinite" path={pathData} />
                </circle>
              </g>
            );
          })}

          {/* Movement points */}
          {filteredPoints.map((point) => {
            const { x, y } = projectPoint(point.lat, point.lng, W, H);
            const color = getSubjectColor(point.subjectId);
            const isHovered = hoveredPoint?.id === point.id;
            return (
              <g key={point.id}>
                {point.riskFlag && (
                  <circle cx={x} cy={y} r="14" fill={color} opacity="0.1">
                    <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 9 : 7}
                  fill={color}
                  stroke={point.riskFlag ? "#F87171" : color}
                  strokeWidth={point.riskFlag ? 2 : 1}
                  opacity="0.9"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {/* Stream icon indicator */}
                <circle cx={x + 8} cy={y - 8} r="5" fill="#0D1B2E" stroke={point.streamColor} strokeWidth="1" />
                <text x={x + 8} y={y - 5} textAnchor="middle" fontSize="5" fill={point.streamColor}>●</text>
                {/* Sequence number */}
                <text x={x} y={y + 4} textAnchor="middle" fontSize="7" fill="#0D1B2E" fontWeight="bold">
                  {filteredPoints.filter((p) => p.subjectId === point.subjectId).indexOf(point) + 1}
                </text>
              </g>
            );
          })}

          {/* Hover tooltip */}
          {hoveredPoint && (() => {
            const { x, y } = projectPoint(hoveredPoint.lat, hoveredPoint.lng, W, H);
            const tipX = x > W - 200 ? x - 210 : x + 15;
            const tipY = y > H - 100 ? y - 110 : y + 10;
            return (
              <g>
                <rect x={tipX} y={tipY} width="200" height="90" rx="6" fill="#0A1628" stroke="rgba(34,211,238,0.3)" strokeWidth="1" />
                <text x={tipX + 10} y={tipY + 18} fill="#22D3EE" fontSize="9" fontWeight="bold">{hoveredPoint.eventType}</text>
                <text x={tipX + 10} y={tipY + 32} fill="rgba(255,255,255,0.7)" fontSize="8">{hoveredPoint.location}</text>
                <text x={tipX + 10} y={tipY + 46} fill="rgba(255,255,255,0.5)" fontSize="8">{hoveredPoint.stream} Stream</text>
                <text x={tipX + 10} y={tipY + 60} fill="rgba(255,255,255,0.5)" fontSize="8">{hoveredPoint.detail}</text>
                <text x={tipX + 10} y={tipY + 76} fill="rgba(255,255,255,0.35)" fontSize="7">{hoveredPoint.timestamp}</text>
                {hoveredPoint.riskFlag && (
                  <text x={tipX + 10} y={tipY + 88} fill="#F87171" fontSize="7">⚠ Risk Flag Active</text>
                )}
              </g>
            );
          })()}

          {/* Legend */}
          <g transform={`translate(10, 10)`}>
            <rect width="130" height={geoSubjects.length * 18 + 20} rx="4" fill="rgba(10,22,40,0.85)" stroke="rgba(34,211,238,0.15)" strokeWidth="1" />
            <text x="10" y="16" fill="rgba(34,211,238,0.7)" fontSize="8" fontWeight="bold" letterSpacing="1">SUBJECTS</text>
            {geoSubjects.map((s, i) => (
              <g key={s.id} transform={`translate(10, ${20 + i * 18})`}>
                <circle cx="5" cy="5" r="4" fill={subjectTrailColors[i % subjectTrailColors.length]} opacity="0.9" />
                <text x="14" y="9" fill="rgba(255,255,255,0.6)" fontSize="8">{s.name}</text>
              </g>
            ))}
          </g>

          {/* Compass */}
          <g transform={`translate(${W - 40}, 30)`}>
            <circle cx="0" cy="0" r="18" fill="rgba(10,22,40,0.7)" stroke="rgba(34,211,238,0.2)" strokeWidth="1" />
            <text x="0" y="-8" textAnchor="middle" fill="rgba(34,211,238,0.8)" fontSize="8" fontWeight="bold">N</text>
            <line x1="0" y1="-14" x2="0" y2="14" stroke="rgba(34,211,238,0.3)" strokeWidth="1" />
            <line x1="-14" y1="0" x2="14" y2="0" stroke="rgba(34,211,238,0.3)" strokeWidth="1" />
          </g>
        </svg>

        {/* Map overlay label */}
        <div className="absolute top-3 right-14 text-xs font-['JetBrains_Mono'] text-cyan-400/40 uppercase tracking-widest">
          Muscat Governorate — GEOINT View
        </div>
      </div>

      {/* Point count */}
      <div className="flex items-center gap-4 mt-2 text-xs font-['JetBrains_Mono'] text-gray-500">
        <span>{filteredPoints.length} movement events plotted</span>
        <span>•</span>
        <span>{filteredPoints.filter((p) => p.riskFlag).length} risk-flagged points</span>
        <span>•</span>
        <span className="text-cyan-400/60">Live tracking active</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400">LIVE</span>
        </div>
      </div>
    </div>
  );
};

export default MovementTrailMap;
