export type SearchDomain = 'events' | 'hits' | 'identities' | 'services';
export type SearchMode   = 'general' | 'builder';
export type ResultView   = 'table' | 'card';
export type MatchType    = 'EXACT' | 'PHONETIC' | 'WILDCARD' | 'FUZZY';
export type HitStatus    = 'NEW' | 'ACKNOWLEDGED' | 'UNDER_REVIEW' | 'RESOLVED' | 'FALSE_POSITIVE';
export type RiskLevel    = 'critical' | 'high' | 'medium' | 'low';
export type BoardingStatus = 'boarded' | 'no_show' | 'go_show' | 'checked_in' | 'pending';

export interface TravelerIndicator {
  type: 'go_show' | 'no_show' | 'checked_in' | 'boarded' | 'hit' | 'vip' | 'biometric';
  label: string;
  labelAr: string;
  icon: string;
  color: string;
}

export interface JourneyLeg {
  from: string; fromCode: string;
  to:   string; toCode:   string;
  flightNo: string; airline: string;
  dep: string; arr: string;
  isCurrent: boolean;
}

export interface TravelerContact {
  email?: string;
  phone?: string;
}

export interface SearchResult {
  id: string;
  domain: SearchDomain;
  relevanceScore: number;
  matchType: MatchType;
  name: string;      nameAr: string;
  nationality: string; nationalityCode: string;
  dob: string;
  docNumber: string; docType: string;
  riskScore: number; riskLevel: RiskLevel;
  hitCount: number;
  eventType: string; eventDate: string;
  location: string;  flight?: string; route?: string;
  contact?: TravelerContact;
  journey?: JourneyLeg[];
  bags?: { count: number; weightKg: number };
  indicators?: TravelerIndicator[];
  hitStatus?: HitStatus;
  watchlistName?: string;
  matchReason?: string;
}

export interface QueryCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  connector: 'AND' | 'OR';
}

export interface SavedQuery {
  id: string;
  name: string;
  domain: SearchDomain;
  mode: SearchMode;
  query?: string;
  conditions?: QueryCondition[];
  isShared: boolean;
  createdAt: string;
  lastRun?: string;
}

export interface HitSearchResult {
  id: string;
  travelerName: string; travelerNameAr: string;
  nationality: string;  docNumber: string;
  riskLevel: RiskLevel;
  hitStatus: HitStatus;
  watchlistName: string;
  matchReason: string;
  flight: string; route: string;
  arrivalDate: string;
  notes: string;
  comment?: string;
}

export interface ServiceSearchResult {
  id: string;
  flightNo: string; airline: string; airlineCode: string;
  origin: string; destination: string;
  departureDate: string; arrivalDate: string;
  paxCount: number; hitCount: number; highRiskCount: number;
  status: 'scheduled' | 'departed' | 'arrived' | 'cancelled';
}

export interface ManifestPassenger {
  id: string;
  name: string; nationality: string; docNumber: string; dob: string;
  seatNo: string;
  riskScore: number; riskLevel: RiskLevel;
  hitCount: number;
  boardingStatus: BoardingStatus;
  contact?: TravelerContact;
}

// ── Hit Comment Presets ──────────────────────────────────────
export const HIT_COMMENT_PRESETS = [
  { value: 'identity_confirmed',   labelEn: 'Identity confirmed — no risk',       labelAr: 'هوية مؤكدة — لا خطر' },
  { value: 'secondary_screening',  labelEn: 'Referred for secondary screening',   labelAr: 'أُحيل للفحص الثانوي' },
  { value: 'false_positive_doc',   labelEn: 'False positive — document mismatch', labelAr: 'إيجابية خاطئة — عدم تطابق الوثيقة' },
  { value: 'escalated_supervisor', labelEn: 'Escalated to supervisor',             labelAr: 'صُعِّد إلى المشرف' },
  { value: 'transferred_case',     labelEn: 'Transferred to case',                labelAr: 'نُقل إلى قضية' },
  { value: 'insufficient_evidence',labelEn: 'Insufficient evidence',               labelAr: 'أدلة غير كافية' },
  { value: 'under_investigation',  labelEn: 'Under active investigation',          labelAr: 'قيد التحقيق النشط' },
  { value: 'custom',               labelEn: 'Other (specify below)',               labelAr: 'أخرى (حدد أدناه)' },
] as const;

