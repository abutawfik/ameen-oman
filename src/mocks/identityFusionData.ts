export interface PersonRecord {
  id: string;
  canonicalId: string;
  initials: string;
  nameEn: string;
  nameAr: string;
  nationality: string;
  nationalityFlag: string;
  dob: string;
  gender: 'M' | 'F';
  documents: { type: string; number: string; issueCountry: string; expiry: string }[];
  phones: string[];
  emails: string[];
  addresses: string[];
  imeis: string[];
  streams: string[];
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  mergedCount: number;
  lastSeen: string;
  aliases: string[];
  photo?: string;
}

export interface MergeCandidate {
  id: string;
  personA: PersonRecord;
  personB: PersonRecord;
  confidence: number;
  matchingRule: string;
  matchingRuleAr: string;
  matchingFields: string[];
  sourceStreams: string[];
  status: 'pending' | 'merged' | 'rejected' | 'flagged';
  createdAt: string;
  reviewedBy?: string;
}

export interface AliasLink {
  id: string;
  primaryId: string;
  aliasId: string;
  primaryName: string;
  aliasName: string;
  linkType: 'known_alias' | 'family' | 'associate' | 'suspected';
  confidence: number;
  createdAt: string;
  notes: string;
}

export interface GraphNode {
  id: string;
  label: string;
  initials: string;
  x: number;
  y: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  streams: string[];
  mergedCount: number;
  isCluster?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'document' | 'phone' | 'address' | 'imei' | 'employer' | 'biometric' | 'email';
  confidence: number;
  label: string;
}

