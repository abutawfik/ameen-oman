import { SCORE_BAND_META, type RiskBand } from "@/mocks/osintData";

interface Props {
  score: number;
  band?: RiskBand;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  isAr?: boolean;
}

const bandFor = (score: number): RiskBand => {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 45) return "elevated";
  if (score >= 25) return "borderline";
  return "low";
};

// Coloured 0-100 badge, uses the same palette as the OSINT engine so
// the home dashboard feels visually consistent with the deeper tool.
const ScoreBadge = ({ score, band, size = "md", showLabel = false, isAr = false }: Props) => {
  const effectiveBand = band ?? bandFor(score);
  const meta = SCORE_BAND_META[effectiveBand];
  const dims =
    size === "sm"
      ? { box: "w-9 h-9", text: "text-xs" }
      : size === "lg"
        ? { box: "w-14 h-14", text: "text-lg" }
        : { box: "w-11 h-11", text: "text-sm" };

  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`${dims.box} flex items-center justify-center rounded-lg`}
        style={{ background: `${meta.color}18`, border: `2px solid ${meta.color}55` }}
      >
        <span
          className={`${dims.text} font-black font-['JetBrains_Mono']`}
          style={{ color: meta.color }}
        >
          {score}
        </span>
      </div>
      {showLabel && (
        <span
          className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest font-['JetBrains_Mono']"
          style={{ background: `${meta.color}20`, color: meta.color }}
        >
          {isAr ? meta.labelAr : meta.labelEn}
        </span>
      )}
    </div>
  );
};

export default ScoreBadge;
