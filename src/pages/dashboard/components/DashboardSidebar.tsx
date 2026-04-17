import { useNavigate, useLocation } from "react-router-dom";
import { navItems, entityMeta, type EntityType } from "@/mocks/dashboardData";

interface Props {
  activeNav: string;
  onNavChange: (key: string) => void;
  entityType: EntityType;
  isAr: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const groupLabels: Record<string, { en: string; ar: string }> = {
  main:    { en: "MAIN",    ar: "الرئيسية" },
  modules: { en: "MODULES", ar: "الوحدات" },
  admin:   { en: "ADMIN",   ar: "الإدارة" },
};

const DashboardSidebar = ({ activeNav, onNavChange, entityType, isAr, collapsed, onToggleCollapse }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const meta = entityMeta[entityType];

  const handleNavClick = (item: typeof navItems[0]) => {
    onNavChange(item.key);
    if (item.route) {
      navigate(item.route);
    }
  };

  const isItemActive = (item: typeof navItems[0]) => {
    if (item.route) {
      return location.pathname === item.route;
    }
    return activeNav === item.key && location.pathname === "/dashboard";
  };

  // Group items — skip groups that have no items
  const groups = ["main", "modules", "admin"] as const;
  const grouped = groups
    .map((g) => ({
      group: g,
      items: navItems.filter((n) => n.group === g),
    }))
    .filter(({ items }) => items.length > 0);

  return (
    <aside
      className="flex flex-col flex-shrink-0 border-r transition-all duration-300"
      style={{
        width: collapsed ? "64px" : "220px",
        background: "#0A1628",
        borderColor: "rgba(34,211,238,0.1)",
        minHeight: "100%",
      }}
    >
      {/* User info */}
      {!collapsed && (
        <div className="px-4 py-5 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0"
              style={{ background: "rgba(34,211,238,0.15)", border: "2px solid rgba(34,211,238,0.4)" }}>
              <span className="text-cyan-400 text-sm font-black font-['Inter']">AA</span>
            </div>
            <div className="min-w-0">
              <p className="text-cyan-400 text-xs font-semibold font-['JetBrains_Mono'] uppercase tracking-widest">
                {isAr ? "مرحباً" : "WELCOME"}
              </p>
              <p className="text-white text-sm font-bold font-['Inter'] truncate">Ahmed Al-Amri</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <i className="ri-time-line text-gray-600 text-xs" />
              <div>
                <p className="text-gray-600 text-xs font-['JetBrains_Mono']">{isAr ? "آخر دخول" : "Last Login"}</p>
                <p className="text-gray-400 text-xs font-['JetBrains_Mono']">2025-04-05 08:32</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-send-plane-line text-gray-600 text-xs" />
              <div>
                <p className="text-gray-600 text-xs font-['JetBrains_Mono']">{isAr ? "آخر حدث" : "Last Event"}</p>
                <p className="text-gray-400 text-xs font-['JetBrains_Mono']">2025-04-05 09:14</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="flex justify-center py-4 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
          <div className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: "rgba(34,211,238,0.15)", border: "2px solid rgba(34,211,238,0.4)" }}>
            <span className="text-cyan-400 text-xs font-black font-['Inter']">AA</span>
          </div>
        </div>
      )}

      {/* Nav items grouped */}
      <nav className="flex-1 py-2 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {grouped.map(({ group, items }) => (
          <div key={group}>
            {/* Group label */}
            {!collapsed && (
              <div className="px-4 pt-4 pb-1">
                <span className="text-gray-700 text-[10px] font-bold tracking-widest font-['JetBrains_Mono'] uppercase">
                  {isAr ? groupLabels[group].ar : groupLabels[group].en}
                </span>
              </div>
            )}
            {collapsed && group !== "main" && (
              <div className="mx-3 my-2 border-t" style={{ borderColor: "rgba(34,211,238,0.08)" }} />
            )}

            {items.map((item) => {
              const isActive = isItemActive(item);
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-150 cursor-pointer relative group"
                  style={{
                    background: isActive ? "rgba(34,211,238,0.08)" : "transparent",
                    color: isActive ? "#22D3EE" : "#6B7280",
                  }}
                  title={collapsed ? (isAr ? item.labelAr : item.labelEn) : undefined}
                >
                  {/* Active bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full bg-cyan-400" />
                  )}
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i className={`${item.icon} text-base`} />
                  </div>
                  {!collapsed && (
                    <span className="text-sm font-['Inter'] font-medium whitespace-nowrap">
                      {isAr ? item.labelAr : item.labelEn}
                    </span>
                  )}
                  {/* Route indicator dot */}
                  {!collapsed && item.route && !isActive && (
                    <div className="ml-auto w-1 h-1 rounded-full bg-cyan-400/30 flex-shrink-0" />
                  )}
                  {/* Hover tooltip when collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 rounded-md text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 font-['Inter']"
                      style={{ background: "rgba(10,22,40,0.95)", border: "1px solid rgba(34,211,238,0.2)" }}>
                      {isAr ? item.labelAr : item.labelEn}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: Network status + collapse toggle + sign out */}
      <div className="border-t p-3" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
        {!collapsed && (
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            <span className="text-green-400 text-xs font-['JetBrains_Mono']">
              {isAr ? "متصل بالشبكة" : "Network Online"}
            </span>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center mb-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-gray-600 hover:text-gray-400"
        >
          <i className={`text-sm ${collapsed ? "ri-arrow-right-s-line" : "ri-arrow-left-s-line"}`} />
          {!collapsed && <span className="text-xs font-['Inter']">{isAr ? "طي" : "Collapse"}</span>}
        </button>

        {/* Divider between collapse toggle and sign-out */}
        <div className="my-3 border-t" style={{ borderColor: "rgba(34,211,238,0.08)" }} />

        {/* Sign out button — big, red gradient, prominent */}
        {!collapsed ? (
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group"
            style={{
              background: "linear-gradient(135deg, #DC2626, #B91C1C)",
              boxShadow: "0 2px 8px rgba(220,38,38,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(220,38,38,0.55), 0 0 0 1px rgba(220,38,38,0.4)";
              e.currentTarget.style.filter = "brightness(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(220,38,38,0.25)";
              e.currentTarget.style.filter = "brightness(1)";
            }}
            title={isAr ? "تسجيل الخروج" : "Sign Out"}
          >
            <i className="ri-logout-box-r-line text-white text-base" />
            <span className="text-white text-sm font-bold font-['Inter']">
              {isAr ? "تسجيل الخروج" : "SIGN OUT"}
            </span>
          </button>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/login")}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #DC2626, #B91C1C)",
                boxShadow: "0 2px 8px rgba(220,38,38,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(220,38,38,0.55), 0 0 0 1px rgba(220,38,38,0.4)";
                e.currentTarget.style.filter = "brightness(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(220,38,38,0.25)";
                e.currentTarget.style.filter = "brightness(1)";
              }}
              title={isAr ? "تسجيل الخروج" : "Sign Out"}
            >
              <i className="ri-logout-box-r-line text-white text-base" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
