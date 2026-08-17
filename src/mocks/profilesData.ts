export type ProfileStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
export type ProfileDomain = 'Events' | 'Hits' | 'Identities' | 'Services';
export type ConditionOp   = 'equals' | 'contains' | 'starts_with' | 'in_list' | 'range' | 'regex' | 'phonetic';
export type ConnectorType = 'WHERE' | 'AND' | 'OR';

export interface ProfileCondition {
  id: string;
  connector: ConnectorType;
  field: string;
  operator: ConditionOp;
  value: string;
}

export interface ProfileActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  detail?: string;
}

export interface RiskProfile {
  id: string;
  name: string;
  nameAr?: string;
  domain: ProfileDomain;
  status: ProfileStatus;
  description: string;
  conditions: ProfileCondition[];
  riskWeight: number;
  matchCount: number;
  lastTested?: string;
  createdDate: string;
  modifiedDate: string;
  createdBy: string;
  tags: string[];
  activityLog: ProfileActivityLog[];
}

// ── Mock Test Result (used by Test Profile function) ──────────
export interface ProfileTestMatch {
  id: string;
  name: string;
  matchedFields: string[];
  riskScore: number;
  domain: string;
}

export interface ProfileTestResult {
  totalMatches: number;
  sampleMatches: ProfileTestMatch[];
  unusableFields: string[];
  testedAt: string;
}

export const MOCK_PROFILES: RiskProfile[] = [
  {
    id: 'PRF-001',
    name: 'High-Frequency Entry — Short Stays',
    nameAr: 'دخول متكرر مع إقامات قصيرة',
    domain: 'Events',
    status: 'ACTIVE',
    description: 'Identifies travelers entering more than 4 times in 90 days with stays under 7 days. Indicative of courier or facilitation activity.',
    conditions: [
      { id: 'c1', connector: 'WHERE', field: 'entry_count_90d', operator: 'range',    value: '4,999'   },
      { id: 'c2', connector: 'AND',   field: 'avg_stay_days',   operator: 'range',    value: '0,7'     },
      { id: 'c3', connector: 'AND',   field: 'nationality',     operator: 'in_list',  value: 'IRN,AFG,PKN,SYR' },
    ],
    riskWeight: 72,
    matchCount: 14,
    lastTested: '2026-08-16T11:20',
    createdDate: '2026-01-15',
    modifiedDate: '2026-07-02',
    createdBy: 'admin.system',
    tags: ['entry-frequency', 'courier-risk', 'active'],
    activityLog: [
      { id: 'l1', action: 'ACTIVATED', user: 'ops.manager', timestamp: '2026-01-20T09:00', detail: 'Activated after UAT' },
      { id: 'l2', action: 'MODIFIED',  user: 'analyst.a',   timestamp: '2026-07-02T14:30', detail: 'Added IRN to nationality list' },
    ],
  },
  {
    id: 'PRF-002',
    name: 'Document Expiry Pattern',
    nameAr: 'نمط انتهاء صلاحية الوثيقة',
    domain: 'Identities',
    status: 'ACTIVE',
    description: 'Flags subjects presenting documents within 30 days of expiry for the second time in 12 months — a known modus for travel document abuse.',
    conditions: [
      { id: 'c1', connector: 'WHERE', field: 'doc_days_to_expiry', operator: 'range',   value: '0,30'  },
      { id: 'c2', connector: 'AND',   field: 'prior_near_expiry',  operator: 'equals',  value: 'true'  },
      { id: 'c3', connector: 'AND',   field: 'prior_near_expiry_period', operator: 'range', value: '0,365' },
    ],
    riskWeight: 55,
    matchCount: 7,
    lastTested: '2026-08-17T08:00',
    createdDate: '2026-03-10',
    modifiedDate: '2026-03-10',
    createdBy: 'analyst.b',
    tags: ['document-abuse', 'expiry'],
    activityLog: [
      { id: 'l1', action: 'CREATED',   user: 'analyst.b',   timestamp: '2026-03-10T10:00' },
      { id: 'l2', action: 'ACTIVATED', user: 'ops.manager', timestamp: '2026-03-15T09:00' },
    ],
  },
  {
    id: 'PRF-003',
    name: 'Transit Overstay Risk',
    nameAr: 'خطر تجاوز إقامة العبور',
    domain: 'Events',
    status: 'ACTIVE',
    description: 'Identifies passengers on transit visa who have not departed within the permitted window. Raises alert for immigration action.',
    conditions: [
      { id: 'c1', connector: 'WHERE', field: 'visa_type',         operator: 'equals', value: 'TRANSIT' },
      { id: 'c2', connector: 'AND',   field: 'days_since_entry',  operator: 'range',  value: '3,999'   },
      { id: 'c3', connector: 'AND',   field: 'departure_recorded', operator: 'equals', value: 'false'  },
    ],
    riskWeight: 88,
    matchCount: 31,
    lastTested: '2026-08-14T16:45',
    createdDate: '2025-11-01',
    modifiedDate: '2026-06-20',
    createdBy: 'admin.system',
    tags: ['overstay', 'transit', 'high-priority'],
    activityLog: [
      { id: 'l1', action: 'CREATED',   user: 'admin.system', timestamp: '2025-11-01T09:00' },
      { id: 'l2', action: 'MODIFIED',  user: 'analyst.c',    timestamp: '2026-06-20T11:00', detail: 'Extended range to 3+ days (was 5+)' },
    ],
  },
  {
    id: 'PRF-004',
    name: 'Multi-Alias Traveler',
    nameAr: 'مسافر بأسماء متعددة',
    domain: 'Identities',
    status: 'DRAFT',
    description: 'Draft profile to detect subjects with 3 or more registered aliases across different document types — potential identity manipulation.',
    conditions: [
      { id: 'c1', connector: 'WHERE', field: 'alias_count',    operator: 'range',  value: '3,99'  },
      { id: 'c2', connector: 'AND',   field: 'doc_type_count', operator: 'range',  value: '2,99'  },
    ],
    riskWeight: 65,
    matchCount: 0,
    createdDate: '2026-08-10',
    modifiedDate: '2026-08-10',
    createdBy: 'analyst.a',
    tags: ['identity', 'alias', 'draft'],
    activityLog: [
      { id: 'l1', action: 'CREATED', user: 'analyst.a', timestamp: '2026-08-10T14:00' },
    ],
  },
  {
    id: 'PRF-005',
    name: 'Known Cargo Route + Financial Alert',
    nameAr: 'مسار شحن معروف مع تنبيه مالي',
    domain: 'Services',
    status: 'EXPIRED',
    description: 'Expired — was used for a specific operation in Q1. Detects passengers on MCT-KHI/BOM with financial crime flags on the same entity.',
    conditions: [
      { id: 'c1', connector: 'WHERE', field: 'route',           operator: 'in_list', value: 'MCT-KHI,MCT-BOM' },
      { id: 'c2', connector: 'AND',   field: 'financial_flag',  operator: 'equals',  value: 'true'            },
    ],
    riskWeight: 80,
    matchCount: 3,
    lastTested: '2026-04-01T10:00',
    createdDate: '2026-02-01',
    modifiedDate: '2026-04-01',
    createdBy: 'analyst.b',
    tags: ['cargo', 'financial-crime', 'expired'],
    activityLog: [
      { id: 'l1', action: 'CREATED', user: 'analyst.b', timestamp: '2026-02-01T09:00' },
      { id: 'l2', action: 'EXPIRED', user: 'admin.system', timestamp: '2026-04-01T00:00', detail: 'Passed scheduled expiry' },
    ],
  },
];

