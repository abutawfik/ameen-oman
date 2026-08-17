export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'ANALYST' | 'OPERATOR' | 'AUDITOR' | 'VIEWER';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'INACTIVE';

export interface UserLoginEntry {
  at: string;
  ip: string;
  location: string;
  device: string;
  success: boolean;
}

export interface ManagedUser {
  id: string;
  displayName: string;
  displayNameAr: string;
  email: string;
  officerId: string;
  role: UserRole;
  status: UserStatus;
  unit: string;
  phone: string;
  timezone: string;
  language: 'en' | 'ar';
  createdAt: string;
  lastLogin: string | null;
  loginHistory: UserLoginEntry[];
  assignedModules: string[];
  mfaEnabled: boolean;
  notes: string;
}

export const ROLE_CONFIG: Record<UserRole, { labelEn: string; labelAr: string; color: string }> = {
  SUPER_ADMIN: { labelEn: 'Super Admin',          labelAr: 'مشرف أعلى',          color: '#C94A5E' },
  ADMIN:       { labelEn: 'Administrator',         labelAr: 'مشرف النظام',        color: '#D4922A' },
  ANALYST:     { labelEn: 'Intelligence Analyst',  labelAr: 'محلل استخباراتي',    color: '#5B7494' },
  OPERATOR:    { labelEn: 'Border Operator',       labelAr: 'مشغّل حدودي',        color: '#4A8E5A' },
  AUDITOR:     { labelEn: 'Auditor',               labelAr: 'مدقق',               color: '#D6B47E' },
  VIEWER:      { labelEn: 'Read-Only Viewer',      labelAr: 'مشاهد فقط',          color: '#374B61' },
};

export const STATUS_COLORS: Record<UserStatus, string> = {
  ACTIVE:    '#4A8E5A',
  SUSPENDED: '#C94A5E',
  PENDING:   '#D4922A',
  INACTIVE:  '#374B61',
};

