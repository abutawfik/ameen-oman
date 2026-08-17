import { useState } from 'react';
import type { SavedQuery } from '@/mocks/searchData';
import { MOCK_SAVED_QUERIES } from '@/mocks/searchData';

interface Props {
  isAr: boolean;
  onRun: (q: SavedQuery) => void;
}

export default function SavedQueriesPanel({ isAr, onRun }: Props) {
  const [queries, setQueries] = useState<SavedQuery[]>(MOCK_SAVED_QUERIES);

  const removeQuery = (id: string) => setQueries(prev => prev.filter(q => q.id !== id));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(184,138,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#B8893C', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {isAr ? 'الاستعلامات المحفوظة' : 'Saved Queries'}
        </span>
        <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>{queries.length}</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {queries.map(q => (
          <div
            key={q.id}
            style={{
              padding: 12, borderRadius: 6,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(184,138,60,0.12)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#CBD5E1', fontFamily: "'Inter', sans-serif", lineHeight: 1.4 }}>{q.name}</span>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button
                  onClick={() => onRun(q)}
                  style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer', background: 'rgba(184,138,60,0.15)', border: '1px solid rgba(184,138,60,0.3)', color: '#D6B47E', fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {isAr ? 'تشغيل' : 'Run'}
                </button>
                <button
                  onClick={() => removeQuery(q.id)}
                  style={{ padding: '3px 6px', borderRadius: 4, fontSize: 11, cursor: 'pointer', background: 'rgba(201,74,94,0.08)', border: '1px solid rgba(201,74,94,0.2)', color: '#C94A5E' }}
                >
                  <i className="ri-delete-bin-line" />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: 'rgba(91,116,148,0.15)', color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                {q.domain}
              </span>
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: 'rgba(91,116,148,0.15)', color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
                {q.mode}
              </span>
              {q.isShared && (
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: 'rgba(74,158,90,0.1)', color: '#4A9E5A', fontFamily: "'JetBrains Mono', monospace" }}>
                  shared
                </span>
              )}
            </div>

            {q.lastRun && (
              <div style={{ marginTop: 6, fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace" }}>
                {isAr ? 'آخر تشغيل:' : 'Last run:'} {q.lastRun}
              </div>
            )}
          </div>
        ))}
        {queries.length === 0 && (
          <div style={{ textAlign: 'center', color: '#374B61', fontSize: 12, marginTop: 24, fontFamily: "'Inter', sans-serif" }}>
            {isAr ? 'لا توجد استعلامات محفوظة' : 'No saved queries'}
          </div>
        )}
      </div>
    </div>
  );
}
