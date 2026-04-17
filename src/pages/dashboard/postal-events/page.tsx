import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import POBoxRegistrationForm from "./POBoxRegistrationForm";
import PackageReceiptForm from "./PackageReceiptForm";

type EventType = "pobox" | "package" | null;

interface EventCard {
  id: "pobox" | "package";
  icon: string;
  label: string;
  labelAr: string;
  desc: string;
  descAr: string;
  color: string;
  code: string;
  stats: string;
  statsAr: string;
}

const EVENT_CARDS: EventCard[] = [
  {
    id: "pobox", icon: "ri-mail-line", label: "PO Box Registration", labelAr: "تسجيل صندوق بريد",
    desc: "Register a new PO Box — box number, size, duration, account holder travel document and personal details",
    descAr: "تسجيل صندوق بريد جديد — رقم الصندوق، الحجم، المدة، وثيقة السفر والبيانات الشخصية",
    color: "#22D3EE", code: "AMN-PST-POBOX", stats: "1,284 active boxes", statsAr: "1,284 صندوق نشط",
  },
  {
    id: "package", icon: "ri-box-3-line", label: "Package Receipt", labelAr: "استلام طرد",
    desc: "Record incoming package — tracking number, origin country, contents category, declared value, weight, customs reference",
    descAr: "تسجيل طرد وارد — رقم التتبع، بلد المنشأ، فئة المحتويات، القيمة المُعلنة، الوزن، مرجع الجمارك",
    color: "#4ADE80", code: "AMN-PST-PKG", stats: "342 packages today", statsAr: "342 طرد اليوم",
  },
];

