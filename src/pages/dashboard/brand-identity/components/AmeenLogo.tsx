interface LogoProps {
  variant?: "full" | "compact" | "icon" | "hospitality" | "light" | "cobranded";
  size?: number;
  className?: string;
}

// Core hexagonal shield with stylized A + eye/lens motif
export const AmeenShield = ({ size = 64, light = false }: { size?: number; light?: boolean }) => {
  const cyan = "#D4A84B";
  const dark = light ? "#0B1220" : "#0B1220";
  const bg = light ? "white" : "transparent";

  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer hexagon shield — double line */}
      <polygon
        points="50,4 93,27 93,73 50,96 7,73 7,27"
        fill={light ? "white" : "rgba(20,29,46,0.95)"}
        stroke={cyan}
        strokeWidth="2.5"
      />
      <polygon
        points="50,9 88,30 88,70 50,91 12,70 12,30"
        fill="none"
        stroke={cyan}
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />

      {/* Subtle inner glow fill */}
      <polygon
        points="50,9 88,30 88,70 50,91 12,70 12,30"
        fill={light ? "rgba(181,142,60,0.05)" : "rgba(181,142,60,0.06)"}
      />

      {/* Stylized A — two diagonal strokes meeting at apex */}
      <line x1="50" y1="22" x2="30" y2="72" stroke={cyan} strokeWidth="4.5" strokeLinecap="round" />
      <line x1="50" y1="22" x2="70" y2="72" stroke={cyan} strokeWidth="4.5" strokeLinecap="round" />

      {/* A crossbar — also acts as lens/eye horizontal axis */}
      <line x1="35" y1="55" x2="65" y2="55" stroke={cyan} strokeWidth="3" strokeLinecap="round" />

      {/* Eye/lens motif centered on crossbar */}
      <ellipse cx="50" cy="55" rx="9" ry="5.5" fill="none" stroke={cyan} strokeWidth="1.8" />
      {/* Iris */}
      <circle cx="50" cy="55" r="2.8" fill={cyan} />
      {/* Pupil */}
      <circle cx="50" cy="55" r="1.2" fill={light ? "white" : "#0B1220"} />

      {/* Corner accent dots — networked nodes */}
      {[
        [50, 6], [91, 28.5], [91, 71.5], [50, 94], [9, 71.5], [9, 28.5],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2" fill={cyan} opacity="0.7" />
      ))}

      {/* Connecting edge lines between nodes — subtle */}
      <polygon
        points="50,6 91,28.5 91,71.5 50,94 9,71.5 9,28.5"
        fill="none"
        stroke={cyan}
        strokeWidth="0.4"
        strokeOpacity="0.25"
        strokeDasharray="3 4"
      />
    </svg>
  );
};

