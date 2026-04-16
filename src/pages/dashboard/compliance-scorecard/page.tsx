import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/pages/dashboard/components/DashboardSidebar";
import DashboardTitleBar from "@/pages/dashboard/components/DashboardTitleBar";
import type { EntityType } from "@/mocks/dashboardData";

type MainTab = "overview" | "streams" | "violations" | "trends";

const STREAMS = [
  { id: "hotel",       num: "01", name: "Hotel Intelligence",       nameAr: "الاستخبارات الفندقية",       icon: "ri-hotel-line",           color: "#22D3EE", score: 96, violations: 2,  entities: 47,  eventsToday: 1284, trend: [88,90,92,93,94,95,96], status: "compliant" },
  { id: "car-rental",  num: "02", name: "Car Rental Monitoring",    nameAr: "مراقبة تأجير السيارات",      icon: "ri-car-line",             color: "#22D3EE", score: 94, violations: 3,  entities: 23,  eventsToday: 2103, trend: [89,90,91,92,93,93,94], status: "compliant" },
  { id: "mobile",      num: "03", name: "Mobile Operators",         nameAr: "مشغلو الاتصالات",            icon: "ri-sim-card-line",        color: "#A78BFA", score: 91, violations: 5,  entities: 4,   eventsToday: 8412, trend: [85,86,88,89,90,91,91], status: "compliant" },
  { id: "municipality",num: "04", name: "Municipality Registry",    nameAr: "سجل البلديات",               icon: "ri-government-line",      color: "#FACC15", score: 88, violations: 8,  entities: 11,  eventsToday: 891,  trend: [82,83,84,85,86,87,88], status: "compliant" },
  { id: "financial",   num: "05", name: "Payment Intelligence",     nameAr: "الاستخبارات المالية",        icon: "ri-bank-card-line",       color: "#4ADE80", score: 97, violations: 1,  entities: 18,  eventsToday: 24891,trend: [93,94,95,96,96,97,97], status: "compliant" },
  { id: "borders",     num: "06", name: "Borders & Immigration",    nameAr: "الحدود والهجرة",             icon: "ri-passport-line",        color: "#60A5FA", score: 99, violations: 0,  entities: 6,   eventsToday: 16303,trend: [97,97,98,98,99,99,99], status: "compliant" },
  { id: "health",      num: "07", name: "Health Interactions",      nameAr: "التفاعلات الصحية",           icon: "ri-heart-pulse-line",     color: "#F87171", score: 89, violations: 6,  entities: 34,  eventsToday: 1847, trend: [84,85,86,87,88,88,89], status: "compliant" },
  { id: "utility",     num: "08", name: "Utility Activation",       nameAr: "تفعيل المرافق",              icon: "ri-flashlight-line",      color: "#FACC15", score: 82, violations: 14, entities: 8,   eventsToday: 412,  trend: [78,79,80,80,81,82,82], status: "warning" },
  { id: "transport",   num: "09", name: "Public Transport",         nameAr: "النقل العام",                icon: "ri-bus-line",             color: "#FB923C", score: 93, violations: 4,  entities: 5,   eventsToday: 42891,trend: [88,89,90,91,92,92,93], status: "compliant" },
  { id: "education",   num: "10", name: "Educational Enrollment",   nameAr: "التسجيل التعليمي",           icon: "ri-graduation-cap-line",  color: "#A78BFA", score: 87, violations: 9,  entities: 29,  eventsToday: 2341, trend: [81,82,83,84,85,86,87], status: "warning" },
  { id: "employment",  num: "11", name: "Employment Registry",      nameAr: "سجل التوظيف",               icon: "ri-briefcase-line",       color: "#F9A8D4", score: 91, violations: 5,  entities: 1,   eventsToday: 3891, trend: [86,87,88,89,90,90,91], status: "compliant" },
  { id: "ecommerce",   num: "12", name: "E-Commerce & Retail",      nameAr: "التجارة الإلكترونية",        icon: "ri-shopping-cart-line",   color: "#34D399", score: 78, violations: 19, entities: 312, eventsToday: 18234,trend: [72,73,74,75,76,77,78], status: "warning" },
  { id: "social",      num: "13", name: "Social Media Intelligence",nameAr: "استخبارات وسائل التواصل",   icon: "ri-global-line",          color: "#38BDF8", score: 95, violations: 2,  entities: 1,   eventsToday: 8412, trend: [91,92,93,93,94,95,95], status: "compliant" },
  { id: "customs",     num: "14", name: "Customs & Cargo",          nameAr: "الجمارك والشحن",             icon: "ri-ship-line",            color: "#FCD34D", score: 84, violations: 12, entities: 6,   eventsToday: 6241, trend: [78,79,80,81,82,83,84], status: "warning" },
  { id: "marine",      num: "15", name: "Marine & Maritime",        nameAr: "البحرية والملاحة",           icon: "ri-anchor-line",          color: "#22D3EE", score: 71, violations: 28, entities: 14,  eventsToday: 892,  trend: [60,62,64,66,68,70,71], status: "critical" },
  { id: "postal",      num: "16", name: "Postal Services",          nameAr: "الخدمات البريدية",           icon: "ri-mail-send-line",       color: "#A78BFA", score: 63, violations: 41, entities: 3,   eventsToday: 1203, trend: [55,56,58,59,60,62,63], status: "critical" },
];

