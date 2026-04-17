import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import WorkPermitForm from "./WorkPermitForm";
import EmployerChangeForm from "./EmployerChangeForm";
import PermitRenewalForm from "./PermitRenewalForm";
import TerminationForm from "./TerminationForm";
import EmploymentIntelligence from "./components/EmploymentIntelligence";

type EventType = "permit-issued" | "employer-change" | "renewal" | "termination";
type Tab = "events" | "intelligence";

interface EventCard {
  id: EventType;
  icon: string;
  label: string;
  labelAr: string;
  desc: string;
  descAr: string;
  color: string;
  bgColor: string;
  borderColor: string;
  code: string;
  badge?: string;
  badgeColor?: string;
}

const EVENT_CARDS: EventCard[] = [
  {
    id: "permit-issued",
    icon: "ri-briefcase-line",
    label: "Work Permit Issued",
    labelAr: "تصريح عمل صادر",
    desc: "Register a new work permit from Ministry of Labour feed or employer submission",
    descAr: "تسجيل تصريح عمل جديد من تغذية وزارة العمل أو إدخال صاحب العمل",
    color: "#D6B47E", bgColor: "rgba(184,138,60,0.08)", borderColor: "rgba(184,138,60,0.25)",
    code: "EMP_PERMIT_ISSUED",
  },
  {
    id: "employer-change",
    icon: "ri-building-line",
    label: "Employer Change",
    labelAr: "تغيير صاحب العمل",
    desc: "Record transfer of work permit from one employer to another with NOC status",
    descAr: "تسجيل نقل تصريح العمل من صاحب عمل إلى آخر مع حالة عدم الممانعة",
    color: "#4ADE80", bgColor: "rgba(74,222,128,0.08)", borderColor: "rgba(74,222,128,0.25)",
    code: "EMP_EMPLOYER_CHANGE",
  },
  {
    id: "renewal",
    icon: "ri-refresh-line",
    label: "Permit Renewal",
    labelAr: "تجديد التصريح",
    desc: "Renew an existing work permit with updated expiry, salary band, or job title",
    descAr: "تجديد تصريح عمل قائم مع تحديث تاريخ الانتهاء أو الراتب أو المسمى الوظيفي",
    color: "#FACC15", bgColor: "rgba(250,204,21,0.08)", borderColor: "rgba(250,204,21,0.25)",
    code: "EMP_RENEWAL",
  },
  {
    id: "termination",
    icon: "ri-user-unfollow-line",
    label: "Termination",
    labelAr: "إنهاء العمل",
    desc: "Record employment termination — triggers absconding monitor if no border exit",
    descAr: "تسجيل إنهاء العمل — يُفعّل مراقبة التغيب إذا لم تُسجَّل مغادرة حدودية",
    color: "#C94A5E", bgColor: "rgba(201,74,94,0.08)", borderColor: "rgba(201,74,94,0.25)",
    code: "EMP_TERMINATION",
    badge: "TRIGGERS MONITOR",
    badgeColor: "#C94A5E",
  },
];

