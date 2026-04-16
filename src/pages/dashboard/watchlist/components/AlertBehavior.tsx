import { useState } from 'react';
import { watchlists, watchlistAlerts } from '@/mocks/watchlistData';

interface Props {
  isAr: boolean;
}

const streamList = [
  { key: 'border', label: 'Border Intelligence', icon: 'ri-passport-line', color: '#60A5FA' },
  { key: 'hotel', label: 'Hotel Intelligence', icon: 'ri-hotel-line', color: '#22D3EE' },
  { key: 'mobile', label: 'Mobile Operators', icon: 'ri-sim-card-line', color: '#A78BFA' },
  { key: 'financial', label: 'Financial Services', icon: 'ri-bank-card-line', color: '#4ADE80' },
  { key: 'employment', label: 'Employment Registry', icon: 'ri-briefcase-line', color: '#F9A8D4' },
  { key: 'car', label: 'Car Rental', icon: 'ri-car-line', color: '#FACC15' },
  { key: 'transport', label: 'Transport Intel', icon: 'ri-bus-line', color: '#FB923C' },
  { key: 'municipality', label: 'Municipality', icon: 'ri-government-line', color: '#34D399' },
  { key: 'utility', label: 'Utility Events', icon: 'ri-flashlight-line', color: '#FACC15' },
  { key: 'healthcare', label: 'Healthcare Events', icon: 'ri-heart-pulse-line', color: '#F87171' },
  { key: 'tourism', label: 'Tourism Events', icon: 'ri-map-2-line', color: '#38BDF8' },
  { key: 'ecommerce', label: 'E-Commerce Intel', icon: 'ri-shopping-cart-line', color: '#34D399' },
  { key: 'social', label: 'Social Intelligence', icon: 'ri-global-line', color: '#38BDF8' },
  { key: 'postal', label: 'Postal Events', icon: 'ri-mail-send-line', color: '#9CA3AF' },
];

const statusColors: Record<string, string> = {
  new: '#F87171',
  acknowledged: '#FACC15',
  escalated: '#FB923C',
  closed: '#4ADE80',
};