export const personRecords: PersonRecord[] = [
  {
    id: 'PRS-001',
    canonicalId: 'CAN-2025-00001',
    initials: 'AR',
    nameEn: 'Ahmed Al-Rashidi',
    nameAr: 'أحمد الراشدي',
    nationality: 'OM',
    nationalityFlag: '🇴🇲',
    dob: '1985-03-12',
    gender: 'M',
    documents: [
      { type: 'Passport', number: 'OM-4523891', issueCountry: 'Oman', expiry: '2029-03-11' },
      { type: 'National ID', number: 'OM-NID-88234', issueCountry: 'Oman', expiry: '2027-06-30' },
    ],
    phones: ['+968 9234 5678', '+968 9876 0011'],
    emails: ['ahmed.rashidi@gmail.com'],
    addresses: ['Villa 12, Al Khuwair, Muscat', 'P.O. Box 441, Seeb'],
    imeis: ['358234091234567'],
    streams: ['hotel', 'mobile', 'financial', 'municipality', 'employment'],
    riskScore: 42,
    riskLevel: 'low',
    mergedCount: 3,
    lastSeen: '2025-04-06 09:14',
    aliases: ['Ahmad Al-Rashidy', 'Ahmed Rashidi'],
  },
  {
    id: 'PRS-002',
    canonicalId: 'CAN-2025-00002',
    initials: 'FB',
    nameEn: 'Fatima Al-Balushi',
    nameAr: 'فاطمة البلوشي',
    nationality: 'OM',
    nationalityFlag: '🇴🇲',
    dob: '1992-07-24',
    gender: 'F',
    documents: [
      { type: 'Passport', number: 'OM-7823401', issueCountry: 'Oman', expiry: '2028-07-23' },
      { type: 'Resident Card', number: 'RC-44521', issueCountry: 'Oman', expiry: '2026-12-31' },
    ],
    phones: ['+968 9112 3344'],
    emails: ['fatima.balushi@hotmail.com'],
    addresses: ['Apt 4B, Ruwi, Muscat'],
    imeis: ['490154203237518'],
    streams: ['hotel', 'healthcare', 'education', 'municipality'],
    riskScore: 18,
    riskLevel: 'low',
    mergedCount: 2,
    lastSeen: '2025-04-05 14:32',
    aliases: ['Fatimah Al-Balushi'],
  },
  {
    id: 'PRS-003',
    canonicalId: 'CAN-2025-00003',
    initials: 'MK',
    nameEn: 'Mohammed Al-Kindi',
    nameAr: 'محمد الكندي',
    nationality: 'OM',
    nationalityFlag: '🇴🇲',
    dob: '1978-11-05',
    gender: 'M',
    documents: [
      { type: 'Passport', number: 'OM-3312890', issueCountry: 'Oman', expiry: '2027-11-04' },
    ],
    phones: ['+968 9445 6677'],
    emails: ['m.kindi@omantel.net.om'],
    addresses: ['Villa 88, Seeb District, Muscat'],
    imeis: ['352099001761481', '867686021642002'],
    streams: ['hotel', 'car-rental', 'financial', 'transport', 'employment'],
    riskScore: 71,
    riskLevel: 'high',
    mergedCount: 5,
    lastSeen: '2025-04-06 07:55',
    aliases: ['Mohammad Al-Kindi', 'M. Kindi'],
  },
  {
    id: 'PRS-004',
    canonicalId: 'CAN-2025-00004',
    initials: 'SK',
    nameEn: 'Salim Al-Khatri',
    nameAr: 'سالم الخطري',
    nationality: 'OM',
    nationalityFlag: '🇴🇲',
    dob: '1990-02-18',
    gender: 'M',
    documents: [
      { type: 'Passport', number: 'OM-5512334', issueCountry: 'Oman', expiry: '2030-02-17' },
      { type: 'Work Permit', number: 'WP-88234', issueCountry: 'Oman', expiry: '2026-06-30' },
    ],
    phones: ['+968 9667 8899'],
    emails: ['salim.khatri@company.om'],
    addresses: ['Block C, Al Azaiba, Muscat'],
    imeis: ['012345678901234'],
    streams: ['employment', 'mobile', 'utility', 'municipality'],
    riskScore: 29,
    riskLevel: 'low',
    mergedCount: 1,
    lastSeen: '2025-04-04 16:20',
    aliases: [],
  },
  {
    id: 'PRS-005',
    canonicalId: 'CAN-2025-00005',
    initials: 'RJ',
    nameEn: 'Ravi Jayasinghe',
    nameAr: 'رافي جاياسينغه',
    nationality: 'IN',
    nationalityFlag: '🇮🇳',
    dob: '1988-09-30',
    gender: 'M',
    documents: [
      { type: 'Passport', number: 'IN-Z4523891', issueCountry: 'India', expiry: '2026-09-29' },
      { type: 'Resident Card', number: 'RC-77234', issueCountry: 'Oman', expiry: '2025-12-31' },
    ],
    phones: ['+968 9334 5566', '+91 98765 43210'],
    emails: ['ravi.j@techoman.com'],
    addresses: ['Flat 7C, Qurum Heights, Muscat'],
    imeis: ['358234091234999'],
    streams: ['hotel', 'mobile', 'employment', 'education', 'ecommerce'],
    riskScore: 55,
    riskLevel: 'medium',
    mergedCount: 4,
    lastSeen: '2025-04-06 11:02',
    aliases: ['Ravi Kumar Jayasinghe'],
  },
  {
    id: 'PRS-006',
    canonicalId: 'CAN-2025-00006',
    initials: 'HZ',
    nameEn: 'Hassan Al-Zadjali',
    nameAr: 'حسن الزدجالي',
    nationality: 'OM',
    nationalityFlag: '🇴🇲',
    dob: '1975-06-14',
    gender: 'M',
    documents: [
      { type: 'Passport', number: 'OM-2234567', issueCountry: 'Oman', expiry: '2028-06-13' },
      { type: 'National ID', number: 'OM-NID-55123', issueCountry: 'Oman', expiry: '2026-12-31' },
    ],
    phones: ['+968 9778 9900'],
    emails: ['hassan.zadjali@police.gov'],
    addresses: ['Plot 234, Barka Industrial, Al Batinah'],
    imeis: ['867686021642099'],
    streams: ['financial', 'utility', 'transport', 'marine', 'postal'],
    riskScore: 88,
    riskLevel: 'critical',
    mergedCount: 7,
    lastSeen: '2025-04-06 08:30',
    aliases: ['Hassan Zadjali', 'H. Al-Zadjali'],
  },
];