// ── Simulated test results per profile ─────────────────────────
export const MOCK_TEST_RESULTS: Record<string, ProfileTestResult> = {
  'PRF-001': {
    totalMatches: 14,
    sampleMatches: [
      { id: 'SR-001', name: 'Mohammed K. Al-Farsi',  matchedFields: ['entry_count_90d', 'avg_stay_days', 'nationality'], riskScore: 78, domain: 'Events' },
      { id: 'SR-002', name: 'Kamran N. Rahmani',     matchedFields: ['entry_count_90d', 'avg_stay_days'],                riskScore: 62, domain: 'Events' },
      { id: 'SR-003', name: 'Ali H. Karimi',         matchedFields: ['entry_count_90d', 'avg_stay_days', 'nationality'], riskScore: 81, domain: 'Events' },
    ],
    unusableFields: [],
    testedAt: '2026-08-16T11:20',
  },
  'PRF-002': {
    totalMatches: 7,
    sampleMatches: [
      { id: 'SR-011', name: 'John P. Okonkwo',      matchedFields: ['doc_days_to_expiry', 'prior_near_expiry'], riskScore: 55, domain: 'Identities' },
      { id: 'SR-012', name: 'Viktor S. Naumov',     matchedFields: ['doc_days_to_expiry', 'prior_near_expiry'], riskScore: 57, domain: 'Identities' },
    ],
    unusableFields: [],
    testedAt: '2026-08-17T08:00',
  },
  'PRF-003': {
    totalMatches: 31,
    sampleMatches: [
      { id: 'SR-021', name: 'Tariq Al-Hadhrami', matchedFields: ['visa_type', 'days_since_entry', 'departure_recorded'], riskScore: 88, domain: 'Events' },
      { id: 'SR-022', name: 'Deepak R. Sharma',   matchedFields: ['visa_type', 'days_since_entry', 'departure_recorded'], riskScore: 88, domain: 'Events' },
      { id: 'SR-023', name: 'Zara N. Butt',        matchedFields: ['visa_type', 'days_since_entry'],                       riskScore: 72, domain: 'Events' },
    ],
    unusableFields: [],
    testedAt: '2026-08-14T16:45',
  },
  'PRF-004': {
    totalMatches: 0,
    sampleMatches: [],
    unusableFields: [],
    testedAt: '',
  },
  'PRF-005': {
    totalMatches: 3,
    sampleMatches: [
      { id: 'SR-031', name: 'H. K. Muradi', matchedFields: ['route', 'financial_flag'], riskScore: 80, domain: 'Services' },
    ],
    unusableFields: [],
    testedAt: '2026-04-01T10:00',
  },
};

export const STATUS_COLORS: Record<ProfileStatus, string> = {
  ACTIVE: '#4A8E5A', DRAFT: '#5B7494', EXPIRED: '#374B61', SUSPENDED: '#D4922A',
};

export const AVAILABLE_FIELDS: Record<string, string[]> = {
  Events:     ['entry_count_90d', 'avg_stay_days', 'nationality', 'visa_type', 'days_since_entry', 'departure_recorded', 'port_of_entry', 'route'],
  Identities: ['doc_days_to_expiry', 'prior_near_expiry', 'prior_near_expiry_period', 'alias_count', 'doc_type_count', 'nationality', 'dob_year'],
  Services:   ['route', 'financial_flag', 'flight_no', 'airline', 'origin', 'destination', 'pax_count', 'hit_count'],
  Hits:       ['watchlist_source', 'match_type', 'risk_score', 'hit_date', 'status', 'assigned_to'],
};
