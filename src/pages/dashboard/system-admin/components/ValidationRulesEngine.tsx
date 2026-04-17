import { useState } from "react";
import { validationRules as initialRules, streams, type ValidationRule } from "@/mocks/systemAdminData";

const actionConfig: Record<string, { label: string; color: string; bg: string }> = {
  reject:       { label: "Reject",       color: "#C94A5E", bg: "rgba(201,74,94,0.12)" },
  flag:         { label: "Flag",         color: "#FACC15", bg: "rgba(250,204,21,0.12)" },
  accept_warn:  { label: "Accept+Warn",  color: "#C98A1B", bg: "rgba(201,138,27,0.12)" },
  auto_correct: { label: "Auto-Correct", color: "#4ADE80", bg: "rgba(74,222,128,0.12)" },
};

const operatorLabels: Record<string, string> = {
  regex:        "matches regex",
  in_list:      "is in list",
  greater_than: "greater than",
  less_than:    "less than",
  equals:       "equals",
  contains:     "contains",
};

const prebuiltLibrary = [
  { name: "Passport Number Format", stream: "AMN-BRD", field: "passportNumber", operator: "regex", value: "^[A-Z]{1,2}[0-9]{6,9}$", action: "reject" as const },
  { name: "High-Risk Country Wire", stream: "AMN-FIN", field: "destinationCountry", operator: "in_list", value: "FATF High-Risk List", action: "flag" as const },
  { name: "Overstay Detection", stream: "AMN-BRD", field: "stayDays", operator: "greater_than", value: "visaAllowedDays", action: "flag" as const },
  { name: "Duplicate SIM IMEI", stream: "AMN-MOB", field: "imei", operator: "in_list", value: "Active IMEI Registry", action: "flag" as const },
  { name: "Cargo Value Mismatch", stream: "AMN-CST", field: "declaredValue", operator: "less_than", value: "estimatedMarketValue * 0.5", action: "flag" as const },
  { name: "Employment Sector Mismatch", stream: "AMN-EMP", field: "sector", operator: "in_list", value: "Approved Sector Codes", action: "reject" as const },
];

