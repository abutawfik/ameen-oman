import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import EntityNotifPanel from "./components/EntityNotifPanel";
import PoliceAlertCenter from "./components/PoliceAlertCenter";
import CommunicationHub from "./components/CommunicationHub";
import AlertRulesBuilder from "./components/AlertRulesBuilder";
import { entityNotifications, policeAlerts } from "@/mocks/notificationsData";

type MainTab = "entity" | "police-alerts" | "comms" | "rules";

const NotificationsPage = () => {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeTab, setActiveTab] = useState<MainTab>("entity");

  const unreadEntity = entityNotifications.filter((n) => !n.read).length;
  const unackPolice = policeAlerts.filter((a) => !a.acknowledged).length;
  const criticalPolice = policeAlerts.filter((a) => a.priority === "critical" && !a.acknowledged).length;

  const tabs: { key: MainTab; icon: string; labelEn: string; labelAr: string; badge?: number; badgeColor?: string }[] = [
    { key: "entity",        icon: "ri-notification-3-line",  labelEn: "Entity Notifications", labelAr: "إشعارات الكيان",    badge: unreadEntity, badgeColor: "#D4A84B" },
    { key: "police-alerts", icon: "ri-alarm-warning-line",   labelEn: "Police Alert Center",  labelAr: "مركز تنبيهات الشرطة",  badge: unackPolice,  badgeColor: criticalPolice > 0 ? "#F87171" : "#FB923C" },
    { key: "comms",         icon: "ri-chat-3-line",          labelEn: "Communication Hub",    labelAr: "مركز الاتصالات",    badge: 0 },
    { key: "rules",         icon: "ri-git-branch-line",      labelEn: "Alert Rules",          labelAr: "قواعد التنبيه",     badge: 0 },
  ];

  return (
    <div className="flex flex-col h-full" style={{ background: "#0B1220" }}>
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="notif-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D4A84B" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#notif-grid)" />
        </svg>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Page header */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
          style={{ borderColor: "rgba(181,142,60,0.1)", background: "rgba(20,29,46,0.5)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.3)" }}>
              <i className="ri-notification-3-line text-gold-400 text-sm" />
            </div>
            <div>
              <h1 className="text-white text-sm font-bold font-['Inter']">
                {isAr ? "نظام الإشعارات والاتصالات" : "Notification & Communication System"}
              </h1>
              <p className="text-gray-500 text-xs font-['JetBrains_Mono']">
                {isAr ? "Al-Ameen — إدارة التنبيهات والرسائل" : "Al-Ameen — Alert Management & Messaging"}
              </p>
            </div>
          </div>

          {/* Summary stats */}
          <div className="flex items-center gap-3">
            {[
              { label: "Unread", labelAr: "غير مقروء", value: unreadEntity, color: "#D4A84B" },
              { label: "Unack'd", labelAr: "غير مؤكد", value: unackPolice, color: "#FB923C" },
              { label: "Critical", labelAr: "حرج", value: criticalPolice, color: "#F87171" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: `${stat.color}10`, border: `1px solid ${stat.color}25` }}>
                <span className="text-sm font-bold font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.value}</span>
                <span className="text-xs font-['Inter']" style={{ color: stat.color }}>{isAr ? stat.labelAr : stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main tabs */}
        <div className="flex items-center gap-1 px-6 py-2 border-b flex-shrink-0" style={{ borderColor: "rgba(181,142,60,0.08)", background: "rgba(11,18,32,0.4)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-['Inter'] font-medium cursor-pointer transition-all whitespace-nowrap"
              style={{
                background: activeTab === tab.key ? "rgba(181,142,60,0.1)" : "transparent",
                color: activeTab === tab.key ? "#D4A84B" : "#6B7280",
                border: activeTab === tab.key ? "1px solid rgba(181,142,60,0.25)" : "1px solid transparent",
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
          {activeTab === "police-alerts" && (
            <div className="h-full max-w-3xl mx-auto">
              <PoliceAlertCenter isAr={isAr} />
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
