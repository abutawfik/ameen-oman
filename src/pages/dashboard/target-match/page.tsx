import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '../DashboardLayout';

const C = {
  bg:       'var(--alm-ocean-800)',
  p1:       'var(--alm-ocean-700)',
  p2:       'var(--alm-ocean-600)',
  p3:       'var(--alm-ocean-500)',
  p4:       'var(--alm-ocean-400)',
  gold:     '#D6B47E',
  gold2:    '#B8893C',
  critical: '#C94A5E',
  high:     '#D4922A',
  medium:   '#D6B47E',
  low:      '#4A8E5A',
} as const;

const MONO = "'JetBrains Mono', monospace";

// ── Types ──────────────────────────────────────────────────────────────────────

type HitStatus = 'PENDING' | 'CONFIRMED' | 'FALSE_POSITIVE' | 'ESCALATED' | 'DEFERRED';
type RiskLevel  = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
type FilterTab  = 'ALL' | HitStatus;

interface MatchFactor {
  label:  string;
  score:  number;   // 0–100
}

interface TravelHit {
  id:           string;
  status:       HitStatus;
  confidence:   number;   // 0–1
  riskLevel:    RiskLevel;
  matchedMinsAgo: number;
  flight:       string;
  fromCode:     string;
  toCode:       string;
  eta:          string;
  seat:         string;

  // Target (watchlist record)
  targetId:     string;
  targetName:   string;
  watchlistSrc: string;
  targetNat:    string;
  targetDOB:    string;
  targetDoc:    string;
  targetRisk:   string;

  // Incoming traveler
  travelerName: string;
  travelerNat:  string;
  travelerDOB:  string;
  travelerDoc:  string;

