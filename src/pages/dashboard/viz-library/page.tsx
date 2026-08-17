import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '../DashboardLayout';

const BG   = 'var(--alm-ocean-800)';
const P1   = 'var(--alm-ocean-700)';
const P2   = 'var(--alm-ocean-600)';
const P3   = 'var(--alm-ocean-500)';
const P4   = 'var(--alm-ocean-400)';
const GOLD = '#D6B47E';
const GOLD2 = '#B8893C';

// ── Inline SVG chart components ───────────────────────────────────────────────
function BarChartSVG() {
  const bars = [42, 78, 55, 90, 63, 81, 48];
  const max = 100;
  const W = 200, H = 100, padX = 12, padY = 8, barW = 20, gap = 4;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
      {bars.map((v, i) => {
        const bh = ((v / max) * (H - padY * 2));
        const x = padX + i * (barW + gap);
        const y = H - padY - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bh} fill={GOLD} opacity={0.75 + 0.25 * (v / 100)} rx={2} />
          </g>
        );
      })}
      <line x1={padX} y1={padY} x2={padX} y2={H - padY} stroke={P3} strokeWidth={0.5} />
      <line x1={padX} y1={H - padY} x2={W - padX} y2={H - padY} stroke={P3} strokeWidth={0.5} />
    </svg>
  );
}

