export interface StreamConfig {
  id: string;
  category: string;
  name: string;
  code: string;
  status: "active" | "disabled";
  entityCount: number;
  eventsToday: number;
  requiredFields: string[];
  validationRules: number;
  icon: string;
  color: string;
}

export interface ValidationRule {
  id: string;
  name: string;
  stream: string;
  field: string;
  operator: string;
  value: string;
  action: "reject" | "flag" | "accept_warn" | "auto_correct";
  enabled: boolean;
  triggeredToday: number;
  lastTriggered: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  target: string;
  ip: string;
  result: "success" | "failure" | "warning";
  details: string;
}

export interface IncidentEntry {
  id: string;
  timestamp: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  status: "open" | "resolved" | "investigating";
  duration: string;
}

export interface PatternRule {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  triggeredTotal: number;
  triggeredToday: number;
  falsePositiveRate: number;
  precision: number;
  recall: number;
  lastTriggered: string;
  severity: "critical" | "high" | "medium" | "low";
  conditions: string;
}

export const streams: StreamConfig[] = [
  {
    id: "hotel",
    category: "Hospitality",
    name: "Hotel & Accommodation",
    code: "AMN-HTL",
    status: "active",
    entityCount: 847,
    eventsToday: 3412,
    requiredFields: ["guestName", "documentNumber", "nationality", "checkInDate", "checkOutDate", "roomNumber"],
    validationRules: 12,
    icon: "ri-hotel-line",
    color: "#22D3EE",
  },
  {
    id: "car-rental",
    category: "Transport",
    name: "Car Rental",
    code: "AMN-CAR",
    status: "active",
    entityCount: 234,
    eventsToday: 1891,
    requiredFields: ["driverName", "documentNumber", "vehiclePlate", "pickupDate", "returnDate"],
    validationRules: 9,
    icon: "ri-car-line",
    color: "#22D3EE",
  },
  {
    id: "mobile",
    category: "Telecom",
    name: "Mobile Operators",
    code: "AMN-MOB",
    status: "active",
    entityCount: 12,
    eventsToday: 8234,
    requiredFields: ["subscriberName", "documentNumber", "imei", "simSerial", "activationDate"],
    validationRules: 15,
    icon: "ri-sim-card-line",
    color: "#22D3EE",
  },
  {
    id: "municipality",
    category: "Government",
    name: "Municipality Registry",
    code: "AMN-MUN",
    status: "active",
    entityCount: 58,
    eventsToday: 2341,
    requiredFields: ["tenantName", "documentNumber", "propertyId", "leaseStartDate", "leaseEndDate"],
    validationRules: 8,
    icon: "ri-government-line",
    color: "#22D3EE",
  },
  {
    id: "financial",
    category: "Finance",
    name: "Financial Services",
    code: "AMN-FIN",
    status: "active",
    entityCount: 34,
    eventsToday: 24891,
    requiredFields: ["accountHolder", "documentNumber", "transactionType", "amount", "currency"],
    validationRules: 18,
    icon: "ri-bank-card-line",
    color: "#4ADE80",
  },
  {
    id: "borders",
    category: "Government",
    name: "Borders & Immigration",
    code: "AMN-BRD",
    status: "active",
    entityCount: 28,
    eventsToday: 16303,
    requiredFields: ["passportNumber", "nationality", "entryPoint", "visaType", "entryDate"],
    validationRules: 22,
    icon: "ri-passport-line",
    color: "#60A5FA",
  },
  {
    id: "utility",
    category: "Infrastructure",
    name: "Utility Activation",
    code: "AMN-UTL",
    status: "active",
    entityCount: 6,
    eventsToday: 713,
    requiredFields: ["subscriberName", "documentNumber", "propertyAddress", "serviceType", "connectionDate"],
    validationRules: 7,
    icon: "ri-flashlight-line",
    color: "#FACC15",
  },
  {
    id: "transport",
    category: "Transport",
    name: "Public Transport",
    code: "AMN-TRN",
    status: "active",
    entityCount: 4,
    eventsToday: 51125,
    requiredFields: ["passengerId", "routeCode", "boardingPoint", "alightingPoint", "timestamp"],
    validationRules: 6,
    icon: "ri-bus-line",
    color: "#FB923C",
  },
  {
    id: "employment",
    category: "Government",
    name: "Employment Registry",
    code: "AMN-EMP",
    status: "active",
    entityCount: 1203,
    eventsToday: 7234,
    requiredFields: ["workerName", "documentNumber", "employerCR", "permitNumber", "sector"],
    validationRules: 11,
    icon: "ri-briefcase-line",
    color: "#F9A8D4",
  },
  {
    id: "ecommerce",
    category: "Commerce",
    name: "E-Commerce & Retail",
    code: "AMN-ECM",
    status: "active",
    entityCount: 2891,
    eventsToday: 18234,
    requiredFields: ["buyerName", "documentNumber", "merchantId", "transactionId", "amount"],
    validationRules: 10,
    icon: "ri-shopping-cart-line",
    color: "#34D399",
  },
  {
    id: "social",
    category: "Intelligence",
    name: "Social Media Intelligence",
    code: "AMN-SOC",
    status: "active",
    entityCount: 0,
    eventsToday: 21341,
    requiredFields: ["platform", "accountId", "phoneNumber", "linkedDocument"],
    validationRules: 5,
    icon: "ri-global-line",
    color: "#38BDF8",
  },
  {
    id: "health",
    category: "Healthcare",
    name: "Health Interactions",
    code: "AMN-HLT",
    status: "disabled",
    entityCount: 89,
    eventsToday: 0,
    requiredFields: ["patientName", "documentNumber", "facilityCode", "visitType", "visitDate"],
    validationRules: 9,
    icon: "ri-heart-pulse-line",
    color: "#F87171",
  },
  {
    id: "education",
    category: "Education",
    name: "Educational Enrollment",
    code: "AMN-EDU",
    status: "disabled",
    entityCount: 47,
    eventsToday: 0,
    requiredFields: ["studentName", "documentNumber", "institutionCode", "programCode", "enrollmentDate"],
    validationRules: 7,
    icon: "ri-graduation-cap-line",
    color: "#A78BFA",
  },
  {
    id: "customs",
    category: "Customs",
    name: "Customs & Cargo",
    code: "AMN-CUS",
    status: "active",
    entityCount: 18,
    eventsToday: 4312,
    requiredFields: ["declarantName", "documentNumber", "cargoRef", "declarationType", "declarationDate"],
    validationRules: 14,
    icon: "ri-ship-line",
    color: "#FCD34D",
  },
  {
    id: "marine",
    category: "Maritime",
    name: "Marine & Boat Rental",
    code: "AMN-MAR",
    status: "active",
    entityCount: 142,
    eventsToday: 876,
    requiredFields: ["operatorName", "documentNumber", "vesselId", "departurePoint", "departureDate", "passengerCount"],
    validationRules: 8,
    icon: "ri-sailboat-line",
    color: "#38BDF8",
  },
  {
    id: "postal",
    category: "Postal",
    name: "Postal & Courier",
    code: "AMN-PST",
    status: "active",
    entityCount: 67,
    eventsToday: 2134,
    requiredFields: ["senderName", "documentNumber", "recipientName", "poBoxNumber", "packageRef"],
    validationRules: 6,
    icon: "ri-mail-send-line",
    color: "#FB923C",
  },
  {
    id: "tourism",
    category: "Tourism",
    name: "Tourism & Attractions",
    code: "AMN-TOR",
    status: "active",
    entityCount: 312,
    eventsToday: 5621,
    requiredFields: ["visitorName", "documentNumber", "attractionCode", "bookingRef", "visitDate"],
    validationRules: 5,
    icon: "ri-map-pin-line",
    color: "#4ADE80",
  },
];

