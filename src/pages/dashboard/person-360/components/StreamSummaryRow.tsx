import type { StreamSummary } from "@/mocks/person360Data";

interface Props {
  streams: StreamSummary[];
  activeFilter: string | null;
  onFilterChange: (stream: string | null) => void;
  isAr: boolean;
}

const streamLabels: Record<string, { en: string; ar: string }> = {
  border:       { en: "Border",       ar: "الحدود" },
  hotel:        { en: "Hotel",        ar: "الفنادق" },
  mobile:       { en: "Mobile",       ar: "الاتصالات" },
  "car-rental": { en: "Car Rental",   ar: "السيارات" },
  financial:    { en: "Financial",    ar: "المالية" },
  transport:    { en: "Transport",    ar: "النقل" },
  employment:   { en: "Employment",   ar: "التوظيف" },
  municipality: { en: "Municipality", ar: "البلدية" },
  ecommerce:    { en: "E-Commerce",   ar: "التجارة" },
  social:       { en: "Social",       ar: "التواصل" },
  marine:       { en: "Marine",       ar: "البحرية" },
  customs:      { en: "Customs",      ar: "الجمارك" },
  utility:      { en: "Utility",      ar: "المرافق" },
  health:       { en: "Health",       ar: "الصحة" },
  education:    { en: "Education",    ar: "التعليم" },
};

const StreamSummaryRow = ({ streams, activeFilter, onFilterChange, isAr }: Props) => {
  const activeCount = streams.filter(s => s.active).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-white text-sm font-bold font-['Inter'] uppercase tracking-wider">
            {isAr ? "ملخص النشاط — 15 تدفقاً" : "15-Stream Activity Summary"}
          </h3>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono']"
            style={{ background: "rgba(34,211,238,0.1)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}
          >
            {activeCount} {isAr ? "نشط" : "active"}
          </span>
        </div>
        {activeFilter && (
          <button
            onClick={() => onFilterChange(null)}
            className="text-xs px-2.5 py-1 rounded cursor-pointer font-['JetBrains_Mono'] flex items-center gap-1"
            style={{ color: "#22D3EE", border: "1px solid rgba(34,211,238,0.3)", background: "rgba(34,211,238,0.05)" }}
          >
            <i className="ri-close-line" />
            {isAr ? "إلغاء الفلتر" : "Clear Filter"}
          </button>
        )}
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
        {streams.map((s) => {
          const isActive = s.active;
          const isSelected = activeFilter === s.stream;
          const label = streamLabels[s.stream];

          return (
            <button
              key={s.stream}
              onClick={() => isActive ? onFilterChange(isSelected ? null : s.stream) : undefined}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 group"
              style={{
                background: isSelected
                  ? `${s.color}22`
                  : isActive
                    ? "rgba(10,22,40,0.8)"
                    : "rgba(10,22,40,0.3)",
                border: isSelected
                  ? `1px solid ${s.color}88`
                  : isActive
                    ? "1px solid rgba(34,211,238,0.15)"
                    : "1px solid rgba(255,255,255,0.04)",
                opacity: isActive ? 1 : 0.35,
                cursor: isActive ? "pointer" : "default",
              }}
              title={`${label?.en || s.stream}: ${s.label}`}
            >
              <div
                className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
                style={{
                  background: isActive ? `${s.color}18` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? s.color + "44" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <i className={`${s.icon} text-xs`} style={{ color: isActive ? s.color : "#4B5563" }} />
              </div>
              <div className="text-center">
                <p className="font-bold font-['JetBrains_Mono'] leading-tight" style={{ color: isActive ? s.color : "#4B5563", fontSize: 11 }}>
                  {isActive ? s.count : "—"}
                </p>
                <p className="text-gray-600 font-['Inter'] leading-tight mt-0.5 truncate" style={{ fontSize: 8, maxWidth: 52 }}>
                  {isAr ? (label?.ar || s.stream) : (label?.en || s.stream)}
                </p>
              </div>
              {isActive && s.count > 0 && (
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.color }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Active stream summary bar */}
      {activeFilter && (
        <div
          className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.15)" }}
        >
          <i className="ri-filter-line text-cyan-400 text-xs" />
          <span className="text-cyan-400 text-xs font-['JetBrains_Mono']">
            {isAr ? "فلتر نشط:" : "Active filter:"} {streamLabels[activeFilter]?.en || activeFilter}
          </span>
          <span className="text-gray-500 text-xs font-['JetBrains_Mono'] ml-1">
            — {isAr ? "عرض أحداث هذا التدفق فقط في الجدول الزمني" : "showing only this stream's events in timeline"}
          </span>
        </div>
      )}
    </div>
  );
};

export default StreamSummaryRow;
