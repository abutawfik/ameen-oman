export interface FieldAlert {
  id: string;
  priority: "critical" | "high" | "medium" | "low";
  ruleName: string;
  ruleNameAr: string;
  personName: string;
  nationality: string;
  nationalityFlag: string;
  location: string;
  locationAr: string;
  distance: string;
  time: string;
  details: string;
  detailsAr: string;
  status: "new" | "en-route" | "on-scene" | "resolved" | "escalated";
  assignedOfficer: string;
  photo: string;
  docNumber: string;
  riskScore: number;
  enRouteAt?: string;
  onSceneAt?: string;
}

export interface NearbyLocation {
  id: string;
  name: string;
  nameAr: string;
  type: string;
  distance: string;
  alertLevel: "critical" | "high" | "medium" | "low";
  activeAlerts: number;
  lat: number;
  lng: number;
}

export interface FieldPerson {
  id: string;
  photo: string;
  nameEn: string;
  nameAr: string;
  docNumber: string;
  docType: string;
  nationality: string;
  nationalityFlag: string;
  dob: string;
  age: number;
  gender: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  status: "in-country" | "departed" | "unknown";
  lastLocation: string;
  lastSeen: string;
  recentEvents: FieldEvent[];
  patternAlerts: number;
}

export interface FieldEvent {
  stream: string;
  streamIcon: string;
  streamColor: string;
  datetime: string;
  description: string;
  location: string;
  isAlert: boolean;
}

export interface FieldReport {
  id: string;
  personId: string;
  personName: string;
  location: string;
  encounterType: string;
  outcome: string;
  narrative: string;
  submittedAt: string;
  status: "queued" | "submitted" | "acknowledged";
}

export const fieldAlerts: FieldAlert[] = [
  {
    id: "fa1",
    priority: "critical",
    ruleName: "Watchlist Match — Border Entry",
    ruleNameAr: "تطابق قائمة المراقبة — دخول الحدود",
    personName: "Khalid Mohammed Al-Rashidi",
    nationality: "Pakistani",
    nationalityFlag: "🇵🇰",
    location: "Al Khuwair, Capital City",
    locationAr: "الخوير، العاصمة",
    distance: "0.8 km",
    time: "3 min ago",
    details: "Subject matched active watchlist. Last seen at Al Khuwair residential area. Risk score 78. Multiple pattern alerts active.",
    detailsAr: "الشخص مطابق لقائمة المراقبة النشطة. آخر ظهور في منطقة الخوير السكنية. درجة المخاطرة 78.",
    status: "new",
    assignedOfficer: "Unassigned",
    photo: "https://readdy.ai/api/search-image?query=professional%20passport%20photo%20of%20a%20middle%20eastern%20man%20in%20his%2030s%2C%20neutral%20expression%2C%20white%20background%2C%20formal%20attire%2C%20high%20quality%20portrait%20photography&width=120&height=120&seq=field-p1&orientation=squarish",
    docNumber: "PK-8823401",
    riskScore: 78,
  },
  {
    id: "fa2",
    priority: "critical",
    ruleName: "Coordinated Entry — 5 Persons",
    ruleNameAr: "دخول منسق — 5 أشخاص",
    personName: "Group: EK-862 Passengers",
    nationality: "Multiple",
    nationalityFlag: "🌍",
    location: "Capital International Airport, T1",
    locationAr: "مطار العاصمة الدولي، T1",
    distance: "4.2 km",
    time: "7 min ago",
    details: "5 persons arrived on same flight with coordinated hotel bookings. Pattern score 94. Immediate interception recommended.",
    detailsAr: "5 أشخاص وصلوا بنفس الرحلة مع حجوزات فندقية منسقة. درجة النمط 94.",
    status: "en-route",
    assignedOfficer: "Officer Hassan",
    photo: "https://readdy.ai/api/search-image?query=airport%20terminal%20interior%20dark%20moody%20lighting%20security%20checkpoint%2C%20cinematic%20style&width=120&height=120&seq=field-p2&orientation=squarish",
    docNumber: "GROUP-EK862",
    riskScore: 94,
    enRouteAt: "14:18",
  },
  {
    id: "fa3",
    priority: "high",
    ruleName: "Multiple SIM + Large Cash",
    ruleNameAr: "شرائح متعددة + نقد كبير",
    personName: "Tariq Hussain",
    nationality: "Pakistani",
    nationalityFlag: "🇵🇰",
    location: "West District, Capital City",
    locationAr: "الحي الغربي، العاصمة",
    distance: "1.5 km",
    time: "15 min ago",
    details: "Subject purchased 3 SIM cards in 2 days and withdrew 2,500 cash. Shared IMEI with watchlist person.",
    detailsAr: "اشترى الشخص 3 شرائح في يومين وسحب 2,500 نقداً. IMEI مشترك مع شخص في قائمة المراقبة.",
    status: "new",
    assignedOfficer: "Unassigned",
    photo: "https://readdy.ai/api/search-image?query=professional%20passport%20photo%20of%20a%20south%20asian%20man%20in%20his%20late%2020s%2C%20neutral%20expression%2C%20white%20background%2C%20formal%20attire&width=120&height=120&seq=field-p3&orientation=squarish",
    docNumber: "PK-9934521",
    riskScore: 82,
  },
  {
    id: "fa4",
    priority: "high",
    ruleName: "Overstay — Visa Expired",
    ruleNameAr: "تجاوز — انتهاء التأشيرة",
    personName: "Ravi Kumar",
    nationality: "Indian",
    nationalityFlag: "🇮🇳",
    location: "East Industrial Area",
    locationAr: "المنطقة الصناعية الشرقية",
    distance: "6.1 km",
    time: "28 min ago",
    details: "Tourist visa expired 3 days ago. Last known location: East Industrial Area. Employment permit not found.",
    detailsAr: "انتهت تأشيرة السياحة منذ 3 أيام. آخر موقع معروف: المنطقة الصناعية الشرقية.",
    status: "on-scene",
    assignedOfficer: "Officer Khalid",
    photo: "https://readdy.ai/api/search-image?query=professional%20passport%20photo%20of%20an%20indian%20man%20in%20his%20late%2020s%2C%20neutral%20expression%2C%20white%20background%2C%20formal%20attire&width=120&height=120&seq=field-p4&orientation=squarish",
    docNumber: "IN-4523891",
    riskScore: 61,
    enRouteAt: "13:55",
    onSceneAt: "14:12",
  },
  {
    id: "fa5",
    priority: "medium",
    ruleName: "Same-Day Hotel Switch",
    ruleNameAr: "تغيير فندق في نفس اليوم",
    personName: "Ahmed Al-Farsi",
    nationality: "National",
    nationalityFlag: "🏳️",
    location: "Capital Hills, Capital City",
    locationAr: "تلال العاصمة، العاصمة",
    distance: "3.3 km",
    time: "45 min ago",
    details: "Checked out of Grand Hyatt and checked into Capital Hills Resort same day. Unusual for national citizen.",
    detailsAr: "غادر جراند حياة وسجّل دخوله في منتجع تلال العاصمة في نفس اليوم.",
    status: "resolved",
    assignedOfficer: "Officer Fatima",
    photo: "https://readdy.ai/api/search-image?query=professional%20passport%20photo%20of%20an%20omani%20man%20in%20his%2040s%2C%20neutral%20expression%2C%20white%20background%2C%20formal%20attire&width=120&height=120&seq=field-p5&orientation=squarish",
    docNumber: "OM-1234567",
    riskScore: 45,
    enRouteAt: "13:20",
    onSceneAt: "13:38",
  },
];

