export interface PatternAlert {
  id: string;
  ruleId: string;
  ruleName: string;
  ruleCategory: string;
  personId: string;
  personName: string;
  personDoc: string;
  nationality: string;
  nationalityFlag: string;
  score: number;
  streamsInvolved: string[];
  triggeredAt: string;
  minutesAgo: number;
  status: 'open' | 'assigned' | 'confirmed' | 'dismissed' | 'escalated';
  assignedTo: string | null;
  tier: 1 | 2 | 3;
  priority: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  triggerDescription: string;
  suggestedAction: string;
  escalationLevel: 0 | 1 | 2 | 3;
  photoInitials: string;
  photoColor: string;
}

export interface TopRule {
  id: string;
  name: string;
  category: string;
  count7d: number;
  count30d: number;
  truePositiveRate: number;
  lastTriggered: string;
  status: 'active' | 'disabled';
  trend: 'up' | 'down' | 'stable';
  description: string;
  streamsInvolved: string[];
}

export interface TrendPoint {
  label: string;
  arrival: number;
  financial: number;
  identity: number;
  accommodation: number;
  employment: number;
  maritime: number;
  customs: number;
}

export const livePatternStats = {
  activeRules: 28,
  totalRules: 35,
  triggeredToday: 47,
  triggeredTrend: 'up' as const,
  triggeredTrendPct: 12,
  uniquePersonsFlagged: 23,
  avgTimeToAction: 18,
  falsePositiveRate: 14.2,
};

export const streamLabels = [
  { key: 'border',       label: 'Border',       short: 'BRD', color: '#60A5FA' },
  { key: 'hotel',        label: 'Hotel',        short: 'HTL', color: '#D6B47E' },
  { key: 'mobile',       label: 'Mobile',       short: 'MOB', color: '#A78BFA' },
  { key: 'car',          label: 'Car Rental',   short: 'CAR', color: '#34D399' },
  { key: 'financial',    label: 'Financial',    short: 'FIN', color: '#4ADE80' },
  { key: 'employment',   label: 'Employment',   short: 'EMP', color: '#F9A8D4' },
  { key: 'utility',      label: 'Utility',      short: 'UTL', color: '#FACC15' },
  { key: 'transport',    label: 'Transport',    short: 'TRN', color: '#C98A1B' },
  { key: 'ecommerce',    label: 'E-Commerce',   short: 'ECM', color: '#38BDF8' },
  { key: 'social',       label: 'Social/OSINT', short: 'SOC', color: '#C94A5E' },
  { key: 'municipality', label: 'Municipality', short: 'MUN', color: '#6EE7B7' },
  { key: 'education',    label: 'Education',    short: 'EDU', color: '#C4B5FD' },
  { key: 'health',       label: 'Health',       short: 'HLT', color: '#FCA5A5' },
  { key: 'customs',      label: 'Customs',      short: 'CST', color: '#FCD34D' },
];

