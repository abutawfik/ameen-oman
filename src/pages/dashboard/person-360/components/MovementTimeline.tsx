import { useState } from "react";
import type { TimelineEvent } from "@/mocks/person360Data";

interface Props {
  events: TimelineEvent[];
  streamFilter: string | null;
  isAr: boolean;
}

const alertColors: Record<string, string> = {
  critical: "#F87171",
  high:     "#FB923C",
  medium:   "#FACC15",
};

const alertBg: Record<string, string> = {
  critical: "rgba(248,113,113,0.07)",
  high:     "rgba(251,146,60,0.07)",
  medium:   "rgba(250,204,21,0.07)",
};

const streamMap: Record<string, string> = {
  "Border":     "border",
  "Hotel":      "hotel",
  "Mobile":     "mobile",
  "Car Rental": "car-rental",
  "Financial":  "financial",
  "Transport":  "transport",
  "Employment": "employment",
  "Municipality": "municipality",
  "E-Commerce": "ecommerce",
  "Social":     "social",
  "Marine":     "marine",
  "Customs":    "customs",
};

const MovementTimeline = ({ events, streamFilter, isAr }: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAlertsOnly, setShowAlertsOnly] = useState(false);

  const filtered = events.filter((e) => {
    if (streamFilter && streamMap[e.stream] !== streamFilter) return false;
    if (showAlertsOnly && !e.isAlert) return false;
    return true;
  });

  const alertCount = events.filter((e) => e.isAlert).length;
  const criticalCount = events.filter((e) => e.alertSeverity === "critical").length;

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.15)", backdropFilter: "blur(12px)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-white font-bold font-['Inter'] text-sm uppercase tracking-wider">
            {isAr ? "الجدول الزمني للحركة" : "Movement Timeline"}
          </h3>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] font-bold"
            style={{ background: "rgba(181,142,60,0.1)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}
          >
            {filtered.length} {isAr ? "حدث" : "events"}
          </span>
          {alertCount > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] font-bold"
              style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}
            >
              {alertCount} {isAr ? "تنبيه" : "alerts"}
            </span>
          )}
          {criticalCount > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] font-bold animate-pulse"
              style={{ background: "rgba(248,113,113,0.15)", color: "#F87171", border: "1px solid rgba(248,113,113,0.4)" }}
            >
              {criticalCount} CRITICAL
            </span>
          )}
        </div>
        <button
          onClick={() => setShowAlertsOnly(!showAlertsOnly)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer transition-all whitespace-nowrap"
          style={{
            background: showAlertsOnly ? "rgba(248,113,113,0.15)" : "rgba(255,255,255,0.03)",
            color: showAlertsOnly ? "#F87171" : "#6B7280",
            border: showAlertsOnly ? "1px solid rgba(248,113,113,0.3)" : "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <i className="ri-alert-line" />
          {isAr ? "التنبيهات فقط" : "Alerts Only"}
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical cyan line */}
        <div
          className="absolute left-6 top-3 bottom-3 w-0.5"
          style={{ background: "linear-gradient(to bottom, rgba(181,142,60,0.8), rgba(181,142,60,0.1))" }}
        />

        <div className="space-y-2">
          {filtered.map((event) => {
            const isExpanded = expandedId === event.id;
            const alertColor = event.alertSeverity ? alertColors[event.alertSeverity] : null;
            const alertBgColor = event.alertSeverity ? alertBg[event.alertSeverity] : null;

            return (
              <div key={event.id} className="relative pl-14">
                {/* Stream icon circle */}
                <div
                  className="absolute left-3 top-3.5 w-6 h-6 rounded-full flex items-center justify-center z-10"
                  style={{
                    background: `${event.streamColor}22`,
                    border: `2px solid ${event.streamColor}`,
                    boxShadow: event.isAlert
                      ? `0 0 14px ${alertColor}, 0 0 6px ${event.streamColor}44`
                      : `0 0 6px ${event.streamColor}44`,
                  }}
                >
                  <i className={`${event.streamIcon}`} style={{ color: event.streamColor, fontSize: 10 }} />
                </div>

                {/* Event card */}
                <div
                  className="rounded-xl p-3 cursor-pointer transition-all duration-200"
                  onClick={() => setExpandedId(isExpanded ? null : event.id)}
                  style={{
                    background: event.isAlert ? alertBgColor! : "rgba(255,255,255,0.02)",
                    border: event.isAlert
                      ? `1px solid ${alertColor}44`
                      : "1px solid rgba(255,255,255,0.05)",
                    marginBottom: "4px",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {/* Alert badge */}
                        {event.isAlert && alertColor && (
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold font-['JetBrains_Mono'] uppercase tracking-wider flex items-center gap-1 flex-shrink-0"
                            style={{ background: `${alertColor}22`, color: alertColor, border: `1px solid ${alertColor}44` }}
                          >
                            <i className="ri-alert-fill" style={{ fontSize: 9 }} />
                            {event.alertType}
                          </span>
                        )}
                        {/* Stream label */}
                        <span
                          className="text-[10px] font-['JetBrains_Mono'] font-bold uppercase tracking-wider flex-shrink-0"
                          style={{ color: event.streamColor }}
                        >
                          {event.stream}
                        </span>
                      </div>
                      <p className="text-white text-sm font-['Inter'] font-semibold leading-snug">{event.title}</p>
                      <p className="text-gray-400 text-xs font-['Inter'] mt-0.5 leading-relaxed">{event.description}</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-gray-600 text-[10px] font-['JetBrains_Mono'] flex items-center gap-1">
                          <i className="ri-time-line" />{event.datetime}
                        </span>
                        <span className="text-gray-600 text-[10px] font-['JetBrains_Mono'] flex items-center gap-1">
                          <i className="ri-map-pin-line" />{event.location}
                        </span>
                        <span className="text-gray-600 text-[10px] font-['JetBrains_Mono'] flex items-center gap-1">
                          <i className="ri-building-line" />{event.entity}
                        </span>
                      </div>
                    </div>
                    <i
                      className={`text-gray-600 text-sm transition-transform duration-200 flex-shrink-0 mt-1 ${isExpanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}`}
                    />
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div
                      className="mt-3 pt-3 border-t grid grid-cols-2 sm:grid-cols-3 gap-2.5"
                      style={{ borderColor: "rgba(255,255,255,0.06)" }}
                    >
                      {Object.entries(event.details).map(([key, val]) => (
                        <div key={key}>
                          <p className="text-gray-600 text-[10px] uppercase tracking-wider font-['JetBrains_Mono']">{key}</p>
                          <p className="text-white text-xs font-['JetBrains_Mono'] mt-0.5">{val}</p>
                        </div>
                      ))}
                      {/* Action buttons for alerts */}
                      {event.isAlert && (
                        <div className="col-span-full flex gap-2 mt-2 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                          <button
                            className="px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer whitespace-nowrap"
                            style={{ background: "#D4A84B", color: "#0B1220" }}
                          >
                            <i className="ri-check-line mr-1" />Confirm Alert
                          </button>
                          <button
                            className="px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer border border-orange-500/30 text-orange-400 whitespace-nowrap"
                          >
                            <i className="ri-arrow-up-circle-line mr-1" />Escalate
                          </button>
                          <button
                            className="px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer border border-gray-600 text-gray-400 whitespace-nowrap"
                          >
                            <i className="ri-close-line mr-1" />Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="pl-14 py-10 text-center">
            <i className="ri-inbox-line text-gray-700 text-3xl" />
            <p className="text-gray-600 text-sm font-['Inter'] mt-2">
              {isAr ? "لا توجد أحداث لهذا الفلتر" : "No events match this filter"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovementTimeline;
