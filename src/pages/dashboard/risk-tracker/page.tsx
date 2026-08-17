import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '../DashboardLayout';
import type { TrackedFlight, ThreatLevel } from '@/mocks/riskTrackerData';
import { TRACKED_FLIGHTS, RISK_HOTSPOTS, RISK_SOURCE_STATS, TRACKER_SUMMARY } from '@/mocks/riskTrackerData';

const THREAT_COLORS: Record<ThreatLevel, string> = {
  critical: '#C94A5E', high: '#D4922A', medium: '#D6B47E', low: '#4A8E5A', clear: '#374B61',
};
const STATUS_LABELS: Record<string, { en: string; ar: string }> = {
  en_route:  { en: 'En Route',  ar: 'في الجو'  },
  landed:    { en: 'Landed',    ar: 'هبط'      },
  scheduled: { en: 'Scheduled', ar: 'مجدول'    },
  diverted:  { en: 'Diverted',  ar: 'محوَّل'   },
};

// ── SVG Map ──────────────────────────────────────────────────
// Orthographic-style dotmap of the Middle East / Europe / South Asia corridor
// Uses mercator approximation: lon -20..90, lat 0..60 mapped to SVG 700x350
const MAP_W = 700; const MAP_H = 360;
const LON_MIN = -20; const LON_MAX = 90;
const LAT_MIN = -5;  const LAT_MAX = 65;

function project(lat: number, lon: number): [number, number] {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * MAP_W;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * MAP_H;
  return [x, y];
}

// Reference cities for map context
const CITIES = [
  { name: 'MCT', lat: 23.59, lon: 58.28, major: true  },
  { name: 'DXB', lat: 25.25, lon: 55.37, major: true  },
  { name: 'KHI', lat: 24.90, lon: 67.17, major: true  },
  { name: 'CDG', lat: 49.01, lon: 2.55,  major: false },
  { name: 'LHR', lat: 51.48, lon: -0.46, major: false },
  { name: 'RUH', lat: 24.96, lon: 46.70, major: true  },
  { name: 'NBO', lat: -1.32, lon: 36.93, major: false },
  { name: 'BOM', lat: 19.09, lon: 72.88, major: false },
  { name: 'DOH', lat: 25.27, lon: 51.61, major: false },
  { name: 'IST', lat: 40.98, lon: 28.82, major: false },
  { name: 'CAI', lat: 30.12, lon: 31.41, major: false },
];

