import { useState, useEffect } from "react";
import { Outlet, useSearchParams, useLocation } from "react-router-dom";
import i18n from "@/i18n";
import { type EntityType, navItems } from "@/mocks/dashboardData";
import DashboardTitleBar from "./components/DashboardTitleBar";
import DashboardSidebar from "./components/DashboardSidebar";

// Context threaded to every child route via <Outlet context={...} />.
// Child pages consume via `const { isAr } = useOutletContext<DashboardOutletContext>();`
// so the layout's single lang toggle reaches everything rendered in the outlet.
export type DashboardOutletContext = {
  isAr: boolean;
  lang: string;
  toggleLang: () => void;
  entityType: EntityType;
};

// Persistent chrome for every /dashboard/* route.
// Title bar + sidebar render once at the layout level; child pages render in the <Outlet />.
const DashboardLayout = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [lang, setLang] = useState(i18n.language || "en");
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const entityType = (searchParams.get("type") as EntityType) || "hotel";
  const isAr = lang === "ar";

  // Derive active sidebar key from current URL so the highlight tracks navigation.
  const activeNav =
    navItems.find((n) => n.route === location.pathname)?.key ?? "home";

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
      <DashboardTitleBar
        entityType={entityType}
        isAr={isAr}
        onToggleLang={toggleLang}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
      />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar
          activeNav={activeNav}
          onNavChange={() => { /* nav is URL-driven — click handled by DashboardSidebar navigate() */ }}
          entityType={entityType}
          isAr={isAr}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-auto">
          <Outlet context={{ isAr, lang, toggleLang, entityType } satisfies DashboardOutletContext} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