// Hospitality leaf accent
export const HospitalityLeaf = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M8 14 C4 10 2 6 4 3 C6 1 10 2 12 5 C14 8 12 12 8 14Z" fill="#D4A84B" opacity="0.7" />
    <path d="M8 14 L8 7" stroke="#D4A84B" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const AmeenLogo = ({ variant = "full", size = 64, className = "" }: LogoProps) => {
  const cyan = "#D4A84B";

  if (variant === "icon") {
    return (
      <div className={className}>
        <AmeenShield size={size} />
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <AmeenShield size={size * 0.7} />
        <div>
          <div className="font-black tracking-widest uppercase" style={{ color: cyan, fontSize: size * 0.28, fontFamily: "'Inter', sans-serif", letterSpacing: "0.18em" }}>
            AMEEN
          </div>
          <div className="font-bold" style={{ color: cyan, fontSize: size * 0.18, fontFamily: "'Noto Kufi Arabic', 'Arial', sans-serif", opacity: 0.8, letterSpacing: "0.05em" }}>
            أمين
          </div>
        </div>
      </div>
    );
  }

  if (variant === "hospitality") {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <div className="relative">
          <AmeenShield size={size} />
          <div className="absolute -bottom-1 -right-1">
            <HospitalityLeaf size={size * 0.28} />
          </div>
        </div>
        <div className="text-center">
          <div className="font-black tracking-widest uppercase" style={{ color: cyan, fontSize: size * 0.2, fontFamily: "'Inter', sans-serif", letterSpacing: "0.15em" }}>
            AMEEN
          </div>
          <div className="font-semibold tracking-wider" style={{ color: "#D1D5DB", fontSize: size * 0.14, fontFamily: "'Inter', sans-serif", letterSpacing: "0.12em" }}>
            HOSPITALITY
          </div>
          <div className="font-bold mt-0.5" style={{ color: cyan, fontSize: size * 0.13, fontFamily: "'Noto Kufi Arabic', 'Arial', sans-serif", opacity: 0.85 }}>
            أمين للضيافة
          </div>
        </div>
      </div>
    );
  }

  if (variant === "light") {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <AmeenShield size={size} light />
        <div className="text-center">
          <div className="font-black tracking-widest uppercase" style={{ color: "#0B1220", fontSize: size * 0.22, fontFamily: "'Inter', sans-serif", letterSpacing: "0.18em" }}>
            AMEEN
          </div>
          <div className="font-bold" style={{ color: "#0B1220", fontSize: size * 0.14, fontFamily: "'Noto Kufi Arabic', 'Arial', sans-serif", opacity: 0.7 }}>
            أمين
          </div>
          <div className="font-medium mt-1" style={{ color: "#374151", fontSize: size * 0.1, fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" }}>
            The Nation&apos;s Trusted Guardian
          </div>
        </div>
      </div>
    );
  }

  if (variant === "cobranded") {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        {/* Police Emblem placeholder */}
        <div className="flex flex-col items-center">
          <div className="rounded-full flex items-center justify-center" style={{ width: size * 0.7, height: size * 0.7, background: "rgba(181,142,60,0.08)", border: "2px solid rgba(181,142,60,0.3)" }}>
            <span style={{ color: cyan, fontSize: size * 0.22, fontFamily: "'JetBrains Mono', monospace", fontWeight: 900 }}>NP</span>
          </div>
          <div style={{ color: "#9CA3AF", fontSize: size * 0.1, fontFamily: "'Inter', sans-serif", marginTop: 4, letterSpacing: "0.05em" }}>
            National Police
          </div>
        </div>
        {/* Divider */}
        <div style={{ width: 1, height: size * 0.8, background: "rgba(181,142,60,0.25)" }} />
        {/* AMEEN */}
        <div className="flex flex-col items-center gap-1">
          <AmeenShield size={size * 0.65} />
          <div className="font-black tracking-widest uppercase" style={{ color: cyan, fontSize: size * 0.18, fontFamily: "'Inter', sans-serif", letterSpacing: "0.18em" }}>
            AMEEN
          </div>
          <div style={{ color: "#9CA3AF", fontSize: size * 0.1, fontFamily: "'Inter', sans-serif", letterSpacing: "0.06em" }}>
            أمين
          </div>
        </div>
      </div>
    );
  }

  // Full lockup (default)
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <AmeenShield size={size} />
      <div className="text-center">
        <div className="font-black tracking-widest uppercase" style={{ color: cyan, fontSize: size * 0.24, fontFamily: "'Inter', sans-serif", letterSpacing: "0.2em" }}>
          AMEEN
        </div>
        <div className="font-bold" style={{ color: cyan, fontSize: size * 0.18, fontFamily: "'Noto Kufi Arabic', 'Arial', sans-serif", opacity: 0.9, letterSpacing: "0.05em" }}>
          أمين
        </div>
        <div className="font-medium mt-2" style={{ color: "#9CA3AF", fontSize: size * 0.1, fontFamily: "'Inter', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          The Nation&apos;s Trusted Guardian
        </div>
        <div className="font-medium mt-0.5" style={{ color: "#9CA3AF", fontSize: size * 0.1, fontFamily: "'Noto Kufi Arabic', 'Arial', sans-serif", opacity: 0.8 }}>
          الحارس الأمين للوطن
        </div>
      </div>
    </div>
  );
};

export default AmeenLogo;
