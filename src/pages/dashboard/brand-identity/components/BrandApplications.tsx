import AmeenLogo, { AmeenShield } from "./AmeenLogo";

const cyan = "#22D3EE";

// ── Login Screen Mockup ──────────────────────────────────────────────────────
const LoginMockup = () => (
  <div className="rounded-xl overflow-hidden" style={{ background: "#060D1A", border: "1px solid rgba(34,211,238,0.2)", aspectRatio: "16/10" }}>
    <div className="h-full flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.025) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-xs">
        <AmeenLogo variant="full" size={56} />
        <div className="w-full space-y-2 mt-2">
          <div className="h-8 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,211,238,0.2)" }} />
          <div className="h-8 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,211,238,0.2)" }} />
          <div className="h-8 rounded-lg" style={{ background: cyan }} />
        </div>
        <p className="text-gray-700 text-xs font-['JetBrains_Mono']">CLASSIFIED — AUTHORIZED ACCESS ONLY</p>
      </div>
    </div>
  </div>
);

// ── Letterhead Mockup ────────────────────────────────────────────────────────
const LetterheadMockup = () => (
  <div className="rounded-xl overflow-hidden" style={{ background: "#F8FAFC", border: "1px solid rgba(0,0,0,0.08)", aspectRatio: "16/10" }}>
    <div className="h-full flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3" style={{ background: "#060D1A", borderBottom: `3px solid ${cyan}` }}>
        <AmeenLogo variant="compact" size={40} />
        <div className="text-right">
          <p style={{ color: "#9CA3AF", fontSize: "9px", fontFamily: "'JetBrains_Mono', monospace" }}>ROYAL OMAN POLICE</p>
          <p style={{ color: cyan, fontSize: "9px", fontFamily: "'JetBrains_Mono', monospace" }}>AMEEN INTELLIGENCE PLATFORM</p>
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 px-6 py-4">
        <div className="h-2 rounded w-1/3 mb-3" style={{ background: "#E5E7EB" }} />
        <div className="space-y-1.5">
          {[1, 0.9, 0.95, 0.7, 0.85, 0.6].map((w, i) => (
            <div key={i} className="h-1.5 rounded" style={{ background: "#E5E7EB", width: `${w * 100}%` }} />
          ))}
        </div>
        <div className="mt-4 h-1.5 rounded w-1/4" style={{ background: "#E5E7EB" }} />
      </div>
      {/* Footer */}
      <div className="px-6 py-2 flex items-center justify-between" style={{ borderTop: "1px solid #E5E7EB" }}>
        <p style={{ color: "#9CA3AF", fontSize: "8px", fontFamily: "'Inter', sans-serif" }}>CONFIDENTIAL — FOR OFFICIAL USE ONLY</p>
        <p style={{ color: "#9CA3AF", fontSize: "8px", fontFamily: "'JetBrains_Mono', monospace" }}>ameen.ameen.gov</p>
      </div>
    </div>
  </div>
);

// ── Email Signature Mockup ───────────────────────────────────────────────────
const EmailSignatureMockup = () => (
  <div className="rounded-xl overflow-hidden" style={{ background: "#F8FAFC", border: "1px solid rgba(0,0,0,0.08)", aspectRatio: "16/10" }}>
    <div className="h-full flex flex-col justify-center px-6 py-4">
      <div className="flex items-center gap-4 pb-3 mb-3" style={{ borderBottom: `2px solid ${cyan}` }}>
        <AmeenShield size={40} light />
        <div>
          <p style={{ color: "#060D1A", fontSize: "13px", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>Ahmed Al-Amri</p>
          <p style={{ color: "#374151", fontSize: "10px", fontFamily: "'Inter', sans-serif" }}>Senior Intelligence Analyst</p>
          <p style={{ color: "#6B7280", fontSize: "10px", fontFamily: "'Inter', sans-serif" }}>National Police — AMEEN Platform</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: "ri-phone-line", val: "+968 2456 7890" },
          { icon: "ri-mail-line",  val: "a.alamri@ameen.gov" },
          { icon: "ri-global-line",val: "ameen.ameen.gov" },
          { icon: "ri-map-pin-line",val: "Muscat, Oman" },
        ].map((c) => (
          <div key={c.val} className="flex items-center gap-1.5">
            <i className={`${c.icon} text-xs`} style={{ color: cyan }} />
            <span style={{ color: "#6B7280", fontSize: "9px", fontFamily: "'Inter', sans-serif" }}>{c.val}</span>
          </div>
        ))}
      </div>
      <p style={{ color: "#9CA3AF", fontSize: "8px", fontFamily: "'Inter', sans-serif", marginTop: "8px" }}>
        CONFIDENTIAL: This email and any attachments are for the exclusive use of the intended recipient.
      </p>
    </div>
  </div>
);

