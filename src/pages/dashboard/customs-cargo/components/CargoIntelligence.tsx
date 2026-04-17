import { useState } from "react";

interface CargoIntelligenceProps {
  isAr: boolean;
}

const hsRiskData = [
  { code: "9301", desc: "Military weapons & ammunition", descAr: "أسلحة عسكرية وذخيرة", risk: "critical", riskScore: 98, declarations: 4, seizures: 3, trend: "up", category: "Weapons" },
  { code: "2933", desc: "Heterocyclic compounds (precursors)", descAr: "مركبات هيتروحلقية (سلائف)", risk: "critical", riskScore: 94, declarations: 12, seizures: 5, trend: "up", category: "Chemicals" },
  { code: "8471", desc: "Computing machines & components", descAr: "أجهزة حوسبة ومكونات", risk: "high", riskScore: 78, declarations: 234, seizures: 8, trend: "stable", category: "Electronics" },
  { code: "6110", desc: "Jerseys & pullovers (textile)", descAr: "ملابس محبوكة", risk: "high", riskScore: 72, declarations: 891, seizures: 14, trend: "up", category: "Textiles" },
  { code: "2710", desc: "Petroleum oils & preparations", descAr: "زيوت بترولية ومستحضرات", risk: "high", riskScore: 68, declarations: 156, seizures: 6, trend: "down", category: "Energy" },
  { code: "0302", desc: "Fresh fish (undeclared species)", descAr: "أسماك طازجة (أنواع غير مُصرَّح)", risk: "medium", riskScore: 55, declarations: 445, seizures: 11, trend: "stable", category: "Food" },
  { code: "3004", desc: "Medicaments (mixed/unmixed)", descAr: "أدوية (مخلوطة/غير مخلوطة)", risk: "medium", riskScore: 51, declarations: 678, seizures: 9, trend: "up", category: "Pharma" },
  { code: "8517", desc: "Telephone sets & smartphones", descAr: "هواتف وهواتف ذكية", risk: "medium", riskScore: 44, declarations: 1203, seizures: 7, trend: "down", category: "Electronics" },
  { code: "4202", desc: "Trunks, suitcases & bags", descAr: "حقائب وشنط سفر", risk: "low", riskScore: 28, declarations: 2341, seizures: 3, trend: "stable", category: "Goods" },
  { code: "0901", desc: "Coffee, whether roasted or not", descAr: "قهوة محمصة أو غير محمصة", risk: "low", riskScore: 18, declarations: 3891, seizures: 1, trend: "down", category: "Food" },
];

const shipmentTrends = [
  { month: "Oct", imports: 4200, exports: 3100, seizures: 12, highValue: 89 },
  { month: "Nov", imports: 4800, exports: 3400, seizures: 15, highValue: 102 },
  { month: "Dec", imports: 5200, exports: 3800, seizures: 18, highValue: 118 },
  { month: "Jan", imports: 4600, exports: 3200, seizures: 14, highValue: 95 },
  { month: "Feb", imports: 5100, exports: 3600, seizures: 21, highValue: 134 },
  { month: "Mar", imports: 5800, exports: 4100, seizures: 19, highValue: 147 },
  { month: "Apr", imports: 6200, exports: 4400, seizures: 23, highValue: 162 },
];

const seizureHeatmap = [
  { port: "Muscat International Airport", portAr: "مطار مسقط الدولي", seizures: 89, value: "OMR 2.4M", topCategory: "Electronics", lat: 23.6, lng: 58.3, intensity: 95 },
  { port: "Port Sultan Qaboos", portAr: "ميناء السلطان قابوس", seizures: 67, value: "OMR 5.1M", topCategory: "Chemicals", lat: 23.6, lng: 58.6, intensity: 78 },
  { port: "Salalah Port", portAr: "ميناء صلالة", seizures: 45, value: "OMR 1.8M", topCategory: "Textiles", lat: 17.0, lng: 54.1, intensity: 58 },
  { port: "Sohar Port", portAr: "ميناء صحار", seizures: 34, value: "OMR 3.2M", topCategory: "Petroleum", lat: 24.4, lng: 56.7, intensity: 44 },
  { port: "Duqm Port", portAr: "ميناء الدقم", seizures: 18, value: "OMR 0.9M", topCategory: "Weapons", lat: 19.7, lng: 57.7, intensity: 28 },
  { port: "Khasab Port", portAr: "ميناء خصب", seizures: 12, value: "OMR 0.4M", topCategory: "Smuggling", lat: 26.2, lng: 56.2, intensity: 18 },
];

