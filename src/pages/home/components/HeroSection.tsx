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
      style={{ background: "#060D1A" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(34,211,238,0.07) 0%, transparent 70%)",
        }}
      />
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/30"
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

      {/* Hexagonal shield logo area */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5"
          style={{
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-8 pt-28 pb-16 flex flex-col items-center text-center">
        {/* Authority badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/40 bg-cyan-500/5 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 text-xs font-['JetBrains_Mono'] tracking-widest uppercase">
            {t("hero.badge")}
          </span>
        </div>

        {/* Shield Icon */}
        <div className="relative mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div
            className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center mx-auto relative"
            style={{
              background: "rgba(34,211,238,0.06)",
              border: "2px solid rgba(34,211,238,0.4)",
              clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(34,211,238,0.03)",
                clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
              }}
            />
            <span
              className="text-4xl md:text-5xl font-black relative z-10"
              style={{
                color: "#22D3EE",
                fontFamily: "Inter, sans-serif",
                textShadow: "0 0 20px rgba(34,211,238,0.6)",
              }}
            >
              A
            </span>
          </div>
          {/* Outer ring */}
          <div
            className="absolute inset-0 -m-2 opacity-30 animate-spin"
            style={{
              border: "1px dashed rgba(34,211,238,0.4)",
              borderRadius: "50%",
              animationDuration: "20s",
            }}
          />
        </div>

        {/* Main Title */}
        <div className="mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight font-['Inter'] leading-none mb-2">
            {isAr ? "الامين" : "Al-Ameen"}
          </h1>
          <div className="text-xl md:text-2xl font-light mb-1" style={{ color: "#22D3EE", fontFamily: "Cairo, sans-serif" }}>
            {isAr ? "Al-Ameen" : "الامين"}
          </div>
        </div>

        {/* Tagline */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="h-px w-12 bg-cyan-400/50" />
          <span className="text-cyan-400 font-semibold text-sm md:text-base font-['Inter'] tracking-wide">
            {t("hero.tagline")}
          </span>
          <span className="text-gray-500 text-sm font-['Cairo']">{t("hero.arabicTagline")}</span>
          <div className="h-px w-12 bg-cyan-400/50" />
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mb-10 leading-relaxed font-['Inter'] animate-fade-in" style={{ animationDelay: "0.5s" }}>
          {t("hero.description")}
        </p>

        {/* Animated Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mt-8 animate-fade-in" style={{ animationDelay: "0.7s" }}>
          {[
            { value: formatNumber(eventsCount), label: t("counters.events"), color: "#22D3EE", icon: "ri-pulse-line", bg: "rgba(34,211,238,0.08)", border: "rgba(34,211,238,0.2)" },
            { value: alertsCount.toLocaleString(), label: t("counters.alerts"), color: "#FACC15", icon: "ri-alarm-warning-line", bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.2)" },
            { value: sourcesCount.toString(), label: t("counters.sources"), color: "#4ADE80", icon: "ri-database-2-line", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)" },
            { value: entitiesCount.toLocaleString(), label: t("counters.entities"), color: "#FB923C", icon: "ri-building-2-line", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.2)" },
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
                className="text-2xl md:text-3xl font-black font-['JetBrains_Mono']"
                style={{ color: item.color }}
              >
                {item.value}
              </span>
              <span className="text-gray-500 text-xs mt-1 text-center font-['Inter']">{item.label}</span>
            </div>
          ))}
        </div>

        {/* System status bar */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 mt-8 px-6 py-3 rounded-full animate-fade-in"
          style={{ background: "rgba(10,22,40,0.6)", border: "1px solid rgba(34,211,238,0.1)", animationDelay: "0.8s" }}
        >
          {[
            { label: "14 Data Streams", icon: "ri-stack-line", color: "#22D3EE" },
            { label: "System Operational", icon: "ri-checkbox-circle-line", color: "#4ADE80" },
            { label: "Border Control System", icon: "ri-shield-check-line", color: "#22D3EE" },
            { label: "National Police HQ", icon: "ri-government-line", color: "#9CA3AF" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className={`${item.icon} text-xs`} style={{ color: item.color }} />
              </div>
              <span className="text-xs font-['JetBrains_Mono'] whitespace-nowrap" style={{ color: item.color === "#9CA3AF" ? "#9CA3AF" : item.color }}>
                {item.label}
              </span>
              {i < 3 && <span className="text-gray-700 ml-2">|</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-gray-600 text-xs font-['JetBrains_Mono']">SCROLL</span>
        <i className="ri-arrow-down-line text-gray-600" />
      </div>


    </section>
  );
};

export default HeroSection;
