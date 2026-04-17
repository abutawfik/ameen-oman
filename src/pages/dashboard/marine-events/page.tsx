import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import BoatRentalForm from "./BoatRentalForm";
import MarinaDockingForm from "./MarinaDockingForm";
import DivingRegistrationForm from "./DivingRegistrationForm";

type EventType = "boat" | "docking" | "diving";
const EVENT_CARDS = [
  { id: "boat" as EventType, icon: "ri-ship-line", label: "Boat Rental", labelAr: "تأجير قارب", desc: "Register boat rental with marine license, vessel details, passengers and GPS tracker", descAr: "تسجيل تأجير قارب مع رخصة الملاحة وبيانات السفينة والركاب وتتبع GPS", color: "#D6B47E", code: "MAR_BOAT" },
  { id: "docking" as EventType, icon: "ri-anchor-line", label: "Marina Docking", labelAr: "رسو في الميناء", desc: "Record vessel arrival, departure, last/next port and full crew manifest", descAr: "تسجيل وصول السفينة والمغادرة وآخر/التالي ميناء وقائمة الطاقم الكاملة", color: "#4ADE80", code: "MAR_DOCKING" },
  { id: "diving" as EventType, icon: "ri-water-flash-line", label: "Diving Registration", labelAr: "تسجيل غوص", desc: "Register dive with certification level, site GPS, max depth and buddy details", descAr: "تسجيل الغوص مع مستوى الشهادة وإحداثيات الموقع وأقصى عمق وبيانات الرفيق", color: "#C98A1B", code: "MAR_DIVING" },
];

const MarineEventsPage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeEvent, setActiveEvent] = useState<EventType | null>(null);
  const [formKey, setFormKey] = useState(0);
  const activeCard = EVENT_CARDS.find(c => c.id === activeEvent);
  const handleSwitch = (id: EventType) => { setActiveEvent(id); setFormKey(k => k + 1); };

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#051428" }} dir={isAr ? "rtl" : "ltr"}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(184,138,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b" style={{ background: "rgba(5,20,40,0.95)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => activeEvent ? setActiveEvent(null) : navigate("/dashboard")} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap" style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; }}>
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />{activeEvent ? (isAr ? "العودة" : "Back") : (isAr ? "لوحة التحكم" : "Dashboard")}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}><i className="ri-anchor-line text-gold-400 text-sm" /></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{isAr ? "أحداث البحرية" : "Marine Events"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(184,138,60,0.12)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.2)" }}>Al-Ameen Portal</span>
              </div>
              <p className="text-gray-500 text-xs">{isAr ? "الموانئ والقوارب والغوص" : "Marinas, Boats & Diving"}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /><span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">LIVE</span></div>
          {activeCard && <div className="hidden sm:block px-3 py-1.5 rounded-lg border text-xs font-bold font-['JetBrains_Mono']" style={{ background: `${activeCard.color}10`, borderColor: `${activeCard.color}30`, color: activeCard.color }}>{activeCard.code}</div>}
        </div>
      </header>
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {!activeEvent && (<>
          <div className="mb-8"><h1 className="text-white text-2xl font-bold mb-1">{isAr ? "أحداث البحرية" : "Marine Events"}</h1><p className="text-gray-400 text-sm">{isAr ? "3 أنواع أحداث — تُرسَل فوراً إلى منصة Al-Ameen" : "3 event types — submitted instantly to Al-Ameen platform"}</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {EVENT_CARDS.map(card => (
              <button key={card.id} type="button" onClick={() => handleSwitch(card.id)} className="group relative rounded-2xl border p-6 text-left cursor-pointer transition-all duration-300 flex flex-col gap-4" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }} onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = `${card.color}50`; el.style.background = `${card.color}08`; el.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "rgba(184,138,60,0.12)"; el.style.background = "rgba(10,37,64,0.8)"; el.style.transform = "translateY(0)"; }}>
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl" style={{ background: `${card.color}12`, border: `1px solid ${card.color}30` }}><i className={`${card.icon} text-2xl`} style={{ color: card.color }} /></div>
                <div className="flex-1"><div className="flex items-start justify-between gap-2 mb-1"><h3 className="text-white font-bold text-base">{isAr ? card.labelAr : card.label}</h3><i className="ri-arrow-right-up-line text-gray-600 group-hover:text-gold-400 transition-colors flex-shrink-0 mt-0.5" /></div><p className="text-gray-500 text-xs leading-relaxed">{isAr ? card.descAr : card.desc}</p></div>
                <div className="self-start px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']" style={{ background: `${card.color}15`, color: card.color, border: `1px solid ${card.color}30` }}>{card.code}</div>
              </button>
            ))}
          </div>
        </>)}
        {activeEvent && (<>
          <div className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.1)" }}>
            {EVENT_CARDS.map(card => (<button key={card.id} type="button" onClick={() => handleSwitch(card.id)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex-shrink-0" style={{ background: activeEvent === card.id ? `${card.color}12` : "transparent", border: `1px solid ${activeEvent === card.id ? `${card.color}30` : "transparent"}`, color: activeEvent === card.id ? card.color : "#6B7280" }}><i className={`${card.icon} text-xs`} />{isAr ? card.labelAr : card.label}</button>))}
          </div>
          <div key={formKey}>
            {activeEvent === "boat"    && <BoatRentalForm          isAr={isAr} onCancel={() => setActiveEvent(null)} />}
            {activeEvent === "docking" && <MarinaDockingForm        isAr={isAr} onCancel={() => setActiveEvent(null)} />}
            {activeEvent === "diving"  && <DivingRegistrationForm   isAr={isAr} onCancel={() => setActiveEvent(null)} />}
          </div>
        </>)}
      </main>
    </div>
  );
};
export default MarineEventsPage;
