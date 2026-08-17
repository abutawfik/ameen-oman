import { useState } from 'react';
import type { SearchDomain } from '@/mocks/searchData';

interface Props {
  domain: SearchDomain;
  onDomainChange: (d: SearchDomain) => void;
  onSearch: (query: string, phonetic: boolean) => void;
  isAr: boolean;
}

const DOMAINS: { value: SearchDomain; labelEn: string; labelAr: string; icon: string }[] = [
  { value: 'events',     labelEn: 'Events',     labelAr: 'الأحداث',     icon: 'ri-calendar-event-line' },
  { value: 'hits',       labelEn: 'Hits',       labelAr: 'التطابقات',   icon: 'ri-alarm-warning-line'  },
  { value: 'identities', labelEn: 'Identities', labelAr: 'الهويات',     icon: 'ri-user-3-line'         },
  { value: 'services',   labelEn: 'Services',   labelAr: 'الخدمات',     icon: 'ri-flight-land-line'    },
];

const chip = (active: boolean) => ({
  padding: '4px 12px', borderRadius: 4, fontSize: 11, cursor: 'pointer',
  fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em',
  border: `1px solid ${active ? '#B8893C' : 'rgba(184,138,60,0.2)'}`,
  background: active ? 'rgba(184,138,60,0.15)' : 'transparent',
  color: active ? '#D6B47E' : '#5B7494', transition: 'all 0.15s',
});

export default function GeneralSearchBar({ domain, onDomainChange, onSearch, isAr }: Props) {
  const [query, setQuery]       = useState('');
  const [phonetic, setPhonetic] = useState(false);

  const handleSearch = () => {
    if (query.trim()) onSearch(query.trim(), phonetic);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Domain selector */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {DOMAINS.map(d => (
          <button key={d.value} onClick={() => onDomainChange(d.value)} style={chip(domain === d.value)}>
            <i className={d.icon} style={{ marginRight: 5 }} />
            {isAr ? d.labelAr : d.labelEn}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <i className="ri-search-2-line" style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: '#5B7494', fontSize: 15, pointerEvents: 'none',
          }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder={isAr ? 'الاسم، رقم الوثيقة، الجنسية، رقم الرحلة…' : 'Name, document number, nationality, flight…'}
            style={{
              width: '100%', padding: '10px 12px 10px 38px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(184,138,60,0.2)',
              borderRadius: 6, color: '#CBD5E1',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px', borderRadius: 6, cursor: 'pointer',
            background: 'rgba(184,138,60,0.2)',
            border: '1px solid rgba(184,138,60,0.4)',
            color: '#D6B47E',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            letterSpacing: '0.05em', whiteSpace: 'nowrap',
          }}
        >
          <i className="ri-search-line" style={{ marginRight: 6 }} />
          {isAr ? 'بحث' : 'Search'}
        </button>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#5B7494', fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
          <input
            type="checkbox"
            checked={phonetic}
            onChange={e => setPhonetic(e.target.checked)}
            style={{ accentColor: '#B8893C' }}
          />
          {isAr ? 'التطابق الصوتي (فونيتيك)' : 'Phonetic / Name Matching'}
        </label>
      </div>
    </div>
  );
}
