import { useState } from "react";

interface CustomsBrokerRegistryProps {
  isAr: boolean;
}

const brokers = [
  {
    id: "CB-2024-0012",
    name: "Al-Rashidi Customs Clearance LLC",
    nameAr: "شركة الراشدي للتخليص الجمركي",
    license: "LIC-CUS-2019-0045",
    licenseExpiry: "2026-12-31",
    status: "active",
    complianceScore: 94,
    declarations: 2341,
    declarationsThisMonth: 187,
    violations: 1,
    suspended: false,
    suspensionReason: null,
    specializations: ["Import", "Export", "Free Zone"],
    ports: ["Muscat Airport", "Port Sultan Qaboos"],
    contact: "+968 2456 7890",
    email: "ops@alrashidi-customs.om",
    lastDeclaration: "2026-04-06 09:14",
    riskLevel: "low",
    complianceHistory: [92, 93, 91, 94, 95, 94],
  },
  {
    id: "CB-2024-0019",
    name: "Gulf Trade Brokers Co.",
    nameAr: "شركة وسطاء التجارة الخليجية",
    license: "LIC-CUS-2020-0078",
    licenseExpiry: "2026-06-30",
    status: "active",
    complianceScore: 87,
    declarations: 1892,
    declarationsThisMonth: 134,
    violations: 3,
    suspended: false,
    suspensionReason: null,
    specializations: ["Import", "Transit"],
    ports: ["Salalah Port", "Sohar Port"],
    contact: "+968 2456 1234",
    email: "info@gulftrade-brokers.om",
    lastDeclaration: "2026-04-06 08:45",
    riskLevel: "medium",
    complianceHistory: [88, 85, 87, 86, 88, 87],
  },
  {
    id: "CB-2024-0031",
    name: "Oman Express Clearance",
    nameAr: "عُمان إكسبريس للتخليص",
    license: "LIC-CUS-2018-0023",
    licenseExpiry: "2025-09-30",
    status: "warning",
    complianceScore: 61,
    declarations: 3456,
    declarationsThisMonth: 89,
    violations: 12,
    suspended: false,
    suspensionReason: null,
    specializations: ["Import", "Export", "Personal Effects"],
    ports: ["Muscat Airport", "Khasab Port"],
    contact: "+968 2456 5678",
    email: "ops@omanexpress.om",
    lastDeclaration: "2026-04-05 16:22",
    riskLevel: "high",
    complianceHistory: [78, 72, 68, 65, 63, 61],
  },
  {
    id: "CB-2024-0044",
    name: "National Freight Solutions",
    nameAr: "الحلول الوطنية للشحن",
    license: "LIC-CUS-2021-0112",
    licenseExpiry: "2027-03-31",
    status: "suspended",
    complianceScore: 34,
    declarations: 891,
    declarationsThisMonth: 0,
    violations: 28,
    suspended: true,
    suspensionReason: "Multiple misdeclarations of restricted goods — Under investigation",
    specializations: ["Import", "Free Zone"],
    ports: ["Duqm Port"],
    contact: "+968 2456 9012",
    email: "admin@nfs-oman.om",
    lastDeclaration: "2026-03-18 11:30",
    riskLevel: "critical",
    complianceHistory: [65, 55, 48, 42, 38, 34],
  },
  {
    id: "CB-2024-0057",
    name: "Al-Balushi Trade Services",
    nameAr: "خدمات التجارة البلوشية",
    license: "LIC-CUS-2022-0156",
    licenseExpiry: "2027-08-31",
    status: "active",
    complianceScore: 98,
    declarations: 567,
    declarationsThisMonth: 45,
    violations: 0,
    suspended: false,
    suspensionReason: null,
    specializations: ["Export", "Transit", "Free Zone"],
    ports: ["Port Sultan Qaboos", "Sohar Port"],
    contact: "+968 2456 3456",
    email: "info@albalushi-trade.om",
    lastDeclaration: "2026-04-06 10:02",
    riskLevel: "low",
    complianceHistory: [96, 97, 97, 98, 98, 98],
  },
  {
    id: "CB-2024-0063",
    name: "Muscat Cargo Agents LLC",
    nameAr: "وكلاء شحن مسقط المحدودة",
    license: "LIC-CUS-2020-0089",
    licenseExpiry: "2026-11-30",
    status: "active",
    complianceScore: 79,
    declarations: 1234,
    declarationsThisMonth: 98,
    violations: 5,
    suspended: false,
    suspensionReason: null,
    specializations: ["Import", "Export"],
    ports: ["Muscat Airport", "Port Sultan Qaboos", "Salalah Port"],
    contact: "+968 2456 7777",
    email: "ops@muscatcargo.om",
    lastDeclaration: "2026-04-06 07:55",
    riskLevel: "medium",
    complianceHistory: [82, 80, 79, 78, 80, 79],
  },
];

