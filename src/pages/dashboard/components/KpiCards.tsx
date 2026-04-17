import { useNavigate } from "react-router-dom";
import { kpiByType, type EntityType } from "@/mocks/dashboardData";

interface Props {
  entityType: EntityType;
  isAr: boolean;
}

const KpiCards = ({ entityType, isAr }: Props) => {
  const navigate = useNavigate();
  const cards = kpiByType[entityType] || kpiByType["hotel"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="flex flex-col p-5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 group"
          style={{
            background: "rgba(10,37,64,0.8)",
            borderColor: "rgba(184,138,60,0.12)",
            backdropFilter: "blur(12px)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = card.color + "44";
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${card.color}0A`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(184,138,60,0.12)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          }}
        >
          {/* Top row: icon + delta */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl"
              style={{ background: card.color + "15", border: `1px solid ${card.color}30` }}>
              <i className={`${card.icon} text-lg`} style={{ color: card.color }} />
            </div>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono']`}
              style={{
                background: card.deltaUp ? "rgba(74,222,128,0.1)" : "rgba(201,74,94,0.1)",
                color: card.deltaUp ? "#4ADE80" : "#C94A5E",
              }}>
              <i className={card.deltaUp ? "ri-arrow-up-line text-xs" : "ri-arrow-down-line text-xs"} />
              {card.delta}
            </div>
          </div>

          {/* Value */}
          <div className="mb-1">
            <span className="text-3xl font-black font-['JetBrains_Mono']" style={{ color: card.color }}>
              {card.value}
            </span>
          </div>

          {/* Label */}
          <p className="text-gray-500 text-xs font-['Inter'] mb-4 flex-1">
            {isAr ? card.labelAr : card.label}
          </p>

          {/* Bottom: See Details + Action */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <button className="text-gold-400 text-xs font-semibold hover:text-gold-300 transition-colors cursor-pointer font-['Inter'] whitespace-nowrap">
              {isAr ? "عرض التفاصيل ›" : "See Details ›"}
            </button>
            <button
              onClick={() => {
                if (entityType === "hotel") navigate("/dashboard/hotel-events");
                else if (entityType === "car-rental") navigate("/dashboard/car-rental-events");
                else if (entityType === "mobile") navigate("/dashboard/mobile-events");
                else if (entityType === "municipality") navigate("/dashboard/municipality-events");
                else if (entityType === "payment") navigate("/dashboard/financial-events");
                else if (entityType === "border") navigate("/dashboard/border-intelligence");
                else if (entityType === "utility") navigate("/dashboard/utility-events");
                else if (entityType === "transport") navigate("/dashboard/transport-intelligence");
                else if (entityType === "employment") navigate("/dashboard/employment-registry");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-['Inter']"
              style={{
                background: card.color + "15",
                border: `1px solid ${card.color}30`,
                color: card.color,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = card.color;
                (e.currentTarget as HTMLButtonElement).style.color = "#051428";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = card.color + "15";
                (e.currentTarget as HTMLButtonElement).style.color = card.color;
              }}
            >
              <i className="ri-add-line text-xs" />
              {isAr ? card.actionAr : card.action}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KpiCards;
