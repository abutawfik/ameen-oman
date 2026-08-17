import { useState } from 'react';
import type { SearchResult, ResultView } from '@/mocks/searchData';
import ResultTableView from './ResultTableView';
import ResultCardView from './ResultCardView';

interface Props {
  results: SearchResult[];
  isAr: boolean;
  loading?: boolean;
}

export default function SearchResultsView({ results, isAr, loading }: Props) {
  const [view, setView] = useState<ResultView>('table');

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
        <i className="ri-loader-2-line" style={{ marginRight: 8, animation: 'spin 1s linear infinite' }} />
        {isAr ? 'جارٍ البحث…' : 'Searching…'}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <i className="ri-search-line" style={{ fontSize: 36, color: '#374B61', display: 'block', marginBottom: 12 }} />
        <div style={{ color: '#5B7494', fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
          {isAr ? 'لا توجد نتائج' : 'No results'}
        </div>
        <div style={{ color: '#374B61', fontFamily: "'Inter', sans-serif", fontSize: 12, marginTop: 6 }}>
          {isAr ? 'حاول تعديل معايير البحث أو تفعيل التطابق الصوتي' : 'Try adjusting your query or enabling phonetic matching'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* View toggle */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 16px', borderBottom: '1px solid rgba(184,138,60,0.08)', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace', marginRight: 8" }}>
          {isAr ? 'عرض:' : 'View:'}
        </span>
        {(['table', 'card'] as ResultView[]).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: '4px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer',
              background: view === v ? 'rgba(184,138,60,0.15)' : 'transparent',
              border: `1px solid ${view === v ? 'rgba(184,138,60,0.4)' : 'rgba(184,138,60,0.15)'}`,
              color: view === v ? '#D6B47E' : '#5B7494',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <i className={v === 'table' ? 'ri-table-line' : 'ri-layout-grid-line'} style={{ marginRight: 5 }} />
            {v === 'table' ? (isAr ? 'جدول' : 'Table') : (isAr ? 'بطاقات' : 'Cards')}
          </button>
        ))}
      </div>

      {/* Results */}
      {view === 'table'
        ? <ResultTableView results={results} isAr={isAr} />
        : <ResultCardView  results={results} isAr={isAr} />
      }
    </div>
  );
}
