import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import NewConnectionForm from "./NewConnectionForm";
import ServiceTransferForm from "./ServiceTransferForm";
import DisconnectionForm from "./DisconnectionForm";
import UsageAnomalyPanel from "./UsageAnomalyPanel";

type EventType = "new-connection" | "transfer" | "disconnection" | "anomaly";

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
  systemGenerated?: boolean;
}

const EVENT_CARDS: EventCard[] = [
  {
    id: "new-connection",
    icon: "ri-plug-line",
    label: "New Connection",
    labelAr: "توصيل جديد",
    desc: "Register a new utility connection — electricity, water, internet, or bundled service",
    descAr: "تسجيل توصيل خدمة جديدة — كهرباء، مياه، إنترنت، أو مجمّع",
    color: "#D4A84B",
    bgColor: "rgba(181,142,60,0.08)",
    borderColor: "rgba(181,142,60,0.25)",
    code: "UTL_NEW_CONN",
  },
  {
    id: "transfer",
    icon: "ri-swap-line",
    label: "Service Transfer",
    labelAr: "نقل الخدمة",
    desc: "Transfer an existing utility account to a new address or occupant",
    descAr: "نقل حساب خدمة قائم إلى عنوان أو مستأجر جديد",
    color: "#4ADE80",
    bgColor: "rgba(74,222,128,0.08)",
    borderColor: "rgba(74,222,128,0.25)",
    code: "UTL_TRANSFER",
  },
  {
    id: "disconnection",
    icon: "ri-shut-down-line",
    label: "Disconnection",
    labelAr: "قطع الخدمة",
    desc: "Record a utility service disconnection with final reading and outstanding balance",
    descAr: "تسجيل قطع خدمة مرفق مع القراءة النهائية والرصيد المستحق",
    color: "#F87171",
    bgColor: "rgba(248,113,113,0.08)",
    borderColor: "rgba(248,113,113,0.25)",
    code: "UTL_DISCONN",
    badge: "IRREVERSIBLE",
    badgeColor: "#F87171",
  },
  {
    id: "anomaly",
    icon: "ri-bar-chart-grouped-line",
    label: "Usage Anomaly",
    labelAr: "شذوذ الاستهلاك",
    desc: "System-generated alerts for suspicious usage patterns and cross-stream mismatches",
    descAr: "تنبيهات مُولَّدة تلقائياً لأنماط استهلاك مشبوهة وتعارضات بين التدفقات",
    color: "#FB923C",
    bgColor: "rgba(251,146,60,0.08)",
    borderColor: "rgba(251,146,60,0.25)",
    code: "UTL_ANOMALY",
    badge: "AUTO-DETECT",
    badgeColor: "#FB923C",
    systemGenerated: true,
  },
];

