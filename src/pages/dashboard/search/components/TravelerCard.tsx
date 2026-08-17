import type { SearchResult } from '@/mocks/searchData';

interface Props {
  result: SearchResult;
  isAr: boolean;
  onClick?: () => void;
}

const RISK_COLORS: Record<string, string> = {
  critical: '#C94A5E', high: '#D4922A', medium: '#D6B47E', low: '#4A8E5A',
};

const MATCH_COLORS: Record<string, string> = {
  EXACT: '#4A8E5A', PHONETIC: '#D4922A', WILDCARD: '#4A7AA8', FUZZY: '#A78BFA',
};

export default function TravelerCard({ result, isAr, onClick }: Props) {
  const riskColor = RISK_COLORS[result.riskLevel] ?? '#5B7494';

  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${result.riskLevel === 'critical' ? 'rgba(201,74,94,0.35)' : result.riskLevel === 'high' ? 'rgba(212,146,42,0.25)' : 'rgba(184,138,60,0.12)'}`,
        borderRadius: 8, padding: 16, cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 14, color: '#CBD5E1', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
            {isAr ? result.nameAr : result.name}
          </div>
          <div style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
            {result.docType} · {result.docNumber} · {isAr ? result.nationality : result.nationality}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {/* Risk score */}
          <div style={{
            padding: '3px 10px', borderRadius: 4, fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
            background: `${riskColor}22`, border: `1px solid ${riskColor}55`, color: riskColor,
          }}>
            {result.riskScore}
          </div>
          {/* Match type */}
          <div style={{
            padding: '2px 6px', borderRadius: 3, fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
            background: `${MATCH_COLORS[result.matchType] ?? '#5B7494'}18`,
            color: MATCH_COLORS[result.matchType] ?? '#5B7494',
          }}>
            {result.matchType}
          </div>
        </div>
      </div>

      {/* Journey mini-timeline */}
      {result.journey && result.journey.length > 0 && (
        <div style={{ marginBottom: 10, padding: 8, borderRadius: 4, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(184,138,60,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>
            {result.journey.map((leg, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {idx === 0 && (
                  <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#5B7494' }}>{leg.fromCode}</span>
                )}
                <span style={{ margin: '0 4px', color: leg.isCurrent ? '#B8893C' : '#374B61', fontSize: 11 }}>→</span>
                <span style={{
                  fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                  color: leg.isCurrent ? '#D6B47E' : '#5B7494',
                  fontWeight: leg.isCurrent ? 600 : 400,
                }}>
                  {leg.toCode}
                </span>
                {leg.isCurrent && (
                  <span style={{ marginLeft: 4, fontSize: 10, color: '#B8893C' }}>({leg.flightNo})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row: dob / bags / contact icons / indicators */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
            <i className="ri-cake-line" style={{ marginRight: 4 }} />{result.dob}
          </span>

          {/* Bags */}
          {result.bags && result.bags.count > 0 && (
            <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
              <i className="ri-briefcase-2-line" style={{ marginRight: 4 }} />
              {result.bags.count} {isAr ? 'حقائب' : 'bags'} · {result.bags.weightKg}kg
            </span>
          )}

          {/* Contact icons */}
          {result.contact?.email && (
            <span title={result.contact.email} style={{ fontSize: 12, color: '#4A8E98', cursor: 'help' }}>
              <i className="ri-mail-line" />
            </span>
          )}
          {result.contact?.phone && (
            <span title={result.contact.phone} style={{ fontSize: 12, color: '#4A8E98', cursor: 'help' }}>
              <i className="ri-phone-line" />
            </span>
          )}
        </div>

        {/* Indicators */}
        {result.indicators && result.indicators.length > 0 && (
          <div style={{ display: 'flex', gap: 4 }}>
            {result.indicators.map(ind => (
              <span
                key={ind.type}
                title={isAr ? ind.labelAr : ind.label}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 22, height: 22, borderRadius: 4,
                  background: `${ind.color}22`, border: `1px solid ${ind.color}55`,
                }}
              >
                <i className={ind.icon} style={{ fontSize: 12, color: ind.color }} />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Hit count badge if > 0 */}
      {result.hitCount > 0 && (
        <div style={{ marginTop: 8, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#C94A5E' }}>
          <i className="ri-alarm-warning-fill" style={{ marginRight: 4 }} />
          {result.hitCount} {isAr ? 'تطابق' : result.hitCount === 1 ? 'hit' : 'hits'}
        </div>
      )}
    </div>
  );
}
