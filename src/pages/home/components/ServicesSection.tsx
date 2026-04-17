import { useTranslation } from "react-i18next";
import ServiceCard from "./ServiceCard";

const coreCards = [
  {
    icon: "ri-hotel-line",
    categoryKey: "services.core.hotel.category",
    titleKey: "services.core.hotel.title",
    descKey: "services.core.hotel.description",
    eventsKey: "services.core.hotel.events",
    badgeType: "core" as const,
    badgeColor: "#D6B47E",
    categoryColor: "#D6B47E",
    streamNum: "01",
  },
  {
    icon: "ri-car-line",
    categoryKey: "services.core.carRental.category",
    titleKey: "services.core.carRental.title",
    descKey: "services.core.carRental.description",
    eventsKey: "services.core.carRental.events",
    badgeType: "core" as const,
    badgeColor: "#D6B47E",
    categoryColor: "#D6B47E",
    streamNum: "02",
  },
  {
    icon: "ri-sim-card-line",
    categoryKey: "services.core.mobile.category",
    titleKey: "services.core.mobile.title",
    descKey: "services.core.mobile.description",
    eventsKey: "services.core.mobile.events",
    badgeType: "core" as const,
    badgeColor: "#D6B47E",
    categoryColor: "#D6B47E",
    streamNum: "03",
  },
  {
    icon: "ri-government-line",
    categoryKey: "services.core.municipality.category",
    titleKey: "services.core.municipality.title",
    descKey: "services.core.municipality.description",
    eventsKey: "services.core.municipality.events",
    badgeType: "core" as const,
    badgeColor: "#D6B47E",
    categoryColor: "#D6B47E",
    streamNum: "04",
  },
];

