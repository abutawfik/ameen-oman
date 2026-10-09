// Travel Pattern Intelligence — mock data
// Detection categories grounded in INTERPOL, UNODC, IATA, ICAO iAPI research
// Threat scenarios: co-traveler networks, route signatures, transit overlap,
// human trafficking indicators (UNODC 2025 key indicators), document anomaly detection

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type CaseStatus = 'open' | 'investigating' | 'escalated' | 'confirmed' | 'cleared';

// ─── Co-Traveler Network ──────────────────────────────────────────────────────
export interface CoTravelerOccurrence {
  date: string;
  flightIn: string;
  flightOut: string;
  transitZone: string;
  overlapHours: number;
}

export interface CoTravelerPair {
  id: string;
  person1: { id: string; name: string; nationality: string; passportNo: string; origin: string; }
  person2: { id: string; name: string; nationality: string; passportNo: string; origin: string; }
  coOccurrences: number;
  firstSeen: string;
  lastSeen: string;
  intervalWeeks: number;
  sharedRoute: string;
  carrierCode: string;
  riskScore: number;
  riskLevel: RiskLevel;
  threatType: 'coordinated_courier' | 'trafficking_network' | 'document_swap_ring' | 'hawala_network';
  threatLabel: string;
  pnrContactMatch: boolean;
  status: CaseStatus;
  analystNote: string;
  occurrences: CoTravelerOccurrence[];
}

