import { useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import {
  initialNodes, initialEdges, mockAnnotations,
  GraphNode, GraphEdge, Annotation, NodeType,
  nodeTypeConfig, riskColors,
} from "@/mocks/linkAnalysisData";
import GraphCanvas from "./components/GraphCanvas";
import GraphToolbar from "./components/GraphToolbar";
import NodeContextMenu from "./components/NodeContextMenu";
import AlgorithmsPanel from "./components/AlgorithmsPanel";
import NodeDetailPanel from "./components/NodeDetailPanel";
import SaveSharePanel from "./components/SaveSharePanel";

const COMMUNITY_PALETTE = ["#D6B47E", "#A78BFA", "#4ADE80", "#C98A1B", "#F472B6", "#FCD34D"];

const LinkAnalysisPage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();

  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [edges, setEdges] = useState<GraphEdge[]>(initialEdges);
  const [annotations, setAnnotations] = useState<Annotation[]>(mockAnnotations);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  const [communityColors, setCommunityColors] = useState<Record<string, string>>({});
  const [communityActive, setCommunityActive] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0);
  const [activeEdgeFilter, setActiveEdgeFilter] = useState("all");
  const [showLabels, setShowLabels] = useState(true);
  const [showEdgeLabels, setShowEdgeLabels] = useState(false);
  const [sizeByDegree, setSizeByDegree] = useState(false);
  const [addAnnotationMode, setAddAnnotationMode] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ nodeId: string; x: number; y: number } | null>(null);
  const [selectedNodeDetail, setSelectedNodeDetail] = useState<string | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<"algorithms" | "save">("algorithms");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleNodeClick = useCallback((id: string, multi: boolean) => {
    setSelectedNodes(prev => {
      if (multi) {
        return prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id];
      }
      return prev.includes(id) && prev.length === 1 ? [] : [id];
    });
    setSelectedNodeDetail(id);
    setContextMenu(null);
  }, []);

  const handleNodeRightClick = useCallback((id: string, x: number, y: number) => {
    setContextMenu({ nodeId: id, x, y });
    if (!selectedNodes.includes(id)) {
      setSelectedNodes([id]);
    }
  }, [selectedNodes]);

  const handleNodeDrag = useCallback((id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
  }, []);

  const handleCanvasClick = useCallback(() => {
    setContextMenu(null);
    setSelectedNodes([]);
    setSelectedNodeDetail(null);
  }, []);

  const handleAddNode = useCallback((type: NodeType) => {
    const cfg = nodeTypeConfig[type];
    const newNode: GraphNode = {
      id: `new-${Date.now()}`,
      type,
      label: `New ${cfg.labelEn}`,
      labelAr: `${cfg.labelAr} جديد`,
      risk: "low",
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      streams: [],
      details: {},
      degree: 0,
      betweenness: 0,
      community: 1,
    };
    setNodes(prev => [...prev, newNode]);
    showToast(`${isAr ? "تمت إضافة" : "Added"} ${cfg.labelEn}`);
  }, [isAr]);

  const handleLayout = useCallback((type: "force" | "radial" | "hierarchical" | "circular") => {
    const cx = 450, cy = 300;
    setNodes(prev => {
      if (type === "circular") {
        const r = Math.min(250, prev.length * 20);
        return prev.map((n, i) => ({
          ...n,
          x: cx + r * Math.cos((2 * Math.PI * i) / prev.length),
          y: cy + r * Math.sin((2 * Math.PI * i) / prev.length),
        }));
      }
      if (type === "radial") {
        const hub = prev.reduce((a, b) => (b.degree || 0) > (a.degree || 0) ? b : a);
        return prev.map((n, i) => {
          if (n.id === hub.id) return { ...n, x: cx, y: cy };
          const r = 180 + (i % 3) * 80;
          const angle = (2 * Math.PI * i) / (prev.length - 1);
          return { ...n, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
        });
      }
      if (type === "hierarchical") {
        const levels: Record<number, GraphNode[]> = {};
        prev.forEach((n, i) => {
          const lvl = Math.floor(i / 4);
          if (!levels[lvl]) levels[lvl] = [];
          levels[lvl].push(n);
        });
        const result = [...prev];
        Object.entries(levels).forEach(([lvl, ns]) => {
          ns.forEach((n, i) => {
            const idx = result.findIndex(r => r.id === n.id);
            result[idx] = { ...n, x: 100 + i * 140, y: 80 + Number(lvl) * 140 };
          });
        });
        return result;
      }
      // Force-directed: simple spring simulation
      return prev.map((n, i) => ({
        ...n,
        x: cx + (Math.random() - 0.5) * 500,
        y: cy + (Math.random() - 0.5) * 400,
      }));
    });
    showToast(`${isAr ? "تم تطبيق تخطيط" : "Applied"} ${type} ${isAr ? "" : "layout"}`);
  }, [isAr]);

  const handleExpand = useCallback((nodeId: string, hops: 1 | 2 | 3) => {
    const expandedNodes: GraphNode[] = [];
    const expandedEdges: GraphEdge[] = [];
    const baseNode = nodes.find(n => n.id === nodeId);
    if (!baseNode) return;

    for (let h = 0; h < hops; h++) {
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const types: NodeType[] = ["person", "phone", "bank", "organization", "vehicle"];
        const type = types[Math.floor(Math.random() * types.length)];
        const cfg = nodeTypeConfig[type];
        const angle = (2 * Math.PI * i) / count + h * 0.5;
        const r = 120 + h * 80;
        const newId = `exp-${Date.now()}-${h}-${i}`;
        expandedNodes.push({
          id: newId,
          type,
          label: `${cfg.labelEn} (${h + 1}-hop)`,
          labelAr: `${cfg.labelAr} (${h + 1} خطوة)`,
          risk: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
          x: baseNode.x + r * Math.cos(angle),
          y: baseNode.y + r * Math.sin(angle),
          streams: [],
          details: {},
          degree: 1,
          betweenness: 0,
          community: 1,
        });
        expandedEdges.push({
          id: `exp-edge-${Date.now()}-${h}-${i}`,
          source: nodeId,
          target: newId,
          type: "co-guest",
          label: `${h + 1}-hop link`,
          labelAr: `رابط ${h + 1} خطوة`,
          confidence: 60 + Math.floor(Math.random() * 30),
          weight: 1,
        });
      }
    }
    setNodes(prev => [...prev, ...expandedNodes]);
    setEdges(prev => [...prev, ...expandedEdges]);
    showToast(`${isAr ? "تم توسيع" : "Expanded"} ${hops}-hop: +${expandedNodes.length} ${isAr ? "عقدة" : "nodes"}`);
  }, [nodes, isAr]);

  const handleRemoveNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
    if (selectedNodeDetail === nodeId) setSelectedNodeDetail(null);
    showToast(isAr ? "تمت إزالة العقدة" : "Node removed");
  }, [selectedNodeDetail, isAr]);

  const handlePin = useCallback((nodeId: string) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, pinned: !n.pinned } : n));
  }, []);

  const handleAddToWatchlist = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    showToast(`${node?.label || nodeId} ${isAr ? "أُضيف لقائمة المراقبة" : "added to watchlist"}`);
  }, [nodes, isAr]);

  const handleCreateCase = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    showToast(`${isAr ? "تم إنشاء قضية لـ" : "Case created for"} ${node?.label || nodeId}`);
  }, [nodes, isAr]);

  const handleRunCommunityDetection = useCallback(() => {
    if (communityActive) {
      setCommunityColors({});
      setCommunityActive(false);
      return;
    }
    const colors: Record<string, string> = {};
    nodes.forEach(n => {
      colors[n.id] = COMMUNITY_PALETTE[(n.community || 1) % COMMUNITY_PALETTE.length];
    });
    setCommunityColors(colors);
    setCommunityActive(true);
    showToast(isAr ? "تم اكتشاف المجتمعات" : "Communities detected");
  }, [communityActive, nodes, isAr]);

  const handleAddAnnotation = useCallback((x: number, y: number) => {
    const newAnn: Annotation = {
      id: `ann-${Date.now()}`,
      x, y,
      text: isAr ? "ملاحظة جديدة — انقر للتعديل" : "New annotation — click to edit",
      author: "Ahmed Al-Amri",
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      color: "#FACC15",
    };
    setAnnotations(prev => [...prev, newAnn]);
    setAddAnnotationMode(false);
    showToast(isAr ? "تمت إضافة الملاحظة" : "Annotation added");
  }, [isAr]);

  const handleDeleteAnnotation = useCallback((id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
  }, []);

  const contextNode = contextMenu ? nodes.find(n => n.id === contextMenu.nodeId) : null;
  const detailNode = selectedNodeDetail ? nodes.find(n => n.id === selectedNodeDetail) : null;

  const filteredEdgeCount = edges.filter(e => {
    if (e.confidence < confidenceThreshold) return false;
    if (activeEdgeFilter !== "all" && e.type !== activeEdgeFilter) return false;
    return true;
  }).length;

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "#051428", fontFamily: "Inter, Cairo, sans-serif" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 border-b flex-shrink-0"
        style={{ background: "rgba(10,37,64,0.98)", borderColor: "rgba(184,138,60,0.12)" }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gold-400 transition-colors cursor-pointer text-sm"
        >
          <i className="ri-arrow-left-line" />
          <span className="font-['Inter'] text-xs">{isAr ? "لوحة التحكم" : "Dashboard"}</span>
        </button>
        <div className="w-px h-4" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center">
            <i className="ri-git-branch-line text-gold-400 text-base" />
          </div>
          <div>
            <h1 className="text-white text-sm font-bold font-['Inter']">
              {isAr ? "تحليل الروابط والشبكات" : "Link Analysis & Network Graph"}
            </h1>
            <p className="text-gray-600 text-[10px] font-['JetBrains_Mono']">
              {isAr ? "أداة التحليل التفاعلي للعلاقات" : "Interactive Relationship Intelligence Tool"}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden xl:flex items-center gap-3 ml-4">
          {[
            { color: "#4ADE80", label: isAr ? "منخفض" : "Low" },
            { color: "#FACC15", label: isAr ? "متوسط" : "Medium" },
            { color: "#C98A1B", label: isAr ? "عالٍ" : "High" },
            { color: "#C94A5E", label: isAr ? "حرج" : "Critical" },
          ].map(r => (
            <div key={r.label} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
              <span className="text-[10px] font-['JetBrains_Mono']" style={{ color: r.color }}>{r.label}</span>
            </div>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: "rgba(184,138,60,0.06)", border: "1px solid rgba(184,138,60,0.15)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-[10px] font-['JetBrains_Mono']">
              {isAr ? "متصل بقاعدة البيانات" : "DB Connected"}
            </span>
          </div>
          <button
            onClick={() => i18n.changeLanguage(isAr ? "en" : "ar")}
            className="w-8 h-8 flex items-center justify-center rounded-full border text-xs font-bold cursor-pointer transition-colors font-['JetBrains_Mono']"
            style={{ borderColor: "rgba(184,138,60,0.3)", color: "#D6B47E" }}
          >
            {isAr ? "EN" : "AR"}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <GraphToolbar
        isAr={isAr}
        showLabels={showLabels}
        showEdgeLabels={showEdgeLabels}
        sizeByDegree={sizeByDegree}
        addAnnotationMode={addAnnotationMode}
        onToggleLabels={() => setShowLabels(p => !p)}
        onToggleEdgeLabels={() => setShowEdgeLabels(p => !p)}
        onToggleSizeByDegree={() => setSizeByDegree(p => !p)}
        onToggleAnnotationMode={() => setAddAnnotationMode(p => !p)}
        onAddNode={handleAddNode}
        onLayout={handleLayout}
        onSearch={q => {
          const found = nodes.find(n => n.label.toLowerCase().includes(q.toLowerCase()));
          if (found) { setSelectedNodes([found.id]); setSelectedNodeDetail(found.id); }
        }}
        onExport={() => showToast(isAr ? "جارٍ التصدير..." : "Exporting...")}
        onScreenshot={() => showToast(isAr ? "تم حفظ لقطة الشاشة" : "Screenshot saved")}
        onClearSelection={() => { setSelectedNodes([]); setSelectedNodeDetail(null); }}
        selectedCount={selectedNodes.length}
        nodeCount={nodes.length}
        edgeCount={filteredEdgeCount}
      />

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: Algorithms */}
        <div
          className="w-64 flex-shrink-0 border-r flex flex-col overflow-hidden"
          style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.1)" }}
        >
          <AlgorithmsPanel
            isAr={isAr}
            nodes={nodes}
            edges={edges}
            selectedNodes={selectedNodes}
            confidenceThreshold={confidenceThreshold}
            activeEdgeFilter={activeEdgeFilter}
            onConfidenceChange={setConfidenceThreshold}
            onEdgeFilterChange={setActiveEdgeFilter}
            onHighlightPath={setHighlightedPath}
            onHighlightNodes={setHighlightedNodes}
            onRunCommunityDetection={handleRunCommunityDetection}
            onClearHighlights={() => { setHighlightedPath([]); setHighlightedNodes([]); }}
            communityActive={communityActive}
          />
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            annotations={annotations}
            selectedNodes={selectedNodes}
            highlightedPath={highlightedPath}
            highlightedNodes={highlightedNodes}
            communityColors={communityColors}
            confidenceThreshold={confidenceThreshold}
            activeEdgeFilter={activeEdgeFilter}
            onNodeClick={handleNodeClick}
            onNodeRightClick={handleNodeRightClick}
            onNodeDrag={handleNodeDrag}
            onCanvasClick={handleCanvasClick}
            onAnnotationClick={() => {}}
            addAnnotationMode={addAnnotationMode}
            onAddAnnotation={handleAddAnnotation}
            showLabels={showLabels}
            showEdgeLabels={showEdgeLabels}
            sizeByDegree={sizeByDegree}
          />
        </div>

        {/* Right panel */}
        <div
          className="w-72 flex-shrink-0 border-l flex flex-col overflow-hidden"
          style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.1)" }}
        >
          {/* Right panel tab switcher */}
          {!detailNode && (
            <div className="flex border-b flex-shrink-0" style={{ borderColor: "rgba(184,138,60,0.1)" }}>
              {[
                { key: "algorithms" as const, icon: "ri-cpu-line", label: isAr ? "الخوارزميات" : "Algorithms" },
                { key: "save" as const, icon: "ri-folder-line", label: isAr ? "الحفظ" : "Save & Share" },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setRightPanelTab(tab.key)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-['Inter'] cursor-pointer transition-colors"
                  style={{
                    color: rightPanelTab === tab.key ? "#D6B47E" : "#6B7280",
                    borderBottom: rightPanelTab === tab.key ? "2px solid #D6B47E" : "2px solid transparent",
                  }}
                >
                  <i className={`${tab.icon} text-sm`} />
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            {detailNode ? (
              <NodeDetailPanel
                node={detailNode}
                edges={edges}
                nodes={nodes}
                isAr={isAr}
                onClose={() => setSelectedNodeDetail(null)}
                onSelectNode={id => { setSelectedNodes([id]); setSelectedNodeDetail(id); }}
              />
            ) : rightPanelTab === "algorithms" ? (
              <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                {/* Node type legend */}
                <div className="p-3 border-b" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
                  <p className="text-gray-600 text-[10px] font-bold tracking-widest font-['JetBrains_Mono'] uppercase mb-2">
                    {isAr ? "أنواع العقد" : "NODE TYPES"}
                  </p>
                  <div className="space-y-1.5">
                    {Object.entries(nodeTypeConfig).map(([type, cfg]) => {
                      const count = nodes.filter(n => n.type === type).length;
                      return (
                        <div key={type} className="flex items-center gap-2">
                          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                            <i className={`${cfg.icon} text-sm`} style={{ color: cfg.color }} />
                          </div>
                          <span className="text-gray-400 text-xs font-['Inter'] flex-1">{isAr ? cfg.labelAr : cfg.labelEn}</span>
                          <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Risk distribution */}
                <div className="p-3">
                  <p className="text-gray-600 text-[10px] font-bold tracking-widest font-['JetBrains_Mono'] uppercase mb-2">
                    {isAr ? "توزيع المخاطر" : "RISK DISTRIBUTION"}
                  </p>
                  {(["critical", "high", "medium", "low"] as const).map(risk => {
                    const count = nodes.filter(n => n.risk === risk).length;
                    const pct = nodes.length > 0 ? (count / nodes.length) * 100 : 0;
                    return (
                      <div key={risk} className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-['JetBrains_Mono'] capitalize" style={{ color: riskColors[risk] }}>{risk}</span>
                          <span className="text-xs font-['JetBrains_Mono'] text-gray-600">{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: riskColors[risk] }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <SaveSharePanel
                isAr={isAr}
                nodeCount={nodes.length}
                edgeCount={edges.length}
                annotations={annotations}
                onAddAnnotation={() => setAddAnnotationMode(true)}
                onDeleteAnnotation={handleDeleteAnnotation}
                onLoadWorkspace={id => showToast(`${isAr ? "تم تحميل" : "Loaded workspace"} ${id}`)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && contextNode && (
        <NodeContextMenu
          node={contextNode}
          x={contextMenu.x}
          y={contextMenu.y}
          isAr={isAr}
          onClose={() => setContextMenu(null)}
          onExpand={handleExpand}
          onRemove={handleRemoveNode}
          onPin={handlePin}
          onAddToWatchlist={handleAddToWatchlist}
          onCreateCase={handleCreateCase}
          onViewProfile={id => { navigate(`/dashboard/person-360`); }}
          onFindPath={id => { setSelectedNodes(prev => prev.includes(id) ? prev : [...prev, id]); setContextMenu(null); }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-['Inter'] z-[400] transition-all"
          style={{ background: "rgba(10,37,64,0.95)", border: "1px solid rgba(184,138,60,0.3)", color: "#D6B47E" }}
        >
          <i className="ri-checkbox-circle-line mr-2" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default LinkAnalysisPage;