export const nearbyLocations: NearbyLocation[] = [
  { id: "nl1", name: "Al Khuwair Residential Block 7", nameAr: "الخوير — المجمع السكني 7", type: "Residential", distance: "0.8 km", alertLevel: "critical", activeAlerts: 2, lat: 23.5957, lng: 58.3932 },
  { id: "nl2", name: "West District Commercial Area", nameAr: "المنطقة التجارية — الحي الغربي", type: "Commercial", distance: "1.5 km", alertLevel: "high", activeAlerts: 1, lat: 23.5880, lng: 58.3850 },
  { id: "nl3", name: "Capital Hills Resort", nameAr: "منتجع تلال العاصمة", type: "Hotel", distance: "3.3 km", alertLevel: "medium", activeAlerts: 1, lat: 23.6100, lng: 58.4200 },
  { id: "nl4", name: "Capital International Airport T1", nameAr: "مطار العاصمة الدولي T1", type: "Border", distance: "4.2 km", alertLevel: "critical", activeAlerts: 3, lat: 23.5933, lng: 58.2844 },
  { id: "nl5", name: "East Industrial Area", nameAr: "المنطقة الصناعية الشرقية", type: "Industrial", distance: "6.1 km", alertLevel: "high", activeAlerts: 1, lat: 23.6667, lng: 58.1833 },
];

