import { useState } from "react";
import { crossStreamCorrelations, geoAlerts, type CrossStreamCorrelationEvent, type GeoAlert } from "@/mocks/geointData";

const statusConfig = {
  open:          { color: "#F87171", bg: "rgba(248,113,113,0.12)", label: "OPEN" },
  investigating: { color: "#FACC15", bg: "rgba(250,204,21,0.12)",  label: "INVESTIGATING" },
  resolved:      { color: "#4ADE80", bg: "rgba(74,222,128,0.12)",  label: "RESOLVED" },
};

const alertTypeConfig = {
  geofence_breach:   { icon: "ri-map-pin-range-line", color: "#F87171", label: "Geofence Breach" },
  cluster_spike:     { icon: "ri-group-line",          color: "#FB923C", label: "Cluster Spike" },
  cross_stream:      { icon: "ri-git-branch-line",     color: "#FACC15", label: "Cross-Stream" },
  movement_anomaly:  { icon: "ri-route-line",          color: "#A78BFA", label: "Movement Anomaly" },
  border_proximity:  { icon: "ri-passport-line",       color: "#60A5FA", label: "Border Proximity" },
};

const severityConfig = {
  critical: { color: "#F87171", bg: "rgba(248,113,113,0.12)" },
  high:     { color: "#FB923C", bg: "rgba(251,146,60,0.12)" },
  medium:   { color: "#FACC15", bg: "rgba(250,204,21,0.12)" },
};

