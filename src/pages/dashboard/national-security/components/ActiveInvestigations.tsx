import { useState } from "react";
import { activeInvestigations, type Investigation } from "@/mocks/nationalSecurityData";

interface Props {
  isAr: boolean;
}

const STATUS_CONFIG = {
  active:     { color: "#22D3EE", bg: "rgba(34,211,238,0.1)",  label: "Active",     labelAr: "نشط" },
  monitoring: { color: "#FACC15", bg: "rgba(250,204,21,0.1)",  label: "Monitoring", labelAr: "مراقبة" },
  escalated:  { color: "#F87171", bg: "rgba(248,113,113,0.1)", label: "Escalated",  labelAr: "مُصعَّد" },
  closed:     { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",  label: "Closed",     labelAr: "مغلق" },
};

const PRIORITY_CONFIG = {
  critical: { color: "#F87171", label: "Critical", labelAr: "حرج" },
  high:     { color: "#FB923C", label: "High",     labelAr: "عالٍ" },
  medium:   { color: "#FACC15", label: "Medium",   labelAr: "متوسط" },
};

const ActiveInvestigations = ({ isAr }: Props) => {
  const [selected, setSelected] = useState<Investigation | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "escalated" | "monitoring">("all");

  const filtered = filter === "all" ? activeInvestigations : activeInvestigations.filter((i) => i.status === filter);

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-xl"
            style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
            <i className="ri-search-eye-line text-cyan-400 text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{isAr ? "التحقيقات النشطة" : "Active Investigations"}</h3>
            <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{activeInvestigations.length} {isAr ? "قضية مفتوحة" : "open cases"}</p>
          </div>
        </div>
        {/* Filter tabs */}
        <div className="flex items-center gap-1">
          {(["all", "escalated", "active", "monitoring"] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
              style={{
                background: filter === f ? "rgba(34,211,238,0.12)" : "transparent",
                border: `1px solid ${filter === f ? "rgba(34,211,238,0.25)" : "transparent"}`,
                color: filter === f ? "#22D3EE" : "#6B7280",
              }}>
              {f === "all" ? (isAr ? "الكل" : "All") : f === "escalated" ? (isAr ? "مُصعَّد" : "Escalated") : f === "active" ? (isAr ? "نشط" : "Active") : (isAr ? "مراقبة" : "Monitoring")}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 divide-x" style={{ borderBottom: "1px solid rgba(34,211,238,0.08)", borderColor: "rgba(34,211,238,0.08)" }}>
        {[
          { label: isAr ? "إجمالي" : "Total",     value: activeInvestigations.length,                                          color: "#22D3EE" },
          { label: isAr ? "مُصعَّد" : "Escalated", value: activeInvestigations.filter((i) => i.status === "escalated").length,  color: "#F87171" },
          { label: isAr ? "مواضيع" : "Subjects",  value: activeInvestigations.reduce((a, i) => a + i.subjects, 0),             color: "#FB923C" },
          { label: isAr ? "مصادر" : "Streams",    value: [...new Set(activeInvestigations.flatMap((i) => i.streams))].length,  color: "#A78BFA" },
        ].map((s) => (
          <div key={s.label} className="px-4 py-3 text-center" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
            <div className="text-xl font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</div>
            <div className="text-gray-500 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Investigation list */}
      <div className="divide-y" style={{ borderColor: "rgba(34,211,238,0.04)" }}>
        {filtered.map((inv) => {
          const statusCfg = STATUS_CONFIG[inv.status];
          const priorityCfg = PRIORITY_CONFIG[inv.priority];
          const isSelected = selected?.id === inv.id;

          return (
            <div key={inv.id}>
              <div
                onClick={() => setSelected(isSelected ? null : inv)}
                className="px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                style={{ borderLeft: `3px solid ${priorityCfg.color}` }}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-cyan-400 text-xs font-bold font-['JetBrains_Mono']">{inv.caseRef}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: statusCfg.bg, color: statusCfg.color }}>
                        {isAr ? statusCfg.labelAr : statusCfg.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: `${priorityCfg.color}12`, color: priorityCfg.color }}>
                        {isAr ? priorityCfg.labelAr : priorityCfg.label}
                      </span>
                    </div>
                    <h4 className="text-white font-bold text-sm">{isAr ? inv.titleAr : inv.title}</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: inv.categoryColor + "20" }}>
                        <div className="w-full h-full rounded-sm" style={{ background: inv.categoryColor + "40" }} />
                      </div>
                      <span className="text-xs" style={{ color: inv.categoryColor }}>{inv.category}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="text-2xl font-black font-['JetBrains_Mono']"
                      style={{ color: inv.riskScore >= 80 ? "#F87171" : inv.riskScore >= 60 ? "#FB923C" : "#FACC15" }}>
                      {inv.riskScore}
                    </div>
                    <span className="text-gray-600 text-xs">{isAr ? "درجة المخاطر" : "risk score"}</span>
                  </div>
                </div>

                {/* Progress + meta */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-600 text-xs">{isAr ? "التقدم" : "Progress"}</span>
                      <span className="text-gray-400 text-xs font-['JetBrains_Mono']">{inv.progress}%</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${inv.progress}%`, background: statusCfg.color }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
                    <span><i className="ri-user-line mr-1" />{inv.subjects}</span>
                    <span><i className="ri-database-line mr-1" />{inv.streams.length}</span>
                    <span className="font-['JetBrains_Mono']">{inv.lastUpdate}</span>
                  </div>
                </div>

                {/* Stream tags */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {inv.streams.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-xs"
                      style={{ background: "rgba(34,211,238,0.06)", color: "#9CA3AF", border: "1px solid rgba(34,211,238,0.1)" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expanded detail */}
              {isSelected && (
                <div className="px-5 py-4 border-t"
                  style={{ background: "rgba(6,13,26,0.8)", borderColor: "rgba(34,211,238,0.08)" }}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {[
                      { label: isAr ? "قائد القضية" : "Case Lead",    value: inv.lead },
                      { label: isAr ? "المواضيع" : "Subjects",        value: `${inv.subjects} persons` },
                      { label: isAr ? "تاريخ الفتح" : "Opened",       value: inv.openedDate },
                      { label: isAr ? "آخر تحديث" : "Last Update",    value: inv.lastUpdate },
                    ].map((d) => (
                      <div key={d.label} className="px-3 py-2 rounded-lg"
                        style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.08)" }}>
                        <div className="text-gray-500 text-xs mb-0.5">{d.label}</div>
                        <div className="text-white text-xs font-semibold font-['JetBrains_Mono']">{d.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
                      style={{ background: "#22D3EE", color: "#060D1A" }}>
                      <i className="ri-eye-line text-xs" />
                      {isAr ? "فتح القضية" : "Open Case"}
                    </button>
                    <button type="button"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold cursor-pointer whitespace-nowrap"
                      style={{ background: "transparent", borderColor: "rgba(167,139,250,0.3)", color: "#A78BFA" }}>
                      <i className="ri-git-branch-line text-xs" />
                      {isAr ? "تحليل الروابط" : "Link Analysis"}
                    </button>
                    <button type="button"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold cursor-pointer whitespace-nowrap"
                      style={{ background: "transparent", borderColor: "rgba(251,146,60,0.3)", color: "#FB923C" }}>
                      <i className="ri-arrow-up-line text-xs" />
                      {isAr ? "تصعيد" : "Escalate"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveInvestigations;