// ── App Splash Screen ────────────────────────────────────────────────────────
const SplashMockup = () => (
  <div className="rounded-xl overflow-hidden" style={{ background: "#060D1A", border: "1px solid rgba(34,211,238,0.2)", aspectRatio: "9/16", maxHeight: "280px" }}>
    <div className="h-full flex flex-col items-center justify-center gap-4 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse at 50% 40%, rgba(34,211,238,0.08) 0%, transparent 60%)" }} />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <AmeenShield size={64} />
        <div className="text-center">
          <p className="font-black tracking-widest uppercase" style={{ color: cyan, fontSize: "18px", fontFamily: "'Inter', sans-serif", letterSpacing: "0.2em" }}>AMEEN</p>
          <p style={{ color: "#9CA3AF", fontSize: "9px", fontFamily: "'Inter', sans-serif", letterSpacing: "0.1em", marginTop: "2px" }}>FIELD OFFICER</p>
        </div>
        <div className="w-16 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${cyan}, transparent)` }} />
        <p style={{ color: "#6B7280", fontSize: "8px", fontFamily: "'JetBrains_Mono', monospace" }}>v4.2.1 — CLASSIFIED</p>
      </div>
    </div>
  </div>
);

// ── ID Badge Mockup ──────────────────────────────────────────────────────────
const IDBadgeMockup = () => (
  <div className="rounded-xl overflow-hidden" style={{ background: "#060D1A", border: "1px solid rgba(34,211,238,0.25)", aspectRatio: "5/8", maxHeight: "280px" }}>
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="px-3 py-2 flex items-center justify-between" style={{ background: "rgba(34,211,238,0.08)", borderBottom: `1px solid rgba(34,211,238,0.2)` }}>
        <AmeenShield size={22} />
        <p style={{ color: cyan, fontSize: "7px", fontFamily: "'JetBrains_Mono', monospace", letterSpacing: "0.1em" }}>AMEEN</p>
      </div>
      {/* Photo area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2 px-3 py-2">
        <div className="rounded-lg" style={{ width: 48, height: 56, background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)" }} />
        <div className="text-center">
          <p style={{ color: "#FFFFFF", fontSize: "9px", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>Ahmed Al-Amri</p>
          <p style={{ color: cyan, fontSize: "7px", fontFamily: "'Inter', sans-serif" }}>Senior Analyst</p>
          <p style={{ color: "#6B7280", fontSize: "7px", fontFamily: "'JetBrains_Mono', monospace", marginTop: "2px" }}>ID: AMN-2025-0441</p>
        </div>
        {/* Barcode placeholder */}
        <div className="flex gap-0.5 mt-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ width: 1.5, height: 12, background: i % 3 === 0 ? cyan : "rgba(34,211,238,0.3)" }} />
          ))}
        </div>
      </div>
      {/* Bottom */}
      <div className="px-3 py-1.5 text-center" style={{ background: "rgba(34,211,238,0.05)", borderTop: "1px solid rgba(34,211,238,0.1)" }}>
        <p style={{ color: "#F87171", fontSize: "6px", fontFamily: "'JetBrains_Mono', monospace", letterSpacing: "0.05em" }}>CLASSIFIED — DO NOT DUPLICATE</p>
      </div>
    </div>
  </div>
);

// ── Vehicle Decal Mockup ─────────────────────────────────────────────────────
const VehicleDecalMockup = () => (
  <div className="rounded-xl overflow-hidden flex items-center justify-center" style={{ background: "#060D1A", border: "1px solid rgba(34,211,238,0.2)", aspectRatio: "16/6" }}>
    <div className="flex items-center gap-6 px-8">
      <AmeenShield size={52} />
      <div>
        <p className="font-black tracking-widest uppercase" style={{ color: cyan, fontSize: "22px", fontFamily: "'Inter', sans-serif", letterSpacing: "0.25em" }}>AMEEN</p>
        <p style={{ color: "#9CA3AF", fontSize: "9px", fontFamily: "'Inter', sans-serif", letterSpacing: "0.15em" }}>ROYAL OMAN POLICE — INTELLIGENCE UNIT</p>
      </div>
      <div style={{ width: 1, height: 40, background: "rgba(34,211,238,0.2)" }} />
      <p style={{ color: "#6B7280", fontSize: "11px", fontFamily: "'Noto Kufi Arabic', 'Arial', sans-serif" }}>الحارس الأمين للوطن</p>
    </div>
  </div>
);

