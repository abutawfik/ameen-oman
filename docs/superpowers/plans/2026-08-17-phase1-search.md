# Phase 1 — Search + Immediate UX Wins

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Search section (Ad Hoc, Hit, Service) plus targeted UX improvements to hit management, traveler cards, and dashboard navigation — covering 15 roadmap items from Phase 1.

**Architecture:** New `/dashboard/search` route with a three-tab layout (Ad Hoc / Hit Search / Service Search). Mock data drives all results. Ad Hoc Search contains a mode toggle (General / Query Builder) and a Saved Queries side panel. Results are shown in Table or Card view with sorting, filtering, pagination, and CSV export. Hit and Service tabs follow the same result container pattern. Customer-session UX fixes are applied inline to the existing watchlist/case-management/dashboard pages.

**Tech Stack:** React 18 + TypeScript, React Router v6, TailwindCSS + inline CSS-vars (AlAmeen design tokens: `--alm-ocean-*`, gold `#B8893C`), Remix Icons (`ri-*`), `useOutletContext<DashboardOutletContext>` for lang/isAr, `@/mocks/*` for mock data, `@/` path alias for `src/`.

---

## File Map

### New files (create)
```
src/mocks/searchData.ts                          — all types + mock data for search
src/pages/dashboard/search/page.tsx             — top-level search page (tab container)
src/pages/dashboard/search/components/
  SearchTabBar.tsx                              — Ad Hoc | Hit Search | Service Search tabs
  AdHocSearch.tsx                               — mode/domain state, delegates to sub-components
  GeneralSearchBar.tsx                          — text input, domain selector, mode/fuzzy toggles
  QueryBuilder.tsx                              — multi-condition builder, AND/OR connectors
  SavedQueriesPanel.tsx                         — slide-in panel: list, save, run, delete
  SearchResultsView.tsx                         — view toggle (Table/Card), sort, filter, CSV export
  ResultTableView.tsx                           — sortable table, column manager
  ResultCardView.tsx                            — card grid
  TravelerCard.tsx                              — single card: journey route, contact icons, bags, indicators
  HitSearch.tsx                                 — filter form + hit result cards
  HitCard.tsx                                   — hit card with inline status update + dropdown comments
  ServiceSearch.tsx                             — service filter form + service result cards
  ServiceManifest.tsx                           — flight manifest table with indicator icons
```

### Modified files
```
src/mocks/dashboardData.ts                       — add Search entry to navItems (new "search" group)
src/router/config.tsx                            — add lazy SearchPage route at /dashboard/search
src/pages/dashboard/watchlist/components/        — update hit status update to use dropdown comments
```

---

## Task 1: Mock Data + Types

**Files:**
- Create: `src/mocks/searchData.ts`

- [ ] **Step 1: Create searchData.ts with all types and mock records**

