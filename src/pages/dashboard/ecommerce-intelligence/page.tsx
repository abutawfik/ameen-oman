import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import EcomLiveCounters from "./components/EcomLiveCounters";
import ItemCategoryMonitor from "./components/ItemCategoryMonitor";
import PersonPurchaseProfile from "./components/PersonPurchaseProfile";
import EcomAnomalies from "./components/EcomAnomalies";
import RetailerCompliance from "./components/RetailerCompliance";
import FlaggedTransactionFeed from "./components/FlaggedTransactionFeed";
import EcomEventForms from "./components/EcomEventForms";

type Tab = "dashboard" | "categories" | "persons" | "anomalies" | "feed" | "retailers" | "submit";

const EcommerceIntelligencePage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const TABS: { id: Tab; icon: string; label: string; labelAr: string; badge?: string; badgeColor?: string }[] = [
    { id: "dashboard",  icon: "ri-dashboard-3-line",          label: "Overview",          labelAr: "نظرة عامة" },
    { id: "categories", icon: "ri-price-tag-3-line",          label: "Category Monitor",  labelAr: "مراقبة الفئات",   badge: "6",  badgeColor: "#FACC15" },
    { id: "persons",    icon: "ri-user-search-line",          label: "Person Profiles",   labelAr: "ملفات الأشخاص",   badge: "3",  badgeColor: "#C98A1B" },
    { id: "anomalies",  icon: "ri-alarm-warning-line",        label: "Anomalies",         labelAr: "الشذوذات",        badge: "5",  badgeColor: "#C94A5E" },
    { id: "feed",       icon: "ri-pulse-line",                label: "Live Feed",         labelAr: "التغذية المباشرة" },
    { id: "retailers",  icon: "ri-store-line",                label: "Retailer Compliance",labelAr: "امتثال التجار" },
    { id: "submit",     icon: "ri-add-circle-line",           label: "Record Event",       labelAr: "تسجيل حدث",       badge: "5",  badgeColor: "#D6B47E" },
  ];

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#051428" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(184,138,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.03) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b"
        style={{ background: "rgba(5,20,40,0.95)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate("/dashboard?type=ecommerce")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />
            {isAr ? "لوحة التحكم" : "Dashboard"}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
              <i className="ri-shopping-cart-line text-emerald-400 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{isAr ? "استخبارات التجارة الإلكترونية والتجزئة" : "E-Commerce & Retail Intelligence"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(184,138,60,0.12)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.2)" }}>Al-Ameen</span>
              </div>
              <p className="text-gray-500 text-xs">{isAr ? "معالجو الدفع · تجار التجزئة · المنصات الإلكترونية" : "Payment Processors · Major Retailers · Online Platforms"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live clock */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: "rgba(184,138,60,0.04)", borderColor: "rgba(184,138,60,0.12)" }}>
            <i className="ri-time-line text-gold-400 text-xs" />
            <span className="text-gold-400 text-xs font-bold font-['JetBrains_Mono']">{timeStr}</span>
          </div>

          {/* Source pills */}
          <div className="hidden xl:flex items-center gap-2">
            {[
              { label: "CBO Feed", color: "#D6B47E" },
              { label: "Retailers", color: "#34D399" },
              { label: "Platforms", color: "#A78BFA" },
            ].map((p) => (
              <div key={p.label} className="flex items-center gap-1.5 px-2 py-1 rounded-full border" style={{ background: `${p.color}08`, borderColor: `${p.color}20` }}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: p.color }} />
                <span className="text-xs font-['JetBrains_Mono']" style={{ color: p.color, fontSize: "9px" }}>{p.label}</span>
              </div>
            ))}
          </div>

          {/* Anomaly badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(201,74,94,0.08)", borderColor: "rgba(201,74,94,0.2)" }}>
            <i className="ri-alarm-warning-line text-red-400 text-xs" />
            <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">5 {isAr ? "شذوذ" : "ANOMALIES"}</span>
          </div>

          {/* Targeted note */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.15)" }}>
            <i className="ri-focus-3-line text-purple-400 text-xs" />
            <span className="text-purple-400 text-xs font-semibold">{isAr ? "مراقبة مستهدفة" : "Targeted Monitoring"}</span>
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
      <div className="sticky top-[57px] z-30 flex items-center gap-1 px-6 py-2 border-b overflow-x-auto"
        style={{ background: "rgba(5,20,40,0.9)", borderColor: "rgba(184,138,60,0.08)", backdropFilter: "blur(12px)" }}>
        {TABS.map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex-shrink-0"
            style={{
              background: activeTab === tab.id ? "rgba(184,138,60,0.12)" : "transparent",
              border: `1px solid ${activeTab === tab.id ? "rgba(184,138,60,0.25)" : "transparent"}`,
              color: activeTab === tab.id ? "#D6B47E" : "#6B7280",
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

        {/* Targeted note */}
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border flex-shrink-0"
          style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.15)" }}>
          <i className="ri-shield-check-line text-green-400 text-xs" />
          <span className="text-green-400 text-xs font-semibold">{isAr ? "ليس مراقبة شاملة" : "Not mass surveillance"}</span>
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "dashboard" && (
          <>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "لوحة استخبارات التجارة الإلكترونية" : "E-Commerce Intelligence Dashboard"}</h1>
                <p className="text-gray-400 text-sm">{isAr ? "مراقبة مستهدفة للمشتريات المُبلَّغة — ليس كل المعاملات" : "Targeted monitoring of flagged purchases — not all transactions"}</p>
              </div>
            </div>

            <EcomLiveCounters isAr={isAr} />

            {/* Intelligence value panel */}
            <div className="rounded-2xl border p-5" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
                  <i className="ri-links-line text-gold-400 text-sm" />
                </div>
                <h3 className="text-white font-bold text-sm">{isAr ? "قيمة الاستخبارات" : "Intelligence Value"}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: "ri-money-dollar-circle-line", color: "#4ADE80", title: isAr ? "الثروة غير المفسّرة" : "Unexplained Wealth", desc: isAr ? "مقارنة الإنفاق بالراتب المُعلن — الفجوة تُشير إلى مصادر دخل مخفية" : "Compare spending vs declared salary — gap indicates hidden income sources" },
                  { icon: "ri-map-pin-line", color: "#D6B47E", title: isAr ? "تحديد الموقع الفعلي" : "Actual Location Reveal", desc: isAr ? "الشراء من متجر في نزوى يُثبت الوجود الجسدي — يتعارض مع العنوان المُسجَّل" : "Purchase at Nizwa store proves physical presence — contradicts registered address" },
                  { icon: "ri-spy-line", color: "#C94A5E", title: isAr ? "كشف النوايا" : "Intent Detection", desc: isAr ? "شراء مشوش إشارة + شرائح SIM بالجملة + مواد كيميائية = نمط يستحق التحقيق" : "Signal jammer + bulk SIMs + chemicals = pattern warranting investigation" },
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

            {/* Trigger thresholds */}
            <div className="rounded-2xl border p-5" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.2)" }}>
                  <i className="ri-settings-4-line text-yellow-400 text-sm" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{isAr ? "محفزات الإبلاغ" : "Reporting Triggers"}</h3>
                  <p className="text-gray-500 text-xs">{isAr ? "ليس كل عملية شراء — فقط المحفزات المحددة" : "Not every purchase — only specific triggers"}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { icon: "ri-stack-line", color: "#FACC15", label: isAr ? "شراء بالجملة" : "Bulk Purchase", desc: isAr ? "كميات غير معتادة من العناصر المراقبة" : "Unusual quantities of monitored items" },
                  { icon: "ri-money-dollar-circle-line", color: "#C98A1B", label: isAr ? "معاملة عالية القيمة" : "High-Value Transaction", desc: isAr ? "شراء واحد فوق الحد المُهيَّأ حسب الفئة" : "Single purchase above configurable threshold by category" },
                  { icon: "ri-forbid-line", color: "#C94A5E", label: isAr ? "عنصر مقيّد" : "Restricted Item", desc: isAr ? "معدات مراقبة، مواد كيميائية، طائرات مسيّرة، أجهزة تشويش" : "Surveillance equipment, chemicals, drones, jammers" },
                  { icon: "ri-ship-line", color: "#A78BFA", label: isAr ? "تنبيه شحن" : "Shipping Alert", desc: isAr ? "شحنات دولية من مصادر عالية المخاطر" : "International shipments from high-risk origins" },
                  { icon: "ri-exchange-line", color: "#D6B47E", label: isAr ? "نمط الدفع" : "Payment Pattern", desc: isAr ? "بطاقات متعددة، معاملات صغيرة متكررة، تجزئة" : "Multiple cards, frequent small transactions, structuring" },
                  { icon: "ri-bank-card-line", color: "#34D399", label: isAr ? "بطاقات مدفوعة مسبقاً" : "Prepaid Cards", desc: isAr ? "10+ بطاقات في معاملة واحدة — مؤشر غسيل أموال" : "10+ cards in single transaction — money laundering indicator" },
                ].map((t) => (
                  <div key={t.label} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${t.color}15` }}>
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${t.color}12` }}>
                      <i className={`${t.icon} text-xs`} style={{ color: t.color }} />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold mb-0.5">{t.label}</p>
                      <p className="text-gray-500 text-xs">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily volume chart (visual) */}
            <div className="rounded-2xl border p-5" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
                    <i className="ri-bar-chart-line text-gold-400 text-sm" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{isAr ? "حجم المعاملات المُبلَّغة اليومي" : "Daily Flagged Transaction Volume"}</h3>
                    <p className="text-gray-500 text-xs">{isAr ? "آخر 7 أيام — حسب الفئة" : "Last 7 days — by category"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {[{ label: "Bulk", color: "#FACC15" }, { label: "Restricted", color: "#C94A5E" }, { label: "High-Value", color: "#C98A1B" }, { label: "Pattern", color: "#D6B47E" }].map((l) => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                      <span className="text-gray-400 text-xs">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Bar chart */}
              <div className="flex items-end gap-3 h-32">
                {[
                  { day: "Mon", bulk: 28, restricted: 8, highvalue: 15, pattern: 22 },
                  { day: "Tue", bulk: 34, restricted: 11, highvalue: 19, pattern: 31 },
                  { day: "Wed", bulk: 22, restricted: 6, highvalue: 12, pattern: 18 },
                  { day: "Thu", bulk: 41, restricted: 14, highvalue: 23, pattern: 38 },
                  { day: "Fri", bulk: 38, restricted: 12, highvalue: 21, pattern: 35 },
                  { day: "Sat", bulk: 29, restricted: 9, highvalue: 16, pattern: 24 },
                  { day: "Sun", bulk: 38, restricted: 14, highvalue: 22, pattern: 38 },
                ].map((d) => {
                  const total = d.bulk + d.restricted + d.highvalue + d.pattern;
                  const maxTotal = 120;
                  const scale = (v: number) => `${(v / maxTotal) * 100}%`;
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col-reverse gap-0.5" style={{ height: "100px" }}>
                        {[
                          { val: d.bulk, color: "#FACC15" },
                          { val: d.restricted, color: "#C94A5E" },
                          { val: d.highvalue, color: "#C98A1B" },
                          { val: d.pattern, color: "#D6B47E" },
                        ].map((seg, i) => (
                          <div key={i} className="w-full rounded-sm" style={{ height: scale(seg.val), background: seg.color, opacity: 0.8, minHeight: "2px" }} />
                        ))}
                      </div>
                      <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{d.day}</span>
                      <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{total}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AMN-ECM codes */}
            <div className="rounded-2xl border p-5" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
                  <i className="ri-qr-code-line text-gold-400 text-sm" />
                </div>
                <h3 className="text-white font-bold text-sm">{isAr ? "رموز تأكيد Al-Ameen" : "Al-Ameen Confirmation Codes"}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { code: "AMN-ECM-20260405-0247", label: isAr ? "شراء مقيّد" : "Restricted Purchase", color: "#C94A5E" },
                  { code: "AMN-ECM-20260405-0246", label: isAr ? "شراء بالجملة" : "Bulk Purchase", color: "#FACC15" },
                  { code: "AMN-ECM-20260405-0245", label: isAr ? "معاملة عالية القيمة" : "High-Value Transaction", color: "#C98A1B" },
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

        {/* ── CATEGORY MONITOR TAB ── */}
        {activeTab === "categories" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "مراقبة فئات العناصر" : "Item Category Monitor"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "6 فئات مراقبة — انقر على أي فئة لعرض أحدث التنبيهات" : "6 monitored categories — click any category to view latest alerts"}</p>
            </div>
            <ItemCategoryMonitor isAr={isAr} />
          </>
        )}

        {/* ── PERSON PROFILES TAB ── */}
        {activeTab === "persons" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "ملفات مشتريات الأشخاص" : "Person Purchase Profiles"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "جميع المشتريات المُبلَّغة مرتبطة بالشخص — مقارنة مع التدفقات المالية والتوظيف" : "All flagged purchases linked to person — cross-reference with financial & employment streams"}</p>
            </div>
            <PersonPurchaseProfile isAr={isAr} />
          </>
        )}

        {/* ── ANOMALIES TAB ── */}
        {activeTab === "anomalies" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "كشف الشذوذات" : "Anomaly Detection"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "أنماط مشبوهة مكتشفة تلقائياً — تحليل متقاطع بين جميع التدفقات" : "Auto-detected suspicious patterns — cross-stream analysis across all data streams"}</p>
            </div>
            <EcomAnomalies isAr={isAr} />
          </>
        )}

        {/* ── LIVE FEED TAB ── */}
        {activeTab === "feed" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "التغذية المباشرة للمعاملات المُبلَّغة" : "Flagged Transaction Live Feed"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "تحديث تلقائي كل 7 ثوانٍ — فقط المعاملات المُبلَّغة" : "Auto-updates every 7 seconds — flagged transactions only"}</p>
            </div>
            <FlaggedTransactionFeed isAr={isAr} />
          </>
        )}

        {/* ── SUBMIT TAB ── */}
        {activeTab === "submit" && (
          <EcomEventForms isAr={isAr} />
        )}

        {/* ── RETAILERS TAB ── */}
        {activeTab === "retailers" && (
          <>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "امتثال تجار التجزئة" : "Retailer Compliance"}</h1>
                <p className="text-gray-400 text-sm">{isAr ? "التجار المُبلِّغون مقابل غير المُبلِّغين — درجة جودة البيانات" : "Reporting vs non-reporting retailers — data quality score"}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border flex-shrink-0" style={{ background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.15)" }}>
                <i className="ri-shield-star-line text-purple-400 text-xs" />
                <span className="text-purple-400 text-xs font-semibold">{isAr ? "مسؤول النظام فقط" : "Admin Only"}</span>
              </div>
            </div>
            <RetailerCompliance isAr={isAr} />
          </>
        )}
      </main>
    </div>
  );
};

export default EcommerceIntelligencePage;
