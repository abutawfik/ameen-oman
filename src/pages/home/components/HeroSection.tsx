import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

// ─── Brand token constants — inline hex so we never depend on JIT-compiled
//     utility classes. These mirror al-ameen-brand/style-guide.html.
//     Ocean (midnight) ramp now resolves via CSS vars so the runtime palette
//     switcher (src/brand/PaletteSwitcher.tsx) can flip v1.0 ↔ v1.1 live. ────
const C = {
  midnight800: "var(--alm-ocean-800)",
  ivory100:    "#F8F5F0",
  ivory200:    "#EFE8D7",
  gold400:     "#D6B47E",
  gold500:     "#C99C48",
};

const FF_DISPLAY = "'Cormorant Garamond', Georgia, serif";
const FF_ARABIC  = "'Cairo', 'Tajawal', 'IBM Plex Sans Arabic', sans-serif";
const FF_SANS    = "'Inter', ui-sans-serif, system-ui, sans-serif";

const HeroSection = () => {
  const { t } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        // Ceremonial hero background — radial royal-red glow over midnight canvas.
        background: `radial-gradient(ellipse at top, rgba(201,74,94,0.15), transparent 60%), ${C.midnight800}`,
      }}
    >
      {/* Gold-dashed grid tracery overlay — 40px grid, 5% opacity */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(184,138,60,1) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.05,
        }}
      />

      {/* Soft centerpoint bloom */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(184,138,60,0.08) 0%, transparent 70%)",
        }}
      />

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

        {/* Shield mark — ceremonial gold drop-shadow */}
        <div className="relative mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <img
            src="/brand/al-ameen-mark-mono-light.svg"
            alt="Al-Ameen"
            style={{
              width: 96,
              height: 96,
              filter: "drop-shadow(0 8px 24px rgba(184,138,60,0.25))",
            }}
          />
        </div>

        {/* Title — language-aware: show ONLY the active language, never both */}
        <h1
          className="animate-fade-in"
          style={{
            fontFamily: isAr ? FF_ARABIC : FF_DISPLAY,
            fontSize: "clamp(3.5rem, 8vw, 4.5rem)",
            fontWeight: 500,
            letterSpacing: isAr ? "0" : "-0.025em",
            lineHeight: 1,
            color: C.ivory100,
            direction: isAr ? "rtl" : "ltr",
            marginBottom: "1.5rem",
            animationDelay: "0.2s",
          }}
        >
          {isAr ? "الأمين" : "Al-Ameen"}
        </h1>

        {/* Tagline block — bilingual: primary language between gold rules,
            counterpart below as a smaller subordinate line. Both languages
            show regardless of UI mode so the Arabic slogan الحارس الأمين للوطن
            is always visible on the home page (per brand's bilingual-equality
            principle). */}
        <div
          data-narrate-id="home-hero-tagline"
          className="animate-fade-in flex flex-col items-center gap-2"
          style={{ marginBottom: "1.5rem", animationDelay: "0.4s" }}
        >
          {/* Primary tagline — in the current UI language, between gold rules */}
          <div
            dir={isAr ? "rtl" : "ltr"}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.25rem" }}
          >
            <span style={{ height: 1, width: 60, background: "linear-gradient(90deg, transparent, " + C.gold500 + ")" }} />
            <span
              style={{
                fontFamily: isAr ? FF_ARABIC : FF_DISPLAY,
                fontSize: isAr ? "1.125rem" : "1.25rem",
                fontWeight: 500,
                fontStyle: isAr ? "normal" : "italic",
                color: C.ivory100,
              }}
            >
              {/* `t("hero.tagline")` auto-resolves to the current locale's value:
                  EN → "The Nation's Trusted Guardian" · AR → الحارس الأمين للوطن */}
              {t("hero.tagline")}
            </span>
            <span style={{ height: 1, width: 60, background: "linear-gradient(90deg, " + C.gold500 + ", transparent)" }} />
          </div>
          {/* Counterpart — opposite-language version. In EN mode this is the
              Arabic slogan (gold Cairo). In AR mode this is the English italic
              tagline. `t("hero.arabicTagline")` carries the counterpart in
              each locale file. */}
          <span
            dir={isAr ? "ltr" : "rtl"}
            lang={isAr ? "en" : "ar"}
            style={{
              fontFamily: isAr ? FF_DISPLAY : FF_ARABIC,
              fontSize: isAr ? "0.875rem" : "1rem",
              fontWeight: isAr ? 400 : 500,
              fontStyle: isAr ? "italic" : "normal",
              color: C.gold400,
              opacity: 0.9,
              letterSpacing: isAr ? "0.01em" : "0.02em",
            }}
          >
            {t("hero.arabicTagline")}
          </span>
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
