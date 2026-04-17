import { useState, useEffect } from "react";
import { incidents } from "@/mocks/systemAdminData";

const severityConfig: Record<string, { color: string; bg: string }> = {
  critical: { color: "#F87171", bg: "rgba(248,113,113,0.12)" },
  high:     { color: "#FB923C", bg: "rgba(251,146,60,0.12)" },
  medium:   { color: "#FACC15", bg: "rgba(250,204,21,0.12)" },
  low:      { color: "#D4A84B", bg: "rgba(181,142,60,0.12)" },
};

const statusConfig: Record<string, { color: string; label: string }> = {
  open:          { color: "#F87171", label: "Open" },
  investigating: { color: "#FACC15", label: "Investigating" },
  resolved:      { color: "#4ADE80", label: "Resolved" },
};

const generatePoints = (count: number, base: number, variance: number) =>
  Array.from({ length: count }, (_, i) => base + Math.sin(i * 0.7) * variance + (Math.random() - 0.5) * variance * 0.4);

const timeLabels = ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22", "24"];

const LineChart = ({ datasets, height = 100 }: { datasets: { data: number[]; color: string; label: string }[]; height?: number }) => {
  const allVals = datasets.flatMap((d) => d.data);
  const max = Math.max(...allVals);
  const min = 0;
  const range = max - min || 1;
  const w = 400;
  const h = height;
  const pad = 4;

  return (
    <div className="relative">
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((pct) => (
          <line key={pct} x1={0} y1={h * pct} x2={w} y2={h * pct} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {datasets.map((ds) => {
          const pts = ds.data.map((v, i) => `${(i / (ds.data.length - 1)) * w},${h - ((v - min) / range) * (h - pad * 2) - pad}`).join(" ");
          const fillPts = `0,${h} ${pts} ${w},${h}`;
          return (
            <g key={ds.label}>
              <polyline points={fillPts} fill={`${ds.color}10`} stroke="none" />
              <polyline points={pts} fill="none" stroke={ds.color} strokeWidth="1.5" strokeLinejoin="round" />
            </g>
          );
        })}
      </svg>
      {/* Time labels */}
      <div className="flex justify-between mt-1">
        {timeLabels.map((t) => (
          <span key={t} className="text-gray-700 font-['JetBrains_Mono']" style={{ fontSize: "9px" }}>{t}h</span>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ data, color, height = 60 }: { data: number[]; color: string; height?: number }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-sm transition-all" style={{ height: `${(v / max) * 100}%`, background: color, opacity: i === data.length - 1 ? 1 : 0.5 + (i / data.length) * 0.5 }} />
      ))}
    </div>
  );
};

const GaugeRing = ({ value, max, label, unit }: { value: number; max: number; label: string; unit: string }) => {
  const pct = value / max;
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ * 0.75;
  const gap = circ - dash;
  const ringColor = pct < 0.4 ? "#4ADE80" : pct < 0.7 ? "#FACC15" : "#F87171";
  const isOk = pct < 0.5;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-[135deg]">
          <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeLinecap="round" />
          <circle cx="48" cy="48" r={r} fill="none" stroke={ringColor} strokeWidth="8"
            strokeDasharray={`${dash} ${gap + circ * 0.25}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.5s ease", filter: `drop-shadow(0 0 4px ${ringColor}80)` }} />
        </svg>
        <div className="absolute text-center">
          <p className="text-white text-sm font-bold font-['JetBrains_Mono']">{value.toFixed(1)}</p>
          <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{unit}</p>
        </div>
      </div>
      <p className="text-gray-400 text-xs font-['Inter'] mt-1">{label}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: isOk ? "#4ADE80" : "#FACC15" }} />
        <span className="text-xs font-['JetBrains_Mono']" style={{ color: isOk ? "#4ADE80" : "#FACC15" }}>{isOk ? "Normal" : "Elevated"}</span>
      </div>
    </div>
  );
};

const ResourceBar = ({ label, value, color, sublabel }: { label: string; value: number; color: string; sublabel?: string }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <div>
        <span className="text-gray-400 font-['Inter']">{label}</span>
        {sublabel && <span className="text-gray-600 font-['Inter'] ml-2">{sublabel}</span>}
      </div>
      <span className="font-['JetBrains_Mono'] font-bold" style={{ color }}>{value}%</span>
    </div>
    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color, boxShadow: `0 0 8px ${color}50` }} />
    </div>
  </div>
);

const SystemHealth = () => {
  const [apiData] = useState({
    p50: generatePoints(24, 42, 12),
    p95: generatePoints(24, 118, 35),
    p99: generatePoints(24, 287, 75),
  });
  const [queueData] = useState(generatePoints(12, 340, 120).map((v) => Math.max(0, v)));
  const [rl1Lag] = useState(1.2);
  const [rl2Lag] = useState(2.8);
  const [cpu, setCpu] = useState(67);
  const [memory] = useState(54);
  const [disk] = useState(43);
  const [network] = useState(28);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu((prev) => Math.max(20, Math.min(95, prev + (Math.random() - 0.5) * 8)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* SLA Banner */}
      <div className="rounded-xl p-5 flex items-center justify-between" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.2)" }}>
        <div>
          <p className="text-gray-500 text-xs font-['Inter'] uppercase tracking-wider mb-1">System Uptime SLA</p>
          <p className="text-gold-400 text-5xl font-bold font-['JetBrains_Mono']" style={{ textShadow: "0 0 30px rgba(181,142,60,0.5)" }}>99.95%</p>
          <p className="text-gray-500 text-xs font-['JetBrains_Mono'] mt-1">Last 30 days — Target: 99.9% ✓ Exceeding SLA</p>
        </div>
        <div className="grid grid-cols-4 gap-6 text-center">
          {[
            { label: "Uptime", value: "43d 14h", color: "#4ADE80" },
            { label: "Incidents", value: String(incidents.length), color: "#FACC15" },
            { label: "MTTR", value: "18 min", color: "#D4A84B" },
            { label: "Open", value: String(incidents.filter((i) => i.status !== "resolved").length), color: "#FB923C" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</p>
              <p className="text-gray-600 text-xs font-['Inter']">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* API Response Times */}
        <div className="col-span-2 rounded-xl p-5" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.12)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-sm font-['Inter']">
              <i className="ri-speed-line mr-2 text-gold-400" />API Response Times (24h)
            </h3>
            <div className="flex items-center gap-4 text-xs font-['JetBrains_Mono']">
              <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 inline-block rounded bg-gold-400" />p50</span>
              <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 inline-block rounded bg-yellow-400" />p95</span>
              <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 inline-block rounded bg-red-400" />p99</span>
            </div>
          </div>
          <LineChart datasets={[
            { data: apiData.p99, color: "#F87171", label: "p99" },
            { data: apiData.p95, color: "#FACC15", label: "p95" },
            { data: apiData.p50, color: "#D4A84B", label: "p50" },
          ]} height={110} />
          <div className="grid grid-cols-3 gap-3 mt-3">
            {[
              { label: "p50 (median)", value: "42ms", sub: "↓ 3ms vs yesterday", color: "#D4A84B" },
              { label: "p95", value: "118ms", sub: "→ Stable", color: "#FACC15" },
              { label: "p99", value: "287ms", sub: "↑ 12ms vs yesterday", color: "#F87171" },
            ].map((m) => (
              <div key={m.label} className="text-center p-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-xl font-bold font-['JetBrains_Mono']" style={{ color: m.color }}>{m.value}</p>
                <p className="text-gray-600 text-xs font-['Inter']">{m.label}</p>
                <p className="text-gray-700 text-xs font-['JetBrains_Mono'] mt-0.5">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="rounded-xl p-5" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.12)" }}>
          <h3 className="text-white font-semibold text-sm font-['Inter'] mb-4">
            <i className="ri-cpu-line mr-2 text-gold-400" />Resource Utilization
          </h3>
          <div className="space-y-4 mb-4">
            <ResourceBar label="CPU" value={Math.round(cpu)} sublabel="4 cores" color={cpu > 80 ? "#F87171" : cpu > 60 ? "#FACC15" : "#4ADE80"} />
            <ResourceBar label="Memory" value={memory} sublabel="32 GB" color="#D4A84B" />
            <ResourceBar label="Disk I/O" value={disk} sublabel="NVMe" color="#A78BFA" />
            <ResourceBar label="Network" value={network} sublabel="10 Gbps" color="#34D399" />
          </div>
          <div className="space-y-1.5 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            {[
              { label: "API Nodes", value: "4/4", color: "#4ADE80" },
              { label: "DB Replicas", value: "3/3", color: "#4ADE80" },
              { label: "Queue Workers", value: "8/8", color: "#4ADE80" },
              { label: "Cache Nodes", value: "2/2", color: "#4ADE80" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-['Inter']">{s.label}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.color }} />
                  <span className="text-xs font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Queue Depth */}
        <div className="rounded-xl p-5" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.12)" }}>
          <h3 className="text-white font-semibold text-sm font-['Inter'] mb-3">
            <i className="ri-stack-line mr-2 text-gold-400" />Queue Depth (12h)
          </h3>
          <BarChart data={queueData.map((v) => Math.max(10, v))} color="#FACC15" height={64} />
          <div className="flex justify-between mt-2 text-xs font-['JetBrains_Mono']">
            <span className="text-gray-500">12h ago</span>
            <span className="text-gray-500">Now</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {[
              { label: "Current", value: "342", color: "#FACC15" },
              { label: "Peak (24h)", value: "1,247", color: "#FB923C" },
              { label: "Avg (24h)", value: "489", color: "#D4A84B" },
              { label: "Threshold", value: "2,000", color: "#9CA3AF" },
            ].map((s) => (
              <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                <p className="text-sm font-bold font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</p>
                <p className="text-gray-600 text-xs font-['Inter']">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* VIS Replication */}
        <div className="rounded-xl p-5" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.12)" }}>
          <h3 className="text-white font-semibold text-sm font-['Inter'] mb-4">
            <i className="ri-refresh-line mr-2 text-gold-400" />Replication Lag
          </h3>
          <div className="flex justify-around mb-4">
            <GaugeRing value={rl1Lag} max={10} label="Security Dept 1" unit="min" />
            <GaugeRing value={rl2Lag} max={10} label="Security Dept 2" unit="min" />
          </div>
          <div className="space-y-2 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            {[
              { label: "SD1 Last Sync", value: "2 min ago", color: "#4ADE80" },
              { label: "SD2 Last Sync", value: "3 min ago", color: "#4ADE80" },
              { label: "Sync Interval", value: "30 sec", color: "#D4A84B" },
              { label: "Timeout Threshold", value: "300 sec", color: "#9CA3AF" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-['Inter']">{s.label}</span>
                <span className="text-xs font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Log */}
        <div className="rounded-xl p-5" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.12)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-sm font-['Inter']">
              <i className="ri-alarm-warning-line mr-2 text-gold-400" />Incident Log
            </h3>
            <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{incidents.length} total</span>
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            {incidents.map((inc) => {
              const sc = severityConfig[inc.severity];
              const stc = statusConfig[inc.status];
              const isSelected = selectedIncident === inc.id;
              return (
                <div key={inc.id} className="rounded-lg cursor-pointer transition-all"
                  style={{ background: isSelected ? "rgba(181,142,60,0.05)" : "rgba(255,255,255,0.02)", borderLeft: `3px solid ${sc.color}`, border: isSelected ? `1px solid rgba(181,142,60,0.2)` : undefined, borderLeftWidth: "3px" }}
                  onClick={() => setSelectedIncident(isSelected ? null : inc.id)}>
                  <div className="p-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-white text-xs font-['Inter'] leading-tight">{inc.title}</p>
                      <span className="text-xs font-['JetBrains_Mono'] flex-shrink-0" style={{ color: stc.color }}>{stc.label}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.5 rounded text-xs font-['JetBrains_Mono'] capitalize" style={{ background: sc.bg, color: sc.color }}>{inc.severity}</span>
                      <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{inc.duration}</span>
                      <span className="text-gray-700 text-xs font-['JetBrains_Mono'] ml-auto">{inc.timestamp.split(" ")[0]}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="px-2.5 pb-2.5">
                      <div className="flex gap-2">
                        <button className="px-2 py-1 rounded text-xs cursor-pointer whitespace-nowrap" style={{ background: "#D4A84B", color: "#0B1220" }}>Acknowledge</button>
                        <button className="px-2 py-1 rounded text-xs cursor-pointer whitespace-nowrap" style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF" }}>View Details</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
