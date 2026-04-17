import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import CurrencyExchangeForm from "./CurrencyExchangeForm";
import AccountOpenedForm from "./AccountOpenedForm";
import WireTransferForm from "./WireTransferForm";
import LargeCashForm from "./LargeCashForm";

type EventType = "exchange" | "account" | "wire" | "cash";

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
}

const EVENT_CARDS: EventCard[] = [
  {
    id: "exchange",
    icon: "ri-exchange-dollar-line",
    label: "Currency Exchange",
    labelAr: "صرف عملة",
    desc: "Record foreign currency exchange with full customer identity and transaction details",
    descAr: "تسجيل معاملة صرف عملة أجنبية مع هوية العميل وتفاصيل المعاملة",
    color: "#22D3EE",
    bgColor: "rgba(34,211,238,0.08)",
    borderColor: "rgba(34,211,238,0.25)",
    code: "FIN_EXCHANGE",
  },
  {
    id: "account",
    icon: "ri-bank-line",
    label: "Account Opened",
    labelAr: "فتح حساب",
    desc: "Register new bank account opening with KYC, risk level and service configuration",
    descAr: "تسجيل فتح حساب بنكي جديد مع KYC ومستوى المخاطر وإعداد الخدمات",
    color: "#4ADE80",
    bgColor: "rgba(74,222,128,0.08)",
    borderColor: "rgba(74,222,128,0.25)",
    code: "FIN_ACCOUNT",
  },
  {
    id: "wire",
    icon: "ri-send-plane-line",
    label: "Wire Transfer",
    labelAr: "تحويل بنكي",
    desc: "Submit international wire transfer with sender, recipient and auto-flagging for high-risk",
    descAr: "إرسال تحويل بنكي دولي مع المُرسِل والمستفيد والإبلاغ التلقائي للمخاطر",
    color: "#FB923C",
    bgColor: "rgba(251,146,60,0.08)",
    borderColor: "rgba(251,146,60,0.25)",
    code: "FIN_WIRE",
    badge: "AUTO-FLAG",
  },
  {
    id: "cash",
    icon: "ri-money-cny-circle-line",
    label: "Large Cash",
    labelAr: "نقد كبير",
    desc: "Report large cash deposits or withdrawals above 5000 LCY per AML requirements",
    descAr: "الإبلاغ عن إيداعات أو سحوبات نقدية كبيرة فوق 5000 LCY وفق متطلبات AML",
    color: "#F87171",
    bgColor: "rgba(248,113,113,0.08)",
    borderColor: "rgba(248,113,113,0.25)",
    code: "FIN_CASH",
    badge: ">5000 LCY",
  },
];

const FinancialEventsPage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeEvent, setActiveEvent] = useState<EventType | null>(null);
  const activeCard = EVENT_CARDS.find((c) => c.id === activeEvent);

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#060D1A" }} dir={isAr ? "rtl" : "ltr"}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b"
        style={{ background: "rgba(6,13,26,0.95)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => (activeEvent ? setActiveEvent(null) : navigate("/dashboard?type=payment"))}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />
            {activeEvent ? (isAr ? "العودة" : "Back") : (isAr ? "لوحة التحكم" : "Dashboard")}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
              <i className="ri-bank-line text-cyan-400 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{isAr ? "أحداث الخدمات المالية" : "Financial Services Events"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(34,211,238,0.12)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}>
                  AL-AMEEN Portal
                </span>
              </div>
              <p className="text-gray-500 text-xs">{isAr ? "البنوك وبيوت الصرافة" : "Banks &amp; Exchange Houses"}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.2)" }}>
            <i className="ri-shield-check-line text-red-400 text-xs" />
            <span className="text-red-400 text-xs font-semibold font-['JetBrains_Mono']">AML/KYC Active</span>
          </div>
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
                <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
                  <i className="ri-bank-line text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-white text-2xl font-bold">{isAr ? "أحداث الخدمات المالية" : "Financial Services Events"}</h1>
                  <p className="text-gray-400 text-sm">{isAr ? "4 أنواع أحداث للبنوك وبيوت الصرافة — جميعها تُرسَل فوراً إلى AL-AMEEN" : "4 event types for banks and exchange houses — all submitted instantly to AL-AMEEN"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {EVENT_CARDS.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActiveEvent(card.id)}
                  className="group relative rounded-2xl border p-6 text-left cursor-pointer transition-all duration-300 flex flex-col gap-4"
                  style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = card.borderColor;
                    el.style.background = card.bgColor;
                    el.style.boxShadow = `0 0 30px ${card.color}18`;
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = "rgba(34,211,238,0.12)";
                    el.style.background = "rgba(10,22,40,0.8)";
                    el.style.boxShadow = "none";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  {card.badge && (
                    <div
                      className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                      style={{ background: `${card.color}20`, color: card.color, border: `1px solid ${card.color}40` }}
                    >
                      {card.badge}
                    </div>
                  )}
                  <div className="w-14 h-14 flex items-center justify-center rounded-2xl" style={{ background: card.bgColor, border: `1px solid ${card.borderColor}` }}>
                    <i className={`${card.icon} text-2xl`} style={{ color: card.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-white font-bold text-base">{isAr ? card.labelAr : card.label}</h3>
                      <i className="ri-arrow-right-up-line text-gray-600 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-0.5" />
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

            <div className="flex items-start gap-3 px-5 py-4 rounded-xl border" style={{ background: "rgba(248,113,113,0.04)", borderColor: "rgba(248,113,113,0.15)" }}>
              <i className="ri-shield-check-line text-red-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-gray-400 text-sm font-['Inter']">
                {isAr
                  ? "جميع المعاملات المالية تخضع لمتطلبات AML/KYC. التحويلات فوق 1000 LCY والمعاملات النقدية فوق 5000 LCY تُبلَّغ تلقائياً إلى AL-AMEEN."
                  : "All financial transactions are subject to AML/KYC requirements. Transfers above 1000 LCY and cash transactions above 5000 LCY are auto-reported to AL-AMEEN."}
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

            <div className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.1)" }}>
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

            {activeEvent === "exchange" && <CurrencyExchangeForm isAr={isAr} onCancel={() => setActiveEvent(null)} />}
            {activeEvent === "account"  && <AccountOpenedForm   isAr={isAr} onCancel={() => setActiveEvent(null)} />}
            {activeEvent === "wire"     && <WireTransferForm    isAr={isAr} onCancel={() => setActiveEvent(null)} />}
            {activeEvent === "cash"     && <LargeCashForm       isAr={isAr} onCancel={() => setActiveEvent(null)} />}
          </>
        )}
      </main>
    </div>
  );
};

export default FinancialEventsPage;
