import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { counterTargets } from "@/mocks/ameenData";

const useCountUp = (target: number, duration = 2500, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M+";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K+";
  return n.toLocaleString();
};

const HeroSection = () => {
  const { t } = useTranslation();
  const isAr = i18n.language === "ar";
  const [countersStarted, setCountersStarted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const eventsCount = useCountUp(counterTargets.events, 2800, countersStarted);
  const alertsCount = useCountUp(counterTargets.alerts, 2000, countersStarted);
  const sourcesCount = useCountUp(counterTargets.sources, 1500, countersStarted);
  const entitiesCount = useCountUp(counterTargets.entities, 2200, countersStarted);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCountersStarted(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #141D2E 0%, #0B1220 100%)" }}
    >
      {/* Grid background — gold tracery */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(181,142,60,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(181,142,60,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow — warm gold centerpoint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(181,142,60,0.08) 0%, transparent 70%)",
        }}
      />
      {/* Animated particles — gold */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gold-400/30"
            style={{
              width: (i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5) + "px",
              height: (i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5) + "px",
              left: ((i * 4.17) % 100) + "%",
              top: ((i * 7.3) % 100) + "%",
              animation: `float ${(i % 5) + 6}s ease-in-out infinite`,
              animationDelay: (i * 0.3) + "s",
            }}
          />
        ))}
      </div>

      {/* Brand mark halo */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5"
          style={{
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(181,142,60,0.35) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-8 pt-28 pb-16 flex flex-col items-center text-center">
        {/* Authority badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/40 bg-gold-500/5 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-gold-400 text-xs font-mono tracking-widest uppercase">
            {t("hero.badge")}
          </span>
        </div>

        {/* Brand Mark — Al-Ameen shield mark (mono-light on dark) */}
        <div className="relative mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <img
            src="/brand/al-ameen-mark-mono-light.svg"
            alt="Al-Ameen"
            className="w-24 h-24 md:w-28 md:h-28 relative z-10"
            style={{ filter: "drop-shadow(0 0 24px rgba(181,142,60,0.45))" }}
          />
          {/* Outer ring — ceremonial gold */}
          <div
            className="absolute inset-0 -m-2 opacity-30 animate-spin"
            style={{
              border: "1px dashed rgba(181,142,60,0.5)",
              borderRadius: "50%",
              animationDuration: "20s",
            }}
          />
        </div>

        {/* Main Title — display serif for ceremony */}
        <div className="mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h1 className="text-5xl md:text-7xl font-semibold text-ivory-100 tracking-tight font-display leading-none mb-2">
            {isAr ? "الأمين" : "Al-Ameen"}
          </h1>
          <div className="text-xl md:text-2xl font-light mb-1 text-gold-400 font-arabic">
            {isAr ? "Al-Ameen" : "الأمين"}
          </div>
        </div>

        {/* Tagline */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="h-px w-12 bg-gold-400/55" />
          <span className="text-gold-400 font-semibold text-sm md:text-base font-['Inter'] tracking-wide">
            {t("hero.tagline")}
          </span>
          <span className="text-ivory-300 text-sm font-arabic">{t("hero.arabicTagline")}</span>
          <div className="h-px w-12 bg-gold-400/55" />
        </div>

        {/* Description */}
        <p className="text-ivory-200/70 text-sm md:text-base max-w-2xl mb-10 leading-relaxed font-['Inter'] animate-fade-in" style={{ animationDelay: "0.5s" }}>
          {t("hero.description")}
        </p>

        {/* Animated Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mt-8 animate-fade-in" style={{ animationDelay: "0.7s" }}>
          {[
            // Mapped from cyan/yellow/green/orange sprint palette to brand-aligned hues:
            // events -> gold-400, alerts -> oman-red, sources -> olive, entities -> ember.
            { value: formatNumber(eventsCount), label: t("counters.events"),  color: "#D4A84B", icon: "ri-pulse-line",         bg: "rgba(181,142,60,0.1)", border: "rgba(181,142,60,0.28)" },
            { value: alertsCount.toLocaleString(), label: t("counters.alerts"),  color: "#9A1F24", icon: "ri-alarm-warning-line", bg: "rgba(154,31,36,0.1)",  border: "rgba(154,31,36,0.3)" },
            { value: sourcesCount.toString(),    label: t("counters.sources"),  color: "#4F9A35", icon: "ri-database-2-line",    bg: "rgba(79,154,53,0.1)",  border: "rgba(79,154,53,0.28)" },
            { value: entitiesCount.toLocaleString(), label: t("counters.entities"),color: "#D25A2A", icon: "ri-building-2-line",    bg: "rgba(210,90,42,0.1)",  border: "rgba(210,90,42,0.28)" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-4 rounded-xl"
              style={{ background: item.bg, border: `1px solid ${item.border}`, backdropFilter: "blur(12px)" }}
            >
              <div className="w-8 h-8 flex items-center justify-center mb-2">
                <i className={`${item.icon} text-lg`} style={{ color: item.color }} />
              </div>
              <span
                className="text-2xl md:text-3xl font-black font-mono"
                style={{ color: item.color }}
              >
                {item.value}
              </span>
              <span className="text-ivory-300 text-xs mt-1 text-center font-['Inter']">{item.label}</span>
            </div>
          ))}
        </div>

        {/* System status bar */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 mt-8 px-6 py-3 rounded-full animate-fade-in"
          style={{ background: "rgba(20,29,46,0.65)", border: "1px solid rgba(181,142,60,0.15)", animationDelay: "0.8s" }}
        >
          {[
            { label: "14 Data Streams",        icon: "ri-stack-line",          color: "#D4A84B" },
            { label: "System Operational",     icon: "ri-checkbox-circle-line",color: "#4F9A35" },
            { label: "Border Control System",  icon: "ri-shield-check-line",   color: "#D4A84B" },
            { label: "National Police HQ",     icon: "ri-government-line",     color: "#8B95B0" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className={`${item.icon} text-xs`} style={{ color: item.color }} />
              </div>
              <span className="text-xs font-mono whitespace-nowrap" style={{ color: item.color }}>
                {item.label}
              </span>
              {i < 3 && <span className="text-midnight-400 ml-2">|</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-ivory-300 text-xs font-mono">SCROLL</span>
        <i className="ri-arrow-down-line text-ivory-300" />
      </div>


    </section>
  );
};

export default HeroSection;
