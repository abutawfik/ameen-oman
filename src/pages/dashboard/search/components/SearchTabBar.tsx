interface Props {
  active: 'adhoc' | 'hit' | 'service';
  onChange: (tab: 'adhoc' | 'hit' | 'service') => void;
  isAr: boolean;
}

const TABS = [
  { key: 'adhoc',   icon: 'ri-search-2-line',      labelEn: 'Ad Hoc Search',  labelAr: 'بحث مخصص'    },
  { key: 'hit',     icon: 'ri-alarm-warning-line',  labelEn: 'Hit Search',     labelAr: 'بحث التطابق' },
  { key: 'service', icon: 'ri-flight-takeoff-line', labelEn: 'Service Search', labelAr: 'بحث الرحلات' },
] as const;

export default function SearchTabBar({ active, onChange, isAr }: Props) {
  return (
    <div
      className="flex shrink-0"
      style={{ borderBottom: '1px solid rgba(184,138,60,0.15)', background: 'rgba(5,20,40,0.7)' }}
    >
      {TABS.map(t => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key as typeof active)}
            aria-selected={isActive}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 20px',
              borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              borderBottom: `2px solid ${isActive ? '#B8893C' : 'transparent'}`,
              color: isActive ? '#D6B47E' : '#5B7494',
              background: 'none',
              cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
              transition: 'color 0.15s',
            }}
          >
            <i className={t.icon} style={{ fontSize: 14 }} />
            {isAr ? t.labelAr : t.labelEn}
          </button>
        );
      })}
    </div>
  );
}
