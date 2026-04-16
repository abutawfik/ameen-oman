import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const DataStreamsSection = () => {
  const { t } = useTranslation();
  const isAr = i18n.language === "ar";

  const archSteps = [
    {
      key: "entities",
      icon: "ri-building-2-line",
      color: "#9CA3AF",
      bg: "rgba(156,163,175,0.1)",
      border: "rgba(156,163,175,0.3)",
    },
    {
      key: "api",
      icon: "ri-code-s-slash-line",
      color: "#22D3EE",
      bg: "rgba(34,211,238,0.08)",
      border: "rgba(34,211,238,0.3)",
    },
    {
      key: "validation",
      icon: "ri-shield-check-line",
      color: "#4ADE80",
      bg: "rgba(74,222,128,0.08)",
      border: "rgba(74,222,128,0.3)",
    },
    {
      key: "database",
      icon: "ri-database-2-line",
      color: "#22D3EE",
      bg: "rgba(34,211,238,0.08)",
      border: "rgba(34,211,238,0.3)",
    },
  ];

  const visSteps = [
    {
      key: "vis1",
      icon: "ri-eye-line",
      color: "#A78BFA",
      bg: "rgba(167,139,250,0.08)",
      border: "rgba(167,139,250,0.3)",
    },
    {
      key: "vis2",
      icon: "ri-eye-2-line",
      color: "#A78BFA",
      bg: "rgba(167,139,250,0.08)",
      border: "rgba(167,139,250,0.3)",
    },
  ];

  const finalSteps = [
    {
      key: "risk",
      icon: "ri-radar-line",
      color: "#FB923C",
      bg: "rgba(251,146,60,0.08)",
      border: "rgba(251,146,60,0.3)",
    },
    {
      key: "stored",
      icon: "ri-lock-line",
      color: "#F87171",
      bg: "rgba(248,113,113,0.08)",
      border: "rgba(248,113,113,0.3)",
    },
  ];

  const allStreams = [
    { num: "01", title: "Hotel Intelligence", titleAr: "الاستخبارات الفندقية", type: "Core", color: "#22D3EE", icon: "ri-hotel-line" },
    { num: "02", title: "Car Rental Monitoring", titleAr: "مراقبة تأجير السيارات", type: "Core", color: "#22D3EE", icon: "ri-car-line" },
    { num: "03", title: "Mobile Operators", titleAr: "مشغلو الاتصالات", type: "Core", color: "#22D3EE", icon: "ri-sim-card-line" },
    { num: "04", title: "Municipality Registry", titleAr: "سجل البلديات", type: "Core", color: "#22D3EE", icon: "ri-government-line" },
    { num: "05", title: "Payment Intelligence", titleAr: "الاستخبارات المالية", type: "Extended", color: "#4ADE80", icon: "ri-bank-card-line" },
    { num: "06", title: "Borders & Immigration", titleAr: "الحدود والهجرة", type: "Extended", color: "#60A5FA", icon: "ri-passport-line" },
    { num: "07", title: "Health Interactions", titleAr: "التفاعلات الصحية", type: "Extended", color: "#F87171", icon: "ri-heart-pulse-line" },
    { num: "08", title: "Utility Activation", titleAr: "تفعيل المرافق", type: "Extended", color: "#FACC15", icon: "ri-flashlight-line" },
    { num: "09", title: "Public Transport", titleAr: "النقل العام", type: "Extended", color: "#FB923C", icon: "ri-bus-line" },
    { num: "10", title: "Educational Enrollment", titleAr: "التسجيل التعليمي", type: "Extended", color: "#A78BFA", icon: "ri-graduation-cap-line" },
    { num: "11", title: "Employment Registry", titleAr: "سجل التوظيف", type: "Extended", color: "#F9A8D4", icon: "ri-briefcase-line" },
    { num: "12", title: "E-Commerce & Retail", titleAr: "التجارة الإلكترونية", type: "Extended", color: "#34D399", icon: "ri-shopping-cart-line" },
    { num: "13", title: "Social Media Intelligence", titleAr: "استخبارات وسائل التواصل", type: "Extended", color: "#38BDF8", icon: "ri-global-line" },
    { num: "14", title: "Customs & Cargo", titleAr: "الجمارك والشحن", type: "Extended", color: "#FCD34D", icon: "ri-ship-line" },
    { num: "15", title: "Marine & Maritime", titleAr: "البحرية والملاحة", type: "Extended", color: "#22D3EE", icon: "ri-anchor-line" },
    { num: "16", title: "Postal Services", titleAr: "الخدمات البريدية", type: "Extended", color: "#A78BFA", icon: "ri-mail-send-line" },
  ];

  return (
    <section
      id="data-streams"
      className="py-20 md:py-28 relative"
      style={{ background: "linear-gradient(180deg, #060D1A 0%, #080F1E 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.12) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 mb-4">
            <span className="text-cyan-400 text-xs font-['JetBrains_Mono'] tracking-widest uppercase">16 DATA STREAMS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-['Inter'] mb-2">
            {t("architecture.title")}
          </h2>
          <p className="text-gray-500 text-sm font-['Cairo'] mb-4">{isAr ? "بنية تدفق البيانات" : "بنية تدفق البيانات"}</p>
          <div className="w-16 h-0.5 bg-cyan-400 mx-auto mb-4" />
          <p className="text-gray-400 text-sm max-w-xl mx-auto font-['Inter']">{t("architecture.subtitle")}</p>
        </div>

        {/* All 13 Streams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-16">
          {allStreams.map((stream) => (
            <div
              key={stream.num}
              className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:-translate-y-0.5 cursor-default"
              style={{
                background: "rgba(10,22,40,0.7)",
                borderColor: stream.color + "22",
              }}
            >
              <div
                className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ background: stream.color + "15", border: `1px solid ${stream.color}33` }}
              >
                <i className={`${stream.icon} text-base`} style={{ color: stream.color }} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-['JetBrains_Mono'] text-gray-600">{stream.num}</span>
                  <span
                    className="text-xs px-1.5 py-0 rounded-full font-['Inter']"
                    style={{ background: stream.color + "18", color: stream.color, fontSize: "10px" }}
                  >
                    {stream.type}
                  </span>
                </div>
                <p className="text-white text-xs font-semibold font-['Inter'] truncate">{isAr ? stream.titleAr : stream.title}</p>
                <p className="text-gray-600 text-xs font-['Cairo'] truncate">{isAr ? stream.title : stream.titleAr}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Architecture Flow */}
        <div
          className="rounded-2xl p-6 md:p-10 border"
          style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.15)", backdropFilter: "blur(12px)" }}
        >
          <h3 className="text-white font-bold text-xl font-['Inter'] text-center mb-8">
            Data Pipeline Architecture
          </h3>

          {/* Flow diagram */}
          <div className="flex flex-col gap-6">
            {/* Row 1: Main flow */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">
              {archSteps.map((step, i) => (
                <div key={step.key} className="flex items-center gap-2 md:gap-0">
                  <div
                    className="flex flex-col items-center p-4 rounded-xl min-w-[120px] text-center"
                    style={{ background: step.bg, border: `1px solid ${step.border}` }}
                  >
                    <div className="w-10 h-10 flex items-center justify-center mb-2">
                      <i className={`${step.icon} text-xl`} style={{ color: step.color }} />
                    </div>
                    <span className="text-white text-xs font-semibold font-['Inter']">
                      {t(`architecture.steps.${step.key}`)}
                    </span>
                  </div>
                  {i < archSteps.length - 1 && (
                    <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                      <i className="ri-arrow-right-line text-cyan-400/60 hidden md:block" />
                      <i className="ri-arrow-down-line text-cyan-400/60 md:hidden" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Arrow down */}
            <div className="flex justify-center">
              <i className="ri-arrow-down-line text-cyan-400/60 text-xl" />
            </div>

            {/* Row 2: VIS split */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="text-gray-500 text-xs font-['JetBrains_Mono'] text-center">DUAL VIS REPLICATION</div>
              <div className="flex items-center gap-4">
                {visSteps.map((step) => (
                  <div
                    key={step.key}
                    className="flex flex-col items-center p-4 rounded-xl min-w-[110px] text-center"
                    style={{ background: step.bg, border: `1px solid ${step.border}` }}
                  >
                    <div className="w-10 h-10 flex items-center justify-center mb-2">
                      <i className={`${step.icon} text-xl`} style={{ color: step.color }} />
                    </div>
                    <span className="text-white text-xs font-semibold font-['Inter']">
                      {t(`architecture.steps.${step.key}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow down */}
            <div className="flex justify-center">
              <i className="ri-arrow-down-line text-cyan-400/60 text-xl" />
            </div>

            {/* Row 3: Risk + Stored */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">
              {finalSteps.map((step, i) => (
                <div key={step.key} className="flex items-center gap-2 md:gap-0">
                  <div
                    className="flex flex-col items-center p-4 rounded-xl min-w-[120px] text-center"
                    style={{ background: step.bg, border: `1px solid ${step.border}` }}
                  >
                    <div className="w-10 h-10 flex items-center justify-center mb-2">
                      <i className={`${step.icon} text-xl`} style={{ color: step.color }} />
                    </div>
                    <span className="text-white text-xs font-semibold font-['Inter']">
                      {t(`architecture.steps.${step.key}`)}
                    </span>
                  </div>
                  {i < finalSteps.length - 1 && (
                    <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                      <i className="ri-arrow-right-line text-orange-400/60 hidden md:block" />
                      <i className="ri-arrow-down-line text-orange-400/60 md:hidden" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div
            className="mt-8 flex items-center gap-3 p-4 rounded-xl border"
            style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.3)" }}
          >
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <i className="ri-error-warning-line text-red-400 text-lg" />
            </div>
            <div>
              <p className="text-red-400 font-semibold text-sm font-['Inter']">{t("architecture.warning")}</p>
              <p className="text-gray-500 text-xs mt-0.5 font-['Inter']">{t("architecture.note")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataStreamsSection;