export const coTravelerPairs: CoTravelerPair[] = [
  {
    id: 'ct-001',
    person1: { id: 'p-alaa', name: 'Alaa Hassan Mahdi',  nationality: 'BGD', passportNo: 'BD-12345678', origin: 'DAC' },
    person2: { id: 'p-ahmad', name: 'Ahmad Khalil Nasser', nationality: 'BGD', passportNo: 'BD-98765432', origin: 'DAC' },
    coOccurrences: 27,
    firstSeen: '2021-03-14',
    lastSeen: '2026-09-21',
    intervalWeeks: 10,
    sharedRoute: 'DAC → MCT (transit) → DXB',
    carrierCode: 'EK',
    riskScore: 96,
    riskLevel: 'critical',
    threatType: 'coordinated_courier',
    threatLabel: 'Coordinated Courier — Hawala / Cash Transit',
    pnrContactMatch: false,
    status: 'escalated',
    analystNote: 'Separate PNR bookings, no shared contact fields. Both transit MCT every ~10 weeks on EK-549 inbound. 3–5h dwell overlap each instance. 27 co-occurrences over 5 years. Same transit zone T1 every time. High suspicion of coordinated physical handoff in transit airside.',
    occurrences: [
      { date: '2026-09-21', flightIn: 'EK-549', flightOut: 'EK-101', transitZone: 'MCT T1-G', overlapHours: 4.2 },
      { date: '2026-07-06', flightIn: 'EK-549', flightOut: 'EK-101', transitZone: 'MCT T1-G', overlapHours: 3.8 },
      { date: '2026-04-21', flightIn: 'EK-549', flightOut: 'EK-101', transitZone: 'MCT T1-G', overlapHours: 4.5 },
      { date: '2026-02-08', flightIn: 'EK-549', flightOut: 'EK-101', transitZone: 'MCT T1-G', overlapHours: 3.9 },
      { date: '2025-11-23', flightIn: 'EK-549', flightOut: 'EK-101', transitZone: 'MCT T1-G', overlapHours: 4.1 },
      { date: '2025-09-14', flightIn: 'EK-549', flightOut: 'EK-101', transitZone: 'MCT T1-G', overlapHours: 4.7 },
      { date: '2025-07-06', flightIn: 'EK-549', flightOut: 'EK-101', transitZone: 'MCT T1-G', overlapHours: 3.6 },
    ],
  },
  {
    id: 'ct-002',
    person1: { id: 'p-yusuf', name: 'Yusuf Bekele Tadesse', nationality: 'ETH', passportNo: 'ET-77312904', origin: 'ADD' },
    person2: { id: 'p-fatima', name: 'Fatima Muse Omar',     nationality: 'ETH', passportNo: 'ET-30019283', origin: 'ADD' },
    coOccurrences: 8,
    firstSeen: '2025-01-11',
    lastSeen: '2026-09-02',
    intervalWeeks: 7,
    sharedRoute: 'ADD → MCT (transit) → BKK',
    carrierCode: 'G9',
    riskScore: 91,
    riskLevel: 'critical',
    threatType: 'trafficking_network',
    threatLabel: 'Human Trafficking — Facilitator / Victim Pair',
    pnrContactMatch: true,
    status: 'escalated',
    analystNote: 'PNR contact phone number +251-910-xxxx appears in BOTH separate bookings — facilitator booking victim travel. Victim (Fatima, 22F) presents new passport (<3 months old) each instance. No prior travel history. Stated purpose varies: tourism, domestic work, visiting relatives. Facilitator (Yusuf, 45M) travels 12h ahead on same routing. UNODC ticket-in-stages pattern confirmed: onward BKK segment booked within 3h of MCT arrival.',
    occurrences: [
      { date: '2026-09-02', flightIn: 'G9-206', flightOut: 'G9-310', transitZone: 'MCT T2-B', overlapHours: 5.1 },
      { date: '2026-06-15', flightIn: 'G9-206', flightOut: 'G9-310', transitZone: 'MCT T2-B', overlapHours: 4.9 },
      { date: '2026-03-30', flightIn: 'G9-206', flightOut: 'G9-310', transitZone: 'MCT T2-B', overlapHours: 5.3 },
      { date: '2025-12-09', flightIn: 'G9-206', flightOut: 'G9-310', transitZone: 'MCT T2-B', overlapHours: 4.7 },
    ],
  },
  {
    id: 'ct-003',
    person1: { id: 'p-omar1', name: 'Reza Ahmadi Khorram',  nationality: 'IRN', passportNo: 'IR-44201837', origin: 'IKA' },
    person2: { id: 'p-omar2', name: 'Dariush Pourmohsen',   nationality: 'IRN', passportNo: 'IR-78923401', origin: 'IKA' },
    coOccurrences: 14,
    firstSeen: '2023-08-22',
    lastSeen: '2026-08-17',
    intervalWeeks: 8,
    sharedRoute: 'IKA → MCT (transit) → KHI',
    carrierCode: 'OA',
    riskScore: 84,
    riskLevel: 'high',
    threatType: 'hawala_network',
    threatLabel: 'Hawala / Value Transfer Network',
    pnrContactMatch: false,
    status: 'investigating',
    analystNote: 'Both carry large volumes of personal luggage (checked 2 bags each, max weight). Always transit MCT on same day, 2h apart. Booking lead time consistently < 36h — indicative of operational call-order pattern. No shared contact fields but route and timing match 14 of 14 instances.',
    occurrences: [
      { date: '2026-08-17', flightIn: 'OA-403', flightOut: 'OA-108', transitZone: 'MCT T1-E', overlapHours: 2.4 },
      { date: '2026-06-02', flightIn: 'OA-403', flightOut: 'OA-108', transitZone: 'MCT T1-E', overlapHours: 2.1 },
      { date: '2026-03-24', flightIn: 'OA-403', flightOut: 'OA-108', transitZone: 'MCT T1-E', overlapHours: 2.6 },
    ],
  },
  {
    id: 'ct-004',
    person1: { id: 'p-priya', name: 'Priya Shankar Devi',  nationality: 'IND', passportNo: 'IN-Z9812345', origin: 'MAA' },
    person2: { id: 'p-rajan', name: 'Rajan Murugesan',     nationality: 'IND', passportNo: 'IN-P4523817', origin: 'MAA' },
    coOccurrences: 5,
    firstSeen: '2025-10-03',
    lastSeen: '2026-09-18',
    intervalWeeks: 11,
    sharedRoute: 'MAA → MCT (transit) → CMB',
    carrierCode: 'WY',
    riskScore: 68,
    riskLevel: 'medium',
    threatType: 'trafficking_network',
    threatLabel: 'Possible Labor Trafficking — Escort Pattern',
    pnrContactMatch: true,
    status: 'open',
    analystNote: 'Subject Priya (female, 24) lists different employers on each trip — employer names not verifiable in Oman labor registry. Rajan books ahead; Priya books same day within 4h of departure. Under review for domestic worker trafficking indicators.',
    occurrences: [
      { date: '2026-09-18', flightIn: 'WY-203', flightOut: 'WY-116', transitZone: 'MCT T1-D', overlapHours: 3.2 },
      { date: '2026-06-22', flightIn: 'WY-203', flightOut: 'WY-116', transitZone: 'MCT T1-D', overlapHours: 3.4 },
    ],
  },
];

// ─── Route Signatures ─────────────────────────────────────────────────────────
export interface RouteSignatureTraveler {
  name: string; nationality: string; passportNo: string; travelDates: string[]; bookingAgency: string;
}

