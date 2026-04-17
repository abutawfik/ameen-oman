import { useState } from 'react';
import { trendData, lastWeekTrendData, type TrendPoint } from '@/mocks/predictiveAnalyticsData';

type TrendCategoryKey = Exclude<keyof TrendPoint, 'label'>;

const CATEGORIES: { key: TrendCategoryKey; label: string; color: string }[] = [
  { key: 'arrival',       label: 'Arrival',       color: '#D6B47E' },
  { key: 'financial',     label: 'Financial',     color: '#4ADE80' },
  { key: 'identity',      label: 'Identity',      color: '#C94A5E' },
  { key: 'accommodation', label: 'Accommodation', color: '#FACC15' },
  { key: 'employment',    label: 'Employment',    color: '#F9A8D4' },
  { key: 'maritime',      label: 'Maritime',      color: '#60A5FA' },
  { key: 'customs',       label: 'Customs',       color: '#FCD34D' },
];

const CHART_H = 130;

type ViewMode = 'stacked' | 'compare';

export default function TrendCharts() {
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(CATEGORIES.map(c => c.key))
  );
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('stacked');

  const toggleCategory = (key: string) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const getDayTotal = (data: typeof trendData, i: number) =>
    CATEGORIES.filter(c => activeCategories.has(c.key))
      .reduce((sum, c) => sum + data[i][c.key], 0);

  const thisWeekTotals = trendData.map((_, i) => getDayTotal(trendData, i));
  const lastWeekTotals = lastWeekTrendData.map((_, i) => getDayTotal(lastWeekTrendData, i));
  const maxVal = Math.max(...thisWeekTotals, ...lastWeekTotals);

  const thisWeekSum = thisWeekTotals.reduce((a, b) => a + b, 0);
  const lastWeekSum = lastWeekTotals.reduce((a, b) => a + b, 0);
  const avgSum = Math.round((thisWeekSum + lastWeekSum) / 2);
  const changePct = lastWeekSum > 0 ? Math.round(((thisWeekSum - lastWeekSum) / lastWeekSum) * 100) : 0;

  const peakDay = trendData[thisWeekTotals.indexOf(Math.max(...thisWeekTotals))].label;

  return (
    <div
      className="rounded-xl border border-gold-500/20 p-5"
      style={{ background: 'rgba(10,37,64,0.8)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-sm">Pattern Trigger Trends</h3>
          <p className="text-gray-400 text-xs mt-0.5">7-day breakdown by rule category</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg border border-gold-500/20" style={{ background: 'rgba(5,20,40,0.5)' }}>
            {(['stacked', 'compare'] as ViewMode[]).map(m => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className="px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer whitespace-nowrap"
                style={{
                  background: viewMode === m ? '#D6B47E' : 'transparent',
                  color: viewMode === m ? '#051428' : '#9CA3AF',
                }}
              >
                {m === 'stacked' ? 'Stacked' : 'Compare'}
              </button>
            ))}
          </div>
          {/* Summary */}
          <div className="flex items-center gap-3 text-xs">
            <div className="text-center">
              <p className="text-gold-400 font-mono font-bold">{thisWeekSum}</p>
              <p className="text-gray-500">This Wk</p>
            </div>
            <div className="text-center">
              <p className="text-gray-300 font-mono font-bold">{lastWeekSum}</p>
              <p className="text-gray-500">Last Wk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend toggles */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => toggleCategory(cat.key)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border transition-all cursor-pointer whitespace-nowrap"
            style={{
              borderColor: activeCategories.has(cat.key) ? cat.color : 'rgba(156,163,175,0.2)',
              background: activeCategories.has(cat.key) ? `${cat.color}15` : 'transparent',
              color: activeCategories.has(cat.key) ? cat.color : '#6B7280',
              fontSize: 10,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: activeCategories.has(cat.key) ? cat.color : '#4B5563' }} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: CHART_H + 28 }}>
        {/* Y-axis grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(pct => (
          <div
            key={pct}
            className="absolute left-0 right-0 border-t border-gold-500/5"
            style={{ bottom: 24 + pct * CHART_H }}
          />
        ))}

        <div className="flex items-end gap-1.5 h-full pb-6">
          {trendData.map((day, i) => {
            const activeCats = CATEGORIES.filter(c => activeCategories.has(c.key));
            const total = thisWeekTotals[i];
            const lastTotal = lastWeekTotals[i];
            const isHovered = hoveredDay === i;

            return (
              <div
                key={day.label}
                className="flex-1 flex flex-col items-center gap-0.5 relative cursor-pointer"
                onMouseEnter={() => setHoveredDay(i)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div
                    className="absolute z-20 rounded-lg border border-gold-500/30 p-2.5 pointer-events-none"
                    style={{ background: 'rgba(10,37,64,0.98)', bottom: CHART_H + 32, left: '50%', transform: 'translateX(-50%)', minWidth: 130 }}
                  >
                    <p className="text-white font-semibold text-xs mb-1.5">{day.label} — {total} triggers</p>
                    {activeCats.map(c => (
                      <div key={c.key} className="flex items-center justify-between gap-3 text-xs">
                        <span style={{ color: c.color }}>{c.label}</span>
                        <span className="text-white font-mono">{day[c.key]}</span>
                      </div>
                    ))}
                    {viewMode === 'compare' && (
                      <div className="mt-1.5 pt-1.5 border-t border-gray-700 flex items-center justify-between text-xs">
                        <span className="text-gray-400">Last week</span>
                        <span className="text-gray-300 font-mono">{lastTotal}</span>
                      </div>
                    )}
                  </div>
                )}

                {viewMode === 'stacked' ? (
                  /* Stacked bars */
                  <div
                    className="relative flex flex-col-reverse rounded-t-sm overflow-hidden transition-all duration-200 w-full"
                    style={{
                      height: maxVal > 0 ? (total / maxVal) * CHART_H : 2,
                      minHeight: 2,
                      opacity: isHovered ? 1 : 0.82,
                      outline: isHovered ? '1px solid rgba(184,138,60,0.5)' : 'none',
                    }}
                  >
                    {activeCats.map(cat => {
                      const val = day[cat.key];
                      const pct = total > 0 ? (val / total) * 100 : 0;
                      return (
                        <div
                          key={cat.key}
                          style={{ height: `${pct}%`, background: cat.color, minHeight: val > 0 ? 2 : 0 }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  /* Compare mode: this week vs last week side by side */
                  <div className="flex items-end gap-0.5 w-full" style={{ height: CHART_H }}>
                    <div
                      className="flex-1 rounded-t-sm transition-all"
                      style={{
                        height: maxVal > 0 ? (total / maxVal) * CHART_H : 2,
                        background: '#D6B47E',
                        opacity: isHovered ? 1 : 0.8,
                        minHeight: 2,
                      }}
                    />
                    <div
                      className="flex-1 rounded-t-sm transition-all"
                      style={{
                        height: maxVal > 0 ? (lastTotal / maxVal) * CHART_H : 2,
                        background: 'rgba(156,163,175,0.4)',
                        opacity: isHovered ? 1 : 0.7,
                        minHeight: 2,
                      }}
                    />
                  </div>
                )}

                <span className="text-gray-500 font-mono absolute bottom-0" style={{ fontSize: 9 }}>{day.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {viewMode === 'compare' && (
        <div className="flex items-center gap-4 text-xs mb-3">
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-gold-400" />This Week</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm" style={{ background: 'rgba(156,163,175,0.4)' }} />Last Week</span>
        </div>
      )}

      {/* Week comparison stats */}
      <div className="mt-3 pt-3 border-t border-gold-500/10 grid grid-cols-3 gap-3">
        {[
          {
            label: 'vs Last Week',
            value: `${changePct > 0 ? '+' : ''}${changePct}%`,
            color: changePct > 0 ? '#C94A5E' : '#4ADE80',
            icon: changePct > 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line',
          },
          {
            label: 'vs 7d Avg',
            value: `${thisWeekSum > avgSum ? '+' : ''}${Math.round(((thisWeekSum - avgSum) / avgSum) * 100)}%`,
            color: '#FACC15',
            icon: 'ri-bar-chart-line',
          },
          {
            label: 'Peak Day',
            value: peakDay,
            color: '#D6B47E',
            icon: 'ri-calendar-line',
          },
        ].map(stat => (
          <div
            key={stat.label}
            className="rounded-lg px-3 py-2 text-center border border-gold-500/10"
            style={{ background: 'rgba(184,138,60,0.04)' }}
          >
            <div className="flex items-center justify-center gap-1">
              <i className={`${stat.icon} text-xs`} style={{ color: stat.color }} />
              <span className="font-mono font-bold text-sm" style={{ color: stat.color }}>{stat.value}</span>
            </div>
            <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
