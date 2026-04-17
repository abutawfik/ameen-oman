import { useState } from "react";
import type { ConnectionNode, ConnectionEdge } from "@/mocks/person360Data";

interface Props {
  nodes: ConnectionNode[];
  edges: ConnectionEdge[];
  isAr: boolean;
}

const riskColors: Record<string, string> = {
  low:      "#4ADE80",
  medium:   "#FACC15",
  high:     "#C98A1B",
  critical: "#C94A5E",
};

const edgeColors: Record<string, string> = {
  "co-guest":       "#D6B47E",
  "shared-imei":    "#C94A5E",
  "co-tenant":      "#4ADE80",
  "co-driver":      "#C98A1B",
  "same-employer":  "#A78BFA",
  "same-booking":   "#FACC15",
  "boat-passenger": "#DDB96B",
};

const edgeTypeLabels: Record<string, { en: string; ar: string }> = {
  "co-guest":       { en: "Co-Guest",        ar: "نزيل مشترك" },
  "shared-imei":    { en: "Shared IMEI",     ar: "IMEI مشترك" },
  "co-tenant":      { en: "Co-Tenant",       ar: "مستأجر مشترك" },
  "co-driver":      { en: "Co-Driver",       ar: "سائق مشترك" },
  "same-employer":  { en: "Same Employer",   ar: "نفس صاحب العمل" },
  "same-booking":   { en: "Same Booking",    ar: "نفس الحجز" },
  "boat-passenger": { en: "Boat Passenger",  ar: "راكب قارب" },
};

