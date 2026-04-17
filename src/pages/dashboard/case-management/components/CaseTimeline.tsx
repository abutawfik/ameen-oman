import { useState } from "react";
import { type InvestigationCase, type TimelineEvent } from "@/mocks/caseManagementData";

const streamColors: Record<string, string> = {
  Financial:   "#4ADE80",
  Border:      "#60A5FA",
  Mobile:      "#A78BFA",
  Hotel:       "#D6B47E",
  Transport:   "#C98A1B",
  Social:      "#38BDF8",
  Employment:  "#F9A8D4",
  Customs:     "#FCD34D",
  Marine:      "#7DD3FC",
  HUMINT:      "#C94A5E",
  "Internal SIEM": "#D6B47E",
};

const streamIcons: Record<string, string> = {
  Financial:   "ri-bank-card-line",
  Border:      "ri-passport-line",
  Mobile:      "ri-sim-card-line",
  Hotel:       "ri-hotel-line",
  Transport:   "ri-bus-line",
  Social:      "ri-global-line",
  Employment:  "ri-briefcase-line",
  Customs:     "ri-ship-line",
  Marine:      "ri-anchor-line",
  HUMINT:      "ri-spy-line",
  "Internal SIEM": "ri-server-line",
};

const significanceConfig = {
  critical: { color: "#C94A5E", size: "w-4 h-4" },
  high:     { color: "#C98A1B", size: "w-3.5 h-3.5" },
  medium:   { color: "#FACC15", size: "w-3 h-3" },
  low:      { color: "#4ADE80", size: "w-2.5 h-2.5" },
};

interface Props {
  caseData: InvestigationCase;
  isAr: boolean;
}

const CaseTimeline = ({ caseData, isAr }: Props) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [filterStream, setFilterStream] = useState<string>("all");

  const streams = Array.from(new Set(caseData.timeline.map(e => e.stream)));
  const filtered = caseData.timeline.filter(e => filterStream === "all" || e.stream === filterStream);

  return (
    <div className="flex gap-4 h-full">
      {/* Timeline */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(184,138,60,0.2) transparent" }}>
        {/* Stream filter */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <button onClick={() => setFilterStream("all")}
            className="px-3 py-1.5 rounded-lg text-xs font-['Inter'] cursor-pointer transition-all whitespace-nowrap"
            style={{ background: filterStream === "all" ? "rgba(184,138,60,0.1)" : "rgba(255,255,255,0.04)", color: filterStream === "all" ? "#D6B47E" : "#6B7280", border: `1px solid ${filterStream === "all" ? "rgba(184,138,60,0.3)" : "rgba(255,255,255,0.06)"}` }}>
            All Streams
          </button>
          {streams.map((s) => (
            <button key={s} onClick={() => setFilterStream(s)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-['Inter'] cursor-pointer transition-all whitespace-nowrap"
              style={{ background: filterStream === s ? `${streamColors[s] || "#D6B47E"}15` : "rgba(255,255,255,0.04)", color: filterStream === s ? (streamColors[s] || "#D6B47E") : "#6B7280", border: `1px solid ${filterStream === s ? (streamColors[s] || "#D6B47E") + "40" : "rgba(255,255,255,0.06)"}` }}>
              <i className={`${streamIcons[s] || "ri-database-line"} text-xs`} />
              {s}
            </button>
          ))}
        </div>

        {/* Timeline events */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: "rgba(184,138,60,0.15)" }} />

          <div className="space-y-1">
            {filtered.map((event, idx) => {
              const sig = significanceConfig[event.significance];
              const color = streamColors[event.stream] || "#D6B47E";
              const icon = streamIcons[event.stream] || "ri-database-line";
              const isSelected = selectedEvent?.id === event.id;

              return (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(isSelected ? null : event)}
                  className="w-full text-left flex items-start gap-4 pl-2 pr-3 py-2 rounded-xl cursor-pointer transition-all"
                  style={{ background: isSelected ? "rgba(255,255,255,0.05)" : "transparent" }}
                >
                  {/* Node */}
                  <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: "28px", marginTop: "2px" }}>
                    <div className={`${sig.size} rounded-full flex-shrink-0 z-10`} style={{ background: sig.color, boxShadow: event.significance === "critical" ? `0 0 8px ${sig.color}60` : "none" }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-5 h-5 flex items-center justify-center rounded flex-shrink-0" style={{ background: `${color}15` }}>
                        <i className={`${icon} text-[10px]`} style={{ color }} />
                      </div>
                      <span className="text-white text-xs font-bold font-['Inter'] truncate">{event.title}</span>
                      {!event.verified && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-['JetBrains_Mono'] flex-shrink-0" style={{ background: "rgba(250,204,21,0.1)", color: "#FACC15" }}>UNVERIFIED</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-[10px] font-['Inter'] truncate">{event.detail}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-gray-700 text-[10px] font-['JetBrains_Mono']">{event.timestamp}</span>
                      <span className="text-gray-700 text-[10px] font-['Inter']">{event.location}</span>
                      <span className="text-[10px] font-['Inter']" style={{ color }}>{event.stream}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event detail panel */}
      {selectedEvent && (
        <div className="w-72 flex-shrink-0 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-[10px] font-['JetBrains_Mono'] uppercase">Event Detail</p>
              <button onClick={() => setSelectedEvent(null)} className="text-gray-600 hover:text-gray-400 cursor-pointer">
                <i className="ri-close-line text-sm" />
              </button>
            </div>
            <h4 className="text-white text-sm font-bold font-['Inter']">{selectedEvent.title}</h4>
            <p className="text-gray-400 text-xs font-['Inter'] leading-relaxed">{selectedEvent.detail}</p>
            <div className="space-y-2">
              {[
                { label: "Timestamp", value: selectedEvent.timestamp },
                { label: "Location", value: selectedEvent.location },
                { label: "Subject", value: selectedEvent.subject },
                { label: "Stream", value: selectedEvent.stream },
                { label: "Significance", value: selectedEvent.significance.toUpperCase() },
                { label: "Verified", value: selectedEvent.verified ? "Yes" : "No" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-gray-700 text-[10px] font-['JetBrains_Mono']">{row.label}</span>
                  <span className="text-gray-400 text-[10px] font-['Inter']">{row.value}</span>
                </div>
              ))}
            </div>
            {selectedEvent.linkedEvidence.length > 0 && (
              <div>
                <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-1">LINKED EVIDENCE</p>
                {selectedEvent.linkedEvidence.map((ev) => (
                  <div key={ev} className="flex items-center gap-2 px-2 py-1 rounded" style={{ background: "rgba(184,138,60,0.06)" }}>
                    <i className="ri-attachment-line text-gold-400 text-xs" />
                    <span className="text-gold-400 text-[10px] font-['JetBrains_Mono']">{ev.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 rounded-lg text-[10px] font-['Inter'] cursor-pointer whitespace-nowrap" style={{ background: "rgba(184,138,60,0.08)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.2)" }}>
                Add Note
              </button>
              <button className="flex-1 py-1.5 rounded-lg text-[10px] font-['Inter'] cursor-pointer whitespace-nowrap" style={{ background: "rgba(167,139,250,0.08)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.2)" }}>
                Add Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseTimeline;
