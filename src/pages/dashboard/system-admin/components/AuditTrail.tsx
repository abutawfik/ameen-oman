import { useState } from "react";
import { auditEntries, type AuditEntry } from "@/mocks/systemAdminData";

const resultConfig: Record<string, { color: string; bg: string; icon: string }> = {
  success: { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",  icon: "ri-check-line" },
  failure: { color: "#C94A5E", bg: "rgba(201,74,94,0.1)", icon: "ri-close-line" },
  warning: { color: "#FACC15", bg: "rgba(250,204,21,0.1)",  icon: "ri-alert-line" },
};

const actionColors: Record<string, string> = {
  CONFIG_UPDATE:      "#D6B47E",
  RULE_ENABLED:       "#4ADE80",
  RULE_MODIFIED:      "#FACC15",
  STREAM_DISABLED:    "#C98A1B",
  DATA_EXPORT:        "#A78BFA",
  USER_CREATED:       "#D6B47E",
  LOGIN_FAILED:       "#C94A5E",
  PURGE_APPROVED:     "#C94A5E",
  API_KEY_ROTATED:    "#FACC15",
  PERSON_LOOKUP:      "#38BDF8",
  RETENTION_UPDATED:  "#D6B47E",
  BACKUP_COMPLETED:   "#4ADE80",
  ALERT_ACKNOWLEDGED: "#D6B47E",
  REPLICATION_ALERT:  "#FACC15",
};

const AuditTrail = () => {
  const [filterResult, setFilterResult] = useState<"all" | "success" | "failure" | "warning">("all");
  const [filterUser, setFilterUser] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const filtered = auditEntries.filter((e) => {
    const resultOk = filterResult === "all" || e.result === filterResult;
    const userOk = !filterUser || e.user.toLowerCase().includes(filterUser.toLowerCase());
    const actionOk = !filterAction || e.action.toLowerCase().includes(filterAction.toLowerCase());
    return resultOk && userOk && actionOk;
  });

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => { setExporting(false); setExportDone(true); setTimeout(() => { setExportDone(false); setShowExportModal(false); }, 2000); }, 2000);
  };

  const failureCount = auditEntries.filter((e) => e.result === "failure").length;
  const warningCount = auditEntries.filter((e) => e.result === "warning").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(201,74,94,0.1)", border: "1px solid rgba(201,74,94,0.2)" }}>
            <i className="ri-lock-line text-red-400 text-xs" />
            <span className="text-red-400 text-xs font-semibold font-['JetBrains_Mono']">IMMUTABLE LOG</span>
          </div>
          <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{auditEntries.length} total entries</span>
          {failureCount > 0 && (
            <span className="flex items-center gap-1 text-xs font-['JetBrains_Mono']" style={{ color: "#C94A5E" }}>
              <i className="ri-close-circle-line" />{failureCount} failures
            </span>
          )}
          {warningCount > 0 && (
            <span className="flex items-center gap-1 text-xs font-['JetBrains_Mono']" style={{ color: "#FACC15" }}>
              <i className="ri-alert-line" />{warningCount} warnings
            </span>
          )}
        </div>
        <button onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
          style={{ background: "transparent", border: "1px solid rgba(184,138,60,0.4)", color: "#D6B47E" }}>
          <i className="ri-file-pdf-line" />Export PDF + Digital Signature
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1.5">
          {(["all", "success", "failure", "warning"] as const).map((r) => (
            <button key={r} onClick={() => setFilterResult(r)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap capitalize"
              style={{
                background: filterResult === r ? (r === "all" ? "#D6B47E" : resultConfig[r]?.bg || "rgba(184,138,60,0.1)") : "rgba(255,255,255,0.04)",
                color: filterResult === r ? (r === "all" ? "#051428" : resultConfig[r]?.color || "#D6B47E") : "#9CA3AF",
                border: filterResult === r ? "none" : "1px solid rgba(255,255,255,0.06)",
              }}>
              {r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
        <input value={filterUser} onChange={(e) => setFilterUser(e.target.value)} placeholder="Filter by user..."
          className="px-3 py-1.5 rounded-lg text-xs outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,138,60,0.15)", color: "#D1D5DB", fontFamily: "'JetBrains Mono', monospace", width: "160px" }} />
        <input value={filterAction} onChange={(e) => setFilterAction(e.target.value)} placeholder="Filter by action..."
          className="px-3 py-1.5 rounded-lg text-xs outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,138,60,0.15)", color: "#D1D5DB", fontFamily: "'JetBrains Mono', monospace", width: "160px" }} />
        {(filterUser || filterAction || filterResult !== "all") && (
          <button onClick={() => { setFilterUser(""); setFilterAction(""); setFilterResult("all"); }}
            className="px-3 py-1.5 rounded-lg text-xs cursor-pointer" style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF" }}>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(184,138,60,0.12)" }}>
        <div className="grid px-4 py-3 text-xs font-semibold uppercase tracking-wider font-['Inter'] text-gray-600"
          style={{ background: "rgba(184,138,60,0.04)", gridTemplateColumns: "1.6fr 1fr 1.2fr 1.5fr 1fr 1fr" }}>
          <span>Timestamp</span><span>User</span><span>Action</span><span>Target</span><span>IP Address</span><span>Result</span>
        </div>

        <div className="max-h-[540px] overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(184,138,60,0.2) transparent" }}>
          {filtered.map((entry, idx) => {
            const rc = resultConfig[entry.result];
            const ac = actionColors[entry.action] || "#9CA3AF";
            const isExpanded = expandedId === entry.id;
            return (
              <div key={entry.id} style={{ borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <div
                  className="grid px-4 py-3 items-center cursor-pointer hover:bg-white/[0.02] transition-colors"
                  style={{ gridTemplateColumns: "1.6fr 1fr 1.2fr 1.5fr 1fr 1fr" }}
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                >
                  <div className="flex items-center gap-2">
                    <i className={isExpanded ? "ri-arrow-down-s-line text-gray-600 text-xs" : "ri-arrow-right-s-line text-gray-600 text-xs"} />
                    <span className="text-gray-400 text-xs font-['JetBrains_Mono']">{entry.timestamp}</span>
                  </div>
                  <div>
                    <p className="text-white text-xs font-['JetBrains_Mono']">{entry.user}</p>
                    <p className="text-gray-600 text-xs font-['Inter']">{entry.role}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono'] font-semibold w-fit" style={{ background: `${ac}18`, color: ac }}>
                    {entry.action}
                  </span>
                  <span className="text-gray-300 text-xs font-['Inter'] truncate pr-2">{entry.target}</span>
                  <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{entry.ip}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 flex items-center justify-center rounded flex-shrink-0" style={{ background: rc.bg }}>
                      <i className={`${rc.icon} text-xs`} style={{ color: rc.color }} />
                    </div>
                    <span className="text-xs font-['Inter'] capitalize" style={{ color: rc.color }}>{entry.result}</span>
                  </div>
                </div>
                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-10 pb-3 pt-1" style={{ background: "rgba(184,138,60,0.02)", borderTop: "1px solid rgba(184,138,60,0.06)" }}>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-600 text-xs uppercase tracking-wider font-['Inter'] mb-1">Details</p>
                        <p className="text-gray-300 text-xs font-['Inter']">{entry.details}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs uppercase tracking-wider font-['Inter'] mb-1">Full Timestamp</p>
                        <p className="text-gold-400 text-xs font-['JetBrains_Mono']">{entry.timestamp}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs uppercase tracking-wider font-['Inter'] mb-1">Source IP</p>
                        <p className="text-gray-300 text-xs font-['JetBrains_Mono']">{entry.ip}</p>
                        {entry.ip.startsWith("185.") && (
                          <p className="text-red-400 text-xs font-['JetBrains_Mono'] mt-0.5">⚠ External IP — Flagged</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination hint */}
      <div className="flex items-center justify-between text-xs text-gray-600 font-['JetBrains_Mono']">
        <span>Showing {filtered.length} of {auditEntries.length} entries</span>
        <span className="text-gold-400/50">Infinite scroll — load more on demand</span>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="rounded-2xl p-6 w-96" style={{ background: "rgba(10,37,64,0.98)", border: "1px solid rgba(184,138,60,0.2)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: "rgba(184,138,60,0.1)" }}>
                <i className="ri-file-pdf-line text-gold-400 text-lg" />
              </div>
              <div>
                <h3 className="text-white font-semibold font-['Inter']">Export Audit Trail</h3>
                <p className="text-gray-500 text-xs font-['Inter']">PDF with digital signature</p>
              </div>
            </div>
            <div className="space-y-3 mb-5">
              {[
                { label: "Records to Export", value: `${filtered.length} entries` },
                { label: "Date Range", value: "All time" },
                { label: "Digital Signature", value: "SHA-256 + RSA-4096" },
                { label: "Signed By", value: "admin.khalid (System Admin)" },
                { label: "Timestamp", value: new Date().toISOString().slice(0, 19).replace("T", " ") },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs font-['Inter']">{item.label}</span>
                  <span className="text-white text-xs font-['JetBrains_Mono']">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg mb-4" style={{ background: "rgba(184,138,60,0.05)", border: "1px solid rgba(184,138,60,0.1)" }}>
              <p className="text-gold-400 text-xs font-['Inter']">
                <i className="ri-information-line mr-1" />
                This export will be cryptographically signed and logged in the audit trail. The PDF cannot be modified without invalidating the signature.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleExport} disabled={exporting}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap"
                style={{ background: exporting ? "rgba(184,138,60,0.4)" : "#D6B47E", color: "#051428" }}>
                {exporting ? <><i className="ri-loader-4-line animate-spin mr-2" />Generating...</> : exportDone ? <><i className="ri-check-line mr-2" />Done!</> : <><i className="ri-download-line mr-2" />Generate & Download</>}
              </button>
              <button onClick={() => setShowExportModal(false)}
                className="px-4 py-2.5 rounded-lg text-sm cursor-pointer whitespace-nowrap"
                style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditTrail;