const VIOLATIONS = [
  { id: "VIO-2026-0441", stream: "Postal Services", streamIcon: "ri-mail-send-line", streamColor: "#A78BFA", entity: "National Post Authority", type: "Late Submission", severity: "high", date: "2026-04-06", detail: "Event batch submitted 72 hours late — 234 events affected", status: "open" },
  { id: "VIO-2026-0440", stream: "Marine & Maritime", streamIcon: "ri-anchor-line", streamColor: "#22D3EE", entity: "Muscat Marina Authority", type: "Missing Fields", severity: "critical", date: "2026-04-06", detail: "Vessel registration events missing IMO number and flag state — 89 records", status: "open" },
  { id: "VIO-2026-0438", stream: "E-Commerce & Retail", streamIcon: "ri-shopping-cart-line", streamColor: "#34D399", entity: "TechOman Marketplace", type: "Schema Violation", severity: "medium", date: "2026-04-05", detail: "Transaction amount field format mismatch — expected decimal, received string", status: "investigating" },
  { id: "VIO-2026-0435", stream: "Customs & Cargo", streamIcon: "ri-ship-line", streamColor: "#FCD34D", entity: "Gulf Trade Brokers Co.", type: "Duplicate Submission", severity: "medium", date: "2026-04-05", detail: "Declaration AMN-CUS-2026-08734 submitted twice — duplicate reference detected", status: "resolved" },
  { id: "VIO-2026-0431", stream: "Utility Activation", streamIcon: "ri-flashlight-line", streamColor: "#FACC15", entity: "Salalah Electricity Co.", type: "Authentication Failure", severity: "high", date: "2026-04-04", detail: "API key expired — 14 hours of events not received. Backup portal submission pending", status: "investigating" },
  { id: "VIO-2026-0428", stream: "Marine & Maritime", streamIcon: "ri-anchor-line", streamColor: "#22D3EE", entity: "Khasab Port Authority", type: "Late Submission", severity: "high", date: "2026-04-04", detail: "Docking events delayed 48 hours — 156 vessel movements not reported in time", status: "open" },
  { id: "VIO-2026-0425", stream: "Education", streamIcon: "ri-graduation-cap-line", streamColor: "#A78BFA", entity: "Gulf College", type: "Missing Fields", severity: "medium", date: "2026-04-03", detail: "Student enrollment records missing passport number — 67 records incomplete", status: "resolved" },
  { id: "VIO-2026-0419", stream: "Postal Services", streamIcon: "ri-mail-send-line", streamColor: "#A78BFA", entity: "National Post Authority", type: "Volume Anomaly", severity: "critical", date: "2026-04-03", detail: "Reported parcel volume 40% below expected baseline — possible under-reporting", status: "escalated" },
];

