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
  SPLIT:         '#5B7494',
};

// ── Extended type to include MERGED records with split metadata ───────────────

interface MergedRecord extends EntityMatchCandidate {
  mergedAt?:    string;
  mergedLabel?: string;
}

// ── Two MERGED seed records ───────────────────────────────────────────────────

const MERGED_RECORDS: MergedRecord[] = [
  {
    id: 'MERGED-001',
    entityA: {
      id: 'ent-m001a', type: 'person',
      canonicalName: 'Omar Al-Balushi',
      aliases: ['Omar Balushi', 'O. Al-Balushi'],
      attributes: { dob: '1979-06-12', nationality: 'OMN', passportNumber: 'OM4411022', occupation: 'Engineer' },
      sources: ['eVisa history', 'MOL registry'],
    },
    entityB: {
      id: 'ent-m001b', type: 'person',
      canonicalName: 'Umar Balushi',
      aliases: ['Umar Al-Balushi', 'U. Balushi'],
      attributes: { dob: '1979-06-12', nationality: 'OMN', passportNumber: 'OM4411031', occupation: 'Civil Engineer' },
      sources: ['Hotels', 'OpenSanctions'],
    },
    similarity: 0.88,
    factors: {
      name_token_set_ratio: 0.85,
      alias_overlap_jaccard: 0.70,
      country_match: 1,
      dob_proximity: 1,
      contextual_source_agreement: 0.68,
    },
    createdAt: '2026-08-10T09:00:00Z',
    status: 'MERGED',
    mergedAt: '2026-08-15',
    mergedLabel: 'Omar Al-Balushi / Umar Balushi',
  },
  {
    id: 'MERGED-002',
    entityA: {
      id: 'ent-m002a', type: 'person',
      canonicalName: 'Sara Ahmed',
      aliases: ['Sara Ahmad', 'S. Ahmed'],
      attributes: { dob: '1995-03-22', nationality: 'EGY', passportNumber: 'EG7730019', occupation: 'Teacher' },
      sources: ['eVisa history'],
    },
    entityB: {
      id: 'ent-m002b', type: 'person',
      canonicalName: 'Sarah Ahmd',
      aliases: ['Sarah Ahmed', 'S. Ahmd'],
      attributes: { dob: '1995-03-22', nationality: 'EGY', passportNumber: 'EG7730022', occupation: 'Educator' },
      sources: ['OpenSanctions'],
    },
    similarity: 0.91,
    factors: {
      name_token_set_ratio: 0.90,
      alias_overlap_jaccard: 0.75,
      country_match: 1,
      dob_proximity: 1,
      contextual_source_agreement: 0.72,
    },
    createdAt: '2026-08-12T11:30:00Z',
    status: 'MERGED',
    mergedAt: '2026-08-16',
    mergedLabel: 'Sara Ahmed / Sarah Ahmd',
  },
];

// ── Sim bar helper ─────────────────────────────────────────────────────────────

function simBar(value: number, color = GOLD) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ flex: 1, height: 6, background: P2, borderRadius: 3, overflow: 'hidden' }}>
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
  name_token_set_ratio:         { labelEn: 'Name Token Match',      icon: 'ri-text-snippet' },
  alias_overlap_jaccard:        { labelEn: 'Alias Overlap',          icon: 'ri-user-2-line' },
  country_match:                { labelEn: 'Country Match',           icon: 'ri-global-line' },
  dob_proximity:                { labelEn: 'Date of Birth Proximity', icon: 'ri-calendar-line' },
  contextual_source_agreement:  { labelEn: 'Source Agreement',        icon: 'ri-database-2-line' },
};

// ── Split Wizard Modal ────────────────────────────────────────────────────────

interface SplitWizardProps {
  candidate: MergedRecord;
  onClose:    () => void;
  onComplete: (id: string) => void;
}