const ConnectionsMap = ({ nodes, edges, isAr }: Props) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const W = 700;
  const H = 380;

  const getNodePos = (node: ConnectionNode) => ({
    x: (node.x / 100) * W,
    y: (node.y / 100) * H,
  });

  const isConnectedToSelected = (nodeId: string) => {
    if (!selectedNode) return true;
    if (nodeId === selectedNode) return true;
    return edges.some(
      (e) => (e.from === selectedNode && e.to === nodeId) || (e.to === selectedNode && e.from === nodeId)
    );
  };

  const selectedNodeData = nodes.find((n) => n.id === selectedNode);
  const selectedEdges = selectedNode
    ? edges.filter(e => e.from === selectedNode || e.to === selectedNode)
    : [];

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.15)", backdropFilter: "blur(12px)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-white font-bold font-['Inter'] text-sm uppercase tracking-wider">
            {isAr ? "خريطة الاتصالات" : "Connections Map"}
          </h3>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono']"
            style={{ background: "rgba(184,138,60,0.1)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.2)" }}
          >
            {nodes.length - 1} {isAr ? "اتصال" : "connections"}
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono']"
            style={{ background: "rgba(201,74,94,0.1)", color: "#C94A5E", border: "1px solid rgba(201,74,94,0.2)" }}
          >
            {nodes.filter(n => n.id !== "main" && (n.riskLevel === "high" || n.riskLevel === "critical")).length} {isAr ? "خطر عالٍ" : "high risk"}
          </span>
        </div>
        {selectedNode && (
          <button
            onClick={() => setSelectedNode(null)}
            className="text-xs px-2.5 py-1 rounded cursor-pointer font-['JetBrains_Mono'] flex items-center gap-1"
            style={{ color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
          >
            <i className="ri-close-line" />
            {isAr ? "إلغاء التحديد" : "Deselect"}
          </button>
        )}
      </div>

      <div className="flex gap-4">
        {/* SVG Graph */}
        <div
          className="flex-1 relative rounded-xl overflow-hidden"
          style={{ background: "rgba(5,20,40,0.6)", border: "1px solid rgba(184,138,60,0.08)" }}
        >
          {/* Grid texture */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="conn-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#D6B47E" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#conn-grid)" />
          </svg>

          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "380px" }}>
            {/* Edges */}
            {edges.map((edge, i) => {
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              const from = getNodePos(fromNode);
              const to = getNodePos(toNode);
              const color = edgeColors[edge.type] || "#D6B47E";
              const isHighlighted = selectedNode
                ? (edge.from === selectedNode || edge.to === selectedNode)
                : true;

              return (
                <g key={i}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={color}
                    strokeWidth={edge.strength === "strong" ? 2.5 : edge.strength === "medium" ? 1.5 : 1}
                    strokeOpacity={isHighlighted ? 0.75 : 0.08}
                    strokeDasharray={edge.strength === "weak" ? "4 4" : "none"}
                    style={{ transition: "stroke-opacity 0.3s" }}
                  />
                  {isHighlighted && (
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 - 7}
                      fill={color}
                      fontSize="8"
                      textAnchor="middle"
                      opacity="0.65"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {isAr ? edgeTypeLabels[edge.type]?.ar : edgeTypeLabels[edge.type]?.en}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const pos = getNodePos(node);
              const color = riskColors[node.riskLevel];
              const isMain = node.id === "main";
              const isHovered = hoveredNode === node.id;
              const isSelected = selectedNode === node.id;
              const isConnected = isConnectedToSelected(node.id);
              const r = isMain ? 28 : 20;

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  style={{ opacity: isConnected ? 1 : 0.15, transition: "opacity 0.3s" }}
                >
                  {/* Outer glow ring */}
                  {(isMain || isSelected || isHovered) && (
                    <circle
                      r={r + 9}
                      fill="none"
                      stroke={color}
                      strokeWidth="1"
                      strokeOpacity="0.3"
                      style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                    />
                  )}
                  {/* Main circle */}
                  <circle
                    r={r}
                    fill={`${color}22`}
                    stroke={color}
                    strokeWidth={isMain ? 3 : isSelected ? 2.5 : 2}
                    style={{ filter: isMain ? `drop-shadow(0 0 12px ${color})` : "none" }}
                  />
                  {/* Initials */}
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={color}
                    fontSize={isMain ? "11" : "9"}
                    fontWeight="bold"
                    fontFamily="Inter, sans-serif"
                  >
                    {node.initials}
                  </text>
                  {/* Name */}
                  <text
                    y={r + 14}
                    textAnchor="middle"
                    fill="#D1D5DB"
                    fontSize="8.5"
                    fontFamily="Inter, sans-serif"
                  >
                    {node.name.split(" ").slice(0, 2).join(" ")}
                  </text>
                  {/* Risk score */}
                  <text
                    y={r + 25}
                    textAnchor="middle"
                    fill={color}
                    fontSize="8"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="bold"
                  >
                    {node.riskScore}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend + Selected Node Info */}
        <div className="w-52 flex-shrink-0 flex flex-col gap-3">
          {/* Edge type legend */}
          <div
            className="rounded-lg p-3"
            style={{ background: "rgba(5,20,40,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-['JetBrains_Mono'] mb-2">
              {isAr ? "أنواع الاتصالات" : "Connection Types"}
            </p>
            <div className="space-y-1.5">
              {Object.entries(edgeTypeLabels).map(([type, labels]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="w-6 h-0.5 rounded-full flex-shrink-0" style={{ background: edgeColors[type] }} />
                  <span className="text-gray-400 text-[10px] font-['Inter']">{isAr ? labels.ar : labels.en}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk level legend */}
          <div
            className="rounded-lg p-3"
            style={{ background: "rgba(5,20,40,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-['JetBrains_Mono'] mb-2">
              {isAr ? "مستوى المخاطرة" : "Risk Level"}
            </p>
            {[
              { level: "critical", label: "Critical", labelAr: "حرج" },
              { level: "high",     label: "High",     labelAr: "عالٍ" },
              { level: "medium",   label: "Medium",   labelAr: "متوسط" },
              { level: "low",      label: "Low",      labelAr: "منخفض" },
            ].map((r) => (
              <div key={r.level} className="flex items-center gap-2 mb-1.5">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: riskColors[r.level] }} />
                <span className="text-gray-400 text-[10px] font-['Inter']">{isAr ? r.labelAr : r.label}</span>
              </div>
            ))}
          </div>

          {/* Selected node detail */}
          {selectedNodeData && (
            <div
              className="rounded-lg p-3"
              style={{
                background: `${riskColors[selectedNodeData.riskLevel]}0D`,
                border: `1px solid ${riskColors[selectedNodeData.riskLevel]}33`,
              }}
            >
              <p className="text-gray-500 text-[10px] uppercase tracking-widest font-['JetBrains_Mono'] mb-2">
                {isAr ? "تفاصيل الاتصال" : "Connection Detail"}
              </p>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-['Inter'] mb-2"
                style={{ background: `${riskColors[selectedNodeData.riskLevel]}22`, color: riskColors[selectedNodeData.riskLevel], border: `2px solid ${riskColors[selectedNodeData.riskLevel]}` }}
              >
                {selectedNodeData.initials}
              </div>
              <p className="text-white text-xs font-bold font-['Inter'] mb-2">{selectedNodeData.name}</p>
              <div className="space-y-1 mb-3">
                {[
                  { k: "Doc",         v: selectedNodeData.docNumber },
                  { k: "Nationality", v: selectedNodeData.nationality },
                  { k: "Relation",    v: selectedNodeData.relation },
                  { k: "Risk Score",  v: String(selectedNodeData.riskScore) },
                ].map((f) => (
                  <div key={f.k} className="flex justify-between">
                    <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{f.k}</span>
                    <span
                      className="text-[10px] font-['JetBrains_Mono']"
                      style={{ color: f.k === "Risk Score" ? riskColors[selectedNodeData.riskLevel] : "#D1D5DB" }}
                    >
                      {f.v}
                    </span>
                  </div>
                ))}
              </div>
              {/* Shared edges */}
              {selectedEdges.length > 0 && (
                <div className="mb-2">
                  <p className="text-gray-600 text-[9px] uppercase tracking-wider font-['JetBrains_Mono'] mb-1">Links</p>
                  {selectedEdges.map((e, i) => (
                    <div key={i} className="flex items-center gap-1 mb-0.5">
                      <div className="w-3 h-0.5 rounded-full" style={{ background: edgeColors[e.type] }} />
                      <span className="text-gray-500 text-[9px] font-['JetBrains_Mono'] truncate">{e.label}</span>
                    </div>
                  ))}
                </div>
              )}
              <button
                className="w-full py-1.5 rounded text-[10px] font-['JetBrains_Mono'] cursor-pointer transition-colors"
                style={{ background: "rgba(184,138,60,0.1)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.2)" }}
              >
                <i className="ri-user-search-line mr-1" />
                {isAr ? "عرض الملف الشخصي" : "View Profile"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsMap;
