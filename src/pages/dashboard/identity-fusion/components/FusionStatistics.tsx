import { duplicateDetectionHistory, streamResolutionStats, matchingRules } from '@/mocks/identityFusionData';

interface Props { isAr: boolean; }

export default function FusionStatistics({ isAr }: Props) {
  const maxDetected = Math.max(...duplicateDetectionHistory.map(d => d.detected));
  const totalResolved = streamResolutionStats.reduce((a, s) => a + s.resolved, 0);
  const totalDuplicates = streamResolutionStats.reduce((a, s) => a + s.duplicates, 0);
  const avgRate = (streamResolutionStats.reduce((a, s) => a + s.rate, 0) / streamResolutionStats.length).toFixed(1);

  const sortedRules = [...matchingRules].sort((a, b) => b.totalMerges - a.totalMerges);
  const maxMerges = sortedRules[0]?.totalMerges || 1;

  return (
    <div className="p-5 space-y-5">
      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: isAr ? 'إجمالي المحلولة' : 'Total Resolved', value: totalResolved.toLocaleString(), color: '#22D3EE', icon: 'ri-user-follow-line' },
          { label: isAr ? 'مكررات مكتشفة' : 'Duplicates Found', value: totalDuplicates.toLocaleString(), color: '#FACC15', icon: 'ri-user-2-line' },
          { label: isAr ? 'متوسط معدل الدقة' : 'Avg Resolution Rate', value: `${avgRate}%`, color: '#4ADE80', icon: 'ri-percent-line' },
          { label: isAr ? 'قواعد نشطة' : 'Active Rules', value: matchingRules.filter(r => r.enabled).length.toString(), color: '#A78BFA', icon: 'ri-git-branch-line' },
        ].map(kpi => (
          <div
            key={kpi.label}
            className="rounded-xl border border-cyan-500/12 p-4"
            style={{ background: 'rgba(10,22,40,0.8)' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0" style={{ background: `${kpi.color}15` }}>
                <i className={`${kpi.icon} text-sm`} style={{ color: kpi.color }} />
              </div>
            </div>
            <p className="font-mono font-black text-2xl" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-gray-500 text-xs mt-0.5 font-['Inter']">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Duplicate detection chart */}
      <div
        className="rounded-xl border border-cyan-500/15 p-5"
        style={{ background: 'rgba(10,22,40,0.8)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-white font-bold text-sm font-['Inter']">
              {isAr ? 'اكتشاف المكررات عبر الزمن' : 'Duplicate Detection Over Time'}
            </h3>
            <p className="text-gray-500 text-xs mt-0.5 font-['JetBrains_Mono']">
              {isAr ? 'آخر 7 أيام' : 'Last 7 days'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {[
              { label: isAr ? 'مكتشف' : 'Detected', color: '#22D3EE' },
              { label: isAr ? 'محلول' : 'Resolved', color: '#4ADE80' },
              { label: isAr ? 'دمج تلقائي' : 'Auto-Merged', color: '#A78BFA' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                <span className="text-gray-500 text-xs font-['Inter']">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-3 h-40">
          {duplicateDetectionHistory.map(d => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col-reverse gap-0.5 items-center" style={{ height: 120 }}>
                {/* Detected bar */}
                <div
                  className="w-full rounded-t-sm relative group"
                  style={{ height: `${(d.detected / maxDetected) * 100}%`, background: 'rgba(34,211,238,0.3)', minHeight: 4 }}
                >
                  {/* Resolved overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-sm"
                    style={{ height: `${(d.resolved / d.detected) * 100}%`, background: 'rgba(74,222,128,0.5)' }}
                  />
                  {/* Auto-merged overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-sm"
                    style={{ height: `${(d.autoMerged / d.detected) * 100}%`, background: 'rgba(167,139,250,0.6)' }}
                  />
                  {/* Tooltip */}
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-['JetBrains_Mono']"
                    style={{ background: 'rgba(10,22,40,0.95)', border: '1px solid rgba(34,211,238,0.2)' }}
                  >
                    <p className="text-cyan-400">{d.detected} detected</p>
                    <p className="text-green-400">{d.resolved} resolved</p>
                    <p className="text-purple-400">{d.autoMerged} auto</p>
                  </div>
                </div>
              </div>
              <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{d.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rule effectiveness */}
      <div
        className="rounded-xl border border-cyan-500/15 p-5"
        style={{ background: 'rgba(10,22,40,0.8)' }}
      >
        <h3 className="text-white font-bold text-sm font-['Inter'] mb-4">
          {isAr ? 'فعالية قواعد المطابقة' : 'Matching Rule Effectiveness'}
        </h3>
        <div className="space-y-3">
          {sortedRules.map((rule, idx) => (
            <div key={rule.id} className="flex items-center gap-4">
              <div className="w-5 text-center shrink-0">
                <span className="text-gray-600 font-mono text-xs">#{idx + 1}</span>
              </div>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${rule.color}15` }}
              >
                <i className={`${rule.icon} text-xs`} style={{ color: rule.color }} />
              </div>
              <div className="w-44 shrink-0">
                <p className="text-gray-300 text-xs font-['Inter'] truncate">{isAr ? rule.nameAr : rule.name}</p>
                <p className="text-gray-600 text-xs font-['JetBrains_Mono']">{rule.confidence}% confidence</p>
              </div>
              <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(rule.totalMerges / maxMerges) * 100}%`, background: rule.color }}
                />
              </div>
              <div className="w-20 text-right shrink-0">
                <span className="text-white font-mono text-xs">{rule.totalMerges.toLocaleString()}</span>
                <span className="text-gray-600 text-xs ml-1 font-['Inter']">{isAr ? 'دمج' : 'merges'}</span>
              </div>
              <div className="w-16 text-right shrink-0">
                <span className="text-cyan-400 font-mono text-xs">{rule.triggeredToday}</span>
                <span className="text-gray-600 text-xs ml-1 font-['Inter']">{isAr ? 'اليوم' : 'today'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stream resolution table */}
      <div
        className="rounded-xl border border-cyan-500/15 overflow-hidden"
        style={{ background: 'rgba(10,22,40,0.8)' }}
      >
        <div className="px-5 py-4 border-b border-cyan-500/10">
          <h3 className="text-white font-bold text-sm font-['Inter']">
            {isAr ? 'إحصائيات الدقة لكل تيار' : 'Resolution Statistics by Stream'}
          </h3>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-cyan-500/10">
              {[
                isAr ? 'التيار' : 'Stream',
                isAr ? 'الرمز' : 'Code',
                isAr ? 'المحلولة' : 'Resolved',
                isAr ? 'المكررات' : 'Duplicates',
                isAr ? 'معدل الدقة' : 'Resolution Rate',
              ].map(h => (
                <th key={h} className="text-left text-gray-600 font-medium py-3 px-4 uppercase tracking-wider" style={{ fontSize: 10 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {streamResolutionStats.map(s => (
              <tr key={s.code} className="border-b border-cyan-500/5 hover:bg-cyan-500/3 transition-colors">
                <td className="py-3 px-4 text-white font-medium font-['Inter']">{isAr ? s.streamAr : s.stream}</td>
                <td className="py-3 px-4 font-mono text-cyan-400/70">{s.code}</td>
                <td className="py-3 px-4 font-mono text-white">{s.resolved.toLocaleString()}</td>
                <td className="py-3 px-4 font-mono text-red-400/70">{s.duplicates}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${s.rate}%`,
                          background: s.rate >= 97 ? '#4ADE80' : s.rate >= 95 ? '#22D3EE' : '#FACC15',
                        }}
                      />
                    </div>
                    <span
                      className="font-mono font-bold"
                      style={{ color: s.rate >= 97 ? '#4ADE80' : s.rate >= 95 ? '#22D3EE' : '#FACC15' }}
                    >
                      {s.rate}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