export const mockFieldPerson: FieldPerson = {
  id: "P-2025-00441",
  photo: "https://readdy.ai/api/search-image?query=professional%20passport%20photo%20of%20a%20middle%20eastern%20man%20in%20his%2030s%2C%20neutral%20expression%2C%20white%20background%2C%20formal%20attire%2C%20high%20quality%20portrait%20photography&width=160&height=160&seq=field-lookup-001&orientation=squarish",
  nameEn: "Khalid Mohammed Al-Rashidi",
  nameAr: "خالد محمد الراشدي",
  docNumber: "PK-8823401",
  docType: "Passport",
  nationality: "Pakistani",
  nationalityFlag: "🇵🇰",
  dob: "1991-03-15",
  age: 34,
  gender: "Male",
  riskScore: 78,
  riskLevel: "high",
  status: "in-country",
  lastLocation: "Al Khuwair, Capital City",
  lastSeen: "2025-04-05 14:22",
  patternAlerts: 5,
  recentEvents: [
    { stream: "Border",    streamIcon: "ri-passport-line",      streamColor: "#60A5FA", datetime: "2025-03-15 06:42", description: "Border Entry — Capital Airport T1",         location: "Capital Airport",    isAlert: false },
    { stream: "Hotel",     streamIcon: "ri-hotel-line",         streamColor: "#D6B47E", datetime: "2025-03-15 11:30", description: "Check-In — Grand Hyatt Capital",            location: "Coastal District",   isAlert: false },
    { stream: "Mobile",    streamIcon: "ri-sim-card-line",      streamColor: "#A78BFA", datetime: "2025-03-16 10:22", description: "2nd SIM Purchase — Second Telecom West",    location: "West District",      isAlert: true  },
    { stream: "Financial", streamIcon: "ri-bank-card-line",     streamColor: "#4ADE80", datetime: "2025-03-22 10:15", description: "2,500 Cash Withdrawal",                     location: "West District ATM",  isAlert: true  },
    { stream: "Hotel",     streamIcon: "ri-hotel-line",         streamColor: "#D6B47E", datetime: "2025-03-18 14:30", description: "Same-Day Hotel Switch — Capital Hills",     location: "Capital Hills",      isAlert: true  },
  ],
};

export const encounterTypes = [
  "Routine Check", "Watchlist Intercept", "Document Verification",
  "Suspicious Activity", "Overstay Enforcement", "Backup Response",
  "Patrol Observation", "Tip-off Follow-up",
];

export const outcomeTypes = [
  "No Action Required", "Warning Issued", "Document Seized",
  "Detained for Questioning", "Referred to Command", "Released — Cleared",
  "Arrested", "Escalated to Senior Officer",
];

export interface FieldOfficer {
  id: string;
  name: string;
  nameAr: string;
  badge: string;
  rank: string;
  sector: string;
  status: "on-duty" | "en-route" | "on-scene" | "off-duty";
  distance: string;
  lat: number;
  lng: number;
}

export interface WatchlistHit {
  listName: string;
  listNameAr: string;
  listType: "national_security" | "overstay" | "financial" | "employment" | "interpol" | "custom";
  addedDate: string;
  priority: "critical" | "high" | "medium";
}

export interface BiometricResult {
  type: "face" | "fingerprint" | "iris";
  confidence: number;
  matchedRecord: string;
  timestamp: string;
}

export const fieldOfficers: FieldOfficer[] = [
  { id: "off1", name: "Sgt. Hassan Al-Balushi", nameAr: "رقيب حسن البلوشي", badge: "NP-4421", rank: "Sergeant", sector: "Alpha", status: "on-duty", distance: "0.3 km", lat: 23.5970, lng: 58.3950 },
  { id: "off2", name: "Cpl. Fatima Al-Zadjali", nameAr: "عريف فاطمة الزدجالية", badge: "NP-3312", rank: "Corporal", sector: "Alpha", status: "en-route", distance: "1.1 km", lat: 23.5900, lng: 58.3880 },
  { id: "off3", name: "Sgt. Khalid Al-Amri", nameAr: "رقيب خالد العامري", badge: "NP-5567", rank: "Sergeant", sector: "Bravo", status: "on-scene", distance: "2.4 km", lat: 23.6050, lng: 58.4100 },
  { id: "off4", name: "Cpl. Omar Al-Farsi", nameAr: "عريف عمر الفارسي", badge: "NP-2234", rank: "Corporal", sector: "Bravo", status: "on-duty", distance: "3.8 km", lat: 23.6200, lng: 58.4300 },
];

export const mockWatchlistHits: WatchlistHit[] = [
  { listName: "National Security Watchlist", listNameAr: "قائمة الأمن الوطني", listType: "national_security", addedDate: "2024-08-12", priority: "critical" },
  { listName: "Interpol / International", listNameAr: "الإنتربول / الدولي", listType: "interpol", addedDate: "2023-09-14", priority: "critical" },
  { listName: "Operation Falcon — Custom", listNameAr: "عملية الصقر — مخصص", listType: "custom", addedDate: "2025-02-14", priority: "high" },
];

export const mockBiometricResults: BiometricResult[] = [
  { type: "face", confidence: 97.4, matchedRecord: "Border Entry DB — 2025-03-15", timestamp: "14:22:08" },
  { type: "fingerprint", confidence: 99.1, matchedRecord: "National ID Registry", timestamp: "14:22:15" },
];

export const currentOfficer = {
  name: "Officer Ahmed Al-Rashidi",
  nameAr: "الضابط أحمد الراشدي",
  badge: "NP-7891",
  rank: "Corporal",
  sector: "Alpha-3",
  shiftStart: "08:00",
  shiftEnd: "20:00",
  reportsToday: 3,
  alertsHandled: 2,
};
