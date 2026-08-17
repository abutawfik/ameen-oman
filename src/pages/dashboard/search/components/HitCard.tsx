import { useState } from 'react';
import type { HitSearchResult, HitStatus } from '@/mocks/searchData';
import { HIT_COMMENT_PRESETS } from '@/mocks/searchData';

interface Props {
  hit: HitSearchResult;
  isAr: boolean;
  onStatusChange: (id: string, status: HitStatus, comment?: string) => void;
}

const RISK_COLORS: Record<string, string> = {
  critical: '#C94A5E', high: '#D4922A', medium: '#D6B47E', low: '#4A8E5A',
};

const STATUS_COLORS: Record<HitStatus, string> = {
  NEW: '#C94A5E', ACKNOWLEDGED: '#D4922A', UNDER_REVIEW: '#4A7AA8',
  RESOLVED: '#4A8E5A', FALSE_POSITIVE: '#5B7494',
};

const STATUS_LABELS: Record<HitStatus, { en: string; ar: string }> = {
  NEW:           { en: 'New',            ar: 'جديد'               },
  ACKNOWLEDGED:  { en: 'Acknowledged',   ar: 'مُعترف به'          },
  UNDER_REVIEW:  { en: 'Under Review',   ar: 'قيد المراجعة'       },
  RESOLVED:      { en: 'Resolved',       ar: 'تم الحل'            },
  FALSE_POSITIVE:{ en: 'False Positive', ar: 'إيجابية خاطئة'      },
};

// Status flow: only show allowed next steps
const NEXT_STEPS: Record<HitStatus, HitStatus[]> = {
  NEW:           ['ACKNOWLEDGED'],
  ACKNOWLEDGED:  ['UNDER_REVIEW', 'FALSE_POSITIVE'],
  UNDER_REVIEW:  ['RESOLVED', 'FALSE_POSITIVE'],
  RESOLVED:      [],
  FALSE_POSITIVE:[],
};

export default function HitCard({ hit, isAr, onStatusChange }: Props) {
  const [expanded, setExpanded]   = useState(false);
  const [preset, setPreset]       = useState<string>(hit.comment ?? '');
  const [freeText, setFreeText]   = useState('');
  const [localStatus, setStatus]  = useState<HitStatus>(hit.hitStatus);

  const riskColor   = RISK_COLORS[hit.riskLevel]  ?? '#5B7494';
  const statusColor = STATUS_COLORS[localStatus];
  const nextSteps   = NEXT_STEPS[localStatus];

  const applyStatus = (next: HitStatus) => {
    setStatus(next);
    onStatusChange(hit.id, next, preset || freeText || undefined);
  };

  return (
    <div style={{
      borderRadius: 8, padding: 16,
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${localStatus === 'NEW' ? 'rgba(201,74,94,0.35)' : 'rgba(184,138,60,0.12)'}`,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 14, color: '#CBD5E1', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
            {isAr ? hit.travelerNameAr : hit.travelerName}
          </div>
          <div style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
            {hit.nationality} · {hit.docNumber}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {/* Risk chip */}
          <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", background: `${riskColor}22`, color: riskColor, border: `1px solid ${riskColor}44` }}>
            {hit.riskLevel.toUpperCase()}
          </span>
          {/* Status badge */}
          <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44` }}>
            {isAr ? STATUS_LABELS[localStatus].ar : STATUS_LABELS[localStatus].en}
          </span>
        </div>
      </div>

      {/* Watchlist + match reason */}
      <div style={{ marginBottom: 8, fontSize: 12, color: '#8FA8C0', fontFamily: "'Inter', sans-serif" }}>
        <i className="ri-shield-check-line" style={{ marginRight: 5, color: '#B8893C' }} />
        <strong style={{ color: '#B8893C' }}>{hit.watchlistName}</strong>
      </div>
      <div style={{ fontSize: 11, color: '#5B7494', fontFamily: "'Inter', sans-serif", marginBottom: 10, lineHeight: 1.5 }}>
        {hit.matchReason}
      </div>

      {/* Flight info */}
      <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", marginBottom: 10 }}>
        <span><i className="ri-flight-takeoff-line" style={{ marginRight: 4 }} />{hit.flight}</span>
        <span>{hit.route}</span>
        <span><i className="ri-calendar-line" style={{ marginRight: 4 }} />{hit.arrivalDate}</span>
      </div>

      {/* Existing notes */}
      {hit.notes && (
        <div style={{ fontSize: 11, color: '#5B7494', fontFamily: "'Inter', sans-serif", padding: '6px 10px', borderRadius: 4, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(184,138,60,0.08)', marginBottom: 10 }}>
          {hit.notes}
        </div>
      )}

      {/* Quick ACK button (one click for new hits) */}
      {localStatus === 'NEW' && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <button
            onClick={() => applyStatus('ACKNOWLEDGED')}
            style={{ padding: '6px 16px', borderRadius: 4, fontSize: 12, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(212,146,42,0.15)', border: '1px solid rgba(212,146,42,0.35)', color: '#D4922A' }}
          >
            <i className="ri-check-line" style={{ marginRight: 5 }} />
            {isAr ? 'اعتراف سريع' : 'Acknowledge'}
          </button>
          <button
            onClick={() => setExpanded(e => !e)}
            style={{ padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(184,138,60,0.2)', color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}
          >
            <i className={expanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} />
          </button>
        </div>
      )}

      {/* Expand panel for status transitions + comments */}
      {(expanded || localStatus !== 'NEW') && nextSteps.length > 0 && (
        <div style={{ marginTop: 8, padding: 12, borderRadius: 6, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(184,138,60,0.1)' }}>
          {/* Comment dropdown */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", marginBottom: 5 }}>
              {isAr ? 'سبب الإجراء:' : 'Action reason:'}
            </label>
            <select
              value={preset}
              onChange={e => setPreset(e.target.value)}
              style={{ width: '100%', padding: '6px 10px', borderRadius: 4, fontSize: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,138,60,0.2)', color: '#CBD5E1', fontFamily: "'Inter', sans-serif", outline: 'none' }}
            >
              <option value="">{isAr ? '— اختر سبباً —' : '— Select reason —'}</option>
              {HIT_COMMENT_PRESETS.map(p => (
                <option key={p.value} value={p.value}>{isAr ? p.labelAr : p.labelEn}</option>
              ))}
            </select>
          </div>

          {preset === 'custom' && (
            <textarea
              value={freeText}
              onChange={e => setFreeText(e.target.value)}
              rows={2}
              placeholder={isAr ? 'تفاصيل إضافية…' : 'Additional details…'}
              style={{ width: '100%', padding: '6px 10px', borderRadius: 4, fontSize: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,138,60,0.2)', color: '#CBD5E1', fontFamily: "'Inter', sans-serif", outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 10 }}
            />
          )}

          {/* Status transition buttons */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {nextSteps.map(s => (
              <button
                key={s}
                onClick={() => applyStatus(s)}
                style={{ padding: '5px 14px', borderRadius: 4, fontSize: 11, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", background: `${STATUS_COLORS[s]}18`, border: `1px solid ${STATUS_COLORS[s]}44`, color: STATUS_COLORS[s] }}
              >
                {isAr ? STATUS_LABELS[s].ar : STATUS_LABELS[s].en}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
