import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import CustomsLiveCounters from "./components/CustomsLiveCounters";
import ImportDeclarationForm from "./components/ImportDeclarationForm";
import ExportDeclarationForm from "./components/ExportDeclarationForm";
import TransitForm from "./components/TransitForm";
import FreeZoneForm from "./components/FreeZoneForm";
import SeizureForm from "./components/SeizureForm";
import PersonalEffectsForm from "./components/PersonalEffectsForm";
import CusConfirmation from "./components/CusConfirmation";
import CargoIntelligence from "./components/CargoIntelligence";
import CustomsBrokerRegistry from "./components/CustomsBrokerRegistry";
import CrossStreamIntelligence from "./components/CrossStreamIntelligence";

type EventType = "overview" | "import" | "export" | "transit" | "freezone" | "seizure" | "personal";
type MainTab = "declarations" | "cargo-intel" | "brokers" | "cross-stream";

const eventTypes: {
  id: EventType;
  labelEn: string;
  labelAr: string;
  icon: string;
  color: string;
  descEn: string;
  descAr: string;
}[] = [
  { id: "import", labelEn: "Import Declaration", labelAr: "إقرار الاستيراد", icon: "ri-download-2-line", color: "#22D3EE", descEn: "Goods entering the country via any port", descAr: "بضائع تدخل البلاد عبر أي منفذ" },
  { id: "export", labelEn: "Export Declaration", labelAr: "إقرار التصدير", icon: "ri-upload-2-line", color: "#4ADE80", descEn: "Goods leaving the country, including re-exports", descAr: "بضائع تغادر البلاد، بما فيها إعادة التصدير" },
  { id: "transit", labelEn: "Transit / Transshipment", labelAr: "عبور / إعادة شحن", icon: "ri-arrow-left-right-line", color: "#FACC15", descEn: "Goods passing through the country to another destination", descAr: "بضائع تعبر البلاد إلى وجهة أخرى" },
  { id: "freezone", labelEn: "Free Zone Entry / Exit", labelAr: "دخول / خروج المنطقة الحرة", icon: "ri-store-2-line", color: "#38BDF8", descEn: "Goods movement in/out of free trade zones", descAr: "حركة البضائع داخل وخارج مناطق التجارة الحرة" },
  { id: "seizure", labelEn: "Seizure / Hold", labelAr: "ضبط / حجز", icon: "ri-shield-cross-line", color: "#F87171", descEn: "Prohibited, restricted, or misdeclared goods", descAr: "بضائع محظورة أو مقيدة أو مُصرَّح عنها بشكل خاطئ" },
  { id: "personal", labelEn: "Personal Effects", labelAr: "أمتعة شخصية", icon: "ri-luggage-cart-line", color: "#A78BFA", descEn: "Accompanied or unaccompanied personal belongings", descAr: "أمتعة شخصية مصحوبة أو غير مصحوبة" },
];

const mainTabs: { id: MainTab; labelEn: string; labelAr: string; icon: string; color: string }[] = [
  { id: "declarations", labelEn: "Declarations", labelAr: "الإقرارات", icon: "ri-file-list-3-line", color: "#22D3EE" },
  { id: "cargo-intel", labelEn: "Cargo Intelligence", labelAr: "استخبارات الشحن", icon: "ri-bar-chart-2-line", color: "#FACC15" },
  { id: "brokers", labelEn: "Broker Registry", labelAr: "سجل الوسطاء", icon: "ri-user-star-line", color: "#4ADE80" },
  { id: "cross-stream", labelEn: "Cross-Stream Intel", labelAr: "استخبارات متعددة المصادر", icon: "ri-git-branch-line", color: "#FB923C" },
];

