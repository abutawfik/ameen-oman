import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { entityNotifications, policeAlerts } from "@/mocks/notificationsData";
import BrandLogo from "@/brand/BrandLogo";
import { useBrandFonts } from "@/brand/typography";

interface Props {
  isAr: boolean;
  onToggleLang?: () => void;
  onToggleAr?: () => void;
  // Legacy props kept in the signature so existing layout callers don't break.
  // They are intentionally unused — the gov-operator chrome has no branch picker
  // or entity concept.
  entityType?: unknown;
  selectedBranch?: unknown;
  onBranchChange?: unknown;
}

// ── Path → module name map ─────────────────────────────────────────────────
// Derives the centre breadcrumb from window.location.pathname. Anything not
// mapped renders as an empty breadcrumb (nothing shown).
const MODULE_MAP: Record<string, { en: string; ar: string }> = {
  "/dashboard":                          { en: "Risk Engine \u00B7 Command Center", ar: "\u0645\u062D\u0631\u0651\u0643 \u0627\u0644\u0645\u062E\u0627\u0637\u0631 \u00B7 \u0645\u0631\u0643\u0632 \u0627\u0644\u0642\u064A\u0627\u062F\u0629" },
  "/dashboard/osint-risk-engine":        { en: "Risk Engine \u00B7 OSINT Module",   ar: "\u0645\u062D\u0631\u0651\u0643 \u0627\u0644\u0645\u062E\u0627\u0637\u0631 \u00B7 \u0648\u062D\u062F\u0629 OSINT" },
  "/dashboard/risk-assessment":          { en: "Risk Assessment",                   ar: "\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0645\u062E\u0627\u0637\u0631" },
  "/dashboard/watchlist":                { en: "Watchlist & Targets",               ar: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629 \u0648\u0627\u0644\u0623\u0647\u062F\u0627\u0641" },
  "/dashboard/case-management":          { en: "Case Management",                   ar: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0642\u0636\u0627\u064A\u0627" },
  "/dashboard/person-360":               { en: "Person 360\u00B0",                  ar: "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A 360\u00B0" },
  "/dashboard/notifications":            { en: "Notifications Center",              ar: "\u0645\u0631\u0643\u0632 \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A" },
  "/dashboard/system-admin":             { en: "System Administration",             ar: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0646\u0638\u0627\u0645" },
  "/dashboard/compliance-scorecard":     { en: "Compliance Scorecard",              ar: "\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0627\u0645\u062A\u062B\u0627\u0644" },
  "/dashboard/command-center":           { en: "Command Center",                    ar: "\u0645\u0631\u0643\u0632 \u0627\u0644\u0642\u064A\u0627\u062F\u0629" },
  "/dashboard/executive":                { en: "Executive Dashboard",               ar: "\u0644\u0648\u062D\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062A\u0646\u0641\u064A\u0630\u064A\u0629" },
  "/dashboard/reports":                  { en: "Reports",                           ar: "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631" },
  "/dashboard/batch-upload":             { en: "Batch Upload",                      ar: "\u0631\u0641\u0639 \u0645\u062C\u0645\u0651\u0639" },
  "/dashboard/manage-users":             { en: "Manage Users",                      ar: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646" },
  "/dashboard/help":                     { en: "Help & Support",                    ar: "\u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u0648\u0627\u0644\u062F\u0639\u0645" },
  "/dashboard/calendar":                 { en: "Calendar",                          ar: "\u0627\u0644\u062A\u0642\u0648\u064A\u0645" },
  "/dashboard/event-list":               { en: "Event List",                        ar: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0623\u062D\u062F\u0627\u062B" },
  "/dashboard/api-portal":               { en: "API Portal",                        ar: "\u0628\u0648\u0627\u0628\u0629 API" },
  "/dashboard/brand-identity":           { en: "Brand Identity",                    ar: "\u0627\u0644\u0647\u0648\u064A\u0629 \u0627\u0644\u0628\u0635\u0631\u064A\u0629" },
  "/dashboard/identity-fusion":          { en: "Identity Fusion",                   ar: "\u062F\u0645\u062C \u0627\u0644\u0647\u0648\u064A\u0627\u062A" },
  "/dashboard/link-analysis":            { en: "Link Analysis",                     ar: "\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0631\u0648\u0627\u0628\u0637" },
  "/dashboard/customs-cargo":            { en: "Customs & Cargo",                   ar: "\u0627\u0644\u062C\u0645\u0627\u0631\u0643 \u0648\u0627\u0644\u0634\u062D\u0646" },
  "/dashboard/national-security":        { en: "National Security",                 ar: "\u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0648\u0637\u0646\u064A" },
  "/dashboard/digital-dossier":          { en: "Digital Dossier",                   ar: "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0631\u0642\u0645\u064A" },
  "/dashboard/geoint":                   { en: "GEOINT",                            ar: "\u0627\u0644\u0627\u0633\u062A\u062E\u0628\u0627\u0631\u0627\u062A \u0627\u0644\u062C\u063A\u0631\u0627\u0641\u064A\u0629" },
  "/dashboard/threat-intel":             { en: "Threat Intelligence",               ar: "\u0627\u0633\u062A\u062E\u0628\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0647\u062F\u064A\u062F\u0627\u062A" },
  "/dashboard/pattern-engine":           { en: "Pattern Engine",                    ar: "\u0645\u062D\u0631\u0651\u0643 \u0627\u0644\u0623\u0646\u0645\u0627\u0637" },
  "/dashboard/predictive-analytics":     { en: "Predictive Analytics",              ar: "\u0627\u0644\u062A\u062D\u0644\u064A\u0644\u0627\u062A \u0627\u0644\u062A\u0646\u0628\u0624\u064A\u0629" },
  "/dashboard/border-intelligence":      { en: "Border Intelligence",               ar: "\u0627\u0633\u062A\u062E\u0628\u0627\u0631\u0627\u062A \u0627\u0644\u062D\u062F\u0648\u062F" },
  "/dashboard/transport-intelligence":   { en: "Transport Intelligence",            ar: "\u0627\u0633\u062A\u062E\u0628\u0627\u0631\u0627\u062A \u0627\u0644\u0646\u0642\u0644" },
  "/dashboard/employment-registry":      { en: "Employment Registry",               ar: "\u0633\u062C\u0644 \u0627\u0644\u062A\u0648\u0638\u064A\u0641" },
  "/dashboard/ecommerce-intelligence":   { en: "E-Commerce Intelligence",           ar: "\u0627\u0633\u062A\u062E\u0628\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u062C\u0627\u0631\u0629 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629" },
  "/dashboard/social-intelligence":      { en: "Social Intelligence",               ar: "\u0627\u0633\u062A\u062E\u0628\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0648\u0627\u0635\u0644" },
  "/dashboard/hotel-events":             { en: "Hotel Events",                      ar: "\u0623\u062D\u062F\u0627\u062B \u0627\u0644\u0641\u0646\u0627\u062F\u0642" },
  "/dashboard/car-rental-events":        { en: "Car Rental Events",                 ar: "\u0623\u062D\u062F\u0627\u062B \u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A" },
  "/dashboard/mobile-events":            { en: "Mobile Events",                     ar: "\u0623\u062D\u062F\u0627\u062B \u0627\u0644\u0627\u062A\u0635\u0627\u0644\u0627\u062A" },
  "/dashboard/municipality-events":      { en: "Municipality Events",               ar: "\u0623\u062D\u062F\u0627\u062B \u0627\u0644\u0628\u0644\u062F\u064A\u0627\u062A" },
  "/dashboard/financial-events":         { en: "Financial Events",                  ar: "\u0627\u0644\u0623\u062D\u062F\u0627\u062B \u0627\u0644\u0645\u0627\u0644\u064A\u0629" },
  "/dashboard/utility-events":           { en: "Utility Events",                    ar: "\u0623\u062D\u062F\u0627\u062B \u0627\u0644\u0645\u0631\u0627\u0641\u0642" },
  "/dashboard/healthcare-events":        { en: "Healthcare Events",                 ar: "\u0627\u0644\u0623\u062D\u062F\u0627\u062B \u0627\u0644\u0635\u062D\u064A\u0629" },
  "/dashboard/tourism-events":           { en: "Tourism Events",                    ar: "\u0623\u062D\u062F\u0627\u062B \u0627\u0644\u0633\u064A\u0627\u062D\u0629" },
  "/dashboard/marine-events":            { en: "Marine Events",                     ar: "\u0627\u0644\u0623\u062D\u062F\u0627\u062B \u0627\u0644\u0628\u062D\u0631\u064A\u0629" },
  "/dashboard/postal-events":            { en: "Postal Events",                     ar: "\u0623\u062D\u062F\u0627\u062B \u0627\u0644\u0628\u0631\u064A\u062F" },
  "/dashboard/education-events":         { en: "Education Events",                  ar: "\u0623\u062D\u062F\u0627\u062B \u0627\u0644\u062A\u0639\u0644\u064A\u0645" },
};

const DashboardTitleBar = ({ isAr, onToggleLang, onToggleAr }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fonts = useBrandFonts();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const handleToggleLang = onToggleLang || onToggleAr || (() => {});

  const unreadCount = entityNotifications.filter((n) => !n.read).length;
  const criticalCount = policeAlerts.filter((a) => a.priority === "critical" && !a.acknowledged).length;
  const totalBadge = unreadCount + (criticalCount > 0 ? criticalCount : 0);

  const notifications = entityNotifications.slice(0, 4);

  const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const moduleLabel = MODULE_MAP[location.pathname] ?? null;

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 flex-shrink-0 relative z-30"
      style={{
        height: 64,
        background: "rgba(5,20,40,0.9)",
        borderBottom: "1px solid rgba(184,138,60,0.15)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        position: "sticky",
        top: 0,
      }}
    >
      {/* LEFT — logo IS the identity */}
      <div className="flex items-center flex-shrink-0">
        <BrandLogo variant="horizontal" tone="light" size="md" isAr={isAr} />
      </div>

      {/* CENTER — active module breadcrumb (mono) */}
      <div className="hidden md:flex items-center justify-center flex-1 px-6 min-w-0">
        {moduleLabel && (
          <span
            className="truncate"
            style={{
              fontFamily: fonts.mono,
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              color: "#D6B47E",
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
            {isAr ? moduleLabel.ar : moduleLabel.en}
          </span>
        )}
      </div>

      {/* RIGHT — clock / lang pill / notifications / operator menu */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* 1. Live clock */}
        <div
          className="hidden lg:flex flex-col items-end px-3 py-1 rounded-md"
          style={{
            background: "rgba(184,138,60,0.04)",
            border: "1px solid rgba(184,138,60,0.12)",
          }}
        >
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#D6B47E",
              lineHeight: 1.1,
              letterSpacing: "0.04em",
            }}
          >
            {timeStr}
          </span>
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: "0.625rem",
              color: "#6B7280",
              lineHeight: 1.2,
              letterSpacing: "0.04em",
            }}
          >
            {dateStr}
          </span>
        </div>

        {/* 2. AR / EN ghost-gold pill */}
        <button
          type="button"
          onClick={handleToggleLang}
          className="flex items-center justify-center px-3 h-8 rounded-full cursor-pointer transition-colors"
          style={{
            background: "transparent",
            border: "1px solid rgba(184,138,60,0.35)",
            color: "#D6B47E",
            fontFamily: fonts.mono,
            fontSize: "0.6875rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(184,138,60,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {isAr ? "EN" : "AR"}
        </button>

        {/* 3. Notifications bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-colors"
            style={{ border: "1px solid rgba(184,138,60,0.3)", background: "transparent" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(184,138,60,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            aria-label={isAr ? "الإشعارات" : "Notifications"}
          >
            <i className="ri-notification-3-line text-lg" style={{ color: "#D6B47E" }} />
            {totalBadge > 0 && (
              <span
                className={`absolute -top-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold px-1 ${isAr ? "-left-1" : "-right-1"}`}
                style={{
                  background: criticalCount > 0 ? "#8A1F3C" : "#D6B47E",
                  color: "#051428",
                  fontFamily: fonts.mono,
                }}
              >
                {totalBadge}
              </span>
            )}
          </button>
          {notifOpen && (
            <div
              className={`absolute top-full mt-2 w-80 rounded-xl overflow-hidden z-50 ${isAr ? "left-0" : "right-0"}`}
              style={{
                background: "rgba(10,37,64,0.98)",
                border: "1px solid rgba(184,138,60,0.25)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(248,245,240,0.05)" }}
              >
                <p className="text-sm font-semibold" style={{ color: "#F8F5F0", fontFamily: fonts.sans }}>
                  {isAr ? "الإشعارات" : "Notifications"}
                </p>
                <button
                  type="button"
                  onClick={() => { setNotifOpen(false); navigate("/dashboard/notifications"); }}
                  className="text-xs cursor-pointer hover:underline"
                  style={{ color: "#D6B47E", fontFamily: fonts.mono }}
                >
                  {isAr ? "عرض الكل" : "View All"}
                </button>
              </div>
              {criticalCount > 0 && (
                <div
                  className="flex items-center gap-2 px-4 py-2.5 cursor-pointer"
                  style={{ background: "rgba(201,74,94,0.1)", borderBottom: "1px solid rgba(248,245,240,0.05)" }}
                  onClick={() => { setNotifOpen(false); navigate("/dashboard/notifications"); }}
                >
                  <div className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: "#8A1F3C" }} />
                  <span className="text-xs font-bold" style={{ color: "#C94A5E", fontFamily: fonts.mono }}>
                    {criticalCount} {isAr ? "تنبيه حرج" : "CRITICAL alerts"}
                  </span>
                  <i
                    className={`${isAr ? "ri-arrow-left-line" : "ri-arrow-right-line"} text-xs ms-auto`}
                    style={{ color: "#C94A5E" }}
                  />
                </div>
              )}
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer"
                  style={{
                    background: n.read ? "transparent" : "rgba(184,138,60,0.04)",
                    borderBottom: "1px solid rgba(248,245,240,0.05)",
                  }}
                >
                  <div
                    className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
                    style={{ background: `${n.color}15`, border: `1px solid ${n.color}33` }}
                  >
                    <i className={`${n.icon} text-xs`} style={{ color: n.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-semibold"
                      style={{ color: n.read ? "rgba(239,231,211,0.7)" : "#F8F5F0", fontFamily: fonts.sans }}
                    >
                      {isAr ? n.titleAr : n.title}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#6B7280", fontFamily: fonts.mono }}>
                      {n.time}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.color }} />
                  )}
                </div>
              ))}
              <div className="px-4 py-2.5" style={{ borderTop: "1px solid rgba(248,245,240,0.05)" }}>
                <button
                  type="button"
                  onClick={() => { setNotifOpen(false); navigate("/dashboard/notifications"); }}
                  className="w-full py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  style={{
                    background: "rgba(184,138,60,0.1)",
                    color: "#D6B47E",
                    border: "1px solid rgba(184,138,60,0.25)",
                    fontFamily: fonts.sans,
                  }}
                >
                  {isAr ? "فتح مركز الإشعارات" : "Open Notification Center"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Operator avatar + menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,245,240,0.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ background: "rgba(184,138,60,0.15)", border: "1px solid rgba(184,138,60,0.35)" }}
            >
              <span className="text-xs font-bold" style={{ color: "#D6B47E", fontFamily: fonts.sans }}>
                AA
              </span>
            </div>
            <i
              className={`ri-arrow-down-s-line text-xs hidden sm:block transition-transform ${userOpen ? "rotate-180" : ""}`}
              style={{ color: "#6B7280" }}
            />
          </button>
          {userOpen && (
            <div
              className={`absolute top-full mt-1 w-48 rounded-xl overflow-hidden z-50 ${isAr ? "left-0" : "right-0"}`}
              style={{
                background: "rgba(10,37,64,0.98)",
                border: "1px solid rgba(184,138,60,0.25)",
                backdropFilter: "blur(16px)",
              }}
            >
              {[
                { icon: "ri-user-line",     labelEn: "Profile",  labelAr: "الملف الشخصي" },
                { icon: "ri-settings-line", labelEn: "Settings", labelAr: "الإعدادات" },
                { icon: "ri-question-line", labelEn: "Help",     labelAr: "المساعدة" },
              ].map((item) => (
                <button
                  key={item.icon}
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
                  style={{ borderBottom: "1px solid rgba(248,245,240,0.05)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,245,240,0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <i className={`${item.icon} text-sm`} style={{ color: "rgba(239,231,211,0.7)" }} />
                  <span className="text-xs" style={{ color: "#EFE8D7", fontFamily: fonts.sans }}>
                    {isAr ? item.labelAr : item.labelEn}
                  </span>
                </button>
              ))}
              <a
                href="/login"
                className="w-full flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(201,74,94,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <i className="ri-logout-box-line text-sm" style={{ color: "#C94A5E" }} />
                <span className="text-xs" style={{ color: "#C94A5E", fontFamily: fonts.sans }}>
                  {isAr ? "تسجيل الخروج" : "Logout"}
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardTitleBar;
