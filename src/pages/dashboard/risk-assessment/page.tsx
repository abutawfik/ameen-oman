import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import { FLAGGED_PERSONS, STREAM_WEIGHTS, MULTIPLIER_RULES } from "@/mocks/riskAssessmentData";
import type { FlaggedPerson, StreamWeight, MultiplierRule } from "@/mocks/riskAssessmentData";
import FlaggedEventDetail from "./components/FlaggedEventDetail";
import ScoreConfig from "./components/ScoreConfig";
import PersonRiskDashboard from "./components/PersonRiskDashboard";
import RiskScoreGauge from "./components/RiskScoreGauge";

type Tab = "phase1" | "phase2" | "config";

const getScoreColor = (score: number) => {
  if (score <= 25) return "#4ADE80";
  if (score <= 50) return "#FACC15";
  if (score <= 75) return "#FB923C";
  return "#F87171";
};

const FLAG_CATEGORY_ICONS: Record<string, string> = {
  watchlist: "ri-eye-line",
  overstay:  "ri-time-line",
  document:  "ri-file-warning-line",
  pattern:   "ri-git-branch-line",
  manual:    "ri-flag-line",
};

const RiskAssessmentPage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeTab, setActiveTab] = useState<Tab>("phase1");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [persons, setPersons] = useState<FlaggedPerson[]>(FLAGGED_PERSONS);
  const [selectedPerson, setSelectedPerson] = useState<FlaggedPerson | null>(null);
  const [weights, setWeights] = useState<StreamWeight[]>(STREAM_WEIGHTS);
  const [multipliers, setMultipliers] = useState<MultiplierRule[]>(MULTIPLIER_RULES);
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [filterRisk, setFilterRisk] = useState<"all" | "critical" | "high" | "medium" | "low">("all");

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = currentTime.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  const handleWeightChange = (key: string, value: number) => {
    setWeights((prev) => prev.map((w) => w.key === key ? { ...w, weight: value } : w));
  };
  const handleMultiplierToggle = (id: string) => {
    setMultipliers((prev) => prev.map((m) => m.id === id ? { ...m, active: !m.active } : m));
  };
  const handleReset = () => {
    setWeights(STREAM_WEIGHTS.map((w) => ({ ...w, weight: w.defaultWeight })));
  };

  const handleConfirm = (id: string) => {
    setConfirmedIds((prev) => new Set([...prev, id]));
    setSelectedPerson(null);
  };
  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
    setSelectedPerson(null);
  };
  const handleEscalate = (id: string) => {
    setSelectedPerson(null);
  };

  const getRiskLevel = (score: number): "critical" | "high" | "medium" | "low" => {
    if (score > 75) return "critical";
    if (score > 50) return "high";
    if (score > 25) return "medium";
    return "low";
  };

  const filteredPersons = persons.filter((p) => {
    if (filterRisk !== "all" && getRiskLevel(p.riskScore) !== filterRisk) return false;
    return true;
  });

  const pendingPersons = filteredPersons.filter((p) => !confirmedIds.has(p.id) && !dismissedIds.has(p.id));
  const confirmedPersons = filteredPersons.filter((p) => confirmedIds.has(p.id));
  const dismissedPersons = filteredPersons.filter((p) => dismissedIds.has(p.id));

  const TABS = [
    { id: "phase1" as Tab, icon: "ri-toggle-line",       label: "Phase 1 — Binary Flag",    labelAr: "المرحلة 1 — تنبيه ثنائي",   badge: pendingPersons.length, badgeColor: "#F87171" },
    { id: "phase2" as Tab, icon: "ri-bar-chart-2-line",  label: "Phase 2 — Weighted Score",  labelAr: "المرحلة 2 — درجة موزونة",   badge: 0, badgeColor: "" },
    { id: "config" as Tab, icon: "ri-equalizer-line",    label: "Score Configuration",       labelAr: "إعداد الدرجات",              badge: 0, badgeColor: "" },
  ];

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#0B1220" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(181,142,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.025) 1px, transparent 1px)`,
        backgroundSize: "40px 40px"
      }} />

      {/* Classification banner */}
      <div className="w-full py-1.5 px-6 flex items-center justify-between" style={{ background: "#7F1D1D", borderBottom: "1px solid rgba(248,113,113,0.4)" }}>
        <div className="flex items-center gap-3">
          <i className="ri-shield-keyhole-line text-red-300 text-sm" />
          <span className="text-white text-xs font-bold tracking-widest uppercase font-['JetBrains_Mono']">
            {isAr ? "سري — للأفراد المخوّلين فقط" : "RESTRICTED — Authorized Personnel Only"}
          </span>
        </div>
        <span className="text-red-300 text-xs font-['JetBrains_Mono'] opacity-70">AMEEN-RA-2026</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b"
        style={{ background: "rgba(11,18,32,0.97)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />
            {isAr ? "لوحة التحكم" : "Dashboard"}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ background: "rgba(248,113,113,0.1)", border: "2px solid rgba(248,113,113,0.3)" }}>
              <i className="ri-shield-cross-line text-red-400 text-base" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gold-400 font-black text-base tracking-wide">AMEEN</span>
                <span className="text-white font-bold text-sm">{isAr ? "تقييم المخاطر" : "Risk Assessment"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(248,113,113,0.15)", color: "#F87171", border: "1px solid rgba(248,113,113,0.3)" }}>
                  {isAr ? "سري" : "SECRET"}
                </span>
              </div>
              <p className="text-gray-500 text-xs font-['JetBrains_Mono']">تقييم المخاطر · Police Internal · Phase 1 + Phase 2</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col items-end px-3 py-1.5 rounded-lg border"
            style={{ background: "rgba(181,142,60,0.04)", borderColor: "rgba(181,142,60,0.12)" }}>
            <span className="text-gold-400 text-sm font-black font-['JetBrains_Mono']">{timeStr}</span>
            <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{dateStr}</span>
          </div>
          {pendingPersons.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border animate-pulse"
              style={{ background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.3)" }}>
              <i className="ri-alarm-warning-line text-red-400 text-xs" />
              <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">{pendingPersons.length} {isAr ? "معلق" : "PENDING"}</span>
            </div>
          )}
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
                style={{ background: `${tab.badgeColor}20`, color: tab.badgeColor, fontSize: "9px" }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-6 space-y-6">

        {/* ══════════════════════════════════════════════════════════════════════
            PHASE 1 — BINARY FLAG
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "phase1" && (
          <>
            {/* Header + filters */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "المرحلة 1 — التنبيه الثنائي" : "Phase 1 — Binary Flag"}</h1>
                <p className="text-gray-400 text-sm font-['JetBrains_Mono']">
                  {isAr ? "الحدث → قاعدة أمين → RES-A+RES-B → تقييم مستقل → صح/خطأ → قاعدة الشرطة" : "Event → AMEEN DB → Replicate RES-A+RES-B → Independent Assessment → True/False → Police DB"}
                </p>
              </div>
              {/* Risk filter */}
              <div className="flex items-center gap-1">
                {([
                  { id: "all",      label: isAr ? "الكل" : "All",       color: "#D4A84B" },
                  { id: "critical", label: isAr ? "حرج" : "Critical",   color: "#F87171" },
                  { id: "high",     label: isAr ? "عالٍ" : "High",      color: "#FB923C" },
                  { id: "medium",   label: isAr ? "متوسط" : "Medium",   color: "#FACC15" },
                  { id: "low",      label: isAr ? "منخفض" : "Low",      color: "#4ADE80" },
                ] as const).map((f) => (
                  <button key={f.id} type="button" onClick={() => setFilterRisk(f.id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
                    style={{
                      background: filterRisk === f.id ? `${f.color}15` : "transparent",
                      border: `1px solid ${filterRisk === f.id ? f.color : "transparent"}`,
                      color: filterRisk === f.id ? f.color : "#6B7280",
                    }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: isAr ? "معلق" : "Pending Review",  value: pendingPersons.length,   color: "#F87171", icon: "ri-time-line" },
                { label: isAr ? "مؤكد" : "Confirmed",       value: confirmedPersons.length, color: "#D4A84B", icon: "ri-checkbox-circle-line" },
                { label: isAr ? "مرفوض" : "Dismissed",      value: dismissedPersons.length, color: "#4ADE80", icon: "ri-close-circle-line" },
                { label: isAr ? "إجمالي" : "Total Assessed", value: persons.length,          color: "#A78BFA", icon: "ri-shield-line" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border p-4 flex items-center gap-3"
                  style={{ background: "rgba(20,29,46,0.8)", borderColor: `${s.color}20`, backdropFilter: "blur(12px)" }}>
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ background: `${s.color}12`, border: `1px solid ${s.color}20` }}>
                    <i className={`${s.icon} text-sm`} style={{ color: s.color }} />
                  </div>
                  <div>
                    <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-gray-500 text-xs">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Flagged persons list */}
            <div className="space-y-3">
              {pendingPersons.length === 0 && (
                <div className="rounded-2xl border p-10 flex flex-col items-center gap-3"
                  style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.08)" }}>
                  <i className="ri-shield-check-line text-green-400 text-3xl" />
                  <p className="text-white font-bold">{isAr ? "لا توجد تنبيهات معلقة" : "No pending flags"}</p>
                  <p className="text-gray-500 text-sm">{isAr ? "جميع الأحداث تمت مراجعتها" : "All events have been reviewed"}</p>
                </div>
              )}
              {pendingPersons.map((person) => {
                const scoreColor = getScoreColor(person.riskScore);
                return (
                  <div key={person.id}
                    onClick={() => setSelectedPerson(person)}
                    className="rounded-2xl border cursor-pointer transition-all overflow-hidden group"
                    style={{ background: "rgba(20,29,46,0.8)", borderColor: `${scoreColor}20`, backdropFilter: "blur(12px)", borderLeft: `4px solid ${scoreColor}` }}>
                    <div className="flex items-center gap-4 px-5 py-4 flex-wrap">
                      {/* Photo */}
                      <div className="relative flex-shrink-0">
                        <img src={person.photo} alt={person.name}
                          className="w-12 h-12 rounded-xl object-cover object-top"
                          style={{ border: `2px solid ${scoreColor}30` }} />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full"
                          style={{ background: scoreColor, border: "2px solid #0B1220" }}>
                          <i className="ri-shield-cross-line text-white" style={{ fontSize: "7px" }} />
                        </div>
                      </div>

                      {/* Name + doc */}
                      <div className="flex-shrink-0 w-40">
                        <p className="text-white text-sm font-bold truncate">{isAr ? person.nameAr : person.name}</p>
                        <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{person.docNumber}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-gray-400 text-xs">{person.natCode}</span>
                          <span className="text-gray-600 text-xs">·</span>
                          <span className="text-gray-400 text-xs">{person.age}y · {isAr ? (person.gender === "Male" ? "ذكر" : "أنثى") : person.gender}</span>
                        </div>
                      </div>

                      {/* Flag categories */}
                      <div className="flex items-center gap-2 flex-wrap flex-1">
                        {person.flagCategories.map((fc, i) => (
                          <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                            style={{ background: `${fc.color}10`, border: `1px solid ${fc.color}25` }}>
                            <i className={`${FLAG_CATEGORY_ICONS[fc.type]} text-xs`} style={{ color: fc.color }} />
                            <span className="text-xs font-semibold whitespace-nowrap" style={{ color: fc.color }}>{isAr ? fc.labelAr : fc.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <i className="ri-map-pin-line text-gray-500 text-xs" />
                        <span className="text-gray-400 text-xs">{isAr ? person.currentLocationAr : person.currentLocation}</span>
                      </div>

                      {/* Score gauge mini */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="relative w-10 h-10">
                          <svg width="40" height="40" style={{ transform: "rotate(135deg)" }}>
                            <circle cx="20" cy="20" r="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"
                              strokeDasharray={`${2 * Math.PI * 14 * 0.75} ${2 * Math.PI * 14 * 0.25}`} strokeLinecap="round" />
                            <circle cx="20" cy="20" r="14" fill="none" stroke={scoreColor} strokeWidth="4"
                              strokeDasharray={`${(person.riskScore / 100) * 2 * Math.PI * 14 * 0.75} ${2 * Math.PI * 14}`}
                              strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${scoreColor}80)` }} />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-black font-['JetBrains_Mono'] tabular-nums" style={{ color: scoreColor, fontSize: "9px" }}>{person.riskScore}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold" style={{ color: scoreColor }}>{getRiskLevel(person.riskScore).toUpperCase()}</p>
                          <p className="text-gray-600 text-xs">{isAr ? "درجة المخاطر" : "Risk Score"}</p>
                        </div>
                      </div>

                      {/* Arrow */}
                      <i className="ri-arrow-right-s-line text-gray-600 text-lg flex-shrink-0 group-hover:text-gold-400 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Confirmed / Dismissed sections */}
            {confirmedPersons.length > 0 && (
              <div>
                <h3 className="text-green-400 text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider mb-3">
                  {isAr ? "مؤكد — تم الإرسال إلى قاعدة الشرطة" : "CONFIRMED — Sent to Police DB"}
                </h3>
                <div className="space-y-2">
                  {confirmedPersons.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                      style={{ background: "rgba(74,222,128,0.04)", borderColor: "rgba(74,222,128,0.15)" }}>
                      <i className="ri-checkbox-circle-line text-green-400 text-sm" />
                      <img src={p.photo} alt={p.name} className="w-7 h-7 rounded-lg object-cover object-top" />
                      <span className="text-white text-xs font-semibold">{isAr ? p.nameAr : p.name}</span>
                      <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{p.docNumber}</span>
                      <span className="ml-auto text-green-400 text-xs font-bold">{isAr ? "مؤكد → قاعدة الشرطة" : "CONFIRMED → Police DB"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PHASE 2 — WEIGHTED SCORE
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "phase2" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "المرحلة 2 — الدرجة الموزونة" : "Phase 2 — Weighted Risk Score"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "درجة 0-100 مع مستويات: 0-25 أخضر، 26-50 أصفر، 51-75 برتقالي، 76-100 أحمر" : "Score 0-100 · 0-25 green, 26-50 yellow, 51-75 orange, 76-100 red"}</p>
            </div>

            {/* Score level legend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { range: "0 – 25",  label: isAr ? "منخفض" : "Low",      color: "#4ADE80", icon: "ri-shield-check-line",  count: persons.filter((p) => p.riskScore <= 25).length },
                { range: "26 – 50", label: isAr ? "متوسط" : "Medium",   color: "#FACC15", icon: "ri-shield-line",        count: persons.filter((p) => p.riskScore > 25 && p.riskScore <= 50).length },
                { range: "51 – 75", label: isAr ? "عالٍ" : "High",      color: "#FB923C", icon: "ri-shield-flash-line",  count: persons.filter((p) => p.riskScore > 50 && p.riskScore <= 75).length },
                { range: "76 – 100",label: isAr ? "حرج" : "Critical",   color: "#F87171", icon: "ri-shield-cross-line",  count: persons.filter((p) => p.riskScore > 75).length },
              ].map((level) => (
                <div key={level.range} className="rounded-xl border p-4"
                  style={{ background: `${level.color}06`, borderColor: `${level.color}20` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <i className={`${level.icon} text-sm`} style={{ color: level.color }} />
                    <span className="text-xs font-bold" style={{ color: level.color }}>{level.label}</span>
                  </div>
                  <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: level.color }}>{level.count}</div>
                  <div className="text-gray-600 text-xs font-['JetBrains_Mono']">{level.range}</div>
                </div>
              ))}
            </div>

            <PersonRiskDashboard persons={persons} isAr={isAr} />
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            SCORE CONFIGURATION
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "config" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "إعداد درجات المخاطر" : "Risk Score Configuration"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "ضبط أوزان التدفقات وقواعد المضاعف" : "Adjust stream weights and multiplier rules"}</p>
            </div>
            <ScoreConfig
              weights={weights}
              multipliers={multipliers}
              isAr={isAr}
              onWeightChange={handleWeightChange}
              onMultiplierToggle={handleMultiplierToggle}
              onReset={handleReset}
            />
          </>
        )}

      </main>

      {/* Flagged Event Detail Overlay */}
      {selectedPerson && (
        <FlaggedEventDetail
          person={selectedPerson}
          isAr={isAr}
          onClose={() => setSelectedPerson(null)}
          onConfirm={handleConfirm}
          onDismiss={handleDismiss}
          onEscalate={handleEscalate}
        />
      )}
    </div>
  );
};

export default RiskAssessmentPage;
