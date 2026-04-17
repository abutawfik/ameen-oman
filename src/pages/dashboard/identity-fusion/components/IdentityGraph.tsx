import { useState, useRef, useEffect, useCallback } from 'react';
import { graphNodes, graphEdges, type GraphNode, type GraphEdge } from '@/mocks/identityFusionData';

interface Props { isAr: boolean; }

const riskColors: Record<string, string> = {
  low: '#4ADE80', medium: '#FACC15', high: '#C98A1B', critical: '#C94A5E',
};

const edgeColors: Record<string, string> = {
  document: '#D6B47E', phone: '#4ADE80', address: '#A78BFA',
  imei: '#C98A1B', employer: '#FACC15', biometric: '#C94A5E', email: '#38BDF8',
};

export default function IdentityGraph({ isAr }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>(graphNodes);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [confidenceFilter, setConfidenceFilter] = useState(0);
  const [edgeTypeFilter, setEdgeTypeFilter] = useState<string>('all');
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const lastPan = useRef({ x: 0, y: 0 });

  const filteredEdges = graphEdges.filter(e =>
    e.confidence >= confidenceFilter &&
    (edgeTypeFilter === 'all' || e.type === edgeTypeFilter)
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw edges
    filteredEdges.forEach(edge => {
      const src = nodes.find(n => n.id === edge.source);
      const tgt = nodes.find(n => n.id === edge.target);
      if (!src || !tgt) return;

      const alpha = edge.confidence / 100;
      const thickness = Math.max(1, (edge.confidence / 100) * 3);
      const color = edgeColors[edge.type] || '#D6B47E';

      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(tgt.x, tgt.y);
      ctx.strokeStyle = color + Math.round(alpha * 180).toString(16).padStart(2, '0');
      ctx.lineWidth = thickness / zoom;
      ctx.stroke();

      // Edge label at midpoint
      const mx = (src.x + tgt.x) / 2;
      const my = (src.y + tgt.y) / 2;
      ctx.font = `${10 / zoom}px JetBrains Mono, monospace`;
      ctx.fillStyle = color + 'AA';
      ctx.textAlign = 'center';
      ctx.fillText(`${edge.confidence}%`, mx, my - 4 / zoom);
    });

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode === node.id;
      const color = riskColors[node.riskLevel];
      const r = isSelected ? 28 : isHovered ? 26 : 22;

      // Glow
      if (isSelected || isHovered) {
        const grd = ctx.createRadialGradient(node.x, node.y, r * 0.5, node.x, node.y, r * 2);
        grd.addColorStop(0, color + '40');
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // Outer ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 3, 0, Math.PI * 2);
      ctx.strokeStyle = color + (isSelected ? 'CC' : '55');
      ctx.lineWidth = isSelected ? 2 / zoom : 1 / zoom;
      ctx.stroke();

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10,37,64,0.95)`;
      ctx.fill();
      ctx.strokeStyle = color + (isSelected ? 'FF' : '88');
      ctx.lineWidth = 1.5 / zoom;
      ctx.stroke();

      // Initials
      ctx.font = `bold ${12 / zoom}px Inter, sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.initials, node.x, node.y);

      // Name label below
      ctx.font = `${9 / zoom}px Inter, sans-serif`;
      ctx.fillStyle = isSelected ? '#FFFFFF' : '#9CA3AF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const shortName = node.label.split(' ').slice(0, 2).join(' ');
      ctx.fillText(shortName, node.x, node.y + r + 4 / zoom);

      // Merge count badge
      if (node.mergedCount > 1) {
        ctx.beginPath();
        ctx.arc(node.x + r * 0.7, node.y - r * 0.7, 8 / zoom, 0, Math.PI * 2);
        ctx.fillStyle = '#D6B47E';
        ctx.fill();
        ctx.font = `bold ${8 / zoom}px JetBrains Mono, monospace`;
        ctx.fillStyle = '#051428';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(node.mergedCount), node.x + r * 0.7, node.y - r * 0.7);
      }
    });

    ctx.restore();
  }, [nodes, filteredEdges, selectedNode, hoveredNode, zoom, pan]);

  useEffect(() => { draw(); }, [draw]);

  const getNodeAt = (cx: number, cy: number) => {
    const wx = (cx - pan.x) / zoom;
    const wy = (cy - pan.y) / zoom;
    return nodes.find(n => Math.hypot(n.x - wx, n.y - wy) < 28);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const node = getNodeAt(cx, cy);
    if (node) {
      setDragging(node.id);
      setDragOffset({ x: cx - (node.x * zoom + pan.x), y: cy - (node.y * zoom + pan.y) });
    } else {
      isPanning.current = true;
      lastPan.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    if (dragging) {
      const nx = (cx - dragOffset.x) / zoom;
      const ny = (cy - dragOffset.y) / zoom;
      setNodes(prev => prev.map(n => n.id === dragging ? { ...n, x: nx, y: ny } : n));
    } else if (isPanning.current) {
      setPan({ x: e.clientX - lastPan.current.x, y: e.clientY - lastPan.current.y });
    } else {
      const node = getNodeAt(cx, cy);
      setHoveredNode(node?.id || null);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging && !isPanning.current) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const node = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
      setSelectedNode(node || null);
    }
    setDragging(null);
    isPanning.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setZoom(z => Math.max(0.4, Math.min(2.5, z - e.deltaY * 0.001)));
  };

  const edgeTypes = ['all', 'document', 'phone', 'address', 'imei', 'employer', 'email'];

  return (
    <div className="p-5 flex gap-4 h-full" style={{ minHeight: 600 }}>
      {/* Controls sidebar */}
      <div className="w-56 shrink-0 space-y-4">
        {/* Zoom controls */}
        <div
          className="rounded-xl border border-gold-500/15 p-4"
          style={{ background: 'rgba(10,37,64,0.8)' }}
        >
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 font-['JetBrains_Mono']">
            {isAr ? 'التحكم' : 'Controls'}
          </p>
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setZoom(z => Math.max(0.4, z - 0.2))}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gold-500/25 text-gold-400 hover:bg-gold-500/10 cursor-pointer transition-colors"
            >
              <i className="ri-zoom-out-line text-sm" />
            </button>
            <div className="flex-1 text-center">
              <span className="text-white font-mono text-sm">{Math.round(zoom * 100)}%</span>
            </div>
            <button
              onClick={() => setZoom(z => Math.min(2.5, z + 0.2))}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gold-500/25 text-gold-400 hover:bg-gold-500/10 cursor-pointer transition-colors"
            >
              <i className="ri-zoom-in-line text-sm" />
            </button>
          </div>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="w-full py-1.5 rounded-lg text-xs border border-gold-500/20 text-gold-400 hover:bg-gold-500/8 cursor-pointer transition-colors font-['Inter'] whitespace-nowrap"
          >
            {isAr ? 'إعادة ضبط' : 'Reset View'}
          </button>
        </div>

        {/* Confidence filter */}
        <div
          className="rounded-xl border border-gold-500/15 p-4"
          style={{ background: 'rgba(10,37,64,0.8)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-xs uppercase tracking-wider font-['JetBrains_Mono']">
              {isAr ? 'حد الثقة' : 'Min Confidence'}
            </p>
            <span className="text-gold-400 font-mono text-xs">{confidenceFilter}%</span>
          </div>
          <input
            type="range" min={0} max={90} step={5} value={confidenceFilter}
            onChange={e => setConfidenceFilter(Number(e.target.value))}
            className="w-full h-1 rounded-full cursor-pointer accent-gold-400"
          />
        </div>

        {/* Edge type filter */}
        <div
          className="rounded-xl border border-gold-500/15 p-4"
          style={{ background: 'rgba(10,37,64,0.8)' }}
        >
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 font-['JetBrains_Mono']">
            {isAr ? 'نوع الرابط' : 'Edge Type'}
          </p>
          <div className="space-y-1">
            {edgeTypes.map(t => (
              <button
                key={t}
                onClick={() => setEdgeTypeFilter(t)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors text-left"
                style={{ background: edgeTypeFilter === t ? 'rgba(184,138,60,0.1)' : 'transparent' }}
              >
                {t !== 'all' && (
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: edgeColors[t] }} />
                )}
                {t === 'all' && <i className="ri-links-line text-gold-400 text-xs" />}
                <span
                  className="text-xs font-['Inter'] capitalize"
                  style={{ color: edgeTypeFilter === t ? '#D6B47E' : '#9CA3AF' }}
                >
                  {t === 'all' ? (isAr ? 'الكل' : 'All Types') : t}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div
          className="rounded-xl border border-gold-500/15 p-4"
          style={{ background: 'rgba(10,37,64,0.8)' }}
        >
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 font-['JetBrains_Mono']">
            {isAr ? 'مستوى الخطر' : 'Risk Level'}
          </p>
          {Object.entries(riskColors).map(([level, color]) => (
            <div key={level} className="flex items-center gap-2 mb-1.5">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
              <span className="text-gray-400 text-xs font-['Inter'] capitalize">{level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 flex flex-col gap-3">
        <div
          className="flex-1 rounded-xl border border-gold-500/15 overflow-hidden relative"
          style={{ background: 'rgba(5,20,40,0.9)', minHeight: 480 }}
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(184,138,60,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.15) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <canvas
            ref={canvasRef}
            width={800}
            height={520}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { setHoveredNode(null); setDragging(null); isPanning.current = false; }}
            onWheel={handleWheel}
          />
          {/* Hint */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.1)' }}>
            <i className="ri-drag-move-line text-gray-500 text-xs" />
            <span className="text-gray-600 text-xs font-['JetBrains_Mono']">
              {isAr ? 'اسحب للتحريك · انقر للتحديد · عجلة للتكبير' : 'Drag to move · Click to select · Scroll to zoom'}
            </span>
          </div>
        </div>

        {/* Selected node detail */}
        {selectedNode && (
          <div
            className="rounded-xl border border-gold-500/20 p-4"
            style={{ background: 'rgba(10,37,64,0.9)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                style={{ background: `${riskColors[selectedNode.riskLevel]}15`, color: riskColors[selectedNode.riskLevel], border: `2px solid ${riskColors[selectedNode.riskLevel]}40` }}
              >
                {selectedNode.initials}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm font-['Inter']">{selectedNode.label}</p>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{selectedNode.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-white font-mono font-bold text-lg">{selectedNode.mergedCount}</p>
                  <p className="text-gray-600 text-xs font-['Inter']">{isAr ? 'مدمج' : 'Merged'}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.streams.map(s => (
                    <span key={s} className="text-xs px-1.5 py-0.5 rounded font-['JetBrains_Mono']"
                      style={{ background: 'rgba(184,138,60,0.08)', color: '#D6B47E', fontSize: 9 }}>
                      {s.toUpperCase()}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                  <i className="ri-close-line" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
