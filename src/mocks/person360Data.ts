export interface Person360 {
  id: string;
  photo: string;
  nameEn: string;
  nameAr: string;
  docNumber: string;
  docType: string;
  nationality: string;
  nationalityCode: string;
  nationalityFlag: string;
  age: number;
  gender: string;
  dob: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  status: "in-country" | "departed" | "unknown";
  lastLocation: string;
  lastLocationCoords: { lat: number; lng: number };
  lastSeen: string;
  visaType: string;
  visaExpiry: string;
  entryPort: string;
  entryDate: string;
}

export interface StreamSummary {
  stream: string;
  icon: string;
  color: string;
  label: string;
  count: number;
  active: boolean;
  lastEvent: string;
}

export interface TimelineEvent {
  id: string;
  stream: string;
  streamIcon: string;
  streamColor: string;
  datetime: string;
  title: string;
  description: string;
  entity: string;
  location: string;
  isAlert: boolean;
  alertType?: string;
  alertSeverity?: "medium" | "high" | "critical";
  details: Record<string, string>;
}

export interface ConnectionNode {
  id: string;
  name: string;
  initials: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  nationality: string;
  relation: string;
  docNumber: string;
  x: number;
  y: number;
}

export interface ConnectionEdge {
  from: string;
  to: string;
  type: string;
  label: string;
  strength: "weak" | "medium" | "strong";
}

export interface SocialProfile {
  platform: string;
  icon: string;
  color: string;
  displayName: string;
  handle: string;
  profileUrl: string;
  followers: number;
  status: "active" | "suspended" | "private";
  lastActivity: string;
  flagged: boolean;
  flagReason?: string;
  recentPost?: string;
}

export interface TravelStop {
  seq: number;
  location: string;
  datetime: string;
  event: string;
  stream: string;
  streamColor: string;
  duration?: string;
  distance?: string;
}

export const mockPerson: Person360 = {
  id: "P-2026-00441",
  photo: "https://readdy.ai/api/search-image?query=professional%20passport%20photo%20of%20a%20south%20asian%20man%20in%20his%20early%2030s%2C%20neutral%20expression%2C%20plain%20light%20background%2C%20formal%20dark%20shirt%2C%20high%20quality%20portrait%20photography%2C%20sharp%20focus%2C%20studio%20lighting&width=200&height=200&seq=p360-photo-001&orientation=squarish",
  nameEn: "Khalid Mohammed Al-Rashidi",
  nameAr: "خالد محمد الراشدي",
  docNumber: "PK-8823401",
  docType: "Passport",
  nationality: "Pakistani",
  nationalityCode: "PK",
  nationalityFlag: "🇵🇰",
  age: 34,
  gender: "Male",
  dob: "1991-03-15",
  riskScore: 82,
  riskLevel: "critical",
  status: "in-country",
  lastLocation: "Al Khuwair, Capital City",
  lastLocationCoords: { lat: 23.5957, lng: 58.3932 },
  lastSeen: "2026-04-05 14:22",
  visaType: "Tourist",
  visaExpiry: "2026-04-14",
  entryPort: "Capital International Airport",
  entryDate: "2026-03-15",
};