function FlightMapSVG({ flights, selected, onSelect, isAr }: {
  flights: TrackedFlight[];
  selected: string | null;
  onSelect: (id: string) => void;
  isAr: boolean;
}) {
  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width="100%" style={{ display: 'block', background: 'transparent' }}>
      {/* Lat/lon grid */}
      {Array.from({ length: 8 }, (_, i) => {
        const lon = LON_MIN + (i * (LON_MAX - LON_MIN)) / 7;
        const [x] = project(0, lon);
        return <line key={`v${i}`} x1={x} y1={0} x2={x} y2={MAP_H} stroke="rgba(184,138,60,0.06)" strokeWidth="0.5" />;
      })}
      {Array.from({ length: 6 }, (_, i) => {
        const lat = LAT_MIN + (i * (LAT_MAX - LAT_MIN)) / 5;
        const [, y] = project(lat, 0);
        return <line key={`h${i}`} x1={0} y1={y} x2={MAP_W} y2={y} stroke="rgba(184,138,60,0.06)" strokeWidth="0.5" />;
      })}

      {/* Hotspot pulses */}
      {RISK_HOTSPOTS.map(hs => {
        const [x, y] = project(hs.lat, hs.lon);
        const col = THREAT_COLORS[hs.threatLevel];
        return (
          <g key={hs.id}>
            <circle cx={x} cy={y} r={hs.radius * 0.4} fill={`${col}08`} stroke={`${col}20`} strokeWidth="1" />
            <circle cx={x} cy={y} r={hs.radius * 0.15} fill={`${col}20`} stroke={`${col}40`} strokeWidth="1" />
          </g>
        );
      })}

      {/* Flight paths */}
      {flights.map(f => {
        const [ox, oy] = project(f.originLat, f.originLon);
        const [dx, dy] = project(f.destLat, f.destLon);
        const col = THREAT_COLORS[f.threatLevel];
        const isSel = selected === f.id;
        const isEnRoute = f.status === 'en_route';
        return (
          <line
            key={`path-${f.id}`}
            x1={ox} y1={oy} x2={dx} y2={dy}
            stroke={isSel ? col : `${col}40`}
            strokeWidth={isSel ? 1.5 : 0.8}
            strokeDasharray={isEnRoute ? 'none' : '4 3'}
          />
        );
      })}

      {/* Flight position dots */}
      {flights.map(f => {
        const posLat = f.currentLat ?? ((f.originLat + f.destLat) / 2);
        const posLon = f.currentLon ?? ((f.originLon + f.destLon) / 2);
        const [px, py] = project(posLat, posLon);
        const col = THREAT_COLORS[f.threatLevel];
        const isSel = selected === f.id;
        const isEnRoute = f.status === 'en_route';
        return (
          <g key={`dot-${f.id}`} style={{ cursor: 'pointer' }} onClick={() => onSelect(f.id)}>
            {isSel && <circle cx={px} cy={py} r={12} fill={`${col}18`} stroke={`${col}40`} strokeWidth="1" />}
            <circle cx={px} cy={py} r={isSel ? 5 : 4} fill={col} opacity={isEnRoute ? 1 : 0.5} />
            {/* Pulsing ring for en-route with hits */}
            {isEnRoute && f.hitCount > 0 && (
              <circle cx={px} cy={py} r={8} fill="none" stroke={col} strokeWidth="1" opacity="0.3" />
            )}
            {/* Flight label */}
            <text x={px + 7} y={py - 4} fontSize="8" fill={isSel ? col : `${col}99`} fontFamily="monospace">
              {f.flightNo}
            </text>
          </g>
        );
      })}

      {/* City dots */}
      {CITIES.map(c => {
        const [cx, cy] = project(c.lat, c.lon);
        return (
          <g key={c.name}>
            <circle cx={cx} cy={cy} r={c.major ? 3 : 2} fill={c.major ? '#B8893C' : '#374B61'} />
            {c.major && (
              <text x={cx + 4} y={cy + 4} fontSize="7" fill="#5B7494" fontFamily="monospace">{c.name}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Flight List Row ──────────────────────────────────────────
function FlightRow({ flight, isAr, isSelected, onClick }: { flight: TrackedFlight; isAr: boolean; isSelected: boolean; onClick: () => void }) {
  const col = THREAT_COLORS[flight.threatLevel];
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        background: isSelected ? 'rgba(184,138,60,0.06)' : 'transparent',
        borderLeft: `2px solid ${isSelected ? '#B8893C' : 'transparent'}`,
        transition: 'background 0.1s',
      }}
    >
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: col, flexShrink: 0, boxShadow: flight.threatLevel === 'critical' ? `0 0 5px ${col}` : 'none' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#D6B47E', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{flight.flightNo}</span>
          <span style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
            {flight.originCode} → {flight.destinationCode}
          </span>
        </div>
        <div style={{ fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>
          {flight.airline} · {STATUS_LABELS[flight.status]?.[isAr ? 'ar' : 'en']}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
        {flight.hitCount > 0 && (
          <span style={{ fontSize: 10, padding: '2px 5px', borderRadius: 3, background: 'rgba(201,74,94,0.12)', color: '#C94A5E', fontFamily: "'JetBrains Mono', monospace" }}>
            ⚠ {flight.hitCount}
          </span>
        )}
        <span style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
          {flight.paxCount} <i className="ri-group-line" />
        </span>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function RiskTrackerPage() {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [selected,  setSelected]  = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Simulate live feed — tick every 4s
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 4000);
    return () => clearInterval(t);
  }, []);

  const selFlight = TRACKED_FLIGHTS.find(f => f.id === selected) ?? null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#051428', overflow: 'hidden', position: 'relative' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(184,138,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.025) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '14px 24px 12px', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
              <i className="ri-map-2-line" style={{ color: '#B8893C', fontSize: 16 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#B8893C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {isAr ? 'تتبع المخاطر — لحظي' : 'Risk Tracker — Live'}
              </span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4A8E5A', display: 'inline-block', animation: 'pulse 2s infinite', boxShadow: '0 0 4px #4A8E5A' }} />
            </div>
            <p style={{ margin: 0, fontSize: 11, color: '#374B61', fontFamily: "'Inter', sans-serif" }}>
              {isAr ? 'رحلات المراقبة النشطة وتوزيع المخاطر' : 'Active monitored flights and risk distribution — updated every 4s'}
            </p>
          </div>

          {/* Summary chips */}
          <div style={{ display: 'flex', gap: 14 }}>
            {[
              { icon: 'ri-flight-takeoff-line', val: TRACKER_SUMMARY.activeFlight, label: isAr ? 'رحلة نشطة' : 'en route',    color: '#4A7AA8' },
              { icon: 'ri-alarm-warning-fill',  val: TRACKER_SUMMARY.totalHits,    label: isAr ? 'تطابق' : 'hits',             color: '#C94A5E' },
              { icon: 'ri-error-warning-fill',  val: TRACKER_SUMMARY.critical,     label: isAr ? 'حرج' : 'critical',           color: '#D4922A' },
              { icon: 'ri-group-line',          val: TRACKER_SUMMARY.paxInFlight,  label: isAr ? 'راكب في الجو' : 'pax aloft', color: '#5B7494' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontFamily: "'JetBrains Mono', monospace", color: s.color, fontWeight: 600, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 9, color: '#374B61', fontFamily: "'JetBrains Mono', monospace', textTransform: 'uppercase", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content: map + sidebar */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left sidebar: flight list */}
          <div style={{ width: 240, flexShrink: 0, overflowY: 'auto', borderRight: '1px solid rgba(184,138,60,0.1)', background: 'rgba(5,20,40,0.5)' }}>
            <div style={{ padding: '8px 14px', fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid rgba(184,138,60,0.08)' }}>
              {isAr ? 'الرحلات المراقبة' : 'Monitored Flights'} ({TRACKED_FLIGHTS.length})
            </div>
            {TRACKED_FLIGHTS.map(f => (
              <FlightRow key={f.id} flight={f} isAr={isAr} isSelected={selected === f.id} onClick={() => setSelected(s => s === f.id ? null : f.id)} />
            ))}
          </div>

          {/* Map area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Map */}
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative', padding: '8px 4px 0' }}>
              <FlightMapSVG
                flights={TRACKED_FLIGHTS}
                selected={selected}
                onSelect={id => setSelected(s => s === id ? null : id)}
                isAr={isAr}
              />

              {/* Legend */}
              <div style={{ position: 'absolute', bottom: 10, right: 12, display: 'flex', gap: 10, padding: '6px 10px', borderRadius: 6, background: 'rgba(5,20,40,0.85)', border: '1px solid rgba(184,138,60,0.1)' }}>
                {(['critical', 'high', 'medium', 'low', 'clear'] as ThreatLevel[]).map(t => (
                  <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: THREAT_COLORS[t], display: 'inline-block' }} />
                    {t}
                  </span>
                ))}
              </div>

              {/* Tick indicator */}
              <div style={{ position: 'absolute', top: 14, right: 12, fontSize: 9, color: '#374B61', fontFamily: "'JetBrains Mono', monospace" }}>
                <i className="ri-refresh-line" style={{ marginRight: 4 }} />
                {isAr ? 'تحديث #' : 'update #'}{tick}
              </div>
            </div>

            {/* Selected flight detail */}
            {selFlight && (
              <div style={{ height: 110, flexShrink: 0, borderTop: '1px solid rgba(184,138,60,0.1)', padding: '10px 16px', background: 'rgba(5,20,40,0.7)', overflow: 'auto' }}>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 14, color: '#D6B47E', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                      {selFlight.flightNo}
                      <span style={{ marginLeft: 10, fontSize: 11, color: '#5B7494', fontWeight: 400 }}>{selFlight.airline}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                      {selFlight.originCode} → {selFlight.destinationCode}
                      <span style={{ marginLeft: 12 }}>{selFlight.departureTime?.slice(11)} → {selFlight.arrivalTime?.slice(11)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {selFlight.altitude && <div style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}><i className="ri-arrow-up-line" style={{ marginRight: 4 }} />{selFlight.altitude.toLocaleString()} ft</div>}
                    {selFlight.speed    && <div style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}><i className="ri-speed-line" style={{ marginRight: 4 }} />{selFlight.speed} kts</div>}
                    <div style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}><i className="ri-group-line" style={{ marginRight: 4 }} />{selFlight.paxCount} pax</div>
                    {selFlight.hitCount > 0 && <div style={{ fontSize: 11, color: '#C94A5E', fontFamily: "'JetBrains Mono', monospace" }}><i className="ri-alarm-warning-fill" style={{ marginRight: 4 }} />{selFlight.hitCount} hits</div>}
                  </div>
                  {selFlight.notes && (
                    <div style={{ fontSize: 11, color: '#8FA8C0', fontFamily: "'Inter', sans-serif", flex: 1, minWidth: 200 }}>
                      <i className="ri-information-line" style={{ marginRight: 5, color: '#B8893C' }} />{selFlight.notes}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Risk source stats strip */}
            <div style={{ flexShrink: 0, borderTop: '1px solid rgba(184,138,60,0.08)', padding: '8px 16px', background: 'rgba(5,20,40,0.6)' }}>
              <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
                {RISK_SOURCE_STATS.map((s, i) => (
                  <div key={s.source} style={{ flex: '0 0 auto', padding: '6px 16px', borderRight: i < RISK_SOURCE_STATS.length - 1 ? '1px solid rgba(184,138,60,0.08)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <i className={s.icon} style={{ color: s.color, fontSize: 12 }} />
                      <span style={{ fontSize: 20, fontFamily: "'JetBrains Mono', monospace", color: s.color, fontWeight: 700, lineHeight: 1 }}>{s.count}</span>
                      <span style={{ fontSize: 10, color: s.deltaUp ? '#4A8E5A' : '#C94A5E', fontFamily: "'JetBrains Mono', monospace" }}>
                        {s.deltaUp ? '↑' : '↓'}{s.delta}
                      </span>
                    </div>
                    <div style={{ fontSize: 9, color: '#374B61', fontFamily: "'JetBrains Mono', monospace', textTransform: 'uppercase", letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                      {isAr ? s.sourceAr : s.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
