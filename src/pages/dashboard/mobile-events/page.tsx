import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import SimPurchaseForm from "./SimPurchaseForm";
import SimActivatedForm from "./SimActivatedForm";
import SimDeactivatedForm from "./SimDeactivatedForm";
import SimClosedForm from "./SimClosedForm";
import EsimActivatedForm from "./EsimActivatedForm";
import RoamingServiceForm from "./RoamingServiceForm";

type EventType = "sim-purchase" | "sim-activated" | "sim-deactivated" | "sim-closed" | "esim-activated" | "roaming";

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
    id: "sim-purchase",
    icon: "ri-sim-card-line",
    label: "SIM Purchase",
    labelAr: "شراء شريحة SIM",
    desc: "Register new SIM sale with full subscriber, document and device details",
    descAr: "تسجيل بيع شريحة جديدة مع بيانات المشترك والوثائق والجهاز",
    color: "#D4A84B",
    bgColor: "rgba(181,142,60,0.08)",
    borderColor: "rgba(181,142,60,0.25)",
    code: "MOB_SIM_PURCHASE",
  },
  {
    id: "sim-activated",
    icon: "ri-checkbox-circle-line",
    label: "SIM Activated",
    labelAr: "تفعيل شريحة SIM",
    desc: "Record SIM activation with timestamp, activator and first usage data",
    descAr: "تسجيل تفعيل الشريحة مع الطابع الزمني وبيانات الاستخدام الأول",
    color: "#4ADE80",
    bgColor: "rgba(74,222,128,0.08)",
    borderColor: "rgba(74,222,128,0.25)",
    code: "MOB_SIM_ACTIVATED",
  },
  {
    id: "sim-deactivated",
    icon: "ri-pause-circle-line",
    label: "SIM Deactivated",
    labelAr: "إيقاف شريحة SIM",
    desc: "Deactivate SIM with reason, type (temp/permanent) and reactivation eligibility",
    descAr: "إيقاف الشريحة مع السبب والنوع وإمكانية إعادة التفعيل",
    color: "#FACC15",
    bgColor: "rgba(250,204,21,0.08)",
    borderColor: "rgba(250,204,21,0.25)",
    code: "MOB_SIM_DEACTIVATED",
  },
  {
    id: "sim-closed",
    icon: "ri-close-circle-line",
    label: "SIM Closed",
    labelAr: "إغلاق شريحة SIM",
    desc: "Permanently close SIM with final balance, number recycling and porting options",
    descAr: "إغلاق الشريحة نهائياً مع الرصيد وإعادة تدوير الرقم وخيارات النقل",
    color: "#F87171",
    bgColor: "rgba(248,113,113,0.08)",
    borderColor: "rgba(248,113,113,0.25)",
    code: "MOB_SIM_CLOSED",
    badge: "FINAL",
    badgeColor: "#F87171",
  },
  {
    id: "esim-activated",
    icon: "ri-phone-line",
    label: "eSIM Activated",
    labelAr: "تفعيل eSIM",
    desc: "Activate eSIM profile with IMEI, Profile ID, QR reference and device model",
    descAr: "تفعيل ملف eSIM مع IMEI ومعرّف الملف ومرجع QR وموديل الجهاز",
    color: "#A78BFA",
    bgColor: "rgba(167,139,250,0.08)",
    borderColor: "rgba(167,139,250,0.25)",
    code: "MOB_ESIM_ACTIVATED",
  },
  {
    id: "roaming",
    icon: "ri-global-line",
    label: "Roaming Service",
    labelAr: "خدمة التجوال",
    desc: "Activate international roaming with destination countries, package and duration",
    descAr: "تفعيل التجوال الدولي مع الدول المقصودة والباقة والمدة",
    color: "#FB923C",
    bgColor: "rgba(251,146,60,0.08)",
    borderColor: "rgba(251,146,60,0.25)",
    code: "MOB_ROAMING",
  },
];

