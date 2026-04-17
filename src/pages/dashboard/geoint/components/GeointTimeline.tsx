import { useState } from "react";
import { movementPoints, geoSubjects, type MovementPoint } from "@/mocks/geointData";

const subjectColors = ["#D6B47E", "#C94A5E", "#A78BFA", "#4ADE80", "#C98A1B"];

const GeointTimeline = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [expandedPoint, setExpandedPoint] = useState<string | null>(null);

  const filteredPoints = (selectedSubjectId
    ? movementPoints.filter((p) => p.subjectId === selectedSubjectId)
    : movementPoints
  ).sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const subjectIds = [...new Set(movementPoints.map((p) => p.subjectId))];

  const getSubjectColor = (subjectId: string) => {
    const idx = subjectIds.indexOf(subjectId);
    return subjectColors[idx % subjectColors.length];
  };

  const getSubjectName = (subjectId: string) => {
    return geoSubjects.find((s) => s.id === subjectId)?.name ?? subjectId;
  };

  // Group by date
  const grouped: Record<string, MovementPoint[]> = {};
  filteredPoints.forEach((p) => {
    const date = p.timestamp.split(" ")[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(p);
  });

  // Stats
  const riskFlagged = filteredPoints.filter((p) => p.riskFlag).length;
  const uniqueStreams = [...new Set(filteredPoints.map((p) => p.stream))];
  const uniqueLocations = [...new Set(filteredPoints.map((p) => p.location))];

  return (
    <div className="flex gap-4 h-full">
      {/* Left: Stats + filter */}
      <div className="w-64 flex flex-col gap-3 flex-shrink-0">
        {/* KPI mini cards */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Events", value: filteredPoints.length, color: "#D6B47E", icon: "ri-pulse-line" },
            { label: "Risk Flags", value: riskFlagged, color: "#C94A5E", icon: "ri-flag-line" },
            { label: "Streams", value: uniqueStreams.length, color: "#A78BFA", icon: "ri-git-branch-line" },
            { label: "Locations", value: uniqueLocations.length, color: "#4ADE80", icon: "ri-map-pin-line" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-3" style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-1.5 mb-1">
                <i className={`${stat.icon} text-xs`} style={{ color: stat.color }} />
                <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{stat.label}</span>
              </div>
              <p className="text-white text-xl font-['JetBrains_Mono'] font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Subject filter */}
        <div className="rounded-xl p-3" style={{ background: "#0D1B2E", border: "1px solid rgba(184,138,60,0.1)" }}>
          <p className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider mb-2">Filter by Subject</p>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedSubjectId(null)}
              className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-['Inter'] transition-all cursor-pointer ${
                !selectedSubjectId ? "bg-gold-400/10 text-gold-400" : "text-gray-400 hover:bg-white/5"
              }`}
            >
              All Subjects
            </button>
            {geoSubjects.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setSelectedSubjectId(selectedSubjectId === s.id ? null : s.id)}
                className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-['Inter'] transition-all cursor-pointer flex items-center gap-2"
                style={selectedSubjectId === s.id ? {
                  background: `${subjectColors[i % subjectColors.length]}15`,
                  color: subjectColors[i % subjectColors.length],
                } : { color: "#6B7280" }}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: subjectColors[i % subjectColors.length] }} />
                <span className="truncate">{s.name}</span>
                <span className="ml-auto text-gray-600">{movementPoints.filter((p) => p.subjectId === s.id).length}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stream breakdown */}
        <div className="rounded-xl p-3" style={{ background: "#0D1B2E", border: "1px solid rgba(184,138,60,0.1)" }}>
          <p className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider mb-2">Stream Breakdown</p>
          <div className="space-y-1.5">
            {uniqueStreams.map((stream) => {
              const count = filteredPoints.filter((p) => p.stream === stream).length;
              const pct = Math.round((count / filteredPoints.length) * 100);
              const color = filteredPoints.find((p) => p.stream === stream)?.streamColor ?? "#D6B47E";
              return (
                <div key={stream}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-['Inter'] text-gray-400">{stream}</span>
                    <span className="text-xs font-['JetBrains_Mono']" style={{ color }}>{count}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Timeline */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: "580px" }}>
        {Object.entries(grouped).map(([date, points]) => (
          <div key={date} className="mb-6">
            {/* Date header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1" style={{ background: "rgba(184,138,60,0.1)" }} />
              <span className="text-xs font-['JetBrains_Mono'] text-gold-400/60 uppercase tracking-wider px-2">{date}</span>
              <div className="h-px flex-1" style={{ background: "rgba(184,138,60,0.1)" }} />
            </div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: "rgba(184,138,60,0.1)" }} />

              <div className="space-y-3">
                {points.map((point) => {
                  const color = getSubjectColor(point.subjectId);
                  const isExpanded = expandedPoint === point.id;
                  return (
                    <div key={point.id} className="flex items-start gap-4 relative">
                      {/* Icon */}
                      <div
                        className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 z-10 cursor-pointer"
                        style={{
                          background: `${point.streamColor}15`,
                          border: `2px solid ${point.riskFlag ? "#C94A5E" : point.streamColor}60`,
                          color: point.streamColor,
                        }}
                        onClick={() => setExpandedPoint(isExpanded ? null : point.id)}
                      >
                        <i className={`${point.streamIcon} text-sm`} />
                      </div>

                      {/* Content */}
                      <div
                        className="flex-1 rounded-xl p-3 cursor-pointer transition-all"
                        style={{
                          background: isExpanded ? "rgba(184,138,60,0.04)" : "rgba(255,255,255,0.02)",
                          border: `1px solid ${isExpanded ? "rgba(184,138,60,0.2)" : "rgba(255,255,255,0.06)"}`,
                        }}
                        onClick={() => setExpandedPoint(isExpanded ? null : point.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className="text-xs font-['Inter'] font-semibold" style={{ color: point.streamColor }}>{point.stream}</span>
                              <span className="text-white text-xs font-['Inter']">{point.eventType}</span>
                              {point.riskFlag && (
                                <span className="px-1.5 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] font-bold"
                                  style={{ background: "rgba(201,74,94,0.15)", color: "#C94A5E" }}>
                                  RISK
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-xs font-['Inter']">{point.location}</p>
                          </div>
                          <div className="text-right ml-3 flex-shrink-0">
                            <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{point.timestamp.split(" ")[1]}</p>
                            <div className="flex items-center gap-1 mt-0.5 justify-end">
                              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                              <span className="text-xs font-['Inter'] text-gray-600">{getSubjectName(point.subjectId).split(" ")[0]}</span>
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(184,138,60,0.1)" }}>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mb-0.5">Subject</p>
                                <p className="text-white text-xs font-['Inter']">{getSubjectName(point.subjectId)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mb-0.5">District</p>
                                <p className="text-white text-xs font-['Inter']">{point.district}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mb-0.5">Event Detail</p>
                                <p className="text-gray-300 text-xs font-['Inter']">{point.detail}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button className="px-3 py-1.5 rounded-lg text-xs font-['Inter'] cursor-pointer transition-all hover:opacity-80"
                                style={{ background: "rgba(184,138,60,0.12)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.25)" }}>
                                <i className="ri-map-pin-line mr-1" />View on Map
                              </button>
                              <button className="px-3 py-1.5 rounded-lg text-xs font-['Inter'] cursor-pointer transition-all hover:opacity-80"
                                style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.1)" }}>
                                <i className="ri-external-link-line mr-1" />Open Stream
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeointTimeline;
