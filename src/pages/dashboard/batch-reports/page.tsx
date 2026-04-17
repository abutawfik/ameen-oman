import { useState, useEffect } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import BatchUploadZone from "./components/BatchUploadZone";
import BatchUploadStatus from "./components/BatchUploadStatus";
import ReportKpiCards from "./components/ReportKpiCards";
import ReportCharts from "./components/ReportCharts";
import EntityCompliance from "./components/EntityCompliance";
import ManageUsers from "./components/ManageUsers";
import HelpSupport from "./components/HelpSupport";
import type { UploadResult } from "./components/BatchUploadZone";

type Tab = "upload" | "upload-status" | "reports" | "compliance" | "users" | "help";

const DATE_RANGES = [
  { id: "today", label: "Today",  labelAr: "اليوم" },
  { id: "7d",    label: "7D",     labelAr: "7 أيام" },
  { id: "30d",   label: "30D",    labelAr: "30 يوم" },
  { id: "90d",   label: "90D",    labelAr: "90 يوم" },
  { id: "custom",label: "Custom", labelAr: "مخصص" },
];

const BatchReportsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dateRange, setDateRange] = useState("30d");
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);

  // Determine initial tab from URL
  const getInitialTab = (): Tab => {
    if (location.pathname.includes("reports")) return "reports";
    if (location.pathname.includes("users")) return "users";
    if (location.pathname.includes("help")) return "help";
    return "upload";
  };
  const [activeTab, setActiveTab] = useState<Tab>(getInitialTab);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const handleProcessingComplete = (results: UploadResult[]) => {
    setUploadResults(results);
    setActiveTab("upload-status");
  };

  const TABS: { id: Tab; icon: string; label: string; labelAr: string; badge?: string; badgeColor?: string }[] = [
    { id: "upload",        icon: "ri-upload-cloud-2-line", label: "Batch Upload",    labelAr: "رفع الدُفعة" },
    { id: "upload-status", icon: "ri-list-check-2",        label: "Upload Status",   labelAr: "حالة الرفع",   badge: uploadResults.length > 0 ? String(uploadResults.length) : undefined, badgeColor: "#22D3EE" },
    { id: "reports",       icon: "ri-bar-chart-2-line",    label: "Reports",         labelAr: "التقارير" },
    { id: "compliance",    icon: "ri-shield-check-line",   label: "Compliance",      labelAr: "الامتثال" },
    { id: "users",         icon: "ri-team-line",           label: "Manage Users",    labelAr: "إدارة المستخدمين" },
    { id: "help",          icon: "ri-question-line",       label: "Help & Support",  labelAr: "المساعدة والدعم" },
  ];

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#060D1A" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)`,
        backgroundSize: "40px 40px"
      }} />

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b"
        style={{ background: "rgba(6,13,26,0.95)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />
            {isAr ? "لوحة التحكم" : "Dashboard"}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
              <i className="ri-upload-cloud-2-line text-cyan-400 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{isAr ? "رفع الدُفعة والتقارير" : "Batch Upload & Reports"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(34,211,238,0.12)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}>
                  AMEEN
                </span>
              </div>
              <p className="text-gray-500 text-xs">{isAr ? "رفع الملفات · التحليلات · الامتثال · المستخدمون" : "File upload · Analytics · Compliance · Users"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live clock */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border"
            style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.12)" }}>
            <i className="ri-time-line text-cyan-400 text-xs" />
            <span className="text-cyan-400 text-xs font-bold font-['JetBrains_Mono']">{timeStr}</span>
          </div>

          {/* Live badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
            style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">LIVE</span>
          </div>

          {/* Language toggle */}
        </div>
      </header>

      {/* Tab bar */}
      <div className="sticky top-[57px] z-30 flex items-center gap-1 px-6 py-2 border-b overflow-x-auto"
        style={{ background: "rgba(6,13,26,0.9)", borderColor: "rgba(34,211,238,0.08)", backdropFilter: "blur(12px)" }}>
        {TABS.map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex-shrink-0"
            style={{
              background: activeTab === tab.id ? "rgba(34,211,238,0.12)" : "transparent",
              border: `1px solid ${activeTab === tab.id ? "rgba(34,211,238,0.25)" : "transparent"}`,
              color: activeTab === tab.id ? "#22D3EE" : "#6B7280",
            }}>
            <i className={`${tab.icon} text-xs`} />
            {isAr ? tab.labelAr : tab.label}
            {tab.badge && (
              <span className="px-1.5 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                style={{ background: `${tab.badgeColor}20`, color: tab.badgeColor, fontSize: "9px" }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* ── BATCH UPLOAD TAB ── */}
        {activeTab === "upload" && (
          <>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "رفع ملف الأحداث" : "Upload Events File"}</h1>
                <p className="text-gray-400 text-sm">{isAr ? "رفع دُفعة من الأحداث عبر CSV أو Excel" : "Submit a batch of events via CSV or Excel file"}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.12)" }}>
                <i className="ri-qr-code-line text-cyan-400 text-xs" />
                <span className="text-cyan-400 text-xs font-['JetBrains_Mono']">AMN-BATCH-20260405</span>
              </div>
            </div>
            <BatchUploadZone isAr={isAr} onProcessingComplete={handleProcessingComplete} />
          </>
        )}

        {/* ── UPLOAD STATUS TAB ── */}
        {activeTab === "upload-status" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "حالة الرفع" : "Upload Status"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "نتائج آخر عملية رفع — انقر على الصفوف المرفوضة لتفاصيل الأخطاء" : "Results from last upload — click rejected rows for error details"}</p>
            </div>
            {uploadResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl border"
                style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)" }}>
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl mb-4"
                  style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)" }}>
                  <i className="ri-inbox-line text-cyan-400 text-3xl" />
                </div>
                <p className="text-white font-bold mb-1">{isAr ? "لا توجد نتائج بعد" : "No results yet"}</p>
                <p className="text-gray-500 text-sm mb-4">{isAr ? "ارفع ملفاً أولاً لرؤية النتائج هنا" : "Upload a file first to see results here"}</p>
                <button type="button" onClick={() => setActiveTab("upload")}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap"
                  style={{ background: "#22D3EE", color: "#060D1A" }}>
                  <i className="ri-upload-cloud-2-line text-sm" />
                  {isAr ? "رفع ملف" : "Upload File"}
                </button>
              </div>
            ) : (
              <BatchUploadStatus isAr={isAr} results={uploadResults} />
            )}
          </>
        )}

        {/* ── REPORTS TAB ── */}
        {activeTab === "reports" && (
          <>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "التقارير والتحليلات" : "Reports & Analytics"}</h1>
                <p className="text-gray-400 text-sm">{isAr ? "إحصاءات شاملة عبر جميع الوحدات والكيانات" : "Comprehensive statistics across all modules and entities"}</p>
              </div>
              {/* Date range selector */}
              <div className="flex items-center gap-1 p-1 rounded-xl border"
                style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)" }}>
                {DATE_RANGES.map((dr) => (
                  <button key={dr.id} type="button" onClick={() => setDateRange(dr.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all"
                    style={{
                      background: dateRange === dr.id ? "#22D3EE" : "transparent",
                      color: dateRange === dr.id ? "#060D1A" : "#6B7280",
                    }}>
                    {isAr ? dr.labelAr : dr.label}
                  </button>
                ))}
              </div>
            </div>
            <ReportKpiCards isAr={isAr} dateRange={dateRange} />
            <ReportCharts isAr={isAr} />
          </>
        )}

        {/* ── COMPLIANCE TAB ── */}
        {activeTab === "compliance" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "امتثال الكيانات" : "Entity Compliance"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "تصنيف الجودة الشهري وتحليل الرفض لكل كيان" : "Monthly quality rating and rejection analysis per entity"}</p>
            </div>
            <EntityCompliance isAr={isAr} />
          </>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === "users" && (
          <>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "إدارة المستخدمين" : "Manage Users"}</h1>
                <p className="text-gray-400 text-sm">{isAr ? "إدارة حسابات المستخدمين والأدوار والصلاحيات" : "Manage user accounts, roles, and permissions"}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                style={{ background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.15)" }}>
                <i className="ri-shield-star-line text-purple-400 text-xs" />
                <span className="text-purple-400 text-xs font-semibold">{isAr ? "مسؤول النظام فقط" : "Admin Only"}</span>
              </div>
            </div>
            <ManageUsers isAr={isAr} />
          </>
        )}

        {/* ── HELP TAB ── */}
        {activeTab === "help" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "المساعدة والدعم" : "Help & Support"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "الأسئلة الشائعة · أدلة المستخدم · دروس الفيديو · تذاكر الدعم" : "FAQs · User guides · Video tutorials · Support tickets"}</p>
            </div>
            <HelpSupport isAr={isAr} />
          </>
        )}
      </main>
    </div>
  );
};

export default BatchReportsPage;
