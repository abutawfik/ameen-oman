import { useTranslation } from "react-i18next";
import BrandLogo from "@/brand/BrandLogo";

// ─── Brand token constants — inline hex so we never depend on JIT-compiled
//     utility classes. These mirror al-ameen-brand/style-guide.html.
//     Ocean (midnight) ramp now resolves via CSS vars so the runtime palette
//     switcher (src/brand/PaletteSwitcher.tsx) can flip v1.0 ↔ v1.1 live. ────
const C = {
  midnight800: "var(--alm-ocean-800)",
  ivory100:    "#F8F5F0",
  ivory200:    "#EFE8D7",
  gold400:     "#C5A365",
  gold500:     "#C5A365",
};



const FF_SANS    = "'Manrope', ui-sans-serif, system-ui, sans-serif";

const HeroSection = () => {
  const { t } = useTranslation();


  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        // Ceremonial hero background — radial royal-red glow over midnight canvas.
        background: "#071426",
      }}
    >
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-8 pt-28 pb-16 flex flex-col items-center text-center">

        {/* Ceremonial eyebrow pill */}
        <div
          data-narrate-id="home-hero-eyebrow"
          className="inline-flex items-center gap-2 mb-8 animate-fade-in"
          style={{
            padding: "0.375rem 1rem",
            background: "rgba(184,138,60,0.1)",
            border: "1px solid rgba(184,138,60,0.35)",
            borderRadius: "9999px",
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: C.gold400,
            fontFamily: FF_SANS,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.gold500,
              display: "inline-block",
              animation: "pulse 2s infinite",
            }}
          />
          <span>{t("hero.badge")}</span>
        </div>

        <h1 className="animate-fade-in" style={{ margin: 0 }}>
          <BrandLogo variant="horizontal" size="lg" tone="light" className="ameen-hero__identity" />
        </h1>
        <div data-narrate-id="home-hero-tagline" className="flex flex-col items-center" style={{ marginTop: 8 }}>
          <p lang="en" dir="ltr" style={{ fontFamily: FF_SANS, fontSize: "clamp(12px, 1.4vw, 17px)", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C5A365" }}>The Nation’s Trusted Guardian</p>
          <p lang="ar" dir="rtl" className="ameen-hero__arabic-tagline">الحارس الأمين للوطن</p>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span style={{ color: C.ivory200, fontSize: "0.6875rem", letterSpacing: "0.2em", fontFamily: "'JetBrains Mono', monospace" }}>
          SCROLL
        </span>
        <i className="ri-arrow-down-line" style={{ color: C.ivory200 }} />
      </div>
    </section>
  );
};

export default HeroSection;
