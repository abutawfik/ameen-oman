import { useState } from 'react';
import type { ServiceSearchResult } from '@/mocks/searchData';
import { MOCK_SERVICE_RESULTS } from '@/mocks/searchData';
import ServiceManifest from './ServiceManifest';

interface Props { isAr: boolean }

const STATUS_COLORS: Record<string, string> = {
  scheduled: '#4A7AA8', departed: '#D4922A', arrived: '#4A8E5A', cancelled: '#C94A5E',
};

const STATUS_LABELS: Record<string, { en: string; ar: string }> = {
  scheduled: { en: 'Scheduled', ar: 'مجدول'  },
  departed:  { en: 'Departed',  ar: 'غادر'   },
  arrived:   { en: 'Arrived',   ar: 'وصل'    },
  cancelled: { en: 'Cancelled', ar: 'ملغى'   },
};

export default function ServiceSearch({ isAr }: Props) {
  const [flightQuery, setFlightQuery] = useState('');
  const [originQuery, setOriginQuery] = useState('');
  const [destQuery, setDestQuery]     = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [expandedId, setExpandedId]   = useState<string | null>(null);

  const filtered = MOCK_SERVICE_RESULTS.filter(s => {
    if (flightQuery && !s.flightNo.toLowerCase().includes(flightQuery.toLowerCase())) return false;
    if (originQuery && !s.origin.toLowerCase().includes(originQuery.toLowerCase())) return false;
    if (destQuery && !s.destination.toLowerCase().includes(destQuery.toLowerCase())) return false;
    if (statusFilter && s.status !== statusFilter) return false;
    return true;
  });

  const inputStyle: React.CSSProperties = {
    padding: '8px 10px', borderRadius: 4, fontSize: 12,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,138,60,0.2)',
    color: '#CBD5E1', fontFamily: "'JetBrains Mono', monospace", outline: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Filter bar */}
      <div style={{ padding: 16, borderBottom: '1px solid rgba(184,138,60,0.08)', background: 'rgba(5,20,40,0.4)' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 120 }}>
            <label style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {isAr ? 'رقم الرحلة' : 'Flight No'}
            </label>
            <input value={flightQuery} onChange={e => setFlightQuery(e.target.value)} placeholder="EK865…" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 80 }}>
            <label style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {isAr ? 'المنشأ' : 'Origin'}
            </label>
            <input value={originQuery} onChange={e => setOriginQuery(e.target.value)} placeholder="DXB…" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 80 }}>
            <label style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {isAr ? 'الوجهة' : 'Destination'}
            </label>
            <input value={destQuery} onChange={e => setDestQuery(e.target.value)} placeholder="MCT…" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 120 }}>
            <label style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {isAr ? 'الحالة' : 'Status'}
            </label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={inputStyle}>
              <option value="">{isAr ? 'الكل' : 'All'}</option>
              {(['scheduled', 'departed', 'arrived', 'cancelled'] as const).map(s => (
                <option key={s} value={s}>{isAr ? STATUS_LABELS[s].ar : STATUS_LABELS[s].en}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
          {filtered.length} {isAr ? 'خدمة' : 'services'}
        </div>
      </div>

      {/* Service cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(svc => {
          const isExpanded = expandedId === svc.id;
          const statusColor = STATUS_COLORS[svc.status] ?? '#5B7494';
          return (
            <div key={svc.id} style={{ borderRadius: 8, border: `1px solid ${svc.hitCount > 0 ? 'rgba(201,74,94,0.25)' : 'rgba(184,138,60,0.12)'}`, background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}>
              {/* Card header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : svc.id)}
                style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}
              >
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  {/* Airline code badge */}
                  <div style={{ width: 36, height: 36, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(184,138,60,0.12)', border: '1px solid rgba(184,138,60,0.2)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#D6B47E', fontWeight: 700, flexShrink: 0 }}>
                    {svc.airlineCode}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, color: '#CBD5E1', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                      {svc.flightNo}
                      <span style={{ marginLeft: 10, fontSize: 12, color: '#5B7494', fontWeight: 400 }}>{svc.airline}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace', marginTop: 2" }}>
                      {svc.origin} → {svc.destination}
                      <span style={{ marginLeft: 12, color: '#374B61' }}>{svc.arrivalDate?.slice(0, 10)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 8, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
                    <span style={{ color: '#5B7494' }}>
                      <i className="ri-group-line" style={{ marginRight: 4 }} />{svc.paxCount}
                    </span>
                    {svc.hitCount > 0 && (
                      <span style={{ color: '#C94A5E' }}>
                        <i className="ri-alarm-warning-fill" style={{ marginRight: 4 }} />{svc.hitCount}
                      </span>
                    )}
                    {svc.highRiskCount > 0 && (
                      <span style={{ color: '#D4922A' }}>
                        <i className="ri-alert-fill" style={{ marginRight: 4 }} />{svc.highRiskCount}
                      </span>
                    )}
                  </div>
                  {/* Status badge */}
                  <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}44` }}>
                    {isAr ? STATUS_LABELS[svc.status].ar : STATUS_LABELS[svc.status].en}
                  </span>
                  {/* Expand icon */}
                  <i className={isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} style={{ color: '#5B7494', fontSize: 16 }} />
                </div>
              </div>

              {/* Manifest panel */}
              {isExpanded && <ServiceManifest flightNo={svc.flightNo} isAr={isAr} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
