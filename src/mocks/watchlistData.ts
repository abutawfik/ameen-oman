export type WatchlistType = 'national_security' | 'overstay' | 'financial' | 'employment' | 'interpol' | 'custom';
export type AlertPriority = 'critical' | 'high' | 'medium';
export type TargetStatus = 'active' | 'suspended' | 'archived';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Watchlist {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  type: WatchlistType;
  classification: string;
  owner: string;
  priority: AlertPriority;
  autoExpireDays: number | null;
  alertRouting: string[];
  targetCount: number;
  hitsToday: number;
  hitsTotal: number;
  createdAt: string;
  lastHit: string;
  active: boolean;
}

export interface WatchlistTarget {
  id: string;
  watchlistIds: string[];
  name: string;
  nameAr: string;
  docNumber: string;
  docType: string;
  nationality: string;
  dob: string;
  photo: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: TargetStatus;
  addedBy: string;
  addedAt: string;
  reason: string;
  notes: string;
  lastKnownLocation: string;
  lastKnownLocationTime: string;
  lastEvent: string;
  lastEventStream: string;
  lastEventTime: string;
  phone: string;
  email: string;
  employer: string;
  alertCount: number;
}

export interface WatchlistAlert {
  id: string;
  targetId: string;
  targetName: string;
  watchlistId: string;
  watchlistName: string;
  watchlistType: WatchlistType;
  stream: string;
  streamIcon: string;
  eventType: string;
  location: string;
  timestamp: string;
  confidence: number;
  isNearMatch: boolean;
  status: 'new' | 'acknowledged' | 'escalated' | 'closed';
  priority: AlertPriority;
  details: string;
}

export const watchlists: Watchlist[] = [
  {
    id: 'wl-001',
    name: 'National Security Watchlist',
    nameAr: 'قائمة مراقبة الأمن الوطني',
    description: 'High-priority individuals posing national security threats. Immediate response required on any hit.',
    descriptionAr: 'أفراد ذوو أولوية عالية يشكلون تهديدات للأمن الوطني. استجابة فورية مطلوبة عند أي تطابق.',
    type: 'national_security',
    classification: 'TOP SECRET',
    owner: 'National Security Agency',
    priority: 'critical',
    autoExpireDays: null,
    alertRouting: ['Command Center', 'Field Officers', 'NSA Director'],
    targetCount: 47,
    hitsToday: 3,
    hitsTotal: 1284,
    createdAt: '2023-01-15',
    lastHit: '2025-04-06 09:14',
    active: true,
  },
  {
    id: 'wl-002',
    name: 'Overstay Monitoring',
    nameAr: 'مراقبة تجاوز الإقامة',
    description: 'Persons who have exceeded their authorized visa duration. Coordinated with immigration authorities.',
    descriptionAr: 'أشخاص تجاوزوا مدة إقامتهم المصرح بها. منسق مع سلطات الهجرة.',
    type: 'overstay',
    classification: 'CONFIDENTIAL',
    owner: 'Immigration Directorate',
    priority: 'high',
    autoExpireDays: 90,
    alertRouting: ['Immigration Team', 'Border Control'],
    targetCount: 312,
    hitsToday: 28,
    hitsTotal: 8934,
    createdAt: '2023-03-20',
    lastHit: '2025-04-06 10:02',
    active: true,
  },
  {
    id: 'wl-003',
    name: 'Financial Watchlist',
    nameAr: 'قائمة المراقبة المالية',
    description: 'Persons flagged for suspicious financial transactions, money laundering indicators, or sanctions.',
    descriptionAr: 'أشخاص مُبلَّغ عنهم بسبب معاملات مالية مشبوهة أو مؤشرات غسيل الأموال أو العقوبات.',
    type: 'financial',
    classification: 'SECRET',
    owner: 'Financial Intelligence Unit',
    priority: 'high',
    autoExpireDays: 180,
    alertRouting: ['FIU Team', 'Central Bank Liaison'],
    targetCount: 89,
    hitsToday: 7,
    hitsTotal: 2341,
    createdAt: '2023-06-10',
    lastHit: '2025-04-06 08:47',
    active: true,
  },
  {
    id: 'wl-004',
    name: 'Employment Violation Registry',
    nameAr: 'سجل مخالفات التوظيف',
    description: 'Absconding workers, ghost employees, and persons with illegal employment status.',
    descriptionAr: 'العمال الهاربون والموظفون الوهميون والأشخاص ذوو الوضع الوظيفي غير القانوني.',
    type: 'employment',
    classification: 'RESTRICTED',
    owner: 'Ministry of Labour',
    priority: 'medium',
    autoExpireDays: 365,
    alertRouting: ['Labour Inspection Team'],
    targetCount: 1203,
    hitsToday: 45,
    hitsTotal: 34891,
    createdAt: '2023-02-28',
    lastHit: '2025-04-06 10:31',
    active: true,
  },
  {
    id: 'wl-005',
    name: 'Interpol / International',
    nameAr: 'الإنتربول / الدولي',
    description: 'Imported from Interpol MIND database and bilateral intelligence sharing agreements.',
    descriptionAr: 'مستورد من قاعدة بيانات الإنتربول MIND واتفاقيات تبادل المعلومات الاستخباراتية الثنائية.',
    type: 'interpol',
    classification: 'TOP SECRET',
    owner: 'Interpol NCB',
    priority: 'critical',
    autoExpireDays: null,
    alertRouting: ['Interpol NCB', 'Command Center', 'NSA'],
    targetCount: 234,
    hitsToday: 1,
    hitsTotal: 567,
    createdAt: '2022-11-01',
    lastHit: '2025-04-05 22:18',
    active: true,
  },
  {
    id: 'wl-006',
    name: 'Operation Falcon — Custom',
    nameAr: 'عملية الصقر — مخصص',
    description: 'Analyst-created watchlist for Operation Falcon. Monitoring suspected smuggling network.',
    descriptionAr: 'قائمة مراقبة أنشأها المحلل لعملية الصقر. مراقبة شبكة تهريب مشتبه بها.',
    type: 'custom',
    classification: 'SECRET',
    owner: 'Analyst: K. Al-Balushi',
    priority: 'high',
    autoExpireDays: 60,
    alertRouting: ['Investigation Team Alpha'],
    targetCount: 18,
    hitsToday: 4,
    hitsTotal: 312,
    createdAt: '2025-02-14',
    lastHit: '2025-04-06 07:55',
    active: true,
  },
];

