import { useState } from "react";
import { streams } from "@/mocks/systemAdminData";

const streamRetentionDefaults: Record<string, number> = {
  hotel: 7, "car-rental": 7, mobile: 7, municipality: 10, financial: 10,
  borders: 15, utility: 7, transport: 5, employment: 10, ecommerce: 7,
  social: 3, health: 15, education: 10, customs: 10, marine: 7, postal: 7, tourism: 5,
};

const streamRecords: Record<string, { count: string; size: string; growth: string; pct: number }> = {
  hotel:        { count: "12.4M",  size: "48.2 GB",  growth: "+2.1%", pct: 12 },
  "car-rental": { count: "4.8M",   size: "18.7 GB",  growth: "+1.8%", pct: 5 },
  mobile:       { count: "31.2M",  size: "124.5 GB", growth: "+3.4%", pct: 29 },
  municipality: { count: "8.9M",   size: "34.1 GB",  growth: "+1.2%", pct: 8 },
  financial:    { count: "89.4M",  size: "356.8 GB", growth: "+4.7%", pct: 83 },
  borders:      { count: "156.7M", size: "627.1 GB", growth: "+2.9%", pct: 100 },
  utility:      { count: "2.3M",   size: "9.1 GB",   growth: "+0.8%", pct: 2 },
  transport:    { count: "234.1M", size: "936.4 GB", growth: "+5.2%", pct: 100 },
  employment:   { count: "18.7M",  size: "74.8 GB",  growth: "+1.6%", pct: 17 },
  ecommerce:    { count: "67.3M",  size: "269.2 GB", growth: "+6.1%", pct: 63 },
  social:       { count: "445.2M", size: "1.78 TB",  growth: "+8.3%", pct: 100 },
  health:       { count: "5.6M",   size: "22.4 GB",  growth: "+0.9%", pct: 5 },
  education:    { count: "1.2M",   size: "4.8 GB",   growth: "+0.4%", pct: 1 },
  customs:      { count: "9.1M",   size: "36.4 GB",  growth: "+3.2%", pct: 9 },
  marine:       { count: "3.2M",   size: "12.8 GB",  growth: "+2.7%", pct: 3 },
  postal:       { count: "7.8M",   size: "31.2 GB",  growth: "+1.9%", pct: 7 },
  tourism:      { count: "21.4M",  size: "85.6 GB",  growth: "+4.1%", pct: 20 },
};

const growthProjections = [
  { month: "Apr", current: 4.31, projected: 4.31 },
  { month: "May", current: 0, projected: 4.58 },
  { month: "Jun", current: 0, projected: 4.87 },
  { month: "Jul", current: 0, projected: 5.19 },
  { month: "Aug", current: 0, projected: 5.54 },
  { month: "Sep", current: 0, projected: 5.91 },
];

