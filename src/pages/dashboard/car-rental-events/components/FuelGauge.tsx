import { useState } from "react";

// Fuel level type for vehicle pick-up and drop-off forms
export type FuelLevel = "full" | "three-quarter" | "half" | "quarter" | "empty";

interface Props {
  value: FuelLevel;
  onChange: (v: FuelLevel) => void;
  isAr: boolean;
}

const LEVELS: { value: FuelLevel; label: string; labelAr: string; pct: number }[] = [
  { value: "full",          label: "Full",  labelAr: "ممتلئ",    pct: 100 },
  { value: "three-quarter", label: "3/4",   labelAr: "ثلاثة أرباع", pct: 75 },
  { value: "half",          label: "1/2",   labelAr: "نصف",      pct: 50 },
  { value: "quarter",       label: "1/4",   labelAr: "ربع",      pct: 25 },
  { value: "empty",         label: "Empty", labelAr: "فارغ",     pct: 0  },
];

const getFuelColor = (pct: number) => {
  if (pct >= 75) return "#4ADE80";
  if (pct >= 50) return "#D6B47E";
  if (pct >= 25) return "#FACC15";
  return "#C94A5E";
};

const FuelGauge = ({ value, onChange, isAr }: Props) => {
  const selected = LEVELS.find((l) => l.value === value) ?? LEVELS[0];
  const color = getFuelColor(selected.pct);

  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.15)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 flex items-center justify-center">
          <i className="ri-gas-station-line text-gold-400 text-sm" />
        </div>
        <span className="text-gray-400 text-xs font-['Inter']">
          {isAr ? "مستوى الوقود" : "Fuel Level"}
        </span>
        <span
          className="ml-auto text-sm font-bold font-['JetBrains_Mono']"
          style={{ color }}
        >
          {isAr ? selected.labelAr : selected.label}
        </span>
      </div>

      {/* Visual gauge bar */}
      <div className="relative h-5 rounded-full mb-3 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${selected.pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
        {/* Tick marks */}
        {[25, 50, 75].map((tick) => (
          <div
            key={tick}
            className="absolute top-0 bottom-0 w-px"
            style={{ left: `${tick}%`, background: "rgba(255,255,255,0.15)" }}
          />
        ))}
        {/* Fuel icon at end */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <i className="ri-gas-station-fill text-xs" style={{ color: "rgba(255,255,255,0.3)" }} />
        </div>
      </div>

      {/* Selector buttons */}
      <div className="flex gap-1.5">
        {LEVELS.map((lvl) => {
          const isActive = lvl.value === value;
          const c = getFuelColor(lvl.pct);
          return (
            <button
              key={lvl.value}
              type="button"
              onClick={() => onChange(lvl.value)}
              className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap font-['JetBrains_Mono']"
              style={{
                background: isActive ? `${c}22` : "#0F1923",
                border: `1px solid ${isActive ? c : "rgba(255,255,255,0.08)"}`,
                color: isActive ? c : "#6B7280",
              }}
            >
              {isAr ? lvl.labelAr : lvl.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FuelGauge;
