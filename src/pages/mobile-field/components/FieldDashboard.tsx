import { useState, useEffect } from "react";
import { fieldAlerts, nearbyLocations, fieldOfficers, currentOfficer, type FieldAlert } from "@/mocks/mobileFieldData";

interface Props {
  isAr: boolean;
  onAlertTap: (alert: FieldAlert) => void;
  onSearch: () => void;
}

const priorityConfig = {
  critical: { color: "#F87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.4)", label: "CRITICAL", labelAr: "حرج" },
  high:     { color: "#FB923C", bg: "rgba(251,146,60,0.1)",   border: "rgba(251,146,60,0.35)",  label: "HIGH",     labelAr: "عالٍ" },
  medium:   { color: "#FACC15", bg: "rgba(250,204,21,0.1)",   border: "rgba(250,204,21,0.3)",   label: "MEDIUM",   labelAr: "متوسط" },
  low:      { color: "#D4A84B", bg: "rgba(181,142,60,0.06)",  border: "rgba(181,142,60,0.2)",   label: "LOW",      labelAr: "منخفض" },
};

const statusConfig = {
  "new":       { color: "#F87171", label: "NEW",      labelAr: "جديد" },
  "en-route":  { color: "#FACC15", label: "EN ROUTE", labelAr: "في الطريق" },
  "on-scene":  { color: "#FB923C", label: "ON SCENE", labelAr: "في الموقع" },
  "resolved":  { color: "#4ADE80", label: "RESOLVED", labelAr: "محلول" },
  "escalated": { color: "#F87171", label: "ESCALATED",labelAr: "مُصعَّد" },
};

const officerStatusColors: Record<string, string> = {
  "on-duty": "#4ADE80",
  "en-route": "#FACC15",
  "on-scene": "#FB923C",
  "off-duty": "#6B7280",
};