const DataManagement = () => {
  const [retentions, setRetentions] = useState<Record<string, number>>(streamRetentionDefaults);
  const [exportStream, setExportStream] = useState("hotel");
  const [exportFrom, setExportFrom] = useState("2026-01-01");
  const [exportTo, setExportTo] = useState("2026-04-06");
  const [exportFormat, setExportFormat] = useState("csv");
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [showPurge, setShowPurge] = useState(false);
  const [purgeApproval1, setPurgeApproval1] = useState(false);
  const [purgeApproval2, setPurgeApproval2] = useState(false);
  const [purgeStream, setPurgeStream] = useState("health");
  const [purgeYear, setPurgeYear] = useState("2019");
  const [purgeScheduled, setPurgeScheduled] = useState(false);
  const [retentionSaved, setRetentionSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "retention" | "export" | "purge">("overview");

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => { setExporting(false); setExportDone(true); setTimeout(() => setExportDone(false), 3000); }, 2000);
  };

  const handleSaveRetention = () => {
    setRetentionSaved(true);
    setTimeout(() => setRetentionSaved(false), 2500);
  };

  const handleSchedulePurge = () => {
    setPurgeScheduled(true);
    setTimeout(() => { setPurgeScheduled(false); setShowPurge(false); setPurgeApproval1(false); setPurgeApproval2(false); }, 3000);
  };

  const totalStorage = "4.31 TB";
  const usedPct = 43;

  const GrowthChart = () => {
    const maxVal = 10;
    return (
      <div className="flex items-end gap-2 h-20">
        {growthProjections.map((p, i) => {
          const h = (p.projected / maxVal) * 100;
          const isCurrent = i === 0;
          return (
            <div key={p.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-['JetBrains_Mono']" style={{ color: isCurrent ? "#D6B47E" : "#6B7280", fontSize: "10px" }}>
                {p.projected.toFixed(1)}
              </span>
              <div className="w-full rounded-t-sm transition-all" style={{ height: `${h}%`, background: isCurrent ? "#D6B47E" : "rgba(184,138,60,0.25)", minHeight: "4px" }} />
              <span className="text-gray-600 text-xs font-['Inter']" style={{ fontSize: "10px" }}>{p.month}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "ri-pie-chart-line" },
    { id: "retention", label: "Retention", icon: "ri-time-line" },
    { id: "export", label: "Export", icon: "ri-download-cloud-line" },
    { id: "purge", label: "Purge", icon: "ri-delete-bin-line" },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex items-center gap-1">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
            style={{
              background: activeTab === tab.id ? "rgba(184,138,60,0.12)" : "rgba(255,255,255,0.03)",
              color: activeTab === tab.id ? "#D6B47E" : "#9CA3AF",
              border: activeTab === tab.id ? "1px solid rgba(184,138,60,0.25)" : "1px solid rgba(255,255,255,0.06)",
            }}>
            <i className={tab.icon} />{tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Storage Overview */}
          <div className="rounded-xl p-5" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.12)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm font-['Inter']">
                <i className="ri-database-2-line mr-2 text-gold-400" />Storage Overview
              </h3>
              <div className="text-right">
                <p className="text-gold-400 text-xl font-bold font-['JetBrains_Mono']">{totalStorage}</p>
                <p className="text-gray-500 text-xs font-['Inter']">of 10 TB allocated</p>
              </div>
            </div>
            <div className="mb-5">
              <div className="flex justify-between text-xs text-gray-500 font-['JetBrains_Mono'] mb-1.5">
                <span>Used: {usedPct}%</span>
                <span>Free: {100 - usedPct}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full" style={{ width: `${usedPct}%`, background: "linear-gradient(90deg, #D6B47E, #B88A3C)" }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {streams.map((s) => {
                const rec = streamRecords[s.id];
                if (!rec) return null;
                return (
                  <div key={s.id} className="flex items-center gap-2">
                    <i className={`${s.icon} text-xs flex-shrink-0`} style={{ color: s.color }} />
                    <span className="text-gray-500 text-xs font-['Inter'] w-28 truncate">{s.name.split(" ")[0]}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(rec.pct, 100)}%`, background: s.color }} />
                    </div>
                    <span className="text-gray-500 text-xs font-['JetBrains_Mono'] w-16 text-right">{rec.size}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Growth Projection + Record Counts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-5" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.12)" }}>
              <h3 className="text-white font-semibold text-sm font-['Inter'] mb-1">
                <i className="ri-line-chart-line mr-2 text-gold-400" />Growth Projection (6 months)
              </h3>
              <p className="text-gray-500 text-xs font-['Inter'] mb-4">Estimated storage growth at current rate</p>
              <GrowthChart />
              <div className="mt-3 flex items-center justify-between text-xs font-['JetBrains_Mono']">
                <span className="text-gray-500">Current: <span className="text-gold-400">4.31 TB</span></span>
                <span className="text-gray-500">Sep 2026: <span className="text-yellow-400">5.91 TB</span></span>
                <span className="text-gray-500">Capacity: <span className="text-green-400">10 TB</span></span>
              </div>
            </div>

            <div className="rounded-xl p-5" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.12)" }}>
              <h3 className="text-white font-semibold text-sm font-['Inter'] mb-3">
                <i className="ri-bar-chart-2-line mr-2 text-gold-400" />Top Streams by Volume
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Public Transport", count: "234.1M", pct: 100, color: "#C98A1B" },
                  { name: "Social Intelligence", count: "445.2M", pct: 100, color: "#38BDF8" },
                  { name: "Borders & Immigration", count: "156.7M", pct: 67, color: "#60A5FA" },
                  { name: "E-Commerce", count: "67.3M", pct: 29, color: "#34D399" },
                  { name: "Financial Services", count: "89.4M", pct: 38, color: "#4ADE80" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs font-['Inter'] w-36 truncate">{item.name}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                    </div>
                    <span className="text-xs font-['JetBrains_Mono'] w-16 text-right" style={{ color: item.color }}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Record counts table */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(184,138,60,0.12)" }}>
            <div className="px-4 py-3" style={{ background: "rgba(184,138,60,0.05)" }}>
              <p className="text-white text-sm font-semibold font-['Inter']">
                <i className="ri-table-line mr-2 text-gold-400" />Record Counts by Stream
              </p>
            </div>
            <div className="grid px-4 py-2 text-xs font-semibold uppercase tracking-wider font-['Inter'] text-gray-600"
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
              <span>Stream</span><span>Records</span><span>Storage</span><span>Growth</span><span>Retention</span>
            </div>
            {streams.map((s, i) => {
              const rec = streamRecords[s.id];
              if (!rec) return null;
              return (
                <div key={s.id} className="grid px-4 py-2.5 items-center hover:bg-white/[0.01] transition-colors"
                  style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div className="flex items-center gap-2">
                    <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
                    <span className="text-gray-300 text-xs font-['Inter']">{s.name}</span>
                  </div>
                  <span className="text-white text-xs font-['JetBrains_Mono']">{rec.count}</span>
                  <span className="text-gold-400 text-xs font-['JetBrains_Mono']">{rec.size}</span>
                  <span className="text-green-400 text-xs font-['JetBrains_Mono']">{rec.growth}</span>
                  <span className="text-gray-400 text-xs font-['JetBrains_Mono']">{retentions[s.id] || 7} yrs</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Retention Tab */}
      {activeTab === "retention" && (
        <div className="rounded-xl p-5" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.12)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm font-['Inter']">
              <i className="ri-time-line mr-2 text-gold-400" />Retention Periods by Stream
            </h3>
            <p className="text-gray-500 text-xs font-['Inter']">Default: 7 years. Legal minimum: 5 years.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {streams.map((s) => (
              <div key={s.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
                    <span className="text-gray-300 text-xs font-['Inter']">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gold-400 text-xs font-['JetBrains_Mono'] font-bold">{retentions[s.id] || 7} yrs</span>
                    {(retentions[s.id] || 7) < 5 && <span className="text-red-400 text-xs font-['JetBrains_Mono']">⚠ Below min</span>}
                  </div>
                </div>
                <input type="range" min={1} max={20} value={retentions[s.id] || 7}
                  onChange={(e) => setRetentions((prev) => ({ ...prev, [s.id]: Number(e.target.value) }))}
                  className="w-full h-1.5 rounded-full cursor-pointer appearance-none"
                  style={{ accentColor: "#D6B47E", background: `linear-gradient(90deg, #D6B47E ${((retentions[s.id] || 7) / 20) * 100}%, rgba(255,255,255,0.1) 0%)` }} />
                <div className="flex justify-between text-xs text-gray-700 font-['JetBrains_Mono'] mt-0.5">
                  <span>1yr</span><span>10yr</span><span>20yr</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-6">
            <button onClick={handleSaveRetention}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap"
              style={{ background: "#D6B47E", color: "#051428" }}>
              <i className="ri-save-line mr-2" />Save Retention Policies
            </button>
            {retentionSaved && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>
                <i className="ri-check-line text-green-400 text-xs" />
                <span className="text-green-400 text-xs font-['Inter']">Retention policies saved</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export Tab */}
      {activeTab === "export" && (
        <div className="rounded-xl p-5" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.12)" }}>
          <h3 className="text-white font-semibold text-sm font-['Inter'] mb-4">
            <i className="ri-download-cloud-line mr-2 text-gold-400" />Bulk Data Export
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-['Inter'] uppercase tracking-wider">Stream</label>
              <select value={exportStream} onChange={(e) => setExportStream(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
                style={{ background: "rgba(10,37,64,0.9)", border: "1px solid rgba(184,138,60,0.2)", color: "#D1D5DB" }}>
                {streams.map((s) => <option key={s.id} value={s.id} style={{ background: "#0A2540" }}>{s.name} ({s.code})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-['Inter'] uppercase tracking-wider">Format</label>
              <div className="flex gap-2">
                {["csv", "json", "xlsx", "parquet"].map((f) => (
                  <button key={f} onClick={() => setExportFormat(f)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold cursor-pointer uppercase whitespace-nowrap"
                    style={{ background: exportFormat === f ? "#D6B47E" : "rgba(255,255,255,0.05)", color: exportFormat === f ? "#051428" : "#9CA3AF" }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-['Inter'] uppercase tracking-wider">Date From</label>
              <input type="date" value={exportFrom} onChange={(e) => setExportFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,138,60,0.2)", color: "#D1D5DB", colorScheme: "dark" }} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-['Inter'] uppercase tracking-wider">Date To</label>
              <input type="date" value={exportTo} onChange={(e) => setExportTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,138,60,0.2)", color: "#D1D5DB", colorScheme: "dark" }} />
            </div>
          </div>
          {/* Preview */}
          <div className="p-3 rounded-lg mb-4" style={{ background: "rgba(184,138,60,0.04)", border: "1px solid rgba(184,138,60,0.1)" }}>
            <p className="text-gray-500 text-xs font-['Inter'] mb-1">Export Preview</p>
            <div className="flex items-center gap-4 text-xs font-['JetBrains_Mono']">
              <span className="text-white">Stream: <span className="text-gold-400">{streams.find((s) => s.id === exportStream)?.code}</span></span>
              <span className="text-white">Format: <span className="text-gold-400">{exportFormat.toUpperCase()}</span></span>
              <span className="text-white">Est. Records: <span className="text-yellow-400">{streamRecords[exportStream]?.count || "—"}</span></span>
              <span className="text-white">Est. Size: <span className="text-green-400">{streamRecords[exportStream]?.size || "—"}</span></span>
            </div>
          </div>
          <button onClick={handleExport} disabled={exporting}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-all"
            style={{ background: exporting ? "rgba(184,138,60,0.4)" : "#D6B47E", color: "#051428" }}>
            {exporting ? <><i className="ri-loader-4-line animate-spin mr-2" />Exporting...</> : <><i className="ri-download-line mr-2" />Export Data</>}
          </button>
          {exportDone && (
            <div className="flex items-center gap-2 mt-3 p-3 rounded-lg" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>
              <i className="ri-check-line text-green-400" />
              <span className="text-green-400 text-sm font-['Inter']">Export ready — download started</span>
            </div>
          )}
        </div>
      )}

      {/* Purge Tab */}
      {activeTab === "purge" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl" style={{ background: "rgba(201,74,94,0.06)", border: "1px solid rgba(201,74,94,0.2)" }}>
            <div className="flex items-center gap-2 mb-2">
              <i className="ri-alert-line text-red-400" />
              <p className="text-red-400 text-sm font-semibold font-['Inter']">Data Purge — Irreversible Operation</p>
            </div>
            <p className="text-gray-400 text-xs font-['Inter']">
              Permanently deletes records beyond the retention period. Requires two-person authorization. All purge operations are logged in the immutable audit trail.
            </p>
          </div>

          <div className="rounded-xl p-5" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.12)" }}>
            <h3 className="text-white font-semibold text-sm font-['Inter'] mb-4">
              <i className="ri-calendar-schedule-line mr-2 text-gold-400" />Schedule Purge
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-['Inter'] uppercase tracking-wider">Stream to Purge</label>
                <select value={purgeStream} onChange={(e) => setPurgeStream(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
                  style={{ background: "rgba(10,37,64,0.9)", border: "1px solid rgba(184,138,60,0.2)", color: "#D1D5DB" }}>
                  {streams.map((s) => <option key={s.id} value={s.id} style={{ background: "#0A2540" }}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-['Inter'] uppercase tracking-wider">Purge Records Before Year</label>
                <select value={purgeYear} onChange={(e) => setPurgeYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
                  style={{ background: "rgba(10,37,64,0.9)", border: "1px solid rgba(184,138,60,0.2)", color: "#D1D5DB" }}>
                  {["2015", "2016", "2017", "2018", "2019", "2020"].map((y) => <option key={y} value={y} style={{ background: "#0A2540" }}>{y}</option>)}
                </select>
              </div>
            </div>

            <div className="p-3 rounded-lg mb-4" style={{ background: "rgba(201,74,94,0.06)", border: "1px solid rgba(201,74,94,0.15)" }}>
              <p className="text-red-400 text-xs font-semibold font-['Inter'] mb-2">⚠ Two-Person Authorization Required</p>
              <div className="space-y-2">
                {[
                  { label: "Approval 1 — Senior Analyst (analyst.fatima)", value: purgeApproval1, onChange: setPurgeApproval1 },
                  { label: "Approval 2 — System Admin (admin.khalid)", value: purgeApproval2, onChange: setPurgeApproval2 },
                ].map((a) => (
                  <label key={a.label} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={a.value} onChange={(e) => a.onChange(e.target.checked)}
                      className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: "#D6B47E" }} />
                    <span className="text-gray-400 text-xs font-['Inter']">{a.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={!purgeApproval1 || !purgeApproval2}
                onClick={handleSchedulePurge}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-all"
                style={{ background: purgeApproval1 && purgeApproval2 ? "#C94A5E" : "rgba(201,74,94,0.2)", color: purgeApproval1 && purgeApproval2 ? "#fff" : "#C94A5E" }}>
                <i className="ri-delete-bin-line mr-2" />Schedule Purge
              </button>
              {purgeScheduled && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  <i className="ri-check-line text-green-400 text-xs" />
                  <span className="text-green-400 text-xs font-['Inter']">Purge scheduled — will execute at 02:00 UTC</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagement;
