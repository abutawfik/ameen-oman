import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import type { DashboardOutletContext } from '../DashboardLayout';

const C = {
  bg: 'var(--alm-ocean-800)',
  p1: 'var(--alm-ocean-700)',
  p2: 'var(--alm-ocean-600)',
  p3: 'var(--alm-ocean-500)',
  p4: 'var(--alm-ocean-400)',
  gold: '#D6B47E',
  gold2: '#B8893C',
  critical: '#C94A5E',
  high: '#D4922A',
  medium: '#D6B47E',
  low: '#4A8E5A',
} as const;

type CheckpointStatus = 'OPEN' | 'BUSY' | 'CLOSED';
type CheckpointType = 'ARRIVAL' | 'DEPARTURE' | 'TRANSIT';
type CrossingStatus = 'CLEARED' | 'FLAGGED' | 'SECONDARY';
type AlertType = 'WATCHLIST_HIT' | 'DOCUMENT_MISMATCH' | 'BIOMETRIC_FAIL' | 'OVERSTAY';
type Tab = 'operations' | 'alerts' | 'stats';

interface Checkpoint {
  id: string;
  name: string;
  type: CheckpointType;
  queue: number;
  alerts: number;
  wait: string;
  status: CheckpointStatus;
}

interface Crossing {
  name: string;
  nationality: string;
  doc: string;
  status: CrossingStatus;
  time: string;
}

interface LiveAlert {
  id: string;
  checkpoint: string;
  type: AlertType;
  initials: string;
  timeAgo: string;
  acknowledged: boolean;
}

const CHECKPOINTS: Checkpoint[] = [
  { id: 'a1',    name: 'Gate A1',  type: 'ARRIVAL',   queue: 34, alerts: 2, wait: '3.5 min', status: 'BUSY'   },
  { id: 'a2',    name: 'Gate A2',  type: 'ARRIVAL',   queue: 12, alerts: 0, wait: '2.1 min', status: 'OPEN'   },
  { id: 'b1',    name: 'Gate B1',  type: 'DEPARTURE', queue: 67, alerts: 4, wait: '6.2 min', status: 'BUSY'   },
  { id: 'b2',    name: 'Gate B2',  type: 'DEPARTURE', queue: 8,  alerts: 0, wait: '1.8 min', status: 'OPEN'   },
  { id: 'c1',    name: 'Gate C1',  type: 'TRANSIT',   queue: 23, alerts: 1, wait: '4.0 min', status: 'OPEN'   },
  { id: 'c2',    name: 'Gate C2',  type: 'TRANSIT',   queue: 0,  alerts: 0, wait: '—',       status: 'CLOSED' },
  { id: 'vip',   name: 'VIP Lane', type: 'ARRIVAL',   queue: 3,  alerts: 0, wait: '1.2 min', status: 'OPEN'   },
  { id: 'cargo', name: 'Cargo',    type: 'DEPARTURE', queue: 15, alerts: 2, wait: '8.5 min', status: 'BUSY'   },
];

const SAMPLE_CROSSINGS: Crossing[] = [
  { name: 'Ahmed Khalil',      nationality: 'OMN', doc: 'OM·4821937', status: 'CLEARED',   time: '11:42' },
  { name: 'Rania Al-Farsi',    nationality: 'JOR', doc: 'JO·3391024', status: 'FLAGGED',   time: '11:39' },
  { name: 'Vijay Sharma',      nationality: 'IND', doc: 'IN·7724801', status: 'CLEARED',   time: '11:37' },
  { name: 'Aleks Petrov',      nationality: 'RUS', doc: 'RU·5519204', status: 'SECONDARY', time: '11:35' },
  { name: 'Fatima Binte Omar', nationality: 'PAK', doc: 'PK·9102384', status: 'CLEARED',   time: '11:31' },
];

const LIVE_ALERTS_INIT: LiveAlert[] = [
  { id: '1', checkpoint: 'Gate B1',  type: 'WATCHLIST_HIT',    initials: 'RK', timeAgo: '2 min ago',  acknowledged: false },
  { id: '2', checkpoint: 'Gate A1',  type: 'DOCUMENT_MISMATCH',initials: 'MA', timeAgo: '5 min ago',  acknowledged: false },
  { id: '3', checkpoint: 'Gate B1',  type: 'BIOMETRIC_FAIL',   initials: 'SH', timeAgo: '8 min ago',  acknowledged: false },
  { id: '4', checkpoint: 'Cargo',    type: 'WATCHLIST_HIT',    initials: 'TN', timeAgo: '12 min ago', acknowledged: false },
  { id: '5', checkpoint: 'Gate C1',  type: 'OVERSTAY',         initials: 'WA', timeAgo: '18 min ago', acknowledged: false },
  { id: '6', checkpoint: 'Gate A1',  type: 'DOCUMENT_MISMATCH',initials: 'BL', timeAgo: '24 min ago', acknowledged: false },
];

