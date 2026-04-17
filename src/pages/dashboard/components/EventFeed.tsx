import { eventFeedByType, type EntityType } from "@/mocks/dashboardData";

interface Props {
  entityType: EntityType;
  isAr: boolean;
}

const statusConfig = {
  accepted: { color: "#4ADE80", bg: "rgba(74,222,128,0.1)", labelEn: "Accepted", labelAr: "مقبول" },
  pending:  { color: "#FACC15", bg: "rgba(250,204,21,0.1)",  labelEn: "Pending",  labelAr: "معلق" },
  rejected: { color: "#F87171", bg: "rgba(248,113,113,0.1)", labelEn: "Rejected", labelAr: "مرفوض" },
};

// Lightweight Arabic-ization of the canned English relative-time strings in mock data
// ("2 min ago", "1 hr ago", "1.5 hr ago", "just now"). Numeric digits stay Western as
// that matches the JetBrains_Mono aesthetic used elsewhere in the feed.
const formatTimeAr = (t: string): string => {
  const s = t.trim().toLowerCase();
  if (s === "just now") return "الآن";
  const m = s.match(/^([\d.]+)\s*(min|mins|minute|minutes|hr|hrs|hour|hours|sec|secs|second|seconds|day|days)\s*ago$/);
  if (!m) return t;
  const value = m[1];
  const unit = m[2];
  const unitAr = unit.startsWith("sec") ? "ث" : unit.startsWith("min") ? "د" : unit.startsWith("hr") || unit.startsWith("hour") ? "س" : "يوم";
  return `قبل ${value} ${unitAr}`;
};

const EventFeed = ({ entityType, isAr }: Props) => {
  const events = eventFeedByType[entityType] || eventFeedByType["hotel"];

  return (
    <div className="flex flex-col h-full rounded-xl border overflow-hidden"
      style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div>
          <h3 className="text-white font-bold text-sm font-['Inter']">
            {isAr ? "آخر الأحداث" : "Recent Event Activities"}
          </h3>
          <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-0.5">
            {isAr ? "تحديث فوري" : "Live feed"}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-['JetBrains_Mono']">{isAr ? "مباشر" : "LIVE"}</span>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        {events.map((ev, i) => {
          const sc = statusConfig[ev.status];
          return (
            <div
              key={ev.id}
              className="px-5 py-4 border-b hover:bg-white/2 transition-colors cursor-default"
              style={{ borderColor: "rgba(255,255,255,0.04)", animationDelay: `${i * 80}ms` }}
            >
              {/* Top row: type pill + ref + time */}
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full font-['Inter'] whitespace-nowrap"
                    style={{ background: ev.color + "18", color: ev.color, border: `1px solid ${ev.color}33` }}
                  >
                    {isAr ? ev.typeAr : ev.type}
                  </span>
                  <span className="text-cyan-400 text-xs font-['JetBrains_Mono'] hover:text-cyan-300 cursor-pointer">
                    #{ev.ref}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-['JetBrains_Mono']"
                    style={{ background: sc.bg, color: sc.color }}
                  >
                    {isAr ? sc.labelAr : sc.labelEn}
                  </span>
                  <span className="text-gray-600 text-xs font-['JetBrains_Mono'] whitespace-nowrap">{isAr ? formatTimeAr(ev.time) : ev.time}</span>
                </div>
              </div>

              {/* Detail */}
              <p className="text-gray-400 text-xs leading-relaxed font-['Inter']">
                {isAr ? ev.detailAr : ev.detail}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <button className="w-full text-center text-cyan-400 text-xs font-semibold hover:text-cyan-300 transition-colors cursor-pointer font-['Inter']">
          {isAr ? "عرض جميع الأحداث ›" : "View All Events ›"}
        </button>
      </div>
    </div>
  );
};

export default EventFeed;
