interface Props { isAr: boolean; }

const RETAILERS = [
  { id: "R001", name: "Lulu Hypermarket", nameAr: "لولو هايبرماركت", type: "Hypermarket", typeAr: "هايبرماركت", status: "active" as const, dataQuality: 97, eventsToday: 142, lastSync: "2 min ago", lastSyncAr: "منذ دقيقتين", categories: ["Electronics", "Prepaid Cards"], apiVersion: "v3.2", compliance: 98 },
  { id: "R002", name: "Carrefour Oman", nameAr: "كارفور عُمان", type: "Hypermarket", typeAr: "هايبرماركت", status: "active" as const, dataQuality: 94, eventsToday: 89, lastSync: "5 min ago", lastSyncAr: "منذ 5 دقائق", categories: ["Electronics", "Chemicals"], apiVersion: "v3.1", compliance: 95 },
  { id: "R003", name: "Oman Electronics", nameAr: "عُمان للإلكترونيات", type: "Electronics", typeAr: "إلكترونيات", status: "active" as const, dataQuality: 91, eventsToday: 67, lastSync: "12 min ago", lastSyncAr: "منذ 12 دقيقة", categories: ["Electronics", "Drones", "Surveillance"], apiVersion: "v3.2", compliance: 92 },
  { id: "R004", name: "Al Meera Consumer Goods", nameAr: "الميرة للسلع الاستهلاكية", type: "Supermarket", typeAr: "سوبرماركت", status: "active" as const, dataQuality: 88, eventsToday: 34, lastSync: "28 min ago", lastSyncAr: "منذ 28 دقيقة", categories: ["Chemicals", "Prepaid Cards"], apiVersion: "v2.8", compliance: 87 },
  { id: "R005", name: "Muscat Pharmacy", nameAr: "صيدلية مسقط", type: "Pharmacy", typeAr: "صيدلية", status: "warning" as const, dataQuality: 72, eventsToday: 12, lastSync: "2.1 hr ago", lastSyncAr: "منذ 2.1 ساعة", categories: ["Chemicals"], apiVersion: "v2.5", compliance: 71 },
  { id: "R006", name: "Nizwa Agricultural Supply", nameAr: "مستلزمات نزوى الزراعية", type: "Agricultural", typeAr: "زراعي", status: "warning" as const, dataQuality: 58, eventsToday: 8, lastSync: "4.5 hr ago", lastSyncAr: "منذ 4.5 ساعة", categories: ["Chemicals"], apiVersion: "v2.1", compliance: 55 },
  { id: "R007", name: "Sohar Electronics Hub", nameAr: "مركز صحار للإلكترونيات", type: "Electronics", typeAr: "إلكترونيات", status: "offline" as const, dataQuality: 0, eventsToday: 0, lastSync: "18 hr ago", lastSyncAr: "منذ 18 ساعة", categories: ["Electronics", "Communication"], apiVersion: "v2.0", compliance: 12 },
  { id: "R008", name: "Buraimi Trading Co.", nameAr: "شركة البريمي للتجارة", type: "General", typeAr: "عام", status: "offline" as const, dataQuality: 0, eventsToday: 0, lastSync: "3 days ago", lastSyncAr: "منذ 3 أيام", categories: ["Electronics", "Prepaid Cards"], apiVersion: "v1.8", compliance: 4 },
];

const ONLINE_PLATFORMS = [
  { name: "Amazon.ae (Oman deliveries)", status: "active" as const, eventsToday: 234, quality: 96, lastSync: "1 min ago" },
  { name: "Noon.com", status: "active" as const, eventsToday: 178, quality: 93, lastSync: "3 min ago" },
  { name: "Oman Online Store", status: "active" as const, eventsToday: 45, quality: 89, lastSync: "15 min ago" },
  { name: "AliExpress (Oman)", status: "warning" as const, eventsToday: 12, quality: 61, lastSync: "1.2 hr ago" },
];

const statusColor = (s: "active" | "warning" | "offline") => {
  if (s === "active") return "#4ADE80";
  if (s === "warning") return "#FACC15";
  return "#F87171";
};

const qualityColor = (q: number) => {
  if (q >= 90) return "#4ADE80";
  if (q >= 70) return "#FACC15";
  if (q >= 40) return "#FB923C";
  return "#F87171";
};

