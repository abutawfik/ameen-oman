import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const HospitalitySection = () => {
  const { t } = useTranslation();
  const isAr = i18n.language === "ar";
  const features = t("hospitality.features", { returnObjects: true }) as string[];

  return (
    <section className="py-20 md:py-28 relative" style={{ background: "linear-gradient(135deg, #0B1220 0%, #071A0F 50%, #0B1220 100%)" }}>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(rgba(74,222,128,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.1) 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left: mockup */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-[480px]">
              <div className="rounded-2xl overflow-hidden border border-green-500/20" style={{ background: "rgba(20,29,46,0.9)" }}>
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-400/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                  <div className="w-3 h-3 rounded-full bg-green-400/60" />
                  <span className="text-gray-600 text-xs font-['JetBrains_Mono'] ml-2">AMEEN Hospitality v2.4</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white font-bold text-sm font-['Inter']">Dashboard</p>
                      <p className="text-gray-500 text-xs">Al Bustan Hotel — Muscat</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-400/10 border border-green-400/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-green-400 text-xs font-['JetBrains_Mono']">SYNCED</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[{ label: "Occupied", value: "42", color: "#D4A84B" }, { label: "Available", value: "18", color: "#4ADE80" }, { label: "Check-outs", value: "7", color: "#FACC15" }].map((s) => (
                      <div key={s.label} className="p-3 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <p className="font-bold text-xl font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-gray-500 text-xs mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[{ name: "Ahmed Al-Rashidi", room: "204", status: "Check-in", color: "#4ADE80" }, { name: "Sarah Johnson", room: "118", status: "Staying", color: "#D4A84B" }, { name: "Mohammed Al-Balushi", room: "312", status: "Check-out", color: "#FACC15" }].map((g) => (
                      <div key={g.name} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gold-400/10">
                            <i className="ri-user-line text-gold-400 text-xs" />
                          </div>
                          <div>
                            <p className="text-white text-xs font-semibold">{g.name}</p>
                            <p className="text-gray-600 text-xs">Room {g.room}</p>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full font-['JetBrains_Mono']" style={{ color: g.color, background: g.color + "15" }}>{g.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: content */}
          <div className="w-full lg:w-1/2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/40 bg-green-500/8 text-green-400 text-xs font-semibold font-['Inter'] mb-5">
              <i className="ri-gift-line" />
              {t("hospitality.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-['Inter'] mb-1">{t("hospitality.title")}</h2>
            <p className="text-green-400 text-lg font-['Cairo'] mb-5">{t("hospitality.arabicTitle")}</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-['Inter']">{t("hospitality.description")}</p>
            <div className="space-y-2.5 mb-8">
              {Array.isArray(features) && features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i className="ri-checkbox-circle-line text-green-400" />
                  </div>
                  <span className="text-gray-300 text-sm font-['Inter']">{f}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-green-400 text-[#0B1220] font-semibold rounded-md hover:bg-green-300 transition-colors duration-200 whitespace-nowrap cursor-pointer text-sm">
                <i className="ri-download-line" />
                {t("hospitality.download")}
              </button>
              <p className="text-gray-600 text-xs font-['Inter'] mt-3 sm:mt-3.5">
                <i className="ri-information-line mr-1" />
                {t("hospitality.note")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HospitalitySection;