```typescript
// src/mocks/searchData.ts

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
  email?: string; phone?: string;
}

export interface SearchResult {
  id: string;
  domain: SearchDomain;
  relevanceScore: number;
  matchType: MatchType;
  // Traveler fields
  name: string;         nameAr: string;
  nationality: string;  nationalityCode: string;
  dob: string;
  docNumber: string;    docType: string;
  riskScore: number;    riskLevel: RiskLevel;
  hitCount: number;
  // Event fields
  eventType:  string;   eventDate:  string;
  location:   string;   flight?:    string;
  route?:     string;
  // Contact + journey (for detail panel)
  contact?: TravelerContact;
  journey?: JourneyLeg[];
  bags?: { count: number; weightKg: number };
  indicators?: TravelerIndicator[];
  // Hit fields (when domain === 'hits')
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
  name:      string;
  domain:    SearchDomain;
  mode:      SearchMode;
  query?:    string;
  conditions?: QueryCondition[];
  isShared:  boolean;
  createdAt: string;
  lastRun?:  string;
}

export interface HitSearchResult {
  id: string;
  travelerName:  string; travelerNameAr: string;
  nationality:   string; docNumber: string;
  riskLevel:     RiskLevel;
  hitStatus:     HitStatus;
  watchlistName: string;
  matchReason:   string;
  flight:        string; route: string;
  arrivalDate:   string;
  notes:         string;
  comment?:      string;
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

// ── Hit Comment Presets ───────────────────────────────────────
export const HIT_COMMENT_PRESETS = [
  { value: 'identity_confirmed', labelEn: 'Identity confirmed — no risk', labelAr: 'هوية مؤكدة — لا خطر' },
  { value: 'secondary_screening', labelEn: 'Referred for secondary screening', labelAr: 'أُحيل للفحص الثانوي' },
  { value: 'false_positive_doc', labelEn: 'False positive — document mismatch', labelAr: 'إيجابية خاطئة — عدم تطابق الوثيقة' },
  { value: 'escalated_supervisor', labelEn: 'Escalated to supervisor', labelAr: 'صُعِّد إلى المشرف' },
  { value: 'transferred_case', labelEn: 'Transferred to case', labelAr: 'نُقل إلى قضية' },
  { value: 'insufficient_evidence', labelEn: 'Insufficient evidence', labelAr: 'أدلة غير كافية' },
  { value: 'under_investigation', labelEn: 'Under active investigation', labelAr: 'قيد التحقيق النشط' },
  { value: 'custom', labelEn: 'Other (specify below)', labelAr: 'أخرى (حدد أدناه)' },
] as const;

export type HitCommentPreset = typeof HIT_COMMENT_PRESETS[number]['value'];

// ── Query Builder field options ───────────────────────────────
export const QUERY_FIELDS: Record<SearchDomain, { value: string; label: string; type: 'text' | 'date' | 'select' | 'number' }[]> = {
  events: [
    { value: 'traveler.lastName',   label: 'Last Name',       type: 'text' },
    { value: 'traveler.firstName',  label: 'First Name',      type: 'text' },
    { value: 'traveler.dob',        label: 'Date of Birth',   type: 'date' },
    { value: 'traveler.nationality',label: 'Nationality',     type: 'text' },
    { value: 'traveler.docNumber',  label: 'Document Number', type: 'text' },
    { value: 'event.flightNo',      label: 'Flight Number',   type: 'text' },
    { value: 'event.origin',        label: 'Origin Airport',  type: 'text' },
    { value: 'event.destination',   label: 'Destination',     type: 'text' },
    { value: 'event.date',          label: 'Event Date',      type: 'date' },
    { value: 'event.type',          label: 'Event Type',      type: 'select' },
  ],
  hits: [
    { value: 'hit.status',          label: 'Hit Status',      type: 'select' },
    { value: 'hit.riskLevel',       label: 'Risk Level',      type: 'select' },
    { value: 'hit.watchlist',       label: 'Watchlist',       type: 'text' },
    { value: 'traveler.lastName',   label: 'Last Name',       type: 'text' },
    { value: 'traveler.nationality',label: 'Nationality',     type: 'text' },
    { value: 'hit.date',            label: 'Hit Date',        type: 'date' },
  ],
  identities: [
    { value: 'identity.lastName',   label: 'Last Name',       type: 'text' },
    { value: 'identity.firstName',  label: 'First Name',      type: 'text' },
    { value: 'identity.dob',        label: 'Date of Birth',   type: 'date' },
    { value: 'identity.nationality',label: 'Nationality',     type: 'text' },
    { value: 'identity.docNumber',  label: 'Document Number', type: 'text' },
    { value: 'identity.gender',     label: 'Gender',          type: 'select' },
  ],
  services: [
    { value: 'service.flightNo',    label: 'Flight Number',   type: 'text' },
    { value: 'service.airline',     label: 'Airline',         type: 'text' },
    { value: 'service.origin',      label: 'Origin',          type: 'text' },
    { value: 'service.destination', label: 'Destination',     type: 'text' },
    { value: 'service.date',        label: 'Date',            type: 'date' },
    { value: 'service.status',      label: 'Status',          type: 'select' },
  ],
};

export const QUERY_OPERATORS = {
  text:   ['equals', 'contains', 'starts_with', 'ends_with', 'not_equals', 'regex'],
  date:   ['equals', 'before', 'after', 'between'],
  select: ['equals', 'not_equals', 'in'],
  number: ['equals', 'greater_than', 'less_than', 'between'],
} as const;

// ── Indicator definitions ─────────────────────────────────────
export const INDICATORS: TravelerIndicator[] = [
  { type: 'go_show',   label: 'Go-Show',          labelAr: 'حجز مفاجئ',  icon: 'ri-plane-line',         color: '#D4922A' },
  { type: 'no_show',   label: 'No-Show',           labelAr: 'غياب',       icon: 'ri-plane-fill',         color: '#C94A5E' },
  { type: 'checked_in',label: 'Checked In',        labelAr: 'تسجيل وصول', icon: 'ri-checkbox-circle-line',color: '#4A8E5A' },
  { type: 'boarded',   label: 'Boarded',           labelAr: 'صعد الطائرة',icon: 'ri-flight-takeoff-line', color: '#4A7AA8' },
  { type: 'hit',       label: 'Risk Hit',          labelAr: 'تطابق مخاطر',icon: 'ri-alarm-warning-fill',  color: '#C94A5E' },
  { type: 'vip',       label: 'VIP',               labelAr: 'شخصية مهمة', icon: 'ri-vip-crown-line',      color: '#B8893C' },
  { type: 'biometric', label: 'Biometric Enrolled',labelAr: 'بيومتري',    icon: 'ri-fingerprint-line',    color: '#4A8E98' },
];

// ── Mock Search Results ───────────────────────────────────────
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
      { type: 'hit', label: 'Risk Hit', labelAr: 'تطابق مخاطر', icon: 'ri-alarm-warning-fill', color: '#C94A5E' },
      { type: 'go_show', label: 'Go-Show', labelAr: 'حجز مفاجئ', icon: 'ri-plane-line', color: '#D4922A' },
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
    contact: { email: undefined, phone: '+98 21 000 005' },
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
    contact: { email: 'h.albakri@gmail.com', phone: undefined },
    journey: [
      { from: 'Damascus', fromCode: 'DAM', to: 'Muscat', toCode: 'MCT', flightNo: 'RB181', airline: 'Royal Air', dep: '2026-08-14 18:30', arr: '2026-08-14 22:00', isCurrent: true },
    ],
    bags: { count: 2, weightKg: 33 },
    indicators: [
      { type: 'hit', label: 'Risk Hit', labelAr: 'تطابق مخاطر', icon: 'ri-alarm-warning-fill', color: '#C94A5E' },
      { type: 'boarded', label: 'Boarded', labelAr: 'صعد الطائرة', icon: 'ri-flight-takeoff-line', color: '#4A7AA8' },
    ],
  },
];

// ── Mock Hit Search Results ───────────────────────────────────
export const MOCK_HIT_RESULTS: HitSearchResult[] = [
  { id: 'H001', travelerName: 'Abdul R. Hashemi', travelerNameAr: 'عبد الرحمن الهاشمي', nationality: 'IRN', docNumber: 'IR5881', riskLevel: 'high', hitStatus: 'NEW', watchlistName: 'INTERPOL Nominal', matchReason: 'Document number exact match on INTERPOL Red Notice #2024-IRN-0417', flight: 'WS5881', route: 'IKA→MCT', arrivalDate: '2026-08-16', notes: '' },
  { id: 'H002', travelerName: 'Yasir A. Karim', travelerNameAr: 'ياسر الكريم', nationality: 'PAK', docNumber: 'PK2876341', riskLevel: 'critical', hitStatus: 'UNDER_REVIEW', watchlistName: 'National Security WL', matchReason: 'Sanctions match: OFAC SDN List + INTERPOL Blue Notice', flight: 'PK207', route: 'KHI→MCT', arrivalDate: '2026-08-17', notes: 'Secondary screening initiated at gate' },
  { id: 'H003', travelerName: 'Hasan M. Al-Bakri', travelerNameAr: 'حسن البكري', nationality: 'SYR', docNumber: 'SY1954976', riskLevel: 'medium', hitStatus: 'ACKNOWLEDGED', watchlistName: 'National Security WL', matchReason: 'Name phonetic match — Hasan Al-Bakri / Hassan Al-Bakry', flight: 'RB181', route: 'DAM→MCT', arrivalDate: '2026-08-14', notes: '' },
  { id: 'H004', travelerName: 'Ivan S. Volkov', travelerNameAr: 'إيفان فولكوف', nationality: 'RUS', docNumber: 'RU9920014', riskLevel: 'high', hitStatus: 'RESOLVED', watchlistName: 'Financial Crime WL', matchReason: 'Entity match on financial sanctions list (EU Regulation 2024)', flight: 'SU261', route: 'SVO→MCT', arrivalDate: '2026-08-13', notes: 'Confirmed false positive — different person, same name variant', comment: 'false_positive_doc' },
  { id: 'H005', travelerName: 'Omar F. Tadris', travelerNameAr: 'عمر تدريس', nationality: 'LBY', docNumber: 'LY3301882', riskLevel: 'medium', hitStatus: 'FALSE_POSITIVE', watchlistName: 'Overstay WL', matchReason: 'Profile match: visa overstay pattern + routing anomaly', flight: 'LY124', route: 'TRP→MCT', arrivalDate: '2026-08-12', notes: '', comment: 'identity_confirmed' },
];

// ── Mock Service Search Results ───────────────────────────────
export const MOCK_SERVICE_RESULTS: ServiceSearchResult[] = [
  { id: 'SVC001', flightNo: 'EK865', airline: 'Emirates', airlineCode: 'EK', origin: 'DXB', destination: 'MCT', departureDate: '2026-08-17T14:15', arrivalDate: '2026-08-17T16:20', paxCount: 238, hitCount: 3, highRiskCount: 1, status: 'arrived' },
  { id: 'SVC002', flightNo: 'PK207', airline: 'Pakistan International Airlines', airlineCode: 'PK', origin: 'KHI', destination: 'MCT', departureDate: '2026-08-17T03:00', arrivalDate: '2026-08-17T05:30', paxCount: 154, hitCount: 1, highRiskCount: 1, status: 'arrived' },
  { id: 'SVC003', flightNo: 'AF672', airline: 'Air France', airlineCode: 'AF', origin: 'CDG', destination: 'MCT', departureDate: '2026-08-17T14:00', arrivalDate: '2026-08-18T00:45', paxCount: 312, hitCount: 0, highRiskCount: 0, status: 'scheduled' },
  { id: 'SVC004', flightNo: 'WY101', airline: 'Oman Air', airlineCode: 'WY', origin: 'LHR', destination: 'MCT', departureDate: '2026-08-17T09:30', arrivalDate: '2026-08-17T20:15', paxCount: 278, hitCount: 2, highRiskCount: 0, status: 'departed' },
  { id: 'SVC005', flightNo: 'EK863', airline: 'Emirates', airlineCode: 'EK', origin: 'DXB', destination: 'MCT', departureDate: '2026-08-17T07:45', arrivalDate: '2026-08-17T09:50', paxCount: 204, hitCount: 1, highRiskCount: 0, status: 'arrived' },
];

export const MOCK_MANIFEST_EK865: ManifestPassenger[] = [
  { id: 'MP001', name: 'Mikhail V. Petrov',  nationality: 'RUS', docNumber: 'RU1568499', dob: '1979-03-14', seatNo: '12A', riskScore: 68, riskLevel: 'high',     hitCount: 2, boardingStatus: 'boarded',    contact: { email: 'm.petrov@fsb.gov.ru' } },
  { id: 'MP002', name: 'Sarah J. Thompson',  nationality: 'GBR', docNumber: 'GB4490221', dob: '1988-06-17', seatNo: '14C', riskScore: 10, riskLevel: 'low',      hitCount: 0, boardingStatus: 'boarded',    contact: { email: 's.thompson@tourism.uk' } },
  { id: 'MP003', name: 'Ahmed K. Al-Sayedi', nationality: 'OMN', docNumber: 'OM7820033', dob: '1975-12-02', seatNo: '22F', riskScore: 5,  riskLevel: 'low',      hitCount: 0, boardingStatus: 'boarded',    contact: {} },
  { id: 'MP004', name: 'Liu W. Chen',         nationality: 'CHN', docNumber: 'CH6640112', dob: '1995-08-25', seatNo: '31B', riskScore: 30, riskLevel: 'medium',   hitCount: 0, boardingStatus: 'no_show',    contact: { phone: '+86 10 000 0104' } },
  { id: 'MP005', name: 'Priya R. Sharma',     nationality: 'IND', docNumber: 'IN8890541', dob: '1991-04-14', seatNo: '7D',  riskScore: 15, riskLevel: 'low',      hitCount: 0, boardingStatus: 'boarded',    contact: { email: 'priya.s@infosys.com' } },
  { id: 'MP006', name: 'Kareem Z. Okafor',    nationality: 'NGA', docNumber: 'NG3310889', dob: '1983-01-30', seatNo: '19A', riskScore: 44, riskLevel: 'medium',   hitCount: 1, boardingStatus: 'go_show',    contact: {} },
];

// ── Saved Queries ─────────────────────────────────────────────
export const MOCK_SAVED_QUERIES: SavedQuery[] = [
  { id: 'SQ001', name: 'High risk arrivals today', domain: 'events', mode: 'builder', isShared: true, createdAt: '2026-08-10', lastRun: '2026-08-17', conditions: [{ id: 'c1', field: 'event.date', operator: 'equals', value: 'TODAY', connector: 'AND' }, { id: 'c2', field: 'event.destination', operator: 'equals', value: 'MCT', connector: 'AND' }] },
  { id: 'SQ002', name: 'INTERPOL nominal hits — unacknowledged', domain: 'hits', mode: 'builder', isShared: true, createdAt: '2026-08-05', lastRun: '2026-08-16', conditions: [{ id: 'c1', field: 'hit.watchlist', operator: 'contains', value: 'INTERPOL', connector: 'AND' }, { id: 'c2', field: 'hit.status', operator: 'equals', value: 'NEW', connector: 'AND' }] },
  { id: 'SQ003', name: 'Iranian nationals — EK flights', domain: 'events', mode: 'general', query: 'Iran EK MCT', isShared: false, createdAt: '2026-08-12', lastRun: '2026-08-14' },
  { id: 'SQ004', name: 'Passengers with 3+ bags', domain: 'events', mode: 'builder', isShared: false, createdAt: '2026-08-13', conditions: [{ id: 'c1', field: 'event.bagCount', operator: 'greater_than', value: '2', connector: 'AND' }] },
];
```

