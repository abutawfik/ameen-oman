export type POICategory = 'INTERPOL' | 'NATIONAL' | 'FINANCIAL' | 'TERRORISM' | 'CUSTOMS' | 'DIPLOMATIC';
export type POIStatus   = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EXPIRED';
export type POIThreat   = 'critical' | 'high' | 'medium' | 'low';

export interface POIAlias {
  name: string;
  script?: 'latin' | 'arabic' | 'cyrillic' | 'other';
}

export interface POIIdentity {
  docType: string;
  docNumber: string;
  issuingCountry: string;
  expiry?: string;
}

export interface POISighting {
  id: string;
  location: string;
  locationCode: string;
  date: string;
  context: string;
  flightNo?: string;
  verified: boolean;
}

export interface PersonOfInterest {
  id: string;
  name: string;       nameAr?: string;
  category: POICategory;
  status: POIStatus;
  threat: POIThreat;
  nationality: string; nationalityCode: string;
  dob: string;
  gender: 'M' | 'F';
  aliases: POIAlias[];
  identities: POIIdentity[];
  description: string;
  sourceRef: string;
  sourceOrg: string;
  addedDate: string;
  expiryDate?: string;
  lastSeen?: string;
  lastSeenLocation?: string;
  sightings: POISighting[];
  tags: string[];
  photoUrl?: string;
  linkedCases: number;
  alertCount: number;
}

