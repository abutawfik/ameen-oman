import { useState } from 'react';
import { streamLabels, heatmapData, cellRules } from '@/mocks/predictiveAnalyticsData';

interface CellDetailModal {
  row: string;
  col: string;
  value: number;
  rules: string[];
}

const getColor = (value: number): string => {
  if (value >= 90) return 'rgba(184,138,60,0.92)';
  if (value >= 75) return 'rgba(184,138,60,0.70)';
  if (value >= 60) return 'rgba(184,138,60,0.50)';
  if (value >= 45) return 'rgba(184,138,60,0.32)';
  if (value >= 30) return 'rgba(184,138,60,0.18)';
  return 'rgba(184,138,60,0.06)';
};

const getTextColor = (value: number): string => {
  if (value >= 75) return '#051428';
  if (value >= 50) return '#D1D5DB';
  return '#6B7280';
};

const strengthLabel = (v: number) => {
  if (v >= 90) return 'Very High';
  if (v >= 75) return 'High';
  if (v >= 60) return 'Medium-High';
  if (v >= 45) return 'Medium';
  if (v >= 30) return 'Low-Medium';
  return 'Low';
};

export default function PatternHeatmap() {
  const [hovered, setHovered] = useState<{ row: string; col: string } | null>(null);
  const [modal, setModal] = useState<CellDetailModal | null>(null);
  const [highlightStream, setHighlightStream] = useState<string | null>(null);

  const handleCellClick = (row: string, col: string, value: number) => {
    if (row === col) return;
    const key1 = `${row}-${col}`;
    const key2 = `${col}-${row}`;
    const rules = cellRules[key1] || cellRules[key2] || [];
    setModal({ row, col, value, rules });
  };

  return (
    <div
      className="rounded-xl border border-gold-500/20 p-5"
      style={{ background: 'rgba(10,37,64,0.8)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-sm">14-Stream Correlation Heatmap</h3>
          <p className="text-gray-400 text-xs mt-0.5">Cross-stream pattern correlation intensity — click any cell to see linking rules</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 shrink-0">
          {[
            { label: 'Low', bg: 'rgba(184,138,60,0.06)' },
            { label: 'Med', bg: 'rgba(184,138,60,0.32)' },
            { label: 'High', bg: 'rgba(184,138,60,0.70)' },
            { label: 'Max', bg: 'rgba(184,138,60,0.92)' },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm border border-gold-500/20" style={{ background: l.bg }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* Stream filter pills */}
      <div className="flex flex-wrap gap-1 mb-3">
        {streamLabels.map(s => (
          <button
            key={s.key}
            onClick={() => setHighlightStream(highlightStream === s.key ? null : s.key)}
            className="px-2 py-0.5 rounded-full text-xs border transition-all cursor-pointer whitespace-nowrap"
            style={{
              borderColor: highlightStream === s.key ? s.color : 'rgba(156,163,175,0.2)',
              background: highlightStream === s.key ? `${s.color}20` : 'transparent',
              color: highlightStream === s.key ? s.color : '#6B7280',
              fontSize: 10,
            }}
          >
            {s.short}
          </button>
        ))}
        {highlightStream && (
          <button
            onClick={() => setHighlightStream(null)}
            className="px-2 py-0.5 rounded-full text-xs border border-gray-600 text-gray-400 cursor-pointer"
            style={{ fontSize: 10 }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 680 }}>
          {/* Column headers */}
          <div className="flex mb-1 ml-12">
            {streamLabels.map(s => (
              <div
                key={s.key}
                className="text-center font-mono transition-colors"
                style={{
                  width: 42,
                  fontSize: 8,
                  flexShrink: 0,
                  color: highlightStream === s.key ? s.color : '#6B7280',
                  fontWeight: highlightStream === s.key ? 700 : 400,
                }}
              >
                {s.short}
              </div>
            ))}
          </div>

          {/* Rows */}
          {streamLabels.map(rowStream => (
            <div key={rowStream.key} className="flex items-center mb-0.5">
              <div
                className="font-mono text-right pr-2 shrink-0 transition-colors"
                style={{
                  width: 48,
                  fontSize: 8,
                  color: highlightStream === rowStream.key ? rowStream.color : '#6B7280',
                  fontWeight: highlightStream === rowStream.key ? 700 : 400,
                }}
              >
                {rowStream.short}
              </div>
              {streamLabels.map(colStream => {
                const val = heatmapData[rowStream.key]?.[colStream.key] ?? 0;
                const isHovered = hovered?.row === rowStream.key && hovered?.col === colStream.key;
                const isDiag = rowStream.key === colStream.key;
                const isHighlighted = highlightStream === rowStream.key || highlightStream === colStream.key;
                const isDimmed = highlightStream !== null && !isHighlighted;

                return (
                  <div
                    key={colStream.key}
                    className="rounded-sm flex items-center justify-center cursor-pointer transition-all duration-150"
                    style={{
                      width: 42,
                      height: 26,
                      flexShrink: 0,
                      background: isDiag ? 'rgba(184,138,60,0.15)' : getColor(val),
                      border: isHovered ? '1px solid #D6B47E' : '1px solid transparent',
                      transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                      zIndex: isHovered ? 10 : 1,
                      position: 'relative',
                      opacity: isDimmed ? 0.25 : 1,
                    }}
                    onMouseEnter={() => setHovered({ row: rowStream.key, col: colStream.key })}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleCellClick(rowStream.key, colStream.key, val)}
                  >
                    <span
                      className="font-mono font-bold"
                      style={{ fontSize: 7, color: isDiag ? '#D6B47E' : getTextColor(val) }}
                    >
                      {isDiag ? '—' : val}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Hover tooltip */}
      {hovered && hovered.row !== hovered.col && (
        <div
          className="mt-3 px-3 py-2 rounded-lg border border-gold-500/20 text-xs flex items-center gap-3"
          style={{ background: 'rgba(184,138,60,0.05)' }}
        >
          <span style={{ color: streamLabels.find(s => s.key === hovered.row)?.color }}>
            {streamLabels.find(s => s.key === hovered.row)?.label}
          </span>
          <i className="ri-links-line text-gray-500" />
          <span style={{ color: streamLabels.find(s => s.key === hovered.col)?.color }}>
            {streamLabels.find(s => s.key === hovered.col)?.label}
          </span>
          <span className="text-gray-500">—</span>
          <span className="font-mono font-bold text-gold-400">
            {heatmapData[hovered.row]?.[hovered.col] ?? 0}
          </span>
          <span className="text-gray-400">
            {strengthLabel(heatmapData[hovered.row]?.[hovered.col] ?? 0)} correlation
          </span>
          <span className="text-gray-600 ml-auto">Click to see rules</span>
        </div>
      )}

      {/* Cell Detail Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(5,20,40,0.85)' }}
          onClick={() => setModal(null)}
        >
          <div
            className="rounded-xl border border-gold-500/30 p-6 w-full max-w-md mx-4"
            style={{ background: 'rgba(10,37,64,0.98)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-white font-semibold text-sm">
                  {streamLabels.find(s => s.key === modal.row)?.label}
                  <span className="text-gray-500 mx-2">×</span>
                  {streamLabels.find(s => s.key === modal.col)?.label}
                </h4>
                <p className="text-gray-500 text-xs mt-0.5">Stream correlation detail</p>
              </div>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white cursor-pointer">
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-5 p-3 rounded-lg border border-gold-500/15" style={{ background: 'rgba(184,138,60,0.04)' }}>
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center font-mono font-bold text-2xl shrink-0"
                style={{ background: getColor(modal.value), color: modal.value >= 75 ? '#051428' : '#D6B47E', border: '1px solid rgba(184,138,60,0.3)' }}
              >
                {modal.value}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{strengthLabel(modal.value)} Correlation</p>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  {modal.value >= 75
                    ? 'These two streams frequently co-occur in flagged person profiles. High intelligence value for cross-stream rules.'
                    : modal.value >= 50
                    ? 'Notable co-occurrence pattern. Worth monitoring for combined rule triggers.'
                    : 'Occasional overlap. Low priority for combined rule development.'}
                </p>
              </div>
            </div>

            {modal.rules.length > 0 ? (
              <div>
                <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">
                  Linking Rules ({modal.rules.length})
                </p>
                <div className="space-y-2">
                  {modal.rules.map(rule => (
                    <div
                      key={rule}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gold-500/20"
                      style={{ background: 'rgba(184,138,60,0.05)' }}
                    >
                      <i className="ri-git-branch-line text-gold-400 text-sm" />
                      <span className="text-white text-sm flex-1">{rule}</span>
                      <span className="text-gray-500 text-xs">Active</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="rounded-lg p-3 border border-gray-700 text-center"
                style={{ background: 'rgba(156,163,175,0.05)' }}
              >
                <i className="ri-add-circle-line text-gray-500 text-lg mb-1 block" />
                <p className="text-gray-500 text-sm">No rules defined for this stream pair yet.</p>
                <p className="text-gray-600 text-xs mt-0.5">Use the Pattern Engine to create a custom rule.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