export const watchlistTargets: WatchlistTarget[] = [
  {
    id: 'tgt-001',
    watchlistIds: ['wl-001', 'wl-005'],
    name: 'Khalid Mohammed Al-Rashidi',
    nameAr: 'خالد محمد الراشدي',
    docNumber: 'OM-4523891',
    docType: 'Passport',
    nationality: 'Omani',
    dob: '1978-03-15',
    photo: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20middle%20eastern%20man%20in%20his%2040s%2C%20neutral%20expression%2C%20formal%20attire%2C%20clean%20white%20background%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=tgt001&orientation=squarish',
    riskScore: 94,
    riskLevel: 'critical',
    status: 'active',
    addedBy: 'Analyst: M. Al-Zadjali',
    addedAt: '2024-08-12',
    reason: 'Suspected involvement in organized crime network. Multiple cross-border movements flagged.',
    notes: 'Known to use aliases. Last seen in Muscat and Dubai.',
    lastKnownLocation: 'Muscat International Airport, Terminal 1',
    lastKnownLocationTime: '2025-04-06 09:14',
    lastEvent: 'Border Entry — Passport OM-4523891',
    lastEventStream: 'Border Intelligence',
    lastEventTime: '2025-04-06 09:14',
    phone: '+968 9234 5678',
    email: 'k.rashidi@protonmail.com',
    employer: 'Al-Rashidi Trading LLC',
    alertCount: 47,
  },
  {
    id: 'tgt-002',
    watchlistIds: ['wl-002'],
    name: 'Priya Suresh Nair',
    nameAr: 'بريا سوريش نير',
    docNumber: 'IN-7823401',
    docType: 'Passport',
    nationality: 'Indian',
    dob: '1990-07-22',
    photo: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20south%20asian%20woman%20in%20her%2030s%2C%20neutral%20expression%2C%20formal%20attire%2C%20clean%20white%20background%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=tgt002&orientation=squarish',
    riskScore: 62,
    riskLevel: 'medium',
    status: 'active',
    addedBy: 'System: Auto-Import',
    addedAt: '2025-01-08',
    reason: 'Visa expired 45 days ago. Employment visa not renewed. Still active in mobile and utility streams.',
    notes: 'Working at Al-Amri Restaurant, Ruwi. Employer notified.',
    lastKnownLocation: 'Ruwi, Muscat',
    lastKnownLocationTime: '2025-04-05 18:30',
    lastEvent: 'SIM Usage — +968 9876 5432',
    lastEventStream: 'Mobile Operators',
    lastEventTime: '2025-04-05 18:30',
    phone: '+968 9876 5432',
    email: 'priya.nair@gmail.com',
    employer: 'Al-Amri Restaurant',
    alertCount: 12,
  },
  {
    id: 'tgt-003',
    watchlistIds: ['wl-003', 'wl-006'],
    name: 'Hassan Ibrahim Al-Balushi',
    nameAr: 'حسن إبراهيم البلوشي',
    docNumber: 'OM-8823401',
    docType: 'National ID',
    nationality: 'Omani',
    dob: '1965-11-30',
    photo: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20middle%20eastern%20man%20in%20his%2060s%2C%20neutral%20expression%2C%20business%20suit%2C%20clean%20white%20background%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=tgt003&orientation=squarish',
    riskScore: 81,
    riskLevel: 'high',
    status: 'active',
    addedBy: 'Analyst: S. Al-Farsi',
    addedAt: '2024-11-20',
    reason: 'Multiple large cash transactions exceeding reporting thresholds. Suspected hawala network involvement.',
    notes: 'Owns 3 properties. Multiple bank accounts. Frequent travel to UAE and Pakistan.',
    lastKnownLocation: 'National Bank, CBD Branch, Muscat',
    lastKnownLocationTime: '2025-04-06 08:47',
    lastEvent: 'Cash Deposit — OMR 18,500',
    lastEventStream: 'Financial Services',
    lastEventTime: '2025-04-06 08:47',
    phone: '+968 9112 3344',
    email: 'h.balushi@outlook.com',
    employer: 'Al-Balushi Trading Group',
    alertCount: 89,
  },
  {
    id: 'tgt-004',
    watchlistIds: ['wl-004'],
    name: 'Rajesh Kumar Sharma',
    nameAr: 'راجيش كومار شارما',
    docNumber: 'IN-4412890',
    docType: 'Passport',
    nationality: 'Indian',
    dob: '1985-04-18',
    photo: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20south%20asian%20man%20in%20his%20late%2030s%2C%20neutral%20expression%2C%20casual%20attire%2C%20clean%20white%20background%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=tgt004&orientation=squarish',
    riskScore: 55,
    riskLevel: 'medium',
    status: 'active',
    addedBy: 'System: Labour Ministry Feed',
    addedAt: '2025-03-01',
    reason: 'Absconded from employer Al-Rashidi Construction. Work permit cancelled. Still in country.',
    notes: 'Last seen in Sohar. May have changed accommodation.',
    lastKnownLocation: 'Sohar Industrial Area',
    lastKnownLocationTime: '2025-04-04 14:20',
    lastEvent: 'Hotel Check-In — Sohar Beach Hotel',
    lastEventStream: 'Hotel Intelligence',
    lastEventTime: '2025-04-04 14:20',
    phone: '+968 9445 6677',
    email: '',
    employer: 'ABSCONDED — was Al-Rashidi Construction',
    alertCount: 8,
  },
  {
    id: 'tgt-005',
    watchlistIds: ['wl-001', 'wl-005', 'wl-006'],
    name: 'Omar Farouk Al-Zadjali',
    nameAr: 'عمر فاروق الزدجالي',
    docNumber: 'OM-3312445',
    docType: 'Passport',
    nationality: 'Omani',
    dob: '1982-09-05',
    photo: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20middle%20eastern%20man%20in%20his%20early%2040s%2C%20serious%20expression%2C%20dark%20suit%2C%20clean%20white%20background%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=tgt005&orientation=squarish',
    riskScore: 97,
    riskLevel: 'critical',
    status: 'active',
    addedBy: 'Director: NSA',
    addedAt: '2023-09-14',
    reason: 'Interpol Red Notice. Suspected terrorism financing. Multiple aliases confirmed.',
    notes: 'ARMED AND DANGEROUS. Do not approach without authorization. Contact Command Center immediately.',
    lastKnownLocation: 'Salalah, Dhofar Governorate',
    lastKnownLocationTime: '2025-04-03 21:45',
    lastEvent: 'Car Rental — Toyota Land Cruiser',
    lastEventStream: 'Car Rental',
    lastEventTime: '2025-04-03 21:45',
    phone: '+968 9001 2233',
    email: 'unknown',
    employer: 'Unknown',
    alertCount: 234,
  },
  {
    id: 'tgt-006',
    watchlistIds: ['wl-003'],
    name: 'Fatima Yusuf Al-Amri',
    nameAr: 'فاطمة يوسف العامري',
    docNumber: 'OM-7712334',
    docType: 'National ID',
    nationality: 'Omani',
    dob: '1975-12-08',
    photo: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20middle%20eastern%20woman%20in%20her%20late%2040s%2C%20neutral%20expression%2C%20hijab%2C%20clean%20white%20background%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=tgt006&orientation=squarish',
    riskScore: 73,
    riskLevel: 'high',
    status: 'active',
    addedBy: 'Analyst: K. Al-Balushi',
    addedAt: '2025-01-30',
    reason: 'Suspected front company for financial crimes. Multiple wire transfers to sanctioned entities.',
    notes: 'Director of 4 companies. Frequent travel to UAE.',
    lastKnownLocation: 'Al Khuwair, Muscat',
    lastKnownLocationTime: '2025-04-06 11:00',
    lastEvent: 'Wire Transfer — OMR 45,000 to UAE',
    lastEventStream: 'Financial Services',
    lastEventTime: '2025-04-06 11:00',
    phone: '+968 9334 5566',
    email: 'f.amri@alfargroup.com',
    employer: 'Al-Far Group LLC',
    alertCount: 31,
  },
];

