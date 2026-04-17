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
      style={{ background: "rgba(11,18,32,0.98)", borderColor: "rgba(181,142,60,0.18)", backdropFilter: "blur(12px)" }}>

      {/* Left: Logo — brand lockup (mono-light mark + wordmark on dark shell) */}
      <div className="flex items-center gap-3">
        <img
          src="/brand/al-ameen-mark-mono-light.svg"
          alt="Al-Ameen"
          className="w-9 h-9 object-contain flex-shrink-0"
        />
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-ivory-100 font-semibold text-base tracking-widest font-display">AL&#8209;AMEEN</span>
          <span className="text-gold-400/70 text-xs font-arabic">الأمين</span>
        </div>
        <div className="hidden md:block w-px h-6 bg-ivory-100/10 mx-2" />
        {meta && (
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: "rgba(181,142,60,0.08)", border: "1px solid rgba(181,142,60,0.22)" }}>
            <i className={`${meta.icon} text-xs`} style={{ color: meta.color }} />
            <span className="text-ivory-200/80 text-xs font-['Inter'] max-w-[140px] truncate">{isAr ? meta.categoryAr : meta.category}</span>
          </div>
        )}
      </div>

      {/* Center: Entity + Branch */}
      <div className="flex items-center gap-3">
        {meta && (
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-ivory-100 text-sm font-semibold font-['Inter'] truncate max-w-[160px]">{isAr ? meta.nameAr : meta.name}</span>
            <span className="text-midnight-300 text-xs font-mono">AMN-ENT-{(entityType || "").toUpperCase().slice(0,3)}-00482</span>
          </div>
        )}

        {/* Branch dropdown */}
        <div className="relative">
          <button onClick={() => { setBranchOpen(!branchOpen); setNotifOpen(false); setUserOpen(false); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors hover:border-gold-500/40 whitespace-nowrap"
            style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(255,255,255,0.1)" }}>
            <i className="ri-map-pin-line text-gold-400 text-xs" />
            <span className="text-ivory-200 text-xs font-['Inter'] max-w-[120px] truncate">{isAr ? branch.nameAr : branch.name}</span>
            <i className={`ri-arrow-down-s-line text-midnight-300 text-xs transition-transform ${branchOpen ? "rotate-180" : ""}`} />
          </button>
          {branchOpen && (
            <div className={`absolute top-full mt-1 w-56 rounded-xl border overflow-hidden z-50 ${isAr ? "left-0" : "right-0"}`}
              style={{ background: "rgba(20,29,46,0.98)", borderColor: "rgba(181,142,60,0.25)", backdropFilter: "blur(16px)" }}>
              {branches.map((b) => (
                <button key={b.id} onClick={() => { onBranchChange?.(b.id); setBranchOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gold-500/5 transition-colors cursor-pointer text-left border-b border-ivory-100/5 last:border-0"
                  style={{ background: selectedBranch === b.id ? "rgba(181,142,60,0.08)" : "transparent" }}>
                  <i className="ri-map-pin-line text-gold-400/70 text-xs" />
                  <div>
                    <p className="text-ivory-100 text-xs font-semibold font-['Inter']">{isAr ? b.nameAr : b.name}</p>
                    <p className="text-midnight-300 text-xs font-['Inter']">{b.location}</p>
                  </div>
                  {selectedBranch === b.id && <i className="ri-check-line text-gold-400 text-xs ml-auto" />}
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
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gold-500/35 text-gold-400 text-xs font-bold hover:bg-gold-500/10 transition-colors cursor-pointer font-mono">
          {isAr ? "EN" : "AR"}
        </button>

        {/* Notifications bell */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setBranchOpen(false); setUserOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gold-500/10 transition-colors cursor-pointer"
            style={{ border: "1px solid rgba(181,142,60,0.3)" }}
          >
            <i className="ri-notification-3-line text-gold-400 text-lg" />
            {totalBadge > 0 && (
              <span
                className={`absolute -top-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold font-mono px-1 ${isAr ? "-left-1" : "-right-1"}`}
                style={{ background: criticalCount > 0 ? "#9A1F24" : "#D4A84B", color: "#0B1220" }}
              >
                {totalBadge}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className={`absolute top-full mt-2 w-80 rounded-xl border overflow-hidden z-50 ${isAr ? "left-0" : "right-0"}`}
              style={{ background: "rgba(20,29,46,0.98)", borderColor: "rgba(181,142,60,0.25)", backdropFilter: "blur(16px)" }}>
              <div className="px-4 py-3 border-b border-ivory-100/5 flex items-center justify-between">
                <p className="text-ivory-100 text-sm font-semibold font-['Inter']">{isAr ? "الإشعارات" : "Notifications"}</p>
                <button
                  onClick={() => { setNotifOpen(false); navigate("/dashboard/notifications"); }}
                  className="text-gold-400 text-xs font-mono cursor-pointer hover:underline"
                >
                  {isAr ? "عرض الكل" : "View All"}
                </button>
              </div>
              {criticalCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-ivory-100/5 cursor-pointer" style={{ background: "rgba(154,31,36,0.1)" }}
                  onClick={() => { setNotifOpen(false); navigate("/dashboard/notifications"); }}>
                  <div className="w-2 h-2 rounded-full bg-oman-500 animate-pulse flex-shrink-0" />
                  <span className="text-oman-400 text-xs font-bold font-mono">
                    {criticalCount} {isAr ? "تنبيه حرج في مركز الشرطة" : "CRITICAL alerts in Police Center"}
                  </span>
                  <i className={`${isAr ? "ri-arrow-left-line" : "ri-arrow-right-line"} text-oman-400 text-xs ms-auto`} />
                </div>
              )}
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-ivory-100/[0.02] border-b border-ivory-100/5 last:border-0 cursor-pointer"
                  style={{ background: n.read ? "transparent" : "rgba(181,142,60,0.04)" }}>
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5" style={{ background: `${n.color}15`, border: `1px solid ${n.color}33` }}>
                    <i className={`${n.icon} text-xs`} style={{ color: n.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-['Inter'] font-semibold ${n.read ? "text-ivory-200/70" : "text-ivory-100"}`}>{isAr ? n.titleAr : n.title}</p>
                    <p className="text-midnight-300 text-[10px] mt-0.5 font-mono">{n.time}</p>
                  </div>
                  {!n.read && <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.color }} />}
                </div>
              ))}
              <div className="px-4 py-2.5 border-t border-ivory-100/5">
                <button
                  onClick={() => { setNotifOpen(false); navigate("/dashboard/notifications"); }}
                  className="w-full py-2 rounded-lg text-xs font-['Inter'] font-semibold cursor-pointer transition-colors"
                  style={{ background: "rgba(181,142,60,0.1)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.25)" }}
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
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-ivory-100/5 transition-colors cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gold-500/15 border border-gold-500/35">
              <span className="text-gold-400 text-xs font-bold font-['Inter']">AA</span>
            </div>
            <i className={`ri-arrow-down-s-line text-midnight-300 text-xs hidden sm:block transition-transform ${userOpen ? "rotate-180" : ""}`} />
          </button>
          {userOpen && (
            <div className={`absolute top-full mt-1 w-48 rounded-xl border overflow-hidden z-50 ${isAr ? "left-0" : "right-0"}`}
              style={{ background: "rgba(20,29,46,0.98)", borderColor: "rgba(181,142,60,0.25)", backdropFilter: "blur(16px)" }}>
              {[
                { icon: "ri-user-line", labelEn: "Profile", labelAr: "الملف الشخصي" },
                { icon: "ri-settings-line", labelEn: "Settings", labelAr: "الإعدادات" },
                { icon: "ri-question-line", labelEn: "Help", labelAr: "المساعدة" },
              ].map((item) => (
                <button key={item.icon} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-ivory-100/5 transition-colors cursor-pointer border-b border-ivory-100/5 last:border-0">
                  <i className={`${item.icon} text-ivory-200/70 text-sm`} />
                  <span className="text-ivory-200 text-xs font-['Inter']">{isAr ? item.labelAr : item.labelEn}</span>
                </button>
              ))}
              <a href="/login" className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-oman-500/10 transition-colors cursor-pointer">
                <i className="ri-logout-box-line text-oman-400 text-sm" />
                <span className="text-oman-400 text-xs font-['Inter']">{isAr ? "تسجيل الخروج" : "Logout"}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardTitleBar;