const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  compliant: { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",  label: "Compliant" },
  warning:   { color: "#FACC15", bg: "rgba(250,204,21,0.1)",  label: "Warning" },
  critical:  { color: "#F87171", bg: "rgba(248,113,113,0.1)", label: "Critical" },
};

const severityConfig: Record<string, { color: string; bg: string }> = {
  critical: { color: "#F87171", bg: "rgba(248,113,113,0.12)" },
  high:     { color: "#FB923C", bg: "rgba(251,146,60,0.12)" },
  medium:   { color: "#FACC15", bg: "rgba(250,204,21,0.12)" },
  low:      { color: "#4ADE80", bg: "rgba(74,222,128,0.12)" },
};

const ComplianceScorecardPage = () => {
  const navigate = useNavigate();
  const [isAr, setIsAr] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("compliance");
  const [mainTab, setMainTab] = useState<MainTab>("overview");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStream, setSelectedStream] = useState(STREAMS[0]);
  const [sortBy, setSortBy] = useState<"score" | "violations" | "events">("score");

  const avgScore = Math.round(STREAMS.reduce((a, s) => a + s.score, 0) / STREAMS.length);
  const totalViolations = STREAMS.reduce((a, s) => a + s.violations, 0);
  const compliantCount = STREAMS.filter((s) => s.status === "compliant").length;
  const criticalCount = STREAMS.filter((s) => s.status === "critical").length;

  const filteredStreams = STREAMS
    .filter((s) => statusFilter === "all" || s.status === statusFilter)
    .sort((a, b) => sortBy === "score" ? b.score - a.score : sortBy === "violations" ? b.violations - a.violations : b.eventsToday - a.eventsToday);

  const filteredViolations = VIOLATIONS.filter((v) => statusFilter === "all" || true);

  const tabs: { id: MainTab; label: string; labelAr: string; icon: string }[] = [
    { id: "overview",   label: "Overview",         labelAr: "نظرة عامة",       icon: "ri-dashboard-line" },
    { id: "streams",    label: "Stream Scorecards",labelAr: "بطاقات المصادر",  icon: "ri-bar-chart-grouped-line" },
    { id: "violations", label: "Violation History",labelAr: "سجل المخالفات",   icon: "ri-error-warning-line" },
    { id: "trends",     label: "Trend Analysis",   labelAr: "تحليل الاتجاهات", icon: "ri-line-chart-line" },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#060D1A", direction: isAr ? "rtl" : "ltr" }}>
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.025) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <DashboardSidebar activeNav={activeNav} onNavChange={setActiveNav} entityType={"hotel" as EntityType} isAr={isAr} collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTitleBar isAr={isAr} onToggleLang={() => setIsAr(!isAr)} entityType={"hotel" as EntityType} />

        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.25)" }}>
                <i className="ri-shield-check-line text-cyan-400 text-lg" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold font-['Inter']">{isAr ? "بطاقة الامتثال" : "Compliance Scorecard"}</h1>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono']">
                  {isAr ? "16 مصدر بيانات · درجات الامتثال · سجل المخالفات · اتجاهات الأداء" : "16 Data Streams · Compliance Scores · Violation History · Performance Trends"}
                </p>
              </div>
            </div>
            <button onClick={() => navigate("/dashboard/command-center")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap font-['Inter'] transition-all"
              style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
              <i className="ri-radar-line" />
              {isAr ? "مركز القيادة" : "Command Center"}
            </button>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Overall Score", labelAr: "الدرجة الإجمالية", value: `${avgScore}%`, color: avgScore >= 90 ? "#4ADE80" : avgScore >= 75 ? "#FACC15" : "#F87171", icon: "ri-award-line", sub: "Across 16 streams" },
              { label: "Compliant Streams", labelAr: "مصادر ممتثلة", value: `${compliantCount}/16`, color: "#4ADE80", icon: "ri-checkbox-circle-line", sub: `${16 - compliantCount} need attention` },
              { label: "Total Violations", labelAr: "إجمالي المخالفات", value: totalViolations, color: "#FB923C", icon: "ri-error-warning-line", sub: "This month" },
              { label: "Critical Streams", labelAr: "مصادر حرجة", value: criticalCount, color: "#F87171", icon: "ri-alarm-warning-line", sub: "Require immediate action" },
            ].map((kpi) => (
              <div key={kpi.label} className="p-4 rounded-xl relative overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", border: `1px solid ${kpi.color}20` }}>
                <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at top right, ${kpi.color}, transparent 70%)` }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: `${kpi.color}15` }}>
                      <i className={`${kpi.icon} text-sm`} style={{ color: kpi.color }} />
                    </div>
                  </div>
                  <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: kpi.color }}>{kpi.value}</div>
                  <div className="text-white text-xs font-semibold font-['Inter'] mt-0.5">{isAr ? kpi.labelAr : kpi.label}</div>
                  <div className="text-gray-600 text-xs font-['Inter'] mt-0.5">{kpi.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Bar */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.1)" }}>
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setMainTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-['Inter']"
                style={{
                  background: mainTab === tab.id ? "rgba(34,211,238,0.12)" : "transparent",
                  color: mainTab === tab.id ? "#22D3EE" : "#6B7280",
                  border: mainTab === tab.id ? "1px solid rgba(34,211,238,0.25)" : "1px solid transparent",
                }}>
                <i className={`${tab.icon} text-sm`} />
                {isAr ? tab.labelAr : tab.label}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ── */}
          {mainTab === "overview" && (
            <div className="space-y-5">
              {/* Score gauge row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Compliant", labelAr: "ممتثل", count: compliantCount, color: "#4ADE80", pct: (compliantCount / 16) * 100 },
                  { label: "Warning", labelAr: "تحذير", count: STREAMS.filter((s) => s.status === "warning").length, color: "#FACC15", pct: (STREAMS.filter((s) => s.status === "warning").length / 16) * 100 },
                  { label: "Critical", labelAr: "حرج", count: criticalCount, color: "#F87171", pct: (criticalCount / 16) * 100 },
                  { label: "Open Violations", labelAr: "مخالفات مفتوحة", count: VIOLATIONS.filter((v) => v.status === "open" || v.status === "escalated").length, color: "#FB923C", pct: 0 },
                ].map((s) => (
                  <div key={s.label} className="p-4 rounded-xl" style={{ background: "rgba(10,22,40,0.8)", border: `1px solid ${s.color}20` }}>
                    <div className="text-3xl font-black font-['JetBrains_Mono'] mb-1" style={{ color: s.color }}>{s.count}</div>
                    <div className="text-white text-xs font-semibold font-['Inter']">{isAr ? s.labelAr : s.label}</div>
                    {s.pct > 0 && (
                      <div className="mt-2 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* All streams compact grid */}
              <div className="rounded-xl overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.1)" }}>
                <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
                  <h3 className="text-white text-sm font-bold font-['Inter']">{isAr ? "جميع المصادر — نظرة سريعة" : "All 16 Streams — Quick View"}</h3>
                  <div className="flex gap-1">
                    {["all", "compliant", "warning", "critical"].map((f) => (
                      <button key={f} onClick={() => setStatusFilter(f)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap font-['Inter'] capitalize transition-all"
                        style={{
                          background: statusFilter === f ? "rgba(34,211,238,0.12)" : "transparent",
                          color: statusFilter === f ? "#22D3EE" : "#6B7280",
                          border: `1px solid ${statusFilter === f ? "rgba(34,211,238,0.25)" : "transparent"}`,
                        }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: "rgba(34,211,238,0.05)" }}>
                  {STREAMS.filter((s) => statusFilter === "all" || s.status === statusFilter).map((stream, i) => {
                    const cfg = statusConfig[stream.status];
                    return (
                      <div key={stream.id} className="flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer"
                        style={{ borderBottom: "1px solid rgba(34,211,238,0.04)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(34,211,238,0.03)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        onClick={() => { setSelectedStream(stream); setMainTab("streams"); }}>
                        <span className="text-gray-600 text-xs font-['JetBrains_Mono'] w-6 flex-shrink-0">{stream.num}</span>
                        <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${stream.color}12` }}>
                          <i className={`${stream.icon} text-xs`} style={{ color: stream.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-semibold font-['Inter'] truncate">{isAr ? stream.nameAr : stream.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                              <div className="h-full rounded-full" style={{ width: `${stream.score}%`, background: cfg.color }} />
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold font-['JetBrains_Mono']" style={{ color: cfg.color }}>{stream.score}%</div>
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-['Inter']" style={{ background: cfg.bg, color: cfg.color, fontSize: "9px" }}>
                            {cfg.label}
                          </span>
                        </div>
                        {stream.violations > 0 && (
                          <div className="w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0"
                            style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.3)" }}>
                            <span className="text-orange-400 font-bold font-['JetBrains_Mono']" style={{ fontSize: "9px" }}>{stream.violations}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── STREAM SCORECARDS TAB ── */}
          {mainTab === "streams" && (
            <div className="flex gap-5">
              {/* Left: stream list */}
              <div className="w-64 flex-shrink-0 space-y-1.5">
                <div className="flex gap-1 mb-2">
                  {(["score", "violations", "events"] as const).map((s) => (
                    <button key={s} onClick={() => setSortBy(s)}
                      className="flex-1 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap font-['Inter'] capitalize transition-all"
                      style={{
                        background: sortBy === s ? "rgba(34,211,238,0.12)" : "rgba(10,22,40,0.6)",
                        color: sortBy === s ? "#22D3EE" : "#6B7280",
                        border: `1px solid ${sortBy === s ? "rgba(34,211,238,0.25)" : "rgba(255,255,255,0.05)"}`,
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
                {filteredStreams.map((stream) => {
                  const cfg = statusConfig[stream.status];
                  return (
                    <button key={stream.id} onClick={() => setSelectedStream(stream)}
                      className="w-full p-3 rounded-xl text-left transition-all cursor-pointer"
                      style={{
                        background: selectedStream.id === stream.id ? "rgba(34,211,238,0.08)" : "rgba(10,22,40,0.6)",
                        border: `1px solid ${selectedStream.id === stream.id ? "rgba(34,211,238,0.25)" : "rgba(255,255,255,0.05)"}`,
                      }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0" style={{ background: `${stream.color}12` }}>
                          <i className={`${stream.icon} text-xs`} style={{ color: stream.color }} />
                        </div>
                        <span className="text-white text-xs font-semibold font-['Inter'] truncate flex-1">{isAr ? stream.nameAr : stream.name}</span>
                        <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: cfg.color }}>{stream.score}%</span>
                      </div>
                      <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-full" style={{ width: `${stream.score}%`, background: cfg.color }} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right: stream detail */}
              <div className="flex-1 space-y-4">
                {(() => {
                  const s = selectedStream;
                  const cfg = statusConfig[s.status];
                  const maxTrend = Math.max(...s.trend);
                  return (
                    <>
                      {/* Header card */}
                      <div className="p-5 rounded-xl" style={{ background: "rgba(10,22,40,0.8)", border: `1px solid ${cfg.color}25` }}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex items-center justify-center rounded-xl" style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                              <i className={`${s.icon} text-xl`} style={{ color: s.color }} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-gray-500 text-xs font-['JetBrains_Mono']">Stream {s.num}</span>
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-['Inter']"
                                  style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                                  {cfg.label}
                                </span>
                              </div>
                              <h3 className="text-white text-base font-bold font-['Inter']">{isAr ? s.nameAr : s.name}</h3>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-4xl font-black font-['JetBrains_Mono']" style={{ color: cfg.color }}>{s.score}%</div>
                            <div className="text-gray-500 text-xs font-['Inter']">Compliance Score</div>
                          </div>
                        </div>
                        <div className="h-2 rounded-full mb-4" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${s.score}%`, background: cfg.color }} />
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          {[
                            { label: "Entities", value: s.entities, color: "#22D3EE" },
                            { label: "Events Today", value: s.eventsToday.toLocaleString(), color: s.color },
                            { label: "Violations", value: s.violations, color: s.violations > 10 ? "#F87171" : s.violations > 3 ? "#FACC15" : "#4ADE80" },
                            { label: "7-Day Trend", value: s.trend[6] > s.trend[0] ? "↑ Improving" : "↓ Declining", color: s.trend[6] > s.trend[0] ? "#4ADE80" : "#F87171" },
                          ].map((stat) => (
                            <div key={stat.label} className="p-3 rounded-lg text-center" style={{ background: "rgba(6,13,26,0.6)", border: `1px solid ${stat.color}15` }}>
                              <div className="text-base font-bold font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.value}</div>
                              <div className="text-gray-500 text-xs font-['Inter']">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 7-day trend chart */}
                      <div className="p-5 rounded-xl" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.1)" }}>
                        <h4 className="text-white text-sm font-bold font-['Inter'] mb-4">
                          {isAr ? "اتجاه الامتثال (7 أيام)" : "Compliance Trend (7 Days)"}
                        </h4>
                        <div className="flex items-end gap-2 h-28">
                          {s.trend.map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <span className="text-gray-600 font-['JetBrains_Mono']" style={{ fontSize: "9px" }}>{val}%</span>
                              <div className="w-full rounded-t-sm transition-all"
                                style={{
                                  height: `${(val / 100) * 100}%`,
                                  background: val >= 90 ? "rgba(74,222,128,0.7)" : val >= 75 ? "rgba(250,204,21,0.7)" : "rgba(248,113,113,0.7)",
                                  minHeight: "4px",
                                }} />
                              <span className="text-gray-600 font-['JetBrains_Mono']" style={{ fontSize: "9px" }}>{MONTHS[i]}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Violations for this stream */}
                      <div className="p-5 rounded-xl" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.1)" }}>
                        <h4 className="text-white text-sm font-bold font-['Inter'] mb-3">
                          {isAr ? "المخالفات الأخيرة" : "Recent Violations"}
                        </h4>
                        {VIOLATIONS.filter((v) => v.stream === s.name || v.stream.includes(s.name.split(" ")[0])).length === 0 ? (
                          <div className="flex items-center gap-2 py-4 text-center justify-center">
                            <i className="ri-checkbox-circle-line text-green-400" />
                            <span className="text-green-400 text-sm font-['Inter']">No violations recorded</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {VIOLATIONS.filter((v) => v.stream === s.name || v.stream.includes(s.name.split(" ")[0])).map((v) => {
                              const sev = severityConfig[v.severity];
                              return (
                                <div key={v.id} className="p-3 rounded-lg" style={{ background: sev.bg, border: `1px solid ${sev.color}25` }}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: sev.color }}>{v.id}</span>
                                    <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{v.date}</span>
                                  </div>
                                  <p className="text-white text-xs font-semibold font-['Inter']">{v.type}</p>
                                  <p className="text-gray-400 text-xs font-['Inter'] mt-0.5">{v.detail}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ── VIOLATIONS TAB ── */}
          {mainTab === "violations" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm font-['Inter']">
                  {isAr ? "سجل كامل بجميع مخالفات الامتثال عبر المصادر" : "Complete record of all compliance violations across all streams"}
                </p>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                  <i className="ri-error-warning-line text-red-400 text-xs" />
                  <span className="text-red-400 text-xs font-['JetBrains_Mono']">{VIOLATIONS.filter((v) => v.status === "open" || v.status === "escalated").length} OPEN</span>
                </div>
              </div>

              <div className="space-y-3">
                {VIOLATIONS.map((v) => {
                  const sev = severityConfig[v.severity];
                  const statusColor = v.status === "resolved" ? "#4ADE80" : v.status === "escalated" ? "#F87171" : v.status === "investigating" ? "#FACC15" : "#9CA3AF";
                  return (
                    <div key={v.id} className="p-4 rounded-xl" style={{ background: "rgba(10,22,40,0.8)", border: `1px solid ${sev.color}20`, borderLeft: `3px solid ${sev.color}` }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${v.streamColor}12` }}>
                            <i className={`${v.streamIcon} text-sm`} style={{ color: v.streamColor }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-cyan-400 text-xs font-['JetBrains_Mono'] font-bold">{v.id}</span>
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-['Inter'] capitalize"
                                style={{ background: sev.bg, color: sev.color }}>{v.severity}</span>
                              <span className="text-xs font-semibold font-['Inter']" style={{ color: v.streamColor }}>{v.stream}</span>
                            </div>
                            <p className="text-white text-sm font-semibold font-['Inter']">{v.type}</p>
                            <p className="text-gray-400 text-xs font-['Inter'] mt-0.5">{v.entity}</p>
                            <p className="text-gray-500 text-xs font-['Inter'] mt-1">{v.detail}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-gray-500 text-xs font-['JetBrains_Mono'] mb-1">{v.date}</div>
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-['Inter'] capitalize"
                            style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30` }}>
                            {v.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── TRENDS TAB ── */}
          {mainTab === "trends" && (
            <div className="space-y-5">
              {/* Overall trend */}
              <div className="p-5 rounded-xl" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.1)" }}>
                <h3 className="text-white text-sm font-bold font-['Inter'] mb-4">
                  {isAr ? "متوسط الامتثال الإجمالي (7 أشهر)" : "Overall Average Compliance Score (7 Months)"}
                </h3>
                <div className="flex items-end gap-3 h-36">
                  {MONTHS.map((month, mi) => {
                    const avg = Math.round(STREAMS.reduce((a, s) => a + s.trend[mi], 0) / STREAMS.length);
                    return (
                      <div key={month} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-gray-500 font-['JetBrains_Mono']" style={{ fontSize: "10px" }}>{avg}%</span>
                        <div className="w-full rounded-t-sm"
                          style={{
                            height: `${avg}%`,
                            background: avg >= 90 ? "rgba(74,222,128,0.7)" : avg >= 80 ? "rgba(250,204,21,0.7)" : "rgba(248,113,113,0.7)",
                            minHeight: "4px",
                          }} />
                        <span className="text-gray-500 font-['JetBrains_Mono']" style={{ fontSize: "10px" }}>{month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Per-stream trend table */}
              <div className="rounded-xl overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.1)" }}>
                <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
                  <h3 className="text-white text-sm font-bold font-['Inter']">
                    {isAr ? "اتجاه الامتثال لكل مصدر" : "Per-Stream Compliance Trend"}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(34,211,238,0.06)" }}>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 font-['Inter']">Stream</th>
                        {MONTHS.map((m) => (
                          <th key={m} className="px-3 py-2 text-center text-xs font-semibold text-gray-500 font-['JetBrains_Mono']">{m}</th>
                        ))}
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 font-['Inter']">Change</th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 font-['Inter']">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STREAMS.map((stream, i) => {
                        const cfg = statusConfig[stream.status];
                        const change = stream.trend[6] - stream.trend[0];
                        return (
                          <tr key={stream.id} style={{ borderBottom: i < STREAMS.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(34,211,238,0.02)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                <i className={`${stream.icon} text-xs`} style={{ color: stream.color }} />
                                <span className="text-white text-xs font-['Inter'] whitespace-nowrap">{isAr ? stream.nameAr : stream.name}</span>
                              </div>
                            </td>
                            {stream.trend.map((val, ti) => (
                              <td key={ti} className="px-3 py-2 text-center">
                                <span className="text-xs font-['JetBrains_Mono']"
                                  style={{ color: val >= 90 ? "#4ADE80" : val >= 75 ? "#FACC15" : "#F87171" }}>
                                  {val}
                                </span>
                              </td>
                            ))}
                            <td className="px-4 py-2 text-center">
                              <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: change >= 0 ? "#4ADE80" : "#F87171" }}>
                                {change >= 0 ? "+" : ""}{change}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span className="px-2 py-0.5 rounded-full text-xs font-['Inter']"
                                style={{ background: cfg.bg, color: cfg.color, fontSize: "10px" }}>
                                {cfg.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ComplianceScorecardPage;
