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
    <div className="min-h-screen font-['Inter']" style={{ background: "#060D1A" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Subtle grid texture — matches the OSINT engine page look */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Sticky role-switcher bar */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b"
        style={{
          background: "rgba(6,13,26,0.92)",
          borderColor: "rgba(34,211,238,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: "rgba(34,211,238,0.1)", border: "2px solid rgba(34,211,238,0.3)" }}
          >
            <i className="ri-radar-line text-cyan-400 text-base" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-black text-base tracking-wide">AMEEN</span>
              <span className="text-white font-bold text-sm">
                {isAr ? "مركز قيادة محرّك المخاطر" : "Risk Engine Command Center"}
              </span>
            </div>
            <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
              {isAr
                ? "لوحة تحكم حسب الدور · محلل / مشرف / مدير"
                : "role-based home · analyst / supervisor / manager"}
            </p>
          </div>
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