export const MANAGED_USERS: ManagedUser[] = [
  {
    id: 'usr-001',
    displayName: 'Ahmed Al-Balushi',
    displayNameAr: 'أحمد البلوشي',
    email: 'ahmed.balushi@rop.gov.om',
    officerId: 'ROP-0024',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    unit: 'National Intelligence Centre',
    phone: '+968 2456 7890',
    timezone: 'Asia/Muscat',
    language: 'ar',
    createdAt: '2024-01-15T08:00:00Z',
    lastLogin: '2026-08-17T06:14:22Z',
    mfaEnabled: true,
    notes: 'Platform owner — NIC director.',
    assignedModules: ['all'],
    loginHistory: [
      { at: '2026-08-17T06:14:22Z', ip: '10.10.1.4',   location: 'Muscat HQ',    device: 'Chrome 127 / Windows 11', success: true },
      { at: '2026-08-16T07:22:11Z', ip: '10.10.1.4',   location: 'Muscat HQ',    device: 'Chrome 127 / Windows 11', success: true },
      { at: '2026-08-15T08:01:55Z', ip: '10.10.1.4',   location: 'Muscat HQ',    device: 'Chrome 127 / Windows 11', success: true },
    ],
  },
  {
    id: 'usr-002',
    displayName: 'Nour Al-Habsi',
    displayNameAr: 'نور الحبسي',
    email: 'nour.habsi@rop.gov.om',
    officerId: 'ROP-0031',
    role: 'ADMIN',
    status: 'ACTIVE',
    unit: 'Border Control Administration',
    phone: '+968 2456 8010',
    timezone: 'Asia/Muscat',
    language: 'ar',
    createdAt: '2024-03-01T09:00:00Z',
    lastLogin: '2026-08-17T07:30:00Z',
    mfaEnabled: true,
    notes: 'Manages day-shift admin tasks.',
    assignedModules: ['search', 'persons-of-interest', 'manage-users', 'reports'],
    loginHistory: [
      { at: '2026-08-17T07:30:00Z', ip: '10.10.2.8',   location: 'Seeb Border Gate', device: 'Firefox 128 / Windows 10', success: true },
      { at: '2026-08-16T07:45:12Z', ip: '10.10.2.8',   location: 'Seeb Border Gate', device: 'Firefox 128 / Windows 10', success: true },
      { at: '2026-08-15T07:12:44Z', ip: '10.10.2.9',   location: 'Seeb Border Gate', device: 'Firefox 128 / Windows 10', success: false },
    ],
  },
  {
    id: 'usr-003',
    displayName: 'Saif Al-Rawahi',
    displayNameAr: 'سيف الرواحي',
    email: 'saif.rawahi@rop.gov.om',
    officerId: 'ROP-0044',
    role: 'ANALYST',
    status: 'ACTIVE',
    unit: 'Intelligence Analysis Division',
    phone: '+968 2456 9021',
    timezone: 'Asia/Muscat',
    language: 'en',
    createdAt: '2024-05-12T10:00:00Z',
    lastLogin: '2026-08-17T05:55:00Z',
    mfaEnabled: true,
    notes: 'Specialised in travel risk profiling.',
    assignedModules: ['search', 'persons-of-interest', 'risk-tracker', 'reports', 'entity-resolution'],
    loginHistory: [
      { at: '2026-08-17T05:55:00Z', ip: '172.16.0.22', location: 'Analysis Wing', device: 'Safari 17 / macOS', success: true },
      { at: '2026-08-16T06:10:40Z', ip: '172.16.0.22', location: 'Analysis Wing', device: 'Safari 17 / macOS', success: true },
    ],
  },
  {
    id: 'usr-004',
    displayName: 'Fatma Al-Kindy',
    displayNameAr: 'فاطمة الكندي',
    email: 'fatma.kindy@rop.gov.om',
    officerId: 'ROP-0058',
    role: 'OPERATOR',
    status: 'ACTIVE',
    unit: 'Muscat Int\'l Airport — Terminal 2',
    phone: '+968 2456 3344',
    timezone: 'Asia/Muscat',
    language: 'ar',
    createdAt: '2024-08-20T08:30:00Z',
    lastLogin: '2026-08-17T04:10:00Z',
    mfaEnabled: false,
    notes: 'Night-shift gate operator.',
    assignedModules: ['search', 'hit-search'],
    loginHistory: [
      { at: '2026-08-17T04:10:00Z', ip: '192.168.10.5', location: 'MCIA T2', device: 'Chrome 127 / Windows 10', success: true },
      { at: '2026-08-16T04:22:00Z', ip: '192.168.10.5', location: 'MCIA T2', device: 'Chrome 127 / Windows 10', success: true },
      { at: '2026-08-14T04:05:00Z', ip: '192.168.10.5', location: 'MCIA T2', device: 'Chrome 127 / Windows 10', success: false },
      { at: '2026-08-14T04:08:00Z', ip: '192.168.10.5', location: 'MCIA T2', device: 'Chrome 127 / Windows 10', success: true },
    ],
  },
  {
    id: 'usr-005',
    displayName: 'Khalid Al-Zaabi',
    displayNameAr: 'خالد الزعبي',
    email: 'khalid.zaabi@rop.gov.om',
    officerId: 'ROP-0072',
    role: 'AUDITOR',
    status: 'ACTIVE',
    unit: 'Internal Audit',
    phone: '+968 2456 1122',
    timezone: 'Asia/Muscat',
    language: 'en',
    createdAt: '2024-09-05T09:00:00Z',
    lastLogin: '2026-08-15T11:00:00Z',
    mfaEnabled: true,
    notes: 'Quarterly platform compliance audits.',
    assignedModules: ['audit-log', 'reports'],
    loginHistory: [
      { at: '2026-08-15T11:00:00Z', ip: '10.20.0.14', location: 'Audit Office', device: 'Edge 127 / Windows 11', success: true },
    ],
  },
  {
    id: 'usr-006',
    displayName: 'Mariam Al-Farsi',
    displayNameAr: 'مريم الفارسي',
    email: 'mariam.farsi@ncsi.gov.om',
    officerId: 'NCSI-0011',
    role: 'VIEWER',
    status: 'ACTIVE',
    unit: 'NCSI Statistics Liaison',
    phone: '+968 2480 0100',
    timezone: 'Asia/Muscat',
    language: 'en',
    createdAt: '2025-01-10T10:00:00Z',
    lastLogin: '2026-08-12T09:22:00Z',
    mfaEnabled: false,
    notes: 'Read-only access for inter-agency reporting.',
    assignedModules: ['reports'],
    loginHistory: [
      { at: '2026-08-12T09:22:00Z', ip: '41.68.12.4', location: 'External / NCSI', device: 'Chrome 127 / Windows 10', success: true },
    ],
  },
  {
    id: 'usr-007',
    displayName: 'Ibrahim Al-Shaibani',
    displayNameAr: 'إبراهيم الشيباني',
    email: 'ibrahim.shaibani@rop.gov.om',
    officerId: 'ROP-0099',
    role: 'OPERATOR',
    status: 'SUSPENDED',
    unit: 'Salalah Airport',
    phone: '+968 2349 8800',
    timezone: 'Asia/Muscat',
    language: 'ar',
    createdAt: '2024-11-01T08:00:00Z',
    lastLogin: '2026-07-30T12:14:00Z',
    mfaEnabled: false,
    notes: 'Suspended pending HR investigation — 2026-08-01.',
    assignedModules: ['search'],
    loginHistory: [
      { at: '2026-07-30T12:14:00Z', ip: '192.168.22.7', location: 'Salalah Airport', device: 'Chrome 127 / Windows 10', success: true },
      { at: '2026-07-29T11:58:00Z', ip: '192.168.22.7', location: 'Salalah Airport', device: 'Chrome 127 / Windows 10', success: true },
    ],
  },
  {
    id: 'usr-008',
    displayName: 'Reem Al-Masroori',
    displayNameAr: 'ريم المسروري',
    email: 'reem.masroori@rop.gov.om',
    officerId: 'ROP-0108',
    role: 'ANALYST',
    status: 'PENDING',
    unit: 'Intelligence Analysis Division',
    phone: '+968 2456 5500',
    timezone: 'Asia/Muscat',
    language: 'en',
    createdAt: '2026-08-10T09:00:00Z',
    lastLogin: null,
    mfaEnabled: false,
    notes: 'New hire — pending first login and MFA setup.',
    assignedModules: [],
    loginHistory: [],
  },
];