export const heatmapData: Record<string, Record<string, number>> = {
  border:       { border:100, hotel:82, mobile:91, car:78, financial:65, employment:55, utility:42, transport:60, ecommerce:38, social:70, municipality:45, education:50, health:35, customs:72 },
  hotel:        { border:82, hotel:100, mobile:88, car:85, financial:60, employment:40, utility:55, transport:50, ecommerce:45, social:55, municipality:62, education:30, health:28, customs:40 },
  mobile:       { border:91, hotel:88, mobile:100, car:80, financial:72, employment:48, utility:38, transport:55, ecommerce:65, social:90, municipality:40, education:42, health:32, customs:35 },
  car:          { border:78, hotel:85, mobile:80, car:100, financial:58, employment:35, utility:30, transport:70, ecommerce:40, social:48, municipality:38, education:25, health:22, customs:30 },
  financial:    { border:65, hotel:60, mobile:72, car:58, financial:100, employment:75, utility:50, transport:42, ecommerce:80, social:68, municipality:55, education:45, health:40, customs:62 },
  employment:   { border:55, hotel:40, mobile:48, car:35, financial:75, employment:100, utility:65, transport:38, ecommerce:55, social:52, municipality:70, education:60, health:45, customs:28 },
  utility:      { border:42, hotel:55, mobile:38, car:30, financial:50, employment:65, utility:100, transport:35, ecommerce:42, social:40, municipality:88, education:35, health:30, customs:22 },
  transport:    { border:60, hotel:50, mobile:55, car:70, financial:42, employment:38, utility:35, transport:100, ecommerce:48, social:58, municipality:45, education:32, health:28, customs:45 },
  ecommerce:    { border:38, hotel:45, mobile:65, car:40, financial:80, employment:55, utility:42, transport:48, ecommerce:100, social:72, municipality:50, education:38, health:35, customs:68 },
  social:       { border:70, hotel:55, mobile:90, car:48, financial:68, employment:52, utility:40, transport:58, ecommerce:72, social:100, municipality:45, education:48, health:38, customs:42 },
  municipality: { border:45, hotel:62, mobile:40, car:38, financial:55, employment:70, utility:88, transport:45, ecommerce:50, social:45, municipality:100, education:42, health:35, customs:30 },
  education:    { border:50, hotel:30, mobile:42, car:25, financial:45, employment:60, utility:35, transport:32, ecommerce:38, social:48, municipality:42, education:100, health:55, customs:20 },
  health:       { border:35, hotel:28, mobile:32, car:22, financial:40, employment:45, utility:30, transport:28, ecommerce:35, social:38, municipality:35, education:55, health:100, customs:18 },
  customs:      { border:72, hotel:40, mobile:35, car:30, financial:62, employment:28, utility:22, transport:45, ecommerce:68, social:42, municipality:30, education:20, health:18, customs:100 },
};

export const cellRules: Record<string, string[]> = {
  'border-hotel':        ['Ghost Arrival', 'Rapid Setup', 'Hotel Hopping'],
  'border-mobile':       ['Rapid Setup', 'SIM Swapping', 'OSINT Alert'],
  'border-financial':    ['Arrival Cash', 'Suspicious Transfer', 'Exchange Pattern'],
  'border-customs':      ['Coordinated Logistics', 'Invoice Manipulation', 'Sensitive Cargo'],
  'hotel-mobile':        ['Rapid Setup', 'Hotel Hopping', 'Coordinated Entry'],
  'hotel-car':           ['Unregistered Stay', 'Rapid Setup', 'Maritime Risk'],
  'mobile-social':       ['OSINT Alert', 'Phone-Social Link', 'Social+Financial Link'],
  'mobile-financial':    ['SIM Swapping', 'Suspicious Transfer', 'Exchange Pattern'],
  'financial-ecommerce': ['Bulk Purchase+Arrival', 'Structuring Pattern', 'Exchange Pattern'],
  'financial-employment':['Overstay Worker', 'Visa Misuse', 'Employer Churn'],
  'financial-customs':   ['Invoice Manipulation', 'FTZ Anomaly', 'Structuring'],
  'utility-municipality':['Address Mismatch', 'Utility Ghost', 'Address Conflict'],
  'employment-municipality':['Overstay Worker', 'Permit+No Exit', 'Address Mismatch'],
  'ecommerce-customs':   ['Cargo Structuring', 'FTZ Anomaly', 'Invoice Manipulation'],
  'border-employment':   ['Overstay Worker', 'Visa Misuse', 'Permit+No Exit'],
  'social-ecommerce':    ['Bulk Purchase+Arrival', 'OSINT Alert', 'Social+Financial Link'],
};