export const validationRules: ValidationRule[] = [
  { id: "vr1",  name: "Document Number Format",       stream: "AMN-HTL", field: "documentNumber",  operator: "regex",        value: "^[A-Z]{1,2}[0-9]{6,9}$",  action: "reject",       enabled: true,  triggeredToday: 23,  lastTriggered: "2 min ago" },
  { id: "vr2",  name: "Nationality Code ISO",         stream: "AMN-HTL", field: "nationality",     operator: "in_list",      value: "ISO 3166-1 alpha-3",        action: "reject",       enabled: true,  triggeredToday: 4,   lastTriggered: "18 min ago" },
  { id: "vr3",  name: "Check-Out After Check-In",     stream: "AMN-HTL", field: "checkOutDate",    operator: "greater_than", value: "checkInDate",               action: "reject",       enabled: true,  triggeredToday: 7,   lastTriggered: "34 min ago" },
  { id: "vr4",  name: "Large Cash Threshold",         stream: "AMN-FIN", field: "amount",          operator: "greater_than", value: "10000",                     action: "flag",         enabled: true,  triggeredToday: 18,  lastTriggered: "5 min ago" },
  { id: "vr5",  name: "Wire Transfer Country Risk",   stream: "AMN-FIN", field: "destinationCountry", operator: "in_list",  value: "High-Risk Countries List",  action: "flag",         enabled: true,  triggeredToday: 3,   lastTriggered: "41 min ago" },
  { id: "vr6",  name: "IMEI Format Validation",       stream: "AMN-MOB", field: "imei",            operator: "regex",        value: "^[0-9]{15}$",               action: "reject",       enabled: true,  triggeredToday: 11,  lastTriggered: "9 min ago" },
  { id: "vr7",  name: "SIM Limit Per Document",       stream: "AMN-MOB", field: "documentNumber",  operator: "greater_than", value: "3 active SIMs",             action: "flag",         enabled: true,  triggeredToday: 6,   lastTriggered: "22 min ago" },
  { id: "vr8",  name: "Visa Expiry Check",            stream: "AMN-BRD", field: "visaExpiryDate",  operator: "greater_than", value: "entryDate",                 action: "reject",       enabled: true,  triggeredToday: 29,  lastTriggered: "1 min ago" },
  { id: "vr9",  name: "Passport Blacklist Check",     stream: "AMN-BRD", field: "passportNumber",  operator: "in_list",      value: "Watchlist Database",        action: "flag",         enabled: true,  triggeredToday: 2,   lastTriggered: "1.2 hr ago" },
  { id: "vr10", name: "Vehicle Plate Format",         stream: "AMN-CAR", field: "vehiclePlate",    operator: "regex",        value: "^[A-Z]{2}[0-9]{4,6}$",     action: "auto_correct", enabled: true,  triggeredToday: 14,  lastTriggered: "7 min ago" },
  { id: "vr11", name: "Rental Duration Max",          stream: "AMN-CAR", field: "rentalDays",      operator: "less_than",    value: "365",                       action: "accept_warn",  enabled: true,  triggeredToday: 1,   lastTriggered: "3.1 hr ago" },
  { id: "vr12", name: "Employment Sector Code",       stream: "AMN-EMP", field: "sector",          operator: "in_list",      value: "Approved Sector Codes",     action: "reject",       enabled: false, triggeredToday: 0,   lastTriggered: "2 days ago" },
  { id: "vr13", name: "High-Value E-Commerce",        stream: "AMN-ECM", field: "amount",          operator: "greater_than", value: "5000",                      action: "flag",         enabled: true,  triggeredToday: 9,   lastTriggered: "14 min ago" },
  { id: "vr14", name: "Phone Number Format",          stream: "AMN-MOB", field: "phoneNumber",     operator: "regex",        value: "^\\+[0-9]{7,15}$",          action: "auto_correct", enabled: true,  triggeredToday: 31,  lastTriggered: "3 min ago" },
  { id: "vr15", name: "Cargo Manifest Required",      stream: "AMN-CUS", field: "cargoRef",        operator: "regex",        value: "^CST-[A-Z0-9]{6,12}$",      action: "reject",       enabled: true,  triggeredToday: 8,   lastTriggered: "11 min ago" },
  { id: "vr16", name: "Vessel Registration Check",   stream: "AMN-MAR", field: "vesselId",        operator: "regex",        value: "^VES-[A-Z0-9]{4,10}$",      action: "reject",       enabled: true,  triggeredToday: 3,   lastTriggered: "28 min ago" },
  { id: "vr17", name: "Marine Passenger Capacity",   stream: "AMN-MAR", field: "passengerCount",  operator: "less_than",    value: "vesselMaxCapacity",          action: "reject",       enabled: true,  triggeredToday: 1,   lastTriggered: "2.1 hr ago" },
  { id: "vr18", name: "PO Box Format Validation",    stream: "AMN-PST", field: "poBoxNumber",     operator: "regex",        value: "^[0-9]{3,6}$",              action: "auto_correct", enabled: true,  triggeredToday: 12,  lastTriggered: "6 min ago" },
  { id: "vr19", name: "Tourism Attraction Code",     stream: "AMN-TOR", field: "attractionCode",  operator: "in_list",      value: "Licensed Attractions List",  action: "reject",       enabled: true,  triggeredToday: 5,   lastTriggered: "17 min ago" },
];

