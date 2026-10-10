import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '../DashboardLayout';
import PageHeader from '../components/PageHeader';
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
        <PageHeader
          title={isAr ? 'البحث والاستعلام' : 'Search & Query'}
          subtitle={isAr ? 'البحث عبر: الأحداث · التطابقات · الهويات · الخدمات' : 'Search across: Events · Hits · Identities · Services'}
          icon="ri-search-2-line"
          iconColor="#B8893C"
          isAr={isAr}
        />

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