const MobileEventsPage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeEvent, setActiveEvent] = useState<EventType | null>(null);

  const activeCard = EVENT_CARDS.find((c) => c.id === activeEvent);

  const handleCancel = () => setActiveEvent(null);

  return (
    <div
      className="min-h-screen font-['Inter']"
      style={{ background: "#0B1220" }}
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(181,142,60,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(181,142,60,0.03) 1px, transparent 1px)
          `,
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
            onClick={() => activeEvent ? setActiveEvent(null) : navigate("/dashboard?type=mobile")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />
            {activeEvent ? (isAr ? "العودة للأحداث" : "Back to Events") : (isAr ? "لوحة التحكم" : "Dashboard")}
          </button>

          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}
            >
              <i className="ri-sim-card-2-line text-gold-400 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">
                  {isAr ? "أحداث المشغّل" : "Mobile Operator Events"}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(181,142,60,0.12)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}
                >
                  Al-Ameen Portal
                </span>
              </div>
              <p className="text-gray-500 text-xs">
                {isAr ? "شركة الاتصالات العُمانية — مسقط" : "Oman Telecommunications Co. — Muscat"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* CRM dedup note */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
            style={{ background: "rgba(250,204,21,0.06)", borderColor: "rgba(250,204,21,0.2)" }}
          >
            <i className="ri-git-merge-line text-yellow-400 text-xs" />
            <span className="text-yellow-400 text-xs font-semibold font-['JetBrains_Mono']">
              {isAr ? "إزالة التكرار نشطة" : "Dedup Active"}
            </span>
          </div>

          {/* Live status */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
            style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">LIVE</span>
          </div>

          {/* Active event code */}
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
        {/* Event Selection */}
        {!activeEvent && (
          <>
            <div className="mb-8">
              <h1 className="text-white text-2xl font-bold mb-1">
                {isAr ? "اختر نوع الحدث" : "Select Event Type"}
              </h1>
              <p className="text-gray-400 text-sm">
                {isAr
                  ? "6 أنواع أحداث لمشغّلي الاتصالات — جميعها تُرسَل فوراً إلى منصة Al-Ameen"
                  : "6 event types for mobile operators — all submitted instantly to the Al-Ameen platform"}
              </p>
            </div>

            {/* 3x2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {EVENT_CARDS.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActiveEvent(card.id)}
                  className="group relative rounded-2xl border p-6 text-left cursor-pointer transition-all duration-300 flex flex-col gap-4"
                  style={{
                    background: "rgba(20,29,46,0.8)",
                    borderColor: "rgba(181,142,60,0.12)",
                    backdropFilter: "blur(12px)",
                  }}
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
                  {/* FINAL badge */}
                  {card.badge && (
                    <div
                      className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                      style={{ background: `${card.badgeColor}20`, color: card.badgeColor, border: `1px solid ${card.badgeColor}40` }}
                    >
                      {card.badge}
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className="w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300"
                    style={{ background: card.bgColor, border: `1px solid ${card.borderColor}` }}
                  >
                    <i className={`${card.icon} text-2xl`} style={{ color: card.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-white font-bold text-base leading-tight">
                        {isAr ? card.labelAr : card.label}
                      </h3>
                      <i className="ri-arrow-right-up-line text-gray-600 group-hover:text-gold-400 transition-colors flex-shrink-0 mt-0.5" />
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {isAr ? card.descAr : card.desc}
                    </p>
                  </div>

                  {/* Code badge */}
                  <div
                    className="self-start px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                    style={{ background: `${card.color}15`, color: card.color, border: `1px solid ${card.color}30` }}
                  >
                    {card.code}
                  </div>
                </button>
              ))}
            </div>

            {/* CRM dedup note */}
            <div
              className="flex items-start gap-3 px-5 py-4 rounded-xl border"
              style={{ background: "rgba(250,204,21,0.04)", borderColor: "rgba(250,204,21,0.15)" }}
            >
              <i className="ri-git-merge-line text-yellow-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-gray-400 text-sm font-['Inter']">
                {isAr
                  ? "ملاحظة: مشغّلو الاتصالات الذين لديهم أنظمة CRM متعددة (مثل عُمانتل، أوريدو) يرسلون البيانات عبر API. تقوم منصة Al-Ameen بإزالة التكرار تلقائياً لكل مشغّل."
                  : "Note: Mobile operators with multiple CRMs (e.g., Omantel, Ooredoo) each push via API. Al-Ameen automatically deduplicates per operator."}
              </p>
            </div>
          </>
        )}

        {/* Active Form */}
        {activeEvent && (
          <>
            {/* Form header */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-xl"
                style={{ background: activeCard?.bgColor, border: `1px solid ${activeCard?.borderColor}` }}
              >
                <i className={`${activeCard?.icon} text-lg`} style={{ color: activeCard?.color }} />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">
                  {isAr ? activeCard?.labelAr : activeCard?.label}
                </h1>
                <p className="text-gray-500 text-xs">
                  {isAr ? activeCard?.descAr : activeCard?.desc}
                </p>
              </div>
            </div>

            {/* Tab switcher */}
            <div
              className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto"
              style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.1)" }}
            >
              {EVENT_CARDS.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActiveEvent(card.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex-shrink-0"
                  style={{
                    background: activeEvent === card.id ? card.bgColor : "transparent",
                    border: `1px solid ${activeEvent === card.id ? card.borderColor : "transparent"}`,
                    color: activeEvent === card.id ? card.color : "#6B7280",
                  }}
                >
                  <i className={`${card.icon} text-xs`} />
                  {isAr ? card.labelAr : card.label}
                </button>
              ))}
            </div>

            {/* Form content */}
            {activeEvent === "sim-purchase"   && <SimPurchaseForm    isAr={isAr} onCancel={handleCancel} />}
            {activeEvent === "sim-activated"  && <SimActivatedForm   isAr={isAr} onCancel={handleCancel} />}
            {activeEvent === "sim-deactivated"&& <SimDeactivatedForm isAr={isAr} onCancel={handleCancel} />}
            {activeEvent === "sim-closed"     && <SimClosedForm      isAr={isAr} onCancel={handleCancel} />}
            {activeEvent === "esim-activated" && <EsimActivatedForm  isAr={isAr} onCancel={handleCancel} />}
            {activeEvent === "roaming"        && <RoamingServiceForm isAr={isAr} onCancel={handleCancel} />}
          </>
        )}
      </main>
    </div>
  );
};

export default MobileEventsPage;