export const topRules: TopRule[] = [
  {
    id: 'R001', name: 'Ghost Arrival', category: 'Arrival',
    count7d: 34, count30d: 142, truePositiveRate: 78,
    lastTriggered: '4 min ago', status: 'active', trend: 'up',
    description: 'Person arrives at border crossing but no hotel check-in detected within 24 hours.',
    streamsInvolved: ['border', 'hotel'],
  },
  {
    id: 'R002', name: 'SIM Swapping', category: 'Identity',
    count7d: 28, count30d: 98, truePositiveRate: 85,
    lastTriggered: '12 min ago', status: 'active', trend: 'up',
    description: 'Same IMEI device used with 3+ different SIM cards within 48 hours.',
    streamsInvolved: ['mobile'],
  },
  {
    id: 'R003', name: 'Arrival Cash', category: 'Financial',
    count7d: 22, count30d: 87, truePositiveRate: 72,
    lastTriggered: '28 min ago', status: 'active', trend: 'stable',
    description: 'Cash deposit exceeding 5,000 LCY within 48 hours of border arrival.',
    streamsInvolved: ['financial', 'border'],
  },
  {
    id: 'R004', name: 'Suspicious Transfer', category: 'Financial',
    count7d: 19, count30d: 76, truePositiveRate: 91,
    lastTriggered: '1 hr ago', status: 'active', trend: 'up',
    description: 'Wire transfer to high-risk country within 72 hours of arrival.',
    streamsInvolved: ['financial', 'border'],
  },
  {
    id: 'R005', name: 'Overstay Worker', category: 'Employment',
    count7d: 17, count30d: 65, truePositiveRate: 88,
    lastTriggered: '2 hr ago', status: 'active', trend: 'down',
    description: 'Work permit terminated with no exit recorded at any border crossing within 30 days.',
    streamsInvolved: ['employment', 'border'],
  },
  {
    id: 'R006', name: 'Identity Conflict', category: 'Identity',
    count7d: 15, count30d: 58, truePositiveRate: 94,
    lastTriggered: '3 hr ago', status: 'active', trend: 'stable',
    description: 'Document inconsistency detected across 3+ data streams (DOB, name variant, ID number).',
    streamsInvolved: ['border', 'employment', 'financial', 'mobile'],
  },
  {
    id: 'R007', name: 'Visa Misuse', category: 'Employment',
    count7d: 12, count30d: 51, truePositiveRate: 82,
    lastTriggered: '4 hr ago', status: 'active', trend: 'down',
    description: 'Student visa holder with no course attendance records but active employment activity.',
    streamsInvolved: ['education', 'employment', 'border'],
  },
  {
    id: 'R008', name: 'Rapid Setup', category: 'Arrival',
    count7d: 11, count30d: 44, truePositiveRate: 65,
    lastTriggered: '5 hr ago', status: 'active', trend: 'stable',
    description: 'Arrival + SIM purchase + car rental within 6 hours, no hotel registered.',
    streamsInvolved: ['border', 'mobile', 'car'],
  },
  {
    id: 'R009', name: 'OSINT Alert', category: 'Identity',
    count7d: 9, count30d: 38, truePositiveRate: 70,
    lastTriggered: '6 hr ago', status: 'active', trend: 'up',
    description: 'Phone number linked to flagged social media content or known extremist networks.',
    streamsInvolved: ['mobile', 'social'],
  },
  {
    id: 'R010', name: 'Maritime Risk', category: 'Maritime',
    count7d: 7, count30d: 29, truePositiveRate: 88,
    lastTriggered: '8 hr ago', status: 'active', trend: 'stable',
    description: 'Boat rental active with no hotel registration and recent border arrival.',
    streamsInvolved: ['border', 'hotel', 'car'],
  },
  {
    id: 'R011', name: 'Invoice Manipulation', category: 'Customs',
    count7d: 6, count30d: 24, truePositiveRate: 83,
    lastTriggered: '10 hr ago', status: 'active', trend: 'up',
    description: 'Declared cargo value vs market value variance exceeds 50%.',
    streamsInvolved: ['customs', 'financial'],
  },
  {
    id: 'R012', name: 'FTZ Anomaly', category: 'Customs',
    count7d: 5, count30d: 19, truePositiveRate: 76,
    lastTriggered: '14 hr ago', status: 'active', trend: 'stable',
    description: 'Cargo routed to Free Trade Zone with no commercial registration on file.',
    streamsInvolved: ['customs', 'ecommerce'],
  },
];

