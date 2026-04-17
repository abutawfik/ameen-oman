import { useState } from 'react';
import { alertQueue } from '@/mocks/predictiveAnalyticsData';

const criticalAlerts = alertQueue.filter(a => a.priority === 'critical' || a.score > 75);

const FIELD_OFFICERS = [
  { id: 'FO-01', name: 'Cpl. Hassan Al-Balushi',  status: 'online',  location: 'Capital District',    lastPing: '2 min ago' },
  { id: 'FO-02', name: 'Sgt. Khalid Al-Farsi',    status: 'online',  location: 'CBD Zone',            lastPing: '1 min ago' },
  { id: 'FO-03', name: 'Cpl. Fatima Al-Amri',     status: 'online',  location: 'Airport Terminal 1',  lastPing: '4 min ago' },
  { id: 'FO-04', name: 'Lt. Yusuf Al-Rawahi',     status: 'online',  location: 'Seeb Port',           lastPing: '3 min ago' },
  { id: 'FO-05', name: 'Cpl. Ahmed Al-Harthi',    status: 'offline', location: 'Northern District',   lastPing: '42 min ago' },
  { id: 'FO-06', name: 'Sgt. Maryam Al-Zadjali',  status: 'online',  location: 'Sohar Free Zone',     lastPing: '6 min ago' },
];

export default function MobilePushPanel() {
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());
  const [showOfficers, setShowOfficers] = useState(false);

  const onlineCount = FIELD_OFFICERS.filter(o => o.status === 'online').length;

  const handleAck = (id: string) => {
    setAcknowledged(prev => new Set([...prev, id]));
  };

  return (
    <div className="space-y-4">
      {/* Header panel */}
      <div
        className="rounded-xl border border-gold-500/20 p-5"
        style={{ background: 'rgba(20,29,46,0.8)' }}
      >
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(181,142,60,0.15)', border: '1px solid rgba(181,142,60,0.3)' }}
          >
            <i className="ri-smartphone-line text-gold-400 text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">AMEEN Mobile Push — Tier 2</h3>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
              Critical alerts (score &gt;75 or critical priority) are automatically pushed to field officers&apos; AMEEN Mobile app in real-time. Officers receive full person profile, location, triggering pattern, and suggested action.
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-gold-400 font-mono font-bold text-2xl">{criticalAlerts.length}</p>
            <p className="text-gray-500 text-xs">Pushed Today</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Officers Online', value: `${onlineCount} / ${FIELD_OFFICERS.length}`, icon: 'ri-user-line', color: '#4ADE80' },
            { label: 'Avg Response', value: '4.2 min', icon: 'ri-time-line', color: '#D4A84B' },
            { label: 'Acknowledged', value: `${acknowledged.size} / ${criticalAlerts.length}`, icon: 'ri-check-double-line', color: '#4ADE80' },
            { label: 'Pending Action', value: `${criticalAlerts.length - acknowledged.size}`, icon: 'ri-alarm-warning-line', color: '#FB923C' },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-lg px-3 py-2.5 border border-gold-500/10 text-center"
              style={{ background: 'rgba(181,142,60,0.04)' }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <i className={`${stat.icon} text-sm`} style={{ color: stat.color }} />
                <span className="font-mono font-bold text-sm" style={{ color: stat.color }}>{stat.value}</span>
              </div>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Officers toggle */}
        <button
          onClick={() => setShowOfficers(!showOfficers)}
          className="mt-3 flex items-center gap-2 text-xs text-gold-400 hover:text-gold-300 cursor-pointer transition-colors"
        >
          <i className={`${showOfficers ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
          {showOfficers ? 'Hide' : 'Show'} Field Officers ({onlineCount} online)
        </button>

        {showOfficers && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {FIELD_OFFICERS.map(officer => (
              <div
                key={officer.id}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-gold-500/10"
                style={{ background: 'rgba(20,29,46,0.6)' }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: officer.status === 'online' ? '#4ADE80' : '#9CA3AF' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{officer.name}</p>
                  <p className="text-gray-500 text-xs truncate">{officer.location}</p>
                </div>
                <span className="text-gray-600 text-xs shrink-0">{officer.lastPing}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Push notification cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {criticalAlerts.map(alert => {
          const isAcked = acknowledged.has(alert.id);
          return (
            <div
              key={alert.id}
              className="rounded-xl border overflow-hidden transition-all"
              style={{
                background: 'rgba(20,29,46,0.9)',
                borderColor: isAcked ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)',
                opacity: isAcked ? 0.7 : 1,
              }}
            >
              {/* Push header */}
              <div
                className="flex items-center gap-2 px-4 py-2 border-b"
                style={{
                  background: isAcked ? 'rgba(74,222,128,0.06)' : 'rgba(248,113,113,0.08)',
                  borderColor: isAcked ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)',
                }}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                  style={{ background: isAcked ? '#4ADE80' : '#F87171' }}
                >
                  <i
                    className={`${isAcked ? 'ri-check-line' : 'ri-alarm-warning-fill'} text-white`}
                    style={{ fontSize: 10 }}
                  />
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{ color: isAcked ? '#4ADE80' : '#F87171' }}
                >
                  {isAcked ? 'ACKNOWLEDGED' : 'AMEEN MOBILE — CRITICAL ALERT'}
                </span>
                <span className="text-gray-500 text-xs ml-auto font-mono">{alert.triggeredAt}</span>
              </div>

              <div className="p-4">
                {/* Person info */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{
                      background: `${alert.photoColor}20`,
                      color: alert.photoColor,
                      border: `1px solid ${alert.photoColor}40`,
                    }}
                  >
                    {alert.photoInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{alert.personName}</p>
                    <p className="text-gray-400 text-xs font-mono">{alert.personDoc} · {alert.nationality}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <i className="ri-map-pin-line text-gold-400 text-xs" />
                      <span className="text-gray-400 text-xs truncate">{alert.location}</span>
                    </div>
                  </div>
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-mono font-bold text-sm shrink-0 border-2"
                    style={{
                      borderColor: alert.score >= 80 ? '#F87171' : '#FB923C',
                      color: alert.score >= 80 ? '#F87171' : '#FB923C',
                      background: alert.score >= 80 ? 'rgba(248,113,113,0.1)' : 'rgba(251,146,60,0.1)',
                    }}
                  >
                    {alert.score}
                  </div>
                </div>

                {/* Triggering pattern */}
                <div
                  className="rounded-lg p-3 mb-3 border border-gold-500/15"
                  style={{ background: 'rgba(181,142,60,0.04)' }}
                >
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Triggering Pattern</p>
                  <p className="text-gold-400 text-xs font-semibold mb-1">{alert.ruleName}</p>
                  <p className="text-gray-300 text-xs leading-relaxed">{alert.triggerDescription}</p>
                </div>

                {/* Suggested action */}
                <div
                  className="rounded-lg p-3 mb-3 border border-orange-500/20"
                  style={{ background: 'rgba(251,146,60,0.06)' }}
                >
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Suggested Action</p>
                  <p className="text-orange-300 text-xs leading-relaxed">{alert.suggestedAction}</p>
                </div>

                {/* Officer actions */}
                {!isAcked ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAck(alert.id)}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
                      style={{ background: '#D4A84B', color: '#0B1220' }}
                    >
                      <i className="ri-check-line mr-1" />Acknowledge
                    </button>
                    <button
                      className="flex-1 py-2 rounded-lg text-xs font-semibold border border-orange-500/40 text-orange-400 hover:bg-orange-500/10 cursor-pointer transition-all whitespace-nowrap"
                    >
                      <i className="ri-arrow-up-circle-line mr-1" />Escalate
                    </button>
                    <button
                      className="px-3 py-2 rounded-lg text-xs border border-gold-500/20 text-gold-400 hover:bg-gold-500/10 cursor-pointer transition-all whitespace-nowrap"
                      title="Navigate to location"
                    >
                      <i className="ri-map-pin-line" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-2 py-2 px-3 rounded-lg border border-green-500/20 text-green-400 text-xs"
                    style={{ background: 'rgba(74,222,128,0.06)' }}
                  >
                    <i className="ri-check-double-line" />
                    Acknowledged — awaiting field report
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