export const mergeCandidates: MergeCandidate[] = [
  {
    id: 'MC-001',
    personA: personRecords[0],
    personB: {
      ...personRecords[0],
      id: 'PRS-001B',
      nameEn: 'Ahmad Al-Rashidy',
      nameAr: 'أحمد الراشدي',
      documents: [{ type: 'Resident Card', number: 'RC-88234', issueCountry: 'Oman', expiry: '2026-12-31' }],
      streams: ['car-rental', 'tourism'],
      mergedCount: 0,
    },
    confidence: 85,
    matchingRule: 'Fuzzy Name Match',
    matchingRuleAr: 'تطابق اسم تقريبي',
    matchingFields: ['Name (Levenshtein=1)', 'Nationality: OM', 'DOB: 1985-03-12'],
    sourceStreams: ['hotel', 'car-rental'],
    status: 'pending',
    createdAt: '2025-04-06 08:14',
  },
  {
    id: 'MC-002',
    personA: personRecords[2],
    personB: {
      ...personRecords[2],
      id: 'PRS-003B',
      nameEn: 'Mohammad Al-Kindi',
      nameAr: 'محمد الكندي',
      documents: [{ type: 'Resident Card', number: 'RC-33290', issueCountry: 'Oman', expiry: '2025-11-04' }],
      phones: ['+968 9445 6677'],
      streams: ['mobile', 'municipality'],
      mergedCount: 0,
    },
    confidence: 90,
    matchingRule: 'Phone Anchor',
    matchingRuleAr: 'ربط رقم الهاتف',
    matchingFields: ['Phone: +968 9445 6677', 'DOB: 1978-11-05', 'Nationality: OM'],
    sourceStreams: ['hotel', 'mobile', 'municipality'],
    status: 'pending',
    createdAt: '2025-04-06 07:45',
  },
  {
    id: 'MC-003',
    personA: personRecords[4],
    personB: {
      ...personRecords[4],
      id: 'PRS-005B',
      nameEn: 'Ravi Kumar Jayasinghe',
      nameAr: 'رافي كومار جاياسينغه',
      documents: [{ type: 'Passport', number: 'IN-Z4523891', issueCountry: 'India', expiry: '2026-09-29' }],
      streams: ['borders', 'employment'],
      mergedCount: 0,
    },
    confidence: 100,
    matchingRule: 'Exact Document Match',
    matchingRuleAr: 'تطابق وثيقة دقيق',
    matchingFields: ['Passport: IN-Z4523891', 'Nationality: IN', 'DOB: 1988-09-30'],
    sourceStreams: ['hotel', 'borders', 'employment'],
    status: 'pending',
    createdAt: '2025-04-06 09:02',
  },
  {
    id: 'MC-004',
    personA: personRecords[5],
    personB: {
      ...personRecords[5],
      id: 'PRS-006B',
      nameEn: 'Hassan Zadjali',
      nameAr: 'حسن الزدجالي',
      documents: [{ type: 'Passport', number: 'OM-2234567', issueCountry: 'Oman', expiry: '2028-06-13' }],
      imeis: ['867686021642099'],
      streams: ['marine', 'postal'],
      mergedCount: 0,
    },
    confidence: 80,
    matchingRule: 'IMEI Bridge',
    matchingRuleAr: 'جسر IMEI',
    matchingFields: ['IMEI: 867686021642099', 'Nationality: OM'],
    sourceStreams: ['financial', 'marine', 'postal'],
    status: 'pending',
    createdAt: '2025-04-06 06:30',
  },
  {
    id: 'MC-005',
    personA: personRecords[1],
    personB: {
      ...personRecords[1],
      id: 'PRS-002B',
      nameEn: 'Fatimah Al-Balushi',
      nameAr: 'فاطمة البلوشي',
      documents: [{ type: 'Passport', number: 'OM-7823401', issueCountry: 'Oman', expiry: '2028-07-23' }],
      streams: ['tourism', 'postal'],
      mergedCount: 0,
    },
    confidence: 95,
    matchingRule: 'Biometric Match',
    matchingRuleAr: 'تطابق بيومتري',
    matchingFields: ['Biometric: Border photo ↔ Hotel scanner', 'Passport: OM-7823401'],
    sourceStreams: ['hotel', 'borders', 'tourism'],
    status: 'merged',
    createdAt: '2025-04-05 14:10',
    reviewedBy: 'Auto-Merge Engine',
  },
  {
    id: 'MC-006',
    personA: personRecords[3],
    personB: {
      ...personRecords[3],
      id: 'PRS-004B',
      nameEn: 'Saleem Al-Khatri',
      nameAr: 'سليم الخطري',
      documents: [{ type: 'Work Permit', number: 'WP-88234', issueCountry: 'Oman', expiry: '2026-06-30' }],
      streams: ['employment', 'healthcare'],
      mergedCount: 0,
    },
    confidence: 75,
    matchingRule: 'Cross-Document Match',
    matchingRuleAr: 'تطابق وثائق متقاطعة',
    matchingFields: ['Work Permit: WP-88234', 'DOB: 1990-02-18', 'Nationality: OM'],
    sourceStreams: ['employment', 'healthcare', 'mobile'],
    status: 'rejected',
    createdAt: '2025-04-05 11:20',
    reviewedBy: 'Analyst Khalid',
  },
];