export type HitCommentPreset = typeof HIT_COMMENT_PRESETS[number]['value'];

// ── Query Builder field options ──────────────────────────────
export const QUERY_FIELDS: Record<SearchDomain, { value: string; label: string; type: 'text' | 'date' | 'select' | 'number' }[]> = {
  events: [
    { value: 'traveler.lastName',    label: 'Last Name',        type: 'text'   },
    { value: 'traveler.firstName',   label: 'First Name',       type: 'text'   },
    { value: 'traveler.dob',         label: 'Date of Birth',    type: 'date'   },
    { value: 'traveler.nationality', label: 'Nationality',      type: 'text'   },
    { value: 'traveler.docNumber',   label: 'Document Number',  type: 'text'   },
    { value: 'event.flightNo',       label: 'Flight Number',    type: 'text'   },
    { value: 'event.origin',         label: 'Origin Airport',   type: 'text'   },
    { value: 'event.destination',    label: 'Destination',      type: 'text'   },
    { value: 'event.date',           label: 'Event Date',       type: 'date'   },
    { value: 'event.type',           label: 'Event Type',       type: 'select' },
  ],
  hits: [
    { value: 'hit.status',           label: 'Hit Status',       type: 'select' },
    { value: 'hit.riskLevel',        label: 'Risk Level',       type: 'select' },
    { value: 'hit.watchlist',        label: 'Watchlist',        type: 'text'   },
    { value: 'traveler.lastName',    label: 'Last Name',        type: 'text'   },
    { value: 'traveler.nationality', label: 'Nationality',      type: 'text'   },
    { value: 'hit.date',             label: 'Hit Date',         type: 'date'   },
  ],
  identities: [
    { value: 'identity.lastName',    label: 'Last Name',        type: 'text'   },
    { value: 'identity.firstName',   label: 'First Name',       type: 'text'   },
    { value: 'identity.dob',         label: 'Date of Birth',    type: 'date'   },
    { value: 'identity.nationality', label: 'Nationality',      type: 'text'   },
    { value: 'identity.docNumber',   label: 'Document Number',  type: 'text'   },
    { value: 'identity.gender',      label: 'Gender',           type: 'select' },
  ],
  services: [
    { value: 'service.flightNo',     label: 'Flight Number',    type: 'text'   },
    { value: 'service.airline',      label: 'Airline',          type: 'text'   },
    { value: 'service.origin',       label: 'Origin',           type: 'text'   },
    { value: 'service.destination',  label: 'Destination',      type: 'text'   },
    { value: 'service.date',         label: 'Date',             type: 'date'   },
    { value: 'service.status',       label: 'Status',           type: 'select' },
  ],
};

export const QUERY_OPERATORS: Record<string, string[]> = {
  text:   ['equals', 'contains', 'starts_with', 'ends_with', 'not_equals'],
  date:   ['equals', 'before', 'after'],
  select: ['equals', 'not_equals'],
  number: ['equals', 'greater_than', 'less_than'],
};

// ── Indicator definitions ────────────────────────────────────
export const INDICATORS: TravelerIndicator[] = [
  { type: 'go_show',    label: 'Go-Show',           labelAr: 'حجز مفاجئ',   icon: 'ri-plane-line',          color: '#D4922A' },
  { type: 'no_show',    label: 'No-Show',            labelAr: 'غياب',        icon: 'ri-plane-fill',          color: '#C94A5E' },
  { type: 'checked_in', label: 'Checked In',         labelAr: 'تسجيل وصول', icon: 'ri-checkbox-circle-line',color: '#4A8E5A' },
  { type: 'boarded',    label: 'Boarded',            labelAr: 'صعد الطائرة',icon: 'ri-flight-takeoff-line', color: '#4A7AA8' },
  { type: 'hit',        label: 'Risk Hit',           labelAr: 'تطابق مخاطر',icon: 'ri-alarm-warning-fill',  color: '#C94A5E' },
  { type: 'vip',        label: 'VIP',                labelAr: 'شخصية مهمة', icon: 'ri-vip-crown-line',      color: '#B8893C' },
  { type: 'biometric',  label: 'Biometric Enrolled', labelAr: 'بيومتري',    icon: 'ri-fingerprint-line',    color: '#4A8E98' },
];

