import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, ScatterChart, Scatter, Line, ReferenceLine,
} from "recharts";
import {
  OSINT_SOURCES,
  INTERNAL_STREAMS,
  SCORED_RECORDS,
  DEFAULT_SUB_SCORE_WEIGHTS,
  RISK_RULES,
  THROUGHPUT_24H,
  SCORE_BAND_META,
  CLASSIFICATION_META,
  SEQUENCE_TIMELINES,
  SCORE_DRIFT_30D,
  CALIBRATION_CURVE,
  NATIONALITY_FAIRNESS,
  MODEL_REGISTRY_TIMELINE,
  MODEL_GOVERNANCE,
  FEATURE_VECTORS,
  WEIGHT_PROFILES,
  AS_OF_SNAPSHOTS,
  aggregate,
  type ScoredRecord,
  type SubScoreWeight,
  type RiskRule,
  type RiskBand,
  type DecisionPoint,
  type SubScoreKey,
  type OsintSource,
  type Classification,
  type SequenceTimeline,
  type SequenceTouchpoint,
  type FeatureVector,
} from "@/mocks/osintData";

type Tab = "overview" | "queue" | "explain" | "sequence" | "sources" | "config" | "governance";
type SourceFilter = "all" | "osint" | "internal";

// ─── Shared helpers ─────────────────────────────────────────────────────────

const scoreColor = (band: RiskBand) => SCORE_BAND_META[band].color;

const confidenceColor: Record<string, string> = {
  "High": "#4ADE80",
  "Medium-High": "#D6B47E",
  "Medium": "#FACC15",
  "Low": "#C94A5E",
};

const sourceStatusMeta: Record<string, { color: string; bg: string; label: string }> = {
  healthy:  { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",  label: "HEALTHY" },
  degraded: { color: "#C98A1B", bg: "rgba(201,138,27,0.1)",  label: "DEGRADED" },
  stale:    { color: "#FACC15", bg: "rgba(250,204,21,0.1)",  label: "STALE" },
  down:     { color: "#C94A5E", bg: "rgba(201,74,94,0.1)", label: "DOWN" },
};

const timeSince = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
};

// Unified classification pill — used across Explain header, Queue rows,
// Sequence Coherence rows, and Sources cards.
const ClassificationPill = ({
  classification, isAr, compact = false,
}: { classification: Classification; isAr: boolean; compact?: boolean }) => {
  const meta = CLASSIFICATION_META[classification];
  return (
    <span
      className="rounded-md font-bold tracking-widest font-['JetBrains_Mono'] flex-shrink-0 inline-flex items-center"
      style={{
        background: meta.bg,
        color: meta.color,
        border: `1px solid ${meta.color}44`,
        fontSize: compact ? 9 : 10,
        padding: compact ? "1px 5px" : "2px 7px",
      }}
    >
      {isAr ? meta.labelAr : meta.label}
    </span>
  );
};

// Demo scenario card meta (for F2)
const DEMO_SCENARIO_CARDS: {
  scenarioKey: string;
  titleEn: string;
  titleAr: string;
  narrativeEn: string;
  narrativeAr: string;
  teachingEn: string;
  teachingAr: string;
  icon: string;
  color: string;
}[] = [
  {
    scenarioKey: "low-risk-routine",
    titleEn: "Low-risk routine",
    titleAr: "منخفض المخاطر — روتيني",
    narrativeEn: "Frequent business traveler, clean across every dimension.",
    narrativeAr: "مسافر أعمال متكرر — نظيف في كل الأبعاد.",
    teachingEn: "Baseline — shows what a calm record looks like end-to-end.",
    teachingAr: "خط الأساس — يُظهر الشكل النهائي لسجل خالٍ من الإشارات.",
    icon: "ri-check-double-line",
    color: "#4ADE80",
  },
  {
    scenarioKey: "borderline-context",
    titleEn: "Borderline — context-driven",
    titleAr: "حدّي — يعتمد على السياق",
    narrativeEn: "Origin advisory just escalated; context lifts score into review territory.",
    narrativeAr: "تحذير المنشأ تصاعد حديثاً؛ السياق يرفع الدرجة إلى منطقة المراجعة.",
    teachingEn: "Context layering — not the traveler, the moment.",
    teachingAr: "تراكم السياق — ليس المسافر بل التوقيت.",
    icon: "ri-scales-2-line",
    color: "#FACC15",
  },
  {
    scenarioKey: "high-risk-sponsor",
    titleEn: "High-risk — sponsor exposure",
    titleAr: "مرتفع — تعرّض الكفيل",
    narrativeEn: "Sponsor graph 2 hops from EU-sanctioned entity + 3 prior denials.",
    narrativeAr: "الكفيل ضمن درجتين من كيان خاضع للعقوبات + 3 رفضات سابقة.",
    teachingEn: "Entity + behavioral stack — why we insist on graph + history.",
    teachingAr: "الكيان + السلوك — يبرزان أهمية الرسم البياني والتاريخ.",
    icon: "ri-shield-cross-line",
    color: "#C94A5E",
  },
  {
    scenarioKey: "anomaly-driven",
    titleEn: "Anomaly-driven",
    titleAr: "مدفوع بالشذوذ",
    narrativeEn: "Routing + 62h APIS → hotel gap trigger Model 3 presence anomaly.",
    narrativeAr: "المسار + فجوة 62 ساعة بين APIS والفندق تُفعّل شذوذ النموذج الثالث.",
    teachingEn: "ML + sequence coherence together surface what rules miss.",
    teachingAr: "تعاون ML مع تماسك التسلسل يكشف ما تتجاوزه القواعد.",
    icon: "ri-radar-line",
    color: "#6B4FAE",
  },
  {
    scenarioKey: "health-overlap",
    titleEn: "Health overlap",
    titleAr: "تداخل صحي",
    narrativeEn: "Origin country in active WHO outbreak window at scan time.",
    narrativeAr: "بلد المنشأ ضمن نافذة تفشّ نشطة عند الفحص.",
    teachingEn: "Biosecurity dominance with everything else clean.",
    teachingAr: "هيمنة الأمن الحيوي مع نظافة باقي الإشارات.",
    icon: "ri-heart-pulse-line",
    color: "#FACC15",
  },
];

const TOTAL_RULES_BASELINE = RISK_RULES.length;
const TOTAL_OSINT_BASELINE = OSINT_SOURCES.length;

// ─── Main page ──────────────────────────────────────────────────────────────

