import { useState } from "react";
import { correlationAlerts, type CorrelationAlert } from "@/mocks/nationalSecurityData";

interface Props {
  isAr: boolean;
}

const SEV_CONFIG = {
  critical: { color: "#C94A5E", bg: "rgba(201,74,94,0.1)", border: "rgba(201,74,94,0.3)", label: "Critical", labelAr: "حرج" },
  high:     { color: "#C98A1B", bg: "rgba(201,138,27,0.1)",  border: "rgba(201,138,27,0.3)",  label: "High",     labelAr: "عالٍ" },
  medium:   { color: "#FACC15", bg: "rgba(250,204,21,0.1)",  border: "rgba(250,204,21,0.3)",  label: "Medium",   labelAr: "متوسط" },
};

const STATUS_CONFIG = {
  new:       { color: "#C94A5E", label: "New",       labelAr: "جديد" },
  reviewing: { color: "#FACC15", label: "Reviewing", labelAr: "قيد المراجعة" },
  actioned:  { color: "#4ADE80", label: "Actioned",  labelAr: "تم الإجراء" },
};

const CrossStreamCorrelation = ({ isAr }: Props) => {
  const [selected, setSelected] = useState<CorrelationAlert | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "reviewing" | "actioned">("all");

  const filtered = filter === "all" ? correlationAlerts : correlationAlerts.filter((c) => c.status === filter);

  const newCount = correlationAlerts.filter((c) => c.status === "new").length;
  const criticalCount = correlationAlerts.filter((c) => c.severity === "critical").length;

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-xl"
            style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
            <i className="ri-git-merge-line text-purple-400 text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{isAr ? "تنبيهات الارتباط المتقاطع" : "Cross-Stream Correlation Alerts"}</h3>
            <p className="text-gray-500 text-xs font-['JetBrains_Mono']">
              {newCount} {isAr ? "جديد" : "new"} · {criticalCount} {isAr ? "حرج" : "critical"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {(["all", "new", "reviewing", "actioned"] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
              style={{
                background: filter === f ? "rgba(167,139,250,0.12)" : "transparent",
                border: `1px solid ${filter === f ? "rgba(167,139,250,0.25)" : "transparent"}`,
                color: filter === f ? "#A78BFA" : "#6B7280",
              }}>
              {f === "all" ? (isAr ? "الكل" : "All") : f === "new" ? (isAr ? "جديد" : "New") : f === "reviewing" ? (isAr ? "مراجعة" : "Reviewing") : (isAr ? "تم الإجراء" : "Actioned")}
            </button>
          ))}
        </div>
      </div>

      {/* Correlation alerts */}
      <div className="divide-y" style={{ borderColor: "rgba(184,138,60,0.04)" }}>
        {filtered.map((alert) => {
          const sevCfg = SEV_CONFIG[alert.severity];
          const statusCfg = STATUS_CONFIG[alert.status];
          const isSelected = selected?.id === alert.id;

          return (
            <div key={alert.id}>
              <div
                onClick={() => setSelected(isSelected ? null : alert)}
                className="px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                style={{ borderLeft: `3px solid ${sevCfg.color}` }}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{alert.time}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: sevCfg.bg, color: sevCfg.color }}>
                        {isAr ? sevCfg.labelAr : sevCfg.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: `${statusCfg.color}12`, color: statusCfg.color }}>
                        {isAr ? statusCfg.labelAr : statusCfg.label}
                      </span>
                    </div>
                    <h4 className="text-white font-bold text-sm mb-1">{isAr ? alert.titleAr : alert.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{alert.correlationType}</span>
                      <span>·</span>
                      <span>{alert.subjects} {isAr ? "موضوع" : "subject(s)"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: sevCfg.color }}>
                      {alert.score}
                    </div>
                    <span className="text-gray-600 text-xs">{isAr ? "درجة" : "score"}</span>
                  </div>
                </div>

                {/* Stream badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {alert.streams.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                      style={{ background: `${s.color}10`, border: `1px solid ${s.color}20` }}>
                      <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
                      <span className="text-xs font-semibold" style={{ color: s.color }}>{s.name}</span>
                    </div>
                  ))}
                  {alert.streams.length > 1 && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
                      style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.15)" }}>
                      <i className="ri-git-merge-line text-purple-400 text-xs" />
                      <span className="text-purple-400 text-xs font-bold">{alert.streams.length} {isAr ? "مصادر" : "streams"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded */}
              {isSelected && (
                <div className="px-5 py-4 border-t"
                  style={{ background: "rgba(5,20,40,0.8)", borderColor: "rgba(184,138,60,0.08)" }}>
                  {/* Correlation visualization */}
                  <div className="mb-4 p-4 rounded-xl" style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.1)" }}>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">{isAr ? "تصور الارتباط" : "Correlation Visualization"}</p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      {alert.streams.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div className="w-10 h-10 flex items-center justify-center rounded-xl"
                            style={{ background: `${s.color}15`, border: `2px solid ${s.color}40` }}>
                            <i className={`${s.icon} text-sm`} style={{ color: s.color }} />
                          </div>
                          <span className="text-xs font-semibold" style={{ color: s.color }}>{s.name}</span>
                          {i < alert.streams.length - 1 && (
                            <div className="absolute" />
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Connection lines hint */}
                    <div className="flex items-center justify-center mt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-8 h-px" style={{ background: "rgba(167,139,250,0.4)" }} />
                        <div className="w-2 h-2 rounded-full" style={{ background: "#A78BFA" }} />
                        <div className="w-8 h-px" style={{ background: "rgba(167,139,250,0.4)" }} />
                      </div>
                    </div>
                    <p className="text-center text-purple-400 text-xs font-['JetBrains_Mono'] mt-1">
                      {alert.correlationType}
                    </p>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{alert.detail}</p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button type="button"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
                      style={{ background: "#D6B47E", color: "#051428" }}>
                      <i className="ri-search-eye-line text-xs" />
                      {isAr ? "فتح تحقيق" : "Open Investigation"}
                    </button>
                    <button type="button"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold cursor-pointer whitespace-nowrap"
                      style={{ background: "transparent", borderColor: "rgba(167,139,250,0.3)", color: "#A78BFA" }}>
                      <i className="ri-user-search-line text-xs" />
                      {isAr ? "ملف الشخص 360°" : "Person 360°"}
                    </button>
                    <button type="button"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold cursor-pointer whitespace-nowrap"
                      style={{ background: "transparent", borderColor: "rgba(184,138,60,0.2)", color: "#D6B47E" }}>
                      <i className="ri-git-branch-line text-xs" />
                      {isAr ? "تحليل الروابط" : "Link Analysis"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-gray-600 text-xs font-['JetBrains_Mono']">
            {isAr ? "محرك الأنماط — تحديث كل 60 ثانية" : "Pattern Engine — updates every 60s"}
          </span>
        </div>
        <span className="text-gray-600 text-xs font-['JetBrains_Mono']">
          {correlationAlerts.length} {isAr ? "ارتباط نشط" : "active correlations"}
        </span>
      </div>
    </div>
  );
};

export default CrossStreamCorrelation;