export interface RouteSignature {
  id: string;
  route: string;
  originCity: string;
  transitCity: string;
  destinationCity: string;
  carrier: string;
  flightNumbers: string[];
  rarityScore: number; // passengers per 6-month period (lower = rarer)
  unrelatedTravelers: number;
  travelers: RouteSignatureTraveler[];
  firstAlert: string;
  lastAlert: string;
  threatIndicator: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: CaseStatus;
}

export const routeSignatures: RouteSignature[] = [
  {
    id: 'rs-001',
    route: 'KRT → MCT → BKK',
    originCity: 'Khartoum',
    transitCity: 'Muscat',
    destinationCity: 'Bangkok',
    carrier: 'G9',
    flightNumbers: ['G9-408', 'G9-310'],
    rarityScore: 6,
    unrelatedTravelers: 6,
    travelers: [
      { name: 'Mariam Osman Khalid', nationality: 'SDN', passportNo: 'SD-20391847', travelDates: ['2026-09-01', '2026-06-12'], bookingAgency: 'Nile Travel KRT' },
      { name: 'Hana Ahmed Wael',     nationality: 'SDN', passportNo: 'SD-31748201', travelDates: ['2026-09-01'],               bookingAgency: 'Nile Travel KRT' },
      { name: 'Samira Yousif Nour',  nationality: 'SDN', passportNo: 'SD-44892013', travelDates: ['2026-07-08'],               bookingAgency: 'Nile Travel KRT' },
      { name: 'Leila Adam Musa',     nationality: 'SDN', passportNo: 'SD-52018374', travelDates: ['2026-05-19'],               bookingAgency: 'Nile Travel KRT' },
      { name: 'Nadia Ibrahim Salih', nationality: 'SDN', passportNo: 'SD-60238471', travelDates: ['2026-03-30'],               bookingAgency: 'Nile Travel KRT' },
      { name: 'Zara Mohd Osman',     nationality: 'SDN', passportNo: 'SD-71923048', travelDates: ['2026-02-14'],               bookingAgency: 'Nile Travel KRT' },
    ],
    firstAlert: '2026-02-14',
    lastAlert: '2026-09-01',
    threatIndicator: 'Same travel agency (Nile Travel KRT) books all 6 women. All new passports (<4 months old). All stated purpose "tourism Bangkok" but no hotel bookings. All 18–26F traveling alone.',
    riskScore: 97,
    riskLevel: 'critical',
    status: 'escalated',
  },
  {
    id: 'rs-002',
    route: 'LHE → MCT → NBO',
    originCity: 'Lahore',
    transitCity: 'Muscat',
    destinationCity: 'Nairobi',
    carrier: 'PK',
    flightNumbers: ['PK-208', 'PK-783'],
    rarityScore: 11,
    unrelatedTravelers: 4,
    travelers: [
      { name: 'Tariq Mehmood Butt',   nationality: 'PAK', passportNo: 'PK-AA1234567', travelDates: ['2026-08-21', '2026-05-17'], bookingAgency: 'Self-booked' },
      { name: 'Asim Javed Chaudhry',  nationality: 'PAK', passportNo: 'PK-AB9876543', travelDates: ['2026-08-21'],               bookingAgency: 'Self-booked' },
      { name: 'Nasir Iqbal Rasheed',  nationality: 'PAK', passportNo: 'PK-AC5432198', travelDates: ['2026-05-17'],               bookingAgency: 'Self-booked' },
      { name: 'Khalid Hassan Nawaz',  nationality: 'PAK', passportNo: 'PK-AD1122334', travelDates: ['2026-03-09'],               bookingAgency: 'Self-booked' },
    ],
    firstAlert: '2026-03-09',
    lastAlert: '2026-08-21',
    threatIndicator: 'Rare route (LHE-MCT-NBO on PK, 11 passengers per 6mo). 4 unrelated males, all last-minute one-way tickets. No checked luggage. All stated purpose "business meetings".',
    riskScore: 78,
    riskLevel: 'high',
    status: 'investigating',
  },
  {
    id: 'rs-003',
    route: 'DAC → MCT → CAI',
    originCity: 'Dhaka',
    transitCity: 'Muscat',
    destinationCity: 'Cairo',
    carrier: 'OA',
    flightNumbers: ['OA-502', 'OA-301'],
    rarityScore: 8,
    unrelatedTravelers: 5,
    travelers: [
      { name: 'Mohammed Faruk Hossain', nationality: 'BGD', passportNo: 'BD-AM1000231', travelDates: ['2026-09-14', '2026-07-02'], bookingAgency: 'Dhaka Global Tours' },
      { name: 'Karim Uddin Ahmed',      nationality: 'BGD', passportNo: 'BD-AN4812903', travelDates: ['2026-09-14'],               bookingAgency: 'Dhaka Global Tours' },
      { name: 'Rahim Chowdhury',        nationality: 'BGD', passportNo: 'BD-AO2938471', travelDates: ['2026-07-02'],               bookingAgency: 'Dhaka Global Tours' },
      { name: 'Jamal Haque Molla',     nationality: 'BGD', passportNo: 'BD-AP7830194', travelDates: ['2026-04-28'],               bookingAgency: 'Dhaka Global Tours' },
      { name: 'Shakil Rahman Bhuiyan', nationality: 'BGD', passportNo: 'BD-AQ1237489', travelDates: ['2026-02-19'],               bookingAgency: 'Dhaka Global Tours' },
    ],
    firstAlert: '2026-02-19',
    lastAlert: '2026-09-14',
    threatIndicator: 'Same Dhaka agency books all. DAC-MCT-CAI is a documented irregular migration staging route. All male, 20–35, tourist visas, no prior Egypt connection.',
    riskScore: 82,
    riskLevel: 'high',
    status: 'open',
  },
];

