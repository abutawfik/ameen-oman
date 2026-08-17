import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '../DashboardLayout';
import type { RiskRule, MatchDecisionRule, RuleType, ActionType, RuleStatus } from '@/mocks/riskRulesData';
import { RISK_RULES, DECISION_RULES, RULE_TYPE_CONFIG, ACTION_TYPE_CONFIG } from '@/mocks/riskRulesData';

type Tab = 'rules' | 'decisions';

const STATUS_COLORS: Record<RuleStatus, string> = {
  ACTIVE: '#4A8E5A', INACTIVE: '#374B61', DRAFT: '#5B7494',
};

// ── Weight Bar ────────────────────────────────────────────────
function WeightBar({ weight }: { weight: number }) {
  const color = weight >= 80 ? '#C94A5E' : weight >= 60 ? '#D4922A' : '#D6B47E';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ width: `${weight}%`, height: '100%', background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 11, color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, minWidth: 28, textAlign: 'right' }}>{weight}</span>
    </div>
  );
}

// ── Risk Rule Detail ──────────────────────────────────────────
function RuleDetail({ rule, isAr, onClose }: { rule: RiskRule; isAr: boolean; onClose: () => void }) {
  const cfg = RULE_TYPE_CONFIG[rule.type];
  const statusCol = STATUS_COLORS[rule.status];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(184,138,60,0.08)', background: 'rgba(5,20,40,0.6)' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(184,138,60,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, color: '#CBD5E1', fontFamily: "'Inter', sans-serif", fontWeight: 600, marginBottom: 4 }}>
            {isAr && rule.nameAr ? rule.nameAr : rule.name}
          </div>
          <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: `${cfg.color}18`, color: cfg.color, fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${cfg.color}33` }}>
              <i className={cfg.icon} style={{ marginRight: 4 }} />{isAr ? '' : cfg.labelEn}
            </span>
            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: `${statusCol}18`, color: statusCol, fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${statusCol}33`, textTransform: 'uppercase' }}>
              {rule.status}
            </span>
          </div>
        </div>
        <button onClick={onClose} style={{ padding: '5px 8px', borderRadius: 4, background: 'transparent', border: '1px solid rgba(184,138,60,0.15)', color: '#5B7494', cursor: 'pointer', fontSize: 14 }}>
          <i className="ri-close-line" />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 12, color: '#8FA8C0', fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>{rule.description}</div>

        {/* Score params */}
        <div style={{ padding: '10px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(184,138,60,0.08)' }}>
          <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            {isAr ? 'معاملات التسجيل' : 'Scoring Parameters'}
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", marginBottom: 5 }}>
              {isAr ? 'الوزن' : 'Weight'}
            </div>
            <WeightBar weight={rule.weight} />
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { label: isAr ? 'نطاق الدرجات' : 'Score Range', val: `${rule.minScore} – ${rule.maxScore}` },
              { label: isAr ? 'نطاق التاريخ' : 'Date Range',  val: `${rule.activeDateFrom}${rule.activeDateTo ? ` → ${rule.activeDateTo}` : ' → ∞'}` },
              { label: isAr ? 'النطاق الجغرافي' : 'Location', val: rule.locationScope },
            ].map(r => (
              <div key={r.label}>
                <div style={{ fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>{r.label}</div>
                <div style={{ fontSize: 11, color: '#D6B47E', fontFamily: "'JetBrains Mono', monospace" }}>{r.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, padding: '8px 0', borderTop: '1px solid rgba(184,138,60,0.06)' }}>
          <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
            <i className="ri-lightning-line" style={{ color: '#D4922A', marginRight: 5 }} />{rule.triggerCount} {isAr ? 'تفعيل' : 'triggers'}
          </span>
          {rule.lastTriggered && (
            <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
              <i className="ri-time-line" style={{ marginRight: 5 }} />{isAr ? 'آخر: ' : 'Last: '}{rule.lastTriggered}
            </span>
          )}
          <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
            <i className="ri-user-line" style={{ marginRight: 5 }} />{rule.createdBy}
          </span>
        </div>
      </div>

      {/* Edit action */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(184,138,60,0.08)', display: 'flex', gap: 6 }}>
        <button style={{ flex: 1, padding: '7px', borderRadius: 4, background: 'rgba(74,122,168,0.1)', border: '1px solid rgba(74,122,168,0.25)', color: '#4A7AA8', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <i className="ri-edit-line" style={{ marginRight: 5 }} />{isAr ? 'تعديل' : 'Edit Rule'}
        </button>
        <button style={{ flex: 1, padding: '7px', borderRadius: 4, background: rule.status === 'ACTIVE' ? 'rgba(212,146,42,0.08)' : 'rgba(74,142,90,0.08)', border: `1px solid ${rule.status === 'ACTIVE' ? 'rgba(212,146,42,0.2)' : 'rgba(74,142,90,0.2)'}`, color: rule.status === 'ACTIVE' ? '#D4922A' : '#4A8E5A', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {rule.status === 'ACTIVE' ? (isAr ? 'تعليق' : 'Deactivate') : (isAr ? 'تفعيل' : 'Activate')}
        </button>
      </div>
    </div>
  );
}

// ── Decision Detail ───────────────────────────────────────────
function DecisionDetail({ rule, isAr, onClose }: { rule: MatchDecisionRule; isAr: boolean; onClose: () => void }) {
  const cfg = ACTION_TYPE_CONFIG[rule.actionType];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(184,138,60,0.08)', background: 'rgba(5,20,40,0.6)' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(184,138,60,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, color: '#CBD5E1', fontFamily: "'Inter', sans-serif", fontWeight: 600, marginBottom: 4 }}>
            {isAr && rule.nameAr ? rule.nameAr : rule.name}
          </div>
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: `${cfg.color}18`, color: cfg.color, fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${cfg.color}33` }}>
            <i className={cfg.icon} style={{ marginRight: 4 }} />{isAr ? cfg.labelAr : cfg.labelEn}
          </span>
        </div>
        <button onClick={onClose} style={{ padding: '5px 8px', borderRadius: 4, background: 'transparent', border: '1px solid rgba(184,138,60,0.15)', color: '#5B7494', cursor: 'pointer', fontSize: 14 }}>
          <i className="ri-close-line" />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 12, color: '#8FA8C0', fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>{rule.description}</div>

        <div style={{ padding: '10px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(184,138,60,0.08)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>{isAr ? 'الحد الأدنى للتفعيل' : 'Trigger Threshold'}</div>
            <div style={{ fontSize: 22, color: cfg.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>≥ {rule.threshold}</div>
          </div>
          {rule.emailRecipients.length > 0 && (
            <div>
              <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", marginBottom: 5 }}>{isAr ? 'المستلمون' : 'Email Recipients'}</div>
              {rule.emailRecipients.map(r => (
                <div key={r} style={{ fontSize: 11, color: '#8FA8C0', fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>
                  <i className="ri-mail-line" style={{ marginRight: 6, color: '#5B7494' }} />{r}
                </div>
              ))}
            </div>
          )}
          {rule.workflowId && (
            <div>
              <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>{isAr ? 'سير العمل' : 'Workflow'}</div>
              <div style={{ fontSize: 11, color: '#D6B47E', fontFamily: "'JetBrains Mono', monospace" }}>{rule.workflowId}</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 16, padding: '8px 0', borderTop: '1px solid rgba(184,138,60,0.06)' }}>
          <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
            <i className="ri-lightning-line" style={{ color: '#D4922A', marginRight: 5 }} />{rule.triggerCount} {isAr ? 'تفعيل' : 'triggers'}
          </span>
          {rule.lastTriggered && (
            <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
              <i className="ri-time-line" style={{ marginRight: 5 }} />{rule.lastTriggered}
            </span>
          )}
        </div>
      </div>
      <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(184,138,60,0.08)' }}>
        <button style={{ width: '100%', padding: '7px', borderRadius: 4, background: 'rgba(74,122,168,0.1)', border: '1px solid rgba(74,122,168,0.25)', color: '#4A7AA8', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <i className="ri-edit-line" style={{ marginRight: 5 }} />{isAr ? 'تعديل' : 'Edit Rule'}
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function RiskRulesPage() {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [tab, setTab]             = useState<Tab>('rules');
  const [selRule, setSelRule]     = useState<RiskRule | null>(null);
  const [selDecision, setSelDecision] = useState<MatchDecisionRule | null>(null);
  const [typeFilter, setTypeFilter] = useState<RuleType | ''>('');
  const [search, setSearch]       = useState('');

  const filteredRules = RISK_RULES.filter(r => {
    if (typeFilter && r.type !== typeFilter) return false;
    if (search) { const q = search.toLowerCase(); return r.name.toLowerCase().includes(q); }
    return true;
  });

  const filteredDecisions = DECISION_RULES.filter(d => {
    if (search) { const q = search.toLowerCase(); return d.name.toLowerCase().includes(q); }
    return true;
  });

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 18px', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
    borderBottom: `2px solid ${active ? '#B8893C' : 'transparent'}`,
    color: active ? '#D6B47E' : '#5B7494', cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
    transition: 'color 0.15s',
  });

  const chipStyle = (active: boolean, color = '#B8893C'): React.CSSProperties => ({
    padding: '4px 10px', borderRadius: 4, fontSize: 10, cursor: 'pointer', background: 'transparent',
    fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${active ? color : 'rgba(184,138,60,0.15)'}`,
    color: active ? color : '#5B7494', textTransform: 'uppercase',
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#051428', overflow: 'hidden', position: 'relative' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(184,138,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.025) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 24px 10px', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
              <i className="ri-settings-3-line" style={{ color: '#B8893C', fontSize: 16 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#B8893C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {isAr ? 'إدارة قواعد المخاطر' : 'Risk Rules Management'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: '#374B61', fontFamily: "'Inter', sans-serif" }}>
              {isAr ? 'قواعد تسجيل المخاطر وإجراءات التطابق' : 'Define scoring weights and automated actions for risk match decisions'}
            </p>
          </div>
          <button style={{ padding: '8px 14px', borderRadius: 4, background: 'rgba(184,138,60,0.12)', border: '1px solid rgba(184,138,60,0.3)', color: '#D6B47E', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="ri-add-line" />{isAr ? 'قاعدة جديدة' : 'New Rule'}
          </button>
        </div>

        {/* Tab bar */}
        <div style={{ flexShrink: 0, borderBottom: '1px solid rgba(184,138,60,0.1)', background: 'rgba(5,20,40,0.5)', display: 'flex', alignItems: 'flex-end', paddingLeft: 24 }}>
          <button style={tabBtnStyle(tab === 'rules')}     onClick={() => { setTab('rules');     setSelRule(null); }}>
            <i className="ri-scales-3-line" style={{ marginRight: 7 }} />{isAr ? 'قواعد التسجيل' : 'Scoring Rules'} ({RISK_RULES.length})
          </button>
          <button style={tabBtnStyle(tab === 'decisions')} onClick={() => { setTab('decisions'); setSelDecision(null); }}>
            <i className="ri-git-branch-line" style={{ marginRight: 7 }} />{isAr ? 'قواعد الإجراءات' : 'Decision Rules'} ({DECISION_RULES.length})
          </button>
        </div>

        {/* Filters */}
        <div style={{ padding: '8px 24px', borderBottom: '1px solid rgba(184,138,60,0.06)', flexShrink: 0, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', background: 'rgba(5,20,40,0.3)' }}>
          <div style={{ position: 'relative', flex: '0 0 220px' }}>
            <i className="ri-search-line" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#5B7494', fontSize: 12, pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={isAr ? 'بحث…' : 'Filter…'} style={{ width: '100%', padding: '5px 10px 5px 28px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,138,60,0.15)', color: '#CBD5E1', fontFamily: "'Inter', sans-serif", fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {tab === 'rules' && (['WATCHLIST_MATCH', 'PROFILE_MATCH', 'DOCUMENT_VALIDATION', 'EXTERNAL_SOURCE'] as RuleType[]).map(t => {
            const cfg = RULE_TYPE_CONFIG[t];
            return <button key={t} onClick={() => setTypeFilter(prev => prev === t ? '' : t)} style={chipStyle(typeFilter === t, cfg.color)}><i className={cfg.icon} style={{ marginRight: 4 }} />{cfg.labelEn}</button>;
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Table */}
          <div style={{ flex: (selRule || selDecision) ? '0 0 52%' : 1, overflowX: 'auto', overflowY: 'auto' }}>
            {tab === 'rules' && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(184,138,60,0.1)', background: 'rgba(5,20,40,0.7)' }}>
                    {[isAr ? 'الاسم' : 'Name', isAr ? 'النوع' : 'Type', isAr ? 'الوزن' : 'Weight', isAr ? 'الحالة' : 'Status', isAr ? 'التفعيلات' : 'Triggers'].map(h => (
                      <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRules.map(r => {
                    const cfg = RULE_TYPE_CONFIG[r.type];
                    const statusCol = STATUS_COLORS[r.status];
                    return (
                      <tr key={r.id} onClick={() => setSelRule(prev => prev?.id === r.id ? null : r)} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', background: selRule?.id === r.id ? 'rgba(184,138,60,0.06)' : 'transparent' }}>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ fontSize: 12, color: '#CBD5E1', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{isAr && r.nameAr ? r.nameAr : r.name}</div>
                          <div style={{ fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{r.id}</div>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: `${cfg.color}18`, color: cfg.color, fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${cfg.color}33`, whiteSpace: 'nowrap' }}>
                            <i className={cfg.icon} style={{ marginRight: 4 }} />{cfg.labelEn}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', minWidth: 100 }}>
                          <WeightBar weight={r.weight} />
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: `${statusCol}18`, color: statusCol, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', border: `1px solid ${statusCol}33` }}>
                            {r.status}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', fontSize: 12, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
                          {r.triggerCount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {tab === 'decisions' && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(184,138,60,0.1)', background: 'rgba(5,20,40,0.7)' }}>
                    {[isAr ? 'الاسم' : 'Name', isAr ? 'الإجراء' : 'Action', isAr ? 'الحد' : 'Threshold', isAr ? 'التفعيلات' : 'Triggers', isAr ? 'آخر تفعيل' : 'Last Triggered'].map(h => (
                      <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredDecisions.map(d => {
                    const cfg = ACTION_TYPE_CONFIG[d.actionType];
                    return (
                      <tr key={d.id} onClick={() => setSelDecision(prev => prev?.id === d.id ? null : d)} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', background: selDecision?.id === d.id ? 'rgba(184,138,60,0.06)' : 'transparent' }}>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ fontSize: 12, color: '#CBD5E1', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{isAr && d.nameAr ? d.nameAr : d.name}</div>
                          <div style={{ fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{d.id}</div>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: `${cfg.color}18`, color: cfg.color, fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${cfg.color}33`, whiteSpace: 'nowrap' }}>
                            <i className={cfg.icon} style={{ marginRight: 4 }} />{isAr ? cfg.labelAr : cfg.labelEn}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', fontSize: 13, color: cfg.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                          ≥ {d.threshold}
                        </td>
                        <td style={{ padding: '10px 14px', fontSize: 12, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>{d.triggerCount}</td>
                        <td style={{ padding: '10px 14px', fontSize: 11, color: '#374B61', fontFamily: "'JetBrains Mono', monospace" }}>{d.lastTriggered ?? '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Detail panel */}
          {selRule && (
            <div style={{ flex: '0 0 48%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <RuleDetail rule={selRule} isAr={isAr} onClose={() => setSelRule(null)} />
            </div>
          )}
          {selDecision && (
            <div style={{ flex: '0 0 48%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <DecisionDetail rule={selDecision} isAr={isAr} onClose={() => setSelDecision(null)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
