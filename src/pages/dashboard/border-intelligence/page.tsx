import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import LiveCounters from "./components/LiveCounters";
import EntryPointsMap from "./components/EntryPointsMap";
import NationalityBreakdown from "./components/NationalityBreakdown";
import OverstayTracker from "./components/OverstayTracker";
import VisaComplianceChart from "./components/VisaComplianceChart";
import CrossStreamPanel from "./components/CrossStreamPanel";
import FeedConfigPanel from "./components/FeedConfigPanel";

type Tab = "dashboard" | "feed-config";

const BorderIntelligencePage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = currentTime.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#0B1220" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(181,142,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b" style={{ background: "rgba(11,18,32,0.95)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate("/dashboard?type=border")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />
            {isAr ? "لوحة التحكم" : "Dashboard"}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
              <i className="ri-passport-line text-gold-400 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{isAr ? "ذكاء الحدود والهجرة" : "Borders & Immigration Intelligence"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(181,142,60,0.12)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}>Al-Ameen</span>
              </div>
              <p className="text-gray-500 text-xs">{isAr ? "تغذية تلقائية من iBorders وeVisa" : "Automated feed from iBorders & eVisa"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live clock */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: "rgba(181,142,60,0.04)", borderColor: "rgba(181,142,60,0.12)" }}>
            <i className="ri-time-line text-gold-400 text-xs" />
            <span className="text-gold-400 text-xs font-bold font-['JetBrains_Mono']">{timeStr}</span>
            <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{dateStr}</span>
          </div>
          {/* Police badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.2)" }}>
            <i className="ri-shield-star-line text-purple-400 text-xs" />
            <span className="text-purple-400 text-xs font-semibold font-['JetBrains_Mono']">Police Internal</span>
          </div>
          {/* Live badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">LIVE</span>
          </div>
          {/* Language toggle */}
        </div>
      </header>

      {/* Tab bar */}
      <div className="sticky top-[57px] z-30 flex items-center gap-1 px-6 py-2 border-b" style={{ background: "rgba(11,18,32,0.9)", borderColor: "rgba(181,142,60,0.08)", backdropFilter: "blur(12px)" }}>
        {([
          { id: "dashboard", icon: "ri-dashboard-3-line", label: isAr ? "لوحة الذكاء" : "Intelligence Dashboard" },
          { id: "feed-config", icon: "ri-settings-4-line", label: isAr ? "إعداد التغذية" : "Feed Configuration" },
        ] as { id: Tab; icon: string; label: string }[]).map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
            style={{
              background: activeTab === tab.id ? "rgba(181,142,60,0.12)" : "transparent",
              border: `1px solid ${activeTab === tab.id ? "rgba(181,142,60,0.25)" : "transparent"}`,
              color: activeTab === tab.id ? "#D4A84B" : "#6B7280",
            }}>
            <i className={`${tab.icon} text-xs`} />
            {tab.label}
          </button>
        ))}

        {/* System status pills */}
        <div className="ml-auto flex items-center gap-2">
          {[
            { label: "iBorders Air", color: "#D4A84B" },
            { label: "iBorders Land", color: "#4ADE80" },
            { label: "iBorders Sea", color: "#4ADE80" },
            { label: "eVisa Portal", color: "#A78BFA" },
          ].map((sys) => (
            <div key={sys.label} className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-full border" style={{ background: `${sys.color}08`, borderColor: `${sys.color}20` }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: sys.color }} />
              <span className="text-xs font-['JetBrains_Mono']" style={{ color: sys.color, fontSize: "9px" }}>{sys.label}</span>
            </div>
          ))}
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-6">
        {activeTab === "dashboard" && (
          <>
            {/* Page title */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "لوحة ذكاء الحدود" : "Border Intelligence Dashboard"}</h1>
                <p className="text-gray-400 text-sm">{isAr ? "بيانات مباشرة من iBorders وeVisa — Al-Ameen يُثري بتحليلات متعددة التدفقات" : "Live data from iBorders & eVisa — Al-Ameen enriches with cross-stream analytics"}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border flex-shrink-0" style={{ background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.15)" }}>
                <i className="ri-information-line text-purple-400 text-xs" />
                <span className="text-purple-400 text-xs font-semibold">{isAr ? "قراءة فقط — لا تحكم" : "Read-only — No control"}</span>
              </div>
            </div>

            {/* Live counters */}
            <LiveCounters isAr={isAr} />

            {/* Map */}
            <EntryPointsMap isAr={isAr} />

            {/* Nationality + Visa/Frequent */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NationalityBreakdown isAr={isAr} />
              <VisaComplianceChart isAr={isAr} />
            </div>

            {/* Overstay tracker */}
            <OverstayTracker isAr={isAr} />

            {/* Cross-stream */}
            <CrossStreamPanel isAr={isAr} />

            {/* AMN-BDR confirmation codes note */}
            <div className="rounded-2xl border p-5" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
                  <i className="ri-qr-code-line text-gold-400 text-sm" />
                </div>
                <h3 className="text-white font-bold text-sm">{isAr ? "رموز تأكيد Al-Ameen" : "Al-Ameen Confirmation Codes"}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { code: "AMN-BDR-20260405-0001", label: isAr ? "حدث دخول" : "Entry Event", color: "#4ADE80" },
                  { code: "AMN-BDR-20260405-0847", label: isAr ? "تجاوز إقامة" : "Overstay Detected", color: "#F87171" },
                  { code: "AMN-BDR-20260405-1203", label: isAr ? "تأشيرة صادرة" : "Visa Issued", color: "#A78BFA" },
                ].map((ex) => (
                  <div key={ex.code} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ex.color }} />
                    <div>
                      <div className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: ex.color }}>{ex.code}</div>
                      <div className="text-gray-500 text-xs">{ex.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "feed-config" && (
          <>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "إعداد تغذية البيانات" : "Feed Configuration"}</h1>
                <p className="text-gray-400 text-sm">{isAr ? "إدارة مصادر البيانات وأنواع الأحداث المستلمة من أنظمة الشرطة" : "Manage data sources and event types received from Police systems"}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border flex-shrink-0" style={{ background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.15)" }}>
                <i className="ri-shield-star-line text-purple-400 text-xs" />
                <span className="text-purple-400 text-xs font-semibold">{isAr ? "مسؤول النظام فقط" : "Admin Only"}</span>
              </div>
            </div>
            <FeedConfigPanel isAr={isAr} />
          </>
        )}
      </main>
    </div>
  );
};

export default BorderIntelligencePage;
