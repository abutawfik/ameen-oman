export type FlightStatus = 'en_route' | 'landed' | 'scheduled' | 'diverted';
export type ThreatLevel  = 'critical' | 'high' | 'medium' | 'low' | 'clear';

export interface TrackedFlight {
  id: string;
  flightNo: string;
  airline: string;
  airlineCode: string;
  origin: string;       originCode: string;       originLat: number; originLon: number;
  destination: string;  destinationCode: string;  destLat: number;   destLon: number;
  currentLat?: number;  currentLon?: number;
  altitude?: number;
  speed?: number;
  heading?: number;
  departureTime: string;
  arrivalTime: string;
  status: FlightStatus;
  threatLevel: ThreatLevel;
  paxCount: number;
  hitCount: number;
  highRiskCount: number;
  notes?: string;
}

export interface RiskHotspot {
  id: string;
  lat: number; lon: number;
  label: string; labelAr: string;
  radius: number;
  threatLevel: ThreatLevel;
  description: string;
  activeAlerts: number;
}

export interface RiskSourceStat {
  source: string; sourceAr: string;
  icon: string; color: string;
  count: number; delta: number; deltaUp: boolean;
}

// ── Flights ────────────────────────────────────────────────
export const TRACKED_FLIGHTS: TrackedFlight[] = [
  {
    id: 'TF001', flightNo: 'EK865', airline: 'Emirates', airlineCode: 'EK',
    origin: 'Dubai', originCode: 'DXB', originLat: 25.2532, originLon: 55.3657,
    destination: 'Muscat', destinationCode: 'MCT', destLat: 23.5932, destLon: 58.2844,
    currentLat: 24.4, currentLon: 56.9, altitude: 37000, speed: 490, heading: 138,
    departureTime: '2026-08-17T14:15', arrivalTime: '2026-08-17T16:20',
    status: 'en_route', threatLevel: 'high', paxCount: 238, hitCount: 3, highRiskCount: 1,
    notes: '3 INTERPOL/National WL hits — 1 critical',
  },
  {
    id: 'TF002', flightNo: 'PK207', airline: 'PIA', airlineCode: 'PK',
    origin: 'Karachi', originCode: 'KHI', originLat: 24.9008, originLon: 67.1681,
    destination: 'Muscat', destinationCode: 'MCT', destLat: 23.5932, destLon: 58.2844,
    currentLat: 24.2, currentLon: 62.8, altitude: 35000, speed: 475, heading: 260,
    departureTime: '2026-08-17T03:00', arrivalTime: '2026-08-17T05:30',
    status: 'landed', threatLevel: 'critical', paxCount: 154, hitCount: 1, highRiskCount: 1,
    notes: 'Landed 05:28 — UNSC 1267 subject on board; detained at secondary',
  },
  {
    id: 'TF003', flightNo: 'AF672', airline: 'Air France', airlineCode: 'AF',
    origin: 'Paris', originCode: 'CDG', originLat: 49.0097, originLon: 2.5479,
    destination: 'Muscat', destinationCode: 'MCT', destLat: 23.5932, destLon: 58.2844,
    currentLat: 35.8, currentLon: 28.4, altitude: 39000, speed: 520, heading: 112,
    departureTime: '2026-08-17T14:00', arrivalTime: '2026-08-18T00:45',
    status: 'en_route', threatLevel: 'clear', paxCount: 312, hitCount: 0, highRiskCount: 0,
  },
  {
    id: 'TF004', flightNo: 'WY101', airline: 'Oman Air', airlineCode: 'WY',
    origin: 'London', originCode: 'LHR', originLat: 51.477, originLon: -0.461,
    destination: 'Muscat', destinationCode: 'MCT', destLat: 23.5932, destLon: 58.2844,
    currentLat: 42.1, currentLon: 22.6, altitude: 38000, speed: 510, heading: 118,
    departureTime: '2026-08-17T09:30', arrivalTime: '2026-08-17T20:15',
    status: 'en_route', threatLevel: 'medium', paxCount: 278, hitCount: 2, highRiskCount: 0,
    notes: '2 watchlist hits — under review',
  },
  {
    id: 'TF005', flightNo: 'SV871', airline: 'Saudia', airlineCode: 'SV',
    origin: 'Riyadh', originCode: 'RUH', originLat: 24.9576, originLon: 46.6988,
    destination: 'Muscat', destinationCode: 'MCT', destLat: 23.5932, destLon: 58.2844,
    currentLat: 23.8, currentLon: 54.2, altitude: 32000, speed: 460, heading: 95,
    departureTime: '2026-08-17T15:00', arrivalTime: '2026-08-17T17:30',
    status: 'en_route', threatLevel: 'low', paxCount: 186, hitCount: 1, highRiskCount: 0,
  },
  {
    id: 'TF006', flightNo: 'KQ102', airline: 'Kenya Airways', airlineCode: 'KQ',
    origin: 'Nairobi', originCode: 'NBO', originLat: -1.3192, originLon: 36.9275,
    destination: 'Muscat', destinationCode: 'MCT', destLat: 23.5932, destLon: 58.2844,
    departureTime: '2026-08-17T22:00', arrivalTime: '2026-08-18T04:30',
    status: 'scheduled', threatLevel: 'medium', paxCount: 201, hitCount: 1, highRiskCount: 0,
    notes: 'Customs POI on manifest',
  },
];

