const colorPalette = [
  { name: "Cyan — Primary",    hex: "#D6B47E", role: "Interactive elements, highlights, active states, logo mark",  group: "brand" },
  { name: "Navy Black",        hex: "#051428", role: "Primary background, authority, command",                       group: "brand" },
  { name: "Hover Cyan",        hex: "#0EA5E9", role: "Hover states, secondary interactive",                          group: "brand" },
  { name: "Glass Panel",       hex: "rgba(10,37,64,0.8)", role: "Card/panel backgrounds with glassmorphism",         group: "brand" },
  { name: "White",             hex: "#FFFFFF", role: "Primary headings, high-emphasis text",                         group: "text" },
  { name: "Light Gray",        hex: "#D1D5DB", role: "Body text, descriptions",                                      group: "text" },
  { name: "Muted Gray",        hex: "#9CA3AF", role: "Secondary text, captions, metadata",                           group: "text" },
  { name: "Low Risk — Green",  hex: "#4ADE80", role: "Low risk indicators, success states, active status",           group: "semantic" },
  { name: "Medium — Yellow",   hex: "#FACC15", role: "Medium risk, warnings, pending states",                        group: "semantic" },
  { name: "High — Orange",     hex: "#C98A1B", role: "High risk, elevated alerts",                                   group: "semantic" },
  { name: "Critical — Red",    hex: "#C94A5E", role: "Critical risk, errors, rejected states",                       group: "semantic" },
];

const typeScale = [
  { name: "Display",    size: "48px / 3rem",  weight: "800 ExtraBold", usage: "Hero headlines, splash screens",          sample: "Al-Ameen", mono: false },
  { name: "H1",         size: "32px / 2rem",  weight: "700 Bold",      usage: "Page titles, section headers",             sample: "Intelligence Platform", mono: false },
  { name: "H2",         size: "24px / 1.5rem",weight: "600 SemiBold",  usage: "Card titles, panel headers",               sample: "Activity Monitoring", mono: false },
  { name: "H3",         size: "18px / 1.125rem",weight:"600 SemiBold", usage: "Sub-section titles",                       sample: "Stream Management", mono: false },
  { name: "Body",       size: "16px / 1rem",  weight: "400 Regular",   usage: "Paragraphs, descriptions",                 sample: "Trusted custodian safeguarding the nation.", mono: false },
  { name: "Caption",    size: "12px / 0.75rem",weight:"400 Regular",   usage: "Labels, metadata, timestamps",             sample: "Last updated: 2025-04-05 09:41", mono: false },
  { name: "Mono Data",  size: "14px / 0.875rem",weight:"500 Medium",   usage: "Numbers, codes, IDs, API keys",            sample: "AMN-HTL-2025-04891", mono: true },
  { name: "Mono Small", size: "12px / 0.75rem",weight:"400 Regular",   usage: "Timestamps, reference IDs",                sample: "09:41:22 UTC+4", mono: true },
];

const dosDonts = [
  { type: "do",   text: "Use cyan (#D6B47E) as the sole accent color on dark backgrounds" },
  { type: "do",   text: "Maintain minimum 4.5:1 contrast ratio for all body text" },
  { type: "do",   text: "Use Noto Kufi Arabic for all Arabic text — never substitute" },
  { type: "do",   text: "Present bilingual content with English left, Arabic right (RTL)" },
  { type: "do",   text: "Use the shield mark at minimum 24px for digital, 8mm for print" },
  { type: "do",   text: "Apply glassmorphism (rgba(10,37,64,0.8)) for all card surfaces" },
  { type: "dont", text: "Never use blue or purple — these are explicitly prohibited" },
  { type: "dont", text: "Never place the logo on a busy photographic background without overlay" },
  { type: "dont", text: "Never stretch, rotate, or alter the shield proportions" },
  { type: "dont", text: "Never use the logo in colors other than cyan-on-dark or dark-on-white" },
  { type: "dont", text: "Never use drop shadows — they appear dirty and reduce authority" },
  { type: "dont", text: "Never translate tagline — use the approved bilingual versions only" },
];