function LineChartSVG() {
  const data = [30, 55, 40, 72, 58, 85, 60, 90, 75, 92];
  const W = 200, H = 100, padX = 12, padY = 10;
  const xs = data.map((_, i) => padX + (i / (data.length - 1)) * (W - 2 * padX));
  const ys = data.map(v => H - padY - (v / 100) * (H - 2 * padY));
  const points = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  const areaPoints = `${padX},${H - padY} ` + points + ` ${W - padX},${H - padY}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={GOLD} stopOpacity={0.3} />
          <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#lineGrad)" />
      <polyline points={points} fill="none" stroke={GOLD} strokeWidth={1.5} strokeLinejoin="round" />
      {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r={2} fill={GOLD} />)}
    </svg>
  );
}

function DonutSVG() {
  const slices = [
    { v: 38, color: '#C94A5E', label: 'High' },
    { v: 25, color: '#D4922A', label: 'Med' },
    { v: 22, color: '#D6B47E', label: 'Low' },
    { v: 15, color: '#4A8E5A', label: 'Clear' },
  ];
  const total = slices.reduce((a, s) => a + s.v, 0);
  const cx = 60, cy = 50, R = 38, r = 22;
  let angle = -Math.PI / 2;
  const paths = slices.map(s => {
    const sweep = (s.v / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle), y1 = cy + R * Math.sin(angle);
    const x2 = cx + R * Math.cos(angle + sweep), y2 = cy + R * Math.sin(angle + sweep);
    const x3 = cx + r * Math.cos(angle + sweep), y3 = cy + r * Math.sin(angle + sweep);
    const x4 = cx + r * Math.cos(angle), y4 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    const d = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
    const result = { d, color: s.color, label: s.label, v: s.v };
    angle += sweep;
    return result;
  });
  return (
    <svg viewBox="0 0 200 100" style={{ width: '100%' }}>
      {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} opacity={0.85} />)}
      <text x={cx} y={cy - 4} textAnchor="middle" fill={GOLD} fontSize="10" fontFamily="monospace">{total}</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill={P4} fontSize="6" fontFamily="monospace">Total</text>
      <g transform="translate(130,10)">
        {paths.map((p, i) => (
          <g key={i} transform={`translate(0,${i * 20})`}>
            <rect width={10} height={10} fill={p.color} rx={1.5} />
            <text x={14} y={8} fill={P4} fontSize="7" fontFamily="monospace">{p.label} {p.v}%</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function HeatMapSVG() {
  const grid = [
    [0.2, 0.4, 0.7, 0.9, 0.5],
    [0.5, 0.8, 0.6, 0.3, 0.7],
    [0.9, 0.6, 0.4, 0.8, 0.2],
    [0.3, 0.7, 0.9, 0.5, 0.8],
    [0.6, 0.2, 0.5, 0.7, 0.4],
  ];
  function heatColor(v: number) {
    if (v >= 0.8) return '#C94A5E';
    if (v >= 0.6) return '#D4922A';
    if (v >= 0.4) return '#D6B47E';
    return '#4A8E5A';
  }
  return (
    <svg viewBox="0 0 200 100" style={{ width: '100%' }}>
      {grid.map((row, ri) => row.map((v, ci) => (
        <rect key={`${ri}-${ci}`}
          x={10 + ci * 36} y={5 + ri * 18}
          width={34} height={16} rx={2}
          fill={heatColor(v)} opacity={0.7 + v * 0.3}
        />
      )))}
    </svg>
  );
}

function StatTileSVG() {
  return (
    <svg viewBox="0 0 200 100" style={{ width: '100%' }}>
      <rect x={10} y={8} width={180} height={84} rx={6} fill={P2} stroke={P3} strokeWidth={0.5} />
      <text x={20} y={38} fill={GOLD} fontSize="22" fontWeight="bold" fontFamily="monospace">1,284</text>
      <text x={20} y={54} fill={P4} fontSize="8" fontFamily="sans-serif">Active Alerts</text>
      <text x={20} y={76} fill="#4A8E5A" fontSize="9" fontFamily="monospace">▲ +12.4%  vs last 30d</text>
      <circle cx={168} cy={28} r={14} fill="#D4922A22" />
      <text x={168} y={33} textAnchor="middle" fill="#D4922A" fontSize="14">⚑</text>
    </svg>
  );
}

function HorzBarSVG() {
  const items = [
    { label: 'INTERPOL', v: 82 },
    { label: 'OpenSanct', v: 65 },
    { label: 'National', v: 55 },
    { label: 'OFAC', v: 40 },
    { label: 'Customs', v: 30 },
  ];
  return (
    <svg viewBox="0 0 200 100" style={{ width: '100%' }}>
      {items.map((item, i) => (
        <g key={i} transform={`translate(0,${10 + i * 17})`}>
          <text x={48} y={10} textAnchor="end" fill={P4} fontSize="7" fontFamily="monospace">{item.label}</text>
          <rect x={52} y={2} width={(item.v / 100) * 110} height={10} rx={1.5} fill={GOLD} opacity={0.7} />
          <text x={52 + (item.v / 100) * 110 + 4} y={10} fill={P4} fontSize="7" fontFamily="monospace">{item.v}%</text>
        </g>
      ))}
    </svg>
  );
}

function TimelineSVG() {
  const events = [
    { label: 'Entry', x: 20, color: '#4A8E5A' },
    { label: 'Hit', x: 55, color: '#C94A5E' },
    { label: 'Alert', x: 90, color: '#D4922A' },
    { label: 'Review', x: 130, color: '#D6B47E' },
    { label: 'Clear', x: 170, color: '#4A8E5A' },
  ];
  return (
    <svg viewBox="0 0 200 100" style={{ width: '100%' }}>
      <line x1={10} y1={50} x2={190} y2={50} stroke={P2} strokeWidth={1.5} />
      {events.map((e, i) => (
        <g key={i}>
          <circle cx={e.x} cy={50} r={7} fill={e.color} opacity={0.85} />
          <text x={e.x} y={36} textAnchor="middle" fill={P4} fontSize="6.5" fontFamily="monospace">{e.label}</text>
          <line x1={e.x} y1={43} x2={e.x} y2={50} stroke={e.color} strokeWidth={0.5} strokeDasharray="2 1" />
        </g>
      ))}
    </svg>
  );
}

function FunnelSVG() {
  const stages = [
    { label: 'Screened', v: 9200, color: '#5B7494' },
    { label: 'Flagged',  v: 3400, color: '#D6B47E' },
    { label: 'Reviewed', v: 820,  color: '#D4922A' },
    { label: 'Actioned', v: 142,  color: '#C94A5E' },
  ];
  const max = stages[0].v;
  return (
    <svg viewBox="0 0 200 100" style={{ width: '100%' }}>
      {stages.map((s, i) => {
        const w = 20 + (s.v / max) * 130;
        const x = (200 - w) / 2;
        return (
          <g key={i} transform={`translate(0,${5 + i * 22})`}>
            <rect x={x} y={0} width={w} height={16} rx={2} fill={s.color} opacity={0.8} />
            <text x={100} y={11} textAnchor="middle" fill="#0a1a2e" fontSize="7" fontWeight="bold" fontFamily="monospace">{s.label}: {s.v.toLocaleString()}</text>
          </g>
        );
      })}
    </svg>
  );
}

function GaugeSVG() {
  const value = 68;
  const angle = -150 + (value / 100) * 300;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcs = [
    { color: '#4A8E5A', start: -150, end: -50 },
    { color: '#D4922A', start: -50, end: 30 },
    { color: '#C94A5E', start: 30, end: 150 },
  ];
  const cx = 100, cy = 70, R = 50;
  function arcPath(startDeg: number, endDeg: number) {
    const x1 = cx + R * Math.cos(toRad(startDeg));
    const y1 = cy + R * Math.sin(toRad(startDeg));
    const x2 = cx + R * Math.cos(toRad(endDeg));
    const y2 = cy + R * Math.sin(toRad(endDeg));
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`;
  }
  const needleX = cx + (R - 14) * Math.cos(toRad(angle));
  const needleY = cy + (R - 14) * Math.sin(toRad(angle));
  return (
    <svg viewBox="0 0 200 100" style={{ width: '100%' }}>
      {arcs.map((a, i) => (
        <path key={i} d={arcPath(a.start, a.end)} fill="none" stroke={a.color} strokeWidth={10} opacity={0.7} strokeLinecap="round" />
      ))}
      <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={GOLD} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={5} fill={GOLD} />
      <text x={cx} y={cy + 18} textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="bold" fontFamily="monospace">{value}</text>
      <text x={cx} y={cy + 28} textAnchor="middle" fill={P4} fontSize="7" fontFamily="monospace">Risk Score</text>
    </svg>
  );
}

