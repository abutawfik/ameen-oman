import { useMemo, useState } from "react";
import {
  TEAM_ROSTER,
  RECENT_ESCALATIONS,
  ORIGIN_RISK,
  SLA_SUMMARY_24H,
  OSINT_SOURCES,
  MODEL_GOVERNANCE,
  aggregate,
  type AnalystWorkload,
} from "@/mocks/osintData";
import KpiTile from "./shared/KpiTile";
import WorldRiskMap from "./shared/WorldRiskMap";
import OriginLeagueTable from "./shared/OriginLeagueTable";
import SourceChip from "./shared/SourceChip";

interface Props {
  isAr: boolean;
}

const statusMeta: Record<
  AnalystWorkload["status"],
  { color: string; labelEn: string; labelAr: string }
> = {
  on_shift: { color: "#4ADE80", labelEn: "On shift", labelAr: "في الدوام" },
  break:    { color: "#FACC15", labelEn: "Break",     labelAr: "استراحة" },
  off:      { color: "#6B7280", labelEn: "Off",        labelAr: "خارج الدوام" },
};

const severitySlaColor: Record<string, string> = {
  CRITICAL: "#DC2626",
  HIGH:     "#F87171",
  MEDIUM:   "#FB923C",
  LOW:      "#FACC15",
};

