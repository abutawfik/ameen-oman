import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  PROGRAM_KPIS_30D,
  CONTRIBUTION_MIX_7D,
  MODEL_GOVERNANCE,
  ORIGIN_RISK,
  SLA_SUMMARY_30D,
} from "@/mocks/osintData";
import KpiTile from "./shared/KpiTile";
import OriginLeagueTable from "./shared/OriginLeagueTable";

interface Props {
  isAr: boolean;
}

const severitySlaColor: Record<string, string> = {
  CRITICAL: "#8A1F3C",
  HIGH:     "#C94A5E",
  MEDIUM:   "#C98A1B",
  LOW:      "#FACC15",
};

// Manager home — program health, 30-day KPIs, trends, governance.
const ManagerHome = ({ isAr }: Props) => {
  const kpis = useMemo(() => {
    const totalClosed = PROGRAM_KPIS_30D.reduce((s, d) => s + d.cases_closed, 0);
    const totalThreats = PROGRAM_KPIS_30D.reduce((s, d) => s + d.confirmed_threats, 0);
    const totalFp = PROGRAM_KPIS_30D.reduce((s, d) => s + d.false_positives, 0);
    const avgScore = Math.round(
      PROGRAM_KPIS_30D.reduce((s, d) => s + d.avg_score, 0) / PROGRAM_KPIS_30D.length,
    );
    const uniqueEntities = PROGRAM_KPIS_30D.reduce((s, d) => s + d.unique_entities, 0);
    const fpRate = totalClosed > 0 ? (totalFp / totalClosed) * 100 : 0;
    const costPerCase = 4.25; // OMR — fictional, for demo only

    return [
      {
        label: isAr ? "قضايا مُغلقة · 30ي" : "Cases closed · 30d",
        value: totalClosed.toLocaleString(),
        icon: "ri-inbox-archive-line",
        color: "#D6B47E",
        spark: PROGRAM_KPIS_30D.map((d) => d.cases_closed),
        deltaPct: 6.4,
      },
      {
        label: isAr ? "تهديدات مؤكدة" : "Confirmed threats",
        value: totalThreats.toLocaleString(),
        icon: "ri-shield-cross-line",
        color: "#C94A5E",
        spark: PROGRAM_KPIS_30D.map((d) => d.confirmed_threats),
        deltaPct: 3.1,
        deltaDirHint: "down_is_good" as const,
      },
      {
        label: isAr ? "نسبة الإيجابيات الكاذبة" : "False-positive rate",
        value: `${fpRate.toFixed(1)}%`,
        icon: "ri-question-mark",
        color: "#C98A1B",
        spark: PROGRAM_KPIS_30D.map((d) => (d.false_positives / d.cases_closed) * 100),
        deltaPct: -4.2,
        deltaDirHint: "down_is_good" as const,
      },
      {
        label: isAr ? "متوسط الدرجة" : "Avg unified score",
        value: avgScore.toString(),
        icon: "ri-scales-3-line",
        color: "#6B4FAE",
        spark: PROGRAM_KPIS_30D.map((d) => d.avg_score),
      },
      {
        label: isAr ? "كيانات فريدة" : "Unique entities",
        value: uniqueEntities.toLocaleString(),
        icon: "ri-group-line",
        color: "#4ADE80",
        spark: PROGRAM_KPIS_30D.map((d) => d.unique_entities),
        deltaPct: 2.8,
      },
      {
        label: isAr ? "كلفة / قضية" : "Cost / case",
        value: `${costPerCase.toFixed(2)} OMR`,
        icon: "ri-coin-line",
        color: "#FACC15",
        spark: [5.1, 4.9, 4.7, 4.6, 4.5, 4.3, costPerCase],
        deltaPct: -3.4,
        deltaDirHint: "down_is_good" as const,
      },
    ];
  }, [isAr]);

  // Weekly-aggregate the 30d KPIs so the chart isn't noisy per-day.
  const weeklyTrend = useMemo(() => {
    const buckets: { week: string; cases_closed: number; confirmed_threats: number; false_positives: number }[] = [];
    for (let i = 0; i < PROGRAM_KPIS_30D.length; i += 7) {
      const slice = PROGRAM_KPIS_30D.slice(i, i + 7);
      if (slice.length === 0) continue;
      const label = `W${Math.floor(i / 7) + 1}`;
      buckets.push({
        week: label,
        cases_closed:      slice.reduce((s, d) => s + d.cases_closed, 0),
        confirmed_threats: slice.reduce((s, d) => s + d.confirmed_threats, 0),
        false_positives:   slice.reduce((s, d) => s + d.false_positives, 0),
      });
    }
    return buckets;
  }, []);

  return (
    <div className="relative z-10 p-4 md:p-6 max-w-[1600px] mx-auto space-y-5">
      {/* 1. Program KPIs · 30 days */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 rounded-full bg-gold-400" />
          <h2 className="text-white font-bold text-base">
            {isAr ? "مؤشرات البرنامج · 30 يومًا" : "Program KPIs · 30 days"}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map((k) => (
            <KpiTile
              key={k.label}
              label={k.label}
              value={k.value}
              icon={k.icon}
              color={k.color}
              sparkline={k.spark}
              deltaPct={k.deltaPct}
              deltaDirHint={k.deltaDirHint}
            />
          ))}
        </div>
      </div>

      {/* 2. Case Outcomes Trend (7) + Risk Contribution (5) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div
          className="xl:col-span-7 rounded-xl border p-4"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-white text-sm font-bold">
                {isAr ? "اتجاه نتائج القضايا · 30ي" : "Case outcomes trend · 30d"}
              </h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "مُجمَّع أسبوعيًا" : "weekly aggregate · closed vs. confirmed vs. false positive"}
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-['JetBrains_Mono']">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#D6B47E" }} />
                <span className="text-gray-400">closed</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#C94A5E" }} />
                <span className="text-gray-400">threats</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#C98A1B" }} />
                <span className="text-gray-400">FP</span>
              </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-closed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D6B47E" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#D6B47E" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="g-threats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C94A5E" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#C94A5E" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="g-fp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C98A1B" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#C98A1B" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,138,60,0.08)" />
                <XAxis dataKey="week" stroke="#6B7280" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                <YAxis stroke="#6B7280" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                <Tooltip
                  contentStyle={{
                    background: "#0A2540",
                    border: "1px solid rgba(184,138,60,0.3)",
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: "JetBrains Mono",
                  }}
                />
                <Area type="monotone" dataKey="cases_closed"      stroke="#D6B47E" strokeWidth={2} fill="url(#g-closed)"  />
                <Area type="monotone" dataKey="confirmed_threats" stroke="#C94A5E" strokeWidth={2} fill="url(#g-threats)" />
                <Area type="monotone" dataKey="false_positives"   stroke="#C98A1B" strokeWidth={2} fill="url(#g-fp)"      />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contribution Mix */}
        <div
          className="xl:col-span-5 rounded-xl border p-4"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}
        >
          <div className="mb-3">
            <h3 className="text-white text-sm font-bold">
              {isAr ? "توزيع مصادر الإشارات · 7 أيام" : "Risk contribution · 7d"}
            </h3>
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
              {isAr ? "قواعد / تعلّم آلي / قائمة مراقبة / يدوي" : "rules vs. ML vs. watchlist vs. manual"}
            </p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CONTRIBUTION_MIX_7D} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,138,60,0.08)" />
                <XAxis dataKey="day" stroke="#6B7280" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                <YAxis stroke="#6B7280" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                <Tooltip
                  contentStyle={{
                    background: "#0A2540",
                    border: "1px solid rgba(184,138,60,0.3)",
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: "JetBrains Mono",
                  }}
                />
                <Legend iconType="square" wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "#9CA3AF" }} />
                <Bar dataKey="rules"     stackId="a" fill="#D6B47E" />
                <Bar dataKey="ml"        stackId="a" fill="#6B4FAE" />
                <Bar dataKey="watchlist" stackId="a" fill="#C98A1B" />
                <Bar dataKey="manual"    stackId="a" fill="#4ADE80" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Origin risk league + Model governance + Operational SLAs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <OriginLeagueTable
          origins={ORIGIN_RISK}
          topN={10}
          sortBy="flagged"
          isAr={isAr}
          title={isAr ? "أعلى الدول حسب الخطر · 30ي" : "Top origin risk · 30d"}
          subtitle={isAr ? "مُرتَّب حسب المُرفَع" : "ranked by flagged"}
        />

        {/* Model governance card */}
        <div
          className="rounded-xl border p-4"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <i className="ri-cpu-line text-[#6B4FAE]" />
            <h3 className="text-white text-sm font-bold">{isAr ? "حوكمة النموذج" : "Model Governance"}</h3>
          </div>
          <div className="space-y-2.5">
            <GovernanceRow
              label={isAr ? "النسخة النشطة" : "Active version"}
              value={MODEL_GOVERNANCE.activeVersion}
              color="#D6B47E"
            />
            <GovernanceRow
              label={isAr ? "النسخة السابقة" : "Previous version"}
              value={MODEL_GOVERNANCE.previousVersion}
              color="#6B7280"
            />
            <GovernanceRow
              label={isAr ? "أيام في الإنتاج" : "Days in production"}
              value={`${MODEL_GOVERNANCE.daysInProduction}d`}
              color="#6B4FAE"
            />
            <GovernanceRow
              label={isAr ? "حالة الانجراف" : "Drift status"}
              value={MODEL_GOVERNANCE.drift.status.toUpperCase()}
              color={
                MODEL_GOVERNANCE.drift.status === "ok"
                  ? "#4ADE80"
                  : MODEL_GOVERNANCE.drift.status === "watch"
                    ? "#C98A1B"
                    : "#C94A5E"
              }
            />
            <GovernanceRow
              label={isAr ? "تحوّل التوزيع" : "Score-dist shift"}
              value={MODEL_GOVERNANCE.drift.scoreDistShift.toFixed(2)}
              color="#9CA3AF"
            />
            <GovernanceRow
              label={isAr ? "إنذارات عدالة" : "Fairness flags"}
              value={MODEL_GOVERNANCE.drift.nationalityFairnessFlags.toString()}
              color={MODEL_GOVERNANCE.drift.nationalityFairnessFlags === 0 ? "#4ADE80" : "#C94A5E"}
            />
            <GovernanceRow
              label={isAr ? "آخر إعادة تدريب" : "Last retrain"}
              value={MODEL_GOVERNANCE.lastRetrain}
              color="#9CA3AF"
            />
            <GovernanceRow
              label={isAr ? "المراجعة التالية" : "Next review"}
              value={MODEL_GOVERNANCE.nextScheduledReview}
              color="#D6B47E"
            />
          </div>
        </div>

        {/* Operational SLAs — monthly */}
        <div
          className="rounded-xl border"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
            <h3 className="text-white text-sm font-bold">{isAr ? "SLA تشغيلية · شهر" : "Operational SLAs · month"}</h3>
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
              {isAr ? "نسبة الالتزام حسب الشدة" : "met % by severity"}
            </p>
          </div>
          <div className="p-4 space-y-3">
            {SLA_SUMMARY_30D.map((row) => {
              const total = row.met + row.breached;
              const metPct = total > 0 ? (row.met / total) * 100 : 0;
              const col = severitySlaColor[row.severity];
              return (
                <div key={row.severity}>
                  <div className="flex items-center justify-between mb-1 text-[11px] font-['JetBrains_Mono']">
                    <span className="font-bold tracking-widest" style={{ color: col }}>
                      {row.severity}
                    </span>
                    <span className="text-gray-500">
                      <span className="text-white font-bold">{metPct.toFixed(1)}%</span>
                      <span className="mx-1">·</span>
                      {row.met.toLocaleString()} / {total.toLocaleString()}
                    </span>
                  </div>
                  <div
                    className="h-3 rounded-md overflow-hidden flex"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <div className="h-full" style={{ width: `${metPct}%`, background: "#4ADE80", opacity: 0.85 }} />
                    <div className="h-full" style={{ width: `${100 - metPct}%`, background: col, opacity: 0.85 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const GovernanceRow = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="flex items-center justify-between gap-3 px-2 py-1.5 rounded-md" style={{ background: "rgba(255,255,255,0.02)" }}>
    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 font-['JetBrains_Mono']">
      {label}
    </span>
    <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color }}>
      {value}
    </span>
  </div>
);

export default ManagerHome;