export const mockStreamSummary: StreamSummary[] = [
  { stream: "border",       icon: "ri-passport-line",        color: "#60A5FA", label: "Arrived 15 Mar",    count: 3,  active: true,  lastEvent: "2026-03-15" },
  { stream: "hotel",        icon: "ri-hotel-line",           color: "#22D3EE", label: "3 stays",           count: 3,  active: true,  lastEvent: "2026-04-01" },
  { stream: "mobile",       icon: "ri-sim-card-line",        color: "#A78BFA", label: "2 SIM lines",       count: 2,  active: true,  lastEvent: "2026-03-16" },
  { stream: "car-rental",   icon: "ri-car-line",             color: "#FB923C", label: "1 rental",          count: 1,  active: true,  lastEvent: "2026-03-20" },
  { stream: "financial",    icon: "ri-bank-card-line",       color: "#4ADE80", label: "4 transactions",    count: 4,  active: true,  lastEvent: "2026-04-03" },
  { stream: "transport",    icon: "ri-bus-line",             color: "#FACC15", label: "6 trips",           count: 6,  active: true,  lastEvent: "2026-04-04" },
  { stream: "employment",   icon: "ri-briefcase-line",       color: "#F9A8D4", label: "1 permit",          count: 1,  active: true,  lastEvent: "2026-03-18" },
  { stream: "municipality", icon: "ri-government-line",      color: "#34D399", label: "1 lease",           count: 1,  active: true,  lastEvent: "2026-03-19" },
  { stream: "ecommerce",    icon: "ri-shopping-cart-line",   color: "#38BDF8", label: "2 purchases",       count: 2,  active: true,  lastEvent: "2026-04-02" },
  { stream: "social",       icon: "ri-global-line",          color: "#F87171", label: "3 profiles",        count: 3,  active: true,  lastEvent: "2026-04-05" },
  { stream: "marine",       icon: "ri-ship-line",            color: "#67E8F9", label: "1 boat rental",     count: 1,  active: true,  lastEvent: "2026-03-28" },
  { stream: "customs",      icon: "ri-box-3-line",           color: "#FCD34D", label: "2 shipments",       count: 2,  active: true,  lastEvent: "2026-03-30" },
  { stream: "utility",      icon: "ri-flashlight-line",      color: "#FACC15", label: "No activity",       count: 0,  active: false, lastEvent: "" },
  { stream: "health",       icon: "ri-heart-pulse-line",     color: "#F87171", label: "No activity",       count: 0,  active: false, lastEvent: "" },
  { stream: "education",    icon: "ri-graduation-cap-line",  color: "#A78BFA", label: "No activity",       count: 0,  active: false, lastEvent: "" },
];