// ─── Transit Overlap Grid ─────────────────────────────────────────────────────
export interface TransitPerson {
  name: string;
  nationality: string;
  passportNo: string;
  arrivalFlight: string;
  departureFlight: string;
  arrivalTime: string;
  departureTime: string;
  riskFlag?: string;
}

export interface TransitOverlapEvent {
  id: string;
  date: string;
  zone: string;
  persons: TransitPerson[];
  overlapMinutes: number;
  overlapType: 'co_presence' | 'document_swap_window' | 'handoff_suspected';
  riskScore: number;
  riskLevel: RiskLevel;
  flagReason: string;
  status: CaseStatus;
}

export const transitOverlapEvents: TransitOverlapEvent[] = [
  {
    id: 'to-001',
    date: '2026-09-21',
    zone: 'MCT T1 Gate G12–G22',
    persons: [
      { name: 'Alaa Hassan Mahdi',  nationality: 'BGD', passportNo: 'BD-12345678', arrivalFlight: 'EK-549', departureFlight: 'EK-101', arrivalTime: '03:15', departureTime: '07:30', riskFlag: 'Recurring co-presence ×27' },
      { name: 'Ahmad Khalil Nasser',nationality: 'BGD', passportNo: 'BD-98765432', arrivalFlight: 'EK-549', departureFlight: 'EK-101', arrivalTime: '03:15', departureTime: '07:25', riskFlag: 'Recurring co-presence ×27' },
    ],
    overlapMinutes: 250,
    overlapType: 'co_presence',
    riskScore: 96,
    riskLevel: 'critical',
    flagReason: '27th consecutive co-occurrence. Same flight, same gate, 4h 10m overlap. No shared booking. Recommend secondary screening.',
    status: 'escalated',
  },
  {
    id: 'to-002',
    date: '2026-09-18',
    zone: 'MCT T2 Gate B07–B09',
    persons: [
      { name: 'Ali Samir Qasem',    nationality: 'OMN', passportNo: 'OM-57219430', arrivalFlight: 'WY-302', departureFlight: 'WY-401', arrivalTime: '11:00', departureTime: '13:45', riskFlag: 'Entered as OM-57219430' },
      { name: 'Khalid Salim Mansour',nationality: 'LBN', passportNo: 'LB-7819203',  arrivalFlight: 'ME-441', departureFlight: 'WY-401', arrivalTime: '11:10', departureTime: '13:45', riskFlag: 'Same gate, same departure, 35-min gap' },
    ],
    overlapMinutes: 155,
    overlapType: 'document_swap_window',
    riskScore: 89,
    riskLevel: 'critical',
    flagReason: 'Biometric capture discrepancy — facial similarity score 91% between OM arrival and LB departure. Possible passport swap in airside transit. Both depart on WY-401 to CMB.',
    status: 'escalated',
  },
  {
    id: 'to-003',
    date: '2026-09-12',
    zone: 'MCT T1 Gate E03',
    persons: [
      { name: 'Yusuf Bekele Tadesse', nationality: 'ETH', passportNo: 'ET-77312904', arrivalFlight: 'G9-206', departureFlight: 'G9-310', arrivalTime: '04:20', departureTime: '09:30' },
      { name: 'Fatima Muse Omar',     nationality: 'ETH', passportNo: 'ET-30019283', arrivalFlight: 'G9-206', departureFlight: 'G9-310', arrivalTime: '04:20', departureTime: '09:30', riskFlag: 'New passport, ticket-in-stages' },
    ],
    overlapMinutes: 310,
    overlapType: 'handoff_suspected',
    riskScore: 91,
    riskLevel: 'critical',
    flagReason: 'Victim profile (Fatima, 22F, new passport): onward BKK segment booked 2h 41min after MCT arrival — UNODC ticket-in-stages pattern. PNR contact phone match with facilitator (Yusuf).',
    status: 'escalated',
  },
  {
    id: 'to-004',
    date: '2026-09-08',
    zone: 'MCT T1 Gate F11',
    persons: [
      { name: 'Nour Ahmed Saad',    nationality: 'SDN', passportNo: 'SD-11234890', arrivalFlight: 'G9-408', departureFlight: 'G9-310', arrivalTime: '06:00', departureTime: '10:15' },
      { name: 'Khadija Mousa Omer', nationality: 'SDN', passportNo: 'SD-22345901', arrivalFlight: 'G9-408', departureFlight: 'G9-310', arrivalTime: '06:00', departureTime: '10:15', riskFlag: 'Route signature KRT→MCT→BKK' },
    ],
    overlapMinutes: 255,
    overlapType: 'co_presence',
    riskScore: 74,
    riskLevel: 'high',
    flagReason: 'Route signature RS-001 alert. Both females 20–26, same booking agency (Nile Travel KRT), traveling to BKK independently. No shared accommodation declared.',
    status: 'investigating',
  },
  {
    id: 'to-005',
    date: '2026-08-29',
    zone: 'MCT T1 Gate G04',
    persons: [
      { name: 'Viktor Petrenko',     nationality: 'UKR', passportNo: 'UA-AB123456', arrivalFlight: 'SV-571', departureFlight: 'KQ-114', arrivalTime: '14:00', departureTime: '19:30' },
      { name: 'Andrei Melnychenko', nationality: 'UKR', passportNo: 'UA-BC234567', arrivalFlight: 'SV-571', departureFlight: 'KQ-114', arrivalTime: '14:05', departureTime: '19:30' },
    ],
    overlapMinutes: 325,
    overlapType: 'co_presence',
    riskScore: 61,
    riskLevel: 'medium',
    flagReason: '3rd co-occurrence in 6 months on same SV-MCT-KQ routing (RUH–MCT–NBO). Separate PNRs. Medium value — flagged for continued monitoring.',
    status: 'open',
  },
];