const extendedCards = [
  {
    icon: "ri-bank-card-line",
    categoryKey: "services.extended.payment.category",
    titleKey: "services.extended.payment.title",
    descKey: "services.extended.payment.description",
    eventsKey: "services.extended.payment.events",
    badgeType: "extended" as const,
    badgeColor: "#4ADE80",
    categoryColor: "#4ADE80",
    streamNum: "05",
  },
  {
    icon: "ri-passport-line",
    categoryKey: "services.extended.borders.category",
    titleKey: "services.extended.borders.title",
    descKey: "services.extended.borders.description",
    eventsKey: "services.extended.borders.events",
    badgeType: "extended" as const,
    badgeColor: "#60A5FA",
    categoryColor: "#60A5FA",
    streamNum: "06",
  },
  {
    icon: "ri-heart-pulse-line",
    categoryKey: "services.extended.health.category",
    titleKey: "services.extended.health.title",
    descKey: "services.extended.health.description",
    eventsKey: "services.extended.health.events",
    badgeType: "extended" as const,
    badgeColor: "#C94A5E",
    categoryColor: "#C94A5E",
    streamNum: "07",
  },
  {
    icon: "ri-flashlight-line",
    categoryKey: "services.extended.utility.category",
    titleKey: "services.extended.utility.title",
    descKey: "services.extended.utility.description",
    eventsKey: "services.extended.utility.events",
    badgeType: "extended" as const,
    badgeColor: "#FACC15",
    categoryColor: "#FACC15",
    streamNum: "08",
  },
  {
    icon: "ri-bus-line",
    categoryKey: "services.extended.transport.category",
    titleKey: "services.extended.transport.title",
    descKey: "services.extended.transport.description",
    eventsKey: "services.extended.transport.events",
    badgeType: "extended" as const,
    badgeColor: "#C98A1B",
    categoryColor: "#C98A1B",
    streamNum: "09",
  },
  {
    icon: "ri-graduation-cap-line",
    categoryKey: "services.extended.education.category",
    titleKey: "services.extended.education.title",
    descKey: "services.extended.education.description",
    eventsKey: "services.extended.education.events",
    badgeType: "extended" as const,
    badgeColor: "#A78BFA",
    categoryColor: "#A78BFA",
    streamNum: "10",
  },
  {
    icon: "ri-briefcase-line",
    categoryKey: "services.extended.employment.category",
    titleKey: "services.extended.employment.title",
    descKey: "services.extended.employment.description",
    eventsKey: "services.extended.employment.events",
    badgeType: "extended" as const,
    badgeColor: "#F9A8D4",
    categoryColor: "#F9A8D4",
    streamNum: "11",
  },
  {
    icon: "ri-shopping-cart-line",
    categoryKey: "services.extended.ecommerce.category",
    titleKey: "services.extended.ecommerce.title",
    descKey: "services.extended.ecommerce.description",
    eventsKey: "services.extended.ecommerce.events",
    badgeType: "extended" as const,
    badgeColor: "#34D399",
    categoryColor: "#34D399",
    streamNum: "12",
  },
  {
    icon: "ri-global-line",
    categoryKey: "services.extended.social.category",
    titleKey: "services.extended.social.title",
    descKey: "services.extended.social.description",
    eventsKey: "services.extended.social.events",
    badgeType: "extended" as const,
    badgeColor: "#38BDF8",
    categoryColor: "#38BDF8",
    streamNum: "13",
  },
  {
    icon: "ri-ship-line",
    categoryKey: "services.extended.customs.category",
    titleKey: "services.extended.customs.title",
    descKey: "services.extended.customs.description",
    eventsKey: "services.extended.customs.events",
    badgeType: "extended" as const,
    badgeColor: "#FCD34D",
    categoryColor: "#FCD34D",
    streamNum: "14",
  },
  {
    icon: "ri-anchor-line",
    categoryKey: "services.extended.marine.category",
    titleKey: "services.extended.marine.title",
    descKey: "services.extended.marine.description",
    eventsKey: "services.extended.marine.events",
    badgeType: "extended" as const,
    badgeColor: "#D6B47E",
    categoryColor: "#D6B47E",
    streamNum: "15",
  },
  {
    icon: "ri-mail-send-line",
    categoryKey: "services.extended.postal.category",
    titleKey: "services.extended.postal.title",
    descKey: "services.extended.postal.description",
    eventsKey: "services.extended.postal.events",
    badgeType: "extended" as const,
    badgeColor: "#A78BFA",
    categoryColor: "#A78BFA",
    streamNum: "16",
  },
];

interface ServicesSectionProps {
  type: "core" | "extended";
}

const ServicesSection = ({ type }: ServicesSectionProps) => {
  const { t } = useTranslation();
  const cards = type === "core" ? coreCards : extendedCards;
  const sectionId = type === "core" ? "core-services" : "extended-services";
  const sectionTitle = type === "core" ? "Core Streams" : "Extended Streams";
  const sectionTitleAr = type === "core" ? "المصادر الأساسية" : "المصادر الموسعة";
  const count = type === "core" ? "4" : "12";
  const badgeColor = type === "core" ? "#D6B47E" : "#4ADE80";

  return (
    <section
      id={sectionId}
      className="py-20 md:py-28 relative"
      style={{ background: "#051428" }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(184,138,60,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4"
            style={{ borderColor: badgeColor + "40", background: badgeColor + "08" }}
          >
            <span
              className="text-xs font-['JetBrains_Mono'] tracking-widest uppercase"
              style={{ color: badgeColor }}
            >
              {count} {type === "core" ? "CORE" : "EXTENDED"} STREAMS
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-['Inter'] mb-2">
            {sectionTitle}
          </h2>
          <p className="text-gray-500 text-base font-['Cairo']">{sectionTitleAr}</p>
          <div className="w-16 h-0.5 mx-auto mt-4" style={{ background: badgeColor }} />
          <p className="text-gray-400 text-sm mt-4 max-w-xl mx-auto font-['Inter']">
            {t("services.subtitle")}
          </p>
        </div>

        {/* Cards Grid — 4 columns for core, 4 columns for extended (4×4 layout) */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <ServiceCard key={i} {...card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
