import { useState } from "react";

interface Props { isAr: boolean; }

/* ── Absconding Monitor ── */
const ABSCONDING = [
  { id: "ABS-001", name: "Reza Tehrani", nameAr: "رضا طهراني", nationality: "Iran", flag: "🇮🇷", docNumber: "IR-3312-F", employer: "Al Seeb Construction", terminationDate: "2026-03-10", daysAbsconded: 26, borderExit: false, lastKnown: "Hatta Crossing area", lastKnownAr: "منطقة معبر حتا", linkedStreams: ["TRANSPORT", "UTILITY"], severity: "critical" as const },
  { id: "ABS-002", name: "Vikram Sharma", nameAr: "فيكرام شارما", nationality: "India", flag: "🇮🇳", docNumber: "IN-9901-P", employer: "Muscat Retail LLC", terminationDate: "2026-03-22", daysAbsconded: 14, borderExit: false, lastKnown: "Buraimi Crossing (transport)", lastKnownAr: "معبر البريمي (نقل)", linkedStreams: ["TRANSPORT", "BORDER"], severity: "high" as const },
  { id: "ABS-003", name: "Abdi Hassan", nameAr: "عبدي حسن", nationality: "Somalia", flag: "🇸🇴", docNumber: "SO-1122-M", employer: "Salalah Fisheries", terminationDate: "2026-02-28", daysAbsconded: 36, borderExit: false, lastKnown: "Unknown", lastKnownAr: "غير معروف", linkedStreams: ["BORDER"], severity: "critical" as const },
];

/* ── Sector Concentration ── */
const SECTOR_DATA = [
  { sector: "Construction", sectorAr: "البناء", total: 48200, nationalities: [{ name: "India", pct: 42, color: "#22D3EE" }, { name: "Pakistan", pct: 28, color: "#4ADE80" }, { name: "Bangladesh", pct: 18, color: "#FACC15" }, { name: "Other", pct: 12, color: "#9CA3AF" }], risk: "medium" as const },
  { sector: "Hospitality", sectorAr: "الضيافة", total: 22100, nationalities: [{ name: "Philippines", pct: 38, color: "#22D3EE" }, { name: "India", pct: 31, color: "#4ADE80" }, { name: "Nepal", pct: 19, color: "#FACC15" }, { name: "Other", pct: 12, color: "#9CA3AF" }], risk: "low" as const },
  { sector: "Oil & Gas", sectorAr: "النفط والغاز", total: 18400, nationalities: [{ name: "India", pct: 35, color: "#22D3EE" }, { name: "UK", pct: 22, color: "#4ADE80" }, { name: "USA", pct: 18, color: "#FACC15" }, { name: "Other", pct: 25, color: "#9CA3AF" }], risk: "low" as const },
  { sector: "Retail", sectorAr: "التجزئة", total: 31700, nationalities: [{ name: "India", pct: 55, color: "#22D3EE" }, { name: "Bangladesh", pct: 22, color: "#4ADE80" }, { name: "Pakistan", pct: 14, color: "#FACC15" }, { name: "Other", pct: 9, color: "#9CA3AF" }], risk: "high" as const },
  { sector: "Healthcare", sectorAr: "الرعاية الصحية", total: 12800, nationalities: [{ name: "India", pct: 48, color: "#22D3EE" }, { name: "Philippines", pct: 29, color: "#4ADE80" }, { name: "Jordan", pct: 13, color: "#FACC15" }, { name: "Other", pct: 10, color: "#9CA3AF" }], risk: "low" as const },
];

/* ── Ghost Employees ── */
const GHOST_EMPLOYEES = [
  { id: "GHO-001", name: "Unknown Worker A", nameAr: "عامل مجهول أ", permitNumber: "WP-2024-99001", employer: "Al Wusta Trading", sector: "Retail", nationality: "Bangladesh", flag: "🇧🇩", issueDate: "2024-06-01", noUtility: true, noSIM: true, noFinancial: true, noTransport: true, riskScore: 98 },
  { id: "GHO-002", name: "Unknown Worker B", nameAr: "عامل مجهول ب", permitNumber: "WP-2023-77412", employer: "Nizwa Construction Co.", sector: "Construction", nationality: "Pakistan", flag: "🇵🇰", issueDate: "2023-11-15", noUtility: true, noSIM: true, noFinancial: false, noTransport: true, riskScore: 82 },
  { id: "GHO-003", name: "Unknown Worker C", nameAr: "عامل مجهول ج", permitNumber: "WP-2025-33201", employer: "Sohar Retail LLC", sector: "Retail", nationality: "India", flag: "🇮🇳", issueDate: "2025-01-20", noUtility: true, noSIM: false, noFinancial: true, noTransport: true, riskScore: 74 },
];

