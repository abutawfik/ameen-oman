// Model Governance tab (D2) — version stack, drift band, calibration curve,
// per-nationality fairness, model registry timeline. Rollback is Phase 2.

import { useState } from "react";
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Line, ReferenceLine,
} from "recharts";
import {
  CALIBRATION_CURVE, MODEL_GOVERNANCE, MODEL_REGISTRY_TIMELINE,
  NATIONALITY_FAIRNESS, SCORE_DRIFT_30D,
} from "@/mocks/osintData";

const GovernanceTab = ({ isAr }: { isAr: boolean }) => {
  // Drift: z-score of today's mean vs 30-day baseline using daily stdDev.
  const todayPoint = SCORE_DRIFT_30D[SCORE_DRIFT_30D.length - 1];
  const baseline = SCORE_DRIFT_30D.slice(0, -1);
  const baselineMean = baseline.reduce((s, p) => s + p.meanScore, 0) / baseline.length;
  const baselineSd = Math.sqrt(
    baseline.reduce((s, p) => s + (p.meanScore - baselineMean) ** 2, 0) / baseline.length,
  ) || 1;
  const todayZ = (todayPoint.meanScore - baselineMean) / baselineSd;
  const driftLabel = Math.abs(todayZ) < 2
    ? { en: "Drift · OK", ar: "الانحراف · سليم", color: "#4ADE80" }
    : Math.abs(todayZ) <= 3
      ? { en: "Drift · WATCH", ar: "الانحراف · مراقبة", color: "#C98A1B" }
      : { en: "Drift · BREACH", ar: "الانحراف · خرق", color: "#C94A5E" };

  // Recharts-friendly drift data — compute upper/lower band per day.
  const driftChartData = SCORE_DRIFT_30D.map((p) => ({
    date: p.date.slice(5), // MM-DD
    mean: p.meanScore,
    upper: +(p.meanScore + p.stdDev).toFixed(2),
    lower: +(p.meanScore - p.stdDev).toFixed(2),
    population: p.population,
  }));

  const fairnessBreaches = NATIONALITY_FAIRNESS.filter((n) => Math.abs(n.deviationSigma) > 2).length;
  const fairnessSorted = [...NATIONALITY_FAIRNESS].sort((a, b) => b.flagRatePct - a.flagRatePct);

  const [rollbackConfirm, setRollbackConfirm] = useState(false);
  const [rollbackToast, setRollbackToast] = useState<string | null>(null);
  const confirmRollback = () => {
    setRollbackToast(isAr
      ? "تنفيذ التراجع محجوز للمرحلة 2 — تم تسجيل الطلب"
      : "Rollback execution is Phase 2 — request logged");
    setRollbackConfirm(false);
    setTimeout(() => setRollbackToast(null), 2800);
  };

  return (
    <div className="space-y-4" data-narrate-id="osint-governance-drift">
      {/* 12-col governance grid */}
      <div className="grid grid-cols-12 gap-4">

        {/* Panel 1 — Version stack (col-span 4) */}
        <div className="col-span-12 lg:col-span-4 rounded-xl border p-5 flex flex-col gap-3"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <div className="flex items-center gap-2">
            <i className="ri-git-commit-line text-[#D6B47E] text-base" />
            <h3 className="text-white text-sm font-bold">{isAr ? "مكدّس الإصدار" : "Version stack"}</h3>
          </div>

          <div className="rounded-lg p-3"
            style={{ background: "linear-gradient(135deg, rgba(107,79,174,0.1), rgba(10,37,64,0.75))", border: "1px solid rgba(107,79,174,0.3)" }}>
            <div className="text-[10px] font-bold tracking-widest text-gray-500 font-['JetBrains_Mono']">
              {isAr ? "نشط" : "ACTIVE"}
            </div>
            <div className="text-white text-lg font-black font-['JetBrains_Mono']">{MODEL_GOVERNANCE.activeVersion}</div>
            <div className="text-gray-500 text-[10px] font-['JetBrains_Mono'] mt-1">
              v{"{SCHEMA}.{REGISTRY}.{PATCH}"}-if{"{IF}"}-prank{"{PR}"}-seq{"{SQ}"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-[9px] tracking-widest text-gray-600 font-['JetBrains_Mono']">{isAr ? "السابق" : "PREVIOUS"}</div>
              <div className="text-gray-300 font-['JetBrains_Mono'] text-xs">{MODEL_GOVERNANCE.previousVersion}</div>
            </div>
            <div className="rounded-md p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-[9px] tracking-widest text-gray-600 font-['JetBrains_Mono']">{isAr ? "أيام الإنتاج" : "PROD DAYS"}</div>
              <div className="text-gray-300 font-['JetBrains_Mono'] text-xs">{MODEL_GOVERNANCE.daysInProduction}d</div>
            </div>
            <div className="rounded-md p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-[9px] tracking-widest text-gray-600 font-['JetBrains_Mono']">{isAr ? "آخر تدريب" : "LAST RETRAIN"}</div>
              <div className="text-gray-300 font-['JetBrains_Mono'] text-xs">{MODEL_GOVERNANCE.lastRetrain}</div>
            </div>
            <div className="rounded-md p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-[9px] tracking-widest text-gray-600 font-['JetBrains_Mono']">{isAr ? "المراجعة القادمة" : "NEXT REVIEW"}</div>
              <div className="text-gray-300 font-['JetBrains_Mono'] text-xs">{MODEL_GOVERNANCE.nextScheduledReview}</div>
            </div>
          </div>

          <div className="mt-auto pt-2 relative">
            <button onClick={() => setRollbackConfirm(true)}
              className="w-full px-3 py-2 rounded-md text-xs font-bold cursor-pointer flex items-center justify-center gap-2"
              style={{ background: "rgba(201,74,94,0.08)", border: "1px solid #C94A5E", color: "#C94A5E" }}
              title={isAr ? "العودة إلى الإصدار السابق" : "Revert to previous version"}>
              <i className="ri-arrow-go-back-line" />
              {isAr ? `التراجع إلى ${MODEL_GOVERNANCE.previousVersion}` : `Revert to ${MODEL_GOVERNANCE.previousVersion}`}
            </button>
            {rollbackConfirm && (
              <div
                role="alertdialog"
                aria-modal="false"
                aria-labelledby="rollback-confirm-title"
                className="absolute inset-x-0 bottom-10 rounded-lg p-3 z-20"
                style={{ background: "#0A2540", border: "1px solid #C94A5E", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}
                onKeyDown={(e) => { if (e.key === "Escape") setRollbackConfirm(false); }}
              >
                <p id="rollback-confirm-title" className="text-gray-300 text-[11px] mb-2">
                  {isAr
                    ? `تأكيد التراجع إلى ${MODEL_GOVERNANCE.previousVersion}؟ سيتم إنشاء سجل تدقيق.`
                    : `Confirm rollback to ${MODEL_GOVERNANCE.previousVersion}? An audit entry will be created.`}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setRollbackConfirm(false)}
                    className="flex-1 px-2 py-1 rounded text-[11px] font-semibold cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                  <button onClick={confirmRollback}
                    autoFocus
                    className="flex-1 px-2 py-1 rounded text-[11px] font-bold cursor-pointer"
                    style={{ background: "#C94A5E", color: "white" }}>
                    {isAr ? "تأكيد" : "Confirm"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {rollbackToast && (
            <p className="text-[11px] font-['JetBrains_Mono']" style={{ color: "#C98A1B" }}>
              <i className="ri-information-line mr-1" />{rollbackToast}
            </p>
          )}
        </div>

        {/* Panel 2 — Score distribution + drift (col-span 8) */}
        <div className="col-span-12 lg:col-span-8 rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-white text-sm font-bold flex items-center gap-2">
                <i className="ri-line-chart-line text-[#6B4FAE]" />
                {isAr ? "توزيع الدرجات والانحراف · 30 يوماً" : "Score distribution + drift · 30d"}
              </h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "المتوسط اليومي ±1 انحراف معياري" : "daily mean score with ±1σ band"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-widest font-['JetBrains_Mono'] text-gray-500">
                {isAr ? "z اليوم:" : "today z:"}
                <span className="ml-1 font-bold" style={{ color: driftLabel.color }}>
                  {todayZ.toFixed(2)}σ
                </span>
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest font-['JetBrains_Mono']"
                style={{ background: `${driftLabel.color}22`, color: driftLabel.color, border: `1px solid ${driftLabel.color}55` }}>
                {isAr ? driftLabel.ar : driftLabel.en}
              </span>
            </div>
          </div>
          <div
            style={{ height: 220 }}
            role="img"
            aria-label={isAr
              ? "رسم الانحراف خلال 30 يوماً يعرض متوسط الدرجة الموحَّدة مع نطاق ±1 انحراف معياري"
              : "30-day score drift chart showing mean unified score with ±1 standard-deviation band"}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={driftChartData}>
                <defs>
                  <linearGradient id="g-drift-band" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor="#6B4FAE" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6B4FAE" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,138,60,0.08)" />
                <XAxis dataKey="date" stroke="#6B7280" tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
                <YAxis stroke="#6B7280" tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }} domain={["dataMin - 3", "dataMax + 3"]} />
                <Tooltip contentStyle={{ background: "#0A2540", border: "1px solid rgba(184,138,60,0.3)", borderRadius: 8, fontSize: 12, fontFamily: "JetBrains Mono" }} />
                <Area type="monotone" dataKey="upper" stroke="none" fill="url(#g-drift-band)" />
                <Area type="monotone" dataKey="lower" stroke="none" fill="#0A2540" />
                <Line type="monotone" dataKey="mean" stroke="#D6B47E" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel 3 — Calibration curve (col-span 6) */}
        <div className="col-span-12 lg:col-span-6 rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-white text-sm font-bold flex items-center gap-2">
                <i className="ri-crosshair-2-line text-[#4ADE80]" />
                {isAr ? "منحنى المعايرة" : "Calibration curve"}
              </h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "متوقَّع مقابل مُلاحَظ" : "expected vs observed risk"}
              </p>
            </div>
            <span className="text-[10px] tracking-widest font-['JetBrains_Mono']" style={{ color: "#4ADE80" }}>
              <i className="ri-checkbox-circle-fill mr-1" />
              {isAr ? "آخر تشغيل: 2026-04-17 02:15 UTC · سليم" : "Last run: 2026-04-17 02:15 UTC · OK"}
            </span>
          </div>
          <div
            style={{ height: 220 }}
            role="img"
            aria-label={isAr
              ? "منحنى المعايرة يظهر المخاطر المتوقَّعة مقابل المُلاحَظة؛ الخط المنقط يمثل المعايرة المثالية"
              : "Calibration scatter plot showing expected versus observed risk percentages with a dashed ideal-calibration reference line"}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,138,60,0.08)" />
                <XAxis type="number" dataKey="expectedPct" domain={[0, 100]} stroke="#6B7280"
                  tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }}
                  label={{ value: isAr ? "المتوقَّع %" : "expected %", fill: "#6B7280", fontSize: 10, position: "insideBottomRight", offset: -2 }} />
                <YAxis type="number" dataKey="observedPct" domain={[0, 100]} stroke="#6B7280"
                  tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }}
                  label={{ value: isAr ? "المُلاحَظ %" : "observed %", fill: "#6B7280", fontSize: 10, angle: -90, position: "insideLeft" }} />
                <Tooltip contentStyle={{ background: "#0A2540", border: "1px solid rgba(184,138,60,0.3)", borderRadius: 8, fontSize: 12, fontFamily: "JetBrains Mono" }} />
                <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 100, y: 100 }]} stroke="#D6B47E" strokeDasharray="4 4" />
                <Scatter data={CALIBRATION_CURVE} fill="#4ADE80" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-gray-500 text-[10px] font-['JetBrains_Mono'] mt-2">
            {isAr
              ? "النسب المحسوبة مُعايَرة ليلياً · المجموع المحدود المرئي = المخرَج المُعايَر"
              : "Percentile mapping re-calibrated nightly · bounded sum visible = calibrated output"}
          </p>
        </div>

        {/* Panel 4 — Per-nationality fairness (col-span 6) */}
        <div className="col-span-12 lg:col-span-6 rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-white text-sm font-bold flex items-center gap-2">
                <i className="ri-scales-3-line text-[#D6B47E]" />
                {isAr ? "العدالة عبر الجنسيات" : "Per-nationality fairness"}
              </h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "أعلى 10 معدل رفع + انحراف عن المتوسط العالمي" : "top 10 flag-rate + deviation vs global mean"}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest font-['JetBrains_Mono']"
              style={{ background: fairnessBreaches === 0 ? "rgba(74,222,128,0.15)" : "rgba(201,74,94,0.15)", color: fairnessBreaches === 0 ? "#4ADE80" : "#C94A5E" }}>
              {isAr
                ? `${fairnessBreaches} جنسيات تتجاوز حد 2σ`
                : `${fairnessBreaches} nationalities breaching 2σ`}
            </span>
          </div>
          <div className="space-y-1.5">
            {fairnessSorted.slice(0, 10).map((n) => {
              const absSigma = Math.abs(n.deviationSigma);
              const sigmaColor = absSigma <= 1 ? "#4ADE80" : absSigma <= 2 ? "#C98A1B" : "#C94A5E";
              const barPct = Math.min(100, n.flagRatePct * 2);
              return (
                <div key={n.iso3} className="flex items-center gap-2 text-xs">
                  <span className="w-12 text-gray-400 font-['JetBrains_Mono']">{n.iso3}</span>
                  <span className="w-28 text-gray-300 truncate">{n.name}</span>
                  <div className="flex-1 h-3.5 rounded-sm relative overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="h-full"
                      style={{ width: `${barPct}%`, background: sigmaColor, opacity: 0.85 }} />
                  </div>
                  <span className="w-12 text-right font-bold font-['JetBrains_Mono']" style={{ color: sigmaColor }}>
                    {n.flagRatePct.toFixed(1)}%
                  </span>
                  <span className="w-14 text-right font-['JetBrains_Mono']" style={{ color: sigmaColor }}>
                    {n.deviationSigma > 0 ? "+" : ""}{n.deviationSigma.toFixed(2)}σ
                  </span>
                  {absSigma > 2 && (
                    <i className="ri-error-warning-line text-base" style={{ color: "#C94A5E" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 5 — Model registry timeline (col-span 12) */}
        <div className="col-span-12 rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-white text-sm font-bold flex items-center gap-2">
                <i className="ri-timeline-view text-[#D6B47E]" />
                {isAr ? "الخط الزمني للسجل" : "Model registry timeline"}
              </h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "آخر 6 إصدارات منشورة" : "last 6 versions deployed"}
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-['JetBrains_Mono']" style={{ color: "#6B4FAE" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#6B4FAE" }} />
              {isAr
                ? "يعمل حالياً v0.3.2-rc1 في وضع الظل للتقييم"
                : "Currently running v0.3.2-rc1 in shadow mode for evaluation"}
            </span>
          </div>

          <div className="relative pt-4 pb-6">
            <div className="absolute left-0 right-0 top-[50%] h-[2px]" style={{ background: "rgba(184,138,60,0.2)" }} />
            <div className="grid grid-flow-col auto-cols-fr gap-2 relative">
              {MODEL_REGISTRY_TIMELINE.map((m) => {
                const statusMeta = m.status === "active"
                  ? { color: "#4ADE80", label: isAr ? "نشط" : "ACTIVE",   icon: "ri-check-double-line" }
                  : m.status === "shadow"
                    ? { color: "#6B4FAE", label: isAr ? "ظل" : "SHADOW", icon: "ri-moon-line" }
                    : { color: "#6B7280", label: isAr ? "متقاعد" : "RETIRED", icon: "ri-pause-circle-line" };
                return (
                  <div key={m.version} className="flex flex-col items-center gap-2">
                    <div className="text-[10px] text-gray-500 font-['JetBrains_Mono']">{m.deployedAt}</div>
                    <div className="w-5 h-5 rounded-full relative z-10 flex items-center justify-center"
                      style={{ background: `${statusMeta.color}22`, border: `2px solid ${statusMeta.color}` }}>
                      {m.status !== "retired" && (
                        <span className="w-2 h-2 rounded-full" style={{ background: statusMeta.color }} />
                      )}
                    </div>
                    <div className="text-xs font-bold text-white font-['JetBrains_Mono']">{m.version}</div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-['JetBrains_Mono'] tracking-widest"
                      style={{ background: `${statusMeta.color}18`, color: statusMeta.color }}>
                      <i className={`${statusMeta.icon} mr-0.5`} />{statusMeta.label}
                    </span>
                    <p className="text-[10px] text-gray-500 text-center max-w-[160px] leading-tight">
                      {isAr ? m.noteAr : m.noteEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceTab;
