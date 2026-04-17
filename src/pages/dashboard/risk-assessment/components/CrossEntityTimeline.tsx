import { useState } from "react";
import type { TimelineEvent } from "@/mocks/riskAssessmentData";

interface CrossEntityTimelineProps {
  events: TimelineEvent[];
  isAr: boolean;
}

const STREAM_ICONS: Record<string, string> = {
  "Border":      "ri-passport-line",
  "Financial":   "ri-bank-card-line",
  "Mobile":      "ri-sim-card-line",
  "Hotel":       "ri-hotel-line",
  "Car Rental":  "ri-car-line",
  "Transport":   "ri-bus-line",
  "E-Commerce":  "ri-shopping-cart-line",
  "Healthcare":  "ri-heart-pulse-line",
  "Education":   "ri-graduation-cap-line",
  "Employment":  "ri-briefcase-line",
  "Marine":      "ri-ship-line",
  "Postal":      "ri-mail-line",
  "Tourism":     "ri-map-pin-line",
  "Utility":     "ri-flashlight-line",
  "Municipality":"ri-government-line",
  "OSINT":       "ri-global-line",
  "Customs":     "ri-box-3-line",
};

const CrossEntityTimeline = ({ events, isAr }: CrossEntityTimelineProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const riskBadge = (risk: TimelineEvent["risk"]) => {
    if (risk === "flagged") return (
      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full font-bold"
        style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)", fontSize: "9px" }}>
        <i className="ri-shield-cross-line" style={{ fontSize: "8px" }} />
        {isAr ? "مُبلَّغ" : "FLAGGED"}
      </span>
    );
    if (risk === "review") return (
      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full font-bold"
        style={{ background: "rgba(250,204,21,0.08)", color: "#FACC15", border: "1px solid rgba(250,204,21,0.2)", fontSize: "9px" }}>
        <i className="ri-eye-line" style={{ fontSize: "8px" }} />
        {isAr ? "مراجعة" : "REVIEW"}
      </span>
    );
    return (
      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full font-bold"
        style={{ background: "rgba(74,222,128,0.06)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.18)", fontSize: "9px" }}>
        <i className="ri-shield-check-line" style={{ fontSize: "8px" }} />
        {isAr ? "سليم" : "CLEAR"}
      </span>
    );
  };

  return (
    <div className="relative">
      {/* Vertical cyan line */}
      <div className="absolute top-0 bottom-0 w-0.5 rounded-full"
        style={{ left: "19px", background: "linear-gradient(to bottom, rgba(181,142,60,0.7), rgba(181,142,60,0.05))" }} />

      <div className="space-y-0.5">
        {events.map((ev) => {
          const isExpanded = expandedId === ev.id;
          const iconKey = Object.keys(STREAM_ICONS).find((k) => ev.stream.includes(k)) ?? ev.stream;
          const icon = STREAM_ICONS[iconKey] ?? ev.icon;

          return (
            <div key={ev.id}>
              <div
                onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                className="relative flex items-start gap-4 pl-12 py-2.5 rounded-xl transition-all cursor-pointer group"
                style={{ background: isExpanded ? `${ev.color}06` : "transparent" }}>

                {/* Icon node */}
                <div className="absolute flex items-center justify-center rounded-full z-10 transition-all"
                  style={{
                    left: "8px", top: "10px", width: "24px", height: "24px",
                    background: ev.risk === "flagged" ? `${ev.color}20` : `${ev.color}12`,
                    border: `2px solid ${ev.risk === "flagged" ? ev.color + "60" : ev.color + "30"}`,
                    boxShadow: ev.risk === "flagged" ? `0 0 8px ${ev.color}40` : "none",
                  }}>
                  <i className={`${icon}`} style={{ color: ev.color, fontSize: "9px" }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-white text-xs font-semibold">{isAr ? ev.eventAr : ev.event}</span>
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md"
                      style={{ background: `${ev.color}10`, color: ev.color, fontSize: "9px" }}>
                      {isAr ? ev.streamAr : ev.stream}
                    </span>
                    {riskBadge(ev.risk)}
                  </div>
                  <p className="text-gray-500 text-xs truncate">{isAr ? ev.detailAr : ev.detail}</p>
                </div>

                <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
                  <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{ev.timestamp}</span>
                  <span className="text-gray-700 font-['JetBrains_Mono']" style={{ fontSize: "9px" }}>{ev.ref}</span>
                </div>

                <i className={isExpanded ? "ri-arrow-up-s-line text-gray-700 text-xs flex-shrink-0 group-hover:text-gold-400 transition-colors" : "ri-arrow-down-s-line text-gray-700 text-xs flex-shrink-0 group-hover:text-gold-400 transition-colors"} />
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="ml-12 mb-2 px-4 py-3 rounded-xl"
                  style={{ background: `${ev.color}06`, border: `1px solid ${ev.color}15`, borderLeft: `2px solid ${ev.color}40` }}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-600 text-xs mb-0.5">{isAr ? "التفاصيل" : "Details"}</p>
                      <p className="text-white text-xs font-semibold">{isAr ? ev.detailAr : ev.detail}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-0.5">{isAr ? "المرجع" : "Reference"}</p>
                      <p className="text-gold-400 text-xs font-bold font-['JetBrains_Mono']">{ev.ref}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-0.5">{isAr ? "التدفق" : "Stream"}</p>
                      <p className="text-xs font-semibold" style={{ color: ev.color }}>{isAr ? ev.streamAr : ev.stream}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-0.5">{isAr ? "الوقت" : "Timestamp"}</p>
                      <p className="text-gray-300 text-xs font-['JetBrains_Mono']">{ev.timestamp}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CrossEntityTimeline;
