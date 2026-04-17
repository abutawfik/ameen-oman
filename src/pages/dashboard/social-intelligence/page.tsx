import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import PhoneLookupEngine from "./components/PhoneLookupEngine";
import KeywordMonitor from "./components/KeywordMonitor";
import OSINTPostFeed from "./components/OSINTPostFeed";
import OSINTLimitations from "./components/OSINTLimitations";

type Tab = "overview" | "lookup" | "keywords" | "feed" | "config";

const SocialIntelligencePage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const TABS: { id: Tab; icon: string; label: string; labelAr: string; badge?: string; badgeColor?: string }[] = [
    { id: "overview",  icon: "ri-dashboard-3-line",    label: "Overview",          labelAr: "نظرة عامة" },
    { id: "lookup",    icon: "ri-search-eye-line",     label: "Phone Lookup",      labelAr: "بحث الهاتف",      badge: "Tier 1", badgeColor: "#22D3EE" },
    { id: "keywords",  icon: "ri-price-tag-3-line",    label: "Keyword Monitor",   labelAr: "مراقبة الكلمات",  badge: "Tier 2", badgeColor: "#FACC15" },
    { id: "feed",      icon: "ri-pulse-line",          label: "OSINT Feed",        labelAr: "تغذية OSINT",     badge: "3", badgeColor: "#F87171" },
    { id: "config",    icon: "ri-settings-4-line",     label: "Limitations",       labelAr: "القيود والحدود" },
  ];

  const overviewStats = [
    { label: isAr ? "روابط هاتف-اجتماعي" : "Phone-Social Links", value: "8,412", color: "#38BDF8", icon: "ri-links-line", trend: "+14%" },
    { label: isAr ? "تنبيهات الكلمات اليوم" : "Keyword Alerts Today", value: "2,785", color: "#F87171", icon: "ri-search-eye-line", trend: "+18%" },
    { label: isAr ? "منشورات مُبلَّغة" : "Posts Flagged", value: "67", color: "#FACC15", icon: "ri-flag-line", trend: "+5" },
    { label: isAr ? "تنبيهات مرتفعة" : "Elevated Alerts", value: "3", color: "#FB923C", icon: "ri-alarm-warning-line", trend: "+1" },
  ];

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#060D1A" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b"
        style={{ background: "rgba(6,13,26,0.95)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate("/dashboard?type=social")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />
            {isAr ? "لوحة التحكم" : "Dashboard"}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)" }}>
              <i className="ri-global-line text-sky-400 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{isAr ? "استخبارات وسائل التواصل الاجتماعي" : "Social Media Intelligence"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(34,211,238,0.12)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}>AMEEN</span>
              </div>
              <p className="text-gray-500 text-xs">{isAr ? "OSINT Tier 1+2 — بيانات عامة فقط" : "OSINT Tier 1+2 — Public data only"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.12)" }}>
            <i className="ri-time-line text-cyan-400 text-xs" />
            <span className="text-cyan-400 text-xs font-bold font-['JetBrains_Mono']">{timeStr}</span>
          </div>

          {/* Tier badges */}
          <div className="hidden xl:flex items-center gap-2">
            {[
              { label: "Tier 1: Phone Lookup", color: "#22D3EE" },
              { label: "Tier 2: Keyword OSINT", color: "#FACC15" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-1.5 px-2 py-1 rounded-full border" style={{ background: `${t.color}08`, borderColor: `${t.color}20` }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
                <span className="text-xs font-['JetBrains_Mono']" style={{ color: t.color, fontSize: "9px" }}>{t.label}</span>
              </div>
            ))}
          </div>

          {/* Elevated alerts */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.2)" }}>
            <i className="ri-alarm-warning-line text-red-400 text-xs" />
            <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">3 {isAr ? "مرتفع" : "ELEVATED"}</span>
          </div>

          {/* Public only badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <i className="ri-shield-check-line text-green-400 text-xs" />
            <span className="text-green-400 text-xs font-semibold">{isAr ? "بيانات عامة فقط" : "Public data only"}</span>
          </div>

        </div>
      </header>

      {/* Tab bar */}
      <div className="sticky top-[57px] z-30 flex items-center gap-1 px-6 py-2 border-b overflow-x-auto"
        style={{ background: "rgba(6,13,26,0.9)", borderColor: "rgba(34,211,238,0.08)", backdropFilter: "blur(12px)" }}>
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
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border flex-shrink-0"
          style={{ background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.15)" }}>
          <i className="ri-eye-line text-purple-400 text-xs" />
          <span className="text-purple-400 text-xs font-semibold">{isAr ? "OSINT فقط" : "OSINT Only"}</span>
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "لوحة استخبارات وسائل التواصل الاجتماعي" : "Social Media Intelligence Dashboard"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "OSINT Tier 1+2 — بحث الهوية الاجتماعية ومراقبة الكلمات المفتاحية العامة" : "OSINT Tier 1+2 — Social identity lookup & public keyword monitoring"}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {overviewStats.map((s) => (
                <div key={s.label} className="relative rounded-2xl border p-5 overflow-hidden"
                  style={{ background: "rgba(10,22,40,0.8)", borderColor: `${s.color}25`, backdropFilter: "blur(12px)" }}>
                  <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at top right, ${s.color}, transparent 70%)` }} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                        <i className={`${s.icon} text-base`} style={{ color: s.color }} />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(248,113,113,0.1)" }}>
                        <i className="ri-arrow-up-line text-red-400 text-xs" />
                        <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">{s.trend}</span>
                      </div>
                    </div>
                    <div className="text-4xl font-black font-['JetBrains_Mono'] mb-1" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-white font-semibold text-sm mb-0.5">{s.label}</div>
                    <div className="mt-3 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.color }} />
                      <span className="text-xs font-['JetBrains_Mono']" style={{ color: s.color }}>LIVE</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tier explanation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Tier 1 */}
              <div className="rounded-2xl border p-6" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.2)", backdropFilter: "blur(12px)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.25)" }}>
                    <i className="ri-search-eye-line text-cyan-400 text-lg" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold">{isAr ? "Tier 1 — بحث الهوية الاجتماعية" : "Tier 1 — Social Identity Lookup"}</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(34,211,238,0.12)", color: "#22D3EE", fontSize: "9px" }}>PHONE → SOCIAL</span>
                    </div>
                    <p className="text-gray-500 text-xs">{isAr ? "ربط أرقام الهاتف بالحسابات الاجتماعية" : "Link phone numbers to social accounts"}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: "ri-input-method-line", label: isAr ? "المدخل" : "Input", desc: isAr ? "رقم هاتف من تدفق SIM أو بريد إلكتروني من البيانات المالية/الفندقية" : "Phone number from SIM stream or email from financial/hotel data" },
                    { icon: "ri-cpu-line", label: isAr ? "المعالجة" : "Process", desc: isAr ? "استعلام خدمات Pipl وSEON وقاعدة بيانات AMEEN الداخلية" : "Query Pipl, SEON, and AMEEN internal database" },
                    { icon: "ri-list-check-2", label: isAr ? "المخرج" : "Output", desc: isAr ? "قائمة الحسابات المكتشفة مع الأسماء والمتابعين وتاريخ الإنشاء والحالة" : "List of discovered accounts with names, followers, creation date, status" },
                    { icon: "ri-robot-line", label: isAr ? "تلقائي" : "Auto-Lookup", desc: isAr ? "عند شراء SIM جديد → بحث تلقائي → إرفاق النتائج بملف الشخص" : "New SIM purchase → auto-run lookup → attach results to person profile" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 px-3 py-2 rounded-xl" style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.1)" }}>
                      <div className="w-6 h-6 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: "rgba(34,211,238,0.1)" }}>
                        <i className={`${item.icon} text-cyan-400 text-xs`} />
                      </div>
                      <div>
                        <p className="text-cyan-400 text-xs font-bold">{item.label}</p>
                        <p className="text-gray-400 text-xs">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier 2 */}
              <div className="rounded-2xl border p-6" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(250,204,21,0.2)", backdropFilter: "blur(12px)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.25)" }}>
                    <i className="ri-price-tag-3-line text-yellow-400 text-lg" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold">{isAr ? "Tier 2 — مراقبة الكلمات المفتاحية" : "Tier 2 — Public Keyword Monitoring"}</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(250,204,21,0.12)", color: "#FACC15", fontSize: "9px" }}>OSINT</span>
                    </div>
                    <p className="text-gray-500 text-xs">{isAr ? "مراقبة المنشورات العامة بكلمات مفتاحية محددة" : "Monitor public posts for configured keywords"}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: "ri-global-line", color: "#FACC15", label: isAr ? "المنصات" : "Platforms", desc: isAr ? "X/Twitter · Telegram العام · Instagram · Reddit · المنتديات" : "X/Twitter · Public Telegram · Instagram · Reddit · Forums" },
                    { icon: "ri-price-tag-3-line", color: "#FACC15", label: isAr ? "مجموعات الكلمات" : "Keyword Groups", desc: isAr ? "موقع · تهديد · حدث · كيانات · عسكري · مخصص للمحلل" : "Location · Threat · Event · Entity · Military · Custom analyst" },
                    { icon: "ri-alarm-warning-line", color: "#F87171", label: isAr ? "التنبيه المرتفع" : "Elevated Alert", desc: isAr ? "تطابق كلمة + تطابق موقع + قرب زمني من شخص مُبلَّغ = تنبيه مرتفع" : "Keyword match + location match + time proximity to flagged person = elevated alert" },
                    { icon: "ri-emotion-line", color: "#22D3EE", label: isAr ? "تحليل المشاعر" : "Sentiment Analysis", desc: isAr ? "إيجابي / محايد / سلبي / تهديد — لكل منشور مُبلَّغ" : "Positive / Neutral / Negative / Threat — per flagged post" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 px-3 py-2 rounded-xl" style={{ background: "rgba(250,204,21,0.04)", border: "1px solid rgba(250,204,21,0.1)" }}>
                      <div className="w-6 h-6 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${item.color}12` }}>
                        <i className={`${item.icon} text-xs`} style={{ color: item.color }} />
                      </div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: item.color }}>{item.label}</p>
                        <p className="text-gray-400 text-xs">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cross-stream intelligence */}
            <div className="rounded-2xl border p-5" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
                  <i className="ri-links-line text-cyan-400 text-sm" />
                </div>
                <h3 className="text-white font-bold text-sm">{isAr ? "قيمة الاستخبارات المتقاطعة" : "Cross-Stream Intelligence Value"}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: "ri-map-pin-line", color: "#22D3EE", title: isAr ? "تأكيد الموقع" : "Location Confirmation", desc: isAr ? "منشور من مسقط + SIM مسجّل في نزوى = تناقض → تحقيق" : "Post from Muscat + SIM registered in Nizwa = contradiction → investigate" },
                  { icon: "ri-links-line", color: "#FACC15", title: isAr ? "ربط الهوية" : "Identity Linkage", desc: isAr ? "رقم هاتف من SIM → حساب Telegram → اسم مستعار → ربط بملف الشخص" : "Phone from SIM → Telegram account → alias → linked to person profile" },
                  { icon: "ri-alarm-warning-line", color: "#F87171", title: isAr ? "كشف النية" : "Intent Detection", desc: isAr ? "كلمات تهديد + موقع حساس + شخص مُبلَّغ في المنطقة = تنبيه حرج" : "Threat keywords + sensitive location + flagged person in area = critical alert" },
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

            {/* AMN-OSI codes */}
            <div className="rounded-2xl border p-5" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
                  <i className="ri-qr-code-line text-cyan-400 text-sm" />
                </div>
                <h3 className="text-white font-bold text-sm">{isAr ? "رموز تأكيد AMEEN" : "AMEEN Confirmation Codes"}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { code: "AMN-OSI-20260405-0091", label: isAr ? "بحث هاتف — Reza Tehrani" : "Phone Lookup — Reza Tehrani", color: "#22D3EE" },
                  { code: "AMN-OSI-20260405-0094", label: isAr ? "تنبيه كلمة مفتاحية — نزوى" : "Keyword Alert — Nizwa", color: "#FACC15" },
                  { code: "AMN-OSI-20260405-0097", label: isAr ? "تنبيه مرتفع — الشرطة" : "Elevated Alert — Police", color: "#F87171" },
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

        {/* ── PHONE LOOKUP ── */}
        {activeTab === "lookup" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "محرك بحث الهوية الاجتماعية — Tier 1" : "Social Identity Lookup Engine — Tier 1"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "ربط رقم الهاتف أو البريد الإلكتروني بالحسابات الاجتماعية المرتبطة" : "Link phone number or email to associated social accounts"}</p>
            </div>
            <PhoneLookupEngine isAr={isAr} />
          </>
        )}

        {/* ── KEYWORD MONITOR ── */}
        {activeTab === "keywords" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "مراقبة الكلمات المفتاحية العامة — Tier 2" : "Public Keyword Monitoring — Tier 2"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "تهيئة مجموعات الكلمات المفتاحية والمنصات المراقبة" : "Configure keyword groups and monitored platforms"}</p>
            </div>
            <KeywordMonitor isAr={isAr} />
          </>
        )}

        {/* ── OSINT FEED ── */}
        {activeTab === "feed" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "تغذية OSINT المباشرة" : "OSINT Live Feed"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "منشورات عامة مطابقة للكلمات المفتاحية — تحديث كل 8 ثوانٍ" : "Public posts matching keywords — updates every 8 seconds"}</p>
            </div>
            <OSINTPostFeed isAr={isAr} />
          </>
        )}

        {/* ── LIMITATIONS ── */}
        {activeTab === "config" && (
          <>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "القيود والإطار القانوني" : "Limitations & Legal Framework"}</h1>
                <p className="text-gray-400 text-sm">{isAr ? "الحدود التقنية ومصادر API والإطار الأخلاقي" : "Technical boundaries, API sources, and ethical framework"}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border flex-shrink-0" style={{ background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.15)" }}>
                <i className="ri-shield-star-line text-purple-400 text-xs" />
                <span className="text-purple-400 text-xs font-semibold">{isAr ? "مسؤول النظام فقط" : "Admin Only"}</span>
              </div>
            </div>
            <OSINTLimitations isAr={isAr} />
          </>
        )}
      </main>
    </div>
  );
};

export default SocialIntelligencePage;
