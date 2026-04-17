import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import BrandLogo from "@/brand/BrandLogo";
import { useBrandFonts } from "@/brand/typography";

// ─── Inline brand tokens — never depend on JIT utilities for brand-critical
//     chrome. These are the same values as the style-guide `.topnav`. ─────────
const C = {
  ivory100: "#F5EFE3",
  ivory200: "#EFE7D3",
  gold400:  "#D4A84B",
  omanRed600: "#9A1F24",
  omanRed500: "#B32830",
  bgPanel:  "rgba(11,18,32,0.9)",
  bgPanelSolid: "rgba(11,18,32,0.98)",
};

const Navbar = () => {
  const { t } = useTranslation();
  const brand = useBrandFonts();
  const FF_SANS = brand.sans;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoverLogin, setHoverLogin] = useState(false);
  const isAr = brand.isAr;

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
    { key: "about", href: "#about" },
  ];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      style={{
        background: C.bgPanel,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${scrolled ? "rgba(181,142,60,0.25)" : "rgba(181,142,60,0.15)"}`,
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between" style={{ height: 72 }}>

          {/* Left — brand lockup with language-flipping hierarchy + strapline */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollTo("#home"); }}
            className="flex items-center cursor-pointer"
          >
            <BrandLogo
              variant="horizontal"
              tone="light"
              size="md"
              showTagline
            />
          </a>

          {/* Center — desktop links */}
          <div className="hidden lg:flex items-center" style={{ gap: "0.25rem" }}>
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className="group relative cursor-pointer"
                style={{
                  padding: "0.5rem 0.875rem",
                  fontSize: "0.875rem",
                  color: C.ivory200,
                  fontFamily: FF_SANS,
                  whiteSpace: "nowrap",
                  borderRadius: 4,
                  transition: "color 150ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold400)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.ivory200)}
              >
                {t(`nav.${link.key}`)}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    right: "0.875rem",
                    bottom: 4,
                    height: 1,
                    background: C.gold400,
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 250ms",
                  }}
                  className="group-hover:scale-x-100"
                />
              </a>
            ))}
          </div>

          {/* Right — AR/EN ghost toggle + Portal Login */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="hidden md:inline-flex items-center justify-center cursor-pointer"
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: C.gold400,
                fontFamily: "'JetBrains Mono', monospace",
                background: "transparent",
                border: "1px solid rgba(181,142,60,0.35)",
                borderRadius: 4,
                transition: "background 150ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(181,142,60,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {t("nav.language")}
            </button>

            <a
              href="/login"
              className="hidden md:inline-flex items-center gap-2 cursor-pointer"
              onMouseEnter={() => setHoverLogin(true)}
              onMouseLeave={() => setHoverLogin(false)}
              style={{
                padding: "0.5rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: C.ivory100,
                fontFamily: FF_SANS,
                background: `linear-gradient(180deg, ${C.omanRed500} 0%, ${C.omanRed600} 100%)`,
                borderRadius: 6,
                whiteSpace: "nowrap",
                boxShadow: hoverLogin
                  ? "0 4px 16px rgba(154,31,36,0.35)"
                  : "0 1px 2px rgba(154,31,36,0.25)",
                filter: hoverLogin ? "brightness(1.08)" : "none",
                transition: "filter 150ms, box-shadow 150ms",
              }}
            >
              {t("nav.portalLogin")}
              <span aria-hidden>→</span>
            </a>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex items-center justify-center cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                width: 40,
                height: 40,
                color: C.ivory200,
                background: "transparent",
                border: "1px solid rgba(181,142,60,0.25)",
                borderRadius: 4,
              }}
            >
              <i className={`text-xl ${mobileOpen ? "ri-close-line" : "ri-menu-3-line"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden"
          style={{
            background: C.bgPanelSolid,
            borderTop: "1px solid rgba(181,142,60,0.25)",
            padding: "1rem",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              className="block cursor-pointer"
              style={{
                padding: "0.75rem 0.25rem",
                fontSize: "0.875rem",
                color: C.ivory200,
                fontFamily: FF_SANS,
                borderBottom: "1px solid rgba(245,239,227,0.05)",
              }}
            >
              {t(`nav.${link.key}`)}
            </a>
          ))}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={toggleLang}
              className="inline-flex items-center justify-center cursor-pointer"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: C.gold400,
                fontFamily: "'JetBrains Mono', monospace",
                background: "transparent",
                border: "1px solid rgba(181,142,60,0.35)",
                borderRadius: 4,
              }}
            >
              {t("nav.language")}
            </button>
            <a
              href="/login"
              className="inline-flex items-center gap-2 cursor-pointer"
              style={{
                padding: "0.5rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: C.ivory100,
                fontFamily: FF_SANS,
                background: `linear-gradient(180deg, ${C.omanRed500} 0%, ${C.omanRed600} 100%)`,
                borderRadius: 6,
                whiteSpace: "nowrap",
              }}
            >
              {t("nav.portalLogin")}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
