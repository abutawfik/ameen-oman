import { useTranslation } from "react-i18next";
import BrandLogo from "@/brand/BrandLogo";
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
            <BrandLogo size="lg" tone="light" showTagline style={{ width: 260, marginBottom: 12 }} />
            <p className="text-gray-600 text-xs font-['Cairo'] mb-3" lang="ar" dir="rtl">{t("footer.arabicTagline")}</p>
            <p className="text-gray-500 text-xs leading-relaxed font-['Manrope'] mb-4">{t("footer.description")}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/20 bg-gold-500/5">
              <i className="ri-shield-check-line text-gold-400 text-xs" />
              <span className="text-gold-400 text-xs font-['JetBrains_Mono']">{t("footer.operated")}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-white font-semibold text-sm font-['Manrope'] mb-4">{t("footer.quickLinks")}</p>
            <div className="space-y-2.5">
              {[
                { key: "apiDocs", href: "#api-integration" },
                { key: "integrationGuide", href: "#api-integration" },
                { key: "supportPortal", href: "#about" },
                { key: "statusPage", href: "#home" },
                { key: "hospitality", href: "#home" },
              ].map((link) => (
                <a key={link.key} href={link.href} onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className="block text-gray-500 text-sm hover:text-gold-400 transition-colors duration-200 cursor-pointer font-['Manrope']">
                  <i className="ri-arrow-right-s-line mr-1 text-gold-400/40" />
                  {t(`footer.links.${link.key}`)}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-semibold text-sm font-['Manrope'] mb-4">{t("footer.contact")}</p>
            <div className="space-y-3">
              {[
                { icon: "ri-phone-line", text: t("footer.phone"), color: "#C5A365" },
                { icon: "ri-mail-line", text: t("footer.email"), color: "#4ADE80" },
                { icon: "ri-map-pin-line", text: t("footer.address"), color: "#FACC15" },
              ].map((item) => (
                <div key={item.icon} className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className={`${item.icon} text-sm`} style={{ color: item.color }} />
                  </div>
                  <span className="text-gray-400 text-sm font-['Manrope']">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs font-['Manrope']">{t("footer.copyright")}</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-600 text-xs hover:text-gold-400 transition-colors cursor-pointer font-['Manrope']">{t("footer.privacy")}</a>
            <span className="text-gray-700">|</span>
            <a href="#" className="text-gray-600 text-xs hover:text-gold-400 transition-colors cursor-pointer font-['Manrope']">{t("footer.terms")}</a>
            <span className="text-gray-700">|</span>
            <VersionBadge tone="light" size="sm" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
