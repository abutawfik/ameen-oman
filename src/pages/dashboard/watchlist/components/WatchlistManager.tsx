import { useState } from 'react';
import { watchlists, watchlistTargets, type Watchlist, type WatchlistType, type AlertPriority } from '@/mocks/watchlistData';

interface Props {
  isAr: boolean;
  selectedWatchlistId: string | null;
  onSelectTarget: (id: string) => void;
}

const typeConfig: Record<WatchlistType, { label: string; labelAr: string; color: string; icon: string }> = {
  national_security: { label: 'National Security', labelAr: 'الأمن الوطني', color: '#F87171', icon: 'ri-shield-cross-line' },
  overstay:          { label: 'Overstay Monitoring', labelAr: 'مراقبة تجاوز الإقامة', color: '#FB923C', icon: 'ri-time-line' },
  financial:         { label: 'Financial Watchlist', labelAr: 'القائمة المالية', color: '#FACC15', icon: 'ri-money-dollar-circle-line' },
  employment:        { label: 'Employment Violation', labelAr: 'مخالفات التوظيف', color: '#FB923C', icon: 'ri-briefcase-line' },
  interpol:          { label: 'Interpol / International', labelAr: 'الإنتربول / الدولي', color: '#A78BFA', icon: 'ri-global-line' },
  custom:            { label: 'Custom', labelAr: 'مخصص', color: '#D4A84B', icon: 'ri-settings-3-line' },
};

const riskColors: Record<string, string> = {
  critical: '#F87171',
  high: '#FB923C',
  medium: '#FACC15',
  low: '#4ADE80',
};

