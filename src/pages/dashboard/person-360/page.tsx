import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/pages/dashboard/components/DashboardSidebar";
import DashboardTitleBar from "@/pages/dashboard/components/DashboardTitleBar";
import IdentityCard from "./components/IdentityCard";
import StreamSummaryRow from "./components/StreamSummaryRow";
import MovementTimeline from "./components/MovementTimeline";
import ConnectionsMap from "./components/ConnectionsMap";
import SocialProfiles from "./components/SocialProfiles";
import TravelPattern from "./components/TravelPattern";
import {
  mockPerson,
  mockStreamSummary,
  mockTimeline,
  mockConnections,
  mockEdges,
  mockSocialProfiles,
  mockTravelStops,
} from "@/mocks/person360Data";

const Person360Page = () => {
  const navigate = useNavigate();
  const [isAr, setIsAr] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("person360");
  const [streamFilter, setStreamFilter] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"timeline" | "connections" | "social" | "travel">("timeline");
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [dossierGenerating, setDossierGenerating] = useState(false);
  const [dossierReady, setDossierReady] = useState(false);

  const handleGenerateDossier = () => {
    setShowDossierModal(true);
    setDossierGenerating(true);
    setDossierReady(false);
    setTimeout(() => {
      setDossierGenerating(false);
      setDossierReady(true);
    }, 2800);
  };

  const sections = [
    { key: "timeline",    icon: "ri-time-line",          labelEn: "Movement Timeline",  labelAr: "الجدول الزمني" },
    { key: "connections", icon: "ri-share-line",          labelEn: "Connections Map",    labelAr: "خريطة الاتصالات" },
    { key: "social",      icon: "ri-global-line",         labelEn: "Social Profiles",    labelAr: "الملفات الاجتماعية" },
    { key: "travel",      icon: "ri-map-2-line",          labelEn: "Travel Pattern",     labelAr: "نمط التنقل" },
  ];

  const alertCount = mockTimeline.filter((e) => e.isAlert).length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#060D1A" }}>
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="p360-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22D3EE" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#p360-grid)" />
        </svg>
      </div>

      {/* Sidebar */}
      <DashboardSidebar
        activeNav={activeNav}
        onNavChange={(key) => {
          setActiveNav(key);
        }}
        entityType="borders"
        isAr={isAr}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Title bar */}
        <DashboardTitleBar
          entityType="borders"
          isAr={isAr}
          onToggleLang={() => setIsAr(!isAr)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Page header */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
          style={{ borderColor: "rgba(34,211,238,0.1)", background: "rgba(10,22,40,0.6)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard/risk-assessment")}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer text-sm font-['Inter']"
            >
              <i className="ri-arrow-left-line" />
              {isAr ? "رجوع" : "Back"}
            </button>
            <div className="w-px h-4 bg-gray-700" />
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 flex items-center justify-center rounded-lg"
                style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)" }}
              >
                <i className="ri-user-search-line text-cyan-400 text-sm" />
              </div>
              <div>
                <h1 className="text-white text-sm font-bold font-['Inter']">
                  {isAr ? "ملف الشخص 360°" : "Person 360° Profile"}
                </h1>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono']">
                  {isAr ? "عرض موحد متعدد الكيانات" : "Unified Cross-Entity View"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Alert count badge */}
            {alertCount > 0 && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)" }}
              >
                <i className="ri-alert-fill text-red-400 text-sm" />
                <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">
                  {alertCount} {isAr ? "تنبيه نمط" : "Pattern Alerts"}
                </span>
              </div>
            )}
            {/* Actions */}
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer transition-colors whitespace-nowrap"
              style={{ background: "rgba(34,211,238,0.05)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}
            >
              <i className="ri-share-forward-line" />
              {isAr ? "مشاركة" : "Share"}
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer transition-colors whitespace-nowrap"
              style={{ background: "rgba(251,146,60,0.1)", color: "#FB923C", border: "1px solid rgba(251,146,60,0.2)" }}
            >
              <i className="ri-flag-line" />
              {isAr ? "تصعيد" : "Escalate"}
            </button>
            <button
              onClick={handleGenerateDossier}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold font-['Inter'] cursor-pointer transition-all whitespace-nowrap"
              style={{ background: "#22D3EE", color: "#060D1A", boxShadow: "0 0 16px rgba(34,211,238,0.25)" }}
            >
              <i className="ri-file-pdf-line" />
              {isAr ? "إنشاء ملف شامل" : "Generate Dossier"}
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(34,211,238,0.2) transparent" }}>

          {/* Identity Card */}
          <IdentityCard person={mockPerson} isAr={isAr} />

          {/* Stream Summary Row */}
          <div
            className="rounded-xl p-5"
            style={{
              background: "rgba(10,22,40,0.8)",
              border: "1px solid rgba(34,211,238,0.15)",
              backdropFilter: "blur(12px)",
            }}
          >
            <StreamSummaryRow
              streams={mockStreamSummary}
              activeFilter={streamFilter}
              onFilterChange={setStreamFilter}
              isAr={isAr}
            />
          </div>

          {/* Section tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.1)" }}>
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key as typeof activeSection)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-['Inter'] font-medium cursor-pointer transition-all duration-200 whitespace-nowrap"
                style={{
                  background: activeSection === s.key ? "rgba(34,211,238,0.12)" : "transparent",
                  color: activeSection === s.key ? "#22D3EE" : "#6B7280",
                  border: activeSection === s.key ? "1px solid rgba(34,211,238,0.25)" : "1px solid transparent",
                }}
              >
                <i className={`${s.icon} text-sm`} />
                {isAr ? s.labelAr : s.labelEn}
                {s.key === "timeline" && alertCount > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[10px] font-bold font-['JetBrains_Mono']"
                    style={{ background: "rgba(248,113,113,0.2)", color: "#F87171" }}
                  >
                    {alertCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Section content */}
          {activeSection === "timeline" && (
            <MovementTimeline
              events={mockTimeline}
              streamFilter={streamFilter}
              isAr={isAr}
            />
          )}

          {activeSection === "connections" && (
            <ConnectionsMap
              nodes={mockConnections}
              edges={mockEdges}
              isAr={isAr}
            />
          )}

          {activeSection === "social" && (
            <SocialProfiles
              profiles={mockSocialProfiles}
              isAr={isAr}
            />
          )}

          {activeSection === "travel" && (
            <TravelPattern
              stops={mockTravelStops}
              isAr={isAr}
              onGenerateDossier={handleGenerateDossier}
            />
          )}

          {/* Bottom padding */}
          <div className="h-6" />
        </div>
      </div>

      {/* Dossier Generation Modal */}
      {showDossierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(6,13,26,0.85)", backdropFilter: "blur(8px)" }}>
          <div
            className="w-full max-w-md rounded-2xl p-8 flex flex-col items-center gap-5"
            style={{
              background: "rgba(10,22,40,0.95)",
              border: "1px solid rgba(34,211,238,0.3)",
              boxShadow: "0 0 60px rgba(34,211,238,0.1)",
            }}
          >
            {dossierGenerating ? (
              <>
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(34,211,238,0.1)" strokeWidth="6" />
                    <circle
                      cx="40" cy="40" r="34" fill="none"
                      stroke="#22D3EE" strokeWidth="6"
                      strokeDasharray="213"
                      strokeDashoffset="53"
                      strokeLinecap="round"
                      style={{ animation: "spin 1.5s linear infinite" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="ri-file-pdf-line text-cyan-400 text-2xl" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-white text-lg font-bold font-['Inter'] mb-1">
                    {isAr ? "جارٍ إنشاء الملف الشامل..." : "Generating Dossier..."}
                  </h3>
                  <p className="text-gray-400 text-sm font-['Inter']">
                    {isAr ? "جمع البيانات من 13 تدفقاً" : "Compiling data from 13 streams"}
                  </p>
                </div>
                <div className="w-full space-y-2">
                  {[
                    { label: "Identity & Documents", done: true },
                    { label: "Movement Timeline (18 events)", done: true },
                    { label: "Pattern Alerts (5)", done: true },
                    { label: "Connections Map", done: false },
                    { label: "Social Intelligence", done: false },
                  ].map((step) => (
                    <div key={step.label} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: step.done ? "rgba(74,222,128,0.2)" : "rgba(34,211,238,0.1)", border: `1px solid ${step.done ? "#4ADE80" : "rgba(34,211,238,0.3)"}` }}
                      >
                        {step.done
                          ? <i className="ri-check-line text-green-400 text-[10px]" />
                          : <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        }
                      </div>
                      <span className="text-xs font-['JetBrains_Mono']" style={{ color: step.done ? "#4ADE80" : "#6B7280" }}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(74,222,128,0.15)", border: "2px solid #4ADE80", boxShadow: "0 0 20px rgba(74,222,128,0.3)" }}
                >
                  <i className="ri-check-line text-green-400 text-2xl" />
                </div>
                <div className="text-center">
                  <h3 className="text-white text-lg font-bold font-['Inter'] mb-1">
                    {isAr ? "الملف الشامل جاهز" : "Dossier Ready"}
                  </h3>
                  <p className="text-gray-400 text-sm font-['Inter']">
                    {isAr ? "تم تجميع 18 حدثاً من 10 تدفقات" : "18 events compiled from 10 streams"}
                  </p>
                  <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-1">
                    AMEEN-DOSSIER-P-2025-00441-20250405.pdf · 2.4 MB
                  </p>
                </div>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowDossierModal(false)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-['Inter'] cursor-pointer transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {isAr ? "إغلاق" : "Close"}
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold font-['Inter'] cursor-pointer transition-all"
                    style={{ background: "#22D3EE", color: "#060D1A", boxShadow: "0 0 16px rgba(34,211,238,0.25)" }}
                    onClick={() => setShowDossierModal(false)}
                  >
                    <i className="ri-download-line" />
                    {isAr ? "تنزيل PDF" : "Download PDF"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Person360Page;
