import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import StudentEnrollmentForm from "./StudentEnrollmentForm";
import CourseRegistrationForm from "./CourseRegistrationForm";
import StudentVisaExtensionForm from "./StudentVisaExtensionForm";

type EventType = "enrollment" | "course" | "visa" | null;

const EVENT_CARDS = [
  { id: "enrollment" as const, icon: "ri-graduation-cap-line", label: "Student Enrollment", labelAr: "تسجيل طالب", desc: "Register a new student — institution, program, faculty, start/end dates, study mode, scholarship, housing", descAr: "تسجيل طالب جديد — المؤسسة، البرنامج، الكلية، التواريخ، نظام الدراسة، المنحة، السكن", color: "#A78BFA", code: "AMN-EDU-ENR", stats: "2,341 enrolled", statsAr: "2,341 مسجّل" },
  { id: "course" as const, icon: "ri-book-open-line", label: "Course Registration", labelAr: "تسجيل مقررات", desc: "Register courses for a student — student ID lookup, course selection, semester, credit hours", descAr: "تسجيل مقررات لطالب — بحث برقم الطالب، اختيار المقررات، الفصل الدراسي، الساعات المعتمدة", color: "#D6B47E", code: "AMN-EDU-CRS", stats: "8,912 courses registered", statsAr: "8,912 مقرر مسجّل" },
  { id: "visa" as const, icon: "ri-passport-line", label: "Student Visa Extension", labelAr: "تمديد تأشيرة طالب", desc: "Extend student visa — student ID, attendance %, academic standing, current visa expiry, extension duration", descAr: "تمديد تأشيرة طالب — رقم الطالب، نسبة الحضور، الوضع الأكاديمي، انتهاء التأشيرة الحالية، مدة التمديد", color: "#4ADE80", code: "AMN-EDU-VISA", stats: "891 extensions this year", statsAr: "891 تمديد هذا العام" },
];