// ─── Human Trafficking Indicators ─────────────────────────────────────────────
export interface TraffickingIndicator {
  code: string;
  source: 'UNODC' | 'IATA' | 'DHS' | 'ICAO';
  label: string;
  severity: 'critical' | 'high' | 'medium';
  detected: boolean;
}

export interface TraffickingCase {
  id: string;
  caseRef: string;
  subject: {
    name: string; nationality: string; age: number; gender: 'M' | 'F';
    passportAgeMonths: number; travelPurpose: string; route: string;
    bookingLeadHours: number; ticketType: 'one_way' | 'return';
  }
  facilitator?: { name: string; nationality: string; bookingRelation: string; }
  indicators: TraffickingIndicator[];
  totalScore: number;
  maxScore: number;
  riskLevel: RiskLevel;
  detectedDate: string;
  status: CaseStatus;
  analyst: string;
  notes: string;
}

export const traffickingCases: TraffickingCase[] = [
  {
    id: 'tc-001',
    caseRef: 'TIP-MCT-2026-0091',
    subject: { name: 'Fatima Muse Omar', nationality: 'ETH', age: 22, gender: 'F', passportAgeMonths: 2, travelPurpose: 'Domestic Work', route: 'ADD → MCT → BKK', bookingLeadHours: 3, ticketType: 'one_way' },
    facilitator: { name: 'Yusuf Bekele Tadesse', nationality: 'ETH', bookingRelation: 'Shared contact phone in separate PNRs' },
    indicators: [
      { code: 'UNODC-T1', source: 'UNODC', label: 'Onward ticket booked after arrival in transit (in-stages)', severity: 'critical', detected: true },
      { code: 'UNODC-T2', source: 'UNODC', label: 'New passport (<3 months) with stated history of foreign work', severity: 'high', detected: true },
      { code: 'UNODC-T3', source: 'UNODC', label: 'No verifiable employer in destination country (APIS data)', severity: 'high', detected: true },
      { code: 'IATA-V1',  source: 'IATA',  label: 'Documents potentially held by traveling companion', severity: 'critical', detected: true },
      { code: 'IATA-V2',  source: 'IATA',  label: 'One-way ticket, no return booking', severity: 'medium', detected: true },
      { code: 'DHS-F1',   source: 'DHS',   label: 'Facilitator books victim travel (shared PNR contact field)', severity: 'critical', detected: true },
      { code: 'DHS-F2',   source: 'DHS',   label: 'Age/gender profile matches highest-risk trafficking vector', severity: 'high', detected: true },
      { code: 'ICAO-D1',  source: 'ICAO',  label: 'Booking lead time <6h before departure', severity: 'medium', detected: true },
    ],
    totalScore: 92,
    maxScore: 100,
    riskLevel: 'critical',
    detectedDate: '2026-09-12',
    status: 'escalated',
    analyst: 'OFC-2024-0042',
    notes: 'Subject and facilitator transited MCT T1. Onward BKK segment booked 2h41m after arrival — confirmed UNODC ticket-in-stages indicator. Facilitator 12h ahead on same routing in prior occurrences. 8th occurrence of this pair. Refer to Oman Counter-Trafficking Unit and INTERPOL Muscat.',
  },
  {
    id: 'tc-002',
    caseRef: 'TIP-MCT-2026-0087',
    subject: { name: 'Mariam Osman Khalid', nationality: 'SDN', age: 21, gender: 'F', passportAgeMonths: 3, travelPurpose: 'Tourism', route: 'KRT → MCT → BKK', bookingLeadHours: 18, ticketType: 'one_way' },
    facilitator: undefined,
    indicators: [
      { code: 'UNODC-T2', source: 'UNODC', label: 'New passport (<4 months) with no prior travel stamps', severity: 'high', detected: true },
      { code: 'UNODC-T3', source: 'UNODC', label: 'No accommodation booked at destination (Bangkok)', severity: 'high', detected: true },
      { code: 'IATA-V2',  source: 'IATA',  label: 'One-way ticket, no return booking', severity: 'medium', detected: true },
      { code: 'DHS-F2',   source: 'DHS',   label: 'Age/gender profile matches highest-risk trafficking vector', severity: 'high', detected: true },
      { code: 'DHS-F1',   source: 'DHS',   label: 'Same travel agency books multiple similarly profiled women', severity: 'critical', detected: true },
      { code: 'ICAO-D1',  source: 'ICAO',  label: 'Last-minute one-way booking pattern', severity: 'medium', detected: false },
      { code: 'IATA-V3',  source: 'IATA',  label: 'Traveling alone, first international trip', severity: 'medium', detected: true },
      { code: 'DHS-V1',   source: 'DHS',   label: 'Stated purpose (tourism) inconsistent with origin/profile', severity: 'high', detected: true },
    ],
    totalScore: 88,
    maxScore: 100,
    riskLevel: 'critical',
    detectedDate: '2026-09-01',
    status: 'escalated',
    analyst: 'OFC-2024-0017',
    notes: 'Part of route signature RS-001 cluster (KRT→MCT→BKK, Nile Travel KRT). 6th woman from same agency in 7 months. All new passports, all solo female travelers 18–26, all Bangkok-bound. Agency under investigation via AIRCOP.',
  },
  {
    id: 'tc-003',
    caseRef: 'TIP-MCT-2026-0079',
    subject: { name: 'Priya Shankar Devi', nationality: 'IND', age: 24, gender: 'F', passportAgeMonths: 14, travelPurpose: 'Domestic Work (UAE)', route: 'MAA → MCT → CMB', bookingLeadHours: 4, ticketType: 'one_way' },
    facilitator: { name: 'Rajan Murugesan', nationality: 'IND', bookingRelation: 'Contact email in both separate PNRs' },
    indicators: [
      { code: 'UNODC-T3', source: 'UNODC', label: 'No verifiable employer in stated destination country', severity: 'high', detected: true },
      { code: 'IATA-V1',  source: 'IATA',  label: 'Documents potentially held by traveling companion', severity: 'critical', detected: false },
      { code: 'IATA-V2',  source: 'IATA',  label: 'One-way ticket, no return booking', severity: 'medium', detected: true },
      { code: 'DHS-F1',   source: 'DHS',   label: 'Facilitator shares PNR contact with victim (email)', severity: 'critical', detected: true },
      { code: 'DHS-F2',   source: 'DHS',   label: 'Age/gender matches risk vector', severity: 'high', detected: true },
      { code: 'ICAO-D1',  source: 'ICAO',  label: 'Booking lead time <6h before departure', severity: 'medium', detected: true },
      { code: 'UNODC-T4', source: 'UNODC', label: 'Employer name changes on each trip (4 different employers over 5 trips)', severity: 'high', detected: true },
      { code: 'IATA-V3',  source: 'IATA',  label: 'Destination inconsistent with stated travel purpose', severity: 'medium', detected: true },
    ],
    totalScore: 79,
    maxScore: 100,
    riskLevel: 'high',
    detectedDate: '2026-09-18',
    status: 'investigating',
    analyst: 'OFC-2024-0042',
    notes: 'Subject lists different employer each trip; none verifiable in Oman/UAE labor registry. Facilitator always books before subject. Route MAA→MCT→CMB unusual for stated UAE employment purpose. 5 occurrences in 12 months.',
  },
  {
    id: 'tc-004',
    caseRef: 'TIP-MCT-2026-0063',
    subject: { name: 'Amara Diallo Camara', nationality: 'GIN', age: 19, gender: 'F', passportAgeMonths: 1, travelPurpose: 'Visit Relatives', route: 'CKY → MCT → DXB', bookingLeadHours: 9, ticketType: 'one_way' },
    facilitator: undefined,
    indicators: [
      { code: 'UNODC-T2', source: 'UNODC', label: 'Brand new passport (1 month old), no prior stamps', severity: 'high', detected: true },
      { code: 'UNODC-T3', source: 'UNODC', label: 'No verifiable relatives in Dubai (no address in APIS)', severity: 'high', detected: true },
      { code: 'IATA-V2',  source: 'IATA',  label: 'One-way ticket', severity: 'medium', detected: true },
      { code: 'DHS-F2',   source: 'DHS',   label: 'Age/gender/nationality matches high-risk West Africa vector', severity: 'high', detected: true },
      { code: 'IATA-V3',  source: 'IATA',  label: 'First international trip, traveling alone', severity: 'medium', detected: true },
      { code: 'DHS-V1',   source: 'DHS',   label: 'Stated purpose inconsistent with profile', severity: 'high', detected: true },
      { code: 'ICAO-D1',  source: 'ICAO',  label: 'Booking within 9h of departure', severity: 'medium', detected: true },
      { code: 'UNODC-T5', source: 'UNODC', label: 'Origin corridor (West Africa–Gulf) matches UNODC documented trafficking route', severity: 'critical', detected: true },
    ],
    totalScore: 84,
    maxScore: 100,
    riskLevel: 'critical',
    detectedDate: '2026-08-11',
    status: 'confirmed',
    analyst: 'OFC-2024-0031',
    notes: 'Referred to Oman CTU. Subject interviewed in transit. Could not name relative or address in Dubai. Referred to social protection services. Case confirmed as trafficking attempt — facilitator identified from WhatsApp contact details on phone.',
  },
];

