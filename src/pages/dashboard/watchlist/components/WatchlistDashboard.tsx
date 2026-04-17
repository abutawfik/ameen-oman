import { useState } from 'react';
import { watchlists, watchlistStats, watchlistAlerts, type Watchlist, type WatchlistType } from '@/mocks/watchlistData';

interface Props {
  isAr: boolean;
  onSelectWatchlist: (id: string) => void;
  onCreateNew: () => void;
}

const typeConfig: Record<WatchlistType, { label: string; labelAr: string; border: string; bg: string; icon: string }> = {
  national_security: { label: 'National Security', labelAr: 'الأمن الوطني', border: '#C94A5E', bg: 'rgba(201,74,94,0.08)', icon: 'ri-shield-cross-line' },
  overstay:          { label: 'Overstay Monitoring', labelAr: 'مراقبة تجاوز الإقامة', border: '#C98A1B', bg: 'rgba(201,138,27,0.08)', icon: 'ri-time-line' },
  financial:         { label: 'Financial Watchlist', labelAr: 'القائمة المالية', border: '#FACC15', bg: 'rgba(250,204,21,0.08)', icon: 'ri-money-dollar-circle-line' },
  employment:        { label: 'Employment Violation', labelAr: 'مخالفات التوظيف', border: '#C98A1B', bg: 'rgba(201,138,27,0.06)', icon: 'ri-briefcase-line' },
  interpol:          { label: 'Interpol / International', labelAr: 'الإنتربول / الدولي', border: '#A78BFA', bg: 'rgba(167,139,250,0.08)', icon: 'ri-global-line' },
  custom:            { label: 'Custom', labelAr: 'مخصص', border: '#D6B47E', bg: 'rgba(184,138,60,0.08)', icon: 'ri-settings-3-line' },
};

const priorityColors: Record<string, string> = {
  critical: '#C94A5E',
  high: '#C98A1B',
  medium: '#FACC15',
};

const statusColors: Record<string, string> = {
  new: '#C94A5E',
  acknowledged: '#FACC15',
  escalated: '#C98A1B',
  closed: '#4ADE80',
};

