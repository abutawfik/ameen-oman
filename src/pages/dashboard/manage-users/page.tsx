import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '../DashboardLayout';
import {
  MANAGED_USERS,
  ROLE_CONFIG,
  STATUS_COLORS,
  type ManagedUser,
  type UserRole,
  type UserStatus,
} from '../../../mocks/usersData';

const BG  = 'var(--alm-ocean-800)';
const P1  = 'var(--alm-ocean-700)';
const P2  = 'var(--alm-ocean-600)';
const P3  = 'var(--alm-ocean-500)';
const P4  = 'var(--alm-ocean-400)';
const GOLD = '#D6B47E';
const GOLD2 = '#B8893C';

const ALL_ROLES: UserRole[]    = ['SUPER_ADMIN', 'ADMIN', 'ANALYST', 'OPERATOR', 'AUDITOR', 'VIEWER'];
const ALL_STATUSES: UserStatus[] = ['ACTIVE', 'SUSPENDED', 'PENDING', 'INACTIVE'];

function fmt(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// ── Add User Modal ─────────────────────────────────────────────────────────────
interface AddUserModalProps {
  onClose: () => void;
  onAdd: (u: ManagedUser) => void;
  isAr: boolean;
}
function AddUserModal({ onClose, onAdd, isAr }: AddUserModalProps) {
  const [form, setForm] = useState({
    displayName: '', displayNameAr: '',
    email: '', officerId: '',
    role: 'OPERATOR' as UserRole,
    unit: '', phone: '',
  });
  const [err, setErr] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.displayName || !form.email || !form.officerId) {
      setErr('Name, email and Officer ID are required.'); return;
    }
    const now = new Date().toISOString();
    const newUser: ManagedUser = {
      id: 'usr-' + Date.now(),
      displayName: form.displayName,
      displayNameAr: form.displayNameAr || form.displayName,
      email: form.email,
      officerId: form.officerId,
      role: form.role,
      status: 'PENDING',
      unit: form.unit || 'Unassigned',
      phone: form.phone,
      timezone: 'Asia/Muscat',
      language: 'en',
      createdAt: now,
      lastLogin: null,
      mfaEnabled: false,
      notes: '',
      assignedModules: [],
      loginHistory: [],
    };
    onAdd(newUser);
  }

  const F: React.CSSProperties = {
    padding: '0.6rem 0.9rem',
    background: P2,
    border: `1px solid ${P3}`,
    borderRadius: 5,
    color: '#e8dcc8',
    fontSize: '0.85rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };
  const L: React.CSSProperties = { fontSize: '0.75rem', color: P4, marginBottom: '0.3rem', display: 'block' };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(2,10,20,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: P1, borderRadius: 10, padding: '2rem',
          width: 500, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto',
          border: `1px solid ${P2}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: GOLD, margin: 0, fontSize: '1rem', fontFamily: "'JetBrains Mono', monospace" }}>
            Add New User
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: P4, fontSize: '1.2rem', cursor: 'pointer' }}>
            <i className="ri-close-line" />
          </button>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={L}>Full Name (EN) *</label>
              <input style={F} value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} placeholder="Ahmed Al-Balushi" />
            </div>
            <div>
              <label style={L}>Full Name (AR)</label>
              <input style={{ ...F, fontFamily: 'Noto Naskh Arabic, sans-serif', direction: 'rtl' }} value={form.displayNameAr} onChange={e => setForm(f => ({ ...f, displayNameAr: e.target.value }))} placeholder="أحمد البلوشي" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={L}>Officer ID *</label>
              <input style={F} value={form.officerId} onChange={e => setForm(f => ({ ...f, officerId: e.target.value }))} placeholder="ROP-0001" />
            </div>
            <div>
              <label style={L}>Role</label>
              <select
                style={F}
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}
              >
                {ALL_ROLES.map(r => (
                  <option key={r} value={r}>{ROLE_CONFIG[r].labelEn}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={L}>Email *</label>
            <input style={F} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="officer@rop.gov.om" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={L}>Unit / Department</label>
              <input style={F} value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="Border Control Administration" />
            </div>
            <div>
              <label style={L}>Phone</label>
              <input style={F} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+968 2456 0000" />
            </div>
          </div>

          {err && <p style={{ color: '#C94A5E', fontSize: '0.78rem', margin: 0 }}>{err}</p>}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.6rem 1.2rem', background: P2, color: '#ccc', border: 'none', borderRadius: 5, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ padding: '0.6rem 1.4rem', background: GOLD2, color: '#0a1a2e', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem' }}>
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── User Detail Panel ──────────────────────────────────────────────────────────
interface DetailProps {
  user: ManagedUser;
  isAr: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: UserStatus) => void;
  onRoleChange: (id: string, role: UserRole) => void;
}
function UserDetail({ user, isAr, onClose, onStatusChange, onRoleChange }: DetailProps) {
  const [editRole, setEditRole] = useState(false);
  const [newRole, setNewRole] = useState<UserRole>(user.role);

  function saveRole() {
    onRoleChange(user.id, newRole);
    setEditRole(false);
  }

  const rc = ROLE_CONFIG[user.role];
  const sc = STATUS_COLORS[user.status];

  const ROW: React.CSSProperties = { display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.6rem' };
  const LBL: React.CSSProperties = { color: P4, fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase', minWidth: 90, marginTop: 1 };
  const VAL: React.CSSProperties = { color: '#e8dcc8', fontSize: '0.82rem' };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ color: '#e8dcc8', fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>
            {isAr ? user.displayNameAr : user.displayName}
          </div>
          <div style={{ color: P4, fontSize: '0.78rem', fontFamily: "'JetBrains Mono', monospace" }}>
            {user.officerId}
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: P4, fontSize: '1.2rem', cursor: 'pointer', padding: '0.2rem' }}>
          <i className="ri-close-line" />
        </button>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <span style={{ padding: '0.2rem 0.65rem', borderRadius: 4, background: rc.color + '22', color: rc.color, fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace" }}>
          {isAr ? rc.labelAr : rc.labelEn}
        </span>
        <span style={{ padding: '0.2rem 0.65rem', borderRadius: 4, background: sc + '22', color: sc, fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace" }}>
          {user.status}
        </span>
        {user.mfaEnabled && (
          <span style={{ padding: '0.2rem 0.65rem', borderRadius: 4, background: '#4A8E5A22', color: '#4A8E5A', fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace" }}>
            MFA ON
          </span>
        )}
      </div>

      {/* Info rows */}
      <div style={{ marginBottom: '1rem' }}>
        {[
          ['Email',    user.email],
          ['Unit',     user.unit],
          ['Phone',    user.phone || '—'],
          ['Timezone', user.timezone],
          ['Language', user.language === 'ar' ? 'Arabic (العربية)' : 'English'],
          ['Created',  fmt(user.createdAt)],
          ['Last Login', fmt(user.lastLogin)],
        ].map(([label, value]) => (
          <div key={label} style={ROW}>
            <span style={LBL}>{label}</span>
            <span style={VAL}>{value}</span>
          </div>
        ))}
      </div>

      {/* Assigned modules */}
      {user.assignedModules.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ ...LBL, marginBottom: '0.4rem' }}>Modules</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {user.assignedModules.map(m => (
              <span key={m} style={{ padding: '0.15rem 0.5rem', background: P2, color: P4, fontSize: '0.7rem', borderRadius: 3, fontFamily: "'JetBrains Mono', monospace" }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {user.notes && (
        <div style={{ marginBottom: '1rem', padding: '0.6rem 0.8rem', background: P2, borderRadius: 5, borderLeft: `2px solid ${GOLD2}` }}>
          <div style={{ ...LBL, marginBottom: '0.3rem' }}>Notes</div>
          <p style={{ color: '#c8bcaa', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>{user.notes}</p>
        </div>
      )}

      {/* Edit Role */}
      {editRole ? (
        <div style={{ background: P2, borderRadius: 6, padding: '0.8rem', marginBottom: '1rem' }}>
          <label style={{ ...LBL, marginBottom: '0.4rem' }}>Change Role</label>
          <select
            value={newRole}
            onChange={e => setNewRole(e.target.value as UserRole)}
            style={{ width: '100%', padding: '0.5rem 0.7rem', background: P1, border: `1px solid ${P3}`, borderRadius: 4, color: '#e8dcc8', fontSize: '0.82rem', marginBottom: '0.6rem' }}
          >
            {ALL_ROLES.map(r => <option key={r} value={r}>{ROLE_CONFIG[r].labelEn}</option>)}
          </select>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setEditRole(false)} style={{ flex: 1, padding: '0.45rem', background: P3, color: '#ccc', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '0.78rem' }}>Cancel</button>
            <button onClick={saveRole} style={{ flex: 1, padding: '0.45rem', background: GOLD2, color: '#0a1a2e', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' }}>Save</button>
          </div>
        </div>
      ) : null}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <button
          onClick={() => setEditRole(v => !v)}
          style={{ padding: '0.4rem 0.9rem', background: P2, color: GOLD, border: `1px solid ${P3}`, borderRadius: 5, cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
        >
          <i className="ri-user-settings-line" /> Edit Role
        </button>
        {user.status === 'ACTIVE' ? (
          <button
            onClick={() => onStatusChange(user.id, 'SUSPENDED')}
            style={{ padding: '0.4rem 0.9rem', background: '#C94A5E22', color: '#C94A5E', border: '1px solid #C94A5E55', borderRadius: 5, cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <i className="ri-forbid-line" /> Suspend
          </button>
        ) : user.status === 'SUSPENDED' ? (
          <button
            onClick={() => onStatusChange(user.id, 'ACTIVE')}
            style={{ padding: '0.4rem 0.9rem', background: '#4A8E5A22', color: '#4A8E5A', border: '1px solid #4A8E5A55', borderRadius: 5, cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <i className="ri-user-received-line" /> Reactivate
          </button>
        ) : user.status === 'PENDING' ? (
          <button
            onClick={() => onStatusChange(user.id, 'ACTIVE')}
            style={{ padding: '0.4rem 0.9rem', background: '#4A8E5A22', color: '#4A8E5A', border: '1px solid #4A8E5A55', borderRadius: 5, cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <i className="ri-user-follow-line" /> Approve
          </button>
        ) : null}
      </div>

      {/* Login history */}
      <div style={{ ...LBL, marginBottom: '0.5rem' }}>Login History</div>
      {user.loginHistory.length === 0 ? (
        <p style={{ color: P4, fontSize: '0.78rem' }}>No logins yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {user.loginHistory.map((entry, i) => (
            <div
              key={i}
              style={{
                padding: '0.5rem 0.7rem',
                background: P2,
                borderRadius: 5,
                borderLeft: `2px solid ${entry.success ? '#4A8E5A' : '#C94A5E'}`,
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '0.3rem',
              }}
            >
              <div>
                <div style={{ color: '#e8dcc8', fontSize: '0.78rem' }}>{fmt(entry.at)}</div>
                <div style={{ color: P4, fontSize: '0.7rem', marginTop: '0.15rem' }}>
                  {entry.ip} · {entry.location} · {entry.device}
                </div>
              </div>
              <span
                style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: 3,
                  background: entry.success ? '#4A8E5A22' : '#C94A5E22',
                  color: entry.success ? '#4A8E5A' : '#C94A5E',
                  fontSize: '0.65rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  alignSelf: 'flex-start',
                }}
              >
                {entry.success ? 'OK' : 'FAIL'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ManageUsersPage() {
  const { isAr } = useOutletContext<DashboardOutletContext>();

  const [users, setUsers]           = useState<ManagedUser[]>(MANAGED_USERS);
  const [selected, setSelected]     = useState<ManagedUser | null>(null);
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
  const [query, setQuery]           = useState('');
  const [showAdd, setShowAdd]       = useState(false);

  const filtered = users.filter(u => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      if (
        !u.displayName.toLowerCase().includes(q) &&
        !u.displayNameAr.includes(q) &&
        !u.email.toLowerCase().includes(q) &&
        !u.officerId.toLowerCase().includes(q) &&
        !u.unit.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const stats = {
    total:     users.length,
    active:    users.filter(u => u.status === 'ACTIVE').length,
    suspended: users.filter(u => u.status === 'SUSPENDED').length,
    pending:   users.filter(u => u.status === 'PENDING').length,
  };

  function handleAdd(u: ManagedUser) {
    setUsers(prev => [u, ...prev]);
    setShowAdd(false);
    setSelected(u);
  }

  function handleStatusChange(id: string, status: UserStatus) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
  }

  function handleRoleChange(id: string, role: UserRole) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    setSelected(prev => prev?.id === id ? { ...prev, role } : prev);
  }

  const CHIP = (active: boolean): React.CSSProperties => ({
    padding: '0.25rem 0.7rem',
    borderRadius: 4,
    border: `1px solid ${active ? GOLD : P2}`,
    background: active ? GOLD + '20' : P2,
    color: active ? GOLD : P4,
    fontSize: '0.72rem',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
    letterSpacing: '0.06em',
    whiteSpace: 'nowrap' as const,
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, color: '#e8dcc8' }}>
      {/* Stats row */}
      <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem 1.5rem 0' }}>
        {[
          { label: 'Total Users', value: stats.total, color: GOLD },
          { label: 'Active',      value: stats.active, color: '#4A8E5A' },
          { label: 'Suspended',   value: stats.suspended, color: '#C94A5E' },
          { label: 'Pending',     value: stats.pending, color: '#D4922A' },
        ].map(s => (
          <div
            key={s.label}
            style={{
              background: P1, borderRadius: 8, padding: '0.75rem 1.1rem',
              border: `1px solid ${P2}`, display: 'flex', flexDirection: 'column', gap: '0.15rem', minWidth: 100,
            }}
          >
            <div style={{ color: s.color, fontSize: '1.4rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
            <div style={{ color: P4, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setShowAdd(true)}
          style={{
            padding: '0.6rem 1.3rem',
            background: GOLD2,
            color: '#0a1a2e',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            alignSelf: 'center',
          }}
        >
          <i className="ri-user-add-line" /> Add User
        </button>
      </div>

      {/* Filters */}
      <div style={{ padding: '0.75rem 1.5rem', borderBottom: `1px solid ${P2}`, display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Role chips */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          <button style={CHIP(roleFilter === 'ALL')} onClick={() => setRoleFilter('ALL')}>All Roles</button>
          {ALL_ROLES.map(r => (
            <button key={r} style={CHIP(roleFilter === r)} onClick={() => setRoleFilter(r)}>
              {ROLE_CONFIG[r].labelEn}
            </button>
          ))}
        </div>
        <div style={{ width: 1, background: P2, height: 20, alignSelf: 'center' }} />
        {/* Status chips */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button style={CHIP(statusFilter === 'ALL')} onClick={() => setStatusFilter('ALL')}>All Status</button>
          {ALL_STATUSES.map(s => (
            <button key={s} style={{ ...CHIP(statusFilter === s), color: statusFilter === s ? STATUS_COLORS[s] : P4 }} onClick={() => setStatusFilter(s)}>
              {s}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 160, maxWidth: 280, position: 'relative' }}>
          <i className="ri-search-line" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: P4, fontSize: '0.9rem' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, ID, email…"
            style={{
              width: '100%', padding: '0.45rem 0.8rem 0.45rem 2rem',
              background: P1, border: `1px solid ${P2}`, borderRadius: 5,
              color: '#e8dcc8', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Table */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: P1, borderBottom: `1px solid ${P2}`, position: 'sticky', top: 0, zIndex: 1 }}>
                {['Name', 'Officer ID', 'Role', 'Unit', 'Status', 'Last Login', ''].map(h => (
                  <th
                    key={h}
                    style={{
                      padding: '0.6rem 0.9rem',
                      textAlign: 'left',
                      color: P4,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontFamily: "'JetBrains Mono', monospace",
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const rc = ROLE_CONFIG[u.role];
                const sc = STATUS_COLORS[u.status];
                const isSelected = selected?.id === u.id;
                return (
                  <tr
                    key={u.id}
                    onClick={() => setSelected(isSelected ? null : u)}
                    style={{
                      background: isSelected ? P2 + 'cc' : 'transparent',
                      borderBottom: `1px solid ${P2}`,
                      cursor: 'pointer',
                    }}
                  >
                    <td style={{ padding: '0.65rem 0.9rem' }}>
                      <div style={{ fontWeight: 600, color: '#e8dcc8' }}>{isAr ? u.displayNameAr : u.displayName}</div>
                      <div style={{ color: P4, fontSize: '0.72rem' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '0.65rem 0.9rem', fontFamily: "'JetBrains Mono', monospace", color: GOLD, fontSize: '0.78rem' }}>
                      {u.officerId}
                    </td>
                    <td style={{ padding: '0.65rem 0.9rem' }}>
                      <span style={{ padding: '0.2rem 0.55rem', borderRadius: 3, background: rc.color + '22', color: rc.color, fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace" }}>
                        {isAr ? rc.labelAr : rc.labelEn}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem 0.9rem', color: P4, fontSize: '0.78rem', maxWidth: 200 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.unit}</div>
                    </td>
                    <td style={{ padding: '0.65rem 0.9rem' }}>
                      <span style={{ padding: '0.2rem 0.55rem', borderRadius: 3, background: sc + '22', color: sc, fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace" }}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem 0.9rem', color: P4, fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' }}>
                      {fmt(u.lastLogin)}
                    </td>
                    <td style={{ padding: '0.65rem 0.9rem', textAlign: 'right' }}>
                      <i className="ri-arrow-right-s-line" style={{ color: isSelected ? GOLD : P4, fontSize: '1rem' }} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: P4 }}>
                    No users match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected && (
          <div
            style={{
              width: 360,
              background: P1,
              borderLeft: `1px solid ${P2}`,
              padding: '1.25rem',
              overflowY: 'auto',
              flexShrink: 0,
            }}
          >
            <UserDetail
              user={selected}
              isAr={isAr}
              onClose={() => setSelected(null)}
              onStatusChange={handleStatusChange}
              onRoleChange={handleRoleChange}
            />
          </div>
        )}
      </div>

      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} onAdd={handleAdd} isAr={isAr} />}
    </div>
  );
}
