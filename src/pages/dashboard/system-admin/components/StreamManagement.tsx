import { useState } from "react";
import { streams, type StreamConfig } from "@/mocks/systemAdminData";

const StreamManagement = () => {
  const [streamList, setStreamList] = useState<StreamConfig[]>(streams);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddEvent, setShowAddEvent] = useState<string | null>(null);
  const [newEventName, setNewEventName] = useState("");
  const [customEvents, setCustomEvents] = useState<Record<string, string[]>>({});
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "disabled">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [search, setSearch] = useState("");

  const toggleStream = (id: string) => {
    setStreamList((prev) => prev.map((s) => s.id === id ? { ...s, status: s.status === "active" ? "disabled" : "active" } : s));
  };

  const addCustomEvent = (streamId: string) => {
    if (!newEventName.trim()) return;
    setCustomEvents((prev) => ({ ...prev, [streamId]: [...(prev[streamId] || []), newEventName.trim()] }));
    setNewEventName("");
    setShowAddEvent(null);
  };

  const categories = ["all", ...Array.from(new Set(streamList.map((s) => s.category)))];

  const filtered = streamList.filter((s) => {
    const statusOk = filterStatus === "all" || s.status === filterStatus;
    const catOk = filterCategory === "all" || s.category === filterCategory;
    const searchOk = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase());
    return statusOk && catOk && searchOk;
  });

  const totalEventsToday = streamList.reduce((a, s) => a + s.eventsToday, 0);

  return (
    <div>
      {/* Header stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Streams", value: String(streamList.length), icon: "ri-stack-line", color: "#D6B47E" },
          { label: "Active", value: String(streamList.filter((s) => s.status === "active").length), icon: "ri-checkbox-circle-line", color: "#4ADE80" },
          { label: "Disabled", value: String(streamList.filter((s) => s.status === "disabled").length), icon: "ri-close-circle-line", color: "#C94A5E" },
          { label: "Events Today", value: totalEventsToday.toLocaleString(), icon: "ri-pulse-line", color: "#FACC15" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.12)" }}>
            <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${stat.color}18` }}>
              <i className={`${stat.icon} text-base`} style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-white text-lg font-bold font-['JetBrains_Mono']">{stat.value}</p>
              <p className="text-gray-500 text-xs font-['Inter']">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex gap-1.5">
          {(["all", "active", "disabled"] as const).map((f) => (
            <button key={f} onClick={() => setFilterStatus(f)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold font-['Inter'] whitespace-nowrap cursor-pointer transition-all capitalize"
              style={{ background: filterStatus === f ? "#D6B47E" : "rgba(255,255,255,0.05)", color: filterStatus === f ? "#051428" : "#9CA3AF", border: filterStatus === f ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs outline-none cursor-pointer"
          style={{ background: "rgba(10,37,64,0.9)", border: "1px solid rgba(184,138,60,0.2)", color: "#D1D5DB" }}>
          {categories.map((c) => <option key={c} value={c} style={{ background: "#0A2540" }}>{c === "all" ? "All Categories" : c}</option>)}
        </select>
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search streams..."
            className="pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,138,60,0.15)", color: "#D1D5DB", fontFamily: "'Inter', sans-serif", width: "160px" }} />
        </div>
        <span className="ml-auto text-gray-600 text-xs font-['JetBrains_Mono']">{filtered.length} streams</span>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(184,138,60,0.12)" }}>
        {/* Header */}
        <div className="grid px-4 py-3 text-xs font-semibold uppercase tracking-wider font-['Inter']"
          style={{ background: "rgba(184,138,60,0.05)", color: "#9CA3AF", gridTemplateColumns: "2.2fr 1.1fr 0.9fr 0.9fr 1fr 0.9fr 0.8fr 70px" }}>
          <span>Stream</span>
          <span>Code</span>
          <span>Status</span>
          <span>Entities</span>
          <span>Events Today</span>
          <span>Val. Rules</span>
          <span>Req. Fields</span>
          <span className="text-center">Toggle</span>
        </div>

        {filtered.map((stream, idx) => (
          <div key={stream.id}>
            {/* Row */}
            <div
              className="grid px-4 py-3 cursor-pointer transition-colors hover:bg-white/[0.02]"
              style={{ gridTemplateColumns: "2.2fr 1.1fr 0.9fr 0.9fr 1fr 0.9fr 0.8fr 70px", borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.04)" : "none", opacity: stream.status === "disabled" ? 0.55 : 1 }}
              onClick={() => setExpandedId(expandedId === stream.id ? null : stream.id)}
            >
              {/* Name */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${stream.color}15` }}>
                  <i className={`${stream.icon} text-sm`} style={{ color: stream.color }} />
                </div>
                <div>
                  <p className="text-white text-sm font-['Inter'] font-medium">{stream.name}</p>
                  <p className="text-gray-600 text-xs font-['Inter']">{stream.category}</p>
                </div>
              </div>
              {/* Code */}
              <div className="flex items-center">
                <span className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono'] font-semibold" style={{ background: "rgba(184,138,60,0.1)", color: "#D6B47E" }}>{stream.code}</span>
              </div>
              {/* Status */}
              <div className="flex items-center">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold font-['Inter']"
                  style={{ background: stream.status === "active" ? "rgba(74,222,128,0.12)" : "rgba(201,74,94,0.12)", color: stream.status === "active" ? "#4ADE80" : "#C94A5E" }}>
                  {stream.status === "active" ? "Active" : "Disabled"}
                </span>
              </div>
              {/* Entities */}
              <div className="flex items-center">
                <span className="text-white text-sm font-['JetBrains_Mono']">{stream.entityCount.toLocaleString()}</span>
              </div>
              {/* Events */}
              <div className="flex items-center gap-2">
                <span className="text-gold-400 text-sm font-['JetBrains_Mono']">{stream.eventsToday.toLocaleString()}</span>
                {stream.eventsToday > 10000 && <span className="text-xs text-yellow-400 font-['JetBrains_Mono']">↑ High</span>}
              </div>
              {/* Rules */}
              <div className="flex items-center">
                <span className="text-gray-400 text-sm font-['JetBrains_Mono']">{stream.validationRules}</span>
              </div>
              {/* Required Fields count */}
              <div className="flex items-center">
                <span className="text-gray-400 text-sm font-['JetBrains_Mono']">{stream.requiredFields.length}</span>
              </div>
              {/* Toggle */}
              <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => toggleStream(stream.id)}
                  className="relative inline-flex items-center w-10 h-5 rounded-full transition-colors cursor-pointer"
                  style={{ background: stream.status === "active" ? "#D6B47E" : "rgba(255,255,255,0.1)" }}>
                  <span className="inline-block w-3.5 h-3.5 rounded-full bg-white transition-transform" style={{ transform: stream.status === "active" ? "translateX(22px)" : "translateX(3px)" }} />
                </button>
              </div>
            </div>

            {/* Expanded detail */}
            {expandedId === stream.id && (
              <div className="px-4 pb-5 pt-3" style={{ background: "rgba(184,138,60,0.02)", borderTop: "1px solid rgba(184,138,60,0.08)" }}>
                <div className="grid grid-cols-3 gap-5">
                  {/* Required Fields */}
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-['Inter'] mb-2">Required Fields ({stream.requiredFields.length})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {stream.requiredFields.map((f) => (
                        <span key={f} className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono']"
                          style={{ background: "rgba(184,138,60,0.08)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.15)" }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stream Stats */}
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-['Inter'] mb-2">Stream Statistics</p>
                    <div className="space-y-1.5">
                      {[
                        { label: "Events Today", value: stream.eventsToday.toLocaleString(), color: "#D6B47E" },
                        { label: "Total Entities", value: stream.entityCount.toLocaleString(), color: "#D1D5DB" },
                        { label: "Validation Rules", value: String(stream.validationRules), color: "#FACC15" },
                        { label: "Stream Code", value: stream.code, color: "#D6B47E" },
                      ].map((stat) => (
                        <div key={stat.label} className="flex items-center justify-between">
                          <span className="text-gray-500 text-xs font-['Inter']">{stat.label}</span>
                          <span className="text-xs font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Event Types */}
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-['Inter'] mb-2">Custom Event Types</p>
                    {(customEvents[stream.id] || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {(customEvents[stream.id] || []).map((ev) => (
                          <span key={ev} className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono']"
                            style={{ background: "rgba(74,222,128,0.08)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.2)" }}>
                            {ev}
                          </span>
                        ))}
                      </div>
                    )}
                    {showAddEvent === stream.id ? (
                      <div className="flex gap-2">
                        <input value={newEventName} onChange={(e) => setNewEventName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addCustomEvent(stream.id)}
                          placeholder="Event type name..."
                          className="flex-1 px-3 py-1.5 rounded-lg text-xs outline-none"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,138,60,0.3)", color: "#D1D5DB", fontFamily: "'Inter', sans-serif" }} />
                        <button onClick={() => addCustomEvent(stream.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                          style={{ background: "#D6B47E", color: "#051428" }}>Add</button>
                        <button onClick={() => setShowAddEvent(null)}
                          className="px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                          style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF" }}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setShowAddEvent(stream.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors"
                        style={{ background: "rgba(184,138,60,0.08)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.2)" }}>
                        <i className="ri-add-line" />Add Custom Event Type
                      </button>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                    style={{ background: "#D6B47E", color: "#051428" }}>
                    <i className="ri-edit-line" />Edit Stream Config
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer whitespace-nowrap"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <i className="ri-bar-chart-line" />View Analytics
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer whitespace-nowrap"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <i className="ri-shield-check-line" />View Rules
                  </button>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: stream.status === "active" ? "#4ADE80" : "#C94A5E" }} />
                    <span className="text-xs font-['JetBrains_Mono']" style={{ color: stream.status === "active" ? "#4ADE80" : "#C94A5E" }}>
                      {stream.status === "active" ? "Stream Active" : "Stream Disabled"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreamManagement;
