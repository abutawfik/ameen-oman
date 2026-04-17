import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import CaseList from "./components/CaseList";
import CaseDetail from "./components/CaseDetail";
import { cases } from "@/mocks/caseManagementData";

const CaseManagementPage = () => {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(cases[0].id);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || null;

  const activeCount = cases.filter((c) => c.status === "active").length;
  const escalatedCount = cases.filter((c) => c.status === "escalated").length;
  const criticalCount = cases.filter((c) => c.priority === "critical").length;

  return (
    <div className="flex flex-col h-full" style={{ background: "#051428" }}>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cm-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#A78BFA" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cm-grid)" />
        </svg>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0" style={{ borderColor: "rgba(167,139,250,0.15)", background: "rgba(10,37,64,0.6)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)" }}>
              <i className="ri-folder-shield-2-line text-purple-400 text-sm" />
            </div>
            <div>
              <h1 className="text-white text-sm font-bold font-['Inter']">Case Management</h1>
              <p className="text-gray-500 text-xs font-['JetBrains_Mono']">Multi-subject investigations with timeline reconstruction &amp; evidence management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {escalatedCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg animate-pulse" style={{ background: "rgba(201,74,94,0.1)", border: "1px solid rgba(201,74,94,0.3)" }}>
                <i className="ri-arrow-up-circle-line text-red-400 text-xs" />
                <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">{escalatedCount} ESCALATED</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)" }}>
              <i className="ri-folder-open-line text-purple-400 text-xs" />
              <span className="text-purple-400 text-xs font-['JetBrains_Mono']">{activeCount} Active Cases</span>
            </div>
          </div>
        </div>

        {/* KPI bar */}
        <div className="grid grid-cols-5 gap-0 border-b flex-shrink-0" style={{ borderColor: "rgba(167,139,250,0.08)" }}>
          {[
            { label: "Total Cases",       value: cases.length.toString(),                                          icon: "ri-folder-line",           color: "#A78BFA" },
            { label: "Active",            value: activeCount.toString(),                                           icon: "ri-play-circle-line",      color: "#D6B47E" },
            { label: "Escalated",         value: escalatedCount.toString(),                                        icon: "ri-arrow-up-circle-line",  color: "#C94A5E" },
            { label: "Critical Priority", value: criticalCount.toString(),                                         icon: "ri-alarm-warning-line",    color: "#C98A1B" },
            { label: "Total Subjects",    value: cases.reduce((s, c) => s + c.subjects.length, 0).toString(),     icon: "ri-user-line",             color: "#4ADE80" },
          ].map((kpi, i) => (
            <div key={kpi.label} className="flex items-center gap-3 px-5 py-3" style={{ borderRight: i < 4 ? "1px solid rgba(167,139,250,0.08)" : "none" }}>
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

        {/* Main layout: list + detail */}
        <div className="flex-1 flex overflow-hidden">
          {/* Case list sidebar */}
          <div className="w-72 flex-shrink-0 border-r overflow-hidden" style={{ borderColor: "rgba(167,139,250,0.1)" }}>
            <CaseList selectedCaseId={selectedCaseId} onSelectCase={setSelectedCaseId} isAr={isAr} />
          </div>

          {/* Case detail */}
          <div className="flex-1 overflow-hidden">
            {selectedCase ? (
              <CaseDetail caseData={selectedCase} isAr={isAr} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4" style={{ background: "rgba(167,139,250,0.1)" }}>
                  <i className="ri-folder-shield-2-line text-purple-400 text-2xl" />
                </div>
                <p className="text-gray-500 text-sm font-['Inter']">Select a case to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseManagementPage;
