import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '../DashboardLayout';
import { MANAGED_USERS, ROLE_CONFIG, STATUS_COLORS, type ManagedUser } from '../../../mocks/usersData';

const BG   = 'var(--alm-ocean-800)';
const P1   = 'var(--alm-ocean-700)';
const P2   = 'var(--alm-ocean-600)';
const P3   = 'var(--alm-ocean-500)';
const P4   = 'var(--alm-ocean-400)';
const GOLD = '#D6B47E';
const GOLD2 = '#B8893C';

const TIMEZONES = [
  'Asia/Muscat', 'Asia/Dubai', 'Asia/Riyadh', 'Africa/Cairo', 'Europe/London', 'UTC',
];

function fmt(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

const LBL: React.CSSProperties = {
  display: 'block',
  color: P4,
  fontSize: '0.72rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontFamily: "'JetBrains Mono', monospace",
  marginBottom: '0.35rem',
};

const FIELD: React.CSSProperties = {
  padding: '0.55rem 0.85rem',
  background: P2,
  border: `1px solid ${P3}`,
  borderRadius: 5,
  color: '#e8dcc8',
  fontSize: '0.875rem',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

export default function UserProfilePage() {
  const { isAr } = useOutletContext<DashboardOutletContext>();

  // Use first user as "current logged-in user"
  const me: ManagedUser = MANAGED_USERS[0];

  const [editMode, setEditMode] = useState(false);
  const [name, setName]         = useState(isAr ? me.displayNameAr : me.displayName);
  const [phone, setPhone]       = useState(me.phone);
  const [timezone, setTimezone] = useState(me.timezone);
  const [lang, setLang]         = useState<'en' | 'ar'>(me.language);
  const [saved, setSaved]       = useState(false);
  const [pwDone, setPwDone]     = useState(false);

  const rc = ROLE_CONFIG[me.role];
  const sc = STATUS_COLORS[me.status];

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  }

  function initials(n: string) {
    return n.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: BG, color: '#e8dcc8', padding: '1.5rem' }}>
      {/* Page title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ color: P4, fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.25rem' }}>
          Account
        </div>
        <h1 style={{ color: GOLD, fontSize: '1.2rem', margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
          User Profile & Preferences
        </h1>
      </div>

      {saved && (
        <div style={{ marginBottom: '1rem', padding: '0.6rem 1rem', background: '#4A8E5A22', border: '1px solid #4A8E5A55', borderRadius: 6, color: '#4A8E5A', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="ri-checkbox-circle-line" /> Profile saved successfully.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Profile card */}
          <div style={{ background: P1, borderRadius: 10, padding: '1.5rem', border: `1px solid ${P2}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '0.88rem', color: GOLD, fontFamily: "'JetBrains Mono', monospace" }}>
                Personal Information
              </h2>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  style={{ padding: '0.35rem 0.85rem', background: P2, color: GOLD, border: `1px solid ${P3}`, borderRadius: 5, cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <i className="ri-edit-line" /> Edit
                </button>
              )}
            </div>

            {/* Avatar + name header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${GOLD2}, #7A5A2C)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', fontWeight: 700, color: '#0a1a2e',
                  fontFamily: "'JetBrains Mono', monospace", flexShrink: 0,
                }}
              >
                {initials(me.displayName)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#e8dcc8', marginBottom: '0.2rem' }}>{me.displayName}</div>
                <div style={{ fontSize: '0.78rem', color: P4, fontFamily: "'JetBrains Mono', monospace" }}>{me.officerId}</div>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                  <span style={{ padding: '0.15rem 0.55rem', borderRadius: 3, background: rc.color + '22', color: rc.color, fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace" }}>
                    {isAr ? rc.labelAr : rc.labelEn}
                  </span>
                  <span style={{ padding: '0.15rem 0.55rem', borderRadius: 3, background: sc + '22', color: sc, fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace" }}>
                    {me.status}
                  </span>
                  {me.mfaEnabled && (
                    <span style={{ padding: '0.15rem 0.55rem', borderRadius: 3, background: '#4A8E5A22', color: '#4A8E5A', fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace" }}>
                      MFA ON
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!editMode ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  ['Email',      me.email],
                  ['Unit',       me.unit],
                  ['Phone',      me.phone || '—'],
                  ['Created',    fmt(me.createdAt)],
                  ['Last Login', fmt(me.lastLogin)],
                ].map(([l, v]) => (
                  <div key={l}>
                    <label style={LBL}>{l}</label>
                    <div style={{ color: '#e8dcc8', fontSize: '0.85rem' }}>{v}</div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={LBL}>Display Name</label>
                  <input style={FIELD} value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={LBL}>Email (read-only)</label>
                    <input style={{ ...FIELD, opacity: 0.5, cursor: 'not-allowed' }} value={me.email} readOnly />
                  </div>
                  <div>
                    <label style={LBL}>Phone</label>
                    <input style={FIELD} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+968 2456 0000" />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setEditMode(false)} style={{ padding: '0.5rem 1.2rem', background: P2, color: '#ccc', border: 'none', borderRadius: 5, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '0.5rem 1.4rem', background: GOLD2, color: '#0a1a2e', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 700 }}>Save Changes</button>
                </div>
              </form>
            )}
          </div>

          {/* Preferences card */}
          <div style={{ background: P1, borderRadius: 10, padding: '1.5rem', border: `1px solid ${P2}` }}>
            <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.88rem', color: GOLD, fontFamily: "'JetBrains Mono', monospace" }}>
              Display Preferences
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={LBL}>Interface Language</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.1rem' }}>
                  {(['en', 'ar'] as const).map(l => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      style={{
                        flex: 1, padding: '0.5rem',
                        background: lang === l ? GOLD2 + '33' : P2,
                        border: `1px solid ${lang === l ? GOLD2 : P3}`,
                        borderRadius: 5, color: lang === l ? GOLD : P4,
                        cursor: 'pointer', fontSize: '0.8rem',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {l === 'en' ? 'English' : 'العربية'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={LBL}>Timezone</label>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  style={{ ...FIELD, marginTop: 0 }}
                >
                  {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Security card */}
          <div style={{ background: P1, borderRadius: 10, padding: '1.5rem', border: `1px solid ${P2}` }}>
            <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.88rem', color: GOLD, fontFamily: "'JetBrains Mono', monospace" }}>
              Security
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: P2, borderRadius: 6 }}>
                <div>
                  <div style={{ color: '#e8dcc8', fontSize: '0.85rem', fontWeight: 600 }}>Multi-Factor Authentication</div>
                  <div style={{ color: P4, fontSize: '0.75rem', marginTop: '0.15rem' }}>
                    {me.mfaEnabled ? 'Active — government ID token' : 'Not configured — contact system admin to enable'}
                  </div>
                </div>
                <span style={{
                  padding: '0.2rem 0.6rem', borderRadius: 3,
                  background: me.mfaEnabled ? '#4A8E5A22' : '#C94A5E22',
                  color: me.mfaEnabled ? '#4A8E5A' : '#C94A5E',
                  fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {me.mfaEnabled ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: P2, borderRadius: 6 }}>
                <div>
                  <div style={{ color: '#e8dcc8', fontSize: '0.85rem', fontWeight: 600 }}>Password</div>
                  <div style={{ color: P4, fontSize: '0.75rem', marginTop: '0.15rem' }}>
                    {pwDone ? 'Recovery link sent — check your inbox.' : 'Use officer SSO or request a reset link.'}
                  </div>
                </div>
                {!pwDone ? (
                  <button
                    onClick={() => { setPwDone(true); setTimeout(() => setPwDone(false), 4000); }}
                    style={{ padding: '0.35rem 0.85rem', background: P3, color: GOLD, border: `1px solid ${P3}`, borderRadius: 5, cursor: 'pointer', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                  >
                    Request Reset
                  </button>
                ) : (
                  <i className="ri-mail-check-line" style={{ color: '#4A8E5A', fontSize: '1.2rem' }} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Module access */}
          <div style={{ background: P1, borderRadius: 10, padding: '1.25rem', border: `1px solid ${P2}` }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: GOLD, fontFamily: "'JetBrains Mono', monospace" }}>
              Module Access
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {me.assignedModules.length === 0 ? (
                <span style={{ color: P4, fontSize: '0.78rem' }}>No modules assigned yet.</span>
              ) : me.assignedModules[0] === 'all' ? (
                <span style={{ padding: '0.2rem 0.6rem', borderRadius: 3, background: GOLD2 + '22', color: GOLD, fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace" }}>
                  FULL ACCESS
                </span>
              ) : (
                me.assignedModules.map(m => (
                  <span key={m} style={{ padding: '0.2rem 0.6rem', borderRadius: 3, background: P2, color: P4, fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace" }}>
                    {m}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Login history */}
          <div style={{ background: P1, borderRadius: 10, padding: '1.25rem', border: `1px solid ${P2}` }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: GOLD, fontFamily: "'JetBrains Mono', monospace" }}>
              Recent Logins
            </h2>
            {me.loginHistory.length === 0 ? (
              <p style={{ color: P4, fontSize: '0.78rem', margin: 0 }}>No login history.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {me.loginHistory.map((entry, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.6rem 0.75rem',
                      background: P2,
                      borderRadius: 6,
                      borderLeft: `2px solid ${entry.success ? '#4A8E5A' : '#C94A5E'}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ color: '#e8dcc8', fontSize: '0.8rem' }}>{fmt(entry.at)}</span>
                      <span style={{
                        padding: '0.12rem 0.45rem', borderRadius: 3,
                        background: entry.success ? '#4A8E5A22' : '#C94A5E22',
                        color: entry.success ? '#4A8E5A' : '#C94A5E',
                        fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {entry.success ? 'SUCCESS' : 'FAILED'}
                      </span>
                    </div>
                    <div style={{ color: P4, fontSize: '0.72rem' }}>
                      {entry.ip} · {entry.location}
                    </div>
                    <div style={{ color: P4, fontSize: '0.7rem', marginTop: '0.1rem' }}>
                      {entry.device}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account meta */}
          <div style={{ background: P1, borderRadius: 10, padding: '1.25rem', border: `1px solid ${P2}` }}>
            <h2 style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: GOLD, fontFamily: "'JetBrains Mono', monospace" }}>
              Account Details
            </h2>
            {[
              ['Officer ID', me.officerId],
              ['Unit',       me.unit],
              ['Created',    fmt(me.createdAt)],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ color: P4, fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 80, marginTop: 1 }}>{l}</span>
                <span style={{ color: '#e8dcc8', fontSize: '0.82rem' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
