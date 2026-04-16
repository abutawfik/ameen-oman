import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import i18n from "@/i18n";
import { type EntityType } from "@/mocks/dashboardData";
import DashboardTitleBar from "./components/DashboardTitleBar";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardMain from "./components/DashboardMain";

const DashboardPage = () => {
  const [searchParams] = useSearchParams();
  const [lang, setLang] = useState(i18n.language || "en");
  const [activeNav, setActiveNav] = useState("home");
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const entityType = (searchParams.get("type") as EntityType) || "hotel";
  const isAr = lang === "ar";

  useEffect(() => {
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  const toggleLang = () => {
    const next = isAr ? "en" : "ar";
    setLang(next);
    i18n.changeLanguage(next);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "#060D1A" }}>
      {/* Title Bar */}
      <DashboardTitleBar
        entityType={entityType}
        isAr={isAr}
        onToggleLang={toggleLang}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
      />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar
          activeNav={activeNav}
          onNavChange={setActiveNav}
          entityType={entityType}
          isAr={isAr}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main content */}
        <DashboardMain entityType={entityType} isAr={isAr} />
      </div>
    </div>
  );
};

export default DashboardPage;
