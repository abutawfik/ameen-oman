import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import IocFeed from "./components/IocFeed";
import DarkWebMonitor from "./components/DarkWebMonitor";
import ThreatActors from "./components/ThreatActors";
import { iocEntries, feedSources } from "@/mocks/threatIntelData";

type Tab = "ioc" | "darkweb" | "actors";

const ThreatIntelPage = () => {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeTab, setActiveTab] = useState<Tab>("ioc");

  const tabs: { key: Tab; label: string; icon: string; badge?: string }[] = [
    { key: "ioc",     label: "IOC Feed",          icon: "ri-database-line",    badge: iocEntries.filter(i => i.status === "active").length.toString() },
    { key: "darkweb", label: "Dark Web Monitor",  icon: "ri-ghost-line",       badge: "6" },
    { key: "actors",  label: "Threat Actors",     icon: "ri-spy-line",         badge: "4" },
  ];

  const criticalCount = iocEntries.filter(i => i.severity === "critical" && i.status === "active").length;
  const onlineSources = feedSources.filter(s => s.status === "online").length;

  return (
    <div className="flex flex-col h-full" style={{ background: "#051428" }}>
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ti-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C94A5E" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ti-grid)" />
        </svg>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Page header */}
        <div className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0" style={{ borderColor: "rgba(201,74,94,0.15)", background: "rgba(10,37,64,0.6)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(201,74,94,0.1)", border: "1px solid rgba(201,74,94,0.3)" }}>
              <i className="ri-bug-line text-red-400 text-sm" />
            </div>
            <div>
              <h1 className="text-white text-sm font-bold font-['Inter']">Threat Intelligence Feed</h1>
              <p className="text-gray-500 text-xs font-['JetBrains_Mono']">Real-time IOC tracking, dark web monitoring &amp; threat actor profiling</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {criticalCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg animate-pulse" style={{ background: "rgba(201,74,94,0.1)", border: "1px solid rgba(201,74,94,0.3)" }}>
                <i className="ri-alarm-warning-line text-red-400 text-xs" />
                <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">{criticalCount} CRITICAL ACTIVE</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-['JetBrains_Mono']">{onlineSources}/{feedSources.length} Feeds Online</span>
            </div>
          </div>
        </div>

        {/* KPI bar */}
        <div className="grid grid-cols-5 gap-0 border-b flex-shrink-0" style={{ borderColor: "rgba(201,74,94,0.08)" }}>
          {[
            { label: "Total IOCs",        value: iocEntries.length.toString(),                                                icon: "ri-database-line",       color: "#D6B47E" },
            { label: "Critical Active",   value: criticalCount.toString(),                                                    icon: "ri-alarm-warning-line",  color: "#C94A5E" },
            { label: "Dark Web Mentions", value: "6",                                                                         icon: "ri-ghost-line",          color: "#A78BFA" },
            { label: "Threat Actors",     value: "4",                                                                         icon: "ri-spy-line",            color: "#C98A1B" },
            { label: "Feed Sources",      value: `${onlineSources}/${feedSources.length}`,                                    icon: "ri-rss-line",            color: "#4ADE80" },
          ].map((kpi, i) => (
            <div key={kpi.label} className="flex items-center gap-3 px-5 py-3" style={{ borderRight: i < 4 ? "1px solid rgba(201,74,94,0.08)" : "none" }}>
              <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${kpi.color}15` }}>
                <i className={`${kpi.icon} text-sm`} style={{ color: kpi.color }} />
              </div>
              <div>
                <p className="text-white text-lg font-bold font-['JetBrains_Mono']">{kpi.value}</p>
                <p className="text-gray-600 text-[10px] font-['Inter']">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 py-3 border-b flex-shrink-0" style={{ borderColor: "rgba(201,74,94,0.08)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-['Inter'] cursor-pointer transition-all whitespace-nowrap"
              style={{
                background: activeTab === tab.key ? "rgba(201,74,94,0.1)" : "transparent",
                color: activeTab === tab.key ? "#C94A5E" : "#6B7280",
                border: activeTab === tab.key ? "1px solid rgba(201,74,94,0.25)" : "1px solid transparent",
              }}
            >
              <i className={`${tab.icon} text-sm`} />
              {tab.label}
              {tab.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-['JetBrains_Mono']" style={{ background: activeTab === tab.key ? "rgba(201,74,94,0.2)" : "rgba(255,255,255,0.08)", color: activeTab === tab.key ? "#C94A5E" : "#6B7280" }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(201,74,94,0.2) transparent" }}>
          {activeTab === "ioc"     && <IocFeed isAr={isAr} />}
          {activeTab === "darkweb" && <DarkWebMonitor isAr={isAr} />}
          {activeTab === "actors"  && <ThreatActors isAr={isAr} />}
          <div className="h-6" />
        </div>
      </div>
    </div>
  );
};

export default ThreatIntelPage;
