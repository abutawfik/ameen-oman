import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import SystemConfig from "./components/SystemConfig";
import StreamManagement from "./components/StreamManagement";
import ValidationRulesEngine from "./components/ValidationRulesEngine";
import DataManagement from "./components/DataManagement";
import AuditTrail from "./components/AuditTrail";
import SystemHealth from "./components/SystemHealth";
import PredictiveAdmin from "./components/PredictiveAdmin";

const tabs = [
  { id: "health",     label: "System Health",       labelAr: "صحة النظام",          icon: "ri-heart-pulse-line" },
  { id: "config",     label: "System Config",        labelAr: "إعدادات النظام",       icon: "ri-settings-3-line" },
  { id: "streams",    label: "Stream Management",    labelAr: "إدارة التدفقات",       icon: "ri-stack-line" },
  { id: "validation", label: "Validation Rules",     labelAr: "قواعد التحقق",         icon: "ri-shield-check-line" },
  { id: "data",       label: "Data Management",      labelAr: "إدارة البيانات",       icon: "ri-database-2-line" },
  { id: "audit",      label: "Audit Trail",          labelAr: "سجل التدقيق",          icon: "ri-file-list-3-line" },
  { id: "predictive", label: "Predictive Admin",     labelAr: "إدارة التحليلات",      icon: "ri-line-chart-line" },
];

const SystemAdminPage = () => {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeTab, setActiveTab] = useState("health");

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="flex flex-col h-full" style={{ background: "#0B1220", fontFamily: "'Inter', sans-serif" }}>
      {/* Background grid texture */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(181,142,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        zIndex: 0,
      }} />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Page Header */}
        <div className="px-6 pt-5 pb-0 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
                <i className="ri-shield-keyhole-line text-gold-400 text-lg" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold font-['Inter']">
                  {isAr ? "إدارة النظام" : "System Administration"}
                </h1>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono']">
                  {isAr ? "AMEEN Intelligence Platform — وصول المسؤول" : "AMEEN Intelligence Platform — Admin Access"}
                </p>
              </div>
            </div>
            {/* Status badges */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-['JetBrains_Mono']">All Systems Operational</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(181,142,60,0.06)", border: "1px solid rgba(181,142,60,0.15)" }}>
                <i className="ri-shield-user-line text-gold-400 text-xs" />
                <span className="text-gold-400 text-xs font-['JetBrains_Mono']">ADMIN</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                <span className="text-red-400 text-xs font-['JetBrains_Mono'] font-semibold">TOP SECRET</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap cursor-pointer transition-all flex-shrink-0"
                style={{
                  background: activeTab === tab.id ? "rgba(20,29,46,0.9)" : "transparent",
                  color: activeTab === tab.id ? "#D4A84B" : "#6B7280",
                  borderTop: activeTab === tab.id ? "1px solid rgba(181,142,60,0.3)" : "1px solid transparent",
                  borderLeft: activeTab === tab.id ? "1px solid rgba(181,142,60,0.15)" : "1px solid transparent",
                  borderRight: activeTab === tab.id ? "1px solid rgba(181,142,60,0.15)" : "1px solid transparent",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <i className={`${tab.icon} text-sm`} />
                {isAr ? tab.labelAr : tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(181,142,60,0.2) transparent" }}>
          {/* Tab header */}
          <div className="flex items-center gap-2 mb-5 pb-4" style={{ borderBottom: "1px solid rgba(181,142,60,0.08)" }}>
            <i className={`${currentTab.icon} text-gold-400`} />
            <h2 className="text-white font-semibold font-['Inter']">{isAr ? currentTab.labelAr : currentTab.label}</h2>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-gray-600 text-xs font-['JetBrains_Mono']">Live</span>
            </div>
          </div>

          {activeTab === "health"     && <SystemHealth />}
          {activeTab === "config"     && <SystemConfig />}
          {activeTab === "streams"    && <StreamManagement />}
          {activeTab === "validation" && <ValidationRulesEngine />}
          {activeTab === "data"       && <DataManagement />}
          {activeTab === "audit"      && <AuditTrail />}
          {activeTab === "predictive" && <PredictiveAdmin />}
        </div>
      </div>
    </div>
  );
};

export default SystemAdminPage;