function SplitWizard({ candidate, onClose, onComplete }: SplitWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const allKeys = Array.from(new Set([
    ...Object.keys(candidate.entityA.attributes),
    ...Object.keys(candidate.entityB.attributes),
  ]));

  // For each attribute key, assign it to Record A or Record B
  const [assign, setAssign] = useState<Record<string, 'A' | 'B'>>(() => {
    const init: Record<string, 'A' | 'B'> = {};
    allKeys.forEach(k => { init[k] = 'A'; });
    return init;
  });

  // Build resulting records from assignments
  const recA: Record<string, unknown> = {};
  const recB: Record<string, unknown> = {};
  allKeys.forEach(k => {
    const srcA = candidate.entityA.attributes[k];
    const srcB = candidate.entityB.attributes[k];
    if (assign[k] === 'A') {
      if (srcA !== undefined) recA[k] = srcA;
      else if (srcB !== undefined) recA[k] = srcB;
    } else {
      if (srcB !== undefined) recB[k] = srcB;
      else if (srcA !== undefined) recB[k] = srcA;
    }
  });

  function handleConfirm() {
    onComplete(candidate.id);
    onClose();
  }

  const stepDefs = [
    { n: 1, label: 'Assign Attributes' },
    { n: 2, label: 'Review Split' },
    { n: 3, label: 'Confirm' },
  ];

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(2,10,20,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{ background: P1, borderRadius: 10, padding: '2rem', width: 660, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${P2}` }}
      >
        {/* Steps bar */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', alignItems: 'center' }}>
          {stepDefs.map(({ n, label }, i, arr) => (
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
            Split Merged Identity
            <span style={{ color: P4, fontWeight: 400, marginLeft: '0.5rem', fontSize: '0.82rem' }}>
              — {step === 1 ? 'Step 1: Assign Each Attribute' : step === 2 ? 'Step 2: Review Resulting Records' : 'Step 3: Confirm Split'}
            </span>
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: P4, fontSize: '1.2rem', cursor: 'pointer' }}>
            <i className="ri-close-line" />
          </button>
        </div>

        {/* Step 1: Attribute assignment */}
        {step === 1 && (
          <div>
            <p style={{ color: P4, fontSize: '0.8rem', margin: '0 0 1rem' }}>
              For each attribute, choose which of the two split records should carry this value.
              The original merged record (<strong style={{ color: '#e8dcc8' }}>{candidate.entityA.canonicalName}</strong>) will be split into
              Record A (<strong style={{ color: GOLD }}>{candidate.entityA.canonicalName}</strong>) and
              Record B (<strong style={{ color: GOLD }}>{candidate.entityB.canonicalName}</strong>).
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {allKeys.map(k => {
                const aVal = String(candidate.entityA.attributes[k] ?? '—');
                const bVal = String(candidate.entityB.attributes[k] ?? '—');
                const cur  = assign[k];
                return (
                  <div key={k} style={{ background: P2, borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ padding: '0.35rem 0.8rem', background: P3 + '66', color: P4, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
                      {k}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                      {(['A', 'B'] as const).map(side => {
                        const val     = side === 'A' ? aVal : bVal;
                        const name    = side === 'A' ? candidate.entityA.canonicalName : candidate.entityB.canonicalName;
                        const chosen  = cur === side;
                        return (
                          <button
                            key={side}
                            onClick={() => setAssign(a => ({ ...a, [k]: side }))}
                            style={{
                              padding: '0.5rem 0.8rem', textAlign: 'left',
                              background: chosen ? GOLD2 + '25' : 'transparent',
                              border: 'none',
                              borderTop: chosen ? `1.5px solid ${GOLD2}` : '1.5px solid transparent',
                              cursor: 'pointer',
                              color: chosen ? '#e8dcc8' : P4,
                              fontSize: '0.8rem',
                              display: 'flex', alignItems: 'center', gap: '0.5rem',
                            }}
                          >
                            <i className={chosen ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'} style={{ color: chosen ? GOLD : P4, fontSize: '0.85rem', flexShrink: 0 }} />
                            <span>Rec {side} ({name.split(' ')[0]}): </span>
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

        {/* Step 2: Review side by side */}
        {step === 2 && (
          <div>
            <p style={{ color: P4, fontSize: '0.8rem', margin: '0 0 1rem' }}>
              Review how each resulting record will look after the split.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {(['A', 'B'] as const).map(side => {
                const rec   = side === 'A' ? recA : recB;
                const ent   = side === 'A' ? candidate.entityA : candidate.entityB;
                return (
                  <div key={side} style={{ background: P2, borderRadius: 7, padding: '0.9rem' }}>
                    <div style={{ color: GOLD, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.5rem' }}>
                      Record {side}
                    </div>
                    <div style={{ color: '#e8dcc8', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{ent.canonicalName}</div>
                    <div style={{ color: P4, fontSize: '0.72rem', marginBottom: '0.6rem' }}>ID: {ent.id} · Sources: {ent.sources.join(', ')}</div>
                    {Object.entries(rec).map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ color: P4, fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace", minWidth: 80 }}>{k}</span>
                        <span style={{ color: '#e8dcc8', fontSize: '0.78rem', fontFamily: "'JetBrains Mono', monospace" }}>{String(v)}</span>
                      </div>
                    ))}
                    {Object.keys(rec).length === 0 && (
                      <div style={{ color: P4, fontSize: '0.78rem', fontStyle: 'italic' }}>No attributes assigned to this record.</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div>
            <div style={{ padding: '0.9rem', background: '#D4922A15', border: '1px solid #D4922A55', borderRadius: 6, color: '#D4922A', fontSize: '0.78rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <i className="ri-error-warning-line" style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                This will permanently split the merged entity into two separate records.
                Both records will be marked as <strong>SPLIT</strong> in the audit trail. This action cannot be undone.
              </span>
            </div>
            <div style={{ background: P2, borderRadius: 7, padding: '0.9rem', marginBottom: '0.75rem' }}>
              <div style={{ color: GOLD, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.5rem' }}>
                Split Summary
              </div>
              <div style={{ color: '#e8dcc8', fontSize: '0.85rem' }}>
                <span style={{ color: P4 }}>Merged record </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{candidate.id}</span>
                <span style={{ color: P4 }}> will be split into:</span>
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                <div>
                  <div style={{ color: GOLD, fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace" }}>Record A</div>
                  <div style={{ color: '#e8dcc8', fontSize: '0.82rem', fontWeight: 600 }}>{candidate.entityA.canonicalName}</div>
                  <div style={{ color: P4, fontSize: '0.7rem' }}>{candidate.entityA.id}</div>
                </div>
                <div style={{ color: P3, alignSelf: 'center', fontSize: '1.2rem' }}>+</div>
                <div>
                  <div style={{ color: GOLD, fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace" }}>Record B</div>
                  <div style={{ color: '#e8dcc8', fontSize: '0.82rem', fontWeight: 600 }}>{candidate.entityB.canonicalName}</div>
                  <div style={{ color: P4, fontSize: '0.7rem' }}>{candidate.entityB.id}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
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
            <button onClick={handleConfirm} style={{ padding: '0.6rem 1.4rem', background: '#D4922A', color: '#0a1a2e', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem' }}>
              Confirm Split
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Merge Wizard Modal ────────────────────────────────────────────────────────

interface MergeWizardProps {
  candidate: EntityMatchCandidate;
  onClose:    () => void;
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
  candidate:     MergedRecord;
  isAr:          boolean;
  onMerge:       () => void;
  onSplit:       () => void;
  onAction:      (id: string, status: 'KEPT_SEPARATE' | 'ESCALATED') => void;
}
function ComparePanel({ candidate, isAr, onMerge, onSplit, onAction }: ComparePanelProps) {
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

  const isMerged = candidate.status === 'MERGED' || candidate.status === 'SPLIT';

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ background: P1, borderRadius: 10, padding: '1.25rem', border: `1px solid ${P2}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ color: P4, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.25rem' }}>
              Case {candidate.id}
              {candidate.mergedAt && (
                <span style={{ color: '#4A8E5A', marginLeft: '0.6rem' }}>· Merged {candidate.mergedAt}</span>
              )}
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
          const cmp  = compareVal(aVal, bVal);
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

      {/* Action bar — PENDING: merge / keep separate / escalate */}
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

      {/* Action bar — MERGED: split button */}
      {isMerged && candidate.status !== 'SPLIT' && (
        <div style={{ background: P1, borderRadius: 10, padding: '1rem', border: `1px solid ${P2}`, display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', alignItems: 'center' }}>
          <span style={{ color: P4, fontSize: '0.78rem', flex: 1 }}>
            <i className="ri-information-line" style={{ marginRight: '0.4rem' }} />
            This record was merged on {(candidate as MergedRecord).mergedAt ?? 'an earlier date'}. You may split it back into two separate identities.
          </span>
          <button
            onClick={onSplit}
            style={{ padding: '0.6rem 1.4rem', background: '#D4922A22', color: '#D4922A', border: '1px solid #D4922A55', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <i className="ri-git-branch-line" /> Split Merged Identity
          </button>
        </div>
      )}

      {/* SPLIT confirmation notice */}
      {candidate.status === 'SPLIT' && (
        <div style={{ background: '#5B749422', border: '1px solid #5B749455', borderRadius: 7, padding: '0.75rem 1rem', color: '#5B7494', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="ri-git-branch-line" style={{ fontSize: '1.1rem' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Identity split. Both records have been restored as separate entities and logged in the audit trail.</span>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

type AnyStatus = EntityMatchCandidate['status'] | 'SPLIT' | 'ALL';

export default function IdentityComparePage() {
  const { isAr } = useOutletContext<DashboardOutletContext>();

  const [queue, setQueue] = useState<MergedRecord[]>([
    ...ENTITY_MATCH_QUEUE,
    ...MERGED_RECORDS,
  ]);
  const [selected,        setSelected]        = useState<MergedRecord | null>(null);
  const [statusFilter,    setStatusFilter]    = useState<AnyStatus>('ALL');
  const [showMergeWizard, setShowMergeWizard] = useState(false);
  const [showSplitWizard, setShowSplitWizard] = useState(false);

  const filtered = queue.filter(c => statusFilter === 'ALL' || c.status === statusFilter);

  function handleAction(id: string, status: 'KEPT_SEPARATE' | 'ESCALATED') {
    setQueue(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
  }

  function handleMergeComplete(id: string) {
    setQueue(prev => prev.map(c => c.id === id ? { ...c, status: 'MERGED' } : c));
    setSelected(prev => prev?.id === id ? { ...prev, status: 'MERGED' } : prev);
  }

  function handleSplitComplete(id: string) {
    setQueue(prev => prev.map(c => c.id === id ? { ...c, status: 'SPLIT' as unknown as EntityMatchCandidate['status'] } : c));
    setSelected(prev => prev?.id === id ? { ...prev, status: 'SPLIT' as unknown as EntityMatchCandidate['status'] } : prev);
  }

  const pending   = queue.filter(c => c.status === 'PENDING').length;
  const merged    = queue.filter(c => c.status === 'MERGED').length;
  const separate  = queue.filter(c => c.status === 'KEPT_SEPARATE').length;
  const escalated = queue.filter(c => c.status === 'ESCALATED').length;
  const split     = queue.filter(c => (c.status as string) === 'SPLIT').length;

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

  const liveSelected = selected ? (queue.find(c => c.id === selected.id) ?? selected) : null;

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
              { label: `${pending} Pending`,   status: 'PENDING'       as AnyStatus, color: '#D4922A' },
              { label: `${merged} Merged`,     status: 'MERGED'        as AnyStatus, color: '#4A8E5A' },
              { label: `${separate} Separate`, status: 'KEPT_SEPARATE' as AnyStatus, color: '#5B7494' },
              { label: `${escalated} Escalated`, status: 'ESCALATED'  as AnyStatus, color: '#C94A5E' },
              { label: `${split} Split`,       status: 'SPLIT'         as AnyStatus, color: '#5B7494' },
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
            const sc = STATUS_COLORS[(c.status as string)] ?? '#5B7494';
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
                    {(c.status as string).replace('_', ' ')}
                  </span>
                </div>
                <div style={{ color: P4, fontSize: '0.74rem', marginBottom: '0.35rem' }}>
                  vs {c.entityB.canonicalName.split(' ').slice(0, 2).join(' ')}
                </div>
                {(c as MergedRecord).mergedAt && (
                  <div style={{ color: '#4A8E5A', fontSize: '0.66rem', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.2rem' }}>
                    Merged {(c as MergedRecord).mergedAt}
                  </div>
                )}
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
      {liveSelected ? (
        <ComparePanel
          candidate={liveSelected}
          isAr={isAr}
          onMerge={() => setShowMergeWizard(true)}
          onSplit={() => setShowSplitWizard(true)}
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

      {showMergeWizard && liveSelected && (
        <MergeWizard
          candidate={liveSelected}
          onClose={() => setShowMergeWizard(false)}
          onComplete={handleMergeComplete}
        />
      )}

      {showSplitWizard && liveSelected && (
        <SplitWizard
          candidate={liveSelected}
          onClose={() => setShowSplitWizard(false)}
          onComplete={handleSplitComplete}
        />
      )}
    </div>
  );
}
