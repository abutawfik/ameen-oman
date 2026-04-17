import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import {
  OSINT_SOURCES,
  SCORED_RECORDS,
  DEFAULT_SUB_SCORE_WEIGHTS,
  RISK_RULES,
  THROUGHPUT_24H,
  SCORE_BAND_META,
  aggregate,
  type ScoredRecord,
  type SubScoreWeight,
  type RiskRule,
  type RiskBand,
  type DecisionPoint,
  type SubScoreKey,
} from "@/mocks/osintData";

type Tab = "overview" | "queue" | "explain" | "sources" | "config";

// ─── Shared helpers ─────────────────────────────────────────────────────────

const scoreColor = (band: RiskBand) => SCORE_BAND_META[band].color;

const confidenceColor: Record<string, string> = {
  "High": "#4ADE80",
  "Medium-High": "#22D3EE",
  "Medium": "#FACC15",
  "Low": "#F87171",
};

const sourceStatusMeta: Record<string, { color: string; bg: string; label: string }> = {
  healthy:  { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",  label: "HEALTHY" },
  degraded: { color: "#FB923C", bg: "rgba(251,146,60,0.1)",  label: "DEGRADED" },
  stale:    { color: "#FACC15", bg: "rgba(250,204,21,0.1)",  label: "STALE" },
  down:     { color: "#F87171", bg: "rgba(248,113,113,0.1)", label: "DOWN" },
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

// ─── Main page ──────────────────────────────────────────────────────────────

const OsintRiskEnginePage = () => {
  const navigate = useNavigate();
  const [isAr, setIsAr] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filterBand, setFilterBand] = useState<"all" | RiskBand>("all");
  const [filterDecision, setFilterDecision] = useState<"all" | DecisionPoint>("all");
  const [selected, setSelected] = useState<ScoredRecord | null>(null);
  const [weights, setWeights] = useState<SubScoreWeight[]>(DEFAULT_SUB_SCORE_WEIGHTS);
  const [rules, setRules] = useState<RiskRule[]>(RISK_RULES);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

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

  const filteredRecords = useMemo(() => {
    return SCORED_RECORDS.filter((r) => {
      if (filterBand !== "all" && r.band !== filterBand) return false;
      if (filterDecision !== "all" && r.decisionPoint !== filterDecision) return false;
      return true;
    }).sort((a, b) => b.unifiedScore - a.unifiedScore);
  }, [filterBand, filterDecision]);

  const TABS: { id: Tab; icon: string; labelEn: string; labelAr: string; badge?: number; badgeColor?: string }[] = [
    { id: "overview", icon: "ri-dashboard-3-line",  labelEn: "Overview",       labelAr: "نظرة عامة" },
    { id: "queue",    icon: "ri-list-check-2",      labelEn: "Operator Queue", labelAr: "قائمة المشغّل", badge: agg.flagged24h, badgeColor: "#F87171" },
    { id: "explain",  icon: "ri-focus-3-line",      labelEn: "Explainability", labelAr: "الشرح والتبرير" },
    { id: "sources",  icon: "ri-broadcast-line",    labelEn: "OSINT Sources",  labelAr: "مصادر البيانات", badge: agg.sourcesHealthy, badgeColor: "#4ADE80" },
    { id: "config",   icon: "ri-equalizer-line",    labelEn: "Configuration",  labelAr: "الإعدادات" },
  ];

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#060D1A" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Grid texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            `linear-gradient(rgba(34,211,238,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.025) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Classification banner */}
      <div className="w-full py-1.5 px-6 flex items-center justify-between relative z-10"
        style={{ background: "#7F1D1D", borderBottom: "1px solid rgba(248,113,113,0.4)" }}>
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
        style={{ background: "rgba(6,13,26,0.97)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
            <i className="ri-arrow-left-line" />
            {isAr ? "لوحة التحكم" : "Dashboard"}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ background: "rgba(170,149,255,0.1)", border: "2px solid rgba(170,149,255,0.3)" }}>
              <i className="ri-radar-line text-[#AA95FF] text-base" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-black text-base tracking-wide">AMEEN</span>
                <span className="text-white font-bold text-sm">{isAr ? "محرّك المخاطر OSINT" : "OSINT Risk Engine"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(170,149,255,0.15)", color: "#AA95FF", border: "1px solid rgba(170,149,255,0.3)" }}>
                  PoC · v0.3.1
                </span>
              </div>
              <p className="text-gray-500 text-xs font-['JetBrains_Mono']">
                ETA + API/PNR · Rules baseline + ML overlay · Explainable
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col items-end px-3 py-1.5 rounded-lg border"
            style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.12)" }}>
            <span className="text-cyan-400 text-sm font-black font-['JetBrains_Mono']">{timeStr}</span>
            <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{dateStr}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
            style={{ background: "rgba(74,222,128,0.08)", borderColor: "rgba(74,222,128,0.3)" }}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-bold font-['JetBrains_Mono']">
              {agg.sourcesHealthy}/{agg.sourcesTotal} {isAr ? "مصادر حيّة" : "SOURCES LIVE"}
            </span>
          </div>
          <button type="button" onClick={() => setIsAr((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer whitespace-nowrap"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
            <i className="ri-translate-2 text-xs" />{isAr ? "EN" : "عربي"}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="sticky top-[57px] z-30 flex items-center gap-1 px-6 py-2 border-b overflow-x-auto"
        style={{ background: "rgba(6,13,26,0.92)", borderColor: "rgba(34,211,238,0.08)", backdropFilter: "blur(12px)" }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap cursor-pointer transition-all"
              style={{
                background: isActive ? "rgba(34,211,238,0.1)" : "transparent",
                color: isActive ? "#22D3EE" : "#6B7280",
                border: isActive ? "1px solid rgba(34,211,238,0.3)" : "1px solid transparent",
              }}
            >
              <i className={tab.icon} />
              <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              {typeof tab.badge === "number" && tab.badge > 0 && (
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
        {activeTab === "overview" && <OverviewTab isAr={isAr} agg={agg} />}
        {activeTab === "queue" && (
          <QueueTab
            isAr={isAr}
            records={filteredRecords}
            filterBand={filterBand}
            setFilterBand={setFilterBand}
            filterDecision={filterDecision}
            setFilterDecision={setFilterDecision}
            onSelect={(r) => { setSelected(r); setActiveTab("explain"); }}
          />
        )}
        {activeTab === "explain" && (
          <ExplainTab
            isAr={isAr}
            record={selected}
            weights={weights}
            onBack={() => setActiveTab("queue")}
          />
        )}
        {activeTab === "sources" && <SourcesTab isAr={isAr} />}
        {activeTab === "config" && (
          <ConfigTab
            isAr={isAr}
            weights={weights}
            totalWeight={totalWeight}
            rules={rules}
            onWeightChange={handleWeightChange}
            onWeightReset={handleWeightReset}
            onRuleToggle={handleRuleToggle}
          />
        )}
      </main>
    </div>
  );
};

// ─── Overview tab ───────────────────────────────────────────────────────────

const OverviewTab = ({ isAr, agg }: { isAr: boolean; agg: ReturnType<typeof aggregate> }) => {
  const bandCounts = useMemo(() => {
    const c: Record<RiskBand, number> = { critical: 0, high: 0, elevated: 0, borderline: 0, low: 0 };
    SCORED_RECORDS.forEach((r) => { c[r.band]++; });
    return c;
  }, []);

  const kpis = [
    { label: isAr ? "مسجّل خلال 24 ساعة"  : "Scored · 24h",      value: agg.total24h.toLocaleString(),  color: "#22D3EE", icon: "ri-pulse-line" },
    { label: isAr ? "مُرفَع للمراجعة" : "Flagged · 24h",           value: agg.flagged24h.toString(),      color: "#F87171", icon: "ri-alarm-warning-line" },
    { label: isAr ? "معدل الرفع"       : "Flag rate",              value: `${agg.flagRate}%`,             color: "#FB923C", icon: "ri-percent-line" },
    { label: isAr ? "متوسط الدرجة"    : "Avg unified score",       value: agg.avgScore.toString(),        color: "#AA95FF", icon: "ri-scales-3-line" },
    { label: isAr ? "مصادر حيّة"       : "Sources live",            value: `${agg.sourcesHealthy}/${agg.sourcesTotal}`, color: "#4ADE80", icon: "ri-broadcast-line" },
    { label: isAr ? "إصدار النموذج"   : "Model version",            value: "mvp-0.3.1",                    color: "#FACC15", icon: "ri-git-commit-line" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border p-4"
            style={{ background: "rgba(10,22,40,0.65)", borderColor: "rgba(34,211,238,0.12)" }}>
            <div className="flex items-center gap-2 mb-2">
              <i className={`${k.icon} text-lg`} style={{ color: k.color }} />
              <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase font-['JetBrains_Mono']">{k.label}</span>
            </div>
            <div className="text-white text-2xl font-black font-['JetBrains_Mono']" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Throughput chart */}
      <div className="rounded-xl border p-5"
        style={{ background: "rgba(10,22,40,0.65)", borderColor: "rgba(34,211,238,0.12)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-base font-bold">{isAr ? "إنتاجية المحرّك · آخر 24 ساعة" : "Engine throughput · last 24h"}</h3>
            <p className="text-gray-500 text-xs font-['JetBrains_Mono']">scored vs flagged · hourly</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-['JetBrains_Mono']">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "#22D3EE" }} /> <span className="text-gray-400">scored</span></span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "#F87171" }} /> <span className="text-gray-400">flagged</span></span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={THROUGHPUT_24H}>
              <defs>
                <linearGradient id="g-scored" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="g-flagged" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F87171" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#F87171" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,211,238,0.08)" />
              <XAxis dataKey="hour" stroke="#6B7280" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <YAxis stroke="#6B7280" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <Tooltip contentStyle={{ background: "#0A1628", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 8, fontSize: 12, fontFamily: "JetBrains Mono" }} />
              <Area type="monotone" dataKey="scored"  stroke="#22D3EE" strokeWidth={2} fill="url(#g-scored)"  />
              <Area type="monotone" dataKey="flagged" stroke="#F87171" strokeWidth={2} fill="url(#g-flagged)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Band distribution + Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border p-5"
          style={{ background: "rgba(10,22,40,0.65)", borderColor: "rgba(34,211,238,0.12)" }}>
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
          style={{ background: "linear-gradient(135deg, rgba(170,149,255,0.08), rgba(34,211,238,0.04))", borderColor: "rgba(170,149,255,0.25)" }}>
          <div className="flex items-center gap-2">
            <i className="ri-lightbulb-flash-line text-[#AA95FF]" />
            <h3 className="text-white text-sm font-bold">{isAr ? "ما الذي يفعله المحرّك" : "What the engine does"}</h3>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Fuses open-source intelligence (OpenSanctions, GDELT, ACLED, WHO, OpenSky + advisories) into one unified
            0–100 risk score at ETA adjudication and API/PNR pre-arrival. Deterministic rules for auditability,
            unsupervised ML for pattern detection, SHAP-style attribution for every flag.
          </p>
          <p className="text-gray-500 text-[11px] font-['JetBrains_Mono'] pt-2 border-t" style={{ borderColor: "rgba(170,149,255,0.2)" }}>
            Architected source-agnostic — Rasad integrates as a new adapter when access is granted.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Queue tab ──────────────────────────────────────────────────────────────

const QueueTab = ({
  isAr, records, filterBand, setFilterBand, filterDecision, setFilterDecision, onSelect,
}: {
  isAr: boolean;
  records: ScoredRecord[];
  filterBand: "all" | RiskBand;
  setFilterBand: (v: "all" | RiskBand) => void;
  filterDecision: "all" | DecisionPoint;
  setFilterDecision: (v: "all" | DecisionPoint) => void;
  onSelect: (r: ScoredRecord) => void;
}) => {
  const BANDS: ("all" | RiskBand)[] = ["all", "critical", "high", "elevated", "borderline", "low"];
  const DPOINTS: ("all" | DecisionPoint)[] = ["all", "ETA", "API_PNR"];

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border"
        style={{ background: "rgba(10,22,40,0.65)", borderColor: "rgba(34,211,238,0.12)" }}>
        <span className="text-gray-500 text-xs font-bold tracking-widest uppercase font-['JetBrains_Mono']">
          {isAr ? "تصفية" : "Filter"}
        </span>
        <div className="flex gap-1">
          {BANDS.map((b) => {
            const active = filterBand === b;
            const col = b === "all" ? "#22D3EE" : SCORE_BAND_META[b as RiskBand].color;
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
                  background: active ? "rgba(170,149,255,0.18)" : "transparent",
                  color: active ? "#AA95FF" : "#6B7280",
                  border: active ? "1px solid rgba(170,149,255,0.4)" : "1px solid rgba(255,255,255,0.08)",
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
        style={{ background: "rgba(10,22,40,0.65)", borderColor: "rgba(34,211,238,0.12)" }}>
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b text-[10px] font-bold tracking-widest uppercase font-['JetBrains_Mono']"
          style={{ borderColor: "rgba(34,211,238,0.08)", color: "#6B7280" }}>
          <div className="col-span-1">Score</div>
          <div className="col-span-3">{isAr ? "المسافر" : "Traveler"}</div>
          <div className="col-span-1">Nat.</div>
          <div className="col-span-2">{isAr ? "الرحلة" : "Flight"}</div>
          <div className="col-span-2">{isAr ? "الكفيل" : "Sponsor / Visa"}</div>
          <div className="col-span-1">Point</div>
          <div className="col-span-1">Band</div>
          <div className="col-span-1 text-right">{isAr ? "الشرح" : "Explain"}</div>
        </div>
        {records.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className="w-full grid grid-cols-12 gap-2 px-4 py-3 border-b cursor-pointer transition-colors text-left hover:bg-white/[0.03]"
            style={{ borderColor: "rgba(34,211,238,0.05)" }}
          >
            {/* Score */}
            <div className="col-span-1 flex items-center">
              <div className="relative w-12 h-12 flex items-center justify-center rounded-lg"
                style={{ background: `${scoreColor(r.band)}18`, border: `2px solid ${scoreColor(r.band)}55` }}>
                <span className="text-sm font-black font-['JetBrains_Mono']" style={{ color: scoreColor(r.band) }}>
                  {r.unifiedScore}
                </span>
              </div>
            </div>
            {/* Traveler */}
            <div className="col-span-3 flex flex-col justify-center min-w-0">
              <span className="text-white text-sm font-semibold truncate">{r.travelerName}</span>
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
                  background: r.decisionPoint === "ETA" ? "rgba(34,211,238,0.1)" : "rgba(170,149,255,0.1)",
                  color: r.decisionPoint === "ETA" ? "#22D3EE" : "#AA95FF",
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
  isAr, record, weights, onBack,
}: { isAr: boolean; record: ScoredRecord | null; weights: SubScoreWeight[]; onBack: () => void; }) => {
  if (!record) {
    return (
      <div className="rounded-xl border p-8 text-center"
        style={{ background: "rgba(10,22,40,0.65)", borderColor: "rgba(34,211,238,0.12)" }}>
        <i className="ri-focus-3-line text-5xl text-gray-600 mb-3" />
        <p className="text-gray-400 mb-4">{isAr ? "اختر سجلاً من قائمة المشغّل لعرض الشرح" : "Select a record from the Operator Queue to see its explainability breakdown"}</p>
        <button onClick={onBack}
          className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
          style={{ background: "rgba(34,211,238,0.1)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.3)" }}>
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

  // Group contributions by sub-score for readability
  const contribsBySub: Record<SubScoreKey, typeof record.contributions> = {
    sanctions: [], geopolitical: [], biosecurity: [], routing: [], entity: [], document: [],
  };
  record.contributions.forEach((c) => contribsBySub[c.subScore].push(c));

  return (
    <div className="space-y-4">
      {/* Traveler header */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border p-5"
        style={{
          background: `linear-gradient(135deg, ${scoreColor(record.band)}14, rgba(10,22,40,0.8))`,
          borderColor: `${scoreColor(record.band)}44`,
        }}>
        <div className="flex items-start gap-4">
          <button onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
            <i className="ri-arrow-left-line" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-white text-xl font-bold">{record.travelerName}</h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest font-['JetBrains_Mono']"
                style={{ background: `${scoreColor(record.band)}22`, color: scoreColor(record.band), border: `1px solid ${scoreColor(record.band)}55` }}>
                {SCORE_BAND_META[record.band].labelEn}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-['JetBrains_Mono']"
                style={{
                  background: record.decisionPoint === "ETA" ? "rgba(34,211,238,0.1)" : "rgba(170,149,255,0.1)",
                  color: record.decisionPoint === "ETA" ? "#22D3EE" : "#AA95FF",
                }}>
                {record.decisionPoint}
              </span>
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
          <span className="text-4xl font-black font-['JetBrains_Mono']" style={{ color: scoreColor(record.band) }}>
            {record.unifiedScore}
          </span>
          <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">
            model {record.modelVersion}
          </span>
        </div>
      </div>

      {/* Sub-score bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border p-5"
          style={{ background: "rgba(10,22,40,0.65)", borderColor: "rgba(34,211,238,0.12)" }}>
          <h3 className="text-white text-sm font-bold mb-4">{isAr ? "الدرجات الفرعية" : "Sub-score contribution"}</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,211,238,0.08)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#6B7280" tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
                <YAxis type="category" dataKey="label" stroke="#6B7280" tick={{ fontSize: 11, fontFamily: "Inter" }} width={110} />
                <Tooltip contentStyle={{ background: "#0A1628", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {subChartData.map((d) => (<Cell key={d.key} fill={d.color} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight contribution legend */}
        <div className="rounded-xl border p-5"
          style={{ background: "rgba(10,22,40,0.65)", borderColor: "rgba(34,211,238,0.12)" }}>
          <h3 className="text-white text-sm font-bold mb-4">{isAr ? "الأوزان النشطة" : "Active weights"}</h3>
          <div className="space-y-2.5">
            {weights.map((w) => {
              const sub = record.subScores[w.key];
              const pts = (sub * (w.weight / 100)).toFixed(1);
              return (
                <div key={w.key} className="flex items-center gap-3 text-xs">
                  <i className={`${w.icon} text-base`} style={{ color: w.color }} />
                  <span className="text-gray-300 flex-1 font-semibold">{w.labelEn}</span>
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
        style={{ background: "rgba(10,22,40,0.65)", borderColor: "rgba(34,211,238,0.12)" }}>
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
                    {meta.labelEn}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {items.map((c, i) => (
                    <div key={`${c.ref}-${i}`} className="flex items-start gap-3 px-3 py-2 rounded-md"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-['JetBrains_Mono'] tracking-widest flex-shrink-0"
                        style={{
                          background: c.type === "rule" ? "rgba(34,211,238,0.12)" : "rgba(170,149,255,0.12)",
                          color: c.type === "rule" ? "#22D3EE" : "#AA95FF",
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
    </div>
  );
};

// ─── Sources tab ────────────────────────────────────────────────────────────

const SourcesTab = ({ isAr }: { isAr: boolean }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {OSINT_SOURCES.map((s) => {
          const st = sourceStatusMeta[s.status];
          return (
            <div key={s.id} className="rounded-xl border p-4 flex flex-col gap-3"
              style={{ background: "rgba(10,22,40,0.65)", borderColor: "rgba(34,211,238,0.12)" }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: st.color, boxShadow: `0 0 8px ${st.color}` }} />
                    <h4 className="text-white text-sm font-bold truncate">{s.name}</h4>
                  </div>
                  <p className="text-gray-500 text-[11px] font-['JetBrains_Mono'] truncate">{s.category}</p>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest font-['JetBrains_Mono'] flex-shrink-0"
                  style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}55` }}>
                  {st.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md py-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest font-['JetBrains_Mono']">Refresh</div>
                  <div className="text-[11px] font-bold font-['JetBrains_Mono']" style={{ color: s.color }}>{s.refresh}</div>
                </div>
                <div className="rounded-md py-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest font-['JetBrains_Mono']">24h records</div>
                  <div className="text-[11px] font-bold text-white font-['JetBrains_Mono']">{s.records24h.toLocaleString()}</div>
                </div>
                <div className="rounded-md py-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest font-['JetBrains_Mono']">Confidence</div>
                  <div className="text-[11px] font-bold font-['JetBrains_Mono']" style={{ color: confidenceColor[s.confidence] }}>
                    {s.confidence}
                  </div>
                </div>
              </div>

              <p className="text-gray-400 text-xs leading-relaxed flex-1">{s.signalContribution}</p>

              <div className="flex items-center justify-between text-[10px] font-['JetBrains_Mono'] pt-2 border-t"
                style={{ borderColor: "rgba(34,211,238,0.08)" }}>
                <span className="text-gray-600 truncate">{s.endpoint}</span>
                <span className="flex items-center gap-1 flex-shrink-0" style={{ color: st.color }}>
                  <i className="ri-time-line" /> {timeSince(s.lastSuccess)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border p-4 flex items-start gap-3"
        style={{ background: "rgba(170,149,255,0.06)", borderColor: "rgba(170,149,255,0.25)" }}>
        <i className="ri-lock-2-line text-[#AA95FF] text-lg mt-0.5" />
        <div>
          <p className="text-white text-sm font-semibold mb-1">{isAr ? "جاهزية رصد — التصميم المنفصل للمصادر" : "Rasad readiness — source-agnostic adapter pattern"}</p>
          <p className="text-gray-400 text-xs leading-relaxed">
            Classified feeds land into the same Event / Entity / Signal schema as OSINT, with separate weight profiles,
            classification-aware routing, and segregated audit logging. No re-architecting when access is granted.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Config tab ─────────────────────────────────────────────────────────────

const ConfigTab = ({
  isAr, weights, totalWeight, rules, onWeightChange, onWeightReset, onRuleToggle,
}: {
  isAr: boolean;
  weights: SubScoreWeight[];
  totalWeight: number;
  rules: RiskRule[];
  onWeightChange: (key: SubScoreKey, value: number) => void;
  onWeightReset: () => void;
  onRuleToggle: (id: string) => void;
}) => {
  const balanced = totalWeight === 100;

  return (
    <div className="space-y-4">
      {/* Weights */}
      <div className="rounded-xl border p-5"
        style={{ background: "rgba(10,22,40,0.65)", borderColor: "rgba(34,211,238,0.12)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-sm font-bold">{isAr ? "أوزان الدرجات الفرعية" : "Sub-score weights"}</h3>
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
              {isAr ? "اضبط الأوزان. يجب أن يساوي المجموع 100%" : "Tune weights — total must equal 100%"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-widest font-['JetBrains_Mono']"
              style={{ color: balanced ? "#4ADE80" : "#FB923C" }}>
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
                <span className="text-white text-sm font-semibold">{w.labelEn}</span>
              </div>
              <div className="col-span-9 md:col-span-7">
                <input
                  type="range" min={0} max={50} step={1}
                  value={w.weight}
                  onChange={(e) => onWeightChange(w.key, parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
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

      {/* Rules */}
      <div className="rounded-xl border p-5"
        style={{ background: "rgba(10,22,40,0.65)", borderColor: "rgba(34,211,238,0.12)" }}>
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
                  border: `1px solid ${r.enabled ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.04)"}`,
                  opacity: r.enabled ? 1 : 0.55,
                }}>
                <div className="w-9 h-5 rounded-full relative flex-shrink-0 mt-0.5 transition-colors"
                  style={{ background: r.enabled ? "#22D3EE" : "rgba(255,255,255,0.08)" }}>
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

export default OsintRiskEnginePage;
