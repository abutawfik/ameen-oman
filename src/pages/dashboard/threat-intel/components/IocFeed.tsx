import { useState } from "react";
import { iocEntries, type IocEntry, type IocType, type SeverityLevel, type IocStatus } from "@/mocks/threatIntelData";

const severityConfig: Record<SeverityLevel, { color: string; bg: string; label: string }> = {
  critical: { color: "#F87171", bg: "rgba(248,113,113,0.1)", label: "CRITICAL" },
  high:     { color: "#FB923C", bg: "rgba(251,146,60,0.1)",  label: "HIGH" },
  medium:   { color: "#FACC15", bg: "rgba(250,204,21,0.1)",  label: "MEDIUM" },
  low:      { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",  label: "LOW" },
};

const statusConfig: Record<IocStatus, { color: string; label: string; icon: string }> = {
  active:         { color: "#F87171", label: "Active",         icon: "ri-record-circle-line" },
  investigating:  { color: "#FACC15", label: "Investigating",  icon: "ri-search-line" },
  mitigated:      { color: "#4ADE80", label: "Mitigated",      icon: "ri-shield-check-line" },
  false_positive: { color: "#6B7280", label: "False Positive", icon: "ri-close-circle-line" },
};

const typeConfig: Record<IocType, { icon: string; color: string; label: string }> = {
  ip:     { icon: "ri-server-line",       color: "#22D3EE", label: "IP Address" },
  domain: { icon: "ri-global-line",       color: "#A78BFA", label: "Domain" },
  hash:   { icon: "ri-fingerprint-line",  color: "#F87171", label: "File Hash" },
  email:  { icon: "ri-mail-line",         color: "#FACC15", label: "Email" },
  url:    { icon: "ri-link",              color: "#FB923C", label: "URL" },
  wallet: { icon: "ri-coin-line",         color: "#4ADE80", label: "Crypto Wallet" },
  phone:  { icon: "ri-phone-line",        color: "#38BDF8", label: "Phone" },
};

const tlpConfig = {
  RED:   { color: "#F87171", bg: "rgba(248,113,113,0.15)" },
  AMBER: { color: "#FB923C", bg: "rgba(251,146,60,0.15)" },
  GREEN: { color: "#4ADE80", bg: "rgba(74,222,128,0.15)" },
  WHITE: { color: "#E5E7EB", bg: "rgba(229,231,235,0.1)" },
};

interface Props {
  isAr: boolean;
}

const IocFeed = ({ isAr }: Props) => {
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | "all">("all");
  const [selectedType, setSelectedType] = useState<IocType | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<IocStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = iocEntries.filter((ioc) => {
    if (selectedSeverity !== "all" && ioc.severity !== selectedSeverity) return false;
    if (selectedType !== "all" && ioc.type !== selectedType) return false;
    if (selectedStatus !== "all" && ioc.status !== selectedStatus) return false;
    if (searchQuery && !ioc.value.toLowerCase().includes(searchQuery.toLowerCase()) && !ioc.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total IOCs", value: iocEntries.length.toString(), icon: "ri-database-line", color: "#22D3EE" },
          { label: "Critical Active", value: iocEntries.filter(i => i.severity === "critical" && i.status === "active").length.toString(), icon: "ri-alarm-warning-line", color: "#F87171" },
          { label: "Investigating", value: iocEntries.filter(i => i.status === "investigating").length.toString(), icon: "ri-search-eye-line", color: "#FACC15" },
          { label: "Mitigated", value: iocEntries.filter(i => i.status === "mitigated").length.toString(), icon: "ri-shield-check-line", color: "#4ADE80" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${stat.color}15` }}>
              <i className={`${stat.icon} text-sm`} style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-white text-lg font-bold font-['JetBrains_Mono']">{stat.value}</p>
              <p className="text-gray-600 text-[10px] font-['Inter']">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 min-w-48" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <i className="ri-search-line text-gray-600 text-sm" />
          <input
            type="text"
            placeholder="Search IOC value or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white text-xs font-['Inter'] outline-none flex-1 placeholder-gray-700"
          />
        </div>
        <div className="flex items-center gap-1">
          {(["all", "critical", "high", "medium", "low"] as const).map((s) => (
            <button key={s} onClick={() => setSelectedSeverity(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-['Inter'] cursor-pointer transition-all whitespace-nowrap"
              style={{
                background: selectedSeverity === s ? (s === "all" ? "rgba(34,211,238,0.15)" : severityConfig[s as SeverityLevel]?.bg) : "rgba(255,255,255,0.04)",
                color: selectedSeverity === s ? (s === "all" ? "#22D3EE" : severityConfig[s as SeverityLevel]?.color) : "#6B7280",
                border: `1px solid ${selectedSeverity === s ? (s === "all" ? "rgba(34,211,238,0.3)" : severityConfig[s as SeverityLevel]?.color + "40") : "rgba(255,255,255,0.06)"}`,
              }}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as IocStatus | "all")}
          className="px-3 py-1.5 rounded-lg text-xs font-['Inter'] cursor-pointer outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9CA3AF" }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="investigating">Investigating</option>
          <option value="mitigated">Mitigated</option>
          <option value="false_positive">False Positive</option>
        </select>
      </div>

      {/* IOC List */}
      <div className="space-y-2">
        {filtered.map((ioc) => {
          const sev = severityConfig[ioc.severity];
          const stat = statusConfig[ioc.status];
          const typ = typeConfig[ioc.type];
          const tlp = tlpConfig[ioc.tlp];
          const isExpanded = expandedId === ioc.id;

          return (
            <div key={ioc.id} className="rounded-xl overflow-hidden transition-all" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${isExpanded ? sev.color + "40" : "rgba(255,255,255,0.06)"}` }}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : ioc.id)}
                className="w-full flex items-center gap-3 p-3 cursor-pointer hover:bg-white/[0.02] transition-colors text-left"
              >
                {/* Severity bar */}
                <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: sev.color }} />

                {/* Type icon */}
                <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${typ.color}15` }}>
                  <i className={`${typ.icon} text-sm`} style={{ color: typ.color }} />
                </div>

                {/* IOC value */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white text-xs font-bold font-['JetBrains_Mono'] truncate">{ioc.value}</span>
                    <span className="text-[10px] font-['JetBrains_Mono'] px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: tlp.bg, color: tlp.color }}>TLP:{ioc.tlp}</span>
                  </div>
                  <p className="text-gray-600 text-[10px] font-['Inter'] truncate">{ioc.description}</p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-gray-500 text-[10px] font-['JetBrains_Mono']">{ioc.hitCount} hits</p>
                    <p className="text-gray-700 text-[10px] font-['JetBrains_Mono']">{ioc.lastSeen}</p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: sev.bg }}>
                    <span className="text-[10px] font-bold font-['JetBrains_Mono']" style={{ color: sev.color }}>{sev.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className={`${stat.icon} text-xs`} style={{ color: stat.color }} />
                    <span className="text-[10px] font-['Inter']" style={{ color: stat.color }}>{stat.label}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <span className="text-[10px] font-['JetBrains_Mono'] text-gray-500">{ioc.confidence}%</span>
                  </div>
                  <i className={isExpanded ? "ri-arrow-up-s-line text-gray-600 text-sm" : "ri-arrow-down-s-line text-gray-600 text-sm"} />
                </div>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-3">
                      <div>
                        <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-1">DESCRIPTION</p>
                        <p className="text-gray-400 text-xs font-['Inter']">{ioc.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-1">LINKED SUBJECTS</p>
                          <div className="space-y-1">
                            {ioc.linkedSubjects.length > 0 ? ioc.linkedSubjects.map((s) => (
                              <div key={s} className="flex items-center gap-1.5">
                                <i className="ri-user-line text-cyan-400 text-xs" />
                                <span className="text-cyan-400 text-xs font-['Inter']">{s}</span>
                              </div>
                            )) : <span className="text-gray-700 text-xs">None identified</span>}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-1">LINKED STREAMS</p>
                          <div className="flex flex-wrap gap-1">
                            {ioc.linkedStreams.map((s) => (
                              <span key={s} className="text-[10px] px-2 py-0.5 rounded font-['Inter']" style={{ background: "rgba(34,211,238,0.1)", color: "#22D3EE" }}>{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-1">TAGS</p>
                        <div className="flex flex-wrap gap-1">
                          {ioc.tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded font-['JetBrains_Mono']" style={{ background: "rgba(255,255,255,0.06)", color: "#9CA3AF" }}>#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        {[
                          { label: "IOC ID", value: ioc.id.toUpperCase() },
                          { label: "Type", value: typ.label },
                          { label: "Source", value: ioc.source },
                          { label: "First Seen", value: ioc.firstSeen },
                          { label: "Last Seen", value: ioc.lastSeen },
                          { label: "Confidence", value: `${ioc.confidence}%` },
                        ].map((row) => (
                          <div key={row.label} className="flex justify-between">
                            <span className="text-gray-700 text-[10px] font-['JetBrains_Mono']">{row.label}</span>
                            <span className="text-gray-400 text-[10px] font-['JetBrains_Mono']">{row.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-1.5 rounded-lg text-[10px] font-['Inter'] cursor-pointer transition-colors whitespace-nowrap" style={{ background: "rgba(34,211,238,0.08)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}>
                          <i className="ri-search-eye-line mr-1" />Investigate
                        </button>
                        <button className="flex-1 py-1.5 rounded-lg text-[10px] font-['Inter'] cursor-pointer transition-colors whitespace-nowrap" style={{ background: "rgba(248,113,113,0.08)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                          <i className="ri-flag-line mr-1" />Escalate
                        </button>
                      </div>
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

export default IocFeed;
