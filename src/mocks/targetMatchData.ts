export type HitStatus = 'PENDING' | 'CONFIRMED' | 'FALSE_POSITIVE' | 'ESCALATED' | 'DEFERRED';
export type RiskLevel  = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
type FilterTab  = 'ALL' | HitStatus;

interface MatchFactor {
  label:  string;
  score:  number;   // 0–100
}

export interface TravelHit {
  id:           string;
  status:       HitStatus;
  confidence:   number;   // 0–1
  riskLevel:    RiskLevel;
  matchedMinsAgo: number;
  flight:       string;
  fromCode:     string;
  toCode:       string;
  eta:          string;
  seat:         string;

  // Target (watchlist record)
  targetId:     string;
  targetName:   string;
  watchlistSrc: string;
  targetNat:    string;
  targetDOB:    string;
  targetDoc:    string;
  targetRisk:   string;

  // Incoming traveler
  travelerName: string;
  travelerNat:  string;
  travelerDOB:  string;
  travelerDoc:  string;

  factors:      MatchFactor[];
}

// ── Mock data ─────────────────────────────────────────────────────────────────

export const HITS: TravelHit[] = [
  {
    id: 'TH-001', status: 'PENDING', confidence: 0.91, riskLevel: 'CRITICAL',
    matchedMinsAgo: 8, flight: 'WY456', fromCode: 'AMM', toCode: 'MCT',
    eta: '14:35', seat: '22A',
    targetId:    'WL-8841',
    targetName:  'Ahmad Khalil',
    watchlistSrc: 'INTERPOL Red',
    targetNat:   'JOR', targetDOB: '1981-03-15', targetDoc: 'JO4492011',
    targetRisk:  'Terrorism financing, cross-border funds movement',
    travelerName: 'Ahmed Khaleel',
    travelerNat:  'SYR', travelerDOB: '1981-03-15', travelerDoc: 'SY7721039',
    factors: [
      { label: 'Name Similarity',       score: 94 },
      { label: 'Date of Birth',          score: 100 },
      { label: 'Nationality Proximity',  score: 72 },
      { label: 'Document Pattern',       score: 58 },
    ],
  },
  {
    id: 'TH-002', status: 'PENDING', confidence: 0.78, riskLevel: 'HIGH',
    matchedMinsAgo: 23, flight: 'WY102', fromCode: 'CAI', toCode: 'MCT',
    eta: '16:50', seat: '14C',
    targetId:    'WL-3312',
    targetName:  'Fatima Al-Rashidi',
    watchlistSrc: 'UN Consolidated',
    targetNat:   'EGY', targetDOB: '1975-11-02', targetDoc: 'EG8812445',
    targetRisk:  'Sanctions evasion, smuggling network',
    travelerName: 'Fatimah Rashidy',
    travelerNat:  'TUN', travelerDOB: '1975-11-07', travelerDoc: 'TU5591223',
    factors: [
      { label: 'Name Similarity',       score: 82 },
      { label: 'Date of Birth',          score: 75 },
      { label: 'Nationality Proximity',  score: 55 },
      { label: 'Document Pattern',       score: 40 },
    ],
  },
  {
    id: 'TH-003', status: 'CONFIRMED', confidence: 0.95, riskLevel: 'CRITICAL',
    matchedMinsAgo: 91, flight: 'EK208', fromCode: 'DXB', toCode: 'MCT',
    eta: '11:20', seat: '5F',
    targetId:    'WL-0019',
    targetName:  'Hassan Al-Mukhtar',
    watchlistSrc: 'MOI Priority',
    targetNat:   'IRQ', targetDOB: '1969-07-30', targetDoc: 'IQ1100329',
    targetRisk:  'Arms trafficking, threat to national security',
    travelerName: 'Hassan Al Mukhtar',
    travelerNat:  'IRQ', travelerDOB: '1969-07-30', travelerDoc: 'IQ1100329',
    factors: [
      { label: 'Name Similarity',       score: 97 },
      { label: 'Date of Birth',          score: 100 },
      { label: 'Nationality Proximity',  score: 100 },
      { label: 'Document Pattern',       score: 100 },
    ],
  },
  {
    id: 'TH-004', status: 'PENDING', confidence: 0.65, riskLevel: 'MEDIUM',
    matchedMinsAgo: 4, flight: 'EK202', fromCode: 'DXB', toCode: 'MCT',
    eta: '15:10', seat: '31B',
    targetId:    'WL-5572',
    targetName:  'Mohammed Salim',
    watchlistSrc: 'GCC Watch',
    targetNat:   'BGD', targetDOB: '1988-04-20', targetDoc: 'BD3310822',
    targetRisk:  'Human trafficking intelligence',
    travelerName: 'Mohamed Salem',
    travelerNat:  'PAK', travelerDOB: '1987-09-11', travelerDoc: 'PK9934001',
    factors: [
      { label: 'Name Similarity',       score: 71 },
      { label: 'Date of Birth',          score: 42 },
      { label: 'Nationality Proximity',  score: 48 },
      { label: 'Document Pattern',       score: 30 },
    ],
  },
  {
    id: 'TH-005', status: 'ESCALATED', confidence: 0.82, riskLevel: 'HIGH',
    matchedMinsAgo: 55, flight: 'SV311', fromCode: 'RUH', toCode: 'MCT',
    eta: '13:45', seat: '8D',
    targetId:    'WL-6650',
    targetName:  'Yusuf Karimi',
    watchlistSrc: 'FATF Greylist',
    targetNat:   'IRN', targetDOB: '1984-02-28', targetDoc: 'IR5581204',
    targetRisk:  'Money laundering, illicit finance',
    travelerName: 'Yousef Karemy',
    travelerNat:  'AFG', travelerDOB: '1984-03-01', travelerDoc: 'AF7720193',
    factors: [
      { label: 'Name Similarity',       score: 88 },
      { label: 'Date of Birth',          score: 90 },
      { label: 'Nationality Proximity',  score: 60 },
      { label: 'Document Pattern',       score: 35 },
    ],
  },
];