// ── Mock Search Results ──────────────────────────────────────
export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    id: 'SR001', domain: 'events', relevanceScore: 98, matchType: 'EXACT',
    name: 'Mikhail V. Petrov', nameAr: 'ميخائيل بيتروف',
    nationality: 'Russia', nationalityCode: 'RUS', dob: '1979-03-14',
    docNumber: 'RU1568499', docType: 'PASSPORT', riskScore: 68, riskLevel: 'high', hitCount: 2,
    eventType: 'CHECK_IN', eventDate: '2026-08-17', location: 'MCT', flight: 'EK865', route: 'DXB→MCT',
    contact: { email: 'm.petrov@fsb.gov.ru', phone: '+7 495 000 0001' },
    journey: [
      { from: 'Moscow', fromCode: 'SVO', to: 'Dubai', toCode: 'DXB', flightNo: 'EK141', airline: 'Emirates', dep: '2026-08-17 06:10', arr: '2026-08-17 12:30', isCurrent: false },
      { from: 'Dubai', fromCode: 'DXB', to: 'Muscat', toCode: 'MCT', flightNo: 'EK865', airline: 'Emirates', dep: '2026-08-17 14:15', arr: '2026-08-17 16:20', isCurrent: true },
    ],
    bags: { count: 2, weightKg: 28 },
    indicators: [{ type: 'hit', label: 'Risk Hit', labelAr: 'تطابق مخاطر', icon: 'ri-alarm-warning-fill', color: '#C94A5E' }],
  },
  {
    id: 'SR002', domain: 'events', relevanceScore: 91, matchType: 'EXACT',
    name: 'Leila D. Benaissa', nameAr: 'ليلى بنعيسى',
    nationality: 'Algeria', nationalityCode: 'DZA', dob: '1985-07-22',
    docNumber: 'DZA56473', docType: 'PASSPORT', riskScore: 37, riskLevel: 'medium', hitCount: 0,
    eventType: 'BORDER_CROSSING', eventDate: '2026-08-16', location: 'MCT', flight: 'AF672', route: 'CDG→MCT',
    contact: { email: 'leila.b@diplomatie.gov.dz', phone: '+213 21 000 002' },
    journey: [
      { from: 'Algiers', fromCode: 'ALG', to: 'Paris', toCode: 'CDG', flightNo: 'AF1234', airline: 'Air France', dep: '2026-08-16 07:00', arr: '2026-08-16 10:30', isCurrent: false },
      { from: 'Paris', fromCode: 'CDG', to: 'Muscat', toCode: 'MCT', flightNo: 'AF672', airline: 'Air France', dep: '2026-08-16 14:00', arr: '2026-08-17 00:45', isCurrent: true },
    ],
    bags: { count: 1, weightKg: 15 },
    indicators: [{ type: 'checked_in', label: 'Checked In', labelAr: 'تسجيل وصول', icon: 'ri-checkbox-circle-line', color: '#4A8E5A' }],
  },
  {
    id: 'SR003', domain: 'events', relevanceScore: 84, matchType: 'PHONETIC',
    name: 'Yasir A. Karim', nameAr: 'ياسر الكريم',
    nationality: 'Pakistan', nationalityCode: 'PAK', dob: '1990-11-05',
    docNumber: 'PK2876341', docType: 'PASSPORT', riskScore: 81, riskLevel: 'critical', hitCount: 3,
    eventType: 'API', eventDate: '2026-08-17', location: 'MCT', flight: 'PK207', route: 'KHI→MCT',
    contact: { email: 'y.karim@business.pk', phone: '+92 21 000 003' },
    journey: [
      { from: 'Karachi', fromCode: 'KHI', to: 'Muscat', toCode: 'MCT', flightNo: 'PK207', airline: 'PIA', dep: '2026-08-17 03:00', arr: '2026-08-17 05:30', isCurrent: true },
    ],
    bags: { count: 3, weightKg: 42 },
    indicators: [
      { type: 'hit',     label: 'Risk Hit', labelAr: 'تطابق مخاطر', icon: 'ri-alarm-warning-fill', color: '#C94A5E' },
      { type: 'go_show', label: 'Go-Show',  labelAr: 'حجز مفاجئ',   icon: 'ri-plane-line',         color: '#D4922A' },
    ],
  },
  {
    id: 'SR004', domain: 'events', relevanceScore: 77, matchType: 'EXACT',
    name: 'Sana M. Nguyen', nameAr: 'سانا نغوين',
    nationality: 'Vietnam', nationalityCode: 'VNM', dob: '1993-02-18',
    docNumber: 'VN1103693', docType: 'PASSPORT', riskScore: 22, riskLevel: 'low', hitCount: 0,
    eventType: 'PNR', eventDate: '2026-08-17', location: 'MCT', flight: 'VN515', route: 'SGN→MCT',
    contact: { email: 's.nguyen@tourist.vn', phone: '+84 28 000 004' },
    journey: [
      { from: 'Ho Chi Minh City', fromCode: 'SGN', to: 'Muscat', toCode: 'MCT', flightNo: 'VN515', airline: 'Vietnam Airlines', dep: '2026-08-17 08:00', arr: '2026-08-17 14:30', isCurrent: true },
    ],
    bags: { count: 1, weightKg: 20 },
    indicators: [{ type: 'checked_in', label: 'Checked In', labelAr: 'تسجيل وصول', icon: 'ri-checkbox-circle-line', color: '#4A8E5A' }],
  },
  {
    id: 'SR005', domain: 'hits', relevanceScore: 96, matchType: 'EXACT',
    name: 'Abdul R. Hashemi', nameAr: 'عبد الرحمن الهاشمي',
    nationality: 'Iran', nationalityCode: 'IRN', dob: '1972-09-30',
    docNumber: 'IR5881', docType: 'PASSPORT', riskScore: 77, riskLevel: 'high', hitCount: 1,
    eventType: 'API', eventDate: '2026-08-15', location: 'MCT', flight: 'WS5881', route: 'IKA→MCT',
    hitStatus: 'NEW', watchlistName: 'INTERPOL Nominal', matchReason: 'Document number exact match on INTERPOL Red Notice',
    contact: { phone: '+98 21 000 005' },
    journey: [
      { from: 'Tehran', fromCode: 'IKA', to: 'Muscat', toCode: 'MCT', flightNo: 'WS5881', airline: 'WestJet', dep: '2026-08-15 22:00', arr: '2026-08-16 01:30', isCurrent: true },
    ],
    bags: { count: 0, weightKg: 0 },
    indicators: [{ type: 'hit', label: 'Risk Hit', labelAr: 'تطابق مخاطر', icon: 'ri-alarm-warning-fill', color: '#C94A5E' }],
  },
  {
    id: 'SR006', domain: 'hits', relevanceScore: 88, matchType: 'FUZZY',
    name: 'Hasan M. Al-Bakri', nameAr: 'حسن البكري',
    nationality: 'Syria', nationalityCode: 'SYR', dob: '1981-05-12',
    docNumber: 'SY1954976', docType: 'PASSPORT', riskScore: 55, riskLevel: 'medium', hitCount: 1,
    eventType: 'PNR', eventDate: '2026-08-14', location: 'MCT', flight: 'RB181', route: 'DAM→MCT',
    hitStatus: 'ACKNOWLEDGED', watchlistName: 'National Security WL', matchReason: 'Name phonetic match — Hasan Al-Bakri / Hassan Al-Bakry',
    contact: { email: 'h.albakri@gmail.com' },
    journey: [
      { from: 'Damascus', fromCode: 'DAM', to: 'Muscat', toCode: 'MCT', flightNo: 'RB181', airline: 'Royal Air', dep: '2026-08-14 18:30', arr: '2026-08-14 22:00', isCurrent: true },
    ],
    bags: { count: 2, weightKg: 33 },
    indicators: [
      { type: 'hit',    label: 'Risk Hit', labelAr: 'تطابق مخاطر', icon: 'ri-alarm-warning-fill',  color: '#C94A5E' },
      { type: 'boarded',label: 'Boarded',  labelAr: 'صعد الطائرة', icon: 'ri-flight-takeoff-line', color: '#4A7AA8' },
    ],
  },
];