export const watchlistAlerts: WatchlistAlert[] = [
  {
    id: 'alt-001',
    targetId: 'tgt-001',
    targetName: 'Khalid Mohammed Al-Rashidi',
    watchlistId: 'wl-001',
    watchlistName: 'National Security Watchlist',
    watchlistType: 'national_security',
    stream: 'Border Intelligence',
    streamIcon: 'ri-passport-line',
    eventType: 'Border Entry',
    location: 'Muscat International Airport, T1',
    timestamp: '2025-04-06 09:14',
    confidence: 100,
    isNearMatch: false,
    status: 'new',
    priority: 'critical',
    details: 'Exact document match. Passport OM-4523891 scanned at border control. Subject entered from Dubai.',
  },
  {
    id: 'alt-002',
    targetId: 'tgt-005',
    targetName: 'Omar Farouk Al-Zadjali',
    watchlistId: 'wl-001',
    watchlistName: 'National Security Watchlist',
    watchlistType: 'national_security',
    stream: 'Car Rental',
    streamIcon: 'ri-car-line',
    eventType: 'Vehicle Rental',
    location: 'Salalah Airport Car Rental',
    timestamp: '2025-04-03 21:45',
    confidence: 100,
    isNearMatch: false,
    status: 'escalated',
    priority: 'critical',
    details: 'Exact document match. Rented Toyota Land Cruiser for 7 days. Paid cash. No return address provided.',
  },
  {
    id: 'alt-003',
    targetId: 'tgt-003',
    targetName: 'Hassan Ibrahim Al-Balushi',
    watchlistId: 'wl-003',
    watchlistName: 'Financial Watchlist',
    watchlistType: 'financial',
    stream: 'Financial Services',
    streamIcon: 'ri-bank-card-line',
    eventType: 'Large Cash Deposit',
    location: 'National Bank, CBD Branch',
    timestamp: '2025-04-06 08:47',
    confidence: 100,
    isNearMatch: false,
    status: 'acknowledged',
    priority: 'high',
    details: 'Cash deposit of OMR 18,500. Third large cash transaction this week. Total: OMR 52,000.',
  },
  {
    id: 'alt-004',
    targetId: 'tgt-002',
    targetName: 'Priya Suresh Nair',
    watchlistId: 'wl-002',
    watchlistName: 'Overstay Monitoring',
    watchlistType: 'overstay',
    stream: 'Mobile Operators',
    streamIcon: 'ri-sim-card-line',
    eventType: 'SIM Usage',
    location: 'Ruwi, Muscat',
    timestamp: '2025-04-05 18:30',
    confidence: 100,
    isNearMatch: false,
    status: 'acknowledged',
    priority: 'high',
    details: 'Active SIM usage detected. Subject still in country 45 days after visa expiry.',
  },
  {
    id: 'alt-005',
    targetId: 'tgt-004',
    targetName: 'Rajesh Kumar Sharma',
    watchlistId: 'wl-004',
    watchlistName: 'Employment Violation Registry',
    watchlistType: 'employment',
    stream: 'Hotel Intelligence',
    streamIcon: 'ri-hotel-line',
    eventType: 'Hotel Check-In',
    location: 'Sohar Beach Hotel',
    timestamp: '2025-04-04 14:20',
    confidence: 100,
    isNearMatch: false,
    status: 'new',
    priority: 'medium',
    details: 'Checked in using passport IN-4412890. Paid cash. Single room, 3 nights.',
  },
  {
    id: 'alt-006',
    targetId: 'tgt-006',
    targetName: 'Fatima Yusuf Al-Amri',
    watchlistId: 'wl-003',
    watchlistName: 'Financial Watchlist',
    watchlistType: 'financial',
    stream: 'Financial Services',
    streamIcon: 'ri-bank-card-line',
    eventType: 'Wire Transfer',
    location: 'Al Khuwair Branch',
    timestamp: '2025-04-06 11:00',
    confidence: 100,
    isNearMatch: false,
    status: 'new',
    priority: 'high',
    details: 'Wire transfer of OMR 45,000 to UAE account. Recipient flagged in sanctions database.',
  },
  {
    id: 'alt-007',
    targetId: 'tgt-001',
    targetName: 'Khalid Mohammed Al-Rashidi',
    watchlistId: 'wl-001',
    watchlistName: 'National Security Watchlist',
    watchlistType: 'national_security',
    stream: 'Hotel Intelligence',
    streamIcon: 'ri-hotel-line',
    eventType: 'Possible Match — Hotel Check-In',
    location: 'Grand Hyatt Muscat',
    timestamp: '2025-04-06 07:30',
    confidence: 87,
    isNearMatch: true,
    status: 'new',
    priority: 'high',
    details: 'Near-match: Name "Khalid M. Al-Rashdi" (spelling variant). Same nationality, similar DOB. Document not scanned.',
  },
  {
    id: 'alt-008',
    targetId: 'tgt-003',
    targetName: 'Hassan Ibrahim Al-Balushi',
    watchlistId: 'wl-006',
    watchlistName: 'Operation Falcon — Custom',
    watchlistType: 'custom',
    stream: 'Transport Intelligence',
    streamIcon: 'ri-bus-line',
    eventType: 'Taxi Booking',
    location: 'Muscat → Sohar',
    timestamp: '2025-04-05 16:22',
    confidence: 100,
    isNearMatch: false,
    status: 'closed',
    priority: 'high',
    details: 'Taxi booked using registered phone number. Route: Muscat CBD to Sohar Industrial Area.',
  },
];