const EducationEventsPage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeEvent, setActiveEvent] = useState<EventType>(null);
  const [formKey, setFormKey] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const timeStr = currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const activeCard = EVENT_CARDS.find(c => c.id === activeEvent);
  const handleSelect = (id: EventType) => { setActiveEvent(id); setFormKey(k => k + 1); };

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#051428" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(184,138,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b" style={{ background: "rgba(5,20,40,0.95)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate("/dashboard")} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap" style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; }}>
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />{isAr ? "لوحة التحكم" : "Dashboard"}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
              <i className="ri-graduation-cap-line text-purple-400 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{isAr ? "أحداث التعليم" : "Education Events"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(184,138,60,0.12)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.2)" }}>Al-Ameen</span>
              </div>
              <p className="text-gray-500 text-xs">{isAr ? "تسجيل الطلاب · المقررات · تمديد التأشيرة" : "Student enrollment · Courses · Visa extension"}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: "rgba(184,138,60,0.04)", borderColor: "rgba(184,138,60,0.12)" }}>
            <i className="ri-time-line text-gold-400 text-xs" />
            <span className="text-gold-400 text-xs font-bold font-['JetBrains_Mono']">{timeStr}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">LIVE</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "أحداث التعليم" : "Education Events"}</h1>
            <p className="text-gray-400 text-sm">{isAr ? "تسجيل الطلاب والمقررات وتمديد تأشيرات الطلاب" : "Student enrollment, course registration, and student visa extensions"}</p>
          </div>
          {activeEvent && (
            <button type="button" onClick={() => setActiveEvent(null)} className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap" style={{ background: "transparent", borderColor: "rgba(184,138,60,0.2)", color: "#D6B47E" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,138,60,0.06)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
              <i className="ri-arrow-left-line" />{isAr ? "العودة" : "Back"}
            </button>
          )}
        </div>

        {!activeEvent && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: isAr ? "طلاب مسجّلون" : "Enrolled Students", value: "2,341", icon: "ri-graduation-cap-line", color: "#A78BFA" },
                { label: isAr ? "مقررات مسجّلة" : "Courses Registered", value: "8,912", icon: "ri-book-open-line", color: "#D6B47E" },
                { label: isAr ? "تمديدات التأشيرة" : "Visa Extensions", value: "891", icon: "ri-passport-line", color: "#4ADE80" },
                { label: isAr ? "تنبيهات الانسحاب" : "Dropout Flags", value: "23", icon: "ri-alert-line", color: "#C94A5E" },
              ].map((stat) => (
                <div key={stat.label} className="relative rounded-2xl border p-5 overflow-hidden" style={{ background: "rgba(10,37,64,0.8)", borderColor: `${stat.color}25`, backdropFilter: "blur(12px)" }}>
                  <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at top right, ${stat.color}, transparent 70%)` }} />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                      <i className={`${stat.icon} text-base`} style={{ color: stat.color }} />
                    </div>
                    <div>
                      <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="text-gray-400 text-xs">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Event cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {EVENT_CARDS.map(card => (
                <button key={card.id} type="button" onClick={() => handleSelect(card.id)}
                  className="group relative rounded-2xl border p-7 text-left cursor-pointer transition-all duration-300 flex flex-col gap-5"
                  style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = `${card.color}50`; el.style.background = `${card.color}08`; el.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "rgba(184,138,60,0.12)"; el.style.background = "rgba(10,37,64,0.8)"; el.style.transform = "translateY(0)"; }}>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at top left, ${card.color}06, transparent 60%)` }} />
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl" style={{ background: `${card.color}12`, border: `1px solid ${card.color}30` }}>
                      <i className={`${card.icon} text-3xl`} style={{ color: card.color }} />
                    </div>
                    <i className="ri-arrow-right-up-line text-gray-600 group-hover:text-gold-400 transition-colors text-lg" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-white font-bold text-lg mb-2">{isAr ? card.labelAr : card.label}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{isAr ? card.descAr : card.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold font-['JetBrains_Mono']" style={{ background: `${card.color}15`, color: card.color, border: `1px solid ${card.color}30` }}>{card.code}</span>
                      <span className="text-gray-500 text-xs">{isAr ? card.statsAr : card.stats}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Recent events */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: "rgba(184,138,60,0.1)" }}>
                <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
                  <i className="ri-history-line text-gold-400 text-sm" />
                </div>
                <h3 className="text-white font-bold text-sm">{isAr ? "الأحداث الأخيرة" : "Recent Events"}</h3>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(184,138,60,0.06)" }}>
                {[
                  { ref: "AMN-EDU-4821", type: isAr ? "تسجيل طالب" : "Student Enrollment", detail: isAr ? "أحمد الراشدي — بكالوريوس علوم الحاسوب — الجامعة الوطنية" : "Ahmed Al-Rashidi — BSc Computer Science — National University", time: "5 min ago", color: "#A78BFA", icon: "ri-graduation-cap-line" },
                  { ref: "AMN-EDU-4820", type: isAr ? "تمديد تأشيرة" : "Visa Extension", detail: isAr ? "بريا ناير — تمديد سنة — نسبة حضور 95%" : "Priya Nair — 1 Year Extension — 95% attendance", time: "18 min ago", color: "#4ADE80", icon: "ri-passport-line" },
                  { ref: "AMN-EDU-4819", type: isAr ? "تسجيل مقررات" : "Course Registration", detail: isAr ? "STU-2025-0088 — 4 مقررات — 12 ساعة معتمدة" : "STU-2025-0088 — 4 courses — 12 credit hours", time: "34 min ago", color: "#D6B47E", icon: "ri-book-open-line" },
                  { ref: "AMN-EDU-4818", type: isAr ? "تنبيه انسحاب" : "Dropout Flag", detail: isAr ? "STU-2024-3312 — غياب 35 يوماً — قيد المراجعة" : "STU-2024-3312 — 35 days absence — Under review", time: "52 min ago", color: "#C94A5E", icon: "ri-alert-line" },
                  { ref: "AMN-EDU-4817", type: isAr ? "تسجيل طالب" : "Student Enrollment", detail: isAr ? "فاطمة الزدجالية — ماجستير إدارة الأعمال — كلية الأعمال" : "Fatima Al-Zadjali — MBA — National Business School", time: "1.1 hr ago", color: "#A78BFA", icon: "ri-graduation-cap-line" },
                ].map((ev) => (
                  <div key={ev.ref} className="flex items-center gap-4 px-6 py-3 hover:bg-white/[0.02] transition-colors">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${ev.color}12`, border: `1px solid ${ev.color}20` }}>
                      <i className={`${ev.icon} text-sm`} style={{ color: ev.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-white text-xs font-semibold">{ev.type}</span>
                      <p className="text-gray-500 text-xs truncate">{ev.detail}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-gold-400 text-xs font-bold font-['JetBrains_Mono']">{ev.ref}</div>
                      <div className="text-gray-600 text-xs">{ev.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeEvent && activeCard && (
          <>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: `${activeCard.color}12`, border: `1px solid ${activeCard.color}30` }}>
                <i className={`${activeCard.icon} text-lg`} style={{ color: activeCard.color }} />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">{isAr ? activeCard.labelAr : activeCard.label}</h2>
                <p className="text-gray-500 text-xs">{isAr ? activeCard.descAr : activeCard.desc}</p>
              </div>
            </div>
            <div key={formKey}>
              {activeEvent === "enrollment" && <StudentEnrollmentForm isAr={isAr} onCancel={() => setActiveEvent(null)} />}
              {activeEvent === "course"     && <CourseRegistrationForm isAr={isAr} onCancel={() => setActiveEvent(null)} />}
              {activeEvent === "visa"       && <StudentVisaExtensionForm isAr={isAr} onCancel={() => setActiveEvent(null)} />}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default EducationEventsPage;
