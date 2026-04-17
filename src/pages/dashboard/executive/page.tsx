import { useState } from "react";
import { execKpis, streamHealth, threatTrend, topRiskSubjects, morningBriefing, regionalThreats } from "@/mocks/executiveDashboardData";

const TrendSparkline = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80; const h = 28;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const ExecutiveDashboardPage = () => {
  const [briefingExpanded, setBriefingExpanded] = useState<string | null>(null);

  const priorityColors = { critical: "#F87171", high: "#FB923C", medium: "#FACC15" };
  const threatLevelColors = { critical: "#F87171", high: "#FB923C", medium: "#FACC15", low: "#4ADE80" };
  const statusColors = { nominal: "#4ADE80", elevated: "#FACC15", critical: "#F87171" };

  return (
    <div className="flex flex-col h-full" style={{ background: "#060D1A" }}>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="ex-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22D3EE" strokeWidth="0.5" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#ex-grid)" />
        </svg>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0" style={{ borderColor: "rgba(34,211,238,0.1)", background: "rgba(10,22,40,0.7)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)" }}>
              <i className="ri-bar-chart-box-line text-cyan-400 text-sm" />
            </div>
            <div>
              <h1 className="text-white text-sm font-bold font-['Inter']">Executive Intelligence Dashboard</h1>
              <p className="text-gray-500 text-xs font-['JetBrains_Mono']">National threat overview · All 16 streams · Auto-briefing generation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-xs font-['JetBrains_Mono']">Last updated: 2025-04-06 07:45</span>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-['Inter'] cursor-pointer whitespace-nowrap" style={{ background: "rgba(34,211,238,0.08)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}>
              <i className="ri-file-text-line" />Generate Briefing
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(34,211,238,0.2) transparent" }}>

          {/* KPI Cards */}
          <div className="grid grid-cols-6 gap-3">
            {execKpis.map((kpi) => (
              <div key={kpi.id} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: `${kpi.color}15` }}>
                    <i className={`${kpi.icon} text-xs`} style={{ color: kpi.color }} />
                  </div>
                  <span className="text-[10px] font-['JetBrains_Mono']" style={{ color: kpi.deltaUp ? "#4ADE80" : "#F87171" }}>
                    {kpi.delta}
                  </span>
                </div>
                <p className="text-white text-lg font-black font-['JetBrains_Mono'] leading-none">{kpi.value}<span className="text-xs text-gray-600">{kpi.unit}</span></p>
                <p className="text-gray-600 text-[10px] font-['Inter'] mt-1 leading-tight">{kpi.label}</p>
                <div className="mt-2">
                  <TrendSparkline data={kpi.trend} color={kpi.color} />
                </div>
              </div>
            ))}
          </div>

          {/* Morning Briefing + Top Risk Subjects */}
          <div className="grid grid-cols-3 gap-4">
            {/* Morning Briefing */}
            <div className="col-span-2 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2">
                  <i className="ri-sun-line text-yellow-400 text-sm" />
                  <p className="text-white text-xs font-bold font-['Inter']">Morning Intelligence Briefing</p>
                  <span className="text-[10px] px-2 py-0.5 rounded font-['JetBrains_Mono']" style={{ background: "rgba(250,204,21,0.1)", color: "#FACC15" }}>2025-04-06</span>
                </div>
                <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{morningBriefing.length} items</span>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {morningBriefing.map((item) => {
                  const isExp = briefingExpanded === item.id;
                  return (
                    <button key={item.id} onClick={() => setBriefingExpanded(isExp ? null : item.id)}
                      className="w-full text-left px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-1 self-stretch rounded-full flex-shrink-0 mt-1" style={{ background: priorityColors[item.priority as keyof typeof priorityColors] }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{item.time}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-['JetBrains_Mono']" style={{ background: `${priorityColors[item.priority as keyof typeof priorityColors]}15`, color: priorityColors[item.priority as keyof typeof priorityColors] }}>
                              {item.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-white text-xs font-bold font-['Inter']">{item.title}</p>
                          {isExp && <p className="text-gray-400 text-xs font-['Inter'] mt-1 leading-relaxed">{item.summary}</p>}
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {item.streams.map((s) => (
                              <span key={s} className="text-[9px] px-1.5 py-0.5 rounded font-['Inter']" style={{ background: "rgba(34,211,238,0.08)", color: "#22D3EE" }}>{s}</span>
                            ))}
                          </div>
                        </div>
                        {isExp && (
                          <button className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-['Inter'] cursor-pointer whitespace-nowrap" style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                            {item.action}
                          </button>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Top Risk Subjects */}
            <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2">
                  <i className="ri-user-search-line text-red-400 text-sm" />
                  <p className="text-white text-xs font-bold font-['Inter']">Top Risk Subjects</p>
                </div>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {topRiskSubjects.map((s, idx) => (
                  <div key={s.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="text-gray-700 text-xs font-['JetBrains_Mono'] w-4 flex-shrink-0">{idx + 1}</span>
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={s.photo} alt={s.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-bold font-['Inter'] truncate">{s.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-[10px] font-['Inter']">{s.nationality}</span>
                        <span className="text-[9px] px-1 rounded font-['JetBrains_Mono']" style={{ background: s.status === "wanted" ? "rgba(248,113,113,0.15)" : "rgba(34,211,238,0.08)", color: s.status === "wanted" ? "#F87171" : "#22D3EE" }}>
                          {s.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-black font-['JetBrains_Mono'] text-sm" style={{ color: s.riskScore >= 90 ? "#F87171" : "#FB923C" }}>{s.riskScore}</p>
                      <p className="text-[10px] font-['JetBrains_Mono']" style={{ color: s.riskDelta > 0 ? "#F87171" : "#4ADE80" }}>
                        {s.riskDelta > 0 ? "+" : ""}{s.riskDelta}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Threat Trend Chart + Regional Map */}
          <div className="grid grid-cols-2 gap-4">
            {/* Threat Trend */}
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2 mb-4">
                <i className="ri-line-chart-line text-cyan-400 text-sm" />
                <p className="text-white text-xs font-bold font-['Inter']">7-Day Threat Trend</p>
              </div>
              <div className="space-y-2">
                {threatTrend.map((pt) => {
                  const total = pt.critical + pt.high + pt.medium + pt.low;
                  return (
                    <div key={pt.date} className="flex items-center gap-3">
                      <span className="text-gray-600 text-[10px] font-['JetBrains_Mono'] w-12 flex-shrink-0">{pt.date}</span>
                      <div className="flex-1 flex h-5 rounded overflow-hidden gap-px">
                        {[
                          { val: pt.critical, color: "#F87171" },
                          { val: pt.high,     color: "#FB923C" },
                          { val: pt.medium,   color: "#FACC15" },
                          { val: pt.low,      color: "#4ADE80" },
                        ].map((seg, i) => (
                          <div key={i} className="h-full transition-all" style={{ width: `${(seg.val / total) * 100}%`, background: seg.color, opacity: 0.8 }} />
                        ))}
                      </div>
                      <span className="text-gray-600 text-[10px] font-['JetBrains_Mono'] w-6 text-right flex-shrink-0">{total}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-3">
                {[{ label: "Critical", color: "#F87171" }, { label: "High", color: "#FB923C" }, { label: "Medium", color: "#FACC15" }, { label: "Low", color: "#4ADE80" }].map((l) => (
                  <div key={l.label} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm" style={{ background: l.color }} />
                    <span className="text-[10px] font-['Inter'] text-gray-600">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Threat Map */}
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2 mb-4">
                <i className="ri-map-pin-line text-cyan-400 text-sm" />
                <p className="text-white text-xs font-bold font-['Inter']">Regional Threat Distribution — Oman</p>
              </div>
              <div className="relative rounded-xl overflow-hidden" style={{ height: "180px", background: "rgba(34,211,238,0.03)", border: "1px solid rgba(34,211,238,0.1)" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-800 text-xs font-['JetBrains_Mono']">OMAN — REGIONAL MAP</span>
                </div>
                {regionalThreats.map((r) => (
                  <div key={r.region} className="absolute group cursor-pointer" style={{ left: `${r.x}%`, top: `${r.y}%`, transform: "translate(-50%,-50%)" }}>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: `${threatLevelColors[r.threatLevel]}30`, border: `2px solid ${threatLevelColors[r.threatLevel]}`, boxShadow: r.threatLevel === "critical" ? `0 0 10px ${threatLevelColors[r.threatLevel]}60` : "none" }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: threatLevelColors[r.threatLevel] }} />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded text-[9px] font-['Inter'] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" style={{ background: "rgba(6,13,26,0.95)", border: "1px solid rgba(34,211,238,0.2)", color: "#E5E7EB" }}>
                      <p className="font-bold">{r.region}</p>
                      <p>{r.activeIncidents} incidents · {r.watchlistHits} hits</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-1.5">
                {regionalThreats.slice(0, 4).map((r) => (
                  <div key={r.region} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: threatLevelColors[r.threatLevel] }} />
                      <span className="text-gray-400 text-[10px] font-['Inter']">{r.region}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{r.activeIncidents} incidents</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-['JetBrains_Mono']" style={{ background: `${threatLevelColors[r.threatLevel]}15`, color: threatLevelColors[r.threatLevel] }}>{r.threatLevel.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stream Health Grid */}
          <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2">
                <i className="ri-database-2-line text-cyan-400 text-sm" />
                <p className="text-white text-xs font-bold font-['Inter']">16-Stream Health Monitor</p>
              </div>
              <div className="flex items-center gap-3">
                {[{ label: "Nominal", color: "#4ADE80" }, { label: "Elevated", color: "#FACC15" }, { label: "Critical", color: "#F87171" }].map((l) => (
                  <div key={l.label} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                    <span className="text-[10px] font-['Inter'] text-gray-600">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-0">
              {streamHealth.map((s, i) => (
                <div key={s.stream} className="flex items-center gap-3 px-4 py-3" style={{ borderRight: (i + 1) % 4 !== 0 ? "1px solid rgba(255,255,255,0.04)" : "none", borderBottom: i < 12 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${s.color}15` }}>
                    <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[10px] font-['Inter'] font-medium truncate">{s.stream}</p>
                    <p className="text-gray-600 text-[9px] font-['JetBrains_Mono']">{s.eventsToday.toLocaleString()} events</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full" style={{ background: statusColors[s.status] }} />
                    {s.alertsToday > 0 && (
                      <span className="text-[9px] font-['JetBrains_Mono']" style={{ color: "#F87171" }}>{s.alertsToday}⚠</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboardPage;
