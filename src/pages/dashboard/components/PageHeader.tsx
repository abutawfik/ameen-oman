import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Crumb {
  label: string;
  route?: string;
  onClick?: () => void;
}

interface Props {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];      // breadcrumbs — omit for top-level pages
  badge?: string;        // e.g. "RESTRICTED"
  badgeColor?: string;
  action?: ReactNode;    // primary action button slot (right side)
  icon?: string;         // remixicon class e.g. "ri-radar-line"
  iconColor?: string;
  isAr?: boolean;
}

/**
 * Standard 44px page header used across all /dashboard/* pages.
 *
 * Layout: [icon?] [breadcrumbs →] Title  [badge?]  [action slot]
 *
 * Apply to every page that has its own full-page route. Pages that embed a
 * list + detail pane (Case Management, Target Match) use this for the outer
 * chrome; the split pane has its own lighter sub-header per panel.
 */
const PageHeader = ({
  title,
  subtitle,
  crumbs,
  badge,
  badgeColor = "#C98A1B",
  action,
  icon,
  iconColor = "#C5A365",
  isAr = false,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div
      className="sticky top-0 z-30 flex items-center gap-3 px-5 border-b"
      style={{
        height: 52,
        background: "rgba(8,28,50,0.92)",
        borderColor: "rgba(184,138,60,0.1)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Icon */}
      {icon && (
        <div
          className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
          style={{ background: `${iconColor}14`, border: `1px solid ${iconColor}30` }}
        >
          <i className={`${icon} text-sm`} style={{ color: iconColor }} />
        </div>
      )}

      {/* Breadcrumbs + title */}
      <div className="flex-1 min-w-0 flex items-center gap-1.5">
        {crumbs?.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5 flex-shrink-0">
            {crumb.route || crumb.onClick ? (
              <button
                type="button"
                onClick={() => crumb.onClick ? crumb.onClick() : navigate(crumb.route!)}
                className="text-[11px] font-['JetBrains_Mono'] text-gray-500 hover:text-gray-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                {crumb.label}
              </button>
            ) : (
              <span className="text-[11px] font-['JetBrains_Mono'] text-gray-600 whitespace-nowrap">
                {crumb.label}
              </span>
            )}
            <i className="ri-arrow-right-s-line text-gray-700 text-[11px]" aria-hidden="true" />
          </span>
        ))}
        <h1
          className="text-white font-bold truncate"
          style={{ fontSize: "14px", fontFamily: "'Manrope', sans-serif" }}
        >
          {title}
        </h1>
        {subtitle && (
          <span
            className="text-gray-500 text-[11px] font-['JetBrains_Mono'] whitespace-nowrap hidden sm:inline"
          >
            · {subtitle}
          </span>
        )}
      </div>

      {/* Badge */}
      {badge && (
        <span
          className="flex-shrink-0 px-2 py-0.5 rounded text-[9px] font-black tracking-[0.15em] font-['JetBrains_Mono']"
          style={{
            background: `${badgeColor}18`,
            color: badgeColor,
            border: `1px solid ${badgeColor}40`,
          }}
        >
          {badge}
        </span>
      )}

      {/* Action slot */}
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
