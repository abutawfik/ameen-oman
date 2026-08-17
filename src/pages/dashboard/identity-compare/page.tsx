import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '../DashboardLayout';
import { ENTITY_MATCH_QUEUE, type EntityMatchCandidate } from '../../../mocks/osintData';

const BG   = 'var(--alm-ocean-800)';
const P1   = 'var(--alm-ocean-700)';
const P2   = 'var(--alm-ocean-600)';
const P3   = 'var(--alm-ocean-500)';
const P4   = 'var(--alm-ocean-400)';
const GOLD = '#D6B47E';
const GOLD2 = '#B8893C';

const STATUS_COLORS: Record<string, string> = {
  PENDING:       '#D4922A',
  MERGED:        '#4A8E5A',
  KEPT_SEPARATE: '#5B7494',
  ESCALATED:     '#C94A5E',
};

function simBar(value: number, color = GOLD) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ flex: 1, height: 6, background: 'var(--alm-ocean-600)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${Math.round(value * 100)}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.4s' }} />
      </div>
      <span style={{ color: '#e8dcc8', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", minWidth: 34, textAlign: 'right' }}>
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

type FactorKey = keyof EntityMatchCandidate['factors'];
const FACTOR_LABELS: Record<FactorKey, { labelEn: string; icon: string }> = {
  name_token_set_ratio:         { labelEn: 'Name Token Match',     icon: 'ri-text-snippet' },
  alias_overlap_jaccard:        { labelEn: 'Alias Overlap',         icon: 'ri-user-2-line' },
  country_match:                { labelEn: 'Country Match',          icon: 'ri-global-line' },
  dob_proximity:                { labelEn: 'Date of Birth Proximity',icon: 'ri-calendar-line' },
  contextual_source_agreement:  { labelEn: 'Source Agreement',       icon: 'ri-database-2-line' },
};

// ── Merge Wizard Modal ────────────────────────────────────────────────────────
interface MergeWizardProps {
  candidate: EntityMatchCandidate;
  onClose: () => void;
  onComplete: (id: string) => void;
}
function MergeWizard({ candidate, onClose, onComplete }: MergeWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [master, setMaster] = useState<'A' | 'B'>('A');
  const [fieldChoices, setFieldChoices] = useState<Record<string, 'A' | 'B'>>(() => {
    const allKeys = new Set([
      ...Object.keys(candidate.entityA.attributes),
      ...Object.keys(candidate.entityB.attributes),
    ]);
    const init: Record<string, 'A' | 'B'> = {};
    allKeys.forEach(k => { init[k] = 'A'; });
    return init;
  });

  const masterEntity = master === 'A' ? candidate.entityA : candidate.entityB;
  const attrKeys = Array.from(new Set([
    ...Object.keys(candidate.entityA.attributes),
    ...Object.keys(candidate.entityB.attributes),
  ]));

  const mergedAttrs: Record<string, unknown> = {};
  attrKeys.forEach(k => {
    const src = fieldChoices[k] === 'A' ? candidate.entityA.attributes : candidate.entityB.attributes;
    if (src[k] !== undefined) mergedAttrs[k] = src[k];
  });

  function handleMergeConfirm() {
    onComplete(candidate.id);
    onClose();
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(2,10,20,0.82)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: P1, borderRadius: 10, padding: '2rem',
          width: 620, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto',
          border: `1px solid ${P2}`,
        }}
      >
        {/* Steps bar */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', alignItems: 'center' }}>
          {[
            { n: 1, label: 'Choose Master' },
            { n: 2, label: 'Select Fields' },
            { n: 3, label: 'Review & Merge' },
          ].map(({ n, label }, i, arr) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: i < arr.length - 1 ? 1 : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div
                  style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: step >= n ? GOLD2 : P2,
                    color: step >= n ? '#0a1a2e' : P4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                    flexShrink: 0,
                  }}
                >
                  {step > n ? <i className="ri-check-line" style={{ fontSize: '0.8rem' }} /> : n}
                </div>
                <span style={{ fontSize: '0.75rem', color: step >= n ? GOLD : P4, whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {i < arr.length - 1 && <div style={{ flex: 1, height: 1, background: P2 }} />}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: GOLD, margin: 0, fontSize: '1rem', fontFamily: "'JetBrains Mono', monospace" }}>
            {step === 1 ? 'Step 1 — Choose Master Record' :
             step === 2 ? 'Step 2 — Select Field Values' :
             'Step 3 — Review Merged Record'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: P4, fontSize: '1.2rem', cursor: 'pointer' }}>
            <i className="ri-close-line" />
          </button>
        </div>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ color: P4, fontSize: '0.8rem', margin: '0 0 0.75rem' }}>
              Select which record will be the canonical master. The other record's ID will be marked as an alias.
            </p>
            {(['A', 'B'] as const).map(side => {
              const ent = side === 'A' ? candidate.entityA : candidate.entityB;
              const isSelected = master === side;
              return (
                <div
                  key={side}
                  onClick={() => setMaster(side)}
                  style={{
                    padding: '1rem',
                    background: isSelected ? GOLD2 + '20' : P2,
                    border: `1.5px solid ${isSelected ? GOLD2 : P3}`,
                    borderRadius: 7, cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: 18, height: 18, borderRadius: '50%',
                        border: `2px solid ${isSelected ? GOLD2 : P3}`,
                        background: isSelected ? GOLD2 : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0a1a2e' }} />}
                    </div>
                    <div>
                      <div style={{ color: '#e8dcc8', fontWeight: 700, fontSize: '0.9rem' }}>{ent.canonicalName}</div>
                      <div style={{ color: P4, fontSize: '0.75rem', marginTop: '0.15rem' }}>
                        ID: {ent.id} · Type: {ent.type} · Sources: {ent.sources.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div>
            <p style={{ color: P4, fontSize: '0.8rem', margin: '0 0 1rem' }}>
              For each attribute, choose which record's value to carry into the merged entity.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {attrKeys.map(k => {
                const aVal = String(candidate.entityA.attributes[k] ?? '—');
                const bVal = String(candidate.entityB.attributes[k] ?? '—');
                const current = fieldChoices[k];
                return (
                  <div key={k} style={{ background: P2, borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ padding: '0.4rem 0.8rem', background: P3 + '66', color: P4, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
                      {k}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                      {(['A', 'B'] as const).map(side => {
                        const val = side === 'A' ? aVal : bVal;
                        const isChosen = current === side;
                        return (
                          <button
                            key={side}
                            onClick={() => setFieldChoices(fc => ({ ...fc, [k]: side }))}
                            style={{
                              padding: '0.5rem 0.8rem', textAlign: 'left',
                              background: isChosen ? GOLD2 + '25' : 'transparent',
                              border: 'none',
                              borderTop: isChosen ? `1.5px solid ${GOLD2}` : '1.5px solid transparent',
                              cursor: 'pointer',
                              color: isChosen ? '#e8dcc8' : P4,
                              fontSize: '0.8rem',
                              display: 'flex', alignItems: 'center', gap: '0.5rem',
                            }}
                          >
                            <i className={isChosen ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'} style={{ color: isChosen ? GOLD : P4, fontSize: '0.85rem', flexShrink: 0 }} />
                            <span>{side === 'A' ? candidate.entityA.canonicalName.split(' ')[0] : candidate.entityB.canonicalName.split(' ')[0]}: </span>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem' }}>{val}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p style={{ color: P4, fontSize: '0.8rem', margin: '0 0 1rem' }}>
              Review the merged record before confirming. This action cannot be undone.
            </p>
            <div style={{ background: P2, borderRadius: 7, padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ color: GOLD, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.75rem' }}>
                Merged Entity
              </div>
              <div style={{ color: '#e8dcc8', fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem' }}>
                {masterEntity.canonicalName}
              </div>
              <div style={{ color: P4, fontSize: '0.78rem', marginBottom: '0.75rem' }}>
                Type: {masterEntity.type} · Master ID: {masterEntity.id}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {Object.entries(mergedAttrs).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: '0.75rem' }}>
                    <span style={{ color: P4, fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", minWidth: 120 }}>{k}</span>
                    <span style={{ color: '#e8dcc8', fontSize: '0.82rem', fontFamily: "'JetBrains Mono', monospace" }}>{String(v)}</span>
                  </div>
                ))}
              </div>
              {/* Combined aliases */}
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ color: P4, fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace" }}>Aliases: </span>
                <span style={{ color: '#e8dcc8', fontSize: '0.78rem' }}>
                  {Array.from(new Set([...candidate.entityA.aliases, ...candidate.entityB.aliases, candidate.entityB.canonicalName])).join(' · ')}
                </span>
              </div>
            </div>
            <div style={{ padding: '0.75rem', background: '#C94A5E15', border: '1px solid #C94A5E55', borderRadius: 6, color: '#C94A5E', fontSize: '0.78rem', marginBottom: '1rem' }}>
              <i className="ri-error-warning-line" /> &nbsp;This merge will archive entity <strong>{master === 'A' ? candidate.entityB.id : candidate.entityA.id}</strong> and link it as an alias. The action is logged in the audit trail.
            </div>
          </div>
        )}

        {/* Footer buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '1.25rem', borderTop: `1px solid ${P2}`, marginTop: '1.25rem' }}>
          <button onClick={onClose} style={{ padding: '0.6rem 1.2rem', background: P2, color: '#ccc', border: 'none', borderRadius: 5, cursor: 'pointer' }}>Cancel</button>
          {step > 1 && (
            <button onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)} style={{ padding: '0.6rem 1.2rem', background: P2, color: GOLD, border: `1px solid ${P3}`, borderRadius: 5, cursor: 'pointer' }}>Back</button>
          )}
          {step < 3 ? (
            <button onClick={() => setStep(s => (s + 1) as 1 | 2 | 3)} style={{ padding: '0.6rem 1.4rem', background: GOLD2, color: '#0a1a2e', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem' }}>
              Next
            </button>
          ) : (
            <button onClick={handleMergeConfirm} style={{ padding: '0.6rem 1.4rem', background: '#C94A5E', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem' }}>
              Confirm Merge
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Compare Panel ─────────────────────────────────────────────────────────────
interface ComparePanelProps {
  candidate: EntityMatchCandidate;
  isAr: boolean;
  onMerge: () => void;
  onAction: (id: string, status: 'KEPT_SEPARATE' | 'ESCALATED') => void;
}
function ComparePanel({ candidate, isAr, onMerge, onAction }: ComparePanelProps) {
  const attrKeys = Array.from(new Set([
    ...Object.keys(candidate.entityA.attributes),
    ...Object.keys(candidate.entityB.attributes),
  ]));

  const simColor =
    candidate.similarity >= 0.85 ? '#C94A5E' :
    candidate.similarity >= 0.75 ? '#D4922A' :
    '#D6B47E';

  function compareVal(a: unknown, b: unknown): 'match' | 'diff' | 'missing' {
    if (a === undefined || b === undefined) return 'missing';
    return String(a).toLowerCase() === String(b).toLowerCase() ? 'match' : 'diff';
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ background: P1, borderRadius: 10, padding: '1.25rem', border: `1px solid ${P2}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ color: P4, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.25rem' }}>
              Case {candidate.id}
            </div>
            <h2 style={{ color: '#e8dcc8', fontSize: '1rem', margin: '0 0 0.2rem', fontWeight: 700 }}>
              {candidate.entityA.canonicalName} <span style={{ color: P4 }}>vs</span> {candidate.entityB.canonicalName}
            </h2>
            <div style={{ color: P4, fontSize: '0.75rem' }}>
              {candidate.entityA.type.charAt(0).toUpperCase() + candidate.entityA.type.slice(1)} entities · Created {new Date(candidate.createdAt).toLocaleDateString()}
            </div>
          </div>
          <span style={{
            padding: '0.3rem 0.75rem', borderRadius: 4,
            background: STATUS_COLORS[candidate.status] + '22',
            color: STATUS_COLORS[candidate.status],
            fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace",
          }}>
            {candidate.status}
          </span>
        </div>

        {/* Similarity bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <span style={{ color: P4, fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: 90 }}>Similarity</span>
          {simBar(candidate.similarity, simColor)}
        </div>

        {/* Factor breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {(Object.entries(FACTOR_LABELS) as [FactorKey, { labelEn: string; icon: string }][]).map(([k, meta]) => {
            const v = candidate.factors[k] as number;
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: P4, fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 165 }}>
                  <i className={meta.icon} style={{ fontSize: '0.75rem' }} />
                  {meta.labelEn}
                </span>
                {simBar(v, v >= 0.8 ? '#4A8E5A' : v >= 0.5 ? GOLD : '#C94A5E')}
              </div>
            );
          })}
        </div>
      </div>

      {/* Attribute comparison */}
      <div style={{ background: P1, borderRadius: 10, border: `1px solid ${P2}`, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', background: P2, borderBottom: `1px solid ${P3}` }}>
          <div style={{ padding: '0.6rem 0.8rem', color: P4, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>Field</div>
          <div style={{ padding: '0.6rem 0.8rem', color: GOLD, fontSize: '0.78rem', fontFamily: "'JetBrains Mono', monospace", borderLeft: `1px solid ${P3}` }}>
            Entity A · {candidate.entityA.canonicalName}
          </div>
          <div style={{ padding: '0.6rem 0.8rem', color: GOLD, fontSize: '0.78rem', fontFamily: "'JetBrains Mono', monospace", borderLeft: `1px solid ${P3}` }}>
            Entity B · {candidate.entityB.canonicalName}
          </div>
        </div>
        {attrKeys.map((k, i) => {
          const aVal = candidate.entityA.attributes[k];
          const bVal = candidate.entityB.attributes[k];
          const cmp = compareVal(aVal, bVal);
          const rowBg = i % 2 === 0 ? 'transparent' : P2 + '55';
          return (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', background: rowBg, borderBottom: `1px solid ${P2}` }}>
              <div style={{ padding: '0.55rem 0.8rem', color: P4, fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace" }}>
                {k}
              </div>
              <div style={{
                padding: '0.55rem 0.8rem', borderLeft: `1px solid ${P2}`,
                color: cmp === 'match' ? '#4A8E5A' : cmp === 'diff' ? '#D6B47E' : P4,
                fontSize: '0.82rem', fontFamily: "'JetBrains Mono', monospace",
              }}>
                {aVal !== undefined ? String(aVal) : '—'}
              </div>
              <div style={{
                padding: '0.55rem 0.8rem', borderLeft: `1px solid ${P2}`,
                color: cmp === 'match' ? '#4A8E5A' : cmp === 'diff' ? '#D4922A' : P4,
                fontSize: '0.82rem', fontFamily: "'JetBrains Mono', monospace",
              }}>
                {bVal !== undefined ? String(bVal) : '—'}
              </div>
            </div>
          );
        })}
        {/* Sources */}
        {[
          { label: 'Aliases', aVal: candidate.entityA.aliases.join(', '), bVal: candidate.entityB.aliases.join(', ') },
          { label: 'Sources', aVal: candidate.entityA.sources.join(', '), bVal: candidate.entityB.sources.join(', ') },
        ].map(({ label, aVal, bVal }, i) => (
          <div key={label} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', background: i % 2 === 0 ? P2 + '33' : 'transparent', borderBottom: `1px solid ${P2}` }}>
            <div style={{ padding: '0.55rem 0.8rem', color: P4, fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
            <div style={{ padding: '0.55rem 0.8rem', borderLeft: `1px solid ${P2}`, color: '#c8bcaa', fontSize: '0.78rem' }}>{aVal}</div>
            <div style={{ padding: '0.55rem 0.8rem', borderLeft: `1px solid ${P2}`, color: '#c8bcaa', fontSize: '0.78rem' }}>{bVal}</div>
          </div>
        ))}
      </div>

      {/* Action bar */}
      {candidate.status === 'PENDING' && (
        <div style={{ background: P1, borderRadius: 10, padding: '1rem', border: `1px solid ${P2}`, display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => onAction(candidate.id, 'ESCALATED')}
            style={{ padding: '0.6rem 1.2rem', background: '#C94A5E22', color: '#C94A5E', border: '1px solid #C94A5E55', borderRadius: 6, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <i className="ri-alarm-warning-line" /> Escalate
          </button>
          <button
            onClick={() => onAction(candidate.id, 'KEPT_SEPARATE')}
            style={{ padding: '0.6rem 1.2rem', background: P2, color: GOLD, border: `1px solid ${P3}`, borderRadius: 6, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <i className="ri-git-branch-line" /> Keep Separate
          </button>
          <button
            onClick={onMerge}
            style={{ padding: '0.6rem 1.4rem', background: GOLD2, color: '#0a1a2e', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <i className="ri-git-merge-line" /> Merge Entities
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
type AnyStatus = EntityMatchCandidate['status'] | 'ALL';

export default function IdentityComparePage() {
  const { isAr } = useOutletContext<DashboardOutletContext>();

  const [queue, setQueue] = useState<EntityMatchCandidate[]>(ENTITY_MATCH_QUEUE);
  const [selected, setSelected] = useState<EntityMatchCandidate | null>(null);
  const [statusFilter, setStatusFilter] = useState<AnyStatus>('ALL');
  const [showMergeWizard, setShowMergeWizard] = useState(false);

  const filtered = queue.filter(c => statusFilter === 'ALL' || c.status === statusFilter);

  function handleAction(id: string, status: 'KEPT_SEPARATE' | 'ESCALATED') {
    setQueue(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
  }

  function handleMergeComplete(id: string) {
    setQueue(prev => prev.map(c => c.id === id ? { ...c, status: 'MERGED' } : c));
    setSelected(prev => prev?.id === id ? { ...prev, status: 'MERGED' } : prev);
  }

  const pending   = queue.filter(c => c.status === 'PENDING').length;
  const merged    = queue.filter(c => c.status === 'MERGED').length;
  const separate  = queue.filter(c => c.status === 'KEPT_SEPARATE').length;
  const escalated = queue.filter(c => c.status === 'ESCALATED').length;

  const CHIP = (active: boolean, color = GOLD): React.CSSProperties => ({
    padding: '0.25rem 0.7rem',
    borderRadius: 4,
    border: `1px solid ${active ? color : P2}`,
    background: active ? color + '20' : P2,
    color: active ? color : P4,
    fontSize: '0.72rem',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
    letterSpacing: '0.06em',
  });

  return (
    <div style={{ height: '100%', display: 'flex', background: BG, color: '#e8dcc8', overflow: 'hidden' }}>
      {/* Left queue panel */}
      <div style={{ width: 300, borderRight: `1px solid ${P2}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Header */}
        <div style={{ padding: '1rem', borderBottom: `1px solid ${P2}` }}>
          <div style={{ color: P4, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.5rem' }}>
            Identity Compare
          </div>
          {/* Summary chips */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {[
              { label: `${pending} Pending`, status: 'PENDING' as AnyStatus, color: '#D4922A' },
              { label: `${merged} Merged`, status: 'MERGED' as AnyStatus, color: '#4A8E5A' },
              { label: `${separate} Separate`, status: 'KEPT_SEPARATE' as AnyStatus, color: '#5B7494' },
              { label: `${escalated} Escalated`, status: 'ESCALATED' as AnyStatus, color: '#C94A5E' },
            ].map(({ label, status, color }) => (
              <button key={status} style={CHIP(statusFilter === status, color)} onClick={() => setStatusFilter(statusFilter === status ? 'ALL' : status)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Queue list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(c => {
            const isSelected = selected?.id === c.id;
            const sc = STATUS_COLORS[c.status];
            const simColor = c.similarity >= 0.85 ? '#C94A5E' : c.similarity >= 0.75 ? '#D4922A' : '#D6B47E';
            return (
              <div
                key={c.id}
                onClick={() => setSelected(isSelected ? null : c)}
                style={{
                  padding: '0.9rem 1rem',
                  borderBottom: `1px solid ${P2}`,
                  cursor: 'pointer',
                  background: isSelected ? P2 + 'cc' : 'transparent',
                  borderLeft: isSelected ? `3px solid ${GOLD}` : '3px solid transparent',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                  <div style={{ color: '#e8dcc8', fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.3 }}>
                    {c.entityA.canonicalName.split(' ').slice(0, 2).join(' ')}
                  </div>
                  <span style={{
                    padding: '0.12rem 0.4rem', borderRadius: 3,
                    background: sc + '22', color: sc,
                    fontSize: '0.62rem', fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ color: P4, fontSize: '0.74rem', marginBottom: '0.35rem' }}>
                  vs {c.entityB.canonicalName.split(' ').slice(0, 2).join(' ')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ flex: 1, height: 4, background: P2, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.round(c.similarity * 100)}%`, height: '100%', background: simColor, borderRadius: 2 }} />
                  </div>
                  <span style={{ color: simColor, fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", minWidth: 30 }}>
                    {Math.round(c.similarity * 100)}%
                  </span>
                </div>
                <div style={{ color: P4, fontSize: '0.68rem', marginTop: '0.25rem', fontFamily: "'JetBrains Mono', monospace" }}>
                  {c.id}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: P4, fontSize: '0.8rem' }}>
              No records match this filter.
            </div>
          )}
        </div>
      </div>

      {/* Main compare area */}
      {selected ? (
        <ComparePanel
          candidate={queue.find(c => c.id === selected.id) ?? selected}
          isAr={isAr}
          onMerge={() => setShowMergeWizard(true)}
          onAction={handleAction}
        />
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.75rem', color: P4 }}>
          <i className="ri-git-merge-line" style={{ fontSize: '3rem', color: P3 }} />
          <p style={{ fontSize: '0.9rem', margin: 0 }}>Select a candidate pair to compare</p>
          <p style={{ fontSize: '0.78rem', margin: 0 }}>
            {pending} pending {pending === 1 ? 'pair' : 'pairs'} awaiting review
          </p>
        </div>
      )}

      {showMergeWizard && selected && (
        <MergeWizard
          candidate={queue.find(c => c.id === selected.id) ?? selected}
          onClose={() => setShowMergeWizard(false)}
          onComplete={handleMergeComplete}
        />
      )}
    </div>
  );
}
