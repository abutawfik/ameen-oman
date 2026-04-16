import { useState } from "react";
import { nearbyLocations, fieldOfficers, fieldAlerts, type NearbyLocation } from "@/mocks/mobileFieldData";

interface Props {
  isAr: boolean;
}

const priorityConfig = {
  critical: { color: "#F87171", label: "CRITICAL", labelAr: "حرج" },
  high:     { color: "#FB923C", label: "HIGH",     labelAr: "عالٍ" },
  medium:   { color: "#FACC15", label: "MEDIUM",   labelAr: "متوسط" },
  low:      { color: "#22D3EE", label: "LOW",      labelAr: "منخفض" },
};

const officerStatusColors: Record<string, string> = {
  "on-duty": "#4ADE80",
  "en-route": "#FACC15",
  "on-scene": "#FB923C",
  "off-duty": "#6B7280",
};

const FieldMap = ({ isAr }: Props) => {
  const [selectedLoc, setSelectedLoc] = useState<NearbyLocation | null>(null);
  const [mapLayer, setMapLayer] = useState<"alerts" | "officers" | "sectors">("alerts");
  const [showLegend, setShowLegend] = useState(false);

  const alertPins = [
    { id: "nl1", x: "42%", y: "38%", priority: "critical" as const },
    { id: "nl2", x: "58%", y: "55%", priority: "high" as const },
    { id: "nl3", x: "65%", y: "35%", priority: "medium" as const },
    { id: "nl4", x: "28%", y: "48%", priority: "critical" as const },
    { id: "nl5", x: "22%", y: "28%", priority: "high" as const },
  ];

  const officerPins = [
    { id: "off1", x: "50%", y: "52%", status: "on-duty" as const },
    { id: "off2", x: "44%", y: "60%", status: "en-route" as const },
    { id: "off3", x: "62%", y: "45%", status: "on-scene" as const },
    { id: "off4", x: "70%", y: "62%", status: "on-duty" as const },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Map controls */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center gap-1 p-1 rounded-xl flex-1"
          style={{ background: "rgba(10,22,40,0.9)", border: "1px solid rgba(34,211,238,0.15)" }}>
          {([
            { key: "alerts" as const, labelEn: "Alerts", labelAr: "التنبيهات" },
            { key: "officers" as const, labelEn: "Officers", labelAr: "الضباط" },
            { key: "sectors" as const, labelEn: "Sectors", labelAr: "القطاعات" },
          ]).map((l) => (
            <button key={l.key} onClick={() => setMapLayer(l.key)}
              className="flex-1 py-1.5 rounded-lg text-[10px] font-['Inter'] font-medium cursor-pointer transition-all"
              style={{
                background: mapLayer === l.key ? "rgba(34,211,238,0.12)" : "transparent",
                color: mapLayer === l.key ? "#22D3EE" : "#6B7280",
                border: mapLayer === l.key ? "1px solid rgba(34,211,238,0.25)" : "1px solid transparent",
              }}>
              {isAr ? l.labelAr : l.labelEn}
            </button>
          ))}
        </div>
        <button onClick={() => setShowLegend(!showLegend)}
          className="w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer"
          style={{ background: showLegend ? "rgba(34,211,238,0.15)" : "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.25)" }}>
          <i className="ri-information-line text-cyan-400 text-base" />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer"
          style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.25)" }}>
          <i className="ri-crosshair-2-line text-cyan-400 text-base" />
        </button>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mx-3 mb-2 p-3 rounded-xl"
          style={{ background: "rgba(10,22,40,0.95)", border: "1px solid rgba(34,211,238,0.15)" }}>
          <div className="grid grid-cols-2 gap-1.5">
            {mapLayer === "alerts" ? (
              Object.entries(priorityConfig).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: v.color }} />
                  <span className="text-gray-400 text-[9px] font-['JetBrains_Mono']">{isAr ? v.labelAr : v.label}</span>
                </div>
              ))
            ) : (
              Object.entries(officerStatusColors).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: v }} />
                  <span className="text-gray-400 text-[9px] font-['JetBrains_Mono'] capitalize">{k}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Map area */}
      <div className="mx-3 rounded-2xl overflow-hidden relative flex-shrink-0"
        style={{ height: "260px", border: "1px solid rgba(34,211,238,0.2)" }}>
        <img
          src="https://readdy.ai/api/search-image?query=dark%20satellite%20map%20of%20Muscat%20Oman%20city%20aerial%20view%2C%20dark%20navy%20tones%2C%20street%20grid%20visible%2C%20intelligence%20surveillance%20aesthetic%2C%20minimal%20labels&width=400&height=260&seq=field-map-main-v2&orientation=landscape"
          alt="Map" className="w-full h-full object-cover opacity-35" />

        {/* Grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs><pattern id="fm-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="#22D3EE" strokeWidth="0.4"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#fm-grid)"/>
        </svg>

        {/* Sector zones */}
        {mapLayer === "sectors" && (
          <>
            <div className="absolute rounded-xl opacity-20"
              style={{ left: "15%", top: "20%", width: "35%", height: "40%", background: "#22D3EE", border: "1px solid #22D3EE" }} />
            <div className="absolute rounded-xl opacity-20"
              style={{ left: "52%", top: "25%", width: "35%", height: "40%", background: "#4ADE80", border: "1px solid #4ADE80" }} />
            <div className="absolute text-[9px] font-bold font-['JetBrains_Mono'] text-cyan-400"
              style={{ left: "20%", top: "25%" }}>ALPHA</div>
            <div className="absolute text-[9px] font-bold font-['JetBrains_Mono'] text-green-400"
              style={{ left: "57%", top: "30%" }}>BRAVO</div>
          </>
        )}

        {/* Officer dot (you) */}
        <div className="absolute" style={{ left: "48%", top: "52%" }}>
          <div className="relative">
            <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center"
              style={{ boxShadow: "0 0 16px #22D3EE, 0 0 32px rgba(34,211,238,0.4)" }}>
              <i className="ri-user-fill text-[8px] text-black" />
            </div>
            <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-30" />
          </div>
        </div>

        {/* Alert pins */}
        {(mapLayer === "alerts" || mapLayer === "sectors") && alertPins.map((pin) => {
          const loc = nearbyLocations.find((l) => l.id === pin.id);
          const cfg = priorityConfig[pin.priority];
          return (
            <button key={pin.id} className="absolute cursor-pointer"
              style={{ left: pin.x, top: pin.y, transform: "translate(-50%, -50%)" }}
              onClick={() => setSelectedLoc(loc || null)}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: `${cfg.color}22`, border: `2px solid ${cfg.color}`, boxShadow: `0 0 8px ${cfg.color}66` }}>
                <i className="ri-alert-fill text-[8px]" style={{ color: cfg.color }} />
              </div>
            </button>
          );
        })}

        {/* Officer pins */}
        {mapLayer === "officers" && officerPins.map((pin, i) => {
          const officer = fieldOfficers[i];
          const color = officerStatusColors[pin.status];
          return (
            <div key={pin.id} className="absolute" style={{ left: pin.x, top: pin.y, transform: "translate(-50%, -50%)" }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: `${color}22`, border: `2px solid ${color}`, boxShadow: `0 0 6px ${color}66` }}>
                <i className="ri-shield-fill text-[8px]" style={{ color }} />
              </div>
              {officer && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1 py-0.5 rounded text-[8px] font-['JetBrains_Mono']"
                  style={{ background: "rgba(6,13,26,0.9)", color, border: `1px solid ${color}40` }}>
                  {officer.badge}
                </div>
              )}
            </div>
          );
        })}

        {/* Legend overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ background: "rgba(6,13,26,0.85)" }}>
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-cyan-400 text-[9px] font-['JetBrains_Mono']">{isAr ? "موقعك" : "You"}</span>
          </div>
        </div>

        {/* Stats overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <div className="px-2 py-1 rounded-lg text-[9px] font-['JetBrains_Mono']"
            style={{ background: "rgba(6,13,26,0.85)", color: "#F87171" }}>
            {fieldAlerts.filter(a => a.priority === "critical").length} CRITICAL
          </div>
          <div className="px-2 py-1 rounded-lg text-[9px] font-['JetBrains_Mono']"
            style={{ background: "rgba(6,13,26,0.85)", color: "#4ADE80" }}>
            {fieldOfficers.filter(o => o.status !== "off-duty").length} OFFICERS
          </div>
        </div>

        {/* Popup */}
        {selectedLoc && (
          <div className="absolute bottom-2 left-2 right-2 rounded-xl p-3"
            style={{ background: "rgba(10,22,40,0.97)", border: `1px solid ${priorityConfig[selectedLoc.alertLevel].color}44` }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold font-['Inter'] truncate">{isAr ? selectedLoc.nameAr : selectedLoc.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-['JetBrains_Mono'] uppercase"
                    style={{ color: priorityConfig[selectedLoc.alertLevel].color }}>
                    {isAr ? priorityConfig[selectedLoc.alertLevel].labelAr : priorityConfig[selectedLoc.alertLevel].label}
                  </span>
                  <span className="text-gray-500 text-[9px] font-['JetBrains_Mono']">
                    {selectedLoc.activeAlerts} {isAr ? "تنبيه" : "alerts"} · {selectedLoc.distance}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-['JetBrains_Mono'] cursor-pointer"
                  style={{ background: "rgba(34,211,238,0.1)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.25)" }}>
                  <i className="ri-navigation-line text-[10px]" />
                  {isAr ? "توجيه" : "Navigate"}
                </button>
                <button onClick={() => setSelectedLoc(null)} className="text-gray-600 cursor-pointer">
                  <i className="ri-close-line text-sm" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Location / Officer list */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-4" style={{ scrollbarWidth: "none" }}>
        {mapLayer === "officers" ? (
          <>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-['JetBrains_Mono'] mb-2">
              {isAr ? "الضباط في الميدان" : "Field Officers"}
            </p>
            <div className="space-y-2">
              {fieldOfficers.map((off) => (
                <div key={off.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{ background: "rgba(10,22,40,0.8)", border: `1px solid ${officerStatusColors[off.status]}22` }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${officerStatusColors[off.status]}15`, border: `1px solid ${officerStatusColors[off.status]}33` }}>
                    <i className="ri-shield-fill text-sm" style={{ color: officerStatusColors[off.status] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-['Inter'] font-semibold truncate">{off.name}</p>
                    <p className="text-gray-500 text-[9px] font-['JetBrains_Mono']">{off.badge} · Sector {off.sector}</p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-cyan-400 text-xs font-bold font-['JetBrains_Mono']">{off.distance}</span>
                    <span className="text-[9px] font-['JetBrains_Mono'] capitalize mt-0.5"
                      style={{ color: officerStatusColors[off.status] }}>{off.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-['JetBrains_Mono'] mb-2">
              {isAr ? "المواقع المُبلَّغة" : "Flagged Locations"}
            </p>
            <div className="space-y-2">
              {nearbyLocations.map((loc) => {
                const cfg = priorityConfig[loc.alertLevel];
                return (
                  <div key={loc.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer active:scale-[0.98] transition-transform"
                    style={{ background: "rgba(10,22,40,0.8)", border: `1px solid ${cfg.color}22` }}
                    onClick={() => setSelectedLoc(loc)}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}33` }}>
                      <i className="ri-map-pin-2-fill text-sm" style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-['Inter'] font-semibold truncate">{isAr ? loc.nameAr : loc.name}</p>
                      <p className="text-gray-500 text-[9px] font-['JetBrains_Mono']">{loc.type} · {loc.activeAlerts} {isAr ? "تنبيه" : "alert(s)"}</p>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="text-cyan-400 text-xs font-bold font-['JetBrains_Mono']">{loc.distance}</span>
                      <span className="text-[9px] font-['JetBrains_Mono'] uppercase mt-0.5" style={{ color: cfg.color }}>
                        {isAr ? cfg.labelAr : cfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FieldMap;