export const watchlistStats = {
  totalWatchlists: 6,
  activeTargets: 1903,
  alertsToday: 88,
  hitRate: 34.2,
  avgResponseTime: '4.7 min',
  autoAlertsToday: 71,
  manualReviewToday: 17,
  nearMatchesToday: 12,
};

export const hitFrequencyData = [
  { list: 'National Security', hits: [3, 5, 2, 7, 4, 3, 3] },
  { list: 'Overstay', hits: [22, 31, 18, 28, 25, 30, 28] },
  { list: 'Financial', hits: [5, 8, 6, 9, 7, 6, 7] },
  { list: 'Employment', hits: [38, 42, 35, 48, 41, 44, 45] },
  { list: 'Interpol', hits: [1, 0, 2, 1, 0, 1, 1] },
  { list: 'Custom', hits: [2, 4, 3, 5, 3, 4, 4] },
];

export const geoHitsData = [
  { region: 'Muscat', hits: 312, pct: 48 },
  { region: 'Dhofar', hits: 89, pct: 14 },
  { region: 'North Batinah', hits: 78, pct: 12 },
  { region: 'South Batinah', hits: 56, pct: 9 },
  { region: 'Al Dakhiliyah', hits: 45, pct: 7 },
  { region: 'Musandam', hits: 34, pct: 5 },
  { region: 'Other', hits: 32, pct: 5 },
];

