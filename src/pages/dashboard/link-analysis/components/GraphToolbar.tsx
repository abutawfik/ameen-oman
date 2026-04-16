import { useState } from "react";
import { nodeTypeConfig, edgeTypeConfig, NodeType, EdgeType } from "@/mocks/linkAnalysisData";

interface Props {
  isAr: boolean;
  showLabels: boolean;
  showEdgeLabels: boolean;
  sizeByDegree: boolean;
  addAnnotationMode: boolean;
  onToggleLabels: () => void;
  onToggleEdgeLabels: () => void;
  onToggleSizeByDegree: () => void;
  onToggleAnnotationMode: () => void;
  onAddNode: (type: NodeType) => void;
  onLayout: (type: "force" | "radial" | "hierarchical" | "circular") => void;
  onSearch: (query: string) => void;
  onExport: () => void;
  onScreenshot: () => void;
  onClearSelection: () => void;
  selectedCount: number;
  nodeCount: number;
  edgeCount: number;
}

const GraphToolbar = ({
  isAr, showLabels, showEdgeLabels, sizeByDegree, addAnnotationMode,
  onToggleLabels, onToggleEdgeLabels, onToggleSizeByDegree, onToggleAnnotationMode,
  onAddNode, onLayout, onSearch, onExport, onScreenshot, onClearSelection,
  selectedCount, nodeCount, edgeCount,
}: Props) => {
  const [showAddNode, setShowAddNode] = useState(false);
  const [showLayout, setShowLayout] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const nodeTypes = Object.entries(nodeTypeConfig) as [NodeType, typeof nodeTypeConfig[NodeType]][];
  const layouts = [
    { key: "force" as const, icon: "ri-bubble-chart-line", label: "Force-Directed", labelAr: "موجّه بالقوة" },
    { key: "radial" as const, icon: "ri-radar-line", label: "Radial", labelAr: "شعاعي" },
    { key: "hierarchical" as const, icon: "ri-node-tree", label: "Hierarchical", labelAr: "هرمي" },
    { key: "circular" as const, icon: "ri-donut-chart-line", label: "Circular", labelAr: "دائري" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
  };

  return (
    <div
      className="flex items-center gap-1 px-3 py-2 border-b flex-shrink-0 flex-wrap"
      style={{ background: "rgba(10,22,40,0.95)", borderColor: "rgba(34,211,238,0.12)" }}
    >
      {/* Left: Main tools */}
      <div className="flex items-center gap-1">
        {/* Add Node */}
        <div className="relative">
          <button
            onClick={() => { setShowAddNode(!showAddNode); setShowLayout(false); setShowSearch(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-['Inter'] font-semibold transition-colors cursor-pointer whitespace-nowrap"
            style={{ background: showAddNode ? "#22D3EE" : "rgba(34,211,238,0.1)", color: showAddNode ? "#060D1A" : "#22D3EE", border: "1px solid rgba(34,211,238,0.3)" }}
          >
            <i className="ri-add-circle-line" />
            {isAr ? "إضافة عقدة" : "Add Node"}
          </button>
          {showAddNode && (
            <div
              className="absolute top-full left-0 mt-1 rounded-lg overflow-hidden z-50 w-52"
              style={{ background: "rgba(10,22,40,0.98)", border: "1px solid rgba(34,211,238,0.2)" }}
            >
              {nodeTypes.map(([type, cfg]) => (
                <button
                  key={type}
                  onClick={() => { onAddNode(type); setShowAddNode(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors cursor-pointer text-left"
                >
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <i className={`${cfg.icon} text-sm`} style={{ color: cfg.color }} />
                  </div>
                  <span className="text-xs text-gray-300 font-['Inter']">{isAr ? cfg.labelAr : cfg.labelEn}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <button
            onClick={() => { setShowSearch(!showSearch); setShowAddNode(false); setShowLayout(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-['Inter'] transition-colors cursor-pointer whitespace-nowrap"
            style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <i className="ri-search-line" />
            {isAr ? "بحث" : "Search"}
          </button>
          {showSearch && (
            <div
              className="absolute top-full left-0 mt-1 rounded-lg z-50 p-2 w-64"
              style={{ background: "rgba(10,22,40,0.98)", border: "1px solid rgba(34,211,238,0.2)" }}
            >
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  autoFocus
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder={isAr ? "ابحث عن شخص أو منظمة..." : "Search person, org, phone..."}
                  className="flex-1 px-2 py-1.5 rounded text-xs text-white placeholder-gray-600 outline-none font-['Inter']"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(34,211,238,0.2)" }}
                />
                <button
                  type="submit"
                  className="px-2 py-1.5 rounded text-xs cursor-pointer"
                  style={{ background: "#22D3EE", color: "#060D1A" }}
                >
                  <i className="ri-search-line" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Layout */}
        <div className="relative">
          <button
            onClick={() => { setShowLayout(!showLayout); setShowAddNode(false); setShowSearch(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-['Inter'] transition-colors cursor-pointer whitespace-nowrap"
            style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <i className="ri-layout-grid-line" />
            {isAr ? "تخطيط" : "Layout"}
          </button>
          {showLayout && (
            <div
              className="absolute top-full left-0 mt-1 rounded-lg overflow-hidden z-50 w-44"
              style={{ background: "rgba(10,22,40,0.98)", border: "1px solid rgba(34,211,238,0.2)" }}
            >
              {layouts.map(l => (
                <button
                  key={l.key}
                  onClick={() => { onLayout(l.key); setShowLayout(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors cursor-pointer text-left"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className={`${l.icon} text-sm text-cyan-400`} />
                  </div>
                  <span className="text-xs text-gray-300 font-['Inter']">{isAr ? l.labelAr : l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* Toggle buttons */}
        {[
          { icon: "ri-price-tag-3-line", label: isAr ? "التسميات" : "Labels", active: showLabels, action: onToggleLabels },
          { icon: "ri-links-line", label: isAr ? "تسميات الروابط" : "Edge Labels", active: showEdgeLabels, action: onToggleEdgeLabels },
          { icon: "ri-bubble-chart-line", label: isAr ? "الحجم بالدرجة" : "Size by Degree", active: sizeByDegree, action: onToggleSizeByDegree },
          { icon: "ri-sticky-note-line", label: isAr ? "ملاحظة" : "Annotate", active: addAnnotationMode, action: onToggleAnnotationMode },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            title={btn.label}
            className="flex items-center gap-1 px-2 py-1.5 rounded text-xs transition-colors cursor-pointer whitespace-nowrap"
            style={{
              background: btn.active ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.04)",
              color: btn.active ? "#22D3EE" : "#6B7280",
              border: `1px solid ${btn.active ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            <i className={`${btn.icon} text-sm`} />
            <span className="hidden lg:inline">{btn.label}</span>
          </button>
        ))}

        <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* Export / Screenshot */}
        <button
          onClick={onScreenshot}
          title={isAr ? "لقطة شاشة" : "Screenshot"}
          className="flex items-center gap-1 px-2 py-1.5 rounded text-xs transition-colors cursor-pointer"
          style={{ background: "rgba(255,255,255,0.04)", color: "#6B7280", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <i className="ri-camera-line text-sm" />
        </button>
        <button
          onClick={onExport}
          title={isAr ? "تصدير" : "Export"}
          className="flex items-center gap-1 px-2 py-1.5 rounded text-xs transition-colors cursor-pointer"
          style={{ background: "rgba(255,255,255,0.04)", color: "#6B7280", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <i className="ri-download-2-line text-sm" />
        </button>
      </div>

      {/* Right: Stats */}
      <div className="ml-auto flex items-center gap-3">
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-['JetBrains_Mono']" style={{ color: "#22D3EE" }}>
              {selectedCount} {isAr ? "محدد" : "selected"}
            </span>
            <button
              onClick={onClearSelection}
              className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer"
            >
              <i className="ri-close-line" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-3 text-xs font-['JetBrains_Mono']">
          <span style={{ color: "#9CA3AF" }}>
            <span style={{ color: "#22D3EE" }}>{nodeCount}</span> {isAr ? "عقدة" : "nodes"}
          </span>
          <span style={{ color: "#9CA3AF" }}>
            <span style={{ color: "#22D3EE" }}>{edgeCount}</span> {isAr ? "رابط" : "edges"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GraphToolbar;
