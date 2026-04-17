import { useState } from "react";
import PortalHome from "./components/PortalHome";
import ApiKeyManager from "./components/ApiKeyManager";
import InteractiveDocs from "./components/InteractiveDocs";
import WebhooksAndSandbox from "./components/WebhooksAndSandbox";

const tabs = [
  { id: "home",     label: "Overview",       icon: "ri-home-5-line",        badge: null },
  { id: "docs",     label: "API Reference",  icon: "ri-book-open-line",     badge: null },
  { id: "keys",     label: "API Keys",       icon: "ri-key-2-line",         badge: "6" },
  { id: "webhooks", label: "Webhooks",       icon: "ri-webhook-line",       badge: "4" },
  { id: "sandbox",  label: "Sandbox",        icon: "ri-test-tube-line",     badge: null },
  { id: "guides",   label: "Stream Guides",  icon: "ri-book-2-line",        badge: null },
];

// Map tab IDs to WebhooksAndSandbox section
const webhookSectionMap: Record<string, "webhooks" | "sandbox" | "guides"> = {
  webhooks: "webhooks",
  sandbox:  "sandbox",
  guides:   "guides",
};

const ApiPortalPage = () => {
  const [activeTab, setActiveTab] = useState("home");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  // Determine which section to show in WebhooksAndSandbox
  const wbsSection = webhookSectionMap[activeTab];
  const showWbs = ["webhooks", "sandbox", "guides"].includes(activeTab);

  return (
    <div className="flex flex-col h-full" style={{ background: "#051428", fontFamily: "'Inter', sans-serif" }}>
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(184,138,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.025) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        zIndex: 0,
      }} />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Page Header */}
        <div className="px-6 pt-5 pb-0 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
                <i className="ri-code-s-slash-line text-gold-400 text-lg" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold font-['Inter']">Developer Portal</h1>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono']">Al-Ameen API v2.1 — Integration Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-['JetBrains_Mono']">API Operational</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg" style={{ background: "rgba(184,138,60,0.06)", border: "1px solid rgba(184,138,60,0.15)" }}>
                <span className="text-gold-400 text-xs font-['JetBrains_Mono']">v2.1.0</span>
              </div>
              <a
                href="https://api.ameen.ameen.gov/v2/openapi.json"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
                style={{ background: "transparent", border: "1px solid rgba(184,138,60,0.3)", color: "#D6B47E" }}
              >
                <i className="ri-download-line" />
                OpenAPI Spec
              </a>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap cursor-pointer transition-all flex-shrink-0 relative"
                style={{
                  background: activeTab === tab.id ? "rgba(10,37,64,0.9)" : "transparent",
                  color: activeTab === tab.id ? "#D6B47E" : "#6B7280",
                  borderTop: activeTab === tab.id ? "1px solid rgba(184,138,60,0.3)" : "1px solid transparent",
                  borderLeft: activeTab === tab.id ? "1px solid rgba(184,138,60,0.15)" : "1px solid transparent",
                  borderRight: activeTab === tab.id ? "1px solid rgba(184,138,60,0.15)" : "1px solid transparent",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <i className={`${tab.icon} text-sm`} />
                {tab.label}
                {tab.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                    style={{ background: "rgba(184,138,60,0.15)", color: "#D6B47E", fontSize: "10px" }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(184,138,60,0.2) transparent" }}>
          {/* Tab header */}
          <div className="flex items-center gap-2 mb-5 pb-4" style={{ borderBottom: "1px solid rgba(184,138,60,0.08)" }}>
            <i className={`${currentTab.icon} text-gold-400`} />
            <h2 className="text-white font-semibold font-['Inter']">{currentTab.label}</h2>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-gray-600 text-xs font-['JetBrains_Mono']">Live</span>
            </div>
          </div>

          {activeTab === "home" && <PortalHome onTabChange={handleTabChange} />}
          {activeTab === "docs" && <InteractiveDocs />}
          {activeTab === "keys" && <ApiKeyManager />}
          {showWbs && (
            <WebhooksAndSandbox key={wbsSection} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiPortalPage;
