import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const Navbar = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAr = i18n.language === "ar";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLang = () => {
    const next = isAr ? "en" : "ar";
    i18n.changeLanguage(next);
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = next;
  };

  const navLinks = [
    { key: "home", href: "#home" },
    { key: "coreServices", href: "#core-services" },
    { key: "extendedServices", href: "#extended-services" },
    { key: "dataStreams", href: "#data-streams" },
    { key: "apiIntegration", href: "#api-integration" },
    { key: "about", href: "#about" },
  ];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(6,13,26,0.95)] backdrop-blur-md border-b border-cyan-500/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollTo("#home"); }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div
              className="w-10 h-10 flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(34,211,238,0.08)",
                border: "1.5px solid rgba(34,211,238,0.4)",
                clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
              }}
            >
              <span className="text-lg font-black" style={{ color: "#22D3EE", fontFamily: "Inter, sans-serif" }}>A</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold text-base tracking-widest font-['Inter']">Al-Ameen</span>
              <span className="text-cyan-400 text-xs font-['Cairo'] tracking-wide">الامين</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className="px-3 py-2 text-sm text-gray-300 hover:text-cyan-400 transition-colors duration-200 cursor-pointer whitespace-nowrap font-['Inter'] relative group"
              >
                {t(`nav.${link.key}`)}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-cyan-500/50 text-cyan-400 text-sm font-bold hover:bg-cyan-500/10 transition-colors duration-200 font-['JetBrains_Mono'] cursor-pointer"
            >
              {t("nav.language")}
            </button>
            <a href="/login" className="hidden md:flex items-center gap-2 px-4 py-2 bg-cyan-400 text-[#060D1A] text-sm font-semibold rounded-md hover:bg-cyan-300 transition-colors duration-200 whitespace-nowrap cursor-pointer">
              <i className="ri-login-box-line text-sm" />
              {t("nav.portalLogin")}
            </a>
            {/* Mobile hamburger */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-300 hover:text-cyan-400 cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <i className={`text-xl ${mobileOpen ? "ri-close-line" : "ri-menu-3-line"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[rgba(6,13,26,0.98)] border-t border-cyan-500/20 px-4 py-4">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              className="block py-3 text-gray-300 hover:text-cyan-400 border-b border-white/5 text-sm cursor-pointer"
            >
              {t(`nav.${link.key}`)}
            </a>
          ))}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={toggleLang}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-cyan-500/50 text-cyan-400 text-sm font-bold cursor-pointer"
            >
              {t("nav.language")}
            </button>
            <a href="/login" className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-[#060D1A] text-sm font-semibold rounded-md cursor-pointer">
              <i className="ri-login-box-line" />
              {t("nav.portalLogin")}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
