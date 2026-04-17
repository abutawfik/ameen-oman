import { useState } from "react";
import { generatedDossiers, classificationConfig, type GeneratedDossier, type DossierStatus } from "@/mocks/dossierData";

interface Props {
  isAr: boolean;
}

const statusConfig: Record<DossierStatus, { color: string; bg: string; label: string; icon: string }> = {
  draft:      { color: "#9CA3AF", bg: "rgba(156,163,175,0.1)", label: "Draft",      icon: "ri-draft-line" },
  generating: { color: "#D4A84B", bg: "rgba(181,142,60,0.1)",  label: "Generating", icon: "ri-loader-4-line" },
  ready:      { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",  label: "Ready",      icon: "ri-checkbox-circle-line" },
  expired:    { color: "#FB923C", bg: "rgba(251,146,60,0.1)",  label: "Expired",    icon: "ri-time-line" },
  archived:   { color: "#6B7280", bg: "rgba(107,114,128,0.1)", label: "Archived",   icon: "ri-archive-line" },
};

const DossierHistory = ({ isAr }: Props) => {
  const [selectedDossier, setSelectedDossier] = useState<GeneratedDossier | null>(null);
  const [statusFilter, setStatusFilter] = useState<DossierStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = generatedDossiers.filter((d) => {
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    const matchSearch = !searchQuery.trim() || d.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) || d.ref.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const riskColors: Record<string, string> = {
    low: "#4ADE80", medium: "#FACC15", high: "#FB923C", critical: "#F87171",
  };

  return (
    <div className="flex gap-5 h-full">
      {/* Left: List */}
      <div className="flex-1 space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by subject or reference..."
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm font-['Inter'] outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(181,142,60,0.15)", color: "#E5E7EB" }}
            />
          </div>
          <div className="flex gap-1.5">
            {(["all", "ready", "expired", "archived"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-2 rounded-lg text-xs font-['Inter'] cursor-pointer transition-all whitespace-nowrap capitalize"
                style={{
                  background: statusFilter === s ? "rgba(181,142,60,0.1)" : "rgba(255,255,255,0.03)",
                  color: statusFilter === s ? "#D4A84B" : "#6B7280",
                  border: statusFilter === s ? "1px solid rgba(181,142,60,0.25)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {s === "all" ? "All" : statusConfig[s as DossierStatus].label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Generated", value: generatedDossiers.length, color: "#D4A84B" },
            { label: "Ready", value: generatedDossiers.filter((d) => d.status === "ready").length, color: "#4ADE80" },
            { label: "Expired", value: generatedDossiers.filter((d) => d.status === "expired").length, color: "#FB923C" },
            { label: "Total Downloads", value: generatedDossiers.reduce((s, d) => s + d.downloadCount, 0), color: "#A78BFA" },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-xl" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.1)" }}>
              <p className="text-2xl font-bold font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-gray-600 text-xs font-['Inter'] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Dossier list */}
        <div className="space-y-2">
          {filtered.map((dossier) => {
            const cfg = classificationConfig[dossier.classification];
            const sCfg = statusConfig[dossier.status];
            const isSelected = selectedDossier?.id === dossier.id;
            return (
              <button
                key={dossier.id}
                onClick={() => setSelectedDossier(isSelected ? null : dossier)}
                className="w-full p-4 rounded-xl cursor-pointer transition-all text-left"
                style={{
                  background: isSelected ? "rgba(181,142,60,0.06)" : "rgba(20,29,46,0.8)",
                  border: isSelected ? "1px solid rgba(181,142,60,0.25)" : "1px solid rgba(181,142,60,0.1)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                    <i className="ri-file-shield-2-line text-lg" style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm font-bold font-['Inter']">{dossier.subjectName}</span>
                      <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{dossier.subjectDoc}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-['JetBrains_Mono']" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                        {dossier.classification}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-['JetBrains_Mono']" style={{ background: sCfg.bg, color: sCfg.color }}>
                        <i className={`${sCfg.icon} mr-1`} />{sCfg.label}
                      </span>
                      <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{dossier.format}</span>
                      <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{dossier.pageCount}p · {dossier.fileSize}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] font-['JetBrains_Mono'] text-gray-600">
                      <span>{dossier.ref}</span>
                      <span>·</span>
                      <span>{dossier.generatedAt}</span>
                      <span>·</span>
                      <span>By {dossier.generatedBy}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-['JetBrains_Mono'] text-gray-600">{dossier.streamCount} streams</span>
                      {dossier.alertCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-['JetBrains_Mono']" style={{ background: "rgba(248,113,113,0.15)", color: "#F87171" }}>
                          {dossier.alertCount} alerts
                        </span>
                      )}
                    </div>
                    {dossier.status === "ready" && (
                      <div className="flex gap-1.5">
                        <button className="px-2.5 py-1 rounded text-[11px] font-['Inter'] cursor-pointer transition-colors whitespace-nowrap" style={{ background: "rgba(181,142,60,0.08)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}>
                          <i className="ri-eye-line mr-1" />View
                        </button>
                        <button className="px-2.5 py-1 rounded text-[11px] font-['Inter'] cursor-pointer transition-colors whitespace-nowrap" style={{ background: "rgba(74,222,128,0.08)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.2)" }}>
                          <i className="ri-download-line mr-1" />Download
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded audit log */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
                    <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-2">AUDIT TRAIL</p>
                    <div className="space-y-1.5">
                      {dossier.auditLog.map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs font-['JetBrains_Mono']">
                          <span className="text-gray-700 w-32 flex-shrink-0">{entry.timestamp}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px]" style={{
                            background: entry.action === "Generated" ? "rgba(181,142,60,0.1)" : entry.action === "Downloaded" ? "rgba(74,222,128,0.1)" : entry.action === "Expired" ? "rgba(251,146,60,0.1)" : "rgba(156,163,175,0.1)",
                            color: entry.action === "Generated" ? "#D4A84B" : entry.action === "Downloaded" ? "#4ADE80" : entry.action === "Expired" ? "#FB923C" : "#9CA3AF",
                          }}>
                            {entry.action}
                          </span>
                          <span className="text-gray-500">{entry.user}</span>
                          <span className="text-gray-700 truncate">{entry.detail}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-gray-700 text-[10px] font-['JetBrains_Mono']">Purpose: {dossier.purpose}</span>
                      {dossier.caseRef && <span className="text-gray-700 text-[10px] font-['JetBrains_Mono']">· Case: {dossier.caseRef}</span>}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DossierHistory;