export const trendData: TrendPoint[] = [
  { label: 'Mon', arrival: 12, financial: 8,  identity: 6,  accommodation: 4,  employment: 5,  maritime: 2,  customs: 3 },
  { label: 'Tue', arrival: 15, financial: 11, identity: 8,  accommodation: 6,  employment: 7,  maritime: 3,  customs: 5 },
  { label: 'Wed', arrival: 10, financial: 9,  identity: 5,  accommodation: 5,  employment: 4,  maritime: 1,  customs: 4 },
  { label: 'Thu', arrival: 18, financial: 14, identity: 10, accommodation: 8,  employment: 9,  maritime: 4,  customs: 6 },
  { label: 'Fri', arrival: 22, financial: 17, identity: 13, accommodation: 10, employment: 11, maritime: 5,  customs: 8 },
  { label: 'Sat', arrival: 16, financial: 12, identity: 9,  accommodation: 7,  employment: 8,  maritime: 3,  customs: 5 },
  { label: 'Sun', arrival: 20, financial: 15, identity: 11, accommodation: 9,  employment: 10, maritime: 4,  customs: 7 },
];

export const lastWeekTrendData: TrendPoint[] = [
  { label: 'Mon', arrival: 10, financial: 7,  identity: 5,  accommodation: 3,  employment: 4,  maritime: 1,  customs: 2 },
  { label: 'Tue', arrival: 13, financial: 9,  identity: 6,  accommodation: 5,  employment: 6,  maritime: 2,  customs: 4 },
  { label: 'Wed', arrival: 8,  financial: 7,  identity: 4,  accommodation: 4,  employment: 3,  maritime: 1,  customs: 3 },
  { label: 'Thu', arrival: 15, financial: 11, identity: 8,  accommodation: 6,  employment: 7,  maritime: 3,  customs: 5 },
  { label: 'Fri', arrival: 19, financial: 14, identity: 10, accommodation: 8,  employment: 9,  maritime: 4,  customs: 6 },
  { label: 'Sat', arrival: 13, financial: 10, identity: 7,  accommodation: 5,  employment: 6,  maritime: 2,  customs: 4 },
  { label: 'Sun', arrival: 17, financial: 12, identity: 9,  accommodation: 7,  employment: 8,  maritime: 3,  customs: 5 },
];

