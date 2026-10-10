import { searchRecords, queryRecords } from '@/workflows/search';
import { useState } from 'react';
import type { SearchDomain, QueryCondition, SavedQuery } from '@/mocks/searchData';
import { MOCK_SEARCH_RESULTS } from '@/mocks/searchData';
import GeneralSearchBar from './GeneralSearchBar';
import QueryBuilder from './QueryBuilder';
import SavedQueriesPanel from './SavedQueriesPanel';
import SearchResultsView from './SearchResultsView';

interface Props { isAr: boolean }

type Mode = 'general' | 'builder';

export default function AdHocSearch({ isAr }: Props) {
  const [mode, setMode]             = useState<Mode>('general');
  const [domain, setDomain]         = useState<SearchDomain>('events');
  const [results, setResults]       = useState(MOCK_SEARCH_RESULTS);
  const [searched, setSearched]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [showSaved, setShowSaved]   = useState(false);

  const runLocalQuery = (cb: () => void) => { cb(); setLoading(false); setSearched(true); };

  const handleGeneralSearch = (query: string, phonetic = false, searchDomain = domain) => {
    runLocalQuery(() => setResults(searchRecords(MOCK_SEARCH_RESULTS, searchDomain, query, phonetic)));
  };
  const handleBuilderSearch = (conditions: QueryCondition[], searchDomain = domain) => {
    runLocalQuery(() => setResults(queryRecords(MOCK_SEARCH_RESULTS, searchDomain, conditions)));
  };
  const handleSavedRun = (q: SavedQuery) => {
    setMode(q.mode);
    setDomain(q.domain);
    if (q.mode === 'general') handleGeneralSearch(q.query ?? '', false, q.domain);
    else handleBuilderSearch(q.conditions ?? [], q.domain);
    setShowSaved(false);
  };
  const changeDomain = (next: SearchDomain) => { setDomain(next); setSearched(false); setResults([]); };

  const modeBtn = (m: Mode) => ({
    padding: '5px 14px', borderRadius: 4, fontSize: 11, cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em',
    background: mode === m ? 'rgba(184,138,60,0.15)' : 'transparent',
    border: `1px solid ${mode === m ? 'rgba(184,138,60,0.4)' : 'rgba(184,138,60,0.15)'}`,
    color: mode === m ? '#C5A365' : '#5B7494',
  });

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Search controls */}
        <div style={{ padding: 16, borderBottom: '1px solid rgba(184,138,60,0.08)', background: 'rgba(5,20,40,0.4)' }}>
          {/* Mode selector + saved queries toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={modeBtn('general')} onClick={() => setMode('general')}>
                <i className="ri-text-snippet" style={{ marginRight: 5 }} />
                {isAr ? 'بحث عام' : 'General'}
              </button>
              <button style={modeBtn('builder')} onClick={() => setMode('builder')}>
                <i className="ri-list-settings-line" style={{ marginRight: 5 }} />
                {isAr ? 'منشئ الاستعلامات' : 'Query Builder'}
              </button>
            </div>
            <button
              onClick={() => setShowSaved(s => !s)}
              style={{
                padding: '5px 12px', borderRadius: 4, fontSize: 11, cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace",
                background: showSaved ? 'rgba(184,138,60,0.15)' : 'transparent',
                border: `1px solid ${showSaved ? 'rgba(184,138,60,0.4)' : 'rgba(184,138,60,0.15)'}`,
                color: showSaved ? '#C5A365' : '#5B7494',
              }}
            >
              <i className="ri-bookmark-line" style={{ marginRight: 5 }} />
              {isAr ? 'محفوظة' : 'Saved Queries'}
            </button>
          </div>

          {mode === 'general'
            ? <GeneralSearchBar domain={domain} onDomainChange={changeDomain} onSearch={handleGeneralSearch} isAr={isAr} />
            : <QueryBuilder key={domain} domain={domain} onSearch={handleBuilderSearch} isAr={isAr} />
          }
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {searched || loading
            ? <SearchResultsView results={results} isAr={isAr} loading={loading} />
            : (
              <div style={{ padding: 48, textAlign: 'center' }}>
                <i className="ri-search-2-line" style={{ fontSize: 40, color: '#1A3550', display: 'block', marginBottom: 14 }} />
                <div style={{ color: '#374B61', fontFamily: "'Manrope', sans-serif", fontSize: 14 }}>
                  {isAr ? 'أدخل معايير البحث أعلاه' : 'Enter search criteria above'}
                </div>
                <div style={{ color: '#1A3550', fontFamily: "'Manrope', sans-serif", fontSize: 12, marginTop: 6 }}>
                  {isAr ? 'يدعم البحث الصوتي وبمنشئ الاستعلامات المتقدم' : 'Supports phonetic matching and advanced query builder'}
                </div>
              </div>
            )
          }
        </div>
      </div>

      {/* Saved queries panel */}
      {showSaved && (
        <div style={{ width: 280, borderLeft: '1px solid rgba(184,138,60,0.1)', background: 'rgba(5,20,40,0.5)', flexShrink: 0, overflow: 'hidden' }}>
          <SavedQueriesPanel isAr={isAr} onRun={handleSavedRun} />
        </div>
      )}
    </div>
  );
}
