export type Role = "analyst" | "supervisor" | "manager";

interface Props {
  value: Role;
  onChange: (r: Role) => void;
  isAr: boolean;
}

const ROLES: { id: Role; icon: string; labelEn: string; labelAr: string; color: string }[] = [
  // Active-pill hues: gold (primary role highlight), frankincense, olive —
  // all from the Al-Ameen brand palette.
  { id: "analyst",    icon: "ri-user-search-line",  labelEn: "Data Analyst", labelAr: "محلل بيانات", color: "#D6B47E" }, // gold-400
  { id: "supervisor", icon: "ri-user-star-line",    labelEn: "Supervisor",    labelAr: "مشرف",        color: "#B88A3C" }, // gold-600 (frankincense)
  { id: "manager",    icon: "ri-dashboard-3-line",  labelEn: "Manager",       labelAr: "مدير",         color: "#4A8E3A" }, // olive
];

// Top-right pill toggle that picks which home dashboard we render.
// Persisted by the parent (page.tsx) under localStorage key ameen:homeRole.
const RoleSwitcher = ({ value, onChange, isAr }: Props) => {
  return (
    <div
      className="flex items-center gap-1 p-1 rounded-xl"
      style={{
        background: "rgba(10,37,64,0.8)",
        border: "1px solid rgba(184,138,60,0.15)",
      }}
    >
      {ROLES.map((r) => {
        const active = value === r.id;
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onChange(r.id)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all font-['Inter']"
            style={{
              background: active ? `${r.color}18` : "transparent",
              color: active ? r.color : "#9CA3AF",
              border: active ? `1px solid ${r.color}55` : "1px solid transparent",
            }}
          >
            <i className={r.icon} />
            <span>{isAr ? r.labelAr : r.labelEn}</span>
          </button>
        );
      })}
    </div>
  );
};

export default RoleSwitcher;
