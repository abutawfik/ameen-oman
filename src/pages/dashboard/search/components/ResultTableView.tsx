import { useState } from 'react';
import type { SearchResult } from '@/mocks/searchData';

interface Props {
  results: SearchResult[];
  isAr: boolean;
}

type SortKey = 'name' | 'nationality' | 'riskScore' | 'relevanceScore' | 'eventDate' | 'hitCount';
type SortDir = 'asc' | 'desc';

const RISK_COLORS: Record<string, string> = {
  critical: '#C94A5E', high: '#D4922A', medium: '#D6B47E', low: '#4A8E5A',
};

const MATCH_COLORS: Record<string, string> = {
  EXACT: '#4A8E5A', PHONETIC: '#D4922A', WILDCARD: '#4A7AA8', FUZZY: '#A78BFA',
};

function exportCSV(results: SearchResult[]) {
  const headers = ['ID', 'Name', 'Nationality', 'DOB', 'Doc Number', 'Risk Score', 'Risk Level', 'Hit Count', 'Match Type', 'Relevance', 'Flight', 'Route', 'Event Date'];
  const rows = results.map(r => [
    r.id, r.name, r.nationality, r.dob, r.docNumber,
    r.riskScore, r.riskLevel, r.hitCount, r.matchType, r.relevanceScore,
    r.flight ?? '', r.route ?? '', r.eventDate,
  ]);
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'search-results.csv'; a.click();
  URL.revokeObjectURL(url);
}

const thStyle: React.CSSProperties = {
  padding: '8px 12px', textAlign: 'left', fontSize: 10,
  fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em',
  color: '#5B7494', textTransform: 'uppercase', cursor: 'pointer',
  borderBottom: '1px solid rgba(184,138,60,0.15)',
  whiteSpace: 'nowrap', userSelect: 'none',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 12px', fontSize: 12,
  fontFamily: "'Inter', sans-serif",
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  color: '#CBD5E1', verticalAlign: 'middle',
};

export default function ResultTableView({ results, isAr }: Props) {
  const [sortKey, setSortKey]   = useState<SortKey>('relevanceScore');
  const [sortDir, setSortDir]   = useState<SortDir>('desc');
  const [page, setPage]         = useState(0);
  const PAGE_SIZE = 10;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(0);
  };

  const sorted = [...results].sort((a, b) => {
    const va = a[sortKey] as string | number;
    const vb = b[sortKey] as string | number;
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const pageCount = Math.ceil(sorted.length / PAGE_SIZE);
  const pageData  = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return ' ⇅';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Export + count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid rgba(184,138,60,0.08)' }}>
        <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
          {results.length} {isAr ? 'نتيجة' : 'results'}
        </span>
        <button
          onClick={() => exportCSV(results)}
          style={{ padding: '4px 12px', borderRadius: 4, fontSize: 11, cursor: 'pointer', background: 'rgba(184,138,60,0.1)', border: '1px solid rgba(184,138,60,0.25)', color: '#B8893C', fontFamily: "'JetBrains Mono', monospace" }}
        >
          <i className="ri-download-2-line" style={{ marginRight: 5 }} />
          {isAr ? 'تصدير CSV' : 'Export CSV'}
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(5,20,40,0.6)' }}>
              <th style={thStyle} onClick={() => handleSort('name')}>
                {isAr ? 'الاسم' : 'Name'}{sortIcon('name')}
              </th>
              <th style={thStyle} onClick={() => handleSort('nationality')}>
                {isAr ? 'الجنسية' : 'Nationality'}{sortIcon('nationality')}
              </th>
              <th style={{ ...thStyle, fontFamily: "'JetBrains Mono', monospace" }}>
                {isAr ? 'الوثيقة' : 'Document'}
              </th>
              <th style={thStyle} onClick={() => handleSort('riskScore')}>
                {isAr ? 'المخاطر' : 'Risk'}{sortIcon('riskScore')}
              </th>
              <th style={thStyle} onClick={() => handleSort('hitCount')}>
                {isAr ? 'التطابقات' : 'Hits'}{sortIcon('hitCount')}
              </th>
              <th style={thStyle}>
                {isAr ? 'نوع التطابق' : 'Match'}
              </th>
              <th style={thStyle} onClick={() => handleSort('relevanceScore')}>
                {isAr ? 'الصلة' : 'Relevance'}{sortIcon('relevanceScore')}
              </th>
              <th style={thStyle}>
                {isAr ? 'الرحلة' : 'Flight'}
              </th>
              <th style={thStyle} onClick={() => handleSort('eventDate')}>
                {isAr ? 'التاريخ' : 'Date'}{sortIcon('eventDate')}
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData.map(r => {
              const riskColor = RISK_COLORS[r.riskLevel] ?? '#5B7494';
              return (
                <tr key={r.id} style={{ transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 500 }}>{isAr ? r.nameAr : r.name}</div>
                    <div style={{ fontSize: 10, color: '#5B7494', marginTop: 1 }}>{r.dob}</div>
                    {/* Contact icons */}
                    <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                      {r.contact?.email && <i className="ri-mail-line" style={{ color: '#4A8E98', fontSize: 11 }} title={r.contact.email} />}
                      {r.contact?.phone && <i className="ri-phone-line" style={{ color: '#4A8E98', fontSize: 11 }} title={r.contact.phone} />}
                      {/* Bags */}
                      {r.bags && r.bags.count > 0 && (
                        <span style={{ fontSize: 10, color: '#5B7494' }} title={`${r.bags.count} bags, ${r.bags.weightKg}kg`}>
                          <i className="ri-briefcase-2-line" /> {r.bags.count}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                    {r.nationalityCode}
                  </td>
                  <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                    <div>{r.docType}</div>
                    <div style={{ color: '#D6B47E' }}>{r.docNumber}</div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${riskColor}22`, border: `1px solid ${riskColor}44`, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: riskColor, fontWeight: 600 }}>
                        {r.riskScore}
                      </div>
                      <span style={{ fontSize: 10, color: riskColor, textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>{r.riskLevel}</span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    {r.hitCount > 0
                      ? <span style={{ color: '#C94A5E', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{r.hitCount}</span>
                      : <span style={{ color: '#374B61' }}>—</span>
                    }
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: `${MATCH_COLORS[r.matchType] ?? '#5B7494'}18`, color: MATCH_COLORS[r.matchType] ?? '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
                      {r.matchType}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#B8893C' }}>
                    {r.relevanceScore}%
                  </td>
                  <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                    <div>{r.flight ?? '—'}</div>
                    <div style={{ color: '#5B7494', fontSize: 10 }}>{r.route ?? ''}</div>
                  </td>
                  <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                    {r.eventDate}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '12px 0' }}>
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={{
                width: 28, height: 28, borderRadius: 4, fontSize: 12, cursor: 'pointer',
                background: page === i ? 'rgba(184,138,60,0.2)' : 'transparent',
                border: `1px solid ${page === i ? 'rgba(184,138,60,0.4)' : 'rgba(184,138,60,0.15)'}`,
                color: page === i ? '#D6B47E' : '#5B7494',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
