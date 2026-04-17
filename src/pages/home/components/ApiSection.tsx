import { useTranslation } from "react-i18next";
import { apiEndpoints, integrationSteps } from "@/mocks/ameenData";

const ApiSection = () => {
  const { t } = useTranslation();

  const features = [
    { key: "auth", icon: "ri-key-line", color: "#D4A84B" },
    { key: "tls", icon: "ri-lock-line", color: "#4ADE80" },
    { key: "rate", icon: "ri-speed-line", color: "#FACC15" },
    { key: "webhook", icon: "ri-webhook-line", color: "#FB923C" },
    { key: "sandbox", icon: "ri-test-tube-line", color: "#A78BFA" },
    { key: "support", icon: "ri-customer-service-2-line", color: "#F9A8D4" },
  ];

  return (
    <section id="api-integration" className="py-20 md:py-28 relative" style={{ background: "#0B1220" }}>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(rgba(181,142,60,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.1) 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/5 mb-4">
            <span className="text-gold-400 text-xs font-['JetBrains_Mono'] tracking-widest uppercase">B2B INTEGRATION</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-['Inter'] mb-2">{t("api.title")}</h2>
          <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-4 mb-4" />
          <p className="text-gray-400 text-sm max-w-xl mx-auto font-['Inter']">{t("api.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* B2B API */}
          <div className="rounded-xl p-6 border" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.2)", backdropFilter: "blur(12px)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.3)" }}>
                <i className="ri-code-s-slash-line text-gold-400 text-lg" />
              </div>
              <h3 className="text-white font-bold text-lg font-['Inter']">{t("api.b2bTitle")}</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6 font-['Inter']">{t("api.b2bDesc")}</p>
            <div className="space-y-2">
              <p className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-widest mb-3">{t("api.endpoints")}</p>
              {apiEndpoints.map((ep, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span className={`text-xs font-bold font-['JetBrains_Mono'] px-2 py-0.5 rounded ${ep.method === "GET" ? "text-green-400 bg-green-400/10" : "text-gold-400 bg-gold-400/10"}`}>{ep.method}</span>
                  <span className="text-gray-300 text-xs font-['JetBrains_Mono'] flex-1 truncate">{ep.path}</span>
                  <span className="text-gray-600 text-xs font-['Inter'] hidden md:block truncate max-w-[160px]">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Portal + Steps */}
          <div className="flex flex-col gap-6">
            <div className="rounded-xl p-6 border" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.2)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)" }}>
                  <i className="ri-window-line text-green-400 text-lg" />
                </div>
                <h3 className="text-white font-bold text-lg font-['Inter']">{t("api.portalTitle")}</h3>
              </div>
              <p className="text-gray-400 text-sm font-['Inter']">{t("api.portalDesc")}</p>
            </div>

            {/* Integration Steps */}
            <div className="rounded-xl p-6 border" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.15)", backdropFilter: "blur(12px)" }}>
              <p className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-widest mb-4">{t("api.getStarted")}</p>
              <div className="space-y-3">
                {integrationSteps.map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gold-400/10 border border-gold-400/30 flex-shrink-0 mt-0.5">
                      <span className="text-gold-400 text-xs font-bold font-['JetBrains_Mono']">{s.step}</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold font-['Inter']">{s.title}</p>
                      <p className="text-gray-500 text-xs font-['Inter']">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {features.map((f) => (
            <div key={f.key} className="flex flex-col items-center text-center p-4 rounded-xl border" style={{ background: "rgba(20,29,46,0.6)", borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="w-10 h-10 flex items-center justify-center mb-3">
                <i className={`${f.icon} text-xl`} style={{ color: f.color }} />
              </div>
              <p className="text-white text-xs font-semibold font-['Inter'] mb-1">{t(`api.features.${f.key}`)}</p>
              <p className="text-gray-600 text-xs font-['Inter']">{t(`api.features.${f.key}Desc`)}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-gold-400 text-[#0B1220] font-semibold rounded-md hover:bg-gold-300 transition-colors duration-200 whitespace-nowrap cursor-pointer text-sm">
            <i className="ri-send-plane-line" />
            {t("api.requestAccess")}
          </button>
          <button className="flex items-center gap-2 px-6 py-3 border border-gold-500/50 text-gold-400 font-semibold rounded-md hover:bg-gold-500/10 transition-colors duration-200 whitespace-nowrap cursor-pointer text-sm">
            <i className="ri-file-text-line" />
            {t("api.viewDocs")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ApiSection;
