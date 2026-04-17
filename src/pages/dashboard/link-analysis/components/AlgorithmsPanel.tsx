import { useState } from "react";
import { GraphNode, GraphEdge, riskColors } from "@/mocks/linkAnalysisData";

interface Props {
  isAr: boolean;
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodes: string[];
  confidenceThreshold: number;
  activeEdgeFilter: string;
  onConfidenceChange: (v: number) => void;
  onEdgeFilterChange: (v: string) => void;
  onHighlightPath: (path: string[]) => void;
  onHighlightNodes: (nodes: string[]) => void;
  onRunCommunityDetection: () => void;
  onClearHighlights: () => void;
  communityActive: boolean;
}

const AlgorithmsPanel = ({
  isAr, nodes, edges, selectedNodes,
  confidenceThreshold, activeEdgeFilter,
  onConfidenceChange, onEdgeFilterChange,
  onHighlightPath, onHighlightNodes, onRunCommunityDetection, onClearHighlights,
  communityActive,
}: Props) => {
  const [activeAlgo, setActiveAlgo] = useState<string | null>(null);
  const [pathResult, setPathResult] = useState<string | null>(null);
  const [temporalRange, setTemporalRange] = useState([0, 100]);

  const edgeTypes = [
    { key: "all", label: "All Types", labelAr: "جميع الأنواع" },
    { key: "employer", label: "Employment", labelAr: "توظيف" },
    { key: "family", label: "Family", labelAr: "عائلة" },
    { key: "wire-transfer", label: "Wire Transfer", labelAr: "تحويل بنكي" },
    { key: "shared-phone", label: "Shared Phone", labelAr: "هاتف مشترك" },
    { key: "shared-imei", label: "Shared IMEI", labelAr: "IMEI مشترك" },
    { key: "same-hotel", label: "Same Hotel", labelAr: "نفس الفندق" },
    { key: "co-guest", label: "Co-Guest", labelAr: "نزيل مشترك" },
    { key: "whatsapp-group", label: "WhatsApp Group", labelAr: "مجموعة واتساب" },
  ];

  const findShortestPath = () => {
    if (selectedNodes.length < 2) {
      setPathResult(isAr ? "اختر عقدتين على الأقل" : "Select at least 2 nodes");
      return;
    }
    const [start, end] = selectedNodes;
    // BFS
    const adj: Record<string, string[]> = {};
    nodes.forEach(n => { adj[n.id] = []; });
    edges.forEach(e => {
      if (e.confidence >= confidenceThreshold) {
        adj[e.source]?.push(e.target);
        adj[e.target]?.push(e.source);
      }
    });
    const visited = new Set<string>();
    const queue: { id: string; path: string[] }[] = [{ id: start, path: [start] }];
    visited.add(start);
    while (queue.length > 0) {
      const { id, path } = queue.shift()!;
      if (id === end) {
        onHighlightPath(path);
        const names = path.map(pid => nodes.find(n => n.id === pid)?.label || pid);
        setPathResult(`${isAr ? "المسار" : "Path"}: ${names.join(" → ")} (${path.length - 1} ${isAr ? "خطوات" : "hops"})`);
        return;
      }
      for (const neighbor of (adj[id] || [])) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push({ id: neighbor, path: [...path, neighbor] });
        }
      }
    }
    setPathResult(isAr ? "لا يوجد مسار مباشر" : "No direct path found");
    onHighlightPath([]);
  };

  const findMostConnected = () => {
    const sorted = [...nodes].sort((a, b) => (b.degree || 0) - (a.degree || 0));
    const top = sorted.slice(0, Math.ceil(nodes.length * 0.3)).map(n => n.id);
    onHighlightNodes(top);
    setActiveAlgo("most-connected");
  };

  const findAnomalies = () => {
    // Nodes with degree > avg + 1.5*std
    const degrees = nodes.map(n => n.degree || 0);
    const avg = degrees.reduce((a, b) => a + b, 0) / degrees.length;
    const std = Math.sqrt(degrees.reduce((a, b) => a + (b - avg) ** 2, 0) / degrees.length);
    const anomalous = nodes.filter(n => (n.degree || 0) > avg + 1.5 * std).map(n => n.id);
    onHighlightNodes(anomalous);
    setActiveAlgo("anomaly");
  };

  const findConnectingNetwork = () => {
    if (selectedNodes.length < 2) {
      setPathResult(isAr ? "اختر عقدتين على الأقل" : "Select at least 2 nodes");
      return;
    }
    const connected = new Set<string>(selectedNodes);
    edges.forEach(e => {
      if (selectedNodes.includes(e.source) || selectedNodes.includes(e.target)) {
        connected.add(e.source);
        connected.add(e.target);
      }
    });
    onHighlightNodes([...connected]);
    setActiveAlgo("connecting");
  };

  const algorithms = [
    {
      key: "shortest-path",
      icon: "ri-route-line",
      label: isAr ? "أقصر مسار" : "Shortest Path",
      desc: isAr ? "اختر عقدتين → إيجاد المسار" : "Select 2 nodes → find path",
      color: "#D6B47E",
      action: findShortestPath,
      requiresSelection: true,
    },
    {
      key: "connecting",
      icon: "ri-share-line",
      label: isAr ? "الشبكة الرابطة" : "Connecting Network",
      desc: isAr ? "اختر 2+ عقد → اكتشاف الروابط" : "Select 2+ nodes → discover links",
      color: "#A78BFA",
      action: findConnectingNetwork,
      requiresSelection: true,
    },
    {
      key: "most-connected",
      icon: "ri-bubble-chart-line",
      label: isAr ? "الأكثر اتصالاً" : "Most Connected",
      desc: isAr ? "إبراز العقد المحورية" : "Highlight hub nodes by degree",
      color: "#C98A1B",
      action: findMostConnected,
      requiresSelection: false,
    },
    {
      key: "community",
      icon: "ri-group-line",
      label: isAr ? "اكتشاف المجتمعات" : "Community Detection",
      desc: isAr ? "تلوين المجموعات المترابطة" : "Auto-color connected clusters",
      color: "#4ADE80",
      action: onRunCommunityDetection,
      requiresSelection: false,
      active: communityActive,
    },
    {
      key: "anomaly",
      icon: "ri-alert-line",
      label: isAr ? "الشذوذ" : "Anomaly Detection",
      desc: isAr ? "إبراز أنماط الاتصال غير العادية" : "Highlight unusual connectivity",
      color: "#C94A5E",
      action: findAnomalies,
      requiresSelection: false,
    },
    {
      key: "betweenness",
      icon: "ri-git-merge-line",
      label: isAr ? "مركزية الوساطة" : "Betweenness Centrality",
      desc: isAr ? "إيجاد الوسطاء والجسور" : "Find brokers & intermediaries",
      color: "#FACC15",
      action: () => {
        const brokers = nodes.filter(n => (n.betweenness || 0) > 0.3).map(n => n.id);
        onHighlightNodes(brokers);
        setActiveAlgo("betweenness");
      },
      requiresSelection: false,
    },
  ];

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b flex-shrink-0" style={{ borderColor: "rgba(184,138,60,0.1)" }}>
        <h3 className="text-white text-sm font-bold font-['Inter']">
          {isAr ? "خوارزميات الرسم البياني" : "Graph Algorithms"}
        </h3>
        <p className="text-gray-600 text-xs font-['Inter'] mt-0.5">
          {isAr ? "تحليل الشبكة بنقرة واحدة" : "One-click network analysis"}
        </p>
      </div>

      <div className="p-3 space-y-2 flex-1">
        {/* Algorithm cards */}
        {algorithms.map(algo => (
          <button
            key={algo.key}
            onClick={() => { algo.action(); if (algo.key !== "shortest-path" && algo.key !== "connecting") setActiveAlgo(algo.key); }}
            className="w-full text-left p-3 rounded-lg transition-all cursor-pointer"
            style={{
              background: (activeAlgo === algo.key || algo.active) ? `${algo.color}15` : "rgba(255,255,255,0.03)",
              border: `1px solid ${(activeAlgo === algo.key || algo.active) ? `${algo.color}50` : "rgba(255,255,255,0.06)"}`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <i className={`${algo.icon} text-sm`} style={{ color: algo.color }} />
              </div>
              <span className="text-xs font-semibold font-['Inter']" style={{ color: algo.color }}>{algo.label}</span>
              {algo.requiresSelection && selectedNodes.length < 2 && (
                <span className="ml-auto text-[10px] text-gray-600 font-['JetBrains_Mono']">
                  {isAr ? "يتطلب تحديداً" : "needs selection"}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-[11px] font-['Inter'] pl-8">{algo.desc}</p>
          </button>
        ))}

        {/* Path result */}
        {pathResult && (
          <div
            className="p-2.5 rounded-lg text-xs font-['JetBrains_Mono']"
            style={{ background: "rgba(184,138,60,0.06)", border: "1px solid rgba(184,138,60,0.2)", color: "#D6B47E" }}
          >
            {pathResult}
          </div>
        )}

        {/* Clear highlights */}
        {(activeAlgo || pathResult) && (
          <button
            onClick={() => { onClearHighlights(); setActiveAlgo(null); setPathResult(null); }}
            className="w-full py-2 rounded-lg text-xs font-['Inter'] cursor-pointer transition-colors"
            style={{ background: "rgba(201,74,94,0.08)", border: "1px solid rgba(201,74,94,0.2)", color: "#C94A5E" }}
          >
            <i className="ri-close-circle-line mr-1.5" />
            {isAr ? "مسح التمييز" : "Clear Highlights"}
          </button>
        )}

        <div className="border-t pt-3 mt-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-gray-600 text-[10px] font-bold tracking-widest font-['JetBrains_Mono'] uppercase mb-2">
            {isAr ? "الفلاتر" : "FILTERS"}
          </p>

          {/* Confidence threshold */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-gray-400 text-xs font-['Inter']">{isAr ? "حد الثقة" : "Confidence Threshold"}</span>
              <span className="text-gold-400 text-xs font-['JetBrains_Mono']">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={confidenceThreshold}
              onChange={e => onConfidenceChange(Number(e.target.value))}
              className="w-full h-1.5 rounded-full cursor-pointer appearance-none"
              style={{ accentColor: "#D6B47E", background: `linear-gradient(to right, #D6B47E ${confidenceThreshold}%, rgba(255,255,255,0.1) ${confidenceThreshold}%)` }}
            />
          </div>

          {/* Edge type filter */}
          <div>
            <span className="text-gray-400 text-xs font-['Inter'] block mb-1.5">{isAr ? "نوع الرابط" : "Edge Type"}</span>
            <div className="flex flex-wrap gap-1">
              {edgeTypes.map(et => (
                <button
                  key={et.key}
                  onClick={() => onEdgeFilterChange(et.key)}
                  className="px-2 py-0.5 rounded text-[10px] font-['Inter'] cursor-pointer transition-colors whitespace-nowrap"
                  style={{
                    background: activeEdgeFilter === et.key ? "rgba(184,138,60,0.15)" : "rgba(255,255,255,0.04)",
                    color: activeEdgeFilter === et.key ? "#D6B47E" : "#6B7280",
                    border: `1px solid ${activeEdgeFilter === et.key ? "rgba(184,138,60,0.3)" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  {isAr ? et.labelAr : et.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Temporal filter */}
        <div className="border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-gray-600 text-[10px] font-bold tracking-widest font-['JetBrains_Mono'] uppercase mb-2">
            {isAr ? "الفلتر الزمني" : "TEMPORAL FILTER"}
          </p>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-gray-400 text-xs font-['Inter']">{isAr ? "نطاق التاريخ" : "Date Range"}</span>
            <span className="text-gold-400 text-xs font-['JetBrains_Mono']">2024 — 2025</span>
          </div>
          <div className="space-y-1.5">
            <input
              type="range"
              min={0}
              max={100}
              value={temporalRange[0]}
              onChange={e => setTemporalRange([Number(e.target.value), temporalRange[1]])}
              className="w-full h-1.5 rounded-full cursor-pointer appearance-none"
              style={{ accentColor: "#D6B47E" }}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={temporalRange[1]}
              onChange={e => setTemporalRange([temporalRange[0], Number(e.target.value)])}
              className="w-full h-1.5 rounded-full cursor-pointer appearance-none"
              style={{ accentColor: "#D6B47E" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">Jan 2024</span>
            <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">Apr 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsPanel;