export const mockTimeline: TimelineEvent[] = [
  {
    id: "t1",
    stream: "Border",
    streamIcon: "ri-passport-line",
    streamColor: "#60A5FA",
    datetime: "2026-03-15 06:42",
    title: "Border Entry — Capital International Airport",
    description: "Arrived on flight EK-862 from Dubai. Tourist visa, 30-day validity. Terminal 1.",
    entity: "Border Control System",
    location: "Capital International Airport, T1",
    isAlert: false,
    details: { "Flight": "EK-862", "Origin": "Dubai, UAE", "Visa Type": "Tourist", "Visa Validity": "30 days", "Port": "Capital Airport T1", "Officer": "BRD-OFF-441" },
  },
  {
    id: "t2",
    stream: "Mobile",
    streamIcon: "ri-sim-card-line",
    streamColor: "#A78BFA",
    datetime: "2026-03-15 09:15",
    title: "SIM Card Purchase — National Telecom Airport Branch",
    description: "Prepaid SIM purchased. IMEI: 358234091234567. Number: +968 9234 5678.",
    entity: "National Telecom",
    location: "Airport Branch",
    isAlert: false,
    details: { "SIM Type": "Prepaid", "IMEI": "358234091234567", "Number": "+968 9234 5678", "Plan": "Tourist 30-day", "Branch": "Airport" },
  },
  {
    id: "t3",
    stream: "Hotel",
    streamIcon: "ri-hotel-line",
    streamColor: "#22D3EE",
    datetime: "2026-03-15 11:30",
    title: "Hotel Check-In — Grand Hyatt Capital",
    description: "Checked into Room 412, 3-night booking. Paid by Visa card ending 4521.",
    entity: "Grand Hyatt Capital",
    location: "Coastal District, Capital City",
    isAlert: false,
    details: { "Room": "412", "Floor": "4", "Booking Ref": "HTL-2026-04441", "Nights": "3", "Payment": "Visa ****4521", "Rate": "85 OMR/night" },
  },
  {
    id: "t4",
    stream: "Mobile",
    streamIcon: "ri-sim-card-line",
    streamColor: "#A78BFA",
    datetime: "2026-03-16 10:22",
    title: "Second SIM Purchase — Second Telecom West District",
    description: "Second prepaid SIM purchased within 24h of first. Same IMEI device. Number: +968 9876 5432.",
    entity: "Second Telecom",
    location: "West District Branch, Capital City",
    isAlert: true,
    alertType: "Multiple SIM Acquisition",
    alertSeverity: "high",
    details: { "SIM Type": "Prepaid", "IMEI": "358234091234567", "Number": "+968 9876 5432", "Plan": "Prepaid Standard", "Note": "Same IMEI as SIM-1" },
  },
  {
    id: "t5",
    stream: "Hotel",
    streamIcon: "ri-hotel-line",
    streamColor: "#22D3EE",
    datetime: "2026-03-18 12:00",
    title: "Hotel Check-Out — Grand Hyatt Capital (Early)",
    description: "Early check-out after 3 nights. Original booking was for 5 nights. No reason given.",
    entity: "Grand Hyatt Capital",
    location: "Coastal District, Capital City",
    isAlert: false,
    details: { "Room": "412", "Nights Stayed": "3 of 5", "Check-Out Type": "Early", "Balance": "0.00 OMR" },
  },
  {
    id: "t6",
    stream: "Hotel",
    streamIcon: "ri-hotel-line",
    streamColor: "#22D3EE",
    datetime: "2026-03-18 14:30",
    title: "Hotel Check-In — Capital Hills Resort",
    description: "Same-day hotel switch. Checked in 2 hours after check-out from Grand Hyatt. Paid cash.",
    entity: "Capital Hills Resort",
    location: "Capital Hills, Capital City",
    isAlert: true,
    alertType: "Same-Day Hotel Switch",
    alertSeverity: "high",
    details: { "Room": "201", "Booking Ref": "HTL-2026-04889", "Nights": "4", "Payment": "Cash", "Rate": "65 OMR/night", "Note": "2nd hotel in 3 days" },
  },
  {
    id: "t7",
    stream: "Employment",
    streamIcon: "ri-briefcase-line",
    streamColor: "#F9A8D4",
    datetime: "2026-03-18 09:00",
    title: "Work Permit Issued — Ministry of Labour",
    description: "Work permit issued. Employer: Al-Rashidi Construction LLC. Sector: Construction. Tourist visa still active — conflict.",
    entity: "Ministry of Labour",
    location: "Capital City",
    isAlert: true,
    alertType: "Visa Type Conflict — Tourist + Work Permit",
    alertSeverity: "high",
    details: { "Permit No": "WP-2026-88234", "Employer": "Al-Rashidi Construction LLC", "Sector": "Construction", "Duration": "2 years", "Expiry": "2028-03-17", "Visa Status": "Tourist (active)" },
  },
  {
    id: "t8",
    stream: "Municipality",
    streamIcon: "ri-government-line",
    streamColor: "#34D399",
    datetime: "2026-03-19 14:30",
    title: "Residential Lease — Al Khuwair",
    description: "Lease registered for Apartment 3B, Al Khuwair. Monthly rent 180 OMR. 12-month contract.",
    entity: "Capital Municipality",
    location: "Al Khuwair, Capital City",
    isAlert: false,
    details: { "Unit": "Apt 3B", "Area": "Al Khuwair", "Rent": "180 OMR/month", "Duration": "12 months", "Landlord": "Al-Amri Properties LLC" },
  },
  {
    id: "t9",
    stream: "Car Rental",
    streamIcon: "ri-car-line",
    streamColor: "#FB923C",
    datetime: "2026-03-20 08:45",
    title: "Vehicle Pickup — Toyota Hilux (NAT-44521)",
    description: "Rented Toyota Hilux for 7 days. No hotel registered during rental period — unregistered stay pattern.",
    entity: "National Car Rental Co.",
    location: "Capital Airport Branch",
    isAlert: true,
    alertType: "Vehicle Rental Without Hotel",
    alertSeverity: "medium",
    details: { "Vehicle": "Toyota Hilux", "Plate": "NAT-44521", "Duration": "7 days", "Return Date": "2026-03-27", "Driver License": "PK-DL-8823401", "Deposit": "200 OMR" },
  },
  {
    id: "t10",
    stream: "Financial",
    streamIcon: "ri-bank-card-line",
    streamColor: "#4ADE80",
    datetime: "2026-03-22 10:15",
    title: "Large Cash Withdrawal — National Bank ATM",
    description: "2,500 OMR cash withdrawal within 7 days of arrival. Exceeds tourist profile threshold.",
    entity: "National Bank",
    location: "West District Branch ATM, Capital City",
    isAlert: true,
    alertType: "Large Cash Near Arrival",
    alertSeverity: "critical",
    details: { "Amount": "2,500 OMR", "Type": "ATM Withdrawal", "Card": "Visa ****4521", "ATM": "West District Branch", "Balance After": "4,200 OMR", "Days Since Arrival": "7" },
  },
  {
    id: "t11",
    stream: "Transport",
    streamIcon: "ri-bus-line",
    streamColor: "#FACC15",
    datetime: "2026-03-25 07:30",
    title: "Bus Journey — Capital to Northern City",
    description: "Long-distance bus trip. Route: Capital → Northern City. Duration: 2.5 hours.",
    entity: "National Transport Authority",
    location: "Capital Bus Station",
    isAlert: false,
    details: { "Route": "Capital → Northern City", "Bus": "BUS-441", "Duration": "2.5 hrs", "Ticket": "TKT-2026-88234", "Seat": "14A" },
  },
  {
    id: "t12",
    stream: "Financial",
    streamIcon: "ri-bank-card-line",
    streamColor: "#4ADE80",
    datetime: "2026-03-26 15:45",
    title: "Currency Exchange — USD 5,000 to Local",
    description: "Exchanged USD 5,000 to local currency at National Exchange. Third financial transaction this week.",
    entity: "National Exchange",
    location: "Northern City",
    isAlert: false,
    details: { "From": "USD 5,000", "To": "OMR 1,925", "Rate": "0.385", "Exchange House": "National Exchange", "Ref": "EX-2026-44521" },
  },
  {
    id: "t13",
    stream: "Marine",
    streamIcon: "ri-ship-line",
    streamColor: "#67E8F9",
    datetime: "2026-03-28 09:00",
    title: "Boat Rental — Al Mouj Marina",
    description: "Speedboat rented for 6 hours. No hotel registered. Recent arrival pattern. 3 unregistered passengers.",
    entity: "Al Mouj Marina",
    location: "Al Mouj Marina, Capital City",
    isAlert: true,
    alertType: "Maritime Risk — Unregistered Passengers",
    alertSeverity: "critical",
    details: { "Vessel": "Speedboat SB-441", "Duration": "6 hours", "Passengers": "3 (unregistered)", "Route": "Coastal waters", "Return": "2026-03-28 15:00", "Deposit": "150 OMR" },
  },
  {
    id: "t14",
    stream: "Customs",
    streamIcon: "ri-box-3-line",
    streamColor: "#FCD34D",
    datetime: "2026-03-30 11:00",
    title: "Cargo Clearance — Seeb Port",
    description: "Cargo shipment cleared. Declared value 1,200 OMR. Estimated market value 3,800 OMR — 68% variance.",
    entity: "Royal Oman Customs",
    location: "Seeb Port, Capital City",
    isAlert: true,
    alertType: "Invoice Manipulation — Value Variance 68%",
    alertSeverity: "critical",
    details: { "Cargo Ref": "CST-2026-44521", "Declared Value": "1,200 OMR", "Market Value": "3,800 OMR", "Variance": "68%", "HS Code": "8471.30", "Origin": "Pakistan", "Consignee": "Al-Rashidi Trading" },
  },
  {
    id: "t15",
    stream: "Hotel",
    streamIcon: "ri-hotel-line",
    streamColor: "#22D3EE",
    datetime: "2026-04-01 15:00",
    title: "Hotel Check-In — Al Falaj Hotel",
    description: "Third hotel in 17 days. Paid cash. Pattern: hotel hopping with cash payments.",
    entity: "Al Falaj Hotel",
    location: "City Center, Capital City",
    isAlert: false,
    details: { "Room": "305", "Booking Ref": "HTL-2026-05001", "Nights": "5", "Payment": "Cash", "Rate": "45 OMR/night", "Note": "3rd hotel, all cash" },
  },
  {
    id: "t16",
    stream: "E-Commerce",
    streamIcon: "ri-shopping-cart-line",
    streamColor: "#38BDF8",
    datetime: "2026-04-02 11:30",
    title: "Online Purchase — 2x Prepaid Mobile Phones",
    description: "Purchased 2 prepaid mobile phones. Delivery to hotel. Pattern: SIM swapping + new devices.",
    entity: "TechNational",
    location: "Online → Al Falaj Hotel",
    isAlert: false,
    details: { "Items": "2x Prepaid Mobile Phones", "Amount": "234.500 OMR", "Merchant": "TechNational", "Order": "ORD-2026-77234", "Delivery": "Al Falaj Hotel, Room 305" },
  },
  {
    id: "t17",
    stream: "Financial",
    streamIcon: "ri-bank-card-line",
    streamColor: "#4ADE80",
    datetime: "2026-04-03 09:00",
    title: "Wire Transfer — 3,200 OMR to Pakistan",
    description: "International wire transfer to Pakistan. Recipient shares same surname. Possible hawala network.",
    entity: "National Bank",
    location: "City Center Branch, Capital City",
    isAlert: true,
    alertType: "Suspicious International Transfer",
    alertSeverity: "high",
    details: { "Amount": "3,200 OMR", "Destination": "Pakistan", "Recipient": "Mohammed Al-Rashidi", "Bank": "HBL Pakistan", "Ref": "WT-2026-88234", "Note": "Same surname as subject" },
  },
  {
    id: "t18",
    stream: "Mobile",
    streamIcon: "ri-sim-card-line",
    streamColor: "#A78BFA",
    datetime: "2026-04-04 08:00",
    title: "IMEI Shared with Flagged Person",
    description: "Device IMEI 358234091234567 detected on network registered to Tariq Hussain (Risk Score: 82, flagged). Same device used by two persons.",
    entity: "National Telecom Intelligence",
    location: "Capital City",
    isAlert: true,
    alertType: "IMEI Shared with Flagged Person",
    alertSeverity: "critical",
    details: { "IMEI": "358234091234567", "Other Person": "Tariq Hussain", "Other Doc": "PK-9934521", "Other Risk": "82 — FLAGGED", "Detection": "Network Analysis", "Date": "2026-04-04" },
  },
  {
    id: "t19",
    stream: "Social",
    streamIcon: "ri-global-line",
    streamColor: "#F87171",
    datetime: "2026-04-05 08:30",
    title: "Social Media — Flagged Post Detected",
    description: "Public post on Twitter/X flagged by keyword monitoring. Level 2 alert. Content under review.",
    entity: "Digital Intelligence Unit",
    location: "Online",
    isAlert: true,
    alertType: "Flagged Social Media Content",
    alertSeverity: "medium",
    details: { "Platform": "Twitter/X", "Account": "@k_rashidi_91", "Post Type": "Public", "Alert Level": "2", "Keywords": "[REDACTED]", "Status": "Under Review", "Followers": "234" },
  },
];

