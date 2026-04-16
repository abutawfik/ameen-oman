import { useNavigate } from "react-router-dom";

const steps = [
  {
    num: "01",
    title: "Register Your Entity",
    desc: "Complete the entity registration form with your organization details, license number, and contact information.",
    icon: "ri-building-line",
    color: "#22D3EE",
    action: "Go to Registration",
    route: "/register",
  },
  {
    num: "02",
    title: "Generate API Key",
    desc: "Create a production or sandbox API key scoped to your entity type and required streams.",
    icon: "ri-key-2-line",
    color: "#4ADE80",
    action: "Manage Keys",
    route: "/dashboard/api-portal/keys",
  },
  {
    num: "03",
    title: "Test in Sandbox",
    desc: "Use the sandbox environment to validate your integration before going live. No real data is submitted.",
    icon: "ri-test-tube-line",
    color: "#FACC15",
    action: "Open Sandbox",
    route: "/dashboard/api-portal/sandbox",
  },
  {
    num: "04",
    title: "Go Live",
    desc: "Switch to your production key and start submitting real events. Monitor via the dashboard.",
    icon: "ri-rocket-line",
    color: "#FB923C",
    action: "View Dashboard",
    route: "/dashboard",
  },
];

const quickLinks = [
  { icon: "ri-book-open-line",       label: "API Reference",       sub: "Full endpoint documentation",    color: "#22D3EE", tab: "docs" },
  { icon: "ri-key-2-line",           label: "API Keys",            sub: "Manage your API keys",           color: "#4ADE80", tab: "keys" },
  { icon: "ri-webhook-line",         label: "Webhooks",            sub: "Configure event callbacks",      color: "#A78BFA", tab: "webhooks" },
  { icon: "ri-test-tube-line",       label: "Sandbox",             sub: "Test your integration",          color: "#FACC15", tab: "sandbox" },
  { icon: "ri-stack-line",           label: "Stream Guides",       sub: "Per-stream integration guides",  color: "#FB923C", tab: "guides" },
  { icon: "ri-bar-chart-2-line",     label: "Usage Analytics",     sub: "Request stats & rate limits",    color: "#F87171", tab: "keys" },
];

const stats = [
  { label: "API Version",     value: "v2.1",    icon: "ri-code-s-slash-line",  color: "#22D3EE" },
  { label: "Uptime (30d)",    value: "99.95%",  icon: "ri-pulse-line",         color: "#4ADE80" },
  { label: "Avg Latency",     value: "42ms",    icon: "ri-speed-line",         color: "#FACC15" },
  { label: "Active Entities", value: "4,891",   icon: "ri-building-line",      color: "#FB923C" },
];

const changelog = [
  { version: "v2.1.0", date: "2025-04-01", type: "feature", note: "Added eSIM provisioning endpoint for mobile operators" },
  { version: "v2.0.5", date: "2025-03-15", type: "fix",     note: "Fixed nationality code validation for ISO 3166-1 alpha-3" },
  { version: "v2.0.4", date: "2025-03-01", type: "feature", note: "Batch upload now supports up to 1,000 events per request" },
  { version: "v2.0.3", date: "2025-02-14", type: "security",note: "Enhanced mTLS certificate validation for financial stream" },
  { version: "v2.0.2", date: "2025-02-01", type: "fix",     note: "Resolved rate limit header inconsistency on 429 responses" },
];

const changeTypeConfig: Record<string, { color: string; bg: string }> = {
  feature:  { color: "#22D3EE", bg: "rgba(34,211,238,0.1)" },
  fix:      { color: "#4ADE80", bg: "rgba(74,222,128,0.1)" },
  security: { color: "#F87171", bg: "rgba(248,113,113,0.1)" },
  breaking: { color: "#FB923C", bg: "rgba(251,146,60,0.1)" },
};

interface Props {
  onTabChange: (tab: string) => void;
}