const voiceExamples = [
  { label: "Authoritative",  good: "Al-Ameen monitors 14 data streams in real-time across the nation.",       bad: "We track lots of stuff happening around the country." },
  { label: "Precise",        good: "Risk score: 87/100 — 3 pattern alerts triggered in the last 24 hours.",   bad: "This person seems pretty risky based on recent activity." },
  { label: "Bilingual-native",good:"الحارس الأمين للوطن — The Nation's Trusted Guardian",                    bad: "Guardian of the Nation (translated from Arabic)" },
  { label: "Technical confidence",good:"VIS RES-A replication lag: 1.2 min — within SLA threshold.",         bad: "The system is a bit slow right now but should be fine." },
];

const BrandGuidelines = () => (
  <div className="space-y-8">
    {/* Brand Philosophy */}
    <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: "rgba(10,37,64,0.9)", border: "1px solid rgba(184,138,60,0.2)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(184,138,60,0.05) 0%, transparent 60%)" }} />
      <div className="relative z-10 grid grid-cols-2 gap-8">
        <div>
          <p className="text-xs text-gold-400 uppercase tracking-widest font-['JetBrains_Mono'] mb-3">Brand Philosophy</p>
          <h2 className="text-white text-2xl font-bold font-['Inter'] mb-4">أمين = The Trustworthy</h2>
          <p className="text-gray-400 text-sm font-['Inter'] leading-relaxed mb-4">
            Al-Ameen is the trusted custodian safeguarding the nation. The name itself — أمين — means trustworthy, faithful, and guardian in Arabic. Every design decision reinforces this: sovereign protection, intelligent insight, and national pride.
          </p>
          <div className="space-y-2">
            {["Sovereign Protection", "Intelligent Insight", "National Pride", "Operational Precision"].map((v) => (
              <div key={v} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm font-['Inter']">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-gold-400 uppercase tracking-widest font-['JetBrains_Mono'] mb-3">Audience</p>
          <div className="space-y-3">
            {[
              { role: "Government Officials",    desc: "Ministers, directors, senior decision-makers requiring strategic intelligence" },
              { role: "Security Decision-Makers",desc: "Police commanders, analysts, field officers requiring operational data" },
              { role: "Entity Operators",        desc: "Hotels, car rentals, telecoms — submitting events via the platform" },
              { role: "System Integrators",      desc: "Technical teams building API integrations" },
            ].map((a) => (
              <div key={a.role} className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(184,138,60,0.08)" }}>
                <p className="text-white text-xs font-semibold font-['Inter']">{a.role}</p>
                <p className="text-gray-500 text-xs font-['Inter'] mt-0.5">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Color Palette */}
    <div>
      <h2 className="text-white font-bold text-lg font-['Inter'] mb-4">
        <i className="ri-palette-line mr-2 text-gold-400" />Color System
      </h2>
      {(["brand", "text", "semantic"] as const).map((group) => (
        <div key={group} className="mb-5">
          <p className="text-gray-500 text-xs uppercase tracking-widest font-['JetBrains_Mono'] mb-3 capitalize">{group} Colors</p>
          <div className="grid grid-cols-4 gap-3">
            {colorPalette.filter((c) => c.group === group).map((color) => {
              const isGlass = color.hex.startsWith("rgba");
              return (
                <div key={color.name} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(184,138,60,0.1)" }}>
                  <div className="h-16 relative" style={{ background: isGlass ? color.hex : color.hex, border: isGlass ? "1px dashed rgba(184,138,60,0.3)" : "none" }}>
                    {isGlass && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gold-400 text-xs font-['JetBrains_Mono'] opacity-60">glass</span>
                      </div>
                    )}
                    {color.hex === "#FFFFFF" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-400 text-xs font-['JetBrains_Mono']">#FFFFFF</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3" style={{ background: "rgba(10,37,64,0.8)" }}>
                    <p className="text-white text-xs font-semibold font-['Inter'] mb-0.5">{color.name}</p>
                    <p className="text-gold-400 text-xs font-['JetBrains_Mono'] mb-1">{color.hex}</p>
                    <p className="text-gray-600 text-xs font-['Inter'] leading-tight">{color.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>

    {/* Typography */}
    <div>
      <h2 className="text-white font-bold text-lg font-['Inter'] mb-4">
        <i className="ri-text mr-2 text-gold-400" />Typography System
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { name: "Inter", role: "English — Primary UI", sample: "Al-Ameen Intelligence Platform", weight: "100–900" },
          { name: "Noto Kufi Arabic", role: "Arabic — Primary UI", sample: "أمين — الحارس الأمين للوطن", weight: "400–700" },
          { name: "JetBrains Mono", role: "Monospace — Data & Code", sample: "AMN-HTL-2025-04891 | 09:41:22", weight: "400–700" },
        ].map((font) => (
          <div key={font.name} className="p-4 rounded-xl" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.1)" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gold-400 text-xs font-semibold font-['JetBrains_Mono']">{font.name}</p>
              <span className="text-gray-600 text-xs font-['Inter']">{font.weight}</span>
            </div>
            <p className="text-gray-500 text-xs font-['Inter'] mb-3">{font.role}</p>
            <p className="text-white text-base" style={{ fontFamily: font.name === "JetBrains Mono" ? "'JetBrains Mono', monospace" : font.name === "Noto Kufi Arabic" ? "'Noto Kufi Arabic', 'Arial', sans-serif" : "'Inter', sans-serif" }}>
              {font.sample}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(184,138,60,0.1)" }}>
        <div className="grid px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-600 font-['Inter']"
          style={{ background: "rgba(184,138,60,0.04)", gridTemplateColumns: "1fr 1.2fr 1.2fr 1.5fr 2fr" }}>
          <span>Scale</span><span>Size</span><span>Weight</span><span>Usage</span><span>Sample</span>
        </div>
        {typeScale.map((t, i) => (
          <div key={t.name} className="grid px-4 py-3 items-center"
            style={{ gridTemplateColumns: "1fr 1.2fr 1.2fr 1.5fr 2fr", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            <span className="text-gold-400 text-xs font-semibold font-['JetBrains_Mono']">{t.name}</span>
            <span className="text-gray-400 text-xs font-['JetBrains_Mono']">{t.size}</span>
            <span className="text-gray-400 text-xs font-['Inter']">{t.weight}</span>
            <span className="text-gray-500 text-xs font-['Inter']">{t.usage}</span>
            <span className="text-white text-sm truncate" style={{ fontFamily: t.mono ? "'JetBrains Mono', monospace" : "'Inter', sans-serif" }}>{t.sample}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Voice & Tone */}
    <div>
      <h2 className="text-white font-bold text-lg font-['Inter'] mb-4">
        <i className="ri-megaphone-line mr-2 text-gold-400" />Voice &amp; Tone
      </h2>
      <div className="space-y-3">
        {voiceExamples.map((ex) => (
          <div key={ex.label} className="rounded-xl p-4" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.1)" }}>
            <p className="text-gold-400 text-xs font-semibold font-['JetBrains_Mono'] uppercase tracking-wider mb-3">{ex.label}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)" }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <i className="ri-check-line text-green-400 text-xs" />
                  <span className="text-green-400 text-xs font-semibold font-['Inter']">Do</span>
                </div>
                <p className="text-gray-300 text-sm font-['Inter']">{ex.good}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: "rgba(201,74,94,0.06)", border: "1px solid rgba(201,74,94,0.2)" }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <i className="ri-close-line text-red-400 text-xs" />
                  <span className="text-red-400 text-xs font-semibold font-['Inter']">Don&apos;t</span>
                </div>
                <p className="text-gray-500 text-sm font-['Inter'] line-through">{ex.bad}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Do's & Don'ts */}
    <div>
      <h2 className="text-white font-bold text-lg font-['Inter'] mb-4">
        <i className="ri-shield-check-line mr-2 text-gold-400" />Logo Usage Rules
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-5" style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.15)" }}>
          <p className="text-green-400 text-sm font-semibold font-['Inter'] mb-3">
            <i className="ri-check-double-line mr-2" />Do
          </p>
          <div className="space-y-2">
            {dosDonts.filter((d) => d.type === "do").map((d, i) => (
              <div key={i} className="flex items-start gap-2">
                <i className="ri-check-line text-green-400 text-xs mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-xs font-['Inter']">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-5" style={{ background: "rgba(201,74,94,0.04)", border: "1px solid rgba(201,74,94,0.15)" }}>
          <p className="text-red-400 text-sm font-semibold font-['Inter'] mb-3">
            <i className="ri-close-circle-line mr-2" />Don&apos;t
          </p>
          <div className="space-y-2">
            {dosDonts.filter((d) => d.type === "dont").map((d, i) => (
              <div key={i} className="flex items-start gap-2">
                <i className="ri-close-line text-red-400 text-xs mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-xs font-['Inter']">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default BrandGuidelines;
