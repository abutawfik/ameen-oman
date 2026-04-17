import { useState } from "react";
import { entityNotifications, notifPreferences, type EntityNotification, type NotifCategory } from "@/mocks/notificationsData";

interface Props {
  isAr: boolean;
}

const categoryConfig: Record<NotifCategory, { labelEn: string; labelAr: string; icon: string }> = {
  event:   { labelEn: "Events",  labelAr: "الأحداث",  icon: "ri-calendar-event-line" },
  system:  { labelEn: "System",  labelAr: "النظام",   icon: "ri-server-line" },
  account: { labelEn: "Account", labelAr: "الحساب",   icon: "ri-user-settings-line" },
};

const EntityNotifPanel = ({ isAr }: Props) => {
  const [activeTab, setActiveTab] = useState<"all" | NotifCategory>("all");
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState(notifPreferences);
  const [quietHours, setQuietHours] = useState(false);
  const [quietFrom, setQuietFrom] = useState("22:00");
  const [quietTo, setQuietTo] = useState("07:00");
  const [notifications, setNotifications] = useState<EntityNotification[]>(entityNotifications);

  const filtered = activeTab === "all"
    ? notifications
    : notifications.filter((n) => n.category === activeTab);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const togglePref = (type: string, channel: string) => {
    setPrefs((prev) => ({
      ...prev,
      [type]: { ...prev[type], [channel]: !prev[type][channel] },
    }));
  };

  const tabs = [
    { key: "all" as const, labelEn: "All", labelAr: "الكل" },
    { key: "event" as const, labelEn: "Events", labelAr: "الأحداث" },
    { key: "system" as const, labelEn: "System", labelAr: "النظام" },
    { key: "account" as const, labelEn: "Account", labelAr: "الحساب" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: "rgba(181,142,60,0.12)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.3)" }}>
            <i className="ri-notification-3-line text-gold-400 text-sm" />
          </div>
          <div>
            <h2 className="text-white text-sm font-bold font-['Inter']">{isAr ? "مركز الإشعارات" : "Notification Center"}</h2>
            {unreadCount > 0 && (
              <p className="text-gold-400 text-xs font-['JetBrains_Mono']">{unreadCount} {isAr ? "غير مقروء" : "unread"}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrefs(!showPrefs)}
            className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors"
            style={{
              background: showPrefs ? "rgba(181,142,60,0.1)" : "rgba(255,255,255,0.03)",
              border: showPrefs ? "1px solid rgba(181,142,60,0.3)" : "1px solid rgba(255,255,255,0.06)",
              color: showPrefs ? "#D4A84B" : "#6B7280",
            }}
            title={isAr ? "التفضيلات" : "Preferences"}
          >
            <i className="ri-settings-3-line text-sm" />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs px-2 py-1 rounded cursor-pointer font-['JetBrains_Mono'] whitespace-nowrap"
              style={{ color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)", background: "rgba(181,142,60,0.05)" }}
            >
              {isAr ? "قراءة الكل" : "Mark all read"}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b flex-shrink-0" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
        {tabs.map((tab) => {
          const count = tab.key === "all"
            ? notifications.filter((n) => !n.read).length
            : notifications.filter((n) => n.category === tab.key && !n.read).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-['Inter'] font-medium cursor-pointer transition-all whitespace-nowrap"
              style={{
                background: activeTab === tab.key ? "rgba(181,142,60,0.1)" : "transparent",
                color: activeTab === tab.key ? "#D4A84B" : "#6B7280",
                border: activeTab === tab.key ? "1px solid rgba(181,142,60,0.2)" : "1px solid transparent",
              }}
            >
              {isAr ? tab.labelAr : tab.labelEn}
              {count > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-[10px] font-bold font-['JetBrains_Mono']"
                  style={{ background: "rgba(181,142,60,0.2)", color: "#D4A84B" }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Preferences panel */}
      {showPrefs && (
        <div className="border-b flex-shrink-0 overflow-y-auto" style={{ borderColor: "rgba(181,142,60,0.08)", maxHeight: "320px" }}>
          <div className="px-5 py-4">
            <p className="text-white text-xs font-bold font-['Inter'] uppercase tracking-wider mb-3">
              {isAr ? "تفضيلات الإشعارات" : "Notification Preferences"}
            </p>

            {/* Quiet hours */}
            <div className="flex items-center justify-between mb-4 p-3 rounded-xl" style={{ background: "rgba(11,18,32,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <p className="text-white text-xs font-['Inter'] font-semibold">{isAr ? "ساعات الهدوء" : "Quiet Hours"}</p>
                <p className="text-gray-500 text-[10px] font-['JetBrains_Mono'] mt-0.5">{quietFrom} – {quietTo}</p>
              </div>
              <button
                onClick={() => setQuietHours(!quietHours)}
                className="relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0"
                style={{ background: quietHours ? "#D4A84B" : "rgba(255,255,255,0.1)" }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                  style={{ background: "#0B1220", left: quietHours ? "calc(100% - 18px)" : "2px" }}
                />
              </button>
            </div>

            {/* Channel grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left text-gray-600 font-['JetBrains_Mono'] pb-2 pr-4 font-normal uppercase tracking-wider text-[10px]">
                      {isAr ? "النوع" : "Type"}
                    </th>
                    {["in-app", "email", "sms"].map((ch) => (
                      <th key={ch} className="text-center text-gray-600 font-['JetBrains_Mono'] pb-2 px-2 font-normal uppercase tracking-wider text-[10px]">
                        {ch === "in-app" ? (isAr ? "داخل التطبيق" : "In-App") : ch === "email" ? (isAr ? "بريد" : "Email") : "SMS"}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(prefs).map(([type, channels]) => (
                    <tr key={type} className="border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                      <td className="py-2 pr-4 text-gray-400 font-['Inter'] whitespace-nowrap">{type}</td>
                      {["in-app", "email", "sms"].map((ch) => (
                        <td key={ch} className="py-2 px-2 text-center">
                          <button
                            onClick={() => togglePref(type, ch)}
                            className="w-5 h-5 rounded flex items-center justify-center mx-auto cursor-pointer transition-all"
                            style={{
                              background: channels[ch] ? "rgba(181,142,60,0.15)" : "rgba(255,255,255,0.04)",
                              border: channels[ch] ? "1px solid rgba(181,142,60,0.4)" : "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            {channels[ch] && <i className="ri-check-line text-gold-400 text-[10px]" />}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(181,142,60,0.15) transparent" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <i className="ri-inbox-line text-gray-700 text-3xl" />
            <p className="text-gray-600 text-sm font-['Inter']">{isAr ? "لا توجد إشعارات" : "No notifications"}</p>
          </div>
        ) : (
          <div>
            {filtered.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className="flex items-start gap-3 px-5 py-4 border-b cursor-pointer transition-all hover:bg-white/[0.02]"
                style={{
                  borderColor: "rgba(255,255,255,0.04)",
                  background: notif.read ? "transparent" : "rgba(181,142,60,0.02)",
                }}
              >
                {/* Unread dot */}
                <div className="flex-shrink-0 mt-1">
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full" style={{ background: notif.color, boxShadow: `0 0 6px ${notif.color}` }} />
                  )}
                  {notif.read && <div className="w-2 h-2" />}
                </div>

                {/* Icon */}
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: `${notif.color}15`, border: `1px solid ${notif.color}33` }}
                >
                  <i className={`${notif.icon} text-sm`} style={{ color: notif.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-['Inter'] font-semibold leading-snug ${notif.read ? "text-gray-400" : "text-white"}`}>
                      {isAr ? notif.titleAr : notif.title}
                    </p>
                    <span className="text-gray-600 text-[10px] font-['JetBrains_Mono'] flex-shrink-0 mt-0.5">{notif.time}</span>
                  </div>
                  <p className="text-gray-500 text-xs font-['Inter'] mt-0.5 leading-relaxed">
                    {isAr ? notif.detailAr : notif.detail}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {notif.ref && (
                      <span className="text-[10px] font-['JetBrains_Mono'] px-1.5 py-0.5 rounded" style={{ background: "rgba(181,142,60,0.08)", color: "#D4A84B" }}>
                        {notif.ref}
                      </span>
                    )}
                    {notif.actionable && (
                      <button
                        className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1"
                        style={{ background: `${notif.color}15`, color: notif.color, border: `1px solid ${notif.color}33` }}
                      >
                        <i className="ri-arrow-right-line text-[10px]" />
                        {isAr ? "اتخاذ إجراء" : "Take Action"}
                      </button>
                    )}
                    <span className="text-gray-700 text-[10px] font-['Inter'] capitalize">
                      {isAr ? categoryConfig[notif.category].labelAr : categoryConfig[notif.category].labelEn}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EntityNotifPanel;