export const streamHitsData = [
  { stream: 'Border Intelligence', icon: 'ri-passport-line', hits: 234, color: '#60A5FA' },
  { stream: 'Hotel Intelligence', icon: 'ri-hotel-line', hits: 189, color: '#D6B47E' },
  { stream: 'Mobile Operators', icon: 'ri-sim-card-line', hits: 156, color: '#A78BFA' },
  { stream: 'Financial Services', icon: 'ri-bank-card-line', hits: 134, color: '#4ADE80' },
  { stream: 'Employment Registry', icon: 'ri-briefcase-line', hits: 112, color: '#F9A8D4' },
  { stream: 'Car Rental', icon: 'ri-car-line', hits: 89, color: '#FACC15' },
  { stream: 'Transport Intel', icon: 'ri-bus-line', hits: 67, color: '#C98A1B' },
  { stream: 'Municipality', icon: 'ri-government-line', hits: 45, color: '#34D399' },
];

export const responseTimeData = [
  { day: 'Mon', time: 5.2 },
  { day: 'Tue', time: 4.8 },
  { day: 'Wed', time: 6.1 },
  { day: 'Thu', time: 3.9 },
  { day: 'Fri', time: 4.2 },
  { day: 'Sat', time: 5.7 },
  { day: 'Sun', time: 4.7 },
];
