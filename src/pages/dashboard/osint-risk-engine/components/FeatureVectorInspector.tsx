// Feature Vector inspector (D4).
// Developer-mode collapsible panel that prints the exact ML-input vector
// used when the selected record was scored. Fields are grouped by purpose
// (routing, behavioral, declaration, presence, entity, OSINT, meta) and
// missing-feature mask entries are highlighted amber.

import { useState } from "react";
import type { FeatureVector } from "@/mocks/osintData";

const FV_GROUPS: { key: string; labelEn: string; labelAr: string; fields: (keyof FeatureVector)[] }[] = [
  { key: "routing",     labelEn: "Routing",     labelAr: "المسار",      fields: ["origin_iata", "carrier_iata", "nationality", "stopover_count", "hour_of_arrival", "dow_of_arrival", "booking_to_departure_days"] },
  { key: "behavioral",  labelEn: "Behavioral",  labelAr: "السلوك",       fields: ["prior_overstays", "visit_cadence_days", "mean_length_of_stay_days", "visa_denial_count"] },
  { key: "declaration", labelEn: "Declaration", labelAr: "الإقرار",      fields: ["declared_address_matches_hotel", "declared_address_matches_municipality", "declared_employer_matches_mol", "declared_length_vs_actual_days"] },
  { key: "presence",    labelEn: "Presence",    labelAr: "الحضور",       fields: ["hours_apis_to_first_hotel", "hours_apis_to_first_sim", "hours_apis_to_first_rental_or_mol", "missing_presence_signals_count"] },
  { key: "entity",      labelEn: "Entity",      labelAr: "الكيان",       fields: ["sponsor_propagated_risk", "employer_propagated_risk", "sponsor_graph_degree"] },
  { key: "osint",       labelEn: "OSINT",       labelAr: "OSINT",         fields: ["origin_conflict_intensity_7d", "origin_travel_advisory_level", "outbreak_active_at_origin"] },
  { key: "meta",        labelEn: "Meta",        labelAr: "بيانات الوصف",  fields: ["traveler_id", "decision_point", "as_of", "feature_schema_version"] },
];

const renderFeatureValue = (v: unknown): string => {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number" || typeof v === "string") return JSON.stringify(v);
  return JSON.stringify(v);
};

const FeatureVectorInspector = ({ isAr, vector }: { isAr: boolean; vector: FeatureVector }) => {
  const [open, setOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(FV_GROUPS.map((g) => [g.key, true])),
  );
  const [copied, setCopied] = useState(false);

  const copyJson = () => {
    try {
      const json = JSON.stringify(vector, null, 2);
      navigator.clipboard?.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* noop */ }
  };

  const missingMask = vector.missing_feature_mask ?? {};

  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
      {/* Header row */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-3 cursor-pointer text-left"
        style={{ background: open ? "rgba(184,138,60,0.06)" : "transparent" }}
      >
        <div className="flex items-center gap-2">
          <i className={`ri-code-s-slash-line text-base`} style={{ color: "#D6B47E" }} />
          <h3 className="text-white text-sm font-bold">
            {isAr ? "متجه الميزات" : "Feature Vector"}
            <span className="ml-2 text-[10px] tracking-widest font-['JetBrains_Mono'] px-2 py-0.5 rounded"
              style={{ background: "rgba(107,79,174,0.15)", color: "#6B4FAE" }}>
              {isAr ? "وضع المطوّر" : "DEVELOPER MODE"}
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">
            {isAr ? "مدخلات الـ ML بالضبط · مخطط v1.2.0" : "Exact inputs for ML scoring · schema v1.2.0"}
          </span>
          <i className={open ? "ri-arrow-up-s-line text-xl text-gray-400" : "ri-arrow-down-s-line text-xl text-gray-400"} />
        </div>
      </button>

      {open && (
        <div className="p-5 pt-3 border-t" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
              {Object.keys(missingMask).length > 0
                ? (isAr
                    ? `${Object.keys(missingMask).length} حقل/حقول مفقودة — مُظلَّلة بالكهرماني`
                    : `${Object.keys(missingMask).length} missing feature(s) highlighted in amber`)
                : (isAr ? "جميع الحقول متوفرة" : "All fields present")}
            </p>
            <button onClick={copyJson}
              className="px-3 py-1 rounded-md text-[11px] font-bold font-['JetBrains_Mono'] tracking-widest cursor-pointer flex items-center gap-1.5"
              style={{ background: "rgba(184,138,60,0.06)", border: "1px solid #D6B47E55", color: "#D6B47E" }}>
              <i className={copied ? "ri-check-line" : "ri-file-copy-line"} />
              {copied ? (isAr ? "تم النسخ" : "COPIED") : (isAr ? "نسخ JSON" : "COPY JSON")}
            </button>
          </div>

          <div className="space-y-2">
            {FV_GROUPS.map((g) => {
              const groupOpen = openGroups[g.key] ?? true;
              return (
                <div key={g.key} className="rounded-md overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <button type="button"
                    onClick={() => setOpenGroups((prev) => ({ ...prev, [g.key]: !groupOpen }))}
                    className="w-full flex items-center justify-between px-3 py-1.5 cursor-pointer text-left">
                    <span className="text-[11px] font-bold tracking-widest uppercase font-['JetBrains_Mono']"
                      style={{ color: "#D6B47E" }}>
                      {isAr ? g.labelAr : g.labelEn} · <span className="text-gray-500">{g.fields.length}</span>
                    </span>
                    <i className={groupOpen ? "ri-arrow-up-s-line text-gray-500" : "ri-arrow-down-s-line text-gray-500"} />
                  </button>
                  {groupOpen && (
                    <div className="px-3 pb-2 space-y-1">
                      {g.fields.map((f) => {
                        const val = vector[f];
                        const missing = missingMask[f as string] === true;
                        return (
                          <div key={String(f)}
                            className="flex items-baseline gap-3 rounded-sm px-2 py-1"
                            style={{
                              background: missing ? "rgba(201,138,27,0.10)" : "transparent",
                              borderLeft: missing ? "2px solid #C98A1B" : "2px solid transparent",
                            }}>
                            <span className="text-[11px] font-['JetBrains_Mono'] text-gray-400 w-56 truncate">{String(f)}</span>
                            <span className="text-gray-600 text-[11px]">:</span>
                            <span className="text-[11px] font-['JetBrains_Mono'] font-bold"
                              style={{ color: missing ? "#C98A1B" : "#D6B47E" }}>
                              {renderFeatureValue(val)}
                            </span>
                            {missing && (
                              <span className="text-[9px] font-['JetBrains_Mono'] text-[#C98A1B]/80 ml-auto tracking-widest">
                                {isAr ? "مفقودة" : "MISSING"}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mt-3">
            {isAr
              ? "هذا المتجه هو المدخل الدقيق لنموذج التسجيل — مُسجَّل في كل مرة يتم فيها الحساب."
              : "This vector is the exact input to the scoring model — logged on every computation."}
          </p>
        </div>
      )}
    </div>
  );
};

export default FeatureVectorInspector;
