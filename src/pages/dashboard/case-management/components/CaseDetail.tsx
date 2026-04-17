import { useState } from "react";
import { type InvestigationCase } from "@/mocks/caseManagementData";
import CaseTimeline from "./CaseTimeline";

const priorityConfig = {
  critical: { color: "#F87171", bg: "rgba(248,113,113,0.1)" },
  high:     { color: "#FB923C", bg: "rgba(251,146,60,0.1)" },
  medium:   { color: "#FACC15", bg: "rgba(250,204,21,0.1)" },
  low:      { color: "#4ADE80", bg: "rgba(74,222,128,0.1)" },
};

const classificationColors: Record<string, string> = {
  "TOP SECRET":   "#F87171",
  "SECRET":       "#FB923C",
  "CONFIDENTIAL": "#FACC15",
  "RESTRICTED":   "#4ADE80",
  "UNCLASSIFIED": "#9CA3AF",
};

type SubTab = "overview" | "timeline" | "evidence" | "notes";

interface Props {
  caseData: InvestigationCase;
  isAr: boolean;
}

const CaseDetail = ({ caseData, isAr }: Props) => {
  const [subTab, setSubTab] = useState<SubTab>("overview");
  const pri = priorityConfig[caseData.priority];
  const classColor = classificationColors[caseData.classification] || "#9CA3AF";

  const subTabs: { key: SubTab; label: string; icon: string }[] = [
    { key: "overview",  label: "Overview",  icon: "ri-dashboard-line" },
    { key: "timeline",  label: "Timeline",  icon: "ri-time-line" },
    { key: "evidence",  label: "Evidence",  icon: "ri-attachment-line" },
    { key: "notes",     label: "Notes",     icon: "ri-sticky-note-line" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Case header */}
      <div className="p-4 border-b flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded" style={{ background: `${classColor}15`, color: classColor }}>{caseData.classification}</span>
              <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded" style={{ background: pri.bg, color: pri.color }}>{caseData.priority.toUpperCase()}</span>
              <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{caseData.caseNumber}</span>
            </div>
            <h2 className="text-white text-base font-bold font-['Inter']">{caseData.title}</h2>
            <p className="text-gray-500 text-xs font-['Inter'] mt-0.5">Lead: {caseData.leadOfficer}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `${pri.color}15`, border: `2px solid ${pri.color}40` }}>
              <span className="text-xl font-black font-['JetBrains_Mono']" style={{ color: pri.color }}>{caseData.progressPct}</span>
            </div>
            <p className="text-gray-700 text-[10px] font-['JetBrains_Mono'] mt-0.5">% done</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${caseData.progressPct}%`, background: `linear-gradient(90deg, ${pri.color}, ${pri.color}99)` }} />
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {subTabs.map((t) => (
          <button key={t.key} onClick={() => setSubTab(t.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-['Inter'] cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: subTab === t.key ? "rgba(181,142,60,0.1)" : "transparent",
              color: subTab === t.key ? "#D4A84B" : "#6B7280",
              border: subTab === t.key ? "1px solid rgba(181,142,60,0.25)" : "1px solid transparent",
            }}>
            <i className={`${t.icon} text-xs`} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(181,142,60,0.2) transparent" }}>
        {subTab === "overview" && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-1">DESCRIPTION</p>
              <p className="text-gray-300 text-xs font-['Inter'] leading-relaxed">{caseData.description}</p>
            </div>
            <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-1">OBJECTIVE</p>
              <p className="text-gray-300 text-xs font-['Inter'] leading-relaxed">{caseData.objective}</p>
            </div>
            {/* Subjects */}
            <div>
              <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-2">SUBJECTS ({caseData.subjects.length})</p>
              <div className="space-y-2">
                {caseData.subjects.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={s.photo} alt={s.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-bold font-['Inter'] truncate">{s.name}</p>
                      <p className="text-gray-600 text-[10px] font-['Inter']">{s.nationality} · {s.role}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold font-['JetBrains_Mono'] text-sm" style={{ color: s.riskScore >= 90 ? "#F87171" : s.riskScore >= 75 ? "#FB923C" : "#FACC15" }}>{s.riskScore}</p>
                      <p className="text-gray-700 text-[10px]">{s.linkedStreams} streams</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Team */}
            <div>
              <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-2">INVESTIGATION TEAM</p>
              <div className="flex flex-wrap gap-2">
                {[caseData.leadOfficer, ...caseData.team].map((member) => (
                  <span key={member} className="text-xs px-2.5 py-1 rounded-lg font-['Inter']" style={{ background: "rgba(181,142,60,0.06)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.15)" }}>
                    {member}
                  </span>
                ))}
              </div>
            </div>
            {/* Streams */}
            <div>
              <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-2">STREAMS COVERED</p>
              <div className="flex flex-wrap gap-1.5">
                {caseData.streamsCovered.map((s) => (
                  <span key={s} className="text-[10px] px-2 py-1 rounded font-['Inter']" style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF" }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {subTab === "timeline" && (
          <div className="h-full min-h-96">
            <CaseTimeline caseData={caseData} isAr={isAr} />
          </div>
        )}

        {subTab === "evidence" && (
          <div className="space-y-2">
            {caseData.evidence.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <i className="ri-attachment-line text-gray-700 text-3xl mb-2" />
                <p className="text-gray-600 text-sm font-['Inter']">No evidence items yet</p>
              </div>
            ) : caseData.evidence.map((ev) => (
              <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: "rgba(167,139,250,0.1)" }}>
                  <i className="ri-file-text-line text-purple-400 text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold font-['Inter'] truncate">{ev.title}</p>
                  <p className="text-gray-600 text-[10px] font-['Inter']">{ev.source} · {ev.addedAt} · {ev.size}</p>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-['JetBrains_Mono'] flex-shrink-0" style={{ background: "rgba(250,204,21,0.1)", color: "#FACC15" }}>{ev.classification}</span>
              </div>
            ))}
            <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-['Inter'] cursor-pointer mt-2 whitespace-nowrap" style={{ background: "rgba(167,139,250,0.08)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.2)" }}>
              <i className="ri-upload-line" />Upload Evidence
            </button>
          </div>
        )}

        {subTab === "notes" && (
          <div className="space-y-3">
            {caseData.notes.map((note) => (
              <div key={note.id} className="p-3 rounded-xl" style={{ background: note.pinned ? "rgba(181,142,60,0.04)" : "rgba(255,255,255,0.02)", border: `1px solid ${note.pinned ? "rgba(181,142,60,0.2)" : "rgba(255,255,255,0.06)"}` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {note.pinned && <i className="ri-pushpin-line text-gold-400 text-xs" />}
                    <span className="text-white text-xs font-bold font-['Inter']">{note.author}</span>
                    <span className="text-gray-600 text-[10px] font-['Inter']">{note.authorRole}</span>
                  </div>
                  <span className="text-gray-700 text-[10px] font-['JetBrains_Mono']">{note.timestamp}</span>
                </div>
                <p className="text-gray-300 text-xs font-['Inter'] leading-relaxed">{note.content}</p>
              </div>
            ))}
            <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <textarea
                placeholder="Add a note..."
                rows={3}
                className="w-full bg-transparent text-white text-xs font-['Inter'] outline-none resize-none placeholder-gray-700"
              />
              <div className="flex justify-end mt-2">
                <button className="px-4 py-1.5 rounded-lg text-xs font-['Inter'] cursor-pointer whitespace-nowrap" style={{ background: "rgba(181,142,60,0.1)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}>
                  Add Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseDetail;
