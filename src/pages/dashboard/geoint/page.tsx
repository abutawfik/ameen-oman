import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MovementTrailMap from "./components/MovementTrailMap";
import HotspotClustering from "./components/HotspotClustering";
import CrossStreamLocationCorrelation from "./components/CrossStreamLocationCorrelation";
import GeointTimeline from "./components/GeointTimeline";
import { geointKpis, geoSubjects, geoAlerts } from "@/mocks/geointData";

type Tab = "movement" | "hotspots" | "correlations" | "timeline";

const tabs: { key: Tab; label: string; icon: string; desc: string }[] = [
  { key: "movement",     label: "Movement Trails",       icon: "ri-route-line",          desc: "Subject movement visualization" },
  { key: "hotspots",     label: "Hotspot Clustering",    icon: "ri-focus-3-line",         desc: "Activity density & clusters" },
  { key: "correlations", label: "Cross-Stream Correlation", icon: "ri-git-branch-line",  desc: "Location-based stream links" },
  { key: "timeline",     label: "Geo Timeline",          icon: "ri-time-line",            desc: "Chronological event log" },
];

const kpiCards = [
  { label: "Active Subjects", value: geointKpis.activeSubjects, icon: "ri-user-location-line", color: "#D4A84B", delta: "+3 today" },
  { label: "Hotspot Clusters", value: geointKpis.hotspotCount, icon: "ri-focus-3-line", color: "#FB923C", delta: "2 critical" },
  { label: "Cross-Stream Alerts", value: geointKpis.crossStreamAlerts, icon: "ri-git-branch-line", color: "#F87171", delta: "+5 new" },
  { label: "Geofence Breaches", value: geointKpis.geofenceBreaches, icon: "ri-map-pin-range-line", color: "#FACC15", delta: "Active" },
  { label: "Movement Events", value: geointKpis.movementEventsToday.toLocaleString(), icon: "ri-pulse-line", color: "#4ADE80", delta: "Today" },
  { label: "Correlations Found", value: geointKpis.correlationsDetected, icon: "ri-links-line", color: "#A78BFA", delta: "Live" },
];

const GeointPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("movement");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [liveTime, setLiveTime] = useState(new Date());
  const [showSubjectPanel, setShowSubjectPanel] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const newAlerts = geoAlerts.filter((a) => a.status === "new").length;

  return (
    <div className="flex flex-col h-full" style={{ background: "#060E1A", fontFamily: "Inter, sans-serif" }}>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page header */}
        <div className="flex-shrink-0 px-6 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(181,142,60,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl"
                style={{ background: "rgba(181,142,60,0.12)", border: "1px solid rgba(181,142,60,0.25)" }}>
                <i className="ri-earth-line text-gold-400 text-lg" />
              </div>
              <div>
                <h1 className="text-white font-['Inter'] font-bold text-lg">Geospatial Intelligence</h1>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono']">GEOINT — Map-based subject tracking & location correlation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Live clock */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(181,142,60,0.06)", border: "1px solid rgba(181,142,60,0.15)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-gold-400 text-xs font-['JetBrains_Mono']">
                  {liveTime.toLocaleTimeString("en-GB")} — LIVE
                </span>
              </div>
              {/* Alert badge */}
              {newAlerts > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer"
                  style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)" }}
                  onClick={() => setActiveTab("correlations")}>
                  <i className="ri-alarm-warning-line text-red-400 text-sm" />
                  <span className="text-red-400 text-xs font-['JetBrains_Mono'] font-bold">{newAlerts} NEW ALERTS</span>
                </div>
              )}
              <button
                onClick={() => setShowSubjectPanel((v) => !v)}
                className="px-3 py-1.5 rounded-lg text-xs font-['Inter'] cursor-pointer transition-all hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.1)" }}>
                <i className={`${showSubjectPanel ? "ri-layout-right-2-line" : "ri-layout-right-line"} mr-1.5`} />
                {showSubjectPanel ? "Hide" : "Show"} Subjects
              </button>
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-6 gap-3 mb-4">
            {kpiCards.map((kpi) => (
              <div key={kpi.label} className="rounded-xl p-3" style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ background: `${kpi.color}15`, color: kpi.color }}>
                    <i className={`${kpi.icon} text-xs`} />
                  </div>
                  <span className="text-gray-500 text-xs font-['JetBrains_Mono'] truncate">{kpi.label}</span>
                </div>
                <p className="text-white text-xl font-['JetBrains_Mono'] font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-0.5">{kpi.delta}</p>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-['Inter'] font-medium transition-all cursor-pointer whitespace-nowrap"
                style={activeTab === tab.key ? {
                  background: "rgba(181,142,60,0.12)",
                  color: "#D4A84B",
                  border: "1px solid rgba(181,142,60,0.3)",
                } : {
                  background: "rgba(255,255,255,0.03)",
                  color: "#6B7280",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <i className={`${tab.icon} text-sm`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden flex gap-0">
          {/* Content area */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === "movement" && (
              <MovementTrailMap
                selectedSubjectId={selectedSubjectId}
                onSelectSubject={setSelectedSubjectId}
              />
            )}
            {activeTab === "hotspots" && <HotspotClustering />}
            {activeTab === "correlations" && <CrossStreamLocationCorrelation />}
            {activeTab === "timeline" && <GeointTimeline />}
          </div>

          {/* Subject panel */}
          {showSubjectPanel && (
            <div className="w-64 flex-shrink-0 overflow-y-auto p-4 border-l" style={{ borderColor: "rgba(181,142,60,0.08)", background: "#080F1C" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-xs font-['JetBrains_Mono'] uppercase tracking-wider">Tracked Subjects</p>
                <span className="text-xs font-['JetBrains_Mono'] text-gold-400">{geoSubjects.length}</span>
              </div>
              <div className="space-y-2">
                {geoSubjects.map((subject, i) => {
                  const subjectColors = ["#D4A84B", "#F87171", "#A78BFA", "#4ADE80", "#FB923C"];
                  const color = subjectColors[i % subjectColors.length];
                  const isSelected = selectedSubjectId === subject.id;
                  return (
                    <button
                      key={subject.id}
                      onClick={() => {
                        setSelectedSubjectId(isSelected ? null : subject.id);
                        if (activeTab !== "movement") setActiveTab("movement");
                      }}
                      className="w-full text-left rounded-xl p-3 transition-all cursor-pointer"
                      style={{
                        background: isSelected ? `${color}10` : "rgba(255,255,255,0.02)",
                        border: `1px solid ${isSelected ? `${color}40` : "rgba(255,255,255,0.06)"}`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ border: `2px solid ${color}60` }}>
                          <img src={subject.photo} alt={subject.name} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-xs font-['Inter'] font-semibold truncate">{subject.name}</p>
                          <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{subject.nationality}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-['JetBrains_Mono'] font-bold px-1.5 py-0.5 rounded-full"
                          style={{
                            background: subject.riskLevel === "critical" ? "rgba(248,113,113,0.15)" : subject.riskLevel === "high" ? "rgba(251,146,60,0.15)" : "rgba(250,204,21,0.15)",
                            color: subject.riskLevel === "critical" ? "#F87171" : subject.riskLevel === "high" ? "#FB923C" : "#FACC15",
                          }}>
                          {subject.riskLevel.toUpperCase()}
                        </span>
                        <span className="text-xs font-['JetBrains_Mono'] font-bold" style={{ color }}>
                          {subject.riskScore}
                        </span>
                      </div>
                      <div className="text-xs font-['JetBrains_Mono'] text-gray-600 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <i className="ri-map-pin-line text-xs" />
                          <span className="truncate">{subject.lastLocation}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <i className="ri-time-line text-xs" />
                          <span>{subject.lastSeen}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <i className="ri-git-branch-line text-xs" />
                          <span>{subject.streamCount} streams</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick actions */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
                <p className="text-gray-600 text-xs font-['JetBrains_Mono'] uppercase tracking-wider mb-2">Quick Actions</p>
                <div className="space-y-1.5">
                  {[
                    { label: "Add Subject", icon: "ri-user-add-line", color: "#D4A84B" },
                    { label: "Set Geofence", icon: "ri-map-pin-range-line", color: "#4ADE80" },
                    { label: "Export Report", icon: "ri-download-line", color: "#A78BFA" },
                    { label: "Person 360°", icon: "ri-user-search-line", color: "#FB923C", action: () => navigate("/dashboard/person-360") },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={action.action}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-['Inter'] cursor-pointer transition-all hover:opacity-80"
                      style={{ background: `${action.color}10`, color: action.color, border: `1px solid ${action.color}20` }}>
                      <i className={`${action.icon} text-sm`} />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeointPage;