// SVG bar chart for Processing Stats tab
const HOURLY_PAX = [312, 478, 621, 590, 443, 510, 388, 425];
const HOURS      = ['04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00'];

function HourlyBarChart() {
  const W = 560, H = 160, padX = 44, padY = 16, barW = 44, gap = 12;
  const max = Math.max(...HOURLY_PAX);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W }}>
      {/* Y-axis gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map(t => {
        const y = padY + (1 - t) * (H - padY * 2);
        return (
          <g key={t}>
            <line x1={padX} y1={y} x2={W - 8} y2={y} stroke="rgba(184,138,60,0.08)" strokeWidth={0.5} />
            <text x={padX - 6} y={y + 4} fill="#4B5563" fontSize={9} textAnchor="end" fontFamily="JetBrains Mono, monospace">
              {Math.round(t * max)}
            </text>
          </g>
        );
      })}
      {/* Bars */}
      {HOURLY_PAX.map((v, i) => {
        const bh = ((v / max) * (H - padY * 2));
        const x  = padX + i * (barW + gap);
        const y  = H - padY - bh;
        return (
          <g key={i}>
            <rect x={x} y={H - padY} width={barW} height={0} fill="none">
              <animate attributeName="height" from={0} to={bh} dur="0.6s" fill="freeze" begin={`${i * 0.07}s`} />
              <animate attributeName="y"      from={H - padY} to={y}    dur="0.6s" fill="freeze" begin={`${i * 0.07}s`} />
            </rect>
            <rect x={x} y={y} width={barW} height={bh} fill={C.gold} opacity={0.65 + 0.3 * (v / max)} rx={3} />
            <text x={x + barW / 2} y={H - 2} fill="#6B7280" fontSize={8} textAnchor="middle" fontFamily="JetBrains Mono, monospace">
              {HOURS[i]}
            </text>
            <text x={x + barW / 2} y={y - 4} fill={C.gold} fontSize={9} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="600">
              {v}
            </text>
          </g>
        );
      })}
      {/* Axes */}
      <line x1={padX} y1={padY} x2={padX} y2={H - padY} stroke="rgba(184,138,60,0.2)" strokeWidth={0.5} />
      <line x1={padX} y1={H - padY} x2={W - 8} y2={H - padY} stroke="rgba(184,138,60,0.2)" strokeWidth={0.5} />
    </svg>
  );
}

const STATUS_COLOR: Record<CheckpointStatus, string> = {
  OPEN:   '#4A8E5A',
  BUSY:   '#D4922A',
  CLOSED: '#6B7280',
};

const TYPE_COLOR: Record<CheckpointType, string> = {
  ARRIVAL:   '#60A5FA',
  DEPARTURE: '#D6B47E',
  TRANSIT:   '#A78BFA',
};

const CROSSING_COLOR: Record<CrossingStatus, string> = {
  CLEARED:   '#4A8E5A',
  FLAGGED:   '#C94A5E',
  SECONDARY: '#D4922A',
};

const ALERT_ICON: Record<AlertType, string> = {
  WATCHLIST_HIT:    'ri-eye-line',
  DOCUMENT_MISMATCH:'ri-file-warning-line',
  BIOMETRIC_FAIL:   'ri-fingerprint-line',
  OVERSTAY:         'ri-time-line',
};

const ALERT_COLOR: Record<AlertType, string> = {
  WATCHLIST_HIT:    '#C94A5E',
  DOCUMENT_MISMATCH:'#D4922A',
  BIOMETRIC_FAIL:   '#A78BFA',
  OVERSTAY:         '#60A5FA',
};

function StatCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon?: string }) {
  return (
    <div style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.1)', borderRadius: 16, backdropFilter: 'blur(12px)', padding: '1.25rem 1.5rem', flex: 1, minWidth: 160 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        {icon && <i className={icon} style={{ color, fontSize: 14, opacity: 0.8 }} />}
        <div style={{ color: '#9CA3AF', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
      </div>
      <div style={{ color, fontSize: 32, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{value}</div>
    </div>
  );
}

const BorderDashboardPage = () => {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('operations');
  const [expandedCheckpoint, setExpandedCheckpoint] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<LiveAlert[]>(LIVE_ALERTS_INIT);

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const TABS: { id: Tab; label: string; labelAr: string; icon: string }[] = [
    { id: 'operations', label: 'Operations View',    labelAr: 'عرض العمليات',    icon: 'ri-dashboard-3-line' },
    { id: 'alerts',     label: 'Alert Feed',          labelAr: 'تغذية التنبيهات', icon: 'ri-alarm-warning-line' },
    { id: 'stats',      label: 'Processing Stats',    labelAr: 'إحصائيات المعالجة', icon: 'ri-bar-chart-2-line' },
  ];

  return (
    <div style={{ background: C.bg, minHeight: '100vh', padding: '1.5rem' }} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Grid texture */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(184,138,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#9CA3AF', padding: '6px 12px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <i className={isAr ? 'ri-arrow-right-line' : 'ri-arrow-left-line'} />
            {isAr ? 'لوحة التحكم' : 'Dashboard'}
          </button>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ri-shield-check-line" style={{ color: '#60A5FA', fontSize: 16 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: "'Inter', sans-serif" }}>{isAr ? 'لوحة ضبط الحدود' : 'Border Control Operations'}</span>
              <span style={{ background: 'rgba(184,138,60,0.12)', color: C.gold, border: '1px solid rgba(184,138,60,0.2)', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Ch 6.4</span>
            </div>
            <p style={{ color: '#6B7280', fontSize: 12, fontFamily: "'Inter', sans-serif", margin: 0 }}>{isAr ? 'العمليات الحدودية في الوقت الفعلي عبر جميع نقاط التفتيش' : 'Real-time border crossing activity across all checkpoints'}</p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <StatCard label={isAr ? 'نقاط التفتيش النشطة' : 'Active Checkpoints'}    value={8}     color={C.gold}     icon="ri-door-open-line" />
          <StatCard label={isAr ? 'المسافرون اليوم'      : 'Pax Processed Today'}  value="3,847" color="#fff"       icon="ri-group-line" />
          <StatCard label={isAr ? 'التنبيهات المرفوعة'   : 'Alerts Raised'}         value={19}    color={C.critical} icon="ri-alarm-warning-line" />
          <StatCard label={isAr ? 'متوسط وقت المعالجة'  : 'Avg Processing Time'}   value="4.2m"  color={C.low}      icon="ri-time-line" />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: '1.25rem', background: 'rgba(10,37,64,0.6)', border: '1px solid rgba(184,138,60,0.08)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                style={{ background: active ? 'rgba(184,138,60,0.12)' : 'transparent', border: active ? '1px solid rgba(184,138,60,0.2)' : '1px solid transparent', borderRadius: 7, color: active ? C.gold : '#6B7280', padding: '7px 14px', fontSize: 12, cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: active ? 600 : 400, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                <i className={tab.icon} style={{ fontSize: 13 }} />
                {isAr ? tab.labelAr : tab.label}
              </button>
            );
          })}
        </div>

        {/* OPERATIONS VIEW */}
        {activeTab === 'operations' && (
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            {/* Checkpoint grid */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                {CHECKPOINTS.map(cp => {
                  const isExpanded = expandedCheckpoint === cp.id;
                  const statusColor = STATUS_COLOR[cp.status];
                  const typeColor   = TYPE_COLOR[cp.type];
                  return (
                    <div key={cp.id} style={{ background: 'rgba(10,37,64,0.8)', border: `1px solid ${isExpanded ? 'rgba(184,138,60,0.25)' : 'rgba(184,138,60,0.1)'}`, borderRadius: 14, backdropFilter: 'blur(12px)', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                      {/* Card top */}
                      <div
                        onClick={() => setExpandedCheckpoint(isExpanded ? null : cp.id)}
                        style={{ padding: '1rem 1.25rem', cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div>
                            <div style={{ color: '#E5E7EB', fontWeight: 700, fontSize: 15, fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>{cp.name}</div>
                            <span style={{ background: `${typeColor}14`, color: typeColor, border: `1px solid ${typeColor}30`, borderRadius: 5, padding: '2px 7px', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{cp.type}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {cp.alerts > 0 && (
                              <span style={{ background: `${C.critical}18`, color: C.critical, border: `1px solid ${C.critical}40`, borderRadius: 12, padding: '2px 8px', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                                {cp.alerts} alert{cp.alerts !== 1 ? 's' : ''}
                              </span>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${statusColor}14`, border: `1px solid ${statusColor}30`, borderRadius: 6, padding: '3px 8px' }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, boxShadow: cp.status !== 'CLOSED' ? `0 0 6px ${statusColor}` : 'none' }} />
                              <span style={{ color: statusColor, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{cp.status}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                          <div>
                            <div style={{ color: '#4B5563', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 2 }}>QUEUE</div>
                            <div style={{ color: cp.queue > 40 ? C.critical : cp.queue > 20 ? C.high : '#E5E7EB', fontSize: 26, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{cp.queue}</div>
                          </div>
                          <div>
                            <div style={{ color: '#4B5563', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 2 }}>AVG WAIT</div>
                            <div style={{ color: '#9CA3AF', fontSize: 14, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{cp.wait}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <i className={isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} style={{ color: '#4B5563', fontSize: 18 }} />
                          </div>
                        </div>
                      </div>

                      {/* Expanded crossings */}
                      {isExpanded && (
                        <div style={{ borderTop: '1px solid rgba(184,138,60,0.1)', padding: '0.75rem 1.25rem' }}>
                          <div style={{ color: '#6B7280', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                            Recent Crossings
                          </div>
                          <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid rgba(184,138,60,0.06)' }}>
                                  {['Name', 'Nat.', 'Doc#', 'Status', 'Time'].map(h => (
                                    <th key={h} style={{ padding: '5px 8px', textAlign: 'left', color: '#374151', fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {SAMPLE_CROSSINGS.map((c, i) => (
                                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                    <td style={{ padding: '6px 8px', color: '#D1D5DB', fontFamily: "'Inter', sans-serif" }}>{c.name}</td>
                                    <td style={{ padding: '6px 8px', color: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace" }}>{c.nationality}</td>
                                    <td style={{ padding: '6px 8px', color: '#6B7280', fontFamily: "'JetBrains Mono', monospace" }}>{c.doc}</td>
                                    <td style={{ padding: '6px 8px' }}>
                                      <span style={{ background: `${CROSSING_COLOR[c.status]}14`, color: CROSSING_COLOR[c.status], border: `1px solid ${CROSSING_COLOR[c.status]}30`, borderRadius: 4, padding: '1px 6px', fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{c.status}</span>
                                    </td>
                                    <td style={{ padding: '6px 8px', color: '#6B7280', fontFamily: "'JetBrains Mono', monospace" }}>{c.time}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live alerts panel */}
            <div style={{ width: 320, flexShrink: 0, background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.1)', borderRadius: 16, backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(184,138,60,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="ri-alarm-warning-line" style={{ color: C.critical, fontSize: 15 }} />
                  <span style={{ color: '#E5E7EB', fontWeight: 700, fontSize: 14, fontFamily: "'Inter', sans-serif" }}>Live Alerts</span>
                </div>
                <span style={{ background: `${C.critical}18`, color: C.critical, border: `1px solid ${C.critical}30`, borderRadius: 12, padding: '2px 8px', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                  {alerts.filter(a => !a.acknowledged).length} open
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {alerts.map(alert => (
                  <div key={alert.id} style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', opacity: alert.acknowledged ? 0.45 : 1, transition: 'opacity 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      {/* Initials circle */}
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${ALERT_COLOR[alert.type]}18`, border: `1px solid ${ALERT_COLOR[alert.type]}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: ALERT_COLOR[alert.type], fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{alert.initials}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          <i className={ALERT_ICON[alert.type]} style={{ color: ALERT_COLOR[alert.type], fontSize: 12 }} />
                          <span style={{ color: ALERT_COLOR[alert.type], fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{alert.type.replace(/_/g, ' ')}</span>
                        </div>
                        <div style={{ color: '#9CA3AF', fontSize: 12, fontFamily: "'Inter', sans-serif", marginBottom: 2 }}>{alert.checkpoint}</div>
                        <div style={{ color: '#4B5563', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>{alert.timeAgo}</div>
                      </div>
                      {!alert.acknowledged && (
                        <button type="button"
                          onClick={() => handleAcknowledge(alert.id)}
                          style={{ background: 'rgba(184,138,60,0.08)', border: '1px solid rgba(184,138,60,0.18)', borderRadius: 6, color: C.gold, padding: '4px 8px', fontSize: 10, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap', flexShrink: 0 }}>
                          ACK
                        </button>
                      )}
                      {alert.acknowledged && (
                        <span style={{ color: '#374151', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>✓ ACK</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ALERT FEED */}
        {activeTab === 'alerts' && (
          <div style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.1)', borderRadius: 16, backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(184,138,60,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="ri-alarm-warning-line" style={{ color: C.critical }} />
              <span style={{ color: '#E5E7EB', fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{isAr ? 'تغذية التنبيهات الكاملة' : 'Full Alert Feed'}</span>
            </div>
            {alerts.map(alert => (
              <div key={alert.id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 16, opacity: alert.acknowledged ? 0.5 : 1, transition: 'opacity 0.3s' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${ALERT_COLOR[alert.type]}14`, border: `1px solid ${ALERT_COLOR[alert.type]}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: ALERT_COLOR[alert.type], fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 13 }}>{alert.initials}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <i className={ALERT_ICON[alert.type]} style={{ color: ALERT_COLOR[alert.type], fontSize: 14 }} />
                    <span style={{ color: ALERT_COLOR[alert.type], fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 12 }}>{alert.type.replace(/_/g, ' ')}</span>
                    <span style={{ background: `${ALERT_COLOR[alert.type]}14`, color: ALERT_COLOR[alert.type], border: `1px solid ${ALERT_COLOR[alert.type]}30`, borderRadius: 10, padding: '1px 7px', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>ACTIVE</span>
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: 13, fontFamily: "'Inter', sans-serif" }}>{alert.checkpoint} · {alert.timeAgo}</div>
                </div>
                {!alert.acknowledged && (
                  <button type="button"
                    onClick={() => handleAcknowledge(alert.id)}
                    style={{ background: 'rgba(184,138,60,0.1)', border: '1px solid rgba(184,138,60,0.25)', borderRadius: 8, color: C.gold, padding: '7px 16px', fontSize: 12, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                    Acknowledge
                  </button>
                )}
                {alert.acknowledged && (
                  <span style={{ color: C.low, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>✓ Acknowledged</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* PROCESSING STATS */}
        {activeTab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.1)', borderRadius: 16, backdropFilter: 'blur(12px)', padding: '1.5rem' }}>
              <div style={{ color: '#9CA3AF', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                {isAr ? 'المسافرون المعالجون — آخر 8 ساعات' : 'Passengers Processed — Last 8 Hours'}
              </div>
              <HourlyBarChart />
            </div>

            {/* Summary stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {[
                { label: 'Peak Hour',     value: '06:00',  color: C.gold },
                { label: 'Peak Volume',   value: '621',    color: '#60A5FA' },
                { label: 'Total Today',   value: '3,847',  color: '#fff' },
                { label: 'CLEARED Rate',  value: '94.2%',  color: C.low },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.1)', borderRadius: 12, backdropFilter: 'blur(12px)', padding: '1rem 1.25rem' }}>
                  <div style={{ color: '#6B7280', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ color: s.color, fontSize: 24, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Checkpoint breakdown table */}
            <div style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.1)', borderRadius: 16, backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(184,138,60,0.08)', color: '#9CA3AF', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {isAr ? 'تفاصيل نقطة التفتيش' : 'Checkpoint Breakdown'}
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'rgba(184,138,60,0.04)', borderBottom: '1px solid rgba(184,138,60,0.08)' }}>
                      {['Checkpoint', 'Type', 'Processed', 'Cleared', 'Flagged', 'Avg Wait', 'Status'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#4B5563', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CHECKPOINTS.map((cp, idx) => {
                      const processed = cp.status === 'CLOSED' ? 0 : Math.round(50 + Math.random() * 200);
                      const flagged   = cp.alerts;
                      const cleared   = Math.max(0, processed - flagged);
                      return (
                        <tr key={cp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                          <td style={{ padding: '10px 14px', color: '#E5E7EB', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{cp.name}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{ color: TYPE_COLOR[cp.type], background: `${TYPE_COLOR[cp.type]}12`, border: `1px solid ${TYPE_COLOR[cp.type]}25`, borderRadius: 5, padding: '2px 7px', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{cp.type}</span>
                          </td>
                          <td style={{ padding: '10px 14px', color: '#E5E7EB', fontFamily: "'JetBrains Mono', monospace" }}>{processed}</td>
                          <td style={{ padding: '10px 14px', color: C.low, fontFamily: "'JetBrains Mono', monospace" }}>{cleared}</td>
                          <td style={{ padding: '10px 14px', color: flagged > 0 ? C.critical : '#4B5563', fontFamily: "'JetBrains Mono', monospace", fontWeight: flagged > 0 ? 700 : 400 }}>{flagged}</td>
                          <td style={{ padding: '10px 14px', color: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace" }}>{cp.wait}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLOR[cp.status], boxShadow: cp.status !== 'CLOSED' ? `0 0 5px ${STATUS_COLOR[cp.status]}` : 'none' }} />
                              <span style={{ color: STATUS_COLOR[cp.status], fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{cp.status}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorderDashboardPage;