/* ── Employer Compliance ── */
const EMPLOYERS = [
  { id: "EMP-001", name: "Al Wusta Trading LLC", cr: "CR-1234567", sector: "Retail", employees: 142, lateRenewals: 18, abscondingCases: 7, salaryComplaints: 12, violationScore: 94, risk: "critical" as const },
  { id: "EMP-002", name: "Nizwa Construction Co.", cr: "CR-2345678", sector: "Construction", employees: 287, lateRenewals: 24, abscondingCases: 11, salaryComplaints: 8, violationScore: 87, risk: "critical" as const },
  { id: "EMP-003", name: "Sohar Retail LLC", cr: "CR-3456789", sector: "Retail", employees: 98, lateRenewals: 9, abscondingCases: 3, salaryComplaints: 14, violationScore: 71, risk: "high" as const },
  { id: "EMP-004", name: "Muscat Hospitality Group", cr: "CR-4567890", sector: "Hospitality", employees: 312, lateRenewals: 6, abscondingCases: 2, salaryComplaints: 5, violationScore: 38, risk: "medium" as const },
  { id: "EMP-005", name: "Oman Construction LLC", cr: "CR-5678901", sector: "Construction", employees: 521, lateRenewals: 3, abscondingCases: 1, salaryComplaints: 2, violationScore: 18, risk: "low" as const },
];

const riskColor = (r: "low" | "medium" | "high" | "critical") => {
  if (r === "low") return "#4ADE80";
  if (r === "medium") return "#FACC15";
  if (r === "high") return "#FB923C";
  return "#F87171";
};

const streamColor = (s: string) => {
  const map: Record<string, string> = { TRANSPORT: "#22D3EE", BORDER: "#A78BFA", HOTEL: "#FB923C", MUNICIPALITY: "#4ADE80", UTILITY: "#FACC15", MOBILE: "#F87171" };
  return map[s] || "#9CA3AF";
};

