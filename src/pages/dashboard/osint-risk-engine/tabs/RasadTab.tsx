// Rasad tab — shadow-mode active.
// Classified feed adapter is wired (adapter contract, classification routing,
// weight profile, audit trail all done). Shadow-mode runs: synthetic classified
// boosts overlay OSINT-only scores so analysts see the Δ before full access.
// Full data access pending formal ROP agreement (Phase 2 gate).

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer,
  CartesianGrid, Tooltip, ReferenceLine,
} from "recharts";
import {
  CLASSIFICATION_META, RASAD_SHADOW_SCORES,
  type Classification, type RasadShadowScore,
} from "@/mocks/osintData";

// ─── Rasad shadow scatter — Wave 4 · D5 ────────────────────────────────────
// Recharts ScatterChart of every scored record plotted as OSINT-only vs
// OSINT + simulated classified boost. Dashed y=x reference line makes "no
// change" legible; point size scales with |delta|; color mirrors the record's
// classification. Clicking a point highlights the mirrored row in the
// right-hand contributor panel.

const RasadShadowScatterPanel = ({ isAr }: { isAr: boolean }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Classify into buckets so Recharts can color each Scatter series distinctly.
  const byClassification = useMemo(() => {
    const groups: Record<Classification, RasadShadowScore[]> = {
      public: [], internal: [], restricted: [], classified: [],
    };
    RASAD_SHADOW_SCORES.forEach((s) => { groups[s.classification].push(s); });
    return groups;
  }, []);

  const stats = useMemo(() => {
    const upward = RASAD_SHADOW_SCORES.filter((s) => s.delta > 0);
    const avg = upward.length
      ? upward.reduce((sum, s) => sum + s.delta, 0) / upward.length
      : 0;
    const largest = RASAD_SHADOW_SCORES.reduce(
      (best, s) => (s.delta > best.delta ? s : best),
      RASAD_SHADOW_SCORES[0],
    );
    return {
      upwardCount: upward.length,
      total: RASAD_SHADOW_SCORES.length,
      avgDelta: Math.round(avg * 10) / 10,
      largestDelta: largest.delta,
      largestName: largest.travelerName,
      largestClassification: largest.classification,
    };
  }, []);

  // z-axis range drives point size. Using |delta| scaled into 60-360.
  const zRange: [number, number] = [60, 360];

  const handleDotClick = (dataPoint: unknown) => {
    const p = dataPoint as { recordId?: string };
    if (p?.recordId) setSelectedId((cur) => (cur === p.recordId ? null : p.recordId!));
  };

  return (
    <div className="rounded-xl border p-5"
      style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-white text-sm font-bold flex items-center gap-2">
            <i className="ri-shadow-line text-[#D6B47E]" />
            {isAr ? "معاينة وضع الظل" : "Shadow-mode preview"}
          </h3>
          <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
            {isAr
              ? "وضع الظل — لا بيانات رصد حقيقية. نقاط مُلوَّنة حسب التصنيف، الحجم يُمثّل مقدار الإزاحة."
              : "Shadow-mode — no Rasad data ingested. Color = classification, size = |Δ|."}
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-['JetBrains_Mono'] text-gray-500">
          {(["public", "internal", "restricted", "classified"] as Classification[]).map((c) => (
            <span key={c} className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: CLASSIFICATION_META[c].color }} />
              {isAr ? CLASSIFICATION_META[c].labelAr : CLASSIFICATION_META[c].label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Scatter on the left (8 cols) */}
        <div className="col-span-12 lg:col-span-8">
          <div
            className="rounded-lg p-2"
            style={{ background: "var(--alm-ocean-900, #061B30)", border: "1px solid rgba(184,138,60,0.12)" }}
            role="img"
            aria-label={isAr
              ? "رسم تبعثر يقارن درجة OSINT فقط مع درجة OSINT + رصد لكل سجل؛ الخط المنقط يمثل تساوي الدرجتين"
              : "Scatter plot comparing OSINT-only score against OSINT + Rasad score for each record; the dashed line represents equal scores"}
          >
            <ResponsiveContainer width="100%" height={340}>
              <ScatterChart margin={{ top: 12, right: 16, bottom: 32, left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,138,60,0.08)" />
                <XAxis type="number" dataKey="osintScore" domain={[0, 100]}
                  stroke="#6B7280" tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
                  label={{ value: isAr ? "درجة OSINT" : "OSINT-only score", position: "insideBottom", offset: -12, fill: "#9CA3AF", fontSize: 12 }} />
                <YAxis type="number" dataKey="rasadScore" domain={[0, 100]}
                  stroke="#6B7280" tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
                  label={{ value: isAr ? "OSINT + رصد" : "OSINT + Rasad", angle: -90, position: "insideLeft", fill: "#9CA3AF", fontSize: 12 }} />
                {/* Size axis — |delta| mapped to point area */}
                <ZAxis type="number" dataKey="sizeKey" range={zRange} />
                {/* y = x identity line. ReferenceLine with segment for dashed look */}
                <ReferenceLine
                  segment={[{ x: 0, y: 0 }, { x: 100, y: 100 }]}
                  stroke="#D6B47E"
                  strokeDasharray="5 5"
                  strokeWidth={1.25}
                  ifOverflow="extendDomain"
                />
                <Tooltip
                  cursor={{ stroke: "#D6B47E", strokeWidth: 1, strokeDasharray: "3 3" }}
                  contentStyle={{
                    background: "#051428",
                    border: "1px solid rgba(184,138,60,0.3)",
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                  labelStyle={{ color: "#D6B47E" }}
                  itemStyle={{ color: "#D6D6D6" }}
                  formatter={() => [""]}
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const p = payload[0].payload as (RasadShadowScore & { nationality?: string });
                    return (
                      <div style={{ background: "#051428", border: "1px solid rgba(184,138,60,0.3)", padding: 8, borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#D6D6D6", minWidth: 220 }}>
                        <div style={{ color: "#D6B47E", fontWeight: 700, marginBottom: 4 }}>{p.travelerName}</div>
                        <div style={{ color: "#9CA3AF" }}>{isAr ? "التصنيف" : "class"}: <span style={{ color: CLASSIFICATION_META[p.classification].color }}>{isAr ? CLASSIFICATION_META[p.classification].labelAr : CLASSIFICATION_META[p.classification].label}</span></div>
                        <div>OSINT: {p.osintScore}</div>
                        <div>+ Rasad: {p.rasadScore}</div>
                        <div style={{ color: p.delta > 0 ? "#4ADE80" : "#6B7280" }}>Δ: {p.delta >= 0 ? "+" : ""}{p.delta}</div>
                        <div style={{ color: "#D6B47E", marginTop: 4, whiteSpace: "normal" }}>
                          {isAr ? p.topClassifiedContributorAr : p.topClassifiedContributor}
                        </div>
                      </div>
                    );
                  }}
                />
                {(Object.keys(byClassification) as Classification[]).map((cls) => {
                  const data = byClassification[cls].map((d) => ({
                    ...d,
                    sizeKey: Math.max(Math.abs(d.delta), 1),
                  }));
                  if (!data.length) return null;
                  return (
                    <Scatter key={cls} name={cls} data={data} fill={CLASSIFICATION_META[cls].color}
                      fillOpacity={0.82}
                      stroke={CLASSIFICATION_META[cls].color}
                      strokeWidth={1}
                      onClick={handleDotClick}
                      shape={(props: unknown) => {
                        // Override selected-point rendering with a halo ring.
                        const { cx, cy, fill, payload, size } = props as { cx: number; cy: number; fill: string; payload: RasadShadowScore; size: number };
                        const r = Math.sqrt((size ?? 100) / Math.PI);
                        const selected = selectedId === payload.recordId;
                        return (
                          <g>
                            {selected && (
                              <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke="#D6B47E" strokeWidth={2} opacity={0.9} />
                            )}
                            <circle cx={cx} cy={cy} r={r} fill={fill} stroke={selected ? "#FFFFFF" : fill} strokeWidth={selected ? 2 : 1} />
                          </g>
                        );
                      }} />
                  );
                })}
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Caption */}
          <p className="text-gray-400 text-xs mt-3 leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {isAr
              ? `محاكاة وضع الظل · ${stats.total} سجلات · إدماج رصد سيُزيح ${stats.upwardCount} سجلاً فوق خط y=x بمتوسط +${stats.avgDelta} نقطة.`
              : `Shadow-mode simulation · ${stats.total} records · Rasad integration would shift ${stats.upwardCount} records above the y=x line by an average of +${stats.avgDelta} points.`}
          </p>

          {/* Compact KPI stats row */}
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="rounded-md p-3" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)" }}>
              <p className="text-[9px] tracking-widest uppercase" style={{ color: "#4ADE80", fontFamily: "'JetBrains Mono', monospace" }}>
                {isAr ? "إزاحة صاعدة" : "Net upward shift"}
              </p>
              <p className="text-white text-lg font-black" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {stats.upwardCount}/{stats.total}
              </p>
            </div>
            <div className="rounded-md p-3" style={{ background: "rgba(184,138,60,0.08)", border: "1px solid rgba(184,138,60,0.25)" }}>
              <p className="text-[9px] tracking-widest uppercase" style={{ color: "#D6B47E", fontFamily: "'JetBrains Mono', monospace" }}>
                {isAr ? "متوسط Δ" : "Average Δ"}
              </p>
              <p className="text-white text-lg font-black" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                +{stats.avgDelta}
              </p>
            </div>
            <div className="rounded-md p-3" style={{ background: "rgba(107,79,174,0.08)", border: "1px solid rgba(107,79,174,0.3)" }}>
              <p className="text-[9px] tracking-widest uppercase" style={{ color: "#B8A0FF", fontFamily: "'JetBrains Mono', monospace" }}>
                {isAr ? "أكبر إزاحة" : "Largest shift"}
              </p>
              <p className="text-white text-sm font-black leading-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                +{stats.largestDelta}
              </p>
              <p className="text-gray-400 text-[10px] leading-tight">
                {stats.largestName} · <span style={{ color: CLASSIFICATION_META[stats.largestClassification].color }}>{(isAr ? CLASSIFICATION_META[stats.largestClassification].labelAr : CLASSIFICATION_META[stats.largestClassification].label)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Contributor panel on the right (4 cols) */}
        <div className="col-span-12 lg:col-span-4">
          <div className="rounded-lg h-full p-4 flex flex-col"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(184,138,60,0.12)" }}>
            <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-2">
              <i className="ri-sparkling-line text-[#D6B47E]" />
              {isAr ? "أبرز المُساهمين من رصد (محاكى)" : "Top contributor from Rasad (simulated)"}
            </h4>
            <p className="text-gray-500 text-[10px] mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {isAr ? "اضغط على أي نقطة لإبراز صفها" : "Click any point to highlight its row"}
            </p>

            {/* Top 3 contributors by delta, plus selected if not already in top 3 */}
            <div className="flex-1 space-y-2 overflow-y-auto" style={{ maxHeight: 380 }}>
              {(() => {
                const top = [...RASAD_SHADOW_SCORES].sort((a, b) => b.delta - a.delta).slice(0, 3);
                const inTop = selectedId ? top.some((r) => r.recordId === selectedId) : true;
                const selectedRec = !inTop && selectedId ? RASAD_SHADOW_SCORES.find((r) => r.recordId === selectedId) : null;
                const list = selectedRec ? [...top, selectedRec] : top;
                return list.map((r) => {
                  const isSelected = selectedId === r.recordId;
                  return (
                    <button type="button" key={r.recordId}
                      onClick={() => setSelectedId((cur) => (cur === r.recordId ? null : r.recordId))}
                      className="w-full text-left rounded-md p-2.5 cursor-pointer transition-all"
                      style={{
                        background: isSelected ? "rgba(184,138,60,0.18)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isSelected ? "#D6B47E" : "rgba(184,138,60,0.15)"}`,
                      }}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-white text-xs font-bold truncate">{r.travelerName}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest font-['JetBrains_Mono']"
                          style={{ background: CLASSIFICATION_META[r.classification].bg, color: CLASSIFICATION_META[r.classification].color, border: `1px solid ${CLASSIFICATION_META[r.classification].color}44` }}>
                          {isAr ? CLASSIFICATION_META[r.classification].labelAr : CLASSIFICATION_META[r.classification].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-['JetBrains_Mono'] text-gray-400 mb-1.5">
                        <span>{r.osintScore}</span>
                        <i className="ri-arrow-right-s-line" />
                        <span style={{ color: "#D6B47E" }}>{r.rasadScore}</span>
                        <span style={{ color: r.delta > 0 ? "#4ADE80" : "#6B7280" }}>
                          ({r.delta >= 0 ? "+" : ""}{r.delta})
                        </span>
                      </div>
                      <p className="text-gray-300 text-[11px] italic leading-snug">
                        {isAr ? r.topClassifiedContributorAr : r.topClassifiedContributor}
                      </p>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Rasad live feed ticker ──────────────────────────────────────────────────

const RASAD_FEED_POOL = [
  { travelerName: "Chen Wei",            nat: "CN", classification: "internal"   as const, contributor: "Sponsor flagged — internal bulletin #IB-0412",      contributorAr: "الكفيل مُعلَّم — نشرة داخلية #IB-0412",      delta: 8  },
  { travelerName: "Nikolai Petrov",      nat: "RU", classification: "restricted" as const, contributor: "Device proximity cluster at transit hub",           contributorAr: "تجمّع أجهزة قريبة في مطار العبور",           delta: 14 },
  { travelerName: "Amira Al-Khatib",     nat: "SY", classification: "internal"   as const, contributor: "Travel pattern deviation — 3rd trip this quarter",  contributorAr: "انحراف نمط السفر — الرحلة الثالثة هذا الربع", delta: 6  },
  { travelerName: "James O'Brien",       nat: "IE", classification: "public"     as const, contributor: "No classified signal — OSINT score unchanged",      contributorAr: "لا إشارة مُصنَّفة — درجة OSINT دون تغيير",   delta: 0  },
  { travelerName: "Farida Nazarova",     nat: "UZ", classification: "restricted" as const, contributor: "Prior watchlist hit (sealed, 2024-Q1)",              contributorAr: "تطابق قائمة مراقبة سابقة (مغلقة، 2024-Q1)",  delta: 19 },
  { travelerName: "Kabir Okafor",        nat: "NG", classification: "internal"   as const, contributor: "Employment history gap aligns with travel window",   contributorAr: "فجوة سجل التوظيف تتوافق مع نافذة السفر",    delta: 5  },
  { travelerName: "Laura Mendes",        nat: "BR", classification: "public"     as const, contributor: "No classified signal — OSINT score unchanged",      contributorAr: "لا إشارة مُصنَّفة — درجة OSINT دون تغيير",   delta: 0  },
  { travelerName: "Hassan Al-Omari",     nat: "JO", classification: "classified" as const, contributor: "Undeclared beneficial owner on sponsor graph",       contributorAr: "مالك مستفيد غير مُصرَّح به في شبكة الكفلاء", delta: 22 },
];

const RasadLiveFeed = ({ isAr }: { isAr: boolean }) => {
  const [feed, setFeed] = useState<typeof RASAD_FEED_POOL>([]);
  const idx = useRef(0);

  useEffect(() => {
    // Initial burst — 2 records appear immediately
    setFeed(RASAD_FEED_POOL.slice(0, 2));
    idx.current = 2;

    const timer = setInterval(() => {
      if (idx.current >= RASAD_FEED_POOL.length) {
        idx.current = 0;
      }
      const next = RASAD_FEED_POOL[idx.current % RASAD_FEED_POOL.length];
      idx.current += 1;
      setFeed((prev) => [next, ...prev].slice(0, 6));
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(201,74,94,0.2)" }}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ borderColor: "rgba(201,74,94,0.15)" }}>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#C94A5E" }} />
        <span className="text-white text-xs font-bold font-['JetBrains_Mono']">
          {isAr ? "تغذية رصد الحية — وضع الظل" : "Rasad live feed — shadow mode"}
        </span>
        <span className="ml-auto px-2 py-0.5 rounded text-[9px] font-bold tracking-widest font-['JetBrains_Mono']"
          style={{ background: "rgba(138,31,60,0.2)", color: "#C94A5E", border: "1px solid rgba(201,74,94,0.4)" }}>
          CLASSIFIED · SYNTHETIC
        </span>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {feed.map((r, i) => (
          <div key={`${r.travelerName}-${i}`}
            className="grid grid-cols-12 gap-2 px-4 py-2.5 items-center text-xs"
            style={{ animation: i === 0 ? "fadeIn 0.4s ease" : "none" }}>
            <div className="col-span-1">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest font-['JetBrains_Mono']"
                style={{
                  background: CLASSIFICATION_META[r.classification].bg,
                  color: CLASSIFICATION_META[r.classification].color,
                  border: `1px solid ${CLASSIFICATION_META[r.classification].color}44`,
                }}>
                {r.nat}
              </span>
            </div>
            <div className="col-span-3 text-white font-semibold truncate">{r.travelerName}</div>
            <div className="col-span-5 text-gray-400 truncate font-['JetBrains_Mono'] text-[11px]">
              {isAr ? r.contributorAr : r.contributor}
            </div>
            <div className="col-span-2 text-right">
              {r.delta > 0 ? (
                <span className="font-bold font-['JetBrains_Mono']" style={{ color: "#C94A5E" }}>+{r.delta}</span>
              ) : (
                <span className="text-gray-600 font-['JetBrains_Mono']">±0</span>
              )}
            </div>
            <div className="col-span-1 flex items-center justify-end">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-['JetBrains_Mono']"
                style={{
                  background: CLASSIFICATION_META[r.classification].bg,
                  color: CLASSIFICATION_META[r.classification].color,
                }}>
                {isAr ? CLASSIFICATION_META[r.classification].labelAr : CLASSIFICATION_META[r.classification].label}
              </span>
            </div>
          </div>
        ))}
        {feed.length === 0 && (
          <div className="py-6 text-center text-gray-600 text-xs font-['JetBrains_Mono']">
            {isAr ? "انتظار أول سجل من رصد…" : "Awaiting first Rasad record…"}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Rasad tab ─────────────────────────────────────────────────────────────

const RasadTab = ({
  isAr, onOpenConfig, onOpenAudit,
}: {
  isAr: boolean;
  onOpenConfig: () => void;
  onOpenAudit: () => void;
}) => {
  const CHECKLIST: { done: boolean; partial?: boolean; labelEn: string; labelAr: string; linkLabel: string; linkLabelAr: string; onClick?: () => void }[] = [
    { done: true,  labelEn: "Source abstraction layer — identical adapter contract", labelAr: "طبقة تجريد المصادر — عقد مهايئ موحَّد", linkLabel: "see §5.1.1", linkLabelAr: "انظر §5.1.1" },
    { done: true,  labelEn: "Classification-aware routing — CLASSIFIED label flows end-to-end", labelAr: "توجيه واعٍ بالتصنيف — تسمية سرّي تسري من البداية للنهاية", linkLabel: "see Queue", linkLabelAr: "انظر القائمة" },
    { done: true,  labelEn: "Separate weight profile — 'Classified · Rasad-weighted' (see Config tab)", labelAr: "ملف أوزان منفصل — 'سرّي · موزون برصد' (انظر الإعدادات)", linkLabel: "open Config", linkLabelAr: "فتح الإعدادات", onClick: onOpenConfig },
    { done: true,  labelEn: "Segregated audit logging — all Rasad access flagged `classified_accessed`", labelAr: "سجل تدقيق منفصل — كل وصول لرصد يُعلَّم classified_accessed", linkLabel: "open Audit", linkLabelAr: "فتح التدقيق", onClick: onOpenAudit },
    { done: true, partial: true, labelEn: "Shadow-mode active — synthetic boosts running; full access pending formal ROP agreement", labelAr: "وضع الظل نشط — تعزيزات اصطناعية تُشغَّل؛ الوصول الكامل بانتظار اتفاق رسمي مع الشرطة", linkLabel: "Phase 2", linkLabelAr: "المرحلة 2" },
  ];

  const TRANSITION_STEPS: { icon: string; titleEn: string; titleAr: string; bodyEn: string; bodyAr: string; days: number }[] = [
    { icon: "ri-node-tree", titleEn: "Schema alignment", titleAr: "محاذاة المخطط", bodyEn: "Rasad field-level mapping to unified Signal schema.", bodyAr: "ربط حقول رصد بمخطط الإشارات الموحَّد.", days: 3 },
    { icon: "ri-shield-keyhole-line", titleEn: "Classification policy", titleAr: "سياسة التصنيف", bodyEn: "Retention + access + audit flow agreements.", bodyAr: "اتفاقيات الاحتفاظ والوصول وتدفق التدقيق.", days: 5 },
    { icon: "ri-scales-3-line", titleEn: "Weight calibration", titleAr: "معايرة الأوزان", bodyEn: "Tune Classified weight profile against representative traffic.", bodyAr: "ضبط ملف الأوزان السرّي على حركة تمثيلية.", days: 7 },
    { icon: "ri-shadow-line", titleEn: "Parallel-run validation", titleAr: "التحقّق بالتشغيل المتوازي", bodyEn: "Shadow Rasad scoring vs OSINT-only baseline.", bodyAr: "تشغيل Rasad كظل مقابل خط الأساس OSINT.", days: 14 },
  ];
  const totalDays = TRANSITION_STEPS.reduce((s, x) => s + x.days, 0);

  return (
    <div className="space-y-4">
      {/* Banner — framing + classification chip */}
      <div className="rounded-xl border p-5 flex items-start gap-4 flex-wrap"
        style={{
          background: "linear-gradient(135deg, rgba(138,31,60,0.12), rgba(10,37,64,0.8))",
          borderColor: "rgba(138,31,60,0.45)",
        }}>
        <div className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ background: "rgba(138,31,60,0.18)", border: "1px solid rgba(201,74,94,0.4)" }}>
          <i className="ri-shield-keyhole-line text-2xl" style={{ color: "#C94A5E" }} />
        </div>
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-white text-xl font-bold">{isAr ? "رصد · وضع الظل نشط" : "Rasad · Shadow-mode active"}</h2>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest font-['JetBrains_Mono']"
              style={{ background: CLASSIFICATION_META.classified.bg, color: CLASSIFICATION_META.classified.color, border: `1px solid ${CLASSIFICATION_META.classified.color}55` }}>
              {isAr ? CLASSIFICATION_META.classified.labelAr : CLASSIFICATION_META.classified.label}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest font-['JetBrains_Mono']"
              style={{ background: "rgba(74,222,128,0.12)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.4)" }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {isAr ? "وضع الظل نشط" : "SHADOW MODE ACTIVE"}
            </span>
          </div>
          <p className="text-gray-300 text-sm mt-1 leading-relaxed">
            {isAr
              ? "المهايئ مُعدٌّ بالكامل. وضع الظل يُشغّل درجات رصد الاصطناعية بجانب OSINT الحي — يُظهر الإزاحة Δ قبل منح الصلاحية الرسمية."
              : "Adapter fully wired. Shadow-mode is running: synthetic Rasad boosts overlay live OSINT scores, showing the Δ before full access is provisioned."}
          </p>
        </div>
      </div>

      {/* Panel 1 + Panel 2 — 6/6 row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Readiness checklist */}
        <div className="col-span-12 lg:col-span-6 rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
            <i className="ri-checkbox-multiple-line text-[#D6B47E]" />
            {isAr ? "قائمة الجاهزية" : "Readiness checklist"}
          </h3>
          <ul className="space-y-2">
            {CHECKLIST.map((item, i) => {
              const bg    = item.partial ? "rgba(74,222,128,0.04)" : item.done ? "rgba(74,222,128,0.05)" : "rgba(201,138,27,0.05)";
              const bdr   = item.partial ? "rgba(74,222,128,0.35)" : item.done ? "rgba(74,222,128,0.2)" : "rgba(201,138,27,0.25)";
              const iconBg= item.partial ? "rgba(74,222,128,0.12)" : item.done ? "rgba(74,222,128,0.15)" : "rgba(201,138,27,0.15)";
              const iconCl= item.partial ? "#4ADE80" : item.done ? "#4ADE80" : "#C98A1B";
              const icon  = item.partial ? "ri-loader-2-line" : item.done ? "ri-check-line" : "ri-pause-line";
              return (
                <li key={i} className="flex items-start gap-3 p-2 rounded-md"
                  style={{ background: bg, border: `1px solid ${bdr}` }}>
                  <div className="w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0"
                    style={{ background: iconBg, color: iconCl }}>
                    <i className={icon} />
                  </div>
                  <span className="flex-1 text-gray-200 text-xs leading-snug">{isAr ? item.labelAr : item.labelEn}</span>
                  {item.onClick ? (
                    <button type="button" onClick={item.onClick}
                      className="text-[10px] font-bold font-['JetBrains_Mono'] tracking-widest cursor-pointer flex items-center gap-0.5"
                      style={{ color: "#D6B47E" }}>
                      {isAr ? item.linkLabelAr : item.linkLabel} <i className="ri-arrow-right-s-line" />
                    </button>
                  ) : (
                    <span className="text-[10px] font-['JetBrains_Mono'] text-gray-500">{isAr ? item.linkLabelAr : item.linkLabel}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Classified adapter shape */}
        <div className="col-span-12 lg:col-span-6 rounded-xl border p-5"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
          <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
            <i className="ri-code-box-line text-[#D6B47E]" />
            {isAr ? "شكل المهايئ المُصنَّف" : "Classified adapter shape"}
          </h3>
          <pre className="rounded-lg p-3 text-[11px] overflow-auto"
            style={{
              background: "var(--alm-ocean-900, #061B30)",
              border: "1px solid rgba(184,138,60,0.18)",
              fontFamily: "'JetBrains Mono', monospace",
              color: "#D6B47E",
              lineHeight: 1.55,
              maxHeight: 340,
            }}>
{`class RasadAdapter implements BaseAdapter {
  name            = "rasad";
  source_class    = ClassificationLabel.CLASSIFIED;
  expected_refresh = timedelta(hours = 1);

  async fetch(since: Date): AsyncIterable<RawPayload> {
    // mTLS + classified handshake
    // retention: 7 days raw, audit indefinite
  }

  normalize(raw: RawPayload): Array<Event | Entity | Signal> {
    // classification_max stays CLASSIFIED
    // across all derived records
  }

  health(): ConnectorHealth {
    return {
      status: "healthy",
      lastSuccess: new Date(),
      latencyMs: 240,
      classification: "classified",
    };
  }
}`}
          </pre>
        </div>
      </div>

      {/* Panel 3 — Transition plan (full-width horizontal flow) */}
      <div className="rounded-xl border p-5"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
        <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-white text-sm font-bold flex items-center gap-2">
              <i className="ri-route-line text-[#D6B47E]" />
              {isAr ? "خطة الانتقال" : "Transition plan"}
            </h3>
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
              {isAr ? "خطوات الإدماج حتى التشغيل الموازي" : "Integration steps up to parallel-run validation"}
            </p>
          </div>
          <span className="px-3 py-1 rounded-md text-xs font-bold font-['JetBrains_Mono'] tracking-widest"
            style={{ background: "rgba(184,138,60,0.15)", color: "#D6B47E", border: "1px solid #D6B47E55" }}>
            {isAr ? "الإجمالي" : "TOTAL"} {totalDays} {isAr ? "يوم عمل" : "working days"}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {TRANSITION_STEPS.map((s, i) => (
            <div key={s.titleEn} className="relative rounded-lg border p-4 flex flex-col gap-2"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(184,138,60,0.18)" }}>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg"
                  style={{ background: "rgba(184,138,60,0.12)", border: "1px solid #D6B47E55" }}>
                  <i className={`${s.icon} text-lg`} style={{ color: "#D6B47E" }} />
                </div>
                <span className="text-[10px] font-bold font-['JetBrains_Mono'] text-gray-600">
                  {isAr ? "خطوة" : "STEP"} {i + 1}
                </span>
              </div>
              <h4 className="text-white text-sm font-bold">{isAr ? s.titleAr : s.titleEn}</h4>
              <p className="text-gray-400 text-xs leading-snug flex-1">{isAr ? s.bodyAr : s.bodyEn}</p>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-['JetBrains_Mono'] self-start"
                style={{ background: "rgba(107,79,174,0.12)", color: "#B8A0FF" }}>
                ~{s.days} {isAr ? "يوم" : "days"}
              </span>
              {/* Arrow to next step */}
              {i < TRANSITION_STEPS.length - 1 && (
                <i className="hidden md:block ri-arrow-right-s-line absolute -right-5 top-1/2 -translate-y-1/2 text-2xl"
                  style={{ color: "#D6B47E55" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Panel 4 — Rasad live feed (shadow-mode incoming records) */}
      <RasadLiveFeed isAr={isAr} />

      {/* Panel 5 — Shadow-mode scatter (Wave 4 · D5) */}
      <RasadShadowScatterPanel isAr={isAr} />
    </div>
  );
};

export default RasadTab;
