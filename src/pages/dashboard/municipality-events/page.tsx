import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import StartRentalForm from "./StartRentalForm";
import RenewRentalForm from "./RenewRentalForm";
import StopRentalForm from "./StopRentalForm";

type EventType = "start" | "renew" | "stop";

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
}

const EVENT_CARDS: EventCard[] = [
  {
    id: "start",
    icon: "ri-home-heart-line",
    label: "Start Rental",
    labelAr: "بدء إيجار",
    desc: "Register a new rental agreement with full property, owner and tenant details",
    descAr: "تسجيل عقد إيجار جديد مع تفاصيل العقار والمالك والمستأجر",
    color: "#D4A84B",
    bgColor: "rgba(181,142,60,0.08)",
    borderColor: "rgba(181,142,60,0.25)",
    code: "MUN_START_RENTAL",
  },
  {
    id: "renew",
    icon: "ri-refresh-line",
    label: "Renew Rental",
    labelAr: "تجديد إيجار",
    desc: "Extend an existing rental agreement with new end date, rent and occupant changes",
    descAr: "تمديد عقد إيجار قائم مع تاريخ انتهاء جديد وإيجار وتغييرات الساكنين",
    color: "#4ADE80",
    bgColor: "rgba(74,222,128,0.08)",
    borderColor: "rgba(74,222,128,0.25)",
    code: "MUN_RENEW_RENTAL",
  },
  {
    id: "stop",
    icon: "ri-home-2-line",
    label: "Stop Rental",
    labelAr: "إنهاء إيجار",
    desc: "Terminate a rental agreement with reason, forwarding address and deposit settlement",
    descAr: "إنهاء عقد إيجار مع السبب وعنوان المراسلة وتسوية التأمين",
    color: "#F87171",
    bgColor: "rgba(248,113,113,0.08)",
    borderColor: "rgba(248,113,113,0.25)",
    code: "MUN_STOP_RENTAL",
  },
];

const MunicipalityEventsPage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeEvent, setActiveEvent] = useState<EventType | null>(null);
  const activeCard = EVENT_CARDS.find((c) => c.id === activeEvent);

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#0B1220" }} dir={isAr ? "rtl" : "ltr"}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(181,142,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.03) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b"
        style={{ background: "rgba(11,18,32,0.95)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => (activeEvent ? setActiveEvent(null) : navigate("/dashboard?type=municipality"))}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />
            {activeEvent ? (isAr ? "العودة" : "Back") : (isAr ? "لوحة التحكم" : "Dashboard")}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
              <i className="ri-building-2-line text-gold-400 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{isAr ? "أحداث إيجار البلدية" : "Municipality Property Rental"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(181,142,60,0.12)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}>
                  Al-Ameen Portal
                </span>
              </div>
              <p className="text-gray-500 text-xs">{isAr ? "دائرة الإيجارات البلدية" : "Municipal Rental Registry"}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">LIVE</span>
          </div>
          {activeCard && (
            <div
              className="hidden sm:block px-3 py-1.5 rounded-lg border text-xs font-bold font-['JetBrains_Mono']"
              style={{ background: activeCard.bgColor, borderColor: activeCard.borderColor, color: activeCard.color }}
            >
              {activeCard.code}
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {!activeEvent && (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
                  <i className="ri-building-2-line text-gold-400" />
                </div>
                <div>
                  <h1 className="text-white text-2xl font-bold">{isAr ? "أحداث إيجار العقارات البلدية" : "Municipality Property Rental Events"}</h1>
                  <p className="text-gray-400 text-sm">{isAr ? "3 أنواع أحداث — تُرسَل فوراً إلى منصة Al-Ameen" : "3 event types — submitted instantly to Al-Ameen platform"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              {EVENT_CARDS.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActiveEvent(card.id)}
                  className="group relative rounded-2xl border p-6 text-left cursor-pointer transition-all duration-300 flex flex-col gap-4"
                  style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = card.borderColor;
                    el.style.background = card.bgColor;
                    el.style.boxShadow = `0 0 30px ${card.color}18`;
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = "rgba(181,142,60,0.12)";
                    el.style.background = "rgba(20,29,46,0.8)";
                    el.style.boxShadow = "none";
                    el.style.transform = "translateY(0)";
                  }}
                >
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
                  <div
                    className="self-start px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                    style={{ background: `${card.color}15`, color: card.color, border: `1px solid ${card.color}30` }}
                  >
                    {card.code}
                  </div>
                </button>
              ))}
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 px-5 py-4 rounded-xl border" style={{ background: "rgba(181,142,60,0.04)", borderColor: "rgba(181,142,60,0.15)" }}>
              <i className="ri-information-line text-gold-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-gray-400 text-sm font-['Inter']">
                {isAr
                  ? "جميع عقود الإيجار المسجلة عبر هذه المنصة تُرسَل فوراً إلى قاعدة بيانات Al-Ameen. تأكد من صحة بيانات المستأجر والمالك قبل الحفظ."
                  : "All rental agreements registered through this portal are submitted instantly to the Al-Ameen database. Verify tenant and owner details before saving."}
              </p>
            </div>
          </>
        )}

        {activeEvent && (
          <>
            <div className="flex items-center gap-3 mb-6">
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
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActiveEvent(card.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex-shrink-0"
                  style={{
                    background: activeEvent === card.id ? card.bgColor : "transparent",
                    border: `1px solid ${activeEvent === card.id ? card.borderColor : "transparent"}`,
                    color: activeEvent === card.id ? card.color : "#6B7280",
                  }}
                >
                  <i className={`${card.icon} text-xs`} />{isAr ? card.labelAr : card.label}
                </button>
              ))}
            </div>

            {activeEvent === "start" && <StartRentalForm isAr={isAr} onCancel={() => setActiveEvent(null)} />}
            {activeEvent === "renew" && <RenewRentalForm isAr={isAr} onCancel={() => setActiveEvent(null)} />}
            {activeEvent === "stop"  && <StopRentalForm  isAr={isAr} onCancel={() => setActiveEvent(null)} />}
          </>
        )}
      </main>
    </div>
  );
};

export default MunicipalityEventsPage;