const ValidationRulesEngine = () => {
  const [rules, setRules] = useState<ValidationRule[]>(initialRules);
  const [testJson, setTestJson] = useState(`{\n  "documentNumber": "AB123456",\n  "nationality": "OMN",\n  "checkInDate": "2026-04-05",\n  "checkOutDate": "2026-04-03",\n  "amount": 15000\n}`);
  const [testResult, setTestResult] = useState<null | { passed: number; failed: number; details: { rule: string; action: string; result: "pass" | "fail"; reason: string }[] }>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [filterStream, setFilterStream] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [newRule, setNewRule] = useState({ name: "", stream: "AMN-HTL", field: "", operator: "regex", value: "", action: "reject" as keyof typeof actionConfig });
  const [running, setRunning] = useState(false);

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const runTest = () => {
    setRunning(true);
    setTimeout(() => {
      const details = rules.filter((r) => r.enabled).map((r) => {
        const pass = Math.random() > 0.3;
        return {
          rule: r.name,
          action: r.action,
          result: pass ? "pass" as const : "fail" as const,
          reason: pass ? "Condition satisfied — event accepted" : `Field '${r.field}' failed ${operatorLabels[r.operator]} check`,
        };
      });
      const passed = details.filter((d) => d.result === "pass").length;
      setTestResult({ passed, failed: details.length - passed, details });
      setRunning(false);
    }, 1200);
  };

  const streamCodes = ["all", ...Array.from(new Set(rules.map((r) => r.stream)))];
  const actions = ["all", "reject", "flag", "accept_warn", "auto_correct"];

  const filtered = rules.filter((r) => {
    const streamOk = filterStream === "all" || r.stream === filterStream;
    const actionOk = filterAction === "all" || r.action === filterAction;
    return streamOk && actionOk;
  });

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Rules", value: String(rules.length), color: "#D6B47E" },
          { label: "Active Rules", value: String(rules.filter((r) => r.enabled).length), color: "#4ADE80" },
          { label: "Triggered Today", value: String(rules.reduce((a, r) => a + r.triggeredToday, 0)), color: "#FACC15" },
          { label: "Reject Rules", value: String(rules.filter((r) => r.action === "reject").length), color: "#C94A5E" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.12)" }}>
            <p className="text-2xl font-bold font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</p>
            <p className="text-gray-500 text-xs font-['Inter'] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Rules list */}
        <div className="col-span-2 space-y-3">
          {/* Filters + Add */}
          <div className="flex items-center gap-2 flex-wrap">
            <select value={filterStream} onChange={(e) => setFilterStream(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs outline-none cursor-pointer"
              style={{ background: "rgba(10,37,64,0.9)", border: "1px solid rgba(184,138,60,0.2)", color: "#D1D5DB", fontFamily: "'JetBrains Mono', monospace" }}>
              {streamCodes.map((s) => <option key={s} value={s} style={{ background: "#0A2540" }}>{s === "all" ? "All Streams" : s}</option>)}
            </select>
            <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs outline-none cursor-pointer"
              style={{ background: "rgba(10,37,64,0.9)", border: "1px solid rgba(184,138,60,0.2)", color: "#D1D5DB", fontFamily: "'Inter', sans-serif" }}>
              {actions.map((a) => <option key={a} value={a} style={{ background: "#0A2540" }}>{a === "all" ? "All Actions" : actionConfig[a]?.label || a}</option>)}
            </select>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => setShowLibrary(!showLibrary)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                style={{ background: "transparent", border: "1px solid rgba(184,138,60,0.3)", color: "#D6B47E" }}>
                <i className="ri-book-2-line mr-1" />Pre-built Library
              </button>
              <button onClick={() => setShowBuilder(!showBuilder)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                style={{ background: "#D6B47E", color: "#051428" }}>
                <i className="ri-add-line mr-1" />New Rule
              </button>
            </div>
          </div>

          {/* Pre-built Library */}
          {showLibrary && (
            <div className="rounded-xl p-4" style={{ background: "rgba(184,138,60,0.03)", border: "1px solid rgba(184,138,60,0.15)" }}>
              <p className="text-gold-400 text-sm font-semibold font-['Inter'] mb-3">
                <i className="ri-book-2-line mr-2" />Pre-built Rule Library
              </p>
              <div className="grid grid-cols-2 gap-2">
                {prebuiltLibrary.map((lib) => {
                  const ac = actionConfig[lib.action];
                  return (
                    <div key={lib.name} className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-['Inter'] font-medium truncate">{lib.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-['JetBrains_Mono']" style={{ color: "#D6B47E" }}>{lib.stream}</span>
                          <span className="text-gray-600 text-xs">·</span>
                          <span className="text-xs font-['JetBrains_Mono']" style={{ color: ac.color }}>{ac.label}</span>
                        </div>
                      </div>
                      <button className="ml-2 px-2 py-1 rounded text-xs cursor-pointer whitespace-nowrap flex-shrink-0"
                        style={{ background: "rgba(184,138,60,0.1)", color: "#D6B47E" }}>
                        <i className="ri-add-line" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* New Rule Builder */}
          {showBuilder && (
            <div className="rounded-xl p-4" style={{ background: "rgba(184,138,60,0.04)", border: "1px solid rgba(184,138,60,0.2)" }}>
              <p className="text-gold-400 text-sm font-semibold font-['Inter'] mb-3">
                <i className="ri-add-circle-line mr-2" />Visual Rule Builder
              </p>
              {/* IF/THEN visual builder */}
              <div className="flex items-center gap-2 mb-4 p-3 rounded-lg flex-wrap" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(184,138,60,0.1)" }}>
                <span className="px-2 py-1 rounded text-xs font-['JetBrains_Mono'] font-bold" style={{ background: "rgba(184,138,60,0.15)", color: "#D6B47E" }}>IF</span>
                <input value={newRule.field} onChange={(e) => setNewRule((p) => ({ ...p, field: e.target.value }))}
                  placeholder="field name" className="px-2 py-1 rounded text-xs outline-none w-28"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,138,60,0.2)", color: "#D1D5DB", fontFamily: "'JetBrains Mono', monospace" }} />
                <select value={newRule.operator} onChange={(e) => setNewRule((p) => ({ ...p, operator: e.target.value }))}
                  className="px-2 py-1 rounded text-xs outline-none cursor-pointer"
                  style={{ background: "rgba(10,37,64,0.9)", border: "1px solid rgba(184,138,60,0.2)", color: "#9CA3AF" }}>
                  {Object.entries(operatorLabels).map(([k, v]) => <option key={k} value={k} style={{ background: "#0A2540" }}>{v}</option>)}
                </select>
                <input value={newRule.value} onChange={(e) => setNewRule((p) => ({ ...p, value: e.target.value }))}
                  placeholder="value / pattern" className="px-2 py-1 rounded text-xs outline-none flex-1 min-w-24"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,138,60,0.2)", color: "#D6B47E", fontFamily: "'JetBrains Mono', monospace" }} />
                <span className="px-2 py-1 rounded text-xs font-['JetBrains_Mono'] font-bold" style={{ background: "rgba(201,138,27,0.15)", color: "#C98A1B" }}>THEN</span>
                <select value={newRule.action} onChange={(e) => setNewRule((p) => ({ ...p, action: e.target.value as keyof typeof actionConfig }))}
                  className="px-2 py-1 rounded text-xs outline-none cursor-pointer"
                  style={{ background: "rgba(10,37,64,0.9)", border: "1px solid rgba(184,138,60,0.2)", color: actionConfig[newRule.action]?.color || "#D1D5DB" }}>
                  {Object.entries(actionConfig).map(([k, v]) => <option key={k} value={k} style={{ background: "#0A2540" }}>{v.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-['Inter']">Rule Name</label>
                  <input value={newRule.name} onChange={(e) => setNewRule((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Passport Expiry Check"
                    className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,138,60,0.2)", color: "#D1D5DB", fontFamily: "'Inter', sans-serif" }} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-['Inter']">Stream</label>
                  <select value={newRule.stream} onChange={(e) => setNewRule((p) => ({ ...p, stream: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-xs outline-none cursor-pointer"
                    style={{ background: "rgba(10,37,64,0.9)", border: "1px solid rgba(184,138,60,0.2)", color: "#D1D5DB" }}>
                    {streams.map((s) => <option key={s.code} value={s.code} style={{ background: "#0A2540" }}>{s.code} — {s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap" style={{ background: "#D6B47E", color: "#051428" }}>
                  <i className="ri-save-line mr-1" />Save Rule
                </button>
                <button onClick={() => setShowBuilder(false)} className="px-4 py-2 rounded-lg text-xs cursor-pointer" style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Rules */}
          <div className="space-y-2">
            {filtered.map((rule) => {
              const ac = actionConfig[rule.action];
              return (
                <div key={rule.id} className="rounded-xl p-4" style={{ background: "rgba(10,37,64,0.8)", border: `1px solid ${rule.enabled ? "rgba(184,138,60,0.12)" : "rgba(255,255,255,0.05)"}`, opacity: rule.enabled ? 1 : 0.6 }}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-white text-sm font-semibold font-['Inter']">{rule.name}</span>
                        <span className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono']" style={{ background: "rgba(184,138,60,0.1)", color: "#D6B47E" }}>{rule.stream}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-['Inter']" style={{ background: ac.bg, color: ac.color }}>{ac.label}</span>
                      </div>
                      {/* IF/THEN visual */}
                      <div className="flex items-center gap-2 flex-wrap p-2 rounded-lg mb-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                        <span className="px-1.5 py-0.5 rounded text-xs font-['JetBrains_Mono'] font-bold" style={{ background: "rgba(184,138,60,0.12)", color: "#D6B47E" }}>IF</span>
                        <span className="text-gold-300 text-xs font-['JetBrains_Mono']">{rule.field}</span>
                        <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{operatorLabels[rule.operator]}</span>
                        <span className="text-white text-xs font-['JetBrains_Mono'] truncate max-w-[180px]">{rule.value}</span>
                        <span className="px-1.5 py-0.5 rounded text-xs font-['JetBrains_Mono'] font-bold" style={{ background: `${ac.color}18`, color: ac.color }}>THEN {ac.label.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600 text-xs font-['JetBrains_Mono']">Today: <span className="text-yellow-400">{rule.triggeredToday}</span></span>
                        <span className="text-gray-600 text-xs font-['JetBrains_Mono']">Last: <span className="text-gray-400">{rule.lastTriggered}</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => toggleRule(rule.id)}
                        className="relative inline-flex items-center w-9 h-5 rounded-full transition-colors cursor-pointer"
                        style={{ background: rule.enabled ? "#D6B47E" : "rgba(255,255,255,0.1)" }}>
                        <span className="inline-block w-3 h-3 rounded-full bg-white transition-transform" style={{ transform: rule.enabled ? "translateX(20px)" : "translateX(3px)" }} />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer hover:bg-white/5 transition-colors" style={{ color: "#9CA3AF" }}>
                        <i className="ri-edit-line text-sm" />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer hover:bg-red-500/10 transition-colors" style={{ color: "#C94A5E" }}>
                        <i className="ri-delete-bin-line text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Test Panel */}
        <div className="space-y-3">
          <div className="rounded-xl p-4" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.12)" }}>
            <p className="text-white text-sm font-semibold font-['Inter'] mb-1">
              <i className="ri-test-tube-line mr-2 text-gold-400" />Test Rule Engine
            </p>
            <p className="text-gray-500 text-xs font-['Inter'] mb-3">Paste event JSON to test against all active rules:</p>
            <textarea value={testJson} onChange={(e) => setTestJson(e.target.value)} rows={9}
              className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(184,138,60,0.15)", color: "#D6B47E", fontFamily: "'JetBrains Mono', monospace" }} />
            <button onClick={runTest} disabled={running}
              className="w-full mt-3 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-all"
              style={{ background: running ? "rgba(184,138,60,0.4)" : "#D6B47E", color: "#051428" }}>
              {running ? <><i className="ri-loader-4-line animate-spin mr-2" />Running...</> : <><i className="ri-play-line mr-2" />Run Test</>}
            </button>
          </div>

          {testResult && (
            <div className="rounded-xl p-4" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.12)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 text-center p-2 rounded-lg" style={{ background: "rgba(74,222,128,0.1)" }}>
                  <p className="text-green-400 text-xl font-bold font-['JetBrains_Mono']">{testResult.passed}</p>
                  <p className="text-green-400 text-xs font-['Inter']">PASS</p>
                </div>
                <div className="flex-1 text-center p-2 rounded-lg" style={{ background: "rgba(201,74,94,0.1)" }}>
                  <p className="text-red-400 text-xl font-bold font-['JetBrains_Mono']">{testResult.failed}</p>
                  <p className="text-red-400 text-xs font-['Inter']">FAIL</p>
                </div>
              </div>
              <div className="space-y-1.5 max-h-64 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                {testResult.details.map((d, i) => {
                  const ac = actionConfig[d.action];
                  return (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <i className={`text-xs mt-0.5 flex-shrink-0 ${d.result === "pass" ? "ri-check-line text-green-400" : "ri-close-line text-red-400"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-white text-xs font-['Inter'] truncate">{d.rule}</p>
                          {d.result === "fail" && ac && (
                            <span className="text-xs font-['JetBrains_Mono'] flex-shrink-0" style={{ color: ac.color }}>{ac.label}</span>
                          )}
                        </div>
                        <p className="text-gray-600 text-xs font-['JetBrains_Mono']">{d.reason}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidationRulesEngine;
