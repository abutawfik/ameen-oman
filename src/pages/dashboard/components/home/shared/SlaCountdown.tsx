import { useEffect, useState } from "react";

interface Props {
  deadline: string; // ISO
  // 5-minute threshold is the "red + pulse" gate; anything below 15m is "warn".
  isAr?: boolean;
  compact?: boolean;
}

// Live-ticking countdown pill. Pulses red when <5 minutes remain,
// orange when <15m, otherwise cyan. Keeps its own clock to avoid
// re-rendering the whole parent every second.
const SlaCountdown = ({ deadline, isAr = false, compact = false }: Props) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const deadlineMs = new Date(deadline).getTime();
  const diffMs = deadlineMs - now;
  const breached = diffMs <= 0;
  const absMs = Math.abs(diffMs);
  const mins = Math.floor(absMs / 60_000);
  const secs = Math.floor((absMs % 60_000) / 1000);

  const critical = diffMs > 0 && diffMs < 5 * 60_000;
  const warn = diffMs > 0 && diffMs < 15 * 60_000 && !critical;

  const color = breached ? "#F87171" : critical ? "#F87171" : warn ? "#FB923C" : "#22D3EE";
  const bg = breached || critical ? "rgba(248,113,113,0.12)" : warn ? "rgba(251,146,60,0.12)" : "rgba(34,211,238,0.1)";
  const borderCol = breached || critical ? "rgba(248,113,113,0.4)" : warn ? "rgba(251,146,60,0.4)" : "rgba(34,211,238,0.3)";

  const label = breached
    ? isAr
      ? `متأخر ${mins}د ${secs.toString().padStart(2, "0")}ث`
      : `BREACHED ${mins}m ${secs.toString().padStart(2, "0")}s`
    : `${mins}m ${secs.toString().padStart(2, "0")}s`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${compact ? "px-2 py-0.5" : "px-2.5 py-1"} rounded-md text-[11px] font-bold font-['JetBrains_Mono'] tracking-wider whitespace-nowrap`}
      style={{ background: bg, color, border: `1px solid ${borderCol}` }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${critical || breached ? "animate-pulse" : ""}`}
        style={{ background: color }}
      />
      {label}
    </span>
  );
};

export default SlaCountdown;
