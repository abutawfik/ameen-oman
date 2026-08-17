import { useState } from 'react';
import type { SearchDomain, QueryCondition } from '@/mocks/searchData';
import { QUERY_FIELDS, QUERY_OPERATORS } from '@/mocks/searchData';

interface Props {
  domain: SearchDomain;
  onSearch: (conditions: QueryCondition[]) => void;
  isAr: boolean;
}

const inputStyle = {
  padding: '6px 10px', borderRadius: 4, fontSize: 12,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(184,138,60,0.2)',
  color: '#CBD5E1',
  fontFamily: "'JetBrains Mono', monospace",
  outline: 'none',
};

let _nextId = 1;
const newId = () => `cond-${_nextId++}`;

export default function QueryBuilder({ domain, onSearch, isAr }: Props) {
  const [conditions, setConditions] = useState<QueryCondition[]>([
    { id: newId(), field: QUERY_FIELDS[domain][0].value, operator: 'equals', value: '', connector: 'AND' },
  ]);

  const fields = QUERY_FIELDS[domain];

  const updateCondition = (id: string, patch: Partial<QueryCondition>) =>
    setConditions(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));

  const addCondition = () =>
    setConditions(prev => [...prev, { id: newId(), field: fields[0].value, operator: 'equals', value: '', connector: 'AND' }]);

  const removeCondition = (id: string) =>
    setConditions(prev => prev.filter(c => c.id !== id));

  const getOperators = (field: string) => {
    const f = fields.find(f => f.value === field);
    return f ? QUERY_OPERATORS[f.type] : QUERY_OPERATORS['text'];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {conditions.map((cond, idx) => (
        <div key={cond.id} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* AND/OR connector (not on first row) */}
          {idx > 0 && (
            <select
              value={cond.connector}
              onChange={e => updateCondition(cond.id, { connector: e.target.value as 'AND' | 'OR' })}
              style={{ ...inputStyle, width: 64 }}
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          )}
          {idx === 0 && <span style={{ width: 64, fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>WHERE</span>}

          {/* Field */}
          <select
            value={cond.field}
            onChange={e => updateCondition(cond.id, { field: e.target.value, operator: getOperators(e.target.value)[0] })}
            style={{ ...inputStyle, minWidth: 160 }}
          >
            {fields.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>

          {/* Operator */}
          <select
            value={cond.operator}
            onChange={e => updateCondition(cond.id, { operator: e.target.value })}
            style={{ ...inputStyle, minWidth: 120 }}
          >
            {getOperators(cond.field).map(op => <option key={op} value={op}>{op.replace(/_/g, ' ')}</option>)}
          </select>

          {/* Value */}
          <input
            value={cond.value}
            onChange={e => updateCondition(cond.id, { value: e.target.value })}
            placeholder="value…"
            style={{ ...inputStyle, flex: 1, minWidth: 120 }}
          />

          {/* Remove */}
          {conditions.length > 1 && (
            <button
              onClick={() => removeCondition(cond.id)}
              style={{ padding: '4px 8px', borderRadius: 4, background: 'rgba(201,74,94,0.1)', border: '1px solid rgba(201,74,94,0.3)', color: '#C94A5E', cursor: 'pointer', fontSize: 13 }}
              title="Remove"
            >
              <i className="ri-close-line" />
            </button>
          )}
        </div>
      ))}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button
          onClick={addCondition}
          style={{
            padding: '6px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 12,
            background: 'transparent', border: '1px solid rgba(184,138,60,0.3)', color: '#B8893C',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <i className="ri-add-line" style={{ marginRight: 5 }} />
          {isAr ? 'إضافة شرط' : 'Add Condition'}
        </button>
        <button
          onClick={() => onSearch(conditions)}
          style={{
            padding: '6px 20px', borderRadius: 4, cursor: 'pointer', fontSize: 12,
            background: 'rgba(184,138,60,0.2)', border: '1px solid rgba(184,138,60,0.4)', color: '#D6B47E',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <i className="ri-search-line" style={{ marginRight: 5 }} />
          {isAr ? 'تشغيل الاستعلام' : 'Run Query'}
        </button>
      </div>
    </div>
  );
}
