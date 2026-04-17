import { useState } from 'react';
import { watchlistTargets, watchlistAlerts, watchlists, type WatchlistType } from '@/mocks/watchlistData';

interface Props {
  isAr: boolean;
  targetId: string | null;
  onBack: () => void;
}

const typeConfig: Record<WatchlistType, { label: string; color: string }> = {
  national_security: { label: 'National Security', color: '#C94A5E' },
  overstay:          { label: 'Overstay', color: '#C98A1B' },
  financial:         { label: 'Financial', color: '#FACC15' },
  employment:        { label: 'Employment', color: '#C98A1B' },
  interpol:          { label: 'Interpol', color: '#A78BFA' },
  custom:            { label: 'Custom', color: '#D6B47E' },
};

const riskColors: Record<string, string> = {
  critical: '#C94A5E',
  high: '#C98A1B',
  medium: '#FACC15',
  low: '#4ADE80',
};

const statusColors: Record<string, string> = {
  new: '#C94A5E',
  acknowledged: '#FACC15',
  escalated: '#C98A1B',
  closed: '#4ADE80',
};

const streamIcons: Record<string, string> = {
  'Border Intelligence': 'ri-passport-line',
  'Hotel Intelligence': 'ri-hotel-line',
  'Mobile Operators': 'ri-sim-card-line',
  'Financial Services': 'ri-bank-card-line',
  'Car Rental': 'ri-car-line',
  'Transport Intelligence': 'ri-bus-line',
};

