import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import CheckInForm from "./CheckInForm";
import CheckOutForm from "./CheckOutForm";
import BookingForm from "./BookingForm";
import ChangeRoomForm from "./ChangeRoomForm";
import { useAmeenFeed } from "@/services/ameenEventBus";
import type { AmeenEvent } from "@/services/ameenEventBus";

type FormType = "checkin" | "checkout" | "booking" | "changeroom";

const FORM_TABS: { key: FormType; icon: string; labelEn: string; labelAr: string; color: string; eventCode: string }[] = [
  { key: "checkin",    icon: "ri-login-box-line",    labelEn: "Check-In",    labelAr: "تسجيل دخول",  color: "#4ADE80", eventCode: "HOTEL_CHECKIN" },
  { key: "checkout",   icon: "ri-logout-box-line",   labelEn: "Check-Out",   labelAr: "تسجيل خروج",  color: "#C98A1B", eventCode: "HOTEL_CHECKOUT" },
  { key: "booking",    icon: "ri-calendar-line",     labelEn: "Booking",     labelAr: "حجز",          color: "#D6B47E", eventCode: "HOTEL_BOOKING" },
  { key: "changeroom", icon: "ri-door-line",         labelEn: "Room Change", labelAr: "تغيير غرفة",  color: "#FACC15", eventCode: "HOTEL_ROOM_CHANGE" },
];

// Colour per event type
const EVENT_COLOR: Record<string, string> = {
  HOTEL_CHECKIN:     "#4ADE80",
  HOTEL_CHECKOUT:    "#C98A1B",
  HOTEL_BOOKING:     "#D6B47E",
  HOTEL_ROOM_CHANGE: "#FACC15",
};
const EVENT_ICON: Record<string, string> = {
  HOTEL_CHECKIN:     "ri-login-box-line",
  HOTEL_CHECKOUT:    "ri-logout-box-line",
  HOTEL_BOOKING:     "ri-calendar-line",
  HOTEL_ROOM_CHANGE: "ri-door-line",
};

