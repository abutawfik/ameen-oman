import { useState } from "react";
import { cases, type InvestigationCase, type CaseStatus, type CasePriority } from "@/mocks/caseManagementData";

const priorityConfig: Record<CasePriority, { color: string; bg: string }> = {
  critical: { color: "#F87171", bg: "rgba(248,113,113,0.1)" },
  high:     { color: "#FB923C", bg: "rgba(251,146,60,0.1)" },
  medium:   { color: "#FACC15", bg: "rgba(250,204,21,0.1)" },
  low:      { color: "#4ADE80", bg: "rgba(74,222,128,0.1)" },
};

const statusConfig: Record<CaseStatus, { color: string; icon: string; label: string }> = {
  active:    { color: "#22D3EE", icon: "ri-play-circle-line",   label: "Active" },
  pending:   { color: "#FACC15", icon: "ri-time-line",          label: "Pending" },
  escalated: { color: "#F87171", icon: "ri-arrow-up-circle-line",label: "Escalated" },
  closed:    { color: "#4ADE80", icon: "ri-checkbox-circle-line",  label: "Closed" },
  archived:  { color: "#6B7280", icon: "ri-archive-line",       label: "Archived" },
};

const typeIcons: Record<string, string> = {
  terrorism:       "ri-shield-flash-line",
  fraud:           "ri-money-dollar-circle-line",
  smuggling:       "ri-ship-line",
  cybercrime:      "ri-bug-line",
  money_laundering:"ri-exchange-dollar-line",
  identity_fraud:  "ri-fingerprint-line",
  organized_crime: "ri-group-line",
};

interface Props {
  selectedCaseId: string | null;
  onSelectCase: (id: string) => void;
  isAr: boolean;
}

const CaseList = ({ selectedCaseId, onSelectCase, isAr }: Props) => {
  const [filterStatus, setFilterStatus] = useState<CaseStatus | "all">("all");
  const [filterPriority, setFilterPriority] = useState<CasePriority | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = cases.filter((c) => {
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (filterPriority !== "all" && c.priority !== filterPriority) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.caseNumber.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <i className="ri-search-line text-gray-600 text-sm" />
          <input
            type="text"
            placeholder="Search cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-white text-xs font-['Inter'] outline-none flex-1 placeholder-gray-700"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {(["all", "active", "escalated", "pending", "closed"] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className="px-2 py-1 rounded text-[10px] font-['Inter'] cursor-pointer transition-all whitespace-nowrap"
              style={{
                background: filterStatus === s ? "rgba(34,211,238,0.1)" : "transparent",
                color: filterStatus === s ? "#22D3EE" : "#6B7280",
              }}>
              {s === "all" ? "All" : statusConfig[s as CaseStatus]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Case list */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(34,211,238,0.2) transparent" }}>
        {filtered.map((c) => {
          const pri = priorityConfig[c.priority];
          const stat = statusConfig[c.status];
          const isSelected = selectedCaseId === c.id;

          return (
            <button
              key={c.id}
              onClick={() => onSelectCase(c.id)}
              className="w-full text-left p-3 border-b cursor-pointer transition-all"
              style={{
                borderColor: "rgba(255,255,255,0.04)",
                background: isSelected ? "rgba(34,211,238,0.06)" : "transparent",
                borderLeft: isSelected ? "2px solid #22D3EE" : "2px solid transparent",
              }}
            >
              <div className="flex items-start gap-2 mb-1.5">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5" style={{ background: `${pri.color}15` }}>
                  <i className={`${typeIcons[c.type] || "ri-folder-line"} text-xs`} style={{ color: pri.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold font-['Inter'] truncate">{c.title}</p>
                  <p className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{c.caseNumber}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-['JetBrains_Mono']" style={{ background: pri.bg, color: pri.color }}>
                    {c.priority.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1">
                    <i className={`${stat.icon} text-[10px]`} style={{ color: stat.color }} />
                    <span className="text-[10px] font-['Inter']" style={{ color: stat.color }}>{stat.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <i className="ri-user-line text-gray-700 text-[10px]" />
                  <span className="text-gray-700 text-[10px] font-['JetBrains_Mono']">{c.subjects.length}</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-2 w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${c.progressPct}%`, background: pri.color }} />
              </div>
              <p className="text-gray-700 text-[10px] font-['JetBrains_Mono'] mt-0.5">{c.progressPct}% complete</p>
            </button>
          );
        })}
      </div>

      {/* New case button */}
      <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-['Inter'] cursor-pointer transition-all whitespace-nowrap" style={{ background: "rgba(34,211,238,0.08)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}>
          <i className="ri-add-line" />
          New Investigation
        </button>
      </div>
    </div>
  );
};

export default CaseList;
