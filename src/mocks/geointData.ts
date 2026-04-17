export interface GeoSubject {
  id: string;
  name: string;
  nationality: string;
  passportNo: string;
  riskScore: number;
  riskLevel: "critical" | "high" | "medium" | "low";
  status: "active" | "inactive" | "flagged";
  streamCount: number;
  lastSeen: string;
  lastLocation: string;
  photo: string;
}

export interface MovementPoint {
  id: string;
  subjectId: string;
  lat: number;
  lng: number;
  location: string;
  district: string;
  stream: string;
  streamIcon: string;
  streamColor: string;
  timestamp: string;
  eventType: string;
  detail: string;
  riskFlag: boolean;
}

export interface Hotspot {
  id: string;
  lat: number;
  lng: number;
  location: string;
  district: string;
  intensity: "critical" | "high" | "medium" | "low";
  eventCount: number;
  subjectCount: number;
  streams: string[];
  topActivity: string;
  lastEvent: string;
  radius: number;
}

export interface CrossStreamCorrelationEvent {
  id: string;
  subjectId: string;
  subjectName: string;
  location: string;
  lat: number;
  lng: number;
  streams: { name: string; icon: string; color: string; event: string; time: string }[];
  correlationType: string;
  riskScore: number;
  timestamp: string;
  status: "open" | "investigating" | "resolved";
}

export interface GeoAlert {
  id: string;
  type: "geofence_breach" | "cluster_spike" | "cross_stream" | "movement_anomaly" | "border_proximity";
  severity: "critical" | "high" | "medium";
  subject: string;
  location: string;
  detail: string;
  timestamp: string;
  status: "new" | "acknowledged" | "resolved";
}

export const geoSubjects: GeoSubject[] = [
  {
    id: "sub-001",
    name: "Ahmed Al-Rashidi",
    nationality: "Omani",
    passportNo: "OM-4523891",
    riskScore: 87,
    riskLevel: "critical",
    status: "flagged",
    streamCount: 9,
    lastSeen: "12 min ago",
    lastLocation: "Muscat International Airport",
    photo: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20middle%20eastern%20man%20in%20his%2040s%2C%20neutral%20background%2C%20formal%20attire%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=geo-sub-001&orientation=squarish",
  },
  {
    id: "sub-002",
    name: "Khalid Al-Balushi",
    nationality: "Omani",
    passportNo: "OM-7823401",
    riskScore: 74,
    riskLevel: "high",
    status: "active",
    streamCount: 7,
    lastSeen: "34 min ago",
    lastLocation: "Muttrah Port",
    photo: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20middle%20eastern%20man%20in%20his%2030s%2C%20neutral%20background%2C%20business%20casual%20attire%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=geo-sub-002&orientation=squarish",
  },
  {
    id: "sub-003",
    name: "Fatima Al-Zadjali",
    nationality: "Omani",
    passportNo: "OM-3312890",
    riskScore: 61,
    riskLevel: "high",
    status: "active",
    streamCount: 6,
    lastSeen: "1.2 hr ago",
    lastLocation: "Qurum Commercial District",
    photo: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20middle%20eastern%20woman%20in%20her%2030s%2C%20neutral%20background%2C%20formal%20attire%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=geo-sub-003&orientation=squarish",
  },
  {
    id: "sub-004",
    name: "Rajesh Kumar",
    nationality: "Indian",
    passportNo: "IN-7823401",
    riskScore: 55,
    riskLevel: "medium",
    status: "active",
    streamCount: 5,
    lastSeen: "2.5 hr ago",
    lastLocation: "Ruwi Business District",
    photo: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20south%20asian%20man%20in%20his%2030s%2C%20neutral%20background%2C%20business%20attire%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=geo-sub-004&orientation=squarish",
  },
  {
    id: "sub-005",
    name: "Mohammed Al-Amri",
    nationality: "Omani",
    passportNo: "OM-9912345",
    riskScore: 48,
    riskLevel: "medium",
    status: "inactive",
    streamCount: 4,
    lastSeen: "6 hr ago",
    lastLocation: "Seeb Industrial Area",
    photo: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20middle%20eastern%20man%20in%20his%2050s%2C%20neutral%20background%2C%20formal%20attire%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=geo-sub-005&orientation=squarish",
  },
];

