import { useState } from "react";

interface Props { isAr: boolean; }

interface User {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  module: string;
  moduleAr: string;
  joined: string;
}

const USERS: User[] = [
  { id: "u1", name: "Ahmed Al-Rashidi",    nameAr: "أحمد الراشدي",    email: "a.rashidi@police.gov",    role: "admin",    status: "active",    lastLogin: "2026-04-05 09:14", module: "All Modules",        moduleAr: "جميع الوحدات",       joined: "2024-01-15" },
  { id: "u2", name: "Fatima Al-Zadjali",   nameAr: "فاطمة الزدجالية", email: "f.zadjali@police.gov",    role: "operator", status: "active",    lastLogin: "2026-04-05 08:32", module: "Hotel, Car Rental",  moduleAr: "فنادق، تأجير سيارات",joined: "2024-03-20" },
  { id: "u3", name: "Mohammed Al-Balushi", nameAr: "محمد البلوشي",    email: "m.balushi@police.gov",    role: "operator", status: "active",    lastLogin: "2026-04-04 17:45", module: "Mobile, Financial",  moduleAr: "اتصالات، مالية",     joined: "2024-02-10" },
  { id: "u4", name: "Khalid Al-Amri",      nameAr: "خالد العامري",    email: "k.amri@police.gov",       role: "viewer",   status: "active",    lastLogin: "2026-04-05 07:20", module: "Border Intelligence",moduleAr: "استخبارات الحدود",   joined: "2024-06-01" },
  { id: "u5", name: "Layla Al-Hinai",      nameAr: "ليلى الهنائية",   email: "l.hinai@police.gov",      role: "operator", status: "inactive",  lastLogin: "2026-03-28 14:00", module: "Employment, Utility",moduleAr: "توظيف، مرافق",       joined: "2024-04-15" },
  { id: "u6", name: "Omar Al-Farsi",       nameAr: "عمر الفارسي",     email: "o.farsi@police.gov",      role: "viewer",   status: "active",    lastLogin: "2026-04-05 10:05", module: "Transport Intel",    moduleAr: "استخبارات النقل",    joined: "2024-07-22" },
  { id: "u7", name: "Nadia Al-Rashidi",    nameAr: "نادية الراشدية",  email: "n.rashidi@police.gov",    role: "admin",    status: "active",    lastLogin: "2026-04-05 09:50", module: "All Modules",        moduleAr: "جميع الوحدات",       joined: "2023-11-05" },
  { id: "u8", name: "Hamad Al-Zadjali",    nameAr: "حمد الزدجالي",    email: "h.zadjali@police.gov",    role: "operator", status: "suspended", lastLogin: "2026-03-15 11:30", module: "E-Commerce, Social", moduleAr: "تجارة، تواصل",       joined: "2024-08-10" },
];

const ROLE_CONFIG = {
  admin:    { label: "Admin",    labelAr: "مسؤول",   color: "#F87171", bg: "rgba(248,113,113,0.1)",  border: "rgba(248,113,113,0.25)" },
  operator: { label: "Operator", labelAr: "مشغّل",   color: "#D4A84B", bg: "rgba(181,142,60,0.1)",   border: "rgba(181,142,60,0.25)" },
  viewer:   { label: "Viewer",   labelAr: "مشاهد",   color: "#9CA3AF", bg: "rgba(156,163,175,0.1)",  border: "rgba(156,163,175,0.25)" },
};

const STATUS_CONFIG = {
  active:    { label: "Active",    labelAr: "نشط",     color: "#4ADE80" },
  inactive:  { label: "Inactive",  labelAr: "غير نشط", color: "#9CA3AF" },
  suspended: { label: "Suspended", labelAr: "موقوف",   color: "#F87171" },
};