- [ ] **Step 2: Commit**
```bash
git add src/mocks/searchData.ts
git commit -m "feat(search): add search mock data — types, results, hit, service, manifests"
```

---

## Task 2: Router + Nav Entry

**Files:**
- Modify: `src/router/config.tsx`
- Modify: `src/mocks/dashboardData.ts`

- [ ] **Step 1: Add search to navItems in dashboardData.ts**

In `src/mocks/dashboardData.ts`, add after the `home` entry:
```typescript
{ key: "search", icon: "ri-search-2-line", labelEn: "Search", labelAr: "البحث", route: "/dashboard/search", group: "search" },
```
Also add `"search"` to the `groupLabels` in `DashboardSidebar.tsx`:
```typescript
search: { en: "SEARCH", ar: "البحث" },
```

- [ ] **Step 2: Add lazy SearchPage import and route in router/config.tsx**

```typescript
const SearchPage = lazy(() => import("../pages/dashboard/search/page"));
// Inside routes children array:
{ path: "search", element: L(SearchPage) },
```

- [ ] **Step 3: Commit**
```bash
git add src/mocks/dashboardData.ts src/router/config.tsx
git commit -m "feat(search): wire /dashboard/search route + nav item"
```

---

## Task 3: Search Page Shell + Tab Bar

