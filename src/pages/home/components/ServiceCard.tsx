import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ServiceCardProps {
  icon: string;
  categoryKey: string;
  titleKey: string;
  descKey: string;
  eventsKey: string;
  badgeType: "core" | "extended";
  badgeColor: string;
  categoryColor: string;
  index: number;
  streamNum: string;
}

const ServiceCard = ({
  icon,
  categoryKey,
  titleKey,
  descKey,
  eventsKey,
  badgeType,
  badgeColor,
  categoryColor,
  index,
  streamNum,
}: ServiceCardProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const events = t(eventsKey, { returnObjects: true }) as string[];
  const badgeLabel = badgeType === "core" ? t("services.coreBadge") : t("services.extendedBadge");

  return (
    <div
      className="relative flex flex-col rounded-xl border transition-all duration-300 hover:-translate-y-1 cursor-default group"
      style={{
        background: "rgba(10,37,64,0.8)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(184,138,60,0.12)",
        animationDelay: `${index * 60}ms`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = badgeColor + "55";
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 18px ${badgeColor}10`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(184,138,60,0.12)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div className="p-5 flex flex-col flex-1">
        {/* Top row: stream number + badge + icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-['JetBrains_Mono'] font-bold px-1.5 py-0.5 rounded"
              style={{ color: "#9CA3AF", background: "rgba(255,255,255,0.04)" }}
            >
              {streamNum}
            </span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full font-['Inter']"
              style={{
                background: badgeColor + "18",
                color: badgeColor,
                border: `1px solid ${badgeColor}35`,
              }}
            >
              {badgeLabel}
            </span>
          </div>
          <div
            className="w-9 h-9 flex items-center justify-center rounded-lg"
            style={{ background: badgeColor + "12", border: `1px solid ${badgeColor}25` }}
          >
            <i className={`${icon} text-lg`} style={{ color: badgeColor }} />
          </div>
        </div>

        {/* Category */}
        <span className="text-xs font-semibold mb-1 font-['Inter']" style={{ color: categoryColor }}>
          {t(categoryKey)}
        </span>

        {/* Title */}
        <h3 className="text-white font-bold text-sm mb-2 font-['Inter'] leading-snug">
          {t(titleKey)}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-xs leading-relaxed flex-1 font-['Inter']">
          {t(descKey)}
        </p>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-4 text-xs font-semibold hover:opacity-80 transition-all duration-200 cursor-pointer whitespace-nowrap font-['Inter']"
          style={{ color: badgeColor }}
        >
          {expanded ? t("services.hideEvents") : t("services.showEvents")}
          <i className={`transition-transform duration-200 ${expanded ? "ri-arrow-up-s-line" : "ri-arrow-right-s-line"}`} />
        </button>

        {/* Events list */}
        {expanded && Array.isArray(events) && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="flex flex-wrap gap-1.5">
              {events.map((ev, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded-full font-['JetBrains_Mono']"
                  style={{
                    background: badgeColor + "0D",
                    border: `1px solid ${badgeColor}25`,
                    color: "#9CA3AF",
                  }}
                >
                  {ev}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
