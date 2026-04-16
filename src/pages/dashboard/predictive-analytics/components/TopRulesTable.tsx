import { useState } from 'react';
import { topRules, alertQueue, type TopRule } from '@/mocks/predictiveAnalyticsData';

type SortKey = 'count7d' | 'count30d' | 'truePositiveRate';

const categoryColors: Record<string, string> = {
  Arrival:       '#22D3EE',
  Financial:     '#4ADE80',
  Identity:      '#F87171',
  Accommodation: '#FACC15',
  Employment:    '#F9A8D4',
  Maritime:      '#60A5FA',
  Customs:       '#FCD34D',
};

const streamIcons: Record<string, string> = {
  border: 'ri-passport-line', hotel: 'ri-hotel-line', mobile: 'ri-sim-card-line',
  car: 'ri-car-line', financial: 'ri-bank-card-line', employment: 'ri-briefcase-line',
  utility: 'ri-flashlight-line', transport: 'ri-bus-line', ecommerce: 'ri-shopping-cart-line',
  social: 'ri-global-line', municipality: 'ri-government-line', education: 'ri-graduation-cap-line',
  health: 'ri-heart-pulse-line', customs: 'ri-box-3-line',
};

export default function TopRulesTable() {
  const [sortKey, setSortKey] = useState<SortKey>('count7d');
  const [selectedRule, setSelectedRule] = useState<TopRule | null>(null);

  const sorted = [...topRules].sort((a, b) => b[sortKey] - a[sortKey]);

  const tpColor = (rate: number) => {
    if (rate >= 85) return '#4ADE80';
    if (rate >= 70) return '#FACC15';
    return '#FB923C';
  };

  const getExampleCases = (ruleId: string) =>
    alertQueue.filter(a => a.ruleId === ruleId).slice(0, 3);

  return (
    <div
      className="rounded-xl border border-cyan-500/20 p-5"
      style={{ background: 'rgba(10,22,40,0.8)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Top Triggered Rules</h3>
          <p className="text-gray-400 text-xs mt-0.5">Sorted by trigger frequency — click row for detail & example cases</p>
        </div>
        <div className="flex items-center gap-1 text-xs">
          {(['count7d', 'count30d', 'truePositiveRate'] as SortKey[]).map(key => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              className="px-2.5 py-1 rounded-md border transition-all cursor-pointer whitespace-nowrap"
              style={{
                borderColor: sortKey === key ? '#22D3EE' : 'rgba(34,211,238,0.2)',
                background: sortKey === key ? 'rgba(34,211,238,0.15)' : 'transparent',
                color: sortKey === key ? '#22D3EE' : '#9CA3AF',
              }}
            >
              {key === 'count7d' ? '7d Triggers' : key === 'count30d' ? '30d Triggers' : 'TP Rate'}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: 12 }}>
          <thead>
            <tr className="border-b border-cyan-500/10">
              {['#', 'Rule Name', 'Category', 'Streams', '7d', '30d', 'TP Rate', 'Last Triggered', 'Status'].map(h => (
                <th
                  key={h}
                  className="text-left text-gray-500 font-medium pb-2 pr-3 uppercase tracking-wider"
                  style={{ fontSize: 10 }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((rule, i) => (
              <tr
                key={rule.id}
                className="border-b border-cyan-500/5 hover:bg-cyan-500/5 cursor-pointer transition-colors"
                style={{ background: selectedRule?.id === rule.id ? 'rgba(34,211,238,0.06)' : 'transparent' }}
                onClick={() => setSelectedRule(selectedRule?.id === rule.id ? null : rule)}
              >
                <td className="py-2.5 pr-3">
                  <span className="text-gray-600 font-mono">{i + 1}</span>
                </td>
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-medium">{rule.name}</span>
                    {rule.trend === 'up' && <i className="ri-arrow-up-line text-green-400 text-xs" />}
                    {rule.trend === 'down' && <i className="ri-arrow-down-line text-red-400 text-xs" />}
                  </div>
                </td>
                <td className="py-2.5 pr-3">
                  <span
                    className="px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: `${categoryColors[rule.category] || '#9CA3AF'}20`,
                      color: categoryColors[rule.category] || '#9CA3AF',
                      fontSize: 10,
                    }}
                  >
                    {rule.category}
                  </span>
                </td>
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-0.5">
                    {rule.streamsInvolved.slice(0, 3).map(s => (
                      <div
                        key={s}
                        className="w-4 h-4 flex items-center justify-center rounded"
                        style={{ background: 'rgba(34,211,238,0.1)' }}
                        title={s}
                      >
                        <i className={`${streamIcons[s] || 'ri-database-line'} text-cyan-400`} style={{ fontSize: 8 }} />
                      </div>
                    ))}
                    {rule.streamsInvolved.length > 3 && (
                      <span className="text-gray-600" style={{ fontSize: 10 }}>+{rule.streamsInvolved.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 pr-3">
                  <span className="text-cyan-400 font-mono font-bold">{rule.count7d}</span>
                </td>
                <td className="py-2.5 pr-3">
                  <span className="text-gray-300 font-mono">{rule.count30d}</span>
                </td>
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <div className="w-14 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${rule.truePositiveRate}%`, background: tpColor(rule.truePositiveRate) }}
                      />
                    </div>
                    <span className="font-mono" style={{ color: tpColor(rule.truePositiveRate) }}>
                      {rule.truePositiveRate}%
                    </span>
                  </div>
                </td>
                <td className="py-2.5 pr-3 text-gray-400">{rule.lastTriggered}</td>
                <td className="py-2.5">
                  <span className="flex items-center gap-1" style={{ color: rule.status === 'active' ? '#4ADE80' : '#9CA3AF' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: rule.status === 'active' ? '#4ADE80' : '#9CA3AF' }} />
                    {rule.status === 'active' ? 'Active' : 'Disabled'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded rule detail */}
      {selectedRule && (
        <div
          className="mt-4 rounded-xl border border-cyan-500/20 p-4"
          style={{ background: 'rgba(34,211,238,0.03)' }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="text-cyan-400 font-semibold text-sm">{selectedRule.name}</h4>
              <p className="text-gray-400 text-xs mt-0.5">{selectedRule.description}</p>
            </div>
            <button onClick={() => setSelectedRule(null)} className="text-gray-500 hover:text-white cursor-pointer">
              <i className="ri-close-line" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Rule stats */}
            <div className="space-y-2">
              <p className="text-gray-500 text-xs uppercase tracking-wider">Rule Performance</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '7d Triggers', value: selectedRule.count7d, color: '#22D3EE' },
                  { label: '30d Triggers', value: selectedRule.count30d, color: '#9CA3AF' },
                  { label: 'True Positive', value: `${selectedRule.truePositiveRate}%`, color: tpColor(selectedRule.truePositiveRate) },
                ].map(s => (
                  <div
                    key={s.label}
                    className="rounded-lg p-2.5 border border-cyan-500/10 text-center"
                    style={{ background: 'rgba(10,22,40,0.6)' }}
                  >
                    <p className="font-mono font-bold text-sm" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1.5">Streams Involved</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRule.streamsInvolved.map(s => (
                    <span
                      key={s}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-cyan-500/20 text-cyan-400"
                      style={{ background: 'rgba(34,211,238,0.08)', fontSize: 10 }}
                    >
                      <i className={`${streamIcons[s] || 'ri-database-line'}`} style={{ fontSize: 9 }} />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Example cases */}
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1.5">Recent Cases</p>
              {getExampleCases(selectedRule.id).length > 0 ? (
                <div className="space-y-2">
                  {getExampleCases(selectedRule.id).map(c => (
                    <div
                      key={c.id}
                      className="rounded-lg border border-cyan-500/15 p-2.5 flex items-center gap-3"
                      style={{ background: 'rgba(10,22,40,0.6)' }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: `${c.photoColor}20`, color: c.photoColor }}
                      >
                        {c.photoInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">{c.personName}</p>
                        <p className="text-gray-500 font-mono" style={{ fontSize: 10 }}>{c.personDoc}</p>
                      </div>
                      <span
                        className="font-mono font-bold text-sm shrink-0"
                        style={{ color: c.score >= 80 ? '#F87171' : c.score >= 60 ? '#FB923C' : '#FACC15' }}
                      >
                        {c.score}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    { name: 'Tariq Al-Mansouri', doc: 'PK-8823401', score: 87, initials: 'TM', color: '#22D3EE' },
                    { name: 'Ravi Krishnamurthy', doc: 'IN-7823401', score: 93, initials: 'RK', color: '#4ADE80' },
                    { name: 'Chen Wei', doc: 'CN-3345891', score: 74, initials: 'CW', color: '#FB923C' },
                  ].map(c => (
                    <div
                      key={c.doc}
                      className="rounded-lg border border-cyan-500/15 p-2.5 flex items-center gap-3"
                      style={{ background: 'rgba(10,22,40,0.6)' }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: `${c.color}20`, color: c.color }}
                      >
                        {c.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium">{c.name}</p>
                        <p className="text-gray-500 font-mono" style={{ fontSize: 10 }}>{c.doc}</p>
                      </div>
                      <span
                        className="font-mono font-bold text-sm shrink-0"
                        style={{ color: c.score >= 80 ? '#F87171' : '#FB923C' }}
                      >
                        {c.score}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
