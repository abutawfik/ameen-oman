interface RiskScoreGaugeProps {
  score: number;
  size?: number;
}

const getScoreColor = (score: number) => {
  if (score <= 25) return "#4ADE80";
  if (score <= 50) return "#FACC15";
  if (score <= 75) return "#C98A1B";
  return "#C94A5E";
};

const getScoreLabel = (score: number, isAr: boolean) => {
  if (score <= 25) return isAr ? "منخفض" : "LOW";
  if (score <= 50) return isAr ? "متوسط" : "MEDIUM";
  if (score <= 75) return isAr ? "عالٍ" : "HIGH";
  return isAr ? "حرج" : "CRITICAL";
};

const RiskScoreGauge = ({ score, size = 140 }: RiskScoreGaugeProps) => {
  const color = getScoreColor(score);
  const radius = (size / 2) - 12;
  const circumference = 2 * Math.PI * radius;
  // Use 270° arc (from 135° to 405°)
  const arcLength = circumference * 0.75;
  const filled = (score / 100) * arcLength;
  const gap = arcLength - filled;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(135deg)" }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeLinecap="round"
        />
        {/* Fill */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${filled} ${gap + (circumference - arcLength)}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease, stroke 0.5s ease", filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black font-['JetBrains_Mono'] tabular-nums" style={{ color, fontSize: size * 0.22 }}>{score}</span>
        <span className="font-bold tracking-widest" style={{ color, fontSize: size * 0.07 }}>{getScoreLabel(score, false)}</span>
      </div>
    </div>
  );
};

export default RiskScoreGauge;