const WatchlistManager = ({ isAr, selectedWatchlistId, onSelectTarget }: Props) => {
  const [activeWlId, setActiveWlId] = useState<string>(selectedWatchlistId || watchlists[0].id);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddTarget, setShowAddTarget] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [formData, setFormData] = useState({
    name: '', nameAr: '', description: '', type: 'custom' as WatchlistType,
    classification: 'CONFIDENTIAL', owner: '', priority: 'high' as AlertPriority,
    autoExpireDays: '90', alertRouting: '',
  });

  const activeWl = watchlists.find(w => w.id === activeWlId) || watchlists[0];
  const targets = watchlistTargets.filter(t => t.watchlistIds.includes(activeWlId));
  const filteredTargets = targets.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.nationality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex gap-4 h-full">
      {/* Left: Watchlist selector */}
      <div className="w-64 flex-shrink-0 space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold font-['Inter'] text-sm">
            {isAr ? 'القوائم' : 'Watchlists'}
          </h3>
          <button onClick={() => setShowCreateForm(true)}
            className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all"
            style={{ background: 'rgba(181,142,60,0.15)', color: '#D4A84B' }}>
            <i className="ri-add-line text-sm" />
          </button>
        </div>

        {watchlists.map(wl => {
          const cfg = typeConfig[wl.type];
          const isActive = wl.id === activeWlId;
          return (
            <button key={wl.id} onClick={() => setActiveWlId(wl.id)}
              className="w-full text-left rounded-xl p-3 cursor-pointer transition-all"
              style={{
                background: isActive ? 'rgba(181,142,60,0.1)' : 'rgba(20,29,46,0.6)',
                border: isActive ? `1px solid ${cfg.color}60` : '1px solid rgba(181,142,60,0.08)',
                borderLeft: `3px solid ${isActive ? cfg.color : 'transparent'}`,
              }}>
              <div className="flex items-center gap-2 mb-1">
                <i className={`${cfg.icon} text-sm`} style={{ color: cfg.color }} />
                <span className="text-white text-xs font-semibold font-['Inter'] truncate flex-1">
                  {isAr ? wl.nameAr : wl.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{wl.targetCount} targets</span>
                {wl.hitsToday > 0 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-['JetBrains_Mono']"
                    style={{ background: 'rgba(248,113,113,0.2)', color: '#F87171' }}>
                    {wl.hitsToday} hits
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Right: Watchlist detail + targets */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* Watchlist header */}
        <div className="rounded-xl p-4"
          style={{ background: 'rgba(20,29,46,0.8)', border: `1px solid ${typeConfig[activeWl.type].color}30` }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: `${typeConfig[activeWl.type].color}18` }}>
                <i className={`${typeConfig[activeWl.type].icon} text-lg`}
                  style={{ color: typeConfig[activeWl.type].color }} />
              </div>
              <div>
                <h2 className="text-white font-bold font-['Inter'] text-base">
                  {isAr ? activeWl.nameAr : activeWl.name}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-['JetBrains_Mono'] px-2 py-0.5 rounded"
                    style={{ background: 'rgba(0,0,0,0.4)', color: '#9CA3AF' }}>
                    {activeWl.classification}
                  </span>
                  <span className="text-xs text-gray-400 font-['Inter']">{activeWl.owner}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold font-['Inter'] whitespace-nowrap cursor-pointer transition-all"
                style={{ border: '1px solid rgba(181,142,60,0.4)', color: '#D4A84B' }}>
                <i className="ri-edit-line mr-1" />{isAr ? 'تعديل' : 'Edit'}
              </button>
              <button onClick={() => setShowAddTarget(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold font-['Inter'] whitespace-nowrap cursor-pointer transition-all"
                style={{ background: '#D4A84B', color: '#0B1220' }}>
                <i className="ri-user-add-line mr-1" />{isAr ? 'إضافة هدف' : 'Add Target'}
              </button>
            </div>
          </div>

          <p className="text-gray-400 text-sm font-['Inter'] mt-3">
            {isAr ? activeWl.descriptionAr : activeWl.description}
          </p>

          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t" style={{ borderColor: 'rgba(181,142,60,0.08)' }}>
            {[
              { label: 'Priority', labelAr: 'الأولوية', value: activeWl.priority.toUpperCase(), color: activeWl.priority === 'critical' ? '#F87171' : activeWl.priority === 'high' ? '#FB923C' : '#FACC15' },
              { label: 'Auto-Expire', labelAr: 'انتهاء تلقائي', value: activeWl.autoExpireDays ? `${activeWl.autoExpireDays}d` : 'Permanent', color: '#D4A84B' },
              { label: 'Alert Routing', labelAr: 'توجيه التنبيهات', value: `${activeWl.alertRouting.length} teams`, color: '#4ADE80' },
              { label: 'Last Hit', labelAr: 'آخر تطابق', value: activeWl.lastHit.split(' ')[1], color: '#FACC15' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-gray-500 text-xs font-['Inter']">{isAr ? s.labelAr : s.label}</p>
                <p className="font-bold font-['JetBrains_Mono'] text-sm mt-0.5" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Targets table */}
        <div className="rounded-xl overflow-hidden"
          style={{ background: 'rgba(20,29,46,0.8)', border: '1px solid rgba(181,142,60,0.12)' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: 'rgba(181,142,60,0.08)' }}>
            <h3 className="text-white font-semibold font-['Inter'] text-sm">
              {isAr ? 'الأهداف' : 'Targets'} ({filteredTargets.length})
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'بحث...' : 'Search targets...'}
                  className="pl-7 pr-3 py-1.5 rounded-lg text-xs font-['Inter'] w-48"
                  style={{ background: 'rgba(11,18,32,0.8)', border: '1px solid rgba(181,142,60,0.15)', color: '#D1D5DB' }}
                />
              </div>
              <button onClick={() => setShowBulkImport(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold font-['Inter'] whitespace-nowrap cursor-pointer"
                style={{ border: '1px solid rgba(181,142,60,0.3)', color: '#D4A84B' }}>
                <i className="ri-upload-2-line mr-1" />{isAr ? 'استيراد CSV' : 'Bulk Import'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(181,142,60,0.08)' }}>
                  {['Target', 'Document', 'Nationality', 'Risk', 'Last Event', 'Alerts', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold font-['Inter'] text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTargets.map((t, i) => (
                  <tr key={t.id}
                    onClick={() => onSelectTarget(t.id)}
                    className="cursor-pointer transition-colors hover:bg-white/5"
                    style={{ borderBottom: i < filteredTargets.length - 1 ? '1px solid rgba(181,142,60,0.05)' : 'none' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={t.photo} alt={t.name}
                          className="w-8 h-8 rounded-full object-cover object-top flex-shrink-0"
                          style={{ border: `1px solid ${riskColors[t.riskLevel]}40` }} />
                        <div>
                          <p className="text-white text-xs font-semibold font-['Inter']">{t.name}</p>
                          <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{t.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gold-400 text-xs font-['JetBrains_Mono']">{t.docNumber}</p>
                      <p className="text-gray-500 text-xs font-['Inter']">{t.docType}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-300 text-xs font-['Inter']">{t.nationality}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                          <div className="h-full rounded-full" style={{ width: `${t.riskScore}%`, background: riskColors[t.riskLevel] }} />
                        </div>
                        <span className="text-xs font-['JetBrains_Mono']" style={{ color: riskColors[t.riskLevel] }}>
                          {t.riskScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-300 text-xs font-['Inter'] truncate max-w-[140px]">{t.lastEvent}</p>
                      <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{t.lastEventTime}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-['JetBrains_Mono'] px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(248,113,113,0.15)', color: '#F87171' }}>
                        {t.alertCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-['Inter']"
                        style={{
                          background: t.status === 'active' ? 'rgba(74,222,128,0.15)' : 'rgba(156,163,175,0.15)',
                          color: t.status === 'active' ? '#4ADE80' : '#9CA3AF',
                        }}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all hover:bg-white/10"
                        style={{ color: '#D4A84B' }}>
                        <i className="ri-arrow-right-s-line text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Watchlist Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(11,18,32,0.85)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6"
            style={{ background: 'rgba(20,29,46,0.98)', border: '1px solid rgba(181,142,60,0.25)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold font-['Inter'] text-base">
                {isAr ? 'إنشاء قائمة مراقبة' : 'Create Watchlist'}
              </h3>
              <button onClick={() => setShowCreateForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer hover:bg-white/10 text-gray-400">
                <i className="ri-close-line" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Name (EN)', field: 'name', type: 'text' },
                { label: 'Name (AR)', field: 'nameAr', type: 'text' },
                { label: 'Description', field: 'description', type: 'text' },
              ].map(f => (
                <div key={f.field}>
                  <label className="text-gray-400 text-xs font-['Inter'] block mb-1">{f.label}</label>
                  <input
                    value={(formData as Record<string, string>)[f.field]}
                    onChange={e => setFormData(prev => ({ ...prev, [f.field]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm font-['Inter']"
                    style={{ background: 'rgba(11,18,32,0.8)', border: '1px solid rgba(181,142,60,0.15)', color: '#D1D5DB' }}
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs font-['Inter'] block mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as WatchlistType }))}
                    className="w-full px-3 py-2 rounded-lg text-sm font-['Inter'] cursor-pointer"
                    style={{ background: 'rgba(11,18,32,0.8)', border: '1px solid rgba(181,142,60,0.15)', color: '#D1D5DB' }}>
                    {Object.entries(typeConfig).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-['Inter'] block mb-1">Priority</label>
                  <select value={formData.priority} onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value as AlertPriority }))}
                    className="w-full px-3 py-2 rounded-lg text-sm font-['Inter'] cursor-pointer"
                    style={{ background: 'rgba(11,18,32,0.8)', border: '1px solid rgba(181,142,60,0.15)', color: '#D1D5DB' }}>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs font-['Inter'] block mb-1">Classification</label>
                  <select value={formData.classification} onChange={e => setFormData(prev => ({ ...prev, classification: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm font-['Inter'] cursor-pointer"
                    style={{ background: 'rgba(11,18,32,0.8)', border: '1px solid rgba(181,142,60,0.15)', color: '#D1D5DB' }}>
                    {['TOP SECRET', 'SECRET', 'CONFIDENTIAL', 'RESTRICTED'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-['Inter'] block mb-1">Auto-Expire (days)</label>
                  <input value={formData.autoExpireDays} onChange={e => setFormData(prev => ({ ...prev, autoExpireDays: e.target.value }))}
                    placeholder="Leave blank = permanent"
                    className="w-full px-3 py-2 rounded-lg text-sm font-['Inter']"
                    style={{ background: 'rgba(11,18,32,0.8)', border: '1px solid rgba(181,142,60,0.15)', color: '#D1D5DB' }} />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs font-['Inter'] block mb-1">Alert Routing (teams, comma-separated)</label>
                <input value={formData.alertRouting} onChange={e => setFormData(prev => ({ ...prev, alertRouting: e.target.value }))}
                  placeholder="e.g. Command Center, Field Officers"
                  className="w-full px-3 py-2 rounded-lg text-sm font-['Inter']"
                  style={{ background: 'rgba(11,18,32,0.8)', border: '1px solid rgba(181,142,60,0.15)', color: '#D1D5DB' }} />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowCreateForm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-['Inter'] cursor-pointer"
                style={{ border: '1px solid rgba(181,142,60,0.3)', color: '#D4A84B' }}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button onClick={() => setShowCreateForm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-['Inter'] cursor-pointer"
                style={{ background: '#D4A84B', color: '#0B1220' }}>
                {isAr ? 'إنشاء' : 'Create Watchlist'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Target Modal */}
      {showAddTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(11,18,32,0.85)' }}>
          <div className="w-full max-w-md rounded-2xl p-6"
            style={{ background: 'rgba(20,29,46,0.98)', border: '1px solid rgba(181,142,60,0.25)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold font-['Inter'] text-base">
                {isAr ? 'إضافة هدف' : 'Add Target'}
              </h3>
              <button onClick={() => setShowAddTarget(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer hover:bg-white/10 text-gray-400">
                <i className="ri-close-line" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input placeholder={isAr ? 'بحث بالوثيقة أو الاسم أو الهاتف...' : 'Search by document, name, or phone...'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-['Inter']"
                  style={{ background: 'rgba(11,18,32,0.8)', border: '1px solid rgba(181,142,60,0.2)', color: '#D1D5DB' }} />
              </div>

              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(181,142,60,0.1)' }}>
                {watchlistTargets.slice(0, 3).map((t, i) => (
                  <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-white/5 transition-colors"
                    style={{ borderBottom: i < 2 ? '1px solid rgba(181,142,60,0.05)' : 'none' }}>
                    <img src={t.photo} alt={t.name} className="w-8 h-8 rounded-full object-cover object-top flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold font-['Inter']">{t.name}</p>
                      <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{t.docNumber} · {t.nationality}</p>
                    </div>
                    <button className="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer"
                      style={{ background: 'rgba(181,142,60,0.15)', color: '#D4A84B' }}>
                      <i className="ri-add-line text-xs" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-gray-400 text-xs font-['Inter'] block mb-1">Reason for Adding</label>
                <textarea rows={2} placeholder="Reason for adding to this watchlist..."
                  className="w-full px-3 py-2 rounded-lg text-sm font-['Inter'] resize-none"
                  style={{ background: 'rgba(11,18,32,0.8)', border: '1px solid rgba(181,142,60,0.15)', color: '#D1D5DB' }} />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: 'rgba(181,142,60,0.05)', border: '1px solid rgba(181,142,60,0.1)' }}>
                <i className="ri-upload-2-line text-gold-400 text-sm" />
                <div className="flex-1">
                  <p className="text-white text-xs font-semibold font-['Inter']">Bulk Import via CSV</p>
                  <p className="text-gray-500 text-xs font-['Inter']">Upload document numbers list</p>
                </div>
                <button className="px-2 py-1 rounded-lg text-xs font-['Inter'] cursor-pointer"
                  style={{ border: '1px solid rgba(181,142,60,0.3)', color: '#D4A84B' }}>
                  Upload
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddTarget(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-['Inter'] cursor-pointer"
                style={{ border: '1px solid rgba(181,142,60,0.3)', color: '#D4A84B' }}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button onClick={() => setShowAddTarget(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-['Inter'] cursor-pointer"
                style={{ background: '#D4A84B', color: '#0B1220' }}>
                {isAr ? 'إضافة' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchlistManager;