function ScatterSVG() {
  const points: [number, number, string][] = [
    [30, 70, '#C94A5E'], [50, 40, '#D4922A'], [80, 85, '#C94A5E'],
    [60, 55, '#D6B47E'], [25, 30, '#4A8E5A'], [90, 20, '#4A8E5A'],
    [45, 75, '#D4922A'], [70, 45, '#D6B47E'], [15, 60, '#4A8E5A'],
    [85, 65, '#C94A5E'],
  ];
  const W = 200, H = 100, pad = 15;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke={P3} strokeWidth={0.5} />
      <line x1={pad} y1={pad}     x2={pad}     y2={H - pad} stroke={P3} strokeWidth={0.5} />
      {points.map(([x, y, color], i) => (
        <circle key={i}
          cx={pad + (x / 100) * (W - pad * 2)}
          cy={H - pad - (y / 100) * (H - pad * 2)}
          r={4} fill={color as string} opacity={0.8}
        />
      ))}
    </svg>
  );
}

function DataTableSVG() {
  const rows = [
    ['MHD-4921', 'Volkov', 'CRITICAL', '#C94A5E'],
    ['MHD-3310', 'Al-Rashidi', 'HIGH', '#D4922A'],
    ['MHD-2288', 'Ahmadi', 'HIGH', '#D4922A'],
    ['MHD-1177', 'Mwangi', 'MED', '#D6B47E'],
  ];
  return (
    <svg viewBox="0 0 200 100" style={{ width: '100%' }}>
      <rect x={5} y={5} width={190} height={14} fill={P2} />
      {['ID', 'Name', 'Risk'].map((h, i) => (
        <text key={h} x={10 + [0, 58, 120][i]} y={15} fill={P4} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{h}</text>
      ))}
      {rows.map((row, ri) => (
        <g key={ri} transform={`translate(0,${20 + ri * 18})`}>
          <rect x={5} y={0} width={190} height={16} fill={ri % 2 === 0 ? P2 + '33' : 'transparent'} />
          <text x={10} y={11} fill={GOLD} fontSize="6.5" fontFamily="monospace">{row[0]}</text>
          <text x={68} y={11} fill="#e8dcc8" fontSize="6.5" fontFamily="monospace">{row[1]}</text>
          <rect x={122} y={2} width={30} height={11} rx={2} fill={(row[3] as string) + '33'} />
          <text x={137} y={10} textAnchor="middle" fill={row[3] as string} fontSize="6" fontFamily="monospace">{row[2]}</text>
        </g>
      ))}
    </svg>
  );
}

