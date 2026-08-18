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

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type ServiceStatus = 'BOARDING' | 'IN_FLIGHT' | 'ARRIVED' | 'DELAYED';

interface Service {
  id: string;
  flight: string;
  from: string;
  to: string;
  airline: string;
  status: ServiceStatus;
  etd: string;
  eta: string;
  pax: number;
  hits: number;
  risk: RiskLevel;
}

interface Passenger {
  name: string;
  nationality: string;
  seat: string;
  risk: RiskLevel;
  hit: boolean;
}

const SERVICES: Service[] = [
  { id: '1',  flight: 'WY101', from: 'MCT', to: 'LHR', airline: 'Oman Air',   status: 'IN_FLIGHT', etd: '07:00', eta: '13:30', pax: 287, hits: 0, risk: 'LOW'      },
  { id: '2',  flight: 'WY456', from: 'AMM', to: 'MCT', airline: 'Oman Air',   status: 'BOARDING',  etd: '11:45', eta: '16:20', pax: 198, hits: 3, risk: 'HIGH'     },
  { id: '3',  flight: 'EK202', from: 'DXB', to: 'MCT', airline: 'Emirates',   status: 'IN_FLIGHT', etd: '09:15', eta: '10:30', pax: 412, hits: 1, risk: 'MEDIUM'   },
  { id: '4',  flight: 'QR550', from: 'DOH', to: 'MCT', airline: 'Qatar',      status: 'ARRIVED',   etd: '06:00', eta: '08:45', pax: 380, hits: 0, risk: 'LOW'      },
  { id: '5',  flight: 'FZ731', from: 'DXB', to: 'MCT', airline: 'Fly Dubai',  status: 'DELAYED',   etd: '12:00', eta: '14:30', pax: 89,  hits: 1, risk: 'MEDIUM'   },
  { id: '6',  flight: 'WY102', from: 'CAI', to: 'MCT', airline: 'Oman Air',   status: 'IN_FLIGHT', etd: '08:30', eta: '12:00', pax: 156, hits: 2, risk: 'HIGH'     },
  { id: '7',  flight: 'SV423', from: 'RUH', to: 'MCT', airline: 'Saudi',      status: 'BOARDING',  etd: '11:30', eta: '13:45', pax: 223, hits: 0, risk: 'LOW'      },
  { id: '8',  flight: 'TK891', from: 'IST', to: 'MCT', airline: 'Turkish',    status: 'IN_FLIGHT', etd: '05:45', eta: '11:30', pax: 318, hits: 1, risk: 'MEDIUM'   },
  { id: '9',  flight: 'IX987', from: 'BOM', to: 'MCT', airline: 'Air Arabia', status: 'ARRIVED',   etd: '04:30', eta: '08:15', pax: 167, hits: 0, risk: 'LOW'      },
  { id: '10', flight: 'WY890', from: 'KHI', to: 'MCT', airline: 'Oman Air',   status: 'BOARDING',  etd: '12:15', eta: '15:00', pax: 134, hits: 2, risk: 'CRITICAL' },
];

const MANIFEST_SAMPLE: Passenger[] = [
  { name: 'Ahmed Al-Rashidi',   nationality: 'OMN', seat: '12A', risk: 'LOW',      hit: false },
  { name: 'Tariq Hassan',       nationality: 'JOR', seat: '14C', risk: 'HIGH',     hit: true  },
  { name: 'Fatima Al-Balushi',  nationality: 'OMN', seat: '18F', risk: 'LOW',      hit: false },
  { name: 'Mohammad Karimi',    nationality: 'IRN', seat: '22B', risk: 'CRITICAL', hit: true  },
  { name: 'Priya Nair',         nationality: 'IND', seat: '31E', risk: 'LOW',      hit: false },
];

const STATUS_COLOR: Record<ServiceStatus, string> = {
  BOARDING:  '#D4922A',
  IN_FLIGHT: '#60A5FA',
  ARRIVED:   '#4A8E5A',
  DELAYED:   '#C94A5E',
};

