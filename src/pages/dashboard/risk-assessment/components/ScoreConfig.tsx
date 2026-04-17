import { useState } from "react";
import type { StreamWeight, MultiplierRule } from "@/mocks/riskAssessmentData";

interface ScoreConfigProps {
  weights: StreamWeight[];
  multipliers: MultiplierRule[];
  isAr: boolean;
  onWeightChange: (key: string, value: number) => void;
  onMultiplierToggle: (id: string) => void;
  onReset: () => void;
}

const ScoreConfig = ({ weights, multipliers, isAr, onWeightChange, onMultiplierToggle, onReset }: ScoreConfigProps) => {
  const [saved, setSaved] = useState(false);
  const [activeConfigTab, setActiveConfigTab] = useState<"weights" | "multipliers">("weights");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const modifiedCount = weights.filter((w) => w.weight !== w.defaultWeight).length;
  const activeMultipliers = multipliers.filter((m) => m.active).length;
  const triggeredMultipliers = multipliers.filter((m) => m.triggered && m.active).length;

  return (
    <div className="space-y-5">
      {/* Config summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: isAr ? "إجمالي التدفقات" : "Total Streams",       value: weights.length,       color: "#D4A84B", icon: "ri-stack-line" },
          { label: isAr ? "أوزان معدَّلة" : "Modified Weights",      value: modifiedCount,        color: "#FACC15", icon: "ri-edit-line" },
          { label: isAr ? "مضاعفات نشطة" : "Active Multipliers",     value: activeMultipliers,    color: "#4ADE80", icon: "ri-flashlight-line" },
          { label: isAr ? "مضاعفات مُفعَّلة" : "Triggered Now",      value: triggeredMultipliers, color: "#F87171", icon: "ri-alarm-warning-line" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-4 flex items-center gap-3"
            style={{ background: "rgba(20,29,46,0.8)", borderColor: `${s.color}15`, backdropFilter: "blur(12px)" }}>
            <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
              style={{ background: `${s.color}10`, border: `1px solid ${s.color}18` }}>
              <i className={`${s.icon} text-sm`} style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-xl font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</div>
              <div className="text-gray-600 text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.08)" }}>
        {[
          { id: "weights" as const,     label: isAr ? "أوزان التدفقات" : "Stream Weights",    icon: "ri-equalizer-line" },
          { id: "multipliers" as const, label: isAr ? "قواعد المضاعف" : "Multiplier Rules",   icon: "ri-flashlight-line" },
        ].map((t) => (
          <button key={t.id} type="button" onClick={() => setActiveConfigTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex-1 justify-center"
            style={{
              background: activeConfigTab === t.id ? "rgba(181,142,60,0.1)" : "transparent",
              border: `1px solid ${activeConfigTab === t.id ? "rgba(181,142,60,0.2)" : "transparent"}`,
              color: activeConfigTab === t.id ? "#D4A84B" : "#6B7280",
            }}>
            <i className={`${t.icon} text-xs`} />{t.label}
          </button>
        ))}
      </div>

      {/* Stream weights */}
      {activeConfigTab === "weights" && (
        <div className="rounded-2xl border overflow-hidden"
          style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.1)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(181,142,60,0.07)" }}>
            <div>
              <h3 className="text-white font-bold text-sm">{isAr ? "أوزان التدفقات" : "Stream Weights"}</h3>
              <p className="text-gray-500 text-xs mt-0.5">{isAr ? "1 = أدنى تأثير، 10 = أعلى تأثير على درجة المخاطر" : "1 = lowest impact, 10 = highest impact on risk score"}</p>
            </div>
            <button type="button" onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer whitespace-nowrap"
              style={{ background: "transparent", borderColor: "rgba(255,255,255,0.08)", color: "#6B7280" }}>
              <i className="ri-refresh-line text-xs" />
              {isAr ? "إعادة تعيين" : "Reset Defaults"}
            </button>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            {weights.map((w) => (
              <div key={w.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0"
                      style={{ background: `${w.color}12`, border: `1px solid ${w.color}20` }}>
                      <i className={`${w.icon}`} style={{ color: w.color, fontSize: "9px" }} />
                    </div>
                    <span className="text-gray-300 text-xs font-semibold">{isAr ? w.labelAr : w.label}</span>
                    {w.weight !== w.defaultWeight && (
                      <span className="px-1.5 py-0.5 rounded text-xs font-bold"
                        style={{ background: "rgba(250,204,21,0.08)", color: "#FACC15", border: "1px solid rgba(250,204,21,0.2)", fontSize: "8px" }}>
                        {isAr ? "معدَّل" : "MOD"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {w.weight !== w.defaultWeight && (
                      <span className="text-gray-600 font-['JetBrains_Mono'] line-through" style={{ fontSize: "9px" }}>{w.defaultWeight}</span>
                    )}
                    <span className="text-xs font-black font-['JetBrains_Mono']" style={{ color: w.color }}>{w.weight}</span>
                  </div>
                </div>
                {/* Slider */}
                <div className="relative h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="absolute top-0 left-0 h-full rounded-full"
                    style={{ width: `${(w.weight / 10) * 100}%`, background: `linear-gradient(to right, ${w.color}50, ${w.color})` }} />
                  <input
                    type="range" min={1} max={10} value={w.weight}
                    onChange={(e) => onWeightChange(w.key, parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ zIndex: 10 }}
                  />
                  {/* Thumb */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 pointer-events-none transition-all"
                    style={{ left: `calc(${(w.weight / 10) * 100}% - 8px)`, background: "#0B1220", borderColor: w.color, boxShadow: `0 0 8px ${w.color}70` }} />
                </div>
                <div className="flex justify-between">
                  {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                    <span key={n} className="font-['JetBrains_Mono']"
                      style={{ fontSize: "7px", color: w.weight === n ? w.color : "#374151" }}>
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multiplier rules */}
      {activeConfigTab === "multipliers" && (
        <div className="rounded-2xl border overflow-hidden"
          style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.1)", backdropFilter: "blur(12px)" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(181,142,60,0.07)" }}>
            <h3 className="text-white font-bold text-sm">{isAr ? "قواعد المضاعف" : "Multiplier Rules"}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{isAr ? "تُطبَّق تلقائياً عند اكتشاف النمط المحدد" : "Applied automatically when the specified pattern is detected"}</p>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {multipliers.map((rule) => (
              <div key={rule.id}
                className="flex items-start gap-4 px-5 py-4 transition-colors"
                style={{ background: rule.triggered && rule.active ? "rgba(248,113,113,0.02)" : "transparent" }}>
                {/* Toggle */}
                <button type="button" onClick={() => onMultiplierToggle(rule.id)}
                  className="relative flex-shrink-0 cursor-pointer mt-0.5"
                  style={{ width: "38px", height: "22px" }}>
                  <div className="absolute inset-0 rounded-full transition-colors"
                    style={{ background: rule.active ? "rgba(181,142,60,0.2)" : "rgba(255,255,255,0.06)", border: `1px solid ${rule.active ? "rgba(181,142,60,0.4)" : "rgba(255,255,255,0.08)"}` }} />
                  <div className="absolute top-0.5 rounded-full transition-all"
                    style={{ width: "18px", height: "18px", left: rule.active ? "18px" : "2px", background: rule.active ? "#D4A84B" : "#374151" }} />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white text-xs font-semibold">{isAr ? rule.labelAr : rule.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-black font-['JetBrains_Mono']"
                      style={{ background: "rgba(248,113,113,0.08)", color: "#F87171", border: "1px solid rgba(248,113,113,0.18)" }}>
                      ×{rule.multiplier}
                    </span>
                    {rule.triggered && rule.active && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-bold animate-pulse"
                        style={{ background: "rgba(248,113,113,0.12)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)", fontSize: "9px" }}>
                        <i className="ri-alarm-warning-line" style={{ fontSize: "8px" }} />
                        {isAr ? "مُفعَّل الآن" : "TRIGGERED"}
                      </span>
                    )}
                    {!rule.active && (
                      <span className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: "rgba(156,163,175,0.08)", color: "#6B7280", border: "1px solid rgba(156,163,175,0.15)", fontSize: "9px" }}>
                        {isAr ? "معطَّل" : "DISABLED"}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{isAr ? rule.descriptionAr : rule.description}</p>
                </div>

                {/* Multiplier badge */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-black font-['JetBrains_Mono']"
                    style={{ color: rule.active ? "#F87171" : "#374151" }}>
                    ×{rule.multiplier}
                  </div>
                  <div className="text-gray-700 text-xs">{isAr ? "مضاعف" : "multiplier"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save button */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 text-xs">
          {isAr ? "التغييرات تؤثر على جميع درجات المخاطر المستقبلية" : "Changes affect all future risk score calculations"}
        </p>
        <button type="button" onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer whitespace-nowrap transition-all"
          style={{ background: saved ? "#4ADE80" : "#D4A84B", color: "#0B1220" }}>
          <i className={`${saved ? "ri-checkbox-circle-line" : "ri-save-line"} text-sm`} />
          {saved ? (isAr ? "تم الحفظ!" : "Configuration Saved!") : (isAr ? "حفظ الإعدادات" : "Save Configuration")}
        </button>
      </div>
    </div>
  );
};

export default ScoreConfig;
