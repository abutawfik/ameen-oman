import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import VehicleBookForm from "./VehicleBookForm";
import VehiclePickUpForm from "./VehiclePickUpForm";
import RentExtendedForm from "./RentExtendedForm";
import VehicleDropOffForm from "./VehicleDropOffForm";

type EventType = "book" | "pickup" | "extend" | "dropoff";

interface EventCard {
  id: EventType;
  icon: string;
  label: string;
  labelAr: string;
  desc: string;
  descAr: string;
  color: string;
  code: string;
}

const EVENT_CARDS: EventCard[] = [
  {
    id: "book",
    icon: "ri-car-line",
    label: "Vehicle Book",
    labelAr: "حجز مركبة",
    desc: "Register a new vehicle booking with full renter and document details",
    descAr: "تسجيل حجز مركبة جديد مع تفاصيل المستأجر والوثائق",
    color: "#22D3EE",
    code: "CAR_BOOK",
  },
  {
    id: "pickup",
    icon: "ri-key-2-line",
    label: "Vehicle Pick Up",
    labelAr: "استلام مركبة",
    desc: "Record actual pick-up with odometer, fuel level and condition photos",
    descAr: "تسجيل الاستلام الفعلي مع قراءة العداد ومستوى الوقود والصور",
    color: "#4ADE80",
    code: "CAR_PICKUP",
  },
  {
    id: "extend",
    icon: "ri-time-line",
    label: "Rent Extended",
    labelAr: "تمديد الإيجار",
    desc: "Extend rental period with new return date, reason and revised billing",
    descAr: "تمديد فترة الإيجار مع تاريخ إعادة جديد وسبب وفاتورة معدّلة",
    color: "#FACC15",
    code: "CAR_EXTEND",
  },
  {
    id: "dropoff",
    icon: "ri-parking-box-line",
    label: "Vehicle Drop Off",
    labelAr: "إعادة مركبة",
    desc: "Complete return with condition assessment, charges and final invoice",
    descAr: "إتمام الإعادة مع تقييم الحالة والرسوم والفاتورة النهائية",
    color: "#FB923C",
    code: "CAR_DROPOFF",
  },
];