**Files:**
- Create: `src/pages/dashboard/search/page.tsx`
- Create: `src/pages/dashboard/search/components/SearchTabBar.tsx`

- [ ] **Step 1: Create SearchTabBar.tsx**

```tsx
// src/pages/dashboard/search/components/SearchTabBar.tsx
interface Props {
  active: 'adhoc' | 'hit' | 'service';
  onChange: (tab: 'adhoc' | 'hit' | 'service') => void;
  isAr: boolean;
}

const TABS = [
  { key: 'adhoc',   icon: 'ri-search-2-line',        labelEn: 'Ad Hoc Search',  labelAr: 'بحث مخصص',      badgeKey: 'results' as const },
  { key: 'hit',     icon: 'ri-alarm-warning-line',    labelEn: 'Hit Search',     labelAr: 'بحث التطابق',   badgeKey: null },
  { key: 'service', icon: 'ri-flight-takeoff-line',   labelEn: 'Service Search', labelAr: 'بحث الرحلات',   badgeKey: null },
] as const;

export default function SearchTabBar({ active, onChange, isAr }: Props) {
  return (
    <div className="flex border-b" style={{ borderColor: 'rgba(184,138,60,0.15)', background: 'rgba(5,20,40,0.6)' }}>
      {TABS.map(t => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key as typeof active)}
            className="flex items-center gap-2 px-5 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors"
            style={{
              borderBottomColor: isActive ? '#B8893C' : 'transparent',
              color: isActive ? '#D6B47E' : '#5B7494',
              background: 'none', border: 'none', borderBottom: `2px solid ${isActive ? '#B8893C' : 'transparent'}`,
              cursor: 'pointer', letterSpacing: '0.1em',
            }}
            aria-selected={isActive}
          >
            <i className={t.icon} style={{ fontSize: 14 }} />
            {isAr ? t.labelAr : t.labelEn}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create search/page.tsx**

```tsx
// src/pages/dashboard/search/page.tsx
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
    <div className="flex flex-col h-full" style={{ background: '#051428' }}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: 'linear-gradient(rgba(184,138,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.025) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        {/* Page title */}
        <div className="px-6 pt-5 pb-0">
          <div className="flex items-center gap-3 mb-1">
            <i className="ri-search-2-line text-gold-400" style={{ color: '#B8893C', fontSize: 18 }} />
            <h1 className="font-mono text-xs uppercase tracking-widest" style={{ color: '#B8893C' }}>
              {isAr ? 'البحث والاستعلام' : 'Search & Query'}
            </h1>
          </div>
          <p className="text-gray-500 text-xs mb-4 font-mono">
            {isAr
              ? 'البحث عبر قواعد البيانات: الأحداث · التطابقات · الهويات · الخدمات'
              : 'Search across Events · Hits · Identities · Services'}
          </p>
        </div>

        {/* Tab bar */}
        <SearchTabBar active={activeTab} onChange={setActiveTab} isAr={isAr} />

        {/* Tab content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'adhoc'   && <AdHocSearch   isAr={isAr} />}
          {activeTab === 'hit'     && <HitSearch     isAr={isAr} />}
          {activeTab === 'service' && <ServiceSearch  isAr={isAr} />}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**
```bash
git add src/pages/dashboard/search/
git commit -m "feat(search): search page shell + tab bar (Ad Hoc / Hit / Service)"
```

---

## Task 4: Ad Hoc Search — General Mode + Query Builder

**Files:**
- Create: `src/pages/dashboard/search/components/AdHocSearch.tsx`
- Create: `src/pages/dashboard/search/components/GeneralSearchBar.tsx`
- Create: `src/pages/dashboard/search/components/QueryBuilder.tsx`

See implementation in execution — full component code with all fields, operators, domain selector, phonetic toggle, match type badges.

---

## Task 5: Search Results View (Table + Card + Sort + Export)

**Files:**
- Create: `src/pages/dashboard/search/components/SearchResultsView.tsx`
- Create: `src/pages/dashboard/search/components/ResultTableView.tsx`
- Create: `src/pages/dashboard/search/components/ResultCardView.tsx`
- Create: `src/pages/dashboard/search/components/TravelerCard.tsx`

Table view: sortable columns (click header = asc/desc), column manager, match type badge, risk score chip, indicators, pagination. Card view: TravelerCard with journey route mini-timeline, contact icons, bag count, indicator icons. CSV export button calls `exportToCSV(results, columns)`.

---

## Task 6: Saved Queries Panel

**Files:**
- Create: `src/pages/dashboard/search/components/SavedQueriesPanel.tsx`

Slide-in panel from right: list of saved queries (personal + shared), run (loads form state + executes), save current, delete.

---

## Task 7: Hit Search + Hit Card

**Files:**
- Create: `src/pages/dashboard/search/components/HitSearch.tsx`
- Create: `src/pages/dashboard/search/components/HitCard.tsx`

Filter form: hit status checkboxes, watchlist selector, risk level filter, date range, nationality. Results as HitCard components. HitCard: traveler info, match reason, watchlist, risk chip, status badge, one-click ACK button, inline resolve with dropdown (HIT_COMMENT_PRESETS), optional free-text notes field.

---

## Task 8: Service Search + Manifest

**Files:**
- Create: `src/pages/dashboard/search/components/ServiceSearch.tsx`
- Create: `src/pages/dashboard/search/components/ServiceManifest.tsx`

Service form: flight number, origin, destination, date picker, airline code. Results: ServiceResult cards (paxCount, hitCount, highRiskCount, status badge, route). Click service → expand ServiceManifest table with indicator icons (boarded/no-show/go-show/hit), risk score per passenger, contact icons.

---

## Task 9: Indicator Icons — Global Component

**Files:**
- Create: `src/components/TravelerIndicators.tsx`

```tsx
import { INDICATORS, type TravelerIndicator } from '@/mocks/searchData';

interface Props {
  indicators: TravelerIndicator[];
  size?: number;
}

export function TravelerIndicators({ indicators, size = 13 }: Props) {
  if (!indicators?.length) return null;
  return (
    <span className="flex gap-1 flex-wrap">
      {indicators.map(ind => (
        <span
          key={ind.type}
          title={ind.label}
          aria-label={ind.label}
          className="inline-flex items-center justify-center rounded"
          style={{ width: size + 4, height: size + 4, background: `${ind.color}22`, border: `1px solid ${ind.color}55` }}
        >
          <i className={ind.icon} style={{ fontSize: size, color: ind.color }} />
        </span>
      ))}
    </span>
  );
}
```

Apply `<TravelerIndicators>` in TravelerCard, ResultTableView row, and ManifestPassenger row.

---

## Task 10: Hit Comment Dropdown (UX Fix)

**Files:**
- Modify: `src/pages/dashboard/watchlist/components/WatchlistManager.tsx` (or wherever hit status update renders)

Replace free-text comment field with:
```tsx
import { HIT_COMMENT_PRESETS, type HitCommentPreset } from '@/mocks/searchData';

// In hit status update form:
const [preset, setPreset] = useState<HitCommentPreset | ''>('');
const [extraNote, setExtraNote] = useState('');

<select value={preset} onChange={e => setPreset(e.target.value as HitCommentPreset)}>
  <option value="">— Select reason —</option>
  {HIT_COMMENT_PRESETS.map(p => (
    <option key={p.value} value={p.value}>{isAr ? p.labelAr : p.labelEn}</option>
  ))}
</select>
{preset === 'custom' && (
  <textarea value={extraNote} onChange={e => setExtraNote(e.target.value)} placeholder="Describe..." rows={2} />
)}
```

---

## Task 11: Commit & Verify

- [ ] Run dev server: `npm run dev`
- [ ] Navigate to http://localhost:3002/dashboard/search
- [ ] Verify all three tabs render
- [ ] Verify Ad Hoc search returns mock results
- [ ] Verify sort on table columns
- [ ] Verify Hit Search inline ACK
- [ ] Verify Service Search → manifest expansion
- [ ] Verify CSV export downloads a file
- [ ] Toggle Arabic RTL — verify layout flips
- [ ] Final commit:
```bash
git add -p
git commit -m "feat(phase1): Search section complete — Ad Hoc, Hit, Service, Saved Queries, Indicators, Hit Comments"
```

---

## Self-Review Checklist

- [x] Ad Hoc Search (General + Builder) — Tasks 3, 4
- [x] Search sorting — ResultTableView column headers
- [x] Name matching / phonetic toggle — GeneralSearchBar
- [x] Saved Queries — Task 6
- [x] Hit Search + inline status update — Task 7
- [x] Hit Comment dropdown (customer item 1.7) — Task 10
- [x] Hit status streamlined (one-click ACK) — HitCard
- [x] Service Search + manifest — Task 8
- [x] Traveler indicators (go-show/no-show) — Task 9
- [x] Full journey route display — TravelerCard journey legs
- [x] Passenger contact icons — TravelerCard + ManifestPassenger
- [x] Bag count/weight on passenger screen — TravelerCard + mock data
- [x] CSV export — SearchResultsView export button
- [x] Arabic RTL — all components use `isAr` prop
- [x] Types consistent — SearchResult, HitSearchResult, ServiceSearchResult defined once in searchData.ts