export const mockConnections: ConnectionNode[] = [
  { id: "main", name: "Khalid Al-Rashidi",  initials: "KR", riskScore: 82, riskLevel: "critical", nationality: "PK", relation: "Subject",          docNumber: "PK-8823401", x: 50, y: 50 },
  { id: "c1",   name: "Ahmed Al-Farsi",     initials: "AF", riskScore: 45, riskLevel: "medium",   nationality: "OM", relation: "Co-Guest",          docNumber: "OM-1234567", x: 20, y: 25 },
  { id: "c2",   name: "Tariq Hussain",      initials: "TH", riskScore: 82, riskLevel: "critical", nationality: "PK", relation: "Shared IMEI",       docNumber: "PK-9934521", x: 75, y: 20 },
  { id: "c3",   name: "Fatima Al-Zadjali",  initials: "FZ", riskScore: 12, riskLevel: "low",      nationality: "OM", relation: "Co-Tenant",         docNumber: "OM-7654321", x: 80, y: 70 },
  { id: "c4",   name: "Ravi Kumar",         initials: "RK", riskScore: 61, riskLevel: "high",     nationality: "IN", relation: "Co-Driver",         docNumber: "IN-4523891", x: 25, y: 75 },
  { id: "c5",   name: "Mohammed Al-Balushi",initials: "MB", riskScore: 34, riskLevel: "low",      nationality: "OM", relation: "Same Employer",     docNumber: "OM-3344521", x: 50, y: 15 },
  { id: "c6",   name: "Saeed Al-Harthi",    initials: "SH", riskScore: 55, riskLevel: "medium",   nationality: "OM", relation: "Same Booking Org",  docNumber: "OM-8812345", x: 15, y: 55 },
  { id: "c7",   name: "Yusuf Al-Siyabi",    initials: "YS", riskScore: 71, riskLevel: "high",     nationality: "OM", relation: "Boat Passenger",    docNumber: "OM-5512890", x: 65, y: 80 },
];