export const alertQueue: PatternAlert[] = [
  {
    id: 'ALT-2026-001', ruleId: 'R001', ruleName: 'Ghost Arrival', ruleCategory: 'Arrival',
    personId: 'PRS-4821', personName: 'Tariq Al-Mansouri', personDoc: 'PK-8823401',
    nationality: 'Pakistan', nationalityFlag: '🇵🇰', score: 87,
    streamsInvolved: ['border', 'hotel', 'mobile'],
    triggeredAt: '14:32:11', minutesAgo: 4, status: 'open', assignedTo: null,
    tier: 1, priority: 'critical', location: 'Capital International Airport',
    triggerDescription: 'Arrived via Capital Airport 6h ago. No hotel check-in detected. SIM purchased 2h after arrival. Car rental booked under different name.',
    suggestedAction: 'Dispatch field team to last known location. Cross-check SIM IMEI with hotel registry.',
    escalationLevel: 0, photoInitials: 'TM', photoColor: '#D6B47E',
  },
  {
    id: 'ALT-2026-002', ruleId: 'R002', ruleName: 'SIM Swapping', ruleCategory: 'Identity',
    personId: 'PRS-3312', personName: 'Yusuf Al-Balushi', personDoc: 'NAT-4412891',
    nationality: 'National', nationalityFlag: '🇴🇲', score: 79,
    streamsInvolved: ['mobile', 'social', 'financial'],
    triggeredAt: '14:18:44', minutesAgo: 18, status: 'assigned', assignedTo: 'Cpl. Hassan',
    tier: 1, priority: 'high', location: 'City Center District',
    triggerDescription: 'Same IMEI used with 3 different SIM cards within 48h. Social media accounts linked to flagged keywords. Recent wire transfer to high-risk country.',
    suggestedAction: 'Verify identity at nearest police station. Request telecom records.',
    escalationLevel: 0, photoInitials: 'YB', photoColor: '#A78BFA',
  },
  {
    id: 'ALT-2026-003', ruleId: 'R004', ruleName: 'Suspicious Transfer', ruleCategory: 'Financial',
    personId: 'PRS-7734', personName: 'Ravi Krishnamurthy', personDoc: 'IN-7823401',
    nationality: 'India', nationalityFlag: '🇮🇳', score: 93,
    streamsInvolved: ['financial', 'border', 'employment'],
    triggeredAt: '13:55:22', minutesAgo: 41, status: 'escalated', assignedTo: 'Sgt. Al-Farsi',
    tier: 2, priority: 'critical', location: 'National Bank, CBD Branch',
    triggerDescription: 'Wire transfer 45,000 OMR to high-risk country within 72h of arrival. Work permit terminated 2 weeks ago. No exit recorded.',
    suggestedAction: 'Freeze transaction pending review. Issue travel ban. Escalate to financial crimes unit.',
    escalationLevel: 2, photoInitials: 'RK', photoColor: '#4ADE80',
  },
  {
    id: 'ALT-2026-004', ruleId: 'R005', ruleName: 'Overstay Worker', ruleCategory: 'Employment',
    personId: 'PRS-2291', personName: 'Mohammed Al-Zadjali', personDoc: 'NAT-2291884',
    nationality: 'National', nationalityFlag: '🇴🇲', score: 68,
    streamsInvolved: ['employment', 'border', 'utility'],
    triggeredAt: '13:42:08', minutesAgo: 54, status: 'open', assignedTo: null,
    tier: 1, priority: 'high', location: 'Northern Industrial Area',
    triggerDescription: 'Work permit terminated 35 days ago. No exit recorded at any border crossing. Utility account still active at registered address.',
    suggestedAction: 'Verify current employment status. Check address for active residency.',
    escalationLevel: 1, photoInitials: 'MZ', photoColor: '#F9A8D4',
  },
  {
    id: 'ALT-2026-005', ruleId: 'R003', ruleName: 'Arrival Cash', ruleCategory: 'Financial',
    personId: 'PRS-5567', personName: 'Chen Wei', personDoc: 'CN-3345891',
    nationality: 'China', nationalityFlag: '🇨🇳', score: 74,
    streamsInvolved: ['financial', 'border', 'hotel'],
    triggeredAt: '13:28:55', minutesAgo: 68, status: 'open', assignedTo: null,
    tier: 1, priority: 'high', location: 'Capital CBD',
    triggerDescription: 'Cash deposit 12,500 OMR within 48h of arrival. Multiple currency exchanges same week. Hotel check-in paid cash.',
    suggestedAction: 'Request source of funds documentation. Cross-check with customs declaration.',
    escalationLevel: 1, photoInitials: 'CW', photoColor: '#C98A1B',
  },
  {
    id: 'ALT-2026-006', ruleId: 'R008', ruleName: 'Rapid Setup', ruleCategory: 'Arrival',
    personId: 'PRS-8834', personName: 'Fatima Al-Rashidi', personDoc: 'NAT-8834221',
    nationality: 'National', nationalityFlag: '🇴🇲', score: 52,
    streamsInvolved: ['border', 'mobile', 'car'],
    triggeredAt: '12:55:30', minutesAgo: 101, status: 'confirmed', assignedTo: 'Cpl. Al-Amri',
    tier: 1, priority: 'medium', location: 'West District, Capital City',
    triggerDescription: 'Arrived from UAE. Within 6h: SIM purchased, car rented, no hotel registered. Pattern matches rapid setup profile.',
    suggestedAction: 'Monitor for 24h. Request voluntary interview.',
    escalationLevel: 0, photoInitials: 'FR', photoColor: '#FACC15',
  },
  {
    id: 'ALT-2026-007', ruleId: 'R006', ruleName: 'Identity Conflict', ruleCategory: 'Identity',
    personId: 'PRS-1123', personName: 'Ahmed Al-Harthi', personDoc: 'NAT-1123445',
    nationality: 'National', nationalityFlag: '🇴🇲', score: 96,
    streamsInvolved: ['border', 'employment', 'financial', 'mobile'],
    triggeredAt: '12:10:18', minutesAgo: 146, status: 'escalated', assignedTo: 'Lt. Al-Balushi',
    tier: 3, priority: 'critical', location: 'Old Town District, Capital City',
    triggerDescription: 'Document inconsistency across 4 streams. Different DOB in employment vs border records. Financial account under different name variant. OSINT match to flagged alias.',
    suggestedAction: 'Immediate detention for identity verification. Escalate to CID.',
    escalationLevel: 3, photoInitials: 'AH', photoColor: '#C94A5E',
  },
  {
    id: 'ALT-2026-008', ruleId: 'R009', ruleName: 'OSINT Alert', ruleCategory: 'Identity',
    personId: 'PRS-6612', personName: 'Khalid Al-Amri', personDoc: 'NAT-6612334',
    nationality: 'National', nationalityFlag: '🇴🇲', score: 61,
    streamsInvolved: ['social', 'mobile', 'border'],
    triggeredAt: '11:44:22', minutesAgo: 172, status: 'dismissed', assignedTo: 'Cpl. Hassan',
    tier: 1, priority: 'medium', location: 'Coastal District, Capital City',
    triggerDescription: 'Phone number linked to flagged social media content. Recent border crossing from high-risk country. Multiple SIM activations.',
    suggestedAction: 'Monitor social media activity. No immediate action required.',
    escalationLevel: 0, photoInitials: 'KA', photoColor: '#6EE7B7',
  },
  {
    id: 'ALT-2026-009', ruleId: 'R011', ruleName: 'Invoice Manipulation', ruleCategory: 'Customs',
    personId: 'PRS-9901', personName: 'Hamad Al-Siyabi', personDoc: 'NAT-9901223',
    nationality: 'National', nationalityFlag: '🇴🇲', score: 81,
    streamsInvolved: ['customs', 'financial', 'border'],
    triggeredAt: '11:20:05', minutesAgo: 196, status: 'open', assignedTo: null,
    tier: 2, priority: 'critical', location: 'Seeb Port, Customs Gate 3',
    triggerDescription: 'Declared cargo value 8,200 OMR vs estimated market value 22,500 OMR — 63% variance. Importer has 3 prior customs flags. Cargo origin: high-risk country.',
    suggestedAction: 'Hold cargo for physical inspection. Request independent valuation. Cross-check importer financial records.',
    escalationLevel: 2, photoInitials: 'HS', photoColor: '#FCD34D',
  },
  {
    id: 'ALT-2026-010', ruleId: 'R012', ruleName: 'FTZ Anomaly', ruleCategory: 'Customs',
    personId: 'PRS-3344', personName: 'Liu Jianming', personDoc: 'CN-5512890',
    nationality: 'China', nationalityFlag: '🇨🇳', score: 77,
    streamsInvolved: ['customs', 'ecommerce', 'financial'],
    triggeredAt: '10:55:40', minutesAgo: 221, status: 'assigned', assignedTo: 'Sgt. Al-Rawahi',
    tier: 2, priority: 'critical', location: 'Sohar Free Zone, Warehouse 14',
    triggerDescription: 'Cargo routed to Free Trade Zone. No commercial registration found. E-commerce platform shows 47 shipments same consignee in 30 days. Financial pattern matches structuring.',
    suggestedAction: 'Verify commercial registration. Inspect warehouse. Cross-check e-commerce account.',
    escalationLevel: 1, photoInitials: 'LJ', photoColor: '#38BDF8',
  },
];

export const feedbackStats = {
  totalDecisions: 1247,
  confirmed: 892,
  dismissed: 234,
  escalated: 121,
  confirmedPct: 71.5,
  dismissedPct: 18.8,
  escalatedPct: 9.7,
  topFalsePositiveRule: 'Rapid Setup',
  topTruePositiveRule: 'Identity Conflict',
  modelAccuracy: 85.8,
  weeklyDecisions: [42, 58, 51, 67, 73, 61, 69],
  weeklyLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};
