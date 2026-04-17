import { useState } from "react";
import { patternRules, type PatternRule } from "@/mocks/systemAdminData";

const severityConfig: Record<string, { color: string; bg: string }> = {
  critical: { color: "#F87171", bg: "rgba(248,113,113,0.12)" },
  high:     { color: "#FB923C", bg: "rgba(251,146,60,0.12)" },
  medium:   { color: "#FACC15", bg: "rgba(250,204,21,0.12)" },
  low:      { color: "#D4A84B", bg: "rgba(181,142,60,0.12)" },
};

const PredictiveAdmin = () => {
  const [rules, setRules] = useState<PatternRule[]>(patternRules);
  const [sortBy, setSortBy] = useState<"triggeredTotal" | "falsePositiveRate" | "precision" | "triggeredToday">("triggeredTotal");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeMetricTab, setActiveMetricTab] = useState<"precision" | "fpr" | "recall">("precision");

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const categories = ["all", ...Array.from(new Set(rules.map((r) => r.category)))];
  const severities = ["all", "critical", "high", "medium", "low"];

  const filtered = rules
    .filter((r) => (filterCategory === "all" || r.category === filterCategory) && (filterSeverity === "all" || r.severity === filterSeverity))
    .sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number));

  const avgPrecision = (rules.reduce((a, r) => a + r.precision, 0) / rules.length).toFixed(1);
  const avgFPR = (rules.reduce((a, r) => a + r.falsePositiveRate, 0) / rules.length).toFixed(1);
  const avgRecall = (rules.reduce((a, r) => a + r.recall, 0) / rules.length).toFixed(1);
  const f1Score = ((2 * parseFloat(avgPrecision) * parseFloat(avgRecall)) / (parseFloat(avgPrecision) + parseFloat(avgRecall))).toFixed(1);
  const totalTriggered = rules.reduce((a, r) => a + r.triggeredToday, 0);
  const activeCount = rules.filter((r) => r.enabled).length;

  const metricData = {
    precision: [...rules].sort((a, b) => b.precision - a.precision),
    fpr: [...rules].sort((a, b) => b.falsePositiveRate - a.falsePositiveRate),
    recall: [...rules].sort((a, b) => b.recall - a.recall),
  };

  return (
    <div className="space-y-4">
      {/* Model Performance Overview */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Active Rules", value: String(activeCount), sub: `of ${rules.length} total`, color: "#D4A84B", icon: "ri-git-branch-line" },
          { label: "Avg Precision", value: `${avgPrecision}%`, sub: "true positive rate", color: "#4ADE80", icon: "ri-focus-3-line" },
          { label: "Avg Recall", value: `${avgRecall}%`, sub: "sensitivity", color: "#A78BFA", icon: "ri-radar-line" },
          { label: "F1 Score", value: `${f1Score}%`, sub: "harmonic mean", color: "#D4A84B", icon: "ri-bar-chart-grouped-line" },
          { label: "Avg False Positive", value: `${avgFPR}%`, sub: "false positive rate", color: "#FACC15", icon: "ri-error-warning-line" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-4" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.12)" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: `${s.color}18` }}>
                <i className={`${s.icon} text-sm`} style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</p>
            <p className="text-white text-xs font-['Inter'] mt-0.5">{s.label}</p>
            <p className="text-gray-600 text-xs font-['Inter']">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Metrics Charts */}
      <div className="rounded-xl p-5" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.12)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-sm font-['Inter']">
            <i className="ri-bar-chart-horizontal-line mr-2 text-gold-400" />Rule Performance Metrics
          </h3>
          <div className="flex gap-1.5">
            {[
              { id: "precision", label: "Precision", color: "#D4A84B" },
              { id: "fpr", label: "False Positive Rate", color: "#FACC15" },
              { id: "recall", label: "Recall", color: "#A78BFA" },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveMetricTab(tab.id as typeof activeMetricTab)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
                style={{
                  background: activeMetricTab === tab.id ? `${tab.color}18` : "rgba(255,255,255,0.04)",
                  color: activeMetricTab === tab.id ? tab.color : "#9CA3AF",
                  border: activeMetricTab === tab.id ? `1px solid ${tab.color}30` : "1px solid rgba(255,255,255,0.06)",
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {metricData[activeMetricTab].map((rule, i) => {
            const val = activeMetricTab === "precision" ? rule.precision : activeMetricTab === "fpr" ? rule.falsePositiveRate : rule.recall;
            const maxVal = activeMetricTab === "fpr" ? 25 : 100;
            const color = activeMetricTab === "fpr"
              ? (val > 15 ? "#F87171" : val > 8 ? "#FACC15" : "#4ADE80")
              : activeMetricTab === "precision" ? "#D4A84B" : "#A78BFA";
            const sc = severityConfig[rule.severity];
            return (
              <div key={rule.id} className="flex items-center gap-3">
                <span className="text-gray-600 text-xs font-['JetBrains_Mono'] w-4 flex-shrink-0">#{i + 1}</span>
                <span className="text-gray-300 text-xs font-['Inter'] w-44 truncate flex-shrink-0">{rule.name}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(val / maxVal) * 100}%`, background: color }} />
                </div>
                <span className="text-xs font-['JetBrains_Mono'] w-12 text-right flex-shrink-0" style={{ color }}>{val}%</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] flex-shrink-0 w-16 text-center" style={{ background: sc.bg, color: sc.color }}>{rule.severity}</span>
                {activeMetricTab === "fpr" && (
                  <span className="text-xs font-['JetBrains_Mono'] text-gray-600 w-16 flex-shrink-0">
                    {val > 15 ? "⚠ Review" : val > 8 ? "Monitor" : "✓ Good"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rule Management Table */}
      <div>
        {/* Filters */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setFilterCategory(c)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap capitalize"
                style={{ background: filterCategory === c ? "#D4A84B" : "rgba(255,255,255,0.04)", color: filterCategory === c ? "#0B1220" : "#9CA3AF", border: filterCategory === c ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
                {c === "all" ? "All Categories" : c}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {severities.map((s) => {
              const sc = s !== "all" ? severityConfig[s] : null;
              return (
                <button key={s} onClick={() => setFilterSeverity(s)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap capitalize"
                  style={{ background: filterSeverity === s ? (sc?.bg || "rgba(181,142,60,0.12)") : "rgba(255,255,255,0.04)", color: filterSeverity === s ? (sc?.color || "#D4A84B") : "#9CA3AF", border: filterSeverity === s ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
                  {s === "all" ? "All Severity" : s}
                </button>
              );
            })}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-gray-600 text-xs font-['Inter']">Sort by:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-1.5 rounded-lg text-xs outline-none cursor-pointer"
              style={{ background: "rgba(20,29,46,0.9)", border: "1px solid rgba(181,142,60,0.2)", color: "#D1D5DB" }}>
              <option value="triggeredTotal" style={{ background: "#141D2E" }}>Total Triggers</option>
              <option value="triggeredToday" style={{ background: "#141D2E" }}>Today&apos;s Triggers</option>
              <option value="falsePositiveRate" style={{ background: "#141D2E" }}>False Positive Rate</option>
              <option value="precision" style={{ background: "#141D2E" }}>Precision</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(181,142,60,0.12)" }}>
          <div className="grid px-4 py-3 text-xs font-semibold uppercase tracking-wider font-['Inter'] text-gray-600"
            style={{ background: "rgba(181,142,60,0.04)", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr 70px" }}>
            <span>Rule</span><span>Category</span><span>Severity</span><span>Today</span><span>Total</span><span>Precision</span><span>FP Rate</span><span className="text-center">Enable</span>
          </div>

          {filtered.map((rule, idx) => {
            const sc = severityConfig[rule.severity];
            const isExpanded = expandedId === rule.id;
            return (
              <div key={rule.id}>
                <div
                  className="grid px-4 py-3 items-center cursor-pointer hover:bg-white/[0.02] transition-colors"
                  style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr 70px", borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.04)" : "none", opacity: rule.enabled ? 1 : 0.55 }}
                  onClick={() => setExpandedId(isExpanded ? null : rule.id)}
                >
                  <div>
                    <p className="text-white text-xs font-['Inter'] font-medium">{rule.name}</p>
                    <p className="text-gray-600 text-xs font-['JetBrains_Mono']">Last: {rule.lastTriggered}</p>
                  </div>
                  <span className="text-gray-400 text-xs font-['Inter']">{rule.category}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] w-fit capitalize" style={{ background: sc.bg, color: sc.color }}>{rule.severity}</span>
                  <span className="text-gold-400 text-xs font-['JetBrains_Mono']">{rule.triggeredToday}</span>
                  <span className="text-white text-xs font-['JetBrains_Mono']">{rule.triggeredTotal.toLocaleString()}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${rule.precision}%`, background: "#D4A84B" }} />
                    </div>
                    <span className="text-gold-400 text-xs font-['JetBrains_Mono']">{rule.precision}%</span>
                  </div>
                  <span className="text-xs font-['JetBrains_Mono']" style={{ color: rule.falsePositiveRate > 15 ? "#F87171" : rule.falsePositiveRate > 8 ? "#FACC15" : "#4ADE80" }}>
                    {rule.falsePositiveRate}%
                  </span>
                  <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleRule(rule.id)}
                      className="relative inline-flex items-center w-9 h-5 rounded-full transition-colors cursor-pointer"
                      style={{ background: rule.enabled ? "#D4A84B" : "rgba(255,255,255,0.1)" }}>
                      <span className="inline-block w-3 h-3 rounded-full bg-white transition-transform" style={{ transform: rule.enabled ? "translateX(20px)" : "translateX(3px)" }} />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-3" style={{ background: "rgba(181,142,60,0.02)", borderTop: "1px solid rgba(181,142,60,0.06)" }}>
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-['Inter'] mb-1">Condition Logic</p>
                        <p className="text-gold-300 text-xs font-['JetBrains_Mono'] leading-relaxed">{rule.conditions}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-['Inter'] mb-2">Precision</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div className="h-full rounded-full" style={{ width: `${rule.precision}%`, background: "#D4A84B" }} />
                          </div>
                          <span className="text-gold-400 text-xs font-['JetBrains_Mono']">{rule.precision}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-['Inter'] mb-2">Recall</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div className="h-full rounded-full" style={{ width: `${rule.recall}%`, background: "#A78BFA" }} />
                          </div>
                          <span className="text-purple-400 text-xs font-['JetBrains_Mono']">{rule.recall}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-['Inter'] mb-2">False Positive Rate</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div className="h-full rounded-full" style={{ width: `${Math.min(rule.falsePositiveRate * 4, 100)}%`, background: rule.falsePositiveRate > 15 ? "#F87171" : rule.falsePositiveRate > 8 ? "#FACC15" : "#4ADE80" }} />
                          </div>
                          <span className="text-xs font-['JetBrains_Mono']" style={{ color: rule.falsePositiveRate > 15 ? "#F87171" : rule.falsePositiveRate > 8 ? "#FACC15" : "#4ADE80" }}>{rule.falsePositiveRate}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingId(editingId === rule.id ? null : rule.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                        style={{ background: "#D4A84B", color: "#0B1220" }}>
                        <i className="ri-edit-line mr-1" />Edit Rule
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs cursor-pointer whitespace-nowrap"
                        style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <i className="ri-test-tube-line mr-1" />Test Rule
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs cursor-pointer whitespace-nowrap"
                        style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <i className="ri-history-line mr-1" />Trigger History
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs cursor-pointer whitespace-nowrap"
                        style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                        <i className="ri-delete-bin-line mr-1" />Delete
                      </button>
                      <div className="ml-auto flex items-center gap-2">
                        <span className="text-gray-600 text-xs font-['JetBrains_Mono']">F1 Score:</span>
                        <span className="text-gold-400 text-xs font-['JetBrains_Mono'] font-bold">
                          {((2 * rule.precision * rule.recall) / (rule.precision + rule.recall)).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    {editingId === rule.id && (
                      <div className="mt-3 p-3 rounded-lg" style={{ background: "rgba(181,142,60,0.04)", border: "1px solid rgba(181,142,60,0.15)" }}>
                        <p className="text-gold-400 text-xs font-semibold font-['Inter'] mb-2">Edit Rule Conditions</p>
                        <textarea defaultValue={rule.conditions} rows={2}
                          className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(181,142,60,0.2)", color: "#D4A84B", fontFamily: "'JetBrains Mono', monospace" }} />
                        <div className="flex gap-2 mt-2">
                          <button className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap" style={{ background: "#D4A84B", color: "#0B1220" }}>Save Changes</button>
                          <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg text-xs cursor-pointer" style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF" }}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PredictiveAdmin;
