import { useRef, useEffect, useState, useCallback } from "react";
import {
  GraphNode, GraphEdge, Annotation,
  nodeTypeConfig, edgeTypeConfig, riskColors,
} from "@/mocks/linkAnalysisData";

interface Props {
  nodes: GraphNode[];
  edges: GraphEdge[];
  annotations: Annotation[];
  selectedNodes: string[];
  highlightedPath: string[];
  highlightedNodes: string[];
  communityColors: Record<string, string>;
  confidenceThreshold: number;
  activeEdgeFilter: string;
  onNodeClick: (id: string, multi: boolean) => void;
  onNodeRightClick: (id: string, x: number, y: number) => void;
  onNodeDrag: (id: string, x: number, y: number) => void;
  onCanvasClick: () => void;
  onAnnotationClick: (id: string) => void;
  addAnnotationMode: boolean;
  onAddAnnotation: (x: number, y: number) => void;
  showLabels: boolean;
  showEdgeLabels: boolean;
  sizeByDegree: boolean;
}

const COMMUNITY_PALETTE = ["#22D3EE", "#A78BFA", "#4ADE80", "#FB923C", "#F472B6", "#FCD34D", "#38BDF8", "#2DD4BF"];

const GraphCanvas = ({
  nodes, edges, annotations, selectedNodes, highlightedPath, highlightedNodes,
  communityColors, confidenceThreshold, activeEdgeFilter,
  onNodeClick, onNodeRightClick, onNodeDrag, onCanvasClick,
  onAnnotationClick, addAnnotationMode, onAddAnnotation,
  showLabels, showEdgeLabels, sizeByDegree,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const animFrameRef = useRef<number>(0);

  const getNodeRadius = useCallback((node: GraphNode) => {
    if (sizeByDegree) {
      const base = 18;
      const extra = Math.min((node.degree || 1) * 3, 20);
      return base + extra;
    }
    return 22;
  }, [sizeByDegree]);

  const worldToScreen = useCallback((wx: number, wy: number) => ({
    x: wx * transform.scale + transform.x,
    y: wy * transform.scale + transform.y,
  }), [transform]);

  const screenToWorld = useCallback((sx: number, sy: number) => ({
    x: (sx - transform.x) / transform.scale,
    y: (sy - transform.y) / transform.scale,
  }), [transform]);

  const getNodeAt = useCallback((sx: number, sy: number): GraphNode | null => {
    const world = screenToWorld(sx, sy);
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const r = getNodeRadius(n);
      const dx = world.x - n.x;
      const dy = world.y - n.y;
      if (dx * dx + dy * dy <= r * r) return n;
    }
    return null;
  }, [nodes, screenToWorld, getNodeRadius]);

  const getEdgeAt = useCallback((sx: number, sy: number): GraphEdge | null => {
    const world = screenToWorld(sx, sy);
    for (const edge of edges) {
      if (edge.confidence < confidenceThreshold) continue;
      if (activeEdgeFilter !== "all" && edge.type !== activeEdgeFilter) continue;
      const src = nodes.find(n => n.id === edge.source);
      const tgt = nodes.find(n => n.id === edge.target);
      if (!src || !tgt) continue;
      const dx = tgt.x - src.x;
      const dy = tgt.y - src.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len === 0) continue;
      const t = ((world.x - src.x) * dx + (world.y - src.y) * dy) / (len * len);
      if (t < 0 || t > 1) continue;
      const px = src.x + t * dx - world.x;
      const py = src.y + t * dy - world.y;
      if (px * px + py * py < 36) return edge;
    }
    return null;
  }, [edges, nodes, screenToWorld, confidenceThreshold, activeEdgeFilter]);

  const drawHexagon = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
  };

  const drawDiamond = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r, cy);
    ctx.lineTo(cx, cy + r);
    ctx.lineTo(cx - r, cy);
    ctx.closePath();
  };

  const drawSquare = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
    ctx.beginPath();
    ctx.roundRect(cx - r, cy - r, r * 2, r * 2, 4);
    ctx.closePath();
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background grid
    ctx.save();
    ctx.strokeStyle = "rgba(34,211,238,0.06)";
    ctx.lineWidth = 1;
    const gridSize = 60 * transform.scale;
    const offsetX = transform.x % gridSize;
    const offsetY = transform.y % gridSize;
    for (let x = offsetX; x < W; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = offsetY; y < H; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);

    const filteredEdges = edges.filter(e => {
      if (e.confidence < confidenceThreshold) return false;
      if (activeEdgeFilter !== "all" && e.type !== activeEdgeFilter) return false;
      return true;
    });

    // Draw edges
    filteredEdges.forEach(edge => {
      const src = nodes.find(n => n.id === edge.source);
      const tgt = nodes.find(n => n.id === edge.target);
      if (!src || !tgt) return;

      const cfg = edgeTypeConfig[edge.type];
      const isHighlighted = highlightedPath.includes(edge.source) && highlightedPath.includes(edge.target);
      const isHovered = hoveredEdge === edge.id;

      const alpha = (highlightedPath.length > 0 && !isHighlighted) ? 0.15 : (isHovered ? 1 : 0.6);
      const lineWidth = (edge.weight * 1.2 + (isHighlighted ? 2 : 0) + (isHovered ? 1 : 0)) / transform.scale;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = isHighlighted ? "#22D3EE" : cfg.color;
      ctx.lineWidth = Math.max(lineWidth, 1 / transform.scale);

      if (cfg.dash) {
        ctx.setLineDash([6 / transform.scale, 4 / transform.scale]);
      } else {
        ctx.setLineDash([]);
      }

      // Curved edge
      const mx = (src.x + tgt.x) / 2;
      const my = (src.y + tgt.y) / 2;
      const dx = tgt.x - src.x;
      const dy = tgt.y - src.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const curve = len * 0.12;
      const cpx = mx - (dy / len) * curve;
      const cpy = my + (dx / len) * curve;

      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.quadraticCurveTo(cpx, cpy, tgt.x, tgt.y);
      ctx.stroke();

      // Arrow
      const t = 0.85;
      const ax = (1 - t) * (1 - t) * src.x + 2 * (1 - t) * t * cpx + t * t * tgt.x;
      const ay = (1 - t) * (1 - t) * src.y + 2 * (1 - t) * t * cpy + t * t * tgt.y;
      const tangX = 2 * (1 - t) * (cpx - src.x) + 2 * t * (tgt.x - cpx);
      const tangY = 2 * (1 - t) * (cpy - src.y) + 2 * t * (tgt.y - cpy);
      const angle = Math.atan2(tangY, tangX);
      const arrowSize = 8 / transform.scale;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax - arrowSize * Math.cos(angle - 0.4), ay - arrowSize * Math.sin(angle - 0.4));
      ctx.lineTo(ax - arrowSize * Math.cos(angle + 0.4), ay - arrowSize * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fillStyle = isHighlighted ? "#22D3EE" : cfg.color;
      ctx.fill();

      // Edge label
      if (showEdgeLabels && transform.scale > 0.6) {
        ctx.globalAlpha = alpha * 0.9;
        ctx.font = `${10 / transform.scale}px JetBrains Mono, monospace`;
        ctx.fillStyle = cfg.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const lx = (src.x + cpx + tgt.x) / 3;
        const ly = (src.y + cpy + tgt.y) / 3;
        ctx.fillText(edge.label, lx, ly - 8 / transform.scale);
      }

      ctx.restore();
    });

    // Draw nodes
    nodes.forEach(node => {
      const cfg = nodeTypeConfig[node.type];
      const r = getNodeRadius(node);
      const isSelected = selectedNodes.includes(node.id);
      const isHighlighted = highlightedNodes.includes(node.id) || highlightedPath.includes(node.id);
      const isHovered = hoveredNode === node.id;
      const hasCommunity = communityColors[node.id];

      const dimmed = (highlightedPath.length > 0 || highlightedNodes.length > 0) && !isHighlighted && !isSelected;
      const alpha = dimmed ? 0.2 : 1;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Glow for selected/highlighted
      if (isSelected || isHighlighted || isHovered) {
        ctx.shadowColor = isSelected ? "#22D3EE" : (isHighlighted ? riskColors[node.risk] : cfg.color);
        ctx.shadowBlur = isSelected ? 20 : 12;
      }

      // Node shape fill
      const fillColor = hasCommunity ? communityColors[node.id] : cfg.color;
      ctx.fillStyle = `${fillColor}22`;
      ctx.strokeStyle = isSelected ? "#22D3EE" : (isHighlighted ? riskColors[node.risk] : fillColor);
      ctx.lineWidth = isSelected ? 3 / transform.scale : 2 / transform.scale;

      if (node.type === "organization") {
        drawHexagon(ctx, node.x, node.y, r);
      } else if (node.type === "vehicle") {
        drawDiamond(ctx, node.x, node.y, r);
      } else if (["bank", "property", "document"].includes(node.type)) {
        drawSquare(ctx, node.x, node.y, r);
      } else {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.stroke();

      // Risk ring
      ctx.shadowBlur = 0;
      ctx.strokeStyle = riskColors[node.risk];
      ctx.lineWidth = 1.5 / transform.scale;
      ctx.globalAlpha = alpha * 0.5;
      if (node.type === "organization") {
        drawHexagon(ctx, node.x, node.y, r + 4 / transform.scale);
      } else if (node.type === "vehicle") {
        drawDiamond(ctx, node.x, node.y, r + 4 / transform.scale);
      } else if (["bank", "property", "document"].includes(node.type)) {
        drawSquare(ctx, node.x, node.y, r + 4 / transform.scale);
      } else {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 4 / transform.scale, 0, Math.PI * 2);
      }
      ctx.stroke();
      ctx.globalAlpha = alpha;

      // Initials / icon text
      ctx.shadowBlur = 0;
      ctx.fillStyle = fillColor;
      ctx.font = `bold ${Math.max(10, r * 0.55)}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const label = node.initials || node.label.substring(0, 2).toUpperCase();
      ctx.fillText(label, node.x, node.y);

      // Pin indicator
      if (node.pinned) {
        ctx.fillStyle = "#FACC15";
        ctx.font = `${10 / transform.scale}px sans-serif`;
        ctx.fillText("📌", node.x + r * 0.6, node.y - r * 0.6);
      }

      // Node label below
      if (showLabels && transform.scale > 0.4) {
        ctx.fillStyle = isSelected ? "#22D3EE" : "#D1D5DB";
        ctx.font = `${11 / transform.scale}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const maxLen = 18;
        const displayLabel = node.label.length > maxLen ? node.label.substring(0, maxLen) + "…" : node.label;
        ctx.fillText(displayLabel, node.x, node.y + r + 4 / transform.scale);
      }

      // Degree badge
      if (sizeByDegree && node.degree && node.degree > 3) {
        const bx = node.x + r * 0.7;
        const by = node.y - r * 0.7;
        const br = 8 / transform.scale;
        ctx.fillStyle = riskColors[node.risk];
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#060D1A";
        ctx.font = `bold ${8 / transform.scale}px JetBrains Mono, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(node.degree), bx, by);
      }

      ctx.restore();
    });

    // Draw annotations
    annotations.forEach(ann => {
      ctx.save();
      ctx.globalAlpha = 0.9;
      const w = 160 / transform.scale;
      const h = 60 / transform.scale;
      const pad = 8 / transform.scale;
      ctx.fillStyle = "rgba(10,22,40,0.92)";
      ctx.strokeStyle = ann.color;
      ctx.lineWidth = 1.5 / transform.scale;
      ctx.beginPath();
      ctx.roundRect(ann.x, ann.y, w, h, 4 / transform.scale);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = ann.color;
      ctx.font = `bold ${9 / transform.scale}px JetBrains Mono, monospace`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("NOTE", ann.x + pad, ann.y + pad);
      ctx.fillStyle = "#D1D5DB";
      ctx.font = `${9 / transform.scale}px Inter, sans-serif`;
      const words = ann.text.split(" ");
      let line = "";
      let lineY = ann.y + pad + 14 / transform.scale;
      for (const word of words) {
        const test = line + word + " ";
        if (ctx.measureText(test).width > w - pad * 2 && line !== "") {
          ctx.fillText(line, ann.x + pad, lineY);
          line = word + " ";
          lineY += 12 / transform.scale;
        } else {
          line = test;
        }
      }
      ctx.fillText(line, ann.x + pad, lineY);
      ctx.restore();
    });

    ctx.restore();
  }, [nodes, edges, annotations, selectedNodes, highlightedPath, highlightedNodes, communityColors,
    confidenceThreshold, activeEdgeFilter, hoveredNode, hoveredEdge, transform,
    showLabels, showEdgeLabels, sizeByDegree, getNodeRadius]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => {
      const newScale = Math.max(0.15, Math.min(4, prev.scale * delta));
      const scaleDiff = newScale - prev.scale;
      return {
        x: prev.x - mx * scaleDiff / prev.scale,
        y: prev.y - my * scaleDiff / prev.scale,
        scale: newScale,
      };
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (addAnnotationMode) {
      const world = screenToWorld(sx, sy);
      onAddAnnotation(world.x, world.y);
      return;
    }

    const node = getNodeAt(sx, sy);
    if (node) {
      if (e.button === 2) {
        onNodeRightClick(node.id, e.clientX, e.clientY);
        return;
      }
      setDraggingNode(node.id);
      onNodeClick(node.id, e.ctrlKey || e.metaKey || e.shiftKey);
    } else {
      setIsPanning(true);
      setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
      onCanvasClick();
    }
  }, [addAnnotationMode, getNodeAt, onNodeRightClick, onNodeClick, onCanvasClick, screenToWorld, onAddAnnotation, transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (draggingNode) {
      const world = screenToWorld(sx, sy);
      onNodeDrag(draggingNode, world.x, world.y);
      return;
    }

    if (isPanning) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      }));
      return;
    }

    const node = getNodeAt(sx, sy);
    if (node) {
      setHoveredNode(node.id);
      setHoveredEdge(null);
      setTooltip({
        x: e.clientX - rect.left + 12,
        y: e.clientY - rect.top - 10,
        content: `${node.label} | ${node.type.toUpperCase()} | Risk: ${node.risk.toUpperCase()} | Degree: ${node.degree || 0}`,
      });
    } else {
      const edge = getEdgeAt(sx, sy);
      if (edge) {
        setHoveredEdge(edge.id);
        setHoveredNode(null);
        setTooltip({
          x: e.clientX - rect.left + 12,
          y: e.clientY - rect.top - 10,
          content: `${edge.label} | Confidence: ${edge.confidence}% | ${edge.startDate || ""}`,
        });
      } else {
        setHoveredNode(null);
        setHoveredEdge(null);
        setTooltip(null);
      }
    }
  }, [draggingNode, isPanning, panStart, getNodeAt, getEdgeAt, screenToWorld, onNodeDrag]);

  const handleMouseUp = useCallback(() => {
    setDraggingNode(null);
    setIsPanning(false);
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ cursor: addAnnotationMode ? "crosshair" : (isPanning ? "grabbing" : draggingNode ? "grabbing" : "grab") }}
    >
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
        className="w-full h-full"
      />
      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none px-2 py-1 rounded text-xs font-['JetBrains_Mono'] z-50 whitespace-nowrap"
          style={{
            left: tooltip.x, top: tooltip.y,
            background: "rgba(10,22,40,0.95)",
            border: "1px solid rgba(34,211,238,0.3)",
            color: "#D1D5DB",
          }}
        >
          {tooltip.content}
        </div>
      )}
      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        {[
          { icon: "ri-add-line", action: () => setTransform(p => ({ ...p, scale: Math.min(4, p.scale * 1.2) })) },
          { icon: "ri-subtract-line", action: () => setTransform(p => ({ ...p, scale: Math.max(0.15, p.scale * 0.8) })) },
          { icon: "ri-fullscreen-line", action: () => setTransform({ x: 0, y: 0, scale: 1 }) },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            className="w-8 h-8 flex items-center justify-center rounded cursor-pointer transition-colors"
            style={{ background: "rgba(10,22,40,0.9)", border: "1px solid rgba(34,211,238,0.2)", color: "#9CA3AF" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#22D3EE")}
            onMouseLeave={e => (e.currentTarget.style.color = "#9CA3AF")}
          >
            <i className={`${btn.icon} text-sm`} />
          </button>
        ))}
      </div>
      {/* Scale indicator */}
      <div
        className="absolute bottom-4 left-4 px-2 py-1 rounded text-xs font-['JetBrains_Mono']"
        style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.15)", color: "#6B7280" }}
      >
        {Math.round(transform.scale * 100)}%
      </div>
      {addAnnotationMode && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs font-['Inter'] font-semibold"
          style={{ background: "rgba(250,204,21,0.15)", border: "1px solid rgba(250,204,21,0.4)", color: "#FACC15" }}
        >
          Click anywhere on canvas to place annotation
        </div>
      )}
    </div>
  );
};

export default GraphCanvas;