const PostalEventsPage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeEvent, setActiveEvent] = useState<EventType>(null);
  const [formKey, setFormKey] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const activeCard = EVENT_CARDS.find(c => c.id === activeEvent);

  const handleSelect = (id: "pobox" | "package") => { setActiveEvent(id); setFormKey(k => k + 1); };

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#060D1A" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b" style={{ background: "rgba(6,13,26,0.95)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; }}>
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />{isAr ? "لوحة التحكم" : "Dashboard"}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
              <i className="ri-mail-send-line text-cyan-400 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{isAr ? "أحداث البريد" : "Postal Events"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(34,211,238,0.12)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}>AMEEN</span>
              </div>
              <p className="text-gray-500 text-xs">{isAr ? "تسجيل صناديق البريد والطرود الواردة" : "PO Box registration & incoming package tracking"}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.12)" }}>
            <i className="ri-time-line text-cyan-400 text-xs" />
            <span className="text-cyan-400 text-xs font-bold font-['JetBrains_Mono']">{timeStr}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">LIVE</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Page title */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "أحداث البريد" : "Postal Events"}</h1>
            <p className="text-gray-400 text-sm">{isAr ? "تسجيل صناديق البريد والطرود الواردة — مرتبط بقاعدة بيانات AMEEN" : "Register PO boxes and incoming packages — linked to AMEEN database"}</p>
          </div>
          {activeEvent && (
            <button type="button" onClick={() => setActiveEvent(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
              style={{ background: "transparent", borderColor: "rgba(34,211,238,0.2)", color: "#22D3EE" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,211,238,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
              <i className="ri-arrow-left-line" />{isAr ? "العودة" : "Back"}
            </button>
          )}
        </div>

        {/* Event selector */}
        {!activeEvent && (
          <>
            {/* Stats bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: isAr ? "صناديق نشطة" : "Active PO Boxes", value: "1,284", icon: "ri-mail-line", color: "#22D3EE" },
                { label: isAr ? "طرود اليوم" : "Packages Today", value: "342", icon: "ri-box-3-line", color: "#4ADE80" },
                { label: isAr ? "قيد الجمارك" : "Customs Pending", value: "18", icon: "ri-shield-check-line", color: "#FACC15" },
                { label: isAr ? "قيمة عالية" : "High-Value Pkgs", value: "7", icon: "ri-money-dollar-circle-line", color: "#F87171" },
              ].map((stat) => (
                <div key={stat.label} className="relative rounded-2xl border p-5 overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", borderColor: `${stat.color}25`, backdropFilter: "blur(12px)" }}>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {EVENT_CARDS.map(card => (
                <button key={card.id} type="button" onClick={() => handleSelect(card.id)}
                  className="group relative rounded-2xl border p-7 text-left cursor-pointer transition-all duration-300 flex flex-col gap-5"
                  style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = `${card.color}50`; el.style.background = `${card.color}08`; el.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "rgba(34,211,238,0.12)"; el.style.background = "rgba(10,22,40,0.8)"; el.style.transform = "translateY(0)"; }}>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at top left, ${card.color}06, transparent 60%)` }} />
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl" style={{ background: `${card.color}12`, border: `1px solid ${card.color}30` }}>
                      <i className={`${card.icon} text-3xl`} style={{ color: card.color }} />
                    </div>
                    <i className="ri-arrow-right-up-line text-gray-600 group-hover:text-cyan-400 transition-colors text-lg" />
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
            <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: "rgba(34,211,238,0.1)" }}>
                <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
                  <i className="ri-history-line text-cyan-400 text-sm" />
                </div>
                <h3 className="text-white font-bold text-sm">{isAr ? "الأحداث الأخيرة" : "Recent Events"}</h3>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(34,211,238,0.06)" }}>
                {[
                  { ref: "AMN-PST-4821", type: isAr ? "تسجيل صندوق بريد" : "PO Box Registration", detail: isAr ? "صندوق PO-88234 — حجم M — فرع مركزي" : "Box PO-88234 — Size M — Central Branch", time: "3 min ago", color: "#22D3EE", icon: "ri-mail-line" },
                  { ref: "AMN-PST-4820", type: isAr ? "استلام طرد" : "Package Receipt", detail: isAr ? "طرد من الإمارات — 2.3 كجم — 145.000 LCY" : "Package from UAE — 2.3 kg — 145.000 LCY", time: "11 min ago", color: "#4ADE80", icon: "ri-box-3-line" },
                  { ref: "AMN-PST-4819", type: isAr ? "استلام طرد" : "Package Receipt", detail: isAr ? "طرد من الصين — إلكترونيات — قيد الجمارك" : "Package from China — Electronics — Customs Pending", time: "28 min ago", color: "#FACC15", icon: "ri-box-3-line" },
                  { ref: "AMN-PST-4818", type: isAr ? "تسجيل صندوق بريد" : "PO Box Registration", detail: isAr ? "صندوق PO-77891 — حجم L — فرع شمالي" : "Box PO-77891 — Size L — Northern Branch", time: "45 min ago", color: "#22D3EE", icon: "ri-mail-line" },
                  { ref: "AMN-PST-4817", type: isAr ? "استلام طرد" : "Package Receipt", detail: isAr ? "طرد من المملكة المتحدة — 8,500 LCY — مراجعة مطلوبة" : "Package from UK — 8,500 LCY — Review Required", time: "1 hr ago", color: "#F87171", icon: "ri-box-3-line" },
                ].map((ev) => (
                  <div key={ev.ref} className="flex items-center gap-4 px-6 py-3 hover:bg-white/[0.02] transition-colors">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${ev.color}12`, border: `1px solid ${ev.color}20` }}>
                      <i className={`${ev.icon} text-sm`} style={{ color: ev.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white text-xs font-semibold">{ev.type}</span>
                      </div>
                      <p className="text-gray-500 text-xs truncate">{ev.detail}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-cyan-400 text-xs font-bold font-['JetBrains_Mono']">{ev.ref}</div>
                      <div className="text-gray-600 text-xs">{ev.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Active form */}
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
              {activeEvent === "pobox"   && <POBoxRegistrationForm isAr={isAr} onCancel={() => setActiveEvent(null)} />}
              {activeEvent === "package" && <PackageReceiptForm    isAr={isAr} onCancel={() => setActiveEvent(null)} />}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default PostalEventsPage;