function AreaChartSVG() {
  const data = [20, 38, 30, 60, 45, 78, 55, 88, 70, 95];
  const W = 200, H = 100, padX = 10, padY = 8;
  const xs = data.map((_, i) => padX + (i / (data.length - 1)) * (W - 2 * padX));
  const ys = data.map(v => H - padY - (v / 100) * (H - 2 * padY));
  const linePoints = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  const areaPath = `M ${padX},${H - padY} ` + xs.map((x, i) => `L ${x},${ys[i]}`).join(' ') + ` L ${W - padX},${H - padY} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#4A8E5A" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#4A8E5A" stopOpacity={0.05} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaGrad)" />
      <polyline points={linePoints} fill="none" stroke="#4A8E5A" strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

// ── Widget definitions ─────────────────────────────────────────────────────────
interface Widget {
  id: string;
  name: string;
  desc: string;
  icon: string;
  preview: React.ReactNode;
  category: string;
}

const WIDGETS: Widget[] = [
  { id: 'kpi-tile',     name: 'KPI Tile',        desc: 'Single metric with delta indicator',           icon: 'ri-number-1', category: 'Core',      preview: <StatTileSVG /> },
  { id: 'bar-chart',    name: 'Bar Chart',        desc: 'Vertical bars for categorical comparison',     icon: 'ri-bar-chart-line', category: 'Charts', preview: <BarChartSVG /> },
  { id: 'line-chart',   name: 'Trend Line',       desc: 'Time-series data as a connected line',         icon: 'ri-line-chart-line', category: 'Charts', preview: <LineChartSVG /> },
  { id: 'area-chart',   name: 'Area Chart',       desc: 'Filled trend chart for cumulative data',       icon: 'ri-line-chart-fill', category: 'Charts', preview: <AreaChartSVG /> },
  { id: 'donut-chart',  name: 'Donut / Pie',      desc: 'Part-to-whole composition chart',              icon: 'ri-pie-chart-2-line', category: 'Charts', preview: <DonutSVG /> },
  { id: 'horz-bar',     name: 'Horizontal Bar',   desc: 'Ranked bar chart with source labels',          icon: 'ri-bar-chart-horizontal-line', category: 'Charts', preview: <HorzBarSVG /> },
  { id: 'heat-map',     name: 'Risk Heat Map',     desc: '2-D grid coloured by threat severity',         icon: 'ri-grid-fill', category: 'Risk',     preview: <HeatMapSVG /> },
  { id: 'data-table',   name: 'Data Table',        desc: 'Sortable tabular data with status badges',     icon: 'ri-table-line', category: 'Core',     preview: <DataTableSVG /> },
  { id: 'timeline',     name: 'Alert Timeline',   desc: 'Horizontal event sequence',                    icon: 'ri-time-line', category: 'Core',      preview: <TimelineSVG /> },
  { id: 'funnel-chart', name: 'Funnel Chart',     desc: 'Pipeline conversion or screening funnel',      icon: 'ri-filter-3-line', category: 'Risk',   preview: <FunnelSVG /> },
  { id: 'gauge-chart',  name: 'Gauge / Dial',     desc: 'Single score on an arc dial',                  icon: 'ri-speed-line', category: 'Core',     preview: <GaugeSVG /> },
  { id: 'scatter-plot', name: 'Scatter Plot',     desc: 'Multi-variate dot plot with risk colouring',   icon: 'ri-bubble-chart-line', category: 'Charts', preview: <ScatterSVG /> },
];

const SAVED_DASHBOARDS = [
  {
    id: 'db-001', name: 'Executive Overview', desc: 'C-level KPIs, risk score trend, threat donut',
    widgets: ['kpi-tile', 'line-chart', 'donut-chart', 'gauge-chart'],
    lastModified: '2026-08-14', createdBy: 'Ahmed Al-Balushi',
  },
  {
    id: 'db-002', name: 'Risk Summary', desc: 'Heat map, funnel, horizontal bar by source, scatter',
    widgets: ['heat-map', 'funnel-chart', 'horz-bar', 'scatter-plot'],
    lastModified: '2026-08-12', createdBy: 'Saif Al-Rawahi',
  },
  {
    id: 'db-003', name: 'Operational Daily', desc: 'Real-time alert KPI tiles, timeline, data table',
    widgets: ['kpi-tile', 'kpi-tile', 'timeline', 'data-table'],
    lastModified: '2026-08-17', createdBy: 'Nour Al-Habsi',
  },
];

type Tab = 'gallery' | 'builder' | 'saved';

export default function VizLibraryPage() {
  const { isAr } = useOutletContext<DashboardOutletContext>();

  const [activeTab, setActiveTab] = useState<Tab>('gallery');
  const [canvasWidgets, setCanvasWidgets] = useState<Widget[]>([]);
  const [catFilter, setCatFilter] = useState<string>('All');
  const [dashboardName, setDashboardName] = useState('My Dashboard');
  const [savedMsg, setSavedMsg] = useState(false);

  const categories = ['All', 'Core', 'Charts', 'Risk'];
  const filtered = catFilter === 'All' ? WIDGETS : WIDGETS.filter(w => w.category === catFilter);

  function addWidget(w: Widget) {
    setCanvasWidgets(prev => [...prev, { ...w, id: w.id + '-' + Date.now() }]);
    setActiveTab('builder');
  }

  function removeWidget(id: string) {
    setCanvasWidgets(prev => prev.filter(w => w.id !== id));
  }

  function saveDashboard() {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  }

  const CHIP = (active: boolean): React.CSSProperties => ({
    padding: '0.3rem 0.8rem',
    borderRadius: 4,
    border: `1px solid ${active ? GOLD : P2}`,
    background: active ? GOLD + '20' : P2,
    color: active ? GOLD : P4,
    fontSize: '0.75rem',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
    letterSpacing: '0.06em',
  });

  const TAB = (t: Tab, label: string) => (
    <button
      onClick={() => setActiveTab(t)}
      style={{
        padding: '0.5rem 1.25rem',
        background: 'none',
        border: 'none',
        borderBottom: activeTab === t ? `2px solid ${GOLD}` : '2px solid transparent',
        color: activeTab === t ? GOLD : P4,
        fontSize: '0.82rem',
        fontFamily: "'JetBrains Mono', monospace",
        cursor: 'pointer',
        letterSpacing: '0.06em',
        paddingBottom: '0.75rem',
      }}
    >
      {label}
      {t === 'builder' && canvasWidgets.length > 0 && (
        <span style={{ marginLeft: '0.5rem', background: GOLD2, color: '#0a1a2e', borderRadius: 8, padding: '0.05rem 0.4rem', fontSize: '0.65rem', fontWeight: 700 }}>
          {canvasWidgets.length}
        </span>
      )}
    </button>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, color: '#e8dcc8', overflow: 'hidden' }}>
      {/* Page header */}
      <div style={{ padding: '1rem 1.5rem 0', borderBottom: `1px solid ${P2}` }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ color: P4, fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
            Reporting
          </div>
          <h1 style={{ color: GOLD, fontSize: '1.1rem', margin: '0.2rem 0 0', fontFamily: "'JetBrains Mono', monospace" }}>
            Visualization Library
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0', borderTop: `1px solid ${P2}` }}>
          {TAB('gallery', 'Widget Gallery')}
          {TAB('builder', 'Dashboard Builder')}
          {TAB('saved',   'Saved Dashboards')}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
        {/* ── Widget Gallery ── */}
        {activeTab === 'gallery' && (
          <>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {categories.map(c => (
                <button key={c} style={CHIP(catFilter === c)} onClick={() => setCatFilter(c)}>{c}</button>
              ))}
              <div style={{ marginLeft: 'auto', color: P4, fontSize: '0.75rem', alignSelf: 'center' }}>
                {filtered.length} widget{filtered.length !== 1 ? 's' : ''} available
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              {filtered.map(w => (
                <div
                  key={w.id}
                  style={{
                    background: P1,
                    borderRadius: 8,
                    border: `1px solid ${P2}`,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Preview */}
                  <div style={{ padding: '0.75rem 0.75rem 0', background: P2 + '55' }}>
                    {w.preview}
                  </div>
                  {/* Info */}
                  <div style={{ padding: '0.8rem', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <i className={w.icon} style={{ color: GOLD, fontSize: '0.9rem' }} />
                      <span style={{ color: '#e8dcc8', fontWeight: 600, fontSize: '0.82rem' }}>{w.name}</span>
                    </div>
                    <p style={{ color: P4, fontSize: '0.72rem', margin: '0 0 0.75rem', lineHeight: 1.4 }}>{w.desc}</p>
                    <button
                      onClick={() => addWidget(w)}
                      style={{
                        width: '100%',
                        padding: '0.4rem',
                        background: GOLD2 + '33',
                        color: GOLD,
                        border: `1px solid ${GOLD2}55`,
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: '0.05em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <i className="ri-add-line" /> Add to Builder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Dashboard Builder ── */}
        {activeTab === 'builder' && (
          <>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <input
                value={dashboardName}
                onChange={e => setDashboardName(e.target.value)}
                style={{
                  padding: '0.5rem 0.85rem', background: P1, border: `1px solid ${P2}`, borderRadius: 5,
                  color: '#e8dcc8', fontSize: '0.9rem', fontWeight: 600, outline: 'none', minWidth: 220,
                }}
              />
              <button
                onClick={() => setActiveTab('gallery')}
                style={{ padding: '0.45rem 1rem', background: P2, color: GOLD, border: `1px solid ${P3}`, borderRadius: 5, cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <i className="ri-add-circle-line" /> Add Widgets
              </button>
              {canvasWidgets.length > 0 && (
                <button
                  onClick={saveDashboard}
                  style={{ padding: '0.45rem 1.1rem', background: GOLD2, color: '#0a1a2e', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <i className="ri-save-line" /> Save Dashboard
                </button>
              )}
              {savedMsg && (
                <span style={{ color: '#4A8E5A', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <i className="ri-checkbox-circle-line" /> Saved to library
                </span>
              )}
            </div>

            {canvasWidgets.length === 0 ? (
              <div
                style={{
                  border: `2px dashed ${P2}`, borderRadius: 10, minHeight: 320,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                  gap: '0.75rem', color: P4,
                }}
              >
                <i className="ri-layout-3-line" style={{ fontSize: '2.5rem', color: P3 }} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Your canvas is empty</p>
                <p style={{ margin: 0, fontSize: '0.78rem' }}>Go to Widget Gallery and click "Add to Builder"</p>
                <button
                  onClick={() => setActiveTab('gallery')}
                  style={{ marginTop: '0.5rem', padding: '0.5rem 1.2rem', background: P2, color: GOLD, border: `1px solid ${P3}`, borderRadius: 5, cursor: 'pointer', fontSize: '0.78rem' }}
                >
                  Browse Widgets
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                {canvasWidgets.map(w => {
                  const def = WIDGETS.find(d => d.id.split('-')[0] === w.id.split('-')[0]) ?? w;
                  return (
                    <div
                      key={w.id}
                      style={{ background: P1, borderRadius: 8, border: `1px solid ${P2}`, overflow: 'hidden' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: P2 + '66', borderBottom: `1px solid ${P2}` }}>
                        <span style={{ fontSize: '0.75rem', color: '#e8dcc8', fontWeight: 600 }}>{def.name}</span>
                        <button
                          onClick={() => removeWidget(w.id)}
                          style={{ background: 'none', border: 'none', color: P4, cursor: 'pointer', fontSize: '0.9rem', padding: '0 0.1rem' }}
                        >
                          <i className="ri-close-line" />
                        </button>
                      </div>
                      <div style={{ padding: '0.75rem' }}>
                        {def.preview}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── Saved Dashboards ── */}
        {activeTab === 'saved' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {SAVED_DASHBOARDS.map(db => (
              <div key={db.id} style={{ background: P1, borderRadius: 9, padding: '1.25rem', border: `1px solid ${P2}`, display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* Widget count preview */}
                <div style={{ width: 80, height: 56, background: P2, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                    {db.widgets.slice(0, 4).map((_, i) => (
                      <div key={i} style={{ width: 28, height: 22, background: P3, borderRadius: 3 }} />
                    ))}
                  </div>
                </div>
                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#e8dcc8', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.2rem' }}>{db.name}</div>
                  <div style={{ color: P4, fontSize: '0.78rem', marginBottom: '0.4rem' }}>{db.desc}</div>
                  <div style={{ color: P4, fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace" }}>
                    {db.widgets.length} widgets · Last updated {db.lastModified} · {db.createdBy}
                  </div>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button style={{ padding: '0.4rem 0.9rem', background: P2, color: GOLD, border: `1px solid ${P3}`, borderRadius: 5, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <i className="ri-eye-line" /> View
                  </button>
                  <button style={{ padding: '0.4rem 0.9rem', background: P2, color: P4, border: `1px solid ${P3}`, borderRadius: 5, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <i className="ri-edit-line" /> Edit
                  </button>
                  <button style={{ padding: '0.4rem 0.9rem', background: P2, color: P4, border: `1px solid ${P3}`, borderRadius: 5, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <i className="ri-file-copy-line" /> Clone
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
