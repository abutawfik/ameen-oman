import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/pages/dashboard/components/DashboardSidebar";
import EntityNotifPanel from "./components/EntityNotifPanel";
import RopAlertCenter from "./components/RopAlertCenter";
import CommunicationHub from "./components/CommunicationHub";
import AlertRulesBuilder from "./components/AlertRulesBuilder";
import { entityNotifications, ropAlerts } from "@/mocks/notificationsData";
import { branches, entityMeta } from "@/mocks/dashboardData";

type MainTab = "entity" | "rop-alerts" | "comms" | "rules";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [isAr, setIsAr] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("notifications");
  const [activeTab, setActiveTab] = useState<MainTab>("entity");
  const [branchOpen, setBranchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [userOpen, setUserOpen] = useState(false);

  const unreadEntity = entityNotifications.filter((n) => !n.read).length;
  const unackRop = ropAlerts.filter((a) => !a.acknowledged).length;
  const criticalRop = ropAlerts.filter((a) => a.priority === "critical" && !a.acknowledged).length;
  const branch = branches.find((b) => b.id === selectedBranch) || branches[0];
  const meta = entityMeta["borders"];

  const tabs: { key: MainTab; icon: string; labelEn: string; labelAr: string; badge?: number; badgeColor?: string }[] = [
    { key: "entity",    icon: "ri-notification-3-line",  labelEn: "Entity Notifications", labelAr: "إشعارات الكيان",    badge: unreadEntity, badgeColor: "#22D3EE" },
    { key: "rop-alerts",icon: "ri-alarm-warning-line",   labelEn: "ROP Alert Center",     labelAr: "مركز تنبيهات ROP",  badge: unackRop,     badgeColor: criticalRop > 0 ? "#F87171" : "#FB923C" },
    { key: "comms",     icon: "ri-chat-3-line",          labelEn: "Communication Hub",    labelAr: "مركز الاتصالات",    badge: 0 },
    { key: "rules",     icon: "ri-git-branch-line",      labelEn: "Alert Rules",          labelAr: "قواعد التنبيه",     badge: 0 },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#060D1A" }}>
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="notif-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22D3EE" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#notif-grid)" />
        </svg>
      </div>

      {/* Sidebar */}
      <DashboardSidebar
        activeNav={activeNav}
        onNavChange={(key) => { setActiveNav(key); }}
        entityType="borders"
        isAr={isAr}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">

        {/* Custom title bar */}
        <header
          className="flex items-center justify-between px-4 md:px-6 h-16 border-b flex-shrink-0 relative z-30"
          style={{ background: "rgba(6,13,26,0.98)", borderColor: "rgba(34,211,238,0.15)", backdropFilter: "blur(12px)" }}
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer text-gray-500">
              <i className="ri-menu-line text-sm" />
            </button>
            <img src="https://public.readdy.ai/ai/img_res/407b94a6-cd23-46f2-9c3a-b1f5c8ba9a2c.png" alt="AMEEN" className="w-8 h-8 object-contain flex-shrink-0" />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-cyan-400 font-black text-base tracking-widest font-['Inter']">AMEEN</span>
              <span className="text-cyan-400/60 text-xs font-['Cairo']">أمين</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-white/10 mx-1" />
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.15)" }}>
              <i className="ri-notification-3-line text-xs text-cyan-400" />
              <span className="text-gray-400 text-xs font-['Inter']">{isAr ? "الإشعارات والاتصالات" : "Notifications & Communications"}</span>
            </div>
          </div>

          {/* Center: branch */}
          <div className="relative">
            <button
              onClick={() => { setBranchOpen(!branchOpen); setUserOpen(false); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors hover:border-cyan-500/40 whitespace-nowrap"
              style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(255,255,255,0.1)" }}
            >
              <i className="ri-map-pin-line text-cyan-400 text-xs" />
              <span className="text-gray-300 text-xs font-['Inter'] max-w-[120px] truncate">{isAr ? branch.nameAr : branch.name}</span>
              <i className={`ri-arrow-down-s-line text-gray-500 text-xs transition-transform ${branchOpen ? "rotate-180" : ""}`} />
            </button>
            {branchOpen && (
              <div className="absolute top-full mt-1 right-0 w-56 rounded-xl border overflow-hidden z-50" style={{ background: "rgba(10,22,40,0.98)", borderColor: "rgba(34,211,238,0.2)", backdropFilter: "blur(16px)" }}>
                {branches.map((b) => (
                  <button key={b.id} onClick={() => { setSelectedBranch(b.id); setBranchOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cyan-500/5 transition-colors cursor-pointer text-left border-b border-white/5 last:border-0"
                    style={{ background: selectedBranch === b.id ? "rgba(34,211,238,0.06)" : "transparent" }}>
                    <i className="ri-map-pin-line text-cyan-400/60 text-xs" />
                    <div>
                      <p className="text-white text-xs font-semibold font-['Inter']">{isAr ? b.nameAr : b.name}</p>
                      <p className="text-gray-600 text-xs font-['Inter']">{b.location}</p>
                    </div>
                    {selectedBranch === b.id && <i className="ri-check-line text-cyan-400 text-xs ml-auto" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button onClick={() => setIsAr(!isAr)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/10 transition-colors cursor-pointer font-['JetBrains_Mono']">
              {isAr ? "EN" : "AR"}
            </button>

            {/* Critical alert indicator */}
            {criticalRop > 0 && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full cursor-pointer"
                style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.35)" }}
                onClick={() => setActiveTab("rop-alerts")}
              >
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono'] whitespace-nowrap">
                  {criticalRop} {isAr ? "حرج" : "CRITICAL"}
                </span>
              </div>
            )}

            {/* User */}
            <div className="relative">
              <button onClick={() => { setUserOpen(!userOpen); setBranchOpen(false); }}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-400/15 border border-cyan-400/30">
                  <span className="text-cyan-400 text-xs font-bold font-['Inter']">AA</span>
                </div>
                <i className={`ri-arrow-down-s-line text-gray-500 text-xs hidden sm:block transition-transform ${userOpen ? "rotate-180" : ""}`} />
              </button>
              {userOpen && (
                <div className="absolute top-full mt-1 right-0 w-48 rounded-xl border overflow-hidden z-50" style={{ background: "rgba(10,22,40,0.98)", borderColor: "rgba(34,211,238,0.2)", backdropFilter: "blur(16px)" }}>
                  {[
                    { icon: "ri-user-line", labelEn: "Profile", labelAr: "الملف الشخصي" },
                    { icon: "ri-settings-line", labelEn: "Settings", labelAr: "الإعدادات" },
                  ].map((item) => (
                    <button key={item.icon} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0">
                      <i className={`${item.icon} text-gray-400 text-sm`} />
                      <span className="text-gray-300 text-xs font-['Inter']">{isAr ? item.labelAr : item.labelEn}</span>
                    </button>
                  ))}
                  <a href="/login" className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/5 transition-colors cursor-pointer">
                    <i className="ri-logout-box-line text-red-400 text-sm" />
                    <span className="text-red-400 text-xs font-['Inter']">{isAr ? "تسجيل الخروج" : "Logout"}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page header */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
          style={{ borderColor: "rgba(34,211,238,0.1)", background: "rgba(10,22,40,0.5)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)" }}>
              <i className="ri-notification-3-line text-cyan-400 text-sm" />
            </div>
            <div>
              <h1 className="text-white text-sm font-bold font-['Inter']">
                {isAr ? "نظام الإشعارات والاتصالات" : "Notification & Communication System"}
              </h1>
              <p className="text-gray-500 text-xs font-['JetBrains_Mono']">
                {isAr ? "AMEEN — إدارة التنبيهات والرسائل" : "AMEEN — Alert Management & Messaging"}
              </p>
            </div>
          </div>

          {/* Summary stats */}
          <div className="flex items-center gap-3">
            {[
              { label: "Unread", labelAr: "غير مقروء", value: unreadEntity, color: "#22D3EE" },
              { label: "Unack'd", labelAr: "غير مؤكد", value: unackRop, color: "#FB923C" },
              { label: "Critical", labelAr: "حرج", value: criticalRop, color: "#F87171" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: `${stat.color}10`, border: `1px solid ${stat.color}25` }}>
                <span className="text-sm font-bold font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.value}</span>
                <span className="text-xs font-['Inter']" style={{ color: stat.color }}>{isAr ? stat.labelAr : stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main tabs */}
        <div className="flex items-center gap-1 px-6 py-2 border-b flex-shrink-0" style={{ borderColor: "rgba(34,211,238,0.08)", background: "rgba(6,13,26,0.4)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-['Inter'] font-medium cursor-pointer transition-all whitespace-nowrap"
              style={{
                background: activeTab === tab.key ? "rgba(34,211,238,0.1)" : "transparent",
                color: activeTab === tab.key ? "#22D3EE" : "#6B7280",
                border: activeTab === tab.key ? "1px solid rgba(34,211,238,0.25)" : "1px solid transparent",
              }}
            >
              <i className={`${tab.icon} text-sm`} />
              {isAr ? tab.labelAr : tab.labelEn}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-[10px] font-bold font-['JetBrains_Mono']"
                  style={{ background: `${tab.badgeColor}22`, color: tab.badgeColor }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "entity" && (
            <div className="h-full max-w-3xl mx-auto">
              <EntityNotifPanel isAr={isAr} />
            </div>
          )}
          {activeTab === "rop-alerts" && (
            <div className="h-full max-w-3xl mx-auto">
              <RopAlertCenter isAr={isAr} />
            </div>
          )}
          {activeTab === "comms" && (
            <div className="h-full max-w-3xl mx-auto">
              <CommunicationHub isAr={isAr} />
            </div>
          )}
          {activeTab === "rules" && (
            <div className="h-full max-w-3xl mx-auto">
              <AlertRulesBuilder isAr={isAr} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