const RetailerCompliance = ({ isAr }: Props) => {
  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: isAr ? "متصل" : "Online", value: RETAILERS.filter((r) => r.status === "active").length, color: "#4ADE80", icon: "ri-wifi-line" },
          { label: isAr ? "تحذير" : "Warning", value: RETAILERS.filter((r) => r.status === "warning").length, color: "#FACC15", icon: "ri-alert-line" },
          { label: isAr ? "غير متصل" : "Offline", value: RETAILERS.filter((r) => r.status === "offline").length, color: "#F87171", icon: "ri-wifi-off-line" },
          { label: isAr ? "متوسط الجودة" : "Avg Quality", value: `${Math.round(RETAILERS.filter((r) => r.status === "active").reduce((a, r) => a + r.dataQuality, 0) / RETAILERS.filter((r) => r.status === "active").length)}%`, color: "#D4A84B", icon: "ri-bar-chart-line" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-4 text-center" style={{ background: "rgba(20,29,46,0.8)", borderColor: `${s.color}20`, backdropFilter: "blur(12px)" }}>
            <div className="w-8 h-8 flex items-center justify-center rounded-lg mx-auto mb-2" style={{ background: `${s.color}12` }}>
              <i className={`${s.icon} text-sm`} style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</div>
            <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Retailer table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
          <h3 className="text-white font-bold text-sm">{isAr ? "تقارير تجار التجزئة" : "Retailer Reporting Status"}</h3>
          <p className="text-gray-500 text-xs mt-0.5">{isAr ? "التجار المسجّلون في نظام AMEEN" : "Retailers registered in AMEEN system"}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                {[isAr ? "التاجر" : "Retailer", isAr ? "النوع" : "Type", isAr ? "الحالة" : "Status", isAr ? "أحداث اليوم" : "Events Today", isAr ? "جودة البيانات" : "Data Quality", isAr ? "آخر مزامنة" : "Last Sync", isAr ? "الفئات" : "Categories", isAr ? "الامتثال" : "Compliance"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              {RETAILERS.map((r) => {
                const sc = statusColor(r.status);
                const qc = qualityColor(r.dataQuality);
                return (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-white text-sm font-semibold whitespace-nowrap">{isAr ? r.nameAr : r.name}</div>
                      <div className="text-gray-500 text-xs font-['JetBrains_Mono']">API {r.apiVersion}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-400 text-xs whitespace-nowrap">{isAr ? r.typeAr : r.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: sc, boxShadow: r.status === "active" ? `0 0 6px ${sc}` : "none" }} />
                        <span className="text-xs font-semibold" style={{ color: sc }}>{r.status.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white font-bold font-['JetBrains_Mono']">{r.eventsToday}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full" style={{ width: `${r.dataQuality}%`, background: qc }} />
                        </div>
                        <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: qc }}>{r.dataQuality}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-400 text-xs font-['JetBrains_Mono'] whitespace-nowrap">{isAr ? r.lastSyncAr : r.lastSync}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {r.categories.map((cat) => (
                          <span key={cat} className="px-1.5 py-0.5 rounded text-xs font-['JetBrains_Mono']"
                            style={{ background: "rgba(181,142,60,0.08)", color: "#D4A84B", fontSize: "9px" }}>{cat}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full" style={{ width: `${r.compliance}%`, background: qualityColor(r.compliance) }} />
                        </div>
                        <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: qualityColor(r.compliance) }}>{r.compliance}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Online platforms */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
          <h3 className="text-white font-bold text-sm">{isAr ? "المنصات الإلكترونية" : "Online Platforms"}</h3>
          <p className="text-gray-500 text-xs mt-0.5">{isAr ? "منصات التجارة الإلكترونية العاملة في عُمان" : "E-commerce platforms operating in Oman"}</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          {ONLINE_PLATFORMS.map((p) => {
            const sc = statusColor(p.status);
            const qc = qualityColor(p.quality);
            return (
              <div key={p.name} className="p-5">
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: sc }} />
                  <span className="text-xs font-semibold" style={{ color: sc }}>{p.status.toUpperCase()}</span>
                </div>
                <div className="text-white text-sm font-bold mb-1 leading-tight">{p.name}</div>
                <div className="text-2xl font-black font-['JetBrains_Mono'] mb-1" style={{ color: "#D4A84B" }}>{p.eventsToday}</div>
                <div className="text-gray-500 text-xs mb-2">{isAr ? "أحداث اليوم" : "events today"}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${p.quality}%`, background: qc }} />
                  </div>
                  <span className="text-xs font-['JetBrains_Mono']" style={{ color: qc }}>{p.quality}%</span>
                </div>
                <div className="text-gray-600 text-xs mt-1 font-['JetBrains_Mono']">{p.lastSync}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RetailerCompliance;
