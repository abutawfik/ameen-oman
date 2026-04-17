import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { branches, entityMeta, type EntityType } from "@/mocks/dashboardData";
import { entityNotifications, policeAlerts } from "@/mocks/notificationsData";

interface Props {
  entityType?: EntityType;
  isAr: boolean;
  onToggleLang?: () => void;
  onToggleAr?: () => void;
  selectedBranch?: string;
  onBranchChange?: (id: string) => void;
}

const DashboardTitleBar = ({ entityType, isAr, onToggleLang, onToggleAr, selectedBranch = "main", onBranchChange }: Props) => {
  const navigate = useNavigate();
  const [branchOpen, setBranchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const meta = entityType ? entityMeta[entityType] : null;
  const branch = branches.find((b) => b.id === selectedBranch) || branches[0];

  const handleToggleLang = onToggleLang || onToggleAr || (() => {});

  const unreadCount = entityNotifications.filter((n) => !n.read).length;
  const criticalCount = policeAlerts.filter((a) => a.priority === "critical" && !a.acknowledged).length;
  const totalBadge = unreadCount + (criticalCount > 0 ? criticalCount : 0);

  const notifications = entityNotifications.slice(0, 4);

  return (
    <header className="flex items-center justify-between px-4 md:px-6 h-16 border-b flex-shrink-0 relative z-30"
      style={{ background: "rgba(6,13,26,0.98)", borderColor: "rgba(34,211,238,0.15)", backdropFilter: "blur(12px)" }}>

      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <img src="https://public.readdy.ai/ai/img_res/407b94a6-cd23-46f2-9c3a-b1f5c8ba9a2c.png" alt="AMEEN" className="w-8 h-8 object-contain flex-shrink-0" />
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-cyan-400 font-black text-base tracking-widest font-['Inter']">AMEEN</span>
          <span className="text-cyan-400/60 text-xs font-['Cairo']">أمين</span>
        </div>
        <div className="hidden md:block w-px h-6 bg-white/10 mx-2" />
        {meta && (
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.15)" }}>
            <i className={`${meta.icon} text-xs`} style={{ color: meta.color }} />
            <span className="text-gray-400 text-xs font-['Inter'] max-w-[140px] truncate">{isAr ? meta.categoryAr : meta.category}</span>
          </div>
        )}
      </div>

      {/* Center: Entity + Branch */}
      <div className="flex items-center gap-3">
        {meta && (
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-white text-sm font-semibold font-['Inter'] truncate max-w-[160px]">{isAr ? meta.nameAr : meta.name}</span>
            <span className="text-gray-600 text-xs font-['JetBrains_Mono']">AMN-ENT-{(entityType || "").toUpperCase().slice(0,3)}-00482</span>
          </div>
        )}

        {/* Branch dropdown */}
        <div className="relative">
          <button onClick={() => { setBranchOpen(!branchOpen); setNotifOpen(false); setUserOpen(false); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors hover:border-cyan-500/40 whitespace-nowrap"
            style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(255,255,255,0.1)" }}>
            <i className="ri-map-pin-line text-cyan-400 text-xs" />
            <span className="text-gray-300 text-xs font-['Inter'] max-w-[120px] truncate">{isAr ? branch.nameAr : branch.name}</span>
            <i className={`ri-arrow-down-s-line text-gray-500 text-xs transition-transform ${branchOpen ? "rotate-180" : ""}`} />
          </button>
          {branchOpen && (
            <div className={`absolute top-full mt-1 w-56 rounded-xl border overflow-hidden z-50 ${isAr ? "left-0" : "right-0"}`}
              style={{ background: "rgba(10,22,40,0.98)", borderColor: "rgba(34,211,238,0.2)", backdropFilter: "blur(16px)" }}>
              {branches.map((b) => (
                <button key={b.id} onClick={() => { onBranchChange?.(b.id); setBranchOpen(false); }}
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
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Lang toggle */}
        <button onClick={handleToggleLang}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/10 transition-colors cursor-pointer font-['JetBrains_Mono']">
          {isAr ? "EN" : "AR"}
        </button>

        {/* Notifications bell */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setBranchOpen(false); setUserOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-cyan-500/10 transition-colors cursor-pointer"
            style={{ border: "1px solid rgba(34,211,238,0.25)" }}
          >
            <i className="ri-notification-3-line text-cyan-400 text-lg" />
            {totalBadge > 0 && (
              <span
                className={`absolute -top-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold font-['JetBrains_Mono'] px-1 ${isAr ? "-left-1" : "-right-1"}`}
                style={{ background: criticalCount > 0 ? "#F87171" : "#22D3EE", color: "#060D1A" }}
              >
                {totalBadge}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className={`absolute top-full mt-2 w-80 rounded-xl border overflow-hidden z-50 ${isAr ? "left-0" : "right-0"}`}
              style={{ background: "rgba(10,22,40,0.98)", borderColor: "rgba(34,211,238,0.2)", backdropFilter: "blur(16px)" }}>
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <p className="text-white text-sm font-semibold font-['Inter']">{isAr ? "الإشعارات" : "Notifications"}</p>
                <button
                  onClick={() => { setNotifOpen(false); navigate("/dashboard/notifications"); }}
                  className="text-cyan-400 text-xs font-['JetBrains_Mono'] cursor-pointer hover:underline"
                >
                  {isAr ? "عرض الكل" : "View All"}
                </button>
              </div>
              {criticalCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 cursor-pointer" style={{ background: "rgba(248,113,113,0.06)" }}
                  onClick={() => { setNotifOpen(false); navigate("/dashboard/notifications"); }}>
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
                  <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">
                    {criticalCount} {isAr ? "تنبيه حرج في مركز الشرطة" : "CRITICAL alerts in Police Center"}
                  </span>
                  <i className={`${isAr ? "ri-arrow-left-line" : "ri-arrow-right-line"} text-red-400 text-xs ms-auto`} />
                </div>
              )}
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] border-b border-white/5 last:border-0 cursor-pointer"
                  style={{ background: n.read ? "transparent" : "rgba(34,211,238,0.02)" }}>
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5" style={{ background: `${n.color}15`, border: `1px solid ${n.color}33` }}>
                    <i className={`${n.icon} text-xs`} style={{ color: n.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-['Inter'] font-semibold ${n.read ? "text-gray-400" : "text-white"}`}>{isAr ? n.titleAr : n.title}</p>
                    <p className="text-gray-600 text-[10px] mt-0.5 font-['JetBrains_Mono']">{n.time}</p>
                  </div>
                  {!n.read && <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.color }} />}
                </div>
              ))}
              <div className="px-4 py-2.5 border-t border-white/5">
                <button
                  onClick={() => { setNotifOpen(false); navigate("/dashboard/notifications"); }}
                  className="w-full py-2 rounded-lg text-xs font-['Inter'] font-semibold cursor-pointer transition-colors"
                  style={{ background: "rgba(34,211,238,0.08)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}
                >
                  {isAr ? "فتح مركز الإشعارات" : "Open Notification Center"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button onClick={() => { setUserOpen(!userOpen); setBranchOpen(false); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-400/15 border border-cyan-400/30">
              <span className="text-cyan-400 text-xs font-bold font-['Inter']">AA</span>
            </div>
            <i className={`ri-arrow-down-s-line text-gray-500 text-xs hidden sm:block transition-transform ${userOpen ? "rotate-180" : ""}`} />
          </button>
          {userOpen && (
            <div className={`absolute top-full mt-1 w-48 rounded-xl border overflow-hidden z-50 ${isAr ? "left-0" : "right-0"}`}
              style={{ background: "rgba(10,22,40,0.98)", borderColor: "rgba(34,211,238,0.2)", backdropFilter: "blur(16px)" }}>
              {[
                { icon: "ri-user-line", labelEn: "Profile", labelAr: "الملف الشخصي" },
                { icon: "ri-settings-line", labelEn: "Settings", labelAr: "الإعدادات" },
                { icon: "ri-question-line", labelEn: "Help", labelAr: "المساعدة" },
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
  );
};

export default DashboardTitleBar;