const OsintRiskEnginePage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filterBand, setFilterBand] = useState<"all" | RiskBand>("all");
  const [filterDecision, setFilterDecision] = useState<"all" | DecisionPoint>("all");
  const [selected, setSelected] = useState<ScoredRecord | null>(null);
  const [weights, setWeights] = useState<SubScoreWeight[]>(DEFAULT_SUB_SCORE_WEIGHTS);
  const [rules, setRules] = useState<RiskRule[]>(RISK_RULES);
  // D5 — weight profile manager (persists selection to localStorage)
  const WEIGHT_PROFILE_STORAGE_KEY = "ameen:risk-engine:weight-profile";
  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      const saved = typeof window !== "undefined" ? window.localStorage.getItem(WEIGHT_PROFILE_STORAGE_KEY) : null;
      return saved && WEIGHT_PROFILES.some((p) => p.id === saved) ? saved : "default";
    } catch { return "default"; }
  });
  useEffect(() => {
    try { window.localStorage.setItem(WEIGHT_PROFILE_STORAGE_KEY, activeProfileId); } catch { /* noop */ }
  }, [activeProfileId]);
  // F1 — presenter mode
  const [presenterMode, setPresenterMode] = useState(false);
  // F2 — scenario-filter + toast
  const [scenarioFilter, setScenarioFilter] = useState<string | null>(null);
  const [scenarioToast, setScenarioToast] = useState<string | null>(null);

  // F1 — keydown listener for "E" to toggle presenter mode
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore typing in inputs/textareas
      const tgt = e.target as HTMLElement | null;
      if (tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA" || tgt.isContentEditable)) return;
      if (e.key === "e" || e.key === "E") {
        setPresenterMode((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // F2 — clear toast after ~5 seconds
  useEffect(() => {
    if (!scenarioToast) return;
    const t = setTimeout(() => setScenarioToast(null), 5000);
    return () => clearTimeout(t);
  }, [scenarioToast]);

  const timeStr = currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = currentTime.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  const agg = useMemo(() => aggregate(), []);

  // ── Derived: weights normalized so user tweaks sum = 100 visually ────────
  const totalWeight = weights.reduce((s, w) => s + w.weight, 0);

  const handleWeightChange = (key: SubScoreKey, value: number) => {
    setWeights((prev) => prev.map((w) => (w.key === key ? { ...w, weight: value } : w)));
  };
  const handleWeightReset = () => setWeights(DEFAULT_SUB_SCORE_WEIGHTS.map((w) => ({ ...w })));
  const handleRuleToggle = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };
  // D5 — switching profile rebuilds the SubScoreWeight[] using the stored profile weights
  const handleProfileSelect = (profileId: string) => {
    const profile = WEIGHT_PROFILES.find((p) => p.id === profileId);
    if (!profile) return;
    setActiveProfileId(profileId);
    setWeights(DEFAULT_SUB_SCORE_WEIGHTS.map((w) => ({
      ...w,
      weight: profile.weights[w.key] ?? w.defaultWeight,
    })));
  };
  const handleProfileDiscard = () => handleProfileSelect(activeProfileId); // reset sliders to stored profile

  // F2 — scenario card click handler
  const handleScenarioLoad = (scenarioKey: string) => {
    const card = DEMO_SCENARIO_CARDS.find((c) => c.scenarioKey === scenarioKey);
    const rec = SCORED_RECORDS.find((r) => r.demoScenario === scenarioKey);
    if (!rec) return;
    setScenarioFilter(scenarioKey);
    setSelected(rec);
    setActiveTab("explain");
    if (card) {
      setScenarioToast(
        isAr
          ? `تم تحميل السيناريو: ${card.titleAr}. ${card.teachingAr}`
          : `Scenario loaded: ${card.titleEn}. ${card.teachingEn}`,
      );
    }
  };

  const filteredRecords = useMemo(() => {
    return SCORED_RECORDS.filter((r) => {
      if (scenarioFilter && r.demoScenario !== scenarioFilter) return false;
      if (filterBand !== "all" && r.band !== filterBand) return false;
      if (filterDecision !== "all" && r.decisionPoint !== filterDecision) return false;
      return true;
    }).sort((a, b) => b.unifiedScore - a.unifiedScore);
  }, [filterBand, filterDecision, scenarioFilter]);

  const TABS: { id: Tab; icon: string; labelEn: string; labelAr: string; badge?: number; badgeColor?: string }[] = [
    { id: "overview", icon: "ri-dashboard-3-line",  labelEn: "Overview",          labelAr: "نظرة عامة" },
    { id: "queue",    icon: "ri-list-check-2",      labelEn: "Operator Queue",    labelAr: "قائمة المشغّل", badge: agg.flagged24h, badgeColor: "#C94A5E" },
    { id: "explain",  icon: "ri-focus-3-line",      labelEn: "Explainability",    labelAr: "الشرح والتبرير" },
    { id: "sequence", icon: "ri-flow-chart",        labelEn: "Sequence Coherence",labelAr: "تماسك التسلسل" },
    { id: "sources",  icon: "ri-broadcast-line",    labelEn: "Sources",           labelAr: "المصادر", badge: TOTAL_OSINT_BASELINE + INTERNAL_STREAMS.length, badgeColor: "#4ADE80" },
    { id: "config",   icon: "ri-equalizer-line",    labelEn: "Configuration",     labelAr: "الإعدادات" },
    { id: "governance", icon: "ri-shield-star-line", labelEn: "Model Governance",  labelAr: "حوكمة النموذج" },
  ];

  return (
    <div
      className="min-h-screen font-['Inter']"
      style={{
        // ocean-800 shell — flips with runtime palette toggle
        background: "var(--alm-ocean-800)",
        // F1 — scale the page up 15% in presenter mode
        fontSize: presenterMode ? "1.15em" : "1em",
        outline: presenterMode ? "1px solid rgba(184,138,60,0.55)" : "none",
        outlineOffset: presenterMode ? "-1px" : "0",
        boxShadow: presenterMode ? "inset 0 0 32px rgba(184,138,60,0.12)" : "none",
      }}
      dir={isAr ? "rtl" : "ltr"}
      data-presenter={presenterMode ? "on" : "off"}
    >
      {/* Grid texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            `linear-gradient(rgba(184,138,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.025) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Classification banner */}
      <div className="w-full py-1.5 px-6 flex items-center justify-between relative z-10"
        style={{ background: "#7F1D1D", borderBottom: "1px solid rgba(201,74,94,0.4)" }}>
        <div className="flex items-center gap-3">
          <i className="ri-shield-keyhole-line text-red-300 text-sm" />
          <span className="text-white text-xs font-bold tracking-widest uppercase font-['JetBrains_Mono']">
            {isAr ? "سري — للأفراد المخوّلين فقط" : "RESTRICTED — Authorized Personnel Only"}
          </span>
        </div>
        <span className="text-red-300 text-xs font-['JetBrains_Mono'] opacity-70">
          SITA-BORDERS-OSINT-PoC-2026
        </span>
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b"
        style={{ background: "rgba(var(--alm-ocean-800-rgb), 0.97)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />
            {isAr ? "لوحة التحكم" : "Dashboard"}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ background: "rgba(107,79,174,0.1)", border: "2px solid rgba(107,79,174,0.3)" }}>
              <i className="ri-radar-line text-[#6B4FAE] text-base" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gold-400 font-black text-base tracking-wide">Al-Ameen</span>
                <span className="text-white font-bold text-sm">{isAr ? "محرّك المخاطر OSINT" : "OSINT Risk Engine"}</span>
                {!presenterMode && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: "rgba(107,79,174,0.15)", color: "#6B4FAE", border: "1px solid rgba(107,79,174,0.3)" }}>
                    PoC · v0.3.1
                  </span>
                )}
              </div>
              {!presenterMode && (
                <p className="text-gray-500 text-xs font-['JetBrains_Mono']">
                  ETA + API/PNR · Rules baseline + ML overlay · Explainable
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {presenterMode && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
              style={{ background: "rgba(184,138,60,0.12)", borderColor: "rgba(184,138,60,0.45)" }}>
              <i className="ri-mic-line text-gold-400 text-sm" />
              <span className="text-gold-300 text-xs font-bold font-['JetBrains_Mono'] tracking-widest">
                {isAr ? "عرض تقديمي" : "PRESENTER"}
              </span>
            </div>
          )}
          <div className="hidden lg:flex flex-col items-end px-3 py-1.5 rounded-lg border"
            style={{ background: "rgba(184,138,60,0.04)", borderColor: "rgba(184,138,60,0.12)" }}>
            <span className="text-gold-400 text-sm font-black font-['JetBrains_Mono']">{timeStr}</span>
            <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{dateStr}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
            style={{ background: "rgba(74,222,128,0.08)", borderColor: "rgba(74,222,128,0.3)" }}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-bold font-['JetBrains_Mono']">
              {agg.sourcesHealthy + INTERNAL_STREAMS.filter((s) => s.status === "healthy").length}/
              {TOTAL_OSINT_BASELINE + INTERNAL_STREAMS.length}{" "}
              {isAr ? "مصادر حيّة" : "SOURCES LIVE"}
            </span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="sticky top-[57px] z-30 flex items-center gap-1 px-6 py-2 border-b overflow-x-auto"
        style={{ background: "rgba(var(--alm-ocean-800-rgb), 0.92)", borderColor: "rgba(184,138,60,0.08)", backdropFilter: "blur(12px)" }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap cursor-pointer transition-all"
              style={{
                background: isActive ? "rgba(184,138,60,0.1)" : "transparent",
                color: isActive ? "#D6B47E" : "#6B7280",
                border: isActive ? "1px solid rgba(184,138,60,0.3)" : "1px solid transparent",
              }}
            >
              <i className={tab.icon} />
              <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              {!presenterMode && typeof tab.badge === "number" && tab.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                  style={{ background: `${tab.badgeColor}20`, color: tab.badgeColor }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <main className="relative z-10 px-6 py-6 max-w-[1600px] mx-auto">
        {activeTab === "overview" && <OverviewTab isAr={isAr} agg={agg} presenterMode={presenterMode} />}
        {activeTab === "queue" && (
          <QueueTab
            isAr={isAr}
            records={filteredRecords}
            filterBand={filterBand}
            setFilterBand={setFilterBand}
            filterDecision={filterDecision}
            setFilterDecision={setFilterDecision}
            onSelect={(r) => { setSelected(r); setActiveTab("explain"); }}
            scenarioFilter={scenarioFilter}
            onScenarioLoad={handleScenarioLoad}
            onClearScenario={() => setScenarioFilter(null)}
            presenterMode={presenterMode}
          />
        )}
        {activeTab === "explain" && (
          <ExplainTab
            isAr={isAr}
            record={selected}
            weights={weights}
            onBack={() => setActiveTab("queue")}
            presenterMode={presenterMode}
            scenarioToast={scenarioToast}
            onDismissToast={() => setScenarioToast(null)}
            featureVector={selected ? FEATURE_VECTORS[selected.id] ?? null : null}
          />
        )}
        {activeTab === "sequence" && <SequenceTab isAr={isAr} />}
        {activeTab === "sources" && <SourcesTab isAr={isAr} presenterMode={presenterMode} />}
        {activeTab === "config" && (
          <ConfigTab
            isAr={isAr}
            weights={weights}
            totalWeight={totalWeight}
            rules={rules}
            onWeightChange={handleWeightChange}
            onWeightReset={handleWeightReset}
            onRuleToggle={handleRuleToggle}
            activeProfileId={activeProfileId}
            onProfileSelect={handleProfileSelect}
            onProfileDiscard={handleProfileDiscard}
          />
        )}
        {activeTab === "governance" && <GovernanceTab isAr={isAr} />}
      </main>
    </div>
  );
};

// ─── Overview tab ───────────────────────────────────────────────────────────

const OverviewTab = ({ isAr, agg, presenterMode }: { isAr: boolean; agg: ReturnType<typeof aggregate>; presenterMode: boolean }) => {
  const bandCounts = useMemo(() => {
    const c: Record<RiskBand, number> = { critical: 0, high: 0, elevated: 0, borderline: 0, low: 0 };
    SCORED_RECORDS.forEach((r) => { c[r.band]++; });
    return c;
  }, []);

  const kpis = [
    { label: isAr ? "مسجّل خلال 24 ساعة"  : "Scored · 24h",      value: agg.total24h.toLocaleString(),  color: "#D6B47E", icon: "ri-pulse-line" },
    { label: isAr ? "مُرفَع للمراجعة" : "Flagged · 24h",           value: agg.flagged24h.toString(),      color: "#C94A5E", icon: "ri-alarm-warning-line" },
    { label: isAr ? "معدل الرفع"       : "Flag rate",              value: `${agg.flagRate}%`,             color: "#C98A1B", icon: "ri-percent-line" },
    { label: isAr ? "متوسط الدرجة"    : "Avg unified score",       value: agg.avgScore.toString(),        color: "#6B4FAE", icon: "ri-scales-3-line" },
    { label: isAr ? "مصادر حيّة"       : "Sources live",            value: `${agg.sourcesHealthy + INTERNAL_STREAMS.filter((s) => s.status === "healthy").length}/${TOTAL_OSINT_BASELINE + INTERNAL_STREAMS.length}`, color: "#4ADE80", icon: "ri-broadcast-line" },
    { label: isAr ? "إصدار النموذج"   : "Model version",            value: "mvp-0.3.1",                    color: "#FACC15", icon: "ri-git-commit-line" },
  ];

  const visibleKpis = presenterMode ? kpis.filter((k) => k.label !== "Model version") : kpis;

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {visibleKpis.map((k) => (
          <div key={k.label} className="rounded-xl border p-4"
            style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
            <div className="flex items-center gap-2 mb-2">
              <i className={`${k.icon} text-lg`} style={{ color: k.color }} />
              <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase font-['JetBrains_Mono']">{k.label}</span>
            </div>
            <div className="text-white font-black font-['JetBrains_Mono']"
              style={{ color: k.color, fontSize: presenterMode ? "2rem" : "1.5rem" }}>
              {k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Throughput chart */}
      <div className="rounded-xl border p-5"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-base font-bold">{isAr ? "إنتاجية المحرّك · آخر 24 ساعة" : "Engine throughput · last 24h"}</h3>
            <p className="text-gray-500 text-xs font-['JetBrains_Mono']">scored vs flagged · hourly</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-['JetBrains_Mono']">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "#D6B47E" }} /> <span className="text-gray-400">scored</span></span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "#C94A5E" }} /> <span className="text-gray-400">flagged</span></span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={THROUGHPUT_24H}>
              <defs>
                <linearGradient id="g-scored" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D6B47E" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#D6B47E" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="g-flagged" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C94A5E" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#C94A5E" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,138,60,0.08)" />
              <XAxis dataKey="hour" stroke="#6B7280" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <YAxis stroke="#6B7280" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <Tooltip contentStyle={{ background: "#0A2540", border: "1px solid rgba(184,138,60,0.3)", borderRadius: 8, fontSize: 12, fontFamily: "JetBrains Mono" }} />
              <Area type="monotone" dataKey="scored"  stroke="#D6B47E" strokeWidth={2} fill="url(#g-scored)"  />
              <Area type="monotone" dataKey="flagged" stroke="#C94A5E" strokeWidth={2} fill="url(#g-flagged)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Band distribution + Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <h3 className="text-white text-base font-bold mb-4">{isAr ? "توزيع نطاقات المخاطر" : "Risk-band distribution"}</h3>
          <div className="space-y-3">
            {(Object.keys(bandCounts) as RiskBand[]).map((b) => {
              const count = bandCounts[b];
              const pct = Math.round((count / SCORED_RECORDS.length) * 100);
              return (
                <div key={b} className="flex items-center gap-3">
                  <span className="text-xs font-bold font-['JetBrains_Mono'] w-24"
                    style={{ color: SCORE_BAND_META[b].color }}>
                    {SCORE_BAND_META[b].labelEn}
                  </span>
                  <div className="flex-1 h-6 rounded-md relative overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="h-full rounded-md transition-all"
                      style={{ width: `${pct}%`, background: SCORE_BAND_META[b].color, opacity: 0.85 }} />
                  </div>
                  <span className="text-white text-sm font-bold font-['JetBrains_Mono'] w-14 text-right">{count}</span>
                  <span className="text-gray-500 text-xs font-['JetBrains_Mono'] w-12 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border p-5 flex flex-col gap-3"
          style={{ background: "linear-gradient(135deg, rgba(107,79,174,0.08), rgba(184,138,60,0.04))", borderColor: "rgba(107,79,174,0.25)" }}>
          <div className="flex items-center gap-2">
            <i className="ri-lightbulb-flash-line text-[#6B4FAE]" />
            <h3 className="text-white text-sm font-bold">{isAr ? "ما الذي يفعله المحرّك" : "What the engine does"}</h3>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Fuses open-source intelligence (OpenSanctions, GDELT, ACLED, WHO, OpenSky + advisories) with ROP internal
            streams (APIS, eVisa history, Hotels, MOL, Mobile Operators) into one unified 0–100 risk score at ETA
            adjudication and API/PNR pre-arrival. Nine sub-scores — deterministic rules for auditability, unsupervised
            ML for pattern detection, SHAP-style attribution for every flag.
          </p>
          <p className="text-gray-500 text-[11px] font-['JetBrains_Mono'] pt-2 border-t" style={{ borderColor: "rgba(107,79,174,0.2)" }}>
            Architected source-agnostic — Rasad integrates as a new adapter when access is granted.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Queue tab ──────────────────────────────────────────────────────────────

const QueueTab = ({
  isAr, records, filterBand, setFilterBand, filterDecision, setFilterDecision,
  onSelect, scenarioFilter, onScenarioLoad, onClearScenario, presenterMode,
}: {
  isAr: boolean;
  records: ScoredRecord[];
  filterBand: "all" | RiskBand;
  setFilterBand: (v: "all" | RiskBand) => void;
  filterDecision: "all" | DecisionPoint;
  setFilterDecision: (v: "all" | DecisionPoint) => void;
  onSelect: (r: ScoredRecord) => void;
  scenarioFilter: string | null;
  onScenarioLoad: (scenarioKey: string) => void;
  onClearScenario: () => void;
  presenterMode: boolean;
}) => {
  const BANDS: ("all" | RiskBand)[] = ["all", "critical", "high", "elevated", "borderline", "low"];
  const DPOINTS: ("all" | DecisionPoint)[] = ["all", "ETA", "API_PNR"];

  return (
    <div className="space-y-4">
      {/* F2 — Demo scenario loader */}
      <div className="rounded-xl border p-4"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-white text-sm font-bold flex items-center gap-2">
              <i className="ri-slideshow-line text-[#6B4FAE]" />
              {isAr ? "سيناريوهات العرض" : "Demo Scenarios"}
            </h3>
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
              {isAr ? "اضغط لتشغيل أي سيناريو تعليمي" : "Click any card to play the scenario end-to-end"}
            </p>
          </div>
          {scenarioFilter && (
            <button onClick={onClearScenario}
              className="px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
              <i className="ri-close-line mr-1" />
              {isAr ? "إلغاء السيناريو" : "Clear scenario"}
            </button>
          )}
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory" }}>
          {DEMO_SCENARIO_CARDS.map((s) => {
            const active = scenarioFilter === s.scenarioKey;
            return (
              <div key={s.scenarioKey}
                className="flex-shrink-0 rounded-xl border p-3 flex flex-col gap-2"
                style={{
                  width: 220,
                  scrollSnapAlign: "start",
                  background: active
                    ? `linear-gradient(135deg, ${s.color}22, rgba(10,37,64,0.8))`
                    : "rgba(10,37,64,0.85)",
                  borderColor: active ? `${s.color}55` : "rgba(184,138,60,0.1)",
                }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${s.color}18`, border: `1px solid ${s.color}44` }}>
                    <i className={`${s.icon} text-base`} style={{ color: s.color }} />
                  </div>
                  <h4 className="text-white text-xs font-bold leading-tight">{isAr ? s.titleAr : s.titleEn}</h4>
                </div>
                <p className="text-gray-400 text-[11px] leading-snug flex-1">
                  {isAr ? s.narrativeAr : s.narrativeEn}
                </p>
                <button onClick={() => onScenarioLoad(s.scenarioKey)}
                  className="mt-1 px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer flex items-center justify-center gap-1 transition-all"
                  style={{
                    background: active ? `${s.color}22` : "rgba(184,138,60,0.1)",
                    color: active ? s.color : "#D6B47E",
                    border: `1px solid ${active ? s.color : "#D6B47E"}55`,
                  }}>
                  {isAr ? "تشغيل السيناريو" : "Play scenario"}
                  <i className={isAr ? "ri-play-mini-line" : "ri-play-mini-line"} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <span className="text-gray-500 text-xs font-bold tracking-widest uppercase font-['JetBrains_Mono']">
          {isAr ? "تصفية" : "Filter"}
        </span>
        <div className="flex gap-1">
          {BANDS.map((b) => {
            const active = filterBand === b;
            const col = b === "all" ? "#D6B47E" : SCORE_BAND_META[b as RiskBand].color;
            return (
              <button key={b} onClick={() => setFilterBand(b)}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold font-['JetBrains_Mono'] tracking-widest uppercase cursor-pointer"
                style={{
                  background: active ? `${col}22` : "transparent",
                  color: active ? col : "#6B7280",
                  border: active ? `1px solid ${col}55` : "1px solid rgba(255,255,255,0.08)",
                }}>
                {b === "all" ? "ALL" : SCORE_BAND_META[b as RiskBand].labelEn}
              </button>
            );
          })}
        </div>
        <div className="w-px h-6 mx-2" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="flex gap-1">
          {DPOINTS.map((d) => {
            const active = filterDecision === d;
            return (
              <button key={d} onClick={() => setFilterDecision(d)}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold font-['JetBrains_Mono'] tracking-widest uppercase cursor-pointer"
                style={{
                  background: active ? "rgba(107,79,174,0.18)" : "transparent",
                  color: active ? "#6B4FAE" : "#6B7280",
                  border: active ? "1px solid rgba(107,79,174,0.4)" : "1px solid rgba(255,255,255,0.08)",
                }}>
                {d}
              </button>
            );
          })}
        </div>
        <div className="ml-auto text-gray-500 text-xs font-['JetBrains_Mono']">
          {records.length} {isAr ? "سجلات" : "records"}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b text-[10px] font-bold tracking-widest uppercase font-['JetBrains_Mono']"
          style={{ borderColor: "rgba(184,138,60,0.08)", color: "#6B7280" }}>
          <div className="col-span-1">{isAr ? "الدرجة" : "Score"}</div>
          <div className="col-span-3">{isAr ? "المسافر" : "Traveler"}</div>
          <div className="col-span-1">{isAr ? "الجنسية" : "Nat."}</div>
          <div className="col-span-2">{isAr ? "الرحلة" : "Flight"}</div>
          <div className="col-span-2">{isAr ? "الكفيل" : "Sponsor / Visa"}</div>
          <div className="col-span-1">{isAr ? "النقطة" : "Point"}</div>
          <div className="col-span-1">{isAr ? "النطاق" : "Band"}</div>
          <div className="col-span-1 text-right">{isAr ? "الشرح" : "Explain"}</div>
        </div>
        {records.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className="w-full grid grid-cols-12 gap-2 px-4 py-3 border-b cursor-pointer transition-colors text-left hover:bg-white/[0.03]"
            style={{ borderColor: "rgba(184,138,60,0.05)" }}
          >
            {/* Score */}
            <div className="col-span-1 flex items-center">
              <div className="relative flex items-center justify-center rounded-lg"
                style={{
                  background: `${scoreColor(r.band)}18`,
                  border: `2px solid ${scoreColor(r.band)}55`,
                  width: presenterMode ? 56 : 48,
                  height: presenterMode ? 56 : 48,
                }}>
                <span className="font-black font-['JetBrains_Mono']"
                  style={{ color: scoreColor(r.band), fontSize: presenterMode ? "1.125rem" : "0.875rem" }}>
                  {r.unifiedScore}
                </span>
              </div>
            </div>
            {/* Traveler */}
            <div className="col-span-3 flex flex-col justify-center min-w-0 gap-0.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-white text-sm font-semibold truncate">{r.travelerName}</span>
                <ClassificationPill classification={r.classification} isAr={isAr} compact />
              </div>
              <span className="text-gray-600 text-xs font-['JetBrains_Mono'] truncate">{r.passportNumber}</span>
            </div>
            {/* Nat */}
            <div className="col-span-1 flex items-center text-gray-400 text-xs font-['JetBrains_Mono']">{r.nationality}</div>
            {/* Flight */}
            <div className="col-span-2 flex flex-col justify-center">
              <span className="text-gray-300 text-xs font-['JetBrains_Mono']">{r.carrierIata} {r.flightNumber}</span>
              <span className="text-gray-600 text-[11px] font-['JetBrains_Mono']">{r.originIata} → {r.destIata}</span>
            </div>
            {/* Sponsor */}
            <div className="col-span-2 flex flex-col justify-center min-w-0">
              <span className="text-gray-300 text-xs truncate">{r.sponsor ?? "—"}</span>
              <span className="text-gray-600 text-[11px]">{r.visaType}</span>
            </div>
            {/* Point */}
            <div className="col-span-1 flex items-center">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider font-['JetBrains_Mono']"
                style={{
                  background: r.decisionPoint === "ETA" ? "rgba(184,138,60,0.1)" : "rgba(107,79,174,0.1)",
                  color: r.decisionPoint === "ETA" ? "#D6B47E" : "#6B4FAE",
                }}>
                {r.decisionPoint}
              </span>
            </div>
            {/* Band */}
            <div className="col-span-1 flex items-center">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider font-['JetBrains_Mono']"
                style={{ background: `${scoreColor(r.band)}20`, color: scoreColor(r.band) }}>
                {SCORE_BAND_META[r.band].labelEn}
              </span>
            </div>
            {/* Arrow */}
            <div className="col-span-1 flex items-center justify-end text-gray-500">
              <i className="ri-arrow-right-s-line text-xl" />
            </div>
          </button>
        ))}
        {records.length === 0 && (
          <div className="py-10 text-center text-gray-500 text-sm">
            {isAr ? "لا توجد سجلات ضمن المرشحات الحالية" : "No records match current filters"}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Explainability tab ─────────────────────────────────────────────────────

const ExplainTab = ({
  isAr, record, weights, onBack, presenterMode, scenarioToast, onDismissToast, featureVector,
}: {
  isAr: boolean;
  record: ScoredRecord | null;
  weights: SubScoreWeight[];
  onBack: () => void;
  presenterMode: boolean;
  scenarioToast: string | null;
  onDismissToast: () => void;
  featureVector: FeatureVector | null;
}) => {
  if (!record) {
    return (
      <div className="rounded-xl border p-8 text-center"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <i className="ri-focus-3-line text-5xl text-gray-600 mb-3" />
        <p className="text-gray-400 mb-4">{isAr ? "اختر سجلاً من قائمة المشغّل لعرض الشرح" : "Select a record from the Operator Queue to see its explainability breakdown"}</p>
        <button onClick={onBack}
          className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
          style={{ background: "rgba(184,138,60,0.1)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.3)" }}>
          {isAr ? "فتح قائمة المشغّل" : "Open Operator Queue"}
        </button>
      </div>
    );
  }

  const subChartData = weights.map((w) => ({
    key: w.key,
    label: w.labelEn,
    value: record.subScores[w.key],
    color: w.color,
  }));

  // Group contributions by sub-score for readability — all 9 keys.
  const contribsBySub: Record<SubScoreKey, typeof record.contributions> = {
    sanctions: [], geopolitical: [], biosecurity: [], routing: [],
    behavioral: [], declaration: [], entity: [], presence: [], document: [],
  };
  record.contributions.forEach((c) => contribsBySub[c.subScore].push(c));

  // D3 — coverage stats
  const expectedSources = record.sourcesAvailable.length + record.sourcesUnavailable.length;
  const availablePct = expectedSources > 0
    ? Math.round((record.sourcesAvailable.length / expectedSources) * 100)
    : 100;
  const activeRules = RISK_RULES.filter((r) => r.enabled && !record.rulesSkipped.includes(r.id)).length;
  const totalRules = RISK_RULES.length;
  const degraded = record.sourcesUnavailable.length > 0 || record.rulesSkipped.length > 0;

  return (
    <div className="space-y-4">
      {/* F2 — scenario toast */}
      {scenarioToast && (
        <div className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
          style={{
            background: "linear-gradient(135deg, rgba(184,138,60,0.14), rgba(107,79,174,0.08))",
            borderColor: "rgba(184,138,60,0.4)",
          }}>
          <div className="flex items-center gap-3">
            <i className="ri-sparkling-2-line text-[#D6B47E] text-lg" />
            <span className="text-white text-sm font-semibold">{scenarioToast}</span>
          </div>
          <button onClick={onDismissToast}
            className="text-gray-400 hover:text-white cursor-pointer"
            aria-label={isAr ? "إخفاء" : "Dismiss"}>
            <i className="ri-close-line text-lg" />
          </button>
        </div>
      )}

      {/* Traveler header */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border p-5"
        style={{
          background: `linear-gradient(135deg, ${scoreColor(record.band)}14, rgba(10,37,64,0.8))`,
          borderColor: `${scoreColor(record.band)}44`,
        }}>
        <div className="flex items-start gap-4">
          <button onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
            <i className="ri-arrow-left-line" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-white text-xl font-bold">{record.travelerName}</h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest font-['JetBrains_Mono']"
                style={{ background: `${scoreColor(record.band)}22`, color: scoreColor(record.band), border: `1px solid ${scoreColor(record.band)}55` }}>
                {SCORE_BAND_META[record.band].labelEn}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-['JetBrains_Mono']"
                style={{
                  background: record.decisionPoint === "ETA" ? "rgba(184,138,60,0.1)" : "rgba(107,79,174,0.1)",
                  color: record.decisionPoint === "ETA" ? "#D6B47E" : "#6B4FAE",
                }}>
                {record.decisionPoint}
              </span>
              {/* B2 — classification pill on Explain header */}
              <ClassificationPill classification={record.classification} isAr={isAr} />
            </div>
            <p className="text-gray-500 text-xs font-['JetBrains_Mono']">
              {record.passportNumber} · {record.nationality} · {record.carrierIata} {record.flightNumber} · {record.originIata} → {record.destIata}
            </p>
            <p className="text-gray-500 text-xs font-['JetBrains_Mono'] mt-0.5">
              {isAr ? "الكفيل" : "Sponsor"}: {record.sponsor ?? "—"} · {record.visaType}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-500 text-[10px] font-bold tracking-widest font-['JetBrains_Mono']">UNIFIED SCORE</span>
          <span className="font-black font-['JetBrains_Mono']"
            style={{
              color: scoreColor(record.band),
              fontSize: presenterMode ? "3.5rem" : "2.5rem",
              lineHeight: 1,
            }}>
            {record.unifiedScore}
          </span>
          {!presenterMode && (
            <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">
              model {record.modelVersion}
            </span>
          )}
        </div>
      </div>

      {/* D3 — coverage strip */}
      <div className="rounded-xl border px-4 py-3"
        style={{
          background: degraded
            ? "linear-gradient(135deg, rgba(201,138,27,0.08), rgba(10,37,64,0.8))"
            : "rgba(10,37,64,0.65)",
          borderColor: degraded ? "rgba(201,138,27,0.3)" : "rgba(184,138,60,0.12)",
        }}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-['JetBrains_Mono']">
          <span className="flex items-center gap-2 text-gray-300">
            <i className="ri-radar-line text-[#D6B47E]" />
            {isAr
              ? `يستند إلى ${record.sourcesAvailable.length}/${expectedSources} مصادر OSINT · ${activeRules}/${totalRules} قواعد نشطة`
              : `Based on ${record.sourcesAvailable.length}/${expectedSources} OSINT sources · ${activeRules}/${totalRules} rules fired`}
          </span>
          {degraded && (
            <span className="flex items-center gap-2" style={{ color: "#C98A1B" }}>
              <i className="ri-error-warning-line" />
              {isAr ? "مُتخطّى: " : "Skipped: "}
              {[
                ...record.sourcesUnavailable.map((s) => `${s} (${isAr ? "تغذية قديمة" : "feed stale"})`),
                ...record.rulesSkipped.map((r) => `${r} (${isAr ? "معطّلة" : "disabled"})`),
              ].join(" · ")}
            </span>
          )}
          <span className="flex items-center gap-2 ml-auto text-gray-300">
            {isAr ? "الثقة" : "Confidence"}:
            <span className="font-bold" style={{ color: availablePct >= 90 ? "#4ADE80" : availablePct >= 75 ? "#C98A1B" : "#C94A5E" }}>
              {availablePct}%
            </span>
            <span className="inline-block h-1.5 w-32 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <span className="block h-full rounded-full"
                style={{
                  width: `${availablePct}%`,
                  background: availablePct >= 90 ? "#4ADE80" : availablePct >= 75 ? "#C98A1B" : "#C94A5E",
                }} />
            </span>
          </span>
        </div>
      </div>

      {/* Sub-score bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <h3 className="text-white text-sm font-bold mb-4">{isAr ? "الدرجات الفرعية" : "Sub-score contribution"}</h3>
          <div style={{ height: presenterMode ? 340 : 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,138,60,0.08)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#6B7280" tick={{ fontSize: presenterMode ? 12 : 10, fontFamily: "JetBrains Mono" }} />
                <YAxis type="category" dataKey="label" stroke="#6B7280" tick={{ fontSize: presenterMode ? 13 : 11, fontFamily: "Inter" }} width={130} />
                <Tooltip contentStyle={{ background: "#0A2540", border: "1px solid rgba(184,138,60,0.3)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {subChartData.map((d) => (<Cell key={d.key} fill={d.color} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight contribution legend */}
        <div className="rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <h3 className="text-white text-sm font-bold mb-4">{isAr ? "الأوزان النشطة" : "Active weights"}</h3>
          <div className="space-y-2">
            {weights.map((w) => {
              const sub = record.subScores[w.key];
              const pts = (sub * (w.weight / 100)).toFixed(1);
              return (
                <div key={w.key} className="flex items-center gap-3 text-xs">
                  <i className={`${w.icon} text-base`} style={{ color: w.color }} />
                  <span className="text-gray-300 flex-1 font-semibold">{isAr ? w.labelAr : w.labelEn}</span>
                  <span className="text-gray-500 font-['JetBrains_Mono']">{w.weight}%</span>
                  <span className="text-gray-600 font-['JetBrains_Mono']">×</span>
                  <span className="text-white font-['JetBrains_Mono'] w-8 text-right">{sub}</span>
                  <span className="text-gray-600 font-['JetBrains_Mono']">=</span>
                  <span className="font-['JetBrains_Mono'] w-10 text-right font-bold" style={{ color: w.color }}>{pts}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contributions per sub-score */}
      <div className="rounded-xl border p-5"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <h3 className="text-white text-sm font-bold mb-4">
          {isAr ? "الإسهامات التفصيلية" : "Contributing signals"}
          <span className="ml-3 text-xs font-['JetBrains_Mono'] text-gray-600">
            {record.contributions.length} {isAr ? "إسهاماً" : "contributions"}
          </span>
        </h3>
        <div className="space-y-4">
          {(Object.keys(contribsBySub) as SubScoreKey[]).map((sub) => {
            const items = contribsBySub[sub];
            if (items.length === 0) return null;
            const meta = DEFAULT_SUB_SCORE_WEIGHTS.find((w) => w.key === sub)!;
            return (
              <div key={sub}>
                <div className="flex items-center gap-2 mb-2">
                  <i className={`${meta.icon} text-sm`} style={{ color: meta.color }} />
                  <span className="text-xs font-bold tracking-widest uppercase font-['JetBrains_Mono']" style={{ color: meta.color }}>
                    {isAr ? meta.labelAr : meta.labelEn}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {items.map((c, i) => (
                    <div key={`${c.ref}-${i}`} className="flex items-start gap-3 px-3 py-2 rounded-md"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-['JetBrains_Mono'] tracking-widest flex-shrink-0"
                        style={{
                          background: c.type === "rule" ? "rgba(184,138,60,0.12)" : "rgba(107,79,174,0.12)",
                          color: c.type === "rule" ? "#D6B47E" : "#6B4FAE",
                        }}>
                        {c.type === "rule" ? "RULE" : "ML"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-gray-200 text-xs font-bold font-['JetBrains_Mono']">{c.ref}</span>
                          <span className="text-gray-600 text-[10px]">·</span>
                          <span className="text-gray-500 text-[10px] font-['JetBrains_Mono']">{c.source}</span>
                          <span className="text-[10px] font-bold font-['JetBrains_Mono'] px-1.5 py-0.5 rounded"
                            style={{ background: `${confidenceColor[c.confidence]}18`, color: confidenceColor[c.confidence] }}>
                            {c.confidence}
                          </span>
                        </div>
                        <div className="text-gray-400 text-xs">{c.observed}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[10px] text-gray-600 font-['JetBrains_Mono']">+pts</div>
                        <div className="text-sm font-bold font-['JetBrains_Mono']" style={{ color: meta.color }}>
                          {c.contribution.toFixed(0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wave 2 · D5 — Score replay (as-of time travel) */}
      {!presenterMode && (
        <AsOfReplayPanel isAr={isAr} record={record} />
      )}

      {/* D4 — Feature Vector inspector (developer mode, hidden in presenter) */}
      {!presenterMode && featureVector && (
        <FeatureVectorInspector isAr={isAr} vector={featureVector} />
      )}
    </div>
  );
};

// ─── As-of replay (Wave 2 · D5) ────────────────────────────────────────────

const AsOfReplayPanel = ({ isAr, record }: { isAr: boolean; record: ScoredRecord }) => {
  const [open, setOpen] = useState(false);
  const snaps = AS_OF_SNAPSHOTS[record.id] ?? [];
  const [pickIdx, setPickIdx] = useState(0);
  const snap = snaps[pickIdx];

  if (snaps.length === 0) return null;

  const bucketLabel = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime();
    const hrs = Math.round(diff / 3_600_000);
    if (hrs < 48) return isAr ? `${hrs} ساعة مضت` : `${hrs}h ago`;
    const d = Math.round(hrs / 24);
    return isAr ? `${d} يوماً مضى` : `${d}d ago`;
  };

  const subChartData = DEFAULT_SUB_SCORE_WEIGHTS.map((w) => ({
    key: w.key,
    label: isAr ? w.labelAr : w.labelEn,
    current: record.subScores[w.key],
    asOf: snap.subScores[w.key],
    color: w.color,
  }));

  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-3 cursor-pointer text-left"
        style={{ background: open ? "rgba(184,138,60,0.06)" : "transparent" }}
      >
        <div className="flex items-center gap-2">
          <i className="ri-history-line text-base" style={{ color: "#D6B47E" }} />
          <h3 className="text-white text-sm font-bold">
            {isAr ? "إعادة تشغيل الدرجة · السفر الزمني" : "Score replay · as-of time travel"}
            <span className="ml-2 text-[10px] tracking-widest font-['JetBrains_Mono'] px-2 py-0.5 rounded"
              style={{ background: "rgba(184,138,60,0.15)", color: "#D6B47E" }}>
              {isAr ? "تقني" : "SPEC §8.1"}
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">
            {isAr ? "أعد حساب الدرجة بالوقت الماضي" : "Recompute score at a past time"}
          </span>
          <i className={open ? "ri-arrow-up-s-line text-xl text-gray-400" : "ri-arrow-down-s-line text-xl text-gray-400"} />
        </div>
      </button>

      {open && (
        <div className="p-5 pt-3 border-t" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-[10px] tracking-widest text-gray-500 font-['JetBrains_Mono']">
              {isAr ? "وقت الاستعلام" : "AS-OF"}
            </span>
            {snaps.map((s, i) => (
              <button key={s.asOf} onClick={() => setPickIdx(i)}
                className="px-3 py-1 rounded-md text-xs cursor-pointer"
                style={{
                  background: i === pickIdx ? "rgba(184,138,60,0.15)" : "rgba(255,255,255,0.04)",
                  color: i === pickIdx ? "#D6B47E" : "#9CA3AF",
                  border: `1px solid ${i === pickIdx ? "#D6B47E66" : "rgba(255,255,255,0.08)"}`,
                  fontFamily: "JetBrains Mono",
                }}>
                {bucketLabel(s.asOf)}
              </button>
            ))}
            <span className="ml-auto text-[10px] font-bold tracking-widest px-2 py-0.5 rounded"
              style={{ background: "rgba(107,79,174,0.12)", color: "#6B4FAE", fontFamily: "JetBrains Mono" }}>
              {snap.featureSnapshotHash}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current */}
            <div className="rounded-lg p-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h4 className="text-[10px] tracking-widest text-gray-500 mb-2 font-['JetBrains_Mono']">
                {isAr ? "الآن" : "CURRENT"}
              </h4>
              <p className="font-black font-['JetBrains_Mono']"
                style={{ color: scoreColor(record.band), fontSize: "2.5rem", lineHeight: 1 }}>
                {record.unifiedScore}
              </p>
              <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-widest font-['JetBrains_Mono']"
                style={{ background: `${scoreColor(record.band)}22`, color: scoreColor(record.band), border: `1px solid ${scoreColor(record.band)}55` }}>
                {SCORE_BAND_META[record.band].labelEn}
              </span>
            </div>
            {/* As-of */}
            <div className="rounded-lg p-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h4 className="text-[10px] tracking-widest text-gray-500 mb-2 font-['JetBrains_Mono']">
                {isAr ? "بتاريخ" : `AS-OF ${bucketLabel(snap.asOf).toUpperCase()}`}
              </h4>
              <p className="font-black font-['JetBrains_Mono']"
                style={{ color: "#9CA3AF", fontSize: "2.5rem", lineHeight: 1 }}>
                {snap.unifiedScore}
              </p>
              <p className="text-[10px] text-gray-500 mt-1 font-['JetBrains_Mono']">
                Δ {snap.unifiedScore - record.unifiedScore > 0 ? "+" : ""}{snap.unifiedScore - record.unifiedScore} pts vs current
              </p>
            </div>
          </div>

          {/* Sub-score side-by-side bars */}
          <div className="mt-4 rounded-lg p-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h4 className="text-white text-sm font-bold mb-3">
              {isAr ? "مقارنة الدرجات الفرعية" : "Sub-score comparison"}
            </h4>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,138,60,0.08)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#6B7280" tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
                  <YAxis type="category" dataKey="label" stroke="#6B7280" tick={{ fontSize: 10, fontFamily: "Inter" }} width={130} />
                  <Tooltip contentStyle={{ background: "#0A2540", border: "1px solid rgba(184,138,60,0.3)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="asOf" name={isAr ? "بتاريخ" : "As-of"} fill="#6B7280" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="current" name={isAr ? "الآن" : "Current"} fill="#D6B47E" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Delta per sub */}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-1.5">
              {subChartData.map((d) => {
                const delta = d.current - d.asOf;
                if (delta === 0) return null;
                const worse = delta > 0;
                return (
                  <div key={d.key} className="flex items-center gap-2 text-[11px] px-2 py-1 rounded-md"
                    style={{ background: "rgba(255,255,255,0.03)" }}>
                    <i className={worse ? "ri-arrow-up-line" : "ri-arrow-down-line"}
                      style={{ color: worse ? "#C98A1B" : "#4A8E3A" }} />
                    <span className="text-gray-300 flex-1 truncate font-['Inter']">{d.label}</span>
                    <span className="font-bold font-['JetBrains_Mono']"
                      style={{ color: worse ? "#C98A1B" : "#4A8E3A" }}>
                      {delta > 0 ? "+" : ""}{delta}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Change log */}
          <div className="mt-4 rounded-lg p-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h4 className="text-white text-sm font-bold mb-3">
              {isAr ? "السجل التفصيلي" : "Change log"}
            </h4>
            <ul className="space-y-1.5">
              {snap.differences.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <i className="ri-arrow-right-line mt-0.5" style={{ color: "#D6B47E" }} />
                  <span className="flex-1 text-gray-300 font-['Inter']">
                    <span className="text-gray-500">{d.source}: </span>
                    <span className="text-gray-400">{d.thenValue}</span>
                    <span className="mx-1 text-gray-600">→</span>
                    <span className="text-white">{d.nowValue}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[10px] text-gray-500 font-['JetBrains_Mono']">
              {isAr ? "إعادة تشغيل حتمية — نفس المدخلات + نفس إصدار النموذج = نفس الدرجة ضمن 0.01" : "Deterministic replay — same input + same model version = same score within 0.01"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Feature Vector inspector (D4) ─────────────────────────────────────────

const FV_GROUPS: { key: string; labelEn: string; labelAr: string; fields: (keyof FeatureVector)[] }[] = [
  { key: "routing",     labelEn: "Routing",     labelAr: "المسار",      fields: ["origin_iata", "carrier_iata", "nationality", "stopover_count", "hour_of_arrival", "dow_of_arrival", "booking_to_departure_days"] },
  { key: "behavioral",  labelEn: "Behavioral",  labelAr: "السلوك",       fields: ["prior_overstays", "visit_cadence_days", "mean_length_of_stay_days", "visa_denial_count"] },
  { key: "declaration", labelEn: "Declaration", labelAr: "الإقرار",      fields: ["declared_address_matches_hotel", "declared_address_matches_municipality", "declared_employer_matches_mol", "declared_length_vs_actual_days"] },
  { key: "presence",    labelEn: "Presence",    labelAr: "الحضور",       fields: ["hours_apis_to_first_hotel", "hours_apis_to_first_sim", "hours_apis_to_first_rental_or_mol", "missing_presence_signals_count"] },
  { key: "entity",      labelEn: "Entity",      labelAr: "الكيان",       fields: ["sponsor_propagated_risk", "employer_propagated_risk", "sponsor_graph_degree"] },
  { key: "osint",       labelEn: "OSINT",       labelAr: "OSINT",         fields: ["origin_conflict_intensity_7d", "origin_travel_advisory_level", "outbreak_active_at_origin"] },
  { key: "meta",        labelEn: "Meta",        labelAr: "بيانات الوصف",  fields: ["traveler_id", "decision_point", "as_of", "feature_schema_version"] },
];

const renderFeatureValue = (v: unknown): string => {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number" || typeof v === "string") return JSON.stringify(v);
  return JSON.stringify(v);
};

const FeatureVectorInspector = ({ isAr, vector }: { isAr: boolean; vector: FeatureVector }) => {
  const [open, setOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(FV_GROUPS.map((g) => [g.key, true])),
  );
  const [copied, setCopied] = useState(false);

  const copyJson = () => {
    try {
      const json = JSON.stringify(vector, null, 2);
      navigator.clipboard?.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* noop */ }
  };

  const missingMask = vector.missing_feature_mask ?? {};

  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
      {/* Header row */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-3 cursor-pointer text-left"
        style={{ background: open ? "rgba(184,138,60,0.06)" : "transparent" }}
      >
        <div className="flex items-center gap-2">
          <i className={`ri-code-s-slash-line text-base`} style={{ color: "#D6B47E" }} />
          <h3 className="text-white text-sm font-bold">
            {isAr ? "متجه الميزات" : "Feature Vector"}
            <span className="ml-2 text-[10px] tracking-widest font-['JetBrains_Mono'] px-2 py-0.5 rounded"
              style={{ background: "rgba(107,79,174,0.15)", color: "#6B4FAE" }}>
              {isAr ? "وضع المطوّر" : "DEVELOPER MODE"}
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">
            {isAr ? "مدخلات الـ ML بالضبط · مخطط v1.2.0" : "Exact inputs for ML scoring · schema v1.2.0"}
          </span>
          <i className={open ? "ri-arrow-up-s-line text-xl text-gray-400" : "ri-arrow-down-s-line text-xl text-gray-400"} />
        </div>
      </button>

      {open && (
        <div className="p-5 pt-3 border-t" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
              {Object.keys(missingMask).length > 0
                ? (isAr
                    ? `${Object.keys(missingMask).length} حقل/حقول مفقودة — مُظلَّلة بالكهرماني`
                    : `${Object.keys(missingMask).length} missing feature(s) highlighted in amber`)
                : (isAr ? "جميع الحقول متوفرة" : "All fields present")}
            </p>
            <button onClick={copyJson}
              className="px-3 py-1 rounded-md text-[11px] font-bold font-['JetBrains_Mono'] tracking-widest cursor-pointer flex items-center gap-1.5"
              style={{ background: "rgba(184,138,60,0.06)", border: "1px solid #D6B47E55", color: "#D6B47E" }}>
              <i className={copied ? "ri-check-line" : "ri-file-copy-line"} />
              {copied ? (isAr ? "تم النسخ" : "COPIED") : (isAr ? "نسخ JSON" : "COPY JSON")}
            </button>
          </div>

          <div className="space-y-2">
            {FV_GROUPS.map((g) => {
              const groupOpen = openGroups[g.key] ?? true;
              return (
                <div key={g.key} className="rounded-md overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <button type="button"
                    onClick={() => setOpenGroups((prev) => ({ ...prev, [g.key]: !groupOpen }))}
                    className="w-full flex items-center justify-between px-3 py-1.5 cursor-pointer text-left">
                    <span className="text-[11px] font-bold tracking-widest uppercase font-['JetBrains_Mono']"
                      style={{ color: "#D6B47E" }}>
                      {isAr ? g.labelAr : g.labelEn} · <span className="text-gray-500">{g.fields.length}</span>
                    </span>
                    <i className={groupOpen ? "ri-arrow-up-s-line text-gray-500" : "ri-arrow-down-s-line text-gray-500"} />
                  </button>
                  {groupOpen && (
                    <div className="px-3 pb-2 space-y-1">
                      {g.fields.map((f) => {
                        const val = vector[f];
                        const missing = missingMask[f as string] === true;
                        return (
                          <div key={String(f)}
                            className="flex items-baseline gap-3 rounded-sm px-2 py-1"
                            style={{
                              background: missing ? "rgba(201,138,27,0.10)" : "transparent",
                              borderLeft: missing ? "2px solid #C98A1B" : "2px solid transparent",
                            }}>
                            <span className="text-[11px] font-['JetBrains_Mono'] text-gray-400 w-56 truncate">{String(f)}</span>
                            <span className="text-gray-600 text-[11px]">:</span>
                            <span className="text-[11px] font-['JetBrains_Mono'] font-bold"
                              style={{ color: missing ? "#C98A1B" : "#D6B47E" }}>
                              {renderFeatureValue(val)}
                            </span>
                            {missing && (
                              <span className="text-[9px] font-['JetBrains_Mono'] text-[#C98A1B]/80 ml-auto tracking-widest">
                                {isAr ? "مفقودة" : "MISSING"}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mt-3">
            {isAr
              ? "هذا المتجه هو المدخل الدقيق لنموذج التسجيل — مُسجَّل في كل مرة يتم فيها الحساب."
              : "This vector is the exact input to the scoring model — logged on every computation."}
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Sequence Coherence tab (A2) ────────────────────────────────────────────

const SequenceTab = ({ isAr }: { isAr: boolean }) => {
  return (
    <div className="space-y-4">
      {/* Header blurb */}
      <div className="rounded-xl border p-5 flex flex-col gap-2"
        style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(184,138,60,0.04))", borderColor: "rgba(245,158,11,0.3)" }}>
        <div className="flex items-center gap-2">
          <i className="ri-flow-chart text-[#F59E0B] text-lg" />
          <h3 className="text-white text-base font-bold">{isAr ? "النموذج الثالث — تماسك التسلسل" : "Model 3 — Sequence Coherence"}</h3>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-['JetBrains_Mono'] tracking-widest"
            style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}>
            PRESENCE
          </span>
        </div>
        <p className="text-gray-300 text-xs leading-relaxed">
          {isAr
            ? "يكتشف هذا النموذج فجوات الجدول الزمني عبر تدفقات متعددة. يقارن لكل مسافر نقاط الاتصال المتوقعة (APIS → فندق → شريحة هاتف → تأجير مركبة / وزارة العمل) بالأوقات الفعلية. الفجوات التي تتجاوز الحد تُسهم في الدرجة الفرعية `presence_coherence`."
            : "Detects multi-stream timeline gaps. For each traveler, compares expected cross-stream touchpoints (APIS → Hotel → SIM → Rental / MOL) to observed times. Gaps beyond threshold contribute to the presence_coherence sub-score."}
        </p>
      </div>

      {/* Timeline rows */}
      <div className="space-y-3">
        {SEQUENCE_TIMELINES.map((t) => (
          <SequenceRow key={t.travelerId} timeline={t} isAr={isAr} />
        ))}
      </div>
    </div>
  );
};

const VERDICT_META: Record<SequenceTimeline["verdict"], { color: string; labelEn: string; labelAr: string }> = {
  coherent:          { color: "#4ADE80", labelEn: "COHERENT",           labelAr: "متماسك" },
  "mildly-gapped":   { color: "#FACC15", labelEn: "MILDLY GAPPED",      labelAr: "فجوة خفيفة" },
  "strongly-gapped": { color: "#C94A5E", labelEn: "STRONGLY GAPPED",    labelAr: "فجوة كبيرة" },
  missing:           { color: "#C98A1B", labelEn: "SIGNALS MISSING",    labelAr: "إشارات مفقودة" },
};

const gapColor = (observedHrs: number | null, expectedWithinHrs: number): string => {
  if (observedHrs === null) return "#C98A1B";
  // Ratio of observed to expected window — <=1 is green, 1-2 amber, >2 red.
  if (expectedWithinHrs === 0) return "#4ADE80";
  const r = observedHrs / expectedWithinHrs;
  if (r <= 1) return "#4ADE80";
  if (r <= 2) return "#FACC15";
  return "#C94A5E";
};

const SequenceRow = ({ timeline, isAr }: { timeline: SequenceTimeline; isAr: boolean }) => {
  const verdict = VERDICT_META[timeline.verdict];

  return (
    <div className="rounded-xl border p-5"
      style={{
        background: `linear-gradient(135deg, ${verdict.color}0d, rgba(10,37,64,0.75))`,
        borderColor: `${verdict.color}33`,
      }}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="text-white text-sm font-bold">{isAr ? timeline.travelerNameAr : timeline.travelerName}</h4>
            <span className="text-gray-500 text-[11px] font-['JetBrains_Mono']">{timeline.nationality}</span>
            <ClassificationPill classification={timeline.classification} isAr={isAr} compact />
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-['JetBrains_Mono'] tracking-widest"
              style={{ background: `${verdict.color}20`, color: verdict.color, border: `1px solid ${verdict.color}55` }}>
              {isAr ? verdict.labelAr : verdict.labelEn}
            </span>
          </div>
          <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
            {isAr ? "وصول APIS" : "APIS arrival"}: {new Date(timeline.apisArrivalTs).toISOString().replace("T", " ").slice(0, 16)}Z
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-500 text-[9px] font-bold tracking-widest font-['JetBrains_Mono']">
            {isAr ? "تماسك الحضور" : "PRESENCE COHERENCE"}
          </span>
          <span className="text-3xl font-black font-['JetBrains_Mono']" style={{ color: verdict.color }}>
            {timeline.presenceCoherenceScore}
          </span>
        </div>
      </div>

      {/* Timeline strip */}
      <div className="relative py-4">
        {/* connecting line */}
        <div className="absolute left-0 right-0 top-1/2 h-[2px]" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="relative grid grid-flow-col auto-cols-fr gap-1">
          {timeline.touchpoints.map((tp, i) => {
            const prev: SequenceTouchpoint | null = i > 0 ? timeline.touchpoints[i - 1] : null;
            const color = gapColor(tp.observedHrs, tp.expectedWithinHrs);
            const missing = tp.occurredAt === null && tp.expectedWithinHrs > 0;
            return (
              <div key={tp.stream} className="flex flex-col items-center gap-1 relative">
                {/* gap bar from prev to current */}
                {prev && (
                  <div className="absolute top-[calc(50%-1px)] left-0 h-[3px]"
                    style={{
                      background: missing ? "#C98A1B" : color,
                      width: "50%",
                      transform: "translateX(-50%)",
                      opacity: 0.85,
                    }} />
                )}
                <div className="w-10 h-10 rounded-full flex items-center justify-center relative z-10"
                  style={{
                    background: missing ? "rgba(10,37,64,0.95)" : `${tp.color}22`,
                    border: `2px solid ${missing ? "#C98A1B" : tp.color}`,
                  }}>
                  <i className={`${tp.icon} text-base`}
                    style={{ color: missing ? "#C98A1B" : tp.color, opacity: missing ? 0.4 : 1 }} />
                </div>
                <div className="text-center mt-1">
                  <div className="text-[10px] font-bold text-gray-300">{isAr ? tp.labelAr : tp.labelEn}</div>
                  <div className="text-[10px] font-['JetBrains_Mono']" style={{ color: missing ? "#C98A1B" : color }}>
                    {tp.observedHrs === null
                      ? (tp.expectedWithinHrs === 0 ? "t₀" : (isAr ? "مفقود" : "missing"))
                      : `+${tp.observedHrs}h`}
                  </div>
                  <div className="text-[9px] text-gray-600 font-['JetBrains_Mono']">
                    {tp.expectedWithinHrs === 0
                      ? (isAr ? "الأصل" : "origin")
                      : (isAr ? `متوقّع ≤${tp.expectedWithinHrs}س` : `expect ≤${tp.expectedWithinHrs}h`)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model narrative */}
      <div className="mt-3 pt-3 border-t flex flex-col gap-1"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-gray-300 text-xs leading-relaxed">
          {isAr ? timeline.narrativeAr : timeline.narrativeEn}
        </p>
        <p className="text-[11px] font-['JetBrains_Mono']" style={{ color: verdict.color }}>
          {isAr
            ? `مخرج النموذج: إسهام presence_coherence = ${timeline.presenceCoherenceScore}`
            : `Model output: presence_coherence sub-score contribution = ${timeline.presenceCoherenceScore}`}
        </p>
      </div>
    </div>
  );
};

// ─── Sources tab ────────────────────────────────────────────────────────────

const SourcesTab = ({ isAr, presenterMode }: { isAr: boolean; presenterMode: boolean }) => {
  const [filter, setFilter] = useState<SourceFilter>("all");
  const allSources: OsintSource[] = useMemo(
    () => [...OSINT_SOURCES, ...INTERNAL_STREAMS],
    [],
  );
  const filtered = allSources.filter((s) => (filter === "all" ? true : s.sourceType === filter));

  const osintCount = OSINT_SOURCES.length;
  const internalCount = INTERNAL_STREAMS.length;

  const FILTER_TABS: { id: SourceFilter; labelEn: string; labelAr: string; count: number; color: string }[] = [
    { id: "all",      labelEn: "All",              labelAr: "الكل",           count: osintCount + internalCount, color: "#D6B47E" },
    { id: "osint",    labelEn: "OSINT",            labelAr: "مصادر مفتوحة",   count: osintCount,                 color: "#D6B47E" },
    { id: "internal", labelEn: "Internal Streams", labelAr: "تدفقات داخلية",  count: internalCount,              color: "#4ADE80" },
  ];

  return (
    <div className="space-y-4">
      {/* Filter toggle */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <span className="text-gray-500 text-xs font-bold tracking-widest uppercase font-['JetBrains_Mono']">
          {isAr ? "نوع المصدر" : "Source type"}
        </span>
        <div className="flex gap-1">
          {FILTER_TABS.map((t) => {
            const active = filter === t.id;
            return (
              <button key={t.id} onClick={() => setFilter(t.id)}
                className="px-3 py-1 rounded-md text-[11px] font-bold font-['JetBrains_Mono'] tracking-widest uppercase cursor-pointer"
                style={{
                  background: active ? `${t.color}22` : "transparent",
                  color: active ? t.color : "#6B7280",
                  border: active ? `1px solid ${t.color}55` : "1px solid rgba(255,255,255,0.08)",
                }}>
                {isAr ? t.labelAr : t.labelEn} · {t.count}
              </button>
            );
          })}
        </div>
        <div className="ml-auto text-gray-500 text-xs font-['JetBrains_Mono']">
          {filtered.length} {isAr ? "مصادر مرئية" : "shown"}
        </div>
      </div>

      {/* Source grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((s) => {
          const st = sourceStatusMeta[s.status];
          const cls = CLASSIFICATION_META[s.classification];
          return (
            <div key={s.id} className="rounded-xl border p-4 flex flex-col gap-3 relative overflow-hidden"
              style={{
                background: "rgba(10,37,64,0.65)",
                borderColor: "rgba(184,138,60,0.12)",
                borderLeft: `3px solid ${cls.color}`,
              }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: st.color, boxShadow: `0 0 8px ${st.color}` }} />
                    <h4 className="text-white text-sm font-bold truncate">{s.name}</h4>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-gray-500 text-[11px] font-['JetBrains_Mono'] truncate">{s.category}</p>
                    <ClassificationPill classification={s.classification} isAr={isAr} compact />
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest font-['JetBrains_Mono'] flex-shrink-0"
                  style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}55` }}>
                  {st.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md py-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest font-['JetBrains_Mono']">{isAr ? "التحديث" : "Refresh"}</div>
                  <div className="text-[11px] font-bold font-['JetBrains_Mono']" style={{ color: s.color }}>{s.refresh}</div>
                </div>
                <div className="rounded-md py-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest font-['JetBrains_Mono']">{isAr ? "سجلات 24 ساعة" : "24h records"}</div>
                  <div className="text-[11px] font-bold text-white font-['JetBrains_Mono']">{s.records24h.toLocaleString()}</div>
                </div>
                <div className="rounded-md py-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest font-['JetBrains_Mono']">{isAr ? "الثقة" : "Confidence"}</div>
                  <div className="text-[11px] font-bold font-['JetBrains_Mono']" style={{ color: confidenceColor[s.confidence] }}>
                    {s.confidence}
                  </div>
                </div>
              </div>

              <p className="text-gray-400 text-xs leading-relaxed flex-1">{s.signalContribution}</p>

              {!presenterMode && (
                <div className="flex items-center justify-between text-[10px] font-['JetBrains_Mono'] pt-2 border-t"
                  style={{ borderColor: "rgba(184,138,60,0.08)" }}>
                  <span className="text-gray-600 truncate">{s.endpoint}</span>
                  <span className="flex items-center gap-1 flex-shrink-0" style={{ color: st.color }}>
                    <i className="ri-time-line" /> {timeSince(s.lastSuccess)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border p-4 flex items-start gap-3"
        style={{ background: "rgba(107,79,174,0.06)", borderColor: "rgba(107,79,174,0.25)" }}>
        <i className="ri-lock-2-line text-[#6B4FAE] text-lg mt-0.5" />
        <div>
          <p className="text-white text-sm font-semibold mb-1">{isAr ? "جاهزية رصد — التصميم المنفصل للمصادر" : "Rasad readiness — source-agnostic adapter pattern"}</p>
          <p className="text-gray-400 text-xs leading-relaxed">
            Classified feeds land into the same Event / Entity / Signal schema as OSINT + Internal, with separate weight
            profiles, classification-aware routing, and segregated audit logging. No re-architecting when access is granted.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Config tab ─────────────────────────────────────────────────────────────

const ConfigTab = ({
  isAr, weights, totalWeight, rules, onWeightChange, onWeightReset, onRuleToggle,
  activeProfileId, onProfileSelect, onProfileDiscard,
}: {
  isAr: boolean;
  weights: SubScoreWeight[];
  totalWeight: number;
  rules: RiskRule[];
  onWeightChange: (key: SubScoreKey, value: number) => void;
  onWeightReset: () => void;
  onRuleToggle: (id: string) => void;
  activeProfileId: string;
  onProfileSelect: (id: string) => void;
  onProfileDiscard: () => void;
}) => {
  const balanced = totalWeight === 100;
  // D5 — active profile + dirty-state detection
  const activeProfile = WEIGHT_PROFILES.find((p) => p.id === activeProfileId) ?? WEIGHT_PROFILES[0];
  const isDirty = weights.some((w) => w.weight !== (activeProfile.weights[w.key] ?? w.defaultWeight));
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const handleSaveAttempt = () => {
    setSaveToast(isAr ? "حفظ الملفات يأتي في المرحلة 2" : "Profile saving is Phase 2");
    setTimeout(() => setSaveToast(null), 2600);
  };
  const handleNewProfile = () => {
    setSaveToast(isAr ? "إنشاء ملفات جديدة يأتي في المرحلة 2" : "New profile creation is Phase 2");
    setTimeout(() => setSaveToast(null), 2600);
  };

  // F3 — recompute top-5 records under current weights vs default.
  const computeWithWeights = (ws: SubScoreWeight[]) => {
    const map = new Map(ws.map((w) => [w.key, w.weight]));
    return SCORED_RECORDS.map((r) => {
      const score = Math.round(
        (Object.keys(r.subScores) as SubScoreKey[]).reduce((sum, k) => sum + r.subScores[k] * ((map.get(k) ?? 0) / 100), 0),
      );
      return { id: r.id, name: r.travelerName, score };
    });
  };

  const defaultScored = useMemo(() => computeWithWeights(DEFAULT_SUB_SCORE_WEIGHTS), []);
  const currentScored = useMemo(() => computeWithWeights(weights), [weights]);
  // Pick top-5 by default score to keep the comparison list stable.
  const top5 = useMemo(
    () => [...defaultScored].sort((a, b) => b.score - a.score).slice(0, 5),
    [defaultScored],
  );
  const previewRows = top5.map((d, idx) => {
    const now = currentScored.find((c) => c.id === d.id)!;
    const delta = now.score - d.score;
    return { rank: idx + 1, name: d.name, before: d.score, after: now.score, delta };
  });
  const hasDeltas = previewRows.some((r) => r.delta !== 0);

  return (
    <div className="space-y-4">
      {/* D5 — Weight Profile manager */}
      <div className="rounded-xl border p-4"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <div className="flex items-start justify-between mb-3 gap-3 flex-wrap">
          <div>
            <h3 className="text-white text-sm font-bold flex items-center gap-2">
              <i className="ri-stack-line text-[#D6B47E]" />
              {isAr ? "ملفات الأوزان" : "Weight profiles"}
            </h3>
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
              {isAr
                ? "اختر ملفاً لتوجيه التسجيل بأوزان مختلفة لكل نقطة قرار أو تصنيف مصدر"
                : "Pick a profile to steer scoring with different weights per decision point / source class"}
            </p>
          </div>
          <button onClick={handleNewProfile}
            className="px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer flex items-center gap-1.5"
            style={{ background: "transparent", border: "1px solid #D6B47E55", color: "#D6B47E" }}>
            <i className="ri-add-line" />
            {isAr ? "ملف جديد" : "New Profile"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {WEIGHT_PROFILES.map((p) => {
            const active = p.id === activeProfileId;
            const dpChip = p.decisionPoint === "both"
              ? { label: "ETA + API/PNR", color: "#D6B47E" }
              : { label: p.decisionPoint, color: p.decisionPoint === "ETA" ? "#D6B47E" : "#6B4FAE" };
            const scChip = p.sourceClass === "all" ? null : CLASSIFICATION_META[p.sourceClass];
            return (
              <button key={p.id} onClick={() => onProfileSelect(p.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                style={{
                  background: active
                    ? "linear-gradient(135deg, rgba(184,138,60,0.18), rgba(10,37,64,0.9))"
                    : "rgba(10,37,64,0.85)",
                  color: active ? "#D6B47E" : "#9CA3AF",
                  border: `1px solid ${active ? "#D6B47E" : "rgba(255,255,255,0.1)"}`,
                  boxShadow: active ? "0 0 12px rgba(184,138,60,0.15)" : "none",
                }}>
                <span>{isAr ? p.nameAr : p.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-['JetBrains_Mono']"
                  style={{ background: `${dpChip.color}15`, color: dpChip.color }}>
                  {dpChip.label}
                </span>
                {scChip && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-['JetBrains_Mono']"
                    style={{ background: scChip.bg, color: scChip.color }}>
                    {isAr ? scChip.labelAr : scChip.label}
                  </span>
                )}
                {p.isDefault && (
                  <i className="ri-star-fill text-[10px]" style={{ color: "#D6B47E" }} />
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t flex items-center justify-between gap-3 flex-wrap"
          style={{ borderColor: "rgba(184,138,60,0.08)" }}>
          <p className="text-gray-400 text-xs">
            <span className="text-[#D6B47E] font-semibold">{isAr ? activeProfile.nameAr : activeProfile.name}</span>
            <span className="text-gray-600"> · </span>
            <span className="text-gray-500">{isAr ? activeProfile.descriptionAr : activeProfile.description}</span>
          </p>
          {isDirty && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-['JetBrains_Mono'] tracking-widest" style={{ color: "#C98A1B" }}>
                {isAr ? "تعديلات غير محفوظة" : "UNSAVED CHANGES"}
              </span>
              <button onClick={onProfileDiscard}
                className="px-3 py-1 rounded-md text-[11px] font-semibold cursor-pointer"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
                {isAr ? "تجاهل" : "Discard"}
              </button>
              <button onClick={handleSaveAttempt}
                className="px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer"
                style={{ background: "rgba(184,138,60,0.15)", border: "1px solid #D6B47E", color: "#D6B47E" }}>
                {isAr ? "حفظ" : "Save"}
              </button>
            </div>
          )}
          {saveToast && (
            <span className="text-[11px] font-['JetBrains_Mono']" style={{ color: "#6B4FAE" }}>
              <i className="ri-information-line mr-1" />{saveToast}
            </span>
          )}
        </div>
      </div>

      {/* Weights + preview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white text-sm font-bold">
                {isAr ? "أوزان الدرجات الفرعية" : "Sub-score weights"}
                <span className="ml-2 text-[10px] font-['JetBrains_Mono'] text-gray-500">
                  {isAr ? `الملف النشط: ${activeProfile.nameAr}` : `active: ${activeProfile.name}`}
                </span>
              </h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "اضبط الأوزان. يجب أن يساوي المجموع 100%" : "Tune weights — total must equal 100%"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-widest font-['JetBrains_Mono']"
                style={{ color: balanced ? "#4ADE80" : "#C98A1B" }}>
                TOTAL {totalWeight}%
              </span>
              <button onClick={onWeightReset}
                className="px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
                <i className="ri-restart-line mr-1" />
                {isAr ? "إعادة التعيين" : "Reset to defaults"}
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {weights.map((w) => (
              <div key={w.key} className="grid grid-cols-12 items-center gap-3">
                <div className="col-span-12 md:col-span-3 flex items-center gap-2">
                  <i className={`${w.icon} text-base`} style={{ color: w.color }} />
                  <span className="text-white text-sm font-semibold">{isAr ? w.labelAr : w.labelEn}</span>
                </div>
                <div className="col-span-9 md:col-span-7">
                  <input
                    type="range" min={0} max={40} step={1}
                    value={w.weight}
                    onChange={(e) => onWeightChange(w.key, parseInt(e.target.value))}
                    className="w-full accent-gold-400 cursor-pointer"
                  />
                  <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mt-0.5">
                    {w.primarySources.join(" · ")} — {w.method}
                  </p>
                </div>
                <div className="col-span-3 md:col-span-2 text-right">
                  <span className="text-lg font-black font-['JetBrains_Mono']" style={{ color: w.color }}>
                    {w.weight}%
                  </span>
                  <p className="text-gray-600 text-[10px] font-['JetBrains_Mono']">default {w.defaultWeight}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* F3 — before/after preview panel */}
        <div className="rounded-xl border p-5 flex flex-col"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <div className="mb-3">
            <h3 className="text-white text-sm font-bold flex items-center gap-2">
              <i className="ri-compasses-2-line text-[#D6B47E]" />
              {isAr ? "معاينة: قبل → بعد" : "Preview: before → after"}
            </h3>
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
              {isAr ? "تأثير الأوزان الحالية على أعلى 5 سجلات" : "How top-5 records shift under current weights"}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 text-xs flex-1">
            {previewRows.map((r) => {
              const dColor = r.delta > 0 ? "#C94A5E" : r.delta < 0 ? "#4ADE80" : "#6B7280";
              const dIcon = r.delta > 0 ? "ri-arrow-up-line" : r.delta < 0 ? "ri-arrow-down-line" : "ri-subtract-line";
              return (
                <div key={r.rank} className="flex items-center gap-2 px-2 py-1.5 rounded-md"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="text-gray-500 text-[10px] font-['JetBrains_Mono'] w-5">#{r.rank}</span>
                  <span className="text-gray-300 text-xs flex-1 truncate">{r.name}</span>
                  <span className="text-gray-400 font-['JetBrains_Mono'] text-xs w-8 text-right">{r.before}</span>
                  <i className="ri-arrow-right-s-line text-gray-600" />
                  <span className="text-white font-['JetBrains_Mono'] text-xs font-bold w-8 text-right">{r.after}</span>
                  <span className="font-['JetBrains_Mono'] text-xs font-bold w-14 text-right flex items-center justify-end gap-0.5"
                    style={{ color: dColor }}>
                    <i className={dIcon} />
                    {r.delta === 0 ? "0" : Math.abs(r.delta)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t text-[10px] font-['JetBrains_Mono']"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <span className="text-gray-500">
              {hasDeltas
                ? (isAr ? "التغييرات معاينة — لم يتم تطبيقها بعد" : "Deltas are preview-only — not yet applied")
                : (isAr ? "الأوزان الحالية = الافتراضية" : "Current weights = defaults")}
            </span>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="rounded-xl border p-5"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-sm font-bold">{isAr ? "قواعد التقييم" : "Scoring rules"}</h3>
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
              {rules.filter((r) => r.enabled).length}/{rules.length} {isAr ? "نشطة" : "active"} · {rules.reduce((s, r) => s + r.firesLast24h, 0)} fires · 24h
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {rules.map((r) => {
            const meta = DEFAULT_SUB_SCORE_WEIGHTS.find((w) => w.key === r.category)!;
            return (
              <button
                key={r.id}
                onClick={() => onRuleToggle(r.id)}
                className="flex items-start gap-3 px-3 py-2.5 rounded-md text-left cursor-pointer transition-all"
                style={{
                  background: r.enabled ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                  border: `1px solid ${r.enabled ? "rgba(184,138,60,0.15)" : "rgba(255,255,255,0.04)"}`,
                  opacity: r.enabled ? 1 : 0.55,
                }}>
                <div className="w-9 h-5 rounded-full relative flex-shrink-0 mt-0.5 transition-colors"
                  style={{ background: r.enabled ? "#D6B47E" : "rgba(255,255,255,0.08)" }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                    style={{ left: r.enabled ? "calc(100% - 18px)" : "2px" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold font-['JetBrains_Mono'] text-gray-200">{r.id}</span>
                    <span className="text-[10px] font-bold font-['JetBrains_Mono'] px-1.5 py-0.5 rounded"
                      style={{ background: `${meta.color}18`, color: meta.color }}>
                      {meta.labelEn.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-gray-600 font-['JetBrains_Mono']">{r.version}</span>
                  </div>
                  <div className="text-gray-300 text-xs">{r.description}</div>
                  <div className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mt-0.5">
                    {r.threshold} · {r.firesLast24h} fires · 24h
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Model Governance tab (D2) ──────────────────────────────────────────────

const GovernanceTab = ({ isAr }: { isAr: boolean }) => {
  // Drift: z-score of today's mean vs 30-day baseline using daily stdDev.
  const todayPoint = SCORE_DRIFT_30D[SCORE_DRIFT_30D.length - 1];
  const baseline = SCORE_DRIFT_30D.slice(0, -1);
  const baselineMean = baseline.reduce((s, p) => s + p.meanScore, 0) / baseline.length;
  const baselineSd = Math.sqrt(
    baseline.reduce((s, p) => s + (p.meanScore - baselineMean) ** 2, 0) / baseline.length,
  ) || 1;
  const todayZ = (todayPoint.meanScore - baselineMean) / baselineSd;
  const driftLabel = Math.abs(todayZ) < 2
    ? { en: "Drift · OK", ar: "الانحراف · سليم", color: "#4ADE80" }
    : Math.abs(todayZ) <= 3
      ? { en: "Drift · WATCH", ar: "الانحراف · مراقبة", color: "#C98A1B" }
      : { en: "Drift · BREACH", ar: "الانحراف · خرق", color: "#C94A5E" };

  // Recharts-friendly drift data — compute upper/lower band per day.
  const driftChartData = SCORE_DRIFT_30D.map((p) => ({
    date: p.date.slice(5), // MM-DD
    mean: p.meanScore,
    upper: +(p.meanScore + p.stdDev).toFixed(2),
    lower: +(p.meanScore - p.stdDev).toFixed(2),
    population: p.population,
  }));

  const fairnessBreaches = NATIONALITY_FAIRNESS.filter((n) => Math.abs(n.deviationSigma) > 2).length;
  const fairnessSorted = [...NATIONALITY_FAIRNESS].sort((a, b) => b.flagRatePct - a.flagRatePct);

  const [rollbackConfirm, setRollbackConfirm] = useState(false);
  const [rollbackToast, setRollbackToast] = useState<string | null>(null);
  const confirmRollback = () => {
    setRollbackToast(isAr
      ? "تنفيذ التراجع محجوز للمرحلة 2 — تم تسجيل الطلب"
      : "Rollback execution is Phase 2 — request logged");
    setRollbackConfirm(false);
    setTimeout(() => setRollbackToast(null), 2800);
  };

  return (
    <div className="space-y-4">
      {/* 12-col governance grid */}
      <div className="grid grid-cols-12 gap-4">

        {/* Panel 1 — Version stack (col-span 4) */}
        <div className="col-span-12 lg:col-span-4 rounded-xl border p-5 flex flex-col gap-3"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <div className="flex items-center gap-2">
            <i className="ri-git-commit-line text-[#D6B47E] text-base" />
            <h3 className="text-white text-sm font-bold">{isAr ? "مكدّس الإصدار" : "Version stack"}</h3>
          </div>

          <div className="rounded-lg p-3"
            style={{ background: "linear-gradient(135deg, rgba(107,79,174,0.1), rgba(10,37,64,0.75))", border: "1px solid rgba(107,79,174,0.3)" }}>
            <div className="text-[10px] font-bold tracking-widest text-gray-500 font-['JetBrains_Mono']">
              {isAr ? "نشط" : "ACTIVE"}
            </div>
            <div className="text-white text-lg font-black font-['JetBrains_Mono']">{MODEL_GOVERNANCE.activeVersion}</div>
            <div className="text-gray-500 text-[10px] font-['JetBrains_Mono'] mt-1">
              v{"{SCHEMA}.{REGISTRY}.{PATCH}"}-if{"{IF}"}-prank{"{PR}"}-seq{"{SQ}"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-[9px] tracking-widest text-gray-600 font-['JetBrains_Mono']">{isAr ? "السابق" : "PREVIOUS"}</div>
              <div className="text-gray-300 font-['JetBrains_Mono'] text-xs">{MODEL_GOVERNANCE.previousVersion}</div>
            </div>
            <div className="rounded-md p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-[9px] tracking-widest text-gray-600 font-['JetBrains_Mono']">{isAr ? "أيام الإنتاج" : "PROD DAYS"}</div>
              <div className="text-gray-300 font-['JetBrains_Mono'] text-xs">{MODEL_GOVERNANCE.daysInProduction}d</div>
            </div>
            <div className="rounded-md p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-[9px] tracking-widest text-gray-600 font-['JetBrains_Mono']">{isAr ? "آخر تدريب" : "LAST RETRAIN"}</div>
              <div className="text-gray-300 font-['JetBrains_Mono'] text-xs">{MODEL_GOVERNANCE.lastRetrain}</div>
            </div>
            <div className="rounded-md p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-[9px] tracking-widest text-gray-600 font-['JetBrains_Mono']">{isAr ? "المراجعة القادمة" : "NEXT REVIEW"}</div>
              <div className="text-gray-300 font-['JetBrains_Mono'] text-xs">{MODEL_GOVERNANCE.nextScheduledReview}</div>
            </div>
          </div>

          <div className="mt-auto pt-2 relative">
            <button onClick={() => setRollbackConfirm(true)}
              className="w-full px-3 py-2 rounded-md text-xs font-bold cursor-pointer flex items-center justify-center gap-2"
              style={{ background: "rgba(201,74,94,0.08)", border: "1px solid #C94A5E", color: "#C94A5E" }}
              title={isAr ? "العودة إلى الإصدار السابق" : "Revert to previous version"}>
              <i className="ri-arrow-go-back-line" />
              {isAr ? `التراجع إلى ${MODEL_GOVERNANCE.previousVersion}` : `Revert to ${MODEL_GOVERNANCE.previousVersion}`}
            </button>
            {rollbackConfirm && (
              <div className="absolute inset-x-0 bottom-10 rounded-lg p-3 z-20"
                style={{ background: "#0A2540", border: "1px solid #C94A5E", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                <p className="text-gray-300 text-[11px] mb-2">
                  {isAr
                    ? `تأكيد التراجع إلى ${MODEL_GOVERNANCE.previousVersion}؟ سيتم إنشاء سجل تدقيق.`
                    : `Confirm rollback to ${MODEL_GOVERNANCE.previousVersion}? An audit entry will be created.`}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setRollbackConfirm(false)}
                    className="flex-1 px-2 py-1 rounded text-[11px] font-semibold cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                  <button onClick={confirmRollback}
                    className="flex-1 px-2 py-1 rounded text-[11px] font-bold cursor-pointer"
                    style={{ background: "#C94A5E", color: "white" }}>
                    {isAr ? "تأكيد" : "Confirm"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {rollbackToast && (
            <p className="text-[11px] font-['JetBrains_Mono']" style={{ color: "#C98A1B" }}>
              <i className="ri-information-line mr-1" />{rollbackToast}
            </p>
          )}
        </div>

        {/* Panel 2 — Score distribution + drift (col-span 8) */}
        <div className="col-span-12 lg:col-span-8 rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-white text-sm font-bold flex items-center gap-2">
                <i className="ri-line-chart-line text-[#6B4FAE]" />
                {isAr ? "توزيع الدرجات والانحراف · 30 يوماً" : "Score distribution + drift · 30d"}
              </h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "المتوسط اليومي ±1 انحراف معياري" : "daily mean score with ±1σ band"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-widest font-['JetBrains_Mono'] text-gray-500">
                {isAr ? "z اليوم:" : "today z:"}
                <span className="ml-1 font-bold" style={{ color: driftLabel.color }}>
                  {todayZ.toFixed(2)}σ
                </span>
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest font-['JetBrains_Mono']"
                style={{ background: `${driftLabel.color}22`, color: driftLabel.color, border: `1px solid ${driftLabel.color}55` }}>
                {isAr ? driftLabel.ar : driftLabel.en}
              </span>
            </div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={driftChartData}>
                <defs>
                  <linearGradient id="g-drift-band" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor="#6B4FAE" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6B4FAE" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,138,60,0.08)" />
                <XAxis dataKey="date" stroke="#6B7280" tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
                <YAxis stroke="#6B7280" tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }} domain={["dataMin - 3", "dataMax + 3"]} />
                <Tooltip contentStyle={{ background: "#0A2540", border: "1px solid rgba(184,138,60,0.3)", borderRadius: 8, fontSize: 12, fontFamily: "JetBrains Mono" }} />
                <Area type="monotone" dataKey="upper" stroke="none" fill="url(#g-drift-band)" />
                <Area type="monotone" dataKey="lower" stroke="none" fill="#0A2540" />
                <Line type="monotone" dataKey="mean" stroke="#D6B47E" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel 3 — Calibration curve (col-span 6) */}
        <div className="col-span-12 lg:col-span-6 rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-white text-sm font-bold flex items-center gap-2">
                <i className="ri-crosshair-2-line text-[#4ADE80]" />
                {isAr ? "منحنى المعايرة" : "Calibration curve"}
              </h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "متوقَّع مقابل مُلاحَظ" : "expected vs observed risk"}
              </p>
            </div>
            <span className="text-[10px] tracking-widest font-['JetBrains_Mono']" style={{ color: "#4ADE80" }}>
              <i className="ri-checkbox-circle-fill mr-1" />
              {isAr ? "آخر تشغيل: 2026-04-17 02:15 UTC · سليم" : "Last run: 2026-04-17 02:15 UTC · OK"}
            </span>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,138,60,0.08)" />
                <XAxis type="number" dataKey="expectedPct" domain={[0, 100]} stroke="#6B7280"
                  tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }}
                  label={{ value: isAr ? "المتوقَّع %" : "expected %", fill: "#6B7280", fontSize: 10, position: "insideBottomRight", offset: -2 }} />
                <YAxis type="number" dataKey="observedPct" domain={[0, 100]} stroke="#6B7280"
                  tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }}
                  label={{ value: isAr ? "المُلاحَظ %" : "observed %", fill: "#6B7280", fontSize: 10, angle: -90, position: "insideLeft" }} />
                <Tooltip contentStyle={{ background: "#0A2540", border: "1px solid rgba(184,138,60,0.3)", borderRadius: 8, fontSize: 12, fontFamily: "JetBrains Mono" }} />
                <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 100, y: 100 }]} stroke="#D6B47E" strokeDasharray="4 4" />
                <Scatter data={CALIBRATION_CURVE} fill="#4ADE80" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-gray-500 text-[10px] font-['JetBrains_Mono'] mt-2">
            {isAr
              ? "النسب المحسوبة مُعايَرة ليلياً · المجموع المحدود المرئي = المخرَج المُعايَر"
              : "Percentile mapping re-calibrated nightly · bounded sum visible = calibrated output"}
          </p>
        </div>

        {/* Panel 4 — Per-nationality fairness (col-span 6) */}
        <div className="col-span-12 lg:col-span-6 rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-white text-sm font-bold flex items-center gap-2">
                <i className="ri-scales-3-line text-[#D6B47E]" />
                {isAr ? "العدالة عبر الجنسيات" : "Per-nationality fairness"}
              </h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "أعلى 10 معدل رفع + انحراف عن المتوسط العالمي" : "top 10 flag-rate + deviation vs global mean"}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest font-['JetBrains_Mono']"
              style={{ background: fairnessBreaches === 0 ? "rgba(74,222,128,0.15)" : "rgba(201,74,94,0.15)", color: fairnessBreaches === 0 ? "#4ADE80" : "#C94A5E" }}>
              {isAr
                ? `${fairnessBreaches} جنسيات تتجاوز حد 2σ`
                : `${fairnessBreaches} nationalities breaching 2σ`}
            </span>
          </div>
          <div className="space-y-1.5">
            {fairnessSorted.slice(0, 10).map((n) => {
              const absSigma = Math.abs(n.deviationSigma);
              const sigmaColor = absSigma <= 1 ? "#4ADE80" : absSigma <= 2 ? "#C98A1B" : "#C94A5E";
              const barPct = Math.min(100, n.flagRatePct * 2);
              return (
                <div key={n.iso3} className="flex items-center gap-2 text-xs">
                  <span className="w-12 text-gray-400 font-['JetBrains_Mono']">{n.iso3}</span>
                  <span className="w-28 text-gray-300 truncate">{n.name}</span>
                  <div className="flex-1 h-3.5 rounded-sm relative overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="h-full"
                      style={{ width: `${barPct}%`, background: sigmaColor, opacity: 0.85 }} />
                  </div>
                  <span className="w-12 text-right font-bold font-['JetBrains_Mono']" style={{ color: sigmaColor }}>
                    {n.flagRatePct.toFixed(1)}%
                  </span>
                  <span className="w-14 text-right font-['JetBrains_Mono']" style={{ color: sigmaColor }}>
                    {n.deviationSigma > 0 ? "+" : ""}{n.deviationSigma.toFixed(2)}σ
                  </span>
                  {absSigma > 2 && (
                    <i className="ri-error-warning-line text-base" style={{ color: "#C94A5E" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 5 — Model registry timeline (col-span 12) */}
        <div className="col-span-12 rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-white text-sm font-bold flex items-center gap-2">
                <i className="ri-timeline-view text-[#D6B47E]" />
                {isAr ? "الخط الزمني للسجل" : "Model registry timeline"}
              </h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "آخر 6 إصدارات منشورة" : "last 6 versions deployed"}
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-['JetBrains_Mono']" style={{ color: "#6B4FAE" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#6B4FAE" }} />
              {isAr
                ? "يعمل حالياً v0.3.2-rc1 في وضع الظل للتقييم"
                : "Currently running v0.3.2-rc1 in shadow mode for evaluation"}
            </span>
          </div>

          <div className="relative pt-4 pb-6">
            <div className="absolute left-0 right-0 top-[50%] h-[2px]" style={{ background: "rgba(184,138,60,0.2)" }} />
            <div className="grid grid-flow-col auto-cols-fr gap-2 relative">
              {MODEL_REGISTRY_TIMELINE.map((m) => {
                const statusMeta = m.status === "active"
                  ? { color: "#4ADE80", label: isAr ? "نشط" : "ACTIVE",   icon: "ri-check-double-line" }
                  : m.status === "shadow"
                    ? { color: "#6B4FAE", label: isAr ? "ظل" : "SHADOW", icon: "ri-moon-line" }
                    : { color: "#6B7280", label: isAr ? "متقاعد" : "RETIRED", icon: "ri-pause-circle-line" };
                return (
                  <div key={m.version} className="flex flex-col items-center gap-2">
                    <div className="text-[10px] text-gray-500 font-['JetBrains_Mono']">{m.deployedAt}</div>
                    <div className="w-5 h-5 rounded-full relative z-10 flex items-center justify-center"
                      style={{ background: `${statusMeta.color}22`, border: `2px solid ${statusMeta.color}` }}>
                      {m.status !== "retired" && (
                        <span className="w-2 h-2 rounded-full" style={{ background: statusMeta.color }} />
                      )}
                    </div>
                    <div className="text-xs font-bold text-white font-['JetBrains_Mono']">{m.version}</div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-['JetBrains_Mono'] tracking-widest"
                      style={{ background: `${statusMeta.color}18`, color: statusMeta.color }}>
                      <i className={`${statusMeta.icon} mr-0.5`} />{statusMeta.label}
                    </span>
                    <p className="text-[10px] text-gray-500 text-center max-w-[160px] leading-tight">
                      {isAr ? m.noteAr : m.noteEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OsintRiskEnginePage;