// ── Mock Hit Search Results ──────────────────────────────────
export const MOCK_HIT_RESULTS: HitSearchResult[] = [
  { id: 'H001', travelerName: 'Abdul R. Hashemi',  travelerNameAr: 'عبد الرحمن الهاشمي', nationality: 'IRN', docNumber: 'IR5881',     riskLevel: 'high',     hitStatus: 'NEW',           watchlistName: 'INTERPOL Nominal',   matchReason: 'Document number exact match on INTERPOL Red Notice #2024-IRN-0417',             flight: 'WS5881', route: 'IKA→MCT', arrivalDate: '2026-08-16', notes: '' },
  { id: 'H002', travelerName: 'Yasir A. Karim',    travelerNameAr: 'ياسر الكريم',         nationality: 'PAK', docNumber: 'PK2876341',  riskLevel: 'critical', hitStatus: 'UNDER_REVIEW',  watchlistName: 'National Security WL', matchReason: 'Sanctions match: OFAC SDN List + INTERPOL Blue Notice',                      flight: 'PK207',  route: 'KHI→MCT', arrivalDate: '2026-08-17', notes: 'Secondary screening initiated at gate' },
  { id: 'H003', travelerName: 'Hasan M. Al-Bakri', travelerNameAr: 'حسن البكري',          nationality: 'SYR', docNumber: 'SY1954976',  riskLevel: 'medium',   hitStatus: 'ACKNOWLEDGED',  watchlistName: 'National Security WL', matchReason: 'Name phonetic match — Hasan Al-Bakri / Hassan Al-Bakry',                     flight: 'RB181',  route: 'DAM→MCT', arrivalDate: '2026-08-14', notes: '' },
  { id: 'H004', travelerName: 'Ivan S. Volkov',    travelerNameAr: 'إيفان فولكوف',        nationality: 'RUS', docNumber: 'RU9920014',  riskLevel: 'high',     hitStatus: 'RESOLVED',      watchlistName: 'Financial Crime WL',   matchReason: 'Entity match on financial sanctions list (EU Regulation 2024)',               flight: 'SU261',  route: 'SVO→MCT', arrivalDate: '2026-08-13', notes: 'Confirmed false positive — different person, same name variant', comment: 'false_positive_doc' },
  { id: 'H005', travelerName: 'Omar F. Tadris',    travelerNameAr: 'عمر تدريس',           nationality: 'LBY', docNumber: 'LY3301882',  riskLevel: 'medium',   hitStatus: 'FALSE_POSITIVE', watchlistName: 'Overstay WL',          matchReason: 'Profile match: visa overstay pattern + routing anomaly',                     flight: 'LY124',  route: 'TRP→MCT', arrivalDate: '2026-08-12', notes: '', comment: 'identity_confirmed' },
];