const CrossStreamLocationCorrelation = () => {
  const [selectedCorrelation, setSelectedCorrelation] = useState<CrossStreamCorrelationEvent | null>(crossStreamCorrelations[0]);
  const [activeTab, setActiveTab] = useState<"correlations" | "alerts">("correlations");
  const [alertFilter, setAlertFilter] = useState<string>("all");

  const filteredAlerts = alertFilter === "all"
    ? geoAlerts
    : geoAlerts.filter((a) => a.status === alertFilter);

  return (
    <div className="flex gap-4 h-full">
      {/* Left: List */}
      <div className="w-80 flex flex-col flex-shrink-0">
        {/* Tab switcher */}
        <div className="flex rounded-lg p-1 mb-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {(["correlations", "alerts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-1.5 rounded-md text-xs font-['Inter'] font-medium transition-all cursor-pointer whitespace-nowrap"
              style={activeTab === tab ? {
                background: "rgba(181,142,60,0.15)",
                color: "#D4A84B",
                border: "1px solid rgba(181,142,60,0.3)",
              } : { color: "#6B7280" }}
            >
              {tab === "correlations" ? (
                <><i className="ri-git-branch-line mr-1" />Correlations ({crossStreamCorrelations.length})</>
              ) : (
                <><i className="ri-alarm-warning-line mr-1" />Geo Alerts ({geoAlerts.length})</>
              )}
            </button>
          ))}
        </div>

        {activeTab === "correlations" ? (
          <div className="space-y-2 overflow-y-auto flex-1" style={{ maxHeight: "520px" }}>
            {crossStreamCorrelations.map((corr) => {
              const sCfg = statusConfig[corr.status];
              const isSelected = selectedCorrelation?.id === corr.id;
              return (
                <button
                  key={corr.id}
                  onClick={() => setSelectedCorrelation(isSelected ? null : corr)}
                  className="w-full text-left rounded-xl p-3 transition-all cursor-pointer"
                  style={{
                    background: isSelected ? "rgba(181,142,60,0.06)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isSelected ? "rgba(181,142,60,0.25)" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white text-xs font-['Inter'] font-semibold">{corr.subjectName}</p>
                      <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{corr.location}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-['JetBrains_Mono'] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: sCfg.bg, color: sCfg.color }}>
                        {sCfg.label}
                      </span>
                      <span className="text-xs font-['JetBrains_Mono'] font-bold" style={{ color: corr.riskScore >= 80 ? "#F87171" : corr.riskScore >= 60 ? "#FB923C" : "#FACC15" }}>
                        {corr.riskScore}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-['Inter'] mb-2" style={{ color: "#D4A84B" }}>{corr.correlationType}</p>
                  <div className="flex flex-wrap gap-1">
                    {corr.streams.map((s) => (
                      <span key={s.name} className="w-5 h-5 flex items-center justify-center rounded-full text-xs"
                        style={{ background: `${s.color}20`, color: s.color }}>
                        <i className={s.icon} style={{ fontSize: "10px" }} />
                      </span>
                    ))}
                    <span className="text-gray-600 text-xs ml-1 self-center">{corr.streams.length} streams</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            <div className="flex gap-1 mb-2 flex-wrap">
              {["all", "new", "acknowledged", "resolved"].map((f) => (
                <button
                  key={f}
                  onClick={() => setAlertFilter(f)}
                  className={`px-2 py-0.5 rounded-full text-xs font-['Inter'] cursor-pointer transition-all whitespace-nowrap ${
                    alertFilter === f ? "bg-gold-400/20 text-gold-400 border border-gold-400/30" : "text-gray-500 border border-white/10 hover:border-white/20"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="space-y-2 overflow-y-auto flex-1" style={{ maxHeight: "480px" }}>
              {filteredAlerts.map((alert) => {
                const typeCfg = alertTypeConfig[alert.type];
                const sevCfg = severityConfig[alert.severity];
                return (
                  <div key={alert.id} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${sevCfg.bg}` }}>
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ background: `${typeCfg.color}15`, color: typeCfg.color }}>
                        <i className={`${typeCfg.icon} text-sm`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-['Inter'] font-medium" style={{ color: typeCfg.color }}>{typeCfg.label}</span>
                          <span className="text-xs font-['JetBrains_Mono'] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: sevCfg.bg, color: sevCfg.color }}>
                            {alert.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-white text-xs font-['Inter'] mt-0.5">{alert.subject}</p>
                        <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{alert.location}</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs font-['Inter'] mb-2">{alert.detail}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{alert.timestamp}</span>
                      <span className="text-xs font-['JetBrains_Mono'] px-2 py-0.5 rounded-full"
                        style={{
                          background: alert.status === "new" ? "rgba(248,113,113,0.12)" : alert.status === "acknowledged" ? "rgba(250,204,21,0.12)" : "rgba(74,222,128,0.12)",
                          color: alert.status === "new" ? "#F87171" : alert.status === "acknowledged" ? "#FACC15" : "#4ADE80",
                        }}>
                        {alert.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right: Correlation detail */}
      <div className="flex-1">
        {selectedCorrelation ? (
          <div className="h-full flex flex-col gap-4">
            {/* Header */}
            <div className="rounded-xl p-4" style={{ background: "#0D1B2E", border: "1px solid rgba(181,142,60,0.15)" }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-git-branch-line text-gold-400" />
                    <span className="text-gold-400 text-xs font-['JetBrains_Mono'] uppercase tracking-wider">Cross-Stream Correlation</span>
                  </div>
                  <h3 className="text-white font-['Inter'] font-bold text-base">{selectedCorrelation.subjectName}</h3>
                  <p className="text-gray-400 text-sm font-['Inter']">{selectedCorrelation.correlationType}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-['JetBrains_Mono'] font-bold mb-1"
                    style={{ color: selectedCorrelation.riskScore >= 80 ? "#F87171" : selectedCorrelation.riskScore >= 60 ? "#FB923C" : "#FACC15" }}>
                    {selectedCorrelation.riskScore}
                  </div>
                  <p className="text-gray-500 text-xs font-['JetBrains_Mono']">Risk Score</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-['JetBrains_Mono'] text-gray-500">
                <span><i className="ri-map-pin-line mr-1" />{selectedCorrelation.location}</span>
                <span><i className="ri-time-line mr-1" />{selectedCorrelation.timestamp}</span>
                <span className="ml-auto px-2 py-0.5 rounded-full font-bold"
                  style={{ background: statusConfig[selectedCorrelation.status].bg, color: statusConfig[selectedCorrelation.status].color }}>
                  {statusConfig[selectedCorrelation.status].label}
                </span>
              </div>
            </div>

            {/* Stream timeline */}
            <div className="rounded-xl p-4 flex-1" style={{ background: "#0D1B2E", border: "1px solid rgba(181,142,60,0.1)" }}>
              <p className="text-gray-400 text-xs font-['JetBrains_Mono'] uppercase tracking-wider mb-4">Stream Event Timeline</p>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: "rgba(181,142,60,0.15)" }} />
                <div className="space-y-4">
                  {selectedCorrelation.streams.map((stream, i) => (
                    <div key={i} className="flex items-start gap-4 relative">
                      {/* Icon */}
                      <div className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 z-10"
                        style={{ background: `${stream.color}20`, border: `2px solid ${stream.color}60`, color: stream.color }}>
                        <i className={`${stream.icon} text-sm`} />
                      </div>
                      {/* Content */}
                      <div className="flex-1 rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-['Inter'] font-semibold" style={{ color: stream.color }}>{stream.name} Stream</span>
                          <span className="text-xs font-['JetBrains_Mono'] text-gray-500">{stream.time}</span>
                        </div>
                        <p className="text-white text-xs font-['Inter']">{stream.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-lg text-xs font-['Inter'] font-semibold cursor-pointer transition-all hover:opacity-80"
                style={{ background: "rgba(181,142,60,0.15)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.3)" }}>
                <i className="ri-user-search-line mr-1.5" />Open Person 360°
              </button>
              <button className="flex-1 py-2.5 rounded-lg text-xs font-['Inter'] font-semibold cursor-pointer transition-all hover:opacity-80"
                style={{ background: "rgba(248,113,113,0.12)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)" }}>
                <i className="ri-alarm-warning-line mr-1.5" />Escalate
              </button>
              <button className="flex-1 py-2.5 rounded-lg text-xs font-['Inter'] font-semibold cursor-pointer transition-all hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.1)" }}>
                <i className="ri-file-shield-2-line mr-1.5" />Generate Dossier
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center rounded-xl" style={{ background: "#0D1B2E", border: "1px solid rgba(181,142,60,0.08)" }}>
            <div className="text-center">
              <i className="ri-git-branch-line text-4xl text-gray-700 mb-3 block" />
              <p className="text-gray-500 text-sm font-['Inter']">Select a correlation to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrossStreamLocationCorrelation;
