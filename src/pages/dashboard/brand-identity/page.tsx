import { useState } from "react";
import DashboardSidebar from "@/pages/dashboard/components/DashboardSidebar";
import DashboardTitleBar from "@/pages/dashboard/components/DashboardTitleBar";
import LogoShowcase from "./components/LogoShowcase";
import BrandGuidelines from "./components/BrandGuidelines";
import BrandApplications from "./components/BrandApplications";
import AmeenLogo, { AmeenShield } from "./components/AmeenLogo";

const tabs = [
  { id: "logo",         label: "Logo System",       icon: "ri-shield-star-line" },
  { id: "guidelines",   label: "Brand Guidelines",  icon: "ri-book-open-line" },
  { id: "applications", label: "Applications",      icon: "ri-layout-grid-line" },
];

const BrandIdentityPage = () => {
  const [activeNav, setActiveNav] = useState("brand-identity");
  const [isAr, setIsAr] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("logo");

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#060D1A", fontFamily: "'Inter', sans-serif" }}>
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(34,211,238,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.025) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        zIndex: 0,
      }} />

      <DashboardSidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        entityType="hotel"
        isAr={isAr}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <DashboardTitleBar
          entityType="hotel"
          isAr={isAr}
          onToggleLang={() => setIsAr(!isAr)}
        />

        {/* Page Header — full-width hero */}
        <div className="flex-shrink-0 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #060D1A 0%, #0A1628 50%, #060D1A 100%)", borderBottom: "1px solid rgba(34,211,238,0.12)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse at 70% 50%, rgba(34,211,238,0.07) 0%, transparent 55%)" }} />
          <div className="relative z-10 px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <AmeenShield size={56} />
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-white text-2xl font-black font-['Inter'] tracking-wide">AMEEN</h1>
                  <span className="text-2xl font-bold" style={{ color: "#22D3EE", fontFamily: "'Noto Kufi Arabic', 'Arial', sans-serif" }}>أمين</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold font-['JetBrains_Mono']" style={{ background: "rgba(34,211,238,0.1)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}>
                    Brand Identity
                  </span>
                </div>
                <p className="text-gray-400 text-sm font-['Inter']">Activity Monitoring for Events &amp; Entities Nationally</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-gray-500 text-xs font-['Inter'] italic">"The Nation's Trusted Guardian"</span>
                  <span className="text-gray-600 text-xs">·</span>
                  <span className="text-gray-500 text-xs" style={{ fontFamily: "'Noto Kufi Arabic', 'Arial', sans-serif" }}>"الحارس الأمين للوطن"</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-gray-600 text-xs font-['JetBrains_Mono']">Operated by</p>
                <p className="text-white text-sm font-semibold font-['Inter']">Royal Oman Police</p>
                <p className="text-gray-500 text-xs font-['Inter']">Sultanate of Oman</p>
              </div>
              <div className="w-px h-10" style={{ background: "rgba(34,211,238,0.2)" }} />
              <div className="px-3 py-1.5 rounded-lg" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">CLASSIFIED</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap cursor-pointer transition-all flex-shrink-0"
                style={{
                  background: activeTab === tab.id ? "rgba(10,22,40,0.9)" : "transparent",
                  color: activeTab === tab.id ? "#22D3EE" : "#6B7280",
                  borderTop: activeTab === tab.id ? "1px solid rgba(34,211,238,0.3)" : "1px solid transparent",
                  borderLeft: activeTab === tab.id ? "1px solid rgba(34,211,238,0.15)" : "1px solid transparent",
                  borderRight: activeTab === tab.id ? "1px solid rgba(34,211,238,0.15)" : "1px solid transparent",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <i className={`${tab.icon} text-sm`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(34,211,238,0.2) transparent" }}>
          {/* Tab header */}
          <div className="flex items-center gap-2 mb-6 pb-4" style={{ borderBottom: "1px solid rgba(34,211,238,0.08)" }}>
            <i className={`${currentTab.icon} text-cyan-400`} />
            <h2 className="text-white font-semibold font-['Inter']">{currentTab.label}</h2>
            <div className="ml-auto flex items-center gap-3">
              {/* Sub-brand pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.15)" }}>
                <span className="text-cyan-400 text-xs font-['JetBrains_Mono']">Sub-brand:</span>
                <span className="text-white text-xs font-semibold font-['Inter']">AMEEN Hospitality</span>
                <span className="text-cyan-400 text-xs" style={{ fontFamily: "'Noto Kufi Arabic', 'Arial', sans-serif" }}>أمين للضيافة</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-gray-600 text-xs font-['JetBrains_Mono']">v2025.1</span>
              </div>
            </div>
          </div>

          {activeTab === "logo"         && <LogoShowcase />}
          {activeTab === "guidelines"   && <BrandGuidelines />}
          {activeTab === "applications" && <BrandApplications />}
        </div>
      </div>
    </div>
  );
};

export default BrandIdentityPage;
