import { useState } from "react";
import { hotspots, type Hotspot } from "@/mocks/geointData";

const intensityConfig = {
  critical: { color: "#F87171", bg: "rgba(248,113,113,0.15)", border: "rgba(248,113,113,0.4)", label: "CRITICAL", pulse: true },
  high:     { color: "#FB923C", bg: "rgba(251,146,60,0.12)",  border: "rgba(251,146,60,0.35)",  label: "HIGH",     pulse: true },
  medium:   { color: "#FACC15", bg: "rgba(250,204,21,0.10)",  border: "rgba(250,204,21,0.30)",  label: "MEDIUM",   pulse: false },
  low:      { color: "#4ADE80", bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.25)",  label: "LOW",      pulse: false },
};

const W = 900;
const H = 460;

function projectPoint(lat: number, lng: number) {
  const minLat = 23.55, maxLat = 23.66;
  const minLng = 58.35, maxLng = 58.65;
  const x = ((lng - minLng) / (maxLng - minLng)) * W;
  const y = H - ((lat - minLat) / (maxLat - minLat)) * H;
  return { x, y };
}

const HotspotClustering = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [filterIntensity, setFilterIntensity] = useState<string>("all");

  const filtered = filterIntensity === "all"
    ? hotspots
    : hotspots.filter((h) => h.intensity === filterIntensity);

  const totalEvents = hotspots.reduce((s, h) => s + h.eventCount, 0);
  const totalSubjects = hotspots.reduce((s, h) => s + h.subjectCount, 0);

  return (
    <div className="flex gap-4 h-full">
      {/* Map */}
      <div className="flex-1 flex flex-col">
        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-['JetBrains_Mono'] text-gray-500 uppercase tracking-wider">Intensity:</span>
          {["all", "critical", "high", "medium", "low"].map((lvl) => {
            const cfg = lvl !== "all" ? intensityConfig[lvl as keyof typeof intensityConfig] : null;
            return (
              <button
                key={lvl}
                onClick={() => setFilterIntensity(lvl)}
                className={`px-3 py-1 rounded-full text-xs font-['Inter'] font-medium transition-all cursor-pointer whitespace-nowrap ${
                  filterIntensity === lvl ? "border" : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"
                }`}
                style={filterIntensity === lvl && cfg ? {
                  background: cfg.bg,
                  color: cfg.color,
                  borderColor: cfg.border,
                } : filterIntensity === lvl ? {
                  background: "rgba(34,211,238,0.15)",
                  color: "#22D3EE",
                  borderColor: "rgba(34,211,238,0.4)",
                } : {}}
              >
                {lvl.toUpperCase()}
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-4 text-xs font-['JetBrains_Mono'] text-gray-500">
            <span>{filtered.length} clusters shown</span>
            <span>{totalEvents.toLocaleString()} total events</span>
          </div>
        </div>

        {/* SVG Map */}
        <div className="relative flex-1 rounded-xl overflow-hidden" style={{ background: "#0D1B2E", border: "1px solid rgba(34,211,238,0.15)", minHeight: "380px" }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
            <defs>
              <pattern id="hsgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(34,211,238,0.04)" strokeWidth="1" />
              </pattern>
              {Object.entries(intensityConfig).map(([key, cfg]) => (
                <radialGradient key={key} id={`glow-${key}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={cfg.color} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={cfg.color} stopOpacity="0" />
                </radialGradient>
              ))}
            </defs>
            <rect width={W} height={H} fill="url(#hsgrid)" />

            {/* Water */}
            <path
              d="M 0 400 Q 150 380 300 390 Q 450 400 550 375 Q 650 350 750 365 Q 850 380 900 360 L 900 460 L 0 460 Z"
              fill="rgba(34,211,238,0.04)"
              stroke="rgba(34,211,238,0.08)"
              strokeWidth="1"
            />
            <text x="820" y="440" fill="rgba(34,211,238,0.15)" fontSize="9" textAnchor="middle">Gulf of Oman</text>

            {/* Hotspot clusters */}
            {filtered.map((hs) => {
              const { x, y } = projectPoint(hs.lat, hs.lng);
              const cfg = intensityConfig[hs.intensity];
              const isSelected = selectedHotspot?.id === hs.id;
              const r = hs.radius;

              return (
                <g key={hs.id} className="cursor-pointer" onClick={() => setSelectedHotspot(isSelected ? null : hs)}>
                  {/* Outer glow */}
                  <circle cx={x} cy={y} r={r * 1.5} fill={`url(#glow-${hs.intensity})`} opacity="0.6">
                    {cfg.pulse && (
                      <animate attributeName="r" values={`${r * 1.2};${r * 1.8};${r * 1.2}`} dur="3s" repeatCount="indefinite" />
                    )}
                  </circle>
                  {/* Main cluster circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={r}
                    fill={cfg.bg}
                    stroke={cfg.color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    strokeDasharray={isSelected ? "none" : "4 2"}
                    opacity="0.85"
                  />
                  {/* Center dot */}
                  <circle cx={x} cy={y} r="6" fill={cfg.color} opacity="0.9" />
                  {/* Event count */}
                  <text x={x} y={y + 4} textAnchor="middle" fontSize="7" fill="#0D1B2E" fontWeight="bold">
                    {hs.eventCount > 99 ? "99+" : hs.eventCount}
                  </text>
                  {/* Location label */}
                  <text x={x} y={y + r + 14} textAnchor="middle" fontSize="8" fill={cfg.color} opacity="0.8">
                    {hs.district}
                  </text>
                  {/* Subject count badge */}
                  <g transform={`translate(${x + r * 0.6}, ${y - r * 0.6})`}>
                    <circle r="9" fill="#0A1628" stroke={cfg.color} strokeWidth="1" />
                    <text textAnchor="middle" y="4" fontSize="7" fill={cfg.color} fontWeight="bold">{hs.subjectCount}</text>
                  </g>
                </g>
              );
            })}

            {/* Legend */}
            <g transform="translate(10, 10)">
              <rect width="120" height="100" rx="4" fill="rgba(10,22,40,0.85)" stroke="rgba(34,211,238,0.15)" strokeWidth="1" />
              <text x="10" y="16" fill="rgba(34,211,238,0.7)" fontSize="8" fontWeight="bold" letterSpacing="1">INTENSITY</text>
              {Object.entries(intensityConfig).map(([key, cfg], i) => (
                <g key={key} transform={`translate(10, ${22 + i * 18})`}>
                  <circle cx="5" cy="5" r="5" fill={cfg.bg} stroke={cfg.color} strokeWidth="1" />
                  <text x="16" y="9" fill="rgba(255,255,255,0.6)" fontSize="8">{cfg.label}</text>
                </g>
              ))}
              <text x="10" y="96" fill="rgba(255,255,255,0.3)" fontSize="7">● = subjects in cluster</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Right panel: Hotspot detail or list */}
      <div className="w-72 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: "520px" }}>
        {selectedHotspot ? (
          <div className="rounded-xl p-4" style={{ background: "#0D1B2E", border: `1px solid ${intensityConfig[selectedHotspot.intensity].border}` }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-['JetBrains_Mono'] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: intensityConfig[selectedHotspot.intensity].bg, color: intensityConfig[selectedHotspot.intensity].color }}>
                    {intensityConfig[selectedHotspot.intensity].label}
                  </span>
                </div>
                <h3 className="text-white font-['Inter'] font-semibold text-sm">{selectedHotspot.location}</h3>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{selectedHotspot.district}</p>
              </div>
              <button onClick={() => setSelectedHotspot(null)} className="text-gray-600 hover:text-gray-400 cursor-pointer">
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { label: "Events", value: selectedHotspot.eventCount.toLocaleString(), icon: "ri-pulse-line" },
                { label: "Subjects", value: selectedHotspot.subjectCount, icon: "ri-user-line" },
                { label: "Radius", value: `${selectedHotspot.radius * 10}m`, icon: "ri-map-pin-range-line" },
                { label: "Last Event", value: selectedHotspot.lastEvent, icon: "ri-time-line" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <i className={`${stat.icon} text-xs`} style={{ color: intensityConfig[selectedHotspot.intensity].color }} />
                    <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{stat.label}</span>
                  </div>
                  <p className="text-white text-sm font-['Inter'] font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-3">
              <p className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider mb-2">Active Streams</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedHotspot.streams.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-full text-xs font-['Inter']"
                    style={{ background: "rgba(34,211,238,0.1)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-gray-500 text-xs font-['JetBrains_Mono'] mb-1">Top Activity</p>
              <p className="text-white text-xs font-['Inter']">{selectedHotspot.topActivity}</p>
            </div>

            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2 rounded-lg text-xs font-['Inter'] font-medium cursor-pointer transition-all hover:opacity-80"
                style={{ background: "rgba(34,211,238,0.15)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.3)" }}>
                <i className="ri-focus-3-line mr-1" />Investigate
              </button>
              <button className="flex-1 py-2 rounded-lg text-xs font-['Inter'] font-medium cursor-pointer transition-all hover:opacity-80"
                style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)" }}>
                <i className="ri-alarm-warning-line mr-1" />Alert
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl p-3" style={{ background: "#0D1B2E", border: "1px solid rgba(34,211,238,0.1)" }}>
            <p className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider mb-2">Click a cluster to inspect</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg p-2.5 text-center" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                <p className="text-red-400 text-lg font-['JetBrains_Mono'] font-bold">{hotspots.filter((h) => h.intensity === "critical").length}</p>
                <p className="text-gray-500 text-xs">Critical</p>
              </div>
              <div className="rounded-lg p-2.5 text-center" style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}>
                <p className="text-orange-400 text-lg font-['JetBrains_Mono'] font-bold">{hotspots.filter((h) => h.intensity === "high").length}</p>
                <p className="text-gray-500 text-xs">High</p>
              </div>
              <div className="rounded-lg p-2.5 text-center" style={{ background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.2)" }}>
                <p className="text-yellow-400 text-lg font-['JetBrains_Mono'] font-bold">{hotspots.filter((h) => h.intensity === "medium").length}</p>
                <p className="text-gray-500 text-xs">Medium</p>
              </div>
              <div className="rounded-lg p-2.5 text-center" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
                <p className="text-green-400 text-lg font-['JetBrains_Mono'] font-bold">{hotspots.filter((h) => h.intensity === "low").length}</p>
                <p className="text-gray-500 text-xs">Low</p>
              </div>
            </div>
          </div>
        )}

        {/* Hotspot list */}
        <div className="space-y-2">
          {filtered.map((hs) => {
            const cfg = intensityConfig[hs.intensity];
            return (
              <button
                key={hs.id}
                onClick={() => setSelectedHotspot(selectedHotspot?.id === hs.id ? null : hs)}
                className="w-full text-left rounded-xl p-3 transition-all cursor-pointer hover:opacity-90"
                style={{
                  background: selectedHotspot?.id === hs.id ? cfg.bg : "rgba(255,255,255,0.02)",
                  border: `1px solid ${selectedHotspot?.id === hs.id ? cfg.border : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-xs font-['Inter'] font-medium">{hs.district}</span>
                  <span className="text-xs font-['JetBrains_Mono'] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-['JetBrains_Mono'] text-gray-500">
                  <span><i className="ri-pulse-line mr-1" />{hs.eventCount}</span>
                  <span><i className="ri-user-line mr-1" />{hs.subjectCount}</span>
                  <span className="ml-auto">{hs.lastEvent}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HotspotClustering;
