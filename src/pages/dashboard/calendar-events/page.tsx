import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import CalendarLiveCounters from "./components/CalendarLiveCounters";
import CalendarGrid from "./components/CalendarGrid";
import EventListTable from "./components/EventListTable";

type Tab = "calendar" | "eventlist";

const ENTITY_OPTIONS = [
  { value: "hotel",        labelEn: "Hotel Events",        labelAr: "أحداث الفنادق",       icon: "ri-hotel-line",         color: "#D4A84B" },
  { value: "car-rental",   labelEn: "Car Rental",          labelAr: "تأجير السيارات",       icon: "ri-car-line",           color: "#4ADE80" },
  { value: "mobile",       labelEn: "Mobile Operators",    labelAr: "مشغلو الاتصالات",      icon: "ri-sim-card-line",      color: "#A78BFA" },
  { value: "municipality", labelEn: "Municipality",        labelAr: "البلديات",              icon: "ri-government-line",    color: "#FACC15" },
  { value: "financial",    labelEn: "Financial Services",  labelAr: "الخدمات المالية",      icon: "ri-bank-card-line",     color: "#4ADE80" },
  { value: "border",       labelEn: "Border Intelligence", labelAr: "استخبارات الحدود",     icon: "ri-passport-line",      color: "#60A5FA" },
  { value: "utility",      labelEn: "Utility Events",      labelAr: "أحداث المرافق",        icon: "ri-flashlight-line",    color: "#FACC15" },
  { value: "transport",    labelEn: "Transport Intel",     labelAr: "استخبارات النقل",      icon: "ri-bus-line",           color: "#FB923C" },
  { value: "employment",   labelEn: "Employment Registry", labelAr: "سجل التوظيف",          icon: "ri-briefcase-line",     color: "#F9A8D4" },
  { value: "ecommerce",    labelEn: "E-Commerce Intel",    labelAr: "استخبارات التجارة",    icon: "ri-shopping-cart-line", color: "#34D399" },
  { value: "social",       labelEn: "Social Intel",        labelAr: "استخبارات التواصل",    icon: "ri-global-line",        color: "#38BDF8" },
];

const TABS: { id: Tab; icon: string; label: string; labelAr: string }[] = [
  { id: "calendar",  icon: "ri-calendar-2-line", label: "Calendar View", labelAr: "عرض التقويم" },
  { id: "eventlist", icon: "ri-list-check-2",    label: "Event List",    labelAr: "قائمة الأحداث" },
];