export const auditEntries: AuditEntry[] = [
  { id: "a1",  timestamp: "2025-04-05 09:41:22", user: "admin.khalid",    role: "System Admin",    action: "CONFIG_UPDATE",      target: "Session Timeout",          ip: "10.0.1.45",   result: "success", details: "Changed session timeout from 30min to 45min" },
  { id: "a2",  timestamp: "2025-04-05 09:38:11", user: "analyst.fatima",  role: "Senior Analyst",  action: "RULE_ENABLED",       target: "VR-007 SIM Limit",         ip: "10.0.1.67",   result: "success", details: "Enabled validation rule: SIM Limit Per Document" },
  { id: "a3",  timestamp: "2025-04-05 09:31:05", user: "admin.khalid",    role: "System Admin",    action: "STREAM_DISABLED",    target: "AMN-EDU",                  ip: "10.0.1.45",   result: "success", details: "Disabled Education stream — maintenance window" },
  { id: "a4",  timestamp: "2025-04-05 09:22:44", user: "analyst.ahmed",   role: "Analyst",         action: "DATA_EXPORT",        target: "Hotel Events — March 2025",ip: "10.0.2.12",   result: "success", details: "Exported 45,234 records — CSV format" },
  { id: "a5",  timestamp: "2025-04-05 09:15:33", user: "admin.sara",      role: "System Admin",    action: "USER_CREATED",       target: "analyst.new_user",         ip: "10.0.1.89",   result: "success", details: "New analyst account created — Capital branch" },
  { id: "a6",  timestamp: "2025-04-05 09:08:17", user: "unknown",         role: "—",               action: "LOGIN_FAILED",       target: "admin.khalid",             ip: "185.220.101.3",result: "failure", details: "3 failed login attempts — IP blocked" },
  { id: "a7",  timestamp: "2025-04-05 08:55:02", user: "admin.khalid",    role: "System Admin",    action: "RULE_MODIFIED",      target: "VR-004 Large Cash",        ip: "10.0.1.45",   result: "success", details: "Threshold changed from 5000 to 10000" },
  { id: "a8",  timestamp: "2025-04-05 08:44:19", user: "analyst.fatima",  role: "Senior Analyst",  action: "PURGE_APPROVED",     target: "Health Events — 2017",     ip: "10.0.1.67",   result: "warning", details: "Data purge approved — awaiting second approval" },
  { id: "a9",  timestamp: "2025-04-05 08:33:55", user: "admin.sara",      role: "System Admin",    action: "API_KEY_ROTATED",    target: "VIS-A Integration",        ip: "10.0.1.89",   result: "success", details: "API key rotated — 90-day cycle" },
  { id: "a10", timestamp: "2025-04-05 08:21:08", user: "analyst.ahmed",   role: "Analyst",         action: "PERSON_LOOKUP",      target: "P-2025-00441",             ip: "10.0.2.12",   result: "success", details: "Person 360 profile accessed — case investigation" },
  { id: "a11", timestamp: "2025-04-05 08:12:34", user: "admin.khalid",    role: "System Admin",    action: "RETENTION_UPDATED",  target: "Financial Stream",         ip: "10.0.1.45",   result: "success", details: "Retention period updated to 10 years" },
  { id: "a12", timestamp: "2025-04-05 07:58:22", user: "system",          role: "Automated",       action: "BACKUP_COMPLETED",   target: "Full System Backup",       ip: "10.0.0.1",    result: "success", details: "Nightly backup completed — 2.4TB" },
  { id: "a13", timestamp: "2025-04-05 07:45:11", user: "analyst.fatima",  role: "Senior Analyst",  action: "ALERT_ACKNOWLEDGED", target: "CRIT-2025-0441",           ip: "10.0.1.67",   result: "success", details: "Critical alert acknowledged — assigned to field team" },
  { id: "a14", timestamp: "2025-04-05 07:31:44", user: "admin.sara",      role: "System Admin",    action: "CONFIG_UPDATE",      target: "SMTP Gateway",             ip: "10.0.1.89",   result: "success", details: "SMTP server updated — new relay host" },
  { id: "a15", timestamp: "2025-04-05 07:18:09", user: "system",          role: "Automated",       action: "REPLICATION_ALERT",  target: "VIS-B",                    ip: "10.0.0.1",    result: "warning", details: "Replication lag exceeded 5min threshold — auto-resolved" },
];

