import { useState, useEffect } from "react";
import { policeAlerts, type PoliceAlert, type NotifPriority } from "@/mocks/notificationsData";

interface Props {
  isAr: boolean;
}

const priorityConfig: Record<NotifPriority, { label: string; labelAr: string; color: string; bg: string; border: string; icon: string }> = {
  critical: { label: "CRITICAL", labelAr: "حرج",    color: "#F87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.35)", icon: "ri-alarm-warning-fill" },
  high:     { label: "HIGH",     labelAr: "عالٍ",   color: "#FB923C", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.35)",  icon: "ri-error-warning-fill" },
  medium:   { label: "MEDIUM",   labelAr: "متوسط",  color: "#FACC15", bg: "rgba(250,204,21,0.08)",  border: "rgba(250,204,21,0.35)",  icon: "ri-information-fill" },
  low:      { label: "LOW",      labelAr: "منخفض",  color: "#D4A84B", bg: "rgba(181,142,60,0.05)",  border: "rgba(181,142,60,0.2)",   icon: "ri-notification-3-fill" },
};

const PoliceAlertCenter = ({ isAr }: Props) => {
  const [alerts, setAlerts] = useState<PoliceAlert[]>(policeAlerts);
  const [filterPriority, setFilterPriority] = useState<NotifPriority | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 800);
    return () => clearInterval(interval);
  }, []);

  const filtered = filterPriority === "all" ? alerts : alerts.filter((a) => a.priority === filterPriority);
  const criticalCount = alerts.filter((a) => a.priority === "critical" && !a.acknowledged).length;
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  const acknowledge = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const acknowledgeAll = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
  };

  const priorityFilters: { key: NotifPriority | "all"; labelEn: string; labelAr: string }[] = [
    { key: "all",      labelEn: "All",      labelAr: "الكل" },
    { key: "critical", labelEn: "Critical", labelAr: "حرج" },
    { key: "high",     labelEn: "High",     labelAr: "عالٍ" },
    { key: "medium",   labelEn: "Medium",   labelAr: "متوسط" },
    { key: "low",      labelEn: "Low",      labelAr: "منخفض" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b flex-shrink-0" style={{ borderColor: "rgba(181,142,60,0.12)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
              style={{ background: criticalCount > 0 ? "rgba(248,113,113,0.15)" : "rgba(181,142,60,0.1)", border: `1px solid ${criticalCount > 0 ? "rgba(248,113,113,0.4)" : "rgba(181,142,60,0.3)"}` }}
            >
              <i className="ri-alarm-warning-line text-sm" style={{ color: criticalCount > 0 ? "#F87171" : "#D4A84B" }} />
            </div>
            <div>
              <h2 className="text-white text-sm font-bold font-['Inter']">{isAr ? "مركز تنبيهات الشرطة" : "Police Alert Center"}</h2>
              <p className="text-gray-500 text-xs font-['JetBrains_Mono']">
                {unacknowledgedCount} {isAr ? "غير مؤكد" : "unacknowledged"}
              </p>
            </div>
          </div>
          {unacknowledgedCount > 0 && (
            <button
              onClick={acknowledgeAll}
              className="text-xs px-3 py-1.5 rounded-lg cursor-pointer font-['JetBrains_Mono'] whitespace-nowrap"
              style={{ color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)", background: "rgba(181,142,60,0.05)" }}
            >
              {isAr ? "تأكيد الكل" : "Ack All"}
            </button>
          )}
        </div>

        {/* Priority summary pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["critical", "high", "medium", "low"] as NotifPriority[]).map((p) => {
            const count = alerts.filter((a) => a.priority === p && !a.acknowledged).length;
            const cfg = priorityConfig[p];
            if (count === 0) return null;
            return (
              <div
                key={p}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full"
                style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
              >
                {p === "critical" && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color, opacity: pulse ? 1 : 0.3, transition: "opacity 0.4s" }} />
                )}
                <span className="text-[10px] font-bold font-['JetBrains_Mono'] uppercase" style={{ color: cfg.color }}>
                  {count} {isAr ? cfg.labelAr : cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority filter tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b flex-shrink-0" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
        {priorityFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterPriority(f.key)}
            className="px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: filterPriority === f.key
                ? f.key === "all" ? "rgba(181,142,60,0.1)" : `${priorityConfig[f.key as NotifPriority]?.bg}`
                : "transparent",
              color: filterPriority === f.key
                ? f.key === "all" ? "#D4A84B" : priorityConfig[f.key as NotifPriority]?.color
                : "#6B7280",
              border: filterPriority === f.key
                ? f.key === "all" ? "1px solid rgba(181,142,60,0.2)" : `1px solid ${priorityConfig[f.key as NotifPriority]?.border}`
                : "1px solid transparent",
            }}
          >
            {isAr ? f.labelAr : f.labelEn}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(181,142,60,0.15) transparent" }}>
        {filtered.map((alert) => {
          const cfg = priorityConfig[alert.priority];
          const isExpanded = expandedId === alert.id;
          const isCritical = alert.priority === "critical";

          return (
            <div
              key={alert.id}
              className="border-b"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="flex items-start gap-3 px-5 py-4 cursor-pointer transition-all hover:bg-white/[0.02]"
                style={{
                  background: alert.acknowledged ? "transparent" : cfg.bg,
                  borderLeft: `3px solid ${alert.acknowledged ? "transparent" : cfg.color}`,
                }}
                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
              >
                {/* Priority icon */}
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
                  style={{
                    background: `${cfg.color}18`,
                    border: `1px solid ${cfg.color}44`,
                    boxShadow: isCritical && !alert.acknowledged ? `0 0 10px ${cfg.color}44` : "none",
                  }}
                >
                  <i className={`${cfg.icon} text-sm`} style={{ color: cfg.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold font-['JetBrains_Mono'] uppercase tracking-wider"
                        style={{ background: `${cfg.color}18`, color: cfg.color, border: `1px solid ${cfg.color}33` }}
                      >
                        {isAr ? cfg.labelAr : cfg.label}
                      </span>
                      <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{alert.category}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{alert.time}</span>
                      {alert.acknowledged && (
                        <span className="text-green-400 text-[10px] font-['JetBrains_Mono'] flex items-center gap-0.5">
                          <i className="ri-check-double-line text-[10px]" />
                          {isAr ? "مؤكد" : "Ack"}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={`text-sm font-['Inter'] font-semibold leading-snug ${alert.acknowledged ? "text-gray-400" : "text-white"}`}>
                    {isAr ? alert.titleAr : alert.title}
                  </p>
                  <p className="text-gray-500 text-xs font-['Inter'] mt-0.5 leading-relaxed">
                    {isAr ? alert.descriptionAr : alert.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-gray-600 text-[10px] font-['JetBrains_Mono'] flex items-center gap-1">
                      <i className="ri-database-line text-[10px]" />
                      {alert.source}
                    </span>
                    {alert.assignedTo && (
                      <span className="text-gold-400 text-[10px] font-['JetBrains_Mono'] flex items-center gap-1">
                        <i className="ri-user-line text-[10px]" />
                        {alert.assignedTo}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded actions */}
              {isExpanded && (
                <div
                  className="px-5 pb-4 flex items-center gap-2 flex-wrap"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                >
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledge(alert.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer transition-colors whitespace-nowrap"
                      style={{ background: "rgba(74,222,128,0.1)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.25)" }}
                    >
                      <i className="ri-check-line" />
                      {isAr ? "تأكيد" : "Acknowledge"}
                    </button>
                  )}
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer transition-colors whitespace-nowrap"
                    style={{ background: "rgba(181,142,60,0.05)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}
                  >
                    <i className="ri-user-add-line" />
                    {isAr ? "تعيين" : "Assign"}
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer transition-colors whitespace-nowrap"
                    style={{ background: "rgba(251,146,60,0.08)", color: "#FB923C", border: "1px solid rgba(251,146,60,0.2)" }}
                  >
                    <i className="ri-arrow-up-line" />
                    {isAr ? "تصعيد" : "Escalate"}
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer transition-colors whitespace-nowrap"
                    style={{ background: "rgba(255,255,255,0.03)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <i className="ri-external-link-line" />
                    {isAr ? "عرض التفاصيل" : "View Details"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PoliceAlertCenter;
