import { GraphNode, GraphEdge, nodeTypeConfig, edgeTypeConfig, riskColors } from "@/mocks/linkAnalysisData";

interface Props {
  node: GraphNode;
  edges: GraphEdge[];
  nodes: GraphNode[];
  isAr: boolean;
  onClose: () => void;
  onSelectNode: (id: string) => void;
}

const NodeDetailPanel = ({ node, edges, nodes, isAr, onClose, onSelectNode }: Props) => {
  const cfg = nodeTypeConfig[node.type];

  const connectedEdges = edges.filter(e => e.source === node.id || e.target === node.id);
  const connectedNodes = connectedEdges.map(e => {
    const otherId = e.source === node.id ? e.target : e.source;
    const other = nodes.find(n => n.id === otherId);
    return { edge: e, node: other };
  }).filter(c => c.node);

  const riskBadge = (risk: string) => {
    const colors: Record<string, string> = { low: "#4ADE80", medium: "#FACC15", high: "#FB923C", critical: "#F87171" };
    return (
      <span
        className="px-1.5 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold uppercase"
        style={{ background: `${colors[risk]}20`, color: colors[risk], border: `1px solid ${colors[risk]}40` }}
      >
        {risk}
      </span>
    );
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(20,29,46,0.95)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: "rgba(181,142,60,0.12)", background: "rgba(181,142,60,0.04)" }}
      >
        <div
          className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0"
          style={{ background: `${cfg.color}20`, border: `2px solid ${cfg.color}60` }}
        >
          {node.initials ? (
            <span className="text-sm font-bold font-['Inter']" style={{ color: cfg.color }}>{node.initials}</span>
          ) : (
            <i className={`${cfg.icon} text-base`} style={{ color: cfg.color }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold font-['Inter'] truncate">{node.label}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-gray-500 text-[10px] font-['JetBrains_Mono'] uppercase">{cfg.labelEn}</span>
            {riskBadge(node.risk)}
          </div>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-400 cursor-pointer flex-shrink-0">
          <i className="ri-close-line text-lg" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: "none" }}>
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: isAr ? "الدرجة" : "Degree", value: node.degree || 0, color: "#D4A84B" },
            { label: isAr ? "الوساطة" : "Betweenness", value: `${Math.round((node.betweenness || 0) * 100)}%`, color: "#A78BFA" },
            { label: isAr ? "المجتمع" : "Community", value: node.community || 1, color: "#4ADE80" },
          ].map((stat, i) => (
            <div key={i} className="p-2 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-lg font-black font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-gray-600 text-[10px] font-['Inter'] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Streams */}
        {node.streams && node.streams.length > 0 && (
          <div>
            <p className="text-gray-600 text-[10px] font-bold tracking-widest font-['JetBrains_Mono'] uppercase mb-2">
              {isAr ? "مصادر البيانات" : "DATA STREAMS"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {node.streams.map(s => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono']"
                  style={{ background: "rgba(181,142,60,0.08)", border: "1px solid rgba(181,142,60,0.2)", color: "#D4A84B" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Details */}
        {node.details && Object.keys(node.details).length > 0 && (
          <div>
            <p className="text-gray-600 text-[10px] font-bold tracking-widest font-['JetBrains_Mono'] uppercase mb-2">
              {isAr ? "التفاصيل" : "DETAILS"}
            </p>
            <div className="space-y-1.5">
              {Object.entries(node.details).map(([key, val]) => (
                <div key={key} className="flex items-start justify-between gap-2">
                  <span className="text-gray-600 text-xs font-['JetBrains_Mono'] capitalize flex-shrink-0">{key}:</span>
                  <span className="text-gray-300 text-xs font-['Inter'] text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connected nodes */}
        <div>
          <p className="text-gray-600 text-[10px] font-bold tracking-widest font-['JetBrains_Mono'] uppercase mb-2">
            {isAr ? "الاتصالات" : "CONNECTIONS"} ({connectedNodes.length})
          </p>
          <div className="space-y-1.5">
            {connectedNodes.map(({ edge, node: other }) => {
              if (!other) return null;
              const otherCfg = nodeTypeConfig[other.type];
              const edgeCfg = edgeTypeConfig[edge.type];
              const isOutgoing = edge.source === node.id;
              return (
                <button
                  key={edge.id}
                  onClick={() => onSelectNode(other.id)}
                  className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-left"
                  style={{ border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div
                    className="w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ background: `${otherCfg.color}15`, border: `1.5px solid ${otherCfg.color}40` }}
                  >
                    <span className="text-[10px] font-bold" style={{ color: otherCfg.color }}>
                      {(other.initials || other.label.substring(0, 2)).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-xs font-['Inter'] truncate">{other.label}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <i className={`${isOutgoing ? "ri-arrow-right-line" : "ri-arrow-left-line"} text-[10px]`} style={{ color: edgeCfg.color }} />
                      <span className="text-[10px] font-['JetBrains_Mono']" style={{ color: edgeCfg.color }}>{edge.label}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                    <span className="text-[10px] font-['JetBrains_Mono']" style={{ color: edge.confidence >= 90 ? "#4ADE80" : edge.confidence >= 70 ? "#FACC15" : "#FB923C" }}>
                      {edge.confidence}%
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: riskColors[other.risk] }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 border-t flex gap-2 flex-shrink-0" style={{ borderColor: "rgba(181,142,60,0.1)" }}>
        <button
          className="flex-1 py-2 rounded-lg text-xs font-['Inter'] font-semibold cursor-pointer transition-colors"
          style={{ background: "#D4A84B", color: "#0B1220" }}
        >
          <i className="ri-user-search-line mr-1" />
          {isAr ? "ملف 360°" : "360° Profile"}
        </button>
        <button
          className="flex-1 py-2 rounded-lg text-xs font-['Inter'] cursor-pointer transition-colors"
          style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "#F87171" }}
        >
          <i className="ri-eye-line mr-1" />
          {isAr ? "مراقبة" : "Watchlist"}
        </button>
      </div>
    </div>
  );
};

export default NodeDetailPanel;