export const mockEdges: ConnectionEdge[] = [
  { from: "main", to: "c1", type: "co-guest",        label: "Co-Guest (Grand Hyatt)",           strength: "strong" },
  { from: "main", to: "c2", type: "shared-imei",     label: "Shared IMEI Device",               strength: "strong" },
  { from: "main", to: "c3", type: "co-tenant",       label: "Co-Tenant (Al Khuwair)",           strength: "medium" },
  { from: "main", to: "c4", type: "co-driver",       label: "Co-Driver (Toyota Hilux)",         strength: "medium" },
  { from: "main", to: "c5", type: "same-employer",   label: "Same Employer (Al-Rashidi Const)", strength: "weak" },
  { from: "main", to: "c6", type: "same-booking",    label: "Same Booking Organization",        strength: "weak" },
  { from: "main", to: "c7", type: "boat-passenger",  label: "Boat Passenger (Al Mouj Marina)",  strength: "strong" },
  { from: "c2",   to: "c4", type: "co-guest",        label: "Co-Guest (Capital Hills)",         strength: "medium" },
  { from: "c7",   to: "c2", type: "same-employer",   label: "Same Employer",                    strength: "weak" },
];

export const mockSocialProfiles: SocialProfile[] = [
  {
    platform: "Twitter/X",  icon: "ri-twitter-x-line", color: "#E7E9EA",
    displayName: "Khalid Rashidi", handle: "@k_rashidi_91", profileUrl: "#",
    followers: 234, status: "active", lastActivity: "2026-04-05", flagged: true,
    flagReason: "Keyword match: restricted terms in public post",
    recentPost: "Post content flagged by automated monitoring — Level 2 alert. Under review by Digital Intelligence Unit.",
  },
  {
    platform: "Facebook",   icon: "ri-facebook-line",  color: "#1877F2",
    displayName: "Khalid M. Rashidi", handle: "khalid.rashidi.91", profileUrl: "#",
    followers: 891, status: "active", lastActivity: "2026-04-03", flagged: false,
  },
  {
    platform: "WhatsApp",   icon: "ri-whatsapp-line",  color: "#25D366",
    displayName: "+968 9234 5678", handle: "+968 9234 5678", profileUrl: "#",
    followers: 0, status: "active", lastActivity: "2026-04-05", flagged: false,
  },
  {
    platform: "Instagram",  icon: "ri-instagram-line", color: "#E1306C",
    displayName: "k.rashidi", handle: "@k.rashidi", profileUrl: "#",
    followers: 1203, status: "private", lastActivity: "2026-03-28", flagged: false,
  },
  {
    platform: "Telegram",   icon: "ri-telegram-line",  color: "#0088CC",
    displayName: "KR_Official", handle: "@KR_Official", profileUrl: "#",
    followers: 445, status: "active", lastActivity: "2026-04-04", flagged: true,
    flagReason: "Account linked to monitored group channel",
    recentPost: "Active in monitored group. 47 messages in last 7 days. Group has 1,200 members.",
  },
];

