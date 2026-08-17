import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '../DashboardLayout';
import SearchTabBar from './components/SearchTabBar';
import AdHocSearch from './components/AdHocSearch';
import HitSearch from './components/HitSearch';
import ServiceSearch from './components/ServiceSearch';

type SearchTab = 'adhoc' | 'hit' | 'service';

export default function SearchPage() {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeTab, setActiveTab] = useState<SearchTab>('adhoc');

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#051428',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Subtle grid texture */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage:
            'linear-gradient(rgba(184,138,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.025) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Page header */}
        <div style={{ padding: '18px 24px 12px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <i className="ri-search-2-line" style={{ color: '#B8893C', fontSize: 16 }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#B8893C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {isAr ? 'البحث والاستعلام' : 'Search & Query'}
            </span>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#374B61', margin: 0 }}>
            {isAr
              ? 'البحث عبر: الأحداث · التطابقات · الهويات · الخدمات'
              : 'Search across: Events · Hits · Identities · Services'}
          </p>
        </div>

        {/* Tab bar */}
        <SearchTabBar active={activeTab} onChange={setActiveTab} isAr={isAr} />

        {/* Tab content area */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'adhoc'   && <AdHocSearch   isAr={isAr} />}
          {activeTab === 'hit'     && <HitSearch     isAr={isAr} />}
          {activeTab === 'service' && <ServiceSearch  isAr={isAr} />}
        </div>
      </div>
    </div>
  );
}