const WatchlistDashboard = ({ isAr, onSelectWatchlist, onCreateNew }: Props) => {
  const [filter, setFilter] = useState<WatchlistType | 'all'>('all');

  const filtered = filter === 'all' ? watchlists : watchlists.filter(w => w.type === filter);
  const recentAlerts = watchlistAlerts.slice(0, 5);

  const stats = [
    { label: 'Total Watchlists', labelAr: 'إجمالي القوائم', value: watchlistStats.totalWatchlists, icon: 'ri-list-check-2', color: '#D6B47E' },
    { label: 'Active Targets', labelAr: 'الأهداف النشطة', value: watchlistStats.activeTargets.toLocaleString(), icon: 'ri-user-search-line', color: '#C94A5E' },
    { label: 'Alerts Today', labelAr: 'تنبيهات اليوم', value: watchlistStats.alertsToday, icon: 'ri-alarm-warning-line', color: '#C98A1B' },
    { label: 'Hit Rate', labelAr: 'معدل التطابق', value: `${watchlistStats.hitRate}%`, icon: 'ri-percent-line', color: '#4ADE80' },
    { label: 'Avg Response', labelAr: 'متوسط الاستجابة', value: watchlistStats.avgResponseTime, icon: 'ri-timer-line', color: '#FACC15' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl p-4 flex flex-col gap-2"
            style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.12)' }}>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg"
                style={{ background: `${s.color}18` }}>
                <i className={`${s.icon} text-lg`} style={{ color: s.color }} />
              </div>
              <span className="text-xs font-['JetBrains_Mono'] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(184,138,60,0.08)', color: '#D6B47E' }}>LIVE</span>
            </div>
            <div>
              <p className="text-2xl font-black font-['JetBrains_Mono'] text-white">{s.value}</p>
              <p className="text-xs text-gray-400 font-['Inter'] mt-0.5">{isAr ? s.labelAr : s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Auto-Alerts Today', labelAr: 'تنبيهات تلقائية', value: watchlistStats.autoAlertsToday, color: '#D6B47E' },
          { label: 'Manual Review', labelAr: 'مراجعة يدوية', value: watchlistStats.manualReviewToday, color: '#FACC15' },
          { label: 'Near-Matches', labelAr: 'تطابقات قريبة', value: watchlistStats.nearMatchesToday, color: '#C98A1B' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-4"
            style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.12)' }}>
            <div className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0"
              style={{ background: `${s.color}18`, border: `1px solid ${s.color}40` }}>
              <span className="text-lg font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</span>
            </div>
            <p className="text-sm text-gray-300 font-['Inter']">{isAr ? s.labelAr : s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Watchlist Grid */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold font-['Inter'] text-base">
              {isAr ? 'قوائم المراقبة' : 'Watchlists'}
            </h2>
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={e => setFilter(e.target.value as WatchlistType | 'all')}
                className="text-xs px-3 py-1.5 rounded-lg font-['Inter'] cursor-pointer"
                style={{ background: 'rgba(10,37,64,0.9)', border: '1px solid rgba(184,138,60,0.2)', color: '#D1D5DB' }}
              >
                <option value="all">{isAr ? 'الكل' : 'All Types'}</option>
                {Object.entries(typeConfig).map(([k, v]) => (
                  <option key={k} value={k}>{isAr ? v.labelAr : v.label}</option>
                ))}
              </select>
              <button onClick={onCreateNew}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-['Inter'] whitespace-nowrap cursor-pointer transition-all"
                style={{ background: '#D6B47E', color: '#051428' }}>
                <i className="ri-add-line" />
                {isAr ? 'قائمة جديدة' : 'New Watchlist'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {filtered.map((wl) => {
              const cfg = typeConfig[wl.type];
              return (
                <div key={wl.id}
                  onClick={() => onSelectWatchlist(wl.id)}
                  className="rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01]"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}40`, borderLeft: `3px solid ${cfg.border}` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ background: `${cfg.border}20` }}>
                        <i className={`${cfg.icon} text-sm`} style={{ color: cfg.border }} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold font-['Inter'] leading-tight">
                          {isAr ? wl.nameAr : wl.name}
                        </p>
                        <span className="text-xs font-['JetBrains_Mono'] px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(0,0,0,0.3)', color: '#9CA3AF' }}>
                          {wl.classification}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${wl.active ? 'bg-green-400' : 'bg-red-400'}`} />
                      <span className="text-xs font-['JetBrains_Mono']" style={{ color: priorityColors[wl.priority] }}>
                        {wl.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: isAr ? 'الأهداف' : 'Targets', value: wl.targetCount.toLocaleString() },
                      { label: isAr ? 'تنبيهات اليوم' : 'Hits Today', value: wl.hitsToday },
                      { label: isAr ? 'الإجمالي' : 'Total Hits', value: wl.hitsTotal.toLocaleString() },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <p className="text-white font-black font-['JetBrains_Mono'] text-sm">{s.value}</p>
                        <p className="text-gray-500 text-xs font-['Inter']">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-['Inter']">
                      {isAr ? 'آخر تطابق:' : 'Last hit:'} <span className="text-gray-300">{wl.lastHit}</span>
                    </span>
                    <span className="text-gold-400 font-['Inter'] flex items-center gap-1">
                      {isAr ? 'عرض' : 'View'} <i className="ri-arrow-right-s-line" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold font-['Inter'] text-base">
              {isAr ? 'آخر التنبيهات' : 'Recent Alerts'}
            </h2>
            <span className="text-xs font-['JetBrains_Mono'] px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(201,74,94,0.15)', color: '#C94A5E' }}>
              {watchlistAlerts.filter(a => a.status === 'new').length} NEW
            </span>
          </div>

          <div className="space-y-2">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="rounded-xl p-3"
                style={{ background: 'rgba(10,37,64,0.8)', border: `1px solid ${alert.isNearMatch ? 'rgba(201,138,27,0.3)' : 'rgba(184,138,60,0.1)'}` }}>
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ background: 'rgba(184,138,60,0.1)' }}>
                    <i className={`${alert.streamIcon} text-xs text-gold-400`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <p className="text-white text-xs font-semibold font-['Inter'] truncate">{alert.targetName}</p>
                      {alert.isNearMatch && (
                        <span className="text-xs px-1.5 py-0.5 rounded font-['JetBrains_Mono'] flex-shrink-0"
                          style={{ background: 'rgba(201,138,27,0.2)', color: '#C98A1B' }}>
                          ~{alert.confidence}%
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs font-['Inter']">{alert.eventType}</p>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded font-['JetBrains_Mono'] flex-shrink-0"
                    style={{ background: `${statusColors[alert.status]}18`, color: statusColors[alert.status] }}>
                    {alert.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{alert.timestamp}</span>
                  <span className="text-gray-400 text-xs font-['Inter'] truncate max-w-[120px]">{alert.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchlistDashboard;