const EmploymentRegistryPage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeTab, setActiveTab] = useState<Tab>("events");
  const [activeEvent, setActiveEvent] = useState<EventType | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const activeCard = EVENT_CARDS.find((c) => c.id === activeEvent);

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#051428" }} dir={isAr ? "rtl" : "ltr"}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(184,138,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b" style={{ background: "rgba(5,20,40,0.95)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button type="button"
            onClick={() => { if (activeEvent) { setActiveEvent(null); } else { navigate("/dashboard?type=employment"); } }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />
            {activeEvent ? (isAr ? "العودة" : "Back") : (isAr ? "لوحة التحكم" : "Dashboard")}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
              <i className="ri-briefcase-line text-gold-400 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{isAr ? "سجل التوظيف" : "Employment Registry"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(184,138,60,0.12)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.2)" }}>Al-Ameen Portal</span>
              </div>
              <p className="text-gray-500 text-xs">{isAr ? "وزارة العمل · أصحاب العمل المسجّلون" : "Ministry of Labour · Registered Employers"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: "rgba(184,138,60,0.04)", borderColor: "rgba(184,138,60,0.12)" }}>
            <i className="ri-time-line text-gold-400 text-xs" />
            <span className="text-gold-400 text-xs font-bold font-['JetBrains_Mono']">{timeStr}</span>
          </div>
          {/* Absconding alert */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(201,74,94,0.08)", borderColor: "rgba(201,74,94,0.2)" }}>
            <i className="ri-user-unfollow-line text-red-400 text-xs" />
            <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">3 {isAr ? "تغيب" : "ABSCONDING"}</span>
          </div>
          {/* Ministry feed */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">{isAr ? "وزارة العمل متصلة" : "MOL CONNECTED"}</span>
          </div>
          {activeCard && (
            <div className="hidden sm:block px-3 py-1.5 rounded-lg border text-xs font-bold font-['JetBrains_Mono']"
              style={{ background: activeCard.bgColor, borderColor: activeCard.borderColor, color: activeCard.color }}>
              {activeCard.code}
            </div>
          )}
        </div>
      </header>

      {/* Tab bar */}
      <div className="sticky top-[57px] z-30 flex items-center gap-1 px-6 py-2 border-b" style={{ background: "rgba(5,20,40,0.9)", borderColor: "rgba(184,138,60,0.08)", backdropFilter: "blur(12px)" }}>
        {([
          { id: "events" as Tab, icon: "ri-file-list-3-line", label: isAr ? "أحداث التوظيف" : "Employment Events" },
          { id: "intelligence" as Tab, icon: "ri-spy-line", label: isAr ? "الذكاء الوظيفي" : "Employment Intelligence", badge: "3", badgeColor: "#C94A5E" },
        ]).map((tab) => (
          <button key={tab.id} type="button" onClick={() => { setActiveTab(tab.id); setActiveEvent(null); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
            style={{
              background: activeTab === tab.id ? "rgba(184,138,60,0.12)" : "transparent",
              border: `1px solid ${activeTab === tab.id ? "rgba(184,138,60,0.25)" : "transparent"}`,
              color: activeTab === tab.id ? "#D6B47E" : "#6B7280",
            }}>
            <i className={`${tab.icon} text-xs`} />
            {tab.label}
            {"badge" in tab && tab.badge && (
              <span className="px-1.5 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                style={{ background: `${tab.badgeColor}20`, color: tab.badgeColor, fontSize: "9px" }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">

        {/* ── EVENTS TAB ── */}
        {activeTab === "events" && !activeEvent && (
          <>
            <div className="mb-8">
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "اختر نوع الحدث" : "Select Event Type"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "4 أنواع أحداث — تغذية وزارة العمل + إدخال أصحاب العمل" : "4 event types — Ministry of Labour feed + employer submissions"}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {EVENT_CARDS.map((card) => (
                <button key={card.id} type="button" onClick={() => setActiveEvent(card.id)}
                  className="group relative rounded-2xl border p-6 text-left cursor-pointer transition-all duration-300 flex flex-col gap-4"
                  style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = card.borderColor; el.style.background = card.bgColor; el.style.boxShadow = `0 0 30px ${card.color}18`; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "rgba(184,138,60,0.12)"; el.style.background = "rgba(10,37,64,0.8)"; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}>
                  {card.badge && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                      style={{ background: `${card.badgeColor}20`, color: card.badgeColor, border: `1px solid ${card.badgeColor}40`, fontSize: "9px" }}>
                      {card.badge}
                    </div>
                  )}
                  <div className="w-14 h-14 flex items-center justify-center rounded-2xl" style={{ background: card.bgColor, border: `1px solid ${card.borderColor}` }}>
                    <i className={`${card.icon} text-2xl`} style={{ color: card.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-white font-bold text-base">{isAr ? card.labelAr : card.label}</h3>
                      <i className="ri-arrow-right-up-line text-gray-600 group-hover:text-gold-400 transition-colors flex-shrink-0 mt-0.5" />
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{isAr ? card.descAr : card.desc}</p>
                  </div>
                  <div className="self-start px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                    style={{ background: `${card.color}15`, color: card.color, border: `1px solid ${card.color}30` }}>
                    {card.code}
                  </div>
                </button>
              ))}
            </div>

            {/* Ministry feed note */}
            <div className="rounded-2xl border p-5" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
                  <i className="ri-government-line text-gold-400 text-sm" />
                </div>
                <h3 className="text-white font-bold text-sm">{isAr ? "مصادر البيانات" : "Data Sources"}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: "ri-government-line", color: "#D6B47E", title: isAr ? "وزارة العمل" : "Ministry of Labour", desc: isAr ? "تغذية API لإصدار/تجديد/إلغاء تصاريح العمل" : "API feed for work permit issuance/renewal/cancellation" },
                  { icon: "ri-building-line", color: "#4ADE80", title: isAr ? "أصحاب العمل المسجّلون" : "Registered Employers", desc: isAr ? "أحداث تأهيل/إنهاء الموظفين عبر بوابة Al-Ameen أو API" : "Employee onboarding/termination events via Al-Ameen Portal or API" },
                ].map((src) => (
                  <div key={src.title} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${src.color}12`, border: `1px solid ${src.color}20` }}>
                      <i className={`${src.icon} text-sm`} style={{ color: src.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-white text-xs font-bold">{src.title}</p>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      </div>
                      <p className="text-gray-500 text-xs">{src.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Active form */}
        {activeTab === "events" && activeEvent && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: activeCard?.bgColor, border: `1px solid ${activeCard?.borderColor}` }}>
                <i className={`${activeCard?.icon} text-lg`} style={{ color: activeCard?.color }} />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">{isAr ? activeCard?.labelAr : activeCard?.label}</h1>
                <p className="text-gray-500 text-xs">{isAr ? activeCard?.descAr : activeCard?.desc}</p>
              </div>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.1)" }}>
              {EVENT_CARDS.map((card) => (
                <button key={card.id} type="button" onClick={() => setActiveEvent(card.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex-shrink-0"
                  style={{
                    background: activeEvent === card.id ? card.bgColor : "transparent",
                    border: `1px solid ${activeEvent === card.id ? card.borderColor : "transparent"}`,
                    color: activeEvent === card.id ? card.color : "#6B7280",
                  }}>
                  <i className={`${card.icon} text-xs`} />
                  {isAr ? card.labelAr : card.label}
                </button>
              ))}
            </div>

            {activeEvent === "permit-issued"   && <WorkPermitForm    isAr={isAr} onCancel={() => setActiveEvent(null)} />}
            {activeEvent === "employer-change" && <EmployerChangeForm isAr={isAr} onCancel={() => setActiveEvent(null)} />}
            {activeEvent === "renewal"         && <PermitRenewalForm  isAr={isAr} onCancel={() => setActiveEvent(null)} />}
            {activeEvent === "termination"     && <TerminationForm    isAr={isAr} onCancel={() => setActiveEvent(null)} />}
          </>
        )}

        {/* ── INTELLIGENCE TAB ── */}
        {activeTab === "intelligence" && (
          <>
            <div className="mb-6">
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "الذكاء الوظيفي" : "Employment Intelligence"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "مراقبة التغيب · تركيز القطاعات · الموظفون الوهميون · امتثال أصحاب العمل" : "Absconding monitor · Sector concentration · Ghost employees · Employer compliance"}</p>
            </div>
            <EmploymentIntelligence isAr={isAr} />
          </>
        )}
      </main>
    </div>
  );
};

export default EmploymentRegistryPage;
