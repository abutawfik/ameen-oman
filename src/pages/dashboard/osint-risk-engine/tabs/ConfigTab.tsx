// Configuration tab — weight profile manager, sub-score weight sliders,
// before/after record preview, and the rules list + YAML editor section.
// All weights + rules state live in the page shell; this tab just renders
// and calls the setter callbacks.

import { useMemo, useState } from "react";
import {
  CLASSIFICATION_META, DEFAULT_SUB_SCORE_WEIGHTS, SCORED_RECORDS, WEIGHT_PROFILES,
  type RiskRule, type SubScoreKey, type SubScoreWeight,
} from "@/mocks/osintData";
import RulesSection from "../components/RulesSection";

const ConfigTab = ({
  isAr, weights, totalWeight, rules, onWeightChange, onWeightReset, onRuleToggle,
  activeProfileId, onProfileSelect, onProfileDiscard,
}: {
  isAr: boolean;
  weights: SubScoreWeight[];
  totalWeight: number;
  rules: RiskRule[];
  onWeightChange: (key: SubScoreKey, value: number) => void;
  onWeightReset: () => void;
  onRuleToggle: (id: string) => void;
  activeProfileId: string;
  onProfileSelect: (id: string) => void;
  onProfileDiscard: () => void;
}) => {
  const balanced = totalWeight === 100;
  // D5 — active profile + dirty-state detection
  const activeProfile = WEIGHT_PROFILES.find((p) => p.id === activeProfileId) ?? WEIGHT_PROFILES[0];
  const isDirty = weights.some((w) => w.weight !== (activeProfile.weights[w.key] ?? w.defaultWeight));
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const handleSaveAttempt = () => {
    setSaveToast(isAr ? "حفظ الملفات يأتي في المرحلة 2" : "Profile saving is Phase 2");
    setTimeout(() => setSaveToast(null), 2600);
  };
  const handleNewProfile = () => {
    setSaveToast(isAr ? "إنشاء ملفات جديدة يأتي في المرحلة 2" : "New profile creation is Phase 2");
    setTimeout(() => setSaveToast(null), 2600);
  };

  // F3 — recompute top-5 records under current weights vs default.
  const computeWithWeights = (ws: SubScoreWeight[]) => {
    const map = new Map(ws.map((w) => [w.key, w.weight]));
    return SCORED_RECORDS.map((r) => {
      const score = Math.round(
        (Object.keys(r.subScores) as SubScoreKey[]).reduce((sum, k) => sum + r.subScores[k] * ((map.get(k) ?? 0) / 100), 0),
      );
      return { id: r.id, name: r.travelerName, score };
    });
  };

  const defaultScored = useMemo(() => computeWithWeights(DEFAULT_SUB_SCORE_WEIGHTS), []);
  const currentScored = useMemo(() => computeWithWeights(weights), [weights]);
  // Pick top-5 by default score to keep the comparison list stable.
  const top5 = useMemo(
    () => [...defaultScored].sort((a, b) => b.score - a.score).slice(0, 5),
    [defaultScored],
  );
  const previewRows = top5.map((d, idx) => {
    const now = currentScored.find((c) => c.id === d.id)!;
    const delta = now.score - d.score;
    return { rank: idx + 1, name: d.name, before: d.score, after: now.score, delta };
  });
  const hasDeltas = previewRows.some((r) => r.delta !== 0);

  return (
    <div className="space-y-4">
      {/* D5 — Weight Profile manager */}
      <div data-narrate-id="osint-config-profile" className="rounded-xl border p-4"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <div className="flex items-start justify-between mb-3 gap-3 flex-wrap">
          <div>
            <h3 className="text-white text-sm font-bold flex items-center gap-2">
              <i className="ri-stack-line text-[#D6B47E]" />
              {isAr ? "ملفات الأوزان" : "Weight profiles"}
            </h3>
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
              {isAr
                ? "اختر ملفاً لتوجيه التسجيل بأوزان مختلفة لكل نقطة قرار أو تصنيف مصدر"
                : "Pick a profile to steer scoring with different weights per decision point / source class"}
            </p>
          </div>
          <button onClick={handleNewProfile}
            className="px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer flex items-center gap-1.5"
            style={{ background: "transparent", border: "1px solid #D6B47E55", color: "#D6B47E" }}>
            <i className="ri-add-line" />
            {isAr ? "ملف جديد" : "New Profile"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {WEIGHT_PROFILES.map((p) => {
            const active = p.id === activeProfileId;
            const dpChip = p.decisionPoint === "both"
              ? { label: "ETA + API/PNR", color: "#D6B47E" }
              : { label: p.decisionPoint, color: p.decisionPoint === "ETA" ? "#D6B47E" : "#6B4FAE" };
            const scChip = p.sourceClass === "all" ? null : CLASSIFICATION_META[p.sourceClass];
            return (
              <button key={p.id} onClick={() => onProfileSelect(p.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                style={{
                  background: active
                    ? "linear-gradient(135deg, rgba(184,138,60,0.18), rgba(10,37,64,0.9))"
                    : "rgba(10,37,64,0.85)",
                  color: active ? "#D6B47E" : "#9CA3AF",
                  border: `1px solid ${active ? "#D6B47E" : "rgba(255,255,255,0.1)"}`,
                  boxShadow: active ? "0 0 12px rgba(184,138,60,0.15)" : "none",
                }}>
                <span>{isAr ? p.nameAr : p.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-['JetBrains_Mono']"
                  style={{ background: `${dpChip.color}15`, color: dpChip.color }}>
                  {dpChip.label}
                </span>
                {scChip && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-['JetBrains_Mono']"
                    style={{ background: scChip.bg, color: scChip.color }}>
                    {isAr ? scChip.labelAr : scChip.label}
                  </span>
                )}
                {p.isDefault && (
                  <i className="ri-star-fill text-[10px]" style={{ color: "#D6B47E" }} />
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t flex items-center justify-between gap-3 flex-wrap"
          style={{ borderColor: "rgba(184,138,60,0.08)" }}>
          <p className="text-gray-400 text-xs">
            <span className="text-[#D6B47E] font-semibold">{isAr ? activeProfile.nameAr : activeProfile.name}</span>
            <span className="text-gray-600"> · </span>
            <span className="text-gray-500">{isAr ? activeProfile.descriptionAr : activeProfile.description}</span>
          </p>
          {isDirty && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-['JetBrains_Mono'] tracking-widest" style={{ color: "#C98A1B" }}>
                {isAr ? "تعديلات غير محفوظة" : "UNSAVED CHANGES"}
              </span>
              <button onClick={onProfileDiscard}
                className="px-3 py-1 rounded-md text-[11px] font-semibold cursor-pointer"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
                {isAr ? "تجاهل" : "Discard"}
              </button>
              <button onClick={handleSaveAttempt}
                className="px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer"
                style={{ background: "rgba(184,138,60,0.15)", border: "1px solid #D6B47E", color: "#D6B47E" }}>
                {isAr ? "حفظ" : "Save"}
              </button>
            </div>
          )}
          {saveToast && (
            <span className="text-[11px] font-['JetBrains_Mono']" style={{ color: "#6B4FAE" }}>
              <i className="ri-information-line mr-1" />{saveToast}
            </span>
          )}
        </div>
      </div>

      {/* Weights + preview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white text-sm font-bold">
                {isAr ? "أوزان الدرجات الفرعية" : "Sub-score weights"}
                <span className="ml-2 text-[10px] font-['JetBrains_Mono'] text-gray-500">
                  {isAr ? `الملف النشط: ${activeProfile.nameAr}` : `active: ${activeProfile.name}`}
                </span>
              </h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "اضبط الأوزان. يجب أن يساوي المجموع 100%" : "Tune weights — total must equal 100%"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-widest font-['JetBrains_Mono']"
                style={{ color: balanced ? "#4ADE80" : "#C98A1B" }}>
                TOTAL {totalWeight}%
              </span>
              <button onClick={onWeightReset}
                className="px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
                <i className="ri-restart-line mr-1" />
                {isAr ? "إعادة التعيين" : "Reset to defaults"}
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {weights.map((w) => (
              <div key={w.key} className="grid grid-cols-12 items-center gap-3">
                <div className="col-span-12 md:col-span-3 flex items-center gap-2">
                  <i className={`${w.icon} text-base`} style={{ color: w.color }} />
                  <span className="text-white text-sm font-semibold">{isAr ? w.labelAr : w.labelEn}</span>
                </div>
                <div className="col-span-9 md:col-span-7">
                  <input
                    type="range" min={0} max={40} step={1}
                    value={w.weight}
                    onChange={(e) => onWeightChange(w.key, parseInt(e.target.value))}
                    className="w-full accent-gold-400 cursor-pointer"
                  />
                  <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mt-0.5">
                    {w.primarySources.join(" · ")} — {w.method}
                  </p>
                </div>
                <div className="col-span-3 md:col-span-2 text-right">
                  <span className="text-lg font-black font-['JetBrains_Mono']" style={{ color: w.color }}>
                    {w.weight}%
                  </span>
                  <p className="text-gray-600 text-[10px] font-['JetBrains_Mono']">default {w.defaultWeight}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* F3 — before/after preview panel */}
        <div className="rounded-xl border p-5 flex flex-col"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <div className="mb-3">
            <h3 className="text-white text-sm font-bold flex items-center gap-2">
              <i className="ri-compasses-2-line text-[#D6B47E]" />
              {isAr ? "معاينة: قبل → بعد" : "Preview: before → after"}
            </h3>
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
              {isAr ? "تأثير الأوزان الحالية على أعلى 5 سجلات" : "How top-5 records shift under current weights"}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 text-xs flex-1">
            {previewRows.map((r) => {
              const dColor = r.delta > 0 ? "#C94A5E" : r.delta < 0 ? "#4ADE80" : "#6B7280";
              const dIcon = r.delta > 0 ? "ri-arrow-up-line" : r.delta < 0 ? "ri-arrow-down-line" : "ri-subtract-line";
              return (
                <div key={r.rank} className="flex items-center gap-2 px-2 py-1.5 rounded-md"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="text-gray-500 text-[10px] font-['JetBrains_Mono'] w-5">#{r.rank}</span>
                  <span className="text-gray-300 text-xs flex-1 truncate">{r.name}</span>
                  <span className="text-gray-400 font-['JetBrains_Mono'] text-xs w-8 text-right">{r.before}</span>
                  <i className="ri-arrow-right-s-line text-gray-600" />
                  <span className="text-white font-['JetBrains_Mono'] text-xs font-bold w-8 text-right">{r.after}</span>
                  <span className="font-['JetBrains_Mono'] text-xs font-bold w-14 text-right flex items-center justify-end gap-0.5"
                    style={{ color: dColor }}>
                    <i className={dIcon} />
                    {r.delta === 0 ? "0" : Math.abs(r.delta)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t text-[10px] font-['JetBrains_Mono']"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <span className="text-gray-500">
              {hasDeltas
                ? (isAr ? "التغييرات معاينة — لم يتم تطبيقها بعد" : "Deltas are preview-only — not yet applied")
                : (isAr ? "الأوزان الحالية = الافتراضية" : "Current weights = defaults")}
            </span>
          </div>
        </div>
      </div>

      {/* Rules — toggle between list + YAML view (Wave 3 · D1) */}
      <RulesSection isAr={isAr} rules={rules} onRuleToggle={onRuleToggle} />
    </div>
  );
};

export default ConfigTab;