  factors:      MatchFactor[];
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const HITS: TravelHit[] = [
  {
    id: 'TH-001', status: 'PENDING', confidence: 0.91, riskLevel: 'CRITICAL',
    matchedMinsAgo: 8, flight: 'WY456', fromCode: 'AMM', toCode: 'MCT',
    eta: '14:35', seat: '22A',
    targetId:    'WL-8841',
    targetName:  'Ahmad Khalil',
    watchlistSrc: 'INTERPOL Red',
    targetNat:   'JOR', targetDOB: '1981-03-15', targetDoc: 'JO4492011',
    targetRisk:  'Terrorism financing, cross-border funds movement',
    travelerName: 'Ahmed Khaleel',
    travelerNat:  'SYR', travelerDOB: '1981-03-15', travelerDoc: 'SY7721039',
    factors: [
      { label: 'Name Similarity',       score: 94 },
      { label: 'Date of Birth',          score: 100 },
      { label: 'Nationality Proximity',  score: 72 },
      { label: 'Document Pattern',       score: 58 },
    ],
  },
  {
    id: 'TH-002', status: 'PENDING', confidence: 0.78, riskLevel: 'HIGH',
    matchedMinsAgo: 23, flight: 'WY102', fromCode: 'CAI', toCode: 'MCT',
    eta: '16:50', seat: '14C',
    targetId:    'WL-3312',
    targetName:  'Fatima Al-Rashidi',
    watchlistSrc: 'UN Consolidated',
    targetNat:   'EGY', targetDOB: '1975-11-02', targetDoc: 'EG8812445',
    targetRisk:  'Sanctions evasion, smuggling network',
    travelerName: 'Fatimah Rashidy',
    travelerNat:  'TUN', travelerDOB: '1975-11-07', travelerDoc: 'TU5591223',
    factors: [
      { label: 'Name Similarity',       score: 82 },
      { label: 'Date of Birth',          score: 75 },
      { label: 'Nationality Proximity',  score: 55 },
      { label: 'Document Pattern',       score: 40 },
    ],
  },
  {
    id: 'TH-003', status: 'CONFIRMED', confidence: 0.95, riskLevel: 'CRITICAL',
    matchedMinsAgo: 91, flight: 'EK208', fromCode: 'DXB', toCode: 'MCT',
    eta: '11:20', seat: '5F',
    targetId:    'WL-0019',
    targetName:  'Hassan Al-Mukhtar',
    watchlistSrc: 'MOI Priority',
    targetNat:   'IRQ', targetDOB: '1969-07-30', targetDoc: 'IQ1100329',
    targetRisk:  'Arms trafficking, threat to national security',
    travelerName: 'Hassan Al Mukhtar',
    travelerNat:  'IRQ', travelerDOB: '1969-07-30', travelerDoc: 'IQ1100329',
    factors: [
      { label: 'Name Similarity',       score: 97 },
      { label: 'Date of Birth',          score: 100 },
      { label: 'Nationality Proximity',  score: 100 },
      { label: 'Document Pattern',       score: 100 },
    ],
  },
  {
    id: 'TH-004', status: 'PENDING', confidence: 0.65, riskLevel: 'MEDIUM',
    matchedMinsAgo: 4, flight: 'EK202', fromCode: 'DXB', toCode: 'MCT',
    eta: '15:10', seat: '31B',
    targetId:    'WL-5572',
    targetName:  'Mohammed Salim',
    watchlistSrc: 'GCC Watch',
    targetNat:   'BGD', targetDOB: '1988-04-20', targetDoc: 'BD3310822',
    targetRisk:  'Human trafficking intelligence',
    travelerName: 'Mohamed Salem',
    travelerNat:  'PAK', travelerDOB: '1987-09-11', travelerDoc: 'PK9934001',
    factors: [
      { label: 'Name Similarity',       score: 71 },
      { label: 'Date of Birth',          score: 42 },
      { label: 'Nationality Proximity',  score: 48 },
      { label: 'Document Pattern',       score: 30 },
    ],
  },
  {
    id: 'TH-005', status: 'ESCALATED', confidence: 0.82, riskLevel: 'HIGH',
    matchedMinsAgo: 55, flight: 'SV311', fromCode: 'RUH', toCode: 'MCT',
    eta: '13:45', seat: '8D',
    targetId:    'WL-6650',
    targetName:  'Yusuf Karimi',
    watchlistSrc: 'FATF Greylist',
    targetNat:   'IRN', targetDOB: '1984-02-28', targetDoc: 'IR5581204',
    targetRisk:  'Money laundering, illicit finance',
    travelerName: 'Yousef Karemy',
    travelerNat:  'AFG', travelerDOB: '1984-03-01', travelerDoc: 'AF7720193',
    factors: [
      { label: 'Name Similarity',       score: 88 },
      { label: 'Date of Birth',          score: 90 },
      { label: 'Nationality Proximity',  score: 60 },
      { label: 'Document Pattern',       score: 35 },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const RISK_COLOR: Record<RiskLevel, string> = {
  CRITICAL: C.critical,
  HIGH:     C.high,
  MEDIUM:   C.medium,
  LOW:      C.low,
};

const STATUS_COLOR: Record<HitStatus, string> = {
  PENDING:        C.high,
  CONFIRMED:      C.critical,
  FALSE_POSITIVE: C.p3,
  ESCALATED:      '#C94A5E',
  DEFERRED:       C.p3,
};

function ConfBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ flex: 1, height: 5, background: C.p2, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.4s' }} />
      </div>
      <span style={{ color: '#e8dcc8', fontSize: '0.72rem', fontFamily: MONO, minWidth: 30, textAlign: 'right' }}>
        {score}%
      </span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TargetMatchPage() {
  const { isAr } = useOutletContext<DashboardOutletContext>();

  const [hits, setHits]           = useState<TravelHit[]>(HITS);
  const [selected, setSelected]   = useState<TravelHit | null>(null);
  const [filter, setFilter]       = useState<FilterTab>('ALL');
  const [banner, setBanner]       = useState<{ id: string; type: 'confirmed' | 'dismissed' } | null>(null);

  const filtered = hits.filter(h => filter === 'ALL' || h.status === filter);

  const pending   = hits.filter(h => h.status === 'PENDING').length;
  const confirmed = hits.filter(h => h.status === 'CONFIRMED').length;
  const fp        = hits.filter(h => h.status === 'FALSE_POSITIVE').length;
  const escalated = hits.filter(h => h.status === 'ESCALATED').length;

  function applyAction(id: string, newStatus: HitStatus, bannerType: 'confirmed' | 'dismissed') {
    setHits(prev => prev.map(h => h.id === id ? { ...h, status: newStatus } : h));
    setSelected(prev => prev?.id === id ? { ...prev, status: newStatus } : prev);
    setBanner({ id, type: bannerType });
    setTimeout(() => setBanner(null), 3500);
  }

  const liveHit = selected ? (hits.find(h => h.id === selected.id) ?? selected) : null;

  // Stat card style
  const statCard = (label: string, value: number, color: string) => (
    <div key={label} style={{ background: C.p1, borderRadius: 8, padding: '0.75rem 1rem', border: `1px solid ${C.p2}`, minWidth: 110 }}>
      <div style={{ color, fontSize: '1.4rem', fontWeight: 700, fontFamily: MONO, lineHeight: 1 }}>{value}</div>
      <div style={{ color: C.p4, fontSize: '0.68rem', marginTop: '0.25rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );

  const CHIP = (active: boolean, color = C.gold): React.CSSProperties => ({
    padding: '0.22rem 0.65rem',
    borderRadius: 4,
    border: `1px solid ${active ? color : C.p2}`,
    background: active ? color + '20' : C.p2,
    color: active ? color : C.p4,
    fontSize: '0.7rem',
    fontFamily: MONO,
    cursor: 'pointer',
    letterSpacing: '0.06em',
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, color: '#e8dcc8', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ padding: '0.85rem 1.25rem', borderBottom: `1px solid ${C.p2}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ color: C.p4, fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: MONO, marginBottom: '0.15rem' }}>
              Ch 9.5.5 — Hit Confirmation
            </div>
            <h1 style={{ color: C.gold, margin: 0, fontSize: '1.05rem', fontFamily: MONO, letterSpacing: '0.04em' }}>
              Target Match Review
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {statCard('Pending', pending, C.high)}
            {statCard('Confirmed', confirmed, C.critical)}
            {statCard('False Pos', fp, C.p3)}
            {statCard('Escalated', escalated, '#C94A5E')}
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {(['ALL', 'PENDING', 'CONFIRMED', 'FALSE_POSITIVE', 'ESCALATED'] as FilterTab[]).map(f => (
            <button key={f} style={CHIP(filter === f)} onClick={() => setFilter(filter === f && f !== 'ALL' ? 'ALL' : f)}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Body: left queue + right detail */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left queue */}
        <div style={{ width: 320, borderRight: `1px solid ${C.p2}`, overflowY: 'auto', flexShrink: 0 }}>
          {filtered.map(h => {
            const isSelected = selected?.id === h.id;
            const rc = RISK_COLOR[h.riskLevel];
            const sc = STATUS_COLOR[h.status];
            return (
              <div
                key={h.id}
                onClick={() => setSelected(isSelected ? null : h)}
                style={{
                  padding: '0.85rem 1rem',
                  borderBottom: `1px solid ${C.p2}`,
                  cursor: 'pointer',
                  background: isSelected ? C.p2 + 'cc' : 'transparent',
                  borderLeft: isSelected ? `3px solid ${C.gold}` : '3px solid transparent',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#e8dcc8', fontWeight: 600, fontSize: '0.82rem', lineHeight: 1.3 }}>{h.targetName}</span>
                  <span style={{
                    padding: '0.1rem 0.4rem', borderRadius: 3,
                    background: rc + '22', color: rc,
                    fontSize: '0.6rem', fontFamily: MONO, flexShrink: 0, marginLeft: '0.5rem',
                  }}>
                    {h.riskLevel}
                  </span>
                </div>
                <div style={{ color: C.p4, fontSize: '0.72rem', marginBottom: '0.3rem' }}>
                  vs <span style={{ color: '#c8bcaa' }}>{h.travelerName}</span>
                </div>
                {/* Confidence bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                  <div style={{ flex: 1, height: 3, background: C.p2, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.round(h.confidence * 100)}%`, height: '100%', background: rc, borderRadius: 2 }} />
                  </div>
                  <span style={{ color: rc, fontSize: '0.7rem', fontFamily: MONO, minWidth: 28 }}>
                    {Math.round(h.confidence * 100)}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: C.p4, fontSize: '0.66rem', fontFamily: MONO }}>
                    {h.flight} · matched {h.matchedMinsAgo}m ago
                  </span>
                  <span style={{
                    padding: '0.1rem 0.35rem', borderRadius: 3,
                    background: sc + '20', color: sc,
                    fontSize: '0.6rem', fontFamily: MONO,
                  }}>
                    {h.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: C.p4, fontSize: '0.8rem' }}>
              No hits match this filter.
            </div>
          )}
        </div>

        {/* Right detail panel */}
        {liveHit ? (
          <DetailPanel
            hit={liveHit}
            banner={banner?.id === liveHit.id ? banner.type : null}
            onConfirm={id => applyAction(id, 'CONFIRMED', 'confirmed')}
            onFalsePositive={id => applyAction(id, 'FALSE_POSITIVE', 'dismissed')}
            onEscalate={id => applyAction(id, 'ESCALATED', 'dismissed')}
            onDefer={id => applyAction(id, 'DEFERRED', 'dismissed')}
            isAr={isAr}
          />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.75rem', color: C.p4 }}>
            <i className="ri-shield-cross-line" style={{ fontSize: '3rem', color: C.p3 }} />
            <p style={{ fontSize: '0.9rem', margin: 0 }}>Select a match to review</p>
            <p style={{ fontSize: '0.78rem', margin: 0 }}>{pending} pending hit{pending !== 1 ? 's' : ''} awaiting confirmation</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

interface DetailPanelProps {
  hit:             TravelHit;
  banner:          'confirmed' | 'dismissed' | null;
  onConfirm:       (id: string) => void;
  onFalsePositive: (id: string) => void;
  onEscalate:      (id: string) => void;
  onDefer:         (id: string) => void;
  isAr:            boolean;
}

function DetailPanel({ hit, banner, onConfirm, onFalsePositive, onEscalate, onDefer }: DetailPanelProps) {
  const rc = RISK_COLOR[hit.riskLevel];

  const row = (label: string, value: string, valueColor = '#e8dcc8') => (
    <div key={label} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
      <span style={{ color: C.p4, fontSize: '0.72rem', fontFamily: MONO, minWidth: 100 }}>{label}</span>
      <span style={{ color: valueColor, fontSize: '0.82rem', fontFamily: MONO }}>{value}</span>
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Status banner */}
      {banner === 'confirmed' && (
        <div style={{ background: '#4A8E5A22', border: '1px solid #4A8E5A55', borderRadius: 7, padding: '0.75rem 1rem', color: '#4A8E5A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="ri-checkbox-circle-fill" style={{ fontSize: '1.1rem' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Match confirmed. Alert dispatched to border officer.</span>
        </div>
      )}
      {banner === 'dismissed' && (
        <div style={{ background: C.p2 + '99', border: `1px solid ${C.p3}`, borderRadius: 7, padding: '0.75rem 1rem', color: C.p4, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="ri-close-circle-line" style={{ fontSize: '1.1rem' }} />
          <span style={{ fontSize: '0.82rem' }}>Action recorded. Queue updated.</span>
        </div>
      )}

      {/* Hit header */}
      <div style={{ background: C.p1, borderRadius: 10, padding: '1rem 1.25rem', border: `1px solid ${C.p2}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: C.p4, fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: MONO, marginBottom: '0.2rem' }}>
            Hit ID {hit.id}
          </div>
          <div style={{ color: '#e8dcc8', fontWeight: 700, fontSize: '1rem' }}>
            {hit.targetName} <span style={{ color: C.p4, fontWeight: 400 }}>vs</span> {hit.travelerName}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ padding: '0.25rem 0.6rem', borderRadius: 4, background: rc + '22', color: rc, fontSize: '0.72rem', fontFamily: MONO }}>
            {hit.riskLevel}
          </span>
          <span style={{ padding: '0.25rem 0.6rem', borderRadius: 4, background: STATUS_COLOR[hit.status] + '22', color: STATUS_COLOR[hit.status], fontSize: '0.72rem', fontFamily: MONO }}>
            {hit.status.replace('_', ' ')}
          </span>
          <span style={{ color: rc, fontSize: '1.1rem', fontWeight: 700, fontFamily: MONO }}>
            {Math.round(hit.confidence * 100)}% match
          </span>
        </div>
      </div>

      {/* Compare columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Target Record */}
        <div style={{ background: C.p1, borderRadius: 10, padding: '1rem 1.25rem', border: `1px solid ${C.critical}44` }}>
          <div style={{ color: C.critical, fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: MONO, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <i className="ri-shield-cross-fill" /> Target Record
          </div>
          {row('ID', hit.targetId, C.gold)}
          {row('Watchlist', hit.watchlistSrc)}
          {row('Name', hit.targetName)}
          {row('Nationality', hit.targetNat)}
          {row('DOB', hit.targetDOB)}
          {row('Doc #', hit.targetDoc)}
          <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.6rem', background: C.critical + '15', borderRadius: 5, border: `1px solid ${C.critical}33` }}>
            <div style={{ color: C.critical, fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: MONO, marginBottom: '0.2rem' }}>Risk Reason</div>
            <div style={{ color: '#e8dcc8', fontSize: '0.78rem' }}>{hit.targetRisk}</div>
          </div>
        </div>

        {/* Incoming Traveler */}
        <div style={{ background: C.p1, borderRadius: 10, padding: '1rem 1.25rem', border: `1px solid ${C.p2}` }}>
          <div style={{ color: C.gold, fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: MONO, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <i className="ri-flight-land-line" /> Incoming Traveler
          </div>
          {row('Name', hit.travelerName)}
          {row('Nationality', hit.travelerNat)}
          {row('DOB', hit.travelerDOB)}
          {row('Doc #', hit.travelerDoc)}
          <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.6rem', background: C.gold2 + '18', borderRadius: 5, border: `1px solid ${C.gold2}44` }}>
            <div style={{ color: C.gold, fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: MONO, marginBottom: '0.25rem' }}>
              Flight Info
            </div>
            {row('Flight', hit.flight, C.gold)}
            {row('Route', `${hit.fromCode} → ${hit.toCode}`)}
            {row('ETA', hit.eta)}
            {row('Seat', hit.seat)}
          </div>
        </div>
      </div>

      {/* Match factors */}
      <div style={{ background: C.p1, borderRadius: 10, padding: '1rem 1.25rem', border: `1px solid ${C.p2}` }}>
        <div style={{ color: C.gold, fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: MONO, marginBottom: '0.75rem' }}>
          Match Factors
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {hit.factors.map(f => {
            const fc = f.score >= 85 ? C.critical : f.score >= 65 ? C.high : f.score >= 40 ? C.medium : C.low;
            return (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: C.p4, fontSize: '0.72rem', fontFamily: MONO, minWidth: 160 }}>{f.label}</span>
                <ConfBar score={f.score} color={fc} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Action bar */}
      {hit.status === 'PENDING' && (
        <div style={{ background: C.p1, borderRadius: 10, padding: '1rem 1.25rem', border: `1px solid ${C.p2}`, display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            onClick={() => onDefer(hit.id)}
            style={{ padding: '0.6rem 1.1rem', background: C.p2, color: C.p4, border: `1px solid ${C.p3}`, borderRadius: 6, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <i className="ri-time-line" /> Defer 24h
          </button>
          <button
            onClick={() => onFalsePositive(hit.id)}
            style={{ padding: '0.6rem 1.1rem', background: C.p2, color: '#c8bcaa', border: `1px solid ${C.p3}`, borderRadius: 6, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <i className="ri-close-circle-line" /> False Positive
          </button>
          <button
            onClick={() => onEscalate(hit.id)}
            style={{ padding: '0.6rem 1.1rem', background: C.high + '22', color: C.high, border: `1px solid ${C.high}55`, borderRadius: 6, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <i className="ri-alarm-warning-line" /> Escalate
          </button>
          <button
            onClick={() => onConfirm(hit.id)}
            style={{ padding: '0.6rem 1.4rem', background: C.critical, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontFamily: MONO, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <i className="ri-checkbox-circle-fill" /> Confirm Match
          </button>
        </div>
      )}
    </div>
  );
}