const highValueShipments = [
  { ref: "AMN-CUS-2026-08821", importer: "Al-Rashidi Trading LLC", value: "OMR 2,450,000", hs: "8471", goods: "Server infrastructure", channel: "Yellow", flag: true, date: "2026-04-05" },
  { ref: "AMN-CUS-2026-08819", importer: "Gulf Pharma Distribution", value: "OMR 1,890,000", hs: "3004", goods: "Pharmaceutical bulk", channel: "Green", flag: false, date: "2026-04-05" },
  { ref: "AMN-CUS-2026-08814", importer: "National Energy Corp", value: "OMR 4,200,000", hs: "2710", goods: "Petroleum additives", channel: "Green", flag: false, date: "2026-04-04" },
  { ref: "AMN-CUS-2026-08807", importer: "Unknown Consignee", value: "OMR 890,000", hs: "2933", goods: "Chemical compounds", channel: "Red", flag: true, date: "2026-04-04" },
  { ref: "AMN-CUS-2026-08801", importer: "Oman Textile Imports", value: "OMR 670,000", hs: "6110", goods: "Garments bulk", channel: "Yellow", flag: true, date: "2026-04-03" },
];

const riskColors: Record<string, string> = {
  critical: "#F87171",
  high: "#FB923C",
  medium: "#FACC15",
  low: "#4ADE80",
};

const channelColors: Record<string, string> = {
  Green: "#4ADE80",
  Yellow: "#FACC15",
  Red: "#F87171",
};