export const mockTravelStops: TravelStop[] = [
  { seq: 1, location: "Capital International Airport",        datetime: "2026-03-15 06:42", event: "Border Entry",     stream: "Border",     streamColor: "#60A5FA" },
  { seq: 2, location: "Grand Hyatt Capital, Coastal District",datetime: "2026-03-15 11:30", event: "Hotel Check-In",   stream: "Hotel",      streamColor: "#22D3EE", duration: "3 days",  distance: "12 km" },
  { seq: 3, location: "Capital Hills Resort",                 datetime: "2026-03-18 14:30", event: "Hotel Switch",     stream: "Hotel",      streamColor: "#22D3EE", duration: "2 days",  distance: "8 km" },
  { seq: 4, location: "Capital Airport Branch",               datetime: "2026-03-20 08:45", event: "Vehicle Pickup",   stream: "Car Rental", streamColor: "#FB923C", duration: "7 days",  distance: "15 km" },
  { seq: 5, location: "Northern City",                        datetime: "2026-03-25 07:30", event: "Bus Journey",      stream: "Transport",  streamColor: "#FACC15", duration: "1 day",   distance: "220 km" },
  { seq: 6, location: "Al Mouj Marina, Capital City",         datetime: "2026-03-28 09:00", event: "Boat Rental",      stream: "Marine",     streamColor: "#67E8F9", duration: "6 hrs",   distance: "18 km" },
  { seq: 7, location: "Seeb Port, Capital City",              datetime: "2026-03-30 11:00", event: "Cargo Clearance",  stream: "Customs",    streamColor: "#FCD34D", duration: "—",       distance: "5 km" },
  { seq: 8, location: "Al Falaj Hotel, City Center",          datetime: "2026-04-01 15:00", event: "Hotel Check-In",   stream: "Hotel",      streamColor: "#22D3EE", duration: "4 days",  distance: "2 km" },
  { seq: 9, location: "East Industrial Area",                 datetime: "2026-04-04 16:00", event: "Taxi Journey",     stream: "Transport",  streamColor: "#FACC15", duration: "—",       distance: "22 km" },
];
