import { useState } from "react";
import { webhooks, sandboxLogs, streamGuides, type WebhookConfig } from "@/mocks/apiPortalData";

const statusConfig: Record<string, { color: string; bg: string; icon: string }> = {
  active:  { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",  icon: "ri-checkbox-circle-line" },
  paused:  { color: "#FACC15", bg: "rgba(250,204,21,0.1)",  icon: "ri-pause-circle-line" },
  failed:  { color: "#F87171", bg: "rgba(248,113,113,0.1)", icon: "ri-close-circle-line" },
};

const resultColors: Record<string, string> = {
  accepted:   "#4ADE80",
  rejected:   "#F87171",
  flagged:    "#FACC15",
  processing: "#22D3EE",
};

const WebhooksAndSandbox = () => {
  const [activeSection, setActiveSection] = useState<"webhooks" | "sandbox" | "guides">("webhooks");
  const [hookList, setHookList] = useState<WebhookConfig[]>(webhooks);
  const [showAddHook, setShowAddHook] = useState(false);
  const [newHookUrl, setNewHookUrl] = useState("");
  const [newHookName, setNewHookName] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["event.accepted"]);
  const [revealedSecret, setRevealedSecret] = useState<string | null>(null);
  const [sandboxInput, setSandboxInput] = useState(`{\n  "guestName": "Ahmed Al-Rashidi",\n  "documentNumber": "AB123456",\n  "nationality": "OMN",\n  "checkInDate": "2025-04-10",\n  "checkOutDate": "2025-04-13",\n  "roomNumber": "204",\n  "hotelCode": "HTL-001"\n}`);
  const [sandboxEndpoint, setSandboxEndpoint] = useState("/v2/hotel/booking");
  const [sandboxRunning, setSandboxRunning] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<string | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string | null>("sg1");

  const allEvents = ["event.accepted", "event.rejected", "event.flagged", "batch.completed", "batch.failed", "risk.high", "risk.critical", "pattern.triggered", "api.key_expiry", "rate_limit.warning"];

  const toggleEvent = (ev: string) => {
    setSelectedEvents((prev) => prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev]);
  };

  const toggleHookStatus = (id: string) => {
    setHookList((prev) => prev.map((h) => h.id === id ? { ...h, status: h.status === "active" ? "paused" : "active" } : h));
  };

  const runSandbox = () => {
    setSandboxRunning(true);
    setTimeout(() => {
      setSandboxRunning(false);
      setSandboxResult(JSON.stringify({
        status: "accepted",
        referenceId: `HTL-2025-${Math.floor(Math.random() * 90000 + 10000)}`,
        timestamp: new Date().toISOString(),
        riskScore: Math.floor(Math.random() * 30),
        message: "Booking submitted successfully (sandbox)",
        environment: "sandbox",
      }, null, 2));
    }, 1000);
  };

  const sections = [
    { id: "webhooks", label: "Webhooks",     icon: "ri-webhook-line" },
    { id: "sandbox",  label: "Sandbox",      icon: "ri-test-tube-line" },
    { id: "guides",   label: "Stream Guides",icon: "ri-book-2-line" },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Section tabs */}
      <div className="flex gap-2">
        {sections.map((s) => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap transition-all"
            style={{ background: activeSection === s.id ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.04)", color: activeSection === s.id ? "#22D3EE" : "#6B7280", border: `1px solid ${activeSection === s.id ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.06)"}`, fontFamily: "'Inter', sans-serif" }}>
            <i className={s.icon} />
            {s.label}
          </button>
        ))}
      </div>

      {/* WEBHOOKS */}
      {activeSection === "webhooks" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Object.entries(statusConfig).map(([status, cfg]) => (
                <div key={status} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                  <span className="text-gray-500 text-xs font-['Inter'] capitalize">{status}: {hookList.filter((h) => h.status === status).length}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowAddHook(!showAddHook)}
              className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap"
              style={{ background: "#22D3EE", color: "#060D1A" }}>
              <i className="ri-add-line mr-1" />Add Webhook
            </button>
          </div>

          {/* Add webhook form */}
          {showAddHook && (
            <div className="rounded-xl p-5" style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.2)" }}>
              <p className="text-white text-sm font-semibold font-['Inter'] mb-4">
                <i className="ri-webhook-line mr-2 text-cyan-400" />New Webhook Endpoint
              </p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-['Inter'] uppercase tracking-wider">Name</label>
                  <input value={newHookName} onChange={(e) => setNewHookName(e.target.value)} placeholder="e.g. Production Events"
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,211,238,0.2)", color: "#D1D5DB", fontFamily: "'Inter', sans-serif" }} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-['Inter'] uppercase tracking-wider">Endpoint URL</label>
                  <input value={newHookUrl} onChange={(e) => setNewHookUrl(e.target.value)} placeholder="https://your-server.com/webhook"
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none font-['JetBrains_Mono']"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,211,238,0.2)", color: "#D1D5DB" }} />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-2 font-['Inter'] uppercase tracking-wider">Subscribe to Events</label>
                <div className="flex flex-wrap gap-2">
                  {allEvents.map((ev) => (
                    <button key={ev} onClick={() => toggleEvent(ev)}
                      className="px-2.5 py-1 rounded text-xs font-['JetBrains_Mono'] cursor-pointer transition-all"
                      style={{ background: selectedEvents.includes(ev) ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.04)", color: selectedEvents.includes(ev) ? "#22D3EE" : "#6B7280", border: `1px solid ${selectedEvents.includes(ev) ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                      {selectedEvents.includes(ev) && <i className="ri-check-line mr-1 text-xs" />}
                      {ev}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAddHook(false)} className="px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap" style={{ background: "#22D3EE", color: "#060D1A" }}>
                  Create Webhook
                </button>
                <button onClick={() => setShowAddHook(false)} className="px-5 py-2 rounded-lg text-sm cursor-pointer whitespace-nowrap" style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Webhook cards */}
          <div className="space-y-3">
            {hookList.map((hook) => {
              const sc = statusConfig[hook.status];
              const isRevealed = revealedSecret === hook.id;
              return (
                <div key={hook.id} className="rounded-xl p-5" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.1)" }}>
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <p className="text-white font-semibold text-sm font-['Inter']">{hook.name}</p>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold font-['Inter']" style={{ background: sc.bg, color: sc.color }}>
                          <i className={`${sc.icon} text-xs`} />
                          {hook.status.charAt(0).toUpperCase() + hook.status.slice(1)}
                        </span>
                      </div>
                      <code className="text-cyan-300 text-xs font-['JetBrains_Mono'] block mb-3">{hook.url}</code>

                      {/* Events */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {hook.events.map((ev) => (
                          <span key={ev} className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono']" style={{ background: "rgba(34,211,238,0.08)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.12)" }}>
                            {ev}
                          </span>
                        ))}
                      </div>

                      {/* Secret */}
                      <div className="flex items-center gap-2 p-2 rounded-lg mb-3" style={{ background: "rgba(0,0,0,0.2)" }}>
                        <span className="text-gray-600 text-xs font-['Inter']">Secret:</span>
                        <code className="text-xs font-['JetBrains_Mono'] flex-1 truncate" style={{ color: "#9CA3AF" }}>
                          {isRevealed ? hook.secret : `whsec_${"•".repeat(32)}`}
                        </code>
                        <button onClick={() => setRevealedSecret(isRevealed ? null : hook.id)}
                          className="text-gray-600 hover:text-gray-400 cursor-pointer">
                          <i className={`text-xs ${isRevealed ? "ri-eye-off-line" : "ri-eye-line"}`} />
                        </button>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-gray-600 text-xs font-['Inter']">Success Rate</p>
                          <p className="font-bold text-sm font-['JetBrains_Mono']" style={{ color: hook.successRate > 95 ? "#4ADE80" : hook.successRate > 80 ? "#FACC15" : "#F87171" }}>
                            {hook.successRate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs font-['Inter']">Total Deliveries</p>
                          <p className="text-white text-sm font-bold font-['JetBrains_Mono']">{hook.totalDeliveries.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs font-['Inter']">Last Delivery</p>
                          <p className="text-gray-400 text-sm font-['JetBrains_Mono']">{hook.lastDelivery}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button onClick={() => toggleHookStatus(hook.id)}
                        className="px-3 py-1.5 rounded-lg text-xs cursor-pointer whitespace-nowrap"
                        style={{ background: hook.status === "active" ? "rgba(250,204,21,0.1)" : "rgba(74,222,128,0.1)", color: hook.status === "active" ? "#FACC15" : "#4ADE80", border: `1px solid ${hook.status === "active" ? "rgba(250,204,21,0.2)" : "rgba(74,222,128,0.2)"}` }}>
                        {hook.status === "active" ? <><i className="ri-pause-line mr-1" />Pause</> : <><i className="ri-play-line mr-1" />Resume</>}
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs cursor-pointer whitespace-nowrap" style={{ background: "rgba(34,211,238,0.08)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.15)" }}>
                        <i className="ri-send-plane-line mr-1" />Test
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs cursor-pointer whitespace-nowrap" style={{ background: "rgba(248,113,113,0.08)", color: "#F87171", border: "1px solid rgba(248,113,113,0.15)" }}>
                        <i className="ri-delete-bin-line mr-1" />Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SANDBOX */}
      {activeSection === "sandbox" && (
        <div className="grid grid-cols-2 gap-4">
          {/* Left: Request builder */}
          <div className="space-y-4">
            <div className="rounded-xl p-5" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.12)" }}>
              <p className="text-white font-semibold text-sm font-['Inter'] mb-4">
                <i className="ri-test-tube-line mr-2 text-yellow-400" />
                Sandbox Request Builder
              </p>
              <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1 font-['Inter'] uppercase tracking-wider">Endpoint</label>
                <select value={sandboxEndpoint} onChange={(e) => setSandboxEndpoint(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none cursor-pointer font-['JetBrains_Mono']"
                  style={{ background: "rgba(10,22,40,0.9)", border: "1px solid rgba(34,211,238,0.2)", color: "#22D3EE" }}>
                  <option value="/v2/hotel/booking" style={{ background: "#0A1628" }}>POST /v2/hotel/booking</option>
                  <option value="/v2/hotel/checkin" style={{ background: "#0A1628" }}>POST /v2/hotel/checkin</option>
                  <option value="/v2/car-rental/booking" style={{ background: "#0A1628" }}>POST /v2/car-rental/booking</option>
                  <option value="/v2/mobile/sim-purchase" style={{ background: "#0A1628" }}>POST /v2/mobile/sim-purchase</option>
                  <option value="/v2/financial/large-cash" style={{ background: "#0A1628" }}>POST /v2/financial/large-cash</option>
                  <option value="/v2/batch/upload" style={{ background: "#0A1628" }}>POST /v2/batch/upload</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1 font-['Inter'] uppercase tracking-wider">Request Body (JSON)</label>
                <textarea value={sandboxInput} onChange={(e) => setSandboxInput(e.target.value)} rows={12}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none font-['JetBrains_Mono']"
                  style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(34,211,238,0.15)", color: "#22D3EE" }} />
              </div>
              <button onClick={runSandbox} disabled={sandboxRunning}
                className="w-full py-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-all"
                style={{ background: sandboxRunning ? "rgba(34,211,238,0.4)" : "#22D3EE", color: "#060D1A" }}>
                {sandboxRunning ? <><i className="ri-loader-4-line animate-spin mr-2" />Sending to Sandbox...</> : <><i className="ri-send-plane-line mr-2" />Send to Sandbox</>}
              </button>
            </div>
          </div>

          {/* Right: Response + Logs */}
          <div className="space-y-4">
            {sandboxResult && (
              <div className="rounded-xl p-5" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(74,222,128,0.2)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-green-400 text-sm font-semibold font-['JetBrains_Mono']">200 OK — 38ms</span>
                  <span className="ml-auto text-gray-600 text-xs font-['JetBrains_Mono']">sandbox</span>
                </div>
                <pre className="text-xs font-['JetBrains_Mono'] overflow-auto" style={{ color: "#4ADE80", maxHeight: "200px" }}>
                  {sandboxResult}
                </pre>
              </div>
            )}

            {/* Request log */}
            <div className="rounded-xl overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.12)" }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
                <p className="text-white text-sm font-semibold font-['Inter']">
                  <i className="ri-terminal-line mr-2 text-cyan-400" />
                  Request Log
                </p>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {sandboxLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="text-gray-600 text-xs font-['JetBrains_Mono'] w-16 flex-shrink-0">{log.time}</span>
                    <span className="px-1.5 py-0.5 rounded text-xs font-bold font-['JetBrains_Mono'] flex-shrink-0 w-10 text-center" style={{ background: log.method === "GET" ? "rgba(34,211,238,0.12)" : "rgba(74,222,128,0.12)", color: log.method === "GET" ? "#22D3EE" : "#4ADE80" }}>
                      {log.method}
                    </span>
                    <span className="text-gray-400 text-xs font-['JetBrains_Mono'] flex-1 truncate">{log.path}</span>
                    <span className="text-xs font-['JetBrains_Mono'] flex-shrink-0" style={{ color: log.status === 200 || log.status === 202 ? "#4ADE80" : "#F87171" }}>{log.status}</span>
                    <span className="text-gray-600 text-xs font-['JetBrains_Mono'] flex-shrink-0">{log.latency}</span>
                    <span className="px-1.5 py-0.5 rounded text-xs font-['JetBrains_Mono'] flex-shrink-0" style={{ background: `${resultColors[log.result]}18`, color: resultColors[log.result] }}>
                      {log.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STREAM GUIDES */}
      {activeSection === "guides" && (
        <div className="space-y-3">
          {streamGuides.map((guide) => {
            const isExpanded = expandedGuide === guide.id;
            return (
              <div key={guide.id} className="rounded-xl overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", border: `1px solid ${isExpanded ? "rgba(34,211,238,0.25)" : "rgba(34,211,238,0.1)"}` }}>
                {/* Header */}
                <button
                  onClick={() => setExpandedGuide(isExpanded ? null : guide.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: `${guide.color}15` }}>
                    <i className={`${guide.icon} text-base`} style={{ color: guide.color }} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold text-sm font-['Inter']">{guide.stream}</p>
                      <span className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono']" style={{ background: "rgba(34,211,238,0.08)", color: "#22D3EE" }}>{guide.code}</span>
                    </div>
                    <p className="text-gray-500 text-xs font-['Inter'] mt-0.5">{guide.description}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{guide.eventTypes.length} event types</span>
                    <i className={`text-gray-600 text-sm ${isExpanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}`} />
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
                    <div className="grid grid-cols-3 gap-4 mt-4 mb-4">
                      {[
                        { label: "Auth Method",  value: guide.authMethod },
                        { label: "Rate Limit",   value: guide.rateLimit },
                        { label: "Data Format",  value: guide.dataFormat },
                      ].map((m) => (
                        <div key={m.label} className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                          <p className="text-gray-600 text-xs font-['Inter'] mb-1">{m.label}</p>
                          <p className="text-gray-300 text-xs font-['JetBrains_Mono']">{m.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Event types */}
                    <div className="mb-4">
                      <p className="text-gray-500 text-xs uppercase tracking-wider font-['Inter'] mb-2">Supported Event Types</p>
                      <div className="flex flex-wrap gap-1.5">
                        {guide.eventTypes.map((ev) => (
                          <span key={ev} className="px-2.5 py-1 rounded text-xs font-['JetBrains_Mono']" style={{ background: `${guide.color}10`, color: guide.color, border: `1px solid ${guide.color}25` }}>
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Sample code */}
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider font-['Inter'] mb-2">Sample Request (cURL)</p>
                      <pre className="p-4 rounded-lg text-xs font-['JetBrains_Mono'] overflow-auto" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(34,211,238,0.1)", color: "#22D3EE", maxHeight: "200px" }}>
                        {guide.sampleCode}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WebhooksAndSandbox;