export const movementPoints: MovementPoint[] = [
  // Ahmed Al-Rashidi trail
  { id: "mp-001", subjectId: "sub-001", lat: 23.5880, lng: 58.3829, location: "Muscat International Airport", district: "Seeb", stream: "Borders", streamIcon: "ri-passport-line", streamColor: "#60A5FA", timestamp: "2026-04-06 07:12", eventType: "Entry Recorded", detail: "Arrived from Dubai — Flight EK-862", riskFlag: true },
  { id: "mp-002", subjectId: "sub-001", lat: 23.6100, lng: 58.5930, location: "Grand Hyatt Muscat", district: "Shati Al Qurum", stream: "Hotel", streamIcon: "ri-hotel-line", streamColor: "#D4A84B", timestamp: "2026-04-06 08:45", eventType: "Check-In", detail: "Room 412, 3-night booking", riskFlag: false },
  { id: "mp-003", subjectId: "sub-001", lat: 23.6200, lng: 58.5800, location: "National Bank of Oman", district: "Qurum", stream: "Financial", streamIcon: "ri-bank-card-line", streamColor: "#4ADE80", timestamp: "2026-04-06 10:22", eventType: "Large Cash Deposit", detail: "OMR 18,500 cash deposit", riskFlag: true },
  { id: "mp-004", subjectId: "sub-001", lat: 23.6150, lng: 58.5750, location: "Qurum City Centre", district: "Qurum", stream: "E-Commerce", streamIcon: "ri-shopping-cart-line", streamColor: "#34D399", timestamp: "2026-04-06 11:40", eventType: "High-Value Purchase", detail: "Electronics — OMR 3,200", riskFlag: false },
  { id: "mp-005", subjectId: "sub-001", lat: 23.5950, lng: 58.5600, location: "Muttrah Port", district: "Muttrah", stream: "Marine", streamIcon: "ri-anchor-line", streamColor: "#FB923C", timestamp: "2026-04-06 13:15", eventType: "Marina Docking", detail: "Vessel: Al-Noor, 2hr berth", riskFlag: true },
  { id: "mp-006", subjectId: "sub-001", lat: 23.5880, lng: 58.3829, location: "Muscat International Airport", district: "Seeb", stream: "Borders", streamIcon: "ri-passport-line", streamColor: "#60A5FA", timestamp: "2026-04-06 15:48", eventType: "Exit Recorded", detail: "Departed to Doha — Flight QR-1142", riskFlag: true },

  // Khalid Al-Balushi trail
  { id: "mp-007", subjectId: "sub-002", lat: 23.5950, lng: 58.5600, location: "Muttrah Port", district: "Muttrah", stream: "Customs", streamIcon: "ri-ship-line", streamColor: "#FACC15", timestamp: "2026-04-06 06:30", eventType: "Import Declaration", detail: "Container MSKU-4523891, Electronics", riskFlag: true },
  { id: "mp-008", subjectId: "sub-002", lat: 23.6050, lng: 58.5700, location: "Ruwi Business District", district: "Ruwi", stream: "Employment", streamIcon: "ri-briefcase-line", streamColor: "#F9A8D4", timestamp: "2026-04-06 09:00", eventType: "Employer Change", detail: "Transfer to Al-Balushi Trading LLC", riskFlag: false },
  { id: "mp-009", subjectId: "sub-002", lat: 23.6100, lng: 58.5930, location: "Muscat Hills", district: "Shati Al Qurum", stream: "Municipality", streamIcon: "ri-government-line", streamColor: "#D4A84B", timestamp: "2026-04-06 11:20", eventType: "Lease Start", detail: "Villa 7, Al Khuwair — 12 months", riskFlag: false },
  { id: "mp-010", subjectId: "sub-002", lat: 23.5950, lng: 58.5600, location: "Muttrah Port", district: "Muttrah", stream: "Marine", streamIcon: "ri-anchor-line", streamColor: "#FB923C", timestamp: "2026-04-06 14:00", eventType: "Boat Rental", detail: "Speed boat — 4hr rental", riskFlag: true },

  // Fatima Al-Zadjali trail
  { id: "mp-011", subjectId: "sub-003", lat: 23.6200, lng: 58.5800, location: "Sultan Qaboos University", district: "Al Khoud", stream: "Education", streamIcon: "ri-graduation-cap-line", streamColor: "#A78BFA", timestamp: "2026-04-06 08:00", eventType: "Course Registration", detail: "MBA Program — Spring 2026", riskFlag: false },
  { id: "mp-012", subjectId: "sub-003", lat: 23.6150, lng: 58.5750, location: "Qurum Commercial District", district: "Qurum", stream: "Mobile", streamIcon: "ri-sim-card-line", streamColor: "#D4A84B", timestamp: "2026-04-06 10:30", eventType: "SIM Swap", detail: "Number: +968 9234 5678", riskFlag: true },
  { id: "mp-013", subjectId: "sub-003", lat: 23.6100, lng: 58.5930, location: "Royal Hospital", district: "Shati Al Qurum", stream: "Healthcare", streamIcon: "ri-heart-pulse-line", streamColor: "#F87171", timestamp: "2026-04-06 12:15", eventType: "Patient Registration", detail: "Outpatient — Cardiology", riskFlag: false },

  // Rajesh Kumar trail
  { id: "mp-014", subjectId: "sub-004", lat: 23.6050, lng: 58.5700, location: "Ruwi Business District", district: "Ruwi", stream: "Employment", streamIcon: "ri-briefcase-line", streamColor: "#F9A8D4", timestamp: "2026-04-06 07:45", eventType: "Work Permit Issued", detail: "Construction sector — 2 years", riskFlag: false },
  { id: "mp-015", subjectId: "sub-004", lat: 23.6000, lng: 58.5650, location: "Ruwi Bus Station", district: "Ruwi", stream: "Transport", streamIcon: "ri-bus-line", streamColor: "#FB923C", timestamp: "2026-04-06 09:30", eventType: "Bus Journey", detail: "Route 3 — Ruwi to Seeb", riskFlag: false },
  { id: "mp-016", subjectId: "sub-004", lat: 23.5880, lng: 58.3829, location: "Muscat International Airport", district: "Seeb", stream: "Borders", streamIcon: "ri-passport-line", streamColor: "#60A5FA", timestamp: "2026-04-06 11:00", eventType: "Entry Recorded", detail: "Arrived from Mumbai — Flight AI-932", riskFlag: false },
];