const PortalHome = ({ onTabChange }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: "rgba(10,22,40,0.9)", border: "1px solid rgba(34,211,238,0.2)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(ellipse at 80% 50%, rgba(34,211,238,0.06) 0%, transparent 60%)",
        }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold font-['JetBrains_Mono']" style={{ background: "rgba(34,211,238,0.1)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}>
                API v2.1
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold font-['JetBrains_Mono']" style={{ background: "rgba(74,222,128,0.1)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.2)" }}>
                ● All Systems Operational
              </span>
            </div>
            <h1 className="text-white text-3xl font-bold font-['Inter'] mb-2">AMEEN Developer Portal</h1>
            <p className="text-gray-400 text-base font-['Inter'] max-w-xl">
              Integrate your entity with the AMEEN Intelligence Platform. Submit events across 13 data streams, manage API keys, configure webhooks, and monitor your integration in real-time.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => onTabChange("docs")}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-all"
                style={{ background: "#22D3EE", color: "#060D1A" }}
              >
                <i className="ri-book-open-line mr-2" />
                Explore API Docs
              </button>
              <button
                onClick={() => onTabChange("sandbox")}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-all"
                style={{ background: "transparent", border: "1px solid rgba(34,211,238,0.4)", color: "#22D3EE" }}
              >
                <i className="ri-test-tube-line mr-2" />
                Try Sandbox
              </button>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 flex-shrink-0">
            {stats.map((s) => (
              <div key={s.label} className="p-4 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", minWidth: "110px" }}>
                <div className="w-8 h-8 flex items-center justify-center rounded-lg mx-auto mb-2" style={{ background: `${s.color}18` }}>
                  <i className={`${s.icon} text-sm`} style={{ color: s.color }} />
                </div>
                <p className="text-white text-lg font-bold font-['JetBrains_Mono']">{s.value}</p>
                <p className="text-gray-600 text-xs font-['Inter']">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Getting Started Steps */}
      <div>
        <h2 className="text-white font-semibold text-base font-['Inter'] mb-4">
          <i className="ri-map-pin-line mr-2 text-cyan-400" />
          Getting Started
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {steps.map((step, idx) => (
            <div key={step.num} className="rounded-xl p-5 relative group cursor-pointer transition-all hover:border-cyan-400/30"
              style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.1)" }}
              onClick={() => step.tab ? onTabChange(step.tab as string) : navigate(step.route)}
            >
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="absolute top-8 -right-2 w-4 h-0.5 z-10" style={{ background: "rgba(34,211,238,0.2)" }} />
              )}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: step.color }}>{step.num}</span>
                <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: `${step.color}15` }}>
                  <i className={`${step.icon} text-sm`} style={{ color: step.color }} />
                </div>
              </div>
              <h3 className="text-white text-sm font-semibold font-['Inter'] mb-2">{step.title}</h3>
              <p className="text-gray-500 text-xs font-['Inter'] leading-relaxed mb-4">{step.desc}</p>
              <button className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap" style={{ color: step.color }}>
                {step.action}
                <i className="ri-arrow-right-line text-xs" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Quick Links */}
        <div className="col-span-2">
          <h2 className="text-white font-semibold text-base font-['Inter'] mb-4">
            <i className="ri-flashlight-line mr-2 text-cyan-400" />
            Quick Access
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onTabChange(link.tab)}
                className="p-4 rounded-xl text-left cursor-pointer transition-all hover:border-cyan-400/20 group"
                style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.08)" }}
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-lg mb-3" style={{ background: `${link.color}15` }}>
                  <i className={`${link.icon} text-base`} style={{ color: link.color }} />
                </div>
                <p className="text-white text-sm font-semibold font-['Inter'] group-hover:text-cyan-400 transition-colors">{link.label}</p>
                <p className="text-gray-600 text-xs font-['Inter'] mt-0.5">{link.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Changelog */}
        <div>
          <h2 className="text-white font-semibold text-base font-['Inter'] mb-4">
            <i className="ri-history-line mr-2 text-cyan-400" />
            Changelog
          </h2>
          <div className="rounded-xl overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.1)" }}>
            {changelog.map((entry, idx) => {
              const tc = changeTypeConfig[entry.type];
              return (
                <div key={entry.version} className="p-3" style={{ borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-xs font-bold font-['JetBrains_Mono']">{entry.version}</span>
                    <span className="px-1.5 py-0.5 rounded text-xs font-['JetBrains_Mono'] capitalize" style={{ background: tc.bg, color: tc.color }}>{entry.type}</span>
                    <span className="text-gray-700 text-xs font-['JetBrains_Mono'] ml-auto">{entry.date}</span>
                  </div>
                  <p className="text-gray-500 text-xs font-['Inter'] leading-relaxed">{entry.note}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Base URL + Auth info */}
      <div className="rounded-xl p-5" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.12)" }}>
        <h2 className="text-white font-semibold text-sm font-['Inter'] mb-4">
          <i className="ri-server-line mr-2 text-cyan-400" />
          Base URLs &amp; Authentication
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Production", url: "https://api.ameen.rop.gov.om/v2", color: "#4ADE80" },
            { label: "Sandbox",    url: "https://sandbox.ameen.rop.gov.om/v2", color: "#FACC15" },
          ].map((env) => (
            <div key={env.label} className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: env.color }} />
                <span className="text-xs font-semibold font-['Inter']" style={{ color: env.color }}>{env.label}</span>
              </div>
              <code className="text-cyan-300 text-xs font-['JetBrains_Mono']">{env.url}</code>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg" style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.1)" }}>
          <p className="text-gray-400 text-xs font-['Inter'] mb-2">All requests require the <code className="text-cyan-400 font-['JetBrains_Mono']">X-API-Key</code> header:</p>
          <code className="text-cyan-300 text-xs font-['JetBrains_Mono'] block">
            X-API-Key: amn_live_HTL_a8f3c2d1e9b4f7a2c5d8e1f4a7b0c3d6
          </code>
        </div>
      </div>
    </div>
  );
};

export default PortalHome;