const FieldDashboard = ({ isAr, onAlertTap, onSearch }: Props) => {
  const [showSOS, setShowSOS] = useState(false);
  const [sosConfirmed, setSosConfirmed] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "critical" | "high" | "medium">("all");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const criticalCount = fieldAlerts.filter((a) => a.priority === "critical" && a.status === "new").length;
  const activeCount = fieldAlerts.filter((a) => a.status !== "resolved").length;
  const filteredAlerts = activeFilter === "all" ? fieldAlerts : fieldAlerts.filter(a => a.priority === activeFilter);

  const shiftProgress = () => {
    const now = time.getHours() * 60 + time.getMinutes();
    const start = 8 * 60;
    const end = 20 * 60;
    return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
  };

  const handleSOS = () => {
    setSosConfirmed(true);
    setTimeout(() => { setSosConfirmed(false); setShowSOS(false); }, 3000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>

      {/* Officer status bar */}
      <div className="mx-3 mt-3 rounded-2xl p-3"
        style={{ background: "rgba(20,29,46,0.9)", border: "1px solid rgba(181,142,60,0.2)" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(181,142,60,0.15)", border: "1.5px solid rgba(181,142,60,0.4)" }}>
              <i className="ri-shield-star-fill text-gold-400 text-sm" />
            </div>
            <div>
              <p className="text-white text-xs font-bold font-['Inter']">
                {isAr ? currentOfficer.nameAr : currentOfficer.name}
              </p>
              <p className="text-gray-500 text-[10px] font-['JetBrains_Mono']">
                {currentOfficer.badge} · {currentOfficer.rank} · Sector {currentOfficer.sector}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setShowTeam(!showTeam)}
              className="w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer"
              style={{ background: showTeam ? "rgba(181,142,60,0.15)" : "rgba(255,255,255,0.05)", border: "1px solid rgba(181,142,60,0.2)" }}>
              <i className="ri-team-line text-gold-400 text-sm" />
            </button>
            <button onClick={() => setShowSOS(true)}
              className="w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer"
              style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.4)" }}>
              <i className="ri-alarm-warning-fill text-red-400 text-sm" />
            </button>
          </div>
        </div>
        {/* Shift progress */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-[9px] font-['JetBrains_Mono']">{currentOfficer.shiftStart}</span>
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full" style={{ width: `${shiftProgress()}%`, background: "linear-gradient(90deg, #D4A84B, #4ADE80)" }} />
          </div>
          <span className="text-gray-600 text-[9px] font-['JetBrains_Mono']">{currentOfficer.shiftEnd}</span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-gray-500 text-[9px] font-['JetBrains_Mono']">
            <span className="text-gold-400">{currentOfficer.reportsToday}</span> reports today
          </span>
          <span className="text-gray-500 text-[9px] font-['JetBrains_Mono']">
            <span className="text-orange-400">{currentOfficer.alertsHandled}</span> alerts handled
          </span>
        </div>
      </div>

      {/* Team panel */}
      {showTeam && (
        <div className="mx-3 mt-2 rounded-2xl p-3"
          style={{ background: "rgba(20,29,46,0.9)", border: "1px solid rgba(181,142,60,0.15)" }}>
          <p className="text-gray-500 text-[9px] uppercase tracking-wider font-['JetBrains_Mono'] mb-2">
            {isAr ? "فريق القطاع" : "Sector Team"}
          </p>
          <div className="space-y-1.5">
            {fieldOfficers.map(off => (
              <div key={off.id} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: officerStatusColors[off.status] }} />
                <span className="text-white text-[10px] font-['Inter'] flex-1 truncate">{off.name}</span>
                <span className="text-gray-500 text-[9px] font-['JetBrains_Mono']">{off.distance}</span>
                <span className="text-[9px] font-['JetBrains_Mono'] capitalize"
                  style={{ color: officerStatusColors[off.status] }}>{off.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Alerts Hero */}
      <div className="mx-3 mt-3 rounded-2xl p-4 relative overflow-hidden"
        style={{ background: "rgba(248,113,113,0.1)", border: "2px solid rgba(248,113,113,0.4)" }}>
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%"><defs><pattern id="fd-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F87171" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#fd-grid)"/></svg>
        </div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-red-300 text-xs font-['JetBrains_Mono'] uppercase tracking-widest mb-1">
              {isAr ? "تنبيهات نشطة" : "Active Alerts"}
            </p>
            <div className="flex items-end gap-2">
              <span className="text-red-400 font-black font-['JetBrains_Mono']" style={{ fontSize: "48px", lineHeight: 1 }}>{activeCount}</span>
              <div className="mb-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">{criticalCount} {isAr ? "حرج" : "CRITICAL"}</span>
                </div>
                <p className="text-red-300/60 text-[10px] font-['JetBrains_Mono']">{isAr ? "يتطلب استجابة فورية" : "Requires immediate response"}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(248,113,113,0.15)", border: "2px solid rgba(248,113,113,0.5)" }}>
              <i className="ri-alarm-warning-fill text-red-400 text-xl" />
            </div>
            <div className="flex gap-1">
              {(["critical","high","medium"] as const).map(p => (
                <div key={p} className="text-center">
                  <p className="text-xs font-black font-['JetBrains_Mono']" style={{ color: priorityConfig[p].color }}>
                    {fieldAlerts.filter(a => a.priority === p).length}
                  </p>
                  <p className="text-[8px] font-['JetBrains_Mono'] text-gray-600">{p.slice(0,3).toUpperCase()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Search */}
      <div className="mx-3 mt-3">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer"
          style={{ background: "rgba(20,29,46,0.9)", border: "1.5px solid rgba(181,142,60,0.35)" }}
          onClick={onSearch}>
          <i className="ri-search-line text-gold-400 text-lg flex-shrink-0" />
          <span className="text-gray-500 text-sm font-['Inter']">
            {isAr ? "بحث: مستند، اسم، هاتف..." : "Search: document, name, phone..."}
          </span>
          <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
            <div className="w-7 h-7 flex items-center justify-center rounded-xl"
              style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.25)" }}>
              <i className="ri-camera-line text-gold-400 text-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mx-3 mt-3 flex gap-1">
        {(["all","critical","high","medium"] as const).map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className="flex-1 py-1.5 rounded-xl text-[10px] font-bold font-['JetBrains_Mono'] uppercase cursor-pointer transition-all"
            style={{
              background: activeFilter === f ? (f === "all" ? "rgba(181,142,60,0.15)" : priorityConfig[f as keyof typeof priorityConfig]?.bg || "rgba(181,142,60,0.15)") : "rgba(20,29,46,0.6)",
              color: activeFilter === f ? (f === "all" ? "#D4A84B" : priorityConfig[f as keyof typeof priorityConfig]?.color || "#D4A84B") : "#4B5563",
              border: `1px solid ${activeFilter === f ? (f === "all" ? "rgba(181,142,60,0.3)" : priorityConfig[f as keyof typeof priorityConfig]?.border || "rgba(181,142,60,0.3)") : "rgba(255,255,255,0.05)"}`,
            }}>
            {f === "all" ? (isAr ? "الكل" : "All") : f.slice(0,3)}
          </button>
        ))}
      </div>

      {/* Nearby Flagged Locations */}
      <div className="mx-3 mt-3">
        <div className="flex items-center gap-2 mb-2">
          <i className="ri-map-pin-2-fill text-gold-400 text-sm" />
          <p className="text-white text-xs font-bold font-['Inter'] uppercase tracking-wider">
            {isAr ? "المواقع القريبة" : "Nearby Flagged"}
          </p>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse ml-1" />
          <span className="text-green-400 text-[10px] font-['JetBrains_Mono']">GPS</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {nearbyLocations.map((loc) => {
            const cfg = priorityConfig[loc.alertLevel];
            return (
              <div key={loc.id} className="flex-shrink-0 px-3 py-2 rounded-xl cursor-pointer"
                style={{ background: "rgba(20,29,46,0.8)", border: `1px solid ${cfg.border}`, minWidth: "130px" }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                  <span className="text-white text-[10px] font-['Inter'] font-semibold truncate">{isAr ? loc.nameAr : loc.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-[9px] font-['JetBrains_Mono']">{loc.activeAlerts} alerts</span>
                  <span className="text-gold-400 text-[9px] font-bold font-['JetBrains_Mono']">{loc.distance}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Alerts Feed */}
      <div className="mx-3 mt-3 mb-4">
        <p className="text-white text-xs font-bold font-['Inter'] uppercase tracking-wider mb-2">
          {isAr ? "آخر التنبيهات" : "Recent Alerts"}
        </p>
        <div className="space-y-2">
          {filteredAlerts.map((alert) => {
            const cfg = priorityConfig[alert.priority];
            const sCfg = statusConfig[alert.status];
            return (
              <div key={alert.id}
                className="flex items-start gap-3 px-3 py-3 rounded-xl cursor-pointer active:scale-[0.98] transition-transform"
                style={{ background: "rgba(20,29,46,0.8)", borderLeft: `3px solid ${cfg.color}`, border: `1px solid rgba(255,255,255,0.06)`, borderLeftWidth: "3px" }}
                onClick={() => onAlertTap(alert)}>
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ border: `1.5px solid ${cfg.color}44` }}>
                  <img src={alert.photo} alt="" className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <span className="text-[9px] font-bold font-['JetBrains_Mono'] uppercase px-1.5 py-0.5 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                      {isAr ? cfg.labelAr : cfg.label}
                    </span>
                    <span className="text-[9px] font-['JetBrains_Mono'] uppercase" style={{ color: sCfg.color }}>
                      {isAr ? sCfg.labelAr : sCfg.label}
                    </span>
                  </div>
                  <p className="text-white text-xs font-['Inter'] font-semibold leading-snug truncate">
                    {isAr ? alert.ruleNameAr : alert.ruleName}
                  </p>
                  <p className="text-gray-500 text-[10px] font-['Inter'] truncate">
                    {alert.personName} · {isAr ? alert.locationAr : alert.location}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{alert.time}</span>
                    <span className="text-gold-400 text-[10px] font-['JetBrains_Mono']">{alert.distance}</span>
                    {alert.assignedOfficer !== "Unassigned" && (
                      <span className="text-green-400 text-[9px] font-['JetBrains_Mono'] truncate">
                        <i className="ri-user-line mr-0.5" />{alert.assignedOfficer}
                      </span>
                    )}
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-gray-600 text-lg flex-shrink-0 mt-1" />
              </div>
            );
          })}
        </div>
      </div>

      {/* SOS Modal */}
      {showSOS && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(11,18,32,0.95)" }}>
          <div className="w-full rounded-3xl p-6 text-center"
            style={{ background: "rgba(20,29,46,0.98)", border: "2px solid rgba(248,113,113,0.5)" }}>
            {sosConfirmed ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(248,113,113,0.2)", border: "2px solid #F87171" }}>
                  <i className="ri-check-line text-red-400 text-3xl" />
                </div>
                <p className="text-red-400 font-black font-['Inter'] text-lg">SOS SENT</p>
                <p className="text-gray-400 text-sm font-['Inter']">Command Center notified. Backup dispatched.</p>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono']">GPS: 23.5957, 58.3932</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"
                  style={{ background: "rgba(248,113,113,0.2)", border: "2px solid #F87171" }}>
                  <i className="ri-alarm-warning-fill text-red-400 text-3xl" />
                </div>
                <p className="text-white font-black font-['Inter'] text-lg mb-1">
                  {isAr ? "إرسال نداء استغاثة؟" : "Send SOS Alert?"}
                </p>
                <p className="text-gray-400 text-sm font-['Inter'] mb-5">
                  {isAr ? "سيتم إخطار مركز القيادة وإرسال دعم فوري" : "Command Center will be notified and backup dispatched immediately"}
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setShowSOS(false)}
                    className="flex-1 py-3 rounded-2xl text-sm font-bold font-['Inter'] cursor-pointer"
                    style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#6B7280" }}>
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                  <button onClick={handleSOS}
                    className="flex-1 py-3 rounded-2xl text-sm font-black font-['Inter'] cursor-pointer"
                    style={{ background: "#F87171", color: "#0B1220" }}>
                    {isAr ? "إرسال SOS" : "SEND SOS"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldDashboard;