// Supervisor home — team oversight: posture map, workload, escalations, SLAs, sources.
const SupervisorHome = ({ isAr }: Props) => {
  const [selectedIso2, setSelectedIso2] = useState<string | null>(null);
  const agg = useMemo(() => aggregate(), []);

  // Hero KPIs (6 tiles).
  const openCases = TEAM_ROSTER.reduce((s, a) => s + a.openAlerts, 0);
  const breached24h = SLA_SUMMARY_24H.reduce((s, r) => s + r.breached, 0);
  const teamOnShift = TEAM_ROSTER.filter((a) => a.status === "on_shift").length;
  const teamLoadPct = Math.min(100, Math.round((openCases / (teamOnShift * 6)) * 100));
  const shiftAnalysts = TEAM_ROSTER.filter((a) => a.status === "on_shift");
  const avgResponse = shiftAnalysts.length > 0
    ? (shiftAnalysts.reduce((s, a) => s + a.avgResponseMins, 0) / shiftAnalysts.length).toFixed(1)
    : "—";

  const kpis = [
    {
      label: isAr ? "قضايا مفتوحة" : "Open cases",
      value: openCases.toString(),
      icon: "ri-folder-warning-line",
      color: "#D4A84B",
      spark: [32, 38, 41, 36, 42, 44, openCases],
    },
    {
      label: isAr ? "متأخرة · 24س" : "Breached · 24h",
      value: breached24h.toString(),
      icon: "ri-alarm-warning-line",
      color: "#F87171",
      spark: [8, 12, 14, 11, 16, 13, breached24h],
      deltaPct: -8.2,
      deltaDirHint: "down_is_good" as const,
    },
    {
      label: isAr ? "حمل الفريق" : "Team load",
      value: `${teamLoadPct}%`,
      icon: "ri-group-line",
      color: teamLoadPct > 80 ? "#F87171" : teamLoadPct > 60 ? "#FB923C" : "#4ADE80",
      spark: [45, 52, 58, 62, 66, 71, teamLoadPct],
      subtitle: `${teamOnShift}/${TEAM_ROSTER.length} ${isAr ? "في الدوام" : "on shift"}`,
    },
    {
      label: isAr ? "متوسط الاستجابة" : "Avg response",
      value: `${avgResponse}m`,
      icon: "ri-timer-line",
      color: "#6B4FAE",
      spark: [5.2, 4.8, 4.4, 4.2, 3.9, 3.6, Number(avgResponse)],
      deltaPct: -14.3,
      deltaDirHint: "down_is_good" as const,
    },
    {
      label: isAr ? "انجراف النموذج" : "Drift status",
      value: MODEL_GOVERNANCE.drift.status === "ok" ? "OK" : MODEL_GOVERNANCE.drift.status.toUpperCase(),
      icon: "ri-scales-3-line",
      color: MODEL_GOVERNANCE.drift.status === "ok" ? "#4ADE80" : MODEL_GOVERNANCE.drift.status === "watch" ? "#FB923C" : "#F87171",
      subtitle: `shift ${MODEL_GOVERNANCE.drift.scoreDistShift}`,
    },
    {
      label: isAr ? "مصادر حيّة" : "Sources live",
      value: `${agg.sourcesHealthy}/${agg.sourcesTotal}`,
      icon: "ri-broadcast-line",
      color: agg.sourcesHealthy === agg.sourcesTotal ? "#4ADE80" : "#FB923C",
      subtitle: agg.sourcesDown > 0 ? `${agg.sourcesDown} down` : agg.sourcesDegraded > 0 ? `${agg.sourcesDegraded} degraded` : "all clear",
    },
  ];

  // For the map, filter league to selectedIso2 highlight (demo: navigation only).
  const rosterSorted = useMemo(
    () => [...TEAM_ROSTER].sort((a, b) => {
      // On-shift first, then by open alerts desc.
      if (a.status === "on_shift" && b.status !== "on_shift") return -1;
      if (b.status === "on_shift" && a.status !== "on_shift") return 1;
      return b.openAlerts - a.openAlerts;
    }),
    [],
  );

  return (
    <div className="relative z-10 p-4 md:p-6 max-w-[1600px] mx-auto space-y-5">
      {/* 1. Hero KPI strip */}
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
            subtitle={k.subtitle}
          />
        ))}
      </div>

      {/* 2. Map (7) + Team Workload (5) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-7 space-y-4">
          <WorldRiskMap
            origins={ORIGIN_RISK}
            isAr={isAr}
            selectedIso2={selectedIso2}
            onSelectCountry={(iso2) => setSelectedIso2((c) => (c === iso2 ? null : iso2))}
          />
          <OriginLeagueTable
            origins={ORIGIN_RISK}
            topN={5}
            sortBy="flagged"
            isAr={isAr}
            title={isAr ? "أعلى 5 دول حسب العدد المُرفَع" : "Top 5 origins by flagged · 24h"}
            subtitle={isAr ? "اضغط على البلد في الخريطة للتحديد" : "click a bubble on the map to highlight"}
            onSelect={(iso2) => setSelectedIso2((c) => (c === iso2 ? null : iso2))}
          />
        </div>

        <div
          className="xl:col-span-5 rounded-xl border"
          style={{ background: "rgba(20,29,46,0.65)", borderColor: "rgba(181,142,60,0.12)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
            <div>
              <h3 className="text-white text-sm font-bold">{isAr ? "حمل الفريق" : "Team Workload"}</h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "مُرتَّب حسب أعلى حمل" : "sorted · highest load first"}
              </p>
            </div>
            <span
              className="px-2 py-0.5 rounded-md text-[10px] font-bold font-['JetBrains_Mono'] tracking-widest"
              style={{ background: "rgba(74,222,128,0.1)", color: "#4ADE80" }}
            >
              {teamOnShift}/{TEAM_ROSTER.length} ON
            </span>
          </div>
          <div className="overflow-x-auto">
            <div
              className="grid grid-cols-12 gap-2 px-3 py-2 border-b text-[9px] font-bold tracking-widest uppercase font-['JetBrains_Mono']"
              style={{ borderColor: "rgba(181,142,60,0.05)", color: "#6B7280" }}
            >
              <div className="col-span-4">{isAr ? "المحلل" : "Analyst"}</div>
              <div className="col-span-1 text-right">{isAr ? "م" : "Op"}</div>
              <div className="col-span-1 text-right">{isAr ? "أ" : "Ak"}</div>
              <div className="col-span-1 text-right">{isAr ? "غ" : "Cl"}</div>
              <div className="col-span-2 text-right">{isAr ? "استجابة" : "Resp"}</div>
              <div className="col-span-2 text-right">{isAr ? "SLA" : "SLA"}</div>
              <div className="col-span-1" />
            </div>
            {rosterSorted.map((a) => {
              const s = statusMeta[a.status];
              const slaCol = a.slaMetPct >= 95 ? "#4ADE80" : a.slaMetPct >= 90 ? "#FB923C" : "#F87171";
              return (
                <div
                  key={a.id}
                  className="group grid grid-cols-12 gap-2 px-3 py-2.5 items-center border-b hover:bg-white/[0.02] transition-colors"
                  style={{ borderColor: "rgba(181,142,60,0.04)" }}
                >
                  <div className="col-span-4 flex items-center gap-2 min-w-0">
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[11px] font-black font-['JetBrains_Mono'] flex-shrink-0"
                      style={{ background: "rgba(181,142,60,0.08)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}
                    >
                      {a.avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white text-xs font-semibold truncate">
                        {isAr ? a.nameAr : a.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                        <span className="text-[10px] font-['JetBrains_Mono']" style={{ color: s.color }}>
                          {isAr ? s.labelAr : s.labelEn}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 text-right text-white text-xs font-bold font-['JetBrains_Mono']">
                    {a.openAlerts}
                  </div>
                  <div className="col-span-1 text-right text-gray-400 text-xs font-['JetBrains_Mono']">
                    {a.ackedToday}
                  </div>
                  <div className="col-span-1 text-right text-gray-400 text-xs font-['JetBrains_Mono']">
                    {a.closedToday}
                  </div>
                  <div className="col-span-2 text-right text-gray-300 text-xs font-['JetBrains_Mono']">
                    {a.avgResponseMins > 0 ? `${a.avgResponseMins}m` : "—"}
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: slaCol }}>
                      {a.slaMetPct}%
                    </span>
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-gold-400 font-['JetBrains_Mono']"
                    >
                      {isAr ? "إعادة →" : "reassign →"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. SLA Dashboard + Recent Escalations + Source Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SLA Dashboard */}
        <div
          className="rounded-xl border"
          style={{ background: "rgba(20,29,46,0.65)", borderColor: "rgba(181,142,60,0.12)" }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
            <h3 className="text-white text-sm font-bold">{isAr ? "لوحة مهلات الاستجابة · 24 ساعة" : "SLA Dashboard · 24h"}</h3>
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
              {isAr ? "مقابل وقت الاستجابة المستهدف" : "met vs. breached by severity"}
            </p>
          </div>
          <div className="p-4 space-y-3">
            {SLA_SUMMARY_24H.map((row) => {
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
                      <span className="text-white font-bold">{metPct.toFixed(0)}%</span>
                      <span className="mx-1">·</span>
                      {row.met} met · {row.breached} breached
                    </span>
                  </div>
                  <div
                    className="h-3 rounded-md overflow-hidden flex"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <div className="h-full" style={{ width: `${metPct}%`, background: "#4ADE80", opacity: 0.85 }} />
                    <div className="h-full" style={{ width: `${100 - metPct}%`, background: col, opacity: 0.85 }} />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-gray-600 font-['JetBrains_Mono']">
                    <span>{row.inFlight} {isAr ? "قيد التنفيذ" : "in flight"}</span>
                    <span>{total} {isAr ? "إجمالي" : "total"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Escalations */}
        <div
          className="rounded-xl border"
          style={{ background: "rgba(20,29,46,0.65)", borderColor: "rgba(181,142,60,0.12)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
            <div>
              <h3 className="text-white text-sm font-bold">{isAr ? "تصعيدات حديثة" : "Recent Escalations"}</h3>
              <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
                {isAr ? "الأحدث أولاً" : "newest first"}
              </p>
            </div>
            <button type="button" className="text-[11px] text-gold-400 font-semibold font-['JetBrains_Mono']">
              {isAr ? "الكل" : "view all"} →
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(181,142,60,0.05)" }}>
            {RECENT_ESCALATIONS.slice(0, 5).map((e) => {
              const sevCol = severitySlaColor[e.severity];
              const analyst = TEAM_ROSTER.find((a) => a.id === e.fromAnalystId);
              const statusCol = e.status === "pending" ? "#FB923C" : e.status === "reviewed" ? "#D4A84B" : "#4ADE80";
              const mins = Math.max(1, Math.floor((Date.now() - new Date(e.escalatedAt).getTime()) / 60_000));
              return (
                <div key={e.id} className="px-4 py-3" style={{ borderColor: "rgba(181,142,60,0.05)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest font-['JetBrains_Mono']"
                      style={{ background: `${sevCol}18`, color: sevCol }}
                    >
                      {e.severity}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest font-['JetBrains_Mono']"
                      style={{ background: `${statusCol}18`, color: statusCol }}
                    >
                      {e.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-gray-600 font-['JetBrains_Mono'] ml-auto">
                      {mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h`} {isAr ? "" : "ago"}
                    </span>
                  </div>
                  <div className="text-white text-xs font-semibold leading-snug">
                    {isAr ? e.reasonAr : e.reason}
                  </div>
                  <div className="text-gray-500 text-[10px] font-['JetBrains_Mono'] mt-1">
                    {analyst?.avatarInitials ?? "??"} → {e.toRole} · {e.caseId}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Source Health Grid */}
        <div
          className="rounded-xl border"
          style={{ background: "rgba(20,29,46,0.65)", borderColor: "rgba(181,142,60,0.12)" }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
            <h3 className="text-white text-sm font-bold">{isAr ? "صحة المصادر" : "Source Health"}</h3>
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
              {isAr ? "مصادر الاستخبارات المفتوحة" : "OSINT adapter status"}
            </p>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {OSINT_SOURCES.slice(0, 8).map((s) => (
              <SourceChip key={s.id} source={s} isAr={isAr} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorHome;