const EmploymentIntelligence = ({ isAr }: Props) => {
  const [activeSection, setActiveSection] = useState<"absconding" | "sector" | "ghost" | "compliance">("absconding");

  const sections = [
    { id: "absconding" as const, icon: "ri-user-unfollow-line", label: isAr ? "مراقبة التغيب" : "Absconding Monitor", color: "#F87171", count: ABSCONDING.length },
    { id: "sector" as const, icon: "ri-pie-chart-line", label: isAr ? "تركيز القطاعات" : "Sector Concentration", color: "#22D3EE" },
    { id: "ghost" as const, icon: "ri-ghost-line", label: isAr ? "الموظفون الوهميون" : "Ghost Employees", color: "#FB923C", count: GHOST_EMPLOYEES.length },
    { id: "compliance" as const, icon: "ri-building-line", label: isAr ? "امتثال أصحاب العمل" : "Employer Compliance", color: "#FACC15" },
  ];

  return (
    <div className="space-y-5">
      {/* Section tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {sections.map((sec) => (
          <button key={sec.id} type="button" onClick={() => setActiveSection(sec.id)}
            className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all text-left"
            style={{
              background: activeSection === sec.id ? `${sec.color}10` : "rgba(10,22,40,0.8)",
              borderColor: activeSection === sec.id ? `${sec.color}40` : "rgba(34,211,238,0.1)",
              backdropFilter: "blur(12px)",
            }}>
            <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: `${sec.color}15`, border: `1px solid ${sec.color}30` }}>
              <i className={`${sec.icon} text-base`} style={{ color: sec.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-bold truncate">{sec.label}</div>
              {sec.count !== undefined && (
                <div className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: sec.color }}>{sec.count} {isAr ? "حالة" : "cases"}</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* ── Absconding Monitor ── */}
      {activeSection === "absconding" && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.2)" }}>
            <i className="ri-robot-line text-red-400 text-sm mt-0.5 flex-shrink-0" />
            <p className="text-gray-400 text-xs">
              {isAr
                ? "شخص مُنهى عمله ولم يغادر البلاد (تدفق الحدود) → أين هو؟ يتم التحقق المتقاطع مع بيانات الفندق والإيجار والمرافق."
                : "Person terminated but no exit from country (Border stream) → where are they? Cross-check hotel/rental/utility data."}
            </p>
          </div>
          {ABSCONDING.map((rec) => {
            const color = riskColor(rec.severity);
            return (
              <div key={rec.id} className="rounded-2xl border p-5" style={{ background: "rgba(10,22,40,0.8)", borderColor: `${color}25`, backdropFilter: "blur(12px)", borderLeft: `4px solid ${color}` }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{rec.flag}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-bold text-sm">{isAr ? rec.nameAr : rec.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>{rec.severity.toUpperCase()}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(248,113,113,0.12)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)" }}>
                          {isAr ? "لم يغادر" : "NO EXIT"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-gray-400 text-xs font-['JetBrains_Mono']">{rec.docNumber}</span>
                        <span className="text-gray-600 text-xs">·</span>
                        <span className="text-gray-400 text-xs">{rec.employer}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-3xl font-black font-['JetBrains_Mono']" style={{ color }}>{rec.daysAbsconded}</div>
                    <div className="text-gray-500 text-xs">{isAr ? "يوم منذ الإنهاء" : "days since termination"}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                  <div className="px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-gray-500 text-xs">{isAr ? "تاريخ الإنهاء" : "Termination Date"}</p>
                    <p className="text-white text-xs font-semibold font-['JetBrains_Mono']">{rec.terminationDate}</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-gray-500 text-xs">{isAr ? "مغادرة الحدود" : "Border Exit"}</p>
                    <p className="text-xs font-bold" style={{ color: rec.borderExit ? "#4ADE80" : "#F87171" }}>{rec.borderExit ? (isAr ? "نعم" : "Yes") : (isAr ? "لا — لا يزال في البلاد" : "No — Still in country")}</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-gray-500 text-xs">{isAr ? "آخر موقع معروف" : "Last Known Location"}</p>
                    <p className="text-white text-xs font-semibold">{isAr ? rec.lastKnownAr : rec.lastKnown}</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-gray-500 text-xs mb-1">{isAr ? "التدفقات المرتبطة" : "Linked Streams"}</p>
                    <div className="flex gap-1 flex-wrap">
                      {rec.linkedStreams.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded text-xs font-bold font-['JetBrains_Mono']"
                          style={{ background: `${streamColor(s)}12`, color: streamColor(s), fontSize: "9px" }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Sector Concentration ── */}
      {activeSection === "sector" && (
        <div className="space-y-4">
          <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.15)", backdropFilter: "blur(12px)" }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(34,211,238,0.1)" }}>
              <h3 className="text-white font-bold text-sm">{isAr ? "توزيع الجنسيات حسب القطاع" : "Nationality × Sector Distribution"}</h3>
              <p className="text-gray-500 text-xs mt-0.5">{isAr ? "تركيز غير عادي يُبلَّغ تلقائياً" : "Unusual concentration auto-flagged"}</p>
            </div>
            <div className="divide-y" style={{ borderColor: "rgba(34,211,238,0.06)" }}>
              {SECTOR_DATA.map((sec) => {
                const color = riskColor(sec.risk);
                return (
                  <div key={sec.sector} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold text-sm">{isAr ? sec.sectorAr : sec.sector}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: `${color}15`, color, border: `1px solid ${color}30`, fontSize: "9px" }}>{sec.risk.toUpperCase()}</span>
                      </div>
                      <span className="text-gray-400 text-sm font-['JetBrains_Mono']">{sec.total.toLocaleString()} {isAr ? "عامل" : "workers"}</span>
                    </div>
                    <div className="flex h-5 rounded-full overflow-hidden gap-0.5">
                      {sec.nationalities.map((nat) => (
                        <div key={nat.name} className="h-full rounded-sm transition-all duration-700 relative group"
                          style={{ width: `${nat.pct}%`, background: nat.color, minWidth: "2px" }}>
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            style={{ background: nat.color, color: "#060D1A", fontSize: "9px", fontWeight: "bold" }}>
                            {nat.name} {nat.pct}%
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      {sec.nationalities.map((nat) => (
                        <div key={nat.name} className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: nat.color }} />
                          <span className="text-gray-400 text-xs">{nat.name} <span className="font-['JetBrains_Mono']" style={{ color: nat.color }}>{nat.pct}%</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Ghost Employees ── */}
      {activeSection === "ghost" && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(251,146,60,0.06)", borderColor: "rgba(251,146,60,0.2)" }}>
            <i className="ri-ghost-line text-orange-400 text-sm mt-0.5 flex-shrink-0" />
            <p className="text-gray-400 text-xs">
              {isAr
                ? "تصريح عمل نشط ولكن لا توصيل مرافق، لا SIM، لا نشاط مالي → احتمال تصريح ورقي فقط."
                : "Work permit active but no utility connection, no SIM, no financial activity → possible paper-only permit."}
            </p>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(251,146,60,0.2)", backdropFilter: "blur(12px)" }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    {[isAr ? "الشخص" : "Person", isAr ? "التصريح" : "Permit", isAr ? "صاحب العمل" : "Employer", isAr ? "القطاع" : "Sector", isAr ? "مرافق" : "Utility", "SIM", isAr ? "مالي" : "Financial", isAr ? "نقل" : "Transport", isAr ? "درجة المخاطر" : "Risk Score"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                  {GHOST_EMPLOYEES.map((emp) => (
                    <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{emp.flag}</span>
                          <div>
                            <div className="text-white text-xs font-semibold">{isAr ? emp.nameAr : emp.name}</div>
                            <div className="text-gray-500 text-xs">{emp.nationality}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="text-cyan-400 text-xs font-['JetBrains_Mono']">{emp.permitNumber}</span></td>
                      <td className="px-4 py-3"><span className="text-gray-300 text-xs">{emp.employer}</span></td>
                      <td className="px-4 py-3"><span className="text-gray-300 text-xs">{emp.sector}</span></td>
                      {[emp.noUtility, emp.noSIM, emp.noFinancial, emp.noTransport].map((missing, i) => (
                        <td key={i} className="px-4 py-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ background: missing ? "rgba(248,113,113,0.15)" : "rgba(74,222,128,0.15)" }}>
                            <i className={missing ? "ri-close-line text-red-400 text-xs" : "ri-check-line text-green-400 text-xs"} />
                          </div>
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", minWidth: "60px" }}>
                            <div className="h-full rounded-full" style={{ width: `${emp.riskScore}%`, background: emp.riskScore > 80 ? "#F87171" : emp.riskScore > 60 ? "#FB923C" : "#FACC15" }} />
                          </div>
                          <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: emp.riskScore > 80 ? "#F87171" : emp.riskScore > 60 ? "#FB923C" : "#FACC15" }}>{emp.riskScore}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Employer Compliance ── */}
      {activeSection === "compliance" && (
        <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(250,204,21,0.2)", backdropFilter: "blur(12px)" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(250,204,21,0.1)" }}>
            <h3 className="text-white font-bold text-sm">{isAr ? "ترتيب أصحاب العمل حسب المخالفات" : "Employer Compliance Ranking"}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{isAr ? "مرتّب تنازلياً حسب درجة المخالفة" : "Ranked by violation score (highest first)"}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  {[isAr ? "الترتيب" : "Rank", isAr ? "صاحب العمل" : "Employer", isAr ? "القطاع" : "Sector", isAr ? "الموظفون" : "Employees", isAr ? "تجديدات متأخرة" : "Late Renewals", isAr ? "حالات تغيب" : "Absconding", isAr ? "شكاوى الراتب" : "Salary Complaints", isAr ? "درجة المخالفة" : "Violation Score"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {EMPLOYERS.map((emp, idx) => {
                  const color = riskColor(emp.risk);
                  return (
                    <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors" style={{ borderLeft: `3px solid ${color}` }}>
                      <td className="px-4 py-3">
                        <span className="text-gray-500 text-sm font-bold font-['JetBrains_Mono']">#{idx + 1}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-white text-sm font-semibold whitespace-nowrap">{emp.name}</div>
                        <div className="text-gray-500 text-xs font-['JetBrains_Mono']">{emp.cr}</div>
                      </td>
                      <td className="px-4 py-3"><span className="text-gray-300 text-xs">{emp.sector}</span></td>
                      <td className="px-4 py-3"><span className="text-white text-sm font-bold font-['JetBrains_Mono']">{emp.employees}</span></td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold font-['JetBrains_Mono']" style={{ color: emp.lateRenewals > 10 ? "#F87171" : emp.lateRenewals > 5 ? "#FB923C" : "#4ADE80" }}>{emp.lateRenewals}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold font-['JetBrains_Mono']" style={{ color: emp.abscondingCases > 5 ? "#F87171" : emp.abscondingCases > 2 ? "#FB923C" : "#4ADE80" }}>{emp.abscondingCases}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold font-['JetBrains_Mono']" style={{ color: emp.salaryComplaints > 8 ? "#F87171" : emp.salaryComplaints > 4 ? "#FB923C" : "#4ADE80" }}>{emp.salaryComplaints}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div className="h-full rounded-full" style={{ width: `${emp.violationScore}%`, background: color }} />
                          </div>
                          <span className="text-sm font-black font-['JetBrains_Mono']" style={{ color }}>{emp.violationScore}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmploymentIntelligence;