export const incidents: IncidentEntry[] = [
  { id: "i1", timestamp: "2025-04-05 06:12:00", severity: "high",     title: "VIS-B Replication Lag — 8.3 min",            status: "resolved",      duration: "23 min" },
  { id: "i2", timestamp: "2025-04-04 22:45:00", severity: "medium",   title: "API Gateway Elevated Latency — p99 > 2s",     status: "resolved",      duration: "41 min" },
  { id: "i3", timestamp: "2025-04-04 14:30:00", severity: "critical", title: "Financial Stream Queue Depth Spike — 12,400", status: "resolved",      duration: "8 min" },
  { id: "i4", timestamp: "2025-04-03 09:15:00", severity: "low",      title: "Scheduled Maintenance — DB Index Rebuild",    status: "resolved",      duration: "2 hr" },
  { id: "i5", timestamp: "2025-04-02 18:22:00", severity: "high",     title: "Unauthorized Access Attempt — IP Blocked",    status: "resolved",      duration: "< 1 min" },
  { id: "i6", timestamp: "2025-04-05 09:00:00", severity: "medium",   title: "CPU Spike on Analytics Node — 94%",           status: "investigating", duration: "ongoing" },
];

export const patternRules: PatternRule[] = [
  { id: "pr1",  name: "Multiple SIM Acquisition",       category: "Telecom",      enabled: true,  triggeredTotal: 1247, triggeredToday: 6,  falsePositiveRate: 4.2,  precision: 91.3, recall: 87.4, lastTriggered: "8 min ago",  severity: "high",     conditions: "SIM count > 3 within 7 days AND same document" },
  { id: "pr2",  name: "Same-Day Hotel Switch",          category: "Hospitality",  enabled: true,  triggeredTotal: 892,  triggeredToday: 3,  falsePositiveRate: 6.8,  precision: 88.1, recall: 82.3, lastTriggered: "22 min ago", severity: "high",     conditions: "Hotel check-out AND check-in within 4 hours" },
  { id: "pr3",  name: "Large Cash Near Arrival",        category: "Finance",      enabled: true,  triggeredTotal: 2341, triggeredToday: 11, falsePositiveRate: 12.4, precision: 79.6, recall: 91.2, lastTriggered: "5 min ago",  severity: "critical", conditions: "Cash transaction > 5000 within 48h of border entry" },
  { id: "pr4",  name: "Vehicle Without Hotel",          category: "Transport",    enabled: true,  triggeredTotal: 567,  triggeredToday: 2,  falsePositiveRate: 18.9, precision: 72.4, recall: 68.7, lastTriggered: "1.1 hr ago", severity: "medium",   conditions: "Car rental active AND no hotel record AND > 3 days" },
  { id: "pr5",  name: "Shared IMEI Flagged Person",     category: "Telecom",      enabled: true,  triggeredTotal: 234,  triggeredToday: 1,  falsePositiveRate: 2.1,  precision: 96.8, recall: 94.3, lastTriggered: "3.2 hr ago", severity: "critical", conditions: "IMEI matches device used by watchlist subject" },
  { id: "pr6",  name: "Employer Absconding Pattern",    category: "Employment",   enabled: true,  triggeredTotal: 1891, triggeredToday: 8,  falsePositiveRate: 8.3,  precision: 85.2, recall: 79.6, lastTriggered: "14 min ago", severity: "high",     conditions: "Work permit active AND no employer event > 30 days" },
  { id: "pr7",  name: "Document Inconsistency",         category: "Borders",      enabled: true,  triggeredTotal: 445,  triggeredToday: 4,  falsePositiveRate: 3.7,  precision: 93.4, recall: 88.9, lastTriggered: "31 min ago", severity: "critical", conditions: "Document number mismatch across 2+ streams" },
  { id: "pr8",  name: "Coordinated Entry Pattern",      category: "Borders",      enabled: true,  triggeredTotal: 178,  triggeredToday: 2,  falsePositiveRate: 5.2,  precision: 90.1, recall: 85.7, lastTriggered: "45 min ago", severity: "critical", conditions: "3+ persons same nationality, same flight, same hotel" },
  { id: "pr9",  name: "High Rejection Rate Entity",     category: "Hospitality",  enabled: true,  triggeredTotal: 334,  triggeredToday: 1,  falsePositiveRate: 9.4,  precision: 83.7, recall: 76.2, lastTriggered: "2.4 hr ago", severity: "medium",   conditions: "Entity rejection rate > 20% in rolling 7-day window" },
  { id: "pr10", name: "Overstay Risk Prediction",       category: "Borders",      enabled: true,  triggeredTotal: 3421, triggeredToday: 14, falsePositiveRate: 15.6, precision: 76.3, recall: 88.4, lastTriggered: "3 min ago",  severity: "medium",   conditions: "Visa expiry < 7 days AND no exit record AND risk score > 60" },
  { id: "pr11", name: "Financial Structuring",          category: "Finance",      enabled: true,  triggeredTotal: 891,  triggeredToday: 5,  falsePositiveRate: 7.8,  precision: 87.9, recall: 83.1, lastTriggered: "19 min ago", severity: "high",     conditions: "Multiple transactions just below 10000 threshold" },
  { id: "pr12", name: "Social Media Threat Keywords",   category: "Intelligence", enabled: false, triggeredTotal: 234,  triggeredToday: 0,  falsePositiveRate: 22.3, precision: 61.4, recall: 71.8, lastTriggered: "2 days ago", severity: "medium",   conditions: "Post contains tier-1 keywords AND account linked to person" },
  { id: "pr13", name: "Customs TBML Pattern",           category: "Customs",      enabled: true,  triggeredTotal: 89,   triggeredToday: 3,  falsePositiveRate: 6.1,  precision: 89.2, recall: 84.7, lastTriggered: "27 min ago", severity: "critical", conditions: "Multiple import/export declarations with value inconsistency" },
  { id: "pr14", name: "Unregistered Marine Vessel",    category: "Maritime",     enabled: true,  triggeredTotal: 47,   triggeredToday: 1,  falsePositiveRate: 3.4,  precision: 92.1, recall: 86.3, lastTriggered: "1.4 hr ago", severity: "high",     conditions: "Vessel ID not found in licensed registry AND passenger count > 0" },
  { id: "pr15", name: "Suspicious Postal Frequency",   category: "Postal",       enabled: true,  triggeredTotal: 213,  triggeredToday: 4,  falsePositiveRate: 9.7,  precision: 82.4, recall: 77.9, lastTriggered: "33 min ago", severity: "medium",   conditions: "Same document > 5 packages received within 7 days" },
  { id: "pr16", name: "Tourism Overstay Indicator",    category: "Tourism",      enabled: false, triggeredTotal: 156,  triggeredToday: 0,  falsePositiveRate: 14.2, precision: 74.8, recall: 81.2, lastTriggered: "1 day ago",  severity: "medium",   conditions: "Tourist visa AND attraction visits stopped > 5 days before visa expiry" },
];
