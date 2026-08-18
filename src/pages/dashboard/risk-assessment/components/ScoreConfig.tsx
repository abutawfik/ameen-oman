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

type ConfigVersion = {
  id: string;
  label: string;
  savedAt: string;
  savedBy: string;
  weightsSnapshot: StreamWeight[];
  multipliersSnapshot: MultiplierRule[];
  note: string;
};

const ScoreConfig = ({ weights, multipliers, isAr, onWeightChange, onMultiplierToggle, onReset }: ScoreConfigProps) => {
  const [saved, setSaved] = useState(false);
  const [activeConfigTab, setActiveConfigTab] = useState<"weights" | "multipliers" | "history">("weights");

  // Versioning state
  const [versions, setVersions] = useState<ConfigVersion[]>([
    {
      id: "v1",
      label: "Initial Configuration",
      savedAt: "2026-08-10 09:00",
      savedBy: "admin.khalid",
      weightsSnapshot: [...weights],
      multipliersSnapshot: [...multipliers],
      note: "Baseline config from spec",
    },
    {
      id: "v2",
      label: "Post-Audit Adjustment",
      savedAt: "2026-08-14 14:30",
      savedBy: "admin.nour",
      weightsSnapshot: [...weights],
      multipliersSnapshot: [...multipliers],
      note: "Increased sanctions weight per audit",
    },
    {
      id: "v3",
      label: "Current",
      savedAt: "2026-08-17 11:15",
      savedBy: "admin.ahmed",
      weightsSnapshot: [...weights],
      multipliersSnapshot: [...multipliers],
      note: "Reduced routing anomaly weight",
    },
  ]);

  // Save-as-new-version form state
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [newVersionLabel, setNewVersionLabel] = useState("");
  const [newVersionNote, setNewVersionNote] = useState("");

  const handleSaveNewVersion = () => {
    if (!newVersionLabel.trim()) return;
    const newVer: ConfigVersion = {
      id: `v${versions.length + 1}`,
      label: newVersionLabel.trim(),
      savedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      savedBy: "admin.current",
      weightsSnapshot: [...weights],
      multipliersSnapshot: [...multipliers],
      note: newVersionNote.trim(),
    };
    setVersions(prev => [...prev, newVer]);
    setNewVersionLabel("");
    setNewVersionNote("");
    setShowSaveForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleRevert = (ver: ConfigVersion) => {
    ver.weightsSnapshot.forEach(w => onWeightChange(w.key, w.weight));
  };

  const modifiedCount = weights.filter((w) => w.weight !== w.defaultWeight).length;
  const activeMultipliers = multipliers.filter((m) => m.active).length;
  const triggeredMultipliers = multipliers.filter((m) => m.triggered && m.active).length;

  // Newest-first for display
  const sortedVersions = [...versions].reverse();

  return (
    <div className="space-y-5">
      {/* Config summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: isAr ? "إجمالي التدفقات" : "Total Streams",       value: weights.length,       color: "#D6B47E", icon: "ri-stack-line" },
          { label: isAr ? "أوزان معدَّلة" : "Modified Weights",      value: modifiedCount,        color: "#FACC15", icon: "ri-edit-line" },
          { label: isAr ? "مضاعفات نشطة" : "Active Multipliers",     value: activeMultipliers,    color: "#4ADE80", icon: "ri-flashlight-line" },
          { label: isAr ? "مضاعفات مُفعَّلة" : "Triggered Now",      value: triggeredMultipliers, color: "#C94A5E", icon: "ri-alarm-warning-line" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-4 flex items-center gap-3"
            style={{ background: "rgba(10,37,64,0.8)", borderColor: `${s.color}15`, backdropFilter: "blur(12px)" }}>
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
      <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.08)" }}>
        {[
          { id: "weights" as const,     label: isAr ? "أوزان التدفقات" : "Stream Weights",    icon: "ri-equalizer-line" },
          { id: "multipliers" as const, label: isAr ? "قواعد المضاعف" : "Multiplier Rules",   icon: "ri-flashlight-line" },
          { id: "history" as const,     label: isAr ? "سجل الإصدارات" : "Version History",    icon: "ri-history-line" },
        ].map((t) => (
          <button key={t.id} type="button" onClick={() => setActiveConfigTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex-1 justify-center"
            style={{
              background: activeConfigTab === t.id ? "rgba(184,138,60,0.1)" : "transparent",
              border: `1px solid ${activeConfigTab === t.id ? "rgba(184,138,60,0.2)" : "transparent"}`,
              color: activeConfigTab === t.id ? "#D6B47E" : "#6B7280",
            }}>
            <i className={`${t.icon} text-xs`} />{t.label}
          </button>
        ))}
      </div>

      {/* Stream weights */}
      {activeConfigTab === "weights" && (
        <div className="rounded-2xl border overflow-hidden"
          style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.1)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(184,138,60,0.07)" }}>
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
                    style={{ left: `calc(${(w.weight / 10) * 100}% - 8px)`, background: "#051428", borderColor: w.color, boxShadow: `0 0 8px ${w.color}70` }} />
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
          style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.1)", backdropFilter: "blur(12px)" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(184,138,60,0.07)" }}>
            <h3 className="text-white font-bold text-sm">{isAr ? "قواعد المضاعف" : "Multiplier Rules"}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{isAr ? "تُطبَّق تلقائياً عند اكتشاف النمط المحدد" : "Applied automatically when the specified pattern is detected"}</p>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {multipliers.map((rule) => (
              <div key={rule.id}
                className="flex items-start gap-4 px-5 py-4 transition-colors"
                style={{ background: rule.triggered && rule.active ? "rgba(201,74,94,0.02)" : "transparent" }}>
                {/* Toggle */}
                <button type="button" onClick={() => onMultiplierToggle(rule.id)}
                  className="relative flex-shrink-0 cursor-pointer mt-0.5"
                  style={{ width: "38px", height: "22px" }}>
                  <div className="absolute inset-0 rounded-full transition-colors"
                    style={{ background: rule.active ? "rgba(184,138,60,0.2)" : "rgba(255,255,255,0.06)", border: `1px solid ${rule.active ? "rgba(184,138,60,0.4)" : "rgba(255,255,255,0.08)"}` }} />
                  <div className="absolute top-0.5 rounded-full transition-all"
                    style={{ width: "18px", height: "18px", left: rule.active ? "18px" : "2px", background: rule.active ? "#D6B47E" : "#374151" }} />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white text-xs font-semibold">{isAr ? rule.labelAr : rule.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-black font-['JetBrains_Mono']"
                      style={{ background: "rgba(201,74,94,0.08)", color: "#C94A5E", border: "1px solid rgba(201,74,94,0.18)" }}>
                      ×{rule.multiplier}
                    </span>
                    {rule.triggered && rule.active && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-bold animate-pulse"
                        style={{ background: "rgba(201,74,94,0.12)", color: "#C94A5E", border: "1px solid rgba(201,74,94,0.25)", fontSize: "9px" }}>
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
                    style={{ color: rule.active ? "#C94A5E" : "#374151" }}>
                    ×{rule.multiplier}
                  </div>
                  <div className="text-gray-700 text-xs">{isAr ? "مضاعف" : "multiplier"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Version History */}
      {activeConfigTab === "history" && (
        <div className="rounded-2xl border overflow-hidden"
          style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.1)", backdropFilter: "blur(12px)" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(184,138,60,0.07)" }}>
            <h3 className="text-white font-bold text-sm">{isAr ? "سجل الإصدارات" : "Version History"}</h3>
            <p className="text-gray-500 text-xs mt-0.5">
              {isAr ? "جميع الإصدارات المحفوظة من إعدادات درجة المخاطر" : "All saved snapshots of the risk score configuration"}
            </p>
          </div>

          {/* Table header */}
          <div className="px-5 py-2 grid text-xs font-semibold text-gray-500"
            style={{
              gridTemplateColumns: '140px 130px 130px 1fr 80px',
              borderBottom: '1px solid rgba(184,138,60,0.05)',
            }}>
            <span>{isAr ? 'الإصدار' : 'Version'}</span>
            <span>{isAr ? 'تاريخ الحفظ' : 'Saved At'}</span>
            <span>{isAr ? 'بواسطة' : 'Saved By'}</span>
            <span>{isAr ? 'ملاحظة' : 'Note'}</span>
            <span>{isAr ? 'إجراءات' : 'Actions'}</span>
          </div>

          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
            {sortedVersions.map((ver, idx) => {
              const isNewest = idx === 0;
              return (
                <div key={ver.id}
                  className="px-5 py-3 grid items-center gap-2 transition-colors"
                  style={{
                    gridTemplateColumns: '140px 130px 130px 1fr 80px',
                    borderLeft: isNewest ? '3px solid rgba(214,180,126,0.5)' : '3px solid transparent',
                    background: isNewest ? 'rgba(184,138,60,0.03)' : 'transparent',
                  }}>
                  {/* Version label */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-['JetBrains_Mono'] font-bold" style={{ color: '#D6B47E' }}>
                      {ver.id.toUpperCase()}
                    </span>
                    <span className="text-white text-xs font-semibold truncate">{ver.label}</span>
                    {isNewest && (
                      <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-bold"
                        style={{ background: 'rgba(74,222,128,0.1)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.2)', fontSize: '9px' }}>
                        {isAr ? 'الأحدث' : 'LATEST'}
                      </span>
                    )}
                  </div>

                  {/* Saved at */}
                  <span className="text-gray-400 text-xs font-['JetBrains_Mono']">{ver.savedAt}</span>

                  {/* Saved by */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0"
                      style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.2)' }}>
                      <i className="ri-user-line" style={{ fontSize: '9px', color: '#A78BFA' }} />
                    </div>
                    <span className="text-gray-400 text-xs font-['JetBrains_Mono']">{ver.savedBy}</span>
                  </div>

                  {/* Note */}
                  <span className="text-gray-500 text-xs font-['Inter'] truncate" title={ver.note}>
                    {ver.note || '—'}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {isNewest ? (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
                        style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
                        <i className="ri-checkbox-circle-line text-xs" style={{ color: '#4ADE80' }} />
                        <span className="text-xs font-semibold" style={{ color: '#4ADE80' }}>
                          {isAr ? 'الحالي' : 'Current'}
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRevert(ver)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
                        style={{ background: 'rgba(184,138,60,0.08)', color: '#D6B47E', border: '1px solid rgba(184,138,60,0.2)' }}>
                        <i className="ri-arrow-go-back-line text-xs" />
                        {isAr ? 'استعادة' : 'Revert'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Save button + inline form */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-gray-600 text-xs">
            {isAr ? "التغييرات تؤثر على جميع درجات المخاطر المستقبلية" : "Changes affect all future risk score calculations"}
          </p>
          <button type="button" onClick={() => setShowSaveForm(prev => !prev)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer whitespace-nowrap transition-all"
            style={{ background: saved ? "#4ADE80" : "#D6B47E", color: "#051428" }}>
            <i className={`${saved ? "ri-checkbox-circle-line" : "ri-save-3-line"} text-sm`} />
            {saved
              ? (isAr ? "تم الحفظ!" : "Configuration Saved!")
              : (isAr ? "حفظ كإصدار جديد" : "Save as New Version")}
          </button>
        </div>

        {/* Inline save form */}
        {showSaveForm && !saved && (
          <div className="rounded-xl p-4 space-y-3"
            style={{ background: "rgba(10,37,64,0.9)", border: "1px solid rgba(184,138,60,0.25)" }}>
            <h4 className="text-white text-sm font-bold font-['Inter']">
              {isAr ? 'تفاصيل الإصدار الجديد' : 'New Version Details'}
            </h4>
            <div className="space-y-2">
              <div>
                <label className="text-gray-400 text-xs font-['Inter'] block mb-1">
                  {isAr ? 'اسم الإصدار *' : 'Version Label *'}
                </label>
                <input
                  type="text"
                  value={newVersionLabel}
                  onChange={e => setNewVersionLabel(e.target.value)}
                  placeholder={isAr ? 'مثال: تعديل ما بعد المراجعة' : 'e.g. Post-Review Adjustment'}
                  className="w-full px-3 py-2 rounded-lg text-sm font-['Inter'] outline-none"
                  style={{
                    background: 'rgba(5,20,40,0.8)',
                    border: '1px solid rgba(184,138,60,0.2)',
                    color: '#D1D5DB',
                  }}
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-['Inter'] block mb-1">
                  {isAr ? 'ملاحظة (اختياري)' : 'Note (optional)'}
                </label>
                <input
                  type="text"
                  value={newVersionNote}
                  onChange={e => setNewVersionNote(e.target.value)}
                  placeholder={isAr ? 'وصف موجز للتغييرات' : 'Brief description of changes'}
                  className="w-full px-3 py-2 rounded-lg text-sm font-['Inter'] outline-none"
                  style={{
                    background: 'rgba(5,20,40,0.8)',
                    border: '1px solid rgba(184,138,60,0.2)',
                    color: '#D1D5DB',
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSaveNewVersion}
                disabled={!newVersionLabel.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap transition-all"
                style={{
                  background: newVersionLabel.trim() ? '#D6B47E' : 'rgba(214,180,126,0.3)',
                  color: '#051428',
                  cursor: newVersionLabel.trim() ? 'pointer' : 'not-allowed',
                }}>
                <i className="ri-save-line text-sm" />
                {isAr ? 'تأكيد الحفظ' : 'Confirm Save'}
              </button>
              <button
                type="button"
                onClick={() => { setShowSaveForm(false); setNewVersionLabel(""); setNewVersionNote(""); }}
                className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#6B7280' }}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreConfig;