export const aliasLinks: AliasLink[] = [
  {
    id: 'AL-001',
    primaryId: 'PRS-001',
    aliasId: 'PRS-001-A1',
    primaryName: 'Ahmed Al-Rashidi',
    aliasName: 'Ahmad Al-Rashidy',
    linkType: 'known_alias',
    confidence: 85,
    createdAt: '2025-04-05 10:30',
    notes: 'Name spelling variation across hotel and car rental records',
  },
  {
    id: 'AL-002',
    primaryId: 'PRS-003',
    aliasId: 'PRS-003-A1',
    primaryName: 'Mohammed Al-Kindi',
    aliasName: 'M. Kindi',
    linkType: 'known_alias',
    confidence: 72,
    createdAt: '2025-04-04 16:45',
    notes: 'Abbreviated name used in financial transactions',
  },
  {
    id: 'AL-003',
    primaryId: 'PRS-006',
    aliasId: 'PRS-006-A1',
    primaryName: 'Hassan Al-Zadjali',
    aliasName: 'Hassan Zadjali',
    linkType: 'known_alias',
    confidence: 91,
    createdAt: '2025-04-03 09:15',
    notes: 'Dropped tribal prefix in marine registration',
  },
  {
    id: 'AL-004',
    primaryId: 'PRS-001',
    aliasId: 'PRS-003',
    primaryName: 'Ahmed Al-Rashidi',
    aliasName: 'Mohammed Al-Kindi',
    linkType: 'associate',
    confidence: 60,
    createdAt: '2025-04-06 07:00',
    notes: 'Shared address in municipality records — possible family or business associate',
  },
  {
    id: 'AL-005',
    primaryId: 'PRS-005',
    aliasId: 'PRS-005-A1',
    primaryName: 'Ravi Jayasinghe',
    aliasName: 'Ravi Kumar Jayasinghe',
    linkType: 'known_alias',
    confidence: 100,
    createdAt: '2025-04-06 09:02',
    notes: 'Auto-merged: exact passport match across hotel and border streams',
  },
];