const AlertBehavior = ({ isAr }: Props) => {
  const [selectedWl, setSelectedWl] = useState(watchlists[0].id);
  const [enabledStreams, setEnabledStreams] = useState<Record<string, boolean>>(
    Object.fromEntries(streamList.map(s => [s.key, true]))
  );
  const [nearMatchThreshold, setNearMatchThreshold] = useState(80);
  const [soundAlert, setSoundAlert] = useState(true);
  const [mobilePush, setMobilePush] = useState(true);
  const [commandCenter, setCommandCenter] = useState(true);
  const [emailAlert, setEmailAlert] = useState(false);
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [escalateMinutes, setEscalateMinutes] = useState(15);
  const [activeAlertTab, setActiveAlertTab] = useState<'queue' | 'config'>('queue');

  const allAlerts = watchlistAlerts;
  const newAlerts = allAlerts.filter(a => a.status === 'new');
  const nearMatches = allAlerts.filter(a => a.isNearMatch);

  const toggleStream = (key: string) => {
    setEnabledStreams(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-5">
      {/* Alert Queue / Config tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(34,211,238,0.1)' }}>
        {[
          { key: 'queue', label: 'Alert Queue', labelAr: 'قائمة التنبيهات' },
          { key: 'config', label: 'Alert Configuration', labelAr: 'إعداد التنبيهات' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveAlertTab(tab.key as 'queue' | 'config')}
            className="px-4 py-2 rounded-lg text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer transition-all"
            style={{
              background: activeAlertTab === tab.key ? '#22D3EE' : 'transparent',
              color: activeAlertTab === tab.key ? '#060D1A' : '#9CA3AF',
            }}>
            {isAr ? tab.labelAr : tab.label}
            {tab.key === 'queue' && newAlerts.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs font-['JetBrains_Mono']"
                style={{ background: activeAlertTab === 'queue' ? 'rgba(6,13,26,0.3)' : 'rgba(248,113,113,0.3)', color: activeAlertTab === 'queue' ? '#060D1A' : '#F87171' }}>
                {newAlerts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeAlertTab === 'queue' && (
        <div className="space-y-4">
          {/* Near-match banner */}
          {nearMatches.length > 0 && (
            <div className="rounded-xl p-4 flex items-center gap-4"
              style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.3)' }}>
              <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: 'rgba(251,146,60,0.2)' }}>
                <i className="ri-alert-line text-orange-400 text-lg" />
              </div>
              <div className="flex-1">
                <p className="text-orange-400 font-bold font-['Inter'] text-sm">
                  {nearMatches.length} {isAr ? 'تطابق قريب يتطلب مراجعة' : 'Near-Match Alerts Require Review'}
                </p>
                <p className="text-gray-400 text-xs font-['Inter'] mt-0.5">
                  {isAr ? 'أشخاص بأسماء أو وثائق مشابهة — ليست تطابقات مؤكدة' : 'Persons with similar names or documents — not confirmed matches'}
                </p>
              </div>
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold font-['Inter'] whitespace-nowrap cursor-pointer"
                style={{ background: 'rgba(251,146,60,0.2)', color: '#FB923C', border: '1px solid rgba(251,146,60,0.3)' }}>
                {isAr ? 'مراجعة الكل' : 'Review All'}
              </button>
            </div>
          )}

          {/* Alert list */}
          <div className="rounded-xl overflow-hidden"
            style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(34,211,238,0.12)' }}>
            <div className="px-4 py-3 border-b flex items-center justify-between"
              style={{ borderColor: 'rgba(34,211,238,0.08)' }}>
              <h3 className="text-white font-semibold font-['Inter'] text-sm">
                {isAr ? 'جميع التنبيهات' : 'All Alerts'} ({allAlerts.length})
              </h3>
              <div className="flex items-center gap-2">
                {['new', 'acknowledged', 'escalated', 'closed'].map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full font-['JetBrains_Mono']"
                    style={{ background: `${statusColors[s]}15`, color: statusColors[s] }}>
                    {allAlerts.filter(a => a.status === s).length} {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="divide-y" style={{ borderColor: 'rgba(34,211,238,0.05)' }}>
              {allAlerts.map((alert) => (
                <div key={alert.id} className="p-4 flex items-start gap-4 hover:bg-white/5 transition-colors">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ background: alert.isNearMatch ? 'rgba(251,146,60,0.15)' : 'rgba(34,211,238,0.1)' }}>
                    <i className={`${alert.streamIcon} text-sm`}
                      style={{ color: alert.isNearMatch ? '#FB923C' : '#22D3EE' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-white text-sm font-semibold font-['Inter']">{alert.targetName}</p>
                      <span className="text-xs text-gray-400 font-['Inter']">·</span>
                      <p className="text-gray-400 text-xs font-['Inter']">{alert.eventType}</p>
                      {alert.isNearMatch && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-['JetBrains_Mono']"
                          style={{ background: 'rgba(251,146,60,0.2)', color: '#FB923C' }}>
                          ~{alert.confidence}% MATCH
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs font-['Inter'] mb-1 truncate">{alert.details}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-['JetBrains_Mono']">
                      <span>{alert.stream}</span>
                      <span>·</span>
                      <span>{alert.location}</span>
                      <span>·</span>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-full font-['JetBrains_Mono']"
                      style={{ background: `${statusColors[alert.status]}18`, color: statusColors[alert.status] }}>
                      {alert.status.toUpperCase()}
                    </span>
                    {alert.status === 'new' && (
                      <button className="px-2 py-1 rounded-lg text-xs font-['Inter'] cursor-pointer whitespace-nowrap"
                        style={{ background: 'rgba(34,211,238,0.15)', color: '#22D3EE' }}>
                        {isAr ? 'إقرار' : 'Ack'}
                      </button>
                    )}
                    <button className="px-2 py-1 rounded-lg text-xs font-['Inter'] cursor-pointer whitespace-nowrap"
                      style={{ border: '1px solid rgba(251,146,60,0.3)', color: '#FB923C' }}>
                      {isAr ? 'تصعيد' : 'Escalate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeAlertTab === 'config' && (
        <div className="grid grid-cols-2 gap-5">
          {/* Left: Per-watchlist config */}
          <div className="space-y-4">
            <div className="rounded-xl p-4"
              style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(34,211,238,0.12)' }}>
              <h3 className="text-white font-semibold font-['Inter'] text-sm mb-3">
                {isAr ? 'إعداد القائمة' : 'Watchlist Alert Config'}
              </h3>
              <div className="mb-3">
                <label className="text-gray-400 text-xs font-['Inter'] block mb-1">
                  {isAr ? 'اختر القائمة' : 'Select Watchlist'}
                </label>
                <select value={selectedWl} onChange={e => setSelectedWl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm font-['Inter'] cursor-pointer"
                  style={{ background: 'rgba(6,13,26,0.8)', border: '1px solid rgba(34,211,238,0.15)', color: '#D1D5DB' }}>
                  {watchlists.map(wl => (
                    <option key={wl.id} value={wl.id}>{wl.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Sound Alert at Command Center', labelAr: 'تنبيه صوتي في مركز القيادة', state: soundAlert, set: setSoundAlert, icon: 'ri-volume-up-line', color: '#22D3EE' },
                  { label: 'Push to Mobile Field Officers', labelAr: 'إرسال لضباط الميدان', state: mobilePush, set: setMobilePush, icon: 'ri-smartphone-line', color: '#4ADE80' },
                  { label: 'Alert Command Center Dashboard', labelAr: 'تنبيه لوحة مركز القيادة', state: commandCenter, set: setCommandCenter, icon: 'ri-radar-line', color: '#FB923C' },
                  { label: 'Email Notification', labelAr: 'إشعار بريد إلكتروني', state: emailAlert, set: setEmailAlert, icon: 'ri-mail-line', color: '#FACC15' },
                  { label: 'Auto-Escalate if Unacknowledged', labelAr: 'تصعيد تلقائي إذا لم يُقر', state: autoEscalate, set: setAutoEscalate, icon: 'ri-arrow-up-circle-line', color: '#F87171' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: 'rgba(6,13,26,0.5)', border: '1px solid rgba(34,211,238,0.06)' }}>
                    <div className="flex items-center gap-2">
                      <i className={`${item.icon} text-sm`} style={{ color: item.color }} />
                      <span className="text-gray-300 text-xs font-['Inter']">
                        {isAr ? item.labelAr : item.label}
                      </span>
                    </div>
                    <button onClick={() => item.set(!item.state)}
                      className="w-10 h-5 rounded-full transition-all cursor-pointer relative flex-shrink-0"
                      style={{ background: item.state ? '#22D3EE' : 'rgba(255,255,255,0.1)' }}>
                      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                        style={{ left: item.state ? '22px' : '2px' }} />
                    </button>
                  </div>
                ))}
              </div>

              {autoEscalate && (
                <div className="mt-3 p-3 rounded-xl"
                  style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
                  <label className="text-gray-400 text-xs font-['Inter'] block mb-2">
                    {isAr ? 'تصعيد بعد (دقائق)' : 'Escalate after (minutes)'}
                  </label>
                  <div className="flex items-center gap-3">
                    <input type="range" min={5} max={60} value={escalateMinutes}
                      onChange={e => setEscalateMinutes(Number(e.target.value))}
                      className="flex-1 cursor-pointer" />
                    <span className="text-red-400 font-['JetBrains_Mono'] text-sm w-12 text-right">{escalateMinutes}m</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Stream monitoring + near-match */}
          <div className="space-y-4">
            <div className="rounded-xl p-4"
              style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(34,211,238,0.12)' }}>
              <h3 className="text-white font-semibold font-['Inter'] text-sm mb-3">
                {isAr ? 'تفعيل التدفقات' : 'Stream Monitoring'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {streamList.map(stream => (
                  <button key={stream.key} onClick={() => toggleStream(stream.key)}
                    className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all text-left"
                    style={{
                      background: enabledStreams[stream.key] ? `${stream.color}12` : 'rgba(6,13,26,0.5)',
                      border: `1px solid ${enabledStreams[stream.key] ? `${stream.color}40` : 'rgba(255,255,255,0.05)'}`,
                    }}>
                    <i className={`${stream.icon} text-sm flex-shrink-0`}
                      style={{ color: enabledStreams[stream.key] ? stream.color : '#4B5563' }} />
                    <span className="text-xs font-['Inter'] truncate"
                      style={{ color: enabledStreams[stream.key] ? '#D1D5DB' : '#4B5563' }}>
                      {stream.label}
                    </span>
                    <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: enabledStreams[stream.key] ? '#4ADE80' : '#374151' }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-4"
              style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(251,146,60,0.2)' }}>
              <h3 className="text-white font-semibold font-['Inter'] text-sm mb-3">
                {isAr ? 'إعداد التطابق القريب' : 'Near-Match Configuration'}
              </h3>
              <p className="text-gray-400 text-xs font-['Inter'] mb-3">
                {isAr ? 'عندما يظهر شخص بوثيقة أو اسم مشابه (غير مطابق تماماً)، يتم إرسال تنبيه "تطابق قريب" بنسبة ثقة.' : 'When someone with a similar (not exact) document or name appears, a "Possible Match" amber alert fires with confidence %.'}
              </p>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-400 text-xs font-['Inter']">
                      {isAr ? 'حد الثقة الأدنى' : 'Minimum Confidence Threshold'}
                    </label>
                    <span className="text-orange-400 font-['JetBrains_Mono'] text-sm">{nearMatchThreshold}%</span>
                  </div>
                  <input type="range" min={60} max={95} value={nearMatchThreshold}
                    onChange={e => setNearMatchThreshold(Number(e.target.value))}
                    className="w-full cursor-pointer" />
                  <div className="flex justify-between text-xs text-gray-600 font-['JetBrains_Mono'] mt-1">
                    <span>60% (more alerts)</span>
                    <span>95% (fewer alerts)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Name Fuzzy Match', icon: 'ri-user-line', active: true },
                    { label: 'Document Variant', icon: 'ri-file-text-line', active: true },
                    { label: 'Phone Similarity', icon: 'ri-phone-line', active: false },
                    { label: 'Biometric Partial', icon: 'ri-fingerprint-line', active: true },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2 p-2 rounded-lg"
                      style={{ background: item.active ? 'rgba(251,146,60,0.08)' : 'rgba(6,13,26,0.5)', border: `1px solid ${item.active ? 'rgba(251,146,60,0.25)' : 'rgba(255,255,255,0.05)'}` }}>
                      <i className={`${item.icon} text-xs`} style={{ color: item.active ? '#FB923C' : '#4B5563' }} />
                      <span className="text-xs font-['Inter']" style={{ color: item.active ? '#D1D5DB' : '#4B5563' }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertBehavior;