// ─── Document Anomaly ─────────────────────────────────────────────────────────
export type DocAnomalyType = 'passport_swap' | 'number_reuse' | 'biometric_mismatch' | 'new_stamp_old_travel' | 'staged_doc_acquisition';

export interface DocumentAnomaly {
  id: string;
  type: DocAnomalyType;
  typeLabel: string;
  entryName: string;
  entryDocument: string;
  entryNationality: string;
  exitName?: string;
  exitDocument?: string;
  exitNationality?: string;
  biometricSimilarity?: number;
  detectedAt: string;
  transitZone: string;
  flightIn: string;
  flightOut: string;
  confidence: number;
  riskScore: number;
  riskLevel: RiskLevel;
  status: CaseStatus;
  details: string;
  actionTaken: string;
}

export const documentAnomalies: DocumentAnomaly[] = [
  {
    id: 'da-001',
    type: 'passport_swap',
    typeLabel: 'Passport Swap',
    entryName: 'Ali Samir Qasem',
    entryDocument: 'OM-57219430',
    entryNationality: 'OMN',
    exitName: 'Khalid Salim Mansour',
    exitDocument: 'LB-7819203',
    exitNationality: 'LBN',
    biometricSimilarity: 91.4,
    detectedAt: '2026-09-18T13:42:00',
    transitZone: 'MCT T2 Gate B07',
    flightIn: 'WY-302',
    flightOut: 'WY-401',
    confidence: 91,
    riskScore: 95,
    riskLevel: 'critical',
    status: 'escalated',
    details: 'Biometric facial comparison: entry face (OM-57219430 at 11:00 check-in) vs departure face (LB-7819203 at 13:40 gate scan) = 91.4% similarity. Two persons entered transit zone within 10 minutes; one did not depart on their registered ticket. Consistent with document handoff inside transit airside.',
    actionTaken: 'Alert issued to WY-401 gate staff. Boarding halted pending secondary screening.',
  },
  {
    id: 'da-002',
    type: 'number_reuse',
    typeLabel: 'Document Number Reuse',
    entryName: 'Saeed Mubarak Al-Harthi',
    entryDocument: 'OM-88234512',
    entryNationality: 'OMN',
    exitName: 'Tariq Ahmad Siddiqui',
    exitDocument: 'OM-88234512',
    exitNationality: 'PAK',
    biometricSimilarity: 24.1,
    detectedAt: '2026-08-30T08:15:00',
    transitZone: 'MCT T1 Gate G18',
    flightIn: 'OA-502',
    flightOut: 'EK-222',
    confidence: 99,
    riskScore: 99,
    riskLevel: 'critical',
    status: 'confirmed',
    details: 'Same document number (OM-88234512) used by two persons with different names and nationalities within 72 hours. Biometric similarity 24.1% — definitively different persons. Document is cloned or forged.',
    actionTaken: 'Document flagged as fraudulent. SLTD database notification filed via INTERPOL I-24/7. Both bearers detained for investigation.',
  },
  {
    id: 'da-003',
    type: 'biometric_mismatch',
    typeLabel: 'Biometric Mismatch',
    entryName: 'Nguyen Thi Lan',
    entryDocument: 'VN-B7291034',
    entryNationality: 'VNM',
    biometricSimilarity: 62.3,
    detectedAt: '2026-09-05T17:22:00',
    transitZone: 'MCT T1 Check-in',
    flightIn: 'EK-393',
    flightOut: 'SV-802',
    confidence: 78,
    riskScore: 83,
    riskLevel: 'high',
    status: 'investigating',
    details: 'Check-in facial capture vs passport MRZ photo: 62.3% similarity — below 75% threshold. May indicate lookalike fraud (genuine document, wrong bearer) or degraded photo quality. Referred to secondary screening.',
    actionTaken: 'Secondary screening ordered. Subject cooperated. Inconclusive — passport sent for forensic examination.',
  },
  {
    id: 'da-004',
    type: 'new_stamp_old_travel',
    typeLabel: 'Stamp Inconsistency',
    entryName: 'Mohammed Farouk Idris',
    entryDocument: 'SD-99128374',
    entryNationality: 'SDN',
    detectedAt: '2026-09-10T09:47:00',
    transitZone: 'MCT T1 Arrivals',
    flightIn: 'G9-408',
    flightOut: 'G9-206',
    confidence: 71,
    riskScore: 68,
    riskLevel: 'medium',
    status: 'open',
    details: 'Passport issued 2026-07-01 (2 months ago). Subject claims travel history to 6 countries in 3 years, but passport shows no corresponding exit/entry stamps. Possible prior passport deliberately withheld or destroyed.',
    actionTaken: 'Flagged for analyst review. Subject presented 5-year work contract — under verification with employer.',
  },
  {
    id: 'da-005',
    type: 'staged_doc_acquisition',
    typeLabel: 'Staged Document Acquisition',
    entryName: 'Hana Ahmed Wael',
    entryDocument: 'SD-31748201',
    entryNationality: 'SDN',
    detectedAt: '2026-09-01T05:30:00',
    transitZone: 'MCT T2',
    flightIn: 'G9-408',
    flightOut: 'G9-310',
    confidence: 67,
    riskScore: 74,
    riskLevel: 'high',
    status: 'investigating',
    details: 'Passport issued 2026-06-15. Part of RS-001 route signature cluster (KRT→MCT→BKK, Nile Travel KRT agency). Pattern of same agency sourcing newly-issued passports for young women traveling to BKK. Consistent with UNODC pattern of traffickers obtaining new documents for victims before each trip.',
    actionTaken: 'Part of RS-001 cluster investigation. Agency flagged with AIRCOP network.',
  },
];

// ─── Summary Stats ─────────────────────────────────────────────────────────────
export const tpiStats = {
  activeNetworks: coTravelerPairs.filter(p => p.status !== 'cleared').length,
  criticalAlerts: [
    ...coTravelerPairs.filter(p => p.riskLevel === 'critical'),
    ...routeSignatures.filter(r => r.riskLevel === 'critical'),
    ...transitOverlapEvents.filter(t => t.riskLevel === 'critical'),
    ...traffickingCases.filter(c => c.riskLevel === 'critical'),
    ...documentAnomalies.filter(d => d.riskLevel === 'critical'),
  ].length,
  traffickingCasesOpen: traffickingCases.filter(c => c.status !== 'cleared' && c.status !== 'confirmed').length,
  documentAnomaliesOpen: documentAnomalies.filter(d => d.status !== 'cleared').length,
  coTravelerPairsMonitored: coTravelerPairs.length,
  routeSignatureAlerts: routeSignatures.length,
  dataSpanYears: 5,
  totalTravelerRecordsAnalyzed: '14.2M',
  patternDetectionEngines: 5,
};
