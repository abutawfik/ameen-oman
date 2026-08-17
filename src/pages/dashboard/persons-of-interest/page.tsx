import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '../DashboardLayout';
import type { POICategory, POIStatus, POIThreat, PersonOfInterest } from '@/mocks/poiData';
import { POI_LIST, CATEGORY_CONFIG, THREAT_COLORS } from '@/mocks/poiData';

// ── Detail Panel ─────────────────────────────────────────────
function POIDetail({ poi, isAr, onClose }: { poi: PersonOfInterest; isAr: boolean; onClose: () => void }) {
  const catCfg    = CATEGORY_CONFIG[poi.category];
  const threatCol = THREAT_COLORS[poi.threat];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(184,138,60,0.12)', background: 'rgba(5,20,40,0.85)' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(184,138,60,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 15, color: '#CBD5E1', fontFamily: "'Inter', sans-serif", fontWeight: 600, marginBottom: 4 }}>
            {isAr && poi.nameAr ? poi.nameAr : poi.name}
          </div>
          <div style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
            {poi.nationalityCode} · {poi.dob} · {poi.gender === 'M' ? (isAr ? 'ذكر' : 'Male') : (isAr ? 'أنثى' : 'Female')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", background: `${threatCol}22`, color: threatCol, border: `1px solid ${threatCol}44`, textTransform: 'uppercase' }}>
            {poi.threat}
          </span>
          <button onClick={onClose} style={{ padding: '4px 8px', borderRadius: 4, background: 'transparent', border: '1px solid rgba(184,138,60,0.2)', color: '#5B7494', cursor: 'pointer', fontSize: 14 }}>
            <i className="ri-close-line" />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Category + Source */}
        <div style={{ padding: 10, borderRadius: 6, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(184,138,60,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <i className={catCfg.icon} style={{ color: catCfg.color, fontSize: 14 }} />
            <span style={{ fontSize: 12, color: catCfg.color, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {isAr ? catCfg.labelAr : catCfg.labelEn}
            </span>
          </div>
          <div style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>{poi.sourceRef}</div>
          <div style={{ fontSize: 11, color: '#374B61', fontFamily: "'Inter', sans-serif" }}>{poi.sourceOrg}</div>
        </div>

        {/* Description */}
        <div>
          <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            {isAr ? 'الوصف' : 'Description'}
          </div>
          <div style={{ fontSize: 12, color: '#8FA8C0', fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>{poi.description}</div>
        </div>

        {/* Aliases */}
        {poi.aliases.length > 0 && (
          <div>
            <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              {isAr ? 'الأسماء المستعارة' : 'Aliases'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {poi.aliases.map((a, i) => (
                <span key={i} style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11, background: 'rgba(91,116,148,0.12)', color: '#8FA8C0', fontFamily: "'Inter', sans-serif", border: '1px solid rgba(91,116,148,0.2)' }}>
                  {a.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        <div>
          <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            {isAr ? 'وثائق الهوية' : 'Known Documents'}
          </div>
          {poi.identities.map((doc, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: i < poi.identities.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: 'rgba(184,138,60,0.1)', color: '#B8893C', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' }}>{doc.docType}</span>
              <span style={{ fontSize: 11, color: '#D6B47E', fontFamily: "'JetBrains Mono', monospace" }}>{doc.docNumber}</span>
              <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>{doc.issuingCountry}</span>
              {doc.expiry && <span style={{ fontSize: 11, color: '#374B61', fontFamily: "'JetBrains Mono', monospace" }}>{doc.expiry}</span>}
            </div>
          ))}
        </div>

        {/* Sightings */}
        {poi.sightings.length > 0 && (
          <div>
            <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              {isAr ? 'المشاهدات' : 'Sightings'} ({poi.sightings.length})
            </div>
            {poi.sightings.map(s => (
              <div key={s.id} style={{ padding: '8px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(184,138,60,0.08)', marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: '#CBD5E1', fontFamily: "'JetBrains Mono', monospace" }}>
                    {s.locationCode}
                    {s.flightNo && <span style={{ color: '#B8893C', marginLeft: 8 }}>{s.flightNo}</span>}
                  </span>
                  <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>{s.date}</span>
                </div>
                <div style={{ fontSize: 11, color: '#8FA8C0', fontFamily: "'Inter', sans-serif" }}>{s.context}</div>
                {!s.verified && (
                  <div style={{ marginTop: 3, fontSize: 10, color: '#D4922A', fontFamily: "'JetBrains Mono', monospace" }}>
                    <i className="ri-error-warning-line" style={{ marginRight: 4 }} />{isAr ? 'غير مؤكد' : 'Unverified'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {poi.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {poi.tags.map(t => (
              <span key={t} style={{ padding: '2px 7px', borderRadius: 3, fontSize: 10, background: 'rgba(184,138,60,0.08)', color: '#B8893C', fontFamily: "'JetBrains Mono', monospace", border: '1px solid rgba(184,138,60,0.15)' }}>
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Stats footer */}
        <div style={{ display: 'flex', gap: 16, padding: '10px 0', borderTop: '1px solid rgba(184,138,60,0.08)' }}>
          <span style={{ fontSize: 12, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
            <i className="ri-folder-shield-2-line" style={{ marginRight: 5, color: '#B8893C' }} />
            {poi.linkedCases} {isAr ? 'قضية' : 'cases'}
          </span>
          <span style={{ fontSize: 12, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
            <i className="ri-alarm-warning-line" style={{ marginRight: 5, color: '#C94A5E' }} />
            {poi.alertCount} {isAr ? 'تنبيه' : 'alerts'}
          </span>
          <span style={{ fontSize: 12, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
            <i className="ri-calendar-line" style={{ marginRight: 5 }} />
            {isAr ? 'أُضيف:' : 'Added:'} {poi.addedDate}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── POI Row ──────────────────────────────────────────────────
function POIRow({ poi, isAr, isSelected, onClick }: { poi: PersonOfInterest; isAr: boolean; isSelected: boolean; onClick: () => void }) {
  const catCfg    = CATEGORY_CONFIG[poi.category];
  const threatCol = THREAT_COLORS[poi.threat];

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer',
        background: isSelected ? 'rgba(184,138,60,0.06)' : 'transparent',
        borderLeft: isSelected ? '2px solid #B8893C' : '2px solid transparent',
        transition: 'background 0.1s',
      }}
    >
      {/* Threat indicator */}
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: threatCol, flexShrink: 0, boxShadow: poi.threat === 'critical' ? `0 0 6px ${threatCol}` : 'none' }} />

      {/* Category icon */}
      <div style={{ width: 32, height: 32, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${catCfg.color}18`, border: `1px solid ${catCfg.color}33`, flexShrink: 0 }}>
        <i className={catCfg.icon} style={{ color: catCfg.color, fontSize: 14 }} />
      </div>

      {/* Name + alias */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: '#CBD5E1', fontFamily: "'Inter', sans-serif", fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {isAr && poi.nameAr ? poi.nameAr : poi.name}
        </div>
        <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {poi.nationalityCode} · {poi.dob} · {poi.sourceRef}
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
        {poi.alertCount > 0 && (
          <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 3, background: 'rgba(201,74,94,0.12)', color: '#C94A5E', fontFamily: "'JetBrains Mono', monospace" }}>
            <i className="ri-alarm-warning-line" style={{ marginRight: 3 }} />{poi.alertCount}
          </span>
        )}
        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: `${threatCol}18`, color: threatCol, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', border: `1px solid ${threatCol}33` }}>
          {poi.threat}
        </span>
        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: poi.status === 'ACTIVE' ? 'rgba(74,142,90,0.12)' : 'rgba(91,116,148,0.12)', color: poi.status === 'ACTIVE' ? '#4A8E5A' : '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
          {poi.status}
        </span>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
const ALL_CATEGORIES: POICategory[] = ['INTERPOL', 'NATIONAL', 'FINANCIAL', 'TERRORISM', 'CUSTOMS', 'DIPLOMATIC'];
const ALL_THREATS:    POIThreat[]   = ['critical', 'high', 'medium', 'low'];

export default function PersonsOfInterestPage() {
  const { isAr } = useOutletContext<DashboardOutletContext>();

  const [search,     setSearch]     = useState('');
  const [catFilter,  setCatFilter]  = useState<POICategory[]>([]);
  const [threatFilter, setThreatFilter] = useState<POIThreat[]>([]);
  const [statusFilter, setStatusFilter] = useState<POIStatus | ''>('');
  const [selected,   setSelected]   = useState<PersonOfInterest | null>(null);

  const filtered = POI_LIST.filter(p => {
    if (catFilter.length    > 0 && !catFilter.includes(p.category))   return false;
    if (threatFilter.length > 0 && !threatFilter.includes(p.threat))  return false;
    if (statusFilter && p.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.nameAr ?? '').includes(q) ||
        p.sourceRef.toLowerCase().includes(q) ||
        p.aliases.some(a => a.name.toLowerCase().includes(q)) ||
        p.identities.some(d => d.docNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const toggleArr = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  const chipStyle = (active: boolean, color: string = '#B8893C') => ({
    padding: '4px 10px', borderRadius: 4, fontSize: 10, cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em',
    background: active ? `${color}20` : 'transparent',
    border: `1px solid ${active ? color : 'rgba(184,138,60,0.15)'}`,
    color: active ? color : '#5B7494', textTransform: 'uppercase' as const,
  });

  // Summary stats
  const active   = POI_LIST.filter(p => p.status === 'ACTIVE').length;
  const critical = POI_LIST.filter(p => p.threat === 'critical').length;
  const alerts   = POI_LIST.reduce((s, p) => s + p.alertCount, 0);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#051428', overflow: 'hidden', position: 'relative' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(184,138,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.025) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Page header */}
        <div style={{ padding: '18px 24px 14px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <i className="ri-user-forbid-line" style={{ color: '#B8893C', fontSize: 16 }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#B8893C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {isAr ? 'الأشخاص المثيرون للاهتمام' : 'Persons of Interest'}
            </span>
          </div>

          {/* Summary bar */}
          <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
            {[
              { icon: 'ri-user-forbid-line', val: POI_LIST.length, labelEn: 'total',    labelAr: 'إجمالي',   color: '#5B7494' },
              { icon: 'ri-radio-button-line', val: active,          labelEn: 'active',   labelAr: 'نشط',      color: '#4A8E5A' },
              { icon: 'ri-alarm-warning-fill', val: critical,       labelEn: 'critical', labelAr: 'حرج',      color: '#C94A5E' },
              { icon: 'ri-bell-line',          val: alerts,         labelEn: 'alerts',   labelAr: 'تنبيهات', color: '#D4922A' },
            ].map(s => (
              <div key={s.labelEn} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className={s.icon} style={{ color: s.color, fontSize: 14 }} />
                <span style={{ fontSize: 18, fontFamily: "'JetBrains Mono', monospace", color: s.color, fontWeight: 600, lineHeight: 1 }}>{s.val}</span>
                <span style={{ fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace', textTransform: 'uppercase" }}>{isAr ? s.labelAr : s.labelEn}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{ padding: '10px 24px', borderBottom: '1px solid rgba(184,138,60,0.08)', background: 'rgba(5,20,40,0.5)', flexShrink: 0 }}>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 380, marginBottom: 10 }}>
            <i className="ri-search-line" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#5B7494', fontSize: 13, pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isAr ? 'الاسم، الوثيقة، المرجع…' : 'Name, document, reference…'}
              style={{ width: '100%', padding: '7px 10px 7px 30px', borderRadius: 4, fontSize: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,138,60,0.2)', color: '#CBD5E1', fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Category chips */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
            {ALL_CATEGORIES.map(c => {
              const cfg = CATEGORY_CONFIG[c];
              return (
                <button key={c} onClick={() => setCatFilter(prev => toggleArr(prev, c))} style={chipStyle(catFilter.includes(c), cfg.color)}>
                  <i className={cfg.icon} style={{ marginRight: 4 }} />
                  {isAr ? cfg.labelAr : cfg.labelEn}
                </button>
              );
            })}
          </div>

          {/* Threat chips */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {ALL_THREATS.map(t => (
              <button key={t} onClick={() => setThreatFilter(prev => toggleArr(prev, t))} style={chipStyle(threatFilter.includes(t), THREAT_COLORS[t])}>
                {t}
              </button>
            ))}
            {(['ACTIVE', 'INACTIVE', 'EXPIRED'] as POIStatus[]).map(s => (
              <button key={s} onClick={() => setStatusFilter(prev => prev === s ? '' : s)} style={chipStyle(statusFilter === s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Content area: list + detail */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* List */}
          <div style={{ flex: selected ? '0 0 45%' : '1', overflowY: 'auto', borderRight: selected ? '1px solid rgba(184,138,60,0.08)' : 'none' }}>
            <div style={{ padding: '8px 16px', fontSize: 11, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              {filtered.length} {isAr ? 'شخص' : 'persons'}
            </div>
            {filtered.map(poi => (
              <POIRow
                key={poi.id}
                poi={poi}
                isAr={isAr}
                isSelected={selected?.id === poi.id}
                onClick={() => setSelected(prev => prev?.id === poi.id ? null : poi)}
              />
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: '#374B61', fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                {isAr ? 'لا توجد نتائج' : 'No persons match current filters'}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ flex: '0 0 55%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <POIDetail poi={selected} isAr={isAr} onClose={() => setSelected(null)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