const TargetDetail = ({ isAr, targetId, onBack }: Props) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'watchlists'>('overview');
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  const target = watchlistTargets.find(t => t.id === targetId) || watchlistTargets[0];
  const targetAlerts = watchlistAlerts.filter(a => a.targetId === target.id);
  const targetWatchlists = watchlists.filter(w => target.watchlistIds.includes(w.id));

  const tabs = [
    { key: 'overview', label: 'Overview', labelAr: 'نظرة عامة' },
    { key: 'alerts', label: `Alert History (${targetAlerts.length})`, labelAr: `سجل التنبيهات (${targetAlerts.length})` },
    { key: 'watchlists', label: 'Watchlist Membership', labelAr: 'عضوية القوائم' },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button onClick={onBack}
        className="flex items-center gap-2 text-sm font-['Inter'] cursor-pointer transition-colors hover:text-gold-400"
        style={{ color: '#9CA3AF' }}>
        <i className="ri-arrow-left-line" />
        {isAr ? 'العودة إلى القائمة' : 'Back to Watchlist'}
      </button>

      {/* Target hero card */}
      <div className="rounded-2xl p-5"
        style={{ background: 'rgba(10,37,64,0.8)', border: `1px solid ${riskColors[target.riskLevel]}30` }}>
        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            <img src={target.photo} alt={target.name}
              className="w-20 h-20 rounded-2xl object-cover object-top"
              style={{ border: `2px solid ${riskColors[target.riskLevel]}60` }} />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full"
              style={{ background: target.status === 'active' ? '#4ADE80' : '#9CA3AF' }}>
              <i className={`text-xs text-black ${target.status === 'active' ? 'ri-checkbox-circle-fill' : 'ri-pause-circle-fill'}`} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-white font-bold font-['Inter'] text-xl">{target.name}</h2>
                <p className="text-gray-400 text-sm font-['Inter'] mt-0.5">{isAr ? target.nameAr : target.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-center px-4 py-2 rounded-xl"
                  style={{ background: `${riskColors[target.riskLevel]}15`, border: `1px solid ${riskColors[target.riskLevel]}40` }}>
                  <p className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: riskColors[target.riskLevel] }}>
                    {target.riskScore}
                  </p>
                  <p className="text-xs font-['Inter'] uppercase" style={{ color: riskColors[target.riskLevel] }}>
                    {target.riskLevel}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
              {[
                { label: 'Document', labelAr: 'الوثيقة', value: target.docNumber, sub: target.docType, color: '#D6B47E' },
                { label: 'Nationality', labelAr: 'الجنسية', value: target.nationality, sub: `DOB: ${target.dob}`, color: '#D1D5DB' },
                { label: 'Phone', labelAr: 'الهاتف', value: target.phone || 'Unknown', sub: target.email || '—', color: '#4ADE80' },
                { label: 'Employer', labelAr: 'صاحب العمل', value: target.employer, sub: `Added: ${target.addedAt}`, color: '#D1D5DB' },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-gray-500 text-xs font-['Inter']">{isAr ? f.labelAr : f.label}</p>
                  <p className="font-semibold font-['JetBrains_Mono'] text-sm mt-0.5 truncate" style={{ color: f.color }}>{f.value}</p>
                  <p className="text-gray-500 text-xs font-['Inter'] truncate">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Last known location */}
        <div className="mt-4 p-3 rounded-xl flex items-center gap-3"
          style={{ background: 'rgba(184,138,60,0.05)', border: '1px solid rgba(184,138,60,0.1)' }}>
          <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
            style={{ background: 'rgba(184,138,60,0.15)' }}>
            <i className="ri-map-pin-line text-gold-400 text-sm" />
          </div>
          <div className="flex-1">
            <p className="text-gray-400 text-xs font-['Inter']">{isAr ? 'آخر موقع معروف' : 'Last Known Location'}</p>
            <p className="text-white text-sm font-semibold font-['Inter']">{target.lastKnownLocation}</p>
          </div>
          <span className="text-gray-400 text-xs font-['JetBrains_Mono']">{target.lastKnownLocationTime}</span>
        </div>

        {/* Reason */}
        <div className="mt-3 p-3 rounded-xl"
          style={{ background: 'rgba(201,74,94,0.05)', border: '1px solid rgba(201,74,94,0.15)' }}>
          <p className="text-gray-400 text-xs font-['Inter'] mb-1">{isAr ? 'سبب الإضافة' : 'Reason for Watchlisting'}</p>
          <p className="text-gray-200 text-sm font-['Inter']">{target.reason}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer"
            style={{ background: '#D6B47E', color: '#051428' }}>
            <i className="ri-user-search-line" />{isAr ? 'ملف 360°' : 'View 360° Profile'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer"
            style={{ border: '1px solid rgba(184,138,60,0.3)', color: '#D6B47E' }}>
            <i className="ri-git-branch-line" />{isAr ? 'تحليل الروابط' : 'Link Analysis'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer"
            style={{ border: '1px solid rgba(250,204,21,0.3)', color: '#FACC15' }}>
            <i className="ri-file-pdf-line" />{isAr ? 'تصدير PDF' : 'Export PDF'}
          </button>
          <button onClick={() => setShowSuspendModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer ml-auto"
            style={{ border: '1px solid rgba(201,74,94,0.3)', color: '#C94A5E' }}>
            <i className="ri-pause-circle-line" />{isAr ? 'تعليق' : 'Suspend Target'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.1)' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="px-4 py-2 rounded-lg text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer transition-all"
            style={{
              background: activeTab === tab.key ? '#D6B47E' : 'transparent',
              color: activeTab === tab.key ? '#051428' : '#9CA3AF',
            }}>
            {isAr ? tab.labelAr : tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl p-4 space-y-3"
            style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.12)' }}>
            <h3 className="text-white font-semibold font-['Inter'] text-sm">
              {isAr ? 'آخر حدث' : 'Last Event'}
            </h3>
            <div className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(184,138,60,0.05)', border: '1px solid rgba(184,138,60,0.1)' }}>
              <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: 'rgba(184,138,60,0.15)' }}>
                <i className={`${streamIcons[target.lastEventStream] || 'ri-database-line'} text-gold-400`} />
              </div>
              <div>
                <p className="text-white text-sm font-semibold font-['Inter']">{target.lastEvent}</p>
                <p className="text-gray-400 text-xs font-['Inter']">{target.lastEventStream}</p>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{target.lastEventTime}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-gray-500 text-xs font-['Inter']">{isAr ? 'ملاحظات المحلل' : 'Analyst Notes'}</p>
              <p className="text-gray-300 text-sm font-['Inter'] leading-relaxed">{target.notes}</p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-500 text-xs font-['Inter']">{isAr ? 'أضيف بواسطة' : 'Added By'}</p>
              <p className="text-gray-300 text-sm font-['Inter']">{target.addedBy}</p>
            </div>
          </div>

          <div className="rounded-xl p-4 space-y-3"
            style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.12)' }}>
            <h3 className="text-white font-semibold font-['Inter'] text-sm">
              {isAr ? 'إحصائيات التنبيهات' : 'Alert Statistics'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Alerts', value: target.alertCount, color: '#C94A5E' },
                { label: 'This Month', value: Math.floor(target.alertCount * 0.3), color: '#C98A1B' },
                { label: 'Auto-Triggered', value: Math.floor(target.alertCount * 0.8), color: '#D6B47E' },
                { label: 'Near-Matches', value: Math.floor(target.alertCount * 0.1), color: '#FACC15' },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl text-center"
                  style={{ background: `${s.color}10`, border: `1px solid ${s.color}25` }}>
                  <p className="text-xl font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-gray-400 text-xs font-['Inter'] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-gray-500 text-xs font-['Inter']">{isAr ? 'عضوية القوائم' : 'Watchlist Membership'}</p>
              <div className="flex flex-wrap gap-2">
                {targetWatchlists.map(wl => {
                  const cfg = typeConfig[wl.type];
                  return (
                    <span key={wl.id} className="text-xs px-2 py-1 rounded-full font-['Inter']"
                      style={{ background: `${cfg.color}18`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                      {isAr ? wl.nameAr : wl.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="rounded-xl overflow-hidden"
          style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.12)' }}>
          {targetAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <i className="ri-alarm-warning-line text-3xl mb-2" />
              <p className="font-['Inter'] text-sm">{isAr ? 'لا توجد تنبيهات' : 'No alerts recorded'}</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'rgba(184,138,60,0.05)' }}>
              {targetAlerts.map((alert) => (
                <div key={alert.id} className="p-4 flex items-start gap-4">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ background: 'rgba(184,138,60,0.1)' }}>
                    <i className={`${alert.streamIcon} text-gold-400 text-sm`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-white text-sm font-semibold font-['Inter']">{alert.eventType}</p>
                      {alert.isNearMatch && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-['JetBrains_Mono']"
                          style={{ background: 'rgba(201,138,27,0.2)', color: '#C98A1B' }}>
                          NEAR MATCH {alert.confidence}%
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded-full font-['JetBrains_Mono']"
                        style={{ background: `${statusColors[alert.status]}18`, color: statusColors[alert.status] }}>
                        {alert.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs font-['Inter'] mb-1">{alert.details}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-['JetBrains_Mono']">
                      <span><i className="ri-map-pin-line mr-1" />{alert.location}</span>
                      <span><i className="ri-time-line mr-1" />{alert.timestamp}</span>
                      <span><i className="ri-database-line mr-1" />{alert.stream}</span>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded font-['JetBrains_Mono'] flex-shrink-0"
                    style={{ background: `${riskColors[alert.priority === 'critical' ? 'critical' : alert.priority === 'high' ? 'high' : 'medium']}18`, color: riskColors[alert.priority === 'critical' ? 'critical' : alert.priority === 'high' ? 'high' : 'medium'] }}>
                    {alert.priority.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'watchlists' && (
        <div className="grid grid-cols-2 gap-4">
          {targetWatchlists.map(wl => {
            const cfg = typeConfig[wl.type];
            return (
              <div key={wl.id} className="rounded-xl p-4"
                style={{ background: 'rgba(10,37,64,0.8)', border: `1px solid ${cfg.color}30` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ background: `${cfg.color}18` }}>
                    <i className="ri-list-check-2 text-sm" style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold font-['Inter']">{isAr ? wl.nameAr : wl.name}</p>
                    <span className="text-xs font-['JetBrains_Mono']" style={{ color: cfg.color }}>{wl.classification}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs font-['Inter'] mb-3">{isAr ? wl.descriptionAr : wl.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-['Inter']">{wl.owner}</span>
                  <span className="font-['JetBrains_Mono']" style={{ color: cfg.color }}>
                    {wl.hitsToday} hits today
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(5,20,40,0.85)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: 'rgba(10,37,64,0.98)', border: '1px solid rgba(201,74,94,0.3)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl"
                style={{ background: 'rgba(201,74,94,0.15)' }}>
                <i className="ri-pause-circle-line text-red-400 text-lg" />
              </div>
              <h3 className="text-white font-bold font-['Inter']">
                {isAr ? 'تعليق الهدف' : 'Suspend Target'}
              </h3>
            </div>
            <p className="text-gray-400 text-sm font-['Inter'] mb-4">
              {isAr ? 'هل أنت متأكد من تعليق هذا الهدف؟ لن يتم إرسال تنبيهات حتى يتم إعادة تفعيله.' : 'Are you sure you want to suspend this target? No alerts will fire until reactivated.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowSuspendModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-['Inter'] cursor-pointer"
                style={{ border: '1px solid rgba(184,138,60,0.3)', color: '#D6B47E' }}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button onClick={() => setShowSuspendModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-['Inter'] cursor-pointer"
                style={{ background: '#C94A5E', color: '#051428' }}>
                {isAr ? 'تعليق' : 'Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TargetDetail;