const RISK_COLOR: Record<RiskLevel, string> = {
  CRITICAL: C.critical,
  HIGH:     C.high,
  MEDIUM:   C.medium,
  LOW:      C.low,
};

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.1)', borderRadius: 16, backdropFilter: 'blur(12px)', padding: '1.25rem 1.5rem', flex: 1, minWidth: 160 }}>
      <div style={{ color: '#9CA3AF', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ color, fontSize: 32, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span style={{ background: `${RISK_COLOR[level]}18`, color: RISK_COLOR[level], border: `1px solid ${RISK_COLOR[level]}40`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.08em' }}>
      {level}
    </span>
  );
}

function StatusBadge({ status }: { status: ServiceStatus }) {
  const color = STATUS_COLOR[status];
  const label = status.replace('_', ' ');
  return (
    <span style={{ background: `${color}18`, color, border: `1px solid ${color}40`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.05em' }}>
      {label}
    </span>
  );
}

const ServicesDashboardPage = () => {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ServiceStatus>('ALL');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const filtered = SERVICES.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.flight.toLowerCase().includes(q) || s.airline.toLowerCase().includes(q) || s.from.toLowerCase().includes(q) || s.to.toLowerCase().includes(q);
    const matchRisk = riskFilter === 'ALL' || s.risk === riskFilter;
    const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchSearch && matchRisk && matchStatus;
  });

  const totalPax    = SERVICES.reduce((a, s) => a + s.pax, 0);
  const highRiskPax = 23;
  const openHits    = SERVICES.reduce((a, s) => a + s.hits, 0);

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
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(184,138,60,0.12)', border: '1px solid rgba(184,138,60,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ri-flight-takeoff-line" style={{ color: C.gold, fontSize: 16 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: "'Inter', sans-serif" }}>{isAr ? 'لوحة الخدمات' : 'Services Dashboard'}</span>
              <span style={{ background: 'rgba(184,138,60,0.12)', color: C.gold, border: '1px solid rgba(184,138,60,0.2)', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Ch 6.2</span>
            </div>
            <p style={{ color: '#6B7280', fontSize: 12, fontFamily: "'Inter', sans-serif", margin: 0 }}>{isAr ? 'مراقبة الرحلات والركاب في الوقت الفعلي' : 'Real-time flight & passenger monitoring'}</p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <StatCard label={isAr ? 'الخدمات النشطة' : 'Active Services'}     value={47}         color={C.gold} />
          <StatCard label={isAr ? 'إجمالي الركاب'  : 'Total Passengers'}    value={totalPax.toLocaleString()} color="#fff" />
          <StatCard label={isAr ? 'ركاب عالي الخطورة' : 'High Risk Pax'}    value={highRiskPax} color={C.critical} />
          <StatCard label={isAr ? 'التنبيهات المفتوحة'  : 'Open Hits'}       value={openHits}    color={C.high} />
        </div>

        {/* Filter bar */}
        <div style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.1)', borderRadius: 12, backdropFilter: 'blur(12px)', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
            <i className="ri-search-line" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontSize: 14 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isAr ? 'بحث عن رحلة، خط جوي...' : 'Search flight, airline, route…'}
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#E5E7EB', fontSize: 13, padding: '7px 10px 7px 32px', outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' }}
            />
          </div>

          {/* Risk filter chips */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ color: '#6B7280', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>RISK:</span>
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(r => {
              const active = riskFilter === r;
              const color = r === 'ALL' ? C.gold : RISK_COLOR[r as RiskLevel];
              return (
                <button key={r} type="button" onClick={() => setRiskFilter(r)}
                  style={{ background: active ? `${color}22` : 'transparent', border: `1px solid ${active ? color : 'rgba(255,255,255,0.08)'}`, borderRadius: 6, color: active ? color : '#9CA3AF', padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontWeight: active ? 700 : 400, transition: 'all 0.15s' }}>
                  {r}
                </button>
              );
            })}
          </div>

          {/* Status filter chips */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ color: '#6B7280', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>STATUS:</span>
            {(['ALL', 'BOARDING', 'IN_FLIGHT', 'ARRIVED', 'DELAYED'] as const).map(st => {
              const active = statusFilter === st;
              const color = st === 'ALL' ? C.gold : STATUS_COLOR[st as ServiceStatus];
              return (
                <button key={st} type="button" onClick={() => setStatusFilter(st)}
                  style={{ background: active ? `${color}22` : 'transparent', border: `1px solid ${active ? color : 'rgba(255,255,255,0.08)'}`, borderRadius: 6, color: active ? color : '#9CA3AF', padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontWeight: active ? 700 : 400, transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                  {st.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main layout */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {/* Table */}
          <div style={{ flex: 1, background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.1)', borderRadius: 16, backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(184,138,60,0.06)', borderBottom: '1px solid rgba(184,138,60,0.1)' }}>
                    {['Flight', 'Route', 'Airline', 'Status', 'ETD / ETA', 'Pax', 'Hits', 'Risk', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#9CA3AF', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((svc, idx) => {
                    const isSelected = selectedService?.id === svc.id;
                    return (
                      <tr key={svc.id}
                        onClick={() => setSelectedService(isSelected ? null : svc)}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', background: isSelected ? 'rgba(184,138,60,0.06)' : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', transition: 'background 0.12s' }}
                        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.03)'; }}
                        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'; }}
                      >
                        <td style={{ padding: '10px 14px', color: C.gold, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13 }}>{svc.flight}</td>
                        <td style={{ padding: '10px 14px', color: '#E5E7EB', fontFamily: "'JetBrains Mono', monospace', fontSize: 12" }}>
                          <span>{svc.from}</span>
                          <span style={{ color: '#4B5563', margin: '0 6px' }}>→</span>
                          <span>{svc.to}</span>
                        </td>
                        <td style={{ padding: '10px 14px', color: '#D1D5DB' }}>{svc.airline}</td>
                        <td style={{ padding: '10px 14px' }}><StatusBadge status={svc.status} /></td>
                        <td style={{ padding: '10px 14px', color: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, whiteSpace: 'nowrap' }}>
                          <span style={{ color: '#6B7280', fontSize: 10 }}>ETD</span> {svc.etd}
                          <span style={{ color: '#374151', margin: '0 6px' }}>·</span>
                          <span style={{ color: '#6B7280', fontSize: 10 }}>ETA</span> {svc.eta}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#E5E7EB', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{svc.pax}</td>
                        <td style={{ padding: '10px 14px' }}>
                          {svc.hits > 0
                            ? <span style={{ color: C.critical, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{svc.hits}</span>
                            : <span style={{ color: '#374151', fontFamily: "'JetBrains Mono', monospace" }}>—</span>
                          }
                        </td>
                        <td style={{ padding: '10px 14px' }}><RiskBadge level={svc.risk} /></td>
                        <td style={{ padding: '10px 14px' }}>
                          <button type="button"
                            onClick={e => { e.stopPropagation(); setSelectedService(isSelected ? null : svc); }}
                            style={{ background: 'rgba(184,138,60,0.1)', border: '1px solid rgba(184,138,60,0.2)', borderRadius: 6, color: C.gold, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" }}>
                            {isSelected ? 'Close' : 'Detail'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: '#4B5563', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                        No services match current filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side detail panel */}
          {selectedService && (
            <div style={{ width: 400, flexShrink: 0, background: 'rgba(10,37,64,0.9)', border: '1px solid rgba(184,138,60,0.15)', borderRadius: 16, backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
              {/* Panel header */}
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(184,138,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: C.gold, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 18 }}>{selectedService.flight}</span>
                    <StatusBadge status={selectedService.status} />
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: 12, fontFamily: "'Inter', sans-serif" }}>
                    {selectedService.airline} · {selectedService.from} → {selectedService.to}
                  </div>
                </div>
                <button type="button" onClick={() => setSelectedService(null)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#9CA3AF', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                  <i className="ri-close-line" />
                </button>
              </div>

              {/* Flight info */}
              <div style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, borderBottom: '1px solid rgba(184,138,60,0.06)' }}>
                {[
                  { label: 'ETD', value: selectedService.etd },
                  { label: 'ETA', value: selectedService.eta },
                  { label: 'PAX', value: selectedService.pax },
                  { label: 'RISK', value: <RiskBadge level={selectedService.risk} /> },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ color: '#6B7280', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ color: '#E5E7EB', fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600 }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Manifest table */}
              <div style={{ padding: '1rem 1.25rem' }}>
                <div style={{ color: '#9CA3AF', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Sample Manifest · {selectedService.hits} Hit{selectedService.hits !== 1 ? 's' : ''}
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(184,138,60,0.08)' }}>
                        {['Name', 'Nat.', 'Seat', 'Risk', 'Hit'].map(h => (
                          <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: '#4B5563', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MANIFEST_SAMPLE.map((p, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '7px 8px', color: '#D1D5DB', fontFamily: "'Inter', sans-serif" }}>{p.name}</td>
                          <td style={{ padding: '7px 8px', color: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{p.nationality}</td>
                          <td style={{ padding: '7px 8px', color: '#6B7280', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{p.seat}</td>
                          <td style={{ padding: '7px 8px' }}><RiskBadge level={p.risk} /></td>
                          <td style={{ padding: '7px 8px' }}>
                            {p.hit
                              ? <span style={{ color: C.critical, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700 }}>● HIT</span>
                              : <span style={{ color: '#374151', fontSize: 10 }}>—</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/dashboard/search')}
                  style={{ marginTop: 16, width: '100%', background: 'rgba(184,138,60,0.1)', border: '1px solid rgba(184,138,60,0.25)', borderRadius: 8, color: C.gold, padding: '9px', fontSize: 13, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, letterSpacing: '0.05em', transition: 'background 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(184,138,60,0.18)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(184,138,60,0.1)'; }}
                >
                  <i className="ri-search-line" style={{ marginRight: 8 }} />
                  {isAr ? 'عرض البيان الكامل' : 'View Full Manifest'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesDashboardPage;