// ── Presentation Slide ───────────────────────────────────────────────────────
const PresentationSlideMockup = () => (
  <div className="rounded-xl overflow-hidden" style={{ background: "#060D1A", border: "1px solid rgba(34,211,238,0.2)", aspectRatio: "16/9" }}>
    <div className="h-full flex flex-col relative">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.02) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 relative z-10" style={{ borderBottom: "1px solid rgba(34,211,238,0.1)" }}>
        <AmeenLogo variant="compact" size={36} />
        <p style={{ color: "#6B7280", fontSize: "9px", fontFamily: "'JetBrains_Mono', monospace" }}>CONFIDENTIAL — FOR OFFICIAL USE ONLY</p>
      </div>
      {/* Content */}
      <div className="flex-1 flex items-center px-8 relative z-10">
        <div>
          <p style={{ color: cyan, fontSize: "10px", fontFamily: "'JetBrains_Mono', monospace", letterSpacing: "0.15em", marginBottom: "6px" }}>AMEEN INTELLIGENCE PLATFORM</p>
          <p style={{ color: "#FFFFFF", fontSize: "20px", fontWeight: 700, fontFamily: "'Inter', sans-serif", lineHeight: 1.2 }}>National Activity Monitoring<br />for Events &amp; Entities</p>
          <p style={{ color: "#9CA3AF", fontSize: "10px", fontFamily: "'Inter', sans-serif", marginTop: "8px" }}>Oman — National Police</p>
        </div>
      </div>
      {/* Bottom bar */}
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${cyan}, rgba(34,211,238,0.2))` }} />
    </div>
  </div>
);

// ── Brand Guidelines Cover ───────────────────────────────────────────────────
const GuidelinesCoverMockup = () => (
  <div className="rounded-xl overflow-hidden" style={{ background: "#060D1A", border: "1px solid rgba(34,211,238,0.2)", aspectRatio: "3/4", maxHeight: "280px" }}>
    <div className="h-full flex flex-col items-center justify-between p-5 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse at 50% 60%, rgba(34,211,238,0.06) 0%, transparent 65%)" }} />
      <div className="relative z-10 w-full flex justify-end">
        <p style={{ color: "#6B7280", fontSize: "8px", fontFamily: "'JetBrains_Mono', monospace" }}>2025 EDITION</p>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-3">
        <AmeenShield size={60} />
        <div className="text-center">
          <p className="font-black tracking-widest uppercase" style={{ color: cyan, fontSize: "16px", fontFamily: "'Inter', sans-serif", letterSpacing: "0.2em" }}>AMEEN</p>
          <p style={{ color: "#9CA3AF", fontSize: "8px", fontFamily: "'Inter', sans-serif", letterSpacing: "0.12em", marginTop: "2px" }}>BRAND IDENTITY GUIDELINES</p>
        </div>
      </div>
      <div className="relative z-10 text-center">
        <div className="w-12 h-0.5 mx-auto mb-2 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${cyan}, transparent)` }} />
        <p style={{ color: "#6B7280", fontSize: "7px", fontFamily: "'Inter', sans-serif" }}>ROYAL OMAN POLICE — CLASSIFIED</p>
      </div>
    </div>
  </div>
);

const applications = [
  { label: "Login Screen",          component: <LoginMockup /> },
  { label: "Official Letterhead",   component: <LetterheadMockup /> },
  { label: "Email Signature",       component: <EmailSignatureMockup /> },
  { label: "App Splash Screen",     component: <SplashMockup /> },
  { label: "ID Badge",              component: <IDBadgeMockup /> },
  { label: "Vehicle Decal",         component: <VehicleDecalMockup /> },
  { label: "Presentation Slide",    component: <PresentationSlideMockup /> },
  { label: "Brand Guidelines Cover",component: <GuidelinesCoverMockup /> },
];

const BrandApplications = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-white font-bold text-lg font-['Inter'] mb-2">
        <i className="ri-layout-grid-line mr-2 text-cyan-400" />Brand Applications
      </h2>
      <p className="text-gray-500 text-sm font-['Inter'] mb-5">How the AMEEN brand appears across all touchpoints — digital, print, and physical.</p>
      <div className="grid grid-cols-2 gap-5">
        {applications.map((app) => (
          <div key={app.label}>
            {app.component}
            <p className="text-gray-500 text-xs font-['JetBrains_Mono'] mt-2 uppercase tracking-wider">{app.label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default BrandApplications;
