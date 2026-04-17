import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThreatLevelGauge from "./components/ThreatLevelGauge";
import ActiveInvestigations from "./components/ActiveInvestigations";
import WatchlistHitRate from "./components/WatchlistHitRate";
import CrossStreamCorrelation from "./components/CrossStreamCorrelation";
import {
  currentThreatLevel,
  threatLevelConfig,
  activeInvestigations,
  watchlistHits,
  correlationAlerts,
  streamThreatScores,
} from "@/mocks/nationalSecurityData";

type Tab = "overview" | "investigations" | "watchlist" | "correlations";

const NationalSecurityDashboard = () => {
  const navigate = useNavigate();
  const [isAr, setIsAr] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveEvents, setLiveEvents] = useState(48291);
  const [threatScore, setThreatScore] = useState(78);

  const cfg = threatLevelConfig[currentThreatLevel];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setLiveEvents((v) => v + Math.floor(Math.random() * 3));
      setThreatScore((v) => Math.max(70, Math.min(85, v + (Math.random() > 0.5 ? 1 : -1))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); // live clock
  const dateStr = currentTime.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  const openInvestigations = activeInvestigations.filter((i) => i.status !== "closed").length;
  const confirmedHits = watchlistHits.filter((h) => h.status === "confirmed").length;
  const newCorrelations = correlationAlerts.filter((c) => c.status === "new").length;
  const criticalAlerts = correlationAlerts.filter((c) => c.severity === "critical").length;

  const TABS: { id: Tab; icon: string; label: string; labelAr: string; badge?: number; badgeColor?: string }[] = [
    { id: "overview",       icon: "ri-shield-star-line",   label: "Threat Overview",       labelAr: "نظرة عامة على التهديد" },
    { id: "investigations", icon: "ri-search-eye-line",    label: "Investigations",         labelAr: "التحقيقات",            badge: openInvestigations, badgeColor: "#22D3EE" },
    { id: "watchlist",      icon: "ri-eye-line",           label: "Watchlist Hits",         labelAr: "إصابات قائمة المراقبة", badge: confirmedHits,      badgeColor: "#F87171" },
    { id: "correlations",   icon: "ri-git-merge-line",     label: "Cross-Stream Alerts",    labelAr: "تنبيهات متقاطعة",      badge: newCorrelations,    badgeColor: "#A78BFA" },
  ];

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#060D1A" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(34,211,238,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.02) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Threat level ambient glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top, ${cfg.color}06, transparent 60%)` }} />

      {/* CLASSIFICATION BANNER */}
      <div className="w-full py-1.5 px-6 flex items-center justify-between"
        style={{ background: "#7F1D1D", borderBottom: "1px solid rgba(248,113,113,0.4)" }}>
        <div className="flex items-center gap-3">
          <i className="ri-shield-keyhole-line text-red-300 text-sm" />
          <span className="text-white text-xs font-bold tracking-widest uppercase font-['JetBrains_Mono']">
            {isAr ? "سري للغاية — للأفراد المخوّلين فقط" : "TOP SECRET — Authorized Personnel Only"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-300 text-xs font-['JetBrains_Mono'] opacity-70">CLASSIFICATION: TOP SECRET</span>
          <span className="text-red-300 text-xs font-['JetBrains_Mono'] opacity-70">|</span>
          <span className="text-red-300 text-xs font-['JetBrains_Mono'] opacity-70">AMEEN-NSD-2026</span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b"
        style={{ background: "rgba(6,13,26,0.97)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
            <i className="ri-arrow-left-line" />
            {isAr ? "لوحة التحكم" : "Dashboard"}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ background: `${cfg.color}15`, border: `2px solid ${cfg.color}40` }}>
              <i className="ri-shield-star-line text-sm" style={{ color: cfg.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-black text-base tracking-wide">AMEEN</span>
                <span className="text-white font-bold text-sm">{isAr ? "لوحة الأمن الوطني" : "National Security Dashboard"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold animate-pulse"
                  style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                  {isAr ? cfg.labelAr : cfg.label}
                </span>
              </div>
              <p className="text-gray-500 text-xs font-['JetBrains_Mono']">لوحة الأمن الوطني · Police Internal · All 16 Streams</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Threat score live */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border"
            style={{ background: cfg.bg, borderColor: cfg.border }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cfg.color }} />
            <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: cfg.color }}>
              {isAr ? "مؤشر التهديد:" : "Threat Index:"} {threatScore}
            </span>
          </div>

          {/* Clock */}
          <div className="hidden lg:flex flex-col items-end px-3 py-1.5 rounded-lg border"
            style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.12)" }}>
            <span className="text-cyan-400 text-sm font-black font-['JetBrains_Mono']">{timeStr}</span>
            <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{dateStr}</span>
          </div>

          {/* Critical alerts */}
          {criticalAlerts > 0 && (
            <button type="button" onClick={() => setActiveTab("correlations")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer animate-pulse"
              style={{ background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.3)" }}>
              <i className="ri-alarm-warning-line text-red-400 text-xs" />
              <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">{criticalAlerts} CRITICAL</span>
            </button>
          )}

          {/* Role */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
            style={{ background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.2)" }}>
            <i className="ri-shield-star-line text-red-400 text-xs" />
            <span className="text-red-400 text-xs font-bold">{isAr ? "مسؤول أمن" : "SEC ADMIN"}</span>
          </div>

          {/* Language */}
          <button type="button" onClick={() => setIsAr((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer whitespace-nowrap"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
            <i className="ri-translate-2 text-xs" />{isAr ? "EN" : "عربي"}
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="sticky top-[89px] z-30 flex items-center gap-1 px-6 py-2 border-b overflow-x-auto"
        style={{ background: "rgba(6,13,26,0.95)", borderColor: "rgba(34,211,238,0.08)", backdropFilter: "blur(12px)" }}>
        {TABS.map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex-shrink-0"
            style={{
              background: activeTab === tab.id ? "rgba(34,211,238,0.12)" : "transparent",
              border: `1px solid ${activeTab === tab.id ? "rgba(34,211,238,0.25)" : "transparent"}`,
              color: activeTab === tab.id ? "#22D3EE" : "#6B7280",
            }}>
            <i className={`${tab.icon} text-xs`} />
            {isAr ? tab.labelAr : tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                style={{ background: `${tab.badgeColor}20`, color: tab.badgeColor, fontSize: "9px" }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-6 space-y-6">

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1 — THREAT OVERVIEW
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <>
            {/* Top KPI strip */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: isAr ? "مستوى التهديد" : "Threat Level",       value: isAr ? cfg.labelAr : currentThreatLevel, color: cfg.color,   icon: "ri-shield-star-line",    mono: false },
                { label: isAr ? "مؤشر التهديد" : "Threat Index",        value: `${threatScore}/100`,                    color: cfg.color,   icon: "ri-pulse-line",          mono: true  },
                { label: isAr ? "تحقيقات نشطة" : "Active Investigations",value: openInvestigations,                     color: "#22D3EE",   icon: "ri-search-eye-line",     mono: false },
                { label: isAr ? "إصابات مؤكدة" : "Confirmed Hits",      value: confirmedHits,                           color: "#F87171",   icon: "ri-eye-line",            mono: false },
                { label: isAr ? "ارتباطات جديدة" : "New Correlations",  value: newCorrelations,                         color: "#A78BFA",   icon: "ri-git-merge-line",      mono: false },
                { label: isAr ? "أحداث اليوم" : "Events Today",         value: liveEvents.toLocaleString(),             color: "#4ADE80",   icon: "ri-database-line",       mono: true  },
              ].map((s, i) => (
                <div key={i} className="relative rounded-2xl border p-4 overflow-hidden"
                  style={{ background: "rgba(10,22,40,0.8)", borderColor: `${s.color}25`, backdropFilter: "blur(12px)" }}>
                  <div className="absolute inset-0 opacity-5"
                    style={{ background: `radial-gradient(circle at top right, ${s.color}, transparent 70%)` }} />
                  <div className="relative z-10">
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg mb-2"
                      style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                      <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
                    </div>
                    <div className={`font-black mb-0.5 ${s.mono ? "font-['JetBrains_Mono'] text-xl" : "text-xl"}`} style={{ color: s.color }}>
                      {s.value}
                    </div>
                    <div className="text-gray-500 text-xs leading-tight">{s.label}</div>
                    <div className="mt-2 flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: s.color }} />
                      <span className="font-['JetBrains_Mono']" style={{ color: s.color, fontSize: "9px" }}>LIVE</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main 2-col layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Threat gauge (1/3) */}
              <div className="lg:col-span-1">
                <ThreatLevelGauge isAr={isAr} />
              </div>

              {/* Right: Correlations + Watchlist preview (2/3) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cross-stream correlation preview */}
                <div className="rounded-2xl border overflow-hidden"
                  style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(167,139,250,0.15)", backdropFilter: "blur(12px)" }}>
                  <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "rgba(167,139,250,0.08)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 flex items-center justify-center rounded-lg"
                        style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
                        <i className="ri-git-merge-line text-purple-400 text-xs" />
                      </div>
                      <span className="text-white font-bold text-sm">{isAr ? "أحدث الارتباطات المتقاطعة" : "Latest Cross-Stream Correlations"}</span>
                    </div>
                    <button type="button" onClick={() => setActiveTab("correlations")}
                      className="text-xs font-semibold cursor-pointer whitespace-nowrap"
                      style={{ color: "#A78BFA" }}>
                      {isAr ? "عرض الكل" : "View All"} →
                    </button>
                  </div>
                  <div className="divide-y" style={{ borderColor: "rgba(34,211,238,0.04)" }}>
                    {correlationAlerts.slice(0, 3).map((alert) => {
                      const sevColor = alert.severity === "critical" ? "#F87171" : alert.severity === "high" ? "#FB923C" : "#FACC15";
                      return (
                        <div key={alert.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
                          onClick={() => setActiveTab("correlations")}>
                          <div className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ background: sevColor }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-semibold truncate">{isAr ? alert.titleAr : alert.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {alert.streams.slice(0, 3).map((s, i) => (
                                <div key={i} className="flex items-center gap-1">
                                  <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
                                  <span className="text-xs" style={{ color: s.color }}>{s.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: sevColor }}>{alert.score}</span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                              style={{ background: `${sevColor}12`, color: sevColor, fontSize: "9px" }}>
                              {alert.status === "new" ? (isAr ? "جديد" : "NEW") : alert.status === "reviewing" ? (isAr ? "مراجعة" : "REVIEW") : (isAr ? "تم" : "DONE")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Watchlist hit summary */}
                <div className="rounded-2xl border overflow-hidden"
                  style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(248,113,113,0.15)", backdropFilter: "blur(12px)" }}>
                  <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "rgba(248,113,113,0.08)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 flex items-center justify-center rounded-lg"
                        style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
                        <i className="ri-eye-line text-red-400 text-xs" />
                      </div>
                      <span className="text-white font-bold text-sm">{isAr ? "أحدث إصابات قائمة المراقبة" : "Latest Watchlist Hits"}</span>
                    </div>
                    <button type="button" onClick={() => setActiveTab("watchlist")}
                      className="text-xs font-semibold cursor-pointer whitespace-nowrap"
                      style={{ color: "#F87171" }}>
                      {isAr ? "عرض الكل" : "View All"} →
                    </button>
                  </div>
                  <div className="divide-y" style={{ borderColor: "rgba(34,211,238,0.04)" }}>
                    {watchlistHits.filter((h) => h.status === "confirmed").slice(0, 4).map((hit) => (
                      <div key={hit.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
                        onClick={() => setActiveTab("watchlist")}>
                        <div className="w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0"
                          style={{ background: `${hit.listColor}12`, border: `1px solid ${hit.listColor}20` }}>
                          <i className={`${hit.streamIcon} text-xs`} style={{ color: hit.listColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-white text-xs font-bold font-['JetBrains_Mono']">{hit.personRef}</span>
                            <span className="text-gray-500 text-xs">{hit.nationality}</span>
                            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                              style={{ background: `${hit.listColor}12`, color: hit.listColor, fontSize: "9px" }}>
                              {hit.listType}
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs truncate">{hit.location} · {hit.time}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">{hit.matchConfidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stream threat matrix */}
                <div className="rounded-2xl border overflow-hidden"
                  style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
                  <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg"
                      style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
                      <i className="ri-grid-line text-cyan-400 text-xs" />
                    </div>
                    <span className="text-white font-bold text-sm">{isAr ? "مصفوفة التهديد — 16 مصدر" : "Threat Matrix — 16 Streams"}</span>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {streamThreatScores.map((s) => {
                        const scoreColor = s.score >= 70 ? "#F87171" : s.score >= 50 ? "#FB923C" : s.score >= 30 ? "#FACC15" : "#4ADE80";
                        return (
                          <div key={s.stream} className="p-3 rounded-xl cursor-pointer hover:bg-white/[0.03] transition-colors"
                            style={{ background: "rgba(6,13,26,0.6)", border: `1px solid ${scoreColor}15` }}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="w-6 h-6 flex items-center justify-center rounded-md"
                                style={{ background: `${s.color}12`, border: `1px solid ${s.color}20` }}>
                                <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: scoreColor }}>{s.score}</span>
                                <i className={`text-xs ${s.trend === "up" ? "ri-arrow-up-line text-red-400" : s.trend === "down" ? "ri-arrow-down-line text-green-400" : "ri-subtract-line text-gray-600"}`} />
                              </div>
                            </div>
                            <p className="text-gray-400 text-xs leading-tight truncate">{s.stream}</p>
                            <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                              <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: scoreColor }} />
                            </div>
                            {s.alerts > 0 && (
                              <div className="mt-1.5 flex items-center gap-1">
                                <div className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
                                <span className="text-red-400 font-['JetBrains_Mono']" style={{ fontSize: "9px" }}>{s.alerts} {isAr ? "تنبيه" : "alert(s)"}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2 — INVESTIGATIONS
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "investigations" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "التحقيقات النشطة" : "Active Investigations"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "جميع القضايا المفتوحة عبر 16 مصدراً" : "All open cases across 16 data streams"}</p>
            </div>
            <ActiveInvestigations isAr={isAr} />
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 3 — WATCHLIST HITS
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "watchlist" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "إصابات قائمة المراقبة" : "Watchlist Hit Rate"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "مطابقات قائمة المراقبة الوطنية عبر جميع المصادر" : "National watchlist matches across all data streams"}</p>
            </div>
            <WatchlistHitRate isAr={isAr} />
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 4 — CROSS-STREAM CORRELATIONS
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "correlations" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "تنبيهات الارتباط المتقاطع" : "Cross-Stream Correlation Alerts"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "أنماط مكتشفة تربط أحداثاً من مصادر متعددة" : "Detected patterns linking events across multiple data streams"}</p>
            </div>
            <CrossStreamCorrelation isAr={isAr} />
          </>
        )}

      </main>
    </div>
  );
};

export default NationalSecurityDashboard;
