import { useState } from 'react';
import { hitFrequencyData, geoHitsData, streamHitsData, responseTimeData, watchlistStats } from '@/mocks/watchlistData';

interface Props {
  isAr: boolean;
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const listColors = ['#F87171', '#FB923C', '#FACC15', '#FB923C', '#A78BFA', '#D4A84B'];

const WatchlistAnalytics = ({ isAr }: Props) => {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [hoveredStream, setHoveredStream] = useState<string | null>(null);

  const maxHits = Math.max(...hitFrequencyData.flatMap(d => d.hits));
  const maxStreamHits = Math.max(...streamHitsData.map(s => s.hits));
  const maxResponseTime = Math.max(...responseTimeData.map(d => d.time));

  const kpis = [
    { label: 'Total Hits This Week', labelAr: 'إجمالي التطابقات هذا الأسبوع', value: '646', delta: '+12%', up: true, color: '#D4A84B', icon: 'ri-alarm-warning-line' },
    { label: 'Hit Rate', labelAr: 'معدل التطابق', value: `${watchlistStats.hitRate}%`, delta: '+2.1%', up: true, color: '#4ADE80', icon: 'ri-percent-line' },
    { label: 'Avg Response Time', labelAr: 'متوسط وقت الاستجابة', value: watchlistStats.avgResponseTime, delta: '-0.8m', up: true, color: '#FACC15', icon: 'ri-timer-line' },
    { label: 'Near-Match Rate', labelAr: 'معدل التطابق القريب', value: '13.6%', delta: '+1.2%', up: false, color: '#FB923C', icon: 'ri-focus-3-line' },
  ];

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="rounded-xl p-4"
            style={{ background: 'rgba(20,29,46,0.8)', border: '1px solid rgba(181,142,60,0.12)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg"
                style={{ background: `${k.color}18` }}>
                <i className={`${k.icon} text-sm`} style={{ color: k.color }} />
              </div>
              <span className="text-xs font-['JetBrains_Mono'] px-2 py-0.5 rounded-full"
                style={{ background: k.up ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', color: k.up ? '#4ADE80' : '#F87171' }}>
                {k.delta}
              </span>
            </div>
            <p className="text-2xl font-black font-['JetBrains_Mono'] text-white">{k.value}</p>
            <p className="text-gray-400 text-xs font-['Inter'] mt-0.5">{isAr ? k.labelAr : k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Hit Frequency by List */}
        <div className="rounded-xl p-4"
          style={{ background: 'rgba(20,29,46,0.8)', border: '1px solid rgba(181,142,60,0.12)' }}>
          <h3 className="text-white font-semibold font-['Inter'] text-sm mb-4">
            {isAr ? 'تكرار التطابقات حسب القائمة (7 أيام)' : 'Hit Frequency by Watchlist (7 Days)'}
          </h3>
          <div className="space-y-3">
            {hitFrequencyData.map((d, li) => (
              <div key={d.list}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400 text-xs font-['Inter']">{d.list}</span>
                  <span className="text-xs font-['JetBrains_Mono']" style={{ color: listColors[li] }}>
                    {d.hits.reduce((a, b) => a + b, 0)} total
                  </span>
                </div>
                <div className="flex items-end gap-1 h-8">
                  {d.hits.map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm transition-all cursor-pointer"
                      style={{
                        height: `${(h / maxHits) * 100}%`,
                        background: listColors[li],
                        opacity: hoveredBar === `${li}-${i}` ? 1 : 0.6,
                        minHeight: '2px',
                      }}
                      onMouseEnter={() => setHoveredBar(`${li}-${i}`)}
                      onMouseLeave={() => setHoveredBar(null)}
                      title={`${days[i]}: ${h} hits`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {days.map(d => (
              <span key={d} className="text-gray-600 text-xs font-['JetBrains_Mono'] flex-1 text-center">{d}</span>
            ))}
          </div>
        </div>

        {/* Stream Hits */}
        <div className="rounded-xl p-4"
          style={{ background: 'rgba(20,29,46,0.8)', border: '1px solid rgba(181,142,60,0.12)' }}>
          <h3 className="text-white font-semibold font-['Inter'] text-sm mb-4">
            {isAr ? 'التطابقات حسب التدفق' : 'Hits by Data Stream'}
          </h3>
          <div className="space-y-2.5">
            {streamHitsData.map(s => (
              <div key={s.stream}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredStream(s.stream)}
                onMouseLeave={() => setHoveredStream(null)}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
                    <span className="text-gray-400 text-xs font-['Inter']">{s.stream}</span>
                  </div>
                  <span className="text-xs font-['JetBrains_Mono']" style={{ color: s.color }}>{s.hits}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${(s.hits / maxStreamHits) * 100}%`,
                      background: s.color,
                      opacity: hoveredStream === s.stream ? 1 : 0.7,
                    }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Response Time Chart */}
        <div className="rounded-xl p-4"
          style={{ background: 'rgba(20,29,46,0.8)', border: '1px solid rgba(181,142,60,0.12)' }}>
          <h3 className="text-white font-semibold font-['Inter'] text-sm mb-4">
            {isAr ? 'متوسط وقت الاستجابة (دقائق)' : 'Avg Response Time (minutes)'}
          </h3>
          <div className="flex items-end gap-3 h-32">
            {responseTimeData.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-['JetBrains_Mono'] text-gray-400">{d.time}</span>
                <div className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${(d.time / maxResponseTime) * 100}%`,
                    background: d.time > 5.5 ? '#F87171' : d.time > 4.5 ? '#FACC15' : '#4ADE80',
                    opacity: 0.8,
                    minHeight: '8px',
                  }} />
                <span className="text-xs font-['JetBrains_Mono'] text-gray-600">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: 'rgba(181,142,60,0.08)' }}>
            {[
              { label: '< 4.5m (Good)', color: '#4ADE80' },
              { label: '4.5–5.5m (OK)', color: '#FACC15' },
              { label: '> 5.5m (Slow)', color: '#F87171' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                <span className="text-gray-500 text-xs font-['Inter']">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="rounded-xl p-4"
          style={{ background: 'rgba(20,29,46,0.8)', border: '1px solid rgba(181,142,60,0.12)' }}>
          <h3 className="text-white font-semibold font-['Inter'] text-sm mb-4">
            {isAr ? 'التوزيع الجغرافي للتطابقات' : 'Geographic Distribution of Hits'}
          </h3>
          <div className="space-y-3">
            {geoHitsData.map((g, i) => (
              <div key={g.region}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 text-xs font-['Inter']">{g.region}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{g.hits}</span>
                    <span className="text-gold-400 text-xs font-['JetBrains_Mono'] w-8 text-right">{g.pct}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full"
                    style={{
                      width: `${g.pct}%`,
                      background: `hsl(${180 + i * 20}, 70%, 60%)`,
                    }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3"
            style={{ borderColor: 'rgba(181,142,60,0.08)' }}>
            {[
              { label: 'Most Active Target', labelAr: 'الهدف الأكثر نشاطاً', value: 'Omar F. Al-Zadjali', color: '#F87171' },
              { label: 'Most Active List', labelAr: 'القائمة الأكثر نشاطاً', value: 'Employment Violation', color: '#FB923C' },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-xl"
                style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
                <p className="text-gray-500 text-xs font-['Inter']">{isAr ? s.labelAr : s.label}</p>
                <p className="text-sm font-semibold font-['Inter'] mt-0.5" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchlistAnalytics;