const CustomsCargoPage = () => {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [mainTab, setMainTab] = useState<MainTab>("declarations");
  const [activeEvent, setActiveEvent] = useState<EventType>("overview");
  const [confirmation, setConfirmation] = useState<{ ref: string; type: string } | null>(null);

  const handleSubmit = (ref: string) => {
    setConfirmation({ ref, type: activeEvent });
  };

  const handleReset = () => {
    setConfirmation(null);
    setActiveEvent("overview");
  };

  const renderForm = () => {
    if (confirmation) return <CusConfirmation refNumber={confirmation.ref} eventType={confirmation.type} isAr={isAr} onReset={handleReset} />;
    switch (activeEvent) {
      case "import":   return <ImportDeclarationForm isAr={isAr} onSubmit={handleSubmit} />;
      case "export":   return <ExportDeclarationForm isAr={isAr} onSubmit={handleSubmit} />;
      case "transit":  return <TransitForm isAr={isAr} onSubmit={handleSubmit} />;
      case "freezone": return <FreeZoneForm isAr={isAr} onSubmit={handleSubmit} />;
      case "seizure":  return <SeizureForm isAr={isAr} onSubmit={handleSubmit} />;
      case "personal": return <PersonalEffectsForm isAr={isAr} onSubmit={handleSubmit} />;
      default:         return null;
    }
  };

  const activeEventMeta = eventTypes.find((e) => e.id === activeEvent);

  return (
    <div className="flex flex-col h-full" style={{ background: "#060D1A", direction: isAr ? "rtl" : "ltr" }}>
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.25)" }}>
                <i className="ri-ship-line text-cyan-400 text-lg" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold font-['Inter']">{isAr ? "الجمارك والشحن" : "Customs & Cargo"}</h1>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono']">
                  {isAr ? "الدفق الرابع عشر — هيئة الجمارك الوطنية · سلطات الموانئ · المناطق الحرة" : "Stream 14 — National Customs Authority · Port Authorities · Free Trade Zones"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                { icon: "ri-government-line", label: isAr ? "هيئة الجمارك الوطنية" : "National Customs Authority", color: "#22D3EE" },
                { icon: "ri-anchor-line", label: isAr ? "سلطات الموانئ" : "Port Authorities", color: "#4ADE80" },
                { icon: "ri-store-2-line", label: isAr ? "مناطق التجارة الحرة" : "Free Trade Zones", color: "#38BDF8" },
                { icon: "ri-mail-send-line", label: isAr ? "جمارك البريد" : "Postal Customs", color: "#A78BFA" },
                { icon: "ri-shield-star-line", label: isAr ? "شرطة الجمارك" : "Police Customs HQ", color: "#FACC15" },
              ].map((src) => (
                <div key={src.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-['Inter']"
                  style={{ background: `${src.color}10`, border: `1px solid ${src.color}25`, color: src.color }}>
                  <i className={`${src.icon} text-xs`} />{src.label}
                </div>
              ))}
            </div>
          </div>

          {/* Main Tab Bar */}
          <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.1)" }}>
            {mainTabs.map((tab) => (
              <button key={tab.id} onClick={() => setMainTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-['Inter']"
                style={{
                  background: mainTab === tab.id ? `${tab.color}12` : "transparent",
                  color: mainTab === tab.id ? tab.color : "#6B7280",
                  border: mainTab === tab.id ? `1px solid ${tab.color}30` : "1px solid transparent",
                }}>
                <i className={`${tab.icon} text-sm`} />
                {isAr ? tab.labelAr : tab.labelEn}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {mainTab === "declarations" && (
            <div className="flex gap-6">
              <div className="flex-1 min-w-0">
                {!confirmation && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {eventTypes.map((evt) => (
                      <button key={evt.id} onClick={() => setActiveEvent(evt.id)}
                        className="p-4 rounded-xl text-left transition-all cursor-pointer group"
                        style={{
                          background: activeEvent === evt.id ? `${evt.color}12` : "rgba(10,22,40,0.6)",
                          border: `1px solid ${activeEvent === evt.id ? evt.color : "rgba(34,211,238,0.08)"}`,
                        }}>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${evt.color}18` }}>
                            <i className={`${evt.icon} text-base`} style={{ color: evt.color }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-sm font-semibold font-['Inter'] leading-tight">{isAr ? evt.labelAr : evt.labelEn}</p>
                            <p className="text-gray-500 text-xs font-['Inter'] mt-0.5 leading-tight">{isAr ? evt.descAr : evt.descEn}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {activeEvent !== "overview" && (
                  <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.1)" }}>
                    {!confirmation && activeEventMeta && (
                      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: `${activeEventMeta.color}18` }}>
                            <i className={`${activeEventMeta.icon} text-sm`} style={{ color: activeEventMeta.color }} />
                          </div>
                          <div>
                            <h2 className="text-white text-sm font-bold font-['Inter']">{isAr ? activeEventMeta.labelAr : activeEventMeta.labelEn}</h2>
                            <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{isAr ? "إقرار جمركي جديد" : "New customs declaration"}</p>
                          </div>
                        </div>
                        <button onClick={() => setActiveEvent("overview")}
                          className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all text-gray-500 hover:text-white"
                          style={{ background: "rgba(255,255,255,0.04)" }}>
                          <i className="ri-close-line" />
                        </button>
                      </div>
                    )}
                    <div className="p-6">{renderForm()}</div>
                  </div>
                )}
                {activeEvent === "overview" && (
                  <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(10,22,40,0.6)", border: "1px solid rgba(34,211,238,0.08)" }}>
                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl mx-auto mb-4" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
                      <i className="ri-ship-line text-3xl text-cyan-400" />
                    </div>
                    <h3 className="text-white text-lg font-bold font-['Inter'] mb-2">{isAr ? "اختر نوع الإقرار الجمركي" : "Select Declaration Type"}</h3>
                    <p className="text-gray-500 text-sm font-['Inter']">{isAr ? "اختر أحد أنواع الإقرارات الجمركية الستة أعلاه لبدء التسجيل" : "Choose one of the six customs declaration types above to begin registration"}</p>
                  </div>
                )}
              </div>
              <div className="w-80 flex-shrink-0"><CustomsLiveCounters isAr={isAr} /></div>
            </div>
          )}

          {mainTab === "cargo-intel" && <CargoIntelligence isAr={isAr} />}
          {mainTab === "brokers" && <CustomsBrokerRegistry isAr={isAr} />}
          {mainTab === "cross-stream" && <CrossStreamIntelligence isAr={isAr} />}
        </main>
      </div>
    </div>
  );
};

export default CustomsCargoPage;