const statusColors: Record<string, string> = {
  active: "#4ADE80",
  warning: "#FACC15",
  suspended: "#F87171",
};

const riskColors: Record<string, string> = {
  low: "#4ADE80",
  medium: "#FACC15",
  high: "#FB923C",
  critical: "#F87171",
};

const CustomsBrokerRegistry = ({ isAr }: CustomsBrokerRegistryProps) => {
  const [selectedBroker, setSelectedBroker] = useState(brokers[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  const filtered = brokers.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: brokers.length,
    active: brokers.filter((b) => b.status === "active").length,
    warning: brokers.filter((b) => b.status === "warning").length,
    suspended: brokers.filter((b) => b.status === "suspended").length,
    avgCompliance: Math.round(brokers.reduce((a, b) => a + b.complianceScore, 0) / brokers.length),
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-lg font-bold font-['Inter']">
            {isAr ? "سجل وسطاء الجمارك" : "Customs Broker Registry"}
          </h2>
          <p className="text-gray-500 text-xs font-['JetBrains_Mono'] mt-0.5">
            {isAr ? "الوسطاء المرخصون · سجل الإقرارات · درجات الامتثال · الإيقاف" : "Licensed Brokers · Declaration History · Compliance Scores · Suspension Flags"}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold font-['Inter'] cursor-pointer whitespace-nowrap transition-all"
          style={{ background: "rgba(181,142,60,0.12)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.25)" }}>
          <i className="ri-add-line" />
          {isAr ? "تسجيل وسيط" : "Register Broker"}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Total Brokers", labelAr: "إجمالي الوسطاء", value: stats.total, color: "#D4A84B" },
          { label: "Active", labelAr: "نشط", value: stats.active, color: "#4ADE80" },
          { label: "Warning", labelAr: "تحذير", value: stats.warning, color: "#FACC15" },
          { label: "Suspended", labelAr: "موقوف", value: stats.suspended, color: "#F87171" },
          { label: "Avg Compliance", labelAr: "متوسط الامتثال", value: `${stats.avgCompliance}%`, color: "#FB923C" },
        ].map((s) => (
          <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: "rgba(20,29,46,0.8)", border: `1px solid ${s.color}20` }}>
            <div className="text-xl font-bold font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-500 font-['Inter'] mt-0.5">{isAr ? s.labelAr : s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-5">
        {/* Left: Broker list */}
        <div className="w-80 flex-shrink-0 space-y-3">
          {/* Search + filter */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.1)" }}>
              <i className="ri-search-line text-gray-500 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? "بحث..." : "Search brokers..."}
                className="flex-1 bg-transparent text-white text-xs outline-none placeholder-gray-600 font-['Inter']"
              />
            </div>
          </div>
          <div className="flex gap-1">
            {["all", "active", "warning", "suspended"].map((f) => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className="flex-1 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-['Inter'] capitalize"
                style={{
                  background: statusFilter === f ? (f === "all" ? "rgba(181,142,60,0.15)" : `${statusColors[f] || "rgba(181,142,60,0.15)"}15`) : "rgba(20,29,46,0.6)",
                  color: statusFilter === f ? (f === "all" ? "#D4A84B" : statusColors[f] || "#D4A84B") : "#6B7280",
                  border: `1px solid ${statusFilter === f ? (f === "all" ? "rgba(181,142,60,0.3)" : `${statusColors[f] || "#D4A84B"}40`) : "rgba(255,255,255,0.06)"}`,
                }}>
                {f}
              </button>
            ))}
          </div>

          {/* Broker cards */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filtered.map((broker) => (
              <button key={broker.id} onClick={() => setSelectedBroker(broker)}
                className="w-full p-3 rounded-xl text-left transition-all cursor-pointer"
                style={{
                  background: selectedBroker.id === broker.id ? "rgba(181,142,60,0.08)" : "rgba(20,29,46,0.6)",
                  border: `1px solid ${selectedBroker.id === broker.id ? "rgba(181,142,60,0.25)" : "rgba(255,255,255,0.05)"}`,
                }}>
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColors[broker.status] }} />
                    <span className="text-white text-xs font-semibold font-['Inter'] leading-tight">{isAr ? broker.nameAr : broker.name}</span>
                  </div>
                  {broker.suspended && <i className="ri-lock-line text-red-400 text-xs flex-shrink-0" />}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{broker.id}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${broker.complianceScore}%`, background: riskColors[broker.riskLevel] }} />
                    </div>
                    <span className="text-xs font-['JetBrains_Mono']" style={{ color: riskColors[broker.riskLevel] }}>{broker.complianceScore}%</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Broker detail */}
        <div className="flex-1 space-y-4">
          {/* Suspension banner */}
          {selectedBroker.suspended && (
            <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)" }}>
              <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: "rgba(248,113,113,0.15)" }}>
                <i className="ri-lock-line text-red-400" />
              </div>
              <div>
                <p className="text-red-400 font-bold text-sm font-['Inter']">{isAr ? "الوسيط موقوف" : "BROKER SUSPENDED"}</p>
                <p className="text-gray-400 text-xs font-['Inter'] mt-0.5">{selectedBroker.suspensionReason}</p>
              </div>
              <button className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap font-['Inter'] transition-all"
                style={{ background: "rgba(74,222,128,0.12)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.25)" }}>
                {isAr ? "رفع الإيقاف" : "Lift Suspension"}
              </button>
            </div>
          )}

          {/* Broker header */}
          <div className="p-5 rounded-xl" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.1)" }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: statusColors[selectedBroker.status] }} />
                  <span className="text-xs font-semibold font-['Inter'] capitalize" style={{ color: statusColors[selectedBroker.status] }}>{selectedBroker.status}</span>
                  <span className="text-gray-600 text-xs font-['JetBrains_Mono']">·</span>
                  <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{selectedBroker.id}</span>
                </div>
                <h3 className="text-white text-base font-bold font-['Inter']">{isAr ? selectedBroker.nameAr : selectedBroker.name}</h3>
                <p className="text-gray-500 text-xs font-['Inter'] mt-0.5">
                  {isAr ? "رخصة:" : "License:"} <span className="text-gold-400 font-['JetBrains_Mono']">{selectedBroker.license}</span>
                  <span className="mx-2 text-gray-700">·</span>
                  {isAr ? "تنتهي:" : "Expires:"} <span className="text-gray-400">{selectedBroker.licenseExpiry}</span>
                </p>
              </div>
              <div className="flex gap-2">
                {!selectedBroker.suspended && (
                  <button onClick={() => setShowSuspendModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap font-['Inter'] transition-all"
                    style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)" }}>
                    <i className="ri-lock-line" />
                    {isAr ? "إيقاف" : "Suspend"}
                  </button>
                )}
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap font-['Inter'] transition-all"
                  style={{ background: "rgba(181,142,60,0.1)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.25)" }}>
                  <i className="ri-edit-line" />
                  {isAr ? "تعديل" : "Edit"}
                </button>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Total Declarations", labelAr: "إجمالي الإقرارات", value: selectedBroker.declarations.toLocaleString(), color: "#D4A84B" },
                { label: "This Month", labelAr: "هذا الشهر", value: selectedBroker.declarationsThisMonth, color: "#4ADE80" },
                { label: "Violations", labelAr: "المخالفات", value: selectedBroker.violations, color: selectedBroker.violations > 10 ? "#F87171" : selectedBroker.violations > 3 ? "#FACC15" : "#4ADE80" },
                { label: "Compliance", labelAr: "الامتثال", value: `${selectedBroker.complianceScore}%`, color: riskColors[selectedBroker.riskLevel] },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-lg text-center" style={{ background: "rgba(11,18,32,0.6)", border: `1px solid ${s.color}15` }}>
                  <div className="text-lg font-bold font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-gray-500 font-['Inter']">{isAr ? s.labelAr : s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance trend */}
          <div className="p-5 rounded-xl" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.1)" }}>
            <h4 className="text-white text-sm font-bold font-['Inter'] mb-4">
              {isAr ? "اتجاه الامتثال (6 أشهر)" : "Compliance Trend (6 Months)"}
            </h4>
            <div className="flex items-end gap-2 h-20">
              {selectedBroker.complianceHistory.map((score, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm" style={{
                    height: `${score}%`,
                    background: score >= 90 ? "rgba(74,222,128,0.7)" : score >= 70 ? "rgba(250,204,21,0.7)" : "rgba(248,113,113,0.7)",
                    minHeight: "4px",
                  }} />
                  <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.08)" }}>
              <h4 className="text-gray-400 text-xs font-semibold font-['Inter'] mb-3 uppercase tracking-wider">
                {isAr ? "التخصصات" : "Specializations"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedBroker.specializations.map((s) => (
                  <span key={s} className="px-2 py-1 rounded-full text-xs font-['Inter']"
                    style={{ background: "rgba(181,142,60,0.1)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}>
                    {s}
                  </span>
                ))}
              </div>
              <h4 className="text-gray-400 text-xs font-semibold font-['Inter'] mb-3 mt-4 uppercase tracking-wider">
                {isAr ? "الموانئ المعتمدة" : "Authorized Ports"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedBroker.ports.map((p) => (
                  <span key={p} className="px-2 py-1 rounded-full text-xs font-['Inter']"
                    style={{ background: "rgba(74,222,128,0.08)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.2)" }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.08)" }}>
              <h4 className="text-gray-400 text-xs font-semibold font-['Inter'] mb-3 uppercase tracking-wider">
                {isAr ? "معلومات الاتصال" : "Contact Information"}
              </h4>
              <div className="space-y-2">
                {[
                  { icon: "ri-phone-line", value: selectedBroker.contact },
                  { icon: "ri-mail-line", value: selectedBroker.email },
                  { icon: "ri-time-line", value: `Last: ${selectedBroker.lastDeclaration}` },
                ].map((c) => (
                  <div key={c.icon} className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className={`${c.icon} text-gray-500 text-sm`} />
                    </div>
                    <span className="text-gray-300 text-xs font-['JetBrains_Mono']">{c.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs font-['Inter']">{isAr ? "مستوى المخاطر:" : "Risk Level:"}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-['Inter'] capitalize"
                    style={{ background: `${riskColors[selectedBroker.riskLevel]}15`, color: riskColors[selectedBroker.riskLevel], border: `1px solid ${riskColors[selectedBroker.riskLevel]}30` }}>
                    {selectedBroker.riskLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-[480px] rounded-2xl p-6" style={{ background: "rgba(20,29,46,0.98)", border: "1px solid rgba(248,113,113,0.3)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: "rgba(248,113,113,0.15)" }}>
                <i className="ri-lock-line text-red-400 text-lg" />
              </div>
              <div>
                <h3 className="text-white font-bold font-['Inter']">{isAr ? "إيقاف الوسيط" : "Suspend Broker"}</h3>
                <p className="text-gray-500 text-xs font-['Inter']">{isAr ? selectedBroker.nameAr : selectedBroker.name}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-gray-400 text-xs font-semibold font-['Inter'] block mb-2">
                {isAr ? "سبب الإيقاف *" : "Suspension Reason *"}
              </label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder={isAr ? "أدخل سبب الإيقاف..." : "Enter reason for suspension..."}
                className="w-full px-3 py-2 rounded-lg text-white text-sm font-['Inter'] outline-none resize-none"
                style={{ background: "rgba(11,18,32,0.8)", border: "1px solid rgba(248,113,113,0.2)" }}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowSuspendModal(false)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap font-['Inter'] transition-all"
                style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button onClick={() => setShowSuspendModal(false)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap font-['Inter'] transition-all"
                style={{ background: "rgba(248,113,113,0.15)", color: "#F87171", border: "1px solid rgba(248,113,113,0.3)" }}>
                {isAr ? "تأكيد الإيقاف" : "Confirm Suspension"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomsBrokerRegistry;