const DeiyafaFeedRow = ({ ev, isAr }: { ev: AmeenEvent; isAr: boolean }) => {
  const color = EVENT_COLOR[ev.eventType] ?? "#D6B47E";
  const icon  = EVENT_ICON[ev.eventType]  ?? "ri-hotel-line";
  return (
    <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b text-xs items-center"
      style={{ borderColor: "rgba(184,138,60,0.05)" }}>
      <div className="col-span-1 flex items-center justify-center">
        <div className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}44` }}>
          <i className={`${icon} text-sm`} style={{ color }} />
        </div>
      </div>
      <div className="col-span-2 font-['JetBrains_Mono'] text-gray-500">{ev.timestamp}</div>
      <div className="col-span-3 text-white font-semibold truncate">{ev.guestName ?? "—"}</div>
      <div className="col-span-2 font-['JetBrains_Mono'] text-gray-500">{ev.roomNumber ? `Rm ${ev.roomNumber}` : "—"}</div>
      <div className="col-span-2">
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest font-['JetBrains_Mono']"
          style={{ background: `${color}15`, color, border: `1px solid ${color}40` }}>
          {ev.eventType.replace("HOTEL_", "")}
        </span>
      </div>
      <div className="col-span-2 font-['JetBrains_Mono'] text-[10px] text-gray-600 truncate">{ev.ameenRef}</div>
    </div>
  );
};

const HotelEventsPage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeForm, setActiveForm] = useState<FormType>("checkin");
  const [formKey, setFormKey] = useState(0);
  const deiyafaFeed = useAmeenFeed("deiyafa");

  const handleSaved = () => {
    setFormKey((k) => k + 1);
  };

  const handleCancel = () => {
    setFormKey((k) => k + 1);
  };

  const activeTab = FORM_TABS.find((t) => t.key === activeForm)!;

  return (
    <div className="min-h-screen" style={{ background: "#051428" }}>
      {/* Grid bg */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(184,138,60,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b" style={{ background: "rgba(5,20,40,0.97)", borderColor: "rgba(184,138,60,0.15)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard?type=hotel")}
              className="flex items-center gap-2 text-gray-500 hover:text-gold-400 transition-colors cursor-pointer text-sm font-['Inter']">
              <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />
              {isAr ? "لوحة التحكم" : "Dashboard"}
            </button>
            <div className="w-px h-5 bg-white/10" />
            <img src="https://public.readdy.ai/ai/img_res/407b94a6-cd23-46f2-9c3a-b1f5c8ba9a2c.png" alt="Al-Ameen" className="w-7 h-7 object-contain" />
            <div>
              <span className="text-gold-400 font-bold text-sm font-['Inter'] tracking-widest">Al-Ameen</span>
              <span className="text-gray-600 text-xs font-['Inter'] ml-2">— {isAr ? "نماذج أحداث الفنادق" : "Hotel Event Forms"}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Entity badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: "rgba(184,138,60,0.05)", borderColor: "rgba(184,138,60,0.15)" }}>
              <i className="ri-hotel-line text-gold-400 text-xs" />
              <span className="text-gray-400 text-xs font-['Inter']">Grand Capital Hotel</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        {/* Page title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <i className="ri-hotel-line text-gold-400 text-lg" />
            <h1 className="text-white font-bold text-2xl font-['Inter']">
              {isAr ? "نماذج أحداث الفنادق" : "Hotel Event Forms"}
            </h1>
          </div>
          <p className="text-gray-500 text-sm font-['Inter']">
            {isAr
              ? "إرسال أحداث الفندق إلى منصة الأمين — للفنادق التي تمتلك نظام إدارة عقارات خاص بها"
              : "Submit hotel events to Al-Ameen Portal — for hotels with their own PMS"}
          </p>
        </div>

        {/* Form type tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FORM_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveForm(tab.key); setFormKey((k) => k + 1); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer whitespace-nowrap font-['Inter']"
              style={{
                background: activeForm === tab.key ? tab.color + "15" : "rgba(10,37,64,0.7)",
                borderColor: activeForm === tab.key ? tab.color + "60" : "rgba(255,255,255,0.08)",
                color: activeForm === tab.key ? tab.color : "#6B7280",
                boxShadow: activeForm === tab.key ? `0 0 16px ${tab.color}10` : "none",
              }}
            >
              <i className={`${tab.icon} text-base`} />
              {isAr ? tab.labelAr : tab.labelEn}
              {activeForm === tab.key && (
                <span className="text-xs font-['JetBrains_Mono'] opacity-60">{tab.eventCode}</span>
              )}
            </button>
          ))}
        </div>

        {/* Active form indicator */}
        <div className="flex items-center gap-3 mb-5 px-4 py-2.5 rounded-xl border" style={{ background: activeTab.color + "08", borderColor: activeTab.color + "25" }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: activeTab.color }} />
          <span className="text-xs font-['JetBrains_Mono']" style={{ color: activeTab.color }}>
            {activeTab.eventCode}
          </span>
          <span className="text-gray-600 text-xs font-['Inter']">
            {isAr ? "— يُرسل إلى منصة الأمين عند الحفظ" : "— Submitted to Al-Ameen Portal on save"}
          </span>
        </div>

        {/* Form content */}
        <div key={formKey}>
          {activeForm === "checkin" && (
            <CheckInForm isAr={isAr} onCancel={handleCancel} onSaved={handleSaved} />
          )}
          {activeForm === "checkout" && (
            <CheckOutForm isAr={isAr} onCancel={handleCancel} onSaved={handleSaved} />
          )}
          {activeForm === "booking" && (
            <BookingForm isAr={isAr} onCancel={handleCancel} onSaved={handleSaved} />
          )}
          {activeForm === "changeroom" && (
            <ChangeRoomForm isAr={isAr} onCancel={handleCancel} onSaved={handleSaved} />
          )}
        </div>

        {/* ── Deiyafa live feed ────────────────────────────────────────────── */}
        <div className="mt-10 rounded-xl border overflow-hidden"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "rgba(184,138,60,0.12)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#4ADE80" }} />
              <span className="text-white text-sm font-bold font-['Inter']">
                {isAr ? "التغذية المباشرة من ديافة → الأمين" : "Live feed — Deiyafa → Al-Ameen"}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold tracking-widest font-['JetBrains_Mono']"
                style={{ background: "rgba(74,222,128,0.1)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.3)" }}>
                {isAr ? "نشط" : "LIVE"}
              </span>
            </div>
            <span className="text-gray-600 text-[11px] font-['JetBrains_Mono']">
              {deiyafaFeed.length} {isAr ? "حدث مُرسل" : "events transmitted"}
            </span>
          </div>

          {deiyafaFeed.length === 0 ? (
            <div className="py-10 text-center">
              <i className="ri-upload-cloud-2-line text-3xl text-gray-700 mb-2 block" />
              <p className="text-gray-600 text-sm font-['Inter']">
                {isAr
                  ? "لا أحداث مُرسلة بعد — احفظ نموذجاً أعلاه لتظهر هنا"
                  : "No events transmitted yet — save a form above to see it appear here"}
              </p>
            </div>
          ) : (
            <>
              {/* Column headers */}
              <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-bold tracking-widest uppercase font-['JetBrains_Mono'] text-gray-600"
                style={{ borderBottom: "1px solid rgba(184,138,60,0.08)" }}>
                <div className="col-span-1" />
                <div className="col-span-2">{isAr ? "الوقت" : "Time"}</div>
                <div className="col-span-3">{isAr ? "النزيل" : "Guest"}</div>
                <div className="col-span-2">{isAr ? "الغرفة" : "Room"}</div>
                <div className="col-span-2">{isAr ? "النوع" : "Type"}</div>
                <div className="col-span-2">{isAr ? "مرجع أمين" : "AMEEN Ref"}</div>
              </div>
              {deiyafaFeed.slice(0, 20).map((ev) => (
                <DeiyafaFeedRow key={ev.id} ev={ev} isAr={isAr} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelEventsPage;
