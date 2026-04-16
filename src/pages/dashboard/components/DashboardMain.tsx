import { useState } from "react";
import { entityMeta, type EntityType } from "@/mocks/dashboardData";
import KpiCards from "./KpiCards";
import EventFeed from "./EventFeed";

interface Props {
  entityType: EntityType;
  isAr: boolean;
}

const DashboardMain = ({ entityType, isAr }: Props) => {
  const [dateRange, setDateRange] = useState("today");
  const meta = entityMeta[entityType];

  const dateRanges = [
    { key: "today",   labelEn: "Today",      labelAr: "اليوم" },
    { key: "week",    labelEn: "This Week",   labelAr: "هذا الأسبوع" },
    { key: "month",   labelEn: "This Month",  labelAr: "هذا الشهر" },
    { key: "custom",  labelEn: "Custom",      labelAr: "مخصص" },
  ];

  const summaryStats = [
    { labelEn: "Events Submitted", labelAr: "أحداث مُرسلة",  value: "2,847", color: "#22D3EE", icon: "ri-send-plane-line" },
    { labelEn: "Accepted",         labelAr: "مقبولة",         value: "2,791", color: "#4ADE80", icon: "ri-checkbox-circle-line" },
    { labelEn: "Pending",          labelAr: "معلقة",          value: "43",    color: "#FACC15", icon: "ri-time-line" },
    { labelEn: "Rejected",         labelAr: "مرفوضة",         value: "13",    color: "#F87171", icon: "ri-close-circle-line" },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6" style={{ background: "#060D1A" }}>
      {/* Grid bg */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className={`${meta.icon} text-sm`} style={{ color: meta.color }} />
              </div>
              <h1 className="text-white font-bold text-xl font-['Inter']">
                {isAr ? "آخر تفاصيل الأحداث" : "Latest Event Details"}
              </h1>
            </div>
            <p className="text-gray-500 text-xs font-['JetBrains_Mono']">
              {isAr ? meta.categoryAr : meta.category} — {isAr ? meta.nameAr : meta.name}
            </p>
          </div>

          {/* Date range picker */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.12)" }}>
            {dateRanges.map((dr) => (
              <button
                key={dr.key}
                onClick={() => setDateRange(dr.key)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-['Inter']"
                style={{
                  background: dateRange === dr.key ? "rgba(34,211,238,0.15)" : "transparent",
                  color: dateRange === dr.key ? "#22D3EE" : "#6B7280",
                  border: dateRange === dr.key ? "1px solid rgba(34,211,238,0.3)" : "1px solid transparent",
                }}
              >
                {isAr ? dr.labelAr : dr.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {summaryStats.map((s) => (
            <div key={s.labelEn} className="flex items-center gap-3 p-3 rounded-xl border"
              style={{ background: "rgba(10,22,40,0.6)", borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ background: s.color + "12", border: `1px solid ${s.color}25` }}>
                <i className={`${s.icon} text-sm`} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-white font-black text-lg font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</p>
                <p className="text-gray-600 text-xs font-['Inter']">{isAr ? s.labelAr : s.labelEn}</p>
              </div>
            </div>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-cyan-400" />
            <h2 className="text-white font-bold text-base font-['Inter']">
              {isAr ? "مؤشرات الأداء الرئيسية" : "Key Performance Indicators"}
            </h2>
          </div>
          <KpiCards entityType={entityType} isAr={isAr} />
        </div>

        {/* Bottom: Chart area + Event Feed */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Activity chart placeholder */}
          <div className="xl:col-span-2 rounded-xl border p-5"
            style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-white font-bold text-sm font-['Inter']">
                  {isAr ? "نشاط الأحداث" : "Event Activity"}
                </h3>
                <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-0.5">
                  {isAr ? "آخر 7 أيام" : "Last 7 days"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {[
                  { labelEn: "Accepted", labelAr: "مقبول", color: "#4ADE80" },
                  { labelEn: "Pending",  labelAr: "معلق",  color: "#FACC15" },
                  { labelEn: "Rejected", labelAr: "مرفوض", color: "#F87171" },
                ].map((l) => (
                  <div key={l.labelEn} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                    <span className="text-gray-500 text-xs font-['Inter']">{isAr ? l.labelAr : l.labelEn}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar chart visual */}
            <div className="flex items-end gap-2 h-36">
              {[
                { day: "Mon", dayAr: "الإث", accepted: 85, pending: 8, rejected: 2 },
                { day: "Tue", dayAr: "الثل", accepted: 92, pending: 5, rejected: 1 },
                { day: "Wed", dayAr: "الأر", accepted: 78, pending: 12, rejected: 4 },
                { day: "Thu", dayAr: "الخم", accepted: 95, pending: 3, rejected: 1 },
                { day: "Fri", dayAr: "الجم", accepted: 88, pending: 7, rejected: 2 },
                { day: "Sat", dayAr: "السب", accepted: 72, pending: 15, rejected: 6 },
                { day: "Sun", dayAr: "الأح", accepted: 90, pending: 6, rejected: 2 },
              ].map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-0.5 items-center">
                    <div className="w-full rounded-t-sm" style={{ height: `${d.accepted * 0.9}px`, background: "rgba(74,222,128,0.6)", minHeight: "4px" }} />
                    <div className="w-full" style={{ height: `${d.pending * 0.9}px`, background: "rgba(250,204,21,0.6)", minHeight: "2px" }} />
                    <div className="w-full rounded-b-sm" style={{ height: `${d.rejected * 0.9}px`, background: "rgba(248,113,113,0.6)", minHeight: "2px" }} />
                  </div>
                  <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{isAr ? d.dayAr : d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Event Feed */}
          <div className="xl:col-span-1" style={{ minHeight: "400px" }}>
            <EventFeed entityType={entityType} isAr={isAr} />
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-4 p-4 rounded-xl border" style={{ background: "rgba(10,22,40,0.6)", borderColor: "rgba(34,211,238,0.08)" }}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-widest">
              {isAr ? "إجراءات سريعة" : "Quick Actions"}
            </span>
            {[
              { icon: "ri-upload-cloud-2-line", labelEn: "Upload Batch File", labelAr: "رفع ملف دفعي", color: "#22D3EE" },
              { icon: "ri-file-download-line",  labelEn: "Export Report",     labelAr: "تصدير تقرير",  color: "#4ADE80" },
              { icon: "ri-refresh-line",         labelEn: "Sync Status",       labelAr: "مزامنة الحالة", color: "#FACC15" },
              { icon: "ri-customer-service-2-line", labelEn: "Contact Support", labelAr: "الدعم التقني", color: "#A78BFA" },
            ].map((action) => (
              <button
                key={action.labelEn}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-['Inter']"
                style={{ background: action.color + "0A", borderColor: action.color + "30", color: action.color }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = action.color + "20"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = action.color + "0A"; }}
              >
                <i className={`${action.icon} text-sm`} />
                {isAr ? action.labelAr : action.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardMain;