export const hotspots: Hotspot[] = [
  {
    id: "hs-001",
    lat: 23.5950,
    lng: 58.5600,
    location: "Muttrah Port Area",
    district: "Muttrah",
    intensity: "critical",
    eventCount: 234,
    subjectCount: 18,
    streams: ["Customs", "Marine", "Borders", "Financial"],
    topActivity: "Cargo Declarations & Marine Activity",
    lastEvent: "2 min ago",
    radius: 60,
  },
  {
    id: "hs-002",
    lat: 23.5880,
    lng: 58.3829,
    location: "Muscat International Airport",
    district: "Seeb",
    intensity: "critical",
    eventCount: 412,
    subjectCount: 34,
    streams: ["Borders", "Transport", "Hotel", "Financial"],
    topActivity: "Entry/Exit Events",
    lastEvent: "1 min ago",
    radius: 70,
  },
  {
    id: "hs-003",
    lat: 23.6200,
    lng: 58.5800,
    location: "Qurum Commercial District",
    district: "Qurum",
    intensity: "high",
    eventCount: 178,
    subjectCount: 22,
    streams: ["Financial", "E-Commerce", "Mobile", "Employment"],
    topActivity: "Financial Transactions",
    lastEvent: "5 min ago",
    radius: 50,
  },
  {
    id: "hs-004",
    lat: 23.6050,
    lng: 58.5700,
    location: "Ruwi Business District",
    district: "Ruwi",
    intensity: "high",
    eventCount: 145,
    subjectCount: 19,
    streams: ["Employment", "Financial", "Mobile", "Transport"],
    topActivity: "Employment & Financial Activity",
    lastEvent: "8 min ago",
    radius: 45,
  },
  {
    id: "hs-005",
    lat: 23.6100,
    lng: 58.5930,
    location: "Shati Al Qurum",
    district: "Shati Al Qurum",
    intensity: "medium",
    eventCount: 89,
    subjectCount: 11,
    streams: ["Hotel", "Healthcare", "Municipality"],
    topActivity: "Hotel Check-ins & Healthcare",
    lastEvent: "15 min ago",
    radius: 35,
  },
  {
    id: "hs-006",
    lat: 23.5700,
    lng: 58.5400,
    location: "Old Muscat",
    district: "Old Muscat",
    intensity: "medium",
    eventCount: 67,
    subjectCount: 8,
    streams: ["Tourism", "Transport", "Postal"],
    topActivity: "Tourism & Transport Events",
    lastEvent: "22 min ago",
    radius: 30,
  },
  {
    id: "hs-007",
    lat: 23.6400,
    lng: 58.5500,
    location: "Al Khuwair",
    district: "Al Khuwair",
    intensity: "low",
    eventCount: 34,
    subjectCount: 5,
    streams: ["Municipality", "Utility", "Employment"],
    topActivity: "Utility & Municipality Events",
    lastEvent: "41 min ago",
    radius: 25,
  },
];