// ── Mock Service Search Results ──────────────────────────────
export const MOCK_SERVICE_RESULTS: ServiceSearchResult[] = [
  { id: 'SVC001', flightNo: 'EK865', airline: 'Emirates',                      airlineCode: 'EK', origin: 'DXB', destination: 'MCT', departureDate: '2026-08-17T14:15', arrivalDate: '2026-08-17T16:20', paxCount: 238, hitCount: 3, highRiskCount: 1, status: 'arrived'   },
  { id: 'SVC002', flightNo: 'PK207', airline: 'Pakistan International Airlines',airlineCode: 'PK', origin: 'KHI', destination: 'MCT', departureDate: '2026-08-17T03:00', arrivalDate: '2026-08-17T05:30', paxCount: 154, hitCount: 1, highRiskCount: 1, status: 'arrived'   },
  { id: 'SVC003', flightNo: 'AF672', airline: 'Air France',                     airlineCode: 'AF', origin: 'CDG', destination: 'MCT', departureDate: '2026-08-17T14:00', arrivalDate: '2026-08-18T00:45', paxCount: 312, hitCount: 0, highRiskCount: 0, status: 'scheduled' },
  { id: 'SVC004', flightNo: 'WY101', airline: 'Oman Air',                       airlineCode: 'WY', origin: 'LHR', destination: 'MCT', departureDate: '2026-08-17T09:30', arrivalDate: '2026-08-17T20:15', paxCount: 278, hitCount: 2, highRiskCount: 0, status: 'departed'  },
  { id: 'SVC005', flightNo: 'EK863', airline: 'Emirates',                       airlineCode: 'EK', origin: 'DXB', destination: 'MCT', departureDate: '2026-08-17T07:45', arrivalDate: '2026-08-17T09:50', paxCount: 204, hitCount: 1, highRiskCount: 0, status: 'arrived'   },
];