const CarRentalEventsPage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeEvent, setActiveEvent] = useState<EventType | null>(null);
  const [formKey, setFormKey] = useState(0);

  const activeCard = EVENT_CARDS.find((c) => c.id === activeEvent);

  const handleCancel = () => setActiveEvent(null);
  const handleSwitchEvent = (id: EventType) => {
    setActiveEvent(id);
    setFormKey((k) => k + 1);
  };

  return (
    <div
      className="min-h-screen font-['Inter']"
      style={{ background: "#060D1A" }}
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b"
        style={{
          background: "rgba(6,13,26,0.97)",
          borderColor: "rgba(34,211,238,0.1)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => activeEvent ? setActiveEvent(null) : navigate("/dashboard?type=car-rental")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.08)", color: "#6B7280" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#6B7280";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            <i className={`${isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} text-xs`} />
            {activeEvent ? (isAr ? "العودة للأحداث" : "Back to Events") : (isAr ? "لوحة التحكم" : "Dashboard")}
          </button>

          <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.08)" }} />

          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}
            >
              <i className="ri-car-line text-cyan-400 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">
                  {isAr ? "أحداث تأجير السيارات" : "Car Rental Events"}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                  style={{ background: "rgba(34,211,238,0.1)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}
                >
                  AL-AMEEN PORTAL
                </span>
              </div>
              <p className="text-gray-600 text-xs font-['JetBrains_Mono']">
                {isAr ? "شركة تأجير السيارات — الفرع الرئيسي" : "Car Rental Co. — Main Branch"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
            style={{ background: "rgba(74,222,128,0.05)", borderColor: "rgba(74,222,128,0.18)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">LIVE</span>
          </div>

          {activeCard && (
            <div
              className="px-3 py-1.5 rounded-lg border text-xs font-bold font-['JetBrains_Mono']"
              style={{
                background: `${activeCard.color}10`,
                borderColor: `${activeCard.color}30`,
                color: activeCard.color,
              }}
            >
              {activeCard.code}
            </div>
          )}

        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-8">

        {/* ── EVENT SELECTION ── */}
        {!activeEvent && (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-1 h-6 rounded-full"
                  style={{ background: "linear-gradient(to bottom, #22D3EE, transparent)" }}
                />
                <h1 className="text-white text-2xl font-bold">
                  {isAr ? "اختر نوع الحدث" : "Select Event Type"}
                </h1>
              </div>
              <p className="text-gray-500 text-sm">
                {isAr
                  ? "اختر نوع الحدث الذي تريد تسجيله وإرساله إلى منصة الأمين"
                  : "Choose the event type to record and submit to Al-Ameen Portal"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {EVENT_CARDS.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSwitchEvent(card.id)}
                  className="group relative rounded-2xl border p-6 text-left cursor-pointer transition-all duration-300 flex flex-col gap-4"
                  style={{
                    background: "rgba(10,22,40,0.85)",
                    borderColor: "rgba(34,211,238,0.1)",
                    backdropFilter: "blur(16px)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = `${card.color}50`;
                    el.style.background = `${card.color}08`;
                    el.style.boxShadow = `0 0 32px ${card.color}12`;
                    el.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = "rgba(34,211,238,0.1)";
                    el.style.background = "rgba(10,22,40,0.85)";
                    el.style.boxShadow = "none";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-14 h-14 flex items-center justify-center rounded-2xl"
                    style={{ background: `${card.color}12`, border: `1px solid ${card.color}30` }}
                  >
                    <i className={`${card.icon} text-2xl`} style={{ color: card.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-white font-bold text-base leading-tight">
                        {isAr ? card.labelAr : card.label}
                      </h3>
                      <i className="ri-arrow-right-up-line text-gray-700 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-0.5 text-sm" />
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {isAr ? card.descAr : card.desc}
                    </p>
                  </div>

                  {/* Code badge */}
                  <div
                    className="self-start px-2.5 py-1 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                    style={{ background: `${card.color}12`, color: card.color, border: `1px solid ${card.color}25` }}
                  >
                    {card.code}
                  </div>
                </button>
              ))}
            </div>

            {/* Info note */}
            <div
              className="flex items-start gap-3 px-5 py-4 rounded-xl border"
              style={{ background: "rgba(34,211,238,0.03)", borderColor: "rgba(34,211,238,0.12)" }}
            >
              <i className="ri-information-line text-cyan-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-gray-500 text-sm">
                {isAr
                  ? "جميع الأحداث المسجّلة يتم إرسالها فوراً إلى منصة الأمين للمراجعة والمعالجة. تأكد من صحة جميع البيانات قبل الإرسال."
                  : "All recorded events are submitted instantly to Al-Ameen Portal for review and processing. Ensure all data is accurate before submission."}
              </p>
            </div>
          </>
        )}

        {/* ── ACTIVE FORM ── */}
        {activeEvent && (
          <>
            {/* Tab switcher */}
            <div
              className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto"
              style={{ background: "rgba(10,22,40,0.85)", border: "1px solid rgba(34,211,238,0.08)" }}
            >
              {EVENT_CARDS.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSwitchEvent(card.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex-shrink-0"
                  style={{
                    background: activeEvent === card.id ? `${card.color}12` : "transparent",
                    border: `1px solid ${activeEvent === card.id ? `${card.color}30` : "transparent"}`,
                    color: activeEvent === card.id ? card.color : "#4B5563",
                  }}
                >
                  <i className={`${card.icon} text-xs`} />
                  {isAr ? card.labelAr : card.label}
                </button>
              ))}
            </div>

            {/* Form content */}
            <div key={formKey}>
              {activeEvent === "book"    && <VehicleBookForm    isAr={isAr} onCancel={handleCancel} />}
              {activeEvent === "pickup"  && <VehiclePickUpForm  isAr={isAr} onCancel={handleCancel} />}
              {activeEvent === "extend"  && <RentExtendedForm   isAr={isAr} onCancel={handleCancel} />}
              {activeEvent === "dropoff" && <VehicleDropOffForm isAr={isAr} onCancel={handleCancel} />}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CarRentalEventsPage;
