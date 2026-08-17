import type { ManifestPassenger, BoardingStatus } from '@/mocks/searchData';
import { MOCK_MANIFEST_EK865 } from '@/mocks/searchData';

interface Props {
  flightNo: string;
  isAr: boolean;
}

const BOARDING_CONFIG: Record<BoardingStatus, { icon: string; color: string; labelEn: string; labelAr: string }> = {
  boarded:    { icon: 'ri-flight-takeoff-line', color: '#4A7AA8', labelEn: 'Boarded',     labelAr: 'صعد الطائرة' },
  no_show:    { icon: 'ri-plane-fill',          color: '#C94A5E', labelEn: 'No-Show',     labelAr: 'غياب'        },
  go_show:    { icon: 'ri-plane-line',          color: '#D4922A', labelEn: 'Go-Show',     labelAr: 'حجز مفاجئ'  },
  checked_in: { icon: 'ri-checkbox-circle-line',color: '#4A8E5A', labelEn: 'Checked In', labelAr: 'تسجيل وصول'  },
  pending:    { icon: 'ri-time-line',           color: '#5B7494', labelEn: 'Pending',     labelAr: 'معلق'        },
};

const RISK_COLORS: Record<string, string> = {
  critical: '#C94A5E', high: '#D4922A', medium: '#D6B47E', low: '#4A8E5A',
};

const thStyle: React.CSSProperties = {
  padding: '7px 10px', textAlign: 'left', fontSize: 10,
  fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.07em',
  color: '#5B7494', textTransform: 'uppercase',
  borderBottom: '1px solid rgba(184,138,60,0.12)', whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '9px 10px', fontSize: 11, color: '#CBD5E1',
  fontFamily: "'Inter', sans-serif",
  borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle',
};

export default function ServiceManifest({ flightNo, isAr }: Props) {
  // Real implementation would filter by flightNo — use EK865 data for all
  const pax: ManifestPassenger[] = MOCK_MANIFEST_EK865;

  const stats = {
    total:    pax.length,
    boarded:  pax.filter(p => p.boardingStatus === 'boarded').length,
    no_show:  pax.filter(p => p.boardingStatus === 'no_show').length,
    go_show:  pax.filter(p => p.boardingStatus === 'go_show').length,
    hits:     pax.filter(p => p.hitCount > 0).length,
  };

  return (
    <div style={{ padding: '12px 16px 16px', borderTop: '1px solid rgba(184,138,60,0.08)' }}>
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#B8893C', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {isAr ? `بيان الركاب — ${flightNo}` : `Manifest — ${flightNo}`}
        </span>
        <div style={{ display: 'flex', gap: 12, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#5B7494' }}>
          <span><i className="ri-group-line" style={{ marginRight: 4 }} />{stats.total}</span>
          <span style={{ color: '#4A7AA8' }}><i className="ri-flight-takeoff-line" style={{ marginRight: 3 }} />{stats.boarded}</span>
          <span style={{ color: '#C94A5E' }}><i className="ri-plane-fill" style={{ marginRight: 3 }} />{stats.no_show}</span>
          <span style={{ color: '#D4922A' }}><i className="ri-plane-line" style={{ marginRight: 3 }} />{stats.go_show}</span>
          {stats.hits > 0 && <span style={{ color: '#C94A5E' }}><i className="ri-alarm-warning-fill" style={{ marginRight: 3 }} />{stats.hits} hits</span>}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(5,20,40,0.5)' }}>
              <th style={thStyle}>{isAr ? 'الاسم' : 'Name'}</th>
              <th style={thStyle}>{isAr ? 'الجنسية' : 'Nat'}</th>
              <th style={thStyle}>{isAr ? 'الوثيقة' : 'Document'}</th>
              <th style={thStyle}>{isAr ? 'المقعد' : 'Seat'}</th>
              <th style={thStyle}>{isAr ? 'المخاطر' : 'Risk'}</th>
              <th style={thStyle}>{isAr ? 'حالة الصعود' : 'Boarding'}</th>
              <th style={thStyle}>{isAr ? 'التواصل' : 'Contact'}</th>
            </tr>
          </thead>
          <tbody>
            {pax.map(p => {
              const boarding = BOARDING_CONFIG[p.boardingStatus];
              const riskColor = RISK_COLORS[p.riskLevel] ?? '#5B7494';
              return (
                <tr key={p.id}
                  style={{ transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 500, fontSize: 12 }}>{p.name}</div>
                    {p.hitCount > 0 && <span style={{ fontSize: 10, color: '#C94A5E', fontFamily: "'JetBrains Mono', monospace" }}>⚠ {p.hitCount} hit{p.hitCount > 1 ? 's' : ''}</span>}
                  </td>
                  <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono', monospace" }}>{p.nationality}</td>
                  <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono', monospace", color: '#D6B47E' }}>{p.docNumber}</td>
                  <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono', monospace" }}>{p.seatNo}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: '2px 7px', borderRadius: 3, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", background: `${riskColor}20`, color: riskColor, border: `1px solid ${riskColor}44` }}>
                      {p.riskScore}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span title={isAr ? boarding.labelAr : boarding.labelEn} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: boarding.color }}>
                      <i className={boarding.icon} />
                      {isAr ? boarding.labelAr : boarding.labelEn}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {p.contact?.email && <i className="ri-mail-line" style={{ color: '#4A8E98', fontSize: 12 }} title={p.contact.email} />}
                      {p.contact?.phone && <i className="ri-phone-line" style={{ color: '#4A8E98', fontSize: 12 }} title={p.contact.phone} />}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