const ManageUsers = ({ isAr }: Props) => {
  const [users, setUsers] = useState(USERS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState("all");
  const [search, setSearch] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "viewer" as User["role"], module: "All Modules" });

  const filtered = users.filter((u) => {
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    const user: User = {
      id: `u${Date.now()}`,
      name: newUser.name,
      nameAr: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "active",
      lastLogin: "Never",
      module: newUser.module,
      moduleAr: newUser.module,
      joined: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [...prev, user]);
    setShowAddForm(false);
    setNewUser({ name: "", email: "", role: "viewer", module: "All Modules" });
  };

  const toggleStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: isAr ? "إجمالي المستخدمين" : "Total Users", value: users.length, color: "#D4A84B" },
          { label: isAr ? "نشط" : "Active", value: users.filter((u) => u.status === "active").length, color: "#4ADE80" },
          { label: isAr ? "موقوف" : "Suspended", value: users.filter((u) => u.status === "suspended").length, color: "#F87171" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-4 flex items-center gap-3"
            style={{ background: "rgba(20,29,46,0.8)", borderColor: `${s.color}20`, backdropFilter: "blur(12px)" }}>
            <span className="text-3xl font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</span>
            <span className="text-gray-400 text-xs">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter + Add */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm cursor-pointer outline-none"
          style={{ background: "rgba(11,18,32,0.8)", borderColor: "rgba(181,142,60,0.15)", color: "#D1D5DB", minWidth: "130px" }}>
          <option value="all">{isAr ? "كل الأدوار" : "All Roles"}</option>
          <option value="admin">{isAr ? "مسؤول" : "Admin"}</option>
          <option value="operator">{isAr ? "مشغّل" : "Operator"}</option>
          <option value="viewer">{isAr ? "مشاهد" : "Viewer"}</option>
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? "بحث عن مستخدم..." : "Search users..."}
            className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none"
            style={{ background: "rgba(11,18,32,0.8)", borderColor: "rgba(181,142,60,0.15)", color: "#D1D5DB" }} />
        </div>
        <button type="button" onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap"
          style={{ background: "#D4A84B", color: "#0B1220" }}>
          <i className="ri-user-add-line text-sm" />
          {isAr ? "إضافة مستخدم" : "Add User"}
        </button>
      </div>

      {/* Add user form */}
      {showAddForm && (
        <div className="rounded-2xl border p-5"
          style={{ background: "rgba(11,18,32,0.95)", borderColor: "rgba(181,142,60,0.2)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm">{isAr ? "إضافة مستخدم جديد" : "Add New User"}</h3>
            <button type="button" onClick={() => setShowAddForm(false)}
              className="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer text-gray-500 hover:text-white"
              style={{ background: "rgba(255,255,255,0.05)" }}>
              <i className="ri-close-line text-xs" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[
              { key: "name", label: isAr ? "الاسم الكامل" : "Full Name", type: "text", placeholder: isAr ? "أدخل الاسم" : "Enter name" },
              { key: "email", label: isAr ? "البريد الإلكتروني" : "Email", type: "email", placeholder: "user@police.gov" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider block mb-1">{field.label}</label>
                <input type={field.type} value={newUser[field.key as "name" | "email"]}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-gold-400 transition-colors"
                  style={{ background: "rgba(11,18,32,0.8)", borderColor: "rgba(181,142,60,0.15)", color: "#D1D5DB" }} />
              </div>
            ))}
            <div>
              <label className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider block mb-1">{isAr ? "الدور" : "Role"}</label>
              <select value={newUser.role} onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value as User["role"] }))}
                className="w-full px-3 py-2 rounded-lg border text-sm cursor-pointer outline-none"
                style={{ background: "rgba(11,18,32,0.8)", borderColor: "rgba(181,142,60,0.15)", color: "#D1D5DB" }}>
                <option value="admin">{isAr ? "مسؤول" : "Admin"}</option>
                <option value="operator">{isAr ? "مشغّل" : "Operator"}</option>
                <option value="viewer">{isAr ? "مشاهد" : "Viewer"}</option>
              </select>
            </div>
            <div>
              <label className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider block mb-1">{isAr ? "الوحدة" : "Module Access"}</label>
              <select value={newUser.module} onChange={(e) => setNewUser((prev) => ({ ...prev, module: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm cursor-pointer outline-none"
                style={{ background: "rgba(11,18,32,0.8)", borderColor: "rgba(181,142,60,0.15)", color: "#D1D5DB" }}>
                <option>All Modules</option>
                <option>Hotel, Car Rental</option>
                <option>Mobile, Financial</option>
                <option>Border Intelligence</option>
                <option>Employment, Utility</option>
                <option>Transport Intel</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={handleAddUser}
              className="px-5 py-2 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap"
              style={{ background: "#D4A84B", color: "#0B1220" }}>
              {isAr ? "إضافة" : "Add User"}
            </button>
            <button type="button" onClick={() => setShowAddForm(false)}
              className="px-5 py-2 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap"
              style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
              {isAr ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </div>
      )}

      {/* Users table */}
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr style={{ background: "rgba(181,142,60,0.05)", borderBottom: "1px solid rgba(181,142,60,0.1)" }}>
                {[
                  isAr ? "المستخدم" : "User",
                  isAr ? "الدور" : "Role",
                  isAr ? "الحالة" : "Status",
                  isAr ? "الوحدة" : "Module Access",
                  isAr ? "آخر دخول" : "Last Login",
                  isAr ? "تاريخ الانضمام" : "Joined",
                  isAr ? "إجراءات" : "Actions",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, idx) => {
                const roleCfg = ROLE_CONFIG[user.role];
                const statusCfg = STATUS_CONFIG[user.status];
                return (
                  <tr key={user.id} className="border-b transition-colors"
                    style={{ background: idx % 2 === 0 ? "rgba(20,29,46,0.6)" : "rgba(11,18,32,0.4)", borderColor: "rgba(181,142,60,0.05)" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
                          style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
                          <span className="text-gold-400 text-xs font-bold">{user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span>
                        </div>
                        <div>
                          <div className="text-white text-xs font-semibold">{isAr ? user.nameAr : user.name}</div>
                          <div className="text-gray-500 text-xs">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: roleCfg.bg, color: roleCfg.color, border: `1px solid ${roleCfg.border}` }}>
                        {isAr ? roleCfg.labelAr : roleCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusCfg.color }} />
                        <span className="text-xs" style={{ color: statusCfg.color }}>
                          {isAr ? statusCfg.labelAr : statusCfg.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-400 text-xs">{isAr ? user.moduleAr : user.module}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{user.lastLogin}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{user.joined}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setEditUser(user)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-colors"
                          style={{ background: "rgba(181,142,60,0.08)", color: "#D4A84B" }}
                          title={isAr ? "تعديل" : "Edit"}>
                          <i className="ri-edit-line text-xs" />
                        </button>
                        <button type="button" onClick={() => toggleStatus(user.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-colors"
                          style={{ background: user.status === "active" ? "rgba(248,113,113,0.08)" : "rgba(74,222,128,0.08)", color: user.status === "active" ? "#F87171" : "#4ADE80" }}
                          title={user.status === "active" ? (isAr ? "تعطيل" : "Deactivate") : (isAr ? "تفعيل" : "Activate")}>
                          <i className={`${user.status === "active" ? "ri-user-unfollow-line" : "ri-user-follow-line"} text-xs`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(11,18,32,0.85)", backdropFilter: "blur(8px)" }}>
          <div className="rounded-2xl border p-6 w-full max-w-md mx-4"
            style={{ background: "rgba(20,29,46,0.98)", borderColor: "rgba(181,142,60,0.25)", backdropFilter: "blur(20px)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold">{isAr ? "تعديل المستخدم" : "Edit User"}</h3>
              <button type="button" onClick={() => setEditUser(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer text-gray-500 hover:text-white"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <i className="ri-close-line text-sm" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider block mb-1">{isAr ? "الاسم" : "Name"}</label>
                <input type="text" defaultValue={editUser.name}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-gold-400"
                  style={{ background: "rgba(11,18,32,0.8)", borderColor: "rgba(181,142,60,0.15)", color: "#D1D5DB" }} />
              </div>
              <div>
                <label className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider block mb-1">{isAr ? "الدور" : "Role"}</label>
                <select defaultValue={editUser.role}
                  className="w-full px-3 py-2 rounded-lg border text-sm cursor-pointer outline-none"
                  style={{ background: "rgba(11,18,32,0.8)", borderColor: "rgba(181,142,60,0.15)", color: "#D1D5DB" }}>
                  <option value="admin">{isAr ? "مسؤول" : "Admin"}</option>
                  <option value="operator">{isAr ? "مشغّل" : "Operator"}</option>
                  <option value="viewer">{isAr ? "مشاهد" : "Viewer"}</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <button type="button" onClick={() => setEditUser(null)}
                className="px-5 py-2 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap"
                style={{ background: "#D4A84B", color: "#0B1220" }}>
                {isAr ? "حفظ" : "Save Changes"}
              </button>
              <button type="button" onClick={() => setEditUser(null)}
                className="px-5 py-2 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap"
                style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
                {isAr ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