// ── Risk Hotspots ──────────────────────────────────────────
export const RISK_HOTSPOTS: RiskHotspot[] = [
  {
    id: 'HS001', lat: 23.5932, lon: 58.2844,
    label: 'Muscat International', labelAr: 'مطار مسقط الدولي',
    radius: 50, threatLevel: 'high',
    description: 'Primary port of entry — active monitoring', activeAlerts: 7,
  },
  {
    id: 'HS002', lat: 24.9008, lon: 67.1681,
    label: 'Karachi (Origin)', labelAr: 'كراتشي',
    radius: 80, threatLevel: 'critical',
    description: 'Elevated departures of interest — UNSC watch', activeAlerts: 2,
  },
  {
    id: 'HS003', lat: 25.2532, lon: 55.3657,
    label: 'Dubai Hub', labelAr: 'مركز دبي',
    radius: 60, threatLevel: 'medium',
    description: 'High-volume transit — 3 active hit passengers', activeAlerts: 3,
  },
];

// ── Risk Source Stats ──────────────────────────────────────
export const RISK_SOURCE_STATS: RiskSourceStat[] = [
  { source: 'INTERPOL Red Notices', sourceAr: 'نشرات الإنتربول الحمراء', icon: 'ri-global-line',         color: '#C94A5E', count: 14, delta: 2,  deltaUp: true  },
  { source: 'National Security WL', sourceAr: 'قائمة الأمن الوطني',      icon: 'ri-shield-line',          color: '#4A7AA8', count: 31, delta: 4,  deltaUp: true  },
  { source: 'OFAC / UN Sanctions',  sourceAr: 'قائمة العقوبات',           icon: 'ri-bank-line',            color: '#D4922A', count: 8,  delta: 1,  deltaUp: false },
  { source: 'Customs Alerts',       sourceAr: 'تنبيهات الجمارك',          icon: 'ri-archive-line',         color: '#A78BFA', count: 19, delta: 3,  deltaUp: true  },
  { source: 'Overstay / Visa',      sourceAr: 'تجاوز مدة الإقامة',        icon: 'ri-passport-line',        color: '#D6B47E', count: 47, delta: 12, deltaUp: false },
  { source: 'Financial Crime',      sourceAr: 'الجرائم المالية',           icon: 'ri-money-dollar-circle-line',color:'#4A8E5A', count: 6, delta: 1,  deltaUp: true  },
];

// ── Summary stats ──────────────────────────────────────────
export const TRACKER_SUMMARY = {
  activeFlight: TRACKED_FLIGHTS.filter(f => f.status === 'en_route').length,
  totalHits:    TRACKED_FLIGHTS.reduce((s, f) => s + f.hitCount, 0),
  critical:     TRACKED_FLIGHTS.filter(f => f.threatLevel === 'critical').length,
  paxInFlight:  TRACKED_FLIGHTS.filter(f => f.status === 'en_route').reduce((s, f) => s + f.paxCount, 0),
};
