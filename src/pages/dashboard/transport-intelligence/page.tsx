import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TransportLiveCounters from "./components/TransportLiveCounters";
import RouteHeatmap from "./components/RouteHeatmap";
import PersonMovementViewer from "./components/PersonMovementViewer";
import TransportAnomalies from "./components/TransportAnomalies";
import RecentTripsFeed from "./components/RecentTripsFeed";
import TransportFeedConfig from "./components/TransportFeedConfig";
import TripSubmissionForms from "./components/TripSubmissionForms";

type Tab = "dashboard" | "movement" | "anomalies" | "feed" | "forms" | "config";

const TransportIntelligencePage = () => {
  const navigate = useNavigate();
  const [isAr, setIsAr] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const TABS: { id: Tab; icon: string; label: string; labelAr: string; badge?: string; badgeColor?: string }[] = [
    { id: "dashboard", icon: "ri-dashboard-3-line", label: "Overview", labelAr: "نظرة عامة" },
    { id: "movement", icon: "ri-user-location-line", label: "Person Movement", labelAr: "تنقل الأشخاص" },
    { id: "anomalies", icon: "ri-alarm-warning-line", label: "Anomalies", labelAr: "الشذوذات", badge: "5", badgeColor: "#F87171" },
    { id: "feed", icon: "ri-pulse-line", label: "Live Feed", labelAr: "التغذية المباشرة" },
    { id: "forms", icon: "ri-file-add-line", label: "Record Trip", labelAr: "تسجيل رحلة" },
    { id: "config", icon: "ri-settings-4-line", label: "Configuration", labelAr: "الإعداد" },
  ];

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#060D1A" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b" style={{ background: "rgba(6,13,26,0.95)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate("/dashboard?type=transport")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
            <i className="ri-arrow-left-line" />
            {isAr ? "لوحة التحكم" : "Dashboard"}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
              <i className="ri-route-line text-cyan-400 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{isAr ? "ذكاء النقل العام" : "Public Transport Intelligence"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(34,211,238,0.12)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}>AMEEN</span>
              </div>
              <p className="text-gray-500 text-xs">{isAr ? "الحافلات الوطنية · شركات التاكسي · تطبيقات التوصيل" : "National Bus Co. · Licensed Taxis · Ride-Hail Apps"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live clock */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.12)" }}>
            <i className="ri-time-line text-cyan-400 text-xs" />
            <span className="text-cyan-400 text-xs font-bold font-['JetBrains_Mono']">{timeStr}</span>
          </div>
          {/* Provider pills */}
          <div className="hidden xl:flex items-center gap-2">
            {[
              { label: "Nat.Bus", color: "#22D3EE" },
              { label: "Ride-Hail A", color: "#A78BFA" },
              { label: "Ride-Hail B", color: "#FB923C" },
            ].map((p) => (
              <div key={p.label} className="flex items-center gap-1.5 px-2 py-1 rounded-full border" style={{ background: `${p.color}08`, borderColor: `${p.color}20` }}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: p.color }} />
                <span className="text-xs font-['JetBrains_Mono']" style={{ color: p.color, fontSize: "9px" }}>{p.label}</span>
              </div>
            ))}
          </div>
          {/* Anomaly badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.2)" }}>
            <i className="ri-alarm-warning-line text-red-400 text-xs" />
            <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">5 {isAr ? "شذوذ" : "ANOMALIES"}</span>
          </div>
          {/* Live badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">LIVE</span>
          </div>
          {/* Language toggle */}
          <button type="button" onClick={() => setIsAr((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#22D3EE"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(34,211,238,0.3)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
            <i className="ri-translate-2 text-xs" />{isAr ? "EN" : "عربي"}
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="sticky top-[57px] z-30 flex items-center gap-1 px-6 py-2 border-b overflow-x-auto" style={{ background: "rgba(6,13,26,0.9)", borderColor: "rgba(34,211,238,0.08)", backdropFilter: "blur(12px)" }}>
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
            {tab.badge && (
              <span className="px-1.5 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                style={{ background: `${tab.badgeColor}20`, color: tab.badgeColor, fontSize: "9px" }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}

        {/* Read-only note */}
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border flex-shrink-0" style={{ background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.15)" }}>
          <i className="ri-eye-line text-purple-400 text-xs" />
          <span className="text-purple-400 text-xs font-semibold">{isAr ? "قراءة فقط" : "Read-only"}</span>
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "dashboard" && (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "لوحة ذكاء النقل العام" : "Transport Intelligence Dashboard"}</h1>
                <p className="text-gray-400 text-sm">{isAr ? "بيانات مباشرة من شركة الحافلات الوطنية وشركات التاكسي وتطبيقات التوصيل" : "Live data from National Bus Co., licensed taxi operators, and ride-hailing apps"}</p>
              </div>
            </div>

            <TransportLiveCounters isAr={isAr} />
            <RouteHeatmap isAr={isAr} />

            {/* Cross-stream intelligence note */}
            <div className="rounded-2xl border p-5" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
                  <i className="ri-links-line text-cyan-400 text-sm" />
                </div>
                <h3 className="text-white font-bold text-sm">{isAr ? "قيمة التدفق المتقاطع" : "Cross-Stream Intelligence"}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: "ri-store-line", color: "#F87171", title: isAr ? "سائح في منطقة صناعية" : "Tourist → Industrial Zone", desc: isAr ? "سائح بتأشيرة يأخذ الحافلة يومياً إلى المنطقة الصناعية — ليست منطقة سياحية → تنبيه" : "Tourist visa → daily bus to industrial area (not tourist area) → flag" },
                  { icon: "ri-ghost-line", color: "#FB923C", title: isAr ? "لا عنوان + تاكسي مكثف" : "No Address + Heavy Taxi", desc: isAr ? "شخص بدون عنوان مسجّل + استخدام مكثف للتاكسي → أين ينام؟" : "Person with no registered address → heavy taxi usage → where are they sleeping?" },
                  { icon: "ri-wifi-line", color: "#22D3EE", title: isAr ? "ربط الهاتف بالرحلة" : "Phone → Trip Linkage", desc: isAr ? "رقم الهاتف في تدفق SIM يطابق بيانات تطبيق التوصيل → هوية مؤكدة" : "Phone number in SIM stream matches ride-hail app data → confirmed identity" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${item.color}12`, border: `1px solid ${item.color}20` }}>
                      <i className={`${item.icon} text-sm`} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold mb-0.5">{item.title}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AMN-TRN codes */}
            <div className="rounded-2xl border p-5" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
                  <i className="ri-qr-code-line text-cyan-400 text-sm" />
                </div>
                <h3 className="text-white font-bold text-sm">{isAr ? "رموز تأكيد AMEEN" : "AMEEN Confirmation Codes"}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { code: "AMN-TRN-20260405-4821", label: isAr ? "رحلة حافلة" : "Bus Journey", color: "#22D3EE" },
                  { code: "AMN-TRN-20260405-3247", label: isAr ? "رحلة تاكسي" : "Taxi Trip", color: "#4ADE80" },
                  { code: "AMN-TRN-20260405-8934", label: isAr ? "رحلة توصيل" : "Ride-Hail Trip", color: "#A78BFA" },
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

        {/* ── MOVEMENT TAB ── */}
        {activeTab === "movement" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "نمط تنقل الأشخاص" : "Person Movement Pattern"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "جميع أحداث النقل مرتبطة بالشخص — خريطة المسار + الجدول الزمني" : "All transport events linked to person — path map + timeline"}</p>
            </div>
            <PersonMovementViewer isAr={isAr} />
          </>
        )}

        {/* ── ANOMALIES TAB ── */}
        {activeTab === "anomalies" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "كشف الشذوذات" : "Anomaly Detection"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "أنماط تنقل مشبوهة — تحليل متقاطع بين جميع التدفقات" : "Suspicious movement patterns — cross-stream analysis across all data streams"}</p>
            </div>
            <TransportAnomalies isAr={isAr} />
          </>
        )}

        {/* ── LIVE FEED TAB ── */}
        {activeTab === "feed" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "التغذية المباشرة للرحلات" : "Live Trip Feed"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "جميع رحلات النقل في الوقت الفعلي — تحديث كل 5 ثوانٍ" : "All transport trips in real-time — updates every 5 seconds"}</p>
            </div>
            <RecentTripsFeed isAr={isAr} />
          </>
        )}

        {/* ── FORMS TAB ── */}
        {activeTab === "forms" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "تسجيل رحلة يدوياً" : "Manual Trip Recording"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "إدخال يدوي لرحلات الحافلة والتاكسي والتوصيل" : "Manual entry for bus journeys, taxi trips, and ride-hail trips"}</p>
            </div>
            <TripSubmissionForms isAr={isAr} />
          </>
        )}

        {/* ── CONFIG TAB ── */}
        {activeTab === "config" && (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "إعداد مزودي النقل" : "Transport Feed Configuration"}</h1>
                <p className="text-gray-400 text-sm">{isAr ? "إدارة مزودي API وطرق تطابق الهوية" : "Manage API providers and identity matching methods"}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border flex-shrink-0" style={{ background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.15)" }}>
                <i className="ri-shield-star-line text-purple-400 text-xs" />
                <span className="text-purple-400 text-xs font-semibold">{isAr ? "مسؤول النظام فقط" : "Admin Only"}</span>
              </div>
            </div>
            <TransportFeedConfig isAr={isAr} />
          </>
        )}
      </main>
    </div>
  );
};

export default TransportIntelligencePage;
