import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '../DashboardLayout';
import type { RiskProfile, ProfileStatus, ProfileDomain, ProfileCondition, ConnectorType, ConditionOp } from '@/mocks/profilesData';
import { MOCK_PROFILES, MOCK_TEST_RESULTS, STATUS_COLORS, AVAILABLE_FIELDS } from '@/mocks/profilesData';

const STATUS_LABELS: Record<ProfileStatus, { en: string; ar: string }> = {
  ACTIVE:    { en: 'Active',    ar: 'نشط'     },
  DRAFT:     { en: 'Draft',     ar: 'مسودة'   },
  EXPIRED:   { en: 'Expired',   ar: 'منتهي'   },
  SUSPENDED: { en: 'Suspended', ar: 'موقوف'   },
};

const OPERATORS: ConditionOp[] = ['equals', 'contains', 'starts_with', 'in_list', 'range', 'regex', 'phonetic'];

// ── Test Profile Panel ────────────────────────────────────────
function TestProfilePanel({ profile, isAr, onClose }: { profile: RiskProfile; isAr: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(MOCK_TEST_RESULTS[profile.id] ?? null);

  const runTest = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult(MOCK_TEST_RESULTS[profile.id] ?? { totalMatches: 0, sampleMatches: [], unusableFields: [], testedAt: new Date().toISOString().slice(0, 16) });
    }, 900);
  };

  const FIELD_HIGHLIGHT = '#D6B47E';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'rgba(5,20,40,0.9)', borderLeft: '1px solid rgba(184,138,60,0.15)' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(184,138,60,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#B8893C', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          <i className="ri-test-tube-line" style={{ marginRight: 8 }} />
          {isAr ? 'اختبار النمط' : 'Test Profile'}
        </span>
        <button onClick={onClose} style={{ background: 'transparent', border: '1px solid rgba(184,138,60,0.2)', borderRadius: 4, color: '#5B7494', cursor: 'pointer', padding: '4px 8px', fontSize: 14 }}>
          <i className="ri-close-line" />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 12, color: '#5B7494', fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>
          {isAr
            ? `سيتحقق هذا النمط مقابل جميع سجلات "${profile.domain}" النشطة. سيتم إظهار السجلات المطابقة مع تمييز الحقول التي أدت إلى التطابق.`
            : `This profile will be checked against all active "${profile.domain}" records. Matching records are shown with matched attributes highlighted.`}
        </div>

        <button
          onClick={runTest}
          disabled={loading}
          style={{ padding: '9px 14px', borderRadius: 4, background: 'rgba(184,138,60,0.12)', border: '1px solid rgba(184,138,60,0.3)', color: '#D6B47E', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '0.06em', textTransform: 'uppercase', justifyContent: 'center' }}
        >
          {loading ? <><i className="ri-loader-4-line" style={{ animation: 'spin 1s linear infinite' }} />{isAr ? 'جاري الاختبار…' : 'Running…'}</> : <><i className="ri-play-circle-line" />{isAr ? 'تشغيل الاختبار' : 'Run Test'}</>}
        </button>

        {result && (
          <>
            {/* Match count banner */}
            <div style={{ padding: '10px 14px', borderRadius: 6, background: result.totalMatches > 0 ? 'rgba(201,74,94,0.08)' : 'rgba(74,142,90,0.08)', border: `1px solid ${result.totalMatches > 0 ? 'rgba(201,74,94,0.2)' : 'rgba(74,142,90,0.2)'}`, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontFamily: "'JetBrains Mono', monospace", color: result.totalMatches > 0 ? '#C94A5E' : '#4A8E5A', fontWeight: 700, lineHeight: 1 }}>
                {result.totalMatches}
              </div>
              <div style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
                {isAr ? 'سجل مطابق' : 'records matched'}
              </div>
            </div>

            {/* Warning for unusable fields */}
            {result.unusableFields.length > 0 && (
              <div style={{ padding: '8px 12px', borderRadius: 5, background: 'rgba(212,146,42,0.08)', border: '1px solid rgba(212,146,42,0.2)', fontSize: 11, color: '#D4922A', fontFamily: "'Inter', sans-serif" }}>
                <i className="ri-error-warning-line" style={{ marginRight: 6 }} />
                {isAr ? 'حقول غير متوفرة في البحث: ' : 'Fields not available in Ad Hoc Search: '}
                {result.unusableFields.join(', ')}
              </div>
            )}

            {/* Sample matches */}
            {result.sampleMatches.length > 0 && (
              <div>
                <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  {isAr ? 'عينة من النتائج' : 'Sample Results'}
                </div>
                {result.sampleMatches.map(m => (
                  <div key={m.id} style={{ padding: '10px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(184,138,60,0.08)', marginBottom: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#CBD5E1', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{m.name}</span>
                      <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 3, background: 'rgba(201,74,94,0.12)', color: '#C94A5E', fontFamily: "'JetBrains Mono', monospace" }}>
                        {m.riskScore}
                      </span>
                    </div>
                    {/* Matched fields with highlighting */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {profile.conditions.map(c => (
                        <span
                          key={c.id}
                          style={{
                            padding: '2px 7px', borderRadius: 3, fontSize: 10,
                            fontFamily: "'JetBrains Mono', monospace",
                            background: m.matchedFields.includes(c.field) ? `${FIELD_HIGHLIGHT}18` : 'rgba(91,116,148,0.06)',
                            color:      m.matchedFields.includes(c.field) ? FIELD_HIGHLIGHT      : '#374B61',
                            border:     `1px solid ${m.matchedFields.includes(c.field) ? `${FIELD_HIGHLIGHT}40` : 'rgba(91,116,148,0.12)'}`,
                            fontWeight: m.matchedFields.includes(c.field) ? 600 : 400,
                          }}
                        >
                          {m.matchedFields.includes(c.field) && <i className="ri-checkbox-circle-line" style={{ marginRight: 3 }} />}
                          {c.field}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {result.totalMatches > result.sampleMatches.length && (
                  <div style={{ fontSize: 11, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center', paddingTop: 4 }}>
                    + {result.totalMatches - result.sampleMatches.length} {isAr ? 'نتيجة إضافية' : 'more results'}
                  </div>
                )}
              </div>
            )}

            <div style={{ fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace" }}>
              {isAr ? 'وقت الاختبار: ' : 'Tested: '}{result.testedAt}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Condition Builder ─────────────────────────────────────────
function ConditionBuilder({ conditions, domain, isAr, onChange }: {
  conditions: ProfileCondition[];
  domain: ProfileDomain;
  isAr: boolean;
  onChange: (c: ProfileCondition[]) => void;
}) {
  const fields = AVAILABLE_FIELDS[domain] ?? [];
  const CONNECTORS: ConnectorType[] = ['WHERE', 'AND', 'OR'];

  const addCondition = () => {
    onChange([...conditions, {
      id: `c${Date.now()}`, connector: conditions.length === 0 ? 'WHERE' : 'AND',
      field: fields[0] ?? '', operator: 'equals', value: '',
    }]);
  };

  const removeCondition = (id: string) => onChange(conditions.filter(c => c.id !== id));

  const updateCondition = (id: string, patch: Partial<ProfileCondition>) =>
    onChange(conditions.map(c => c.id === id ? { ...c, ...patch } : c));

  const sel = (style?: React.CSSProperties): React.CSSProperties => ({
    padding: '5px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(184,138,60,0.2)', color: '#CBD5E1',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', outline: 'none', ...style,
  });

  return (
    <div>
      {conditions.map((c, i) => (
        <div key={c.id} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
          <select value={c.connector} disabled={i === 0} onChange={e => updateCondition(c.id, { connector: e.target.value as ConnectorType })} style={sel({ width: 70, opacity: i === 0 ? 0.5 : 1 })}>
            {CONNECTORS.map(op => <option key={op} value={op}>{op}</option>)}
          </select>
          <select value={c.field} onChange={e => updateCondition(c.id, { field: e.target.value })} style={sel({ flex: '0 0 160px' })}>
            {fields.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select value={c.operator} onChange={e => updateCondition(c.id, { operator: e.target.value as ConditionOp })} style={sel({ flex: '0 0 120px' })}>
            {OPERATORS.map(op => <option key={op} value={op}>{op.replace('_', ' ')}</option>)}
          </select>
          <input
            value={c.value}
            onChange={e => updateCondition(c.id, { value: e.target.value })}
            placeholder={c.operator === 'range' ? '0,100' : c.operator === 'in_list' ? 'A,B,C' : 'value'}
            style={{ ...sel({ flex: 1, minWidth: 80 }), cursor: 'text' }}
          />
          <button onClick={() => removeCondition(c.id)} style={{ background: 'transparent', border: '1px solid rgba(201,74,94,0.2)', borderRadius: 4, color: '#C94A5E', cursor: 'pointer', padding: '5px 8px', fontSize: 12 }}>
            <i className="ri-delete-bin-line" />
          </button>
        </div>
      ))}
      <button onClick={addCondition} style={{ padding: '6px 12px', borderRadius: 4, background: 'rgba(184,138,60,0.06)', border: '1px dashed rgba(184,138,60,0.2)', color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>
        <i className="ri-add-line" style={{ marginRight: 5 }} />{isAr ? 'إضافة شرط' : '+ Add Condition'}
      </button>
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────
function EditModal({ profile, isAr, onClose }: { profile: RiskProfile | null; isNew: boolean; isAr: boolean; onClose: () => void }) {
  const [form, setForm] = useState<Partial<RiskProfile>>(profile ?? { domain: 'Events', status: 'DRAFT', riskWeight: 50, conditions: [] });

  if (!profile && !form.name) {
    // new profile
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,20,40,0.85)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 640, maxHeight: '80vh', borderRadius: 8, background: '#0A1F38', border: '1px solid rgba(184,138,60,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(184,138,60,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#B8893C', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <i className="ri-edit-box-line" style={{ marginRight: 8 }} />
            {form.id ? (isAr ? 'تعديل النمط' : 'Edit Profile') : (isAr ? 'نمط جديد' : 'New Profile')}
          </span>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid rgba(184,138,60,0.2)', borderRadius: 4, color: '#5B7494', cursor: 'pointer', padding: '4px 8px', fontSize: 14 }}>
            <i className="ri-close-line" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Name */}
          <div>
            <label style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 5 }}>
              {isAr ? 'الاسم' : 'Name'}
            </label>
            <input value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', padding: '7px 10px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,138,60,0.2)', color: '#CBD5E1', fontFamily: "'Inter', sans-serif", fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* Domain + Status + Weight row */}
          <div style={{ display: 'flex', gap: 10 }}>
            {(['domain', 'status'] as const).map(key => (
              <div key={key} style={{ flex: 1 }}>
                <label style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 5 }}>{key}</label>
                <select value={(form[key] as string) ?? ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: '100%', padding: '7px 10px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,138,60,0.2)', color: '#CBD5E1', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, outline: 'none' }}>
                  {key === 'domain' && (['Events', 'Hits', 'Identities', 'Services'] as const).map(d => <option key={d} value={d}>{d}</option>)}
                  {key === 'status' && (['DRAFT', 'ACTIVE', 'SUSPENDED', 'EXPIRED'] as const).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ))}
            <div style={{ flex: '0 0 100px' }}>
              <label style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 5 }}>
                {isAr ? 'الوزن' : 'Weight'} (0–100)
              </label>
              <input type="number" min={0} max={100} value={form.riskWeight ?? 50} onChange={e => setForm(f => ({ ...f, riskWeight: Number(e.target.value) }))} style={{ width: '100%', padding: '7px 10px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,138,60,0.2)', color: '#D6B47E', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, outline: 'none' }} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 5 }}>
              {isAr ? 'الوصف' : 'Description'}
            </label>
            <textarea rows={2} value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ width: '100%', padding: '7px 10px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,138,60,0.2)', color: '#8FA8C0', fontFamily: "'Inter', sans-serif", fontSize: 12, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>

          {/* Condition Builder */}
          <div>
            <label style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>
              {isAr ? 'الشروط' : 'Conditions'}
            </label>
            <ConditionBuilder
              conditions={(form.conditions as ProfileCondition[]) ?? []}
              domain={(form.domain as ProfileDomain) ?? 'Events'}
              isAr={isAr}
              onChange={c => setForm(f => ({ ...f, conditions: c }))}
            />
          </div>
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(184,138,60,0.1)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 4, background: 'transparent', border: '1px solid rgba(184,138,60,0.2)', color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 4, background: 'rgba(184,138,60,0.12)', border: '1px solid rgba(184,138,60,0.3)', color: '#D6B47E', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <i className="ri-save-line" style={{ marginRight: 6 }} />{isAr ? 'حفظ' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Profile Row ───────────────────────────────────────────────
function ProfileRow({ profile, isAr, isSelected, onClick }: { profile: RiskProfile; isAr: boolean; isSelected: boolean; onClick: () => void }) {
  const statusCol = STATUS_COLORS[profile.status];
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', background: isSelected ? 'rgba(184,138,60,0.06)' : 'transparent', borderLeft: `2px solid ${isSelected ? '#B8893C' : 'transparent'}`, transition: 'background 0.1s' }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusCol, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: '#CBD5E1', fontFamily: "'Inter', sans-serif", fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {isAr && profile.nameAr ? profile.nameAr : profile.name}
        </div>
        <div style={{ fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>
          {profile.domain} · {profile.conditions.length} {isAr ? 'شرط' : 'conditions'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 5, flexShrink: 0, alignItems: 'center' }}>
        {profile.matchCount > 0 && (
          <span style={{ fontSize: 10, padding: '2px 5px', borderRadius: 3, background: 'rgba(201,74,94,0.12)', color: '#C94A5E', fontFamily: "'JetBrains Mono', monospace" }}>
            {profile.matchCount}
          </span>
        )}
        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: `${statusCol}18`, color: statusCol, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', border: `1px solid ${statusCol}33` }}>
          {STATUS_LABELS[profile.status]?.[isAr ? 'ar' : 'en']}
        </span>
        <span style={{ fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace" }}>
          {profile.riskWeight}
        </span>
      </div>
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────
function ProfileDetail({ profile, isAr, onEdit, onTest, onClose }: { profile: RiskProfile; isAr: boolean; onEdit: () => void; onTest: () => void; onClose: () => void }) {
  const statusCol = STATUS_COLORS[profile.status];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(184,138,60,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, color: '#CBD5E1', fontFamily: "'Inter', sans-serif", fontWeight: 600, marginBottom: 3 }}>
            {isAr && profile.nameAr ? profile.nameAr : profile.name}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: `${statusCol}18`, color: statusCol, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', border: `1px solid ${statusCol}33` }}>
              {STATUS_LABELS[profile.status]?.[isAr ? 'ar' : 'en']}
            </span>
            <span style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>{profile.domain} · weight: {profile.riskWeight}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          <button onClick={onTest} style={{ padding: '5px 10px', borderRadius: 4, background: 'rgba(184,138,60,0.1)', border: '1px solid rgba(184,138,60,0.25)', color: '#B8893C', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <i className="ri-test-tube-line" style={{ marginRight: 4 }} />{isAr ? 'اختبار' : 'Test'}
          </button>
          <button onClick={onEdit} style={{ padding: '5px 10px', borderRadius: 4, background: 'rgba(74,122,168,0.1)', border: '1px solid rgba(74,122,168,0.25)', color: '#4A7AA8', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <i className="ri-edit-line" style={{ marginRight: 4 }} />{isAr ? 'تعديل' : 'Edit'}
          </button>
          <button onClick={onClose} style={{ padding: '5px 8px', borderRadius: 4, background: 'transparent', border: '1px solid rgba(184,138,60,0.15)', color: '#5B7494', fontSize: 14, cursor: 'pointer' }}>
            <i className="ri-close-line" />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Description */}
        <div style={{ fontSize: 12, color: '#8FA8C0', fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>{profile.description}</div>

        {/* Conditions */}
        <div>
          <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
            {isAr ? 'الشروط' : 'Conditions'}
          </div>
          {profile.conditions.map(c => (
            <div key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: 'rgba(91,116,148,0.12)', color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", width: 52, textAlign: 'center', flexShrink: 0 }}>{c.connector}</span>
              <span style={{ fontSize: 11, color: '#D6B47E', fontFamily: "'JetBrains Mono', monospace", flex: '0 0 150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.field}</span>
              <span style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", flex: '0 0 90px' }}>{c.operator}</span>
              <span style={{ fontSize: 11, color: '#CBD5E1', fontFamily: "'JetBrains Mono', monospace", flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.value}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 14, padding: '10px 0', borderTop: '1px solid rgba(184,138,60,0.06)' }}>
          <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
            <i className="ri-checkbox-circle-line" style={{ color: '#C94A5E', marginRight: 5 }} />{profile.matchCount} {isAr ? 'تطابق' : 'matches'}
          </span>
          <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
            <i className="ri-calendar-line" style={{ marginRight: 5 }} />{isAr ? 'أُنشئ: ' : 'Created: '}{profile.createdDate}
          </span>
          {profile.lastTested && (
            <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
              <i className="ri-test-tube-line" style={{ marginRight: 5 }} />{isAr ? 'اختُبر: ' : 'Tested: '}{profile.lastTested?.slice(0, 10)}
            </span>
          )}
        </div>

        {/* Activity log */}
        <div>
          <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
            {isAr ? 'سجل النشاط' : 'Activity Log'}
          </div>
          {profile.activityLog.slice().reverse().map(l => (
            <div key={l.id} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, minWidth: 80 }}>{l.timestamp.slice(0, 10)}</span>
              <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: 'rgba(184,138,60,0.08)', color: '#B8893C', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{l.action}</span>
              <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'Inter', sans-serif" }}>{l.user}{l.detail ? ` — ${l.detail}` : ''}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        {profile.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {profile.tags.map(t => (
              <span key={t} style={{ padding: '2px 7px', borderRadius: 3, fontSize: 10, background: 'rgba(184,138,60,0.08)', color: '#B8893C', fontFamily: "'JetBrains Mono', monospace", border: '1px solid rgba(184,138,60,0.15)' }}>#{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function ManageProfilesPage() {
  const { isAr } = useOutletContext<DashboardOutletContext>();

  const [profiles]        = useState<RiskProfile[]>(MOCK_PROFILES);
  const [search,  setSearch]  = useState('');
  const [statusF, setStatusF] = useState<ProfileStatus | ''>('');
  const [domainF, setDomainF] = useState<ProfileDomain | ''>('');
  const [selected, setSelected] = useState<RiskProfile | null>(null);
  const [editing,  setEditing]  = useState<RiskProfile | null | 'new'>(null);
  const [testing,  setTesting]  = useState(false);

  const filtered = profiles.filter(p => {
    if (statusF && p.status !== statusF) return false;
    if (domainF && p.domain !== domainF) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.nameAr ?? '').includes(q) || p.tags.some(t => t.includes(q));
    }
    return true;
  });

  const chipStyle = (active: boolean, color = '#B8893C'): React.CSSProperties => ({
    padding: '4px 10px', borderRadius: 4, fontSize: 10, cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em',
    background: active ? `${color}20` : 'transparent',
    border: `1px solid ${active ? color : 'rgba(184,138,60,0.15)'}`,
    color: active ? color : '#5B7494', textTransform: 'uppercase',
  });

  const active   = profiles.filter(p => p.status === 'ACTIVE').length;
  const totalHits = profiles.reduce((s, p) => s + p.matchCount, 0);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#051428', overflow: 'hidden', position: 'relative' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(184,138,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.025) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 24px 12px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <i className="ri-file-settings-line" style={{ color: '#B8893C', fontSize: 16 }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#B8893C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {isAr ? 'إدارة الأنماط' : 'Manage Profiles'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
                {[
                  { val: profiles.length, label: isAr ? 'إجمالي' : 'total',   icon: 'ri-file-list-line',    color: '#5B7494' },
                  { val: active,          label: isAr ? 'نشط' : 'active',     icon: 'ri-radio-button-line', color: '#4A8E5A' },
                  { val: totalHits,       label: isAr ? 'تطابق' : 'matches',  icon: 'ri-checkbox-multiple-line', color: '#C94A5E' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className={s.icon} style={{ color: s.color, fontSize: 13 }} />
                    <span style={{ fontSize: 17, fontFamily: "'JetBrains Mono', monospace", color: s.color, fontWeight: 700, lineHeight: 1 }}>{s.val}</span>
                    <span style={{ fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setEditing('new')} style={{ padding: '8px 14px', borderRadius: 4, background: 'rgba(184,138,60,0.12)', border: '1px solid rgba(184,138,60,0.3)', color: '#D6B47E', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="ri-add-line" />{isAr ? 'نمط جديد' : 'New Profile'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ padding: '8px 24px', borderBottom: '1px solid rgba(184,138,60,0.08)', flexShrink: 0, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '0 0 240px' }}>
            <i className="ri-search-line" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#5B7494', fontSize: 12, pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={isAr ? 'بحث…' : 'Search profiles…'} style={{ width: '100%', padding: '6px 10px 6px 28px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,138,60,0.2)', color: '#CBD5E1', fontFamily: "'Inter', sans-serif", fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {(['ACTIVE', 'DRAFT', 'EXPIRED', 'SUSPENDED'] as ProfileStatus[]).map(s => (
            <button key={s} onClick={() => setStatusF(prev => prev === s ? '' : s)} style={chipStyle(statusF === s, STATUS_COLORS[s])}>{s}</button>
          ))}
          {(['Events', 'Hits', 'Identities', 'Services'] as ProfileDomain[]).map(d => (
            <button key={d} onClick={() => setDomainF(prev => prev === d ? '' : d)} style={chipStyle(domainF === d)}>{d}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* List */}
          <div style={{ flex: selected ? '0 0 38%' : '1', overflowY: 'auto', borderRight: selected ? '1px solid rgba(184,138,60,0.08)' : 'none' }}>
            <div style={{ padding: '7px 14px', fontSize: 11, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              {filtered.length} {isAr ? 'نمط' : 'profiles'}
            </div>
            {filtered.map(p => (
              <ProfileRow key={p.id} profile={p} isAr={isAr} isSelected={selected?.id === p.id} onClick={() => { setSelected(prev => prev?.id === p.id ? null : p); setTesting(false); }} />
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: '#374B61', fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                {isAr ? 'لا توجد نتائج' : 'No profiles match filters'}
              </div>
            )}
          </div>

          {/* Detail + optional test panel */}
          {selected && (
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
              <div style={{ flex: testing ? '0 0 55%' : 1, overflowY: 'auto' }}>
                <ProfileDetail profile={selected} isAr={isAr} onEdit={() => setEditing(selected)} onTest={() => setTesting(t => !t)} onClose={() => { setSelected(null); setTesting(false); }} />
              </div>
              {testing && (
                <div style={{ flex: '0 0 45%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <TestProfilePanel profile={selected} isAr={isAr} onClose={() => setTesting(false)} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <EditModal
          profile={editing === 'new' ? null : editing}
          isNew={editing === 'new'}
          isAr={isAr}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