export const MOCK_MANIFEST_EK865: ManifestPassenger[] = [
  { id: 'MP001', name: 'Mikhail V. Petrov',  nationality: 'RUS', docNumber: 'RU1568499', dob: '1979-03-14', seatNo: '12A', riskScore: 68, riskLevel: 'high',   hitCount: 2, boardingStatus: 'boarded',   contact: { email: 'm.petrov@fsb.gov.ru' } },
  { id: 'MP002', name: 'Sarah J. Thompson',  nationality: 'GBR', docNumber: 'GB4490221', dob: '1988-06-17', seatNo: '14C', riskScore: 10, riskLevel: 'low',    hitCount: 0, boardingStatus: 'boarded',   contact: { email: 's.thompson@tourism.uk' } },
  { id: 'MP003', name: 'Ahmed K. Al-Sayedi', nationality: 'OMN', docNumber: 'OM7820033', dob: '1975-12-02', seatNo: '22F', riskScore: 5,  riskLevel: 'low',    hitCount: 0, boardingStatus: 'boarded',   contact: {} },
  { id: 'MP004', name: 'Liu W. Chen',         nationality: 'CHN', docNumber: 'CH6640112', dob: '1995-08-25', seatNo: '31B', riskScore: 30, riskLevel: 'medium', hitCount: 0, boardingStatus: 'no_show',   contact: { phone: '+86 10 000 0104' } },
  { id: 'MP005', name: 'Priya R. Sharma',     nationality: 'IND', docNumber: 'IN8890541', dob: '1991-04-14', seatNo: '7D',  riskScore: 15, riskLevel: 'low',    hitCount: 0, boardingStatus: 'boarded',   contact: { email: 'priya.s@infosys.com' } },
  { id: 'MP006', name: 'Kareem Z. Okafor',    nationality: 'NGA', docNumber: 'NG3310889', dob: '1983-01-30', seatNo: '19A', riskScore: 44, riskLevel: 'medium', hitCount: 1, boardingStatus: 'go_show',   contact: {} },
];

// ── Saved Queries ────────────────────────────────────────────
export const MOCK_SAVED_QUERIES: SavedQuery[] = [
  { id: 'SQ001', name: 'High risk arrivals today',            domain: 'events', mode: 'builder', isShared: true,  createdAt: '2026-08-10', lastRun: '2026-08-17', conditions: [{ id: 'c1', field: 'event.date', operator: 'equals', value: 'TODAY', connector: 'AND' }, { id: 'c2', field: 'event.destination', operator: 'equals', value: 'MCT', connector: 'AND' }] },
  { id: 'SQ002', name: 'INTERPOL nominal hits — open',        domain: 'hits',   mode: 'builder', isShared: true,  createdAt: '2026-08-05', lastRun: '2026-08-16', conditions: [{ id: 'c1', field: 'hit.watchlist', operator: 'contains', value: 'INTERPOL', connector: 'AND' }, { id: 'c2', field: 'hit.status', operator: 'equals', value: 'NEW', connector: 'AND' }] },
  { id: 'SQ003', name: 'Iranian nationals — EK flights',      domain: 'events', mode: 'general', isShared: false, createdAt: '2026-08-12', lastRun: '2026-08-14', query: 'Iran EK MCT' },
  { id: 'SQ004', name: 'Passengers with 3+ checked bags',     domain: 'events', mode: 'builder', isShared: false, createdAt: '2026-08-13', conditions: [{ id: 'c1', field: 'event.bagCount', operator: 'greater_than', value: '2', connector: 'AND' }] },
];