const CalendarEventsPage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeTab, setActiveTab] = useState<Tab>("calendar");
  const [entityType, setEntityType] = useState("hotel");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showEntityDropdown, setShowEntityDropdown] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const selectedEntity = ENTITY_OPTIONS.find((e) => e.value === entityType) || ENTITY_OPTIONS[0];

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#0B1220" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `linear-gradient(rgba(181,142,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.03) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b"
        style={{ background: "rgba(11,18,32,0.97)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />
            {isAr ? "لوحة التحكم" : "Dashboard"}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.25)" }}>
              <i className="ri-calendar-line text-gold-400 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{isAr ? "التقويم وقائمة الأحداث" : "Calendar & Event List"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(181,142,60,0.12)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}>
                  AMEEN
                </span>
              </div>
              <p className="text-gray-500 text-xs">{isAr ? "عرض وتصفية جميع الأحداث عبر الوحدات" : "View and filter all events across modules"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live clock */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border"
            style={{ background: "rgba(181,142,60,0.04)", borderColor: "rgba(181,142,60,0.12)" }}>
            <i className="ri-time-line text-gold-400 text-xs" />
            <span className="text-gold-400 text-xs font-bold font-['JetBrains_Mono']">{timeStr}</span>
          </div>

          {/* Entity selector */}
          <div className="relative">
            <button type="button"
              onClick={() => setShowEntityDropdown((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors"
              style={{ background: `${selectedEntity.color}10`, borderColor: `${selectedEntity.color}30`, color: selectedEntity.color }}>
              <i className={`${selectedEntity.icon} text-xs`} />
              {isAr ? selectedEntity.labelAr : selectedEntity.labelEn}
              <i className="ri-arrow-down-s-line text-xs" />
            </button>
            {showEntityDropdown && (
              <div className="absolute right-0 top-full mt-1 w-60 rounded-xl border overflow-hidden z-50"
                style={{ background: "rgba(11,18,32,0.99)", borderColor: "rgba(181,142,60,0.2)", backdropFilter: "blur(20px)" }}>
                <div className="px-3 py-2 border-b" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
                  <span className="text-gray-600 text-xs font-['JetBrains_Mono'] uppercase tracking-wider">
                    {isAr ? "اختر الوحدة" : "Select Module"}
                  </span>
                </div>
                {ENTITY_OPTIONS.map((opt) => (
                  <button key={opt.value} type="button"
                    onClick={() => { setEntityType(opt.value); setShowEntityDropdown(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors text-left"
                    style={{
                      background: entityType === opt.value ? `${opt.color}12` : "transparent",
                      color: entityType === opt.value ? opt.color : "#9CA3AF",
                    }}
                    onMouseEnter={(e) => { if (entityType !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { if (entityType !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                    <i className={`${opt.icon} text-sm`} style={{ color: opt.color }} />
                    {isAr ? opt.labelAr : opt.labelEn}
                    {entityType === opt.value && <i className="ri-check-line ml-auto text-xs" style={{ color: opt.color }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
            style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">LIVE</span>
          </div>

          {/* Language toggle */}
        </div>
      </header>

      {/* Tab bar */}
      <div className="sticky top-[57px] z-30 flex items-center gap-1 px-6 py-2 border-b overflow-x-auto"
        style={{ background: "rgba(11,18,32,0.92)", borderColor: "rgba(181,142,60,0.08)", backdropFilter: "blur(12px)" }}>
        {TABS.map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex-shrink-0"
            style={{
              background: activeTab === tab.id ? "rgba(181,142,60,0.12)" : "transparent",
              border: `1px solid ${activeTab === tab.id ? "rgba(181,142,60,0.25)" : "transparent"}`,
              color: activeTab === tab.id ? "#D4A84B" : "#6B7280",
            }}>
            <i className={`${tab.icon} text-xs`} />
            {isAr ? tab.labelAr : tab.label}
          </button>
        ))}

        {/* Entity badge */}
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border flex-shrink-0"
          style={{ background: `${selectedEntity.color}08`, borderColor: `${selectedEntity.color}20` }}>
          <i className={`${selectedEntity.icon} text-xs`} style={{ color: selectedEntity.color }} />
          <span className="text-xs font-semibold" style={{ color: selectedEntity.color }}>
            {isAr ? selectedEntity.labelAr : selectedEntity.labelEn}
          </span>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* ── CALENDAR TAB ── */}
        {activeTab === "calendar" && (
          <>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "عرض التقويم" : "Calendar View"}</h1>
                <p className="text-gray-400 text-sm">
                  {isAr
                    ? "جميع الأحداث المجدولة — انقر على يوم لعرض التفاصيل والإجراءات السريعة"
                    : "All scheduled events — click any day to view details and quick actions"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap transition-opacity hover:opacity-90"
                  style={{ background: "#D4A84B", color: "#0B1220" }}>
                  <i className="ri-add-line text-sm" />
                  {isAr ? "إضافة حدث" : "Add Event"}
                </button>
                <button type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
                  style={{ background: "transparent", borderColor: "rgba(181,142,60,0.3)", color: "#D4A84B" }}>
                  <i className="ri-download-2-line text-sm" />
                  {isAr ? "تصدير" : "Export"}
                </button>
              </div>
            </div>

            <CalendarLiveCounters isAr={isAr} />
            <CalendarGrid isAr={isAr} entityType={entityType} />

            {/* Legend guide card */}
            <div className="rounded-2xl border p-5" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
                  <i className="ri-information-line text-gold-400 text-sm" />
                </div>
                <h3 className="text-white font-bold text-sm">{isAr ? "دليل التقويم" : "Calendar Guide"}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: "ri-mouse-line",          color: "#D4A84B", title: isAr ? "انقر على يوم" : "Click a Day",       desc: isAr ? "انقر على أي يوم لعرض الأحداث والإجراءات السريعة" : "Click any day to see events and quick actions for that date" },
                  { icon: "ri-circle-fill",          color: "#4ADE80", title: isAr ? "نقاط ملونة" : "Colored Dots",       desc: isAr ? "كل لون يمثل نوع حدث مختلف — راجع المفتاح أعلى التقويم" : "Each color represents a different event type — see legend above" },
                  { icon: "ri-calendar-check-line",  color: "#FACC15", title: isAr ? "اليوم الحالي" : "Current Day",      desc: isAr ? "اليوم الحالي محاط بحلقة سماوية مضيئة للتمييز السريع" : "Current day has a glowing cyan ring for quick identification" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 px-4 py-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{ background: `${item.color}12`, border: `1px solid ${item.color}20` }}>
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
          </>
        )}

        {/* ── EVENT LIST TAB ── */}
        {activeTab === "eventlist" && (
          <>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "قائمة الأحداث" : "Event List"}</h1>
                <p className="text-gray-400 text-sm">
                  {isAr
                    ? "جميع الأحداث المسجلة — تصفية، فرز، تصدير، إعادة إرسال"
                    : "All recorded events — filter, sort, export, re-submit failed events"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                  style={{ background: "rgba(181,142,60,0.04)", borderColor: "rgba(181,142,60,0.12)" }}>
                  <i className="ri-qr-code-line text-gold-400 text-xs" />
                  <span className="text-gold-400 text-xs font-['JetBrains_Mono']">AMN-EVT-20260405</span>
                </div>
              </div>
            </div>

            <CalendarLiveCounters isAr={isAr} />
            <EventListTable isAr={isAr} entityType={entityType} />
          </>
        )}
      </main>

      {/* Click outside to close entity dropdown */}
      {showEntityDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowEntityDropdown(false)} />
      )}
    </div>
  );
};

export default CalendarEventsPage;
