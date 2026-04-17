import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import {
  PRE_BUILT_RULES, CATEGORY_META, RISK_CONFIG,
  STREAM_OPTIONS, EVENT_OPTIONS, OPERATOR_OPTIONS, ACTION_OPTIONS,
  TEST_PERSON_RESULTS,
} from "@/mocks/patternEngineData";
import type { PatternRule, RuleCategory, RiskLevel, RuleCondition } from "@/mocks/patternEngineData";

type Tab = "rules" | "builder" | "test";

const uid = () => Math.random().toString(36).slice(2, 8);

const ActionPill = ({ label }: { label: string }) => {
  const colors: Record<string, { color: string; bg: string }> = {
    "Create Alert":     { color: "#D4A84B", bg: "rgba(181,142,60,0.1)"  },
    "Assign to Team":   { color: "#4ADE80", bg: "rgba(74,222,128,0.1)"  },
    "Push to Mobile":   { color: "#A78BFA", bg: "rgba(167,139,250,0.1)" },
    "Auto-Escalate":    { color: "#F87171", bg: "rgba(248,113,113,0.1)" },
    "Add to Watchlist": { color: "#FACC15", bg: "rgba(250,204,21,0.1)"  },
  };
  const c = colors[label] ?? { color: "#9CA3AF", bg: "rgba(156,163,175,0.1)" };
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}25` }}>
      {label}
    </span>
  );
};

const RuleCard = ({
  rule, isAr, expanded, onToggleExpand, onToggleEnabled,
}: {
  rule: PatternRule; isAr: boolean; expanded: boolean;
  onToggleExpand: () => void; onToggleEnabled: () => void;
}) => {
  const catMeta = CATEGORY_META[rule.category];
  const riskCfg = RISK_CONFIG[rule.riskLevel];
  return (
    <div className="rounded-2xl border overflow-hidden transition-all"
      style={{
        background: "rgba(20,29,46,0.85)",
        borderColor: rule.enabled ? `${riskCfg.color}22` : "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        opacity: rule.enabled ? 1 : 0.5,
        borderLeft: `3px solid ${rule.enabled ? riskCfg.color : "#374151"}`,
      }}>
      {/* Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(181,142,60,0.05)", background: `${riskCfg.color}04` }}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
              style={{ background: `${catMeta.color}12`, border: `1px solid ${catMeta.color}20` }}>
              <i className={`${catMeta.icon} text-xs`} style={{ color: catMeta.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white text-sm font-bold">{isAr ? rule.nameAr : rule.name}</span>
                <span className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: riskCfg.bg, color: riskCfg.color, border: `1px solid ${riskCfg.border}` }}>
                  {isAr ? riskCfg.labelAr : riskCfg.label}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-xs" style={{ color: catMeta.color }}>{isAr ? catMeta.labelAr : catMeta.label}</span>
                <span className="text-gray-700 text-xs">·</span>
                <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{isAr ? rule.timeframeAr : rule.timeframe}</span>
                <span className="text-gray-700 text-xs">·</span>
                <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{rule.id}</span>
              </div>
            </div>
          </div>
          {/* Toggle */}
          <button type="button" onClick={onToggleEnabled}
            className="relative flex-shrink-0 cursor-pointer mt-1"
            style={{ width: "36px", height: "20px" }}>
            <div className="absolute inset-0 rounded-full transition-colors"
              style={{ background: rule.enabled ? "rgba(181,142,60,0.2)" : "rgba(255,255,255,0.06)", border: `1px solid ${rule.enabled ? "rgba(181,142,60,0.4)" : "rgba(255,255,255,0.08)"}` }} />
            <div className="absolute top-0.5 rounded-full transition-all"
              style={{ width: "16px", height: "16px", left: rule.enabled ? "18px" : "2px", background: rule.enabled ? "#D4A84B" : "#4B5563" }} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        <p className="text-gray-400 text-xs leading-relaxed">{isAr ? rule.descriptionAr : rule.description}</p>

        {/* Stream badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {rule.streams.map((s) => (
            <span key={s} className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(181,142,60,0.06)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.12)" }}>
              {s}
            </span>
          ))}
        </div>

        {/* Expanded detail */}
        {expanded && (
          <div className="space-y-3 pt-2 border-t" style={{ borderColor: "rgba(181,142,60,0.06)" }}>
            <div>
              <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-2">{isAr ? "الشروط" : "Conditions"}</p>
              <div className="space-y-1.5">
                {(isAr ? rule.conditionsAr : rule.conditions).map((c, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg"
                    style={{ background: "rgba(181,142,60,0.03)", border: "1px solid rgba(181,142,60,0.07)" }}>
                    <span className="text-gold-400 font-bold font-['JetBrains_Mono'] flex-shrink-0 text-xs mt-0.5">
                      {i === 0 ? "IF" : "AND"}
                    </span>
                    <span className="text-gray-300 text-xs">{c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-2">{isAr ? "الإجراءات" : "Actions"}</p>
              <div className="flex flex-wrap gap-1.5">
                {rule.actions.map((a) => <ActionPill key={a} label={a} />)}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "rgba(181,142,60,0.05)" }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <i className="ri-pulse-line text-gold-400" style={{ fontSize: "10px" }} />
              <span className="text-gold-400 text-xs font-black font-['JetBrains_Mono']">{rule.hitCount}</span>
              <span className="text-gray-600 text-xs">{isAr ? "تطابق" : "hits"}</span>
            </div>
            <span className="text-gray-700 text-xs font-['JetBrains_Mono']">{rule.lastTriggered}</span>
          </div>
          <button type="button" onClick={onToggleExpand}
            className="flex items-center gap-1 text-xs cursor-pointer whitespace-nowrap transition-colors"
            style={{ color: expanded ? "#D4A84B" : "#6B7280" }}>
            {expanded ? (isAr ? "إخفاء" : "Hide") : (isAr ? "التفاصيل" : "Details")}
            <i className={`${expanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} text-xs`} />
          </button>
        </div>
      </div>
    </div>
  );
};

const PatternEnginePage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeTab, setActiveTab] = useState<Tab>("rules");
  const [currentTime, setCurrentTime] = useState(new Date());

  const [rules, setRules] = useState<PatternRule[]>(PRE_BUILT_RULES);
  const [filterCat, setFilterCat] = useState<RuleCategory | "all">("all");
  const [filterRisk, setFilterRisk] = useState<RiskLevel | "all">("all");
  const [searchQ, setSearchQ] = useState("");
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [showConcept, setShowConcept] = useState(true);

  const [builderName, setBuilderName] = useState("");
  const [builderConditions, setBuilderConditions] = useState<RuleCondition[]>([
    { id: uid(), stream: "Border", event: "Entry Recorded", operator: "equals", value: "", logic: undefined },
  ]);
  const [builderTimeframe, setBuilderTimeframe] = useState("24");
  const [builderTimeUnit, setBuilderTimeUnit] = useState("hours");
  const [builderLevel, setBuilderLevel] = useState<RiskLevel>("high");
  const [builderActions, setBuilderActions] = useState<string[]>(["Create Alert"]);
  const [savedMsg, setSavedMsg] = useState(false);

  const [testPersonId, setTestPersonId] = useState("");
  const [testRunning, setTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<typeof TEST_PERSON_RESULTS["PRS-001"] | null>(null);
  const [testDone, setTestDone] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const toggleRule = (id: string) => setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));

  const filteredRules = rules.filter((r) => {
    if (filterCat !== "all" && r.category !== filterCat) return false;
    if (filterRisk !== "all" && r.riskLevel !== filterRisk) return false;
    if (searchQ && !r.name.toLowerCase().includes(searchQ.toLowerCase()) && !r.nameAr.includes(searchQ)) return false;
    return true;
  });

  const groupedRules = (Object.keys(CATEGORY_META) as RuleCategory[]).reduce<Record<RuleCategory, PatternRule[]>>((acc, cat) => {
    acc[cat] = filteredRules.filter((r) => r.category === cat);
    return acc;
  }, {} as Record<RuleCategory, PatternRule[]>);

  const addCondition = () => {
    setBuilderConditions((prev) => [...prev, { id: uid(), stream: "Border", event: "Entry Recorded", operator: "equals", value: "", logic: "AND" }]);
  };
  const removeCondition = (id: string) => setBuilderConditions((prev) => prev.filter((c) => c.id !== id));
  const updateCondition = (id: string, field: keyof RuleCondition, value: string) => {
    setBuilderConditions((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value, ...(field === "stream" ? { event: EVENT_OPTIONS[value]?.[0] ?? "" } : {}) } : c));
  };
  const toggleAction = (action: string) => {
    setBuilderActions((prev) => prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action]);
  };
  const saveRule = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const runTest = () => {
    if (!testPersonId.trim()) return;
    setTestRunning(true);
    setTestDone(false);
    setTestResults(null);
    setTimeout(() => {
      const key = testPersonId.trim().toUpperCase();
      const results = TEST_PERSON_RESULTS[key] ?? TEST_PERSON_RESULTS["PRS-001"];
      setTestResults(results);
      setTestRunning(false);
      setTestDone(true);
    }, 1800);
  };

  const enabledCount = rules.filter((r) => r.enabled).length;
  const totalHits = rules.reduce((s, r) => s + r.hitCount, 0);
  const criticalCount = rules.filter((r) => r.riskLevel === "critical" && r.enabled).length;

  const TABS = [
    { id: "rules"   as Tab, icon: "ri-list-check-2",  label: "Pre-Built Rules",     labelAr: "القواعد المدمجة",       badge: enabledCount },
    { id: "builder" as Tab, icon: "ri-tools-line",     label: "Custom Rule Builder", labelAr: "منشئ القواعد المخصصة",  badge: 0 },
    { id: "test"    as Tab, icon: "ri-test-tube-line", label: "Test Mode",           labelAr: "وضع الاختبار",          badge: 0 },
  ];

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#0B1220" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(181,142,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.025) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Classification banner */}
      <div className="w-full py-1.5 px-6 flex items-center justify-between" style={{ background: "#7F1D1D", borderBottom: "1px solid rgba(248,113,113,0.4)" }}>
        <div className="flex items-center gap-3">
          <i className="ri-shield-keyhole-line text-red-300 text-sm" />
          <span className="text-white text-xs font-bold tracking-widest uppercase font-['JetBrains_Mono']">
            {isAr ? "سري — للأفراد المخوّلين فقط" : "RESTRICTED — Authorized Personnel Only"}
          </span>
        </div>
        <span className="text-red-300 text-xs font-['JetBrains_Mono'] opacity-70">AMEEN-PE-2026</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b"
        style={{ background: "rgba(11,18,32,0.97)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />{isAr ? "لوحة التحكم" : "Dashboard"}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ background: "rgba(181,142,60,0.1)", border: "2px solid rgba(181,142,60,0.3)" }}>
              <i className="ri-git-branch-line text-gold-400 text-base" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gold-400 font-black text-base tracking-wide">AMEEN</span>
                <span className="text-white font-bold text-sm">{isAr ? "محرك اكتشاف الأنماط" : "Pattern Detection Engine"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(248,113,113,0.15)", color: "#F87171", border: "1px solid rgba(248,113,113,0.3)" }}>
                  {isAr ? "سري" : "SECRET"}
                </span>
              </div>
              <p className="text-gray-500 text-xs font-['JetBrains_Mono']">Predictive Analytics · Cross-Stream Correlation · Police Internal</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col items-end px-3 py-1.5 rounded-lg border"
            style={{ background: "rgba(181,142,60,0.04)", borderColor: "rgba(181,142,60,0.12)" }}>
            <span className="text-gold-400 text-sm font-black font-['JetBrains_Mono']">{timeStr}</span>
            <span className="text-gray-600 text-xs font-['JetBrains_Mono']">LIVE</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
            style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">{enabledCount} {isAr ? "قاعدة نشطة" : "RULES ACTIVE"}</span>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="sticky top-[89px] z-30 flex items-center gap-1 px-6 py-2 border-b overflow-x-auto"
        style={{ background: "rgba(11,18,32,0.95)", borderColor: "rgba(181,142,60,0.08)", backdropFilter: "blur(12px)" }}>
        {TABS.map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex-shrink-0"
            style={{
              background: activeTab === tab.id ? "rgba(181,142,60,0.12)" : "transparent",
              border: `1px solid ${activeTab === tab.id ? "rgba(181,142,60,0.25)" : "transparent"}`,
              color: activeTab === tab.id ? "#D4A84B" : "#6B7280",
            }}>
            <i className={`${tab.icon} text-xs`} />
            {isAr ? tab.labelAr : tab.label}
            {tab.badge > 0 && (
              <span className="px-1.5 py-0.5 rounded-full font-bold font-['JetBrains_Mono']"
                style={{ background: "rgba(181,142,60,0.15)", color: "#D4A84B", fontSize: "9px" }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-6 space-y-6">

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1 — PRE-BUILT RULES
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "rules" && (
          <>
            {/* Concept banner */}
            {showConcept && (
              <div className="rounded-2xl border p-5 relative overflow-hidden"
                style={{ background: "rgba(181,142,60,0.04)", borderColor: "rgba(181,142,60,0.18)" }}>
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: `linear-gradient(rgba(181,142,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.03) 1px, transparent 1px)`,
                  backgroundSize: "20px 20px"
                }} />
                <button type="button" onClick={() => setShowConcept(false)}
                  className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-lg cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#6B7280" }}>
                  <i className="ri-close-line text-xs" />
                </button>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-xl"
                      style={{ background: "rgba(181,142,60,0.12)", border: "1px solid rgba(181,142,60,0.25)" }}>
                      <i className="ri-lightbulb-flash-line text-gold-400 text-sm" />
                    </div>
                    <h3 className="text-white font-bold text-sm">{isAr ? "مفهوم المحرك" : "Engine Concept"}</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {isAr
                      ? "القيمة الاستخباراتية لأمين تكمن في الربط بين التدفقات. لا تدفق واحد يكشف التهديدات — الأنماط تظهر عند ربط بيانات الفندق + الشريحة + السيارة + الحدود + المالية لنفس الشخص."
                      : "Al-Ameen's intelligence value is CROSS-STREAM correlation. No single stream catches threats — patterns emerge when you connect hotel + SIM + car + border + financial data for the same person."}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { label: isAr ? "الحدود" : "Border",    icon: "ri-passport-line",      color: "#38BDF8" },
                      { label: isAr ? "الفنادق" : "Hotel",    icon: "ri-hotel-line",         color: "#D4A84B" },
                      { label: isAr ? "الاتصالات" : "SIM",    icon: "ri-sim-card-line",      color: "#A78BFA" },
                      { label: isAr ? "السيارات" : "Car",     icon: "ri-car-line",           color: "#4ADE80" },
                      { label: isAr ? "المالية" : "Financial",icon: "ri-bank-card-line",     color: "#F87171" },
                      { label: isAr ? "الجمارك" : "Customs",  icon: "ri-box-3-line",         color: "#FACC15" },
                      { label: isAr ? "التوظيف" : "Employment",icon: "ri-briefcase-line",    color: "#F9A8D4" },
                    ].map((s, i, arr) => (
                      <div key={s.label} className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                          style={{ background: `${s.color}10`, border: `1px solid ${s.color}20` }}>
                          <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
                          <span className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</span>
                        </div>
                        {i < arr.length - 1 && <i className="ri-add-line text-gray-700 text-xs" />}
                      </div>
                    ))}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                      style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
                      <i className="ri-arrow-right-line text-red-400 text-xs" />
                      <span className="text-red-400 text-xs font-bold">{isAr ? "كشف النمط" : "Pattern Detected"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Page title + stats */}
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "قواعد الكشف المدمجة" : "Pre-Built Detection Rules"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "30 قاعدة مدمجة تكتشف الأنماط عبر جميع التدفقات تلقائياً" : "30 pre-built rules detecting cross-stream patterns automatically across all 14 data streams"}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: isAr ? "إجمالي القواعد" : "Total Rules",   value: rules.length,    color: "#D4A84B", icon: "ri-list-check-2" },
                { label: isAr ? "نشطة" : "Active",                  value: enabledCount,    color: "#4ADE80", icon: "ri-checkbox-circle-line" },
                { label: isAr ? "حرجة" : "Critical Rules",          value: criticalCount,   color: "#F87171", icon: "ri-shield-cross-line" },
                { label: isAr ? "إجمالي التطابقات" : "Total Hits",  value: totalHits,       color: "#A78BFA", icon: "ri-pulse-line" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border p-4 flex items-center gap-3"
                  style={{ background: "rgba(20,29,46,0.8)", borderColor: `${s.color}18`, backdropFilter: "blur(12px)" }}>
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ background: `${s.color}10`, border: `1px solid ${s.color}18` }}>
                    <i className={`${s.icon} text-sm`} style={{ color: s.color }} />
                  </div>
                  <div>
                    <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-gray-500 text-xs">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 min-w-[200px]"
                style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)" }}>
                <i className="ri-search-line text-gray-500 text-xs" />
                <input type="text" value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
                  placeholder={isAr ? "بحث في القواعد..." : "Search rules..."}
                  className="flex-1 bg-transparent outline-none text-xs text-gray-300"
                  style={{ minWidth: 0 }} />
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <button type="button" onClick={() => setFilterCat("all")}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
                  style={{ background: filterCat === "all" ? "rgba(181,142,60,0.12)" : "transparent", border: `1px solid ${filterCat === "all" ? "rgba(181,142,60,0.3)" : "transparent"}`, color: filterCat === "all" ? "#D4A84B" : "#6B7280" }}>
                  {isAr ? "الكل" : "All"}
                </button>
                {(Object.keys(CATEGORY_META) as RuleCategory[]).map((cat) => {
                  const m = CATEGORY_META[cat];
                  const count = rules.filter((r) => r.category === cat).length;
                  return (
                    <button key={cat} type="button" onClick={() => setFilterCat(cat)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
                      style={{ background: filterCat === cat ? `${m.color}12` : "transparent", border: `1px solid ${filterCat === cat ? m.color : "transparent"}`, color: filterCat === cat ? m.color : "#6B7280" }}>
                      <i className={`${m.icon} text-xs`} />{isAr ? m.labelAr : m.label}
                      <span className="font-['JetBrains_Mono']" style={{ fontSize: "9px", opacity: 0.7 }}>({count})</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-1">
                {(["all", "critical", "high", "medium", "low"] as const).map((r) => {
                  const cfg = r === "all" ? { color: "#D4A84B", label: "All", labelAr: "الكل" } : { ...RISK_CONFIG[r] };
                  return (
                    <button key={r} type="button" onClick={() => setFilterRisk(r)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
                      style={{ background: filterRisk === r ? `${cfg.color}12` : "transparent", border: `1px solid ${filterRisk === r ? cfg.color : "transparent"}`, color: filterRisk === r ? cfg.color : "#6B7280" }}>
                      {isAr ? cfg.labelAr : cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rules — grouped by category */}
            {filterCat === "all" ? (
              <div className="space-y-8">
                {(Object.keys(CATEGORY_META) as RuleCategory[]).map((cat) => {
                  const catRules = groupedRules[cat];
                  if (catRules.length === 0) return null;
                  const m = CATEGORY_META[cat];
                  return (
                    <div key={cat}>
                      {/* Category header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
                          style={{ background: `${m.color}12`, border: `1px solid ${m.color}20` }}>
                          <i className={`${m.icon} text-xs`} style={{ color: m.color }} />
                        </div>
                        <h2 className="text-sm font-bold" style={{ color: m.color }}>{isAr ? m.labelAr : m.label}</h2>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                          style={{ background: `${m.color}10`, color: m.color, border: `1px solid ${m.color}20` }}>
                          {catRules.length}
                        </span>
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${m.color}20, transparent)` }} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {catRules.map((rule) => (
                          <RuleCard key={rule.id} rule={rule} isAr={isAr}
                            expanded={expandedRule === rule.id}
                            onToggleExpand={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
                            onToggleEnabled={() => toggleRule(rule.id)} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredRules.map((rule) => (
                  <RuleCard key={rule.id} rule={rule} isAr={isAr}
                    expanded={expandedRule === rule.id}
                    onToggleExpand={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
                    onToggleEnabled={() => toggleRule(rule.id)} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2 — CUSTOM RULE BUILDER
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "builder" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "منشئ القواعد المخصصة" : "Custom Rule Builder"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "بناء قواعد كشف مخصصة بشروط متعددة عبر التدفقات" : "Build custom detection rules with multi-stream conditions — IF [stream] [event] [condition] WITHIN [timeframe] → THEN [action]"}</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-5">
                {/* Rule name */}
                <div className="rounded-2xl border p-5"
                  style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
                  <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">{isAr ? "اسم القاعدة" : "Rule Name"}</label>
                  <input type="text" value={builderName} onChange={(e) => setBuilderName(e.target.value)}
                    placeholder={isAr ? "مثال: نمط الوصول الليلي..." : "e.g. Night Arrival Pattern..."}
                    className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                    style={{ background: "rgba(11,18,32,0.8)", borderColor: "rgba(181,142,60,0.15)", color: "#D1D5DB" }} />
                </div>

                {/* Conditions */}
                <div className="rounded-2xl border p-5"
                  style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-bold text-sm">{isAr ? "الشروط" : "Conditions"}</h3>
                      <p className="text-gray-500 text-xs mt-0.5">{isAr ? "IF [تدفق] [حدث] [شرط] AND/OR..." : "IF [stream] [event] [condition] AND/OR..."}</p>
                    </div>
                    <button type="button" onClick={addCondition}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
                      style={{ background: "rgba(181,142,60,0.1)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}>
                      <i className="ri-add-line text-xs" />{isAr ? "إضافة شرط" : "Add Condition"}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {builderConditions.map((cond, idx) => (
                      <div key={cond.id} className="space-y-2">
                        {idx > 0 && (
                          <div className="flex items-center gap-2">
                            {(["AND", "OR"] as const).map((l) => (
                              <button key={l} type="button" onClick={() => updateCondition(cond.id, "logic", l)}
                                className="px-3 py-1 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
                                style={{ background: cond.logic === l ? "rgba(181,142,60,0.15)" : "rgba(255,255,255,0.04)", color: cond.logic === l ? "#D4A84B" : "#6B7280", border: `1px solid ${cond.logic === l ? "rgba(181,142,60,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                                {l}
                              </button>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2 flex-wrap p-3 rounded-xl"
                          style={{ background: "rgba(181,142,60,0.03)", border: "1px solid rgba(181,142,60,0.08)" }}>
                          <span className="text-gold-400 text-xs font-bold font-['JetBrains_Mono'] flex-shrink-0">IF</span>
                          <select value={cond.stream} onChange={(e) => updateCondition(cond.id, "stream", e.target.value)}
                            className="px-2 py-1.5 rounded-lg text-xs outline-none cursor-pointer"
                            style={{ background: "rgba(11,18,32,0.9)", border: "1px solid rgba(181,142,60,0.15)", color: "#D4A84B" }}>
                            {STREAM_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <select value={cond.event} onChange={(e) => updateCondition(cond.id, "event", e.target.value)}
                            className="px-2 py-1.5 rounded-lg text-xs outline-none cursor-pointer"
                            style={{ background: "rgba(11,18,32,0.9)", border: "1px solid rgba(181,142,60,0.15)", color: "#D1D5DB" }}>
                            {(EVENT_OPTIONS[cond.stream] ?? []).map((ev) => <option key={ev} value={ev}>{ev}</option>)}
                          </select>
                          <select value={cond.operator} onChange={(e) => updateCondition(cond.id, "operator", e.target.value)}
                            className="px-2 py-1.5 rounded-lg text-xs outline-none cursor-pointer"
                            style={{ background: "rgba(11,18,32,0.9)", border: "1px solid rgba(181,142,60,0.15)", color: "#FACC15" }}>
                            {OPERATOR_OPTIONS.map((op) => <option key={op} value={op}>{op}</option>)}
                          </select>
                          <input type="text" value={cond.value} onChange={(e) => updateCondition(cond.id, "value", e.target.value)}
                            placeholder={isAr ? "القيمة..." : "value..."}
                            className="px-2 py-1.5 rounded-lg text-xs outline-none flex-1 min-w-[80px]"
                            style={{ background: "rgba(11,18,32,0.9)", border: "1px solid rgba(181,142,60,0.1)", color: "#D1D5DB" }} />
                          {builderConditions.length > 1 && (
                            <button type="button" onClick={() => removeCondition(cond.id)}
                              className="w-6 h-6 flex items-center justify-center rounded-lg cursor-pointer flex-shrink-0"
                              style={{ background: "rgba(248,113,113,0.1)", color: "#F87171" }}>
                              <i className="ri-close-line" style={{ fontSize: "10px" }} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeframe */}
                <div className="rounded-2xl border p-5"
                  style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
                  <h3 className="text-white font-bold text-sm mb-3">{isAr ? "الإطار الزمني" : "Timeframe"}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-xs font-['JetBrains_Mono']">WITHIN</span>
                    <input type="number" value={builderTimeframe} onChange={(e) => setBuilderTimeframe(e.target.value)}
                      className="w-20 px-3 py-2 rounded-lg text-sm text-center outline-none font-['JetBrains_Mono']"
                      style={{ background: "rgba(11,18,32,0.9)", border: "1px solid rgba(181,142,60,0.2)", color: "#D4A84B" }} />
                    <select value={builderTimeUnit} onChange={(e) => setBuilderTimeUnit(e.target.value)}
                      className="px-3 py-2 rounded-lg text-xs outline-none cursor-pointer"
                      style={{ background: "rgba(11,18,32,0.9)", border: "1px solid rgba(181,142,60,0.15)", color: "#D1D5DB" }}>
                      {["minutes", "hours", "days", "weeks", "months"].map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                {/* Alert level */}
                <div className="rounded-2xl border p-5"
                  style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
                  <h3 className="text-white font-bold text-sm mb-3">{isAr ? "مستوى التنبيه" : "Alert Level"}</h3>
                  <div className="flex items-center gap-2">
                    {(["low", "medium", "high", "critical"] as RiskLevel[]).map((lvl) => {
                      const cfg = RISK_CONFIG[lvl];
                      return (
                        <button key={lvl} type="button" onClick={() => setBuilderLevel(lvl)}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all"
                          style={{ background: builderLevel === lvl ? cfg.bg : "rgba(255,255,255,0.03)", border: `1px solid ${builderLevel === lvl ? cfg.color : "rgba(255,255,255,0.06)"}`, color: builderLevel === lvl ? cfg.color : "#6B7280" }}>
                          {isAr ? cfg.labelAr : cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="rounded-2xl border p-5"
                  style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
                  <h3 className="text-white font-bold text-sm mb-3">{isAr ? "الإجراءات عند التطابق" : "Actions on Match"}</h3>
                  <div className="flex flex-wrap gap-2">
                    {ACTION_OPTIONS.map((action) => {
                      const active = builderActions.includes(action);
                      return (
                        <button key={action} type="button" onClick={() => toggleAction(action)}
                          className="cursor-pointer transition-all"
                          style={{ opacity: active ? 1 : 0.4, transform: active ? "scale(1.05)" : "scale(1)" }}>
                          <ActionPill label={action} />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-gray-600 text-xs mt-2">{isAr ? "انقر لتفعيل/إلغاء الإجراء" : "Click to toggle actions"}</p>
                </div>

                <button type="button" onClick={saveRule}
                  className="w-full py-3 rounded-xl text-sm font-bold cursor-pointer whitespace-nowrap transition-all"
                  style={{ background: savedMsg ? "#4ADE80" : "#D4A84B", color: "#0B1220" }}>
                  <i className={`${savedMsg ? "ri-checkbox-circle-line" : "ri-save-line"} mr-2`} />
                  {savedMsg ? (isAr ? "تم حفظ القاعدة!" : "Rule Saved!") : (isAr ? "حفظ القاعدة" : "Save Rule")}
                </button>
              </div>

              {/* Preview panel */}
              <div>
                <div className="rounded-2xl border p-5 sticky top-[140px]"
                  style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.15)", backdropFilter: "blur(12px)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <i className="ri-eye-line text-gold-400 text-sm" />
                    <h3 className="text-white font-bold text-sm">{isAr ? "معاينة القاعدة" : "Rule Preview"}</h3>
                  </div>
                  <div className="rounded-xl border p-4 space-y-3"
                    style={{ background: "rgba(11,18,32,0.8)", borderColor: `${RISK_CONFIG[builderLevel].color}25` }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-bold text-sm">{builderName || (isAr ? "اسم القاعدة..." : "Rule Name...")}</span>
                      <span className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: RISK_CONFIG[builderLevel].bg, color: RISK_CONFIG[builderLevel].color, border: `1px solid ${RISK_CONFIG[builderLevel].border}` }}>
                        {isAr ? RISK_CONFIG[builderLevel].labelAr : RISK_CONFIG[builderLevel].label}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {builderConditions.map((cond, i) => (
                        <div key={cond.id} className="flex items-start gap-2">
                          <span className="font-bold font-['JetBrains_Mono'] flex-shrink-0 text-xs"
                            style={{ color: i === 0 ? "#D4A84B" : "#FACC15" }}>
                            {i === 0 ? "IF" : cond.logic}
                          </span>
                          <span className="text-gray-300 text-xs">
                            <span style={{ color: "#D4A84B" }}>{cond.stream}</span>
                            {" "}<span style={{ color: "#D1D5DB" }}>{cond.event}</span>
                            {" "}<span style={{ color: "#FACC15" }}>{cond.operator}</span>
                            {cond.value && <span style={{ color: "#4ADE80" }}> {cond.value}</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 pt-1 border-t" style={{ borderColor: "rgba(181,142,60,0.06)" }}>
                      <span className="text-gray-500 text-xs font-['JetBrains_Mono']">WITHIN</span>
                      <span className="text-gold-400 text-xs font-bold font-['JetBrains_Mono']">{builderTimeframe} {builderTimeUnit}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-gray-500 text-xs font-['JetBrains_Mono']">THEN</span>
                      {builderActions.map((a) => <ActionPill key={a} label={a} />)}
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider">{isAr ? "نصائح" : "Tips"}</p>
                    {[
                      isAr ? "استخدم AND للشروط المطلوبة جميعها" : "Use AND for all-required conditions",
                      isAr ? "استخدم OR لأي شرط كافٍ" : "Use OR for any-sufficient conditions",
                      isAr ? "اختبر القاعدة في وضع الاختبار" : "Test your rule in Test Mode tab",
                    ].map((tip, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <i className="ri-lightbulb-line text-yellow-400 flex-shrink-0" style={{ fontSize: "10px", marginTop: "2px" }} />
                        <span className="text-gray-500 text-xs">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 3 — TEST MODE
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "test" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "وضع الاختبار" : "Test Mode"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "محاكاة القواعد على بيانات شخص محدد لمعرفة أي القواعد ستُطلَق" : "Paste a person ID → simulate against historical data → see which rules would trigger"}</p>
            </div>

            <div className="rounded-2xl border p-6"
              style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.15)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
                  <i className="ri-test-tube-line text-gold-400 text-sm" />
                </div>
                <h3 className="text-white font-bold text-sm">{isAr ? "إدخال معرف الشخص" : "Enter Person ID"}</h3>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <input type="text" value={testPersonId} onChange={(e) => setTestPersonId(e.target.value)}
                  placeholder={isAr ? "مثال: PRS-001 أو رقم الوثيقة..." : "e.g. PRS-001 or document number..."}
                  className="flex-1 min-w-[240px] px-4 py-3 rounded-xl border outline-none text-sm font-['JetBrains_Mono']"
                  style={{ background: "rgba(11,18,32,0.9)", borderColor: "rgba(181,142,60,0.2)", color: "#D4A84B" }}
                  onKeyDown={(e) => e.key === "Enter" && runTest()} />
                <button type="button" onClick={runTest} disabled={testRunning}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold cursor-pointer whitespace-nowrap"
                  style={{ background: testRunning ? "rgba(181,142,60,0.3)" : "#D4A84B", color: "#0B1220", opacity: testRunning ? 0.7 : 1 }}>
                  {testRunning
                    ? <><i className="ri-loader-4-line animate-spin text-sm" />{isAr ? "جارٍ المحاكاة..." : "Simulating..."}</>
                    : <><i className="ri-play-line text-sm" />{isAr ? "تشغيل المحاكاة" : "Run Simulation"}</>}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-gray-600 text-xs">{isAr ? "اختبار سريع:" : "Quick test:"}</span>
                {["PRS-001", "PRS-002", "PRS-003"].map((id) => (
                  <button key={id} type="button" onClick={() => setTestPersonId(id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                    style={{ background: "rgba(181,142,60,0.08)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.15)" }}>
                    {id}
                  </button>
                ))}
              </div>
            </div>

            {testRunning && (
              <div className="rounded-2xl border p-10 flex flex-col items-center gap-4"
                style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)" }}>
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-gold-400 animate-spin" style={{ borderTopColor: "transparent" }} />
                  <div className="absolute inset-2 rounded-full border-2 border-gold-400 animate-spin" style={{ borderBottomColor: "transparent", animationDirection: "reverse", animationDuration: "0.8s" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="ri-git-branch-line text-gold-400 text-lg" />
                  </div>
                </div>
                <p className="text-white font-bold text-sm">{isAr ? "جارٍ تحليل البيانات التاريخية..." : "Analyzing historical data..."}</p>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{isAr ? "مطابقة مع 30 قاعدة عبر 14 تدفقاً" : "Matching against 30 rules across 14 streams"}</p>
              </div>
            )}

            {testDone && testResults && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: isAr ? "القواعد المختبرة" : "Rules Tested",  value: testResults.length,                                    color: "#D4A84B" },
                    { label: isAr ? "مُطلَقة" : "Triggered",              value: testResults.filter((r) => r.triggered).length,         color: "#F87171" },
                    { label: isAr ? "غير مُطلَقة" : "Not Triggered",      value: testResults.filter((r) => !r.triggered).length,        color: "#4ADE80" },
                    { label: isAr ? "أعلى مستوى" : "Highest Level",       value: testResults.some((r) => r.triggered && r.riskLevel === "critical") ? (isAr ? "حرج" : "CRITICAL") : (isAr ? "عالٍ" : "HIGH"), color: "#F87171" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border p-4"
                      style={{ background: "rgba(20,29,46,0.8)", borderColor: `${s.color}18` }}>
                      <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</div>
                      <div className="text-gray-500 text-xs">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="text-white font-bold text-sm">{isAr ? "نتائج المحاكاة" : "Simulation Results"}</h3>
                  {testResults.map((result) => {
                    const riskCfg = RISK_CONFIG[result.riskLevel];
                    return (
                      <div key={result.ruleId} className="rounded-2xl border overflow-hidden"
                        style={{
                          background: "rgba(20,29,46,0.8)",
                          borderColor: result.triggered ? `${riskCfg.color}25` : "rgba(255,255,255,0.05)",
                          borderLeft: `4px solid ${result.triggered ? riskCfg.color : "#374151"}`,
                          backdropFilter: "blur(12px)",
                        }}>
                        <div className="flex items-start gap-4 px-5 py-4 flex-wrap">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
                            style={{ background: result.triggered ? `${riskCfg.color}12` : "rgba(255,255,255,0.04)", border: `1px solid ${result.triggered ? riskCfg.color : "rgba(255,255,255,0.08)"}` }}>
                            <i className={`${result.triggered ? "ri-alarm-warning-line" : "ri-checkbox-circle-line"} text-sm`}
                              style={{ color: result.triggered ? riskCfg.color : "#4ADE80" }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <span className="text-white text-sm font-bold">{isAr ? result.ruleNameAr : result.ruleName}</span>
                              <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{result.ruleId}</span>
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                                style={{ background: riskCfg.bg, color: riskCfg.color, border: `1px solid ${riskCfg.border}` }}>
                                {isAr ? riskCfg.labelAr : riskCfg.label}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                                style={{ background: result.triggered ? "rgba(248,113,113,0.1)" : "rgba(74,222,128,0.06)", color: result.triggered ? "#F87171" : "#4ADE80", border: `1px solid ${result.triggered ? "rgba(248,113,113,0.25)" : "rgba(74,222,128,0.18)"}` }}>
                                {result.triggered ? (isAr ? "مُطلَقة" : "TRIGGERED") : (isAr ? "لم تُطلَق" : "NOT TRIGGERED")}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {(isAr ? result.matchedConditionsAr : result.matchedConditions).map((mc, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <i className={`${result.triggered ? "ri-checkbox-circle-line text-green-400" : "ri-close-circle-line text-red-400"} flex-shrink-0`}
                                    style={{ fontSize: "10px", marginTop: "2px" }} />
                                  <span className="text-gray-400 text-xs">{mc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {result.triggered && (
                            <span className="text-gray-600 text-xs font-['JetBrains_Mono'] flex-shrink-0">{result.timestamp}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <button type="button"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold cursor-pointer whitespace-nowrap"
                    style={{ background: "transparent", borderColor: "rgba(181,142,60,0.3)", color: "#D4A84B" }}>
                    <i className="ri-download-2-line text-xs" />
                    {isAr ? "تصدير نتائج الاختبار" : "Export Test Results"}
                  </button>
                </div>
              </>
            )}
          </>
        )}

      </main>
    </div>
  );
};

export default PatternEnginePage;