const CargoIntelligence = ({ isAr }: CargoIntelligenceProps) => {
  const [activeTab, setActiveTab] = useState<"hs" | "trends" | "heatmap" | "highvalue">("hs");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const maxImports = Math.max(...shipmentTrends.map((d) => d.imports));

  const filteredHs = riskFilter === "all" ? hsRiskData : hsRiskData.filter((h) => h.risk === riskFilter);

  const tabs = [
    { id: "hs", label: "HS Code Risk Profiling", labelAr: "تحليل مخاطر رموز HS", icon: "ri-barcode-line" },
    { id: "trends", label: "Shipment Trends", labelAr: "اتجاهات الشحنات", icon: "ri-line-chart-line" },
    { id: "heatmap", label: "Seizure Heatmap", labelAr: "خريطة حرارة الضبط", icon: "ri-map-2-line" },
    { id: "highvalue", label: "High-Value Shipments", labelAr: "شحنات عالية القيمة", icon: "ri-money-dollar-circle-line" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-lg font-bold font-['Inter']">
            {isAr ? "تحليلات استخبارات الشحن" : "Cargo Intelligence Analytics"}
          </h2>
          <p className="text-gray-500 text-xs font-['JetBrains_Mono'] mt-0.5">
            {isAr ? "تحليل المخاطر · اتجاهات الشحنات · خرائط الضبط" : "Risk Profiling · Shipment Trends · Seizure Heatmaps"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[
            { label: "Critical", count: 2, color: "#F87171" },
            { label: "High", count: 3, color: "#FB923C" },
            { label: "Seizures Today", count: 23, color: "#FACC15" },
          ].map((stat) => (
            <div key={stat.label} className="px-3 py-1.5 rounded-lg text-center"
              style={{ background: `${stat.color}12`, border: `1px solid ${stat.color}25` }}>
              <div className="text-sm font-bold font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.count}</div>
              <div className="text-xs text-gray-500 font-['Inter']">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.1)" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-['Inter']"
            style={{
              background: activeTab === tab.id ? "rgba(181,142,60,0.12)" : "transparent",
              color: activeTab === tab.id ? "#D4A84B" : "#6B7280",
              border: activeTab === tab.id ? "1px solid rgba(181,142,60,0.25)" : "1px solid transparent",
            }}
          >
            <i className={`${tab.icon} text-sm`} />
            <span className="hidden md:inline">{isAr ? tab.labelAr : tab.label}</span>
          </button>
        ))}
      </div>

      {/* HS Code Risk Profiling */}
      {activeTab === "hs" && (
        <div className="space-y-4">
          {/* Risk filter */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs font-['Inter']">{isAr ? "تصفية:" : "Filter:"}</span>
            {["all", "critical", "high", "medium", "low"].map((f) => (
              <button
                key={f}
                onClick={() => setRiskFilter(f)}
                className="px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-['Inter']"
                style={{
                  background: riskFilter === f ? (f === "all" ? "rgba(181,142,60,0.15)" : `${riskColors[f]}15`) : "rgba(20,29,46,0.6)",
                  color: riskFilter === f ? (f === "all" ? "#D4A84B" : riskColors[f]) : "#6B7280",
                  border: `1px solid ${riskFilter === f ? (f === "all" ? "rgba(181,142,60,0.3)" : `${riskColors[f]}40`) : "rgba(255,255,255,0.06)"}`,
                }}
              >
                {f === "all" ? (isAr ? "الكل" : "All") : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="rounded-xl overflow-hidden" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.1)" }}>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(181,142,60,0.08)" }}>
                  {["HS Code", "Description", "Category", "Risk Level", "Risk Score", "Declarations", "Seizures", "Trend"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 font-['Inter'] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredHs.map((row, i) => (
                  <tr key={row.code}
                    className="transition-colors"
                    style={{ borderBottom: i < filteredHs.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(181,142,60,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-4 py-3">
                      <span className="text-gold-400 font-['JetBrains_Mono'] text-sm font-bold">{row.code}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-xs font-['Inter']">{isAr ? row.descAr : row.desc}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-400 text-xs font-['Inter']">{row.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-['Inter'] capitalize"
                        style={{ background: `${riskColors[row.risk]}15`, color: riskColors[row.risk], border: `1px solid ${riskColors[row.risk]}30` }}>
                        {row.risk}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${row.riskScore}%`, background: riskColors[row.risk] }} />
                        </div>
                        <span className="text-xs font-['JetBrains_Mono']" style={{ color: riskColors[row.risk] }}>{row.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-300 text-sm font-['JetBrains_Mono']">{row.declarations.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-['JetBrains_Mono']" style={{ color: row.seizures > 10 ? "#F87171" : row.seizures > 5 ? "#FACC15" : "#4ADE80" }}>
                        {row.seizures}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <i className={`text-base ${row.trend === "up" ? "ri-arrow-up-line text-red-400" : row.trend === "down" ? "ri-arrow-down-line text-green-400" : "ri-subtract-line text-gray-500"}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Shipment Trends */}
      {activeTab === "trends" && (
        <div className="space-y-4">
          {/* KPI row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Total Declarations", labelAr: "إجمالي الإقرارات", value: "6,241", delta: "+12%", color: "#D4A84B", icon: "ri-file-list-3-line" },
              { label: "High-Value Shipments", labelAr: "شحنات عالية القيمة", value: "162", delta: "+10%", color: "#FACC15", icon: "ri-money-dollar-circle-line" },
              { label: "Seizures This Month", labelAr: "ضبط هذا الشهر", value: "23", delta: "+21%", color: "#F87171", icon: "ri-shield-cross-line" },
              { label: "Duty Collected", labelAr: "رسوم جمركية محصلة", value: "OMR 4.2M", delta: "+8%", color: "#4ADE80", icon: "ri-bank-line" },
            ].map((kpi) => (
              <div key={kpi.label} className="p-4 rounded-xl" style={{ background: "rgba(20,29,46,0.8)", border: `1px solid ${kpi.color}20` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: `${kpi.color}15` }}>
                    <i className={`${kpi.icon} text-sm`} style={{ color: kpi.color }} />
                  </div>
                  <span className="text-xs font-['JetBrains_Mono']" style={{ color: kpi.color }}>{kpi.delta}</span>
                </div>
                <div className="text-xl font-bold font-['JetBrains_Mono'] text-white">{kpi.value}</div>
                <div className="text-xs text-gray-500 font-['Inter'] mt-0.5">{isAr ? kpi.labelAr : kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="p-5 rounded-xl" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.1)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white text-sm font-bold font-['Inter']">
                {isAr ? "حجم الشحنات الشهري (7 أشهر)" : "Monthly Shipment Volume (7 Months)"}
              </h3>
              <div className="flex items-center gap-4 text-xs font-['Inter']">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: "#D4A84B" }} /><span className="text-gray-400">Imports</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: "#4ADE80" }} /><span className="text-gray-400">Exports</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: "#F87171" }} /><span className="text-gray-400">Seizures ×10</span></div>
              </div>
            </div>
            <div className="flex items-end gap-3 h-48">
              {shipmentTrends.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-0.5 h-40">
                    <div className="flex-1 rounded-t-sm transition-all" style={{ height: `${(d.imports / maxImports) * 100}%`, background: "rgba(181,142,60,0.7)" }} />
                    <div className="flex-1 rounded-t-sm transition-all" style={{ height: `${(d.exports / maxImports) * 100}%`, background: "rgba(74,222,128,0.7)" }} />
                    <div className="flex-1 rounded-t-sm transition-all" style={{ height: `${(d.seizures * 10 / maxImports) * 100}%`, background: "rgba(248,113,113,0.8)" }} />
                  </div>
                  <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* High-value trend */}
          <div className="p-5 rounded-xl" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.1)" }}>
            <h3 className="text-white text-sm font-bold font-['Inter'] mb-4">
              {isAr ? "اتجاه الشحنات عالية القيمة" : "High-Value Shipment Trend"}
            </h3>
            <div className="flex items-end gap-3 h-24">
              {shipmentTrends.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm" style={{ height: `${(d.highValue / 200) * 100}%`, background: "linear-gradient(to top, rgba(250,204,21,0.3), rgba(250,204,21,0.8))", minHeight: "4px" }} />
                  <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{d.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Seizure Heatmap */}
      {activeTab === "heatmap" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Port list */}
            <div className="space-y-3">
              <h3 className="text-white text-sm font-bold font-['Inter']">
                {isAr ? "الضبط حسب المنفذ" : "Seizures by Port of Entry"}
              </h3>
              {seizureHeatmap.map((port) => (
                <div key={port.port} className="p-4 rounded-xl" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.08)" }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white text-sm font-semibold font-['Inter']">{isAr ? port.portAr : port.port}</p>
                      <p className="text-gray-500 text-xs font-['Inter'] mt-0.5">{isAr ? "الفئة الأعلى:" : "Top category:"} <span className="text-gold-400">{port.topCategory}</span></p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold font-['JetBrains_Mono']" style={{ color: port.intensity > 80 ? "#F87171" : port.intensity > 50 ? "#FB923C" : port.intensity > 30 ? "#FACC15" : "#4ADE80" }}>
                        {port.seizures}
                      </div>
                      <div className="text-xs text-gray-500 font-['JetBrains_Mono']">{port.value}</div>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${port.intensity}%`,
                        background: port.intensity > 80 ? "#F87171" : port.intensity > 50 ? "#FB923C" : port.intensity > 30 ? "#FACC15" : "#4ADE80",
                      }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Visual heatmap grid */}
            <div className="p-5 rounded-xl" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.1)" }}>
              <h3 className="text-white text-sm font-bold font-['Inter'] mb-4">
                {isAr ? "خريطة الكثافة" : "Intensity Map"}
              </h3>
              {/* Simplified visual map */}
              <div className="relative rounded-xl overflow-hidden" style={{ height: "320px", background: "rgba(11,18,32,0.9)", border: "1px solid rgba(181,142,60,0.08)" }}>
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "linear-gradient(rgba(181,142,60,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.3) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }} />
                {/* Port dots */}
                {seizureHeatmap.map((port, i) => {
                  const positions = [
                    { top: "35%", left: "55%" },
                    { top: "32%", left: "62%" },
                    { top: "72%", left: "42%" },
                    { top: "28%", left: "58%" },
                    { top: "55%", left: "60%" },
                    { top: "18%", left: "65%" },
                  ];
                  const pos = positions[i];
                  const color = port.intensity > 80 ? "#F87171" : port.intensity > 50 ? "#FB923C" : port.intensity > 30 ? "#FACC15" : "#4ADE80";
                  const size = Math.max(20, (port.intensity / 100) * 50);
                  return (
                    <div key={port.port} className="absolute flex items-center justify-center" style={{ top: pos.top, left: pos.left, transform: "translate(-50%,-50%)" }}>
                      {/* Glow ring */}
                      <div className="absolute rounded-full animate-ping" style={{ width: size + 16, height: size + 16, background: `${color}15`, border: `1px solid ${color}30` }} />
                      <div className="relative rounded-full flex items-center justify-center cursor-pointer"
                        style={{ width: size, height: size, background: `${color}25`, border: `2px solid ${color}60` }}>
                        <span className="text-white font-bold font-['JetBrains_Mono']" style={{ fontSize: Math.max(8, size / 4) }}>{port.seizures}</span>
                      </div>
                      <div className="absolute top-full mt-1 whitespace-nowrap text-xs font-['Inter'] text-gray-400" style={{ fontSize: "9px" }}>
                        {port.port.split(" ")[0]}
                      </div>
                    </div>
                  );
                })}
                {/* Legend */}
                <div className="absolute bottom-3 left-3 flex items-center gap-3">
                  {[{ label: "Critical", color: "#F87171" }, { label: "High", color: "#FB923C" }, { label: "Medium", color: "#FACC15" }, { label: "Low", color: "#4ADE80" }].map((l) => (
                    <div key={l.label} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                      <span className="text-gray-500 font-['Inter']" style={{ fontSize: "9px" }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[
                  { label: "Total Seizures", value: "265", color: "#F87171" },
                  { label: "Total Value", value: "OMR 13.8M", color: "#FACC15" },
                  { label: "Active Ports", value: "6", color: "#D4A84B" },
                ].map((s) => (
                  <div key={s.label} className="p-2 rounded-lg text-center" style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
                    <div className="text-sm font-bold font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs text-gray-500 font-['Inter']">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* High-Value Shipments */}
      {activeTab === "highvalue" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm font-['Inter']">
              {isAr ? "شحنات بقيمة تتجاوز OMR 500,000" : "Shipments exceeding OMR 500,000 in declared value"}
            </p>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-red-400 text-xs font-['JetBrains_Mono']">2 FLAGGED</span>
            </div>
          </div>

          <div className="space-y-3">
            {highValueShipments.map((s) => (
              <div key={s.ref} className="p-4 rounded-xl transition-all"
                style={{
                  background: s.flag ? "rgba(248,113,113,0.05)" : "rgba(20,29,46,0.8)",
                  border: `1px solid ${s.flag ? "rgba(248,113,113,0.25)" : "rgba(181,142,60,0.08)"}`,
                }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{ background: s.flag ? "rgba(248,113,113,0.15)" : "rgba(181,142,60,0.1)" }}>
                      <i className={`${s.flag ? "ri-alert-line text-red-400" : "ri-ship-line text-gold-400"} text-base`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gold-400 text-xs font-['JetBrains_Mono'] font-bold">{s.ref}</span>
                        {s.flag && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-['Inter']"
                            style={{ background: "rgba(248,113,113,0.15)", color: "#F87171", border: "1px solid rgba(248,113,113,0.3)" }}>
                            FLAGGED
                          </span>
                        )}
                      </div>
                      <p className="text-white text-sm font-semibold font-['Inter']">{s.importer}</p>
                      <p className="text-gray-500 text-xs font-['Inter'] mt-0.5">
                        HS {s.hs} · {s.goods} · {s.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold font-['JetBrains_Mono'] text-white">{s.value}</div>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: channelColors[s.channel] }} />
                      <span className="text-xs font-['Inter']" style={{ color: channelColors[s.channel] }}>{s.channel} Channel</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CargoIntelligence;
