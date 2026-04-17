import { useState } from "react";
import { useTranslation } from "react-i18next";

const FORM_URL = "https://readdy.ai/api/form/d792p8rll6jbq2vddh80";

const AboutSection = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const subjects = t("about.form.subjects", { returnObjects: true }) as string[];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new URLSearchParams(new FormData(form) as unknown as Record<string, string>);
    try {
      const res = await fetch(FORM_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: data.toString() });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) form.reset();
    } catch { setStatus("error"); }
  };

  return (
    <section id="about" className="py-20 md:py-28 relative" style={{ background: "#0B1220" }}>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(rgba(181,142,60,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.1) 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/5 mb-4">
            <span className="text-gold-400 text-xs font-['JetBrains_Mono'] tracking-widest uppercase">ABOUT Al-Ameen</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-['Inter'] mb-2">{t("about.title")}</h2>
          <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-4 mb-4" />
          <p className="text-gray-400 text-sm max-w-xl mx-auto font-['Inter']">{t("about.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Info cards */}
          <div className="flex flex-col gap-5">
            {[
              { titleKey: "about.ropTitle", descKey: "about.ropDesc", icon: "ri-shield-star-line", color: "#D4A84B" },
              { titleKey: "about.ibordersTitle", descKey: "about.ibordersDesc", icon: "ri-global-line", color: "#4ADE80" },
              { titleKey: "about.missionTitle", descKey: "about.missionDesc", icon: "ri-focus-3-line", color: "#FACC15" },
            ].map((card) => (
              <div key={card.titleKey} className="flex gap-4 p-5 rounded-xl border" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
                <div className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: card.color + "15", border: `1px solid ${card.color}33` }}>
                  <i className={`${card.icon} text-lg`} style={{ color: card.color }} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base font-['Inter'] mb-1">{t(card.titleKey)}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-['Inter']">{t(card.descKey)}</p>
                </div>
              </div>
            ))}
            {/* Contact info */}
            <div className="p-5 rounded-xl border" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)" }}>
              <h3 className="text-white font-bold text-base font-['Inter'] mb-3">{t("about.contactTitle")}</h3>
              <p className="text-gray-400 text-sm mb-4 font-['Inter']">{t("about.contactDesc")}</p>
              <div className="space-y-2">
                {[
                  { icon: "ri-phone-line", text: t("footer.phone"), color: "#D4A84B" },
                  { icon: "ri-mail-line", text: t("footer.email"), color: "#4ADE80" },
                  { icon: "ri-map-pin-line", text: t("footer.address"), color: "#FACC15" },
                ].map((item) => (
                  <div key={item.icon} className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className={`${item.icon} text-sm`} style={{ color: item.color }} />
                    </div>
                    <span className="text-gray-300 text-sm font-['Inter']">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-6 rounded-xl border" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.2)", backdropFilter: "blur(12px)" }}>
            <h3 className="text-white font-bold text-lg font-['Inter'] mb-5 flex items-center gap-2">
              <i className="ri-mail-send-line text-gold-400" />
              {t("about.contactTitle")}
            </h3>
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-400/10 border border-green-400/30 mb-4">
                  <i className="ri-checkbox-circle-line text-green-400 text-2xl" />
                </div>
                <p className="text-green-400 font-semibold font-['Inter']">{t("about.form.success")}</p>
              </div>
            ) : (
              <form data-readdy-form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1.5 font-['Inter']">{t("about.form.name")}</label>
                    <input name="name" required placeholder={t("about.form.namePlaceholder")} className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:border-gold-400/60 transition-colors font-['Inter']" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }} />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1.5 font-['Inter']">{t("about.form.email")}</label>
                    <input name="email" type="email" required placeholder={t("about.form.emailPlaceholder")} className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:border-gold-400/60 transition-colors font-['Inter']" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }} />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1.5 font-['Inter']">{t("about.form.organization")}</label>
                  <input name="organization" placeholder={t("about.form.orgPlaceholder")} className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none font-['Inter']" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1.5 font-['Inter']">{t("about.form.subject")}</label>
                  <select name="subject" className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none font-['Inter'] cursor-pointer" style={{ background: "rgba(20,29,46,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <option value="">{t("about.form.subjectPlaceholder")}</option>
                    {Array.isArray(subjects) && subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1.5 font-['Inter']">{t("about.form.message")}</label>
                  <textarea name="message" required rows={4} maxLength={500} placeholder={t("about.form.messagePlaceholder")} className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none font-['Inter']" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                {status === "error" && <p className="text-red-400 text-xs font-['Inter']">{t("about.form.error")}</p>}
                <button type="submit" disabled={status === "sending"} className="w-full flex items-center justify-center gap-2 py-3 bg-gold-400 text-[#0B1220] font-semibold rounded-md hover:bg-gold-300 transition-colors duration-200 cursor-pointer text-sm font-['Inter'] disabled:opacity-60">
                  <i className="ri-send-plane-line" />
                  {status === "sending" ? t("about.form.sending") : t("about.form.submit")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
