import { useState } from "react";
import { endpoints, type ApiEndpoint } from "@/mocks/apiPortalData";

const methodColors: Record<string, { color: string; bg: string }> = {
  POST:   { color: "#4ADE80", bg: "rgba(74,222,128,0.12)" },
  GET:    { color: "#22D3EE", bg: "rgba(34,211,238,0.12)" },
  PUT:    { color: "#FACC15", bg: "rgba(250,204,21,0.12)" },
  DELETE: { color: "#F87171", bg: "rgba(248,113,113,0.12)" },
  PATCH:  { color: "#FB923C", bg: "rgba(251,146,60,0.12)" },
};

const categories = ["All", ...Array.from(new Set(endpoints.map((e) => e.category)))];

const InteractiveDocs = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(endpoints[0]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [tryItBody, setTryItBody] = useState(JSON.stringify(endpoints[0].requestBody, null, 2));
  const [tryItResponse, setTryItResponse] = useState<string | null>(null);
  const [tryItLoading, setTryItLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"request" | "response" | "headers">("request");
  const [apiKeyInput, setApiKeyInput] = useState("amn_test_HTL_b9e4d3c2f1a8b5c8d1e4f7a0b3c6d9e2");

  const filteredEndpoints = endpoints.filter((e) => activeCategory === "All" || e.category === activeCategory);

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEndpoint(ep);
    setTryItBody(JSON.stringify(ep.requestBody, null, 2));
    setTryItResponse(null);
  };

  const handleTryIt = () => {
    setTryItLoading(true);
    setTimeout(() => {
      setTryItLoading(false);
      setTryItResponse(JSON.stringify(selectedEndpoint.responseExample, null, 2));
    }, 800);
  };

  const mc = methodColors[selectedEndpoint.method];

  return (
    <div className="flex gap-4 h-full" style={{ minHeight: "700px" }}>
      {/* Left: Endpoint Tree */}
      <div className="w-64 flex-shrink-0 rounded-xl overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.12)" }}>
        {/* Search */}
        <div className="p-3 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,211,238,0.15)" }}>
            <i className="ri-search-line text-gray-600 text-xs" />
            <input placeholder="Search endpoints..." className="flex-1 bg-transparent text-xs outline-none text-gray-400 font-['Inter']" style={{ minWidth: 0 }} />
          </div>
        </div>

        {/* Category filters */}
        <div className="p-2 border-b flex flex-wrap gap-1" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
          {categories.map((c) => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className="px-2 py-0.5 rounded text-xs cursor-pointer whitespace-nowrap"
              style={{ background: activeCategory === c ? "rgba(34,211,238,0.15)" : "transparent", color: activeCategory === c ? "#22D3EE" : "#6B7280" }}>
              {c}
            </button>
          ))}
        </div>

        {/* Endpoint list */}
        <div className="overflow-y-auto" style={{ maxHeight: "580px", scrollbarWidth: "none" }}>
          {filteredEndpoints.map((ep) => {
            const mc2 = methodColors[ep.method];
            const isActive = selectedEndpoint.id === ep.id;
            return (
              <button key={ep.id} onClick={() => handleSelectEndpoint(ep)}
                className="w-full flex items-start gap-2 px-3 py-2.5 text-left cursor-pointer transition-colors hover:bg-white/[0.02]"
                style={{ background: isActive ? "rgba(34,211,238,0.06)" : "transparent", borderLeft: isActive ? "2px solid #22D3EE" : "2px solid transparent" }}>
                <span className="px-1.5 py-0.5 rounded text-xs font-bold font-['JetBrains_Mono'] flex-shrink-0 mt-0.5" style={{ background: mc2.bg, color: mc2.color, minWidth: "40px", textAlign: "center" }}>
                  {ep.method}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-['JetBrains_Mono'] truncate" style={{ color: isActive ? "#22D3EE" : "#9CA3AF" }}>{ep.path}</p>
                  <p className="text-gray-600 text-xs font-['Inter'] truncate">{ep.summary}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Endpoint Detail + Try It */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Endpoint header */}
        <div className="rounded-xl p-5" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.12)" }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded text-sm font-bold font-['JetBrains_Mono']" style={{ background: mc.bg, color: mc.color }}>
              {selectedEndpoint.method}
            </span>
            <code className="text-white text-sm font-['JetBrains_Mono']">{selectedEndpoint.path}</code>
            <span className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono']" style={{ background: "rgba(34,211,238,0.08)", color: "#22D3EE" }}>
              {selectedEndpoint.streamCode}
            </span>
          </div>
          <h2 className="text-white text-lg font-semibold font-['Inter'] mb-2">{selectedEndpoint.summary}</h2>
          <p className="text-gray-400 text-sm font-['Inter']">{selectedEndpoint.description}</p>

          {/* Required fields */}
          <div className="mt-3">
            <p className="text-gray-600 text-xs uppercase tracking-wider font-['Inter'] mb-2">Required Fields</p>
            <div className="flex flex-wrap gap-1.5">
              {selectedEndpoint.requiredFields.map((f) => (
                <span key={f} className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono']" style={{ background: "rgba(248,113,113,0.08)", color: "#F87171", border: "1px solid rgba(248,113,113,0.15)" }}>
                  {f} *
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Request / Response / Headers */}
        <div className="rounded-xl overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.12)" }}>
          <div className="flex border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
            {(["request", "response", "headers"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-5 py-3 text-sm font-medium cursor-pointer capitalize transition-colors"
                style={{ color: activeTab === tab ? "#22D3EE" : "#6B7280", borderBottom: activeTab === tab ? "2px solid #22D3EE" : "2px solid transparent", fontFamily: "'Inter', sans-serif" }}>
                {tab === "request" ? "Request Body" : tab === "response" ? "Response Example" : "Headers"}
              </button>
            ))}
          </div>

          <div className="p-4">
            {activeTab === "request" && (
              <pre className="text-xs font-['JetBrains_Mono'] overflow-auto" style={{ color: "#22D3EE", maxHeight: "200px" }}>
                {JSON.stringify(selectedEndpoint.requestBody, null, 2)}
              </pre>
            )}
            {activeTab === "response" && (
              <pre className="text-xs font-['JetBrains_Mono'] overflow-auto" style={{ color: "#4ADE80", maxHeight: "200px" }}>
                {JSON.stringify(selectedEndpoint.responseExample, null, 2)}
              </pre>
            )}
            {activeTab === "headers" && (
              <div className="space-y-2">
                {selectedEndpoint.headers.map((h) => (
                  <div key={h.name} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <code className="text-cyan-400 text-xs font-['JetBrains_Mono'] w-36 flex-shrink-0">{h.name}</code>
                    {h.required && <span className="text-red-400 text-xs font-['JetBrains_Mono']">required</span>}
                    <span className="text-gray-500 text-xs font-['Inter']">{h.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Try It Panel */}
        <div className="rounded-xl overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.2)" }}>
          <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: "rgba(34,211,238,0.1)", background: "rgba(34,211,238,0.04)" }}>
            <i className="ri-play-circle-line text-cyan-400" />
            <span className="text-white text-sm font-semibold font-['Inter']">Try It — Sandbox</span>
            <span className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono']" style={{ background: "rgba(250,204,21,0.1)", color: "#FACC15" }}>sandbox</span>
          </div>

          <div className="p-4 space-y-3">
            {/* API Key input */}
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-['Inter'] uppercase tracking-wider">API Key (Sandbox)</label>
              <input value={apiKeyInput} onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none font-['JetBrains_Mono']"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,211,238,0.2)", color: "#22D3EE" }} />
            </div>

            {/* Request body editor */}
            {selectedEndpoint.method !== "GET" && (
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-['Inter'] uppercase tracking-wider">Request Body (JSON)</label>
                <textarea value={tryItBody} onChange={(e) => setTryItBody(e.target.value)} rows={8}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none font-['JetBrains_Mono']"
                  style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(34,211,238,0.15)", color: "#22D3EE" }} />
              </div>
            )}

            <button onClick={handleTryIt} disabled={tryItLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-all"
              style={{ background: tryItLoading ? "rgba(34,211,238,0.4)" : "#22D3EE", color: "#060D1A" }}>
              {tryItLoading ? <><i className="ri-loader-4-line animate-spin" />Sending...</> : <><i className="ri-send-plane-line" />Send Request</>}
            </button>

            {/* Response */}
            {tryItResponse && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-green-400 text-xs font-['JetBrains_Mono']">200 OK — 42ms</span>
                </div>
                <pre className="p-3 rounded-lg text-xs font-['JetBrains_Mono'] overflow-auto" style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)", color: "#4ADE80", maxHeight: "200px" }}>
                  {tryItResponse}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDocs;
