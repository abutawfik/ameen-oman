import { useState } from 'react';
import type { HitStatus, RiskLevel } from '@/mocks/searchData';
import { MOCK_HIT_RESULTS } from '@/mocks/searchData';
import HitCard from './HitCard';

interface Props { isAr: boolean }

const ALL_STATUSES: HitStatus[] = ['NEW', 'ACKNOWLEDGED', 'UNDER_REVIEW', 'RESOLVED', 'FALSE_POSITIVE'];
const STATUS_LABELS: Record<HitStatus, { en: string; ar: string }> = {
  NEW:           { en: 'New',            ar: 'جديد'         },
  ACKNOWLEDGED:  { en: 'Acknowledged',   ar: 'مُعترف به'    },
  UNDER_REVIEW:  { en: 'Under Review',   ar: 'قيد المراجعة' },
  RESOLVED:      { en: 'Resolved',       ar: 'تم الحل'      },
  FALSE_POSITIVE:{ en: 'False Positive', ar: 'إيجابية خاطئة'},
};

export default function HitSearch({ isAr }: Props) {
  const [hits, setHits]               = useState(MOCK_HIT_RESULTS);
  const [filterStatus, setFilterStatus] = useState<HitStatus[]>([]);
  const [filterRisk, setFilterRisk]   = useState<RiskLevel | ''>('');
  const [nameQuery, setNameQuery]     = useState('');

  const filtered = hits.filter(h => {
    if (filterStatus.length > 0 && !filterStatus.includes(h.hitStatus)) return false;
    if (filterRisk && h.riskLevel !== filterRisk) return false;
    if (nameQuery && !h.travelerName.toLowerCase().includes(nameQuery.toLowerCase()) && !h.travelerNameAr.includes(nameQuery)) return false;
    return true;
  });

  const toggleStatus = (s: HitStatus) =>
    setFilterStatus(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleStatusChange = (id: string, status: HitStatus, _comment?: string) => {
    setHits(prev => prev.map(h => h.id === id ? { ...h, hitStatus: status } : h));
  };

  const chipStyle = (active: boolean, color: string) => ({
    padding: '4px 10px', borderRadius: 4, fontSize: 10, cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em',
    background: active ? `${color}20` : 'transparent',
    border: `1px solid ${active ? color : 'rgba(184,138,60,0.15)'}`,
    color: active ? color : '#5B7494',
  });

  const STATUS_COLORS: Record<HitStatus, string> = {
    NEW: '#C94A5E', ACKNOWLEDGED: '#D4922A', UNDER_REVIEW: '#4A7AA8', RESOLVED: '#4A8E5A', FALSE_POSITIVE: '#5B7494',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Filter bar */}
      <div style={{ padding: 16, borderBottom: '1px solid rgba(184,138,60,0.08)', background: 'rgba(5,20,40,0.4)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Name filter */}
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <i className="ri-search-line" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#5B7494', fontSize: 14, pointerEvents: 'none' }} />
          <input
            value={nameQuery}
            onChange={e => setNameQuery(e.target.value)}
            placeholder={isAr ? 'تصفية بالاسم…' : 'Filter by name…'}
            style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: 4, fontSize: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,138,60,0.2)', color: '#CBD5E1', fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Status chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", marginRight: 4 }}>
            {isAr ? 'الحالة:' : 'Status:'}
          </span>
          {ALL_STATUSES.map(s => (
            <button key={s} onClick={() => toggleStatus(s)} style={chipStyle(filterStatus.includes(s), STATUS_COLORS[s])}>
              {isAr ? STATUS_LABELS[s].ar : STATUS_LABELS[s].en}
            </button>
          ))}
        </div>

        {/* Risk level */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", marginRight: 4 }}>
            {isAr ? 'المخاطر:' : 'Risk:'}
          </span>
          {(['critical', 'high', 'medium', 'low'] as RiskLevel[]).map(r => {
            const colors: Record<string, string> = { critical: '#C94A5E', high: '#D4922A', medium: '#D6B47E', low: '#4A8E5A' };
            return <button key={r} onClick={() => setFilterRisk(prev => prev === r ? '' : r)} style={chipStyle(filterRisk === r, colors[r])}>{r}</button>;
          })}
        </div>

        <div style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
          {filtered.length} {isAr ? 'تطابق' : 'hits'} {filtered.length !== hits.length ? `(of ${hits.length})` : ''}
        </div>
      </div>

      {/* Hit cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#374B61', fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
            {isAr ? 'لا توجد تطابقات بهذه المعايير' : 'No hits match the current filters'}
          </div>
        ) : (
          filtered.map(h => <HitCard key={h.id} hit={h} isAr={isAr} onStatusChange={handleStatusChange} />)
        )}
      </div>
    </div>
  );
}
