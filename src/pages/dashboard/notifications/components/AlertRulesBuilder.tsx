import { useState } from "react";
import { alertRules, type AlertRule, type NotifPriority } from "@/mocks/notificationsData";

interface Props {
  isAr: boolean;
}

const priorityConfig: Record<NotifPriority, { label: string; labelAr: string; color: string; bg: string; border: string }> = {
  critical: { label: "Critical", labelAr: "حرج",    color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)" },
  high:     { label: "High",     labelAr: "عالٍ",   color: "#FB923C", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.3)" },
  medium:   { label: "Medium",   labelAr: "متوسط",  color: "#FACC15", bg: "rgba(250,204,21,0.1)",  border: "rgba(250,204,21,0.3)" },
  low:      { label: "Low",      labelAr: "منخفض",  color: "#D4A84B", bg: "rgba(181,142,60,0.08)", border: "rgba(181,142,60,0.2)" },
};

const channelIcons: Record<string, string> = {
  "in-app": "ri-notification-3-line",
  "email":  "ri-mail-line",
  "sms":    "ri-message-2-line",
};

const AlertRulesBuilder = ({ isAr }: Props) => {
  const [rules, setRules] = useState<AlertRule[]>(alertRules);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNewRule, setShowNewRule] = useState(false);

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: "rgba(181,142,60,0.12)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.3)" }}>
            <i className="ri-git-branch-line text-gold-400 text-sm" />
          </div>
          <div>
            <h2 className="text-white text-sm font-bold font-['Inter']">{isAr ? "منشئ قواعد التنبيه" : "Alert Rules Builder"}</h2>
            <p className="text-gray-500 text-xs font-['JetBrains_Mono']">
              {rules.filter((r) => r.enabled).length} {isAr ? "قاعدة نشطة" : "active rules"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowNewRule(!showNewRule)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-['Inter'] cursor-pointer transition-all whitespace-nowrap"
          style={{ background: "#D4A84B", color: "#0B1220" }}
        >
          <i className="ri-add-line" />
          {isAr ? "قاعدة جديدة" : "New Rule"}
        </button>
      </div>

      {/* New rule form */}
      {showNewRule && (
        <div className="px-5 py-4 border-b flex-shrink-0" style={{ borderColor: "rgba(181,142,60,0.08)", background: "rgba(181,142,60,0.02)" }}>
          <p className="text-gold-400 text-xs font-bold font-['Inter'] uppercase tracking-wider mb-3">
            {isAr ? "إنشاء قاعدة جديدة" : "Create New Rule"}
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder={isAr ? "اسم القاعدة..." : "Rule name..."}
              className="w-full px-3 py-2 rounded-xl text-sm font-['Inter']"
              style={{ background: "rgba(11,18,32,0.8)", border: "1px solid rgba(181,142,60,0.2)", color: "#D1D5DB", outline: "none" }}
            />
            <div className="p-3 rounded-xl" style={{ background: "rgba(11,18,32,0.6)", border: "1px solid rgba(181,142,60,0.1)" }}>
              <p className="text-gray-500 text-[10px] uppercase tracking-wider font-['JetBrains_Mono'] mb-2">{isAr ? "الشرط" : "Condition"}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-gold-400 text-xs font-['JetBrains_Mono'] font-bold">IF</span>
                <select className="px-2 py-1 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer" style={{ background: "rgba(181,142,60,0.08)", border: "1px solid rgba(181,142,60,0.2)", color: "#D4A84B", outline: "none" }}>
                  <option style={{ background: "#141D2E" }}>person.riskScore</option>
                  <option style={{ background: "#141D2E" }}>entity.rejectionRate</option>
                  <option style={{ background: "#141D2E" }}>vis.replicationLag</option>
                  <option style={{ background: "#141D2E" }}>patternRule.triggered</option>
                  <option style={{ background: "#141D2E" }}>apiKey.daysToExpiry</option>
                </select>
                <select className="px-2 py-1 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer" style={{ background: "rgba(181,142,60,0.08)", border: "1px solid rgba(181,142,60,0.2)", color: "#D4A84B", outline: "none" }}>
                  <option style={{ background: "#141D2E" }}>&gt;</option>
                  <option style={{ background: "#141D2E" }}>&lt;</option>
                  <option style={{ background: "#141D2E" }}>=</option>
                  <option style={{ background: "#141D2E" }}>!=</option>
                </select>
                <input type="text" placeholder="75" className="w-16 px-2 py-1 rounded-lg text-xs font-['JetBrains_Mono']" style={{ background: "rgba(11,18,32,0.8)", border: "1px solid rgba(181,142,60,0.15)", color: "#D1D5DB", outline: "none" }} />
              </div>
            </div>
            <div className="p-3 rounded-xl" style={{ background: "rgba(11,18,32,0.6)", border: "1px solid rgba(181,142,60,0.1)" }}>
              <p className="text-gray-500 text-[10px] uppercase tracking-wider font-['JetBrains_Mono'] mb-2">{isAr ? "الإجراء" : "Action"}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-green-400 text-xs font-['JetBrains_Mono'] font-bold">THEN</span>
                <select className="px-2 py-1 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ADE80", outline: "none" }}>
                  <option style={{ background: "#141D2E" }}>Push Notification</option>
                  <option style={{ background: "#141D2E" }}>Email Alert</option>
                  <option style={{ background: "#141D2E" }}>SMS Alert</option>
                  <option style={{ background: "#141D2E" }}>Critical Push</option>
                </select>
                <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{isAr ? "إلى" : "to"}</span>
                <select className="px-2 py-1 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ADE80", outline: "none" }}>
                  <option style={{ background: "#141D2E" }}>Assigned Analyst</option>
                  <option style={{ background: "#141D2E" }}>Duty Officer</option>
                  <option style={{ background: "#141D2E" }}>System Admin</option>
                  <option style={{ background: "#141D2E" }}>Entity Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowNewRule(false)} className="flex-1 py-2 rounded-xl text-xs font-['Inter'] cursor-pointer" style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button onClick={() => setShowNewRule(false)} className="flex-1 py-2 rounded-xl text-xs font-bold font-['Inter'] cursor-pointer" style={{ background: "#D4A84B", color: "#0B1220" }}>
                {isAr ? "حفظ القاعدة" : "Save Rule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules list */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(181,142,60,0.15) transparent" }}>
        {rules.map((rule) => {
          const cfg = priorityConfig[rule.priority];
          const isExpanded = expandedId === rule.id;

          return (
            <div
              key={rule.id}
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(11,18,32,0.7)",
                border: rule.enabled ? `1px solid ${cfg.border}` : "1px solid rgba(255,255,255,0.06)",
                opacity: rule.enabled ? 1 : 0.6,
              }}
            >
              {/* Rule header */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : rule.id)}
              >
                {/* Enable toggle */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleRule(rule.id); }}
                  className="relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0"
                  style={{ background: rule.enabled ? "#D4A84B" : "rgba(255,255,255,0.1)" }}
                >
                  <div className="absolute top-0.5 w-4 h-4 rounded-full transition-all" style={{ background: "#0B1220", left: rule.enabled ? "calc(100% - 18px)" : "2px" }} />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold font-['JetBrains_Mono'] uppercase"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                    >
                      {isAr ? cfg.labelAr : cfg.label}
                    </span>
                    <p className="text-white text-sm font-['Inter'] font-semibold">{isAr ? rule.nameAr : rule.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 text-[10px] font-['JetBrains_Mono'] flex items-center gap-1">
                      <i className="ri-flashlight-line text-[10px]" />
                      {rule.triggerCount.toLocaleString()} {isAr ? "مرة" : "triggers"}
                    </span>
                    <span className="text-gray-600 text-[10px] font-['JetBrains_Mono'] flex items-center gap-1">
                      <i className="ri-time-line text-[10px]" />
                      {rule.lastTriggered}
                    </span>
                  </div>
                </div>

                {/* Channel icons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {rule.actions.map((action, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 flex items-center justify-center rounded-lg"
                      style={{ background: "rgba(181,142,60,0.08)", border: "1px solid rgba(181,142,60,0.15)" }}
                      title={action.channel}
                    >
                      <i className={`${channelIcons[action.channel] || "ri-notification-line"} text-gold-400 text-[10px]`} />
                    </div>
                  ))}
                </div>

                <i className={`text-gray-600 text-sm flex-shrink-0 ${isExpanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}`} />
              </div>

              {/* Expanded rule detail */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t space-y-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  {/* Conditions */}
                  <div className="pt-3">
                    <p className="text-gray-600 text-[10px] uppercase tracking-wider font-['JetBrains_Mono'] mb-2">{isAr ? "الشروط" : "Conditions"}</p>
                    <div className="space-y-1.5">
                      {rule.conditions.map((cond, i) => (
                        <div key={i} className="flex items-center gap-2 flex-wrap">
                          {i > 0 && cond.connector && (
                            <span className="text-[10px] font-bold font-['JetBrains_Mono'] px-2 py-0.5 rounded" style={{ background: "rgba(181,142,60,0.1)", color: "#D4A84B" }}>
                              {cond.connector}
                            </span>
                          )}
                          <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-1 rounded-lg" style={{ background: "rgba(181,142,60,0.08)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.15)" }}>
                            {cond.field}
                          </span>
                          <span className="text-gray-500 text-[10px] font-['JetBrains_Mono']">{cond.operator}</span>
                          <span className="text-[10px] font-bold font-['JetBrains_Mono'] px-2 py-1 rounded-lg" style={{ background: `${cfg.bg}`, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                            {cond.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <p className="text-gray-600 text-[10px] uppercase tracking-wider font-['JetBrains_Mono'] mb-2">{isAr ? "الإجراءات" : "Actions"}</p>
                    <div className="space-y-1.5">
                      {rule.actions.map((action, i) => (
                        <div key={i} className="flex items-center gap-2 flex-wrap">
                          <span className="text-green-400 text-[10px] font-bold font-['JetBrains_Mono']">→</span>
                          <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-1 rounded-lg" style={{ background: "rgba(74,222,128,0.08)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.2)" }}>
                            {action.type}
                          </span>
                          <span className="text-gray-500 text-[10px] font-['JetBrains_Mono']">{isAr ? "إلى" : "to"}</span>
                          <span className="text-gray-300 text-[10px] font-['JetBrains_Mono']">{action.target}</span>
                          <div className="w-5 h-5 flex items-center justify-center rounded" style={{ background: "rgba(181,142,60,0.08)", border: "1px solid rgba(181,142,60,0.15)" }}>
                            <i className={`${channelIcons[action.channel] || "ri-notification-line"} text-gold-400 text-[9px]`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Edit/Delete */}
                  <div className="flex gap-2 pt-1">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-['JetBrains_Mono'] cursor-pointer" style={{ background: "rgba(181,142,60,0.05)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}>
                      <i className="ri-edit-line" />
                      {isAr ? "تعديل" : "Edit"}
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-['JetBrains_Mono'] cursor-pointer" style={{ background: "rgba(248,113,113,0.05)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                      <i className="ri-delete-bin-line" />
                      {isAr ? "حذف" : "Delete"}
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-['JetBrains_Mono'] cursor-pointer" style={{ background: "rgba(255,255,255,0.03)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <i className="ri-test-tube-line" />
                      {isAr ? "اختبار" : "Test"}
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

export default AlertRulesBuilder;