const UtilityEventsPage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeEvent, setActiveEvent] = useState<EventType | null>(null);
  const activeCard = EVENT_CARDS.find((c) => c.id === activeEvent);

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#0B1220" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(181,142,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b" style={{ background: "rgba(11,18,32,0.95)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button type="button"
            onClick={() => activeEvent ? setActiveEvent(null) : navigate("/dashboard?type=utility")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />
            {activeEvent ? (isAr ? "العودة" : "Back") : (isAr ? "لوحة التحكم" : "Dashboard")}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
              <i className="ri-plug-line text-gold-400 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{isAr ? "أحداث المرافق" : "Utility Activation Events"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(181,142,60,0.12)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}>Al-Ameen Portal</span>
              </div>
              <p className="text-gray-500 text-xs">{isAr ? "الكهرباء الوطنية · المياه الوطنية · تيلكو أ · تيلكو ب" : "National Electric Co. · National Water Authority · Telco A · Telco B"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Provider status pills */}
          <div className="hidden xl:flex items-center gap-2">
            {[
              { label: "Nat.Electric", color: "#D4A84B" },
              { label: "Nat.Water", color: "#4ADE80" },
              { label: "Telco A", color: "#A78BFA" },
              { label: "Telco B", color: "#FB923C" },
            ].map((p) => (
              <div key={p.label} className="flex items-center gap-1.5 px-2 py-1 rounded-full border" style={{ background: `${p.color}08`, borderColor: `${p.color}20` }}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: p.color }} />
                <span className="text-xs font-['JetBrains_Mono']" style={{ color: p.color, fontSize: "9px" }}>{p.label}</span>
              </div>
            ))}
          </div>

          {/* Active anomalies badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(251,146,60,0.08)", borderColor: "rgba(251,146,60,0.2)" }}>
            <i className="ri-alarm-warning-line text-orange-400 text-xs" />
            <span className="text-orange-400 text-xs font-bold font-['JetBrains_Mono']">5 {isAr ? "شذوذ" : "ANOMALIES"}</span>
          </div>

          {activeCard && (
            <div className="hidden sm:block px-3 py-1.5 rounded-lg border text-xs font-bold font-['JetBrains_Mono']"
              style={{ background: activeCard.bgColor, borderColor: activeCard.borderColor, color: activeCard.color }}>
              {activeCard.code}
            </div>
          )}

        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Event selection */}
        {!activeEvent && (
          <>
            <div className="mb-8">
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "اختر نوع الحدث" : "Select Event Type"}</h1>
              <p className="text-gray-400 text-sm">
                {isAr
                  ? "4 أنواع أحداث للمرافق الحكومية — تغذية API مباشرة من نماء وهيا وعُمانتل وأوريدو"
                  : "4 event types for government utilities — real-time API feed from Nama, Haya, Omantel & Ooredoo"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {EVENT_CARDS.map((card) => (
                <button key={card.id} type="button" onClick={() => setActiveEvent(card.id)}
                  className="group relative rounded-2xl border p-6 text-left cursor-pointer transition-all duration-300 flex flex-col gap-4"
                  style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = card.borderColor; el.style.background = card.bgColor; el.style.boxShadow = `0 0 30px ${card.color}18`; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "rgba(181,142,60,0.12)"; el.style.background = "rgba(20,29,46,0.8)"; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}>

                  {card.badge && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                      style={{ background: `${card.badgeColor}20`, color: card.badgeColor, border: `1px solid ${card.badgeColor}40` }}>
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
                    {card.systemGenerated && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <i className="ri-robot-line text-orange-400 text-xs" />
                        <span className="text-orange-400 text-xs">{isAr ? "مُولَّد تلقائياً" : "System-generated"}</span>
                      </div>
                    )}
                  </div>

                  <div className="self-start px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                    style={{ background: `${card.color}15`, color: card.color, border: `1px solid ${card.color}30` }}>
                    {card.code}
                  </div>
                </button>
              ))}
            </div>

            {/* Intelligence value note */}
            <div className="rounded-2xl border p-5" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
                  <i className="ri-lightbulb-flash-line text-gold-400 text-sm" />
                </div>
                <h3 className="text-white font-bold text-sm">{isAr ? "القيمة الاستخباراتية" : "Intelligence Value"}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: "ri-map-pin-line", color: "#D4A84B", title: isAr ? "الموقع الفعلي" : "Actual Location", desc: isAr ? "توصيلات المرافق تكشف أين يعيش الشخص فعلياً — غالباً مختلف عن العنوان المسجّل" : "Utility connections reveal WHERE a person actually lives — often different from registered address" },
                  { icon: "ri-links-line", color: "#4ADE80", title: isAr ? "التحقق المتقاطع" : "Cross-Verification", desc: isAr ? "مقارنة مع بيانات إيجار البلدية وتسجيلات الفنادق للتحقق من ادعاءات الإقامة" : "Cross-reference with Municipality rental data and hotel check-ins to verify residency claims" },
                  { icon: "ri-wifi-line", color: "#A78BFA", title: isAr ? "البصمة الرقمية" : "Digital Footprint", desc: isAr ? "اتصال الإنترنت = مرساة البصمة الرقمية. يربط الشخص بعنوان رقمي ثابت" : "Internet connection = digital footprint anchor. Links person to a fixed digital address" },
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
          </>
        )}

        {/* Active form */}
        {activeEvent && (
          <>
            {/* Form header + tab switcher */}
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
            <div className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.1)" }}>
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

            {activeEvent === "new-connection" && <NewConnectionForm isAr={isAr} onCancel={() => setActiveEvent(null)} />}
            {activeEvent === "transfer"       && <ServiceTransferForm isAr={isAr} onCancel={() => setActiveEvent(null)} />}
            {activeEvent === "disconnection"  && <DisconnectionForm isAr={isAr} onCancel={() => setActiveEvent(null)} />}
            {activeEvent === "anomaly"        && <UsageAnomalyPanel isAr={isAr} onCancel={() => setActiveEvent(null)} />}
          </>
        )}
      </main>
    </div>
  );
};

export default UtilityEventsPage;
