import { useState, useEffect } from "react";
import {
  currentThreatLevel,
  threatLevelConfig,
  threatHistory,
  threatIndicators,
  streamThreatScores,
  type ThreatLevel,
} from "@/mocks/nationalSecurityData";

interface Props {
  isAr: boolean;
}

const LEVELS: ThreatLevel[] = ["LOW", "GUARDED", "ELEVATED", "HIGH", "CRITICAL"];

const ThreatLevelGauge = ({ isAr }: Props) => {
  const [animScore, setAnimScore] = useState(0);
  const cfg = threatLevelConfig[currentThreatLevel];
  const levelIndex = LEVELS.indexOf(currentThreatLevel);
  const targetScore = threatHistory[threatHistory.length - 1].score;

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const step = setInterval(() => {
        current += 2;
        if (current >= targetScore) {
          setAnimScore(targetScore);
          clearInterval(step);
        } else {
          setAnimScore(current);
        }
      }, 20);
      return () => clearInterval(step);
    }, 300);
    return () => clearTimeout(timer);
  }, [targetScore]);

  return (
    <div className="space-y-5">
      {/* Main threat level card */}
      <div className="rounded-2xl border overflow-hidden relative"
        style={{ background: cfg.bg, borderColor: cfg.border, backdropFilter: "blur(12px)" }}>
        {/* Animated glow */}
        <div className="absolute inset-0 pointer-events-none animate-pulse"
          style={{ background: `radial-gradient(ellipse at center, ${cfg.color}08, transparent 70%)` }} />

        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-gray-400 text-xs font-['JetBrains_Mono'] uppercase tracking-widest mb-1">
                {isAr ? "مستوى التهديد الوطني" : "National Threat Level"}
              </p>
              <div className="flex items-center gap-3">
                <span className="font-black text-4xl tracking-wider font-['JetBrains_Mono']" style={{ color: cfg.color }}>
                  {isAr ? cfg.labelAr : cfg.label}
                </span>
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: cfg.color }} />
              </div>
              <p className="text-sm mt-1" style={{ color: cfg.color, opacity: 0.8 }}>
                {isAr ? cfg.descriptionAr : cfg.description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-5xl font-black font-['JetBrains_Mono']" style={{ color: cfg.color }}>
                {animScore}
              </div>
              <span className="text-gray-500 text-xs font-['JetBrains_Mono']">/100</span>
            </div>
          </div>

          {/* Level bar */}
          <div className="flex gap-1 mb-4">
            {LEVELS.map((lvl, i) => {
              const lvlCfg = threatLevelConfig[lvl];
              const isActive = i <= levelIndex;
              const isCurrent = lvl === currentThreatLevel;
              return (
                <div key={lvl} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full h-3 rounded-sm transition-all"
                    style={{
                      background: isActive ? lvlCfg.color : "rgba(255,255,255,0.06)",
                      boxShadow: isCurrent ? `0 0 8px ${lvlCfg.color}` : "none",
                    }} />
                  <span className="text-xs font-['JetBrains_Mono'] font-bold"
                    style={{ color: isCurrent ? lvlCfg.color : "#374151", fontSize: "8px" }}>
                    {isAr ? lvlCfg.labelAr : lvl}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Score progress bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{isAr ? "مؤشر التهديد المركب" : "Composite Threat Index"}</span>
              <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: cfg.color }}>{animScore}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${animScore}%`, background: `linear-gradient(90deg, ${cfg.color}80, ${cfg.color})` }} />
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <i className="ri-time-line text-gray-600 text-xs" />
              <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{isAr ? "آخر تحديث: 14:32:07" : "Last updated: 14:32:07"}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-arrow-up-line text-orange-400 text-xs" />
              <span className="text-orange-400 text-xs font-['JetBrains_Mono']">{isAr ? "+7 نقاط منذ أمس" : "+7 pts since yesterday"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-day trend */}
      <div className="rounded-2xl border p-5"
        style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 flex items-center justify-center rounded-lg"
            style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
            <i className="ri-line-chart-line text-cyan-400 text-xs" />
          </div>
          <span className="text-white font-bold text-sm">{isAr ? "اتجاه 7 أيام" : "7-Day Trend"}</span>
        </div>
        <div className="flex items-end gap-2 h-20">
          {threatHistory.map((h, i) => {
            const lvlCfg = threatLevelConfig[h.level];
            const isLast = i === threatHistory.length - 1;
            return (
              <div key={h.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-sm transition-all relative group"
                  style={{
                    height: `${(h.score / 100) * 64}px`,
                    background: isLast ? lvlCfg.color : `${lvlCfg.color}50`,
                    boxShadow: isLast ? `0 0 8px ${lvlCfg.color}60` : "none",
                  }}>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                    style={{ background: "rgba(6,13,26,0.95)", border: "1px solid rgba(34,211,238,0.2)", color: lvlCfg.color }}>
                    {h.score} — {isAr ? lvlCfg.labelAr : h.level}
                  </div>
                </div>
                <span className="text-gray-600 font-['JetBrains_Mono']" style={{ fontSize: "8px" }}>{h.date.split(" ")[1]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stream threat scores */}
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
          <div className="w-6 h-6 flex items-center justify-center rounded-lg"
            style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
            <i className="ri-bar-chart-2-line text-cyan-400 text-xs" />
          </div>
          <span className="text-white font-bold text-sm">{isAr ? "درجات التهديد حسب المصدر" : "Threat Score by Stream"}</span>
        </div>
        <div className="p-4 space-y-2.5">
          {streamThreatScores.slice(0, 8).map((s) => {
            const scoreColor = s.score >= 70 ? "#F87171" : s.score >= 50 ? "#FB923C" : s.score >= 30 ? "#FACC15" : "#4ADE80";
            return (
              <div key={s.stream} className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
                </div>
                <span className="text-gray-400 text-xs flex-shrink-0 w-32 truncate">{s.stream}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${s.score}%`, background: scoreColor }} />
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-xs font-bold font-['JetBrains_Mono'] w-6 text-right" style={{ color: scoreColor }}>{s.score}</span>
                  <i className={`text-xs ${s.trend === "up" ? "ri-arrow-up-line text-red-400" : s.trend === "down" ? "ri-arrow-down-line text-green-400" : "ri-subtract-line text-gray-600"}`} />
                  {s.alerts > 0 && (
                    <span className="px-1 py-0.5 rounded text-xs font-bold font-['JetBrains_Mono']"
                      style={{ background: "rgba(248,113,113,0.12)", color: "#F87171", fontSize: "8px" }}>
                      {s.alerts}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active threat indicators */}
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
          <div className="w-6 h-6 flex items-center justify-center rounded-lg"
            style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
            <i className="ri-alarm-warning-line text-red-400 text-xs" />
          </div>
          <span className="text-white font-bold text-sm">{isAr ? "مؤشرات التهديد النشطة" : "Active Threat Indicators"}</span>
          <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
            style={{ background: "rgba(248,113,113,0.12)", color: "#F87171" }}>
            {threatIndicators.length}
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(34,211,238,0.04)" }}>
          {threatIndicators.map((ti) => {
            const sevColor = ti.severity === "critical" ? "#F87171" : ti.severity === "high" ? "#FB923C" : ti.severity === "medium" ? "#FACC15" : "#4ADE80";
            return (
              <div key={ti.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer">
                <div className="w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0 mt-0.5"
                  style={{ background: `${ti.streamColor}12`, border: `1px solid ${ti.streamColor}20` }}>
                  <i className={`${ti.streamIcon} text-xs`} style={{ color: ti.streamColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-gray-400 text-xs">{ti.stream}</span>
                    <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{ti.time}</span>
                  </div>
                  <p className="text-white text-xs leading-relaxed">{ti.signal}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{ti.location}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: sevColor }}>{ti.score}</span>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: sevColor }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThreatLevelGauge;
