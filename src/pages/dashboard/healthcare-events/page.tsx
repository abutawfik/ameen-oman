import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import PatientRegistrationForm from "./PatientRegistrationForm";
import EmergencyVisitForm from "./EmergencyVisitForm";
import PharmacyPrescriptionForm from "./PharmacyPrescriptionForm";

type EventType = "patient" | "emergency" | "prescription";

const EVENT_CARDS = [
  { id: "patient" as EventType, icon: "ri-clipboard-line", label: "Patient Registration", labelAr: "تسجيل مريض", desc: "Register new patient with identity, insurance and emergency contact details", descAr: "تسجيل مريض جديد مع الهوية والتأمين وجهة الاتصال الطارئة", color: "#F87171", code: "HLT_PATIENT" },
  { id: "emergency" as EventType, icon: "ri-heart-pulse-line", label: "Emergency Visit", labelAr: "زيارة طارئة", desc: "Record emergency admission with triage level, arrival mode and discharge status", descAr: "تسجيل دخول طارئ مع مستوى الفرز وطريقة الوصول وحالة الخروج", color: "#FB923C", code: "HLT_EMERGENCY" },
  { id: "prescription" as EventType, icon: "ri-capsule-line", label: "Pharmacy Prescription", labelAr: "وصفة طبية", desc: "Register prescription dispensing with doctor license and medication category", descAr: "تسجيل صرف وصفة طبية مع رخصة الطبيب وفئة الدواء", color: "#4ADE80", code: "HLT_PRESCRIPTION" },
];

const HealthcareEventsPage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeEvent, setActiveEvent] = useState<EventType | null>(null);
  const [formKey, setFormKey] = useState(0);
  const activeCard = EVENT_CARDS.find(c => c.id === activeEvent);

  const handleSwitch = (id: EventType) => { setActiveEvent(id); setFormKey(k => k + 1); };

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#0B1220" }} dir={isAr ? "rtl" : "ltr"}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(181,142,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b" style={{ background: "rgba(11,18,32,0.95)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => activeEvent ? setActiveEvent(null) : navigate("/dashboard")} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors" style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; }}>
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />{activeEvent ? (isAr ? "العودة" : "Back") : (isAr ? "لوحة التحكم" : "Dashboard")}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
              <i className="ri-hospital-line text-red-400 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{isAr ? "أحداث الرعاية الصحية" : "Healthcare Events"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(181,142,60,0.12)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}>AL-AMEEN Portal</span>
              </div>
              <p className="text-gray-500 text-xs">{isAr ? "المنشآت الصحية والصيدليات" : "Health Facilities & Pharmacies"}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">LIVE</span>
          </div>
          {activeCard && <div className="hidden sm:block px-3 py-1.5 rounded-lg border text-xs font-bold font-['JetBrains_Mono']" style={{ background: `${activeCard.color}10`, borderColor: `${activeCard.color}30`, color: activeCard.color }}>{activeCard.code}</div>}
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {!activeEvent && (
          <>
            <div className="mb-8">
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "أحداث الرعاية الصحية" : "Healthcare Events"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "3 أنواع أحداث — تُرسَل فوراً إلى منصة AL-AMEEN" : "3 event types — submitted instantly to AL-AMEEN platform"}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              {EVENT_CARDS.map(card => (
                <button key={card.id} type="button" onClick={() => handleSwitch(card.id)}
                  className="group relative rounded-2xl border p-6 text-left cursor-pointer transition-all duration-300 flex flex-col gap-4"
                  style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = `${card.color}50`; el.style.background = `${card.color}08`; el.style.boxShadow = `0 0 30px ${card.color}18`; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "rgba(181,142,60,0.12)"; el.style.background = "rgba(20,29,46,0.8)"; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
                >
                  <div className="w-14 h-14 flex items-center justify-center rounded-2xl" style={{ background: `${card.color}12`, border: `1px solid ${card.color}30` }}>
                    <i className={`${card.icon} text-2xl`} style={{ color: card.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-white font-bold text-base">{isAr ? card.labelAr : card.label}</h3>
                      <i className="ri-arrow-right-up-line text-gray-600 group-hover:text-gold-400 transition-colors flex-shrink-0 mt-0.5" />
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{isAr ? card.descAr : card.desc}</p>
                  </div>
                  <div className="self-start px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']" style={{ background: `${card.color}15`, color: card.color, border: `1px solid ${card.color}30` }}>{card.code}</div>
                </button>
              ))}
            </div>
            <div className="flex items-start gap-3 px-5 py-4 rounded-xl border" style={{ background: "rgba(181,142,60,0.04)", borderColor: "rgba(181,142,60,0.15)" }}>
              <i className="ri-information-line text-gold-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-gray-400 text-sm">{isAr ? "جميع أحداث الرعاية الصحية تُرسَل فوراً إلى AL-AMEEN. الأدوية المضبوطة والمخدرة تتطلب موافقة إضافية." : "All healthcare events are submitted instantly to AL-AMEEN. Controlled and narcotic medications require additional approval."}</p>
            </div>
          </>
        )}

        {activeEvent && (
          <>
            <div className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.1)" }}>
              {EVENT_CARDS.map(card => (
                <button key={card.id} type="button" onClick={() => handleSwitch(card.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex-shrink-0"
                  style={{ background: activeEvent === card.id ? `${card.color}12` : "transparent", border: `1px solid ${activeEvent === card.id ? `${card.color}30` : "transparent"}`, color: activeEvent === card.id ? card.color : "#6B7280" }}
                >
                  <i className={`${card.icon} text-xs`} />{isAr ? card.labelAr : card.label}
                </button>
              ))}
            </div>
            <div key={formKey}>
              {activeEvent === "patient"      && <PatientRegistrationForm  isAr={isAr} onCancel={() => setActiveEvent(null)} />}
              {activeEvent === "emergency"    && <EmergencyVisitForm       isAr={isAr} onCancel={() => setActiveEvent(null)} />}
              {activeEvent === "prescription" && <PharmacyPrescriptionForm isAr={isAr} onCancel={() => setActiveEvent(null)} />}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default HealthcareEventsPage;