export const crossStreamCorrelations: CrossStreamCorrelationEvent[] = [
  {
    id: "csc-001",
    subjectId: "sub-001",
    subjectName: "Ahmed Al-Rashidi",
    location: "Muttrah Port",
    lat: 23.5950,
    lng: 58.5600,
    streams: [
      { name: "Borders", icon: "ri-passport-line", color: "#60A5FA", event: "Entry from Dubai", time: "07:12" },
      { name: "Financial", icon: "ri-bank-card-line", color: "#4ADE80", event: "Cash deposit OMR 18,500", time: "10:22" },
      { name: "Marine", icon: "ri-anchor-line", color: "#FB923C", event: "Marina docking — Al-Noor", time: "13:15" },
      { name: "Customs", icon: "ri-ship-line", color: "#FACC15", event: "Import declaration filed", time: "13:45" },
    ],
    correlationType: "Money Laundering Pattern",
    riskScore: 91,
    timestamp: "2026-04-06 13:45",
    status: "investigating",
  },
  {
    id: "csc-002",
    subjectId: "sub-002",
    subjectName: "Khalid Al-Balushi",
    location: "Muttrah Port",
    lat: 23.5960,
    lng: 58.5610,
    streams: [
      { name: "Customs", icon: "ri-ship-line", color: "#FACC15", event: "Container import — Electronics", time: "06:30" },
      { name: "Employment", icon: "ri-briefcase-line", color: "#F9A8D4", event: "Employer change", time: "09:00" },
      { name: "Marine", icon: "ri-anchor-line", color: "#FB923C", event: "Boat rental — 4hr", time: "14:00" },
    ],
    correlationType: "Smuggling Route Indicator",
    riskScore: 78,
    timestamp: "2026-04-06 14:00",
    status: "open",
  },
  {
    id: "csc-003",
    subjectId: "sub-003",
    subjectName: "Fatima Al-Zadjali",
    location: "Qurum District",
    lat: 23.6150,
    lng: 58.5750,
    streams: [
      { name: "Mobile", icon: "ri-sim-card-line", color: "#D4A84B", event: "SIM swap — suspicious", time: "10:30" },
      { name: "Financial", icon: "ri-bank-card-line", color: "#4ADE80", event: "Wire transfer OMR 8,000", time: "11:00" },
      { name: "E-Commerce", icon: "ri-shopping-cart-line", color: "#34D399", event: "Bulk purchase — 200 units", time: "11:45" },
    ],
    correlationType: "Identity Fraud Indicator",
    riskScore: 65,
    timestamp: "2026-04-06 11:45",
    status: "open",
  },
  {
    id: "csc-004",
    subjectId: "sub-004",
    subjectName: "Rajesh Kumar",
    location: "Seeb Airport",
    lat: 23.5880,
    lng: 58.3829,
    streams: [
      { name: "Borders", icon: "ri-passport-line", color: "#60A5FA", event: "Entry from Mumbai", time: "11:00" },
      { name: "Employment", icon: "ri-briefcase-line", color: "#F9A8D4", event: "Work permit issued", time: "07:45" },
      { name: "Transport", icon: "ri-bus-line", color: "#FB923C", event: "Bus journey — Ruwi to Seeb", time: "09:30" },
    ],
    correlationType: "Irregular Movement Pattern",
    riskScore: 52,
    timestamp: "2026-04-06 11:00",
    status: "resolved",
  },
];

