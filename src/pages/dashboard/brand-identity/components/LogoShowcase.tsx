import AmeenLogo, { AmeenShield } from "./AmeenLogo";

const LogoShowcase = () => (
  <div className="space-y-6">
    {/* Logo Variations Grid */}
    <div>
      <h2 className="text-white font-bold text-lg font-['Inter'] mb-4">
        <i className="ri-shield-star-line mr-2 text-cyan-400" />Logo Variations
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {/* 1. Full Lockup */}
        <div className="rounded-2xl p-8 flex flex-col items-center justify-center min-h-56" style={{ background: "#060D1A", border: "1px solid rgba(34,211,238,0.15)" }}>
          <AmeenLogo variant="full" size={80} />
          <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-4 uppercase tracking-wider">01 — Full Lockup</p>
        </div>

        {/* 2. Compact */}
        <div className="rounded-2xl p-8 flex flex-col items-center justify-center min-h-56" style={{ background: "#060D1A", border: "1px solid rgba(34,211,238,0.15)" }}>
          <AmeenLogo variant="compact" size={80} />
          <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-4 uppercase tracking-wider">02 — Compact Horizontal</p>
        </div>

        {/* 3. Icon Only */}
        <div className="rounded-2xl p-8 flex flex-col items-center justify-center min-h-56" style={{ background: "#060D1A", border: "1px solid rgba(34,211,238,0.15)" }}>
          <AmeenLogo variant="icon" size={80} />
          <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-4 uppercase tracking-wider">03 — Icon Only</p>
        </div>

        {/* 4. Sub-brand Hospitality */}
        <div className="rounded-2xl p-8 flex flex-col items-center justify-center min-h-56" style={{ background: "#060D1A", border: "1px solid rgba(34,211,238,0.15)" }}>
          <AmeenLogo variant="hospitality" size={80} />
          <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-4 uppercase tracking-wider">04 — AMEEN Hospitality</p>
        </div>

        {/* 5. Light Background */}
        <div className="rounded-2xl p-8 flex flex-col items-center justify-center min-h-56" style={{ background: "#F8FAFC", border: "1px solid rgba(0,0,0,0.08)" }}>
          <AmeenLogo variant="light" size={80} />
          <p className="text-gray-400 text-xs font-['JetBrains_Mono'] mt-4 uppercase tracking-wider">05 — Light Background</p>
        </div>

        {/* 6. Co-branded */}
        <div className="rounded-2xl p-8 flex flex-col items-center justify-center min-h-56" style={{ background: "#060D1A", border: "1px solid rgba(34,211,238,0.15)" }}>
          <AmeenLogo variant="cobranded" size={80} />
          <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-4 uppercase tracking-wider">06 — ROP Co-branded</p>
        </div>
      </div>
    </div>

    {/* Icon sizes */}
    <div>
      <h2 className="text-white font-bold text-lg font-['Inter'] mb-4">
        <i className="ri-zoom-in-line mr-2 text-cyan-400" />Icon Scale
      </h2>
      <div className="rounded-2xl p-6 flex items-end gap-8" style={{ background: "#060D1A", border: "1px solid rgba(34,211,238,0.12)" }}>
        {[128, 96, 64, 48, 32, 24, 16].map((s) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <AmeenShield size={s} />
            <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{s}px</span>
          </div>
        ))}
      </div>
    </div>

    {/* Color variants */}
    <div>
      <h2 className="text-white font-bold text-lg font-['Inter'] mb-4">
        <i className="ri-contrast-2-line mr-2 text-cyan-400" />Color Variants
      </h2>
      <div className="grid grid-cols-4 gap-4">
        {[
          { bg: "#060D1A", label: "Primary Dark",    border: "rgba(34,211,238,0.15)" },
          { bg: "#0A1628", label: "Panel Dark",       border: "rgba(34,211,238,0.12)" },
          { bg: "#0F172A", label: "Slate Dark",       border: "rgba(34,211,238,0.1)" },
          { bg: "#F8FAFC", label: "White / Print",    border: "rgba(0,0,0,0.08)" },
        ].map((v) => (
          <div key={v.label} className="rounded-xl p-6 flex flex-col items-center gap-3" style={{ background: v.bg, border: `1px solid ${v.border}` }}>
            <AmeenShield size={56} light={v.bg === "#F8FAFC"} />
            <p style={{ color: v.bg === "#F8FAFC" ? "#374151" : "#6B7280", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>{v.label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LogoShowcase;
