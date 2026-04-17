import { useTranslation } from "react-i18next";
import VersionBadge from "@/components/VersionBadge";

const Footer = () => {
  const { t } = useTranslation();
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer style={{ background: "#030810", borderTop: "1px solid rgba(184,138,60,0.15)" }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(184,138,60,0.08)",
                  border: "1.5px solid rgba(184,138,60,0.4)",
                  clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                }}
              >
                <span className="text-lg font-black" style={{ color: "#D6B47E", fontFamily: "Inter, sans-serif" }}>A</span>
              </div>
              <div>
                <p className="text-white font-bold text-base font-['Inter'] tracking-widest" lang="en">Al-Ameen</p>
                <p className="text-gold-400 text-xs font-['Cairo']" lang="ar" dir="rtl">الأمين</p>
              </div>
            </div>
            <p className="text-gold-400 text-sm font-semibold font-['Inter'] mb-1">{t("footer.tagline")}</p>
            <p className="text-gray-600 text-xs font-['Cairo'] mb-3" lang="ar" dir="rtl">{t("footer.arabicTagline")}</p>
            <p className="text-gray-500 text-xs leading-relaxed font-['Inter'] mb-4">{t("footer.description")}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/20 bg-gold-500/5">
              <i className="ri-shield-check-line text-gold-400 text-xs" />
              <span className="text-gold-400 text-xs font-['JetBrains_Mono']">{t("footer.operated")}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-white font-semibold text-sm font-['Inter'] mb-4">{t("footer.quickLinks")}</p>
            <div className="space-y-2.5">
              {[
                { key: "apiDocs", href: "#api-integration" },
                { key: "integrationGuide", href: "#api-integration" },
                { key: "supportPortal", href: "#about" },
                { key: "statusPage", href: "#home" },
                { key: "hospitality", href: "#home" },
              ].map((link) => (
                <a key={link.key} href={link.href} onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className="block text-gray-500 text-sm hover:text-gold-400 transition-colors duration-200 cursor-pointer font-['Inter']">
                  <i className="ri-arrow-right-s-line mr-1 text-gold-400/40" />
                  {t(`footer.links.${link.key}`)}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-semibold text-sm font-['Inter'] mb-4">{t("footer.contact")}</p>
            <div className="space-y-3">
              {[
                { icon: "ri-phone-line", text: t("footer.phone"), color: "#D6B47E" },
                { icon: "ri-mail-line", text: t("footer.email"), color: "#4ADE80" },
                { icon: "ri-map-pin-line", text: t("footer.address"), color: "#FACC15" },
              ].map((item) => (
                <div key={item.icon} className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className={`${item.icon} text-sm`} style={{ color: item.color }} />
                  </div>
                  <span className="text-gray-400 text-sm font-['Inter']">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs font-['Inter']">{t("footer.copyright")}</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-600 text-xs hover:text-gold-400 transition-colors cursor-pointer font-['Inter']">{t("footer.privacy")}</a>
            <span className="text-gray-700">|</span>
            <a href="#" className="text-gray-600 text-xs hover:text-gold-400 transition-colors cursor-pointer font-['Inter']">{t("footer.terms")}</a>
            <span className="text-gray-700">|</span>
            <VersionBadge tone="light" size="sm" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
