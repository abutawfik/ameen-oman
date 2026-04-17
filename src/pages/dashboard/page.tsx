import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "./DashboardLayout";
import DataAnalystHome from "./components/home/DataAnalystHome";
import SupervisorHome from "./components/home/SupervisorHome";
import ManagerHome from "./components/home/ManagerHome";
import RoleSwitcher, { type Role } from "./components/home/RoleSwitcher";

const STORAGE_KEY = "ameen:homeRole";

// Home view for /dashboard — renders inside DashboardLayout's <Outlet />.
// Three role-based dashboards (Analyst / Supervisor / Manager) toggled by
// the pill in the sticky header; choice persists in localStorage.
const DashboardPage = () => {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [role, setRole] = useState<Role>(() => {
    if (typeof window === "undefined") return "analyst";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "supervisor" || stored === "manager" ? stored : "analyst";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, role);
  }, [role]);

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#0B1220" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Subtle grid texture — matches the OSINT engine page look */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(181,142,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Sticky role-switcher bar — brand identity lives in the global title-bar */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b"
        style={{
          background: "rgba(11,18,32,0.92)",
          borderColor: "rgba(181,142,60,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div>
          <p className="text-white font-bold text-sm">
            {isAr ? "لوحة تحكّم المشغّل" : "Operator Console"}
          </p>
          <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
            {isAr
              ? "اعرض حسب الدور · محلل / مشرف / مدير"
              : "role-based view · analyst / supervisor / manager"}
          </p>
        </div>
        <RoleSwitcher value={role} onChange={setRole} isAr={isAr} />
      </div>

      {/* Content */}
      {role === "analyst"    && <DataAnalystHome isAr={isAr} />}
      {role === "supervisor" && <SupervisorHome  isAr={isAr} />}
      {role === "manager"    && <ManagerHome     isAr={isAr} />}
    </div>
  );
};

export default DashboardPage;
