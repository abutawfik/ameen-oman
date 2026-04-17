// OSINT Risk Engine — top-level page. Owns:
//   • tab orchestration + outlet-context consumption (isAr)
//   • shared state used by multiple tabs (weights, rules, selected record,
//     scenario filter, presenter mode, weight profile)
//   • global keyboard shortcut (E = presenter mode)
//   • classification banner + sticky header + tab strip
//   • the aggregate() pass that feeds Overview KPIs and header badges
// Each tab body lives in its own file under ./tabs. Reusable presentational
// sub-components are under ./components. Pure helpers under ./helpers.

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import {
  INTERNAL_STREAMS, OSINT_SOURCES, RISK_RULES, SCORED_RECORDS,
  DEFAULT_SUB_SCORE_WEIGHTS, WEIGHT_PROFILES, FEATURE_VECTORS,
  aggregate,
  type DecisionPoint, type RiskBand, type RiskRule, type ScoredRecord,
  type SubScoreKey, type SubScoreWeight,
} from "@/mocks/osintData";
import type { Tab } from "./helpers/shared";
import { DEMO_SCENARIO_CARDS } from "./helpers/demoScenarios";
import OverviewTab from "./tabs/OverviewTab";
import QueueTab from "./tabs/QueueTab";
import ExplainTab from "./tabs/ExplainTab";
import SequenceTab from "./tabs/SequenceTab";
import SourcesTab from "./tabs/SourcesTab";
import ConfigTab from "./tabs/ConfigTab";
import GovernanceTab from "./tabs/GovernanceTab";
import RasadTab from "./tabs/RasadTab";

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
    { id: "rasad",    icon: "ri-shield-keyhole-line", labelEn: "Rasad (Phase 2)", labelAr: "رصد · المرحلة 2" },
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

      {/* Tabs — ARIA tablist for SR + keyboard arrow-key navigation */}
      <div
        role="tablist"
        aria-label={isAr ? "أقسام محرّك المخاطر" : "Risk Engine sections"}
        className="sticky top-[57px] z-30 flex items-center gap-1 px-6 py-2 border-b overflow-x-auto"
        style={{ background: "rgba(var(--alm-ocean-800-rgb), 0.92)", borderColor: "rgba(184,138,60,0.08)", backdropFilter: "blur(12px)" }}
        onKeyDown={(e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          const idx = TABS.findIndex((t) => t.id === activeTab);
          const delta = (isAr ? -1 : 1) * (e.key === "ArrowRight" ? 1 : -1);
          const next = TABS[(idx + delta + TABS.length) % TABS.length];
          if (next) {
            e.preventDefault();
            setActiveTab(next.id);
            // Defer focus so the new tab renders before we move keyboard focus.
            window.setTimeout(() => {
              const el = document.getElementById(`osint-tab-${next.id}`);
              el?.focus();
            }, 0);
          }
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`osint-tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`osint-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap cursor-pointer transition-all"
              style={{
                background: isActive ? "rgba(184,138,60,0.1)" : "transparent",
                color: isActive ? "#D6B47E" : "#6B7280",
                border: isActive ? "1px solid rgba(184,138,60,0.3)" : "1px solid transparent",
              }}
            >
              <i className={tab.icon} aria-hidden="true" />
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
      </div>

      {/* Content — each panel is a labelledby region targeting the tab button */}
      <div
        role="tabpanel"
        id={`osint-panel-${activeTab}`}
        aria-labelledby={`osint-tab-${activeTab}`}
        tabIndex={0}
        className="relative z-10 px-6 py-6 max-w-[1600px] mx-auto"
      >
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
        {activeTab === "rasad" && <RasadTab isAr={isAr} onOpenConfig={() => setActiveTab("config")} onOpenAudit={() => navigate("/dashboard/audit-log")} />}
      </div>
    </div>
  );
};

export default OsintRiskEnginePage;