export const geoAlerts: GeoAlert[] = [
  { id: "ga-001", type: "geofence_breach", severity: "critical", subject: "Ahmed Al-Rashidi", location: "Restricted Maritime Zone — Muttrah", detail: "Subject entered restricted maritime zone without clearance", timestamp: "2026-04-06 13:20", status: "new" },
  { id: "ga-002", type: "cluster_spike", severity: "high", subject: "Multiple Subjects", location: "Muttrah Port Area", detail: "18 flagged subjects detected in 500m radius within 2 hours", timestamp: "2026-04-06 13:00", status: "acknowledged" },
  { id: "ga-003", type: "cross_stream", severity: "critical", subject: "Ahmed Al-Rashidi", location: "Qurum — National Bank", detail: "Cash deposit followed by marine activity — money laundering pattern", timestamp: "2026-04-06 10:30", status: "new" },
  { id: "ga-004", type: "movement_anomaly", severity: "high", subject: "Khalid Al-Balushi", location: "Muttrah Port", detail: "Subject visited port 3 times in 8 hours — unusual frequency", timestamp: "2026-04-06 14:05", status: "new" },
  { id: "ga-005", type: "border_proximity", severity: "high", subject: "Fatima Al-Zadjali", location: "Muscat Airport — Terminal 1", detail: "High-risk subject within 200m of departure gate", timestamp: "2026-04-06 15:30", status: "acknowledged" },
  { id: "ga-006", type: "cluster_spike", severity: "medium", subject: "Multiple Subjects", location: "Ruwi Business District", detail: "Unusual clustering of 8 employment-flagged subjects", timestamp: "2026-04-06 09:15", status: "resolved" },
];

export const geointKpis = {
  activeSubjects: 47,
  hotspotCount: 12,
  crossStreamAlerts: 23,
  geofenceBreaches: 4,
  movementEventsToday: 1284,
  highRiskLocations: 3,
  correlationsDetected: 18,
  resolvedAlerts: 34,
};

export const streamColors: Record<string, string> = {
  "Borders": "#60A5FA",
  "Financial": "#4ADE80",
  "Hotel": "#D4A84B",
  "Marine": "#FB923C",
  "Customs": "#FACC15",
  "Employment": "#F9A8D4",
  "Mobile": "#38BDF8",
  "Healthcare": "#F87171",
  "Education": "#A78BFA",
  "Transport": "#FB923C",
  "E-Commerce": "#34D399",
  "Municipality": "#D4A84B",
  "Tourism": "#FACC15",
  "Postal": "#A78BFA",
  "Social": "#38BDF8",
  "Utility": "#FACC15",
};