export const graphNodes: GraphNode[] = [
  { id: 'PRS-001', label: 'Ahmed Al-Rashidi', initials: 'AR', x: 320, y: 200, riskLevel: 'low', streams: ['hotel', 'mobile', 'financial'], mergedCount: 3 },
  { id: 'PRS-002', label: 'Fatima Al-Balushi', initials: 'FB', x: 520, y: 140, riskLevel: 'low', streams: ['hotel', 'healthcare', 'education'], mergedCount: 2 },
  { id: 'PRS-003', label: 'Mohammed Al-Kindi', initials: 'MK', x: 200, y: 340, riskLevel: 'high', streams: ['hotel', 'car-rental', 'financial'], mergedCount: 5 },
  { id: 'PRS-004', label: 'Salim Al-Khatri', initials: 'SK', x: 480, y: 320, riskLevel: 'low', streams: ['employment', 'mobile', 'utility'], mergedCount: 1 },
  { id: 'PRS-005', label: 'Ravi Jayasinghe', initials: 'RJ', x: 640, y: 240, riskLevel: 'medium', streams: ['hotel', 'mobile', 'employment'], mergedCount: 4 },
  { id: 'PRS-006', label: 'Hassan Al-Zadjali', initials: 'HZ', x: 360, y: 420, riskLevel: 'critical', streams: ['financial', 'marine', 'postal'], mergedCount: 7 },
  { id: 'PRS-007', label: 'Khalid Al-Amri', initials: 'KA', x: 160, y: 180, riskLevel: 'medium', streams: ['hotel', 'transport', 'municipality'], mergedCount: 2 },
  { id: 'PRS-008', label: 'Noor Al-Farsi', initials: 'NF', x: 580, y: 400, riskLevel: 'low', streams: ['municipality', 'utility', 'postal'], mergedCount: 1 },
];

export const graphEdges: GraphEdge[] = [
  { id: 'E-001', source: 'PRS-001', target: 'PRS-003', type: 'address', confidence: 60, label: 'Shared Address' },
  { id: 'E-002', source: 'PRS-001', target: 'PRS-007', type: 'phone', confidence: 75, label: 'Phone Link' },
  { id: 'E-003', source: 'PRS-003', target: 'PRS-006', type: 'employer', confidence: 68, label: 'Same Employer' },
  { id: 'E-004', source: 'PRS-005', target: 'PRS-002', type: 'address', confidence: 55, label: 'Shared Address' },
  { id: 'E-005', source: 'PRS-006', target: 'PRS-008', type: 'address', confidence: 72, label: 'Shared Address' },
  { id: 'E-006', source: 'PRS-004', target: 'PRS-005', type: 'employer', confidence: 80, label: 'Same Employer' },
  { id: 'E-007', source: 'PRS-001', target: 'PRS-002', type: 'document', confidence: 45, label: 'Cross-Doc' },
  { id: 'E-008', source: 'PRS-003', target: 'PRS-007', type: 'imei', confidence: 82, label: 'IMEI Bridge' },
  { id: 'E-009', source: 'PRS-006', target: 'PRS-003', type: 'phone', confidence: 90, label: 'Phone Anchor' },
  { id: 'E-010', source: 'PRS-002', target: 'PRS-004', type: 'email', confidence: 65, label: 'Email Link' },
];