export const POI_LIST: PersonOfInterest[] = [
  {
    id: 'POI-001',
    name: 'Aleksandr N. Volkov', nameAr: 'ألكسندر فولكوف',
    category: 'INTERPOL', status: 'ACTIVE', threat: 'critical',
    nationality: 'Russia', nationalityCode: 'RUS', dob: '1971-06-15', gender: 'M',
    aliases: [{ name: 'Alex Volkov' }, { name: 'Aleksandr Wolkow', script: 'latin' }, { name: 'А. Волков', script: 'cyrillic' }],
    identities: [
      { docType: 'PASSPORT', docNumber: 'RU7210044', issuingCountry: 'RUS', expiry: '2027-03-01' },
      { docType: 'PASSPORT', docNumber: 'RU4499210', issuingCountry: 'RUS', expiry: '2025-11-15' },
    ],
    description: 'Subject linked to financial fraud network operating across Eastern Europe and GCC. INTERPOL Red Notice issued 2023.',
    sourceRef: 'INTERPOL-RN-2023-RUS-7214',
    sourceOrg: 'INTERPOL NCB Moscow / Europol',
    addedDate: '2023-09-12',
    lastSeen: '2026-07-03',
    lastSeenLocation: 'Dubai International — DXB',
    sightings: [
      { id: 's1', location: 'Muscat', locationCode: 'MCT', date: '2026-06-14', context: 'Transit passenger — MCT–DXB', flightNo: 'EK866', verified: true },
      { id: 's2', location: 'Dubai', locationCode: 'DXB', date: '2026-07-03', context: 'Entry recorded at DXB immigration', verified: true },
    ],
    tags: ['financial-crime', 'interpol-red', 'GCC-travel'],
    linkedCases: 3, alertCount: 2,
  },
  {
    id: 'POI-002',
    name: 'Tariq M. Al-Rashidi', nameAr: 'طارق الرشيدي',
    category: 'NATIONAL', status: 'ACTIVE', threat: 'high',
    nationality: 'Jordan', nationalityCode: 'JOR', dob: '1984-02-28', gender: 'M',
    aliases: [{ name: 'Tarek Al-Rashidy' }, { name: 'طارق رشيدي', script: 'arabic' }],
    identities: [
      { docType: 'PASSPORT', docNumber: 'JO5533821', issuingCountry: 'JOR', expiry: '2028-08-10' },
    ],
    description: 'National security interest. Suspected facilitation of document fraud network. Monitored under national directive NSC-2024-11.',
    sourceRef: 'NSC-OMN-2024-114',
    sourceOrg: 'Royal Oman Police — National Security',
    addedDate: '2024-03-07',
    lastSeen: '2026-08-01',
    lastSeenLocation: 'Muscat — MCT',
    sightings: [
      { id: 's1', location: 'Muscat', locationCode: 'MCT', date: '2026-08-01', context: 'Arrival on WY401', flightNo: 'WY401', verified: true },
      { id: 's2', location: 'Salalah', locationCode: 'SLL', date: '2026-07-12', context: 'Overland border crossing', verified: false },
    ],
    tags: ['doc-fraud', 'national-security', 'active-monitor'],
    linkedCases: 1, alertCount: 4,
  },
  {
    id: 'POI-003',
    name: 'Fatemeh R. Ahmadi', nameAr: 'فاطمة أحمدي',
    category: 'FINANCIAL', status: 'ACTIVE', threat: 'high',
    nationality: 'Iran', nationalityCode: 'IRN', dob: '1979-11-09', gender: 'F',
    aliases: [{ name: 'Fatima Ahmadi' }, { name: 'F. Rezaei' }],
    identities: [
      { docType: 'PASSPORT', docNumber: 'IR8821003', issuingCountry: 'IRN', expiry: '2026-12-31' },
    ],
    description: 'OFAC SDN list — sanctions evasion via front companies in UAE and Oman. Listed under E.O. 13902.',
    sourceRef: 'OFAC-SDN-2024-IR-4421',
    sourceOrg: 'OFAC / US Treasury',
    addedDate: '2024-07-19',
    lastSeen: '2026-05-22',
    lastSeenLocation: 'Frankfurt — FRA',
    sightings: [
      { id: 's1', location: 'Muscat', locationCode: 'MCT', date: '2025-11-14', context: 'Arrived on Iranian charter — no hit raised (pre-listing)', verified: true },
    ],
    tags: ['ofac-sdn', 'sanctions', 'financial-crime', 'iran'],
    linkedCases: 2, alertCount: 0,
  },
  {
    id: 'POI-004',
    name: 'Hassan K. Muradi', nameAr: 'حسن مرادي',
    category: 'TERRORISM', status: 'ACTIVE', threat: 'critical',
    nationality: 'Afghanistan', nationalityCode: 'AFG', dob: '1988-04-03', gender: 'M',
    aliases: [{ name: 'Abu Khalid' }, { name: 'H. Al-Muradi' }, { name: 'حسن الخالدي', script: 'arabic' }],
    identities: [
      { docType: 'PASSPORT', docNumber: 'AF2241007', issuingCountry: 'AFG', expiry: '2024-06-01' },
      { docType: 'PASSPORT', docNumber: 'PK8890041', issuingCountry: 'PAK', expiry: '2027-09-15' },
    ],
    description: 'UN Security Council 1267 List — designated individual. Known travel to conflict zones. Multiple travel documents.',
    sourceRef: 'UNSC-1267-AFG-0441',
    sourceOrg: 'UNSC / INTERPOL CTID',
    addedDate: '2022-01-30',
    lastSeen: '2026-03-17',
    lastSeenLocation: 'Karachi — KHI',
    sightings: [
      { id: 's1', location: 'Muscat', locationCode: 'MCT', date: '2023-08-22', context: 'Transit — PK207; flagged and detained for secondary', flightNo: 'PK207', verified: true },
    ],
    tags: ['unsc-1267', 'terrorism', 'multiple-docs', 'high-priority'],
    linkedCases: 5, alertCount: 1,
  },
  {
    id: 'POI-005',
    name: 'Victor O. Mwangi', nameAr: 'فيكتور مونجي',
    category: 'CUSTOMS', status: 'ACTIVE', threat: 'medium',
    nationality: 'Kenya', nationalityCode: 'KEN', dob: '1991-07-25', gender: 'M',
    aliases: [{ name: 'V. Mwangi' }, { name: 'Victor Otieno' }],
    identities: [
      { docType: 'PASSPORT', docNumber: 'KE3310784', issuingCountry: 'KEN', expiry: '2028-02-20' },
    ],
    description: 'Repeat customs violation. Smuggling of undeclared currency and luxury goods. Regional Customs Alert RCA-2024-KEN.',
    sourceRef: 'RCA-2024-KEN-008',
    sourceOrg: 'Oman Customs — Regional Intelligence',
    addedDate: '2024-11-05',
    lastSeen: '2026-08-10',
    lastSeenLocation: 'Muscat — MCT',
    sightings: [
      { id: 's1', location: 'Muscat', locationCode: 'MCT', date: '2026-08-10', context: 'Arrival KQ102 — flagged by customs profile', flightNo: 'KQ102', verified: true },
      { id: 's2', location: 'Salalah', locationCode: 'SLL', date: '2026-06-18', context: 'Arrival — currency declaration discrepancy', verified: true },
    ],
    tags: ['customs', 'currency-smuggling', 'repeat-offender'],
    linkedCases: 0, alertCount: 3,
  },
  {
    id: 'POI-006',
    name: 'Layla S. Al-Khouri', nameAr: 'ليلى الخوري',
    category: 'DIPLOMATIC', status: 'INACTIVE', threat: 'low',
    nationality: 'Lebanon', nationalityCode: 'LBN', dob: '1975-03-30', gender: 'F',
    aliases: [{ name: 'Leila Khoury' }],
    identities: [
      { docType: 'DIPLOMATIC_PASSPORT', docNumber: 'LB-DIPL-0091', issuingCountry: 'LBN', expiry: '2025-06-01' },
    ],
    description: 'Former diplomatic passport — expired. Flagged for potential misuse of expired credentials on commercial travel.',
    sourceRef: 'DSA-LBN-2025-004',
    sourceOrg: 'Directorate of Security Affairs',
    addedDate: '2025-02-14',
    expiryDate: '2026-02-14',
    lastSeen: '2025-12-01',
    lastSeenLocation: 'Beirut — BEY',
    sightings: [],
    tags: ['diplomatic', 'expired-credentials', 'low-priority'],
    linkedCases: 0, alertCount: 0,
  },
];

export const CATEGORY_CONFIG: Record<POICategory, { labelEn: string; labelAr: string; icon: string; color: string }> = {
  INTERPOL:   { labelEn: 'INTERPOL',    labelAr: 'إنتربول',        icon: 'ri-global-line',          color: '#C94A5E' },
  NATIONAL:   { labelEn: 'National',    labelAr: 'وطني',           icon: 'ri-shield-keyhole-line',  color: '#4A7AA8' },
  FINANCIAL:  { labelEn: 'Financial',   labelAr: 'مالي',           icon: 'ri-bank-line',            color: '#D4922A' },
  TERRORISM:  { labelEn: 'Terrorism',   labelAr: 'إرهاب',         icon: 'ri-alarm-warning-fill',   color: '#C94A5E' },
  CUSTOMS:    { labelEn: 'Customs',     labelAr: 'جمارك',          icon: 'ri-archive-line',         color: '#A78BFA' },
  DIPLOMATIC: { labelEn: 'Diplomatic',  labelAr: 'دبلوماسي',       icon: 'ri-government-line',      color: '#4A8E5A' },
};

export const THREAT_COLORS: Record<POIThreat, string> = {
  critical: '#C94A5E', high: '#D4922A', medium: '#D6B47E', low: '#4A8E5A',
};