export const matchingRules = [
  {
    id: 'R-001',
    name: 'Exact Document Match',
    nameAr: 'تطابق وثيقة دقيق',
    description: 'Same document number across any two streams',
    descriptionAr: 'نفس رقم الوثيقة عبر أي تيارين',
    confidence: 100,
    action: 'auto-merge',
    icon: 'ri-file-text-line',
    color: '#4ADE80',
    enabled: true,
    triggeredToday: 47,
    totalMerges: 1284,
  },
  {
    id: 'R-002',
    name: 'Fuzzy Name Match',
    nameAr: 'تطابق اسم تقريبي',
    description: 'Levenshtein distance &lt;2 + same nationality + DOB match',
    descriptionAr: 'مسافة ليفنشتاين &lt;2 + نفس الجنسية + تطابق تاريخ الميلاد',
    confidence: 85,
    action: 'candidate',
    icon: 'ri-user-search-line',
    color: '#D4A84B',
    enabled: true,
    triggeredToday: 23,
    totalMerges: 891,
  },
  {
    id: 'R-003',
    name: 'Cross-Document Match',
    nameAr: 'تطابق وثائق متقاطعة',
    description: 'Different doc types with overlapping bio data',
    descriptionAr: 'أنواع وثائق مختلفة مع بيانات حيوية متداخلة',
    confidence: 75,
    action: 'candidate',
    icon: 'ri-exchange-line',
    color: '#FACC15',
    enabled: true,
    triggeredToday: 18,
    totalMerges: 634,
  },
  {
    id: 'R-004',
    name: 'Phone / Email Anchor',
    nameAr: 'ربط الهاتف / البريد',
    description: 'Same phone or email across hotel, SIM, financial streams',
    descriptionAr: 'نفس الهاتف أو البريد عبر الفندق والشريحة والمالية',
    confidence: 90,
    action: 'candidate',
    icon: 'ri-phone-line',
    color: '#D4A84B',
    enabled: true,
    triggeredToday: 31,
    totalMerges: 1102,
  },
  {
    id: 'R-005',
    name: 'IMEI Bridge',
    nameAr: 'جسر IMEI',
    description: 'Same device IMEI with different SIMs → link SIM holders',
    descriptionAr: 'نفس IMEI الجهاز مع شرائح مختلفة → ربط أصحاب الشرائح',
    confidence: 80,
    action: 'candidate',
    icon: 'ri-smartphone-line',
    color: '#FB923C',
    enabled: true,
    triggeredToday: 9,
    totalMerges: 312,
  },
  {
    id: 'R-006',
    name: 'Biometric Match',
    nameAr: 'تطابق بيومتري',
    description: 'Border photo matches hotel scanner photo',
    descriptionAr: 'صورة الحدود تطابق صورة ماسح الفندق',
    confidence: 95,
    action: 'auto-merge',
    icon: 'ri-scan-line',
    color: '#4ADE80',
    enabled: true,
    triggeredToday: 14,
    totalMerges: 567,
  },
  {
    id: 'R-007',
    name: 'Address Clustering',
    nameAr: 'تجميع العناوين',
    description: 'Same physical address across utility, municipality, postal',
    descriptionAr: 'نفس العنوان الفعلي عبر المرافق والبلدية والبريد',
    confidence: 65,
    action: 'household',
    icon: 'ri-map-pin-line',
    color: '#A78BFA',
    enabled: true,
    triggeredToday: 42,
    totalMerges: 2341,
  },
];

export const streamResolutionStats = [
  { stream: 'Hotel', streamAr: 'الفنادق', code: 'AMN-HTL', resolved: 4891, duplicates: 234, rate: 94.8 },
  { stream: 'Car Rental', streamAr: 'تأجير السيارات', code: 'AMN-CAR', resolved: 3412, duplicates: 89, rate: 97.4 },
  { stream: 'Mobile', streamAr: 'الاتصالات', code: 'AMN-MOB', resolved: 8234, duplicates: 312, rate: 96.3 },
  { stream: 'Municipality', streamAr: 'البلديات', code: 'AMN-MUN', resolved: 2891, duplicates: 67, rate: 97.7 },
  { stream: 'Financial', streamAr: 'المالية', code: 'AMN-FIN', resolved: 5678, duplicates: 445, rate: 92.7 },
  { stream: 'Borders', streamAr: 'الحدود', code: 'AMN-BRD', resolved: 12341, duplicates: 891, rate: 93.3 },
  { stream: 'Healthcare', streamAr: 'الرعاية الصحية', code: 'AMN-HLT', resolved: 3201, duplicates: 123, rate: 96.3 },
  { stream: 'Employment', streamAr: 'التوظيف', code: 'AMN-EMP', resolved: 6789, duplicates: 234, rate: 96.6 },
];

export const duplicateDetectionHistory = [
  { date: 'Mar 31', detected: 89, resolved: 76, autoMerged: 45 },
  { date: 'Apr 01', detected: 112, resolved: 98, autoMerged: 67 },
  { date: 'Apr 02', detected: 94, resolved: 88, autoMerged: 52 },
  { date: 'Apr 03', detected: 134, resolved: 119, autoMerged: 78 },
  { date: 'Apr 04', detected: 108, resolved: 95, autoMerged: 61 },
  { date: 'Apr 05', detected: 156, resolved: 141, autoMerged: 89 },
  { date: 'Apr 06', detected: 143, resolved: 127, autoMerged: 84 },
];
